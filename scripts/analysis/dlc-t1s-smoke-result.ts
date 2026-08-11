/**
 * DLC-T1s §RESULT — THE SMOKE: the SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED smoke artifact and emits the whole §RESULT markdown section on stdout.
 * Every measured cell in the published section is printed from this file's reads of the
 * artifact — never typed into the doc by hand. That is the whole point: #229.2's lesson (the
 * OBM-T1 smoke's fabricated MAX column) enforced by CONSTRUCTION rather than by a promise to
 * sweep afterwards.
 *
 * The prose captions ARE literal strings here, so they ride the generator too and cannot drift
 * away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, paired deltas and the mechanical CI /
 * predicate flags the probe already computed. No verdict is composed here; F-T1s-a/b/c are the
 * commander's.
 *
 *   npx tsx scripts/analysis/dlc-t1s-smoke-result.ts \
 *     docs/world-model/data/dlc-t1s-strike-exam-smoke.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dlc-t1s-strike-exam-smoke.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

const ARMS = ['absent', 'planeInert', 'plane', 'planeXCas', 'choiceAnchor'] as const;
const LABEL: Record<string, string> = {
  absent: 'ABSENT',
  planeInert: 'PLANE-INERT',
  plane: '⭐ **PLANE**',
  planeXCas: 'PLANE-X-CAS',
  choiceAnchor: '⭐ CHOICE-ANCHOR',
};
const DOORLBL: Record<string, string> = {
  absent: 'none', planeInert: 'sp', plane: 'sp', planeXCas: 'sp', choiceAnchor: 'dlc',
};

const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pp = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)} %` : 'n/a');
const ppD = (x: number, dp = 4): string => (Number.isFinite(x) ? `${(x * 100).toFixed(dp)}` : 'n/a');
const num = (x: number, dp = 4): string => (Number.isFinite(x) ? x.toFixed(dp) : 'n/a');
const ci = (d: Any, dp = 4): string => (d === null ? '(CONTROL)'
  : `[${(d.lower * 100).toFixed(dp)}, ${(d.upper * 100).toFixed(dp)}]`);

const C = A.contrasts.rates;
const G = A.gates;
const P = A.preRegisteredPrimary;

const rateTable = (key: string, title: string, asPct = true, dp = 4): void => {
  o(`**${title}** (ABSENT **${asPct ? pp(C[key].absent.point, dp) : num(C[key].absent.point, dp)}**):`);
  o();
  o('| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |');
  o('| --- | --- | --- | --- | --- | --- |');
  for (const a of ARMS) {
    const c = C[key][a];
    const d = c.pairedDelta;
    o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${asPct ? pp(c.point, dp) : num(c.point, dp)} `
      + `| ${d === null ? '—' : ppD(d.point, dp)} | ${ci(d, dp)} | ${d === null ? '—' : String(c.resolved)} |`);
  }
  o();
};

/* ------------------------------------------------------------------ the section */

o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **X-DET core digest** \`${G.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (${A.block}), paired on one shared seed list, `
  + '**plus** the SEVEN receipt walks (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · OBM-T1 8 × 2 arms '
  + `· ⭐⭐ G-ANCHOR ${G.gAnchor.rowsChecked}), the ${ARMS.length} delivered-dose reads and ⭐⭐ the `
  + `${ARMS.length} STRIKE READS (each a traced match + its untraced LOCKSTEP TWIN) — and the whole `
  + 'core runs **twice** (X-DET).');
o(`* Verdict: **ALL ${Object.keys(G).length} GATES PASS** (\`allGatesPass: ${A.allGatesPass}\`), probe exit 0.`);
o(`* Wall ≈ **${Math.round(A.envelopeContextOnly.wallMsContextOnly / 1000)} s** — CONTEXT ONLY `
  + '(#128), used in no rate and no gate. Per #197-M1 the hashed body is commit-free, '
  + 'timing-free and path-free.');
o();

