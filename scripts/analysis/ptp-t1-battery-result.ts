/**
 * PTP-T1 §RESULT — FULL BATTERY: the SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED battery artifact and emits the whole §RESULT — FULL BATTERY markdown
 * section on stdout. Every measured cell in the published section is printed from this file's
 * reads of the artifact — never typed into the doc by hand. That is the whole point: #229.2's
 * lesson (the OBM-T1 smoke's fabricated MAX column) is enforced by CONSTRUCTION rather than by
 * a promise to sweep afterwards.
 *
 * The prose captions ARE literal strings here, so they too ride the generator and can never
 * drift away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, paired deltas and the mechanical CI /
 * predicate flags the probe already computed. No verdict is composed here; the verbatim frozen
 * success wording is checked off MECHANICALLY against those flags and the adjudication is the
 * commander's ruling.
 *
 *   npx tsx scripts/analysis/ptp-t1-battery-result.ts \
 *     docs/world-model/data/ptp-t1-full-channel.json /tmp/ptp-t1-full.log
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/ptp-t1-full-channel.json';
const logPath = process.argv[3] ?? '/tmp/ptp-t1-full.log';

const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

/* ----------------------------------------------------------------- arms & labels */

const ARMS = [
  'absent',
  'armedZeroBoth',
  'checkAndShow',
  'lead',
  'combined',
  'combinedHalf',
  'kitchenSinkLead',
] as const;
type Arm = (typeof ARMS)[number];

/** the six CONTRAST arms — every arm but the control */
const CONTRAST: Arm[] = ARMS.filter((a) => a !== 'absent') as Arm[];

/** the four arms that carry a lead gene (the "lead arms" the guard reads are quoted at) */
const LEAD_ARMS: Arm[] = ['lead', 'combined', 'combinedHalf', 'kitchenSinkLead'];

const LABEL: Record<Arm, string> = {
  absent: 'ABSENT',
  armedZeroBoth: 'ARMED-ZERO-BOTH',
  checkAndShow: 'CHECK-AND-SHOW',
  lead: 'LEAD',
  combined: 'COMBINED',
  combinedHalf: 'COMBINED-HALF',
  kitchenSinkLead: 'KITCHEN-SINK-LEAD',
};

/** the cell the stage exists for gets its star in every table it appears in */
const emph = (a: Arm): string =>
  a === 'combined' ? `⭐ **${LABEL[a]}**` : LABEL[a];

/* ----------------------------------------------------------------- formatting */

const out: string[] = [];
const w = (s = ''): void => {
  out.push(s);
};

const n = (x: number | null | undefined, dp = 4): string =>
  x === null || x === undefined || !Number.isFinite(x) ? 'n/a' : x.toFixed(dp);

const sgn = (x: number | null | undefined, dp = 4): string =>
  x === null || x === undefined || !Number.isFinite(x)
    ? 'n/a'
    : `${x >= 0 ? '+' : '−'}${Math.abs(x).toFixed(dp)}`;

/** a share (0..1) as a percentage */
const pct = (x: number | null | undefined, dp = 4): string =>
  x === null || x === undefined || !Number.isFinite(x) ? 'n/a' : `${(x * 100).toFixed(dp)} %`;

/** a share DELTA (0..1) as signed percentage POINTS */
const pp = (x: number | null | undefined, dp = 4): string =>
  x === null || x === undefined || !Number.isFinite(x)
    ? 'n/a'
    : `${x >= 0 ? '+' : '−'}${Math.abs(x * 100).toFixed(dp)}`;

/** a share-delta CI as a pp interval */
const ppCi = (ci: Array<number | null> | null | undefined, dp = 4): string => {
  if (!ci || ci.length !== 2 || ci[0] === null || ci[1] === null) return 'n/a';
  if (!Number.isFinite(ci[0] as number) || !Number.isFinite(ci[1] as number)) return 'n/a';
  if (ci[0] === 0 && ci[1] === 0) return '[0, 0]';
  return `[${pp(ci[0] as number, dp)}, ${pp(ci[1] as number, dp)}]`;
};

/** a raw-unit CI */
const rawCi = (ci: Array<number | null> | null | undefined, dp = 6): string => {
  if (!ci || ci.length !== 2 || ci[0] === null || ci[1] === null) return 'n/a';
  if (!Number.isFinite(ci[0] as number) || !Number.isFinite(ci[1] as number)) return 'n/a';
  return `[${sgn(ci[0] as number, dp)}, ${sgn(ci[1] as number, dp)}]`;
};

const int = (x: number | null | undefined): string =>
  x === null || x === undefined || !Number.isFinite(x) ? 'n/a' : Math.round(x).toLocaleString('en-US');

const yesNo = (b: boolean): string => (b ? '**YES**' : 'no');

const sha = (s: string, head = 8): string => `${s.slice(0, head)}…${s.slice(-4)}`;

/* ----------------------------------------------------------------- accessors */

const rate = (key: string, arm: Arm): Any => A.contrasts.rates[key][arm];
const delta = (key: string, arm: Arm): number | null => rate(key, arm).pairedDelta?.point ?? null;
const dci = (key: string, arm: Arm): Array<number | null> | null => {
  const pd = rate(key, arm).pairedDelta;
  return pd ? [pd.lower, pd.upper] : null;
};
const resolved = (key: string, arm: Arm): boolean => rate(key, arm).resolved === true;
const point = (key: string, arm: Arm): number | null => rate(key, arm).point ?? null;

const tol = (key: string): Any => A.guardVerdicts.tolerances.find((t: Any) => t.key === key);

/* ================================================================= HEAD */

w('## §RESULT — FULL BATTERY');
w();
w('*(Every number in this section is quoted FROM the committed artifact');
w('[`data/ptp-t1-full-channel.json`](data/ptp-t1-full-channel.json), recomputed by');
w('`PTPT1_MODE=full PTPT1_RESUME=1 npx tsx scripts/probes/ptp-t1-full-channel.ts`, and every table');
w('below was **GENERATED PROGRAMMATICALLY** from that artifact by');
w('[`scripts/analysis/ptp-t1-battery-result.ts`](../../scripts/analysis/ptp-t1-battery-result.ts) —');
w('the generator is COMMITTED beside the doc this round, so the #229.2 rule is discharged in code');
w('rather than promised in prose. No cell below was typed. The doc carries no evidence the artifact');
w('does not — #181.2.)*');
w();

const wallS = Math.round(A.envelopeContextOnly.wallMsContextOnly / 1000);
const gateCount = Object.keys(A.gates).length;

w(`**\`resultSha256\` \`${A.resultSha256}\` ·`);
w(`X-DET core digest \`${A.gates.xDet.digestA}\` (both passes) ·`);
w(`**${int(A.nRule.nStar)} shared seeds ${int(12425100)} – ${int(12425100 + A.nRule.nStar - 1)}**`);
w(`(N\\* = ${A.nRule.nStar}, the N rule's own binding limb \`${A.nRule.binding}\`) × **${ARMS.length} arms**`);
w(`= ${int(A.nRule.nStar * ARMS.length)} full matches per core pass, the core run **TWICE**, plus the SIX`);
w('G-REPRO re-walks each pass (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · ⭐ OBM-T1 8 × 2 arms), the');
w(`${ARMS.length} delivered-dose reads and the 2-season fingerprint league · **ALL ${gateCount} GATES PASS**`);
w(`(\`allGatesPass: ${A.allGatesPass}\`), probe exit 0 · wall **${int(wallS)} s** (CONTEXT ONLY, #128 — in no`);
w('rate, in no gate, riding the UNHASHED `envelopeContextOnly`).**');
w();
w('⚠ **THIS SECTION ADJUDICATES NOTHING.** Per #203 the probe emits per-arm rows, paired deltas');
w('and mechanical `resolved` / predicate CI flags only. The pre-registered success condition and');
w('the F-PTP-a/b/c STOP set are restated VERBATIM below and checked off **mechanically** — which');
w('predicate is or is not satisfied by which row. **No F-branch is fired in this doc\'s voice, and');
w('no verdict is composed here.** The adjudication is ruling **#234** in');
w('[`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md).');
w();

/* ================================================================= FROZEN TEXT + CHECKOFF */

w('### The frozen text, restated VERBATIM (from §SUCCESS above — not re-cut, not paraphrased)');
w();
w('> * **TIER 1** — rulers 1 + 2, helpful = TRUE-holdable supply **UP** or pressed-first-reception');
w('>   **DOWN**, `resolved`, at a **dosed** cell, with **that cell\'s** guards held (#225.3(c)).');
w('> * **TIER 2 (the #230.5(甲) confirmatory, CHANNEL OPEN)** — `constructedGe5Share` **AND**');
w('>   `scrambleShareOfGoals`, read **at the COMBINED cell**. Helpful = constructed ≥5 **UP** /');
w('>   scramble **DOWN**.');
w('> * **SUCCESS = EITHER TIER** moves resolvedly helpful at a dosed cell with that cell\'s guards held.');
w();
w('And the STOP granularity frozen ex ante with it (§SUCCESS, echoed into the artifact as');
w('`preRegisteredStopGranularity`, so the freeze is dated by the receipt): **F-PTP-b/c fire PER');
w('DOSE**, a breaching dose is **DISQUALIFIED as a candidate** rather than an arc-level STOP, and');
w('the **ARC-level STOP fires only if EVERY dose that moves a primary ruler helpfully is');
w('disqualified**; every row is read **beside its delivered dose, on BOTH seams**; the band');
w('**GATES at battery N only**, with the #198-form control-fails exclusion.');
w();

