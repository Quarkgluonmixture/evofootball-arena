import { clamp, clamp01 } from '../utils/math';
import {
  add, closestPointOnSegment, dist, dot, fromAngle, len, norm, rotate, scale, sub, v2, type V2,
} from '../utils/vec';
import { laneBlockers, opennessOf, pressureAt } from '../ai/perception';
import { offsideLineLocalX, runBurstPoint } from '../ai/formations';
import {
  BALL_FRICTION_K, BOX_DEPTH, CHEST_TRAP_MAX_HEIGHT, CHEST_TRAP_MAX_VZ, CHEST_TRAP_RADIUS,
  CORNER_CLEARANCE, GK_CLAIM_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L,
  HALF_W, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS, SHOT_SPEED,
  GK_RUSH_ENVELOPE,
  DEFLECT_BLIND_PEN, TACKLE_LUNGE_COST, UNSET_BLOCK_WEIGHT,
  TOUCH_PUSH_BASE, TOUCH_PUSH_SPACE, TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
} from './constants';
import type { Match } from './Match';
import type { Player } from './Player';
import type { Role } from './types';

/**
 * Ball mechanics: kicks, tackles, keeper saves and the xG model.
 * These are free functions over the Match so Match.ts stays a readable
 * state machine. All randomness comes from match.rng (deterministic).
 */

/** How far out the keeper can reach a ball (dive included). */
function keeperReach(defTeam: { genome: { keeperAggression: number } }, gk: Player): number {
  // The cat (Phase 39): elite-reflex keepers reach a hand further.
  return (
    2.05 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +
    (gk.traits.includes('cat') ? 0.12 : 0)
  );
}

/** Dive difficulty, frozen at the moment of the strike: how far off the
 * shot's line the keeper stands, priced against his reach. Shared by the
 * open-play shot, the header and the placed free kick. */
function diveDifficulty(ballPos: V2, dir: V2, gk: Player, opp: { genome: { keeperAggression: number } }): number {
  const path = closestPointOnSegment(ballPos, add(ballPos, scale(dir, 40)), gk.pos);
  return clamp(1.15 - dist(path, gk.pos) / keeperReach(opp, gk), 0.25, 1);
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
  // A dropping ball is harder to kill than a rolled one (Phase 28): the
  // vertical speed counts toward touch difficulty. Ground balls: vz = 0.
  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
  if (p.role === 'GK' || speed <= 6) return true;
  const hSpeed = Math.max(len(ball.vel), 1e-6);
  const inx = ball.vel.x / hSpeed;
  const iny = ball.vel.y / hSpeed;
  // Ball arriving at the face = 0, arriving from behind the body = 1.
  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
  let pFail = touchFailChance(speed, pressure, misalign, p.attrs.dribbling);
  // Re-collecting your OWN pushed touch (Phase 36): the ball rolls away
  // from the body, which reads as a blind-side reception to the misalign
  // term — but he watched it leave his own boot. Priced well down, not
  // free: overhit knock-and-runs still get away.
  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;
  if (!match.rng.chance(pFail)) return true;

  match.teams[p.side].stats.miscontrols++;
  match.stat(p.gid).miscontrols++;
  ball.lastTouch = p; // a heavy touch out of play concedes the restart
  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));
  ball.vz = 0; // the touch kills any remaining flight — the ball drops
  p.kickCooldown = 0.5; // off balance — can't instantly regather
  return false;
}

/**
 * Offside judgment, frozen at kick time (Phase 29): is `target` in an
 * offside position right now, as `passer` strikes the ball? Opponent half
 * only; the line is the second-last defender counting the keeper, or the
 * ball (the passer) if deeper; level is onside (0.2m epsilon).
 */
function offsideAtKick(match: Match, passer: Player, target: Player): boolean {
  const team = match.teams[passer.side];
  const tx = team.localX(target.pos.x);
  if (tx <= 0) return false; // own half — never offside
  const line = offsideLineLocalX(team, match.teams[1 - passer.side].players, team.localX(passer.pos.x));
  return tx > line + 0.2;
}

/**
 * The single funnel for pass bookkeeping (Phase 29): every delivery that
 * names a target registers here, so the offside flag is judged exactly once,
 * at kick time. `exempt` = the real-law dead-ball exemptions (kick-ins,
 * corners, goal kicks — passed down from the restart taker's decision).
 */
function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): void {
  const offside = !exempt && offsideAtKick(match, passer, target);
  // Third-man shape (Phase 34): A→B, and B bounces it FORWARD to a running
  // C within a beat of receiving — flagged at the kick, credited on arrival.
  const lp = match.lastCompletedPass;
  const team = match.teams[passer.side];
  const bounce =
    lp !== null &&
    lp.receiverGid === passer.gid &&
    lp.passerGid !== target.gid && // back to A is a one-two, not a third man
    match.simTime - lp.t < 1.5 &&
    target.action.type === 'MakeRun' &&
    team.localX(target.pos.x) > team.localX(passer.pos.x) + 3;
  match.pendingPass = {
    side: passer.side,
    passerGid: passer.gid,
    targetGid: target.gid,
    t: match.simTime,
    offside,
    offsideSpot: offside ? v2(target.pos.x, target.pos.y) : null,
    bounce,
  };
}

/**
 * One-touch penalty (Phase 31.9, 一脚出球): a pass struck inside the
 * receiver's first-touch window (set at a pressured reception, consumed by
 * any kick) sprays more — technique discounts it: tech 0.95 ≈ ×1.2, tech
 * 0.5 ≈ ×1.6, tech 0.1 ≈ ×2.0. Multiplies aim noise (and loft range error).
 */
function oneTouchMul(p: Player): number {
  return p.firstTouchWindow > 0 ? 1.15 + (1 - p.attrs.dribbling) * 0.9 : 1;
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

export function performPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  const opp = match.teams[1 - passer.side];

  // Playing across/against the body (Phase 27) takes pace off the ball —
  // known up front, so the lead and the kick agree on the effective speed.
  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);

  // Lead the receiver by a fraction of the expected flight time.
  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
  const d = dist(passer.pos, lead);
  // d·0.55+7.5 → d·0.6+8.2 (31.6, user call 传球力度): zip beats the
  // in-flight interceptors (completion 64→68%) — the receiving cost is
  // priced by touchFailChance and stays mild.
  const speed = clamp(d * 0.6 + 8.2, 9, 22) * powerMul;

  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
  // technical passer tighten them; kicks against the body spray more.
  const pressure = pressureAt(passer.pos, opp.players);
  const aim = norm(sub(lead, passer.pos));
  const noise =
    match.rng.gaussian() *
    (0.02 + pressure * 0.07 + d * 0.0015) *
    (1.15 - team.genome.passBias * 0.3) *
    (1.25 - passer.attrs.passing * 0.5) *
    oneTouchMul(passer) *
    orientationNoiseMul(misalign, passer.attrs.passing);
  const dir = rotate(aim, noise);

  const oneTouch = passer.firstTouchWindow > 0;
  match.kickBall(passer, dir, speed);
  team.stats.passes++;
  if (oneTouch) team.stats.oneTouch++;
  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
  registerPass(match, passer, mate, offsideExempt);

  // 2过1 (Phase 34): a short pass played UNDER PRESSURE licenses the passer
  // to burst past his marker for the return — the "go" half of the
  // give-and-go. Sides that play at speed (tempo + passBias) look for it;
  // slow ones take the touch and keep shape. Not from the defensive third
  // (a wall pass at your own box is how counters are born).
  // Window 2.3s: the round trip is ~0.7s out + the wall's touch + ~0.7s
  // back — a 1.15s license expired before any return could arrive (probed).
  // Attacking half only: granted from build-up, the flip bonus turned the
  // midfield into a wall-pass ping-pong that ate 0.3 goals/match (probed
  // against the same calibrate seeds) — the one-two is a PENETRATION device.
  // The gene score is scaled by the franchise's evolved wallPassW (Phase 45)
  // before the gate — appetite for the one-two is style, not a constant.
  if (
    passer.role !== 'GK' &&
    d < 15 &&
    pressure > 0.2 &&
    passer.stamina > 0.3 &&
    team.localX(passer.pos.x) > 0 &&
    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
  ) {
    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };
  }
}

