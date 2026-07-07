import { clamp, clamp01 } from '../utils/math';
import {
  add, closestPointOnSegment, dist, dot, fromAngle, len, norm, rotate, scale, sub, v2, type V2,
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
  return 2.15 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5;
}

/* ------------------------------------------------------------------ */
/* Body orientation (Phase 27)                                         */
/* ------------------------------------------------------------------ */

/**
 * How far a kick direction is from where the body faces: (1 − cosθ) / 2.
 * 0 = striking dead ahead, 0.5 = square across the body, 1 = fully blind.
 * `dir` must be normalized.
 */
export function kickMisalignment(p: Player, dir: V2): number {
  return (1 - (p.heading.x * dir.x + p.heading.y * dir.y)) / 2;
}

/** Kicks across/against the body spray more; technique tames the penalty. */
export function orientationNoiseMul(misalign: number, technique: number): number {
  return 1 + misalign * (0.9 - technique * 0.6);
}

/** Kicks against the body lose power (up to −22%); technique recovers some. */
export function orientationPowerMul(misalign: number, technique: number): number {
  return 1 - misalign * 0.22 * (1 - technique * 0.4);
}

/**
 * First-touch difficulty (Phase 27): chance a moving ball gets away from the
 * receiver. Grows with ball speed, defender pressure and taking the ball from
 * behind the body; technique tames all of it. This is where pressing turns
 * into forced errors.
 */
export function touchFailChance(speed: number, pressure: number, misalign: number, technique: number): number {
  const raw = 0.01 + clamp01((speed - 6) / 8) * 0.07 + pressure * 0.1 + misalign * 0.05;
  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);
}

/**
 * Roll the first touch for a player about to control a moving ball. Returns
 * true if the touch is clean (caller gives them the ball). A failed touch
 * knocks the ball loose ahead of the receiver — anyone can pounce on it.
 * Keepers are exempt (they catch); slow balls are trivially trapped.
 */
export function attemptFirstTouch(match: Match, p: Player): boolean {
  const ball = match.ball;
  const speed = len(ball.vel);
  if (p.role === 'GK' || speed <= 6) return true;
  const inx = ball.vel.x / speed;
  const iny = ball.vel.y / speed;
  // Ball arriving at the face = 0, arriving from behind the body = 1.
  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
  const pFail = touchFailChance(speed, pressure, misalign, p.attrs.technique);
  if (!match.rng.chance(pFail)) return true;

  match.teams[p.side].stats.miscontrols++;
  ball.lastTouch = p; // a heavy touch out of play concedes the restart
  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));
  p.kickCooldown = 0.5; // off balance — can't instantly regather
  return false;
}

/** xG-like chance quality: distance falloff · central angle · pressure. */
export function shotQuality(match: Match, p: Player): number {
  const team = match.teams[p.side];
  const goal = team.oppGoal();
  const d = dist(p.pos, goal);
  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
  return clamp(0.85 * Math.exp(-d / 10) * central * (1 - pressure * 0.3), 0.01, 0.8);
}

export function performPass(match: Match, passer: Player, mate: Player): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  const opp = match.teams[1 - passer.side];

  // Playing across/against the body (Phase 27) takes pace off the ball —
  // known up front, so the lead and the kick agree on the effective speed.
  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
  const powerMul = orientationPowerMul(misalign, passer.attrs.technique);

  // Lead the receiver by a fraction of the expected flight time.
  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
  const d = dist(passer.pos, lead);
  const speed = clamp(d * 0.55 + 7.5, 8, 21) * powerMul;

  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
  // technical passer tighten them; kicks against the body spray more.
  const pressure = pressureAt(passer.pos, opp.players);
  const aim = norm(sub(lead, passer.pos));
  const noise =
    match.rng.gaussian() *
    (0.02 + pressure * 0.07 + d * 0.0015) *
    (1.15 - team.genome.passBias * 0.3) *
    (1.25 - passer.attrs.technique * 0.5) *
    orientationNoiseMul(misalign, passer.attrs.technique);
  const dir = rotate(aim, noise);

  match.kickBall(passer, dir, speed);
  team.stats.passes++;
  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
  match.pendingPass = { side: passer.side, passerGid: passer.gid, targetGid: mate.gid, t: match.simTime };
}

/**
 * Through ball (Phase 19): hit harder and led much further than a feet pass —
 * into the space the runner is attacking, not to where they stand. Riskier by
 * construction (longer flight, bigger lead), which is exactly the trade
 * riskTolerance gates in the carrier's scoring.
 */
