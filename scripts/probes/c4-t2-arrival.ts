// C4 T2-ARRIVAL Phase A — DOES THE BOX STOP EMPTYING, AND DOES IT BUY
// ATTACKING CONTESTS?
// Authority: docs/world-model/C4-T2-ARRIVAL.md (commander rulings #32.4, #33)
// Derives from the A0 census probe, whose classification and C2 ladder are the
// T0R/T1-FLIGHT ones verbatim, so every number is comparable to the banked
// baseline the 22.90% target was sized from.
//
// Three paired same-seed arms on one fresh block, all on `c4Flight` (#32.3:
// v1 is a COUPLED PAIR, so the baseline is T1-FLIGHT's world, not the legacy
// one):
//   A0  c4Flight            -- the world that left H3 at 22.90% of crosses
//   A1  + c4Arrival         -- the licence survives the delivery (nothing else)
//   A2  + c4ArrivalReroute  -- and the closest licensed body attacks the meet
//                              point that has worked for the intended receiver
//                              since Phase 63
//
// The A1 rung is REPORTED, not gated: it is the decomposition that says which
// half did the work, and it is a real way for the stage to backfire (the
// arriver's 16 m arc target points AWAY from the landing, so holding him on it
// through the flight could be worse than letting him go home).
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { ballLanding } from '../../src/ai/perception';
import {
  BOX_DEPTH, BOX_WIDTH, CONTROL_MAX_HEIGHT, DT, GRAVITY, HALF_L,
  HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS,
} from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import {
  DEFAULT_POLICY, TEAM_SIZE,
  type PolicyParams, type TeamInfo, type TeamStyle,
} from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §3, §4) ------------------------------------
const WINDOW = 4;
const SEED_START = 920_000;
const MATCH_BUDGET: Record<string, number> = {
  'CROSS vs NEUTRAL': 295,
  'CROSS vs BUS': 296,
  'CROSS vs PRESS': 354,
  'BAL vs NEUTRAL': 524,
  'BAL vs BUS': 566,
  'BAL vs PRESS': 660,
};
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50017;
/** §4.3: the licence-survival floor. */
const F1_FLOOR = 0.90;
/** §4.5: I2's HARD interval, inherited whole from T1-FLIGHT §4.5. */
const I2_MARGIN = 0.015;
/** §4.6: one quarter of revert 2's measured +1.16/match blast. */
const OFFSIDE_MARGIN = 0.29;
/** `actionExecutor.ts`'s own upstream offset, at every one of its three sites. */
const MEET_UPSTREAM = 2.5;
/** F2's equality tolerance — the two sides are the same arithmetic. */
const F2_EPS = 1e-9;

// --- staging, reused verbatim from `cross-anatomy.ts` (which is NOT edited) --
const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (
  name: string, genome: TacticalGenome, style: TeamStyle, policy?: Partial<PolicyParams>,
): TeamInfo => ({
  id: name, name, short: name.toUpperCase().slice(0, 3),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome, squad: squad(), style, policy,
});

