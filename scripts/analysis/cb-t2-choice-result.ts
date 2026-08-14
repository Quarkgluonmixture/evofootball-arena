/**
 * CB T2 — the §RESULT tables, PRINTED FROM THE COMMITTED ARTIFACT (#229.2). Nothing here
 * computes a result; every number is read back out of
 * `docs/world-model/data/cb-t2-choice-seat.json` (and the ROW-0 artifact for §ROW-0).
 *
 * RUN: npx tsx scripts/analysis/cb-t2-choice-result.ts
 */
import { readFileSync } from 'node:fs';

const A = JSON.parse(readFileSync('docs/world-model/data/cb-t2-choice-seat.json', 'utf8')) as
  Record<string, any>;
const pct = (v: number, d = 3): string => `${(v * 100).toFixed(d)} %`;
const n = (v: number | null, d = 4): string => (v === null ? '—' : v.toFixed(d));
const line = (s: string): void => { process.stdout.write(`${s}\n`); };

line(`\nCB-T2 — N ${A.nRule.ran} · seeds ${A.seeds.battery.join('–')} · sha ${String(A.resultSha256).slice(0, 8)}…`);
line(`gates ${Object.keys(A.gates).length} · red ${Object.values(A.gates).filter((v) => !v).length}`
  + ` · mutants ${A.mutants.length} live ${A.mutants.filter((m: any) => m.live).length}`
  + ` · conjuncts ${A.conjunctTotal} (machine-derived) · uncovered ${A.uncoveredConjuncts.length}`);

line('\n== R1/R2/R3 — the knock population, the compass and the price gap ==');
line('| quantity | CHOICE | BOTH |');
for (const [label, key] of [
  ['seat decisions / match', 'seatsPerMatch'], ['candidates per decision', 'candidatesPerDecision'],
  ['knocks CHOSEN / match', 'chosenPerMatch'], ['chosen : fired', 'chosenToFired'],
] as const) line(`| ${label} | ${A.arms.choice[key]} | ${A.arms.both[key]} |`);
line(`| chosen share of seat decisions | ${pct(A.arms.choice.chosenShareOfSeatDecisions)} | ${pct(A.arms.both.chosenShareOfSeatDecisions)} |`);
line(`| ⭐ BACK-half share of chosen knocks | ${pct(A.arms.choice.backHalfShare)} | ${pct(A.arms.both.backHalfShare)} |`);
line(`| step-0 (today's knock) share | ${pct(A.arms.choice.step0Share)} | ${pct(A.arms.both.step0Share)} |`);
line(`| push (median) | ${n(A.arms.choice.push.median)} m | ${n(A.arms.both.push.median)} m |`);
line(`| aim distance = the knock's own roll (median) | ${n(A.arms.choice.aimDistance.median)} m | ${n(A.arms.both.aimDistance.median)} m |`);
line(`| ⭐ price gap: best knock vs winner | ${A.arms.choice.priceGap.meanBestKnock} vs ${A.arms.choice.priceGap.meanWinner} | ${A.arms.both.priceGap.meanBestKnock} vs ${A.arms.both.priceGap.meanWinner} |`);
line(`compass steps per body: ${JSON.stringify(A.arms.choice.compassSize)}`);
line(`chosen bearing octants (CHOICE): ${JSON.stringify(A.arms.choice.bearingOctants)}`);
line(`nearest challenger at CHOSEN vs UNCHOSEN decisions (CHOICE): median `
  + `${n(A.arms.choice.timing.chosenNearestD.median)} m vs ${n(A.arms.choice.timing.unchosenNearestD.median)} m`);

line('\n== R4 — the L2b RE-READ, on the CHOOSER\'s own knock population ==');
for (const arm of ['choice', 'both'] as const) {
  const l = A.l2bReRead[arm];
  line(`${arm}: beaten median ${l.medBeaten} ticks (censored ${pct(l.beatenCensoredShare)}) · `
    + `not-beaten ${l.medNotBeaten} · gap ${l.gap.point} [${l.gap.lo}, ${l.gap.hi}] · `
    + `median race window ${l.medWindowTicks} ticks · n ${l.nBeaten}/${l.nNotBeaten}`);
}
const r = A.l2bReRead.cbT1DoserReference;
line(`⚠ CB-T1's DOSER population, for contrast only: ${r.medBeaten} vs ${r.medNotBeaten}, gap ${r.gap}`);

line('\n== R5 — the L3 RE-READ ==');
line(`knock retention ${pct(A.l3ReRead.knockRetention)} vs hold retention ${pct(A.l3ReRead.holdRetention)}`
  + ` · gap ${pct(A.l3ReRead.gap.point)} [${pct(A.l3ReRead.gap.lo)}, ${pct(A.l3ReRead.gap.hi)}]`);
line(`⚠ CB-T1's DOSER population: ${pct(A.l3ReRead.cbT1DoserReference.knockRetention)} vs `
  + `${pct(A.l3ReRead.cbT1DoserReference.holdRetention)}, gap ${pct(A.l3ReRead.cbT1DoserReference.gap)}`);

line('\n== R7 — the recovery LEGS (binding (c)), BOTH arm, min in every row ==');
line('| bin | n | total min/median/mean/max | brake mean | turn+close mean | recon turn | recon close |');
for (const b of A.recoveryLegs) {
  line(`| ${b.bin} | ${b.n} | ${n(b.total.min)}/${n(b.total.median)}/${n(b.total.mean)}/${n(b.total.max)}`
    + ` | ${n(b.brake.mean)} | ${n(b.turnPlusClose.mean)} | ${n(b.reconTurn.mean)} | ${n(b.reconClose.mean)} |`);
}
line('\n== R6 — CARRIER-ANCHORED separation (binding (c)) ==');
line(`at the miss (t0): ${JSON.stringify(A.carrierAnchoredSeparation.atMiss)}`);
line(`at t0 + recovery: ${JSON.stringify(A.carrierAnchoredSeparation.atRecoveryEnd)}`);

line('\n== R8 — world effects (REPORTED, never gated) ==');
const keys = Object.keys(A.arms.off.world);
line(`| ruler | OFF | CHOICE | BOTH |`);
for (const k of keys) {
  line(`| ${k} | ${A.arms.off.world[k]} | ${A.arms.choice.world[k]} | ${A.arms.both.world[k]} |`);
}
line('\n== R9 — §STRAIN 1\'s firing rates ==');
for (const arm of ['choice', 'both'] as const) {
  line(`${arm}: decisions ${A.arms[arm].strain.decisions} · beyond the deepest defender `
    + `${pct(A.arms[arm].strain.beyondLineShare)} · licensed overlapper ${pct(A.arms[arm].strain.overlapperShare)}`);
}
line(`\ncompass receipts: ${JSON.stringify(A.compass)}`);
line(`arming withdrawals across the battery: ${A.armingWithdrawals}`);
line(`doors matrix: ${A.identity.doorsMatrix.length} flag families · dormantAll ${A.identity.dormantAll} · discrimination ${A.identity.discriminated}`);
line(`league hashes: ${A.identity.leagueHashes.map((x: any) => `${x.seed} ${x.match ? 'OK' : 'MOVED'}`).join(' · ')}\n`);
