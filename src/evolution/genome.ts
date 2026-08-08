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
  /**
   * THE TRANSITION INSTANT (Phase 112 — the counter-defense audit's hole):
   * what this team does in the 3 seconds AFTER LOSING THE BALL, the mirror
   * of counterAttackBias on the same possession clock. 1 = gegenpress —
   * surge an extra body at the ball and flip into Press before the counter
   * can launch (the price: men committed high are DEAD if the escape pass
   * beats them, and the sprint costs legs). 0 = drop-and-recover — refuse
   * the counter-press entirely (one token chaser), spot-holders SPRINT
   * home and deny the launch window (the price: the winner keeps the ball
   * and arrives organized). 0.5 = today's behavior exactly: the window is
   * whatever steady-state pressIntensity happens to produce.
   * transition-anatomy.ts measured the coupling this gene breaks: the
   * first-3s response was purely a side effect of steady-state pressing
   * (hiPress retreat 2.4-4.8m vs loPress 6-10m) — mid-block sides that
   * counter-press on loss, or high-press sides that drop on loss, could
   * not exist in gene space. 69-78% of breakaways are born in this window.
   */
  transitionPress: number;
  /**
   * THE HOME-PRIOR OBEDIENCE gene (A4-P2, ruling #148 — the pre-match agreement
   * layer 野球开场的"你踢后卫,我顶前面"). How hard this team obeys its own
   * agreed home distribution: each outfielder carries a coarse 2D home centred on
   * HIS formation base spot (the world's own evolved variable), and the eye is
   * softly biased toward it (stationEye.homeMapBias). 0 = no agreement — a team
   * that plays without a shared prior and pays whatever the world charges (the
   * "有的队不夹击,活该" genre); 1 = the certified strength ceiling
   * (HOME_MAP_STRENGTH_MAX = 0.5×VAL_SCALE). A4-P1e CERTIFIED a resolved
   * discipline benefit across (0, 0.5]×VAL_SCALE — 松约定有价 — with the primary
   * (0.25×) at obedience 0.5. The value in [0,1] scales LINEARLY onto strength via
   * homePriorStrength().
   *
   * ⚠ DORMANT / BORN 0 (RNG-STREAM SAFETY, #148.5 the #75 genre): this gene is
   * OPTIONAL and BORN ABSENT (≡ 0 at every consumer via `?? 0`). It is deliberately
   * NOT in GENE_KEYS — so randomGenome/mutateGenome/crossoverGenomes/geneDistance
   * draw the EXACT SAME RNG in the EXACT SAME order as HEAD, and the serialized
   * genome (and thus the production fingerprint 57b0bdab…c673) is byte-identical
   * (an absent optional key is omitted by JSON.stringify). It gains a concrete
   * value ONLY when an evolution run explicitly opts in via `evolveHomePrior`
   * (MutateOptions / crossoverGenomes); the consumption path is itself gated by the
   * dormant `eye.v4.homePrior` master flag. Every draw for this gene is thus
   * flag-gated — flag-off evolution never consumes RNG for it. (§2 M2′ / I-A3 /
   * I-A5 / I-A7.)
   */
  homePriorObedience?: number;
  /**
   * A4 SLICE 2, S2-P2 (A4-SLICE2-PERBODY-CONTRACT §2 M-S2.1, ruling #164.3) — THE
   * PER-BODY OBEDIENCE OFFSET GENE FAMILY (每个人自己的"该往哪走"): one bounded
   * offset per SQUAD SLOT, so each body has his OWN relationship to the team's
   * kickoff agreement (the user's 爱压上的后卫和爱回撤的前锋, VISION §1) instead of
   * the uniform whisper every body currently shares. Effective per-body obedience =
   * `clamp01(homePriorObedience + offset_i)` (`effectiveHomePriorObedience` below),
   * consumed through the SAME `homePriorStrength` map at the SAME `eye.v4.homePrior`
   * seam — NO new consumer mechanism (M-S2.2).
   *
   * ⚠ BORN ABSENT (contract §3 BIRTH NEUTRALITY, the §8 audit's one live-risk
   * clause): `undefined` ⇒ every offset reads 0 ⇒ effective obedience is the team
   * whisper ⇒ BIT-IDENTICAL to the slice-1 world. NO role-derived birth content
   * exists anywhere in `src/**` — no "defenders born obedient" (= 替球队定X,
   * REJECTED ex ante); differentiation is EARNED by selection or granted only
   * inside instruments. The array, when present, is indexed by SQUAD SLOT and
   * carries no role knowledge: every slot is mutated by the same law.
   *
   * ⚠ RNG-STREAM SAFETY (the #148.5 / #75 genre, mirrored verbatim from
   * `homePriorObedience`): OPTIONAL, deliberately NOT in GENE_KEYS, and gated behind
   * its OWN explicit `evolveHomePriorOffsets` opt-in (an own named boolean per #75 —
   * NOT a widening of `evolveHomePrior`, so even a flag-ON home-prior evolution run's
   * draw sequence is unmoved). Its draws happen STRICTLY AFTER the `homePriorObedience`
   * block, so enabling it never re-orders an existing draw; flag-off evolution consumes
   * ZERO RNG for it and an absent optional key is omitted by JSON.stringify (the
   * production fingerprint 57b0bdab…c673 stands).
   */
  homePriorObedienceOffset?: readonly number[];
  /**
   * PM-T0 (PHASE-MODULATION-CONTRACT §2 M-PM.1, ruling #195.2) — THE DEFENSIVE
   * LANE-CONVERGENCE gene (位置是活的:守→向球侧压缩/弱侧收窄). How hard THIS team's
   * out-of-possession station field asks each body to converge on the BALL'S LANE:
   * in the defensive phase the emergent station's lateral value gets, AFTER the
   * existing width and common-translation terms (replacing neither),
   * `y += (ball.pos.y − y) · k_PM` with `k_PM = defLaneConvergence ·
   * PM_LANE_CONVERGENCE_MAX` (see `pmLaneConvergenceK`). 0 = today's world exactly
   * (keep width, translate the block); 1 = the frozen ceiling below.
   *
   * An affine contraction with `k_PM < 1` preserves lateral ORDER — it shrinks
   * gaps, it cannot cross bodies over. There is NO role gating and NO per-body
   * offset in this slice (offsets = a later slice, the A4-S2 precedent), and the
   * term reads `ball.pos.y` only — an input the adjacent station line already
   * consumes (M-PM.4 perception honesty, no new channel).
   *
   * ⚠ DORMANT / BORN ABSENT (RNG-STREAM SAFETY, the #148.5 / #75 genre, mirrored
   * verbatim from `homePriorObedience`): OPTIONAL and BORN ABSENT (≡ 0 at its one
   * consumer via `?? 0`), deliberately NOT in GENE_KEYS — so randomGenome /
   * mutateGenome / crossoverGenomes / geneDistance draw the EXACT SAME RNG in the
   * EXACT SAME order as HEAD, and the serialized genome (hence the production
   * fingerprint 57b0bdab…c673) is byte-identical (an absent optional key is
   * omitted by JSON.stringify). It gains a value ONLY when an evolution run opts
   * in via its OWN explicit `evolveDefLaneConvergence` boolean (#75: never a
   * widening of `evolveHomePrior`/`evolveHomePriorOffsets`, so those runs' draw
   * sequences are unmoved), and its draws happen STRICTLY AFTER both home-prior
   * blocks, so enabling it never re-orders an existing draw. The CONSUMPTION path
   * is separately gated by the dormant `pmLaneConvergence` match flag — every
   * draw AND every read is thus flag-gated.
   */
  defLaneConvergence?: number;
}

