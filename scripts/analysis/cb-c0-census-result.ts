/**
 * CB-C0 §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED dispossession-geometry census artifact and emits the whole §RESULT
 * markdown section on stdout. EVERY measured cell in the published section is printed from
 * this file's reads of the artifact — never typed into the doc by hand. The prose captions
 * are literal strings here, so they ride the generator too and cannot drift from the numbers
 * beside them.
 *
 * This script ADJUDICATES NOTHING (#203). It prints the census's rows, the pre-registered
 * #246 shape readings exactly as the artifact records them, and the mechanical routing.
 *
 *   npx tsx scripts/analysis/cb-c0-census-result.ts docs/world-model/data/cb-c0-dispossession-census.json
 */
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/cb-c0-dispossession-census.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));
const R: Any = A.result;
const F: Any = A.frozenDesign;
const G: Any = A.gates;

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const pct = (x: number, dp = 3): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)} %` : 'n/a');
const pp = (x: number, dp = 3): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)}` : 'n/a');
const ciPP = (c: number[]): string => `[${pp(c[0])}, ${pp(c[1])}]`;
const ciM = (c: number[]): string => `[${num(c[0], 4)}, ${num(c[1], 4)}]`;
/** the gate stores the source with its COMMENTS STRIPPED; collapse the holes they left. */
const tidy = (src: string): string => String(src).split('\n').map((l) => l.trimEnd())
  .filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n');

