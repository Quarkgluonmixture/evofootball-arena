// STAGE III V2-P1 — PRE-FREEZE SIZING SMOKE (read-only, zero src/**)
//
// Authority: docs/world-model/STAGE3-V2-P1-ANTICIPATORY-CENSUS.md (the freeze
// this smoke sizes) · #24 (population floors) · #44.5/#65 (sizing before floors —
// the law of the land) · #46.2 (smoke seeds DISJOINT from the census block) ·
// STAGE3-V2-P0-WEDGE-MAP.md §3/§9 (V2-P0 is the read-only base-rate instrument
// this smoke re-confirms on a FRESH disjoint block) · STAGE3-P1R-APPROACH-CENSUS
// (the moment instrument reused verbatim).
//
// WHY A SMOKE AT ALL: V2-P0 measured the TRUE OTHERS-GOING base rates on the
// 8.71M census block. V2-P1's split floors bind on the DISJOINT 8.81M block
// (#46.2 forbids sizing on the seeds a floor is applied to). This smoke confirms
// (a) moments/match and per-context shares and (b) the per-(context,candidate)
// TRUE someone-going rates TRANSFER to the fresh 8.80M block, then DERIVES the
// V2-P1 moment budget from the binding hypothesis-carrying cell (the peak-rate
// candidate of the rarest context). It FORKS NOTHING, reads every value off a
// pristine clone, and prices nothing (Road B).
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { HALF_L, DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen smoke parameters (disjoint above V2-P0's 8.71M census) -----------
const MATCH_DURATION = 240;
const SMOKE_SEED_START = 8_800_000;                       // #46.2 disjoint block
const SMOKE_MATCHES = envInt('V2P1_SMOKE_MATCHES', 150);  // read-only, no forks
const MOMENT_SPACING_S = 2.0;                             // P1R §3.4 verbatim
const R_M = 4.0;                                          // V2-P0 §2.1, FROZEN
const W_S = 3.0;                                          // P1R §2.3
const CELL_FLOOR = 150;                                   // #24
const HEADROOM = 2;                                       // V2-P0 §3 "2× the measured" block-variation convention
const OUT_PATH = process.env.V2P1_SMOKE_OUT
  ?? 'docs/world-model/data/stage3-v2-p1-sizing.json';

/** The enriched census world (#67.3: the full certified bundle). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

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

const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const cellKey = (ctx: string, cand: string): string => `${ctx}||${cand}`;

interface SmokeOut {
  rows: number;                         // station-family moments (the fork unit)
  ballDirectedSkipped: number;
  qualifying: number;
  noPool: number;
  eNoSnapshot: number;
  perContextN: Map<string, number>;     // moments per context
  cellN: Map<string, number>;           // (ctx||cand) rows (== perContextN[ctx])
  cellTrueGoing: Map<string, number>;   // (ctx||cand) TRUE someone-going count
}
const newOut = (): SmokeOut => ({
  rows: 0, ballDirectedSkipped: 0, qualifying: 0, noPool: 0, eNoSnapshot: 0,
  perContextN: new Map(), cellN: new Map(), cellTrueGoing: new Map(),
});

/** Read ONE moment's TRUE OTHERS-GOING off a pristine clone (V2-P0 verbatim, TRUE side only). */
function processMoment(m: Match, side: number, liveBody: Player, owner: Player, out: SmokeOut): void {
  const clone = cloneSimulationState(m);
  const mine = clone.teams[side];
  const body = clone.allPlayers.find((p) => p.gid === liveBody.gid)!;
  const face: Face = side === owner.side ? 'ours' : 'theirs';
  let near = 0;
  for (const q of mine.players) {
    if (q === body || q.role === 'GK' || q.sentOff) continue;
    if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
  }
  const context = contextKey(face, localXBand(mine.localX(clone.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');
  const teammates = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p.gid !== body.gid);

  out.rows += 1;
  out.perContextN.set(context, (out.perContextN.get(context) ?? 0) + 1);
  const ball = clone.ball.pos;
  for (const cand of LATTICE) {
    const cx = ball.x + mine.attackDir * cand.dx;
    const cy = ball.y + cand.dy;
    let trueGoers = 0;
    for (const t of teammates) {
      const ax = t.pos.x + t.vel.x * W_S;
      const ay = t.pos.y + t.vel.y * W_S;
      if (dist(ax, ay, cx, cy) <= R_M) { trueGoers += 1; break; }
    }
    const key = cellKey(context, cand.id);
    out.cellN.set(key, (out.cellN.get(key) ?? 0) + 1);
    out.cellTrueGoing.set(key, (out.cellTrueGoing.get(key) ?? 0) + (trueGoers > 0 ? 1 : 0));
  }
}

const runSmoke = (): SmokeOut => {
  const out = newOut();
  let rotation = 0;
  for (let k = 0; k < SMOKE_MATCHES; k++) {
    const m = matchOf(SMOKE_SEED_START + k);
    let lastMomentTime = -Infinity;
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (qualifies) {
        out.qualifying += 1;
        lastMomentTime = m.simTime;
        const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
        const mine = m.teams[side];
        const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
        if (pool.length === 0) out.noPool += 1;
        else {
          const body = pool[Math.floor(rotation / 2) % pool.length];
          rotation += 1;
          if (body.sentOff) out.eNoSnapshot += 1;
          else if (!STATION_FAMILY.has(body.action.type)) out.ballDirectedSkipped += 1;
          else processMoment(m, side, body, owner!, out);
        }
      }
      m.step(DT);
    }
  }
  return out;
};

// --- derive the V2-P1 moment budget from the binding hypothesis-carrying cell -
const summarise = (c: SmokeOut) => {
  const totalMoments = c.rows;
  const momentsPerMatch = totalMoments / SMOKE_MATCHES;
  // per-context peak candidate (max TRUE someone-going rate) + its going=1 count.
  const perContext = CONTEXTS.map((ctx) => {
    const n = c.perContextN.get(ctx) ?? 0;
    let peak = { cand: '', rate: -1, tg: 0 };
    for (const cand of LATTICE) {
      const key = cellKey(ctx, cand.id);
      const cn = c.cellN.get(key) ?? 0;
      const tg = c.cellTrueGoing.get(key) ?? 0;
      const rate = cn === 0 ? 0 : tg / cn;
      if (rate > peak.rate) peak = { cand: cand.id, rate, tg };
    }
    // Moments needed for THIS context's peak going=1 cell to reach the target,
    // at the context's natural share: momentsNeeded = target / (share × peakRate).
    const share = totalMoments === 0 ? 0 : n / totalMoments;
    const per = share * peak.rate;                       // going=1 per census moment
    const need150 = per > 0 ? Math.ceil(CELL_FLOOR / per) : Number.POSITIVE_INFINITY;
    const need300 = per > 0 ? Math.ceil(CELL_FLOOR * HEADROOM / per) : Number.POSITIVE_INFINITY;
    return {
      context: ctx, n, share: round(share, 5),
      peakCand: peak.cand, peakRate: round(peak.rate, 4), peakGoing1AtSmoke: peak.tg,
      momentsFor150: need150, momentsFor300: need300,
    };
  });
  const finite = (xs: number[]) => xs.filter(Number.isFinite);
  const bind150 = Math.max(...finite(perContext.map((p) => p.momentsFor150)));
  const bind300 = Math.max(...finite(perContext.map((p) => p.momentsFor300)));
  const binder150 = perContext.find((p) => p.momentsFor150 === bind150)!;
  const binder300 = perContext.find((p) => p.momentsFor300 === bind300)!;

  return {
    smokeMatches: SMOKE_MATCHES, seedBlock: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
    totalMoments, momentsPerMatch: round(momentsPerMatch, 3),
    qualifying: c.qualifying, ballDirectedSkipped: c.ballDirectedSkipped,
    ballDirectedShare: round(c.ballDirectedSkipped / (c.qualifying || 1), 4),
    noPool: c.noPool, eNoSnapshot: c.eNoSnapshot,
    cellFloor: CELL_FLOOR, headroom: HEADROOM,
    perContext,
    binding: {
      rule: 'every context\'s peak-rate candidate going=1 cell clears the floor; binding = the max requirement',
      floor150: { moments: bind150, matches: Math.ceil(bind150 / momentsPerMatch), context: binder150.context, cand: binder150.peakCand, peakRate: binder150.peakRate },
      floor300: { moments: bind300, matches: Math.ceil(bind300 / momentsPerMatch), context: binder300.context, cand: binder300.peakCand, peakRate: binder300.peakRate },
    },
  };
};

const first = runSmoke();
const second = runSmoke();
const s1 = summarise(first);
const s2 = summarise(second);
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(s1) === canonical(s2);
const sha256 = createHash('sha256').update(canonical(s1)).digest('hex');

const output = {
  experiment: 'STAGE3-V2-P1 (pre-freeze sizing smoke)',
  authority: 'STAGE3-V2-P1-ANTICIPATORY-CENSUS · #24 · #44.5/#65 · #46.2',
  head: 'c5f2913 (ruling #68; src identical to V2-P0 HEAD 92876e5)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  parameters: {
    seedStart: SMOKE_SEED_START, matches: SMOKE_MATCHES,
    regionRadiusM: R_M, advanceHorizonS: W_S, momentSpacingS: MOMENT_SPACING_S,
    lattice: LATTICE.map((c) => c.id), contexts: CONTEXTS,
    motionSource: 'TRUE world velocity (the table is TRUE-keyed; #67.2/§2)',
  },
  ...s1,
  deterministic,
  sha256,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const b150 = s1.binding.floor150; const b300 = s1.binding.floor300;
console.error(
  `V2-P1 SIZING SMOKE · ${SMOKE_MATCHES} matches · moments ${s1.totalMoments} (${s1.momentsPerMatch}/match)`
  + ` · ballDirected ${(s1.ballDirectedShare * 100).toFixed(2)}%`
  + ` · BIND(150) ${b150.moments} moments / ${b150.matches} matches (${b150.context} ${b150.cand} r=${b150.peakRate})`
  + ` · BIND(300,2×) ${b300.moments} moments / ${b300.matches} matches (${b300.context} ${b300.cand})`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
