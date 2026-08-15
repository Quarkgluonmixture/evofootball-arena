/**
 * ⭐⭐ R-乙 — THE FROZEN QUANTITY LIST (the standing gap table's registry).
 *
 * Authority: `docs/world-model/RULER-COVERAGE-CONTRACT.md` §1 R-乙, dispatched by ruling #271.2.
 *
 * THIS FILE IS THE SINGLE SOURCE OF THE LIST. The probe (`scripts/probes/r-yi-gap-table.ts`)
 * measures the OURS column off it; the §RESULT / §1 generator
 * (`scripts/analysis/r-yi-gap-table-result.ts`) prints the REAL column off it. Nothing here is
 * re-typed anywhere else — a second copy of a band would be the copy that drifts.
 *
 * ⚠ PURE DATA. This module has NO side effects and constructs nothing, so both the probe and the
 * generator can import it. It is NOT a probe and running it does nothing.
 *
 * ⭐ THE THREE COLUMN LAWS, frozen with the list:
 *   OURS   — every row names the EXISTING instrument semantics it is measured with, traced to the
 *            probe/engine file that owns them. No row invents a measurement.
 *   REAL   — a cited published value with a confidence grade, or the honest word UNSOURCED.
 *            `inherited: '#170'` rows carry the tempo-census (#170–#173) VETTED band and are
 *            machine-checked against the committed artifact's own `referenceBands` (G-REAL-HONEST):
 *            the inheritance is proven, never asserted.
 *   STATUS — 'UNADJUDICATED' on every row, always, in this instrument. Deliberate-arcade-deviation
 *            vs gap vs unknown is the RULING CHAIN's word (contract §1, §4). The executor never
 *            writes a verdict here, and the enum has no other member on purpose.
 *
 * ⚠ EVERY REAL value is ELEVEN-a-side, full-pitch, 90-minute football. Ours is 6v6 on a
 * 0.70-scaled pitch over a 240 s match clock. The bands ORIENT; they are never targets and no
 * number in this file may reach a sim value (VISION §3 house law; G-VALUES-UNREACHABLE proves it).
 */

/** The confidence grade on the REAL column. */
export type Confidence = 'HIGH' | 'MED' | 'LOW' | 'UNSOURCED';
/** Where the REAL value came from. */
export type Provenance = '#170' | 'new' | 'none';
/** ⭐ The STATUS column has exactly ONE member in this instrument, by contract. */
export type Status = 'UNADJUDICATED';

/**
 * ⭐⭐ BAND FIDELITY (fixed of record #272.3→ (iv)). A band the source never stated is not a
 * source. Every sourced row declares WHAT SHAPE its REAL value is, and the shape is
 * MACHINE-CHECKED against the row's own citation fields by `G-REAL-HONEST.bandFidelity`:
 *
 *   citedPoint      — the source published ONE number. lo = hi = centre, and that number must
 *                     occur verbatim in `source`. No width is invented around it.
 *   citedRange      — the source published BOTH edges. Both must occur verbatim in `source`.
 *   derivedPoint    — one number computed from cited inputs. The arithmetic lives in
 *                     `bandReceipt` and the value must occur verbatim THERE.
 *   derivedRange    — both edges computed/declared from cited inputs; both must occur in
 *                     `bandReceipt`, which must show the derivation.
 *   inheritedVetted — a #170-vetted band inherited wholesale. Its receipt is the #170 vetting
 *                     itself and the edges are separately proven equal to the committed
 *                     tempo-census artifact (`inheritedBandsMatchTheCommittedArtifact`).
 *                     ⚠ Some #170 widths (B4, B5, B9, B10) were widened by #170 around a single
 *                     datapoint; that widening is #170's, declared here, not re-invented here.
 */
export type BandKind = 'citedPoint' | 'derivedPoint' | 'citedRange' | 'derivedRange'
  | 'inheritedVetted' | 'none';

/**
 * ⭐⭐ THE ONE CLOCK CONVENTION (fixed of record #272.3→ (ii)). The engine maps its own match
 * onto a 90′ display clock in ONE place — `Match.minute()`:
 * `floor((simTime / duration) * 90)` (`src/sim/Match.ts`) over `MATCH_DURATION` sim-seconds
 * (`src/sim/constants.ts`, whose own comment reads "Display clock maps this to 90'"). Both
 * numbers are EXTRACTED FROM `src/**` AT RUN TIME by the probe (never typed here), and they
 * give the single mapping this instrument uses:
 *
 *   displaySecondsPerSimSecond = (90 × 60) / MATCH_DURATION      ( = 22.5 today )
 *
 * A published 11-a-side, 90-minute number can therefore be met on exactly TWO axes, and the
 * fix is that BOTH are printed for EVERY banded row rather than one being chosen per row:
 *
 *   convention A — SIM TIME TAKEN LITERALLY. A sim-second is a second: durations compare as
 *                  measured, and a per-match count must be re-expressed per 90 real minutes
 *                  (our match spans MATCH_DURATION/60 real minutes, so × displaySecondsPerSimSecond).
 *   convention B — THE DISPLAY CLOCK. Our match IS the 90 minutes: per-match counts compare as
 *                  measured, and a duration must be stretched by displaySecondsPerSimSecond.
 *
 * `clock` below says which of the two arithmetics a row needs. `invariant` rows (shares, and
 * counts per spell) read the SAME on both axes — which is why they, and only they, are free of
 * the artifact.
 */
export type ClockDimension = 'duration' | 'perMatchCount' | 'perTimeRate' | 'invariant';

