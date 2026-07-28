// C6 T0 — CARRY-GEOMETRY CENSUS: pre-freeze SIZING SMOKE (read-only).
//
// This is NOT the census instrument. It is the cheap ex-ante sizing that
// derives T0's population floors from ATTAINABLE rates before they are frozen
// (ruling #24 attainable-population law; #44.5 standing sizing-before-freeze
// practice; the P1R pre-freeze-sizing precedent). It estimates:
//   (1) the carry-state population base (owned outfield playing ticks) and its
//       spread over the speed x turn-rate x pressure bands + action labels;
//   (2) the turn-episode rate (heading sweep >= 90 deg while owned): count per
//       match and duration distribution;
//   (3) the pressured-carry rate (nearest opponent within TOUCH_CONTROL_DIST);
//   (4) tackle-ELIGIBILITY (an opponent within the 1.15 m ball tackle radius)
//       during owned play, during turn episodes, and in a declared window after
//       them, split by approach side relative to the ball offset -- the
//       attainable population the exposure instrument (T0 (iii)) will fork on.
//
// Zero src/** changes. No flag touched. Nothing armed. Read-only measurement.
//
// Band edges are DERIVED from named code constants, not invented:
//   speed:     the 2.5 m/s de-glue gate (Match.ts:1420); 5.0 = 2x the gate.
//   turn-rate: TURN_RATE = 6.5 rad/s (Player.ts:17); edges 0.1x and 0.5x it.
//   pressure:  TOUCH_CONTROL_DIST = 4.2 m (constants.ts:315); half = 2.1 m.
//   tackle:    the 1.15 m ball-keyed tackle radius (mechanics.ts:1757).
//
// Usage:
//   npx tsx scripts/probes/c6-t0-sizing-smoke.ts [matches] [seedOffset]

import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { dist, dot, len, sub } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 16);
const SEED_OFFSET = Number(process.argv[3] ?? 4_000_000);

// Derived band edges.
const SPEED_LO = 2.5; // the de-glue speed gate
const SPEED_HI = 5.0; // 2x the gate
const OMEGA_LO = 0.1 * TURN_RATE; // 0.65 rad/s: essentially straight
const OMEGA_HI = 0.5 * TURN_RATE; // 3.25 rad/s: hard turn (>= half the cap)
const PRESS_TIGHT = 0.5 * TOUCH_CONTROL_DIST; // 2.1 m
const PRESS_GLUE = TOUCH_CONTROL_DIST; // 4.2 m (the space gate)
const TACKLE_R = 1.15; // ball-keyed tackle radius
const SWEEP_THRESHOLD = Math.PI / 2; // 90 deg turn episode
const POST_WINDOW_TICKS = 30; // 0.5 s window after an episode ends

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
const pressBand = (d: number): number => (d <= PRESS_TIGHT ? 0 : d <= PRESS_GLUE ? 1 : 2);

const SPEED_NAMES = ['walk<=2.5', 'jog2.5-5', 'sprint>5'];
const OMEGA_NAMES = ['straight<0.65', 'moderate0.65-3.25', 'hard>=3.25'];
const PRESS_NAMES = ['tight<=2.1', 'pressured2.1-4.2', 'free>4.2'];

