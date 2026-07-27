// STAGE III P2 — THE DORMANT EYE (the chooser)
// Contract: docs/world-model/STAGE3-P2-DORMANT-EYE.md §2.3-§2.5, as amended by
// commander ruling #43.3.
//
// A body at a decision instant prices the SAME 18-candidate ball-local lattice
// P1R censused, reading his OWN percept for the context and the committed
// approach table for the value, and commits his window to the best-priced
// approach — or to the incumbent, which is the table's own control arm and is
// therefore a first-class choice rather than a fallback.
//
// The table's meaning is ruling #41.2's and no other: the signed value of
// committing W to APPROACHING candidate X. Nothing here reads "standing".
//
// PURE. No world mutation, no RNG, no truth lookups except in the ORACLE-CTX
// arm, which is a probe-only diagnostic (contract §2.5) and never reachable
// from a production path.
import { HALF_L } from '../sim/constants';
import { TEAM_SIZE } from '../sim/types';
import type { TacticalGenome } from '../evolution/genome';
import type { PerceptionSnapshot } from './perceptionSnapshot';

/** One census cell, exactly as P1R committed it. */
export interface ApproachCell {
  readonly n: number;
  readonly score: number;
  readonly concede: number;
  readonly value: number;
  readonly underPowered?: boolean;
}
/** context key → candidate id (incl. 'control') → cell. */
export type ApproachTable = Readonly<Record<string, Readonly<Record<string, ApproachCell>>>>;

export type StationEyeArm = 'neutral' | 'gene' | 'oracleCtx' | 'inverted';

/** §2.4: the census's own floor. An UNDER-POWERED cell is not a price. */
export const CELL_FLOOR = 150;
/** §2.2: W, inherited from P1R §2.3 with its P0-anchored derivation. */
export const EYE_W_S = 3.0;
/** §2.3: the density feature's radius, P1R §3.2 verbatim. */
const DENSITY_RADIUS = 9;
const CONTROL_ID = 'control';

/** The 18-candidate lattice, byte-for-byte P1R's (§2.3 of that contract). */
export interface EyeCandidate { readonly id: string; readonly dx: number; readonly dy: number }
export const EYE_LATTICE: readonly EyeCandidate[] = (() => {
  const out: EyeCandidate[] = [];
  for (const r of [7, 14, 21]) {
    for (const a of [0, 60, 120, 180, 240, 300]) {
      const rad = (a * Math.PI) / 180;
      out.push({
        id: `r${r}a${a}`,
        dx: Number((r * Math.cos(rad)).toFixed(9)),
        dy: Number((r * Math.sin(rad)).toFixed(9)),
      });
    }
  }
  return out;
})();

/**
 * §2.5 / P1 §4.7, frozen before P1R's results existed so it could not be
 * fitted to them. Existing tactical genes only; a neutral genome lands exactly
 * at (0.5, 0.5), i.e. on the census's own unweighted signed axis.
 */
export function faceWeights(arm: StationEyeArm, g: TacticalGenome): { ws: number; wc: number } {
  if (arm !== 'gene') return { ws: 0.5, wc: 0.5 };
  return {
    ws: 0.5 + 0.5 * (g.tempo * 0.5 + g.attackingWidth * 0.5 - 0.5),
    wc: 0.5 + 0.5 * (g.defensiveCompactness * 0.5 + (g.coverBias ?? 0.5) * 0.5 - 0.5),
  };
}

export type ThreatBand = 'ownThird' | 'middle' | 'theirThird';
export const localXBand = (localX: number): ThreatBand => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

/** What the body believes about the moment. Face is undefined when unpriced. */
export interface PerceivedContext {
  readonly key: string;
  readonly face: 'ours' | 'theirs';
  readonly ballX: number;
  /** Diagnostics only (M-CTX): how the three features were read. */
  readonly threat: ThreatBand;
  readonly crowded: boolean;
}

/**
 * §2.3 — the perceived context, from the body's OWN pulled snapshot. No truth
 * by the back door (#8(l)): if the snapshot carries no ball, or the ball it
 * carries has no owner, there is no cell to price and the caller abstains.
 *
 * `localXOf` is the observer team's own local transform, passed in so this
 * module never reaches into the sim.
 */
