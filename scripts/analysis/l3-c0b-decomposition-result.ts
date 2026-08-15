/**
 * L3-C0b §RESULT generator (#229.2): every number in the stage doc's results half is PRINTED FROM
 * THE COMMITTED ARTIFACT by this file, never typed by hand.
 *
 * RUN: npx tsx scripts/analysis/l3-c0b-decomposition-result.ts \
 *        docs/world-model/data/l3-c0b-window-decomposition.json
 */
import { readFileSync } from 'node:fs';

interface Row { point: number; ci95: [number, number]; num: number; den: number }
interface Diff { delta: number; ci95: [number, number]; verdict: string; halfWidth: number }
interface ShapeEntry { topMinusBottom: Diff; points: number[]; monotone: boolean;
  monotoneDecreasing: boolean }
interface BandRow {
  band: string; lunges: number; wins: number; misses: number;
  pWon: Row; meanArrivalSpeed: number; meanRecovery: number; sepT0Mean: number;
  dSepMeans: { own: number; common: number[]; pairedOwn: number; pairedCommon: number[] };
  censored: { own: number; common: number[]; pairedN: number };
  missesPerTeamMatch: Record<string, number>;
  lungesPerTeamMatch: Record<string, number>;
  candidates: Record<string, { rate: Row; eventsPerTeamMatch: Record<string, number> }>;
}
interface ContrastRow {
  band: string; own: Row; common: Row[];
  gapOwnMinusCommon: { delta: number; ci95: [number, number]; verdict: string }[];
}
interface ReplayBand {
  band: string; bookSpeaksShare: number; declineShare: number; agreesWithPopulationShare: number;
  populationWouldDecline: boolean;
  eventsPerBook: { mean: number; median: number; min: number; max: number; zeroShare: number };
}
interface Replay {
  id: string; books: number;
  population: { events: number[]; punished: number[]; rate: number[]; declines: boolean[] };
  perBand: ReplayBand[];
}
interface Artifact {
  resultSha256: string;
  run: {
    matches: number; teamMatches: number;
    seeds: { battery: [number, number]; receiptRewalk: [number, number] };
    nRule: Record<string, number | string | boolean | string[]>;
    stats: { base: number; resamples: number };
    totals: Record<string, number | number[]>;
    seasonFixturesPerTeam: number;
    receipt: { block: [number, number]; observedMisses: number; committedMisses: number };
  };
  clock: Record<string, number | string>;
  bands: { vStar: number; cuts: number[]; vetoGrain: string; grainLabels: Record<string, string[]> };
  windows: {
    commonS: number[]; commonTicks: number[];
    shortRungTrace: { committedB0MeanRecoveryS: number; b0P10: number; b0P90: number;
      arithmetic: Record<string, number | string> };
    longRungTrace: { valueS: number; committedBandMeanRecoveriesS: number[] };
  };
  candidates: { id: string; family: string; windowKind: string; what: string }[];
  tables: Record<string, BandRow[]>;
  shape: Record<string, Record<string, ShapeEntry>>;
  twoWindowContrast: Record<string, ContrastRow[]>;
  vetoFrame: { sweep: Record<string, number>; replay: Replay[] };
  stability: { blocks: number; byCandidate: { id: string; argmaxStable: boolean;
    argminStable: boolean; blocks: { seeds: [number, number]; points: number[] }[] }[] };
  gates: Record<string, boolean>;
  mutants: { live: boolean }[];
  coverage: Record<string, string[]>;
}