/**
 * Through ball (Phase 19): hit harder and led much further than a feet pass —
 * into the space the runner is attacking, not to where they stand. Riskier by
 * construction (longer flight, bigger lead), which is exactly the trade
 * riskTolerance gates in the carrier's scoring. `lofted` (Phase 28) chips it
 * over the defensive line instead — slower to arrive and harder to take down,
 * but nothing on the ground can cut it out.
 */
export function performThroughBall(
  match: Match, passer: Player, runner: Player, lofted = false, offsideExempt = false,
): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  const opp = match.teams[1 - passer.side];
  const oneTouch = passer.firstTouchWindow > 0; // read before any kick consumes it

  // Same body-orientation contract as performPass: effective speed known
  // up front so the projected meeting point stays honest.
  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);

  // Meet the run, not the hover (Phase 29): a runner held at the offside
  // line has ~zero velocity — the delivery projects the burst they make the
  // moment this kick releases the hold, instead of dropping at their feet.
  const oppPlayers = match.teams[1 - passer.side].players;
  if (lofted) {
    const flight0 = clamp(0.55 + dist(passer.pos, runner.pos) * 0.045, 0.8, 2.0);
    const lead = runBurstPoint(runner, team, oppPlayers, flight0 * 0.85);
    loftKick(match, passer, lead, 0.55, 0.045, 0.8, 2.0, 1.0);
    team.stats.longBalls++; // a chip is a lofted long ball too
  } else {
    const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
    // Lead FURTHER since Phase 30 (flight ×1.25, pace cap 21→24): with a
    // sixth defender recovering, a ball met AT the line gets the runner
    // caught before the shot — the delivery must land deep enough that the
    // 17 through balls/match turn back into 1v1s (the high-xG chances the
    // 30.x structures had erased: 0.38/match → 0.08 before this).
    const lead = runBurstPoint(runner, team, oppPlayers, flight * 1.25);
    const d = dist(passer.pos, lead);
    // A touch softer since Phase 29: the ball is played into SPACE for a
    // runner arriving at a sprint — friction kills it into the path, and a
    // pace the runner can actually take down is what converts timed runs.
    const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;

    const pressure = pressureAt(passer.pos, opp.players);
    const aim = norm(sub(lead, passer.pos));
    const noise =
      match.rng.gaussian() *
      (0.025 + pressure * 0.07 + d * 0.0017) *
      (1.15 - team.genome.passBias * 0.3) *
      (1.25 - passer.attrs.passing * 0.5) *
      oneTouchMul(passer) *
      orientationNoiseMul(misalign, passer.attrs.passing);
    const dir = rotate(aim, noise);

    match.kickBall(passer, dir, speed);
  }
  team.stats.passes++;
  team.stats.throughBalls++;
  if (oneTouch) team.stats.oneTouch++;
  if (team.localX(runner.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
  registerPass(match, passer, runner, offsideExempt);
}

/* ------------------------------------------------------------------ */
/* The aerial game (Phase 28)                                          */
/* ------------------------------------------------------------------ */

/**
 * Loft a ball to land at `target`: flight time grows with distance
 * (tBase + m·tPerM, clamped), horizontal speed = distance/time, and the
 * vertical launch is whatever brings it back down exactly at landing
 * (airborne balls fly friction-free, so the projectile math is exact).
 * Accuracy: direction noise like a ground pass plus a RANGE error — long
 * deliveries drift short/long; technique and passBias tame both.
 */
function loftKick(
  match: Match, p: Player, target: V2,
  tBase: number, tPerM: number, tMin: number, tMax: number, noiseMul: number,
  spin = 0,
): void {
  const team = match.teams[p.side];
  const opp = match.teams[1 - p.side];
  const aimDir = norm(sub(target, p.pos));
  const misalign = kickMisalignment(p, aimDir);
  const d = dist(p.pos, target);
  const pressure = pressureAt(p.pos, opp.players);
  const noise =
    match.rng.gaussian() *
    (0.03 + pressure * 0.05 + d * 0.0011) * noiseMul *
    (1.15 - team.genome.passBias * 0.3) *
    (1.3 - p.attrs.passing * 0.55) *
    oneTouchMul(p) *
    orientationNoiseMul(misalign, p.attrs.passing);
  const dir = rotate(aimDir, noise);
  // Range error + orientation power loss both shorten/stretch the delivery.
  let dEff = d * orientationPowerMul(misalign, p.attrs.passing);
  dEff *= 1 + match.rng.gaussian() * (0.02 + d * 0.0008) * (1.25 - p.attrs.passing * 0.5) * oneTouchMul(p);
  dEff = Math.max(dEff, 3);
  const T = clamp(tBase + dEff * tPerM, tMin, tMax);
  // Magnus pre-compensation (Phase 37): launch rotated −spin·T/2 so the
  // ARC's chord still points where the aim did — the designed landing
  // point (and the whole 31.9 corner chain) is invariant; only the path
  // between bends. ballLanding() projects the same closed form.
  match.kickBall(p, spin === 0 ? dir : rotate(dir, -spin * T * 0.5), dEff / T, (GRAVITY * T) / 2);
  match.ball.spin = spin;
}

/**
 * Cross (Phase 28): whip a lofted ball from wide toward a target arriving in
 * the box, pulled a quarter of the way toward goal so deliveries drop into
 * the danger area rather than at a standing man's feet. Resolved in the air:
 * keeper claim or header contest (tryAerial), not a ground reception.
 */
export function performCross(
  match: Match, crosser: Player, target: Player, offsideExempt = false, pull = 0.18, at?: V2,
): void {
  if (match.ball.owner !== crosser || crosser.kickCooldown > 0) return;
  const team = match.teams[crosser.side];
  const flight0 = clamp(0.5 + dist(crosser.pos, at ?? target.pos) * 0.038, 0.7, 1.7);
  // Corner routines pass `at` (Phase 31.9): the delivery attacks the
  // routine's KEY ZONE and the crasher times his burst onto it. The
  // velocity lead is for open play — leading a crasher mid-burst by
  // vel·flight (~9m at a 1.45s corner flight) dropped the ball far past
  // the spot everyone was licensed to attack (probed: 0/30 corners met
  // their man in the header band).
  const arrive = at ?? add(target.pos, scale(target.vel, flight0 * 0.9));
  const goal = team.oppGoal();
  // Pulled toward goal, but NOT into the six-yard area — a delivery that
  // drops on the keeper's claim radius is a delivery wasted (28.1: this
  // pull was 0.25 and fed the keeper instead of the penalty spot).
  // Corner routines pass a SMALLER pull (Phase 31): the marker stands
  // goal-side of the crasher by construction, so pulling the drop toward
  // goal handed every corner duel to the defence (probed: attackers won
  // 0.00 duels/corner) — the routine delivery meets the RUN instead.
  const spot = v2(arrive.x + (goal.x - arrive.x) * pull, arrive.y + (goal.y - arrive.y) * pull);
  const oneTouch = crosser.firstTouchWindow > 0;
  // The whipped delivery (Phase 37): crosses and corners curl TOWARD the
  // goal — the inswinger. Sign from the chord×to-goal cross product;
  // technique whips harder. (The landing point is pre-compensated in
  // loftKick, so the 31.9 corner chain sees the same scatter.)
  const chord = norm(sub(spot, crosser.pos));
  const toGoal = norm(sub(goal, crosser.pos));
  const swing = Math.sign(chord.x * toGoal.y - chord.y * toGoal.x) || 1;
  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
  loftKick(match, crosser, spot, 0.5, 0.038, 0.7, 1.7, 1.1, spin);
  team.stats.passes++;
  team.stats.crosses++;
  if (oneTouch) team.stats.oneTouch++;
  if (team.localX(target.pos.x) - team.localX(crosser.pos.x) > 2) team.stats.passesForward++;
  registerPass(match, crosser, target, offsideExempt);
}

/**
 * Keeper throw (Phase 28.3): an ACCURATE hand distribution — flat, quick,
 * half the noise of a kicked ball, 8–30m. This is what a keeper who held
 * the ball does instead of hoofing 50/50s: find a body, hit the body.
 */
export function performKeeperThrow(match: Match, gk: Player, mate: Player): void {
  if (match.ball.owner !== gk || gk.kickCooldown > 0) return;
  const team = match.teams[gk.side];
  const flight0 = clamp(0.5 + dist(gk.pos, mate.pos) * 0.03, 0.7, 1.4);
  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
  loftKick(match, gk, lead, 0.5, 0.03, 0.7, 1.4, 0.45);
  team.stats.passes++;
  if (team.localX(mate.pos.x) - team.localX(gk.pos.x) > 2) team.stats.passesForward++;
  registerPass(match, gk, mate, false); // a hand throw is regular play — offside applies
}

/**
 * Cutback (Phase 31): the byline pull-back — a HARD, flat ball driven from
 * the touchline zone to the edge-of-box arc, where the licensed arriver
 * meets it first-time (giveBall's snap-decision window). Faster than a
 * regular pass at the same range so it beats the box defenders' recovery
 * slide across; registered like any pass (interceptions, assists and the
 * offside judgment all apply — the arriver runs from DEEP, so flags are
 * rare by construction).
 */
export function performCutback(match: Match, passer: Player, mate: Player): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
  const flight = dist(passer.pos, mate.pos) / (18 * powerMul);
  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
  const d = dist(passer.pos, lead);
  const speed = clamp(d * 0.6 + 10, 11, 23) * powerMul;
  const pressure = pressureAt(passer.pos, match.teams[1 - passer.side].players);
  const aim = norm(sub(lead, passer.pos));
  const noise =
    match.rng.gaussian() *
    (0.02 + pressure * 0.06 + d * 0.0012) *
    (1.15 - team.genome.passBias * 0.3) *
    (1.25 - passer.attrs.passing * 0.5) *
    oneTouchMul(passer) *
    orientationNoiseMul(misalign, passer.attrs.passing);
  const oneTouch = passer.firstTouchWindow > 0;
  match.kickBall(passer, rotate(aim, noise), speed);
  team.stats.passes++;
  team.stats.cutbacks++;
  if (oneTouch) team.stats.oneTouch++;
  match.lastCutback = { side: passer.side, t: match.simTime };
  registerPass(match, passer, mate, false);
}

