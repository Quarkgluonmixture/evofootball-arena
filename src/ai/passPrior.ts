/**
 * EDS E2a — the census-derived pass base-rate table.
 * Authority: docs/world-model/EDS-E2A-CENSUS-PRIORS.md
 *
 * This file is DATA, not a model. Every number below was measured by
 * `scripts/probes/eds-e2a-prior-census.ts` over 250 sealed matches
 * (seeds 610,000..610,249) and validated against a disjoint held-out 250
 * (seeds 620,000..620,249). The probe re-derives the census on every run and
 * asserts this table equals it (gate X6), so the two cannot drift.
 *
 * The table exists because observation DELETES options rather than blurring
 * them (E0: 55 of 120 states unpriceable, all of them target-missing). An
 * option the passer cannot see is priced here, at the population rate, instead
 * of vanishing — because vanishing is what made not-looking informationally
 * superior in S3b. It is infrastructure like a sampling budget: it may not be
 * adjusted after any A/B result, ever.
 *
 * CENSUS TABLE SHA: 326ea40e9b6c4214584c683fe9b60732fe6753924eaefbdfad5159b22d564db0
 * (sha256 over the canonical JSON of {table, marginal}; gate X6 re-derives it.)
 */

/** Half-open metre bands over E0's own 6–30 m candidate window. */
export const PASS_PRIOR_BANDS: readonly (readonly [number, number])[] = [
  [6, 10], [10, 14], [14, 18], [18, 22], [22, 26], [26, 30],
];

export interface PassPriorRow {
  /** Lower edge of the band in metres; the MARGINAL row uses -1. */
  readonly bandFrom: number;
  readonly bandTo: number;
  readonly passes: number;
  readonly interceptedRate: number;
  readonly reachedRate: number;
  readonly otherTeammateRate: number;
  readonly unresolvedRate: number;
  /** Clean first touch GIVEN the ball reached the intended target. */
  readonly cleanGivenReached: number;
  /** reached x cleanGivenReached — what an option-pricer actually wants. */
  readonly receptionSuccessRate: number;
}

/**
 * E2a-1's PASS-LOG census: the passes the live chooser decided to play. Its P3
 * caught that this is a SELECTED sample and therefore the wrong population for
 * pricing options nobody chose — see EDS-E2A-CENSUS-PRIORS.md §7. Retained
 * untouched as the chosen-subset reference, as one side of the chooser-lift
 * diagnostic, and so E2a-1's own reproduction gate keeps working. NOT the
 * prior the pricing layer reads.
 */
export const PASS_PRIOR_TABLE: readonly PassPriorRow[] = [
  {
    bandFrom: 6,
    bandTo: 10,
    passes: 4377,
    interceptedRate: 0.17980351839159242,
    reachedRate: 0.7687914096413069,
    otherTeammateRate: 0.05071967100753941,
    unresolvedRate: 0.0006854009595613434,
    cleanGivenReached: 0.9295690936106984,
    receptionSuccessRate: 0.7146447338359607,
  },
  {
    bandFrom: 10,
    bandTo: 14,
    passes: 5113,
    interceptedRate: 0.17719538431449247,
    reachedRate: 0.7535693330725601,
    otherTeammateRate: 0.06727948366907882,
    unresolvedRate: 0.0019557989438685705,
    cleanGivenReached: 0.9294056579288866,
    receptionSuccessRate: 0.7003716017993351,
  },
  {
    bandFrom: 14,
    bandTo: 18,
    passes: 4572,
    interceptedRate: 0.19903762029746283,
    reachedRate: 0.7454068241469817,
    otherTeammateRate: 0.05096237970253718,
    unresolvedRate: 0.004593175853018373,
    cleanGivenReached: 0.9322183098591549,
    receptionSuccessRate: 0.6948818897637795,
  },
  {
    bandFrom: 18,
    bandTo: 22,
    passes: 3437,
    interceptedRate: 0.22781495490253129,
    reachedRate: 0.7067209775967414,
    otherTeammateRate: 0.05557171952283969,
    unresolvedRate: 0.009892347977887692,
    cleanGivenReached: 0.9304240428159737,
    receptionSuccessRate: 0.6575501891184172,
  },
  {
    bandFrom: 22,
    bandTo: 26,
    passes: 2455,
    interceptedRate: 0.20610997963340122,
    reachedRate: 0.7384928716904277,
    otherTeammateRate: 0.038289205702647655,
    unresolvedRate: 0.017107942973523423,
    cleanGivenReached: 0.924434638720353,
    receptionSuccessRate: 0.6826883910386965,
  },
  {
    bandFrom: 26,
    bandTo: 30,
    passes: 1503,
    interceptedRate: 0.19560878243512975,
    reachedRate: 0.688622754491018,
    otherTeammateRate: 0.09381237524950099,
    unresolvedRate: 0.021956087824351298,
    cleanGivenReached: 0.9169082125603865,
    receptionSuccessRate: 0.6314038589487692,
  },
];

