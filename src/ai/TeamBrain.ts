import { dist } from '../utils/vec';
import { BOX_DEPTH, BOX_WIDTH, HALF_L } from '../sim/constants';
import { cornerKeyZone, formationSpot } from './formations';
import { ballLanding } from './perception';
import { aerialSense } from '../sim/mechanics';
import type { Match } from '../sim/Match';
import type { Player } from '../sim/Player';
import type { Team } from '../sim/Team';
import type { CornerRoutine, RestartState, Role, TeamMode } from '../sim/types';

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
    team.arriver = null;
    team.keeperUp = false;
    return;
  }

  // 门将上前 (Phase 35): trailing in the dying minutes, our own attacking
  // corner — the keeper abandons his goal for the box. The license lives
  // exactly as long as the corner does (setup, hand-off, flight — the
  // 31.9 lesson via team.cornerCrash); the moment it dies he sprints home.
  team.keeperUp =
    team.mentality.urgency > 0.5 &&
    match.half === 2 &&
    match.minute() >= 89 &&
    ((match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side) ||
      (team.cornerCrash !== null && match.simTime < team.cornerCrash.until));
  if (team.keeperUp && !team.keeperUpAnnounced) {
    team.keeperUpAnnounced = true;
    match.pushEvent('info', team.side, `🧤 ${team.goalkeeper.name} is UP for the corner!`);
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
  team.arriver = null;
  // The overlap license survives its own release ball's FLIGHT (the corner
  // lesson, 31.9): the kick clears ball.owner, and a license torn up at
  // that instant strands the runner — and the arriving ball — mid-flight.
  const keepOverlap =
    team.overlapper !== null &&
    match.pendingPass !== null &&
    match.pendingPass.side === team.side &&
    match.pendingPass.targetGid === team.players[team.overlapper].gid;
  if (!keepOverlap) team.overlapper = null;
  if (match.possessionSide !== team.side) return;
  const carrier = match.ball.owner;
  // Corner (Phase 28): flood the box — the three best headers of the ball
  // (aerial sense lives with the DFs and the ST) attack the area while the
  // taker walks over, so the cross has someone to find. The licenses hold
  // THROUGH the hand-off and the flight (Phase 31.9, team.cornerCrash):
  // the restart clears before the kick, and re-licensing generically at
  // that instant pulled every crasher out of the box mid-delivery.
  const liveCorner = match.phase === 'restart' && match.restart?.kind === 'corner' && match.restart.side === team.side;
  const heldCrash = !liveCorner && team.cornerCrash !== null && match.simTime < team.cornerCrash.until;
  if (team.cornerCrash && match.simTime >= team.cornerCrash.until) team.cornerCrash = null;
  if (heldCrash) {
    // Personnel locked at hand-off (31.9): re-scoring here swapped crashers
    // for whoever happened to stand better mid-flight (once the weak-side
    // winger 27m away) and remapped every crash spot under their feet.
    for (const idx of team.cornerCrash!.runners) {
      if (!team.players[idx].sentOff && team.players[idx] !== carrier) team.runners.add(idx);
    }
    const arr = team.cornerCrash!.arriver;
    if (arr !== null && !team.players[arr].sentOff && team.players[arr] !== carrier) team.arriver = arr;
    return;
  }
  if (liveCorner) {
    // Aerial sense × REACHABILITY (Phase 31): the DF is the best header in
    // the game, but the rest-defence clamp parks him ~50m away — a licensed
    // crasher who cannot arrive leaves the primary zone empty (the trace
    // that cracked the 0%-duel-wins corner: the best spots had nobody).
    const flag = match.restart!.pos;
    const routine = match.restart!.routine;
    const takerGid = match.restart!.takerGid;
    // Short/arc routines trade a crasher for the receiver (Phase 31): on a
    // five-outfielder team, three crashers plus the taker leave exactly ONE
    // arriver candidate — usually the worst-placed body on the pitch, and
    // the routine's whole target zone went unattended (probed: the "short"
    // corner crossed 30/30 because the short receiver stood 40m away).
    const crashCount = routine === 'short' || routine === 'arcCutback' ? 2 : 3;
    const scored = team.players
      .filter((p) => p.role !== 'GK' && p.gid !== takerGid && p !== carrier && !p.sentOff)
      .map((p) => ({ p, s: aerialSense(p) - dist(p.pos, flag) / 45 }))
      .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
    for (const { p } of scored.slice(0, crashCount)) team.runners.add(p.index);
    // Routine extra license (Phase 31): the SHORT receiver or the ARC
    // arriver — one more purposeful body, routed by the executor to the
    // routine's key zone. Crash spots for the runners come from the
    // routine's table (executor, cornerCrashSpots).
    if (routine === 'short' || routine === 'arcCutback') {
      const zone = cornerKeyZone(routine, team.attackDir, flag.y);
      let pick: Player | null = null;
      let bd = Infinity;
      for (const p of team.players) {
        if (p.role === 'GK' || p.sentOff || p.gid === takerGid || p === carrier) continue;
        if (team.runners.has(p.index)) continue;
        const d = dist(p.pos, zone);
        if (d < bd) {
          bd = d;
          pick = p;
        }
      }
      if (pick) team.arriver = pick.index;
    }
    return;
  }
  // A second runner for fast/direct sides: counters and high-tempo teams.
  // The late chase (Phase 35) throws one MORE body forward — this is where
  // "everyone forward" physically lives, and where the counters it
  // concedes are born (the chase must cost).
  const count =
    (team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +
    (team.mentality.urgency > 0.65 ? 1 : 0);
  const scored = team.players
    .filter((p) => p.role !== 'GK' && p !== carrier && !p.sentOff)
    .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))
    .sort((a, b) => b.s - a.s || a.p.index - b.p.index);
  for (const { p } of scored.slice(0, count)) team.runners.add(p.index);

  // The ARRIVING runner (Phase 31): ball deep and wide in the attacking
  // third — license ONE late body onto the edge-of-box arc so the byline
  // cutback has someone to find. The MF is the natural arriver (the late
  // midfield run is football's canonical cutback target); the weak-side
  // winger stands in when the MF is the carrier, gone, or already running.
  const ballPos = match.ball.pos;
  const ballLocalX = team.localX(ballPos.x);
  // Trigger EARLY (ball entering the wide attacking channel, not already at
  // the byline) so the arriver's late run is underway by the time the
  // carrier reaches the pull-back zone — an arriver licensed at the byline
  // arrives after the moment has gone (failure mode 14: check who's
  // attacking the delivery before tuning the delivery).
  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {
    const eligible = (p: Player | undefined): p is Player =>
      p !== undefined && p !== carrier && !p.sentOff && !team.runners.has(p.index);
    const mf = team.players[2];
    const weakWG = ballPos.y > 0 ? team.players[3] : team.players[4];
    const pick = eligible(mf) ? mf : eligible(weakWG) ? weakWG : null;
    if (pick) team.arriver = pick.index;
  }

  // 套边 (Phase 34): a WIDE carrier confronted in the attacking half pulls
  // one trailing teammate around the OUTSIDE. Wide-play genes look for it;
  // narrow sides leave the lane to the carrier's own drive.
  if (
    team.overlapper === null && // a flight-preserved license stands
    carrier &&
    carrier.role !== 'GK' &&
    Math.abs(carrier.pos.y) > 10 &&
    team.localX(carrier.pos.x) > 0 &&
    team.genome.attackingWidth > 0.3
  ) {
    const cLocal = team.localX(carrier.pos.x);
    const confronted = match.teams[1 - team.side].players.some(
      (o) =>
        !o.sentOff &&
        dist(o.pos, carrier.pos) < 5.5 &&
        match.teams[1 - team.side].localX(o.pos.x) < match.teams[1 - team.side].localX(carrier.pos.x) + 0.5,
    );
    if (confronted) {
      let pick: Player | null = null;
      let bd = Infinity;
      for (const p of team.players) {
        if (p.role === 'GK' || p === carrier || p.sentOff) continue;
        if (team.runners.has(p.index) || team.arriver === p.index || p.stamina < 0.3) continue;
        // Same wing (or central enough to swing out); trailing but reachable.
        if (Math.sign(p.pos.y) !== Math.sign(carrier.pos.y) && Math.abs(p.pos.y) > 8) continue;
        const behind = cLocal - team.localX(p.pos.x);
        if (behind < 1 || behind > 24) continue;
        const d = dist(p.pos, carrier.pos);
        if (d < bd) {
          bd = d;
          pick = p;
        }
      }
      if (pick) team.overlapper = pick.index;
    }
  }
}