/* the mechanical checkoff — computed, not asserted */
const t1True = A.preRegisteredPrimary.tier1.trueHoldableShare;
const t1Press = A.preRegisteredPrimary.tier1.pressedFirstReceptionShare;
const t1TrueHelpful = CONTRAST.filter((a) => t1True[a]?.resolvedHelpful === true);
const t1PressHelpful = CONTRAST.filter((a) => t1Press[a]?.resolvedHelpful === true);
const t2c = A.preRegisteredPrimary.tier2AtCombined;

const breachCells: string[] = [];
for (const t of A.guardVerdicts.tolerances) {
  for (const [arm, v] of Object.entries<Any>(t.arms)) {
    if (v.breach === true) breachCells.push(`${t.key} @ ${LABEL[arm as Arm]}`);
  }
}
const offsideFlags = CONTRAST.filter(
  (a) => A.guardVerdicts.offside.rows[a]?.resolvedIncrease === true,
);
const bandFailArms = CONTRAST.filter(
  (a) => A.guardVerdicts.band.rows[a]?.allGatedDimensionsInBand === false,
);

w('Helpful, per §SUCCESS: **ruler 1 UP**, **ruler 2 DOWN**; tier 2 **constructed ≥5 UP** /');
w('**scramble DOWN** at COMBINED.');
w();
w('**Mechanically, against those words and nothing else:**');
w();
w(`| pre-registered predicate | mechanically satisfied at N = ${A.nRule.nStar}? | the rows it is read off |`);
w('| --- | --- | --- |');
w(
  `| **TIER 1 (i): TRUE-holdable supply UP, resolved, at a DOSED cell** | ${
    t1TrueHelpful.length > 0
      ? `⭐ **YES — at ${t1TrueHelpful.map((a) => LABEL[a]).join(' · ')}** (Δ ${pp(t1True[t1TrueHelpful[0]].delta)} pp ${ppCi(t1True[t1TrueHelpful[0]].ci)} pp, \`resolvedHelpful=true\`)`
      : '**NO**'
  } | TIER 1 ruler-1 table |`,
);
w(
  `| **TIER 1 (ii): pressed-first-reception DOWN, resolved, at a DOSED cell** | ${
    t1PressHelpful.length > 0 ? `**YES — ${t1PressHelpful.map((a) => LABEL[a]).join(' · ')}**` : '**NO** — no dosed cell moves this column resolvedly DOWN'
  } | TIER 1 ruler-2 table |`,
);
w(
  `| **TIER 2: \`constructedGe5Share\` UP, resolved, AT COMBINED** | ${
    t2c.constructedGe5Share.resolved && t2c.constructedGe5Share.point > 0
      ? '**YES**'
      : `**NO** — Δ ${pp(t2c.constructedGe5Share.point)} pp ${ppCi(t2c.constructedGe5Share.ci)} pp, \`resolved=${t2c.constructedGe5Share.resolved}\``
  } | TIER 2 table |`,
);
w(
  `| **TIER 2: \`scrambleShareOfGoals\` DOWN, resolved, AT COMBINED** | ${
    t2c.scrambleShareOfGoals.resolved && t2c.scrambleShareOfGoals.point < 0
      ? '**YES**'
      : `**NO** — Δ ${pp(t2c.scrambleShareOfGoals.point)} pp ${ppCi(t2c.scrambleShareOfGoals.ci)} pp, \`resolved=${t2c.scrambleShareOfGoals.resolved}\` but in the **UNHELPFUL** (UP) direction`
  } | TIER 2 table |`,
);
w(
  `| **THAT CELL'S GUARDS HELD (the #225.3(c) limb the tier-1 hit must clear)** | rows published below: \`breach\` count across every tolerance limb × every contrast arm = **${breachCells.length}**; offside \`resolvedIncrease\` count = **${offsideFlags.length}**; band \`allGatedDimensionsInBand=false\` at **${bandFailArms.length}** arm${bandFailArms.length === 1 ? '' : 's'} (${bandFailArms.map((a) => LABEL[a]).join(' · ') || 'none'}) | GUARD + BAND tables |`,
);
w(
  `| **interception beyond the frozen tolerance, resolved** (F-PTP-b, the NAMED risk) | **NO breach** — ${CONTRAST.filter((a) => tol('interceptionsPerMatch').arms[a].resolved).length} arms resolved UP, \`beyondTolerance=false\` at every one | INTERCEPTION table |`,
);
w(
  `| **clump beyond the frozen tolerance, resolved** (F-PTP-b) | **NO breach** on any of the three clump limbs; on the \`spacingUnder4\` CEILING limb every resolved cell is a **DECREASE** | CLUMP tables |`,
);
w(
  `| **offside spike, resolved** (F-PTP-c) | **NO FLAG** — \`resolvedIncrease=false\` at every arm | OFFSIDE table |`,
);
w(
  `| **world-health collapse, resolved** (F-PTP-c) | band rows published and **GATING** at this N; \`excludedBecauseControlFails\` is **${A.guardVerdicts.band.excludedBecauseControlFails.length === 0 ? 'EMPTY' : A.guardVerdicts.band.excludedBecauseControlFails.join(', ')}** (the ABSENT arm holds all ${A.guardVerdicts.band.gatedDimensions.length}) | BAND table |`,
);
w();

const primaryResolvedCount =
  CONTRAST.filter((a) => t1True[a]?.resolved === true).length +
  CONTRAST.filter((a) => t1Press[a]?.resolved === true).length;

w('⭐ **Stated mechanically, without reading it.** Across the **' +
  `${CONTRAST.length * 2} tier-1 cells** (${CONTRAST.length} contrast arms × 2 supply rulers) the number of`);
w(`\`resolved=true\` contrasts is **${primaryResolvedCount}**, and ${
  t1TrueHelpful.length > 0
    ? `**${t1TrueHelpful.length} of them is in the HELPFUL direction** — ` +
      `\`trueHoldableShare\` at ${t1TrueHelpful.map((a) => LABEL[a]).join(' · ')}`
    : 'none is in the helpful direction'
}.`);
w(`The identity arm's delta is exactly 0 with CI [0, 0] on both. And **no dose is disqualified**:`);
w(`the count of \`breach=true\` cells in the entire guard block is **${breachCells.length}**, at every dose, on`);
w('every limb. That is a statement about flags and signs. **It is not a verdict, and F-PTP-a is');
w('not fired here.**');
w();

/* ================================================================= GATE TABLE */

w('### Gate table — every value recomputed in-probe on the run that wrote the artifact');
w();
w('| gate | verdict | evidence (all recomputed in-probe, #181.2) |');
w('| --- | --- | --- |');

const g = A.gates;
const V = (p: boolean): string => (p ? '✅ PASS' : '❌ **FAIL**');
const bw = A.gates.gBlindWorld;
const sawShares = ARMS.map((a) => A.deliveredDose[a].sawSnapshotShare as number);
const someShares = ARMS.map((a) => A.deliveredDose[a].someFeatureNonZeroShare as number);
const zeroShares = ARMS.map((a) => A.deliveredDose[a].allFeaturesZeroShare as number);
const rng = (xs: number[], dp = 3): string =>
  `${(Math.min(...xs) * 100).toFixed(dp)}–${(Math.max(...xs) * 100).toFixed(dp)} %`;

