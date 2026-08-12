/**
 * DV-T1 §RESULT — THE MAP EXAM: the SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED artifact and emits the whole §RESULT markdown section on stdout. Every
 * measured cell in the published section is printed from this file's reads of the artifact —
 * never typed into the doc by hand. That is the point: #229.2's lesson enforced by CONSTRUCTION.
 *
 * ⚠ THIS SCRIPT ADJUDICATES NOTHING (#203). It prints rows, paired deltas and the mechanical CI /
 * predicate flags the probe already computed. F-DV-a/b/c are the commander's.
 *
 * ⚠ IT QUOTES NO COST PERCENTAGE (#250.4): this stage measures no cost, and the T0 floor is
 * machine-specific.
 *
 *   npx tsx scripts/analysis/dv-t1-battery-result.ts [docs/world-model/data/dv-t1-map-exam.json]
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dv-t1-map-exam.json';
const A: Any = JSON.parse(readFileSync(artifactPath, 'utf8'));

const ARMS = ['absent', 'planeAnchor', 'dvInert', 'dvTruth0', 'dvTruthP', 'dvTruthG',
  'dvLoud', 'dvTruthPxCas'] as const;
const LABEL: Record<string, string> = {
  absent: 'ABSENT (control)',
  planeAnchor: '⭐⭐ PLANE-ANCHOR (#244\'s arm)',
  dvInert: '⭐ DV-INERT (genes at zero)',
  dvTruth0: '⭐⭐ **DV-TRUTH-0** (the map alone)',
  dvTruthP: 'DV-TRUTH-P (exposure PARITY)',
  dvTruthG: 'DV-TRUTH-G (PARITY × gradient)',
  dvLoud: '⭐ DV-LOUD (above truth)',
  dvTruthPxCas: 'DV-TRUTH-P × CHECK-AND-SHOW',
};
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const n6 = (x: Any): string => (x === null || x === undefined ? 'n/a' : String(x));
const ci = (d: Any): string => (d === null || d === undefined ? 'n/a'
  : `${d.point} [${d.lower}, ${d.upper}]`);
const yn = (b: Any): string => (b === true ? '**yes**' : b === false ? 'no' : 'n/a');

const G = A.gates;
const P = A.preRegisteredPrimary;

/* ---------------------------------------------------------------- the run */
o('### The run');
o();
o(`* **\`resultSha256\`** \`${A.resultSha256}\``);
o(`* **G-DET core digest** \`${G.xDet.digestA}\` (both passes)`);
o(`* **${A.seeds} seeds × ${ARMS.length} arms** (block ${A.block}), paired on one shared seed `
  + 'list, **plus** the seven receipt walks (O2-T1 · #173 · GGC · CTB-T1 · OBM-T1 × 2 arms · '
  + `⭐⭐ G-ANCHOR on DLC-T1s's own \`plane\` arm), the ${ARMS.length} delivered-dose reads, the `
  + `${ARMS.length} strike reads (each a traced match + its untraced LOCKSTEP TWIN) and ⭐⭐ the `
  + 'H-250a flip-vs-suppress counterfactual — and the whole core runs **twice** (G-DET).');
o(`* Verdict: **ALL ${Object.keys(G).length} GATES ${A.allGatesPass ? 'PASS' : 'DID NOT ALL PASS'}** `
  + `(\`allGatesPass: ${A.allGatesPass}\`).`);
o('* Wall is CONTEXT ONLY (#128) and rides the UNHASHED envelope with the git head and the paths '
  + '(#197-M1 / the #250.3 hygiene note), so `resultSha256` re-derives on another machine.');
o();

