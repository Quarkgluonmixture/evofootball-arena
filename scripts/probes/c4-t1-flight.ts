// C4 T1-FLIGHT Phase A — DOES THE BALL GET UP, AND DOES IT BUY CONTESTS?
// Authority: docs/world-model/C4-T1-FLIGHT.md (commander rulings #30.3, #31)
// Derives from the T0R+T0b census probe, whose classification and C2 ladder
// are reused verbatim so the arms are comparable to the banked baseline.
//
// Three paired same-seed arms on one fresh block:
//   OFF    flags-off — the banked world
//   ON     `c4Flight` — the cross flight time floors at CROSS_FLIGHT_MIN_S,
//          the apex that clears the outfield header band. Derived, crosses
//          only, technique deliberately not scaling it.
//   STALE  `c4Flight` + `c4FlightStaleLead` — the §2.4 variant, REPORTED
//          only: the run-lead keeps the OLD flight estimate. Ruling #31.1
//          made rule-preserving primary; this measures the alternative.
//
// F gates read the LAUNCH (vz), not the sampled path: a parabola read at tick
// boundaries under-reads its apex by up to 3.4e-4 m, and the floor puts a
// short cross's apex exactly ON the threshold (§4.2's pre-run amendment).
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import {
  BOX_DEPTH, BOX_WIDTH, CROSS_FLIGHT_MIN_S, DT, GRAVITY, HALF_L,
  HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS, PENALTY_SPOT_DIST,
} from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import {
  DEFAULT_POLICY, TEAM_SIZE,
  type PolicyParams, type TeamInfo, type TeamStyle,
} from '../../src/sim/types';
import { clamp } from '../../src/utils/math';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2) ----------------------------------------
/** `cross-anatomy.ts`'s own WINDOW, verbatim — changing it breaks the pin. */
const WINDOW = 4;
/** The X4 pin's staging: the ONLY block where the external comparison exists. */
const PIN_SEED_START = 909_000;
const PIN_MATCHES = 250;
/** Fresh, and disjoint from every seen block (830/840/850/860/870/909). */
const BUILD_SEED_START = 880_000;
const HELDOUT_SEED_START = 890_000;
/** T0R's target: 900 crosses per combination = 3x the untouched 300 floor. */
const CROSS_TARGET = 900;
const T1_SEED_START = 900_000; // fresh: 830/840/850/860/870/880/890/909 seen
const D1_BOOTSTRAP = 60;
const I2_MARGIN = 0.015; // +1.5pp CI upper bound, derived in contract §4.5
const F2_TOLERANCE = 1e-3; // 3x the analytic tick-sampling bound
/**
 * Per-combination match budgets, derived ex ante from the SEEN 909k block's
 * own rates (contract §2.1) — ceil(900 / rate). Deriving is what a seen block
 * is for; it does not judge.
 */
const MATCH_BUDGET: Record<string, number> = {
  'CROSS vs NEUTRAL': 295, // 3.060 /match
  'CROSS vs BUS': 296,     // 3.044
  'CROSS vs PRESS': 354,   // 2.544
  'BAL vs NEUTRAL': 524,   // 1.720
  'BAL vs BUS': 566,       // 1.592
  'BAL vs PRESS': 660,     // 1.364
};
const C2_POOLED_FLOOR = 400;
const S2_TOLERANCE = 0.07; // 7.0pp on the C2 ladder, derived in contract §4.3
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50011;
const COMBO_CROSS_FLOOR = 300; // gate text untouched (#28.4a)
const POOLED_CROSS_FLOOR = 3000;
const STABILITY_TOLERANCE = 0.035; // 3.5pp, derived in contract §5.3
/** The arriver's Phase-31 cutback destination (`actionExecutor.ts:351-355`). */
const ARC_INSET = 16;

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

// --- per-cross record --------------------------------------------------------
type Klass = 'C0' | 'C1' | 'C2' | 'C3atk' | 'C3def';
type NeverReason = 'defTouch' | 'atkTouch' | 'gkClaim' | 'outOfPlay' | 'windowExpiry';

interface CrossRow {
  readonly cluster: number;
  readonly klass: Klass;
  readonly neverReason: NeverReason | null;
  readonly arrived: boolean;
  readonly atkTouchInWindow: boolean;
  readonly defTouchInWindow: boolean;
  readonly inRadiusAtSample: boolean;
  readonly maxZ: number;
  /**
   * T1-FLIGHT: the ball's apex, read one tick after the kick as
   * `z + vz²/(2g)`. Energy form, so the one tick of gravity the capture is
   * late by cancels exactly — a plain `vz²/(2g)` under-reads it, which the
   * smoke showed as F1 at 63%.
   */
  readonly launchApex: number;
  /** T0b: ticks of the descent inside `tryAerial`'s outfield band. */
  readonly bandTicks: number;
  /** T0b: closest any outfielder / attacker came WHILE the ball was in band. */
  readonly minOutfieldDistInBand: number;
  readonly minAtkDistInBand: number;
  /** T0b: what ended the window, and at what height. */
  readonly terminalByGk: boolean;
  readonly terminalOutfield: boolean;
  readonly terminalZ: number;
  /** Old instrument's verdict on the same cross, for the rollup pin. */
  readonly oldClass: 'atkHeader' | 'defHeader' | 'noHeader';
  readonly shot: boolean;
  readonly goal: boolean;
  readonly kept: boolean;
  /** Census — present only when the ball actually arrived. */
  readonly census: ArrivalCensus | null;
  /** Kick-tick occupancy, always present. */
  readonly atkInBoxAtKick: number;
  readonly defInBoxAtKick: number;
  readonly hadArriver: boolean;
  readonly runnersAtKick: number;
}