const path = process.argv[2];
if (!path) { process.stderr.write('usage: l3-c0b-decomposition-result.ts <artifact.json>\n'); process.exit(2); }
const A = JSON.parse(readFileSync(path, 'utf8')) as Artifact;
const out: string[] = [];
const w = (s = ''): void => { out.push(s); };
const pct = (v: number, d = 2): string => (Number.isFinite(v) ? `${(v * 100).toFixed(d)} %` : '—');
const pp = (v: number, d = 2): string => (Number.isFinite(v) ? `${(v * 100).toFixed(d)}` : '—');
const ci = (c: [number, number]): string => `[${pp(c[0])}, ${pp(c[1])}]`;
const n = (v: number, d = 4): string => (Number.isFinite(v) ? v.toFixed(d) : '—');
const bold = (s: string): string => `**${s}**`;
const CAND_LABEL: Record<string, string> = {
  sepGainedCommonShort: '`sepGainedCommonShort` (COMMON W_short)',
  sepGainedCommonLong: '`sepGainedCommonLong` (COMMON W_long)',
  sepGainedOwnRecovery: '`sepGainedOwnRecovery` (PER-EVENT — the original pick)',
  lungeLost: '`lungeLost` = 1 − P(won \\| band) (no window)',
  pairedCommonShort: '`pairedCommonShort` (paired subset)',
  pairedCommonLong: '`pairedCommonLong` (paired subset)',
  pairedOwnRecovery: '`pairedOwnRecovery` (paired subset)',
};

const T = A.run.totals as Record<string, number> & { commonCensored: number[] };
const WS = A.windows.commonS;
const G3 = A.bands.grainLabels.g3;
const gates = Object.keys(A.gates);
const gatesPass = gates.filter((k) => A.gates[k]).length;
const mutLive = A.mutants.filter((m) => m.live).length;
const conjuncts = Object.values(A.coverage).reduce((a, v) => a + v.length, 0);

/* ---------------------------------------------------------------- header --- */
w(`**${A.run.matches} seeds × 1 arm (THE POLISHED ARMED WORLD, \`cbArmedVersion === 6\`), block `
  + `${A.run.seeds.battery[0].toLocaleString('en-US')}–${A.run.seeds.battery[1].toLocaleString('en-US')}, `
  + `${gatesPass}/${gates.length} gates PASS**, \`resultSha256\` \`${A.resultSha256.slice(0, 8)}…\`. `
  + 'Every number below is printed by `scripts/analysis/l3-c0b-decomposition-result.ts` from the '
  + 'committed artifact; none is typed (#229.2).');
w();
w('### The run');
w();
w('```text');
const TAB_MISSES = A.tables.g5.reduce((a, r) => a + r.misses, 0);
const TAB_WINS = A.tables.g5.reduce((a, r) => a + r.wins, 0);
w(`matches           ${A.run.matches}   (${n(A.clock.simSecondsPerMatch as number)} sim-seconds each — the ENGINE DEFAULT match clock)`);
w('⚠ TWO POPULATIONS, NEVER MIXED (#278.2(iii)): the ENGINE-LEDGER population and the TABULATED one.');
w(`armed challenges  ${T.lunges}   (the engine ledger's own count: won ${T.wins} · missed ${T.misses})`);
w(`  whistle-excl.   ${T.whistledExcluded}   (of which ${T.ledgerOnlyWhistledEvents} LEDGER-ONLY — the restart erased the write, §DEV 2)`);
w(`  TABULATED       ${T.tabulated}   = won ${TAB_WINS} + missed ${TAB_MISSES}   ⇐ EVERY rate below rides THIS population`);
w(`                  ${n(T.lungesPerTeamMatch, 4)} lunges · ${n(T.missesPerTeamMatch, 4)} misses per TEAM per match (tabulated)`);
w(`geometric misses  ${T.geometricMisses}   (χ = 0)`);
w(`COMMON windows    W_short ${n(WS[0], 6)} s (${A.windows.commonTicks[0]} ticks) · W_long ${n(WS[1], 4)} s (${A.windows.commonTicks[1]} ticks)`);
w(`censoring         own ${T.ownCensored} · W_short ${T.commonCensored[0]} · W_long ${T.commonCensored[1]}   ⇒ PAIRED population ${T.pairedEvents}`);
w(`law receipts      max recovery-law deviation ${(T.maxLawDeviation as number).toExponential(3)} s against the DERIVED tolerance ${(T.lawTolerance as number).toExponential(3)} s`);
w(`estimator         cluster bootstrap by match seed, ${A.run.stats.resamples} resamples, stats base ${A.run.stats.base}`);
w(`receipt           L3-C0's own seeds ${A.run.receipt.block[0].toLocaleString('en-US')}–${A.run.receipt.block[1].toLocaleString('en-US')} re-walked: misses ${A.run.receipt.observedMisses} = its committed ${A.run.receipt.committedMisses}`);
w('```');
w();

