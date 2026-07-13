/** All simulation units are meters / seconds. Coordinates: origin at pitch
 * center, +x toward the right goal, +y downward on screen. Team 0 attacks +x,
 * team 1 attacks -x (no side swap at half time — keeps formation math simple).
 *
 * Boundaries are real (Phase 14): a ball over the touchline is a kick-in,
 * over the goal line a corner or goal kick. Restarts are live dead-ball
 * phases — the clock runs while the taker walks over and defenders reshape.
 */
export const PITCH_LENGTH = 90;
export const PITCH_WIDTH = 58;
export const HALF_L = PITCH_LENGTH / 2;
export const HALF_W = PITCH_WIDTH / 2;

export const GOAL_WIDTH = 7;
export const GOAL_DEPTH = 2.2;
/** Crossbar height (m) — a ball crossing the goal line above this is OVER the bar. */
export const GOAL_HEIGHT = 2.44;
export const BOX_DEPTH = 13;
export const BOX_WIDTH = 28;
export const CENTER_CIRCLE_R = 7;

/** Fixed simulation timestep (s). */
export const DT = 1 / 60;
/** Default full match duration in sim-seconds (2 halves). Display clock maps this to 90'. */
export const MATCH_DURATION = 240;
/**
 * Max sim-seconds a half runs past its nominal end waiting for a safe break
 * (Phase 27.4 stoppage time) — ≈3 added display minutes on the 90' clock.
 */
export const STOPPAGE_MAX = 8;

/** Ball exponential velocity decay per second: v *= exp(-K * dt). */
export const BALL_FRICTION_K = 0.55;

/* ---- The aerial game (Phase 28) ---- */
/** Gravity on the lofted ball (m/s²). Airborne balls fly friction-free. */
export const GRAVITY = 9.81;
/** Vertical restitution on landing: bounce vz = -vz · this. */
export const BALL_BOUNCE = 0.45;
/** Horizontal speed kept per bounce (the turf bites). */
export const BOUNCE_DAMP = 0.72;
/** Landing slower than this vertically just settles into a roll. */
export const BOUNCE_MIN_VZ = 2.2;
/** Above this height a ball can't be trapped or deflected — only headed. */
export const CONTROL_MAX_HEIGHT = 1.3;
/** Header contest window: ball height where outfielders can attack it... */
export const HEADER_MIN_HEIGHT = 1.35;
export const HEADER_MAX_HEIGHT = 2.5;
/** ...standing within this horizontal radius of the ball. */
export const HEADER_RADIUS = 1.35;
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
export const CONTROL_RADIUS = 1.25;
/** ...if it is slower than this (outfield) — keepers can handle faster balls. */
export const CONTROL_MAX_SPEED = 14;
export const GK_CONTROL_MAX_SPEED = 23;
/**
 * Faster balls (hard passes, not shots — SHOT_SPEED is 27) can still be
 * DEFLECTED by a player in their path (Phase 27 lane anticipation).
 */
export const DEFLECT_MAX_SPEED = 24;

/** After kicking, a player can't re-capture for this long (lets passes leave). */
export const KICK_COOLDOWN = 0.45;

/**
 * Discrete dribble touches (Phase 36, 可见的触球): an outfield carrier
 * DRIVING in space pushes the ball ahead and chases it — between touches
 * the ball is a free body an opponent in the path may poke away. Under
 * pressure (an opponent inside TOUCH_CONTROL_DIST) the carry stays glued:
 * close control IS short touches, and the tackle/shield duel lives there.
 */
/** Nearest-opponent distance above which the carrier plays open touches.
 * First cut 3.5/1.7/0.38 rolled the ball 1.1s ahead and 39% of pushes were
 * poked away — a coin flip per carry. */
export const TOUCH_CONTROL_DIST = 4.2;
/**
 * Carry REGIMES (36.1, user report "跑动应该有不同的触球频率"): the push
 * range is wide on purpose — in traffic it's a stride-length nudge
 * (一步一带, ~0.9 m/s over the run), into 10m of open grass it's a real
 * knock (爆趟, up to ~4.7); walking pace keeps the glue (慢带). Cadence
 * follows: the poke window scales with the push, so a long knock is a
 * long chase and a dribble regathers in a step.
 */
/** Base speed added to the carrier's own on the push. */
export const TOUCH_PUSH_BASE = 0.9;
/** Extra push per meter of open cone ahead (capped at 9m in mechanics).
 * 0.38 + cooldown slope 0.06 overshot: pokes 26%, 13% rolled dead, goals
 * −0.27 (probed) — the mid-range carry bled possession. */
export const TOUCH_PUSH_SPACE = 0.32;
/** The no-recollect window: base + slope·push — the poke window. */
export const TOUCH_RECOLLECT_BASE = 0.26;
export const TOUCH_RECOLLECT_PER_PUSH = 0.04;

/** How often each player re-evaluates its utility scores (staggered). */
export const AI_INTERVAL = 0.15;
/** How often each TeamBrain re-picks a tactical mode / assignments. */
export const TEAM_AI_INTERVAL = 0.4;

export const SHOT_SPEED = 27;
/** Minimum distance between player centers (hard separation). */
export const PLAYER_MIN_DIST = 1.05;