const quantile = (values: number[], p: number): number => {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const i = (s.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
};

// Signed heading angle change between two unit heading vectors.
const headingDelta = (prev: { x: number; y: number }, cur: { x: number; y: number }): number => {
  const a0 = Math.atan2(prev.y, prev.x);
  const a1 = Math.atan2(cur.y, cur.x);
  let d = a1 - a0;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};

let totalSteps = 0;
let ownedTicks = 0; // owned, playing, outfield
const bandCount = new Map<string, number>();
const actionCount = new Map<string, number>();

// pressure population
let pressuredTicks = 0; // nearOpp <= 4.2
let tightTicks = 0; // nearOpp <= 2.1
let tackleEligibleTicks = 0; // opponent within 1.15 m of the BALL
let exposedTicks = 0; // tackle-eligible AND nearest such opp on the ball-offset side
let farsideTicks = 0; // tackle-eligible AND on the far side

// turn episodes (per owning-spell, per player)
const episodesPerMatch: number[] = [];
const episodeDurations: number[] = []; // ticks
let episodesTackleDuring = 0; // episodes with >=1 tackle-eligible tick during the sweep
let episodesTackleAfter = 0; // episodes with >=1 tackle-eligible tick in the post window

// Per-owner running state, keyed by gid; reset when ownership changes.
interface Carry {
  gid: number;
  prevHeading: { x: number; y: number };
  sweepAccum: number; // signed accumulated heading change in the current episode
  inEpisode: boolean;
  episodeTackleDuring: boolean;
  episodeStartTick: number;
  postWindowFor: number; // remaining post-window ticks after an episode ended
  postTackleSeen: boolean;
  postPendingCount: boolean; // an episode is awaiting its post-window verdict
}

for (let m = 0; m < MATCHES; m++) {
  const seed = SEED_OFFSET + m;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
  });

  let episodesThisMatch = 0;
  let carry: Carry | null = null;

  const closePost = (c: Carry): void => {
    if (c.postPendingCount) {
      if (c.postTackleSeen) episodesTackleAfter += 1;
      c.postPendingCount = false;
      c.postTackleSeen = false;
      c.postWindowFor = 0;
    }
  };

  while (!match.finished) {
    match.step(DT);
    totalSteps += 1;

    const owner = match.ball.owner;
    const playing = match.phase === 'playing';
    const outfield = owner && !owner.sentOff && owner.role !== 'GK';

    if (!playing || !owner || !outfield) {
      if (carry) {
        closePost(carry);
        carry = null;
      }
      continue;
    }

    // Ownership change resets the carry tracker.
    if (!carry || carry.gid !== owner.gid) {
      if (carry) closePost(carry);
      carry = {
        gid: owner.gid,
        prevHeading: { x: owner.heading.x, y: owner.heading.y },
        sweepAccum: 0,
        inEpisode: false,
        episodeTackleDuring: false,
        episodeStartTick: match.simTick,
        postWindowFor: 0,
        postTackleSeen: false,
        postPendingCount: false,
      };
    }

    ownedTicks += 1;

    const v = len(owner.vel);
    const dHead = headingDelta(carry.prevHeading, { x: owner.heading.x, y: owner.heading.y });
    const omega = Math.abs(dHead) / DT;
    carry.prevHeading = { x: owner.heading.x, y: owner.heading.y };

    // nearest opponent (body-to-body, matching the de-glue space gate)
    const opps = match.teams[1 - owner.side].players;
    let nearOpp = Infinity;
    for (const q of opps) {
      if (q.sentOff) continue;
      const d = dist(q.pos, owner.pos);
      if (d < nearOpp) nearOpp = d;
    }

    // band tallies
    const sb = speedBand(v);
    const ob = omegaBand(omega);
    const pb = pressBand(nearOpp);
    const key = `${sb}|${ob}|${pb}`;
    bandCount.set(key, (bandCount.get(key) ?? 0) + 1);
    actionCount.set(owner.action.type, (actionCount.get(owner.action.type) ?? 0) + 1);

    if (nearOpp <= PRESS_GLUE) pressuredTicks += 1;
    if (nearOpp <= PRESS_TIGHT) tightTicks += 1;

    // tackle-eligibility (opponent within the 1.15 m ball radius) + approach side
    const ball = match.ball;
    const offset = sub(ball.pos, owner.pos); // ball offset from the body
    let eligible = false;
    let nearestEligDot = 0;
    let nearestEligDist = Infinity;
    for (const q of opps) {
      if (q.sentOff) continue;
      const db = dist(q.pos, ball.pos);
      if (db < TACKLE_R && db < nearestEligDist) {
        eligible = true;
        nearestEligDist = db;
        nearestEligDot = dot(sub(q.pos, owner.pos), offset); // >0 = ball-offset side
      }
    }
    if (eligible) {
      tackleEligibleTicks += 1;
      if (nearestEligDot >= 0) exposedTicks += 1;
      else farsideTicks += 1;
    }

    // turn-episode detection (accumulate signed sweep; sign flip resets accum)
    if (carry.sweepAccum !== 0 && Math.sign(dHead) !== Math.sign(carry.sweepAccum) && dHead !== 0) {
      carry.sweepAccum = dHead;
    } else {
      carry.sweepAccum += dHead;
    }
    if (!carry.inEpisode && Math.abs(carry.sweepAccum) >= SWEEP_THRESHOLD) {
      carry.inEpisode = true;
      carry.episodeTackleDuring = false;
      carry.episodeStartTick = match.simTick;
    }
    if (carry.inEpisode) {
      if (eligible) carry.episodeTackleDuring = true;
      // an episode "ends" when the sweep stalls (|omega| small this tick)
      if (omega < OMEGA_LO) {
        episodesThisMatch += 1;
        episodeDurations.push(match.simTick - carry.episodeStartTick + 1);
        if (carry.episodeTackleDuring) episodesTackleDuring += 1;
        // open the post window; first close any prior pending
        closePost(carry);
        carry.inEpisode = false;
        carry.sweepAccum = 0;
        carry.postWindowFor = POST_WINDOW_TICKS;
        carry.postPendingCount = true;
        carry.postTackleSeen = false;
      }
    } else if (carry.postWindowFor > 0) {
      if (eligible) carry.postTackleSeen = true;
      carry.postWindowFor -= 1;
      if (carry.postWindowFor === 0) closePost(carry);
    }
  }

  if (carry) closePost(carry);
  episodesPerMatch.push(episodesThisMatch);
}