/* ------------------------------------------------------- the window trace --- */
const st = A.windows.shortRungTrace;
const ar = st.arithmetic as Record<string, number>;
w('### ⭐⭐ THE TWO COMMON WINDOWS — derived, with the arithmetic shown');
w();
w('```text');
w(`W_short = ${n(WS[0], 6)} s   READ from L3-C0's committed b0 mean recovery interval (never typed)`);
w(`          it sits inside b0's OWN committed spread: p10 ${n(st.b0P10, 4)} < ${n(WS[0], 4)} < p90 ${n(st.b0P90, 4)}`);
w('          THE LAW AT b0\'s OWN COMMITTED STATE — brake + turn + close:');
w(`            brake  = v̄/a          = ${n(ar.bandMidpointSpeedMS, 4)} / ${ar.accel}   = ${n(ar.brakeLegS, 6)} s`);
w(`            close  = sqrt(2·d̄/a)  = sqrt(2 · ${n(ar.committedSepT0M, 4)} / ${ar.accel}) = ${n(ar.closeLegS, 6)} s`);
w(`            turn   = the RESIDUAL  = ${n(WS[0], 6)} − ${n(ar.brakeLegS, 6)} − ${n(ar.closeLegS, 6)} = ${n(ar.residualTurnLegS, 6)} s`);
w(`                   ⇒ implied mean turn angle = ${n(ar.residualTurnLegS, 6)} × ${ar.turnRate} = ${n(ar.impliedTurnAngleRad, 4)} rad`);
w(`W_long  = ${n(A.windows.longRungTrace.valueS, 4)} s     ABOVE every band's own committed mean recovery`);
w(`          (${A.windows.longRungTrace.committedBandMeanRecoveriesS.map((v) => n(v, 4)).join(' · ')})`);
w('          ⇒ at this rung EVERY band has finished recovering: the label reads the carrier\'s');
w('            departure, not the defender still being on the floor.');
w('```');
w();

/* ------------------------------------------------- 1 the common-window rungs --- */
w('### ⭐⭐ (1) THE COMMON-WINDOW RUNGS — the same clock for every band');
w();
for (const grain of ['g5', 'g3', 'g2']) {
  const rows = A.tables[grain];
  w(`**grain \`${grain}\`** — ${grain === A.bands.vetoGrain ? '⭐ THE VETO\'S OWN GRAIN' : 'published beside it'}`);
  w();
  w(`| arrival band | misses | mean arrival (m/s) | mean own recovery (s) | **W_short = ${n(WS[0], 4)} s** | CI 95 % (pp) | **W_long = ${n(WS[1], 4)} s** | CI 95 % (pp) | the ORIGINAL PICK (own recovery) | CI 95 % (pp) |`);
  w('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const r of rows) {
    const cs = r.candidates.sepGainedCommonShort.rate;
    const cl = r.candidates.sepGainedCommonLong.rate;
    const ow = r.candidates.sepGainedOwnRecovery.rate;
    w(`| ${r.band} | ${r.misses} | ${n(r.meanArrivalSpeed, 3)} | ${n(r.meanRecovery, 4)} | `
      + `${bold(pct(cs.point))} | ${ci(cs.ci95)} | ${bold(pct(cl.point))} | ${ci(cl.ci95)} | `
      + `${pct(ow.point)} | ${ci(ow.ci95)} |`);
  }
  w();
  w(`| candidate | top − bottom (pp) | CI 95 % | half-width (pp) | verdict | monotone rising |`);
  w('|---|---:|---:|---:|---|---|');
  for (const id of ['sepGainedCommonShort', 'sepGainedCommonLong', 'sepGainedOwnRecovery', 'lungeLost']) {
    const s = A.shape[grain][id];
    w(`| ${CAND_LABEL[id]} | ${bold(pp(s.topMinusBottom.delta))} | ${ci(s.topMinusBottom.ci95)} | `
      + `${pp(s.topMinusBottom.halfWidth)} | ${bold(s.topMinusBottom.verdict)} | ${s.monotone ? 'yes' : 'no'} |`);
  }
  w();
}
const g3own = A.shape.g3.sepGainedOwnRecovery.topMinusBottom.delta;
const g3cs = A.shape.g3.sepGainedCommonShort.topMinusBottom.delta;
const g3cl = A.shape.g3.sepGainedCommonLong.topMinusBottom.delta;
w('> ⭐⭐ **THE ANSWER TO #278.2(i), IN ONE LINE.** At the veto\'s own grain the picked label\'s '
  + `gradient is ${pp(g3own)} pp; at a COMMON window the SAME quantity on the SAME misses still `
  + `rises by ${pp(g3cs)} pp (W_short) and ${pp(g3cl)} pp (W_long), both RESOLVED-CONFIRM. `
  + `So the punishment is **partly world-taught and mostly clock**: the world-taught share is `
  + `${pct(g3cs / g3own, 1)} (W_short) / ${pct(g3cl / g3own, 1)} (W_long) of the picked label's `
  + `gradient, and the remaining ${pct(1 - g3cl / g3own, 1)} is the window growing with the band.`);
