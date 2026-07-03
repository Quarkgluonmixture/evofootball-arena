import { clamp, clamp01 } from '../utils/math';
import {
  add, closestPointOnSegment, dist, dot, fromAngle, len, norm, rotate, scale, sub, v2,
} from '../utils/vec';
import { pressureAt } from '../ai/perception';
import { GOAL_WIDTH, HALF_L, HALF_W, SHOT_SPEED } from './constants';
import type { Match } from './Match';
import type { Player } from './Player';

/**
 * Ball mechanics: kicks, tackles, keeper saves and the xG model.
 * These are free functions over the Match so Match.ts stays a readable
 * state machine. All randomness comes from match.rng (deterministic).
 */

/** How far out the keeper can reach a ball (dive included). */
export function keeperReach(defTeam: { genome: { keeperAggression: number } }, gk: Player): number {
  return 1.8 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5;
}

/** xG-like chance quality: distance falloff · central angle · pressure. */
export function shotQuality(match: Match, p: Player): number {
  const team = match.teams[p.side];
  const goal = team.oppGoal();
  const d = dist(p.pos, goal);
  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
  return clamp(0.85 * Math.exp(-d / 11) * central * (1 - pressure * 0.3), 0.01, 0.8);
}

export function performPass(match: Match, passer: Player, mate: Player): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  const opp = match.teams[1 - passer.side];

  // Lead the receiver by a fraction of the expected flight time.
  const flight = dist(passer.pos, mate.pos) / 16;
  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
  const d = dist(passer.pos, lead);
  const speed = clamp(d * 0.55 + 7.5, 8, 21);

  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
  // technical passer tighten them.
  const pressure = pressureAt(passer.pos, opp.players);
  const noise =
    match.rng.gaussian() *
    (0.02 + pressure * 0.07 + d * 0.0015) *
    (1.15 - team.genome.passBias * 0.3) *
    (1.25 - passer.attrs.technique * 0.5);
  const dir = rotate(norm(sub(lead, passer.pos)), noise);

  match.kickBall(passer, dir, speed);
  team.stats.passes++;
  match.pendingPass = { side: passer.side, passerGid: passer.gid, targetGid: mate.gid, t: match.simTime };
}

