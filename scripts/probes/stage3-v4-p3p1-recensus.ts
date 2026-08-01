// STAGE III V4-P3p-1 — THE TARGETED RE-CENSUS (extended S-bit keys)
//
// Authority: docs/world-model/STAGE3-V4-P3P1-RECENSUS.md (the FROZEN
// pre-registration; ratified by rulings #112 / #113). This probe is the V3-P1
// role census (scripts/probes/stage3-v3-p1-role-census.ts) REUSED VERBATIM —
// the 18-candidate lattice, the control + fork-and-force structure, W = 3.0 s,
// the two-face signed outcome, the V3-P0 sampling loop, the exception classes
// X1–X7 with the derived X6 floor, the permutation-null SPREAD primary, the PC /
// gradient / SAT arms, `publish-not-pool`, X-DET — with ONE amendment (§2.2):
// at each sampled IN-SCOPE moment the re-census pulls the forced body's OWN
// percept snapshot and computes the two P3p-0 S bits (`widthHeld`, `beyondLine`)
// from it, extending the cell key by one bit under the DISJOINT-SCOPE 9/9 rule
// (§2.3). The affected families are re-priced and MERGED into the committed v3
// table under the AUGMENT rule (§4): the v3 base cells copied byte-identical,
// the in-power bit-children grafted on. Nothing ships (Road B): every EDS flag is
// dormant in production, `stationEye` null, the `eye.v4` flags absent, and the
// production fingerprint 57b0bdab…c673 is unchanged throughout.
//
// TWO MODES (explicit `V4P3P1_MODE`, NO default):
//   SMOKE  — 40 matches @ 10,400,000 + k, floor 8 (engine-exercise only; the knee
//            and the census both use the REAL child floor 150). Publishes per
//            extended-child moment rates, the #105 attainability knee (95% of
//            plateau, 50-step grid, N_max 1200), the §5 `widthHeld` genuine-0
//            PROXY metrics + the frozen proxy DECISION, and the §6 EPS re-assert.
//   CENSUS — V4P3P1_N matches @ 10,500,000 + k, floor 150. Reads the frozen
//            keying pin (proxy vs strict) + N* gate, runs the merge (§4), emits
//            the merged table + X-MERGE-IDENT (both parts). Detached (#49.5).
//
// Stats seeds: bootstrap 99403, permutation 99503 (EXPLICIT — decoupled from the
// V3-P1 `+1` derivation, a seeds-only change, §8).
//
// Gates (all HARD, §9.1): X-FORK-IDENT (clone 100% + X5 control identity + X6
// force fidelity), clone coverage, X-DET (double byte-identical), X-SRC-ZERO,
// X-MERGE-IDENT (base re-hash + three-way partition), X-EPS-REASSERT (source-text
// tripwire), X-FP-PROD (production fingerprint unchanged), seed disjointness.
//
// COMMAND LINES:
//   smoke:  V4P3P1_MODE=smoke npx tsx scripts/probes/stage3-v4-p3p1-recensus.ts
//   census: V4P3P1_MODE=census V4P3P1_N=<knee> V4P3P1_KEYING=<proxy|strict> \
//           npx tsx scripts/probes/stage3-v4-p3p1-recensus.ts
//   (census keying may instead be read from the committed smoke JSON's
//    `proxyDecision`; V4P3P1_KEYING wins if set. No silent default either way.)
//
// ⚠ BUILD NOTE (#113.2(iii)): `match.perceivedSnapshot(body)` is NOT
// side-effect-free in the census world — `edsEagerPerception` defaults OFF, so
// the pull calls `reconstructBodyMemory`, which MUTATES the body's perception
// memory. To keep the base match `m` byte-identical to V3-P1 (§3: the sampling
// rotation/spacing/counts and the X4/X5/X6 fork identities must not move) AND to
// make the fork-identity comparison symmetric, the read is taken on a THROWAWAY
// CLONE of `m` (byte-identical at the tick, so the bits are identical), and the
// clone is discarded. `m` and the fork clone are never touched by the read.
import { createHash } from 'node:crypto';
import { writeFileSync, appendFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import {
  widthHeldBit, perceivedOffsideLine, beyondLineBit,
  OFFSIDE_EPS, WIDTH_STALE_TICKS, type BitValue,
} from '../../src/ai/eyeContextBitsV4';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// =============================================================================
// MODE + frozen parameters
// =============================================================================
const MODE = process.env.V4P3P1_MODE;               // 'smoke' | 'census'; validated in main()
const IS_CENSUS = MODE === 'census';

/** §2.1: P1R §2.3 verbatim. */
const W_S = 3.0;
const W_TICKS = Math.round(W_S / DT);
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const MOMENT_SPACING_S = 2.0;
const WARMUP_TICKS = 15;
const MATCH_DURATION = 240;

/** §8: fresh seed bands, disjoint above the 10.3M V4-P2b high-water. */
const SEED_START = IS_CENSUS ? 10_500_000 : 10_400_000;
/** §7: smoke = 40 (env-overridable for the bounded preflight only, labelled);
 *  census = V4P3P1_N (the #105 knee, REQUIRED — no default, validated in main). */
const MATCH_CAP = IS_CENSUS ? envInt('V4P3P1_N', -1) : envInt('V4P3P1_SMOKE_MATCHES', 40);

const BOOTSTRAP_RESAMPLES = 2000;                   // #20
const PERM_B = 2000;                                // §4.1 permutations
/** §8: EXPLICIT stats seeds (permutation DECOUPLED from the V3-P1 +1 derivation). */
const BOOTSTRAP_SEED = 99403;
const PERM_SEED = 99503;

/** §2.1 inherited (context × role) floor — 150 for the census; env-overridable to 8
 *  in the smoke ONLY to exercise the inherited spread/permutation engine (§7.1). */
const CELL_FLOOR = envInt('V3P1_FLOOR', IS_CENSUS ? 150 : 8);
/** §4.2 / §7.1: the CHILD floor is ALWAYS 150 (the knee and the census both use it). */
const CHILD_FLOOR = 150;

const BH_Q = 0.05;
const ARRIVE_M = 2;
const SAT_BAND = 0.05;
const X6_EPS = 1e-9;
const X6_FLOOR_REF = 0.84;
const RECEIPT_CAP = 1000;

/** §7.3: match-count attainability-knee sizing. */
const N_MAX = 1200;
const KNEE_GRID_STEPS = 50;
const KNEE_PLATEAU_FRAC = 0.95;

/** X-FP-PROD: the frozen shipped-world production fingerprint (P3a/P0b verbatim). */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/** The committed V3-P1 role table — the merge base (§4); its `.table` re-hashes to
 *  `tableSha`. Env-overridable for the bounded preflight's toy fixture ONLY. */
const V3_TABLE_IN = process.env.V4P3P1_V3TABLE
  ?? 'docs/world-model/data/stage3-v3-p1-role-census-table.json';
const V3_TABLE_SHA_EXPECTED =
  '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';

/** §6: the sim's offside machinery — read as SOURCE TEXT for the EPS tripwire.
 *  Env-overridable for the tripwire SELF-TEST against a /tmp copy ONLY. */
const MECHANICS_SRC = process.env.V4P3P1_MECHANICS ?? 'src/sim/mechanics.ts';

const SMOKE_OUT = process.env.V4P3P1_SMOKE_OUT
  ?? 'docs/world-model/data/stage3-v4-p3p1-sizing-smoke.json';
const RECENSUS_OUT = process.env.V4P3P1_RECENSUS_OUT
  ?? 'docs/world-model/data/stage3-v4-p3p1-recensus.json';
const MERGED_OUT = process.env.V4P3P1_MERGED_OUT
  ?? 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
/** the pin source the census reads the frozen keying from when V4P3P1_KEYING is unset. */
const SMOKE_IN = process.env.V4P3P1_SMOKE_IN ?? SMOKE_OUT;
const SKIP_FP = process.env.V4P3P1_SKIP_FP === '1'; // bounded-preflight only, labelled

/** §6/#67.3 ENRICHED census world — the SAME CENSUS_FLAGS the v3 table was censused on. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- axes, lattice, contexts (V3-P1 verbatim) --------------------------------
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];
const roleIndex = (r: Role): number => ROLE_AXIS.indexOf(r);

const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
interface Candidate { readonly id: string; readonly dx: number; readonly dy: number }
const LATTICE: Candidate[] = [];
for (const r of RADII) {
  for (const a of ANGLES) {
    const rad = (a * Math.PI) / 180;
    LATTICE.push({
      id: `r${r}a${a}`,
      dx: Number((r * Math.cos(rad)).toFixed(9)),
      dy: Number((r * Math.sin(rad)).toFixed(9)),
    });
  }
}
const N_CAND = LATTICE.length;
const PC_ID = 'r21a180';
const CONTROL_ID = 'control';

type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const contextKey = (f: Face, t: Threat, d: Density): string => `${f}|${t}|${d}`;
const FACES: readonly Face[] = ['ours', 'theirs'];
const THREATS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const DENSITIES: readonly Density[] = ['sparse', 'crowded'];
const CONTEXTS: string[] = [];
for (const f of FACES) for (const t of THREATS) for (const d of DENSITIES) CONTEXTS.push(contextKey(f, t, d));
const contextIndex = (c: string): number => CONTEXTS.indexOf(c);
const cellKey = (ctx: string, role: Role): string => `${ctx}||${role}`;
const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

// --- §3 SCOPE: the affected families (face='ours' × threat∈{middle,theirThird}) --
const AFFECTED_THREATS = new Set<Threat>(['middle', 'theirThird']);
const isAffectedContext = (face: Face, threat: Threat): boolean =>
  face === 'ours' && AFFECTED_THREATS.has(threat);
/** §2.3 tie-break: forward candidates (dx>0) → OFFSIDE; behind/level (dx≤0) → DELIVERY. */
const isForward = (c: Candidate): boolean => c.dx > 0;
const DELIVERY_CANDS = LATTICE.filter((c) => !isForward(c)); // dx ≤ 0 → widthHeld (9)
const OFFSIDE_CANDS = LATTICE.filter((c) => isForward(c));   // dx > 0 → beyondLine (9)
const AFFECTED_CONTEXTS = CONTEXTS.filter((ctx) => {
  const [f, t] = ctx.split('|') as [Face, Threat];
  return isAffectedContext(f, t);
});

const PUBLISHED_UNDERPOWERED: readonly string[] = [
  'ours|theirThird|crowded||DF',
  'theirs|theirThird|crowded||DF',
  'theirs|ownThird|sparse||DF',
];
const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});

