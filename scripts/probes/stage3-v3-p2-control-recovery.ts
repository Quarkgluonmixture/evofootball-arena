// STAGE III V3-P2 — THE CONTROL-RECOVERY PASS (§4, ruling #71.2's guard)
//
// The committed V3-P1 table (tableSha 171a6dad…) serializes only the per-(context ×
// role) CANDIDATE cells, NOT the incumbent control LEVEL. The census DID fork the
// control at every moment (stage3-v3-p1-role-census.ts:459, outcomes[CONTROL_ID]) and
// used it for X5, PC and the pooled candidate−control gradient — but never wrote the
// level. The V3-P2 chooser's selection rule (advantage = V(x) − V(control), priced per
// context × own-role) cannot be reproduced from the table alone.
//
// THIS PASS (deterministic, READ-ONLY, forks the CENSUS block's OWN control fork ONLY):
// re-runs the frozen V3-P1 census seeds (9,110,000 + k, k ∈ 0..387), the V3-P0 sampling
// loop VERBATIM (lastMomentTime on every qualifying moment; the stable side-alternating
// rotation; the station-family filter; the TRUE role of the forced body), and re-runs the
// control fork (cand === null) at every recorded moment, aggregating signed(control) —
// and its score / concede rates — per (context × role). It RECOVERS a deterministic
// quantity the census computed but did not serialize; it re-cuts nothing (the committed
// table's forced cells stay byte-identical, tableSha unchanged); it is X-DET twice
// byte-identical.
//
// THE GUARD (#71.2, ex ante): the recovery must reproduce the census's OWN published
// candidate−control contrasts (gradient.pooledByCandidate + the INVERTED positiveControl
// PC) from (recovered POOLED control + committed table cell) to a stated tolerance — a
// recovery that cannot re-derive the census's own numbers is not a recovery.
//
// Authority: STAGE3-V3-P2-ROLE-CONSUMER §4 / §6 · ruling #71.2 / #83 · the V3-P1 census
// (the control fork reused VERBATIM) · #46.2 (this pass touches the CENSUS block, disjoint
// from the sizing smoke 9.20M / payoff block 9.21M).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen census parameters (stage3-v3-p1-role-census.ts VERBATIM) ---------
const W_S = 3.0;
const W_TICKS = Math.round(W_S / DT);
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const MOMENT_SPACING_S = 2.0;
const MATCH_DURATION = 240;
const SEED_START = 9_110_000;                       // §6: the FROZEN census block
const MATCH_CAP = envInt('V3P2_REC_MATCHES', 388);  // env-capped for the timing smoke
const CELL_FLOOR = 150;
const TABLE_PATH = 'docs/world-model/data/stage3-v3-p1-role-census-table.json';
const OUT_PATH = process.env.V3P2_REC_OUT
  ?? 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
/** #71.2: the stated guard tolerance. Identical in kind to V2-P2's (the ended-filter
 *  residual between the committed cell values and the moment-paired gradient); the
 *  freeze §4 already recovered the pooled control to ±0.00034 across the 18 candidates.
 *  Set at 2e-3 (comfortably above the ~4e-4 residual, tight enough that a mis-aggregated
 *  recovery fails by ≫ it); the actual max is REPORTED. */
const GUARD_TOL = envInt('V3P2_REC_TOL', 0) > 0 ? Number(process.env.V3P2_REC_TOL) : 2e-3;

