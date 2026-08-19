#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-T1 — THE PERSISTENCE EXAM (instrument-only; H-DF.0 scored on virgin seeds)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #323 item 4, bound by
 * `docs/world-model/DF-DEFENSIVE-BRAIN-CONTRACT.md` §1/§2 (H-DF.1's FULL surface
 * differentiation is NAMED OUT to the later surface slice — this exam scores the
 * NARROWED claim #323 item 4 defines, H-DF.0).
 *
 * ⭐ INSTRUMENT-ONLY. `src/**` is UNTOUCHED by this stage (the citation sweep,
 * #323 §CORR 2, is comment/doc-only and landed in its own commit BEFORE this
 * file was frozen). `gSrcUntouched` proves it at run time.
 *
 * ⭐⭐ H-DF.0 — PRE-REGISTERED, FROZEN BEFORE THE BATTERY (three limbs, ALL must
 * hold; the CI rule below is frozen and is NEVER re-cut after sight):
 *   (a) THE THRASH COLLAPSES AT EXAM GRAIN — `markSwitchesPerDefenderMinute`
 *       (DF-C0 §R2's definition VERBATIM) FALLS RESOLVEDLY armed vs base.
 *   (b) THE SWARM DOES NOT RETURN — three conjuncts:
 *       (b1) STRUCTURAL: the four-chaser bin is EXACTLY ZERO armed;
 *       (b2) the ≥3-inside-the-engage-radius share (`swarmZoneShare3`) does NOT
 *            RISE resolvedly;
 *       (b3) GIT: `assignChasers` and the Phase-31 cap lines are BYTE-IDENTICAL
 *            to the DF-T0 result commit.
 *   (c) COVERAGE DOES NOT COLLAPSE — `markHeldShare` does NOT FALL resolvedly
 *       (the persistence must not buy stability by abandoning coverage).
 *
 * ⭐ THE FROZEN CI RULE (pre-registered; paired virgin seeds):
 *   for every face, the estimand is the PAIRED DELTA (armed − base). The
 *   interval is a SEED-CLUSTERED PAIRED bootstrap: resample the walked seeds
 *   with replacement, and for EACH resample compute both arms' ratios over the
 *   SAME resampled seed set, then the delta. 2,000 draws, 95 % percentile
 *   interval. A face MOVES RESOLVEDLY iff its delta CI EXCLUDES ZERO;
 *   the direction is the sign of the interval. Canon: a starred finding states
 *   its |Δ|÷half-width ratio (home BU-T0B §CORR item 2) — every face carries it.
 *
 * REPORTED, NEVER GATED: the other churn faces (dupMark · re-target latency with
 * STORED BINS) · the R-乙 chain faces (Q01/Q05/Q06/Q14/Q07, definitions reused
 * VERBATIM from `docs/world-model/R-YI-STANDING-GAP-TABLE.md` via
 * `scripts/probes/bk-t2-composition-exam.ts`) · goals + the §2 equilibrium faces
 * · ⭐ THE SEASON LADDER judged against the atkFrozen FLOOR (+0.2211, DF-C0 §R4).
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)) — this file is frozen in its
 *     own commit BEFORE the battery; the artifact records its sha256.
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1).
 *   · per-seed cells (home ruling #282.2(ii)).
 *   · gFaces-from-disk (home ruling #287 item 1) + "the re-derivation gate covers
 *     EVERY published face; a percentile face requires stored bins" (home PC-C0
 *     §CORR item 4).
 *   · "a field carries the unit its name claims" (home ruling #294 item 3).
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0 §CORR
 *     item 1).
 *   · moving denominators disclosed per face (home PW-C0 §CORR item 2).
 *   · clock honesty — every rate on the 240 s match clock or dual-axis; APPLIED
 *     never nominal.
 *   · seed discipline: BOOKED = WALKED; blocks consumed whole; stats step ≥ 200.
 *   · DF-C0 §CORR item 2 (ruling #321): the body is hashed LAST, after EVERY gate
 *     is written — including `gFacesFromDisk`, which re-parses a STAGING file.
 *   · RED runs write a side path; the canonical path is only reached all-green.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DFT1_MODE (smoke|full, REQUIRED) · DFT1_N · DFT1_GENS · DFT1_OUT.
 *   ANY other `DFT1_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run (smoke / N / GENS / OUT) may NOT write the canonical path.
 *
 * RUN: DFT1_MODE=full npx tsx scripts/probes/df-t1-persistence-exam.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { randomGenome, GENE_KEYS } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';

const banner = (s: string): void => { process.stdout.write(`${s}\n`); };

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['DFT1_MODE', 'DFT1_N', 'DFT1_GENS', 'DFT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'A4_WORLD', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('DFT1_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
type Mode = 'smoke' | 'full';
const MODE = process.env.DFT1_MODE as Mode | undefined;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: DFT1_MODE must be smoke|full');
  process.exit(2);
}
const N_ENV = process.env.DFT1_N === undefined ? null : Number(process.env.DFT1_N);
const GENS_ENV = process.env.DFT1_GENS === undefined ? null : Number(process.env.DFT1_GENS);
const OUT_OVERRIDE = process.env.DFT1_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/df-t1-persistence-exam.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE !== 'full' || N_ENV !== null || GENS_ENV !== null;
if (IS_OVERRIDE && OUT === CANONICAL_OUT) {
  console.error('REFUSAL: an override run (smoke / N / GENS / OUT) may not write the canonical path');
  process.exit(2);
}

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** DF-T1's OWN booked block (ruling #323 item 4): 12,510,000–999. */
const BLOCK_BASE = 12_510_000;
const RECEIPT_SEED = BLOCK_BASE + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 150 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED reported after):
 *   12,510,000 – 12,510,149  the exam battery (150 paired seeds)
 *   12,510,800 – 12,510,802  the in-band smoke prefix
 *   12,510,900 – 12,510,903  the season ladder's four league seeds (the SAME four
 *                            leagues in BOTH arms — the paired design)
 *   12,510,999               the xxx,999 world-construction receipt seed (walked)
 * THE BLOCK 12,510,000–999 IS CONSUMED WHOLE OF RECORD either way.
 */
const FULL_SEEDS = [
  ...Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i),
  RECEIPT_SEED,
];
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
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): each radius is pulled from ONE
 * named line that must occur EXACTLY ONCE in its file. Never first-occurrence, never a
 * re-typed literal. These are the SAME lines DF-C0 §R2 and DF-T0 §R3 extracted.
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
    id: 'touchControlDist',
    file: 'src/sim/constants.ts',
    line: 'export const TOUCH_CONTROL_DIST = 4.2;',
    re: /TOUCH_CONTROL_DIST = (\d+(?:\.\d+)?);/,
  },
];
interface AnchorReceipt { id: string; file: string; line: string; matches: number; lineNumbers: number[]; value: number }
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
/** R-乙 Q14's pressure radius is the substrate's OWN pressure switch — extracted, then
 *  cross-checked against the imported symbol (the two must agree or the class bits). */
const PRESSURE_R = anchorOf('touchControlDist');
const ANCHORS_OK = SWARM_R_STANCE === 2.6 && SWARM_R_ZONE === 9 && MARK_RANGE === 22
  && PRESSURE_R === TOUCH_CONTROL_DIST;
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}

/* ---- (b3) THE GIT CONJUNCT: the cap's own lines, byte-identical ---- */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
/** DF-T0's RESULT commit — the banked HEAD the cap must not have moved from. */
const DF_T0_RESULT_COMMIT = '4631fe6';
const sliceAssignChasers = (src: string): string => {
  const lines = src.split('\n');
  const start = lines.findIndex((l) => l.startsWith('function assignChasers('));
  if (start < 0) return 'NOT-FOUND';
  let end = -1;
  for (let i = start; i < lines.length; i++) if (lines[i] === '}') { end = i; break; }
  if (end < 0) return 'NOT-FOUND';
  return lines.slice(start, end + 1).join('\n');
};
/** the Phase-31 cap's own rule text, quoted so the pin is about the RULE not the file */
const CAP_RULE_LINE = "    if (team.mode === 'Press' || team.genome.pressIntensity > 0.78) count += 1;";
const capNow = sliceAssignChasers(readSrc('src/ai/TeamBrain.ts'));
const capThen = sliceAssignChasers(gitOut(['show', `${DF_T0_RESULT_COMMIT}:src/ai/TeamBrain.ts`]));
const capIdentical = capNow !== 'NOT-FOUND' && capNow === capThen;
const capRuleOccurrences = readSrc('src/ai/TeamBrain.ts').split('\n')
  .filter((l) => l === CAP_RULE_LINE).length;
const capReceipt = {
  what: 'assignChasers + the Phase-31 cap, byte-identical to the DF-T0 result commit',
  comparedAgainst: DF_T0_RESULT_COMMIT,
  lines: capNow === 'NOT-FOUND' ? 0 : capNow.split('\n').length,
  sha256Now: createHash('sha256').update(capNow).digest('hex'),
  sha256AtDfT0: createHash('sha256').update(capThen).digest('hex'),
  identical: capIdentical,
  capRuleLine: CAP_RULE_LINE,
  capRuleOccurrences,
};

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** the DF-C0 §R2 / DF-T0 world, verbatim, plus THIS slice's door as the only arm difference */
const buildMatch = (seed: number, armed: boolean): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(DF_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    ...(armed ? { dfAssignPersist: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, DF_WORLD, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §3 THE 乱跑 INSTRUMENT — DF-C0 §R2's definitions, REUSED VERBATIM           */
/*     (+ the R-乙 SPELL WALKER, reused verbatim from BK-T2)                   */
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
/** the re-target latency bins: 8 bins of 0.5 SIM-SECONDS, last bin = 3.5 s and over */
const LAT_BINS = 8;
const LAT_BIN_S = 0.5;
const latBinOf = (s: number): number => Math.min(LAT_BINS - 1, Math.floor(s / LAT_BIN_S));
/** the swarm histograms: number of defending outfield bodies inside a radius, 0..5+ */
const SWARM_BINS = 6;

/** BK-T2's helper, verbatim */
const nearestOpponent = (m: Match, p: Player): number => {
  let best = Infinity;
  for (const o of m.teams[(1 - p.side) as 0 | 1].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
    if (d < best) best = d;
  }
  return best;
};
interface Spell { team: 0 | 1; startTick: number; endTick: number; touches: number; origin: 'openPlay' | 'kickoff' | 'restart' }

interface Row {
  arm: 'base' | 'armed';
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
  /* the R-乙 chain accumulators (definitions VERBATIM from R-YI via BK-T2) */
  openSpells: number;
  openSpellTickSum: number;
  openSpellTouchSum: number;
  openFirstReceptions: number;
  openFirstReceptionsPressed: number;
  enginePasses: number;
  enginePassesCompleted: number;
  enginePassesForward: number;
  /* the §2 equilibrium faces (REPORTED only) */
  goals: number;
  shots: number;
  crosses: number;
  headersWon: number;
  longBalls: number;
  cutbacks: number;
  tackles: number;
  interceptions: number;
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
    /** THE ONLY ARM DIFFERENCE */
    dfDoorMatchesArm: m.dfAssignPersist === armed,
  };
};

const walk = (seed: number, armed: boolean): Row => {
  const m = buildMatch(seed, armed);
  const wOk = Object.values(worldConjuncts(m, armed)).every(Boolean);
  const row: Row = {
    arm: armed ? 'armed' : 'base',
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
    openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
    openFirstReceptions: 0, openFirstReceptionsPressed: 0,
    enginePasses: 0, enginePassesCompleted: 0, enginePassesForward: 0,
    goals: 0, shots: 0, crosses: 0, headersWon: 0, longBalls: 0, cutbacks: 0,
    tackles: 0, interceptions: 0, stepWallMs: 0,
  };
  const prevMark = new Map<number, number | null>();
  const prevChaser = new Map<number, boolean>();
  const lostAt = new Map<number, number>();
  const key = (side: number, idx: number): number => side * 100 + idx;
  /* the R-乙 spell walker's state (BK-T2 §(d), verbatim shape) */
  const spells: Spell[] = [];
  let cur: Spell | null = null;
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  const finish = (s: Spell, at: number): void => { s.endTick = at; spells.push(s); };
  const t0 = Date.now();
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    tick += 1;

    /* ====== (d) THE R-乙 SPELL WALKER (Q01/Q05/Q14 VERBATIM, BK-T2's code) ====== */
    {
      const playing = m.phase === 'playing';
      const ownerGid = m.ball.owner?.gid ?? null;
      if (!playing) {
        if (cur !== null) { finish(cur, tick); cur = null; }
        prevOwnerGid = ownerGid;
      } else {
        if (ownerGid !== null) {
          const owner = m.allPlayers[ownerGid];
          const side = owner.side as 0 | 1;
          if (cur !== null && cur.team !== side) { finish(cur, tick); cur = null; }
          if (cur === null) {
            const origin: Spell['origin'] = m.kickoffKickGid === ownerGid ? 'kickoff'
              : m.restartKickGid === ownerGid ? 'restart' : 'openPlay';
            cur = { team: side, startTick: tick, endTick: tick, touches: 0, origin };
          }
          if (ownerGid !== prevOwnerGid) {
            cur.touches += 1;
            // ⭐ Q14 VERBATIM: the FIRST reception of each openPlay-origin spell, pressed iff
            // the nearest-opponent distance at the reception tick is ≤ TOUCH_CONTROL_DIST.
            if (cur.origin === 'openPlay' && cur.touches === 1) {
              row.openFirstReceptions += 1;
              if (nearestOpponent(m, owner) <= PRESSURE_R) row.openFirstReceptionsPressed += 1;
            }
          }
        }
        prevOwnerGid = ownerGid;
      }
    }

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
        const cur2 = t.marks.has(p.index) ? (t.marks.get(p.index) as number) : null;
        const prev = prevMark.has(k) ? (prevMark.get(k) as number | null) : null;
        if (cur2 !== null) row.markHeldTicks += 1;
        if (prev !== null && cur2 !== null && prev !== cur2) {
          row.markSwitches += 1;
          const at = lostAt.get(k);
          if (at !== undefined) lostAt.delete(k);
        } else if (prev !== null && cur2 === null) {
          row.markAbandons += 1;
          lostAt.set(k, tick);
        } else if (prev === null && cur2 !== null) {
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
        prevMark.set(k, cur2);
        const isChaser = t.chasers.has(p.index);
        const wasChaser = prevChaser.get(k) === true;
        if (isChaser && !wasChaser) row.chaseStarts += 1;
        if (!isChaser && wasChaser) row.chaseAbandons += 1;
        prevChaser.set(k, isChaser);
        const fam = familyOf(p, m);
        if (fam === 'MARK' && cur2 !== null) {
          const target = m.teams[1 - side].players[cur2];
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
  if (cur !== null) finish(cur, m.simTick);
  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = open.reduce((a, s) => a + (s.endTick - s.startTick), 0);
  row.openSpellTouchSum = open.reduce((a, s) => a + s.touches, 0);
  row.stepWallMs = Date.now() - t0;
  row.goals = m.score[0] + m.score[1];
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  row.enginePassesForward = m.teams[0].stats.passesForward + m.teams[1].stats.passesForward;
  for (const t of m.teams) {
    row.tackles += t.stats.tackles;
    row.interceptions += t.stats.interceptions;
    row.shots += t.stats.shots;
    row.crosses += t.stats.crosses;
    row.headersWon += t.stats.headersWon;
    row.longBalls += t.stats.longBalls;
    row.cutbacks += t.stats.cutbacks;
  }
  return row;
};

/* ========================================================================== */
/* §4 THE SEASON LADDER — 2 arms, the DF-C0 freeze mechanism reused verbatim   */
/* ========================================================================== */
/**
 * ⭐ THE ARMS (#323 item 4, reduced size): `liveBase` = the live world, nothing frozen;
 * `liveArmed` = the same live world with `dfAssignPersist` armed through the League's OWN
 * `matchFlags` probe surface (the shipped `createMatch` spread — no hand write anywhere,
 * dose-placement canon honoured). NO GENE IS FROZEN IN EITHER ARM, so DF-C0's freeze
 * machinery is reused VERBATIM with an EMPTY frozen key set — which is exactly its `both`
 * arm. The atkFrozen FLOOR is NOT re-run: it is DF-C0 §R4's published +0.2211, quoted as
 * a reference line, and the exam reports where the armed slope sits against it.
 */
type LadderArm = 'liveBase' | 'liveArmed';
const LADDER_ARMS: readonly LadderArm[] = ['liveBase', 'liveArmed'];
const LADDER_ARM_NOTE: Record<LadderArm, string> = {
  liveBase: 'THE LIVE WORLD — nothing frozen, the door SHUT (the shipped evolution runs '
    + 'untouched). This is DF-C0 §R4\'s `both` arm re-run on DF-T1\'s own league seeds.',
  liveArmed: 'THE LIVE WORLD + dfAssignPersist, armed through League.matchFlags (the shipped '
    + 'createMatch spread). Nothing else differs.',
};
/** DF-C0 §R4's published atkFrozen goals slope — the FLOOR this exam judges against. */
const ATK_FROZEN_FLOOR = 0.2211;
const ATK_FROZEN_FLOOR_SOURCE = 'DF-C0-DEFENSIVE-BRAIN.md §R4 (ruling #320 item 3 / #321 '
  + 'item 3): the atkFrozen arm\'s goals/match early(1–5)→late(16–20) delta +0.2211 '
  + '(half-width 0.1423, |Δ|÷hw 1.55). QUOTED, not re-run.';

interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; shotsOnTarget: number; xg: number;
  tackles: number; interceptions: number; clearances: number; blocks: number;
  passes: number; passesCompleted: number;
  /** the DOOR receipt, read back off a real match object of this generation */
  doorChecked: number; doorWrong: number;
  wallSeconds: number;
}
const round = (v: number, digits = 12): number =>
  (Number.isFinite(v) ? Number(v.toPrecision(digits)) : v);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);

/** the gen-1 genome fingerprint, per league seed — the arms must START identical */
const gen1Fingerprint = (leagueSeed: number): string => {
  const l = new League({ seed: leagueSeed });
  const rows = l.franchises.map((f) => {
    const g = f.coach.genome as unknown as Record<string, number>;
    const st = f.coach.style as unknown as Record<string, string>;
    return `${f.slot}|${(GENE_KEYS as readonly string[]).map((k) => g[k]).join(',')}`
      + `|${['formationDef', 'formationAtk', 'scheme'].map((k) => st[k]).join(',')}`;
  });
  return createHash('sha256').update(rows.join('\n')).digest('hex');
};

const runLadderArm = (arm: LadderArm, leagueSeed: number, gens: number): LadderCell[] => {
  const league = new League({ seed: leagueSeed });
  /** THE ONLY ARM DIFFERENCE — the League's own probe surface, spread by shipped createMatch */
  if (arm === 'liveArmed') league.matchFlags = { dfAssignPersist: true };
  const cells: LadderCell[] = [];
  for (let gen = 1; gen <= gens; gen++) {
    const tGen = Date.now();
    let matches = 0;
    const acc = {
      goals: 0, shots: 0, shotsOnTarget: 0, xg: 0, tackles: 0, interceptions: 0,
      clearances: 0, blocks: 0, passes: 0, passesCompleted: 0,
    };
    let doorChecked = 0;
    let doorWrong = 0;
    while (!league.seasonDone) {
      const fx = league.nextFixture();
      if (fx === null) break;
      const match = league.createMatch(fx);
      doorChecked += 1;
      if (match.dfAssignPersist !== (arm === 'liveArmed')) doorWrong += 1;
      const res = match.runToCompletion();
      matches += 1;
      for (const s of res.stats) {
        acc.goals += s.goals;
        acc.shots += s.shots;
        acc.shotsOnTarget += s.shotsOnTarget;
        acc.xg += s.xg;
        acc.tackles += s.tackles;
        acc.interceptions += s.interceptions;
        acc.clearances += s.clearances;
        acc.blocks += s.blocks;
        acc.passes += s.passes;
        acc.passesCompleted += s.passesCompleted;
      }
      league.applyResult(fx, res);
    }
    cells.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, shotsOnTarget: acc.shotsOnTarget,
      xg: round(acc.xg, 4), tackles: acc.tackles, interceptions: acc.interceptions,
      clearances: acc.clearances, blocks: acc.blocks, passes: acc.passes,
      passesCompleted: acc.passesCompleted,
      doorChecked, doorWrong,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    league.finishSeason();
  }
  return cells;
};

/* ========================================================================== */
/* §5 STATS BASES — the completed registry, floor 114,800, step ≥ 200          */
/* ========================================================================== */
const R9_INHERITED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
  113_800, 102_200, 102_800, 103_200, 103_600, 103_800, 104_200, 104_600, 104_800, 105_200,
  105_800, 109_400, 109_600, 109_800, 110_000, 114_000,
];
/** consumed since the IN-C0 sweep: 114,200 (#317 item 4) · 114,400 + 114,600 (DF-C0, #320 item 4) */
const REGISTRY_ADDITIONS: readonly number[] = [114_200, 114_400, 114_600];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 59
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 114_800;
const STATS_STEP = 200;
/** TWO draws, TWO bases, both booked: the paired match battery and the ladder's own */
const STATS_BASES_CONSUMED = [STATS_BASE, STATS_BASE + STATS_STEP] as const;
const minStatsGap = Math.min(...STATS_BASES_CONSUMED
  .flatMap((mine) => STATS_PUBLISHED_BASES.map((b) => Math.abs(mine - b))));

/* ========================================================================== */
/* §6 THE CONSTRUCTION CLASS — refuse BEFORE any battery (nothing written)     */
/* ========================================================================== */
const receiptMatch = buildMatch(RECEIPT_SEED, false);
const RECEIPT = worldConjuncts(receiptMatch, false);
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
if (!RECEIPT_OK) {
  console.error('CONSTRUCTION CLASS: the xxx,999 world receipt failed', RECEIPT);
  process.exit(3);
}
if (!REGISTRY_COMPLETE) {
  console.error('CONSTRUCTION CLASS: the stats registry did not reconcile');
  process.exit(3);
}

/* ========================================================================== */
/* §7 THE BATTERY                                                              */
/* ========================================================================== */
const LADDER_GENS = GENS_ENV ?? (MODE === 'full' ? 20 : 2);
const LADDER_SEEDS_ALL = [BLOCK_BASE + 900, BLOCK_BASE + 901, BLOCK_BASE + 902, BLOCK_BASE + 903];
const LADDER_SEEDS = MODE === 'smoke' ? LADDER_SEEDS_ALL.slice(0, 1) : LADDER_SEEDS_ALL;

banner(`DF-T1: mode=${MODE} battery=${SEEDS.length} seeds × 2 arms  ladder=${LADDER_SEEDS.length}`
  + ` leagues × ${LADDER_GENS} generations × ${LADDER_ARMS.length} arms`);
const tBattery0 = Date.now();
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const armed of [false, true]) rows.push(walk(seed, armed));
  if ((seed - BLOCK_BASE) % 25 === 0 || seed === RECEIPT_SEED) {
    banner(`  … battery seed ${seed} paired (${((Date.now() - tBattery0) / 1000).toFixed(0)} s)`);
  }
}
const batteryWallSec = round((Date.now() - tBattery0) / 1000, 3);

const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
const gen1Fingerprints = LADDER_SEEDS.map((ls) => ({ leagueSeed: ls, sha256: gen1Fingerprint(ls) }));
for (const arm of LADDER_ARMS) {
  for (const ls of LADDER_SEEDS) {
    ladderCells.push(...runLadderArm(arm, ls, LADDER_GENS));
    banner(`  … ladder ${arm} seed ${ls} done (${((Date.now() - tLadder0) / 1000).toFixed(0)} s)`);
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
const ladderLeagueSeasons = LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS;
const ladderMatches = sum(ladderCells.map((c) => c.matches));

/* ========================================================================== */
/* §8 FACES — DF-C0 §R2's (numerator, denominator) pairs, verbatim, + R-乙     */
/* ========================================================================== */
const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;
const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;
const perMatch = (): number => 1;

interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string; family: string }
const FACES: Record<string, FaceDef> = {
  /* ---------- the SCORED churn face (H-DF.0 limb (a)) ---------- */
  markSwitchesPerDefenderMinute: {
    num: (r) => r.markSwitches, den: defenderMinutes,
    unit: 'switches per defender-minute (sim clock; 1 defender-minute = 60 sim-s a body '
      + 'spent out of possession)',
    what: '⭐ H-DF.0(a) SCORED — 乱跑 itself: a marker\'s assigned man CHANGES '
      + '(DF-C0 §R2\'s definition VERBATIM)',
    denNote: 'denominator = defender body-ticks × DT / 60; MOVING with sent-offs and with '
      + 'possession share — disclosed per face',
    family: 'churn (SCORED)',
  },
  markSwitchesPerDefenderMatch: {
    num: (r) => r.markSwitches, den: defenderMatches,
    unit: `switches per defender-match (the ${MATCH_DURATION} s match clock — the dual axis)`,
    what: 'the same count on the match clock (clock honesty)',
    denNote: 'denominator = defender body-ticks × DT / MATCH_DURATION',
    family: 'churn (REPORTED)',
  },
  markAbandonsPerDefenderMinute: {
    num: (r) => r.markAbandons, den: defenderMinutes,
    unit: 'abandonments per defender-minute',
    what: 'a marker LOSES his man with no replacement assignment',
    denNote: 'same defender-minute denominator',
    family: 'churn (REPORTED)',
  },
  markStartsPerDefenderMinute: {
    num: (r) => r.markStarts, den: defenderMinutes,
    unit: 'assignments per defender-minute',
    what: 'a body is GIVEN a mark (the churn cycle\'s other half)',
    denNote: 'same defender-minute denominator',
    family: 'churn (REPORTED)',
  },
  chaseStartsPerDefenderMinute: {
    num: (r) => r.chaseStarts, den: defenderMinutes,
    unit: 'chase starts per defender-minute',
    what: 'a body is licensed to hunt the ball',
    denNote: 'same defender-minute denominator',
    family: 'churn (REPORTED)',
  },
  chaseAbandonsPerDefenderMinute: {
    num: (r) => r.chaseAbandons, den: defenderMinutes,
    unit: 'chase abandonments per defender-minute',
    what: 'a licensed presser is DE-licensed mid-flight (the 疯狂抽动 shape)',
    denNote: 'same defender-minute denominator',
    family: 'churn (REPORTED)',
  },
  /* ---------- the SCORED coverage face (H-DF.0 limb (c)) ---------- */
  markHeldShare: {
    num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,
    unit: 'share of defender body-ticks',
    what: '⭐ H-DF.0(c) SCORED — how much of his defending life a body actually HAS a mark '
      + '(coverage must not collapse)',
    denNote: 'denominator = defender body-ticks (the assignment-holding population)',
    family: 'coverage (SCORED)',
  },
  dupMarkShare: {
    num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,
    unit: `share of ≥2-marker team-ticks with two mark targets within ${DUP_RUN_M} m`,
    what: `THE dupRun-LINEAGE FACE, defensive side (radius reused verbatim: DUP_RUN_M = ${DUP_RUN_M})`,
    denNote: 'denominator = team-ticks with ≥2 MARK-family defenders — MOVES with how often '
      + 'the scheme assigns two markers at all',
    family: 'churn (REPORTED)',
  },
  multiChaseShare2: {
    num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '≥2 bodies in the BALL family at once (the cap\'s own output)',
    denNote: 'denominator = out-of-possession team-ticks',
    family: 'swarm (REPORTED)',
  },
  multiChaseShare3: {
    num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '≥3 bodies in the BALL family — the "NEVER three" the cap bans, as it actually '
      + 'occurs (the transition window licenses it)',
    denNote: 'denominator = out-of-possession team-ticks',
    family: 'swarm (REPORTED)',
  },
  swarmStanceShare2: {
    num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),
    unit: `share of carrier-present defending team-ticks with ≥2 bodies inside ${SWARM_R_STANCE} m`,
    what: 'THE SWARM\'S OWN FACE at the shipped stance radius — the band the cap holds today',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (REPORTED)',
  },
  /* ---------- the SCORED swarm face (H-DF.0 limb (b2)) ---------- */
  swarmZoneShare3: {
    num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),
    unit: `share of carrier-present defending team-ticks with ≥3 bodies inside ${SWARM_R_ZONE} m`,
    what: '⭐ H-DF.0(b2) SCORED — the pile-up face at the zonal engage radius: DF-C0 §R2\'s '
      + '32.5 % band, the swarm the cap holds today. It must NOT RISE resolvedly.',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
    family: 'swarm (SCORED)',
  },
  reTargetLatencyMeanS: {
    num: (r) => r.reTargetLatencyTickSum * DT, den: (r) => r.reTargetLatencyCount,
    unit: 'sim-seconds',
    what: 'how long a body waits between losing a mark and being given one',
    denNote: 'denominator = completed abandon→assign cycles (a cycle broken by the team '
      + 'regaining possession is DISCARDED, not truncated)',
    family: 'churn (REPORTED)',
  },
  /* ---------- the R-乙 chain faces (REPORTED; definitions reused VERBATIM) ---------- */
  ryiQ01SpellSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds per open-play spell',
    what: 'R-乙 Q01 — "how long a team keeps the ball (open-play possession spell, mean)"',
    denNote: 'denominator = openPlay-origin spells — MOVES with how the world segments possession',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ05TouchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches per open-play spell',
    what: 'R-乙 Q05 — "how many touches a possession is made of"',
    denNote: 'same openPlay-spell denominator',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ06PassCompletion: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share of passes completed',
    what: 'R-乙 Q06 — "how many passes find a team-mate" (the engine\'s OWN passive counters)',
    denNote: 'denominator = Σ team.stats.passes, both teams — MOVES with how many passes are attempted',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ14PressedReceptionShare: {
    num: (r) => r.openFirstReceptionsPressed, den: (r) => r.openFirstReceptions,
    unit: 'share of open-play first receptions',
    what: 'R-乙 Q14 — "how much of the game is played under pressure", the nearest opponent '
      + `≤ TOUCH_CONTROL_DIST = ${PRESSURE_R} m at the reception tick`,
    denNote: 'denominator = openPlay-origin first receptions — MOVES with spell count',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ07ForwardPassShare: {
    num: (r) => r.enginePassesForward, den: (r) => r.enginePasses,
    unit: 'share of passes forward',
    what: '⭐ THE DIRECTION MIX — R-乙 Q07 VERBATIM (the engine\'s own `passesForward`)',
    denNote: 'same engine pass denominator',
    family: 'R-乙 chain (REPORTED)',
  },
  /* ---------- goals + the §2 equilibrium faces (REPORT ONLY) ---------- */
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals per match',
    what: '§2 equilibrium (REPORTED — nothing ships from an exam)',
    denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  shotsPerMatch: {
    num: (r) => r.shots, den: perMatch, unit: 'shots per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  crossesPerMatch: {
    num: (r) => r.crosses, den: perMatch, unit: 'crosses per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  headersPerMatch: {
    num: (r) => r.headersWon, den: perMatch, unit: 'headers won per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  longBallsPerMatch: {
    num: (r) => r.longBalls, den: perMatch, unit: 'long balls per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  cutbacksPerMatch: {
    num: (r) => r.cutbacks, den: perMatch, unit: 'cutbacks per match',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  tacklesPerMatch: {
    num: (r) => r.tackles, den: perMatch, unit: 'tackles per match (both teams)',
    what: 'the CONTACT half of the reading↔contact mix (REPORTED)',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED)',
  },
  interceptionsPerMatch: {
    num: (r) => r.interceptions, den: perMatch, unit: 'interceptions per match (both teams)',
    what: 'the READING half of the reading↔contact mix (REPORTED)',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED)',
  },
  tacklesPlusInterceptionsPerMatch: {
    num: (r) => r.tackles + r.interceptions, den: perMatch,
    unit: 'events per match (both teams)',
    what: 'the shipped defensive event rate at match grain',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED)',
  },
};

/* ---------- THE FROZEN PAIRED CLUSTER BOOTSTRAP ---------- */
const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(STATS_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngBoot.next() * seedsWalked.length)));
const baseBySeed = new Map(rows.filter((r) => r.arm === 'base').map((r) => [r.seed, r]));
const armedBySeed = new Map(rows.filter((r) => r.arm === 'armed').map((r) => [r.seed, r]));

interface FaceRow {
  face: string; family: string; unit: string; what: string; denNote: string;
  baseValue: number; baseNumerator: number; baseDenominator: number;
  armedValue: number; armedNumerator: number; armedDenominator: number;
  delta: number; ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  resolved: boolean; direction: 'down' | 'up' | 'unresolved';
}
const faceOf = (name: string, d: FaceDef): FaceRow => {
  const baseRows = rows.filter((r) => r.arm === 'base');
  const armedRows = rows.filter((r) => r.arm === 'armed');
  const bn = sum(baseRows.map(d.num));
  const bd = sum(baseRows.map(d.den));
  const an = sum(armedRows.map(d.num));
  const ad = sum(armedRows.map(d.den));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let bnn = 0; let bdd = 0; let ann = 0; let add = 0;
    for (const i of idx) {
      const s = seedsWalked[i];
      const rb = baseBySeed.get(s)!;
      const ra = armedBySeed.get(s)!;
      bnn += d.num(rb); bdd += d.den(rb);
      ann += d.num(ra); add += d.den(ra);
    }
    const v = ratio(ann, add) - ratio(bnn, bdd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const pick = (p: number): number => (draws.length === 0 ? Number.NaN
    : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
  const lo = pick(0.025);
  const hi = pick(0.975);
  const hw = (hi - lo) / 2;
  const delta = ratio(an, ad) - ratio(bn, bd);
  const resolved = Number.isFinite(lo) && Number.isFinite(hi) && (lo > 0 || hi < 0);
  return {
    face: name, family: d.family, unit: d.unit, what: d.what, denNote: d.denNote,
    baseValue: round(ratio(bn, bd)), baseNumerator: round(bn), baseDenominator: round(bd),
    armedValue: round(ratio(an, ad)), armedNumerator: round(an), armedDenominator: round(ad),
    delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
    ratioToHalfWidth: round(Math.abs(delta) / hw, 6),
    resolved, direction: resolved ? (hi < 0 ? 'down' : 'up') : 'unresolved',
  };
};
const faces: FaceRow[] = Object.entries(FACES).map(([k, d]) => faceOf(k, d));
const faceRow = (name: string): FaceRow => faces.find((f) => f.face === name)!;

/* ---- the re-target latency PERCENTILE faces, from STORED BINS (canon) ---- */
const latBinsPooled = (arm: 'base' | 'armed'): number[] => Array.from({ length: LAT_BINS },
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
const latencyBins = { base: latBinsPooled('base'), armed: latBinsPooled('armed') };
const latencyPercentiles = {
  baseMedianS: latQuantile(latencyBins.base, 0.5),
  baseP90S: latQuantile(latencyBins.base, 0.9),
  armedMedianS: latQuantile(latencyBins.armed, 0.5),
  armedP90S: latQuantile(latencyBins.armed, 0.9),
};

/* ---- the CAP's own output, pooled per arm ---- */
const poolBins = (arm: 'base' | 'armed', pickBins: (r: Row) => number[], n: number): number[] =>
  Array.from({ length: n }, (_, b) => sum(rows.filter((r) => r.arm === arm).map((r) => pickBins(r)[b])));
const chaserBins = {
  base: poolBins('base', (r) => r.chaserCountBins, 5),
  armed: poolBins('armed', (r) => r.chaserCountBins, 5),
};
const swarmBins = {
  baseStance: poolBins('base', (r) => r.swarmStanceBins, SWARM_BINS),
  armedStance: poolBins('armed', (r) => r.swarmStanceBins, SWARM_BINS),
  baseZone: poolBins('base', (r) => r.swarmZoneBins, SWARM_BINS),
  armedZone: poolBins('armed', (r) => r.swarmZoneBins, SWARM_BINS),
};

/* ========================================================================== */
/* §9 THE LADDER FACES + SLOPES — DF-C0's ONE FORMULA, reused verbatim         */
/* ========================================================================== */
interface LadderFaceRow {
  arm: LadderArm; generation: number; leagues: number; matches: number;
  goalsPerMatch: number; shotsPerTeamMatch: number; shotsOnTargetPerTeamMatch: number;
  tacklesPerTeamMatch: number; interceptionsPerTeamMatch: number;
  clearancesPerTeamMatch: number; blocksPerTeamMatch: number; passCompletion: number;
  perLeagueGoalsPerMatch: number[];
}
const ladderFaces: LadderFaceRow[] = [];
for (const arm of LADDER_ARMS) {
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const cs = ladderCells.filter((c) => c.arm === arm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    ladderFaces.push({
      arm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), mt * 2)),
      shotsOnTargetPerTeamMatch: round(ratio(sum(cs.map((c) => c.shotsOnTarget)), mt * 2)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), mt * 2)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt * 2)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), mt * 2)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), mt * 2)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
      perLeagueGoalsPerMatch: cs.map((c) => round(ratio(c.goals, c.matches))),
    });
  }
}
const EARLY_GENS = Math.min(5, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - EARLY_GENS + 1);
const LADDER_SLOPE_FACES = ['goals', 'tackles', 'interceptions', 'shots', 'clearances'] as const;
const numOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>
  (f === 'goals' ? c.goals : f === 'tackles' ? c.tackles : f === 'interceptions'
    ? c.interceptions : f === 'shots' ? c.shots : c.clearances);
const denOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>
  (f === 'goals' ? c.matches : c.matches * 2);
/** ⭐ DF-C0-FIX §RF1's ONE FORMULA — publish side and re-derivation call THIS function. */
const slopeDeltaThroughOneFormula = (perLeague: ReadonlyArray<{ early: number; late: number; delta: number }>): number =>
  mean(perLeague.map((p) => p.delta));
interface LadderSlope {
  arm: LadderArm; face: string;
  early: number; late: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  earlyGens: string; lateGens: string; leagues: number;
}
const rngLadder = new Rng(STATS_BASE + STATS_STEP);
const ladderSlopes: LadderSlope[] = [];
const perLeagueOf = (arm: LadderArm, f: (typeof LADDER_SLOPE_FACES)[number]) =>
  LADDER_SEEDS.map((ls) => {
    const cs = ladderCells.filter((c) => c.arm === arm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
    const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
    return { early: e, late: l, delta: l - e };
  });
for (const arm of LADDER_ARMS) {
  for (const f of LADDER_SLOPE_FACES) {
    const perLeague = perLeagueOf(arm, f);
    const draws: number[] = [];
    for (let b = 0; b < BOOTSTRAP; b++) {
      const ds: number[] = [];
      for (let i = 0; i < perLeague.length; i++) {
        ds.push(perLeague[Math.floor(rngLadder.next() * perLeague.length)].delta);
      }
      const v = mean(ds);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    const pick = (p: number): number => (draws.length === 0 ? Number.NaN
      : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
    const lo = pick(0.025);
    const hi = pick(0.975);
    const hw = (hi - lo) / 2;
    const delta = slopeDeltaThroughOneFormula(perLeague);
    ladderSlopes.push({
      arm, face: f,
      early: round(mean(perLeague.map((p) => p.early))),
      late: round(mean(perLeague.map((p) => p.late))),
      delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
      ratioToHalfWidth: round(Math.abs(delta) / hw, 6),
      earlyGens: `1..${EARLY_GENS}`, lateGens: `${LATE_FROM}..${LADDER_GENS}`,
      leagues: LADDER_SEEDS.length,
    });
  }
}
const slopeOf = (arm: LadderArm, face: string): LadderSlope =>
  ladderSlopes.find((s) => s.arm === arm && s.face === face)!;

/** ⭐ THE FLOOR READ — REPORTED, never gated. Does the armed slope bend toward +0.2211? */
const baseGoalSlope = slopeOf('liveBase', 'goals');
const armedGoalSlope = slopeOf('liveArmed', 'goals');
const ladderFloorRead = {
  atkFrozenFloor: ATK_FROZEN_FLOOR,
  atkFrozenFloorSource: ATK_FROZEN_FLOOR_SOURCE,
  baseGoalsSlopeDelta: baseGoalSlope.delta,
  armedGoalsSlopeDelta: armedGoalSlope.delta,
  baseDistanceAboveFloor: round(baseGoalSlope.delta - ATK_FROZEN_FLOOR),
  armedDistanceAboveFloor: round(armedGoalSlope.delta - ATK_FROZEN_FLOOR),
  /** the fraction of the base arm's excess-over-floor that the armed arm closes */
  fractionOfExcessClosed: round(
    (baseGoalSlope.delta - ATK_FROZEN_FLOOR) === 0 ? Number.NaN
      : ((baseGoalSlope.delta - ATK_FROZEN_FLOOR) - (armedGoalSlope.delta - ATK_FROZEN_FLOOR))
        / (baseGoalSlope.delta - ATK_FROZEN_FLOOR),
  ),
  armedMinusBase: round(armedGoalSlope.delta - baseGoalSlope.delta),
  bendsTowardFloor: armedGoalSlope.delta < baseGoalSlope.delta,
  readingVsContact: {
    baseInterceptionsDelta: slopeOf('liveBase', 'interceptions').delta,
    armedInterceptionsDelta: slopeOf('liveArmed', 'interceptions').delta,
    baseTacklesDelta: slopeOf('liveBase', 'tackles').delta,
    armedTacklesDelta: slopeOf('liveArmed', 'tackles').delta,
  },
  preRegisteredDirection: 'persistence SHOULD slow the reading collapse if assignment thrash '
    + 'was masking learned defence; if it does not move, that routes to the SURFACE SLICE, '
    + 'not to a nudge (#323 item 4, pre-registered before the battery).',
  interpretationNote: '⚠ THE FLOOR IS A DIFFERENT ARM ON DIFFERENT LEAGUE SEEDS (DF-C0 block '
    + '12,508,900–903 vs this stage\'s 12,510,900–903) and a different counterfactual '
    + '(frozen attack genes vs an armed defensive door). It is a REFERENCE LINE, not a '
    + 'matched control — this read is REPORTED and never gated.',
};

/* ========================================================================== */
/* §10 H-DF.0 — THE FROZEN VERDICT (never re-cut after sight)                  */
/* ========================================================================== */
const fSwitch = faceRow('markSwitchesPerDefenderMinute');
const fSwarm = faceRow('swarmZoneShare3');
const fHeld = faceRow('markHeldShare');
const limbA = fSwitch.resolved && fSwitch.direction === 'down';
const limbB1 = chaserBins.armed[4] === 0;
const limbB2 = !(fSwarm.resolved && fSwarm.direction === 'up');
const limbB3 = capIdentical && capRuleOccurrences === 1;
const limbB = limbB1 && limbB2 && limbB3;
const limbC = !(fHeld.resolved && fHeld.direction === 'down');
const HDF0_PASS = limbA && limbB && limbC;
const hdf0 = {
  claim: 'H-DF.0 — the thrash collapses at exam grain WITHOUT re-creating the swarm and '
    + 'WITHOUT abandoning coverage (the narrowed claim of ruling #323 item 4; H-DF.1\'s full '
    + 'surface differentiation is NAMED OUT to the later surface slice).',
  ciRule: 'RESOLVED = the 95 % seed-clustered PAIRED bootstrap interval of (armed − base) '
    + 'EXCLUDES ZERO. 2,000 draws, percentile interval, the SAME resampled seed set used for '
    + 'both arms in every draw. Frozen before the battery; never re-cut after sight.',
  limbs: {
    a_thrashCollapses: {
      pass: limbA, rule: 'markSwitchesPerDefenderMinute FALLS RESOLVEDLY',
      face: fSwitch.face, base: fSwitch.baseValue, armed: fSwitch.armedValue,
      delta: fSwitch.delta, ci: [fSwitch.ciLo, fSwitch.ciHi], halfWidth: fSwitch.halfWidth,
      ratioToHalfWidth: fSwitch.ratioToHalfWidth, direction: fSwitch.direction,
    },
    b1_fourChaserBinZeroArmed: {
      pass: limbB1, rule: 'the four-chaser bin is EXACTLY ZERO armed (structural conjunct)',
      armedBin4: chaserBins.armed[4], baseBin4: chaserBins.base[4],
      armedBins: chaserBins.armed, baseBins: chaserBins.base,
    },
    b2_swarmDoesNotRise: {
      pass: limbB2, rule: 'swarmZoneShare3 does NOT RISE resolvedly',
      face: fSwarm.face, base: fSwarm.baseValue, armed: fSwarm.armedValue,
      delta: fSwarm.delta, ci: [fSwarm.ciLo, fSwarm.ciHi], halfWidth: fSwarm.halfWidth,
      ratioToHalfWidth: fSwarm.ratioToHalfWidth, direction: fSwarm.direction,
    },
    b3_capLinesByteIdentical: {
      pass: limbB3, rule: 'assignChasers + the Phase-31 cap lines BYTE-IDENTICAL (git conjunct)',
      receipt: capReceipt,
    },
    c_coverageDoesNotCollapse: {
      pass: limbC, rule: 'markHeldShare does NOT FALL resolvedly',
      face: fHeld.face, base: fHeld.baseValue, armed: fHeld.armedValue,
      delta: fHeld.delta, ci: [fHeld.ciLo, fHeld.ciHi], halfWidth: fHeld.halfWidth,
      ratioToHalfWidth: fHeld.ratioToHalfWidth, direction: fHeld.direction,
    },
  },
  verdict: HDF0_PASS ? 'PASS' : 'FAIL',
};

/* ========================================================================== */
/* §11 GATES (frozen; a RED gate stays RED and is reported)                    */
/* ========================================================================== */
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2)
  && seedsWalked.every((s) => baseBySeed.has(s) && armedBySeed.has(s));
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK;
/** INSTRUMENT-ONLY: src is untouched by THIS stage (worktree vs HEAD, both halves) */
const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']).trim();
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']).trim();
gates.gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';
/** ⭐ M-DF.2: the cap is intact in BOTH arms */
gates.gCapIntactBothArms = chaserBins.armed[4] === 0 && chaserBins.base[4] === 0;
gates.gCapBinsNonEmpty = sum(chaserBins.armed) > 0 && sum(chaserBins.base) > 0;
gates.gCapLinesByteIdentical = capIdentical && capRuleOccurrences === 1;
gates.gLatencyBinsStored = rows.every((r) => r.reTargetLatencyBins.length === LAT_BINS)
  && sum(latencyBins.armed) > 0 && sum(latencyBins.base) > 0;
gates.gSwarmBinsStored = sum(swarmBins.baseZone) > 0 && sum(swarmBins.armedZone) > 0;
/** liveness — the door really did something (a zero delta would mean the arm did nothing) */
gates.gArmsDistinguishable = fSwitch.baseValue !== fSwitch.armedValue;
/** the R-乙 walker really ran (a zero denominator is a silent-dead instrument) */
gates.gRyiInstrumentAlive = rows.every((r) => r.openSpells > 0 && r.enginePasses > 0
  && r.openFirstReceptions > 0);
/** the ladder: complete, both arms, the door correct on EVERY created match */
gates.gLadderComplete = ladderCells.length === LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS
  && ladderCells.every((c) => c.matches > 0);
gates.gLadderDoorHeld = ladderCells.every((c) => c.doorWrong === 0 && c.doorChecked > 0);
gates.gLadderGen1Identical = gen1Fingerprints.length === LADDER_SEEDS.length
  && gen1Fingerprints.every((g) => /^[0-9a-f]{64}$/.test(g.sha256));
gates.gSeedDiscipline = SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999)
  && LADDER_SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gStatsDisjoint = STATS_BASE >= 114_800 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE;
gates.gFingerprintUnmoved = false; // filled below
gates.gFacesFromDisk = false;      // filled below (staging re-parse)

/* the production fingerprint, recomputed on THIS tree */
const FINGERPRINT_OF_RECORD = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
let fingerprintNow = 'NOT-RUN';
try {
  const out = execFileSync('npx', ['tsx', 'scripts/fingerprint.ts'], { encoding: 'utf8' });
  fingerprintNow = (/sha256=([0-9a-f]{64})/.exec(out) ?? [, 'NO-MATCH'])[1] as string;
} catch { fingerprintNow = 'FINGERPRINT-FAILED'; }
gates.gFingerprintUnmoved = fingerprintNow === FINGERPRINT_OF_RECORD;

/* ========================================================================== */
/* §12 THE ARTIFACT — allowlist schema; STAGE, re-derive off disk, hash LAST   */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');
const perfAnchorBytes = readFileSync('docs/perf/baseline.json');
const perfAnchor = JSON.parse(perfAnchorBytes.toString('utf8')) as Record<string, unknown>;

const bodyCore = {
  stage: 'DF-T1-PERSISTENCE-EXAM',
  kind: 'exam (H-DF.0 SCORED on virgin paired seeds; everything else REPORTED)',
  ruling: '#323 item 4',
  contract: 'DF-DEFENSIVE-BRAIN-CONTRACT.md §1 H-DF.1/H-DF.2 + §2 M-DF.2/M-DF.4',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/df-t1-persistence-exam.ts',
    sha256: instrumentSha,
    churnDefinitionsReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §R2 via '
      + 'scripts/probes/df-t0-assignment-persistence.ts (Row accumulator, familyOf, '
      + 'DUP_RUN_M, latency bins, swarm radii, every face\'s numerator/denominator pair)',
    ryiDefinitionsReusedFrom: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions '
      + '(Q01 · Q05 · Q06 · Q07 · Q14), ported verbatim through '
      + 'scripts/probes/bk-t2-composition-exam.ts §(d) THE R-乙 SPELL WALKER',
    ladderMechanismReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §7(d) — the '
      + 'league loop, the per-generation accumulators, EARLY/LATE windows and DF-C0-FIX '
      + '§RF1\'s ONE FORMULA (slopeDeltaThroughOneFormula)',
  },
  definitions: {
    ryiQ01: 'R-乙 VERBATIM — "how long a team keeps the ball (open-play possession spell, '
      + 'mean)": a maximal interval of same-owner-TEAM control while phase === "playing", '
      + 'ended by an opponent establishing ownership / the phase leaving "playing" / full '
      + 'time; duration = (endTick − startTick)·DT. openPlay origin only.',
    ryiQ05: 'R-乙 VERBATIM — "how many touches a possession is made of": ownership episodes '
      + 'counted inside each openPlay-origin spell.',
    ryiQ06: 'R-乙 VERBATIM — "how many passes find a team-mate": the engine\'s OWN passive '
      + 'counters, Σ team.stats.passesCompleted / Σ team.stats.passes, both teams.',
    ryiQ14: 'R-乙 VERBATIM — "how much of the game is played under pressure (pressing-intensity '
      + 'proxy)": among the FIRST reception of each openPlay-origin spell, the share whose '
      + 'nearest-opponent distance at the reception tick is ≤ the substrate\'s OWN pressure '
      + 'switch TOUCH_CONTROL_DIST. Restart/kickoff-origin receptions are EXCLUDED.',
    ryiQ07: 'R-乙 Q07 VERBATIM — FORWARD is the engine\'s own team.stats.passesForward counter.',
    ryiSource: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions, reused verbatim',
    markSwitch: 'DF-C0 §R2 VERBATIM — a defender-tick on which team.marks.get(index) is '
      + 'non-null now, was non-null last tick, and the two differ.',
    pressureRadiusMetres: PRESSURE_R,
    dupRunMetres: DUP_RUN_M,
    swarmRadiusStanceMetres: SWARM_R_STANCE,
    swarmRadiusZoneMetres: SWARM_R_ZONE,
    markRangeMetres: MARK_RANGE,
  },
  world: {
    version: DF_WORLD,
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw (DF-C0 §R2 / DF-T0\'s world, verbatim)',
    armDifference: 'dfAssignPersist only',
    arms: { base: 'the world-9 stack, door SHUT', armed: 'the world-9 stack + dfAssignPersist' },
    ladderWorld: 'the SHIPPED world (League — canon: worker fixtures play the SHIPPED world; '
      + 'League.toJSON omits matchFlags). The ladder is NOT world-9: it is the ecology.',
    ladderArmNotes: LADDER_ARM_NOTE,
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subRanges: {
      battery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} paired seeds)`,
      smokePrefix: `${BLOCK_BASE + 800}–${BLOCK_BASE + 802} (in band)`,
      ladderLeagues: `${LADDER_SEEDS_ALL[0]}–${LADDER_SEEDS_ALL[3]} (booked once, walked in both arms)`,
      receipt: `${RECEIPT_SEED} (the xxx,999 world-construction receipt — WALKED)`,
    },
    booked: SEEDS,
    walked: seedsWalked,
    ladderSeeds: LADDER_SEEDS,
    bookedEqualsWalked: seedsWalked.length === SEEDS.length && SEEDS.every((s) => seedsWalked.includes(s)),
    walksTotal: rows.length,
    blockConsumedWhole: `${BLOCK_BASE}–${BLOCK_BASE + 999} CONSUMED WHOLE of record`,
    nextSimBlock: 12_511_000,
  },
  stats: {
    basesConsumed: STATS_BASES_CONSUMED,
    step: STATS_STEP,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryComplete: REGISTRY_COMPLETE,
    registryCompletionMethod: 'IN-C0\'s COMPLETED 56-entry registry + the three bases '
      + 'consumed since that sweep: 114,200 (IN-C0/IN-C0-FIX, #317 item 4) and 114,400 + '
      + '114,600 (DF-C0, #320 item 4) = 59. DF-T0 consumed ZERO (#323 item 3).',
    minGapToAnyPublishedBase: minStatsGap,
    nextBase: STATS_BASE + 2 * STATS_STEP,
    draw1: `${STATS_BASE} — the paired seed-clustered match-battery bootstrap`,
    draw2: `${STATS_BASE + STATS_STEP} — the ladder's league-clustered slope bootstrap`,
    bootstrapDraws: BOOTSTRAP,
  },
  anchoredExtractions: anchorReceipts,
  capReceipt,
  hdf0,
  faces,
  latencyBins,
  latencyPercentiles,
  chaserBins,
  swarmBins,
  ladder: {
    arms: LADDER_ARMS,
    leagues: LADDER_SEEDS.length,
    generations: LADDER_GENS,
    leagueSeasons: ladderLeagueSeasons,
    matches: ladderMatches,
    earlyGens: `1..${EARLY_GENS}`,
    lateGens: `${LATE_FROM}..${LADDER_GENS}`,
    gen1Fingerprints,
    faces: ladderFaces,
    slopes: ladderSlopes,
    floorRead: ladderFloorRead,
  },
  perf: {
    anchorFile: 'docs/perf/baseline.json',
    anchorSha256: createHash('sha256').update(perfAnchorBytes).digest('hex'),
    anchorHead: (perfAnchor as { head?: string }).head ?? null,
    anchorUsPerStep: (perfAnchor as { usPerStep?: number }).usPerStep ?? null,
    note: 'DF-T1 is INSTRUMENT-ONLY — it measures no seam cost. DF-T0 §R4 owns the perf '
      + 'receipt for this door; nothing is re-measured or re-published here.',
  },
  wall: { batterySeconds: batteryWallSec, ladderSeconds: ladderWallSec },
  perSeedCells: rows,
  ladderCells,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'INSTRUMENT-ONLY stage: src must be UNTOUCHED (the #323 §CORR 2 citation sweep is '
      + 'comment/doc-only and landed in its own commit BEFORE this instrument was frozen)',
    gitStatusSrc: srcPorcelain,
    gitDiffStatSrcHead: srcDiffStat,
    head: gitOut(['rev-parse', 'HEAD']).trim(),
  },
};