/* ------------------------------------------------------------- gate table */
o('### Gate table');
o();
o('| gate | result | evidence (all recomputed in-probe, #181.2) |');
o('| --- | --- | --- |');
const ev: Record<string, () => string> = {
  gForkTokensPtp: () => `${G.gForkTokensPtp.occurrences} src occurrences, `
    + `**${(G.gForkTokensPtp.unclassified as Any[]).length} unclassified**; `
    + `AIM_APPLY sites ${G.gForkTokensPtp.aimApplySites} (frozen at 3, UNCHANGED) and ⭐ the risk-price `
    + `call site pinned at **${G.gForkTokensPtp.dvRiskPriceSites}** — this stage's declared DV-era `
    + `completion (${(G.gForkTokensPtp.dvEraClasses as Any[]).join(' · ')})`,
  gForkTokensSp: () => `${G.gForkTokensSp.occurrences} src occurrences, `
    + `${(G.gForkTokensSp.unclassified as Any[]).length} unclassified — the plane's banked inventory unchanged`,
  gForkTokensDlc: () => `${G.gForkTokensDlc.occurrences} src occurrences, `
    + `${(G.gForkTokensDlc.unclassified as Any[]).length} unclassified`,
  gForkTokens: () => `${G.gForkTokens.occurrences} src occurrences, `
    + `${(G.gForkTokens.unclassified as Any[]).length} unclassified — OBM-T1's own inventory`,
  gReproCtbT1: () => `${G.gReproCtbT1.rowsChecked} rows × ${G.gReproCtbT1.fieldsPerRow} fields, `
    + `${G.gReproCtbT1.mismatches} mismatches (signature included)`,
  gReproO2T1: () => `${G.gReproO2T1.rowsChecked} rows, ${G.gReproO2T1.mismatches} mismatches`,
  gRepro173: () => `target ${JSON.stringify(G.gRepro173.target)} vs observed ${JSON.stringify(G.gRepro173.observed)}`,
  gReproGgc: () => `${G.gReproGgc.fieldsChecked ?? ''} committed fields, ${G.gReproGgc.mismatches} mismatches`,
  gReproObmT1: () => `${G.gReproObmT1.absentRowsChecked} + ${G.gReproObmT1.checkAndShowRowsChecked} rows × `
    + `${G.gReproObmT1.fieldsPerRow} fields, ${G.gReproObmT1.absentMismatches} / `
    + `${G.gReproObmT1.checkAndShowMismatches} mismatches (ABSENT / CHECK-AND-SHOW)`,
  xDet: () => `two passes of the whole core, identical digests \`${String(G.xDet.digestA).slice(0, 16)}…\``,
  xFpProd: () => `observed \`${G.xFpProd.observed}\` = baseline (seed ${G.xFpProd.seed}, ${G.xFpProd.seasons} seasons)`,
  xSrcUntouched: () => `\`git diff --stat -- src\` **EMPTY** — no engine byte moved`,
  gAnchor: () => `block ${G.gAnchor.block} against the committed DLC-T1s battery artifact `
    + `(\`${String(G.gAnchor.sourceResultSha).slice(0, 8)}…\`), arm \`${G.gAnchor.sourceArm}\`: `
    + `**${G.gAnchor.rowsChecked} rows × ${G.gAnchor.fieldsPerRow} fields, ${G.gAnchor.mismatches} `
    + `mismatches** (of ${G.gAnchor.committedRowsAvailable} committed rows available) — whole-match `
    + 'signature (rng stream state inside) AND the delivered-strike columns included',
  gDose: () => `belief = the census table zone for zone (${JSON.stringify(G.gDose.beliefDose)}, `
    + `sha \`${String(G.gDose.censusResultSha).slice(0, 8)}…\`); PARITY frozen `
    + `${G.gDose.frozenParity} vs derived ${G.gDose.derivedParity}; gradient rung frozen `
    + `${G.gDose.frozenGradientRung} vs derived ${G.gDose.derivedGradientRung}; zero rung present `
    + `${G.gDose.zeroPresent}; every rung < 0.1 ${G.gDose.allRungsFarBelowOne}; loud factor `
    + `${G.gDose.loudFactorFrozen} ⇒ ${JSON.stringify(G.gDose.loudBelief)}`,
  xNotable: () => `${G.xNotable.filesScanned} \`src/**\` files scanned against `
    + `${G.xNotable.needles.length} needles (the artifact name, the schema name, every zone hazard `
    + 'as written and as a formatted percentage) — **' + `${G.xNotable.hits.length} hits**`,
  flagHygiene: () => `${(G.flagHygiene.identityRows as Any[]).length}/`
    + `${(G.flagHygiene.identityRows as Any[]).length} seeds ⭐⭐ **${G.flagHygiene.identityPair}** — `
    + 'whole-match signature **and** every row field; the doors row: '
    + `dial never armed ${G.flagHygiene.twoDoors.dialNeverArmed} · contest never armed `
    + `${G.flagHygiene.twoDoors.contestNeverArmed} · DV flag matches declaration `
    + `${G.flagHygiene.twoDoors.dvFlagMatchesDeclaration} · DV genes as declared on all six views `
    + `${G.flagHygiene.twoDoors.dvGenesMatchDeclaration} · truth arms carry the census vector `
    + `${G.flagHygiene.twoDoors.truthArmsCarryTheCensusVector}`,
  gArm: () => `plane membership re-derived through the shipped \`groundStrikeGrid\`: `
    + `planeUnmatched ${ARMS.map((a) => G.gArm.arms[a].planeUnmatched).join(' / ')}`,
  seedDisjoint: () => 'every block machine-checked against the complete consumed ledger '
    + `(${(A.gates.seedDisjoint.consumedLedger as Any[]).length} entries, incl. DV-C0's and `
    + "DV-T0's — ⚠ **DV-T0's ordered-skip block 12,430,900–911 among them**); the re-walks land "
    + 'INSIDE their sources under the inverted predicate',
  statsDisjoint: () => `base **${G.statsDisjoint.base}**, min gap **${G.statsDisjoint.minGap}** `
    + `against ${(G.statsDisjoint.published as Any[]).length} published bases`,
};
for (const k of Object.keys(G)) {
  const g = G[k];
  const e = ev[k] ? ev[k]() : (g.note ? String(g.note).slice(0, 220) : 'see the artifact');
  o(`| \`${k}\` | ${g.pass ? '✅ PASS' : '❌ FAIL'} | ${e} |`);
}
o();