/** The population rate over every band — what an UNSEEN option is priced at,
 * because a passer who cannot see the man cannot know his distance either. */
export const PASS_PRIOR_MARGINAL: PassPriorRow = {
  bandFrom: -1,
  bandTo: -1,
  passes: 21457,
  interceptedRate: 0.19508785011884233,
  reachedRate: 0.7411567320687887,
  otherTeammateRate: 0.057090926038122755,
  unresolvedRate: 0.006664491774246167,
  cleanGivenReached: 0.9288184619254228,
  receptionSuccessRate: 0.6884000559258051,
};

/**
 * EDS E2a-2 — the OPTION-SPACE table (commander ruling #8). This is the prior
 * the pricing layer consumes. It differs from the pass-log table above in its
 * POPULATION, not its method: every candidate at a real decision moment,
 * measured counterfactually by forking the world and substituting the target,
 * rather than only the passes the chooser decided to play. E2a-1's table is
 * retained directly above as the chosen-subset reference and as one side of
 * the chooser-lift diagnostic.
 *
 * OPTION-SPACE TABLE SHA: df0aa3407b0a49f2c24bb0bf29dcea8aa87ed3bed3aad89af5abbb66faea1903
 */
export const OPTION_SPACE_PRIOR_TABLE: readonly PassPriorRow[] = [
  {
    bandFrom: 6,
    bandTo: 10,
    passes: 3451,
    interceptedRate: 0.34685598377281945,
    reachedRate: 0.5896841495218778,
    otherTeammateRate: 0.06317009562445668,
    unresolvedRate: 0.0002897710808461316,
    cleanGivenReached: 0.914987714987715,
    receptionSuccessRate: 0.539553752535497,
  },
  {
    bandFrom: 10,
    bandTo: 14,
    passes: 3483,
    interceptedRate: 0.32271030720643124,
    reachedRate: 0.615848406546081,
    otherTeammateRate: 0.0611541774332472,
    unresolvedRate: 0.0002871088142405972,
    cleanGivenReached: 0.9132867132867133,
    receptionSuccessRate: 0.5624461670973299,
  },
  {
    bandFrom: 14,
    bandTo: 18,
    passes: 2867,
    interceptedRate: 0.30659225671433554,
    reachedRate: 0.6187652598535054,
    otherTeammateRate: 0.07359609347750262,
    unresolvedRate: 0.0010463899546564353,
    cleanGivenReached: 0.9160090191657272,
    receptionSuccessRate: 0.5667945587722358,
  },
  {
    bandFrom: 18,
    bandTo: 22,
    passes: 2101,
    interceptedRate: 0.28081865778200854,
    reachedRate: 0.6544502617801047,
    otherTeammateRate: 0.06425511661113756,
    unresolvedRate: 0.00047596382674916705,
    cleanGivenReached: 0.9127272727272727,
    receptionSuccessRate: 0.5973346025702047,
  },
  {
    bandFrom: 22,
    bandTo: 26,
    passes: 1357,
    interceptedRate: 0.341930729550479,
    reachedRate: 0.5969049373618276,
    otherTeammateRate: 0.061164333087693444,
    unresolvedRate: 0,
    cleanGivenReached: 0.9135802469135803,
    receptionSuccessRate: 0.5453205600589537,
  },
  {
    bandFrom: 26,
    bandTo: 30,
    passes: 855,
    interceptedRate: 0.37777777777777777,
    reachedRate: 0.5415204678362573,
    otherTeammateRate: 0.07953216374269007,
    unresolvedRate: 0.0011695906432748538,
    cleanGivenReached: 0.9136069114470843,
    receptionSuccessRate: 0.49473684210526314,
  },
];

