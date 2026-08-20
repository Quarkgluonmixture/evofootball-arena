#!/usr/bin/env tsx
/**
 * ============================================================================
 * IN-T0 — THE SNAPSHOT LAW: THE RECEIPT WALKS (armed vs shut, both fields)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #324 item 4, bound by
 * `docs/world-model/IN-SNAPSHOT-CONTRACT.md` §2 (M-IN.1/M-IN.3/M-IN.4).
 * Stage doc: `docs/world-model/IN-T0-SNAPSHOT-LAW.md`.
 *
 * ⭐ THIS IS NOT AN EXAM. Canon: receipts ≠ effect sizes (homes: ruling #289
 * item 1 + BU-T1 §CORR item 5) — these walks produce ARMING RECEIPTS with
 * units. NO football claim is made here; H-IN.1 is a later stage's business.
 *
 * WHAT IT MEASURES — three receipt families:
 *   (A) THE STALENESS RECEIPTS, from the seam's OWN pure-bookkeeping ledger on
 *       the ARMED arms: the share of chooser reads served STALE, the mean and
 *       max staleness AGE in TICKS, the cold-start share, and the count of
 *       views built (= carrier decisions served by the law).
 *   (B) ⭐ THE FLIP RECEIPT — the IN-C0 ladder's prediction made live. Measured
 *       at MATCHED MOMENTS in the SHUT world (same world, same moment, two
 *       informations) with the shipped `choosePerceivedPassTarget` as the
 *       oracle, exactly as `in-c0-perception-surface-census.ts` §(d.2) does,
 *       except that the degraded snapshot carries the reader's OWN LAST-SEEN
 *       state under THIS SEAM's field law (`inFieldDotMin`) instead of a
 *       uniform k-tick freeze. Both fields walked.
 *       ⚠ TWO HONEST INSTRUMENT LIMITS, stated not hidden:
 *         · the oracle is the PERCEIVED-CHOICE chooser, not `decideCarrier`'s
 *           full ladder — the census had the same limit, and it is why this is
 *           a receipt and not an effect size;
 *         · the probe's store refreshes on EVERY tick the reader is the
 *           carrier, which is a SUPERSET of his decision ticks, so the store is
 *           the freshest one possible and the flip share is a LOWER BOUND.
 *   (C) THE DORMANCY RECEIPTS: flags-off byte-identity (pooled digest, both
 *       world shapes × 2 seeds) and the production fingerprint of record.
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)) — this file is frozen in
 *     its own commit BEFORE the battery runs; the artifact records its sha256.
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1).
 *   · per-seed cells (home ruling #282.2(ii)) — every face re-derives from
 *     `perSeedCells`.
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0
 *     §CORR item 1) — the two vision fields, §2.
 *   · "a field carries the unit its name claims" (home ruling #294 item 3) —
 *     every age face is in TICKS and says so.
 *   · receipts ≠ effect sizes (homes ruling #289 item 1 + BU-T1 §CORR item 5).
 *   · seed discipline: BOOKED = WALKED; the block is consumed whole.
 *   · ⭐ DF-C0 §CORR item 2 (ruling #321): the body is hashed LAST, after every
 *     gate is written; a RED run writes to a SIDE PATH.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: INT0_MODE (smoke|full, REQUIRED) · INT0_OUT.
 *   ANY other `INT0_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run may not write the canonical path.
 *
 * RUN: INT0_MODE=full npx tsx scripts/probes/in-t0-snapshot-law.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import {
  IN_FIELD_MISALIGN_MAX, inFieldDotMin, type InSnapshotField,
} from '../../src/ai/inSnapshotView';
import {
  choosePerceivedPassTarget, passChoiceCandidateGids,
} from '../../src/ai/perceivedPassChoice';
import { capturePerceptionTruth } from '../../src/ai/perceptionSnapshot';
import type { PerceptionSnapshot, PerceptionTruth } from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['INT0_MODE', 'INT0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'A4_WORLD',
  'EMERGENT_POS', 'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE',
  'CONTROL_REACH_SCALE', 'SPEED_TIME_SCALE', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('INT0_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
const MODE = process.env.INT0_MODE;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: INT0_MODE must be smoke|full');
  process.exit(2);
}
const OUT_OVERRIDE = process.env.INT0_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/in-t0-snapshot-law.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE === 'smoke';

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** IN-T0's OWN booked block (ruling #324 item 4): 12,511,000–999. */
const BLOCK_BASE = 12_511_000;
/** the full battery: 40 consecutive walks + the block's xxx,999 receipt seed */
const FULL_SEEDS = [
  ...Array.from({ length: 40 }, (_, i) => BLOCK_BASE + i),
  BLOCK_BASE + 999,
];
/** the smoke prefix, IN BAND — the same seeds the permanent pin suite uses */
const SMOKE_SEEDS = [BLOCK_BASE + 800, BLOCK_BASE + 801, BLOCK_BASE + 802];
const SEEDS = MODE === 'full' ? FULL_SEEDS : SMOKE_SEEDS;