/* ----------------------------------------------------------- the doses */
o('### ⭐⭐ THE DOSES AS EXECUTED (G-DOSE)');
o();
o('| arm | `dvDeliveryValue` | `dvLossBelief` | `dvExposureWeight` |');
o('| --- | --- | --- | --- |');
for (const a of ARMS) {
  const dv = A.gates.flagHygiene.armConfigEcho[a].dv;
  o(`| ${LABEL[a]} | ${dv === null ? 'off' : 'ON'} | ${dv === null ? '— (absent)' : JSON.stringify(dv.belief)} `
    + `| ${dv === null ? '— (absent)' : dv.exposure} |`);
}
o();
o(`The belief dose is DV-C0's committed table, read at exam time (${G.gDose.beliefSource}). The `
  + `exposure rungs are derived from published numbers: mean exposure **${G.gDose.meanExposurePublished}** `
  + `and truth-dosed mean risk price **${G.gDose.truthMeanRiskPricePublished}** give PARITY `
  + `**${G.gDose.frozenParity}**; the census's own own/final gradient **${G.gDose.censusGradient}** `
  + `gives the loudest rung **${G.gDose.frozenGradientRung}**; the above-truth arm scales the whole `
  + `census vector by **${G.gDose.loudFactorFrozen}** = 1/hazard(own).`);
o();

/* ------------------------------------------------------- delivered rate */
o('### ⭐⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242, ordered by #250.4)');
o();
o('| arm | strike-time rate (BATTERY GRAIN, all seeds) | live-grid decoded rate (one declared seed) | substitution rate | lockstep |');
o('| --- | ---: | ---: | ---: | --- |');
for (const a of ARMS) {
  const sr = A.strikeRead[a];
  o(`| ${LABEL[a]} | ${G.gArm.arms[a].deliveredRateStrikeTime} | ${n6(sr.deliveredRateLiveGrid)} `
    + `| ${n6(sr.substitutionRate)} | ${sr.lockstepWithUntraced} |`);
}
o();
o('⚠ **READ THE COLUMNS EXACTLY.** The STRIKE-TIME rate is `ledPassesNonZero / passesChosen` '
  + 'across ALL battery seeds with zero percept pulls — the rate the treatment was delivered at in '
  + 'the matches every ruler is computed on. The LIVE-GRID rate is the DLC-T1s decode on ONE '
  + 'declared observational seed, conditioned on decisions where the plane really had another kick '
  + 'to offer. ⚠ Neither is a rate for the RISK PRICE, which is delivered on every priced '
  + 'candidate by construction — they are the PLANE\'s delivery, published because a null must '
  + 'never be read as a strong treatment that failed when it was a treatment that reached the ball '
  + 'on a quarter of kicks.');
