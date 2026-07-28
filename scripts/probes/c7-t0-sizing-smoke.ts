// C7 T0 — SHOT-RELEASE CENSUS: pre-freeze SIZING SMOKE (read-only).
//
// This is NOT the census instrument. It is the cheap ex-ante sizing that
// derives T0's population floors from ATTAINABLE rates before they are frozen
// (ruling #24 attainable-population law; #44.5 standing sizing-before-freeze
// practice; the P1R pre-freeze-sizing precedent; the C6 T0 smoke's shape).
// It estimates, on the SHOT population:
//   (1) shots per match, split by release PATH (open-play / one-touch /
//       header / free-kick) so the v1 SEAT population (open-play + one-touch,
//       the paths that route through performShot -> kickBall) is sized apart
//       from the excluded paths (header = separate aerial contact; free-kick =
//       dead-ball restart-taker path);
//   (2) body state at the shot commit: |v| and |omega| bands, and the
//       misalignment theta between the body facing and the strike direction;
//   (3) the charge-down exposure geometry: nearest-defender-to-BALL distance
//       and its CLOSING SPEED at commit (the population the interruption
//       instrument forks on);
//   (4) the interruption-exposed share under two SAMPLE W values (0.10 s,
//       0.15 s) with BOTH reach models (current closing speed = primary;
//       defender top speed = sensitivity) -- this sizes the BINDING floor;
//   (5) the theta head-room: how much theta decays in W at TURN_RATE (pure
//       arithmetic) -- sizes the quality-headroom population;
//   (6) the spell context: time from gaining ownership to the shot commit,
//       against the 0.33 s median spell.
//
// Zero src/** changes. No flag touched. Nothing armed. Read-only measurement.
//
// Constants are DERIVED from named code, not invented:
//   theta decay:  TURN_RATE = 6.5 rad/s (Player.ts:17).
//   tackle reach: the 1.15 m ball-keyed tackle radius (mechanics.ts:1757).
//   tick:         DT = 1/60 s (constants.ts:55).
//   cadence:      AI_INTERVAL = 0.15 s (constants.ts:342).
//   spell:        median ownership spell 0.33 s (ruling #29.2 / C5-T1).
//   V_REF:        7 m/s role top-speed reference (the C6 T0/T1 convention).
//   orientation prices: orientationPowerMul/orientationNoiseMul (mechanics.ts:78-88),
//                 scaled by dribbling exactly as performShot does (mechanics.ts:1244+).
//
// Usage:
//   npx tsx scripts/probes/c7-t0-sizing-smoke.ts [matches] [seedOffset]

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
const SEED_OFFSET = Number(process.argv[3] ?? 6_600_000);

const TACKLE_R = 1.15; // ball-keyed tackle radius (mechanics.ts:1757)
const V_REF = 7.0; // role top-speed reference (C6 convention)
const TOP_SPEED = 7.0; // defender top speed for the sensitivity reach model
const OMEGA_LO = 0.1 * TURN_RATE; // 0.65 rad/s: essentially straight
const OMEGA_HI = 0.5 * TURN_RATE; // 3.25 rad/s: hard turn
const SPEED_LO = 2.5;
const SPEED_HI = 5.0;
const SAMPLE_W = [0.1, 0.15]; // sample wind-up windows (seconds) for sizing

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

const speedBand = (v: number): number => (v <= SPEED_LO ? 0 : v <= SPEED_HI ? 1 : 2);
const omegaBand = (w: number): number => (w < OMEGA_LO ? 0 : w < OMEGA_HI ? 1 : 2);
const SPEED_NAMES = ['walk<=2.5', 'jog2.5-5', 'sprint>5'];
const OMEGA_NAMES = ['straight<0.65', 'moderate0.65-3.25', 'hard>=3.25'];

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
  theta: number; // misalignment angle body-facing -> strike dir (rad)
  defDist: number; // nearest defender distance to the BALL at commit
  closeSpeed: number; // that defender's closing speed on the ball (m/s)
  dribbling: number;
  spellTicks: number; // ticks from gaining ownership to commit
}

const shots: ShotRec[] = [];
const shotsPerMatch: number[] = [];
let totalSteps = 0;

// Per-owner spell tracking + previous heading for omega.
interface OwnerState {
  gid: number;
  spellStartTick: number;
  prevHeading: { x: number; y: number };
}