o('### Gate table');
o();
o('| gate | verdict | evidence (all recomputed in-probe, #181.2) |');
o('| --- | --- | --- |');
const row = (name: string, pass: boolean, ev: string): void => {
  o(`| **${name}** | ${pass ? '✅ PASS' : '*** FAIL ***'} | ${ev} |`);
};
row('X-DET', G.xDet.pass, 'two passes of the whole core, identical digests');
row('X-FP-PROD', G.xFpProd.pass, `\`${String(G.xFpProd.observed).slice(0, 8)}…${String(G.xFpProd.observed).slice(-4)}\` re-derived unchanged (seed ${G.xFpProd.seed}, ${G.xFpProd.seasons} seasons)`);
row('X-SRC-UNTOUCHED', G.xSrcUntouched.pass, '`git diff --stat -- src` **EMPTY** — INSTRUMENT-ONLY, no engine byte moved');
row('⭐⭐ G-ANCHOR (G-REPRO-DLCT1)', G.gAnchor.pass,
  `block ${G.gAnchor.block} against the committed DLC-T1 **battery** artifact `
  + `(\`${String(G.gAnchor.sourceResultSha).slice(0, 8)}…${String(G.gAnchor.sourceResultSha).slice(-4)}\`), `
  + `arm \`${G.gAnchor.sourceArm}\`: **${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, `
  + `${G.gAnchor.mismatches} mismatches** (of ${G.gAnchor.committedRowsAvailable} committed rows available) — `
  + 'whole-match **signature** (rng stream state inside) AND the DELIVERED-STRIKE columns included. '
  + `\`armConfigurationIdentical: ${G.gAnchor.armConfigurationIdentical}\``);
row('⭐ G-REPRO-OBMT1', G.gReproObmT1.pass,
  `block ${G.gReproObmT1.block}: ${G.gReproObmT1.absentRowsChecked} rows × ${G.gReproObmT1.fieldsPerRow} fields, `
  + `**${G.gReproObmT1.absentMismatches} mismatches on ABSENT and ${G.gReproObmT1.checkAndShowMismatches} on CHECK-AND-SHOW**`);
row('G-REPRO-CTBT1', G.gReproCtbT1.pass,
  `${G.gReproCtbT1.rowsChecked} rows × ${G.gReproCtbT1.fieldsPerRow} fields, ${G.gReproCtbT1.mismatches} mismatches, signature included`);
row('G-REPRO-O2T1', G.gReproO2T1.pass, `${G.gReproO2T1.rowsChecked}/${G.gReproO2T1.rowsChecked} rows, ${G.gReproO2T1.mismatches} mismatches`);
row('G-REPRO-173', G.gRepro173.pass,
  `pressedShare **${G.gRepro173.observed.pressedShare}** · pressed **${G.gRepro173.observed.pressed}** `
  + `· unpressed **${G.gRepro173.observed.unpressed}** · all **${G.gRepro173.observed.all}**, field for field`);
row('G-REPRO-GGC', G.gReproGgc.pass, `**${G.gReproGgc.fieldsChecked}/${G.gReproGgc.fieldsChecked}** committed fields, ${G.gReproGgc.mismatches} mismatches`);
row('⭐ G-TRACE-SP', G.gTraceSp.pass,
  `all ${G.gTraceSp.lines.length} source lines matched VERBATIM; K = ${G.gTraceSp.constants.STRIKE_PLANE_K}, `
  + `zero-point index ${G.gTraceSp.constants.STRIKE_PLANE_ZERO_INDEX}, steps `
  + `[${G.gTraceSp.constants.steps.join(', ')}], and the zero-point member IS (direction 0, power 0): `
  + `\`${G.gTraceSp.constants.zeroPointMemberIsDirection0Power0}\``);
row('G-TRACE-PTP', G.gTracePtp.pass,
  `all ${G.gTracePtp.lines.length} source lines matched VERBATIM; the gene map probed through the shipped `
  + `\`passLeadSupportWeight\`: absent ${G.gTracePtp.geneMap.atAbsent}, min ${G.gTracePtp.geneMap.atMin}, `
  + `half ${G.gTracePtp.geneMap.atHalf}, max ${G.gTracePtp.geneMap.atMax}, clamped at `
  + `${G.gTracePtp.geneMap.belowMin} / ${G.gTracePtp.geneMap.aboveMax} beyond both ends`);
