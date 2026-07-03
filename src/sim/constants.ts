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
export const BOX_DEPTH = 13;
export const BOX_WIDTH = 28;
export const CENTER_CIRCLE_R = 7;

/** Fixed simulation timestep (s). */
export const DT = 1 / 60;
/** Default full match duration in sim-seconds (2 halves). Display clock maps this to 90'. */
export const MATCH_DURATION = 240;

/** Ball exponential velocity decay per second: v *= exp(-K * dt). */
export const BALL_FRICTION_K = 0.55;

/** Opponents are held this far from a dead-ball restart spot. */
export const RESTART_CLEARANCE = 6;
/** Restart setup: minimum dead-ball time before the kick can be taken... */
export const RESTART_MIN_SETUP = 1.0;
/** ...and a failsafe: after this long the taker kicks from wherever they are. */
export const RESTART_TIMEOUT = 6;

/** A player controls a free ball inside this radius... */
export const CONTROL_RADIUS = 1.25;
/** ...if it is slower than this (outfield) — keepers can handle faster balls. */
export const CONTROL_MAX_SPEED = 14;
export const GK_CONTROL_MAX_SPEED = 23;

/** After kicking, a player can't re-capture for this long (lets passes leave). */
export const KICK_COOLDOWN = 0.45;

/** How often each player re-evaluates its utility scores (staggered). */
export const AI_INTERVAL = 0.15;
/** How often each TeamBrain re-picks a tactical mode / assignments. */
export const TEAM_AI_INTERVAL = 0.4;

export const SHOT_SPEED = 27;
export const PLAYER_RADIUS = 0.55;
/** Minimum distance between player centers (hard separation). */
export const PLAYER_MIN_DIST = 1.05;