// --- helpers (V3-P1 verbatim) ------------------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
const median = (xs: readonly number[]): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);
const percentile = (sorted: readonly number[], q: number): number => (
  sorted.length === 0 ? Number.NaN
    : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]
);

interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  const arr = book[cls] ?? (book[cls] = []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

interface Exceptions {
  ePaused: number; eCarrier: number; eBallWon: number; eSentOff: number;
  eOnside: number; eBarred: number; eEnded: number; ok: number;
  unexplained: number; reconstructionDiverged: number;
}
const newExceptions = (): Exceptions => ({
  ePaused: 0, eCarrier: 0, eBallWon: 0, eSentOff: 0,
  eOnside: 0, eBarred: 0, eEnded: 0, ok: 0, unexplained: 0, reconstructionDiverged: 0,
});

interface ForkOutcome {
  readonly score: boolean; readonly concede: boolean;
  readonly goalFor: boolean; readonly goalAgainst: boolean;
  readonly eta: number; readonly targetError: number; readonly occupancy: number;
  readonly ended: boolean; readonly signature: string;
}

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// --- runFork / runSaturated (V3-P1 §2 verbatim) ------------------------------
const runFork = (
  before: Match, gid: number, side: number, cand: Candidate | null, x6: Exceptions,
  seed: number, decisionTick: number, receipts: ReceiptBook | null,
): ForkOutcome => {
  const fork = cloneSimulationState(before);
  const body = fork.allPlayers.find((p) => p.gid === gid)!;
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const shots0 = mine.stats.shots;
  const conceded0 = theirs.stats.shots;
  const goals0 = mine.stats.goals;
  const against0 = theirs.stats.goals;
  const startTick = fork.simTick;
  const untilTick = startTick + W_TICKS;

  let score = false;
  let goalFor = false;
  let eta = Number.NaN;
  let insideTicks = 0;
  let errSum = 0;
  let errTicks = 0;
  let ended = false;

  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    const live = cand !== null && fork.simTick + 1 < untilTick;
    let want: { x: number; y: number } | null = null;
    if (live) {
      fork.forcedStationPolicy = { gid, offset: { dx: cand!.dx, dy: cand!.dy }, untilTick };
      want = {
        x: fork.ball.pos.x + mine.attackDir * cand!.dx,
        y: fork.ball.pos.y + cand!.dy,
      };
    } else fork.forcedStationPolicy = null;
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;
    const rBefore = fork.restart;
    const barredBefore = (rBefore?.kind === 'goalKick' && rBefore.side !== side)
      || theirs.goalkeeper.gkHoldTimer > 0 || theirs.goalkeeper.gkDistributing;
    const onsideBefore = ownerBefore !== null && ownerBefore.side === side
      && ownerBefore !== body;

    fork.step(DT);

    if (live) {
      const cause = cand!.id;
      const tr = body.c4Trace;
      if (pausedBefore || fork.phase !== 'playing') {
        x6.ePaused += 1;
        if (receipts) addReceipt(receipts, 'ePaused', seed, decisionTick, gid, cause);
      } else if (body.sentOff) {
        x6.eSentOff += 1;
        if (receipts) addReceipt(receipts, 'eSentOff', seed, decisionTick, gid, cause);
      } else if (ownerBefore === body || fork.ball.owner === body) {
        x6.eCarrier += 1;
        if (receipts) addReceipt(receipts, 'eCarrier', seed, decisionTick, gid, cause);
      } else if (tr === null) {
        if (fork.ball.owner !== null && fork.ball.owner.side !== side) {
          x6.eBallWon += 1;
          if (receipts) addReceipt(receipts, 'eBallWon', seed, decisionTick, gid, cause);
        } else {
          x6.unexplained += 1;
          if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${cause}:noTrace`);
        }
      } else if (
        Math.abs(tr.applied.x - tr.meet.x) <= X6_EPS && Math.abs(tr.applied.y - tr.meet.y) <= X6_EPS
      ) {
        x6.ok += 1;
        if (Math.abs(tr.meet.x - want!.x) > X6_EPS || Math.abs(tr.meet.y - want!.y) > X6_EPS) {
          x6.reconstructionDiverged += 1;
        }
        const d = Math.hypot(body.pos.x - tr.meet.x, body.pos.y - tr.meet.y);
        errSum += d;
        errTicks += 1;
        if (d <= ARRIVE_M) {
          insideTicks += 1;
          if (!Number.isFinite(eta)) eta = (fork.simTick - startTick) * DT;
        }
      } else if (barredBefore) {
        x6.eBarred += 1;
        if (receipts) addReceipt(receipts, 'eBarred', seed, decisionTick, gid, cause);
      } else if (onsideBefore) {
        x6.eOnside += 1;
        if (receipts) addReceipt(receipts, 'eOnside', seed, decisionTick, gid, cause);
      } else {
        x6.unexplained += 1;
        if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${cause}:clampMiss`);
      }
    }

    if (fork.simTick - startTick === H_SCORE_TICKS) {
      score = mine.stats.shots > shots0;
      goalFor = mine.stats.goals > goals0;
    }
    if (fork.finished) ended = true;
  }
  fork.forcedStationPolicy = null;
  if (fork.simTick - startTick < H_SCORE_TICKS) {
    score = mine.stats.shots > shots0;
    goalFor = mine.stats.goals > goals0;
  }
  if (ended) {
    x6.eEnded += 1;
    if (receipts && cand !== null) addReceipt(receipts, 'eEnded', seed, decisionTick, gid, cand.id);
  }

  return {
    score,
    concede: theirs.stats.shots > conceded0,
    goalFor,
    goalAgainst: theirs.stats.goals > against0,
    eta: Number.isFinite(eta) ? eta : W_S,
    targetError: errTicks === 0 ? Number.NaN : errSum / errTicks,
    occupancy: cand === null ? Number.NaN : insideTicks / W_TICKS,
    ended,
    signature: signatureOf(fork),
  };
};

const runSaturated = (
  before: Match, side: number, cand: Candidate,
): { score: boolean; concede: boolean } => {
  const fork = cloneSimulationState(before);
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const shots0 = mine.stats.shots;
  const conceded0 = theirs.stats.shots;
  const startTick = fork.simTick;
  const untilTick = startTick + W_TICKS;
  const bodies = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff).map((p) => p.gid);
  let score = false;
  let cursor = 0;
  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    if (fork.simTick + 1 < untilTick && bodies.length > 0) {
      const gid = bodies[cursor % bodies.length];
      cursor += 1;
      fork.forcedStationPolicy = { gid, offset: { dx: cand.dx, dy: cand.dy }, untilTick };
    } else fork.forcedStationPolicy = null;
    fork.step(DT);
    if (fork.simTick - startTick === H_SCORE_TICKS) score = mine.stats.shots > shots0;
  }
  fork.forcedStationPolicy = null;
  if (fork.simTick - startTick < H_SCORE_TICKS) score = mine.stats.shots > shots0;
  return { score, concede: theirs.stats.shots > conceded0 };
};

// =============================================================================
// §2.2 THE AMENDMENT — the pre-clone percept read + the two S bits
// =============================================================================
/**
 * The forced body's OWN percept snapshot at the decision tick + the two P3p-0
 * bits. Taken on a THROWAWAY CLONE of `m` (byte-identical at the tick) so the
 * base match and its fork clone are never mutated (#113.2(iii); `perceivedSnapshot`
 * mutates the body's perception memory in the census world — edsEagerPerception
 * OFF). `mine` is `m.teams[side]`, the observer-team fold V3-P1 already uses;
 * `localX` is a pure geometric fold, identical on `m` and the clone.
 */