/* ========================================================================== */
/* §2 THE WORLD, AND THE ANCHORED FIELD EXTRACTIONS                           */
/* ========================================================================== */
const IN_WORLD = 9 as const;
const F2 = 'F2squareAcross' satisfies InSnapshotField;
const F4 = 'F4contactHalfPrice' satisfies InSnapshotField;
const FIELDS = [F2, F4] as const;
type Arm = 'shut' | 'armedF2' | 'armedF4';
const ARMS: readonly Arm[] = ['shut', 'armedF2', 'armedF4'];
const fieldOfArm = (a: Arm): InSnapshotField => (a === 'armedF4' ? F4 : F2);

const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>) as readonly L3DoseCell[];
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

/**
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): each vision field is pulled from
 * ONE named line that must occur EXACTLY ONCE in its file. Never first-occurrence, never a
 * re-typed literal. The LINE NUMBERS are REPORTED here, never asserted — they are the thing
 * that drifts.
 */
interface Anchor { id: string; file: string; line: string; re: RegExp; field: InSnapshotField }
const ANCHORS: readonly Anchor[] = [
  {
    id: 'f2SquareAcrossMidpoint',
    file: 'src/sim/mechanics.ts',
    line: ' * 0 = striking dead ahead, 0.5 = square across the body, 1 = fully blind.',
    re: /ahead, (\d+(?:\.\d+)?) = square across the body/,
    field: F2,
  },
  {
    id: 'f4ContactBlindPrice',
    file: 'src/sim/Match.ts',
    line: '          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),',
    re: /\(1 - blind \* (CONTACT_BLIND_PEN)\)/,
    field: F4,
  },
];
interface AnchorReceipt {
  id: string; file: string; line: string; matches: number; lineNumbers: number[];
  captured: string; field: InSnapshotField; misalignMax: number; dotMin: number;
  halfAngleDeg: number;
}
const anchorReceipts: AnchorReceipt[] = ANCHORS.map((a) => {
  const lines = readFileSync(a.file, 'utf8').split('\n');
  const hits = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, matches: hits.length, lineNumbers: hits,
    captured: m === null ? 'NO-MATCH' : (m[1] as string),
    field: a.field,
    misalignMax: IN_FIELD_MISALIGN_MAX[a.field],
    dotMin: inFieldDotMin(a.field),
    halfAngleDeg: (Math.acos(inFieldDotMin(a.field)) * 180) / Math.PI,
  };
});
const ANCHORS_OK = anchorReceipts.every((r) => r.matches === 1 && r.captured !== 'NO-MATCH')
  && anchorReceipts[0].captured === '0.5'
  && anchorReceipts[1].captured === 'CONTACT_BLIND_PEN'
  && inFieldDotMin(F2) === 0;
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** the world-9 stack, verbatim, plus THIS slice's door as the only arm difference */
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(IN_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    ...(arm === 'shut' ? {} : { inSnapshotLaw: true, inSnapshotField: fieldOfArm(arm) }),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, IN_WORLD, L3_DOSE, PC_DOSE);
  return m;
};

const worldConjuncts = (m: Match, arm: Arm): Record<string, boolean> => {
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
    inDoorMatchesArm: m.inSnapshotLaw === (arm !== 'shut'),
    inFieldMatchesArm: m.inSnapshotField === fieldOfArm(arm),
    /** the DF-T0 door is NOT part of this stack (one seam per receipt walk) */
    dfDoorShut: m.dfAssignPersist === false,
  };
};