export interface RealValue {
  /** band low / high in the row's unit; BOTH null iff confidence === 'UNSOURCED'. */
  lo: number | null;
  hi: number | null;
  /** the published central value where one exists (never invented). */
  centre: number | null;
  /** the band as a human reads it. */
  text: string;
  /** the citation: publisher + what exactly was published + URL, or why nothing exists. */
  source: string;
  confidence: Confidence;
  inherited: Provenance;
  /** ⭐ what shape the REAL value is, machine-checked against the citation (see BandKind). */
  bandKind: BandKind;
  /** ⭐ the receipt for any width or derivation this row's band carries. '' iff bandKind is
   *  'none' or the edges are verbatim in `source` (citedPoint / citedRange). */
  bandReceipt: string;
  /** the #170 band id this row inherits or neighbours (audit trail into TEMPO-CENSUS.md §5). */
  b170?: string;
}

export interface Quantity {
  id: string;
  /** the quantity in football words (the decision-point-in-plain-language rule). */
  name: string;
  unit: string;
  /** ⭐ which clock arithmetic this row needs to meet an 11-a-side 90′ number (see ClockDimension). */
  clock: ClockDimension;
  /** the key this row's measured value is stored under in the artifact's `result.ours[arm]`. */
  key: string;
  /** ⭐ HOW WE MEASURE IT, and which existing instrument's semantics that is. */
  oursSemantics: string;
  /** the estimator family the probe uses for this row (checked by G-NON-VACUITY). */
  estimator: 'ratioOfSums' | 'perMatchMean' | 'quantileTriple' | 'shareOfMatches';
  real: RealValue;
  status: Status;
  /** an arm on which this row is EXPECTED to be structurally zero, declared ex ante. */
  zeroByStructure?: readonly string[];
  /** anything the reader must know before comparing the two columns. */
  caveat?: string;
}

const UNSOURCED = (why: string, b170?: string): RealValue => ({
  lo: null, hi: null, centre: null, text: 'UNSOURCED',
  source: why, confidence: 'UNSOURCED', inherited: b170 === undefined ? 'none' : '#170', b170,
  bandKind: 'none', bandReceipt: '',
});
/** the receipt every #170-inherited band carries: the vetting is #170's and is machine-proven
 *  against the committed tempo artifact by `G-REAL-HONEST.inheritedBandsMatchTheCommittedArtifact`. */
const INHERITED_RECEIPT = (b: string, what: string): string =>
  `#170-VETTED BAND ${b}, inherited wholesale and machine-checked edge-for-edge against the `
  + `committed tempo-census artifact (docs/world-model/data/tempo-census.json). ${what} `
  + 'This round neither re-derives nor re-widens it (fixed of record #272.3→ (iv)).';

