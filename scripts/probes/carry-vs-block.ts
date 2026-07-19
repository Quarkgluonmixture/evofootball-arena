/**
 * Probe (2026-07-19, keystone A — the RIGHT scenario this time): does a
 * COMPACT central defence already provide "过一个还有另一个" (beat one man, a
 * second is there)? Earlier the traffic-wall test was run with the carry team
 * attacking a SPREAD defence (no wall forms) and dismissed. Test it correctly:
 * a pure CARRY team (narrow + high dribble) attacking a COMPACT-defence team
 * vs a SPREAD-defence team. If the compact defence already suppresses central
 * carrying (fewer carry goals, more bodies goal-side, higher dispossession),
 * the emergent cover partly exists and we AMPLIFY it (gene-gated); if not, we
 * BUILD it.
 *
 *   npx tsx scripts/probes/carry-vs-block.ts [matches]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { GOAL_CHANNELS, TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 40);
const HL = 52.5;

const genome = (over: Partial<Record<string, number>>): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
  for (const [k, v] of Object.entries(over)) (g as unknown as Record<string, number>)[k] = v!;
  return g;
};
const squad = (): PlayerAttributes[] => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
};
const info = (name: string, g: TacticalGenome): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: g, squad: squad(),
});

// A pure central carry team.
const CARRY = genome({ attackingWidth: 0.12, dribbleBias: 0.85, passBias: 0.3, defensiveCompactness: 0.5 });
// Two defensive setups it attacks:
const COMPACT = genome({ defensiveCompactness: 0.95, dribbleBias: 0.4, attackingWidth: 0.3, pressIntensity: 0.4 });
const SPREAD = genome({ defensiveCompactness: 0.15, dribbleBias: 0.4, attackingWidth: 0.7, pressIntensity: 0.4 });

function run(defName: string, defGenome: TacticalGenome) {
  const t = { gf: 0, ch: {} as Record<string, number>, frames: 0, near: 0, coll: 0, cover: 0, disp: 0, matches: 0 };
  for (const c of GOAL_CHANNELS) t.ch[c] = 0;
  let seed = 1;
  for (let k = 0; k < K; k++) {
    const carryHome = k % 2 === 0;
    const m = new Match({
      seed: seed++,
      teamA: carryHome ? info('CARRY', CARRY) : info('DEF', defGenome),
      teamB: carryHome ? info('DEF', defGenome) : info('CARRY', CARRY),
      duration: 300,
    });
    const carrySide = carryHome ? 0 : 1;
    let prevGid: number | null = null;
    let prevCentral = false;
    while (!m.finished) {
      m.step(DT);
      const own = m.ball.owner;
      // dispossession of a central carry
      if (prevGid !== null && prevCentral && (own === null || own.gid !== prevGid)) {
        const stillCarry = own !== null && own.side === carrySide;
        if (!stillCarry) t.disp++;
      }
      prevGid = null; prevCentral = false;
      if (!own || own.side !== carrySide || own.role === 'GK') continue;
      const ct = m.teams[carrySide];
      const lx = ct.localX(own.pos.x);
      if (lx <= 0) continue;
      const central = Math.abs(own.pos.y) < 9;
      if (!central) continue; // this probe cares about CENTRAL carrying only
      t.frames++;
      let near = 0, coll = 0, cover = 0;
      for (const o of m.teams[1 - carrySide].players) {
        if (o.sentOff || o.role === 'GK') continue;
        const dx = o.pos.x - own.pos.x, dy = o.pos.y - own.pos.y;
        const d = Math.hypot(dx, dy);
        if (d < 2.6) near++;
        if (d < 6) coll++;
        // "the next man": goal-side of the carrier, within 10m ahead, central cone
        const ahead = ct.localX(o.pos.x) - lx;
        if (ahead > 0.5 && ahead < 10 && Math.abs(dy) < 6) cover++;
      }
      t.near += near; t.coll += coll; t.cover += cover;
      prevGid = own.gid; prevCentral = true;
    }
    const r = m.getResult();
    t.gf += r.score[carrySide];
    for (const c of GOAL_CHANNELS) t.ch[c] += r.stats[carrySide].goalChannels[c];
    t.matches++;
  }
  const f = Math.max(t.frames, 1);
  const chan = GOAL_CHANNELS.map((c) => `${c} ${t.ch[c]}`).filter((s) => !s.endsWith(' 0')).join(' · ');
  console.log(`CARRY vs ${defName}:  GF/m ${(t.gf / t.matches).toFixed(2)}   central-carry frames ${t.frames}`);
  console.log(`   goals: ${chan}`);
  console.log(`   central carrier faces: within2.6m ${(t.near / f).toFixed(2)} · within6m ${(t.coll / f).toFixed(2)} · cover(goal-side<10m) ${(t.cover / f).toFixed(2)} · disp/1k ${((t.disp / f) * 1000).toFixed(1)}`);
}

console.log(`Pure CARRY team vs COMPACT vs SPREAD defence — ${K} matches each, 0.5 squads\n`);
run('COMPACT', COMPACT);
console.log('');
run('SPREAD', SPREAD);
console.log(`\n⭐ if COMPACT suppresses central carry (fewer carry goals, more cover/disp) the emergent 过一个还有另一个 exists → amplify; if COMPACT ≈ SPREAD, it does NOT → build it.`);