const wideStyle: TeamStyle = { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' };

interface Atk { readonly tag: string; readonly genome: TacticalGenome; readonly policy?: Partial<PolicyParams> }
const attackers: Atk[] = [
  (() => {
    const g = neutral();
    g.attackingWidth = 0.85;
    return { tag: 'CROSS', genome: g, policy: { crossBase: DEFAULT_POLICY.crossBase * 2.2 } };
  })(),
  (() => {
    const g = neutral();
    g.attackingWidth = 0.85;
    return { tag: 'BAL', genome: g };
  })(),
];

interface Shell { readonly tag: string; readonly genome: TacticalGenome; readonly style: TeamStyle }
const shells: Shell[] = [
  { tag: 'NEUTRAL', genome: neutral(), style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } },
  (() => {
    const g = neutral();
    g.defensiveCompactness = 0.9;
    g.formationDepth = 0.15;
    g.pressIntensity = 0.15;
    return { tag: 'BUS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: 'man' } as TeamStyle };
  })(),
  (() => {
    const g = neutral();
    g.pressIntensity = 0.9;
    g.defensiveCompactness = 0.35;
    g.formationDepth = 0.8;
    return { tag: 'PRESS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } as TeamStyle };
  })(),
];

// --- records -----------------------------------------------------------------
type Klass = 'C0' | 'C1' | 'C2' | 'C3atk' | 'C3def';
type Rung = 'H0heightPreempted' | 'H1keeper' | 'H2takenDownAtHeight'
  | 'H3noContenderAtHeight' | 'H4contenderNoHeader';
const RUNGS: readonly Rung[] = ['H0heightPreempted', 'H1keeper',
  'H2takenDownAtHeight', 'H3noContenderAtHeight', 'H4contenderNoHeader'];
const CLASSES: readonly Klass[] = ['C0', 'C1', 'C2', 'C3atk', 'C3def'];

interface CrossRow {
  readonly cluster: number;
  readonly klass: Klass;
  readonly arrived: boolean;
  readonly atkTouchInWindow: boolean;
  readonly defTouchInWindow: boolean;
  readonly inRadiusAtSample: boolean;
  readonly maxZ: number;
  readonly bandTicks: number;
  readonly minOutfieldDistInBand: number;
  readonly minAtkDistInBand: number;
  readonly terminalByGk: boolean;
  readonly terminalOutfield: boolean;
  readonly terminalZ: number;
  readonly oldClass: 'atkHeader' | 'defHeader' | 'noHeader';
  readonly goal: boolean;
  readonly shot: boolean;
  /** F1: was anyone licensed at the kick, and did anyone still run at the band. */
  readonly licensedAtKick: number;
  readonly runAtBand: boolean | null;
  /** M3: attacking bodies in the box the tick the ball entered the band. */
  readonly atkInBoxAtBand: number | null;
  readonly defInBoxAtBand: number | null;
}

/** Per-match record — the offside canary's unit (contract §4.6). */
interface MatchRow {
  readonly cluster: number;
  readonly offsidesBoth: number;
  readonly offsidesAtk: number;
}

/** F2's per-record ledger, accumulated across the arm (contract §4.3). */
interface F2Ledger {
  ok: number;
  e1OnsideClamp: number;
  e2BarredBox: number;
  e3NotClosest: number;
  unexplained: number;
  /** Ticks skipped because a corner owns the crash routing that tick. */
  cornerPrecedence: number;
  /** Ticks the probe expected a fire and no body carried a trace. */
  noTrace: number;
  worstMeetError: number;
}

const dist = (
  a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>,
): number => Math.hypot(a.x - b.x, a.y - b.y);

const inAttackingBox = (
  localX: number, y: number,
): boolean => localX > HALF_L - BOX_DEPTH && Math.abs(y) <= BOX_WIDTH / 2;

const rungOf = (row: CrossRow): Rung => {
  if (row.bandTicks === 0) return 'H0heightPreempted';
  if (row.terminalByGk) return 'H1keeper';
  if (row.terminalOutfield && row.terminalZ >= HEADER_MIN_HEIGHT) return 'H2takenDownAtHeight';
  if (row.minOutfieldDistInBand > HEADER_RADIUS) return 'H3noContenderAtHeight';
  return 'H4contenderNoHeader';
};

interface Open {
  readonly kickTime: number;
  readonly crosser: Player | null;
  readonly ah0: number;
  readonly dh0: number;
  readonly licensed: number[];
  arrived: boolean;
  windowDone: boolean;
  atkTouchInWindow: boolean;
  defTouchInWindow: boolean;
  maxZ: number;
  bandTicks: number;
  minOutfieldDistInBand: number;
  minAtkDistInBand: number;
  terminalByGk: boolean;
  terminalOutfield: boolean;
  terminalZ: number;
  lastZ: number;
  inRadiusAtSample: boolean;
  runAtBand: boolean | null;
  atkInBoxAtBand: number | null;
  defInBoxAtBand: number | null;
}

interface Flags { c4Arrival?: boolean; c4ArrivalReroute?: boolean }

const harvestCombo = (
  atk: Atk, shell: Shell, seedStart: number, matchBudget: number,
  flags: Flags, f2: F2Ledger,
): { rows: CrossRow[]; matchRows: MatchRow[]; matches: number } => {
  const rows: CrossRow[] = [];
  const matchRows: MatchRow[] = [];
  for (let k = 0; k < matchBudget; k++) {
    const m = new Match({
      seed: seedStart + k,
      teamA: team('ATK', atk.genome, wideStyle, atk.policy),
      teamB: team(shell.tag, shell.genome, shell.style),
      c4Flight: true,
      ...flags,
    });
    const attacking = m.teams[0];
    const defending = m.teams[1];
    let open: Open | null = null;
    let crosses0 = 0;

    const boxCounts = (): { atk: number; def: number } => {
      let a = 0;
      let d = 0;
      for (const p of attacking.players) {
        if (!p.sentOff && p.role !== 'GK' && inAttackingBox(attacking.localX(p.pos.x), p.pos.y)) a += 1;
      }
      for (const p of defending.players) {
        if (!p.sentOff && p.role !== 'GK' && inAttackingBox(attacking.localX(p.pos.x), p.pos.y)) d += 1;
      }
      return { atk: a, def: d };
    };

    const closeWindow = (): void => {
      if (open === null) return;
      const ah = attacking.stats.headersWon - open.ah0;
      const dh = defending.stats.headersWon - open.dh0;
      const oldClass = ah > 0 ? 'atkHeader' : dh > 0 ? 'defHeader' : 'noHeader';
      const metByAttacker = open.inRadiusAtSample || open.atkTouchInWindow;
      const klass: Klass = ah > 0 ? 'C3atk'
        : dh > 0 ? 'C3def'
          : !open.arrived ? 'C0'
            : metByAttacker ? 'C2' : 'C1';
      const s = m.shotLog.find((e) => (
        e.side === 0 && e.t >= open!.kickTime && e.t <= open!.kickTime + WINDOW
        && e.outcome !== 'pending'
      ));
      rows.push({
        cluster: k,
        klass,
        arrived: open.arrived,
        atkTouchInWindow: open.atkTouchInWindow,
        defTouchInWindow: open.defTouchInWindow,
        inRadiusAtSample: open.inRadiusAtSample,
        maxZ: open.maxZ,
        bandTicks: open.bandTicks,
        minOutfieldDistInBand: open.minOutfieldDistInBand,
        minAtkDistInBand: open.minAtkDistInBand,
        terminalByGk: open.terminalByGk,
        terminalOutfield: open.terminalOutfield,
        terminalZ: open.terminalZ,
        oldClass,
        shot: s !== undefined,
        goal: s?.outcome === 'goal',
        licensedAtKick: open.licensed.length,
        runAtBand: open.runAtBand,
        atkInBoxAtBand: open.atkInBoxAtBand,
        defInBoxAtBand: open.defInBoxAtBand,
      });
      open = null;
    };

    const readBoundary = (): void => {
      if (open !== null && !open.windowDone) {
        const t = m.ball.lastTouch;
        if (t === open.crosser && m.ball.z > open.maxZ) open.maxZ = m.ball.z;
        const zBefore = open.lastZ;
        open.lastZ = m.ball.z;
        const touched = t !== null && t !== open.crosser;
        const inBand = m.ball.vz < 0 && m.ball.z <= HEADER_MAX_HEIGHT;
        if (m.phase !== 'playing') {
          open.windowDone = true;
        } else if (touched) {
          if (open.arrived) {
            if (t!.side === 0) open.atkTouchInWindow = true;
            else open.defTouchInWindow = true;
          } else if (t!.side === 0 && t!.role !== 'GK') open.atkTouchInWindow = true;
          open.terminalByGk = t!.role === 'GK';
          open.terminalOutfield = t!.role !== 'GK';
          open.terminalZ = zBefore;
          open.windowDone = true;
        } else if (!inBand) {
          if (open.arrived) open.windowDone = true;
        } else {
          const ball = m.ball.pos;
          let nearestAtk = Infinity;
          let nearestDef = Infinity;
          let within135 = 0;
          for (const p of attacking.players) {
            if (p.sentOff || p.role === 'GK') continue;
            const d = dist(p.pos, ball);
            if (d < nearestAtk) nearestAtk = d;
            if (d <= HEADER_RADIUS) within135 += 1;
          }
          for (const p of defending.players) {
            if (p.sentOff || p.role === 'GK') continue;
            const d = dist(p.pos, ball);
            if (d < nearestDef) nearestDef = d;
          }
          if (m.ball.z >= HEADER_MIN_HEIGHT) {
            // F1 / M3 are read at the FIRST tick of the header band and never
            // again: a later tick would let a body who arrived after the
            // contestable instant count as if he had been there for it.
            if (open.bandTicks === 0) {
              open.runAtBand = open.licensed.length === 0 ? null
                : open.licensed.some((idx) => {
                  const q = attacking.players[idx];
                  return !q.sentOff && q.action.type === 'MakeRun';
                });
              const counts = boxCounts();
              open.atkInBoxAtBand = counts.atk;
              open.defInBoxAtBand = counts.def;
            }
            open.bandTicks += 1;
            if (nearestAtk < open.minAtkDistInBand) open.minAtkDistInBand = nearestAtk;
            const nearestAny = Math.min(nearestAtk, nearestDef);
            if (nearestAny < open.minOutfieldDistInBand) open.minOutfieldDistInBand = nearestAny;
          }
          open.arrived = true;
          if (within135 > 0) open.inRadiusAtSample = true;
        }
      }
    };

    /** The licence the intervention snapshots — measured identically in every arm. */
    const readLicence = (): number[] => {
      const out: number[] = [];
      const seen = new Set<number>();
      for (const idx of attacking.runners) {
        const p = attacking.players[idx];
        if (p.sentOff || p.role === 'GK' || p === m.ball.lastTouch) continue;
        out.push(idx);
        seen.add(idx);
      }
      const a = attacking.arriver;
      if (a !== null && !seen.has(a)) {
        const p = attacking.players[a];
        if (!p.sentOff && p.role !== 'GK' && p !== m.ball.lastTouch) out.push(a);
      }
      out.sort((x, y) => x - y);
      return out;
    };

    /**
     * F2's pre-step expectation. The executor runs AFTER `simTime += dt` and
     * BEFORE any physics or ball step, and every body executes off the same
     * frozen world — so this reading is exactly the state the branch saw, and
     * "he stopped being closest between decision and execution" (E3) is
     * structurally impossible within a tick rather than merely rare.
     */
    const expectMeet = (): { idx: number; meet: { x: number; y: number } } | null => {
      if (flags.c4ArrivalReroute !== true) return null;
      const cf = attacking.crossFlight;
      const ball = m.ball;
      if (cf === null || m.simTime + DT >= cf.until) return null;
      if (ball.owner !== null || ball.z <= CONTROL_MAX_HEIGHT) return null;
      const licensed = cf.arriver !== null && !cf.runners.includes(cf.arriver)
        ? [...cf.runners, cf.arriver] : [...cf.runners];
      licensed.sort((x, y) => x - y);
      const land = ballLanding(ball);
      let closest = -1;
      let bd = Infinity;
      for (const idx of licensed) {
        const q = attacking.players[idx];
        if (q.sentOff) continue;
        const d = Math.hypot(q.pos.x - land.x, q.pos.y - land.y);
        if (d < bd) {
          bd = d;
          closest = idx;
        }
      }
      if (closest < 0) return null;
      const vl = Math.hypot(ball.vel.x, ball.vel.y) || 1;
      return {
        idx: closest,
        meet: {
          x: land.x - (ball.vel.x / vl) * MEET_UPSTREAM,
          y: land.y - (ball.vel.y / vl) * MEET_UPSTREAM,
        },
      };
    };

    /** The corner machinery owns the crash routing when it is live (X6). */
    const cornerOwnsRouting = (): boolean => {
      const r = m.restart;
      if (r?.kind === 'corner' && r.side === 0) return true;
      const cc = attacking.cornerCrash;
      return cc !== null && m.simTime + DT < cc.until;
    };

    while (!m.finished) {
      readBoundary();
      const expect = expectMeet();
      const cornerTick = expect !== null && cornerOwnsRouting();
      m.step(DT);
      readBoundary();

      if (expect !== null) {
        if (cornerTick) f2.cornerPrecedence += 1;
        else {
          const p = attacking.players[expect.idx];
          const tr = p.c4Trace;
          if (tr === null) {
            // Nobody carried the trace where one was expected. If ANOTHER
            // licensed body carries it, the closest-body scan disagreed (E3);
            // if nobody does, the branch did not fire at all.
            const other = attacking.players.some((q) => q !== p && q.c4Trace !== null);
            if (other) f2.e3NotClosest += 1;
            else f2.noTrace += 1;
          } else {
            const meetErr = Math.max(
              Math.abs(tr.meet.x - expect.meet.x), Math.abs(tr.meet.y - expect.meet.y),
            );
            const appliedErr = Math.max(
              Math.abs(tr.applied.x - tr.meet.x), Math.abs(tr.applied.y - tr.meet.y),
            );
            if (meetErr > f2.worstMeetError) f2.worstMeetError = meetErr;
            if (meetErr > F2_EPS) f2.unexplained += 1;
            else if (appliedErr <= F2_EPS) f2.ok += 1;
            else {
              // The two named clamps, identified by the world state that arms
              // them rather than by the size of the rewrite.
              const r = m.restart;
              const barred = (r?.kind === 'goalKick' && r.side !== 0)
                || defending.goalkeeper.gkHoldTimer > 0
                || defending.goalkeeper.gkDistributing;
              if (barred) f2.e2BarredBox += 1;
              else if (m.ball.owner !== null && m.ball.owner.side === 0) f2.e1OnsideClamp += 1;
              else f2.unexplained += 1;
            }
          }
        }
      }

      const c = attacking.stats.crosses;
      if (c > crosses0) {
        if (open !== null) closeWindow();
        open = {
          kickTime: m.simTime,
          crosser: m.ball.lastTouch,
          ah0: attacking.stats.headersWon,
          dh0: defending.stats.headersWon,
          licensed: readLicence(),
          arrived: false,
          windowDone: false,
          atkTouchInWindow: false,
          defTouchInWindow: false,
          maxZ: m.ball.z,
          bandTicks: 0,
          minOutfieldDistInBand: Infinity,
          minAtkDistInBand: Infinity,
          terminalByGk: false,
          terminalOutfield: false,
          terminalZ: Number.NaN,
          lastZ: m.ball.z,
          inRadiusAtSample: false,
          runAtBand: null,
          atkInBoxAtBand: null,
          defInBoxAtBand: null,
        };
        crosses0 = c;
      }
      if (open !== null && m.simTime > open.kickTime + WINDOW) closeWindow();
    }
    if (open !== null) closeWindow();
    matchRows.push({
      cluster: k,
      offsidesBoth: attacking.stats.offsides + defending.stats.offsides,
      offsidesAtk: attacking.stats.offsides,
    });
  }
  return { rows, matchRows, matches: matchBudget };
};

// --- statistics (cluster unit = the match seed, ruling #20) ------------------
const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);
const quantile = (values: readonly number[], q: number): number => {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))];
};
const share = (rows: readonly CrossRow[], pick: (row: CrossRow) => boolean): number =>
  (rows.length === 0 ? Number.NaN : rows.filter(pick).length / rows.length);
