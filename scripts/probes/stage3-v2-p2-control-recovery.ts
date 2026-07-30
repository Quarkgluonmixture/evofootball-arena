// STAGE III V2-P2 — THE CONTROL-RECOVERY PASS (§2.4a, ruling #71.2's guard)
//
// The committed V2-P1 table (tableSha a33e9a73…) serializes only the going0/going1
// CANDIDATE cells, NOT the incumbent control LEVEL. The census DID fork the control
// at every moment (stage3-v2-p1-anticipatory-census.ts:494, outcomes[CONTROL_ID])
// and used it for X5, PC and the gradient candidate−control contrasts — but never
// wrote the level. The V2-P2 chooser's selection rule (advantage = V(x) − V(control),
// priced per context × going-bit) cannot be reproduced from the table alone.
//
// THIS PASS (deterministic, READ-ONLY, forks the CENSUS block's OWN control fork
// ONLY): re-runs the frozen V2-P1 census seeds (8,810,000 + k), MATCH_CAP 650,
// MOMENT_TARGET 49,094, identical moment selection, and re-runs the control fork
// (cand === null) at every moment, aggregating signed(control) — and its score /
// concede rates — per (context × going-bit), keyed by each candidate's TRUE
// OTHERS-GOING bit exactly as the census keyed the going cells. It RECOVERS a
// deterministic quantity the census computed but did not serialize; it re-cuts
// nothing (the committed table's 432 forced cells stay byte-identical, tableSha
// unchanged); it is X-DET twice byte-identical.
//
// THE GUARD (#71.2, ex ante): the recovery must reproduce the census's OWN
// published candidate−control contrasts (gradient.pooledByCandidate + positiveControl)
// from (recovered pooled control + committed table cell) to a stated tolerance —
// a recovery that cannot re-derive the census's own numbers is not a recovery.
//
// Authority: STAGE3-V2-P2-CONSUMER §2.4a / §3.6 · ruling #71.2 · the census probe
// (the control fork + going-bit computation reused VERBATIM) · #46.2 (this pass
// touches the CENSUS block, disjoint from the sizing smoke / payoff block).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen census parameters (stage3-v2-p1-anticipatory-census.ts VERBATIM) --
const W_S = 3.0;
const W_TICKS = Math.round(W_S / DT);
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const MOMENT_SPACING_S = 2.0;
const R_M = 4.0;
const MATCH_DURATION = 240;
const SEED_START = 8_810_000;                     // §3.6: the FROZEN census block
const MATCH_CAP = envInt('V2P2_REC_MATCHES', 650); // env-capped for the timing smoke
const MOMENT_TARGET = envInt('V2P2_REC_MOMENTS', 49_094);
const CELL_FLOOR = 150;
const TABLE_PATH = 'docs/world-model/data/stage3-v2-p1-anticipatory-table.json';
const OUT_PATH = process.env.V2P2_REC_OUT
  ?? 'docs/world-model/data/stage3-v2-p2-control-recovery.json';
/** #71.2: the stated guard tolerance, documented. The reconstruction
 *  gradient.point(cand) ≈ pooledTableValue(cand) − pooledControl is EXACT except
 *  for the ended-filter mismatch — the committed table cell excludes the
 *  CANDIDATE's ended forks while the moment-paired gradient excludes BOTH the
 *  candidate's and the control's, and the recovered pooled control excludes the
 *  CONTROL's. The census's own table+gradient recovery is already internally
 *  consistent to ±3.56e-4 across the 18 candidates (this same residual); the
 *  recovered pooled control must reproduce every published contrast to within that
 *  residual plus rounding. Set at 2e-3 (comfortably above the ~4e-4 residual, tight
 *  enough that a mis-aggregated recovery fails by ≫ it); the actual max is REPORTED. */
const GUARD_TOL = envInt('V2P2_REC_TOL', 0) > 0 ? Number(process.env.V2P2_REC_TOL) : 2e-3;

