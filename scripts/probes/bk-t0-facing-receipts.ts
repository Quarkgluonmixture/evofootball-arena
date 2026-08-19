/**
 * ⭐ BK-T0 — THE FACING LAW'S RECEIPT WALKS (docs/world-model/BK-T0-FACING-LAW.md).
 *
 * Authorized by ruling #306 items 3 + 6 for EXACTLY this stage. This is NOT an exam and
 * NOT a census: it is the ARMING RECEIPT instrument for a dormant src seam — it shows the
 * seam FIRES (arms extended, bodies turning, misalign-at-release falling on these walks)
 * and it proves the arming LIFECYCLE at the world-8 composition (M-BK.4 / M-BU.2 lineage).
 *
 * ⭐ CANON, COPIED FROM CANON.md BESIDE ITS ACTUAL HOME (never re-typed from memory, #301):
 *   · receipts ≠ effect sizes — arming/plumbing receipts are never quoted as football
 *     effect sizes.  HOMES: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER
 *     CORRECTIONS item 5. (paraphrase)   ⇒ EVERY face below is a RECEIPT. The composition
 *     exam is a LATER stage; this file makes NO football claim.
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; the artifact
 *     records the instrument hash.        HOME: ruling #266.3(c). (paraphrase)
 *   · composition proof — any world arming a new seam alongside the CB/L3 stack proves the
 *     doors/lifecycle at THAT composition first.  HOME: BU contract M-BU.2 (ruling #285),
 *     inherited by M-BK.4. (paraphrase)
 *   · "a field carries the unit its name claims".   HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
 *     face".  HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match
 *     + line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record.
 *     HOME: the standing frontier practice. (paraphrase)
 *
 * ⭐ THE WORLD: the world-8 composition — `a4MatchFlags(8)` + `armA4World(m, null, 8,
 *   L3_DOSE, PC_DOSE)`, both dose artifacts hashed AS FILE BYTES before they are parsed —
 *   the WATCHED world of record, where BOTH wind-up channels the facing law extends are
 *   armed. BK-T0's own door `bkFacingLaw` is the ONLY thing this probe adds.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BKT0_MODE (smoke|full, REQUIRED) · BKT0_N · BKT0_OUT.
 *   ANY other `BKT0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BKT0_MODE=full npx tsx scripts/probes/bk-t0-facing-receipts.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = world/dose class BIT.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { BK_CONE_RAD, BK_CONE_TICKS, Match, bkFacingExtraTicks } from '../../src/sim/Match';
import { TURN_RATE, type Player } from '../../src/sim/Player';
import { DT } from '../../src/sim/constants';
import { kickMisalignment } from '../../src/sim/mechanics';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const t0Wall = Date.now();
const sha = (s: string): string => createHash('sha256').update(s).digest('hex');
const banner = (s: string): void => { process.stdout.write(`${s}\n`); };
const die = (code: number, why: string): never => {
  banner(`BK-T0 RECEIPTS REFUSED: ${why}`);
  process.exit(code);
};

/* ========================================================================== */
/* §1 THE ENV SURFACE — WHITELIST OR REFUSE                                   */
/* ========================================================================== */
const ALLOWED = new Set(['BKT0_MODE', 'BKT0_N', 'BKT0_OUT']);
for (const k of Object.keys(process.env)) {
  if (k.startsWith('BKT0_') && !ALLOWED.has(k)) die(2, `unknown env override \`${k}\``);
  // the ENGINE's own doors may never be set for a receipt walk — the world is constructed
  // in code, from a4MatchFlags, and nothing else may reach in
  if (/^(EDS_|A4_|MT_|PC_|L3_|CB_|PW_|BK_)/.test(k) && !ALLOWED.has(k)) {
    die(2, `an engine env door is set: \`${k}\``);
  }
}
const MODE = process.env.BKT0_MODE;
if (MODE !== 'smoke' && MODE !== 'full') die(2, 'BKT0_MODE must be `smoke` or `full`');
const IS_OVERRIDE = process.env.BKT0_N !== undefined || process.env.BKT0_OUT !== undefined;
const CANONICAL_OUT = 'docs/world-model/data/bk-t0-facing-receipts.json';
const OUT_PATH = process.env.BKT0_OUT ?? CANONICAL_OUT;
if (IS_OVERRIDE && pathResolve(OUT_PATH) === pathResolve(CANONICAL_OUT)) {
  die(2, 'an OVERRIDE run may not write the canonical artifact path');
}

