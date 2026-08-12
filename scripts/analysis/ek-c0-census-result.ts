/**
 * EK-C0 §RESULT GENERATOR (#229.2 — the section is PRINTED from the committed artifact, never
 * typed). Usage:
 *   npx tsx scripts/analysis/ek-c0-census-result.ts docs/world-model/data/ek-c0-hold-outcome-census.json
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'docs/world-model/data/ek-c0-hold-outcome-census.json';
const a = JSON.parse(readFileSync(path, 'utf8'));
const c = a.result.census;
const g = a.gates;
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number | null): string => (typeof x === 'number' && Number.isFinite(x) ? `${(x * 100).toFixed(3)} %` : 'n/a');
const ppOf = (x: number | null): string => (typeof x === 'number' && Number.isFinite(x) ? (x * 100).toFixed(3) : 'n/a');
const int = (x: number): string => x.toLocaleString('en-US');
const num = (x: number | null, dp = 4): string => (typeof x === 'number' && Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const shortSha = (s: string): string => `${s.slice(0, 8)}…${s.slice(-4)}`;
const gateCount = Object.keys(g).length;
const passCount = Object.values(g).filter((x: any) => x.pass).length;
const BAND_NAME: Record<string, string> = { p0: '**free** (band 0)', p1: 'mid (band 1)', p2: '⭐ **pressed** (band 2)' };
const primary = c.table.find((t: any) => t.isPrimary);

o('## §RESULT');
o();
o(`**${int(a.result.seeds.n)} seeds × 1 arm (the whetherEye-ARMED exam world), block `
  + `${int(a.result.seeds.first)}–${int(a.result.seeds.last)}, ${passCount}/${gateCount} gates PASS**, `
  + `\`resultSha256\` \`${shortSha(a.resultSha256)}\`. Every number below is printed by `
  + '`scripts/analysis/ek-c0-census-result.ts` from the committed artifact; none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`world            the whetherEye-ARMED C5-T2 exam world (CENSUS_FLAGS + the certified table`);
o(`                 ${a.frozenDesign.world.match(/tableSha ([0-9a-f]+)/)?.[1] ?? ''} injected, arm neutral, scope BOTH)`);
o(`matches          ${int(c.matches)}   (${num(c.simSecondsPerMatch)} sim-seconds each)`);
o(`eligible moments ${int(c.accounting.eligible)}   (${num(c.eligiblePerMatch)} per match, the C5-T2 grid)`);
o(`dosed holds      ${int(c.accounting.dosedForks)}   (${num(c.dosedHoldsPerMatch)} per match — the census population)`);
o(`live D-HOLD      ${int(c.accounting.liveHoldTotal)}   (${num(c.liveHoldsPerMatch)} per match — the seat's OWN takes)`);
o(`turnovers        ${int(c.accounting.turnoversTotal)}   (${num(c.turnoversPerMatch)} per match, DV-C0 semantics)`);
o(`primary window   ${a.frozenDesign.windows.primaryWindowS} s   (DV-C0's own, the #218 family — the DECLARED FALLBACK)`);
o(`estimator        cluster bootstrap by match seed, ${int(a.frozenDesign.statsBase.resamples)} resamples, stats base ${int(a.frozenDesign.statsBase.base)}`);
o('```');
o();
o('### ⭐⭐ THE HOLD-OUTCOME TABLE — P(punished | held, perceived pressure band) (PRIMARY WINDOW)');
o();
o('A full accounting: every dosed hold is in exactly one of the three outcome classes.');
o();
o('| perceived band | holds | lost | punished | **P(punished)** | CI 95 % (pp) | P(punished \\| lost) | same-chain share |');
o('|---|---:|---:|---:|---:|---:|---:|---:|');
for (const r of primary.byBand) {
  o(`| ${BAND_NAME[r.band]} | ${int(r.moments)} | ${int(r.lost)} | ${int(r.punished)} | **${pct(r.punishRate)}** | `
    + `[${ppOf(r.punishRateCi95[0])}, ${ppOf(r.punishRateCi95[1])}] | ${pct(r.punishGivenLost)} | ${pct(r.sameChainRate)} |`);
}
o(`| **ALL BANDS** | ${int(primary.all.moments)} | ${int(primary.all.lost)} | ${int(primary.all.punished)} | `
  + `**${pct(primary.all.punishRate)}** | [${ppOf(primary.all.punishRateCi95[0])}, ${ppOf(primary.all.punishRateCi95[1])}] | — | — |`);
o();
o('The complement accounting, as shares of the holds in each band (they sum to 1 with `P(punished)` by '
  + 'construction — G-ACCOUNTING checks the partition, its denominator tied to the independent dose counter):');
o();
o('| perceived band | punished | lost-but-unpunished | no-loss-in-window | censored by full time |');
o('|---|---:|---:|---:|---:|');
for (const r of primary.byBand) {
  o(`| ${BAND_NAME[r.band]} | ${pct(r.punishRate)} | ${pct(r.lostUnpunishedShare)} | ${pct(r.noLossShare)} | ${int(r.censored)} |`);
}
o();
o('### ⭐ THE #246 REALITY-SHAPE CHECK — pre-registered, evaluated with CIs');
o();
o('EXPECTED: higher perceived pressure ⇒ higher hold risk. An inversion is published and routed to the '
  + '街机偏离 test, never corrected into the table.');
o();
o('| window | pressed − mid (pp) | CI 95 % | verdict | mid − free (pp) | CI 95 % | verdict | ⭐ GRADIENT |');
o('|---|---:|---:|---|---:|---:|---|---|');
for (const w of c.table) {
  const s = w.realityShape;
  const tag = w.isPrimary ? ' **(PRIMARY)**' : w.isC5Native ? ' *(C5-native, REPORTED)*' : '';
  o(`| ${w.windowS} s${tag} | ${ppOf(s.pressedVsMid.point)} | [${ppOf(s.pressedVsMid.ci95[0])}, ${ppOf(s.pressedVsMid.ci95[1])}] | `
    + `${s.pressedVsMid.verdict} | ${ppOf(s.midVsFree.point)} | [${ppOf(s.midVsFree.ci95[0])}, ${ppOf(s.midVsFree.ci95[1])}] | `
    + `${s.midVsFree.verdict} | ${s.gradientWithPressure} |`);
}
o();
o(`Routing recorded in the artifact at the primary window: *${primary.realityShape.routing}*`);
o();
o('### THE WINDOW LADDER — the label\'s window-dependence, made visible');
o();
o('| window | free | mid | pressed | all bands |');
o('|---|---:|---:|---:|---:|');
for (const w of c.table) {
  const tag = w.isPrimary ? ' **(PRIMARY)**' : w.isC5Native ? ' *(C5-native)*' : '';
  o(`| ${w.windowS} s${tag} | ${pct(w.byBand[0].punishRate)} | ${pct(w.byBand[1].punishRate)} | `
    + `${pct(w.byBand[2].punishRate)} | ${pct(w.all.punishRate)} |`);
}
o();
o('Holds and their denominators do not move with the window — the same population sits under every row '
  + '(G-ACCOUNTING checks that invariance explicitly); only the punished numerator grows.');
o();
o('### ⭐ THE SEAT\'S OWN TAKES (D-HOLD) — the charter\'s literal population');
o();
o('| perceived band | takes | punished | P(punished) |');
o('|---|---:|---:|---:|');
for (const r of c.liveHoldTable) {
  o(`| ${BAND_NAME[r.band]} | ${int(r.holds)} | ${int(r.punished)} | ${pct(r.punishRate)} |`);
}
o();
o(`Perceived-cell mix of the takes: \`${JSON.stringify(c.liveHoldCellMix)}\` — R-B (#64.1) licenses a take `
  + 'ONLY where the certified interval reaches zero, and in the certified table that is the single cell '
  + '`0|0|0`, so the takes are confined to one band by construction. That is why the dosed census, not '
  + 'this table, carries the three-band shape.');
o();
o('### ⭐ THE EVENT-RATE MOMENTS — what EK-T1 sizes its run length from');
o();
o('Per perceived band, **per team per match**. TWO families, because they bracket what a book can see: '
  + 'CENSUS MOMENTS are grid-limited (the C5-T2 spacing/cap); LIVE D-HOLD TAKES are ungridded.');
o();
o('| perceived band | census moments/team/match | SD | CV | median | p90 | zero-share | live D-HOLD takes/team/match | punished/team/match |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of c.eventRateMoments.byBand) {
  const m = r.censusMomentsPerTeamPerMatch;
  o(`| ${BAND_NAME[r.band]} | ${num(m.mean)} | ${num(m.sd)} | ${num(m.cv)} | ${num(m.median, 1)} | ${num(m.p90, 1)} | `
    + `${pct(m.zeroShare)} | ${num(r.liveHoldsPerTeamPerMatch.mean)} | ${num(r.punishedPerTeamPerMatch.mean)} |`);
}
o();
o(`All bands together: **${num(c.eventRateMoments.allBandsCensusMomentsPerTeamPerMatch.mean)}** census moments per `
  + `team per match (SD ${num(c.eventRateMoments.allBandsCensusMomentsPerTeamPerMatch.sd)}), and `
  + `**${num(c.eventRateMoments.allBandsLiveHoldsPerTeamPerMatch.mean)}** live D-HOLD takes per team per match `
  + `(zero-share ${pct(c.eventRateMoments.allBandsLiveHoldsPerTeamPerMatch.zeroShare)}).`);
o();
o('⭐ **THE RUN-LENGTH K GRID** — matches a single team must play for its book to hold K events in each '
  + 'band, at the measured mean rates. ⚠ A REPORTING GRID: EK-T1 freezes its own K ex ante from these '
  + 'moments, and the dispersion column above is why a mean alone is not enough.');
o();
o('| perceived band | at the census-moment rate: K=10 / 20 / 30 / 50 / 100 | at the live D-HOLD rate: K=10 / 20 / 30 / 50 / 100 |');
o('|---|---|---|');
for (const r of c.runLengthArithmetic) {
  const ks = ['K10', 'K20', 'K30', 'K50', 'K100'];
  const a1 = ks.map((k) => r.matchesForK[k].atCensusMomentRate ?? '—').join(' / ');
  const a2 = ks.map((k) => r.matchesForK[k].atLiveHoldRate ?? '—').join(' / ');
  o(`| ${BAND_NAME[r.band]} | ${a1} | ${a2} |`);
}
o();
o('### THE E-CLASS MIX (context for EK-T1)');
o();
o('| class | count | share of eligible |');
o('|---|---:|---:|');
for (const k of Object.keys(c.classCounts)) {
  o(`| \`${k}\` | ${int(c.classCounts[k])} | ${pct(c.classShares[k])} |`);
}
o();
o('### ⭐ THE CONVERGENCE YARDSTICK — the schema EK-T1 may not re-cut');
o();
o('```json');
o(JSON.stringify(c.yardstick, null, 2));
o('```');
o();
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const ev: Record<string, string> = {
  xDet: `digest \`${shortSha(g.xDet.digestA)}\` twice (two independent walks; pass B never resumes)`,
  xSrcUntouched: '`git diff --stat -- src` empty',
  xFpProd: `observed \`${shortSha(String(g.xFpProd.observed))}\` = baseline, re-derived in-process`,
  gConfigIdentity: `${Object.entries(g.gConfigIdentity).filter(([k, v]) => typeof v === 'boolean' && k !== 'pass').length} conjuncts against the committed exam probe's SOURCE`,
  gRepro65: `${g.gRepro65.fieldsChecked} integer fields, **${g.gRepro65.mismatches} mismatches**, block ${g.gRepro65.block} — the #65 sizing smoke's own rows`,
  gReproDvc0: `${g.gReproDvc0.fieldsChecked} integer fields, **${g.gReproDvc0.mismatches} mismatches**, block ${g.gReproDvc0.block} — DV-C0's own smoke rows`,
  gWindowTrace: `primary ${g.gWindowTrace.primaryWindowS} s = DV-C0's committed primary · family \`${JSON.stringify(g.gWindowTrace.family)}\` · ladder \`${JSON.stringify(g.gWindowTrace.windowsS)}\` · C5-native row = ${g.gWindowTrace.c5HorizonTicks} ticks ÷ ${g.gWindowTrace.ticksPerSecond} = ${g.gWindowTrace.c5NativeWindowS} s`,
  gBandTrace: `cuts \`${JSON.stringify(g.gBandTrace.pressureCuts)}\` from the committed table · ${int(g.gBandTrace.sweepSamples)} swept samples, ${g.gBandTrace.disagreements} disagreements`,
  gArmed: `live takes ${int(g.gArmed.liveHolds)} · dosed ${int(g.gArmed.dosedHolds)} · dose bites ${pct(g.gArmed.biteShare)} of ${int(g.gArmed.biteChecked)} sampled · fork control ${int(g.gArmed.controlChecked)} checked, ${g.gArmed.controlUnexplained} unexplained`,
  gAccounting: 'ticks · spans · turnover ledger · eligibility partition · class partition · dose tie · non-negativity · punished ⊆ lost · monotone in the window · lost and moments invariant',
  gWorld: `read back on a never-stepped match at seed ${int(g.gWorld.constructionSeed)}`,
  gSeedDisjoint: `${g.gSeedDisjoint.blocks.length} blocks machine-checked (2 re-walks, predicates INVERTED) · ledger ${g.gSeedDisjoint.ledgerEntries} entries`,
  gStatsDisjoint: `base ${int(g.gStatsDisjoint.base)}, minGap ${int(g.gStatsDisjoint.minGap)} ≥ 200`,
  gCleanInvocation: `envN ${String(g.gCleanInvocation.envN)} · capped ${g.gCleanInvocation.capped} · skipFp ${g.gCleanInvocation.skipFp} · routedToGuardBlock ${g.gCleanInvocation.routedToGuardBlock}`,
  gNDerived: `ran N ${int(g.gNDerived.ranN)} = derived N* ${int(g.gNDerived.derivedNStar)} (binding term: ${g.gNDerived.bindingTerm})`,
  gValuesUnreachable: `${int(g.gValuesUnreachable.filesScannedCount)} src files scanned · ${g.gValuesUnreachable.needles.length} needles (raw 5-dp + formatted %) · ${g.gValuesUnreachable.hits.length} hits · control needle found ${g.gValuesUnreachable.controlFound}`,
  gMutants: `**${g.gMutants.conjunctsCovered} conjuncts, ${g.gMutants.dead} dead** — ⚠ coverage SCOPED to ${g.gMutants.gatesCovered.length} gates: ${g.gMutants.gatesCovered.join(', ')}`,
};
for (const k of Object.keys(g)) o(`| \`${k}\` | **${g[k].pass ? 'PASS' : 'FAIL'}** | ${ev[k] ?? ''} |`);
o();
o('### THE ACCOUNTING IDENTITIES (gate input — ticks, moments, holds and losses, not football)');
o();
const acc = c.accounting;
o('```text');
o(`ticks         ${int(acc.totalTicks)} = segment ${int(acc.segmentTicks)} + loose ${int(acc.looseGapTicks)} + deadBall ${int(acc.deadBallTicks)}   ⇒ ok`);
o(`no overlap    assignedTicksSum ${int(acc.assignedTicksSum)} = segmentTicks ${int(acc.segmentTicks)} · spanOrderViolations ${acc.spanOrderViolations}`);
o(`turnovers     walked ${int(acc.turnoversTotal)} = ledgered ${int(acc.turnoversLedgered)}`);
o(`eligibility   qualifying ${int(acc.qualifying)} = eligible ${int(acc.eligible)} + firstTouch ${int(acc.exclusions.firstTouch)}`
  + ` + mustKick ${int(acc.exclusions.mustKick)} + A0-shoot ${int(acc.exclusions.a0Shoot)} + A0-clear ${int(acc.exclusions.a0Clear)}`);
o(`classes       ${Object.entries(acc.classCounts).map(([k, v]) => `${k} ${int(v as number)}`).join(' · ')}`);
o(`dose tie      dosed forks ${int(acc.dosedForks)} = D-HOLD + E-ACTNOW-DECLINED (the moments whose cell was placed)`);
for (const w of acc.perWindow) {
  o(`  @${String(w.windowS).padStart(2)} s      punished ${String(int(w.punished)).padStart(6)} + lost-unpunished ${String(int(w.lost - w.punished)).padStart(6)}`
    + ` + no-loss ${String(int(w.moments - w.lost)).padStart(6)} = ${int(w.moments)}   (lost ${int(w.lost)} INVARIANT · censored ${int(w.censored)})`);
}
o(`receipts      dose-bite ${int(acc.biteDiffered)}/${int(acc.biteChecked)} sampled · fork-control unexplained ${acc.controlUnexplained}/${int(acc.controlChecked)}`);
o('```');
o();
o('### THE N RULE AS EXECUTED (in-probe, from the committed smoke)');
o();
const n = g.gNDerived;
o('```text');
o(`rule            ${n.arithmetic}`);
o(`smoke artifact  ${n.smokeArtifact}  (sha256 ${shortSha(String(n.smokeArtifactSha256))})`);
o(`rarest-band events/match ${num(n.rarestBandEventsPerMatch, 5)}  · precision term unbounded: ${n.precisionTermUnbounded}`);
o(`wall term ${int(n.nWall)} · cap ${int(n.nCap)}   ⇒ N* ${int(n.nStar)}  (${n.bindingTerm}; projected ${num(n.projectedWallHours, 4)} h)`);
o(`as executed     N ${int(n.ranN)} · ms/match (from the smoke's UNHASHED envelope) ${num(n.msPerMatch, 1)} · rarest band at battery `
  + `${a.result.sizing.rarestBand} with ${int(a.result.sizing.rarestBandMoments)} holds and ${int(a.result.sizing.rarestBandPunished)} punished`);
o('```');
o();
o('### Deviations recorded');
o();
a.deviations.forEach((d: string, i: number) => o(`${i + 1}. ${d}`));
o();
o('### Registered non-claims (from the artifact)');
o();
a.nonClaims.forEach((d: string, i: number) => o(`${i + 1}. ${d}`));
o();
o(`**VERDICT (the probe's own, mechanical):** EK-C0 HOLD-OUTCOME CENSUS at N=${int(a.result.seeds.n)} × 1 arm `
  + `(the whetherEye-ARMED world) — ${passCount}/${gateCount} gates. THE TABLE IS DESCRIPTIVE TRUTH: the #246 `
  + 'shape flags are mechanical and the commander adjudicates them (#203).');
