/**
 * Probe (2026-07-19, the user's wide-operability point): "阵型强行拉到特别边
 * 上,那边锋不好拿球(因为球比较慢传过来)." Claim: a receiver hard against the
 * touchline gets SLOWER service (the ball travels further/slower to reach the
 * extreme flank), so a defender has closed by the time it arrives — the wide
 * reception is pressured and lost, which is one reason the flank is a
 * dead-end. If true, wide receivers face higher pressure at the moment they
 * gain the ball and lose it more often within ~1s.
 *
 * Measures, over neutral 0.5-vs-0.5 matches, at every RECEPTION (ball owner
 * becomes a new same-team player): the receiver's lateral zone, the pressure
 * on them at that instant, and whether they're dispossessed within ~1s.
 *
 *   npx tsx scripts/probes/reception-by-width.ts [matches]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { pressureAt } from '../../src/ai/perception';

const K = Number(process.argv[2] ?? 30);
const HW = 34;

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
};
const info = (name: string): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: neutral(), squad: squad(),
});

type Cell = { n: number; pressure: number; lost: number; flight: number; flightN: number };
const cells: Record<string, Cell> = {};
for (const lat of ['central', 'half', 'wide', 'extreme']) cells[lat] = { n: 0, pressure: 0, lost: 0, flight: 0, flightN: 0 };
const latOf = (y: number) => {
  const ay = Math.abs(y);
  return ay < 7 ? 'central' : ay < 15 ? 'half' : ay < 24 ? 'wide' : 'extreme';
};

let seed = 1;
for (let k = 0; k < K; k++) {
  const m = new Match({ seed: seed++, teamA: info('A'), teamB: info('B'), duration: 300 });
  let prevGid: number | null = null;
  // pending receptions to grade for loss-within-1s
  const watch: { gid: number; cell: string; until: number }[] = [];
  while (!m.finished) {
    m.step(DT);
    const own = m.ball.owner;
    // grade watched receptions for a loss within ~1s
    for (let i = watch.length - 1; i >= 0; i--) {
      const w = watch[i];
      const lostNow = own === null || own.gid !== w.gid;
      if (lostNow && own !== null && own.side === Math.floor(w.gid / TEAM_SIZE) && own.gid !== w.gid) {
        // teammate took over (a pass) — not a loss; stop watching
        watch.splice(i, 1);
        continue;
      }
      if (lostNow && (own === null || own.side !== Math.floor(w.gid / TEAM_SIZE))) {
        cells[w.cell].lost++;
        watch.splice(i, 1);
        continue;
      }
      if (m.simTime >= w.until) watch.splice(i, 1);
    }
    if (own && own.role !== 'GK' && own.gid !== prevGid) {
      // a NEW owner — count it as a reception if it came from a same-team pass
      // (prev owner was a teammate) OR a loose gain; we bucket all fresh gains.
      const cell = latOf(own.pos.y);
      const c = cells[cell];
      c.n++;
      c.pressure += pressureAt(own.pos, m.teams[1 - own.side].players);
      watch.push({ gid: own.gid, cell, until: m.simTime + 1.0 });
    }
    prevGid = own && own.role !== 'GK' ? own.gid : null;
  }
}

const per = (x: number, n: number) => (x / Math.max(n, 1)).toFixed(3);
console.log(`Reception quality by receiver width — ${K} neutral matches (0.5 squads)\n`);
console.log(`  zone (|y|)        receptions   pressure@recv   lost<1s`);
for (const lat of ['central', 'half', 'wide', 'extreme']) {
  const c = cells[lat];
  console.log(`  ${lat.padEnd(14)} ${String(c.n).padStart(8)}      ${per(c.pressure, c.n).padStart(7)}      ${(c.lost / Math.max(c.n, 1) * 100).toFixed(1).padStart(5)}%`);
}
console.log(`\n⭐ the user's claim: wider receivers get MORE pressure@reception + lost more (slow service).`);
console.log(`  extreme = |y| > 24m (near the ${HW}m touchline).`);
