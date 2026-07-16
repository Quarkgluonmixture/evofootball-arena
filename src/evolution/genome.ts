import { clamp01 } from '../utils/math';
import type { Rng } from '../utils/rng';

/**
 * TacticalGenome — the evolvable "DNA" of a team. Every gene is normalized to
 * [0, 1] and is read directly by the AI layer (TeamBrain / PlayerBrain /
 * formations), so mutations produce visible behavioral change.
 */
export interface TacticalGenome {
  /** Raises pass utility for the ball carrier. */
  passBias: number;
  /** Raises shot utility (shoot-on-sight at 1, shy at 0). */
  shootBias: number;
  /** Raises dribble utility for the ball carrier. */
  dribbleBias: number;
  /** How many players press and how eagerly defenders close down. */
  pressIntensity: number;
  /** Off-ball defenders squeeze toward the ball/center when defending. */
  defensiveCompactness: number;
  /** How wide the team stretches in possession. */
  attackingWidth: number;
  /** Willingness to attempt contested forward passes / long shots. */
  riskTolerance: number;
  /** Attack immediately after winning the ball. */
  counterAttackBias: number;
  /** Jog instead of sprint for low-priority movement, saving stamina. */
  staminaConservation: number;
  /** Tighter marking distance and higher tackle success. */
  markingAggression: number;
  /** Keeper plays further off the line (sweeper at 1). */
  keeperAggression: number;
  /** Overall speed of ball circulation and decision urgency. */
  tempo: number;
  /** How high the whole block sits (0 = deep, 1 = high line). */
  formationDepth: number;
  /** How far away support runs position themselves from the carrier. */
  supportDistance: number;
  /**
   * Rotation appetite (Phase 61, N2): how quickly the coach turns to his
   * bench. Read as a fatigue threshold — 0 rides the starting six into the
   * ground, 1 sends fresh legs at the first sign of tiredness. What the
   * carousel COSTS (bench quality under the roster budget, star minutes)
   * is evolution's to price.
   */
  rotationBias: number;
  /**
   * The underdog shift (Phase 64 — opponent-CONDITIONAL tactics): how far
   * the coach bends toward the bus (deep + compact + counter + risk-off)
   * when OUTGUNNED, read from the Elo gap at kickoff. 0 = the purist who
   * plays his football against anyone; 1 = the full pragmatist. Real
   * leagues' diversity lives here: the bus is what weak teams DO against
   * strong ones, not a fixed identity — whether bending pays is
   * evolution's to discover.
   */
  underdogShift: number;
}

export const GENE_KEYS = [
  'passBias',
  'shootBias',
  'dribbleBias',
  'pressIntensity',
  'defensiveCompactness',
  'attackingWidth',
  'riskTolerance',
  'counterAttackBias',
  'staminaConservation',
  'markingAggression',
  'keeperAggression',
  'tempo',
  'formationDepth',
  'supportDistance',
  'rotationBias',
  'underdogShift',
] as const;

export type GeneKey = (typeof GENE_KEYS)[number];

export function randomGenome(rng: Rng): TacticalGenome {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = rng.range(0.15, 0.85);
  return g;
}

export interface MutateOptions {
  /** Probability each gene mutates. */
  rate?: number;
  /** Std-dev of gaussian noise added to a mutating gene. */
  scale?: number;
}

/** Returns a new genome; genes are clamped back to [0, 1]. */
export function mutateGenome(g: TacticalGenome, rng: Rng, opts: MutateOptions = {}): TacticalGenome {
  const rate = opts.rate ?? 0.45;
  const scale = opts.scale ?? 0.14;
  const out = { ...g };
  for (const k of GENE_KEYS) {
    if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
  }
  return out;
}

/** Uniform crossover with occasional blending — child gene is from a, from b, or their mean. */
export function crossoverGenomes(a: TacticalGenome, b: TacticalGenome, rng: Rng): TacticalGenome {
  const out = {} as TacticalGenome;
  for (const k of GENE_KEYS) {
    const r = rng.next();
    out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2;
  }
  return out;
}

/** Euclidean distance in gene space — used to report drift across generations. */
export function geneDistance(a: TacticalGenome, b: TacticalGenome): number {
  let s = 0;
  for (const k of GENE_KEYS) s += (a[k] - b[k]) ** 2;
  return Math.sqrt(s);
}

/**
 * Human-readable tactical identity, derived from the most extreme genes.
 * Shown on team cards so evolution is explainable at a glance.
 */
export function describeIdentity(g: TacticalGenome): string[] {
  const tags: string[] = [];
  if (g.pressIntensity > 0.68) tags.push('Gegenpress');
  if (g.passBias > 0.68 && g.tempo < 0.55) tags.push('Possession game');
  if (g.passBias > 0.68 && g.tempo >= 0.55) tags.push('Fast combinations');
  if (g.counterAttackBias > 0.65) tags.push('Counter-attack');
  if (g.defensiveCompactness > 0.68 && g.riskTolerance < 0.4) tags.push('Low block');
  if (g.riskTolerance > 0.72) tags.push('High risk / chaos');
  // 32.2: the genes that price the back-pass outlet and the keeper's feet
  // — an identity that is VISIBLE in play (the press-escape through him).
  if ((g.passBias + g.riskTolerance) / 2 > 0.62) tags.push('Ball-playing keeper');
  if (g.shootBias > 0.7) tags.push('Shoot on sight');
  if (g.dribbleBias > 0.7) tags.push('Street dribblers');
  if (g.attackingWidth > 0.7) tags.push('Wide play');
  if (g.formationDepth > 0.7) tags.push('High line');
  if (g.formationDepth < 0.3) tags.push('Deep block');
  if (g.staminaConservation > 0.72) tags.push('Energy misers');
  if ((g.rotationBias ?? 0.5) > 0.72) tags.push('Fresh legs');
  if ((g.underdogShift ?? 0) > 0.72) tags.push('Cup fighter');
  if (tags.length === 0) tags.push('Balanced');
  return tags.slice(0, 3);
}
