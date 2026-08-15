/**
 * PW T0b — THE RUNG-GRAIN WEIGHT CHOOSER: THE UNIT RECEIPTS
 * (docs/world-model/PW-T0B-WEIGHT-CHOOSER.md; contract PW-PASSWEIGHT-CONTRACT.md §2 M-PW.2;
 * design FIXED by ruling #292.4 — this probe does not design anything, it PROVES the plumbing).
 *
 * This is a BUILD slice, so the hygiene canon takes its build-slice form:
 *   * `xSrcUntouched` DOES NOT APPLY (this slice touches `src` by authorization). In its place:
 *     ⭐⭐ **xByteIdenticalOff** — the world-identity signatures of 10 bare + 10 v7-armed matches
 *     with every PW door SHUT, re-derived here and compared to the digest taken from a CLEAN
 *     `HEAD` worktree BEFORE the seam existed, plus the repo's own league fingerprint; and
 *     ⭐ **xDiffScope** — every touched file is declared, and `git diff --stat HEAD` + the
 *     untracked set must match that declaration exactly, nothing outside it.
 *   * the hashed body excludes ALL invocation context; timing and preflight facts live in the
 *     envelope BY NAME (#266.3(a), #289.1).
 *   * the mutant coverage map is DERIVED FROM THE GATE OBJECTS (#268.3(a)): every conjunct is
 *     enumerated programmatically and an uncovered one makes this probe REFUSE TO RUN (exit 3).
 *   * `gFaces` parses the SERIALIZED artifact back off disk (#287.1).
 *   * data-source guards hash FILE BYTES (#289 canon).
 *   * ⭐ PLUMBING RECEIPTS ARE NEVER EFFECT SIZES (#289 canon). Nothing in here is a football
 *     finding: PW-T1 owns every claim about what the armed world does.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2/#262.2), including the ENGINE's own doors:
 *   accepted: PWT0B_MODE (smoke|full, REQUIRED) · PWT0B_N · PWT0B_OUT · PWT0B_SKIP_FP
 * Any other `PWT0B_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override makes the
 * run a PREFLIGHT: it may never write a canonical repo path.
 *
 * RUN: PWT0B_MODE=full npx tsx scripts/probes/pw-t0b-chooser-receipts.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a LIVENESS refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells } from '../../src/game/a4World';
import { kickMisalignment, orientationPowerMul } from '../../src/sim/mechanics';
import {
  MATCH_DURATION, PASS_POWER_MAX, PASS_POWER_MIN, PASS_POWER_NOISE_K,
  PASS_POWER_EXECUTED_MAX, PASS_POWER_EXECUTED_MIN,
} from '../../src/sim/constants';
import { clamp } from '../../src/utils/math';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS                         */
/* ========================================================================== */
const ENV_WHITELIST = ['PWT0B_MODE', 'PWT0B_N', 'PWT0B_OUT', 'PWT0B_SKIP_FP'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PWT0B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('PW-T0b FATAL — refused env surface. '
    + `rogue PWT0B_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PWT0B_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`PW-T0b FATAL — PWT0B_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.PWT0B_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PWT0B_N, 10)) : null;
const OUT_ENV = process.env.PWT0B_OUT;
const SKIP_FP = process.env.PWT0B_SKIP_FP === '1';
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PWT0B_N'] : []),
  ...(OUT_ENV !== undefined ? ['PWT0B_OUT'] : []),
  ...(SKIP_FP ? ['PWT0B_SKIP_FP'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pw-t0b-chooser-receipts-smoke.json',
  full: 'docs/world-model/data/pw-t0b-chooser-receipts.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pw-t0b-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner('PW-T0b FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 SMALL HELPERS                                                            */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 THE FROZEN DESIGN — seeds, the declared src scope, the dormancy baselines */
/* ========================================================================== */
const DT = 1 / 60;
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const CHOOSER_PATH = 'src/ai/passWeightChooser.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const CHOICE_PATH = 'src/ai/perceivedPassChoice.ts';
const OPT_PATH = 'src/ai/passOptionValue.ts';

/**
 * ⭐ THE PRE-SLICE HEAD — the commit this stage was dispatched from (ruling #292). The diff-scope
 * receipt is taken against IT, not against `HEAD`, so the gate keeps telling the truth after the
 * seam is committed (a `git diff HEAD` receipt would go silently empty the moment it lands).
 */
const PRE_SLICE_HEAD = 'fa35af4f363f0787a6960a88be83b10a7dd59577';

/** ⭐ THE DECLARED SRC SCOPE OF THIS SLICE — the whole of it, nothing else may move. */
const DECLARED_SRC_SCOPE: readonly string[] = [CHOOSER_PATH, BRAIN_PATH, MATCH_PATH];

/**
 * ⭐⭐ THE DORMANCY BASELINE, taken from a CLEAN `HEAD` WORKTREE (`git worktree add /tmp/pw-base
 * HEAD`) BEFORE this seam existed, with the identical signature function reproduced below:
 * 10 bare + 10 v7-armed matches walked to completion on seeds 12,492,900–909, every 37th tick
 * sampling ball state + all 12 bodies, pooled into one digest. This is the hard gate.
 */
const WORLD_IDENTITY_SEEDS: readonly number[] = Array.from({ length: 10 }, (_, i) => 12_492_900 + i);
const WORLD_IDENTITY_POOLED_AT_HEAD =
  '5dafce81dfc26677147d6734c10118cfcff40b771c117da011a04eb44fc1f70c';
/** the repo's own league fingerprint (ARCHITECTURE invariant 2), unmoved since CB-T2 banked it */
const LEAGUE_FINGERPRINT_SEED = 1337;
const LEAGUE_FINGERPRINT_SEASONS = 2;
const LEAGUE_FINGERPRINT_AT_HEAD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const SMOKE_BASE = 12_492_000;
const SMOKE_N = 6;
const RECEIPT_BASE = 12_492_100;
const RECEIPT_N_FROZEN = 8; // 4 without the O1 wind-up, 4 with it
const GUARD_BASE = 12_492_040;
const GUARD_SPAN = 20;
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'BU-C0 … BU-T1 bands (#285.2–#289)', range: [12_486_000, 12_489_999] },
  { name: 'PW-C0 weight-physics census (#290.3/#291)', range: [12_490_000, 12_490_999] },
  { name: 'PW-T0a preference census (#291.6/#292)', range: [12_491_000, 12_491_999] },
];
const BLOCK: readonly [number, number] = [12_492_000, 12_492_999];
/** ⭐ NO CI IS DRAWN IN THIS SLICE — it is a plumbing proof. The stats stream is UNCONSUMED. */
const STATS_FLOOR_FROM_RULING = 112_800;
const STATS_DRAWS = 0;

const N_RUN = N_ENV ?? (MODE === 'smoke' ? 2 : RECEIPT_N_FROZEN);
const RECEIPT_SEEDS = Array.from({ length: N_RUN }, (_, i) => RECEIPT_BASE + i);
const SMOKE_SEEDS = Array.from(
  { length: MODE === 'smoke' ? 2 : SMOKE_N }, (_, i) => SMOKE_BASE + i,
);

/* ========================================================================== */
/* §3 THE ARM — CONSTRUCTED DIRECTLY WITH matchFlags (#283.2(iv))              */
/* ========================================================================== */
const L3_WORLD_VERSION = 7 as const;
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const T1_BYTES = readFileSync(T1_PATH, 'utf8');
const DOSE = poolT1DoseCells(JSON.parse(T1_BYTES) as Record<string, unknown>);
const DOSE_FILE_BYTES_SHA = sha(T1_BYTES);
const DOSE_REDERIVED_SHA = (() => {
  const cc = JSON.parse(T1_BYTES) as Record<string, unknown>;
  delete cc.resultSha256;
  delete cc.envelope;
  return sha(canonical(cc));
})();
const L3_T1_SHA = ((JSON.parse(T1_BYTES) as Record<string, unknown>).resultSha256 ?? '') as string;

interface ArmOpts { pw?: boolean; windup?: boolean; bare?: boolean }
const makeMatch = <T extends Match>(
  seed: number, opts: ArmOpts, ctor: new (cfg: ConstructorParameters<typeof Match>[0]) => T,
): T => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  if (opts.bare === true) return new ctor({ seed, teamA, teamB });
  const m = new ctor({
    seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION),
    ...(opts.pw === true ? { pwWeightChooser: true } : {}),
    ...(opts.windup === true ? { o1PassWindup: true } : {}),
  });
  armA4World(m, null, L3_WORLD_VERSION, DOSE);
  return m;
};

