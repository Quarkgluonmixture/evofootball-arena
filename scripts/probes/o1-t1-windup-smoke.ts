/**
 * O1 T1 — THE ARMED SMOKE (commander rulings #178.4 / #179.2)
 * ============================================================================
 * The C7-T1-form REPORTED gates for the dormant shortPass wind-up seam:
 *   G12 the REALIZED W DISTRIBUTION on shortPass arms (p10/p50/p90, mean),
 *       the realized wind-up share, and the observed one-touch bypass share;
 *   G13 the INTERRUPTION CENSUS — rate + cause mix (the C7-T1 3.52% reference).
 * Plus the plumbing gates it can carry itself: G9 X-DET (the whole core runs
 * twice, digests compared), G10 seed disjointness (proved in-probe), G1
 * X-FP-PROD (the production fingerprint, flag ABSENT).
 *
 * SINGLE ARM, no fork, no comparison: every match here runs with
 * `o1PassWindup: true`. That is the ONLY flag set — everything else is the
 * shipped default. The armed world is NOT the production world and no number
 * here is a football claim (see the doc's §GATES epistemic-honesty note).
 *
 * HOW IT OBSERVES (no `src/**` instrumentation): the probe wraps the two PUBLIC
 * Match methods on its own instance — `armPendingPass` and `performPass` — to
 * record arm and release events, and reads `match.pendingPassWindup` /
 * `phase` / `ball.owner` / the passer's `stunTimer|sentOff|kickCooldown|
 * firstTouchWindow` once per tick. The wrappers call through unchanged, add no
 * rng and write nothing back, so the armed world is exactly the armed world (a
 * determinism check on the wrapped run is X-DET below).
 *
 * Determinism: no `Date.now()` / `Math.random()` on any result path; wall time
 * is measured OUTSIDE the compared core and excluded from `resultSha256`.
 *
 * Seeds (docs/world-model/O1-T1-PASS-WINDUP.md §SEED LEDGER): block
 * 12,302,000, 40 matches ⇒ 12,302,000–12,302,039 — inside the reserved band
 * 12,300,000–12,309,999, strictly above the consumed census ceiling
 * 12,301,999, strictly below the phase-0 sizing smoke 12,309,900.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* frozen configuration                                                       */
/* ========================================================================== */

const BLOCK = 12_302_000;
const N = 40;
const RESERVED_BAND: [number, number] = [12_300_000, 12_309_999];
const CENSUS_RANGE: [number, number] = [12_300_000, 12_301_999]; // O1 phase-0 census
const PHASE0_SMOKE_RANGE: [number, number] = [12_309_900, 12_309_923];
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
/** The C7-T1 measured shot interruption rate — a REFERENCE POINT, not a gate. */
const C7_T1_INTERRUPTION_RATE = 0.0352;
const SKIP_FP = process.argv.includes('--skip-fp');

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
const quantiles = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return {
    n: s.length,
    p10: round(quantileSorted(s, 0.1), 4),
    p25: round(quantileSorted(s, 0.25), 4),
    p50: round(quantileSorted(s, 0.5), 4),
    p75: round(quantileSorted(s, 0.75), 4),
    p90: round(quantileSorted(s, 0.9), 4),
    mean: round(s.length === 0 ? Number.NaN : s.reduce((a, b) => a + b, 0) / s.length, 4),
    min: s.length === 0 ? Number.NaN : s[0],
    max: s.length === 0 ? Number.NaN : s[s.length - 1],
  };
};
const shareOf = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 5);

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/* ========================================================================== */
/* the per-match instrument                                                   */
/* ========================================================================== */

/** Release classes for a `performPass` call (shortPass is the ONLY kind that
 *  reaches `performPass`; the eight other kinds have their own executors). */
type ReleaseClass =
  | 'SEAM'            // the wind-up resolved at readyTick (the seam's own release)
  | 'RESTART'         // mustKick: a restart taker (excluded at the seam)
  | 'KICKOFF'         // the off-switch kickoff pass, PlayerBrain.ts:160 (excluded)
  | 'BYPASS-ONETOUCH' // firstTouchWindow > 0 at the commit — the DESIGNED bypass
  | 'SYNC-OTHER';     // anything else synchronous. Expected 0.

