// STAGE III V2-P2 — PRE-FREEZE SIZING SMOKE (read-only, zero src/**)
//
// Authority: docs/world-model/STAGE3-V2-P2-CONSUMER.md (the freeze this smoke
// sizes) · #44.5/#65 (sizing before floors — and for a CONSUMER stage the floor
// is on the PERCEIVED-attainable population, the #65 lesson in gate form) ·
// #46.2 (smoke seeds DISJOINT from the payoff block) · #24 (population floors) ·
// STAGE3-V2-P0-WEDGE-MAP §9.5 (the two repairs this smoke re-confirms on a fresh
// disjoint block) · STAGE3-V2-P1-ANTICIPATORY-CENSUS (the committed table + the
// 151 in-power cells the consumer is eligible on) · STAGE3-P1R-APPROACH-CENSUS
// (the moment instrument reused verbatim).
//
// WHY A SMOKE AT ALL: V2-P1's DORMANT-EYE (v1 P2) FAILED DEV because the floor's
// DENOMINATOR counted structural abstentions (no-owner in flight + cold
// no-snapshot). #70.3 binds DEV on the PERCEIVED-attainable population. This
// smoke measures, on a DISJOINT block above 8.9M, (a) moments/match (the payoff
// budget), (b) the perceived-attainable share = the DEV denominator after the two
// §2 repairs (in-flight FACE recovery + percept warm-up), (c) the perceived
// OTHERS-GOING rate (the deviation discount vs the TRUE-keyed table), and
// (d) per-context in-power coverage (every context carries eligible cells — the
// v1 no-cell corner is measured, not assumed). It FORKS NOTHING (every read is a
// pre-fork read off a pristine clone), prices nothing (Road B), touches zero src.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
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

// --- frozen smoke parameters (disjoint above V2-P1's 8.80/8.81M) -------------
const MATCH_DURATION = 240;
const SMOKE_SEED_START = 8_900_000;                       // #46.2 disjoint block, above 8.9M
const SMOKE_MATCHES = envInt('V2P2_SMOKE_MATCHES', 150);  // read-only, no forks
const MOMENT_SPACING_S = 2.0;                             // P1R §3.4 verbatim
const R_M = 4.0;                                          // V2-P0 §2.1, FROZEN
const W_S = 3.0;                                          // P1R §2.3
const CELL_FLOOR = 150;                                   // #24
const TABLE_PATH = 'docs/world-model/data/stage3-v2-p1-anticipatory-table.json';
const OUT_PATH = process.env.V2P2_SMOKE_OUT
  ?? 'docs/world-model/data/stage3-v2-p2-sizing.json';

/** The enriched consumer world (#67.3: the full certified bundle; V2-P1 verbatim). */
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

// --- the committed V2-P1 table: which (ctx, cand) contrasts are IN-POWER -----
// The consumer is ELIGIBLE on a candidate iff its contrast is in-power (both
// going splits >= 150; #70.3 / the DESIGN CORE). Load the frozen table's
// perCell in-power flags — the eye's eligible set, exactly as it will consume.
interface InPowerSet { has(ctx: string, cand: string): boolean; perContext: Map<string, number> }
const loadInPower = (): InPowerSet => {
  const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
    tableSha: string;
    primaryContrast: { perCell: { context: string; cand: string; inPower: boolean }[] };
  };
  const set = new Set<string>();
  const perContext = new Map<string, number>();
  for (const c of raw.primaryContrast.perCell) {
    if (c.inPower) {
      set.add(`${c.context}||${c.cand}`);
      perContext.set(c.context, (perContext.get(c.context) ?? 0) + 1);
    }
  }
  return {
    has: (ctx, cand) => set.has(`${ctx}||${cand}`),
    perContext,
  };
};
const IN_POWER = loadInPower();
const TABLE_SHA = (JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as { tableSha: string }).tableSha;

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
  rows: number;                         // station-family qualifying moments (the decision unit)
  ballDirectedSkipped: number;
  qualifying: number;
  noPool: number;
  // perceived-attainable decomposition (the DEV denominator, #70.3)
  hasPercept: number;                   // repair 2 delivered: a snapshot exists
  noSnapshot: number;                   // warm-up residual: NEVER-SAW (out-of-range)
  perceivedAttainable: number;          // hasPercept AND context carries >=1 in-power cell
  noCell: number;                       // context has NO in-power candidate (the v1 corner)
  // in-flight FACE repair (repair 1), a per-playing-tick tally, V2-P0 §9.5 form
  inflightTotal: number;
  inflightNoOwner: number;
  inflightRecovered: number;
  // per-context population + perceived going rate (the deviation discount)
  perContextN: Map<string, number>;
  perceivedGoingRows: number;           // rows with a percept, summed over candidates
  perceivedGoingBits: number;           // perceived someone-going bits (sum over candidates)
  trueGoingBits: number;                // TRUE someone-going bits (sum over candidates)
  wedgeAgree: number;                   // per-candidate perceived==true agreement
  wedgePairs: number;
  cellTrueGoing: Map<string, number>;   // (ctx||cand) TRUE someone-going count (for #24 budget)
}
const newOut = (): SmokeOut => ({
  rows: 0, ballDirectedSkipped: 0, qualifying: 0, noPool: 0,
  hasPercept: 0, noSnapshot: 0, perceivedAttainable: 0, noCell: 0,
  inflightTotal: 0, inflightNoOwner: 0, inflightRecovered: 0,
  perContextN: new Map(), perceivedGoingRows: 0, perceivedGoingBits: 0,
  trueGoingBits: 0, wedgeAgree: 0, wedgePairs: 0, cellTrueGoing: new Map(),
});

