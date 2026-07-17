import { clamp } from '../utils/math';
import { v2, type V2 } from '../utils/vec';
import { CORNER_CLEARANCE, GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
import type { Ball } from '../sim/Ball';
import type { Player } from '../sim/Player';
import type { Team } from '../sim/Team';
import type {
  AttackFormationId, CornerRoutine, DefendFormationId, TeamMode,
} from '../sim/types';

/**
 * Formation spot tables (Phase 30) in team-local coordinates: +x = our
 * attacking direction, x=-45 is our goal line. One V2 per SLOT in order
 * [GK, DF, MF, WGL, WGR, ST]; every team owns one attacking and one
 * defending table (its identity, `team.style`). The whole block still
 * slides with the ball, the tactical mode, and three genes (formationDepth,
 * attackingWidth, defensiveCompactness) exactly as it did on the old single
 * BASE_SPOTS. Formation names count outfield lines back→front.
 *
 * Lanes are deliberately separated (Phase 27.1): stacked spines collapse
 * open play into one central corridor. Back-line height is the goals lever
 * (Phase 29/30: higher line = compressed game, space in behind for runs).
 */
export const ATTACK_FORMATIONS: Record<AttackFormationId, V2[]> = {
  // Double base, a linking striker, both wingers HIGH and WIDE (两翼齐飞).
  'wide-212': [v2(-41, 0), v2(-16, -6), v2(-12, 7), v2(8, -19), v2(8, 19), v2(4, 0)],
  // One anchor, the left winger tucks in, an inside-right pair — at the
  // HALF-SPACES (8/11 → 12/15, Phase 31.8): with both wide slots inside
  // y≤11, a narrow-vs-narrow derby had no relief valve at all — both
  // attacks mirrored into one central corridor and the top-5 most chaotic
  // matches in the league (t+i 85–123, zero goals) were ALL this fixture.
  // Still clearly narrower than wide-212's ±19: inside-forwards, not
  // wingers.
  'narrow-122': [v2(-41, 0), v2(-19, 0), v2(-9, -7), v2(-6, 12), v2(6, 15), v2(7, -3)],
  // NOVEL (Phase 67, N5 — mutation-discovered only). TWIN STRIKERS: the
  // right winger becomes a second 9 — a high pair splitting the center
  // backs, one true wide feeder on the left, two at the base. The twins
  // sit a touch higher than wide-212's wingers: a spearhead, not a line.
  'twin-st': [v2(-41, 0), v2(-16, -4), v2(-11, 5), v2(2, -17), v2(10, 6), v2(10, -6)],
  // NOVEL. The FALSE NINE: the striker DROPS between the lines (-2, the
  // hole) to link and drag the last defender out; both wingers push very
  // high and very wide — the runners the false nine releases into the
  // space he vacated.
  'false-nine': [v2(-41, 0), v2(-17, -5), v2(-12, 5), v2(12, -18), v2(12, 18), v2(-2, 0)],
};

// Defend tables keep the STRIKER HIGH on purpose (30.4). The first cut
// parked all five outfielders goal-side and league scoring collapsed to
// ~1.1: a high body PINS an opposing defender (offence by presence) and
// gives every turnover a launch point — 29.x, whose single spot table left
// the ST at +5 even out of possession, scored fine for exactly this
// reason. Identity lives in the BACK of the shape instead: low-32 drops
// both wingers as wide backs; press-23 pushes them onto the build-up.
export const DEFEND_FORMATIONS: Record<DefendFormationId, V2[]> = {
  // Back THREE (wingers drop as wide backs), MF screens, ST stays HIGH.
  'low-32': [v2(-41, 0), v2(-20, 0), v2(-9, -4), v2(-16, -11), v2(-16, 11), v2(5, 2)],
  // Back two, wingers at halfway, ST hunting the opponent back line.
  'press-23': [v2(-41, 0), v2(-18, -5), v2(-13, 5), v2(0, -15), v2(0, 15), v2(7, 0)],
};

/** How far up/down the pitch each tactical mode pushes the block. */
const MODE_SHIFT: Record<TeamMode, number> = {
  Attack: 10,
  BuildUp: 4,
  CounterAttack: 8,
  Press: 6,
  Defend: -8,
  ResetShape: 0,
};

/**
 * World-space formation target for a player. `hasBall` decides whether width
 * (attackingWidth) or compactness (defensiveCompactness) shapes the block.
 */
export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean): V2 {
  const g = team.genome;
  const base = hasBall
    ? ATTACK_FORMATIONS[team.style.formationAtk][p.index]
    : DEFEND_FORMATIONS[team.style.formationDef][p.index];

  // Block slides toward the ball along x (local coords), capped at ±10m.
  const ballLocalX = team.localX(ball.pos.x);
  const slide = clamp(ballLocalX * 0.3, -10, 10);

  // formationDepth: 0 = sit 6m deeper, 1 = push 6m higher.
  const depth = (g.formationDepth - 0.5) * 12;

  let x = base.x + slide + depth + MODE_SHIFT[team.mode];

  // Rest defence (Phase 31): the DF slot NEVER joins the siege. With the
  // ball deep in the opponent half, slide (+10) + Attack shift (+10) used
  // to push even the last outfielder past halfway — the attacking team had
  // literally nobody covering, so every turnover was an uncontested
  // breakaway. That hole is what let a 5v6 side out-score its own
  // full-strength baseline once the open-run economy paid honestly
  // (counters were ALL open runs). One cover man keeps counters real —
  // beatable by pace or a dragged block, never free.
  // −12, not −5: a cover man AT halfway is already beaten by the time a
  // counter carrier enters the open-run zone (28m out) — he has to start
  // goal-side of the race, near his base spot, to ever contest it.
  if (hasBall && p.index === 1) x = Math.min(x, -12);

  // Width: stretch when we have the ball, squeeze when we don't. The
  // in-possession floor is 1.0 (Phase 27.1) — an attacking shape should
  // never be narrower than its base lanes.
  let widthMul = hasBall
    ? 1.0 + g.attackingWidth * 0.55 // 1.0 .. 1.55
    : 1.15 - g.defensiveCompactness * 0.6; // 1.15 .. 0.55
  // Zonal shape stays HONEST-WIDE (Phase 30.4): a zone defence covers
  // width by definition — it may not also collapse into the central
  // corridor, or its parked bodies dead-lane the entire pitch (measured:
  // zonal sides conceded 3.6 shots/match vs man's 8 — the league's shot
  // volume collapsed with half the clubs zonal).
  if (!hasBall && team.style.scheme === 'zonal') widthMul = Math.max(widthMul, 0.95);
  let y = base.y * widthMul;

  // Compact teams also drag their block a little toward the ball's y.
  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;

  // Weak-side far-post pull (Phase 31): when the attack is deep AND wide,
  // the far winger leaves the touchline and attacks the back post — the
  // overload that punishes a ball-side defensive shift, and the second
  // body a cutback or deep cross finds. The strong-side winger keeps the
  // width; the pull releases as soon as the ball comes back central.
  if (
    hasBall && p.role === 'WG' && ballLocalX > HALF_L - 20 &&
    Math.abs(ball.pos.y) > 12 && Math.sign(y) !== Math.sign(ball.pos.y)
  ) {
    y *= 0.3;
  }

  if (p.role === 'GK') {
    // Keepers hold a narrow band in front of goal regardless of mode.
    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -HALF_L + 1, -HALF_L + 11);
    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
    return v2(x * team.attackDir, y);
  }

  x = clamp(x, -HALF_L + 3, HALF_L - 7);
  y = clamp(y, -HALF_W + 2, HALF_W - 2);
  return v2(x * team.attackDir, y);
}