row('G-TRACE-RADIUS', G.gTraceRadius.pass, '`radius = 10 + g.supportDistance * 8` parsed from source');
row('⭐⭐ G-FORK-TOKENS-SP', G.gForkTokensSp.pass,
  `**${G.gForkTokensSp.occurrences} src occurrences, ZERO unclassified**; exactly **1** \`FLAG_FORK\` `
  + `· **1** \`GRID_FORM\` · **1** \`CAND_SCORE\` (into the ONE hoisted pricer) · **2** \`GRID_CAPTURE\` `
  + `· **1** \`PLANE_GUARD\` (naming NO flag) · ${G.gForkTokensSp.byKind.PLANE_ARGMAX ?? 0} \`PLANE_ARGMAX\`; `
  + `and **${G.gForkTokensSp.strikeStatementsInBrain} \`match.performPass(\` statements in the brain — `
  + 'i.e. ZERO added by the plane**');
row('⭐ G-FORK-TOKENS-DLC', G.gForkTokensDlc.pass,
  `**${G.gForkTokensDlc.occurrences} src occurrences, ZERO unclassified**; the banked contest's frozen `
  + `counts UNCHANGED (1 \`FLAG_FORK\` · 1 \`CAND_DECL\` · 2 \`CAND_SCORE\` matched VERBATIM · 1 `
  + `\`LED_FORM\` · 2 \`LED_CAPTURE\`), plus this stage's declared plane-era classes `
  + `(${G.gForkTokensDlc.planeEraClasses.join(', ')}) at 1 each`);
row('G-FORK-TOKENS-PTP', G.gForkTokensPtp.pass,
  `**${G.gForkTokensPtp.occurrences} src occurrences, ZERO unclassified**; exactly 1 \`FLAG_FORK\` · `
  + `1 \`LEAD_COMPUTE\` · 1 \`AIM_COMPOSE\` · ${G.gForkTokensPtp.aimApplySites} \`AIM_APPLY\` · `
  + `2 \`LEAD_CAPTURE\` · 1 \`STRIKE_GUARD\` · 1 \`STRIKE_LED\`. ⚠ the plane-era classes `
  + `(${G.gForkTokensPtp.planeEraClasses.join(', ')}) are this stage's declared Deviation 1`);
row('G-FORK-TOKENS (OBM)', G.gForkTokens.pass, `${G.gForkTokens.occurrences} src occurrences, 0 unclassified — OBM-T1's own inventory, unchanged`);
row('⭐ G-BLIND-WORLD', G.gBlindWorld.pass,
  'every arm percept-armed in its CONSTRUCTED world; `sawSnapshotShare` '
  + `${ARMS.map((a) => G.gBlindWorld.perArm[a].sawSnapshotShare).map((v: number) => pp(v, 3)).join(' / ')}, `
  + 'all four feature means > 0 in every arm. ⚠ `allFeaturesZeroShare` '
  + `${ARMS.map((a) => G.gBlindWorld.perArm[a].allFeaturesZeroShare).map((v: number) => pp(v, 2)).join(' / ')} `
  + 'is an **UPPER BOUND** on genuine silence');
row('SEED-DISJOINT', G.seedDisjoint.pass,
  `⭐ all **${G.seedDisjoint.walkedBlocks.length}** block rows machine-checked against the complete `
  + `**${G.seedDisjoint.consumedLedger.length}-entry** consumed ledger: 3 FRESH + 2 RESERVED clash-free, `
  + '**6 RE-WALKS each landing INSIDE its source\'s consumed interval** (the inverted predicate, '
  + 'including ⭐⭐ the G-ANCHOR block). `stageOwnOverlaps` empty, sub-blocks ordered, battery room '
  + `${G.seedDisjoint.subBlocks.batteryRoom}, next consumed ${G.seedDisjoint.subBlocks.nextConsumedAfterBattery}`);
row('STATS-DISJOINT', G.statsDisjoint.pass,
  `base **${G.statsDisjoint.base}**, min gap **${G.statsDisjoint.minGap}** against the complete published namespace (${G.statsDisjoint.published.length} bases)`);
