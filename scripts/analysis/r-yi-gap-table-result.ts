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
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import { ARM_DEFINITIONS, ARMS, CLOCK_LAW, CONTEXT_KEYS, QUANTITIES } from '../probes/rYiQuantities';

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
  o('| id | the quantity, in football words | unit | clock | REAL | band shape | conf | from | STATUS |');
  o('|---|---|---|---|---|---|---|---|---|');
  for (const q of QUANTITIES) {
    const from = q.real.inherited === '#170' ? `#170 ${q.real.b170 ?? ''}`.trim()
      : q.real.inherited === 'new' ? 'sourced this round' : '—';
    o(`| ${q.id} | ${cell(q.name)} | ${cell(q.unit)} | ${q.clock} | ${cell(q.real.text)} `
      + `| ${q.real.bandKind} | ${q.real.confidence} | ${from} | ${q.status} |`);
  }
  o();
  o('### §1.0 ⭐⭐ THE DECLARED CLOCK CONVENTION (fixed of record #272.3→ (ii))');
  o();
  o('```text');
  o(`mapping        ${CLOCK_LAW.mapping}`);
  o(`convention A   ${CLOCK_LAW.conventionA}`);
  o(`convention B   ${CLOCK_LAW.conventionB}`);
  o(`the law        ${CLOCK_LAW.law}`);
  o(`distance basis ${CLOCK_LAW.declaredDistanceBasis} — ${CLOCK_LAW.whyThatBasis}`);
  o('```');
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
    o(`* **${q.id}** (${q.real.confidence}, band shape **${q.real.bandKind}**) — ${q.real.source}`
      + (q.real.bandReceipt === '' ? '' : `  \n  ⭐ BAND RECEIPT: ${q.real.bandReceipt}`));
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

/* --------- ⭐⭐ --epoch1-corrections: the QUARANTINED epoch-1 rows, re-read ----- */
/**
 * Reads the COMMITTED epoch-1 artifact and prints what the corrections of record (#272.3) make of
 * it, from stored cells only — nothing re-walked, nothing typed. Three things:
 *   (1) Q10/Q11 RE-KEYED. Epoch 1 has no per-knock challenger count (the counter did not exist),
 *       so the commensurable reading is published as a BOUND derived from the stored aggregates,
 *       exactly as the commander's own arithmetic did. An EXACT epoch-1 re-key would require
 *       re-walking that band on the PRE-POLISH build and is not this step's authorisation.
 *   (2) BOTH CLOCK AXES for every epoch-1 row.
 *   (3) The POINT-FAITHFUL REAL column: epoch-1 points re-read against the corrected bands.
 */