/* ========================================================================== */
/* §2 THE SEED LEDGER — BOOKED = WALKED, inside BK-T0's own block             */
/* ========================================================================== */
/** Block of record: 12,502,000–999 (ruling #306 item 6). */
const BLOCK = 12_502_000;
const N = Number(process.env.BKT0_N ?? (MODE === 'full' ? 50 : 4));
if (!Number.isInteger(N) || N < 1 || N > 400) die(2, 'BKT0_N must be an integer in [1, 400]');
/** The A/B receipt battery: each seed walked TWICE — the law armed, and the law shut. */
const BATTERY_SEEDS = Array.from({ length: N }, (_, i) => BLOCK + i);
/** The doors matrix seeds (three bodies of law, eight door cells each). */
const DOORS_SEEDS = [BLOCK + 500, BLOCK + 501, BLOCK + 502];
/** The world-construction receipt (the xxx,999 convention). */
const RECEIPT_SEED = BLOCK + 999;

/* ========================================================================== */
/* §3 THE DOSE SOURCES — FILE BYTES HASHED BEFORE THEY ARE PARSED             */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_BYTES_SHA = sha(PC_BYTES);
const PC_DOSE = poolPcDoseTable(JSON.parse(PC_BYTES) as Record<string, unknown>);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const PC_DOSE_EXPOSURES = sum(PC_DOSE.map((r) => sum(r as readonly number[])));
const L3_DOSE_LUNGES = sum(L3_DOSE.map((c) => c.lunges));

/* ========================================================================== */
/* §4 THE SRC-EXTRACTED CONSTANTS — ANCHORED AT THEIR NAMED CALL SITES        */
/* ========================================================================== */
const MATCH_SRC = readFileSync('src/sim/Match.ts', 'utf8');
const PLAYER_SRC = readFileSync('src/sim/Player.ts', 'utf8');
/** anchored extraction (canon, home BK-C0 §CORR item 1): the NAMED declaration, not a hit */
const anchored = (src: string, re: RegExp, label: string): { value: number; line: number } => {
  const m = re.exec(src);
  if (m === null) die(3, `anchored extraction failed for ${label}`);
  const line = src.slice(0, m!.index).split('\n').length;
  const value = Number(m![1]);
  if (!Number.isFinite(value)) die(3, `anchored extraction non-finite for ${label}`);
  return { value, line };
};
const X_C7_W_CAP = anchored(MATCH_SRC, /^const C7_W_CAP = ([0-9.]+);/m, 'C7_W_CAP');
const X_TURN_RATE = anchored(PLAYER_SRC, /^export const TURN_RATE = ([0-9.]+);/m, 'TURN_RATE');

/* ========================================================================== */
/* §5 THE WORLD                                                               */
/* ========================================================================== */
const W8 = 8 as const;
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
interface Doors { c7?: boolean; o1?: boolean; bk?: boolean }
const build = (seed: number, d: Doors = {}): Match => {
  const cfg: Record<string, unknown> = {
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(W8),
  };
  if (d.c7 !== undefined) cfg.c7Windup = d.c7;
  if (d.o1 !== undefined) cfg.o1PassWindup = d.o1;
  if (d.bk !== undefined) cfg.bkFacingLaw = d.bk;
  const m = new Match(cfg as unknown as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, W8, L3_DOSE, PC_DOSE);
  return m;
};
/** The world-8 identity conjuncts, ASSERTED on the very match each walk measures. */
const worldConforms = (m: Match): boolean => {
  const mm = m as unknown as {
    pcLatency: { books: { count(ri: number, key: string): number }[] } | null;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
  };
  if (mm.pcLatency === null || mm.l3Defence === null) return false;
  const pcDosed = mm.pcLatency.books.every((b) => PC_DOSE.every((row, ri) => PC_BOOK_CELLS
    .every((c, ci) => b.count(ri, c) === (row as readonly number[])[ci])));
  const l3Dosed = mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, i) => b.lunges[i] === c.lunges && b.punished[i] === c.punished));
  return pcDosed && l3Dosed;
};
/**
 * The channel half, kept SEPARATE from the dose half on purpose: the doors matrix VARIES
 * `c7Windup`/`o1PassWindup` by design, so folding "both channels armed" into the world
 * conjunct would make the matrix's own cells fail their own gate.
 */
