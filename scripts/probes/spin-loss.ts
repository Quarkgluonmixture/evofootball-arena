// Probe: the SPIN-THEN-LOSE report (user, 2026-07-17): "球员带着球,转了
// 一大圈身,然后突然球丢了" — a carrier pirouettes through a big arc and
// the ball vanishes. Quantifies before diagnosing:
//   * per ownership spell (outfield carriers), the cumulative body rotation
//     over the trailing 1.0s before the spell ends
//   * how the spell ended (tackle / smother / kick out / push / other)
//   * the spin rate — spells whose trailing rotation exceeds ~200°
// Prints per-match rates and concrete (seed, t, player) repro anchors.
//   npx tsx scripts/probes/spin-loss.ts [nMatches]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const N = Number(process.argv[2] ?? 60);
const SPIN_RAD = 3.5; // ~200° of body turn inside the last second

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

type EndKind = 'tackle' | 'smother' | 'kick' | 'push' | 'other';

const WINDOW = Math.round(1.0 / DT);
let spells = 0;
let spins = 0;
let pirouettes = 0;
const spinEnds: Record<EndKind, number> = { tackle: 0, smother: 0, kick: 0, push: 0, other: 0 };
const piroEnds: Record<EndKind, number> = { tackle: 0, smother: 0, kick: 0, push: 0, other: 0 };
const allEnds: Record<EndKind, number> = { tackle: 0, smother: 0, kick: 0, push: 0, other: 0 };
const examples: string[] = [];
let totalMatches = 0;

for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  totalMatches++;
  let curGid = -1;
  let angles: number[] = []; // signed per-step deltas (trailing window)
  let lastAngle = 0;

  const classify = (owner: ReturnType<() => typeof m.allPlayers[number]>): EndKind => {
    if (m.pendingPass !== null || m.pendingShot !== null) return 'kick';
    if (m.dribbleTouch !== null && m.dribbleTouch.gid === owner.gid) return 'push';
    if (m.ball.owner !== null && m.ball.owner.role === 'GK' && m.ball.owner.side !== owner.side) return 'smother';
    if (owner.stunTimer > 0.45 && m.ball.owner === null) return 'tackle';
    return 'other';
  };

  while (!m.finished) {
    m.step(DT);
    const o = m.ball.owner;
    const gid = o !== null && o.role !== 'GK' ? o.gid : -1;
    if (gid === curGid && gid !== -1) {
      // Same spell: accumulate the body angle (unwrapped).
      const p = m.allPlayers[gid];
      const a = Math.atan2(p.heading.y, p.heading.x);
      let d = a - lastAngle;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      angles.push(d);
      if (angles.length > WINDOW) angles.shift();
      lastAngle = a;
    } else {
      if (curGid !== -1 && angles.length >= 10) {
        // The spell ended (or the carrier changed) — judge the trailing spin.
        spells++;
        const prev = m.allPlayers[curGid];
        const kind = classify(prev);
        allEnds[kind]++;
        const rot = angles.reduce((s, v) => s + Math.abs(v), 0);
        const net = Math.abs(angles.reduce((s, v) => s + v, 0));
        // Oscillation = turning that CANCELS — the flip-flop pirouette.
        // A single committed 200° shield-turn has osc ≈ 0 and is honest
        // football; the reported bug shape is osc-heavy.
        const osc = rot - net;
        if (osc >= 1.8) {
          pirouettes++;
          piroEnds[kind]++;
        }
        if (rot >= SPIN_RAD) {
          spins++;
          spinEnds[kind]++;
          if (examples.length < 12) {
            examples.push(
              `seed ${seed} t=${m.simTime.toFixed(1)} ${prev.side === 0 ? 'A' : 'B'}#${prev.index} ` +
              `rot=${(rot * 57.3).toFixed(0)}° osc=${(osc * 57.3).toFixed(0)}° end=${kind}`,
            );
          }
        }
      }
      curGid = gid;
      angles = [];
      if (gid !== -1) {
        const p = m.allPlayers[gid];
        lastAngle = Math.atan2(p.heading.y, p.heading.x);
      }
    }
  }
}

const pct = (n: number, d: number): string => (d === 0 ? '—' : `${((n / d) * 100).toFixed(1)}%`);
console.log(`${totalMatches} matches, ${spells} carrier spells`);
console.log(`spin spells (≥${(SPIN_RAD * 57.3).toFixed(0)}° in the last 1.0s): ${spins} ` +
  `(${pct(spins, spells)} of spells, ${(spins / totalMatches).toFixed(1)}/match)`);
console.log(`spell endings          all: ` +
  Object.entries(allEnds).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(`spell endings ON A SPIN   : ` +
  Object.entries(spinEnds).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(`spin→tackle: ${spinEnds.tackle} (${(spinEnds.tackle / totalMatches).toFixed(2)}/match)`);
console.log(`PIROUETTES (osc ≥103° in 1.0s — the reported flip-flop shape): ${pirouettes} ` +
  `(${(pirouettes / totalMatches).toFixed(2)}/match) → ` +
  Object.entries(piroEnds).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log('\nexamples:');
for (const e of examples) console.log(`  ${e}`);
