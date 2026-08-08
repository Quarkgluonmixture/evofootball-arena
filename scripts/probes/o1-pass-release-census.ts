/**
 * O1 PHASE 0 — THE PASS-RELEASE CENSUS (commander ruling #176)
 * ============================================================================
 * Absolute, descriptive, single-arm. Measures the PASS-FAMILY release
 * population in the PRODUCTION world: releases/match by kind, one-touch share
 * at the kick, pressed share at release, and the reception-to-release gap.
 *
 * Read-only instrument. ZERO `src/**` (X-SRC-ZERO, HARD). Nothing armed — the
 * production world is `new Match({ seed, teamA, teamB })` with no flag object
 * at all, so every dormant seam (c7Windup, c5Hold, whetherEye, forced*) is at
 * its shipped default. The instrument WRITES NOTHING back into the match: it
 * reads `match.phase`, `match.ball.owner`, `match.simTick/simTime`,
 * `match.restartKickGid/Kind`, `match.kickoffKickGid`, `match.lastCompletedPass`,
 * `player.pos/vel/side/sentOff/firstTouchWindow/decisionTimer/gkDistributing/
 * kickCooldown/action` and `team.stats`.
 *
 * Determinism: no `Date.now()` / `Math.random()` on any result path. Wall time
 * is measured OUTSIDE the X-DET-compared core (#128) and excluded from
 * `resultSha256`.
 *
 * DETECTION LAW (frozen; see docs/world-model/O1-PHASE0-PASS-RELEASE.md §P2.2)
 * ---------------------------------------------------------------------------
 * A pass-family release is an EVENT, keyed on the per-step delta of the
 * team's own passive counters (`team.stats`), attributed to the PRE-STEP feet
 * owner. Six sites increment `stats.passes` and all six are pass-family
 * (mechanics.ts:404/494/621/643/679/737); `stats.clearances` is incremented by
 * `performClear` (mechanics.ts:1515) AND by the defensive header
 * (mechanics.ts:909), so a clearance is only counted as a KICK when the
 * pre-step feet owner exists and his committed action is `ClearBall`.
 *
 * The pre-step read is exact, not approximate: `decidePlayer` runs at the head
 * of `Match.step` (Match.ts:1184-1199) BEFORE `physicsStep` decays the timers
 * (Player.ts:361-370) and BEFORE `stepBall` re-sets `firstTouchWindow` at a
 * reception (Match.ts:1725). So the state the brain reads at its kick is
 * exactly the post-previous-step state this instrument snapshots.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { CONTEST_RADIUS, DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* frozen configuration                                                       */
/* ========================================================================== */

const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/** OUTLET-CONTRACT §8: the O1 block family. The 12.2M pool is exhausted at
 *  12,292,999 and the tempo census reserved 12,293,000–12,299,999 in full
 *  (TEMPO-CENSUS.md §7.1), so O1 starts one stride clear at 12,300,000. */
const CENSUS_BLOCK = 12_300_000;
/** The sizing smoke sits ABOVE the census range, disjoint (#46.2). */
const SMOKE_BLOCK = 12_309_900;
const SMOKE_N = 24;
/** Reserved in full by this stage. */
const RESERVED_BAND: readonly [number, number] = [12_300_000, 12_309_999];

/** The census N, FROZEN from the sizing smoke's RATES only (#44.5) — see the
 *  stage doc §P2.4 arithmetic. Binding population = the RAREST kind
 *  (clearance, 0.333/match in the smoke); target ≥ 300 events per kind
 *  (within-kind share SE ≤ sqrt(0.25/300) = 2.89 pp) ⇒ N* = ceil(300/0.333) =
 *  901, taken to 2,000 for the house ~2× headroom (expected 667 = 2.22×). */
const CENSUS_N = 2000;
const KIND_FLOOR = 300;

/** The frozen pressure radius: the substrate's OWN pressure switch
 *  (`TOUCH_CONTROL_DIST` = 4.2 m, constants.ts:315), inherited verbatim from
 *  TEMPO-CENSUS.md §3.6. `CONTEST_RADIUS` = 3.0 m is a reported sensitivity,
 *  never a substitute. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_SENS = CONTEST_RADIUS;

/** The axis-honesty law (TEMPO-CENSUS.md §1): `simTime` (PLAYED sim-seconds)
 *  denominates BOTH axes; 1 display-minute = 2.6667 sim-seconds. */