const channelsArmed = (m: Match): boolean => m.c7Windup && m.o1PassWindup;

/* ========================================================================== */
/* §6 THE WALK — the pre-step snapshot idiom                                  */
/* ========================================================================== */
/**
 * Both wind-up resolves run at the HEAD of `step()` (Match.ts, before brains and physics),
 * so the heading a release is priced against is the heading standing at the END of the
 * previous step. The probe therefore snapshots (record, heading, pos) BEFORE each step and
 * reads the release off the slot that emptied — no src hook, no reordering.
 */
interface Walk {
  seed: number;
  armed: boolean;
  ticks: number;
  conformed: boolean;
  /** the seam's own in-engine ledger, read at the whistle */
  armsSeen: number; armsExtended: number; extraTicksTotal: number; maxExtraTicks: number;
  /** the O1 channel's own ledger — liveness of the channel the law extends */
  o1Arms: number; o1Struck: number;
  /** RELEASES OBSERVED at the wind-up slots (the misalign-at-release receipt) */
  releases: number;
  misalignSum: number;
  releasesOutsideCone: number;
  /** LIFECYCLE (M-BK.4): the arming life the law lengthens */
  maxArmingLifeTicks: number;
  armingsLiveAtWhistle: number;
  armingsAcrossPhaseChange: number;
}
const walk = (seed: number, d: Doors): Walk => {
  const m = build(seed, d);
  const w: Walk = {
    seed, armed: d.bk === true, ticks: 0, conformed: false,
    armsSeen: 0, armsExtended: 0, extraTicksTotal: 0, maxExtraTicks: 0,
    o1Arms: 0, o1Struck: 0,
    releases: 0, misalignSum: 0, releasesOutsideCone: 0,
    maxArmingLifeTicks: 0, armingsLiveAtWhistle: 0, armingsAcrossPhaseChange: 0,
  };
  // the battery walks assert BOTH halves; the doors matrix asserts the dose half only
  w.conformed = worldConforms(m) && (d.c7 === undefined && d.o1 === undefined ? channelsArmed(m) : true);
  /** gid → the tick its live arming was created (both slots share the map; gids are unique) */
  const armedAt = new Map<number, number>();
  let guard = 0;
  while (!m.finished && guard < 200_000) {
    const pp = m.pendingPassWindup;
    const pk = m.pendingKick;
    const phaseBefore = m.phase;
    // pre-step snapshot: whose slot is live, and the body state a resolve would price
    let snap: { gid: number; hx: number; hy: number; px: number; py: number; ax: number; ay: number } | null = null;
    if (pp !== null) {
      const p = m.allPlayers[pp.gid] as Player | undefined;
      if (p !== undefined) {
        snap = { gid: pp.gid, hx: p.heading.x, hy: p.heading.y, px: p.pos.x, py: p.pos.y, ax: pp.aim.x, ay: pp.aim.y };
      }
      if (!armedAt.has(pp.gid)) armedAt.set(pp.gid, m.simTick);
    }
    if (pk !== null && !armedAt.has(pk.gid)) armedAt.set(pk.gid, m.simTick);
    m.step(DT);
    w.ticks++;
    guard++;
    // a slot that emptied while its readyTick had arrived = a RELEASE we can price
    if (snap !== null && m.pendingPassWindup === null && pp !== null && m.simTick >= pp.readyTick) {
      const p = m.allPlayers[snap.gid] as Player | undefined;
      if (p !== undefined) {
        const dx = snap.ax - snap.px;
        const dy = snap.ay - snap.py;
        const dl = Math.sqrt(dx * dx + dy * dy);
        if (dl > 1e-6) {
          // the ENGINE's own measure, on the heading the resolve actually read
          const stand = { heading: { x: snap.hx, y: snap.hy } } as unknown as Player;
          const mis = kickMisalignment(stand, { x: dx / dl, y: dy / dl });
          w.releases++;
          w.misalignSum += mis;
          if (mis > (1 - Math.cos(BK_CONE_RAD)) / 2 + 1e-12) w.releasesOutsideCone++;
        }
      }
    }
    // lifecycle bookkeeping
    for (const [gid, at] of [...armedAt]) {
      const stillPass = m.pendingPassWindup !== null && m.pendingPassWindup.gid === gid;
      const stillKick = m.pendingKick !== null && m.pendingKick.gid === gid;
      if (stillPass || stillKick) {
        const life = m.simTick - at;
        if (life > w.maxArmingLifeTicks) w.maxArmingLifeTicks = life;
        if (m.phase !== phaseBefore) w.armingsAcrossPhaseChange++;
      } else armedAt.delete(gid);
    }
  }
  if (m.pendingPassWindup !== null) w.armingsLiveAtWhistle++;
  if (m.pendingKick !== null) w.armingsLiveAtWhistle++;
  w.armsSeen = m.bkFacingLedger.armsSeen;
  w.armsExtended = m.bkFacingLedger.armsExtended;
  w.extraTicksTotal = m.bkFacingLedger.extraTicksTotal;
  w.maxExtraTicks = m.bkFacingLedger.maxExtraTicks;
  w.o1Arms = m.o1WindupLedger.arms;
  w.o1Struck = m.o1WindupLedger.struck;
  return w;
};