export function perceivedContext(
  snap: PerceptionSnapshot | null,
  observerGid: number,
  observerSide: 0 | 1,
  observerPos: { readonly x: number; readonly y: number },
  localXOf: (worldX: number) => number,
): PerceivedContext | null {
  if (snap === null || snap.ball === null) return null;
  const ownerGid = snap.ball.ownerGid;
  if (ownerGid === null) return null;
  const ownerSide = Math.floor(ownerGid / TEAM_SIZE);
  const face = ownerSide === observerSide ? 'ours' : 'theirs';
  // §2.3: teammates the body BELIEVES are near him — remembered positions
  // included, since his memory is his belief. The snapshot cannot report
  // sent-off status, so a sent-off teammate still inside retention counts;
  // disclosed rather than patched with truth.
  let near = 0;
  for (const q of snap.players) {
    if (q.gid === observerGid) continue;
    if (q.side !== observerSide) continue;
    if (q.gid % TEAM_SIZE === 0) continue; // keeper, excluded as P1R excludes him
    if (Math.hypot(q.pos.x - observerPos.x, q.pos.y - observerPos.y) <= DENSITY_RADIUS) near += 1;
  }
  const threat = localXBand(localXOf(snap.ball.pos.x));
  const crowded = near >= 2;
  return {
    key: `${face}|${threat}|${crowded ? 'crowded' : 'sparse'}`,
    face, threat, crowded, ballX: snap.ball.pos.x,
  };
}

/**
 * Probe observability only — the sim writes, nothing in the sim reads it back
 * (the `c4Trace` pattern). Present ⇔ a probe asked for it, so the live path
 * pays nothing and the M-* mediators of contract §3.5 have a source.
 */
export interface StationEyeTrace {
  decisions: number;
  deviate: number;
  abstainNoSnapshot: number;
  abstainNoBall: number;
  abstainNoOwner: number;
  noCell: number;
  tie: number;
  /** ticks where a committed body's action left the station family */
  nonStationTicks: number;
  /** override ticks, and the ones where a clamp rewrote the target (#43.3) */
  overrideTicks: number;
  byCandidate: Map<string, number>;
  byContext: Map<string, number>;
  /** M-CTX: perceived vs true context, per feature (probe-only truth read) */
  ctxSeen: number;
  ctxAgree: number;
  ctxAgreeFace: number;
  ctxAgreeThreat: number;
  ctxAgreeDensity: number;
}

export const newStationEyeTrace = (): StationEyeTrace => ({
  decisions: 0, deviate: 0, abstainNoSnapshot: 0, abstainNoBall: 0, abstainNoOwner: 0,
  noCell: 0, tie: 0, nonStationTicks: 0, overrideTicks: 0,
  byCandidate: new Map(), byContext: new Map(),
  ctxSeen: 0, ctxAgree: 0, ctxAgreeFace: 0, ctxAgreeThreat: 0, ctxAgreeDensity: 0,
});

/** §2.2: the station families. Ball-directed jobs are never overridden. */
export const STATION_FAMILY: ReadonlySet<string> = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

export type EyeOutcome =
  /** an override was issued */
  | { kind: 'deviate'; candidate: EyeCandidate; context: string; advantage: number }
  /** the percept carried no priceable ball (E-ABSTAIN-UNSEEN) */
  | { kind: 'abstainUnseen'; reason: 'noSnapshot' | 'noBall' | 'noOwner' }
  /** no candidate in the perceived cell met the n >= 150 floor (E-NOCELL) */
  | { kind: 'noCell'; context: string }
  /** the best advantage was <= 0 — the eye chose the incumbent (E-TIE) */
  | { kind: 'tie'; context: string; best: number };

/**
 * §2.4 — the selection rule, frozen: price every eligible candidate against
 * the census's own control arm and deviate iff the advantage is strictly
 * positive. Ties, an empty eligible set and abstention all resolve to NO
 * OVERRIDE, each in its own counted class.
 *
 * The INVERTED arm takes the argmin instead: §3.4's positive control, which
 * must measurably hurt.
 */
export function priceApproaches(
  table: ApproachTable,
  contextKey: string,
  arm: StationEyeArm,
  genome: TacticalGenome,
): EyeOutcome {
  const cells = table[contextKey];
  if (cells === undefined) return { kind: 'noCell', context: contextKey };
  const control = cells[CONTROL_ID];
  if (control === undefined) return { kind: 'noCell', context: contextKey };
  const { ws, wc } = faceWeights(arm, genome);
  const value = (c: ApproachCell): number => ws * c.score - wc * c.concede;
  const base = value(control);
  const invert = arm === 'inverted';
  let best: EyeCandidate | null = null;
  let bestAdv = 0;
  let eligible = 0;
  for (const cand of EYE_LATTICE) {
    const cell = cells[cand.id];
    if (cell === undefined || cell.n < CELL_FLOOR) continue;
    eligible += 1;
    const adv = value(cell) - base;
    const rank = invert ? -adv : adv;
    if (best === null || rank > (invert ? -bestAdv : bestAdv)) { best = cand; bestAdv = adv; }
  }
  if (eligible === 0) return { kind: 'noCell', context: contextKey };
  if (best === null) return { kind: 'noCell', context: contextKey };
  // Strict positivity for the ordinary arms; the inverted control commits to
  // its worst candidate whatever the sign, which is what makes it a power
  // instrument rather than a second copy of the eye.
  if (!invert && bestAdv <= 0) return { kind: 'tie', context: contextKey, best: bestAdv };
  return { kind: 'deviate', candidate: best, context: contextKey, advantage: bestAdv };
}
