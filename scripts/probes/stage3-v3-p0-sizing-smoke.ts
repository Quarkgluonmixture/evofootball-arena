// Stage III V3-P0 — THE ROLE BASE-RATE AND POWER MAP: READ-ONLY SIZING SMOKE
// (docs/world-model/STAGE3-V3-P0-ROLE-MAP.md §3, contract §4 invariant I7; #24 /
//  #46.2 / #44.5/#65 "sizing before floors"; ruling #77).
//
// V3 adds a ROLE axis to the census table: cells key `context x ROLE x candidate`,
// role in {DF, MF, WG, ST} read from the SAMPLED body's own `role` field (GK never
// in the station family). The role axis PARTITIONS the station-family moment
// population ~4 ways (unevenly — the 6v6 roster starts DFx1, MFx1, WGx2, STx1, so
// WG carries ~2x the bodies BY CONSTRUCTION). #24 demands the per-(context x role)
// attainable population be measured EX ANTE, and the census budget derived from it,
// on seeds DISJOINT from the census staging (#46.2).
//
// Because every census moment forks ALL 18 candidates (the P1R instrument), a
// `(context, role, candidate)` cell's n = the number of station-family MOMENTS in
// `(context, role)` — the candidate axis does NOT divide n. So the #24 floor binds
// on MOMENTS-PER-(context x role), which is exactly what this smoke measures.
//
// It reuses the P1R/V2-P0 classifier VERBATIM (contexts, station family, 2 s
// spacing, stable side+body rotation), on the ENRICHED world (the #67.3 full
// bundle). It takes NO forks, computes NO candidate value, prices nothing, and
// changes no frozen quantity — counts only, #44.5 form. Committed WITH the
// pre-registration, BEFORE any floor is frozen.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters --------------------------------------------------------
const MATCH_DURATION = 240;
const SMOKE_SEED_START = 9_100_000;                        // disjoint, above 9.01M (V2-P2R payoff)
const SMOKE_MATCHES = envInt('V3P0_SMOKE_MATCHES', 150);   // V2-P1-sizing parity (a split needs a fuller smoke)
const MOMENT_SPACING_S = 2.0;                              // P1R §3.4 verbatim
const CELL_FLOOR = 150;                                    // #24
const HEADROOM = 2;                                        // X6_FLOOR convention: 2x the measured
const OUT_PATH = process.env.V3P0_SMOKE_OUT
  ?? 'docs/world-model/data/stage3-v3-p0-sizing.json';