/**
 * ⭐ THE FROZEN k_PM CEILING (PM-T0, contract §2 M-PM.1 "bounds frozen at the stage
 * doc from the traced constant family"). `k_PM ∈ [0, 0.25]`.
 *
 * TRACED, NOT INVENTED. 0.25 is the LEGACY per-body convergence weight that the
 * emergent rewrite dropped: `src/ai/formations.ts:209` —
 * `if (!hasBall) y += (ball.pos.y − y · attackDir) · attackDir ·
 * g.defensiveCompactness · 0.25` — i.e. the table path's own maximum lateral
 * convergence toward the ball's lane, at `defensiveCompactness = 1`. The contract
 * names that line as this term's natural neighbour (§0.4 / §2 M-PM.1), so the new
 * axis can express EXACTLY as much convergence as the branch it restores and no
 * more. No new constant is introduced by this slice, and the number is not re-cut
 * later (the never-re-cut-after-sight rule): if PM-T1 needs a different ceiling,
 * that is a fork for the commander WITH numbers.
 */
export const PM_LANE_CONVERGENCE_MAX = 0.25;

/**
 * PM-T0 (M-PM.1): the gene → `k_PM` map, the SINGLE owner of the expression.
 * Born absent ⇒ `0` ⇒ the term vanishes ⇒ byte-identical world. PURE, no rng.
 * The gene is clamped to [0,1] before scaling, so no instrument can dose past the
 * frozen ceiling through this door.
 */