/** Terminal classes for an ARM (every arm maps to exactly one). */
type ArmClass =
  | 'STRUCK'
  | 'INT-PHASE' | 'INT-LOSS' | 'INT-STUN' | 'INT-SENTOFF' | 'INT-COOLDOWN'
  | 'E-ENDED'         // the match ended before readyTick
  | 'EVICTED'         // a later arm overwrote the single slot before readyTick
  | 'UNEXPLAINED';    // must be 0

interface MatchOut {
  seed: number;
  steps: number;
  playedSimSeconds: number;
  wTicks: number[];
  releases: Record<ReleaseClass, number>;
  arms: Record<ArmClass, number>;
  armCount: number;
  receipts: { seed: number; tick: number; gid: number; cls: ArmClass }[];
}

const ARM_CLASSES: ArmClass[] = [
  'STRUCK', 'INT-PHASE', 'INT-LOSS', 'INT-STUN', 'INT-SENTOFF', 'INT-COOLDOWN',
  'E-ENDED', 'EVICTED', 'UNEXPLAINED',
];
const RELEASE_CLASSES: ReleaseClass[] =
  ['SEAM', 'RESTART', 'KICKOFF', 'BYPASS-ONETOUCH', 'SYNC-OTHER'];

const runMatch = (seed: number): MatchOut => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    o1PassWindup: true,
  });

  const wTicks: number[] = [];
  const releases = Object.fromEntries(RELEASE_CLASSES.map((c) => [c, 0])) as Record<ReleaseClass, number>;
  const arms = Object.fromEntries(ARM_CLASSES.map((c) => [c, 0])) as Record<ArmClass, number>;
  const receipts: MatchOut['receipts'] = [];
  let armCount = 0;

  /** the arm currently occupying the single slot, as the probe sees it */
  type Active = { gid: number; readyTick: number; armTick: number };
  // a holder object, not a `let`: the wrappers below write it from inside closures
  // and TS's flow analysis would otherwise narrow the outer binding wrongly.
  const slot: { cur: Active | null } = { cur: null };
  /** `restartKickGid`/`kickoffKickGid` as they stood BEFORE this step's brains —
   *  `decidePlayer` nulls both at the top of the taker's own decision
   *  (PlayerBrain.ts:109 / :137), so the pre-step read is the only honest one. */
  let preRestartGid: number | null = null;
  let preKickoffGid: number | null = null;
  /** a release attributed to this tick's resolve, keyed by gid */
  let releasedThisTick = new Set<number>();

  const close = (cls: ArmClass, tick: number, gid: number): void => {
    arms[cls]++;
    if (receipts.length < 200) receipts.push({ seed, tick, gid, cls });
  };

  const origArm = m.armPendingPass.bind(m);
  m.armPendingPass = (p: Player, mate: Player, offsideExempt?: boolean): void => {
    // the single slot: a live arm being overwritten is a stale record eviction
    if (slot.cur !== null) close('EVICTED', m.simTick, slot.cur.gid);
    origArm(p, mate, offsideExempt);
    const pp = m.pendingPassWindup!;
    wTicks.push(pp.readyTick - m.simTick);
    armCount++;
    slot.cur = { gid: pp.gid, readyTick: pp.readyTick, armTick: m.simTick };
  };

  const origPass = m.performPass.bind(m);
  m.performPass = (p: Player, mate: Player, offsideExempt?: boolean, powerChoice?: number): void => {
    const isSeam = slot.cur !== null && slot.cur.gid === p.gid && m.pendingPassWindup === null
      && m.simTick >= slot.cur.readyTick;
    if (isSeam) {
      releases.SEAM++;
      releasedThisTick.add(p.gid);
    } else if (preRestartGid === p.gid) releases.RESTART++;
    else if (preKickoffGid === p.gid) releases.KICKOFF++;
    else if (p.firstTouchWindow > 0) releases['BYPASS-ONETOUCH']++;
    else releases['SYNC-OTHER']++;
    origPass(p, mate, offsideExempt, powerChoice);
  };

  let steps = 0;
  while (!m.finished) {
    releasedThisTick = new Set<number>();
    preRestartGid = m.restartKickGid;
    preKickoffGid = m.kickoffKickGid;
    // the state the resolve will read at the head of the next step
    const cur: Active | null = slot.cur;
    const pre = cur === null ? null : (() => {
      const passer = m.allPlayers[cur.gid];
      return {
        phase: m.phase,
        owns: m.ball.owner === passer,
        stunned: passer !== undefined && passer.stunTimer > 0,
        sentOff: passer !== undefined && passer.sentOff,
        cooled: passer !== undefined && passer.kickCooldown > 0,
      };
    })();
    m.step(DT);
    steps++;
    if (slot.cur !== null && m.pendingPassWindup === null) {
      // the slot emptied: the resolve ran this tick (readyTick reached)
      const { gid, readyTick } = slot.cur;
      slot.cur = null;
      if (releasedThisTick.has(gid)) close('STRUCK', readyTick, gid);
      else if (pre === null) close('UNEXPLAINED', readyTick, gid);
      else if (pre.phase !== 'playing') close('INT-PHASE', readyTick, gid);
      else if (!pre.owns) close('INT-LOSS', readyTick, gid);
      else if (pre.sentOff) close('INT-SENTOFF', readyTick, gid);
      else if (pre.stunned) close('INT-STUN', readyTick, gid);
      else if (pre.cooled) close('INT-COOLDOWN', readyTick, gid);
      else close('UNEXPLAINED', readyTick, gid);
    } else if (slot.cur !== null && m.finished) {
      close('E-ENDED', slot.cur.readyTick, slot.cur.gid);
      slot.cur = null;
    }
  }
  if (slot.cur !== null) close('E-ENDED', slot.cur.readyTick, slot.cur.gid);

  return {
    seed, steps, playedSimSeconds: m.simTime, wTicks, releases, arms, armCount, receipts,
  };
};

