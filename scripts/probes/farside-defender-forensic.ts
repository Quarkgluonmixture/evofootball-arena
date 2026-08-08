// THE FAR-SIDE DEFENDER FORENSIC CENSUS (commander ruling #186.4)
// Stage doc: docs/world-model/FARSIDE-DEFENDER-FORENSIC.md — EVERY definition,
// constant, threshold and reading rule below is that doc's §1–§5, frozen BEFORE
// this probe was run. Nothing here is invented at read time.
//
// INSTRUMENT-ONLY: zero src/** changes. A pure TICK-WALK over observable match
// state; the only src function called is `formationSpot` (pure — the station
// field re-evaluated, no mutation). Nothing is written back into any match.
//
// THE QUESTION (#186.3, H-186a): when the opponent wins the ball deep on one
// flank, does the weak-side back detach because (i) no ball-side compression
// force reaches him (MODULATION MISSING — a calm send to a place a compressed
// shape would not choose) or (ii) the live station field flips him between
// targets (OSCILLATION)? The §5 reading rule discriminates, pre-registered.
//
// FOUR WORLDS on shared seeds: prod / v1 / v2 / v3, composed exactly as
// src/game/a4World.ts composes them (a4MatchFlags + armA4World, the fidelity
// source). Every metric carries a BALL-SIDE CONTROL MIRROR measured on the same
// tick, so "high" is always relative to the substrate's own steering.
//
// GATES: X-DET (whole computation twice, byte-identical + sha) · X-FP-PROD (the
// shipped fingerprint re-derived in-probe, #181.2) · X-SRC-ZERO · seed/stats
// disjointness · flag hygiene · table SHA · arm identity · probe-read-only.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { ATTACK_FORMATIONS, formationSpot } from '../../src/ai/formations';
import { EYE_W_S, STATION_FAMILY } from '../../src/ai/stationEye';
import type {
  MergedChildTable, RoleConditionedTable, RoleControlLevels,
} from '../../src/ai/stationEye';
import { randomGenome, homePriorOffsets, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_WIDTH, DT, HALF_L, HALF_W, MATCH_DURATION } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const wall0 = Date.now();
const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

/* ========================================================================== */
/* §1 FROZEN PARAMETERS (stage doc §1–§5)                                     */
/* ========================================================================== */
/** §1 T6: `localXBand`'s own ownThird cut — the substrate's published third. */
const OWN_THIRD_LOCAL_X = -HALF_L / 3;
/** §1 T7: the flank cut = outside the penalty-box WIDTH. */
const FLANK_ABS_Y = BOX_WIDTH / 2;
/** §1: an episode shorter than 0.5 s is frame flicker, not a picture. */
const MIN_EPISODE_TICKS = 30;
/** §3.2/§3.3: the anti-clump repel radius of `emergentStation` — the substrate's
 *  own body-spacing scale, and the corner test's radius. */
const SPREAD_R = 9;
/** §3.2: the station clamp's own corner point, in the (localX, |y|) frame. */
const CLAMP_CORNER_LOCAL_X = -HALF_L + 3;
const CLAMP_CORNER_ABS_Y = HALF_W - 2;
/** §3.5: FLAGGED executor's choice — a walking floor for "moving at all". */
const SPEED_MIN = 1.0;
/** §5: the station eye's own commitment window ⇒ the churn reference. */
const CHURN_HI = 1 / EYE_W_S;
/** §5: the executor's own "badly out of position" scale. */
const NEAR_M = 14;
/** §5: the ONE corner-share cut, used for BOTH of the frozen rule's corner
 *  clauses — (i)'s "the send's corner share is materially non-zero" and (ii)'s
 *  "the send's corner share is low" — so a share cannot be simultaneously
 *  immaterial and not-low. Declared here (no substrate anchor exists for
 *  "materially non-zero"; it is the executor's choice, flagged like SPEED_MIN). */
const CORNER_MATERIAL = 0.05;

/* --- §4.2 the seed ledger --------------------------------------------------- */
/** Consumed through here by the A4/O arc (the O2 opening re-run took ..199). */
const CONSUMED_CEILING = 12_310_199;
const RESERVED_BAND: [number, number] = [12_310_200, 12_310_999];
const SMOKE_BASE = 12_310_200; const SMOKE_MATCHES = 16;
const CENSUS_BASE = 12_310_300;
const N_CAP = 700;
const N_STEP = 25;
const TARGET_EPISODES_PER_WORLD = 1500;
const WALL_BUDGET_HOURS = 1.0;
const WORLDS_COUNT = 4;
const XDET_FACTOR = 2;
/** The 12.30M/12.31M band ledger, carried forward from o2-whether-sizing-rerun.ts. */
const CONSUMED: { name: string; range: [number, number] }[] = [
  { name: 'tempo census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing re-run', range: [12_310_000, 12_310_199] },
];
/** §4.2 stats stream: 103,000 was the O2 re-run's base ⇒ +200 floor. */
const BOOTSTRAP_SEED = 103_200;
const BOOTSTRAP_RESAMPLES = envInt('FSD_RESAMPLES', 2000);
const PUBLISHED_STATS_BASES = [102_000, 102_200, 102_400, 102_600, 102_800, 103_000];

/* --- the X-family pins ----------------------------------------------------- */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SKIP_FP = process.argv.includes('--skip-fp');
const MERGED_PATH = 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const MERGED_SHA_EXPECTED = '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
const CONTROL_SHA_EXPECTED = '968349ff52313df6ce6fe42683faff64b7509d32c108b7b40010c129e18acc1c';

/** §4.1 — src/game/a4World.ts `A4_WORLD_FLAGS`, verbatim (never widened). */
const A4_WORLD_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
const A4_OBEDIENCE = 0.5;
const A4_V2_OFFSETS = [0, 0.4, 0.2, 0, -0.2, -0.4] as const;

const MODE = (process.env.FSD_MODE ?? 'census') as 'smoke' | 'census';
const N_ENV = process.env.FSD_N === undefined ? null : envInt('FSD_N', 0);
const SIZING_PATH = 'docs/world-model/data/farside-defender-forensic-sizing.json';
const OUT_PATH = process.env.FSD_OUT
  ?? (MODE === 'smoke'
    ? SIZING_PATH
    : 'docs/world-model/data/farside-defender-forensic.json');
/** Receipts: how many worst-detachment episodes to cite per world. */
const RECEIPTS_PER_WORLD = 12;

/* ========================================================================== */
/* §2 HELPERS                                                                 */
/* ========================================================================== */
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const pctlSorted = (s: readonly number[], q: number): number => {
  if (s.length === 0) return Number.NaN;
  const i = Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))));
  return s[i];
};
const quantile = (xs: readonly number[], q: number): number => pctlSorted([...xs].sort((a, b) => a - b), q);
const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');

/* --- the injected census artifacts (the a4World load, mirrored) ------------ */
interface MergedTableFile {
  mergedTableSha: string; baseTableSha?: string;
  base: RoleConditionedTable; children: MergedChildTable;
}
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable = rawMerged.base;
const children = rawMerged.children;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as { control: RoleControlLevels; sha256: string };
const control = rawControl.control;
const tableIdent = (() => {
  const mergedRehash = sha({ base: roleTable, children });
  const baseRehash = sha(roleTable);
  return {
    mergedShaField: rawMerged.mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash,
    baseRehash, baseShaExpected: BASE_SHA_EXPECTED,
    controlShaField: rawControl.sha256, controlShaExpected: CONTROL_SHA_EXPECTED,
    pass: rawMerged.mergedTableSha === MERGED_SHA_EXPECTED
      && mergedRehash === MERGED_SHA_EXPECTED
      && baseRehash === BASE_SHA_EXPECTED
      && rawControl.sha256 === CONTROL_SHA_EXPECTED,
  };
})();

