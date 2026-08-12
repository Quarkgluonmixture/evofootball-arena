/**
 * DV-T2-C0 §RESULT — THE SECTION GENERATOR (the #229.2 rule, discharged in code).
 *
 * Reads the COMMITTED pass-level census artifact and emits the whole §RESULT markdown section on
 * stdout. EVERY measured cell in the published section is printed from this file's reads of the
 * artifact — never typed into the doc by hand. The prose captions are literal strings here, so
 * they ride the generator too and cannot drift away from the numbers they sit beside.
 *
 * This script ADJUDICATES NOTHING (#203). It prints rows, CIs and the mechanical #246 shape flags
 * the probe already computed. No verdict is composed here.
 *
 *   npx tsx scripts/analysis/dv-t2-c0-census-result.ts docs/world-model/data/dv-t2-c0-pass-level-census.json
 */

import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Any = any;

const artifactPath = process.argv[2] ?? 'docs/world-model/data/dv-t2-c0-pass-level-census.json';
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
const gateCount = Object.keys(A.gates).length;

/* ========================================================================== */
o('## §RESULT');
o();
o(`**${int(seeds.n)} seeds × 1 arm (bare production), block ${int(seeds.first)}–${int(seeds.last)}, `
  + `${gateCount}/${gateCount} gates ${A.allGatesPass ? 'PASS' : '*** RED ***'}**, `
  + `\`resultSha256\` \`${String(A.resultSha256).slice(0, 8)}…${String(A.resultSha256).slice(-4)}\`. `
  + 'Every number below is printed by `scripts/analysis/dv-t2-c0-census-result.ts` from the '
  + 'committed artifact; none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o('world            bare production — the SHIPPED game, `new Match({seed, teamA, teamB})`.');
o(`matches          ${int(C.matches)}   (${num(C.simSecondsPerMatch, 2)} sim-seconds each)`);
o(`deliveries       ${int(C.accounting.deliveriesWalked)}   (${num(C.deliveriesPerMatch, 4)} per match, ground passes STRUCK)`);
o(`turnovers        ${int(C.accounting.turnoversTotal)}   (${num(C.turnoversPerMatch, 4)} per match)`);
o(`conceded goals   ${int(C.accounting.concededGoals)}   (${num(C.concededGoalsPerMatch, 4)} per match)`);
o(`primary window   ${primary.windowS} s   (DV-C0's own, itself the #218 census's co-occurrence window)`);
o(`estimator        cluster bootstrap by match seed, ${int(A.frozenDesign.statsBase.resamples)} resamples, `
  + `stats base ${int(A.frozenDesign.statsBase.base)}`);
o('```');
o();

/* --------------------------------------------------------------------- */
o('### ⭐⭐ THE PASS-LEVEL TABLE — the M-DV2.1 label by AIM zone (PRIMARY WINDOW)');
o();
o('A full accounting: every delivery is in exactly one of the three outcome classes. '
  + '**P(punished)** is the marginal rate — the account book\'s own quantity (M-DV2.2) — with the '
  + `paired cluster-bootstrap 95 % CI at the pre-registered **${primary.windowS} s** window.`);
o();
o('| aim zone | deliveries | lost | survived | punished | **P(punished)** | CI 95 % (pp) | P(punished \\| lost) | CI 95 % (pp) |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of [...primary.byZone, primary.all]) {
  o(`| ${ZONE_LABEL[r.zone] ?? r.zone} | ${int(r.deliveries)} | ${int(r.lost)} | ${int(r.survived)} `
    + `| ${int(r.punished)} | **${pp(r.punishRate)}** | ${ci(r.punishRateCi95)} `
    + `| ${pp(r.punishGivenLost)} | ${ci(r.punishGivenLostCi95)} |`);
}
o();
o('The complement rows, as shares of the deliveries into each zone (they sum to 1 with '
  + '`P(punished)` by construction — G-ACCOUNTING checks the partition):');
o();
o('| aim zone | punished | lost-but-unpunished | survived | co-occurrence reading |');
o('|---|---:|---:|---:|---:|');
for (const r of [...primary.byZone, primary.all]) {
  o(`| ${ZONE_LABEL[r.zone] ?? r.zone} | ${pp(r.punishRate)} | ${pp(r.lostUnpunishedRate)} `
    + `| ${pp(r.survivalRate)} | ${pp(r.punishRateCoOccurrence)} |`);
}
o();
o('The **co-occurrence** column is the #218 census\'s many-to-one reading (*was there ANY conceded '
  + 'goal within the window of the chain\'s loss*), published beside every cell as the declared '
  + 'cross-cut; the punished column is the frozen one-to-one nearest-in-window attribution.');
o();

/* --------------------------------------------------------------------- */
o('### ⭐ THE #246 REALITY-SHAPE CHECK — pre-registered, evaluated with CIs');
o();
o('On the **marginal** rate (the primary predicate). An inversion would be published and routed, '
  + 'never corrected into the table.');
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
o('The same three predicates on the **conditional-on-lost** rate (the contract §3 wording\'s '
  + 'cross-cut, published beside the primary and gating nothing):');
o();
o('| window | own − middle (pp) | verdict | middle − final (pp) | verdict | GRADIENT |');
o('|---|---:|---|---:|---|---|');
for (const w of windows) {
  const s = w.realityShape.conditionalOnLost;
  o(`| ${w.windowS} s${w.isPrimary ? ' **(PRIMARY)**' : ''} | ${ppPlain(s.ownVsMiddle.point)} `
    + `| ${VERDICT_MARK[s.ownVsMiddle.verdict]} | ${ppPlain(s.middleVsFinal.point)} `
    + `| ${VERDICT_MARK[s.middleVsFinal.verdict]} | ${VERDICT_MARK[s.gradientTowardOwnGoal]} |`);
}
o();
o(`Routing recorded in the artifact at the primary window: *${primary.realityShape.routing}*`);
o();

/* --------------------------------------------------------------------- */
o('### THE WINDOW LADDER — the table\'s window-dependence, made visible');
o();
o('| window | own | middle | final | all zones |');
o('|---|---:|---:|---:|---:|');
for (const w of windows) {
  const byZone: Record<string, Any> = Object.fromEntries(w.byZone.map((r: Any) => [r.zone, r]));
  o(`| ${w.windowS} s${w.isPrimary ? ' **(PRIMARY)**' : ''} | ${pp(byZone.own.punishRate)} `
    + `| ${pp(byZone.middle.punishRate)} | ${pp(byZone.final.punishRate)} | ${pp(w.all.punishRate)} |`);
}
o();
o('Deliveries and losses do not move with the window — the denominators are the same population at '
  + 'every row (G-ACCOUNTING checks that invariance explicitly); only the punished numerator grows.');
o();

/* --------------------------------------------------------------------- */
o('### ⭐ THE EVENT-RATE MOMENTS — what T2-T1 sizes its run length from');
o();
o('Deliveries per zone **per team per match** (the grain T2-T1\'s arithmetic needs), over '
  + `${int(C.eventRateMoments.byZone[0].observations)} team-match observations per zone.`);
o();
o('| aim zone | mean | SD | CV | min | p10 | median | p90 | max | zero team-matches | punished/team/match |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of C.eventRateMoments.byZone) {
  o(`| ${ZONE_LABEL[r.zone] ?? r.zone} | ${num(r.deliveriesPerTeamPerMatch, 4)} | ${num(r.sd, 4)} `
    + `| ${num(r.cv, 4)} | ${int(r.min)} | ${int(r.p10)} | ${int(r.median)} | ${int(r.p90)} `
    + `| ${int(r.max)} | ${pp(r.zeroShare)} | ${num(r.punishedPerTeamPerMatch, 4)} |`);
}
o();
const T: Any = C.eventRateMoments.allZonesPerTeamPerMatch;
o(`All zones together: **${num(T.deliveriesPerTeamPerMatch, 4)}** deliveries per team per match `
  + `(SD ${num(T.sd, 4)}, median ${int(T.median)}, range ${int(T.min)}–${int(T.max)}).`);
o();
o('⭐ **THE RUN-LENGTH ARITHMETIC** — matches a single team must play for its book to hold K '
  + 'deliveries in each zone, at the measured mean rate. ⚠ A REPORTING GRID: T2-T1 freezes its own '
  + 'K ex ante from these moments, and the dispersion column above is why a mean alone is not '
  + 'enough (the final third\'s CV is the largest and it carries zero-delivery team-matches).');
o();
const kKeys: string[] = Object.keys(C.eventRateMoments.runLength[0].matchesForK);
o(`| aim zone | deliveries/team/match | ${kKeys.map((k) => `matches for ${k.replace('k', 'K = ')}`).join(' | ')} |`);
o(`|---|---:|${kKeys.map(() => '---:').join('|')}|`);
for (const r of C.eventRateMoments.runLength) {
  o(`| ${ZONE_LABEL[r.zone] ?? r.zone} | ${num(r.deliveriesPerTeamPerMatch, 4)} `
    + `| ${kKeys.map((k) => int(r.matchesForK[k])).join(' | ')} |`);
}
o();

/* --------------------------------------------------------------------- */
o('### ⭐ THE CONVERGENCE YARDSTICK — the schema T2-T1 may not re-cut');
o();
const Y: Any = C.yardstick;
o('```json');
o(JSON.stringify({
  schema: Y.schema, frame: Y.frame, index: Y.index, windowS: Y.windowS,
  zones: Y.zones, relative: Y.relative, ordering: Y.ordering,
  baselinePunishRateAllZones: Y.baselinePunishRateAllZones,
}, null, 2));
o('```');
o();
o(`Ordering: **${(Y.ordering as string[]).join(' > ')}**. The \`relative\` vector is the scale-free `
  + 'form — a book that has the right SHAPE but the wrong magnitudes scores well on it and badly on '
  + '`zones`, which is exactly the distinction #247 asks T2-T1 to measure.');
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
    case 'gReproGgc': return `${int(v.fieldsChecked)} integer fields in ${v.families.length} families, **${int(v.mismatches)} mismatches**, block ${v.block} (${v.sourceArm})`;
    case 'gReproDvc0': return `${int(v.fieldsChecked)} integer fields in ${v.families.length} families, **${int(v.mismatches)} mismatches**, block ${v.block} — DV-C0's own smoke rows`;
    case 'gWindowTrace': return `primary ${v.primaryWindowS} s = DV-C0's committed primary · member of the #218 family \`${JSON.stringify(v.family)}\` · ladder \`${JSON.stringify(v.windowsS)}\` = DV-C0's, all multiples of ${v.familyMin}`;
    case 'gZoneTrace': return `±${num(v.thirdLocalX, 4)} m = \`${v.thirdFormula}\` = the seat's \`DV_THIRD_BOUNDARY_LOCAL_X\` = DV-C0's committed ${num(v.dvc0Boundary, 4)} · ${int(v.sweepSamples)} swept samples, ${int(v.sweepDisagreements)} disagreements`;
    case 'gWrapperInert': return `seed ${int(v.seed)}: wrapped digest \`${String(v.digestWrapped).slice(0, 12)}…\` = bare · ${int(v.deliveriesWrapped)} deliveries captured wrapped vs ${int(v.deliveriesBare)} bare`;
    case 'gWorld': return `${int(v.genomeViewsChecked)} genome views gene-free · no MT flag · no stage flag (incl. \`dvDeliveryValue\`, \`o1PassWindup\`) · eye null · readback 0`;
    case 'gSeedDisjoint': return `${int(v.walkedBlocks.length)} blocks machine-checked (${v.walkedBlocks.filter((b: Any) => b.kind === 're-walk').length} re-walks, predicates inverted); block ${v.block}; skip band ledgered ${v.skipBandLedgered}; T1c ledgered ${v.t1cLedgered}`;
    case 'gStatsDisjoint': return `base ${int(v.base)}, minGap ${int(v.minGap)} ≥ 200`;
    case 'gCleanInvocation': return `envN ${String(v.envN)} · capped ${v.capped} · skipFp ${v.skipFp} · routedToGuardBlock ${v.routedToGuardBlock}`;
    case 'gNDerived': return `ran N ${int(v.ranN)} = derived N\\* ${int(v.derivedNStar)}`;
    case 'gAccounting': return `ticks ${v.ticksIdentity} · one-to-one ${v.oneToOne} · delivery assignment ${v.deliveryFullyAssigned} · zone partition ${v.deliveryZonePartition} · outcome partition ${v.deliveryOutcomePartition} · punished ⊆ lost ${v.punishedSubsetLost} · lost invariant in window ${v.lostInvariantInWindow} · no led strikes ${v.noLedStrikes} · windup shut ${v.windupShutEverywhere}`;
    case 'gValuesUnreachable': return `${int(v.filesScanned)} src files scanned · ${int(v.needles.length)} needles (raw 5-dp + formatted %) · ${int(v.hits.length)} hits · control needle found ${v.controlFound}`;
    case 'gMutants': return `**${int(v.conjunctsCovered)} conjuncts, ${int(v.dead)} dead** — every conjunct of every composite gate carries its own mutant`;
    default: return '';
  }
};
for (const [k, v] of Object.entries(A.gates) as [string, Any][]) {
  o(`| \`${k}\` | ${v.pass ? '**PASS**' : '*** FAIL ***'} | ${gateEvidence(k, v)} |`);
}
o();