/**
 * Lofted switch (Phase 28): the big diagonal — a 25m+ ball over the press to
 * a receiver in space. What the 32m ground-pass penalty used to suppress.
 */
export function performLoftedPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
  const team = match.teams[passer.side];
  // Driven, not floated (Phase 30.5): at the old 0.8+d·0.045 a 30m switch
  // hung 2.15s — any defender within ~12m of the drop reached it, and the
  // receiving WINGER is the worst header in the game (AERIAL_ROLE 0.06 vs
  // DF 0.3), so the diagonal completed ~20% and wing play starved. A flat
  // 1.4–1.6s ball reaches the flank before the fullback does.
  const flight0 = clamp(0.55 + dist(passer.pos, mate.pos) * 0.033, 1.1, 2.1);
  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
  const oneTouch = passer.firstTouchWindow > 0;
  loftKick(match, passer, lead, 0.55, 0.033, 1.1, 2.1, 0.9);
  team.stats.passes++;
  team.stats.longBalls++;
  if (oneTouch) team.stats.oneTouch++;
  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
  registerPass(match, passer, mate, offsideExempt);
}

/** Aerial presence by role: centre-backs and strikers attack the ball. */
const AERIAL_ROLE: Record<Role, number> = { GK: 0, DF: 0.3, MF: 0.14, WG: 0.06, ST: 0.26 };

/**
 * How good this player is in the air — the same formula the header contest
 * rolls against, so cross targeting (PlayerBrain) and duel resolution agree.
 */
export function aerialSense(p: Player): number {
  return AERIAL_ROLE[p.role] + p.attrs.defending * 0.3 + p.attrs.strength * 0.1;
}

/**
 * Resolve a ball flying through the contest band (Phase 28). Keepers first —
 * hands beat heads: a keeper under the ball claims it (crowd pressure and
 * reflexes decide). Then outfielders within reach jump: position + role
 * aerial sense + attributes pick the winner, who heads for goal in the
 * opponent box, powers it clear near their own, or cushions it to a teammate.
 * `order` alternates per step (the same fairness contract as tryCapture).
 */
export function tryAerial(match: Match, order: Player[]): void {
  const ball = match.ball;
  if (ball.z < HEADER_MIN_HEIGHT || ball.z > GK_CLAIM_HEIGHT) return;

  for (const gk of order) {
    if (gk.role !== 'GK' || gk.sentOff || gk.stunTimer > 0 || gk.tackleCooldown > 0) continue;
    // Hands only inside the box (Phase 28.5): a keeper stranded off his line
    // can't PLUCK a high ball out of the air — outside his area the delivery
    // is an outfield header contest, not a keeper claim.
    if (!match.inPenaltyBox(gk.pos, gk.side)) continue;
    const dx = gk.pos.x - ball.pos.x;
    const dy = gk.pos.y - ball.pos.y;
    if (dx * dx + dy * dy > 1.9 * 1.9) continue;
    // Committed to the jump either way (pickup stays free). 0.5 → 0.9 in
    // 29.1: a ball hanging/bouncing through the claim band re-rolled every
    // half second, and the restarting dive pose read as convulsions.
    gk.tackleCooldown = 0.9;
    gk.saveAnimTimer = 0.6;
    const crowd = pressureAt(gk.pos, match.teams[1 - gk.side].players);
    const pClaim = clamp(0.62 + (gk.attrs.reflexes - 0.5) * 0.5 - crowd * 0.3, 0.2, 0.9);
    if (match.rng.chance(pClaim)) {
      // A claimed opponent shot is a save (a dropping header, typically).
      const shot = match.pendingShot;
      if (shot && !shot.resolved && shot.side !== gk.side) {
        shot.resolved = true;
        match.teams[shot.side].stats.shotsOnTarget++;
        match.teams[gk.side].stats.saves++;
        match.stat(gk.gid).saves++;
        match.markShotOutcome('saved');
      }
      match.pushEvent('save', gk.side, `${gk.name} claims the high ball`);
      match.giveBall(gk);
      return;
    }
    // Flapped at it under pressure — the ball sails on.
  }

  if (ball.z > HEADER_MAX_HEIGHT) return;
  // Chest / thigh trap (Phase 28.6): before anyone HEADS a hanging ball,
  // an unpressured man under a dropping ball in the lower band takes it DOWN.
  if (tryChestTrap(match, order)) return;
  let winner: Player | null = null;
  let best = -Infinity;
  const contenders: Player[] = [];
  for (const p of order) {
    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
    const dx = p.pos.x - ball.pos.x;
    const dy = p.pos.y - ball.pos.y;
    const d2 = dx * dx + dy * dy;
    if (d2 > HEADER_RADIUS * HEADER_RADIUS) continue;
    contenders.push(p);
    // Position + aerial sense + a seeded jump-timing roll pick the winner.
    // Attackers meeting a delivery in the opponent box arrive with momentum
    // — a real edge over the defender jumping from a standing start. Raised
    // 0.12 → 0.2 in 29.1: un-marking the corner taker freed a defender to
    // mark in the box (3v3, everyone tracked) and corner threat collapsed
    // to 3.5% — the crasher's running jump is what beats a set marker.
    // 0.2 → 0.3 (Phase 31): with routine deliveries finally meeting the
  // crashers' runs, the running jump's edge over the goal-side marker's
  // standing start is what wins the zone — at 0.2 the position term still
  // handed every corner duel to the defence.
  const attacking = match.teams[p.side].localX(ball.pos.x) > HALF_L - BOX_DEPTH ? 0.3 : 0;
    const s =
      aerialSense(p) +
      attacking +
      (1 - Math.sqrt(d2) / HEADER_RADIUS) * 0.35 +
      match.rng.range(0, 0.45);
    if (s > best) {
      best = s;
      winner = p;
    }
  }
  if (!winner) return;
  // Let it DROP for the chest trap (Phase 28.6): a player with TIME and SPACE
  // shouldn't nod a dropping midfield ball on — that header is exactly what
  // kept the aerial rally alive. If nobody's contesting (no opponent within
  // header reach), the ball is falling (vz < 0), and it's neither a header
  // chance on goal nor a clearance near our own, decline the header and let
  // it come down — `tryChestTrap` takes it to the feet a few steps later (or
  // it just lands and is controlled on the ground). Attacking free headers
  // and defensive clears are UNCHANGED (they fall outside the gate).
  const wteam = match.teams[winner.side];
  const dOppGoal = dist(ball.pos, wteam.oppGoal());
  const nearOwnGoal = dist(ball.pos, wteam.ownGoal()) < 20;
  let oppNear = false;
  for (const o of match.teams[1 - winner.side].players) {
    if (o.sentOff || o.role === 'GK') continue;
    if (dist(o.pos, ball.pos) < HEADER_RADIUS) { oppNear = true; break; }
  }
  if (!oppNear && ball.vz < 0 && dOppGoal >= 16.5 && !nearOwnGoal) return;
  // Committed to the header — every contender jumped (brief recovery so a
  // ball hanging through the band doesn't re-roll into a convulsion).
  for (const p of contenders) {
    p.kickCooldown = 0.45;
    p.headerAnimTimer = 0.55;
  }
  // Offside (Phase 29): the flagged target meeting the delivery in the air
  // IS the touch that completes the offence — whistle instead of the header.
  const pass = match.pendingPass;
  if (pass && pass.offside && winner.side === pass.side && winner.gid === pass.targetGid) {
    match.pendingPass = null;
    match.callOffside(winner, pass.offsideSpot ?? winner.pos);
    return;
  }
  headBall(match, winner);
}