/* ========================================================================== */
/* §3 THE FOUR WORLDS (stage doc §4.1)                                        */
/* ========================================================================== */
const WORLDS = ['prod', 'v1', 'v2', 'v3'] as const;
type World = (typeof WORLDS)[number];
type EyeConfig = NonNullable<Match['stationEye']>;

/** `a4MatchFlags(version)` of src/game/a4World.ts — the entry-layer composition. */
const worldFlags = (w: World): Record<string, boolean> | null => {
  if (w === 'prod') return null;
  const flags: Record<string, boolean> = { ...A4_WORLD_FLAGS };
  if (w === 'v3') flags.o1PassWindup = true;
  return flags;
};
/** `a4EyeConfig(tables)` of src/game/a4World.ts, field for field. */
const a4Eye = (): EyeConfig => ({
  arm: 'neutral', scope: { kind: 'both' }, table: {},
  v3: { roleTable, control, children, mergedTableSha: rawMerged.mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: true },
});
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** `setA4Obedience` + `setA4Offsets` of src/game/a4World.ts, verbatim idiom. */
const armGenes = (m: Match, side: Side, offsets: readonly number[] | null): void => {
  const t = m.teams[side];
  for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
    g.homePriorObedience = A4_OBEDIENCE;
    if (offsets !== null) g.homePriorObedienceOffset = [...offsets];
  }
};
const matchFor = (w: World, seed: number): Match => {
  const base = {
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  };
  const flags = worldFlags(w);
  if (flags === null) return new Match(base as ConstructorParameters<typeof Match>[0]);
  const m = new Match({ ...base, ...flags } as ConstructorParameters<typeof Match>[0]);
  m.stationEye = a4Eye();
  for (const side of [0, 1] as const) armGenes(m, side, w === 'prod' || w === 'v1' ? null : A4_V2_OFFSETS);
  return m;
};

/* ========================================================================== */
/* §4 THE INSTRUMENT — a pure tick-walk (stage doc §1–§3)                     */
/* ========================================================================== */
/** §3.2 corner test, in the (localX, |y|) frame. */
const inCorner = (localX: number, y: number): boolean =>
  Math.hypot(localX - CLAMP_CORNER_LOCAL_X, Math.abs(y) - CLAMP_CORNER_ABS_Y) < SPREAD_R;

/** D2 (declared addition): which mechanism actually OWNS the movement target this
 *  tick, in `executeAction`'s own precedence order (the eye override replaces the
 *  action's target only for STATION-family jobs; ball-directed jobs are never
 *  overridden — the E-NONSTATION lapse). */
type SteerOwner = 'eyeOverride' | 'markStance' | 'stationHome' | 'ballDirected' | 'other';
const STATION_HOME_ACTIONS = new Set(['MoveToFormationSpot', 'HoldPosition']);
const BALL_DIRECTED_ACTIONS = new Set([
  'ChaseBall', 'InterceptPass', 'ReceivePass', 'Pass', 'Shoot', 'Dribble', 'Clear',
  'Tackle', 'HeaderChallenge', 'GkSave', 'GkDistribute',
]);
const steerOwnerOf = (actionType: string, overrode: boolean): SteerOwner => {
  if (overrode) return 'eyeOverride';
  if (actionType === 'MarkOpponent') return 'markStance';
  if (STATION_HOME_ACTIONS.has(actionType)) return 'stationHome';
  if (BALL_DIRECTED_ACTIONS.has(actionType)) return 'ballDirected';
  return 'other';
};

/** Per-body per-tick accumulator. */
interface BodyAcc {
  ticks: number;
  detach: number[]; distToSend: number[]; distToHome: number[];
  latGap: number[]; sendLatGap: number[];
  overrideTicks: number; sendCornerTicks: number; posCornerTicks: number;
  switches: number; flips90: number; flips150: number;
  prevKey: string | null;
  prevVel: { x: number; y: number } | null;
  actionTicks: Map<string, number>;
  // --- D1 (declared addition): the MARK anchor, on MarkOpponent ticks only ----
  markTicks: number; markFarSideTicks: number;
  distToMark: number[]; markLatGap: number[]; markCornerTicks: number;
  // --- D2 (declared addition): who owns the movement target ------------------
  steerTicks: Map<SteerOwner, number>;
}
const newBodyAcc = (): BodyAcc => ({
  ticks: 0, detach: [], distToSend: [], distToHome: [], latGap: [], sendLatGap: [],
  overrideTicks: 0, sendCornerTicks: 0, posCornerTicks: 0,
  switches: 0, flips90: 0, flips150: 0, prevKey: null, prevVel: null,
  actionTicks: new Map(),
  markTicks: 0, markFarSideTicks: 0, distToMark: [], markLatGap: [], markCornerTicks: 0,
  steerTicks: new Map(),
});

/** One qualifying episode's frozen summary (§3). */
interface Episode {
  seed: number; world: World; startTick: number; ticks: number; simSeconds: number;
  defSide: Side; flankSign: 1 | -1; weakIdx: 3 | 4; ballIdx: 3 | 4;
  a4RuleAgrees: boolean | null;
  /** D3: the §2.2 A4-home rule's own pick, and how far it sits from §2.1's body. */
  a4RulePickIdx: number | null; a4RulePickGapM: number;
  weak: EpisodeBody; ballSide: EpisodeBody;
}
interface EpisodeBody {
  detachMean: number; detachMax: number;
  distToSendMean: number; distToHomeMean: number;
  latGapMean: number; compressionShortfallMean: number; sendLatGapMean: number;
  overrideShare: number; sendCornerShare: number; posCornerShare: number;
  switchRate: number; flipRate90: number; flipRate150: number;
  actionMix: Record<string, number>;
  // D1
  markShare: number; markFarSideShareOfMarkTicks: number;
  distToMarkMean: number; markLatGapMean: number; markCornerShareOfMarkTicks: number;
  // D2
  steerMix: Record<string, number>;
}
const summariseBody = (a: BodyAcc, simSeconds: number): EpisodeBody => {
  const latGapMean = mean(a.latGap);
  return {
    detachMean: mean(a.detach), detachMax: Math.max(...a.detach),
    distToSendMean: mean(a.distToSend), distToHomeMean: mean(a.distToHome),
    latGapMean, compressionShortfallMean: mean(a.latGap.map((g) => Math.max(0, g - SPREAD_R))),
    sendLatGapMean: mean(a.sendLatGap),
    overrideShare: a.overrideTicks / a.ticks,
    sendCornerShare: a.sendCornerTicks / a.ticks,
    posCornerShare: a.posCornerTicks / a.ticks,
    switchRate: a.switches / simSeconds,
    flipRate90: a.flips90 / simSeconds,
    flipRate150: a.flips150 / simSeconds,
    actionMix: Object.fromEntries([...a.actionTicks.entries()].sort().map(([k, v]) => [k, v / a.ticks])),
    markShare: a.markTicks / a.ticks,
    markFarSideShareOfMarkTicks: a.markTicks === 0 ? Number.NaN : a.markFarSideTicks / a.markTicks,
    distToMarkMean: mean(a.distToMark),
    markLatGapMean: mean(a.markLatGap),
    markCornerShareOfMarkTicks: a.markTicks === 0 ? Number.NaN : a.markCornerTicks / a.markTicks,
    steerMix: Object.fromEntries([...a.steerTicks.entries()].sort().map(([k, v]) => [k, v / a.ticks])),
  };
};