export const OPTION_SPACE_PRIOR_MARGINAL: PassPriorRow = {
  bandFrom: -1,
  bandTo: -1,
  passes: 14114,
  interceptedRate: 0.32428794105143827,
  reachedRate: 0.609465778659487,
  otherTeammateRate: 0.06575031883236503,
  unresolvedRate: 0.00049596145670965,
  cleanGivenReached: 0.9142059986049755,
  receptionSuccessRate: 0.5571772707949554,
};

/** The band a distance falls in, or null outside the censused window. */
export function passPriorBandIndex(distanceMetres: number): number | null {
  for (let index = 0; index < PASS_PRIOR_BANDS.length; index++) {
    const [from, to] = PASS_PRIOR_BANDS[index];
    if (distanceMetres >= from && distanceMetres < to) return index;
  }
  // The top edge is inclusive: a 30.0 m pass belongs to the last band.
  const last = PASS_PRIOR_BANDS[PASS_PRIOR_BANDS.length - 1];
  if (distanceMetres === last[1]) return PASS_PRIOR_BANDS.length - 1;
  return null;
}

/**
 * The prior for an option at a KNOWN distance; outside the censused window the
 * marginal is the honest answer rather than an extrapolation.
 */
export function passPriorAt(distanceMetres: number): PassPriorRow {
  const index = passPriorBandIndex(distanceMetres);
  return index === null ? PASS_PRIOR_MARGINAL : PASS_PRIOR_TABLE[index];
}

/** Option-space band lookup — the one the pricing layer uses. */
export function optionSpacePriorBandIndex(distanceMetres: number): number | null {
  return passPriorBandIndex(distanceMetres);
}

export function optionSpacePriorAt(distanceMetres: number): PassPriorRow {
  const index = optionSpacePriorBandIndex(distanceMetres);
  return index === null ? OPTION_SPACE_PRIOR_MARGINAL : OPTION_SPACE_PRIOR_TABLE[index];
}

/**
 * EDS E2b-0 — the threat calibration curve.
 * Authority: docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md
 *
 * What E0's corridor read is WORTH, measured rather than assumed: realized
 * reception success by quintile of predicted interception threat, over the same
 * counterfactual forks E2a-2 censused. This is what puts a seen option's
 * physical read on the same probability axis as an unseen option's band prior,
 * so the two can be compared without a hand-set weight.
 *
 * CALIBRATION SHA: 52c1071334e6d09aeeb6ac66a6cda2b3686c0e7e05b9d6cd574be84a13fe3082
 */
export interface ThreatCalibrationRow {
  readonly quintile: number;
  readonly n: number;
  /** Predicted corridor threat in seconds; higher = more threatened. */
  readonly keyFrom: number;
  readonly keyTo: number;
  readonly realizedSuccess: number;
}

export const VALUE_ZONE_LONGITUDINAL_EDGES: readonly number[] = [-10.5, 10.5, 21];
/** The sim's own overlap gate (`Match.ts`: a release counts wide past 11 m). */
export const VALUE_ZONE_WIDE_METRES = 11;

export interface ValueZoneRow {
  /** 0..7 = longitudinal band x 2 + (wide ? 1 : 0); the MARGINAL row uses -1. */
  readonly zone: number;
  readonly receptions: number;
  /** V: P(shot by the passing team within 4.0 s | clean reception here). */
  readonly shotRate: number;
  readonly goalRate: number;
  readonly meanProgression: number;
}

/**
 * The zone a position falls in, in the passing team's attack frame. Pitch
 * thirds (football's own division) with the attacking third halved, crossed
 * with the sim's own wide gate. Never extrapolated: every position on the pitch
 * lands in exactly one cell.
 */
export function valueZoneIndex(localX: number, y: number): number {
  let band = VALUE_ZONE_LONGITUDINAL_EDGES.length;
  for (let index = 0; index < VALUE_ZONE_LONGITUDINAL_EDGES.length; index++) {
    if (localX < VALUE_ZONE_LONGITUDINAL_EDGES[index]) {
      band = index;
      break;
    }
  }
  return band * 2 + (Math.abs(y) >= VALUE_ZONE_WIDE_METRES ? 1 : 0);
}

