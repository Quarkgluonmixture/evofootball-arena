/**
 * CB-T1 — the beaten-event exam's result tables, PRINTED FROM THE COMMITTED ARTIFACT (#229.2).
 * Nothing here is typed: every number is read out of
 * `docs/world-model/data/cb-t1-beaten-event-exam.json`.
 *
 * RUN: npx tsx scripts/analysis/cb-t1-exam-result.ts
 */
import { readFileSync } from 'node:fs';

const A = JSON.parse(readFileSync('docs/world-model/data/cb-t1-beaten-event-exam.json', 'utf8'));
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pc = (v: number): string => `${(v * 100).toFixed(3)} %`;
const n = (v: unknown): string => (v === null || v === undefined ? 'n/a' : String(v));

o(`CB-T1 — THE BEATEN-EVENT EXAM · resultSha256 ${A.resultSha256}`);
o(`seeds ${A.seeds.battery[0]}–${A.seeds.battery[1]} (N=${A.seeds.n}) · G-DET ${A.envelope.digestA === A.envelope.digestB ? 'identical' : 'DIVERGED'} ${String(A.envelope.digestA).slice(0, 8)}…`);
o('');
o('=== THE N RULE AS EXECUTED ===');
o(`rarest/match ${A.nRule.rarestPerMatch} · precision ${n(A.nRule.precisionTerm)} · wall(envelope) ${A.envelope.wallTerm} · cap ${A.nRule.cap} ⇒ N* ${A.nRule.nStar}, ran ${A.nRule.ran}`);
o('');
o('=== LIMB L1 — THE PREDICATE VALIDATION (the scored first limb) ===');
const l1 = A.limbs.L1;
o(`S  = P(¬captured | predicate BEATEN)      ${pc(l1.soundness.S)}   bar ≥ ${pc(l1.soundness.bar)}   ${l1.soundness.pass ? 'PASS' : 'FAIL'}`);
o(`U  = P(¬captured | predicate NOT beaten)  ${pc(l1.discrimination.U)}`);
o(`GAP = S − U                               ${pc(l1.discrimination.gap)}   CI [${pc(l1.discrimination.ci[0])}, ${pc(l1.discrimination.ci[1])}]   bar ≥ ${pc(l1.discrimination.bar)}   ${l1.discrimination.pass ? 'PASS' : 'FAIL'}`);
o(`cells: beaten ${l1.nonVacuity.beatenResolvable} · not-beaten ${l1.nonVacuity.notBeatenResolvable} · two-cell seeds ${l1.nonVacuity.twoCellSeeds}  ${l1.nonVacuity.pass ? 'PASS' : 'FAIL'}`);
o(`REPORTED — no side regain | beaten ${pc(l1.reported.noSideRegainGivenBeaten)} vs | not beaten ${pc(l1.reported.noSideRegainGivenNotBeaten)} · gap ${pc(l1.reported.sideRegainGap)} CI [${pc(l1.reported.sideRegainCi[0])}, ${pc(l1.reported.sideRegainCi[1])}]`);
o(`knocks ${l1.reported.knocks} · resolutions ${JSON.stringify(l1.reported.resolutions)} · challenger observations ${l1.reported.challengerObservations}`);
o(`LIMB L1: ${l1.pass ? 'PASS' : 'FAIL'}`);
o('');
o('=== LIMB L2 — BEATEN EVENTS BEHAVE ===');
const g = A.limbs.L2.gradient;
o('arrival-speed bin | commit mean recovery (s) | n | OFF mean (s) | n');
A.recovery.byBin.forEach((b: Record<string, number | string>, i: number) => {
  o(`${String(b.name).padEnd(18)}| ${String(g.commitBinMeans[i]).padEnd(22)}| ${String(g.commitBinCounts[i]).padEnd(4)}| ${g.offBinMeans[i]} | ${g.offBinCounts[i]}`);
});
o(`monotone ${g.monotone} · s4 − s0 ${g.s4MinusS0} s CI [${g.ci[0]}, ${g.ci[1]}] ⇒ L2a ${g.pass ? 'PASS' : 'FAIL'}`);
const e = A.limbs.L2.elimination;
o(`re-engagement (ticks, horizon ${e.reengageHorizonTicks}): beaten median ${e.medianReengageBeatenTicks} (censored ${pc(e.beatenCensoredShare)}) vs not-beaten ${e.medianReengageNotBeatenTicks} (censored ${pc(e.notBeatenCensoredShare)})`);
o(`gap ${e.gapTicks} ticks CI [${e.ci[0]}, ${e.ci[1]}] ⇒ (i) ${e.passI ? 'PASS' : 'FAIL'} · median race window ${e.medianWindowTicks} ticks ⇒ (ii) ${e.passII ? 'PASS' : 'FAIL'}`);
o(`LIMB L2: ${A.limbs.L2.pass ? 'PASS' : 'FAIL'}`);
o('');
o('=== THE RECOVERY DISTRIBUTION IN FULL (obligation 4 — the MIN is published) ===');
o('bin | n | min | q1 | median | q3 | mean | max');
A.recovery.byBin.forEach((b: Record<string, number | string | null>) => {
  o(`${String(b.name).padEnd(18)}| ${n(b.n)} | ${n(b.min)} | ${n(b.q1)} | ${n(b.median)} | ${n(b.q3)} | ${n(b.mean)} | ${n(b.max)}`);
});
const p = A.recovery.pooledCommit;
const pb = A.recovery.pooledCommitBrake;
o(`POOLED total  | ${p.n} | ${p.min} | ${p.q1} | ${p.median} | ${p.q3} | ${p.mean} | ${p.max}`);
o(`POOLED brake  | ${pb.n} | ${pb.min} | ${pb.q1} | ${pb.median} | ${pb.q3} | ${pb.mean} | ${pb.max}`);
o(`OFF arm (the incumbent constants ${A.recovery.incumbentConstants.cooldown} / ${A.recovery.incumbentConstants.stun}): n ${A.recovery.pooledOff.n}, min ${A.recovery.pooledOff.min}, max ${A.recovery.pooledOff.max}`);
o(`excluded: smother misses ${A.recovery.excluded.smotherMisses} · whistled misses inside the distribution ${A.recovery.excluded.whistledMissesInDistribution}`);
const dr = A.recovery.derivedForBeatenChallengers;
o(`DERIVED recoveryInterval for the touch arm's beaten challengers: n ${dr.n} min ${dr.min} median ${dr.median} mean ${dr.mean} max ${dr.max}`);
o('');
o('=== SEPARATION — CARRIER-ANCHORED t0 (obligation 2) ===');
const sb = A.separation.beatenT0;
const sn = A.separation.notBeatenT0;
o(`|defender − CARRIER| at the knock — beaten:     n ${sb.n} min ${sb.min} median ${sb.median} mean ${sb.mean} max ${sb.max}`);
o(`|defender − CARRIER| at the knock — not beaten: n ${sn.n} min ${sn.min} median ${sn.median} mean ${sn.mean} max ${sn.max}`);
o('');
o('=== LIMB L3 — THE TOUCH COST IS HONEST ===');
const l3 = A.limbs.L3;
o(`split: retained ${l3.split.retained} · lost ${l3.split.lost} · both-ways seeds ${l3.split.bothWaysSeeds}/${l3.split.seeds} ⇒ L3a ${l3.split.pass ? 'PASS' : 'FAIL'}`);
o(`cost @ ${l3.cost.horizonS}s: knock retention ${pc(l3.cost.knockRetention)} vs hold retention ${pc(l3.cost.holdRetention)} · gap ${pc(l3.cost.gap)} CI [${pc(l3.cost.ci[0])}, ${pc(l3.cost.ci[1])}] ⇒ L3b ${l3.cost.pass ? 'PASS' : 'FAIL'}`);
o(`LIMB L3: ${l3.pass ? 'PASS' : 'FAIL'}`);
o('');
o(`=== VERDICT: ${A.limbs.verdict ? 'PASS' : 'FAIL'} · forks ${JSON.stringify(A.limbs.forks)} ===`);
o('');
o('=== WORLD EFFECTS — REPORTED, NEVER GATED ===');
const keys = ['duelsPerMatch', 'takeRate', 'turnoversPerMatch', 'meanSpellS', 'goalsPerMatch',
  'shotsPerMatch', 'foulsPerMatch', 'yellowsPerMatch', 'redsPerMatch', 'penaltiesPerMatch',
  'pressedShare', 'pressedLossRatio', 'firstReceptions'];
o('ruler'.padEnd(20) + 'OFF'.padEnd(14) + 'COMMIT'.padEnd(14) + 'TOUCH');
for (const k of keys) {
  o(k.padEnd(20) + String(A.world.off[k]).padEnd(14) + String(A.world.commit[k]).padEnd(14) + String(A.world.touch[k]));
}
o('');
o('=== THE DOSER ===');
o(`${A.dosing.armings} armings · ${A.dosing.fired} fired · ${A.dosing.dosesPerMatch}/match · shadow moments ${A.dosing.shadowMoments} · fallback aims ${A.dosing.fallbackAims}`);
o(A.dosing.policy);
o('');
o('=== GATES ===');
const gates = A.gates as Record<string, boolean>;
o(Object.entries(gates).map(([k, v]) => `${k}:${v ? 'PASS' : 'RED'}`).join(' · '));
o(`gate rows ${Object.keys(gates).length} · mutants ${A.mutants.length} (live+exact ${A.mutants.filter((m: { live: boolean }) => m.live).length}) · uncoveredConjuncts ${JSON.stringify(A.uncoveredConjuncts)}`);