interface MatchWalk {
  seed: number; episodes: Episode[];
  triggerTicks: number; playedTicks: number;
  excludedSentOff: number; excludedShort: number; a4RuleUndefined: number;
  probeReadOnly: boolean;
}

function walkMatch(world: World, seed: number): MatchWalk {
  const m = matchFor(world, seed);
  const eyeArmed = m.stationEye !== null;
  const episodes: Episode[] = [];
  let triggerTicks = 0; let playedTicks = 0;
  let excludedSentOff = 0; let excludedShort = 0; let a4RuleUndefined = 0;
  const probeReadOnly = m.abandonRestDesignation === null
    && m.homeRegionGrant === null && m.homeMapGrant === null;

  // the open episode's state
  let openKey: string | null = null;   // `${defSide}|${flankSign}`
  let startTick = 0; let ticks = 0;
  let sentOffSeen = false; let a4Agrees: boolean | null = null;
  let a4PickIdx: number | null = null; let a4PickGap = Number.NaN;
  let defSide: Side = 0; let flankSign: 1 | -1 = 1;
  let weakIdx: 3 | 4 = 3; let ballIdx: 3 | 4 = 4;
  let weakAcc = newBodyAcc(); let ballAcc = newBodyAcc();

  const closeEpisode = (): void => {
    if (openKey === null) { return; }
    if (ticks < MIN_EPISODE_TICKS) { excludedShort += 1; }
    else if (sentOffSeen || weakAcc.ticks === 0 || ballAcc.ticks === 0) { excludedSentOff += 1; }
    else {
      const simSeconds = ticks * DT;
      episodes.push({
        seed, world, startTick, ticks, simSeconds, defSide, flankSign, weakIdx, ballIdx,
        a4RuleAgrees: a4Agrees, a4RulePickIdx: a4PickIdx, a4RulePickGapM: a4PickGap,
        weak: summariseBody(weakAcc, simSeconds),
        ballSide: summariseBody(ballAcc, simSeconds),
      });
    }
    openKey = null;
  };

  while (!m.finished) {
    m.step(DT);
    if (m.phase === 'playing') playedTicks += 1;

    // ---- §1 the TRIGGER ---------------------------------------------------
    const a = m.possessionSide;
    const owner = m.ball.owner;
    const inTrigger = m.phase === 'playing'
      && m.restart === null
      && a !== -1
      && owner !== null
      && owner.side === a
      && owner.role !== 'GK'
      && m.teams[(1 - a) as Side].localX(m.ball.pos.x) < OWN_THIRD_LOCAL_X
      && Math.abs(m.ball.pos.y) >= FLANK_ABS_Y;

    if (!inTrigger) { closeEpisode(); continue; }
    triggerTicks += 1;

    const d = (1 - a) as Side;
    const fs: 1 | -1 = m.ball.pos.y > 0 ? 1 : -1;
    const key = `${d}|${fs}`;
    if (openKey !== key) {
      closeEpisode();
      openKey = key; startTick = m.simTick; ticks = 0; sentOffSeen = false;
      defSide = d; flankSign = fs;
      // §2.1: the weak-side back is the wide slot whose LANE SIGN opposes the flank.
      weakIdx = fs > 0 ? 3 : 4;
      ballIdx = fs > 0 ? 4 : 3;
      weakAcc = newBodyAcc(); ballAcc = newBodyAcc();
      // §2.2 the A4-home cross-check, evaluated at the episode's first tick.
      const dTeam = m.teams[d];
      const homes = ATTACK_FORMATIONS[dTeam.style.formationAtk];
      let bestIdx: number | null = null; let bestX = Number.POSITIVE_INFINITY;
      for (const q of dTeam.players) {
        if (q.role === 'GK' || q.sentOff) continue;
        const h = homes[q.index];
        if (h === undefined) continue;
        if (Math.sign(h.y) !== -fs || h.y === 0) continue;
        if (h.x < bestX) { bestX = h.x; bestIdx = q.index; }
      }
      if (bestIdx === null) { a4Agrees = null; a4PickIdx = null; a4PickGap = Number.NaN; a4RuleUndefined += 1; }
      else {
        a4Agrees = bestIdx === weakIdx;
        a4PickIdx = bestIdx;
        // D3: how far apart the two rules' BODIES stand at the episode's first tick.
        const pick = dTeam.players[bestIdx]; const wide = dTeam.players[weakIdx];
        a4PickGap = pick === undefined || wide === undefined
          ? Number.NaN : Math.hypot(pick.pos.x - wide.pos.x, pick.pos.y - wide.pos.y);
      }
    }
    ticks += 1;

    const dTeam = m.teams[d];
    const aTeam = m.teams[a as Side];
    const weak = dTeam.players[weakIdx];
    const ballSide = dTeam.players[ballIdx];
    if (weak === undefined || ballSide === undefined || weak.sentOff || ballSide.sentOff) {
      sentOffSeen = true;
      continue;
    }

    const observe = (p: Player, acc: BodyAcc): void => {
      acc.ticks += 1;
      // §3.1 detachment — the centroid of the REST of his outfield team
      let cx = 0; let cy = 0; let n = 0;
      for (const q of dTeam.players) {
        if (q === p || q.role === 'GK' || q.sentOff) continue;
        cx += q.pos.x; cy += q.pos.y; n += 1;
      }
      acc.detach.push(n === 0 ? Number.NaN : Math.hypot(p.pos.x - cx / n, p.pos.y - cy / n));

      // §3.2 the SEND — the eye's override where it applied, else the station field.
      // The override test mirrors the EXECUTOR'S OWN gate (actionExecutor.ts:1055-1061):
      // `state !== undefined && state.offset !== null` THEN `isStation`. The
      // `eyeState.offset !== null` conjunct is the fourth condition (stage doc §3.2,
      // disclosed): a live commitment with a null offset steers nothing, so without
      // it a stale-but-present state would be counted as an override that never was.
      // NOTE `c4Trace.applied` is NOT the raw eye want: actionExecutor.ts:1145 rewrites
      // it to the target that SURVIVED the onside / barred-box clamps, i.e. the point
      // the body was actually steered at. That is the send this census wants.
      const home = formationSpot(p, dTeam, m.ball, false, aTeam, false);
      const isStation = STATION_FAMILY.has(p.action.type);
      const eyeState = eyeArmed ? m.stationEyeState.get(p.gid) : undefined;
      const overrode = eyeArmed && isStation && p.c4Trace !== null
        && eyeState !== undefined && eyeState.offset !== null;
      const send = overrode ? p.c4Trace!.applied : home;
      const candId = overrode ? eyeState!.candidateId : '-';
      if (overrode) acc.overrideTicks += 1;
      acc.distToSend.push(Math.hypot(p.pos.x - send.x, p.pos.y - send.y));
      acc.distToHome.push(Math.hypot(p.pos.x - home.x, p.pos.y - home.y));
      if (inCorner(dTeam.localX(send.x), send.y)) acc.sendCornerTicks += 1;
      if (inCorner(dTeam.localX(p.pos.x), p.pos.y)) acc.posCornerTicks += 1;

      // §3.3 the compression yardstick (lateral only)
      acc.latGap.push(Math.abs(p.pos.y - m.ball.pos.y));
      acc.sendLatGap.push(Math.abs(send.y - m.ball.pos.y));

      // §3.4 the send-identity switch. LIMITATION (stage doc §8.4): the key is
      // `type|markTargetIdx|eyeCandidateId` and eyeCandidateId collapses to '-' on
      // every non-override tick, so an override LAPSING IN OR OUT changes the key
      // exactly like an action-type flip or a new mark target. A switch says "the
      // send identity changed"; it does NOT say which of those changed it.
      const mark = p.action.type === 'MarkOpponent' ? (p.action.targetIdx ?? '-') : '-';
      const sk = `${p.action.type}|${mark}|${candId}`;
      if (acc.prevKey !== null && acc.prevKey !== sk) acc.switches += 1;
      acc.prevKey = sk;

      // §3.5 heading flips
      const v = { x: p.vel.x, y: p.vel.y };
      const sp = Math.hypot(v.x, v.y);
      const pv = acc.prevVel;
      if (pv !== null) {
        const psp = Math.hypot(pv.x, pv.y);
        if (sp > SPEED_MIN && psp > SPEED_MIN) {
          const dot = (v.x * pv.x + v.y * pv.y) / (sp * psp);
          if (dot < 0) acc.flips90 += 1;
          if (dot < Math.cos((150 * Math.PI) / 180)) acc.flips150 += 1;
        }
      }
      acc.prevVel = v;

      // §3.6 action mix
      acc.actionTicks.set(p.action.type, (acc.actionTicks.get(p.action.type) ?? 0) + 1);

      // D2: which mechanism actually owns his movement target this tick
      const owner2 = steerOwnerOf(p.action.type, overrode);
      acc.steerTicks.set(owner2, (acc.steerTicks.get(owner2) ?? 0) + 1);

      // D1: the MARK anchor, on MarkOpponent ticks with a resolvable mark
      if (p.action.type === 'MarkOpponent') {
        const mi = p.action.targetIdx;
        const marked = mi === undefined ? undefined : aTeam.players[mi];
        if (marked !== undefined && !marked.sentOff) {
          acc.markTicks += 1;
          acc.distToMark.push(Math.hypot(p.pos.x - marked.pos.x, p.pos.y - marked.pos.y));
          acc.markLatGap.push(Math.abs(marked.pos.y - m.ball.pos.y));
          if (Math.sign(marked.pos.y) === -flankSign) acc.markFarSideTicks += 1;
          if (inCorner(dTeam.localX(marked.pos.x), marked.pos.y)) acc.markCornerTicks += 1;
        }
      }
    };
    observe(weak, weakAcc);
    observe(ballSide, ballAcc);
  }
  closeEpisode();
  return {
    seed, episodes, triggerTicks, playedTicks,
    excludedSentOff, excludedShort, a4RuleUndefined, probeReadOnly,
  };
}