o();

/* ------------------------------------------------------------- H-250a */
const H = A.h250aCounterfactual;
o('### ⭐⭐ H-250a AT THIS EXAM\'S OWN DOSES — the one-tick FLIP-vs-SUPPRESS counterfactual');
o();
o(`Seed ${H.seed}; the zero-dosed reference walk ran ${H.referenceTicks} ticks and struck on `
  + `**${H.baseStrikeTicks}** distinct ticks, of which **${H.sampledStrikeTicks}** were sampled `
  + `evenly across the match, plus **${H.sampledNonStrikeTicks}** non-strike ticks for CREATION.`);
o();
o('| dose state | exposure | belief | suppressed | created | **TARGET FLIPS** | aim-only changes | reproduced the reference |');
o('| --- | ---: | --- | ---: | ---: | ---: | ---: | ---: |');
for (const r of H.rows as Any[]) {
  o(`| ${LABEL[r.arm]} | ${r.exposure} | ${r.beliefLabel} | ${r.suppressed}/${r.baseTicks} `
    + `| ${r.created}/${r.nonStrikeTicksSampled} | **${r.targetFlips}/${r.comparedTicks}** `
    + `| ${r.aimChanges} | ${r.referenceReproduced}/${r.baseTicks} |`);
}
o();
o(`⭐ **THE INSTRUMENT'S OWN VALIDITY CHECK: \`nullArmReproducesReference\` = `
  + `${H.nullArmReproducesReference}.** The ZERO-dosed fork must reproduce the reference strike at `
  + 'every sampled tick; a counterfactual whose null arm does not is measuring the fork, not the '
  + 'dose.');
o();
o(`⚠ ${H.inheritedFromT0}`);
o();

/* -------------------------------------------------------------- the JOINT */
o('### ⭐⭐ THE PRE-REGISTERED JOINT — the #244 failure inverted (mechanical flags only, #203)');
o();
o(`> ${P.frozenText}`);
o();
o('| arm | supply Δ vs CONTROL | helpful | supply Δ vs ANCHOR | killed | **LIMB A** | goals/match | in band | bandDist (anchor ' + `${P.allArms[ARMS[1]].goalsBandLimb.bandDistanceAnchor})` + ' | goals Δ vs ANCHOR | toward band resolved | **LIMB B** | **JOINT** |');
o('| --- | --- | :---: | --- | :---: | :---: | ---: | :---: | ---: | --- | :---: | :---: | :---: |');
for (const a of ARMS) {
  if (a === 'absent') continue;
  const j = P.allArms[a];
  const s = j.supplyLimb; const b = j.goalsBandLimb;
  o(`| ${LABEL[a]} | ${s.delta === null ? 'n/a' : `${s.delta} [${s.ci[0]}, ${s.ci[1]}]`} `
    + `| ${yn(s.resolvedHelpful)} | ${ci(s.vsAnchor)} | ${yn(s.resolvedKilledVsAnchor)} `
    + `| ${yn(s.limbA)} | ${b.goalsPerMatch} | ${yn(b.inBand)} | ${b.bandDistance} `
    + `| ${ci(b.goalsVsAnchor)} | ${yn(b.towardBandResolved)} | ${yn(b.limbB)} `
    + `| ${j.jointSatisfied ? '✅ **true**' : '❌ false'} |`);
}
o();
o(`* the frozen band on goals: **[${P.allArms[ARMS[1]].goalsBandLimb.bandLo}, `
  + `${P.allArms[ARMS[1]].goalsBandLimb.bandHi}]** (baseline `
  + `${P.allArms[ARMS[1]].goalsBandLimb.baseline} ± `
  + `${P.allArms[ARMS[1]].goalsBandLimb.toleranceFraction}); the CONTROL is itself in band: `
  + `**${P.allArms[ARMS[1]].goalsBandLimb.controlAlsoInBand}** (the band gates at battery N only, `
  + 'and a dimension the control fails is excluded and disclosed).');