/* ========================================================================== */
/* §4 ⭐⭐ THE WORLD-IDENTITY SIGNATURE — reproduced VERBATIM from the baseline  */
/* ========================================================================== */
const signature = (seed: number, armed: boolean): string => {
  const m = makeMatch(seed, { bare: !armed }, Match);
  const trace: number[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
      for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
    }
  }
  const r = m.getResult();
  return sha(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)),
    score: r.score, stats: r.stats, events: r.events.length, ticks,
  }));
};

/* ========================================================================== */
/* §5 THE TRACED MATCH — the strike-side receipt, captured at the strike itself */
/* ========================================================================== */
interface StrikeRow {
  tick: number;
  passerGid: number;
  mateGid: number;
  /** what the chooser deposited (or the wind-up carried) — the INTENDED weight */
  intended: number;
  /** whether the strike came out of a wound-up ball */
  fromWindup: boolean;
  orientation: number;
  executedRederived: number;
  expectedSpeed: number;
  observedSpeed: number;
  relError: number;
  /** the honest control: what the SAME strike would have left the boot at, at weight 1 */
  speedAtWeightOne: number;
}
const dist2 = (a: Readonly<V2>, b: Readonly<V2>): number => Math.hypot(a.x - b.x, a.y - b.y);

class TracedMatch extends Match {
  readonly strikes: StrikeRow[] = [];
  readonly windupPowers: number[] = [];
  override performPass(
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<V2> | null = null,
  ): void {
    // The engine's own guard: no strike, no receipt row.
    const willStrike = this.ball.owner === p && p.kickCooldown <= 0;
    const deposit = this.pwStrikePower;
    const intended = clamp(
      this.pwWeightChooser && deposit !== null && deposit.gid === p.gid
        && deposit.tick === this.simTick
        ? deposit.power : powerChoice,
      PASS_POWER_MIN, PASS_POWER_MAX,
    );
    const passerPos = { x: p.pos.x, y: p.pos.y };
    const heading = { x: p.heading.x, y: p.heading.y };
    const matePos = { x: mate.pos.x, y: mate.pos.y };
    const mateVel = { x: mate.vel.x, y: mate.vel.y };
    const passing = p.attrs.passing;
    const rngState = (this.rng as unknown as { s: number }).s;
    const tick = this.simTick;
    super.performPass(p, mate, offsideExempt, powerChoice, ptpLead);
    if (!willStrike || ptpLead !== null) return;
    // ⭐ THE RE-DERIVATION. Every ingredient is the ENGINE'S OWN exported function or constant
    // (`kickMisalignment`, `orientationPowerMul`, `PASS_POWER_NOISE_K`, the executed clamp, the
    // launch law); only the COMPOSITION is restated, and the gate demands it match to 1e-12 —
    // a restatement that must agree to the bit is a trace, not a parallel oracle.
    const dx = matePos.x - passerPos.x;
    const dy = matePos.y - passerPos.y;
    const dl = Math.hypot(dx, dy);
    if (!(dl > 1e-9)) return;
    // the ENGINE'S OWN misalignment function, read with the pre-strike heading
    const misalign = kickMisalignment(
      { heading } as Player, { x: dx / dl, y: dy / dl },
    );
    const orientation = orientationPowerMul(misalign, passing);
    let executed = 1;
    if (intended !== 1) {
      // a CLONE of the engine's rng at its pre-strike state — no draw is consumed here.
      const clone = new Rng(1);
      (clone as unknown as { s: number }).s = rngState;
      const g = clone.gaussian();
      executed = clamp(
        intended + g * Math.abs(intended - 1) * PASS_POWER_NOISE_K * (1.35 - passing),
        PASS_POWER_EXECUTED_MIN, PASS_POWER_EXECUTED_MAX,
      );
    }
    const flight = dl / (16 * orientation * intended);
    const lead = {
      x: matePos.x + mateVel.x * flight * 0.8, y: matePos.y + mateVel.y * flight * 0.8,
    };
    const d = dist2(passerPos, lead);
    const base = clamp(d * 0.6 + 8.2, 9, 22);
    const expectedSpeed = base * orientation * executed;
    const observedSpeed = Math.hypot(this.ball.vel.x, this.ball.vel.y);
    // the weight-1 control uses the weight-1 lead, exactly as the engine would have led it
    const flightOne = dl / (16 * orientation);
    const leadOne = {
      x: matePos.x + mateVel.x * flightOne * 0.8, y: matePos.y + mateVel.y * flightOne * 0.8,
    };
    this.strikes.push({
      tick,
      passerGid: p.gid,
      mateGid: mate.gid,
      intended,
      fromWindup: false, // stamped by the walk loop from the engine's OWN wind-up ledger
      orientation,
      executedRederived: executed,
      expectedSpeed,
      observedSpeed,
      relError: expectedSpeed === 0 ? 1 : Math.abs(observedSpeed - expectedSpeed) / expectedSpeed,
      speedAtWeightOne: clamp(dist2(passerPos, leadOne) * 0.6 + 8.2, 9, 22) * orientation,
    });
  }
}
/* The wind-up resolution is private, so provenance is stamped through the public step: a row is
 * `fromWindup` when the engine's own wind-up ledger advanced its `struck` counter this tick. */

interface WalkOut {
  seed: number;
  windup: boolean;
  armedVersion: number;
  pwLive: boolean;
  duration: number;
  strikes: StrikeRow[];
  ledger: Record<string, number | number[]>;
  o1Struck: number;
}
const walkArmed = (seed: number, windup: boolean): WalkOut => {
  const m = makeMatch(seed, { pw: true, windup }, TracedMatch);
  const armedVersion = a4ArmedVersion(m);
  let prevStruck = 0;
  while (!m.finished) {
    const before = m.o1WindupLedger.struck;
    const nBefore = m.strikes.length;
    m.step(DT);
    if (m.o1WindupLedger.struck > before) {
      for (let i = nBefore; i < m.strikes.length; i++) {
        (m.strikes[i] as { fromWindup: boolean }).fromWindup = true;
      }
    }
    prevStruck = m.o1WindupLedger.struck;
  }
  const led = m.pwChooserLedger;
  return {
    seed,
    windup,
    armedVersion,
    pwLive: m.pwWeightChooser,
    duration: m.duration,
    strikes: m.strikes,
    ledger: {
      decisions: led.decisions,
      pairsAsked: led.pairsAsked,
      chosenByRung: [...led.chosenByRung],
      pairsAdmittedOnlyOffReference: led.pairsAdmittedOnlyOffReference,
      matesAdmittedOnlyOffReference: led.matesAdmittedOnlyOffReference,
      pairsDroppedForOtherRungRefusal: led.pairsDroppedForOtherRungRefusal,
      pairsLive: led.pairsLive,
      matesLive: led.matesLive,
      pairsLiveOnlyOffReference: led.pairsLiveOnlyOffReference,
      matesLiveOnlyOffReference: led.matesLiveOnlyOffReference,
      struckAtChosenPower: led.struckAtChosenPower,
      windupCarried: led.windupCarried,
    },
    o1Struck: prevStruck,
  };
};

/* ========================================================================== */
/* §6 THE WALKS                                                                */
/* ========================================================================== */
const tWalk0 = Date.now();
const WALKS: WalkOut[] = [];
for (let i = 0; i < RECEIPT_SEEDS.length; i++) {
  WALKS.push(walkArmed(RECEIPT_SEEDS[i], i >= Math.ceil(RECEIPT_SEEDS.length / 2)));
}
const SMOKE_WALKS: WalkOut[] = SMOKE_SEEDS.map((s) => walkArmed(s, false));
const WALK_MS = Date.now() - tWalk0;

/* ---- the TRACE non-perturbation control: the subclass is a camera, not a lever ---- */
const traceControl = (() => {
  let ok = 0;
  let total = 0;
  for (const seed of RECEIPT_SEEDS.slice(0, 2)) {
    const plain = signature(seed, true);
    const traced = (() => {
      const m = makeMatch(seed, {}, TracedMatch);
      const trace: number[] = [];
      let ticks = 0;
      while (!m.finished && ticks < 60000) {
        m.step(DT);
        ticks++;
        if (ticks % 37 === 0) {
          trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
          for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
        }
      }
      const r = m.getResult();
      return sha(JSON.stringify({
        trace: trace.map((v) => Math.round(v * 1e9)),
        score: r.score, stats: r.stats, events: r.events.length, ticks,
      }));
    })();
    total++;
    if (plain === traced) ok++;
  }
  return { ok, total };
})();

/* ---- ⭐⭐ THE DORMANCY PROOF ---- */
const tId0 = Date.now();
const identityRows: string[] = [];
for (const s of WORLD_IDENTITY_SEEDS) identityRows.push(`bare ${s} ${signature(s, false)}`);
for (const s of WORLD_IDENTITY_SEEDS) identityRows.push(`v7 ${s} ${signature(s, true)}`);
const IDENTITY_POOLED = sha(identityRows.join('|'));
const IDENTITY_MS = Date.now() - tId0;
const LEAGUE_FP = SKIP_FP ? 'SKIPPED' : (() => {
  const out = gitOut(
    `npx tsx scripts/fingerprint.ts ${LEAGUE_FINGERPRINT_SEED} ${LEAGUE_FINGERPRINT_SEASONS}`,
  );
  const m = out.match(/sha256=([0-9a-f]{64})/);
  return m === null ? `UNPARSED:${out.slice(0, 40)}` : m[1];
})();