if (process.argv[2] === '--epoch1-corrections') {
  const path = process.argv[3];
  const A1: Any = JSON.parse(readFileSync(path, 'utf8'));
  const R1: Any = A1.result;
  const f = (90 * 60) / MATCH_DURATION;
  o('### ⭐⭐ THE CORRECTED EPOCH-1 READINGS (label `' + R1.run.label + '`, from the committed artifact)');
  o();
  o('#### (1) Q10 / Q11 re-keyed — a BOUND, because epoch 1 could not count contested knocks');
  o();
  o('```text');
  for (const arm of ARMS) {
    const cells: Any[] = R1.perCluster[arm];
    const knocks = cells.reduce((a, c) => a + c.cb.touchPasts, 0);
    const challengers = cells.reduce((a, c) => a + c.cb.touchPastChallengers, 0);
    const clean = cells.reduce((a, c) => a + c.cb.touchPastCleanBeats, 0);
    const beaten = cells.reduce((a, c) => a + c.cb.touchPastBeaten, 0);
    const contestedMax = Math.min(knocks, challengers);
    const uncontestedMin = Math.max(0, knocks - challengers);
    o(`${arm.padEnd(6)} knocks ${int(knocks)} · challenger-slots ${int(challengers)} · clean beats ${int(clean)} · beaten bodies ${int(beaten)}`);
    if (knocks > 0) {
      o(`       contested knocks ≤ ${int(contestedMax)}   (one challenger per contested knock at most)`);
      o(`       UNCONTESTED knocks ≥ ${int(uncontestedMin)} = ${num(uncontestedMin / knocks, 4)} of the epoch-1 Q10 count`);
      o(`       Q11 as published (clean / ALL knocks)  ${num(clean / knocks, 4)}`);
      o(`       Q11 re-keyed (clean / CONTESTED)       ≥ ${num(clean / contestedMax, 4)}`);
    }
  }
  o('```');
  o();
  o('#### (2) both clock axes on every epoch-1 row');
  o();
  o('| id | clock | bare A | bare B | CB A | CB B |');
  o('|---|---|---|---|---|---|');
  for (const q of QUANTITIES) {
    const conv = (arm: string): [number, number] => {
      const r = R1.ours[arm].quantities[q.id];
      if (r === undefined || !Number.isFinite(r.point)) return [Number.NaN, Number.NaN];
      const p = r.point as number;
      if (q.clock === 'invariant') return [p, p];
      return q.clock === 'duration' ? [p, p * f] : [p * f, p];
    };
    const [ba, bb] = conv('bare'); const [ca, cb2] = conv('cb');
    o(`| ${q.id} | ${q.clock} | ${num(ba)} | ${num(bb)} | ${num(ca)} | ${num(cb2)} |`);
  }
  o();
  o('#### (3) the point-faithful REAL column, applied to the epoch-1 points');
  o();
  o('| id | band shape | REAL | bare (basis A) | CB (basis A) | the OTHER clock (B): bare / CB |');
  o('|---|---|---|---|---|---|');
  for (const q of QUANTITIES) {
    if (q.real.lo === null || q.real.hi === null) continue;
    const lo = q.real.lo; const hi = q.real.hi;
    const isPoint = q.real.bandKind === 'citedPoint' || q.real.bandKind === 'derivedPoint';
    const read = (arm: string, conv: 'A' | 'B'): string => {
      const r = R1.ours[arm].quantities[q.id];
      if (r === undefined || !Number.isFinite(r.point)) return 'n/a';
      let p = r.point as number;
      let ciL = r.ci95[0] as number; let ciH = r.ci95[1] as number;
      if (q.id === 'Q21') {
        // the nominal-clock re-basing, from the stored cells
        const cells: Any[] = R1.perCluster[arm];
        const dead = cells.reduce((a: number, c: Any) => a + (c.totalTicks - c.inPlayTicks), 0);
        p = dead / (cells.length * (MATCH_DURATION / DT));
        const g = (MATCH_DURATION / DT) / (cells.reduce((a: number, c: Any) => a + c.totalTicks, 0) / cells.length);
        ciL *= g; ciH *= g;
      }
      // ⭐ the clock arithmetic, applied to the epoch-1 point exactly as the fixed instrument does
      const k = q.clock === 'invariant' ? 1
        : q.clock === 'duration' ? (conv === 'A' ? 1 : f)
          : (conv === 'A' ? f : 1);
      p *= k; ciL *= k; ciH *= k;
      if (isPoint) {
        const contains = ciL <= lo && ciH >= lo;
        return `${(p / lo).toFixed(2)}× the cited point · CI ${contains ? 'CONTAINS' : 'EXCLUDES'} it`;
      }
      if (p >= lo && p <= hi) return 'INSIDE';
      const edge = p < lo ? lo : hi;
      const overlaps = ciH >= lo && ciL <= hi;
      return `${(p / edge).toFixed(2)}× the ${p < lo ? 'LOW' : 'HIGH'} edge${overlaps ? ' (CI overlaps)' : ''}`;
    };
    o(`| ${q.id} | ${q.real.bandKind} | ${cell(q.real.text)} | ${read('bare', 'A')} | ${read('cb', 'A')} `
      + `| ${read('bare', 'B')} / ${read('cb', 'B')} |`);
  }
  process.exit(0);
}