o(`* ⭐ **JOINT at ANY truth-dosed ladder rung = ${P.jointAtAnyLadderRung}** · at EVERY rung = `
  + `${P.jointAtEveryLadderRung}. The ladder is ${JSON.stringify(P.ladderArms)}; \`dvLoud\` is `
  + 'above-truth and INELIGIBLE, `dvTruthPxCas` is the relational pair.');
o(`* the PRIMARY CELL is \`${P.primaryCell}\`: the TRUE MAP ALONE at exposure 0 — the contract's `
  + 'capability question in its cleanest form, with the ladder read beside it per dose '
  + '(#225.3(c)) rather than pooled into it.');
o();
o('#### ⭐ WHAT THE ROWS SAY, STRICTLY AS THE FROZEN PREDICATES READ THEM (still no verdict — #203)');
o();
o(`1. **LIMB B MOVED, AND THIS IS THE FIRST TIME IT HAS.** At every NON-ZERO rung the goals `
  + 'deflation recovers RESOLVEDLY toward the band against the plane-alone anchor — parity '
  + `${ci(P.allArms.dvTruthP.goalsBandLimb.goalsVsAnchor)}, gradient `
  + `${ci(P.allArms.dvTruthG.goalsBandLimb.goalsVsAnchor)} — with band distance falling from the `
  + `anchor's ${P.allArms.planeAnchor.goalsBandLimb.bandDistance} to `
  + `${P.allArms.dvTruthP.goalsBandLimb.bandDistance}. No arm reaches INSIDE the band.`);
o(`2. ⚠ **THE MAP ALONE (exposure 0) DOES NOT DO IT**: at \`dvTruth0\` the goals delta vs the `
  + `anchor is ${ci(P.allArms.dvTruth0.goalsBandLimb.goalsVsAnchor)} — unresolved. On these rows `
  + 'the limb that moves the deflation is the FLIGHT-EXPOSURE one, not the loss-cost belief at '
  + 'truth scale (which DV-T0 §HONESTY 5 said ex ante would be small: ~0.4–1.6 % of a pass\'s '
  + 'base value).');
o(`3. ⚠⚠ **LIMB A IS UNRESOLVED AT THE ANCHOR ITSELF** on these seeds: the plane-alone arm's `
  + `supply delta vs the control is ${P.allArms.planeAnchor.supplyLimb.delta} `
  + `[${P.allArms.planeAnchor.supplyLimb.ci[0]}, ${P.allArms.planeAnchor.supplyLimb.ci[1]}] — the `
  + 'CI touches zero. So the JOINT\'s limb A fails on every ladder rung for a reason that is '
  + 'present BEFORE the risk price: **no arm shows a resolved supply LOSS against the anchor** '
  + '(`resolvedKilledVsAnchor` is false everywhere, and every anchor-referenced supply CI '
  + 'straddles zero). The mechanical `whichLimbFails` string therefore names the F-DV-b SHAPE '
  + 'while the anchor-referenced evidence does NOT show the overcorrection F-DV-b describes. '
  + 'That distinction is the commander\'s to adjudicate; it is printed rather than resolved '
  + 'here.');
o(`4. **THE INTERCEPTION GUARD FALLS MONOTONICALLY WITH DOSE** and breaches nothing: the `
  + 'control-referenced delta goes ' + ARMS.filter((a) => a !== 'absent' && a !== 'dvTruthPxCas')
    .map((a) => String((A.guardVerdicts.tolerances as Any[])
      .find((g: Any) => g.key === 'interceptionsPerMatch').arms[a].delta)).join(' → ')
  + ' across anchor → inert → truth-0 → parity → gradient → loud, every row inside the frozen '
  + 'tolerance.');