/* ---- gFacesFromDisk: STAGE the body, re-parse it off disk, re-derive EVERY face ---- */
mkdirSync('docs/world-model/data', { recursive: true });
const STAGING = `${OUT.replace(/\.json$/, '')}.staging.json`;
writeFileSync(STAGING, `${JSON.stringify(bodyCore, null, 2)}\n`);
const onDisk = JSON.parse(readFileSync(STAGING, 'utf8')) as typeof bodyCore;
const mismatches: string[] = [];
let checks = 0;
/**
 * ⚠ JSON cannot carry NaN/Infinity — a non-finite face serializes as `null`. The
 * re-derivation therefore compares through the SAME serialization the reader sees, so a
 * degenerate face (an empty denominator) compares equal to its own published `null`
 * instead of manufacturing a phantom mismatch. Finite values are untouched.
 */
const asJson = (v: number): number | null => (Number.isFinite(v) ? v : null);
const same = (recomputed: number, published: unknown): boolean =>
  Object.is(asJson(recomputed), published as number | null);
{
  const dRows = onDisk.perSeedCells as Row[];
  const dBase = dRows.filter((r) => r.arm === 'base');
  const dArmed = dRows.filter((r) => r.arm === 'armed');
  for (const [name, d] of Object.entries(FACES)) {
    const published = (onDisk.faces as FaceRow[]).find((f) => f.face === name)!;
    const b = round(ratio(sum(dBase.map(d.num)), sum(dBase.map(d.den))));
    const a = round(ratio(sum(dArmed.map(d.num)), sum(dArmed.map(d.den))));
    const dl = round(ratio(sum(dArmed.map(d.num)), sum(dArmed.map(d.den)))
      - ratio(sum(dBase.map(d.num)), sum(dBase.map(d.den))));
    checks += 3;
    if (!same(b, published.baseValue)) mismatches.push(`face ${name} base ${b} vs ${published.baseValue}`);
    if (!same(a, published.armedValue)) mismatches.push(`face ${name} armed ${a} vs ${published.armedValue}`);
    if (!same(dl, published.delta)) mismatches.push(`face ${name} delta ${dl} vs ${published.delta}`);
  }
  /* the percentile faces, from the STORED bins on disk */
  for (const arm of ['base', 'armed'] as const) {
    const bins = Array.from({ length: LAT_BINS }, (_, bi) =>
      sum(dRows.filter((r) => r.arm === arm).map((r) => r.reTargetLatencyBins[bi])));
    checks += 1;
    if (JSON.stringify(bins) !== JSON.stringify((onDisk.latencyBins as Record<string, number[]>)[arm])) {
      mismatches.push(`latencyBins ${arm}`);
    }
    for (const [p, k] of [[0.5, `${arm}MedianS`], [0.9, `${arm}P90S`]] as const) {
      checks += 1;
      const v = latQuantile(bins, p as number);
      if (!same(v, (onDisk.latencyPercentiles as Record<string, number>)[k as string])) {
        mismatches.push(`latencyPercentile ${k}`);
      }
    }
    const cb = Array.from({ length: 5 }, (_, bi) =>
      sum(dRows.filter((r) => r.arm === arm).map((r) => r.chaserCountBins[bi])));
    checks += 1;
    if (JSON.stringify(cb) !== JSON.stringify((onDisk.chaserBins as Record<string, number[]>)[arm])) {
      mismatches.push(`chaserBins ${arm}`);
    }
  }
  for (const [k, pickB] of [
    ['baseStance', (r: Row) => r.arm === 'base' ? r.swarmStanceBins : null],
    ['armedStance', (r: Row) => r.arm === 'armed' ? r.swarmStanceBins : null],
    ['baseZone', (r: Row) => r.arm === 'base' ? r.swarmZoneBins : null],
    ['armedZone', (r: Row) => r.arm === 'armed' ? r.swarmZoneBins : null],
  ] as const) {
    const bins = Array.from({ length: SWARM_BINS }, (_, bi) =>
      sum(dRows.map((r) => pickB(r)?.[bi] ?? 0)));
    checks += 1;
    if (JSON.stringify(bins) !== JSON.stringify((onDisk.swarmBins as Record<string, number[]>)[k])) {
      mismatches.push(`swarmBins ${k}`);
    }
  }
  /* the ladder: every per-generation face and every slope, through THE ONE FORMULA */
  const dCells = onDisk.ladderCells as LadderCell[];
  for (const lf of onDisk.ladder.faces as LadderFaceRow[]) {
    const cs = dCells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
    const mt = sum(cs.map((c) => c.matches));
    const expect: Record<string, number> = {
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), mt * 2)),
      shotsOnTargetPerTeamMatch: round(ratio(sum(cs.map((c) => c.shotsOnTarget)), mt * 2)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), mt * 2)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt * 2)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), mt * 2)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), mt * 2)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
    };
    for (const [k, v] of Object.entries(expect)) {
      checks += 1;
      if (!same(v, (lf as unknown as Record<string, number>)[k])) {
        mismatches.push(`ladderFace ${lf.arm}/gen${lf.generation}/${k}`);
      }
    }
    checks += 1;
    if (JSON.stringify(cs.map((c) => round(ratio(c.goals, c.matches)))) !== JSON.stringify(lf.perLeagueGoalsPerMatch)) {
      mismatches.push(`ladderFace ${lf.arm}/gen${lf.generation}/perLeagueGoalsPerMatch`);
    }
  }
  for (const s of onDisk.ladder.slopes as LadderSlope[]) {
    const perLeague = LADDER_SEEDS.map((ls) => {
      const cs = dCells.filter((c) => c.arm === s.arm && c.leagueSeed === ls);
      const early = cs.filter((c) => c.generation <= EARLY_GENS);
      const late = cs.filter((c) => c.generation >= LATE_FROM);
      const f = s.face as (typeof LADDER_SLOPE_FACES)[number];
      const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
      const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
      return { early: e, late: l, delta: l - e };
    });
    checks += 4;
    if (!same(round(mean(perLeague.map((p) => p.early))), s.early)) mismatches.push(`slope ${s.arm}/${s.face}/early`);
    if (!same(round(mean(perLeague.map((p) => p.late))), s.late)) mismatches.push(`slope ${s.arm}/${s.face}/late`);
    if (!same(round(slopeDeltaThroughOneFormula(perLeague)), s.delta)) mismatches.push(`slope ${s.arm}/${s.face}/delta`);
    if (!same(round(Math.abs(slopeDeltaThroughOneFormula(perLeague)) / s.halfWidth, 6), s.ratioToHalfWidth)) {
      mismatches.push(`slope ${s.arm}/${s.face}/ratioToHalfWidth`);
    }
  }
  /* the floor read's own arithmetic */
  const bs = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveBase' && s.face === 'goals')!;
  const as2 = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveArmed' && s.face === 'goals')!;
  checks += 3;
  if (!same(round(bs.delta - ATK_FROZEN_FLOOR), onDisk.ladder.floorRead.baseDistanceAboveFloor)) mismatches.push('floorRead/base');
  if (!same(round(as2.delta - ATK_FROZEN_FLOOR), onDisk.ladder.floorRead.armedDistanceAboveFloor)) mismatches.push('floorRead/armed');
  if (!same(round(as2.delta - bs.delta), onDisk.ladder.floorRead.armedMinusBase)) mismatches.push('floorRead/armedMinusBase');
  /* the H-DF.0 limbs, recomputed off disk */
  const dSwitch = (onDisk.faces as FaceRow[]).find((f) => f.face === 'markSwitchesPerDefenderMinute')!;
  const dSwarm = (onDisk.faces as FaceRow[]).find((f) => f.face === 'swarmZoneShare3')!;
  const dHeld = (onDisk.faces as FaceRow[]).find((f) => f.face === 'markHeldShare')!;
  const rA = dSwitch.resolved && dSwitch.direction === 'down';
  const rB1 = (onDisk.chaserBins as Record<string, number[]>).armed[4] === 0;
  const rB2 = !(dSwarm.resolved && dSwarm.direction === 'up');
  const rB3 = onDisk.capReceipt.identical && onDisk.capReceipt.capRuleOccurrences === 1;
  const rC = !(dHeld.resolved && dHeld.direction === 'down');
  checks += 6;
  if (rA !== onDisk.hdf0.limbs.a_thrashCollapses.pass) mismatches.push('hdf0/a');
  if (rB1 !== onDisk.hdf0.limbs.b1_fourChaserBinZeroArmed.pass) mismatches.push('hdf0/b1');
  if (rB2 !== onDisk.hdf0.limbs.b2_swarmDoesNotRise.pass) mismatches.push('hdf0/b2');
  if (rB3 !== onDisk.hdf0.limbs.b3_capLinesByteIdentical.pass) mismatches.push('hdf0/b3');
  if (rC !== onDisk.hdf0.limbs.c_coverageDoesNotCollapse.pass) mismatches.push('hdf0/c');
  if ((rA && rB1 && rB2 && rB3 && rC ? 'PASS' : 'FAIL') !== onDisk.hdf0.verdict) mismatches.push('hdf0/verdict');
}
gates.gFacesFromDisk = mismatches.length === 0;
rmSync(STAGING, { force: true });