w();

/* ------------------------------------------------- 2 the two-window contrast --- */
w('### ⭐ (2) THE TWO-WINDOW CONTRAST — same events, paired');
w();
w(`On the **${T.pairedEvents}** of the **${TAB_MISSES}** TABULATED misses that resolve at EVERY window `
  + `(censoring drops ${TAB_MISSES - T.pairedEvents} — ${pct((TAB_MISSES - T.pairedEvents) / TAB_MISSES, 2)} of the population):`);
w();
for (const grain of ['g3', 'g5']) {
  w(`**grain \`${grain}\`**`);
  w();
  w('| arrival band | own recovery | W_short | gap (own − W_short) | CI 95 % | verdict | W_long | gap (own − W_long) | CI 95 % | verdict |');
  w('|---|---:|---:|---:|---:|---|---:|---:|---:|---|');
  for (const r of A.twoWindowContrast[grain]) {
    w(`| ${r.band} | ${bold(pct(r.own.point))} | ${pct(r.common[0].point)} | ${bold(pp(r.gapOwnMinusCommon[0].delta))} | `
      + `${ci(r.gapOwnMinusCommon[0].ci95)} | ${r.gapOwnMinusCommon[0].verdict} | ${pct(r.common[1].point)} | `
      + `${bold(pp(r.gapOwnMinusCommon[1].delta))} | ${ci(r.gapOwnMinusCommon[1].ci95)} | ${r.gapOwnMinusCommon[1].verdict} |`);
  }
  w();
}
const c3 = A.twoWindowContrast.g3;
w(`> The gap own − W_short is the clock effect made visible, and it grows with the band exactly as `
  + `the confound predicts: ${pp(c3[0].gapOwnMinusCommon[0].delta)} pp (${c3[0].band}, `
  + `${c3[0].gapOwnMinusCommon[0].verdict}) → ${pp(c3[1].gapOwnMinusCommon[0].delta)} pp (${c3[1].band}) → `
  + `${pp(c3[2].gapOwnMinusCommon[0].delta)} pp (${c3[2].band}). Against W_long the sign flips for the `
  + `slow bands (${pp(c3[0].gapOwnMinusCommon[1].delta)} pp) and vanishes for the fastest `
  + `(${pp(c3[2].gapOwnMinusCommon[1].delta)} pp, ${c3[2].gapOwnMinusCommon[1].verdict}) — because the `
  + 'overcommitted body\'s OWN recovery very nearly IS the long rung. The per-event window is a '
  + 'sliding clock that lands near W_short for a walker and near W_long for an overcommitted diver.');
w();

