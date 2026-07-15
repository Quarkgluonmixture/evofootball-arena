/**
 * Probe: the AGGRESSION COST SURFACE (N1.5 diagnostic, pre-lever).
 *
 * The matrix probe (phase-57) found the meta rides markingAggression +0.51
 * and its costs live on the failure path only. Before touching anything,
 * measure the cost surface as it stands:
 *   H1 — cards never BIND: second-yellow/straight reds ≈ 0 per match, so
 *        the "second yellow is the whole deterrent" comment is theoretical.
 *   H2 — aggression has no FATIGUE price: the aggro side's stamina spend
 *        ≈ the technical side's (lunges/chases are free beyond movement).
 *   H3 — the exploit surface exists: tackle/foul VOLUME rises against
 *        carry-heavy opponents (someone must hold the ball to be fouled).
 *
 * Method: evolve seed 424242 to g+24 (the phase-57 dominant world), pick
 * from D1: AGGRO (max markingAggression), SOFT (min MA), WIDE (max
 * attackingWidth). Three pairings × 80 matches, deterministic seeds.
 *
 *   npx tsx scripts/probes/aggression-cost.ts
 */
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Match } from '../../src/sim/Match';
import { hashSeed } from '../../src/utils/rng';
import type { TeamInfo } from '../../src/sim/types';

const SEED = 424242;
const GENS = 24;
const MATCHES = 80;
const PROBE_TAG = 585858;

const t0 = performance.now();
const fresh = new League({ seed: SEED });
const out = runHeadless(fresh.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration',
  target: fresh.generation + GENS,
});
const lg = League.fromJSON(out.league as Record<string, unknown>);
console.log(`evolved to gen ${lg.generation} (${((performance.now() - t0) / 1000).toFixed(1)}s)`);

const d1 = lg.division(0);
const by = (f: (g: Record<string, number>) => number, dir: 1 | -1) =>
  [...d1].sort((a, b) => dir * (f(b.coach.genome as unknown as Record<string, number>) - f(a.coach.genome as unknown as Record<string, number>)))[0];
const aggro = by((g) => g.markingAggression, 1);
const soft = by((g) => g.markingAggression, -1);
const wide = by((g) => g.attackingWidth, 1);
const picks = [
  { tag: 'AGGRO', f: aggro },
  { tag: 'SOFT ', f: soft },
  { tag: 'WIDE ', f: wide },
];
for (const p of picks) {
  const g = p.f.coach.genome as unknown as Record<string, number>;
  console.log(
    `${p.tag} ${p.f.name.padEnd(18)} MA ${g.markingAggression.toFixed(2)} ` +
    `width ${g.attackingWidth.toFixed(2)} risk ${g.riskTolerance.toFixed(2)} ` +
    `press ${g.pressIntensity.toFixed(2)} dribbleBias ${g.dribbleBias.toFixed(2)}`,
  );
}

interface Acc {
  fouls: number; yellows: number; reds: number; pens: number; tackles: number;
  spent: number; ftStamina: number; goals: number; lateGoals: number; pts: number;
}
const blank = (): Acc => ({ fouls: 0, yellows: 0, reds: 0, pens: 0, tackles: 0, spent: 0, ftStamina: 0, goals: 0, lateGoals: 0, pts: 0 });

const pairings: Array<[number, number]> = [[0, 1], [0, 2], [1, 2]];
for (const [pi, pj] of pairings) {
  const A = picks[pi];
  const B = picks[pj];
  const acc: [Acc, Acc] = [blank(), blank()];
  for (let k = 0; k < MATCHES; k++) {
    const flip = k % 2 === 1; // alternate sides
    const infoA: TeamInfo = lg.teamInfo((flip ? B : A).f.slot);
    const infoB: TeamInfo = lg.teamInfo((flip ? A : B).f.slot);
    const m = new Match({ seed: hashSeed(PROBE_TAG, pi * 10 + pj, k), teamA: infoA, teamB: infoB });
    m.runToCompletion();
    for (const side of [0, 1] as const) {
      const who = (side === 0) !== flip ? 0 : 1; // index into acc: 0 = A's ledger
      const team = m.teams[side];
      const a = acc[who];
      a.fouls += team.stats.fouls;
      a.yellows += team.stats.yellows;
      a.reds += team.stats.reds;
      a.pens += m.teams[1 - side].stats.penalties; // penalties CONCEDED by this side
      a.tackles += team.stats.tackles;
      const outfield = team.players.filter((p) => p.role !== 'GK');
      a.spent += outfield.reduce((s, p) => s + p.staminaSpent, 0) / outfield.length;
      a.ftStamina += outfield.reduce((s, p) => s + p.stamina, 0) / outfield.length;
      a.goals += m.score[side];
      const half = m.duration / 2;
      a.lateGoals += m.events.filter((e) => e.type === 'goal' && e.side === side && e.t > half).length;
      const gd = m.score[side] - m.score[1 - side];
      a.pts += gd > 0 ? 1 : gd === 0 ? 0.5 : 0;
    }
  }
  console.log(`\n${A.tag.trim()} vs ${B.tag.trim()} (${MATCHES} matches):`);
  for (const who of [0, 1] as const) {
    const a = acc[who];
    const n = MATCHES;
    console.log(
      `  ${picks[who === 0 ? pi : pj].tag} share ${(a.pts / n).toFixed(2)}  ` +
      `goals ${(a.goals / n).toFixed(2)} (late ${(a.lateGoals / n).toFixed(2)})  ` +
      `tackles ${(a.tackles / n).toFixed(1)}  fouls ${(a.fouls / n).toFixed(2)}  ` +
      `yellows ${(a.yellows / n).toFixed(2)}  REDS ${(a.reds / n).toFixed(3)}  ` +
      `pensConceded ${(a.pens / n).toFixed(3)}  ` +
      `staminaSpent ${(a.spent / n).toFixed(3)}  FTstamina ${(a.ftStamina / n).toFixed(3)}`,
    );
  }
}
console.log(`\ntotal ${((performance.now() - t0) / 1000).toFixed(1)}s`);