/**
 * Corner routine choice (Phase 31): once the defensive picture forms
 * (~0.6s into the setup), the taking side reads the openness of each
 * routine's KEY zone and commits. Deterministic — pure state, fixed
 * iteration order, strict improvement. The short option is discounted:
 * it's the pressure valve when the box is packed, not the default.
 */
export function pickCornerRoutine(match: Match, r: RestartState): CornerRoutine {
  const team = match.teams[r.side];
  const defenders = match.teams[1 - r.side].players;
  const order: CornerRoutine[] = ['farPost', 'nearPost', 'arcCutback', 'short'];
  let best: CornerRoutine = 'farPost';
  let bestScore = -Infinity;
  for (const routine of order) {
    const zone = cornerKeyZone(routine, team.attackDir, r.pos.y);
    let nearest = Infinity;
    for (const d of defenders) {
      if (d.sentOff || d.role === 'GK') continue;
      const dd = dist(d.pos, zone);
      if (dd < nearest) nearest = dd;
    }
    let score = Math.min(nearest, 10) / 10;
    if (routine === 'short') score *= 0.55;
    // The arc strike is the best-converting routine (probed: ~2× the post
    // deliveries) — when its zone is comparably open, take it.
    if (routine === 'arcCutback') score += 0.08;
    if (score > bestScore) {
      bestScore = score;
      best = routine;
    }
  }
  return best;
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
  // gkDistributing too (31.9): the shape-wait's 0.25s re-arm quanta left
  // timer==0 gaps where a chaser got assigned, charged, and was expelled
  // when the hold re-armed — the "疯狂抽动逼抢" flicker.
  const gkHolding = owner !== null && owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing);

  let count = 1;
  if (gkHolding) {
    count = 0;
  } else {
    // One presser, two for a pressing side — NEVER three (Phase 31, user
    // report): real football sends one or two at the ball; everyone else
    // marks or holds the shape. The extreme-pressIntensity third chaser
    // stacked onto Press mode just re-created the swarm.
    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;
    // Loose ball = a DUEL, not a scrum (Phase 30.5): one contester per team.
    // At 2 per team every midfield 50/50 pulled four sprinters plus the
    // support/marking crowd already there, and the won-tackle squirt re-fed
    // the same pile — the reported "乱成一锅粥" loop.
    if (possession === -1) count = Math.min(count, 1);
  }
  // Dead ball (Phase 28.3): you can't win a ball nobody may touch — ONE
  // player closes the taker down (blocking the short option, real-football
  // style); the old pack of 2–3 stood pinned at the corner-flag clearance
  // circle jogging on the spot. Goal kicks (Phase 29): ZERO — the taker is
  // the keeper deep in their own box; charging them is pure wasted legs,
  // so everyone marks up for the distribution instead.
  if (match.phase === 'restart') count = match.restart?.kind === 'goalKick' ? 0 : 1;

  const outfield = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
  // ATTACK THE DROP (Phase 32.1, user report "大脚高球也应该能被解围"): an
  // opponent's lofted delivery in flight is chased at its LANDING, by
  // whoever gets there fastest — long balls aim at open men by design, so
  // the by-current-ball-distance pick sent a presser who could never
  // arrive (probed: nearest defender averaged 7.6m off the descent, 5%
  // aerial contests, and the hoof was uncontestable in practice).
  // interceptBall already projects the parabola; the chaser just needed
  // to be the right man.
  const pass = match.pendingPass;
  const ball = match.ball;
  if (
    count > 0 && pass && pass.side !== team.side && ball.owner === null &&
    (ball.z > 0.5 || ball.vz > 2)
  ) {
    const land = ballLanding(ball);
    // LONG hoofs into open field only: an unscoped first cut attacked the
    // landing of every cross, corner and chip too — one extra converging
    // defender on every box delivery re-buried the 31.9 headed game and
    // cost 0.77 goals/match at n=568. Box landings belong to the marking
    // scheme; short chips to the through-ball economy.
    const flight = Math.hypot(ball.vel.x, ball.vel.y) * land.t;
    const inOurBox =
      Math.abs(land.y) < BOX_WIDTH / 2 && team.localX(land.x) < -(HALF_L - BOX_DEPTH);
    if (flight > 12 && !inOurBox) {
      let best: Player | null = null;
      let bestT = Infinity;
      for (const p of outfield) {
        const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);
        if (t < bestT) {
          bestT = t;
          best = p;
        }
      }
      if (best) {
        team.chasers.add(best.index);
        return;
      }
    }
  }
  const byDist = [...outfield].sort(
    (a, b) => dist(a.pos, match.ball.pos) - dist(b.pos, match.ball.pos) || a.index - b.index,
  );
  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);
}