/* --------------------------------------------------------------------- */
o('### THE ACCOUNTING IDENTITIES (gate input — ticks, chains, deliveries and goals, not football)');
o();
const acc: Any = C.accounting;
o('```text');
o(`ticks         ${int(acc.totalTicks)} = segment ${int(acc.segmentTicks)} + loose ${int(acc.looseGapTicks)} `
  + `+ deadBall ${int(acc.deadBallTicks)}   ⇒ ${acc.deadBallTicks + acc.segmentTicks + acc.looseGapTicks === acc.totalTicks ? 'ok' : 'BROKEN'}`);
o(`no overlap    assignedTicksSum ${int(acc.assignedTicksSum)} = segmentTicks ${int(acc.segmentTicks)}`
  + `   · spanOrderViolations ${int(acc.spanOrderViolations)}`);
o(`turnovers     walked ${int(acc.turnoversTotal)} = ledgered ${int(acc.turnoversLedgered)}`);
o(`goals         conceded ${int(acc.concededGoals)} = score deltas ${int(acc.goalsFromScore)} `
  + `· doubleAttributed ${int(acc.doubleAttributed)}`);
for (const w of acc.perWindow) {
  o(`  @${String(w.windowS).padStart(2)} s       attributed ${String(int(w.attributed)).padStart(5)} `
    + `+ unattributed ${String(int(w.unattributed)).padStart(5)} = ${int(acc.concededGoals)}`
    + `   · Σ loss cells ${int(w.attributedInLossCells)}`);
}
o(`deliveries    walked ${int(acc.deliveriesWalked)} = assigned ${int(acc.deliveriesAssigned)} `
  + `+ unassigned ${int(acc.deliveriesUnassigned)} = Σ over the three aim zones ${int(acc.deliveriesInZonesPrimary)}`);
