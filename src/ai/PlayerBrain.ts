import { clamp, clamp01 } from '../utils/math';
import { dist, dot, norm, sub } from '../utils/vec';
import { HALF_L, HALF_W } from '../sim/constants';
import { defenderLineLocalX } from './formations';
import type { Match } from '../sim/Match';
import type { Player } from '../sim/Player';
import type { Team } from '../sim/Team';
import type { UtilityScore } from '../sim/types';
import {
  canInterceptPass, interceptBall, laneOpenness, opennessOf, pressureAt, spaceAhead, timeToPoint,
} from './perception';

/**
 * PlayerBrain — utility AI. Each decision tick the player scores a set of
 * candidate actions; the best one wins. Every score is a product/sum of
 * normalized factors with the gene multipliers spelled out, and the top
 * candidates are stored on the action for the debug panel.
 *
 * Kicks (Pass/Shoot/Clear) execute immediately at decision time; movement
 * actions are executed continuously by actionExecutor until the next tick.
 */
export function decidePlayer(p: Player, match: Match): void {
  const team = match.teams[p.side];
  const opp = match.teams[1 - p.side];

  // Dead-ball restart: the taker walks to the spot (chasing the stationary
  // ball); everyone else runs their normal logic against the dead ball —
  // defenders reshape and mark, attackers hold width around the spot.
  if (match.phase === 'restart' && match.restart) {
    if (p.gid === match.restart.takerGid) {
      p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 1, why: 'taking the restart' }] };
      return;
    }
  } else if (match.phase !== 'playing') {
    p.action = { type: 'MoveToFormationSpot', scores: [] };
    return;
  }

  if (match.ball.owner === p) {
    decideCarrier(p, team, opp, match);
    return;
  }
  if (p.role === 'GK') {
    decideGoalkeeper(p, team, match);
    return;
  }
  decideOffBall(p, team, opp, match);
}

/* ------------------------------------------------------------------ */
/* Ball carrier                                                        */
/* ------------------------------------------------------------------ */

