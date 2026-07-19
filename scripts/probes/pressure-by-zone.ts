/**
 * Probe (2026-07-19, the user's substrate point): "中路盘带很容易被很多人
 * 夹击,边路往往有空间/人数优势 — 这一点需要底座本身就能让他体现." In real
 * football a CENTRAL carrier (a direct goal threat) draws a swarm; a WIDE
 * carrier (lower threat, hemmed by the touchline) is left more space. If our
 * substrate does NOT show this asymmetry — if a central carrier faces the
 * SAME number of defenders as a wide one — then that missing convergence is
 * WHY central dribbling is never punished and why width has no advantage.
 *
 * Measures, over neutral 0.5-vs-0.5 matches, for every frame with a carrier
 * in his attacking half: defenders within 2.6m (夹击) and within 6m
 * (collapse), bucketed by the carrier's lateral zone (central / half-space /
 * wide) and third (middle / final). Reports the center↔flank gradient.
 *
 *   npx tsx scripts/probes/pressure-by-zone.ts [matches]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 30);
const HL = 52.5;

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

// zone keys: `${lat}-${third}`
type Cell = { frames: number; near: number; coll: number; dispossessed: number };
const cells: Record<string, Cell> = {};
const key = (lat: string, third: string) => `${lat}·${third}`;
for (const lat of ['central', 'half', 'wide']) for (const third of ['mid', 'final']) {
  cells[key(lat, third)] = { frames: 0, near: 0, coll: 0, dispossessed: 0 };
}

let seed = 1;
for (let k = 0; k < K; k++) {
  const m = new Match({ seed: seed++, teamA: info('A'), teamB: info('B'), duration: 300 });
  let prevOwnerGid: number | null = null;
  let prevBucket: string | null = null;
  while (!m.finished) {
    m.step(DT);
    const own = m.ball.owner;
    // detect a possession LOSS at the bucket the ball was last carried in
    if (prevOwnerGid !== null && prevBucket && (own === null || own.gid !== prevOwnerGid)) {
      const stillMine = own !== null && own.side === Math.floor(prevOwnerGid / TEAM_SIZE);
      if (!stillMine) cells[prevBucket].dispossessed++;
    }
    prevOwnerGid = null;
    prevBucket = null;
    if (!own || own.role === 'GK') continue;
    const t = m.teams[own.side];
    const lx = t.localX(own.pos.x);
    if (lx <= 0) continue; // attacking half only
    const ay = Math.abs(own.pos.y);
    const lat = ay < 7 ? 'central' : ay < 15 ? 'half' : 'wide';
    const third = lx > HL - 17.5 ? 'final' : 'mid';
    const b = key(lat, third);
    let near = 0, coll = 0;
    for (const o of m.teams[1 - own.side].players) {
      if (o.sentOff || o.role === 'GK') continue;
      const d = Math.hypot(o.pos.x - own.pos.x, o.pos.y - own.pos.y);
      if (d < 2.6) near++;
      if (d < 6) coll++;
    }
    const c = cells[b];
    c.frames++; c.near += near; c.coll += coll;
    prevOwnerGid = own.gid;
    prevBucket = b;
  }
}

console.log(`Defenders near the carrier by zone — ${K} neutral matches (0.5 squads)\n`);
console.log(`  zone           frames   within2.6m   within6m   disposs/1k-frames`);
for (const lat of ['central', 'half', 'wide']) {
  for (const third of ['final', 'mid']) {
    const c = cells[key(lat, third)];
    const f = Math.max(c.frames, 1);
    console.log(
      `  ${key(lat, third).padEnd(14)} ${String(c.frames).padStart(6)}   ` +
      `${(c.near / f).toFixed(2).padStart(8)}   ${(c.coll / f).toFixed(2).padStart(8)}   ` +
      `${((c.dispossessed / f) * 1000).toFixed(1).padStart(8)}`,
    );
  }
}
console.log(`\n⭐ real football: central > half > wide for BOTH within-2.6m (夹击) and within-6m.`);
console.log(`  If central ≈ wide, the substrate has NO center/flank pressure asymmetry — the root.`);
