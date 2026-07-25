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