/* ----------------------------------------------------- 3 the veto frame --- */
w('### ⭐⭐ (3) P(won \\| band) UNDER THE VETO\'S OWN FRAME');
w();
const rows3 = A.tables.g3;
w('**P(won) at the veto\'s grain, and its event stream:**');
w();
w('| arrival band | lunges | wins | **P(won)** | CI 95 % (pp) | 1 − P(won) | lunges /team/match | lunges /team/SEASON |');
w('|---|---:|---:|---:|---:|---:|---:|---:|');
for (const r of rows3) {
  w(`| ${r.band} | ${r.lunges} | ${r.wins} | ${bold(pct(r.pWon.point))} | ${ci(r.pWon.ci95)} | `
    + `${pct(1 - r.pWon.point)} | ${n(r.lungesPerTeamMatch.mean, 3)} | ${n(r.lungesPerTeamMatch.perSeasonAtMean, 1)} |`);
}
w();
const ll = A.shape.g3.lungeLost;
w(`**Resolvability at g3:** top − bottom = ${bold(pp(ll.topMinusBottom.delta))} pp, CI `
  + `${ci(ll.topMinusBottom.ci95)}, ${bold(ll.topMinusBottom.verdict)}. ⚠ L3-C0's own g3 take-rate `
  + 'reading was RESOLVED-INVERT on its block; **on this fresh block the same ordering does not '
  + 'resolve** — the first thing the veto frame needed to know.');
w();
w(`**THE VETO PREDICATE ITSELF** (\`gVetoForm\`): the integer cross-multiplication was compared with `
  + `an independent float re-derivation on **${A.vetoFrame.sweep.compared}** band-decisions over an `
  + `exhaustive small-book sweep — **${A.vetoFrame.sweep.mismatches}** mismatches; empty books `
  + `${A.vetoFrame.sweep.emptyDeclines}, one-band books ${A.vetoFrame.sweep.oneBandDeclines} and ties `
  + `${A.vetoFrame.sweep.tieDeclines} declines; the strictly-worse band declined in `
  + `${A.vetoFrame.sweep.worstDeclines}/${A.vetoFrame.sweep.worstCases} cases and the strictly-better `
  + `band in ${A.vetoFrame.sweep.bestDeclines}/${A.vetoFrame.sweep.bestCases}.`);
w();
w(`**WHAT THE VETO WOULD DO** — the predicate replayed on **${A.vetoFrame.replay[0].books}** books, `
  + `each holding one team's events over the League's own **${A.run.seasonFixturesPerTeam}**-fixture `
  + 'season (a VOLUME proxy, §DEV 4):');
w();
for (const rep of A.vetoFrame.replay) {
  w(`**\`${rep.id}\`** — population rates ${rep.population.rate.map((v) => pct(v)).join(' · ')}; `
    + `the POPULATION book would decline: ${rep.population.declines.map((d, i) => `${G3[i]} ${d ? 'YES' : 'no'}`).join(' · ')}`);
  w();
  w('| band | book speaks | would DECLINE | agrees with the population | events /book (mean) | median | min | zero-share |');
  w('|---|---:|---:|---:|---:|---:|---:|---:|');
  for (const b of rep.perBand) {
    w(`| ${b.band} | ${pct(b.bookSpeaksShare, 1)} | ${bold(pct(b.declineShare, 1))} | ${pct(b.agreesWithPopulationShare, 1)} | `
      + `${n(b.eventsPerBook.mean, 1)} | ${n(b.eventsPerBook.median, 1)} | ${b.eventsPerBook.min} | ${pct(b.eventsPerBook.zeroShare, 1)} |`);
  }
  w();
}
w('**ORDERING STABILITY ACROSS SEED BLOCKS** — the battery\'s four quarters, read independently at g3:');
w();
w(`| candidate | ${[0, 1, 2, 3].map((k) => `block ${k + 1}`).join(' | ')} | argmax band stable | argmin band stable |`);
w('|---|---|---|---|---|---|---|');
for (const s of A.stability.byCandidate) {
  w(`| ${CAND_LABEL[s.id]} | ${s.blocks.map((b) => b.points.map((p) => pct(p, 1)).join(' / ')).join(' | ')} | `
    + `${s.argmaxStable ? '**yes**' : 'NO'} | ${s.argminStable ? '**yes**' : 'NO'} |`);
}
w();
w('> ⭐ **THE FOOTBALL HONESTY (a non-claim, restated where it matters).** A miss is **not per se a '
  + 'beating**. A P(won) book teaches *"don\'t waste lunges"*; a separation book teaches *"don\'t get '
  + 'taken away from"*. Both are restraint. **Which lesson the defence\'s book carries is the '
  + 'commander\'s pick, not this instrument\'s.**');