/* ---- G-DET: the receipt walk re-derives bit-identically ---- */
const detDigest = (): string => sha(canonical(walkArmed(RECEIPT_SEEDS[0], false)));
const digestA = detDigest();
const digestB = detDigest();

/* ========================================================================== */
/* §7 THE RECEIPTS                                                             */
/* ========================================================================== */
const ALL_STRIKES = WALKS.flatMap((w) => w.strikes);
const CHOSEN_STRIKES = ALL_STRIKES.filter((s) => s.intended !== 1);
const WINDUP_STRIKES = CHOSEN_STRIKES.filter((s) => s.fromWindup);
const MAX_REL_ERROR = ALL_STRIKES.reduce((a, s) => Math.max(a, s.relError), 0);
const MAX_REL_ERROR_CHOSEN = CHOSEN_STRIKES.reduce((a, s) => Math.max(a, s.relError), 0);
const STRIKES_DIFFERING_FROM_WEIGHT_ONE = CHOSEN_STRIKES
  .filter((s) => Math.abs(s.observedSpeed - s.speedAtWeightOne) > 1e-9).length;
const TOL = 1e-12;

const sumLed = (key: string, walks: readonly WalkOut[] = WALKS): number => walks
  .reduce((a, w) => a + (w.ledger[key] as number), 0);
const rungTotals = (walks: readonly WalkOut[]): number[] => walks
  .reduce((a, w) => (w.ledger.chosenByRung as number[]).map((v, i) => a[i] + v), [0, 0, 0]);
const RUNGS = rungTotals(WALKS);
const SMOKE_RUNGS = rungTotals(SMOKE_WALKS);
const SMOKE_DECISIONS = sumLed('decisions', SMOKE_WALKS);
const POWERS = [PASS_POWER_MIN, 1, PASS_POWER_MAX];

/* ---- ⭐ RECEIPT 6: the ×3 cost, confirmed by arithmetic, and the wall cost measured ---- */
const PAIRS_ASKED = sumLed('pairsAsked');
const PAIRS_ASKED_DIVISIBLE_BY_RUNGS = PAIRS_ASKED % POWERS.length === 0;
const PER_DECISION_ORACLE_CALLS = sumLed('decisions') === 0 ? 0 : PAIRS_ASKED / sumLed('decisions');

