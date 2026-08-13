/**
 * EK-C0c §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED in-timeline census artifact and emits the whole §RESULT markdown
 * section on stdout. EVERY measured cell in the published section is printed from this
 * file's reads of the artifact — never typed into the doc by hand. The prose captions are
 * literal strings here, so they ride the generator too and cannot drift from the numbers
 * beside them.
 *
 * This script ADJUDICATES NOTHING (#203). It prints the corrected yardstick, the census's
 * accounting, the re-score's two limbs and the MECHANICAL route the probe computed, with
 * ruling #263.3's consequents VERBATIM. No verdict is composed here.
 *
 *   npx tsx scripts/analysis/ek-c0c-census-result.ts docs/world-model/data/ek-c0c-intimeline-census.json
 */
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2]
  ?? 'docs/world-model/data/ek-c0c-intimeline-census.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));
const R: Any = A.result;
const C: Any = R.census;
const Y: Any = C.yardstick;
const S: Any = R.sizing;
const RS: Any = R.rescore;

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const pct = (x: number, dp = 3): string => (Number.isFinite(x) ? `${x.toFixed(dp)} %` : 'n/a');
const ci = (c: number[], dp = 3): string => `[${num(c[0], dp)}, ${num(c[1], dp)}]`;
const yes = (b: boolean): string => (b ? '✅ YES' : '❌ NO');
const BANDS = ['free', 'mid', 'pressed'];
const KEYS = ['p0', 'p1', 'p2'];

const g: Any = R.gates;
const gateNames: string[] = R.frozenGateNames;
const passCount = gateNames.filter((k) => g[k] === true).length;
const censusBlock: Any = R.seeds.blocks[R.seeds.blocks.length - 1];

o('## §RESULT');
o();
o(`**${int(R.design.seeds)} fresh seeds × 2 arms = ${int(R.design.seeds * 2)} walks, `
  + `${int(C.clusters)} clusters, block ${int(censusBlock.first)}–${int(censusBlock.last)} — `
  + `${passCount}/${gateNames.length} gates ${passCount === gateNames.length ? 'PASS' : '*** RED ***'}**, `
  + `\`resultSha256\` \`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`, `
  + `G-DET digest \`${String(R.gDet.digestA).slice(0, 8)}…\` twice. Mode: **${R.mode}**. Every `
  + 'number below is printed by `scripts/analysis/ek-c0c-census-result.ts` from the committed '
  + 'artifact; none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o('world            the IN-TIMELINE DRILL WORLD — EK-T1\'s committed world verbatim, with the');
o('                 learning door armed as an OBSERVER only (veto shut, no mechanic reads a book)');
o(`byte-identity    ${int(R.gByteIdentical.matchesIdentical)}/${
  int(R.gByteIdentical.matchesWalked)} census seeds: the armed timeline IS the flags-off timeline`);
o('counting         the SEAM\'S OWN rules — the seat\'s band placement, the freshness refusal,');
o(`                 the ${R.design.window} s first-loss label, drill and take holds alike`);
o(`holds counted    ${int(C.partition.holdsCounted)}  (${int(C.partition.takeHolds)} takes + ${
  int(C.partition.drillHolds)} drill holds; ${int(C.partition.refusedTotal)} doses REFUSED for`);
o(`                 want of a fresh band — ${int(C.partition.refusedForStaleBand)} stale + ${
  int(C.partition.refusedUnseenBand)} never-placed, counted not hidden)`);
o(`seat placements  ${int(C.partition.seatPlacements)}`);
o(`estimator        cluster bootstrap by match seed, ${
  int(C.clusters)} clusters, 2,000 resamples, one shared index matrix`);
o('```');
o();
o('### ⭐⭐ THE CORRECTED YARDSTICK — P(punished | held, perceived band), in the learner\'s own venue');
o();
o('| band | holds | punished | punish rate | 95 % CI | relative |');
o('|---|---:|---:|---:|---|---:|');
for (let b = 0; b < 3; b++) {
  const row = Y.bands[KEYS[b]];
  o(`| **${BANDS[b]}** | ${int(row.holds)} | ${int(row.punished)} | **${pct(row.punishRatePct)}** | `
    + `${ci(row.ci95Pct)} | ${num(Y.relative[KEYS[b]], 4)} |`);
}
o(`| overall | ${int(C.totalHolds.reduce((a: number, x: number) => a + x, 0))} | `
  + `${int(C.totalPunished.reduce((a: number, x: number) => a + x, 0))} | `
  + `${pct(Y.baselinePunishRateAllBands * 100)} | — | — |`);