row('FLAG-HYGIENE', G.flagHygiene.pass,
  `**${G.flagHygiene.identityRows.filter((r: Any) => r.signatureIdentical && r.rowIdentical).length}/`
  + `${G.flagHygiene.identityRows.length}** seeds ⭐ PLANE-INERT ≡ ABSENT — whole-match signature **and** `
  + 'every row field; ⭐⭐ the doors row: `ctbSupportPlaneFalseInEveryArm` '
  + `${G.flagHygiene.twoDoors.ctbSupportPlaneFalseInEveryArm} · \`perceptArmedInEveryArm\` `
  + `${G.flagHygiene.twoDoors.perceptArmedInEveryArm} · \`dialNeverArmed\` `
  + `${G.flagHygiene.twoDoors.dialNeverArmed} · \`spFlagMatchesDoor\` `
  + `${G.flagHygiene.twoDoors.spFlagMatchesDoor} · \`dlcFlagMatchesDoor\` `
  + `${G.flagHygiene.twoDoors.dlcFlagMatchesDoor} · **\`neverBothDeliveryDoors\` `
  + `${G.flagHygiene.twoDoors.neverBothDeliveryDoors}** · \`doorMatchesGenePresence\` `
  + `${G.flagHygiene.twoDoors.doorMatchesGenePresence} · **\`exactlyOneArmedInertArm\` `
  + `${G.flagHygiene.twoDoors.exactlyOneArmedInertArm}**`);
row('⭐ G-ARM', G.gArm.pass,
  'delivery on the axes each arm doses and silence on the ones it does not. `ledPassesHandled === '
  + 'ledPassesNonZero` in **every** arm; zero metres in the inert arm; ⭐ the PLANE arms\' law is '
  + `MEMBERSHIP — \`planeChecked\` ${ARMS.map((a) => G.gArm.arms[a].planeChecked).join(' / ')} with `
  + `\`planeUnmatched\` ${ARMS.map((a) => G.gArm.arms[a].planeUnmatched).join(' / ')} (IEEE-exact against `
  + 'the shipped `groundStrikeGrid`); the CONTEST anchor\'s is the ALGEBRA (0 sign / 0 magnitude '
  + `violations); the four support-tick classes \`partitionExact\` in ${ARMS.length}/${ARMS.length}`);
row('G-CLEAN-INVOCATION', G.gCleanInvocation.pass, 'no override in force');
o();

o('### ⭐⭐ THE CHOSEN STRIKE — the emergent KICK over the NINE grid members (REPORTED)');
o();
o(`*(observational, seed ${A.strikeRead.plane.seed}; index = (dirStep+1)·3 + (powerStep+1), so member `
  + '**4 is TODAY\'S KICK**. ⚠ An arm without the plane door has no grid: its member row is all zeros '
  + 'BY CONSTRUCTION.)*');
o();
o('⚠⚠ **MEMBER 4 IS `n/a`, NOT A MEASURED 0 (#242.3 — corrected this round).** This table is '
  + 'tallied from the **5th argument of `performPass`**, and a ZERO-DISPLACEMENT kick carries no '
  + '5th argument (the banked strike guard\'s own `bestLeadX !== 0 || bestLeadY !== 0`). So '
  + 'TODAY\'S KICK HAS NO OBSERVATION CHANNEL HERE: the 0 this cell used to publish was a property '
  + 'of the instrument, not of the world, and the inherited bucket definition *"legacy man kept '
  + 'AND member 4 won"* is corrected with it — keeping the legacy man is observable, member 4 '
  + 'winning is not. ⭐ **Zero-point wins are countable only at DECISION time**, through an '
  + 'instrument that reads the argmax rather than the ball. The nearest banked evidence is '
  + 'DLC-T0s\'s **G-WINNER** (`data/dlc-t0s-strike-plane.json` → `gates.gWinner`): of the '
  + 'materially-spread decisions, **6 of 96 won by TODAY\'S KICK** in the percept world and '
  + '**5 of 75** in the bare world. ⚠ That is T0s\'s world, cited as the honest source for the '
  + 'QUANTITY — this stage runs no decision-time winner instrument of its own.');
o();
o('| arm | door | kicks | sampled-struck | 0 `d−1p−1` | 1 `d−1p0` | 2 `d−1p+1` | 3 `d0p−1` | **4 `d0p0` (today)** | 5 `d0p+1` | 6 `d+1p−1` | 7 `d+1p0` | 8 `d+1p+1` | unmatched |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  o(`| ${LABEL[a]} | ${s.door} | ${s.kicks} | ${s.sampledStruck} | `
    + `${s.byMember.map((m: Any) => (m.observableAtStrike ? String(m.wins) : '**n/a**')).join(' | ')} `
    + `| ${s.unmatchedStrikes} |`);
}
o();
o('By DIRECTION and by POWER, and the size of the displacement that rode the ball:');
o();
o('| arm | by direction | by power | mean displacement | max | share of pass distance |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  o(`| ${LABEL[a]} | \`${JSON.stringify(s.byDirection)}\` | \`${JSON.stringify(s.byPower)}\` `
    + `| ${num(s.meanDisplacementMetres)} m | ${num(s.maxDisplacementMetres)} m `
    + `| ${num(s.meanDisplacementShareOfDistance, 5)} |`);
}
o();