/**
 * Free-kick wall slots (Phase 32): shoulder-to-shoulder on the ball–goal
 * line at the law clearance (9.15m), 0.7m apart, centered. Shared by the
 * executor (routing), the referee's wall-wait gate and the flight solver —
 * one geometry, so nothing fights and nobody strikes past a half-built
 * wall standing in the climb's header band.
 */
export function fkWallSlots(from: V2, goal: V2, n: number): V2[] {
  const dx = goal.x - from.x;
  const dy = goal.y - from.y;
  const dl = Math.max(Math.sqrt(dx * dx + dy * dy), 1e-6);
  const ux = dx / dl;
  const uy = dy / dl;
  const cx = from.x + ux * (CORNER_CLEARANCE + 0.15);
  const cy = from.y + uy * (CORNER_CLEARANCE + 0.15);
  const out: V2[] = [];
  for (let i = 0; i < n; i++) {
    // 1.1m spacing: anything under PLAYER_MIN_DIST (1.05) gets shoved
    // apart by resolveOverlaps every frame — the wall equilibrated 1.4m
    // OFF its slots, standing exactly in the climb's header band.
    const off = (i - (n - 1) / 2) * 1.1;
    out.push(v2(cx - uy * off, cy + ux * off));
  }
  return out;
}

/**
 * Corner routine geometry (Phase 31), in world coordinates for the taking
 * team. `attackDir` is the taker's attacking direction, `cornerY` the sign
 * of the corner flag's y. The KEY zone is what the routine's openness is
 * judged on; the CRASH spots are where the three licensed box-crashers
 * attack (primary / secondary / rebound), ordered by aerial rank.
 */