/* ========================================================================== */
/* §5 AGGREGATION + THE PRE-REGISTERED READING (stage doc §5)                 */
/* ========================================================================== */
const BODY_KEYS = [
  'detachMean', 'detachMax', 'distToSendMean', 'distToHomeMean', 'latGapMean',
  'compressionShortfallMean', 'sendLatGapMean', 'overrideShare', 'sendCornerShare',
  'posCornerShare', 'switchRate', 'flipRate90', 'flipRate150',
  // the declared additions (stage doc §4.4)
  'markShare', 'markFarSideShareOfMarkTicks', 'distToMarkMean', 'markLatGapMean',
  'markCornerShareOfMarkTicks',
] as const;
type BodyKey = (typeof BODY_KEYS)[number];

const levelsOf = (eps: readonly Episode[], side: 'weak' | 'ballSide'): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const k of BODY_KEYS) {
    const xs = eps.map((e) => e[side][k as BodyKey]).filter((x) => Number.isFinite(x));
    const s = [...xs].sort((p, q) => p - q);
    out[k] = {
      mean: round(mean(xs)), p50: round(pctlSorted(s, 0.5)),
      p90: round(pctlSorted(s, 0.9)), max: round(s.length === 0 ? Number.NaN : s[s.length - 1]),
      n: xs.length,
    };
  }
  // tick-weighted mixes (actionMix §3.6 and the D2 steerMix)
  for (const which of ['actionMix', 'steerMix'] as const) {
    const mix = new Map<string, number>();
    let mixTicks = 0;
    for (const e of eps) {
      for (const [k, v] of Object.entries(e[side][which])) mix.set(k, (mix.get(k) ?? 0) + v * e.ticks);
      mixTicks += e.ticks;
    }
    out[which] = Object.fromEntries(
      [...mix.entries()].sort((p, q) => q[1] - p[1]).map(([k, v]) => [k, round(v / Math.max(1, mixTicks), 5)]),
    );
  }
  return out;
};

/** Per-SEED cluster bootstrap on the headline episode-level medians + the paired
 *  (weak − ballSide) differences. Ratio-free: medians over the resampled episode
 *  pool, clustered on the seed (episodes within a match are not independent). */
const HEADLINE: readonly BodyKey[] = [
  'detachMean', 'distToSendMean', 'sendLatGapMean', 'switchRate', 'flipRate90',
  'sendCornerShare', 'compressionShortfallMean',
  'markShare', 'markLatGapMean', 'distToMarkMean',
] as const;
const bootstrapWorld = (eps: readonly Episode[], seeds: readonly number[]): Record<string, unknown> => {
  const bySeed = new Map<number, Episode[]>();
  for (const s of seeds) bySeed.set(s, []);
  for (const e of eps) bySeed.get(e.seed)?.push(e);
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: Record<string, { weak: number[]; ballSide: number[]; delta: number[] }> = {};
  for (const k of HEADLINE) draws[k] = { weak: [], ballSide: [], delta: [] };
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const pool: Episode[] = [];
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[Math.min(seeds.length - 1, Math.floor(rng.next() * seeds.length))];
      const got = bySeed.get(s);
      if (got !== undefined) pool.push(...got);
    }
    for (const k of HEADLINE) {
      const w = quantile(pool.map((e) => e.weak[k]).filter(Number.isFinite), 0.5);
      const c = quantile(pool.map((e) => e.ballSide[k]).filter(Number.isFinite), 0.5);
      draws[k].weak.push(w); draws[k].ballSide.push(c); draws[k].delta.push(w - c);
    }
  }
  const ci = (xs: readonly number[]): { lower: number; upper: number } => {
    const s = [...xs].sort((p, q) => p - q);
    return { lower: round(pctlSorted(s, 0.025)), upper: round(pctlSorted(s, 0.975)) };
  };
  const out: Record<string, unknown> = {};
  for (const k of HEADLINE) {
    const pw = quantile(eps.map((e) => e.weak[k]).filter(Number.isFinite), 0.5);
    const pc = quantile(eps.map((e) => e.ballSide[k]).filter(Number.isFinite), 0.5);
    const d = ci(draws[k].delta);
    out[k] = {
      weak: { p50: round(pw), ...ci(draws[k].weak) },
      ballSide: { p50: round(pc), ...ci(draws[k].ballSide) },
      pairedDelta: { point: round(pw - pc), ...d },
      resolved: Number.isFinite(d.lower) && Number.isFinite(d.upper) && (d.lower > 0 || d.upper < 0),
    };
  }
  return {
    method: 'per-seed cluster bootstrap over the episode pool, episode-level MEDIANS, '
      + '2.5/97.5 percentiles; the delta is (weak-side back − ball-side control mirror)',
    statsBase: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, clusters: seeds.length,
    metrics: out,
  };
};