o(`outcomes      punished ${int(acc.outcomeTotals.punished)} + lost-unpunished ${int(acc.outcomeTotals.lostUnpunished)} `
  + `+ survived ${int(acc.outcomeTotals.survived)} = ${int(acc.deliveriesWalked)}   ⇒ a PARTITION`);
o(`survived by   deadBall ${int(acc.survivedBy.deadBall)} · goal FOR ${int(acc.survivedBy.goal)} `
  + `· full time ${int(acc.survivedBy.matchEnd)}`);
o(`punished ⊆ lost   punished ${int(acc.punishedPrimary)} ≤ lost ${int(acc.lostPrimary)} (primary window)`);
for (const w of acc.punishedByWindow) {
  o(`  @${String(w.windowS).padStart(2)} s       punished deliveries ${String(int(w.punished)).padStart(5)} `
    + `· lost ${int(w.lost)} (INVARIANT in the window)`);
}
o(`family        led strikes ${int(acc.ledStrikes)} · team mismatches ${int(acc.deliveryTeamMismatch)} `
  + `· matches with the windup door open ${int(acc.matchesWithWindupOpen)} `
  + `· suppressed performPass calls ${int(acc.suppressedPassCalls)}`);
o('```');
o();

/* --------------------------------------------------------------------- */
o('### THE N RULE AS EXECUTED (in-probe, from the committed smoke)');
o();
const N: Any = A.frozenDesign.nRule;
o('```text');
o(`rule            ${N.arithmetic}`);
o(`smoke artifact  ${N.smokeArtifact}  (sha256 ${String(N.smokeArtifactSha256).slice(0, 16)}…)`);
o(`rarest-zone events/match ${num(N.rarestZoneEventsPerMatch, 5)}  ⇒ raw ${int(N.nRaw)} → step ${int(N.nStepped)}`
  + `   · precision term unbounded: ${N.precisionTermUnbounded}`);