export function performShot(match: Match, shooter: Player): void {
  if (match.ball.owner !== shooter || shooter.kickCooldown > 0) return;
  const team = match.teams[shooter.side];
  const opp = match.teams[1 - shooter.side];
  const gk = opp.goalkeeper;

  // Aim for the corner away from the keeper. Finishing has two channels:
  // confident finishers aim closer to the post (bigger keeper-evasion, riskier
  // margin) AND group their shots tighter.
  const goalX = team.attackDir * HALF_L;
  const aimMargin = 1.3 - shooter.attrs.finishing * 0.9; // 0.4 (clinical) .. 1.25 (timid)
  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  const target = v2(goalX, aimY);

  const q = shotQuality(match, shooter);
  const d = dist(shooter.pos, target);
  const pressure = pressureAt(shooter.pos, opp.players);
  // Long-range and pressured shots spray more; finishers spray less.
  const spread = (0.025 + d * 0.0028 + pressure * 0.05) * (1.45 - shooter.attrs.finishing * 0.9);
  const dir = rotate(norm(sub(target, shooter.pos)), match.rng.gaussian() * spread);

  match.kickBall(shooter, dir, SHOT_SPEED);
  team.stats.shots++;
  team.stats.xg += q;
  match.playerStats[shooter.gid].shots++;

  // Dive difficulty, frozen at the moment of the strike (keeper reaction).
  const path = closestPointOnSegment(match.ball.pos, add(match.ball.pos, scale(dir, 40)), gk.pos);
  const gkPerp = dist(path, gk.pos);
  const difficulty = clamp(1.15 - gkPerp / keeperReach(opp, gk), 0.25, 1);

  // Assist credit if this shot scores: the completed pass that set it up.
  const lpForAssist = match.lastCompletedPass;
  const assistGid =
    lpForAssist && lpForAssist.receiverGid === shooter.gid && match.simTime - lpForAssist.t < 3
      ? lpForAssist.passerGid
      : null;

  match.markShotOutcome('miss'); // close out any still-pending previous shot
  match.shotLog.push({ t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending' });
  match.pendingShot = {
    side: shooter.side,
    shooterGid: shooter.gid,
    xg: q,
    t: match.simTime,
    resolved: false,
    logIndex: match.shotLog.length - 1,
    difficulty,
    assistGid,
  };

  // Key pass: shot within 3s of receiving.
  const lp = match.lastCompletedPass;
  if (lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3) {
    team.stats.keyPasses++;
    const passer = match.allPlayers.find((x) => x.gid === lp.passerGid);
    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the key pass`);
  }
  match.pushEvent('shot', shooter.side, `${shooter.name} shoots! (xG ${q.toFixed(2)})`);
}

export function performClear(match: Match, p: Player): void {
  if (match.ball.owner !== p || p.kickCooldown > 0) return;
  const team = match.teams[p.side];
  // Hoof it upfield with a wide lateral component — safety over precision.
  // Panicked clears regularly cross the touchline: conceding a kick-in beats
  // losing the ball in front of your own goal (this is where kick-ins come from).
  const lat = match.rng.range(-1.0, 1.0);
  const dir = rotate(norm(v2(team.attackDir, lat)), match.rng.gaussian() * 0.08);
  match.kickBall(p, dir, 23);
  team.stats.clearances++;
}

/**
 * Tackling: the nearest ready opponent within reach of a dribbler attempts to
 * win the ball. Success odds: markingAggression helps the tackler, the
 * carrier's dribbleBias (close control) protects them. A failed tackle puts
 * the defender on a 1.2s cooldown — beaten players can't spam.
 */
export function tryTackles(match: Match): void {
  const ball = match.ball;
  const owner = ball.owner;
  if (!owner) return;
  const oppTeam = match.teams[1 - owner.side];

  let tackler: Player | null = null;
  let best = Infinity;
  for (const o of oppTeam.players) {
    if (o.tackleCooldown > 0) continue;
    const d = dist(o.pos, ball.pos);
    if (d < 1.15 && d < best) {
      best = d;
      tackler = o;
    }
  }
  if (!tackler) return;

  // Team aggression + the tackler's defending vs the carrier's close control.
  let p =
    0.2 +
    oppTeam.genome.markingAggression * 0.2 +
    tackler.attrs.defending * 0.24 -
    match.teams[owner.side].genome.dribbleBias * 0.08 -
    owner.attrs.technique * 0.12;
  if (oppTeam.mode === 'Press') p += 0.06;
  p = clamp(p, 0.06, 0.7);

  if (match.rng.chance(p)) {
    oppTeam.stats.tackles++;
    match.playerStats[tackler.gid].recoveries++;
    // No feed event — tackles are too frequent to narrate; stats + debug show them.
    ball.owner = null;
    ball.lastTouch = tackler;
    ball.vel = fromAngle(match.rng.range(0, Math.PI * 2), match.rng.range(3.5, 6.5));
    owner.kickCooldown = 0.3; // dribbler is off balance
    tackler.tackleCooldown = 0.5;
    match.possessionSide = -1;
  } else {
    tackler.tackleCooldown = 1.2;
  }
}

/**
 * Keeper save: while a shot is unresolved and the ball is within the keeper's
 * reach heading goalward, roll one save attempt. Save odds fall with shot
 * quality. Catches kill the ball dead; parries push it away from goal.
 */
export function tryKeeperSave(match: Match): void {
  const shot = match.pendingShot;
  const ball = match.ball;
  if (!shot || shot.resolved || ball.owner !== null) return;

  const defSide = (1 - shot.side) as 0 | 1;
  const defTeam = match.teams[defSide];
  const gk = defTeam.goalkeeper;
  const goal = defTeam.ownGoal();
  const speed = len(ball.vel);
  if (speed < 6) return;
  if (dot(ball.vel, sub(goal, ball.pos)) <= 0) return;

  const reach = keeperReach(defTeam, gk);
  if (dist(gk.pos, ball.pos) > reach) return;

  shot.resolved = true;
  const shooterTeam = match.teams[shot.side];
  // Reflexes swing save odds by ±11 percentage points around the xG baseline;
  // the shot's frozen dive difficulty then discounts it — accurate corner
  // finishes stay hard to save even though the keeper converges on the path.
  const saveP =
    clamp(0.52 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.85) * shot.difficulty;

  if (match.rng.chance(saveP)) {
    shooterTeam.stats.shotsOnTarget++;
    defTeam.stats.saves++;
    match.playerStats[gk.gid].saves++;
    match.markShotOutcome('saved');
    if (speed < 19 && match.rng.chance(0.65)) {
      match.pushEvent('save', defSide, `${gk.name} catches it`);
      match.giveBall(gk);
    } else {
      // A parry deflects the shot rather than reversing it: the ball is
      // pushed wide of the goal — often behind for a corner, sometimes loose
      // in the box for a scramble. (The old inward "bounce-back" parry is why
      // corners never happened.)
      const inDir = norm(ball.vel);
      const side = ball.pos.y >= 0 ? 1 : -1;
      const ang = side * Math.sign(inDir.x || 1) * match.rng.range(0.55, 1.15);
      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));
      ball.lastTouch = gk;
      gk.kickCooldown = 0.6; // let the parry leave the keeper's feet
      match.pushEvent('save', defSide, `${gk.name} parries!`);
    }
  }
  // A failed attempt just lets the ball continue — goal or miss.
}
