Reading prompt from stdin...
OpenAI Codex v0.145.0
--------
[1mworkdir:[0m /Users/jamie/Documents/Promptfoo/evofootball-arena
[1mmodel:[0m gpt-5.6-sol
[1mprovider:[0m openai
[1mapproval:[0m never
[1msandbox:[0m read-only
[1mreasoning effort:[0m xhigh
[1mreasoning summaries:[0m none
[1msession id:[0m 019f9f54-5a7c-7403-b9d2-1eaea865caee
--------
[36muser[0m
You are a meticulous simulation auditor with strong knowledge of real
football (association football) physics, physiology and match statistics.

CONTEXT
A deterministic 6v6 football simulation lives in this repo (TypeScript).
Its house rules distinguish three kinds of numeric constants:
- ANCHORED: tied to a real-world measurable (units of m, s, m/s, rates)
  and defensible against published real-football data;
- MEASURED: derived from the sim's own censuses/experiments (these are
  documented elsewhere and are NOT your focus);
- DESIGNED: deliberate game-design choices (arcade deviations, pacing),
  legitimate but must be labeled as such.

The main constants live in src/sim/constants.ts; more numeric literals are
embedded in src/sim/mechanics.ts, src/sim/Ball.ts, src/sim/Player.ts and
src/sim/prediction.ts. The pitch is scaled (FIELD_SCALE 0.7-style density
choices are known design decisions).

TASK
Build the first draft of a REALISM LEDGER:
1. Enumerate every numeric constant in src/sim/constants.ts (name, value,
   unit if inferable, what it governs — read usage sites when unclear).
   Add important inline literals from the other files listed above when
   they materially shape play (speeds, radii, timings, probabilities).
2. For each: propose a classification (ANCHORED / DESIGNED / UNCLEAR —
   leave MEASURED to the team) with one line of reasoning.
3. For every constant you classify ANCHORED or UNCLEAR that has a real-
   football counterpart: give the real-world anchor value/range from
   published knowledge (e.g. sprint speeds, pass/shot ball speeds,
   reaction times, match event rates), with the source named (study,
   dataset, or well-established rule of thumb — be honest about
   confidence), and flag constants that sit OUTSIDE the plausible real
   range given the sim's known 0.7 spatial scale.
4. End with a shortlist: the 10 constants whose realism most deserves
   scrutiny, ranked, each with why.

OUTPUT
A markdown table per file plus the ranked shortlist. Do not propose code
changes; this is an audit ledger, not a patch.

[2m2026-07-26T16:48:53.683851Z[0m [31mERROR[0m [2mrmcp::transport::worker[0m[2m:[0m worker quit with fatal: Transport channel closed, when UnexpectedServerResponse("HTTP 401: {\"error\":\"unauthorized\",\"message\":\"A valid Bearer API key is required.\"}")
[35m[3mcodex[0m[0m
I’ll trace every declaration in `constants.ts`, then follow its usage so the ledger describes actual mechanics rather than names alone. I’ll separately inventory play-shaping literals in the four requested files and validate real-world counterparts against published football/biomechanics sources.
  [36m→[0m Inspect constants and all requested mechanics files; inventory numeric values and usage sites
  [2m•[0m [2mResearch authoritative real-football anchors and scaling implications[0m
  [2m•[0m [2mClassify each entry and assemble per-file markdown ledgers[0m
  [2m•[0m [2mRank the 10 highest-priority realism questions and verify coverage[0m
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "sed -n '1,260p' src/sim/constants.ts && sed -n '1,320p' src/sim/mechanics.ts && sed -n '1,280p' src/sim/Ball.ts && sed -n '1,320p' src/sim/Player.ts && sed -n '1,280p' src/sim/prediction.ts"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[31m exited 1 in 0ms:[0m
/** All simulation units are meters / seconds. Coordinates: origin at pitch
 * center, +x toward the right goal, +y downward on screen. Team 0 attacks +x,
 * team 1 attacks -x (no side swap at half time — keeps formation math simple).
 *
 * Boundaries are real (Phase 14): a ball over the touchline is a kick-in,
 * over the goal line a corner or goal kick. Restarts are live dead-ball
 * phases — the clock runs while the taker walks over and defenders reshape.
 */
/** Read a positive probe-only scale without introducing browser assumptions. */
const positiveEnv = (key: string): number | undefined => {
  const raw = typeof process !== 'undefined' && process.env ? Number(process.env[key]) : NaN;
  return Number.isFinite(raw) && raw > 0 ? raw : undefined;
};

/**
 * World-model parameter authority (M0, docs/world-model/FOUNDATION.md).
 *
 * `PITCH_SCALE` used to couple field density, goal width, penalty-box geometry,
 * and the centre circle. These independent dimensions are backfilled to the
 * exact values that shipped before M0: field + goal/box at 0.70; bodies,
 * control reach, and speed/time at their unscaled 1.00 values. A legacy
 * PITCH_SCALE env value still feeds the two formerly-coupled geometry scales
 * when their new explicit env keys are absent, so old density-probe commands
 * remain reproducible without keeping an ambiguous runtime constant.
 */
const LEGACY_PITCH_SCALE = positiveEnv('PITCH_SCALE');
export const FIELD_SCALE = positiveEnv('FIELD_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
export const GOAL_AND_BOX_SCALE =
  positiveEnv('GOAL_AND_BOX_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
export const BODY_SCALE = positiveEnv('BODY_SCALE') ?? 1;
export const CONTROL_REACH_SCALE = positiveEnv('CONTROL_REACH_SCALE') ?? 1;
export const SPEED_TIME_SCALE = positiveEnv('SPEED_TIME_SCALE') ?? 1;

export const PITCH_LENGTH = 90 * FIELD_SCALE;
export const PITCH_WIDTH = 58 * FIELD_SCALE;
export const HALF_L = PITCH_LENGTH / 2;
export const HALF_W = PITCH_WIDTH / 2;

/** A ball over the GOAL line (a wide or over-the-bar shot) coasts this long
 * before its corner / goal-kick is awarded (Phase 41.1) — it reads as sailing
 * OUT, not vanishing the instant it crosses. Goal-line only; touchline kick-ins
 * stay instant. Goal detection runs first and is frozen out during the coast,
 * so a wide ball drifting behind the line can never register a phantom goal. */
export const OUT_PLAY_COAST = 0.5;

export const GOAL_WIDTH = 7 * GOAL_AND_BOX_SCALE;
export const GOAL_DEPTH = 2.2;
/** Crossbar height (m) — a ball crossing the goal line above this is OVER the bar. */
export const GOAL_HEIGHT = 2.44;
export const BOX_DEPTH = 13 * GOAL_AND_BOX_SCALE;
export const BOX_WIDTH = 28 * GOAL_AND_BOX_SCALE;
export const CENTER_CIRCLE_R = 7 * FIELD_SCALE;

/** Fixed simulation timestep (s). */
export const DT = 1 / 60;
/** Default full match duration in sim-seconds (2 halves). Display clock maps this to 90'. */
export const MATCH_DURATION = 240;
/**
 * Max sim-seconds a half runs past its nominal end waiting for a safe break
 * (Phase 27.4 stoppage time) — ≈3 added display minutes on the 90' clock.
 */
export const STOPPAGE_MAX = 8;

/**
 * The currently shipped turf response, named as one authority so a later
 * factorial can compare surfaces without scattering friction/bounce edits.
 * M0 adds no alternative profile and no runtime selection.
 */
export interface SurfaceProfile {
  readonly id: 'current';
  readonly ballFrictionK: number;
  readonly ballBounce: number;
  readonly bounceDamp: number;
  readonly bounceMinVz: number;
  readonly airSpinDecay: number;
  readonly groundSpinDecay: number;
  readonly bounceSpinRetention: number;
}

export const SURFACE_PROFILE: SurfaceProfile = Object.freeze({
  id: 'current',
  ballFrictionK: 0.55,
  ballBounce: 0.45,
  bounceDamp: 0.72,
  bounceMinVz: 2.2,
  airSpinDecay: 0.25,
  groundSpinDecay: 1.5,
  bounceSpinRetention: 0.55,
});

/** Ball exponential velocity decay per second: v *= exp(-K * dt). */
export const BALL_FRICTION_K = SURFACE_PROFILE.ballFrictionK;
export const BALL_AIR_SPIN_DECAY = SURFACE_PROFILE.airSpinDecay;
export const BALL_GROUND_SPIN_DECAY = SURFACE_PROFILE.groundSpinDecay;
export const BALL_BOUNCE_SPIN_RETENTION = SURFACE_PROFILE.bounceSpinRetention;

/* ---- The energy economy (Phase 58 — it BINDS now) ---- */
/**
 * The N1 matrix probe found the meta uncounterable and the phase-58
 * diagnostic found out why nothing tires it: full-time stamina sat at
 * 0.98-0.99 (recovery 0.014/s dwarfed drain 0.006·e²/s), so every payoff
 * built on fatigue — the stamina attribute, staminaConservation's
 * "fresher legs late", the tired-legs brain gate — was dead. Repriced so
 * a match SPENDS legs: sustained sprinters finish ~0.6-0.8, patient
 * sides ~0.9. Sweep + gates in the phase-58 ledger entry.
 */
export const STAMINA_DRAIN = 0.01;
export const STAMINA_RECOVERY = 0.009;
/**
 * A tackle lunge is a burst the movement integral never saw (the lunge is
 * instantaneous): each attempt — win or whiff — costs a flat chunk,
 * scaled by the same per-player drain modifiers. Aggressive markers
 * attempt ~2× a patient side's volume (probe: 9.4 vs 5.2 WON tackles),
 * so relentless pressing now buys its late-game price.
 */
export const TACKLE_LUNGE_COST = 0.02;

/**
 * Blind-side deflection penalty (Phase 59, N1.5 lever 2): you can only
 * stick a leg on a drilled ball you SEE. The cutback anatomy probe found
 * ~60% of pull-backs dying in flight to legs with NO facing check — a
 * defender retreating goalward deflected the ball zipping behind his heels
 * at the same odds as a set, facing interceptor, which re-sealed the very
 * arc the collapsed block cedes. Fully blind ⇒ deflection odds ×(1−this);
 * facing ⇒ unchanged. Buffs every DRILLED delivery (cutbacks, driven
 * switches, hard through balls) against unset bodies only.
 */
export const DEFLECT_BLIND_PEN = 0.75;
/**
 * The same seeing-the-ball principle at the CAPTURE contact (Phase 59):
 * the anatomy probe's kill telemetry showed pull-back flights dying 7:1 to
 * the full-capture branch, not the deflection stretch — friction decays a
 * 19 m/s cutback under CONTROL_MAX_SPEED mid-flight, and every bystander
 * within 1.25m then got an UNCONDITIONAL touch (a failed control still
 * squirts the ball = the pass dies either way). Now a bystander must
 * REACT to a live pass rolling past: contact odds fall with ball speed
 * and blind-side arrival; the INTENDED receiver is set for it (exempt),
 * dead/loose scrambles (no pass in flight) keep the old physics.
 */
export const CONTACT_BLIND_PEN = 0.7;
/**
 * The UNSET WALL (Phase 60, N1.5 lever 3): a body on the shot corridor
 * only blocks in FULL when it is set (still) and facing the strike. The
 * cutback anatomy measured 38-50% of delivered pull-backs arriving with a
 * "blocked" corridor whose bodies were 64-83% UNSET — sprinting goalward
 * or blind — and both the shoot decision (laneBlockers-suppressed appetite)
 * and the block physics treated them as a set wall, so the arc arrival
 * recycled instead of striking first-time. Weight per corridor body:
 * this floor + (1−floor)·readiness, readiness = facing · stillness.
 */
export const UNSET_BLOCK_WEIGHT = 0.55;

/**
 * The MEETABLE cross (Phase 63, the route-one channel): open-play crosses
 * used to lead the target by his FULL velocity × flight — the pre-31.9
 * corner bug alive in open play. Probed (aerial-anatomy): as the delivery
 * dropped into the header band the intended target was a median 8-9m away
 * (header reach is 1.35m) — attacker headers ran 1-10% of crosses and 47%
 * died in defenders' laps on the ground. The delivery now leads a MEETABLE
 * fraction of the run, capped in meters: the crasher keeps his momentum
 * (the running jump IS his duel edge) and covers the difference himself
 * (ReceivePass chases the landing).
 */
export const CROSS_LEAD_FRAC = 0.4;
export const CROSS_LEAD_MAX = 3.5;

/* ---- The aerial game (Phase 28) ---- */
/** Gravity on the lofted ball (m/s²). Airborne balls fly friction-free. */
export const GRAVITY = 9.81;
/** Vertical restitution on landing: bounce vz = -vz · this. */
export const BALL_BOUNCE = SURFACE_PROFILE.ballBounce;
/** Horizontal speed kept per bounce (the turf bites). */
export const BOUNCE_DAMP = SURFACE_PROFILE.bounceDamp;
/** Landing slower than this vertically just settles into a roll. */
export const BOUNCE_MIN_VZ = SURFACE_PROFILE.bounceMinVz;
/** Above this height a ball can't be trapped or deflected — only headed. */
export const CONTROL_MAX_HEIGHT = 1.3;
/** Header contest window: ball height where outfielders can attack it... */
export const HEADER_MIN_HEIGHT = 1.35;
export const HEADER_MAX_HEIGHT = 2.5;
/** ...standing within this horizontal radius of the ball. */
export const HEADER_RADIUS = 1.35;
/**
 * Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 —
 * 是不是没有胸部停球"): a ball dropping through the LOWER header band that no
 * opponent is contesting can be CUSHIONED to the feet instead of headed.
 * Heading a hanging ball just nods it to the next man — the endless aerial
 * rally. The take-down is priced by technique/first-touch and spills under
 * pressure (a failed trap keeps the scramble). Ceiling below a leaping
 * header (you can't chest a 2m ball); only a descending/apex ball (vz gate);
 * the trapper must be almost under it (tighter than HEADER_RADIUS).
 */
export const CHEST_TRAP_MAX_HEIGHT = 1.7;
export const CHEST_TRAP_RADIUS = 1.05;
/** Above this upward vz the ball is rising too hard to cushion (just bounced/headed up). */
export const CHEST_TRAP_MAX_VZ = 1.5;
/** Keepers can claim high balls up to here (jump + hands). */
export const GK_CLAIM_HEIGHT = 2.55;
/**
 * Opponents are held this far from a keeper holding the ball in their hands
 * (Phase 28.1) — you can't challenge a keeper in possession, so crowding
 * them was pointless harassment that turned every release into a turnover.
 */
export const GK_HOLD_CLEARANCE = 3;

/** Opponents are held this far from a dead-ball restart spot. */
export const RESTART_CLEARANCE = 6;
/** Corners use the real-law 9.15m (Phase 31.9): the delivery's ascent is
 * inside the header band (z 1.35–2.5) until ~7.8m from the flag, so a
 * sentry camped on the generic 6m edge got a free header at every
 * climbing corner — the silent killer of the whole corner routine. */
export const CORNER_CLEARANCE = 9.15;
/** Penalty spot distance from the goal line — matches the drawn spot (BOX_DEPTH · 0.72). */
export const PENALTY_SPOT_DIST = BOX_DEPTH * 0.72;
/**
 * Everyone except the taker (and the defending keeper, who stands ~9.4m away
 * on the goal line) is held this far from the penalty spot during setup.
 */
export const PENALTY_CLEARANCE = 8;
/** Restart setup: minimum dead-ball time before the kick can be taken... */
export const RESTART_MIN_SETUP = 1.0;
/** ...and a failsafe: after this long the taker kicks from wherever they are. */
export const RESTART_TIMEOUT = 6;

/** A player controls a free ball inside this radius... */
export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;
/**
 * M2 oriented interaction shell. The stable core and ball radius are never
 * scaled by these values — only the leg/foot extension outside them is.
 * Front and lateral contact keep the old CONTROL_RADIUS exactly. Rear contact
 * keeps 90% of the outer extension: close back-heels remain possible, while an
 * edge-of-envelope ball directly behind the body requires a small turn.
 */
export const BALL_ACCESS_SIDE_EXTENSION_FACTOR = 1;
export const BALL_ACCESS_BACK_EXTENSION_FACTOR = 0.9;
// S0 (docs/SUBSTRATE-MAP.md): both sides with a body within this of a loose ball =
// a genuine contest. Classification-only today; the physical 50-50 will use it later.
export const CONTEST_RADIUS = 3;
/** ...if it is slower than this (outfield) — keepers can handle faster balls. */
export const CONTROL_MAX_SPEED = 14;
export const GK_CONTROL_MAX_SPEED = 23;
/**
 * M3 contact→control separation. A foot contact leaves the ball physically
 * free for three fixed ticks before the same body may establish control;
 * another body can contact it during that window and replace the attempt.
 */
export const CONTACT_CONTROL_DELAY_TICKS = 3;
export const CONTACT_COMMIT_TIME = 0.08;
/** Foot follow-through retained after real contact; not available to a fresh claim. */
export const CONTACT_CONTROL_RETENTION_MARGIN = 0.02;
/** Relative normal speed left after a cushioning contact. */
export const CONTACT_RELEASE_MIN_SPEED = 0.25;
export const CONTACT_RELEASE_MAX_SPEED = 1.2;
export const CONTACT_RELEASE_INCOMING_SHARE = 0.12;
/** Tangential relative ball motion survives the contact at this share. */
export const CONTACT_TANGENTIAL_RETENTION = 0.35;
/**
 * Faster balls (hard passes, not shots — SHOT_SPEED is 27) can still be
 * DEFLECTED by a player in their path (Phase 27 lane anticipation).
 */
import { clamp, clamp01 } from '../utils/math';
import {
  add, closestPointOnSegment, dist, dot, len, norm, rotate, scale, sub, v2, type V2,
} from '../utils/vec';
import { laneBlockers, opennessOf, pressureAt } from '../ai/perception';
import { offsideLineLocalX, runBurstPoint } from '../ai/formations';
import {
  BALL_FRICTION_K, BOX_DEPTH, CHEST_TRAP_MAX_HEIGHT, CHEST_TRAP_MAX_VZ, CHEST_TRAP_RADIUS,
  CORNER_CLEARANCE, CROSS_LEAD_FRAC, CROSS_LEAD_MAX, GK_CLAIM_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L,
  HALF_W, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS, SHOT_SPEED,
  GK_RUSH_ENVELOPE,
  DEFLECT_BLIND_PEN, TACKLE_LUNGE_COST, UNSET_BLOCK_WEIGHT,
  TOUCH_PUSH_BASE, TOUCH_PUSH_SPACE, TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
  PASS_POWER_EXECUTED_MAX, PASS_POWER_EXECUTED_MIN, PASS_POWER_MAX, PASS_POWER_MIN,
  PASS_POWER_NOISE_K,
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

/** THE FINGERTIP STRETCH (Phase 119b): a save may be ATTEMPTED out to
 * reach × this. The old hard cliff at reach meant a ball 5cm beyond was
 * untouchable — onevone-anatomy measured 54%/23% of late-gen 1v1 shots
 * (65%/36% of the GOALS) never rolling a save at all; the composed
 * post-placed finish was engineered to shave exactly that boundary. The
 * frozen dive difficulty already prices the distance (floor 0.25), the
 * attempt fires only as the ball passes its closest approach (a catchable
 * ball is never pre-empted), and a stretch save can only PARRY. */
const SAVE_STRETCH = 1.35;

/** Dive difficulty, frozen at the moment of the strike: how far off the
 * shot's line the keeper stands, priced against his reach. Shared by the
 * open-play shot, the header and the placed free kick. */
function diveDifficulty(ballPos: V2, dir: V2, gk: Player, opp: { genome: { keeperAggression: number } }): number {
  const path = closestPointOnSegment(ballPos, add(ballPos, scale(dir, 40)), gk.pos);
  return clamp(1.15 - dist(path, gk.pos) / keeperReach(opp, gk), 0.25, 1);
}

/** ANGLE COVERED (Phase 119b): the share of the goal's angular window the
 * keeper's POSITION cut at the strike — his depth up the shot cone over the
 * shooter's distance, discounted as he stands off the shooter→goal line (a
 * dragged keeper covers nothing). Phase 103's closeIn paid proximity to the
 * SHOOTER; the anatomy probe caught evolution routing around it — striking
 * from 8-10m where closeIn ≈ 0.1 while a keeper 3m up the cone still cut
 * ~40% of the window for free. Frozen at shot time, like difficulty. */
function angleCoverage(gk: Player, shooterPos: V2, goal: V2): number {
  const sGoal = Math.max(dist(shooterPos, goal), 1);
  const kGoal = dist(gk.pos, goal);
  const lineOff = dist(closestPointOnSegment(shooterPos, goal, gk.pos), gk.pos);
  return clamp01(Math.min(kGoal / sGoal, 1) * clamp01(1 - lineOff / 3));
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
/**
 * EDS E1b (docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md): the two speed-cost
 * curves. `base` is the shipped one; `heavy` is C1-B §12.2's honest curve —
 * saturation moves from 14 m/s to the 22 m/s ground-pass launch cap, and the
 * rolled-versus-drilled spread lands at the same order as the 17.4pp
 * interception swing power buys. Selected per call, never globally.
 */
export const TOUCH_SPEED_COST = {
  base: { span: 8, weight: 0.07 },
  heavy: { span: 16, weight: 0.24 },
} as const;

export function touchFailChance(
  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
  heavyTouchCost = false,
): number {
  // POSITIONING (Phase 119j) reads the ball and shapes the body EARLY, so it
  // tames the PRESSURE and BLIND-SIDE penalties (the awareness half of a first
  // touch); technique still tames the whole thing (the clean contact). Neutral
  // at 0.5 — `aware` = 1.0 there, so the pre-119j curve is bit-for-bit intact
  // and backfilled 0.5 saves play unchanged; a reader (1.0) cuts the
  // pressure/blind penalty ~30%, a spatially-blind player (0) pays ~30% more.
  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
  const cost = heavyTouchCost ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;
  const raw = 0.01 + clamp01((speed - 6) / cost.span) * cost.weight
    + (pressure * 0.1 + misalign * 0.05) * aware;
  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);
}

/**
 * EDS E1a: one first-touch adjudication, decomposed into the exact terms the
 * roll used. Emitted only when `Match.traceFirstTouch` is on; nothing reads it
 * back and no branch above it depends on it.
 */
export interface FirstTouchTraceEntry {
  readonly tick: number;
  readonly gid: number;
  /** True when this body was the pending pass's intended target. */
  readonly intendedTarget: boolean;
  readonly relativeSpeed: number;
  readonly pressure: number;
  readonly misalign: number;
  readonly technique: number;
  readonly positioning: number;
  readonly pFail: number;
  readonly clean: boolean;
}

/** Frozen physical facts from the earlier contact, used by M3's later control attempt. */
export interface FirstTouchContactContext {
  readonly relativeSpeed: number;
  readonly incomingDir: Readonly<V2>;
}

/**
 * Roll the first touch for a player about to control a moving ball. Returns
 * true if the touch is clean (caller gives them the ball). A failed touch
 * knocks the ball loose ahead of the receiver — anyone can pounce on it.
 * Keepers are exempt (they catch); slow balls are trivially trapped.
 */
export function attemptFirstTouch(
  match: Match,
  p: Player,
  contact?: FirstTouchContactContext,
): boolean {
  const ball = match.ball;
  // A dropping ball is harder to kill than a rolled one (Phase 28): the
  // vertical speed counts toward touch difficulty. Ground balls: vz = 0.
  const speed = contact?.relativeSpeed ?? (len(ball.vel) + Math.abs(ball.vz) * 0.6);
  if (p.role === 'GK' || speed <= 6) return true;
  const hSpeed = Math.max(len(ball.vel), 1e-6);
  const inx = contact?.incomingDir.x ?? ball.vel.x / hSpeed;
  const iny = contact?.incomingDir.y ?? ball.vel.y / hSpeed;
  // Ball arriving at the face = 0, arriving from behind the body = 1.
  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
  let pFail = touchFailChance(
    speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning, match.edsTouchCost,
  );
  // Re-collecting your OWN pushed touch (Phase 36): the ball rolls away
  // from the body, which reads as a blind-side reception to the misalign
  // term — but he watched it leave his own boot. Priced well down, not
  // free: overhit knock-and-runs still get away.
  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;
  const clean = !match.rng.chance(pFail);
  // EDS E1a instrument: log the adjudication with the exact terms the roll used.
  // The roll has already happened; this branch cannot influence it, and it is
  // inert unless the trace flag was explicitly enabled.
  if (match.traceFirstTouch) {
    match.firstTouchTrace.push({
      tick: match.simTick,
      gid: p.gid,
      intendedTarget: match.pendingPass !== null
        && match.pendingPass.targetGid === p.gid
        && match.pendingPass.side === p.side,
      relativeSpeed: speed,
      pressure,
      misalign,
      technique: p.attrs.dribbling,
      positioning: p.attrs.positioning,
      pFail,
      clean,
    });
  }
  if (clean) return true;

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

/**
 * The ground BENDER (Phase 71, the curve trilogy's last piece — user ask
 * 弧线直塞): when a defender pinches the passing lane, a technical passer
 * curls the ball AROUND his leg — the bulge leans away from the pincher
 * and the arc comes back to the designed receiving point. Compensation is
 * exact for grass decay (spin bleeds at 1.5/s, so the total rotation is
 * ω(1−e^{−1.5T})/1.5 — half of it rotated off the launch keeps the chord
 * endpoint honest). Nobody in the lane = no spin: the straight ball stays
 * the default, and interceptors/deflectors meet the ARC per frame, so the
 * bender beats exactly the leg it was played around. Returns the spin.
 */
function groundBend(
  passer: Player, to: V2, opponents: Player[], d: number,
): number {
  const from = passer.pos;
  const chord = norm(sub(to, from));
  let pinch: Player | null = null;
  let pinchPerp = 1.3; // a leg within reach of the straight lane
  for (const o of opponents) {
    if (o.sentOff) continue;
    const ox = o.pos.x - from.x;
    const oy = o.pos.y - from.y;
    const along = ox * chord.x + oy * chord.y;
    if (along < 2 || along > d - 2) continue; // passer's feet / receiver's trap
    const perp = Math.abs(ox * chord.y - oy * chord.x);
    if (perp < pinchPerp) {
      pinchPerp = perp;
      pinch = o;
    }
  }
  if (!pinch) return 0;
  // Magnitude scales with how TIGHT the pinch is — a leg 1.2m off the
  // chord needs a lean, not a banana (the first cut bent every through
  // ball at full whip: the last defender always stands near that chord,
  // so high lines were being beaten for free — press-23's measured block
  // height collapsed onto low-32's and the formations contract inverted).
  const tightness = clamp(1.4 - pinchPerp, 0.3, 1);
  // FLAT whip (the passing-scaled first cut inverted the skill gradient:
  // better passers took BIGGER bends and paid the deviation) — the bend
  // needed to clear a leg is geometry, the same for everyone; technique's
  // edge lives in the weight error below.
  const mag = 0.45 * tightness;
  const cross = chord.x * (pinch.pos.y - from.y) - chord.y * (pinch.pos.x - from.x);
  return (Math.sign(cross) || 1) * mag;
}
import { v2 } from '../utils/vec';
import { BALL_RADIUS } from './constants';
import type { Player } from './Player';
import type { BallPhysicalMode } from './physical';

/**
 * The ball is either free (integrated by Match physics with friction and wall
 * bounces) or owned — glued slightly ahead of its owner while they dribble.
 * Since Phase 28 it also has a height: lofted kicks fly parabolic arcs
 * (z up, gravity, bounces) while ground balls keep z = vz = 0 exactly.
 */
export class Ball {
  pos = v2();
  vel = v2();
  /** IFAB-sized physical radius; M0 does not feed it into line/goal/capture laws. */
  get radius(): number {
    return BALL_RADIUS;
  }
  /** Height above the pitch (m). 0 for ground balls. */
  z = 0;
  /** Vertical velocity (m/s, + up). 0 for ground balls. */
  vz = 0;
  /**
   * Sidespin (Phase 37, Magnus): the velocity direction rotates at this
   * rate (rad/s, + = counterclockwise) while the ball is free — a constant
   * rate is a circular arc, which gives every projection (ballLanding,
   * interceptBall) an exact closed form. Set only by curled kicks
   * (`curlKick` in mechanics); zeroed by every plain kick and capture.
   */
  spin = 0;
  owner: Player | null = null;
  lastTouch: Player | null = null;

  /** In the air right now (grounded balls take the exact pre-Phase-28 path). */
  get airborne(): boolean {
    return this.z > 0 || this.vz !== 0;
  }

  /** Pure physical classification; match-law possessionPhase stays separate. */
  get physicalMode(): BallPhysicalMode {
    if (this.owner !== null) return 'controlled';
    return this.airborne ? 'freeAirborne' : 'freeGround';
  }

  reset(): void {
    this.pos = v2();
    this.vel = v2();
    this.z = 0;
    this.vz = 0;
    this.spin = 0;
    this.owner = null;
    this.lastTouch = null;
  }
}
import { v2, type V2 } from '../utils/vec';
import { PLAYER_CORE_RADIUS, STAMINA_DRAIN, STAMINA_RECOVERY } from './constants';
import type { PlayerAttributes } from '../evolution/playerGenome';
import { traitsOf, type Trait } from '../evolution/traits';
import { TEAM_SIZE, type ActionState, type Role, type Side } from './types';

/** Physical top speed by role (m/s) before pace/stamina scaling. */
const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };
const ACCEL = 14; // m/s^2 toward desired velocity

/**
 * Body turn rate (rad/s), Phase 27: heading sweeps toward the movement
 * direction instead of snapping to it, so a 180° cut takes ~0.48s of visible
 * rotation. Velocity itself is already inertia-bound by ACCEL — this cap is
 * what the eye (and the kick-orientation mechanics) read as "facing".
 */
export const TURN_RATE = 6.5;
// cos/sin of the per-step turn cap, cached per dt (the sim always uses DT).
let turnDt = -1;
let turnCos = 1;
let turnSin = 0;

export class Player {
  /** Index within team (0..5, slot order GK/DF/MF/WGL/WGR/ST). */
  readonly index: number;
  /** Global id across both teams (0..11), = side * TEAM_SIZE + index. */
  readonly gid: number;
  readonly side: Side;
  readonly role: Role;
  /**
   * Roster row this body's stats land on (Phase 61): a starter's slot index,
   * a substitute's bench row. The PLAYER OBJECT is the pitch slot — a sub
   * swaps its identity in place (`becomeSub`), so every gid-keyed reference
   * (marks, renderer models, action targets) survives the change.
   */
  rosterIdx: number;
  /** Identity fields — mutated ONLY by becomeSub (the bench, Phase 61). */
  name: string;
  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
  attrs: PlayerAttributes;

  pos = v2();
  vel = v2();
  heading = v2(1, 0);
  /**
   * World-model body direction (M0): the existing capped-rate heading is the
   * canonical facing state. Exposing it by semantic name adds no second state
   * that could drift, and it remains independent of velocity direction.
   */
  get bodyDir(): Readonly<V2> {
    return this.heading;
  }
  /** Stable kinematic core; interaction reach lives outside this disc. */
  get coreRadius(): number {
    return PLAYER_CORE_RADIUS;
  }
  /** Set every frame by the action executor; physics chases it. */
  desiredVel = v2();
  /**
   * When set (by the executor, per frame), heading turns toward this point
   * instead of the movement direction — keepers backpedal FACING the play
   * (27.5). Holds a live reference (e.g. ball.pos); cleared each frame.
   */
  faceTarget: V2 | null = null;

  stamina = 1;
  staminaSpent = 0;
  distance = 0;

  action: ActionState = { type: 'HoldPosition', scores: [] };
  decisionTimer = 0;
  kickCooldown = 0;
  tackleCooldown = 0;
  /**
   * Recovery stun (Phase 27): a dispossessed carrier stumbles and a beaten
   * lunger picks themself up — movement is heavily damped while it runs, and
   * a stunned player can't control a loose ball or tackle.
   */
  stunTimer = 0;
  /**
   * Keeper hold (Phase 27.2): after claiming the ball a keeper scoops it up
   * and holds it briefly — untackleable, ball carried in the hands — before
   * distributing. Never set for restart first touches (goal kicks stay quick).
   */
  gkHoldTimer = 0;
  /**
   * Discrete touches (Phase 36): time until this carrier may PUSH the ball
   * again. Set at capture so the first decision happens ON the ball (the
   * settle touch and the pass game keep their timing); a decision that
   * keeps Dribble releases the next push.
   */
  touchTimer = 0;
  /** Display-only: renderers play a lunge animation while this runs. */
  tackleAnimTimer = 0;
  /** Display-only: renderers play a keeper dive while this runs (27.4). */
  saveAnimTimer = 0;
  /** Display-only: renderers play a header jump while this runs (Phase 28). */
  headerAnimTimer = 0;
  /**
   * Keeper distribution mode (Phase 28.3): set while holding the ball in the
   * hands, cleared on the kick — a keeper who HELD the ball releases it
   * deliberately (throw/pass/switch), never with a panic hoof.
   */
  gkDistributing = false;
  /**
   * Shape-wait budget spent (Phase 30.3): while distributing, the keeper
   * re-arms the hold in small quanta until the outfielders settle into
   * shape; this counts what's been spent so a parked team can't stall the
   * match. Reset when a fresh hold starts.
   */
  gkShapeWait = 0;
  /**
   * One-touch window (Phase 31.9, 一脚出球): set at a PRESSURED reception —
   * the receiver decides immediately, and a pass kicked while this runs is
   * played first-time: extra aim noise, discounted by technique. Any kick
   * consumes it; expiry means they took a settle touch after all.
   */
  firstTouchWindow = 0;
  /**
   * Marker reaction lag (Phase 31.9, the headed-game pass): while the mark
   * SPRINTS near our goal, the marking stance target is frozen here and
   * only re-read on the marker's reaction cadence (0.2–0.45s by defending)
   * — frame-perfect shadowing had made the attacking header extinct.
   */
  markAnchor: V2 | null = null;
  markAnchorAge = 0;
  markAnchorIdx: number | null = null;
  /**
   * 2过1 burst license (Phase 34): granted when this player plays a short
   * pass under pressure — for its ~1.1s he sprints past his marker and the
   * return ball INTO him (from `partnerGid`) is scored as the wall pass,
   * not the "handing it straight back" it would otherwise read as.
   */
  wallRun: { until: number; partnerGid: number } | null = null;
  /**
   * Containment hysteresis (Phase 101): whether this chaser is currently
   * JOCKEYING the carrier. The phase-92 goal-side test was a razor-edge
   * boolean — a chaser dancing on the −0.2 offset flipped between the
   * standoff point and the ball 66-70 times/match (`hold-jitter.ts`), a
   * brain-level whip the render reads as twitching. Enter containment only
   * clearly goal-side, hold it until clearly not. Runtime-only state.
   */
  containing = false;

  /**
   * Slalom COMMITMENT (Phase 41.2, user report "带球转一大圈然后突然丢
   * 球"): the side picked to beat the current blocker, held until the
   * timestamp. Without it a defender shadowing the carrier on the goal
   * axis flipped the perp sign every few ticks — the turn-rate cap
   * integrated the flip-flop into a full pirouette at walking pace
   * (momentum gone = no pace protection) until the tackle landed. A real
   * dribbler picks a shoulder and goes.
   */
  slalomSide: 1 | -1 = 1;
  slalomUntil = -1;

  /** Age in seasons (Phase 26) — display only, set by Team from TeamInfo. */
  age?: number;
  /** Has a yellow card this match — a second booking is a red (Phase 25). */
  booked = false;
  /** Sent off: parked on the apron, excluded from every sim interaction. */
  sentOff = false;
  /** Injury state (Phase 118): a 'knock' plays on visibly slower; 'serious'
   * comes off (the league ban rides MatchResult.injuries). Reset on sub. */
  injured?: 'knock' | 'serious';

  baseSpeed: number;
  accel: number;
  /** Traits (Phase 39) — derived from attrs+role, ≤2. Recomputed on becomeSub. */
  traits: readonly Trait[];
  /** Cached engine-trait drain factor (hot path — no includes() per step). */
  staminaDrainMul: number;

  constructor(side: Side, index: number, role: Role, name: string, attrs: PlayerAttributes) {
    this.side = side;
    this.index = index;
    this.gid = side * TEAM_SIZE + index;
    this.rosterIdx = index;
    this.role = role;
    this.name = name;
    this.attrs = attrs;
    // pace: ±12% top speed, ±10% acceleration around the role baseline.
    this.baseSpeed = BASE_SPEED[role] * (0.88 + attrs.pace * 0.24);
    this.accel = ACCEL * (0.9 + attrs.pace * 0.2);
    // Traits (Phase 39): derived, never stored — a developing player grows
    // into (or out of) them. Hot-path effects are cached as plain numbers.
    this.traits = traitsOf(attrs, role);
    this.staminaDrainMul = this.traits.includes('engine') ? 0.9 : 1;
  }

  /**
   * The SUBSTITUTION (Phase 61, N2): this pitch slot changes bodies. The
   * object survives so every reference keyed by gid stays valid; the
   * identity — name, genes, traits, speed — becomes the bench player's.
   * Fresh legs are the bench's whole payoff: stamina resets to 1. Cards
   * are personal (the new man is unbooked). distance/staminaSpent are NOT
   * reset — they fold into TEAM totals at full time and must keep the
   * outgoing man's work.
   */
  /** A KNOCK (Phase 118): hurt but playing on — pace and close control
   * degrade for the rest of his match. The attrs object is REPLACED, never
   * mutated: the roster row is shared with the franchise. */
  takeKnock(): void {
    this.injured = 'knock';
    this.attrs = { ...this.attrs, pace: this.attrs.pace * 0.8, dribbling: this.attrs.dribbling * 0.85 };
    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + this.attrs.pace * 0.24);
    this.accel = ACCEL * (0.9 + this.attrs.pace * 0.2);
  }

  becomeSub(sub: { rosterIdx: number; name: string; attrs: PlayerAttributes; age?: number }, pos: V2): void {
    this.name = sub.name;
    this.attrs = sub.attrs;
    this.age = sub.age;
    this.rosterIdx = sub.rosterIdx;
    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + sub.attrs.pace * 0.24);
    this.accel = ACCEL * (0.9 + sub.attrs.pace * 0.2);
    this.traits = traitsOf(sub.attrs, this.role);
    this.staminaDrainMul = this.traits.includes('engine') ? 0.9 : 1;
    this.stamina = 1;
    this.booked = false;
    this.injured = undefined; // the new man arrives whole (Phase 118)
    this.pos = v2(pos.x, pos.y);
    this.vel = v2();
    this.desiredVel = v2();
    this.heading = v2(0, pos.y > 0 ? -1 : 1); // facing the pitch he steps onto
    this.faceTarget = null;
    this.action = { type: 'MoveToFormationSpot', scores: [] };
    this.kickCooldown = 0;
    this.tackleCooldown = 0;
    this.stunTimer = 0;
    this.touchTimer = 0;
    this.gkHoldTimer = 0;
    this.gkDistributing = false;
    this.gkShapeWait = 0;
    this.tackleAnimTimer = 0;
    this.saveAnimTimer = 0;
    this.headerAnimTimer = 0;
    this.firstTouchWindow = 0;
    this.markAnchor = null;
    this.markAnchorAge = 0;
    this.markAnchorIdx = null;
    this.wallRun = null;
  }

  /** Effective top speed — tired players slow down but never stop. */
  get topSpeed(): number {
    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
  }

  physicsStep(dt: number): void {
    // In-place integration — this ran as clampLen/approachV/add/norm, which
    // allocated ~6 vectors per player per step (860k per match). The exact
    // same operations in the exact same IEEE order, written out flat:
    // results are bit-identical (regression: same seed ⇒ same save JSON).
    const dv = this.desiredVel;
    const max = this.topSpeed;
    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen
    let tx = dv.x;
    let ty = dv.y;
    if (dl > max && dl > 1e-8) {
      const s = max / dl;
      tx = dv.x * s;
      ty = dv.y * s;
    }
    // Stunned (Phase 27): stumbling players can barely move until they recover.
    if (this.stunTimer > 0) {
      tx *= 0.15;
      ty *= 0.15;
    }
    const maxDelta = this.accel * dt; // approachV
    const ax = tx - this.vel.x;
    const ay = ty - this.vel.y;
    const al = Math.sqrt(ax * ax + ay * ay);
    if (al <= maxDelta || al < 1e-8) {
      this.vel.x = tx;
      this.vel.y = ty;
    } else {
      const s = maxDelta / al;
      this.vel.x = this.vel.x + ax * s;
      this.vel.y = this.vel.y + ay * s;
    }
    this.pos.x = this.pos.x + this.vel.x * dt;
    this.pos.y = this.pos.y + this.vel.y * dt;

    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    // Rotate heading toward the face target (backpedal, 27.5) or, failing
    // that, the movement direction — capped at TURN_RATE either way.
    // No trig in the loop: the per-step rotation's cos/sin are cached per dt.
    if (dt !== turnDt) {
      turnDt = dt;
      turnCos = Math.cos(TURN_RATE * dt);
      turnSin = Math.sin(TURN_RATE * dt);
    }
    const ft = this.faceTarget;
    let wx = 0;
    let wy = 0;
    let turn = false;
    if (ft) {
      const fx = ft.x - this.pos.x;
      const fy = ft.y - this.pos.y;
      const fl = Math.sqrt(fx * fx + fy * fy);
      if (fl > 1e-6) {
        wx = fx / fl;
        wy = fy / fl;
        turn = true;
      }
    } else if (sp > 0.5) {
      wx = this.vel.x / sp;
      wy = this.vel.y / sp;
      turn = true;
    }
    if (turn) {
      const hx = this.heading.x;
      const hy = this.heading.y;
      if (hx * wx + hy * wy >= turnCos) {
        this.heading = { x: wx, y: wy };
      } else {
        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
      }
sed: src/sim/prediction.ts: No such file or directory

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "wc -l src/sim/constants.ts src/sim/mechanics.ts src/sim/Ball.ts src/sim/Player.ts; rg --files src/sim | sort | rg 'prediction|Prediction'; nl -ba src/sim/constants.ts | sed -n '1,240p'; nl -ba src/sim/constants.ts | sed -n '241,480p'; nl -ba src/sim/constants.ts | sed -n '481,760p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 236ms:[0m
     1	/** All simulation units are meters / seconds. Coordinates: origin at pitch
     2	 * center, +x toward the right goal, +y downward on screen. Team 0 attacks +x,
     3	 * team 1 attacks -x (no side swap at half time — keeps formation math simple).
     4	 *
     5	 * Boundaries are real (Phase 14): a ball over the touchline is a kick-in,
     6	 * over the goal line a corner or goal kick. Restarts are live dead-ball
     7	 * phases — the clock runs while the taker walks over and defenders reshape.
     8	 */
     9	/** Read a positive probe-only scale without introducing browser assumptions. */
    10	const positiveEnv = (key: string): number | undefined => {
    11	  const raw = typeof process !== 'undefined' && process.env ? Number(process.env[key]) : NaN;
    12	  return Number.isFinite(raw) && raw > 0 ? raw : undefined;
    13	};
    14	
    15	/**
    16	 * World-model parameter authority (M0, docs/world-model/FOUNDATION.md).
    17	 *
    18	 * `PITCH_SCALE` used to couple field density, goal width, penalty-box geometry,
    19	 * and the centre circle. These independent dimensions are backfilled to the
    20	 * exact values that shipped before M0: field + goal/box at 0.70; bodies,
    21	 * control reach, and speed/time at their unscaled 1.00 values. A legacy
    22	 * PITCH_SCALE env value still feeds the two formerly-coupled geometry scales
    23	 * when their new explicit env keys are absent, so old density-probe commands
    24	 * remain reproducible without keeping an ambiguous runtime constant.
    25	 */
    26	const LEGACY_PITCH_SCALE = positiveEnv('PITCH_SCALE');
    27	export const FIELD_SCALE = positiveEnv('FIELD_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
    28	export const GOAL_AND_BOX_SCALE =
    29	  positiveEnv('GOAL_AND_BOX_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
    30	export const BODY_SCALE = positiveEnv('BODY_SCALE') ?? 1;
    31	export const CONTROL_REACH_SCALE = positiveEnv('CONTROL_REACH_SCALE') ?? 1;
    32	export const SPEED_TIME_SCALE = positiveEnv('SPEED_TIME_SCALE') ?? 1;
    33	
    34	export const PITCH_LENGTH = 90 * FIELD_SCALE;
    35	export const PITCH_WIDTH = 58 * FIELD_SCALE;
    36	export const HALF_L = PITCH_LENGTH / 2;
    37	export const HALF_W = PITCH_WIDTH / 2;
    38	
    39	/** A ball over the GOAL line (a wide or over-the-bar shot) coasts this long
    40	 * before its corner / goal-kick is awarded (Phase 41.1) — it reads as sailing
    41	 * OUT, not vanishing the instant it crosses. Goal-line only; touchline kick-ins
    42	 * stay instant. Goal detection runs first and is frozen out during the coast,
    43	 * so a wide ball drifting behind the line can never register a phantom goal. */
    44	export const OUT_PLAY_COAST = 0.5;
    45	
    46	export const GOAL_WIDTH = 7 * GOAL_AND_BOX_SCALE;
    47	export const GOAL_DEPTH = 2.2;
    48	/** Crossbar height (m) — a ball crossing the goal line above this is OVER the bar. */
    49	export const GOAL_HEIGHT = 2.44;
    50	export const BOX_DEPTH = 13 * GOAL_AND_BOX_SCALE;
    51	export const BOX_WIDTH = 28 * GOAL_AND_BOX_SCALE;
    52	export const CENTER_CIRCLE_R = 7 * FIELD_SCALE;
    53	
    54	/** Fixed simulation timestep (s). */
    55	export const DT = 1 / 60;
    56	/** Default full match duration in sim-seconds (2 halves). Display clock maps this to 90'. */
    57	export const MATCH_DURATION = 240;
    58	/**
    59	 * Max sim-seconds a half runs past its nominal end waiting for a safe break
    60	 * (Phase 27.4 stoppage time) — ≈3 added display minutes on the 90' clock.
    61	 */
    62	export const STOPPAGE_MAX = 8;
    63	
    64	/**
    65	 * The currently shipped turf response, named as one authority so a later
    66	 * factorial can compare surfaces without scattering friction/bounce edits.
    67	 * M0 adds no alternative profile and no runtime selection.
    68	 */
    69	export interface SurfaceProfile {
    70	  readonly id: 'current';
    71	  readonly ballFrictionK: number;
    72	  readonly ballBounce: number;
    73	  readonly bounceDamp: number;
    74	  readonly bounceMinVz: number;
    75	  readonly airSpinDecay: number;
    76	  readonly groundSpinDecay: number;
    77	  readonly bounceSpinRetention: number;
    78	}
    79	
    80	export const SURFACE_PROFILE: SurfaceProfile = Object.freeze({
    81	  id: 'current',
    82	  ballFrictionK: 0.55,
    83	  ballBounce: 0.45,
    84	  bounceDamp: 0.72,
    85	  bounceMinVz: 2.2,
    86	  airSpinDecay: 0.25,
    87	  groundSpinDecay: 1.5,
    88	  bounceSpinRetention: 0.55,
    89	});
    90	
    91	/** Ball exponential velocity decay per second: v *= exp(-K * dt). */
    92	export const BALL_FRICTION_K = SURFACE_PROFILE.ballFrictionK;
    93	export const BALL_AIR_SPIN_DECAY = SURFACE_PROFILE.airSpinDecay;
    94	export const BALL_GROUND_SPIN_DECAY = SURFACE_PROFILE.groundSpinDecay;
    95	export const BALL_BOUNCE_SPIN_RETENTION = SURFACE_PROFILE.bounceSpinRetention;
    96	
    97	/* ---- The energy economy (Phase 58 — it BINDS now) ---- */
    98	/**
    99	 * The N1 matrix probe found the meta uncounterable and the phase-58
   100	 * diagnostic found out why nothing tires it: full-time stamina sat at
   101	 * 0.98-0.99 (recovery 0.014/s dwarfed drain 0.006·e²/s), so every payoff
   102	 * built on fatigue — the stamina attribute, staminaConservation's
   103	 * "fresher legs late", the tired-legs brain gate — was dead. Repriced so
   104	 * a match SPENDS legs: sustained sprinters finish ~0.6-0.8, patient
   105	 * sides ~0.9. Sweep + gates in the phase-58 ledger entry.
   106	 */
   107	export const STAMINA_DRAIN = 0.01;
   108	export const STAMINA_RECOVERY = 0.009;
   109	/**
   110	 * A tackle lunge is a burst the movement integral never saw (the lunge is
   111	 * instantaneous): each attempt — win or whiff — costs a flat chunk,
   112	 * scaled by the same per-player drain modifiers. Aggressive markers
   113	 * attempt ~2× a patient side's volume (probe: 9.4 vs 5.2 WON tackles),
   114	 * so relentless pressing now buys its late-game price.
   115	 */
   116	export const TACKLE_LUNGE_COST = 0.02;
   117	
   118	/**
   119	 * Blind-side deflection penalty (Phase 59, N1.5 lever 2): you can only
   120	 * stick a leg on a drilled ball you SEE. The cutback anatomy probe found
   121	 * ~60% of pull-backs dying in flight to legs with NO facing check — a
   122	 * defender retreating goalward deflected the ball zipping behind his heels
   123	 * at the same odds as a set, facing interceptor, which re-sealed the very
   124	 * arc the collapsed block cedes. Fully blind ⇒ deflection odds ×(1−this);
   125	 * facing ⇒ unchanged. Buffs every DRILLED delivery (cutbacks, driven
   126	 * switches, hard through balls) against unset bodies only.
   127	 */
   128	export const DEFLECT_BLIND_PEN = 0.75;
   129	/**
   130	 * The same seeing-the-ball principle at the CAPTURE contact (Phase 59):
   131	 * the anatomy probe's kill telemetry showed pull-back flights dying 7:1 to
   132	 * the full-capture branch, not the deflection stretch — friction decays a
   133	 * 19 m/s cutback under CONTROL_MAX_SPEED mid-flight, and every bystander
   134	 * within 1.25m then got an UNCONDITIONAL touch (a failed control still
   135	 * squirts the ball = the pass dies either way). Now a bystander must
   136	 * REACT to a live pass rolling past: contact odds fall with ball speed
   137	 * and blind-side arrival; the INTENDED receiver is set for it (exempt),
   138	 * dead/loose scrambles (no pass in flight) keep the old physics.
   139	 */
   140	export const CONTACT_BLIND_PEN = 0.7;
   141	/**
   142	 * The UNSET WALL (Phase 60, N1.5 lever 3): a body on the shot corridor
   143	 * only blocks in FULL when it is set (still) and facing the strike. The
   144	 * cutback anatomy measured 38-50% of delivered pull-backs arriving with a
   145	 * "blocked" corridor whose bodies were 64-83% UNSET — sprinting goalward
   146	 * or blind — and both the shoot decision (laneBlockers-suppressed appetite)
   147	 * and the block physics treated them as a set wall, so the arc arrival
   148	 * recycled instead of striking first-time. Weight per corridor body:
   149	 * this floor + (1−floor)·readiness, readiness = facing · stillness.
   150	 */
   151	export const UNSET_BLOCK_WEIGHT = 0.55;
   152	
   153	/**
   154	 * The MEETABLE cross (Phase 63, the route-one channel): open-play crosses
   155	 * used to lead the target by his FULL velocity × flight — the pre-31.9
   156	 * corner bug alive in open play. Probed (aerial-anatomy): as the delivery
   157	 * dropped into the header band the intended target was a median 8-9m away
   158	 * (header reach is 1.35m) — attacker headers ran 1-10% of crosses and 47%
   159	 * died in defenders' laps on the ground. The delivery now leads a MEETABLE
   160	 * fraction of the run, capped in meters: the crasher keeps his momentum
   161	 * (the running jump IS his duel edge) and covers the difference himself
   162	 * (ReceivePass chases the landing).
   163	 */
   164	export const CROSS_LEAD_FRAC = 0.4;
   165	export const CROSS_LEAD_MAX = 3.5;
   166	
   167	/* ---- The aerial game (Phase 28) ---- */
   168	/** Gravity on the lofted ball (m/s²). Airborne balls fly friction-free. */
   169	export const GRAVITY = 9.81;
   170	/** Vertical restitution on landing: bounce vz = -vz · this. */
   171	export const BALL_BOUNCE = SURFACE_PROFILE.ballBounce;
   172	/** Horizontal speed kept per bounce (the turf bites). */
   173	export const BOUNCE_DAMP = SURFACE_PROFILE.bounceDamp;
   174	/** Landing slower than this vertically just settles into a roll. */
   175	export const BOUNCE_MIN_VZ = SURFACE_PROFILE.bounceMinVz;
   176	/** Above this height a ball can't be trapped or deflected — only headed. */
   177	export const CONTROL_MAX_HEIGHT = 1.3;
   178	/** Header contest window: ball height where outfielders can attack it... */
   179	export const HEADER_MIN_HEIGHT = 1.35;
   180	export const HEADER_MAX_HEIGHT = 2.5;
   181	/** ...standing within this horizontal radius of the ball. */
   182	export const HEADER_RADIUS = 1.35;
   183	/**
   184	 * Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 —
   185	 * 是不是没有胸部停球"): a ball dropping through the LOWER header band that no
   186	 * opponent is contesting can be CUSHIONED to the feet instead of headed.
   187	 * Heading a hanging ball just nods it to the next man — the endless aerial
   188	 * rally. The take-down is priced by technique/first-touch and spills under
   189	 * pressure (a failed trap keeps the scramble). Ceiling below a leaping
   190	 * header (you can't chest a 2m ball); only a descending/apex ball (vz gate);
   191	 * the trapper must be almost under it (tighter than HEADER_RADIUS).
   192	 */
   193	export const CHEST_TRAP_MAX_HEIGHT = 1.7;
   194	export const CHEST_TRAP_RADIUS = 1.05;
   195	/** Above this upward vz the ball is rising too hard to cushion (just bounced/headed up). */
   196	export const CHEST_TRAP_MAX_VZ = 1.5;
   197	/** Keepers can claim high balls up to here (jump + hands). */
   198	export const GK_CLAIM_HEIGHT = 2.55;
   199	/**
   200	 * Opponents are held this far from a keeper holding the ball in their hands
   201	 * (Phase 28.1) — you can't challenge a keeper in possession, so crowding
   202	 * them was pointless harassment that turned every release into a turnover.
   203	 */
   204	export const GK_HOLD_CLEARANCE = 3;
   205	
   206	/** Opponents are held this far from a dead-ball restart spot. */
   207	export const RESTART_CLEARANCE = 6;
   208	/** Corners use the real-law 9.15m (Phase 31.9): the delivery's ascent is
   209	 * inside the header band (z 1.35–2.5) until ~7.8m from the flag, so a
   210	 * sentry camped on the generic 6m edge got a free header at every
   211	 * climbing corner — the silent killer of the whole corner routine. */
   212	export const CORNER_CLEARANCE = 9.15;
   213	/** Penalty spot distance from the goal line — matches the drawn spot (BOX_DEPTH · 0.72). */
   214	export const PENALTY_SPOT_DIST = BOX_DEPTH * 0.72;
   215	/**
   216	 * Everyone except the taker (and the defending keeper, who stands ~9.4m away
   217	 * on the goal line) is held this far from the penalty spot during setup.
   218	 */
   219	export const PENALTY_CLEARANCE = 8;
   220	/** Restart setup: minimum dead-ball time before the kick can be taken... */
   221	export const RESTART_MIN_SETUP = 1.0;
   222	/** ...and a failsafe: after this long the taker kicks from wherever they are. */
   223	export const RESTART_TIMEOUT = 6;
   224	
   225	/** A player controls a free ball inside this radius... */
   226	export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;
   227	/**
   228	 * M2 oriented interaction shell. The stable core and ball radius are never
   229	 * scaled by these values — only the leg/foot extension outside them is.
   230	 * Front and lateral contact keep the old CONTROL_RADIUS exactly. Rear contact
   231	 * keeps 90% of the outer extension: close back-heels remain possible, while an
   232	 * edge-of-envelope ball directly behind the body requires a small turn.
   233	 */
   234	export const BALL_ACCESS_SIDE_EXTENSION_FACTOR = 1;
   235	export const BALL_ACCESS_BACK_EXTENSION_FACTOR = 0.9;
   236	// S0 (docs/SUBSTRATE-MAP.md): both sides with a body within this of a loose ball =
   237	// a genuine contest. Classification-only today; the physical 50-50 will use it later.
   238	export const CONTEST_RADIUS = 3;
   239	/** ...if it is slower than this (outfield) — keepers can handle faster balls. */
   240	export const CONTROL_MAX_SPEED = 14;
   241	export const GK_CONTROL_MAX_SPEED = 23;
   242	/**
   243	 * M3 contact→control separation. A foot contact leaves the ball physically
   244	 * free for three fixed ticks before the same body may establish control;
   245	 * another body can contact it during that window and replace the attempt.
   246	 */
   247	export const CONTACT_CONTROL_DELAY_TICKS = 3;
   248	export const CONTACT_COMMIT_TIME = 0.08;
   249	/** Foot follow-through retained after real contact; not available to a fresh claim. */
   250	export const CONTACT_CONTROL_RETENTION_MARGIN = 0.02;
   251	/** Relative normal speed left after a cushioning contact. */
   252	export const CONTACT_RELEASE_MIN_SPEED = 0.25;
   253	export const CONTACT_RELEASE_MAX_SPEED = 1.2;
   254	export const CONTACT_RELEASE_INCOMING_SHARE = 0.12;
   255	/** Tangential relative ball motion survives the contact at this share. */
   256	export const CONTACT_TANGENTIAL_RETENTION = 0.35;
   257	/**
   258	 * Faster balls (hard passes, not shots — SHOT_SPEED is 27) can still be
   259	 * DEFLECTED by a player in their path (Phase 27 lane anticipation).
   260	 */
   261	export const DEFLECT_MAX_SPEED = 24;
   262	
   263	/** After kicking, a player can't re-capture for this long (lets passes leave). */
   264	export const KICK_COOLDOWN = 0.45;
   265	
   266	/**
   267	 * C1-A pass POWER as an executable input (docs/world-model/PASS-POWER-SLICE.md
   268	 * §8). Ordinary ground-pass weight stopped being a pure distance formula: a
   269	 * passer may mean 0.85 (rolled) .. 1.15 (drilled), leads the receiver on the
   270	 * power he MEANT, and the ball leaves at what he actually struck. Nothing
   271	 * chooses a power yet — every live call passes 1.0, which draws no RNG and
   272	 * changes no arithmetic (that is what the fingerprint gate proves).
   273	 */
   274	export const PASS_POWER_MIN = 0.85;
   275	export const PASS_POWER_MAX = 1.15;
   276	/**
   277	 * Weighting a ball away from its natural pace is a technique act: the error
   278	 * grows with how far from 1.0 the passer reaches and shrinks with passing.
   279	 * Same shape as bentKick's weight error. σ ≈ 7.7% of power for an average
   280	 * passer's 1.15 ball, ≈ 3.7% for an elite one.
   281	 */
   282	export const PASS_POWER_NOISE_K = 0.60;
   283	/** A mis-struck ball stays physically sane. */
   284	export const PASS_POWER_EXECUTED_MIN = 0.70;
   285	export const PASS_POWER_EXECUTED_MAX = 1.30;
   286	
   287	/**
   288	 * Discrete dribble touches (Phase 36, 可见的触球): an outfield carrier
   289	 * DRIVING in space pushes the ball ahead and chases it — between touches
   290	 * the ball is a free body an opponent in the path may poke away. Under
   291	 * pressure (an opponent inside TOUCH_CONTROL_DIST) the carry stays glued:
   292	 * close control IS short touches, and the tackle/shield duel lives there.
   293	 */
   294	/** Nearest-opponent distance above which the carrier plays open touches.
   295	 * First cut 3.5/1.7/0.38 rolled the ball 1.1s ahead and 39% of pushes were
   296	 * poked away — a coin flip per carry. */
   297	export const TOUCH_CONTROL_DIST = 4.2;
   298	/**
   299	 * Carry REGIMES (36.1, user report "跑动应该有不同的触球频率"): the push
   300	 * range is wide on purpose — in traffic it's a stride-length nudge
   301	 * (一步一带, ~0.9 m/s over the run), into 10m of open grass it's a real
   302	 * knock (爆趟, up to ~4.7); walking pace keeps the glue (慢带). Cadence
   303	 * follows: the poke window scales with the push, so a long knock is a
   304	 * long chase and a dribble regathers in a step.
   305	 */
   306	/** Base speed added to the carrier's own on the push. */
   307	export const TOUCH_PUSH_BASE = 0.9;
   308	/** Extra push per meter of open cone ahead (capped at 9m in mechanics).
   309	 * 0.38 + cooldown slope 0.06 overshot: pokes 26%, 13% rolled dead, goals
   310	 * −0.27 (probed) — the mid-range carry bled possession. */
   311	export const TOUCH_PUSH_SPACE = 0.32;
   312	/** The no-recollect window: base + slope·push — the poke window. */
   313	export const TOUCH_RECOLLECT_BASE = 0.26;
   314	export const TOUCH_RECOLLECT_PER_PUSH = 0.04;
   315	/** A keeper ahead is not open grass (Phase 46): any roll that reaches him
   316	 * is DEAD (GK_CONTROL_MAX_SPEED 23 vs outfield 14, plus hands in the box),
   317	 * and he covers ~GK 6.4 m/s × the ~0.8s loose window while a knock is
   318	 * un-regatherable. The carry cone prices him at that envelope upfield of
   319	 * his body — the substrate fix for 趟球太大送门将 (breakaway probe:
   320	 * keeper-collects stuck at 8-9% even with maxed technique). */
   321	export const GK_RUSH_ENVELOPE = 5;
   322	
   323	/** How often each player re-evaluates its utility scores (staggered). */
   324	export const AI_INTERVAL = 0.15;
   325	/** How often each TeamBrain re-picks a tactical mode / assignments. */
   326	export const TEAM_AI_INTERVAL = 0.4;
   327	
   328	export const SHOT_SPEED = 27;
   329	/** Minimum distance between player centers (hard separation). */
   330	export const PLAYER_MIN_DIST = 1.05 * BODY_SCALE;
   331	/** Radius of the stable kinematic core disc represented by PLAYER_MIN_DIST. */
   332	export const PLAYER_CORE_RADIUS = PLAYER_MIN_DIST / 2;
   333	/** IFAB size-5 ball: circumference 68–70cm ⇒ radius approximately 0.11m. */
   334	export const BALL_RADIUS = 0.11;

[35m[3mexec[0m[0m
[1m/bin/zsh -lc 'rg -n "''^(export )?const [A-Z][A-Z0-9_]*|''^[[:space:]]+[a-zA-Z][a-zA-Z0-9]*: [-0-9]" src/sim/constants.ts; find src -iname '"'*prediction*' -o -iname '*predict*'; rg -n \"prediction\" src/sim src | head -80"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
26:const LEGACY_PITCH_SCALE = positiveEnv('PITCH_SCALE');
27:export const FIELD_SCALE = positiveEnv('FIELD_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
28:export const GOAL_AND_BOX_SCALE =
30:export const BODY_SCALE = positiveEnv('BODY_SCALE') ?? 1;
31:export const CONTROL_REACH_SCALE = positiveEnv('CONTROL_REACH_SCALE') ?? 1;
32:export const SPEED_TIME_SCALE = positiveEnv('SPEED_TIME_SCALE') ?? 1;
34:export const PITCH_LENGTH = 90 * FIELD_SCALE;
35:export const PITCH_WIDTH = 58 * FIELD_SCALE;
36:export const HALF_L = PITCH_LENGTH / 2;
37:export const HALF_W = PITCH_WIDTH / 2;
44:export const OUT_PLAY_COAST = 0.5;
46:export const GOAL_WIDTH = 7 * GOAL_AND_BOX_SCALE;
47:export const GOAL_DEPTH = 2.2;
49:export const GOAL_HEIGHT = 2.44;
50:export const BOX_DEPTH = 13 * GOAL_AND_BOX_SCALE;
51:export const BOX_WIDTH = 28 * GOAL_AND_BOX_SCALE;
52:export const CENTER_CIRCLE_R = 7 * FIELD_SCALE;
55:export const DT = 1 / 60;
57:export const MATCH_DURATION = 240;
62:export const STOPPAGE_MAX = 8;
80:export const SURFACE_PROFILE: SurfaceProfile = Object.freeze({
82:  ballFrictionK: 0.55,
83:  ballBounce: 0.45,
84:  bounceDamp: 0.72,
85:  bounceMinVz: 2.2,
86:  airSpinDecay: 0.25,
87:  groundSpinDecay: 1.5,
88:  bounceSpinRetention: 0.55,
92:export const BALL_FRICTION_K = SURFACE_PROFILE.ballFrictionK;
93:export const BALL_AIR_SPIN_DECAY = SURFACE_PROFILE.airSpinDecay;
94:export const BALL_GROUND_SPIN_DECAY = SURFACE_PROFILE.groundSpinDecay;
95:export const BALL_BOUNCE_SPIN_RETENTION = SURFACE_PROFILE.bounceSpinRetention;
107:export const STAMINA_DRAIN = 0.01;
108:export const STAMINA_RECOVERY = 0.009;
116:export const TACKLE_LUNGE_COST = 0.02;
128:export const DEFLECT_BLIND_PEN = 0.75;
140:export const CONTACT_BLIND_PEN = 0.7;
151:export const UNSET_BLOCK_WEIGHT = 0.55;
164:export const CROSS_LEAD_FRAC = 0.4;
165:export const CROSS_LEAD_MAX = 3.5;
169:export const GRAVITY = 9.81;
171:export const BALL_BOUNCE = SURFACE_PROFILE.ballBounce;
173:export const BOUNCE_DAMP = SURFACE_PROFILE.bounceDamp;
175:export const BOUNCE_MIN_VZ = SURFACE_PROFILE.bounceMinVz;
177:export const CONTROL_MAX_HEIGHT = 1.3;
179:export const HEADER_MIN_HEIGHT = 1.35;
180:export const HEADER_MAX_HEIGHT = 2.5;
182:export const HEADER_RADIUS = 1.35;
193:export const CHEST_TRAP_MAX_HEIGHT = 1.7;
194:export const CHEST_TRAP_RADIUS = 1.05;
196:export const CHEST_TRAP_MAX_VZ = 1.5;
198:export const GK_CLAIM_HEIGHT = 2.55;
204:export const GK_HOLD_CLEARANCE = 3;
207:export const RESTART_CLEARANCE = 6;
212:export const CORNER_CLEARANCE = 9.15;
214:export const PENALTY_SPOT_DIST = BOX_DEPTH * 0.72;
219:export const PENALTY_CLEARANCE = 8;
221:export const RESTART_MIN_SETUP = 1.0;
223:export const RESTART_TIMEOUT = 6;
226:export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;
234:export const BALL_ACCESS_SIDE_EXTENSION_FACTOR = 1;
235:export const BALL_ACCESS_BACK_EXTENSION_FACTOR = 0.9;
238:export const CONTEST_RADIUS = 3;
240:export const CONTROL_MAX_SPEED = 14;
241:export const GK_CONTROL_MAX_SPEED = 23;
247:export const CONTACT_CONTROL_DELAY_TICKS = 3;
248:export const CONTACT_COMMIT_TIME = 0.08;
250:export const CONTACT_CONTROL_RETENTION_MARGIN = 0.02;
252:export const CONTACT_RELEASE_MIN_SPEED = 0.25;
253:export const CONTACT_RELEASE_MAX_SPEED = 1.2;
254:export const CONTACT_RELEASE_INCOMING_SHARE = 0.12;
256:export const CONTACT_TANGENTIAL_RETENTION = 0.35;
261:export const DEFLECT_MAX_SPEED = 24;
264:export const KICK_COOLDOWN = 0.45;
274:export const PASS_POWER_MIN = 0.85;
275:export const PASS_POWER_MAX = 1.15;
282:export const PASS_POWER_NOISE_K = 0.60;
284:export const PASS_POWER_EXECUTED_MIN = 0.70;
285:export const PASS_POWER_EXECUTED_MAX = 1.30;
297:export const TOUCH_CONTROL_DIST = 4.2;
307:export const TOUCH_PUSH_BASE = 0.9;
311:export const TOUCH_PUSH_SPACE = 0.32;
313:export const TOUCH_RECOLLECT_BASE = 0.26;
314:export const TOUCH_RECOLLECT_PER_PUSH = 0.04;
321:export const GK_RUSH_ENVELOPE = 5;
324:export const AI_INTERVAL = 0.15;
326:export const TEAM_AI_INTERVAL = 0.4;
328:export const SHOT_SPEED = 27;
330:export const PLAYER_MIN_DIST = 1.05 * BODY_SCALE;
332:export const PLAYER_CORE_RADIUS = PLAYER_MIN_DIST / 2;
334:export const BALL_RADIUS = 0.11;
src/ai/prediction.ts
src/sim/profiler.ts:4: * phase grows as the substrate rebuild adds perception/prediction/affordance/
src/ai/reachability.ts:11:/** The kinematic facts S1 exposes to pitch-control and arrival prediction. */
src/ai/relativeAffordance.ts:15:import { predictObservedPosition } from './prediction';
src/ai/passOptionValue.ts:7:import { predictGroundPass, type GroundPassPrediction } from './prediction';
src/ai/passOptionValue.ts:72: * pattern `prediction.ts` mirrors `performPass`: a pure `ai/` module may not
src/sim/profiler.ts:4: * phase grows as the substrate rebuild adds perception/prediction/affordance/
src/ai/passAffordance.ts:4:import { predictGroundPass, predictObservedPosition, type GroundPassPrediction } from './prediction';
src/ai/offBallAffordance.ts:1:import { predictObservedPosition } from './prediction';
src/ai/passCorridorInterception.ts:1:import { predictGroundPass } from './prediction';
src/ai/carryAffordance.ts:4:import { predictObservedPosition } from './prediction';

[35m[3mcodex[0m[0m
One repo discrepancy surfaced: there is no `src/sim/prediction.ts`; the live module is `src/ai/prediction.ts`. I’m treating that as the intended file and will call the path mismatch out in the ledger rather than silently omitting prediction constants.
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/ai/prediction.ts | sed -n '1,320p'; nl -ba src/sim/Player.ts | sed -n '1,430p'; rg -n \"\\b[A-Z][A-Z0-9_]+\\b\" src --glob '*.ts' | rg 'FIELD_SCALE|GOAL_AND_BOX_SCALE|BODY_SCALE|CONTROL_REACH_SCALE|SPEED_TIME_SCALE|PITCH_LENGTH|PITCH_WIDTH|HALF_L|HALF_W|OUT_PLAY_COAST|GOAL_WIDTH|GOAL_DEPTH|GOAL_HEIGHT|BOX_DEPTH|BOX_WIDTH|CENTER_CIRCLE_R|STOPPAGE_MAX|STAMINA_DRAIN|STAMINA_RECOVERY|TACKLE_LUNGE_COST|DEFLECT_BLIND_PEN|CONTACT_BLIND_PEN|UNSET_BLOCK_WEIGHT|CROSS_LEAD_FRAC|CROSS_LEAD_MAX|CONTROL_MAX_HEIGHT|HEADER_MIN_HEIGHT|HEADER_MAX_HEIGHT|HEADER_RADIUS|CHEST_TRAP_MAX_HEIGHT|CHEST_TRAP_RADIUS|CHEST_TRAP_MAX_VZ|GK_CLAIM_HEIGHT|GK_HOLD_CLEARANCE|RESTART_CLEARANCE|CORNER_CLEARANCE|PENALTY_SPOT_DIST|PENALTY_CLEARANCE|RESTART_MIN_SETUP|RESTART_TIMEOUT|CONTROL_RADIUS|CONTEST_RADIUS|CONTROL_MAX_SPEED|GK_CONTROL_MAX_SPEED|DEFLECT_MAX_SPEED|KICK_COOLDOWN|TOUCH_CONTROL_DIST|GK_RUSH_ENVELOPE|AI_INTERVAL|TEAM_AI_INTERVAL|SHOT_SPEED|PLAYER_MIN_DIST|BALL_RADIUS'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
     1	import { BALL_FRICTION_K, DT } from '../sim/constants';
     2	import { clamp } from '../utils/math';
     3	import type { V2 } from '../utils/vec';
     4	
     5	export interface ObservedMotion {
     6	  readonly pos: Readonly<V2>;
     7	  readonly vel: Readonly<V2>;
     8	}
     9	
    10	export interface GroundPassPrediction {
    11	  readonly targetPoint: Readonly<V2>;
    12	  readonly distance: number;
    13	  readonly launchSpeed: number;
    14	  readonly arrivalTime: number;
    15	  readonly reachable: boolean;
    16	}
    17	
    18	/** Constant-velocity short-horizon projection of one observed body. */
    19	export function predictObservedPosition(
    20	  state: ObservedMotion,
    21	  horizon: number,
    22	  maxHorizon = 1.5,
    23	): V2 {
    24	  const t = clamp(horizon, 0, maxHorizon);
    25	  return { x: state.pos.x + state.vel.x * t, y: state.pos.y + state.vel.y * t };
    26	}
    27	
    28	/** First fixed-step tick at which the engine's ground ball reaches a distance. */
    29	export function groundBallTravelTime(distance: number, launchSpeed: number): number {
    30	  const d = Math.max(0, distance);
    31	  const speed = Math.max(launchSpeed, 0);
    32	  if (d === 0) return 0;
    33	  if (speed <= 0) return Infinity;
    34	  // Match moves by v·DT, then multiplies v by exp(-k·DT). The accumulated
    35	  // distance is therefore a geometric series, not the continuous v/k limit.
    36	  const friction = Math.exp(-BALL_FRICTION_K * DT);
    37	  const maxDistance = speed * DT / (1 - friction);
    38	  if (d >= maxDistance) return Infinity;
    39	  const fractionalSteps = Math.log(1 - d / maxDistance) / Math.log(friction);
    40	  return Math.ceil(fractionalSteps - 1e-12) * DT;
    41	}
    42	
    43	/**
    44	 * Predict the ordinary ground-pass primitive without executing it.
    45	 *
    46	 * The lead and launch-speed formulas mirror mechanics.performPass before its
    47	 * technical/pressure RNG error. This is intended flight, not guaranteed
    48	 * completion; S2 execution quality remains a separate dimension.
    49	 */
    50	export function predictGroundPass(
    51	  from: Readonly<V2>,
    52	  target: ObservedMotion,
    53	  powerMultiplier = 1,
    54	): GroundPassPrediction {
    55	  const power = Math.max(0.1, powerMultiplier);
    56	  const dx0 = target.pos.x - from.x;
    57	  const dy0 = target.pos.y - from.y;
    58	  const initialDistance = Math.hypot(dx0, dy0);
    59	  const leadTime = initialDistance / (16 * power);
    60	  const targetPoint = {
    61	    x: target.pos.x + target.vel.x * leadTime * 0.8,
    62	    y: target.pos.y + target.vel.y * leadTime * 0.8,
    63	  };
    64	  const distance = Math.hypot(targetPoint.x - from.x, targetPoint.y - from.y);
    65	  const launchSpeed = clamp(distance * 0.6 + 8.2, 9, 22) * power;
    66	  const arrivalTime = groundBallTravelTime(distance, launchSpeed);
    67	  return {
    68	    targetPoint,
    69	    distance,
    70	    launchSpeed,
    71	    arrivalTime,
    72	    reachable: Number.isFinite(arrivalTime),
    73	  };
    74	}
     1	import { v2, type V2 } from '../utils/vec';
     2	import { PLAYER_CORE_RADIUS, STAMINA_DRAIN, STAMINA_RECOVERY } from './constants';
     3	import type { PlayerAttributes } from '../evolution/playerGenome';
     4	import { traitsOf, type Trait } from '../evolution/traits';
     5	import { TEAM_SIZE, type ActionState, type Role, type Side } from './types';
     6	
     7	/** Physical top speed by role (m/s) before pace/stamina scaling. */
     8	const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };
     9	const ACCEL = 14; // m/s^2 toward desired velocity
    10	
    11	/**
    12	 * Body turn rate (rad/s), Phase 27: heading sweeps toward the movement
    13	 * direction instead of snapping to it, so a 180° cut takes ~0.48s of visible
    14	 * rotation. Velocity itself is already inertia-bound by ACCEL — this cap is
    15	 * what the eye (and the kick-orientation mechanics) read as "facing".
    16	 */
    17	export const TURN_RATE = 6.5;
    18	// cos/sin of the per-step turn cap, cached per dt (the sim always uses DT).
    19	let turnDt = -1;
    20	let turnCos = 1;
    21	let turnSin = 0;
    22	
    23	export class Player {
    24	  /** Index within team (0..5, slot order GK/DF/MF/WGL/WGR/ST). */
    25	  readonly index: number;
    26	  /** Global id across both teams (0..11), = side * TEAM_SIZE + index. */
    27	  readonly gid: number;
    28	  readonly side: Side;
    29	  readonly role: Role;
    30	  /**
    31	   * Roster row this body's stats land on (Phase 61): a starter's slot index,
    32	   * a substitute's bench row. The PLAYER OBJECT is the pitch slot — a sub
    33	   * swaps its identity in place (`becomeSub`), so every gid-keyed reference
    34	   * (marks, renderer models, action targets) survives the change.
    35	   */
    36	  rosterIdx: number;
    37	  /** Identity fields — mutated ONLY by becomeSub (the bench, Phase 61). */
    38	  name: string;
    39	  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
    40	  attrs: PlayerAttributes;
    41	
    42	  pos = v2();
    43	  vel = v2();
    44	  heading = v2(1, 0);
    45	  /**
    46	   * World-model body direction (M0): the existing capped-rate heading is the
    47	   * canonical facing state. Exposing it by semantic name adds no second state
    48	   * that could drift, and it remains independent of velocity direction.
    49	   */
    50	  get bodyDir(): Readonly<V2> {
    51	    return this.heading;
    52	  }
    53	  /** Stable kinematic core; interaction reach lives outside this disc. */
    54	  get coreRadius(): number {
    55	    return PLAYER_CORE_RADIUS;
    56	  }
    57	  /** Set every frame by the action executor; physics chases it. */
    58	  desiredVel = v2();
    59	  /**
    60	   * When set (by the executor, per frame), heading turns toward this point
    61	   * instead of the movement direction — keepers backpedal FACING the play
    62	   * (27.5). Holds a live reference (e.g. ball.pos); cleared each frame.
    63	   */
    64	  faceTarget: V2 | null = null;
    65	
    66	  stamina = 1;
    67	  staminaSpent = 0;
    68	  distance = 0;
    69	
    70	  action: ActionState = { type: 'HoldPosition', scores: [] };
    71	  decisionTimer = 0;
    72	  kickCooldown = 0;
    73	  tackleCooldown = 0;
    74	  /**
    75	   * Recovery stun (Phase 27): a dispossessed carrier stumbles and a beaten
    76	   * lunger picks themself up — movement is heavily damped while it runs, and
    77	   * a stunned player can't control a loose ball or tackle.
    78	   */
    79	  stunTimer = 0;
    80	  /**
    81	   * Keeper hold (Phase 27.2): after claiming the ball a keeper scoops it up
    82	   * and holds it briefly — untackleable, ball carried in the hands — before
    83	   * distributing. Never set for restart first touches (goal kicks stay quick).
    84	   */
    85	  gkHoldTimer = 0;
    86	  /**
    87	   * Discrete touches (Phase 36): time until this carrier may PUSH the ball
    88	   * again. Set at capture so the first decision happens ON the ball (the
    89	   * settle touch and the pass game keep their timing); a decision that
    90	   * keeps Dribble releases the next push.
    91	   */
    92	  touchTimer = 0;
    93	  /** Display-only: renderers play a lunge animation while this runs. */
    94	  tackleAnimTimer = 0;
    95	  /** Display-only: renderers play a keeper dive while this runs (27.4). */
    96	  saveAnimTimer = 0;
    97	  /** Display-only: renderers play a header jump while this runs (Phase 28). */
    98	  headerAnimTimer = 0;
    99	  /**
   100	   * Keeper distribution mode (Phase 28.3): set while holding the ball in the
   101	   * hands, cleared on the kick — a keeper who HELD the ball releases it
   102	   * deliberately (throw/pass/switch), never with a panic hoof.
   103	   */
   104	  gkDistributing = false;
   105	  /**
   106	   * Shape-wait budget spent (Phase 30.3): while distributing, the keeper
   107	   * re-arms the hold in small quanta until the outfielders settle into
   108	   * shape; this counts what's been spent so a parked team can't stall the
   109	   * match. Reset when a fresh hold starts.
   110	   */
   111	  gkShapeWait = 0;
   112	  /**
   113	   * One-touch window (Phase 31.9, 一脚出球): set at a PRESSURED reception —
   114	   * the receiver decides immediately, and a pass kicked while this runs is
   115	   * played first-time: extra aim noise, discounted by technique. Any kick
   116	   * consumes it; expiry means they took a settle touch after all.
   117	   */
   118	  firstTouchWindow = 0;
   119	  /**
   120	   * Marker reaction lag (Phase 31.9, the headed-game pass): while the mark
   121	   * SPRINTS near our goal, the marking stance target is frozen here and
   122	   * only re-read on the marker's reaction cadence (0.2–0.45s by defending)
   123	   * — frame-perfect shadowing had made the attacking header extinct.
   124	   */
   125	  markAnchor: V2 | null = null;
   126	  markAnchorAge = 0;
   127	  markAnchorIdx: number | null = null;
   128	  /**
   129	   * 2过1 burst license (Phase 34): granted when this player plays a short
   130	   * pass under pressure — for its ~1.1s he sprints past his marker and the
   131	   * return ball INTO him (from `partnerGid`) is scored as the wall pass,
   132	   * not the "handing it straight back" it would otherwise read as.
   133	   */
   134	  wallRun: { until: number; partnerGid: number } | null = null;
   135	  /**
   136	   * Containment hysteresis (Phase 101): whether this chaser is currently
   137	   * JOCKEYING the carrier. The phase-92 goal-side test was a razor-edge
   138	   * boolean — a chaser dancing on the −0.2 offset flipped between the
   139	   * standoff point and the ball 66-70 times/match (`hold-jitter.ts`), a
   140	   * brain-level whip the render reads as twitching. Enter containment only
   141	   * clearly goal-side, hold it until clearly not. Runtime-only state.
   142	   */
   143	  containing = false;
   144	
   145	  /**
   146	   * Slalom COMMITMENT (Phase 41.2, user report "带球转一大圈然后突然丢
   147	   * 球"): the side picked to beat the current blocker, held until the
   148	   * timestamp. Without it a defender shadowing the carrier on the goal
   149	   * axis flipped the perp sign every few ticks — the turn-rate cap
   150	   * integrated the flip-flop into a full pirouette at walking pace
   151	   * (momentum gone = no pace protection) until the tackle landed. A real
   152	   * dribbler picks a shoulder and goes.
   153	   */
   154	  slalomSide: 1 | -1 = 1;
   155	  slalomUntil = -1;
   156	
   157	  /** Age in seasons (Phase 26) — display only, set by Team from TeamInfo. */
   158	  age?: number;
   159	  /** Has a yellow card this match — a second booking is a red (Phase 25). */
   160	  booked = false;
   161	  /** Sent off: parked on the apron, excluded from every sim interaction. */
   162	  sentOff = false;
   163	  /** Injury state (Phase 118): a 'knock' plays on visibly slower; 'serious'
   164	   * comes off (the league ban rides MatchResult.injuries). Reset on sub. */
   165	  injured?: 'knock' | 'serious';
   166	
   167	  baseSpeed: number;
   168	  accel: number;
   169	  /** Traits (Phase 39) — derived from attrs+role, ≤2. Recomputed on becomeSub. */
   170	  traits: readonly Trait[];
   171	  /** Cached engine-trait drain factor (hot path — no includes() per step). */
   172	  staminaDrainMul: number;
   173	
   174	  constructor(side: Side, index: number, role: Role, name: string, attrs: PlayerAttributes) {
   175	    this.side = side;
   176	    this.index = index;
   177	    this.gid = side * TEAM_SIZE + index;
   178	    this.rosterIdx = index;
   179	    this.role = role;
   180	    this.name = name;
   181	    this.attrs = attrs;
   182	    // pace: ±12% top speed, ±10% acceleration around the role baseline.
   183	    this.baseSpeed = BASE_SPEED[role] * (0.88 + attrs.pace * 0.24);
   184	    this.accel = ACCEL * (0.9 + attrs.pace * 0.2);
   185	    // Traits (Phase 39): derived, never stored — a developing player grows
   186	    // into (or out of) them. Hot-path effects are cached as plain numbers.
   187	    this.traits = traitsOf(attrs, role);
   188	    this.staminaDrainMul = this.traits.includes('engine') ? 0.9 : 1;
   189	  }
   190	
   191	  /**
   192	   * The SUBSTITUTION (Phase 61, N2): this pitch slot changes bodies. The
   193	   * object survives so every reference keyed by gid stays valid; the
   194	   * identity — name, genes, traits, speed — becomes the bench player's.
   195	   * Fresh legs are the bench's whole payoff: stamina resets to 1. Cards
   196	   * are personal (the new man is unbooked). distance/staminaSpent are NOT
   197	   * reset — they fold into TEAM totals at full time and must keep the
   198	   * outgoing man's work.
   199	   */
   200	  /** A KNOCK (Phase 118): hurt but playing on — pace and close control
   201	   * degrade for the rest of his match. The attrs object is REPLACED, never
   202	   * mutated: the roster row is shared with the franchise. */
   203	  takeKnock(): void {
   204	    this.injured = 'knock';
   205	    this.attrs = { ...this.attrs, pace: this.attrs.pace * 0.8, dribbling: this.attrs.dribbling * 0.85 };
   206	    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + this.attrs.pace * 0.24);
   207	    this.accel = ACCEL * (0.9 + this.attrs.pace * 0.2);
   208	  }
   209	
   210	  becomeSub(sub: { rosterIdx: number; name: string; attrs: PlayerAttributes; age?: number }, pos: V2): void {
   211	    this.name = sub.name;
   212	    this.attrs = sub.attrs;
   213	    this.age = sub.age;
   214	    this.rosterIdx = sub.rosterIdx;
   215	    this.baseSpeed = BASE_SPEED[this.role] * (0.88 + sub.attrs.pace * 0.24);
   216	    this.accel = ACCEL * (0.9 + sub.attrs.pace * 0.2);
   217	    this.traits = traitsOf(sub.attrs, this.role);
   218	    this.staminaDrainMul = this.traits.includes('engine') ? 0.9 : 1;
   219	    this.stamina = 1;
   220	    this.booked = false;
   221	    this.injured = undefined; // the new man arrives whole (Phase 118)
   222	    this.pos = v2(pos.x, pos.y);
   223	    this.vel = v2();
   224	    this.desiredVel = v2();
   225	    this.heading = v2(0, pos.y > 0 ? -1 : 1); // facing the pitch he steps onto
   226	    this.faceTarget = null;
   227	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   228	    this.kickCooldown = 0;
   229	    this.tackleCooldown = 0;
   230	    this.stunTimer = 0;
   231	    this.touchTimer = 0;
   232	    this.gkHoldTimer = 0;
   233	    this.gkDistributing = false;
   234	    this.gkShapeWait = 0;
   235	    this.tackleAnimTimer = 0;
   236	    this.saveAnimTimer = 0;
   237	    this.headerAnimTimer = 0;
   238	    this.firstTouchWindow = 0;
   239	    this.markAnchor = null;
   240	    this.markAnchorAge = 0;
   241	    this.markAnchorIdx = null;
   242	    this.wallRun = null;
   243	  }
   244	
   245	  /** Effective top speed — tired players slow down but never stop. */
   246	  get topSpeed(): number {
   247	    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
   248	  }
   249	
   250	  physicsStep(dt: number): void {
   251	    // In-place integration — this ran as clampLen/approachV/add/norm, which
   252	    // allocated ~6 vectors per player per step (860k per match). The exact
   253	    // same operations in the exact same IEEE order, written out flat:
   254	    // results are bit-identical (regression: same seed ⇒ same save JSON).
   255	    const dv = this.desiredVel;
   256	    const max = this.topSpeed;
   257	    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen
   258	    let tx = dv.x;
   259	    let ty = dv.y;
   260	    if (dl > max && dl > 1e-8) {
   261	      const s = max / dl;
   262	      tx = dv.x * s;
   263	      ty = dv.y * s;
   264	    }
   265	    // Stunned (Phase 27): stumbling players can barely move until they recover.
   266	    if (this.stunTimer > 0) {
   267	      tx *= 0.15;
   268	      ty *= 0.15;
   269	    }
   270	    const maxDelta = this.accel * dt; // approachV
   271	    const ax = tx - this.vel.x;
   272	    const ay = ty - this.vel.y;
   273	    const al = Math.sqrt(ax * ax + ay * ay);
   274	    if (al <= maxDelta || al < 1e-8) {
   275	      this.vel.x = tx;
   276	      this.vel.y = ty;
   277	    } else {
   278	      const s = maxDelta / al;
   279	      this.vel.x = this.vel.x + ax * s;
   280	      this.vel.y = this.vel.y + ay * s;
   281	    }
   282	    this.pos.x = this.pos.x + this.vel.x * dt;
   283	    this.pos.y = this.pos.y + this.vel.y * dt;
   284	
   285	    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
   286	    // Rotate heading toward the face target (backpedal, 27.5) or, failing
   287	    // that, the movement direction — capped at TURN_RATE either way.
   288	    // No trig in the loop: the per-step rotation's cos/sin are cached per dt.
   289	    if (dt !== turnDt) {
   290	      turnDt = dt;
   291	      turnCos = Math.cos(TURN_RATE * dt);
   292	      turnSin = Math.sin(TURN_RATE * dt);
   293	    }
   294	    const ft = this.faceTarget;
   295	    let wx = 0;
   296	    let wy = 0;
   297	    let turn = false;
   298	    if (ft) {
   299	      const fx = ft.x - this.pos.x;
   300	      const fy = ft.y - this.pos.y;
   301	      const fl = Math.sqrt(fx * fx + fy * fy);
   302	      if (fl > 1e-6) {
   303	        wx = fx / fl;
   304	        wy = fy / fl;
   305	        turn = true;
   306	      }
   307	    } else if (sp > 0.5) {
   308	      wx = this.vel.x / sp;
   309	      wy = this.vel.y / sp;
   310	      turn = true;
   311	    }
   312	    if (turn) {
   313	      const hx = this.heading.x;
   314	      const hy = this.heading.y;
   315	      if (hx * wx + hy * wy >= turnCos) {
   316	        this.heading = { x: wx, y: wy };
   317	      } else {
   318	        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
   319	        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
   320	      }
   321	    }
   322	    this.distance += sp * dt;
   323	
   324	    // Stamina: quadratic drain above ~55% effort, slow recovery when jogging/idle.
   325	    // The engine trait (Phase 39) drains 10% slower — the motor runs all day.
   326	    const effort = sp / this.baseSpeed;
   327	    // The stamina ATTRIBUTE scales drain and recovery (Phase 47): neutral
   328	    // at the 0.4 backfill so the league's energy economy doesn't move —
   329	    // the motor is now a dimension evolution can spend on.
   330	    // Phase 58: drain/recovery repriced so the economy BINDS in-match
   331	    // (constants.ts has the story) — legs are a resource, not a gauge.
   332	    if (effort > 0.55) {
   333	      const drain =
   334	        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   335	      this.stamina = Math.max(0.05, this.stamina - drain);
   336	      this.staminaSpent += drain;
   337	    } else {
   338	      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
   339	    }
   340	
   341	    this.kickCooldown = Math.max(0, this.kickCooldown - dt);
   342	    this.tackleCooldown = Math.max(0, this.tackleCooldown - dt);
   343	    this.touchTimer = Math.max(0, this.touchTimer - dt);
   344	    this.stunTimer = Math.max(0, this.stunTimer - dt);
   345	    this.gkHoldTimer = Math.max(0, this.gkHoldTimer - dt);
   346	    this.tackleAnimTimer = Math.max(0, this.tackleAnimTimer - dt);
   347	    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
   348	    this.headerAnimTimer = Math.max(0, this.headerAnimTimer - dt);
   349	    this.firstTouchWindow = Math.max(0, this.firstTouchWindow - dt);
   350	    this.decisionTimer -= dt;
   351	  }
   352	
   353	  /**
   354	   * An instantaneous burst the movement drain never saw — a tackle lunge
   355	   * (Phase 58). Same per-player modifiers as the running drain, so engines
   356	   * and high-stamina players absorb bursts better too.
   357	   */
   358	  spendBurst(cost: number): void {
   359	    const drain = cost * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   360	    this.stamina = Math.max(0.05, this.stamina - drain);
   361	    this.staminaSpent += drain;
   362	  }
   363	
   364	  resetForKickoff(pos: V2): void {
   365	    this.pos = pos;
   366	    this.vel = v2();
   367	    this.desiredVel = v2();
   368	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   369	    this.kickCooldown = 0;
   370	    this.tackleCooldown = 0;
   371	    this.stunTimer = 0;
   372	    this.gkHoldTimer = 0;
   373	    this.gkDistributing = false;
   374	    this.gkShapeWait = 0;
   375	    this.tackleAnimTimer = 0;
   376	    this.saveAnimTimer = 0;
   377	    this.headerAnimTimer = 0;
   378	    this.firstTouchWindow = 0;
   379	    this.slalomUntil = -1;
   380	  }
   381	}
src/sim/rendezvousRecovery.ts:4:import { BALL_FRICTION_K, BALL_RADIUS, CONTROL_RADIUS, DT } from './constants';
src/sim/rendezvousRecovery.ts:288:    radius: input.ball.radius ?? BALL_RADIUS,
src/sim/rendezvousRecovery.ts:334:        radius: input.ball.radius ?? BALL_RADIUS,
src/sim/rendezvousRecovery.ts:396:        actualBallAtContact: { pos: cloneV2(ball.pos), vel: cloneV2(ball.vel), radius: BALL_RADIUS },
src/sim/rendezvousRecovery.ts:436:    { pos: ball.pos, radius: plan.ballAfterSingleImpulse.radius ?? BALL_RADIUS },
src/sim/rendezvousRecovery.ts:438:    CONTROL_RADIUS,
src/sim/rendezvousRecovery.ts:443:  const contacted = access.canDirectlyContact && footError <= BALL_RADIUS * 2;
src/sim/rendezvousRecovery.ts:451:      radius: plan.ballAfterSingleImpulse.radius ?? BALL_RADIUS,
src/sim/controlCoupling.ts:2:import { BALL_RADIUS, PLAYER_CORE_RADIUS } from './constants';
src/sim/controlCoupling.ts:155:  ballRadius = BALL_RADIUS,
src/sim/Team.ts:4:import { HALF_L } from './constants';
src/sim/Team.ts:130:  progressLocalX = -HALF_L;
src/sim/Team.ts:206:    this.ownGoalPos = v2(-this.attackDir * HALF_L, 0);
src/sim/Team.ts:207:    this.oppGoalPos = v2(this.attackDir * HALF_L, 0);
src/render/PitchRenderer.ts:3:  BOX_DEPTH, BOX_WIDTH, CENTER_CIRCLE_R, GOAL_DEPTH, GOAL_WIDTH, PITCH_LENGTH, PITCH_WIDTH,
src/render/PitchRenderer.ts:20:    const stripeW = (PITCH_LENGTH * SCALE) / stripes;
src/render/PitchRenderer.ts:22:      g.rect(MARGIN + i * stripeW, MARGIN, stripeW, PITCH_WIDTH * SCALE).fill(i % 2 === 0 ? GRASS_A : GRASS_B);
src/render/PitchRenderer.ts:29:    g.rect(MARGIN, MARGIN, PITCH_LENGTH * SCALE, PITCH_WIDTH * SCALE).stroke(stroke);
src/render/PitchRenderer.ts:30:    g.moveTo(toPxX(0), toPxY(-PITCH_WIDTH / 2)).lineTo(toPxX(0), toPxY(PITCH_WIDTH / 2)).stroke(stroke);
src/render/PitchRenderer.ts:33:    g.circle(toPxX(0), toPxY(0), CENTER_CIRCLE_R * SCALE).stroke(stroke);
src/render/PitchRenderer.ts:37:    const boxPxW = BOX_WIDTH * SCALE;
src/render/PitchRenderer.ts:38:    const boxPxD = BOX_DEPTH * SCALE;
src/render/PitchRenderer.ts:39:    g.rect(toPxX(-PITCH_LENGTH / 2), toPxY(-BOX_WIDTH / 2), boxPxD, boxPxW).stroke(stroke);
src/render/PitchRenderer.ts:40:    g.rect(toPxX(PITCH_LENGTH / 2) - boxPxD, toPxY(-BOX_WIDTH / 2), boxPxD, boxPxW).stroke(stroke);
src/render/PitchRenderer.ts:43:    const goalPxW = GOAL_WIDTH * SCALE;
src/render/PitchRenderer.ts:44:    const goalPxD = GOAL_DEPTH * SCALE;
src/render/PitchRenderer.ts:45:    g.rect(toPxX(-PITCH_LENGTH / 2) - goalPxD, toPxY(-GOAL_WIDTH / 2), goalPxD, goalPxW)
src/render/PitchRenderer.ts:48:    g.rect(toPxX(PITCH_LENGTH / 2), toPxY(-GOAL_WIDTH / 2), goalPxD, goalPxW)
src/sim/Ball.ts:2:import { BALL_RADIUS } from './constants';
src/sim/Ball.ts:17:    return BALL_RADIUS;
src/render/transform.ts:1:import { HALF_L, HALF_W, PITCH_LENGTH, PITCH_WIDTH } from '../sim/constants';
src/render/transform.ts:7:export const CANVAS_W = PITCH_LENGTH * SCALE + MARGIN * 2;
src/render/transform.ts:8:export const CANVAS_H = PITCH_WIDTH * SCALE + MARGIN * 2;
src/render/transform.ts:10:export const toPxX = (x: number): number => MARGIN + (x + HALF_L) * SCALE;
src/render/transform.ts:11:export const toPxY = (y: number): number => MARGIN + (y + HALF_W) * SCALE;
src/sim/Player.ts:2:import { PLAYER_CORE_RADIUS, STAMINA_DRAIN, STAMINA_RECOVERY } from './constants';
src/sim/Player.ts:334:        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
src/sim/Player.ts:338:      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
src/render3d/LinesmanModel.ts:2:import { HALF_L, HALF_W } from '../sim/constants';
src/render3d/LinesmanModel.ts:39:  return end * Math.min(HALF_L - 0.5, Math.max(0, m));
src/render3d/LinesmanModel.ts:114:    this.root.position.set(0, 0, zSide * (HALF_W + 0.8));
src/render/MatchRenderer.ts:4:import { BALL_RADIUS, HALF_L, HALF_W, PITCH_LENGTH, PITCH_WIDTH } from '../sim/constants';
src/render/MatchRenderer.ts:215:    const r = Math.max(2.4, BALL_RADIUS * SCALE * BALL_VISUAL_SCALE) * (1 + Math.min(z, 8) * 0.13);
src/render/MatchRenderer.ts:220:      const cx = Math.floor(((match.ball.pos.x + HALF_L) / PITCH_LENGTH) * this.heatCols);
src/render/MatchRenderer.ts:221:      const cy = Math.floor(((match.ball.pos.y + HALF_W) / PITCH_WIDTH) * this.heatRows);
src/render/MatchRenderer.ts:238:    const cw = (PITCH_LENGTH * SCALE) / this.heatCols;
src/render/MatchRenderer.ts:239:    const ch = (PITCH_WIDTH * SCALE) / this.heatRows;
src/render3d/PitchModel.ts:3:  BOX_DEPTH, BOX_WIDTH, CENTER_CIRCLE_R, FIELD_SCALE, GOAL_WIDTH, HALF_L, HALF_W,
src/render3d/PitchModel.ts:19:  const w = (HALF_L + apron) * 2;
src/render3d/PitchModel.ts:20:  const h = (HALF_W + apron) * 2;
src/render3d/PitchModel.ts:35:  // FIELD_SCALE (2026-07-20 density相变): the fixed 24m board at ±30 spilled
src/render3d/PitchModel.ts:37:  const s = FIELD_SCALE;
src/render3d/PitchModel.ts:43:    { x: -30 * s, z: -HALF_W - 3.4 * s, rot: 0 },
src/render3d/PitchModel.ts:44:    { x: 0, z: -HALF_W - 3.4 * s, rot: 0 },
src/render3d/PitchModel.ts:45:    { x: 30 * s, z: -HALF_W - 3.4 * s, rot: 0 },
src/render3d/PitchModel.ts:46:    { x: -HALF_L - 3.6 * s, z: -18 * s, rot: Math.PI / 2 },
src/render3d/PitchModel.ts:47:    { x: -HALF_L - 3.6 * s, z: 18 * s, rot: Math.PI / 2 },
src/render3d/PitchModel.ts:48:    { x: HALF_L + 3.6 * s, z: -18 * s, rot: Math.PI / 2 },
src/render3d/PitchModel.ts:49:    { x: HALF_L + 3.6 * s, z: 18 * s, rot: Math.PI / 2 },
src/render3d/PitchModel.ts:77:      pole.position.set(sx * HALF_L, 1.0, sz * HALF_W);
src/render3d/PitchModel.ts:81:      flag.position.set(sx * HALF_L - sx * 0.27, 1.78, sz * HALF_W);
src/render3d/PitchModel.ts:122: * - NEAR (+z) side: one bank, and pushed to HALF_W + 6 rather than the usual
src/render3d/PitchModel.ts:147:  mk(HALF_L * 2 + 6, 0, -HALF_W - 1.8, 0, FAR_ROWS); // main stand, carries the height
src/render3d/PitchModel.ts:156:  const cx = HALF_L + inset + 0.9;
src/render3d/PitchModel.ts:157:  const cz = HALF_W + inset + 0.9;
src/render3d/PitchModel.ts:165:  mk(HALF_W * 2 - 4, -HALF_L - 4.0, 0, Math.PI / 2, 1);
src/render3d/PitchModel.ts:166:  mk(HALF_W * 2 - 4, HALF_L + 4.0, 0, -Math.PI / 2, 1);
src/render3d/PitchModel.ts:168:  mk(HALF_L * 2 + 6, 0, HALF_W + NEAR_STAND_GAP, Math.PI, 1);
src/render3d/PitchModel.ts:210:  const zFront = -HALF_W - 1.8;
src/render3d/PitchModel.ts:212:  const w = HALF_L * 2 + 8;
src/render3d/PitchModel.ts:257:      const x = sx * (HALF_L + 8);
src/render3d/PitchModel.ts:258:      const z = sz * (HALF_W + 7);
src/render3d/PitchModel.ts:284:    { x: -HALF_L + BOX_DEPTH * 0.35, z: 0, rx: BOX_DEPTH * 0.5, rz: GOAL_WIDTH * 1.1, w: 1 },
src/render3d/PitchModel.ts:285:    { x: HALF_L - BOX_DEPTH * 0.35, z: 0, rx: BOX_DEPTH * 0.5, rz: GOAL_WIDTH * 1.1, w: 1 },
src/render3d/PitchModel.ts:286:    { x: 0, z: 0, rx: CENTER_CIRCLE_R * 1.1, rz: CENTER_CIRCLE_R * 0.9, w: 0.65 },
src/render3d/PitchModel.ts:287:    { x: 0, z: -HALF_W * 0.78, rx: HALF_L * 0.62, rz: HALF_W * 0.16, w: 0.5 },
src/render3d/PitchModel.ts:288:    { x: 0, z: HALF_W * 0.78, rx: HALF_L * 0.62, rz: HALF_W * 0.16, w: 0.5 },
src/render3d/PitchModel.ts:314:  const cw = (HALF_L + apron) * 2 * PX;
src/render3d/PitchModel.ts:315:  const ch = (HALF_W + apron) * 2 * PX;
src/render3d/PitchModel.ts:321:  const X = (x: number) => (x + HALF_L + apron) * PX;
src/render3d/PitchModel.ts:322:  const Z = (z: number) => (z + HALF_W + apron) * PX;
src/render3d/PitchModel.ts:328:  const stripeW = (HALF_L * 2 * PX) / g.stripes;
src/render3d/PitchModel.ts:331:    ctx.fillRect(X(-HALF_L) + i * stripeW, Z(-HALF_W), stripeW, HALF_W * 2 * PX);
src/render3d/PitchModel.ts:334:  const crossH = (HALF_W * 2 * PX) / cross;
src/render3d/PitchModel.ts:337:    ctx.fillRect(X(-HALF_L), Z(-HALF_W) + i * crossH, HALF_L * 2 * PX, crossH);
src/render3d/PitchModel.ts:345:    const px = X(-HALF_L) + rand() * HALF_L * 2 * PX;
src/render3d/PitchModel.ts:346:    const pz = Z(-HALF_W) + rand() * HALF_W * 2 * PX;
src/render3d/PitchModel.ts:367:  ctx.strokeRect(X(-HALF_L), Z(-HALF_W), HALF_L * 2 * PX, HALF_W * 2 * PX);
src/render3d/PitchModel.ts:369:  ctx.moveTo(X(0), Z(-HALF_W));
src/render3d/PitchModel.ts:370:  ctx.lineTo(X(0), Z(HALF_W));
src/render3d/PitchModel.ts:375:  ctx.arc(X(0), Z(0), CENTER_CIRCLE_R * PX, 0, Math.PI * 2);
src/render3d/PitchModel.ts:385:    [X(-HALF_L), Z(-HALF_W), 0],
src/render3d/PitchModel.ts:386:    [X(HALF_L), Z(-HALF_W), Math.PI / 2],
src/render3d/PitchModel.ts:387:    [X(HALF_L), Z(HALF_W), Math.PI],
src/render3d/PitchModel.ts:388:    [X(-HALF_L), Z(HALF_W), -Math.PI / 2],
src/render3d/PitchModel.ts:398:    const edge = side * HALF_L;
src/render3d/PitchModel.ts:400:      Math.min(X(edge), X(edge - side * BOX_DEPTH)),
src/render3d/PitchModel.ts:401:      Z(-BOX_WIDTH / 2),
src/render3d/PitchModel.ts:402:      BOX_DEPTH * PX,
src/render3d/PitchModel.ts:403:      BOX_WIDTH * PX,
src/render3d/PitchModel.ts:405:    const gbDepth = BOX_DEPTH * 0.45;
src/render3d/PitchModel.ts:406:    const gbWidth = GOAL_WIDTH + 6;
src/render3d/PitchModel.ts:413:    const spotX = X(edge - side * BOX_DEPTH * 0.72);
src/render3d/PitchModel.ts:421:    const boxEdgeX = X(edge - side * BOX_DEPTH);
src/sim/constants.ts:27:export const FIELD_SCALE = positiveEnv('FIELD_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
src/sim/constants.ts:28:export const GOAL_AND_BOX_SCALE =
src/sim/constants.ts:29:  positiveEnv('GOAL_AND_BOX_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
src/sim/constants.ts:30:export const BODY_SCALE = positiveEnv('BODY_SCALE') ?? 1;
src/sim/constants.ts:31:export const CONTROL_REACH_SCALE = positiveEnv('CONTROL_REACH_SCALE') ?? 1;
src/sim/constants.ts:32:export const SPEED_TIME_SCALE = positiveEnv('SPEED_TIME_SCALE') ?? 1;
src/sim/constants.ts:34:export const PITCH_LENGTH = 90 * FIELD_SCALE;
src/sim/constants.ts:35:export const PITCH_WIDTH = 58 * FIELD_SCALE;
src/sim/constants.ts:36:export const HALF_L = PITCH_LENGTH / 2;
src/sim/constants.ts:37:export const HALF_W = PITCH_WIDTH / 2;
src/sim/constants.ts:44:export const OUT_PLAY_COAST = 0.5;
src/sim/constants.ts:46:export const GOAL_WIDTH = 7 * GOAL_AND_BOX_SCALE;
src/sim/constants.ts:47:export const GOAL_DEPTH = 2.2;
src/sim/constants.ts:49:export const GOAL_HEIGHT = 2.44;
src/sim/constants.ts:50:export const BOX_DEPTH = 13 * GOAL_AND_BOX_SCALE;
src/sim/constants.ts:51:export const BOX_WIDTH = 28 * GOAL_AND_BOX_SCALE;
src/sim/constants.ts:52:export const CENTER_CIRCLE_R = 7 * FIELD_SCALE;
src/sim/constants.ts:62:export const STOPPAGE_MAX = 8;
src/sim/constants.ts:107:export const STAMINA_DRAIN = 0.01;
src/sim/constants.ts:108:export const STAMINA_RECOVERY = 0.009;
src/sim/constants.ts:116:export const TACKLE_LUNGE_COST = 0.02;
src/sim/constants.ts:128:export const DEFLECT_BLIND_PEN = 0.75;
src/sim/constants.ts:133: * 19 m/s cutback under CONTROL_MAX_SPEED mid-flight, and every bystander
src/sim/constants.ts:140:export const CONTACT_BLIND_PEN = 0.7;
src/sim/constants.ts:151:export const UNSET_BLOCK_WEIGHT = 0.55;
src/sim/constants.ts:164:export const CROSS_LEAD_FRAC = 0.4;
src/sim/constants.ts:165:export const CROSS_LEAD_MAX = 3.5;
src/sim/constants.ts:177:export const CONTROL_MAX_HEIGHT = 1.3;
src/sim/constants.ts:179:export const HEADER_MIN_HEIGHT = 1.35;
src/sim/constants.ts:180:export const HEADER_MAX_HEIGHT = 2.5;
src/sim/constants.ts:182:export const HEADER_RADIUS = 1.35;
src/sim/constants.ts:191: * the trapper must be almost under it (tighter than HEADER_RADIUS).
src/sim/constants.ts:193:export const CHEST_TRAP_MAX_HEIGHT = 1.7;
src/sim/constants.ts:194:export const CHEST_TRAP_RADIUS = 1.05;
src/sim/constants.ts:196:export const CHEST_TRAP_MAX_VZ = 1.5;
src/sim/constants.ts:198:export const GK_CLAIM_HEIGHT = 2.55;
src/sim/constants.ts:204:export const GK_HOLD_CLEARANCE = 3;
src/sim/constants.ts:207:export const RESTART_CLEARANCE = 6;
src/sim/constants.ts:212:export const CORNER_CLEARANCE = 9.15;
src/sim/constants.ts:213:/** Penalty spot distance from the goal line — matches the drawn spot (BOX_DEPTH · 0.72). */
src/sim/constants.ts:214:export const PENALTY_SPOT_DIST = BOX_DEPTH * 0.72;
src/sim/constants.ts:219:export const PENALTY_CLEARANCE = 8;
src/sim/constants.ts:221:export const RESTART_MIN_SETUP = 1.0;
src/sim/constants.ts:223:export const RESTART_TIMEOUT = 6;
src/sim/constants.ts:226:export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;
src/sim/constants.ts:230: * Front and lateral contact keep the old CONTROL_RADIUS exactly. Rear contact
src/sim/constants.ts:238:export const CONTEST_RADIUS = 3;
src/sim/constants.ts:240:export const CONTROL_MAX_SPEED = 14;
src/sim/constants.ts:241:export const GK_CONTROL_MAX_SPEED = 23;
src/sim/constants.ts:258: * Faster balls (hard passes, not shots — SHOT_SPEED is 27) can still be
src/sim/constants.ts:261:export const DEFLECT_MAX_SPEED = 24;
src/sim/constants.ts:264:export const KICK_COOLDOWN = 0.45;
src/sim/constants.ts:291: * pressure (an opponent inside TOUCH_CONTROL_DIST) the carry stays glued:
src/sim/constants.ts:297:export const TOUCH_CONTROL_DIST = 4.2;
src/sim/constants.ts:316: * is DEAD (GK_CONTROL_MAX_SPEED 23 vs outfield 14, plus hands in the box),
src/sim/constants.ts:321:export const GK_RUSH_ENVELOPE = 5;
src/sim/constants.ts:324:export const AI_INTERVAL = 0.15;
src/sim/constants.ts:326:export const TEAM_AI_INTERVAL = 0.4;
src/sim/constants.ts:328:export const SHOT_SPEED = 27;
src/sim/constants.ts:330:export const PLAYER_MIN_DIST = 1.05 * BODY_SCALE;
src/sim/constants.ts:331:/** Radius of the stable kinematic core disc represented by PLAYER_MIN_DIST. */
src/sim/constants.ts:332:export const PLAYER_CORE_RADIUS = PLAYER_MIN_DIST / 2;
src/sim/constants.ts:334:export const BALL_RADIUS = 0.11;
src/render3d/FxSystem.ts:2:import { GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
src/render3d/FxSystem.ts:409:    const x = endSign * (HALF_L - 0.8);
src/render3d/FxSystem.ts:410:    const inner = GOAL_WIDTH / 2 + 2.2;
src/render3d/FxSystem.ts:411:    const outer = HALF_W - 1.5;
src/render3d/FxSystem.ts:418:    const z = -HALF_W - 12;
src/render3d/FxSystem.ts:421:      const x = (i - 1) * (HALF_L * 0.55);
src/sim/types.ts:16:  | { kind: 'contested'; near: [number, number] } // bodies within CONTEST_RADIUS, per side
src/render3d/ballPresentation.ts:1:import { BALL_RADIUS } from '../sim/constants';
src/render3d/ballPresentation.ts:16:export const BALL_VISUAL_RADIUS = BALL_RADIUS * BALL_VISUAL_SCALE;
src/ai/perception.ts:5:import { BALL_FRICTION_K, GRAVITY, HALF_L, HALF_W, UNSET_BLOCK_WEIGHT } from '../sim/constants';
src/ai/perception.ts:64:    const cx = localX > HALF_L - 8 ? 0 : attackDir;
src/ai/perception.ts:65:    const cy = Math.abs(p.pos.y) > HALF_W - 6 ? 0 : Math.sign(p.pos.y || 1);
src/ai/perception.ts:76:    const wide = Math.abs(p.pos.y) > 8 && Math.abs(p.pos.y) < HALF_W - 5;
src/ai/perception.ts:166: * and facing the shooter, floored at UNSET_BLOCK_WEIGHT for a sprinting or
src/ai/perception.ts:177:  return UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * facing * stillness;
src/render3d/SceneFactory.ts:2:import { HALF_L, HALF_W } from '../sim/constants';
src/render3d/SceneFactory.ts:43:    new THREE.BoxGeometry(HALF_L * 2 + 14, 2.5, HALF_W * 2 + 14),
src/render3d/CameraController.ts:3:import { HALF_L } from '../sim/constants';
src/render3d/CameraController.ts:56:        px: clamp(ball.x, -HALF_L + 4, HALF_L - 4),
src/render3d/CameraController.ts:71:      const goalX = sign * HALF_L;
src/render3d/CameraController.ts:73:        px: sign * (HALF_L + 12),
src/render3d/CameraController.ts:91:        lx: sign * HALF_L,
src/ai/formations.ts:3:import { BOX_DEPTH, CORNER_CLEARANCE, FIELD_SCALE, GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
src/ai/formations.ts:85:// metres for the 90×58 pitch, so on a shrunk pitch (FIELD_SCALE<1) they fall
src/ai/formations.ts:89:if (FIELD_SCALE !== 1) {
src/ai/formations.ts:92:      table[key] = table[key].map((p) => v2(p.x * FIELD_SCALE, p.y * FIELD_SCALE));
src/ai/formations.ts:100:// shrunk pitch (FIELD_SCALE<1): emergent stations are fractional and auto-fit,
src/ai/formations.ts:208:    hasBall && p.role === 'WG' && ballLocalX > HALF_L - 20 &&
src/ai/formations.ts:216:    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
src/ai/formations.ts:217:    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
src/ai/formations.ts:221:  x = clamp(x, -HALF_L + 3, HALF_L - 7);
src/ai/formations.ts:222:  y = clamp(y, -HALF_W + 2, HALF_W - 2);
src/ai/formations.ts:240:  // Role → coarse (depth fraction of HALF_L, lane fraction of HALF_W). WGs take
src/ai/formations.ts:257:  let x = depthFrac * HALF_L + slide + depth + pressUp + MODE_SHIFT[team.mode];
src/ai/formations.ts:268:  let y = laneFrac * HALF_W * widthMul;
src/ai/formations.ts:329:    if (team.localX(ball.pos.x) > -20 && x < -HALF_L + BOX_DEPTH) x = -HALF_L + BOX_DEPTH + 2;
src/ai/formations.ts:335:      x += (-HALF_L + 11 - x) * kk * 0.45;
src/ai/formations.ts:341:    x = clamp(-HALF_L + 4 + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
src/ai/formations.ts:342:    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
src/ai/formations.ts:345:  x = clamp(x, -HALF_L + 3, HALF_L - 7);
src/ai/formations.ts:346:  y = clamp(y, -HALF_W + 2, HALF_W - 2);
src/ai/formations.ts:363:  const cx = from.x + ux * (CORNER_CLEARANCE + 0.15);
src/ai/formations.ts:364:  const cy = from.y + uy * (CORNER_CLEARANCE + 0.15);
src/ai/formations.ts:367:    // 1.1m spacing: anything under PLAYER_MIN_DIST (1.05) gets shoved
src/ai/formations.ts:384:  const gx = attackDir * HALF_L;
src/ai/formations.ts:392:      return v2(gx - attackDir * 9, s * (HALF_W - 6));
src/ai/formations.ts:401:  const gx = attackDir * HALF_L;
src/ai/formations.ts:449:  let line = -HALF_L;
src/ai/formations.ts:467:  let last = -HALF_L;
src/ai/formations.ts:468:  let secondLast = -HALF_L;
src/ai/formations.ts:493:  const targetLocalX = clamp(Math.max(line + 7, myX + 5), myX + 3, HALF_L - 9);
src/ai/formations.ts:502:    : clamp(p.pos.y * 0.6, -HALF_W + 4, HALF_W - 4);
src/ai/formations.ts:558:    clamp(ball.pos.x + team.attackDir * radius * aheadBias, -HALF_L + 2, HALF_L - 2),
src/ai/formations.ts:559:    clamp(ball.pos.y + latPull, -HALF_W + 2, HALF_W - 2),
src/ai/intentResponse.ts:6:import { PLAYER_MIN_DIST } from '../sim/constants';
src/ai/intentResponse.ts:144:) < PLAYER_MIN_DIST - 1e-9);
src/sim/Match.ts:19:  AI_INTERVAL, BALL_AIR_SPIN_DECAY, BALL_BOUNCE, BALL_BOUNCE_SPIN_RETENTION, BALL_FRICTION_K,
src/sim/Match.ts:20:  BALL_GROUND_SPIN_DECAY, BOUNCE_DAMP, BOUNCE_MIN_VZ, BOX_DEPTH, BOX_WIDTH,
src/sim/Match.ts:21:  CONTACT_BLIND_PEN, CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS, CORNER_CLEARANCE,
src/sim/Match.ts:25:  DEFLECT_MAX_SPEED, DT,
src/sim/Match.ts:26:  GK_CONTROL_MAX_SPEED, GK_HOLD_CLEARANCE, GOAL_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L, HALF_W,
src/sim/Match.ts:27:  KICK_COOLDOWN, MATCH_DURATION, OUT_PLAY_COAST,
src/sim/Match.ts:28:  PENALTY_CLEARANCE, PENALTY_SPOT_DIST, PLAYER_MIN_DIST, RESTART_CLEARANCE, RESTART_MIN_SETUP,
src/sim/Match.ts:29:  CONTEST_RADIUS, RESTART_TIMEOUT, STOPPAGE_MAX, TEAM_AI_INTERVAL, TOUCH_CONTROL_DIST,
src/sim/Match.ts:433:   * ~OUT_PLAY_COAST s of open play, and setupKickoff clears any stragglers. */
src/sim/Match.ts:559:    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
src/sim/Match.ts:681:        team.brainTimer = TEAM_AI_INTERVAL;
src/sim/Match.ts:703:        p.decisionTimer = AI_INTERVAL;
src/sim/Match.ts:733:      const kickClear = this.restartKickKind === 'corner' || this.restartKickKind === 'freeKick' ? CORNER_CLEARANCE : RESTART_CLEARANCE;
src/sim/Match.ts:741:          o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
src/sim/Match.ts:742:          o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
src/sim/Match.ts:809:    const r2 = CONTEST_RADIUS * CONTEST_RADIUS;
src/sim/Match.ts:829:   * STOPPAGE_MAX seconds past the nominal end.
src/sim/Match.ts:842:    if (this.simTime >= nominal + STOPPAGE_MAX) {
src/sim/Match.ts:935:      this.bandInside = ox >= HALF_L - 15 || o.role === 'GK';
src/sim/Match.ts:940:    if (!this.bandInside && ox >= HALF_L - 15) {
src/sim/Match.ts:1062:    p.kickCooldown = KICK_COOLDOWN;
src/sim/Match.ts:1144:      team.localX(p.pos.x) > HALF_L - 24 &&
src/sim/Match.ts:1246:        if (nearOpp > TOUCH_CONTROL_DIST) {
src/sim/Match.ts:1284:          if (d < GK_HOLD_CLEARANCE) {
src/sim/Match.ts:1286:            o.pos = add(gk.pos, scale(dir, GK_HOLD_CLEARANCE));
src/sim/Match.ts:1287:            o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
src/sim/Match.ts:1288:            o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
src/sim/Match.ts:1298:            o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);
src/sim/Match.ts:1365:    if (ball.z > CONTROL_MAX_HEIGHT) {
src/sim/Match.ts:1387:    if (Math.abs(ball.pos.x) <= HALF_L) return false;
src/sim/Match.ts:1393:    const frac = Math.min(1, (Math.abs(ball.pos.x) - HALF_L) / Math.max(stepX, 1e-6));
src/sim/Match.ts:1397:    const post = Math.abs(yAt) >= GOAL_WIDTH / 2 && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND && zAt < GOAL_HEIGHT;
src/sim/Match.ts:1398:    const bar = zAt >= GOAL_HEIGHT && zAt < GOAL_HEIGHT + BAND && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND;
src/sim/Match.ts:1404:    ball.pos.x = sign * (HALF_L - (Math.abs(ball.pos.x) - HALF_L) * 0.4 - 0.01);
src/sim/Match.ts:1419:    if (ball.z >= GOAL_HEIGHT) return false; // over the bar (Phase 28)
src/sim/Match.ts:1420:    if (Math.abs(ball.pos.x) <= HALF_L || Math.abs(ball.pos.y) >= GOAL_WIDTH / 2) return false;
src/sim/Match.ts:1493:    if (Math.abs(ball.pos.y) > HALF_W) {
src/sim/Match.ts:1496:        Math.max(-HALF_L + 1, Math.min(HALF_L - 1, ball.pos.x)),
src/sim/Match.ts:1497:        sy * (HALF_W - 0.4),
src/sim/Match.ts:1502:    if (Math.abs(ball.pos.x) > HALF_L) {
src/sim/Match.ts:1509:      const until = this.simTime + OUT_PLAY_COAST;
src/sim/Match.ts:1512:        this.pendingOut = { kind: 'corner', side: (1 - defSide) as Side, spot: v2(sx * (HALF_L - 0.6), sy * (HALF_W - 0.6)), until };
src/sim/Match.ts:1514:        this.pendingOut = { kind: 'goalKick', side: defSide, spot: v2(sx * (HALF_L - 7), 0), until };
src/sim/Match.ts:1523:    if (Math.abs(pos.y) > BOX_WIDTH / 2) return false;
src/sim/Match.ts:1524:    const goalLineX = -this.teams[defSide].attackDir * HALF_L;
src/sim/Match.ts:1525:    return goalLineX > 0 ? pos.x >= goalLineX - BOX_DEPTH : pos.x <= goalLineX + BOX_DEPTH;
src/sim/Match.ts:1544:      const goalLineX = -this.teams[offender.side].attackDir * HALF_L;
src/sim/Match.ts:1545:      const spot = v2(goalLineX - Math.sign(goalLineX) * PENALTY_SPOT_DIST, 0);
src/sim/Match.ts:1626:    p.pos = v2(-team.attackDir * 12, (p.side === 0 ? -1 : 1) * (HALF_W + 4));
src/sim/Match.ts:1690:      out.becomeSub(sub, v2(out.side === 0 ? -1.2 : 1.2, HALF_W - 0.6));
src/sim/Match.ts:1731:      Math.max(-HALF_L + 2, Math.min(HALF_L - 2, this.ball.pos.x)),
src/sim/Match.ts:1732:      Math.max(-HALF_W + 1, Math.min(HALF_W - 1, this.ball.pos.y)),
src/sim/Match.ts:1761:    const goalLineX = -this.teams[defSide].attackDir * HALF_L;
src/sim/Match.ts:1774:        Math.max(-HALF_L + 0.2, Math.min(HALF_L - 0.2, pos.x)),
src/sim/Match.ts:1775:        Math.max(-HALF_W + 0.2, Math.min(HALF_W - 0.2, pos.y)),
src/sim/Match.ts:1828:      const goal = v2(this.teams[side].attackDir * HALF_L, 0);
src/sim/Match.ts:1876:    out.becomeSub(sub, v2(side === 0 ? -1.2 : 1.2, HALF_W - 0.6));
src/sim/Match.ts:1912:      const goal = v2(this.teams[side].attackDir * HALF_L, 0);
src/sim/Match.ts:1962:      r.kind === 'penalty' ? PENALTY_CLEARANCE
src/sim/Match.ts:1966:      : r.kind === 'corner' || r.kind === 'freeKick' ? CORNER_CLEARANCE
src/sim/Match.ts:1967:      : RESTART_CLEARANCE;
src/sim/Match.ts:1995:        o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
src/sim/Match.ts:1996:        o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
src/sim/Match.ts:2007:        o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);
src/sim/Match.ts:2029:      : RESTART_MIN_SETUP;
src/sim/Match.ts:2035:      const goal = v2(this.teams[r.side].attackDir * HALF_L, 0);
src/sim/Match.ts:2036:      const wallCenter = add(r.pos, scale(norm(sub(goal, r.pos)), CORNER_CLEARANCE));
src/sim/Match.ts:2063:    // Timeout-capped (pure sim-state, invariant 3); RESTART_TIMEOUT is the
src/sim/Match.ts:2080:      const goal = v2(this.teams[r.side].attackDir * HALF_L, 0);
src/sim/Match.ts:2105:      if (team.localX(team.goalkeeper.pos.x) < HALF_L - 24) ready = false;
src/sim/Match.ts:2107:    if (ready || r.timer >= (keeperUpWait ? 8.5 : RESTART_TIMEOUT)) {
src/sim/Match.ts:2271:      if (dx >= CONTROL_RADIUS || dx <= -CONTROL_RADIUS) continue;
src/sim/Match.ts:2273:      if (dy >= CONTROL_RADIUS || dy <= -CONTROL_RADIUS) continue;
src/sim/Match.ts:2275:      if (d >= CONTROL_RADIUS) continue;
src/sim/Match.ts:2276:      const access = directBallAccess(p, ball, this.allPlayers, CONTROL_RADIUS);
src/sim/Match.ts:2283:      const maxSpeed = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED;
src/sim/Match.ts:2351:    const access = directBallAccess(p, this.ball, this.allPlayers, CONTROL_RADIUS);
src/sim/Match.ts:2372:    const deflectable = speed > CONTROL_MAX_SPEED && speed <= DEFLECT_MAX_SPEED && !shotInFlight;
src/sim/Match.ts:2405:          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),
src/sim/Match.ts:2428:        // round-to-nearest, so |dx| or |dy| ≥ PLAYER_MIN_DIST guarantees the
src/sim/Match.ts:2431:        if (dx >= PLAYER_MIN_DIST || dx <= -PLAYER_MIN_DIST) continue;
src/sim/Match.ts:2433:        if (dy >= PLAYER_MIN_DIST || dy <= -PLAYER_MIN_DIST) continue;
src/sim/Match.ts:2435:        if (d >= PLAYER_MIN_DIST) continue;
src/sim/Match.ts:2442:        const k = (PLAYER_MIN_DIST - d) / 2;
src/sim/Match.ts:2497:      p.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, p.pos.x));
src/sim/Match.ts:2498:      p.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, p.pos.y));
src/render3d/ThreeMatchRenderer.ts:29:import { BOX_DEPTH, BOX_WIDTH, HALF_L, HALF_W } from '../sim/constants';
src/render3d/ThreeMatchRenderer.ts:263:    // clear of the walk-off fan (|x| ≤ 6.5 at z = HALF_W + 1.2). Only a
src/render3d/ThreeMatchRenderer.ts:273:        side as 0 | 1, t.coach, t.primary, side === 0 ? -8 : 8, HALF_W + 1.7, t.tinker,
src/render3d/ThreeMatchRenderer.ts:439:    return { x: (slot - (TEAM_SIZE - 1) / 2) * 2.6, z: HALF_W + 1.2 };
src/render3d/ThreeMatchRenderer.ts:531:    const X = (x: number): number => ((x + HALF_L) / (HALF_L * 2)) * (W - 10) + 5;
src/render3d/ThreeMatchRenderer.ts:532:    const Z = (z: number): number => ((z + HALF_W) / (HALF_W * 2)) * (H - 10) + 5;
src/render3d/ThreeMatchRenderer.ts:538:    ctx.strokeRect(X(-HALF_L), Z(-HALF_W), X(HALF_L) - X(-HALF_L), Z(HALF_W) - Z(-HALF_W));
src/render3d/ThreeMatchRenderer.ts:540:    ctx.moveTo(X(0), Z(-HALF_W));
src/render3d/ThreeMatchRenderer.ts:541:    ctx.lineTo(X(0), Z(HALF_W));
src/render3d/ThreeMatchRenderer.ts:544:      const gx = sx * HALF_L;
src/render3d/ThreeMatchRenderer.ts:545:      const bx = sx * (HALF_L - BOX_DEPTH);
src/render3d/ThreeMatchRenderer.ts:547:        Math.min(X(gx), X(bx)), Z(-BOX_WIDTH / 2),
src/render3d/ThreeMatchRenderer.ts:548:        Math.abs(X(bx) - X(gx)), Z(BOX_WIDTH / 2) - Z(-BOX_WIDTH / 2),
src/ai/relativeAffordance.ts:1:import { BOX_DEPTH, BOX_WIDTH, HALF_L, HALF_W } from '../sim/constants';
src/ai/relativeAffordance.ts:86:    opponentXs[1] ?? -HALF_L,
src/ai/relativeAffordance.ts:180:    HALF_L - Math.abs(targetPoint.x),
src/ai/relativeAffordance.ts:181:    HALF_W - Math.abs(targetPoint.y),
src/ai/relativeAffordance.ts:186:    && targetLocalX > HALF_L - (BOX_DEPTH + 0.8)
src/ai/relativeAffordance.ts:187:    && Math.abs(targetPoint.y) < BOX_WIDTH / 2 + 0.5;
src/render3d/AnimationSystem.ts:1:import { BOX_DEPTH, HALF_L, HALF_W } from '../sim/constants';
src/render3d/AnimationSystem.ts:174: * pair on the pitch tracks at exactly PLAYER_MIN_DIST (the overlap
src/render3d/AnimationSystem.ts:233:  if (Math.abs(b.x) < HALF_L - 4 || Math.abs(b.z) < HALF_W - 6) return false;
src/render3d/AnimationSystem.ts:235:  if (Math.sign(p.x) !== Math.sign(b.x) || Math.abs(p.x) < HALF_L - BOX_DEPTH - 2) return false;
src/render3d/PlayerModel.ts:27: * overlap solver keeps player CENTRES `PLAYER_MIN_DIST` (1.05 m) apart, but
src/render3d/PlayerModel.ts:65:const SLEEVE_HALF_W = 0.15;
src/render3d/PlayerModel.ts:67:const FOREARM_HALF_W = 0.13;
src/render3d/PlayerModel.ts:93: * honest quantity to hold against `PLAYER_MIN_DIST`. Pure: no THREE objects,
src/render3d/PlayerModel.ts:99:  const halfLimb = Math.max(SLEEVE_HALF_W, FOREARM_HALF_W * (isGK ? GK_FOREARM_SCALE : 1));
src/render3d/PlayerModel.ts:150:    sleeve: translate(new THREE.BoxGeometry(SLEEVE_HALF_W * 2, 0.36, SLEEVE_HALF_W * 2), -0.18),
src/render3d/PlayerModel.ts:151:    forearm: translate(new THREE.BoxGeometry(FOREARM_HALF_W * 2, 0.44, FOREARM_HALF_W * 2), -0.22),
src/render3d/BroadcastLayer.ts:2:import { HALF_W } from '../sim/constants';
src/render3d/BroadcastLayer.ts:124:      attr.setXYZ(0, lineX[side], Y, -HALF_W + 1);
src/render3d/BroadcastLayer.ts:125:      attr.setXYZ(1, lineX[side], Y, HALF_W - 1);
src/render3d/ShootoutTheater.ts:1:import { HALF_L, PENALTY_SPOT_DIST } from '../sim/constants';
src/render3d/ShootoutTheater.ts:78:        this.waitSpot.set(p.gid, { x: this.sign * (HALF_L - 1.2), y: p.side === 0 ? 5.5 : -5.5 });
src/render3d/ShootoutTheater.ts:82:          x: this.sign * (HALF_L - 19.5 - rank * 1.1),
src/render3d/ShootoutTheater.ts:154:    const spot = { x: this.sign * (HALF_L - PENALTY_SPOT_DIST), y: 0 };
src/render3d/ShootoutTheater.ts:155:    const goalX = this.sign * HALF_L;
src/ai/offBallAffordance.ts:6:import { HALF_L, HALF_W } from '../sim/constants';
src/ai/offBallAffordance.ts:78:  Math.abs(point.x) <= HALF_L - PITCH_INSET && Math.abs(point.y) <= HALF_W - PITCH_INSET;
src/ai/offBallAffordance.ts:81:  Math.abs(point.x) <= HALF_L && Math.abs(point.y) <= HALF_W;
src/ai/offBallAffordance.ts:178:    offsideLine: Math.max(opponentXs[1] ?? -HALF_L, localX(carrier.pos.x, attackDir), 0),
src/ai/offBallAffordance.ts:221:    fieldMargin: Math.min(HALF_L - Math.abs(candidate.point.x), HALF_W - Math.abs(candidate.point.y)),
src/render3d/GoalModel.ts:2:import { GOAL_DEPTH, GOAL_HEIGHT, GOAL_WIDTH, HALF_L } from '../sim/constants';
src/render3d/GoalModel.ts:5:const CROSSBAR_H = GOAL_HEIGHT;
src/render3d/GoalModel.ts:53:    const halfW = GOAL_WIDTH / 2;
src/render3d/GoalModel.ts:124:  const halfW = GOAL_WIDTH / 2;
src/render3d/GoalModel.ts:125:  const lineX = dir * HALF_L;
src/render3d/GoalModel.ts:126:  const backX = dir * (HALF_L + GOAL_DEPTH);
src/render3d/GoalModel.ts:135:    const len = Math.hypot(GOAL_DEPTH, CROSSBAR_H);
src/render3d/GoalModel.ts:138:    stanchion.rotation.z = -dir * Math.atan2(GOAL_DEPTH, CROSSBAR_H);
src/render3d/GoalModel.ts:142:  const bar = new THREE.Mesh(new THREE.CylinderGeometry(POST_R, POST_R, GOAL_WIDTH + POST_R * 2, 10), frameMat);
src/render3d/GoalModel.ts:180:  const back = addNet(GOAL_WIDTH, CROSSBAR_H, 0.9, (m) => {
src/render3d/GoalModel.ts:189:  addNet(GOAL_DEPTH, GOAL_WIDTH, 0.42, (m) => {
src/render3d/GoalModel.ts:195:    addNet(GOAL_DEPTH, CROSSBAR_H, 0.68, (m) => {
src/ai/PlayerBrain.ts:3:import { HALF_L, HALF_W } from '../sim/constants';
src/ai/PlayerBrain.ts:450:        x: clamp(burst.x, -HALF_L + 2, HALF_L - 2),
src/ai/PlayerBrain.ts:451:        y: clamp(burst.y, -HALF_W + 2, HALF_W - 2),
src/ai/PlayerBrain.ts:564:    Math.abs(p.pos.y) > 10 && localX > HALF_L - 17
src/ai/PlayerBrain.ts:571:      const inArc = arrLocalX > HALF_L - 26 && Math.abs(arr.pos.y) < 12;
src/ai/PlayerBrain.ts:598:    team.mentality.holding > 0.5 && localX > HALF_L - 18 && Math.abs(p.pos.y) > 10;
src/ai/PlayerBrain.ts:628:    const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
src/ai/PlayerBrain.ts:630:      ? norm(sub(v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12)), p.pos))
src/render3d/RefereeModel.ts:2:import { HALF_L, HALF_W } from '../sim/constants';
src/render3d/RefereeModel.ts:19:  const d = ballX / HALF_L; // -1 .. 1, which end play is at
src/render3d/RefereeModel.ts:20:  let x = Math.max(-HALF_L + 6, Math.min(HALF_L - 6, ballX * 0.8));
src/render3d/RefereeModel.ts:21:  let z = Math.max(-HALF_W + 5, Math.min(HALF_W - 5, d * 9 + ballZ * 0.25));
src/sim/mechanics.ts:8:  BALL_FRICTION_K, BOX_DEPTH, CHEST_TRAP_MAX_HEIGHT, CHEST_TRAP_MAX_VZ, CHEST_TRAP_RADIUS,
src/sim/mechanics.ts:9:  CORNER_CLEARANCE, CROSS_LEAD_FRAC, CROSS_LEAD_MAX, GK_CLAIM_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L,
src/sim/mechanics.ts:10:  HALF_W, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS, SHOT_SPEED,
src/sim/mechanics.ts:11:  GK_RUSH_ENVELOPE,
src/sim/mechanics.ts:12:  DEFLECT_BLIND_PEN, TACKLE_LUNGE_COST, UNSET_BLOCK_WEIGHT,
src/sim/mechanics.ts:271:  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
src/sim/mechanics.ts:563:  let leadX = target.vel.x * flight0 * CROSS_LEAD_FRAC;
src/sim/mechanics.ts:564:  let leadY = target.vel.y * flight0 * CROSS_LEAD_FRAC;
src/sim/mechanics.ts:566:  if (leadLen > CROSS_LEAD_MAX) {
src/sim/mechanics.ts:567:    leadX *= CROSS_LEAD_MAX / leadLen;
src/sim/mechanics.ts:568:    leadY *= CROSS_LEAD_MAX / leadLen;
src/sim/mechanics.ts:743:  if (ball.z < HEADER_MIN_HEIGHT || ball.z > GK_CLAIM_HEIGHT) return;
src/sim/mechanics.ts:778:  if (ball.z > HEADER_MAX_HEIGHT) return;
src/sim/mechanics.ts:790:    if (d2 > HEADER_RADIUS * HEADER_RADIUS) continue;
src/sim/mechanics.ts:802:  const attacking = match.teams[p.side].localX(ball.pos.x) > HALF_L - BOX_DEPTH ? 0.3 : 0;
src/sim/mechanics.ts:806:      (1 - Math.sqrt(d2) / HEADER_RADIUS) * 0.35 +
src/sim/mechanics.ts:828:    if (dist(o.pos, ball.pos) < HEADER_RADIUS) { oppNear = true; break; }
src/sim/mechanics.ts:915:  if (ball.z > CHEST_TRAP_MAX_HEIGHT || ball.vz > CHEST_TRAP_MAX_VZ) return false;
src/sim/mechanics.ts:918:  let bestD = CHEST_TRAP_RADIUS;
src/sim/mechanics.ts:931:    if (dist(o.pos, ball.pos) < HEADER_RADIUS) return false;
src/sim/mechanics.ts:974:  const goalX = team.attackDir * HALF_L;
src/sim/mechanics.ts:976:  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
src/sim/mechanics.ts:980:  const central = 1 - clamp01(Math.abs(ball.pos.y) / HALF_W) * 0.5;
src/sim/mechanics.ts:1033: * keeper (tryKeeperSave cannot touch a ball above GK_CLAIM_HEIGHT),
src/sim/mechanics.ts:1047:  const goalX = team.attackDir * HALF_L;
src/sim/mechanics.ts:1072:  const clearK = GK_CLAIM_HEIGHT + 0.25;
src/sim/mechanics.ts:1136:  const goalX = team.attackDir * HALF_L;
src/sim/mechanics.ts:1157:  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
src/sim/mechanics.ts:1213:    ? v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin * (1 - 0.28 * composure)))
src/sim/mechanics.ts:1237:  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
src/sim/mechanics.ts:1311:  const goalX = team.attackDir * HALF_L;
src/sim/mechanics.ts:1314:  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
src/sim/mechanics.ts:1328:  let wallD = CORNER_CLEARANCE - 0.9;
src/sim/mechanics.ts:1330:    const own = v2(team.attackDir * HALF_L, 0);
src/sim/mechanics.ts:1331:    const center = add(match.fkWall.pos, scale(norm(sub(own, match.fkWall.pos)), CORNER_CLEARANCE + 0.15));
src/sim/mechanics.ts:1419:    const eff = o.role === 'GK' ? along - GK_RUSH_ENVELOPE : along;
src/sim/mechanics.ts:1435:    Math.abs(p.pos.y + hy * (rollEst + 2)) > HALF_W - 1 ||
src/sim/mechanics.ts:1436:    Math.abs(p.pos.x + hx * (rollEst + 2)) > HALF_L - 1
src/sim/mechanics.ts:1506:    (0.24 + p.attrs.defending * 0.4 - (speed - 14) * 0.02) * (1 - blind * DEFLECT_BLIND_PEN),
src/sim/mechanics.ts:1624:  slider.spendBurst(TACKLE_LUNGE_COST);
src/sim/mechanics.ts:1693:  grabber.spendBurst(TACKLE_LUNGE_COST); // the grab is a burst too (Phase 58)
src/sim/mechanics.ts:1757:  tackler.spendBurst(TACKLE_LUNGE_COST); // win or whiff, the lunge costs legs (Phase 58)
src/sim/mechanics.ts:1899:    const readiness = UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * (1 - blind) * stillness;
src/sim/mechanics.ts:1927:  if (ball.z > GK_CLAIM_HEIGHT) return; // sailing over the keeper's hands
src/ai/TeamBrain.ts:2:import { BOX_DEPTH, BOX_WIDTH, HALF_L } from '../sim/constants';
src/ai/TeamBrain.ts:14: * don't all chase the ball. Runs every TEAM_AI_INTERVAL and immediately
src/ai/TeamBrain.ts:211:  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {
src/ai/TeamBrain.ts:403:      Math.abs(land.y) < BOX_WIDTH / 2 && team.localX(land.x) < -(HALF_L - BOX_DEPTH);
src/ai/TeamBrain.ts:455:    team.localX(x) < -HALF_L + BOX_DEPTH && Math.abs(y) < BOX_WIDTH / 2;
src/ai/passAffordance.ts:6:import { CONTROL_RADIUS, DT, HALF_L } from '../sim/constants';
src/ai/passAffordance.ts:91:    reachRadius: CONTROL_RADIUS,
src/ai/passAffordance.ts:100:        reachRadius: CONTROL_RADIUS,
src/ai/passAffordance.ts:144:  const offsideLine = Math.max(opponentXs[1] ?? -HALF_L, fromLocal, 0);
src/ai/carryAffordance.ts:1:import { HALF_L, HALF_W } from '../sim/constants';
src/ai/carryAffordance.ts:63:  Math.abs(point.x) <= HALF_L - PITCH_INSET
src/ai/carryAffordance.ts:64:  && Math.abs(point.y) <= HALF_W - PITCH_INSET;
src/ai/carryAffordance.ts:67:  Math.abs(point.x) <= HALF_L && Math.abs(point.y) <= HALF_W;
src/ai/carryAffordance.ts:192:  const opponentGoal = { x: attackDir * HALF_L, y: 0 };
src/ai/carryAffordance.ts:225:      HALF_L - Math.abs(candidate.point.x),
src/ai/carryAffordance.ts:226:      HALF_W - Math.abs(candidate.point.y),
src/ai/passCorridorInterception.ts:8:import { BALL_FRICTION_K, CONTROL_RADIUS, DT } from '../sim/constants';
src/ai/passCorridorInterception.ts:117:      reachRadius: CONTROL_RADIUS,
src/ai/actionExecutor.ts:3:import { BOX_DEPTH, BOX_WIDTH, CONTROL_MAX_HEIGHT, CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
src/ai/actionExecutor.ts:158:        ball.z > CONTROL_MAX_HEIGHT
src/ai/actionExecutor.ts:251:        // every delivery first (HEADER_RADIUS is 1.35m — a crash that
src/ai/actionExecutor.ts:291:        target = v2(team.attackDir * (HALF_L - 9), clamp(p.pos.y * 0.2, -4, 4));
src/ai/actionExecutor.ts:313:        let fx = spot.x - team.attackDir * HALF_L;
src/ai/actionExecutor.ts:320:        // HEADER_RADIUS (1.35m). The closest licensed crasher re-routes to
src/ai/actionExecutor.ts:355:            : v2((HALF_L - 16) * team.attackDir, clamp(p.pos.y * 0.3, -7, 7));
src/ai/actionExecutor.ts:361:          clamp(c.pos.x + team.attackDir * 13, -HALF_L + 2, HALF_L - 2),
src/ai/actionExecutor.ts:362:          Math.sign(c.pos.y || 1) * (HALF_W - 2.5),
src/ai/actionExecutor.ts:461:          y: clamp(target.y + Math.sign(match.fkWall.pos.y || 1) * 1.0, -GOAL_WIDTH / 2 + 0.5, GOAL_WIDTH / 2 - 0.5),
src/ai/actionExecutor.ts:518:  const oppGoalX = opp.attackDir < 0 ? HALF_L : -HALF_L; // opp defends this line
src/ai/actionExecutor.ts:519:  const edgeX = oppGoalX - Math.sign(oppGoalX) * (BOX_DEPTH + 0.8);
src/ai/actionExecutor.ts:520:  if (target && barred && p.role !== 'GK' && Math.abs(target.y) < BOX_WIDTH / 2 + 0.5) {
src/ai/actionExecutor.ts:553:  if (barred && p.role !== 'GK' && Math.abs(p.pos.y) < BOX_WIDTH / 2 + 0.5) {
src/ai/actionExecutor.ts:597:    const minLocal = -(HALF_L - BOX_DEPTH) + 1;
src/ai/actionExecutor.ts:599:    t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
src/ai/actionExecutor.ts:602:  const wideDrive = Math.abs(p.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
src/ai/actionExecutor.ts:604:    ? v2((HALF_L - 8) * team.attackDir, Math.sign(p.pos.y) * (HALF_W - 12))
src/ai/actionExecutor.ts:659:  t.x = clamp(t.x, -HALF_L + 1.5, HALF_L - 1.5);
src/ai/actionExecutor.ts:660:  t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
src/ai/actionExecutor.ts:666:  const gx = -attackDir * HALF_L; // own goal line x
src/ai/actionExecutor.ts:669:  return v2(clamp(pt.x, minX, maxX), clamp(pt.y, -GOAL_WIDTH / 2 - 4, GOAL_WIDTH / 2 + 4));

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node -e \"try{console.log(require.resolve('typescript'))}catch(e){console.error('no typescript')}\"; sed -n '1,180p' package.json; nl -ba src/sim/Player.ts | sed -n '240,430p'; rg -n \"const [A-Za-z_][A-Za-z0-9_]*\\s*=|\\bclamp\\(|rng\\.(chance|range)\\(|(?:Cooldown|Timer|timer|Window|window|Time|time|Radius|radius|Speed|speed|Height|height|reach|Reach|dist|Dist|chance|Chance|noise|Noise|stun|Stun|hold|Hold)[A-Za-z0-9_]*\\s*=|\\.z\\s*=|\\.vz\\s*=|\\.vel\\s*=\" src/sim/mechanics.ts"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 152ms:[0m
/Users/jamie/Documents/Promptfoo/evofootball-arena/node_modules/typescript/lib/typescript.js
{
  "name": "evofootball-arena",
  "private": true,
  "version": "0.25.1",
  "description": "An autonomous 5v5 football ecosystem — deterministic simulation, explainable utility AI, evolving leagues, cups and giant killings. You mostly watch.",
  "repository": {
    "type": "git",
    "url": "https://github.com/Quarkgluonmixture/evofootball-arena.git"
  },
  "license": "MIT",
  "engines": {
    "node": ">=18"
  },
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "calibrate": "tsx scripts/calibrate.ts",
    "perf": "tsx scripts/perf-baseline.ts",
    "fingerprint": "tsx scripts/fingerprint.ts",
    "evolve-check": "tsx scripts/evolve-check.ts",
    "debug:visual": "node scripts/visual-debug.mjs",
    "debug:visual3d": "node scripts/visual-debug-3d.mjs",
    "package:itch": "npm run build && node scripts/package-itch.mjs"
  },
  "dependencies": {
    "pixi.js": "^8.6.6",
    "three": "^0.185.1"
  },
  "devDependencies": {
    "@types/node": "^26.1.0",
    "@types/three": "^0.185.0",
    "playwright": "^1.61.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.2.0",
    "vitest": "^3.0.5"
  }
}
   240	    this.markAnchorAge = 0;
   241	    this.markAnchorIdx = null;
   242	    this.wallRun = null;
   243	  }
   244	
   245	  /** Effective top speed — tired players slow down but never stop. */
   246	  get topSpeed(): number {
   247	    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
   248	  }
   249	
   250	  physicsStep(dt: number): void {
   251	    // In-place integration — this ran as clampLen/approachV/add/norm, which
   252	    // allocated ~6 vectors per player per step (860k per match). The exact
   253	    // same operations in the exact same IEEE order, written out flat:
   254	    // results are bit-identical (regression: same seed ⇒ same save JSON).
   255	    const dv = this.desiredVel;
   256	    const max = this.topSpeed;
   257	    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen
   258	    let tx = dv.x;
   259	    let ty = dv.y;
   260	    if (dl > max && dl > 1e-8) {
   261	      const s = max / dl;
   262	      tx = dv.x * s;
   263	      ty = dv.y * s;
   264	    }
   265	    // Stunned (Phase 27): stumbling players can barely move until they recover.
   266	    if (this.stunTimer > 0) {
   267	      tx *= 0.15;
   268	      ty *= 0.15;
   269	    }
   270	    const maxDelta = this.accel * dt; // approachV
   271	    const ax = tx - this.vel.x;
   272	    const ay = ty - this.vel.y;
   273	    const al = Math.sqrt(ax * ax + ay * ay);
   274	    if (al <= maxDelta || al < 1e-8) {
   275	      this.vel.x = tx;
   276	      this.vel.y = ty;
   277	    } else {
   278	      const s = maxDelta / al;
   279	      this.vel.x = this.vel.x + ax * s;
   280	      this.vel.y = this.vel.y + ay * s;
   281	    }
   282	    this.pos.x = this.pos.x + this.vel.x * dt;
   283	    this.pos.y = this.pos.y + this.vel.y * dt;
   284	
   285	    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
   286	    // Rotate heading toward the face target (backpedal, 27.5) or, failing
   287	    // that, the movement direction — capped at TURN_RATE either way.
   288	    // No trig in the loop: the per-step rotation's cos/sin are cached per dt.
   289	    if (dt !== turnDt) {
   290	      turnDt = dt;
   291	      turnCos = Math.cos(TURN_RATE * dt);
   292	      turnSin = Math.sin(TURN_RATE * dt);
   293	    }
   294	    const ft = this.faceTarget;
   295	    let wx = 0;
   296	    let wy = 0;
   297	    let turn = false;
   298	    if (ft) {
   299	      const fx = ft.x - this.pos.x;
   300	      const fy = ft.y - this.pos.y;
   301	      const fl = Math.sqrt(fx * fx + fy * fy);
   302	      if (fl > 1e-6) {
   303	        wx = fx / fl;
   304	        wy = fy / fl;
   305	        turn = true;
   306	      }
   307	    } else if (sp > 0.5) {
   308	      wx = this.vel.x / sp;
   309	      wy = this.vel.y / sp;
   310	      turn = true;
   311	    }
   312	    if (turn) {
   313	      const hx = this.heading.x;
   314	      const hy = this.heading.y;
   315	      if (hx * wx + hy * wy >= turnCos) {
   316	        this.heading = { x: wx, y: wy };
   317	      } else {
   318	        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
   319	        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
   320	      }
   321	    }
   322	    this.distance += sp * dt;
   323	
   324	    // Stamina: quadratic drain above ~55% effort, slow recovery when jogging/idle.
   325	    // The engine trait (Phase 39) drains 10% slower — the motor runs all day.
   326	    const effort = sp / this.baseSpeed;
   327	    // The stamina ATTRIBUTE scales drain and recovery (Phase 47): neutral
   328	    // at the 0.4 backfill so the league's energy economy doesn't move —
   329	    // the motor is now a dimension evolution can spend on.
   330	    // Phase 58: drain/recovery repriced so the economy BINDS in-match
   331	    // (constants.ts has the story) — legs are a resource, not a gauge.
   332	    if (effort > 0.55) {
   333	      const drain =
   334	        STAMINA_DRAIN * effort * effort * dt * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   335	      this.stamina = Math.max(0.05, this.stamina - drain);
   336	      this.staminaSpent += drain;
   337	    } else {
   338	      this.stamina = Math.min(1, this.stamina + STAMINA_RECOVERY * dt * (0.88 + this.attrs.stamina * 0.3));
   339	    }
   340	
   341	    this.kickCooldown = Math.max(0, this.kickCooldown - dt);
   342	    this.tackleCooldown = Math.max(0, this.tackleCooldown - dt);
   343	    this.touchTimer = Math.max(0, this.touchTimer - dt);
   344	    this.stunTimer = Math.max(0, this.stunTimer - dt);
   345	    this.gkHoldTimer = Math.max(0, this.gkHoldTimer - dt);
   346	    this.tackleAnimTimer = Math.max(0, this.tackleAnimTimer - dt);
   347	    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
   348	    this.headerAnimTimer = Math.max(0, this.headerAnimTimer - dt);
   349	    this.firstTouchWindow = Math.max(0, this.firstTouchWindow - dt);
   350	    this.decisionTimer -= dt;
   351	  }
   352	
   353	  /**
   354	   * An instantaneous burst the movement drain never saw — a tackle lunge
   355	   * (Phase 58). Same per-player modifiers as the running drain, so engines
   356	   * and high-stamina players absorb bursts better too.
   357	   */
   358	  spendBurst(cost: number): void {
   359	    const drain = cost * this.staminaDrainMul * (1.24 - this.attrs.stamina * 0.6);
   360	    this.stamina = Math.max(0.05, this.stamina - drain);
   361	    this.staminaSpent += drain;
   362	  }
   363	
   364	  resetForKickoff(pos: V2): void {
   365	    this.pos = pos;
   366	    this.vel = v2();
   367	    this.desiredVel = v2();
   368	    this.action = { type: 'MoveToFormationSpot', scores: [] };
   369	    this.kickCooldown = 0;
   370	    this.tackleCooldown = 0;
   371	    this.stunTimer = 0;
   372	    this.gkHoldTimer = 0;
   373	    this.gkDistributing = false;
   374	    this.gkShapeWait = 0;
   375	    this.tackleAnimTimer = 0;
   376	    this.saveAnimTimer = 0;
   377	    this.headerAnimTimer = 0;
   378	    this.firstTouchWindow = 0;
   379	    this.slalomUntil = -1;
   380	  }
   381	}
44:const SAVE_STRETCH = 1.35;
50:  const path = closestPointOnSegment(ballPos, add(ballPos, scale(dir, 40)), gk.pos);
51:  return clamp(1.15 - dist(path, gk.pos) / keeperReach(opp, gk), 0.25, 1);
62:  const sGoal = Math.max(dist(shooterPos, goal), 1);
63:  const kGoal = dist(gk.pos, goal);
64:  const lineOff = dist(closestPointOnSegment(shooterPos, goal, gk.pos), gk.pos);
104:export const TOUCH_SPEED_COST = {
119:  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
120:  const cost = heavyTouchCost ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;
121:  const raw = 0.01 + clamp01((speed - 6) / cost.span) * cost.weight
123:  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);
162:  const ball = match.ball;
165:  const speed = contact?.relativeSpeed ?? (len(ball.vel) + Math.abs(ball.vz) * 0.6);
167:  const hSpeed = Math.max(len(ball.vel), 1e-6);
168:  const inx = contact?.incomingDir.x ?? ball.vel.x / hSpeed;
169:  const iny = contact?.incomingDir.y ?? ball.vel.y / hSpeed;
171:  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
172:  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
181:  const clean = !match.rng.chance(pFail);
206:  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));
207:  ball.vz = 0; // the touch kills any remaining flight — the ball drops
208:  p.kickCooldown = 0.5; // off balance — can't instantly regather
219:  const team = match.teams[passer.side];
220:  const tx = team.localX(target.pos.x);
222:  const line = offsideLineLocalX(team, match.teams[1 - passer.side].players, team.localX(passer.pos.x));
233:  const offside = !exempt && offsideAtKick(match, passer, target);
236:  const lp = match.lastCompletedPass;
237:  const team = match.teams[passer.side];
238:  const bounce =
268:  const team = match.teams[p.side];
269:  const goal = team.oppGoal();
270:  const d = dist(p.pos, goal);
271:  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
272:  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
273:  return clamp(0.85 * Math.exp(-d / 10) * central * (1 - pressure * 0.3), 0.01, 0.8);
290:  const from = passer.pos;
291:  const chord = norm(sub(to, from));
296:    const ox = o.pos.x - from.x;
297:    const oy = o.pos.y - from.y;
298:    const along = ox * chord.x + oy * chord.y;
300:    const perp = Math.abs(ox * chord.y - oy * chord.x);
312:  const tightness = clamp(1.4 - pinchPerp, 0.3, 1);
317:  const mag = 0.45 * tightness;
318:  const cross = chord.x * (pinch.pos.y - from.y) - chord.y * (pinch.pos.x - from.x);
329:  const T = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / speed, 0.85)) / BALL_FRICTION_K;
330:  const totalRot = (spin * (1 - Math.exp(-1.5 * T))) / 1.5;
334:  const weightErr = match.rng.gaussian() * Math.abs(spin) * 0.2 * (1.35 - p.attrs.passing);
348:  const error = match.rng.gaussian()
350:  return clamp(intended + error, PASS_POWER_EXECUTED_MIN, PASS_POWER_EXECUTED_MAX);
357:  const team = match.teams[passer.side];
358:  const opp = match.teams[1 - passer.side];
362:  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
363:  const orientation = orientationPowerMul(misalign, passer.attrs.passing);
367:  const intended = clamp(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX);
368:  const powerMul = orientation * intended;
369:  const executedMul = orientation * executedPassPower(match, passer, intended);
372:  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
373:  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
374:  const d = dist(passer.pos, lead);
378:  const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;
382:  const pressure = pressureAt(passer.pos, opp.players);
383:  const aim = norm(sub(lead, passer.pos));
384:  const noise =
392:  const dir = rotate(aim, noise);
394:  const oneTouch = passer.firstTouchWindow > 0;
444:  const team = match.teams[passer.side];
445:  const opp = match.teams[1 - passer.side];
446:  const oneTouch = passer.firstTouchWindow > 0; // read before any kick consumes it
450:  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
451:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
456:  const oppPlayers = match.teams[1 - passer.side].players;
458:    const flight0 = clamp(0.55 + dist(passer.pos, runner.pos) * 0.045, 0.8, 2.0);
459:    const lead = runBurstPoint(runner, team, oppPlayers, flight0 * 0.85);
461:    const swing = aerialSwing(passer, passer.pos, lead, oppPlayers);
465:    const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
471:    const lead = runBurstPoint(runner, team, oppPlayers, flight * 1.25);
472:    const d = dist(passer.pos, lead);
476:    const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;
478:    const pressure = pressureAt(passer.pos, opp.players);
479:    const aim = norm(sub(lead, passer.pos));
480:    const noise =
488:    const dir = rotate(aim, noise);
506: * (tBase + m·tPerM, clamped), horizontal speed = distance/time, and the
517:  const team = match.teams[p.side];
518:  const opp = match.teams[1 - p.side];
519:  const aimDir = norm(sub(target, p.pos));
520:  const misalign = kickMisalignment(p, aimDir);
521:  const d = dist(p.pos, target);
522:  const pressure = pressureAt(p.pos, opp.players);
523:  const noise =
531:  const dir = rotate(aimDir, noise);
536:  const T = clamp(tBase + dEff * tPerM, tMin, tMax);
556:  const team = match.teams[crosser.side];
557:  const flight0 = clamp(0.5 + dist(crosser.pos, at ?? target.pos) * 0.038, 0.7, 1.7);
565:  const leadLen = Math.hypot(leadX, leadY);
570:  const arrive = at ?? v2(target.pos.x + leadX, target.pos.y + leadY);
571:  const goal = team.oppGoal();
579:  const spot = v2(arrive.x + (goal.x - arrive.x) * pull, arrive.y + (goal.y - arrive.y) * pull);
580:  const oneTouch = crosser.firstTouchWindow > 0;
585:  const chord = norm(sub(spot, crosser.pos));
586:  const toGoal = norm(sub(goal, crosser.pos));
587:  const swing = Math.sign(chord.x * toGoal.y - chord.y * toGoal.x) || 1;
588:  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
605:  const team = match.teams[gk.side];
606:  const flight0 = clamp(0.62 + dist(gk.pos, mate.pos) * 0.03, 0.9, 1.5);
607:  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
628:  const team = match.teams[passer.side];
629:  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
630:  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
631:  const flight = dist(passer.pos, mate.pos) / (18 * powerMul);
632:  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
633:  const d = dist(passer.pos, lead);
634:  const speed = clamp(d * 0.6 + 10, 11, 23) * powerMul;
635:  const pressure = pressureAt(passer.pos, match.teams[1 - passer.side].players);
636:  const aim = norm(sub(lead, passer.pos));
637:  const noise =
645:  const oneTouch = passer.firstTouchWindow > 0;
669:  const chord = norm(sub(landing, from));
674:    const d = dist(o.pos, landing);
680:  const mag = 0.12 + passer.attrs.passing * 0.18;
682:    const cross = chord.x * (threat.pos.y - from.y) - chord.y * (threat.pos.x - from.x);
687:  const midY = (from.y + landing.y) / 2;
688:  const cross = chord.x * (0 - midY);
694:  const team = match.teams[passer.side];
700:  const flight0 = clamp(0.55 + dist(passer.pos, mate.pos) * 0.033, 1.1, 2.1);
701:  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
702:  const oneTouch = passer.firstTouchWindow > 0;
704:  const swing = aerialSwing(passer, passer.pos, lead, match.teams[1 - passer.side].players);
742:  const ball = match.ball;
751:    const dx = gk.pos.x - ball.pos.x;
752:    const dy = gk.pos.y - ball.pos.y;
757:    gk.tackleCooldown = 0.9;
758:    gk.saveAnimTimer = 0.6;
759:    const crowd = pressureAt(gk.pos, match.teams[1 - gk.side].players);
760:    const pClaim = clamp(0.62 + (gk.attrs.reflexes - 0.5) * 0.5 - crowd * 0.3, 0.2, 0.9);
761:    if (match.rng.chance(pClaim)) {
763:      const shot = match.pendingShot;
787:    const dx = p.pos.x - ball.pos.x;
788:    const dy = p.pos.y - ball.pos.y;
789:    const d2 = dx * dx + dy * dy;
802:  const attacking = match.teams[p.side].localX(ball.pos.x) > HALF_L - BOX_DEPTH ? 0.3 : 0;
803:    const s =
807:      match.rng.range(0, 0.45);
822:  const wteam = match.teams[winner.side];
823:  const dOppGoal = dist(ball.pos, wteam.oppGoal());
824:  const nearOwnGoal = dist(ball.pos, wteam.ownGoal()) < 20;
834:    p.kickCooldown = 0.45;
835:    p.headerAnimTimer = 0.55;
839:  const pass = match.pendingPass;
850:  const ball = match.ball;
851:  const team = match.teams[p.side];
858:  const pass = match.pendingPass;
868:  const dGoal = dist(ball.pos, team.oppGoal());
875:    const dir = norm(v2(team.attackDir, match.rng.range(-0.9, 0.9)));
876:    ball.vel = scale(dir, match.rng.range(11, 15));
877:    ball.vz = match.rng.range(3.5, 5.2);
886:    const d = dist(q.pos, ball.pos);
888:    const s = opennessOf(q, match.teams[1 - p.side].players) - (d / 16) * 0.4;
894:  const to = mate ? norm(sub(mate.pos, ball.pos)) : v2(team.attackDir, 0);
895:  ball.vel = scale(to, match.rng.range(7, 9.5));
896:  ball.vz = 0.8; // nodded down — drops quickly to feet
906: * duel (an opponent within header reach = head it, as before). The take-down
914:  const ball = match.ball;
921:    const d = dist(p.pos, ball.pos);
935:  const hSpeed = Math.max(len(ball.vel), 1e-6);
936:  const inx = ball.vel.x / hSpeed;
937:  const iny = ball.vel.y / hSpeed;
938:  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
939:  const misalign = (1 + (inx * trapper.heading.x + iny * trapper.heading.y)) / 2;
940:  const pressure = pressureAt(trapper.pos, match.teams[1 - trapper.side].players);
941:  const pFail = clamp(
947:  trapper.kickCooldown = 0.3; // committed to the touch either way
948:  if (!match.rng.chance(pFail)) {
956:  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.9, 0.9)), match.rng.range(3, 5.5));
957:  ball.vz = 0; // knocked down — it drops
969:  const team = match.teams[shooter.side];
970:  const opp = match.teams[1 - shooter.side];
971:  const gk = opp.goalkeeper;
972:  const ball = match.ball;
974:  const goalX = team.attackDir * HALF_L;
975:  const aimMargin = 1.6 - shooter.attrs.finishing * 0.8;
976:  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
977:  const target = v2(goalX, aimY);
978:  const d = dist(ball.pos, target);
979:  const pressure = pressureAt(shooter.pos, opp.players);
980:  const central = 1 - clamp01(Math.abs(ball.pos.y) / HALF_W) * 0.5;
981:  const q = clamp(0.5 * Math.exp(-d / 8.5) * central * (1 - pressure * 0.25), 0.01, 0.45);
983:  const aim = norm(sub(target, ball.pos));
984:  const spread = (0.05 + d * 0.004 + pressure * 0.04) * (1.35 - shooter.attrs.finishing * 0.65);
985:  const dir = rotate(aim, match.rng.gaussian() * spread);
986:  ball.vel = scale(dir, 15 + shooter.attrs.finishing * 4);
987:  ball.vz = -1.2; // headed down toward the goal
993:  const difficulty = diveDifficulty(ball.pos, dir, gk, opp);
994:  const lp = match.lastCompletedPass;
995:  const assistGid =
1018:    const passer = match.allPlayers[assistGid];
1043:  const team = match.teams[shooter.side];
1044:  const opp = match.teams[1 - shooter.side];
1045:  const gk = opp.goalkeeper;
1047:  const goalX = team.attackDir * HALF_L;
1051:  const target = v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * 1.4);
1052:  const d = dist(shooter.pos, target);
1054:  const aim = norm(sub(target, shooter.pos));
1055:  const toGkX = gk.pos.x - shooter.pos.x;
1056:  const toGkY = gk.pos.y - shooter.pos.y;
1057:  const along = toGkX * aim.x + toGkY * aim.y;
1066:  const og = opp.ownGoal();
1071:  const a = clamp(along / d, 0.15, 0.8);
1072:  const clearK = GK_CLAIM_HEIGHT + 0.25;
1073:  const t2Nom = (clearK - a * 1.3) / ((GRAVITY / 2) * a * (1 - a));
1075:  const tNom = Math.sqrt(t2Nom);
1077:  const qChip = clamp(
1087:  const zg = 0.8 + match.rng.range(0, 1.9 - shooter.attrs.finishing * 0.5);
1088:  const T = Math.sqrt(Math.max(0.4, (clearK - a * zg) / ((GRAVITY / 2) * a * (1 - a))));
1089:  const vz = (zg + (GRAVITY / 2) * T * T) / T;
1090:  const misalign = kickMisalignment(shooter, aim);
1091:  const spread =
1094:  const dir = rotate(aim, match.rng.gaussian() * spread);
1101:  const lp = match.lastCompletedPass;
1102:  const assistGid =
1129:  const team = match.teams[shooter.side];
1130:  const opp = match.teams[1 - shooter.side];
1131:  const gk = opp.goalkeeper;
1136:  const goalX = team.attackDir * HALF_L;
1153:  const aimMargin = Math.max(
1157:  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
1158:  const target = v2(goalX, aimY);
1160:  const q = shotQuality(match, shooter);
1161:  const d = dist(shooter.pos, target);
1162:  const pressure = pressureAt(shooter.pos, opp.players);
1178:      const dd = dist(o.pos, shooter.pos);
1211:  const composure = clamp((shooter.attrs.finishing - 0.5) / 0.4, -0.75, 1);
1212:  const aimTarget = oneVone
1215:  const aim = norm(sub(aimTarget, shooter.pos));
1218:  const misalign = kickMisalignment(shooter, aim);
1223:  const spread =
1229:  const dir = rotate(aim, match.rng.gaussian() * spread);
1235:  const curl =
1237:  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
1238:  const shotT = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / v0, 0.85)) / BALL_FRICTION_K;
1247:  const difficulty = Math.max(
1253:  const lpForAssist = match.lastCompletedPass;
1254:  const assistGid =
1287:  const lp = match.lastCompletedPass;
1290:    const passer = match.allPlayers[lp.passerGid]; // allPlayers is gid-indexed
1306:  const team = match.teams[taker.side];
1307:  const opp = match.teams[1 - taker.side];
1308:  const gk = opp.goalkeeper;
1309:  const ball = match.ball;
1311:  const goalX = team.attackDir * HALF_L;
1313:  const aimMargin = 1.05 - taker.attrs.finishing * 0.55;
1314:  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
1315:  const target = v2(goalX, aimY);
1316:  const d = dist(ball.pos, target);
1323:  const zg = 0.85 + match.rng.range(0, 1.9);
1330:    const own = v2(team.attackDir * HALF_L, 0);
1331:    const center = add(match.fkWall.pos, scale(norm(sub(own, match.fkWall.pos)), CORNER_CLEARANCE + 0.15));
1339:  const spinMag = 0.25 + taker.attrs.passing * 0.25;
1340:  const a = clamp(wallD / d, 0.12, 0.6);
1341:  const wallClear = 2.6 + spinMag * 0.5;
1342:  const T = clamp(Math.sqrt(Math.max(0.4, (wallClear - a * zg) / ((GRAVITY / 2) * a * (1 - a)))), 0.9, 1.9);
1343:  const vz = (zg + (GRAVITY / 2) * T * T) / T;
1344:  const speed = d / T;
1348:  const spread = (0.034 + d * 0.001) * (1.35 - taker.attrs.finishing * 0.7);
1349:  const aim = norm(sub(target, ball.pos));
1350:  const dir = rotate(aim, match.rng.gaussian() * spread);
1353:  const q = clamp(0.09 - (d - 17) * 0.003, 0.02, 0.12);
1361:  const curlSign = Math.sign((target.y - gk.pos.y) * dir.x) || 1;
1362:  const spin = curlSign * spinMag;
1363:  const kickPos = v2(ball.pos.x, ball.pos.y);
1372:  const difficulty = Math.max(0.25, diveDifficulty(kickPos, dir, gk, opp) * (1 - Math.abs(spin) * 0.12));
1404:  const ball = match.ball;
1406:  const opp = match.teams[1 - p.side];
1408:  const hx = p.heading.x;
1409:  const hy = p.heading.y;
1413:    const dx = o.pos.x - p.pos.x;
1414:    const dy = o.pos.y - p.pos.y;
1415:    const along = dx * hx + dy * hy;
1419:    const eff = o.role === 'GK' ? along - GK_RUSH_ENVELOPE : along;
1421:    const perp = Math.abs(dx * hy - dy * hx);
1428:  const open = Math.min(Math.max(aheadD - 2, 0), 9);
1433:  const rollEst = push; // rolled meters ≈ push m/s over ~1s of decay
1440:  const vmag = Math.hypot(p.vel.x, p.vel.y);
1441:  const speed = vmag + Math.max(push, 0.8);
1443:  const noise = match.rng.gaussian() * 0.07 * (1.35 - p.attrs.dribbling * 0.7);
1451:  const travel = vmag > 0.5 ? v2(p.vel.x / vmag, p.vel.y / vmag) : v2(hx, hy);
1452:  const dir = rotate(travel, noise);
1455:  ball.vel = scale(dir, speed);
1456:  ball.z = 0;
1457:  ball.vz = 0;
1460:  p.kickCooldown = TOUCH_RECOLLECT_BASE + push * TOUCH_RECOLLECT_PER_PUSH;
1467:  const team = match.teams[p.side];
1471:  const lat = match.rng.range(-1.0, 1.0);
1472:  const aim = norm(v2(team.attackDir, lat));
1473:  const dir = rotate(aim, match.rng.gaussian() * 0.08);
1482:    match.rng.range(3.2, 5.4),
1494:  const ball = match.ball;
1495:  const speed = len(ball.vel);
1497:  p.kickCooldown = 0.3;
1503:  const dir = norm(ball.vel);
1504:  const blind = (1 + (dir.x * p.heading.x + dir.y * p.heading.y)) / 2;
1505:  const pDef = clamp(
1508:  if (!match.rng.chance(pDef)) return false; // it zips past the outstretched leg
1510:  ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
1511:  p.tackleAnimTimer = 0.4; // the stretch is visible (display only)
1526:  const owner = match.ball.owner;
1528:  const gk = match.teams[1 - owner.side].goalkeeper;
1530:  const rushing = gk.action.type === 'GoalkeeperRush';
1544:  gk.saveAnimTimer = 0.7; // the dive at the feet is visible either way
1545:  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
1546:  if (match.rng.chance(pWin)) {
1549:    owner.kickCooldown = 0.4;
1550:    owner.stunTimer = 0.4; // ran into a wall of keeper
1554:    gk.stunTimer = 0.8; // beaten — picking himself up off the turf
1559:    gk.tackleCooldown = 1.2;
1561:    if (match.rng.chance(rushing ? 0.12 : 0.03)) match.awardFoul(gk, owner);
1589:  const owner = match.ball.owner;
1591:  const attTeam = match.teams[owner.side];
1592:  const defTeam = match.teams[1 - owner.side];
1593:  const goal = attTeam.oppGoal();
1594:  const dGoal = dist(owner.pos, goal);
1606:    const d = dist(o.pos, match.ball.pos);
1608:    const bx = o.pos.x - owner.pos.x;
1609:    const by = o.pos.y - owner.pos.y;
1621:  if (!match.rng.chance(attempt)) return;
1622:  slider.tackleCooldown = 2.5; // committed — he is on the grass either way
1623:  slider.tackleAnimTimer = 0.5;
1626:  const win = clamp(
1631:  if (match.rng.chance(win)) {
1640:    match.ball.vel = scale(rotate(slider.heading, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
1641:    owner.kickCooldown = 0.3;
1642:    owner.stunTimer = 0.6;
1644:    slider.stunTimer = 0.5; // he won it from the ground — up he gets
1647:  slider.stunTimer = 0.8; // beaten and grounded — the carrier runs on
1650:  const foulP = 0.4 + defTeam.genome.markingAggression * 0.15;
1651:  if (match.rng.chance(foulP)) match.awardFoul(slider, owner);
1655:  const owner = match.ball.owner;
1657:  const attTeam = match.teams[owner.side];
1658:  const defTeam = match.teams[1 - owner.side];
1659:  const goal = attTeam.oppGoal();
1660:  const dGoal = dist(owner.pos, goal);
1681:    const d = dist(o.pos, owner.pos);
1683:    const bx = o.pos.x - owner.pos.x;
1684:    const by = o.pos.y - owner.pos.y;
1692:  grabber.tackleCooldown = 2.0; // committed either way — one grab per chase, not spam
1702:  if (!match.rng.chance(p)) return;
1703:  grabber.tackleAnimTimer = 0.4;
1714:  const ball = match.ball;
1715:  const owner = ball.owner;
1719:  const oppTeam = match.teams[1 - owner.side];
1725:    const d = dist(o.pos, ball.pos);
1737:  const jockeyG = oppTeam.genome.jockeyBias ?? 0.5;
1738:  const driveNow = clamp(len(owner.vel) / 9, 0, 1);
1739:  const goalSide = oppTeam.localX(tackler.pos.x) < oppTeam.localX(owner.pos.x) - 0.2;
1740:  const looseTouch = dist(ball.pos, owner.pos) > 0.85;
1754:  const dangerZone = oppTeam.localX(owner.pos.x) < -17;
1756:  tackler.tackleAnimTimer = 0.4; // the lunge is visible either way (display only)
1770:  const drive = driveNow;
1808:  p = clamp(p, 0.06, 0.7);
1810:  if (match.rng.chance(p)) {
1832:    const clear = norm(sub(ball.pos, oppTeam.ownGoal()));
1833:    const toTouch = Math.sign(ball.pos.y) || 1;
1834:    const wide = norm(v2(clear.x, clear.y + toTouch));
1835:    ball.vel = scale(rotate(wide, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
1836:    owner.kickCooldown = 0.3;
1837:    owner.stunTimer = 0.6; // dispossessed: stumble before rejoining play (Phase 27)
1838:    tackler.tackleCooldown = 0.5;
1846:    tackler.kickCooldown = 0.5;
1849:    tackler.tackleCooldown = 1.2;
1850:    tackler.stunTimer = 0.35; // whiffed lunge: pick yourself up first (Phase 27)
1853:    const foulP =
1857:    if (match.rng.chance(foulP)) match.awardFoul(tackler, owner);
1874:  const shot = match.pendingShot;
1875:  const ball = match.ball;
1878:  const defTeam = match.teams[1 - shot.side];
1882:    const dx = o.pos.x - ball.pos.x;
1884:    const dy = o.pos.y - ball.pos.y;
1887:    o.kickCooldown = 0.45; // committed to the block, ball met or not
1888:    o.tackleAnimTimer = 0.4;
1896:    const bdir = norm(ball.vel);
1897:    const blind = (1 + (bdir.x * o.heading.x + bdir.y * o.heading.y)) / 2;
1898:    const stillness = clamp01((3.5 - len(o.vel)) / 2.5);
1899:    const readiness = UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * (1 - blind) * stillness;
1900:    if (!match.rng.chance((0.32 + o.attrs.defending * 0.25) * readiness)) continue;
1903:    const away = match.rng.chance(0.5) ? 1 : -1;
1904:    ball.vel = scale(rotate(norm(ball.vel), away * match.rng.range(0.7, 2.4)), match.rng.range(4.5, 9));
1905:    ball.vz = 0;
1919:  const shot = match.pendingShot;
1920:  const ball = match.ball;
1923:  const defSide = (1 - shot.side) as 0 | 1;
1924:  const defTeam = match.teams[defSide];
1925:  const gk = defTeam.goalkeeper;
1926:  const goal = defTeam.ownGoal();
1928:  const speed = len(ball.vel);
1932:  const reach = keeperReach(defTeam, gk);
1933:  const dNow = dist(gk.pos, ball.pos);
1939:    const receding = dot(ball.vel, sub(gk.pos, ball.pos)) <= 0;
1944:  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)
1945:  const shooterTeam = match.teams[shot.side];
1962:    ? clamp(0.7 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) *
1970:    : clamp(0.48 - shot.xg * 0.45 + (gk.attrs.reflexes - 0.5) * 0.28, 0.1, 0.92) * shot.difficulty;
1990:  if (match.rng.chance(saveP)) {
1995:    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
2003:      const inDir = norm(ball.vel);
2004:      const side = ball.pos.y >= 0 ? 1 : -1;
2005:      const ang = side * Math.sign(inDir.x || 1) * match.rng.range(0.55, 1.15);
2006:      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));
2008:      gk.kickCooldown = 0.6; // let the parry leave the keeper's feet

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node -e 'const ts=require(\"typescript\"),fs=require(\"fs\"),cp=require(\"child_process\");const file=\"src/sim/constants.ts\",sf=ts.createSourceFile(file,fs.readFileSync(file,\"utf8\"),ts.ScriptTarget.Latest,true),names=[];for(const st of sf.statements)if(ts.isVariableStatement(st))for(const d of st.declarationList.declarations)if(ts.isIdentifier(d.name)&&/"'^[A-Z]/.test(d.name.text))names.push(d.name.text);for(const n of names){let out="";try{out=cp.execFileSync("rg",["-l","-w",n,"src","--glob","*.ts"],{encoding:"utf8"}).trim()}catch{};console.log(n+"'"\\t\"+out.split(\"\\n\").filter(Boolean).join(\",\"))}'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 1737ms:[0m
LEGACY_PITCH_SCALE	src/sim/constants.ts
FIELD_SCALE	src/render3d/PitchModel.ts,src/sim/constants.ts,src/ai/formations.ts
GOAL_AND_BOX_SCALE	src/sim/constants.ts
BODY_SCALE	src/sim/constants.ts
CONTROL_REACH_SCALE	src/sim/constants.ts
SPEED_TIME_SCALE	src/sim/constants.ts
PITCH_LENGTH	src/sim/constants.ts,src/render/PitchRenderer.ts,src/render/transform.ts,src/render/MatchRenderer.ts
PITCH_WIDTH	src/sim/constants.ts,src/render/PitchRenderer.ts,src/render/transform.ts,src/render/MatchRenderer.ts
HALF_L	src/render3d/LinesmanModel.ts,src/render3d/PitchModel.ts,src/render3d/FxSystem.ts,src/render3d/SceneFactory.ts,src/render3d/GoalModel.ts,src/render3d/ThreeMatchRenderer.ts,src/render3d/ShootoutTheater.ts,src/render3d/CameraController.ts,src/render3d/AnimationSystem.ts,src/render3d/RefereeModel.ts,src/sim/constants.ts,src/sim/mechanics.ts,src/sim/Team.ts,src/render/transform.ts,src/render/MatchRenderer.ts,src/ai/offBallAffordance.ts,src/ai/formations.ts,src/ai/actionExecutor.ts,src/ai/carryAffordance.ts,src/ai/PlayerBrain.ts,src/sim/Match.ts,src/ai/perception.ts,src/ai/relativeAffordance.ts,src/ai/TeamBrain.ts,src/ai/passAffordance.ts
HALF_W	src/render3d/LinesmanModel.ts,src/render3d/PitchModel.ts,src/render3d/FxSystem.ts,src/render3d/SceneFactory.ts,src/render3d/ThreeMatchRenderer.ts,src/ai/offBallAffordance.ts,src/ai/actionExecutor.ts,src/ai/carryAffordance.ts,src/ai/perception.ts,src/ai/formations.ts,src/ai/PlayerBrain.ts,src/ai/relativeAffordance.ts,src/render3d/AnimationSystem.ts,src/sim/constants.ts,src/sim/mechanics.ts,src/render3d/BroadcastLayer.ts,src/render3d/RefereeModel.ts,src/sim/Match.ts,src/render/MatchRenderer.ts,src/render/transform.ts
OUT_PLAY_COAST	src/sim/constants.ts,src/sim/Match.ts
GOAL_WIDTH	src/render3d/PitchModel.ts,src/render3d/FxSystem.ts,src/render3d/GoalModel.ts,src/sim/constants.ts,src/sim/mechanics.ts,src/sim/Match.ts,src/render/PitchRenderer.ts,src/ai/actionExecutor.ts,src/ai/formations.ts
GOAL_DEPTH	src/render3d/GoalModel.ts,src/sim/constants.ts,src/render/PitchRenderer.ts
GOAL_HEIGHT	src/render3d/GoalModel.ts,src/sim/constants.ts,src/sim/Match.ts
BOX_DEPTH	src/render3d/PitchModel.ts,src/render3d/ThreeMatchRenderer.ts,src/render3d/AnimationSystem.ts,src/sim/constants.ts,src/sim/mechanics.ts,src/sim/Match.ts,src/ai/actionExecutor.ts,src/ai/formations.ts,src/ai/relativeAffordance.ts,src/ai/TeamBrain.ts,src/render/PitchRenderer.ts
BOX_WIDTH	src/render/PitchRenderer.ts,src/sim/Match.ts,src/sim/constants.ts,src/render3d/ThreeMatchRenderer.ts,src/render3d/PitchModel.ts,src/ai/actionExecutor.ts,src/ai/relativeAffordance.ts,src/ai/TeamBrain.ts
CENTER_CIRCLE_R	src/render3d/PitchModel.ts,src/sim/constants.ts,src/render/PitchRenderer.ts
DT	src/game/GameApp.ts,src/sim/rendezvousRecovery.ts,src/ai/prediction.ts,src/ai/passCorridorInterception.ts,src/ai/motionEvidence.ts,src/ai/passAffordance.ts,src/sim/constants.ts,src/sim/Match.ts,src/sim/Player.ts
MATCH_DURATION	src/sim/League.ts,src/sim/constants.ts,src/sim/Match.ts
STOPPAGE_MAX	src/sim/constants.ts,src/sim/Match.ts
SURFACE_PROFILE	src/sim/constants.ts
BALL_FRICTION_K	src/sim/rendezvousRecovery.ts,src/sim/constants.ts,src/sim/mechanics.ts,src/sim/Match.ts,src/ai/prediction.ts,src/ai/passCorridorInterception.ts,src/ai/perception.ts,src/ai/passOptionValue.ts
BALL_AIR_SPIN_DECAY	src/sim/constants.ts,src/sim/Match.ts
BALL_GROUND_SPIN_DECAY	src/sim/constants.ts,src/sim/Match.ts
BALL_BOUNCE_SPIN_RETENTION	src/sim/constants.ts,src/sim/Match.ts
STAMINA_DRAIN	src/sim/constants.ts,src/sim/Player.ts
STAMINA_RECOVERY	src/sim/constants.ts,src/sim/Player.ts
TACKLE_LUNGE_COST	src/sim/constants.ts,src/sim/mechanics.ts
DEFLECT_BLIND_PEN	src/sim/constants.ts,src/sim/mechanics.ts
CONTACT_BLIND_PEN	src/sim/constants.ts,src/sim/Match.ts
UNSET_BLOCK_WEIGHT	src/sim/constants.ts,src/sim/mechanics.ts,src/ai/perception.ts
CROSS_LEAD_FRAC	src/sim/constants.ts,src/sim/mechanics.ts
CROSS_LEAD_MAX	src/sim/constants.ts,src/sim/mechanics.ts
GRAVITY	src/sim/constants.ts,src/sim/mechanics.ts,src/sim/Match.ts,src/ai/perception.ts
BALL_BOUNCE	src/sim/constants.ts,src/sim/Match.ts
BOUNCE_DAMP	src/sim/constants.ts,src/sim/Match.ts
BOUNCE_MIN_VZ	src/sim/constants.ts,src/sim/Match.ts
CONTROL_MAX_HEIGHT	src/sim/constants.ts,src/sim/Match.ts,src/ai/actionExecutor.ts
HEADER_MIN_HEIGHT	src/sim/constants.ts,src/sim/mechanics.ts
HEADER_MAX_HEIGHT	src/sim/constants.ts,src/sim/mechanics.ts
HEADER_RADIUS	src/sim/constants.ts,src/sim/mechanics.ts,src/ai/actionExecutor.ts
CHEST_TRAP_MAX_HEIGHT	src/sim/constants.ts,src/sim/mechanics.ts
CHEST_TRAP_RADIUS	src/sim/constants.ts,src/sim/mechanics.ts
CHEST_TRAP_MAX_VZ	src/sim/constants.ts,src/sim/mechanics.ts
GK_CLAIM_HEIGHT	src/sim/constants.ts,src/sim/mechanics.ts
GK_HOLD_CLEARANCE	src/sim/constants.ts,src/sim/Match.ts
RESTART_CLEARANCE	src/sim/constants.ts,src/sim/Match.ts
CORNER_CLEARANCE	src/sim/constants.ts,src/sim/mechanics.ts,src/sim/Match.ts,src/ai/formations.ts,src/ai/actionExecutor.ts
PENALTY_SPOT_DIST	src/render3d/ShootoutTheater.ts,src/sim/constants.ts,src/sim/Match.ts
PENALTY_CLEARANCE	src/sim/constants.ts,src/sim/Match.ts
RESTART_MIN_SETUP	src/sim/Match.ts,src/sim/constants.ts
RESTART_TIMEOUT	src/sim/constants.ts,src/sim/Match.ts
CONTROL_RADIUS	src/sim/rendezvousRecovery.ts,src/sim/constants.ts,src/sim/Match.ts,src/ai/passCorridorInterception.ts,src/ai/passAffordance.ts
BALL_ACCESS_SIDE_EXTENSION_FACTOR	src/sim/constants.ts,src/sim/physical.ts
BALL_ACCESS_BACK_EXTENSION_FACTOR	src/sim/constants.ts,src/sim/physical.ts
CONTEST_RADIUS	src/sim/constants.ts,src/sim/types.ts,src/sim/Match.ts
CONTROL_MAX_SPEED	src/sim/Match.ts,src/sim/constants.ts
GK_CONTROL_MAX_SPEED	src/sim/constants.ts,src/sim/Match.ts
CONTACT_CONTROL_DELAY_TICKS	src/sim/constants.ts,src/sim/Match.ts
CONTACT_COMMIT_TIME	src/sim/constants.ts,src/sim/Match.ts
CONTACT_CONTROL_RETENTION_MARGIN	src/sim/constants.ts,src/sim/Match.ts
CONTACT_RELEASE_MIN_SPEED	src/sim/constants.ts,src/sim/Match.ts
CONTACT_RELEASE_MAX_SPEED	src/sim/constants.ts,src/sim/Match.ts
CONTACT_RELEASE_INCOMING_SHARE	src/sim/constants.ts,src/sim/Match.ts
CONTACT_TANGENTIAL_RETENTION	src/sim/constants.ts,src/sim/Match.ts
DEFLECT_MAX_SPEED	src/sim/constants.ts,src/sim/Match.ts
KICK_COOLDOWN	src/sim/constants.ts,src/sim/Match.ts
PASS_POWER_MIN	src/sim/constants.ts,src/sim/mechanics.ts,src/ai/PlayerBrain.ts
PASS_POWER_MAX	src/sim/constants.ts,src/sim/mechanics.ts,src/ai/PlayerBrain.ts
PASS_POWER_NOISE_K	src/sim/constants.ts,src/sim/mechanics.ts
PASS_POWER_EXECUTED_MIN	src/sim/constants.ts,src/sim/mechanics.ts
PASS_POWER_EXECUTED_MAX	src/sim/constants.ts,src/sim/mechanics.ts
TOUCH_CONTROL_DIST	src/sim/constants.ts,src/sim/Match.ts
TOUCH_PUSH_BASE	src/sim/constants.ts,src/sim/mechanics.ts
TOUCH_PUSH_SPACE	src/sim/constants.ts,src/sim/mechanics.ts
TOUCH_RECOLLECT_BASE	src/sim/constants.ts,src/sim/mechanics.ts
TOUCH_RECOLLECT_PER_PUSH	src/sim/mechanics.ts,src/sim/constants.ts
GK_RUSH_ENVELOPE	src/sim/mechanics.ts,src/sim/constants.ts
AI_INTERVAL	src/sim/constants.ts,src/sim/Match.ts
TEAM_AI_INTERVAL	src/sim/constants.ts,src/ai/TeamBrain.ts,src/sim/Match.ts
SHOT_SPEED	src/sim/constants.ts,src/sim/mechanics.ts
PLAYER_MIN_DIST	src/render3d/PlayerModel.ts,src/render3d/AnimationSystem.ts,src/sim/constants.ts,src/sim/Match.ts,src/ai/intentResponse.ts,src/ai/formations.ts
PLAYER_CORE_RADIUS	src/sim/constants.ts,src/sim/controlCoupling.ts,src/sim/Player.ts
BALL_RADIUS	src/render3d/ballPresentation.ts,src/sim/rendezvousRecovery.ts,src/sim/constants.ts,src/sim/controlCoupling.ts,src/sim/Ball.ts,src/render/MatchRenderer.ts

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "node -e 'const ts=require(\"typescript\"),fs=require(\"fs\");for(const file of [\"src/sim/mechanics.ts\",\"src/sim/Ball.ts\",\"src/sim/Player.ts\",\"src/ai/prediction.ts\"]){const sf=ts.createSourceFile(file,fs.readFileSync(file,\"utf8\"),ts.ScriptTarget.Latest,true);const groups=new Map();function visit(n,fn=\"module\"){let next=fn;if(ts.isFunctionDeclaration(n)&&n.name)next=n.name.text;else if(ts.isMethodDeclaration(n)&&n.name)next=n.name.getText(sf);else if(ts.isGetAccessor(n)&&n.name)next=\"get \"+n.name.getText(sf);if(ts.isNumericLiteral(n)){const p=n.parent;let meaningful=true;if(ts.isPropertyAccessExpression(p)&&p.name===n) meaningful=false;if(meaningful){const lc=sf.getLineAndCharacterOfPosition(n.getStart(sf));const val=n.getText(sf);if("'!groups.has(next))groups.set(next,[]);groups.get(next).push(`${lc.line+1}:${val}`)}}ts.forEachChild(n,c=>visit(c,next))}visit(sf);console.log("### "+file);for(const [g,vals] of groups)console.log(g+"'"\\t\"+vals.join(\", \"));}'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 328ms:[0m
### src/sim/mechanics.ts
keeperReach	31:2.05, 31:0.4, 31:0.5, 31:0.5, 32:0.12, 32:0
module	44:1.35, 105:8, 105:0.07, 106:16, 106:0.24, 714:0, 714:0.3, 714:0.14, 714:0.06, 714:0.26
diveDifficulty	50:40, 51:1.15, 51:0.25, 51:1
angleCoverage	62:1, 65:1, 65:1, 65:3
kickMisalignment	78:1, 78:2
orientationNoiseMul	83:1, 83:0.9, 83:0.6
orientationPowerMul	88:1, 88:0.22, 88:1, 88:0.4
touchFailChance	110:0.5, 119:1, 119:0.5, 119:0.6, 121:0.01, 121:6, 122:0.1, 122:0.05, 123:1.3, 123:0.85, 123:0, 123:0.4
attemptFirstTouch	165:0.6, 166:6, 167:1e-6, 171:1, 171:2, 172:1, 180:0.45, 206:0.8, 206:0.8, 206:3.5, 206:6.5, 207:0, 208:0.5
offsideAtKick	221:0, 222:1, 223:0.2
registerPass	242:1.5, 244:3
oneTouchMul	263:0, 263:1.15, 263:1, 263:0.9, 263:1
shotQuality	271:1, 271:0.5, 272:1, 273:0.85, 273:10, 273:1, 273:0.3, 273:0.01, 273:0.8
groundBend	293:1.3, 299:2, 299:2, 306:0, 312:1.4, 312:0.3, 312:1, 317:0.45, 319:1
bentKick	325:0, 329:1, 329:0.85, 330:1, 330:1.5, 330:1.5, 334:0.2, 334:1.35, 335:0.5
executedPassPower	347:1, 347:1, 349:1, 349:1.35
performPass	354:1, 356:0, 358:1, 372:16, 373:0.8, 378:0.6, 378:8.2, 378:9, 378:22, 386:0.02, 386:0.07, 386:0.0015, 387:1.15, 387:0.3, 388:1, 388:0.12, 389:1.25, 389:0.5, 394:0, 405:2, 422:15, 423:0.2, 424:0.3, 425:0, 426:2, 426:0.35, 428:2.3
performThroughBall	443:0, 445:1, 446:0, 456:1, 458:0.55, 458:0.045, 458:0.8, 458:2.0, 459:0.85, 462:0.55, 462:0.045, 462:0.8, 462:2.0, 462:1.0, 465:18, 471:1.25, 476:0.6, 476:9, 476:10, 476:24, 482:0.025, 482:0.07, 482:0.0017, 483:1.15, 483:0.3, 484:1, 484:0.12, 485:1.25, 485:0.5, 496:2
loftKick	515:0, 518:1, 525:0.03, 525:0.05, 525:0.0011, 526:1.15, 526:0.3, 527:1, 527:0.12, 528:1.3, 528:0.55, 534:1, 534:0.02, 534:0.0008, 534:1.25, 534:0.5, 535:3, 542:0, 542:0.5, 542:2
performCross	553:0.18, 555:0, 557:0.5, 557:0.038, 557:0.7, 557:1.7, 580:0, 587:1, 588:0.28, 588:0.3, 589:0.5, 589:0.038, 589:0.7, 589:1.7, 589:1.1, 593:2
performKeeperThrow	604:0, 606:0.62, 606:0.03, 606:0.9, 606:1.5, 607:0.7, 611:0.62, 611:0.03, 611:0.9, 611:1.5, 611:0.45, 613:2
performCutback	627:0, 631:18, 632:0.8, 634:0.6, 634:10, 634:11, 634:23, 635:1, 639:0.02, 639:0.06, 639:0.0012, 640:1.15, 640:0.3, 641:1, 641:0.12, 642:1.25, 642:0.5, 645:0
aerialSwing	671:8, 680:0.12, 680:0.18, 683:1, 687:2, 688:0, 689:1, 689:0.6
performLoftedPass	693:0, 700:0.55, 700:0.033, 700:1.1, 700:2.1, 701:0.7, 702:0, 704:1, 705:0.55, 705:0.033, 705:1.1, 705:2.1, 705:0.9, 709:2
aerialSense	730:0.15, 730:0.3
tryAerial	746:0, 746:0, 753:1.9, 753:1.9, 757:0.9, 758:0.6, 759:1, 760:0.62, 760:0.5, 760:0.5, 760:0.3, 760:0.2, 760:0.9, 786:0, 786:0, 802:0.3, 802:0, 806:1, 806:0.35, 807:0, 807:0.45, 824:20, 826:1, 830:0, 830:16.5, 834:0.45, 835:0.55
headBall	869:16.5, 873:20, 875:0.9, 875:0.9, 876:11, 876:15, 877:3.5, 877:5.2, 887:16, 888:1, 888:16, 888:0.4, 894:0, 895:7, 895:9.5, 896:0.8
tryChestTrap	920:0, 920:0, 929:1, 935:1e-6, 938:0.6, 939:1, 939:2, 940:1, 945:0.05, 945:0, 945:0.5, 947:0.3, 956:0.9, 956:0.9, 956:3, 956:5.5, 957:0
performHeaderShot	970:1, 975:1.6, 975:0.8, 976:0, 976:1, 976:1, 976:2, 980:1, 980:0.5, 981:0.5, 981:8.5, 981:1, 981:0.25, 981:0.01, 981:0.45, 984:0.05, 984:0.004, 984:0.04, 984:1.35, 984:0.65, 986:15, 986:4, 987:1.2, 996:3, 1007:7, 1007:7, 1012:1, 1021:2
tryChip	1044:1, 1051:0, 1051:1, 1051:1, 1051:1.4, 1053:7, 1053:30, 1060:2.5, 1060:5.5, 1061:3.5, 1067:7.5, 1071:0.15, 1071:0.8, 1072:0.25, 1073:1.3, 1073:2, 1073:1, 1074:0, 1076:1.45, 1078:0.36, 1078:0.9, 1078:0.22, 1078:0.12, 1078:0.06, 1079:0.03, 1079:0.38, 1083:1.2, 1083:0.03, 1087:0.8, 1087:0, 1087:1.9, 1087:0.5, 1088:0.4, 1088:2, 1088:1, 1089:2, 1092:0.03, 1092:0.0012, 1092:1.3, 1092:0.6, 1103:3, 1117:1, 1119:0.8, 1122:2
performShot	1127:0, 1130:1, 1154:0.4, 1155:1.3, 1155:0.6, 1155:0.1, 1155:0, 1157:0, 1157:1, 1157:1, 1157:2, 1173:0, 1184:0.55, 1184:0.9, 1198:1, 1211:0.5, 1211:0.4, 1211:0.75, 1211:1, 1213:0, 1213:1, 1213:1, 1213:2, 1213:1, 1213:0.28, 1224:0.022, 1224:0.0028, 1224:0.05, 1225:1.45, 1225:0.9, 1226:1, 1226:0.12, 1227:1, 1227:0.3, 1227:1, 1236:1, 1236:0.1, 1236:0.2, 1238:1, 1238:0.85, 1239:0.5, 1248:0.25, 1249:1, 1249:0.12, 1255:3, 1266:5, 1268:2.5, 1279:1, 1282:7, 1282:7, 1288:3, 1293:2
performFreeKick	1305:0, 1307:1, 1313:1.05, 1313:0.55, 1314:0, 1314:1, 1314:1, 1314:2, 1323:0.85, 1323:0, 1323:1.9, 1328:0.9, 1330:0, 1331:0.15, 1332:1.4, 1339:0.25, 1339:0.25, 1340:0.12, 1340:0.6, 1341:2.6, 1341:0.5, 1342:0.4, 1342:2, 1342:1, 1342:0.9, 1342:1.9, 1343:2, 1348:0.034, 1348:0.001, 1348:1.35, 1348:0.7, 1353:0.09, 1353:17, 1353:0.003, 1353:0.02, 1353:0.12, 1361:1, 1364:0.5, 1372:0.25, 1372:1, 1372:0.12, 1377:0, 1386:1, 1391:2
performDribbleTouch	1406:1, 1410:14, 1420:0, 1420:14, 1422:0.7, 1422:1, 1423:0, 1428:2, 1428:0, 1428:9, 1429:1.05, 1429:0.15, 1435:2, 1435:1, 1436:2, 1436:1, 1438:0.5, 1441:0.8, 1443:0.07, 1443:1.35, 1443:0.7, 1451:0.5, 1456:0, 1457:0, 1461:1.6
performClear	1465:0, 1471:1.0, 1471:1.0, 1473:0.08, 1481:23, 1481:1, 1481:0.15, 1481:1, 1481:0.4, 1482:3.2, 1482:5.4
tryDeflection	1497:0.3, 1504:1, 1504:2, 1506:0.24, 1506:0.4, 1506:14, 1506:0.02, 1506:1, 1507:0.05, 1507:0.6, 1510:1.2, 1510:1.2, 1510:4, 1510:8, 1511:0.4
trySmother	1527:0, 1528:1, 1529:0, 1529:0, 1529:0, 1542:1.3, 1544:0.7, 1545:0.56, 1545:0.5, 1545:0.5, 1545:0.5, 1545:0.35, 1545:0.2, 1545:0.85, 1549:0.4, 1550:0.4, 1554:0.8, 1559:1.2, 1561:0.12, 1561:0.03
trySlideTackle	1590:0, 1592:1, 1597:30, 1600:4.0, 1601:0, 1605:0, 1605:0, 1607:1.2, 1607:2.2, 1610:0, 1619:0.05, 1619:0.12, 1620:0.35, 1622:2.5, 1623:0.5, 1627:0.16, 1627:0.14, 1627:0.1, 1628:0.05, 1629:0.4, 1640:1.2, 1640:1.2, 1640:5.5, 1640:10, 1641:0.3, 1642:0.6, 1643:1, 1644:0.5, 1647:0.8, 1650:0.4, 1650:0.15
tryTacticalFoul	1656:0, 1658:1, 1666:16, 1666:34, 1668:4.5, 1669:0, 1673:1, 1680:0, 1680:0, 1682:1.7, 1685:0, 1692:2.0, 1696:0.06, 1696:0.1, 1697:0.3, 1701:28, 1701:0.6, 1703:0.4
tryTackles	1718:0, 1719:1, 1724:0, 1724:0, 1726:1.15, 1737:0.5, 1738:9, 1738:0, 1738:1, 1739:0.2, 1740:0.85, 1747:3, 1754:17, 1755:0.9, 1755:0.55, 1756:0.4, 1781:0.25, 1782:0.2, 1783:0.34, 1784:0.08, 1785:0.18, 1786:0.1, 1794:0.16, 1795:0.06, 1796:0.04, 1807:0.45, 1807:0.12, 1808:0.06, 1808:0.7, 1833:1, 1835:1.2, 1835:1.2, 1835:5.5, 1835:10, 1836:0.3, 1837:0.6, 1838:0.5, 1846:0.5, 1847:1, 1849:1.2, 1850:0.35, 1854:0.06, 1854:0.1, 1855:0.02, 1855:0, 1856:0.01, 1856:0
tryShotBlock	1877:1.1, 1878:1, 1879:6, 1881:0, 1881:0, 1883:0.9, 1883:0.9, 1885:0.9, 1885:0.9, 1886:0.9, 1887:0.45, 1888:0.4, 1897:1, 1897:2, 1898:3.5, 1898:2.5, 1899:1, 1899:1, 1900:0.32, 1900:0.25, 1903:0.5, 1903:1, 1903:1, 1904:0.7, 1904:2.4, 1904:4.5, 1904:9, 1905:0
tryKeeperSave	1923:1, 1923:0, 1923:1, 1929:6, 1930:0, 1939:0, 1944:0.7, 1962:0.7, 1962:0.6, 1962:0.5, 1962:0.22, 1962:0.08, 1962:0.92, 1963:0.85, 1970:0.48, 1970:0.45, 1970:0.5, 1970:0.28, 1970:0.1, 1970:0.92, 1988:0.95, 1988:1, 1988:0, 1988:0, 1988:0.9, 1995:21, 1995:0.8, 2004:0, 2004:1, 2004:1, 2005:1, 2005:0.55, 2005:1.15, 2006:0.45, 2006:7, 2006:12, 2008:0.6
### src/sim/Ball.ts
module	20:0, 22:0, 30:0
get airborne	36:0, 36:0
reset	48:0, 49:0, 50:0
### src/sim/Player.ts
module	8:6.4, 8:7.0, 8:7.3, 8:7.9, 8:7.7, 9:14, 17:6.5, 19:1, 20:1, 21:0, 44:1, 44:0, 66:1, 67:0, 68:0, 71:0, 72:0, 73:0, 79:0, 85:0, 92:0, 94:0, 96:0, 98:0, 111:0, 118:0, 126:0, 154:1, 154:1, 154:1, 155:1, 183:0.88, 183:0.24, 184:0.9, 184:0.2, 188:0.9, 188:1
takeKnock	205:0.8, 205:0.85, 206:0.88, 206:0.24, 207:0.9, 207:0.2
becomeSub	215:0.88, 215:0.24, 216:0.9, 216:0.2, 218:0.9, 218:1, 219:1, 225:0, 225:0, 225:1, 225:1, 228:0, 229:0, 230:0, 231:0, 232:0, 234:0, 235:0, 236:0, 237:0, 238:0, 240:0
get topSpeed	247:0.62, 247:0.38
physicsStep	260:1e-8, 266:0, 267:0.15, 268:0.15, 274:1e-8, 295:0, 296:0, 302:1e-6, 307:0.5, 318:0, 332:0.55, 334:1.24, 334:0.6, 335:0.05, 338:1, 338:0.88, 338:0.3, 341:0, 342:0, 343:0, 344:0, 345:0, 346:0, 347:0, 348:0, 349:0
spendBurst	359:1.24, 359:0.6, 360:0.05
resetForKickoff	369:0, 370:0, 371:0, 372:0, 374:0, 375:0, 376:0, 377:0, 378:0, 379:1
### src/ai/prediction.ts
predictObservedPosition	22:1.5, 24:0
groundBallTravelTime	30:0, 31:0, 32:0, 32:0, 33:0, 37:1, 39:1, 40:1e-12
predictGroundPass	53:1, 55:0.1, 59:16, 61:0.8, 62:0.8, 65:0.6, 65:8.2, 65:9, 65:22

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '20,220p'; nl -ba src/sim/mechanics.ts | sed -n '250,520p'; nl -ba src/sim/mechanics.ts | sed -n '500,740p'; nl -ba src/sim/mechanics.ts | sed -n '740,1030p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
    20	
    21	/**
    22	 * Ball mechanics: kicks, tackles, keeper saves and the xG model.
    23	 * These are free functions over the Match so Match.ts stays a readable
    24	 * state machine. All randomness comes from match.rng (deterministic).
    25	 */
    26	
    27	/** How far out the keeper can reach a ball (dive included). */
    28	function keeperReach(defTeam: { genome: { keeperAggression: number } }, gk: Player): number {
    29	  // The cat (Phase 39): elite-reflex keepers reach a hand further.
    30	  return (
    31	    2.05 + defTeam.genome.keeperAggression * 0.4 + (gk.attrs.reflexes - 0.5) * 0.5 +
    32	    (gk.traits.includes('cat') ? 0.12 : 0)
    33	  );
    34	}
    35	
    36	/** THE FINGERTIP STRETCH (Phase 119b): a save may be ATTEMPTED out to
    37	 * reach × this. The old hard cliff at reach meant a ball 5cm beyond was
    38	 * untouchable — onevone-anatomy measured 54%/23% of late-gen 1v1 shots
    39	 * (65%/36% of the GOALS) never rolling a save at all; the composed
    40	 * post-placed finish was engineered to shave exactly that boundary. The
    41	 * frozen dive difficulty already prices the distance (floor 0.25), the
    42	 * attempt fires only as the ball passes its closest approach (a catchable
    43	 * ball is never pre-empted), and a stretch save can only PARRY. */
    44	const SAVE_STRETCH = 1.35;
    45	
    46	/** Dive difficulty, frozen at the moment of the strike: how far off the
    47	 * shot's line the keeper stands, priced against his reach. Shared by the
    48	 * open-play shot, the header and the placed free kick. */
    49	function diveDifficulty(ballPos: V2, dir: V2, gk: Player, opp: { genome: { keeperAggression: number } }): number {
    50	  const path = closestPointOnSegment(ballPos, add(ballPos, scale(dir, 40)), gk.pos);
    51	  return clamp(1.15 - dist(path, gk.pos) / keeperReach(opp, gk), 0.25, 1);
    52	}
    53	
    54	/** ANGLE COVERED (Phase 119b): the share of the goal's angular window the
    55	 * keeper's POSITION cut at the strike — his depth up the shot cone over the
    56	 * shooter's distance, discounted as he stands off the shooter→goal line (a
    57	 * dragged keeper covers nothing). Phase 103's closeIn paid proximity to the
    58	 * SHOOTER; the anatomy probe caught evolution routing around it — striking
    59	 * from 8-10m where closeIn ≈ 0.1 while a keeper 3m up the cone still cut
    60	 * ~40% of the window for free. Frozen at shot time, like difficulty. */
    61	function angleCoverage(gk: Player, shooterPos: V2, goal: V2): number {
    62	  const sGoal = Math.max(dist(shooterPos, goal), 1);
    63	  const kGoal = dist(gk.pos, goal);
    64	  const lineOff = dist(closestPointOnSegment(shooterPos, goal, gk.pos), gk.pos);
    65	  return clamp01(Math.min(kGoal / sGoal, 1) * clamp01(1 - lineOff / 3));
    66	}
    67	
    68	/* ------------------------------------------------------------------ */
    69	/* Body orientation (Phase 27)                                         */
    70	/* ------------------------------------------------------------------ */
    71	
    72	/**
    73	 * How far a kick direction is from where the body faces: (1 − cosθ) / 2.
    74	 * 0 = striking dead ahead, 0.5 = square across the body, 1 = fully blind.
    75	 * `dir` must be normalized.
    76	 */
    77	export function kickMisalignment(p: Player, dir: V2): number {
    78	  return (1 - (p.heading.x * dir.x + p.heading.y * dir.y)) / 2;
    79	}
    80	
    81	/** Kicks across/against the body spray more; technique tames the penalty. */
    82	export function orientationNoiseMul(misalign: number, technique: number): number {
    83	  return 1 + misalign * (0.9 - technique * 0.6);
    84	}
    85	
    86	/** Kicks against the body lose power (up to −22%); technique recovers some. */
    87	export function orientationPowerMul(misalign: number, technique: number): number {
    88	  return 1 - misalign * 0.22 * (1 - technique * 0.4);
    89	}
    90	
    91	/**
    92	 * First-touch difficulty (Phase 27): chance a moving ball gets away from the
    93	 * receiver. Grows with ball speed, defender pressure and taking the ball from
    94	 * behind the body; technique tames all of it. This is where pressing turns
    95	 * into forced errors.
    96	 */
    97	/**
    98	 * EDS E1b (docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md): the two speed-cost
    99	 * curves. `base` is the shipped one; `heavy` is C1-B §12.2's honest curve —
   100	 * saturation moves from 14 m/s to the 22 m/s ground-pass launch cap, and the
   101	 * rolled-versus-drilled spread lands at the same order as the 17.4pp
   102	 * interception swing power buys. Selected per call, never globally.
   103	 */
   104	export const TOUCH_SPEED_COST = {
   105	  base: { span: 8, weight: 0.07 },
   106	  heavy: { span: 16, weight: 0.24 },
   107	} as const;
   108	
   109	export function touchFailChance(
   110	  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,
   111	  heavyTouchCost = false,
   112	): number {
   113	  // POSITIONING (Phase 119j) reads the ball and shapes the body EARLY, so it
   114	  // tames the PRESSURE and BLIND-SIDE penalties (the awareness half of a first
   115	  // touch); technique still tames the whole thing (the clean contact). Neutral
   116	  // at 0.5 — `aware` = 1.0 there, so the pre-119j curve is bit-for-bit intact
   117	  // and backfilled 0.5 saves play unchanged; a reader (1.0) cuts the
   118	  // pressure/blind penalty ~30%, a spatially-blind player (0) pays ~30% more.
   119	  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3
   120	  const cost = heavyTouchCost ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;
   121	  const raw = 0.01 + clamp01((speed - 6) / cost.span) * cost.weight
   122	    + (pressure * 0.1 + misalign * 0.05) * aware;
   123	  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);
   124	}
   125	
   126	/**
   127	 * EDS E1a: one first-touch adjudication, decomposed into the exact terms the
   128	 * roll used. Emitted only when `Match.traceFirstTouch` is on; nothing reads it
   129	 * back and no branch above it depends on it.
   130	 */
   131	export interface FirstTouchTraceEntry {
   132	  readonly tick: number;
   133	  readonly gid: number;
   134	  /** True when this body was the pending pass's intended target. */
   135	  readonly intendedTarget: boolean;
   136	  readonly relativeSpeed: number;
   137	  readonly pressure: number;
   138	  readonly misalign: number;
   139	  readonly technique: number;
   140	  readonly positioning: number;
   141	  readonly pFail: number;
   142	  readonly clean: boolean;
   143	}
   144	
   145	/** Frozen physical facts from the earlier contact, used by M3's later control attempt. */
   146	export interface FirstTouchContactContext {
   147	  readonly relativeSpeed: number;
   148	  readonly incomingDir: Readonly<V2>;
   149	}
   150	
   151	/**
   152	 * Roll the first touch for a player about to control a moving ball. Returns
   153	 * true if the touch is clean (caller gives them the ball). A failed touch
   154	 * knocks the ball loose ahead of the receiver — anyone can pounce on it.
   155	 * Keepers are exempt (they catch); slow balls are trivially trapped.
   156	 */
   157	export function attemptFirstTouch(
   158	  match: Match,
   159	  p: Player,
   160	  contact?: FirstTouchContactContext,
   161	): boolean {
   162	  const ball = match.ball;
   163	  // A dropping ball is harder to kill than a rolled one (Phase 28): the
   164	  // vertical speed counts toward touch difficulty. Ground balls: vz = 0.
   165	  const speed = contact?.relativeSpeed ?? (len(ball.vel) + Math.abs(ball.vz) * 0.6);
   166	  if (p.role === 'GK' || speed <= 6) return true;
   167	  const hSpeed = Math.max(len(ball.vel), 1e-6);
   168	  const inx = contact?.incomingDir.x ?? ball.vel.x / hSpeed;
   169	  const iny = contact?.incomingDir.y ?? ball.vel.y / hSpeed;
   170	  // Ball arriving at the face = 0, arriving from behind the body = 1.
   171	  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;
   172	  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
   173	  let pFail = touchFailChance(
   174	    speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning, match.edsTouchCost,
   175	  );
   176	  // Re-collecting your OWN pushed touch (Phase 36): the ball rolls away
   177	  // from the body, which reads as a blind-side reception to the misalign
   178	  // term — but he watched it leave his own boot. Priced well down, not
   179	  // free: overhit knock-and-runs still get away.
   180	  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;
   181	  const clean = !match.rng.chance(pFail);
   182	  // EDS E1a instrument: log the adjudication with the exact terms the roll used.
   183	  // The roll has already happened; this branch cannot influence it, and it is
   184	  // inert unless the trace flag was explicitly enabled.
   185	  if (match.traceFirstTouch) {
   186	    match.firstTouchTrace.push({
   187	      tick: match.simTick,
   188	      gid: p.gid,
   189	      intendedTarget: match.pendingPass !== null
   190	        && match.pendingPass.targetGid === p.gid
   191	        && match.pendingPass.side === p.side,
   192	      relativeSpeed: speed,
   193	      pressure,
   194	      misalign,
   195	      technique: p.attrs.dribbling,
   196	      positioning: p.attrs.positioning,
   197	      pFail,
   198	      clean,
   199	    });
   200	  }
   201	  if (clean) return true;
   202	
   203	  match.teams[p.side].stats.miscontrols++;
   204	  match.stat(p.gid).miscontrols++;
   205	  ball.lastTouch = p; // a heavy touch out of play concedes the restart
   206	  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));
   207	  ball.vz = 0; // the touch kills any remaining flight — the ball drops
   208	  p.kickCooldown = 0.5; // off balance — can't instantly regather
   209	  return false;
   210	}
   211	
   212	/**
   213	 * Offside judgment, frozen at kick time (Phase 29): is `target` in an
   214	 * offside position right now, as `passer` strikes the ball? Opponent half
   215	 * only; the line is the second-last defender counting the keeper, or the
   216	 * ball (the passer) if deeper; level is onside (0.2m epsilon).
   217	 */
   218	function offsideAtKick(match: Match, passer: Player, target: Player): boolean {
   219	  const team = match.teams[passer.side];
   220	  const tx = team.localX(target.pos.x);
   250	    offside,
   251	    offsideSpot: offside ? v2(target.pos.x, target.pos.y) : null,
   252	    bounce,
   253	  };
   254	}
   255	
   256	/**
   257	 * One-touch penalty (Phase 31.9, 一脚出球): a pass struck inside the
   258	 * receiver's first-touch window (set at a pressured reception, consumed by
   259	 * any kick) sprays more — technique discounts it: tech 0.95 ≈ ×1.2, tech
   260	 * 0.5 ≈ ×1.6, tech 0.1 ≈ ×2.0. Multiplies aim noise (and loft range error).
   261	 */
   262	function oneTouchMul(p: Player): number {
   263	  return p.firstTouchWindow > 0 ? 1.15 + (1 - p.attrs.dribbling) * 0.9 : 1;
   264	}
   265	
   266	/** xG-like chance quality: distance falloff · central angle · pressure. */
   267	export function shotQuality(match: Match, p: Player): number {
   268	  const team = match.teams[p.side];
   269	  const goal = team.oppGoal();
   270	  const d = dist(p.pos, goal);
   271	  const central = 1 - clamp01(Math.abs(p.pos.y) / HALF_W) * 0.5;
   272	  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);
   273	  return clamp(0.85 * Math.exp(-d / 10) * central * (1 - pressure * 0.3), 0.01, 0.8);
   274	}
   275	
   276	/**
   277	 * The ground BENDER (Phase 71, the curve trilogy's last piece — user ask
   278	 * 弧线直塞): when a defender pinches the passing lane, a technical passer
   279	 * curls the ball AROUND his leg — the bulge leans away from the pincher
   280	 * and the arc comes back to the designed receiving point. Compensation is
   281	 * exact for grass decay (spin bleeds at 1.5/s, so the total rotation is
   282	 * ω(1−e^{−1.5T})/1.5 — half of it rotated off the launch keeps the chord
   283	 * endpoint honest). Nobody in the lane = no spin: the straight ball stays
   284	 * the default, and interceptors/deflectors meet the ARC per frame, so the
   285	 * bender beats exactly the leg it was played around. Returns the spin.
   286	 */
   287	function groundBend(
   288	  passer: Player, to: V2, opponents: Player[], d: number,
   289	): number {
   290	  const from = passer.pos;
   291	  const chord = norm(sub(to, from));
   292	  let pinch: Player | null = null;
   293	  let pinchPerp = 1.3; // a leg within reach of the straight lane
   294	  for (const o of opponents) {
   295	    if (o.sentOff) continue;
   296	    const ox = o.pos.x - from.x;
   297	    const oy = o.pos.y - from.y;
   298	    const along = ox * chord.x + oy * chord.y;
   299	    if (along < 2 || along > d - 2) continue; // passer's feet / receiver's trap
   300	    const perp = Math.abs(ox * chord.y - oy * chord.x);
   301	    if (perp < pinchPerp) {
   302	      pinchPerp = perp;
   303	      pinch = o;
   304	    }
   305	  }
   306	  if (!pinch) return 0;
   307	  // Magnitude scales with how TIGHT the pinch is — a leg 1.2m off the
   308	  // chord needs a lean, not a banana (the first cut bent every through
   309	  // ball at full whip: the last defender always stands near that chord,
   310	  // so high lines were being beaten for free — press-23's measured block
   311	  // height collapsed onto low-32's and the formations contract inverted).
   312	  const tightness = clamp(1.4 - pinchPerp, 0.3, 1);
   313	  // FLAT whip (the passing-scaled first cut inverted the skill gradient:
   314	  // better passers took BIGGER bends and paid the deviation) — the bend
   315	  // needed to clear a leg is geometry, the same for everyone; technique's
   316	  // edge lives in the weight error below.
   317	  const mag = 0.45 * tightness;
   318	  const cross = chord.x * (pinch.pos.y - from.y) - chord.y * (pinch.pos.x - from.x);
   319	  return (Math.sign(cross) || 1) * mag;
   320	}
   321	
   322	/** Kick a ground ball with bend: launch rotated half the DECAYED total
   323	 * rotation so the arc's endpoint sits where the straight aim pointed. */
   324	function bentKick(match: Match, p: Player, dir: V2, speed: number, spin: number, d: number): void {
   325	  if (spin === 0) {
   326	    match.kickBall(p, dir, speed);
   327	    return;
   328	  }
   329	  const T = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / speed, 0.85)) / BALL_FRICTION_K;
   330	  const totalRot = (spin * (1 - Math.exp(-1.5 * T))) / 1.5;
   331	  // The bender's PRICE: a curled ball is harder to weight — extra launch
   332	  // noise grows with the whip and shrinks with technique. Free bending
   333	  // farmed the offside line (see groundBend's tightness note).
   334	  const weightErr = match.rng.gaussian() * Math.abs(spin) * 0.2 * (1.35 - p.attrs.passing);
   335	  match.kickBall(p, rotate(dir, -totalRot * 0.5 + weightErr), speed);
   336	  match.ball.spin = spin;
   337	}
   338	
   339	/**
   340	 * C1-A (docs/world-model/PASS-POWER-SLICE.md §8): what the passer actually
   341	 * strikes, given what he MEANT. Weighting a ball away from its natural pace is
   342	 * a technique act, so the error grows with the reach and shrinks with passing.
   343	 * At an intended 1.0 this is exactly 1.0 and consumes no RNG — the reason the
   344	 * fingerprint gate can prove the plumbing inert.
   345	 */
   346	function executedPassPower(match: Match, passer: Player, intended: number): number {
   347	  if (intended === 1) return 1;
   348	  const error = match.rng.gaussian()
   349	    * Math.abs(intended - 1) * PASS_POWER_NOISE_K * (1.35 - passer.attrs.passing);
   350	  return clamp(intended + error, PASS_POWER_EXECUTED_MIN, PASS_POWER_EXECUTED_MAX);
   351	}
   352	
   353	export function performPass(
   354	  match: Match, passer: Player, mate: Player, offsideExempt = false, powerChoice = 1,
   355	): void {
   356	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   357	  const team = match.teams[passer.side];
   358	  const opp = match.teams[1 - passer.side];
   359	
   360	  // Playing across/against the body (Phase 27) takes pace off the ball —
   361	  // known up front, so the lead and the kick agree on the effective speed.
   362	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   363	  const orientation = orientationPowerMul(misalign, passer.attrs.passing);
   364	  // Intended weight (C1-A) composes with the orientation loss. The lead uses
   365	  // the INTENDED power and the strike uses the EXECUTED one: a passer knows
   366	  // which way his body is turned, but not that he is about to overhit.
   367	  const intended = clamp(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX);
   368	  const powerMul = orientation * intended;
   369	  const executedMul = orientation * executedPassPower(match, passer, intended);
   370	
   371	  // Lead the receiver by a fraction of the expected flight time.
   372	  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
   373	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   374	  const d = dist(passer.pos, lead);
   375	  // d·0.55+7.5 → d·0.6+8.2 (31.6, user call 传球力度): zip beats the
   376	  // in-flight interceptors (completion 64→68%) — the receiving cost is
   377	  // priced by touchFailChance and stays mild.
   378	  const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;
   379	
   380	  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
   381	  // technical passer tighten them; kicks against the body spray more.
   382	  const pressure = pressureAt(passer.pos, opp.players);
   383	  const aim = norm(sub(lead, passer.pos));
   384	  const noise =
   385	    match.rng.gaussian() *
   386	    (0.02 + pressure * 0.07 + d * 0.0015) *
   387	    (1.15 - team.genome.passBias * 0.3) *
   388	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   389	    (1.25 - passer.attrs.passing * 0.5) *
   390	    oneTouchMul(passer) *
   391	    orientationNoiseMul(misalign, passer.attrs.passing);
   392	  const dir = rotate(aim, noise);
   393	
   394	  const oneTouch = passer.firstTouchWindow > 0;
   395	  // Circulation stays STRAIGHT — deliberately (Phase 70/71): the bender on
   396	  // ordinary short passes defeated exactly the lane-jumping that IS the
   397	  // pressing game, and the zonal press-23 block's measured height collapsed
   398	  // onto low-32's (the formations contract inverted; isolation-probed —
   399	  // through-ball and aerial curves alone leave it intact). Curl lives where
   400	  // football actually spends it: through balls, switches, crosses, shots.
   401	  match.lastPassKind = { kind: 'pass', t: match.simTime };
   402	  match.kickBall(passer, dir, speed);
   403	  team.stats.passes++;
   404	  if (oneTouch) team.stats.oneTouch++;
   405	  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   406	  registerPass(match, passer, mate, offsideExempt);
   407	
   408	  // 2过1 (Phase 34): a short pass played UNDER PRESSURE licenses the passer
   409	  // to burst past his marker for the return — the "go" half of the
   410	  // give-and-go. Sides that play at speed (tempo + passBias) look for it;
   411	  // slow ones take the touch and keep shape. Not from the defensive third
   412	  // (a wall pass at your own box is how counters are born).
   413	  // Window 2.3s: the round trip is ~0.7s out + the wall's touch + ~0.7s
   414	  // back — a 1.15s license expired before any return could arrive (probed).
   415	  // Attacking half only: granted from build-up, the flip bonus turned the
   416	  // midfield into a wall-pass ping-pong that ate 0.3 goals/match (probed
   417	  // against the same calibrate seeds) — the one-two is a PENETRATION device.
   418	  // The gene score is scaled by the franchise's evolved wallPassW (Phase 45)
   419	  // before the gate — appetite for the one-two is style, not a constant.
   420	  if (
   421	    passer.role !== 'GK' &&
   422	    d < 15 &&
   423	    pressure > 0.2 &&
   424	    passer.stamina > 0.3 &&
   425	    team.localX(passer.pos.x) > 0 &&
   426	    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
   427	  ) {
   428	    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };
   429	  }
   430	}
   431	
   432	/**
   433	 * Through ball (Phase 19): hit harder and led much further than a feet pass —
   434	 * into the space the runner is attacking, not to where they stand. Riskier by
   435	 * construction (longer flight, bigger lead), which is exactly the trade
   436	 * riskTolerance gates in the carrier's scoring. `lofted` (Phase 28) chips it
   437	 * over the defensive line instead — slower to arrive and harder to take down,
   438	 * but nothing on the ground can cut it out.
   439	 */
   440	export function performThroughBall(
   441	  match: Match, passer: Player, runner: Player, lofted = false, offsideExempt = false,
   442	): void {
   443	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   444	  const team = match.teams[passer.side];
   445	  const opp = match.teams[1 - passer.side];
   446	  const oneTouch = passer.firstTouchWindow > 0; // read before any kick consumes it
   447	
   448	  // Same body-orientation contract as performPass: effective speed known
   449	  // up front so the projected meeting point stays honest.
   450	  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
   451	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   452	
   453	  // Meet the run, not the hover (Phase 29): a runner held at the offside
   454	  // line has ~zero velocity — the delivery projects the burst they make the
   455	  // moment this kick releases the hold, instead of dropping at their feet.
   456	  const oppPlayers = match.teams[1 - passer.side].players;
   457	  if (lofted) {
   458	    const flight0 = clamp(0.55 + dist(passer.pos, runner.pos) * 0.045, 0.8, 2.0);
   459	    const lead = runBurstPoint(runner, team, oppPlayers, flight0 * 0.85);
   460	    // The dink bends away from the recovering defender (Phase 70).
   461	    const swing = aerialSwing(passer, passer.pos, lead, oppPlayers);
   462	    loftKick(match, passer, lead, 0.55, 0.045, 0.8, 2.0, 1.0, swing);
   463	    team.stats.longBalls++; // a chip is a lofted long ball too
   464	  } else {
   465	    const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
   466	    // Lead FURTHER since Phase 30 (flight ×1.25, pace cap 21→24): with a
   467	    // sixth defender recovering, a ball met AT the line gets the runner
   468	    // caught before the shot — the delivery must land deep enough that the
   469	    // 17 through balls/match turn back into 1v1s (the high-xG chances the
   470	    // 30.x structures had erased: 0.38/match → 0.08 before this).
   471	    const lead = runBurstPoint(runner, team, oppPlayers, flight * 1.25);
   472	    const d = dist(passer.pos, lead);
   473	    // A touch softer since Phase 29: the ball is played into SPACE for a
   474	    // runner arriving at a sprint — friction kills it into the path, and a
   475	    // pace the runner can actually take down is what converts timed runs.
   476	    const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;
   477	
   478	    const pressure = pressureAt(passer.pos, opp.players);
   479	    const aim = norm(sub(lead, passer.pos));
   480	    const noise =
   481	      match.rng.gaussian() *
   482	      (0.025 + pressure * 0.07 + d * 0.0017) *
   483	      (1.15 - team.genome.passBias * 0.3) *
   484	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   485	      (1.25 - passer.attrs.passing * 0.5) *
   486	      oneTouchMul(passer) *
   487	      orientationNoiseMul(misalign, passer.attrs.passing);
   488	    const dir = rotate(aim, noise);
   489	
   490	    // The bent through ball (Phase 71) — around the last defender's leg.
   491	    bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);
   492	  }
   493	  team.stats.passes++;
   494	  team.stats.throughBalls++;
   495	  if (oneTouch) team.stats.oneTouch++;
   496	  if (team.localX(runner.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   497	  registerPass(match, passer, runner, offsideExempt);
   498	}
   499	
   500	/* ------------------------------------------------------------------ */
   501	/* The aerial game (Phase 28)                                          */
   502	/* ------------------------------------------------------------------ */
   503	
   504	/**
   505	 * Loft a ball to land at `target`: flight time grows with distance
   506	 * (tBase + m·tPerM, clamped), horizontal speed = distance/time, and the
   507	 * vertical launch is whatever brings it back down exactly at landing
   508	 * (airborne balls fly friction-free, so the projectile math is exact).
   509	 * Accuracy: direction noise like a ground pass plus a RANGE error — long
   510	 * deliveries drift short/long; technique and passBias tame both.
   511	 */
   512	function loftKick(
   513	  match: Match, p: Player, target: V2,
   514	  tBase: number, tPerM: number, tMin: number, tMax: number, noiseMul: number,
   515	  spin = 0,
   516	): void {
   517	  const team = match.teams[p.side];
   518	  const opp = match.teams[1 - p.side];
   519	  const aimDir = norm(sub(target, p.pos));
   520	  const misalign = kickMisalignment(p, aimDir);
   500	/* ------------------------------------------------------------------ */
   501	/* The aerial game (Phase 28)                                          */
   502	/* ------------------------------------------------------------------ */
   503	
   504	/**
   505	 * Loft a ball to land at `target`: flight time grows with distance
   506	 * (tBase + m·tPerM, clamped), horizontal speed = distance/time, and the
   507	 * vertical launch is whatever brings it back down exactly at landing
   508	 * (airborne balls fly friction-free, so the projectile math is exact).
   509	 * Accuracy: direction noise like a ground pass plus a RANGE error — long
   510	 * deliveries drift short/long; technique and passBias tame both.
   511	 */
   512	function loftKick(
   513	  match: Match, p: Player, target: V2,
   514	  tBase: number, tPerM: number, tMin: number, tMax: number, noiseMul: number,
   515	  spin = 0,
   516	): void {
   517	  const team = match.teams[p.side];
   518	  const opp = match.teams[1 - p.side];
   519	  const aimDir = norm(sub(target, p.pos));
   520	  const misalign = kickMisalignment(p, aimDir);
   521	  const d = dist(p.pos, target);
   522	  const pressure = pressureAt(p.pos, opp.players);
   523	  const noise =
   524	    match.rng.gaussian() *
   525	    (0.03 + pressure * 0.05 + d * 0.0011) * noiseMul *
   526	    (1.15 - team.genome.passBias * 0.3) *
   527	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   528	    (1.3 - p.attrs.passing * 0.55) *
   529	    oneTouchMul(p) *
   530	    orientationNoiseMul(misalign, p.attrs.passing);
   531	  const dir = rotate(aimDir, noise);
   532	  // Range error + orientation power loss both shorten/stretch the delivery.
   533	  let dEff = d * orientationPowerMul(misalign, p.attrs.passing);
   534	  dEff *= 1 + match.rng.gaussian() * (0.02 + d * 0.0008) * (1.25 - p.attrs.passing * 0.5) * oneTouchMul(p);
   535	  dEff = Math.max(dEff, 3);
   536	  const T = clamp(tBase + dEff * tPerM, tMin, tMax);
   537	  // Magnus pre-compensation (Phase 37): launch rotated −spin·T/2 so the
   538	  // ARC's chord still points where the aim did — the designed landing
   539	  // point (and the whole 31.9 corner chain) is invariant; only the path
   540	  // between bends. ballLanding() projects the same closed form.
   541	  match.lastPassKind = { kind: 'through', t: match.simTime };
   542	  match.kickBall(p, spin === 0 ? dir : rotate(dir, -spin * T * 0.5), dEff / T, (GRAVITY * T) / 2);
   543	  match.ball.spin = spin;
   544	}
   545	
   546	/**
   547	 * Cross (Phase 28): whip a lofted ball from wide toward a target arriving in
   548	 * the box, pulled a quarter of the way toward goal so deliveries drop into
   549	 * the danger area rather than at a standing man's feet. Resolved in the air:
   550	 * keeper claim or header contest (tryAerial), not a ground reception.
   551	 */
   552	export function performCross(
   553	  match: Match, crosser: Player, target: Player, offsideExempt = false, pull = 0.18, at?: V2,
   554	): void {
   555	  if (match.ball.owner !== crosser || crosser.kickCooldown > 0) return;
   556	  const team = match.teams[crosser.side];
   557	  const flight0 = clamp(0.5 + dist(crosser.pos, at ?? target.pos) * 0.038, 0.7, 1.7);
   558	  // Corner routines pass `at` (Phase 31.9): the delivery attacks the
   559	  // routine's KEY ZONE and the crasher times his burst onto it. Open play
   560	  // (Phase 63) leads a MEETABLE fraction of the target's run, capped —
   561	  // the full vel·flight lead was the same 31.9 bug in open-play clothes
   562	  // (constants.ts has the anatomy numbers).
   563	  let leadX = target.vel.x * flight0 * CROSS_LEAD_FRAC;
   564	  let leadY = target.vel.y * flight0 * CROSS_LEAD_FRAC;
   565	  const leadLen = Math.hypot(leadX, leadY);
   566	  if (leadLen > CROSS_LEAD_MAX) {
   567	    leadX *= CROSS_LEAD_MAX / leadLen;
   568	    leadY *= CROSS_LEAD_MAX / leadLen;
   569	  }
   570	  const arrive = at ?? v2(target.pos.x + leadX, target.pos.y + leadY);
   571	  const goal = team.oppGoal();
   572	  // Pulled toward goal, but NOT into the six-yard area — a delivery that
   573	  // drops on the keeper's claim radius is a delivery wasted (28.1: this
   574	  // pull was 0.25 and fed the keeper instead of the penalty spot).
   575	  // Corner routines pass a SMALLER pull (Phase 31): the marker stands
   576	  // goal-side of the crasher by construction, so pulling the drop toward
   577	  // goal handed every corner duel to the defence (probed: attackers won
   578	  // 0.00 duels/corner) — the routine delivery meets the RUN instead.
   579	  const spot = v2(arrive.x + (goal.x - arrive.x) * pull, arrive.y + (goal.y - arrive.y) * pull);
   580	  const oneTouch = crosser.firstTouchWindow > 0;
   581	  // The whipped delivery (Phase 37): crosses and corners curl TOWARD the
   582	  // goal — the inswinger. Sign from the chord×to-goal cross product;
   583	  // technique whips harder. (The landing point is pre-compensated in
   584	  // loftKick, so the 31.9 corner chain sees the same scatter.)
   585	  const chord = norm(sub(spot, crosser.pos));
   586	  const toGoal = norm(sub(goal, crosser.pos));
   587	  const swing = Math.sign(chord.x * toGoal.y - chord.y * toGoal.x) || 1;
   588	  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
   589	  loftKick(match, crosser, spot, 0.5, 0.038, 0.7, 1.7, 1.1, spin);
   590	  team.stats.passes++;
   591	  team.stats.crosses++;
   592	  if (oneTouch) team.stats.oneTouch++;
   593	  if (team.localX(target.pos.x) - team.localX(crosser.pos.x) > 2) team.stats.passesForward++;
   594	  registerPass(match, crosser, target, offsideExempt);
   595	}
   596	
   597	/**
   598	 * Keeper throw (Phase 28.3): an ACCURATE hand distribution — a gentle ARC
   599	 * (Phase-120, feel: overarm throw, not a flat drive), half the noise of a
   600	 * kicked ball, 8–30m. What a keeper who held the ball does instead of hoofing
   601	 * 50/50s: find a body, hit the body.
   602	 */
   603	export function performKeeperThrow(match: Match, gk: Player, mate: Player): void {
   604	  if (match.ball.owner !== gk || gk.kickCooldown > 0) return;
   605	  const team = match.teams[gk.side];
   606	  const flight0 = clamp(0.62 + dist(gk.pos, mate.pos) * 0.03, 0.9, 1.5);
   607	  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
   608	  // Phase-120 (feel): raise the ARC of the hand throw — the flat-quick tune
   609	  // read like a drive, not a thrown ball. Higher T floor (0.7→0.9) lofts it to
   610	  // a visible ~1.1m peak at short range; still accurate (noiseMul 0.45).
   611	  loftKick(match, gk, lead, 0.62, 0.03, 0.9, 1.5, 0.45);
   612	  team.stats.passes++;
   613	  if (team.localX(mate.pos.x) - team.localX(gk.pos.x) > 2) team.stats.passesForward++;
   614	  registerPass(match, gk, mate, false); // a hand throw is regular play — offside applies
   615	}
   616	
   617	/**
   618	 * Cutback (Phase 31): the byline pull-back — a HARD, flat ball driven from
   619	 * the touchline zone to the edge-of-box arc, where the licensed arriver
   620	 * meets it first-time (giveBall's snap-decision window). Faster than a
   621	 * regular pass at the same range so it beats the box defenders' recovery
   622	 * slide across; registered like any pass (interceptions, assists and the
   623	 * offside judgment all apply — the arriver runs from DEEP, so flags are
   624	 * rare by construction).
   625	 */
   626	export function performCutback(match: Match, passer: Player, mate: Player): void {
   627	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   628	  const team = match.teams[passer.side];
   629	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   630	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   631	  const flight = dist(passer.pos, mate.pos) / (18 * powerMul);
   632	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   633	  const d = dist(passer.pos, lead);
   634	  const speed = clamp(d * 0.6 + 10, 11, 23) * powerMul;
   635	  const pressure = pressureAt(passer.pos, match.teams[1 - passer.side].players);
   636	  const aim = norm(sub(lead, passer.pos));
   637	  const noise =
   638	    match.rng.gaussian() *
   639	    (0.02 + pressure * 0.06 + d * 0.0012) *
   640	    (1.15 - team.genome.passBias * 0.3) *
   641	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   642	    (1.25 - passer.attrs.passing * 0.5) *
   643	    oneTouchMul(passer) *
   644	    orientationNoiseMul(misalign, passer.attrs.passing);
   645	  const oneTouch = passer.firstTouchWindow > 0;
   646	  match.lastPassKind = { kind: 'cross', t: match.simTime };
   647	  match.kickBall(passer, rotate(aim, noise), speed);
   648	  team.stats.passes++;
   649	  team.stats.cutbacks++;
   650	  if (oneTouch) team.stats.oneTouch++;
   651	  match.lastCutback = { side: passer.side, t: match.simTime };
   652	  registerPass(match, passer, mate, false);
   653	}
   654	
   655	/**
   656	 * Lofted switch (Phase 28): the big diagonal — a 25m+ ball over the press to
   657	 * a receiver in space. What the 32m ground-pass penalty used to suppress.
   658	 */
   659	/**
   660	 * The curled DELIVERY's swing (Phase 70, user ask 弧线长传 — the second of
   661	 * the curve trilogy): a lofted ball bends its BULGE away from the nearest
   662	 * threat to the landing zone (the recovering defender chases a flight that
   663	 * leans out of his line), or a gentle outswing toward the flank when the
   664	 * drop is clean. Technique whips harder; the landing point itself is
   665	 * pre-compensated inside loftKick, so completion changes only through the
   666	 * geometry of who can meet the ARC — never through a moved drop.
   667	 */
   668	function aerialSwing(passer: Player, from: V2, landing: V2, opponents: Player[]): number {
   669	  const chord = norm(sub(landing, from));
   670	  let threat: Player | null = null;
   671	  let best = 8; // only a defender who can actually work the drop zone
   672	  for (const o of opponents) {
   673	    if (o.sentOff) continue;
   674	    const d = dist(o.pos, landing);
   675	    if (d < best) {
   676	      best = d;
   677	      threat = o;
   678	    }
   679	  }
   680	  const mag = 0.12 + passer.attrs.passing * 0.18;
   681	  if (threat) {
   682	    const cross = chord.x * (threat.pos.y - from.y) - chord.y * (threat.pos.x - from.x);
   683	    return (Math.sign(cross) || 1) * mag;
   684	  }
   685	  // Clean drop: swing away from the pitch's center line — the outswinger
   686	  // a wide receiver runs onto without breaking stride.
   687	  const midY = (from.y + landing.y) / 2;
   688	  const cross = chord.x * (0 - midY);
   689	  return (Math.sign(cross) || 1) * mag * 0.6;
   690	}
   691	
   692	export function performLoftedPass(match: Match, passer: Player, mate: Player, offsideExempt = false): void {
   693	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   694	  const team = match.teams[passer.side];
   695	  // Driven, not floated (Phase 30.5): at the old 0.8+d·0.045 a 30m switch
   696	  // hung 2.15s — any defender within ~12m of the drop reached it, and the
   697	  // receiving WINGER is the worst header in the game (AERIAL_ROLE 0.06 vs
   698	  // DF 0.3), so the diagonal completed ~20% and wing play starved. A flat
   699	  // 1.4–1.6s ball reaches the flank before the fullback does.
   700	  const flight0 = clamp(0.55 + dist(passer.pos, mate.pos) * 0.033, 1.1, 2.1);
   701	  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
   702	  const oneTouch = passer.firstTouchWindow > 0;
   703	  // The switch swings (Phase 70) — bulge away from whoever works the drop.
   704	  const swing = aerialSwing(passer, passer.pos, lead, match.teams[1 - passer.side].players);
   705	  loftKick(match, passer, lead, 0.55, 0.033, 1.1, 2.1, 0.9, swing);
   706	  team.stats.passes++;
   707	  team.stats.longBalls++;
   708	  if (oneTouch) team.stats.oneTouch++;
   709	  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   710	  registerPass(match, passer, mate, offsideExempt);
   711	}
   712	
   713	/** Aerial presence by role: centre-backs and strikers attack the ball. */
   714	const AERIAL_ROLE: Record<Role, number> = { GK: 0, DF: 0.3, MF: 0.14, WG: 0.06, ST: 0.26 };
   715	
   716	/**
   717	 * How good this player is in the air — the same formula the header contest
   718	 * rolls against, so cross targeting (PlayerBrain) and duel resolution agree.
   719	 *
   720	 * Phase 63 (the target-man gradient): STRENGTH owns the air. The old
   721	 * weights (defending 0.3, strength 0.1) made the classic big-man
   722	 * investment invisible — +0.45 strength bought +0.045 of duel score
   723	 * against a 0-0.45 random roll, and the probe showed a budget-neutral
   724	 * target man changing NOTHING about cross outcomes. Now strength 0.3 /
   725	 * defending 0.15: the aerial payoff phase-47 assigned to strength is
   726	 * real, and the COUNTER is evolvable the same way — a back line that
   727	 * buys strength out-jumps the big man (the tall-CB answer).
   728	 */
   729	export function aerialSense(p: Player): number {
   730	  return AERIAL_ROLE[p.role] + p.attrs.defending * 0.15 + p.attrs.strength * 0.3;
   731	}
   732	
   733	/**
   734	 * Resolve a ball flying through the contest band (Phase 28). Keepers first —
   735	 * hands beat heads: a keeper under the ball claims it (crowd pressure and
   736	 * reflexes decide). Then outfielders within reach jump: position + role
   737	 * aerial sense + attributes pick the winner, who heads for goal in the
   738	 * opponent box, powers it clear near their own, or cushions it to a teammate.
   739	 * `order` alternates per step (the same fairness contract as tryCapture).
   740	 */
   740	 */
   741	export function tryAerial(match: Match, order: Player[]): void {
   742	  const ball = match.ball;
   743	  if (ball.z < HEADER_MIN_HEIGHT || ball.z > GK_CLAIM_HEIGHT) return;
   744	
   745	  for (const gk of order) {
   746	    if (gk.role !== 'GK' || gk.sentOff || gk.stunTimer > 0 || gk.tackleCooldown > 0) continue;
   747	    // Hands only inside the box (Phase 28.5): a keeper stranded off his line
   748	    // can't PLUCK a high ball out of the air — outside his area the delivery
   749	    // is an outfield header contest, not a keeper claim.
   750	    if (!match.inPenaltyBox(gk.pos, gk.side)) continue;
   751	    const dx = gk.pos.x - ball.pos.x;
   752	    const dy = gk.pos.y - ball.pos.y;
   753	    if (dx * dx + dy * dy > 1.9 * 1.9) continue;
   754	    // Committed to the jump either way (pickup stays free). 0.5 → 0.9 in
   755	    // 29.1: a ball hanging/bouncing through the claim band re-rolled every
   756	    // half second, and the restarting dive pose read as convulsions.
   757	    gk.tackleCooldown = 0.9;
   758	    gk.saveAnimTimer = 0.6;
   759	    const crowd = pressureAt(gk.pos, match.teams[1 - gk.side].players);
   760	    const pClaim = clamp(0.62 + (gk.attrs.reflexes - 0.5) * 0.5 - crowd * 0.3, 0.2, 0.9);
   761	    if (match.rng.chance(pClaim)) {
   762	      // A claimed opponent shot is a save (a dropping header, typically).
   763	      const shot = match.pendingShot;
   764	      if (shot && !shot.resolved && shot.side !== gk.side) {
   765	        shot.resolved = true;
   766	        match.teams[shot.side].stats.shotsOnTarget++;
   767	        match.teams[gk.side].stats.saves++;
   768	        match.stat(gk.gid).saves++;
   769	        match.markShotOutcome('saved');
   770	      }
   771	      match.pushEvent('save', gk.side, `${gk.name} claims the high ball`);
   772	      match.giveBall(gk);
   773	      return;
   774	    }
   775	    // Flapped at it under pressure — the ball sails on.
   776	  }
   777	
   778	  if (ball.z > HEADER_MAX_HEIGHT) return;
   779	  // Chest / thigh trap (Phase 28.6): before anyone HEADS a hanging ball,
   780	  // an unpressured man under a dropping ball in the lower band takes it DOWN.
   781	  if (tryChestTrap(match, order)) return;
   782	  let winner: Player | null = null;
   783	  let best = -Infinity;
   784	  const contenders: Player[] = [];
   785	  for (const p of order) {
   786	    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
   787	    const dx = p.pos.x - ball.pos.x;
   788	    const dy = p.pos.y - ball.pos.y;
   789	    const d2 = dx * dx + dy * dy;
   790	    if (d2 > HEADER_RADIUS * HEADER_RADIUS) continue;
   791	    contenders.push(p);
   792	    // Position + aerial sense + a seeded jump-timing roll pick the winner.
   793	    // Attackers meeting a delivery in the opponent box arrive with momentum
   794	    // — a real edge over the defender jumping from a standing start. Raised
   795	    // 0.12 → 0.2 in 29.1: un-marking the corner taker freed a defender to
   796	    // mark in the box (3v3, everyone tracked) and corner threat collapsed
   797	    // to 3.5% — the crasher's running jump is what beats a set marker.
   798	    // 0.2 → 0.3 (Phase 31): with routine deliveries finally meeting the
   799	  // crashers' runs, the running jump's edge over the goal-side marker's
   800	  // standing start is what wins the zone — at 0.2 the position term still
   801	  // handed every corner duel to the defence.
   802	  const attacking = match.teams[p.side].localX(ball.pos.x) > HALF_L - BOX_DEPTH ? 0.3 : 0;
   803	    const s =
   804	      aerialSense(p) +
   805	      attacking +
   806	      (1 - Math.sqrt(d2) / HEADER_RADIUS) * 0.35 +
   807	      match.rng.range(0, 0.45);
   808	    if (s > best) {
   809	      best = s;
   810	      winner = p;
   811	    }
   812	  }
   813	  if (!winner) return;
   814	  // Let it DROP for the chest trap (Phase 28.6): a player with TIME and SPACE
   815	  // shouldn't nod a dropping midfield ball on — that header is exactly what
   816	  // kept the aerial rally alive. If nobody's contesting (no opponent within
   817	  // header reach), the ball is falling (vz < 0), and it's neither a header
   818	  // chance on goal nor a clearance near our own, decline the header and let
   819	  // it come down — `tryChestTrap` takes it to the feet a few steps later (or
   820	  // it just lands and is controlled on the ground). Attacking free headers
   821	  // and defensive clears are UNCHANGED (they fall outside the gate).
   822	  const wteam = match.teams[winner.side];
   823	  const dOppGoal = dist(ball.pos, wteam.oppGoal());
   824	  const nearOwnGoal = dist(ball.pos, wteam.ownGoal()) < 20;
   825	  let oppNear = false;
   826	  for (const o of match.teams[1 - winner.side].players) {
   827	    if (o.sentOff || o.role === 'GK') continue;
   828	    if (dist(o.pos, ball.pos) < HEADER_RADIUS) { oppNear = true; break; }
   829	  }
   830	  if (!oppNear && ball.vz < 0 && dOppGoal >= 16.5 && !nearOwnGoal) return;
   831	  // Committed to the header — every contender jumped (brief recovery so a
   832	  // ball hanging through the band doesn't re-roll into a convulsion).
   833	  for (const p of contenders) {
   834	    p.kickCooldown = 0.45;
   835	    p.headerAnimTimer = 0.55;
   836	  }
   837	  // Offside (Phase 29): the flagged target meeting the delivery in the air
   838	  // IS the touch that completes the offence — whistle instead of the header.
   839	  const pass = match.pendingPass;
   840	  if (pass && pass.offside && winner.side === pass.side && winner.gid === pass.targetGid) {
   841	    match.pendingPass = null;
   842	    match.callOffside(winner, pass.offsideSpot ?? winner.pos);
   843	    return;
   844	  }
   845	  headBall(match, winner);
   846	}
   847	
   848	/** What the header winner does with it — shot, clearance or knockdown. */
   849	function headBall(match: Match, p: Player): void {
   850	  const ball = match.ball;
   851	  const team = match.teams[p.side];
   852	  ball.lastTouch = p;
   853	  team.stats.headersWon++;
   854	
   855	  // Delivery bookkeeping: a teammate's cross/loft met in the air is a
   856	  // completed pass (assist credit if the header goes in); an opponent's
   857	  // delivery headed away is an interception.
   858	  const pass = match.pendingPass;
   859	  if (pass && pass.side === p.side && pass.passerGid !== p.gid) {
   860	    team.stats.passesCompleted++;
   861	    match.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, t: match.simTime };
   862	  } else if (pass && pass.side !== p.side) {
   863	    team.stats.interceptions++;
   864	    match.stat(p.gid).recoveries++;
   865	  }
   866	  match.pendingPass = null;
   867	
   868	  const dGoal = dist(ball.pos, team.oppGoal());
   869	  if (dGoal < 16.5) {
   870	    performHeaderShot(match, p);
   871	    return;
   872	  }
   873	  if (dist(ball.pos, team.ownGoal()) < 20) {
   874	    // Defensive header: power it away from goal, high and wide.
   875	    const dir = norm(v2(team.attackDir, match.rng.range(-0.9, 0.9)));
   876	    ball.vel = scale(dir, match.rng.range(11, 15));
   877	    ball.vz = match.rng.range(3.5, 5.2);
   878	    team.stats.clearances++;
   879	    return;
   880	  }
   881	  // Knockdown: cushion it toward the best-placed teammate in range.
   882	  let mate: Player | null = null;
   883	  let bestS = -Infinity;
   884	  for (const q of team.players) {
   885	    if (q === p || q.sentOff) continue;
   886	    const d = dist(q.pos, ball.pos);
   887	    if (d > 16) continue;
   888	    const s = opennessOf(q, match.teams[1 - p.side].players) - (d / 16) * 0.4;
   889	    if (s > bestS) {
   890	      bestS = s;
   891	      mate = q;
   892	    }
   893	  }
   894	  const to = mate ? norm(sub(mate.pos, ball.pos)) : v2(team.attackDir, 0);
   895	  ball.vel = scale(to, match.rng.range(7, 9.5));
   896	  ball.vz = 0.8; // nodded down — drops quickly to feet
   897	}
   898	
   899	/**
   900	 * Chest / thigh trap (Phase 28.6, user report "球在两个球员之间弹来弹去 —
   901	 * 是不是没有胸部停球"). A ball DROPPING through the lower header band that no
   902	 * opponent is contesting can be CUSHIONED to the feet instead of headed — the
   903	 * missing alternative that turned every hanging ball into an endless nod-it-
   904	 * back-and-forth rally. Only the man almost directly under it, only a
   905	 * descending/apex ball below chest height, only when it is NOT a live aerial
   906	 * duel (an opponent within header reach = head it, as before). The take-down
   907	 * is priced by first-touch (same `touchFailChance` surface as a ground
   908	 * reception, +a small aerial malus) and SPILLS under pressure — a failed trap
   909	 * drops the ball loose, so the scramble is preserved, just not perpetual.
   910	 * Returns true if the trap fired (clean OR spilled); the caller then skips the
   911	 * header contest for this step.
   912	 */
   913	function tryChestTrap(match: Match, order: Player[]): boolean {
   914	  const ball = match.ball;
   915	  if (ball.z > CHEST_TRAP_MAX_HEIGHT || ball.vz > CHEST_TRAP_MAX_VZ) return false;
   916	  // The man almost directly under it (tighter than a header reach).
   917	  let trapper: Player | null = null;
   918	  let bestD = CHEST_TRAP_RADIUS;
   919	  for (const p of order) {
   920	    if (p.role === 'GK' || p.sentOff || p.stunTimer > 0 || p.kickCooldown > 0) continue;
   921	    const d = dist(p.pos, ball.pos);
   922	    if (d < bestD) {
   923	      bestD = d;
   924	      trapper = p;
   925	    }
   926	  }
   927	  if (!trapper) return false;
   928	  // A contested ball is an aerial DUEL — let it be headed (unchanged).
   929	  for (const o of match.teams[1 - trapper.side].players) {
   930	    if (o.sentOff || o.role === 'GK') continue;
   931	    if (dist(o.pos, ball.pos) < HEADER_RADIUS) return false;
   932	  }
   933	  // Price the cushion: drop speed (vz counts, like a ground first touch),
   934	  // pressure, and taking it on the blind side; technique tames all of it.
   935	  const hSpeed = Math.max(len(ball.vel), 1e-6);
   936	  const inx = ball.vel.x / hSpeed;
   937	  const iny = ball.vel.y / hSpeed;
   938	  const speed = len(ball.vel) + Math.abs(ball.vz) * 0.6;
   939	  const misalign = (1 + (inx * trapper.heading.x + iny * trapper.heading.y)) / 2;
   940	  const pressure = pressureAt(trapper.pos, match.teams[1 - trapper.side].players);
   941	  const pFail = clamp(
   942	    touchFailChance(
   943	      speed, pressure, misalign, trapper.attrs.dribbling, trapper.attrs.positioning,
   944	      match.edsTouchCost,
   945	    ) + 0.05, 0, 0.5,
   946	  );
   947	  trapper.kickCooldown = 0.3; // committed to the touch either way
   948	  if (!match.rng.chance(pFail)) {
   949	    match.giveBall(trapper); // clean take-down: giveBall snaps it dead to feet + does pass/offside bookkeeping
   950	    return true;
   951	  }
   952	  // Spilled the cushion — a heavy touch knocks it loose and low (the scramble).
   953	  match.teams[trapper.side].stats.miscontrols++;
   954	  match.stat(trapper.gid).miscontrols++;
   955	  ball.lastTouch = trapper;
   956	  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.9, 0.9)), match.rng.range(3, 5.5));
   957	  ball.vz = 0; // knocked down — it drops
   958	  return true;
   959	}
   960	
   961	/**
   962	 * Headed shot: meeting a cross in the box. Converts worse than feet (tight
   963	 * distance falloff, capped quality) and sprays more, but arrives from the
   964	 * exact spot defenders least want — the same pendingShot machinery as
   965	 * performShot, difficulty frozen at contact.
   966	 */
   967	function performHeaderShot(match: Match, shooter: Player): void {
   968	  match.endPassMove(shooter.side); // the header ends the move (Phase 33)
   969	  const team = match.teams[shooter.side];
   970	  const opp = match.teams[1 - shooter.side];
   971	  const gk = opp.goalkeeper;
   972	  const ball = match.ball;
   973	
   974	  const goalX = team.attackDir * HALF_L;
   975	  const aimMargin = 1.6 - shooter.attrs.finishing * 0.8;
   976	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
   977	  const target = v2(goalX, aimY);
   978	  const d = dist(ball.pos, target);
   979	  const pressure = pressureAt(shooter.pos, opp.players);
   980	  const central = 1 - clamp01(Math.abs(ball.pos.y) / HALF_W) * 0.5;
   981	  const q = clamp(0.5 * Math.exp(-d / 8.5) * central * (1 - pressure * 0.25), 0.01, 0.45);
   982	
   983	  const aim = norm(sub(target, ball.pos));
   984	  const spread = (0.05 + d * 0.004 + pressure * 0.04) * (1.35 - shooter.attrs.finishing * 0.65);
   985	  const dir = rotate(aim, match.rng.gaussian() * spread);
   986	  ball.vel = scale(dir, 15 + shooter.attrs.finishing * 4);
   987	  ball.vz = -1.2; // headed down toward the goal
   988	
   989	  team.stats.shots++;
   990	  team.stats.xg += q;
   991	  match.stat(shooter.gid).shots++;
   992	
   993	  const difficulty = diveDifficulty(ball.pos, dir, gk, opp);
   994	  const lp = match.lastCompletedPass;
   995	  const assistGid =
   996	    lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3 ? lp.passerGid : null;
   997	
   998	  match.markShotOutcome('miss');
   999	  match.shotLog.push({
  1000	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
  1001	    blockers: laneBlockers(ball.pos, team.oppGoal(), opp.players),
  1002	    channel: match.goalChannelFor(shooter),
  1003	  });
  1004	  match.pendingShot = {
  1005	    side: shooter.side,
  1006	    shooterGid: shooter.gid,
  1007	    closeIn: clamp01((7 - dist(gk.pos, shooter.pos)) / 7),
  1008	    coverage: angleCoverage(gk, shooter.pos, team.oppGoal()),
  1009	    xg: q,
  1010	    t: match.simTime,
  1011	    resolved: false,
  1012	    logIndex: match.shotLog.length - 1,
  1013	    difficulty,
  1014	    assistGid,
  1015	  };
  1016	  if (assistGid !== null) {
  1017	    team.stats.keyPasses++;
  1018	    const passer = match.allPlayers[assistGid];
  1019	    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the delivery`);
  1020	  }
  1021	  match.pushEvent('shot', shooter.side, `${shooter.name} heads it at goal! (xG ${q.toFixed(2)})`);
  1022	}
  1023	
  1024	/** Attacked-goal center for a shooter's team (helper for 1v1 detection). */
  1025	function goalCenterFor(team: { oppGoal(): V2 }): V2 {
  1026	  return team.oppGoal();
  1027	}
  1028	
  1029	/**
  1030	 * The CHIP (Phase 69): loft the finish over a keeper who has left his

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '340,660p'; nl -ba src/sim/mechanics.ts | sed -n '1030,1410p'; nl -ba src/sim/mechanics.ts | sed -n '1400,1710p'; nl -ba src/sim/mechanics.ts | sed -n '1710,2020p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
   340	 * C1-A (docs/world-model/PASS-POWER-SLICE.md §8): what the passer actually
   341	 * strikes, given what he MEANT. Weighting a ball away from its natural pace is
   342	 * a technique act, so the error grows with the reach and shrinks with passing.
   343	 * At an intended 1.0 this is exactly 1.0 and consumes no RNG — the reason the
   344	 * fingerprint gate can prove the plumbing inert.
   345	 */
   346	function executedPassPower(match: Match, passer: Player, intended: number): number {
   347	  if (intended === 1) return 1;
   348	  const error = match.rng.gaussian()
   349	    * Math.abs(intended - 1) * PASS_POWER_NOISE_K * (1.35 - passer.attrs.passing);
   350	  return clamp(intended + error, PASS_POWER_EXECUTED_MIN, PASS_POWER_EXECUTED_MAX);
   351	}
   352	
   353	export function performPass(
   354	  match: Match, passer: Player, mate: Player, offsideExempt = false, powerChoice = 1,
   355	): void {
   356	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   357	  const team = match.teams[passer.side];
   358	  const opp = match.teams[1 - passer.side];
   359	
   360	  // Playing across/against the body (Phase 27) takes pace off the ball —
   361	  // known up front, so the lead and the kick agree on the effective speed.
   362	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   363	  const orientation = orientationPowerMul(misalign, passer.attrs.passing);
   364	  // Intended weight (C1-A) composes with the orientation loss. The lead uses
   365	  // the INTENDED power and the strike uses the EXECUTED one: a passer knows
   366	  // which way his body is turned, but not that he is about to overhit.
   367	  const intended = clamp(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX);
   368	  const powerMul = orientation * intended;
   369	  const executedMul = orientation * executedPassPower(match, passer, intended);
   370	
   371	  // Lead the receiver by a fraction of the expected flight time.
   372	  const flight = dist(passer.pos, mate.pos) / (16 * powerMul);
   373	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   374	  const d = dist(passer.pos, lead);
   375	  // d·0.55+7.5 → d·0.6+8.2 (31.6, user call 传球力度): zip beats the
   376	  // in-flight interceptors (completion 64→68%) — the receiving cost is
   377	  // priced by touchFailChance and stays mild.
   378	  const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;
   379	
   380	  // Accuracy: pressure sprays passes; a drilled team (passBias) and a
   381	  // technical passer tighten them; kicks against the body spray more.
   382	  const pressure = pressureAt(passer.pos, opp.players);
   383	  const aim = norm(sub(lead, passer.pos));
   384	  const noise =
   385	    match.rng.gaussian() *
   386	    (0.02 + pressure * 0.07 + d * 0.0015) *
   387	    (1.15 - team.genome.passBias * 0.3) *
   388	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   389	    (1.25 - passer.attrs.passing * 0.5) *
   390	    oneTouchMul(passer) *
   391	    orientationNoiseMul(misalign, passer.attrs.passing);
   392	  const dir = rotate(aim, noise);
   393	
   394	  const oneTouch = passer.firstTouchWindow > 0;
   395	  // Circulation stays STRAIGHT — deliberately (Phase 70/71): the bender on
   396	  // ordinary short passes defeated exactly the lane-jumping that IS the
   397	  // pressing game, and the zonal press-23 block's measured height collapsed
   398	  // onto low-32's (the formations contract inverted; isolation-probed —
   399	  // through-ball and aerial curves alone leave it intact). Curl lives where
   400	  // football actually spends it: through balls, switches, crosses, shots.
   401	  match.lastPassKind = { kind: 'pass', t: match.simTime };
   402	  match.kickBall(passer, dir, speed);
   403	  team.stats.passes++;
   404	  if (oneTouch) team.stats.oneTouch++;
   405	  if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   406	  registerPass(match, passer, mate, offsideExempt);
   407	
   408	  // 2过1 (Phase 34): a short pass played UNDER PRESSURE licenses the passer
   409	  // to burst past his marker for the return — the "go" half of the
   410	  // give-and-go. Sides that play at speed (tempo + passBias) look for it;
   411	  // slow ones take the touch and keep shape. Not from the defensive third
   412	  // (a wall pass at your own box is how counters are born).
   413	  // Window 2.3s: the round trip is ~0.7s out + the wall's touch + ~0.7s
   414	  // back — a 1.15s license expired before any return could arrive (probed).
   415	  // Attacking half only: granted from build-up, the flip bonus turned the
   416	  // midfield into a wall-pass ping-pong that ate 0.3 goals/match (probed
   417	  // against the same calibrate seeds) — the one-two is a PENETRATION device.
   418	  // The gene score is scaled by the franchise's evolved wallPassW (Phase 45)
   419	  // before the gate — appetite for the one-two is style, not a constant.
   420	  if (
   421	    passer.role !== 'GK' &&
   422	    d < 15 &&
   423	    pressure > 0.2 &&
   424	    passer.stamina > 0.3 &&
   425	    team.localX(passer.pos.x) > 0 &&
   426	    ((team.genome.tempo + team.genome.passBias) / 2) * team.policies[passer.index].wallPassW > 0.35
   427	  ) {
   428	    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };
   429	  }
   430	}
   431	
   432	/**
   433	 * Through ball (Phase 19): hit harder and led much further than a feet pass —
   434	 * into the space the runner is attacking, not to where they stand. Riskier by
   435	 * construction (longer flight, bigger lead), which is exactly the trade
   436	 * riskTolerance gates in the carrier's scoring. `lofted` (Phase 28) chips it
   437	 * over the defensive line instead — slower to arrive and harder to take down,
   438	 * but nothing on the ground can cut it out.
   439	 */
   440	export function performThroughBall(
   441	  match: Match, passer: Player, runner: Player, lofted = false, offsideExempt = false,
   442	): void {
   443	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   444	  const team = match.teams[passer.side];
   445	  const opp = match.teams[1 - passer.side];
   446	  const oneTouch = passer.firstTouchWindow > 0; // read before any kick consumes it
   447	
   448	  // Same body-orientation contract as performPass: effective speed known
   449	  // up front so the projected meeting point stays honest.
   450	  const misalign = kickMisalignment(passer, norm(sub(runner.pos, passer.pos)));
   451	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   452	
   453	  // Meet the run, not the hover (Phase 29): a runner held at the offside
   454	  // line has ~zero velocity — the delivery projects the burst they make the
   455	  // moment this kick releases the hold, instead of dropping at their feet.
   456	  const oppPlayers = match.teams[1 - passer.side].players;
   457	  if (lofted) {
   458	    const flight0 = clamp(0.55 + dist(passer.pos, runner.pos) * 0.045, 0.8, 2.0);
   459	    const lead = runBurstPoint(runner, team, oppPlayers, flight0 * 0.85);
   460	    // The dink bends away from the recovering defender (Phase 70).
   461	    const swing = aerialSwing(passer, passer.pos, lead, oppPlayers);
   462	    loftKick(match, passer, lead, 0.55, 0.045, 0.8, 2.0, 1.0, swing);
   463	    team.stats.longBalls++; // a chip is a lofted long ball too
   464	  } else {
   465	    const flight = dist(passer.pos, runner.pos) / (18 * powerMul);
   466	    // Lead FURTHER since Phase 30 (flight ×1.25, pace cap 21→24): with a
   467	    // sixth defender recovering, a ball met AT the line gets the runner
   468	    // caught before the shot — the delivery must land deep enough that the
   469	    // 17 through balls/match turn back into 1v1s (the high-xG chances the
   470	    // 30.x structures had erased: 0.38/match → 0.08 before this).
   471	    const lead = runBurstPoint(runner, team, oppPlayers, flight * 1.25);
   472	    const d = dist(passer.pos, lead);
   473	    // A touch softer since Phase 29: the ball is played into SPACE for a
   474	    // runner arriving at a sprint — friction kills it into the path, and a
   475	    // pace the runner can actually take down is what converts timed runs.
   476	    const speed = clamp(d * 0.6 + 9, 10, 24) * powerMul;
   477	
   478	    const pressure = pressureAt(passer.pos, opp.players);
   479	    const aim = norm(sub(lead, passer.pos));
   480	    const noise =
   481	      match.rng.gaussian() *
   482	      (0.025 + pressure * 0.07 + d * 0.0017) *
   483	      (1.15 - team.genome.passBias * 0.3) *
   484	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   485	      (1.25 - passer.attrs.passing * 0.5) *
   486	      oneTouchMul(passer) *
   487	      orientationNoiseMul(misalign, passer.attrs.passing);
   488	    const dir = rotate(aim, noise);
   489	
   490	    // The bent through ball (Phase 71) — around the last defender's leg.
   491	    bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);
   492	  }
   493	  team.stats.passes++;
   494	  team.stats.throughBalls++;
   495	  if (oneTouch) team.stats.oneTouch++;
   496	  if (team.localX(runner.pos.x) - team.localX(passer.pos.x) > 2) team.stats.passesForward++;
   497	  registerPass(match, passer, runner, offsideExempt);
   498	}
   499	
   500	/* ------------------------------------------------------------------ */
   501	/* The aerial game (Phase 28)                                          */
   502	/* ------------------------------------------------------------------ */
   503	
   504	/**
   505	 * Loft a ball to land at `target`: flight time grows with distance
   506	 * (tBase + m·tPerM, clamped), horizontal speed = distance/time, and the
   507	 * vertical launch is whatever brings it back down exactly at landing
   508	 * (airborne balls fly friction-free, so the projectile math is exact).
   509	 * Accuracy: direction noise like a ground pass plus a RANGE error — long
   510	 * deliveries drift short/long; technique and passBias tame both.
   511	 */
   512	function loftKick(
   513	  match: Match, p: Player, target: V2,
   514	  tBase: number, tPerM: number, tMin: number, tMax: number, noiseMul: number,
   515	  spin = 0,
   516	): void {
   517	  const team = match.teams[p.side];
   518	  const opp = match.teams[1 - p.side];
   519	  const aimDir = norm(sub(target, p.pos));
   520	  const misalign = kickMisalignment(p, aimDir);
   521	  const d = dist(p.pos, target);
   522	  const pressure = pressureAt(p.pos, opp.players);
   523	  const noise =
   524	    match.rng.gaussian() *
   525	    (0.03 + pressure * 0.05 + d * 0.0011) * noiseMul *
   526	    (1.15 - team.genome.passBias * 0.3) *
   527	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   528	    (1.3 - p.attrs.passing * 0.55) *
   529	    oneTouchMul(p) *
   530	    orientationNoiseMul(misalign, p.attrs.passing);
   531	  const dir = rotate(aimDir, noise);
   532	  // Range error + orientation power loss both shorten/stretch the delivery.
   533	  let dEff = d * orientationPowerMul(misalign, p.attrs.passing);
   534	  dEff *= 1 + match.rng.gaussian() * (0.02 + d * 0.0008) * (1.25 - p.attrs.passing * 0.5) * oneTouchMul(p);
   535	  dEff = Math.max(dEff, 3);
   536	  const T = clamp(tBase + dEff * tPerM, tMin, tMax);
   537	  // Magnus pre-compensation (Phase 37): launch rotated −spin·T/2 so the
   538	  // ARC's chord still points where the aim did — the designed landing
   539	  // point (and the whole 31.9 corner chain) is invariant; only the path
   540	  // between bends. ballLanding() projects the same closed form.
   541	  match.lastPassKind = { kind: 'through', t: match.simTime };
   542	  match.kickBall(p, spin === 0 ? dir : rotate(dir, -spin * T * 0.5), dEff / T, (GRAVITY * T) / 2);
   543	  match.ball.spin = spin;
   544	}
   545	
   546	/**
   547	 * Cross (Phase 28): whip a lofted ball from wide toward a target arriving in
   548	 * the box, pulled a quarter of the way toward goal so deliveries drop into
   549	 * the danger area rather than at a standing man's feet. Resolved in the air:
   550	 * keeper claim or header contest (tryAerial), not a ground reception.
   551	 */
   552	export function performCross(
   553	  match: Match, crosser: Player, target: Player, offsideExempt = false, pull = 0.18, at?: V2,
   554	): void {
   555	  if (match.ball.owner !== crosser || crosser.kickCooldown > 0) return;
   556	  const team = match.teams[crosser.side];
   557	  const flight0 = clamp(0.5 + dist(crosser.pos, at ?? target.pos) * 0.038, 0.7, 1.7);
   558	  // Corner routines pass `at` (Phase 31.9): the delivery attacks the
   559	  // routine's KEY ZONE and the crasher times his burst onto it. Open play
   560	  // (Phase 63) leads a MEETABLE fraction of the target's run, capped —
   561	  // the full vel·flight lead was the same 31.9 bug in open-play clothes
   562	  // (constants.ts has the anatomy numbers).
   563	  let leadX = target.vel.x * flight0 * CROSS_LEAD_FRAC;
   564	  let leadY = target.vel.y * flight0 * CROSS_LEAD_FRAC;
   565	  const leadLen = Math.hypot(leadX, leadY);
   566	  if (leadLen > CROSS_LEAD_MAX) {
   567	    leadX *= CROSS_LEAD_MAX / leadLen;
   568	    leadY *= CROSS_LEAD_MAX / leadLen;
   569	  }
   570	  const arrive = at ?? v2(target.pos.x + leadX, target.pos.y + leadY);
   571	  const goal = team.oppGoal();
   572	  // Pulled toward goal, but NOT into the six-yard area — a delivery that
   573	  // drops on the keeper's claim radius is a delivery wasted (28.1: this
   574	  // pull was 0.25 and fed the keeper instead of the penalty spot).
   575	  // Corner routines pass a SMALLER pull (Phase 31): the marker stands
   576	  // goal-side of the crasher by construction, so pulling the drop toward
   577	  // goal handed every corner duel to the defence (probed: attackers won
   578	  // 0.00 duels/corner) — the routine delivery meets the RUN instead.
   579	  const spot = v2(arrive.x + (goal.x - arrive.x) * pull, arrive.y + (goal.y - arrive.y) * pull);
   580	  const oneTouch = crosser.firstTouchWindow > 0;
   581	  // The whipped delivery (Phase 37): crosses and corners curl TOWARD the
   582	  // goal — the inswinger. Sign from the chord×to-goal cross product;
   583	  // technique whips harder. (The landing point is pre-compensated in
   584	  // loftKick, so the 31.9 corner chain sees the same scatter.)
   585	  const chord = norm(sub(spot, crosser.pos));
   586	  const toGoal = norm(sub(goal, crosser.pos));
   587	  const swing = Math.sign(chord.x * toGoal.y - chord.y * toGoal.x) || 1;
   588	  const spin = swing * (0.28 + crosser.attrs.passing * 0.3);
   589	  loftKick(match, crosser, spot, 0.5, 0.038, 0.7, 1.7, 1.1, spin);
   590	  team.stats.passes++;
   591	  team.stats.crosses++;
   592	  if (oneTouch) team.stats.oneTouch++;
   593	  if (team.localX(target.pos.x) - team.localX(crosser.pos.x) > 2) team.stats.passesForward++;
   594	  registerPass(match, crosser, target, offsideExempt);
   595	}
   596	
   597	/**
   598	 * Keeper throw (Phase 28.3): an ACCURATE hand distribution — a gentle ARC
   599	 * (Phase-120, feel: overarm throw, not a flat drive), half the noise of a
   600	 * kicked ball, 8–30m. What a keeper who held the ball does instead of hoofing
   601	 * 50/50s: find a body, hit the body.
   602	 */
   603	export function performKeeperThrow(match: Match, gk: Player, mate: Player): void {
   604	  if (match.ball.owner !== gk || gk.kickCooldown > 0) return;
   605	  const team = match.teams[gk.side];
   606	  const flight0 = clamp(0.62 + dist(gk.pos, mate.pos) * 0.03, 0.9, 1.5);
   607	  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));
   608	  // Phase-120 (feel): raise the ARC of the hand throw — the flat-quick tune
   609	  // read like a drive, not a thrown ball. Higher T floor (0.7→0.9) lofts it to
   610	  // a visible ~1.1m peak at short range; still accurate (noiseMul 0.45).
   611	  loftKick(match, gk, lead, 0.62, 0.03, 0.9, 1.5, 0.45);
   612	  team.stats.passes++;
   613	  if (team.localX(mate.pos.x) - team.localX(gk.pos.x) > 2) team.stats.passesForward++;
   614	  registerPass(match, gk, mate, false); // a hand throw is regular play — offside applies
   615	}
   616	
   617	/**
   618	 * Cutback (Phase 31): the byline pull-back — a HARD, flat ball driven from
   619	 * the touchline zone to the edge-of-box arc, where the licensed arriver
   620	 * meets it first-time (giveBall's snap-decision window). Faster than a
   621	 * regular pass at the same range so it beats the box defenders' recovery
   622	 * slide across; registered like any pass (interceptions, assists and the
   623	 * offside judgment all apply — the arriver runs from DEEP, so flags are
   624	 * rare by construction).
   625	 */
   626	export function performCutback(match: Match, passer: Player, mate: Player): void {
   627	  if (match.ball.owner !== passer || passer.kickCooldown > 0) return;
   628	  const team = match.teams[passer.side];
   629	  const misalign = kickMisalignment(passer, norm(sub(mate.pos, passer.pos)));
   630	  const powerMul = orientationPowerMul(misalign, passer.attrs.passing);
   631	  const flight = dist(passer.pos, mate.pos) / (18 * powerMul);
   632	  const lead = add(mate.pos, scale(mate.vel, flight * 0.8));
   633	  const d = dist(passer.pos, lead);
   634	  const speed = clamp(d * 0.6 + 10, 11, 23) * powerMul;
   635	  const pressure = pressureAt(passer.pos, match.teams[1 - passer.side].players);
   636	  const aim = norm(sub(lead, passer.pos));
   637	  const noise =
   638	    match.rng.gaussian() *
   639	    (0.02 + pressure * 0.06 + d * 0.0012) *
   640	    (1.15 - team.genome.passBias * 0.3) *
   641	    (1 - team.confidence * 0.12) * // morale sharpens/frays the pass (Phase 111)
   642	    (1.25 - passer.attrs.passing * 0.5) *
   643	    oneTouchMul(passer) *
   644	    orientationNoiseMul(misalign, passer.attrs.passing);
   645	  const oneTouch = passer.firstTouchWindow > 0;
   646	  match.lastPassKind = { kind: 'cross', t: match.simTime };
   647	  match.kickBall(passer, rotate(aim, noise), speed);
   648	  team.stats.passes++;
   649	  team.stats.cutbacks++;
   650	  if (oneTouch) team.stats.oneTouch++;
   651	  match.lastCutback = { side: passer.side, t: match.simTime };
   652	  registerPass(match, passer, mate, false);
   653	}
   654	
   655	/**
   656	 * Lofted switch (Phase 28): the big diagonal — a 25m+ ball over the press to
   657	 * a receiver in space. What the 32m ground-pass penalty used to suppress.
   658	 */
   659	/**
   660	 * The curled DELIVERY's swing (Phase 70, user ask 弧线长传 — the second of
  1030	 * The CHIP (Phase 69): loft the finish over a keeper who has left his
  1031	 * line, dropping under the bar behind him. Mirrors the free kick's
  1032	 * two-constraint closed form — z ≥ the claim ceiling as it passes the
  1033	 * keeper (tryKeeperSave cannot touch a ball above GK_CLAIM_HEIGHT),
  1034	 * z = the drawn arrival height as it crosses the line (over the bar =
  1035	 * the classic overhit, exactly like the FK's blaze-over). The counters
  1036	 * are all emergent: a keeper IN THE FACE smothers the launch while it's
  1037	 * still low (the save window before z clears 2.55), a keeper at home
  1038	 * leaves no gap (feasibility fails), a floaty lob is rejected up front
  1039	 * (hang time returns the line), and a short chip drops into the claim.
  1040	 * Returns true when the chip replaced the ground strike.
  1041	 */
  1042	function tryChip(match: Match, shooter: Player, qGround: number, pressure: number): boolean {
  1043	  const team = match.teams[shooter.side];
  1044	  const opp = match.teams[1 - shooter.side];
  1045	  const gk = opp.goalkeeper;
  1046	  if (gk.sentOff) return false;
  1047	  const goalX = team.attackDir * HALF_L;
  1048	  // Cross the line off-center, away from the keeper's side — the open half.
  1049	  // Geometry from the SHOOTER (the ground path's convention): the carried
  1050	  // ball rides at his feet and kickBall re-bases the release at his body.
  1051	  const target = v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * 1.4);
  1052	  const d = dist(shooter.pos, target);
  1053	  if (d < 7 || d > 30) return false; // not a toe-poke, not a halfway lob
  1054	  const aim = norm(sub(target, shooter.pos));
  1055	  const toGkX = gk.pos.x - shooter.pos.x;
  1056	  const toGkY = gk.pos.y - shooter.pos.y;
  1057	  const along = toGkX * aim.x + toGkY * aim.y;
  1058	  // The keeper must sit ON the chord with real space BEHIND him; a keeper
  1059	  // in the shooter's face is the smother's problem, not the solver's.
  1060	  if (along < 2.5 || along > d - 5.5) return false;
  1061	  if (Math.abs(toGkX * aim.y - toGkY * aim.x) > 3.5) return false;
  1062	  // CAUGHT OUT, not merely positioned (first probe: the routine line at
  1063	  // KA 0.5 fired 3.9 chips/match — a lob festival): the chip demands the
  1064	  // keeper genuinely stranded, ≥7.5m off his goal center. The sweeper's
  1065	  // rushes and the high line (keeperAggression) are what put him there.
  1066	  const og = opp.ownGoal();
  1067	  if (Math.hypot(gk.pos.x - og.x, gk.pos.y - og.y) < 7.5) return false;
  1068	
  1069	  // Feasibility + price at the NOMINAL arrival (rng only spends on a
  1070	  // taken chip, so untaken chips leave every other shot's stream alone).
  1071	  const a = clamp(along / d, 0.15, 0.8);
  1072	  const clearK = GK_CLAIM_HEIGHT + 0.25;
  1073	  const t2Nom = (clearK - a * 1.3) / ((GRAVITY / 2) * a * (1 - a));
  1074	  if (t2Nom <= 0) return false;
  1075	  const tNom = Math.sqrt(t2Nom);
  1076	  if (tNom > 1.45) return false; // hang time hands the keeper his line back
  1077	  const qChip = clamp(
  1078	    0.36 - (tNom - 0.9) * 0.22 - pressure * 0.12 + shooter.attrs.finishing * 0.06,
  1079	    0.03, 0.38,
  1080	  );
  1081	  // Clearly better or nothing — a marginal chip is a shot wasted on
  1082	  // spectacle (the volume gate that keeps the lob an EVENT).
  1083	  if (qChip < qGround * 1.2 + 0.03) return false;
  1084	
  1085	  // Execute: the arrival height draws high (over-bar = the honest miss),
  1086	  // finishing narrows the draw AND the lateral spray.
  1087	  const zg = 0.8 + match.rng.range(0, 1.9 - shooter.attrs.finishing * 0.5);
  1088	  const T = Math.sqrt(Math.max(0.4, (clearK - a * zg) / ((GRAVITY / 2) * a * (1 - a))));
  1089	  const vz = (zg + (GRAVITY / 2) * T * T) / T;
  1090	  const misalign = kickMisalignment(shooter, aim);
  1091	  const spread =
  1092	    (0.03 + d * 0.0012) * (1.3 - shooter.attrs.finishing * 0.6) *
  1093	    orientationNoiseMul(misalign, shooter.attrs.dribbling);
  1094	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1095	  match.lastPassKind = { kind: 'lofted', t: match.simTime };
  1096	  match.kickBall(shooter, dir, d / T, vz);
  1097	
  1098	  team.stats.shots++;
  1099	  team.stats.xg += qChip;
  1100	  match.stat(shooter.gid).shots++;
  1101	  const lp = match.lastCompletedPass;
  1102	  const assistGid =
  1103	    lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3 ? lp.passerGid : null;
  1104	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1105	  match.shotLog.push({
  1106	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: qChip, outcome: 'pending',
  1107	    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  1108	    chip: true,
  1109	    channel: match.goalChannelFor(shooter),
  1110	  });
  1111	  match.pendingShot = {
  1112	    side: shooter.side,
  1113	    shooterGid: shooter.gid,
  1114	    xg: qChip,
  1115	    t: match.simTime,
  1116	    resolved: false,
  1117	    logIndex: match.shotLog.length - 1,
  1118	    // A keeper scrambling BACK under a dropping ball saves awkwardly.
  1119	    difficulty: 0.8,
  1120	    assistGid,
  1121	  };
  1122	  match.pushEvent('shot', shooter.side, `${shooter.name} chips the keeper! (xG ${qChip.toFixed(2)})`);
  1123	  return true;
  1124	}
  1125	
  1126	export function performShot(match: Match, shooter: Player): void {
  1127	  if (match.ball.owner !== shooter || shooter.kickCooldown > 0) return;
  1128	  match.endPassMove(shooter.side); // a strike ends the passing move (Phase 33)
  1129	  const team = match.teams[shooter.side];
  1130	  const opp = match.teams[1 - shooter.side];
  1131	  const gk = opp.goalkeeper;
  1132	
  1133	  // Aim for the corner away from the keeper. Finishing has two channels:
  1134	  // confident finishers aim closer to the post (bigger keeper-evasion, riskier
  1135	  // margin) AND group their shots tighter.
  1136	  const goalX = team.attackDir * HALF_L;
  1137	  // 1.5 → 1.2 in Phase 30.4 (dare the corners), → 1.3 in Phase 31's
  1138	  // retune: with chance volume restored (open runs, cutbacks, routines)
  1139	  // the trade flips back toward failure mode 16a — a slightly safer aim
  1140	  // keeps more strikes on the frame while the keeper still can't reach
  1141	  // the corner.
  1142	  // The clinical trait (Phase 39) shaves another 0.1 off the post —
  1143	  // floored at 0.4 (the base formula's own minimum at finishing 1.0):
  1144	  // an elite finisher who ALSO shaved 0.1 aimed past the optimum and
  1145	  // converted less (caught by the finishing-conversion invariant test).
  1146	  // Finishing slope 0.9 → 0.6 (Phase 47): the eras of churn since 31.5
  1147	  // (36.1 carries, 38 contact, 46 keeper envelope) had pushed the corner
  1148	  // dare past its optimum again — by phase-46 the hi-fin conversion edge
  1149	  // measured +1.3pp ≈ noise and the invariant test finally flipped.
  1150	  // Swept {0.9, 0.75, 0.6, 0.5} at 540 matches: 0.6 restores +2.1pp
  1151	  // (hi 28.9% vs lo 26.8%) — the finisher backs off the post just enough
  1152	  // that the tight grouping cashes.
  1153	  const aimMargin = Math.max(
  1154	    0.4,
  1155	    1.3 - shooter.attrs.finishing * 0.6 - (shooter.traits.includes('clinical') ? 0.1 : 0),
  1156	  );
  1157	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  1158	  const target = v2(goalX, aimY);
  1159	
  1160	  const q = shotQuality(match, shooter);
  1161	  const d = dist(shooter.pos, target);
  1162	  const pressure = pressureAt(shooter.pos, opp.players);
  1163	  // CONTESTED FINISHING (Phase 85, the inflation fix the user chose):
  1164	  // pressureAt is distance-only — a 0.9-defending stopper closing on the
  1165	  // strike degraded it exactly like a statue, so defense had NO evolvable
  1166	  // gradient at the conversion point and late leagues converted 58-77% of
  1167	  // all shots (phase-84 anatomy). The nearest closing OUTFIELDER's quality
  1168	  // now scales the pressure the strike feels: ×1.0 at defending 0.5
  1169	  // (early-gen behavior preserved by construction), ×0.55 vs a statue,
  1170	  // ×1.45 vs a master. The xG model stays blind to defender quality —
  1171	  // like real xG — so evolved defending shows up as UNDER-performance.
  1172	  let contest = pressure;
  1173	  if (pressure > 0) {
  1174	    let bestD = Infinity;
  1175	    let presser: Player | null = null;
  1176	    for (const o of opp.players) {
  1177	      if (o.sentOff || o.role === 'GK') continue;
  1178	      const dd = dist(o.pos, shooter.pos);
  1179	      if (dd < bestD) {
  1180	        bestD = dd;
  1181	        presser = o;
  1182	      }
  1183	    }
  1184	    if (presser) contest = pressure * (0.55 + presser.attrs.defending * 0.9);
  1185	  }
  1186	  // THE CHIP (Phase 69, user ask 挑射/吊射): a keeper OFF HIS LINE can be
  1187	  // beaten over the top — the ecology's first mechanism that PUNISHES
  1188	  // keeperAggression (the sweeper's line height is exactly what opens the
  1189	  // gap behind him). Geometry decides feasibility, the price comparison
  1190	  // decides the attempt; a taken chip replaces this ground strike.
  1191	  if (tryChip(match, shooter, q, pressure)) return;
  1192	  // Composed 1v1 (Phase 28.4): nobody goal-side but the keeper — the shooter
  1193	  // PICKS a spot: tighter to the post, tighter grouping. Without this the
  1194	  // breakaway-finish appetite just fed the keeper from 15m.
  1195	  let oneVone = true;
  1196	  for (const o of opp.players) {
  1197	    if (o.role === 'GK' || o.sentOff) continue;
  1198	    if (dist(o.pos, goalCenterFor(team)) < d - 1) {
  1199	      oneVone = false;
  1200	      break;
  1201	    }
  1202	  }
  1203	  // Composure EARNED (Phase 93): the 28.4 gift was attribute-blind — every
  1204	  // breakaway shooter got the tighter aim + grouping for free, and the
  1205	  // shot-context anatomy measured that pipe at 76-81% of late-gen goals.
  1206	  // Scale the gift by finishing instead: at 0.5 the oneVone branch is a
  1207	  // no-op (a plain shot), a 0.9+ finisher keeps the full old gift
  1208	  // (aim ×0.72, spread ×0.7), and a 0.2 finisher PANICS — alone in front
  1209	  // of goal with nothing to trust, he sprays WIDER than a contested shot.
  1210	  // Composure is now a thing the budget must buy, not a flag.
  1211	  const composure = clamp((shooter.attrs.finishing - 0.5) / 0.4, -0.75, 1);
  1212	  const aimTarget = oneVone
  1213	    ? v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin * (1 - 0.28 * composure)))
  1214	    : target;
  1215	  const aim = norm(sub(aimTarget, shooter.pos));
  1216	  // Long-range and pressured shots spray more; finishers spray less. A shot
  1217	  // snatched against the body's facing (Phase 27) sprays more and loses power.
  1218	  const misalign = kickMisalignment(shooter, aim);
  1219	  // Spread base 0.029 → 0.025 in 29.1, → 0.022 in Phase 30: set defences
  1220	  // (formations) mean almost every shot is a contested one now — tighter
  1221	  // base grouping keeps the on-target share honest without touching the
  1222	  // pressure physics (failure mode 16: aim/spread beat reach/saveP here).
  1223	  const spread =
  1224	    (0.022 + d * 0.0028 + contest * 0.05) *
  1225	    (1.45 - shooter.attrs.finishing * 0.9) *
  1226	    (1 - team.confidence * 0.12) * // the finish rides confidence too (Phase 111)
  1227	    (oneVone ? 1 - 0.3 * composure : 1) *
  1228	    orientationNoiseMul(misalign, shooter.attrs.dribbling);
  1229	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1230	
  1231	  // The placed curler (Phase 37): technique bends the strike around the
  1232	  // dive. Launch pre-compensated by −spin·T/2 so the chord still crosses
  1233	  // the frame where the aim pointed; lateral drift = spin·vx, so the sign
  1234	  // that bends AWAY from the keeper is sign(Δy·dirx).
  1235	  const curl =
  1236	    (Math.sign((aimTarget.y - gk.pos.y) * dir.x) || 1) * (0.1 + shooter.attrs.dribbling * 0.2);
  1237	  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
  1238	  const shotT = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / v0, 0.85)) / BALL_FRICTION_K;
  1239	  match.kickBall(shooter, rotate(dir, -curl * shotT * 0.5), v0);
  1240	  match.ball.spin = curl;
  1241	  team.stats.shots++;
  1242	  team.stats.xg += q;
  1243	  match.stat(shooter.gid).shots++;
  1244	
  1245	  // Dive difficulty, frozen at the moment of the strike (keeper reaction) —
  1246	  // priced on the CHORD, discounted for the bend the dive can't fully read.
  1247	  const difficulty = Math.max(
  1248	    0.25,
  1249	    diveDifficulty(match.ball.pos, dir, gk, opp) * (1 - Math.abs(curl) * 0.12),
  1250	  );
  1251	
  1252	  // Assist credit if this shot scores: the completed pass that set it up.
  1253	  const lpForAssist = match.lastCompletedPass;
  1254	  const assistGid =
  1255	    lpForAssist && lpForAssist.receiverGid === shooter.gid && match.simTime - lpForAssist.t < 3
  1256	      ? lpForAssist.passerGid
  1257	      : null;
  1258	
  1259	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1260	  match.shotLog.push({
  1261	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
  1262	    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  1263	    pressure,
  1264	    oneVone,
  1265	    assist:
  1266	      match.lastCutback && match.lastCutback.side === shooter.side && match.simTime - match.lastCutback.t < 5
  1267	        ? 'cutback'
  1268	        : match.lastPassKind && match.simTime - match.lastPassKind.t < 2.5
  1269	          ? match.lastPassKind.kind
  1270	          : 'none',
  1271	    channel: match.goalChannelFor(shooter),
  1272	  });
  1273	  match.pendingShot = {
  1274	    side: shooter.side,
  1275	    shooterGid: shooter.gid,
  1276	    xg: q,
  1277	    t: match.simTime,
  1278	    resolved: false,
  1279	    logIndex: match.shotLog.length - 1,
  1280	    difficulty,
  1281	    assistGid,
  1282	    closeIn: clamp01((7 - dist(gk.pos, shooter.pos)) / 7),
  1283	    coverage: angleCoverage(gk, shooter.pos, goalCenterFor(team)),
  1284	  };
  1285	
  1286	  // Key pass: shot within 3s of receiving.
  1287	  const lp = match.lastCompletedPass;
  1288	  if (lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3) {
  1289	    team.stats.keyPasses++;
  1290	    const passer = match.allPlayers[lp.passerGid]; // allPlayers is gid-indexed
  1291	    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the key pass`);
  1292	  }
  1293	  match.pushEvent('shot', shooter.side, `${shooter.name} shoots! (xG ${q.toFixed(2)})`);
  1294	}
  1295	
  1296	/**
  1297	 * Direct free kick (Phase 32): the curl over the wall. Closed-form
  1298	 * parabola through TWO constraints — z ≥ 2.6m at the wall line (above the
  1299	 * outfield header band, 2.5m: a wall that can contest the climb eats
  1300	 * every kick, the 31.9 corner-sentry lesson) and a chosen arrival height
  1301	 * under the bar — then the usual shot bookkeeping so saves/goals/xG all
  1302	 * ride the pendingShot machinery.
  1303	 */
  1304	export function performFreeKick(match: Match, taker: Player): void {
  1305	  if (match.ball.owner !== taker || taker.kickCooldown > 0) return;
  1306	  const team = match.teams[taker.side];
  1307	  const opp = match.teams[1 - taker.side];
  1308	  const gk = opp.goalkeeper;
  1309	  const ball = match.ball;
  1310	
  1311	  const goalX = team.attackDir * HALF_L;
  1312	  // Specialists shave the post; timid takers aim well inside it.
  1313	  const aimMargin = 1.05 - taker.attrs.finishing * 0.55;
  1314	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  1315	  const target = v2(goalX, aimY);
  1316	  const d = dist(ball.pos, target);
  1317	
  1318	  // Solve the flight: z(a·T) = 2.6 at the wall (a = wallDist/d) and
  1319	  // z(T) = zg at the goal ⇒ T² = (2.6 − a·zg) / (G/2 · a(1−a)).
  1320	  // The arrival height DRAWS high (up to ~2.75): everything above the bar
  1321	  // is the classic blazed-over-the-wall miss — without it every strike
  1322	  // arrived under the bar by construction and conversion tripled.
  1323	  const zg = 0.85 + match.rng.range(0, 1.9);
  1324	  // The wall's REAL distance from the release point (the taker may stand
  1325	  // up to ~1.3m off the spot and kickBall releases 0.9m ahead — assuming
  1326	  // a spot-kick left the climb at ~2.2m over the heads, inside the header
  1327	  // band, instead of the designed 2.6).
  1328	  let wallD = CORNER_CLEARANCE - 0.9;
  1329	  if (match.fkWall) {
  1330	    const own = v2(team.attackDir * HALF_L, 0);
  1331	    const center = add(match.fkWall.pos, scale(norm(sub(own, match.fkWall.pos)), CORNER_CLEARANCE + 0.15));
  1332	    wallD = dist(ball.pos, center) - 1.4; // release offset + safety margin
  1333	  }
  1334	  // The banana's price (Phase 37): a curled launch leaves the straight
  1335	  // line, and the climb's header-band segment sweeps past the wall's edge
  1336	  // bodies — the solver buys extra clearance per unit of spin (the first
  1337	  // cut at spin ≤0.7 with plain 2.6 put 4/30 walls back in the header
  1338	  // game, the exact 31.9 sentry failure the invariant test pins).
  1339	  const spinMag = 0.25 + taker.attrs.passing * 0.25;
  1340	  const a = clamp(wallD / d, 0.12, 0.6);
  1341	  const wallClear = 2.6 + spinMag * 0.5;
  1342	  const T = clamp(Math.sqrt(Math.max(0.4, (wallClear - a * zg) / ((GRAVITY / 2) * a * (1 - a)))), 0.9, 1.9);
  1343	  const vz = (zg + (GRAVITY / 2) * T * T) / T;
  1344	  const speed = d / T;
  1345	
  1346	  // Placed ball, full run-up: no orientation penalties, tight spread that
  1347	  // finishing tames — the free kick is the specialist's shot.
  1348	  const spread = (0.034 + d * 0.001) * (1.35 - taker.attrs.finishing * 0.7);
  1349	  const aim = norm(sub(target, ball.pos));
  1350	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1351	
  1352	  // Direct FKs convert ~4-8% in the real game — the xG entry says so.
  1353	  const q = clamp(0.09 - (d - 17) * 0.003, 0.02, 0.12);
  1354	
  1355	  // The banana ball (Phase 37): the specialist's strike curls AWAY from
  1356	  // the keeper toward the chosen corner — over the wall on the solver's
  1357	  // flight, bending across the frame. Launch pre-compensated by −spin·T/2
  1358	  // (the chord still crosses at the aim point); the curl prices the dive.
  1359	  // Lateral (y) drift of a spinning ball = spin·vx, so the sign that
  1360	  // drifts from the keeper toward the chosen corner is sign(Δy·vx).
  1361	  const curlSign = Math.sign((target.y - gk.pos.y) * dir.x) || 1;
  1362	  const spin = curlSign * spinMag;
  1363	  const kickPos = v2(ball.pos.x, ball.pos.y);
  1364	  match.kickBall(taker, rotate(dir, -spin * T * 0.5), speed, vz);
  1365	  ball.spin = spin;
  1366	  team.stats.shots++;
  1367	  team.stats.xg += q;
  1368	  match.stat(taker.gid).shots++;
  1369	
  1370	  // The dive prices the CHORD (where the arc actually crosses the frame)
  1371	  // plus the late bend the keeper cannot fully read.
  1372	  const difficulty = Math.max(0.25, diveDifficulty(kickPos, dir, gk, opp) * (1 - Math.abs(spin) * 0.12));
  1373	
  1374	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1375	  match.shotLog.push({
  1376	    t: match.simTime, minute: match.minute(), side: taker.side, xg: q, outcome: 'pending',
  1377	    blockers: 0, // the wall is cleared by construction; blocks don't apply
  1378	    channel: match.goalChannelFor(taker), // the FK stamp lands it as `setpiece`
  1379	  });
  1380	  match.pendingShot = {
  1381	    side: taker.side,
  1382	    shooterGid: taker.gid,
  1383	    xg: q,
  1384	    t: match.simTime,
  1385	    resolved: false,
  1386	    logIndex: match.shotLog.length - 1,
  1387	    difficulty,
  1388	    assistGid: null, // a placed ball has no assist
  1389	    placed: true,
  1390	  };
  1391	  match.pushEvent('shot', taker.side, `${taker.name} bends the free kick! (xG ${q.toFixed(2)})`);
  1392	}
  1393	
  1394	/**
  1395	 * The dribble PUSH (Phase 36, 可见的触球): the carrier knocks the ball
  1396	 * ahead along his heading and chases it. The ball is a free body until he
  1397	 * re-collects (the push-scaled poke window an opponent in
  1398	 * the path plays the BALL in). Push length grows with open field ahead
  1399	 * (knock-and-run down the wing) and wobbles with poor technique; sprint
  1400	 * speed carries into the ball, so close control at walking pace stays
  1401	 * naturally tight.
  1402	 */
  1403	export function performDribbleTouch(match: Match, p: Player): void {
  1404	  const ball = match.ball;
  1405	  if (ball.owner !== p) return;
  1406	  const opp = match.teams[1 - p.side];
  1407	  // Open field ahead: nearest opponent inside a forward cone prices the push.
  1408	  const hx = p.heading.x;
  1409	  const hy = p.heading.y;
  1410	  let aheadD = 14;
  1400	 * speed carries into the ball, so close control at walking pace stays
  1401	 * naturally tight.
  1402	 */
  1403	export function performDribbleTouch(match: Match, p: Player): void {
  1404	  const ball = match.ball;
  1405	  if (ball.owner !== p) return;
  1406	  const opp = match.teams[1 - p.side];
  1407	  // Open field ahead: nearest opponent inside a forward cone prices the push.
  1408	  const hx = p.heading.x;
  1409	  const hy = p.heading.y;
  1410	  let aheadD = 14;
  1411	  for (const o of opp.players) {
  1412	    if (o.sentOff) continue;
  1413	    const dx = o.pos.x - p.pos.x;
  1414	    const dy = o.pos.y - p.pos.y;
  1415	    const along = dx * hx + dy * hy;
  1416	    // The keeper's stopping power starts upfield of his body (Phase 46):
  1417	    // a loose roll entering his rush envelope is collected, full stop —
  1418	    // outfielders must WIN the ball, so they price at body position.
  1419	    const eff = o.role === 'GK' ? along - GK_RUSH_ENVELOPE : along;
  1420	    if (along < 0 || eff > 14) continue;
  1421	    const perp = Math.abs(dx * hy - dy * hx);
  1422	    if (perp > along * 0.7 + 1) continue; // outside the ~70° cone
  1423	    if (eff < aheadD) aheadD = Math.max(eff, 0);
  1424	  }
  1425	  // Carry regimes (36.1): the open cone ahead PRICES the touch — a
  1426	  // stride-length nudge in traffic (一步一带), a real knock into open
  1427	  // grass (爆趟). Technique shortens and steadies both.
  1428	  const open = Math.min(Math.max(aheadD - 2, 0), 9);
  1429	  let push = (TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - p.attrs.dribbling * 0.15);
  1430	  // The line guard (36.1): a knock that would roll into touch is halved —
  1431	  // real wingers shorten the touch at the line (12.9% of pushes rolled
  1432	  // dead/out at the first cut).
  1433	  const rollEst = push; // rolled meters ≈ push m/s over ~1s of decay
  1434	  if (
  1435	    Math.abs(p.pos.y + hy * (rollEst + 2)) > HALF_W - 1 ||
  1436	    Math.abs(p.pos.x + hx * (rollEst + 2)) > HALF_L - 1
  1437	  ) {
  1438	    push *= 0.5;
  1439	  }
  1440	  const vmag = Math.hypot(p.vel.x, p.vel.y);
  1441	  const speed = vmag + Math.max(push, 0.8);
  1442	  // A heavy first touch is a WOBBLY one: direction noise priced by technique.
  1443	  const noise = match.rng.gaussian() * 0.07 * (1.35 - p.attrs.dribbling * 0.7);
  1444	  // Knock it along the direction of TRAVEL, not the instantaneous facing.
  1445	  // `heading` is rate-capped (TURN_RATE) and lags the velocity through a turn,
  1446	  // so aiming at the old facing sent the freed ball off on a line the carrier
  1447	  // was already turning away from — it "flew out" on a spin (play report:
  1448	  // "带球转身,球偶尔会飞出去"). The ball now follows where he is actually
  1449	  // running, so it stays on his path through the turn (gate needs v>2.5 m/s,
  1450	  // so `travel` is always well-defined here; heading is only the slow fallback).
  1451	  const travel = vmag > 0.5 ? v2(p.vel.x / vmag, p.vel.y / vmag) : v2(hx, hy);
  1452	  const dir = rotate(travel, noise);
  1453	  ball.owner = null;
  1454	  ball.lastTouch = p;
  1455	  ball.vel = scale(dir, speed);
  1456	  ball.z = 0;
  1457	  ball.vz = 0;
  1458	  // The regather window follows the push: a knock is a chase, a dribble
  1459	  // touch comes back underfoot within the stride.
  1460	  p.kickCooldown = TOUCH_RECOLLECT_BASE + push * TOUCH_RECOLLECT_PER_PUSH;
  1461	  match.dribbleTouch = { gid: p.gid, until: match.simTime + 1.6 };
  1462	}
  1463	
  1464	export function performClear(match: Match, p: Player): void {
  1465	  if (match.ball.owner !== p || p.kickCooldown > 0) return;
  1466	  match.endPassMove(p.side); // a hoof is not part of a passing move (Phase 33)
  1467	  const team = match.teams[p.side];
  1468	  // Hoof it upfield with a wide lateral component — safety over precision.
  1469	  // Panicked clears regularly cross the touchline: conceding a kick-in beats
  1470	  // losing the ball in front of your own goal (this is where kick-ins come from).
  1471	  const lat = match.rng.range(-1.0, 1.0);
  1472	  const aim = norm(v2(team.attackDir, lat));
  1473	  const dir = rotate(aim, match.rng.gaussian() * 0.08);
  1474	  // A clear hammered against the body's facing comes off weaker (Phase 27) —
  1475	  // at half strength: a panic hoof is a compromise, not a fifty-fifty gift.
  1476	  // Since Phase 28 the hoof goes UP as well as out: it hangs uninterceptable
  1477	  // over midfield and comes down as an aerial contest, like a real clearance.
  1478	  match.kickBall(
  1479	    p,
  1480	    dir,
  1481	    23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.passing * 0.4)),
  1482	    match.rng.range(3.2, 5.4),
  1483	  );
  1484	  team.stats.clearances++;
  1485	}
  1486	
  1487	/**
  1488	 * Deflection (Phase 27): a ball too fast to control (a drilled pass) can
  1489	 * still be knocked loose by a player standing in its path — reading the lane
  1490	 * pays off even when the pass is hit hard. Rolled once per crossing (the
  1491	 * kick cooldown stops re-rolls while the ball is still in reach).
  1492	 */
  1493	export function tryDeflection(match: Match, p: Player): boolean {
  1494	  const ball = match.ball;
  1495	  const speed = len(ball.vel);
  1496	  // Committed to the stretch either way — no second bite at the same ball.
  1497	  p.kickCooldown = 0.3;
  1498	  // Blind-side honesty (Phase 59): same convention as attemptFirstTouch —
  1499	  // ball arriving at the face = 0, from behind the body = 1. The retreating
  1500	  // defender with a pull-back zipping behind his heels mostly whiffs; the
  1501	  // set, facing interceptor keeps his old numbers. This is what makes the
  1502	  // collapsed block's ceded arc a REAL payoff (the N1.5 counter surface).
  1503	  const dir = norm(ball.vel);
  1504	  const blind = (1 + (dir.x * p.heading.x + dir.y * p.heading.y)) / 2;
  1505	  const pDef = clamp(
  1506	    (0.24 + p.attrs.defending * 0.4 - (speed - 14) * 0.02) * (1 - blind * DEFLECT_BLIND_PEN),
  1507	    0.05, 0.6);
  1508	  if (!match.rng.chance(pDef)) return false; // it zips past the outstretched leg
  1509	  ball.lastTouch = p;
  1510	  ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
  1511	  p.tackleAnimTimer = 0.4; // the stretch is visible (display only)
  1512	  return true;
  1513	}
  1514	
  1515	/**
  1516	 * Smother (Phase 27.5): a rushing keeper who reaches the carrier's ball
  1517	 * dives on it. Reflexes vs the carrier's close control decide it; a win is
  1518	 * a keeper claim (hands, hold state), a loss leaves the keeper on the floor
  1519	 * — and occasionally a clumsy challenge that concedes the foul (a penalty,
  1520	 * in the box where rushes live). Since Phase 28 a keeper does NOT need to
  1521	 * be mid-rush: a carrier who dribbles into the keeper's face inside the box
  1522	 * gets smothered at the feet the same way — you can go past the keeper,
  1523	 * you cannot stand on their toes and keep the ball forever.
  1524	 */
  1525	export function trySmother(match: Match): void {
  1526	  const owner = match.ball.owner;
  1527	  if (!owner || owner.gkHoldTimer > 0) return;
  1528	  const gk = match.teams[1 - owner.side].goalkeeper;
  1529	  if (gk.sentOff || gk.stunTimer > 0 || gk.kickCooldown > 0 || gk.tackleCooldown > 0) return;
  1530	  const rushing = gk.action.type === 'GoalkeeperRush';
  1531	  // Hands only inside the box (Phase 28.5, user report "门将出击到禁区外用手
  1532	  // 接球了"): the smother IS a dive ONTO the ball with the hands, so it may
  1533	  // only happen in the keeper's own area — even mid-rush. A sweeper who
  1534	  // rushes past his line closes the angle, but a ball out there he takes
  1535	  // with his feet — and his FEET were always live: the tryTackles tackler
  1536	  // scan never excluded keepers, so a rushing keeper duels the carrier on
  1537	  // the phase-41 substrate like any defender (Phase 103 verified this and
  1538	  // DELETED its own first cut — a custom out-box poke layered a worse-
  1539	  // priced coin flip with a 0.9s stun on top of the tuned duel, and the
  1540	  // sweeper school bled goals through exactly that branch).
  1541	  if (!match.inPenaltyBox(match.ball.pos, gk.side)) return;
  1542	  if (dist(gk.pos, match.ball.pos) >= 1.3) return;
  1543	
  1544	  gk.saveAnimTimer = 0.7; // the dive at the feet is visible either way
  1545	  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
  1546	  if (match.rng.chance(pWin)) {
  1547	    match.teams[gk.side].stats.saves++;
  1548	    match.stat(gk.gid).saves++;
  1549	    owner.kickCooldown = 0.4;
  1550	    owner.stunTimer = 0.4; // ran into a wall of keeper
  1551	    match.pushEvent('save', gk.side, `${gk.name} smothers at ${owner.name}'s feet!`);
  1552	    match.giveBall(gk); // hold state engages — hands, untackleable
  1553	  } else {
  1554	    gk.stunTimer = 0.8; // beaten — picking himself up off the turf
  1555	    // A long recovery before RE-CHALLENGING (Phase 28.2): a keeper who dove
  1556	    // again every 1.3s read as convulsing. tackleCooldown — NOT kickCooldown
  1557	    // — so a loose ball at his feet can still be scooped up the moment the
  1558	    // stun ends (kickCooldown also gates ball pickup in tryCapture).
  1559	    gk.tackleCooldown = 1.2;
  1560	    // A full-speed rush is clumsier than a standing challenge at the feet.
  1561	    if (match.rng.chance(rushing ? 0.12 : 0.03)) match.awardFoul(gk, owner);
  1562	  }
  1563	}
  1564	
  1565	/**
  1566	 * The professional foul (Phase 29.1): a breakaway carrier has beaten the
  1567	 * field — nobody but the keeper goal-side — and a chasing defender close
  1568	 * enough to reach the shirt but not the ball hauls them down from behind.
  1569	 * Play stops (the carrier does NOT keep the ball, so the advantage rule
  1570	 * cannot apply): free kick + a near-automatic card via `awardTacticalFoul`.
  1571	 * Never in the defender's own box — professionals concede the free kick,
  1572	 * not the penalty. This is the counterweight to offside-era breakaways
  1573	 * where the chasing pack could only eat exhaust fumes: pace still wins the
  1574	 * race (a >1.7m gap is uncatchable), but a caught runner gets fouled.
  1575	 */
  1576	/**
  1577	 * THE RECOVERY SLIDE (Phase 110, the carry-through counter — lever 1).
  1578	 * The 106 anatomy measured the walk-in's pursuit converging at 1.7-2.4m
  1579	 * behind the carrier and STAYING there: the tackle radius is 1.15m and
  1580	 * the tactical grab 1.7m, so the duel never rolled (lunges fired in 2-4%
  1581	 * of breakaway goals) and 69-78% of breakaways were clean carry-throughs.
  1582	 * Real football's answer is the desperation slide: a from-behind lunge
  1583	 * covering the 1.2-2.2m band that sometimes wins the ball, often fouls
  1584	 * (the phase-62 card economics — in the box that is a PENALTY), and
  1585	 * leaves the slider on the grass either way. Selection prices the
  1586	 * appetite through markingAggression; a booked man holds off.
  1587	 */
  1588	export function trySlideTackle(match: Match): void {
  1589	  const owner = match.ball.owner;
  1590	  if (!owner || owner.gkHoldTimer > 0) return;
  1591	  const attTeam = match.teams[owner.side];
  1592	  const defTeam = match.teams[1 - owner.side];
  1593	  const goal = attTeam.oppGoal();
  1594	  const dGoal = dist(owner.pos, goal);
  1595	  // The walk-in kill zone and its approach — deeper than the tactical
  1596	  // grab dares (that band stops at 16m; the measured strikes land 6-9m).
  1597	  if (dGoal > 30) return;
  1598	  // Only a DRIVING carrier (the walk-in), and only from BEHIND — a set
  1599	  // defender in front owns the honest tryTackles duel instead.
  1600	  if (len(owner.vel) < 4.0) return;
  1601	  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  1602	  let slider: Player | null = null;
  1603	  let best = Infinity;
  1604	  for (const o of defTeam.players) {
  1605	    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1606	    const d = dist(o.pos, match.ball.pos);
  1607	    if (d < 1.2 || d > 2.2) continue; // inside 1.2 the standing tackle already rolls
  1608	    const bx = o.pos.x - owner.pos.x;
  1609	    const by = o.pos.y - owner.pos.y;
  1610	    if (bx * owner.vel.x + by * owner.vel.y > 0) continue; // must be chasing
  1611	    if (d < best) {
  1612	      best = d;
  1613	      slider = o;
  1614	    }
  1615	  }
  1616	  if (!slider) return;
  1617	  // The slide is a CHOICE, aggression-flavored and rare per chase — and a
  1618	  // booked man mostly keeps his feet (the second yellow is the deterrent).
  1619	  let attempt = 0.05 + defTeam.genome.markingAggression * 0.12;
  1620	  if (slider.booked) attempt *= 0.35;
  1621	  if (!match.rng.chance(attempt)) return;
  1622	  slider.tackleCooldown = 2.5; // committed — he is on the grass either way
  1623	  slider.tackleAnimTimer = 0.5;
  1624	  slider.spendBurst(TACKLE_LUNGE_COST);
  1625	  // Win small: reaching through a shielding body from behind at full tilt.
  1626	  const win = clamp(
  1627	    0.16 + slider.attrs.defending * 0.14 - owner.attrs.dribbling * 0.1,
  1628	    0.05,
  1629	    0.4,
  1630	  );
  1631	  if (match.rng.chance(win)) {
  1632	    defTeam.stats.tackles++;
  1633	    match.stat(slider.gid).recoveries++;
  1634	    match.ball.owner = null;
  1635	    match.ball.lastTouch = slider;
  1636	    // Directional like the standing tackle (the 乱抢 fix): the sweeping leg
  1637	    // carries the slider's momentum — a recovery slide hooks the ball on
  1638	    // down-pitch (often out, often to the keeper), it does not spray it
  1639	    // uniformly. Same ±~69° noise cone, same speed band.
  1640	    match.ball.vel = scale(rotate(slider.heading, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
  1641	    owner.kickCooldown = 0.3;
  1642	    owner.stunTimer = 0.6;
  1643	    match.possessionSide = -1;
  1644	    slider.stunTimer = 0.5; // he won it from the ground — up he gets
  1645	    return;
  1646	  }
  1647	  slider.stunTimer = 0.8; // beaten and grounded — the carrier runs on
  1648	  // Fouling from behind at speed: the whistle comes often. In the box the
  1649	  // awardFoul machinery makes it the PENALTY; a card rides via maybeCard.
  1650	  const foulP = 0.4 + defTeam.genome.markingAggression * 0.15;
  1651	  if (match.rng.chance(foulP)) match.awardFoul(slider, owner);
  1652	}
  1653	
  1654	export function tryTacticalFoul(match: Match): void {
  1655	  const owner = match.ball.owner;
  1656	  if (!owner || owner.gkHoldTimer > 0) return;
  1657	  const attTeam = match.teams[owner.side];
  1658	  const defTeam = match.teams[1 - owner.side];
  1659	  const goal = attTeam.oppGoal();
  1660	  const dGoal = dist(owner.pos, goal);
  1661	  // Only DESPERATE territory: the carrier is bearing down on the edge of
  1662	  // the danger zone (16–34m out — inside is the box/keeper duel, further
  1663	  // out the defence still trusts the recovery). The high offside line
  1664	  // makes "nobody goal-side" routine, so without this band every line
  1665	  // break got hauled down and cards hit 8/match.
  1666	  if (dGoal < 16 || dGoal > 34) return;
  1667	  // Only a genuine breakaway: carrier at a real sprint, driving at goal.
  1668	  if (len(owner.vel) < 4.5) return;
  1669	  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  1670	  if (match.inPenaltyBox(match.ball.pos, defTeam.side)) return;
  1671	  for (const o of defTeam.players) {
  1672	    if (o.role === 'GK' || o.sentOff) continue;
  1673	    if (dist(o.pos, goal) < dGoal - 1) return; // covered — let the race run
  1674	  }
  1675	  // The nearest ready chaser in grab range BEHIND the carrier (a defender
  1676	  // in FRONT can still play the ball honestly — that's tryTackles' job).
  1677	  let grabber: Player | null = null;
  1678	  let best = Infinity;
  1679	  for (const o of defTeam.players) {
  1680	    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1681	    const d = dist(o.pos, owner.pos);
  1682	    if (d > 1.7) continue;
  1683	    const bx = o.pos.x - owner.pos.x;
  1684	    const by = o.pos.y - owner.pos.y;
  1685	    if (bx * owner.vel.x + by * owner.vel.y > 0) continue;
  1686	    if (d < best) {
  1687	      best = d;
  1688	      grabber = o;
  1689	    }
  1690	  }
  1691	  if (!grabber) return;
  1692	  grabber.tackleCooldown = 2.0; // committed either way — one grab per chase, not spam
  1693	  grabber.spendBurst(TACKLE_LUNGE_COST); // the grab is a burst too (Phase 58)
  1694	  // Cynicism is RARE (~1/match), aggression-flavored, and a booked man keeps
  1695	  // his hands to himself (the second yellow is the whole deterrent).
  1696	  let p = 0.06 + defTeam.genome.markingAggression * 0.1;
  1697	  if (grabber.booked) p *= 0.3;
  1698	  // The free kick has TEETH now (Phase 32): hauling a man down inside the
  1699	  // direct-FK band hands the specialist a real strike at goal — the
  1700	  // professional weighs that and lets some breaks run.
  1701	  if (dGoal < 28) p *= 0.6;
  1702	  if (!match.rng.chance(p)) return;
  1703	  grabber.tackleAnimTimer = 0.4;
  1704	  match.awardTacticalFoul(grabber, owner);
  1705	}
  1706	
  1707	/**
  1708	 * Tackling: the nearest ready opponent within reach of a dribbler attempts to
  1709	 * win the ball. Success odds: markingAggression helps the tackler, the
  1710	 * carrier's dribbleBias (close control) protects them. A failed tackle puts
  1710	 * carrier's dribbleBias (close control) protects them. A failed tackle puts
  1711	 * the defender on a 1.2s cooldown — beaten players can't spam.
  1712	 */
  1713	export function tryTackles(match: Match): void {
  1714	  const ball = match.ball;
  1715	  const owner = ball.owner;
  1716	  if (!owner) return;
  1717	  // A keeper holding the ball in their hands can't be tackled (Phase 27.2).
  1718	  if (owner.gkHoldTimer > 0) return;
  1719	  const oppTeam = match.teams[1 - owner.side];
  1720	
  1721	  let tackler: Player | null = null;
  1722	  let best = Infinity;
  1723	  for (const o of oppTeam.players) {
  1724	    if (o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1725	    const d = dist(o.pos, ball.pos);
  1726	    if (d < 1.15 && d < best) {
  1727	      best = d;
  1728	      tackler = o;
  1729	    }
  1730	  }
  1731	  if (!tackler) return;
  1732	  // THE JOCKEY (Phase 87): the goal-side contain man of a jockeying team
  1733	  // refuses the full-momentum duel — he delays and challenges only a
  1734	  // loose touch or a dying drive. The dive-in school (low gene) keeps the
  1735	  // old reflex; the momentum gate (Phase 41) still pays the carrier who
  1736	  // finds a duel, but a jockeyed carrier has to EARN one.
  1737	  const jockeyG = oppTeam.genome.jockeyBias ?? 0.5;
  1738	  const driveNow = clamp(len(owner.vel) / 9, 0, 1);
  1739	  const goalSide = oppTeam.localX(tackler.pos.x) < oppTeam.localX(owner.pos.x) - 0.2;
  1740	  const looseTouch = dist(ball.pos, owner.pos) > 0.85;
  1741	  // Phase 92 (the A/B verdict): jockeying is delay UNTIL HELP ARRIVES —
  1742	  // without an endgame a patient carrier was never dispossessed. A second
  1743	  // defender inside 3m collapses the containment into the challenge.
  1744	  let helpClose = false;
  1745	  for (const o of oppTeam.players) {
  1746	    if (o === tackler || o.sentOff || o.role === 'GK') continue;
  1747	    if (dist(o.pos, owner.pos) < 3) {
  1748	      helpClose = true;
  1749	      break;
  1750	    }
  1751	  }
  1752	  // No containment in the danger zone (Phase 92): inside ~28m of goal
  1753	  // the challenge is mandatory — jockeying a shooter is just watching.
  1754	  const dangerZone = oppTeam.localX(owner.pos.x) < -17;
  1755	  if (goalSide && !looseTouch && !helpClose && !dangerZone && driveNow > 0.9 - jockeyG * 0.55) return;
  1756	  tackler.tackleAnimTimer = 0.4; // the lunge is visible either way (display only)
  1757	  tackler.spendBurst(TACKLE_LUNGE_COST); // win or whiff, the lunge costs legs (Phase 58)
  1758	
  1759	  // Team aggression + the tackler's defending vs the carrier's evasion. The
  1760	  // carrier resists two UNBIASED ways (attrs/genes, never role): close control
  1761	  // — technique + the team's dribble philosophy — shields and turns a standing
  1762	  // challenge; PACE only pays with a running start. `drive` is the carrier's
  1763	  // momentum (~0 jostling in a crowd, ~0.5 at the 4.5 m/s the cynical-foul code
  1764	  // already treats as a "real sprint", ~1 flat out), so a quick player driving
  1765	  // into space is hard to dispossess while a fast one hemmed in gets nothing
  1766	  // from it. That momentum gate is the space payoff — you can only build speed
  1767	  // where there's room ahead (the flanks, the channels), so wide/quick play
  1768	  // earns a duel edge the compact clump can't, giving width a gradient to climb
  1769	  // (the master gate, Phase 41). Base carries Phase 27's whiff-stun raise.
  1770	  const drive = driveNow;
  1771	  // strength SHIELDS the standing challenge (Phase 47 — the hold-up/pivot
  1772	  // payoff): base 0.21→0.25 with −strength·0.10 so the POPULATION mean
  1773	  // (backfill 0.4) lands exactly where phase-46 left it; the gradient is
  1774	  // what's new, not the league tackle rate.
  1775	  // defending 0.24→0.34 (Phase 48): the wage cap exposed defending as
  1776	  // UNDER-PRICED — whole leagues drained DF points to fund attack (evo-drift
  1777	  // DFdef 0.63→0.52, goals →3.1-3.4). A stronger per-point payoff makes the
  1778	  // defensive spend competitive again (swept {0.24,0.30,0.34}: reference-seed
  1779	  // goals 3.07→2.87→2.65).
  1780	  let p =
  1781	    0.25 +
  1782	    oppTeam.genome.markingAggression * 0.2 +
  1783	    tackler.attrs.defending * 0.34 -
  1784	    match.teams[owner.side].genome.dribbleBias * 0.08 -
  1785	    owner.attrs.dribbling * 0.18 -
  1786	    owner.attrs.strength * 0.1 -
  1787	    // 0.20 → 0.16 (Phase 41.2): the slalom COMMITMENT fix stopped carriers
  1788	    // bleeding their momentum in pirouettes, so the same coefficient bought
  1789	    // far more protection than Phase 41 priced (3-seed paired calibrate
  1790	    // +0.74 goals; evo-drift dribbleBias railed 0.40→0.80 and width
  1791	    // re-collapsed 0.52→0.14 — a dribble monoculture). The trim restores
  1792	    // the DESIGNED effective protection at the new, honest drive levels;
  1793	    // the space/pace gradient itself stays (the master-gate principle).
  1794	    owner.attrs.pace * drive * 0.16;
  1795	  if (oppTeam.mode === 'Press') p += 0.06;
  1796	  if (tackler.traits.includes('enforcer')) p += 0.04; // the destroyer (Phase 39)
  1797	  // THE OUTNUMBERED DUEL (Phase 104, Route A user-ratified): a STALLED
  1798	  // carrier with a second defender inside 3m has his escape angles cut —
  1799	  // the duel was priced 1v1 no matter how many bodies converged, so a
  1800	  // containment that DELAYED until help arrived (the whole jockey design,
  1801	  // 87/92) won its collapse at coin-flip rates and the school starved.
  1802	  // Physics, no gene named: the momentum gate still lets a DRIVING carrier
  1803	  // burn through a double (a flat +0.1 also fed the press swarm and cost
  1804	  // the jockey side the neutral A/B — measured, then narrowed); it is the
  1805	  // stopped-and-doubled carrier who is dead meat, and engineering exactly
  1806	  // that situation is what the contain school does for a living.
  1807	  if (helpClose && drive < 0.45) p += 0.12;
  1808	  p = clamp(p, 0.06, 0.7);
  1809	
  1810	  if (match.rng.chance(p)) {
  1811	    oppTeam.stats.tackles++;
  1812	    match.stat(tackler.gid).recoveries++;
  1813	    // No feed event — tackles are too frequent to narrate; stats + debug show them.
  1814	    ball.owner = null;
  1815	    ball.lastTouch = tackler;
  1816	    // The won ball travels (Phase 28.4, further in 29.1): a real tackle
  1817	    // knocks it CLEAR of the boot zone — short squirts re-fed the same
  1818	    // scramble endlessly, and the offside-compressed midfield made every
  1819	    // re-contest pull in more bodies.
  1820	    // DIRECTIONAL (the 乱抢 re-examination): a standing tackle is won with
  1821	    // INTENT — the winner steers the poke toward safety the way real
  1822	    // hurried defensive contacts go: WIDE, toward the near touchline, never
  1823	    // through the middle. ±~69° of noise keeps it far too wild to be a
  1824	    // pass. Two prior models were A/B-refuted on the way here: a pure
  1825	    // heading-cone (chase-from-behind tacklers face their own goal — their
  1826	    // pokes fed the very walk-ins this fix hunts) and a straight
  1827	    // away-from-own-goal cone (a free VERTICAL out-ball over the press to
  1828	    // the deliberately-high defend-shape ST — goals-warming re-inflated to
  1829	    // the arc highs and evolution railed press/transitionPress to 0.75+).
  1830	    // The slide keeps its momentum physics below — you cannot steer from
  1831	    // the grass. scramble-anatomy.ts is the A/B yardstick.
  1832	    const clear = norm(sub(ball.pos, oppTeam.ownGoal()));
  1833	    const toTouch = Math.sign(ball.pos.y) || 1;
  1834	    const wide = norm(v2(clear.x, clear.y + toTouch));
  1835	    ball.vel = scale(rotate(wide, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
  1836	    owner.kickCooldown = 0.3;
  1837	    owner.stunTimer = 0.6; // dispossessed: stumble before rejoining play (Phase 27)
  1838	    tackler.tackleCooldown = 0.5;
  1839	    // The tackle knocks it LOOSE — it does not hand it over (Phase 31.9,
  1840	    // user report "抢断后几乎直接被对方控制,和拦截没有区别"): the tackler
  1841	    // is committed to the lunge and may not hoover his own squirt. Probed
  1842	    // before this line: 85% of won tackles were re-captured BY THE TACKLER
  1843	    // within 0.19s — the squirt was cosmetic and every dispossession read
  1844	    // as an instant possession flip. Now the loose ball belongs to the
  1845	    // third man: interception = clean takeaway, tackle = contested ball.
  1846	    tackler.kickCooldown = 0.5;
  1847	    match.possessionSide = -1;
  1848	  } else {
  1849	    tackler.tackleCooldown = 1.2;
  1850	    tackler.stunTimer = 0.35; // whiffed lunge: pick yourself up first (Phase 27)
  1851	    // A failed lunge is sometimes a foul (Phase 20): free kick, or a penalty
  1852	    // in the tackler's own box. Aggressive markers give more away.
  1853	    const foulP =
  1854	      0.06 + oppTeam.genome.markingAggression * 0.1 +
  1855	      (tackler.traits.includes('enforcer') ? 0.02 : 0) +
  1856	      (match.derby ? 0.01 : 0); // derbies bite (Phase 40)
  1857	    if (match.rng.chance(foulP)) match.awardFoul(tackler, owner);
  1858	  }
  1859	}
  1860	
  1861	/**
  1862	 * Shot blocks (Phase 31): a defender the ball passes within reach of gets a
  1863	 * real chance to throw a body in — the cost of daring a blocked lane that
  1864	 * `laneBlockers` warned the shooter about. Explicitly ON the pendingShot
  1865	 * path: 30.4 removed shots from the leg-deflection window because that
  1866	 * friction accident silently ate the league's goals (failure mode 18c);
  1867	 * this is the honest, tuned replacement. Ground-height drives only — a
  1868	 * rising ball clears the legs. One roll per defender per shot (the lunge
  1869	 * commits their kickCooldown either way); a successful block kills the
  1870	 * shot into a slow ricochet off the blocker — lastTouch transfers, so a
  1871	 * deflection behind the line is a corner, real-law.
  1872	 */
  1873	export function tryShotBlock(match: Match): void {
  1874	  const shot = match.pendingShot;
  1875	  const ball = match.ball;
  1876	  if (!shot || shot.resolved || ball.owner !== null) return;
  1877	  if (ball.z > 1.1) return; // over the legs and bodies
  1878	  const defTeam = match.teams[1 - shot.side];
  1879	  if (dist(ball.pos, defTeam.ownGoal()) < 6) return; // the goalmouth is the keeper's
  1880	  for (const o of defTeam.players) {
  1881	    if (o.role === 'GK' || o.sentOff || o.stunTimer > 0 || o.kickCooldown > 0) continue;
  1882	    const dx = o.pos.x - ball.pos.x;
  1883	    if (dx >= 0.9 || dx <= -0.9) continue;
  1884	    const dy = o.pos.y - ball.pos.y;
  1885	    if (dy >= 0.9 || dy <= -0.9) continue;
  1886	    if (Math.sqrt(dx * dx + dy * dy) >= 0.9) continue;
  1887	    o.kickCooldown = 0.45; // committed to the block, ball met or not
  1888	    o.tackleAnimTimer = 0.4;
  1889	    // The UNSET WALL (Phase 60): a set, facing body keeps its full block;
  1890	    // the mid-collapse retreater mostly fails to organize in front of a
  1891	    // first-time hit. Same principle the shoot appetite prices via
  1892	    // blockReadiness — but at CONTACT range the bearing to the ball is
  1893	    // unstable (a drive shaving past reads perpendicular), so the facing
  1894	    // term here is the ball's INCOMING direction (the tryDeflection blind
  1895	    // convention): you block what you can see coming.
  1896	    const bdir = norm(ball.vel);
  1897	    const blind = (1 + (bdir.x * o.heading.x + bdir.y * o.heading.y)) / 2;
  1898	    const stillness = clamp01((3.5 - len(o.vel)) / 2.5);
  1899	    const readiness = UNSET_BLOCK_WEIGHT + (1 - UNSET_BLOCK_WEIGHT) * (1 - blind) * stillness;
  1900	    if (!match.rng.chance((0.32 + o.attrs.defending * 0.25) * readiness)) continue;
  1901	    defTeam.stats.blocks++;
  1902	    ball.lastTouch = o;
  1903	    const away = match.rng.chance(0.5) ? 1 : -1;
  1904	    ball.vel = scale(rotate(norm(ball.vel), away * match.rng.range(0.7, 2.4)), match.rng.range(4.5, 9));
  1905	    ball.vz = 0;
  1906	    match.pushEvent('info', o.side, `${o.name} throws a body in front of it!`);
  1907	    match.markShotOutcome('miss');
  1908	    match.pendingShot = null;
  1909	    return;
  1910	  }
  1911	}
  1912	
  1913	/**
  1914	 * Keeper save: while a shot is unresolved and the ball is within the keeper's
  1915	 * reach heading goalward, roll one save attempt. Save odds fall with shot
  1916	 * quality. Catches kill the ball dead; parries push it away from goal.
  1917	 */
  1918	export function tryKeeperSave(match: Match): void {
  1919	  const shot = match.pendingShot;
  1920	  const ball = match.ball;
  1921	  if (!shot || shot.resolved || ball.owner !== null) return;
  1922	
  1923	  const defSide = (1 - shot.side) as 0 | 1;
  1924	  const defTeam = match.teams[defSide];
  1925	  const gk = defTeam.goalkeeper;
  1926	  const goal = defTeam.ownGoal();
  1927	  if (ball.z > GK_CLAIM_HEIGHT) return; // sailing over the keeper's hands
  1928	  const speed = len(ball.vel);
  1929	  if (speed < 6) return;
  1930	  if (dot(ball.vel, sub(goal, ball.pos)) <= 0) return;
  1931	
  1932	  const reach = keeperReach(defTeam, gk);
  1933	  const dNow = dist(gk.pos, ball.pos);
  1934	  if (dNow > reach) {
  1935	    // The fingertip stretch (119b): beyond reach, attempt ONLY as the ball
  1936	    // passes its closest approach (receding) — inside-reach behavior is
  1937	    // bit-identical, the new roll exists solely for the ball that would
  1938	    // never have entered the corridor at all.
  1939	    const receding = dot(ball.vel, sub(gk.pos, ball.pos)) <= 0;
  1940	    if (dNow > reach * SAVE_STRETCH || !receding) return;
  1941	  }
  1942	
  1943	  shot.resolved = true;
  1944	  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)
  1945	  const shooterTeam = match.teams[shot.side];
  1946	  // Reflexes swing save odds by ±11 percentage points around the xG baseline;
  1947	  // the shot's frozen dive difficulty then discounts it — accurate corner
  1948	  // finishes stay hard to save even though the keeper converges on the path.
  1949	  // 0.70 → 0.66 in Phase 29, → 0.63 in 29.1, → 0.48 in Phase 30: every
  1950	  // 30.x structure (6th defender, formations, set keeper distributions)
  1951	  // deleted another slice of the cheap goals-above-xG (breakaways,
  1952	  // scrambles, gifted distributions) that used to carry the scoreline —
  1953	  // 29.2's goals ran +36% OVER xG, 30.3's ran dead even. The shots that
  1954	  // survive a set defence are earned; they convert better. Same trade as
  1955	  // 28.1/29.1, one size bigger.
  1956	  // A placed ball (Phase 32): the keeper is SET and expecting the strike —
  1957	  // the reaction-time difficulty discount barely applies (floor 0.85) and
  1958	  // the base is a set keeper's, not a scrambling one's. Without this the
  1959	  // far-corner curl carried difficulty ~0.25 and 67% of on-target free
  1960	  // kicks went in (probed) — real keepers save most on-frame FKs.
  1961	  let saveP = shot.placed
  1962	    ? clamp(0.7 - shot.xg * 0.6 + (gk.attrs.reflexes - 0.5) * 0.22, 0.08, 0.92) *
  1963	      Math.max(shot.difficulty, 0.85)
  1964	    // Phase 85: the xG discount collapsed saveP to the floor at the meta's
  1965	    // 0.3-0.5 xG (0.48−0.6·xG ⇒ ~0.2), where reflexes' ±11pp couldn't
  1966	    // matter — the keeper had no evolvable answer to manufactured sitters.
  1967	    // Softer collapse (−0.45·xG), stronger reflexes swing (±14pp): elite
  1968	    // keepers now save SOME big chances (real big-chance save% 15-45%),
  1969	    // early-gen shots (xG≈0.16) move ≤+2pp.
  1970	    : clamp(0.48 - shot.xg * 0.45 + (gk.attrs.reflexes - 0.5) * 0.28, 0.1, 0.92) * shot.difficulty;
  1971	
  1972	  // ANGLE CLOSED (Phase 103): a keeper who stood NEAR the shooter at the
  1973	  // strike made the goal small — the one credit the save model never paid,
  1974	  // which is why closing down (and the whole 出击 school) could never win.
  1975	  // Frozen at shot time; chips and placed balls carry 0 (the chip is the
  1976	  // designed counter to the advanced keeper). Early-gen shots from range
  1977	  // are untouched by construction (closeIn ≈ 0 beyond 7m).
  1978	  // (Phase 106 swept a closeIn DIFFICULTY FLOOR here — max(difficulty,
  1979	  // cI·0.85) and ·1.2 — against the measured walk-in strike (goals hit
  1980	  // ~6.5m out, keeper ~3.4m, difficulty 0.35, cI 0.52, conversion 72-79%):
  1981	  // per-shot arithmetic moved, 24-gen warming totals did NOT (15.88/17.36
  1982	  // vs baseline 15.72 — re-roll noise), keeperAggression adoption didn't
  1983	  // shift, and one world held conv 72% regardless. Deleted per the
  1984	  // phase-95 anchor discipline; evidence in scripts/probes/final15-anatomy.ts.)
  1985	  // Angle covered (119b) shares closeIn's slope via max() — the two credits
  1986	  // describe the same physical fact (a smaller goal) from different ranges
  1987	  // and must never compound.
  1988	  saveP = Math.min(0.95, saveP * (1 + Math.max(shot.closeIn ?? 0, shot.coverage ?? 0) * 0.9));
  1989	
  1990	  if (match.rng.chance(saveP)) {
  1991	    shooterTeam.stats.shotsOnTarget++;
  1992	    defTeam.stats.saves++;
  1993	    match.stat(gk.gid).saves++;
  1994	    match.markShotOutcome('saved');
  1995	    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {
  1996	      match.pushEvent('save', defSide, `${gk.name} catches it`);
  1997	      match.giveBall(gk);
  1998	    } else {
  1999	      // A parry deflects the shot rather than reversing it: the ball is
  2000	      // pushed wide of the goal — often behind for a corner, sometimes loose
  2001	      // in the box for a scramble. (The old inward "bounce-back" parry is why
  2002	      // corners never happened.)
  2003	      const inDir = norm(ball.vel);
  2004	      const side = ball.pos.y >= 0 ? 1 : -1;
  2005	      const ang = side * Math.sign(inDir.x || 1) * match.rng.range(0.55, 1.15);
  2006	      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));
  2007	      ball.lastTouch = gk;
  2008	      gk.kickCooldown = 0.6; // let the parry leave the keeper's feet
  2009	      match.pushEvent('save', defSide, `${gk.name} parries!`);
  2010	    }
  2011	  }
  2012	  // A failed attempt just lets the ball continue — goal or miss.
  2013	}

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/mechanics.ts | sed -n '1038,1304p'; nl -ba src/sim/mechanics.ts | sed -n '1305,1518p'; nl -ba src/sim/mechanics.ts | sed -n '1519,1710p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
  1038	 * leaves no gap (feasibility fails), a floaty lob is rejected up front
  1039	 * (hang time returns the line), and a short chip drops into the claim.
  1040	 * Returns true when the chip replaced the ground strike.
  1041	 */
  1042	function tryChip(match: Match, shooter: Player, qGround: number, pressure: number): boolean {
  1043	  const team = match.teams[shooter.side];
  1044	  const opp = match.teams[1 - shooter.side];
  1045	  const gk = opp.goalkeeper;
  1046	  if (gk.sentOff) return false;
  1047	  const goalX = team.attackDir * HALF_L;
  1048	  // Cross the line off-center, away from the keeper's side — the open half.
  1049	  // Geometry from the SHOOTER (the ground path's convention): the carried
  1050	  // ball rides at his feet and kickBall re-bases the release at his body.
  1051	  const target = v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * 1.4);
  1052	  const d = dist(shooter.pos, target);
  1053	  if (d < 7 || d > 30) return false; // not a toe-poke, not a halfway lob
  1054	  const aim = norm(sub(target, shooter.pos));
  1055	  const toGkX = gk.pos.x - shooter.pos.x;
  1056	  const toGkY = gk.pos.y - shooter.pos.y;
  1057	  const along = toGkX * aim.x + toGkY * aim.y;
  1058	  // The keeper must sit ON the chord with real space BEHIND him; a keeper
  1059	  // in the shooter's face is the smother's problem, not the solver's.
  1060	  if (along < 2.5 || along > d - 5.5) return false;
  1061	  if (Math.abs(toGkX * aim.y - toGkY * aim.x) > 3.5) return false;
  1062	  // CAUGHT OUT, not merely positioned (first probe: the routine line at
  1063	  // KA 0.5 fired 3.9 chips/match — a lob festival): the chip demands the
  1064	  // keeper genuinely stranded, ≥7.5m off his goal center. The sweeper's
  1065	  // rushes and the high line (keeperAggression) are what put him there.
  1066	  const og = opp.ownGoal();
  1067	  if (Math.hypot(gk.pos.x - og.x, gk.pos.y - og.y) < 7.5) return false;
  1068	
  1069	  // Feasibility + price at the NOMINAL arrival (rng only spends on a
  1070	  // taken chip, so untaken chips leave every other shot's stream alone).
  1071	  const a = clamp(along / d, 0.15, 0.8);
  1072	  const clearK = GK_CLAIM_HEIGHT + 0.25;
  1073	  const t2Nom = (clearK - a * 1.3) / ((GRAVITY / 2) * a * (1 - a));
  1074	  if (t2Nom <= 0) return false;
  1075	  const tNom = Math.sqrt(t2Nom);
  1076	  if (tNom > 1.45) return false; // hang time hands the keeper his line back
  1077	  const qChip = clamp(
  1078	    0.36 - (tNom - 0.9) * 0.22 - pressure * 0.12 + shooter.attrs.finishing * 0.06,
  1079	    0.03, 0.38,
  1080	  );
  1081	  // Clearly better or nothing — a marginal chip is a shot wasted on
  1082	  // spectacle (the volume gate that keeps the lob an EVENT).
  1083	  if (qChip < qGround * 1.2 + 0.03) return false;
  1084	
  1085	  // Execute: the arrival height draws high (over-bar = the honest miss),
  1086	  // finishing narrows the draw AND the lateral spray.
  1087	  const zg = 0.8 + match.rng.range(0, 1.9 - shooter.attrs.finishing * 0.5);
  1088	  const T = Math.sqrt(Math.max(0.4, (clearK - a * zg) / ((GRAVITY / 2) * a * (1 - a))));
  1089	  const vz = (zg + (GRAVITY / 2) * T * T) / T;
  1090	  const misalign = kickMisalignment(shooter, aim);
  1091	  const spread =
  1092	    (0.03 + d * 0.0012) * (1.3 - shooter.attrs.finishing * 0.6) *
  1093	    orientationNoiseMul(misalign, shooter.attrs.dribbling);
  1094	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1095	  match.lastPassKind = { kind: 'lofted', t: match.simTime };
  1096	  match.kickBall(shooter, dir, d / T, vz);
  1097	
  1098	  team.stats.shots++;
  1099	  team.stats.xg += qChip;
  1100	  match.stat(shooter.gid).shots++;
  1101	  const lp = match.lastCompletedPass;
  1102	  const assistGid =
  1103	    lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3 ? lp.passerGid : null;
  1104	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1105	  match.shotLog.push({
  1106	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: qChip, outcome: 'pending',
  1107	    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  1108	    chip: true,
  1109	    channel: match.goalChannelFor(shooter),
  1110	  });
  1111	  match.pendingShot = {
  1112	    side: shooter.side,
  1113	    shooterGid: shooter.gid,
  1114	    xg: qChip,
  1115	    t: match.simTime,
  1116	    resolved: false,
  1117	    logIndex: match.shotLog.length - 1,
  1118	    // A keeper scrambling BACK under a dropping ball saves awkwardly.
  1119	    difficulty: 0.8,
  1120	    assistGid,
  1121	  };
  1122	  match.pushEvent('shot', shooter.side, `${shooter.name} chips the keeper! (xG ${qChip.toFixed(2)})`);
  1123	  return true;
  1124	}
  1125	
  1126	export function performShot(match: Match, shooter: Player): void {
  1127	  if (match.ball.owner !== shooter || shooter.kickCooldown > 0) return;
  1128	  match.endPassMove(shooter.side); // a strike ends the passing move (Phase 33)
  1129	  const team = match.teams[shooter.side];
  1130	  const opp = match.teams[1 - shooter.side];
  1131	  const gk = opp.goalkeeper;
  1132	
  1133	  // Aim for the corner away from the keeper. Finishing has two channels:
  1134	  // confident finishers aim closer to the post (bigger keeper-evasion, riskier
  1135	  // margin) AND group their shots tighter.
  1136	  const goalX = team.attackDir * HALF_L;
  1137	  // 1.5 → 1.2 in Phase 30.4 (dare the corners), → 1.3 in Phase 31's
  1138	  // retune: with chance volume restored (open runs, cutbacks, routines)
  1139	  // the trade flips back toward failure mode 16a — a slightly safer aim
  1140	  // keeps more strikes on the frame while the keeper still can't reach
  1141	  // the corner.
  1142	  // The clinical trait (Phase 39) shaves another 0.1 off the post —
  1143	  // floored at 0.4 (the base formula's own minimum at finishing 1.0):
  1144	  // an elite finisher who ALSO shaved 0.1 aimed past the optimum and
  1145	  // converted less (caught by the finishing-conversion invariant test).
  1146	  // Finishing slope 0.9 → 0.6 (Phase 47): the eras of churn since 31.5
  1147	  // (36.1 carries, 38 contact, 46 keeper envelope) had pushed the corner
  1148	  // dare past its optimum again — by phase-46 the hi-fin conversion edge
  1149	  // measured +1.3pp ≈ noise and the invariant test finally flipped.
  1150	  // Swept {0.9, 0.75, 0.6, 0.5} at 540 matches: 0.6 restores +2.1pp
  1151	  // (hi 28.9% vs lo 26.8%) — the finisher backs off the post just enough
  1152	  // that the tight grouping cashes.
  1153	  const aimMargin = Math.max(
  1154	    0.4,
  1155	    1.3 - shooter.attrs.finishing * 0.6 - (shooter.traits.includes('clinical') ? 0.1 : 0),
  1156	  );
  1157	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  1158	  const target = v2(goalX, aimY);
  1159	
  1160	  const q = shotQuality(match, shooter);
  1161	  const d = dist(shooter.pos, target);
  1162	  const pressure = pressureAt(shooter.pos, opp.players);
  1163	  // CONTESTED FINISHING (Phase 85, the inflation fix the user chose):
  1164	  // pressureAt is distance-only — a 0.9-defending stopper closing on the
  1165	  // strike degraded it exactly like a statue, so defense had NO evolvable
  1166	  // gradient at the conversion point and late leagues converted 58-77% of
  1167	  // all shots (phase-84 anatomy). The nearest closing OUTFIELDER's quality
  1168	  // now scales the pressure the strike feels: ×1.0 at defending 0.5
  1169	  // (early-gen behavior preserved by construction), ×0.55 vs a statue,
  1170	  // ×1.45 vs a master. The xG model stays blind to defender quality —
  1171	  // like real xG — so evolved defending shows up as UNDER-performance.
  1172	  let contest = pressure;
  1173	  if (pressure > 0) {
  1174	    let bestD = Infinity;
  1175	    let presser: Player | null = null;
  1176	    for (const o of opp.players) {
  1177	      if (o.sentOff || o.role === 'GK') continue;
  1178	      const dd = dist(o.pos, shooter.pos);
  1179	      if (dd < bestD) {
  1180	        bestD = dd;
  1181	        presser = o;
  1182	      }
  1183	    }
  1184	    if (presser) contest = pressure * (0.55 + presser.attrs.defending * 0.9);
  1185	  }
  1186	  // THE CHIP (Phase 69, user ask 挑射/吊射): a keeper OFF HIS LINE can be
  1187	  // beaten over the top — the ecology's first mechanism that PUNISHES
  1188	  // keeperAggression (the sweeper's line height is exactly what opens the
  1189	  // gap behind him). Geometry decides feasibility, the price comparison
  1190	  // decides the attempt; a taken chip replaces this ground strike.
  1191	  if (tryChip(match, shooter, q, pressure)) return;
  1192	  // Composed 1v1 (Phase 28.4): nobody goal-side but the keeper — the shooter
  1193	  // PICKS a spot: tighter to the post, tighter grouping. Without this the
  1194	  // breakaway-finish appetite just fed the keeper from 15m.
  1195	  let oneVone = true;
  1196	  for (const o of opp.players) {
  1197	    if (o.role === 'GK' || o.sentOff) continue;
  1198	    if (dist(o.pos, goalCenterFor(team)) < d - 1) {
  1199	      oneVone = false;
  1200	      break;
  1201	    }
  1202	  }
  1203	  // Composure EARNED (Phase 93): the 28.4 gift was attribute-blind — every
  1204	  // breakaway shooter got the tighter aim + grouping for free, and the
  1205	  // shot-context anatomy measured that pipe at 76-81% of late-gen goals.
  1206	  // Scale the gift by finishing instead: at 0.5 the oneVone branch is a
  1207	  // no-op (a plain shot), a 0.9+ finisher keeps the full old gift
  1208	  // (aim ×0.72, spread ×0.7), and a 0.2 finisher PANICS — alone in front
  1209	  // of goal with nothing to trust, he sprays WIDER than a contested shot.
  1210	  // Composure is now a thing the budget must buy, not a flag.
  1211	  const composure = clamp((shooter.attrs.finishing - 0.5) / 0.4, -0.75, 1);
  1212	  const aimTarget = oneVone
  1213	    ? v2(goalX, (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin * (1 - 0.28 * composure)))
  1214	    : target;
  1215	  const aim = norm(sub(aimTarget, shooter.pos));
  1216	  // Long-range and pressured shots spray more; finishers spray less. A shot
  1217	  // snatched against the body's facing (Phase 27) sprays more and loses power.
  1218	  const misalign = kickMisalignment(shooter, aim);
  1219	  // Spread base 0.029 → 0.025 in 29.1, → 0.022 in Phase 30: set defences
  1220	  // (formations) mean almost every shot is a contested one now — tighter
  1221	  // base grouping keeps the on-target share honest without touching the
  1222	  // pressure physics (failure mode 16: aim/spread beat reach/saveP here).
  1223	  const spread =
  1224	    (0.022 + d * 0.0028 + contest * 0.05) *
  1225	    (1.45 - shooter.attrs.finishing * 0.9) *
  1226	    (1 - team.confidence * 0.12) * // the finish rides confidence too (Phase 111)
  1227	    (oneVone ? 1 - 0.3 * composure : 1) *
  1228	    orientationNoiseMul(misalign, shooter.attrs.dribbling);
  1229	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1230	
  1231	  // The placed curler (Phase 37): technique bends the strike around the
  1232	  // dive. Launch pre-compensated by −spin·T/2 so the chord still crosses
  1233	  // the frame where the aim pointed; lateral drift = spin·vx, so the sign
  1234	  // that bends AWAY from the keeper is sign(Δy·dirx).
  1235	  const curl =
  1236	    (Math.sign((aimTarget.y - gk.pos.y) * dir.x) || 1) * (0.1 + shooter.attrs.dribbling * 0.2);
  1237	  const v0 = SHOT_SPEED * orientationPowerMul(misalign, shooter.attrs.dribbling);
  1238	  const shotT = -Math.log(1 - Math.min((d * BALL_FRICTION_K) / v0, 0.85)) / BALL_FRICTION_K;
  1239	  match.kickBall(shooter, rotate(dir, -curl * shotT * 0.5), v0);
  1240	  match.ball.spin = curl;
  1241	  team.stats.shots++;
  1242	  team.stats.xg += q;
  1243	  match.stat(shooter.gid).shots++;
  1244	
  1245	  // Dive difficulty, frozen at the moment of the strike (keeper reaction) —
  1246	  // priced on the CHORD, discounted for the bend the dive can't fully read.
  1247	  const difficulty = Math.max(
  1248	    0.25,
  1249	    diveDifficulty(match.ball.pos, dir, gk, opp) * (1 - Math.abs(curl) * 0.12),
  1250	  );
  1251	
  1252	  // Assist credit if this shot scores: the completed pass that set it up.
  1253	  const lpForAssist = match.lastCompletedPass;
  1254	  const assistGid =
  1255	    lpForAssist && lpForAssist.receiverGid === shooter.gid && match.simTime - lpForAssist.t < 3
  1256	      ? lpForAssist.passerGid
  1257	      : null;
  1258	
  1259	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1260	  match.shotLog.push({
  1261	    t: match.simTime, minute: match.minute(), side: shooter.side, xg: q, outcome: 'pending',
  1262	    blockers: laneBlockers(shooter.pos, goalCenterFor(team), opp.players),
  1263	    pressure,
  1264	    oneVone,
  1265	    assist:
  1266	      match.lastCutback && match.lastCutback.side === shooter.side && match.simTime - match.lastCutback.t < 5
  1267	        ? 'cutback'
  1268	        : match.lastPassKind && match.simTime - match.lastPassKind.t < 2.5
  1269	          ? match.lastPassKind.kind
  1270	          : 'none',
  1271	    channel: match.goalChannelFor(shooter),
  1272	  });
  1273	  match.pendingShot = {
  1274	    side: shooter.side,
  1275	    shooterGid: shooter.gid,
  1276	    xg: q,
  1277	    t: match.simTime,
  1278	    resolved: false,
  1279	    logIndex: match.shotLog.length - 1,
  1280	    difficulty,
  1281	    assistGid,
  1282	    closeIn: clamp01((7 - dist(gk.pos, shooter.pos)) / 7),
  1283	    coverage: angleCoverage(gk, shooter.pos, goalCenterFor(team)),
  1284	  };
  1285	
  1286	  // Key pass: shot within 3s of receiving.
  1287	  const lp = match.lastCompletedPass;
  1288	  if (lp && lp.receiverGid === shooter.gid && match.simTime - lp.t < 3) {
  1289	    team.stats.keyPasses++;
  1290	    const passer = match.allPlayers[lp.passerGid]; // allPlayers is gid-indexed
  1291	    if (passer) match.pushEvent('keypass', shooter.side, `${passer.name} with the key pass`);
  1292	  }
  1293	  match.pushEvent('shot', shooter.side, `${shooter.name} shoots! (xG ${q.toFixed(2)})`);
  1294	}
  1295	
  1296	/**
  1297	 * Direct free kick (Phase 32): the curl over the wall. Closed-form
  1298	 * parabola through TWO constraints — z ≥ 2.6m at the wall line (above the
  1299	 * outfield header band, 2.5m: a wall that can contest the climb eats
  1300	 * every kick, the 31.9 corner-sentry lesson) and a chosen arrival height
  1301	 * under the bar — then the usual shot bookkeeping so saves/goals/xG all
  1302	 * ride the pendingShot machinery.
  1303	 */
  1304	export function performFreeKick(match: Match, taker: Player): void {
  1305	  if (match.ball.owner !== taker || taker.kickCooldown > 0) return;
  1306	  const team = match.teams[taker.side];
  1307	  const opp = match.teams[1 - taker.side];
  1308	  const gk = opp.goalkeeper;
  1309	  const ball = match.ball;
  1310	
  1311	  const goalX = team.attackDir * HALF_L;
  1312	  // Specialists shave the post; timid takers aim well inside it.
  1313	  const aimMargin = 1.05 - taker.attrs.finishing * 0.55;
  1314	  const aimY = (gk.pos.y >= 0 ? -1 : 1) * (GOAL_WIDTH / 2 - aimMargin);
  1315	  const target = v2(goalX, aimY);
  1316	  const d = dist(ball.pos, target);
  1317	
  1318	  // Solve the flight: z(a·T) = 2.6 at the wall (a = wallDist/d) and
  1319	  // z(T) = zg at the goal ⇒ T² = (2.6 − a·zg) / (G/2 · a(1−a)).
  1320	  // The arrival height DRAWS high (up to ~2.75): everything above the bar
  1321	  // is the classic blazed-over-the-wall miss — without it every strike
  1322	  // arrived under the bar by construction and conversion tripled.
  1323	  const zg = 0.85 + match.rng.range(0, 1.9);
  1324	  // The wall's REAL distance from the release point (the taker may stand
  1325	  // up to ~1.3m off the spot and kickBall releases 0.9m ahead — assuming
  1326	  // a spot-kick left the climb at ~2.2m over the heads, inside the header
  1327	  // band, instead of the designed 2.6).
  1328	  let wallD = CORNER_CLEARANCE - 0.9;
  1329	  if (match.fkWall) {
  1330	    const own = v2(team.attackDir * HALF_L, 0);
  1331	    const center = add(match.fkWall.pos, scale(norm(sub(own, match.fkWall.pos)), CORNER_CLEARANCE + 0.15));
  1332	    wallD = dist(ball.pos, center) - 1.4; // release offset + safety margin
  1333	  }
  1334	  // The banana's price (Phase 37): a curled launch leaves the straight
  1335	  // line, and the climb's header-band segment sweeps past the wall's edge
  1336	  // bodies — the solver buys extra clearance per unit of spin (the first
  1337	  // cut at spin ≤0.7 with plain 2.6 put 4/30 walls back in the header
  1338	  // game, the exact 31.9 sentry failure the invariant test pins).
  1339	  const spinMag = 0.25 + taker.attrs.passing * 0.25;
  1340	  const a = clamp(wallD / d, 0.12, 0.6);
  1341	  const wallClear = 2.6 + spinMag * 0.5;
  1342	  const T = clamp(Math.sqrt(Math.max(0.4, (wallClear - a * zg) / ((GRAVITY / 2) * a * (1 - a)))), 0.9, 1.9);
  1343	  const vz = (zg + (GRAVITY / 2) * T * T) / T;
  1344	  const speed = d / T;
  1345	
  1346	  // Placed ball, full run-up: no orientation penalties, tight spread that
  1347	  // finishing tames — the free kick is the specialist's shot.
  1348	  const spread = (0.034 + d * 0.001) * (1.35 - taker.attrs.finishing * 0.7);
  1349	  const aim = norm(sub(target, ball.pos));
  1350	  const dir = rotate(aim, match.rng.gaussian() * spread);
  1351	
  1352	  // Direct FKs convert ~4-8% in the real game — the xG entry says so.
  1353	  const q = clamp(0.09 - (d - 17) * 0.003, 0.02, 0.12);
  1354	
  1355	  // The banana ball (Phase 37): the specialist's strike curls AWAY from
  1356	  // the keeper toward the chosen corner — over the wall on the solver's
  1357	  // flight, bending across the frame. Launch pre-compensated by −spin·T/2
  1358	  // (the chord still crosses at the aim point); the curl prices the dive.
  1359	  // Lateral (y) drift of a spinning ball = spin·vx, so the sign that
  1360	  // drifts from the keeper toward the chosen corner is sign(Δy·vx).
  1361	  const curlSign = Math.sign((target.y - gk.pos.y) * dir.x) || 1;
  1362	  const spin = curlSign * spinMag;
  1363	  const kickPos = v2(ball.pos.x, ball.pos.y);
  1364	  match.kickBall(taker, rotate(dir, -spin * T * 0.5), speed, vz);
  1365	  ball.spin = spin;
  1366	  team.stats.shots++;
  1367	  team.stats.xg += q;
  1368	  match.stat(taker.gid).shots++;
  1369	
  1370	  // The dive prices the CHORD (where the arc actually crosses the frame)
  1371	  // plus the late bend the keeper cannot fully read.
  1372	  const difficulty = Math.max(0.25, diveDifficulty(kickPos, dir, gk, opp) * (1 - Math.abs(spin) * 0.12));
  1373	
  1374	  match.markShotOutcome('miss'); // close out any still-pending previous shot
  1375	  match.shotLog.push({
  1376	    t: match.simTime, minute: match.minute(), side: taker.side, xg: q, outcome: 'pending',
  1377	    blockers: 0, // the wall is cleared by construction; blocks don't apply
  1378	    channel: match.goalChannelFor(taker), // the FK stamp lands it as `setpiece`
  1379	  });
  1380	  match.pendingShot = {
  1381	    side: taker.side,
  1382	    shooterGid: taker.gid,
  1383	    xg: q,
  1384	    t: match.simTime,
  1385	    resolved: false,
  1386	    logIndex: match.shotLog.length - 1,
  1387	    difficulty,
  1388	    assistGid: null, // a placed ball has no assist
  1389	    placed: true,
  1390	  };
  1391	  match.pushEvent('shot', taker.side, `${taker.name} bends the free kick! (xG ${q.toFixed(2)})`);
  1392	}
  1393	
  1394	/**
  1395	 * The dribble PUSH (Phase 36, 可见的触球): the carrier knocks the ball
  1396	 * ahead along his heading and chases it. The ball is a free body until he
  1397	 * re-collects (the push-scaled poke window an opponent in
  1398	 * the path plays the BALL in). Push length grows with open field ahead
  1399	 * (knock-and-run down the wing) and wobbles with poor technique; sprint
  1400	 * speed carries into the ball, so close control at walking pace stays
  1401	 * naturally tight.
  1402	 */
  1403	export function performDribbleTouch(match: Match, p: Player): void {
  1404	  const ball = match.ball;
  1405	  if (ball.owner !== p) return;
  1406	  const opp = match.teams[1 - p.side];
  1407	  // Open field ahead: nearest opponent inside a forward cone prices the push.
  1408	  const hx = p.heading.x;
  1409	  const hy = p.heading.y;
  1410	  let aheadD = 14;
  1411	  for (const o of opp.players) {
  1412	    if (o.sentOff) continue;
  1413	    const dx = o.pos.x - p.pos.x;
  1414	    const dy = o.pos.y - p.pos.y;
  1415	    const along = dx * hx + dy * hy;
  1416	    // The keeper's stopping power starts upfield of his body (Phase 46):
  1417	    // a loose roll entering his rush envelope is collected, full stop —
  1418	    // outfielders must WIN the ball, so they price at body position.
  1419	    const eff = o.role === 'GK' ? along - GK_RUSH_ENVELOPE : along;
  1420	    if (along < 0 || eff > 14) continue;
  1421	    const perp = Math.abs(dx * hy - dy * hx);
  1422	    if (perp > along * 0.7 + 1) continue; // outside the ~70° cone
  1423	    if (eff < aheadD) aheadD = Math.max(eff, 0);
  1424	  }
  1425	  // Carry regimes (36.1): the open cone ahead PRICES the touch — a
  1426	  // stride-length nudge in traffic (一步一带), a real knock into open
  1427	  // grass (爆趟). Technique shortens and steadies both.
  1428	  const open = Math.min(Math.max(aheadD - 2, 0), 9);
  1429	  let push = (TOUCH_PUSH_BASE + open * TOUCH_PUSH_SPACE) * (1.05 - p.attrs.dribbling * 0.15);
  1430	  // The line guard (36.1): a knock that would roll into touch is halved —
  1431	  // real wingers shorten the touch at the line (12.9% of pushes rolled
  1432	  // dead/out at the first cut).
  1433	  const rollEst = push; // rolled meters ≈ push m/s over ~1s of decay
  1434	  if (
  1435	    Math.abs(p.pos.y + hy * (rollEst + 2)) > HALF_W - 1 ||
  1436	    Math.abs(p.pos.x + hx * (rollEst + 2)) > HALF_L - 1
  1437	  ) {
  1438	    push *= 0.5;
  1439	  }
  1440	  const vmag = Math.hypot(p.vel.x, p.vel.y);
  1441	  const speed = vmag + Math.max(push, 0.8);
  1442	  // A heavy first touch is a WOBBLY one: direction noise priced by technique.
  1443	  const noise = match.rng.gaussian() * 0.07 * (1.35 - p.attrs.dribbling * 0.7);
  1444	  // Knock it along the direction of TRAVEL, not the instantaneous facing.
  1445	  // `heading` is rate-capped (TURN_RATE) and lags the velocity through a turn,
  1446	  // so aiming at the old facing sent the freed ball off on a line the carrier
  1447	  // was already turning away from — it "flew out" on a spin (play report:
  1448	  // "带球转身,球偶尔会飞出去"). The ball now follows where he is actually
  1449	  // running, so it stays on his path through the turn (gate needs v>2.5 m/s,
  1450	  // so `travel` is always well-defined here; heading is only the slow fallback).
  1451	  const travel = vmag > 0.5 ? v2(p.vel.x / vmag, p.vel.y / vmag) : v2(hx, hy);
  1452	  const dir = rotate(travel, noise);
  1453	  ball.owner = null;
  1454	  ball.lastTouch = p;
  1455	  ball.vel = scale(dir, speed);
  1456	  ball.z = 0;
  1457	  ball.vz = 0;
  1458	  // The regather window follows the push: a knock is a chase, a dribble
  1459	  // touch comes back underfoot within the stride.
  1460	  p.kickCooldown = TOUCH_RECOLLECT_BASE + push * TOUCH_RECOLLECT_PER_PUSH;
  1461	  match.dribbleTouch = { gid: p.gid, until: match.simTime + 1.6 };
  1462	}
  1463	
  1464	export function performClear(match: Match, p: Player): void {
  1465	  if (match.ball.owner !== p || p.kickCooldown > 0) return;
  1466	  match.endPassMove(p.side); // a hoof is not part of a passing move (Phase 33)
  1467	  const team = match.teams[p.side];
  1468	  // Hoof it upfield with a wide lateral component — safety over precision.
  1469	  // Panicked clears regularly cross the touchline: conceding a kick-in beats
  1470	  // losing the ball in front of your own goal (this is where kick-ins come from).
  1471	  const lat = match.rng.range(-1.0, 1.0);
  1472	  const aim = norm(v2(team.attackDir, lat));
  1473	  const dir = rotate(aim, match.rng.gaussian() * 0.08);
  1474	  // A clear hammered against the body's facing comes off weaker (Phase 27) —
  1475	  // at half strength: a panic hoof is a compromise, not a fifty-fifty gift.
  1476	  // Since Phase 28 the hoof goes UP as well as out: it hangs uninterceptable
  1477	  // over midfield and comes down as an aerial contest, like a real clearance.
  1478	  match.kickBall(
  1479	    p,
  1480	    dir,
  1481	    23 * (1 - kickMisalignment(p, aim) * 0.15 * (1 - p.attrs.passing * 0.4)),
  1482	    match.rng.range(3.2, 5.4),
  1483	  );
  1484	  team.stats.clearances++;
  1485	}
  1486	
  1487	/**
  1488	 * Deflection (Phase 27): a ball too fast to control (a drilled pass) can
  1489	 * still be knocked loose by a player standing in its path — reading the lane
  1490	 * pays off even when the pass is hit hard. Rolled once per crossing (the
  1491	 * kick cooldown stops re-rolls while the ball is still in reach).
  1492	 */
  1493	export function tryDeflection(match: Match, p: Player): boolean {
  1494	  const ball = match.ball;
  1495	  const speed = len(ball.vel);
  1496	  // Committed to the stretch either way — no second bite at the same ball.
  1497	  p.kickCooldown = 0.3;
  1498	  // Blind-side honesty (Phase 59): same convention as attemptFirstTouch —
  1499	  // ball arriving at the face = 0, from behind the body = 1. The retreating
  1500	  // defender with a pull-back zipping behind his heels mostly whiffs; the
  1501	  // set, facing interceptor keeps his old numbers. This is what makes the
  1502	  // collapsed block's ceded arc a REAL payoff (the N1.5 counter surface).
  1503	  const dir = norm(ball.vel);
  1504	  const blind = (1 + (dir.x * p.heading.x + dir.y * p.heading.y)) / 2;
  1505	  const pDef = clamp(
  1506	    (0.24 + p.attrs.defending * 0.4 - (speed - 14) * 0.02) * (1 - blind * DEFLECT_BLIND_PEN),
  1507	    0.05, 0.6);
  1508	  if (!match.rng.chance(pDef)) return false; // it zips past the outstretched leg
  1509	  ball.lastTouch = p;
  1510	  ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
  1511	  p.tackleAnimTimer = 0.4; // the stretch is visible (display only)
  1512	  return true;
  1513	}
  1514	
  1515	/**
  1516	 * Smother (Phase 27.5): a rushing keeper who reaches the carrier's ball
  1517	 * dives on it. Reflexes vs the carrier's close control decide it; a win is
  1518	 * a keeper claim (hands, hold state), a loss leaves the keeper on the floor
  1519	 * — and occasionally a clumsy challenge that concedes the foul (a penalty,
  1520	 * in the box where rushes live). Since Phase 28 a keeper does NOT need to
  1521	 * be mid-rush: a carrier who dribbles into the keeper's face inside the box
  1522	 * gets smothered at the feet the same way — you can go past the keeper,
  1523	 * you cannot stand on their toes and keep the ball forever.
  1524	 */
  1525	export function trySmother(match: Match): void {
  1526	  const owner = match.ball.owner;
  1527	  if (!owner || owner.gkHoldTimer > 0) return;
  1528	  const gk = match.teams[1 - owner.side].goalkeeper;
  1529	  if (gk.sentOff || gk.stunTimer > 0 || gk.kickCooldown > 0 || gk.tackleCooldown > 0) return;
  1530	  const rushing = gk.action.type === 'GoalkeeperRush';
  1531	  // Hands only inside the box (Phase 28.5, user report "门将出击到禁区外用手
  1532	  // 接球了"): the smother IS a dive ONTO the ball with the hands, so it may
  1533	  // only happen in the keeper's own area — even mid-rush. A sweeper who
  1534	  // rushes past his line closes the angle, but a ball out there he takes
  1535	  // with his feet — and his FEET were always live: the tryTackles tackler
  1536	  // scan never excluded keepers, so a rushing keeper duels the carrier on
  1537	  // the phase-41 substrate like any defender (Phase 103 verified this and
  1538	  // DELETED its own first cut — a custom out-box poke layered a worse-
  1539	  // priced coin flip with a 0.9s stun on top of the tuned duel, and the
  1540	  // sweeper school bled goals through exactly that branch).
  1541	  if (!match.inPenaltyBox(match.ball.pos, gk.side)) return;
  1542	  if (dist(gk.pos, match.ball.pos) >= 1.3) return;
  1543	
  1544	  gk.saveAnimTimer = 0.7; // the dive at the feet is visible either way
  1545	  const pWin = clamp(0.56 + (gk.attrs.reflexes - 0.5) * 0.5 - (owner.attrs.dribbling - 0.5) * 0.35, 0.2, 0.85);
  1546	  if (match.rng.chance(pWin)) {
  1547	    match.teams[gk.side].stats.saves++;
  1548	    match.stat(gk.gid).saves++;
  1549	    owner.kickCooldown = 0.4;
  1550	    owner.stunTimer = 0.4; // ran into a wall of keeper
  1551	    match.pushEvent('save', gk.side, `${gk.name} smothers at ${owner.name}'s feet!`);
  1552	    match.giveBall(gk); // hold state engages — hands, untackleable
  1553	  } else {
  1554	    gk.stunTimer = 0.8; // beaten — picking himself up off the turf
  1555	    // A long recovery before RE-CHALLENGING (Phase 28.2): a keeper who dove
  1556	    // again every 1.3s read as convulsing. tackleCooldown — NOT kickCooldown
  1557	    // — so a loose ball at his feet can still be scooped up the moment the
  1558	    // stun ends (kickCooldown also gates ball pickup in tryCapture).
  1559	    gk.tackleCooldown = 1.2;
  1560	    // A full-speed rush is clumsier than a standing challenge at the feet.
  1561	    if (match.rng.chance(rushing ? 0.12 : 0.03)) match.awardFoul(gk, owner);
  1562	  }
  1563	}
  1564	
  1565	/**
  1566	 * The professional foul (Phase 29.1): a breakaway carrier has beaten the
  1567	 * field — nobody but the keeper goal-side — and a chasing defender close
  1568	 * enough to reach the shirt but not the ball hauls them down from behind.
  1569	 * Play stops (the carrier does NOT keep the ball, so the advantage rule
  1570	 * cannot apply): free kick + a near-automatic card via `awardTacticalFoul`.
  1571	 * Never in the defender's own box — professionals concede the free kick,
  1572	 * not the penalty. This is the counterweight to offside-era breakaways
  1573	 * where the chasing pack could only eat exhaust fumes: pace still wins the
  1574	 * race (a >1.7m gap is uncatchable), but a caught runner gets fouled.
  1575	 */
  1576	/**
  1577	 * THE RECOVERY SLIDE (Phase 110, the carry-through counter — lever 1).
  1578	 * The 106 anatomy measured the walk-in's pursuit converging at 1.7-2.4m
  1579	 * behind the carrier and STAYING there: the tackle radius is 1.15m and
  1580	 * the tactical grab 1.7m, so the duel never rolled (lunges fired in 2-4%
  1581	 * of breakaway goals) and 69-78% of breakaways were clean carry-throughs.
  1582	 * Real football's answer is the desperation slide: a from-behind lunge
  1583	 * covering the 1.2-2.2m band that sometimes wins the ball, often fouls
  1584	 * (the phase-62 card economics — in the box that is a PENALTY), and
  1585	 * leaves the slider on the grass either way. Selection prices the
  1586	 * appetite through markingAggression; a booked man holds off.
  1587	 */
  1588	export function trySlideTackle(match: Match): void {
  1589	  const owner = match.ball.owner;
  1590	  if (!owner || owner.gkHoldTimer > 0) return;
  1591	  const attTeam = match.teams[owner.side];
  1592	  const defTeam = match.teams[1 - owner.side];
  1593	  const goal = attTeam.oppGoal();
  1594	  const dGoal = dist(owner.pos, goal);
  1595	  // The walk-in kill zone and its approach — deeper than the tactical
  1596	  // grab dares (that band stops at 16m; the measured strikes land 6-9m).
  1597	  if (dGoal > 30) return;
  1598	  // Only a DRIVING carrier (the walk-in), and only from BEHIND — a set
  1599	  // defender in front owns the honest tryTackles duel instead.
  1600	  if (len(owner.vel) < 4.0) return;
  1601	  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  1602	  let slider: Player | null = null;
  1603	  let best = Infinity;
  1604	  for (const o of defTeam.players) {
  1605	    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1606	    const d = dist(o.pos, match.ball.pos);
  1607	    if (d < 1.2 || d > 2.2) continue; // inside 1.2 the standing tackle already rolls
  1608	    const bx = o.pos.x - owner.pos.x;
  1609	    const by = o.pos.y - owner.pos.y;
  1610	    if (bx * owner.vel.x + by * owner.vel.y > 0) continue; // must be chasing
  1611	    if (d < best) {
  1612	      best = d;
  1613	      slider = o;
  1614	    }
  1615	  }
  1616	  if (!slider) return;
  1617	  // The slide is a CHOICE, aggression-flavored and rare per chase — and a
  1618	  // booked man mostly keeps his feet (the second yellow is the deterrent).
  1619	  let attempt = 0.05 + defTeam.genome.markingAggression * 0.12;
  1620	  if (slider.booked) attempt *= 0.35;
  1621	  if (!match.rng.chance(attempt)) return;
  1622	  slider.tackleCooldown = 2.5; // committed — he is on the grass either way
  1623	  slider.tackleAnimTimer = 0.5;
  1624	  slider.spendBurst(TACKLE_LUNGE_COST);
  1625	  // Win small: reaching through a shielding body from behind at full tilt.
  1626	  const win = clamp(
  1627	    0.16 + slider.attrs.defending * 0.14 - owner.attrs.dribbling * 0.1,
  1628	    0.05,
  1629	    0.4,
  1630	  );
  1631	  if (match.rng.chance(win)) {
  1632	    defTeam.stats.tackles++;
  1633	    match.stat(slider.gid).recoveries++;
  1634	    match.ball.owner = null;
  1635	    match.ball.lastTouch = slider;
  1636	    // Directional like the standing tackle (the 乱抢 fix): the sweeping leg
  1637	    // carries the slider's momentum — a recovery slide hooks the ball on
  1638	    // down-pitch (often out, often to the keeper), it does not spray it
  1639	    // uniformly. Same ±~69° noise cone, same speed band.
  1640	    match.ball.vel = scale(rotate(slider.heading, match.rng.range(-1.2, 1.2)), match.rng.range(5.5, 10));
  1641	    owner.kickCooldown = 0.3;
  1642	    owner.stunTimer = 0.6;
  1643	    match.possessionSide = -1;
  1644	    slider.stunTimer = 0.5; // he won it from the ground — up he gets
  1645	    return;
  1646	  }
  1647	  slider.stunTimer = 0.8; // beaten and grounded — the carrier runs on
  1648	  // Fouling from behind at speed: the whistle comes often. In the box the
  1649	  // awardFoul machinery makes it the PENALTY; a card rides via maybeCard.
  1650	  const foulP = 0.4 + defTeam.genome.markingAggression * 0.15;
  1651	  if (match.rng.chance(foulP)) match.awardFoul(slider, owner);
  1652	}
  1653	
  1654	export function tryTacticalFoul(match: Match): void {
  1655	  const owner = match.ball.owner;
  1656	  if (!owner || owner.gkHoldTimer > 0) return;
  1657	  const attTeam = match.teams[owner.side];
  1658	  const defTeam = match.teams[1 - owner.side];
  1659	  const goal = attTeam.oppGoal();
  1660	  const dGoal = dist(owner.pos, goal);
  1661	  // Only DESPERATE territory: the carrier is bearing down on the edge of
  1662	  // the danger zone (16–34m out — inside is the box/keeper duel, further
  1663	  // out the defence still trusts the recovery). The high offside line
  1664	  // makes "nobody goal-side" routine, so without this band every line
  1665	  // break got hauled down and cards hit 8/match.
  1666	  if (dGoal < 16 || dGoal > 34) return;
  1667	  // Only a genuine breakaway: carrier at a real sprint, driving at goal.
  1668	  if (len(owner.vel) < 4.5) return;
  1669	  if (dot(owner.vel, sub(goal, owner.pos)) <= 0) return;
  1670	  if (match.inPenaltyBox(match.ball.pos, defTeam.side)) return;
  1671	  for (const o of defTeam.players) {
  1672	    if (o.role === 'GK' || o.sentOff) continue;
  1673	    if (dist(o.pos, goal) < dGoal - 1) return; // covered — let the race run
  1674	  }
  1675	  // The nearest ready chaser in grab range BEHIND the carrier (a defender
  1676	  // in FRONT can still play the ball honestly — that's tryTackles' job).
  1677	  let grabber: Player | null = null;
  1678	  let best = Infinity;
  1679	  for (const o of defTeam.players) {
  1680	    if (o.role === 'GK' || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
  1681	    const d = dist(o.pos, owner.pos);
  1682	    if (d > 1.7) continue;
  1683	    const bx = o.pos.x - owner.pos.x;
  1684	    const by = o.pos.y - owner.pos.y;
  1685	    if (bx * owner.vel.x + by * owner.vel.y > 0) continue;
  1686	    if (d < best) {
  1687	      best = d;
  1688	      grabber = o;
  1689	    }
  1690	  }
  1691	  if (!grabber) return;
  1692	  grabber.tackleCooldown = 2.0; // committed either way — one grab per chase, not spam
  1693	  grabber.spendBurst(TACKLE_LUNGE_COST); // the grab is a burst too (Phase 58)
  1694	  // Cynicism is RARE (~1/match), aggression-flavored, and a booked man keeps
  1695	  // his hands to himself (the second yellow is the whole deterrent).
  1696	  let p = 0.06 + defTeam.genome.markingAggression * 0.1;
  1697	  if (grabber.booked) p *= 0.3;
  1698	  // The free kick has TEETH now (Phase 32): hauling a man down inside the
  1699	  // direct-FK band hands the specialist a real strike at goal — the
  1700	  // professional weighs that and lets some breaks run.
  1701	  if (dGoal < 28) p *= 0.6;
  1702	  if (!match.rng.chance(p)) return;
  1703	  grabber.tackleAnimTimer = 0.4;
  1704	  match.awardTacticalFoul(grabber, owner);
  1705	}
  1706	
  1707	/**
  1708	 * Tackling: the nearest ready opponent within reach of a dribbler attempts to
  1709	 * win the ball. Success odds: markingAggression helps the tackler, the
  1710	 * carrier's dribbleBias (close control) protects them. A failed tackle puts

[35m[3mcodex[0m[0m
The inventory is separating into two different audit questions: dimensional plausibility (metres, seconds, m/s) and tuned outcome curves (probabilities, attribute multipliers). I’m marking the latter `DESIGNED` when the code comments explicitly describe sweeps/probes; I won’t relabel them `MEASURED`, per your instruction. Hard physical thresholds without a defensible calibration will remain `UNCLEAR`.
[1mweb search:[0m 
[1mweb search:[0m site:theifab.com laws latest field of play dimensions goal 7.32 2.44 penalty mark 11 centre circle 9.15 ...
[1mweb search:[0m 
[1mweb search:[0m site:theifab.com/laws/latest "9.15 m" free kick opponents penalty kick corner kick ...
[1mweb search:[0m 
[1mweb search:[0m 
[1mweb search:[0m 
[1mweb search:[0m FIFA Quality Programme football turf ball rebound 0.60 1.00 m requirement ...
[1mweb search:[0m 
[1mweb search:[0m professional soccer players maximal sprint speed m/s match study PMC ...
[1mweb search:[0m 
[1mweb search:[0m elite soccer players vertical jump height cm study PMC countermovement jump ...
[1mweb search:[0m 
[1mweb search:[0m 'cm'
[1mweb search:[0m 
[1mweb search:[0m https://www.theifab.com/laws/latest/the-ball/
[1mweb search:[0m 
[1mweb search:[0m direct free kick conversion rate 6 percent football study dataset ...
[1mweb search:[0m 
[1mweb search:[0m soccer header ball velocity m/s study headed shot ...
[1mweb search:[0m 
[1mweb search:[0m site:grc.nasa.gov soccer ball drag coefficient Magnus force speed ...
[1mweb search:[0m 
[1mweb search:[0m site:nist.gov standard acceleration gravity 9.80665 m/s2 ...
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "nl -ba src/sim/Match.ts | sed -n '1000,1095p'; nl -ba src/sim/Match.ts | sed -n '1340,1425p'; nl -ba src/sim/Match.ts | sed -n '2260,2415p'; nl -ba src/sim/physical.ts | sed -n '1,220p'; nl -ba src/sim/Match.ts | sed -n '1945,2045p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
  1000	    if (this.dribbleTouch !== null) return 'looseBall';
  1001	    return 'looseBall';
  1002	  }
  1003	
  1004	  /** Passive M3 ledger write. Never read by contact/control decisions. */
  1005	  private traceContact(
  1006	    claims: readonly GroundContactClaim[],
  1007	    player: Player,
  1008	    kind: ContestContact['kind'],
  1009	  ): void {
  1010	    if (!this.traceContests) return;
  1011	    if (this.activeContest === null) {
  1012	      const episode: MutableContestEpisode = {
  1013	        id: this.nextContestId++,
  1014	        startedTick: this.stepCount,
  1015	        origin: this.contestOrigin(),
  1016	        initialBallMode: this.ball.physicalMode,
  1017	        possessionSideAtStart: this.possessionSide,
  1018	        contenderGids: [],
  1019	        contacts: [],
  1020	      };
  1021	      this.activeContest = episode;
  1022	      this.contestEpisodes.push(episode);
  1023	    }
  1024	    for (const claim of claims) {
  1025	      const gid = claim.player.gid;
  1026	      if (!this.activeContest.contenderGids.includes(gid)) this.activeContest.contenderGids.push(gid);
  1027	    }
  1028	    this.activeContest.contacts.push({
  1029	      tick: this.stepCount,
  1030	      gid: player.gid,
  1031	      side: player.side,
  1032	      kind,
  1033	      ballModeAfter: this.ball.physicalMode,
  1034	    });
  1035	  }
  1036	
  1037	  private resolveContest(resolution: ContestResolution): void {
  1038	    if (this.activeContest === null) return;
  1039	    this.activeContest.resolution = resolution;
  1040	    this.activeContest = null;
  1041	  }
  1042	
  1043	  private resolveContestControlled(player: Player): void {
  1044	    this.resolveContest({ kind: 'controlled', tick: this.stepCount, gid: player.gid, side: player.side });
  1045	  }
  1046	
  1047	  /**
  1048	   * Low-level kick: releases the ball with velocity and a re-capture cooldown.
  1049	   * `loft` (Phase 28) is the vertical launch speed — 0 keeps it on the grass.
  1050	   */
  1051	  kickBall(p: Player, dir: V2, speed: number, loft = 0): void {
  1052	    const ball = this.ball;
  1053	    this.pendingControl = null;
  1054	    ball.owner = null;
  1055	    ball.lastTouch = p;
  1056	    ball.vel = scale(dir, speed);
  1057	    ball.pos = add(p.pos, scale(dir, 0.9));
  1058	    ball.z = 0;
  1059	    ball.vz = loft;
  1060	    ball.spin = 0; // plain kicks fly straight — curlKick re-sets after
  1061	    p.gkDistributing = false;
  1062	    p.kickCooldown = KICK_COOLDOWN;
  1063	    p.firstTouchWindow = 0; // any kick consumes the one-touch window
  1064	    // The kick starts the wall's release timer (Phase 32): the bodies hold
  1065	    // their line while the ball clears them, THEN break for their marks.
  1066	    if (this.fkWall && this.fkWall.until === null) this.fkWall.until = this.simTime + 0.7;
  1067	  }
  1068	
  1069	  /** Give a player clean control of the ball, resolving pass bookkeeping. */
  1070	  giveBall(p: Player): void {
  1071	    // Offside (Phase 29): the flag frozen at kick time becomes an offence the
  1072	    // moment the flagged target touches the ball. Checked before ANY
  1073	    // bookkeeping — an offside "reception" is not a dribble or a completed
  1074	    // pass, it's a dead ball.
  1075	    const flagged = this.pendingPass;
  1076	    if (flagged && flagged.offside && p.side === flagged.side && p.gid === flagged.targetGid) {
  1077	      this.pendingControl = null;
  1078	      this.pendingPass = null;
  1079	      this.resolveContest({ kind: 'deadBall', tick: this.stepCount });
  1080	      this.callOffside(p, flagged.offsideSpot ?? p.pos);
  1081	      return;
  1082	    }
  1083	    const ball = this.ball;
  1084	    ball.owner = p;
  1085	    ball.lastTouch = p;
  1086	    ball.vel = v2();
  1087	    ball.z = 0;
  1088	    ball.vz = 0;
  1089	    ball.spin = 0;
  1090	    const team = this.teams[p.side];
  1091	
  1092	    // Settle on the ball: carry it briefly before the next decision instead of
  1093	    // one-touch ping-pong. Outfielders start driving forward immediately.
  1094	    // Back-pass law (Phase 32.2, 出球门将): a DELIBERATE teammate ball may
  1095	    // not be picked up — the keeper plays it with his FEET: pressable, no
  1340	        } else {
  1341	          ball.vz = 0;
  1342	        }
  1343	      }
  1344	    } else {
  1345	      const fr = Math.exp(-BALL_FRICTION_K * dt);
  1346	      ball.vel.x *= fr;
  1347	      ball.vel.y *= fr;
  1348	    }
  1349	    // A ball already over the goal line is coasting clear (Phase 41.1): let it
  1350	    // run, freeze goal + out re-checks, and award the restart once it's had its
  1351	    // moment out of play.
  1352	    if (this.pendingOut !== null) {
  1353	      if (this.simTime >= this.pendingOut.until) {
  1354	        const o = this.pendingOut;
  1355	        this.pendingOut = null;
  1356	        this.awardRestart(o.kind, o.side, o.spot);
  1357	      }
  1358	      return;
  1359	    }
  1360	    if (this.checkGoal()) return;
  1361	    if (this.checkWoodwork()) return; // clanged back into play — not out
  1362	    if (this.checkOutOfPlay()) return;
  1363	    mech.tryShotBlock(this);
  1364	    mech.tryKeeperSave(this);
  1365	    if (ball.z > CONTROL_MAX_HEIGHT) {
  1366	      // Too high for feet: only heads (or the keeper's hands) can meet it.
  1367	      const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
  1368	      mech.tryAerial(this, order);
  1369	      return;
  1370	    }
  1371	    this.tryCapture();
  1372	  }
  1373	
  1374	  /**
  1375	   * WOODWORK (Phase 100 — the queue-tail item that unlocks the recorded
  1376	   * crossbar sample): a ball crossing the goal plane in the OUTER band of a
  1377	   * post (|y| just past the frame) or just OVER the bar clangs back into
  1378	   * play instead of going out. Deliberately outer-half only: the inner
  1379	   * half of the frame stays a goal exactly as before — woodwork converts
  1380	   * former near-miss OUTS into live rebounds, so the goal rate is
  1381	   * untouched at first order and NO new rng draws are consumed (the
  1382	   * bounce is deterministic: reflected, damped, spin killed).
  1383	   */
  1384	  private checkWoodwork(): boolean {
  1385	    const ball = this.ball;
  1386	    if (this.phase !== 'playing' || ball.owner !== null) return false;
  1387	    if (Math.abs(ball.pos.x) <= HALF_L) return false;
  1388	    const sign = ball.pos.x > 0 ? 1 : -1;
  1389	    if (ball.vel.x * sign <= 2) return false; // must be DRIVEN out, not trickling
  1390	    // Interpolate the crossing point back to the plane (a 30 m/s shot
  1391	    // travels 0.5m in one step — the post-step position overshoots).
  1392	    const stepX = Math.abs(ball.vel.x) * DT;
  1393	    const frac = Math.min(1, (Math.abs(ball.pos.x) - HALF_L) / Math.max(stepX, 1e-6));
  1394	    const yAt = ball.pos.y - ball.vel.y * DT * frac;
  1395	    const zAt = Math.max(0, ball.z - ball.vz * DT * frac);
  1396	    const BAND = 0.17; // post/bar radius + ball radius
  1397	    const post = Math.abs(yAt) >= GOAL_WIDTH / 2 && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND && zAt < GOAL_HEIGHT;
  1398	    const bar = zAt >= GOAL_HEIGHT && zAt < GOAL_HEIGHT + BAND && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND;
  1399	    if (!post && !bar) return false;
  1400	    // The clang: reflect off the plane, damped DEAD (the frame wins; a
  1401	    // lively 0.52 rebound fed the six-yard scramble and pushed calibrate
  1402	    // seed 2024 to 3.61 — the mechanic must not be a goal channel). Post
  1403	    // hits also ricochet OUTWARD toward the flank, off the frame's curve.
  1404	    ball.pos.x = sign * (HALF_L - (Math.abs(ball.pos.x) - HALF_L) * 0.4 - 0.01);
  1405	    ball.vel.x *= -0.4;
  1406	    if (post) ball.vel.y = Math.sign(yAt || 1) * Math.max(Math.abs(ball.vel.y) * 0.82, 3);
  1407	    else ball.vel.y *= 0.82;
  1408	    if (bar) ball.vz = -Math.abs(ball.vz) * 0.35; // off the bar it comes DOWN
  1409	    ball.spin = 0;
  1410	    // Credit the striker's side (sign>0 = the +x goal = team 0's attack).
  1411	    const shooterSide: Side = this.pendingShot?.side ?? (sign > 0 ? 0 : 1);
  1412	    this.pushEvent('woodwork', shooterSide, bar ? '🔩 Off the CROSSBAR!' : '🔩 Off the post!');
  1413	    this.markShotOutcome('miss'); // on the frame ≠ on target
  1414	    return true;
  1415	  }
  1416	
  1417	  private checkGoal(): boolean {
  1418	    const ball = this.ball;
  1419	    if (ball.z >= GOAL_HEIGHT) return false; // over the bar (Phase 28)
  1420	    if (Math.abs(ball.pos.x) <= HALF_L || Math.abs(ball.pos.y) >= GOAL_WIDTH / 2) return false;
  1421	    // Team 0 attacks +x: ball past +x line = goal for team 0.
  1422	    const scorer: Side = ball.pos.x > 0 ? 0 : 1;
  1423	    this.onGoal(scorer);
  1424	    return true;
  1425	  }
  2260	  /** M3: collect every contact claim from one immutable post-physics snapshot. */
  2261	  private collectGroundContactClaims(
  2262	    order: Player[],
  2263	    speed: number,
  2264	    deflectable: boolean,
  2265	  ): GroundContactClaim[] {
  2266	    const ball = this.ball;
  2267	    const claims: GroundContactClaim[] = [];
  2268	    for (const p of order) {
  2269	      if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;
  2270	      const dx = p.pos.x - ball.pos.x;
  2271	      if (dx >= CONTROL_RADIUS || dx <= -CONTROL_RADIUS) continue;
  2272	      const dy = p.pos.y - ball.pos.y;
  2273	      if (dy >= CONTROL_RADIUS || dy <= -CONTROL_RADIUS) continue;
  2274	      const d = Math.sqrt(dx * dx + dy * dy);
  2275	      if (d >= CONTROL_RADIUS) continue;
  2276	      const access = directBallAccess(p, ball, this.allPlayers, CONTROL_RADIUS);
  2277	      if (!access.canDirectlyContact) continue;
  2278	
  2279	      const intended =
  2280	        this.pendingPass !== null &&
  2281	        this.pendingPass.targetGid === p.gid &&
  2282	        this.pendingPass.side === p.side;
  2283	      const maxSpeed = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED;
  2284	      const kind = speed <= maxSpeed ? 'controlAttempt' : deflectable ? 'deflection' : null;
  2285	      if (kind === null) continue;
  2286	
  2287	      const rvx = ball.vel.x - p.vel.x;
  2288	      const rvy = ball.vel.y - p.vel.y;
  2289	      const horizontalRelative = Math.sqrt(rvx * rvx + rvy * rvy);
  2290	      claims.push({
  2291	        player: p,
  2292	        access,
  2293	        reachMargin: access.sectorCenterReach - d,
  2294	        kind,
  2295	        relativeSpeed: horizontalRelative + Math.abs(ball.vz) * 0.6,
  2296	        incomingDir: horizontalRelative > 1e-8
  2297	          ? { x: rvx / horizontalRelative, y: rvy / horizontalRelative }
  2298	          : { x: -access.geometry.direction.x, y: -access.geometry.direction.y },
  2299	      });
  2300	    }
  2301	    return claims;
  2302	  }
  2303	
  2304	  /** Contact changes the independent ball; it never assigns owner. */
  2305	  private applyControlContact(claim: GroundContactClaim, allClaims: readonly GroundContactClaim[]): void {
  2306	    const ball = this.ball;
  2307	    const p = claim.player;
  2308	    const n = claim.access.geometry.direction;
  2309	    const rvx = ball.vel.x - p.vel.x;
  2310	    const rvy = ball.vel.y - p.vel.y;
  2311	    const relativeNormal = rvx * n.x + rvy * n.y;
  2312	    const tx = rvx - relativeNormal * n.x;
  2313	    const ty = rvy - relativeNormal * n.y;
  2314	    const release = Math.min(
  2315	      CONTACT_RELEASE_MAX_SPEED,
  2316	      Math.max(
  2317	        CONTACT_RELEASE_MIN_SPEED,
  2318	        CONTACT_RELEASE_MIN_SPEED + Math.abs(relativeNormal) * CONTACT_RELEASE_INCOMING_SHARE,
  2319	      ),
  2320	    );
  2321	    ball.vel.x = p.vel.x + n.x * release + tx * CONTACT_TANGENTIAL_RETENTION;
  2322	    ball.vel.y = p.vel.y + n.y * release + ty * CONTACT_TANGENTIAL_RETENTION;
  2323	    ball.vz *= 0.25;
  2324	    ball.spin *= 0.4;
  2325	    ball.lastTouch = p;
  2326	    p.kickCooldown = Math.max(p.kickCooldown, CONTACT_COMMIT_TIME);
  2327	    this.traceContact(allClaims, p, 'controlAttempt');
  2328	
  2329	    const flagged = this.pendingPass;
  2330	    if (flagged && flagged.offside && p.side === flagged.side && p.gid === flagged.targetGid) {
  2331	      this.pendingPass = null;
  2332	      this.pendingControl = null;
  2333	      this.resolveContest({ kind: 'deadBall', tick: this.stepCount });
  2334	      this.callOffside(p, flagged.offsideSpot ?? p.pos);
  2335	      return;
  2336	    }
  2337	    this.pendingControl = {
  2338	      gid: p.gid,
  2339	      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,
  2340	      relativeSpeed: claim.relativeSpeed,
  2341	      incomingDir: claim.incomingDir,
  2342	    };
  2343	  }
  2344	
  2345	  private resolvePendingControlAttempt(): boolean {
  2346	    const attempt = this.pendingControl;
  2347	    if (attempt === null || this.stepCount < attempt.readyTick) return false;
  2348	    this.pendingControl = null;
  2349	    const p = this.allPlayers[attempt.gid];
  2350	    if (!p || p.sentOff || p.stunTimer > 0) return false;
  2351	    const access = directBallAccess(p, this.ball, this.allPlayers, CONTROL_RADIUS);
  2352	    // Screening gates the EARLIER contact claim. Once this body has actually
  2353	    // touched the ball, re-applying the blocker test makes two nearby cores
  2354	    // mutually veto control forever. A rival must submit a real new contact
  2355	    // during the window; mere presence does not cancel an established touch.
  2356	    if (access.geometry.centerDistance > access.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN) return false;
  2357	    p.kickCooldown = 0; // this player's contact commitment has completed
  2358	    const clean = mech.attemptFirstTouch(this, p, {
  2359	      relativeSpeed: attempt.relativeSpeed,
  2360	      incomingDir: attempt.incomingDir,
  2361	    });
  2362	    if (clean) this.giveBall(p);
  2363	    return true; // clean or spilled: this control attempt consumed the tick
  2364	  }
  2365	
  2366	  private tryCapture(): void {
  2367	    if (this.resolvePendingControlAttempt()) return;
  2368	    const ball = this.ball;
  2369	    const speed = Math.hypot(ball.vel.x, ball.vel.y);
  2370	    // Lane anticipation remains for drilled passes, never shots.
  2371	    const shotInFlight = this.pendingShot !== null && !this.pendingShot.resolved;
  2372	    const deflectable = speed > CONTROL_MAX_SPEED && speed <= DEFLECT_MAX_SPEED && !shotInFlight;
  2373	    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
  2374	    const claims = this.collectGroundContactClaims(order, speed, deflectable);
  2375	    const remaining = [...claims];
  2376	
  2377	    // Reach margin is the physical first-contact mediator, not a duel score.
  2378	    // Exact ties keep the already-alternating snapshot order.
  2379	    while (remaining.length > 0) {
  2380	      let first = 0;
  2381	      for (let i = 1; i < remaining.length; i++) {
  2382	        if (remaining[i].reachMargin > remaining[first].reachMargin) first = i;
  2383	      }
  2384	      const claim = remaining.splice(first, 1)[0];
  2385	      const p = claim.player;
  2386	      if (claim.kind === 'deflection') {
  2387	        if (mech.tryDeflection(this, p)) {
  2388	          this.pendingControl = null;
  2389	          this.traceContact(claims, p, 'deflection');
  2390	          return;
  2391	        }
  2392	        continue; // a whiff is not contact; the next snapshot claim may meet it
  2393	      }
  2394	
  2395	      const intended =
  2396	        this.pendingPass !== null &&
  2397	        this.pendingPass.targetGid === p.gid &&
  2398	        this.pendingPass.side === p.side;
  2399	      if (!intended && this.pendingPass !== null && speed > 7) {
  2400	        const bx = ball.vel.x / speed;
  2401	        const by = ball.vel.y / speed;
  2402	        const blind = (1 + (bx * p.heading.x + by * p.heading.y)) / 2;
  2403	        const pContact = Math.min(0.95, Math.max(
  2404	          0.1,
  2405	          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),
  2406	        ));
  2407	        if (!this.rng.chance(pContact)) {
  2408	          p.kickCooldown = 0.3;
  2409	          continue;
  2410	        }
  2411	      }
  2412	      this.applyControlContact(claim, claims);
  2413	      return;
  2414	    }
  2415	  }
     1	import type { V2 } from '../utils/vec';
     2	import {
     3	  BALL_ACCESS_BACK_EXTENSION_FACTOR,
     4	  BALL_ACCESS_SIDE_EXTENSION_FACTOR,
     5	} from './constants';
     6	import type { Side } from './types';
     7	
     8	/**
     9	 * Physical state of the independent ball object. This is deliberately
    10	 * separate from PossessionPhase: a free ball may be rolling or airborne,
    11	 * while dead-ball/restart is a match-law state rather than a physical mode.
    12	 */
    13	export type BallPhysicalMode = 'controlled' | 'freeGround' | 'freeAirborne';
    14	
    15	/**
    16	 * B0 ball-control truth. This is deliberately finer than `BallPhysicalMode`:
    17	 * an outfielder chasing their own knock is still in a control process even
    18	 * though the ball is physically free. The classifier is observational only;
    19	 * it never grants ownership or changes how a player acts.
    20	 */
    21	export type BallControlPhase =
    22	  | { readonly kind: 'deadBall' }
    23	  | { readonly kind: 'keeperHeld'; readonly controllerGid: number }
    24	  | { readonly kind: 'secured'; readonly controllerGid: number }
    25	  | { readonly kind: 'knocked'; readonly controllerGid: number; readonly expiresAt: number }
    26	  | { readonly kind: 'free' };
    27	
    28	/** Minimal existing facts required to derive `BallControlPhase`. */
    29	export interface BallControlFacts {
    30	  readonly live: boolean;
    31	  readonly ownerGid: number | null;
    32	  readonly ownerIsKeeper: boolean;
    33	  readonly keeperHolding: boolean;
    34	  readonly knockedByGid: number | null;
    35	  readonly knockExpiresAt: number | null;
    36	}
    37	
    38	/**
    39	 * Why a future controlled-ball process changed. Type-only in B0 so probes
    40	 * and replay can share one vocabulary before any behavioural implementation.
    41	 */
    42	export type BallControlEvent =
    43	  | { readonly tick: number; readonly kind: 'secured'; readonly gid: number }
    44	  | { readonly tick: number; readonly kind: 'knocked'; readonly gid: number }
    45	  | { readonly tick: number; readonly kind: 'disrupted'; readonly gid: number; readonly byGid: number }
    46	  | { readonly tick: number; readonly kind: 'lost'; readonly gid: number; readonly cause: 'overrun' | 'tackle' | 'opponentContact' | 'out' }
    47	  | { readonly tick: number; readonly kind: 'released'; readonly gid: number; readonly cause: 'pass' | 'shot' | 'clearance' };
    48	
    49	/** How one continuous controlled-ball process began. */
    50	export type ControlSequenceOrigin =
    51	  | 'reception'
    52	  | 'interception'
    53	  | 'looseControl'
    54	  | 'selfRegather';
    55	
    56	/** A physical interruption of control; none of these awards a new owner. */
    57	export type ControlBreakCause =
    58	  | 'overrun'
    59	  | 'tackle'
    60	  | 'opponentContact'
    61	  | 'out'
    62	  | 'deadBall';
    63	
    64	/** A deliberate end to control rather than a loss of it. */
    65	export type ControlReleaseCause =
    66	  | 'pass'
    67	  | 'shot'
    68	  | 'clearance'
    69	  | 'openKnock'
    70	  | 'out'
    71	  | 'deadBall';
    72	
    73	interface ControlSequenceBase {
    74	  readonly id: number;
    75	  readonly controllerGid: number;
    76	  readonly origin: ControlSequenceOrigin;
    77	  readonly startedTick: number;
    78	  readonly lastOwnTouchTick: number;
    79	  readonly touchIndex: number;
    80	}
    81	
    82	export type ActiveControlSequence = ControlSequenceBase & { readonly status: 'active' };
    83	export type BrokenControlSequence = ControlSequenceBase & {
    84	  readonly status: 'broken';
    85	  readonly endedTick: number;
    86	  readonly breakCause: ControlBreakCause;
    87	};
    88	export type ReleasedControlSequence = ControlSequenceBase & {
    89	  readonly status: 'released';
    90	  readonly endedTick: number;
    91	  readonly releaseCause: ControlReleaseCause;
    92	};
    93	
    94	/**
    95	 * B1c control-process representation. An own planned touch advances one
    96	 * active sequence; it does not imply a possession transition or M3 contest.
    97	 * B1c-0 adds the data contract only: live Match state stays null.
    98	 */
    99	export type ControlSequence =
   100	  | ActiveControlSequence
   101	  | BrokenControlSequence
   102	  | ReleasedControlSequence;
   103	
   104	/** Record one planned own touch without starting a new sequence. */
   105	export function recordOwnControlTouch(
   106	  sequence: ActiveControlSequence,
   107	  tick: number,
   108	): ActiveControlSequence {
   109	  return {
   110	    ...sequence,
   111	    lastOwnTouchTick: tick,
   112	    touchIndex: sequence.touchIndex + 1,
   113	  };
   114	}
   115	
   116	/**
   117	 * Macro possession position derived from existing truth. It is not a second
   118	 * integrated ball trajectory and has no physics or rendering authority.
   119	 */
   120	export interface PossessionLocus {
   121	  readonly pos: Readonly<V2>;
   122	  readonly source: 'ball' | 'controller';
   123	  readonly sequenceId: number | null;
   124	  readonly controllerGid: number | null;
   125	}
   126	
   127	export interface PossessionLocusFacts {
   128	  readonly ballPos: Readonly<V2>;
   129	  readonly controlSequence: ControlSequence | null;
   130	  /** Position of controlSequence.controllerGid, or null if unavailable. */
   131	  readonly controllerPos: Readonly<V2> | null;
   132	}
   133	
   134	/**
   135	 * B1c-0 semantic projection. Only an ACTIVE, resolvable sequence selects the
   136	 * controller position; terminal/missing state falls straight back to the real
   137	 * ball. The returned position is a read-only reference, never a copied or
   138	 * independently advanced trajectory.
   139	 */
   140	export function derivePossessionLocus(facts: PossessionLocusFacts): PossessionLocus {
   141	  const sequence = facts.controlSequence;
   142	  if (sequence !== null && sequence.status === 'active' && facts.controllerPos !== null) {
   143	    return {
   144	      pos: facts.controllerPos,
   145	      source: 'controller',
   146	      sequenceId: sequence.id,
   147	      controllerGid: sequence.controllerGid,
   148	    };
   149	  }
   150	  return {
   151	    pos: facts.ballPos,
   152	    source: 'ball',
   153	    sequenceId: null,
   154	    controllerGid: null,
   155	  };
   156	}
   157	
   158	/** Derive control truth from existing state without creating duplicate state. */
   159	export function classifyBallControl(facts: BallControlFacts): BallControlPhase {
   160	  if (!facts.live) return { kind: 'deadBall' };
   161	  if (facts.ownerGid !== null) {
   162	    if (facts.ownerIsKeeper && facts.keeperHolding) {
   163	      return { kind: 'keeperHeld', controllerGid: facts.ownerGid };
   164	    }
   165	    return { kind: 'secured', controllerGid: facts.ownerGid };
   166	  }
   167	  if (facts.knockedByGid !== null && facts.knockExpiresAt !== null) {
   168	    return {
   169	      kind: 'knocked',
   170	      controllerGid: facts.knockedByGid,
   171	      expiresAt: facts.knockExpiresAt,
   172	    };
   173	  }
   174	  return { kind: 'free' };
   175	}
   176	
   177	/** Minimal body facts used by the M0 geometry layer. */
   178	export interface OrientedBody {
   179	  readonly pos: Readonly<V2>;
   180	  /** Unit facing vector; independent of velocity direction. */
   181	  readonly bodyDir: Readonly<V2>;
   182	  /** Radius of the stable kinematic core disc. */
   183	  readonly coreRadius: number;
   184	}
   185	
   186	/** Minimal ball facts needed by access queries. */
   187	export interface PhysicalBall {
   188	  readonly pos: Readonly<V2>;
   189	  readonly radius: number;
   190	}
   191	
   192	export interface DiscContactGeometry {
   193	  /** Unit normal from A to B. Coincident centres use deterministic +x. */
   194	  readonly normal: V2;
   195	  readonly centerDistance: number;
   196	  /** Signed edge-to-edge distance: negative means penetration. */
   197	  readonly surfaceGap: number;
   198	  readonly penetration: number;
   199	  readonly touching: boolean;
   200	}
   201	
   202	export type BodySector = 'front' | 'side' | 'back';
   203	
   204	export interface BallAccessGeometry {
   205	  /** Unit direction from the body's centre toward the ball. */
   206	  readonly direction: V2;
   207	  readonly centerDistance: number;
   208	  /** Signed distance between the core and ball surfaces. */
   209	  readonly surfaceGap: number;
   210	  /** Ball displacement in the body's local frame. */
   211	  readonly forward: number;
   212	  readonly lateral: number;
   213	  readonly sector: BodySector;
   214	  /** Point on the core boundary facing the ball. */
   215	  readonly coreContactPoint: V2;
   216	  /** Eligibility under the caller's centre-to-centre reach envelope. */
   217	  readonly withinCenterReach: boolean;
   218	}
   219	
   220	export interface AccessLineGeometry {
  1945	   * timeout passes) they get the ball with a must-kick first touch.
  1946	   */
  1947	  private stepRestart(dt: number): void {
  1948	    const r = this.restart!;
  1949	    r.timer += dt;
  1950	    const ball = this.ball;
  1951	    ball.owner = null;
  1952	    ball.pos = clone(r.pos);
  1953	    ball.vel = v2();
  1954	    ball.z = 0;
  1955	    ball.vz = 0;
  1956	
  1957	    // Hold everyone who isn't part of the restart out of the clearance
  1958	    // circle (slide along its edge). Penalties clear a wider circle and it
  1959	    // applies to BOTH teams — only the taker and the defending keeper (who
  1960	    // stands on the line, outside the circle) are near the ball.
  1961	    const clearance =
  1962	      r.kind === 'penalty' ? PENALTY_CLEARANCE
  1963	      // Corners AND free kicks use the real-law 9.15m (Phase 31.9/32): at
  1964	      // 6m the FK arc had to float so high the deep defenders beat it to
  1965	      // the drop — the flatter flight over a law-distance wall is a shot.
  1966	      : r.kind === 'corner' || r.kind === 'freeKick' ? CORNER_CLEARANCE
  1967	      : RESTART_CLEARANCE;
  1968	    for (const o of this.allPlayers) {
  1969	      if (o.sentOff || o.gid === r.takerGid) continue;
  1970	      // Strikers HOLD THE LINE at their own goal kicks (Phase 71, user
  1971	      // report "站到对面球门里…开大脚完全没有越位" + the ruling that goal
  1972	      // kicks now play under normal offside): campers stranded deep by the
  1973	      // previous attack get walked back to the line during the setup, so
  1974	      // the punt is a flick-on contest, not a goalmouth cherry-pick. Must
  1975	      // run BEFORE the same-side skip below (teammates are otherwise free).
  1976	      if (r.kind === 'goalKick' && o.side === r.side && o.role !== 'GK') {
  1977	        const team = this.teams[r.side];
  1978	        const line = offsideLineLocalX(team, this.teams[1 - r.side].players, team.localX(this.ball.pos.x));
  1979	        const lx = team.localX(o.pos.x);
  1980	        if (lx > line - 0.3) {
  1981	          o.pos.x = (line - 0.3) * team.attackDir;
  1982	          o.vel.x *= 0.2; // braced at the line, like every restart clamp
  1983	        }
  1984	      }
  1985	      if (o.side === r.side && r.kind !== 'penalty') continue; // only penalties hold teammates
  1986	      if (o.side !== r.side && r.kind === 'penalty' && o.role === 'GK') continue; // keeper keeps the line
  1987	      // Wall members pass freely (Phase 32): their slot sits on the GOAL
  1988	      // side of the ball, so the walk to the wall crosses the circle — the
  1989	      // radial clamp read as a glass wall and no wall ever formed.
  1990	      if (this.fkWall?.gids.includes(o.gid)) continue;
  1991	      const d = dist(o.pos, r.pos);
  1992	      if (d < clearance) {
  1993	        const dir = d < 1e-6 ? v2(-this.teams[r.side].attackDir, 0) : norm(sub(o.pos, r.pos));
  1994	        o.pos = add(r.pos, scale(dir, clearance));
  1995	        o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
  1996	        o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
  1997	        // Braced at the line (Phase 28.3): kill the inward velocity too, or
  1998	        // the run animation plays while the clamp holds them still — legs
  1999	        // sprinting on a treadmill at the edge of the circle.
  2000	        o.vel.x *= 0.2;
  2001	        o.vel.y *= 0.2;
  2002	      }
  2003	      // Goal kicks (Phase 27.3): opponents must be OUT OF THE BOX until the
  2004	      // kick is taken — held at the edge, not camped on the six-yard line.
  2005	      if (r.kind === 'goalKick' && o.side !== r.side && this.inPenaltyBox(o.pos, r.side)) {
  2006	        const attackDir = this.teams[r.side].attackDir;
  2007	        o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);
  2008	        o.vel.x *= 0.2; // braced, like the circle clamp — no treadmill
  2009	        o.vel.y *= 0.2;
  2010	      }
  2011	    }
  2012	
  2013	    const taker = this.allPlayers[r.takerGid];
  2014	    // Corner routine (Phase 31): once the defensive picture has ~formed,
  2015	    // the taking side reads the box and commits to a routine — the runner
  2016	    // licenses and crash spots key off it for the rest of the setup.
  2017	    if (r.kind === 'corner' && r.routine === undefined && r.timer > 0.6) {
  2018	      r.routine = pickCornerRoutine(this, r);
  2019	    }
  2020	    // Kick-ins and corners breathe (Phase 28.1): the taker settles the ball
  2021	    // and both teams get a beat to shape up — instant touchline restarts
  2022	    // read as chaos, and the box picture needs time to form for a cross.
  2023	    const minSetup =
  2024	      r.kind === 'kickIn' ? 1.8
  2025	      : r.kind === 'corner' ? 2.0
  2026	      // A danger FK breathes (Phase 32): the wall needs ~2s to form and the
  2027	      // set-piece read as instant chaos without the pause. Quick option below.
  2028	      : r.kind === 'freeKick' && this.fkWall ? 2.2
  2029	      : RESTART_MIN_SETUP;
  2030	    let ready = dist(taker.pos, r.pos) < 1.3 && r.timer >= minSetup;
  2031	    // The QUICK free kick (Phase 32): if the taker arrives fast, the wall
  2032	    // has not formed yet, and an open teammate exists, play it NOW — real
  2033	    // football's punishment for a slow defensive reset.
  2034	    if (!ready && r.kind === 'freeKick' && this.fkWall && r.timer < 0.8 && dist(taker.pos, r.pos) < 1.3) {
  2035	      const goal = v2(this.teams[r.side].attackDir * HALF_L, 0);
  2036	      const wallCenter = add(r.pos, scale(norm(sub(goal, r.pos)), CORNER_CLEARANCE));
  2037	      let wallFormed = false;
  2038	      for (const gid of this.fkWall.gids) {
  2039	        if (dist(this.allPlayers[gid].pos, wallCenter) < 4) {
  2040	          wallFormed = true;
  2041	          break;
  2042	        }
  2043	      }
  2044	      if (!wallFormed) {
  2045	        // A CLEARLY open mate AHEAD of the ball only: half the danger FKs

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n \"BALL_ACCESS|sectorCenterReach|extension\" src/sim/physical.ts; nl -ba src/sim/physical.ts | sed -n '220,400p'; nl -ba src/sim/Match.ts | sed -n '1300,1350p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 105ms:[0m
  1300	            o.vel.y *= 0.2;
  1301	          }
  1302	        }
  1303	        return; // untackleable, unsmotherable — hands beat everything
  1304	      }
  1305	      mech.tryTackles(this);
  1306	      mech.tryTacticalFoul(this); // guards internally: owner may be gone
  1307	      mech.trySlideTackle(this); // Phase 110 — the recovery slide
  1308	      mech.trySmother(this);
  1309	      return;
  1310	    }
  1311	    // Magnus (Phase 37): sidespin rotates the velocity — a constant rate is
  1312	    // a circular arc, so every projection has an exact closed form. Spin
  1313	    // bleeds slowly in the air, fast on the grass, and dies on the bounce.
  1314	    if (ball.spin !== 0) {
  1315	      const a = ball.spin * dt;
  1316	      const c = Math.cos(a);
  1317	      const s = Math.sin(a);
  1318	      const vx = ball.vel.x;
  1319	      ball.vel.x = vx * c - ball.vel.y * s;
  1320	      ball.vel.y = vx * s + ball.vel.y * c;
  1321	      ball.spin *= Math.exp(
  1322	        -(ball.z > 0 ? BALL_AIR_SPIN_DECAY : BALL_GROUND_SPIN_DECAY) * dt,
  1323	      );
  1324	      if (ball.spin > -0.02 && ball.spin < 0.02) ball.spin = 0;
  1325	    }
  1326	    ball.pos.x += ball.vel.x * dt;
  1327	    ball.pos.y += ball.vel.y * dt;
  1328	    if (ball.z > 0 || ball.vz !== 0) {
  1329	      // Airborne (Phase 28): friction-free parabola, landing bounces. Ground
  1330	      // balls never enter this branch — their trajectories are untouched.
  1331	      ball.z += ball.vz * dt;
  1332	      ball.vz -= GRAVITY * dt;
  1333	      if (ball.z <= 0) {
  1334	        ball.z = 0;
  1335	        if (ball.vz < -BOUNCE_MIN_VZ) {
  1336	          ball.vz = -ball.vz * BALL_BOUNCE;
  1337	          ball.vel.x *= BOUNCE_DAMP;
  1338	          ball.vel.y *= BOUNCE_DAMP;
  1339	          ball.spin *= BALL_BOUNCE_SPIN_RETENTION;
  1340	        } else {
  1341	          ball.vz = 0;
  1342	        }
  1343	      }
  1344	    } else {
  1345	      const fr = Math.exp(-BALL_FRICTION_K * dt);
  1346	      ball.vel.x *= fr;
  1347	      ball.vel.y *= fr;
  1348	    }
  1349	    // A ball already over the goal line is coasting clear (Phase 41.1): let it
  1350	    // run, freeze goal + out re-checks, and award the restart once it's had its

[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n \"MATCH_DURATION|STOPPAGE_MAX|AI_INTERVAL|TEAM_AI_INTERVAL|DT\" src/sim/Match.ts src/sim/League.ts src/game/GameApp.ts | head -100; nl -ba src/sim/Match.ts | sed -n '430,520p'; nl -ba src/sim/Match.ts | sed -n '1210,1270p'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
src/sim/Match.ts:19:  AI_INTERVAL, BALL_AIR_SPIN_DECAY, BALL_BOUNCE, BALL_BOUNCE_SPIN_RETENTION, BALL_FRICTION_K,
src/sim/Match.ts:20:  BALL_GROUND_SPIN_DECAY, BOUNCE_DAMP, BOUNCE_MIN_VZ, BOX_DEPTH, BOX_WIDTH,
src/sim/Match.ts:25:  DEFLECT_MAX_SPEED, DT,
src/sim/Match.ts:26:  GK_CONTROL_MAX_SPEED, GK_HOLD_CLEARANCE, GOAL_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L, HALF_W,
src/sim/Match.ts:27:  KICK_COOLDOWN, MATCH_DURATION, OUT_PLAY_COAST,
src/sim/Match.ts:29:  CONTEST_RADIUS, RESTART_TIMEOUT, STOPPAGE_MAX, TEAM_AI_INTERVAL, TOUCH_CONTROL_DIST,
src/sim/Match.ts:181:  /** Sim-seconds for the whole match (default MATCH_DURATION). Tests use short ones. */
src/sim/Match.ts:294: * single fixed-timestep `step(DT)`; rendering reads state and never writes.
src/sim/Match.ts:506:    this.duration = cfg.duration ?? MATCH_DURATION;
src/sim/Match.ts:559:    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
src/sim/Match.ts:681:        team.brainTimer = TEAM_AI_INTERVAL;
src/sim/Match.ts:703:        p.decisionTimer = AI_INTERVAL;
src/sim/Match.ts:829:   * STOPPAGE_MAX seconds past the nominal end.
src/sim/Match.ts:842:    if (this.simTime >= nominal + STOPPAGE_MAX) {
src/sim/Match.ts:865:    while (!this.finished) this.step(DT);
src/sim/Match.ts:1392:    const stepX = Math.abs(ball.vel.x) * DT;
src/sim/Match.ts:1394:    const yAt = ball.pos.y - ball.vel.y * DT * frac;
src/sim/Match.ts:1395:    const zAt = Math.max(0, ball.z - ball.vz * DT * frac);
src/sim/Match.ts:1397:    const post = Math.abs(yAt) >= GOAL_WIDTH / 2 && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND && zAt < GOAL_HEIGHT;
src/sim/Match.ts:1398:    const bar = zAt >= GOAL_HEIGHT && zAt < GOAL_HEIGHT + BAND && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND;
src/sim/Match.ts:1420:    if (Math.abs(ball.pos.x) <= HALF_L || Math.abs(ball.pos.y) >= GOAL_WIDTH / 2) return false;
src/sim/Match.ts:1523:    if (Math.abs(pos.y) > BOX_WIDTH / 2) return false;
src/game/GameApp.ts:43:import { DT } from '../sim/constants';
src/game/GameApp.ts:477:      while (this.acc >= DT && steps < maxSteps) {
src/game/GameApp.ts:478:        this.match.step(DT);
src/game/GameApp.ts:480:        this.acc -= DT;
src/game/GameApp.ts:495:      if (this.acc > DT * maxSteps) this.acc = 0; // drop debt we'll never repay
src/sim/League.ts:38:import { MATCH_DURATION } from './constants';
src/sim/League.ts:281:    this.matchDuration = cfg.matchDuration ?? MATCH_DURATION;
   430	  /** A ball over the goal line, coasting clear before its corner/goal-kick is
   431	   * placed (Phase 41.1). Goal detection is frozen while this is set, so a wide
   432	   * ball drifting behind the line can't phantom-goal. Transient — lives only
   433	   * ~OUT_PLAY_COAST s of open play, and setupKickoff clears any stragglers. */
   434	  private pendingOut: { kind: RestartKind; side: Side; spot: V2; until: number } | null = null;
   435	  /** Gid whose next carrier decision must be a kick (restart first touch). */
   436	  restartKickGid: number | null = null;
   437	  /** Gid whose next carrier decision is the kickoff — played BACKWARD (27.3). */
   438	  kickoffKickGid: number | null = null;
   439	  /** What kind of restart that kick is — penalties force a shot. */
   440	  restartKickKind: RestartKind | null = null;
   441	  /**
   442	   * Free-kick WALL (Phase 32): picked when a danger-zone FK is awarded —
   443	   * the defending bodies that line up on the ball–goal line at the law
   444	   * clearance. The executor routes them there (their slot IS their
   445	   * steering target, so the clearance clamps never fight them — the wall
   446	   * IS the clearance). The kick STARTS the release timer instead of
   447	   * dissolving it: released instantly, the wallers walked back toward
   448	   * their marks — straight into the climb's header band — and free-headed
   449	   * the kick they had just walled. `until` null = holding; set = released
   450	   * at that sim time. A new restart clears it outright.
   451	   */
   452	  fkWall: { gids: number[]; pos: V2; side: Side; until: number | null } | null = null;
   453	  /** The corner routine the restart handed to the kick (Phase 31). */
   454	  restartKickRoutine: CornerRoutine | null = null;
   455	  pendingPass: PendingPass | null = null;
   456	  /** Consecutive completed passes in the current move, per side (Phase 33). */
   457	  private passChain: [number, number] = [0, 0];
   458	  pendingShot: PendingShot | null = null;
   459	  shotLog: ShotLogEntry[] = [];
   460	  /** Gid of the most recent goalscorer — passive, for celebration visuals only. */
   461	  lastScorerGid: number | null = null;
   462	  /** Per-player counters (goals/assists/shots/saves/recoveries). ROSTER-
   463	   * indexed since Phase 61 (home 0..ROSTER_SIZE-1, then away): a substitute's
   464	   * numbers land on HIS row. Write through `stat(gid)`. Passive. */
   465	  playerStats: PlayerMatchStats[] = [];
   466	  /** Rounds out per roster row (Phase 118) — home 0..8, then away; 0 = fit.
   467	   * Banked by League.applyResult into `f.injuries` (the suspension seam). */
   468	  readonly injuriesOut: number[] = Array<number>(ROSTER_SIZE * 2).fill(0);
   469	  /** Roster surnames (record resolution — the MOTM line may name a sub). */
   470	  private readonly rosterNames: string[];
   471	  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;
   472	  /** The most recent cutback kick (Phase 31) — goals within 5s credit it. */
   473	  lastCutback: { side: Side; t: number } | null = null;
   474	  /** Telemetry (Phase 86): the most recent pass launch's kind — shot-context
   475	   * anatomy reads it; zero RNG, zero behavior. */
   476	  lastPassKind: { kind: 'pass' | 'through' | 'cross' | 'lofted'; t: number } | null = null;
   477	  /* ---- Goal-channel telemetry (Phase 113) — the launch-anatomy probe's
   478	   * band-entry classifier moved in-engine so every GOAL carries a channel
   479	   * tag. All four fields are written from state the step already computed
   480	   * and read ONLY by the shot log: zero RNG, zero behavior. ---- */
   481	  /** The current owner's possession start (team-local x) — the carry clock. */
   482	  carryStart: { gid: number; t: number; x: number } | null = null;
   483	  /** The owner already counted for the final-15m band this possession. */
   484	  private bandInside = false;
   485	  /** The live attack's fresh BREAKAWAY band entry (nobody goal-side but the
   486	   * keeper) and what launched it. A turnover or kickoff kills it. */
   487	  attackEntry: { side: Side; kind: GoalChannel; t: number } | null = null;
   488	  /** The most recent SET-PIECE first touch (corner/free kick/penalty only). */
   489	  lastRestartKick: { kind: RestartKind; side: Side; t: number } | null = null;
   490	
   491	  private kickoffSide: Side = 0;
   492	  private stepCount = 0;
   493	  /** Deterministic discrete simulation clock for pure observational layers. */
   494	  get simTick(): number { return this.stepCount; }
   495	  /** One "stoppage time" feed line per half (Phase 27.4). */
   496	  private stoppageAnnounced = false;
   497	  /** Sim time when the second half kicked off — first-half stoppage must not
   498	   * leak into the second half's display clock (Phase 28.1). */
   499	  private secondHalfStart = 0;
   500	
   501	  /** Armed rivalry fixture (Phase 40): press + bite up a touch, 🔥 banner. */
   502	  readonly derby: boolean;
   503	
   504	  constructor(cfg: MatchConfig) {
   505	    this.rng = new Rng(cfg.seed);
   506	    this.duration = cfg.duration ?? MATCH_DURATION;
   507	    this.derby = cfg.derby ?? false;
   508	    this.traceContests = cfg.traceContests ?? false;
   509	    this.traceFirstTouch = cfg.traceFirstTouch ?? false;
   510	    this.edsTouchCost = cfg.edsTouchCost ?? EDS_BUNDLE_ARMED;
   511	    this.edsPerceivedDefence = cfg.edsPerceivedDefence ?? EDS_BUNDLE_ARMED;
   512	    this.edsPerceivedChoice = cfg.edsPerceivedChoice ?? EDS_BUNDLE_ARMED;
   513	    this.edsValueAxis = cfg.edsValueAxis ?? EDS_BUNDLE_ARMED;
   514	    this.edsEagerPerception = cfg.edsEagerPerception ?? false;
   515	    this.traceChoice = cfg.traceChoice ?? EDS_TRACE_ARMED;
   516	    this.edsAwareness = cfg.edsAwareness ?? 0.8;
   517	    this.perceptionSeed = cfg.seed;
   518	    this.teams = [new Team(0, cfg.teamA), new Team(1, cfg.teamB)];
   519	    // The underdog shift (Phase 64): with both clubs' Elo on the team
   520	    // sheet, the outgunned coach bends toward the bus by his gene. Read
  1210	      // Possession swung — both brains re-evaluate promptly.
  1211	      this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
  1212	      this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
  1213	    }
  1214	    this.pendingControl = null;
  1215	    this.resolveContestControlled(p);
  1216	  }
  1217	
  1218	  /* ---------------- ball physics ---------------- */
  1219	
  1220	  private stepBall(dt: number): void {
  1221	    const ball = this.ball;
  1222	    if (ball.owner) {
  1223	      // Discrete touches (Phase 36, 可见的触球): an outfield carrier DRIVING
  1224	      // in open field pushes the ball ahead and chases it — the magnet-ball
  1225	      // glue below is only close control now (pressure, shielding, keepers,
  1226	      // restart takers). touchTimer ≥ the capture settle guarantees the
  1227	      // first decision happens ON the ball, so the pass game keeps its
  1228	      // timing and restart takers kick before a push can fire.
  1229	      const o = ball.owner;
  1230	      if (
  1231	        this.phase === 'playing' &&
  1232	        o.role !== 'GK' &&
  1233	        o.action.type === 'Dribble' &&
  1234	        o.touchTimer <= 0 &&
  1235	        o.gkHoldTimer <= 0 &&
  1236	        // A slow or turning carrier keeps the ball at his feet — pushes
  1237	        // belong to the DRIVE (walking pace = close control by definition).
  1238	        o.vel.x * o.vel.x + o.vel.y * o.vel.y > 2.5 * 2.5
  1239	      ) {
  1240	        let nearOpp = Infinity;
  1241	        for (const q of this.teams[1 - o.side].players) {
  1242	          if (q.sentOff) continue;
  1243	          const d = dist(q.pos, o.pos);
  1244	          if (d < nearOpp) nearOpp = d;
  1245	        }
  1246	        if (nearOpp > TOUCH_CONTROL_DIST) {
  1247	          mech.performDribbleTouch(this, o);
  1248	          return; // the ball is free — it integrates from next step
  1249	        }
  1250	      }
  1251	      // Dribble: the ball rides slightly ahead of the owner's heading — or
  1252	      // tight to the chest while a keeper holds it in their hands (27.2).
  1253	      // In-place writes (was add/scale/clone — 3 vectors per step); ball.pos
  1254	      // and ball.vel are never aliased, all other writers assign fresh objects.
  1255	      // Span the WHOLE hold/distribute, not just the gkHoldTimer window: the
  1256	      // timer re-arms in 0.25s quanta and hits 0 in the gaps, which sawtoothed
  1257	      // the held ball 0.3↔0.85m at ~3Hz — the keeper (whose spot tracks
  1258	      // ball.pos.y) and nearby teammates (who reference the ball) jittered with
  1259	      // it (user report "门将拿球一抽一抽,队友也抽"). gkDistributing already
  1260	      // spans the hold for the other consumers (clearance guard, heldByGk).
  1261	      const carry =
  1262	        ball.owner.gkHoldTimer > 0 || (ball.owner.role === 'GK' && ball.owner.gkDistributing)
  1263	          ? 0.3
  1264	          : 0.85;
  1265	      ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;
  1266	      ball.pos.y = ball.owner.pos.y + ball.owner.heading.y * carry;
  1267	      ball.vel.x = ball.owner.vel.x;
  1268	      ball.vel.y = ball.owner.vel.y;
  1269	      // Ball in the keeper's hands (Phase 28.1): opponents are held off the
  1270	      // same way a restart holds them — you cannot challenge a keeper in

[1mweb search:[0m 
[1mweb search:[0m NASA anthropometric source buttock knee length adult male cm lower limb ...
[35m[3mexec[0m[0m
[1m/bin/zsh -lc "rg -n -C 4 \"PASS_POWER_(MIN|MAX)\" src/ai/PlayerBrain.ts; rg -n -C 3 \"SPEED_TIME_SCALE|BODY_SCALE|CONTROL_REACH_SCALE|GOAL_AND_BOX_SCALE\" src --glob '*.ts'"[0m in /Users/jamie/Documents/Promptfoo/evofootball-arena
[32m succeeded in 0ms:[0m
15-} from './perception';
16-import {
17-  choosePerceivedPassTarget, passChoiceCandidateGids, preferredPassPower,
18-} from './perceivedPassChoice';
19:import { PASS_POWER_MAX, PASS_POWER_MIN } from '../sim/constants';
20-
21-/** E3's canary prices the chosen pass at the substrate's own power range. */
22:const PASS_CANARY_POWERS: readonly number[] = [PASS_POWER_MIN, 1, PASS_POWER_MAX];
23-
24-/**
25- * PlayerBrain — utility AI. Each decision tick the player scores a set of
26- * candidate actions; the best one wins. Every score is a product/sum of
src/sim/constants.ts-25- */
src/sim/constants.ts-26-const LEGACY_PITCH_SCALE = positiveEnv('PITCH_SCALE');
src/sim/constants.ts-27-export const FIELD_SCALE = positiveEnv('FIELD_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
src/sim/constants.ts:28:export const GOAL_AND_BOX_SCALE =
src/sim/constants.ts:29:  positiveEnv('GOAL_AND_BOX_SCALE') ?? LEGACY_PITCH_SCALE ?? 0.7;
src/sim/constants.ts:30:export const BODY_SCALE = positiveEnv('BODY_SCALE') ?? 1;
src/sim/constants.ts:31:export const CONTROL_REACH_SCALE = positiveEnv('CONTROL_REACH_SCALE') ?? 1;
src/sim/constants.ts:32:export const SPEED_TIME_SCALE = positiveEnv('SPEED_TIME_SCALE') ?? 1;
src/sim/constants.ts-33-
src/sim/constants.ts-34-export const PITCH_LENGTH = 90 * FIELD_SCALE;
src/sim/constants.ts-35-export const PITCH_WIDTH = 58 * FIELD_SCALE;
--
src/sim/constants.ts-43- * so a wide ball drifting behind the line can never register a phantom goal. */
src/sim/constants.ts-44-export const OUT_PLAY_COAST = 0.5;
src/sim/constants.ts-45-
src/sim/constants.ts:46:export const GOAL_WIDTH = 7 * GOAL_AND_BOX_SCALE;
src/sim/constants.ts-47-export const GOAL_DEPTH = 2.2;
src/sim/constants.ts-48-/** Crossbar height (m) — a ball crossing the goal line above this is OVER the bar. */
src/sim/constants.ts-49-export const GOAL_HEIGHT = 2.44;
src/sim/constants.ts:50:export const BOX_DEPTH = 13 * GOAL_AND_BOX_SCALE;
src/sim/constants.ts:51:export const BOX_WIDTH = 28 * GOAL_AND_BOX_SCALE;
src/sim/constants.ts-52-export const CENTER_CIRCLE_R = 7 * FIELD_SCALE;
src/sim/constants.ts-53-
src/sim/constants.ts-54-/** Fixed simulation timestep (s). */
--
src/sim/constants.ts-223-export const RESTART_TIMEOUT = 6;
src/sim/constants.ts-224-
src/sim/constants.ts-225-/** A player controls a free ball inside this radius... */
src/sim/constants.ts:226:export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;
src/sim/constants.ts-227-/**
src/sim/constants.ts-228- * M2 oriented interaction shell. The stable core and ball radius are never
src/sim/constants.ts-229- * scaled by these values — only the leg/foot extension outside them is.
--
src/sim/constants.ts-327-
src/sim/constants.ts-328-export const SHOT_SPEED = 27;
src/sim/constants.ts-329-/** Minimum distance between player centers (hard separation). */
src/sim/constants.ts:330:export const PLAYER_MIN_DIST = 1.05 * BODY_SCALE;
src/sim/constants.ts-331-/** Radius of the stable kinematic core disc represented by PLAYER_MIN_DIST. */
src/sim/constants.ts-332-export const PLAYER_CORE_RADIUS = PLAYER_MIN_DIST / 2;
src/sim/constants.ts-333-/** IFAB size-5 ball: circumference 68–70cm ⇒ radius approximately 0.11m. */

[1m[31mERROR:[0m[0m Reconnecting... 2/5
[35m[3mcodex[0m[0m
The main quantitative red flags are now clear: acceleration is substantially above elite-football measurements even after allowing for the 0.7 field compression; the exponential turf model brakes fast passes much harder than published roll tests imply; and vertical bounce is below FIFA turf rebound bands. I’m doing the final coverage pass now, including aliases and derived constants so the ledger does not accidentally omit “duplicate” authorities.
[3mRepository inventory and source research are complete. I am consolidating duplicate aliases, derived default values, scale-aware comparisons, and the final ranked audit.[0m
  [32m✓[0m Inspect constants and all requested mechanics files; inventory numeric values and usage sites
  [32m✓[0m Research authoritative real-football anchors and scaling implications
  [36m→[0m Classify each entry and assemble per-file markdown ledgers
  [2m•[0m [2mRank the 10 highest-priority realism questions and verify coverage[0m
[3mAll named constants, surface-profile fields and aliases, plus the material inline literals in the requested files, have been classified and checked against the source set. The scale-aware flagging and ranked shortlist are complete.[0m
  [32m✓[0m Inspect constants and all requested mechanics files; inventory numeric values and usage sites
  [32m✓[0m Research authoritative real-football anchors and scaling implications
  [32m✓[0m Classify each entry and assemble per-file markdown ledgers
  [32m✓[0m Rank the 10 highest-priority realism questions and verify coverage
[35m[3mcodex[0m[0m
# Realism Ledger — first draft

Static audit of the shipped defaults on 26 July 2026. No code was changed.

Two interpretation rules matter:

- Spatial geometry using `FIELD_SCALE` or `GOAL_AND_BOX_SCALE` is compared with both the unscaled Laws and a ×0.7 similarity target.
- Bodies, reach, speed and time are explicitly unscaled, so they are judged first in raw SI units. Where raw values are plausible but make play 1/0.7 ≈ 43% faster or larger relative to the pitch, I mark a **SCALE ALERT** rather than automatically calling them unrealistic.

`OUTSIDE` means the value falls outside a published range or an exact law-derived scaled value. `FORM MISMATCH` means the real quantity exists, but the simulation’s mathematical form prevents a clean one-number comparison.

## Anchor basis

- **LAW-GEO:** IFAB Law 1: full pitches 90–120 × 45–90 m; international 100–110 × 64–75 m; goal 7.32 × 2.44 m; penalty area 16.5 m deep and 40.32 m wide; penalty mark 11 m; centre/penalty arcs 9.15 m. [IFAB Law 1](https://www.theifab.com/laws/latest/the-field-of-play/?side-menu-open=true)
- **LAW-BALL:** circumference 68–70 cm, implying radius 0.108–0.111 m. [IFAB Law 2](https://www.theifab.com/laws/latest/the-ball/)
- **LAW-RESTART:** free kicks and corners require 9.15 m; penalties also 9.15 m plus positional restrictions; throw-ins require 2 m. [Free kicks](https://www.theifab.com/laws/latest/free-kicks/), [penalties](https://theifab.com/laws/latest/the-penalty-kick/), [corners](https://www.theifab.com/laws/latest/the-corner-kick/), [throw-ins](https://www.theifab.com/laws/latest/the-throw-in/)
- **GRAVITY:** standard gravity is 9.80665 m/s². [NIST SI guide](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)
- **TURF-ROLL:** FIFA/UEFA-style test ball starts around 3.2 m/s and should roll roughly 4–8 m; published turf measurements give deceleration near `0.40 + 0.17v`, about 0.8–1.0 m/s² at 2.5 m/s. [Kolitzus, *Ball Roll Behavior*](https://www.isss-sportsurfacescience.org/downloads/documents/ZPKPAJJUWY_Ball_Roll_BehaviorKS.pdf)
- **TURF-BOUNCE:** FIFA Quality Pro vertical rebound is 0.60–0.85 m from a 2 m drop, equivalent to vertical restitution about 0.55–0.65. [FIFA Football Turf requirements](https://www.footballvictoria.com.au/sites/ffv/files/2023-04/FIFA_Quality_Manual_Handbook-of-requirements-2015.pdf)
- **RUN:** observed elite peak match speeds are about 8.1–8.8 m/s, with a larger study reporting 9.14 ± 0.39 m/s. [Peak-speed study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11694206/), [professional sprint study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11167479/)
- **ACCEL:** reported maximum match acceleration is about 3.3–5.4 m/s²; theoretical acceleration-speed profiles reach about 5.7–8.7 m/s². [Velocity/acceleration review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11769499/)
- **KICK:** experienced side-foot kicks averaged 21.4 ± 1.5 m/s; elite male maximal shots are commonly about 25–35 m/s. [Nunome et al.](https://pubmed.ncbi.nlm.nih.gov/17892095/), [Kellis/Lees review material](https://jssm.org/volume10/iss1/cap/jssm-10-203.pdf)
- **BALL-TRACK:** 7.9–22.3 m/s was used as a realistic pass/ball-speed validation range; deliberate passes are detectable from roughly 8 m/s. [Tracking validation](https://www.sciencedirect.com/science/article/pii/S1877705816306919), [World Cup tracking study](https://www.mdpi.com/2076-3417/15/15/8694)
- **REACTION:** football/futsal goalkeeper work commonly separates anticipation from post-stimulus reaction at about 200 ms. [Futsal goalkeeper reaction study](https://www.scielo.br/j/jpe/a/r4WYtRNtR47vWJp4v8vzGFg/)
- **XG:** real xG models learn from thousands of shots and normally include distance, angle, body part and assist type; richer models add player and goalkeeper locations. [StatsBomb xG methodology](https://statsbomb.com/soccer-metrics/expected-goals-xg-explained/)
- **FK-RATE:** an observed Premier League direct-free-kick conversion rate was 4.72%. [Premier League analysis](https://www.premierleague.com/en/news/693397)
- **AERO:** real ball drag is strongly speed- and ball-dependent; aerodynamic simulations show material reductions in flight time and range versus vacuum trajectories. [Soccer-ball drag study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4038026/), [full-flight simulation](https://link.springer.com/article/10.1007/s00466-025-02705-2)
- **SPIN:** measured spin decay depends on the product of initial spin and forward speed, rather than a universal fixed exponential rate. [Barber et al., *The spin decay of sports balls in flight*](https://shura.shu.ac.uk/2132/)
- **GK/JUMP:** professional goalkeepers are usually over 1.80 m and jump higher than outfield players; soccer jump research does not support a universal contact-height cutoff. [Ziv & Lidor review](https://doi.org/10.1123/ijspp.6.4.509), [elite-soccer jump review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11467003/)

## `src/sim/constants.ts`

| Name | Shipped value | Unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---:|---|---|---|---|
| `LEGACY_PITCH_SCALE` | unset; optional env | ratio | Legacy source for field and goal/box scale | **DESIGNED** — compatibility/probe control, not football physics | No counterpart |
| `FIELD_SCALE` | 0.7 | ratio | Pitch dimensions and centre circle | **DESIGNED** — explicit density compression | Produces a lawful scaled general pitch, but not a scaled international-width pitch |
| `GOAL_AND_BOX_SCALE` | 0.7 | ratio | Goal width and penalty-box geometry | **DESIGNED** — explicitly decoupled geometry compression | Individual derived dimensions below reveal non-uniform scaling |
| `BODY_SCALE` | 1 | ratio | Minimum player separation/core size | **DESIGNED** — body geometry deliberately remains unscaled | **SCALE ALERT:** bodies are 43% larger relative to the pitch |
| `CONTROL_REACH_SCALE` | 1 | ratio | Ball-control radius | **DESIGNED** — reach remains unscaled | **SCALE ALERT:** reach is 43% larger relative to the pitch |
| `SPEED_TIME_SCALE` | 1; currently unused | ratio | Intended authority for speed/time scaling | **DESIGNED** — declared world-model choice, but no consumer uses it | **SCALE ALERT:** physical speeds on a ×0.7 field imply 43% faster pitch-relative transit |
| `PITCH_LENGTH` | 63 | m | Goal-line-to-goal-line extent | **DESIGNED** — `90 × 0.7` | LAW-GEO scaled general range 63–84 m: inside; scaled international 70–77 m: below |
| `PITCH_WIDTH` | 40.6 | m | Touchline-to-touchline extent | **DESIGNED** — `58 × 0.7` | LAW-GEO scaled general range 31.5–63 m: inside; scaled international 44.8–52.5 m: **OUTSIDE** |
| `HALF_L` | 31.5 | m | Longitudinal boundary and formation coordinate | **DESIGNED** — exact derivative of designed pitch | Same verdict as `PITCH_LENGTH` |
| `HALF_W` | 20.3 | m | Lateral boundary and formation coordinate | **DESIGNED** — exact derivative of designed pitch | Same verdict as `PITCH_WIDTH` |
| `OUT_PLAY_COAST` | 0.5 | s | Visual coast before goal-line restart | **DESIGNED** — presentation delay | No real-law counterpart |
| `GOAL_WIDTH` | 4.9 | m | Goal mouth, aiming and scoring | **DESIGNED** — scaled arcade goal | LAW-GEO ×0.7 target is 5.124 m: **OUTSIDE −4.4%** |
| `GOAL_DEPTH` | 2.2 | m | Rendered net depth | **DESIGNED** — goal depth is not fixed by the Laws | Plausible installation value; little gameplay effect |
| `GOAL_HEIGHT` | 2.44 | m | Crossbar and over-bar test | **ANCHORED** — exact IFAB height | Exact LAW-GEO value; **SCALE ALERT** because width is scaled but height is not |
| `BOX_DEPTH` | 9.1 | m | Penalty-area depth and keeper-hand boundary | **DESIGNED** — scaled custom box | LAW-GEO ×0.7 target 11.55 m: **OUTSIDE −21.2%** |
| `BOX_WIDTH` | 19.6 | m | Penalty-area width | **DESIGNED** — scaled custom box | LAW-GEO ×0.7 target 28.224 m: **OUTSIDE −30.6%** |
| `CENTER_CIRCLE_R` | 4.9 | m | Drawn centre circle | **DESIGNED** — compressed restart geometry | LAW-GEO ×0.7 target 6.405 m: **OUTSIDE −23.5%** |
| `DT` | 1/60 = 0.01667 | s/tick | Fixed integration timestep | **DESIGNED** — numerical resolution | Not a football observable |
| `MATCH_DURATION` | 240 | sim s | Full match mapped to displayed 90 minutes | **DESIGNED** — time compression | One sim second represents 22.5 displayed seconds |
| `STOPPAGE_MAX` | 8 | sim s | Maximum safe-break extension per half | **DESIGNED** — about three displayed minutes | Added time is empirical, not a fixed law value |
| `SURFACE_PROFILE` | seven fields below | mixed | Single turf-response authority | **UNCLEAR** — physical intent, but not calibrated to a named surface | See field-level verdicts |
| `SURFACE_PROFILE.ballFrictionK` | 0.55 | s⁻¹ | Exponential ground-speed decay | **UNCLEAR** — real turf deceleration is speed-dependent but not simply proportional across pass speeds | At 3.2 m/s it gives 5.82 m asymptotic roll, within 4–8 m; at 2.5 m/s it gives 1.375 m/s² versus 0.8–1.0: **OUTSIDE locally / FORM MISMATCH** |
| `SURFACE_PROFILE.ballBounce` | 0.45 | restitution | Vertical rebound velocity fraction | **UNCLEAR** — directly physical but low versus pitch tests | Two-metre drop rebounds about 0.405 m; TURF-BOUNCE says 0.60–0.85 m: **OUTSIDE** |
| `SURFACE_PROFILE.bounceDamp` | 0.72 | ratio | Horizontal speed retained after bounce | **UNCLEAR** — real value depends on angle, spin, turf and ball | No defensible universal point anchor |
| `SURFACE_PROFILE.bounceMinVz` | 2.2 | m/s | Vertical impact below which the ball settles | **UNCLEAR** — physical transition represented as a hard cliff | Real settling is continuous; no published universal cutoff |
| `SURFACE_PROFILE.airSpinDecay` | 0.25 | s⁻¹ | Exponential decay of curvature rate in air | **UNCLEAR** — physical counterpart exists | SPIN finds decay depends on speed × spin: **FORM MISMATCH** |
| `SURFACE_PROFILE.groundSpinDecay` | 1.5 | s⁻¹ | Exponential decay of curvature rate on turf | **UNCLEAR** — surface-dependent physical effect | No suitable one-number football anchor located |
| `SURFACE_PROFILE.bounceSpinRetention` | 0.55 | ratio | Curvature retained at bounce | **UNCLEAR** — impact/spin coupling is physical but state-dependent | No universal point anchor |
| `BALL_FRICTION_K` | 0.55 | s⁻¹ | Runtime alias for ground decay | **UNCLEAR** — same physical model as profile field | Same mixed/OUTSIDE verdict as `ballFrictionK` |
| `BALL_AIR_SPIN_DECAY` | 0.25 | s⁻¹ | Runtime air-spin alias | **UNCLEAR** | SPIN: **FORM MISMATCH**; moreover airborne translational speed has no drag |
| `BALL_GROUND_SPIN_DECAY` | 1.5 | s⁻¹ | Runtime ground-spin alias | **UNCLEAR** | Surface-specific calibration required |
| `BALL_BOUNCE_SPIN_RETENTION` | 0.55 | ratio | Runtime bounce-spin alias | **UNCLEAR** | Impact-specific calibration required |
| `STAMINA_DRAIN` | 0.01 | stamina/s at effort² | High-effort fatigue | **DESIGNED** — comments explicitly price the sim’s energy economy | Cannot map directly through the 240 s → 90 min clock |
| `STAMINA_RECOVERY` | 0.009 | stamina/s | Jog/idle recovery | **DESIGNED** — tuned against sim end-state stamina | Same mapping problem |
| `TACKLE_LUNGE_COST` | 0.02 | stamina/attempt | Flat tackle burst cost | **DESIGNED** — explicit gameplay price | No physiological one-attempt equivalent |
| `DEFLECT_BLIND_PEN` | 0.75 | probability multiplier | Up to 75% reduction for blind drilled-ball deflection | **DESIGNED** — explicit anti-omniscience lever | Requires sim event calibration |
| `CONTACT_BLIND_PEN` | 0.7 | probability multiplier | Blind-side contact penalty | **DESIGNED** — explicit interception/cutback tuning | Requires sim event calibration |
| `UNSET_BLOCK_WEIGHT` | 0.55 | ratio | Minimum effectiveness of moving/blind shot blockers | **DESIGNED** — explicit shot-channel tuning | Requires shot/block census |
| `CROSS_LEAD_FRAC` | 0.4 | ratio | Fraction of receiver motion used to lead crosses | **DESIGNED** — meetability correction | No direct real constant |
| `CROSS_LEAD_MAX` | 3.5 | m | Maximum cross lead | **DESIGNED** — caps evolved delivery geometry | Plausible movement lead, but context-dependent |
| `GRAVITY` | 9.81 | m/s² | Lofted-ball vertical acceleration | **ANCHORED** — Earth gravity | NIST 9.80665; excellent match |
| `BALL_BOUNCE` | 0.45 | restitution | Runtime vertical bounce | **UNCLEAR** | TURF-BOUNCE: **OUTSIDE low** |
| `BOUNCE_DAMP` | 0.72 | ratio | Runtime horizontal bounce damping | **UNCLEAR** | No universal point anchor |
| `BOUNCE_MIN_VZ` | 2.2 | m/s | Runtime settling threshold | **UNCLEAR** | Hard-cliff model lacks direct anchor |
| `CONTROL_MAX_HEIGHT` | 1.3 | m | Highest foot/ordinary control contact | **UNCLEAR** — anatomical/mechanical counterpart, but skill-dependent | Roughly waist/upper-thigh height; plausible, low confidence |
| `HEADER_MIN_HEIGHT` | 1.35 | m | Bottom of header-only contest band | **UNCLEAR** — players can stoop or use feet/chest at overlapping heights | Plausible transition, not a physical hard boundary |
| `HEADER_MAX_HEIGHT` | 2.5 | m | Highest outfielder header contact | **UNCLEAR** — represents stature plus jump | GK/JUMP suggests normal elite contact is mostly lower; 2.5 m is exceptional but plausible |
| `HEADER_RADIUS` | 1.35 | m | Horizontal centre-to-ball header reach | **UNCLEAR** — combines run, lean and jump into one radius | Generous relative to static anatomy; **SCALE ALERT** |
| `CHEST_TRAP_MAX_HEIGHT` | 1.7 | m | Highest chest/thigh control | **UNCLEAR** — depends strongly on stature | Plausible for adult players |
| `CHEST_TRAP_RADIUS` | 1.05 | m | Horizontal chest-trap reach | **UNCLEAR** — represents positioning, not literal torso reach | Generous but plausible as a movement envelope |
| `CHEST_TRAP_MAX_VZ` | 1.5 | m/s upward | Rising-ball trap gate | **UNCLEAR** — technique-dependent, no standard cutoff | No defensible published threshold |
| `GK_CLAIM_HEIGHT` | 2.55 | m | Highest keeper catch/save contact | **UNCLEAR** — stature, arm reach, jump and dive combined | GK/JUMP makes 2.4–2.8 m broadly plausible |
| `GK_HOLD_CLEARANCE` | 3 | m | Pushes opponents away from held keeper | **DESIGNED** — Laws prohibit challenge but prescribe no radius | Not law-anchored |
| `RESTART_CLEARANCE` | 6 | m | Generic kick-in/goal-kick clearance circle | **DESIGNED** — house-rule compromise | Real references vary: throw-in 2 m, free kick 9.15 m |
| `CORNER_CLEARANCE` | 9.15 | m | Corner and free-kick defender distance | **ANCHORED** — exact IFAB distance | Exact raw law; **SCALE ALERT:** 43% oversized relative to ×0.7 similarity |
| `PENALTY_SPOT_DIST` | 6.552 | m | Penalty mark from goal line | **DESIGNED** — `BOX_DEPTH × 0.72`, not law-derived | LAW-GEO ×0.7 target 7.7 m: **OUTSIDE −14.9%** |
| `PENALTY_CLEARANCE` | 8 | m | All non-taker/non-GK penalty setup clearance | **UNCLEAR** — partly law-like but inconsistent with both scaling conventions | Law is 9.15 m; scaled analogue 6.405 m. Value is 12.6% low raw and 24.9% high scaled |
| `RESTART_MIN_SETUP` | 1 | s | Minimum generic dead-ball setup | **DESIGNED** — pacing | No generic law minimum |
| `RESTART_TIMEOUT` | 6 | s | Failsafe forced restart | **DESIGNED** — anti-stall mechanism | Comparable to newer five/eight-second protocols only loosely |
| `CONTROL_RADIUS` | 1.25 | m centre-to-ball | Free-ball contact/control envelope | **UNCLEAR** — physical reach plus locomotion collapsed into one radius | Large for routine foot control; plausible only as an extended lunge. **SCALE ALERT** |
| `BALL_ACCESS_SIDE_EXTENSION_FACTOR` | 1 | ratio | Full side-sector leg extension | **DESIGNED** — oriented contact-shell rule | No external constant |
| `BALL_ACCESS_BACK_EXTENSION_FACTOR` | 0.9 | ratio | Rear-sector extension | **DESIGNED** — allows near-full back-heel reach | No external constant |
| `CONTEST_RADIUS` | 3 | m | Loose-ball contest classification | **DESIGNED** — telemetry/classification boundary | Not currently the physical duel radius |
| `CONTROL_MAX_SPEED` | 14 | m/s | Max surprise/bystander capture speed | **UNCLEAR** — hard cutoff on a continuous control problem | Inside BALL-TRACK range; intended targets separately receive a 24 m/s override |
| `GK_CONTROL_MAX_SPEED` | 23 | m/s | Keeper capture speed limit | **UNCLEAR** — hard handling threshold | Near top of pass range and below maximal-shot range; plausible but not a real cliff |
| `CONTACT_CONTROL_DELAY_TICKS` | 3 = 0.05 s | ticks/s | Contact-to-possession separation | **DESIGNED** — substrate arbitration window | Much longer than ball-foot impact, shorter than human reaction; not meant as either |
| `CONTACT_COMMIT_TIME` | 0.08 | s | Minimum post-contact commitment | **DESIGNED** — prevents immediate competing claim | No direct anchor |
| `CONTACT_CONTROL_RETENTION_MARGIN` | 0.02 | m | Reach tolerance at delayed claim | **DESIGNED** — numerical/interaction hysteresis | No real counterpart |
| `CONTACT_RELEASE_MIN_SPEED` | 0.25 | m/s | Minimum normal ball separation after contact | **DESIGNED** — avoids a glued independent ball | No direct calibration |
| `CONTACT_RELEASE_MAX_SPEED` | 1.2 | m/s | Maximum normal release after cushioning | **DESIGNED** — caps touch rebound | Plausible touch speed; calibration absent |
| `CONTACT_RELEASE_INCOMING_SHARE` | 0.12 | ratio | Incoming normal speed retained | **DESIGNED** — contact response coefficient | No published football-specific constant |
| `CONTACT_TANGENTIAL_RETENTION` | 0.35 | ratio | Tangential motion retained at contact | **DESIGNED** — contact response coefficient | No published football-specific constant |
| `DEFLECT_MAX_SPEED` | 24 | m/s | Upper speed for pass deflection | **UNCLEAR** — leg contact remains possible above control pace | Just above BALL-TRACK pass range but below maximal shots; plausible |
| `KICK_COOLDOWN` | 0.45 | s | Re-capture ban after kick | **DESIGNED** — explicitly lets passes leave | Not a physiological kick-cycle measurement |
| `PASS_POWER_MIN` | 0.85 | ratio | Lowest intended pass weighting | **DESIGNED** — game input range | No direct real constant |
| `PASS_POWER_MAX` | 1.15 | ratio | Highest intended pass weighting | **DESIGNED** | No direct real constant |
| `PASS_POWER_NOISE_K` | 0.60 | σ coefficient | Error from non-neutral pass weighting | **DESIGNED** — attribute curve | Requires completion/error calibration |
| `PASS_POWER_EXECUTED_MIN` | 0.70 | ratio | Lower clamp on mis-hit power | **DESIGNED** — numerical sanity bound | No direct real anchor |
| `PASS_POWER_EXECUTED_MAX` | 1.30 | ratio | Upper clamp on mis-hit power | **DESIGNED** | No direct real anchor |
| `TOUCH_CONTROL_DIST` | 4.2 | m | Opponent distance above which open dribble touches occur | **DESIGNED** — carry-regime switch | No universal pressure distance |
| `TOUCH_PUSH_BASE` | 0.9 | m/s | Base ball speed added on open touch | **DESIGNED** — visible-touch pacing | Plausible small nudge |
| `TOUCH_PUSH_SPACE` | 0.32 | (m/s)/m | Added push speed per metre of open cone | **DESIGNED** — tuned knock-and-run gradient | No direct anchor |
| `TOUCH_RECOLLECT_BASE` | 0.26 | s | Minimum no-recapture interval after push | **DESIGNED** — poke/chase window | Roughly one running step, but not study-derived |
| `TOUCH_RECOLLECT_PER_PUSH` | 0.04 | s per m/s | Extra chase time with touch strength | **DESIGNED** | No direct anchor |
| `GK_RUSH_ENVELOPE` | 5 | m | Treats open grass near keeper as covered | **DESIGNED** — tactical abstraction | Plausible one-second coverage at GK running speed |
| `AI_INTERVAL` | 0.15 | s | Individual action re-evaluation | **UNCLEAR** — resembles perception/decision latency but is actually a scheduler | REACTION ≈0.20 s even before movement: **POTENTIALLY OUTSIDE fast** |
| `TEAM_AI_INTERVAL` | 0.4 | s | Tactical-mode/assignment refresh | **UNCLEAR** — complex collective decision proxy | Plausible versus complex choice latency; no direct team-level anchor |
| `SHOT_SPEED` | 27 | m/s | Open-play foot-shot launch speed | **ANCHORED** — squarely inside elite shot measurements | KICK 25–35 m/s; raw value plausible. **SCALE ALERT** for shortened shot distance |
| `PLAYER_MIN_DIST` | 1.05 | m centre-to-centre | Hard player separation | **DESIGNED** — collision/crowding rule | Far wider than literal torso collision; **SCALE ALERT** |
| `PLAYER_CORE_RADIUS` | 0.525 | m | Stable kinematic body disc | **DESIGNED** — half the hard separation | Diameter 1.05 m exceeds adult shoulder/torso breadth; intentionally abstract |
| `BALL_RADIUS` | 0.11 | m | Physical ball radius for geometry/rendering | **ANCHORED** — size-5 ball | LAW-BALL 0.108–0.111 m; excellent match |

## `src/sim/mechanics.ts`

Grouped rows represent coherent inline parameter sets rather than every arithmetic zero or numerical guard.

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| `keeperReach` | `2.05 + 0.4 aggression + 0.5(reflex−0.5) + 0.12 cat` m; total about 1.80–2.82 m | Horizontal save/claim reach | **UNCLEAR** — physical reach and dive displacement are collapsed into one radius | Broadly plausible for adult GKs, but no dive-time dependence |
| `SAVE_STRETCH` | 1.35× reach | Fingertip save-attempt envelope | **DESIGNED** — explicitly engineered from sim 1v1 probes | Extends possible contact to about 2.43–3.81 m; external validation needed |
| Dive difficulty | baseline 1.15; floor 0.25; 40 m path | Save probability discount from line offset | **DESIGNED** — outcome model | No standalone physical constant |
| Angle coverage | line-offset scale 3 m | Keeper’s shot-cone coverage | **DESIGNED** — geometric save modifier | Real concept, but 3 m scale is not sourced |
| Orientation noise | `1 + misalign(0.9−0.6 technique)` | Across-body kick error | **DESIGNED** — attribute-response curve | Biomechanically sensible direction, unanchored magnitude |
| Orientation power loss | up to `0.22(1−0.4 technique)` | Across/back-body kick power | **DESIGNED** | No cited percentage anchor |
| `TOUCH_SPEED_COST.base` | speed span 8 m/s, weight 0.07; starts at 6 m/s and saturates at 14 | Ordinary first-touch failure | **DESIGNED** — documented shipped curve | Pass speeds are real, failure probabilities are not externally calibrated |
| `TOUCH_SPEED_COST.heavy` | span 16 m/s, weight 0.24; saturation at 22 | Experimental heavy-touch curve | **DESIGNED** — explicitly probe-selected | Upper endpoint matches BALL-TRACK |
| First-touch formula | base 1%; pressure +10 pp; blind +5 pp; technique factor 0.45–1.3; cap 40% | Miscontrol probability | **DESIGNED** — multi-factor outcome curve | Requires event/tracking calibration |
| Failed-touch response | ±0.8 rad; 3.5–6.5 m/s; 0.5 s cooldown | Loose-ball direction, speed and recovery | **DESIGNED** | Speeds plausible for a heavy touch |
| Offside epsilon | 0.2 m | Treats level within 20 cm as onside | **DESIGNED** — deterministic tolerance | IFAB has no 20 cm tolerance; explicit house deviation |
| Third-man recognition | 1.5 s, target >3 m ahead | Pass-pattern bookkeeping | **DESIGNED** | Tactical definition, not physics |
| One-touch noise multiplier | `1.15 + 0.9(1−dribbling)` = 1.15–2.05× | First-time pass error | **DESIGNED** | No direct empirical multiplier |
| `shotQuality` | `0.85 exp(−d/10)`; lateral −50%; pressure −30%; clamp 0.01–0.8 | Pre-shot xG | **DESIGNED** — deliberately simple outcome model | XG uses learned distance, angle, body part and context; the 10 m e-fold is not externally fitted |
| Ground-bend detection | 1.3 m lane threshold; 2 m endpoint exclusions | Whether through ball curves around a defender | **DESIGNED** — tactical geometry | No real fixed trigger |
| Ground curvature | 0.135–0.45 rad/s heading-rotation rate | Curled ground-pass path | **DESIGNED** — this is trajectory rotation, not physical ball spin | Cannot compare to ball rpm |
| Curled-pass weight error | `0.2 × curvature × (1.35−passing)` | Bend execution error | **DESIGNED** | No external anchor |
| Ground-pass lead | reference 16 m/s; 0.8 of projected receiver motion | Target point | **DESIGNED** | Reference speed is plausible; 0.8 lead fraction is tactical |
| Ground-pass speed envelope | `clamp(0.6d+8.2, 9, 22)` m/s | Ordinary pass launch | **ANCHORED** for the envelope; formula itself is designed | BALL-TRACK 7.9–22.3 and experienced side-foot 21.4 ±1.5: plausible |
| Ground-pass angular noise | `0.02 + 0.07 pressure + 0.0015d`, then style/skill multipliers | Pass accuracy | **DESIGNED** | Needs completion and endpoint-error data |
| Give-and-go gate | under 15 m; pressure >0.2; stamina >0.3; score >0.35; window 2.3 s | Wall-run activation | **DESIGNED** — tactical pattern timing | No single real anchor |
| Ground through-ball lead/speed | 18 m/s reference; 1.25× run lead; `10–24` m/s | Through-ball meeting point and pace | **UNCLEAR** — upper end exceeds typical pass validation but remains below hard shots | 24 m/s is slightly beyond BALL-TRACK and roughly a hard driven kick; not clearly outside |
| Lofted through-ball flight | `0.55 + 0.045d`, clamped 0.8–2.0 s | Chip-through hang time | **UNCLEAR** — real measurable, but delivery-dependent | Plausible range; no dataset-backed distance curve |
| Generic loft noise/range | angular base 0.03 rad; pressure 0.05; distance 0.0011/m; range error `0.02+0.0008d` | Loft accuracy | **DESIGNED** | No external calibration |
| Cross flight | `0.5 + 0.038d`, clamped 0.7–1.7 s | Cross hang time | **UNCLEAR** — plausible but not study-fitted | Typical visual range is plausible; aerodynamic drag is omitted |
| Cross goal pull | 0.18 | Pulls landing point toward goal | **DESIGNED** | Tactical choice |
| Cross curvature | 0.28–0.58 rad/s path rotation | Inswing | **DESIGNED** | Not physical spin rate |
| Keeper-throw flight | `0.62 + 0.03d`, clamped 0.9–1.5 s; lead 0.7; noise ×0.45 | Overarm distribution | **UNCLEAR** — physically interpretable but unsourced | Plausible for 8–30 m distribution |
| Cutback lead/speed | 18 m/s reference; 0.8 lead; `11–23` m/s | Driven pull-back | **UNCLEAR** — 23 m/s is at/just above maximal side-foot pass evidence | Aggressive but still within hard-kick plausibility |
| Aerial swing | defender considered inside 8 m; curvature 0.12–0.30 rad/s | Lofted switch bend | **DESIGNED** | Tactical abstraction |
| Lofted-switch flight | `0.55 + 0.033d`, clamped 1.1–2.1 s; lead 0.7 | Long diagonal trajectory | **UNCLEAR** | Plausible hang-time range; no drag makes long flights optimistic |
| `AERIAL_ROLE` | GK 0, DF .30, MF .14, WG .06, ST .26 | Header-duel role prior | **DESIGNED** | Explicit role balance |
| GK aerial radius | 1.9 m | Keeper eligible to claim high ball | **UNCLEAR** — static horizontal reach plus movement | Generous without time-to-arrival; plausible for a dive/step |
| GK aerial claim chance | `0.62 + 0.5(reflex−.5) − .3 crowd`; clamp .2–.9 | Cross collection | **DESIGNED** | Needs claim/punch event calibration |
| Header duel score | attack +0.3; proximity up to .35; RNG 0–.45 | Aerial winner | **DESIGNED** | Explicitly tuned game outcome |
| Header decision zones | shot inside 16.5 m; defensive clear inside 20 m | Header action selection | **DESIGNED** | 16.5 m borrows box depth but the sim box is only 9.1 m deep |
| Defensive-header velocity | 11–15 m/s horizontal; 3.5–5.2 m/s vertical | Header clearance | **UNCLEAR** | Incoming header-study speeds commonly 9–15 m/s; outgoing values need validation |
| Knockdown velocity | 7–9.5 m/s; `vz=0.8` | Header pass | **UNCLEAR** | Rather fast for a cushioned knockdown, but plausible for a firm header |
| Chest-trap spill | +5 pp failure; cap 50%; 3–5.5 m/s spill; 0.3 s commitment | Aerial first touch | **DESIGNED** | Outcome calibration absent |
| Headed-shot velocity | 15–19 m/s; downward `vz=−1.2` | Shot from header | **UNCLEAR** — material physical speed | Above many studied incoming-heading speeds; outgoing shot evidence is insufficient to mark outside |
| Header-shot xG | `0.5 exp(−d/8.5)`; cap .45 | Header chance quality | **DESIGNED** | Real xG distinguishes body part; this curve is not data-fitted |
| Chip feasibility | 7–30 m shot; keeper 2.5 m ahead and 5.5 m before goal; within 3.5 m of chord; ≥7.5 m off line; hang ≤1.45 s | Whether a chip is attempted | **DESIGNED** | Tactical spectacle gate |
| Ground-shot aim margin | `max(.4, 1.3−.6 finishing−.1 clinical)` m | Corner placement | **DESIGNED** | No external placement distribution |
| Ground-shot spread | `0.022 + .0028d + .05 contest`, skill/style multipliers | Shot accuracy | **DESIGNED** | Should ultimately be checked against post-shot xG/placement data |
| Shot curvature | 0.1–0.3 rad/s path rotation | Placed curler | **DESIGNED** | Not physical spin rate |
| Free-kick arrival height | 0.85–2.75 m | Under-/over-bar distribution | **DESIGNED** | Physically plausible |
| Free-kick wall clearance | `2.6 + 0.5 spin` m | Clears wall/header band | **DESIGNED** | Deliberately guarantees roughly 2.73–2.85 m clearance, unusually high for every successful solver |
| Free-kick flight | 0.9–1.9 s | Direct-FK trajectory | **UNCLEAR** | Plausible for common direct-FK distances |
| Free-kick xG | `0.09−.003(d−17)`, clamp .02–.12 | Set-piece chance value | **ANCHORED** at population scale | FK-RATE 4.72% lies inside the range, though distance curve remains designed |
| Dribble cone | 14 m range; approximately 70° cone; open-space cap 9 m | Size of open grass influencing push | **DESIGNED** | Tactical abstraction |
| Dribble-touch ball speed | carrier speed plus at least 0.8 m/s | Open carry touch | **DESIGNED** | Plausible construction, but should be checked against touch cadence/distance |
| Dribble-touch noise | `0.07(1.35−0.7 dribbling)` rad | Heavy-touch direction | **DESIGNED** | No external endpoint-error anchor |
| Dribble-touch ownership window | 1.6 s | Associates free ball with prior carrier | **DESIGNED** | Bookkeeping/tactical window |
| Clearance velocity | up to 23 m/s horizontal; 3.2–5.4 m/s vertical | Panic clearance | **ANCHORED** for total kick magnitude | Near maximal side-foot/hard-pass speeds and below strong shots |
| Deflection chance | `0.24 + .4 defending − .02(speed−14)`; clamp .05–.6 | Interception stretch success | **DESIGNED** | Requires event-rate and orientation calibration |
| Deflection output | ±1.2 rad; 4–8 m/s | Ricochet | **DESIGNED** | Plausible loose-ball speed |
| Smother radius | 1.3 m | Keeper-at-feet challenge | **UNCLEAR** — physical dive/lunge envelope | Generous static radius but plausible at speed |
| Smother success | base .56; reflex +.5; dribbler −.35; clamp .2–.85 | Keeper 1v1 outcome | **DESIGNED** | Requires real 1v1 outcome data |
| Recovery-slide reach | 1.2–2.2 m | From-behind slide eligibility | **UNCLEAR** — physical lunge distance | Plausible for a full slide, but instantaneous eligibility ignores time-to-contact |
| Slide-tackle attempt/win | attempt .05–.17; win base .16, clamp .05–.4; foul .4–.55 | Recovery tackle outcomes | **DESIGNED** | Needs tackle/foul census |
| Tactical-foul geometry | 16–34 m from goal; sprint ≥4.5 m/s; grab radius 1.7 m | Professional-foul opportunity | **DESIGNED** | Tactical abstraction |
| Standing tackle radius | 1.15 m | Normal tackle eligibility | **UNCLEAR** — foot/lunge reach | Plausible extended-leg envelope; large relative to compressed pitch |
| Standing tackle probability | base .25; clamp .06–.7 plus attributes/context | Ball-winning chance | **DESIGNED** | Needs real and sim duel calibration |
| Shot-block shell | height ≤1.1 m; radius .9 m; excludes final 6 m | Defender block eligibility | **UNCLEAR** for geometry | Height/radius plausible for legs/body; 6 m goalmouth exclusion is designed |
| Shot-block probability | `.32 + .25 defending`, readiness-scaled | Successful block | **DESIGNED** | Real block frequency is context-dependent |
| Keeper save gate | ball ≥6 m/s and ≤2.55 m high | Whether save logic runs | **DESIGNED/UNCLEAR** — physical thresholds but implementation gates | Slow shots rely on capture logic rather than saves |
| Keeper save curves | open base .48, xG slope −.45, reflex swing ±.14; placed base .70; caps .10/.92 | Save probability | **DESIGNED** | Outcome model should be checked against post-shot xG, not pre-shot xG alone |
| Catch threshold/chance | speed <21 m/s and 80% chance | Catch versus parry | **UNCLEAR** — handling depends on placement, spin and body position, not only speed | 21 m/s is a hard pass/medium shot; plausible threshold, unrealistic cliff |
| Parry response | 45% incoming speed, clamp 7–12 m/s; angle 0.55–1.15 rad | Saved-shot rebound | **DESIGNED** | No external calibration |

## `src/sim/Ball.ts`

| Numeric item | Value | What it governs | Class and reasoning | Anchor |
|---|---:|---|---|---|
| State initialisers/reset values | 0 | Position, velocity, height, spin and ownership reset | **DESIGNED** — neutral state, not a play parameter | No audit concern |
| `radius` | delegates to `BALL_RADIUS` = 0.11 m | Physical ball geometry | **ANCHORED** | See LAW-BALL and the `constants.ts` row |

There are no independent play-shaping inline numeric literals in this file.

## `src/sim/Player.ts`

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| `BASE_SPEED.GK` | 6.4 m/s | Keeper role baseline | **ANCHORED** — plausible role-specific top speed | Below outfielder peaks, consistent with GK role |
| `BASE_SPEED.DF` | 7.0 m/s | Defender baseline | **ANCHORED** | Pace attributes raise it to 7.84 m/s; plausible |
| `BASE_SPEED.MF` | 7.3 m/s | Midfielder baseline | **ANCHORED** | Maximum 8.18 m/s; plausible |
| `BASE_SPEED.WG` | 7.9 m/s | Winger baseline | **ANCHORED** | Maximum 8.85 m/s; matches RUN 8.1–9.1 |
| `BASE_SPEED.ST` | 7.7 m/s | Striker baseline | **ANCHORED** | Maximum 8.62 m/s; plausible |
| `ACCEL` | 14 m/s² | Velocity convergence toward desired motion | **UNCLEAR** — expressed as physical acceleration but likely compresses responsiveness | ACCEL 3.3–8.7; even ×1/0.7 similarity gives about 4.7–12.4: **OUTSIDE high** |
| `TURN_RATE` | 6.5 rad/s | Body facing rotation; 180° in 0.48 s | **UNCLEAR** — physically interpretable but not equivalent to a full change-of-direction test | Likely very agile; no clean study comparator |
| Pace multiplier | `0.88 + 0.24 pace` | ±12% role top-speed range | **DESIGNED** — attribute mapping | Resulting top speeds remain plausible |
| Acceleration multiplier | `0.9 + 0.2 pace` | 12.6–15.4 m/s² | **DESIGNED** mapping around an **UNCLEAR** base | Entire range remains above scaled theoretical elite upper values |
| Engine stamina multiplier | 0.9 | 10% slower drain | **DESIGNED** | Trait reward |
| Knock penalties | pace ×0.8; dribbling ×0.85 | Injury degradation | **DESIGNED** | No injury-severity mapping |
| Fatigue speed curve | `0.62 + 0.38 stamina` | Top speed under fatigue | **DESIGNED** — energy-economy choice | At typical stated end stamina 0.6–0.8, speed falls 7.6–15.2%, larger than ordinary match fatigue effects |
| Stun movement multiplier | 0.15 | Stumble/ground recovery motion | **DESIGNED** | Animation/gameplay state |
| Heading activation speed | 0.5 m/s | Only update facing from velocity above threshold | **DESIGNED** | Numerical stability/visual choice |
| Drain effort threshold | 0.55 of base speed | Switches recovery to quadratic drain | **DESIGNED** | Physiology is continuous, but threshold is gameplay economy |
| Minimum stamina | 0.05 | Prevents complete exhaustion | **DESIGNED** | Safety floor |

Raw top speeds are strong. The principal mismatch is acceleration: players reach those speeds much too quickly.

## `src/ai/prediction.ts`

The requested `src/sim/prediction.ts` does not exist. The live file is `src/ai/prediction.ts`.

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| Observation horizon | default/max 1.5 s | Constant-velocity player projection | **DESIGNED** — AI forecast horizon | Long enough that turns and accelerations make constant velocity unreliable |
| Power floor | 0.1× | Prevents non-positive pass power | **DESIGNED** — numerical guard | Not reached by normal 0.85–1.15 power range |
| Pass lead model | distance divided by `16 × power`; receiver motion ×0.8 | Predicted target point | **DESIGNED** | Mirrors mechanics exactly; 16 m/s is plausible but fixed |
| Launch formula | `clamp(0.6d+8.2, 9, 22) × power` m/s | Predicted ground-pass speed | **ANCHORED** for bounds | BALL-TRACK and experienced side-foot speeds support 9–22 m/s |
| Fixed-step arrival rounding | ceil to `DT`; epsilon `1e−12` | First engine tick reaching distance | **DESIGNED** — numerical fidelity | Correctly mirrors the deterministic integrator |
| Friction reachability | finite maximum `speed·DT/(1−exp(−kDT))` | Whether a pass can reach its point | **UNCLEAR** because inherited from `BALL_FRICTION_K` | Same high-speed braking concern as the runtime physics |

## Ranked shortlist: constants most deserving realism scrutiny

1. **`ACCEL = 14 m/s²`**  
   It controls separation, pressing, recovery and keeper rushes. The resulting 12.6–15.4 m/s² player range exceeds measured and theoretical elite-football values even after granting the 0.7 field-compression allowance.

2. **`BALL_FRICTION_K = 0.55 s⁻¹`**  
   It governs every ground pass and dribble push. Overall low-speed roll-out can look plausible, but the exponential form produces excessive braking at hard-pass speeds and differs from published turf behaviour.

3. **`CONTROL_RADIUS = 1.25 m`**  
   This is a very large centre-to-ball interaction shell, remains unscaled on the compressed pitch, and feeds control, interceptions and loose-ball contests. Small changes could alter possession ecology everywhere.

4. **`SPEED_TIME_SCALE = 1`**  
   It documents the decision to retain real raw speeds on a 0.7 pitch, creating 43% faster pitch-relative transit—and it currently has no runtime consumer. This is the global spatial/temporal realism coupling.

5. **`BOX_WIDTH = 19.6 m`**  
   It is 30.6% narrower than a true ×0.7 penalty area. Together with `BOX_DEPTH`, it changes keeper handling, penalties, shot zones, defensive shape and aerial decisions, so this is more than cosmetic scaling.

6. **`AI_INTERVAL = 0.15 s`**  
   It is faster than the roughly 0.20 s lower bound commonly used for post-stimulus human reaction, before decision and movement time. Because it is a scheduler rather than explicit reaction latency, its effective consequences need tracing.

7. **`PLAYER_MIN_DIST = 1.05 m`**  
   The hard separation diameter is much larger than literal body breadth and is unscaled. In 6v6 it materially determines block density, pressing lanes, screening and whether multiple players can contest the same ball.

8. **`BALL_BOUNCE = 0.45`**  
   It gives only about 0.405 m rebound from a 2 m drop, below FIFA-quality turf’s 0.60–0.85 m band. It will make lofted balls settle early and suppress second-bounce/aerial chaos.

9. **Inline `SAVE_STRETCH = 1.35`**  
   It expands keeper attempt reach by 35%, potentially to nearly 3.8 m, and was tuned from sim goal anatomy rather than external dive-time/reach evidence. It directly governs whether a shot receives any save roll.

10. **Inline `shotQuality` distance scale `exp(−d/10)`**  
    This single 10 m e-fold drives xG, keeper saves and evolutionary shot selection. Real xG is learned from distance, angle, body part, assist type and defender/GK context; this compact curve therefore has unusually large systemic leverage.
[2mtokens used[0m
278,069
# Realism Ledger — first draft

Static audit of the shipped defaults on 26 July 2026. No code was changed.

Two interpretation rules matter:

- Spatial geometry using `FIELD_SCALE` or `GOAL_AND_BOX_SCALE` is compared with both the unscaled Laws and a ×0.7 similarity target.
- Bodies, reach, speed and time are explicitly unscaled, so they are judged first in raw SI units. Where raw values are plausible but make play 1/0.7 ≈ 43% faster or larger relative to the pitch, I mark a **SCALE ALERT** rather than automatically calling them unrealistic.

`OUTSIDE` means the value falls outside a published range or an exact law-derived scaled value. `FORM MISMATCH` means the real quantity exists, but the simulation’s mathematical form prevents a clean one-number comparison.

## Anchor basis

- **LAW-GEO:** IFAB Law 1: full pitches 90–120 × 45–90 m; international 100–110 × 64–75 m; goal 7.32 × 2.44 m; penalty area 16.5 m deep and 40.32 m wide; penalty mark 11 m; centre/penalty arcs 9.15 m. [IFAB Law 1](https://www.theifab.com/laws/latest/the-field-of-play/?side-menu-open=true)
- **LAW-BALL:** circumference 68–70 cm, implying radius 0.108–0.111 m. [IFAB Law 2](https://www.theifab.com/laws/latest/the-ball/)
- **LAW-RESTART:** free kicks and corners require 9.15 m; penalties also 9.15 m plus positional restrictions; throw-ins require 2 m. [Free kicks](https://www.theifab.com/laws/latest/free-kicks/), [penalties](https://theifab.com/laws/latest/the-penalty-kick/), [corners](https://www.theifab.com/laws/latest/the-corner-kick/), [throw-ins](https://www.theifab.com/laws/latest/the-throw-in/)
- **GRAVITY:** standard gravity is 9.80665 m/s². [NIST SI guide](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8)
- **TURF-ROLL:** FIFA/UEFA-style test ball starts around 3.2 m/s and should roll roughly 4–8 m; published turf measurements give deceleration near `0.40 + 0.17v`, about 0.8–1.0 m/s² at 2.5 m/s. [Kolitzus, *Ball Roll Behavior*](https://www.isss-sportsurfacescience.org/downloads/documents/ZPKPAJJUWY_Ball_Roll_BehaviorKS.pdf)
- **TURF-BOUNCE:** FIFA Quality Pro vertical rebound is 0.60–0.85 m from a 2 m drop, equivalent to vertical restitution about 0.55–0.65. [FIFA Football Turf requirements](https://www.footballvictoria.com.au/sites/ffv/files/2023-04/FIFA_Quality_Manual_Handbook-of-requirements-2015.pdf)
- **RUN:** observed elite peak match speeds are about 8.1–8.8 m/s, with a larger study reporting 9.14 ± 0.39 m/s. [Peak-speed study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11694206/), [professional sprint study](https://pmc.ncbi.nlm.nih.gov/articles/PMC11167479/)
- **ACCEL:** reported maximum match acceleration is about 3.3–5.4 m/s²; theoretical acceleration-speed profiles reach about 5.7–8.7 m/s². [Velocity/acceleration review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11769499/)
- **KICK:** experienced side-foot kicks averaged 21.4 ± 1.5 m/s; elite male maximal shots are commonly about 25–35 m/s. [Nunome et al.](https://pubmed.ncbi.nlm.nih.gov/17892095/), [Kellis/Lees review material](https://jssm.org/volume10/iss1/cap/jssm-10-203.pdf)
- **BALL-TRACK:** 7.9–22.3 m/s was used as a realistic pass/ball-speed validation range; deliberate passes are detectable from roughly 8 m/s. [Tracking validation](https://www.sciencedirect.com/science/article/pii/S1877705816306919), [World Cup tracking study](https://www.mdpi.com/2076-3417/15/15/8694)
- **REACTION:** football/futsal goalkeeper work commonly separates anticipation from post-stimulus reaction at about 200 ms. [Futsal goalkeeper reaction study](https://www.scielo.br/j/jpe/a/r4WYtRNtR47vWJp4v8vzGFg/)
- **XG:** real xG models learn from thousands of shots and normally include distance, angle, body part and assist type; richer models add player and goalkeeper locations. [StatsBomb xG methodology](https://statsbomb.com/soccer-metrics/expected-goals-xg-explained/)
- **FK-RATE:** an observed Premier League direct-free-kick conversion rate was 4.72%. [Premier League analysis](https://www.premierleague.com/en/news/693397)
- **AERO:** real ball drag is strongly speed- and ball-dependent; aerodynamic simulations show material reductions in flight time and range versus vacuum trajectories. [Soccer-ball drag study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4038026/), [full-flight simulation](https://link.springer.com/article/10.1007/s00466-025-02705-2)
- **SPIN:** measured spin decay depends on the product of initial spin and forward speed, rather than a universal fixed exponential rate. [Barber et al., *The spin decay of sports balls in flight*](https://shura.shu.ac.uk/2132/)
- **GK/JUMP:** professional goalkeepers are usually over 1.80 m and jump higher than outfield players; soccer jump research does not support a universal contact-height cutoff. [Ziv & Lidor review](https://doi.org/10.1123/ijspp.6.4.509), [elite-soccer jump review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11467003/)

## `src/sim/constants.ts`

| Name | Shipped value | Unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---:|---|---|---|---|
| `LEGACY_PITCH_SCALE` | unset; optional env | ratio | Legacy source for field and goal/box scale | **DESIGNED** — compatibility/probe control, not football physics | No counterpart |
| `FIELD_SCALE` | 0.7 | ratio | Pitch dimensions and centre circle | **DESIGNED** — explicit density compression | Produces a lawful scaled general pitch, but not a scaled international-width pitch |
| `GOAL_AND_BOX_SCALE` | 0.7 | ratio | Goal width and penalty-box geometry | **DESIGNED** — explicitly decoupled geometry compression | Individual derived dimensions below reveal non-uniform scaling |
| `BODY_SCALE` | 1 | ratio | Minimum player separation/core size | **DESIGNED** — body geometry deliberately remains unscaled | **SCALE ALERT:** bodies are 43% larger relative to the pitch |
| `CONTROL_REACH_SCALE` | 1 | ratio | Ball-control radius | **DESIGNED** — reach remains unscaled | **SCALE ALERT:** reach is 43% larger relative to the pitch |
| `SPEED_TIME_SCALE` | 1; currently unused | ratio | Intended authority for speed/time scaling | **DESIGNED** — declared world-model choice, but no consumer uses it | **SCALE ALERT:** physical speeds on a ×0.7 field imply 43% faster pitch-relative transit |
| `PITCH_LENGTH` | 63 | m | Goal-line-to-goal-line extent | **DESIGNED** — `90 × 0.7` | LAW-GEO scaled general range 63–84 m: inside; scaled international 70–77 m: below |
| `PITCH_WIDTH` | 40.6 | m | Touchline-to-touchline extent | **DESIGNED** — `58 × 0.7` | LAW-GEO scaled general range 31.5–63 m: inside; scaled international 44.8–52.5 m: **OUTSIDE** |
| `HALF_L` | 31.5 | m | Longitudinal boundary and formation coordinate | **DESIGNED** — exact derivative of designed pitch | Same verdict as `PITCH_LENGTH` |
| `HALF_W` | 20.3 | m | Lateral boundary and formation coordinate | **DESIGNED** — exact derivative of designed pitch | Same verdict as `PITCH_WIDTH` |
| `OUT_PLAY_COAST` | 0.5 | s | Visual coast before goal-line restart | **DESIGNED** — presentation delay | No real-law counterpart |
| `GOAL_WIDTH` | 4.9 | m | Goal mouth, aiming and scoring | **DESIGNED** — scaled arcade goal | LAW-GEO ×0.7 target is 5.124 m: **OUTSIDE −4.4%** |
| `GOAL_DEPTH` | 2.2 | m | Rendered net depth | **DESIGNED** — goal depth is not fixed by the Laws | Plausible installation value; little gameplay effect |
| `GOAL_HEIGHT` | 2.44 | m | Crossbar and over-bar test | **ANCHORED** — exact IFAB height | Exact LAW-GEO value; **SCALE ALERT** because width is scaled but height is not |
| `BOX_DEPTH` | 9.1 | m | Penalty-area depth and keeper-hand boundary | **DESIGNED** — scaled custom box | LAW-GEO ×0.7 target 11.55 m: **OUTSIDE −21.2%** |
| `BOX_WIDTH` | 19.6 | m | Penalty-area width | **DESIGNED** — scaled custom box | LAW-GEO ×0.7 target 28.224 m: **OUTSIDE −30.6%** |
| `CENTER_CIRCLE_R` | 4.9 | m | Drawn centre circle | **DESIGNED** — compressed restart geometry | LAW-GEO ×0.7 target 6.405 m: **OUTSIDE −23.5%** |
| `DT` | 1/60 = 0.01667 | s/tick | Fixed integration timestep | **DESIGNED** — numerical resolution | Not a football observable |
| `MATCH_DURATION` | 240 | sim s | Full match mapped to displayed 90 minutes | **DESIGNED** — time compression | One sim second represents 22.5 displayed seconds |
| `STOPPAGE_MAX` | 8 | sim s | Maximum safe-break extension per half | **DESIGNED** — about three displayed minutes | Added time is empirical, not a fixed law value |
| `SURFACE_PROFILE` | seven fields below | mixed | Single turf-response authority | **UNCLEAR** — physical intent, but not calibrated to a named surface | See field-level verdicts |
| `SURFACE_PROFILE.ballFrictionK` | 0.55 | s⁻¹ | Exponential ground-speed decay | **UNCLEAR** — real turf deceleration is speed-dependent but not simply proportional across pass speeds | At 3.2 m/s it gives 5.82 m asymptotic roll, within 4–8 m; at 2.5 m/s it gives 1.375 m/s² versus 0.8–1.0: **OUTSIDE locally / FORM MISMATCH** |
| `SURFACE_PROFILE.ballBounce` | 0.45 | restitution | Vertical rebound velocity fraction | **UNCLEAR** — directly physical but low versus pitch tests | Two-metre drop rebounds about 0.405 m; TURF-BOUNCE says 0.60–0.85 m: **OUTSIDE** |
| `SURFACE_PROFILE.bounceDamp` | 0.72 | ratio | Horizontal speed retained after bounce | **UNCLEAR** — real value depends on angle, spin, turf and ball | No defensible universal point anchor |
| `SURFACE_PROFILE.bounceMinVz` | 2.2 | m/s | Vertical impact below which the ball settles | **UNCLEAR** — physical transition represented as a hard cliff | Real settling is continuous; no published universal cutoff |
| `SURFACE_PROFILE.airSpinDecay` | 0.25 | s⁻¹ | Exponential decay of curvature rate in air | **UNCLEAR** — physical counterpart exists | SPIN finds decay depends on speed × spin: **FORM MISMATCH** |
| `SURFACE_PROFILE.groundSpinDecay` | 1.5 | s⁻¹ | Exponential decay of curvature rate on turf | **UNCLEAR** — surface-dependent physical effect | No suitable one-number football anchor located |
| `SURFACE_PROFILE.bounceSpinRetention` | 0.55 | ratio | Curvature retained at bounce | **UNCLEAR** — impact/spin coupling is physical but state-dependent | No universal point anchor |
| `BALL_FRICTION_K` | 0.55 | s⁻¹ | Runtime alias for ground decay | **UNCLEAR** — same physical model as profile field | Same mixed/OUTSIDE verdict as `ballFrictionK` |
| `BALL_AIR_SPIN_DECAY` | 0.25 | s⁻¹ | Runtime air-spin alias | **UNCLEAR** | SPIN: **FORM MISMATCH**; moreover airborne translational speed has no drag |
| `BALL_GROUND_SPIN_DECAY` | 1.5 | s⁻¹ | Runtime ground-spin alias | **UNCLEAR** | Surface-specific calibration required |
| `BALL_BOUNCE_SPIN_RETENTION` | 0.55 | ratio | Runtime bounce-spin alias | **UNCLEAR** | Impact-specific calibration required |
| `STAMINA_DRAIN` | 0.01 | stamina/s at effort² | High-effort fatigue | **DESIGNED** — comments explicitly price the sim’s energy economy | Cannot map directly through the 240 s → 90 min clock |
| `STAMINA_RECOVERY` | 0.009 | stamina/s | Jog/idle recovery | **DESIGNED** — tuned against sim end-state stamina | Same mapping problem |
| `TACKLE_LUNGE_COST` | 0.02 | stamina/attempt | Flat tackle burst cost | **DESIGNED** — explicit gameplay price | No physiological one-attempt equivalent |
| `DEFLECT_BLIND_PEN` | 0.75 | probability multiplier | Up to 75% reduction for blind drilled-ball deflection | **DESIGNED** — explicit anti-omniscience lever | Requires sim event calibration |
| `CONTACT_BLIND_PEN` | 0.7 | probability multiplier | Blind-side contact penalty | **DESIGNED** — explicit interception/cutback tuning | Requires sim event calibration |
| `UNSET_BLOCK_WEIGHT` | 0.55 | ratio | Minimum effectiveness of moving/blind shot blockers | **DESIGNED** — explicit shot-channel tuning | Requires shot/block census |
| `CROSS_LEAD_FRAC` | 0.4 | ratio | Fraction of receiver motion used to lead crosses | **DESIGNED** — meetability correction | No direct real constant |
| `CROSS_LEAD_MAX` | 3.5 | m | Maximum cross lead | **DESIGNED** — caps evolved delivery geometry | Plausible movement lead, but context-dependent |
| `GRAVITY` | 9.81 | m/s² | Lofted-ball vertical acceleration | **ANCHORED** — Earth gravity | NIST 9.80665; excellent match |
| `BALL_BOUNCE` | 0.45 | restitution | Runtime vertical bounce | **UNCLEAR** | TURF-BOUNCE: **OUTSIDE low** |
| `BOUNCE_DAMP` | 0.72 | ratio | Runtime horizontal bounce damping | **UNCLEAR** | No universal point anchor |
| `BOUNCE_MIN_VZ` | 2.2 | m/s | Runtime settling threshold | **UNCLEAR** | Hard-cliff model lacks direct anchor |
| `CONTROL_MAX_HEIGHT` | 1.3 | m | Highest foot/ordinary control contact | **UNCLEAR** — anatomical/mechanical counterpart, but skill-dependent | Roughly waist/upper-thigh height; plausible, low confidence |
| `HEADER_MIN_HEIGHT` | 1.35 | m | Bottom of header-only contest band | **UNCLEAR** — players can stoop or use feet/chest at overlapping heights | Plausible transition, not a physical hard boundary |
| `HEADER_MAX_HEIGHT` | 2.5 | m | Highest outfielder header contact | **UNCLEAR** — represents stature plus jump | GK/JUMP suggests normal elite contact is mostly lower; 2.5 m is exceptional but plausible |
| `HEADER_RADIUS` | 1.35 | m | Horizontal centre-to-ball header reach | **UNCLEAR** — combines run, lean and jump into one radius | Generous relative to static anatomy; **SCALE ALERT** |
| `CHEST_TRAP_MAX_HEIGHT` | 1.7 | m | Highest chest/thigh control | **UNCLEAR** — depends strongly on stature | Plausible for adult players |
| `CHEST_TRAP_RADIUS` | 1.05 | m | Horizontal chest-trap reach | **UNCLEAR** — represents positioning, not literal torso reach | Generous but plausible as a movement envelope |
| `CHEST_TRAP_MAX_VZ` | 1.5 | m/s upward | Rising-ball trap gate | **UNCLEAR** — technique-dependent, no standard cutoff | No defensible published threshold |
| `GK_CLAIM_HEIGHT` | 2.55 | m | Highest keeper catch/save contact | **UNCLEAR** — stature, arm reach, jump and dive combined | GK/JUMP makes 2.4–2.8 m broadly plausible |
| `GK_HOLD_CLEARANCE` | 3 | m | Pushes opponents away from held keeper | **DESIGNED** — Laws prohibit challenge but prescribe no radius | Not law-anchored |
| `RESTART_CLEARANCE` | 6 | m | Generic kick-in/goal-kick clearance circle | **DESIGNED** — house-rule compromise | Real references vary: throw-in 2 m, free kick 9.15 m |
| `CORNER_CLEARANCE` | 9.15 | m | Corner and free-kick defender distance | **ANCHORED** — exact IFAB distance | Exact raw law; **SCALE ALERT:** 43% oversized relative to ×0.7 similarity |
| `PENALTY_SPOT_DIST` | 6.552 | m | Penalty mark from goal line | **DESIGNED** — `BOX_DEPTH × 0.72`, not law-derived | LAW-GEO ×0.7 target 7.7 m: **OUTSIDE −14.9%** |
| `PENALTY_CLEARANCE` | 8 | m | All non-taker/non-GK penalty setup clearance | **UNCLEAR** — partly law-like but inconsistent with both scaling conventions | Law is 9.15 m; scaled analogue 6.405 m. Value is 12.6% low raw and 24.9% high scaled |
| `RESTART_MIN_SETUP` | 1 | s | Minimum generic dead-ball setup | **DESIGNED** — pacing | No generic law minimum |
| `RESTART_TIMEOUT` | 6 | s | Failsafe forced restart | **DESIGNED** — anti-stall mechanism | Comparable to newer five/eight-second protocols only loosely |
| `CONTROL_RADIUS` | 1.25 | m centre-to-ball | Free-ball contact/control envelope | **UNCLEAR** — physical reach plus locomotion collapsed into one radius | Large for routine foot control; plausible only as an extended lunge. **SCALE ALERT** |
| `BALL_ACCESS_SIDE_EXTENSION_FACTOR` | 1 | ratio | Full side-sector leg extension | **DESIGNED** — oriented contact-shell rule | No external constant |
| `BALL_ACCESS_BACK_EXTENSION_FACTOR` | 0.9 | ratio | Rear-sector extension | **DESIGNED** — allows near-full back-heel reach | No external constant |
| `CONTEST_RADIUS` | 3 | m | Loose-ball contest classification | **DESIGNED** — telemetry/classification boundary | Not currently the physical duel radius |
| `CONTROL_MAX_SPEED` | 14 | m/s | Max surprise/bystander capture speed | **UNCLEAR** — hard cutoff on a continuous control problem | Inside BALL-TRACK range; intended targets separately receive a 24 m/s override |
| `GK_CONTROL_MAX_SPEED` | 23 | m/s | Keeper capture speed limit | **UNCLEAR** — hard handling threshold | Near top of pass range and below maximal-shot range; plausible but not a real cliff |
| `CONTACT_CONTROL_DELAY_TICKS` | 3 = 0.05 s | ticks/s | Contact-to-possession separation | **DESIGNED** — substrate arbitration window | Much longer than ball-foot impact, shorter than human reaction; not meant as either |
| `CONTACT_COMMIT_TIME` | 0.08 | s | Minimum post-contact commitment | **DESIGNED** — prevents immediate competing claim | No direct anchor |
| `CONTACT_CONTROL_RETENTION_MARGIN` | 0.02 | m | Reach tolerance at delayed claim | **DESIGNED** — numerical/interaction hysteresis | No real counterpart |
| `CONTACT_RELEASE_MIN_SPEED` | 0.25 | m/s | Minimum normal ball separation after contact | **DESIGNED** — avoids a glued independent ball | No direct calibration |
| `CONTACT_RELEASE_MAX_SPEED` | 1.2 | m/s | Maximum normal release after cushioning | **DESIGNED** — caps touch rebound | Plausible touch speed; calibration absent |
| `CONTACT_RELEASE_INCOMING_SHARE` | 0.12 | ratio | Incoming normal speed retained | **DESIGNED** — contact response coefficient | No published football-specific constant |
| `CONTACT_TANGENTIAL_RETENTION` | 0.35 | ratio | Tangential motion retained at contact | **DESIGNED** — contact response coefficient | No published football-specific constant |
| `DEFLECT_MAX_SPEED` | 24 | m/s | Upper speed for pass deflection | **UNCLEAR** — leg contact remains possible above control pace | Just above BALL-TRACK pass range but below maximal shots; plausible |
| `KICK_COOLDOWN` | 0.45 | s | Re-capture ban after kick | **DESIGNED** — explicitly lets passes leave | Not a physiological kick-cycle measurement |
| `PASS_POWER_MIN` | 0.85 | ratio | Lowest intended pass weighting | **DESIGNED** — game input range | No direct real constant |
| `PASS_POWER_MAX` | 1.15 | ratio | Highest intended pass weighting | **DESIGNED** | No direct real constant |
| `PASS_POWER_NOISE_K` | 0.60 | σ coefficient | Error from non-neutral pass weighting | **DESIGNED** — attribute curve | Requires completion/error calibration |
| `PASS_POWER_EXECUTED_MIN` | 0.70 | ratio | Lower clamp on mis-hit power | **DESIGNED** — numerical sanity bound | No direct real anchor |
| `PASS_POWER_EXECUTED_MAX` | 1.30 | ratio | Upper clamp on mis-hit power | **DESIGNED** | No direct real anchor |
| `TOUCH_CONTROL_DIST` | 4.2 | m | Opponent distance above which open dribble touches occur | **DESIGNED** — carry-regime switch | No universal pressure distance |
| `TOUCH_PUSH_BASE` | 0.9 | m/s | Base ball speed added on open touch | **DESIGNED** — visible-touch pacing | Plausible small nudge |
| `TOUCH_PUSH_SPACE` | 0.32 | (m/s)/m | Added push speed per metre of open cone | **DESIGNED** — tuned knock-and-run gradient | No direct anchor |
| `TOUCH_RECOLLECT_BASE` | 0.26 | s | Minimum no-recapture interval after push | **DESIGNED** — poke/chase window | Roughly one running step, but not study-derived |
| `TOUCH_RECOLLECT_PER_PUSH` | 0.04 | s per m/s | Extra chase time with touch strength | **DESIGNED** | No direct anchor |
| `GK_RUSH_ENVELOPE` | 5 | m | Treats open grass near keeper as covered | **DESIGNED** — tactical abstraction | Plausible one-second coverage at GK running speed |
| `AI_INTERVAL` | 0.15 | s | Individual action re-evaluation | **UNCLEAR** — resembles perception/decision latency but is actually a scheduler | REACTION ≈0.20 s even before movement: **POTENTIALLY OUTSIDE fast** |
| `TEAM_AI_INTERVAL` | 0.4 | s | Tactical-mode/assignment refresh | **UNCLEAR** — complex collective decision proxy | Plausible versus complex choice latency; no direct team-level anchor |
| `SHOT_SPEED` | 27 | m/s | Open-play foot-shot launch speed | **ANCHORED** — squarely inside elite shot measurements | KICK 25–35 m/s; raw value plausible. **SCALE ALERT** for shortened shot distance |
| `PLAYER_MIN_DIST` | 1.05 | m centre-to-centre | Hard player separation | **DESIGNED** — collision/crowding rule | Far wider than literal torso collision; **SCALE ALERT** |
| `PLAYER_CORE_RADIUS` | 0.525 | m | Stable kinematic body disc | **DESIGNED** — half the hard separation | Diameter 1.05 m exceeds adult shoulder/torso breadth; intentionally abstract |
| `BALL_RADIUS` | 0.11 | m | Physical ball radius for geometry/rendering | **ANCHORED** — size-5 ball | LAW-BALL 0.108–0.111 m; excellent match |

## `src/sim/mechanics.ts`

Grouped rows represent coherent inline parameter sets rather than every arithmetic zero or numerical guard.

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| `keeperReach` | `2.05 + 0.4 aggression + 0.5(reflex−0.5) + 0.12 cat` m; total about 1.80–2.82 m | Horizontal save/claim reach | **UNCLEAR** — physical reach and dive displacement are collapsed into one radius | Broadly plausible for adult GKs, but no dive-time dependence |
| `SAVE_STRETCH` | 1.35× reach | Fingertip save-attempt envelope | **DESIGNED** — explicitly engineered from sim 1v1 probes | Extends possible contact to about 2.43–3.81 m; external validation needed |
| Dive difficulty | baseline 1.15; floor 0.25; 40 m path | Save probability discount from line offset | **DESIGNED** — outcome model | No standalone physical constant |
| Angle coverage | line-offset scale 3 m | Keeper’s shot-cone coverage | **DESIGNED** — geometric save modifier | Real concept, but 3 m scale is not sourced |
| Orientation noise | `1 + misalign(0.9−0.6 technique)` | Across-body kick error | **DESIGNED** — attribute-response curve | Biomechanically sensible direction, unanchored magnitude |
| Orientation power loss | up to `0.22(1−0.4 technique)` | Across/back-body kick power | **DESIGNED** | No cited percentage anchor |
| `TOUCH_SPEED_COST.base` | speed span 8 m/s, weight 0.07; starts at 6 m/s and saturates at 14 | Ordinary first-touch failure | **DESIGNED** — documented shipped curve | Pass speeds are real, failure probabilities are not externally calibrated |
| `TOUCH_SPEED_COST.heavy` | span 16 m/s, weight 0.24; saturation at 22 | Experimental heavy-touch curve | **DESIGNED** — explicitly probe-selected | Upper endpoint matches BALL-TRACK |
| First-touch formula | base 1%; pressure +10 pp; blind +5 pp; technique factor 0.45–1.3; cap 40% | Miscontrol probability | **DESIGNED** — multi-factor outcome curve | Requires event/tracking calibration |
| Failed-touch response | ±0.8 rad; 3.5–6.5 m/s; 0.5 s cooldown | Loose-ball direction, speed and recovery | **DESIGNED** | Speeds plausible for a heavy touch |
| Offside epsilon | 0.2 m | Treats level within 20 cm as onside | **DESIGNED** — deterministic tolerance | IFAB has no 20 cm tolerance; explicit house deviation |
| Third-man recognition | 1.5 s, target >3 m ahead | Pass-pattern bookkeeping | **DESIGNED** | Tactical definition, not physics |
| One-touch noise multiplier | `1.15 + 0.9(1−dribbling)` = 1.15–2.05× | First-time pass error | **DESIGNED** | No direct empirical multiplier |
| `shotQuality` | `0.85 exp(−d/10)`; lateral −50%; pressure −30%; clamp 0.01–0.8 | Pre-shot xG | **DESIGNED** — deliberately simple outcome model | XG uses learned distance, angle, body part and context; the 10 m e-fold is not externally fitted |
| Ground-bend detection | 1.3 m lane threshold; 2 m endpoint exclusions | Whether through ball curves around a defender | **DESIGNED** — tactical geometry | No real fixed trigger |
| Ground curvature | 0.135–0.45 rad/s heading-rotation rate | Curled ground-pass path | **DESIGNED** — this is trajectory rotation, not physical ball spin | Cannot compare to ball rpm |
| Curled-pass weight error | `0.2 × curvature × (1.35−passing)` | Bend execution error | **DESIGNED** | No external anchor |
| Ground-pass lead | reference 16 m/s; 0.8 of projected receiver motion | Target point | **DESIGNED** | Reference speed is plausible; 0.8 lead fraction is tactical |
| Ground-pass speed envelope | `clamp(0.6d+8.2, 9, 22)` m/s | Ordinary pass launch | **ANCHORED** for the envelope; formula itself is designed | BALL-TRACK 7.9–22.3 and experienced side-foot 21.4 ±1.5: plausible |
| Ground-pass angular noise | `0.02 + 0.07 pressure + 0.0015d`, then style/skill multipliers | Pass accuracy | **DESIGNED** | Needs completion and endpoint-error data |
| Give-and-go gate | under 15 m; pressure >0.2; stamina >0.3; score >0.35; window 2.3 s | Wall-run activation | **DESIGNED** — tactical pattern timing | No single real anchor |
| Ground through-ball lead/speed | 18 m/s reference; 1.25× run lead; `10–24` m/s | Through-ball meeting point and pace | **UNCLEAR** — upper end exceeds typical pass validation but remains below hard shots | 24 m/s is slightly beyond BALL-TRACK and roughly a hard driven kick; not clearly outside |
| Lofted through-ball flight | `0.55 + 0.045d`, clamped 0.8–2.0 s | Chip-through hang time | **UNCLEAR** — real measurable, but delivery-dependent | Plausible range; no dataset-backed distance curve |
| Generic loft noise/range | angular base 0.03 rad; pressure 0.05; distance 0.0011/m; range error `0.02+0.0008d` | Loft accuracy | **DESIGNED** | No external calibration |
| Cross flight | `0.5 + 0.038d`, clamped 0.7–1.7 s | Cross hang time | **UNCLEAR** — plausible but not study-fitted | Typical visual range is plausible; aerodynamic drag is omitted |
| Cross goal pull | 0.18 | Pulls landing point toward goal | **DESIGNED** | Tactical choice |
| Cross curvature | 0.28–0.58 rad/s path rotation | Inswing | **DESIGNED** | Not physical spin rate |
| Keeper-throw flight | `0.62 + 0.03d`, clamped 0.9–1.5 s; lead 0.7; noise ×0.45 | Overarm distribution | **UNCLEAR** — physically interpretable but unsourced | Plausible for 8–30 m distribution |
| Cutback lead/speed | 18 m/s reference; 0.8 lead; `11–23` m/s | Driven pull-back | **UNCLEAR** — 23 m/s is at/just above maximal side-foot pass evidence | Aggressive but still within hard-kick plausibility |
| Aerial swing | defender considered inside 8 m; curvature 0.12–0.30 rad/s | Lofted switch bend | **DESIGNED** | Tactical abstraction |
| Lofted-switch flight | `0.55 + 0.033d`, clamped 1.1–2.1 s; lead 0.7 | Long diagonal trajectory | **UNCLEAR** | Plausible hang-time range; no drag makes long flights optimistic |
| `AERIAL_ROLE` | GK 0, DF .30, MF .14, WG .06, ST .26 | Header-duel role prior | **DESIGNED** | Explicit role balance |
| GK aerial radius | 1.9 m | Keeper eligible to claim high ball | **UNCLEAR** — static horizontal reach plus movement | Generous without time-to-arrival; plausible for a dive/step |
| GK aerial claim chance | `0.62 + 0.5(reflex−.5) − .3 crowd`; clamp .2–.9 | Cross collection | **DESIGNED** | Needs claim/punch event calibration |
| Header duel score | attack +0.3; proximity up to .35; RNG 0–.45 | Aerial winner | **DESIGNED** | Explicitly tuned game outcome |
| Header decision zones | shot inside 16.5 m; defensive clear inside 20 m | Header action selection | **DESIGNED** | 16.5 m borrows box depth but the sim box is only 9.1 m deep |
| Defensive-header velocity | 11–15 m/s horizontal; 3.5–5.2 m/s vertical | Header clearance | **UNCLEAR** | Incoming header-study speeds commonly 9–15 m/s; outgoing values need validation |
| Knockdown velocity | 7–9.5 m/s; `vz=0.8` | Header pass | **UNCLEAR** | Rather fast for a cushioned knockdown, but plausible for a firm header |
| Chest-trap spill | +5 pp failure; cap 50%; 3–5.5 m/s spill; 0.3 s commitment | Aerial first touch | **DESIGNED** | Outcome calibration absent |
| Headed-shot velocity | 15–19 m/s; downward `vz=−1.2` | Shot from header | **UNCLEAR** — material physical speed | Above many studied incoming-heading speeds; outgoing shot evidence is insufficient to mark outside |
| Header-shot xG | `0.5 exp(−d/8.5)`; cap .45 | Header chance quality | **DESIGNED** | Real xG distinguishes body part; this curve is not data-fitted |
| Chip feasibility | 7–30 m shot; keeper 2.5 m ahead and 5.5 m before goal; within 3.5 m of chord; ≥7.5 m off line; hang ≤1.45 s | Whether a chip is attempted | **DESIGNED** | Tactical spectacle gate |
| Ground-shot aim margin | `max(.4, 1.3−.6 finishing−.1 clinical)` m | Corner placement | **DESIGNED** | No external placement distribution |
| Ground-shot spread | `0.022 + .0028d + .05 contest`, skill/style multipliers | Shot accuracy | **DESIGNED** | Should ultimately be checked against post-shot xG/placement data |
| Shot curvature | 0.1–0.3 rad/s path rotation | Placed curler | **DESIGNED** | Not physical spin rate |
| Free-kick arrival height | 0.85–2.75 m | Under-/over-bar distribution | **DESIGNED** | Physically plausible |
| Free-kick wall clearance | `2.6 + 0.5 spin` m | Clears wall/header band | **DESIGNED** | Deliberately guarantees roughly 2.73–2.85 m clearance, unusually high for every successful solver |
| Free-kick flight | 0.9–1.9 s | Direct-FK trajectory | **UNCLEAR** | Plausible for common direct-FK distances |
| Free-kick xG | `0.09−.003(d−17)`, clamp .02–.12 | Set-piece chance value | **ANCHORED** at population scale | FK-RATE 4.72% lies inside the range, though distance curve remains designed |
| Dribble cone | 14 m range; approximately 70° cone; open-space cap 9 m | Size of open grass influencing push | **DESIGNED** | Tactical abstraction |
| Dribble-touch ball speed | carrier speed plus at least 0.8 m/s | Open carry touch | **DESIGNED** | Plausible construction, but should be checked against touch cadence/distance |
| Dribble-touch noise | `0.07(1.35−0.7 dribbling)` rad | Heavy-touch direction | **DESIGNED** | No external endpoint-error anchor |
| Dribble-touch ownership window | 1.6 s | Associates free ball with prior carrier | **DESIGNED** | Bookkeeping/tactical window |
| Clearance velocity | up to 23 m/s horizontal; 3.2–5.4 m/s vertical | Panic clearance | **ANCHORED** for total kick magnitude | Near maximal side-foot/hard-pass speeds and below strong shots |
| Deflection chance | `0.24 + .4 defending − .02(speed−14)`; clamp .05–.6 | Interception stretch success | **DESIGNED** | Requires event-rate and orientation calibration |
| Deflection output | ±1.2 rad; 4–8 m/s | Ricochet | **DESIGNED** | Plausible loose-ball speed |
| Smother radius | 1.3 m | Keeper-at-feet challenge | **UNCLEAR** — physical dive/lunge envelope | Generous static radius but plausible at speed |
| Smother success | base .56; reflex +.5; dribbler −.35; clamp .2–.85 | Keeper 1v1 outcome | **DESIGNED** | Requires real 1v1 outcome data |
| Recovery-slide reach | 1.2–2.2 m | From-behind slide eligibility | **UNCLEAR** — physical lunge distance | Plausible for a full slide, but instantaneous eligibility ignores time-to-contact |
| Slide-tackle attempt/win | attempt .05–.17; win base .16, clamp .05–.4; foul .4–.55 | Recovery tackle outcomes | **DESIGNED** | Needs tackle/foul census |
| Tactical-foul geometry | 16–34 m from goal; sprint ≥4.5 m/s; grab radius 1.7 m | Professional-foul opportunity | **DESIGNED** | Tactical abstraction |
| Standing tackle radius | 1.15 m | Normal tackle eligibility | **UNCLEAR** — foot/lunge reach | Plausible extended-leg envelope; large relative to compressed pitch |
| Standing tackle probability | base .25; clamp .06–.7 plus attributes/context | Ball-winning chance | **DESIGNED** | Needs real and sim duel calibration |
| Shot-block shell | height ≤1.1 m; radius .9 m; excludes final 6 m | Defender block eligibility | **UNCLEAR** for geometry | Height/radius plausible for legs/body; 6 m goalmouth exclusion is designed |
| Shot-block probability | `.32 + .25 defending`, readiness-scaled | Successful block | **DESIGNED** | Real block frequency is context-dependent |
| Keeper save gate | ball ≥6 m/s and ≤2.55 m high | Whether save logic runs | **DESIGNED/UNCLEAR** — physical thresholds but implementation gates | Slow shots rely on capture logic rather than saves |
| Keeper save curves | open base .48, xG slope −.45, reflex swing ±.14; placed base .70; caps .10/.92 | Save probability | **DESIGNED** | Outcome model should be checked against post-shot xG, not pre-shot xG alone |
| Catch threshold/chance | speed <21 m/s and 80% chance | Catch versus parry | **UNCLEAR** — handling depends on placement, spin and body position, not only speed | 21 m/s is a hard pass/medium shot; plausible threshold, unrealistic cliff |
| Parry response | 45% incoming speed, clamp 7–12 m/s; angle 0.55–1.15 rad | Saved-shot rebound | **DESIGNED** | No external calibration |

## `src/sim/Ball.ts`

| Numeric item | Value | What it governs | Class and reasoning | Anchor |
|---|---:|---|---|---|
| State initialisers/reset values | 0 | Position, velocity, height, spin and ownership reset | **DESIGNED** — neutral state, not a play parameter | No audit concern |
| `radius` | delegates to `BALL_RADIUS` = 0.11 m | Physical ball geometry | **ANCHORED** | See LAW-BALL and the `constants.ts` row |

There are no independent play-shaping inline numeric literals in this file.

## `src/sim/Player.ts`

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| `BASE_SPEED.GK` | 6.4 m/s | Keeper role baseline | **ANCHORED** — plausible role-specific top speed | Below outfielder peaks, consistent with GK role |
| `BASE_SPEED.DF` | 7.0 m/s | Defender baseline | **ANCHORED** | Pace attributes raise it to 7.84 m/s; plausible |
| `BASE_SPEED.MF` | 7.3 m/s | Midfielder baseline | **ANCHORED** | Maximum 8.18 m/s; plausible |
| `BASE_SPEED.WG` | 7.9 m/s | Winger baseline | **ANCHORED** | Maximum 8.85 m/s; matches RUN 8.1–9.1 |
| `BASE_SPEED.ST` | 7.7 m/s | Striker baseline | **ANCHORED** | Maximum 8.62 m/s; plausible |
| `ACCEL` | 14 m/s² | Velocity convergence toward desired motion | **UNCLEAR** — expressed as physical acceleration but likely compresses responsiveness | ACCEL 3.3–8.7; even ×1/0.7 similarity gives about 4.7–12.4: **OUTSIDE high** |
| `TURN_RATE` | 6.5 rad/s | Body facing rotation; 180° in 0.48 s | **UNCLEAR** — physically interpretable but not equivalent to a full change-of-direction test | Likely very agile; no clean study comparator |
| Pace multiplier | `0.88 + 0.24 pace` | ±12% role top-speed range | **DESIGNED** — attribute mapping | Resulting top speeds remain plausible |
| Acceleration multiplier | `0.9 + 0.2 pace` | 12.6–15.4 m/s² | **DESIGNED** mapping around an **UNCLEAR** base | Entire range remains above scaled theoretical elite upper values |
| Engine stamina multiplier | 0.9 | 10% slower drain | **DESIGNED** | Trait reward |
| Knock penalties | pace ×0.8; dribbling ×0.85 | Injury degradation | **DESIGNED** | No injury-severity mapping |
| Fatigue speed curve | `0.62 + 0.38 stamina` | Top speed under fatigue | **DESIGNED** — energy-economy choice | At typical stated end stamina 0.6–0.8, speed falls 7.6–15.2%, larger than ordinary match fatigue effects |
| Stun movement multiplier | 0.15 | Stumble/ground recovery motion | **DESIGNED** | Animation/gameplay state |
| Heading activation speed | 0.5 m/s | Only update facing from velocity above threshold | **DESIGNED** | Numerical stability/visual choice |
| Drain effort threshold | 0.55 of base speed | Switches recovery to quadratic drain | **DESIGNED** | Physiology is continuous, but threshold is gameplay economy |
| Minimum stamina | 0.05 | Prevents complete exhaustion | **DESIGNED** | Safety floor |

Raw top speeds are strong. The principal mismatch is acceleration: players reach those speeds much too quickly.

## `src/ai/prediction.ts`

The requested `src/sim/prediction.ts` does not exist. The live file is `src/ai/prediction.ts`.

| Inline constant / formula | Value(s) and unit | What it governs | Class and reasoning | Real anchor / verdict |
|---|---|---|---|---|
| Observation horizon | default/max 1.5 s | Constant-velocity player projection | **DESIGNED** — AI forecast horizon | Long enough that turns and accelerations make constant velocity unreliable |
| Power floor | 0.1× | Prevents non-positive pass power | **DESIGNED** — numerical guard | Not reached by normal 0.85–1.15 power range |
| Pass lead model | distance divided by `16 × power`; receiver motion ×0.8 | Predicted target point | **DESIGNED** | Mirrors mechanics exactly; 16 m/s is plausible but fixed |
| Launch formula | `clamp(0.6d+8.2, 9, 22) × power` m/s | Predicted ground-pass speed | **ANCHORED** for bounds | BALL-TRACK and experienced side-foot speeds support 9–22 m/s |
| Fixed-step arrival rounding | ceil to `DT`; epsilon `1e−12` | First engine tick reaching distance | **DESIGNED** — numerical fidelity | Correctly mirrors the deterministic integrator |
| Friction reachability | finite maximum `speed·DT/(1−exp(−kDT))` | Whether a pass can reach its point | **UNCLEAR** because inherited from `BALL_FRICTION_K` | Same high-speed braking concern as the runtime physics |

## Ranked shortlist: constants most deserving realism scrutiny

1. **`ACCEL = 14 m/s²`**  
   It controls separation, pressing, recovery and keeper rushes. The resulting 12.6–15.4 m/s² player range exceeds measured and theoretical elite-football values even after granting the 0.7 field-compression allowance.

2. **`BALL_FRICTION_K = 0.55 s⁻¹`**  
   It governs every ground pass and dribble push. Overall low-speed roll-out can look plausible, but the exponential form produces excessive braking at hard-pass speeds and differs from published turf behaviour.

3. **`CONTROL_RADIUS = 1.25 m`**  
   This is a very large centre-to-ball interaction shell, remains unscaled on the compressed pitch, and feeds control, interceptions and loose-ball contests. Small changes could alter possession ecology everywhere.

4. **`SPEED_TIME_SCALE = 1`**  
   It documents the decision to retain real raw speeds on a 0.7 pitch, creating 43% faster pitch-relative transit—and it currently has no runtime consumer. This is the global spatial/temporal realism coupling.

5. **`BOX_WIDTH = 19.6 m`**  
   It is 30.6% narrower than a true ×0.7 penalty area. Together with `BOX_DEPTH`, it changes keeper handling, penalties, shot zones, defensive shape and aerial decisions, so this is more than cosmetic scaling.

6. **`AI_INTERVAL = 0.15 s`**  
   It is faster than the roughly 0.20 s lower bound commonly used for post-stimulus human reaction, before decision and movement time. Because it is a scheduler rather than explicit reaction latency, its effective consequences need tracing.

7. **`PLAYER_MIN_DIST = 1.05 m`**  
   The hard separation diameter is much larger than literal body breadth and is unscaled. In 6v6 it materially determines block density, pressing lanes, screening and whether multiple players can contest the same ball.

8. **`BALL_BOUNCE = 0.45`**  
   It gives only about 0.405 m rebound from a 2 m drop, below FIFA-quality turf’s 0.60–0.85 m band. It will make lofted balls settle early and suppress second-bounce/aerial chaos.

9. **Inline `SAVE_STRETCH = 1.35`**  
   It expands keeper attempt reach by 35%, potentially to nearly 3.8 m, and was tuned from sim goal anatomy rather than external dive-time/reach evidence. It directly governs whether a shot receives any save roll.

10. **Inline `shotQuality` distance scale `exp(−d/10)`**  
    This single 10 m e-fold drives xG, keeper saves and evolutionary shot selection. Real xG is learned from distance, angle, body part, assist type and defender/GK context; this compact curve therefore has unusually large systemic leverage.