const pct = (n: number, d: number): string => (d === 0 ? 'n/a' : `${((100 * n) / d).toFixed(2)}%`);
const totalEpisodes = episodeDurations.length;

console.log('=== C6 T0 SIZING SMOKE ===');
console.log(`matches ${MATCHES}, seedOffset ${SEED_OFFSET}, total steps ${totalSteps}`);
console.log(`owned outfield playing ticks: ${ownedTicks} (${pct(ownedTicks, totalSteps)} of steps)`);
console.log('');
console.log('--- carry-state population by band (speed | turn | pressure) ---');
const cells = [...bandCount.entries()].sort((a, b) => b[1] - a[1]);
for (const [k, c] of cells) {
  const [sb, ob, pb] = k.split('|').map(Number);
  console.log(
    `${c.toString().padStart(7)}  ${pct(c, ownedTicks).padStart(7)}  ` +
      `${SPEED_NAMES[sb]} / ${OMEGA_NAMES[ob]} / ${PRESS_NAMES[pb]}`,
  );
}
console.log('');
console.log('--- action labels while owned ---');
for (const [k, c] of [...actionCount.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`${c.toString().padStart(7)}  ${pct(c, ownedTicks).padStart(7)}  ${k}`);
}
console.log('');
console.log('--- pressure population ---');
console.log(`pressured (<=4.2 m): ${pressuredTicks} (${pct(pressuredTicks, ownedTicks)} of owned)`);
console.log(`tight     (<=2.1 m): ${tightTicks} (${pct(tightTicks, ownedTicks)} of owned)`);
console.log('');
console.log('--- tackle eligibility & exposure geometry (owned ticks) ---');
console.log(`tackle-eligible ticks (opp within 1.15 m of ball): ${tackleEligibleTicks} (${pct(tackleEligibleTicks, ownedTicks)})`);
console.log(`  ball-offset-side (exposed): ${exposedTicks} (${pct(exposedTicks, tackleEligibleTicks)} of eligible)`);
console.log(`  far-side (protected):       ${farsideTicks} (${pct(farsideTicks, tackleEligibleTicks)} of eligible)`);
console.log('');
console.log('--- turn episodes (sweep >= 90 deg while owned) ---');
console.log(`total episodes: ${totalEpisodes} over ${MATCHES} matches = ${(totalEpisodes / MATCHES).toFixed(2)}/match`);
console.log(`episodes/match: p10 ${quantile(episodesPerMatch, 0.1).toFixed(1)} p50 ${quantile(episodesPerMatch, 0.5).toFixed(1)} p90 ${quantile(episodesPerMatch, 0.9).toFixed(1)}`);
console.log(`duration ticks: p10 ${quantile(episodeDurations, 0.1).toFixed(1)} p50 ${quantile(episodeDurations, 0.5).toFixed(1)} p90 ${quantile(episodeDurations, 0.9).toFixed(1)} (DT=${DT.toFixed(4)}s)`);
console.log(`duration secs:  p50 ${(quantile(episodeDurations, 0.5) * DT).toFixed(3)}s p90 ${(quantile(episodeDurations, 0.9) * DT).toFixed(3)}s`);
console.log(`episodes with tackle-eligible tick DURING:      ${episodesTackleDuring} (${pct(episodesTackleDuring, totalEpisodes)})`);
console.log(`episodes with tackle-eligible tick in 0.5s AFTER: ${episodesTackleAfter} (${pct(episodesTackleAfter, totalEpisodes)})`);