/** §6 / #67.3: the ENRICHED census world (the full certified bundle), VERBATIM. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- the role axis + lattice + contexts (census VERBATIM) --------------------
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];
const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
interface Candidate { readonly id: string; readonly dx: number; readonly dy: number }
const LATTICE: Candidate[] = [];
for (const r of RADII) {
  for (const a of ANGLES) {
    const rad = (a * Math.PI) / 180;
    LATTICE.push({ id: `r${r}a${a}`, dx: Number((r * Math.cos(rad)).toFixed(9)), dy: Number((r * Math.sin(rad)).toFixed(9)) });
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
    fork.forcedStationPolicy = null;   // cand === null ⇒ census sets policy null every tick
    fork.step(DT);
    if (fork.simTick - startTick === H_SCORE_TICKS) score = mine.stats.shots > shots0;
    if (fork.finished) ended = true;
  }
  fork.forcedStationPolicy = null;
  if (fork.simTick - startTick < H_SCORE_TICKS) score = mine.stats.shots > shots0;
  return { score, concede: theirs.stats.shots > conceded0, ended };
};

// --- aggregation --------------------------------------------------------------
interface Agg { score: number; concede: number; signed: number; n: number }
const emptyAgg = (): Agg => ({ score: 0, concede: 0, signed: 0, n: 0 });
const push = (a: Agg, o: ControlOutcome): void => {
  const s = o.score ? 1 : 0; const c = o.concede ? 1 : 0;
  a.score += s; a.concede += c; a.signed += s - c; a.n += 1;
};
const cellOf = (a: Agg) => ({
  n: a.n,
  score: a.n === 0 ? Number.NaN : round(a.score / a.n),
  concede: a.n === 0 ? Number.NaN : round(a.concede / a.n),
  value: a.n === 0 ? Number.NaN : round((a.score - a.concede) / a.n),
});

interface RecOut {
  moments: number; matchesRun: number; qualifying: number;
  ballDirectedSkipped: number; noPool: number; clonesTaken: number; endedExcluded: number;
  pooled: Agg;
  pooledByFace: Record<Face, Agg>;
  pooledByRole: Record<string, Agg>;
  // chooser grain: (context × role)
  byCtxRole: Map<string, Record<string, Agg>>;
}
const newRec = (): RecOut => {
  const byCtxRole = new Map<string, Record<string, Agg>>();
  for (const ctx of CONTEXTS) {
    byCtxRole.set(ctx, Object.fromEntries(ROLE_AXIS.map((r) => [r, emptyAgg()])));
  }
  return {
    moments: 0, matchesRun: 0, qualifying: 0, ballDirectedSkipped: 0, noPool: 0, clonesTaken: 0, endedExcluded: 0,
    pooled: emptyAgg(),
    pooledByFace: { ours: emptyAgg(), theirs: emptyAgg() },
    pooledByRole: Object.fromEntries(ROLE_AXIS.map((r) => [r, emptyAgg()])),
    byCtxRole,
  };
};

const runRecovery = (): RecOut => {
  const out = newRec();
  let rotation = 0;
  // V3-P0 sampling loop VERBATIM: full matches, no moment target, lastMomentTime on
  // EVERY qualifying moment — the per-(context × role) stream identical to the census.
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
      lastMomentTime = m.simTime;                     // V3-P0 placement: reset on EVERY qualifying moment
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
      const role = body.role as Role;                 // §2.2: TRUE own-state role of the forced body

      const clone = cloneSimulationState(m);
      out.clonesTaken += 1;
      out.moments += 1;

      const control = runControlFork(clone, side);
      // §4: exclude the control fork's own ended rows (the census cell rule, applied to control).
      if (control.ended) { out.endedExcluded += 1; m.step(DT); continue; }

      push(out.pooled, control);
      push(out.pooledByFace[face], control);
      push(out.pooledByRole[role], control);
      push(out.byCtxRole.get(context)![role], control);
      m.step(DT);
    }
  }
  return out;
};

// --- the committed table (the guard reference) -------------------------------
interface RawTable {
  tableSha: string;
  table: Record<string, Record<string, Record<string, { n: number; value: number; underPowered?: boolean }>>>;
  gradient: { pooledByCandidate: Record<string, { n: number; point: number; lower: number; upper: number }> };
  positiveControl: { pooled: { point: number }; byFace: Record<string, { point: number }>; byRole: Record<string, { point: number }> };
  coverage: { momentCounts: Record<string, number> };
}
const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as RawTable;
const TABLE_SHA = raw.tableSha;

/** the n-weighted pooled candidate value from the committed table (across context × role). */
const pooledTableValue = (cand: string): number => {
  let sN = 0; let sV = 0;
  for (const ctx of CONTEXTS) for (const role of ROLE_AXIS) {
    const c = raw.table[ctx][role][cand];
    if (c && Number.isFinite(c.value)) { sN += c.n; sV += c.n * c.value; }
  }
  return sN === 0 ? Number.NaN : sV / sN;
};
const pooledTableValueFace = (cand: string, face: Face): number => {
  let sN = 0; let sV = 0;
  for (const ctx of CONTEXTS) { if (!ctx.startsWith(`${face}|`)) continue;
    for (const role of ROLE_AXIS) {
      const c = raw.table[ctx][role][cand];
      if (c && Number.isFinite(c.value)) { sN += c.n; sV += c.n * c.value; }
    } }
  return sN === 0 ? Number.NaN : sV / sN;
};
const pooledTableValueRole = (cand: string, role: Role): number => {
  let sN = 0; let sV = 0;
  for (const ctx of CONTEXTS) {
    const c = raw.table[ctx][role][cand];
    if (c && Number.isFinite(c.value)) { sN += c.n; sV += c.n * c.value; }
  }
  return sN === 0 ? Number.NaN : sV / sN;
};