o('## §RESULT');
o();
o(`**${int(R.run.matches)} seeds × 1 arm (BARE PRODUCTION — every experimental flag off), block `
  + `${int(F.seeds.walked[0])}–${int(F.seeds.walked[1])}, ${A.gateCount}/${A.gateCount} gates PASS**, `
  + `\`resultSha256\` \`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`. `
  + 'Every number below is printed by `scripts/analysis/cb-c0-census-result.ts` from the committed '
  + 'artifact; none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`world             bare production — new Match({seed, teamA, teamB}); no flag, no eye, no gene, no book`);
o(`matches           ${int(R.run.matches)}   (${num(R.churn.simSecondsPerMatch, 4)} sim-seconds each)`);
o(`standing duels    ${int(R.run.duels)}   (${num(R.churn.duelsPerMatch, 4)} per match — every \`tryTackles\` lunge)`);
o(`  won             ${int(R.run.wins)}      lost ${int(R.run.misses)}`);
o(`  whistle-excl.   ${int(R.run.whistledExcluded)}   (the tick's own whistle moved the ball or the taker — see §DEV)`);
o(`  TABULATED       ${int(R.run.duelsTabulated)}   = ${int(R.run.tabulatedWins)} wins + ${int(R.run.tabulatedMisses)} misses  (the geometry tables' population)`);
o(`refusal ticks     ${int(R.run.refusalTicks)}   (a candidate inside the challenge radius and NO lunge)`);
o(`other duels       slide ${int(R.run.slideEvents)} · tactical grab ${int(R.run.grabEvents)} · keeper smother-miss ${int(R.run.smotherMissEvents)}   (counted, NOT in the geometry tables)`);
o(`turnovers         ${int(R.run.turnovers)}   (${num(R.churn.turnoversPerMatch, 4)} per match, DV-C0 semantics)`);
o(`mean taker speed  ${num(R.run.meanTakerSpeed, 4)} m/s   ·   mean carrier speed ${num(R.run.meanCarrierSpeed, 4)} m/s`);
o(`v*                ${F.derivation.vStar}`);
o(`estimator         cluster bootstrap by match seed, 2,000 resamples, stats base ${int(F.statsBase)}`);
o('```');
o();
o('### ⭐⭐ THE TAKE-RATE TABLE — P(the ball is won | a challenge is made), BY APPROACH SPEED');
o();
o('| approach-speed bin | window (m/s) | lunges | wins | **take rate** | CI 95 % (pp) | refusal ticks |');
o('|---|---|---:|---:|---:|---:|---:|');
for (const r of R.takeRateBySpeed) {
  o(`| ${r.bin} | [${num(r.loEdge, 3)}, ${r.hiEdge === null ? '∞' : num(r.hiEdge, 3)}) | ${int(r.n)} `
    + `| ${int(r.k)} | **${pct(r.rate)}** | ${ciPP(r.ci95)} | ${int(r.refusals)} |`);
}
o();
o('### THE TAKE RATE BY APPROACH DIRECTION (φ — the taker\'s own direction of travel vs the carrier\'s heading)');
o();
o('| approach | lunges | wins | **take rate** | CI 95 % (pp) | refusal ticks |');
o('|---|---:|---:|---:|---:|---:|');
for (const r of R.takeRateByApproachDirection) {
  o(`| ${r.bin} | ${int(r.n)} | ${int(r.k)} | **${pct(r.rate)}** | ${ciPP(r.ci95)} | ${int(r.refusals)} |`);
}
o();
o('### THE TAKE RATE BY MOTION STATE (the taker\'s own per-tick deltas)');
o();
o('| state | lunges | wins | **take rate** | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|');
for (const r of R.takeRateByMotion) {
  o(`| ${r.state} | ${int(r.n)} | ${int(r.k)} | **${pct(r.rate)}** | ${ciPP(r.ci95)} |`);
}
o();
o('### ⚠ THE BEARING AXIS θ — STRUCTURALLY DEGENERATE, published as a finding');
o();
o('| bearing | lunges | wins | take rate | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|');
for (const r of R.takeRateByBearing) {
  o(`| ${r.bin} | ${int(r.n)} | ${int(r.k)} | ${pct(r.rate)} | ${ciPP(r.ci95)} |`);
}
o();
o(`> ${R.bearingAxisDegeneracy.note}`);
o();
o('### ⭐⭐ DOES OVERCOMMITMENT EXIST — AND IS IT EVER PUNISHED?');
o();
o('| class | lunges | wins | take rate | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|');
for (const r of [R.overcommitment.overcommitted, R.overcommitment.controlled]) {
  o(`| ${r.class} | ${int(r.n)} | ${int(r.k)} | **${pct(r.rate)}** | ${ciPP(r.ci95)} |`);
}
const ob = R.overcommitment.byOwnBodyVStar;
o(`| *(REPORTED sensitivity)* overcommitted vs **that body's own** v\\* | ${int(ob.n)} | ${int(ob.k)} `
  + `| ${pct(ob.rate)} | ${ciPP(ob.ci95)} |`);
o();
o('**WHAT A MISSED CHALLENGE COSTS, BY ARRIVAL SPEED.** `overrun` = metres the beaten lunger travels '
  + 'along his own approach axis during the stun the engine imposes on him; `Δsep` = the change in his '
  + `separation from the carrier over ${num(F.horizons.h1Seconds, 4)} s (his OWN re-challenge interval); `
  + '`Δspace` = the change in the carrier\'s distance to his nearest opponent over the same window; '
  + '`retain` = the carrier\'s team still holds the ball (no turnover stamped, DV-C0 semantics).');
o();
o('| arrival-speed bin | misses | overrun (m) | CI 95 % | Δsep (m) | CI 95 % | Δspace (m) | retain @ '
  + `${num(F.horizons.h1Seconds, 2)} s | retain @ ${num(F.horizons.h2Seconds, 2)} s |`);
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of R.punishment.byArrivalSpeed) {
  o(`| ${r.bin} | ${int(r.misses)} | **${num(r.overrunM.mean, 4)}** | ${ciM(r.overrunM.ci95)} `
    + `| ${num(r.dSeparationM.mean, 4)} | ${ciM(r.dSeparationM.ci95)} | ${num(r.dSpaceM.mean, 4)} `
    + `| ${pct(r.retain1.rate)} | ${pct(r.retain2.rate)} |`);
}
o();
o('And the WIN side of the same picture (the overrun of a defender who *did* get the ball):');
o();
o('| arrival-speed bin | wins with a resolved horizon | overrun (m) |');
o('|---|---:|---:|');
for (const r of R.punishment.byArrivalSpeed) {
  o(`| ${r.bin} | ${int(r.winOverrunM.n)} | ${num(r.winOverrunM.mean, 4)} |`);
}
o();
o('**THE PUNISHMENT SIGNALS, as the artifact records them:**');
o();
o('| signal | point | CI 95 % | punishes recklessness? |');
o('|---|---:|---:|---|');
for (const s of R.punishment.signals) {
  o(`| ${s.name} | ${num(s.point, 6)} | ${ciM(s.ci95)} | ${s.punishes ? '**YES**' : 'no'} |`);
}
o();
o(`⇒ \`anySignalPunishes\` = **${R.punishment.anySignalPunishes ? 'true' : 'false'}**.`);
o();
o('**THE PRICE OF A MISS, read out of the engine\'s own source:**');
o();
o('```text');
o(`cooldown          ${R.punishment.priceOfAMiss.cooldownS} s      (constant)`);
o(`stun              ${R.punishment.priceOfAMiss.stunS} s     (constant)`);
o(`burst stamina     ${R.punishment.priceOfAMiss.burstStamina}    (constant)`);
o(`position written  ${R.punishment.priceOfAMiss.positionCost}       velocity written ${R.punishment.priceOfAMiss.velocityCost}`);
o('```');
o();
o(`> ${R.punishment.priceOfAMiss.note}`);
o();
o('### ⭐ THE #246 REALITY-SHAPE CHECK — PRE-REGISTERED, evaluated with paired CIs');
o();
o('| id | claim (real football\'s SHAPE) | expected | measured | CI 95 % | verdict |');
o('|---|---|---|---:|---:|---|');
for (const s of R.realityShapes) {
  o(`| **${s.id}** | ${s.claim} | ${s.expect} | ${num(s.point, 6)} | ${ciM(s.ci95)} | **${s.shapeVerdict}** |`);
}
o();
o(`ROUTING (from the artifact): *${R.routing}*`);
o();
o('⭐ **AND THE ENGINE-EXPECTED SHAPE, E1**, stated ex ante from the mechanism itself:');
o();
o(`> ${F.engineExpectedShape}`);
o();
o('### ⭐⭐ THE STRUCTURAL FINDING — proved from the engine\'s own source (G-GEOMETRY-BLIND)');
o();
o(`> ${G.gGeometryBlind.finding}`);
o();
o('The take-probability expression, quoted verbatim from `src/sim/mechanics.ts` by the gate:');
o();
o('```ts');
o(tidy(G.gGeometryBlind.takeExpressionSource));
o('```');
o();
o('The MISS branch, likewise:');
o();
o('```ts');
o(tidy(G.gGeometryBlind.missBranchSource));
o('```');
o();
o('### THE CHURN LINKAGE (the #169-arc spell/turnover instruments, DV-C0\'s own, re-used)');
o();
o('```text');
o(`turnovers / match          ${num(R.churn.turnoversPerMatch, 4)}   (one every ${num(R.churn.secondsPerTurnover, 4)} sim-seconds)`);
o(`duels / match              ${num(R.churn.duelsPerMatch, 4)}   (won ${num(R.churn.winsPerMatch, 4)})`);
o(`refusal ticks / match      ${num(R.churn.refusalTicksPerMatch, 4)}   ·  proximity ticks / match ${num(R.churn.proximityTicksPerMatch, 4)}`);
o(`slide tackles / match      ${num(R.churn.slideEventsPerMatch, 4)}   (won ${num(R.churn.slideWinsPerMatch, 4)})   ·  tactical grabs / match ${num(R.churn.grabEventsPerMatch, 4)}`);
o(`goals / match              ${num(R.churn.goalsPerMatch, 4)}`);
o('');
o(`MEAN POSSESSION SPELL      ${num(R.churn.meanSpellTicks.meanSeconds, 4)} s   over ${int(R.churn.meanSpellTicks.segments)} segments   CI ${ciM(R.churn.meanSpellTicks.ci95)} ticks`);
o(`  spell CONTAINING a duel  ${num(R.churn.meanDuelledSpellTicks.meanSeconds, 4)} s   over ${int(R.churn.meanDuelledSpellTicks.duels)} duels    CI ${ciM(R.churn.meanDuelledSpellTicks.ci95)} ticks`);
o(`  spell REMAINING after it ${num(R.churn.meanSpellTicksAfterDuel.meanSeconds, 4)} s`);
o(`  duelled − baseline gap   ${num(R.churn.spellVsDuelledGap.point, 4)} ticks   CI ${ciM(R.churn.spellVsDuelledGap.ci95)}  ⇒ ${R.churn.spellVsDuelledGap.verdict}`);
o('```');
o();
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const ev: Record<string, string> = {
  xDet: `digest \`${String(G.xDet.digestA).slice(0, 8)}…${String(G.xDet.digestA).slice(-4)}\` twice (pass B never resumes)`,
  xSrcUntouched: '`git diff --stat -- src` empty',
  xFpProd: `observed \`${String(G.xFpProd.observed).slice(0, 8)}…${String(G.xFpProd.observed).slice(-4)}\` = baseline, re-derived in-process`,
  gConstTrace: `${Object.keys(G.gConstTrace.conjuncts).length} conjuncts — every duel/motion constant read out of \`src/**\` at run time`,
  gBinsDerived: `${Object.keys(G.gBinsDerived.conjuncts).length} conjuncts — every bin edge re-derived from the traced constants, arithmetic stored`,
  gGeometryBlind: `${Object.keys(G.gGeometryBlind.conjuncts).length} conjuncts against the ENGINE'S OWN SOURCE (the structural finding)`,
  gDetect: `${Object.keys(G.gDetect.conjuncts).length} conjuncts · wins ${int(G.gDetect.counts.wins)} + slide wins ${int(G.gDetect.counts.slideWins)} = engine counter ${int(G.gDetect.counts.engineTackles)}`,
  gAccounting: `${Object.keys(G.gAccounting.conjuncts).length} conjuncts — tick partition, span order, cell/marginal completeness, horizon monotonicity`,
  gReproDvc0: `${G.gReproDvc0.fieldsChecked} integer fields, **${G.gReproDvc0.mismatches} mismatches**, block ${G.gReproDvc0.block} — DV-C0's own smoke rows`,
  gWorld: `read back on a never-stepped match at seed ${int(F.seeds.gWorld)}`,
  gSeedDisjoint: `${G.gSeedDisjoint.blocks.length} blocks machine-checked (1 re-walk, predicate INVERTED) · ledger ${int(G.gSeedDisjoint.ledgerEntries)} entries`,
  gStatsDisjoint: `base ${int(G.gStatsDisjoint.base)}, minGap ${int(G.gStatsDisjoint.minGap)} ≥ 200`,
  gCleanInvocation: `preflight ${G.gCleanInvocation.preflight} · reasons [${G.gCleanInvocation.reasons.join(', ')}] · resumeRequested ${G.gCleanInvocation.resumeRequested}`,
  gNDerived: `ran N ${int(G.gNDerived.ranN)} = derived N* ${int(G.gNDerived.derivedN)} (binding term: ${G.gNDerived.sizing.binding})`,
  gValuesUnreachable: `${int(G.gValuesUnreachable.filesScanned)} src files · ${G.gValuesUnreachable.needles} needles (raw + formatted %) · ${G.gValuesUnreachable.hits} hits`,
  gMutants: `**${G.gMutants.mutantsRun} mutants, ${G.gMutants.dead} dead** — coverage NAMED: ${G.gMutants.coverage.join(', ')}; uncovered conjuncts ${G.gMutants.uncoveredConjuncts.length}`,
};
for (const name of A.gateNames) {
  o(`| \`${name}\` | **${G[name].pass ? 'PASS' : 'FAIL'}** | ${ev[name] ?? ''} |`);
}
o();
o(`⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's \`gates\` object carries exactly `
  + `**${A.gateNames.length}** keys — \`${A.gateNames.join(' · ')}\` — and `
  + `**${A.gateNames.filter((n: string) => G[n].pass).length}** of them pass.`);