interface ArrivalCensus {
  readonly atkWithin135: number;
  readonly atkWithin2: number;
  readonly atkWithin3: number;
  readonly atkWithin5: number;
  readonly defWithin135: number;
  readonly nearestAtk: number;
  readonly nearestDef: number;
  readonly atkInBox: number;
  readonly defInBox: number;
  /** Null when no arriver was licensed at the kick. */
  readonly arriverToBall: number | null;
  readonly arriverToArc: number | null;
  readonly arriverToSpot: number | null;
  readonly arriverNearerArc: boolean | null;
  readonly ballToSpot: number;
  readonly ballLocalX: number;
  readonly ballAbsY: number;
}

/**
 * The apex the ENGINE will actually reach from `(z, vz)`, by its own
 * integration rather than the textbook parabola. `Match.stepBall` is
 * semi-implicit Euler (`z += vz·dt; vz -= g·dt`), whose discrete apex sits
 * about `vz·dt/2` ABOVE the continuous `vz²/(2g)` — measured at 0.053 m on the
 * sizing smoke, which is 50× the tick-sampling bound F2 was frozen against.
 * Replaying the recurrence makes the reference exact instead of approximate,
 * so F2 becomes a real pin on an undisturbed flight.
 */
const apexByEngineRecurrence = (z0: number, vz0: number): number => {
  let z = z0;
  let vz = vz0;
  let peak = z;
  while (vz > 0) {
    z += vz * DT;
    vz -= GRAVITY * DT;
    if (z > peak) peak = z;
  }
  return peak;
};

const dist = (
  a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>,
): number => Math.hypot(a.x - b.x, a.y - b.y);

/** In the attacking box, by the same geometry `tryAerial`'s bonus term uses. */
const inAttackingBox = (
  localX: number, y: number,
): boolean => localX > HALF_L - BOX_DEPTH && Math.abs(y) <= BOX_WIDTH / 2;

interface Open {
  readonly kickTime: number;
  readonly crosser: Player | null;
  readonly ah0: number;
  readonly dh0: number;
  readonly atkInBoxAtKick: number;
  readonly defInBoxAtKick: number;
  readonly arriverIndex: number | null;
  readonly runnersAtKick: number;
  arrived: boolean;
  /** The arrival window has ended (band exited, touched, or play stopped). */
  windowDone: boolean;
  /** A non-crosser ATTACKER met the ball during the window (chest trap, control). */
  atkTouchInWindow: boolean;
  /** A DEFENDER (or keeper) met it during the window. */
  defTouchInWindow: boolean;
  /** Peak flight height since the kick — could this delivery be headed at all? */
  maxZ: number;
  launchApex: number;
  bandTicks: number;
  minOutfieldDistInBand: number;
  minAtkDistInBand: number;
  terminalByGk: boolean;
  terminalOutfield: boolean;
  terminalZ: number;
  /** Ball height at the PREVIOUS boundary — the height a touch happened AT. */
  lastZ: number;
  /** The sample at the tick of CLOSEST attacker approach inside the window. */
  census: ArrivalCensus | null;
  neverReason: NeverReason | null;
}