/** §5 — THE PRE-REGISTERED READING. Applied mechanically to the frozen scales. */
const readingOf = (eps: readonly Episode[]): Record<string, unknown> => {
  const med = (side: 'weak' | 'ballSide', k: BodyKey): number =>
    quantile(eps.map((e) => e[side][k]).filter(Number.isFinite), 0.5);
  const S = med('weak', 'switchRate'); const F = med('weak', 'flipRate90');
  const D = med('weak', 'distToSendMean'); const G = med('weak', 'sendLatGapMean');
  const cornerShare = med('weak', 'sendCornerShare');
  const Sc = med('ballSide', 'switchRate'); const Fc = med('ballSide', 'flipRate90');
  const Dc = med('ballSide', 'distToSendMean'); const Gc = med('ballSide', 'sendLatGapMean');
  // (i)'s second condition is a DISJUNCTION as frozen: "`G > SPREAD_R (9 m)`,
  // and/or the send's corner share is materially non-zero". Both disjuncts are
  // evaluated and both are emitted, so the reading can be audited term by term.
  const sendStable = S < CHURN_HI && F < CHURN_HI;
  const gExceedsSpread = G > SPREAD_R;
  const cornerShareMaterial = cornerShare >= CORNER_MATERIAL;
  const farFromCompressedShape = gExceedsSpread || cornerShareMaterial;
  const modulationMissing = sendStable && farFromCompressedShape;
  const churning = S >= CHURN_HI || F >= CHURN_HI;
  const sendSaneAndNear = D <= NEAR_M && cornerShare < CORNER_MATERIAL;
  const oscillation = churning && sendSaneAndNear;
  return {
    scales: { CHURN_HI: round(CHURN_HI), NEAR_M, SPREAD_R, CORNER_MATERIAL },
    weak: { S: round(S), F: round(F), D: round(D), G: round(G), sendCornerShare: round(cornerShare) },
    ballSideMirror: { S: round(Sc), F: round(Fc), D: round(Dc), G: round(Gc) },
    clauseTerms: {
      sendStable, gExceedsSpread, cornerShareMaterial, farFromCompressedShape,
      churning, sendSaneAndNear,
      note: '(i) = sendStable AND (gExceedsSpread OR cornerShareMaterial) — the frozen '
        + '§5 disjunct, verbatim; (ii) = churning AND sendSaneAndNear',
    },
    supportsModulationMissing: modulationMissing,
    supportsOscillation: oscillation,
    verdict: modulationMissing && oscillation ? 'COMPOUND (both clauses fire)'
      : modulationMissing ? 'H-186a(i) MODULATION MISSING'
        : oscillation ? 'H-186a(ii) OSCILLATION'
          : 'NEITHER clause fires as frozen — see §5 NEITHER',
  };
};

/* ========================================================================== */
/* §6 RUN                                                                     */
/* ========================================================================== */
interface WorldBlock {
  matches: number; episodes: number; episodesPerMatch: number;
  triggerTicks: number; playedTicks: number; triggerTickShareOfPlayed: number;
  excluded: { shortEpisodes: number; sentOffEpisodes: number };
  episodeDurationS: { mean: number; p50: number; p90: number; max: number };
  a4RuleCrossCheck: Record<string, unknown>;
  weakSideBack: Record<string, any>;
  ballSideControlMirror: Record<string, any>;
  contrasts: Record<string, unknown>;
  reading: Record<string, any>;
  receipts: unknown[];
}
interface RunOut {
  seeds: { base: number; count: number; first: number; last: number };
  worlds: Record<World, WorldBlock>;
  probeReadOnly: boolean;
}

const runAll = (tag: string, base: number, n: number): RunOut => {
  const seeds = Array.from({ length: n }, (_, i) => base + i);
  const byWorld = {} as Record<World, WorldBlock>;
  const perWorldWalks: Record<World, MatchWalk[]> = { prod: [], v1: [], v2: [], v3: [] };
  for (const w of WORLDS) {
    for (let i = 0; i < seeds.length; i++) {
      perWorldWalks[w].push(walkMatch(w, seeds[i]));
      if ((i + 1) % 10 === 0 || i + 1 === seeds.length) {
        process.stderr.write(`  [fsd ${tag}] ${w} ${i + 1}/${seeds.length}\n`);
      }
    }
  }
  for (const w of WORLDS) {
    const walks = perWorldWalks[w];
    const eps = walks.flatMap((k) => k.episodes);
    const durs = eps.map((e) => e.simSeconds);
    byWorld[w] = {
      matches: walks.length,
      episodes: eps.length,
      episodesPerMatch: round(eps.length / Math.max(1, walks.length), 4),
      triggerTicks: walks.reduce((s, k) => s + k.triggerTicks, 0),
      playedTicks: walks.reduce((s, k) => s + k.playedTicks, 0),
      triggerTickShareOfPlayed: round(
        walks.reduce((s, k) => s + k.triggerTicks, 0) / Math.max(1, walks.reduce((s, k) => s + k.playedTicks, 0)),
      ),
      excluded: {
        shortEpisodes: walks.reduce((s, k) => s + k.excludedShort, 0),
        sentOffEpisodes: walks.reduce((s, k) => s + k.excludedSentOff, 0),
      },
      episodeDurationS: {
        mean: round(mean(durs)), p50: round(quantile(durs, 0.5)),
        p90: round(quantile(durs, 0.9)), max: round(quantile(durs, 1)),
      },
      a4RuleCrossCheck: {
        rule: 'stage doc §2.2 (the A4 ATTACK_FORMATIONS home rule) vs §2.1 (the wide-slot rule)',
        agreementRate: round(
          eps.filter((e) => e.a4RuleAgrees === true).length
          / Math.max(1, eps.filter((e) => e.a4RuleAgrees !== null).length),
        ),
        undefinedEpisodes: walks.reduce((s, k) => s + k.a4RuleUndefined, 0),
        // D3 (declared addition): CHARACTERISE the divergence rather than only report it
        a4PickSlotMix: (() => {
          const c = new Map<number, number>();
          for (const e of eps) if (e.a4RulePickIdx !== null) c.set(e.a4RulePickIdx, (c.get(e.a4RulePickIdx) ?? 0) + 1);
          const tot = [...c.values()].reduce((s, v) => s + v, 0);
          return Object.fromEntries([...c.entries()].sort((p, q) => q[1] - p[1])
            .map(([k, v]) => [`slot${k}`, round(v / Math.max(1, tot), 5)]));
        })(),
        bodyGapM: (() => {
          const gs = eps.map((e) => e.a4RulePickGapM).filter((x) => Number.isFinite(x));
          return { mean: round(mean(gs)), p50: round(quantile(gs, 0.5)), p90: round(quantile(gs, 0.9)) };
        })(),
      },
      weakSideBack: levelsOf(eps, 'weak') as Record<string, any>,
      ballSideControlMirror: levelsOf(eps, 'ballSide') as Record<string, any>,
      contrasts: bootstrapWorld(eps, seeds),
      reading: readingOf(eps) as Record<string, any>,
      receipts: [...eps]
        .sort((p, q) => q.weak.detachMean - p.weak.detachMean)
        .slice(0, RECEIPTS_PER_WORLD)
        .map((e) => ({
          seed: e.seed, startTick: e.startTick, simSeconds: round(e.simSeconds, 3),
          defendingSide: e.defSide, flankSign: e.flankSign,
          weakSideSlot: e.weakIdx, ballSideSlot: e.ballIdx,
          watchHint: `world ${e.world}, seed ${e.seed}, from tick ${e.startTick} `
            + `(${round(e.startTick * DT, 2)} sim-s), defending side ${e.defSide}, `
            + `ball on flank ${e.flankSign > 0 ? '+y' : '-y'}, weak-side slot ${e.weakIdx}`,
          weak: {
            detachMean: round(e.weak.detachMean, 3), detachMax: round(e.weak.detachMax, 3),
            distToSendMean: round(e.weak.distToSendMean, 3),
            sendLatGapMean: round(e.weak.sendLatGapMean, 3),
            switchRate: round(e.weak.switchRate, 3), flipRate90: round(e.weak.flipRate90, 3),
            sendCornerShare: round(e.weak.sendCornerShare, 4),
            posCornerShare: round(e.weak.posCornerShare, 4),
            markShare: round(e.weak.markShare, 4),
            distToMarkMean: round(e.weak.distToMarkMean, 3),
            markLatGapMean: round(e.weak.markLatGapMean, 3),
            markCornerShareOfMarkTicks: round(e.weak.markCornerShareOfMarkTicks, 4),
            steerMix: Object.fromEntries(
              Object.entries(e.weak.steerMix).map(([k, v]) => [k, round(v, 4)]),
            ),
          },
          ballSide: {
            detachMean: round(e.ballSide.detachMean, 3),
            distToSendMean: round(e.ballSide.distToSendMean, 3),
            switchRate: round(e.ballSide.switchRate, 3),
            flipRate90: round(e.ballSide.flipRate90, 3),
          },
        })),
    };
  }
  const probeReadOnly = WORLDS.every((w) => perWorldWalks[w].every((k) => k.probeReadOnly));
  return {
    seeds: { base, count: n, first: seeds[0], last: seeds[seeds.length - 1] },
    worlds: byWorld,
    probeReadOnly,
  };
};