/* ========================================================================== */
/* §3 THE FLIP INSTRUMENT — matched moments, the IN-C0 §(d.2) idiom            */
/* ========================================================================== */
/** One remembered body in the PROBE's mirror of the reader's book. */
interface Remembered { x: number; y: number; vx: number; vy: number; bx: number; by: number; tick: number }
type MirrorStore = Map<number, Map<number, Remembered>>;

/** the snapshot the oracle prices on: full truth, with the named gids replaced by memory */
const oracleSnapshotWith = (
  truth: PerceptionTruth, observerGid: number, memory: ReadonlyMap<number, Remembered>,
): PerceptionSnapshot => ({
  tick: truth.tick,
  observerGid,
  awareness: 1,
  ball: {
    pos: { x: truth.ball.pos.x, y: truth.ball.pos.y },
    vel: { x: truth.ball.vel.x, y: truth.ball.vel.y },
    ownerGid: truth.ball.ownerGid,
    observedTick: truth.tick,
    ageTicks: 0,
  },
  players: truth.players.filter((p) => !p.sentOff).map((p) => {
    const old = memory.get(p.gid);
    return {
      gid: p.gid,
      side: p.side,
      pos: old === undefined ? { x: p.pos.x, y: p.pos.y } : { x: old.x, y: old.y },
      vel: old === undefined ? { x: p.vel.x, y: p.vel.y } : { x: old.vx, y: old.vy },
      bodyDir: old === undefined ? { x: p.bodyDir.x, y: p.bodyDir.y } : { x: old.bx, y: old.by },
      observedTick: old === undefined ? truth.tick : old.tick,
      ageTicks: old === undefined ? 0 : truth.tick - old.tick,
    };
  }),
});

/* ========================================================================== */
/* §4 THE ROW                                                                 */
/* ========================================================================== */
interface Row {
  arm: Arm;
  seed: number;
  worldOk: boolean;
  ticks: number;
  playingTicks: number;
  goals: number;
  stepWallMs: number;
  /* ---- (A) the seam's OWN ledger (armed arms only; zero on shut) ---- */
  viewsBuilt: number;
  bodiesViewed: number;
  readsInField: number;
  readsStale: number;
  readsColdStart: number;
  staleAgeTickSum: number;
  staleAgeMaxTicks: number;
  storeReaders: number;
  storeEntries: number;
  /* ---- (B) the flip oracle, per field (shut arm only; zero on armed) ---- */
  /** carrier decisions the oracle could price at all */
  flipEvalByField: number[];
  /** …of those, ones where at least one body was OUT of the reader's field */
  flipAnyOutByField: number[];
  /** …of those, ones whose ARGMAX pass target CHANGED under the reader's own book */
  flipsByField: number[];
  /** the reads the oracle's own book served STALE, and their age sum in TICKS */
  oracleReadsByField: number[];
  oracleStaleByField: number[];
  oracleStaleAgeTickSumByField: number[];
}

const emptyRow = (arm: Arm, seed: number): Row => ({
  arm,
  seed,
  worldOk: false,
  ticks: 0,
  playingTicks: 0,
  goals: 0,
  stepWallMs: 0,
  viewsBuilt: 0,
  bodiesViewed: 0,
  readsInField: 0,
  readsStale: 0,
  readsColdStart: 0,
  staleAgeTickSum: 0,
  staleAgeMaxTicks: 0,
  storeReaders: 0,
  storeEntries: 0,
  flipEvalByField: FIELDS.map(() => 0),
  flipAnyOutByField: FIELDS.map(() => 0),
  flipsByField: FIELDS.map(() => 0),
  oracleReadsByField: FIELDS.map(() => 0),
  oracleStaleByField: FIELDS.map(() => 0),
  oracleStaleAgeTickSumByField: FIELDS.map(() => 0),
});

