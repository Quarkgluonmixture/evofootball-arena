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
  /**
   * Match-day adjustment personality (Phase 66, N3): how hard the coach
   * responds to score + clock. Scales the MAGNITUDE of the mentality
   * layer (the chase and the shut-down) — the DIRECTION stays football
   * law, exactly the underdogShift principle. 0 = the stoic who trusts
   * his XI to play their game to the whistle; 0.5 = the Phase-35 curve
   * exactly; 1 = the tinkerer who slams the panic button early and hard.
   * Neither is a virtue: the chase concedes counters, the deep shut-down
   * surrenders initiative — whether meddling pays is evolution's call.
   */
  tinkerBias: number;
  /**
   * The BOARD's recruitment philosophy (Phase 80, N6): how much a signing's
   * personal STYLE FIT (his appetites vs the man he replaces — the club's
   * evolved bloodline for that slot) weighs against raw ability in the
   * fire-sale market. 0 = best man available, damn the system; 1 = system
   * first. Neither is a virtue: the galactico may never suit the shape,
   * the system signing may simply be worse — whether culture-fit
   * recruitment pays is evolution's call.
   */
  fitBias: number;
  /**
   * The DEFENSIVE SCHOOL's first axis (Phase 87, user design — 范戴克式
   * "give-space" modern defending vs the dive-in reflex): how much this
   * team's goal-side contain man JOCKEYS a driving carrier — holds the
   * carrier-goal line at standoff distance, refuses the full-momentum
   * duel, challenges only loose touches — instead of lunging on contact.
   * 0 = the old dive-in school (beaten by pace via the Phase-41 momentum
   * gate); 1 = pure containment (the carrier keeps the ball but never
   * gets the composed 1v1 — a body stays goal-side). Neither is a virtue:
   * containment concedes time and range shots; whether delay beats the
   * duel is evolution's call.
   */
  jockeyBias: number;
  /**
   * The DEFENSIVE SCHOOL's second axis (Phase 88, user design — 意大利链式
   * 防守): where the DF slot sits RELATIVE TO HIS LINE. 1 = the libero,
   * parked behind the beaten line — eats through-balls, meets the carrier
   * who beat the first wave, and (the natural cost) plays everyone ONSIDE,
   * killing his own team's offside trap. 0 = the stopper who steps up to
   * intercept early, gambling the space behind. 0.5 = today's flat line
   * exactly. In possession the same gene sets the rest-defense depth
   * (0.5 = the old hardcoded −12). Whether insurance beats aggression is
   * evolution's call.
   */
  coverBias: number;
  /**
   * THE OFFSIDE TRAP (Phase 109, defensive school #3 — the last of the
   * user's named schools): hold-the-line vs track-the-runner. 1 = the
   * marker REFUSES to be dragged deeper than his shape by a runner — he
   * holds the line laterally and lets the phase-71 offside law flag the
   * man the ball is played to. 0 = track the runner all the way in.
   * 0.5 = today's tracking exactly. The price is honest: a runner ONSIDE
   * at the kick is clean through the held line — and a high coverBias
   * libero sitting below the line plays everyone onside (the natural
   * school tension). Offside does not exist against a CARRIER, so this
   * governs the pass-served pipe only (launch-anatomy.ts has the shares).
   */
  trapBias: number;
  /**
   * MORALE SENSITIVITY (Phase 111, Stage 4 — the first pull item): how
   * much this team's football depends on its CONFIDENCE. Franchise morale
   * (rolling, result-driven, mean-reverting) exists for everyone; this
   * gene prices what it does — 0 = the steady professionals who play the
   * same game at 0-3 down in a slump, 1 = the confidence team whose
   * passing and finishing sharpen on a run and fray in a crisis (both
   * directions, the honest trade: snowball wins bought with fragile
   * slumps). 0.5 = a mild middle. Neither is a virtue — evolution's call.
   */
  moraleSensitivity: number;
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
  'tinkerBias',
  'fitBias',
  'jockeyBias',
  'coverBias',
  'trapBias',
  'moraleSensitivity',
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
  if ((g.tinkerBias ?? 0.5) > 0.72) tags.push('Tinkerman');
  if ((g.tinkerBias ?? 0.5) < 0.28) tags.push('Trusts the XI');
  if ((g.fitBias ?? 0.5) > 0.72) tags.push('System signings');
  if ((g.fitBias ?? 0.5) < 0.28) tags.push('Galactico board');
  if ((g.jockeyBias ?? 0.5) > 0.72) tags.push('Contains & delays');
  if ((g.jockeyBias ?? 0.5) < 0.28) tags.push('Dives in');
  if ((g.coverBias ?? 0.5) > 0.72) tags.push('Libero');
  if ((g.coverBias ?? 0.5) < 0.28) tags.push('Stopper steps up');
  if ((g.trapBias ?? 0.5) > 0.72) tags.push('Offside trap');
  if ((g.trapBias ?? 0.5) < 0.28) tags.push('Tracks runners home');
  if ((g.moraleSensitivity ?? 0.5) > 0.72) tags.push('Confidence team');
  if ((g.moraleSensitivity ?? 0.5) < 0.28) tags.push('Steady pros');
  if (tags.length === 0) tags.push('Balanced');
  return tags.slice(0, 3);
}