interface PerceptBits {
  widthHeld: BitValue;         // MOMENT property (shared by all delivery candidates)
  perceivedLine: number | null;
  ballLocalX: number;
  attackObsCount: number;      // diagnostic: # fresh attacking-half own outfielders seen (§5(B))
  attackTeammates: { ageTicks: number; absY: number }[]; // §5 age/lateral hists (smoke only)
}
const readPerceptBits = (m: Match, body: Match['allPlayers'][number], side: number, collectHist: boolean): PerceptBits => {
  const mine = m.teams[side];
  const localXOf = (x: number): number => mine.localX(x);
  const ballLocalX = mine.localX(m.ball.pos.x);
  const percClone = cloneSimulationState(m);       // isolate any perceivedSnapshot side effect
  const snap = percClone.perceivedSnapshot(body);  // only body.gid is read; percClone owns the memory
  const widthHeld = widthHeldBit(snap, body.gid, side as Side, localXOf);
  const perceivedLine = perceivedOffsideLine(snap, side as Side, localXOf);

  // §5(B) diagnostic: mirror widthHeldBit's own-side attacking-half fresh scan and
  // COUNT it (the module returns only the bit). Same filter, line for line.
  let attackObsCount = 0;
  const attackTeammates: { ageTicks: number; absY: number }[] = [];
  if (snap !== null) {
    for (const q of snap.players) {
      if (q.side !== side) continue;
      if (q.gid === body.gid) continue;
      if (q.gid % TEAM_SIZE === 0) continue;        // non-GK (as widthHeldBit excludes the keeper)
      if (localXOf(q.pos.x) < 0) continue;          // attacking half (own-team-local x ≥ 0)
      // §5 hists: the age/|y| distribution over own attacking-half teammates, ALL ages,
      // so the 30-tick and WIDE_EDGE pins are visible (smoke only).
      if (collectHist) attackTeammates.push({ ageTicks: q.ageTicks, absY: Math.abs(q.pos.y) });
      if (q.ageTicks > WIDTH_STALE_TICKS) continue; // FRESH only — the widthHeldBit count
      attackObsCount += 1;
    }
  }
  return { widthHeld, perceivedLine, ballLocalX, attackObsCount, attackTeammates };
};

/** §2.3 offside bit per candidate (dx>0), from the moment's perceived line + ballLocalX. */
const beyondForCandidate = (perceivedLine: number | null, ballLocalX: number, dx: number): BitValue =>
  beyondLineBit(perceivedLine, ballLocalX, dx);

// --- the census unit -----------------------------------------------------------
interface MomentRow {
  readonly cluster: number;
  readonly context: string;
  readonly role: Role;
  readonly face: Face;
  readonly outcomes: Record<string, ForkOutcome>;
  // §2.2 amendment (present only for in-scope moments):
  readonly inScope: boolean;
  readonly widthHeld?: BitValue;
  readonly perceivedLine?: number | null;
  readonly ballLocalX?: number;
  readonly attackObsCount?: number;
}

interface CensusOut {
  rows: MomentRow[];
  moments: number;
  matchesRun: number;
  qualifying: number;
  ballDirectedSkipped: number;
  noPool: number;
  clonesTaken: number;
  inScopeMoments: number;
  x5Checked: number;
  x5Mismatched: number;
  x6: Exceptions;
  receipts: ReceiptBook;
  ageSamples: number[];        // §5 hist (smoke): perceived ageTicks of attacking-half teammates
  lateralSamples: number[];    // §5 hist (smoke): |y| of the same
}

const runCensus = (withReceipts: boolean, collectHist: boolean): CensusOut => {
  const out: CensusOut = {
    rows: [], moments: 0, matchesRun: 0, qualifying: 0, ballDirectedSkipped: 0, noPool: 0,
    clonesTaken: 0, inScopeMoments: 0, x5Checked: 0, x5Mismatched: 0,
    x6: newExceptions(), receipts: {}, ageSamples: [], lateralSamples: [],
  };
  const receipts = withReceipts ? out.receipts : null;
  let rotation = 0;

  for (let k = 0; k < MATCH_CAP; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    out.matchesRun += 1;
    let lastMomentTime = -Infinity;
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      out.qualifying += 1;
      lastMomentTime = m.simTime;

      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { out.noPool += 1; m.step(DT); continue; }
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      if (!STATION_FAMILY.has(body.action.type)) { out.ballDirectedSkipped += 1; m.step(DT); continue; }

      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
      }
      const face: Face = side === owner!.side ? 'ours' : 'theirs';
      const threat = localXBand(mine.localX(m.ball.pos.x));
      const context = contextKey(face, threat, near >= 2 ? 'crowded' : 'sparse');
      const role = body.role as Role;

      // §2.2 amendment: the PRE-CLONE percept read (in-scope moments only, §2.2/§3).
      const inScope = isAffectedContext(face, threat);
      let bits: PerceptBits | null = null;
      if (inScope) {
        bits = readPerceptBits(m, body, side, collectHist);
        out.inScopeMoments += 1;
        if (collectHist) {
          for (const t of bits.attackTeammates) {
            out.ageSamples.push(t.ageTicks);
            out.lateralSamples.push(t.absY);
          }
        }
      }

      const clone = cloneSimulationState(m);
      out.clonesTaken += 1;
      const decisionTick = m.simTick;
      out.moments += 1;

      const outcomes: Record<string, ForkOutcome> = {};
      const control = runFork(clone, body.gid, side, null, out.x6, seed, decisionTick, receipts);
      outcomes[CONTROL_ID] = control;
      for (const cand of LATTICE) {
        outcomes[cand.id] = runFork(clone, body.gid, side, cand, out.x6, seed, decisionTick, receipts);
      }

      if (out.moments % 25 === 0) {
        const plain = cloneSimulationState(clone);
        for (let i = 0; i < H_CONCEDE_TICKS && !plain.finished; i++) plain.step(DT);
        out.x5Checked += 1;
        if (signatureOf(plain) !== control.signature) out.x5Mismatched += 1;
      }

      out.rows.push({
        cluster: seed, context, role, face, outcomes, inScope,
        widthHeld: bits?.widthHeld, perceivedLine: bits?.perceivedLine,
        ballLocalX: bits?.ballLocalX, attackObsCount: bits?.attackObsCount,
      });
      if (process.env.V4P3P1_PROG && out.moments % 20 === 0) {
        appendFileSync(process.env.V4P3P1_PROG,
          `[prog] match ${k} moment ${out.moments} inScope ${out.inScopeMoments} t=${((Date.now() - (globalThis as any).__t0) / 1000).toFixed(1)}s\n`);
      }
      m.step(DT);
    }
  }
  return out;
};

// --- inherited stats (V3-P1 verbatim; permutation uses the EXPLICIT PERM_SEED) -
interface TableCell {
  n: number; score: number; concede: number; value: number;
  goalFor: number; goalAgainst: number;
  eta: number; targetError: number; occupancy: number;
  momentN: number; underPowered: boolean;
}
const cellFrom = (os: ForkOutcome[], momentN: number): TableCell => ({
  n: os.length,
  score: round(mean(os.map((o) => (o.score ? 1 : 0)))),
  concede: round(mean(os.map((o) => (o.concede ? 1 : 0)))),
  value: round(mean(os.map(signed))),
  goalFor: round(mean(os.map((o) => (o.goalFor ? 1 : 0)))),
  goalAgainst: round(mean(os.map((o) => (o.goalAgainst ? 1 : 0)))),
  eta: round(mean(os.map((o) => o.eta).filter(Number.isFinite)), 4),
  targetError: round(mean(os.map((o) => o.targetError).filter(Number.isFinite)), 4),
  occupancy: round(mean(os.map((o) => o.occupancy).filter(Number.isFinite)), 4),
  momentN,
  underPowered: momentN < CHILD_FLOOR,
});

const pairedCI = (
  rows: readonly MomentRow[], id: string, offset: number,
): { n: number; point: number; lower: number; upper: number } => {
  const usable = rows.filter((r) => r.outcomes[id] !== undefined
    && !r.outcomes[id].ended && !r.outcomes[CONTROL_ID].ended);
  const byCluster = new Map<number, MomentRow[]>();
  for (const r of usable) {
    const b = byCluster.get(r.cluster) ?? [];
    b.push(r);
    byCluster.set(r.cluster, b);
  }
  const clusters = [...byCluster.values()];
  const diff = (rs: readonly MomentRow[]) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => signed(r.outcomes[id]) - signed(r.outcomes[CONTROL_ID]))));
  const point = diff(usable);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentRow[] = [];
    for (let i = 0; i < clusters.length; i++) {
      for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    }
    const v = diff(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return { n: usable.length, point: round(point), lower: round(percentile(draws, 0.025)), upper: round(percentile(draws, 0.975)) };
};

interface PairwiseStat { diff: number; lower: number; upper: number }
interface SpreadCell {
  context: string; cand: string; computable: boolean; inPowerRoles: Role[];
  nByRole: Record<string, number>; valueByRole: Record<string, number>;
  S: number; argMaxRole: string; argMinRole: string;
  permGE: number; permP: number; perm97_5: number;
  resolved: boolean; resolvedBH: boolean; ciLower: number; ciUpper: number;
  pairwise: Record<string, PairwiseStat>;
}
const flat = (ctxI: number, roleI: number, candI: number): number => (ctxI * ROLE_AXIS.length + roleI) * N_CAND + candI;
const FLAT_LEN = CONTEXTS.length * ROLE_AXIS.length * N_CAND;