/**
 * Marks: each non-chasing outfielder picks the most dangerous unmarked
 * opponent (deepest into our half) within range. Greedy and deterministic.
 *
 * Marking SCHEME (Phase 30, `team.style.scheme`): 'man' marks every ranged
 * threat (the behavior every phase before 30 shipped with); 'zonal' marks a
 * threat only when it ENTERS A DEFENDER'S ZONE (near that defender's
 * defending spot) or our penalty box. Zone defenders otherwise hold the
 * sliding spots — and crucially, engaging a zone runner drags its defender
 * OFF the spot lattice, which is how attacks open a zone up (a first cut
 * that never engaged parked an impenetrable 5-body wall: 3 shots/match
 * conceded, and the league's shot volume collapsed).
 */
function assignMarks(team: Team, match: Match): void {
  team.marks.clear();
  if (match.possessionSide === team.side) return;

  const zonal = team.style.scheme === 'zonal';
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
  const inOurBox = (x: number, y: number): boolean =>
    team.localX(x) < -HALF_L + BOX_DEPTH && Math.abs(y) < BOX_WIDTH / 2;
  const threats = opp.players
    .filter((o) => o.role !== 'GK' && o !== carrier && !o.sentOff && o.gid !== takerGid)
    .sort((a, b) => opp.localX(b.pos.x) - opp.localX(a.pos.x) || a.index - b.index);

  const free = team.players.filter((p) => p.role !== 'GK' && !team.chasers.has(p.index) && !p.sentOff);
  // Zonal: each free defender's zone is centered on their DEFENDING spot.
  const zones = zonal ? new Map(free.map((p) => [p.index, formationSpot(p, team, match.ball, false)])) : null;
  const used = new Set<number>();
  for (const threat of threats) {
    const boxThreat = inOurBox(threat.pos.x, threat.pos.y);
    let best: { idx: number; d: number } | null = null;
    for (const p of free) {
      if (used.has(p.index)) continue;
      // Width discipline (Phase 28.4): a WIDE winger does not abandon the
      // flank to join a central pile-up — central threats belong to the
      // spine. This is the user-diagnosed collapse: turnover in midfield →
      // wingers tuck in → six bodies in one corridor → playground scramble.
      if (p.role === 'WG' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;
      // Zonal: outside our box, only the defender whose ZONE the threat
      // entered may engage — everyone else keeps the lattice.
      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;
      const d = dist(p.pos, threat.pos);
      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };
    }
    if (best) {
      used.add(best.idx);
      team.marks.set(best.idx, threat.index);
    }
  }
}