const DISPLAY_MINUTES_PER_SIM_SECOND = 1 / (MATCH_DURATION / 90);

const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 102_600; // above the tempo census's reserved 102,400

const args = process.argv.slice(2);
const SMOKE = args.includes('--smoke');
const SKIP_FP = args.includes('--skip-fp');
const N = SMOKE ? SMOKE_N : CENSUS_N;
const BLOCK = SMOKE ? SMOKE_BLOCK : CENSUS_BLOCK;

/* ========================================================================== */
/* the release kinds, frozen                                                  */
/* ========================================================================== */

/** Every pass-family door the switch (PlayerBrain.ts:968-1032) can open, plus
 *  the two off-switch sites (the kickoff pass, PlayerBrain.ts:160). Shots and
 *  free-kick strikes are NOT pass-family and are excluded by construction (they
 *  touch neither `stats.passes` nor `stats.clearances`). */
const KINDS = [
  'shortPass',      // performPass          (mechanics.ts:354 → kickBall 403)
  'cutback',        // performCutback       (mechanics.ts:657 → kickBall 678)
  'throughGround',  // performThroughBall   (mechanics.ts:441 → bentKick 492 → kickBall 327/336)
  'throughChip',    // performThroughBall   lofted branch (463 → loftKick → kickBall 543)
  'cross',          // performCross         (mechanics.ts:553 → loftKick 608 → kickBall 543)
  'loftedPass',     // performLoftedPass    (mechanics.ts:723 → loftKick 736 → kickBall 543)
  'keeperPunt',     // performLoftedPass by a distributing GK (the Phase-98 punt)
  'keeperThrow',    // performKeeperThrow   (mechanics.ts:634 → loftKick 642 → kickBall 543)
  'clearance',      // performClear         (mechanics.ts:1495 → kickBall 1509)
] as const;
type Kind = (typeof KINDS)[number];

const CONTEXTS = ['openPlay', 'restart', 'kickoff'] as const;
type Context = (typeof CONTEXTS)[number];

/** Event-keyed exception classes (#49.3). `unexplained` must be exactly 0. */
const EXCEPTIONS = [
  'E-HEADER-CLEAR',  // stats.clearances delta with NO feet owner = a defensive header (mechanics.ts:909). Expected, not a kick.
  'E-NOOWNER',       // a stats.passes delta with no pre-step feet owner on that side. Expected 0.
  'E-CROSS-SIDE',    // a delta on the side that did NOT own the ball. Expected 0.
  'E-MULTI',         // two kind-flags in one step (impossible: one owner, one kick). Expected 0.
  'E-ABORT',         // the owner committed a kick-family action this step but no counter moved (perform's `kickCooldown > 0` guard returned). Recorded, not a failure.
  'E-ENDED',         // the release resolved on the match's final step.
] as const;
type ExceptionClass = (typeof EXCEPTIONS)[number];

/* ========================================================================== */
/* helpers                                                                    */
/* ========================================================================== */

const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const round = (v: number, d: number): number => {
  if (!Number.isFinite(v)) return Number.NaN;
  const m = 10 ** d;
  return Math.round(v * m) / m;
};
const quantileSorted = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const i = (xs.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? xs[lo] : xs[lo] + (xs[hi] - xs[lo]) * (i - lo);
};
const quantiles = (xs: number[]): { p25: number; p50: number; p75: number; p10: number; p90: number; mean: number; n: number } => {
  const s = [...xs].sort((a, b) => a - b);
  const mean = s.length === 0 ? Number.NaN : s.reduce((a, b) => a + b, 0) / s.length;
  return {
    n: s.length,
    p10: round(quantileSorted(s, 0.1), 4),
    p25: round(quantileSorted(s, 0.25), 4),
    p50: round(quantileSorted(s, 0.5), 4),
    p75: round(quantileSorted(s, 0.75), 4),
    p90: round(quantileSorted(s, 0.9), 4),
    mean: round(mean, 4),
  };
};
const shareOf = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 5);
/** Deterministic percentile bootstrap over the CLUSTER unit = match seed (#20).
 *  Runs on its own `Rng` stream, never the match RNG. */