const computePrimary = (rows: readonly MomentRow[]) => {
  const clusterIds = [...new Set(rows.map((r) => r.cluster))].sort((a, b) => a - b);
  const clusterOf = new Map(clusterIds.map((c, i) => [c, i]));
  const C = clusterIds.length;
  const M = rows.length;

  const momCtx = new Int8Array(M);
  const momRole = new Int8Array(M);
  const momCluster = new Int32Array(M);
  const momSigned = new Float64Array(M * N_CAND);
  const momValid = new Uint8Array(M * N_CAND);

  const clusterSum: Float64Array[] = Array.from({ length: C }, () => new Float64Array(FLAT_LEN));
  const clusterCnt: Float64Array[] = Array.from({ length: C }, () => new Float64Array(FLAT_LEN));
  const momentCount = new Int32Array(CONTEXTS.length * ROLE_AXIS.length);

  for (let i = 0; i < M; i++) {
    const r = rows[i];
    const ctxI = contextIndex(r.context);
    const roleI = roleIndex(r.role);
    const cj = clusterOf.get(r.cluster)!;
    momCtx[i] = ctxI; momRole[i] = roleI; momCluster[i] = cj;
    momentCount[ctxI * ROLE_AXIS.length + roleI] += 1;
    for (let ci = 0; ci < N_CAND; ci++) {
      const o = r.outcomes[LATTICE[ci].id];
      const valid = o !== undefined && !o.ended;
      const v = valid ? signed(o) : 0;
      momSigned[i * N_CAND + ci] = v;
      momValid[i * N_CAND + ci] = valid ? 1 : 0;
      if (valid) {
        const f = flat(ctxI, roleI, ci);
        clusterSum[cj][f] += v;
        clusterCnt[cj][f] += 1;
      }
    }
  }

  const inPowerRoleIdx: number[][] = CONTEXTS.map((_, ctxI) =>
    ROLE_AXIS.map((_r, roleI) => roleI).filter((roleI) => momentCount[ctxI * ROLE_AXIS.length + roleI] >= CELL_FLOOR));

  const fullSum = new Float64Array(FLAT_LEN);
  const fullCnt = new Float64Array(FLAT_LEN);
  for (let cj = 0; cj < C; cj++) {
    const s = clusterSum[cj]; const n = clusterCnt[cj];
    for (let f = 0; f < FLAT_LEN; f++) { fullSum[f] += s[f]; fullCnt[f] += n[f]; }
  }
  const valueAt = (sum: Float64Array, cnt: Float64Array, ctxI: number, roleI: number, ci: number): number => {
    const f = flat(ctxI, roleI, ci);
    return cnt[f] > 0 ? sum[f] / cnt[f] : Number.NaN;
  };
  const spreadAt = (sum: Float64Array, cnt: Float64Array, ctxI: number, ci: number): number => {
    let lo = Number.POSITIVE_INFINITY; let hi = Number.NEGATIVE_INFINITY; let k = 0;
    for (const roleI of inPowerRoleIdx[ctxI]) {
      const v = valueAt(sum, cnt, ctxI, roleI, ci);
      if (Number.isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; k += 1; }
    }
    return k >= 2 ? hi - lo : Number.NaN;
  };

  interface CellRef { ctxI: number; ci: number; context: string; cand: string; roles: number[] }
  const computableCells: CellRef[] = [];
  for (let ctxI = 0; ctxI < CONTEXTS.length; ctxI++) {
    const roles = inPowerRoleIdx[ctxI];
    if (roles.length < 2) continue;
    for (let ci = 0; ci < N_CAND; ci++) {
      computableCells.push({ ctxI, ci, context: CONTEXTS[ctxI], cand: LATTICE[ci].id, roles });
    }
  }
  const nComputable = computableCells.length;
  const Sobs = computableCells.map((c) => spreadAt(fullSum, fullCnt, c.ctxI, c.ci));

  const blockMap = new Map<number, number[]>();
  for (let i = 0; i < M; i++) {
    const key = momCluster[i] * CONTEXTS.length + momCtx[i];
    const b = blockMap.get(key) ?? [];
    b.push(i);
    blockMap.set(key, b);
  }
  const blocks = [...blockMap.entries()].sort((a, b) => a[0] - b[0]).map(([, idxs]) => idxs);

  const permGE = new Int32Array(nComputable);
  const permDistns: number[][] = computableCells.map(() => []);
  const permRole = new Int8Array(M);
  const pSum = new Float64Array(FLAT_LEN);
  const pCnt = new Float64Array(FLAT_LEN);
  const permRng = new Rng(PERM_SEED);                   // §8: EXPLICIT permutation seed 99503
  for (let b = 0; b < PERM_B; b++) {
    for (const block of blocks) {
      const roles = block.map((idx) => momRole[idx]);
      for (let j = roles.length - 1; j > 0; j--) {
        const t = permRng.int(0, j);
        const tmp = roles[j]; roles[j] = roles[t]; roles[t] = tmp;
      }
      for (let j = 0; j < block.length; j++) permRole[block[j]] = roles[j];
    }
    pSum.fill(0); pCnt.fill(0);
    for (let i = 0; i < M; i++) {
      const base = i * N_CAND;
      const ctxI = momCtx[i];
      const roleP = permRole[i];
      const off = (ctxI * ROLE_AXIS.length + roleP) * N_CAND;
      for (let ci = 0; ci < N_CAND; ci++) {
        if (momValid[base + ci]) { pSum[off + ci] += momSigned[base + ci]; pCnt[off + ci] += 1; }
      }
    }
    for (let e = 0; e < nComputable; e++) {
      const c = computableCells[e];
      const s = spreadAt(pSum, pCnt, c.ctxI, c.ci);
      permDistns[e].push(s);
      if (Number.isFinite(s) && Number.isFinite(Sobs[e]) && s >= Sobs[e]) permGE[e] += 1;
    }
  }

  const SdrawSorted: number[][] = computableCells.map(() => []);
  const pairKeys: string[][] = computableCells.map((c) =>
    c.roles.flatMap((ri, a) => c.roles.slice(a + 1).map((rj) => `${ROLE_AXIS[ri]}|${ROLE_AXIS[rj]}`)));
  const pairDraws: number[][][] = computableCells.map((c) => {
    const nPairs = (c.roles.length * (c.roles.length - 1)) / 2;
    return Array.from({ length: nPairs }, () => [] as number[]);
  });
  const bSum = new Float64Array(FLAT_LEN);
  const bCnt = new Float64Array(FLAT_LEN);
  const bootRng = new Rng(BOOTSTRAP_SEED + 2);
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    bSum.fill(0); bCnt.fill(0);
    for (let i = 0; i < C; i++) {
      const cj = bootRng.int(0, C - 1);
      const s = clusterSum[cj]; const n = clusterCnt[cj];
      for (let f = 0; f < FLAT_LEN; f++) { bSum[f] += s[f]; bCnt[f] += n[f]; }
    }
    for (let e = 0; e < nComputable; e++) {
      const c = computableCells[e];
      const s = spreadAt(bSum, bCnt, c.ctxI, c.ci);
      if (Number.isFinite(s)) SdrawSorted[e].push(s);
      let pIdx = 0;
      for (let a = 0; a < c.roles.length; a++) {
        const va = valueAt(bSum, bCnt, c.ctxI, c.roles[a], c.ci);
        for (let bb = a + 1; bb < c.roles.length; bb++) {
          const vb = valueAt(bSum, bCnt, c.ctxI, c.roles[bb], c.ci);
          const diff = va - vb;
          if (Number.isFinite(diff)) pairDraws[e][pIdx].push(diff);
          pIdx += 1;
        }
      }
    }
  }

  const cells: SpreadCell[] = [];
  const permPs: { e: number; p: number }[] = [];
  for (let e = 0; e < nComputable; e++) {
    const c = computableCells[e];
    const p = permGE[e] / PERM_B;
    permPs.push({ e, p });
    const distn = [...permDistns[e]].filter(Number.isFinite).sort((a, b) => a - b);
    const draws = [...SdrawSorted[e]].sort((a, b) => a - b);
    const valueByRole: Record<string, number> = {};
    const nByRole: Record<string, number> = {};
    let lo = Number.POSITIVE_INFINITY; let hi = Number.NEGATIVE_INFINITY;
    let argMin = ''; let argMax = '';
    for (const roleI of c.roles) {
      const f = flat(c.ctxI, roleI, c.ci);
      const v = fullCnt[f] > 0 ? fullSum[f] / fullCnt[f] : Number.NaN;
      valueByRole[ROLE_AXIS[roleI]] = round(v);
      nByRole[ROLE_AXIS[roleI]] = fullCnt[f];
      if (Number.isFinite(v)) {
        if (v < lo) { lo = v; argMin = ROLE_AXIS[roleI]; }
        if (v > hi) { hi = v; argMax = ROLE_AXIS[roleI]; }
      }
    }
    const pairwise: Record<string, PairwiseStat> = {};
    let pIdx = 0;
    for (let a = 0; a < c.roles.length; a++) {
      const fa = flat(c.ctxI, c.roles[a], c.ci);
      const va = fullCnt[fa] > 0 ? fullSum[fa] / fullCnt[fa] : Number.NaN;
      for (let bb = a + 1; bb < c.roles.length; bb++) {
        const fb = flat(c.ctxI, c.roles[bb], c.ci);
        const vb = fullCnt[fb] > 0 ? fullSum[fb] / fullCnt[fb] : Number.NaN;
        const key = pairKeys[e][pIdx];
        const sortedPair = [...pairDraws[e][pIdx]].sort((x, y) => x - y);
        pairwise[key] = {
          diff: round(va - vb),
          lower: round(percentile(sortedPair, 0.025)),
          upper: round(percentile(sortedPair, 0.975)),
        };
        pIdx += 1;
      }
    }
    cells.push({
      context: c.context, cand: c.cand, computable: true,
      inPowerRoles: c.roles.map((ri) => ROLE_AXIS[ri]),
      nByRole, valueByRole,
      S: round(Sobs[e]), argMaxRole: argMax, argMinRole: argMin,
      permGE: permGE[e], permP: round(p, 6), perm97_5: round(percentile(distn, 0.975)),
      resolved: p < 0.025, resolvedBH: false,
      ciLower: round(percentile(draws, 0.025)), ciUpper: round(percentile(draws, 0.975)),
      pairwise,
    });
  }

  const sortedByP = [...permPs].sort((a, b) => a.p - b.p);
  let kStar = -1;
  for (let rank = 0; rank < sortedByP.length; rank++) {
    if (sortedByP[rank].p <= ((rank + 1) / nComputable) * BH_Q) kStar = rank;
  }
  let bhResolved = 0;
  if (kStar >= 0) {
    const pThresh = sortedByP[kStar].p;
    for (const cell of cells) if (cell.permP <= pThresh) { cell.resolvedBH = true; bhResolved += 1; }
  }
  const rawResolved = cells.filter((c) => c.resolved).length;
  const nullExpectation = round(0.025 * nComputable, 3);
  const perContextResolved = Object.fromEntries(CONTEXTS.map((ctx) => {
    const cs = cells.filter((c) => c.context === ctx);
    return [ctx, {
      computable: cs.length,
      inPowerRoles: inPowerRoleIdx[contextIndex(ctx)].map((ri) => ROLE_AXIS[ri]),
      resolvedRaw: cs.filter((c) => c.resolved).length,
      resolvedBH: cs.filter((c) => c.resolvedBH).length,
    }];
  }));

  return {
    note: 'PRIMARY = role SPREAD S per (context,candidate); separation test = within-(match×context) '
      + 'role-label permutation null (B=' + PERM_B + ', seed ' + PERM_SEED + ', p<0.025, BH q=' + BH_Q
      + '); bootstrap CIs on S are REPORTED-only (never the test, house law #80.2).',
    computableCells: nComputable, permB: PERM_B, bhQ: BH_Q,
    rawResolved, bhResolved, nullFalsePositiveExpectation: nullExpectation,
    perContextResolved, cells,
  };
};

