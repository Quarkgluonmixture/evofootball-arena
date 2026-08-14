/**
 * R-乙 §1 and §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Two modes, one file, so the frozen half and the measured half can never disagree:
 *
 *   --frozen                 prints §1 THE FROZEN QUANTITY LIST from `scripts/probes/rYiQuantities.ts`
 *                            (the registry is the single source; nothing is typed into the doc).
 *   <artifact.json>          prints §RESULT from the committed epoch artifact — every measured cell
 *                            printed from a read, never typed.
 *
 * This script ADJUDICATES NOTHING (#203) and writes no STATUS.
 *
 *   npx tsx scripts/analysis/r-yi-gap-table-result.ts --frozen
 *   npx tsx scripts/analysis/r-yi-gap-table-result.ts docs/world-model/data/r-yi-gap-table-post-CB.json
 */
import { readFileSync } from 'node:fs';
import { ARM_DEFINITIONS, ARMS, CONTEXT_KEYS, QUANTITIES } from '../probes/rYiQuantities';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const num = (x: unknown, dp = 4): string => (typeof x === 'number' && Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const int = (x: unknown): string => (typeof x === 'number' && Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const ci = (c: Any, dp = 4): string => (Array.isArray(c) ? `[${num(c[0], dp)}, ${num(c[1], dp)}]` : 'n/a');
/** `|` inside a markdown table cell must be escaped or the row breaks. */
const cell = (s: string): string => s.replace(/\|/g, '\\|');

const arg = process.argv[2] ?? '--frozen';

if (arg === '--frozen') {
  o('## §1 THE FROZEN QUANTITY LIST');
  o();
  o(`**${QUANTITIES.length} quantities**, frozen in `
    + '[`scripts/probes/rYiQuantities.ts`](../../scripts/probes/rYiQuantities.ts) **before any '
    + 'battery was read**. That module is the SINGLE SOURCE of this list: this section is printed '
    + 'from it by `scripts/analysis/r-yi-gap-table-result.ts --frozen`, so a band cannot drift '
    + 'between the doc and the instrument (#229.2).');
  o();
  o('⭐ **THE STATUS COLUMN IS `UNADJUDICATED` ON EVERY ROW AND STAYS THAT WAY.** Deliberate arcade '
    + 'deviation · gap · unknown is the ruling chain\'s word (contract §1, §4; #203). The type has '
    + 'exactly one member on purpose.');
  o();
  o('⚠ **Every REAL value is eleven-a-side, full-pitch, 90-minute football.** Ours is 6v6 on a '
    + '0.70-scaled pitch over a 240 s match clock. COUNT rows are the least comparable across that '
    + 'gap; DURATION and SHARE rows the most.');
  o();
  o('| id | the quantity, in football words | unit | REAL | conf | from | STATUS |');
  o('|---|---|---|---|---|---|---|');
  for (const q of QUANTITIES) {
    const from = q.real.inherited === '#170' ? `#170 ${q.real.b170 ?? ''}`.trim()
      : q.real.inherited === 'new' ? 'sourced this round' : '—';
    o(`| ${q.id} | ${cell(q.name)} | ${cell(q.unit)} | ${cell(q.real.text)} | ${q.real.confidence} `
      + `| ${from} | ${q.status} |`);
  }
  o();
  o('### §1.1 OURS — how each row is measured, and whose semantics that is');
  o();
  for (const q of QUANTITIES) {
    o(`* **${q.id} ${q.name}** — ${q.oursSemantics}`
      + (q.caveat === undefined ? '' : `  \n  ${q.caveat}`)
      + (q.zeroByStructure === undefined ? ''
        : `  \n  ⭐ DECLARED ZERO-BY-STRUCTURE on: ${q.zeroByStructure.join(', ')}.`));
  }
  o();
  o('### §1.2 REAL — the citation behind every band, and every UNSOURCED row');
  o();
  for (const q of QUANTITIES) {
    o(`* **${q.id}** (${q.real.confidence}) — ${q.real.source}`);
  }
  o();
  o('### §1.3 CONTEXT ROWS — measured and published, compared to NO band');
  o();
  for (const c of CONTEXT_KEYS) o(`* \`${c.key}\` — ${c.why}`);
  o();
  o('### §1.4 THE ARMS');
  o();
  for (const a of ARMS) o(`* **${a}** — ${ARM_DEFINITIONS[a]}`);
  process.exit(0);
}

/* ------------------------------- §RESULT ---------------------------------- */
const A: Any = JSON.parse(readFileSync(arg, 'utf8'));
const F: Any = A.frozenDesign;
const R: Any = A.result;
const G: Any = A.gates;
const E: Any = A.envelope;

o('## §RESULT');
o();
o(`**epoch label \`${R.run.label}\` · ${int(R.run.matches)} seeds × ${R.run.arms} arms · block `
  + `${int(F.seeds.core[0])}–${int(F.seeds.core[1])} · ${A.gateCount}/${A.gateCount} gates `
  + `${A.allGatesPass ? 'PASS' : '*** RED ***'}**, \`resultSha256\` `
  + `\`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`. Every number `
  + 'below is printed by `scripts/analysis/r-yi-gap-table-result.ts` from the committed artifact; '
  + 'none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`match clock       ${F.matchClock.matchDurationSimSeconds} sim-seconds ⇔ ${F.matchClock.displayMinutes}′  `
  + `(${num(F.matchClock.simSecondsPerDisplayMinute, 6)} sim-s per display-minute)`);
for (const a of ARMS) {
  o(`${a.padEnd(18)}${num(R.run.simSecondsPerMatch[a], 4)} played sim-seconds per match`);
}
o(`pressure radius   ${F.frozenRadiusM} m   (${F.frozenRadiusTrace})`);
o(`first-touch win.  ${F.firstTouchWindowS} s   (${F.firstTouchTrace})`);
o(`estimator         ${F.estimator}`);
o(`N rule            ${F.nRule.arithmetic}`);
o(`                  binding precision term: ${F.nRule.bindingPrecisionTerm}`);
o(`seeds             band ${int(F.seeds.band[0])}–${int(F.seeds.band[1])} · smoke `
  + `${int(F.seeds.smoke[0])}–${int(F.seeds.smoke[1])} · core ${int(F.seeds.core[0])}–${int(F.seeds.core[1])} `
  + `· G-WORLD ${int(F.seeds.gWorld)} · declared re-walk ${int(F.seeds.declaredRewalk[0])}–${int(F.seeds.declaredRewalk[1])}`);
o(`stats base        ${int(F.statsBase)}`);
o(`ledger            ${F.reRunClause.ledger}  (label ${F.reRunClause.label})`);
o('```');
o();
o('### ⭐ THE GAP TABLE');
o();
o('| id | quantity | OURS (bare) | OURS (CB-armed) | REAL | conf | STATUS |');
o('|---|---|---|---|---|---|---|');
for (const q of QUANTITIES) {
  const b = R.ours.bare.quantities[q.id];
  const c = R.ours.cb.quantities[q.id];
  const fmtCell = (r: Any): string => (r === undefined ? 'n/a'
    : `${num(r.point)} ${ci(r.ci95)}`);
  o(`| ${q.id} | ${cell(q.name)} | ${fmtCell(b)} | ${fmtCell(c)} | ${cell(q.real.text)} `
    + `| ${q.real.confidence} | ${q.status} |`);
}
o();
o('Units are §1\'s; every interval is a 95 % cluster-bootstrap percentile CI over match seeds.');
o();
o('### DISTANCE FROM THE REAL BAND — mechanical, no verdict');
o();
o('For every row that HAS a band: where our point estimate sits relative to the nearer band edge. '
  + '`inside` = the CI overlaps the band. A factor is printed as ours ÷ edge, so `0.42×` reads '
  + '"ours is 0.42 of the nearest published edge". ⚠ This is arithmetic on two columns that count '
  + 'the same football quantity in two different games (11v11 90′ vs 6v6 240 s); it is NOT a '
  + 'verdict, and the STATUS column stays `UNADJUDICATED`.');
o();
o('| id | quantity | OURS (bare) | OURS (CB) | band | bare vs band | CB vs band |');
o('|---|---|---|---|---|---|---|');
for (const q of QUANTITIES) {
  if (q.real.lo === null || q.real.hi === null) continue;
  const lo = q.real.lo; const hi = q.real.hi;
  const read = (r: Any): string => {
    if (r === undefined || !Number.isFinite(r.point)) return 'n/a';
    const p = r.point as number;
    const ciL = r.ci95[0] as number; const ciH = r.ci95[1] as number;
    if (p >= lo && p <= hi) return 'INSIDE';
    if (Number.isFinite(ciL) && Number.isFinite(ciH) && ciH >= lo && ciL <= hi) return 'CI overlaps';
    const edge = p < lo ? lo : hi;
    return `${(p / edge).toFixed(2)}× the ${p < lo ? 'LOW' : 'HIGH'} edge`;
  };
  o(`| ${q.id} | ${cell(q.name)} | ${num(R.ours.bare.quantities[q.id]?.point)} `
    + `| ${num(R.ours.cb.quantities[q.id]?.point)} | ${num(lo)}–${num(hi)} `
    + `| ${read(R.ours.bare.quantities[q.id])} | ${read(R.ours.cb.quantities[q.id])} |`);
}
o();
o('### The spell-length shape (Q02, no real band exists)');
o();
o('```text');
for (const a of ARMS) {
  const e = R.ours[a].quantities.Q02.extra;
  o(`${a.padEnd(6)} p25 ${num(e.p25, 4)} ${ci(e.ci25)}   median ${num(e.median, 4)} ${ci(e.ciMedian)}`
    + `   p75 ${num(e.p75, 4)} ${ci(e.ci75)}   (n=${int(R.ours[a].quantities.Q02.den)} spells, `
    + `${int(e.resamples)} resamples)`);
}
o('```');
o();
o('### Both honest axes on the churn row (Q04)');
o();
o('```text');
for (const a of ARMS) {
  const e = R.ours[a].quantities.Q04.extra;
  o(`${a.padEnd(6)} per sim-second ${num(e.perSimSecond, 6)}   per sim-minute ${num(e.perSimMinute, 4)}`
    + `   per display-minute ${num(e.perDisplayMinute, 4)}   (× ${num(e.mappingFactor, 6)})`);
}
o('```');
o();
o('### CONTEXT rows (measured, compared to NO band)');
o();
o('```text');
for (const k of CONTEXT_KEYS) {
  const s = (v: Any): string => (typeof v === 'number' ? num(v, 4)
    : v !== null && typeof v === 'object' && 'point' in v ? `${num(v.point)} ${ci(v.ci95)}`
      : 'n/a');
  o(`${k.key.padEnd(30)} bare ${s(R.ours.bare.context[k.key]).padEnd(22)} cb ${s(R.ours.cb.context[k.key])}`);
}
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
  gTrace: `${Object.keys(G.gTrace.conjuncts).length} conjuncts — every constant read out of \`src/**\` at run time, incl. ⭐ ranOnTheMatchClock`,
  gArming: `${Object.keys(G.gArming.conjuncts).length} conjuncts — the CB arm IS \`a4MatchFlags(6)\` + \`armA4World(…,6)\`; ${int(G.gArming.flagsTrue.length)} flags true; 0 door literals typed in the probe`,
  gSemantics: `${int(G.gSemantics.fieldsChecked)} fields vs the committed #173 smoke, **${int((G.gSemantics.mismatches ?? []).length)} mismatches**, block ${G.gSemantics.block}`,
  gWorld: `${Object.keys(G.gWorld.conjuncts).length} conjuncts on a never-stepped match at seed ${int(G.gWorld.seed)} + the OFF ledger through the full walk`,
  gSeedDisjoint: `${int(G.gSeedDisjoint.blocks.length)} blocks machine-checked (1 declared re-walk, predicate INVERTED) · ledger ${int(G.gSeedDisjoint.ledgerEntries)} entries`,
  gStatsDisjoint: `base ${int(G.gStatsDisjoint.base)}, minGap ${int(G.gStatsDisjoint.minGap)} ≥ 200, ${int(G.gStatsDisjoint.published)} published bases`,
  gCleanInvocation: `preflight ${G.gCleanInvocation.preflight} · reasons ${JSON.stringify(G.gCleanInvocation.reasons)} · resumeRequested ${G.gCleanInvocation.resumeRequested}`,
  gNDerived: `ran N ${int(G.gNDerived.ran)} = derived N* ${int(G.gNDerived.derived)} = design term ${int(G.gNDerived.design)}; ⭐ the wall cap never bound`,
  gNonVacuity: `${int(G.gNonVacuity.cells)} cells at claim grain · declared structural zeros ${JSON.stringify(G.gNonVacuity.declaredStructuralZeros)} · undeclared empties ${JSON.stringify(G.gNonVacuity.undeclaredEmpties)}`,
  gRealHonest: `${int(G.gRealHonest.rows)} rows · ${JSON.stringify(G.gRealHonest.byConfidence)} · ⭐ all ${int(G.gRealHonest.inherited)} #170-inherited bands re-checked against the committed tempo artifact`,
  gValuesNotImported: `${int(G.gValuesNotImported.filesScanned)} src files · ${int(G.gValuesNotImported.needleCount)} needles · ${int(G.gValuesNotImported.coincidentalHits)} coincidental hits REPORTED (not gated); the gated conjunct is src-unchanged`,
  gLedgerAppend: `${int(G.gLedgerAppend.rowsAppended)} rows appended under \`${R.run.label}\` · duplicate-label refusal exercised live · ${int(G.gLedgerAppend.rowsPreserved)} prior lines preserved`,
  gMutants: `**${int(G.gMutants.mutantsRun)} mutants, ${int(G.gMutants.dead)} dead** · coverage ${int(G.gMutants.coverage.length)} gates, MACHINE-DERIVED · uncovered conjuncts ${int(G.gMutants.uncoveredConjuncts.length)} · stray ${int(G.gMutants.strayMutants.length)}`,
};
for (const k of A.gateNames as string[]) {
  o(`| \`${k}\` | **${G[k].pass ? 'PASS' : 'RED'}** | ${ev[k] ?? ''} |`);
}
o();
o(`⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's \`gates\` object carries exactly `
  + `**${int(A.gateCount)}** keys — \`${(A.gateNames as string[]).join(' · ')}\` — and `
  + `**${int((A.gateNames as string[]).filter((k) => G[k].pass).length)}** of them pass.`);
o();
o('### The envelope (everything OUTSIDE `resultSha256`)');
o();
o('```text');
o(`preflight       ${E.preflight}   reasons ${JSON.stringify(E.reasons)}   resumeRequested ${E.resumeRequested}`);
o(`paths           out ${E.outPath}   ledger ${E.ledgerPath}`);
o(`checkpoint      ${E.checkpointPath}   freshWalks ${int(E.freshWalks)}   doneMarker ${E.doneMarker}`);
o(`wall            passA ${int(E.wall.passAMs)} ms · X-DET ${int(E.wall.xDetMs)} ms · total ${int(E.wall.totalMs)} ms · ${num(E.wall.msPerMatch, 1)} ms/match`);
o(`N rule (wall)   wallTerm ${int(E.nRuleWall.wallTerm)} at ${num(E.nRuleWall.msPerMatch, 1)} ms/match — binding term: ${E.nRuleWall.bindingTerm}`);
o(`cross-OUT       ${E.crossOutAcceptance}`);
o('```');
o();
o('### Deviations recorded');
o();
(A.deviations as string[]).forEach((d, i) => o(`${i + 1}. ${d}`));
o();
o('### Registered non-claims');
o();
(A.registeredNonClaims as string[]).forEach((d, i) => o(`${i + 1}. ${d}`));