/**
 * EDS E5a — the VALUE table (commander ruling #15.3).
 * Authority: docs/world-model/EDS-E5-VALUE-AXIS.md
 *
 * The other half of the decision, measured the same way the first half was: over
 * E2a-2's counterfactual forks, following each clean reception to a 4.0 s
 * horizon and recording whether the passing team got a shot away. The chooser
 * multiplies this by the reception probability, and E5a's V4 gate is what makes
 * that product a measurement rather than a weight — it must predict the
 * conjunction (clean reception AND shot) the world actually produced.
 *
 * Measured under legacy-brain play, exactly like the two tables above; the
 * circularity is registered in the contract §2.1, not hidden.
 *
 * VALUE TABLE SHA: 0125071f52165f4d28a7e5085e588a54776e21fcd6b89e3b48537ce415ca3bc9
 * (sha256 over the canonical JSON of {table, marginal}; gate X6 re-derives it.)
 *
 * 7,864 clean receptions over the census set; four of the eight cells clear the
 * 400-reception floor and the other four honestly read the marginal — including
 * both attacking-third-inner cells, which is the sharpest limitation of this
 * table and is reported rather than repaired (contract §7.1).
 */
export const VALUE_ZONE_TABLE: readonly ValueZoneRow[] = [
  { zone: 0, receptions: 1612, shotRate: 0.013027295285359801, goalRate: 0, meanProgression: 11.77326485206329 },
  { zone: 1, receptions: 226, shotRate: 0.022123893805309734, goalRate: 0, meanProgression: 12.866477998231302 },
  { zone: 2, receptions: 3546, shotRate: 0.07642413987591652, goalRate: 0.00535815002820079, meanProgression: 6.814456835836743 },
  { zone: 3, receptions: 1544, shotRate: 0.08808290155440414, goalRate: 0.0045336787564766836, meanProgression: 6.237657880728535 },
  { zone: 4, receptions: 500, shotRate: 0.114, goalRate: 0.03, meanProgression: 0.2319336799855316 },
  { zone: 5, receptions: 243, shotRate: 0.13580246913580246, goalRate: 0.0411522633744856, meanProgression: 0.5243461434916344 },
  { zone: 6, receptions: 129, shotRate: 0.09302325581395349, goalRate: 0.10852713178294573, meanProgression: -3.934466738696879 },
  { zone: 7, receptions: 64, shotRate: 0.421875, goalRate: 0.09375, meanProgression: -1.9393465255236906 },
];

export const VALUE_ZONE_MARGINAL: ValueZoneRow = {
  zone: -1,
  receptions: 7864,
  shotRate: 0.07146490335707019,
  goalRate: 0.009028484231943032,
  meanProgression: 7.031161399133294,
};

/** V for a position, with the marginal for cells the census could not measure. */
export function valueZoneAt(localX: number, y: number): ValueZoneRow {
  const row = VALUE_ZONE_TABLE[valueZoneIndex(localX, y)];
  return row.receptions >= VALUE_ZONE_SAMPLE_FLOOR ? row : VALUE_ZONE_MARGINAL;
}

/** E5a's V1 floor, frozen in the contract: below this a cell is not a measurement. */
export const VALUE_ZONE_SAMPLE_FLOOR = 400;

export const THREAT_CALIBRATION: readonly ThreatCalibrationRow[] = [
  {
    quintile: 0,
    n: 2019,
    keyFrom: -2.017366997896862,
    keyTo: 0.038622300107134966,
    realizedSuccess: 0.8286280336800397,
  },
  {
    quintile: 1,
    n: 2019,
    keyFrom: 0.03868202803909754,
    keyTo: 0.2955869871130011,
    realizedSuccess: 0.6230807330361565,
  },
  {
    quintile: 2,
    n: 2019,
    keyFrom: 0.2956539813153475,
    keyTo: 0.5363880087900351,
    realizedSuccess: 0.5096582466567607,
  },
  {
    quintile: 3,
    n: 2019,
    keyFrom: 0.5364606140899261,
    keyTo: 0.805766621095352,
    realizedSuccess: 0.4715205547300644,
  },
  {
    quintile: 4,
    n: 2019,
    keyFrom: 0.806141904559798,
    keyTo: 2.944990072437604,
    realizedSuccess: 0.4314016840019812,
  },
];