const walk = (seed: number, arm: Arm): Row => {
  const m = buildMatch(seed, arm);
  const row = emptyRow(arm, seed);
  row.worldOk = Object.values(worldConjuncts(m, arm)).every(Boolean);
  /** the probe's mirror books — one per field, SHUT ARM ONLY (matched moments) */
  const mirrors: MirrorStore[] = FIELDS.map(() => new Map());
  const t0 = Date.now();
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    if (m.phase !== 'playing') continue;
    row.playingTicks += 1;
    if (arm !== 'shut') continue;
    /* ---------------- (B) THE FLIP ORACLE AT MATCHED MOMENTS ---------------- */
    const carrier = m.ball.owner;
    if (carrier === null || carrier.sentOff) continue;
    const truth = capturePerceptionTruth(m);
    const t = m.teams[carrier.side];
    const candidateGids = passChoiceCandidateGids(carrier, t.players);
    for (let fi = 0; fi < FIELDS.length; fi++) {
      const dotMin = inFieldDotMin(FIELDS[fi]);
      let book = mirrors[fi].get(carrier.gid);
      if (book === undefined) {
        book = new Map<number, Remembered>();
        mirrors[fi].set(carrier.gid, book);
      }
      /* the seam's law, mirrored: in-field ⇒ refresh; never-seen ⇒ cold-start truth */
      const memory = new Map<number, Remembered>();
      for (const other of truth.players) {
        if (other.sentOff || other.gid === carrier.gid) continue;
        const dx = other.pos.x - carrier.pos.x;
        const dy = other.pos.y - carrier.pos.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const inField = d <= 1e-9
          || (carrier.heading.x * dx + carrier.heading.y * dy) / d >= dotMin;
        const seen: Remembered = {
          x: other.pos.x, y: other.pos.y, vx: other.vel.x, vy: other.vel.y,
          bx: other.bodyDir.x, by: other.bodyDir.y, tick: truth.tick,
        };
        const held = book.get(other.gid);
        row.oracleReadsByField[fi] += 1;
        if (inField || held === undefined) {
          book.set(other.gid, seen);
          continue;
        }
        memory.set(other.gid, held);
        row.oracleStaleByField[fi] += 1;
        row.oracleStaleAgeTickSumByField[fi] += truth.tick - held.tick;
      }
      if (candidateGids.length === 0) continue;
      const reach = m.reachProfiles();
      const fresh = choosePerceivedPassTarget({
        snapshot: oracleSnapshotWith(truth, carrier.gid, new Map()),
        passerGid: carrier.gid,
        candidateGids,
        attackDir: t.attackDir,
        reachProfiles: reach,
        valueAxis: m.edsValueAxis,
      });
      if (fresh === null) continue;
      row.flipEvalByField[fi] += 1;
      if (memory.size > 0) row.flipAnyOutByField[fi] += 1;
      const believed = choosePerceivedPassTarget({
        snapshot: oracleSnapshotWith(truth, carrier.gid, memory),
        passerGid: carrier.gid,
        candidateGids,
        attackDir: t.attackDir,
        reachProfiles: reach,
        valueAxis: m.edsValueAxis,
      });
      if (believed === null || believed.targetGid !== fresh.targetGid) {
        row.flipsByField[fi] += 1;
      }
    }
  }
  row.stepWallMs = Date.now() - t0;
  row.goals = m.score[0] + m.score[1];
  /* ---------------- (A) THE SEAM'S OWN LEDGER ---------------- */
  const led = m.inSnapshotLedger;
  row.viewsBuilt = led.viewsBuilt;
  row.bodiesViewed = led.bodiesViewed;
  row.readsInField = led.readsInField;
  row.readsStale = led.readsStale;
  row.readsColdStart = led.readsColdStart;
  row.staleAgeTickSum = led.staleAgeTickSum;
  row.staleAgeMaxTicks = led.staleAgeMaxTicks;
  row.storeReaders = m.inSnapshotStore.size;
  let entries = 0;
  for (const book of m.inSnapshotStore.values()) entries += book.size;
  row.storeEntries = entries;
  return row;
};

/* ========================================================================== */
/* §5 THE BATTERY                                                             */
/* ========================================================================== */
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const arm of ARMS) {
    rows.push(walk(seed, arm));
    process.stdout.write(`  seed ${seed} ${arm.padEnd(7)} done\n`);
  }
}