/** The enriched census world (#67.3 full bundle; the C5-recensus / C5-T2 precedent). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

// --- the role axis (contract §2): read from the sampled body, GK never here -----
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];

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
const mean = (xs: number[]): number => (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : NaN);

interface PerMatch {
  seed: number;
  qualifying: number;         // playing moments with an owner at 2 s spacing
  rows: number;               // station-family rows (the census's conditioning population)
  ballDirectedSkipped: number;
  noPool: number;
  byRole: Record<string, number>;
  byCell: Record<string, number>;   // (context x role)
}

const runSmoke = () => {
  const rows: PerMatch[] = [];
  let rotation = 0;
  for (let seed = SMOKE_SEED_START; seed < SMOKE_SEED_START + SMOKE_MATCHES; seed++) {
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    const r: PerMatch = {
      seed, qualifying: 0, rows: 0, ballDirectedSkipped: 0, noPool: 0,
      byRole: Object.fromEntries(ROLE_AXIS.map((x) => [x, 0])),
      byCell: Object.fromEntries(CELLS.map((c) => [c, 0])),
    };
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      r.qualifying += 1;
      lastMomentTime = m.simTime;
      // P1R §3.2/§3.4 verbatim: side alternates on the stable rotation, body is
      // picked by the same stable rotation (never proximity, never by role).
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => (
        p.role !== 'GK' && !p.sentOff && p !== owner
      ));
      if (pool.length === 0) { r.noPool += 1; m.step(DT); continue; }
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      if (!STATION_FAMILY.has(body.action.type)) { r.ballDirectedSkipped += 1; m.step(DT); continue; }
      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (Math.hypot(q.pos.x - body.pos.x, q.pos.y - body.pos.y) <= 9) near += 1;
      }
      const face: Face = side === owner!.side ? 'ours' : 'theirs';
      const context = contextKey(face, localXBand(mine.localX(m.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');
      const role = body.role as Role;               // OWN state: role is read, never authored (contract I8)
      r.rows += 1;
      r.byRole[role] += 1;
      r.byCell[cellKey(context, role)] += 1;
      m.step(DT);
    }
    rows.push(r);
  }

  const sum = (f: (r: PerMatch) => number) => rows.reduce((a, r) => a + f(r), 0);
  const totalRows = sum((r) => r.rows);
  const roleTotals = Object.fromEntries(ROLE_AXIS.map((x) => [x, sum((r) => r.byRole[x])]));
  const roleShare = Object.fromEntries(ROLE_AXIS.map(
    (x) => [x, round((roleTotals as Record<string, number>)[x] / totalRows, 4)],
  ));
  const cellTotals = Object.fromEntries(CELLS.map((c) => [c, sum((r) => r.byCell[c])]));
  const cellPerMatch = Object.fromEntries(CELLS.map((c) => [c, round(mean(rows.map((r) => r.byCell[c])), 4)]));

  // --- deliverable (iv): the census-budget power arithmetic --------------------
  // The census keys (context, role, candidate); each moment forks all 18
  // candidates, so a (context, role, candidate) cell's n = MOMENTS in (context,
  // role). The role-separation hypothesis (#77.3) needs, PER CONTEXT, >= 2 roles
  // each at >= 150 (a contrast needs two ends). The load-bearing binding cell is
  // therefore the SECOND-richest role of the SPARSEST-in-its-2nd-role context.
  // Contexts whose 2nd-richest role cannot reach 150 are ROLE-STARVED — they
  // cannot host the role contrast — and are named ex ante.
  const perContext = CONTEXTS.map((ctx) => {
    const ranked = ROLE_AXIS
      .map((role) => ({ role, perMatch: (cellPerMatch as Record<string, number>)[cellKey(ctx, role)] }))
      .sort((a, b) => b.perMatch - a.perMatch);
    return {
      context: ctx,
      ranked,
      richest: ranked[0],
      secondRichest: ranked[1],
    };
  });
  // The binding (context, role) cell = the smallest 2nd-richest-role rate across
  // the 12 contexts (the hardest contrast to power).
  const bindingContext = perContext.reduce(
    (a, b) => (a.secondRichest.perMatch <= b.secondRichest.perMatch ? a : b),
  );
  const bindingRate = bindingContext.secondRichest.perMatch;
  const matchesForFloor = bindingRate > 0 ? Math.ceil((CELL_FLOOR * HEADROOM) / bindingRate) : null;
  const matchesForBare = bindingRate > 0 ? Math.ceil(CELL_FLOOR / bindingRate) : null;

  // rarest cell overall (may be a published-unattainable 3rd/4th-role cell)
  const rarestCell = CELLS.reduce((a, b) => (cellTotals[a] <= cellTotals[b] ? a : b));

  // attainability preview at the derived 2x-headroom budget: which cells clear
  // 150 / 300 at `matchesForFloor` matches.
  const attainabilityAt = (matches: number) => Object.fromEntries(CELLS.map((c) => {
    const expected = (cellPerMatch as Record<string, number>)[c] * matches;
    return [c, { expected: round(expected, 1), clears150: expected >= 150, clears300: expected >= 300 }];
  }));

  return {
    experiment: 'STAGE3-V3-P0-SIZING-SMOKE',
    authority: 'STAGE3-V3-P0-ROLE-MAP (contract §4 V3-P0; #77)',
    world: 'ENRICHED (#67.3 full bundle: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off)',
    block: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
    matches: SMOKE_MATCHES,
    momentSpacingS: MOMENT_SPACING_S,
    cellFloor: CELL_FLOOR,
    headroom: HEADROOM,
    roleAxis: ROLE_AXIS,
    qualifyingTotal: sum((r) => r.qualifying),
    rowsTotal: totalRows,
    rowsPerMatch: {
      mean: round(mean(rows.map((r) => r.rows)), 3),
      min: Math.min(...rows.map((r) => r.rows)),
      max: Math.max(...rows.map((r) => r.rows)),
    },
    ballDirectedSkipped: sum((r) => r.ballDirectedSkipped),
    noPool: sum((r) => r.noPool),
    // deliverable (i): the four-way population split
    roleTotals,
    roleShare,
    // deliverable (ii): per-(context x role) coverage
    cellTotals,
    cellPerMatch,
    rarestCell,
    perContext: perContext.map((p) => ({
      context: p.context,
      ranked: p.ranked,
      richestRole: p.richest.role,
      secondRole: p.secondRichest.role,
      secondRatePerMatch: p.secondRichest.perMatch,
    })),
    // deliverable (iv): the power arithmetic
    sizing: {
      rule: 'census keys (context, role, candidate); each moment forks all 18 candidates, so a cell n = '
        + 'MOMENTS in (context, role). The role-separation hypothesis (#77.3) needs >= 2 roles at >= 150 '
        + 'PER CONTEXT; the binding load-bearing cell = the sparsest 2nd-richest-role across the 12 contexts. '
        + 'Contexts whose 2nd role cannot reach 150 are ROLE-STARVED and named ex ante; 3rd/4th-role cells '
        + 'below 150 are published UNDER-POWERED (#24), never pooled.',
      bindingContext: bindingContext.context,
      bindingRole: bindingContext.secondRichest.role,
      bindingRatePerMatch: bindingRate,
      matchesForBare150: matchesForBare,
      matchesForFloor,   // 2x headroom
      momentBudgetBare150: matchesForBare === null ? null : Math.round(matchesForBare * mean(rows.map((r) => r.rows))),
      momentBudget2x: matchesForFloor === null ? null : Math.round(matchesForFloor * mean(rows.map((r) => r.rows))),
      attainabilityAt2xBudget: matchesForFloor === null ? null : attainabilityAt(matchesForFloor),
    },
  };
};

const first = runSmoke();
const second = runSmoke();
const firstJson = JSON.stringify(first);
const deterministic = firstJson === JSON.stringify(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const cleared = output.sizing.matchesForFloor;
console.error(
  `V3-P0-SIZING-SMOKE · ${output.block} (${output.matches} matches)`
  + ` · rows ${output.rowsTotal} (${output.rowsPerMatch.mean}/match)`
  + ` · roleShare DF ${output.roleShare.DF} MF ${output.roleShare.MF} WG ${output.roleShare.WG} ST ${output.roleShare.ST}`
  + ` · binding ${output.sizing.bindingContext}||${output.sizing.bindingRole} = ${output.sizing.bindingRatePerMatch}/match`
  + ` · matchesForFloor(${CELL_FLOOR}x${HEADROOM}) ${cleared}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