/* ========================================================================== */
/* THE LIST — 21 rows, frozen before any battery was read.                     */
/* ========================================================================== */
export const QUANTITIES: readonly Quantity[] = [
  {
    id: 'Q01',
    name: 'how long a team keeps the ball (open-play possession spell, mean)',
    unit: 'sim-seconds',
    clock: 'duration',
    key: 'spellMeanS',
    oursSemantics: 'THE #173 SPELL. A maximal interval of same-owner-TEAM control while '
      + 'phase === "playing", opened at the first tick a body of that team owns the ball, '
      + 'SUSPENDED (not ended) while the ball is loose in play, ended by an opponent establishing '
      + 'ownership / the phase leaving "playing" / full time; duration = (endTick − startTick) · DT '
      + 'so in-spell loose time is INCLUDED (the Opta "sequence" shape). openPlay origin only. '
      + 'Semantics re-derived from `scripts/probes/tempo-census.ts` `censusOne` and PROVEN '
      + 'identical to it by G-SEMANTICS-INHERITED (exact re-walk of that probe\'s own smoke block).',
    estimator: 'ratioOfSums',
    real: {
      lo: 9.6, hi: 10.4, centre: 10.0,
      text: '9.6 – 10.4 s',
      source: 'INHERITED #170-vetted band B1 (TEMPO-CENSUS.md §5): Opta / Stats Perform Premier '
        + 'League open-play sequences — 10.4 s mean in 2024-25, 9.6 s in 2025-26. '
        + 'https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · '
        + 'https://www.premierleague.com/en/news/4426039',
      confidence: 'MED', inherited: '#170', b170: 'B1',
      bandKind: 'inheritedVetted',
      bandReceipt: INHERITED_RECEIPT('B1', 'Its two edges are the two SEASON MEANS the source itself publishes (10.4 s in 2024-25, 9.6 s in 2025-26) — a cited range, not a widening.'),
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q02',
    name: 'the shape of that distribution (spell p25 / median / p75)',
    unit: 'sim-seconds',
    clock: 'duration',
    key: 'spellQuantilesS',
    oursSemantics: 'the same #173 spell population, pooled across seeds; p25 / median / p75 by the '
      + 'house index form. CI by CLUSTER bootstrap over match seeds (the pooled sample is '
      + 're-formed inside each resample, so the interval respects the clustering).',
    estimator: 'quantileTriple',
    real: UNSOURCED('Opta publishes sequence MEANS, not the quantile set; #170 searched and found '
      + 'no public quantile source (B2 = ABSENT) and this round found none either. Our quantiles '
      + 'are reported against NO band — the honest form.', 'B2'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q03',
    name: 'how long a body holds the ball per touch',
    unit: 'sim-seconds',
    clock: 'duration',
    key: 'holdMeanS',
    oursSemantics: 'THE #173 TOUCH. One ownership episode (reception → release): a new '
      + '`ball.owner.gid` opens it, a change of gid closes it, and it is CLOSED at the phase '
      + 'boundary so no dead-ball time leaks in (#171.1.i). A DURATION — sim-seconds, never '
      + 'rescaled to the 90′ clock.',
    estimator: 'ratioOfSums',
    real: {
      lo: 0.8, hi: 1.3, centre: 0.98,
      text: '0.8 – 1.3 s (derived centre 0.98 s)',
      source: 'INHERITED #170-vetted band B4 (DERIVED, arithmetic shown): a player is in '
        + 'possession ≈109 s across a 90′ match (gulfnews, quoting the standard broadcast / '
        + '《The Numbers Game》 figure) and is involved in 111 ± 77 on-ball activities per match '
        + '(PMC3778701) ⇒ 109 / 111 ≈ 0.98 s; widened to 0.8–1.3 s for the dispersion. '
        + 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3778701',
      confidence: 'LOW', inherited: '#170', b170: 'B4',
      bandKind: 'inheritedVetted',
      bandReceipt: INHERITED_RECEIPT('B4', '⚠ ITS WIDTH IS #170\'S: the cited inputs give the single derived centre 0.98 s (109 s in possession / 111 on-ball activities) and #170 widened it to 0.8–1.3 s for dispersion.'),
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q04',
    name: 'how often the ball changes hands',
    unit: 'possession changes per display-minute (both teams)',
    clock: 'perTimeRate',
    key: 'turnoversPerDisplayMin',
    oursSemantics: 'spells whose terminator is `opponentControl`, divided by the ONE rate '
      + 'denominator `match.simTime` (PLAYED sim-seconds — #171.1.ii), then mapped onto the 90′ '
      + 'display clock by × (MATCH_DURATION / 90). ⭐ BOTH axes are emitted (per sim-minute = what '
      + 'the user watches at 1×, per display-minute = the 90′ mapping); the row is READ on the '
      + 'display axis because that is the axis the real band lives on.',
    estimator: 'ratioOfSums',
    real: {
      lo: 3.0, hi: 4.5, centre: 3.8,
      text: '3.0 – 4.5 per display-minute',
      source: 'INHERITED #170-vetted band B5 (DERIVED from B1 + ball-in-play time, arithmetic '
        + 'shown): the PL ball was in play 56:58 of 90 in 2024-25; at a ≈10 s mean sequence that '
        + 'is ≈342 sequence-ends per match ⇒ 342/90 ≈ 3.8 per display-minute. NOT an independent '
        + 'measurement — it is B1 re-expressed and inherits B1\'s uncertainty. Ball-in-play source: '
        + 'https://theanalyst.com/articles/premier-league-ball-in-play-are-we-seeing-less-football-2025-26',
      confidence: 'LOW', inherited: '#170', b170: 'B5',
      bandKind: 'inheritedVetted',
      bandReceipt: INHERITED_RECEIPT('B5', '⚠ ITS WIDTH IS #170\'S: the cited inputs give the single derived value ≈3.8 per display-minute (342 sequence-ends / 90) and #170 widened it to 3.0–4.5.'),
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q05',
    name: 'how many touches a possession is made of',
    unit: 'touches per open-play spell',
    clock: 'invariant',
    key: 'touchesPerSpell',
    oursSemantics: 'ownership episodes counted inside each openPlay-origin spell (#173\'s '
      + '`touchesPerPossession`).',
    estimator: 'ratioOfSums',
    real: {
      lo: 2.88, hi: 5.12, centre: 3.75,
      text: '2.88 – 5.12 PASSES per sequence (league central ≈3.5–4)',
      source: 'INHERITED #170-vetted band B3: Opta PL team-season range 2.88 (lowest) to 5.12 '
        + '(highest); Man City 5.1, Southampton 4.4 in 2024-25. Same two sources as B1: '
        + 'https://theanalyst.com/articles/analysing-premier-league-playing-styles-2024-25 · '
        + 'https://www.premierleague.com/en/news/4426039',
      confidence: 'MED', inherited: '#170', b170: 'B3',
      bandKind: 'inheritedVetted',
      bandReceipt: INHERITED_RECEIPT('B3', 'Its two edges are the two team-season extremes the source itself publishes (2.88 lowest, 5.12 highest) — a cited range, not a widening.'),
    },
    caveat: '⚠ THE COLUMNS COUNT DIFFERENT THINGS. The real band counts PASSES per sequence; ours '
      + 'counts TOUCHES (ownership episodes). A carry adds touches without a pass, so the real '
      + 'band is a LOWER BOUND on the comparable quantity — inherited caveat, #170 B3.',
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q06',
    name: 'how many passes find a team-mate',
    unit: 'share of passes completed',
    clock: 'invariant',
    key: 'passCompletion',
    oursSemantics: 'the engine\'s OWN passive counters: Σ `team.stats.passesCompleted` / '
      + 'Σ `team.stats.passes`, both teams. No pass event is re-derived by this probe.',
    estimator: 'ratioOfSums',
    real: {
      lo: 0.753, hi: 0.88, centre: null,
      text: '75.3 % – 88 % (2024-25 team extremes; league centre NOT published in the located source)',
      source: 'NEW this round. Premier League 2024-25 team pass-completion extremes: Manchester '
        + 'City 88 % (highest), Nottingham Forest 75.3 % (lowest), via StatMuse pass-completion '
        + 'tables. https://www.statmuse.com/fc/ask/pass-completion-rate-premier-league-by-team — '
        + 'an aggregator, and the band\'s CENTRE is unsourced ⇒ LOW.',
      confidence: 'LOW', inherited: 'new',
      bandKind: 'citedRange',
      bandReceipt: '',
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q07',
    name: 'how much of the passing goes forward',
    unit: 'share of passes played forward',
    clock: 'invariant',
    key: 'forwardPassShare',
    oursSemantics: 'the engine\'s OWN counter: Σ `team.stats.passesForward` / Σ `team.stats.passes`. '
      + '⚠ `passesForward` is DEFINED by the engine as a pass played ≥2 m toward the opponents\' '
      + 'goal (`src/sim/types.ts`), so its complement pools BACKWARD and LATERAL together. '
      + 'Backward vs lateral is NOT SEPARABLE with existing instrument semantics and no semantics '
      + 'are invented here: the pooled complement is published as one number, labelled.',
    estimator: 'ratioOfSums',
    real: UNSOURCED('Opta records pass direction (forwards / sideways / backwards) as an event '
      + 'attribute, but no league-average SHARE was located in any public source this round '
      + '(searched: Opta stat definitions, Stats Perform, aggregators). The row ships UNSOURCED '
      + 'rather than with a guessed band.'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q08',
    name: 'shots',
    unit: 'shots per TEAM per match',
    clock: 'perMatchCount',
    key: 'shotsPerTeam',
    oursSemantics: 'Σ `team.stats.shots` per match / 2 (the arms are symmetric by construction, so '
      + 'the halving is exact in expectation, not per match — #171.1.iii\'s scope rule, inherited).',
    estimator: 'perMatchMean',
    real: {
      lo: 10, hi: 14.5, centre: null,
      text: '10 – 14.5 per team per match (WEAK: centre not sourced)',
      source: 'INHERITED #170-vetted band B9, labelled WEAK at source: the only team-level '
        + 'datapoint located was Arsenal 14.53 shots/match 2024-25 (StatMuse), among the league '
        + 'LEADERS ⇒ the league mean sits below it. Order-of-magnitude line only. '
        + 'https://www.statmuse.com/fc/ask/premier-league-teams-average-shot-per-game',
      confidence: 'LOW', inherited: '#170', b170: 'B9',
      bandKind: 'inheritedVetted',
      bandReceipt: INHERITED_RECEIPT('B9', '⚠ ITS WIDTH IS #170\'S, and #170 labelled it WEAK at source: one located datapoint (Arsenal 14.53/match, a league leader) and an order-of-magnitude floor of 10.'),
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q09',
    name: 'goals',
    unit: 'goals per match (both teams)',
    clock: 'perMatchCount',
    key: 'goalsPerMatch',
    oursSemantics: '`match.score[0] + match.score[1]` at full time.',
    estimator: 'perMatchMean',
    real: {
      lo: 2.82, hi: 2.88, centre: 2.88,
      text: '2.82 – 2.88 per match (both edges cited; 2.88 = 2024-25)',
      source: 'NEW this round. Opta Analyst: each of the four Premier League campaigns from '
        + '2021-22 to 2024-25 "averaged at least 2.82 goals per game", and 2024-25 ran at 2.88 '
        + 'after 100 matches. https://theanalyst.com/articles/premier-league-goals-low-stats · '
        + 'https://theanalyst.com/articles/premier-league-2024-25-data-trends-stats '
        + '⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED band 2.8 – 2.9 '
        + 'around these two cited numbers. Both edges are now the cited numbers themselves.',
      confidence: 'MED', inherited: 'new',
      bandKind: 'citedRange',
      bandReceipt: '',
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q10',
    name: 'taking a man on (attempts)',
    unit: 'CONTESTED take-on attempts per TEAM per match',
    clock: 'perMatchCount',
    key: 'takeOnAttemptsPerTeam',
    oursSemantics: '⭐⭐ RE-KEYED of record #272.3→ (i): `match.cbLedger.touchPastContested` / 2 '
      + '— aimed knocks that had AT LEAST ONE contesting body inside the engine\'s own contest '
      + 'radius at the release. Epoch 1 published `touchPasts` / 2, which counts every aimed '
      + 'knock INCLUDING those released into an empty contest radius; those cannot beat anybody, '
      + 'so the row\'s stated semantics ("an aimed knock past a contesting body") was false for '
      + 'a fifth of its own count and Q11\'s denominator was not the commensurable take-on '
      + 'population. The uncontested remainder (`touchPasts − touchPastContested`) is published '
      + 'BESIDE this row as CONTEXT, never folded into it. '
      + '⚠ THE COUNTER IS THE ROUND\'S ONE DECLARED `src/**` CHANGE: a pure additive field, '
      + 'written once inside `performTouchPast` and read NOWHERE in `src/**` '
      + '(`G-ADDITIVE-COUNTER` proves both from the engine\'s own source). '
      + 'In BARE PRODUCTION this is STRUCTURALLY ZERO: `performTouchPast` '
      + 'is reachable only through `Match.forcedTouchPast`, which is null in every production '
      + 'path (R-甲 A7, ABSENT). ⚠ `team.stats.dribbles` is NOT this quantity — the engine '
      + 'increments it on every non-recollect capture by an outfielder (`Match.ts` giveBall), so '
      + 'it counts possession GAINS, not take-ons; it is published beside this row as context '
      + 'under its own key and is never compared to the real band.',
    estimator: 'perMatchMean',
    real: UNSOURCED('The located source names only the four HIGHEST attempting squads ("all four '
      + 'around the 21 take-on attempts per 90 minute mark", Brighton / Chelsea / Tottenham / '
      + 'West Ham, 2024-25 to 19 Jan 2025, https://fivda.com/2025/01/24/premier-league-top-'
      + 'dribblers-2025/). A league MEAN was not published there or anywhere located, so no band '
      + 'is stated: ≈21 is an upper-tail marker, not a centre.'),
    zeroByStructure: ['bare'],
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q11',
    name: 'taking a man on (does it come off)',
    unit: 'share of CONTESTED take-ons that beat every contesting body',
    clock: 'invariant',
    key: 'takeOnSuccess',
    oursSemantics: '⭐⭐ RE-KEYED of record #272.3→ (i): `cbLedger.touchPastCleanBeats` / '
      + '`cbLedger.touchPastContested` — knocks that beat EVERY challenger they were aimed past, '
      + 'over the knocks that HAD a challenger. Epoch 1 divided by `touchPasts`, whose '
      + 'uncontested part is structurally incapable of a clean beat (the numerator already '
      + 'requires `challengers > 0`), so the published share was diluted by a population real '
      + 'football does not count as take-ons — and correcting it INVERTS the row\'s sign against '
      + 'the real band. The per-CHALLENGER form `touchPastBeaten` / `touchPastChallengers` and '
      + 'the uncontested count are published beside it under their own keys. Zero-denominator in '
      + 'bare production, by construction (see Q10).',
    estimator: 'ratioOfSums',
    real: {
      lo: 0.401, hi: 0.484, centre: 0.437,
      text: '40.1 % – 48.4 % (league mean 43.7 %)',
      source: 'NEW this round. Premier League 2024-25 (snapshot 19 Jan 2025): "the average '
        + 'success rate of take-ons across all squads … is 43.7 %"; Manchester City highest at '
        + '48.4 %, Leicester lowest at 40.1 %. https://fivda.com/2025/01/24/premier-league-top-'
        + 'dribblers-2025/ — a blog reporting Opta-derived squad figures, mid-season snapshot ⇒ LOW.',
      confidence: 'LOW', inherited: 'new',
      bandKind: 'citedRange',
      bandReceipt: '',
    },
    zeroByStructure: ['bare'],
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q12',
    name: 'fouls',
    unit: 'fouls per TEAM per match',
    clock: 'perMatchCount',
    key: 'foulsPerTeam',
    oursSemantics: 'Σ `team.stats.fouls` per match / 2 (the per-team scope rule of Q08).',
    estimator: 'perMatchMean',
    real: {
      lo: 9, hi: 12, centre: 10.5,
      text: '9 – 12 per team per match',
      source: 'INHERITED #170-vetted band B10, labelled WEAK at source: Arsenal committed 399 '
        + 'fouls in 38 matches in 2024-25 = 10.5/match (StatMuse); one team, one season, band = '
        + 'that value ±1.5. '
        + 'https://www.statmuse.com/fc/ask/premier-league-fouls-team-stats-2024-2025',
      confidence: 'LOW', inherited: '#170', b170: 'B10',
      bandKind: 'inheritedVetted',
      bandReceipt: INHERITED_RECEIPT('B10', '⚠ ITS WIDTH IS #170\'S, and #170 labelled it WEAK at source: one located datapoint (Arsenal 10.5 fouls/match) ±1.5.'),
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q13',
    name: 'cards',
    unit: 'yellow cards per match (both teams)',
    clock: 'perMatchCount',
    key: 'yellowsPerMatch',
    oursSemantics: 'Σ `team.stats.yellows` per match, both teams (a second yellow counts here AND '
      + 'as a red, the engine\'s own convention). Reds are published beside it under their own key.',
    estimator: 'perMatchMean',
    real: {
      lo: 4.076, hi: 4.076, centre: 4.076,
      text: '4.076 yellows per match (both teams) — a cited POINT, no width',
      source: 'NEW this round, arithmetic shown: 1,549 yellow cards (and 52 reds) across the '
        + 'Premier League 2024-25 season = 380 matches ⇒ 1,549 / 380 = 4.076 yellows and '
        + '52 / 380 = 0.137 reds per match. Totals from MyFootballFacts (updated matchday 38); '
        + 'the division is ours. https://www.myfootballfacts.com/premier-league/all-time-premier-'
        + 'league/cards/premier-league-red-and-yellow-cards-2024-25/ '
        + '⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED band 4.0 – 4.2 '
        + 'around this single derived number. It is now a POINT.',
      confidence: 'MED', inherited: 'new',
      bandKind: 'derivedPoint',
      bandReceipt: 'DERIVED from two cited season totals, arithmetic in full: 1,549 yellow cards '
        + '/ 380 matches = 4.076315… ⇒ 4.076 yellows per match (both teams). Nothing is widened '
        + 'around it: the publisher states the TOTALS, the division is ours, and a single number '
        + 'divided by a single number is a point, not a band.',
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q14',
    name: 'how much of the game is played under pressure (pressing-intensity proxy)',
    unit: 'share of open-play first receptions taken with an opponent inside the pressure radius',
    clock: 'invariant',
    key: 'pressedReceptionShare',
    oursSemantics: '⭐ THE #173 INSTRUMENT, unchanged: among the FIRST reception of each '
      + 'openPlay-origin spell, the share whose nearest-opponent distance at the reception tick is '
      + '≤ the substrate\'s OWN pressure switch `TOUCH_CONTROL_DIST` (src/sim/constants.ts, '
      + 'traced at run time, not typed). Restart/kickoff-origin receptions are set-piece geometry '
      + 'and are EXCLUDED from the headline (#171.1.iv).',
    estimator: 'ratioOfSums',
    real: UNSOURCED('No real-football pressed-reception share exists in comparable form: the '
      + 'public pressing metrics (PPDA, high turnovers, pressures) are differently defined and '
      + 'are not a share of receptions. #170 reached the same conclusion for the neighbouring '
      + 'quantity (B7 = ABSENT) and read it as an INTERNAL contrast instead. Ours is published '
      + 'against NO band, and its job here is the ARM-TO-ARM and RUN-TO-RUN reading.', 'B7'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q15',
    name: 'aerial duels',
    unit: 'aerial duels won per TEAM per match',
    clock: 'perMatchCount',
    key: 'aerialsWonPerTeam',
    oursSemantics: 'Σ `team.stats.headersWon` per match / 2 — the engine\'s own aerial-duel-won '
      + 'counter (headed shots, clearances and knockdowns).',
    estimator: 'perMatchMean',
    real: UNSOURCED('Searched for a Premier League team-level aerial-duels-per-match figure '
      + '(Opta/FBref/StatMuse/one-versus-one): every located source gave either individual-player '
      + 'totals or season totals with no matches-played denominator, and FBref\'s squad '
      + 'miscellaneous table refused automated access (HTTP 403). No credible team-per-match '
      + 'value ⇒ the row ships UNSOURCED rather than with a computed guess.'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q16',
    name: 'ground duels / ball-winning events',
    unit: 'tackles + interceptions per TEAM per match',
    clock: 'perMatchCount',
    key: 'groundDuelsPerTeam',
    oursSemantics: 'Σ (`team.stats.tackles` + `team.stats.interceptions`) per match / 2. '
      + '⭐ In the CB-armed arm the ledger\'s own duel counters (`armedChallenges`, '
      + '`geometricMisses`, `recoveries`) are published beside it under their own keys.',
    estimator: 'perMatchMean',
    real: UNSOURCED('Tackles and interceptions are published per PLAYER almost everywhere and '
      + 'their team-per-match league mean was not located in a citable form this round; the two '
      + 'are also defined differently by different providers (attempted vs won tackles). '
      + 'UNSOURCED rather than a pooled guess.'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q17',
    name: 'the drama tail — how often a match is drawn',
    unit: 'share of matches drawn',
    clock: 'invariant',
    key: 'drawShare',
    oursSemantics: 'share of walked matches with `score[0] === score[1]` at full time.',
    estimator: 'shareOfMatches',
    real: {
      lo: 0.255, hi: 0.255, centre: 0.255,
      text: '25.5 % of matches — a cited POINT, no width',
      source: 'NEW this round: 25.5 % draws across 12,786 Premier League matches (1992 → end of '
        + '2024-25). https://sicycle.wordpress.com/2025/11/04/whats-the-most-common-score-in-the-'
        + 'premier-league/ — a blog computing over the full match archive; large sample, weak '
        + 'publisher ⇒ LOW. ⭐ CORRECTED of record #272.3→ (iv): epoch 1 published the INVENTED '
        + 'band 24 % – 27 % around this single cited number. It is now a POINT.',
      confidence: 'LOW', inherited: 'new',
      bandKind: 'citedPoint',
      bandReceipt: '',
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q18',
    name: 'the drama tail — how often one goal decides it',
    unit: 'share of matches decided by exactly one goal',
    clock: 'invariant',
    key: 'oneGoalShare',
    oursSemantics: 'share of walked matches with |score[0] − score[1]| === 1.',
    estimator: 'shareOfMatches',
    real: {
      lo: 0.375, hi: 0.375, centre: 0.375,
      text: '37.5 % of matches — a cited POINT, no width',
      source: 'NEW this round, same archive computation as Q17: "37.5 % end with a single goal '
        + 'deciding the result" over 12,786 matches. '
        + 'https://sicycle.wordpress.com/2025/11/04/whats-the-most-common-score-in-the-premier-league/ '
        + '— same publisher, same LOW grade as Q17. ⭐ CORRECTED of record #272.3→ (iv): epoch 1 '
        + 'published the INVENTED band 35 % – 40 % around this single cited number, and that '
        + 'width is exactly what printed "CI overlaps" over a CI that EXCLUDES the cited value.',
      confidence: 'LOW', inherited: 'new',
      bandKind: 'citedPoint',
      bandReceipt: '',
    },
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q19',
    name: 'the drama tail — how often it is a hiding',
    unit: 'share of matches with a margin of 3 or more goals',
    clock: 'invariant',
    key: 'bigMarginShare',
    oursSemantics: 'share of walked matches with |score[0] − score[1]| ≥ 3.',
    estimator: 'shareOfMatches',
    real: UNSOURCED('The archive source that gives Q17 and Q18 does NOT state a ≥3-goal share '
      + '(it states only that ≥5-goal margins are ≈2 % of matches). Its own complement bounds the '
      + '≥2-goal share at 100 − 25.5 − 37.5 = 37.0 %, so ≥3 is bounded ABOVE by 37.0 % — a bound, '
      + 'not a band. Published UNSOURCED with the bound stated.'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q20',
    name: 'how lopsided possession is between the two teams',
    unit: 'possession share of the PER-MATCH LEADER (mean over matches)',
    clock: 'invariant',
    key: 'possessionBalance',
    oursSemantics: '⭐ CORRECTED of record #272.3→ (v): the published estimator is now the one '
      + '§1.1 always described — the PER-MATCH MEAN. Per match: owned playing-phase ticks by '
      + 'side (summed over that side\'s spells, the #173 spell walk\'s own `ownedTicks`), then '
      + 'max(side share) of the two-team total; the headline is the mean of that per-match '
      + 'number over the seed set. Epoch 1 published Σmax / Σtotal (a ratio of sums), which is a '
      + 'DIFFERENT functional — it weights long matches — while the doc described the per-match '
      + 'mean; the ratio-of-sums form is kept beside it as CONTEXT so both remain readable. '
      + '⚠ THE LABEL, corrected: this is NOT "the stronger team". It is the per-match LEADER, an '
      + 'upward-biased maximum — two evenly matched teams are two random draws, so E[max share] '
      + '> 0.5 by construction and 0.5 is the floor of the statistic, not its neutral value. '
      + '0.5 = a perfectly even match; 1.0 = one team never lost it.',
    estimator: 'perMatchMean',
    real: UNSOURCED('Published possession figures are TEAM-SEASON means, not a per-match balance '
      + 'distribution. The season spread is cited as CONTEXT ONLY and is not a band: Nottingham '
      + 'Forest were the only 2024-25 side under 40 % (39.6 %), per Opta Analyst\'s playing-styles '
      + 'piece. The per-match quantity ours measures has no located published counterpart.'),
    status: 'UNADJUDICATED',
  },
  {
    id: 'Q21',
    name: 'how much of the clock is not football (restarts and dead ball)',
    unit: 'share of the match clock with the ball NOT in play',
    clock: 'invariant',
    key: 'deadBallShare',
    oursSemantics: '1 − (ticks with phase === "playing") / (total stepped ticks). The numerator is '
      + 'the #173 `inPlayTicks`; the denominator is the PAUSE-INCLUSIVE clock (`simTick`), which '
      + 'is the only clock on which a dead-ball SHARE means anything — #173 emitted it as '
      + '`wallSimSeconds` and used it in no rate, and this row is the one place it has a job. '
      + '⭐ ADDED of record #272.3→ (vi): the real value is a share of the NOMINAL 90 while ours '
      + 'divides the ELAPSED clock (≈251 s against a nominal 240 s, ≈4.7 % longer), so the row '
      + 'also publishes `deadShareOnNominalClock` = (elapsed − in-play) / MATCH_DURATION — the '
      + 'like-for-like reading — and the distance table carries THAT correction rather than '
      + 'leaving it in prose.',
    estimator: 'ratioOfSums',
    real: {
      lo: 0.366852, hi: 0.366852, centre: 0.366852,
      text: '36.6852 % of the nominal 90 minutes — a derived POINT, no width',
      source: 'NEW this round: the Premier League ball was in play 56 min 59 s on average across '
        + '2024-25 (Opta). https://theanalyst.com/articles/premier-league-ball-in-play-are-we-'
        + 'seeing-less-football-2025-26 · ⚠ real matches now ELAPSE well beyond 90 minutes, so '
        + 'measured against elapsed time the real dead share is HIGHER than this; the value is '
        + 'stated on the nominal clock because that is the clock our 240 s maps onto. '
        + '⭐ CORRECTED of record #272.3→ (iv) and (vi): epoch 1 transcribed the source as 56:58 '
        + '(it publishes 56:59) and published the INVENTED band 35 % – 39 % around the single '
        + 'derived number. It is now a POINT on the corrected transcription.',
      confidence: 'MED', inherited: 'new',
      bandKind: 'derivedPoint',
      bandReceipt: 'DERIVED from ONE cited number, arithmetic in full: ball in play 56 min 59 s '
        + '= 56 + 59/60 = 56.983333 minutes of the nominal 90 ⇒ dead share = 1 − 56.983333/90 '
        + '= 0.366852 (36.6852 %). Nothing is widened around it. ⚠ THE DENOMINATOR CAVEAT, '
        + 'carried into the reading and not left in prose (#272.3→ (vi)): this real value is a '
        + 'share of the NOMINAL 90, while ours divides the PAUSE-INCLUSIVE elapsed clock '
        + '(`simTick`, ≈251 s against a nominal 240 s ⇒ ≈4.7 % longer). The row therefore '
        + 'publishes BOTH our elapsed-clock share and our nominal-clock share, and the '
        + 'nominal-clock one is the like-for-like reading.',
    },
    status: 'UNADJUDICATED',
  },
] as const;

/** Context rows: measured and published, but NEVER compared to a real band. */
export const CONTEXT_KEYS: readonly { key: string; why: string }[] = [
  { key: 'engineDribblesPerTeam', why: '`team.stats.dribbles` / 2 — possession GAINS, not take-ons (see Q10).' },
  { key: 'takeOnPerChallengerSuccess', why: '`touchPastBeaten` / `touchPastChallengers` — the per-body form of Q11.' },
  { key: 'allKnocksPerTeam', why: '⭐ `cbLedger.touchPasts` / 2 — EVERY aimed knock, contested or not. This is what epoch 1 published as Q10; it is CONTEXT now (fixed of record #272.3→ (i)).' },
  { key: 'uncontestedKnocksPerTeam', why: '⭐ (`touchPasts` − `touchPastContested`) / 2 — knocks released into an EMPTY contest radius: real knocks, but structurally incapable of beating anybody, so not part of the take-on population.' },
  { key: 'uncontestedKnockShare', why: '⭐ the size of the epoch-1 defect, published every epoch: the share of aimed knocks that had no contesting body.' },
  { key: 'takeOnSuccessAllKnocks', why: 'Q11 on the OLD denominator (`cleanBeats` / `touchPasts`) — kept so the two epochs remain comparable and the re-key\'s effect is visible.' },
  { key: 'possessionBalanceRatioOfSums', why: 'Q20 on the OLD estimator (Σmax / Σtotal) — kept beside the per-match mean (fixed of record #272.3→ (v)).' },
  { key: 'deadShareOnNominalClock', why: '⭐ Q21 re-based on the NOMINAL match clock (`MATCH_DURATION`) instead of the elapsed pause-inclusive clock — the like-for-like reading against a share of the nominal 90 (fixed of record #272.3→ (vi)).' },
  { key: 'redsPerMatch', why: '`team.stats.reds`, both teams — beside Q13.' },
  { key: 'turnoversPerSimMin', why: 'Q04 on the WATCHED clock (the other honest axis).' },
  { key: 'completedPassesPerSpell', why: 'completed passes per open-play spell — the nearest like-for-like to the Q05 band.' },
  { key: 'armedChallengesPerTeam', why: '`cbLedger.armedChallenges` / 2 — beside Q16, CB arm only.' },
  { key: 'geometricMissesPerTeam', why: '`cbLedger.geometricMisses` / 2 — beside Q16, CB arm only.' },
  { key: 'recoveriesPerTeam', why: '`cbLedger.recoveries` / 2 — beaten lunges paying the armed price.' },
  { key: 'meanRecoveryS', why: '`recoverySeconds` / `recoveries` — how long a beaten defender is out.' },
  { key: 'offsidesPerTeam', why: '`team.stats.offsides` / 2 — Laws texture, no band in this version.' },
  { key: 'cornersPerTeam', why: '`team.stats.corners` / 2 — Laws texture, no band in this version.' },
  { key: 'inPlaySecondsPerMatch', why: 'the numerator of Q21, published so the share re-derives.' },
  { key: 'simSecondsPerMatch', why: 'the ONE rate denominator (`match.simTime`), published so every rate re-derives.' },
  { key: 'wallSecondsPerMatch', why: '`simTick · DT` — the pause-inclusive clock, Q21\'s denominator.' },
];

/**
 * ⭐⭐ THE DECLARED CLOCK CONVENTION (fixed of record #272.3→ (ii)) — the LAW, in words. Both
 * numbers it needs are extracted from `src/**` at run time by the probe (`MATCH_DURATION` from
 * `src/sim/constants.ts`, the 90 from `Match.minute()`'s own expression), so nothing here is a
 * typed constant. See `ClockDimension` above for the two conventions and for which arithmetic
 * each row needs.
 */
export const CLOCK_LAW = {
  mapping: 'displaySecondsPerSimSecond = (displayMinutes × 60) / MATCH_DURATION, both terms '
    + 'EXTRACTED from src at run time (constants.ts `MATCH_DURATION`; the 90 out of the engine\'s '
    + 'own display-clock expression in `Match.minute()`).',
  conventionA: 'SIM TIME TAKEN LITERALLY — a sim-second is a second. Durations compare as '
    + 'measured; a per-match COUNT is multiplied by displaySecondsPerSimSecond to become a '
    + 'per-90-real-minutes count; a per-time RATE is read per sim-minute.',
  conventionB: 'THE DISPLAY CLOCK — our match IS the 90 minutes. Per-match counts compare as '
    + 'measured; a DURATION is multiplied by displaySecondsPerSimSecond; a rate is read per '
    + 'display-minute.',
  law: '⭐ EVERY banded row prints BOTH readings, every epoch. The distance table declares ONE '
    + 'basis (convention A) and prints the other beside it, so a cross-row PATTERN can never '
    + 'again be assembled out of two different clocks (the epoch-1 artifact of record).',
  declaredDistanceBasis: 'A',
  whyThatBasis: 'convention A is the axis the instrument actually measures on (sim-seconds and '
    + 'sim-time rates) and the axis #170\'s duration bands were vetted against; B is the axis '
    + 'the per-match COUNT rows implicitly used in epoch 1. Neither is "the" truth — that is the '
    + 'point of printing both.',
} as const;

/** The two arms of the first epoch. Both walk the SAME seeds (the pairing IS the shared seed). */
export const ARMS = ['bare', 'cb'] as const;
export type Arm = (typeof ARMS)[number];
export const ARM_DEFINITIONS: Record<Arm, string> = {
  bare: 'BARE PRODUCTION — `new Match({ seed, teamA, teamB })`. No flag, no eye, no gene, no book. '
    + 'Byte-for-byte the #173 census\'s own prod-arm constructor.',
  cb: 'THE CB PLAY WORLD, ARMED EXACTLY AS THE ENTRY ARMS IT — `a4MatchFlags(6)` spread at '
    + 'construction (the same channel `League.createMatch` uses: it spreads `...this.matchFlags` '
    + 'into `new Match`) and `armA4World(match, null, 6)` after it. Both calls are CALLS into '
    + '`src/game/a4World.ts`: no flag name and no dose is typed in the probe (G-ARMING-FROM-ENTRY '
    + 'proves it from the probe\'s own source).',
};