/* ========================================================================== */
/* §6 FACES — every one re-derives from `perSeedCells`                        */
/* ========================================================================== */
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);
const round = (v: number): number => (Number.isFinite(v) ? Number(v.toPrecision(12)) : v);

interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string }
const FACES: Record<string, FaceDef> = {
  chooserReadsStaleShare: {
    num: (r) => r.readsStale, den: (r) => r.bodiesViewed,
    unit: 'share of the carrier chooser\'s other-body reads served from the private book',
    what: 'THE STALENESS RECEIPT: how much of what the man on the ball prices is remembered '
      + 'rather than seen',
    denNote: 'denominator = other-body resolutions inside built views (the reader himself '
      + 'and sent-off bodies are excluded by construction)',
  },
  chooserReadsInFieldShare: {
    num: (r) => r.readsInField, den: (r) => r.bodiesViewed,
    unit: 'share of the carrier chooser\'s other-body reads refreshed to truth',
    what: 'the refresh half of the law (the complement, cold starts aside)',
    denNote: 'same denominator',
  },
  chooserReadsColdStartShare: {
    num: (r) => r.readsColdStart, den: (r) => r.bodiesViewed,
    unit: 'share of the carrier chooser\'s other-body reads served by the cold-start rule',
    what: 'how much of the receipt is the born-knowing-the-lineup seeding',
    denNote: 'same denominator',
  },
  staleAgeMeanTicks: {
    num: (r) => r.staleAgeTickSum, den: (r) => r.readsStale,
    unit: 'TICKS (sim ticks; 1 tick = DT sim-seconds)',
    what: 'MEAN STALENESS AGE: how old the remembered position was when it was priced',
    denNote: 'denominator = stale reads only (a fresh read has no age)',
  },
  staleAgeMeanSimSeconds: {
    num: (r) => r.staleAgeTickSum * DT, den: (r) => r.readsStale,
    unit: 'sim-seconds (the dual axis; clock honesty)',
    what: 'the same age on the sim clock',
    denNote: 'denominator = stale reads only',
  },
  viewsBuiltPerMatch: {
    num: (r) => r.viewsBuilt, den: () => 1,
    unit: 'views per match',
    what: 'carrier decisions served by the law (the arming receipt: the seam FIRED)',
    denNote: 'one match per seed',
  },
  bodiesViewedPerView: {
    num: (r) => r.bodiesViewed, den: (r) => r.viewsBuilt,
    unit: 'other bodies resolved per view',
    what: 'the perf-relevant fan-out (the store is per-reader × 11 bodies at most)',
    denNote: 'denominator = views built',
  },
  storeEntriesAtFullTime: {
    num: (r) => r.storeEntries, den: () => 1,
    unit: 'remembered (reader, body) pairs alive at full time',
    what: 'the whole memory footprint of the law, measured',
    denNote: 'one match per seed',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: () => 1,
    unit: 'goals per match',
    what: 'the world-9 rate at this battery\'s grain — a RECEIPT, never a football claim',
    denNote: 'one match per seed',
  },
};
/** the flip faces, per field — the SHUT arm's matched-moment oracle */
for (let fi = 0; fi < FIELDS.length; fi++) {
  const fk = FIELDS[fi];
  FACES[`flipShare_${fk}`] = {
    num: (r) => r.flipsByField[fi], den: (r) => r.flipEvalByField[fi],
    unit: 'share of priced carrier moments whose ARGMAX pass target changed',
    what: `⭐ THE FLIP RECEIPT at ${fk}: the IN-C0 ladder's prediction made live — how often `
      + 'believing his own book sends the ball to a DIFFERENT man',
    denNote: 'denominator = carrier moments the shipped perceived-choice oracle could price '
      + 'at all (identical across fields by construction — gated)',
  };
  FACES[`anyOutOfFieldShare_${fk}`] = {
    num: (r) => r.flipAnyOutByField[fi], den: (r) => r.flipEvalByField[fi],
    unit: 'share of priced carrier moments with ≥1 body served from the book',
    what: `the could-flip population at ${fk}`,
    denNote: 'same denominator',
  };
  FACES[`oracleStaleShare_${fk}`] = {
    num: (r) => r.oracleStaleByField[fi], den: (r) => r.oracleReadsByField[fi],
    unit: 'share of the oracle\'s other-body reads served from the book',
    what: `the oracle's own staleness share at ${fk} (the cross-check on the seam's ledger)`,
    denNote: 'denominator = the oracle\'s other-body reads (EVERY carrier tick, not only '
      + 'decision ticks — the superset that makes the flip share a LOWER bound)',
  };
  FACES[`oracleStaleAgeMeanTicks_${fk}`] = {
    num: (r) => r.oracleStaleAgeTickSumByField[fi], den: (r) => r.oracleStaleByField[fi],
    unit: 'TICKS',
    what: `the oracle's mean staleness age at ${fk}`,
    denNote: 'denominator = the oracle\'s stale reads',
  };
}