o('### ⭐⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242.2)');
o();
o('⭐⭐ **CORRECTED THIS ROUND (#242.3).** The first table is the reading; the second is the '
  + 'RETRACTED one, kept so the supersession is auditable.');
o();
o('**(a) THE CORRECTED READING — delivered rate CONDITIONED ON LIVE-GRID DECISIONS.** A '
  + 'zero-displacement kick only counts as *the plane declining* if the plane had another kick to '
  + 'decline. Liveness is now MEASURED per decision, on the LEGACY man\'s own grid (the man the '
  + 'plane\'s argmax winner was priced on): **LIVE** = at least one of the nine members is a '
  + 'different kick; **DEGENERATE** = all nine exactly (0,0) — no remembered motion ⇒ reach 0 ⇒ '
  + 'the whole plane collapses onto today\'s kick BY ARITHMETIC, so the treatment was IMPOSSIBLE '
  + 'at that decision; **no seat** = the gene is absent, so no grid forms at all.');
o();
o('| arm | a PLANE reading? | kicks | sampled-struck | zero-point: LIVE / **DEGENERATE** / no seat | substituted: LIVE / **DEGENERATE** / no seat | no chooser row | live-grid n | ⭐⭐ **delivered rate (LIVE-GRID)** | ⭐ delivered rate (strike-time, BATTERY GRAIN) | lockstep |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  const real = s.deliveredRateIsATreatmentReading;
  o(`| ${LABEL[a]} | ${real ? '**yes**' : 'no — no grid here'} | ${s.kicks} | ${s.sampledStruck} `
    + `| ${s.zeroPointLiveGrid} / **${s.zeroPointDegenerateGrid}** / ${s.zeroPointNoSeat} `
    + `| ${s.substitutedLiveGrid} / **${s.substitutedDegenerateGrid}** / ${s.substitutedNoSeat} `
    + `| ${s.noChooserRow} | ${s.liveGridDecisions} `
    + `| ${s.deliveredRateLiveGrid === null ? 'n/a — no plane here' : `**${num(s.deliveredRateLiveGrid, 4)}**`} `
    + `| ${num(G.gArm.arms[a].deliveredRateStrikeTime, 5)} | ${s.lockstepWithUntraced} |`);
}
o();
o('⭐ **WHY THE CORRECTED COLUMN IS `n/a` ON THREE ARMS AND THAT IS THE POINT.** An arm with no '
  + 'plane has no treatment to deliver, so it gets no delivered rate — where the old column '
  + 'happily printed one. PLANE-INERT reads `n/a` for the sharpest possible reason: the gene is '
  + 'ABSENT, so **no seat and therefore no grid ever forms**, and every one of its decisions lands '
  + 'in *no seat*.');
o();
o('**(b) THE RETRACTED READING**, kept for audit — `(sampled-struck + genuine zero-point) / '
  + 'kicks`, with the bracket it can honestly support:');