/** One (archetype × shell × block) cell: walk the matches, harvest every cross. */
const harvestCombo = (
  atk: Atk, shell: Shell, seedStart: number, matchBudget: number,
  flags: { c4Flight?: boolean; c4FlightStaleLead?: boolean },
): { rows: CrossRow[]; matches: number } => {
  const rows: CrossRow[] = [];
  for (let k = 0; k < matchBudget; k++) {
    const m = new Match({
      seed: seedStart + k,
      teamA: team('ATK', atk.genome, wideStyle, atk.policy),
      teamB: team(shell.tag, shell.genome, shell.style),
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
      // Precedence C3 → C0 → C1 → C2 (contract §3.1).
      // C2 fires on EITHER of two observations that an attacker met the
      // delivery: he was inside the contest radius at a sampled tick, or he
      // physically touched the ball during the window. The second is
      // lag-free and catches the chest trap (`mechanics.ts:781`), which is
      // precisely the "arrived and did not head it" case this class exists
      // for — the smoke found it being lost to C1 without it.
      const metByAttacker = (open.census?.atkWithin135 ?? 0) > 0 || open.atkTouchInWindow;
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
        neverReason: klass === 'C0' ? (open.neverReason ?? 'windowExpiry') : null,
        arrived: open.arrived,
        atkTouchInWindow: open.atkTouchInWindow,
        defTouchInWindow: open.defTouchInWindow,
        inRadiusAtSample: (open.census?.atkWithin135 ?? 0) > 0,
        maxZ: open.maxZ,
        launchApex: open.launchApex,
        bandTicks: open.bandTicks,
        minOutfieldDistInBand: open.minOutfieldDistInBand,
        minAtkDistInBand: open.minAtkDistInBand,
        terminalByGk: open.terminalByGk,
        terminalOutfield: open.terminalOutfield,
        terminalZ: open.terminalZ,
        oldClass,
        shot: s !== undefined,
        goal: s?.outcome === 'goal',
        kept: m.possessionSide === 0,
        census: open.census,
        atkInBoxAtKick: open.atkInBoxAtKick,
        defInBoxAtKick: open.defInBoxAtKick,
        hadArriver: open.arriverIndex !== null,
        runnersAtKick: open.runnersAtKick,
      });
      open = null;
    };

    /**
     * One tick-boundary reading of the open cross. Called BOTH before and
     * after `m.step()`: the contest resolves INSIDE the step, so neither
     * boundary is the contest's own instant — sampling both brackets it and
     * halves the one-tick staleness the smoke exposed.
     */
    const readBoundary = (): void => {
      if (open !== null && !open.windowDone) {
        const t = m.ball.lastTouch;
        // maxZ tracks the DELIVERY's flight only. Updating it before the touch
        // check folded a header's own rebound into the cross's peak, which the
        // smoke showed as an F2 error of 1.47 m.
        if (t === open.crosser && m.ball.z > open.maxZ) open.maxZ = m.ball.z;
        // The PREVIOUS boundary's height, captured before it is overwritten.
        const zBefore = open.lastZ;
        open.lastZ = m.ball.z;
        const touched = t !== null && t !== open.crosser;
        // The contract's ARRIVAL predicate verbatim: descending, at or below
        // contest height. NOT restricted to the header band — the diagnostic
        // found a large share of this engine's crosses never rise above
        // HEADER_MIN_HEIGHT at all, and calling those "never arrived" would
        // be a third meaning smuggled into C0. Their flight height is
        // reported instead (`maxZ`), because a delivery no one COULD head is
        // a real C4 finding rather than a classification problem.
        const inBand = m.ball.vz < 0 && m.ball.z <= HEADER_MAX_HEIGHT;
        if (m.phase !== 'playing') {
          if (!open.arrived) open.neverReason = 'outOfPlay';
          open.windowDone = true;
        } else if (touched) {
          if (!open.arrived) {
            open.neverReason = t!.role === 'GK' ? 'gkClaim' : t!.side === 1 ? 'defTouch' : 'atkTouch';
          } else if (t!.side === 0) open.atkTouchInWindow = true;
          else open.defTouchInWindow = true;
          // T0b: WHAT ended the window, and at what height — the ladder's
          // gate-2 and gate-4 discriminators (`mechanics.ts:745`, `781`).
          open.terminalByGk = t!.role === 'GK';
          open.terminalOutfield = t!.role !== 'GK';
          // The height the touch happened AT, not after it. The contact
          // resolves INSIDE the step, so by the time the boundary sees a new
          // `lastTouch` the ball has already been knocked down — reading
          // `m.ball.z` here made H2 (taken down at head height) unfireable,
          // which the sizing smoke showed as a flat zero.
          open.terminalZ = zBefore;
          open.windowDone = true;
        } else if (!inBand) {
          // The band was entered and has now been left below: the delivery fell
          // through the whole contestable descent without being met.
          if (open.arrived) open.windowDone = true;
        } else {
          // Inside the ARRIVAL WINDOW — `tryAerial`'s own outfield gate
          // (`mechanics.ts:743/778`) restricted to the descent.
          const ball = m.ball.pos;
          const atkDists: number[] = [];
          const defDists: number[] = [];
          for (const p of attacking.players) {
            if (p.sentOff || p.role === 'GK') continue;
            atkDists.push(dist(p.pos, ball));
          }
          for (const p of defending.players) {
            if (p.sentOff || p.role === 'GK') continue;
            defDists.push(dist(p.pos, ball));
          }
          const counts = boxCounts();
          const within = (list: readonly number[], r: number): number =>
            list.filter((d) => d <= r).length;
          const arriver = open.arriverIndex === null ? null : attacking.players[open.arriverIndex];
          const arc = arriver === null ? null : {
            x: (HALF_L - ARC_INSET) * attacking.attackDir,
            y: clamp(arriver.pos.y * 0.3, -7, 7),
          };
          const spot = { x: (HALF_L - PENALTY_SPOT_DIST) * attacking.attackDir, y: 0 };
          const arriverToBall = arriver === null ? null : dist(arriver.pos, ball);
          const arriverToArc = arriver === null || arc === null ? null : dist(arriver.pos, arc);
          const nearestAtk = Math.min(...atkDists);
          // T0b: `tryAerial`'s OUTFIELD band is the sub-window in which a
          // header is physically possible (`mechanics.ts:743` lower bound,
          // `778` upper). Everything the ladder cuts on is measured here.
          if (m.ball.z >= HEADER_MIN_HEIGHT) {
            open.bandTicks += 1;
            const nearestDef = Math.min(...defDists);
            if (nearestAtk < open.minAtkDistInBand) open.minAtkDistInBand = nearestAtk;
            const nearestAny = Math.min(nearestAtk, nearestDef);
            if (nearestAny < open.minOutfieldDistInBand) open.minOutfieldDistInBand = nearestAny;
          }
          open.arrived = true;
          // Keep the CLOSEST-APPROACH tick of the window. C1 ("nobody there")
          // is then equivalent to "no tick of the contestable descent had an
          // attacker inside the radius", which is the honest reading of the
          // class and the one `tryAerial` would have acted on.
          if (open.census !== null && open.census.nearestAtk <= nearestAtk) {
            // A closer sample is already banked; nothing to record this tick.
          } else open.census = {
            atkWithin135: within(atkDists, HEADER_RADIUS),
            atkWithin2: within(atkDists, 2),
            atkWithin3: within(atkDists, 3),
            atkWithin5: within(atkDists, 5),
            defWithin135: within(defDists, HEADER_RADIUS),
            nearestAtk,
            nearestDef: Math.min(...defDists),
            atkInBox: counts.atk,
            defInBox: counts.def,
            arriverToBall,
            arriverToArc,
            arriverToSpot: arriver === null ? null : dist(arriver.pos, spot),
            arriverNearerArc: arriverToBall === null || arriverToArc === null ? null
              : arriverToArc < arriverToBall,
            ballToSpot: dist(ball, spot),
            ballLocalX: attacking.localX(ball.x),
            ballAbsY: Math.abs(ball.y),
          };
        }
      }
    };

    while (!m.finished) {
      readBoundary();
      m.step(DT);
      readBoundary();

      const c = attacking.stats.crosses;
      if (c > crosses0) {
        // A new cross closes an open window early — cross-anatomy's own rule.
        if (open !== null) closeWindow();
        const counts = boxCounts();
        open = {
          kickTime: m.simTime,
          crosser: m.ball.lastTouch,
          ah0: attacking.stats.headersWon,
          dh0: defending.stats.headersWon,
          atkInBoxAtKick: counts.atk,
          defInBoxAtKick: counts.def,
          arriverIndex: attacking.arriver,
          runnersAtKick: attacking.runners.size,
          arrived: false,
          windowDone: false,
          atkTouchInWindow: false,
          defTouchInWindow: false,
          maxZ: m.ball.z,
          // ⚠️ PRE-EXISTING, newly surfaced (contract §4.2c): on ~2-5% of
          // `stats.crosses` increments the ball is NOT in a fresh lofted state
          // at this boundary — it reads as a low BOUNCING ball, flag on AND
          // off alike, so it is not caused by T1-FLIGHT and it equally affects
          // the banked T0/T0R census, which shares this detection code.
          // A genuine cross leaves with `vz = g·T/2 >= g·0.7/2`, minus one
          // tick of gravity by the time this boundary reads it. The threshold
          // is taken from the FLAG-OFF floor so it is arm-independent: an
          // armed launch (vz >= 5.15) clears it comfortably too.
          launchApex: m.ball.vz >= (GRAVITY * 0.7) / 2 - GRAVITY * DT
            ? apexByEngineRecurrence(m.ball.z, m.ball.vz) : Number.NaN,
          bandTicks: 0,
          minOutfieldDistInBand: Infinity,
          minAtkDistInBand: Infinity,
          terminalByGk: false,
          terminalOutfield: false,
          terminalZ: Number.NaN,
          lastZ: m.ball.z,
          census: null,
          neverReason: null,
        };
        crosses0 = c;
      }
      if (open !== null && m.simTime > open.kickTime + WINDOW) closeWindow();
    }
    if (open !== null) closeWindow();
  }
  return { rows, matches: matchBudget };
};