o();
o(`⚠ ${P.status}`);
o();

/* --------------------------------------------------------------- guards */
o('### THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)');
o();
o('| guard | direction | control | tolerance | ' + ARMS.filter((a) => a !== 'absent').map((a) => LABEL[a]).join(' | ') + ' |');
o('| --- | --- | ---: | ---: | ' + ARMS.filter((a) => a !== 'absent').map(() => '---').join(' | ') + ' |');
for (const g of A.guardVerdicts.tolerances as Any[]) {
  o(`| \`${g.key}\` | ${g.direction} | ${g.controlLevel} | ±${g.toleranceAbs} | `
    + ARMS.filter((a) => a !== 'absent').map((a) => {
      const r = g.arms[a];
      return `${r.delta} ${r.breach ? '**BREACH**' : r.resolved ? '(resolved)' : ''}`;
    }).join(' | ') + ' |');
}
o();
o('Offsides/match (the #157 FLAG form — a resolved increase returns to the commander and flips no '
  + 'gate): ' + ARMS.filter((a) => a !== 'absent').map((a) => {
    const r = A.guardVerdicts.offside.rows[a];
    return `${a} Δ ${r.delta} resolvedIncrease=${r.resolvedIncrease}`;
  }).join(' · ') + '.');
o();
o(`Equilibrium band — gated dimensions ${JSON.stringify(A.guardVerdicts.band.gatedDimensions)} · `
  + `EXCLUDED (the control itself out of band) ${JSON.stringify(A.guardVerdicts.band.excludedBecauseControlFails)}. `
  + 'All gated dimensions in band, per arm: '
  + ARMS.map((a) => `${a} ${A.guardVerdicts.band.rows[a].allGatedDimensionsInBand}`).join(' · ') + '.');
o();

/* ------------------------------------------------------------- the N rule */
o('### THE N RULE AS EXECUTED (in-probe, from the committed artifacts)');
o();
const nr = A.nRule;
o(`DEFF **${nr.deff}** (${nr.deffProvenance}) — inherited ${nr.deffInherited}, same-world smoke `
  + `${nr.deffSmoke}. q1 ⇒ N ${nr.q1TrueHoldable.n}, q2 ⇒ N ${nr.q2PressedFirstReception.n}, `
  + `binding **${nr.binding}**, nRaw ${nr.nRaw}, **N\\* = ${nr.nStar}**; ledger room `
  + `${nr.batteryRoom} (binds=${nr.roomBinds}), cap ${nr.nCap} (binds=**${nr.capBinds}**). Battery `
  + `block **${nr.batteryBlock}**. \`sourceOfP0\`: ${nr.sourceOfP0}.`);
o();

/* ------------------------------------------------------------ populations */
o('### The populations the CIs are built on');
o();
o('| arm | matches | eligible moments | TRUE-holdable | first receptions | possession ticks | goals |');
o('| --- | ---: | ---: | ---: | ---: | ---: | ---: |');
for (const a of ARMS) {
  const arm = A.arms[a];
  o(`| ${LABEL[a]} | ${arm.matches} | ${arm.ruler1TrueHoldable.eligibleTotal} `
    + `| ${arm.ruler1TrueHoldable.trueHoldableTotal} | ${arm.ruler2PressedFirstReception.firstReceptions} `
    + `| ${arm.ruler3ShortOptionSupply.possessionTicks} | ${arm.ruler5BuildUp.genealogy.goals} |`);
}
o();
o('⚠ **THE INDEX-AXIS FACT STANDS UNRESOLVED, AS FROZEN** (§FACTS 3): the belief was dosed at the '
  + 'RECEPTION zone while the census indexed the LOSS (release) zone. This exam\'s question is the '
  + 'map\'s SHAPE-CAPABILITY, for which the dose is adequate either way; commensurability is '
  + 'DV-T2\'s to resolve first.');
