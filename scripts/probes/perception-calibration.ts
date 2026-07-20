// Probe: PERCEPTION CALIBRATION (BASELINE-NOW / LAYER-GATE for S3 — docs/PROBE-
// CONTRACTS.md §5, docs/SUBSTRATE-MAP.md S3). Today the AI reads the full `Match`
// truth directly — there is NO PerceptionSnapshot layer — so the player's ESTIMATE of
// state equals the truth and positional observation error is 0.00 by construction.
// That perfect-information baseline is the whole point of recording this now: when S3
// lands (stale/limited/awareness-gated perception), THIS probe becomes the gate that
// shows obs-error rising from 0 as awareness < 1, WITHOUT touching speed/pass/tackle.
//
// The non-trivial thing it CAN measure today is PERFECT-INFO EXPOSURE: the share of
// player-ticks whose decision has access to ball info a limited eye would lack —
// the ball behind the player's facing, or far away. That's the headroom S3 removes.
//   npx tsx scripts/probes/perception-calibration.ts [matches] [seedOffset]
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);
const FAR = 20; // metres beyond which a limited eye would not have fresh ball info

let samples = 0;
let behind = 0; // ball is behind the player's facing (heading · to-ball < 0)
let far = 0; // ball is > FAR metres away
let exposed = 0; // behind OR far — decision uses info a limited FOV would degrade

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let sc = 0;
  while (!m.finished) {
    m.step(DT);
    sc++;
    if (m.phase !== 'playing' || sc % 3 !== 0) continue;
    const b = m.ball;
    for (const p of m.allPlayers) {
      if (p.sentOff) continue;
      const dx = b.pos.x - p.pos.x;
      const dy = b.pos.y - p.pos.y;
      const d = Math.hypot(dx, dy);
      samples++;
      const isFar = d > FAR;
      const hlen = Math.hypot(p.heading.x, p.heading.y) || 1;
      const dotv = d > 1e-6 ? (p.heading.x * dx + p.heading.y * dy) / (hlen * d) : 1;
      const isBehind = dotv < 0;
      if (isFar) far++;
      if (isBehind) behind++;
      if (isFar || isBehind) exposed++;
    }
  }
}

const pct = (v: number): string => `${((v / Math.max(samples, 1)) * 100).toFixed(1)}%`;
console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   player-ticks sampled ${samples}`);
console.log(`observation error (position MAE): 0.00 m  — PERFECT INFORMATION (AI reads Match truth; no S3 layer)`);
console.log(`perfect-info exposure (headroom S3 removes):`);
console.log(`  ball behind the player's facing: ${pct(behind)}`);
console.log(`  ball > ${FAR}m away:              ${pct(far)}`);
console.log(`  either (limited-eye would degrade): ${pct(exposed)}`);