// --- statistics (cluster unit = the match seed, ruling #20) ------------------
const shareCI = (
  rows: readonly { readonly cluster: number; readonly hit: number }[], offset: number,
) => {
  const byCluster = new Map<number, { hits: number; n: number }>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster) ?? { hits: 0, n: 0 };
    bucket.hits += row.hit;
    bucket.n += 1;
    byCluster.set(row.cluster, bucket);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const rates: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let hits = 0;
    let n = 0;
    for (let index = 0; index < clusters.length; index++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      hits += pick.hits;
      n += pick.n;
    }
    rates.push(n === 0 ? Number.NaN : hits / n);
  }
  rates.sort((left, right) => left - right);
  const at = (q: number) => rates[Math.min(rates.length - 1,
    Math.max(0, Math.floor(q * (rates.length - 1))))];
  return { lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

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

const CLASSES: readonly Klass[] = ['C0', 'C1', 'C2', 'C3atk', 'C3def'];

// --- T0b: the C2 ladder, in `tryAerial`'s own gate order (contract §3.1) ----
type Rung = 'H0heightPreempted' | 'H1keeper' | 'H2takenDownAtHeight'
  | 'H3noContenderAtHeight' | 'H4contenderNoHeader';
const RUNGS: readonly Rung[] = ['H0heightPreempted', 'H1keeper',
  'H2takenDownAtHeight', 'H3noContenderAtHeight', 'H4contenderNoHeader'];

/** Exhaustive and mutually exclusive by construction; X6 asserts it. */
const rungOf = (row: CrossRow): Rung => {
  // Gates 1 and 3: the ball was never inside the outfield band, so no contest
  // could have happened whoever was standing there.
  if (row.bandTicks === 0) return 'H0heightPreempted';
  // Gate 2: the keeper got there first.
  if (row.terminalByGk) return 'H1keeper';
  // Gate 4: an outfielder took it down at head height — the chest trap
  // pre-empting the header (`mechanics.ts:781`).
  if (row.terminalOutfield && row.terminalZ >= HEADER_MIN_HEIGHT) return 'H2takenDownAtHeight';
  // Gate 5: the contest ran with no contender inside the radius while the
  // ball was headable — he met it BELOW the band.
  if (row.minOutfieldDistInBand > HEADER_RADIUS) return 'H3noContenderAtHeight';
  // The residual, reported rather than folded into a neighbour.
  return 'H4contenderNoHeader';
};

const describeCombo = (tag: string, rows: readonly CrossRow[], matches: number) => {
  const censuses = rows.map((row) => row.census).filter((c): c is ArrivalCensus => c !== null);
  // C1 says "nobody within 1.35 m at the INSTANT the ball became contestable".
  // How far away the nearest attacker actually was is the number that decides
  // whether a routing fix could plausibly close the gap, so it is reported on
  // the C1 rows specifically rather than only pooled.
  const c1 = rows.filter((row) => row.klass === 'C1' && row.census !== null)
    .map((row) => row.census!);
  const withArriver = censuses.filter((c) => c.arriverNearerArc !== null);
  const classCounts = Object.fromEntries(
    CLASSES.map((k) => [k, rows.filter((row) => row.klass === k).length]),
  ) as Record<Klass, number>;
  const neverReasons = Object.fromEntries(
    (['defTouch', 'atkTouch', 'gkClaim', 'outOfPlay', 'windowExpiry'] as NeverReason[])
      .map((r) => [r, rows.filter((row) => row.neverReason === r).length]),
  ) as Record<NeverReason, number>;
  return {
    tag,
    matches,
    crosses: rows.length,
    crossesPerMatch: round(rows.length / matches, 4),
    oldCounts: {
      atkHeader: rows.filter((row) => row.oldClass === 'atkHeader').length,
      defHeader: rows.filter((row) => row.oldClass === 'defHeader').length,
      noHeader: rows.filter((row) => row.oldClass === 'noHeader').length,
    },
    // The OLD instrument, recomputed here — X4's external comparison.
    oldWay: {
      atkHeader: round(share(rows, (row) => row.oldClass === 'atkHeader')),
      defHeader: round(share(rows, (row) => row.oldClass === 'defHeader')),
      noAerial: round(share(rows, (row) => row.oldClass === 'noHeader')),
      shot: round(share(rows, (row) => row.shot)),
      goal: round(share(rows, (row) => row.goal)),
      kept: round(share(rows, (row) => row.kept)),
    },
    classCounts,
    classShares: Object.fromEntries(
      CLASSES.map((k) => [k, round(share(rows, (row) => row.klass === k))]),
    ) as Record<Klass, number>,
    neverReasons,
    arrivedShare: round(share(rows, (row) => row.arrived)),
    census: {
      n: censuses.length,
      atkWithin135: round(mean(censuses.map((c) => c.atkWithin135)), 4),
      atkWithin2: round(mean(censuses.map((c) => c.atkWithin2)), 4),
      atkWithin3: round(mean(censuses.map((c) => c.atkWithin3)), 4),
      atkWithin5: round(mean(censuses.map((c) => c.atkWithin5)), 4),
      defWithin135: round(mean(censuses.map((c) => c.defWithin135)), 4),
      nearestAtk: {
        mean: round(mean(censuses.map((c) => c.nearestAtk)), 4),
        p10: round(quantile(censuses.map((c) => c.nearestAtk), 0.1), 4),
        median: round(quantile(censuses.map((c) => c.nearestAtk), 0.5), 4),
        p90: round(quantile(censuses.map((c) => c.nearestAtk), 0.9), 4),
      },
      nearestDef: {
        mean: round(mean(censuses.map((c) => c.nearestDef)), 4),
        median: round(quantile(censuses.map((c) => c.nearestDef), 0.5), 4),
      },
      atkInBoxAtKick: round(mean(rows.map((row) => row.atkInBoxAtKick)), 4),
      defInBoxAtKick: round(mean(rows.map((row) => row.defInBoxAtKick)), 4),
      atkInBoxAtArrival: round(mean(censuses.map((c) => c.atkInBox)), 4),
      defInBoxAtArrival: round(mean(censuses.map((c) => c.defInBox)), 4),
      ballToSpot: round(mean(censuses.map((c) => c.ballToSpot)), 4),
      ballLocalX: round(mean(censuses.map((c) => c.ballLocalX)), 4),
      ballAbsY: round(mean(censuses.map((c) => c.ballAbsY)), 4),
    },
    // How each class was reached — the two triggers of C2 kept apart, and the
    // share of C1 crosses the DEFENCE dealt with (someone was there; it just
    // was not one of ours, which is not what C1 claims and must be visible).
    // Could this delivery have been headed AT ALL? The diagnostic found this
    // engine's crosses fly low; a header is impossible on a ball that never
    // rises to HEADER_MIN_HEIGHT, whoever is standing there.
    flight: {
      maxZMean: round(mean(rows.map((row) => row.maxZ)), 4),
      maxZMedian: round(quantile(rows.map((row) => row.maxZ), 0.5), 4),
      headableShare: round(share(rows, (row) => row.maxZ >= HEADER_MIN_HEIGHT)),
      headableShareAmongC1: (() => {
        const c1Rows = rows.filter((row) => row.klass === 'C1');
        return c1Rows.length === 0 ? Number.NaN
          : round(c1Rows.filter((row) => row.maxZ >= HEADER_MIN_HEIGHT).length / c1Rows.length);
      })(),
    },
    // T0b: the C2 ladder for this combination, plus the geometry it is cut
    // from — the census-geometry rule (#28.4b): measured, never asserted.
    c2Ladder: (() => {
      const c2rows = rows.filter((row) => row.klass === 'C2');
      const counts = Object.fromEntries(
        RUNGS.map((r) => [r, c2rows.filter((row) => rungOf(row) === r).length]),
      ) as Record<Rung, number>;
      return {
        n: c2rows.length,
        counts,
        shares: Object.fromEntries(RUNGS.map((r) => [r, c2rows.length === 0 ? Number.NaN
          : round(counts[r] / c2rows.length)])) as Record<Rung, number>,
        geometry: {
          // The re-aim hinges on WHICH KIND of miss H3 is: a body 0.1 m
          // outside the contest radius and a body 4 m away are the same class
          // and different worlds. Measured, never asserted (#28.4b).
          h3: (() => {
            const h3rows = c2rows.filter((row) => rungOf(row) === 'H3noContenderAtHeight'
              && Number.isFinite(row.minOutfieldDistInBand));
            const within = (r: number) => (h3rows.length === 0 ? Number.NaN
              : round(h3rows.filter((row) => row.minOutfieldDistInBand <= r).length / h3rows.length));
            return {
              n: h3rows.length,
              minOutMedian: round(quantile(h3rows.map((row) => row.minOutfieldDistInBand), 0.5), 4),
              minOutP10: round(quantile(h3rows.map((row) => row.minOutfieldDistInBand), 0.1), 4),
              minOutP90: round(quantile(h3rows.map((row) => row.minOutfieldDistInBand), 0.9), 4),
              withinTwoMetres: within(2),
              withinThreeMetres: within(3),
            };
          })(),
          // H0: how far BELOW head height these deliveries stayed.
          h0MaxZMedian: round(quantile(c2rows.filter((row) => rungOf(row) === 'H0heightPreempted')
            .map((row) => row.maxZ), 0.5), 4),
          bandTicksMean: round(mean(c2rows.map((row) => row.bandTicks)), 4),
          bandTicksMedian: round(quantile(c2rows.map((row) => row.bandTicks), 0.5), 4),
          zeroBandShare: c2rows.length === 0 ? Number.NaN
            : round(c2rows.filter((row) => row.bandTicks === 0).length / c2rows.length),
          terminalZMean: round(mean(c2rows.filter((row) => Number.isFinite(row.terminalZ))
            .map((row) => row.terminalZ)), 4),
          minOutfieldInBandMedian: round(quantile(c2rows
            .filter((row) => Number.isFinite(row.minOutfieldDistInBand))
            .map((row) => row.minOutfieldDistInBand), 0.5), 4),
          minAtkInBandMedian: round(quantile(c2rows
            .filter((row) => Number.isFinite(row.minAtkDistInBand))
            .map((row) => row.minAtkDistInBand), 0.5), 4),
        },
      };
    })(),
    classTriggers: {
      c2ByRadius: rows.filter((row) => row.klass === 'C2' && row.inRadiusAtSample).length,
      c2ByTouchOnly: rows.filter((row) => (
        row.klass === 'C2' && !row.inRadiusAtSample && row.atkTouchInWindow
      )).length,
      c1WithDefenceTouch: rows.filter((row) => row.klass === 'C1' && row.defTouchInWindow).length,
      c1Untouched: rows.filter((row) => row.klass === 'C1' && !row.defTouchInWindow).length,
    },
    c1Anatomy: {
      n: c1.length,
      nearestAtkMean: round(mean(c1.map((c) => c.nearestAtk)), 4),
      nearestAtkMedian: round(quantile(c1.map((c) => c.nearestAtk), 0.5), 4),
      nearestAtkP90: round(quantile(c1.map((c) => c.nearestAtk), 0.9), 4),
      withinTwoShare: c1.length === 0 ? Number.NaN
        : round(c1.filter((c) => c.atkWithin2 > 0).length / c1.length),
      withinThreeShare: c1.length === 0 ? Number.NaN
        : round(c1.filter((c) => c.atkWithin3 > 0).length / c1.length),
      withinFiveShare: c1.length === 0 ? Number.NaN
        : round(c1.filter((c) => c.atkWithin5 > 0).length / c1.length),
      atkInBoxMean: round(mean(c1.map((c) => c.atkInBox)), 4),
      ballToSpotMean: round(mean(c1.map((c) => c.ballToSpot)), 4),
    },
    arriver: {
      licensedShare: round(share(rows, (row) => row.hadArriver)),
      runnersAtKick: round(mean(rows.map((row) => row.runnersAtKick)), 4),
      n: withArriver.length,
      toBall: round(mean(withArriver.map((c) => c.arriverToBall!)), 4),
      toArc: round(mean(withArriver.map((c) => c.arriverToArc!)), 4),
      toSpot: round(mean(withArriver.map((c) => c.arriverToSpot!)), 4),
      // THE map's sharpest claim, measured directly.
      nearerArcShare: withArriver.length === 0 ? Number.NaN
        : round(withArriver.filter((c) => c.arriverNearerArc === true).length / withArriver.length),
    },
  };
};

const runBlock = (
  seedStart: number, budgetOf: (tag: string) => number,
  flags: { c4Flight?: boolean; c4FlightStaleLead?: boolean } = {},
) => {
  const combos: ReturnType<typeof describeCombo>[] = [];
  const pooled: CrossRow[] = [];
  for (const atk of attackers) {
    for (const shell of shells) {
      const tag = `${atk.tag} vs ${shell.tag}`;
      const { rows, matches } = harvestCombo(atk, shell, seedStart, budgetOf(tag), flags);
      combos.push(describeCombo(tag, rows, matches));
      // Cluster ids must not collide across combos when pooling.
      const offset = combos.length * 10_000;
      for (const row of rows) pooled.push({ ...row, cluster: row.cluster + offset });
    }
  }
  const pooledShares = Object.fromEntries(CLASSES.map((k, index) => [k, {
    share: round(share(pooled, (row) => row.klass === k)),
    ci: (() => {
      const ci = shareCI(pooled.map((row) => ({
        cluster: row.cluster, hit: row.klass === k ? 1 : 0,
      })), index);
      return { lower: round(ci.lower), upper: round(ci.upper) };
    })(),
  }])) as Record<Klass, { share: number; ci: { lower: number; upper: number } }>;
  const c2 = pooled.filter((row) => row.klass === 'C2');
  const ladderCounts = Object.fromEntries(
    RUNGS.map((r) => [r, c2.filter((row) => rungOf(row) === r).length]),
  ) as Record<Rung, number>;
  const ladder = Object.fromEntries(RUNGS.map((r, index) => {
    const ci = shareCI(c2.map((row) => ({
      cluster: row.cluster, hit: rungOf(row) === r ? 1 : 0,
    })), 50 + index);
    return [r, {
      count: ladderCounts[r],
      share: c2.length === 0 ? Number.NaN : round(ladderCounts[r] / c2.length),
      ci: { lower: round(ci.lower), upper: round(ci.upper) },
    }];
  })) as Record<Rung, { count: number; share: number; ci: { lower: number; upper: number } }>;

  // T1-FLIGHT's FIRES instruments, read off the LAUNCH (exact) and the path.
  const apexOf = (row: CrossRow) => row.launchApex;
  const freeFlight = pooled.filter((row) => Number.isFinite(row.launchApex));
  // F2 needs a flight that actually REACHED its apex: a delivery cut out on
  // the way up never does, and |maxZ − apex| is then large and honest.
  // `arrived` means the descent was observed, which is strictly after the
  // apex — so it also excludes a window truncated early by the NEXT cross
  // (cross-anatomy's inherited early-close rule), which the smoke caught.
  const cleanFlight = freeFlight.filter((row) => (
    row.arrived && !row.atkTouchInWindow && !row.defTouchInWindow
    && row.neverReason === null
  ));
  const f2Worst = cleanFlight.reduce(
    (worst, row) => Math.max(worst, Math.abs(row.maxZ - apexOf(row))), 0,
  );
  return {
    seedStart,
    combos,
    pooled,
    pooledCrosses: pooled.length,
    pooledShares,
    flight: {
      freeFlightN: freeFlight.length,
      notALaunchAtCapture: pooled.length - freeFlight.length,
      cleanFlightN: cleanFlight.length,
      headableByLaunch: round(share(freeFlight, (row) => apexOf(row) >= HEADER_MIN_HEIGHT)),
      headableByMaxZ: round(share(pooled, (row) => row.maxZ >= HEADER_MIN_HEIGHT)),
      apexMean: round(mean(freeFlight.map(apexOf)), 4),
      apexMedian: round(quantile(freeFlight.map(apexOf), 0.5), 4),
      maxZMean: round(mean(pooled.map((row) => row.maxZ)), 4),
      f2WorstAbsError: round(f2Worst, 8),
      bandTicksMean: round(mean(pooled.map((row) => row.bandTicks)), 4),
    },
    contestShare: round(share(pooled, (row) => row.klass === 'C3atk' || row.klass === 'C3def')),
    goalShare: round(share(pooled, (row) => row.goal)),
    shotShare: round(share(pooled, (row) => row.shot)),
    c2Pooled: c2.length,
    c2Ladder: ladder,
    // X6: the ladder partitions C2 exactly.
    ladderPartitionOk: RUNGS.reduce((sum, r) => sum + ladderCounts[r], 0) === c2.length,
    // I2's baseline: what conversion IS today, for later stages to gate against.
    conversionBaseline: {
      shotWithinWindow: round(share(pooled, (row) => row.shot)),
      goalWithinWindow: round(share(pooled, (row) => row.goal)),
    },
    // Partition check (X5): the four classes are exclusive and exhaustive.
    partitionOk: CLASSES.reduce(
      (sum, k) => sum + pooled.filter((row) => row.klass === k).length, 0,
    ) === pooled.length,
    // Checked on COUNTS, not on rounded shares: summing three 6-dp shares and
    // comparing to a fourth carries up to 1.5e-6 of rounding, which the smoke
    // duly caught. Integers cannot drift.
    rollupOk: combos.every((combo) => (
      combo.classCounts.C3atk === combo.oldCounts.atkHeader
      && combo.classCounts.C3def === combo.oldCounts.defHeader
      && combo.classCounts.C0 + combo.classCounts.C1 + combo.classCounts.C2
        === combo.oldCounts.noHeader
    )),
  };
};

const budgetOf = (tag: string): number => MATCH_BUDGET[tag]!;

/**
 * The paired cluster bootstrap for a DIFFERENCE of two rates across arms.
 * Clusters are match seeds; a drawn cluster contributes BOTH arms' rows, so
 * the same worlds are compared however the resample falls.
 */
const pairedDifferenceCI = (
  left: readonly CrossRow[], right: readonly CrossRow[],
  hit: (row: CrossRow) => boolean, offset: number,
) => {
  const byCluster = new Map<number, { l: CrossRow[]; r: CrossRow[] }>();
  const put = (row: CrossRow, side: 'l' | 'r') => {
    const bucket = byCluster.get(row.cluster) ?? { l: [], r: [] };
    bucket[side].push(row);
    byCluster.set(row.cluster, bucket);
  };
  for (const row of left) put(row, 'l');
  for (const row of right) put(row, 'r');
  const clusters = [...byCluster.values()];
  const rate = (rows: readonly CrossRow[]) =>
    (rows.length === 0 ? Number.NaN : rows.filter(hit).length / rows.length);
  const point = rate(right) - rate(left);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let lh = 0; let ln = 0; let rh = 0; let rn = 0;
    for (let index = 0; index < clusters.length; index++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      for (const row of pick.l) { ln += 1; if (hit(row)) lh += 1; }
      for (const row of pick.r) { rn += 1; if (hit(row)) rh += 1; }
    }
    if (ln > 0 && rn > 0) draws.push(rh / rn - lh / ln);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  return {
    point: round(point), lower: round(at(0.025)), upper: round(at(0.975)),
  };
};

const isContest = (row: CrossRow) => row.klass === 'C3atk' || row.klass === 'C3def';

const runExperiment = () => {
  const off = runBlock(T1_SEED_START, budgetOf, {});
  const on = runBlock(T1_SEED_START, budgetOf, { c4Flight: true });
  const stale = runBlock(T1_SEED_START, budgetOf,
    { c4Flight: true, c4FlightStaleLead: true });

  // --- F: the mechanism fires (launch-derived, sampling-free) --------------
  const f1 = on.flight.headableByLaunch === 1;
  const f2 = on.flight.f2WorstAbsError <= F2_TOLERANCE
    && off.flight.f2WorstAbsError <= F2_TOLERANCE;

  // --- D1: the deliverable — contests up -----------------------------------
  const d1 = pairedDifferenceCI(off.pooled, on.pooled, isContest, D1_BOOTSTRAP);

  // --- I2 HARD: bounded conversion increase (contract §4.5) ----------------
  const i2 = pairedDifferenceCI(off.pooled, on.pooled, (row) => row.goal, D1_BOOTSTRAP + 1);
  const shotDelta = pairedDifferenceCI(off.pooled, on.pooled, (row) => row.shot, D1_BOOTSTRAP + 2);

  // --- L: the T0b ladder re-runs (reported) --------------------------------
  const ladderOf = (arm: typeof off) => Object.fromEntries(RUNGS.map((r) => {
    const c2rows = arm.pooled.filter((row) => row.klass === 'C2');
    const n = c2rows.filter((row) => rungOf(row) === r).length;
    return [r, { count: n, share: c2rows.length === 0 ? Number.NaN : round(n / c2rows.length) }];
  })) as Record<Rung, { count: number; share: number }>;

  const h3GeometryOf = (arm: typeof off) => {
    const h3 = arm.pooled.filter((row) => row.klass === 'C2'
      && rungOf(row) === 'H3noContenderAtHeight'
      && Number.isFinite(row.minOutfieldDistInBand));
    return {
      n: h3.length,
      shareOfAllCrosses: round(h3.length / arm.pooled.length),
      minOutMedian: round(quantile(h3.map((row) => row.minOutfieldDistInBand), 0.5), 4),
      withinTwoMetres: h3.length === 0 ? Number.NaN
        : round(h3.filter((row) => row.minOutfieldDistInBand <= 2).length / h3.length),
    };
  };

  const armSummary = (arm: typeof off) => ({
    crosses: arm.pooledCrosses,
    classShares: Object.fromEntries(
      CLASSES.map((k) => [k, arm.pooledShares[k].share]),
    ) as Record<Klass, number>,
    contestShare: arm.contestShare,
    goalShare: arm.goalShare,
    shotShare: arm.shotShare,
    flight: arm.flight,
    c2Pooled: arm.c2Pooled,
    ladder: ladderOf(arm),
    h3: h3GeometryOf(arm),
    perCombo: arm.combos.map((c) => ({
      tag: c.tag, crosses: c.crosses, headable: c.flight.headableShare,
      classShares: c.classShares,
    })),
  });

  const gates = {
    f1LaunchApex: f1,
    f2ParabolaMatch: f2,
    d1ContestsUp: d1.lower > 0,
    i2ConversionBounded: i2.upper < I2_MARGIN,
    x5LadderPartition: off.ladderPartitionOk && on.ladderPartitionOk
      && stale.ladderPartitionOk,
    xPartition: off.partitionOk && on.partitionOk && stale.partitionOk,
  };

  return {
    experiment: 'C4-T1-FLIGHT (Phase A)',
    authority: 'C4-T1-FLIGHT',
    parameters: {
      seedStart: T1_SEED_START, matchBudget: MATCH_BUDGET, window: WINDOW,
      crossFlightMinS: round(CROSS_FLIGHT_MIN_S, 8),
      headerBand: [HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT],
      i2Margin: I2_MARGIN, f2Tolerance: F2_TOLERANCE,
      clusterUnit: 'match seed', arms: ['off', 'on', 'staleLead(reported)'],
    },
    arms: { off: armSummary(off), on: armSummary(on), stale: armSummary(stale) },
    d1: { statistic: 'contest share, paired cluster bootstrap', ...d1 },
    i2: {
      statistic: 'goal-within-4.0s-window, paired cluster bootstrap',
      ...i2,
      // #31.2: the point is REPORTED beside the verdict, and a pass with a
      // positive point near the margin reads "did not rise beyond resolution".
      reading: i2.upper < I2_MARGIN
        ? (i2.lower > 0 ? 'ROSE, bounded below the margin'
          : 'did not rise beyond resolution')
        : 'FIRED',
      shotDelta,
    },
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, x5Determinism: deterministic };
const output = {
  ...first, gates, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL',
};
console.log(JSON.stringify(output, null, 2));

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const pp = (v: number) => `${(v * 100).toFixed(2)}pp`;
const failed = Object.entries(output.gates).filter(([, v]) => !v).map(([k]) => k);
const a = output.arms;
console.error(
  `C4-T1-FLIGHT ${output.verdict} · crosses off ${a.off.crosses} / on ${a.on.crosses}`
  + ` · F1 headable launch ${pct(a.on.flight.headableByLaunch)}`
  + ` (off ${pct(a.off.flight.headableByLaunch)}, byMaxZ on ${pct(a.on.flight.headableByMaxZ)})`
  + ` · F2 worst |maxZ−apex| ${a.on.flight.f2WorstAbsError}`
  + ` · apex ${a.off.flight.apexMean}→${a.on.flight.apexMean} m`
  + ` · bandTicks ${a.off.flight.bandTicksMean}→${a.on.flight.bandTicksMean}`
  + ` · D1 CONTESTS ${pct(a.off.contestShare)}→${pct(a.on.contestShare)}`
  + ` = ${pp(output.d1.point)} CI[${pp(output.d1.lower)}, ${pp(output.d1.upper)}]`
  + ` · I2 goals ${pct(a.off.goalShare)}→${pct(a.on.goalShare)}`
  + ` = ${pp(output.i2.point)} CI[${pp(output.i2.lower)}, ${pp(output.i2.upper)}]`
  + ` (${output.i2.reading})`
  + ` · shots ${pp(output.i2.shotDelta.point)}`
  + ` · LADDER H0 ${pct(a.off.ladder.H0heightPreempted.share)}→${pct(a.on.ladder.H0heightPreempted.share)}`
  + ` H3 ${pct(a.off.ladder.H3noContenderAtHeight.share)}→${pct(a.on.ladder.H3noContenderAtHeight.share)}`
  + ` · H3 of all crosses ${pct(a.off.h3.shareOfAllCrosses)}→${pct(a.on.h3.shareOfAllCrosses)}`
  + ` (median ${a.off.h3.minOutMedian}→${a.on.h3.minOutMedian} m)`
  + ` · STALE-LEAD arm contests ${pct(a.stale.contestShare)} goals ${pct(a.stale.goalShare)}`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256}`,
);