o();
o(`⭐ **THE MEASURED ORDERING: ${(Y.orderingLabels as string[]).join(' > ')}** — and the two `
  + 'adjacent gaps, each resolved by the paired cluster bootstrap:');
o();
o('| adjacent pair | gap (pp) | 95 % CI (pp) | resolved above zero |');
o('|---|---:|---|---|');
for (const gp of Y.adjacentGaps as Any[]) {
  o(`| ${gp.pair} | **${num(gp.gapPp)}** | ${ci(gp.ci95Pp, 4)} | ${yes(gp.resolved)} |`);
}
o();
o('All three pairwise gaps, in full:');
o();
o('| pair | gap (pp) | 95 % CI (pp) | resolved (either sign) |');
o('|---|---:|---|---|');
for (const gp of Y.allPairwiseGaps as Any[]) {
  o(`| ${gp.pair} | ${num(gp.gapPp)} | ${ci(gp.ci95Pp, 4)} | ${yes(gp.resolved)} |`);
}
o();
o('### The complement partition — every counted hold closes exactly once');
o();
o('```text');
o(`holds counted            ${int(C.partition.holdsCounted)}`);
o(`  punished (in window)   ${int(C.partition.punished)}`);
o(`  unpunished             ${int(C.partition.unpunished)}`);
o(`closed at a loss         ${int(C.partition.closedByCause.loss)}   (of which out-of-window: ${
  int(C.partition.lossClosedButOutOfWindow)})`);
o(`closed at the window     ${int(C.partition.closedByCause.window)}`);
o(`closed at the whistle    ${int(C.partition.censoredAtWhistle)}   (the CENSORED class — unpunished by construction)`);
o(`REFUSED, not counted     ${int(C.partition.refusedTotal)}   (stale ${
  int(C.partition.refusedForStaleBand)} · never-placed ${int(C.partition.refusedUnseenBand)})`);
o('```');
o();
o('### The two hold provenances (REPORTED — the census counts both, because the book does)');
o();
o('| provenance | free | mid | pressed |');
o('|---|---:|---:|---:|');
o(`| take holds | ${(C.byKind.takeHolds as number[]).map(int).join(' | ')} |`);
o(`| take punish rate | ${(C.byKind.takeRates as (number | null)[])
  .map((x) => (x === null ? 'n/a' : pct(x * 100))).join(' | ')} |`);
o(`| drill holds | ${(C.byKind.drillHolds as number[]).map(int).join(' | ')} |`);
o(`| drill punish rate | ${(C.byKind.drillRates as (number | null)[])
  .map((x) => (x === null ? 'n/a' : pct(x * 100))).join(' | ')} |`);
o();
o('### The window ladder (REPORTED — the primary is the seam\'s own constant)');
o();
o('| window | free | mid | pressed | ordering |');
o('|---:|---:|---:|---:|---|');
for (const L of C.ladder as Any[]) {
  o(`| ${L.windowS} s${L.primary ? ' **(primary)**' : ''} | ${pct(L.ratesPct[0])} | `
    + `${pct(L.ratesPct[1])} | ${pct(L.ratesPct[2])} | ${(L.ordering as string[]).join(' > ')} |`);
}
o();
o('### The event-rate moments — per band, per team, per match');
o();
o('| band | holds mean | sd | cv | p10 | median | p90 | max | zero-share | punished mean |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const M of C.moments as Any[]) {
  const h = M.holdsPerTeamPerMatch;
  o(`| ${M.label} | ${num(h.mean, 4)} | ${num(h.sd, 4)} | ${num(h.cv, 4)} | ${num(h.p10, 2)} | `
    + `${num(h.median, 2)} | ${num(h.p90, 2)} | ${int(h.max)} | ${pct(h.zeroShare * 100, 2)} | `
    + `${num(M.punishedPerTeamPerMatch.mean, 4)} |`);
}
o();
o(`⭐ **The venue's own cluster design effect**, measured on this census: `
  + `${num(C.deffMeasured, 6)} punished labels per distinct punishing loss.`);