/** Read ONE moment off a pristine clone: TRUE context, perceived+true going bits, coverage. */
function processMoment(m: Match, side: number, liveBody: Player, owner: Player, out: SmokeOut): void {
  const clone = cloneSimulationState(m);
  const mine = clone.teams[side];
  const body = clone.allPlayers.find((p) => p.gid === liveBody.gid)!;
  const gkGid = mine.goalkeeper.gid;
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

  // no-cell: does this context carry ANY in-power candidate? (v1's failing corner)
  const contextHasCell = (IN_POWER.perContext.get(context) ?? 0) > 0;
  if (!contextHasCell) out.noCell += 1;

  // the body's own perceived snapshot — the remembered velocity path (#67.2),
  // naturally warmed (the body has played the whole match >> WARMUP_TICKS).
  const snap = clone.perceivedSnapshot(body);
  const hasPercept = snap !== null && snap.players.some((o) => o.side === body.side && o.gid !== body.gid && o.gid !== gkGid);
  if (hasPercept) out.hasPercept += 1; else out.noSnapshot += 1;
  // perceived-attainable: a percept exists AND the context carries an eligible cell.
  if (hasPercept && contextHasCell) out.perceivedAttainable += 1;

  const perc = new Map<number, { px: number; py: number; vx: number; vy: number }>();
  if (snap !== null) {
    for (const o of snap.players) {
      if (o.side !== body.side || o.gid === body.gid || o.gid === gkGid) continue;
      perc.set(o.gid, { px: o.pos.x, py: o.pos.y, vx: o.vel.x, vy: o.vel.y });
    }
  }

  const ball = clone.ball.pos;
  if (hasPercept) out.perceivedGoingRows += 1;
  for (const cand of LATTICE) {
    const cx = ball.x + mine.attackDir * cand.dx;
    const cy = ball.y + cand.dy;
    let trueBit = 0;
    for (const t of teammates) {
      if (dist(t.pos.x + t.vel.x * W_S, t.pos.y + t.vel.y * W_S, cx, cy) <= R_M) { trueBit = 1; break; }
    }
    let percBit = 0;
    for (const [, o] of perc) {
      if (dist(o.px + o.vx * W_S, o.py + o.vy * W_S, cx, cy) <= R_M) { percBit = 1; break; }
    }
    out.trueGoingBits += trueBit;
    const key = cellKey(context, cand.id);
    out.cellTrueGoing.set(key, (out.cellTrueGoing.get(key) ?? 0) + trueBit);
    if (hasPercept) {
      out.perceivedGoingBits += percBit;
      out.wedgePairs += 1;
      if (trueBit === percBit) out.wedgeAgree += 1;
    }
  }
}

const runSmoke = (): SmokeOut => {
  const out = newOut();
  let rotation = 0;
  for (let k = 0; k < SMOKE_MATCHES; k++) {
    const m = matchOf(SMOKE_SEED_START + k);
    let lastMomentTime = -Infinity;
    let lastOwnerSide: number | null = null;
    while (!m.finished) {
      // in-flight FACE repair tally (repair 1), a per-playing-tick measure (V2-P0 §9.5)
      if (m.phase === 'playing') {
        out.inflightTotal += 1;
        if (m.ball.owner === null) {
          out.inflightNoOwner += 1;
          if (lastOwnerSide !== null) out.inflightRecovered += 1;
        }
      }
      if (m.ball.owner !== null) lastOwnerSide = m.ball.owner.side;

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
          if (!body.sentOff && STATION_FAMILY.has(body.action.type)) processMoment(m, side, body, owner!, out);
          else if (!body.sentOff) out.ballDirectedSkipped += 1;
        }
      }
      m.step(DT);
    }
  }
  return out;
};