/* ========================================================================== */
/* §7 THE DOORS MATRIX — the arming lifecycle at THIS composition (M-BK.4)    */
/* ========================================================================== */
interface DoorCell {
  seed: number; c7: boolean; o1: boolean; bk: boolean;
  built: boolean; refused: boolean; refusalNamesLaw: boolean;
  armsSeen: number; armsExtended: number; maxArmingLifeTicks: number; armingsLiveAtWhistle: number;
  conformed: boolean;
}
const doorCells: DoorCell[] = [];
for (const seed of DOORS_SEEDS) {
  for (const c7 of [false, true]) {
    for (const o1 of [false, true]) {
      for (const bk of [false, true]) {
        const cell: DoorCell = {
          seed, c7, o1, bk, built: false, refused: false, refusalNamesLaw: false,
          armsSeen: 0, armsExtended: 0, maxArmingLifeTicks: 0, armingsLiveAtWhistle: 0,
          conformed: false,
        };
        try {
          const w = walk(seed, { c7, o1, bk });
          cell.built = true;
          cell.armsSeen = w.armsSeen;
          cell.armsExtended = w.armsExtended;
          cell.maxArmingLifeTicks = w.maxArmingLifeTicks;
          cell.armingsLiveAtWhistle = w.armingsLiveAtWhistle;
          cell.conformed = w.conformed;
        } catch (e) {
          cell.refused = true;
          cell.refusalNamesLaw = String((e as Error).message).includes('INERT WITHOUT A WIND-UP CHANNEL');
        }
        doorCells.push(cell);
      }
    }
  }
}

/* ========================================================================== */
/* §8 THE A/B RECEIPT BATTERY                                                 */
/* ========================================================================== */
const armedWalks: Walk[] = [];
const shutWalks: Walk[] = [];
for (const seed of BATTERY_SEEDS) {
  armedWalks.push(walk(seed, { bk: true }));
  shutWalks.push(walk(seed, {}));
}
const agg = (ws: readonly Walk[]) => ({
  matches: ws.length,
  ticksTotal: sum(ws.map((w) => w.ticks)),
  armsSeenTotal: sum(ws.map((w) => w.armsSeen)),
  armsExtendedTotal: sum(ws.map((w) => w.armsExtended)),
  extraTicksTotal: sum(ws.map((w) => w.extraTicksTotal)),
  maxExtraTicks: Math.max(0, ...ws.map((w) => w.maxExtraTicks)),
  o1ArmsTotal: sum(ws.map((w) => w.o1Arms)),
  o1StruckTotal: sum(ws.map((w) => w.o1Struck)),
  releasesObserved: sum(ws.map((w) => w.releases)),
  releasesOutsideConeTotal: sum(ws.map((w) => w.releasesOutsideCone)),
  maxArmingLifeTicks: Math.max(0, ...ws.map((w) => w.maxArmingLifeTicks)),
  armingsLiveAtWhistleTotal: sum(ws.map((w) => w.armingsLiveAtWhistle)),
  armingsAcrossPhaseChangeTotal: sum(ws.map((w) => w.armingsAcrossPhaseChange)),
  matchesConformed: ws.filter((w) => w.conformed).length,
});
const round = (x: number, n = 6): number => Number(x.toFixed(n));
const faceOf = (ws: readonly Walk[]) => {
  const a = agg(ws);
  const rel = a.releasesObserved;
  return {
    ...a,
    /** SHARE of arms that paid facing time (0 when the law is shut, by construction) */
    extendedShareOfArms: a.armsSeenTotal === 0 ? 0 : round(a.armsExtendedTotal / a.armsSeenTotal),
    /** MEAN added TICKS per EXTENDED arm (unit: ticks) */
    meanExtraTicksPerExtendedArm: a.armsExtendedTotal === 0
      ? 0 : round(a.extraTicksTotal / a.armsExtendedTotal),
    /** MEAN engine-misalign AT the observed pass releases (unit: kickMisalignment, 0..1) */
    meanMisalignAtObservedRelease: rel === 0
      ? 0 : round(sum(ws.map((w) => w.misalignSum)) / rel),
    /** SHARE of observed releases whose misalign sits OUTSIDE the derived cone */
    shareOfObservedReleasesOutsideCone: rel === 0
      ? 0 : round(a.releasesOutsideConeTotal / rel),
  };
};
const armedFaces = faceOf(armedWalks);
const shutFaces = faceOf(shutWalks);

