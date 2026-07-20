/**
 * ⚠️  THROWAWAY POC — NOT PART OF THE SUITE. Delete after the clone/replay
 * decision is recorded. Do NOT import from here; do NOT wire into CI.
 *
 * Question: can a FROZEN mid-match `Match` be STRUCTURALLY DEEP-CLONED so that
 * the clone continues BYTE-IDENTICALLY to the original (option A), instead of
 * replaying from the seed to tick T per branch (option B)? This is the
 * substrate the counterfactual-value probe (PROBE-CONTRACTS §8) needs.
 *
 * Method:
 *   1. Build a match, step to tick T (several T, several seeds).
 *   2. Deep-clone the live Match with a generic, FIELD-AGNOSTIC cloner that
 *      preserves (a) class prototypes → methods/getters, (b) shared refs &
 *      cycles (ball.owner ↔ the same Player in teams[]), (c) Set/Map.
 *   3. Step ORIGINAL and CLONE K steps in lockstep; assert a full dynamic-state
 *      snapshot + the RNG's internal `s` stay identical at every step.
 *   4. Negative control: perturb the clone's RNG by ONE increment and confirm
 *      it DIVERGES (proves the assertion isn't vacuous).
 *   5. Time replay-to-T (option B's per-branch cost) vs clone (option A's).
 *
 *   npx tsx scripts/probes/_poc-clone.ts
 */
import { Match, type MatchConfig } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Player } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const config = (seed: number): MatchConfig => ({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  duration: 240,
});

/**
 * Generic prototype-preserving, cycle-safe deep clone. Knows NOTHING about the
 * sim's fields — so a field added to Match/Player/Team/Ball tomorrow is cloned
 * automatically (the fragility that dooms a hand-written serializer). It only
 * special-cases the container kinds JSON can't do: Set, Map, and shared/cyclic
 * object refs. Methods & getters live on the prototype, which is SHARED (never
 * copied) via Object.create — so the clone is a real `Match` instance.
 */
function deepCloneSim<T>(root: T): T {
  const seen = new Map<unknown, unknown>();
  const clone = (v: unknown): unknown => {
    // primitives AND functions (typeof fn !== 'object') pass through by ref;
    // functions only ever live on prototypes here, never as own data props.
    if (v === null || typeof v !== 'object') return v;
    const hit = seen.get(v);
    if (hit !== undefined) return hit;

    if (Array.isArray(v)) {
      const out: unknown[] = [];
      seen.set(v, out);
      for (let i = 0; i < v.length; i++) out[i] = clone(v[i]);
      return out;
    }
    if (v instanceof Set) {
      const out = new Set();
      seen.set(v, out);
      for (const e of v) out.add(clone(e));
      return out;
    }
    if (v instanceof Map) {
      const out = new Map();
      seen.set(v, out);
      for (const [k, val] of v) out.set(clone(k), clone(val));
      return out;
    }
    // Plain object OR class instance: keep the SAME prototype (methods/getters).
    const out = Object.create(Object.getPrototypeOf(v));
    seen.set(v, out);
    for (const key of Reflect.ownKeys(v)) {
      const desc = Object.getOwnPropertyDescriptor(v, key)!;
      if ('value' in desc) (out as Record<PropertyKey, unknown>)[key] = clone(desc.value);
      else Object.defineProperty(out, key, desc); // own accessor (none expected)
    }
    return out;
  };
  return clone(root) as T;
}

/** Full dynamic-state fingerprint. Player refs → gid; Set/Map → sorted arrays;
 *  the RNG's private `s` is read via runtime access (TS `private` is erased). */
function snapshot(m: Match): string {
  const gid = (p: Player | null): number => (p ? p.gid : -1);
  return JSON.stringify({
    simTime: m.simTime,
    phase: m.phase,
    half: m.half,
    score: m.score,
    finished: m.finished,
    possessionSide: m.possessionSide,
    rngS: (m.rng as unknown as { s: number }).s,
    stepCount: (m as unknown as { stepCount: number }).stepCount,
    events: m.events.length,
    lastEvent: m.events.at(-1)?.text ?? null,
    ball: {
      x: m.ball.pos.x, y: m.ball.pos.y,
      vx: m.ball.vel.x, vy: m.ball.vel.y,
      z: m.ball.z, vz: m.ball.vz, spin: m.ball.spin,
      owner: gid(m.ball.owner), last: gid(m.ball.lastTouch),
    },
    players: m.allPlayers.map((p) => ({
      gid: p.gid, x: p.pos.x, y: p.pos.y, vx: p.vel.x, vy: p.vel.y,
      hx: p.heading.x, hy: p.heading.y, stamina: p.stamina,
      action: p.action.type, tIdx: p.action.targetIdx ?? null,
      dt: p.decisionTimer, kc: p.kickCooldown, tc: p.tackleCooldown,
      st: p.stunTimer, gh: p.gkHoldTimer, tt: p.touchTimer,
      sentOff: p.sentOff, booked: p.booked, injured: p.injured ?? null,
    })),
    teams: m.teams.map((t) => ({
      goals: t.stats.goals, poss: t.stats.possessionTime, shots: t.stats.shots,
      chasers: [...t.chasers].sort((a, b) => a - b),
      marks: [...t.marks.entries()].sort((a, b) => a[0] - b[0]),
      runners: [...t.runners].sort((a, b) => a - b),
      mode: t.mode, brainTimer: t.brainTimer, keeperUp: t.keeperUp,
    })),
  });
}

// ---- the test -----------------------------------------------------------
const SEEDS = [1, 7, 42, 101, 2024];
const T_VALUES = [1200, 4000, 6500, 7250, 9000]; // incl. either side of the 7200-step half-time
const K = 240; // 4s continuation