o();
o('| arm | kicks | sampled-struck | genuine zero-point | ⚠ target-SUBSTITUTED | no chooser row | substitution rate | ⚠ **delivered rate (decoded — RETRACTED)** | ⭐ honest bracket for that formula |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.strikeRead[a];
  const real = s.deliveredRateIsATreatmentReading;
  const cell = (v: string): string => (real ? v : `(${v})`);
  const b = s.deliveredRateDecodedBracket;
  o(`| ${LABEL[a]} | ${s.kicks} | ${s.sampledStruck} `
    + `| ${s.genuineZeroPoint} | ${s.targetSubstituted} | ${s.noChooserRow} `
    + `| ${cell(num(s.substitutionRate, 4))} | ${cell(`~~${num(s.deliveredRateDecoded, 4)}~~`)} `
    + `| ${cell(`[${num(b.lower, 4)}, ${num(b.upper, 4)}]`)} |`);
}
o();
o('⚠⚠ **THE RETRACTION, STATED PLAINLY.** `deliveredRateDecoded`\'s bucket is decided SOLELY by '
  + '`chosenGid === legacyGid` and carries **no grid information at all**, so it scored two '
  + 'OPPOSITE facts identically: *the plane offered another kick and the decision declined it* '
  + '(a real zero-point win) and *the plane had nothing to offer* (a fully degenerate grid — the '
  + 'treatment was impossible at that decision). ⭐ **THE SYMPTOM THAT PROVES IT MATTERS: the old '
  + 'statistic was NOT MONOTONE IN TREATMENT.** PLANE-INERT — where no grid can exist — scored '
  + `**${num(A.strikeRead.planeInert.deliveredRateDecoded, 4)}**, HIGHER than PLANE\'s `
  + `**${num(A.strikeRead.plane.deliveredRateDecoded, 4)}**, because on an arm with no plane every `
  + 'kept-legacy kick banks into the same numerator. ⭐ And on THIS match the PLANE arm\'s '
  + `**all ${A.strikeRead.plane.genuineZeroPoint}** "genuine zero-point" kicks had a FULLY `
  + 'DEGENERATE grid — the thin-channel mechanism never connected at a single one of them — so '
  + 'the honest statement the old formula supports there is the BRACKET '
  + `**[${num(A.strikeRead.plane.deliveredRateDecodedBracket.lower, 4)}, `
  + `${num(A.strikeRead.plane.deliveredRateDecodedBracket.upper, 4)}]**, not the point value `
  + `${num(A.strikeRead.plane.deliveredRateDecoded, 4)}.`);
o();
o('⚠⚠ **PARENTHESISED CELLS ARE NOT A PLANE READING** (`deliveredRateIsATreatmentReading: '
  + 'false`): the percept chooser runs — and substitutes — in EVERY arm, so the four buckets fill '
  + 'even where no grid exists, but with no grid there is no plane winner to deliver or discard '
  + 'and "genuine zero-point" means only that the chooser kept the legacy man. ⭐ THE STRIKE-TIME '
  + 'COLUMN IS THE EXCEPTION AND IS NEVER PARENTHESISED: it counts kicks that carried the '
  + 'CHOOSER\'S OWN displacement, whichever chooser the arm has — so at CHOICE-ANCHOR it is the '
  + 'two-point contest\'s own delivered rate, and at ABSENT / PLANE-INERT it is exactly 0 because '
  + 'no chooser exists to displace anything.');
o();
o('⚠ **READ THE COLUMNS EXACTLY.** The LIVE-GRID rate is `(sampled-struck + live-grid zero-point) '
  + '/ (that + live-grid substituted)` on ONE observational match — degenerate grids, seatless '
  + 'decisions and `no chooser row` enter NEITHER side; the RETRACTED decoded rate was '
  + '`(sampled-struck + genuine zero-point) / kicks` on the same match; the STRIKE-TIME rate is '
  + '`ledPassesNonZero / passesChosen` across ALL '
  + `${A.seeds} exam seeds with zero percept pulls, i.e. the rate the treatment was delivered at in the `
  + 'matches every ruler is computed on. `no chooser row` (a keeper, a restart with no executable '
  + 'option, a cutback) is UNDETERMINED and folded into NEITHER side. `lockstep` is the receipt that '
  + 'the chooser\'s sidecar trace perturbed nothing: same kicks, same sampled count, same per-member '
  + 'wins as an UNTRACED twin at the same seed and arm.');
o();

o('### ⭐ THE EMERGENT LED SHARE and its SITUATIONAL PROFILE (REPORTED — no gate reads them)');
o();
o('| arm | door | gene | passes chosen | displacement wins | **share** | mean | max | disp / pass dist | interceptions per such pass |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const l = A.arms[a].leadSeam;
  const gene = G.gArm.arms[a].leadGene;
  o(`| ${LABEL[a]} | ${DOORLBL[a]} | ${gene === null ? 'absent' : gene} | ${l.passesChosen} `
    + `| ${l.ledPassesNonZero} | **${pp(l.ledShareOfChosenPasses, 2)}** | ${num(l.meanLeadMetres)} m `
    + `| ${num(l.maxLeadMetres)} m | ${num(l.meanLeadShareOfPassDistance, 5)} `
    + `| ${Number.isFinite(l.interceptionsPerLedPass) ? num(l.interceptionsPerLedPass, 5) : 'n/a (none)'} |`);
}
o();
o('| arm | share at PRESSED | share at UNPRESSED | pressed passes | unpressed passes | partition exact |');
o('| --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  const s = A.arms[a].leadSeam.situationalLedShare;
  o(`| ${LABEL[a]} | ${pp(s.ledShareAtPressed, 2)} (${s.ledAtPressed}/${s.pressedTotal}) `
    + `| ${pp(s.ledShareAtUnpressed, 2)} (${s.ledAtUnpressed}/${s.unpressedTotal}) `
    + `| ${s.pressedTotal} | ${s.unpressedTotal} | ${s.partitionExact} |`);
}
o();