/* ---- ⭐ RECEIPT 3: THE TERM-LIST DIFF (#291.5 canon — never evaluate shared expressions) ---- */
const bodyOf = (src: string, header: string): string => {
  const at = src.indexOf(header);
  if (at < 0) return '';
  let depth = 0;
  let started = false;
  for (let i = at; i < src.length; i++) {
    if (src[i] === '{') { depth++; started = true; }
    if (src[i] === '}') {
      depth--;
      if (started && depth === 0) return src.slice(at, i + 1);
    }
  }
  return '';
};
const identifiersOf = (body: string): string[] => Array.from(
  new Set((body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
    .match(/[A-Za-z_$][A-Za-z0-9_$]*/g) ?? [])),
).sort();
const CHOOSER_SRC = readFileSync(CHOOSER_PATH, 'utf8');
const CHOICE_SRC = readFileSync(CHOICE_PATH, 'utf8');
const OPT_SRC = readFileSync(OPT_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const FLAGGED_TERMS = identifiersOf(bodyOf(CHOOSER_SRC, 'export function choosePassWeight'));
const PRODUCTION_TERMS = identifiersOf(bodyOf(CHOICE_SRC, 'export function pricePassOption'));
// the orientation family, assembled at run time so the scan cannot self-match on its own literal
const ORI_IDENT = ['orientation', 'PowerMul'].join('');
const ORIENTATION_IN_FLAGGED = FLAGGED_TERMS.some((t) => t.toLowerCase().includes('orientation'));
const ORIENTATION_IN_PRODUCTION = PRODUCTION_TERMS.some((t) => t.toLowerCase().includes('orientation'));
const ORIENTATION_ABSENT_FROM_SHIPPED_PRICERS = !CHOICE_SRC.includes(ORI_IDENT)
  && !OPT_SRC.includes(ORI_IDENT);
const FLAGGED_ONLY_TERMS = FLAGGED_TERMS.filter((t) => !PRODUCTION_TERMS.includes(t));
/** the production pricer's own power argument, read out of its source rather than asserted */
const PRODUCTION_PRICES_AT_ONE = /powerMultiplier:\s*1\b/.test(CHOICE_SRC);

/* ---- the SEAM SINGULARITY receipts, read out of src ---- */
const CHOOSER_CALL_SITES = (BRAIN_SRC.match(/choosePassWeight\(/g) ?? []).length;
const DEPOSIT_SITES = (BRAIN_SRC.match(/match\.pwStrikePower = /g) ?? []).length;
const CONSUME_SITES = (MATCH_SRC.match(/this\.pwStrikePower = null;/g) ?? []).length;
const REDEPOSIT_SITES = (MATCH_SRC.match(/this\.pwStrikePower = \{/g) ?? []).length;
const FLAG_READS_IN_BRAIN = (BRAIN_SRC.match(/match\.pwWeightChooser/g) ?? []).length;
/** ⭐ the CB seat's arming block is NOT in this diff — the S∧¬T guard debt does not fall due */
const CB_ARMING_BLOCK = bodyOf(BRAIN_SRC, 'if (cbSeat !== null) {');
const CB_ARMING_BLOCK_MENTIONS_PW = /pw[A-Z]/.test(CB_ARMING_BLOCK);

/* ---- ⭐ THE DIFF SCOPE RECEIPT ---- */
const DIFF_STAT = gitOut(`git diff --stat ${PRE_SLICE_HEAD} -- src`);
const DIFF_NAMES = gitOut(`git diff --name-only ${PRE_SLICE_HEAD} -- src`)
  .split('\n').filter((s) => s !== '');
const UNTRACKED = gitOut('git ls-files --others --exclude-standard -- src')
  .split('\n').filter((s) => s !== '');
const TOUCHED = Array.from(new Set([...DIFF_NAMES, ...UNTRACKED])).sort();
const SCOPE_MATCHES = canonical(TOUCHED) === canonical([...DECLARED_SRC_SCOPE].sort());

/* ---- the canary ladder, EXTRACTED from src rather than typed ---- */
const CANARY_LINE = BRAIN_SRC.split('\n')
  .findIndex((l) => l.includes('const PASS_CANARY_POWERS')) + 1;
const CANARY_LITERAL = BRAIN_SRC.split('\n')[CANARY_LINE - 1]?.trim() ?? '';
const CANARY_IS_THE_SUBSTRATE_LADDER =
  CANARY_LITERAL.includes('PASS_POWER_MIN') && CANARY_LITERAL.includes('PASS_POWER_MAX');
const WINDUP_RESOLVE_LINE = MATCH_SRC.split('\n')
  .findIndex((l) => l.includes('this.performPass(passer, mate, pp.offsideExempt)')) + 1;

/* ---- ⭐ the ARMS receipt ---- */
const ARM_OK = WALKS.filter((w) => w.armedVersion === L3_WORLD_VERSION && w.pwLive).length;
const CLOCK_OK = [...WALKS, ...SMOKE_WALKS].filter((w) => w.duration === MATCH_DURATION).length;

/* ========================================================================== */
/* §8 THE GATE REGISTRY                                                        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string;
  fn: (i: I) => Conj;
  input: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): void => { REGISTRY.push(spec as unknown as GateSpec<never>); };
const runMutant = <I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult => {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base).filter((k) => k !== conjunct)
    .every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
};

/* ---- 1 gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: digestA === digestB, digest: digestA },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second walk differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- 2 ⭐⭐ xByteIdenticalOff — THE HARD GATE (this slice's replacement for xSrcUntouched) ---- */
registerGate<{ pooled: string; rows: number; league: string; skipped: boolean }>({
  name: 'xByteIdenticalOff',
  fn: (i) => ({
    theFlagsOffWorldsRederiveTheCleanHeadDigest: i.pooled === WORLD_IDENTITY_POOLED_AT_HEAD,
    bothWorldFamiliesWereWalked: i.rows === WORLD_IDENTITY_SEEDS.length * 2,
    theLeagueFingerprintIsUnmoved: i.skipped || i.league === LEAGUE_FINGERPRINT_AT_HEAD,
  }),
  input: { pooled: IDENTITY_POOLED, rows: identityRows.length, league: LEAGUE_FP, skipped: SKIP_FP },
  mutants: [
    { conjunct: 'theFlagsOffWorldsRederiveTheCleanHeadDigest', name: 'a flags-off world moved', mutate: (i) => ({ ...i, pooled: 'deadbeef' }) },
    { conjunct: 'bothWorldFamiliesWereWalked', name: 'a world family went unwalked', mutate: (i) => ({ ...i, rows: 1 }) },
    { conjunct: 'theLeagueFingerprintIsUnmoved', name: 'the league fingerprint moved', mutate: (i) => ({ ...i, league: 'deadbeef', skipped: false }) },
  ],
});

/* ---- 3 ⭐ xDiffScope — every touched file declared, nothing outside the declared set ---- */
registerGate<{ touched: readonly string[]; matches: boolean; stat: string }>({
  name: 'xDiffScope',
  fn: (i) => ({
    theTouchedSetIsExactlyTheDeclaredScope: i.matches,
    theScopeIsNonEmptyAndBounded: i.touched.length === DECLARED_SRC_SCOPE.length,
    theDiffStatWasActuallyRead: i.stat !== 'GIT-FAILED',
  }),
  input: { touched: TOUCHED, matches: SCOPE_MATCHES, stat: DIFF_STAT },
  mutants: [
    { conjunct: 'theTouchedSetIsExactlyTheDeclaredScope', name: 'a file outside the scope moved', mutate: (i) => ({ ...i, matches: false }) },
    { conjunct: 'theScopeIsNonEmptyAndBounded', name: 'the touched set changed size', mutate: (i) => ({ ...i, touched: [] }) },
    { conjunct: 'theDiffStatWasActuallyRead', name: 'git never answered', mutate: (i) => ({ ...i, stat: 'GIT-FAILED' }) },
  ],
});

/* ---- 4 gArms ---- */
registerGate<{ ok: number; total: number; clock: number; clockTotal: number }>({
  name: 'gArms',
  fn: (i) => ({
    everyReceiptWalkIsTheV7WorldWithTheDoorLive: i.ok === i.total,
    theEngineClockIsTheDefaultOnEveryWalk: i.clock === i.clockTotal,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: {
    ok: ARM_OK, total: WALKS.length, clock: CLOCK_OK, clockTotal: WALKS.length + SMOKE_WALKS.length,
  },
  mutants: [
    { conjunct: 'everyReceiptWalkIsTheV7WorldWithTheDoorLive', name: 'a walk was not the armed v7 world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theEngineClockIsTheDefaultOnEveryWalk', name: 'a walk ran an overridden clock', mutate: (i) => ({ ...i, clock: i.clock - 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 5 gDose — #289 canon: hash the FILE BYTES, re-derive the digest from them ---- */
registerGate<{ rederived: string; bytes: string; groups: number }>({
  name: 'gDose',
  fn: (i) => ({
    theDoseArtifactsOwnBytesRederiveTheShippedDigest: i.rederived === L3_T1_SHA,
    theBytesWereActuallyHashed: i.bytes.length === 64,
    theDoseHasBothArrivalGroups: i.groups === 2,
  }),
  input: { rederived: DOSE_REDERIVED_SHA, bytes: DOSE_FILE_BYTES_SHA, groups: DOSE.length },
  mutants: [
    { conjunct: 'theDoseArtifactsOwnBytesRederiveTheShippedDigest', name: 'the exam artifact bytes were swapped', mutate: (i) => ({ ...i, rederived: 'deadbeef' }) },
    { conjunct: 'theBytesWereActuallyHashed', name: 'the byte hash was never taken', mutate: (i) => ({ ...i, bytes: '' }) },
    { conjunct: 'theDoseHasBothArrivalGroups', name: 'a group went missing', mutate: (i) => ({ ...i, groups: 1 }) },
  ],
});

/* ---- 6 ⭐⭐ gStrike — RECEIPT 1: the chosen power ACTUALLY STRIKES ---- */
registerGate<{
  maxErr: number; maxErrChosen: number; chosen: number; total: number; differing: number;
}>({
  name: 'gStrike',
  fn: (i) => ({
    everyStrikeRederivesFromOrientationTimesExecutedPower: i.maxErr <= TOL,
    theChosenWeightStrikesToTheSameTolerance: i.maxErrChosen <= TOL,
    theChosenStrikesLeaveTheBootAtADifferentPaceThanWeightOne: i.differing === i.chosen,
    nonVacuousStrikeCount: i.total > 0 && i.chosen > 0,
  }),
  input: {
    maxErr: MAX_REL_ERROR, maxErrChosen: MAX_REL_ERROR_CHOSEN, chosen: CHOSEN_STRIKES.length,
    total: ALL_STRIKES.length, differing: STRIKES_DIFFERING_FROM_WEIGHT_ONE,
  },
  mutants: [
    { conjunct: 'everyStrikeRederivesFromOrientationTimesExecutedPower', name: 'a strike did not re-derive', mutate: (i) => ({ ...i, maxErr: 1 }) },
    { conjunct: 'theChosenWeightStrikesToTheSameTolerance', name: 'a CHOSEN strike did not re-derive', mutate: (i) => ({ ...i, maxErrChosen: 1 }) },
    { conjunct: 'theChosenStrikesLeaveTheBootAtADifferentPaceThanWeightOne', name: 'a chosen strike was indistinguishable from weight 1', mutate: (i) => ({ ...i, differing: i.differing - 1 }) },
    { conjunct: 'nonVacuousStrikeCount', name: 'no strike was traced', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ---- 7 ⭐ gWindup — RECEIPT 2: the pendingPass CARRIES the choice ---- */
registerGate<{ carried: number; rows: number; ledger: number; struck: number }>({
  name: 'gWindup',
  fn: (i) => ({
    aWoundUpBallStrikesAtTheChosenWeight: i.rows > 0,
    theEnginesOwnLedgerAgreesWithTheTracedRows: i.ledger >= i.rows,
    theWindUpWorldActuallyResolvedPasses: i.struck > 0,
    theCarryCountIsNonVacuous: i.carried > 0,
  }),
  input: {
    carried: sumLed('windupCarried'), rows: WINDUP_STRIKES.length,
    ledger: sumLed('windupCarried'), struck: WALKS.reduce((a, w) => a + w.o1Struck, 0),
  },
  mutants: [
    { conjunct: 'aWoundUpBallStrikesAtTheChosenWeight', name: 'no wound-up ball carried a weight', mutate: (i) => ({ ...i, rows: 0 }) },
    { conjunct: 'theEnginesOwnLedgerAgreesWithTheTracedRows', name: 'the ledger fell short of the traced rows', mutate: (i) => ({ ...i, ledger: -1 }) },
    { conjunct: 'theWindUpWorldActuallyResolvedPasses', name: 'the wind-up never resolved', mutate: (i) => ({ ...i, struck: 0 }) },
    { conjunct: 'theCarryCountIsNonVacuous', name: 'the carry counter stayed zero', mutate: (i) => ({ ...i, carried: 0 }) },
  ],
});

/* ---- 8 ⭐⭐ gOrientationTermList — RECEIPT 3: the term-list diff, never a shared expression ---- */
registerGate<{
  flagged: boolean; production: boolean; shipped: boolean; atOne: boolean; only: number;
}>({
  name: 'gOrientationTermList',
  fn: (i) => ({
    theOrientationTermIsInTheFlaggedPathsTermList: i.flagged,
    theOrientationTermIsAbsentFromTheProductionPathsTermList: !i.production,
    theShippedPricersNameNoOrientationAnywhere: i.shipped,
    theProductionPricerStillPricesAtTheLiteralOne: i.atOne,
    theTermListsActuallyDiffer: i.only > 0,
  }),
  input: {
    flagged: ORIENTATION_IN_FLAGGED, production: ORIENTATION_IN_PRODUCTION,
    shipped: ORIENTATION_ABSENT_FROM_SHIPPED_PRICERS, atOne: PRODUCTION_PRICES_AT_ONE,
    only: FLAGGED_ONLY_TERMS.length,
  },
  mutants: [
    { conjunct: 'theOrientationTermIsInTheFlaggedPathsTermList', name: 'the flagged path lost its orientation term', mutate: (i) => ({ ...i, flagged: false }) },
    { conjunct: 'theOrientationTermIsAbsentFromTheProductionPathsTermList', name: 'orientation leaked into the production path', mutate: (i) => ({ ...i, production: true }) },
    { conjunct: 'theShippedPricersNameNoOrientationAnywhere', name: 'a shipped pricer gained an orientation term', mutate: (i) => ({ ...i, shipped: false }) },
    { conjunct: 'theProductionPricerStillPricesAtTheLiteralOne', name: 'the production pricer stopped pricing at 1', mutate: (i) => ({ ...i, atOne: false }) },
    { conjunct: 'theTermListsActuallyDiffer', name: 'the two term lists were identical', mutate: (i) => ({ ...i, only: 0 }) },
  ],
});

/* ---- 9 ⭐ gAdmission — RECEIPTS 4 and 5 ---- */
registerGate<{
  dropped: number; live: number; liveOff: number; matesLive: number; pairs: number;
}>({
  name: 'gAdmission',
  fn: (i) => ({
    zeroPairsWereDroppedForFailingToPriceAtAnotherRung: i.dropped === 0,
    theCensusGrainAdmissionPopulationIsNonEmpty: i.liveOff > 0,
    theLivePopulationIsNonVacuous: i.live > 0 && i.matesLive > 0,
    everyMateWasAskedAtEveryRung: i.pairs % POWERS.length === 0 && i.pairs > 0,
  }),
  input: {
    dropped: sumLed('pairsDroppedForOtherRungRefusal'), live: sumLed('pairsLive'),
    liveOff: sumLed('pairsLiveOnlyOffReference'), matesLive: sumLed('matesLive'),
    pairs: PAIRS_ASKED,
  },
  mutants: [
    { conjunct: 'zeroPairsWereDroppedForFailingToPriceAtAnotherRung', name: 'a pair inherited another rung\'s refusal', mutate: (i) => ({ ...i, dropped: 1 }) },
    { conjunct: 'theCensusGrainAdmissionPopulationIsNonEmpty', name: 'no option was live only off the reference rung', mutate: (i) => ({ ...i, liveOff: 0 }) },
    { conjunct: 'theLivePopulationIsNonVacuous', name: 'nothing was live at all', mutate: (i) => ({ ...i, live: 0, matesLive: 0 }) },
    { conjunct: 'everyMateWasAskedAtEveryRung', name: 'the enumeration was not rung-complete', mutate: (i) => ({ ...i, pairs: i.pairs + 1 }) },
  ],
});

/* ---- 10 ⭐ gPerf — RECEIPT 6: the ×3 cost confirmed, the wall cost measured ---- */
registerGate<{
  divisible: boolean; perWalkComplete: number; walks: number; walkMs: number; decisions: number;
}>({
  name: 'gPerf',
  fn: (i) => ({
    theEnumerationIsExactlyThreeOracleCallsPerMateOption: i.divisible,
    everyWalkAskedACompleteLadder: i.perWalkComplete === i.walks && i.walks > 0,
    theWallCostWasActuallyMeasured: i.walkMs > 0,
    nonVacuousDecisionCount: i.decisions > 0,
  }),
  input: {
    divisible: PAIRS_ASKED_DIVISIBLE_BY_RUNGS,
    perWalkComplete: WALKS.filter((w) => (w.ledger.pairsAsked as number) % POWERS.length === 0).length,
    walks: WALKS.length, walkMs: WALK_MS, decisions: sumLed('decisions'),
  },
  mutants: [
    { conjunct: 'theEnumerationIsExactlyThreeOracleCallsPerMateOption', name: 'the pair count stopped dividing by the ladder', mutate: (i) => ({ ...i, divisible: false }) },
    { conjunct: 'everyWalkAskedACompleteLadder', name: 'a walk asked a partial ladder', mutate: (i) => ({ ...i, perWalkComplete: i.perWalkComplete - 1 }) },
    { conjunct: 'theWallCostWasActuallyMeasured', name: 'no wall cost was taken', mutate: (i) => ({ ...i, walkMs: 0 }) },
    { conjunct: 'nonVacuousDecisionCount', name: 'no decision was made', mutate: (i) => ({ ...i, decisions: 0 }) },
  ],
});

/* ---- 11 ⭐ gSpread — RECEIPT 7: the SMOKE-grade armed sanity ---- */
registerGate<{ rungs: readonly number[]; maxShare: number; decisions: number; walks: number }>({
  name: 'gSpread',
  fn: (i) => ({
    theArmedWorldRunsAndChooses: i.decisions > 0,
    everyRungOfTheLadderIsReachedOnTheSmokeWalks: i.rungs.every((v) => v > 0),
    theDistributionIsNotOneDegenerateCorner: i.maxShare < 1,
    nonVacuousSmokeWalkCount: i.walks > 0,
  }),
  input: {
    rungs: SMOKE_RUNGS,
    maxShare: SMOKE_RUNGS.reduce((a, b) => a + b, 0) === 0 ? 1
      : Math.max(...SMOKE_RUNGS) / SMOKE_RUNGS.reduce((a, b) => a + b, 0),
    decisions: SMOKE_DECISIONS, walks: SMOKE_WALKS.length,
  },
  mutants: [
    { conjunct: 'theArmedWorldRunsAndChooses', name: 'the armed world chose nothing', mutate: (i) => ({ ...i, decisions: 0 }) },
    { conjunct: 'everyRungOfTheLadderIsReachedOnTheSmokeWalks', name: 'a rung was never chosen', mutate: (i) => ({ ...i, rungs: [0, i.rungs[1] + i.rungs[0], i.rungs[2]] }) },
    { conjunct: 'theDistributionIsNotOneDegenerateCorner', name: 'one rung took the whole distribution', mutate: (i) => ({ ...i, maxShare: 1 }) },
    { conjunct: 'nonVacuousSmokeWalkCount', name: 'no smoke walk ran', mutate: (i) => ({ ...i, walks: 0 }) },
  ],
});

/* ---- 12 gSeam — the seam is SINGULAR and the CB arming block is untouched ---- */
registerGate<{
  calls: number; deposits: number; consumes: number; redeposits: number; reads: number;
  canary: boolean; cbTouched: boolean; resolveLine: number;
}>({
  name: 'gSeam',
  fn: (i) => ({
    exactlyOneChooserCallSiteInTheBrain: i.calls === 1,
    exactlyOneDepositWriterInTheBrain: i.deposits === 1,
    theTwoConsumptionSitesAreTheStrikeAndTheArm: i.consumes === 2,
    theOneReDepositIsTheWindUpResolve: i.redeposits === 1,
    theFlagIsReadOnlyAtTheSeam: i.reads === 1,
    theLadderIsTheSubstratesOwnCanary: i.canary,
    theCbSeatArmingBlockIsUntouchedByThisSlice: !i.cbTouched,
    theWindUpResolveStatementWasLocated: i.resolveLine > 0,
  }),
  input: {
    calls: CHOOSER_CALL_SITES, deposits: DEPOSIT_SITES, consumes: CONSUME_SITES,
    redeposits: REDEPOSIT_SITES, reads: FLAG_READS_IN_BRAIN, canary: CANARY_IS_THE_SUBSTRATE_LADDER,
    cbTouched: CB_ARMING_BLOCK_MENTIONS_PW, resolveLine: WINDUP_RESOLVE_LINE,
  },
  mutants: [
    { conjunct: 'exactlyOneChooserCallSiteInTheBrain', name: 'a second chooser call site appeared', mutate: (i) => ({ ...i, calls: 2 }) },
    { conjunct: 'exactlyOneDepositWriterInTheBrain', name: 'a second deposit writer appeared', mutate: (i) => ({ ...i, deposits: 2 }) },
    { conjunct: 'theTwoConsumptionSitesAreTheStrikeAndTheArm', name: 'a consumption site vanished', mutate: (i) => ({ ...i, consumes: 1 }) },
    { conjunct: 'theOneReDepositIsTheWindUpResolve', name: 'a second re-deposit appeared', mutate: (i) => ({ ...i, redeposits: 2 }) },
    { conjunct: 'theFlagIsReadOnlyAtTheSeam', name: 'the flag gained a second reader in the brain', mutate: (i) => ({ ...i, reads: 2 }) },
    { conjunct: 'theLadderIsTheSubstratesOwnCanary', name: 'the ladder stopped being the engine\'s own', mutate: (i) => ({ ...i, canary: false }) },
    { conjunct: 'theCbSeatArmingBlockIsUntouchedByThisSlice', name: 'the CB arming block entered this diff', mutate: (i) => ({ ...i, cbTouched: true }) },
    { conjunct: 'theWindUpResolveStatementWasLocated', name: 'the wind-up release statement moved', mutate: (i) => ({ ...i, resolveLine: 0 }) },
  ],
});

/* ---- 13 gTraceNonPerturbing — the probe's camera changes nothing ---- */
registerGate<{ ok: number; total: number }>({
  name: 'gTraceNonPerturbing',
  fn: (i) => ({
    theTracedWalkIsTheQuietWalk: i.ok === i.total,
    nonVacuousControlCount: i.total > 0,
  }),
  input: traceControl,
  mutants: [
    { conjunct: 'theTracedWalkIsTheQuietWalk', name: 'the camera moved the world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousControlCount', name: 'no control walk ran', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 14 gSeed — BOOKED = WALKED ---- */
const CLAIMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'smoke', range: [SMOKE_SEEDS[0], SMOKE_SEEDS[SMOKE_SEEDS.length - 1]] },
  { name: 'guard/preflight (booked)', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: 'receipt walks', range: [RECEIPT_SEEDS[0], RECEIPT_SEEDS[RECEIPT_SEEDS.length - 1]] },
  {
    name: 'world identity',
    range: [WORLD_IDENTITY_SEEDS[0], WORLD_IDENTITY_SEEDS[WORLD_IDENTITY_SEEDS.length - 1]],
  },
];
const inBlock = CLAIMED.every((c) => c.range[0] >= BLOCK[0] && c.range[1] <= BLOCK[1]);
const disjointFromConsumed = CLAIMED.every((c) => CONSUMED
  .every((k) => c.range[1] < k.range[0] || c.range[0] > k.range[1]));
const claimedDisjoint = CLAIMED.every((a, i) => CLAIMED
  .every((b, j) => i === j || a.range[1] < b.range[0] || a.range[0] > b.range[1]));
registerGate<{ inBlock: boolean; disjoint: boolean; selfDisjoint: boolean; n: number }>({
  name: 'gSeed',
  fn: (i) => ({
    everyClaimedRangeIsInsideTheDispatchedBlock: i.inBlock,
    noClaimedRangeTouchesAConsumedBand: i.disjoint,
    theClaimedRangesAreMutuallyDisjoint: i.selfDisjoint,
    nonVacuousClaimCount: i.n > 0,
  }),
  input: {
    inBlock, disjoint: disjointFromConsumed, selfDisjoint: claimedDisjoint, n: CLAIMED.length,
  },
  mutants: [
    { conjunct: 'everyClaimedRangeIsInsideTheDispatchedBlock', name: 'a range left the block', mutate: (i) => ({ ...i, inBlock: false }) },
    { conjunct: 'noClaimedRangeTouchesAConsumedBand', name: 'a range re-used consumed seeds', mutate: (i) => ({ ...i, disjoint: false }) },
    { conjunct: 'theClaimedRangesAreMutuallyDisjoint', name: 'two claimed ranges overlapped', mutate: (i) => ({ ...i, selfDisjoint: false }) },
    { conjunct: 'nonVacuousClaimCount', name: 'nothing was claimed', mutate: (i) => ({ ...i, n: 0 }) },
  ],
});

/* ---- 15 gStats — no CI is drawn here, and the stream is left where the ruling left it ---- */
registerGate<{ draws: number; floor: number }>({
  name: 'gStats',
  fn: (i) => ({
    thisSliceDrawsNoStatsStream: i.draws === 0,
    theFloorFromTheRulingIsRecorded: i.floor === STATS_FLOOR_FROM_RULING,
  }),
  input: { draws: STATS_DRAWS, floor: STATS_FLOOR_FROM_RULING },
  mutants: [
    { conjunct: 'thisSliceDrawsNoStatsStream', name: 'a stats draw appeared', mutate: (i) => ({ ...i, draws: 1 }) },
    { conjunct: 'theFloorFromTheRulingIsRecorded', name: 'the floor was mis-recorded', mutate: (i) => ({ ...i, floor: 0 }) },
  ],
});

/* ---- 16 gEnvClean ---- */
registerGate<{ rogueOwn: number; rogueEngine: number; preflight: boolean; canonical: boolean }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnEnv: i.rogueOwn === 0,
    noEngineDoorIsSet: i.rogueEngine === 0,
    aPreflightNeverWritesACanonicalPath: !(i.preflight && i.canonical),
  }),
  input: {
    rogueOwn: rogueOwn.length, rogueEngine: rogueEngine.length, preflight: IS_PREFLIGHT,
    canonical: isCanonicalPath(OUT_PATH),
  },
  mutants: [
    { conjunct: 'noRogueOwnEnv', name: 'a rogue own env survived', mutate: (i) => ({ ...i, rogueOwn: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door survived', mutate: (i) => ({ ...i, rogueEngine: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote a canonical path', mutate: (i) => ({ ...i, preflight: true, canonical: true }) },
  ],
});

/* ---- 17 gFaces — parses the SERIALIZED artifact back off disk (#287.1) ---- */
const RECEIPT_KEYS = [
  'chosenPowerStrikes', 'windupCarried', 'orientationTermDiff', 'admission', 'refusalInheritance',
  'perDecisionOracleCalls', 'rungSpread',
] as const;
const gFacesInput = { checked: 0, bad: 1, parsed: false, keys: 0 };
registerGate<typeof gFacesInput>({
  name: 'gFaces',
  fn: (i) => ({
    theSerializedArtifactParsesBackOffDisk: i.parsed,
    everyPublishedReceiptRederivesFromTheStoredCounters: i.bad === 0,
    everyFrozenReceiptIsPublished: i.keys === RECEIPT_KEYS.length,
    nonVacuousRederivationCount: i.checked > 0,
  }),
  input: gFacesInput,
  mutants: [
    { conjunct: 'theSerializedArtifactParsesBackOffDisk', name: 'the artifact could not be re-read', mutate: (i) => ({ ...i, parsed: false }) },
    { conjunct: 'everyPublishedReceiptRederivesFromTheStoredCounters', name: 'a receipt did not re-derive', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyFrozenReceiptIsPublished', name: 'a receipt went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousRederivationCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 18 gHashEnvelope — #266.3(a) + #289.1 ---- */
const FORBIDDEN_BODY_KEYS = ['wallMs', 'walkMs', 'identityMs', 'generatedAt', 'head', 'outPath',
  'preflight', 'preflightReasons', 'mode'];
const envelopeInput = {
  crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[],
  named: FORBIDDEN_BODY_KEYS.length,
};
registerGate<typeof envelopeInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    theBodyRederivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest: i.crossOutIdentical,
    noInvocationFactIsInTheHashedBody: i.forbidden.length === 0,
    theExclusionListNamesTimingAndPreflightExplicitly:
      i.named === FORBIDDEN_BODY_KEYS.length && FORBIDDEN_BODY_KEYS.includes('preflight')
      && FORBIDDEN_BODY_KEYS.includes('wallMs') && FORBIDDEN_BODY_KEYS.includes('walkMs'),
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyRederivesItsDigestFromDisk', name: 'the artifact on disk did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest', name: 'the envelope entered the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'noInvocationFactIsInTheHashedBody', name: 'an invocation fact entered the body', mutate: (i) => ({ ...i, forbidden: ['preflight'] }) },
    { conjunct: 'theExclusionListNamesTimingAndPreflightExplicitly', name: 'the exclusion list stopped naming timing', mutate: (i) => ({ ...i, named: 0 }) },
  ],
});

/* ---- 19 gMutants ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    noUncoveredConjunctNoGhostNoDuplicate: i.uncovered.length === 0,
    everyMutantIsLive: i.dead === 0,
    nonVacuousMutantCount: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'noUncoveredConjunctNoGhostNoDuplicate', name: 'a conjunct owned no mutant', mutate: (i) => ({ ...i, uncovered: ['x'] }) },
    { conjunct: 'everyMutantIsLive', name: 'a mutant was dead', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'nonVacuousMutantCount', name: 'no mutant ran', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ========================================================================== */
/* §9 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
/* ========================================================================== */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.input));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  const seen = new Set<string>();
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
    if (seen.has(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(duplicate)`);
    seen.add(mu.conjunct);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('PW-T0b REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}
const runRegistry = (): { gates: Record<string, boolean>; mutants: MutantResult[] } => {
  const gates: Record<string, boolean> = {};
  const mutants: MutantResult[] = [];
  for (const spec of REGISTRY) {
    const base = spec.fn(spec.input);
    gates[spec.name] = Object.values(base).every(Boolean);
    for (const mu of spec.mutants) {
      mutants.push(runMutant(spec.name, mu.name, mu.conjunct, spec.fn, base, mu.mutate(spec.input)));
    }
  }
  return { gates, mutants };
};

/* ========================================================================== */
/* §10 THE ARTIFACT                                                            */
/* ========================================================================== */
const RECEIPTS = {
  chosenPowerStrikes: {
    what: '⭐ RECEIPT 1 — THE CHOSEN POWER ACTUALLY STRIKES: every traced strike\'s launch speed '
      + 'equals clamp(d·0.6+8.2, 9, 22) × orientationPowerMul × executedPassPower(chosen), with '
      + 'the execution error re-derived from a CLONE of the engine\'s own rng at its pre-strike '
      + 'state (no draw consumed). PLUMBING, never an effect size (#289).',
    strikesTraced: ALL_STRIKES.length,
    strikesAtAChosenNonDefaultWeight: CHOSEN_STRIKES.length,
    maxRelativeError: MAX_REL_ERROR,
    maxRelativeErrorOnChosenStrikes: MAX_REL_ERROR_CHOSEN,
    tolerance: TOL,
    chosenStrikesFasterOrSlowerThanTheWeightOneControl: STRIKES_DIFFERING_FROM_WEIGHT_ONE,
  },
  windupCarried: {
    what: '⭐ RECEIPT 2 — THE PENDING PASS CARRIES THE CHOICE (#291.5 correction 4): a wound-up '
      + 'ball strikes at the ARM-TIME chosen weight, not at 1.',
    windupResolutionsThatStruck: WALKS.reduce((a, w) => a + w.o1Struck, 0),
    windupStrikesCarryingANonDefaultWeight: WINDUP_STRIKES.length,
    engineLedgerWindupCarried: sumLed('windupCarried'),
    resolveStatement: `${MATCH_PATH}:${WINDUP_RESOLVE_LINE} — the certified 3-argument release, `
      + 'untouched; the weight rides the deposit/consume seam instead of the call.',
  },
  orientationTermDiff: {
    what: '⭐ RECEIPT 3 — THE ORIENTATION TERM EXISTS ONLY UNDER THE FLAG, proven by DIFFING THE '
      + 'TERM LISTS of the two code paths (#291.5 canon), never by evaluating shared expressions.',
    flaggedPath: `${CHOOSER_PATH} · choosePassWeight`,
    productionPath: `${CHOICE_PATH} · pricePassOption`,
    flaggedTermCount: FLAGGED_TERMS.length,
    productionTermCount: PRODUCTION_TERMS.length,
    orientationInFlaggedTermList: ORIENTATION_IN_FLAGGED,
    orientationInProductionTermList: ORIENTATION_IN_PRODUCTION,
    orientationAbsentFromBothShippedPricers: ORIENTATION_ABSENT_FROM_SHIPPED_PRICERS,
    productionPricerStillPricesAtLiteralOne: PRODUCTION_PRICES_AT_ONE,
    termsOnlyInTheFlaggedPath: FLAGGED_ONLY_TERMS.length,
  },
  admission: {
    what: '⭐ RECEIPT 4 — PER-RUNG ADMISSION, at BOTH grains. #292.4\'s admission clause is the '
      + 'ORACLE\'S NULL CONTRACT (the thing preferredPassPower refuses on), and that channel is '
      + 'EMPTY inside the live 6–30 m window — ground-pass range at the window\'s near edge '
      + 'already exceeds the window. So the census ladder\'s own grain (race ∧ corridor, PURE '
      + 'OBSERVATION, never a filter) is counted beside it: options LIVE only at a non-default '
      + 'rung are the population PW-T0a\'s `ref` set could not see (#292.2).',
    pairsAsked: PAIRS_ASKED,
    oracleNullGrain: {
      pairsAdmittedOnlyOffReference: sumLed('pairsAdmittedOnlyOffReference'),
      matesAdmittedOnlyOffReference: sumLed('matesAdmittedOnlyOffReference'),
    },
    censusLadderGrain: {
      pairsLive: sumLed('pairsLive'),
      matesLive: sumLed('matesLive'),
      pairsLiveOnlyOffReference: sumLed('pairsLiveOnlyOffReference'),
      matesLiveOnlyOffReference: sumLed('matesLiveOnlyOffReference'),
      shareOfLiveMatesThatAreOffReferenceOnly: sumLed('matesLive') === 0 ? Number.NaN
        : round(sumLed('matesLiveOnlyOffReference') / sumLed('matesLive')),
    },
  },
  refusalInheritance: {
    what: '⭐ RECEIPT 5 — ZERO (mate, rung) pairs dropped for failing to price at OTHER rungs. '
      + 'Each pair stands alone by construction; the count is published so the claim is a '
      + 'measurement rather than a comment.',
    pairsDroppedForOtherRungRefusal: sumLed('pairsDroppedForOtherRungRefusal'),
  },
  perDecisionOracleCalls: {
    what: '⭐ RECEIPT 6 — THE COST, MEASURED NOT ASSUMED (#292.4\'s cost note): the enumeration '
      + 'asks the oracle exactly once per (mate × rung), i.e. ×3 the shipped one-rung question. '
      + 'The wall cost is an ENVELOPE fact, named there (#289.1).',
    pairsAsked: PAIRS_ASKED,
    decisions: sumLed('decisions'),
    meanOracleCallsPerDecision: round(PER_DECISION_ORACLE_CALLS, 3),
    meanMateOptionsPerDecision: round(PER_DECISION_ORACLE_CALLS / POWERS.length, 3),
    ladderSize: POWERS.length,
  },
  rungSpread: {
    what: '⭐ RECEIPT 7 — SMOKE-GRADE ARMED SANITY (a receipt, NOT the exam: PW-T1 owns every '
      + 'claim). The armed world runs and the chosen weights are not one degenerate corner.',
    smokeWalks: SMOKE_WALKS.length,
    smokeDecisions: SMOKE_DECISIONS,
    smokeChosenByRung: SMOKE_RUNGS,
    smokeSharesByRung: SMOKE_RUNGS.map((v) => (SMOKE_DECISIONS === 0 ? Number.NaN
      : round(v / SMOKE_DECISIONS))),
    receiptWalkChosenByRung: RUNGS,
    ladder: POWERS,
  },
} as const;

/** the disk re-derivation (#287.1): the published receipts are re-computed from stored counters */
const rederiveFromDisk = (p: string): { parsed: boolean; checked: number; bad: number } => {
  let parsed = false;
  let checked = 0;
  let bad = 0;
  try {
    const f = readJson(p);
    parsed = true;
    const r = f.receipts as Record<string, Record<string, unknown>>;
    const walks = f.perWalkLedgers as Record<string, number | number[]>[];
    const sumK = (k: string): number => walks.reduce((a, w) => a + (w[k] as number), 0);
    const checkEq = (a: number, b: number): void => { checked++; if (a !== b) bad++; };
    checkEq((r.refusalInheritance.pairsDroppedForOtherRungRefusal as number),
      sumK('pairsDroppedForOtherRungRefusal'));
    checkEq((r.perDecisionOracleCalls.pairsAsked as number), sumK('pairsAsked'));
    checkEq((r.perDecisionOracleCalls.decisions as number), sumK('decisions'));
    checkEq(((r.admission.censusLadderGrain as Record<string, number>).pairsLive), sumK('pairsLive'));
    checkEq(((r.admission.censusLadderGrain as Record<string, number>).matesLiveOnlyOffReference),
      sumK('matesLiveOnlyOffReference'));
    checkEq((r.windupCarried.engineLedgerWindupCarried as number), sumK('windupCarried'));
    const strikes = f.strikeRows as StrikeRow[];
    checked++;
    if (strikes.filter((s) => s.intended !== 1).length
      !== (r.chosenPowerStrikes.strikesAtAChosenNonDefaultWeight as number)) bad++;
    checked++;
    if (Math.max(...strikes.map((s) => s.relError)) > (r.chosenPowerStrikes.tolerance as number)) bad++;
  } catch {
    parsed = false;
  }
  return { parsed, checked, bad };
};

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PW-T0b — THE RUNG-GRAIN WEIGHT CHOOSER (the dormant seam + its unit receipts)',
  doc: 'docs/world-model/PW-T0B-WEIGHT-CHOOSER.md',
  contract: 'docs/world-model/PW-PASSWEIGHT-CONTRACT.md §2 (M-PW.2 / M-PW.4); design FIXED by '
    + 'ruling #292.4; DIVERGENCE-1 routing #291.1(c); the pendingPass threading #291.5 (4); '
    + 'the heavy curve STRUCK #292.3',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'Does the seam BUILT to #292.4 actually do what it says — enumerate (mate × rung) '
      + 'at the engine\'s own canary ladder through the SHIPPED oracle, price each pair at ITS '
      + 'rung on the ONE table, put the chosen weight on the ball (including through the '
      + 'wind-up), carry the orientation term ONLY under the flag, and leave the flags-off world '
      + 'byte-identical?',
    design: {
      ladder: 'PASS_CANARY_POWERS = {PASS_POWER_MIN, 1, PASS_POWER_MAX}, the engine\'s own, '
        + `traced to ${BRAIN_PATH}:${CANARY_LINE} (\`${CANARY_LITERAL}\`).`,
      admission: 'PER RUNG, through the SHIPPED `evaluatePassOption` at that rung\'s power. A '
        + 'null retires THAT PAIR and nothing else — `preferredPassPower`\'s all-three-rungs '
        + 'refusal is NOT inherited (its price divides by the reference rung\'s touch survival, '
        + 'which is exactly the artefact that hides the admission population).',
      price: 'the SAME two factors the shipped joining rule joins, at the pair\'s OWN rung: '
        + 'threatQuintilePrice(threat) × (1 − touchFailPrior), BASE curve only (the heavy curve '
        + 'is STRUCK, #292.3). NO new pricing table and NO new constants (M-PW.2). The '
        + 'per-option reference normaliser is dropped BECAUSE it is the refusal mechanism.',
      argmax: 'JOINT over (mate, weight), first-wins on a strict `>` — the shipped argmax\'s own '
        + 'rule, which with the ladder in floor→ceiling order breaks exact ties toward the '
        + 'SOFTER ball (PW-T0a §CORRECTIONS 6).',
      orientation: '⭐ UNDER THE FLAG ONLY: the oracle is asked at `rung × orientationPowerMul`, '
        + 'the passer\'s OWN body alignment on the PERCEIVED direction to the mate '
        + '(self-knowledge, INFO-DOCTRINE §0; DIVERGENCE-1, #291.1(c), load-bearing at #292.3).',
      threading: 'the chosen weight is DEPOSITED on `match.pwStrikePower` (gid + tick) and '
        + 'CONSUMED inside `performPass`; `armPendingPass` captures it into the wind-up record '
        + 'and the resolve re-deposits it, so the certified O1/PTP/DLC/DV strike statements and '
        + 'call signatures are byte-for-byte unchanged (their pins still hold).',
      scope: 'open play only: not a restart taker (`mustKick`), not the cutback, not a GK, and '
        + 'never over the E2a-2 `forcedPassTarget` probe seam.',
    },
    dormancy: '⭐⭐ THE HARD GATE: flags off ⇒ byte-identity, proven by world-identity signatures '
      + `(${WORLD_IDENTITY_SEEDS.length} bare + ${WORLD_IDENTITY_SEEDS.length} v7-armed matches, `
      + 'walked to completion, ball + all 12 bodies sampled every 37th tick) taken from a CLEAN '
      + '`HEAD` WORKTREE BEFORE the seam existed and re-derived here, plus the repo\'s own league '
      + 'fingerprint. `executedPassPower(1)` draws no rng, which is why the identity is exact '
      + 'rather than approximate.',
    receiptLaw: '⭐ PLUMBING RECEIPTS ARE NEVER EFFECT SIZES (#289). Nothing here is a football '
      + 'finding; the armed distributions are SMOKE-GRADE sanity, and PW-T1 owns every claim.',
    declaredSrcScope: DECLARED_SRC_SCOPE,
    baselines: {
      worldIdentityPooledAtCleanHead: WORLD_IDENTITY_POOLED_AT_HEAD,
      leagueFingerprintAtCleanHead: LEAGUE_FINGERPRINT_AT_HEAD,
      leagueFingerprintInvocation: `scripts/fingerprint.ts ${LEAGUE_FINGERPRINT_SEED} `
        + `${LEAGUE_FINGERPRINT_SEASONS}`,
      method: 'git worktree add /tmp/pw-base HEAD — the same signature function, run in a tree '
        + 'that does not contain this slice.',
    },
  },
  srcReceipts: {
    canaryLadder: { literal: CANARY_LITERAL, tracedTo: `${BRAIN_PATH}:${CANARY_LINE}`, powers: POWERS },
    seamSingularity: {
      chooserCallSitesInTheBrain: CHOOSER_CALL_SITES,
      depositSites: DEPOSIT_SITES,
      consumptionSites: CONSUME_SITES,
      flagReadsInTheBrain: FLAG_READS_IN_BRAIN,
      windupResolveStatement: `${MATCH_PATH}:${WINDUP_RESOLVE_LINE}`,
    },
    cbSeatArmingBlock: {
      law: '⭐ M-PW.4: the S∧¬T guard debt falls due ONLY if this slice touches the CB seat\'s '
        + 'arming block. It does not — the block is byte-untouched and names nothing of this '
        + 'seam; the debt stays the CB seam\'s.',
      blockMentionsThisSeam: CB_ARMING_BLOCK_MENTIONS_PW,
      blockChars: CB_ARMING_BLOCK.length,
    },
    diffScope: {
      declared: DECLARED_SRC_SCOPE, touched: TOUCHED, matches: SCOPE_MATCHES, stat: DIFF_STAT,
      against: PRE_SLICE_HEAD,
      law: 'the diff is taken against the DISPATCH commit, not against HEAD, so this receipt '
        + 'cannot go silently empty once the seam is committed.',
    },
  },
  receipts: RECEIPTS,
  worldIdentity: {
    seeds: WORLD_IDENTITY_SEEDS,
    rows: identityRows,
    pooled: IDENTITY_POOLED,
    pooledAtCleanHead: WORLD_IDENTITY_POOLED_AT_HEAD,
    identical: IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD,
    leagueFingerprint: LEAGUE_FP,
  },
  run: {
    mode: undefined,
    receiptWalks: WALKS.length,
    smokeWalks: SMOKE_WALKS.length,
    windupWalks: WALKS.filter((w) => w.windup).length,
    ladder: POWERS,
  },
  perWalkLedgers: WALKS.map((w) => ({ seed: w.seed, windup: w.windup ? 1 : 0, ...w.ledger })),
  strikeRows: ALL_STRIKES.map((s) => ({
    ...s,
    orientation: round(s.orientation, 9),
    executedRederived: round(s.executedRederived, 9),
    expectedSpeed: round(s.expectedSpeed, 9),
    observedSpeed: round(s.observedSpeed, 9),
    relError: s.relError,
    speedAtWeightOne: round(s.speedAtWeightOne, 9),
  })),
  traceControl,
  dose: {
    source: `${T1_PATH} · poolT1DoseCells (the SHIPPED world-7 entry's own pooling)`,
    fileBytesSha256: DOSE_FILE_BYTES_SHA,
    rederivedBodySha256: DOSE_REDERIVED_SHA,
    shippedConstant: L3_T1_SHA,
    cells: DOSE,
  },
  seeds: { claimed: CLAIMED, block: BLOCK, consumedBands: CONSUMED },
  stats: { draws: STATS_DRAWS, floorFromRuling: STATS_FLOOR_FROM_RULING },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ THIS IS A PLUMBING PROOF. Not one number here is an effect size, a football finding or a '
      + 'usage claim (#289 canon). PW-T1 owns every claim about what the armed world does.',
    'The rung distributions are SMOKE-GRADE (a handful of seeds, no CI drawn, no denominator '
      + 'discipline): they establish non-degeneracy, nothing more.',
    'The census-ladder liveness counted in RECEIPT 4 is PURE OBSERVATION — the chooser never '
      + 'filters on it. It is published because #292.4\'s literal admission channel (the '
      + 'oracle\'s null) never binds inside the live 6–30 m window.',
    'No claim is made that the chosen region is GOOD football: PW-T0a already established that '
      + 'the shipped price wants the softest ball on published survivors, and #292.4 pre-'
      + 'registered that the firm ball\'s value should appear at admission grain — measuring '
      + 'whether it does is PW-T1\'s battery, not this stage\'s.',
    'The execution honesty of the struck weight (orientation × the gaussian the oracle omits) is '
      + 'TRACED here as plumbing; its CONSEQUENCES are PW-T1\'s (#291.1).',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath,
    mode: MODE,
    preflight: IS_PREFLIGHT,
    preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
    walkMs: WALK_MS,
    identityMs: IDENTITY_MS,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pw-t0b-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7, walkMs: 0, identityMs: 0,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD',
      mode: 'ANOTHER-MODE', preflight: !IS_PREFLIGHT, preflightReasons: ['ANOTHER-REASON'],
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
const disk = rederiveFromDisk(OUT_PATH);
gFacesInput.checked = disk.checked;
gFacesInput.bad = disk.bad;
gFacesInput.parsed = disk.parsed;
gFacesInput.keys = Object.keys(RECEIPTS).length;
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pw-t0b] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pw-t0b] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
banner(`  [pw-t0b] strikes traced ${ALL_STRIKES.length} · at a chosen weight ${CHOSEN_STRIKES.length}`
  + ` · max rel error ${MAX_REL_ERROR.toExponential(2)}`);
banner(`  [pw-t0b] wind-up carried ${WINDUP_STRIKES.length} · oracle calls/decision `
  + `${round(PER_DECISION_ORACLE_CALLS, 2)} · walk wall ${WALK_MS} ms`);
banner(`  [pw-t0b] smoke rungs ${SMOKE_RUNGS.join(' / ')} of ${SMOKE_DECISIONS} decisions`);
banner(`  [pw-t0b] world identity ${IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD ? 'IDENTICAL' : 'MOVED'}`
  + ` · league fingerprint ${LEAGUE_FP === LEAGUE_FINGERPRINT_AT_HEAD ? 'UNMOVED' : LEAGUE_FP}`);
banner(`  [pw-t0b] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