/** What the header winner does with it — shot, clearance or knockdown. */
function headBall(match: Match, p: Player): void {
  const ball = match.ball;
  const team = match.teams[p.side];
  ball.lastTouch = p;
  team.stats.headersWon++;

  // Delivery bookkeeping: a teammate's cross/loft met in the air is a
  // completed pass (assist credit if the header goes in); an opponent's
  // delivery headed away is an interception.
  const pass = match.pendingPass;
  if (pass && pass.side === p.side && pass.passerGid !== p.gid) {
    team.stats.passesCompleted++;
    match.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, t: match.simTime };
  } else if (pass && pass.side !== p.side) {
    team.stats.interceptions++;
    match.stat(p.gid).recoveries++;
  }
  match.pendingPass = null;

  const dGoal = dist(ball.pos, team.oppGoal());
  if (dGoal < 16.5) {
    performHeaderShot(match, p);
    return;
  }
  if (dist(ball.pos, team.ownGoal()) < 20) {
    // Defensive header: power it away from goal, high and wide.
    const dir = norm(v2(team.attackDir, match.rng.range(-0.9, 0.9)));
    ball.vel = scale(dir, match.rng.range(11, 15));
    ball.vz = match.rng.range(3.5, 5.2);
    team.stats.clearances++;
    return;
  }
  // Knockdown: cushion it toward the best-placed teammate in range.
  let mate: Player | null = null;
  let bestS = -Infinity;
  for (const q of team.players) {
    if (q === p || q.sentOff) continue;
    const d = dist(q.pos, ball.pos);
    if (d > 16) continue;
    const s = opennessOf(q, match.teams[1 - p.side].players) - (d / 16) * 0.4;
    if (s > bestS) {
      bestS = s;
      mate = q;
    }
  }
  const to = mate ? norm(sub(mate.pos, ball.pos)) : v2(team.attackDir, 0);
  ball.vel = scale(to, match.rng.range(7, 9.5));
  ball.vz = 0.8; // nodded down — drops quickly to feet
}

/**
 * Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 —
 * 是不是没有胸部停球"). A ball DROPPING through the lower header band that no
 * opponent is contesting can be CUSHIONED to the feet instead of headed — the
 * missing alternative that turned every hanging ball into an endless nod-it-
 * back-and-forth rally. Only the man almost directly under it, only a
 * descending/apex ball below chest height, only when it is NOT a live aerial
 * duel (an opponent within header reach = head it, as before). The take-down
 * is priced by first-touch (same `touchFailChance` surface as a ground
 * reception, +a small aerial malus) and SPILLS under pressure — a failed trap
 * drops the ball loose, so the scramble is preserved, just not perpetual.
 * Returns true if the trap fired (clean OR spilled); the caller then skips the
 * header contest for this step.
 */
function tryChestTrap(match: Match, order: Player[]): boolean {
  const ball = match.ball;
  if (ball.z > CHEST_TRAP_MAX_HEIGHT || ball.vz > CHEST_TRAP_MAX_VZ) return false;
  // The man almost directly under it (tighter than a header reach).
  let trapper: Player | null = null;
  let bestD = CHEST_TRAP_RADIUS;
  for (const p of order) {
    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
    const d = dist(p.pos, ball.pos);
    if (d < bestD) {
      bestD = d;
      trapper = p;
    }
  }
  if (!trapper) return false;
  // A contested ball is an aerial DUEL — let it be headed (unchanged).
  for (const o of match.teams[1 - trapper.side].players) {
    if (o.sentOff || o.role === 'GK') continue;
    if (dist(o.pos, ball.pos) < HEADER_RADIUS) return false;
  }
  // Price the cushion: drop speed (vz counts, like a ground first touch),
  // pressure, and taking it on the blind side; technique tames all of it.
  const hSpeed = Math.max(len(ball.vel), 1e-6);
  const inx = ball.vel.x / hSpeed;
  const iny = ball.vel.y / hSpeed;
  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
  const misalign = (1 + (inx * trapper.heading.x + iny * trapper.heading.y)) / 2;
  const pressure = pressureAt(trapper.pos, match.teams[1 - trapper.side].players);
  const pFail = clamp(
    touchFailChance(speed, pressure, misalign, trapper.attrs.dribbling) + 0.05, 0, 0.5,
  );
  trapper.kickCooldown = 0.3; // committed to the touch either way
  if (!match.rng.chance(pFail)) {
    match.giveBall(trapper); // clean take-down: giveBall snaps it dead to feet + does pass/offside bookkeeping
    return true;
  }
  // Spilled the cushion — a heavy touch knocks it loose and low (the scramble).
  match.teams[trapper.side].stats.miscontrols++;
  match.stat(trapper.gid).miscontrols++;
  ball.lastTouch = trapper;
  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.9, 0.9)), match.rng.range(3, 5.5));
  ball.vz = 0; // knocked down — it drops
  return true;
}

/**
 * Headed shot: meeting a cross in the box. Converts worse than feet (tight
 * distance falloff, capped quality) and sprays more, but arrives from the
 * exact spot defenders least want — the same pendingShot machinery as
 * performShot, difficulty frozen at contact.
 */
