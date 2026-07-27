// C4 T0 — DEFINITIONS + THE ARRIVAL CENSUS (instrument first).
// Authority: docs/world-model/C4-T0-ARRIVAL-CENSUS.md (design contract
// C4-AERIAL-ARRIVAL.md §2 IN.1 / §3 Q6; commander ruling #27.5)
//
// Splits the conflated `noAerial` into four classes with one meaning each, and
// censuses where the licensed bodies actually are when a cross comes down.
// Builds nothing: zero `src/**`, no flag, no mechanic.
//
//   C3  HEADER            a header won inside the 4 s window (atk / def)
//   C0  NEVER-ARRIVED     touched in flight / keeper claim / out of play /
//                         window expiry BEFORE the ball became contestable
//   C1  NOBODY-THERE      it arrived; no attacker met it
//   C2  ARRIVED-NO-HEADER an attacker met it; nobody headed it
//
// ARRIVAL = the descent: from the first tick the ball is descending at or
// below HEADER_MAX_HEIGHT until it is touched, play stops, the descent ends
// or the 4 s window expires. C1/C2 are decided over the WHOLE descent, not at
// one instant — a single-instant read has the box emptier than it is, which
// is what the sizing smoke found (see the contract's §7 disclosure).
//
// Precedence is C3 → C0 → C1 → C2 (contract §3.1): a defender heading a cross
// clear in flight is both "never arrived" and `defHeader`, and header-first is
// the reading that is also true. The rollup identity is therefore true BY
// CONSTRUCTION; X4's force is the EXTERNAL comparison against the unmodified
// `cross-anatomy.ts`'s own printed output on identical staging.
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import {
  BOX_DEPTH, BOX_WIDTH, DT, HALF_L, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT,
  HEADER_RADIUS, PENALTY_SPOT_DIST,
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
const MATCHES = 250;
/** `cross-anatomy.ts`'s own WINDOW, verbatim — changing it breaks the pin. */
const WINDOW = 4;
const BUILD_SEED_START = 909_000; // cross-anatomy's staging, verbatim
const HELDOUT_SEED_START = 870_000; // fresh: 830/840 = C5 T0/T0R, 850/860 = C5 T1
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50011;
const COMBO_CROSS_FLOOR = 300;
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
  /** The sample at the tick of CLOSEST attacker approach inside the window. */
  census: ArrivalCensus | null;
  neverReason: NeverReason | null;
}

/** One (archetype × shell × block) cell: walk the matches, harvest every cross. */
const harvestCombo = (
  atk: Atk, shell: Shell, seedStart: number,
): { rows: CrossRow[]; matches: number } => {
  const rows: CrossRow[] = [];
  for (let k = 0; k < MATCHES; k++) {
    const m = new Match({
      seed: seedStart + k,
      teamA: team('ATK', atk.genome, wideStyle, atk.policy),
      teamB: team(shell.tag, shell.genome, shell.style),
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
        if (m.ball.z > open.maxZ) open.maxZ = m.ball.z;
        const t = m.ball.lastTouch;
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
          census: null,
          neverReason: null,
        };
        crosses0 = c;
      }
      if (open !== null && m.simTime > open.kickTime + WINDOW) closeWindow();
    }
    if (open !== null) closeWindow();
  }
  return { rows, matches: MATCHES };
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

const runBlock = (seedStart: number) => {
  const combos: ReturnType<typeof describeCombo>[] = [];
  const pooled: CrossRow[] = [];
  for (const atk of attackers) {
    for (const shell of shells) {
      const { rows, matches } = harvestCombo(atk, shell, seedStart);
      combos.push(describeCombo(`${atk.tag} vs ${shell.tag}`, rows, matches));
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
  return {
    seedStart,
    combos,
    pooledCrosses: pooled.length,
    pooledShares,
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

const runExperiment = () => {
  const build = runBlock(BUILD_SEED_START);
  const heldout = runBlock(HELDOUT_SEED_START);

  const stability = CLASSES.map((k) => {
    const delta = Math.abs(build.pooledShares[k].share - heldout.pooledShares[k].share);
    return { klass: k, delta: round(delta), holds: delta <= STABILITY_TOLERANCE };
  });

  const coverage = {
    buildCombos: build.combos.every((c) => c.crosses >= COMBO_CROSS_FLOOR),
    heldoutCombos: heldout.combos.every((c) => c.crosses >= COMBO_CROSS_FLOOR),
    buildPooled: build.pooledCrosses >= POOLED_CROSS_FLOOR,
    heldoutPooled: heldout.pooledCrosses >= POOLED_CROSS_FLOOR,
  };

  const gates = {
    x5Partition: build.partitionOk && heldout.partitionOk,
    x4Rollup: build.rollupOk && heldout.rollupOk,
    c1ComboCoverage: coverage.buildCombos && coverage.heldoutCombos,
    c2PooledCoverage: coverage.buildPooled && coverage.heldoutPooled,
    sStability: stability.every((row) => row.holds),
  };

  return {
    experiment: 'C4-T0',
    authority: 'C4-T0-ARRIVAL-CENSUS',
    parameters: {
      matchesPerCombo: MATCHES, window: WINDOW,
      buildSeedStart: BUILD_SEED_START, heldoutSeedStart: HELDOUT_SEED_START,
      headerRadius: HEADER_RADIUS, headerMaxHeight: HEADER_MAX_HEIGHT,
      arcInset: ARC_INSET, penaltySpotDist: round(PENALTY_SPOT_DIST, 4),
      clusterUnit: 'match seed', stabilityTolerance: STABILITY_TOLERANCE,
      comboCrossFloor: COMBO_CROSS_FLOOR, pooledCrossFloor: POOLED_CROSS_FLOOR,
    },
    build, heldout, stability, coverage, gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, dDeterministic: deterministic };
const output = {
  ...first, gates, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL',
};
console.log(JSON.stringify(output, null, 2));

const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
console.error(
  `C4-T0 ${output.verdict} · build ${output.build.pooledCrosses} crosses`
  + ` / heldout ${output.heldout.pooledCrosses}`
  + ` · classes C0 ${pct(output.build.pooledShares.C0.share)}`
  + ` C1 ${pct(output.build.pooledShares.C1.share)}`
  + ` C2 ${pct(output.build.pooledShares.C2.share)}`
  + ` C3atk ${pct(output.build.pooledShares.C3atk.share)}`
  + ` C3def ${pct(output.build.pooledShares.C3def.share)}`
  + ` · stability ${output.stability.map((s) => `${s.klass} ${(s.delta * 100).toFixed(2)}pp`).join(' ')}`
  + ` · old-way per combo ${output.build.combos.map((c) => (
    `${c.tag} atk ${(c.oldWay.atkHeader * 100).toFixed(1)}/def ${(c.oldWay.defHeader * 100).toFixed(1)}`
    + `/noAerial ${(c.oldWay.noAerial * 100).toFixed(1)} (${c.crossesPerMatch}/m)`
  )).join(' | ')}`
  + ` · arriver nearer arc ${output.build.combos.map((c) => pct(c.arriver.nearerArcShare)).join(' / ')}`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256}`,
);