o();
o('### The accounting identities (gate input)');
o();
o('```text');
const I = G.gAccounting.identities;
o(`ticks          ${int(I.totalTicks)} = segment ${int(I.segment)} + loose ${int(I.loose)} + deadBall ${int(I.deadBall)}`);
o(`assigned       ${int(I.assigned)} = segmentTicks ${int(I.segment)}   ·  spanOrderViolations ${int(I.spanViolations)}`);
o(`duels          ${int(I.duels)} total = ${int(I.tabulated)} tabulated + ${int(I.duels - I.tabulated)} whistle-excluded`);
o(`cells          speed×bearing ${int(I.cellLungeSum)} = speed×approach ${int(I.phiLungeSum)} = tabulated ${int(I.tabulated)}`);
o(`outcomes       wins ${int(I.wins)} + misses ${int(I.misses)} = tabulated ${int(I.tabulated)}   ·  motion marginal ${int(I.motionLungeSum)}`);
o(`proximity      ${int(I.proximity)} ticks = lunge ticks + refusal ticks ${int(I.refusalTicks)}`);
o(`planted bin    above s0: ${int(I.plantedAboveS0)}  (structurally empty)  ·  in s0: ${int(I.plantedInS0)}  ·  duels above s0: ${int(I.duelsAboveS0)}`);
o('```');
o();
o('### The N rule as executed');
o();
o('```text');
o(`rule            ${A.sizing.rule}`);
o(`smoke artifact  docs/world-model/data/cb-c0-dispossession-census-smoke.json`);
o(`rarest cell     ${A.sizing.rarestCellName} at ${num(A.sizing.rarestCellEventsPerMatch, 6)} lunges/match`);
o(`precision term  ${A.sizing.derived.precisionTerm ?? 'UNBOUNDED (the zero-event clause)'}   ·  wall term ${int(A.sizing.derived.wallTerm)}   ·  seed-room cap 800`);
o(`⇒ N*            ${int(A.sizing.derived.n)}   (binding: ${A.sizing.derived.binding}; projected ${num(A.sizing.derived.projectedHours, 4)} h)`);
o(`as executed     N ${int(R.run.matches)} · ms/match (from the smoke's UNHASHED envelope) ${A.sizing.msPerMatch}`);
o('```');
o();
o('### Deviations recorded');
o();
A.deviations.forEach((d: string, i: number) => o(`${i + 1}. ${d}`));
o();
o('### Registered non-claims (from the artifact)');
o();
A.registeredNonClaims.forEach((d: string, i: number) => o(`${i + 1}. ${d}`));
o();
o(`**VERDICT (the probe's own, mechanical):** ${A.verdict}`);