function performHeaderShot(match: Match, shooter: Player): void {
  match.endPassMove(shooter.side); // the header ends the move (Phase 33)
  const team = match.teams[shooter.side];
  const opp = match.teams[1 - shooter.side];
  const gk = opp.goalkeeper;
  const ball = match.ball;

  const goalX = team.attackDir * HALF_L;
  const aimMargin = 1.6 - shooter.attrs.finishing * 0.8;
  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  const target = v2(goalX, aimY);
  const d = dist(ball.pos, target);
  const pressure = pressureAt(shooter.pos, opp.players);
  const central = 1 - clamp01(Math.abs(ball.pos.y) / HALF_W) * 0.5;
  const q = clamp(0.5 * Math.exp(-d / 8.5) * central * (1 - pressure * 0.25), 0.01, 0.45);

  const aim = norm(sub(target, ball.pos));
  const spread = (0.05 + d * 0.004 + pressure * 0.04) * (1.35 - shooter.attrs.finishing * 0.65);
  const dir = rotate(aim, match.rng.gaussian() * spread);
  ball.vel = scale(dir, 15 + shooter.attrs.finishing * 4);
  ball.vz = -1.2; // headed down toward the goal

  team.stats.shots++;
  team.stats.xg += q;
  match.stat(shooter.gid).shots++;

  const difficulty = diveDifficulty(ball.pos, dir, gk, opp);
  const lp = match.lastCompletedPass;
  const assistGid =
    lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3 ? lp.passerGid : null;

  match.markShotOutcome('miss');
  match.shotLog.push({
    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
    blockers: laneBlockers(ball.pos, team.oppGoal(), opp.players),
  });
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
  if (assistGid !== null) {
    team.stats.keyPasses++;
    const passer = match.allPlayers[assistGid];
    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the delivery`);
  }
  match.pushEvent('shot', shooter.side, `${shooter.name} heads it at goal! (xG ${q.toFixed(2)})`);
}

/** Attacked-goal center for a shooter's team (helper for 1v1 detection). */
function goalCenterFor(team: { oppGoal(): V2 }): V2 {
  return team.oppGoal();
}

export function performShot(match: Match, shooter: Player): void {
  if (match.ball.owner !== shooter || shooter.kickCooldown > 0) return;
  match.endPassMove(shooter.side); // a strike ends the passing move (Phase 33)
  const team = match.teams[shooter.side];
  const opp = match.teams[1 - shooter.side];
  const gk = opp.goalkeeper;

  // Aim for the corner away from the keeper. Finishing has two channels:
  // confident finishers aim closer to the post (bigger keeper-evasion, riskier
  // margin) AND group their shots tighter.
  const goalX = team.attackDir * HALF_L;
  // 1.5 → 1.2 in Phase 30.4 (dare the corners), → 1.3 in Phase 31's
  // retune: with chance volume restored (open runs, cutbacks, routines)
  // the trade flips back toward failure mode 16a — a slightly safer aim
  // keeps more strikes on the frame while the keeper still can't reach
  // the corner.
  // The clinical trait (Phase 39) shaves another 0.1 off the post —
  // floored at 0.4 (the base formula's own minimum at finishing 1.0):
  // an elite finisher who ALSO shaved 0.1 aimed past the optimum and
  // converted less (caught by the finishing-conversion invariant test).
  // Finishing slope 0.9 → 0.6 (Phase 47): the eras of churn since 31.5
  // (36.1 carries, 38 contact, 46 keeper envelope) had pushed the corner
  // dare past its optimum again — by phase-46 the hi-fin conversion edge
  // measured +1.3pp ≈ noise and the invariant test finally flipped.
  // Swept {0.9, 0.75, 0.6, 0.5} at 540 matches: 0.6 restores +2.1pp
  // (hi 28.9% vs lo 26.8%) — the finisher backs off the post just enough
  // that the tight grouping cashes.
  const aimMargin = Math.max(
    0.4,
    1.3 - shooter.attrs.finishing * 0.6 - (shooter.traits.includes('clinical') ? 0.1 : 0),
  );
  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  const target = v2(goalX, aimY);

  const q = shotQuality(match, shooter);
  const d = dist(shooter.pos, target);
  const pressure = pressureAt(shooter.pos, opp.players);
  // Composed 1v1 (Phase 28.4): nobody goal-side but the keeper — the shooter
  // PICKS a spot: tighter to the post, tighter grouping. Without this the
  // breakaway-finish appetite just fed the keeper from 15m.
  let oneVone = true;
  for (const o of opp.players) {
    if (o.role === 'GK' || o.sentOff) continue;
    if (dist(o.pos, goalCenterFor(team)) < d - 1) {
      oneVone = false;
      break;
    }
  }
  const aimTarget = oneVone
    ? v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin * 0.72))
    : target;
  const aim = norm(sub(aimTarget, shooter.pos));
  // Long-range and pressured shots spray more; finishers spray less. A shot
  // snatched against the body's facing (Phase 27) sprays more and loses power.
  const misalign = kickMisalignment(shooter, aim);
  // Spread base 0.029 → 0.025 in 29.1, → 0.022 in Phase 30: set defences
  // (formations) mean almost every shot is a contested one now — tighter
  // base grouping keeps the on-target share honest without touching the
  // pressure physics (failure mode 16: aim/spread beat reach/saveP here).
  const spread =
    (0.022 + d * 0.0028 + pressure * 0.05) *
    (1.45 - shooter.attrs.finishing * 0.9) *
    (oneVone ? 0.7 : 1) *
    orientationNoiseMul(misalign, shooter.attrs.dribbling);
  const dir = rotate(aim, match.rng.gaussian() * spread);

  // The placed curler (Phase 37): technique bends the strike around the
  // dive. Launch pre-compensated by −spin·T/2 so the chord still crosses
  // the frame where the aim pointed; lateral drift = spin·vx, so the sign
  // that bends AWAY from the keeper is sign(Δy·dirx).
  const curl =
    (Math.sign((aimTarget.y - gk.pos.y) * dir.x) || 1) * (0.1 + shooter.attrs.dribbling * 0.2);
  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
  const shotT = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / v0, 0.85)) / BALL_FRICTION_K;
  match.kickBall(shooter, rotate(dir, -curl * shotT * 0.5), v0);
  match.ball.spin = curl;
  team.stats.shots++;
  team.stats.xg += q;
  match.stat(shooter.gid).shots++;

  // Dive difficulty, frozen at the moment of the strike (keeper reaction) —
  // priced on the CHORD, discounted for the bend the dive can't fully read.
  const difficulty = Math.max(
    0.25,
    diveDifficulty(match.ball.pos, dir, gk, opp) * (1 - Math.abs(curl) * 0.12),
  );

  // Assist credit if this shot scores: the completed pass that set it up.
  const lpForAssist = match.lastCompletedPass;
  const assistGid =
    lpForAssist && lpForAssist.receiverGid === shooter.gid && match.simTime - lpForAssist.t < 3
      ? lpForAssist.passerGid
      : null;

  match.markShotOutcome('miss'); // close out any still-pending previous shot
  match.shotLog.push({
    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  });
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

/**
 * Direct free kick (Phase 32): the curl over the wall. Closed-form
 * parabola through TWO constraints — z ≥ 2.6m at the wall line (above the
 * outfield header band, 2.5m: a wall that can contest the climb eats
 * every kick, the 31.9 corner-sentry lesson) and a chosen arrival height
 * under the bar — then the usual shot bookkeeping so saves/goals/xG all
 * ride the pendingShot machinery.
 */
export function performFreeKick(match: Match, taker: Player): void {
  if (match.ball.owner !== taker || taker.kickCooldown > 0) return;
  const team = match.teams[taker.side];
  const opp = match.teams[1 - taker.side];
  const gk = opp.goalkeeper;
  const ball = match.ball;

  const goalX = team.attackDir * HALF_L;
  // Specialists shave the post; timid takers aim well inside it.
  const aimMargin = 1.05 - taker.attrs.finishing * 0.55;
  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  const target = v2(goalX, aimY);
  const d = dist(ball.pos, target);

  // Solve the flight: z(a·T) = 2.6 at the wall (a = wallDist/d) and
  // z(T) = zg at the goal ⇒ T² = (2.6 − a·zg) / (G/2 · a(1−a)).
  // The arrival height DRAWS high (up to ~2.75): everything above the bar
  // is the classic blazed-over-the-wall miss — without it every strike
  // arrived under the bar by construction and conversion tripled.
  const zg = 0.85 + match.rng.range(0, 1.9);
  // The wall's REAL distance from the release point (the taker may stand
  // up to ~1.3m off the spot and kickBall releases 0.9m ahead — assuming
  // a spot-kick left the climb at ~2.2m over the heads, inside the header
  // band, instead of the designed 2.6).
  let wallD = CORNER_CLEARANCE - 0.9;
  if (match.fkWall) {
    const own = v2(team.attackDir * HALF_L, 0);
    const center = add(match.fkWall.pos, scale(norm(sub(own, match.fkWall.pos)), CORNER_CLEARANCE + 0.15));
    wallD = dist(ball.pos, center) - 1.4; // release offset + safety margin
  }
  // The banana's price (Phase 37): a curled launch leaves the straight
  // line, and the climb's header-band segment sweeps past the wall's edge
  // bodies — the solver buys extra clearance per unit of spin (the first
  // cut at spin ≤0.7 with plain 2.6 put 4/30 walls back in the header
  // game, the exact 31.9 sentry failure the invariant test pins).
  const spinMag = 0.25 + taker.attrs.passing * 0.25;
  const a = clamp(wallD / d, 0.12, 0.6);
  const wallClear = 2.6 + spinMag * 0.5;
  const T = clamp(Math.sqrt(Math.max(0.4, (wallClear - a * zg) / ((GRAVITY / 2) * a * (1 - a)))), 0.9, 1.9);
  const vz = (zg + (GRAVITY / 2) * T * T) / T;
  const speed = d / T;

  // Placed ball, full run-up: no orientation penalties, tight spread that
  // finishing tames — the free kick is the specialist's shot.
  const spread = (0.034 + d * 0.001) * (1.35 - taker.attrs.finishing * 0.7);
  const aim = norm(sub(target, ball.pos));
  const dir = rotate(aim, match.rng.gaussian() * spread);

  // Direct FKs convert ~4-8% in the real game — the xG entry says so.
  const q = clamp(0.09 - (d - 17) * 0.003, 0.02, 0.12);

  // The banana ball (Phase 37): the specialist's strike curls AWAY from
  // the keeper toward the chosen corner — over the wall on the solver's
  // flight, bending across the frame. Launch pre-compensated by −spin·T/2
  // (the chord still crosses at the aim point); the curl prices the dive.
  // Lateral (y) drift of a spinning ball = spin·vx, so the sign that
  // drifts from the keeper toward the chosen corner is sign(Δy·vx).
  const curlSign = Math.sign((target.y - gk.pos.y) * dir.x) || 1;
  const spin = curlSign * spinMag;
  const kickPos = v2(ball.pos.x, ball.pos.y);
  match.kickBall(taker, rotate(dir, -spin * T * 0.5), speed, vz);
  ball.spin = spin;
  team.stats.shots++;
  team.stats.xg += q;
  match.stat(taker.gid).shots++;

  // The dive prices the CHORD (where the arc actually crosses the frame)
  // plus the late bend the keeper cannot fully read.
  const difficulty = Math.max(0.25, diveDifficulty(kickPos, dir, gk, opp) * (1 - Math.abs(spin) * 0.12));

  match.markShotOutcome('miss'); // close out any still-pending previous shot
  match.shotLog.push({
    t: match.simTime, minute: match.minute(), side: taker.side, xg: q, outcome: 'pending',
    blockers: 0, // the wall is cleared by construction; blocks don't apply
  });
  match.pendingShot = {
    side: taker.side,
    shooterGid: taker.gid,
    xg: q,
    t: match.simTime,
    resolved: false,
    logIndex: match.shotLog.length - 1,
    difficulty,
    assistGid: null, // a placed ball has no assist
    placed: true,
  };
  match.pushEvent('shot', taker.side, `${taker.name} bends the free kick! (xG ${q.toFixed(2)})`);
}

/**
 * The dribble PUSH (Phase 36, 可见的触球): the carrier knocks the ball
 * ahead along his heading and chases it. The ball is a free body until he
 * re-collects (the push-scaled poke window an opponent in
 * the path plays the BALL in). Push length grows with open field ahead
 * (knock-and-run down the wing) and wobbles with poor technique; sprint
 * speed carries into the ball, so close control at walking pace stays
 * naturally tight.
 */
export function performDribbleTouch(match: Match, p: Player): void {
  const ball = match.ball;
  if (ball.owner !== p) return;
  const opp = match.teams[1 - p.side];
  // Open field ahead: nearest opponent inside a forward cone prices the push.
  const hx = p.heading.x;
  const hy = p.heading.y;
  let aheadD = 14;
  for (const o of opp.players) {
    if (o.sentOff) continue;
    const dx = o.pos.x - p.pos.x;
    const dy = o.pos.y - p.pos.y;
    const along = dx * hx + dy * hy;
    // The keeper's stopping power starts upfield of his body (Phase 46):
    // a loose roll entering his rush envelope is collected, full stop —
    // outfielders must WIN the ball, so they price at body position.
    const eff = o.role === 'GK' ? along - GK_RUSH_ENVELOPE : along;
    if (along < 0 || eff > 14) continue;
    const perp = Math.abs(dx * hy - dy * hx);
    if (perp > along * 0.7 + 1) continue; // outside the ~70° cone
    if (eff < aheadD) aheadD = Math.max(eff, 0);
  }
  // Carry regimes (36.1): the open cone ahead PRICES the touch — a
  // stride-length nudge in traffic (一步一带), a real knock into open
  // grass (爆趟). Technique shortens and steadies both.
  const open = Math.min(Math.max(aheadD - 2, 0), 9);
  let push = (TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - p.attrs.dribbling * 0.15);
  // The line guard (36.1): a knock that would roll into touch is halved —
  // real wingers shorten the touch at the line (12.9% of pushes rolled
  // dead/out at the first cut).
  const rollEst = push; // rolled meters ≈ push m/s over ~1s of decay
  if (
    Math.abs(p.pos.y + hy * (rollEst + 2)) > HALF_W - 1 ||
    Math.abs(p.pos.x + hx * (rollEst + 2)) > HALF_L - 1
  ) {
    push *= 0.5;
  }
  const speed = Math.hypot(p.vel.x, p.vel.y) + Math.max(push, 0.8);
  // A heavy first touch is a WOBBLY one: direction noise priced by technique.
  const noise = match.rng.gaussian() * 0.07 * (1.35 - p.attrs.dribbling * 0.7);
  const dir = rotate(v2(hx, hy), noise);
  ball.owner = null;
  ball.lastTouch = p;
  ball.vel = scale(dir, speed);
  ball.z = 0;
  ball.vz = 0;
  // The regather window follows the push: a knock is a chase, a dribble
  // touch comes back underfoot within the stride.
  p.kickCooldown = TOUCH_RECOLLECT_BASE + push * TOUCH_RECOLLECT_PER_PUSH;
  match.dribbleTouch = { gid: p.gid, until: match.simTime + 1.6 };
}

export function performClear(match: Match, p: Player): void {
  if (match.ball.owner !== p || p.kickCooldown > 0) return;
  match.endPassMove(p.side); // a hoof is not part of a passing move (Phase 33)
  const team = match.teams[p.side];
  // Hoof it upfield with a wide lateral component — safety over precision.
  // Panicked clears regularly cross the touchline: conceding a kick-in beats
  // losing the ball in front of your own goal (this is where kick-ins come from).
  const lat = match.rng.range(-1.0, 1.0);
  const aim = norm(v2(team.attackDir, lat));
  const dir = rotate(aim, match.rng.gaussian() * 0.08);
  // A clear hammered against the body's facing comes off weaker (Phase 27) —
  // at half strength: a panic hoof is a compromise, not a fifty-fifty gift.
  // Since Phase 28 the hoof goes UP as well as out: it hangs uninterceptable
  // over midfield and comes down as an aerial contest, like a real clearance.
  match.kickBall(
    p,
    dir,
    23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.passing * 0.4)),
    match.rng.range(3.2, 5.4),
  );
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
  // Blind-side honesty (Phase 59): same convention as attemptFirstTouch —
  // ball arriving at the face = 0, from behind the body = 1. The retreating
  // defender with a pull-back zipping behind his heels mostly whiffs; the
  // set, facing interceptor keeps his old numbers. This is what makes the
  // collapsed block's ceded arc a REAL payoff (the N1.5 counter surface).
  const dir = norm(ball.vel);
  const blind = (1 + (dir.x * p.heading.x + dir.y * p.heading.y)) / 2;
  const pDef = clamp(
    (0.24 + p.attrs.defending * 0.4 - (speed - 14) * 0.02) * (1 - blind * DEFLECT_BLIND_PEN),
    0.05, 0.6);
  if (!match.rng.chance(pDef)) return; // it zips past the outstretched leg
  ball.lastTouch = p;
  ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
  p.tackleAnimTimer = 0.4; // the stretch is visible (display only)
}

/**
 * Smother (Phase 27.5): a rushing keeper who reaches the carrier's ball
 * dives on it. Reflexes vs the carrier's close control decide it; a win is
 * a keeper claim (hands, hold state), a loss leaves the keeper on the floor
 * — and occasionally a clumsy challenge that concedes the foul (a penalty,
 * in the box where rushes live). Since Phase 28 a keeper does NOT need to
 * be mid-rush: a carrier who dribbles into the keeper's face inside the box
 * gets smothered at the feet the same way — you can go past the keeper,
 * you cannot stand on their toes and keep the ball forever.
 */
export function trySmother(match: Match): void {
  const owner = match.ball.owner;
  if (!owner || owner.gkHoldTimer > 0) return;
  const gk = match.teams[1 - owner.side].goalkeeper;
  if (gk.sentOff || gk.stunTimer > 0 || gk.kickCooldown > 0 || gk.tackleCooldown > 0) return;
  const rushing = gk.action.type === 'GoalkeeperRush';
  // Hands only inside the box (Phase 28.5, user report "门将出击到禁区外用手
  // 接球了"): the smother IS a dive ONTO the ball with the hands, so it may
  // only happen in the keeper's own area — even mid-rush. A sweeper who
  // rushes past his line closes the angle, but a ball out there he takes with
  // his feet (giveBall) or not at all; he cannot claim it here.
  if (!match.inPenaltyBox(match.ball.pos, gk.side)) return;
  if (dist(gk.pos, match.ball.pos) >= 1.3) return;

  gk.saveAnimTimer = 0.7; // the dive at the feet is visible either way
  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
  if (match.rng.chance(pWin)) {
    match.teams[gk.side].stats.saves++;
    match.stat(gk.gid).saves++;
    owner.kickCooldown = 0.4;
    owner.stunTimer = 0.4; // ran into a wall of keeper
    match.pushEvent('save', gk.side, `${gk.name} smothers at ${owner.name}'s feet!`);
    match.giveBall(gk); // hold state engages — hands, untackleable
  } else {
    gk.stunTimer = 0.8; // beaten — picking himself up off the turf
    // A long recovery before RE-CHALLENGING (Phase 28.2): a keeper who dove
    // again every 1.3s read as convulsing. tackleCooldown — NOT kickCooldown
    // — so a loose ball at his feet can still be scooped up the moment the
    // stun ends (kickCooldown also gates ball pickup in tryCapture).
    gk.tackleCooldown = 1.2;
    // A full-speed rush is clumsier than a standing challenge at the feet.
    if (match.rng.chance(rushing ? 0.12 : 0.03)) match.awardFoul(gk, owner);
  }
}

