import { dist } from '../utils/vec';
import type { Match } from '../sim/Match';
import type { Team } from '../sim/Team';
import type { TeamMode } from '../sim/types';

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

  let count = 1;
  if (team.mode === 'Press') count += 1;
  if (team.genome.pressIntensity > 0.78) count += 1;
  if (possession === -1) count = Math.min(count, 2);

  const outfield = team.players.filter((p) => p.role !== 'GK');
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
  const threats = opp.players
    .filter((o) => o.role !== 'GK' && o !== carrier)
    .sort((a, b) => team.localX(b.pos.x) * -1 - team.localX(a.pos.x) * -1 || a.index - b.index);
  // Sort by how deep they are in OUR half: smaller localX for them = deeper for us.
  threats.sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);

  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index));
  const used = new Set<number>();
  for (const threat of threats) {
    let best: { idx: number; d: number } | null = null;
    for (const p of free) {
      if (used.has(p.index)) continue;
      const d = dist(p.pos, threat.pos);
      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
    }
    if (best) {
      used.add(best.idx);
      team.marks.set(best.idx, threat.index);
    }
  }
}