// --- derive the DEV floor + the payoff moment budget -------------------------
const summarise = (c: SmokeOut) => {
  const totalMoments = c.rows;
  const momentsPerMatch = totalMoments / SMOKE_MATCHES;
  const perceivedAttainableShare = totalMoments === 0 ? 0 : c.perceivedAttainable / totalMoments;
  const hasPerceptShare = totalMoments === 0 ? 0 : c.hasPercept / totalMoments;
  const noCellShare = totalMoments === 0 ? 0 : c.noCell / totalMoments;
  const inflightNoOwnerShare = c.inflightTotal === 0 ? 0 : c.inflightNoOwner / c.inflightTotal;
  const inflightRecovery = c.inflightNoOwner === 0 ? 1 : c.inflightRecovered / c.inflightNoOwner;
  const trueGoingRate = c.rows === 0 ? 0 : c.trueGoingBits / (c.rows * LATTICE.length);
  const perceivedGoingRate = c.wedgePairs === 0 ? 0 : c.perceivedGoingBits / c.wedgePairs;
  const wedgeAgreement = c.wedgePairs === 0 ? 0 : c.wedgeAgree / c.wedgePairs;
  const wedgeRatio = trueGoingRate === 0 ? 0 : perceivedGoingRate / trueGoingRate;

  // per-context population + in-power coverage
  const perContext = CONTEXTS.map((ctx) => ({
    context: ctx,
    n: c.perContextN.get(ctx) ?? 0,
    share: round((c.perContextN.get(ctx) ?? 0) / (totalMoments || 1), 5),
    inPowerCandidates: IN_POWER.perContext.get(ctx) ?? 0,
  }));

  return {
    smokeMatches: SMOKE_MATCHES,
    seedBlock: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
    totalMoments, momentsPerMatch: round(momentsPerMatch, 3),
    qualifying: c.qualifying, ballDirectedSkipped: c.ballDirectedSkipped,
    ballDirectedShare: round(c.ballDirectedSkipped / (c.qualifying || 1), 4),
    noPool: c.noPool,
    perceivedAttainable: {
      note: 'the DEV denominator (#70.3): a percept exists AND the context carries an in-power cell',
      perceivedAttainableShare: round(perceivedAttainableShare, 4),
      hasPerceptShare: round(hasPerceptShare, 4),
      noSnapshotShare: round(1 - hasPerceptShare, 4),
      noCellShare: round(noCellShare, 4),
    },
    repairs: {
      inflightNoOwnerShare: round(inflightNoOwnerShare, 4),
      inflightRecovery: round(inflightRecovery, 4),
      note: 'repair 1 (in-flight FACE): recovery = share of no-owner ticks with a retained last-perceived owner',
    },
    wedge: {
      trueGoingRate: round(trueGoingRate, 4),
      perceivedGoingRate: round(perceivedGoingRate, 4),
      wedgeRatio: round(wedgeRatio, 4),
      agreement: round(wedgeAgreement, 4),
      note: 'perceived vs TRUE OTHERS-GOING; the deviation discount vs the TRUE-keyed table',
    },
    perContext,
    everyContextHasCell: perContext.every((p) => p.inPowerCandidates > 0),
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
  experiment: 'STAGE3-V2-P2 (pre-freeze sizing smoke)',
  authority: 'STAGE3-V2-P2-CONSUMER · #44.5/#65 (DEV on perceived-attainable) · #46.2 · #24',
  head: 'c5f2913 (ruling #68; src identical to V2-P0 HEAD 92876e5 / V2-P1)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  consumedTableSha: TABLE_SHA,
  parameters: {
    seedStart: SMOKE_SEED_START, matches: SMOKE_MATCHES,
    regionRadiusM: R_M, advanceHorizonS: W_S, momentSpacingS: MOMENT_SPACING_S,
    cellFloor: CELL_FLOOR,
    lattice: LATTICE.map((cd) => cd.id), contexts: CONTEXTS,
    note: 'read-only, forks NOTHING; the perceived-attainable population sizing for DEV (#70.3)',
  },
  ...s1,
  deterministic,
  sha256,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

console.error(
  `V2-P2 SIZING SMOKE · ${SMOKE_MATCHES} matches · moments ${s1.totalMoments} (${s1.momentsPerMatch}/match)`
  + ` · perceived-attainable ${(s1.perceivedAttainable.perceivedAttainableShare * 100).toFixed(2)}%`
  + ` · no-snapshot ${(s1.perceivedAttainable.noSnapshotShare * 100).toFixed(2)}%`
  + ` · in-flight recovery ${(s1.repairs.inflightRecovery * 100).toFixed(2)}%`
  + ` · perc going ${(s1.wedge.perceivedGoingRate * 100).toFixed(2)}% (true ${(s1.wedge.trueGoingRate * 100).toFixed(2)}%, W_r ${s1.wedge.wedgeRatio})`
  + ` · everyCtxHasCell ${s1.everyContextHasCell} · det ${deterministic} · SHA ${sha256}`,
);