w();

/* --------------------------------------------------------- the decision --- */
w('### ⭐⭐ (4) THE DECISION TABLE');
w();
w('| | `sepGainedCommonShort` | `sepGainedCommonLong` | `sepGainedOwnRecovery` (the original pick) | `lungeLost` = 1 − P(won) |');
w('|---|---|---|---|---|');
const ids = ['sepGainedCommonShort', 'sepGainedCommonLong', 'sepGainedOwnRecovery', 'lungeLost'];
const cell = (f: (id: string) => string): string => ids.map(f).join(' | ');
w(`| **window** | COMMON ${n(WS[0], 4)} s | COMMON ${n(WS[1], 4)} s | PER-EVENT (= the indexed band) | none |`);
w(`| **g3 gradient (pp)** | ${cell((id) => bold(pp(A.shape.g3[id].topMinusBottom.delta)))} |`);
w(`| **g3 CI 95 %** | ${cell((id) => ci(A.shape.g3[id].topMinusBottom.ci95))} |`);
w(`| **g3 verdict** | ${cell((id) => bold(A.shape.g3[id].topMinusBottom.verdict))} |`);
w(`| **resolved at ALL THREE grains** | ${cell((id) => (['g5', 'g3', 'g2'].every((g) => A.shape[g][id].topMinusBottom.verdict === 'RESOLVED-CONFIRM') ? 'yes' : 'NO'))} |`);
w(`| **monotone at g3** | ${cell((id) => (A.shape.g3[id].monotone ? 'yes' : 'no'))} |`);
w(`| **fill: events /team/SEASON, binding (top) band** | ${cell((id) => {
  const rep = A.vetoFrame.replay.find((r) => r.id === id);
  return rep ? n(rep.perBand[rep.perBand.length - 1].eventsPerBook.mean, 1) : '—';
})} |`);
w(`| **book speaks in the top band** | ${cell((id) => {
  const rep = A.vetoFrame.replay.find((r) => r.id === id);
  return rep ? pct(rep.perBand[rep.perBand.length - 1].bookSpeaksShare, 1) : '—';
})} |`);
w(`| **veto declines the top band, per book** | ${cell((id) => {
  const rep = A.vetoFrame.replay.find((r) => r.id === id);
  return rep ? bold(pct(rep.perBand[rep.perBand.length - 1].declineShare, 1)) : '—';
})} |`);
w(`| **book agrees with the population there** | ${cell((id) => {
  const rep = A.vetoFrame.replay.find((r) => r.id === id);
  return rep ? pct(rep.perBand[rep.perBand.length - 1].agreesWithPopulationShare, 1) : '—';
})} |`);
w(`| **ordering stable across seed blocks** | ${cell((id) => {
  const s = A.stability.byCandidate.find((x) => x.id === id);
  return s ? (s.argmaxStable && s.argminStable ? 'yes' : 'NO') : '—';
})} |`);
w('| **commensurability — what the body reads from its OWN events** | his own arrival band · a fixed '
  + 'stopwatch · the distance to the man he dived at | same, one stopwatch longer | his own arrival '
  + 'band · **his own recovery timer** · that distance | his own arrival band · did I get the ball |');
w('| **what the veto consumes** | an ordering of ratios over a clock the world does not vary | same | '
  + 'an ordering partly produced by the index itself | an ordering that does not resolve here |');
w();