/* ---- the FINAL body: every gate written, THEN hashed (DF-C0 §CORR item 2) ---- */
const body = {
  ...bodyCore,
  faceReDerivation: { checks, mismatches },
  gates,
  gatesAllGreen: Object.values(gates).every(Boolean),
};
const ALL_GREEN = body.gatesAllGreen;
const artifact = {
  ...body,
  bodySha256: createHash('sha256').update(JSON.stringify(body)).digest('hex'),
};
const outPath = ALL_GREEN || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
const tmp = `${outPath}.tmp`;
writeFileSync(tmp, `${JSON.stringify(artifact, null, 2)}\n`);
renameSync(tmp, outPath);

banner(`\nwrote ${outPath}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
banner(`\nH-DF.0 = ${hdf0.verdict}`
  + `  (a=${limbA} b1=${limbB1} b2=${limbB2} b3=${limbB3} c=${limbC})`);
for (const f of ['markSwitchesPerDefenderMinute', 'swarmZoneShare3', 'markHeldShare',
  'dupMarkShare', 'reTargetLatencyMeanS', 'goalsPerMatch', 'ryiQ06PassCompletion']) {
  const r = faceRow(f);
  banner(`  ${f}: ${r.baseValue} → ${r.armedValue}  Δ ${r.delta} [${r.ciLo}, ${r.ciHi}]`
    + ` |Δ|/hw ${r.ratioToHalfWidth} ${r.resolved ? r.direction : 'unresolved'}`);
}
banner(`chaserBins base  = [${chaserBins.base.join(', ')}]`);
banner(`chaserBins armed = [${chaserBins.armed.join(', ')}]`);
banner(`ladder goals slope: base ${baseGoalSlope.delta} vs armed ${armedGoalSlope.delta}`
  + `  floor ${ATK_FROZEN_FLOOR}`);
banner(`re-derivation: ${checks} checks, ${mismatches.length} mismatches`);
process.exit(ALL_GREEN ? 0 : 1);