/** §6 / #67.3: the ENRICHED census world (the full certified bundle), VERBATIM. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- the lattice + contexts (census VERBATIM) --------------------------------
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
const CONTROL_ID = 'control';
const PC_ID = 'r21a180';

type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const contextKey = (f: Face, t: Threat, d: Density): string => `${f}|${t}|${d}`;
const FACES: readonly Face[] = ['ours', 'theirs'];
const THREATS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const DENSITIES: readonly Density[] = ['sparse', 'crowded'];
const CONTEXTS: string[] = [];
for (const f of FACES) for (const t of THREATS) for (const d of DENSITIES) CONTEXTS.push(contextKey(f, t, d));
const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

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

const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);

// --- the control fork (census runFork with cand === null), signature-free -----
interface ControlOutcome { score: boolean; concede: boolean; ended: boolean }
const runControlFork = (before: Match, side: number): ControlOutcome => {
  const fork = cloneSimulationState(before);
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const shots0 = mine.stats.shots;
  const conceded0 = theirs.stats.shots;
  const startTick = fork.simTick;
  let score = false;
  let ended = false;
  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    // cand === null ⇒ the census sets forcedStationPolicy = null every tick.
    fork.forcedStationPolicy = null;
    fork.step(DT);
    if (fork.simTick - startTick === H_SCORE_TICKS) score = mine.stats.shots > shots0;
    if (fork.finished) ended = true;
  }
  fork.forcedStationPolicy = null;
  if (fork.simTick - startTick < H_SCORE_TICKS) score = mine.stats.shots > shots0;
  return { score, concede: theirs.stats.shots > conceded0, ended };
};

/** §2.2: the TRUE OTHERS-GOING bit per candidate (census computeGoingBits, TRUE side). */
const computeTrueGoing = (clone: Match, side: number, body: Player): Record<string, 0 | 1> => {
  const mine = clone.teams[side];
  const ball = clone.ball.pos;
  const teammates = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p.gid !== body.gid);
  const out: Record<string, 0 | 1> = {};
  for (const cand of LATTICE) {
    const cx = ball.x + mine.attackDir * cand.dx;
    const cy = ball.y + cand.dy;
    let bit: 0 | 1 = 0;
    for (const t of teammates) {
      if (dist(t.pos.x + t.vel.x * W_S, t.pos.y + t.vel.y * W_S, cx, cy) <= R_M) { bit = 1; break; }
    }
    out[cand.id] = bit;
  }
  return out;
};

// --- aggregation --------------------------------------------------------------
interface Agg { score: number; concede: number; signed: number; n: number }
const emptyAgg = (): Agg => ({ score: 0, concede: 0, signed: 0, n: 0 });
const push = (a: Agg, o: ControlOutcome): void => {
  const s = o.score ? 1 : 0;
  const c = o.concede ? 1 : 0;
  a.score += s; a.concede += c; a.signed += s - c; a.n += 1;
};
const cellOf = (a: Agg) => ({
  n: a.n,
  score: a.n === 0 ? Number.NaN : round(a.score / a.n),
  concede: a.n === 0 ? Number.NaN : round(a.concede / a.n),
  value: a.n === 0 ? Number.NaN : round((a.score - a.concede) / a.n),
});

interface RecOut {
  moments: number;
  matchesRun: number;
  ballDirectedSkipped: number;
  noPool: number;
  clonesTaken: number;
  endedExcluded: number;
  // pooled (guard grain: one control outcome per moment, plain mean)
  pooled: Agg;
  pooledByFace: Record<Face, Agg>;
  // chooser grain: (context × going-bit), weighted by candidate-bit counts
  byCtxGoing: Map<string, { going0: Agg; going1: Agg }>;
}
const newRec = (): RecOut => {
  const byCtxGoing = new Map<string, { going0: Agg; going1: Agg }>();
  for (const ctx of CONTEXTS) byCtxGoing.set(ctx, { going0: emptyAgg(), going1: emptyAgg() });
  return {
    moments: 0, matchesRun: 0, ballDirectedSkipped: 0, noPool: 0, clonesTaken: 0, endedExcluded: 0,
    pooled: emptyAgg(),
    pooledByFace: { ours: emptyAgg(), theirs: emptyAgg() },
    byCtxGoing,
  };
};