// --- SAT arm (V3-P1 verbatim) ------------------------------------------------
const runSatPass = (contexts: readonly string[], ids: readonly string[]) => {
  const byCandidate: Record<string, { uni: number[]; sat: number[] }> = {};
  for (const id of ids) byCandidate[id] = { uni: [], sat: [] };
  let moments = 0;
  let rotation = 0;
  const scratch = newExceptions();
  for (let k = 0; k < MATCH_CAP; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      lastMomentTime = m.simTime;
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { m.step(DT); continue; }
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      if (!STATION_FAMILY.has(body.action.type)) { m.step(DT); continue; }
      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
      }
      const face: Face = side === owner!.side ? 'ours' : 'theirs';
      const context = contextKey(face, localXBand(mine.localX(m.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');
      const decisionTick = m.simTick;
      moments += 1;
      if (contexts.includes(context)) {
        const clone = cloneSimulationState(m);
        for (const id of ids) {
          const cand = LATTICE.find((c) => c.id === id)!;
          byCandidate[id].uni.push(signed(runFork(clone, body.gid, side, cand, scratch, seed, decisionTick, null)));
          const s2 = runSaturated(clone, side, cand);
          byCandidate[id].sat.push((s2.score ? 1 : 0) - (s2.concede ? 1 : 0));
        }
      }
      m.step(DT);
    }
  }
  const perCandidate = Object.fromEntries(ids.map((id) => {
    const u = mean(byCandidate[id].uni);
    const v = mean(byCandidate[id].sat);
    return [id, { n: byCandidate[id].uni.length, unilateral: round(u), saturated: round(v), gap: round(v - u) }];
  }));
  return { moments, perCandidate };
};

// =============================================================================
// §5 THE widthHeld GENUINE-0 PROXY DECISION RULE
// =============================================================================
interface ProxyInputs { p0_proxy: number; obsMedian: number; }
/** adopt PROXY iff p0_proxy ∈ [0.50, 0.95] AND obs-count median ≥ 2 (§5). */
const decideProxy = ({ p0_proxy, obsMedian }: ProxyInputs): 'proxy' | 'strict' =>
  (Number.isFinite(p0_proxy) && p0_proxy >= 0.50 && p0_proxy <= 0.95 && obsMedian >= 2)
    ? 'proxy' : 'strict';

const computeProxyMetrics = (rows: readonly MomentRow[]) => {
  // §5 population: in-scope delivery moments in in-power (context × role) cells.
  const momentCounts: Record<string, number> = {};
  for (const r of rows) if (r.inScope) momentCounts[cellKey(r.context, r.role)] = (momentCounts[cellKey(r.context, r.role)] ?? 0) + 1;
  const inPower = new Set(Object.entries(momentCounts).filter(([, n]) => n >= CELL_FLOOR).map(([k]) => k));
  const scoped = rows.filter((r) => r.inScope && inPower.has(cellKey(r.context, r.role)));
  const n = scoped.length;
  let n1 = 0; let n0 = 0; let nUnk = 0;
  const obs0: number[] = [];
  for (const r of scoped) {
    if (r.widthHeld === 1) n1 += 1;
    else if (r.widthHeld === 0) { n0 += 1; obs0.push(r.attackObsCount ?? 0); }
    else nUnk += 1;
  }
  const width1_share = n === 0 ? Number.NaN : n1 / n;
  const p0_proxy = n === 0 ? Number.NaN : n0 / n;
  const unknown_share = n === 0 ? Number.NaN : nUnk / n;
  const p0_obsCount_median = median(obs0);
  const decision = decideProxy({ p0_proxy, obsMedian: p0_obsCount_median });
  // STRICT recast: 0 → UNKNOWN, only the 1-arm splits out.
  const strict_recast = {
    width1_share: round(width1_share, 6),
    p0_proxy: 0,
    unknown_share: n === 0 ? Number.NaN : round((nUnk + n0) / n, 6),
  };
  return {
    population: 'in-scope delivery moments (face=ours × threat∈{middle,theirThird}) in in-power (context×role)',
    n, n1, n0, nUnk,
    width1_share: round(width1_share, 6),
    p0_proxy: round(p0_proxy, 6),
    unknown_share: round(unknown_share, 6),
    p0_obsCount_median,
    strict_recast,
    decision,
    band: { p0Lo: 0.50, p0Hi: 0.95, obsMin: 2 },
    ruleFired: true,
  };
};

// =============================================================================
// §4 THE BIT-CHILDREN + X-MERGE-IDENT
// =============================================================================
type Keying = 'proxy' | 'strict';
const BIT_KEY = (b: BitValue): '0' | '1' | 'UNKNOWN' => (b === 0 ? '0' : b === 1 ? '1' : 'UNKNOWN');

interface ChildRecord {
  family: 'delivery' | 'offside';
  context: string; role: Role; cand: string; bit: '0' | '1';
  momentN: number;              // # in-scope moments with this bit (the #24 floor quantity)
  cell: TableCell;              // priced over this bit's non-ended forks
  ci: { n: number; point: number; lower: number; upper: number };
  roleInPower: boolean;         // (context × role) momentN ≥ CELL_FLOOR
  childInPower: boolean;        // momentN ≥ CHILD_FLOOR (150)
}
interface PartitionCheck {
  context: string; role: Role; cand: string; family: 'delivery' | 'offside';
  momentPartitionOk: boolean;   // n0 + n1 + nUNK == reCensusBase.momentN
  forkPartitionOk: boolean;     // forkN and signed-sum decompose exactly
  n0: number; n1: number; nUnk: number; baseMomentN: number;
}

/** cluster bootstrap CI on a child's mean signed value (§4.2, the pairedCI form). */
const childValueCI = (samples: { cluster: number; v: number }[], offset: number) => {
  const byCluster = new Map<number, number[]>();
  for (const s of samples) {
    const arr = byCluster.get(s.cluster);
    if (arr) arr.push(s.v); else byCluster.set(s.cluster, [s.v]);
  }
  const clusters = [...byCluster.values()];
  const point = mean(samples.map((s) => s.v));
  const rng = new Rng(BOOTSTRAP_SEED + 1000 + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let sum = 0; let cnt = 0;
    for (let i = 0; i < clusters.length; i++) {
      const c = clusters[rng.int(0, clusters.length - 1)];
      for (const v of c) { sum += v; cnt += 1; }
    }
    if (cnt > 0) draws.push(sum / cnt);
  }
  draws.sort((a, b) => a - b);
  return { n: samples.length, point: round(point), lower: round(percentile(draws, 0.025)), upper: round(percentile(draws, 0.975)) };
};

/**
 * §4.2/§4.3: build the bit-children + the three-way {0,1,UNKNOWN} partition check
 * for each affected (context × role × candidate), on the re-census's OWN moments.
 */
const buildBitChildren = (rows: readonly MomentRow[], keying: Keying) => {
  const children: ChildRecord[] = [];
  const partitions: PartitionCheck[] = [];
  let ciOffset = 0;

  // (context × role) moment counts over in-scope moments (= all moments of an
  // affected context, since the context IS the scope).
  const ctxRoleMoments: Record<string, MomentRow[]> = {};
  for (const r of rows) {
    if (!r.inScope) continue;
    const key = cellKey(r.context, r.role);
    (ctxRoleMoments[key] ?? (ctxRoleMoments[key] = [])).push(r);
  }

  const emit = (
    family: 'delivery' | 'offside', context: string, role: Role, cand: Candidate,
    bitOf: (r: MomentRow) => BitValue, moments: MomentRow[],
  ): void => {
    const baseMomentN = moments.length;
    const roleInPower = baseMomentN >= CELL_FLOOR;
    const buckets: Record<'0' | '1' | 'UNKNOWN', { cluster: number; o: ForkOutcome }[]> = {
      '0': [], '1': [], UNKNOWN: [],
    };
    const momentByBit: Record<'0' | '1' | 'UNKNOWN', number> = { '0': 0, '1': 0, UNKNOWN: 0 };
    // independent re-census base pool for this candidate (X-MERGE-IDENT part ii).
    const baseForks: ForkOutcome[] = [];
    for (const r of moments) {
      let b = bitOf(r);
      if (keying === 'strict' && family === 'delivery' && b === 0) b = 'UNKNOWN'; // §5 strict remap
      const key = BIT_KEY(b);
      momentByBit[key] += 1;
      const o = r.outcomes[cand.id];
      if (o !== undefined && !o.ended) {
        buckets[key].push({ cluster: r.cluster, o });
        baseForks.push(o);
      }
    }
    // three-way partition checks (against the re-census's OWN base, §4.3(ii)).
    const momentPartitionOk =
      momentByBit['0'] + momentByBit['1'] + momentByBit.UNKNOWN === baseMomentN;
    const forkN = buckets['0'].length + buckets['1'].length + buckets.UNKNOWN.length;
    const sumBit = (k: '0' | '1' | 'UNKNOWN') => buckets[k].reduce((s, x) => s + signed(x.o), 0);
    const forkPartitionOk =
      forkN === baseForks.length
      && sumBit('0') + sumBit('1') + sumBit('UNKNOWN') === baseForks.reduce((s, o) => s + signed(o), 0);
    partitions.push({
      context, role, cand: cand.id, family,
      momentPartitionOk, forkPartitionOk,
      n0: momentByBit['0'], n1: momentByBit['1'], nUnk: momentByBit.UNKNOWN, baseMomentN,
    });
    // the two bit-children (UNKNOWN never becomes a child; it maps to the base).
    for (const bit of ['0', '1'] as const) {
      const os = buckets[bit].map((x) => x.o);
      const momentN = momentByBit[bit];
      if (momentN === 0 && os.length === 0) continue; // never observed → no child at all
      const cell = cellFrom(os, momentN);
      const ci = childValueCI(buckets[bit].map((x) => ({ cluster: x.cluster, v: signed(x.o) })), ciOffset++);
      children.push({
        family, context, role, cand: cand.id, bit,
        momentN, cell, ci,
        roleInPower, childInPower: momentN >= CHILD_FLOOR,
      });
    }
  };

  for (const context of AFFECTED_CONTEXTS) {
    for (const role of ROLE_AXIS) {
      const moments = ctxRoleMoments[cellKey(context, role)] ?? [];
      if (moments.length === 0) continue;
      for (const cand of DELIVERY_CANDS) {
        emit('delivery', context, role, cand, (r) => (r.widthHeld ?? 'UNKNOWN'), moments);
      }
      for (const cand of OFFSIDE_CANDS) {
        emit('offside', context, role, cand,
          (r) => beyondForCandidate(r.perceivedLine ?? null, r.ballLocalX ?? 0, cand.dx), moments);
      }
    }
  }
  return { children, partitions };
};

/** load the committed v3 table's `.table` sub-object (the merge base) + verify its SHA. */
const loadV3Base = (path: string): { table: unknown; observedSha: string; expectedSha: string; pass: boolean } => {
  const j = JSON.parse(readFileSync(path, 'utf8')) as { table: unknown; tableSha?: string };
  const observedSha = createHash('sha256').update(JSON.stringify(j.table)).digest('hex');
  const expectedSha = j.tableSha ?? V3_TABLE_SHA_EXPECTED;
  return { table: j.table, observedSha, expectedSha, pass: observedSha === expectedSha };
};

// =============================================================================
// §6 X-EPS-REASSERT — the source-text tripwire on offsideAtKick
// =============================================================================
/** fail-closed extraction of the offside epsilon literal `return tx > line + <n>;`. */
const extractOffsideEps = (path: string): { ok: boolean; eps: number | null; reason: string } => {
  let src: string;
  try { src = readFileSync(path, 'utf8'); } catch { return { ok: false, eps: null, reason: 'unreadable' }; }
  const fn = src.match(/function\s+offsideAtKick\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/);
  if (!fn) return { ok: false, eps: null, reason: 'anchor-missing: offsideAtKick body' };
  const lit = fn[1].match(/return\s+tx\s*>\s*line\s*\+\s*(-?\d+(?:\.\d+)?)\s*;/);
  if (!lit) return { ok: false, eps: null, reason: 'anchor-missing: `return tx > line + <n>;`' };
  const eps = Number(lit[1]);
  if (!Number.isFinite(eps)) return { ok: false, eps: null, reason: 'non-numeric literal' };
  return { ok: eps === OFFSIDE_EPS, eps, reason: eps === OFFSIDE_EPS ? 'match' : `mismatch: sim ${eps} ≠ mirror ${OFFSIDE_EPS}` };
};

// =============================================================================
// §7 THE #105 ATTAINABILITY-KNEE (match count)
// =============================================================================
interface KneeChild { key: string; momentN: number; rate: number; nChild: number }
const computeKnee = (childMomentN: { key: string; momentN: number }[], matches: number) => {
  const attainable: KneeChild[] = childMomentN.map((c) => {
    const rate = matches > 0 ? c.momentN / matches : 0;
    return { key: c.key, momentN: c.momentN, rate: round(rate, 6), nChild: rate > 0 ? Math.ceil(CHILD_FLOOR / rate) : Infinity };
  });
  const plateau = attainable.filter((c) => c.rate > 0).length;
  const step = N_MAX / KNEE_GRID_STEPS;
  const grid: { N: number; count: number }[] = [];
  for (let g = 1; g <= KNEE_GRID_STEPS; g++) {
    const N = Math.round(step * g);
    const count = attainable.filter((c) => N >= c.nChild).length;
    grid.push({ N, count });
  }
  const target = KNEE_PLATEAU_FRAC * plateau;
  const hit = grid.find((p) => p.count >= target);
  const nStar = hit ? hit.N : null;             // null ⇒ knee beyond N_max ⇒ STOP (§7.3)
  return {
    nMax: N_MAX, gridStep: step, gridSteps: KNEE_GRID_STEPS, plateauFrac: KNEE_PLATEAU_FRAC,
    plateau, target: round(target, 3), nStar, exceedsNMax: nStar === null,
    grid, perChild: attainable.map((c) => ({ ...c, nChild: Number.isFinite(c.nChild) ? c.nChild : null })),
  };
};

// =============================================================================
// summarise (V3-P1 inherited byproduct) + gate assembly
// =============================================================================
const summarise = (c: CensusOut) => {
  const rows = c.rows;

  const momentCounts: Record<string, number> = {};
  for (const ctx of CONTEXTS) for (const role of ROLE_AXIS) momentCounts[cellKey(ctx, role)] = 0;
  for (const r of rows) momentCounts[cellKey(r.context, r.role)] += 1;
  const inPowerCells = Object.entries(momentCounts).filter(([, n]) => n >= CELL_FLOOR).map(([k]) => k);
  const underPoweredCells = Object.entries(momentCounts).filter(([, n]) => n < CELL_FLOOR).map(([k]) => k);
  const publishedMatch = underPoweredCells.length === PUBLISHED_UNDERPOWERED.length
    && PUBLISHED_UNDERPOWERED.every((k) => underPoweredCells.includes(k));

  const table: Record<string, Record<string, Record<string, TableCell>>> = {};
  for (const ctx of CONTEXTS) {
    const ctxRows = rows.filter((r) => r.context === ctx);
    table[ctx] = {};
    for (const role of ROLE_AXIS) {
      const rrRows = ctxRows.filter((r) => r.role === role);
      const momentN = rrRows.length;
      table[ctx][role] = {};
      for (const cand of LATTICE) {
        const os: ForkOutcome[] = [];
        for (const r of rrRows) {
          const o = r.outcomes[cand.id];
          if (o === undefined || o.ended) continue;
          os.push(o);
        }
        table[ctx][role][cand.id] = cellFrom(os, momentN);
      }
    }
  }

  const primary = computePrimary(rows);

  const pcAll = pairedCI(rows, PC_ID, 1);
  const pcByFace = Object.fromEntries(FACES.map((f, i) => [
    f, pairedCI(rows.filter((r) => r.face === f), PC_ID, 10 + i),
  ]));
  const pcByRole = Object.fromEntries(ROLE_AXIS.map((role, i) => [
    role, pairedCI(rows.filter((r) => r.role === role), PC_ID, 20 + i),
  ]));
  const pcResolves = Object.values(pcByFace).every((c2) => (
    Number.isFinite(c2.upper) ? c2.upper < 0 : true
  )) && Number.isFinite(pcAll.upper) && pcAll.upper < 0;

  const pooledByCandidate = Object.fromEntries(LATTICE.map((cand, i) => [
    cand.id, pairedCI(rows, cand.id, 100 + i),
  ]));

  const bestContexts = [...CONTEXTS]
    .sort((a, b) => rows.filter((r) => r.context === b).length - rows.filter((r) => r.context === a).length)
    .slice(0, 4);
  const nearestByFace = Object.fromEntries(FACES.map((f) => {
    const faceRows = rows.filter((r) => r.face === f);
    const ctrl = mean(faceRows.map((r) => signed(r.outcomes[CONTROL_ID])));
    return [f, [...LATTICE]
      .map((cand) => ({ id: cand.id, gap: Math.abs(mean(faceRows.map((r) => signed(r.outcomes[cand.id]))) - ctrl) }))
      .sort((a, b) => a.gap - b.gap).slice(0, 3).map((x) => x.id)];
  })) as Record<Face, string[]>;
  const satIds = [...new Set([...nearestByFace.ours, ...nearestByFace.theirs])];
  const sat = runSatPass(bestContexts, satIds);
  const satAgrees = Object.values(sat.perCandidate).every((v) => (
    !Number.isFinite((v as { gap: number }).gap) || Math.abs((v as { gap: number }).gap) <= SAT_BAND
  ));

  const x6 = c.x6;
  const okDenom = x6.ok + x6.eOnside + x6.eBarred + x6.unexplained;
  const okFraction = okDenom === 0 ? Number.NaN : x6.ok / okDenom;
  const clampShare = okDenom === 0 ? Number.NaN : (x6.eOnside + x6.eBarred) / okDenom;
  const x6FloorDerived = round(1 - 2 * clampShare, 6);
  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.unexplained;

  const cellCount = CONTEXTS.length * ROLE_AXIS.length * LATTICE.length;
  const underPoweredPairs = underPoweredCells.length * LATTICE.length;

  // X-FORK-IDENT (V3-P1 form): clone 100% + X5 control identity + X6 force fidelity.
  const xForkIdent = c.clonesTaken === c.moments && c.moments > 0
    && c.x5Checked > 0 && c.x5Mismatched === 0
    && x6Total > 0 && x6.unexplained === 0
    && (Number.isFinite(okFraction) && Number.isFinite(x6FloorDerived) ? okFraction >= x6FloorDerived : true);

  return {
    parameters: {
      mode: MODE, seedStart: SEED_START, matchCap: MATCH_CAP,
      block: `${SEED_START}..${SEED_START + MATCH_CAP - 1}`,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, wTicks: W_TICKS,
      hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      hScoreTicks: H_SCORE_TICKS, hConcedeTicks: H_CONCEDE_TICKS, warmupTicks: WARMUP_TICKS,
      roleAxis: ROLE_AXIS, lattice: LATTICE.map((cand) => cand.id), positiveControl: PC_ID,
      contexts: CONTEXTS, cellFloor: CELL_FLOOR, childFloor: CHILD_FLOOR,
      affectedContexts: AFFECTED_CONTEXTS,
      deliveryCands: DELIVERY_CANDS.map((c2) => c2.id), offsideCands: OFFSIDE_CANDS.map((c2) => c2.id),
      bootstrapResamples: BOOTSTRAP_RESAMPLES, permutations: PERM_B,
      bootstrapSeed: BOOTSTRAP_SEED, permutationSeed: PERM_SEED,
      cellKey: '(context × TRUE role × candidate × S-bit) — the P3p-1 extension',
      samplingLoop: 'STAGE3-V3-P0 verbatim (unchanged by the amendment; §3)',
    },
    coverage: {
      matchesRun: c.matchesRun, moments: c.moments, qualifying: c.qualifying,
      inScopeMoments: c.inScopeMoments,
      clonesTaken: c.clonesTaken, cloneCoverage: c.moments === 0 ? Number.NaN : round(c.clonesTaken / c.moments),
      forks: c.moments * (LATTICE.length + 1),
      ballDirectedSkipped: c.ballDirectedSkipped, noPool: c.noPool,
      x5Checked: c.x5Checked, x5Mismatched: c.x5Mismatched,
      cellCount, underPoweredPairs,
      inPowerCellCount: inPowerCells.length, underPoweredCellCount: underPoweredCells.length,
      underPoweredCells,
      publishedUnderPowered: PUBLISHED_UNDERPOWERED,
      publishedUnderPoweredMatch: publishedMatch,
      publishedUnderPoweredNote: 'inherited V3-P1 check — meaningful only on the 9.11M block; not a P3p-1 gate',
      momentCounts,
      contextCounts: Object.fromEntries(CONTEXTS.map((ctx) => [ctx, rows.filter((r) => r.context === ctx).length])),
      roleCounts: Object.fromEntries(ROLE_AXIS.map((role) => [role, rows.filter((r) => r.role === role).length])),
    },
    x6: {
      ...x6, total: x6Total,
      okFraction: round(okFraction, 6), clampShare: round(clampShare, 6),
      floorDerived: x6FloorDerived, floorReference: X6_FLOOR_REF,
    },
    positiveControl: { id: PC_ID, pooled: pcAll, byFace: pcByFace, byRole: pcByRole, resolves: pcResolves },
    gradient: { pooledByCandidate },
    saturation: {
      contexts: bestContexts, nearestByFace, tested: satIds,
      moments: sat.moments, perCandidate: sat.perCandidate,
      band: SAT_BAND, agrees: satAgrees,
      tableStatus: satAgrees ? 'SHIPPING TABLE' : 'DESIGN-CALIBRATION ONLY',
    },
    primary,
    table,
    forkIdentity: {
      xForkIdent,
      cloneCoverage: c.clonesTaken === c.moments && c.moments > 0,
      x5ControlIdentity: c.x5Checked > 0 && c.x5Mismatched === 0,
      x6ForceFidelity: x6Total > 0 && x6.unexplained === 0,
      pcPositiveControl: pcResolves,
    },
  };
};

// =============================================================================
// X-FP-PROD + seed disjointness (run-level)
// =============================================================================
const productionFingerprint = (): { fingerprint: string; pass: boolean } => {
  if (SKIP_FP) return { fingerprint: 'SKIPPED(V4P3P1_SKIP_FP=1; bounded-preflight only)', pass: true };
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  return { fingerprint, pass: fingerprint === FINGERPRINT_BASELINE };
};

/** §8/§9.1: bands disjoint above the 10.3M high-water; stats seeds outside the used set. */
const seedDisjointness = () => {
  const HIGH_WATER = 10_300_000;
  const smokeOk = 10_400_000 >= HIGH_WATER;
  const censusOk = 10_500_000 >= HIGH_WATER;
  const bandOk = SEED_START >= HIGH_WATER;
  const statsOk = BOOTSTRAP_SEED > 99_000 && PERM_SEED > 99_000 && (BOOTSTRAP_SEED as number) !== (PERM_SEED as number);
  return { pass: smokeOk && censusOk && bandOk && statsOk, highWater: HIGH_WATER, bandOk, statsOk, bootstrapSeed: BOOTSTRAP_SEED, permutationSeed: PERM_SEED };
};

const resolveKeying = (): { keying: Keying; source: string } => {
  const env = process.env.V4P3P1_KEYING;
  if (env === 'proxy' || env === 'strict') return { keying: env, source: 'env V4P3P1_KEYING' };
  if (env !== undefined) throw new Error(`V4P3P1_KEYING must be 'proxy' or 'strict', got '${env}'`);
  // else read the frozen pin from the committed smoke JSON (no silent default).
  try {
    const smoke = JSON.parse(readFileSync(SMOKE_IN, 'utf8')) as { proxy?: { decision?: string } };
    const d = smoke.proxy?.decision;
    if (d === 'proxy' || d === 'strict') return { keying: d, source: `smoke pin ${SMOKE_IN}` };
  } catch { /* fall through to the hard stop */ }
  throw new Error(
    `census keying pin unresolved: set V4P3P1_KEYING=proxy|strict OR provide the smoke JSON at ${SMOKE_IN} (no silent default, §5)`,
  );
};

// =============================================================================
// main
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);