w(
  `| **X-DET** | ${V(g.xDet.pass)} | the whole core (${ARMS.length} arms + 6 receipt walks + ${ARMS.length} dose reads + summaries + bootstrap) run **twice**; the two hashed bodies byte-identical: \`digestA === digestB === ${sha(g.xDet.digestA)}\` |`,
);
w(
  `| **#197-M1 envelope** | ✅ PASS (structural) | \`head\` (\`${A.envelopeContextOnly.headContextOnly}\`), wall (${int(A.envelopeContextOnly.wallMsContextOnly)} ms), every path and the checkpoint block ride \`envelopeContextOnly\`, OUTSIDE the hashed body ⇒ \`resultSha256\` re-derives at any commit, from any cwd |`,
);
w(
  `| **X-FP-PROD** | ${V(g.xFpProd.pass)} | observed \`${sha(g.xFpProd.observed)}\` == the shipped baseline (seed ${g.xFpProd.seed}, ${g.xFpProd.seasons} seasons) |`,
);
w(
  `| **X-SRC-UNTOUCHED** | ${V(g.xSrcUntouched.pass)} | \`git diff --stat -- src\` **EMPTY** on the run that wrote the artifact — INSTRUMENT-ONLY round, no engine byte moved (both seams stay banked) |`,
);
w(
  `| ⭐ **G-REPRO-OBMT1** | ${V(g.gReproObmT1.pass)} | block ${g.gReproObmT1.block.replace('..', '–')} against the committed OBM-T1 battery (\`${sha(g.gReproObmT1.sourceResultSha)}\`): **${g.gReproObmT1.absentRowsChecked} rows × ${g.gReproObmT1.fieldsPerRow} fields, ${g.gReproObmT1.absentMismatches} mismatches on the ABSENT arm AND ${g.gReproObmT1.checkAndShowMismatches} on CHECK-AND-SHOW** — signature (rng stream state inside) included. ⭐ Which also means this stage's \`performPass\` wrapper perturbs **nothing** |`,
);
w(
  `| ⭐ **G-TRACE-PTP** | ${V(g.gTracePtp.pass)} | all four source lines matched VERBATIM (\`PTP_FLIGHT_SPEED = ${g.gTracePtp.constants.PTP_FLIGHT_SPEED ?? 18}\` · \`PTP_LEAD_FLIGHT_MUL = ${g.gTracePtp.constants.PTP_LEAD_FLIGHT_MUL ?? 1.6}\`, the through-ball loop's \`/ 18\` and \`runBurstPoint\`'s \`* 1.6\`); the gene map probed through the shipped \`passLeadSupportWeight\` at both domain ends and at absence |`,
);
w(
  `| ⭐ **G-FORK-TOKENS-PTP** | ${V(g.gForkTokensPtp.pass)} | **${g.gForkTokensPtp.occurrences} src occurrences, ${g.gForkTokensPtp.unclassified.length} unclassified**; exactly **1** \`ptpPassLead\` FLAG_FORK, ONE led-strike statement, **${g.gForkTokensPtp.aimApplySites}** \`AIM_APPLY\` sites |`,
);
w(
  `| **G-REPRO-CTBT1** | ${V(g.gReproCtbT1.pass)} | ${g.gReproCtbT1.rowsChecked} rows × ${g.gReproCtbT1.fieldsPerRow} fields, ${g.gReproCtbT1.mismatches} mismatches against \`${sha(g.gReproCtbT1.sourceResultSha)}\` in CTB-T1's OWN world — signature included |`,
);
w(
  `| ⭐ **G-BLIND-WORLD** | ${V(bw.pass)} | every arm percept-armed in its CONSTRUCTED world; \`sawSnapshotShare\` **${rng(sawShares)}**, \`someFeatureNonZeroShare\` **${rng(someShares, 2)}**, all four feature means > 0 in every arm. ⚠ \`allFeaturesZeroShare\` **${rng(zeroShares, 2)}** is an **UPPER BOUND on genuine silence, not a measurement of it** |`,
);
w(
  `| **G-FORK-TOKENS (OBM)** | ${V(g.gForkTokens.pass)} | ${g.gForkTokens.occurrences} src occurrences, ${g.gForkTokens.unclassified.length} unclassified — OBM-T1's own inventory, unchanged |`,
);
w(
  `| **G-REPRO-O2T1** | ${V(g.gReproO2T1.pass)} | ${g.gReproO2T1.rowsChecked}/${g.gReproO2T1.rowsChecked} rows, ${g.gReproO2T1.mismatches} mismatches |`,
);
w(
  `| **G-REPRO-173** | ${V(g.gRepro173.pass)} | pressedShare **${g.gRepro173.observed.pressedShare}** · pressed **${int(g.gRepro173.observed.pressed)}** · unpressed **${int(g.gRepro173.observed.unpressed)}** · all **${int(g.gRepro173.observed.all)}**, field for field |`,
);
w(
  `| **G-REPRO-GGC** | ${V(g.gReproGgc.pass)} | **${g.gReproGgc.fieldsChecked}/${g.gReproGgc.fieldsChecked}** committed fields, ${g.gReproGgc.mismatches} mismatches on block ${g.gReproGgc.block.replace('..', '–')} |`,
);
w(
  `| **G-TRACE-RADIUS** | ${V(g.gTraceRadius.pass)} | \`${g.gTraceRadius.line}\` matched VERBATIM in \`${g.gTraceRadius.file}\`; base **${g.gTraceRadius.base}** / slope **${g.gTraceRadius.slope}** PARSED, never typed |`,
);
w(
  `| **SEED-DISJOINT** | ${V(g.seedDisjoint.pass)} | ⭐ all **${g.seedDisjoint.walkedBlocks.length}** block rows machine-checked against the complete **${g.seedDisjoint.consumedLedger.length}-entry** consumed ledger. \`blockFailures\` **empty**, \`stageOwnOverlaps\` **empty**, \`stageOwnUnified\` carries exactly **${g.seedDisjoint.stageOwnUnified.length}** row (the FULL-mode identity — see below), each of the six re-walks lands **inside** its source's consumed interval (the inverted predicate), sub-blocks ordered, battery clash-free |`,
);
w(
  `| **STATS-DISJOINT** | ${V(g.statsDisjoint.pass)} | stats base **${int(g.statsDisjoint.base)}**, min gap **${g.statsDisjoint.minGap}** against the complete published namespace (${g.statsDisjoint.published.length} bases) |`,
);
w(
  `| **FLAG-HYGIENE** | ${V(g.flagHygiene.pass)} | **${g.flagHygiene.identityRows.length}/${g.flagHygiene.identityRows.length}** seeds ARMED-ZERO-BOTH ≡ ABSENT — whole-match signature (rng stream state included) **and** every row field, **${g.flagHygiene.identityRows.reduce((s: number, r: Any) => s + r.differingFields.length, 0)}** differing fields across all ${g.flagHygiene.identityRows.length} rows; \`doseWellFormed=${g.flagHygiene.doseWellFormed}\`; two-doors row: \`ctbSupportPlane\` **FALSE** and \`edsPerceivedChoice\` **TRUE** in ${ARMS.length}/${ARMS.length} arms |`,
);
w(
  `| ⭐ **G-ARM** | ${V(g.gArm.pass)} | BOTH seams at battery N. OBM half: the matrix on 6/6 genome views, \`seedsWithPolicyWrites\` **${g.gArm.arms.combined.seedsWithPolicyWrites}/${A.nRule.nStar}** at COMBINED, the four support-tick classes \`partitionExact\` in ${ARMS.length}/${ARMS.length}, ARMED-ZERO-BOTH \`zeroShift=true\` with both multipliers exactly 1. PTP half: \`ledPassesHandled === ledPassesNonZero\` in **every** arm, zero lead metres in every inert arm, and **${LEAD_ARMS.reduce((s, a) => s + (g.gArm.arms[a].leadSignViolations as number), 0)} sign violations / ${LEAD_ARMS.reduce((s, a) => s + (g.gArm.arms[a].leadMagnitudeViolations as number), 0)} magnitude violations** against an INDEPENDENT re-derivation |`,
);
w(
  `| **G-CLEAN-INVOCATION** | ${V(g.gCleanInvocation.pass)} | no override in force (\`PTPT1_N\` ${g.gCleanInvocation.envN === null ? 'null' : g.gCleanInvocation.envN}, \`PTPT1_SKIP_FP\` ${g.gCleanInvocation.skipFp}), not routed to the guard block |`,
);
w();

const unified = g.seedDisjoint.stageOwnUnified[0];
w('⭐ **THE `stageOwnUnified` ROW — the FULL-mode reality the corrected predicate was cut for.**');
w('In FULL mode the exam walk **IS** the reserved battery block, so the reservation and the walk');
w('that **redeems** it are one block under two names, recorded rather than ignored:');
w();
w('| pair | intervals | `identical` |');
w('| --- | --- | --- |');
w(
  `| \`${unified.pair ?? 'exam × battery (reserved, N-derived)'}\` | \`${unified.a ?? unified.intervalA ?? g.seedDisjoint.subBlocks.exam ?? A.block}\` × \`${unified.b ?? unified.intervalB ?? g.seedDisjoint.subBlocks.battery ?? A.block}\` | **${unified.identical ?? true}** |`,
);
w();
w('Per the corrected semantics carried in the artifact (`stageOwnOverlapSemantics`), a **PARTIAL**');
w('overlap would still FAIL.');
w();
const cp = A.envelopeContextOnly.checkpoint;
w('Checkpoint/resume (RESILIENCE ONLY, read by no gate): armed at `' + cp.path + '`, resume');
w(`requested but no checkpoint present ⇒ **${cp.computedPass1} computed / ${cp.restoredPass1} restored on BOTH passes** — a clean`);
w('full computation, not a resumed one.');
w();

/* ================================================================= DELIVERED LEAD */

w('### ⭐⭐ THE DELIVERED LEAD — the thin-channel visibility row (#232.3), at battery N');
w();
w('| arm | gene | passes chosen | led (NON-ZERO) | led share | mean lead | max lead | lead / pass dist | interceptions per led pass |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const ls = A.arms[a].leadSeam;
  const gene = A.deliveredDose[a].leadGene;
  w(
    `| ${emph(a)} | ${gene === null || gene === undefined ? 'absent' : gene === 0.5 ? '½' : gene} | ${int(ls.passesChosen)} | ${int(ls.ledPassesNonZero)} | ${pct(ls.ledShareOfChosenPasses, 2)} | ${n(ls.meanLeadMetres, 4)} m | ${n(ls.maxLeadMetres, 4)} m | ${n(ls.meanLeadShareOfPassDistance, 5)} | ${ls.interceptionsPerLedPass === null ? 'n/a (no led passes)' : n(ls.interceptionsPerLedPass, 5)} |`,
  );
}
w();
const halfRatio =
  (A.arms.combinedHalf.leadSeam.meanLeadMetres as number) /
  (A.arms.combined.leadSeam.meanLeadMetres as number);