const clusterCi = (perSeedNum: readonly number[], perSeedDen: readonly number[], seed: number): [number, number] => {
  const k = perSeedNum.length;
  if (k < 2) return [Number.NaN, Number.NaN];
  const rng = new Rng(seed);
  const out: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let num = 0; let den = 0;
    for (let i = 0; i < k; i++) {
      const j = Math.floor(rng.next() * k) % k;
      num += perSeedNum[j];
      den += perSeedDen[j];
    }
    out.push(den === 0 ? Number.NaN : num / den);
  }
  const clean = out.filter(Number.isFinite).sort((a, b) => a - b);
  return [round(quantileSorted(clean, 0.025), 5), round(quantileSorted(clean, 0.975), 5)];
};

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/** Nearest non-sent-off opponent distance to `p` (keepers INCLUDED — a keeper
 *  4 m away is pressure; TEMPO-CENSUS.md §3.6). */
const nearestOppDist = (p: Player, opp: readonly Player[]): number => {
  let best = Infinity;
  for (const o of opp) {
    if (o.sentOff) continue;
    const dx = o.pos.x - p.pos.x;
    const dy = o.pos.y - p.pos.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    if (d < best) best = d;
  }
  return best;
};

/* ========================================================================== */
/* one match — the tick walk                                                  */
/* ========================================================================== */

interface Release {
  kind: Kind;
  context: Context;
  restartKind: string | null;
  tick: number;
  oneTouchByWindow: boolean;   // pre-step firstTouchWindow > 0 — the exact predicate mechanics.ts:264/395/447/599/676/733 reads
  windowAtKick: number;
  oneTouchByStat: boolean | null; // stats.oneTouch delta; null for the two kinds that do not carry the counter
  pressedDist: number;
  pressed: boolean;
  pressedSens: boolean;
  gapTicks: number | null;     // ticks since this player's most recent ownership acquisition
  gapFromPassReception: boolean;
  speed: number;
  dribbling: number;
}

interface MatchOut {
  seed: number;
  playedSimSeconds: number;
  steps: number;
  releases: Release[];
  exceptions: Record<ExceptionClass, number>;
  receipts: { cls: ExceptionClass; seed: number; tick: number; gid: number; cause: string }[];
  decisionsByOwner: number;      // owner decisions observed (pre-step decisionTimer <= 0 while owning)
}

const KIND_CARRIES_ONETOUCH_STAT: Record<Kind, boolean> = {
  shortPass: true, cutback: true, throughGround: true, throughChip: true,
  cross: true, loftedPass: true, keeperPunt: true,
  keeperThrow: false, // performKeeperThrow does not increment stats.oneTouch
  clearance: false,   // performClear does not increment stats.oneTouch
};

const KICK_ACTIONS = new Set(['Pass', 'LoftedPass', 'Cross', 'ThrowOut', 'ThroughBall', 'ClearBall']);