function runSmoke(): void {
  (globalThis as any).__t0 = Date.now();
  const first = runCensus(true, true);
  const firstSummary = summarise(first);
  const second = runCensus(false, true);
  const secondSummary = summarise(second);
  const deterministic = canonical(firstSummary) === canonical(secondSummary);

  const proxy = computeProxyMetrics(first.rows);
  const { children, partitions } = buildBitChildren(first.rows, proxy.decision);

  // §7 knee over EVERY affected extended child (rate > 0 ⇒ attainable).
  const kneeInput = children.map((ch) => ({ key: `${ch.family}|${ch.context}|${ch.role}|${ch.cand}|b${ch.bit}`, momentN: ch.momentN }));
  const knee = computeKnee(kneeInput, MATCH_CAP);

  const eps = extractOffsideEps(MECHANICS_SRC);
  const fp = productionFingerprint();
  const disjoint = seedDisjointness();

  const partitionOk = partitions.every((p) => p.momentPartitionOk && p.forkPartitionOk);
  const ageHist = histogram(first.ageSamples, [0, 5, 10, 15, 20, 25, 30, 45, 60, 90]);
  const lateralHist = histogram(first.lateralSamples, [0, 4, 8, 9.8, 12, 16, 20, 28]);

  const gates = {
    xForkIdent: firstSummary.forkIdentity.xForkIdent,
    cloneCoverage: firstSummary.forkIdentity.cloneCoverage,
    xDet: deterministic,
    xEpsReassert: eps.ok,
    xFpProd: fp.pass,
    xMergePartition: partitionOk,   // part (ii); part (i) is census-only (needs the merge write)
    seedDisjoint: disjoint.pass,
  };
  const verdict = Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL';

  const output = {
    experiment: 'STAGE3-V4-P3p-1 SIZING SMOKE (bit keying + proxy decision + knee)',
    authority: 'STAGE3-V4-P3P1-RECENSUS · rulings #112/#113',
    mode: 'smoke',
    world: 'ENRICHED (CENSUS_FLAGS; #67.3)',
    flags: CENSUS_FLAGS,
    ...firstSummary,
    proxy: {
      ...proxy,
      ageHist, lateralHist,
      pinConfirm: {
        widthStaleTicks: WIDTH_STALE_TICKS,
        note: 'age hist confirms the 30-tick freshness pin; |y| hist confirms the WIDE_EDGE pin (≈9.8 m)',
      },
    },
    bitChildren: {
      count: children.length,
      byFamily: {
        delivery: children.filter((c) => c.family === 'delivery').length,
        offside: children.filter((c) => c.family === 'offside').length,
      },
      children, partitions, partitionOk,
    },
    knee,
    epsReassert: { ...eps, source: MECHANICS_SRC, mirror: OFFSIDE_EPS },
    fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
    seedDisjointness: disjoint,
    receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(first.receipts).map(([k, v]) => [k, v.length])) },
    gates, deterministic, verdict,
  };
  const sha256 = createHash('sha256').update(canonical({ ...output, sha256: undefined })).digest('hex');
  writeFileSync(SMOKE_OUT, `${JSON.stringify({ ...output, sha256 }, null, 2)}\n`);

  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  console.error(
    `STAGE3-V4-P3p-1 SMOKE ${verdict}`
    + ` · matches ${output.coverage.matchesRun} moments ${output.coverage.moments} inScope ${output.coverage.inScopeMoments}`
    + ` · proxy p0 ${proxy.p0_proxy} obsMed ${proxy.p0_obsCount_median} DECISION ${proxy.decision}`
    + ` · children ${children.length} (del ${output.bitChildren.byFamily.delivery} off ${output.bitChildren.byFamily.offside})`
    + ` · knee plateau ${knee.plateau} N* ${knee.nStar}`
    + ` · EPS ${eps.eps} ${eps.ok ? 'OK' : 'FAIL'}`
    + ` · partition ${partitionOk}`
    + ` · det ${deterministic}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : ''),
  );
}

function runCensusMode(): void {
  (globalThis as any).__t0 = Date.now();
  const { keying, source: keyingSource } = resolveKeying();

  const first = runCensus(true, false);
  const firstSummary = summarise(first);
  const second = runCensus(false, false);
  const secondSummary = summarise(second);
  const deterministic = canonical(firstSummary) === canonical(secondSummary);

  const { children, partitions } = buildBitChildren(first.rows, keying);
  const partitionOk = partitions.every((p) => p.momentPartitionOk && p.forkPartitionOk);

  // §4 the AUGMENT merge: v3 base copied byte-identical + in-power bit-children.
  const base = loadV3Base(V3_TABLE_IN);
  const mergeChildren: Record<'delivery' | 'offside', Record<string, Record<string, Record<string, TableCell>>>> = {
    delivery: {}, offside: {},
  };
  let mergedChildCount = 0;
  for (const ch of children) {
    if (!(ch.roleInPower && ch.childInPower)) continue;      // §4.1 drop under-powered children
    const fam = mergeChildren[ch.family];
    const ck = cellKey(ch.context, ch.role);
    (fam[ck] ?? (fam[ck] = {}));
    (fam[ck][ch.cand] ?? (fam[ck][ch.cand] = {}));
    fam[ck][ch.cand][ch.bit] = ch.cell;
    mergedChildCount += 1;
  }
  const mergedPayload = { base: base.table, children: mergeChildren };
  const mergedTableSha = createHash('sha256').update(canonical(mergedPayload)).digest('hex');

  const eps = extractOffsideEps(MECHANICS_SRC);
  const fp = productionFingerprint();
  const disjoint = seedDisjointness();

  const xMergeIdent = {
    partI_baseRehash: base.pass,
    baseShaObserved: base.observedSha,
    baseShaExpected: base.expectedSha,
    partII_partition: partitionOk,
    pass: base.pass && partitionOk,
  };

  const gates = {
    xForkIdent: firstSummary.forkIdentity.xForkIdent,
    cloneCoverage: firstSummary.forkIdentity.cloneCoverage,
    xDet: deterministic,
    xSrcZero: false,   // filled below
    xEpsReassert: eps.ok,
    xFpProd: fp.pass,
    xMergeIdent: xMergeIdent.pass,
    seedDisjoint: disjoint.pass,
  };
  let srcDiff = '';
  try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
  gates.xSrcZero = srcDiff === '' && fp.pass;
  const verdict = Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL';

  // the deliverable — the merged, bit-extended role table.
  const merged = {
    experiment: 'STAGE3-V4-P3p-1 MERGED ROLE CENSUS TABLE (AUGMENT)',
    authority: 'STAGE3-V4-P3P1-RECENSUS §4 · rulings #111/#112/#113',
    mode: 'census', world: 'ENRICHED', flags: CENSUS_FLAGS,
    keying, keyingSource,
    baseSource: V3_TABLE_IN, baseTableSha: base.expectedSha, baseTableShaObserved: base.observedSha,
    base: base.table,
    children: mergeChildren,
    mergedChildCount,
    xMergeIdent,
    mergedTableSha, verdict,
  };
  writeFileSync(MERGED_OUT, `${JSON.stringify(merged, null, 2)}\n`);

  // the census run report.
  const output = {
    experiment: 'STAGE3-V4-P3p-1 RE-CENSUS (targeted, bit-extended)',
    authority: 'STAGE3-V4-P3P1-RECENSUS · rulings #112/#113',
    mode: 'census', world: 'ENRICHED', flags: CENSUS_FLAGS,
    keying, keyingSource,
    ...firstSummary,
    bitChildren: {
      count: children.length, mergedChildCount,
      byFamily: {
        delivery: children.filter((c) => c.family === 'delivery').length,
        offside: children.filter((c) => c.family === 'offside').length,
      },
      children, partitions, partitionOk,
    },
    xMergeIdent,
    mergedTableSha,
    epsReassert: { ...eps, source: MECHANICS_SRC, mirror: OFFSIDE_EPS },
    fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
    xSrcZero: { pass: gates.xSrcZero, srcDiffEmpty: srcDiff === '', srcDiff },
    seedDisjointness: disjoint,
    receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(first.receipts).map(([k, v]) => [k, v.length])), records: first.receipts },
    gates, deterministic, verdict,
  };
  const sha256 = createHash('sha256').update(canonical({ ...output, sha256: undefined })).digest('hex');
  writeFileSync(RECENSUS_OUT, `${JSON.stringify({ ...output, sha256 }, null, 2)}\n`);

  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  console.error(
    `STAGE3-V4-P3p-1 CENSUS ${verdict}`
    + ` · keying ${keying} (${keyingSource})`
    + ` · matches ${output.coverage.matchesRun} moments ${output.coverage.moments} inScope ${output.coverage.inScopeMoments}`
    + ` · children ${children.length} merged ${mergedChildCount}`
    + ` · X-MERGE base ${base.pass} partition ${partitionOk}`
    + ` · EPS ${eps.eps} ${eps.ok ? 'OK' : 'FAIL'} · fp ${fp.pass}`
    + ` · det ${deterministic} · mergedSHA ${mergedTableSha}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : ''),
  );
}