const canonical = (value: unknown): string => JSON.stringify(value);
const round = (value: number, dp = 6): number =>
  (Number.isFinite(value) ? Number(value.toFixed(dp)) : Number.NaN);

/**
 * Paired cluster bootstrap for a DIFFERENCE of two aggregates. Clusters are
 * match seeds; a drawn cluster contributes BOTH arms' records, so the same
 * worlds are compared however the resample falls (ruling #20).
 */
const pairedCI = <T extends { cluster: number }>(
  left: readonly T[], right: readonly T[],
  agg: (rows: readonly T[]) => number, offset: number,
) => {
  const byCluster = new Map<number, { l: T[]; r: T[] }>();
  const put = (row: T, side: 'l' | 'r') => {
    const bucket = byCluster.get(row.cluster) ?? { l: [], r: [] };
    bucket[side].push(row);
    byCluster.set(row.cluster, bucket);
  };
  for (const row of left) put(row, 'l');
  for (const row of right) put(row, 'r');
  const clusters = [...byCluster.values()];
  const point = agg(right) - agg(left);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const l: T[] = [];
    const r: T[] = [];
    for (let i = 0; i < clusters.length; i++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      for (const row of pick.l) l.push(row);
      for (const row of pick.r) r.push(row);
    }
    const v = agg(r) - agg(l);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};