o(`wall term ${int(N.nWall)} · cap ${int(N.nCap)}   ⇒ N* ${int(N.nStar)}  (${N.bindingTerm} binds; `
  + `projected ${num(N.projectedWallHours, 3)} h)`);
o(`as executed     N ${int(A.result.seeds.n)} · ms/match ${num(A.sizing.msPerMatch, 1)} `
  + `· rarest-zone events/match at battery ${num(A.sizing.rarestZoneEventsPerMatch, 5)}`);
o('```');
o();
const rarest = Math.min(...primary.byZone.map((r: Any) => r.punished as number));
const target = N.targetRarestZoneEvents as number;
o(`The rarest AIM zone at the primary window carries **${int(rarest)}** punished deliveries against `
  + `the rule's target of ${int(target)} — `
  + (rarest >= target
    ? 'the target is met.'
    : `**a shortfall of ${int(target - rarest)}**: the smoke's rate estimate `
      + `(${num(N.rarestZoneEventsPerMatch, 5)}/match) ran ahead of the battery's realised `
      + `${num(A.sizing.rarestZoneEventsPerMatch, 5)}/match, so the realised relative SE on that `
      + `cell is ≈ ${num(100 / Math.sqrt(Math.max(1, rarest)), 1)} % rather than the rule's `
      + `≈ ${num(100 / Math.sqrt(target), 1)} %. It is recorded, NOT repaired: re-sizing N after `
      + 'seeing the table is exactly what the pre-registration forbids, and `gNDerived` proves the '
      + 'N that ran is the frozen rule\'s own output.'));
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