const runRecovery = (): RecOut => {
  const out = newRec();
  let rotation = 0;
  for (let k = 0; k < MATCH_CAP && out.moments < MOMENT_TARGET; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    out.matchesRun += 1;
    let lastMomentTime = -Infinity;
    while (!m.finished && out.moments < MOMENT_TARGET) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
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
      const context = contextKey(face, localXBand(mine.localX(m.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');

      const clone = cloneSimulationState(m);
      out.clonesTaken += 1;
      lastMomentTime = m.simTime;
      out.moments += 1;

      const cloneBody = clone.allPlayers.find((p) => p.gid === body.gid)!;
      const trueGoing = computeTrueGoing(clone, side, cloneBody);
      const control = runControlFork(clone, side);

      // §2.4a: exclude the control fork's own ended rows (a fork ending inside the
      // horizon is EXCLUDED, not zeroed — the census's cell rule, applied to control).
      if (control.ended) { out.endedExcluded += 1; m.step(DT); continue; }

      // guard grain: one control outcome per moment.
      push(out.pooled, control);
      push(out.pooledByFace[face], control);
      // chooser grain: the control replicated across candidate slots by their TRUE
      // going-bit — the paired baseline for the going-conditioned candidate cells.
      const bucket = out.byCtxGoing.get(context)!;
      for (const cand of LATTICE) {
        if (trueGoing[cand.id] === 1) push(bucket.going1, control);
        else push(bucket.going0, control);
      }
      m.step(DT);
    }
  }
  return out;
};

// --- the committed table (the guard reference) -------------------------------
interface RawTable {
  tableSha: string;
  table: Record<string, { going0: Record<string, { n: number; value: number }>; going1: Record<string, { n: number; value: number }> }>;
  gradient: { pooledByCandidate: Record<string, { n: number; point: number; lower: number; upper: number }> };
  positiveControl: { pooled: { point: number }; byFace: Record<string, { point: number }> };
}
const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as RawTable;
const TABLE_SHA = raw.tableSha;

/** the n-weighted pooled candidate value from the committed table (both going splits). */
const pooledTableValue = (cand: string): number => {
  let sN = 0; let sV = 0;
  for (const ctx of CONTEXTS) {
    const c0 = raw.table[ctx].going0[cand];
    const c1 = raw.table[ctx].going1[cand];
    if (c0 && Number.isFinite(c0.value)) { sN += c0.n; sV += c0.n * c0.value; }
    if (c1 && Number.isFinite(c1.value)) { sN += c1.n; sV += c1.n * c1.value; }
  }
  return sN === 0 ? Number.NaN : sV / sN;
};
/** face-restricted pooled candidate value (for the positiveControl byFace guard). */
const pooledTableValueFace = (cand: string, face: Face): number => {
  let sN = 0; let sV = 0;
  for (const ctx of CONTEXTS) {
    if (!ctx.startsWith(`${face}|`)) continue;
    const c0 = raw.table[ctx].going0[cand];
    const c1 = raw.table[ctx].going1[cand];
    if (c0 && Number.isFinite(c0.value)) { sN += c0.n; sV += c0.n * c0.value; }
    if (c1 && Number.isFinite(c1.value)) { sN += c1.n; sV += c1.n * c1.value; }
  }
  return sN === 0 ? Number.NaN : sV / sN;
};

const summarise = (rec: RecOut) => {
  const pooledControl = rec.pooled.n === 0 ? Number.NaN : (rec.pooled.score - rec.pooled.concede) / rec.pooled.n;
  const pooledControlByFace = Object.fromEntries(FACES.map((f) => {
    const a = rec.pooledByFace[f];
    return [f, a.n === 0 ? Number.NaN : (a.score - a.concede) / a.n];
  })) as Record<Face, number>;

  // the recovered chooser table: control cell per (context × going-bit).
  const control: Record<string, { going0: ReturnType<typeof cellOf>; going1: ReturnType<typeof cellOf> }> = {};
  for (const ctx of CONTEXTS) {
    const b = rec.byCtxGoing.get(ctx)!;
    control[ctx] = { going0: cellOf(b.going0), going1: cellOf(b.going1) };
  }

  // THE GUARD (#71.2): reproduce every published candidate−control contrast from
  // (recovered pooled control + committed table cell) and record the deviation.
  const contrastChecks = LATTICE.map((cand) => {
    const reconstructed = round(pooledTableValue(cand.id) - pooledControl, 6);
    const published = raw.gradient.pooledByCandidate[cand.id].point;
    return { cand: cand.id, reconstructed, published, dev: round(Math.abs(reconstructed - published), 8) };
  });
  const pcCheck = {
    pooled: {
      reconstructed: round(pooledTableValue(PC_ID) - pooledControl, 6),
      published: raw.positiveControl.pooled.point,
      dev: round(Math.abs((pooledTableValue(PC_ID) - pooledControl) - raw.positiveControl.pooled.point), 8),
    },
    byFace: Object.fromEntries(FACES.map((f) => {
      const rec2 = pooledTableValueFace(PC_ID, f) - pooledControlByFace[f];
      const pub = raw.positiveControl.byFace[f].point;
      return [f, { reconstructed: round(rec2, 6), published: pub, dev: round(Math.abs(rec2 - pub), 8) }];
    })),
  };
  const maxContrastDev = Math.max(...contrastChecks.map((c) => c.dev));
  const maxPcDev = Math.max(pcCheck.pooled.dev, ...FACES.map((f) => pcCheck.byFace[f].dev));
  const maxDev = Math.max(maxContrastDev, maxPcDev);
  const guardPass = maxDev <= GUARD_TOL;

  return {
    parameters: {
      seedStart: SEED_START, matchCap: MATCH_CAP, momentTarget: MOMENT_TARGET,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, wTicks: W_TICKS,
      hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S, regionRadiusM: R_M,
      cellFloor: CELL_FLOOR, contexts: CONTEXTS, lattice: LATTICE.map((c) => c.id),
      guardTolerance: GUARD_TOL, consumedTableSha: TABLE_SHA,
      note: 'read-only re-run of the census control fork ONLY (cand === null); '
        + 'recovers signed(control) per (context × going-bit); re-cuts nothing.',
    },
    coverage: {
      matchesRun: rec.matchesRun, moments: rec.moments, clonesTaken: rec.clonesTaken,
      cloneCoverage: rec.moments === 0 ? Number.NaN : round(rec.clonesTaken / rec.moments),
      ballDirectedSkipped: rec.ballDirectedSkipped, noPool: rec.noPool,
      endedExcluded: rec.endedExcluded,
    },
    pooledControl: round(pooledControl, 6),
    pooledControlByFace: Object.fromEntries(FACES.map((f) => [f, round(pooledControlByFace[f], 6)])),
    control,
    guard: {
      tolerance: GUARD_TOL,
      maxContrastDev: round(maxContrastDev, 8),
      maxPcDev: round(maxPcDev, 8),
      maxDev: round(maxDev, 8),
      pass: guardPass,
      contrastChecks,
      positiveControl: pcCheck,
    },
  };
};

const first = runRecovery();
const firstSum = summarise(first);
const second = runRecovery();
const secondSum = summarise(second);
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(firstSum) === canonical(secondSum);
const sha256 = createHash('sha256').update(canonical(firstSum)).digest('hex');

const output = {
  experiment: 'STAGE3-V2-P2 (the control-recovery pass, §2.4a / #71.2)',
  authority: 'STAGE3-V2-P2-CONSUMER §2.4a · ruling #71.2 · the V2-P1 census control fork',
  head: 'c5f2913 (ruling #68; src identical to V2-P0 HEAD 92876e5 / V2-P1)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  ...firstSum,
  deterministic,
  sha256,
  verdict: firstSum.guard.pass && deterministic ? 'GUARD PASS' : 'GUARD FAIL',
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

console.error(
  `V2-P2 CONTROL-RECOVERY ${output.verdict}`
  + ` · matches ${firstSum.coverage.matchesRun} moments ${firstSum.coverage.moments}`
  + ` endedExcl ${firstSum.coverage.endedExcluded}`
  + ` · pooledControl ${firstSum.pooledControl} (ours ${firstSum.pooledControlByFace.ours} theirs ${firstSum.pooledControlByFace.theirs})`
  + ` · guard maxDev ${firstSum.guard.maxDev} (tol ${GUARD_TOL}) contrast ${firstSum.guard.maxContrastDev} pc ${firstSum.guard.maxPcDev} pass ${firstSum.guard.pass}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