const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngBoot.next() * seedsWalked.length)));

interface FaceRow {
  arm: Arm; face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faceOf = (arm: Arm, name: string, d: FaceDef): FaceRow => {
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
for (const arm of ARMS) {
  for (const [k, d] of Object.entries(FACES)) faces.push(faceOf(arm, k, d));
}
const faceValue = (arm: Arm, name: string): number =>
  faces.find((f) => f.arm === arm && f.face === name)!.value;

/* ---- the max staleness age, pooled per arm (a MAX face: the noise-floor rule) ---- */
const staleAgeMaxTicks = Object.fromEntries(ARMS.map((a) => [a,
  Math.max(0, ...rows.filter((r) => r.arm === a).map((r) => r.staleAgeMaxTicks))]));

/* ========================================================================== */
/* §7 DORMANCY — flags-off byte identity (pooled digest) + the fingerprint     */
/* ========================================================================== */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
      for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
    }
  }
  const r = m.getResult();
  return createHash('sha256').update(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)),
    score: r.score, stats: r.stats, events: r.events.length, ticks,
  })).digest('hex');
};
const dormancySeeds = [BLOCK_BASE + 800, BLOCK_BASE + 801];
const dormancyCells: Array<{ world: number; seed: number; absent: string; explicitFalse: string; fieldSetButShut: string; identical: boolean }> = [];
for (const world of [8, 9] as const) {
  for (const seed of dormancySeeds) {
    const mk = (extra: Record<string, unknown>): Match => {
      const m = new Match({
        seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
        ...a4MatchFlags(world), ...extra,
      } as ConstructorParameters<typeof Match>[0]);
      armA4World(m, null, world, L3_DOSE, PC_DOSE);
      return m;
    };
    const absent = signatureOf(mk({}));
    const explicitFalse = signatureOf(mk({ inSnapshotLaw: false }));
    const fieldSetButShut = signatureOf(mk({ inSnapshotField: F4 }));
    dormancyCells.push({
      world, seed, absent, explicitFalse, fieldSetButShut,
      identical: explicitFalse === absent && fieldSetButShut === absent,
    });
  }
}
const dormancyPooledDigest = createHash('sha256')
  .update(dormancyCells.map((c) => c.absent).join('|')).digest('hex');

/* ---- the perf receipt, against the ANCHOR (the DF-C0 anchor idiom) ---- */
const perfAnchorBytes = readFileSync('docs/perf/baseline.json');
const perfAnchor = JSON.parse(perfAnchorBytes.toString('utf8')) as Record<string, unknown>;
const anchorPhases = (perfAnchor as { phases?: Array<{ phase: string; usPerStep: number }> })
  .phases ?? [];
