// C7 T1 — pendingKick: pre-freeze SIZING SMOKE (read-only).
//
// This is NOT the T1 fork-and-force instrument. It is the cheap ex-ante sizing
// that derives T1's population floors from ATTAINABLE rates, under the FROZEN
// T1 W law, before those floors are frozen (ruling #24 attainable-population
// law; #44.5 standing sizing-before-freeze; #46.2 smoke/census seed
// disjointness; the C7 T0 smoke's shape). It is a pure-arithmetic recompute on
// recorded shot-commit states, exactly the method of the T0 census (§2 (iv)):
// it does NOT fork the world, arms no flag, changes no src. The bodies did not
// react — that is precisely what the T1 live forks test.
//
// It estimates, on the v1-SEAT shot population (open-play + one-touch, the
// paths that route through performShot -> kickBall), under the FROZEN T1 W law:
//   (1) seat shots per match                              -> F-SHOT-SEAT
//   (2) interrupted seat shots (PRIMARY current-closing reach model, at the
//       tick-quantized T1 window)                          -> F-INTERRUPTED (axis 1)
//   (3) uninterrupted seat shots                           -> F-UNINTERRUPTED (axis 2)
//   (4) twisted (theta>=30deg at commit) uninterrupted     -> F-TWISTED-UNINT (axis 2 tail)
//   (5) the realised orientation-price head-room at the T1 window (mean noiseMul
//       drop / powerMul gain over uninterrupted shots) — direction confirmation
//   (6) the tick-quantized W distribution (p10/p50/p90) — confirms mean ~0.110 s.
//
// The FROZEN T1 W law (docs/world-model/C7-T1-PENDINGKICK.md §LAW), constants
// derived from and citing the T0 MID bracket (C7-T0-SHOT-RELEASE.md §5):
//   W(v,omega,tech) = clamp( W_BASE + W_MOVE*(v/V_REF) + W_TURN*(omega/TURN_RATE)
//                            - W_TECH*(tech - T_BAR), W_FLOOR, W_CAP )
//   W_ticks = clamp(round(W*60), 3, 11)   (DT = 1/60; whole ticks; no randomness)
//   W_BASE 0.06  W_MOVE 0.05  W_TURN 0.05  W_TECH 0.05  W_FLOOR 0.05  W_CAP 0.18
//   V_REF 7 (Player top-speed ref)  TURN_RATE 6.5 (Player.ts:17)
//   T_BAR 0.4068 (measured population-mean dribbling, T0 §5 (ii))
//   tech = dribbling (the attr that already scales the orientation prices)
//
// Constants derived from named code, not invented:
//   theta decay:  TURN_RATE = 6.5 rad/s (Player.ts:17).
//   tackle reach: the 1.15 m ball-keyed tackle radius (mechanics.ts:1757).
//   tick:         DT = 1/60 s (constants.ts:55).
//   orientation prices: orientationPowerMul/orientationNoiseMul (mechanics.ts:78-88),
//                 scaled by dribbling exactly as performShot does (mechanics.ts:1244+).
//
// Zero src/** changes. No flag touched. Nothing armed. Read-only measurement.
//
// Usage:
//   npx tsx scripts/probes/c7-t1-sizing-smoke.ts [matches] [seedOffset]

import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { dist, dot, len, sub, norm } from '../../src/utils/vec';
import { orientationPowerMul, orientationNoiseMul } from '../../src/sim/mechanics';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 16);
const SEED_OFFSET = Number(process.argv[3] ?? 7_200_000);

const TACKLE_R = 1.15; // ball-keyed tackle radius (mechanics.ts:1757)

// --- FROZEN T1 W law constants (C7-T1-PENDINGKICK.md §LAW) ---
const V_REF = 7.0;
const T_BAR = 0.4068;
const W_BASE = 0.06;
const W_MOVE = 0.05;
const W_TURN = 0.05;
const W_TECH = 0.05;
const W_FLOOR = 0.05;
const W_CAP = 0.18;