/**
 * The professional foul (Phase 29.1): a breakaway carrier has beaten the
 * field — nobody but the keeper goal-side — and a chasing defender close
 * enough to reach the shirt but not the ball hauls them down from behind.
 * Play stops (the carrier does NOT keep the ball, so the advantage rule
 * cannot apply): free kick + a near-automatic card via `awardTacticalFoul`.
 * Never in the defender's own box — professionals concede the free kick,
 * not the penalty. This is the counterweight to offside-era breakaways
 * where the chasing pack could only eat exhaust fumes: pace still wins the
 * race (a >1.7m gap is uncatchable), but a caught runner gets fouled.
 */
export function tryTacticalFoul(match: Match): void {
  const owner = match.ball.owner;
  if (!owner || owner.gkHoldTimer > 0) return;
  const attTeam = match.teams[owner.side];
  const defTeam = match.teams[1 - owner.side];
  const goal = attTeam.oppGoal();
  const dGoal = dist(owner.pos, goal);
  // Only DESPERATE territory: the carrier is bearing down on the edge of
  // the danger zone (16–34m out — inside is the box/keeper duel, further
  // out the defence still trusts the recovery). The high offside line
  // makes "nobody goal-side" routine, so without this band every line
  // break got hauled down and cards hit 8/match.
  if (dGoal < 16 || dGoal > 34) return;
  // Only a genuine breakaway: carrier at a real sprint, driving at goal.
  if (len(owner.vel) < 4.5) return;
  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  if (match.inPenaltyBox(match.ball.pos, defTeam.side)) return;
  for (const o of defTeam.players) {
    if (o.role === 'GK' || o.sentOff) continue;
    if (dist(o.pos, goal) < dGoal - 1) return; // covered — let the race run
  }
  // The nearest ready chaser in grab range BEHIND the carrier (a defender
  // in FRONT can still play the ball honestly — that's tryTackles' job).
  let grabber: Player | null = null;
  let best = Infinity;
  for (const o of defTeam.players) {
    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
    const d = dist(o.pos, owner.pos);
    if (d > 1.7) continue;
    const bx = o.pos.x - owner.pos.x;
    const by = o.pos.y - owner.pos.y;
    if (bx * owner.vel.x + by * owner.vel.y > 0) continue;
    if (d < best) {
      best = d;
      grabber = o;
    }
  }
  if (!grabber) return;
  grabber.tackleCooldown = 2.0; // committed either way — one grab per chase, not spam
  grabber.spendBurst(TACKLE_LUNGE_COST); // the grab is a burst too (Phase 58)
  // Cynicism is RARE (~1/match), aggression-flavored, and a booked man keeps
  // his hands to himself (the second yellow is the whole deterrent).
  let p = 0.06 + defTeam.genome.markingAggression * 0.1;
  if (grabber.booked) p *= 0.3;
  // The free kick has TEETH now (Phase 32): hauling a man down inside the
  // direct-FK band hands the specialist a real strike at goal — the
  // professional weighs that and lets some breaks run.
  if (dGoal < 28) p *= 0.6;
  if (!match.rng.chance(p)) return;
  grabber.tackleAnimTimer = 0.4;
  match.awardTacticalFoul(grabber, owner);
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
  tackler.spendBurst(TACKLE_LUNGE_COST); // win or whiff, the lunge costs legs (Phase 58)

  // Team aggression + the tackler's defending vs the carrier's evasion. The
  // carrier resists two UNBIASED ways (attrs/genes, never role): close control
  // — technique + the team's dribble philosophy — shields and turns a standing
  // challenge; PACE only pays with a running start. `drive` is the carrier's
  // momentum (~0 jostling in a crowd, ~0.5 at the 4.5 m/s the cynical-foul code
  // already treats as a "real sprint", ~1 flat out), so a quick player driving
  // into space is hard to dispossess while a fast one hemmed in gets nothing
  // from it. That momentum gate is the space payoff — you can only build speed
  // where there's room ahead (the flanks, the channels), so wide/quick play
  // earns a duel edge the compact clump can't, giving width a gradient to climb
  // (the master gate, Phase 41). Base carries Phase 27's whiff-stun raise.
  const drive = clamp(len(owner.vel) / 9, 0, 1);
  // strength SHIELDS the standing challenge (Phase 47 — the hold-up/pivot
  // payoff): base 0.21→0.25 with −strength·0.10 so the POPULATION mean
  // (backfill 0.4) lands exactly where phase-46 left it; the gradient is
  // what's new, not the league tackle rate.
  // defending 0.24→0.34 (Phase 48): the wage cap exposed defending as
  // UNDER-PRICED — whole leagues drained DF points to fund attack (evo-drift
  // DFdef 0.63→0.52, goals →3.1-3.4). A stronger per-point payoff makes the
  // defensive spend competitive again (swept {0.24,0.30,0.34}: reference-seed
  // goals 3.07→2.87→2.65).
  let p =
    0.25 +
    oppTeam.genome.markingAggression * 0.2 +
    tackler.attrs.defending * 0.34 -
    match.teams[owner.side].genome.dribbleBias * 0.08 -
    owner.attrs.dribbling * 0.18 -
    owner.attrs.strength * 0.1 -
    owner.attrs.pace * drive * 0.2;
  if (oppTeam.mode === 'Press') p += 0.06;
  if (tackler.traits.includes('enforcer')) p += 0.04; // the destroyer (Phase 39)
  p = clamp(p, 0.06, 0.7);

  if (match.rng.chance(p)) {
    oppTeam.stats.tackles++;
    match.stat(tackler.gid).recoveries++;
    // No feed event — tackles are too frequent to narrate; stats + debug show them.
    ball.owner = null;
    ball.lastTouch = tackler;
    // The won ball travels (Phase 28.4, further in 29.1): a real tackle
    // knocks it CLEAR of the boot zone — short squirts re-fed the same
    // scramble endlessly, and the offside-compressed midfield made every
    // re-contest pull in more bodies.
    ball.vel = fromAngle(match.rng.range(0, Math.PI * 2), match.rng.range(5.5, 10));
    owner.kickCooldown = 0.3;
    owner.stunTimer = 0.6; // dispossessed: stumble before rejoining play (Phase 27)
    tackler.tackleCooldown = 0.5;
    // The tackle knocks it LOOSE — it does not hand it over (Phase 31.9,
    // user report "抢断后几乎直接被对方控制,和拦截没有区别"): the tackler
    // is committed to the lunge and may not hoover his own squirt. Probed
    // before this line: 85% of won tackles were re-captured BY THE TACKLER
    // within 0.19s — the squirt was cosmetic and every dispossession read
    // as an instant possession flip. Now the loose ball belongs to the
    // third man: interception = clean takeaway, tackle = contested ball.
    tackler.kickCooldown = 0.5;
    match.possessionSide = -1;
  } else {
    tackler.tackleCooldown = 1.2;
    tackler.stunTimer = 0.35; // whiffed lunge: pick yourself up first (Phase 27)
    // A failed lunge is sometimes a foul (Phase 20): free kick, or a penalty
    // in the tackler's own box. Aggressive markers give more away.
    const foulP =
      0.06 + oppTeam.genome.markingAggression * 0.1 +
      (tackler.traits.includes('enforcer') ? 0.02 : 0) +
      (match.derby ? 0.01 : 0); // derbies bite (Phase 40)
    if (match.rng.chance(foulP)) match.awardFoul(tackler, owner);
  }
}