for (let m = 0; m < MATCHES; m++) {
  const seed = SEED_OFFSET + m;
  const match = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  let owner: OwnerState | null = null;
  let shotsThisMatch = 0;

  while (!match.finished) {
    // --- PRE-STEP snapshot of the feet owner (the prospective shooter) ---
    const o = match.ball.owner;
    const playing = match.phase === 'playing';
    const outfield = o && !o.sentOff && o.role !== 'GK';

    let snap: (ShotRec & { gid: number; headingX: number; headingY: number }) | null = null;
    if (playing && o && outfield) {
      if (!owner || owner.gid !== o.gid) {
        owner = { gid: o.gid, spellStartTick: match.simTick, prevHeading: { ...o.heading } };
      }
      const omega = Math.abs(headingDelta(owner.prevHeading, o.heading)) / DT;
      owner.prevHeading = { ...o.heading };

      // nearest defender to the BALL + its closing speed on the ball
      const ball = match.ball;
      const opps = match.teams[1 - o.side].players;
      let defDist = Infinity;
      let closeSpeed = 0;
      for (const q of opps) {
        if (q.sentOff) continue;
        const d = dist(q.pos, ball.pos);
        if (d < defDist) {
          defDist = d;
          // closing speed = rate the def->ball gap shrinks; ball moves with owner
          const toBall = norm(sub(ball.pos, q.pos));
          const relVel = sub(q.vel, o.vel);
          closeSpeed = dot(relVel, toBall); // >0 = closing
        }
      }
      const isRestartTaker = match.restartKickGid === o.gid;
      snap = {
        gid: o.gid,
        path: isRestartTaker ? 'freekick' : o.firstTouchWindow > 0 ? 'onetouch' : 'openplay',
        v: len(o.vel),
        omega,
        theta: 0, // filled post-step from ball.vel
        defDist,
        closeSpeed: Math.max(0, closeSpeed),
        dribbling: o.attrs.dribbling,
        spellTicks: match.simTick - owner.spellStartTick,
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
          // strike direction reconstructed from the freed ball velocity
          const bv = match.ball.vel;
          const bl = len(bv);
          let theta = 0;
          if (bl > 1e-6) {
            const dotv = (snap.headingX * bv.x + snap.headingY * bv.y) / bl;
            theta = Math.acos(Math.max(-1, Math.min(1, dotv)));
          }
          shots.push({ ...snap, theta });
        } else {
          // no feet owner pre-step => aerial header shot (performHeaderShot)
          shots.push({
            path: 'header',
            v: 0,
            omega: 0,
            theta: 0,
            defDist: Infinity,
            closeSpeed: 0,
            dribbling: 0,
            spellTicks: 0,
          });
        }
        shotsThisMatch += 1;
      }
    }
  }
  shotsPerMatch.push(shotsThisMatch);
}

// ---------------- reporting ----------------
const pct = (n: number, d: number): string => (d === 0 ? 'n/a' : `${((100 * n) / d).toFixed(2)}%`);
const seat = shots.filter((s) => s.path === 'openplay' || s.path === 'onetouch');
const byPath = (p: string) => shots.filter((s) => s.path === p).length;

console.log('=== C7 T0 SIZING SMOKE ===');
console.log(`matches ${MATCHES}, seedOffset ${SEED_OFFSET}, total steps ${totalSteps}`);
console.log(`total shots logged: ${shots.length} (${(shots.length / MATCHES).toFixed(2)}/match)`);
console.log(`shots/match: p10 ${quantile(shotsPerMatch, 0.1).toFixed(1)} p50 ${quantile(shotsPerMatch, 0.5).toFixed(1)} p90 ${quantile(shotsPerMatch, 0.9).toFixed(1)}`);
console.log('');
console.log('--- shot population by release path ---');
for (const p of ['openplay', 'onetouch', 'header', 'freekick']) {
  console.log(`${byPath(p).toString().padStart(6)}  ${pct(byPath(p), shots.length).padStart(7)}  ${p}`);
}
console.log(`v1 SEAT (openplay+onetouch): ${seat.length} (${(seat.length / MATCHES).toFixed(2)}/match, ${pct(seat.length, shots.length)} of all shots)`);
console.log('');