o();
o('### ⭐ THE #263.2(2) LEAD, RESOLVED — which reading rule this instrument implements');
o();
o('| reading | free | mid | pressed | total |');
o('|---|---:|---:|---:|---:|');
o(`| ⭐ **THE SEAM READING (of record)** | ${(C.labelReadings.seamPunishedPerBand as number[])
  .map(int).join(' | ')} | ${int((C.labelReadings.seamPunishedPerBand as number[])
  .reduce((a: number, x: number) => a + x, 0))} |`);
o(`| the probe reading (EK-T1's deff rule) | ${(C.labelReadings.probePunishedPerBand as number[])
  .map(int).join(' | ')} | ${int((C.labelReadings.probePunishedPerBand as number[])
  .reduce((a: number, x: number) => a + x, 0))} |`);
o();
o(`The two disagree on **${int(C.labelReadings.divergentSeamOnly)}** labels the seam punishes `
  + `and the probe rule does not, and **${int(C.labelReadings.divergentProbeOnly)}** the other `
  + `way — ${pct(R.gLabelReading.divergenceShare * 100, 4)} of `
  + `${int(R.gLabelReading.holdsChecked)} labels. ⭐ **THE MECHANISM, FOUND AND NAMED**: `
  + '`Match.endMatch()` runs the seam\'s last observation BEFORE it sets `phase = \'fulltime\'`, '
  + 'so the whistle read is a PLAYING read — if the opponent has just established control it is '
  + 'a LOSS, and it punishes every still-open label. A post-loop reading sees `fulltime` and '
  + 'closes those labels unpunished. This instrument implements **the seam\'s own rule**, and '
  + 'G-LABEL-READING proves it cell for cell against the observer arm\'s own books '
  + `(${int(R.gLabelReading.clustersWithCellsMatching)}/${int(R.gLabelReading.clusters)} clusters, `
  + `${int(R.gLabelReading.nonEmptyCells)} non-empty cells of ${
    int(R.gLabelReading.cellsCompared)}, ${int(R.gLabelReading.holdsChecked)} labels).`);
o();
o('### ⭐⭐ THE RE-SCORE — H-EK′ on the COMMITTED EK-T1 books, against the corrected yardstick');
o();
o(`Source: \`${RS.source.artifact}\` — ${int(RS.source.books)} books (${
  int(RS.source.replicates)} replicates × 2) at its final checkpoint, ${
  int(RS.source.checkpointMatches)} matches each. A generator-level act on banked data: **no `
  + 'learning run happens here**, and the #263.1 NEGATIVE against the clone-dosed yardstick '
  + 'stands untouched.');
o();
o('| limb | reading | verdict |');
o('|---|---|---|');
o(`| **(i) mean vector** | free **${pct(RS.limbI.meanVectorPct[0])}** · mid **${
  pct(RS.limbI.meanVectorPct[1])}** · pressed **${pct(RS.limbI.meanVectorPct[2])}** — observed `
  + `ordering **${(RS.limbI.observedOrdering as string[]).join(' > ')}**, required (the `
  + `yardstick's) **${(RS.yardstickOrdering as string[]).join(' > ')}** | ordered as required: `
  + `${yes(RS.limbI.ordered)} |`);
for (const gp of RS.limbI.gaps as Any[]) {
  o(`| **(i) gap ${gp.pair}** | **${num(gp.gapPp)} pp**, 95 % CI ${ci(gp.ci95Pp, 4)} | `
    + `resolved above zero: ${yes(gp.resolved)} |`);
}
o(`| **LIMB (i)** | ordering + BOTH gaps resolved at set grain | **${
  RS.limbI.pass ? 'PASS' : 'FAIL'}** |`);
o(`| **LIMB (ii) book share** | **${int(RS.limbII.orderedBooks)} / ${int(RS.limbII.books)} = `
  + `${pct(RS.limbII.orderedShare * 100, 2)}** ordered books vs τ = ${RS.limbII.threshold} `
  + `(needs ${int(RS.limbII.required)}) | **${RS.limbII.pass ? 'PASS' : 'FAIL'}** |`);
o(`| ⭐⭐ **THE CONJUNCTION** | both limbs | **${RS.conjunction ? 'POSITIVE' : 'NEGATIVE'}** |`);
o();
o(`### ⭐⭐ THE ROUTE — **${RS.route}**`);
o();
o(`> **${RS.route}** ⇒ *${RS.consequent}*`);
o();
o('Printed mechanically from the predicate above, with ruling #263.3\'s consequent verbatim. '
  + 'This document reports; it does not adjudicate (#203).');