/* ========================================================================== */
/* §5.5 THE CENSUS N — DERIVED FROM THE FROZEN §4.3 RULE, NOT HARDCODED       */
/* ========================================================================== */
/** The frozen §4.3 arithmetic AS A FUNCTION. Its only inputs are the two numbers
 *  §4.3 says come from the sizing smoke. Nothing else feeds N. */
const frozenNStar = (bindingEpisodesPerMatch: number, msPerMatchIn: number) => {
  const nRaw = bindingEpisodesPerMatch > 0
    ? Math.ceil(TARGET_EPISODES_PER_WORLD / bindingEpisodesPerMatch) : Number.NaN;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / N_STEP) * N_STEP : Number.NaN;
  const nAffordableAtBudget = Math.floor(
    (WALL_BUDGET_HOURS * 3_600_000) / (msPerMatchIn * WORLDS_COUNT * XDET_FACTOR),
  );
  const terms = {
    episodeTarget: nStepped, wallBudget: nAffordableAtBudget, reservedBandCap: N_CAP,
  };
  const nStar = Math.min(nStepped, nAffordableAtBudget, N_CAP);
  const bindingTerm = (Object.entries(terms).find(([, v]) => v === nStar) ?? ['none'])[0];
  return {
    arithmetic: `N* = min( ceil(${TARGET_EPISODES_PER_WORLD} / episodesPerMatch_binding) rounded up to `
      + `${N_STEP}, floor(${WALL_BUDGET_HOURS} h / (ms_per_match × ${WORLDS_COUNT} worlds × ${XDET_FACTOR} X-DET)), `
      + `${N_CAP} ) — frozen in stage doc §4.3 BEFORE the smoke ran`,
    targetEpisodesPerWorld: TARGET_EPISODES_PER_WORLD,
    bindingEpisodesPerMatch: round(bindingEpisodesPerMatch, 4),
    msPerMatch: round(msPerMatchIn, 3),
    nRaw, nStepped, nStep: N_STEP, nAffordableAtBudget, nCap: N_CAP,
    terms, nStar: Number.isFinite(nStar) ? nStar : null, bindingTerm,
    projectedWallHours: Number.isFinite(nStar)
      ? round((nStar * WORLDS_COUNT * XDET_FACTOR * msPerMatchIn) / 3_600_000, 3) : null,
  };
};

/** CENSUS MODE: the smoke's artifact is READ and the frozen rule is EVALUATED on
 *  it, here, before a single census match is stepped. N is that output — it is not
 *  a constant in this file. (The smoke's own N is fixed by §4.2 at 16 seeds.) */
const nDerivation = ((): Record<string, unknown> & { n: number } => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke',
      note: 'THIS RUN IS THE SIZING SMOKE. Its N is fixed by stage doc §4.2 at 16 seeds '
        + '(block 12,310,200..12,310,215); the §4.3 arithmetic is not applicable to it — '
        + 'the smoke is the arithmetic\'s INPUT.',
      n: SMOKE_MATCHES,
    };
  }
  const bytes = readFileSync(SIZING_PATH);
  const smoke = JSON.parse(bytes.toString('utf8')) as {
    mode: string;
    seeds: { base: number; count: number; first: number; last: number };
    sizingRecompute?: { episodesPerMatchByWorld: Record<string, number>; msPerMatch: number };
    sizing?: { episodesPerMatchByWorld: Record<string, number>; msPerMatch: number };
  };
  const smokeSizing = smoke.sizingRecompute ?? smoke.sizing;
  if (smoke.mode !== 'smoke' || smokeSizing === undefined) {
    throw new Error(`${SIZING_PATH} is not a usable sizing-smoke artifact (mode=${smoke.mode})`);
  }
  const perWorld = smokeSizing.episodesPerMatchByWorld;
  const binding = Math.min(...Object.values(perWorld));
  const derived = frozenNStar(binding, smokeSizing.msPerMatch);
  const n = N_ENV ?? (derived.nStar as number);
  return {
    mode: 'census',
    source: SIZING_PATH,
    sizingArtifactSha256: createHash('sha256').update(bytes).digest('hex'),
    smokeSeeds: smoke.seeds,
    inputsFromSmoke: { episodesPerMatchByWorld: perWorld, bindingWorldEpisodesPerMatch: round(binding, 4), msPerMatch: smokeSizing.msPerMatch },
    ...derived,
    envOverride: N_ENV,
    n,
    note: 'The census N is the output of the frozen §4.3 rule evaluated IN THIS PROCESS on '
      + 'the sizing smoke\'s own two numbers, read from the committed smoke artifact (sha '
      + 'above) before any census match ran. `bindingTerm` names which of the three terms '
      + 'actually selected N. No level, share or rate from the smoke is read as a result.',
  };
})();

const RUN_BASE = MODE === 'smoke' ? SMOKE_BASE : CENSUS_BASE;
const RUN_N = nDerivation.n;

const t0 = Date.now();
const first = runAll('pass1', RUN_BASE, RUN_N);
const passMs = Date.now() - t0;
const second = runAll('pass2', RUN_BASE, RUN_N);
const firstJson = JSON.stringify(first);
const xDet = firstJson === JSON.stringify(second);
const resultSha = createHash('sha256').update(firstJson).digest('hex');

const msPerMatch = passMs / Math.max(1, RUN_N * WORLDS_COUNT);
/** POST-HOC, and selects NOTHING. The same frozen §4.3 arithmetic re-evaluated on
 *  THIS run's own episode yield and ms/match, so the smoke's estimate can be checked
 *  against the census's reality. In smoke mode this block IS the sizing input that
 *  the census's `nDerivation` later consumes. */
