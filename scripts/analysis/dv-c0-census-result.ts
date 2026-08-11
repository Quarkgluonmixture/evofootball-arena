/**
 * DV-C0 §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED census artifact and emits the whole §RESULT markdown section on stdout.
 * EVERY measured cell in the published section is printed from this file's reads of the artifact —
 * never typed into the doc by hand. That is the whole point: #229.2's lesson (the OBM-T1 smoke's
 * fabricated MAX column) enforced BY CONSTRUCTION rather than by a promise to sweep afterwards.
 * The prose captions are literal strings here, so they ride the generator too and cannot drift
 * away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, CIs and the mechanical #246 shape flags
 * the probe already computed. No verdict is composed here.
 *
 *   npx tsx scripts/analysis/dv-c0-census-result.ts docs/world-model/data/dv-c0-loss-cost.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dv-c0-loss-cost.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));
const C: Any = A.result.census;

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const int = (x: number): string => (Number.isFinite(x) ? x.toLocaleString('en-US') : 'n/a');
const pp = (x: number, dp = 3): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)} %` : 'n/a');
const ppPlain = (x: number, dp = 3): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)}` : 'n/a');
const ci = (c: [number, number], dp = 3): string => `[${ppPlain(c[0], dp)}, ${ppPlain(c[1], dp)}]`;
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const ZONE_LABEL: Record<string, string> = {
  own: '⭐ **own third**', middle: 'middle third', final: 'final third', all: '**ALL ZONES**',
};
const VERDICT_MARK: Record<string, string> = {
  'RESOLVED-CONFIRM': '✅ RESOLVED-CONFIRM', 'RESOLVED-INVERT': '⚠⚠ RESOLVED-INVERT',
  UNRESOLVED: '— UNRESOLVED',
};

const windows: Any[] = C.table;
const primary: Any = windows.find((w) => w.isPrimary);
const seeds = A.result.seeds;

/* ========================================================================== */
o('## §RESULT');
o();
o(`**${int(seeds.n)} seeds × 1 arm (bare production), block ${int(seeds.first)}–${int(seeds.last)}, `
  + `${Object.keys(A.gates).length}/${Object.keys(A.gates).length} gates `
  + `${A.allGatesPass ? 'PASS' : '*** RED ***'}**, `
  + `\`resultSha256\` \`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`. `
  + 'Every number below is printed by `scripts/analysis/dv-c0-census-result.ts` from the committed '
  + 'artifact; none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`world            bare production — ${String(A.frozenDesign.world).split('.')[0]}.`);
o(`matches          ${int(C.matches)}   (${num(C.simSecondsPerMatch, 2)} sim-seconds each)`);
o(`turnovers        ${int(C.accounting.turnoversTotal)}   (${num(C.turnoversPerMatch, 4)} per match)`);
o(`conceded goals   ${int(C.accounting.concededGoals)}   (${num(C.concededGoalsPerMatch, 4)} per match)`);
o(`primary window   ${primary.windowS} s   (the #218 census's own co-occurrence window)`);
o(`estimator        cluster bootstrap by match seed, ${int(A.frozenDesign.statsBase.resamples)} resamples, `
  + `stats base ${int(A.frozenDesign.statsBase.base)}`);
o('```');
o();

/* --------------------------------------------------------------------- */
o('### ⭐⭐ THE TRUE TABLE — turnover → goal-against hazard by zone (PRIMARY WINDOW)');
o();
o(`Hazard = attributed goals-against ÷ turnovers, in the **LOSER's frame** ("where did I lose it"), `
  + `at the pre-registered **${primary.windowS} s** window, with the paired cluster-bootstrap 95 % CI.`);
o();
o('| zone | turnovers | goals-against (attributed) | **hazard** | CI 95 % (pp) | co-occurrence rate |');
o('|---|---:|---:|---:|---:|---:|');
for (const r of [...primary.byThird, primary.all]) {
  o(`| ${ZONE_LABEL[r.zone] ?? r.zone} | ${int(r.turnovers)} | ${int(r.goalsAgainstAttributed)} `
    + `| **${pp(r.hazard)}** | ${ci(r.hazardCi95)} | ${pp(r.coOccurrenceRate)} |`);
}
o();
o('The **co-occurrence** column is the #218 census\'s own many-to-one reading (*was there ANY '
  + 'conceded goal within the window*), published beside every cell as the declared cross-cut; the '
  + 'hazard column is the frozen one-to-one nearest-in-window attribution.');
o();

/* --------------------------------------------------------------------- */
o('### ⭐ THE #246 REALITY-SHAPE CHECK — pre-registered, evaluated with CIs');
o();
o('| window | own − middle (pp) | CI 95 % | verdict | middle − final (pp) | CI 95 % | verdict | ⭐ GRADIENT |');
o('|---|---:|---:|---|---:|---:|---|---|');
for (const w of windows) {
  const s = w.realityShape;
  o(`| ${w.windowS} s${w.isPrimary ? ' **(PRIMARY)**' : ''} | ${ppPlain(s.ownVsMiddle.point)} `
    + `| ${ci(s.ownVsMiddle.ci95)} | ${VERDICT_MARK[s.ownVsMiddle.verdict]} `
    + `| ${ppPlain(s.middleVsFinal.point)} | ${ci(s.middleVsFinal.ci95)} `
    + `| ${VERDICT_MARK[s.middleVsFinal.verdict]} | ${VERDICT_MARK[s.gradientTowardOwnGoal]} |`);
}
o();
const g = primary.realityShape.gradientTowardOwnGoal as string;
if (g === 'RESOLVED-INVERT') {
  o('⚠⚠ **AN INVERSION IS PUBLISHED, NOT CORRECTED (#246).** It is routed to the 街机偏离 test — '
    + 'deliberate arcade trade-off vs substrate defect — as a labelled finding for the commander. '
    + 'The table above is the measurement; nothing in it was adjusted to match the expected shape.');
} else if (g === 'RESOLVED-CONFIRM') {
  o('**The shape holds at the primary window and the gradient is resolved.** Per #246 that is the '
    + 'fidelity check passing: the METHOD is reality\'s, the MAGNITUDES are this world\'s and are '
    + 'supposed to be, and the SHAPE is what had to agree. The 街机偏离 routing clause stays dormant.');
} else {
  o('**The gradient is UNRESOLVED at the primary window.** Per #246 that is neither a confirmation '
    + 'nor an inversion; it is published as it reads, and the routing clause stays dormant.');
}
o();
o(`Routing recorded in the artifact: *${primary.realityShape.routing}*`);
o();

/* --------------------------------------------------------------------- */
o('### THE WINDOW LADDER — the table\'s window-dependence, made visible');
o();
o('| window | own third | middle third | final third | all zones |');
o('|---|---:|---:|---:|---:|');
for (const w of windows) {
  const by: Record<string, Any> = Object.fromEntries(w.byThird.map((r: Any) => [r.zone, r]));
  o(`| ${w.windowS} s${w.isPrimary ? ' **(PRIMARY)**' : ''} | ${pp(by.own.hazard)} `
    + `| ${pp(by.middle.hazard)} | ${pp(by.final.hazard)} | ${pp(w.all.hazard)} |`);
}
o();
o('Counts (turnovers) do not move with the window — the denominator is the same population at '
  + 'every row; only the numerator grows. The ordering is printed above for each window.');
o();

/* --------------------------------------------------------------------- */
o('### THE SECONDARY TABLE — third × lateral band (PRIMARY WINDOW)');
o();
o('| cell | turnovers | goals-against | hazard | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|');
for (const r of primary.byCell) {
  o(`| \`${r.zone}\` | ${int(r.turnovers)} | ${int(r.goalsAgainstAttributed)} | ${pp(r.hazard)} `
    + `| ${ci(r.hazardCi95)} |`);
}
o();
o('⚠ The lateral band is this stage\'s own **analogue** of the traced third rule (`HALF_W/3`), and '
  + 'no #246 predicate touches it. It is published because a zoning the exams may later want is '
  + 'cheaper to measure now than to re-cut after sight.');
o();

/* --------------------------------------------------------------------- */
o('### ⭐ THE CONVERGENCE YARDSTICK — the schema DV-T2 may not re-cut');
o();
const Y: Any = C.yardstick;
o('```json');
o(JSON.stringify({
  schema: Y.schema, frame: Y.frame, windowS: Y.windowS,
  zones: Y.zones, relative: Y.relative, ordering: Y.ordering,
  baselineHazardAllZones: Y.baselineHazardAllZones,
}, null, 2));
o('```');
o();
o(`Ordering: **${(Y.ordering as string[]).join(' > ')}**. The \`relative\` vector is the scale-free `
  + 'form — a belief that has the right SHAPE but the wrong magnitudes scores well on it and badly '
  + 'on `zones`, which is exactly the distinction #247 asks DV-T2 to measure.');
o();

/* --------------------------------------------------------------------- */
o('### Gate table');
o();
o('| gate | result | evidence |');
o('|---|---|---|');
const gateEvidence = (k: string, v: Any): string => {
  switch (k) {
    case 'xDet': return `digest \`${String(v.digestA).slice(0, 12)}…\` twice`;
    case 'xFpProd': return `observed \`${String(v.observed).slice(0, 12)}…\` = baseline, re-derived in-process`;
    case 'xSrcUntouched': return '`git diff --stat -- src` empty';
    case 'gReproGgc': return `${int(v.fieldsChecked)} integer fields, **${int(v.mismatches)} mismatches**, block ${v.block} (${v.sourceArm})`;
    case 'gWindowTrace': return `family \`${JSON.stringify(v.family)}\` read from the committed census; primary ${v.primaryWindowS} s is a member; all of \`${JSON.stringify(v.windowsS)}\` are multiples of ${v.familyMin}`;
    case 'gZoneTrace': return `third ±${num(v.thirdLocalX, 4)} m = \`${v.thirdFormula}\` · band ${num(v.bandAbsY, 4)} m = \`${v.bandFormula}\``;
    case 'gWorld': return `${int(v.genomeViewsChecked)} genome views gene-free · no MT flag · no stage flag · eye null · readback 0`;
    case 'gSeedDisjoint': return `${int(v.walkedBlocks.length)} blocks machine-checked (${v.walkedBlocks.filter((b: Any) => b.kind === 're-walk').length} re-walk, predicate inverted); block ${v.block}`;
    case 'gStatsDisjoint': return `base ${int(v.base)}, minGap ${int(v.minGap)} ≥ 200`;
    case 'gCleanInvocation': return `envN ${String(v.envN)} · capped ${v.capped} · skipFp ${v.skipFp} · routedToGuardBlock ${v.routedToGuardBlock}`;
    case 'gNDerived': return `ran N ${int(v.ranN)} = derived N\\* ${int(v.derivedNStar)}`;
    case 'gAccounting': return `ticks ${v.ticksIdentity} · noOverlap ${v.noOverlap} · zone partition ${v.turnoverPartition} · one-to-one ${v.oneToOne} · per-window identity ${v.windowIdentity} · monotone ${v.attributedMonotoneInWindow}`;
    default: return '';
  }
};
for (const [k, v] of Object.entries(A.gates) as [string, Any][]) {
  o(`| \`${k}\` | ${v.pass ? '**PASS**' : '*** FAIL ***'} | ${gateEvidence(k, v)} |`);
}
o();

/* --------------------------------------------------------------------- */
o('### THE ACCOUNTING IDENTITIES (gate input — ticks, turnovers and goals, not football)');
o();
const acc: Any = C.accounting;
o('```text');
o(`ticks        ${int(acc.totalTicks)} = segment ${int(acc.segmentTicks)} + loose ${int(acc.looseGapTicks)} `
  + `+ deadBall ${int(acc.deadBallTicks)}      ⇒ ${acc.deadBallTicks + acc.segmentTicks + acc.looseGapTicks === acc.totalTicks ? 'ok' : 'BROKEN'}`);
o(`no overlap   assignedTicksSum ${int(acc.assignedTicksSum)} = segmentTicks ${int(acc.segmentTicks)}`
  + `   · spanOrderViolations ${int(acc.spanOrderViolations)}`);
o(`turnovers    walked ${int(acc.turnoversTotal)} = ledgered ${int(acc.turnoversLedgered)} `
  + `= Σ over the six zone cells ${int(acc.turnoversInCellsPrimary)}   ⇒ every turnover in EXACTLY ONE zone`);
o(`goals        conceded ${int(acc.concededGoals)} = score deltas ${int(acc.goalsFromScore)} `
  + `· doubleAttributed ${int(acc.doubleAttributed)}`);
for (const w of acc.perWindow) {
  o(`  @${String(w.windowS).padStart(2)} s      attributed ${String(int(w.attributed)).padStart(5)} `
    + `+ unattributed ${String(int(w.unattributed)).padStart(5)} = ${int(acc.concededGoals)}`
    + `   · Σ cells ${int(w.attributedInCells)}`);
}
o('```');
o();

/* --------------------------------------------------------------------- */
o('### THE N RULE AS EXECUTED (in-probe, from the committed smoke)');
o();
const N: Any = A.frozenDesign.nRule;
o('```text');
o(`rule            ${N.arithmetic}`);
o(`smoke artifact  ${N.smokeArtifact}  (sha256 ${String(N.smokeArtifactSha256).slice(0, 16)}…)`);
o(`rarest-zone events/match ${num(N.rarestZoneEventsPerMatch, 5)}  ⇒ raw ${int(N.nRaw)} → step ${int(N.nStepped)}`);
o(`wall term ${int(N.nWall)} · cap ${int(N.nCap)}   ⇒ N* ${int(N.nStar)}  (${N.bindingTerm} binds; `
  + `projected ${num(N.projectedWallHours, 3)} h)`);
o(`as executed     N ${int(A.result.seeds.n)} · ms/match ${num(A.sizing.msPerMatch, 1)} `
  + `· rarest-zone events/match at battery ${num(A.sizing.rarestZoneEventsPerMatch, 5)}`);
o('```');
o();
const rarest = Math.min(...primary.byThird.map((r: Any) => r.goalsAgainstAttributed as number));
o(`The rarest third-level zone at the primary window carries **${int(rarest)}** attributed `
  + `goals-against against the rule's target of ${int(N.targetRarestZoneEvents)}.`);
o();
o('### Deviations recorded');
o();
for (const [i, d] of (A.deviations as string[]).entries()) o(`${i + 1}. ${d}`);
o();
o('### Registered non-claims (from the artifact)');
o();
for (const [i, d] of (A.registeredNonClaims as string[]).entries()) o(`${i + 1}. ${d}`);
o();
o(`**VERDICT (the probe's own, mechanical):** ${A.verdict}`);