let cases = 0;
let passes = 0;
const failures: string[] = [];
let replayNsTotal = 0;
let replayCount = 0;
let cloneNsTotal = 0;
let cloneCount = 0;

for (const seed of SEEDS) {
  for (const T of T_VALUES) {
    cases++;
    // Replay to T (this IS option B's per-branch cost — timed).
    const m = new Match(config(seed));
    const t0 = process.hrtime.bigint();
    for (let i = 0; i < T && !m.finished; i++) m.step(DT);
    replayNsTotal += Number(process.hrtime.bigint() - t0);
    replayCount++;
    if (m.finished) continue; // match ended before T (short seeds) — skip

    // Clone the frozen state (option A's per-branch cost — timed).
    const c0 = process.hrtime.bigint();
    const clone = deepCloneSim(m);
    cloneNsTotal += Number(process.hrtime.bigint() - c0);
    cloneCount++;

    // Independence: cloned instance, cloned RNG, no shared mutable refs.
    if (clone === m) { failures.push(`seed ${seed} T ${T}: clone === original`); continue; }
    if (clone.rng === m.rng) { failures.push(`seed ${seed} T ${T}: shared rng`); continue; }
    if (clone.ball === m.ball) { failures.push(`seed ${seed} T ${T}: shared ball`); continue; }
    if (!(clone instanceof Match)) { failures.push(`seed ${seed} T ${T}: clone not a Match`); continue; }
    // ball.owner must remap INTO the clone's player graph, not the original's.
    if (m.ball.owner && clone.ball.owner === m.ball.owner) {
      failures.push(`seed ${seed} T ${T}: ball.owner not remapped`); continue;
    }
    if (m.ball.owner && clone.ball.owner !== clone.allPlayers[m.ball.owner.gid]) {
      failures.push(`seed ${seed} T ${T}: ball.owner points outside clone graph`); continue;
    }
    if (snapshot(clone) !== snapshot(m)) {
      failures.push(`seed ${seed} T ${T}: snapshot differs at clone time`); continue;
    }

    // Step both K frames in lockstep — the real test.
    let ok = true;
    for (let i = 0; i < K; i++) {
      m.step(DT);
      clone.step(DT);
      if (snapshot(m) !== snapshot(clone)) {
        failures.push(`seed ${seed} T ${T}: DIVERGED at continuation step ${i + 1}`);
        ok = false;
        break;
      }
    }
    if (ok) passes++;
  }
}

// ---- long-horizon: clone at T, run BOTH to full time, compare result ----
// The 4s window above is the probe's actual branch length; this proves the
// clone is a perfect continuation over the ENTIRE match remainder too.
let fullOk = true;
for (const seed of [7, 2024]) {
  const m = new Match(config(seed));
  for (let i = 0; i < 5000 && !m.finished; i++) m.step(DT);
  if (m.finished) continue;
  const clone = deepCloneSim(m);
  const rm = m.runToCompletion();
  const rc = clone.runToCompletion();
  if (JSON.stringify(rm) !== JSON.stringify(rc)) {
    fullOk = false;
    failures.push(`seed ${seed}: full-remainder result differs after clone`);
  }
}

// ---- negative control: prove the assertion can FAIL ---------------------
let negControlOk = false;
{
  const m = new Match(config(1));
  for (let i = 0; i < 4000; i++) m.step(DT);
  const clone = deepCloneSim(m);
  (clone.rng as unknown as { s: number }).s = ((clone.rng as unknown as { s: number }).s + 1) >>> 0;
  let diverged = false;
  for (let i = 0; i < K; i++) {
    m.step(DT);
    clone.step(DT);
    if (snapshot(m) !== snapshot(clone)) { diverged = true; break; }
  }
  negControlOk = diverged; // a 1-step RNG nudge MUST diverge within K steps
}

// ---- report -------------------------------------------------------------
const replayUsPerStep = replayNsTotal / replayCount / 1000 / (T_VALUES.reduce((a, b) => a + b, 0) / T_VALUES.length);
const avgReplayMs = replayNsTotal / replayCount / 1e6;
const avgCloneUs = cloneNsTotal / cloneCount / 1000;

console.log('\n=== THROWAWAY POC: mid-match deep-clone continuation ===');
console.log(`cases run      : ${cases} (${SEEDS.length} seeds × ${T_VALUES.length} freeze ticks)`);
console.log(`clone continues: ${passes}/${passes + failures.length} identical for ${K} steps`);
console.log(`full-remainder result identical (clone → full time): ${fullOk ? 'YES ✓' : 'NO ✗'}`);
console.log(`negative control (1-bit RNG nudge diverges): ${negControlOk ? 'DIVERGED ✓' : 'DID NOT DIVERGE ✗'}`);
console.log('--- cost ---');
console.log(`replay-to-T (option B/branch): ${avgReplayMs.toFixed(2)} ms avg  (~${replayUsPerStep.toFixed(2)} µs/step)`);
console.log(`deep-clone  (option A/branch): ${avgCloneUs.toFixed(1)} µs avg`);
console.log(`clone speedup vs mid-match replay: ~${(avgReplayMs * 1000 / avgCloneUs).toFixed(0)}×`);
if (failures.length) {
  console.log('\nFAILURES:');
  for (const f of failures.slice(0, 20)) console.log('  - ' + f);
}
const verdict = failures.length === 0 && negControlOk && fullOk && passes > 0;
console.log(`\nRESULT: ${verdict ? 'PASS — structural clone reproduces a byte-identical continuation.' : 'FAIL — see failures above.'}`);
process.exit(verdict ? 0 : 1);