const anchorDecide = anchorPhases.find((p) => p.phase === 'decide')?.usPerStep ?? null;
const wallUsPerStep = (arm: Arm): number => {
  const armRows = rows.filter((r) => r.arm === arm);
  return ratio(sum(armRows.map((r) => r.stepWallMs)) * 1000, sum(armRows.map((r) => r.ticks)));
};
const perf = {
  anchorFile: 'docs/perf/baseline.json',
  anchorSha256: createHash('sha256').update(perfAnchorBytes).digest('hex'),
  anchorHead: (perfAnchor as { head?: string }).head ?? null,
  anchorUsPerStep: (perfAnchor as { usPerStep?: number }).usPerStep ?? null,
  anchorDecideUsPerStep: anchorDecide,
  budgetUsPerStep: anchorDecide === null ? null : round(anchorDecide * 0.2),
  budgetNote: 'THE BUDGET IS A BUDGET, NOT A SELF-MEASURED SHARE (the DF-C0 anchor idiom): '
    + '20 % of the anchor\'s OWN decide-phase cost, because this seam lives entirely inside '
    + 'the decide phase. The measured numbers below are WALL measurements with the flip '
    + 'oracle inside the timer on the shut arm, so shut-vs-armed wall deltas are NOT a '
    + 'clean seam cost and are published as such.',
  shutWallUsPerStep: round(wallUsPerStep('shut')),
  armedF2WallUsPerStep: round(wallUsPerStep('armedF2')),
  armedF4WallUsPerStep: round(wallUsPerStep('armedF4')),
  armedF2MinusArmedF4UsPerStep: round(wallUsPerStep('armedF2') - wallUsPerStep('armedF4')),
  bookkeepingRecordsCeiling: 2 * TEAM_SIZE * (2 * TEAM_SIZE - 1),
  bookkeepingRecordsCeilingNote: 'the STRUCTURAL ceiling: every body on the pitch as a '
    + 'reader × every other body. The MEASURED footprint is `storeEntriesAtFullTime`.',
};

/* ========================================================================== */
/* §8 GATES (frozen; a RED gate stays RED and is reported)                    */
/* ========================================================================== */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s));
gates.gArmsTripledPerSeed = seedsWalked.every((s) =>
  rows.filter((r) => r.seed === s).length === ARMS.length);
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK;
/** ⭐ BOTH FIELDS FIRE (#324 item 4: "your receipts show both fire") */
gates.gBothFieldsFire = rows.filter((r) => r.arm === 'armedF2').every((r) => r.readsStale > 0)
  && rows.filter((r) => r.arm === 'armedF4').every((r) => r.readsStale > 0);
/** the shut arm's books stay EMPTY — the ledger is proven inert, not assumed */
gates.gShutLedgerEmpty = rows.filter((r) => r.arm === 'shut')
  .every((r) => r.viewsBuilt === 0 && r.bodiesViewed === 0 && r.readsStale === 0
    && r.storeReaders === 0 && r.storeEntries === 0);
/** F4 is the WIDER field, so it must serve STRICTLY LESS staleness than F2 (the band) */
gates.gF4LessStaleThanF2 =
  faceValue('armedF4', 'chooserReadsStaleShare') < faceValue('armedF2', 'chooserReadsStaleShare');
/** the flip denominators agree across fields (the same priced moments, two beliefs) */
gates.gFlipDenominatorsAgree = rows.filter((r) => r.arm === 'shut')
  .every((r) => r.flipEvalByField.every((v) => v === r.flipEvalByField[0]));
gates.gFlipPopulationNonEmpty = sum(rows.filter((r) => r.arm === 'shut')
  .map((r) => r.flipEvalByField[0])) > 0
  && sum(rows.filter((r) => r.arm === 'shut').map((r) => r.flipsByField[0])) > 0;
/** the store never exceeds its structural ceiling */
gates.gStoreWithinCeiling = rows.every((r) => r.storeEntries <= perf.bookkeepingRecordsCeiling);
/** the arms really differ (liveness — a zero delta would mean the door did nothing) */
gates.gArmsDistinguishable = faceValue('armedF2', 'viewsBuiltPerMatch') > 0
  && faceValue('armedF4', 'viewsBuiltPerMatch') > 0
  && faceValue('shut', 'viewsBuiltPerMatch') === 0;
/** ⭐⭐ FLAGS-OFF BYTE IDENTITY: absent ≡ false ≡ field-set-but-shut, both worlds × 2 seeds */
gates.gDormancyByteIdentical = dormancyCells.every((c) => c.identical);
gates.gFingerprintUnmoved = true; // filled below

