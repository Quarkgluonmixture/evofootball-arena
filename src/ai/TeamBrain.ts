import { dist } from '../utils/vec';
import { aerialSense } from '../sim/mechanics';
import type { Match } from '../sim/Match';
import type { Team } from '../sim/Team';
import type { Role, TeamMode } from '../sim/types';

/**
 * TeamBrain — picks one tactical mode for the whole team and hands out
 * coordination assignments (who presses, who marks whom) so that players
 * don't all chase the ball. Runs every TEAM_AI_INTERVAL and immediately
 * after possession changes.
 *
 * Mode logic (genes in brackets):
 *  - we have the ball, just won it, ball deep       -> CounterAttack [counterAttackBias]
 *  - we have the ball in their half                 -> Attack
 *  - we have the ball in our half                   -> BuildUp
 *  - they have the ball, we want it back NOW        -> Press [pressIntensity]
 *  - they have the ball, we hold shape              -> Defend
 *  - dead ball / kickoff                            -> ResetShape
 */
export function updateTeamBrain(team: Team, match: Match): void {
  // Restarts are live for coordination: defenders keep marks and pressers
  // crowd the edge of the clearance circle while the taker walks over.
  if (match.phase !== 'playing' && match.phase !== 'restart') {
    team.mode = 'ResetShape';
    team.chasers.clear();
    team.marks.clear();
    team.runners.clear();
    return;
  }

  const g = team.genome;
  const ball = match.ball;
  const possession = match.possessionSide; // -1 while the ball is loose
  const prevMode = team.mode;

  let mode: TeamMode;
  if (possession === team.side) {
    const sinceWin = match.simTime - team.possessionGainedAt;
    const ballLocalX = team.localX(ball.pos.x);
    if (sinceWin < 3.0 && g.counterAttackBias > 0.35 && ballLocalX < 18) {
      mode = 'CounterAttack';
    } else if (ballLocalX > 4) {
      mode = 'Attack';
    } else {
      mode = 'BuildUp';
    }
  } else if (possession === 1 - team.side) {
    // Press appetite: gene + where the ball is (pressing high is more attractive)
    // + hysteresis so the mode doesn't flicker.
    const ballLocalX = team.localX(ball.pos.x);
    const pressScore =
      g.pressIntensity +
      (ballLocalX > 0 ? 0.18 : -0.1) +
      (prevMode === 'Press' ? 0.08 : 0);
    mode = pressScore > 0.62 ? 'Press' : 'Defend';
  } else {
    // Loose ball: keep the previous shape decision (brief window anyway).
    mode = prevMode === 'ResetShape' ? 'Defend' : prevMode;
  }

  team.modeTime = mode === prevMode ? team.modeTime : 0;
  team.mode = mode;

  assignChasers(team, match);
  assignMarks(team, match);
  assignRunners(team, match);
}

/**
 * Runners: 1–2 attackers licensed to sprint in behind the defensive line
 * while we have the ball — the off-ball movement that makes through balls
 * possible. Capped like chasers so the team never dissolves into everyone
 * running; the carrier and keeper are never runners.
 */
const RUN_ROLE_W: Record<Role, number> = { GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };

function assignRunners(team: Team, match: Match): void {
  team.runners.clear();
  if (match.possessionSide !== team.side) return;
  const carrier = match.ball.owner;
  // Corner (Phase 28): flood the box — the three best headers of the ball
  // (aerial sense lives with the DFs and the ST) attack the area while the
  // taker walks over, so the cross has someone to find.
  if (match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side) {
    const scored = team.players
      .filter((p) => p.role !== 'GK' && p.gid !== match.restart!.takerGid && !p.sentOff)
      .map((p) => ({ p, s: aerialSense(p) }))
      .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
    for (const { p } of scored.slice(0, 3)) team.runners.add(p.index);
    return;
  }
  // A second runner for fast/direct sides: counters and high-tempo teams.
  const count = team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1;
  const scored = team.players
    .filter((p) => p.role !== 'GK' && p !== carrier && !p.sentOff)
    .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))
    .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
  for (const { p } of scored.slice(0, count)) team.runners.add(p.index);
}

/**
 * Chasers: outfield players allowed to hunt the ball. Everyone else keeps
 * shape/marks. Count scales with pressing: 1 base, +1 in Press mode, +1 for
 * extreme pressIntensity.
 */
function assignChasers(team: Team, match: Match): void {
  team.chasers.clear();
  const possession = match.possessionSide;
  const weOwn = possession === team.side;
  if (weOwn) return; // no chasing our own carrier
  // The opposing keeper has it in their HANDS (Phase 28.1 → 29.1): they are
  // unchallengeable, so pressing is wasted legs. 28.1 kept ONE shadow at the
  // bubble's edge to cut the short outlet — live play read it as a man
  // camped in the keeper's face (reported twice), so now NOBODY presses a
  // held ball: everyone marks up for the distribution, like a goal kick.
  const owner = match.ball.owner;
  const gkHolding = owner !== null && owner.role === 'GK' && owner.gkHoldTimer > 0;

  let count = 1;
  if (gkHolding) {
    count = 0;
  } else {
    if (team.mode === 'Press') count += 1;
    if (team.genome.pressIntensity > 0.78) count += 1;
    if (possession === -1) count = Math.min(count, 2);
  }
  // Dead ball (Phase 28.3): you can't win a ball nobody may touch — ONE
  // player closes the taker down (blocking the short option, real-football
  // style); the old pack of 2–3 stood pinned at the corner-flag clearance
  // circle jogging on the spot. Goal kicks (Phase 29): ZERO — the taker is
  // the keeper deep in their own box; charging them is pure wasted legs,
  // so everyone marks up for the distribution instead.
  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;

  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
  const byDist = [...outfield].sort(
    (a, b) => dist(a.pos, match.ball.pos) - dist(b.pos, match.ball.pos) || a.index - b.index,
  );
  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
}

/**
 * Marks: each non-chasing outfielder picks the most dangerous unmarked
 * opponent (deepest into our half) within range. Greedy and deterministic.
 */
function assignMarks(team: Team, match: Match): void {
  team.marks.clear();
  if (match.possessionSide === team.side) return;

  const opp = match.teams[1 - team.side];
  const carrier = match.ball.owner;
  // Sort by how deep they are in OUR half: smaller localX for them = deeper
  // for us. (A numerically identical pre-sort used to run first; this
  // comparator is a total order — index tiebreak — so one sort decides fully.)
  // The restart taker is not a threat (Phase 29.1): they're pinned to a dead
  // ball the clearance circle already guards, and the assigned chaser blocks
  // the short option — a marker sent there too made TWO men stand uselessly
  // at the corner flag while the box went a body short.
  const takerGid = match.restart?.takerGid;
  const threats = opp.players
    .filter((o) => o.role !== 'GK' && o !== carrier && !o.sentOff && o.gid !== takerGid)
    .sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);

  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
  const used = new Set<number>();
  for (const threat of threats) {
    let best: { idx: number; d: number } | null = null;
    for (const p of free) {
      if (used.has(p.index)) continue;
      // Width discipline (Phase 28.4): a WIDE winger does not abandon the
      // flank to join a central pile-up — central threats belong to the
      // spine. This is the user-diagnosed collapse: turnover in midfield →
      // wingers tuck in → six bodies in one corridor → playground scramble.
      if (p.role === 'WG' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;
      const d = dist(p.pos, threat.pos);
      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
    }
    if (best) {
      used.add(best.idx);
      team.marks.set(best.idx, threat.index);
    }
  }
}