export function pmLaneConvergenceK(g: TacticalGenome): number {
  const v = g.defLaneConvergence;
  if (v === undefined || !Number.isFinite(v)) return 0;
  return clamp01(v) * PM_LANE_CONVERGENCE_MAX;
}

/**
 * ⭐ THE FROZEN OFFSET BOUND (A4 S2-P2, contract M-S2.1 "bounded"). Each per-slot
 * offset lives in [−0.5, +0.5]. RATIONALE, frozen here with its provenance: the
 * obedience gene's own domain is [0,1] (0 = no agreement, 1 = the A4-P1e-certified
 * strength ceiling), so ±0.5 is exactly the amount that lets ANY body reach EITHER
 * end of the certified domain from the neutral team whisper 0.5 (#148's certified
 * PRIMARY dose) — and no more. It also covers, exactly, every vector the S2-P1
 * frozen instrument grid priced (spread ±0.3, backLoaded/frontLoaded ±0.4,
 * singleAnchor +0.5/−0.125 about the matched mean 0.5), so the gene family can
 * EXPRESS the shapes the census measured without being able to invent a dose
 * outside the certified span. The bound applies to the OFFSET; `clamp01` applies to
 * the EFFECTIVE value (obedience + offset), which is what the consumer reads.
 */
export const HOME_PRIOR_OBEDIENCE_OFFSET_MAX = 0.5;

/** Slots covered by the offset family = the squad (`TEAM_SIZE` = 6; kept a local
 *  literal so this module stays free of any `sim/**` runtime import — the tests
 *  assert it EQUALS `TEAM_SIZE`). Role-blind by contract §3: every slot is born
 *  absent and mutates under the same law, GK included (the GK never reaches the v3
 *  station eye, so his slot is inert by the world's own geometry, not by a
 *  role-derived rule written into the gene). */
export const HOME_PRIOR_OFFSET_SLOTS = 6;

const clampOffset = (v: number): number => (Number.isFinite(v)
  ? Math.max(-HOME_PRIOR_OBEDIENCE_OFFSET_MAX, Math.min(HOME_PRIOR_OBEDIENCE_OFFSET_MAX, v))
  : 0);

/**
 * A4 S2-P2 (M-S2.1/M-S2.2): the EFFECTIVE per-body obedience for one squad slot =
 * `clamp01(homePriorObedience + offset_slot)`. Both parts are born absent ⇒ this is
 * `clamp01(0) = 0` at birth, and with the offsets absent it is `clamp01(obedience)`,
 * which `homePriorStrength` already maps identically to the raw gene (its own domain
 * clamp) — i.e. offsets-absent is BIT-IDENTICAL to the uniform whisper. PURE.
 */
export function effectiveHomePriorObedience(g: TacticalGenome, slot: number): number {
  return clamp01((g.homePriorObedience ?? 0) + (g.homePriorObedienceOffset?.[slot] ?? 0));
}

/**
 * A4 S2-P4: write a per-slot offset family onto ONE genome, clamped to the frozen
 * bound. NOTHING calls this at birth or during evolution — the gene stays born
 * absent (contract §3) and mutation/crossover keep their own opt-in paths. The only
 * caller in `src/**` is the explicitly opt-in A4 play-test entry (`game/a4World.ts`),
 * which supplies a CERTIFIED, role-blind family as instrument content.
 *
 * The writer lives HERE so this module remains the single owner of the field name in
 * `src/**` (the S2-P2 birth-neutrality scan): the entry hands over content, it never
 * names the gene.
 */
export function setHomePriorOffsets(g: TacticalGenome, offsets: readonly number[]): void {
  g.homePriorObedienceOffset = offsets.map(clampOffset);
}