export function performThroughBall(match: Match, passer: Player, runner: Player): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  const opp = match.teams[1 - passer.side];

  // Same body-orientation contract as performPass: effective speed known
  // up front so the projected meeting point stays honest.
  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
  const powerMul = orientationPowerMul(misalign, passer.attrs.technique);

  const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
  const lead = add(runner.pos, scale(runner.vel, flight * 1.6));
  const d = dist(passer.pos, lead);
  const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;

  const pressure = pressureAt(passer.pos, opp.players);
  const aim = norm(sub(lead, passer.pos));
  const noise =
    match.rng.gaussian() *
    (0.025 + pressure * 0.07 + d * 0.0017) *
    (1.15 - team.genome.passBias * 0.3) *
    (1.25 - passer.attrs.technique * 0.5) *
    orientationNoiseMul(misalign, passer.attrs.technique);
  const dir = rotate(aim, noise);

  match.kickBall(passer, dir, speed);
  team.stats.passes++;
  team.stats.throughBalls++;
  if (team.localX(runner.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
  match.pendingPass = { side: passer.side, passerGid: passer.gid, targetGid: runner.gid, t: match.simTime };
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
  const aim = norm(sub(target, shooter.pos));
  // Long-range and pressured shots spray more; finishers spray less. A shot
  // snatched against the body's facing (Phase 27) sprays more and loses power.
  const misalign = kickMisalignment(shooter, aim);
  const spread =
    (0.032 + d * 0.0028 + pressure * 0.05) *
    (1.45 - shooter.attrs.finishing * 0.9) *
    orientationNoiseMul(misalign, shooter.attrs.technique);
  const dir = rotate(aim, match.rng.gaussian() * spread);

  match.kickBall(shooter, dir, SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.technique));
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
    const passer = match.allPlayers[lp.passerGid]; // allPlayers is gid-indexed
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
  const aim = norm(v2(team.attackDir, lat));
  const dir = rotate(aim, match.rng.gaussian() * 0.08);
  // A clear hammered against the body's facing comes off weaker (Phase 27) —
  // at half strength: a panic hoof is a compromise, not a fifty-fifty gift.
  match.kickBall(p, dir, 23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.technique * 0.4)));
  team.stats.clearances++;
}

/**
 * Deflection (Phase 27): a ball too fast to control (a drilled pass) can
 * still be knocked loose by a player standing in its path — reading the lane
 * pays off even when the pass is hit hard. Rolled once per crossing (the
 * kick cooldown stops re-rolls while the ball is still in reach).
 */
export function tryDeflection(match: Match, p: Player): void {
  const ball = match.ball;
  const speed = len(ball.vel);
  // Committed to the stretch either way — no second bite at the same ball.
  p.kickCooldown = 0.3;
  const pDef = clamp(0.28 + p.attrs.defending * 0.4 - (speed - 14) * 0.02, 0.1, 0.6);
  if (!match.rng.chance(pDef)) return; // it zips past the outstretched leg
  ball.lastTouch = p;
  ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
  p.tackleAnimTimer = 0.4; // the stretch is visible (display only)
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
  // A keeper holding the ball in their hands can't be tackled (Phase 27.2).
  if (owner.gkHoldTimer > 0) return;
  const oppTeam = match.teams[1 - owner.side];

  let tackler: Player | null = null;
  let best = Infinity;
  for (const o of oppTeam.players) {
    if (o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
    const d = dist(o.pos, ball.pos);
    if (d < 1.15 && d < best) {
      best = d;
      tackler = o;
    }
  }
  if (!tackler) return;
  tackler.tackleAnimTimer = 0.4; // the lunge is visible either way (display only)

  // Team aggression + the tackler's defending vs the carrier's close control.
  // Base raised with Phase 27's whiff stun: a lunge is a real commitment, so
  // the ones that connect win the ball a little more often.
  let p =
    0.23 +
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
    owner.kickCooldown = 0.3;
    owner.stunTimer = 0.6; // dispossessed: stumble before rejoining play (Phase 27)
    tackler.tackleCooldown = 0.5;
    match.possessionSide = -1;
  } else {
    tackler.tackleCooldown = 1.2;
    tackler.stunTimer = 0.35; // whiffed lunge: pick yourself up first (Phase 27)
    // A failed lunge is sometimes a foul (Phase 20): free kick, or a penalty
    // in the tackler's own box. Aggressive markers give more away.
    const foulP = 0.06 + oppTeam.genome.markingAggression * 0.1;
    if (match.rng.chance(foulP)) match.awardFoul(tackler, owner);
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
  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)
  const shooterTeam = match.teams[shot.side];
  // Reflexes swing save odds by ±11 percentage points around the xG baseline;
  // the shot's frozen dive difficulty then discounts it — accurate corner
  // finishes stay hard to save even though the keeper converges on the path.
  const saveP =
    clamp(0.75 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) * shot.difficulty;

  if (match.rng.chance(saveP)) {
    shooterTeam.stats.shotsOnTarget++;
    defTeam.stats.saves++;
    match.playerStats[gk.gid].saves++;
    match.markShotOutcome('saved');
    if (speed < 21 && match.rng.chance(0.8)) {
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