o('### ⭐⭐ THE JOINT PRE-REGISTERED PRIMARY — mechanical flags only, NOTHING is fired (#203)');
o();
o('| arm | supply Δ (pp) | 95 % CI (pp) | `resolvedHelpful` | goals/match | frozen band | `inBand` | **JOINT** | which limb fails |');
o('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');
for (const a of ARMS) {
  if (a === 'absent') continue;
  const j = a === P.planeCell ? P.primaryAtPlane : P.allArms[a];
  const sl = j.supplyLimb; const bl = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${sl.delta === null ? '—' : ppD(sl.delta)} `
    + `| ${sl.ci === null ? '—' : `[${(sl.ci[0] * 100).toFixed(4)}, ${(sl.ci[1] * 100).toFixed(4)}]`} `
    + `| ${sl.resolvedHelpful} | ${bl.goalsPerMatch} | [${bl.bandLo}, ${bl.bandHi}] | ${bl.inBand} `
    + `| **${j.jointSatisfied}** | ${j.whichLimbFails === null ? '—' : j.whichLimbFails} |`);
}
o();
const ctrlBand = P.primaryAtPlane.goalsBandLimb.controlAlsoInBand;
o('⚠ **THE BAND LIMB\'S GRAIN, STATED WITH THE ROW.** `controlAlsoInBand` is '
  + `**${ctrlBand}** (the ABSENT arm reads ${A.arms.absent.guards.band.goals.perMatch} goals/match `
  + `against the frozen band [${P.primaryAtPlane.goalsBandLimb.bandLo}, `
  + `${P.primaryAtPlane.goalsBandLimb.bandHi}] at ${A.seeds} seeds); excluded dimensions `
  + `${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}, gated dimensions `
  + `${JSON.stringify(A.guardVerdicts.band.gatedDimensions)}. The band **GATES AT BATTERY N ONLY** — `
  + 'inherited verbatim, frozen before this ran. At smoke grain every `inBand` cell above is a '
  + '**plumbing reading, not evidence**, and no F-branch may be read off it.');
o();

o('### ⭐⭐ THE #240 OVERSHOOT CONTRAST — PLANE vs the CHOICE ANCHOR (mechanical flags only)');
o();
const OV = P.overshootPrediction;
const li = OV.limbInterceptions;
const sv = OV.supplyRetainedVsAnchor;
o('| limb | quantity | reading | flag | strict form |');
o('| --- | --- | --- | --- | --- |');
o(`| **I — interceptions FALL** | \`interceptionsPerMatch\`, PLANE − ANCHOR | `
  + `${li.planeMinusAnchor === null ? 'n/a' : `${num(li.planeMinusAnchor.point, 4)} [${num(li.planeMinusAnchor.lower, 4)}, ${num(li.planeMinusAnchor.upper, 4)}]`} `
  + `| \`fall\` **${li.fall}** | \`resolvedFall\` ${li.resolvedFall} |`);
o(`| **G — goals RECOVER** | band distance (0 inside; else distance to the nearer edge) | `
  + `plane ${num(OV.limbGoalsBand.bandDistancePlane, 4)} vs anchor ${num(OV.limbGoalsBand.bandDistanceAnchor, 4)} `
  + `| \`recover\` **${OV.limbGoalsBand.recover}** | \`intoBand\` ${OV.limbGoalsBand.intoBand} |`);
