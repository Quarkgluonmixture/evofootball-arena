#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-T2 — THE DEFENSIVE DECISION SURFACE: THE RECEIPT WALKS (armed vs shut)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #325 item 5, bound by
 * `docs/world-model/DF-DEFENSIVE-BRAIN-CONTRACT.md` §2 (M-DF.1/M-DF.2/M-DF.3/M-DF.4).
 *
 * ⭐ THIS IS NOT AN EXAM. Canon: receipts ≠ effect sizes (homes: ruling #289
 * item 1 + BU-T1 §CORR item 5) — these walks produce ARMING RECEIPTS with
 * units. NO football claim is made here; H-DF.1(a)+(b) is the EXAM's business.
 *
 * THE ARMS. Both arms are the DF-T1-banked defensive world (world 9 +
 * `dfAssignPersist`), because the HOLD option's substrate IS the persistence
 * law. The ONLY arm difference is `dfSurface`.
 *
 * WHAT IT MEASURES:
 *   · ⭐ THE USAGE DISTRIBUTION over the four options (press · hold · jump ·
 *     take) by SITUATION (team mode) and by BODY (per-gid, joined to attrs
 *     HERE, never in src) — the NON-DEGENERACY receipt.
 *   · ⭐ FIRST RECEIPT ORDERED (#325 item 5): `multiChaseShare3`, re-measured
 *     at DF-T1's own grain in BOTH arms (#324 left it grazing zero upward).
 *   · the churn/coverage/dupMark family at the DF-T0 grain (definitions REUSED
 *     VERBATIM from `scripts/probes/df-t0-assignment-persistence.ts`, which
 *     took them from the DF-C0 census and which this file never touches).
 *   · the SWARM BAND with the cap intact (the four-chaser bin).
 *   · ⭐ THE INTERCEPTION FACE — the #324 mandate's own face.
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)) — this file is frozen in
 *     its own commit BEFORE the battery runs; the artifact records its sha256.
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1).
 *   · per-seed cells (home ruling #282.2(ii)).
 *   · gFaces-from-disk (home ruling #287 item 1) + "the re-derivation gate
 *     covers EVERY published face; a percentile face requires stored bins"
 *     (home PC-C0 §CORR item 4).
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0
 *     §CORR item 1).
 *   · "a field carries the unit its name claims" (home ruling #294 item 3).
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
 *     matchFlags; true since #155, stated now, test-pinned; refines #270's E4
 *     correction; matches the perf diagnostic)" (home ruling #283.2(iv)).
 *   · clock honesty (paraphrase) · seed discipline: BOOKED = WALKED.
 *   · ⭐ DF-C0 §CORR item 2 (ruling #321): the body is hashed LAST.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DFT2_MODE (smoke|full, REQUIRED) · DFT2_OUT.
 *   ANY other `DFT2_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run may not write the canonical path.
 *
 * RUN: DFT2_MODE=full npx tsx scripts/probes/df-t2-decision-surface.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { DF_SURFACE_OPTIONS } from '../../src/ai/TeamBrain';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['DFT2_MODE', 'DFT2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'A4_WORLD', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('DFT2_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
const MODE = process.env.DFT2_MODE;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: DFT2_MODE must be smoke|full');
  process.exit(2);
}
const OUT_OVERRIDE = process.env.DFT2_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/df-t2-decision-surface.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE === 'smoke';

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** DF-T2's OWN booked block (ruling #325 item 5): 12,512,000–999. */
const BLOCK_BASE = 12_512_000;
const FULL_SEEDS = [
  ...Array.from({ length: 40 }, (_, i) => BLOCK_BASE + i),
  BLOCK_BASE + 999,
];
/** the smoke prefix, IN BAND — the same seeds the permanent pin suite uses */
const SMOKE_SEEDS = [BLOCK_BASE + 800, BLOCK_BASE + 801, BLOCK_BASE + 802];
const SEEDS = MODE === 'full' ? FULL_SEEDS : SMOKE_SEEDS;

/* ========================================================================== */
/* §2 THE WORLD, AND THE ANCHORED SRC EXTRACTIONS                             */
/* ========================================================================== */
const DF_WORLD = 9 as const;
const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>) as readonly L3DoseCell[];
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

const readSrc = (rel: string): string => readFileSync(rel, 'utf8');
/**
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): each constant is pulled from ONE
 * named line that must occur EXACTLY ONCE in its file. Never first-occurrence, never a
 * re-typed literal. The first three are DF-C0 §R2 / DF-T0's; the last two are THIS stage's —
 * the shipped Phase-29.1 contain branch, which is the executable form of the PRESS option.
 */
interface Anchor { id: string; file: string; line: string; re: RegExp }
const ANCHORS: readonly Anchor[] = [
  {
    id: 'markStanceBand',
    file: 'src/ai/actionExecutor.ts',
    line: '        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;',
    re: /mark \? (\d+(?:\.\d+)?) :/,
  },
  {
    id: 'zonalEngageRadius9',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;',
    re: /threat\.pos\) > (\d+(?:\.\d+)?)\)/,
  },
  {
    id: 'markRange22',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };',
    re: /d < (\d+(?:\.\d+)?) &&/,
  },
  {
    id: 'containRadius8',
    file: 'src/ai/PlayerBrain.ts',
    line: '      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {',
    re: /dC < (\d+(?:\.\d+)?) &&/,
  },
  {
    id: 'containTerritory35',
    file: 'src/ai/PlayerBrain.ts',
    line: '      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {',
    re: /carrierGoalD < (\d+(?:\.\d+)?) &&/,
  },
];
interface AnchorReceipt {
  id: string; file: string; line: string; matches: number; lineNumbers: number[]; value: number;
}
const anchorReceipts: AnchorReceipt[] = ANCHORS.map((a) => {
  const lines = readSrc(a.file).split('\n');
  const hits = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, matches: hits.length, lineNumbers: hits,
    value: m === null ? Number.NaN : Number(m[1]),
  };
});
const anchorOf = (id: string): number => {
  const r = anchorReceipts.find((x) => x.id === id);
  return r === undefined || r.matches !== 1 ? Number.NaN : r.value;
};
const SWARM_R_STANCE = anchorOf('markStanceBand');
const SWARM_R_ZONE = anchorOf('zonalEngageRadius9');
const MARK_RANGE = anchorOf('markRange22');
const CONTAIN_R = anchorOf('containRadius8');
const CONTAIN_TERR = anchorOf('containTerritory35');
const ANCHORS_OK = SWARM_R_STANCE === 2.6 && SWARM_R_ZONE === 9 && MARK_RANGE === 22
  && CONTAIN_R === 8 && CONTAIN_TERR === 35;
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}

/**
 * ⭐ M-DF.2's SOURCE receipt: the `assignChasers` slice, sha'd. The cap's own function must be
 * byte-identical to the value frozen at DF-T2's freeze commit (which is HEAD's).
 */
const CHASER_SLICE_SHA_OF_RECORD =
  '5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c';
const teamBrainSrc = readSrc('src/ai/TeamBrain.ts');
const chaserSlice = teamBrainSrc.slice(
  teamBrainSrc.indexOf('function assignChasers(team: Team, match: Match): void {'),
  teamBrainSrc.indexOf('/**\n * Marks: each non-chasing outfielder'),
);
const chaserSliceSha = createHash('sha256').update(chaserSlice).digest('hex');

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/**
 * The DF-T1 BANKED defensive world: DF-C0 §R2's world-9 stack PLUS `dfAssignPersist` in BOTH
 * arms (the HOLD option's substrate). `dfSurface` is the ONLY arm difference.
 */
const buildMatch = (seed: number, armed: boolean): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(DF_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    dfAssignPersist: true,
    ...(armed ? { dfSurface: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, DF_WORLD, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §3 THE INSTRUMENT — DF-C0 §R2 / DF-T0's definitions, REUSED VERBATIM        */
/* ========================================================================== */
/** DF-C0 §R2: the P3′/MT/PM duplicate-target radius, inherited not re-invented. */
const DUP_RUN_M = 4;
type Family = 'ONBALL' | 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'OTHER';
const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': return 'FORMATION';
    case 'SupportBallCarrier': return 'SUPPORT';
    case 'MakeRun': return 'RUN';
    case 'MarkOpponent': return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass': return 'BALL';
    default: return 'OTHER';
  }
};
const LAT_BINS = 8;
const LAT_BIN_S = 0.5;
const latBinOf = (s: number): number => Math.min(LAT_BINS - 1, Math.floor(s / LAT_BIN_S));
const SWARM_BINS = 6;
const N_OPT = DF_SURFACE_OPTIONS.length;

interface Row {
  arm: 'shut' | 'armed';
  seed: number;
  worldOk: boolean;
  ticks: number;
  playingTicks: number;
  defTeamTicks: number;
  defenderTicks: number;
  markSwitches: number;
  markAbandons: number;
  markStarts: number;
  chaseStarts: number;
  chaseAbandons: number;
  markHeldTicks: number;
  reTargetLatencyBins: number[];
  reTargetLatencyCount: number;
  reTargetLatencyTickSum: number;
  markPairTicks: number;
  dupMarkTicks: number;
  multiChase2Ticks: number;
  multiChase3Ticks: number;
  carrierTicks: number;
  swarmStanceBins: number[];
  swarmZoneBins: number[];
  chaserCountBins: number[];
  goals: number;
  tackles: number;
  interceptions: number;
  /** DF-T2 §THE USAGE LEDGER, read off the match at the whistle */
  elections: number;
  idle: number;
  pressOffered: number;
  pressDeclinedByBook: number;
  byOption: number[];
  byModeOption: number[];
  /** per-body: [defendingAttr, press, hold, jump, take] — the join happens HERE, not in src */
  bodyRows: number[][];
  stepWallMs: number;
}

const worldConjuncts = (m: Match, armed: boolean): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: unknown; l3Defence: unknown;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
  };
  return {
    armedVersionIsWorldNine: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    l3BooksPresent: mm.l3Defence !== null,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    l3DefenceDoorsArmed: mm.l3DefenceLearn === true && mm.l3DefenceVeto === true,
    /** the HOLD option's substrate is on in BOTH arms */
    persistenceOnBothArms: m.dfAssignPersist === true,
    /** THE ONLY ARM DIFFERENCE */
    surfaceDoorMatchesArm: m.dfSurface === armed,
  };
};

const walk = (seed: number, armed: boolean): Row => {
  const m = buildMatch(seed, armed);
  const wOk = Object.values(worldConjuncts(m, armed)).every(Boolean);
  const row: Row = {
    arm: armed ? 'armed' : 'shut',
    seed, worldOk: wOk, ticks: 0, playingTicks: 0, defTeamTicks: 0, defenderTicks: 0,
    markSwitches: 0, markAbandons: 0, markStarts: 0, chaseStarts: 0, chaseAbandons: 0,
    markHeldTicks: 0,
    reTargetLatencyBins: Array.from({ length: LAT_BINS }, () => 0),
    reTargetLatencyCount: 0, reTargetLatencyTickSum: 0,
    markPairTicks: 0, dupMarkTicks: 0, multiChase2Ticks: 0, multiChase3Ticks: 0,
    carrierTicks: 0,
    swarmStanceBins: Array.from({ length: SWARM_BINS }, () => 0),
    swarmZoneBins: Array.from({ length: SWARM_BINS }, () => 0),
    chaserCountBins: Array.from({ length: 5 }, () => 0),
    goals: 0, tackles: 0, interceptions: 0,
    elections: 0, idle: 0, pressOffered: 0, pressDeclinedByBook: 0,
    byOption: Array.from({ length: N_OPT }, () => 0),
    byModeOption: Array.from({ length: 2 * N_OPT }, () => 0),
    bodyRows: [],
    stepWallMs: 0,
  };
  const prevMark = new Map<number, number | null>();
  const prevChaser = new Map<number, boolean>();
  const lostAt = new Map<number, number>();
  const key = (side: number, idx: number): number => side * 100 + idx;
  const t0 = Date.now();
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    tick += 1;
    if (m.phase !== 'playing') continue;
    row.playingTicks += 1;
    const carrier = m.ball.owner;
    if (carrier !== null) row.carrierTicks += 1;
    for (const t of m.teams) {
      const side = t.side;
      const defending = m.possessionSide !== side;
      if (!defending) {
        for (const p of t.players) lostAt.delete(key(side, p.index));
        continue;
      }
      row.defTeamTicks += 1;
      row.chaserCountBins[Math.min(4, t.chasers.size)] += 1;
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      row.defenderTicks += outfield.length;
      const markTargets: Array<{ idx: number; pos: { x: number; y: number } }> = [];
      let ballFamily = 0;
      for (const p of outfield) {
        const k = key(side, p.index);
        const cur = t.marks.has(p.index) ? (t.marks.get(p.index) as number) : null;
        const prev = prevMark.has(k) ? (prevMark.get(k) as number | null) : null;
        if (cur !== null) row.markHeldTicks += 1;
        if (prev !== null && cur !== null && prev !== cur) {
          row.markSwitches += 1;
          const at = lostAt.get(k);
          if (at !== undefined) lostAt.delete(k);
        } else if (prev !== null && cur === null) {
          row.markAbandons += 1;
          lostAt.set(k, tick);
        } else if (prev === null && cur !== null) {
          row.markStarts += 1;
          const at = lostAt.get(k);
          if (at !== undefined) {
            const dTicks = tick - at;
            row.reTargetLatencyBins[latBinOf(dTicks * DT)] += 1;
            row.reTargetLatencyCount += 1;
            row.reTargetLatencyTickSum += dTicks;
            lostAt.delete(k);
          }
        }
        prevMark.set(k, cur);
        const isChaser = t.chasers.has(p.index);
        const wasChaser = prevChaser.get(k) === true;
        if (isChaser && !wasChaser) row.chaseStarts += 1;
        if (!isChaser && wasChaser) row.chaseAbandons += 1;
        prevChaser.set(k, isChaser);
        const fam = familyOf(p, m);
        if (fam === 'MARK' && cur !== null) {
          const target = m.teams[1 - side].players[cur];
          if (target !== undefined) markTargets.push({ idx: p.index, pos: target.pos });
        }
        if (fam === 'BALL') ballFamily += 1;
      }
      if (markTargets.length >= 2) {
        row.markPairTicks += 1;
        let dup = false;
        for (let i = 0; i < markTargets.length && !dup; i++) {
          for (let j = i + 1; j < markTargets.length && !dup; j++) {
            const dx = markTargets[i].pos.x - markTargets[j].pos.x;
            const dy = markTargets[i].pos.y - markTargets[j].pos.y;
            if (Math.hypot(dx, dy) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) row.dupMarkTicks += 1;
      }
      if (ballFamily >= 2) row.multiChase2Ticks += 1;
      if (ballFamily >= 3) row.multiChase3Ticks += 1;
      if (carrier !== null && carrier.side !== side) {
        let inStance = 0;
        let inZone = 0;
        for (const p of outfield) {
          const d = Math.hypot(p.pos.x - carrier.pos.x, p.pos.y - carrier.pos.y);
          if (d < SWARM_R_STANCE) inStance += 1;
          if (d < SWARM_R_ZONE) inZone += 1;
        }
        row.swarmStanceBins[Math.min(SWARM_BINS - 1, inStance)] += 1;
        row.swarmZoneBins[Math.min(SWARM_BINS - 1, inZone)] += 1;
      }
    }
  }
  row.stepWallMs = Date.now() - t0;
  row.goals = m.score[0] + m.score[1];
  for (const t of m.teams) {
    row.tackles += t.stats.tackles;
    row.interceptions += t.stats.interceptions;
  }
  /* ---- the usage ledger, read at the whistle (pure bookkeeping in src) ---- */
  const led = m.dfSurfaceLedger;
  row.elections = led.elections;
  row.idle = led.idle;
  row.pressOffered = led.pressOffered;
  row.pressDeclinedByBook = led.pressDeclinedByBook;
  row.byOption = [...led.byOption];
  row.byModeOption = [...led.byModeOption];
  /** ⭐ THE JOIN LIVES HERE: gid → the body's own defending attribute + his option counts */
  const attrOf = new Map<number, number>();
  for (const t of m.teams) for (const p of t.players) attrOf.set(p.gid, p.attrs.defending);
  for (const [gid, counts] of led.byGid) {
    row.bodyRows.push([attrOf.get(gid) ?? Number.NaN, ...counts]);
  }
  row.bodyRows.sort((a, b) => a[0] - b[0]);
  return row;
};

/* ========================================================================== */
/* §4 THE BATTERY                                                             */
/* ========================================================================== */
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const armed of [false, true]) {
    rows.push(walk(seed, armed));
    process.stdout.write(`  seed ${seed} ${armed ? 'armed' : 'shut '} done\n`);
  }
}

/* ========================================================================== */
/* §5 FACES                                                                   */
/* ========================================================================== */
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);
const round = (v: number): number => (Number.isFinite(v) ? Number(v.toPrecision(12)) : v);
const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;
const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;

interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string }
const FACES: Record<string, FaceDef> = {
  /* ---- the churn family: DF-C0 §R2 / DF-T0's pairs, verbatim ---- */
  markSwitchesPerDefenderMinute: {
    num: (r) => r.markSwitches, den: defenderMinutes,
    unit: 'switches per defender-minute (sim clock; 1 defender-minute = 60 sim-s a body '
      + 'spent out of possession)',
    what: '换人盯 as it happens: a marker\'s assigned man CHANGES',
    denNote: 'denominator = defender body-ticks × DT / 60; MOVING with sent-offs and with '
      + 'possession share — disclosed per face',
  },
  markSwitchesPerDefenderMatch: {
    num: (r) => r.markSwitches, den: defenderMatches,
    unit: `switches per defender-match (the ${MATCH_DURATION} s match clock — the dual axis)`,
    what: 'the same count on the match clock (clock honesty)',
    denNote: 'denominator = defender body-ticks × DT / MATCH_DURATION',
  },
  markAbandonsPerDefenderMinute: {
    num: (r) => r.markAbandons, den: defenderMinutes,
    unit: 'abandonments per defender-minute',
    what: 'a marker LOSES his man with no replacement assignment',
    denNote: 'same defender-minute denominator',
  },
  markStartsPerDefenderMinute: {
    num: (r) => r.markStarts, den: defenderMinutes,
    unit: 'assignments per defender-minute',
    what: 'a body is GIVEN a mark',
    denNote: 'same defender-minute denominator',
  },
  chaseStartsPerDefenderMinute: {
    num: (r) => r.chaseStarts, den: defenderMinutes,
    unit: 'chase starts per defender-minute',
    what: 'a body is licensed to hunt the ball (the CAP\'s output, not the surface\'s)',
    denNote: 'same defender-minute denominator',
  },
  chaseAbandonsPerDefenderMinute: {
    num: (r) => r.chaseAbandons, den: defenderMinutes,
    unit: 'chase abandonments per defender-minute',
    what: 'a licensed presser is DE-licensed mid-flight',
    denNote: 'same defender-minute denominator',
  },
  markHeldShare: {
    num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,
    unit: 'share of defender body-ticks',
    what: 'ASSIGNMENT COVERAGE — how much of his defending life a body actually HAS a mark',
    denNote: 'denominator = defender body-ticks',
  },
  dupMarkShare: {
    num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,
    unit: `share of ≥2-marker team-ticks with two mark targets within ${DUP_RUN_M} m`,
    what: `the dupRun-LINEAGE FACE, defensive side (radius reused verbatim: DUP_RUN_M = ${DUP_RUN_M})`,
    denNote: 'denominator = team-ticks with ≥2 MARK-family defenders — MOVES with how often '
      + 'the scheme assigns two markers at all',
  },
  multiChaseShare2: {
    num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '≥2 bodies in the BALL family at once',
    denNote: 'denominator = out-of-possession team-ticks',
  },
  multiChaseShare3: {
    num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '⭐ THE FIRST RECEIPT ORDERED (#325 item 5): ≥3 bodies in the BALL family — the '
      + 'face #324 left GRAZING ZERO UPWARD, re-measured here at DF-T1\'s own grain',
    denNote: 'denominator = out-of-possession team-ticks',
  },
  swarmStanceShare2: {
    num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),
    unit: `share of carrier-present defending team-ticks with ≥2 bodies inside ${SWARM_R_STANCE} m`,
    what: 'THE SWARM\'S OWN FACE at the shipped stance radius — the band the cap holds today',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
  },
  swarmZoneShare3: {
    num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),
    unit: `share of carrier-present defending team-ticks with ≥3 bodies inside ${SWARM_R_ZONE} m`,
    what: 'the wider pile-up face at the zonal engage radius',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
  },
  reTargetLatencyMeanS: {
    num: (r) => r.reTargetLatencyTickSum * DT, den: (r) => r.reTargetLatencyCount,
    unit: 'sim-seconds',
    what: 'how long a body waits between losing a mark and being given one',
    denNote: 'denominator = completed abandon→assign cycles (a cycle broken by the team '
      + 'regaining possession is DISCARDED, not truncated)',
  },
  /* ---- the mandate's own face ---- */
  interceptionsPerTeamMatch: {
    num: (r) => r.interceptions, den: () => 2,
    unit: 'interceptions per team-match',
    what: '⭐ THE MANDATE\'S FACE (#324: 阅读 — the reading events the ladder watched collapse)',
    denNote: 'denominator = 2 team-matches per walk',
  },
  tacklesPerTeamMatch: {
    num: (r) => r.tackles, den: () => 2,
    unit: 'tackles per team-match',
    what: 'the CONTACT half of the same mix',
    denNote: 'denominator = 2 team-matches per walk',
  },
  interceptionShareOfDefensiveEvents: {
    num: (r) => r.interceptions, den: (r) => r.interceptions + r.tackles,
    unit: 'share of (interceptions + tackles)',
    what: 'THE READING-vs-CONTACT MIX as one number — DF-C0 §R4\'s inversion face',
    denNote: 'denominator = all counted defensive events, both teams',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: () => 1,
    unit: 'goals per match',
    what: 'the world-9 rate at this battery\'s grain — a RECEIPT, never a football claim',
    denNote: 'one match per seed',
  },
  tacklesPlusInterceptionsPerMatch: {
    num: (r) => r.tackles + r.interceptions, den: () => 1,
    unit: 'events per match (both teams)',
    what: 'the shipped defensive event rate at match grain',
    denNote: 'one match per seed',
  },
  /* ---- the usage distribution (armed only; every share is 0/0 = NaN shut) ---- */
  usagePressShare: {
    num: (r) => r.byOption[0], den: (r) => r.elections,
    unit: 'share of defender-decisions',
    what: 'THE PRESS OPTION\'s usage — 不盯自己的人去干持球人',
    denNote: 'denominator = defender-decisions on which SOME option was taken',
  },
  usageHoldShare: {
    num: (r) => r.byOption[1], den: (r) => r.elections,
    unit: 'share of defender-decisions',
    what: 'THE HOLD OPTION\'s usage — DF-T0\'s persistence law as one option among four',
    denNote: 'same defender-decision denominator',
  },
  usageJumpShare: {
    num: (r) => r.byOption[2], den: (r) => r.elections,
    unit: 'share of defender-decisions',
    what: 'THE JUMP OPTION\'s usage — a man he reaches BEFORE the ball can (the READING half)',
    denNote: 'same defender-decision denominator',
  },
  usageTakeShare: {
    num: (r) => r.byOption[3], den: (r) => r.elections,
    unit: 'share of defender-decisions',
    what: 'THE TAKE OPTION\'s usage — a man the ball beats him to (the CONTACT half)',
    denNote: 'same defender-decision denominator',
  },
  usageIdleShare: {
    num: (r) => r.idle, den: (r) => r.elections + r.idle,
    unit: 'share of defender-passes',
    what: 'defender-passes on which NO option was affordable (the shipped spare-body state)',
    denNote: 'denominator = elections + idle passes',
  },
  pressDeclinedByBookShare: {
    num: (r) => r.pressDeclinedByBook, den: (r) => r.pressOffered,
    unit: 'share of press OFFERS',
    what: 'THE DEFENCE BOOK\'S DECLINE-ONLY VETO, as it fires',
    denNote: 'denominator = defender-passes on which the shipped contain geometry offered '
      + 'the press option at all',
  },
  pressOfferedPerDefenderMinute: {
    num: (r) => r.pressOffered, den: defenderMinutes,
    unit: 'offers per defender-minute',
    what: 'how often the shipped contain geometry even puts PRESS on the menu',
    denNote: 'same defender-minute denominator',
  },
};

const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngBoot.next() * seedsWalked.length)));

interface FaceRow {
  arm: 'shut' | 'armed'; face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faceOf = (arm: 'shut' | 'armed', name: string, d: FaceDef): FaceRow => {
  const armRows = rows.filter((r) => r.arm === arm);
  const bySeed = new Map(armRows.map((r) => [r.seed, r]));
  const num = sum(armRows.map(d.num));
  const den = sum(armRows.map(d.den));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0;
    let q = 0;
    for (const i of idx) {
      const r = bySeed.get(seedsWalked[i])!;
      n += d.num(r);
      q += d.den(r);
    }
    const v = ratio(n, q);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const pick = (p: number): number => (draws.length === 0 ? Number.NaN
    : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
  const lo = pick(0.025);
  const hi = pick(0.975);
  return {
    arm, face: name, unit: d.unit, what: d.what, denNote: d.denNote,
    value: round(ratio(num, den)), numerator: round(num), denominator: round(den),
    ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2),
  };
};
const faces: FaceRow[] = [];
for (const arm of ['shut', 'armed'] as const) {
  for (const [k, d] of Object.entries(FACES)) faces.push(faceOf(arm, k, d));
}
const faceValue = (arm: 'shut' | 'armed', name: string): number =>
  faces.find((f) => f.arm === arm && f.face === name)!.value;

/* ---- latency percentiles, from STORED BINS (canon) ---- */
const latBinsPooled = (arm: 'shut' | 'armed'): number[] => Array.from({ length: LAT_BINS },
  (_, b) => sum(rows.filter((r) => r.arm === arm).map((r) => r.reTargetLatencyBins[b])));
const latQuantile = (bins: readonly number[], p: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let b = 0; b < LAT_BINS; b++) {
    acc += bins[b];
    if (acc >= p * total) return (b + 1) * LAT_BIN_S;
  }
  return LAT_BINS * LAT_BIN_S;
};
const latencyBins = { shut: latBinsPooled('shut'), armed: latBinsPooled('armed') };
const latencyPercentiles = {
  shutMedianS: latQuantile(latencyBins.shut, 0.5),
  shutP90S: latQuantile(latencyBins.shut, 0.9),
  armedMedianS: latQuantile(latencyBins.armed, 0.5),
  armedP90S: latQuantile(latencyBins.armed, 0.9),
};

/* ---- the CAP's own output and the swarm bins, pooled per arm ---- */
const poolBins = (arm: 'shut' | 'armed', pick: (r: Row) => number[], n: number): number[] =>
  Array.from({ length: n }, (_, b) => sum(rows.filter((r) => r.arm === arm).map((r) => pick(r)[b])));
const chaserBins = {
  shut: poolBins('shut', (r) => r.chaserCountBins, 5),
  armed: poolBins('armed', (r) => r.chaserCountBins, 5),
};
const swarmBins = {
  shutStance: poolBins('shut', (r) => r.swarmStanceBins, SWARM_BINS),
  armedStance: poolBins('armed', (r) => r.swarmStanceBins, SWARM_BINS),
  shutZone: poolBins('shut', (r) => r.swarmZoneBins, SWARM_BINS),
  armedZone: poolBins('armed', (r) => r.swarmZoneBins, SWARM_BINS),
};

/* ---- ⭐ THE NON-DEGENERACY BLOCK: usage by situation and by body ---- */
const armedRows = rows.filter((r) => r.arm === 'armed');
const optionOrder = [...DF_SURFACE_OPTIONS];
const byOptionPooled = Array.from({ length: N_OPT }, (_, i) =>
  sum(armedRows.map((r) => r.byOption[i])));
const byModeOptionPooled = Array.from({ length: 2 * N_OPT }, (_, i) =>
  sum(armedRows.map((r) => r.byModeOption[i])));
const electionsPooled = sum(armedRows.map((r) => r.elections));
const shareOf = (xs: readonly number[]): number[] => {
  const t = sum(xs);
  return xs.map((x) => round(ratio(x, t)));
};
/** per-BODY: pool each body's option counts across the battery, then describe the spread */
const bodyAgg = new Map<string, number[]>();
for (const r of armedRows) {
  for (const b of r.bodyRows) {
    const k = `${r.seed}:${b[0]}`;
    const prev = bodyAgg.get(k) ?? Array.from({ length: N_OPT }, () => 0);
    for (let i = 0; i < N_OPT; i++) prev[i] += b[1 + i];
    bodyAgg.set(k, prev);
  }
}
const bodyModalCounts = Array.from({ length: N_OPT }, () => 0);
let bodiesCounted = 0;
for (const counts of bodyAgg.values()) {
  if (sum(counts) === 0) continue;
  bodiesCounted += 1;
  let arg = 0;
  for (let i = 1; i < N_OPT; i++) if (counts[i] > counts[arg]) arg = i;
  bodyModalCounts[arg] += 1;
}
/** the reading↔physical axis, REPORTED not scored: usage by the body's own defending attr */
const attrBodies: Array<{ attr: number; counts: number[] }> = [];
for (const r of armedRows) {
  for (const b of r.bodyRows) attrBodies.push({ attr: b[0], counts: b.slice(1) });
}
attrBodies.sort((a, b) => a.attr - b.attr);
const terciles = [0, 1, 2].map((t) => {
  const lo = Math.floor((t * attrBodies.length) / 3);
  const hi = Math.floor(((t + 1) * attrBodies.length) / 3);
  const slice = attrBodies.slice(lo, hi);
  const agg = Array.from({ length: N_OPT }, (_, i) => sum(slice.map((x) => x.counts[i])));
  return {
    tercile: t,
    n: slice.length,
    defendingAttrLo: round(slice.length === 0 ? Number.NaN : slice[0].attr),
    defendingAttrHi: round(slice.length === 0 ? Number.NaN : slice[slice.length - 1].attr),
    counts: agg,
    shares: shareOf(agg),
  };
});
const usage = {
  optionOrder,
  note: 'ONE row per DEFENDER per assignment pass (the TEAM_AI_INTERVAL cadence) — a '
    + 'DECISION distribution, not a tick distribution. Shut-arm counts are structurally zero '
    + '(the ledger is untouched with the door shut), which is gate gLedgerZeroWhenShut.',
  electionsArmed: electionsPooled,
  idleArmed: sum(armedRows.map((r) => r.idle)),
  byOption: byOptionPooled,
  byOptionShare: shareOf(byOptionPooled),
  byModeOption: byModeOptionPooled,
  byModeOptionShareDefend: shareOf(byModeOptionPooled.slice(0, N_OPT)),
  byModeOptionSharePress: shareOf(byModeOptionPooled.slice(N_OPT)),
  bodiesCounted,
  bodyModalCounts,
  bodyModalShare: shareOf(bodyModalCounts),
  byDefendingAttrTercile: terciles,
  pressOfferedArmed: sum(armedRows.map((r) => r.pressOffered)),
  pressDeclinedByBookArmed: sum(armedRows.map((r) => r.pressDeclinedByBook)),
};

/* ---- the perf receipt, against the ANCHOR (DF-C0 §R5) ---- */
const perfAnchorBytes = readFileSync('docs/perf/baseline.json');
const perfAnchor = JSON.parse(perfAnchorBytes.toString('utf8')) as Record<string, unknown>;
const wallUsPerStep = (arm: 'shut' | 'armed'): number => {
  const armRows = rows.filter((r) => r.arm === arm);
  return ratio(sum(armRows.map((r) => r.stepWallMs)) * 1000, sum(armRows.map((r) => r.ticks)));
};
const perf = {
  anchorFile: 'docs/perf/baseline.json',
  anchorSha256: createHash('sha256').update(perfAnchorBytes).digest('hex'),
  anchorHead: (perfAnchor as { head?: string }).head ?? null,
  anchorUsPerStep: (perfAnchor as { usPerStep?: number }).usPerStep ?? null,
  anchorTeamBrainUsPerStep: ((perfAnchor as { phases?: Array<{ phase: string; usPerStep: number }> })
    .phases ?? []).find((p) => p.phase === 'teamBrain')?.usPerStep ?? null,
  budgetUsPerStep: 0.106,
  budgetNote: 'DF-C0 §R5: 2 % of the anchor tick — a BUDGET, not a self-measured share. '
    + 'THIS IS A WALL MEASUREMENT taken inside the instrumented walk loop (the instrument '
    + 'itself is inside the timer), so it is an UPPER BOUND on the seam\'s cost, never the '
    + 'engine\'s own profiler number, and it is published as armed-MINUS-shut with that '
    + 'label attached (the flip-oracle lesson: instrument cost must never masquerade as '
    + 'seam cost).',
  shutWallUsPerStep: round(wallUsPerStep('shut')),
  armedWallUsPerStep: round(wallUsPerStep('armed')),
  deltaWallUsPerStep: round(wallUsPerStep('armed') - wallUsPerStep('shut')),
};

/* ========================================================================== */
/* §6 GATES (frozen; a RED gate stays RED and is reported)                    */
/* ========================================================================== */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2);
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK;
/** ⭐ M-DF.2: the Phase-31 cap is intact ARMED — the four-chaser bin stays exactly zero */
gates.gCapIntactBothArms = chaserBins.armed[4] === 0 && chaserBins.shut[4] === 0;
gates.gCapBinsNonEmpty = sum(chaserBins.armed) > 0 && sum(chaserBins.shut) > 0;
/** ⭐ M-DF.2: `assignChasers` is byte-identical to the frozen slice */
gates.gCapSliceShaIdentical = chaserSliceSha === CHASER_SLICE_SHA_OF_RECORD;
gates.gLatencyBinsStored = rows.every((r) => r.reTargetLatencyBins.length === LAT_BINS)
  && sum(latencyBins.armed) > 0 && sum(latencyBins.shut) > 0;
gates.gSwarmBinsStored = sum(swarmBins.armedZone) > 0 && sum(swarmBins.shutZone) > 0;
/** the ledger is structurally zero with the door shut (dormancy, measured in-battery) */
gates.gLedgerZeroWhenShut = rows.filter((r) => r.arm === 'shut').every((r) =>
  r.elections === 0 && r.idle === 0 && r.pressOffered === 0 && r.pressDeclinedByBook === 0
  && sum(r.byOption) === 0 && r.bodyRows.length === 0);
/** ⭐ NON-DEGENERACY LIVENESS: every one of the four options is actually used at least once */
gates.gEveryOptionUsed = byOptionPooled.every((c) => c > 0);
/** the arms really differ (liveness — a zero delta would mean the door did nothing) */
gates.gArmsDistinguishable = faceValue('armed', 'markHeldShare') !== faceValue('shut', 'markHeldShare');
gates.gFacesFromDisk = false; // filled below, after the body is staged
gates.gFingerprintUnmoved = false; // filled below

/* the production fingerprint, recomputed on THIS tree */
const FINGERPRINT_OF_RECORD = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
let fingerprintNow = 'NOT-RUN';
try {
  const out = execFileSync('npx', ['tsx', 'scripts/fingerprint.ts'], { encoding: 'utf8' });
  fingerprintNow = (/sha256=([0-9a-f]{64})/.exec(out) ?? [, 'NO-MATCH'])[1] as string;
} catch { fingerprintNow = 'FINGERPRINT-FAILED'; }
gates.gFingerprintUnmoved = fingerprintNow === FINGERPRINT_OF_RECORD;

/* ========================================================================== */
/* §7 THE ARTIFACT — allowlist schema, body hashed LAST                       */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');
const body = {
  stage: 'DF-T2-DECISION-SURFACE',
  kind: 'receipt-walks (NOT an exam; canon: receipts ≠ effect sizes)',
  ruling: '#325 item 5',
  contract: 'DF-DEFENSIVE-BRAIN-CONTRACT.md §2 M-DF.1/M-DF.2/M-DF.3/M-DF.4',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/df-t2-decision-surface.ts',
    sha256: instrumentSha,
    instrumentDefinitionsReusedFrom: 'scripts/probes/df-t0-assignment-persistence.ts §3 '
      + '(itself DF-C0 §R2\'s: the Row accumulator, familyOf, DUP_RUN_M, the latency bins, '
      + 'the swarm radii and every churn face\'s (numerator, denominator) pair)',
  },
  world: {
    version: DF_WORLD,
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw + dfAssignPersist (the DF-T1 BANKED '
      + 'defensive world — persistence is on in BOTH arms because it is the HOLD option\'s '
      + 'substrate)',
    armDifference: 'dfSurface only',
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`, booked: SEEDS, walked: seedsWalked,
    walksTotal: rows.length,
    statsNote: 'STATS: NONE CONSUMED — the CIs are bootstrap resamples of the walked seeds, '
      + 'not a registry-consuming statistic (the IN-T0 precedent).',
  },
  anchoredExtractions: anchorReceipts,
  capSource: {
    file: 'src/ai/TeamBrain.ts',
    slice: 'assignChasers',
    sha256: chaserSliceSha,
    shaOfRecord: CHASER_SLICE_SHA_OF_RECORD,
    lines: chaserSlice.split('\n').length,
  },
  faces,
  usage,
  latencyBins,
  latencyPercentiles,
  chaserBins,
  swarmBins,
  perf,
  perSeedCells: rows,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'this is a SEAM slice, not an instrument-only stage: src IS touched, dormantly',
    gitStatusSrc: gitOut(['status', '--porcelain', '--', 'src']),
    gitDiffStatSrcHead: gitOut(['diff', '--stat', 'HEAD', '--', 'src']),
    head: gitOut(['rev-parse', 'HEAD']).trim(),
  },
  gates,
  gatesAllGreen: false,
};