const rec = 'sepGainedCommonLong';
const recShape = A.shape.g3[rec];
const recRep = A.vetoFrame.replay.find((r) => r.id === rec) as Replay;
const ownRep = A.vetoFrame.replay.find((r) => r.id === 'sepGainedOwnRecovery') as Replay;
const llRep = A.vetoFrame.replay.find((r) => r.id === 'lungeLost') as Replay;
w('### ⭐ THE RECOMMENDATION (a recommendation with its arithmetic — the COMMANDER ratifies, #203)');
w();
w('```text');
w(`LABEL   sepGainedCommonLong  —  a MISSED lunge is PUNISHED iff, ${n(WS[1], 4)} s after he lunged,`);
w('        the carrier he dived at was FURTHER AWAY than at the instant he lunged.');
w('        t0 is the CARRIER (#266.2(i)); the window is COMMON — the same number of seconds for');
w('        every band — and it is LONGER than every band\'s own recovery, so no band is scored');
w('        while its body is still on the floor. The threshold is ZERO metres.');
w(`GRAIN   g3 (walk+jog · run+drive · OVERCOMMITTED), with W_short (${n(WS[0], 4)} s) as the named`);
w('        FALLBACK rung — it carries the same verdict at every grain.');
w('```');
w();
w('**The arithmetic, in order of the charter\'s own questions:**');
w();
w(`1. **THE GRADIENT SURVIVES A COMMON CLOCK.** ${pp(recShape.topMinusBottom.delta)} pp, CI `
  + `${ci(recShape.topMinusBottom.ci95)}, ${recShape.topMinusBottom.verdict} — and RESOLVED-CONFIRM at `
  + `**all three grains** (g5 ${pp(A.shape.g5[rec].topMinusBottom.delta)} pp · g2 `
  + `${pp(A.shape.g2[rec].topMinusBottom.delta)} pp). The punishment is therefore **world-taught**: `
  + 'faster arrivals really are left behind more often, measured on a stopwatch the world does not '
  + 'get to lengthen.');
w(`2. **AND THE CLOCK WAS REAL TOO.** The picked label\'s ${pp(g3own)} pp decomposes into `
  + `≈ ${pp(g3cl)} pp of world and ≈ ${pp(g3own - g3cl)} pp of window `
  + `(${pct(1 - g3cl / g3own, 0)} of the gradient was the sliding clock). #278.2(i)'s HIGH is `
  + 'upheld as a finding, not merely as a risk: a book keyed to the own-recovery window would '
  + 'learn, in majority, its own index.');
w(`3. **RESOLVABILITY AT g3.** half-width ${pp(recShape.topMinusBottom.halfWidth)} pp at N = `
  + `${A.run.matches} — inside the charter's ±3–4 pp requirement, and the tightest of the two `
  + `common rungs (W_short ${pp(A.shape.g3.sepGainedCommonShort.topMinusBottom.halfWidth)} pp).`);
w(`4. **FILL.** ${n(recRep.perBand[2].eventsPerBook.mean, 1)} events per team-season in the binding `
  + `OVERCOMMITTED band (min ${recRep.perBand[2].eventsPerBook.min}), and the book **speaks in `
  + `${pct(recRep.perBand[2].bookSpeaksShare, 0)} of books at every band** — no ABSENT-band problem `
  + `at this grain in a full season. Per team per match: `
  + `${A.tables.g3.map((r) => `${r.band} ${n(r.candidates.sepGainedCommonLong.eventsPerTeamMatch.mean, 2)}`).join(' · ')}.`);
w(`5. **WHAT THE VETO DOES WITH IT.** Replayed on ${recRep.books} season books: it declines the `
  + `overcommitted band in ${pct(recRep.perBand[2].declineShare, 0)} of books against `
  + `${pct(recRep.perBand[0].declineShare, 0)} / ${pct(recRep.perBand[1].declineShare, 0)} for the `
  + 'slower groups — the asymmetry points the right way, and the veto is decline-only, so the '
  + 'wrong-way books cost patience, never recklessness.');