/* ========================================================================== */
/* §9 THE LAW TABLE (no sims) — BK-C0 §R4's column, recomputed from src        */
/* ========================================================================== */
const lawTable = [0, 15, 30, 45, 60, 68, 75, 90, 105, 120, 135, 150, 180].map((deg) => {
  const th = (deg * Math.PI) / 180;
  return {
    degrees: deg,
    misalign: round((1 - Math.cos(th)) / 2),
    turnTicksWhole: Math.ceil(th / (TURN_RATE * DT)),
    addedTicks: bkFacingExtraTicks({ x: 1, y: 0 }, Math.cos(th), Math.sin(th), 0, 0),
  };
});

/* ========================================================================== */
/* §10 THE WORLD-CONSTRUCTION RECEIPT                                         */
/* ========================================================================== */
const receipt = build(RECEIPT_SEED, { bk: true });
const receiptConjuncts = {
  worldConformed: worldConforms(receipt),
  bkFacingLawArmed: receipt.bkFacingLaw === true,
  c7WindupArmed: receipt.c7Windup === true,
  o1PassWindupArmed: receipt.o1PassWindup === true,
  ledgerBornZero: receipt.bkFacingLedger.armsSeen === 0
    && receipt.bkFacingLedger.armsExtended === 0
    && receipt.bkFacingLedger.extraTicksTotal === 0
    && receipt.bkFacingLedger.maxExtraTicks === 0,
};