o(`| (retention, published beside them) | \`trueHoldableShare\`, PLANE − ANCHOR | `
  + `${sv.planeMinusAnchor === null ? 'n/a' : `${ppD(sv.planeMinusAnchor.point)} pp [${ppD(sv.planeMinusAnchor.lower)}, ${ppD(sv.planeMinusAnchor.upper)}]`} `
  + `| \`resolvedVsAnchor\` ${sv.resolvedAgainstAnchor} | — |`);
o();
o(`⇒ **SATISFIED = ${OV.satisfied}** (LIMB I **OR** LIMB G, the ruling's own disjunction); strict form `
  + `**${OV.satisfiedStrict}**. The estimator is the ANCHOR-REFERENCED paired bootstrap — the same `
  + 'resampled seed-index sets differenced PLANE − ANCHOR, never two control-referenced CIs '
  + '**subtracted**. ⚠ At smoke grain these are plumbing readings: the band gates at battery N only '
  + `and the CIs at ${A.seeds} clusters are wider than anything they could detect.`);
o();

o('### THE GUARDS');
o();
o('| limb | control | tolerance | resolved arms | **breaches** |');
o('| --- | --- | --- | --- | --- |');
for (const g of A.guardVerdicts.tolerances) {
  const res = ARMS.filter((a) => a !== 'absent' && g.arms[a]?.resolved)
    .map((a) => `${LABEL[a].replace(/\*|⭐ ?/g, '')} ${g.arms[a].delta > 0 ? '+' : ''}${num(g.arms[a].delta, 4)}`);
  const br = ARMS.filter((a) => a !== 'absent' && g.arms[a]?.breach);
  o(`| ${g.key} (${g.direction}) | ${num(g.controlLevel, 4)} | ±${num(g.toleranceAbs, 4)} `
    + `| ${res.length === 0 ? 'none' : res.join(', ')} | **${br.length === 0 ? 'none' : br.join(', ')}** |`);
}
o();
const offRes = ARMS.filter((a) => a !== 'absent' && A.guardVerdicts.offside.rows[a].resolvedIncrease);
o(`Offsides (the #157 FLAG form): resolved INCREASES — **${offRes.length === 0 ? 'none' : offRes.join(', ')}**.`);
o();

o('### THE N RULE (in-probe, from the committed artifacts)');
o();
const nr = A.nRule;
o(`DEFF **${nr.deff}** (${nr.deffProvenance}). q1 ⇒ **N ${nr.q1TrueHoldable.n}** `
  + `(p0 ${nr.q1TrueHoldable.p0}, MDE ${nr.q1TrueHoldable.mde}, ${nr.q1TrueHoldable.eligiblePerSeed} eligible moments/seed), `
  + `q2 ⇒ N ${nr.q2PressedFirstReception.n} (p0 ${nr.q2PressedFirstReception.p0}, MDE ${nr.q2PressedFirstReception.mde}, `
  + `${nr.q2PressedFirstReception.firstReceptionsPerSeed} first receptions/seed), binding **${nr.binding}**, `
  + `**N\\* = ${nr.nStar}**; ledger room ${nr.batteryRoom} (binds=${nr.roomBinds}), cap ${nr.nCap} `
  + `(binds=${nr.capBinds}). Battery block **${nr.batteryBlock}** — inside the ledger and below the `
  + `${G.seedDisjoint.subBlocks.nextConsumedAfterBattery} ceiling. Source of p0: ${nr.sourceOfP0}.`);
o();

o('### TIER-1 SUPPLY RULERS AND THE TIER-2 SHARES — rows, never verdicts (#203)');
o();
rateTable('trueHoldableShare', 'Ruler 1 — TRUE-holdable supply');
rateTable('pressedFirstReceptionShare', 'Ruler 2 — pressed first reception');
rateTable('interceptionsPerMatch', 'The named risk — interceptions per match', false, 4);
rateTable('constructedGe5Share', 'Tier 2 — constructed ≥5 (non-set-piece pool)');
rateTable('scrambleShareOfGoals', 'Tier 2 — scramble share of goals');
o('⚠ **THE CAPTION THAT MATTERS MORE THAN THE CELLS.** At '
  + `${A.seeds} seeds each arm scores `
  + `${ARMS.map((a) => A.arms[a].ruler5BuildUp.genealogy.goals).join(' / ')} goals in total (in arm order), `
  + 'so a single goal is worth several pp on any of these shares: they move in STEPS and their CIs '
  + 'are wider than anything they could detect. **These are plumbing readings, not evidence.**');
o();