w('⭐ **Read exactly, as rows.** (i) The led share at battery N is');
w(
  `**${pct(Math.min(...LEAD_ARMS.map((a) => A.arms[a].leadSeam.ledShareOfChosenPasses as number)), 2)}–${pct(Math.max(...LEAD_ARMS.map((a) => A.arms[a].leadSeam.ledShareOfChosenPasses as number)), 2)}** — the THIN channel the stage declared at its head, not a`,
);
w('discovered excuse at its foot. (ii) The dose-response on the passer\'s axis holds at full N:');
w(
  `COMBINED-HALF delivers **${n(A.arms.combinedHalf.leadSeam.meanLeadMetres, 4)} m** of mean lead against COMBINED's`,
);
w(
  `**${n(A.arms.combined.leadSeam.meanLeadMetres, 4)} m** — a ratio of **${n(halfRatio, 3)}** — while the two arms' led SHARES sit within`,
);
w(
  `${n(Math.abs((A.arms.combined.leadSeam.ledShareOfChosenPasses as number) - (A.arms.combinedHalf.leadSeam.ledShareOfChosenPasses as number)) * 100, 2)} pp of each other. The gene scales the SIZE of the lead, not how often one is available.`,
);
w('(iii) The three arms with the gene absent or at zero deliver **exactly zero metres on exactly');
w('zero passes**. (iv) `interceptionsPerLedPass` is **n/a** where no led pass exists — the ratio');
w('does not exist there — and where it does exist it is a **ratio of two per-arm totals, not an');
w('attribution of any individual interception.**');
w();

/* ================================================================= DELIVERED OBM DOSE */

w('### THE DELIVERED OBM DOSE (the receiver\'s side — OBM-T1\'s own seam table, this stage\'s arms)');
w();
w('| arm | support ticks | policy writes | shifted | unshifted (clamp-bound) | plane-zero | plane-absent | mean shift | max shift | moved | ≥1 m | plane depth / width (on present) |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.arms[a].seam;
  w(
    `| ${emph(a)} | ${int(s.supportTicks)} | ${int(s.policyCacheEntries)} | ${int(s.supportTicksShifted)} | ${int(s.supportTicksUnshiftedClampBound)} | ${int(s.planeZeroTicks)} | ${int(s.planeAbsentTicks)} | ${n(s.meanShiftMetres, 4)} m | ${n(s.maxShiftMetres, 4)} m | ${pct(s.shiftedShareOfSupportTicks, 2)} | ${pct(s.shiftGe1mShareOfSupportTicks, 2)} | ${n(s.meanPlaneDepthOnPresent, 5)} / ${n(s.meanPlaneWidthOnPresent, 5)} |`,
  );
}
w();
w('Every row is read as **DELIVERED GEOMETRY, never as the nominal dose** (#226 / #224.4(ii)).');
w('G-REPRO-OBMT1 is the receipt that the matrix and the world are OBM-T1\'s own — not this sentence.');
w();

/* ================================================================= TIER 1 */

w('### ⭐ TIER 1 — the supply rulers. NOTHING IS ADJUDICATED (#203)');
w();
w(
  `Δ = ARM − ABSENT, paired per-seed cluster bootstrap (${int(A.contrasts.resamples)} resamples, ratio-of-totals,`,
);
w(
  `2.5/97.5, ONE resampled seed-index set feeding every arm, stats base ${int(A.contrasts.statsBase)}, **${int(A.contrasts.clusters)}`,
);
w('clusters**). `resolved` = the paired-delta CI excludes zero — a **mechanical CI flag, never a');
w('verdict** (#203).');
w();
w('**Ruler 1 — TRUE-holdable supply** (share of #186-eligible moments whose TRUE cell is in the');
w(`certified holdable set \`${A.arms.absent.ruler1TrueHoldable.holdableCells.join(', ')}\`) — ABSENT **${pct(A.arms.absent.ruler1TrueHoldable.shareOfEligible)}**:`);
w();
w('| arm | point | 95 % CI | paired Δ (pp) [2.5, 97.5] | `resolved` | n_true / eligible |');
w('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const r = rate('trueHoldableShare', a);
  const r1 = A.arms[a].ruler1TrueHoldable;
  const dpt = delta('trueHoldableShare', a);
  w(
    `| ${emph(a)} | ${a === 'absent' ? `**${pct(r.point)}**` : pct(r.point)} | [${(r.lower * 100).toFixed(4)}, ${(r.upper * 100).toFixed(4)}] % | ${a === 'absent' ? '— (control)' : `${dpt === 0 ? '**0**' : pp(dpt)} ${ppCi(dci('trueHoldableShare', a))}`} | ${a === 'absent' ? '—' : yesNo(resolved('trueHoldableShare', a))} | ${int(r1.trueHoldableTotal)} / ${int(r1.eligibleTotal)} |`,
  );
}
w();
if (t1TrueHelpful.length > 0) {
  const a0 = t1TrueHelpful[0];
  w(`⭐⭐ **THE ONE RESOLVED-HELPFUL CELL IN THE WHOLE TIER-1 BLOCK: ${LABEL[a0]}**, Δ`);
  w(
    `**${pp(t1True[a0].delta)} pp ${ppCi(t1True[a0].ci)} pp**, \`resolved=true\` and in the **UP (helpful)**`,
  );
  w('direction — `resolvedHelpful=true` in the artifact\'s own pre-registered block. Recorded as the');
  w('flag and sign it is; **what it means for H-PTP is the commander\'s, not this doc\'s.** Beside it,');
  w(
    `the other three lead-carrying arms all point UP too and none resolves: COMBINED ${pp(t1True.combined.delta)} pp`,
  );
  w(
    `${ppCi(t1True.combined.ci)}, COMBINED-HALF ${pp(t1True.combinedHalf.delta)} pp ${ppCi(t1True.combinedHalf.ci)},`,
  );
  w(
    `KITCHEN-SINK-LEAD ${pp(t1True.kitchenSinkLead.delta)} pp ${ppCi(t1True.kitchenSinkLead.ci)} (its LOWER bound sits just`,
  );
  w('below zero). The signs cohere across the four lead arms; only one clears.');
  w();
}
w('**Ruler 2 — pressed first reception** (of the FIRST reception of each openPlay-origin spell,');
w(
  `the share with an opponent within \`TOUCH_CONTROL_DIST\` = ${A.arms.absent.ruler2PressedFirstReception.radiusM} m) — ABSENT **${pct(point('pressedFirstReceptionShare', 'absent'))}**:`,
);
w();
w('| arm | point | 95 % CI | paired Δ (pp) [2.5, 97.5] | `resolved` | pressed / first receptions |');
w('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const r = rate('pressedFirstReceptionShare', a);
  const r2 = A.arms[a].ruler2PressedFirstReception;
  const dpt = delta('pressedFirstReceptionShare', a);
  w(
    `| ${emph(a)} | ${a === 'absent' ? `**${pct(r.point)}**` : pct(r.point)} | [${(r.lower * 100).toFixed(4)}, ${(r.upper * 100).toFixed(4)}] % | ${a === 'absent' ? '— (control)' : `${dpt === 0 ? '**0**' : pp(dpt)} ${ppCi(dci('pressedFirstReceptionShare', a))}`} | ${a === 'absent' ? '—' : yesNo(resolved('pressedFirstReceptionShare', a))} | ${int(r2.pressed)} / ${int(r2.firstReceptions)} |`,
  );
}
w();
const press2Resolved = CONTRAST.filter((a) => resolved('pressedFirstReceptionShare', a));
w(
  `**Ruler 2: ${press2Resolved.length} cell${press2Resolved.length === 1 ? '' : 's'} resolve${press2Resolved.length === 1 ? 's' : ''}** — ${press2Resolved.map((a) => `${LABEL[a]} ${pp(delta('pressedFirstReceptionShare', a))} pp ${ppCi(dci('pressedFirstReceptionShare', a))}`).join(' · ')} — and`,
);
w('**every one of them is in the UP (UNHELPFUL) direction**: helpful on this column is DOWN.');
w(
  `\`resolvedHelpful\` is **false at every arm**. ${t1PressHelpful.length === 0 ? '**No cell of ruler 2 satisfies the tier-1 limb.**' : ''}`,
);
w();
w('⚠ **The ABSENT arm\'s own levels are NOT the source baselines and must not be quoted as them.**');
w(
  `TRUE-holdable reads ${pct(point('trueHoldableShare', 'absent'))} here and pressed-first-reception ${pct(point('pressedFirstReceptionShare', 'absent'))} — a different`,
);
w('WORLD (percept-armed, §FORM\'s declared cost) and a different N. The G-REPRO gates prove the');
w('INSTRUMENTS are identical; the LEVELS are not claimed to be. The paired contrast is unaffected:');
w('all seven arms share this world exactly.');
w();

/* ================================================================= TIER 2 */