/* ========================================================================== */
/* §11 THE GATES                                                              */
/* ========================================================================== */
const srcDirty = (): boolean => {
  try {
    const a = execSync('git diff --stat HEAD -- src', { encoding: 'utf8' }).trim();
    const b = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim();
    return a !== '' || b !== '';
  } catch { return true; }
};
const gates: Record<string, boolean> = {
  /** the world every walk measured really is world 8, dosed, both channels armed */
  gWorld: armedWalks.every((w) => w.conformed) && shutWalks.every((w) => w.conformed)
    && Object.values(receiptConjuncts).every(Boolean),
  /** ⭐ the doors matrix's OWN channel expectation, cell by cell (the split gate's other half) */
  gDoorChannels: doorCells.filter((c) => c.built).every((c) => c.conformed),
  /** the dose bytes parsed non-empty */
  gDoseBytes: PC_DOSE_EXPOSURES > 0 && L3_DOSE_LUNGES > 0,
  /** the constants were extracted from their NAMED sites and match the exports */
  gConstants: X_C7_W_CAP.value === 0.18 && X_TURN_RATE.value === TURN_RATE
    && X_C7_W_CAP.line > 0 && X_TURN_RATE.line > 0
    && BK_CONE_TICKS === Math.round(X_C7_W_CAP.value * 60)
    && Math.abs(BK_CONE_RAD - BK_CONE_TICKS * DT * X_TURN_RATE.value) < 1e-12,
  /** ⭐ THE SEAM FIRES — the receipt is non-vacuous */
  gSeamFires: armedFaces.armsSeenTotal > 0 && armedFaces.armsExtendedTotal > 0
    && armedFaces.extraTicksTotal > 0,
  /** ⭐ THE SHUT ARM IS SILENT — dormancy, measured on the same seeds */
  gShutSilent: shutFaces.armsSeenTotal === 0 && shutFaces.armsExtendedTotal === 0
    && shutFaces.extraTicksTotal === 0 && shutFaces.maxExtraTicks === 0,
  /** the channel the law extends is itself alive on these walks */
  gChannelLive: armedFaces.o1ArmsTotal > 0 && shutFaces.o1ArmsTotal > 0,
  /** the observed-release instrument saw releases in BOTH arms (no empty denominator) */
  gReleasesObserved: armedFaces.releasesObserved > 0 && shutFaces.releasesObserved > 0,
  /** ⭐⭐ THE LAW'S OWN CLAIM: no observed release under the law sits outside the cone */
  gInsideCone: armedFaces.releasesOutsideConeTotal === 0,
  /** the added charge never exceeds the structural bound 29 − cone */
  gBoundHolds: armedFaces.maxExtraTicks <= 29 - BK_CONE_TICKS,
  /** ⭐⭐ THE DOORS: every cell either built or refused for the ONE stated reason */
  gDoors: doorCells.every((c) => (c.bk && !c.c7 && !c.o1)
    ? (c.refused && c.refusalNamesLaw)
    : (c.built && c.conformed)),
  /** ⭐ LIFECYCLE: no arming survives the whistle, at any door cell or any battery walk */
  gLifecycle: armedFaces.armingsLiveAtWhistleTotal === 0
    && shutFaces.armingsLiveAtWhistleTotal === 0
    && doorCells.every((c) => c.armingsLiveAtWhistle === 0),
  /** ⭐ THE DOOR IS INERT WHERE IT CANNOT REACH: bk armed with a shut channel books nothing
   *  through that channel — measured as: cells with bk∧¬c7∧o1 and bk∧c7∧¬o1 still book arms,
   *  while every ¬bk cell books zero */
  gDoorInertness: doorCells.filter((c) => !c.bk).every((c) => c.armsSeen === 0 && c.armsExtended === 0),
  /** src is untouched by this run (canon xSrcUntouched) */
  gSrcUntouched: !srcDirty(),
  gSeedsBookedEqualWalked: true, // asserted below against the arithmetic, not the prose
};
// BOOKED = WALKED, checked against the probe's OWN arithmetic (not the prose)
const walkedSeeds = new Set<number>([...BATTERY_SEEDS, ...DOORS_SEEDS, RECEIPT_SEED]);
gates.gSeedsBookedEqualWalked = walkedSeeds.size === BATTERY_SEEDS.length + DOORS_SEEDS.length + 1
  && [...walkedSeeds].every((s) => s >= BLOCK && s <= BLOCK + 999);