const shareAgg = (pick: (row: CrossRow) => boolean) =>
  (rows: readonly CrossRow[]): number => (rows.length === 0 ? Number.NaN
    : rows.filter(pick).length / rows.length);

const isH3 = (row: CrossRow) => row.klass === 'C2' && rungOf(row) === 'H3noContenderAtHeight';

const runBlock = (flags: Flags) => {
  const pooled: CrossRow[] = [];
  const matchPooled: MatchRow[] = [];
  const f2: F2Ledger = {
    ok: 0, e1OnsideClamp: 0, e2BarredBox: 0, e3NotClosest: 0,
    unexplained: 0, cornerPrecedence: 0, noTrace: 0, worstMeetError: 0,
  };
  const perCombo: { tag: string; crosses: number; c3atk: number; h3: number }[] = [];
  let comboIndex = 0;
  for (const atk of attackers) {
    for (const shell of shells) {
      const tag = `${atk.tag} vs ${shell.tag}`;
      const r = harvestCombo(atk, shell, SEED_START, MATCH_BUDGET[tag]!, flags, f2);
      comboIndex += 1;
      const offset = comboIndex * 10_000;
      for (const row of r.rows) pooled.push({ ...row, cluster: row.cluster + offset });
      for (const row of r.matchRows) matchPooled.push({ ...row, cluster: row.cluster + offset });
      perCombo.push({
        tag,
        crosses: r.rows.length,
        c3atk: round(share(r.rows, (row) => row.klass === 'C3atk')),
        h3: round(share(r.rows, isH3)),
      });
    }
  }
  const c2 = pooled.filter((row) => row.klass === 'C2');
  const ladderCounts = Object.fromEntries(
    RUNGS.map((r) => [r, c2.filter((row) => rungOf(row) === r).length]),
  ) as Record<Rung, number>;
  const withLicence = pooled.filter((row) => row.licensedAtKick > 0 && row.runAtBand !== null);
  const h3 = pooled.filter(isH3);
  const inBand = pooled.filter((row) => row.atkInBoxAtBand !== null);
  return {
    pooled,
    matchPooled,
    f2,
    perCombo,
    crosses: pooled.length,
    classShares: Object.fromEntries(
      CLASSES.map((k) => [k, round(share(pooled, (row) => row.klass === k))]),
    ) as Record<Klass, number>,
    c3atkShare: round(share(pooled, (row) => row.klass === 'C3atk')),
    c3defShare: round(share(pooled, (row) => row.klass === 'C3def')),
    contestShare: round(share(pooled, (row) => row.klass === 'C3atk' || row.klass === 'C3def')),
    goalShare: round(share(pooled, (row) => row.goal)),
    shotShare: round(share(pooled, (row) => row.shot)),
    // F1's population and statistic.
    f1: {
      n: withLicence.length,
      licensedShare: round(share(pooled, (row) => row.licensedAtKick > 0)),
      runAtBandShare: withLicence.length === 0 ? Number.NaN
        : round(withLicence.filter((row) => row.runAtBand === true).length / withLicence.length),
      licensedMean: round(mean(pooled.map((row) => row.licensedAtKick)), 4),
    },
    ladder: Object.fromEntries(RUNGS.map((r) => [r, {
      count: ladderCounts[r],
      share: c2.length === 0 ? Number.NaN : round(ladderCounts[r] / c2.length),
    }])) as Record<Rung, { count: number; share: number }>,
    ladderPartitionOk: RUNGS.reduce((sum, r) => sum + ladderCounts[r], 0) === c2.length,
    h3: {
      n: h3.length,
      shareOfAllCrosses: round(h3.length / pooled.length),
      minOutMedian: round(quantile(h3.map((row) => row.minOutfieldDistInBand), 0.5), 4),
      withinTwoMetres: h3.length === 0 ? Number.NaN
        : round(h3.filter((row) => row.minOutfieldDistInBand <= 2).length / h3.length),
    },
    band: {
      n: inBand.length,
      atkInBoxMean: round(mean(inBand.map((row) => row.atkInBoxAtBand!)), 4),
      defInBoxMean: round(mean(inBand.map((row) => row.defInBoxAtBand!)), 4),
      minAtkMedian: round(quantile(pooled.filter((row) => Number.isFinite(row.minAtkDistInBand))
        .map((row) => row.minAtkDistInBand), 0.5), 4),
      minAtkMean: round(mean(pooled.filter((row) => Number.isFinite(row.minAtkDistInBand))
        .map((row) => row.minAtkDistInBand)), 4),
    },
    offsides: {
      bothMean: round(mean(matchPooled.map((row) => row.offsidesBoth)), 4),
      atkMean: round(mean(matchPooled.map((row) => row.offsidesAtk)), 4),
    },
    partitionOk: CLASSES.reduce(
      (sum, k) => sum + pooled.filter((row) => row.klass === k).length, 0,
    ) === pooled.length,
  };
};