/* ---- ⭐ gFacesFromDisk: STAGE the body, RE-PARSE it, RE-DERIVE every face ---- */
mkdirSync('docs/world-model/data', { recursive: true });
const stagePath = `${OUT.replace(/\.json$/, '')}.stage.json`;
writeFileSync(stagePath, `${JSON.stringify(body, null, 2)}\n`);
const disk = JSON.parse(readFileSync(stagePath, 'utf8')) as typeof body;
let rederiveChecks = 0;
let rederiveFails = 0;
/**
 * ⚠ A 0/0 face (the shut arm's usage shares — the ledger is structurally zero with the door
 * shut) is `NaN` in memory and `null` once it has been through JSON. The comparison therefore
 * normalises BOTH sides to `null` before comparing, so an undefined face re-derives as
 * undefined rather than silently passing or silently failing.
 */
const same = (a: number, b: unknown): boolean => {
  const av = Number.isFinite(a) ? round(a) : null;
  const bv = typeof b === 'number' && Number.isFinite(b) ? round(b) : null;
  return av === bv;
};
for (const f of disk.faces) {
  const def = FACES[f.face];
  const armRows = disk.perSeedCells.filter((r) => r.arm === f.arm) as unknown as Row[];
  const n = sum(armRows.map(def.num));
  const d = sum(armRows.map(def.den));
  rederiveChecks += 3;
  if (!same(n, f.numerator)) rederiveFails += 1;
  if (!same(d, f.denominator)) rederiveFails += 1;
  if (!same(ratio(n, d), f.value)) rederiveFails += 1;
}
for (const arm of ['shut', 'armed'] as const) {
  const armRows = disk.perSeedCells.filter((r) => r.arm === arm) as unknown as Row[];
  const bins = Array.from({ length: LAT_BINS }, (_, b) =>
    sum(armRows.map((r) => r.reTargetLatencyBins[b])));
  rederiveChecks += 1;
  if (JSON.stringify(bins) !== JSON.stringify(disk.latencyBins[arm])) rederiveFails += 1;
  rederiveChecks += 2;
  if (!same(latQuantile(bins, 0.5), disk.latencyPercentiles[`${arm}MedianS`])) rederiveFails += 1;
  if (!same(latQuantile(bins, 0.9), disk.latencyPercentiles[`${arm}P90S`])) rederiveFails += 1;
  const cb = Array.from({ length: 5 }, (_, b) => sum(armRows.map((r) => r.chaserCountBins[b])));
  rederiveChecks += 1;
  if (JSON.stringify(cb) !== JSON.stringify(disk.chaserBins[arm])) rederiveFails += 1;
  for (const [k, pick] of [['Stance', (r: Row) => r.swarmStanceBins],
    ['Zone', (r: Row) => r.swarmZoneBins]] as const) {
    const sb = Array.from({ length: SWARM_BINS }, (_, b) => sum(armRows.map((r) => pick(r)[b])));
    rederiveChecks += 1;
    if (JSON.stringify(sb) !== JSON.stringify(
      disk.swarmBins[`${arm}${k}` as keyof typeof disk.swarmBins],
    )) rederiveFails += 1;
  }
}
{
  const armRows = disk.perSeedCells.filter((r) => r.arm === 'armed') as unknown as Row[];
  const bo = Array.from({ length: N_OPT }, (_, i) => sum(armRows.map((r) => r.byOption[i])));
  rederiveChecks += 3;
  if (JSON.stringify(bo) !== JSON.stringify(disk.usage.byOption)) rederiveFails += 1;
  if (JSON.stringify(shareOf(bo)) !== JSON.stringify(disk.usage.byOptionShare)) rederiveFails += 1;
  if (sum(armRows.map((r) => r.elections)) !== disk.usage.electionsArmed) rederiveFails += 1;
  const bmo = Array.from({ length: 2 * N_OPT }, (_, i) =>
    sum(armRows.map((r) => r.byModeOption[i])));
  rederiveChecks += 1;
  if (JSON.stringify(bmo) !== JSON.stringify(disk.usage.byModeOption)) rederiveFails += 1;
  rederiveChecks += 2;
  if (sum(armRows.map((r) => r.pressOffered)) !== disk.usage.pressOfferedArmed) rederiveFails += 1;
  if (sum(armRows.map((r) => r.pressDeclinedByBook)) !== disk.usage.pressDeclinedByBookArmed) {
    rederiveFails += 1;
  }
  rederiveChecks += 1;
  if (sum(disk.usage.byDefendingAttrTercile.map((t) => sum(t.counts))) !== sum(bo)) {
    rederiveFails += 1;
  }
}
gates.gFacesFromDisk = rederiveFails === 0 && rederiveChecks > 0;
const gatesAllGreen = Object.values(gates).every(Boolean);
const finalBody = {
  ...body,
  gates,
  gatesAllGreen,
  rederiveChecks,
  rederiveFails,
};
const artifact = {
  ...finalBody,
  bodySha256: createHash('sha256').update(JSON.stringify(finalBody)).digest('hex'),
};
const outPath = gatesAllGreen || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
if (IS_OVERRIDE && outPath === CANONICAL_OUT) {
  console.error('REFUSAL: an override run may not write the canonical path');
  process.exit(2);
}
writeFileSync(outPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`\nwrote ${outPath} (re-derivation: ${rederiveChecks} checks, ${rederiveFails} fails)`);
for (const [k, v] of Object.entries(gates)) console.log(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
console.log('\nusage (armed):');
optionOrder.forEach((o, i) => console.log(`  ${o}: ${usage.byOptionShare[i]}`));
console.log('\nreceipts (shut → armed):');
for (const f of ['markSwitchesPerDefenderMinute', 'markHeldShare', 'dupMarkShare',
  'multiChaseShare3', 'swarmZoneShare3', 'interceptionsPerTeamMatch',
  'interceptionShareOfDefensiveEvents']) {
  console.log(`  ${f}: ${faceValue('shut', f)} → ${faceValue('armed', f)}`);
}
console.log(`chaserBins shut  = [${chaserBins.shut.join(', ')}]`);
console.log(`chaserBins armed = [${chaserBins.armed.join(', ')}]`);
process.exit(gatesAllGreen ? 0 : 1);