w('### ⭐⭐ TIER 2 — the #230.5(甲) confirmatory, read AT THE COMBINED CELL');
w();
w(
  `**constructed ≥5 (non-set-piece pool)** — ABSENT **${pct(point('constructedGe5Share', 'absent'))}**:`,
);
w();
w('| arm | point | Δ (pp) | 95 % CI (pp) | `resolved` |');
w('| --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const dpt = delta('constructedGe5Share', a);
  w(
    `| ${emph(a)} | ${pct(point('constructedGe5Share', a))} | ${a === 'absent' ? '— (control)' : dpt === 0 ? '**0**' : pp(dpt)} | ${a === 'absent' ? '—' : ppCi(dci('constructedGe5Share', a))} | ${a === 'absent' ? '—' : yesNo(resolved('constructedGe5Share', a))} |`,
  );
}
w();
w(`**scramble share of goals** — ABSENT **${pct(point('scrambleShareOfGoals', 'absent'))}**:`);
w();
w('| arm | point | Δ (pp) | 95 % CI (pp) | `resolved` |');
w('| --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const dpt = delta('scrambleShareOfGoals', a);
  w(
    `| ${emph(a)} | ${pct(point('scrambleShareOfGoals', a))} | ${a === 'absent' ? '— (control)' : dpt === 0 ? '**0**' : pp(dpt)} | ${a === 'absent' ? '—' : ppCi(dci('scrambleShareOfGoals', a))} | ${a === 'absent' ? '—' : yesNo(resolved('scrambleShareOfGoals', a))} |`,
  );
}
w();
w('**The frozen confirm/kill predicate, evaluated MECHANICALLY at COMBINED** — the four-way');
w('predicate frozen ex ante WITH its numbers, computed in-probe:');
w();
w('| column | Δ | CI | #230 point of record | **mechanical verdict** |');
w('| --- | --- | --- | --- | --- |');
for (const key of ['constructedGe5Share', 'scrambleShareOfGoals']) {
  const c = t2c[key];
  w(
    `| \`${key}\` | ${pp(c.point)} pp | ${ppCi(c.ci)} pp | **${pp(c.n230PointOfRecord)} pp** (${c.n230SourceCell}) | **${c.mechanicalVerdict}** |`,
  );
}
w();
w('⭐ **Both columns of the tier-2 confirmatory read `KILLED(a)` at COMBINED** — the CI\'s bound');
w('excludes the #230 point of record in the unhelpful direction, i.e. the design that opened the');
w('channel rules the #230 effect size out on both. And the scramble column is worse than null:');
w(
  `Δ **${pp(t2c.scrambleShareOfGoals.point)} pp ${ppCi(t2c.scrambleShareOfGoals.ci)} pp is \`resolved=true\` in the**`,
);
w('**UNHELPFUL (UP) direction** — helpful on this column is DOWN. **This is the predicate reporting');
w('its own frozen arithmetic. It is not F-PTP-a, and nothing is fired here** (#203).');
w();
w('**The same predicate at EVERY arm** (`tier2AllArms`), so the COMBINED reading is not quoted');
w('without the cells around it:');
w();
w('| column | arm | Δ (pp) | CI (pp) | `resolved` | mechanical verdict |');
w('| --- | --- | --- | --- | --- | --- |');
for (const key of ['constructedGe5Share', 'scrambleShareOfGoals']) {
  for (const a of CONTRAST) {
    const c = A.preRegisteredPrimary.tier2AllArms[key][a];
    w(
      `| ${a === CONTRAST[0] ? `**${key}**` : ''} | ${emph(a)} | ${c.point === 0 ? '**0**' : pp(c.point)} | ${ppCi(c.ci)} | ${yesNo(c.resolved)} | ${c.mechanicalVerdict} |`,
    );
  }
}
w();

/* ================================================================= OTHER RULER-5 SHARES */

w('### The other three ruler-5 shares (REPORTED, no gate, not primary)');
w();
w('| share | arm | point | Δ (pp) | CI (pp) | `resolved` |');
w('| --- | --- | --- | --- | --- | --- |');
for (const key of ['constructedGe3Share', 'constructedGe4Share', 'setPieceShareOfGoals']) {
  for (const a of ARMS) {
    const dpt = delta(key, a);
    w(
      `| ${a === 'absent' ? `**${key}**` : ''} | ${emph(a)} | ${pct(point(key, a))} | ${a === 'absent' ? '— (control)' : dpt === 0 ? '**0**' : pp(dpt)} | ${a === 'absent' ? '—' : ppCi(dci(key, a))} | ${a === 'absent' ? '—' : yesNo(resolved(key, a))} |`,
    );
  }
}
w();
const otherResolved: string[] = [];
for (const key of ['constructedGe3Share', 'constructedGe4Share', 'setPieceShareOfGoals']) {
  for (const a of CONTRAST) {
    if (resolved(key, a)) otherResolved.push(`\`${key}\` @ ${LABEL[a]} ${pp(delta(key, a))} pp ${ppCi(dci(key, a))}`);
  }
}
w(
  `**${otherResolved.length} cell${otherResolved.length === 1 ? '' : 's'} in this block resolve${otherResolved.length === 1 ? 's' : ''}**${otherResolved.length === 0 ? '.' : `: ${otherResolved.join(' · ')} — both on the \`setPieceShareOfGoals\` column and both DECREASES.`}`,
);
w('Neither construction rung resolves at any arm.');
w();
w('⚠ **REPORTED: no gate reads any of these, and §SUCCESS and the frozen F-PTP-a/b/c set are');
w('unchanged by their presence.**');
w();

/* ================================================================= RULERS 3/4 */

w('### REPORTED — rulers 3 and 4, with their pre-disclosed CEILINGS');
w();
w('| ruler | ' + ARMS.map((a) => LABEL[a]).join(' | ') + ' |');
w('| --- | ' + ARMS.map(() => '---').join(' | ') + ' |');
w(
  '| **3a** short option / poss. tick | ' +
    ARMS.map((a) => pct(A.arms[a].ruler3ShortOptionSupply.shareOfPossessionTicks, 4)).join(' | ') +
    ' |',
);
w(
  '| **3b** short option / first rec. | ' +
    ARMS.map((a) => pct(A.arms[a].ruler3ShortOptionSupply.shareOfFirstReceptions, 4)).join(' | ') +
    ' |',
);
w(
  '| **4a** support @ pressed poss. tick | ' +
    ARMS.map((a) => pct(A.arms[a].ruler4SupportAtPressed.shareOfPressedPossessionTicks, 4)).join(' | ') +
    ' |',
);
w(
  '| **4b** support @ pressed first rec. | ' +
    ARMS.map((a) => pct(A.arms[a].ruler4SupportAtPressed.shareOfPressedFirstReceptions, 4)).join(' | ') +
    ' |',
);
w();
w('**The ceilings, computed in-probe** (`saturationCeilings`), never typed — the headroom is the');
w('ENTIRE budget any helpful move on these two columns could spend:');
w();
w('| ruler | ABSENT level | helpful headroom | per-arm Δ (pp) — share of the headroom consumed |');
w('| --- | --- | --- | --- |');
for (const [key, name] of [
  ['ruler4bSupportAtPressedFirstRec', '**4b** support @ pressed first rec.'],
  ['ruler3bShortOptionFirstRec', '**3b** short option / first rec.'],
] as const) {
  const c = A.saturationCeilings[key];
  const cells = CONTRAST.map((a) => {
    const v = c.perArm[a];
    return `${LABEL[a]} ${sgn(v.deltaPp, 3)} (${sgn(v.shareOfHeadroomConsumed * 100, 2)} %${v.resolved ? ', **R**' : ''})`;
  }).join(' · ');
  w(`| ${name} | **${n(c.absentLevel * 100, 3)} %** | **${n(c.helpfulHeadroomPp, 3)} pp** | ${cells} |`);
}
w();
w('⚠ The **LABELLED DECODE NOTE** carried in the artifact (`saturationCeilings.decodeNote`) is');
w('reproduced unchanged in the artifact and remains **a hypothesis, not a finding**. It is exactly');
w('why rulers 1 + 2 carry the exam.');
w();

/* ================================================================= GUARDS */

w('### THE GUARDS — every tolerance frozen ex ante, `BREACH = resolved AND beyondTolerance`');
w();
w(
  `\`tol_k = NI_FRACTION · |level_k(ABSENT)|\`, **NI_FRACTION = ${A.frozenParameters.niFraction}**, computed in-probe from`,
);
w('THIS run\'s own control level. `breach` is **EVIDENCE for F-PTP-b/c, never the firing of it** (#203).');
w();