const sizingRecompute = (() => {
  const worlds = first.worlds;
  const binding = Math.min(...WORLDS.map((w) => worlds[w].episodesPerMatch));
  const derived = frozenNStar(binding, msPerMatch);
  return {
    provenance: MODE === 'smoke'
      ? 'THE SIZING SMOKE\'S OWN NUMBERS — episodesPerMatchByWorld and msPerMatch here are '
        + 'the two inputs the census\'s frozen §4.3 derivation reads out of this artifact.'
      : 'POST-HOC RECOMPUTE OF THIS CENSUS RUN. It selected nothing: the N actually run '
        + 'came from `nDerivation` (the frozen rule on the SMOKE\'s numbers). Reported so the '
        + 'smoke\'s estimate can be compared with what the census really yielded.',
    episodesPerMatchByWorld: Object.fromEntries(WORLDS.map((w) => [w, worlds[w].episodesPerMatch])),
    ...derived,
    nStarLabel: MODE === 'smoke' ? 'nStar (this is the sizing run)' : 'nStar COUNTERFACTUAL (not the N run)',
  };
})();

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (--skip-fp)' : leagueHash(FINGERPRINT_SEED);
const xFpProd = SKIP_FP || fpObserved === FINGERPRINT_BASELINE;

/* --- seed / stats disjointness --------------------------------------------- */
const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + Math.max(0, RUN_N - 1);
const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
const aboveCeiling = firstSeed > CONSUMED_CEILING;
const clashes = CONSUMED.filter((c) => !(lastSeed < c.range[0] || firstSeed > c.range[1]));
const ownBlocksDisjoint = SMOKE_BASE + SMOKE_MATCHES - 1 < CENSUS_BASE;
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