export function cornerKeyZone(routine: CornerRoutine, attackDir: 1 | -1, cornerY: number): V2 {
  const gx = attackDir * HALF_L;
  const s = cornerY >= 0 ? 1 : -1;
  switch (routine) {
    case 'nearPost':
      return v2(gx - attackDir * 4.5, s * 2.8);
    case 'farPost':
      return v2(gx - attackDir * 5.5, -s * 3.2);
    case 'short':
      return v2(gx - attackDir * 9, s * (HALF_W - 6));
    case 'arcCutback':
      return v2(gx - attackDir * 16, s * 3);
  }
}

export function cornerCrashSpots(
  routine: CornerRoutine | undefined, attackDir: 1 | -1, cornerY: number,
): [V2, V2, V2] {
  const gx = attackDir * HALF_L;
  const s = cornerY >= 0 ? 1 : -1;
  const b = (dx: number, y: number): V2 => v2(gx - attackDir * dx, y);
  switch (routine) {
    case 'nearPost':
      // Overload the front zone: the flick wins the race, the others eat
      // the flick-on and the spill.
      return [b(4.5, s * 2.8), b(7, -s * 1), b(11, s * 0.5)];
    case 'farPost':
      // The back-post crash: primary attacks the far stick with a run.
      return [b(5.5, -s * 3.2), b(6, s * 1.5), b(11, 0)];
    case 'arcCutback':
      // Crashers pin the box DEEP so the arc stays empty for the arriver.
      return [b(4.5, s * 2.5), b(5.5, -s * 2.5), b(7.5, 0)];
    case 'short':
    default:
      // Default milling (and the short routine's box picture): posts + spot.
      return [b(5, s * 2.5), b(6, -s * 2.5), b(11, 0)];
  }
}

/**
 * Is the team settled into its ATTACKING shape? (Phase 30 step 3 — the
 * keeper waits for this before releasing a goal kick or a held ball, so
 * distributions find SET receivers instead of gifting scrambles.) At least
 * three outfielders within `radius` of their attacking spots — or every
 * outfielder the team still has, when send-offs leave fewer than three.
 * Pure sim-state (invariant 3): positions vs spot tables, no clocks.
 */
export function shapeReady(team: Team, ball: Ball, radius = 6): boolean {
  let settled = 0;
  let outfield = 0;
  for (const p of team.players) {
    if (p.role === 'GK' || p.sentOff) continue;
    outfield++;
    const spot = formationSpot(p, team, ball, true);
    const dx = p.pos.x - spot.x;
    const dy = p.pos.y - spot.y;
    if (dx * dx + dy * dy < radius * radius) settled++;
  }
  return settled >= Math.min(3, outfield);
}

/**
 * The opponents' last defensive line, in `team`-local x (bigger = deeper
 * toward their goal). GK excluded — beating the keeper is the striker's job.
 */
export function defenderLineLocalX(team: Team, opponents: Player[]): number {
  let line = -HALF_L;
  for (const o of opponents) {
    if (o.role === 'GK' || o.sentOff) continue;
    const lx = team.localX(o.pos.x);
    if (lx > line) line = lx;
  }
  return line;
}

/**
 * The OFFSIDE line in `team`-local x (Phase 29): the second-last opponent
 * COUNTING the keeper (the real law — usually the last outfield defender,
 * because the keeper is the last man), or the ball itself if it's deeper,
 * floored at halfway (you cannot be offside in your own half). An attacker
 * ahead of this line when a teammate strikes the ball is in an offside
 * position; level is onside (callers add their own epsilon).
 */
export function offsideLineLocalX(team: Team, opponents: Player[], ballLocalX: number): number {
  let last = -HALF_L;
  let secondLast = -HALF_L;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const lx = team.localX(o.pos.x);
    if (lx > last) {
      secondLast = last;
      last = lx;
    } else if (lx > secondLast) {
      secondLast = lx;
    }
  }
  return Math.max(secondLast, ballLocalX, 0);
}