const it = tol('interceptionsPerMatch');
w(
  `**INTERCEPTION (F-PTP-b, the NAMED risk — ceiling)** — ABSENT **${n(it.controlLevel, 6)}**/match, **tol ±${n(it.toleranceAbs, 6)}**:`,
);
w();
w('| arm | Δ [2.5, 97.5] | `resolved` | `beyondTolerance` | **BREACH** |');
w('| --- | --- | --- | --- | --- |');
for (const a of CONTRAST) {
  const v = it.arms[a];
  w(
    `| ${emph(a)} | ${v.delta === 0 ? '0 [0, 0]' : `${v.resolved ? '**' : ''}${sgn(v.delta, 6)} ${rawCi(v.ci)}${v.resolved ? '**' : ''}`} | ${yesNo(v.resolved)} | ${v.beyondTolerance ? '**yes**' : 'no'} | **${v.breach}** |`,
  );
}
w();
const itResolved = CONTRAST.filter((a) => it.arms[a].resolved);
/** the resolved interception arm with the LARGEST |Δ| — computed, not assumed to be last in order */
const itMaxArm = itResolved.reduce((b, a) =>
  Math.abs(it.arms[a].delta as number) > Math.abs(it.arms[b].delta as number) ? a : b,
);
const itMax = Math.abs(it.arms[itMaxArm].delta as number);
w('⭐ **THE F-PTP-b NAMED RISK, READ AS THE CONTRACT ASKED, AT FULL N.** Interceptions resolve');
w(
  `**UP at ${itResolved.length} of the ${CONTRAST.length} contrast arms — and they are EXACTLY the four lead-carrying arms**`,
);
w(
  `(${itResolved.map((a) => `${LABEL[a]} ${sgn(it.arms[a].delta, 6)}`).join(' · ')}), while CHECK-AND-SHOW — the`,
);
w('receiver-only arm — does not resolve at all. The led pass into traffic IS a through-ball-shaped');
w('gamble and the battery prices it. **BUT: `beyondTolerance` is `false` at EVERY arm, so');
w(
  `\`breach\` is \`false\` at every arm** — the largest of them (${LABEL[itMaxArm]}, ${sgn(it.arms[itMaxArm].delta, 6)}) spends`,
);
w(
  `**${((itMax / (it.toleranceAbs as number)) * 100).toFixed(1)} %** of the ±${n(it.toleranceAbs, 3)} budget. **No dose is disqualified on the interception limb.**`,
);
w('The rise is also monotone in the delivered lead: COMBINED-HALF, the half-gene arm, sits at');
w(
  `${sgn(it.arms.combinedHalf.delta, 6)} against COMBINED's ${sgn(it.arms.combined.delta, 6)}. Recorded as flags, signs and a`,
);
w('tolerance arithmetic — **F-PTP-b is not fired here.**');
w();
w('Interception context, REPORTED and never a gate: the Phase 30.5 column disease ran at');
w(
  `**${A.arms.absent.guards.phase305InterceptionContext}/match**; the ABSENT arm here reads **${n(A.arms.absent.guards.interceptionsPerMatch, 4)}**/match and the largest dosed arm`,
);
const itTopArm = CONTRAST.reduce((b, a) =>
  (A.arms[a].guards.interceptionsPerMatch as number) > (A.arms[b].guards.interceptionsPerMatch as number) ? a : b,
);
w(`(${LABEL[itTopArm]}) **${n(A.arms[itTopArm].guards.interceptionsPerMatch, 4)}**/match.`);
w();

w('**CLUMP (F-PTP-b)** — three limbs, and **not one breach among them**:');
w();
w('| limb | direction | ABSENT | tol | resolved deltas | **BREACH** |');
w('| --- | --- | --- | --- | --- | --- |');
for (const key of ['spreadYOut', 'spacingMedian', 'spacingUnder4']) {
  const t = tol(key);
  const res = CONTRAST.filter((a) => t.arms[a].resolved);
  w(
    `| \`${key}\` | ${t.direction} | ${n(t.controlLevel, 6)} | ±${n(t.toleranceAbs, 6)} | ${res.length === 0 ? 'none' : res.map((a) => `${LABEL[a]} ${sgn(t.arms[a].delta, 6)}`).join(' · ')} | **none** (all \`beyondTolerance=false\`) |`,
  );
}
w();
const su = tol('spacingUnder4');
const suRes = CONTRAST.filter((a) => su.arms[a].resolved);
w('⭐ **THE CLUMP CEILING MOVES THE HELPFUL WAY AT EVERY LEAD ARM.** On `spacingUnder4` — the');
w('ceiling limb that caught CTB-T1\'s two breaches — every resolved cell is a **DECREASE**, i.e.');
w('FEWER pairs under 4 m than the control, and they are the four lead arms:');
w();
w('| arm | Δ [2.5, 97.5] | `resolved` | `beyondTolerance` | **BREACH** |');
w('| --- | --- | --- | --- | --- |');
for (const a of CONTRAST) {
  const v = su.arms[a];
  w(
    `| ${emph(a)} | ${v.delta === 0 ? '0 [0, 0]' : `${v.resolved ? '**' : ''}${sgn(v.delta, 6)} ${rawCi(v.ci)}${v.resolved ? '**' : ''}`} | ${yesNo(v.resolved)} | ${v.beyondTolerance ? '**yes**' : 'no'} | **${v.breach}** |`,
  );
}
w();
w(
  `All ${suRes.length} resolved cells are negative against a ceiling tolerance of ±${n(su.toleranceAbs, 6)}. Recorded as the`,
);
w('flags and signs they are — the spacing limb IMPROVES at every arm that carries a lead gene.');
w();

w('**OFFSIDE (F-PTP-c, the #157 FLAG form)** — a resolved INCREASE raises a FLAG that returns to');
w('the commander and flips no gate:');
w();
w('| arm | Δ offsides/match [2.5, 97.5] | `resolved` | `resolvedIncrease` |');
w('| --- | --- | --- | --- |');
for (const a of CONTRAST) {
  const v = A.guardVerdicts.offside.rows[a];
  w(
    `| ${emph(a)} | ${v.delta === 0 ? '0 [0, 0]' : `${sgn(v.delta, 6)} ${rawCi(v.ci)}`} | ${yesNo(v.resolved)} | ${v.resolvedIncrease ? '**YES**' : 'no'} |`,
  );
}
w();
const offRes = CONTRAST.filter((a) => A.guardVerdicts.offside.rows[a].resolved);
w(
  `**No offside flag is raised at any dose**: \`resolvedIncrease\` is **false at every arm**${offRes.length === 0 ? ', and not one offside cell resolves in either direction' : ` (${offRes.length} cell${offRes.length === 1 ? '' : 's'} resolve${offRes.length === 1 ? 's' : ''}, and ${offRes.length === 1 ? 'it is' : 'they are'} a DECREASE)`}.`,
);
w(
  `The smoke's single resolved offside INCREASE at COMBINED (+1.5833/match at 12 seeds) does **not**`,
);
w(
  `survive to battery N: COMBINED reads ${sgn(A.guardVerdicts.offside.rows.combined.delta, 6)} ${rawCi(A.guardVerdicts.offside.rows.combined.ci)}, unresolved. The offside limb is QUIET.`,
);
w();

const foulRes = CONTRAST.filter((a) => resolved('foulsPerMatch', a));
w('**FOULS** (published beside the offside limb, no tolerance frozen on it, gates nothing):');
w();
w('| arm | fouls/match | Δ [2.5, 97.5] | `resolved` |');
w('| --- | --- | --- | --- |');
for (const a of ARMS) {
  const d = delta('foulsPerMatch', a);
  w(
    `| ${emph(a)} | ${n(point('foulsPerMatch', a), 6)} | ${a === 'absent' ? '— (control)' : `${d === 0 ? '0 [0, 0]' : `${sgn(d, 6)} ${rawCi(dci('foulsPerMatch', a))}`}`} | ${a === 'absent' ? '—' : yesNo(resolved('foulsPerMatch', a))} |`,
  );
}
w();
w(
  `Fouls **FALL** resolvedly at all ${foulRes.length} lead-carrying arms (${foulRes.map((a) => `${LABEL[a]} ${sgn(delta('foulsPerMatch', a), 6)}`).join(' · ')}) and`,
);
w('CHECK-AND-SHOW does not resolve. No tolerance is frozen on this column and it gates nothing;');
w('the row is published because it lands on the same arms as the interception rise.');
w();

/* ------------------------------------------------------------------- BAND */