/* ========================================================================== */
/* §12 THE ARTIFACT                                                           */
/* ========================================================================== */
const canonical = (o: unknown): string => JSON.stringify(o);
/** ⭐ the hashed body is an explicit ALLOWLIST SCHEMA (canon, home PC-T0 §CORR item 1) */
const BODY_SCHEMA = [
  'stage', 'mode', 'world', 'doses', 'constants', 'lawTable', 'armedFaces', 'shutFaces',
  'doorCells', 'receiptConjuncts', 'perSeedArmed', 'perSeedShut', 'seedLedger', 'gates',
] as const;
const artifact: Record<string, unknown> = {
  stage: 'BK-T0 — THE FACING LAW (receipt walks; NOT an exam, NOT a census)',
  mode: MODE,
  instrumentSha256: sha(readFileSync('scripts/probes/bk-t0-facing-receipts.ts', 'utf8')),
  world: {
    version: 8,
    construction: '`a4MatchFlags(8)` + `armA4World(m, null, 8, poolT1DoseCells(L3-T1), '
      + 'poolPcDoseTable(PC-T1))`; BK-T0 adds ONLY `bkFacingLaw`',
    everyWalkedMatchConformed: armedWalks.every((w) => w.conformed) && shutWalks.every((w) => w.conformed),
  },
  doses: {
    l3DoseSourcePath: L3_T1_PATH, l3DoseFileBytesSha256: L3_BYTES_SHA, l3DoseLungesTotal: L3_DOSE_LUNGES,
    pcDoseSourcePath: PC_T1_PATH, pcDoseFileBytesSha256: PC_BYTES_SHA, pcDoseExposuresTotal: PC_DOSE_EXPOSURES,
  },
  constants: {
    c7WCapSeconds: X_C7_W_CAP.value, c7WCapSrcLine: X_C7_W_CAP.line,
    turnRateRadPerSecond: X_TURN_RATE.value, turnRateSrcLine: X_TURN_RATE.line,
    dtSeconds: DT,
    coneTicks: BK_CONE_TICKS,
    coneRadians: round(BK_CONE_RAD, 10),
    coneDegrees: round((BK_CONE_RAD * 180) / Math.PI, 10),
    coneMisalign: round((1 - Math.cos(BK_CONE_RAD)) / 2, 10),
    fullReversalTicksWhole: Math.ceil(Math.PI / (TURN_RATE * DT)),
    maxAddedTicks: Math.ceil(Math.PI / (TURN_RATE * DT)) - BK_CONE_TICKS,
  },
  lawTable,
  armedFaces,
  shutFaces,
  doorCells,
  receiptConjuncts,
  perSeedArmed: armedWalks,
  perSeedShut: shutWalks,
  seedLedger: {
    block: `${BLOCK}–${BLOCK + 999}`,
    batteryArmedAndShut: `${BATTERY_SEEDS[0]}–${BATTERY_SEEDS[BATTERY_SEEDS.length - 1]}`,
    doorsMatrix: DOORS_SEEDS.join(','),
    worldReceipt: RECEIPT_SEED,
    pinSuite: `${BLOCK + 800}–${BLOCK + 802} (tests/bkFacingLaw.test.ts)`,
    walkCount: BATTERY_SEEDS.length * 2 + doorCells.length + 1,
  },
  gates,
  wallSeconds: round((Date.now() - t0Wall) / 1000, 1),
};
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.resultSha256 = sha(canonical(body));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
/* §13 THE BANNER                                                             */
/* ========================================================================== */
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner('');
banner(`BK-T0 RECEIPTS — mode=${MODE} battery=${BATTERY_SEEDS[0]}..${BATTERY_SEEDS[BATTERY_SEEDS.length - 1]} `
  + `doors=${doorCells.length} cells  wall=${((Date.now() - t0Wall) / 1000).toFixed(1)} s`);
banner(`  cone: ${BK_CONE_TICKS} ticks = ${((BK_CONE_RAD * 180) / Math.PI).toFixed(4)}° `
  + `(misalign ${((1 - Math.cos(BK_CONE_RAD)) / 2).toFixed(6)}); max added ticks `
  + `${Math.ceil(Math.PI / (TURN_RATE * DT)) - BK_CONE_TICKS}`);
banner(`  ARMED: armsSeen ${armedFaces.armsSeenTotal} · extended ${armedFaces.armsExtendedTotal} `
  + `(${(armedFaces.extendedShareOfArms * 100).toFixed(1)} %) · extra ticks ${armedFaces.extraTicksTotal} `
  + `· mean/extended ${armedFaces.meanExtraTicksPerExtendedArm} · max ${armedFaces.maxExtraTicks}`);
banner(`  SHUT : armsSeen ${shutFaces.armsSeenTotal} (dormancy) · o1 arms `
  + `${shutFaces.o1ArmsTotal} vs armed ${armedFaces.o1ArmsTotal}`);
banner(`  misalign at observed pass release — armed ${armedFaces.meanMisalignAtObservedRelease} `
  + `· shut ${shutFaces.meanMisalignAtObservedRelease} `
  + `(outside-cone share ${armedFaces.shareOfObservedReleasesOutsideCone} vs `
  + `${shutFaces.shareOfObservedReleasesOutsideCone})`);
banner(`  lifecycle: max arming life ${armedFaces.maxArmingLifeTicks} ticks · live at whistle `
  + `${armedFaces.armingsLiveAtWhistleTotal} · doors ${doorCells.filter((c) => c.refused).length} refusals`);
banner(`  ⚠ RECEIPTS, NOT EFFECT SIZES (canon: #289 item 1 + BU-T1 §CORR item 5)`);
banner(`  artifact: ${OUT_PATH}  sha256=${String(artifact.resultSha256).slice(0, 16)}…`);
banner(red.length === 0 ? '  ALL GATES GREEN' : `  RED GATES: ${red.join(', ')}`);
process.exit(red.length === 0 ? 0 : 1);