function decideCarrier(p: Player, team: Team, opp: Team, match: Match): void {
  const g = team.genome;
  const W = team.policy; // utility weights — DEFAULT_POLICY unless a wildcard carries learned ones
  const ball = match.ball;
  // Restart first touch must be a kick (kick-in/corner/goal kick) — dribbling
  // straight off the spot would break the dead-ball fiction.
  const mustKick = match.restartKickGid === p.gid;
  if (mustKick) match.restartKickGid = null;
  const cands: UtilityScore[] = [];
  const pressure = pressureAt(p.pos, opp.players);
  const goal = team.oppGoal();
  const dGoal = dist(p.pos, goal);
  const localX = team.localX(p.pos.x);

  // --- Shoot: worth it when the chance quality (xG) is decent; shootBias
  // scales it from "only tap-ins" (0) to "shoot on sight" (1).
  if (dGoal < 34 && p.kickCooldown <= 0) {
    const q = match.shotQuality(p);
    // NOTE: finishing deliberately does NOT raise shot utility — it pays off
    // in execution (tighter spread in mechanics.performShot), not in shot
    // selection. Coupling it to utility made finishers take worse shots and
    // turned the attribute into a net negative.
    let s = q * (W.shootBase + g.shootBias * W.shootGene);
    if (team.mode === 'Attack' || team.mode === 'CounterAttack') s *= W.shootModeMul;
    s *= 1 - pressure * W.shootPressurePen;
    cands.push({ action: 'Shoot', score: s, why: `xG ${q.toFixed(2)} · shootBias ${g.shootBias.toFixed(2)}` });
  }

  // --- Pass: score every teammate, keep the best.
  let bestMate: Player | null = null;
  let bestPass = 0;
  let bestLane = 0;
  let bestOpen = 0;
  if (p.kickCooldown <= 0) {
    for (const mate of team.players) {
      if (mate === p) continue;
      const lane = laneOpenness(p.pos, mate.pos, opp.players);
      const open = opennessOf(mate, opp.players);
      const d = dist(p.pos, mate.pos);
      // Forward progress of the pass, normalized to ±1 over 30m.
      const gain = clamp01((team.localX(mate.pos.x) - localX + 30) / 60) * 2 - 1;

      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
      if (gain > 0) s *= 1 + gain * (W.passFwdBase + g.riskTolerance * W.passFwdRisk);
      else s *= 1 + gain * W.passBackPen; // mild penalty for going backward
      // Contested forward balls are gated by riskTolerance.
      if (gain > 0.15 && lane < 0.4) s *= 0.35 + g.riskTolerance * 0.65;
      if (team.mode === 'CounterAttack' && gain > 0) s *= 1.3;
      if (team.mode === 'BuildUp' && gain < 0) s *= 1.1; // patient recycling is fine
      s *= 0.7 + g.passBias * 0.75;
      s *= 0.85 + g.tempo * 0.3;
      if (d > 32) s *= 0.5;
      if (d < 5) s *= 0.75;
      if (mate.role === 'GK') s *= 0.5; // back-passes to keeper are a last resort

      if (s > bestPass) {
        bestPass = s;
        bestMate = mate;
        bestLane = lane;
        bestOpen = open;
      }
    }
    if (pressure > 0.5) bestPass *= W.passOutletMul; // pass is the pressure outlet
    // The why string is built once for the winner — building it per improved
    // candidate inside the loop was pure string churn (toFixed × 3 each time).
    if (bestMate) {
      cands.push({
        action: 'Pass',
        score: bestPass,
        why: `to ${bestMate.name} · lane ${bestLane.toFixed(2)} · open ${bestOpen.toFixed(2)} · passBias ${g.passBias.toFixed(2)}`,
      });
    }
  }

  // --- Through ball: feed an assigned runner IN THEIR PATH, not to feet.
  // Scored by the lane to the projected point and how far beyond the last
  // defender it lands; riskTolerance gates it (direct sides live on these).
  let bestRunner: Player | null = null;
  let bestThrough = 0;
  let bestBehind = 0;
  let bestThroughLane = 0;
  if (p.kickCooldown <= 0) {
    const line = defenderLineLocalX(team, opp.players);
    for (const mate of team.players) {
      if (mate === p || mate.action.type !== 'MakeRun') continue;
      const flight = dist(p.pos, mate.pos) / 18;
      const point = {
        x: clamp(mate.pos.x + mate.vel.x * flight * 1.6, -HALF_L + 2, HALF_L - 2),
        y: clamp(mate.pos.y + mate.vel.y * flight * 1.6, -HALF_W + 2, HALF_W - 2),
      };
      if (team.localX(point.x) < localX + 5) continue; // must genuinely penetrate
      const lane = laneOpenness(p.pos, point, opp.players);
      const behind = clamp01((team.localX(point.x) - line) / 10);
      let s = W.throughBase + lane * W.throughOpenW + behind * W.throughBehindW;
      s *= 0.45 + g.riskTolerance * 0.85;
      s *= 0.85 + g.tempo * 0.3;
      if (s > bestThrough) {
        bestThrough = s;
        bestRunner = mate;
        bestThroughLane = lane;
        bestBehind = behind;
      }
    }
    if (bestRunner) {
      cands.push({
        action: 'ThroughBall',
        score: bestThrough,
        why: `into ${bestRunner.name}'s run · lane ${bestThroughLane.toFixed(2)} · behind ${bestBehind.toFixed(2)} · risk ${g.riskTolerance.toFixed(2)}`,
      });
    }
  }

  // --- Dribble: needs space ahead; dribbleBias makes it a first choice.
  if (!mustKick) {
    const toGoal = norm(sub(goal, p.pos));
    const space = spaceAhead(p, toGoal, opp.players);
    let sD = (W.dribbleBase + space * W.dribbleSpaceW) * (W.dribbleGeneBase + g.dribbleBias * W.dribbleGeneW);
    sD *= 1 - pressure * W.dribblePressurePen;
    if (team.mode === 'CounterAttack') sD *= 1.25;
    cands.push({ action: 'Dribble', score: sD, why: `space ${space.toFixed(2)} · dribbleBias ${g.dribbleBias.toFixed(2)}` });
  }

  // --- Clear: panic button deep in our half; risk-averse teams use it more.
  if (localX < -18 && p.kickCooldown <= 0) {
    let sC = (W.clearBase + pressure * W.clearPressureW) * (1.25 - g.riskTolerance * 0.8);
    if (p.role === 'GK') sC *= 1.35;
    cands.push({ action: 'ClearBall', score: sC, why: `pressure ${pressure.toFixed(2)} · risk-averse ${(1 - g.riskTolerance).toFixed(2)}` });
  }

  cands.sort((a, b) => b.score - a.score);
  // Degenerate fallback (kick still on cooldown): carry the ball as today.
  if (cands.length === 0) {
    p.action = { type: 'Dribble', scores: [] };
    return;
  }
  const top = cands[0];
  const scores = cands.slice(0, 4);

  // Kicks resolve instantly; movement actions persist until next tick.
  switch (top.action) {
    case 'Pass':
      p.action = { type: 'Pass', targetIdx: bestMate!.gid, scores };
      match.performPass(p, bestMate!);
      break;
    case 'ThroughBall':
      p.action = { type: 'ThroughBall', targetIdx: bestRunner!.gid, scores };
      match.performThroughBall(p, bestRunner!);
      break;
    case 'Shoot':
      p.action = { type: 'Shoot', scores };
      match.performShot(p);
      break;
    case 'ClearBall':
      p.action = { type: 'ClearBall', scores };
      match.performClear(p);
      break;
    default:
      p.action = { type: 'Dribble', scores };
      break;
  }
}

/* ------------------------------------------------------------------ */
/* Goalkeeper                                                          */
/* ------------------------------------------------------------------ */

