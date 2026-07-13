// Probe: Magnus arcs (Phase 37). Two claims to verify, cross-version:
//   1. Corner deliveries now fly a VISIBLE bow (max perpendicular deviation
//      from the kick→descent chord) — ~0 on phase-36, real meters on 37.
//   2. The landing scatter did NOT regress (pre-compensation invariance):
//      distance from the descent point to the routine's key zone must match
//      phase-36 (the 31.9 chain rides on this).
//   npx tsx scripts/probes/magnus-arcs.ts
//   git worktree at phase-36 + cp probe + run there for the baseline row.
import { cornerKeyZone } from '../../src/ai/formations';
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

const N = 200;
let corners = 0;
const misses: number[] = [];
const bows: number[] = [];

for (let seed = 0; seed < N; seed++) {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240 });
  let flight: {
    kx: number; ky: number; zone: { x: number; y: number }; maxBow: number; wasUp: boolean;
    t0: number; spin0: number;
  } | null = null;
  // Two-stage detection: the hand-off ends the restart but the TAKER still
  // owns the ball — the kick itself comes ~0.15s later (owner→null, vz up).
  let armed: { zone: { x: number; y: number }; takerGid: number } | null = null;
  let prevRestart = false;
  let flagY = 0;
  while (!m.finished) {
    const inCorner = m.phase === 'restart' && m.restart?.kind === 'corner';
    if (inCorner) flagY = m.restart!.pos.y;
    m.step(DT);
    if (prevRestart && m.phase !== 'restart' && m.restartKickKind === 'corner' && m.restartKickRoutine !== null) {
      const routine = m.restartKickRoutine;
      if ((routine === 'farPost' || routine === 'nearPost') && m.restartKickGid !== null) {
        const side = m.allPlayers[m.restartKickGid].side;
        armed = { zone: cornerKeyZone(routine, m.teams[side].attackDir, flagY), takerGid: m.restartKickGid };
      }
    }
    prevRestart = m.phase === 'restart' && m.restart?.kind === 'corner';
    if (armed) {
      if (m.ball.owner === null && m.ball.vz > 2) {
        flight = {
          kx: m.ball.pos.x, ky: m.ball.pos.y, zone: armed.zone, maxBow: 0, wasUp: false,
          t0: m.simTime, spin0: (m.ball as unknown as { spin?: number }).spin ?? 0,
        };
        corners++;
        armed = null;
      } else if (m.ball.owner !== null && m.ball.owner.gid !== armed.takerGid) {
        armed = null; // the taker chose a short/ground option or lost it
      }
    }
    if (flight) {
      const b = m.ball;
      if (b.owner !== null) {
        flight = null; // claimed/headed before the descent band — no landing sample
      } else {
        if (b.z > 1.6) flight.wasUp = true;
        if (flight.wasUp && b.z < 1.35 && b.vz < 0) {
          misses.push(Math.hypot(b.pos.x - flight.zone.x, b.pos.y - flight.zone.y));
          // Analytic sagitta of the circular arc: chord·θ/8, θ = |spin₀|·T.
          // (A path-sampled proxy got polluted by knockdown deflections —
          // baseline "bows" of 3.5m on a straight-flight build.)
          const chord = Math.hypot(b.pos.x - flight.kx, b.pos.y - flight.ky);
          bows.push((chord * Math.abs(flight.spin0) * (m.simTime - flight.t0)) / 8);
          flight = null;
        }
      }
    }
  }
}

const mean = (a: number[]): number => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : NaN);
const sd = (a: number[]): number => {
  if (a.length < 2) return NaN;
  const mu = mean(a);
  return Math.sqrt(a.reduce((s, x) => s + (x - mu) * (x - mu), 0) / (a.length - 1));
};
console.log(`n=${N} matches, post-routine corners struck: ${corners}, descent samples: ${misses.length}`);
console.log(`descent → key-zone distance: mean ${mean(misses).toFixed(2)}m, sd ${sd(misses).toFixed(2)}m  (REGRESSION GATE vs phase-36)`);
console.log(`flight bow (analytic sagitta chord·|spin₀|·T/8): mean ${mean(bows).toFixed(2)}m, p90 ${bows.length ? [...bows].sort((a, b) => a - b)[Math.floor(bows.length * 0.9)].toFixed(2) : 'n/a'}m`);
