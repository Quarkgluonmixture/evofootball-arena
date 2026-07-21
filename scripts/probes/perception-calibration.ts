// Probe: PERCEPTION CALIBRATION (LAYER-GATE for S3 — docs/PROBE-CONTRACTS.md §5,
// docs/SUBSTRATE-MAP.md S3). Live AI still reads Match truth, so the first block keeps
// the frozen perfect-information exposure baseline. The second block evaluates the
// pure PerceptionSnapshot representation OFFLINE at three synthetic awareness values:
// error, staleness, coverage, and missed/phantom near threats. It consumes no Match RNG
// and cannot affect decisions or outcomes.
//   npx tsx scripts/probes/perception-calibration.ts [matches] [seedOffset]
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory,
} from '../../src/ai/perceptionSnapshot';
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
const THREAT_R = 6;
const AWARENESS = [0.2, 0.5, 0.8] as const;

interface Calibration {
  snapshots: number;
  observedPlayers: number;
  observations: number;
  posError: number;
  velError: number;
  ageTicks: number;
  threats: number;
  missedThreats: number;
  phantoms: number;
}

const calibrations = new Map<number, Calibration>(AWARENESS.map((awareness) => [awareness, {
  snapshots: 0,
  observedPlayers: 0,
  observations: 0,
  posError: 0,
  velError: 0,
  ageTicks: 0,
  threats: 0,
  missedThreats: 0,
  phantoms: 0,
}]));

let samples = 0;
let behind = 0; // ball is behind the player's facing (heading · to-ball < 0)
let far = 0; // ball is > FAR metres away
let exposed = 0; // behind OR far — decision uses info a limited FOV would degrade

for (let seed = OFF; seed < OFF + N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  const memories = new Map<number, Map<number, PerceptionMemory>>(
    AWARENESS.map((awareness) => [awareness, new Map()]),
  );
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

    const observer = b.owner;
    if (!observer || observer.sentOff || observer.role === 'GK') continue;
    const truth = capturePerceptionTruth(m);
    const truthByGid = new Map(truth.players.map((p) => [p.gid, p]));
    for (const awareness of AWARENESS) {
      const byPlayer = memories.get(awareness)!;
      let memory = byPlayer.get(observer.gid);
      if (!memory) {
        memory = createPerceptionMemory();
        byPlayer.set(observer.gid, memory);
      }
      const snapshot = perceiveSnapshot(truth, observer.gid, awareness, seed, memory);
      const metric = calibrations.get(awareness)!;
      const observedByGid = new Map(snapshot.players.map((p) => [p.gid, p]));
      metric.snapshots++;
      metric.observedPlayers += snapshot.players.length - 1; // observer is exact, omit it

      for (const observed of snapshot.players) {
        if (observed.gid === observer.gid) continue;
        const actual = truthByGid.get(observed.gid)!;
        metric.observations++;
        metric.posError += Math.hypot(observed.pos.x - actual.pos.x, observed.pos.y - actual.pos.y);
        metric.velError += Math.hypot(observed.vel.x - actual.vel.x, observed.vel.y - actual.vel.y);
        metric.ageTicks += observed.ageTicks;
        if (observed.side !== observer.side) {
          const observedD = Math.hypot(observed.pos.x - observer.pos.x, observed.pos.y - observer.pos.y);
          const actualD = Math.hypot(actual.pos.x - observer.pos.x, actual.pos.y - observer.pos.y);
          if (observedD <= THREAT_R && actualD > THREAT_R + 2) metric.phantoms++;
        }
      }

      for (const actual of truth.players) {
        if (actual.sentOff || actual.side === observer.side) continue;
        const d = Math.hypot(actual.pos.x - observer.pos.x, actual.pos.y - observer.pos.y);
        if (d > THREAT_R) continue;
        metric.threats++;
        if (!observedByGid.has(actual.gid)) metric.missedThreats++;
      }
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
console.log(`offline PerceptionSnapshot (on-ball outfield passer; NOT wired to AI):`);
for (const awareness of AWARENESS) {
  const m = calibrations.get(awareness)!;
  const obs = Math.max(m.observations, 1);
  const snaps = Math.max(m.snapshots, 1);
  const threats = Math.max(m.threats, 1);
  console.log(
    `  awareness ${awareness.toFixed(1)}: ${m.snapshots} snapshots, `
    + `${(m.observedPlayers / snaps).toFixed(1)} players/snapshot, `
    + `pos MAE ${(m.posError / obs).toFixed(2)}m, vel MAE ${(m.velError / obs).toFixed(2)}m/s, `
    + `age ${(m.ageTicks / obs).toFixed(1)} ticks, `
    + `missed <=${THREAT_R}m threats ${((m.missedThreats / threats) * 100).toFixed(1)}%, `
    + `phantoms ${m.phantoms}`,
  );
}