/* the production fingerprint, recomputed on THIS tree */
const FINGERPRINT_OF_RECORD = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
let fingerprintNow = 'NOT-RUN';
try {
  const out = execFileSync('npx', ['tsx', 'scripts/fingerprint.ts'], { encoding: 'utf8' });
  fingerprintNow = (/sha256=([0-9a-f]{64})/.exec(out) ?? [, 'NO-MATCH'])[1] as string;
} catch { fingerprintNow = 'FINGERPRINT-FAILED'; }
gates.gFingerprintUnmoved = fingerprintNow === FINGERPRINT_OF_RECORD;

/* ========================================================================== */
/* §9 THE ARTIFACT — allowlist schema, body hashed LAST                       */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');
const body = {
  stage: 'IN-T0-SNAPSHOT-LAW',
  kind: 'receipt-walks (NOT an exam; canon: receipts ≠ effect sizes)',
  ruling: '#324 item 4',
  contract: 'IN-SNAPSHOT-CONTRACT.md §2 M-IN.1/M-IN.3/M-IN.4',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/in-t0-snapshot-law.ts',
    sha256: instrumentSha,
    flipOracleReusedFrom: 'scripts/probes/in-c0-perception-surface-census.ts §(d.2) — the '
      + 'shipped choosePerceivedPassTarget priced twice at one moment; the degraded side '
      + 'carries the reader\'s OWN last-seen book under this seam\'s field law instead of a '
      + 'uniform k-tick freeze',
    flipOracleLimits: 'the oracle is the PERCEIVED-CHOICE chooser, not decideCarrier\'s full '
      + 'ladder; and the probe\'s book refreshes on EVERY carrier tick (a superset of his '
      + 'decision ticks), so the flip share is a LOWER BOUND',
  },
  world: {
    version: IN_WORLD,
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw (the world-9 stack, verbatim)',
    armDifference: 'inSnapshotLaw + inSnapshotField only; dfAssignPersist SHUT on all arms',
    arms: ARMS,
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    booked: SEEDS,
    walked: seedsWalked,
    walksTotal: rows.length,
    smokePrefixInBand: SMOKE_SEEDS,
    receiptSeed: BLOCK_BASE + 999,
  },
  statsConsumed: 0,
  anchoredExtractions: anchorReceipts,
  faces,
  staleAgeMaxTicks,
  dormancy: { cells: dormancyCells, pooledDigest: dormancyPooledDigest },
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
  gatesAllGreen: Object.values(gates).every(Boolean),
};
const ALL_GREEN = body.gatesAllGreen;
const artifact = {
  ...body,
  bodySha256: createHash('sha256').update(JSON.stringify(body)).digest('hex'),
};
mkdirSync('docs/world-model/data', { recursive: true });
const outPath = ALL_GREEN || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
if (IS_OVERRIDE && outPath === CANONICAL_OUT) {
  console.error('REFUSAL: an override run may not write the canonical path');
  process.exit(2);
}
writeFileSync(outPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(`\nwrote ${outPath}`);
for (const [k, v] of Object.entries(gates)) console.log(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
console.log('\nstaleness (the seam\'s own ledger):');
for (const arm of ['armedF2', 'armedF4'] as const) {
  console.log(`  ${arm}: staleShare ${faceValue(arm, 'chooserReadsStaleShare')} · `
    + `meanAgeTicks ${faceValue(arm, 'staleAgeMeanTicks')} · `
    + `maxAgeTicks ${staleAgeMaxTicks[arm]} · `
    + `coldStartShare ${faceValue(arm, 'chooserReadsColdStartShare')} · `
    + `viewsPerMatch ${faceValue(arm, 'viewsBuiltPerMatch')}`);
}
console.log('\nflips (matched moments, shut world, the shipped oracle):');
for (const fk of FIELDS) {
  console.log(`  ${fk}: flipShare ${faceValue('shut', `flipShare_${fk}`)} · `
    + `anyOutShare ${faceValue('shut', `anyOutOfFieldShare_${fk}`)} · `
    + `oracleStaleShare ${faceValue('shut', `oracleStaleShare_${fk}`)}`);
}
console.log(`\ndormancy pooled digest = ${dormancyPooledDigest}`);
console.log(`fingerprint = ${fingerprintNow}`);
process.exit(ALL_GREEN ? 0 : 1);