/* --- arm identity + flag hygiene ------------------------------------------ */
const armIdent = (() => {
  const rows = WORLDS.map((w) => {
    // RESERVED_BAND[1] = 12,310,999 = the CENSUS BLOCK'S LAST SEED. Used here for
    // CONSTRUCTION ONLY — this match is never stepped, so it consumes no stream and
    // cannot perturb the census's own walk over the same seed.
    const m = matchFor(w, RESERVED_BAND[1]);
    const eye = m.stationEye;
    const g0 = m.teams[0].effGenome as TacticalGenome;
    const g1 = m.teams[1].effGenome as TacticalGenome;
    return {
      world: w,
      eyeArmed: eye !== null,
      homePrior: eye?.v4?.homePrior === true,
      mergedShaOnEye: eye?.v3?.mergedTableSha ?? null,
      obedience: [g0.homePriorObedience ?? null, g1.homePriorObedience ?? null],
      offsets: [homePriorOffsets(g0) ?? null, homePriorOffsets(g1) ?? null],
      o1PassWindup: m.o1PassWindup,
      censusFlags: {
        edsPerceivedDefence: m.edsPerceivedDefence, edsPerceivedChoice: m.edsPerceivedChoice,
        edsValueAxis: m.edsValueAxis, c5Hold: m.c5Hold, c6Carry: m.c6Carry,
        c7Windup: m.c7Windup, c5TouchFork: m.c5TouchFork,
      },
    };
  });
  const by = Object.fromEntries(rows.map((r) => [r.world, r])) as Record<World, typeof rows[number]>;
  const offEq = (v: unknown): boolean => JSON.stringify(v) === JSON.stringify([...A4_V2_OFFSETS]);
  const pass = by.prod.eyeArmed === false && by.prod.o1PassWindup === false
    && by.prod.censusFlags.c5Hold === false
    && WORLDS.slice(1).every((w) => by[w as World].eyeArmed && by[w as World].homePrior
      && by[w as World].mergedShaOnEye === MERGED_SHA_EXPECTED
      && by[w as World].obedience.every((o) => o === A4_OBEDIENCE))
    && by.v1.offsets.every((o) => o === null || o === undefined)
    && by.v2.offsets.every(offEq) && by.v3.offsets.every(offEq)
    && by.v1.o1PassWindup === false && by.v2.o1PassWindup === false && by.v3.o1PassWindup === true;
  return { pass, rows };
})();
const flagHygiene = (() => {
  const censusKeys = Object.keys(A4_WORLD_FLAGS);
  const v1 = worldFlags('v1')!; const v2 = worldFlags('v2')!; const v3 = worldFlags('v3')!;
  return {
    pass: worldFlags('prod') === null
      && JSON.stringify(v1) === JSON.stringify(A4_WORLD_FLAGS)
      && JSON.stringify(v2) === JSON.stringify(A4_WORLD_FLAGS)
      && v3.o1PassWindup === true
      && Object.keys(v3).length === censusKeys.length + 1
      && censusKeys.every((k) => (v3 as Record<string, boolean>)[k] === (A4_WORLD_FLAGS as Record<string, boolean>)[k]),
    note: 'A4_WORLD_FLAGS is never widened; v3 composes o1PassWindup at the ENTRY layer (#184.2)',
    prod: null, v1, v2, v3,
  };
})();

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const gates = {
  xDet: { pass: xDet, note: 'the whole four-world computation run twice, JSON byte-identical' },
  xFpProd: {
    pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS, skipped: SKIP_FP,
  },
  xSrcUntouched: { pass: srcDiff === '', srcDiff },
  seedDisjoint: {
    pass: inBand && aboveCeiling && clashes.length === 0 && ownBlocksDisjoint,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND,
    consumedCeiling: CONSUMED_CEILING, aboveCeiling,
    clashes: clashes.map((c) => c.name), ownBlocksDisjoint,
    smokeBlock: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_MATCHES - 1}`, censusBase: CENSUS_BASE,
  },
  statsDisjoint: { pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap },
  flagHygiene,
  tableSha: { ...tableIdent, pass: tableIdent.pass },
  armIdent,
  nDerived: {
    pass: MODE === 'smoke'
      ? RUN_N === SMOKE_MATCHES
      : N_ENV === null && RUN_N === nDerivation.nStar && typeof nDerivation.nStar === 'number',
    ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, envOverride: N_ENV,
    bindingTerm: nDerivation.bindingTerm ?? null,
    note: 'the N actually run IS the frozen §4.3 rule\'s output on the smoke\'s numbers — '
      + 'RED if an FSD_N override replaced it (then the run is not the pre-registered N)',
  },
  probeReadOnly: {
    pass: first.probeReadOnly === true,
    note: 'abandonRestDesignation / homeRegionGrant / homeMapGrant null on every match '
      + '(so the probe\'s formationSpot re-read matches the executor\'s own arguments)',
  },
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

const output = {
  experiment: 'FARSIDE-DEFENDER-FORENSIC',
  authority: 'PROGRAMME-RULINGS #186.4 (on the #186.2 user verdict and the #186.3 hypothesis H-186a)',
  stageDoc: 'docs/world-model/FARSIDE-DEFENDER-FORENSIC.md — every definition frozen there BEFORE this run',
  mode: MODE,
  userLens: '对面断球在右后卫位置,左后卫会在左下角乱转,脱离球队之外',
  hypothesis: {
    'H-186a(i)': 'MODULATION MISSING — no defensive ball-side compression force reaches the weak-side back',
    'H-186a(ii)': 'OSCILLATION — the live station field flips him between targets',
    readingRule: 'stage doc §5, PRE-REGISTERED: (i) = stable send (switch AND flip rates < 1/EYE_W_S) '
      + 'while the target sits far from any compressed shape — "G > SPREAD_R (9 m), AND/OR the send\'s '
      + 'corner share is materially non-zero" (a DISJUNCTION, both terms evaluated and emitted under '
      + 'reading.clauseTerms); (ii) = churn rate >= 1/EYE_W_S while the send is sane and near (<= 14 m) '
      + 'and its corner share is low. Every "high"/"low" is judged against the same-tick BALL-SIDE '
      + 'CONTROL MIRROR.',
  },
  frozenParameters: {
    trigger: {
      ownThirdLocalX: round(OWN_THIRD_LOCAL_X, 4), flankAbsY: round(FLANK_ABS_Y, 4),
      minEpisodeTicks: MIN_EPISODE_TICKS, minEpisodeSeconds: round(MIN_EPISODE_TICKS * DT, 4),
      note: 'ownThird = localXBand\'s own cut (-HALF_L/3); flank = outside BOX_WIDTH/2',
    },
    corner: {
      clampCornerLocal: [round(CLAMP_CORNER_LOCAL_X, 4), round(CLAMP_CORNER_ABS_Y, 4)],
      radius: SPREAD_R,
      note: 'the emergentStation clamp corner (-HALF_L+3, HALF_W-2) and its own anti-clump radius 9',
    },
    churn: { speedMinMs: SPEED_MIN, churnHiPerS: round(CHURN_HI), eyeWindowS: EYE_W_S, nearM: NEAR_M },
    worlds: 'prod / v1 / v2 / v3 per stage doc §4.1 (a4MatchFlags + armA4World, the fidelity source)',
  },
  declaredAdditions: {
    provenance: 'DECLARED AND LABELLED (stage doc §4.4). Added AFTER the 16-seed plumbing '
      + 'sizing smoke and BEFORE the census run, because the smoke\'s ACTION MIX showed the '
      + 'weak-side back spends most in-trigger ticks in MarkOpponent (so the station field is '
      + 'not his only steer) and the §2.2 A4-home cross-check agreed with §2.1 on 0 % of '
      + 'episodes. Nothing frozen in §1-§3/§5 is removed, redefined or re-thresholded; these '
      + 'three additions only ADD facts the reading rule then consumes at face value.',
    D1: 'the MARK ANCHOR on MarkOpponent ticks — distance to the marked opponent, that '
      + 'opponent\'s lateral gap to the ball, whether he is himself on the FAR side of the '
      + 'flank, and whether HE stands in the corner. Names a third possible driver the ruling '
      + 'did not enumerate: the back may be following a man, not a station.',
    D2: 'the STEER-OWNER MIX — which mechanism owns the movement target per tick, in '
      + 'executeAction\'s own precedence: eyeOverride > markStance > stationHome > ballDirected.',
    D3: 'the A4-home divergence CHARACTERISED — which slot §2.2 actually picks and how far '
      + 'that body stands from §2.1\'s wide back, so "0 % agreement" is described not just stated.',
  },
  nDerivation,
  sizingRecompute,
  ...first,
  gates,
  allGatesPass,
  deterministic: xDet,
  resultSha,
  head,
  wallMs: Date.now() - wall0,
  disclosure: [
    'Observation frame: every read is taken AFTER m.step(DT); the executor evaluated its own '
      + 'station field at the HEAD of that tick, so the probe\'s formationSpot re-read is the field '
      + 'one tick downstream of the executor\'s call (stage doc §3, disclosed).',
    'SPEED_MIN = 1.0 m/s is a FLAGGED executor\'s choice — no published anchor exists for '
      + '"moving at all" (stage doc §3.5).',
    'The compression yardstick (§3.3) is DESCRIPTIVE: no claim that a compressed shape is correct football. '
      + 'compressionShortfallMean is a BODY metric (mean of max(0, |p.y − ball.y| − 9)); sendLatGapMean is a '
      + 'TARGET metric. They are not two views of one quantity and do not subtract into each other.',
    'SWITCH-KEY LIMITATION (§3.4): the key is type|markTargetIdx|eyeCandidateId and eyeCandidateId '
      + 'collapses to "-" whenever the override is not applying, so a switch cannot be attributed to eye '
      + 'candidate cycling as against action-type or mark-target alternation. prod carries ZERO override '
      + 'ticks and still shows a non-zero switch mean, which proves the metric fires on non-eye causes.',
    'FLIP-RATE DEFECT (§3.5): the flip test compares CONSECUTIVE ticks while ACCEL = 14 m/s² caps a '
      + 'per-tick Δv at 0.23 m/s, so a >90° per-tick reversal is near-unreachable and every flip rate is '
      + '≈0 by construction. The F term of the §5 rule is vacuous; S carried clause (ii) alone.',
    'CORNER_MATERIAL = 0.05 is a FLAGGED executor\'s choice: §5 says "materially non-zero" and "low" '
      + 'without a number, so one cut serves both clauses (§5 corner disjunct and (ii)\'s corner condition).',
    'NOTHING SHIPS (Road B): zero src/** changes, the production fingerprint is re-derived unchanged.',
  ],
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const W = first.worlds;
const pct = (x: number): string => `${(x * 100).toFixed(2)}%`;
console.error(
  `FARSIDE-DEFENDER-FORENSIC (${MODE}) · ${firstSeed}..${lastSeed} (${RUN_N} seeds × 4 worlds)\n`
  + WORLDS.map((w) => {
    const r = W[w];
    return `  ${w.padEnd(5)} eps ${String(r.episodes).padStart(5)} `
      + `(${r.episodesPerMatch}/match, dur p50 ${r.episodeDurationS.p50}s) · `
      + `detach p50 weak ${r.weakSideBack.detachMean.p50} vs ball-side ${r.ballSideControlMirror.detachMean.p50} · `
      + `distToSend ${r.weakSideBack.distToSendMean.p50} · sendLatGap ${r.weakSideBack.sendLatGapMean.p50} · `
      + `switch/s ${r.weakSideBack.switchRate.p50} (mirror ${r.ballSideControlMirror.switchRate.p50}) · `
      + `flip90/s ${r.weakSideBack.flipRate90.p50} (mirror ${r.ballSideControlMirror.flipRate90.p50}) · `
      + `sendCorner ${pct(r.weakSideBack.sendCornerShare.mean)} · override ${pct(r.weakSideBack.overrideShare.mean)}\n`
      + `        steer ${JSON.stringify(r.weakSideBack.steerMix)} · mark: dist p50 `
      + `${r.weakSideBack.distToMarkMean.p50}, markLatGap p50 ${r.weakSideBack.markLatGapMean.p50}, `
      + `markFarSide ${pct(r.weakSideBack.markFarSideShareOfMarkTicks.mean)}, `
      + `markInCorner ${pct(r.weakSideBack.markCornerShareOfMarkTicks.mean)}\n`
      + `        A4-rule agreement ${pct(r.a4RuleCrossCheck.agreementRate as number)} `
      + `(picks ${JSON.stringify(r.a4RuleCrossCheck.a4PickSlotMix)})\n`
      + `        READING: ${r.reading.verdict}\n`;
  }).join('')
  + `  gates ${allGatesPass ? 'GREEN' : 'RED'} · xDet ${xDet} · xFp ${xFpProd} · srcZero ${srcDiff === ''}\n`
  + `  N run ${RUN_N} = frozen §4.3 N* (${String(nDerivation.bindingTerm ?? 'n/a')} binds) · `
  + `post-hoc recompute on this run ${String(sizingRecompute.nStar)} (${sizingRecompute.bindingTerm} binds, selects nothing)\n`
  + `  resultSHA ${resultSha.slice(0, 12)} → ${OUT_PATH}\n`,
);
if (!allGatesPass) process.exitCode = 1;