const runExperiment = () => {
  const a0 = runBlock({});
  const a1 = runBlock({ c4Arrival: true });
  const a2 = runBlock({ c4Arrival: true, c4ArrivalReroute: true });

  // --- F: the mechanism fires ----------------------------------------------
  const f1 = a2.f1.runAtBandShare >= F1_FLOOR;
  const f2 = a2.f2.unexplained === 0 && a2.f2.noTrace === 0;

  // --- D1 PRIMARY + mediators ----------------------------------------------
  const d1 = pairedCI(a0.pooled, a2.pooled, shareAgg((row) => row.klass === 'C3atk'), 1);
  const m1 = pairedCI(a0.pooled, a2.pooled, shareAgg(isH3), 2);
  const m2 = pairedCI(
    a0.pooled.filter((row) => Number.isFinite(row.minAtkDistInBand)),
    a2.pooled.filter((row) => Number.isFinite(row.minAtkDistInBand)),
    (rows) => quantile(rows.map((row) => row.minAtkDistInBand), 0.5), 3,
  );
  const m3 = pairedCI(
    a0.pooled.filter((row) => row.atkInBoxAtBand !== null),
    a2.pooled.filter((row) => row.atkInBoxAtBand !== null),
    (rows) => mean(rows.map((row) => row.atkInBoxAtBand!)), 4,
  );

  // --- I2 HARD + the offside canary HARD ------------------------------------
  const i2 = pairedCI(a0.pooled, a2.pooled, shareAgg((row) => row.goal), 5);
  const shotDelta = pairedCI(a0.pooled, a2.pooled, shareAgg((row) => row.shot), 6);
  const oc = pairedCI(a0.matchPooled, a2.matchPooled,
    (rows) => mean(rows.map((row) => row.offsidesBoth)), 7);
  const ocAtk = pairedCI(a0.matchPooled, a2.matchPooled,
    (rows) => mean(rows.map((row) => row.offsidesAtk)), 8);

  // --- reported: the A1 rung, and total contests ---------------------------
  const a1d1 = pairedCI(a0.pooled, a1.pooled, shareAgg((row) => row.klass === 'C3atk'), 9);
  const contests = pairedCI(a0.pooled, a2.pooled,
    shareAgg((row) => row.klass === 'C3atk' || row.klass === 'C3def'), 10);
  const c3def = pairedCI(a0.pooled, a2.pooled, shareAgg((row) => row.klass === 'C3def'), 11);

  const armSummary = (arm: ReturnType<typeof runBlock>) => ({
    crosses: arm.crosses,
    classShares: arm.classShares,
    c3atkShare: arm.c3atkShare,
    c3defShare: arm.c3defShare,
    contestShare: arm.contestShare,
    goalShare: arm.goalShare,
    shotShare: arm.shotShare,
    f1: arm.f1,
    f2: arm.f2,
    ladder: arm.ladder,
    h3: arm.h3,
    band: arm.band,
    offsides: arm.offsides,
    perCombo: arm.perCombo,
  });

  const gates = {
    f1LicenceSurvives: f1,
    f2RerouteFidelity: f2,
    d1AttackingContestsUp: d1.lower > 0,
    i2ConversionBounded: i2.upper < I2_MARGIN,
    offsideCanary: oc.upper < OFFSIDE_MARGIN,
    xPartition: a0.partitionOk && a1.partitionOk && a2.partitionOk,
    xLadderPartition: a0.ladderPartitionOk && a1.ladderPartitionOk && a2.ladderPartitionOk,
  };

  return {
    experiment: 'C4-T2-ARRIVAL (Phase A)',
    authority: 'C4-T2-ARRIVAL',
    parameters: {
      seedStart: SEED_START, matchBudget: MATCH_BUDGET, window: WINDOW,
      baseline: 'c4Flight ON (#32.3, the coupled pair)',
      arms: ['A0 flight-only', 'A1 +c4Arrival', 'A2 +c4ArrivalReroute'],
      f1Floor: F1_FLOOR, i2Margin: I2_MARGIN, offsideMargin: OFFSIDE_MARGIN,
      meetUpstream: MEET_UPSTREAM, clusterUnit: 'match seed',
    },
    arms: { a0: armSummary(a0), a1: armSummary(a1), a2: armSummary(a2) },
    d1: { statistic: 'C3atk share of crosses, paired cluster bootstrap', ...d1 },
    mediators: { m1H3Share: m1, m2MinAtkMedian: m2, m3AtkInBoxAtBand: m3 },
    i2: {
      statistic: 'goal-within-4.0s-window, paired cluster bootstrap',
      ...i2,
      reading: i2.upper < I2_MARGIN
        ? (i2.lower > 0 ? 'ROSE, bounded below the margin'
          : i2.upper < 0 ? 'RESOLVED DECREASE'
            : 'did not rise beyond resolution')
        : 'FIRED',
      shotDelta,
    },
    offsideCanary: { statistic: 'both-team offsides per match', ...oc, attackingOnly: ocAtk },
    reported: { a1C3atk: a1d1, contests, c3def },
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, xDeterminism: deterministic };
const output = { ...first, gates, sha256, verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL' };
console.log(JSON.stringify(output, null, 2));

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const pp = (v: number) => `${(v * 100).toFixed(2)}pp`;
const failed = Object.entries(output.gates).filter(([, v]) => !v).map(([k]) => k);
const a = output.arms;
console.error(
  `C4-T2-ARRIVAL ${output.verdict} · crosses ${a.a0.crosses}/${a.a1.crosses}/${a.a2.crosses}`
  + ` · F1 runAtBand ${pct(a.a0.f1.runAtBandShare)}→${pct(a.a1.f1.runAtBandShare)}→${pct(a.a2.f1.runAtBandShare)}`
  + ` (floor ${pct(F1_FLOOR)}, n ${a.a2.f1.n})`
  + ` · F2 ok ${a.a2.f2.ok} e1 ${a.a2.f2.e1OnsideClamp} e2 ${a.a2.f2.e2BarredBox}`
  + ` e3 ${a.a2.f2.e3NotClosest} noTrace ${a.a2.f2.noTrace} corner ${a.a2.f2.cornerPrecedence}`
  + ` UNEXPLAINED ${a.a2.f2.unexplained} worstMeet ${a.a2.f2.worstMeetError}`
  + ` · D1 C3atk ${pct(a.a0.c3atkShare)}→${pct(a.a2.c3atkShare)}`
  + ` = ${pp(output.d1.point)} CI[${pp(output.d1.lower)}, ${pp(output.d1.upper)}]`
  + ` · M1 H3 ${pct(a.a0.h3.shareOfAllCrosses)}→${pct(a.a2.h3.shareOfAllCrosses)}`
  + ` = ${pp(output.mediators.m1H3Share.point)} CI[${pp(output.mediators.m1H3Share.lower)}, ${pp(output.mediators.m1H3Share.upper)}]`
  + ` · M2 minAtk median ${a.a0.band.minAtkMedian}→${a.a2.band.minAtkMedian} m`
  + ` (${output.mediators.m2MinAtkMedian.point} CI[${output.mediators.m2MinAtkMedian.lower}, ${output.mediators.m2MinAtkMedian.upper}])`
  + ` · M3 atkInBox@band ${a.a0.band.atkInBoxMean}→${a.a2.band.atkInBoxMean}`
  + ` (${output.mediators.m3AtkInBoxAtBand.point} CI[${output.mediators.m3AtkInBoxAtBand.lower}, ${output.mediators.m3AtkInBoxAtBand.upper}])`
  + ` · I2 goals ${pct(a.a0.goalShare)}→${pct(a.a2.goalShare)}`
  + ` = ${pp(output.i2.point)} CI[${pp(output.i2.lower)}, ${pp(output.i2.upper)}] (${output.i2.reading})`
  + ` · OC offsides ${a.a0.offsides.bothMean}→${a.a2.offsides.bothMean}/match`
  + ` = ${output.offsideCanary.point} CI[${output.offsideCanary.lower}, ${output.offsideCanary.upper}]`
  + ` vs ${OFFSIDE_MARGIN}`
  + ` · contests ${pct(a.a0.contestShare)}→${pct(a.a2.contestShare)} (${pp(output.reported.contests.point)})`
  + ` C3def ${pp(output.reported.c3def.point)}`
  + ` · A1 rung C3atk ${pct(a.a1.c3atkShare)} (${pp(output.reported.a1C3atk.point)}`
  + ` CI[${pp(output.reported.a1C3atk.lower)}, ${pp(output.reported.a1C3atk.upper)}])`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256}`,
);