function decideGoalkeeper(p: Player, team: Team, match: Match): void {
  const ball = match.ball;
  const ownGoal = team.ownGoal();

  // Shot incoming at our goal -> drop everything and save.
  const shot = match.pendingShot;
  if (
    shot && !shot.resolved && shot.side !== p.side && ball.owner === null &&
    dot(ball.vel, sub(ownGoal, ball.pos)) > 0
  ) {
    p.action = { type: 'GoalkeeperSave', scores: [{ action: 'GoalkeeperSave', score: 1, why: 'shot incoming' }] };
    return;
  }

  // Loose ball near our goal that we can claim first.
  if (ball.owner === null && dist(ball.pos, ownGoal) < 15) {
    const sol = interceptBall(p, ball);
    // Running min over the same values in the same order — the old
    // filter/map/spread allocated two arrays per GK decision.
    let rivalT = Infinity;
    for (const q of match.allPlayers) {
      if (q === p) continue;
      const t = timeToPoint(q, sol.point);
      if (t < rivalT) rivalT = t;
    }
    if (sol.tMe < rivalT) {
      p.action = { type: 'ChaseBall', scores: [{ action: 'ChaseBall', score: 0.9, why: 'claim loose ball in box' }] };
      return;
    }
  }

  p.action = {
    type: 'GoalkeeperPosition',
    scores: [{ action: 'GoalkeeperPosition', score: 0.6, why: `keeperAggression ${team.genome.keeperAggression.toFixed(2)}` }],
  };
}

/* ------------------------------------------------------------------ */
/* Off-ball outfielders                                                */
/* ------------------------------------------------------------------ */

function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {
  const g = team.genome;
  const W = team.policy;
  const ball = match.ball;
  const possession = match.possessionSide;
  const cands: UtilityScore[] = [];
  let markTarget: number | undefined;
  let receiveFlag = false;

  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;

  if (possession === team.side) {
    // ----- We have the ball -----
    const pass = match.pendingPass;
    if (pass && pass.side === team.side && pass.targetGid === p.gid) {
      cands.push({ action: 'ReceivePass', score: 1.2, why: 'pass is coming to me' });
      receiveFlag = true;
    }
    const carrier = ball.owner;
    if (carrier && carrier !== p) {
      const d = dist(p.pos, carrier.pos);
      const roleBonus = p.role === 'ST' ? 0.12 : p.role === 'WG' ? 0.1 : p.role === 'MF' ? 0.06 : 0;
      const modeMul = team.mode === 'Attack' || team.mode === 'CounterAttack' ? 1.2 : team.mode === 'BuildUp' ? 1.0 : 0.6;
      let s = (W.supportBase + clamp01(1 - d / 30) * W.supportProxW + roleBonus) * modeMul;
      if (tired) s *= 0.6; // conserve energy: prefer holding shape
      cands.push({ action: 'SupportBallCarrier', score: s, why: `dist ${d.toFixed(0)}m · mode ${team.mode}` });
    }
    // Assigned runner: sprint in behind and drag the line — the movement a
    // through ball needs. Tired legs sit the run out.
    if (team.runners.has(p.index) && carrier && carrier !== p) {
      let s = W.runScore;
      if (tired) s *= 0.6;
      cands.push({ action: 'MakeRun', score: s, why: 'licensed run in behind' });
    }
    cands.push({
      action: 'MoveToFormationSpot',
      score: W.formationBase + (tired ? 0.2 : 0),
      why: tired ? 'keeping shape (stamina conservation)' : 'keeping shape',
    });
  } else {
    // ----- They have the ball (or it's loose) -----
    // Cut out a pass in flight.
    if (ball.owner === null && match.pendingPass && match.pendingPass.side !== team.side) {
      const inter = canInterceptPass(p, ball);
      if (inter.ok) cands.push({ action: 'InterceptPass', score: W.interceptScore, why: 'can reach the passing lane first' });
    }
    // Chase only if the TeamBrain assigned us — this is what stops ball-swarming.
    if (team.chasers.has(p.index)) {
      const s = W.chaseBase + g.pressIntensity * 0.15;
      cands.push({ action: 'ChaseBall', score: s, why: `assigned presser · pressIntensity ${g.pressIntensity.toFixed(2)}` });
    } else if (possession === -1) {
      // Loose ball: closest unassigned player may react a little.
      const d = dist(p.pos, ball.pos);
      if (d < 10) cands.push({ action: 'ChaseBall', score: 0.4 * (1 - d / 10), why: 'loose ball nearby' });
    }
    const mark = team.marks.get(p.index);
    if (mark !== undefined) {
      markTarget = mark;
      cands.push({
        action: 'MarkOpponent',
        score: W.markBase + g.markingAggression * 0.15,
        why: `mark ${opp.players[mark].name} · aggression ${g.markingAggression.toFixed(2)}`,
      });
    }
    cands.push({
      action: 'MoveToFormationSpot',
      score: 0.42 + g.defensiveCompactness * 0.08,
      why: `hold block · compactness ${g.defensiveCompactness.toFixed(2)}`,
    });
  }

  cands.sort((a, b) => b.score - a.score);
  const top = cands[0];
  p.action = {
    type: top.action,
    targetIdx: top.action === 'MarkOpponent' ? markTarget : receiveFlag ? p.gid : undefined,
    scores: cands.slice(0, 4),
  };
}