const summarise = (rec: RecOut) => {
  const pooledControl = rec.pooled.n === 0 ? Number.NaN : (rec.pooled.score - rec.pooled.concede) / rec.pooled.n;
  const pooledControlByFace = Object.fromEntries(FACES.map((f) => {
    const a = rec.pooledByFace[f];
    return [f, a.n === 0 ? Number.NaN : (a.score - a.concede) / a.n];
  })) as Record<Face, number>;
  const pooledControlByRole = Object.fromEntries(ROLE_AXIS.map((r) => {
    const a = rec.pooledByRole[r];
    return [r, a.n === 0 ? Number.NaN : (a.score - a.concede) / a.n];
  })) as Record<string, number>;

  // the recovered chooser table: control cell per (context × role).
  const control: Record<string, Record<string, ReturnType<typeof cellOf>>> = {};
  for (const ctx of CONTEXTS) {
    control[ctx] = Object.fromEntries(ROLE_AXIS.map((r) => [r, cellOf(rec.byCtxRole.get(ctx)![r])]));
  }

  // THE GUARD (#71.2): reproduce every published candidate−control contrast from
  // (recovered pooled control + committed table cell). GATED on the 18 pooled contrasts
  // + the pooled PC (§4.1 guard table); byFace / byRole reproductions are REPORTED.
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
    byRole: Object.fromEntries(ROLE_AXIS.map((r) => {
      const rec2 = pooledTableValueRole(PC_ID, r) - pooledControlByRole[r];
      const pub = raw.positiveControl.byRole[r].point;
      return [r, { reconstructed: round(rec2, 6), published: pub, dev: round(Math.abs(rec2 - pub), 8) }];
    })),
  };
  const maxContrastDev = Math.max(...contrastChecks.map((c) => c.dev));
  const maxPcDev = pcCheck.pooled.dev;                          // gated PC = POOLED (§4.1)
  const maxDev = Math.max(maxContrastDev, maxPcDev);
  const guardPass = maxDev <= GUARD_TOL;

  // pooled-control internal consistency: the implied pooled control from each candidate.
  const impliedPooled = LATTICE.map((cand) => round(pooledTableValue(cand.id) - raw.gradient.pooledByCandidate[cand.id].point, 6));
  const impliedMean = impliedPooled.reduce((s, x) => s + x, 0) / impliedPooled.length;
  const impliedSd = Math.sqrt(impliedPooled.reduce((s, x) => s + (x - impliedMean) ** 2, 0) / impliedPooled.length);

  return {
    parameters: {
      seedStart: SEED_START, matchCap: MATCH_CAP,
      block: `${SEED_START}..${SEED_START + MATCH_CAP - 1}`,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, wTicks: W_TICKS,
      hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S, cellFloor: CELL_FLOOR,
      roleAxis: ROLE_AXIS, contexts: CONTEXTS, lattice: LATTICE.map((c) => c.id),
      guardTolerance: GUARD_TOL, consumedTableSha: TABLE_SHA,
      note: 'read-only re-run of the census control fork ONLY (cand === null); '
        + 'recovers signed(control) per (context × role); re-cuts nothing; V3-P0 sampling loop verbatim.',
    },
    coverage: {
      matchesRun: rec.matchesRun, moments: rec.moments, qualifying: rec.qualifying,
      clonesTaken: rec.clonesTaken, cloneCoverage: rec.moments === 0 ? Number.NaN : round(rec.clonesTaken / rec.moments),
      ballDirectedSkipped: rec.ballDirectedSkipped, noPool: rec.noPool, endedExcluded: rec.endedExcluded,
    },
    pooledControl: round(pooledControl, 6),
    pooledControlByFace: Object.fromEntries(FACES.map((f) => [f, round(pooledControlByFace[f], 6)])),
    pooledControlByRole: Object.fromEntries(ROLE_AXIS.map((r) => [r, round(pooledControlByRole[r], 6)])),
    pooledControlImplied: { mean: round(impliedMean, 6), sd: round(impliedSd, 8), perCandidate: impliedPooled },
    control,
    guard: {
      tolerance: GUARD_TOL,
      maxContrastDev: round(maxContrastDev, 8),
      maxPcDev: round(maxPcDev, 8),
      maxDev: round(maxDev, 8),
      pass: guardPass,
      gated: 'the 18 pooled candidate−control contrasts + the pooled inverted PC (§4.1)',
      contrastChecks, positiveControl: pcCheck,
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
  experiment: 'STAGE3-V3-P2 (the control-recovery pass, §4 / #71.2)',
  authority: 'STAGE3-V3-P2-ROLE-CONSUMER §4 · rulings #71.2 / #83 · the V3-P1 census control fork',
  head: '57e3c35 (ruling #79; src byte-identical to V3-P0 HEAD 49ba867)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  ...firstSum,
  deterministic, sha256,
  verdict: firstSum.guard.pass && deterministic ? 'GUARD PASS' : 'GUARD FAIL',
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

console.error(
  `V3-P2 CONTROL-RECOVERY ${output.verdict}`
  + ` · matches ${firstSum.coverage.matchesRun} moments ${firstSum.coverage.moments} endedExcl ${firstSum.coverage.endedExcluded}`
  + ` · pooledControl ${firstSum.pooledControl} (implied ${firstSum.pooledControlImplied.mean}±${firstSum.pooledControlImplied.sd})`
  + ` · byRole DF ${firstSum.pooledControlByRole.DF} MF ${firstSum.pooledControlByRole.MF} WG ${firstSum.pooledControlByRole.WG} ST ${firstSum.pooledControlByRole.ST}`
  + ` · guard maxDev ${firstSum.guard.maxDev} (tol ${GUARD_TOL}) contrast ${firstSum.guard.maxContrastDev} pc ${firstSum.guard.maxPcDev} pass ${firstSum.guard.pass}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