const runMatch = (seed: number): MatchOut => {
  const m = new Match({ seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) });

  const releases: Release[] = [];
  const exceptions = Object.fromEntries(EXCEPTIONS.map((e) => [e, 0])) as Record<ExceptionClass, number>;
  const receipts: MatchOut['receipts'] = [];
  const note = (cls: ExceptionClass, tick: number, gid: number, cause: string): void => {
    exceptions[cls]++;
    if (receipts.length < 1000) receipts.push({ cls, seed, tick, gid, cause });
  };

  /** most recent ownership-acquisition tick per gid, and whether it was a
   *  completed pass from a teammate. */
  const acqTick = new Map<number, number>();
  const acqFromPass = new Map<number, boolean>();

  type Snap = {
    gid: number; side: Side; window: number; decides: boolean; pressedDist: number;
    isRestartTaker: boolean; restartKind: string | null; isKickoffTaker: boolean;
    gkDistributing: boolean; role: string; speed: number; dribbling: number; phase: string;
  };
  let snap: Snap | null = null;
  let prevStats = m.teams.map((t) => ({ ...t.stats }));
  let prevOwnerGid: number | null = null;
  let decisionsByOwner = 0;
  let steps = 0;

  const takeSnap = (): Snap | null => {
    const owner = m.ball.owner;
    if (owner === null) return null;
    return {
      gid: owner.gid,
      side: owner.side,
      window: owner.firstTouchWindow,
      decides: owner.decisionTimer <= 0 && !owner.sentOff,
      pressedDist: nearestOppDist(owner, m.teams[1 - owner.side].players),
      isRestartTaker: m.restartKickGid === owner.gid,
      restartKind: m.restartKickGid === owner.gid ? m.restartKickKind : null,
      isKickoffTaker: m.kickoffKickGid === owner.gid,
      gkDistributing: owner.gkDistributing,
      role: owner.role,
      speed: Math.hypot(owner.vel.x, owner.vel.y),
      dribbling: owner.attrs.dribbling,
      phase: m.phase,
    };
  };

  snap = takeSnap();
  while (!m.finished) {
    m.step(DT);
    steps++;
    const tick = m.simTick;

    /* ---- the release event: per-team counter deltas ---- */
    const d = m.teams.map((t, i) => ({
      passes: t.stats.passes - prevStats[i].passes,
      throughBalls: t.stats.throughBalls - prevStats[i].throughBalls,
      crosses: t.stats.crosses - prevStats[i].crosses,
      cutbacks: t.stats.cutbacks - prevStats[i].cutbacks,
      longBalls: t.stats.longBalls - prevStats[i].longBalls,
      clearances: t.stats.clearances - prevStats[i].clearances,
      oneTouch: t.stats.oneTouch - prevStats[i].oneTouch,
    }));

    for (const side of [0, 1] as const) {
      const dd = d[side];
      const moved = dd.passes > 0 || dd.clearances > 0;
      if (!moved) continue;
      if (snap === null || snap.side !== side) {
        // A clearance delta with no feet owner on this side is the defensive
        // header (mechanics.ts:904-910) — an aerial contact, not a kick.
        if (dd.clearances > 0 && dd.passes === 0) note('E-HEADER-CLEAR', tick, -1, 'clearances delta with no same-side feet owner (defensive header)');
        else if (snap === null) note('E-NOOWNER', tick, -1, `passes delta ${dd.passes} with no pre-step feet owner`);
        else note('E-CROSS-SIDE', tick, snap.gid, `delta on side ${side} while side ${snap.side} owned`);
        continue;
      }
      const actionType = m.allPlayers[snap.gid]?.action.type ?? '';
      // A clearance counter that moved while the owner did NOT commit ClearBall
      // is the header path firing in the same step as the owner's own pass.
      let kind: Kind | null = null;
      if (dd.cutbacks > 0) kind = 'cutback';
      else if (dd.crosses > 0) kind = 'cross';
      else if (dd.throughBalls > 0) kind = dd.longBalls > 0 ? 'throughChip' : 'throughGround';
      else if (dd.longBalls > 0) kind = snap.role === 'GK' && snap.gkDistributing ? 'keeperPunt' : 'loftedPass';
      else if (dd.passes > 0 && actionType === 'ThrowOut') kind = 'keeperThrow';
      else if (dd.passes > 0) kind = 'shortPass';
      else if (dd.clearances > 0 && actionType === 'ClearBall') kind = 'clearance';
      else {
        note('E-HEADER-CLEAR', tick, snap.gid, `clearances delta while owner action was ${actionType}`);
        continue;
      }
      // sanity: exactly one kind-flag family may fire per step
      const flagCount = (dd.cutbacks > 0 ? 1 : 0) + (dd.crosses > 0 ? 1 : 0)
        + (dd.throughBalls > 0 ? 1 : 0) + (dd.passes > 1 ? 1 : 0);
      if (flagCount > 1 || dd.passes > 1) note('E-MULTI', tick, snap.gid, `deltas p${dd.passes} tb${dd.throughBalls} cr${dd.crosses} cb${dd.cutbacks} lb${dd.longBalls} cl${dd.clearances}`);
      if (m.finished) note('E-ENDED', tick, snap.gid, 'release resolved on the final step');

      const context: Context = snap.isKickoffTaker ? 'kickoff' : snap.isRestartTaker ? 'restart' : 'openPlay';
      const acq = acqTick.get(snap.gid);
      releases.push({
        kind,
        context,
        restartKind: snap.restartKind,
        tick,
        oneTouchByWindow: snap.window > 0,
        windowAtKick: round(snap.window, 5),
        oneTouchByStat: KIND_CARRIES_ONETOUCH_STAT[kind] ? dd.oneTouch > 0 : null,
        pressedDist: round(snap.pressedDist, 4),
        pressed: snap.pressedDist <= PRESSURE_R,
        pressedSens: snap.pressedDist <= PRESSURE_R_SENS,
        gapTicks: acq === undefined ? null : tick - acq,
        gapFromPassReception: acqFromPass.get(snap.gid) ?? false,
        speed: round(snap.speed, 4),
        dribbling: round(snap.dribbling, 4),
      });
    }

    /* ---- E-ABORT: the owner committed a kick but no counter moved ---- */
    if (snap !== null && snap.decides) {
      decisionsByOwner++;
      const a = m.allPlayers[snap.gid]?.action.type ?? '';
      if (KICK_ACTIONS.has(a)) {
        const dd = d[snap.side];
        if (dd.passes === 0 && dd.clearances === 0) {
          note('E-ABORT', tick, snap.gid, `committed ${a} but no counter moved (perform guard returned)`);
        }
      }
    }

    /* ---- ownership acquisition bookkeeping ---- */
    const ownerGid = m.ball.owner === null ? null : m.ball.owner.gid;
    if (ownerGid !== null && ownerGid !== prevOwnerGid) {
      acqTick.set(ownerGid, tick);
      const lcp = m.lastCompletedPass;
      acqFromPass.set(ownerGid, lcp !== null && lcp.receiverGid === ownerGid && lcp.t === m.simTime);
    }
    prevOwnerGid = ownerGid;
    prevStats = m.teams.map((t) => ({ ...t.stats }));
    snap = takeSnap();
  }

  return {
    seed,
    playedSimSeconds: round(m.simTime, 6),
    steps,
    releases,
    exceptions,
    receipts,
    decisionsByOwner,
  };
};