o();
o('**The convergence distances (REPORTED, never gated — #246):** the corrected yardstick reads '
  + `free ${pct(RS.convergenceReported.yardstickRatesPct[0])} · mid `
  + `${pct(RS.convergenceReported.yardstickRatesPct[1])} · pressed `
  + `${pct(RS.convergenceReported.yardstickRatesPct[2])}; the books' relative vector is `
  + `[${(RS.convergenceReported.bookRelative as number[]).map((x: number) => num(x, 4)).join(', ')}] `
  + `against the yardstick's [${(RS.convergenceReported.yardstickRelative as number[])
    .map((x: number) => num(x, 4)).join(', ')}] — L1 absolute `
  + `${num(RS.convergenceReported.l1AbsoluteVsCorrected, 5)}, L1 relative `
  + `${num(RS.convergenceReported.l1RelativeVsCorrected, 5)}.`);
o();
o('### ⭐ THE VENUE-DEPENDENCE RECORD — the two truths of the same world');
o();
o('| band | clone-dosed (EK-C0) | in-timeline (EK-C0c) | Δ (pp) |');
o('|---|---:|---:|---:|');
for (let b = 0; b < 3; b++) {
  o(`| ${BANDS[b]} | ${pct(R.venueDependence.cloneDosed.ratesPct[b])} | `
    + `${pct(R.venueDependence.inTimeline.ratesPct[b])} | **${
      num(R.venueDependence.deltaPp[b], 3)}** |`);
}
o(`| holds | ${(R.venueDependence.cloneDosed.holds as number[]).map(int).join(' / ')} | `
  + `${(R.venueDependence.inTimeline.holds as number[]).map(int).join(' / ')} | — |`);
o(`| ordering | ${(R.venueDependence.cloneDosed.ordering as string[]).join(' > ')} | `
  + `${(R.venueDependence.inTimeline.ordering as string[]).join(' > ')} | orderings agree: ${
    yes(R.venueDependence.orderingsAgree)} |`);
o();
o('### The ex-ante sizing, as the probe recomputed it');
o();
o('```text');
o(`smoke source            ${S.smokeMatches} matches, holds [${
  (S.smokeHolds as number[]).map(int).join(', ')}], punished [${
  (S.smokePunished as number[]).map(int).join(', ')}]`);
o(`smoke rates             [${(S.smokeRates as number[]).map((x: number) => num(x, 6)).join(', ')}]`);
o(`smoke holds/match       [${(S.smokeHoldsPerMatch as number[])
  .map((x: number) => num(x, 4)).join(', ')}]   deff ${num(S.smokeDeff, 6)}`);
o(`rarest band             ${S.rarestBand} (${num(S.rarestBandPunishedPerMatch, 4)} punished/match)`);
o(`precision term (60 ev)  ${S.precisionTerm === null ? 'UNBOUNDED' : int(S.precisionTerm)}   floor ${
  int(S.floor)}`);
o(`gap magnitudes (pp)     [${(S.gapMagnitudesPp as number[])
  .map((x: number) => num(x, 4)).join(', ')}]`);
o(`ordering term           ${S.orderingTerm === null ? 'UNBOUNDED (no N on the grid resolves every gap)' : int(S.orderingTerm)}`);
o(`requirement             ${S.requirement === null ? 'UNBOUNDED ⇒ the caps bind' : int(S.requirement)}`);
o(`caps                    wall ${int(S.wallTerm)} (binds: ${S.wallTermBinds}) · seed ${
  int(S.seedCap)} (binds: ${S.seedCapBinds})`);
