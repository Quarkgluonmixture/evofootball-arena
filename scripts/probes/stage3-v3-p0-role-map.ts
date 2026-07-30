// STAGE III V3-P0 — THE ROLE BASE-RATE AND POWER MAP (read-only census, zero src/**)
//
// Authority: docs/world-model/STAGE3-V3-P0-ROLE-MAP.md (the frozen spec — the four
// deliverables (i)-(iv) §4, the role axis §2.1, the census cell §2.2, the frozen
// incumbent-signature instrument §2.4, the gates §5, the pre-laid readings §6, the
// staging §7) · STAGE3-V3-ROLE-EYE.md §4 · commander ruling #77 (v3 launched;
// division of labour is the minimal doctrine) · ruling #78 (V3-P0 pre-registration
// PASS; the load-bearing rule ratified; run authorized in-session). Parents reused
// unamended: STAGE3-P1R-APPROACH-CENSUS (moment instrument, the 18-candidate
// ball-local lattice, the 12 contexts, station family) · STAGE3-V2-P0-WEDGE-MAP
// (the P0 harness: cluster bootstrap, X-DET double run, X-CLONE, the exception
// ledger).
//
// It records the station family at NATURAL rates on the ENRICHED world (#67.3 full
// bundle), split by the ROLE the world already assigns (role read from the sampled
// body's own immutable `role` field — never authored, contract I8). Every read runs
// off a PRISTINE clone. It FORKS NOTHING, prices nothing, ships nothing (Road B).
// Deliverables:
//   (i)   station-family moment shares BY ROLE {DF,MF,WG,ST}, overall + per context,
//         with cluster CIs — the four-way split, V3-P1's #24 partitioning population.
//   (ii)  the per-(context x role) coverage table vs the 150 floor at the frozen
//         388-match budget — the attainability table; the four ex-ante under-powered
//         cells confirmed or corrected BY MEASUREMENT; the per-context role-starvation
//         check (roles clearing 150).
//   (iii) THE INCUMBENT'S ROLE SIGNATURE — per role, the histogram over the 18
//         lattice cells (+ outside-lattice) of where the incumbent's own ball-local
//         station target sits (formationSpot, on a clone), with cluster CIs; the
//         pairwise total-variation distances between role histograms — the R3
//         kill-reading input.
//   (iv)  the census-budget power arithmetic, re-measured on the 9.11M block with a
//         cluster CI on the binding rate — the number V3-P1 needs.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { formationSpot } from '../../src/ai/formations';
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

// --- frozen parameters (the spec, §2/§3/§7) ----------------------------------
const MATCH_DURATION = 240;
const CENSUS_SEED_START = 9_110_000;                       // §7, disjoint above 9.01M, block 9.11M + k
const CENSUS_MATCHES = envInt('V3P0_MATCHES', 388);        // §3 frozen 2x-headroom binding
const MOMENT_SPACING_S = 2.0;                              // P1R §3.4 verbatim
const CELL_FLOOR = 150;                                    // #24
const HEADROOM = 2;                                        // X6_FLOOR convention: 2x the measured
const BOOTSTRAP_RESAMPLES = 2000;                          // #20
const BOOTSTRAP_SEED = 91100;                              // §7 frozen (fresh, disjoint from 50066/90730)
const CLONE_CHECK_EVERY = 25;                              // X-CLONE 1-in-25 sample (§5)
const OUTSIDE_LATTICE_M = 24;                              // §2.4: beyond r=21 + 3 m margin
const RECEIPT_CAP = 1000;                                  // §5, #49.3 per-class cap
const OUT_PATH = process.env.V3P0_OUT
  ?? 'docs/world-model/data/stage3-v3-p0-role-map.json';