/**
 * Where an assigned runner sprints: past the last defender's shoulder,
 * angling into the channel toward goal. Clamped short of the keeper's box so
 * runs stretch the defence without parking on the goal line. The target aims
 * BEYOND the line on purpose — while a teammate still carries the ball the
 * executor holds the run at the offside line (Phase 29), and the instant the
 * kick is struck the clamp releases and this target is the burst in behind.
 */
export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
  const line = defenderLineLocalX(team, opponents);
  const myX = team.localX(p.pos.x);
  const targetLocalX = clamp(Math.max(line + 7, myX + 5), myX + 3, HALF_L - 9);
  // Narrow toward the goal mouth as the run goes deeper, keeping the lane.
  // The poacher (Phase 39) attacks the POST CHANNEL (|y|≈3.5, his wing's
  // post) — the tap-in zone. NOT the center: a first cut narrowed him to
  // ×0.35 and his runs ended on the keeper's chest (fm 21, the goal-pull
  // lesson — conversion went DOWN and the finishing invariant test flagged
  // it).
  const y = p.traits.includes('poacher')
    ? Math.sign(p.pos.y || 1) * 3.5
    : clamp(p.pos.y * 0.6, -HALF_W + 4, HALF_W - 4);
  return v2(targetLocalX * team.attackDir, y);
}

/**
 * Where a through ball should MEET a runner (Phase 29). A runner already in
 * stride is led by their velocity, like any pass. But a runner HELD at the
 * offside line hovers with near-zero velocity — leading by velocity would
 * put the ball at their feet ON the line, exactly the ball the line exists
 * to kill. The pass anticipates the break instead: it projects the burst
 * along the run target at the runner's top speed, and the runner breaks the
 * instant the kick releases the onside hold. Judgment stays honest — the
 * flag is judged on where the runner STANDS at the kick, not the aim point.
 */
export function runBurstPoint(p: Player, team: Team, opponents: Player[], flight: number): V2 {
  const speed = Math.hypot(p.vel.x, p.vel.y);
  if (speed > 3) {
    return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);
  }
  const rt = runTarget(p, team, opponents);
  const dx = rt.x - p.pos.x;
  const dy = rt.y - p.pos.y;
  const d = Math.hypot(dx, dy) || 1;
  const burst = Math.min(d, p.topSpeed * flight * 1.1);
  return v2(p.pos.x + (dx / d) * burst, p.pos.y + (dy / d) * burst);
}

/**
 * Where an off-ball player supports the carrier: ahead of the ball for
 * attacking modes, pulled laterally TOWARD the supporter's own formation
 * lane, at a radius set by the supportDistance gene.
 *
 * Lane-pulled but radius-bounded (Phase 30.5): the old sign()-based nudge
 * kept every supporter within ~5m of the ball's y, so all three off-ball
 * attackers formed one narrow column ahead of the carrier — dragging their
 * markers into the same corridor, walling off every forward lane
 * (interceptions ran 33/match) and pulling wingers off the flank. Pulling
 * y toward the lane spreads support into a fan: near-central options stay
 * short, the ball-side winger becomes a REAL wide outlet. The lateral pull
 * is capped at ~0.9× the support radius on purpose — a first cut anchored
 * y fully to the lane, which parked "support" 30m from the carrier: no
 * short options left, neutral-genome attacks starved (mirror goals 1.47 →
 * 0.93), and the 5v6 sanity invariant inverted (probe-shorthand).
 */
export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
  const g = team.genome;
  // 10..18m: close enough for a give-and-go, far enough that the carrier
  // isn't mobbed by their own teammates (Phase 19 spacing pass, widened in
  // Phase 27.1 — the crowd complaint was real).
  const radius = 10 + g.supportDistance * 8;
  const aheadBias = team.mode === 'CounterAttack' || team.mode === 'Attack' ? 0.75 : 0.35;

  const lane = formationSpot(p, team, ball, true);
  const maxLat = radius * 0.9;
  const latPull = clamp((lane.y - ball.pos.y) * 0.75, -maxLat, maxLat);
  return v2(
    clamp(ball.pos.x + team.attackDir * radius * aheadBias, -HALF_L + 2, HALF_L - 2),
    clamp(ball.pos.y + latPull, -HALF_W + 2, HALF_W - 2),
  );
}
