// Stage III V2-P0 — THE WEDGE AND THE BASE-RATE MAP: READ-ONLY SIZING SMOKE
// (docs/world-model/STAGE3-V2-P0-WEDGE-MAP.md §5, invariant I7; #24 / #46.2 /
//  #44.5/#65 "sizing before floors").
//
// V2-P0's base-rate map (deliverable (i)) conditions on the SAME station-family
// moment population the P1R/P1-P2 instrument sampled, amended per the v2 contract
// §2 — but on the ENRICHED world (c6Carry + c7Windup + the certified EDS bundle,
// the C5-recensus/C5-T2 §0.1 precedent). #24's 150-per-cell floor and the census
// match count must therefore derive from a DISCLOSED read-only smoke of the
// CONDITIONING population as it stands on the enriched world, with seeds disjoint
// from the census staging (#46.2). This smoke measures, over the disjoint block
// 8,700,000.. , the station-family qualifying-moment yield PER (face x threat x
// density) context PER match, reusing P1R's classifier verbatim. It takes NO
// forks, computes NO OTHERS-GOING feature (that is the census's own deliverable),
// prices nothing, and changes no frozen quantity — counts only, #44.5 form.
//
// It is committed WITH the pre-registration, BEFORE any floor is frozen.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters --------------------------------------------------------
const MATCH_DURATION = 240;
const SMOKE_SEED_START = 8_700_000;                        // disjoint, above 8.6M (§5)
const SMOKE_MATCHES = envInt('V2P0_SMOKE_MATCHES', 48);    // C5-T2 smoke parity
const MOMENT_SPACING_S = 2.0;                              // P1R §3.4 verbatim
const CELL_FLOOR = 150;                                    // #24
const HEADROOM = 2;                                        // X6_FLOOR convention: 2x the measured
const OUT_PATH = process.env.V2P0_SMOKE_OUT
  ?? 'docs/world-model/data/stage3-v2-p0-sizing.json';

/** The enriched census world (§0.1, the C5-recensus / C5-T2 precedent). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

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
  byContext: Record<string, number>;
}

const runSmoke = () => {
  const rows: PerMatch[] = [];
  let rotation = 0;
  for (let seed = SMOKE_SEED_START; seed < SMOKE_SEED_START + SMOKE_MATCHES; seed++) {
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    const r: PerMatch = {
      seed, qualifying: 0, rows: 0, ballDirectedSkipped: 0, noPool: 0,
      byContext: Object.fromEntries(CONTEXTS.map((c) => [c, 0])),
    };
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      r.qualifying += 1;
      lastMomentTime = m.simTime;
      // P1R §3.2/§3.4 verbatim: side alternates on the stable rotation, body is
      // picked by the same stable rotation (never proximity).
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
      r.rows += 1;
      r.byContext[context] += 1;
      m.step(DT);
    }
    rows.push(r);
  }

  const sum = (f: (r: PerMatch) => number) => rows.reduce((a, r) => a + f(r), 0);
  const totalRows = sum((r) => r.rows);
  const ctxTotals = Object.fromEntries(CONTEXTS.map((c) => [c, sum((r) => r.byContext[c])]));
  const ctxPerMatch = Object.fromEntries(CONTEXTS.map((c) => [c, round(mean(rows.map((r) => r.byContext[c])), 4)]));
  // The binding context is the RAREST — #24's floor must be met there.
  const rarest = CONTEXTS.reduce((a, b) => (ctxTotals[a] <= ctxTotals[b] ? a : b));
  const rarestPerMatch = (ctxPerMatch as Record<string, number>)[rarest];
  const matchesForFloor = rarestPerMatch > 0
    ? Math.ceil((CELL_FLOOR * HEADROOM) / rarestPerMatch) : null;
  return {
    experiment: 'STAGE3-V2-P0-SIZING-SMOKE',
    authority: 'STAGE3-V2-P0-WEDGE-MAP',
    world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off)',
    block: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
    matches: SMOKE_MATCHES,
    momentSpacingS: MOMENT_SPACING_S,
    cellFloor: CELL_FLOOR,
    headroom: HEADROOM,
    qualifyingTotal: sum((r) => r.qualifying),
    rowsTotal: totalRows,
    rowsPerMatch: { mean: round(mean(rows.map((r) => r.rows)), 3), min: Math.min(...rows.map((r) => r.rows)), max: Math.max(...rows.map((r) => r.rows)) },
    ballDirectedSkipped: sum((r) => r.ballDirectedSkipped),
    noPool: sum((r) => r.noPool),
    contextTotals: ctxTotals,
    contextPerMatch: ctxPerMatch,
    rarestContext: rarest,
    rarestPerMatch,
    sizing: {
      note: 'match count so the RAREST of the 12 conditioning contexts clears CELL_FLOOR x HEADROOM rows. '
        + 'The OTHERS-GOING binary SPLIT (someone-going sub-cells) is the census deliverable (i); its adequacy '
        + 'against #24 is REPORTED there and is the return-tooth B (§6).',
      matchesForFloor,
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

console.error(
  `V2-P0-SIZING-SMOKE · ${output.block} (${output.matches} matches)`
  + ` · rows ${output.rowsTotal} (${output.rowsPerMatch.mean}/match)`
  + ` · qualifying ${output.qualifyingTotal} · ballDirectedSkipped ${output.ballDirectedSkipped}`
  + ` · rarest ${output.rarestContext} = ${output.rarestPerMatch}/match`
  + ` · matchesForFloor(${CELL_FLOOR}x${HEADROOM}) ${output.sizing.matchesForFloor}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