/**
 * Shot blocks (Phase 31): a defender the ball passes within reach of gets a
 * real chance to throw a body in — the cost of daring a blocked lane that
 * `laneBlockers` warned the shooter about. Explicitly ON the pendingShot
 * path: 30.4 removed shots from the leg-deflection window because that
 * friction accident silently ate the league's goals (failure mode 18c);
 * this is the honest, tuned replacement. Ground-height drives only — a
 * rising ball clears the legs. One roll per defender per shot (the lunge
 * commits their kickCooldown either way); a successful block kills the
 * shot into a slow ricochet off the blocker — lastTouch transfers, so a
 * deflection behind the line is a corner, real-law.
 */
export function tryShotBlock(match: Match): void {
  const shot = match.pendingShot;
  const ball = match.ball;
  if (!shot || shot.resolved || ball.owner !== null) return;
  if (ball.z > 1.1) return; // over the legs and bodies
  const defTeam = match.teams[1 - shot.side];
  if (dist(ball.pos, defTeam.ownGoal()) < 6) return; // the goalmouth is the keeper's
  for (const o of defTeam.players) {
    if (o.role === 'GK' || o.sentOff || o.stunTimer > 0 || o.kickCooldown > 0) continue;
    const dx = o.pos.x - ball.pos.x;
    if (dx >= 0.9 || dx <= -0.9) continue;
    const dy = o.pos.y - ball.pos.y;
    if (dy >= 0.9 || dy <= -0.9) continue;
    if (Math.sqrt(dx * dx + dy * dy) >= 0.9) continue;
    o.kickCooldown = 0.45; // committed to the block, ball met or not
    o.tackleAnimTimer = 0.4;
    // The UNSET WALL (Phase 60): a set, facing body keeps its full block;
    // the mid-collapse retreater mostly fails to organize in front of a
    // first-time hit. Same principle the shoot appetite prices via
    // blockReadiness — but at CONTACT range the bearing to the ball is
    // unstable (a drive shaving past reads perpendicular), so the facing
    // term here is the ball's INCOMING direction (the tryDeflection blind
    // convention): you block what you can see coming.
    const bdir = norm(ball.vel);
    const blind = (1 + (bdir.x * o.heading.x + bdir.y * o.heading.y)) / 2;
    const stillness = clamp01((3.5 - len(o.vel)) / 2.5);
    const readiness = UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * (1 - blind) * stillness;
    if (!match.rng.chance((0.32 + o.attrs.defending * 0.25) * readiness)) continue;
    defTeam.stats.blocks++;
    ball.lastTouch = o;
    const away = match.rng.chance(0.5) ? 1 : -1;
    ball.vel = scale(rotate(norm(ball.vel), away * match.rng.range(0.7, 2.4)), match.rng.range(4.5, 9));
    ball.vz = 0;
    match.pushEvent('info', o.side, `${o.name} throws a body in front of it!`);
    match.markShotOutcome('miss');
    match.pendingShot = null;
    return;
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
  if (ball.z > GK_CLAIM_HEIGHT) return; // sailing over the keeper's hands
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
  // 0.70 → 0.66 in Phase 29, → 0.63 in 29.1, → 0.48 in Phase 30: every
  // 30.x structure (6th defender, formations, set keeper distributions)
  // deleted another slice of the cheap goals-above-xG (breakaways,
  // scrambles, gifted distributions) that used to carry the scoreline —
  // 29.2's goals ran +36% OVER xG, 30.3's ran dead even. The shots that
  // survive a set defence are earned; they convert better. Same trade as
  // 28.1/29.1, one size bigger.
  // A placed ball (Phase 32): the keeper is SET and expecting the strike —
  // the reaction-time difficulty discount barely applies (floor 0.85) and
  // the base is a set keeper's, not a scrambling one's. Without this the
  // far-corner curl carried difficulty ~0.25 and 67% of on-target free
  // kicks went in (probed) — real keepers save most on-frame FKs.
  const saveP = shot.placed
    ? clamp(0.7 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) *
      Math.max(shot.difficulty, 0.85)
    : clamp(0.48 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) * shot.difficulty;

  if (match.rng.chance(saveP)) {
    shooterTeam.stats.shotsOnTarget++;
    defTeam.stats.saves++;
    match.stat(gk.gid).saves++;
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