/** The enriched census world (#67.3 full bundle; the V2-P0 / C5-recensus precedent). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

// --- the role axis (contract §2.1): read from the sampled body, GK never here ---
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];

// --- the ball-local lattice (P1R §2.3): 18 candidates ------------------------
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
const N_BINS = LATTICE.length + 1;                 // 18 lattice cells + outside-lattice
const OUTSIDE_BIN = LATTICE.length;                // index 18
const binId = (i: number): string => (i === OUTSIDE_BIN ? 'outside-lattice' : LATTICE[i].id);

// --- contexts (P1R §3.2, verbatim) -------------------------------------------
type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const contextKey = (f: Face, t: Threat, d: Density): string => `${f}|${t}|${d}`;
const FACES: readonly Face[] = ['ours', 'theirs'];
const THREATS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const DENSITIES: readonly Density[] = ['sparse', 'crowded'];
const CONTEXTS: string[] = [];
for (const f of FACES) for (const t of THREATS) for (const d of DENSITIES) CONTEXTS.push(contextKey(f, t, d));
const cellKey = (ctx: string, role: Role): string => `${ctx}||${role}`;
const CELLS: string[] = [];
for (const c of CONTEXTS) for (const r of ROLE_AXIS) CELLS.push(cellKey(c, r));
const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

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

// --- helpers -----------------------------------------------------------------
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// --- standing exception ledger (§5 / #38.1) ----------------------------------
// V3-P0 FORCES NOTHING (registered non-claim §8), so every force-fidelity class
// (carrier / ball-won / onside / barred) is vacuous by construction. The census
// ledgers every qualifying moment's disposition and requires unexplained === 0.
interface Receipt { seed: number; tick: number; gid: number; cause: string }
interface Ledger {
  qualifying: number;       // playing + owner, spacing met
  rows: number;             // station-family moments that produced a record
  ballDirectedSkipped: number;
  noPool: number;
  eSentOff: number;         // sampled body sent off (E-INJURY family)
  unexplained: number;      // must be 0
  receipts: Receipt[];      // capped RECEIPT_CAP per class
  receiptCounts: Record<string, number>;
}
const newLedger = (): Ledger => ({
  qualifying: 0, rows: 0, ballDirectedSkipped: 0, noPool: 0, eSentOff: 0, unexplained: 0,
  receipts: [], receiptCounts: {},
});
const receipt = (L: Ledger, seed: number, tick: number, gid: number, cause: string): void => {
  L.receiptCounts[cause] = (L.receiptCounts[cause] ?? 0) + 1;
  if (L.receiptCounts[cause] <= RECEIPT_CAP) L.receipts.push({ seed, tick, gid, cause });
};

// --- per-moment aggregate (the cluster-bootstrap unit) -----------------------
interface MomentAgg {
  cluster: number;          // match seed offset
  context: string;
  role: Role;
  bin: number;              // incumbent signature: 0..17 lattice, 18 outside-lattice
}

interface CensusOut {
  moments: MomentAgg[];
  ledger: Ledger;
  clonesTaken: number;
  cloneChecked: number;
  cloneMismatched: number;
}

const runCensus = (): CensusOut => {
  const out: CensusOut = {
    moments: [], ledger: newLedger(),
    clonesTaken: 0, cloneChecked: 0, cloneMismatched: 0,
  };
  let rotation = 0;

  for (let k = 0; k < CENSUS_MATCHES; k++) {
    const seed = CENSUS_SEED_START + k;
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    let tick = 0;

    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (qualifies) {
        out.ledger.qualifying += 1;
        lastMomentTime = m.simTime;
        // P1R §3.2/§3.4 verbatim: side alternates on the stable rotation, body is
        // picked by the same stable rotation (never proximity, never by role).
        const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
        const mine = m.teams[side];
        const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
        if (pool.length === 0) {
          out.ledger.noPool += 1;
          receipt(out.ledger, seed, tick, -1, 'noPool');
        } else {
          const body = pool[Math.floor(rotation / 2) % pool.length];
          rotation += 1;
          if (body.sentOff) {
            out.ledger.eSentOff += 1;
            receipt(out.ledger, seed, tick, body.gid, 'eSentOff');
          } else if (!STATION_FAMILY.has(body.action.type)) {
            out.ledger.ballDirectedSkipped += 1;
          } else {
            processMoment(m, k, side, body, owner!, tick, out);
          }
        }
      }
      m.step(DT);
      tick += 1;
    }
  }

  // unexplained: every qualifying moment must resolve to exactly one disposition.
  out.ledger.unexplained = out.ledger.qualifying
    - (out.ledger.rows + out.ledger.ballDirectedSkipped + out.ledger.noPool + out.ledger.eSentOff);
  return out;
};

/** Read ONE census moment off a pristine clone (X-CLONE): role, context, incumbent target. */
function processMoment(
  m: Match, cluster: number, side: number, liveBody: Player, owner: Player, tick: number, out: CensusOut,
): void {
  const clone = cloneSimulationState(m);
  out.clonesTaken += 1;
  // X-CLONE 1-in-25: the fresh clone must equal the live match bit-identically at
  // capture (clone fidelity + proof no prior read perturbed the live path).
  if (out.clonesTaken % CLONE_CHECK_EVERY === 0) {
    out.cloneChecked += 1;
    if (signatureOf(clone) !== signatureOf(m)) out.cloneMismatched += 1;
  }

  const mine = clone.teams[side];
  const opp = clone.teams[1 - side];
  const body = clone.allPlayers.find((p) => p.gid === liveBody.gid)!;
  const face: Face = side === owner.side ? 'ours' : 'theirs';
  let near = 0;
  for (const q of mine.players) {
    if (q === body || q.role === 'GK' || q.sentOff) continue;
    if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
  }
  const context = contextKey(face, localXBand(mine.localX(clone.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');
  const role = body.role as Role;                  // OWN state: role is read, never authored (contract I8)

  // --- (iii) the frozen incumbent-signature instrument (§2.4) ---
  // The incumbent's own desired station target — the formation machinery's output,
  // read hasBall=false per the frozen definition — transformed to the ball-local
  // attack frame the lattice lives in, and binned to the nearest of the 18 lattice
  // points, with an `outside-lattice` residual for targets > 24 m from the ball.
  const target = formationSpot(body, mine, clone.ball, false, opp);
  const tdx = (target.x - clone.ball.pos.x) * mine.attackDir;
  const tdy = target.y - clone.ball.pos.y;
  let bin = OUTSIDE_BIN;
  if (Math.hypot(tdx, tdy) <= OUTSIDE_LATTICE_M) {
    let best = Number.POSITIVE_INFINITY;
    for (let i = 0; i < LATTICE.length; i++) {
      const d = dist(tdx, tdy, LATTICE[i].dx, LATTICE[i].dy);
      if (d < best) { best = d; bin = i; }
    }
  }

  out.ledger.rows += 1;
  out.moments.push({ cluster, context, role, bin });
  void tick;
}

// --- cluster bootstrap over match seeds (#20) --------------------------------
const clusterBootstrap = (
  moments: readonly MomentAgg[], stat: (rs: readonly MomentAgg[]) => number, offset: number,
): { point: number; lower: number; upper: number } => {
  const byCluster = new Map<number, MomentAgg[]>();
  for (const r of moments) {
    const b = byCluster.get(r.cluster) ?? [];
    b.push(r);
    byCluster.set(r.cluster, b);
  }
  const clusters = [...byCluster.values()];
  const point = stat(moments);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentAgg[] = [];
    for (let i = 0; i < clusters.length; i++) {
      for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    }
    const v = stat(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};

const roleShareStat = (role: Role) => (rs: readonly MomentAgg[]): number => {
  if (rs.length === 0) return Number.NaN;
  let c = 0;
  for (const r of rs) if (r.role === role) c += 1;
  return c / rs.length;
};

// TV distance between two roles' incumbent-signature histograms over a moment set.
const histFor = (rs: readonly MomentAgg[], role: Role): number[] => {
  const h = new Array<number>(N_BINS).fill(0);
  let n = 0;
  for (const r of rs) if (r.role === role) { h[r.bin] += 1; n += 1; }
  if (n === 0) return h; // all-zero
  for (let i = 0; i < N_BINS; i++) h[i] /= n;
  return h;
};
const tvOf = (p: readonly number[], q: readonly number[]): number => {
  let s = 0;
  for (let i = 0; i < N_BINS; i++) s += Math.abs(p[i] - q[i]);
  return 0.5 * s;
};
const tvStat = (ra: Role, rb: Role) => (rs: readonly MomentAgg[]): number => {
  const pa = histFor(rs, ra);
  const pb = histFor(rs, rb);
  // guard: if either role has no rows in this resample, the TV is undefined
  const na = rs.reduce((a, r) => a + (r.role === ra ? 1 : 0), 0);
  const nb = rs.reduce((a, r) => a + (r.role === rb ? 1 : 0), 0);
  if (na === 0 || nb === 0) return Number.NaN;
  return tvOf(pa, pb);
};

// normalized Shannon entropy of a role histogram (concentration read; 0 = a point mass)
const normEntropy = (h: readonly number[]): number => {
  let e = 0;
  for (const p of h) if (p > 0) e -= p * Math.log(p);
  return e / Math.log(N_BINS);
};

const summarise = (c: CensusOut) => {
  const M = c.moments;

  // --- (i) station-family moment shares BY ROLE ---
  const roleTotals = Object.fromEntries(ROLE_AXIS.map((role) => [role, M.filter((r) => r.role === role).length]));
  const roleShare = Object.fromEntries(ROLE_AXIS.map((role, i) => [role, clusterBootstrap(M, roleShareStat(role), 1 + i)]));
  const perContextShare = Object.fromEntries(CONTEXTS.map((ctx, ci) => {
    const rs = M.filter((r) => r.context === ctx);
    return [ctx, {
      n: rs.length,
      share: Object.fromEntries(ROLE_AXIS.map((role, i) => [role, clusterBootstrap(rs, roleShareStat(role), 10 + ci * 4 + i)])),
    }];
  }));

  // --- (ii) per-(context x role) coverage table vs the 150 floor at 388 ---
  const cellN = Object.fromEntries(CELLS.map((cell) => [cell, M.filter((r) => cellKey(r.context, r.role) === cell).length]));
  const cellTable: Record<string, Record<string, { n: number; perMatch: number; verdict: string }>> = {};
  let clears300 = 0; let clears150only = 0; let under150 = 0;
  for (const ctx of CONTEXTS) {
    cellTable[ctx] = {};
    for (const role of ROLE_AXIS) {
      const n = cellN[cellKey(ctx, role)];
      const verdict = n >= 300 ? 'clears300' : n >= 150 ? 'clears150' : 'under150';
      if (verdict === 'clears300') clears300 += 1;
      else if (verdict === 'clears150') clears150only += 1;
      else under150 += 1;
      cellTable[ctx][role] = { n, perMatch: round(n / CENSUS_MATCHES, 4), verdict };
    }
  }
  // per-context role-starvation check: how many roles clear 150
  const perContextCoverage = Object.fromEntries(CONTEXTS.map((ctx) => {
    const rolesAt150 = ROLE_AXIS.filter((role) => cellN[cellKey(ctx, role)] >= 150);
    const rolesAt300 = ROLE_AXIS.filter((role) => cellN[cellKey(ctx, role)] >= 300);
    return [ctx, { rolesClearing150: rolesAt150.length, rolesClearing300: rolesAt300.length, roles150: rolesAt150 }];
  }));
  const contextsWith2plus = Object.values(perContextCoverage).filter((v) => v.rolesClearing150 >= 2).length;
  // the four ex-ante under-powered cells (§3), confirmed or corrected BY MEASUREMENT
  const PREPUBLISHED_UNDERPOWERED = [
    'ours|theirThird|crowded||DF', 'theirs|theirThird|crowded||DF',
    'theirs|ownThird|sparse||DF', 'theirs|ownThird|sparse||MF',
  ];
  const preRegisteredExpected: Record<string, number> = {
    'ours|theirThird|crowded||DF': 49.2, 'theirs|theirThird|crowded||DF': 126.8,
    'theirs|ownThird|sparse||DF': 131.9, 'theirs|ownThird|sparse||MF': 147.4,
  };
  const underPoweredCheck = PREPUBLISHED_UNDERPOWERED.map((cell) => {
    const n = cellN[cell];
    const measuredVerdict = n >= 300 ? 'clears300' : n >= 150 ? 'clears150' : 'under150';
    return {
      cell, preRegExpectedAt388: preRegisteredExpected[cell], measuredN: n,
      measuredVerdict, confirmed: measuredVerdict === 'under150',
    };
  });
  // any OTHER cell that landed under 150 but was NOT pre-published (a correction)
  const unexpectedUnderPowered = CELLS.filter(
    (cell) => cellN[cell] < 150 && !PREPUBLISHED_UNDERPOWERED.includes(cell),
  ).map((cell) => ({ cell, measuredN: cellN[cell] }));
  const rarestCell = CELLS.reduce((a, b) => (cellN[a] <= cellN[b] ? a : b));

  // --- (iii) the incumbent role signature ---
  const roleSignature = Object.fromEntries(ROLE_AXIS.map((role) => {
    const h = histFor(M, role);
    const n = roleTotals[role];
    const ranked = h.map((p, i) => ({ bin: binId(i), share: round(p, 4) }))
      .sort((a, b) => b.share - a.share);
    return [role, {
      n,
      modal: ranked[0].bin, modalShare: ranked[0].share,
      top3: ranked.slice(0, 3),
      outsideLatticeShare: round(h[OUTSIDE_BIN], 4),
      normalizedEntropy: round(normEntropy(h), 4),
    }];
  }));
  // pairwise TV distances between role histograms, with cluster CIs
  const rolePairs: Array<[Role, Role]> = [];
  for (let i = 0; i < ROLE_AXIS.length; i++) for (let j = i + 1; j < ROLE_AXIS.length; j++) rolePairs.push([ROLE_AXIS[i], ROLE_AXIS[j]]);
  const tvDistances = Object.fromEntries(rolePairs.map(([ra, rb], k) => [
    `${ra}|${rb}`, clusterBootstrap(M, tvStat(ra, rb), 200 + k),
  ]));
  const tvPoints = rolePairs.map(([ra, rb]) => tvDistances[`${ra}|${rb}`].point);
  const tvMin = Math.min(...tvPoints);
  const tvMean = round(mean(tvPoints), 4);

  // --- (iv) the census-budget power arithmetic (re-measured on the 9.11M block) ---
  const cellPerMatch = Object.fromEntries(CELLS.map((cell) => [cell, cellN[cell] / CENSUS_MATCHES]));
  const perContextRank = CONTEXTS.map((ctx) => {
    const ranked = ROLE_AXIS.map((role) => ({ role, perMatch: cellPerMatch[cellKey(ctx, role)] }))
      .sort((a, b) => b.perMatch - a.perMatch);
    return { context: ctx, richest: ranked[0], secondRichest: ranked[1] };
  });
  const bindingContext = perContextRank.reduce((a, b) => (a.secondRichest.perMatch <= b.secondRichest.perMatch ? a : b));
  const bindingCell = cellKey(bindingContext.context, bindingContext.secondRichest.role);
  const bindingRate = bindingContext.secondRichest.perMatch;
  // cluster CI on the binding rate = per-match count of the binding cell. The
  // cluster bootstrap draws exactly CENSUS_MATCHES clusters (with replacement) each
  // resample, so the per-match rate is hits / CENSUS_MATCHES — NOT hits / (distinct
  // cluster ids), which would under-count the denominator when a cluster is drawn
  // twice and inflate the rate. On the full sample this is cellN[bindingCell]/388.
  const bindingRateStat = (rs: readonly MomentAgg[]): number => {
    if (rs.length === 0) return Number.NaN;
    let hits = 0;
    for (const r of rs) if (cellKey(r.context, r.role) === bindingCell) hits += 1;
    return hits / CENSUS_MATCHES;
  };
  const bindingRateCI = clusterBootstrap(M, bindingRateStat, 300);
  const matchesForFloor = bindingRate > 0 ? Math.ceil((CELL_FLOOR * HEADROOM) / bindingRate) : null;
  const matchesForBare = bindingRate > 0 ? Math.ceil(CELL_FLOOR / bindingRate) : null;
  const rowsPerMatchMean = M.length / CENSUS_MATCHES;

  return {
    headline: {
      moments: M.length,
      rowsPerMatch: round(rowsPerMatchMean, 3),
      roleTotals,
      roleShare,
      tvMin: round(tvMin, 4),
      tvMean,
    },
    deliverableI_roleShares: {
      note: 'station-family moment shares by role {DF,MF,WG,ST}, overall + per context, cluster CIs (#20).',
      roleTotals, roleShare, perContext: perContextShare,
    },
    deliverableII_coverage: {
      note: 'per-(context x role) coverage vs the 150 floor at the frozen 388-match budget; '
        + 'the four ex-ante under-powered cells confirmed/corrected by measurement; per-context role-starvation check.',
      cellFloor: CELL_FLOOR, headroom: HEADROOM, budgetMatches: CENSUS_MATCHES, totalCells: CELLS.length,
      clears300, clears150only, under150,
      perContextCoverage, contextsWith2plusRolesAt150: contextsWith2plus,
      underPoweredCheck, unexpectedUnderPowered, rarestCell, rarestCount: cellN[rarestCell],
      cellTable,
    },
    deliverableIII_incumbentSignature: {
      note: 'per-role histogram over the 18 lattice cells (+ outside-lattice) of the incumbent\'s own '
        + 'ball-local station target (formationSpot, hasBall=false, on a clone); pairwise TV distances — the R3 input.',
      roleSignature, tvDistances, tvMin: round(tvMin, 4), tvMean,
    },
    deliverableIV_budget: {
      note: 'the census-budget power arithmetic re-measured on the 9.11M block, cluster CI on the binding rate.',
      formula: 'matches_needed(cell) = ceil((150 x headroom) / rows_per_match(cell)); '
        + 'binding cell = argmin over contexts of the 2nd-richest role rate.',
      bindingContext: bindingContext.context, bindingRole: bindingContext.secondRichest.role,
      bindingCell, bindingRatePerMatch: round(bindingRate, 4), bindingRateCI,
      matchesForBare150: matchesForBare, matchesForFloor,
      momentBudgetBare150: matchesForBare === null ? null : Math.round(matchesForBare * rowsPerMatchMean),
      momentBudget2x: matchesForFloor === null ? null : Math.round(matchesForFloor * rowsPerMatchMean),
      confirms388: matchesForFloor === 388,
    },
  };
};

// --- the R3 pre-laid kill reading (§6) ---------------------------------------
// R3 fires if the incumbent's per-role deviation-mixes are ALREADY near-disjoint —
// each role's histogram concentrated on distinct modes, pairwise TV near 1 — because
// then formationSpot already breaks symmetry by role and the eye has nothing to add.
// It is a FLAG for the commander's review (it does not stop V3-P0, which prices
// nothing). Thresholds registered here so the reading is not pre-judged by sight.
const R3_TV_NEAR_ONE = 0.85;   // pairwise TV "near 1" — already-separated frontier
const readR3 = (tvMin: number, tvMean: number): { fired: boolean; verdict: string } => {
  const fired = tvMin >= R3_TV_NEAR_ONE;
  return {
    fired,
    verdict: fired
      ? `R3 FIRED — the incumbent ALREADY role-separates near-completely (min pairwise TV ${round(tvMin, 4)} >= ${R3_TV_NEAR_ONE}); `
        + 'formationSpot breaks symmetry by role on its own — a role-conditioned census would re-price what the incumbent already does. '
        + 'THE FORK RETURNS TO THE COMMANDER before V3-P1 spends its budget.'
      : `R3 NOT fired — role histograms overlap (min pairwise TV ${round(tvMin, 4)} < ${R3_TV_NEAR_ONE}, mean ${round(tvMean, 4)}); `
        + 'the incumbent does NOT already role-separate completely — a role-conditioned census can still SEE division of labour to add.',
  };
};

// --- run: X-DET double run + canonical SHA (§5) ------------------------------
const first = runCensus();
const firstSummary = summarise(first);
const second = runCensus();
const secondSummary = summarise(second);
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(firstSummary) === canonical(secondSummary);
const sha256 = createHash('sha256').update(canonical(firstSummary)).digest('hex');
const tableSha = createHash('sha256').update(canonical(firstSummary.deliverableII_coverage.cellTable)).digest('hex');
const sigSha = createHash('sha256').update(canonical(firstSummary.deliverableIII_incumbentSignature.roleSignature)).digest('hex');

const r3 = readR3(firstSummary.headline.tvMin, firstSummary.headline.tvMean);

const gates = {
  xDet: deterministic,
  xClone: first.cloneChecked > 0 && first.cloneMismatched === 0,
  xFid: first.ledger.unexplained === 0,
  cloneCoverage: first.clonesTaken === first.ledger.rows,
  clonesTaken: first.clonesTaken, cloneChecked: first.cloneChecked, cloneMismatched: first.cloneMismatched,
};
const gatesPass = gates.xDet && gates.xClone && gates.xFid && gates.cloneCoverage;
const verdict = gatesPass
  ? (r3.fired ? 'GATES PASS · R3 FIRED (fork returns to the commander)' : 'GATES PASS · R3 clear (map is rich for V3-P1)')
  : 'GATES FAIL';

const output = {
  experiment: 'STAGE3-V3-P0 (the role base-rate and power map)',
  authority: 'STAGE3-V3-P0-ROLE-MAP (contract §4; #77/#78)',
  head: '49ba867 (v3 design contract)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  parameters: {
    seedStart: CENSUS_SEED_START, matches: CENSUS_MATCHES,
    block: `${CENSUS_SEED_START}..${CENSUS_SEED_START + CENSUS_MATCHES - 1}`,
    momentSpacingS: MOMENT_SPACING_S, roleAxis: ROLE_AXIS, contexts: CONTEXTS,
    lattice: LATTICE.map((c) => c.id), outsideLatticeM: OUTSIDE_LATTICE_M,
    cellFloor: CELL_FLOOR, headroom: HEADROOM,
    clusterUnit: 'match seed', bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
    r3TvNearOne: R3_TV_NEAR_ONE,
  },
  ...firstSummary,
  r3reading: r3,
  ledger: {
    qualifying: first.ledger.qualifying, rows: first.ledger.rows,
    ballDirectedSkipped: first.ledger.ballDirectedSkipped, noPool: first.ledger.noPool,
    eSentOff: first.ledger.eSentOff, unexplained: first.ledger.unexplained,
    receiptCounts: first.ledger.receiptCounts,
    receiptsSample: first.ledger.receipts.slice(0, 20),
  },
  gates,
  deterministic, tableSha, sigSha, sha256, verdict,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const h = firstSummary.headline;
console.error(
  `V3-P0 ${verdict}`
  + ` · ${CENSUS_MATCHES} matches · moments ${h.moments} (${h.rowsPerMatch}/match)`
  + ` · roleShare DF ${pct(h.roleShare.DF.point)} MF ${pct(h.roleShare.MF.point)} WG ${pct(h.roleShare.WG.point)} ST ${pct(h.roleShare.ST.point)}`
  + ` · coverage ${firstSummary.deliverableII_coverage.clears300}/${firstSummary.deliverableII_coverage.clears150only}/${firstSummary.deliverableII_coverage.under150} (300/150/under)`
  + ` · ctx>=2roles ${firstSummary.deliverableII_coverage.contextsWith2plusRolesAt150}/12`
  + ` · TV min ${h.tvMin} mean ${h.tvMean}`
  + ` · binding ${firstSummary.deliverableIV_budget.bindingCell}=${firstSummary.deliverableIV_budget.bindingRatePerMatch}/match → ${firstSummary.deliverableIV_budget.matchesForFloor}m`
  + ` · ${r3.fired ? 'R3 FIRED' : 'R3 clear'}`
  + ` · X-CLONE ${first.cloneChecked}/${first.cloneMismatched} · unexpl ${first.ledger.unexplained} · det ${deterministic}`
  + ` · SHA ${sha256}`,
);