/** Read the family back (absent ⇒ `undefined`) — the same single-owner reason. PURE. */
export function homePriorOffsets(g: TacticalGenome): readonly number[] | undefined {
  return g.homePriorObedienceOffset;
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
  'transitionPress',
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
  /**
   * A4-P2 (#148.5, the RNG-stream trap): opt-in that lets the dormant
   * `homePriorObedience` gene evolve. DEFAULT OFF — every production evolve.ts
   * call omits it, so the gene draws NO RNG and the flag-off random sequence
   * (mutation + crossover draws) stays byte-identical to HEAD. Its draws happen
   * ONLY when this is `true` and STRICTLY AFTER the GENE_KEYS loop, so enabling it
   * never re-orders any existing gene's draw. When shipped, an A4-P3-grade run
   * flips this together with the `eye.v4.homePrior` consumption flag.
   */
  evolveHomePrior?: boolean;
  /**
   * A4 S2-P2 (#164.3, the SAME RNG-stream trap): opt-in that lets the dormant
   * per-slot `homePriorObedienceOffset` family evolve. DEFAULT OFF — every
   * production evolve.ts call omits it, so the family draws NO RNG and the
   * flag-off random sequence stays byte-identical to HEAD. It is its OWN named
   * boolean (#75: every new gate is explicit) rather than a widening of
   * `evolveHomePrior`, so a home-prior-only run's stream is ALSO unmoved. Its
   * draws happen ONLY when this is `true` and STRICTLY AFTER the
   * `homePriorObedience` block, so enabling it never re-orders any existing draw.
   * When shipped, an S2-P3-grade run flips this together with `evolveHomePrior`
   * and the `eye.v4.homePrior` consumption flag.
   */
  evolveHomePriorOffsets?: boolean;
  /**
   * PM-T0 (#195.2, the SAME RNG-stream trap): opt-in that lets the dormant
   * `defLaneConvergence` gene evolve. DEFAULT OFF — every production evolve.ts call
   * omits it, so the gene draws NO RNG and the flag-off random sequence stays
   * byte-identical to HEAD. It is its OWN named boolean (#75) rather than a
   * widening of either home-prior opt-in, so those runs' streams are ALSO unmoved.
   * Its draws happen ONLY when this is `true` and STRICTLY AFTER both home-prior
   * blocks, so enabling it never re-orders any existing draw. When shipped, a
   * PM-T2-grade run flips this together with the `pmLaneConvergence` match flag.
   */
  evolveDefLaneConvergence?: boolean;
}

/** Returns a new genome; genes are clamped back to [0, 1]. */
export function mutateGenome(g: TacticalGenome, rng: Rng, opts: MutateOptions = {}): TacticalGenome {
  const rate = opts.rate ?? 0.45;
  const scale = opts.scale ?? 0.14;
  const out = { ...g };
  for (const k of GENE_KEYS) {
    if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
  }
  // A4-P2 (#148.5): the home-prior gene mutates ONLY under its explicit opt-in and
  // ONLY here — after the GENE_KEYS loop — so flag-off runs consume ZERO extra RNG
  // draws and stay byte-identical to HEAD. `{ ...g }` above already carried the
  // gene through untouched (born-absent ⇒ stays absent) in the flag-off path.
  if (opts.evolveHomePrior === true && rng.chance(rate)) {
    out.homePriorObedience = clamp01((out.homePriorObedience ?? 0) + rng.gaussian() * scale);
  }
  // A4 S2-P2 (#164.3): the per-slot OFFSET family mutates ONLY under its OWN explicit
  // opt-in and ONLY here — after the GENE_KEYS loop AND after the homePriorObedience
  // block — so flag-off runs consume ZERO extra RNG draws (byte-identical to HEAD) and
  // a homePrior-only run's draw sequence is unmoved too. `{ ...g }` above already
  // carried the family through untouched (born-absent ⇒ stays absent) in the flag-off
  // path. Role-BLIND (contract §3 BIRTH NEUTRALITY): the same rate/scale law runs over
  // every squad slot in slot order; each offset is clamped to the frozen ±0.5 bound.
  if (opts.evolveHomePriorOffsets === true) {
    const base = out.homePriorObedienceOffset;
    const next = Array.from(
      { length: HOME_PRIOR_OFFSET_SLOTS }, (_, i) => clampOffset(base?.[i] ?? 0),
    );
    for (let i = 0; i < HOME_PRIOR_OFFSET_SLOTS; i++) {
      if (rng.chance(rate)) next[i] = clampOffset(next[i] + rng.gaussian() * scale);
    }
    out.homePriorObedienceOffset = next;
  }
  // PM-T0 (#195.2): the defensive lane-convergence gene mutates ONLY under its OWN
  // explicit opt-in and ONLY here — after the GENE_KEYS loop AND after BOTH
  // home-prior blocks — so flag-off runs consume ZERO extra RNG draws
  // (byte-identical to HEAD) and neither home-prior run's draw sequence moves.
  // `{ ...g }` above already carried the gene through untouched (born-absent ⇒
  // stays absent) in the flag-off path.
  if (opts.evolveDefLaneConvergence === true && rng.chance(rate)) {
    out.defLaneConvergence = clamp01((out.defLaneConvergence ?? 0) + rng.gaussian() * scale);
  }
  return out;
}