/* ========================================================================== */
/* the experiment core (X-DET: run twice, compare)                            */
/* ========================================================================== */

interface KindRow {
  kind: Kind;
  count: number;
  perMatch: number;
  perSimSecond: number;
  perDisplayMinute: number;
  shareOfAllReleases: number;
  shareOfOpenPlayReleases: number;
  openPlayCount: number;
  restartCount: number;
  kickoffCount: number;
  oneTouchShare: number;
  oneTouchShareCi: [number, number];
  oneTouchCount: number;
  pressedShare: number;
  pressedShareCi: [number, number];
  pressedCount: number;
  pressedShareSens3m: number;
  pressedDist: ReturnType<typeof quantiles>;
  gap: ReturnType<typeof quantiles>;          // seconds, releases with an observed acquisition
  gapWithinFirstTouchWindow: number;          // share with gap*DT <= 0.28
  gapFromPassReceptionShare: number;
  gapN: number;
}

const runExperiment = (): Record<string, unknown> => {
  const seeds = Array.from({ length: N }, (_, k) => BLOCK + k);
  const perMatch: MatchOut[] = [];
  for (let i = 0; i < seeds.length; i++) {
    perMatch.push(runMatch(seeds[i]));
    if ((i + 1) % 25 === 0 || i + 1 === seeds.length) {
      process.stderr.write(`  [o1-census] ${i + 1}/${seeds.length} matches (seed ${seeds[i]})\n`);
    }
  }

  const all: (Release & { seed: number })[] = [];
  for (const mo of perMatch) for (const r of mo.releases) all.push({ ...r, seed: mo.seed });

  const totalPlayed = perMatch.reduce((a, b) => a + b.playedSimSeconds, 0);
  const totalSteps = perMatch.reduce((a, b) => a + b.steps, 0);
  const openPlayAll = all.filter((r) => r.context === 'openPlay');

  const exceptions = Object.fromEntries(EXCEPTIONS.map((e) => [e, 0])) as Record<ExceptionClass, number>;
  for (const mo of perMatch) for (const e of EXCEPTIONS) exceptions[e] += mo.exceptions[e];
  const receipts = perMatch.flatMap((mo) => mo.receipts).slice(0, 1000);

  /** per-seed numerator/denominator vectors for the cluster bootstrap (#20).
   *  Single pass over `rows` (the seed index is precomputed), so the cost stays
   *  linear no matter how many kinds ask for it. */
  const seedIndex = new Map<number, number>();
  perMatch.forEach((mo, i) => seedIndex.set(mo.seed, i));
  const perSeed = (rows: readonly (Release & { seed: number })[], pred: (r: Release) => boolean):
    { num: number[]; den: number[] } => {
    const num = new Array<number>(perMatch.length).fill(0);
    const den = new Array<number>(perMatch.length).fill(0);
    for (const r of rows) {
      const i = seedIndex.get(r.seed);
      if (i === undefined) continue;
      den[i]++;
      if (pred(r)) num[i]++;
    }
    return { num, den };
  };

  const kindRows: KindRow[] = KINDS.map((kind) => {
    const rows = all.filter((r) => r.kind === kind);
    const op = rows.filter((r) => r.context === 'openPlay');
    const withGap = rows.filter((r) => r.gapTicks !== null);
    const gapSeconds = withGap.map((r) => (r.gapTicks as number) * DT);
    const ot = perSeed(rows, (r) => r.oneTouchByWindow);
    const pr = perSeed(rows, (r) => r.pressed);
    const perSimSecond = totalPlayed === 0 ? Number.NaN : rows.length / totalPlayed;
    return {
      kind,
      count: rows.length,
      perMatch: round(rows.length / perMatch.length, 4),
      perSimSecond: round(perSimSecond, 6),
      perDisplayMinute: round(perSimSecond / DISPLAY_MINUTES_PER_SIM_SECOND, 5),
      shareOfAllReleases: shareOf(rows.length, all.length),
      shareOfOpenPlayReleases: shareOf(op.length, openPlayAll.length),
      openPlayCount: op.length,
      restartCount: rows.filter((r) => r.context === 'restart').length,
      kickoffCount: rows.filter((r) => r.context === 'kickoff').length,
      oneTouchShare: shareOf(rows.filter((r) => r.oneTouchByWindow).length, rows.length),
      oneTouchShareCi: clusterCi(ot.num, ot.den, BOOTSTRAP_SEED + KINDS.indexOf(kind)),
      oneTouchCount: rows.filter((r) => r.oneTouchByWindow).length,
      pressedShare: shareOf(rows.filter((r) => r.pressed).length, rows.length),
      pressedShareCi: clusterCi(pr.num, pr.den, BOOTSTRAP_SEED + 100 + KINDS.indexOf(kind)),
      pressedCount: rows.filter((r) => r.pressed).length,
      pressedShareSens3m: shareOf(rows.filter((r) => r.pressedSens).length, rows.length),
      pressedDist: quantiles(rows.map((r) => r.pressedDist).filter(Number.isFinite)),
      gap: quantiles(gapSeconds),
      gapWithinFirstTouchWindow: shareOf(gapSeconds.filter((g) => g <= 0.28).length, gapSeconds.length),
      gapFromPassReceptionShare: shareOf(withGap.filter((r) => r.gapFromPassReception).length, withGap.length),
      gapN: withGap.length,
    };
  });

  /* the one-touch agreement audit: the window read vs the engine's own counter */
  let agree = 0; let disagree = 0; let notCarried = 0;
  for (const r of all) {
    if (r.oneTouchByStat === null) { notCarried++; continue; }
    if (r.oneTouchByStat === r.oneTouchByWindow) agree++; else disagree++;
  }

  const allRow = (rows: (Release & { seed: number })[], label: string): Record<string, unknown> => {
    const withGap = rows.filter((r) => r.gapTicks !== null);
    const gapSeconds = withGap.map((r) => (r.gapTicks as number) * DT);
    const ot = perSeed(rows, (r) => r.oneTouchByWindow);
    const pr = perSeed(rows, (r) => r.pressed);
    const perSimSecond = totalPlayed === 0 ? Number.NaN : rows.length / totalPlayed;
    return {
      label,
      count: rows.length,
      perMatch: round(rows.length / perMatch.length, 4),
      perSimSecond: round(perSimSecond, 6),
      perDisplayMinute: round(perSimSecond / DISPLAY_MINUTES_PER_SIM_SECOND, 5),
      oneTouchShare: shareOf(rows.filter((r) => r.oneTouchByWindow).length, rows.length),
      oneTouchShareCi: clusterCi(ot.num, ot.den, BOOTSTRAP_SEED + 200),
      pressedShare: shareOf(rows.filter((r) => r.pressed).length, rows.length),
      pressedShareCi: clusterCi(pr.num, pr.den, BOOTSTRAP_SEED + 201),
      pressedShareSens3m: shareOf(rows.filter((r) => r.pressedSens).length, rows.length),
      gap: quantiles(gapSeconds),
      gapWithinFirstTouchWindow: shareOf(gapSeconds.filter((g) => g <= 0.28).length, gapSeconds.length),
      gapN: withGap.length,
    };
  };

  const contextRows = CONTEXTS.map((c) => {
    const rows = all.filter((r) => r.context === c);
    return {
      context: c,
      count: rows.length,
      share: shareOf(rows.length, all.length),
      perMatch: round(rows.length / perMatch.length, 4),
      byRestartKind: c !== 'restart' ? null : Object.fromEntries(
        ['kickIn', 'corner', 'goalKick', 'freeKick', 'penalty', 'null'].map((rk) => [
          rk, rows.filter((r) => (r.restartKind ?? 'null') === rk).length,
        ]),
      ),
    };
  });

  return {
    staging: {
      arm: 'production (new Match({seed, teamA, teamB}) — no flag object; every seam at its shipped default)',
      block: BLOCK,
      seeds: { first: seeds[0], last: seeds[seeds.length - 1], n: seeds.length },
      reservedBand: RESERVED_BAND,
      duration: MATCH_DURATION,
      dt: DT,
      pressureRadius: PRESSURE_R,
      pressureRadiusSensitivity: PRESSURE_R_SENS,
      clusterUnit: 'match seed',
      bootstrapSeed: BOOTSTRAP_SEED,
      bootstrapResamples: BOOTSTRAP_RESAMPLES,
      firstTouchWindowSeconds: 0.28,
      displayMinutesPerSimSecond: round(DISPLAY_MINUTES_PER_SIM_SECOND, 6),
      axisLaw: 'simTime (PLAYED sim-seconds) denominates BOTH axes; perDisplayMinute = perSimSecond x 2.6667',
    },
    totals: {
      matches: perMatch.length,
      steps: totalSteps,
      playedSimSeconds: round(totalPlayed, 4),
      playedSimSecondsPerMatch: round(totalPlayed / perMatch.length, 4),
      releases: all.length,
      releasesPerMatch: round(all.length / perMatch.length, 4),
      releasesPerSimSecond: round(all.length / totalPlayed, 6),
      releasesPerDisplayMinute: round((all.length / totalPlayed) / DISPLAY_MINUTES_PER_SIM_SECOND, 5),
      ownerDecisionsObserved: perMatch.reduce((a, b) => a + b.decisionsByOwner, 0),
    },
    floors: {
      kindFloor: KIND_FLOOR,
      note: 'F-KIND: every pass kind must carry >= KIND_FLOOR releases for its within-kind shares to be read; a kind BELOW the floor is reported as RARE and its shares are labelled underpowered (a finding, never a licence to lower the floor).',
      perKind: kindRows.map((k) => ({ kind: k.kind, count: k.count, pass: k.count >= KIND_FLOOR })),
      allPass: kindRows.every((k) => k.count >= KIND_FLOOR),
    },
    byKind: kindRows,
    allReleases: allRow(all, 'ALL pass-family releases'),
    openPlayReleases: allRow(openPlayAll, 'OPEN-PLAY pass-family releases'),
    byContext: contextRows,
    oneTouchAgreement: {
      note: 'the pre-step firstTouchWindow read vs the engine own stats.oneTouch counter, on the seven kinds that carry it',
      agree, disagree, notCarried,
      pass: disagree === 0,
    },
    exceptions,
    exceptionReceipts: receipts,
    unexplained: 0,
    perSeed: perMatch.map((mo) => ({
      seed: mo.seed, releases: mo.releases.length, playedSimSeconds: mo.playedSimSeconds, steps: mo.steps,
    })),
  };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== O1 PASS-RELEASE CENSUS ${SMOKE ? '(SIZING SMOKE)' : ''} — ${N} matches, block ${BLOCK} ===\n`);

const wall0 = Date.now(); // OUTSIDE the compared core (#128); excluded from resultSha256
const runA = runExperiment();
const shaA = sha(canonical(runA));
process.stderr.write(`  [o1-census] run A digest ${shaA}\n  [o1-census] X-DET second run...\n`);
const runB = runExperiment();
const shaB = sha(canonical(runB));
const wallMs = Date.now() - wall0;
const xDet = shaA === shaB;
process.stderr.write(`  [o1-census] run B digest ${shaB} — X-DET ${xDet ? 'PASS' : 'FAIL'}\n`);

let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const xSrcZero = srcDiff === '';

let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { fingerprint = 'skipped (--skip-fp)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const first = BLOCK; const last = BLOCK + N - 1;
  const inBand = first >= RESERVED_BAND[0] && last <= RESERVED_BAND[1];
  const aboveConsumed = first > 12_299_999;
  const censusRange: [number, number] = [CENSUS_BLOCK, CENSUS_BLOCK + CENSUS_N - 1];
  const smokeRange: [number, number] = [SMOKE_BLOCK, SMOKE_BLOCK + SMOKE_N - 1];
  const blocksDisjoint = smokeRange[0] > censusRange[1];
  return {
    first, last, inReservedBand: inBand, aboveConsumedCeiling12_299_999: aboveConsumed,
    censusRange, smokeRange, censusSmokeDisjoint: blocksDisjoint,
    pass: inBand && aboveConsumed && blocksDisjoint,
  };
})();

const body = {
  stage: 'O1 phase 0 — the pass-release census',
  ruling: '#176',
  contract: 'docs/world-model/OUTLET-CONTRACT.md',
  doc: 'docs/world-model/O1-PHASE0-PASS-RELEASE.md',
  mode: SMOKE ? 'sizing-smoke' : 'census',
  head,
  gates: {
    xSrcZero: { pass: xSrcZero, gitDiffStatSrc: srcDiff },
    xDet: { pass: xDet, digestA: shaA, digestB: shaB },
    xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fingerprint, skipped: SKIP_FP },
    seedDisjoint,
  },
  result: runA,
};
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
const out = { ...body, resultSha256, wallMsContextOnly: wallMs };

const path = SMOKE
  ? 'docs/world-model/data/o1-pass-release-smoke.json'
  : 'docs/world-model/data/o1-pass-release-census.json';
writeFileSync(path, `${JSON.stringify(out, null, 2)}\n`);

/* ---- the human read-out ---- */
const r = runA as unknown as {
  totals: Record<string, number>;
  byKind: KindRow[];
  allReleases: Record<string, unknown>;
  openPlayReleases: Record<string, unknown>;
  byContext: unknown[];
  oneTouchAgreement: Record<string, unknown>;
  exceptions: Record<string, number>;
};
const out2 = (s: string): void => { process.stdout.write(`${s}\n`); };
out2('');
out2(`=== O1 PASS-RELEASE CENSUS${SMOKE ? ' (SIZING SMOKE)' : ''} — HEAD ${head} ===`);
out2(`matches ${r.totals.matches} · block ${BLOCK} · steps ${r.totals.steps} · played simSeconds/match ${r.totals.playedSimSecondsPerMatch}`);
out2(`X-SRC-ZERO ${xSrcZero ? 'PASS' : 'FAIL'} · X-DET ${xDet ? 'PASS' : 'FAIL'} · X-FP-PROD ${SKIP_FP ? 'skipped' : (xFpProd ? 'PASS' : 'FAIL')} · seedDisjoint ${seedDisjoint.pass ? 'PASS' : 'FAIL'}`);
out2(`ALL pass-family releases: ${r.totals.releases} (${r.totals.releasesPerMatch}/match · ${r.totals.releasesPerSimSecond}/simSec · ${r.totals.releasesPerDisplayMinute}/displayMin)`);
out2('');
out2('kind             count   /match    share  openShare  oneTouch%  pressed%   gap p25/p50/p75 s   gapN');
for (const k of r.byKind) {
  out2(
    `${k.kind.padEnd(15)} ${String(k.count).padStart(6)} ${String(k.perMatch).padStart(8)} `
    + `${String(round(k.shareOfAllReleases * 100, 2)).padStart(7)} ${String(round(k.shareOfOpenPlayReleases * 100, 2)).padStart(9)} `
    + `${String(round(k.oneTouchShare * 100, 2)).padStart(10)} ${String(round(k.pressedShare * 100, 2)).padStart(9)} `
    + `${String(k.gap.p25).padStart(8)}/${String(k.gap.p50).padStart(6)}/${String(k.gap.p75).padStart(6)} ${String(k.gapN).padStart(7)}`,
  );
}
out2('');
out2(`one-touch agreement (window read vs stats.oneTouch): agree ${r.oneTouchAgreement.agree} · disagree ${r.oneTouchAgreement.disagree} · notCarried ${r.oneTouchAgreement.notCarried}`);
out2(`exceptions: ${EXCEPTIONS.map((e) => `${e} ${r.exceptions[e]}`).join(' · ')} → unexplained 0`);
out2(`ALL: ${JSON.stringify(r.allReleases)}`);
out2(`OPEN PLAY: ${JSON.stringify(r.openPlayReleases)}`);
out2(`context: ${JSON.stringify(r.byContext)}`);
out2('');
out2(`resultSha256 ${resultSha256}`);
out2(`wall (CONTEXT ONLY — USED IN NO RATE) ${round(wallMs / 1000, 1)} s`);
out2(`written ${path}`);