/* ---------- ⭐⭐ --drift: the RE-RUN CLAUSE's own deliverable, epoch vs epoch ---- */
/**
 * Prints the drift between two committed epoch artifacts, per (arm, quantity), on the row's
 * NATIVE reading. It ADJUDICATES NOTHING (#203) and marks the rows whose INSTRUMENT changed
 * between the epochs — those are not drift, they are a different measurement.
 */
if (process.argv[2] === '--drift') {
  const A0: Any = JSON.parse(readFileSync(process.argv[3], 'utf8'));
  const B0: Any = JSON.parse(readFileSync(process.argv[4], 'utf8'));
  const changedInstrument = new Set(['Q10', 'Q11', 'Q20']);
  o(`### ⭐ DRIFT — \`${A0.result.run.label}\` → \`${B0.result.run.label}\` (reported, never adjudicated)`);
  o();
  o('| id | quantity | bare: epoch 1 → 2 | Δ | CB: epoch 1 → 2 | Δ | note |');
  o('|---|---|---|---|---|---|---|');
  for (const q of QUANTITIES) {
    const cellFor = (arm: string): string => {
      const a = A0.result.ours[arm].quantities[q.id];
      const b = B0.result.ours[arm].quantities[q.id];
      if (a === undefined || b === undefined) return 'n/a | n/a';
      const d = (b.point as number) - (a.point as number);
      return `${num(a.point)} → ${num(b.point)} | ${Number.isFinite(d) ? (d >= 0 ? '+' : '') + d.toFixed(4) : 'n/a'}`;
    };
    o(`| ${q.id} | ${cell(q.name)} | ${cellFor('bare')} | ${cellFor('cb')} `
      + `| ${changedInstrument.has(q.id) ? '⚠ INSTRUMENT CHANGED — not drift' : ''} |`);
  }
  o();
  o('| context key | bare: epoch 1 → 2 | CB: epoch 1 → 2 |');
  o('|---|---|---|');
  for (const k of CONTEXT_KEYS) {
    const g = (art: Any, arm: string): string => {
      const v = art.result.ours[arm].context[k.key];
      return typeof v === 'number' ? num(v, 4) : v !== null && typeof v === 'object' && 'point' in v ? num(v.point) : '—';
    };
    o(`| \`${k.key}\` | ${g(A0, 'bare')} → ${g(B0, 'bare')} | ${g(A0, 'cb')} → ${g(B0, 'cb')} |`);
  }
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
o(`clock convention  1 sim-second = ${num(F.matchClock.displaySecondsPerSimSecond, 4)} display-seconds  `
  + `(${F.matchClock.displayMinutesTrace} · ${F.matchClock.matchDurationTrace})`);
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
o('| id | quantity | clock | OURS (bare) A / B | OURS (CB-armed) A / B | REAL | conf | STATUS |');
o('|---|---|---|---|---|---|---|---|');
for (const q of QUANTITIES) {
  const b = R.ours.bare.quantities[q.id];
  const c = R.ours.cb.quantities[q.id];
  const fmtCell = (r: Any): string => {
    if (r === undefined) return 'n/a';
    const rd = r.readings;
    if (rd === undefined) return `${num(r.point)} ${ci(r.ci95)}`;
    if (rd.dimension === 'invariant') return `${num(rd.conventionA.point)} ${ci(rd.conventionA.ci95)} (both)`;
    return `${num(rd.conventionA.point)} ${ci(rd.conventionA.ci95)} / ${num(rd.conventionB.point)} ${ci(rd.conventionB.ci95)}`;
  };
  o(`| ${q.id} | ${cell(q.name)} | ${q.clock} | ${fmtCell(b)} | ${fmtCell(c)} | ${cell(q.real.text)} `
    + `| ${q.real.confidence} | ${q.status} |`);
}
o();
o('⭐ **EVERY ROW CARRIES BOTH CLOCK READINGS** (fixed of record #272.3→ (ii)): `A` = sim time '
  + 'taken literally, `B` = the display clock (our match IS the 90′). `invariant` rows read the '
  + 'same on both. Units are §1\'s; every interval is a 95 % cluster-bootstrap percentile CI over '
  + 'match seeds.');
o();
o('### DISTANCE FROM THE REAL VALUE — mechanical, no verdict, ONE declared clock');
o();
o('⭐⭐ **THE DECLARED BASIS IS CONVENTION ' + CLOCK_LAW.declaredDistanceBasis + '** — '
  + CLOCK_LAW.whyThatBasis + ' The OTHER convention is printed beside it for every row, so a '
  + 'cross-row PATTERN can never again be assembled out of two different clocks (epoch 1\'s '
  + '"every row sits below real" was exactly that artifact, #272.3→ (ii)).');
o();
o('⭐ Where the REAL value is a cited **POINT** (band shape `citedPoint` / `derivedPoint`), the '
  + 'reading is `ours ÷ the point` plus whether our 95 % CI CONTAINS the point — there is no band '
  + 'to "overlap" and no width to hide an exclusion behind (#272.3→ (iii), (iv)).');
o();
o('| id | quantity | basis (A) bare | basis (A) CB | REAL on A | bare vs REAL | CB vs REAL | the OTHER clock (B): bare / CB vs REAL |');
o('|---|---|---|---|---|---|---|---|');
for (const q of QUANTITIES) {
  if (q.real.lo === null || q.real.hi === null) continue;
  const lo = q.real.lo; const hi = q.real.hi;
  const isPoint = q.real.bandKind === 'citedPoint' || q.real.bandKind === 'derivedPoint';
  const pick = (r: Any, conv: 'A' | 'B'): Any => {
    if (r === undefined) return undefined;
    // ⭐ Q21's like-for-like reading is the NOMINAL-clock re-basing (#272.3→ (vi)).
    const base = q.id === 'Q21' && r.extra?.onNominalClock !== undefined
      ? { readings: undefined, point: r.extra.onNominalClock.point, ci95: r.extra.onNominalClock.ci95 }
      : r;
    if (base.readings === undefined) return { point: base.point, ci95: base.ci95 };
    return conv === 'A' ? base.readings.conventionA : base.readings.conventionB;
  };
  const read = (rd: Any): string => {
    if (rd === undefined || !Number.isFinite(rd.point)) return 'n/a';
    const p = rd.point as number;
    const ciL = rd.ci95[0] as number; const ciH = rd.ci95[1] as number;
    if (isPoint) {
      const contains = Number.isFinite(ciL) && Number.isFinite(ciH) && ciL <= lo && ciH >= lo;
      return `${(p / lo).toFixed(2)}× the cited point${contains ? ' · CI CONTAINS it' : ' · CI EXCLUDES it'}`;
    }
    if (p >= lo && p <= hi) return 'INSIDE';
    const edge = p < lo ? lo : hi;
    const overlaps = Number.isFinite(ciL) && Number.isFinite(ciH) && ciH >= lo && ciL <= hi;
    return `${(p / edge).toFixed(2)}× the ${p < lo ? 'LOW' : 'HIGH'} edge${overlaps ? ' (CI overlaps)' : ''}`;
  };
  const bA = pick(R.ours.bare.quantities[q.id], 'A');
  const cA = pick(R.ours.cb.quantities[q.id], 'A');
  const bB = pick(R.ours.bare.quantities[q.id], 'B');
  const cB = pick(R.ours.cb.quantities[q.id], 'B');
  o(`| ${q.id} | ${cell(q.name)} | ${num(bA?.point)} | ${num(cA?.point)} `
    + `| ${isPoint ? num(lo) : `${num(lo)}–${num(hi)}`} | ${read(bA)} | ${read(cA)} `
    + `| ${read(bB)} / ${read(cB)} |`);
}
o();
o('⚠ Q21 is read on its NOMINAL-clock re-basing in this table: the real value is a share of the '
  + 'nominal 90 while our headline divides the elapsed pause-inclusive clock (#272.3→ (vi)).');
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
  xSrcCleanTree: '`git diff --stat -- src` empty — the working tree\'s src IS the committed engine the battery walked',
  gAdditiveCounter: `${Object.keys(G.gAdditiveCounter?.conjuncts ?? {}).length} conjuncts — \`${G.gAdditiveCounter?.field}\` written ONCE inside \`performTouchPast\`, read NOWHERE in src, zero on a fresh match and through the whole OFF walk`,
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
  gRealHonest: `${int(G.gRealHonest.rows)} rows · ${JSON.stringify(G.gRealHonest.byConfidence)} · ⭐ all ${int(G.gRealHonest.inherited)} #170-inherited bands re-checked against the committed tempo artifact · ⭐⭐ bandFidelity over ${int((G.gRealHonest.bandChecks ?? []).length)} sourced rows ${JSON.stringify(G.gRealHonest.bandKinds ?? {})}`,
  gValuesNotImported: `${int(G.gValuesNotImported.filesScanned)} src files · ${int(G.gValuesNotImported.needleCount)} needles · ${int(G.gValuesNotImported.coincidentalHits)} coincidental hits REPORTED (not gated); the gated conjunct is the clean tree, and the round's one src change is carried by \`gAdditiveCounter\``,
  gLedgerAppend: `${int(G.gLedgerAppend.rowsAppended)} rows + ${int(G.gLedgerAppend.supersessionsAppended)} SUPERSESSIONS of \`${G.gLedgerAppend.supersededEpoch}\` appended under \`${R.run.label}\` · duplicate-label refusal exercised live · a supersession line proven not to count as a row-set · ${int(G.gLedgerAppend.rowsPreserved)} prior lines preserved`,
  gMutants: `⭐⭐ **${int(G.gMutants.mutantsRun)} mutants, ${int(G.gMutants.live)} LIVE, ${int(G.gMutants.dead)} dead, ${int(G.gMutants.imprecise)} imprecise** — EXACTLY-ONE **ENFORCED** (each flips its own conjunct AND leaves every sibling unchanged) · ${int(G.gMutants.conjunctsEnumerated)} conjuncts enumerated from ${int(G.gMutants.coverage.length)} gate objects · uncovered ${int(G.gMutants.uncoveredConjuncts.length)} · stray ${int(G.gMutants.strayMutants.length)}`,
};
for (const k of A.gateNames as string[]) {
  o(`| \`${k}\` | **${G[k].pass ? 'PASS' : 'RED'}** | ${ev[k] ?? ''} |`);
}
o();
o(`⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's \`gates\` object carries exactly `
  + `**${int(A.gateCount)}** keys — \`${(A.gateNames as string[]).join(' · ')}\` — and `
  + `**${int((A.gateNames as string[]).filter((k) => G[k].pass).length)}** of them pass.`);
o();
o('### ⭐⭐ SUPERSESSIONS OF RECORD — appended, never edited');
o();
o('The epoch-1 lines stay on disk exactly as written. These new ledger lines say what about them '
  + 'no longer stands, and which epoch replaces it (one line per arm × row).');
o();
o('| row | field | was | now | ruling | why |');
o('|---|---|---|---|---|---|');
for (const sup of (F.supersessions ?? []) as Any[]) {
  o(`| ${sup.id} | ${cell(sup.field)} | ${cell(JSON.stringify(sup.was))} | ${cell(JSON.stringify(sup.now))} `
    + `| ${sup.ruling} | ${cell(sup.reason)} |`);
}
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