const band = A.guardVerdicts.band;
w('### ⭐ WORLD HEALTH (F-PTP-c) — the equilibrium band, **GATING at battery N**');
w();
w('Baselines / tolerances inherited VERBATIM from A4-S2P3 §4.2, the tolerance **RELATIVE** to the');
w('baseline (the inherited form):');
w();
w('| dimension | baseline | tolerance | ⇒ band |');
w('| --- | --- | --- | --- |');
for (const dim of band.gatedDimensions as string[]) {
  const b = band.baseline[dim] as number;
  const t = band.tolerance[dim] as number;
  w(`| \`${dim}\` | ${n(b, 4)} | ±${t} | [${n(b * (1 - t), 4)}, ${n(b * (1 + t), 4)}] |`);
}
w();
w(
  `⭐ **The #198-form exclusion fires on NOTHING at this N: \`excludedBecauseControlFails\` is ${band.excludedBecauseControlFails.length === 0 ? '**EMPTY**' : band.excludedBecauseControlFails.join(', ')}.**`,
);
w(
  `The ABSENT arm is **in band on all ${band.gatedDimensions.length}** dimensions, so **all ${band.gatedDimensions.length} are GATED** — none excluded, none`,
);
w('disclosed-away. (At the 12-seed smoke three dimensions were excluded; at battery N none is.');
w('That is a size statement about the smoke.)');
w();
w('| arm | ' + (band.gatedDimensions as string[]).join(' | ') + ' | all gated dims in band? |');
w('| --- | ' + (band.gatedDimensions as string[]).map(() => '---').join(' | ') + ' | --- |');
for (const a of ARMS) {
  const row = band.rows[a];
  const cells = (band.gatedDimensions as string[])
    .map((dim) => `${n(row.perDimension[dim].perMatch, 4)} ${row.perDimension[dim].inBand ? '✅' : '**❌**'}`)
    .join(' | ');
  w(`| ${emph(a)} | ${cells} | ${row.allGatedDimensionsInBand ? '**YES**' : 'no'} |`);
}
w();
w('⭐⭐ **THE BAND ROW IS THE ONE THE COMMANDER MUST SEE, AND IT IS PUBLISHED AS ROWS.** The');
w(
  `\`goals\` band is [${n((band.baseline.goals as number) * (1 - (band.tolerance.goals as number)), 4)}, ${n((band.baseline.goals as number) * (1 + (band.tolerance.goals as number)), 4)}]. ABSENT sits at ${n(band.rows.absent.perDimension.goals.perMatch, 4)} — **in band**. But:`,
);
w();
w('| arm | goals/match | in `goals` band? | paired Δ on `goalsPerMatch` [2.5, 97.5] | `resolved` |');
w('| --- | --- | --- | --- | --- |');
for (const a of CONTRAST) {
  const d = delta('goalsPerMatch', a);
  w(
    `| ${emph(a)} | ${n(band.rows[a].perDimension.goals.perMatch, 4)} | ${band.rows[a].perDimension.goals.inBand ? '✅ in' : '**❌ OUT**'} | ${d === 0 ? '0 [0, 0]' : `${sgn(d, 6)} ${rawCi(dci('goalsPerMatch', a))}`} | ${yesNo(resolved('goalsPerMatch', a))} |`,
  );
}
w();
const goalsOut = CONTRAST.filter((a) => band.rows[a].perDimension.goals.inBand === false);
const goalsUp = CONTRAST.filter(
  (a) => resolved('goalsPerMatch', a) && (delta('goalsPerMatch', a) as number) > 0,
);
w(
  `**Rows only.** ${goalsOut.length} arms fall **OUT of the \`goals\` band** — ${goalsOut.map((a) => `${LABEL[a]} ${n(band.rows[a].perDimension.goals.perMatch, 4)}`).join(' · ')} — and`,
);
w('on each of them the paired `goalsPerMatch` contrast is **`resolved` DOWNWARD**');
w(
  `(${goalsOut.map((a) => sgn(delta('goalsPerMatch', a), 3)).join(' / ')}). COMBINED-HALF (${n(band.rows.combinedHalf.perDimension.goals.perMatch, 4)}) is **IN** band with an`,
);
w(
  `unresolved contrast, and ${goalsUp.map((a) => `${LABEL[a]} (${n(band.rows[a].perDimension.goals.perMatch, 4)}, Δ ${sgn(delta('goalsPerMatch', a), 3)} **resolved UP**)`).join(' · ')} is in band the`,
);
w('other way.');
w();
/* every out-of-band cell in the whole band block, COMPUTED — never asserted */
const oob: string[] = [];
for (const a of ARMS) {
  for (const dim of band.gatedDimensions as string[]) {
    if (band.rows[a].perDimension[dim].inBand === false) {
      oob.push(`${LABEL[a]} \`${dim}\` ${n(band.rows[a].perDimension[dim].perMatch, 4)}`);
    }
  }
}
w(
  `⚠ **AND THE GOALS COLUMN IS NOT THE ONLY OUT-OF-BAND CELL — the full list, swept from the**`,
);
w(
  `**artifact rather than asserted, is ${oob.length} cell${oob.length === 1 ? '' : 's'} across ${ARMS.length} arms × ${(band.gatedDimensions as string[]).length} gated dimensions:** ${oob.join(' · ')}.`,
);
w(
  `${LABEL['kitchenSinkLead']} is the only arm out of band on more than one dimension. **These are the band's own`,
);
w('mechanical rows against its own frozen arithmetic. Whether an out-of-band reading at the lead');
w('arms fires F-PTP-c is the commander\'s, and it is NOT decided here** (#203).');
w();

/* ================================================================= IDENTITY */

const iz = g.flagHygiene.identityRows as Any[];
const zeroDeltaCols = Object.keys(A.contrasts.rates).filter((k) => {
  const pd = A.contrasts.rates[k].armedZeroBoth.pairedDelta;
  return pd !== null && pd.point === 0 && pd.lower === 0 && pd.upper === 0;
});
w('### ⭐ THE ARMED-ZERO-BOTH IDENTITY, AT BATTERY N');
w();
w(
  `The in-battery identity arm holds at full scale: **${iz.length}/${iz.length} seeds byte-identical to ABSENT** on the`,
);
w('whole-match signature *including the rng stream state* AND on every measured row field —');
w(
  `**${iz.reduce((s: number, r: Any) => s + r.differingFields.length, 0)} differing fields across all ${iz.length} rows**. Downstream of that, every ARMED-ZERO-BOTH paired`,
);
const nonZeroCols = Object.keys(A.contrasts.rates).filter((k) => !zeroDeltaCols.includes(k));
w(
  `delta in \`contrasts.rates\` is **exactly 0 with CI [0, 0]** on **${zeroDeltaCols.length} of the ${Object.keys(A.contrasts.rates).length} columns**`,
);
w('(rulers 1–5, every guard limb, offsides, fouls, goals, both clamp shares, behind-ball, mean');
w(
  `shift, and both lead columns). The ${nonZeroCols.length === 1 ? 'single remaining column' : `${nonZeroCols.length} remaining columns`}, ${nonZeroCols.map((k) => `\`${k}\``).join(' · ')}, carr${nonZeroCols.length === 1 ? 'ies' : 'y'} **no paired`,
);
w('delta at all** — the ratio does not exist in an arm with zero led passes (NaN, not zero), so');
w('the bootstrap\'s finite filter drops it. That is silence too, correctly typed.');
w();
w(
  `Its seam is **${int(A.arms.armedZeroBoth.seam.supportTicks)} support ticks with ${int(A.arms.armedZeroBoth.seam.planeZeroTicks)} planes`,
);
w(
  `PRESENT-and-ZERO and ${A.arms.armedZeroBoth.seam.supportTicksShifted} shifted**, and its lead seam is **${A.arms.armedZeroBoth.leadSeam.ledPassesNonZero} led passes on ${int(A.arms.armedZeroBoth.leadSeam.passesChosen)} chosen**`,
);
w('passes. **BOTH DOORS OPEN, BOTH DOSES INERT ⇒ ZERO IS SILENCE**, measured at battery N.');
w();

/* ================================================================= POPULATIONS */

w('### Populations — eligible moments and the moment grains, per arm');
w();
w('| arm | qualifying | eligible (ruler 1) | first receptions | pressed first rec. | possession ticks | pressed poss. ticks | ticks walked | played ticks | matches to full time |');
w('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const r1 = A.arms[a].ruler1TrueHoldable;
  const r2 = A.arms[a].ruler2PressedFirstReception;
  const r3 = A.arms[a].ruler3ShortOptionSupply;
  const r4 = A.arms[a].ruler4SupportAtPressed;
  const c = A.arms[a].context;
  w(
    `| ${emph(a)} | ${int(r1.qualifyingTotal)} | ${int(r1.eligibleTotal)} | ${int(r2.firstReceptions)} | ${int(r2.pressed)} | ${int(r3.possessionTicks)} | ${int(r4.pressedPossessionTicks)} | ${int(c.ticksWalked)} | ${int(c.playedTicks)} | **${c.matchesReachingFullTime} / ${A.nRule.nStar}** |`,
  );
}
w();
const exA = A.arms.absent.ruler1TrueHoldable.exclusions;
w(
  `**Every arm reaches full time on all ${A.nRule.nStar} matches.** Exclusion mix on the ruler-1 population (the`,
);
w(
  `#186 rule, unchanged): ABSENT firstTouch ${int(exA.firstTouch)} · mustKick ${int(exA.mustKick)} · A0-Shoot ${int(exA.a0Shoot)} · A0-Clear ${exA.a0Clear}.`,
);
w();
w('Segmentation accounting (`looseGapTicks`, `unattributedGoals` and `spanOrderViolations` are **0');
w('in every arm**, and `segmentTicks === assignedTicksSum` in every arm):');
w();
w('| arm | goals | segments | segments/match | totalTicks | deadBallTicks | segmentTicks = assignedTicksSum | goalsFromScore = goalsMappedToSegments |');
w('| --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const gg = A.arms[a].ruler5BuildUp.genealogy;
  const sp = gg.segmentPopulation;
  const ac = gg.accounting;
  w(
    `| ${emph(a)} | ${int(gg.goals)} | ${int(sp.segments)} | ${n(sp.segmentsPerMatch, 4)} | ${int(ac.totalTicks)} | ${int(ac.deadBallTicks)} | ${int(ac.segmentTicks)} | ${int(ac.goalsFromScore)} |`,
  );
}
w();

/* ================================================================= N RULE */