o(`N* = ${int(S.nStar)}   ran at N = ${int(R.design.seeds)}`);
o('```');
o();
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const ev: Record<string, string> = {
  gDet: `digest \`${String(R.gDet.digestA).slice(0, 16)}…\` on both runs`,
  xSrcUntouched: '`git diff --stat -- src` and `git status --porcelain -- src` both EMPTY — instrument-only round',
  xFpProd: `the shipped league fingerprint re-derived in-process: \`${String(R.xFpProd.observed).slice(0, 12)}…\``,
  gWorld: `the drill world proved on the never-stepped seed ${int(R.gWorld.constructionSeed)} and on ${
    int(R.gWorld.censusMatchesArmOk)}/${int(R.gWorld.censusMatches)} census matches`,
  gByteIdentical: `${int(R.gByteIdentical.matchesIdentical)}/${
    int(R.gByteIdentical.matchesWalked)} observer signatures identical to the FLAGS-OFF drill world (rng stream inside)`,
  gArms: `${(R.gArms.mutants as Any[]).length} conjuncts, ${
    (R.gArms.mutants as Any[]).filter((m: Any) => m.flipped).length}/${
    (R.gArms.mutants as Any[]).length} mutants live, each RE-INVOKING the predicate`,
  gLabelReading: `the seam reading reproduces the observer books cell for cell on ${
    int(R.gLabelReading.clustersWithCellsMatching)}/${int(R.gLabelReading.clusters)} clusters (${
    int(R.gLabelReading.nonEmptyCells)} non-empty cells, ${
    int(R.gLabelReading.holdsChecked)} labels, both label values present in every band)`,
  gFreshness: `${int(R.gFreshness.refusedTotal)} doses refused (${
    int(R.gFreshness.refusedStale)} stale + ${int(R.gFreshness.refusedUnseen)} never-placed), max staleness ${
    int(R.gFreshness.staleMaxTicks)} ticks; counted holds = takes + drills`,
  gAccounting: `the partition closes (${int(R.gAccounting.holdsCounted)} = ${
    int(R.gAccounting.punished)} + ${int(R.gAccounting.unpunished)}), every class non-negative, the ladder monotone in the window`,
  gCensusLive: `3/3 bands carry holds AND punishment; min band holds ${
    int(Math.min(...(R.gCensusLive.totalHolds as number[])))}; takes ${
    int(R.gCensusLive.takesSeen)}, drills ${int(R.gCensusLive.drillsSeen)}, vetoes ${
    int(R.gCensusLive.vetoesServed)}`,
  gN: `N* ${int(S.nStar)} recomputed from the COMMITTED smoke artifact; ran at N = ${
    int(R.design.seeds)}; τ = ${R.design.tau}`,
  gCells: `${int(R.gCells.clustersStored)} clusters stored; the published table and its ordering re-derive from the stored cells alone`,
  gRescore: `EK-T1's artifact sha self-consistent; its published mean vector and its ${
    int(R.gRescore.orderedBooksPublishedByEkT1)}/${int(R.gRescore.booksPublished)} ordered-book reading both re-derived from the banked cells; strict-tie rejection on BOTH pairs`,
  gValuesUnreachable: `${int(R.gValuesUnreachable.rateNeedles)} keyed measured answers → ${
    int(R.gValuesUnreachable.needleFormsSearched)} searchable forms over \`src/**\` — 0 value hits, 0 name hits, control needle FOUND; ${
    int(R.gValuesUnreachable.excludedByFloor)} forms excluded by the declared floor`,
  gSeed: `${(R.gSeed.blocks as Any[]).length} blocks disjoint from the complete ledger and ordered`,
  gStats: `base ${int(R.gStats.base)}, min gap ${int(R.gStats.minGap)}`,
  gEnvClean: `whitelist [${(R.gEnvClean.whitelist as string[]).join(', ')}], ${
    (R.gEnvClean.engineDoorsScanned as string[]).length} ENGINE doors scanned and unset, preflight: ${
    R.gEnvClean.preflight}, out \`${R.gEnvClean.outPath}\``,
  gResume: `seed ${int(R.gResume.seed)} recomputed from scratch reproduces its checkpointed digest \`${
    String(R.gResume.recomputedDigest).slice(0, 12)}…\` (resumed from checkpoint: ${
    R.gResume.resumedFromCheckpoint})`,
};
for (const k of gateNames) {
  o(`| \`${k}\` | **${g[k] ? 'PASS' : 'RED'}** | ${ev[k] ?? ''} |`);
}
o();
o(`**${passCount}/${gateNames.length}** — and the count is structural: the probe exits 1 before `
  + 'writing anything if the artifact\'s gate-object key set is not exactly the frozen list '
  + '(#250.3(i)).');
o();
o('### The per-cluster cells');
o();
o(`Every seed's raw per-side per-band (holds, punished) cells, its ladder counts, its `
  + 'provenance split, its closing causes and its refusal counts are stored in the artifact '
  + `under \`result.perClusterCells\` — ${int(C.clusters)} clusters — so the whole yardstick, `
  + 'its ordering and every CI re-derive without re-running anything (G-CELLS proves exactly '
  + 'that).');