/** Uniform crossover with occasional blending — child gene is from a, from b, or their mean. */
export function crossoverGenomes(
  a: TacticalGenome, b: TacticalGenome, rng: Rng, evolveHomePrior = false,
  evolveHomePriorOffsets = false, evolveDefLaneConvergence = false,
): TacticalGenome {
  const out = {} as TacticalGenome;
  for (const k of GENE_KEYS) {
    const r = rng.next();
    out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2;
  }
  // A4-P2 (#148.5): the home-prior gene crosses over ONLY under its explicit opt-in
  // and ONLY here — after the GENE_KEYS loop — so flag-off runs draw ZERO extra RNG
  // and stay byte-identical to HEAD. Flag-off ⇒ carry parent A's value through with
  // NO draw (born-absent ⇒ the key stays absent ⇒ serialization unchanged).
  if (evolveHomePrior) {
    const r = rng.next();
    const av = a.homePriorObedience ?? 0;
    const bv = b.homePriorObedience ?? 0;
    out.homePriorObedience = r < 0.4 ? av : r < 0.8 ? bv : (av + bv) / 2;
  } else if (a.homePriorObedience !== undefined) {
    out.homePriorObedience = a.homePriorObedience;
  }
  // A4 S2-P2 (#164.3): the per-slot OFFSET family crosses over ONLY under its OWN
  // explicit opt-in and ONLY here — after the GENE_KEYS loop AND after the
  // homePriorObedience block — so flag-off runs draw ZERO extra RNG and a
  // homePrior-only run is unmoved. ONE draw for the whole family, mirroring the
  // scalar gene's single from-a / from-b / blend law (the family is one agreement,
  // not six independent ones). Flag-off ⇒ carry parent A's family through with NO
  // draw (born-absent ⇒ the key stays absent ⇒ serialization unchanged).
  if (evolveHomePriorOffsets) {
    const r = rng.next();
    const av = a.homePriorObedienceOffset;
    const bv = b.homePriorObedienceOffset;
    out.homePriorObedienceOffset = Array.from(
      { length: HOME_PRIOR_OFFSET_SLOTS },
      (_, i) => {
        const ai = clampOffset(av?.[i] ?? 0);
        const bi = clampOffset(bv?.[i] ?? 0);
        return r < 0.4 ? ai : r < 0.8 ? bi : (ai + bi) / 2;
      },
    );
  } else if (a.homePriorObedienceOffset !== undefined) {
    out.homePriorObedienceOffset = a.homePriorObedienceOffset;
  }
  // PM-T0 (#195.2): the lane-convergence gene crosses over ONLY under its OWN
  // explicit opt-in and ONLY here — after the GENE_KEYS loop AND after BOTH
  // home-prior blocks — so flag-off runs draw ZERO extra RNG and neither
  // home-prior run is moved. Flag-off ⇒ carry parent A's value through with NO
  // draw (born-absent ⇒ the key stays absent ⇒ serialization unchanged).
  if (evolveDefLaneConvergence) {
    const r = rng.next();
    const av = a.defLaneConvergence ?? 0;
    const bv = b.defLaneConvergence ?? 0;
    out.defLaneConvergence = r < 0.4 ? av : r < 0.8 ? bv : (av + bv) / 2;
  } else if (a.defLaneConvergence !== undefined) {
    out.defLaneConvergence = a.defLaneConvergence;
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
  // 'Gegenpress' moved to transitionPress at Phase 112 — counter-pressing
  // the LOSS is what the word means; steady-state pressing is a high press.
  if (g.pressIntensity > 0.68) tags.push('High press');
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
  if ((g.transitionPress ?? 0.5) > 0.72) tags.push('Gegenpress');
  if ((g.transitionPress ?? 0.5) < 0.28) tags.push('Drops & recovers');
  if (tags.length === 0) tags.push('Balanced');
  return tags.slice(0, 3);
}