/* ========================================================================== */
/* the experiment core (X-DET: run twice, compare)                            */
/* ========================================================================== */

const runExperiment = (): Record<string, unknown> => {
  const seeds = Array.from({ length: N }, (_, k) => BLOCK + k);
  const per: MatchOut[] = [];
  for (let i = 0; i < seeds.length; i++) {
    per.push(runMatch(seeds[i]));
    if ((i + 1) % 10 === 0 || i + 1 === seeds.length) {
      process.stderr.write(`  [o1-t1] ${i + 1}/${seeds.length} matches (seed ${seeds[i]})\n`);
    }
  }

  const totalSteps = per.reduce((a, b) => a + b.steps, 0);
  const totalPlayed = per.reduce((a, b) => a + b.playedSimSeconds, 0);
  const allW = per.flatMap((p) => p.wTicks);
  const releases = Object.fromEntries(RELEASE_CLASSES.map((c) => [c, 0])) as Record<ReleaseClass, number>;
  const arms = Object.fromEntries(ARM_CLASSES.map((c) => [c, 0])) as Record<ArmClass, number>;
  for (const p of per) {
    for (const c of RELEASE_CLASSES) releases[c] += p.releases[c];
    for (const c of ARM_CLASSES) arms[c] += p.arms[c];
  }
  const armCount = per.reduce((a, b) => a + b.armCount, 0);
  const totalReleases = RELEASE_CLASSES.reduce((a, c) => a + releases[c], 0);

  // commits on the shortPass door = arms + every synchronous release
  const commits = armCount + releases['BYPASS-ONETOUCH'] + releases.RESTART
    + releases.KICKOFF + releases['SYNC-OTHER'];
  // the census-comparable denominator: window-closed, non-restart, non-kickoff
  const eligibleCommits = armCount + releases['BYPASS-ONETOUCH'];

  const interrupted = arms['INT-PHASE'] + arms['INT-LOSS'] + arms['INT-STUN']
    + arms['INT-SENTOFF'] + arms['INT-COOLDOWN'];
  const resolvedArms = arms.STRUCK + interrupted; // E-ENDED / EVICTED excluded, reported

  const wSecondsQ = quantiles(allW.map((w) => round(w * DT, 6)));

  return {
    matches: N,
    block: BLOCK,
    steps: totalSteps,
    playedSimSeconds: round(totalPlayed, 4),
    playedSimSecondsPerMatch: round(totalPlayed / N, 4),
    windupTicks: quantiles(allW),
    windupSeconds: wSecondsQ,
    wTickHistogram: Object.fromEntries(
      Array.from({ length: 9 }, (_, i) => i + 3).map((t) => [t, allW.filter((w) => w === t).length]),
    ),
    wWithinFrozenClamp: allW.every((w) => Number.isInteger(w) && w >= 3 && w <= 11),
    commits: {
      total: commits,
      perMatch: round(commits / N, 4),
      armed: armCount,
      bypassOneTouch: releases['BYPASS-ONETOUCH'],
      restart: releases.RESTART,
      kickoff: releases.KICKOFF,
      syncOther: releases['SYNC-OTHER'],
      armShareOfAllCommits: shareOf(armCount, commits),
      armShareOfEligibleCommits: shareOf(armCount, eligibleCommits),
      oneTouchBypassShareOfEligible: shareOf(releases['BYPASS-ONETOUCH'], eligibleCommits),
      oneTouchBypassShareOfAll: shareOf(releases['BYPASS-ONETOUCH'], commits),
    },
    releases: {
      total: totalReleases,
      perMatch: round(totalReleases / N, 4),
      byClass: releases,
      seamShareOfReleases: shareOf(releases.SEAM, totalReleases),
    },
    interruption: {
      arms: armCount,
      resolvedArms,
      struck: arms.STRUCK,
      interrupted,
      rate: shareOf(interrupted, resolvedArms),
      causeMix: {
        'INT-LOSS': arms['INT-LOSS'], 'INT-PHASE': arms['INT-PHASE'],
        'INT-STUN': arms['INT-STUN'], 'INT-SENTOFF': arms['INT-SENTOFF'],
        'INT-COOLDOWN': arms['INT-COOLDOWN'],
      },
      causeShares: Object.fromEntries(
        (['INT-LOSS', 'INT-PHASE', 'INT-STUN', 'INT-SENTOFF', 'INT-COOLDOWN'] as ArmClass[])
          .map((c) => [c, shareOf(arms[c], interrupted)]),
      ),
      excludedReported: { 'E-ENDED': arms['E-ENDED'], EVICTED: arms.EVICTED },
      referenceC7T1ShotRate: C7_T1_INTERRUPTION_RATE,
    },
    armLedger: { ...arms, total: ARM_CLASSES.reduce((a, c) => a + arms[c], 0), armCount },
    unexplained: arms.UNEXPLAINED,
    receipts: per.flatMap((p) => p.receipts).slice(0, 200),
    perSeed: per.map((p) => ({
      seed: p.seed, arms: p.armCount, struck: p.arms.STRUCK, steps: p.steps,
      playedSimSeconds: round(p.playedSimSeconds, 4),
    })),
  };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== O1 T1 ARMED SMOKE — ${N} matches, block ${BLOCK} ===\n`);

const wall0 = Date.now(); // OUTSIDE the compared core; excluded from resultSha256
const runA = runExperiment();
const shaA = sha(canonical(runA));
process.stderr.write(`  [o1-t1] run A digest ${shaA}\n  [o1-t1] X-DET second run...\n`);
const runB = runExperiment();
const shaB = sha(canonical(runB));
const xDet = shaA === shaB;
process.stderr.write(`  [o1-t1] run B digest ${shaB} — X-DET ${xDet ? 'PASS' : 'FAIL'}\n`);

/* G1 X-FP-PROD: the production world (flag ABSENT) still hashes to the pin. */
let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { fingerprint = 'skipped (--skip-fp)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
/** CONTEXT, not a gate: this is a mechanic arc, so `src` carries the seam. The
 *  gate is flag-off byte-identity (the doc's G2), proved outside this probe. */
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const seedDisjoint = (() => {
  const first = BLOCK; const last = BLOCK + N - 1;
  const inBand = first >= RESERVED_BAND[0] && last <= RESERVED_BAND[1];
  const aboveCensus = first > CENSUS_RANGE[1];
  const belowPhase0Smoke = last < PHASE0_SMOKE_RANGE[0];
  const aboveConsumed = first > 12_299_999;
  return {
    first, last, inReservedBand: inBand, aboveConsumedCeiling12_299_999: aboveConsumed,
    censusRange: CENSUS_RANGE, phase0SmokeRange: PHASE0_SMOKE_RANGE,
    disjointFromCensus: aboveCensus, disjointFromPhase0Smoke: belowPhase0Smoke,
    pass: inBand && aboveConsumed && aboveCensus && belowPhase0Smoke,
  };
})();

const result = runA as Record<string, unknown>;
const body = {
  stage: 'O1 T1 — the dormant shortPass wind-up seam (armed smoke)',
  ruling: '#178.4 / #179.2',
  contract: 'docs/world-model/OUTLET-CONTRACT.md',
  doc: 'docs/world-model/O1-T1-PASS-WINDUP.md',
  mode: 'armed-smoke (single arm, o1PassWindup ON; no fork, no comparison)',
  head,
  gates: {
    xDet: { pass: xDet, digestA: shaA, digestB: shaB },
    xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fingerprint, skipped: SKIP_FP },
    seedDisjoint,
    wWithinFrozenClamp: result.wWithinFrozenClamp,
    unexplained: result.unexplained,
    srcDiffStatContextOnly: srcDiff,
  },
  result: runA,
};
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
const out = { ...body, resultSha256, wallMsContextOnly: wallMs };
writeFileSync('docs/world-model/data/o1-t1-windup-smoke.json', `${JSON.stringify(out, null, 2)}\n`);

/* ---- the printed report ---- */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const r = runA as Record<string, any>;
o('');
o(`=== O1 T1 ARMED SMOKE (dormant seam, o1PassWindup ON) — HEAD ${head} ===`);
o(`matches ${N} · block ${BLOCK} · steps ${r.steps} · played simSeconds/match ${r.playedSimSecondsPerMatch}`);
o(`X-DET ${xDet ? 'PASS' : 'FAIL'} · X-FP-PROD ${SKIP_FP ? 'skipped' : (xFpProd ? 'PASS' : 'FAIL')} · seedDisjoint ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · W in [3,11] ${r.wWithinFrozenClamp ? 'PASS' : 'FAIL'} · unexplained ${r.unexplained}`);
o('');
o('-- G12 REALIZED W DISTRIBUTION (shortPass arms) --');
o(`arms ${r.windupTicks.n} · ticks p10 ${r.windupTicks.p10} p50 ${r.windupTicks.p50} p90 ${r.windupTicks.p90} · mean ${r.windupTicks.mean} · min ${r.windupTicks.min} max ${r.windupTicks.max}`);
o(`seconds p10 ${r.windupSeconds.p10} p50 ${r.windupSeconds.p50} p90 ${r.windupSeconds.p90} · mean ${r.windupSeconds.mean}`);
o(`tick histogram ${JSON.stringify(r.wTickHistogram)}`);
o('');
o('-- G12 WIND-UP SHARE / ONE-TOUCH BYPASS (shortPass commits) --');
o(`commits ${r.commits.total} (${r.commits.perMatch}/match) = armed ${r.commits.armed} · bypass(oneTouch) ${r.commits.bypassOneTouch} · restart ${r.commits.restart} · kickoff ${r.commits.kickoff} · syncOther ${r.commits.syncOther}`);
o(`wind-up share: of ALL commits ${r.commits.armShareOfAllCommits} · of ELIGIBLE (window-closed, non-restart, non-kickoff) ${r.commits.armShareOfEligibleCommits}`);
o(`one-touch bypass share: of eligible ${r.commits.oneTouchBypassShareOfEligible} · of all commits ${r.commits.oneTouchBypassShareOfAll}`);
o(`releases ${r.releases.total} (${r.releases.perMatch}/match) · seam share of releases ${r.releases.seamShareOfReleases}`);
o('');
o('-- G13 INTERRUPTION CENSUS --');
o(`arms ${r.interruption.arms} · resolved ${r.interruption.resolvedArms} = struck ${r.interruption.struck} + interrupted ${r.interruption.interrupted}`);
o(`interruption rate ${r.interruption.rate} (C7-T1 shot reference ${C7_T1_INTERRUPTION_RATE})`);
o(`cause mix ${JSON.stringify(r.interruption.causeMix)}`);
o(`cause shares ${JSON.stringify(r.interruption.causeShares)}`);
o(`excluded/reported ${JSON.stringify(r.interruption.excludedReported)}`);
o('');
o(`arm ledger ${JSON.stringify(r.armLedger)}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${round(wallMs / 1000, 1)} s (CONTEXT ONLY — USED IN NO RATE)`);