const wLawTicks = (v: number, omega: number, tech: number): number => {
  const raw = W_BASE + W_MOVE * (v / V_REF) + W_TURN * (omega / TURN_RATE) - W_TECH * (tech - T_BAR);
  const clamped = Math.max(W_FLOOR, Math.min(W_CAP, raw));
  return Math.max(3, Math.min(11, Math.round(clamped * 60)));
};

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const quantile = (values: number[], p: number): number => {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const i = (s.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
};

const headingDelta = (prev: { x: number; y: number }, cur: { x: number; y: number }): number => {
  const a0 = Math.atan2(prev.y, prev.x);
  const a1 = Math.atan2(cur.y, cur.x);
  let d = a1 - a0;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};

interface ShotRec {
  path: 'openplay' | 'onetouch' | 'header' | 'freekick';
  v: number;
  omega: number;
  theta: number;
  defDist: number;
  closeSpeed: number;
  dribbling: number;
}

const shots: ShotRec[] = [];
let totalSteps = 0;

interface OwnerState {
  gid: number;
  prevHeading: { x: number; y: number };
}

for (let m = 0; m < MATCHES; m++) {
  const seed = SEED_OFFSET + m;
  const match = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  let owner: OwnerState | null = null;

  while (!match.finished) {
    const o = match.ball.owner;
    const playing = match.phase === 'playing';
    const outfield = o && !o.sentOff && o.role !== 'GK';

    let snap: (ShotRec & { gid: number; headingX: number; headingY: number }) | null = null;
    if (playing && o && outfield) {
      if (!owner || owner.gid !== o.gid) {
        owner = { gid: o.gid, prevHeading: { ...o.heading } };
      }
      const omega = Math.abs(headingDelta(owner.prevHeading, o.heading)) / DT;
      owner.prevHeading = { ...o.heading };

      const ball = match.ball;
      const opps = match.teams[1 - o.side].players;
      let defDist = Infinity;
      let closeSpeed = 0;
      for (const q of opps) {
        if (q.sentOff) continue;
        const d = dist(q.pos, ball.pos);
        if (d < defDist) {
          defDist = d;
          const toBall = norm(sub(ball.pos, q.pos));
          const relVel = sub(q.vel, o.vel);
          closeSpeed = dot(relVel, toBall);
        }
      }
      const isRestartTaker = match.restartKickGid === o.gid;
      snap = {
        gid: o.gid,
        path: isRestartTaker ? 'freekick' : o.firstTouchWindow > 0 ? 'onetouch' : 'openplay',
        v: len(o.vel),
        omega,
        theta: 0,
        defDist,
        closeSpeed: Math.max(0, closeSpeed),
        dribbling: o.attrs.dribbling,
        headingX: o.heading.x,
        headingY: o.heading.y,
      };
    } else {
      owner = null;
    }

    const shotsBefore = match.shotLog.length;
    match.step(DT);
    totalSteps += 1;
    const newShots = match.shotLog.length - shotsBefore;

    if (newShots > 0) {
      for (let s = 0; s < newShots; s++) {
        if (snap) {
          const bv = match.ball.vel;
          const bl = len(bv);
          let theta = 0;
          if (bl > 1e-6) {
            const dotv = (snap.headingX * bv.x + snap.headingY * bv.y) / bl;
            theta = Math.acos(Math.max(-1, Math.min(1, dotv)));
          }
          shots.push({ ...snap, theta });
        } else {
          shots.push({ path: 'header', v: 0, omega: 0, theta: 0, defDist: Infinity, closeSpeed: 0, dribbling: 0 });
        }
      }
    }
  }
}

// ---------------- reporting ----------------
const pct = (n: number, d: number): string => (d === 0 ? 'n/a' : `${((100 * n) / d).toFixed(2)}%`);
const seat = shots.filter((s) => s.path === 'openplay' || s.path === 'onetouch');

// Per-shot frozen-T1-W arithmetic (tick-quantized window).
const wTicks = seat.map((s) => wLawTicks(s.v, s.omega, s.dribbling));
const wEff = wTicks.map((t) => t * DT);
const interrupted = seat.map((s, i) => s.defDist - s.closeSpeed * wEff[i] <= TACKLE_R);
const nInterrupted = interrupted.filter(Boolean).length;
const uninterrupted = seat.filter((_, i) => !interrupted[i]);
const uninterruptedIdx = seat.map((_, i) => i).filter((i) => !interrupted[i]);
const twistedUninterrupted = uninterruptedIdx.filter((i) => (seat[i].theta * 180) / Math.PI >= 30).length;

console.log('=== C7 T1 SIZING SMOKE (frozen T1 W law) ===');
console.log(`matches ${MATCHES}, seedOffset ${SEED_OFFSET}, total steps ${totalSteps}`);
console.log(`total shots logged: ${shots.length} (${(shots.length / MATCHES).toFixed(2)}/match)`);
console.log('');
console.log(`v1 SEAT (openplay+onetouch): ${seat.length} (${(seat.length / MATCHES).toFixed(2)}/match)`);
console.log('');
console.log('--- tick-quantized W distribution (frozen T1 law) ---');
console.log(`W ticks: p10 ${quantile(wTicks, 0.1).toFixed(0)} p50 ${quantile(wTicks, 0.5).toFixed(0)} p90 ${quantile(wTicks, 0.9).toFixed(0)}`);
console.log(`W sec:   p10 ${quantile(wEff, 0.1).toFixed(4)} p50 ${quantile(wEff, 0.5).toFixed(4)} p90 ${quantile(wEff, 0.9).toFixed(4)}  mean ${(wEff.reduce((a, b) => a + b, 0) / wEff.length).toFixed(4)}`);
console.log('');
console.log('--- (FLOOR SIZES) populations under the frozen T1 W law ---');
console.log(`seat shots (F-SHOT-SEAT):                 ${seat.length} (${(seat.length / MATCHES).toFixed(2)}/match)`);
console.log(`interrupted, PRIMARY reach (F-INTERRUPTED): ${nInterrupted} (${pct(nInterrupted, seat.length)} of seat, ${(nInterrupted / MATCHES).toFixed(3)}/match)`);
console.log(`uninterrupted (F-UNINTERRUPTED):           ${uninterrupted.length} (${(uninterrupted.length / MATCHES).toFixed(2)}/match)`);
console.log(`twisted>=30 uninterrupted (F-TWISTED-UNINT): ${twistedUninterrupted} (${(twistedUninterrupted / MATCHES).toFixed(3)}/match)`);
console.log('');
console.log('--- realised orientation-price head-room at the T1 window (uninterrupted) ---');
{
  const powerGains: number[] = [];
  const noiseDrops: number[] = [];
  for (const i of uninterruptedIdx) {
    const s = seat[i];
    const thetaW = Math.max(0, s.theta - TURN_RATE * wEff[i]);
    const mCommit = (1 - Math.cos(s.theta)) / 2;
    const mW = (1 - Math.cos(thetaW)) / 2;
    powerGains.push(orientationPowerMul(mW, s.dribbling) - orientationPowerMul(mCommit, s.dribbling));
    noiseDrops.push(orientationNoiseMul(mCommit, s.dribbling) - orientationNoiseMul(mW, s.dribbling));
  }
  const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  console.log(`mean powerMul gain +${(100 * mean(powerGains)).toFixed(2)}pp; mean noiseMul drop -${(100 * mean(noiseDrops)).toFixed(2)}pp`);
}