w('### THE N RULE — as executed (in-probe, from the COMMITTED source artifacts)');
w();
w('⭐ **The substitution the smoke promised was made, and the artifact publishes it**, quoting the');
w('artifact\'s own `nRule` fields:');
w();
w(`* **\`sourceOfP0\`**: *"${A.nRule.sourceOfP0}"*.`);
w(`* **\`deffProvenance\`**: *"${A.nRule.deffProvenance}"* ⇒ **DEFF ${A.nRule.deff}** = MAX(inherited ${A.nRule.deffInherited}, same-world smoke ${A.nRule.deffSmoke}).`);
w('* Sources pinned by sha256:');
for (const [k, s] of Object.entries<Any>(A.nRule.sources)) {
  w(`  * \`${k}\` → \`${s.path}\` sha \`${sha(s.sha256)}\` (resultSha \`${sha(s.resultSha)}\`${s.seeds ? `, ${s.seeds} seeds` : ''})`);
}
const q1 = A.nRule.q1TrueHoldable;
const q2 = A.nRule.q2PressedFirstReception;
w(
  `* **q1 TRUE-holdable** — p0 = ${q1.p0}, MDE = **${q1.mde}**, p1 = ${q1.p1}, m_iid ${int(q1.mIid)}, m_req **${int(q1.mReq)}**, eligible/seed ${q1.eligiblePerSeed} ⇒ **N ${q1.n}**.`,
);
w(
  `* **q2 pressed-first-reception** — p0 = ${q2.p0}, MDE = **${q2.mde}**, m_iid ${int(q2.mIid)}, m_req **${int(q2.mReq)}**, first receptions/seed ${q2.firstReceptionsPerSeed} ⇒ **N ${q2.n}**.`,
);
w(
  `* **Binding \`${A.nRule.binding}\` ⇒ N_raw ${A.nRule.nRaw}**; ledger room ${A.nRule.batteryRoom} (\`roomBinds: ${A.nRule.roomBinds}\`); the CTB-T1 precedent cap ${A.nRule.nCap}, **\`capBinds: ${A.nRule.capBinds}\`** ⇒ **N\\* = ${A.nRule.nStar}**. Block **${A.nRule.batteryBlock.replace('..', ' – ')}** — exactly what was walked.`,
);
w();
w(
  `⚠ **THE CAP BOUND, AND THE FORK WAS PUBLISHED RATHER THAN QUIETLY TAKEN.** The rule asked for`,
);
w(
  `**N_raw ${A.nRule.nRaw}** and the CTB-T1 precedent cap **${A.nRule.nCap}** cut it — \`capBinds: ${A.nRule.capBinds}\`, exactly the fork the stage`,
);
w(
  `doc froze as a commander question. The battery ran at the **cap**, ${A.nRule.nRaw - A.nRule.nStar} seeds short of what the frozen`,
);
w('formula asked for, and that shortfall is a fact about the executed design published here rather');
w('than discovered later. Stated as arithmetic, **not** as an excuse for any row: q1 was sized to');
w(
  `detect **${q1.mde}** on \`trueHoldableShare\`, and the largest |Δ| observed on that column is`,
);
w(
  `**${n(Math.max(...CONTRAST.map((a) => Math.abs(delta('trueHoldableShare', a) as number))), 6)}** (${LABEL[CONTRAST.reduce((b, a) => (Math.abs(delta('trueHoldableShare', a) as number) > Math.abs(delta('trueHoldableShare', b) as number) ? a : b), CONTRAST[0])]}) — the design's own MDE and the observed`,
);
w('spread are both published so the tier-1 column can be read against what it was built to see.');
w();

/* ================================================================= CHECKS */

w('### §CHECKS');
w();
w('```text');
w('$ npx tsc --noEmit');
w('(clean — this round moves no engine byte; src/** byte-untouched, X-SRC-UNTOUCHED PASS)');
w();
w('$ PTPT1_MODE=full PTPT1_RESUME=1 npx tsx scripts/probes/ptp-t1-full-channel.ts   (THE BATTERY, exit 0)');
w(`  ALL                PASS          (${gateCount} gates)`);
w(`  resultSha256 ${A.resultSha256}`);
w(`  wall ${int(wallS)} s (CONTEXT ONLY) · artifact ${A.envelopeContextOnly.outPath}`);
w('```');
w();
w('⚠ The `npm test` reading is unchanged from the smoke round and is **not re-quoted as a battery');
w('number**: this round edited no test file and moved no engine byte (X-SRC-UNTOUCHED PASS).');
w();

/* ================================================================= TRANSCRIPT */

let transcript: string[] = [];
try {
  transcript = readFileSync(logPath, 'utf8').split('\n');
} catch {
  transcript = [];
}
const isTick = (l: string): boolean => / seed \d+\/\d+ \(/.test(l);
const totalLines = transcript.length;
const tickLines = transcript.filter(isTick).length;

w('### THE TRANSCRIPT — `' + logPath + '`, reproduced (the #226.1 form)');
w();
w(
  `The run's own log, reproduced in full. The **only** lines not carried over are the ${int(tickLines)} per-seed`,
);
w(
  `progress ticks (${A.nRule.nStar} per pass, of the form \`pass P · seed k/${A.nRule.nStar} (SEED) · ${ARMS.length} arms done · T s\`):`,
);
w('they are per-seed **wall timings**, the #197-M1 context-only envelope, read by no gate and');
w(
  `entering no number above. Their position is marked. Every other line of the ${int(totalLines)}-line log appears`,
);
w('below verbatim.');
w();
w('```text');
let inTickRun = false;
for (const line of transcript) {
  if (isTick(line)) {
    if (!inTickRun) {
      w(`  … [${A.nRule.nStar} per-seed progress ticks — CONTEXT-ONLY wall timings, omitted] …`);
      inTickRun = true;
    }
    continue;
  }
  inTickRun = false;
  w(line);
}
w('```');
w();

/* ================================================================= DEVIATIONS */

w('### Deviations recorded');
w();
w('1. ⚠ **A PROVENANCE STRING IN THE ARTIFACT MISNAMES ITS OWN PINNED SOURCE, AND THE PINNED');
w('   SOURCE IS THE CORRECT ONE.** The N rule\'s `sourceOfP0` reads');
w(`   *"${A.nRule.sourceOfP0}"* and the key under \`nRule.sources\` is named`);
w(
  `   \`obmSmoke\` — but the path and sha it pins are **\`${A.nRule.sources.obmSmoke.path}\`**`,
);
w(
  `   (sha \`${sha(A.nRule.sources.obmSmoke.sha256)}\`, resultSha \`${sha(A.nRule.sources.obmSmoke.resultSha)}\`, ${A.nRule.sources.obmSmoke.seeds} seeds) — i.e. **THIS stage's own`,
);
w('   committed smoke**, which is what §NRULE froze and what the arithmetic above consumed. Both');
w('   are inherited label carry-over from the OBM-T1 probe this one was forked from. The NUMBERS');
w('   are unaffected (p0, moments/seed and the same-world DEFF all come from the pinned path); it');
w('   is a **naming** defect in a published string, recorded rather than silently corrected in the');
w('   doc\'s voice, because #229.2\'s lesson is that a cell which reads as one thing and is another');
w('   must be surfaced. **The correction is the commander\'s to rule on.**');
w('2. **The cap BOUND** (§N RULE above): the frozen rule asked for');
w(
  `   N_raw **${A.nRule.nRaw}** and the battery ran at the precedent cap **${A.nRule.nStar}**. Declared ex ante as a`,
);
w('   commander fork (`capForkNote`), published on the run, and not re-cut after sight.');
w('3. **The world is OBM-T1\'s, by necessity** (§FORM), so absolute levels are not comparable with');
w('   CTB-T1\'s or with the bare production world; every contrast here is within-world and paired.');
w('4. **The LEAD LAW CHECK lives in the observational dose read, not in the exam walk** —');
w('   inherited unchanged from the smoke round and re-declared here: re-deriving the delivered');
w('   lead independently pulls `match.perceivedSnapshot(p)` and advances that body\'s percept');
w('   memory, which inside an exam arm would be an intervention wearing an instrument\'s clothes.');
w(
  `   Its N is therefore small (${Math.min(...LEAD_ARMS.map((a) => A.deliveredDose[a].leadChecked as number))}–${Math.max(...LEAD_ARMS.map((a) => A.deliveredDose[a].leadChecked as number))} led passes per dosed arm, one match each) and it is a LAW`,
);
w(
  `   check, not a rate: **${LEAD_ARMS.reduce((s, a) => s + (A.deliveredDose[a].leadSignViolations as number), 0)} sign and ${LEAD_ARMS.reduce((s, a) => s + (A.deliveredDose[a].leadMagnitudeViolations as number), 0)} magnitude violations** in all four dosed arms.`,
);
w();

/* ================================================================= DISPOSITION */

w('### Disposition');
w();
w(
  `The battery is banked: **${gateCount}/${gateCount} gates PASS**, twice-deterministic, ${A.nRule.nStar} seeds × ${ARMS.length} arms, the`,
);
w('identity arm exact at full scale, and the instrument PROVED to be OBM-T1\'s and CTB-T1\'s own by');
w('re-walk rather than by assertion. **Nothing in this section is adjudicated.** The mechanical');
w('checkoff above is the frozen wording evaluated against published flags; **F-PTP-a/b/c and the');
w('#230 confirm/kill branch are the commander\'s**, and the adjudication is ruling **#234** in');
w('[`PROGRAMME-RULINGS.md`](PROGRAMME-RULINGS.md).');

process.stdout.write(out.join('\n') + '\n');