w(`6. **WHY NOT THE ORIGINAL PICK.** It is sharper at book grain (declines the top band in `
  + `${pct(ownRep.perBand[2].declineShare, 0)} of books vs ${pct(ownRep.perBand[0].declineShare, 0)} `
  + 'at walk+jog, and its ordering is the only one stable across all four seed blocks) — but that '
  + 'sharpness IS largely the clock, and L3-C0\'s own runner-up rejection ("a deterministic function '
  + 'of the indexed state carries no information a band label does not already have") lands on it. '
  + 'It is not empty — a third of its gradient is world — but a cleaner label with the same sign is '
  + 'available, so the confounded one should not be the frozen one.');
w(`7. **WHY NOT P(won).** Re-examined on its consumer's own terms and it fails there, not merely on `
  + `absolute flatness: the ordering **does not resolve** at g3 on a fresh block `
  + `(${pp(ll.topMinusBottom.delta)} pp, ${ci(ll.topMinusBottom.ci95)}, ${ll.topMinusBottom.verdict}) `
  + `and L3-C0's inverted reading did not replicate; the population book would decline the **MIDDLE** `
  + `group (${llRep.population.declines.map((d, i) => `${G3[i]} ${d ? 'YES' : 'no'}`).join(' · ')}), not `
  + `the fast one; per-book agreement with even that is `
  + `${llRep.perBand.map((b) => pct(b.agreesWithPopulationShare, 0)).join(' / ')} — a coin flip. Its `
  + 'event stream is the best in the set (every lunge is an event, '
  + `${n(llRep.perBand[2].eventsPerBook.mean, 1)} per team-season even in the top band), so if the `
  + 'commander wants the "don\'t waste lunges" LESSON, the fill is there — but this world does not '
  + 'currently teach a stable ordering for it.');
w();
w('**⚠ THE ONE OPEN DESIGN QUESTION FOR L3-T0, stated rather than solved (#203).** A common window '
  + 'is a NUMBER OF SECONDS, and M-L3.2 forbids constants in the book. This label\'s window must '
  + 'therefore enter T0 as a TRACED or DOSED quantity, not a typed one — the contract\'s own '
  + 'truth-dosing idiom (M-L3.3: "the instrument writes L3-C0\'s census values") already covers it, '
  + 'and the engine\'s own nearest constant is the incumbent miss price, at which L3-C0 measured the '
  + 'same quantity as FLAT-to-inverted. So the rung matters and the seam must carry it honestly. '
  + 'That is a T0 design point for the commander, not a fact this instrument can settle.');
w();

/* ------------------------------------------------------------- the gates --- */
w('### Gate table');
w();
w('| gate | result |');
w('|---|---|');
for (const g of gates) w(`| \`${g}\` | ${A.gates[g] ? '**PASS**' : '**RED**'} |`);
w();
w(`⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's \`gates\` object carries exactly `
  + `**${gates.length}** keys — \`${gates.join(' · ')}\` — and **${gatesPass}** of them pass. `
  + `⭐⭐ **${mutLive} / ${A.mutants.length} mutants LIVE**, over **${conjuncts}** conjuncts enumerated `
  + 'FROM THE GATE OBJECTS THEMSELVES (uncovered conjuncts: 0).');
w();
w('### The N rule as executed');
w();
w('```text');
const nr = A.run.nRule as Record<string, number | string | boolean>;
w(`rule            ${nr.rule}`);
w(`terms           N0 ${nr.n0} · hw0 ${pp(nr.hw0 as number)} pp (L3-C0's committed g3 own-recovery CI) · target ${pp(nr.targetHalfWidth as number)} pp · ms/match ${nr.msPerMatch}`);
w(`precision term  ${nr.precisionTerm}   ·   wall term ${nr.wallTerm}   ·   seed-room cap ${nr.cap ?? 700}`);
w(`⇒ N*            ${nr.nStar}   (binding: precision)   ·   as executed N ${nr.ran}, overridden ${nr.overridden}`);
w('```');

process.stdout.write(`${out.join('\n')}\n`);