/** small fixed-edge histogram for the §5 diagnostics. */
function histogram(xs: readonly number[], edges: readonly number[]): { edges: number[]; counts: number[]; n: number; p50: number; p95: number } {
  const counts = new Array(edges.length + 1).fill(0);
  for (const x of xs) {
    let b = edges.length;
    for (let i = 0; i < edges.length; i++) { if (x < edges[i]) { b = i; break; } }
    counts[b] += 1;
  }
  const sorted = [...xs].sort((a, b) => a - b);
  return { edges: [...edges], counts, n: xs.length, p50: round(percentile(sorted, 0.5), 4), p95: round(percentile(sorted, 0.95), 4) };
}

function main(): void {
  if (MODE !== 'smoke' && MODE !== 'census') {
    throw new Error(`V4P3P1_MODE must be explicitly 'smoke' or 'census' (no default); got '${MODE ?? ''}'`);
  }
  if (IS_CENSUS && !(MATCH_CAP >= 1)) {
    throw new Error('census mode requires V4P3P1_N ≥ 1 (the #105 knee gate; no default, §7.5)');
  }
  if (MODE === 'smoke') runSmoke(); else runCensusMode();
}

// run only as the entry script; importing (tests) exposes the helpers without running.
const isMain = (() => {
  try { return import.meta.url === pathToFileURL(process.argv[1] ?? '').href; } catch { return false; }
})();
if (isMain) main();

export {
  decideProxy, extractOffsideEps, computeKnee, buildBitChildren, loadV3Base,
  readPerceptBits, beyondForCandidate, signatureOf, runCensus, summarise, computeProxyMetrics,
  isForward, isAffectedContext, LATTICE, DELIVERY_CANDS, OFFSIDE_CANDS, AFFECTED_CONTEXTS,
  matchOf, cloneSimulationState, resolveKeying,
};
export type { MomentRow, ChildRecord, PartitionCheck, Keying, PerceptBits };