console.log('--- v1-seat body state at commit ---');
console.log(`|v| m/s:   p10 ${quantile(seat.map((s) => s.v), 0.1).toFixed(2)} p50 ${quantile(seat.map((s) => s.v), 0.5).toFixed(2)} p90 ${quantile(seat.map((s) => s.v), 0.9).toFixed(2)}`);
console.log(`|omega|:   p10 ${quantile(seat.map((s) => s.omega), 0.1).toFixed(2)} p50 ${quantile(seat.map((s) => s.omega), 0.5).toFixed(2)} p90 ${quantile(seat.map((s) => s.omega), 0.9).toFixed(2)} rad/s`);
console.log(`theta deg: p10 ${((quantile(seat.map((s) => s.theta), 0.1)) * 180 / Math.PI).toFixed(1)} p50 ${((quantile(seat.map((s) => s.theta), 0.5)) * 180 / Math.PI).toFixed(1)} p90 ${((quantile(seat.map((s) => s.theta), 0.9)) * 180 / Math.PI).toFixed(1)}`);
console.log('  |v| bands:    ' + [0, 1, 2].map((b) => `${SPEED_NAMES[b]} ${pct(seat.filter((s) => speedBand(s.v) === b).length, seat.length)}`).join('  '));
console.log('  |omega| bands: ' + [0, 1, 2].map((b) => `${OMEGA_NAMES[b]} ${pct(seat.filter((s) => omegaBand(s.omega) === b).length, seat.length)}`).join('  '));
const twisted30 = seat.filter((s) => (s.theta * 180) / Math.PI >= 30).length;
const twisted45 = seat.filter((s) => (s.theta * 180) / Math.PI >= 45).length;
console.log(`  twisted at commit: theta>=30deg ${twisted30} (${pct(twisted30, seat.length)})  theta>=45deg ${twisted45} (${pct(twisted45, seat.length)})`);
console.log('');

console.log('--- charge-down exposure geometry (v1-seat, nearest def to BALL) ---');
const finiteDef = seat.filter((s) => Number.isFinite(s.defDist));
console.log(`def dist m:    p10 ${quantile(finiteDef.map((s) => s.defDist), 0.1).toFixed(2)} p50 ${quantile(finiteDef.map((s) => s.defDist), 0.5).toFixed(2)} p90 ${quantile(finiteDef.map((s) => s.defDist), 0.9).toFixed(2)}`);
console.log(`close speed:   p10 ${quantile(finiteDef.map((s) => s.closeSpeed), 0.1).toFixed(2)} p50 ${quantile(finiteDef.map((s) => s.closeSpeed), 0.5).toFixed(2)} p90 ${quantile(finiteDef.map((s) => s.closeSpeed), 0.9).toFixed(2)} m/s`);
console.log(`def within 3 m of ball at commit: ${pct(seat.filter((s) => s.defDist <= 3).length, seat.length)}`);
console.log('');

console.log('--- (BINDING FLOOR SIZE) interruption-exposed share under sample W ---');
for (const W of SAMPLE_W) {
  // primary: reach at current closing speed; sensitivity: reach at top speed
  const reachPrimary = seat.filter((s) => s.defDist - s.closeSpeed * W <= TACKLE_R).length;
  const reachTop = seat.filter((s) => s.defDist - TOP_SPEED * W <= TACKLE_R).length;
  console.log(`W=${W.toFixed(2)}s: exposed(current-closing) ${reachPrimary} (${pct(reachPrimary, seat.length)})  |  exposed(top-speed sensitivity) ${reachTop} (${pct(reachTop, seat.length)})`);
}
console.log('');

console.log('--- theta head-room under sample W (pure arithmetic at TURN_RATE) ---');
for (const W of SAMPLE_W) {
  const deltas: number[] = [];
  const powerGains: number[] = [];
  const noiseDrops: number[] = [];
  for (const s of seat) {
    const thetaW = Math.max(0, s.theta - TURN_RATE * W);
    const mCommit = (1 - Math.cos(s.theta)) / 2;
    const mW = (1 - Math.cos(thetaW)) / 2;
    deltas.push(((s.theta - thetaW) * 180) / Math.PI);
    // exact mechanics.ts:78-88 formulas, dribbling as the tech attr
    powerGains.push(orientationPowerMul(mW, s.dribbling) - orientationPowerMul(mCommit, s.dribbling));
    noiseDrops.push(orientationNoiseMul(mCommit, s.dribbling) - orientationNoiseMul(mW, s.dribbling));
  }
  const mean = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
  const fullyResolved = seat.filter((s) => s.theta <= TURN_RATE * W).length;
  console.log(`W=${W.toFixed(2)}s: theta decay mean ${mean(deltas).toFixed(1)} deg; theta fully cancelled in ${pct(fullyResolved, seat.length)} of shots; mean powerMul gain +${(100 * mean(powerGains)).toFixed(2)}pp; mean noiseMul drop -${(100 * mean(noiseDrops)).toFixed(2)}pp`);
}
console.log('');

console.log('--- spell context: gaining ownership -> shot commit (v1-seat) ---');
const spellS = seat.map((s) => s.spellTicks * DT);
console.log(`spell-to-commit s: p10 ${quantile(spellS, 0.1).toFixed(3)} p50 ${quantile(spellS, 0.5).toFixed(3)} p90 ${quantile(spellS, 0.9).toFixed(3)}`);
console.log(`(median ownership spell = 0.33 s; a shot's own spell uses this much of it)`);
