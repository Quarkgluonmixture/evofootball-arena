/**
 * PW T0c — THE AMENDMENT SLICE: THE RECEIPTS
 * (docs/world-model/PW-T0C-OBJECTIVE-FIDELITY.md; contract PW-PASSWEIGHT-CONTRACT.md §2 M-PW.2 /
 * M-PW.4; the four clauses FIXED by ruling #293.3 — this probe designs nothing, it PROVES.)
 *
 * The amendment is four clauses on the banked PW-T0b seam:
 *   (a) OBJECTIVE FIDELITY + CANDIDATE-SET PARITY — the PW price is the SHIPPED per-mate price
 *       under the world's own flags, times the shipped joining rule's own rung factor normalised
 *       at the reference rung; the candidate set is the shipped chooser's own.
 *   (b) THE PIN SUITE — `tests/pwWeightChooserSeat.test.ts` (permanent; this probe is one-shot).
 *   (c) THE CANCELLED WIND-UP — accounted, never silently dropped; the choice ledger CLOSES.
 *   (d) PTP × PW — an unsupported composition the engine REFUSES to build.
 *
 * ⭐⭐ THE KEY RECEIPT: collapse the ladder to {1} and the armed world is BYTE-IDENTICAL to the
 * door-shut world. Fidelity is not argued, it is a digest: same objective, same candidates, same
 * tie-break ⇒ the same man on every decision, and no weight deposit that bites. With the full
 * ladder a mate switch is therefore attributable to a RUNG, never to a thinner objective.
 *
 * The hygiene canon in its build-slice form (as PW-T0b):
 *   * `xSrcUntouched` does not apply; its seat is taken by ⭐⭐ `xByteIdenticalOff` (the flags-off
 *     world-identity digest + the league fingerprint, re-proven AFTER the amendment) and
 *     ⭐ `xDiffScope` (taken against the PW-T0b RESULT commit).
 *   * the hashed body excludes ALL invocation context; timing/preflight live in the envelope BY
 *     NAME (#266.3(a), #289.1).
 *   * the mutant coverage map is DERIVED FROM THE GATE OBJECTS (#268.3(a)); an uncovered conjunct
 *     makes this probe REFUSE TO RUN (exit 3).
 *   * `gFaces` parses the SERIALIZED artifact back off disk (#287.1).
 *   * data-source guards hash FILE BYTES (#289 canon).
 *   * ⭐ PLUMBING RECEIPTS ARE NEVER EFFECT SIZES (#289). PW-T1 owns every football claim.
 *   * ⭐ EVERY ARTIFACT FIELD IS TRUE (#293 correction 5): no field describes a run the probe did
 *     not do — every count below is read off an actual walk or an actual call.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2/#262.2), including the ENGINE's own doors:
 *   accepted: PWT0C_MODE (smoke|full, REQUIRED) · PWT0C_N · PWT0C_OUT · PWT0C_SKIP_FP
 * Any other `PWT0C_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override makes the
 * run a PREFLIGHT: it may never write a canonical repo path.
 *
 * RUN: PWT0C_MODE=full npx tsx scripts/probes/pw-t0c-amendment-receipts.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a LIVENESS refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells } from '../../src/game/a4World';
import { kickMisalignment, orientationPowerMul } from '../../src/sim/mechanics';
import { MATCH_DURATION, PASS_POWER_MAX, PASS_POWER_MIN } from '../../src/sim/constants';
import { choosePassWeight } from '../../src/ai/passWeightChooser';
import {
  choosePerceivedPassTarget, passChoiceCandidateGids, pricePassOption,
} from '../../src/ai/perceivedPassChoice';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS                         */
/* ========================================================================== */
const ENV_WHITELIST = ['PWT0C_MODE', 'PWT0C_N', 'PWT0C_OUT', 'PWT0C_SKIP_FP'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PWT0C_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('PW-T0c FATAL — refused env surface. '
    + `rogue PWT0C_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PWT0C_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`PW-T0c FATAL — PWT0C_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.PWT0C_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PWT0C_N, 10)) : null;
const OUT_ENV = process.env.PWT0C_OUT;
const SKIP_FP = process.env.PWT0C_SKIP_FP === '1';
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PWT0C_N'] : []),
  ...(OUT_ENV !== undefined ? ['PWT0C_OUT'] : []),
  ...(SKIP_FP ? ['PWT0C_SKIP_FP'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pw-t0c-amendment-receipts-smoke.json',
  full: 'docs/world-model/data/pw-t0c-amendment-receipts.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pw-t0c-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner('PW-T0c FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const PIN_SUITE_PATH = 'tests/pwWeightChooserSeat.test.ts';

/**
 * ⭐ THE PW-T0b RESULT COMMIT — the state this amendment amends. The diff-scope receipt is taken
 * against IT (the brief's own gate), so it keeps telling the truth after this slice lands.
 */
const PRE_SLICE_HEAD = '7327ff091bfad9dce9613cb582f84d0a781160c9';
/** ⭐ THE DECLARED SRC SCOPE OF THIS SLICE — the whole of it, nothing else may move. */
const DECLARED_SRC_SCOPE: readonly string[] = [CHOOSER_PATH, BRAIN_PATH, MATCH_PATH];

/**
 * ⭐⭐ THE DORMANCY BASELINE — the SAME constants PW-T0b took from a clean `HEAD` worktree at the
 * dispatch commit `fa35af4`, in a tree where the PW seam did not exist. Re-proving them AFTER the
 * amendment is the hard gate: 10 bare + 10 v7-armed matches on seeds 12,492,900–909, ball state +
 * all 12 bodies sampled every 37th tick, pooled into one digest, plus the repo's own league
 * fingerprint. ⚠ These seeds belong to the CONSUMED PW-T0b block and are re-walked here for the
 * IDENTITY comparison only — the comparison is meaningless against any other seeds.
 */
const WORLD_IDENTITY_SEEDS: readonly number[] = Array.from({ length: 10 }, (_, i) => 12_492_900 + i);
const WORLD_IDENTITY_POOLED_AT_HEAD =
  '5dafce81dfc26677147d6734c10118cfcff40b771c117da011a04eb44fc1f70c';
const LEAGUE_FINGERPRINT_SEED = 1337;
const LEAGUE_FINGERPRINT_SEASONS = 2;
const LEAGUE_FINGERPRINT_AT_HEAD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const SMOKE_BASE = 12_493_000;
const SMOKE_N = 6;
const RECEIPT_BASE = 12_493_100;
const RECEIPT_N_FROZEN = 8;
const SAMPLE_BASE = 12_493_200;
const SAMPLE_N_FROZEN = 4;
const CANCEL_SEED = 12_493_300;
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'BU-C0 … BU-T1 bands (#285.2–#289)', range: [12_486_000, 12_489_999] },
  { name: 'PW-C0 weight-physics census (#290.3/#291)', range: [12_490_000, 12_490_999] },
  { name: 'PW-T0a preference census (#291.6/#292)', range: [12_491_000, 12_491_999] },
  { name: 'PW-T0b chooser seam (#292.6/#293)', range: [12_492_000, 12_492_999] },
];
const BLOCK: readonly [number, number] = [12_493_000, 12_493_999];
/** ⭐ NO CI IS DRAWN IN THIS SLICE — it is a plumbing amendment. The stats stream is UNCONSUMED. */
const STATS_FLOOR_FROM_RULING = 112_800;
const STATS_DRAWS = 0;

const N_RUN = N_ENV ?? (MODE === 'smoke' ? 2 : RECEIPT_N_FROZEN);
const RECEIPT_SEEDS = Array.from({ length: N_RUN }, (_, i) => RECEIPT_BASE + i);
const SAMPLE_SEEDS = Array.from(
  { length: N_ENV ?? (MODE === 'smoke' ? 1 : SAMPLE_N_FROZEN) }, (_, i) => SAMPLE_BASE + i,
);
const SMOKE_SEEDS = Array.from(
  { length: MODE === 'smoke' ? 2 : SMOKE_N }, (_, i) => SMOKE_BASE + i,
);
const IDENTITY_SEEDS = N_ENV !== null ? WORLD_IDENTITY_SEEDS.slice(0, 2) : WORLD_IDENTITY_SEEDS;

/* ========================================================================== */
/* §3 THE ARM — CONSTRUCTED DIRECTLY WITH matchFlags (#283.2(iv))              */
/* ========================================================================== */
const L3_WORLD_VERSION = 7 as const;
const LADDER: readonly number[] = [PASS_POWER_MIN, 1, PASS_POWER_MAX];
const COLLAPSED: readonly number[] = [1];
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

interface ArmOpts { pw?: boolean; ladder?: readonly number[]; bare?: boolean }
const makeMatch = (seed: number, opts: ArmOpts): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  if (opts.bare === true) return new Match({ seed, teamA, teamB });
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION),
    ...(opts.pw === true ? { pwWeightChooser: true } : {}),
    ...(opts.ladder === undefined ? {} : { pwPowerLadder: opts.ladder }),
  });
  armA4World(m, null, L3_WORLD_VERSION, DOSE);
  return m;
};

/* ========================================================================== */
/* §4 ⭐⭐ THE WORLD-IDENTITY SIGNATURE — reproduced VERBATIM from PW-T0b        */
/* ========================================================================== */
const signatureOf = (m: Match): string => {
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
const signature = (seed: number, armed: boolean): string =>
  signatureOf(makeMatch(seed, { bare: !armed }));

/* ========================================================================== */
/* §5 THE WALKS — three arms per receipt seed                                  */
/* ========================================================================== */
type Ledger = Record<string, number | number[]>;
const ledgerOf = (m: Match): Ledger => {
  const led = m.pwChooserLedger;
  const out: Ledger = {};
  for (const [k, v] of Object.entries(led)) out[k] = Array.isArray(v) ? [...v] : v;
  // the in-flight tail: a choice still on the ball when the whistle goes is neither struck
  // nor lost, and the ledger closure needs it stated rather than assumed away.
  out.inFlightAtWhistle = (m.pendingPassWindup !== null && m.pendingPassWindup.powerChoice !== 1
    ? 1 : 0) + (m.pwStrikePower !== null && m.pwStrikePower.power !== 1 ? 1 : 0);
  return out;
};
interface ArmWalk { seed: number; signature: string; ledger: Ledger; armedVersion: number;
  pwLive: boolean; duration: number; }
const walkArm = (seed: number, opts: ArmOpts): ArmWalk => {
  const m = makeMatch(seed, opts);
  const armedVersion = a4ArmedVersion(m);
  const pwLive = m.pwWeightChooser;
  const duration = m.duration;
  const sig = signatureOf(m);
  return { seed, signature: sig, ledger: ledgerOf(m), armedVersion, pwLive, duration };
};

const tWalk0 = Date.now();
/** the door-SHUT v7 world — the thing fidelity is measured against */
const OFF_WALKS = RECEIPT_SEEDS.map((s) => walkArm(s, {}));
/** ⭐⭐ the FIDELITY arm: the chooser ARMED with the weight axis COLLAPSED to {1} */
const FID_WALKS = RECEIPT_SEEDS.map((s) => walkArm(s, { pw: true, ladder: COLLAPSED }));
/** the full three-rung armed world (the receipt-grade spread, never the exam) */
const FULL_WALKS = RECEIPT_SEEDS.map((s) => walkArm(s, { pw: true }));
const SMOKE_WALKS = SMOKE_SEEDS.map((s) => walkArm(s, { pw: true }));
const WALK_MS = Date.now() - tWalk0;

const sumLed = (walks: readonly ArmWalk[], key: string): number => walks
  .reduce((a, w) => a + ((w.ledger[key] as number) ?? 0), 0);
const rungTotals = (walks: readonly ArmWalk[]): number[] => walks
  .reduce((a, w) => (w.ledger.chosenByRung as number[]).map((v, i) => a[i] + v), [0, 0, 0]);

/* ---- ⭐⭐ RECEIPT 1: FIDELITY, at world grain and at decision grain ---- */
const FIDELITY_IDENTICAL = RECEIPT_SEEDS
  .filter((_, i) => FID_WALKS[i].signature === OFF_WALKS[i].signature).length;
const FULL_LADDER_MOVES = RECEIPT_SEEDS
  .filter((_, i) => FULL_WALKS[i].signature !== OFF_WALKS[i].signature).length;
const FID_DECISIONS = sumLed(FID_WALKS, 'decisions');
const FID_MATE_SWITCHES = sumLed(FID_WALKS, 'mateSwitches');
const FID_DEPOSITS = sumLed(FID_WALKS, 'depositsNonDefault');
const FULL_DECISIONS = sumLed(FULL_WALKS, 'decisions');
const FULL_MATE_SWITCHES = sumLed(FULL_WALKS, 'mateSwitches');

/* ---- ⭐⭐ RECEIPT 3: THE CLOSED CHOICE LEDGER (clause (c)) ---- */
const closureRow = (w: ArmWalk): { seed: number; deposited: number; struck: number;
  voided: number; abandoned: number; inFlight: number; closes: boolean } => {
  const deposited = w.ledger.depositsNonDefault as number;
  const struck = w.ledger.struckAtChosenPower as number;
  const voided = w.ledger.windupChoiceVoided as number;
  const abandoned = w.ledger.depositsAbandoned as number;
  const flight = w.ledger.inFlightAtWhistle as number;
  return {
    seed: w.seed,
    deposited,
    struck,
    voided,
    abandoned,
    inFlight: flight,
    closes: deposited === struck + voided + abandoned + flight,
  };
};
const CLOSURE = FULL_WALKS.map(closureRow);
const CLOSURE_OK = CLOSURE.filter((r) => r.closes).length;
const SILENT_LOSSES = CLOSURE.reduce(
  (a, r) => a + (r.deposited - (r.struck + r.voided + r.abandoned + r.inFlight)), 0,
);

/* ---- ⭐ THE CONSTRUCTED CANCELLED WIND-UP (clause (c)'s own exhibit) ---- */
const cancelExhibit = (() => {
  const m = makeMatch(CANCEL_SEED, { pw: true });
  let ticks = 0;
  while (!m.finished && m.pendingPassWindup === null && ticks < 60000) { m.step(DT); ticks++; }
  const pp = m.pendingPassWindup;
  if (pp === null) {
    return { armed: false, voidedBefore: 0, voidedAfter: 0, cancelObserved: false, ticks };
  }
  // put a CHOSEN weight on the live wind-up record, then void it the engine's own way (the
  // arm-time mate leaves the pitch — the #180.3(i) INT-MATE cancel).
  (pp as { powerChoice: number }).powerChoice = PASS_POWER_MAX;
  const voidedBefore = m.pwChooserLedger.windupChoiceVoided;
  const cancelledBefore = m.o1WindupLedger.cancelledMate;
  (m.allPlayers[pp.targetGid] as Player).sentOff = true;
  let guard = 0;
  while (!m.finished && m.o1WindupLedger.cancelledMate === cancelledBefore && guard < 600) {
    m.step(DT); guard++; ticks++;
  }
  return {
    armed: true,
    voidedBefore,
    voidedAfter: m.pwChooserLedger.windupChoiceVoided,
    cancelObserved: m.o1WindupLedger.cancelledMate > cancelledBefore,
    ticks,
  };
})();

/* ========================================================================== */
/* §6 ⭐⭐ THE OBJECTIVE AT UNIT GRAIN — the shipped functions, CALLED           */
/* ========================================================================== */
interface SampleRow {
  seed: number; tick: number; passerGid: number;
  candidates: number; shippedExecutable: number;
  parity: boolean; unseenAdmitted: number;
  priceIdentical: number; priceRows: number;
  referenceFactorIsOne: boolean;
  sameManAtCollapsedLadder: boolean;
  shippedGid: number; pwGid: number;
  seenUnreadCandidates: number;
}
/** the flagged caller's own inputs, reproduced exactly as `PlayerBrain` builds them */
const chooserInputs = (m: Match, p: Player) => {
  const own = m.teams[p.side];
  const opp = m.teams[1 - p.side];
  const gids = passChoiceCandidateGids(p, own.players);
  const scope = new Set<number>([p.gid, ...gids]);
  for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);
  const snapshot = m.perceivedSnapshot(p, scope);
  if (snapshot === null) return null;
  const reachProfiles = m.reachProfiles();
  const orientationMul = new Map<number, number>();
  for (const gid of gids) {
    const seenMate = snapshot.players.find((e) => e.gid === gid);
    const seenSelf = snapshot.players.find((e) => e.gid === p.gid);
    if (seenMate === undefined || seenSelf === undefined) continue;
    const dx = seenMate.pos.x - seenSelf.pos.x;
    const dy = seenMate.pos.y - seenSelf.pos.y;
    const dl = Math.sqrt(dx * dx + dy * dy);
    if (!(dl > 1e-6)) continue;
    orientationMul.set(gid, orientationPowerMul(
      kickMisalignment(p, { x: dx / dl, y: dy / dl }), p.attrs.passing,
    ));
  }
  return {
    snapshot,
    passerGid: p.gid,
    candidateGids: gids,
    attackDir: own.attackDir,
    reachProfiles,
    orientationMul,
    valueAxis: m.edsValueAxis,
  };
};
const sampleWalk = (seed: number, maxRows: number): SampleRow[] => {
  const m = makeMatch(seed, { pw: true });
  const rows: SampleRow[] = [];
  let ticks = 0;
  while (!m.finished && rows.length < maxRows && ticks < 60000) {
    m.step(DT); ticks++;
    const o = m.ball.owner;
    if (o === null || o.role === 'GK' || o.sentOff || m.phase !== 'playing') continue;
    if (ticks % 17 !== 0) continue;
    const inputs = chooserInputs(m, o);
    if (inputs === null || inputs.candidateGids.length < 2) continue;
    const shipped = choosePerceivedPassTarget(inputs);
    const pwFull = choosePassWeight({ ...inputs, powers: LADDER });
    const pwOne = choosePassWeight({ ...inputs, powers: COLLAPSED });
    if (shipped === null || pwFull === null || pwOne === null) continue;
    const shippedExecutable = shipped.options.filter((x) => x.executable)
      .map((x) => x.targetGid).sort((a, b) => a - b);
    const pwMates = Array.from(new Set(pwFull.candidates.map((c) => c.targetGid)))
      .sort((a, b) => a - b);
    let priceIdentical = 0;
    let priceRows = 0;
    let referenceFactorIsOne = true;
    for (const c of pwFull.candidates) {
      const priced = pricePassOption({
        snapshot: inputs.snapshot,
        passerGid: inputs.passerGid,
        targetGid: c.targetGid,
        attackDir: inputs.attackDir,
        reachProfiles: inputs.reachProfiles,
        valueAxis: inputs.valueAxis,
      });
      priceRows++;
      if (c.shippedPrice === priced.price && c.infoClass === priced.infoClass
        && c.price === priced.price * c.rungFactor) priceIdentical++;
      if (c.power === 1 && c.rungFactor !== 1) referenceFactorIsOne = false;
    }
    rows.push({
      seed,
      tick: m.simTick,
      passerGid: o.gid,
      candidates: pwMates.length,
      shippedExecutable: shippedExecutable.length,
      parity: canonical(pwMates) === canonical(shippedExecutable),
      unseenAdmitted: pwFull.candidates.filter((c) => c.infoClass === 'UNSEEN').length,
      priceIdentical,
      priceRows,
      referenceFactorIsOne,
      sameManAtCollapsedLadder: pwOne.targetGid === shipped.targetGid
        && pwOne.price === shipped.price && pwOne.power === 1,
      shippedGid: shipped.targetGid,
      pwGid: pwFull.targetGid,
      seenUnreadCandidates: pwFull.candidates.filter((c) => c.infoClass === 'SEEN-UNREAD').length,
    });
  }
  return rows;
};
const SAMPLE_ROWS = SAMPLE_SEEDS.flatMap((s) => sampleWalk(s, MODE === 'smoke' ? 5 : 40));
const PARITY_OK = SAMPLE_ROWS.filter((r) => r.parity).length;
const UNSEEN_ADMITTED = SAMPLE_ROWS.reduce((a, r) => a + r.unseenAdmitted, 0);
const PRICE_ROWS = SAMPLE_ROWS.reduce((a, r) => a + r.priceRows, 0);
const PRICE_IDENTICAL = SAMPLE_ROWS.reduce((a, r) => a + r.priceIdentical, 0);
const REF_FACTOR_OK = SAMPLE_ROWS.filter((r) => r.referenceFactorIsOne).length;
const SAME_MAN = SAMPLE_ROWS.filter((r) => r.sameManAtCollapsedLadder).length;
const FULL_LADDER_SWITCHES = SAMPLE_ROWS.filter((r) => r.pwGid !== r.shippedGid).length;
const SEEN_UNREAD_CANDIDATES = SAMPLE_ROWS.reduce((a, r) => a + r.seenUnreadCandidates, 0);

/* ---- the SAMPLING NON-PERTURBATION control: asking the chooser is a CAMERA ---- */
const sampleControl = (() => {
  let ok = 0;
  let total = 0;
  for (const seed of SAMPLE_SEEDS.slice(0, 2)) {
    const plain = walkArm(seed, { pw: true }).signature;
    const m = makeMatch(seed, { pw: true });
    let ticks = 0;
    let rows = 0;
    const trace: number[] = [];
    while (!m.finished && ticks < 60000) {
      m.step(DT); ticks++;
      const o = m.ball.owner;
      if (o !== null && o.role !== 'GK' && !o.sentOff && m.phase === 'playing'
        && ticks % 17 === 0 && rows < 40) {
        const inputs = chooserInputs(m, o);
        if (inputs !== null && inputs.candidateGids.length >= 2) {
          choosePassWeight({ ...inputs, powers: LADDER });
          choosePerceivedPassTarget(inputs);
          rows++;
        }
      }
      if (ticks % 37 === 0) {
        trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
        for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
      }
    }
    const r = m.getResult();
    const traced = sha(JSON.stringify({
      trace: trace.map((v) => Math.round(v * 1e9)),
      score: r.score, stats: r.stats, events: r.events.length, ticks,
    }));
    total++;
    if (plain === traced) ok++;
  }
  return { ok, total };
})();

/* ---- ⭐⭐ THE DORMANCY PROOF, RE-RUN AFTER THE AMENDMENT ---- */
const tId0 = Date.now();
const identityRows: string[] = [];
for (const s of IDENTITY_SEEDS) identityRows.push(`bare ${s} ${signature(s, false)}`);
for (const s of IDENTITY_SEEDS) identityRows.push(`v7 ${s} ${signature(s, true)}`);
const IDENTITY_POOLED = sha(identityRows.join('|'));
const IDENTITY_COMPLETE = IDENTITY_SEEDS.length === WORLD_IDENTITY_SEEDS.length;
const IDENTITY_MS = Date.now() - tId0;
const LEAGUE_FP = SKIP_FP ? 'SKIPPED' : (() => {
  const out = gitOut(
    `npx tsx scripts/fingerprint.ts ${LEAGUE_FINGERPRINT_SEED} ${LEAGUE_FINGERPRINT_SEASONS}`,
  );
  const m = out.match(/sha256=([0-9a-f]{64})/);
  return m === null ? `UNPARSED:${out.slice(0, 40)}` : m[1];
})();

/* ---- G-DET: a receipt walk re-derives bit-identically ---- */
const detDigest = (): string => sha(canonical(walkArm(RECEIPT_SEEDS[0], { pw: true })));
const digestA = detDigest();
const digestB = detDigest();

/* ========================================================================== */
/* §7 CLAUSE (d) — THE PTP × PW DOOR, EXERCISED                                */
/* ========================================================================== */
const ptpDoor = (() => {
  const mk = (cfg: Record<string, unknown>): { threw: boolean; message: string } => {
    try {
      // eslint-disable-next-line no-new
      new Match({
        seed: BLOCK[0], teamA: team('A', 1), teamB: team('B', 2), ...cfg,
      });
      return { threw: false, message: '' };
    } catch (e) { return { threw: true, message: (e as Error).message }; }
  };
  const both = mk({ ptpPassLead: true, pwWeightChooser: true });
  return {
    bothArmedThrows: both.threw,
    message: both.message,
    messageNamesTheRuling: both.message.includes('#293.3'),
    messageNamesTheMissingSlice: both.message.includes('lead-at-rung'),
    ptpAloneBuilds: !mk({ ptpPassLead: true }).threw,
    pwAloneBuilds: !mk({ pwWeightChooser: true }).threw,
    neitherBuilds: !mk({}).threw,
  };
})();

/* ========================================================================== */
/* §8 SRC RECEIPTS — read out of source, never asserted                        */
/* ========================================================================== */
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
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const PIN_SUITE_BYTES = (() => {
  try { return readFileSync(PIN_SUITE_PATH, 'utf8'); } catch { return ''; }
})();
const FLAGGED_TERMS = identifiersOf(bodyOf(CHOOSER_SRC, 'export function choosePassWeight'));
const PRODUCTION_TERMS = identifiersOf(bodyOf(CHOICE_SRC, 'export function pricePassOption'));
const ORI_IDENT = ['orientation', 'PowerMul'].join('');
const ORIENTATION_IN_FLAGGED = FLAGGED_TERMS.some((t) => t.toLowerCase().includes('orientation'));
const ORIENTATION_IN_PRODUCTION = PRODUCTION_TERMS
  .some((t) => t.toLowerCase().includes('orientation'));
const ORIENTATION_ABSENT_FROM_SHIPPED_PRICER = !CHOICE_SRC.includes(ORI_IDENT);
/** ⭐ the amendment's own structural receipt: the chooser CALLS the shipped pricer */
const CHOOSER_CALLS_SHIPPED_PRICER = /pricePassOption\(/.test(CHOOSER_SRC);
const CHOOSER_HAS_NO_PRICE_LITERAL = !/=\s*0\.\d+\s*;/.test(
  bodyOf(CHOOSER_SRC, 'export function choosePassWeight'),
);
const CHOOSER_CALL_SITES = (BRAIN_SRC.match(/choosePassWeight\(/g) ?? []).length;
const DEPOSIT_SITES = (BRAIN_SRC.match(/match\.pwStrikePower = /g) ?? []).length;
const CONSUME_SITES = (MATCH_SRC.match(/this\.pwStrikePower = null;/g) ?? []).length;
const REDEPOSIT_SITES = (MATCH_SRC.match(/this\.pwStrikePower = \{/g) ?? []).length;
const FLAG_READS_IN_BRAIN = (BRAIN_SRC.match(/match\.pwWeightChooser/g) ?? []).length;
const VOID_SITES = (MATCH_SRC.match(/this\.pwNoteWindupChoiceVoid\(/g) ?? []).length;
const CB_ARMING_BLOCK = bodyOf(BRAIN_SRC, 'if (cbSeat !== null) {');
const CB_ARMING_BLOCK_MENTIONS_PW = /pw[A-Z]/.test(CB_ARMING_BLOCK);
const CB_ARMING_BLOCK_SHA = sha(CB_ARMING_BLOCK);
const CB_ARMING_BLOCK_IN_DIFF = gitOut(
  `git diff ${PRE_SLICE_HEAD} -- ${BRAIN_PATH}`,
).split('\n').filter((l) => /^[-+]/.test(l) && /cbSeat/.test(l)).length;

const DIFF_STAT = gitOut(`git diff --stat ${PRE_SLICE_HEAD} -- src`);
const DIFF_NAMES = gitOut(`git diff --name-only ${PRE_SLICE_HEAD} -- src`)
  .split('\n').filter((s) => s !== '');
const UNTRACKED = gitOut('git ls-files --others --exclude-standard -- src')
  .split('\n').filter((s) => s !== '');
const TOUCHED = Array.from(new Set([...DIFF_NAMES, ...UNTRACKED])).sort();
const SCOPE_MATCHES = canonical(TOUCHED) === canonical([...DECLARED_SRC_SCOPE].sort());

const ARM_OK = FULL_WALKS.filter((w) => w.armedVersion === L3_WORLD_VERSION && w.pwLive).length
  + FID_WALKS.filter((w) => w.armedVersion === L3_WORLD_VERSION && w.pwLive).length;
const ALL_WALKS = [...OFF_WALKS, ...FID_WALKS, ...FULL_WALKS, ...SMOKE_WALKS];
const CLOCK_OK = ALL_WALKS.filter((w) => w.duration === MATCH_DURATION).length;

/* ========================================================================== */
/* §9 THE GATE REGISTRY                                                        */
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
const registerGate = <I>(spec: GateSpec<I>): void => {
  REGISTRY.push(spec as unknown as GateSpec<never>);
};
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

/* ---- 2 ⭐⭐ xByteIdenticalOff — the dormancy prong, RE-PROVEN after the amendment ---- */
registerGate<{ pooled: string; rows: number; league: string; skipped: boolean; complete: boolean }>({
  name: 'xByteIdenticalOff',
  fn: (i) => ({
    theFlagsOffWorldsRederiveTheCleanHeadDigest: i.complete
      && i.pooled === WORLD_IDENTITY_POOLED_AT_HEAD,
    bothWorldFamiliesWereWalked: i.rows === IDENTITY_SEEDS.length * 2,
    theLeagueFingerprintIsUnmoved: i.skipped || i.league === LEAGUE_FINGERPRINT_AT_HEAD,
  }),
  input: {
    pooled: IDENTITY_POOLED, rows: identityRows.length, league: LEAGUE_FP, skipped: SKIP_FP,
    complete: IDENTITY_COMPLETE,
  },
  mutants: [
    { conjunct: 'theFlagsOffWorldsRederiveTheCleanHeadDigest', name: 'a flags-off world moved', mutate: (i) => ({ ...i, pooled: 'deadbeef' }) },
    { conjunct: 'bothWorldFamiliesWereWalked', name: 'a world family went unwalked', mutate: (i) => ({ ...i, rows: 1 }) },
    { conjunct: 'theLeagueFingerprintIsUnmoved', name: 'the league fingerprint moved', mutate: (i) => ({ ...i, league: 'deadbeef', skipped: false }) },
  ],
});

/* ---- 3 ⭐ xDiffScope — against the PW-T0b RESULT commit ---- */
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
    everyArmedWalkIsTheV7WorldWithTheDoorLive: i.ok === i.total,
    theEngineClockIsTheDefaultOnEveryWalk: i.clock === i.clockTotal,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: {
    ok: ARM_OK, total: FULL_WALKS.length + FID_WALKS.length,
    clock: CLOCK_OK, clockTotal: ALL_WALKS.length,
  },
  mutants: [
    { conjunct: 'everyArmedWalkIsTheV7WorldWithTheDoorLive', name: 'a walk was not the armed v7 world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theEngineClockIsTheDefaultOnEveryWalk', name: 'a walk ran an overridden clock', mutate: (i) => ({ ...i, clock: i.clock - 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 5 gDose — hash the FILE BYTES, re-derive the digest from them ---- */
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

/* ---- 6 ⭐⭐ gFidelity — RECEIPT 1, THE KEY ONE (clause (a)) ---- */
registerGate<{
  identical: number; walks: number; switches: number; deposits: number; decisions: number;
  moves: number;
}>({
  name: 'gFidelity',
  fn: (i) => ({
    theCollapsedLadderWorldIsByteIdenticalToTheDoorShutWorld: i.identical === i.walks,
    theCollapsedChooserMovesNobodyOffTheShippedPick: i.switches === 0,
    theCollapsedChooserDepositsNoWeightThatBites: i.deposits === 0,
    hundredsOfDecisionsWereActuallyMade: i.decisions >= 200,
    theFullLadderWorldIsNotTheSameWorld: i.moves === i.walks,
    nonVacuousWalkCount: i.walks > 0,
  }),
  input: {
    identical: FIDELITY_IDENTICAL, walks: RECEIPT_SEEDS.length, switches: FID_MATE_SWITCHES,
    deposits: FID_DEPOSITS, decisions: FID_DECISIONS, moves: FULL_LADDER_MOVES,
  },
  mutants: [
    { conjunct: 'theCollapsedLadderWorldIsByteIdenticalToTheDoorShutWorld', name: 'a collapsed-ladder world diverged', mutate: (i) => ({ ...i, identical: i.identical - 1 }) },
    { conjunct: 'theCollapsedChooserMovesNobodyOffTheShippedPick', name: 'the collapsed chooser switched a mate', mutate: (i) => ({ ...i, switches: 1 }) },
    { conjunct: 'theCollapsedChooserDepositsNoWeightThatBites', name: 'a non-default weight was deposited at ladder {1}', mutate: (i) => ({ ...i, deposits: 1 }) },
    { conjunct: 'hundredsOfDecisionsWereActuallyMade', name: 'the fidelity claim rested on a handful of decisions', mutate: (i) => ({ ...i, decisions: 12 }) },
    { conjunct: 'theFullLadderWorldIsNotTheSameWorld', name: 'the weight axis changed nothing at all', mutate: (i) => ({ ...i, moves: i.moves - 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'no fidelity walk ran', mutate: (i) => ({ ...i, walks: 0, identical: 0, moves: 0 }) },
  ],
});

/* ---- 7 ⭐⭐ gObjective — the price IS the shipped price, at unit grain ---- */
registerGate<{
  identical: number; rows: number; refOk: number; sampled: number; sameMan: number;
}>({
  name: 'gObjective',
  fn: (i) => ({
    // ⭐ every conjunct carries its OWN non-vacuity, so none of them can pass on an empty set
    everyCandidatePriceIsTheShippedPriceTimesItsRungFactor: i.rows > 0 && i.identical === i.rows,
    theReferenceRungFactorIsExactlyOneEverywhere: i.sampled > 0 && i.refOk === i.sampled,
    theCollapsedArgmaxIsTheShippedArgmax: i.sampled > 0 && i.sameMan === i.sampled,
  }),
  input: {
    identical: PRICE_IDENTICAL, rows: PRICE_ROWS, refOk: REF_FACTOR_OK,
    sampled: SAMPLE_ROWS.length, sameMan: SAME_MAN,
  },
  mutants: [
    { conjunct: 'everyCandidatePriceIsTheShippedPriceTimesItsRungFactor', name: 'a candidate price left the shipped objective', mutate: (i) => ({ ...i, identical: i.identical - 1 }) },
    { conjunct: 'theReferenceRungFactorIsExactlyOneEverywhere', name: 'the reference rung stopped being neutral', mutate: (i) => ({ ...i, refOk: i.refOk - 1 }) },
    { conjunct: 'theCollapsedArgmaxIsTheShippedArgmax', name: 'the collapsed chooser picked another man', mutate: (i) => ({ ...i, sameMan: i.sameMan - 1 }) },
  ],
});

/* ---- 8 ⭐ gParity — the candidate set is the shipped chooser's own ---- */
registerGate<{ parity: number; sampled: number; unseen: number; control: { ok: number; total: number } }>({
  name: 'gParity',
  fn: (i) => ({
    theCandidateSetEqualsTheShippedExecutableSet: i.sampled > 0 && i.parity === i.sampled,
    aManTheShippedChooserCannotAimAtIsNeverACandidate: i.sampled > 0 && i.unseen === 0,
    askingTheChooserIsACameraNotALever: i.control.ok === i.control.total && i.control.total > 0,
  }),
  input: {
    parity: PARITY_OK, sampled: SAMPLE_ROWS.length, unseen: UNSEEN_ADMITTED,
    control: sampleControl,
  },
  mutants: [
    { conjunct: 'theCandidateSetEqualsTheShippedExecutableSet', name: 'the candidate sets diverged', mutate: (i) => ({ ...i, parity: i.parity - 1 }) },
    { conjunct: 'aManTheShippedChooserCannotAimAtIsNeverACandidate', name: 'an UNSEEN man entered the ladder', mutate: (i) => ({ ...i, unseen: 1 }) },
    { conjunct: 'askingTheChooserIsACameraNotALever', name: 'the sampling moved the world', mutate: (i) => ({ ...i, control: { ok: i.control.ok - 1, total: i.control.total } }) },
  ],
});

/* ---- 9 ⭐⭐ gChoiceLedger — RECEIPT 3, clause (c): the ledger CLOSES ---- */
registerGate<{
  closes: number; walks: number; silent: number; deposited: number;
  exhibitArmed: boolean; exhibitCancelled: boolean; exhibitCounted: boolean;
}>({
  name: 'gChoiceLedger',
  fn: (i) => ({
    everyWalksChoiceLedgerCloses: i.closes === i.walks,
    zeroSilentLossesAcrossTheReceiptWalks: i.silent === 0,
    theWalksActuallyDepositedChosenWeights: i.deposited > 0,
    theConstructedCancelledWindUpWasReallyArmedAndReallyCancelled:
      i.exhibitArmed && i.exhibitCancelled,
    theCancelledChoiceIsCountedRatherThanDropped: i.exhibitCounted,
    nonVacuousWalkCount: i.walks > 0,
  }),
  input: {
    closes: CLOSURE_OK, walks: CLOSURE.length, silent: SILENT_LOSSES,
    deposited: sumLed(FULL_WALKS, 'depositsNonDefault'),
    exhibitArmed: cancelExhibit.armed, exhibitCancelled: cancelExhibit.cancelObserved,
    exhibitCounted: cancelExhibit.voidedAfter === cancelExhibit.voidedBefore + 1,
  },
  mutants: [
    { conjunct: 'everyWalksChoiceLedgerCloses', name: 'a walk\'s choice ledger did not close', mutate: (i) => ({ ...i, closes: i.closes - 1 }) },
    { conjunct: 'zeroSilentLossesAcrossTheReceiptWalks', name: 'a chosen weight vanished silently', mutate: (i) => ({ ...i, silent: 1 }) },
    { conjunct: 'theWalksActuallyDepositedChosenWeights', name: 'nothing was ever deposited', mutate: (i) => ({ ...i, deposited: 0 }) },
    { conjunct: 'theConstructedCancelledWindUpWasReallyArmedAndReallyCancelled', name: 'the constructed cancel never happened', mutate: (i) => ({ ...i, exhibitCancelled: false }) },
    { conjunct: 'theCancelledChoiceIsCountedRatherThanDropped', name: 'the cancelled choice was dropped in silence', mutate: (i) => ({ ...i, exhibitCounted: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'no walk was accounted', mutate: (i) => ({ ...i, walks: 0, closes: 0 }) },
  ],
});

/* ---- 10 ⭐ gAdmission — per-rung admission survives the amendment ---- */
registerGate<{ dropped: number; pairs: number; live: number; refAdmissions: number }>({
  name: 'gAdmission',
  fn: (i) => ({
    zeroPairsWereDroppedForFailingToPriceAtAnotherRung: i.dropped === 0,
    everyAdmittedMateWasAskedAtEveryRung: i.pairs % LADDER.length === 0 && i.pairs > 0,
    theCensusGrainLivePopulationIsNonVacuous: i.live > 0,
    theParityAdmissionCounterExists: i.refAdmissions >= 0,
  }),
  input: {
    dropped: sumLed(FULL_WALKS, 'pairsDroppedForOtherRungRefusal'),
    pairs: sumLed(FULL_WALKS, 'pairsAsked'),
    live: sumLed(FULL_WALKS, 'pairsLive'),
    refAdmissions: sumLed(FULL_WALKS, 'referenceAdmissionsWithoutOracleRead'),
  },
  mutants: [
    { conjunct: 'zeroPairsWereDroppedForFailingToPriceAtAnotherRung', name: 'a pair inherited another rung\'s refusal', mutate: (i) => ({ ...i, dropped: 1 }) },
    { conjunct: 'everyAdmittedMateWasAskedAtEveryRung', name: 'the enumeration was not rung-complete', mutate: (i) => ({ ...i, pairs: i.pairs + 1 }) },
    { conjunct: 'theCensusGrainLivePopulationIsNonVacuous', name: 'nothing was live at all', mutate: (i) => ({ ...i, live: 0 }) },
    { conjunct: 'theParityAdmissionCounterExists', name: 'the parity counter went missing', mutate: (i) => ({ ...i, refAdmissions: -1 }) },
  ],
});

/* ---- 11 ⭐ gSpread — the three-rung world still chooses non-degenerately (RECEIPT 2) ---- */
const SMOKE_RUNGS = rungTotals(SMOKE_WALKS);
const SMOKE_DECISIONS = sumLed(SMOKE_WALKS, 'decisions');
const RECEIPT_RUNGS = rungTotals(FULL_WALKS);
registerGate<{ rungs: readonly number[]; maxShare: number; decisions: number; walks: number }>({
  name: 'gSpread',
  fn: (i) => ({
    theArmedWorldRunsAndChooses: i.decisions > 0,
    everyRungOfTheLadderIsReached: i.rungs.every((v) => v > 0),
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
    { conjunct: 'everyRungOfTheLadderIsReached', name: 'a rung was never chosen', mutate: (i) => ({ ...i, rungs: [0, i.rungs[1] + i.rungs[0], i.rungs[2]] }) },
    { conjunct: 'theDistributionIsNotOneDegenerateCorner', name: 'one rung took the whole distribution', mutate: (i) => ({ ...i, maxShare: 1 }) },
    { conjunct: 'nonVacuousSmokeWalkCount', name: 'no smoke walk ran', mutate: (i) => ({ ...i, walks: 0 }) },
  ],
});

/* ---- 12 ⭐ gPtpDoor — clause (d), exercised rather than asserted ---- */
registerGate<typeof ptpDoor>({
  name: 'gPtpDoor',
  fn: (i) => ({
    armingBothDoorsRefusesToBuildTheWorld: i.bothArmedThrows,
    theRefusalNamesTheRulingAndTheMissingSlice:
      i.messageNamesTheRuling && i.messageNamesTheMissingSlice,
    eitherDoorAloneStillBuilds: i.ptpAloneBuilds && i.pwAloneBuilds,
    theBareWorldIsUnaffected: i.neitherBuilds,
  }),
  input: ptpDoor,
  mutants: [
    { conjunct: 'armingBothDoorsRefusesToBuildTheWorld', name: 'the composition was silently allowed', mutate: (i) => ({ ...i, bothArmedThrows: false }) },
    { conjunct: 'theRefusalNamesTheRulingAndTheMissingSlice', name: 'the refusal stopped naming its own door', mutate: (i) => ({ ...i, messageNamesTheRuling: false }) },
    { conjunct: 'eitherDoorAloneStillBuilds', name: 'the guard over-fired on a single door', mutate: (i) => ({ ...i, pwAloneBuilds: false }) },
    { conjunct: 'theBareWorldIsUnaffected', name: 'the guard broke the bare world', mutate: (i) => ({ ...i, neitherBuilds: false }) },
  ],
});

/* ---- 13 gSeam — the seam is still SINGULAR, and the CB arming block is untouched ---- */
registerGate<{
  calls: number; deposits: number; consumes: number; redeposits: number; reads: number;
  voids: number; cbTouched: boolean; cbInDiff: number; callsShipped: boolean; noLiteral: boolean;
  orientationFlagged: boolean; orientationProduction: boolean; orientationShipped: boolean;
}>({
  name: 'gSeam',
  fn: (i) => ({
    exactlyOneChooserCallSiteInTheBrain: i.calls === 1,
    exactlyOneDepositWriterInTheBrain: i.deposits === 1,
    theConsumptionSitesAreTheStrikeTheArmAndTheStaleSweep: i.consumes === 3,
    theOneReDepositIsTheWindUpResolve: i.redeposits === 1,
    theFlagIsReadOnlyAtTheSeamInTheBrain: i.reads === 1,
    everyWindUpVoidPathIsAccounted: i.voids === 6,
    theCbSeatArmingBlockIsUntouchedByThisSlice: !i.cbTouched && i.cbInDiff === 0,
    theChooserCallsTheShippedPricerAndAddsNoConstant: i.callsShipped && i.noLiteral,
    theOrientationTermIsStillFlagScopedByTermListDiff:
      i.orientationFlagged && !i.orientationProduction && i.orientationShipped,
  }),
  input: {
    calls: CHOOSER_CALL_SITES, deposits: DEPOSIT_SITES, consumes: CONSUME_SITES,
    redeposits: REDEPOSIT_SITES, reads: FLAG_READS_IN_BRAIN, voids: VOID_SITES,
    cbTouched: CB_ARMING_BLOCK_MENTIONS_PW, cbInDiff: CB_ARMING_BLOCK_IN_DIFF,
    callsShipped: CHOOSER_CALLS_SHIPPED_PRICER, noLiteral: CHOOSER_HAS_NO_PRICE_LITERAL,
    orientationFlagged: ORIENTATION_IN_FLAGGED, orientationProduction: ORIENTATION_IN_PRODUCTION,
    orientationShipped: ORIENTATION_ABSENT_FROM_SHIPPED_PRICER,
  },
  mutants: [
    { conjunct: 'exactlyOneChooserCallSiteInTheBrain', name: 'a second chooser call site appeared', mutate: (i) => ({ ...i, calls: 2 }) },
    { conjunct: 'exactlyOneDepositWriterInTheBrain', name: 'a second deposit writer appeared', mutate: (i) => ({ ...i, deposits: 2 }) },
    { conjunct: 'theConsumptionSitesAreTheStrikeTheArmAndTheStaleSweep', name: 'a consumption site vanished', mutate: (i) => ({ ...i, consumes: 2 }) },
    { conjunct: 'theOneReDepositIsTheWindUpResolve', name: 'a second re-deposit appeared', mutate: (i) => ({ ...i, redeposits: 2 }) },
    { conjunct: 'theFlagIsReadOnlyAtTheSeamInTheBrain', name: 'the flag gained a second reader in the brain', mutate: (i) => ({ ...i, reads: 2 }) },
    { conjunct: 'everyWindUpVoidPathIsAccounted', name: 'a void path lost its accounting', mutate: (i) => ({ ...i, voids: 5 }) },
    { conjunct: 'theCbSeatArmingBlockIsUntouchedByThisSlice', name: 'the CB arming block entered this diff', mutate: (i) => ({ ...i, cbInDiff: 1 }) },
    { conjunct: 'theChooserCallsTheShippedPricerAndAddsNoConstant', name: 'the chooser stopped calling the shipped pricer', mutate: (i) => ({ ...i, callsShipped: false }) },
    { conjunct: 'theOrientationTermIsStillFlagScopedByTermListDiff', name: 'orientation leaked into the production pricer', mutate: (i) => ({ ...i, orientationProduction: true }) },
  ],
});

/* ---- 14 ⭐ gPinSuite — clause (b): the permanent pins EXIST and pin the right things ---- */
const PIN_MARKERS = [
  'pwWeightChooser', 'pwPowerLadder', 'BYTE-IDENTICAL', 'mateSwitches', 'windupChoiceVoided',
  'depositsAbandoned', 'pairsDroppedForOtherRungRefusal', 'UNSUPPORTED COMPOSITION',
  'pricePassOption', 'choosePerceivedPassTarget',
] as const;
const PIN_MISSING = PIN_MARKERS.filter((k) => !PIN_SUITE_BYTES.includes(k));
const PIN_IT_COUNT = (PIN_SUITE_BYTES.match(/\n\s{2}it\(/g) ?? []).length;
registerGate<{ exists: boolean; missing: number; its: number; bytes: number }>({
  name: 'gPinSuite',
  fn: (i) => ({
    thePermanentPinSuiteExistsOnDisk: i.exists && i.bytes > 0,
    everyClauseHasAPinThatNamesIt: i.missing === 0,
    theSuiteHasRealTestsNotAPlaceholder: i.its >= 15,
  }),
  input: {
    exists: PIN_SUITE_BYTES.length > 0, missing: PIN_MISSING.length, its: PIN_IT_COUNT,
    bytes: PIN_SUITE_BYTES.length,
  },
  mutants: [
    { conjunct: 'thePermanentPinSuiteExistsOnDisk', name: 'the pin suite is not on disk', mutate: (i) => ({ ...i, exists: false, bytes: 0 }) },
    { conjunct: 'everyClauseHasAPinThatNamesIt', name: 'a clause lost its pin', mutate: (i) => ({ ...i, missing: 1 }) },
    { conjunct: 'theSuiteHasRealTestsNotAPlaceholder', name: 'the suite was emptied out', mutate: (i) => ({ ...i, its: 0 }) },
  ],
});

/* ---- 15 gSeed — BOOKED = WALKED ---- */
const CLAIMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'smoke (armed, full ladder)', range: [SMOKE_SEEDS[0], SMOKE_SEEDS[SMOKE_SEEDS.length - 1]] },
  { name: 'receipt walks × 3 arms (off · collapsed · full)', range: [RECEIPT_SEEDS[0], RECEIPT_SEEDS[RECEIPT_SEEDS.length - 1]] },
  { name: 'unit sampling walks', range: [SAMPLE_SEEDS[0], SAMPLE_SEEDS[SAMPLE_SEEDS.length - 1]] },
  { name: 'the constructed cancelled wind-up', range: [CANCEL_SEED, CANCEL_SEED] },
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

/* ---- 16 gStats ---- */
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

/* ---- 17 gEnvClean ---- */
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

/* ---- 18 gFaces — parses the SERIALIZED artifact back off disk (#287.1) ---- */
const RECEIPT_KEYS = [
  'objectiveFidelity', 'candidateSetParity', 'rungSpread', 'choiceLedgerClosure', 'ptpDoor',
] as const;
const gFacesInput = { checked: 0, bad: 1, parsed: false, keys: 0 };
registerGate<typeof gFacesInput>({
  name: 'gFaces',
  fn: (i) => ({
    theSerializedArtifactParsesBackOffDisk: i.parsed,
    everyPublishedReceiptRederivesFromTheStoredRows: i.bad === 0,
    everyFrozenReceiptIsPublished: i.keys === RECEIPT_KEYS.length,
    nonVacuousRederivationCount: i.checked > 0,
  }),
  input: gFacesInput,
  mutants: [
    { conjunct: 'theSerializedArtifactParsesBackOffDisk', name: 'the artifact could not be re-read', mutate: (i) => ({ ...i, parsed: false }) },
    { conjunct: 'everyPublishedReceiptRederivesFromTheStoredRows', name: 'a receipt did not re-derive', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyFrozenReceiptIsPublished', name: 'a receipt went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousRederivationCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 19 gHashEnvelope ---- */
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

/* ---- 20 gMutants ---- */
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
/* §10 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                      */
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
  banner('PW-T0c REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §11 THE ARTIFACT                                                            */
/* ========================================================================== */
const RECEIPTS = {
  objectiveFidelity: {
    what: '⭐⭐ RECEIPT 1 (the key one, clause (a)) — WITH THE RUNGS COLLAPSED TO {1} THE WEIGHT '
      + 'CHOOSER IS THE SHIPPED CHOOSER. Measured two ways: (i) WORLD GRAIN — the armed '
      + 'collapsed-ladder match is BYTE-IDENTICAL to the door-shut match, full walk, every seed; '
      + '(ii) DECISION GRAIN — the engine\'s own `mateSwitches` counter is 0 over every decision '
      + 'the collapsed chooser made, and the unit sample re-asks `choosePerceivedPassTarget` at '
      + 'the same moments and gets the same man and the same price. PLUMBING, never an effect '
      + 'size (#289).',
    receiptSeeds: RECEIPT_SEEDS,
    collapsedLadderWorldsIdenticalToDoorShut: FIDELITY_IDENTICAL,
    ofWalks: RECEIPT_SEEDS.length,
    collapsedChooserDecisions: FID_DECISIONS,
    collapsedChooserMateSwitches: FID_MATE_SWITCHES,
    collapsedChooserNonDefaultDeposits: FID_DEPOSITS,
    fullLadderWorldsThatDifferFromDoorShut: FULL_LADDER_MOVES,
    fullLadderDecisions: FULL_DECISIONS,
    fullLadderMateSwitches: FULL_MATE_SWITCHES,
    unitSampledDecisionMoments: SAMPLE_ROWS.length,
    unitMomentsWhereTheCollapsedArgmaxIsTheShippedArgmax: SAME_MAN,
    unitCandidateRowsPricedIdenticallyToTheShippedPricer: PRICE_IDENTICAL,
    ofUnitCandidateRows: PRICE_ROWS,
    unitMomentsWhereTheFullLadderPicksAnotherMan: FULL_LADDER_SWITCHES,
  },
  candidateSetParity: {
    what: '⭐ RECEIPT (clause (a), the second half) — THE CANDIDATE SET IS THE SHIPPED CHOOSER\'S '
      + 'OWN: the same `passChoiceCandidateGids` window (6–30 m, GK excluded, handed in by the '
      + 'caller) and the same EXECUTABLE filter, so a man the shipped chooser cannot aim at is '
      + 'not a candidate here either, and a SEEN-UNREAD man — whom the pre-amendment chooser '
      + 'DROPPED — is.',
    unitMomentsWithIdenticalCandidateSets: PARITY_OK,
    ofUnitMoments: SAMPLE_ROWS.length,
    unseenMenAdmitted: UNSEEN_ADMITTED,
    seenUnreadCandidatesObserved: SEEN_UNREAD_CANDIDATES,
    engineLedgerMatesPriced: sumLed(FULL_WALKS, 'matesPriced'),
    engineLedgerMatesNotExecutable: sumLed(FULL_WALKS, 'matesNotExecutable'),
    engineLedgerReferenceAdmissionsWithoutOracleRead:
      sumLed(FULL_WALKS, 'referenceAdmissionsWithoutOracleRead'),
    engineLedgerRungsWithoutReferenceNormaliser:
      sumLed(FULL_WALKS, 'rungsWithoutReferenceNormaliser'),
    note: '⚠ HONEST NOTE: the SEEN-UNREAD parity branch is measured EMPTY in these worlds (the '
      + 'reference-rung oracle read exists for every executable mate here). The branch is '
      + 'structural — the executable filter and the price both come from `pricePassOption` — but '
      + 'it is UNEXERCISED by occurrence, and the stage doc\'s §DOUBTS says so.',
  },
  rungSpread: {
    what: '⭐ RECEIPT 2 — the full three-rung world still chooses with a non-degenerate spread. '
      + 'A RECEIPT, NOT THE EXAM: a handful of seeds, no denominators, no CI. PW-T1 owns every '
      + 'claim about what the armed world does.',
    smokeSeeds: SMOKE_SEEDS,
    smokeWalks: SMOKE_WALKS.length,
    smokeDecisions: SMOKE_DECISIONS,
    smokeChosenByRung: SMOKE_RUNGS,
    smokeSharesByRung: SMOKE_RUNGS.map((v) => (SMOKE_DECISIONS === 0 ? Number.NaN
      : round(v / SMOKE_DECISIONS))),
    receiptWalkChosenByRung: RECEIPT_RUNGS,
    ladder: LADDER,
  },
  choiceLedgerClosure: {
    what: '⭐⭐ RECEIPT 3 (clause (c)) — THE CHOICE LEDGER CLOSES, so a silently dropped weight '
      + 'cannot exist: every deposited non-default weight is STRUCK, VOIDED by a cancelled '
      + 'wind-up, ABANDONED (swept at the tick boundary) or still IN FLIGHT at the whistle. The '
      + 'cancelled wind-up is COUNTED rather than re-deposited — the engine\'s own cancel '
      + 'semantics make the decision void, not pending (see the stage doc\'s §CLAUSE (c)).',
    perWalk: CLOSURE,
    walksWhoseLedgerCloses: CLOSURE_OK,
    ofWalks: CLOSURE.length,
    silentLosses: SILENT_LOSSES,
    totalDeposited: sumLed(FULL_WALKS, 'depositsNonDefault'),
    totalStruck: sumLed(FULL_WALKS, 'struckAtChosenPower'),
    totalVoidedByCancelledWindUp: sumLed(FULL_WALKS, 'windupChoiceVoided'),
    totalAbandoned: sumLed(FULL_WALKS, 'depositsAbandoned'),
    totalInFlightAtWhistle: sumLed(FULL_WALKS, 'inFlightAtWhistle'),
    windupCarried: sumLed(FULL_WALKS, 'windupCarried'),
    constructedCancelledWindUp: {
      seed: CANCEL_SEED,
      windUpWasArmed: cancelExhibit.armed,
      cancelObserved: cancelExhibit.cancelObserved,
      voidedCounterBefore: cancelExhibit.voidedBefore,
      voidedCounterAfter: cancelExhibit.voidedAfter,
      method: 'walk until a live `pendingPassWindup` exists, put the ceiling weight on the '
        + 'record, then send the arm-time mate off — the engine\'s OWN #180.3(i) INT-MATE cancel. '
        + 'The pass never runs and the choice is counted.',
    },
  },
  ptpDoor: {
    what: '⭐ RECEIPT 4 (clause (d)) — PTP × PW IS AN UNSUPPORTED COMPOSITION AND THE ENGINE '
      + 'REFUSES TO BUILD IT. A `ptpPassLead` lead is priced and aimed at weight 1; a PW-chosen '
      + 'ball leaves the boot at another pace, so the lead would ride a ball it was never priced '
      + 'for, with zero receipt coverage. Rather than a comment, a throw — exercised here.',
    bothArmedThrows: ptpDoor.bothArmedThrows,
    refusalNamesTheRuling: ptpDoor.messageNamesTheRuling,
    refusalNamesTheMissingSlice: ptpDoor.messageNamesTheMissingSlice,
    ptpAloneStillBuilds: ptpDoor.ptpAloneBuilds,
    pwAloneStillBuilds: ptpDoor.pwAloneBuilds,
    bareWorldStillBuilds: ptpDoor.neitherBuilds,
    message: ptpDoor.message,
  },
} as const;

const rederiveFromDisk = (p: string): { parsed: boolean; checked: number; bad: number } => {
  let parsed = false;
  let checked = 0;
  let bad = 0;
  try {
    const f = readJson(p);
    parsed = true;
    const r = f.receipts as Record<string, Record<string, unknown>>;
    const rows = f.closureRows as ReturnType<typeof closureRow>[];
    const sampleRows = f.sampleRows as SampleRow[];
    const checkEq = (a: number, b: number): void => { checked++; if (a !== b) bad++; };
    checkEq(r.choiceLedgerClosure.walksWhoseLedgerCloses as number,
      rows.filter((x) => x.closes).length);
    checkEq(r.choiceLedgerClosure.totalDeposited as number,
      rows.reduce((a, x) => a + x.deposited, 0));
    checkEq(r.choiceLedgerClosure.totalStruck as number, rows.reduce((a, x) => a + x.struck, 0));
    checkEq(r.choiceLedgerClosure.silentLosses as number, rows.reduce(
      (a, x) => a + (x.deposited - (x.struck + x.voided + x.abandoned + x.inFlight)), 0,
    ));
    checkEq(r.objectiveFidelity.unitSampledDecisionMoments as number, sampleRows.length);
    checkEq(r.objectiveFidelity.unitMomentsWhereTheCollapsedArgmaxIsTheShippedArgmax as number,
      sampleRows.filter((x) => x.sameManAtCollapsedLadder).length);
    checkEq(r.candidateSetParity.unitMomentsWithIdenticalCandidateSets as number,
      sampleRows.filter((x) => x.parity).length);
    checkEq(r.candidateSetParity.unseenMenAdmitted as number,
      sampleRows.reduce((a, x) => a + x.unseenAdmitted, 0));
  } catch {
    parsed = false;
  }
  return { parsed, checked, bad };
};

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PW-T0c — THE AMENDMENT SLICE (objective fidelity · the pin suite · the cancelled '
    + 'wind-up · PTP×PW)',
  doc: 'docs/world-model/PW-T0C-OBJECTIVE-FIDELITY.md',
  contract: 'docs/world-model/PW-PASSWEIGHT-CONTRACT.md §2 (M-PW.2 / M-PW.4); the four clauses '
    + 'FIXED by ruling #293.3; the amendment answers PW-T0b §COMMANDER CORRECTIONS 2 · 3 · 6 · 7',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'Does the amended chooser inherit the WORLD\'S OWN objective and the SHIPPED '
      + 'candidate set — so that collapsing the rungs to {1} leaves the shipped chooser exactly, '
      + 'and a mate switch under the full ladder is attributable to a RUNG? And are the two '
      + 'threading debts (the cancelled wind-up, PTP×PW) discharged without disturbing the '
      + 'banked seam or the flags-off world?',
    clauses: {
      a: 'OBJECTIVE FIDELITY + CANDIDATE-SET PARITY: price(mate, rung) = pricePassOption(mate) '
        + 'under the world\'s own flags × [q(threat@rung)·(1−touchFail@rung)] ÷ '
        + '[q(threat@1)·(1−touchFail@1)]. The shipped pricer is CALLED, not restated; the rung '
        + 'factor is the shipped joining rule\'s own two factors, normalised at the reference '
        + 'rung so the reference price IS the shipped price (the same "no double counting at the '
        + 'reference point" property `preferredPassPower` states for itself). Candidates are the '
        + 'shipped chooser\'s EXECUTABLE set over the same 6–30 m, GK-excluded window.',
      b: 'THE PIN SUITE: tests/pwWeightChooserSeat.test.ts (house form, carryChoiceSeat.test.ts) '
        + '— dormancy · threading + the closed ledger · per-rung admission · no refusal '
        + 'inheritance · ⭐ objective fidelity itself.',
      c: 'THE CANCELLED WIND-UP: counted, not re-deposited. Every cancel path means NO PASS RUNS '
        + 'and the body re-decides from a moved world, so the arm-time decision is VOID; a '
        + 're-deposit could never be consumed (the slot is gid+tick keyed and the only consumer '
        + 'has already returned). The ledger is CLOSED instead: deposited = struck + voided + '
        + 'abandoned + in flight.',
      d: 'PTP × PW: the engine THROWS when both doors are armed (zero receipt coverage for a '
        + 'lead priced at weight 1 riding a non-default ball), and the pin fails if that guard '
        + 'ever disappears.',
    },
    dormancy: '⭐⭐ THE HARD GATE, RE-PROVEN AFTER THE AMENDMENT: flags off ⇒ byte-identity, '
      + 'against the SAME clean-`HEAD` constants PW-T0b took at the dispatch commit fa35af4 '
      + '(10 bare + 10 v7-armed world-identity signatures, pooled) plus the repo\'s own league '
      + 'fingerprint.',
    receiptLaw: '⭐ PLUMBING RECEIPTS ARE NEVER EFFECT SIZES (#289). Nothing here is a football '
      + 'finding; PW-T1 owns every claim about what the armed world does.',
    declaredSrcScope: DECLARED_SRC_SCOPE,
    pinSuite: PIN_SUITE_PATH,
    baselines: {
      worldIdentityPooledAtCleanHead: WORLD_IDENTITY_POOLED_AT_HEAD,
      leagueFingerprintAtCleanHead: LEAGUE_FINGERPRINT_AT_HEAD,
      leagueFingerprintInvocation: `scripts/fingerprint.ts ${LEAGUE_FINGERPRINT_SEED} `
        + `${LEAGUE_FINGERPRINT_SEASONS}`,
      method: 'the PW-T0b method verbatim: the same signature function, the same seeds, compared '
        + 'to the digest taken in a tree where the PW seam did not exist.',
      identitySeedsProvenance: 'the identity seeds 12,492,900–909 belong to the CONSUMED PW-T0b '
        + 'block and are re-walked here ONLY to reproduce that comparison; no new claim is made '
        + 'on them.',
    },
  },
  srcReceipts: {
    seamSingularity: {
      chooserCallSitesInTheBrain: CHOOSER_CALL_SITES,
      depositSites: DEPOSIT_SITES,
      consumptionSites: CONSUME_SITES,
      reDepositSites: REDEPOSIT_SITES,
      flagReadsInTheBrain: FLAG_READS_IN_BRAIN,
      windUpVoidAccountingSites: VOID_SITES,
      chooserCallsTheShippedPricer: CHOOSER_CALLS_SHIPPED_PRICER,
    },
    orientationTermList: {
      law: 'the #291.5 canon: a divergence audit DIFFS TERM LISTS, it never evaluates shared '
        + 'expressions.',
      flaggedPath: `${CHOOSER_PATH} · choosePassWeight`,
      productionPath: `${CHOICE_PATH} · pricePassOption`,
      orientationInFlaggedTermList: ORIENTATION_IN_FLAGGED,
      orientationInProductionTermList: ORIENTATION_IN_PRODUCTION,
      orientationAbsentFromTheShippedPricerFile: ORIENTATION_ABSENT_FROM_SHIPPED_PRICER,
      flaggedTermCount: FLAGGED_TERMS.length,
      productionTermCount: PRODUCTION_TERMS.length,
    },
    cbSeatArmingBlock: {
      law: '⭐ M-PW.4: the S∧¬T guard debt falls due ONLY if this slice touches the CB seat\'s '
        + 'arming block. It does not — the block names nothing of this seam and no line of it '
        + 'appears in this slice\'s diff; the debt stays the CB seam\'s.',
      blockMentionsThisSeam: CB_ARMING_BLOCK_MENTIONS_PW,
      blockChars: CB_ARMING_BLOCK.length,
      blockSha256: CB_ARMING_BLOCK_SHA,
      cbSeatLinesInThisSlicesDiff: CB_ARMING_BLOCK_IN_DIFF,
    },
    diffScope: {
      declared: DECLARED_SRC_SCOPE, touched: TOUCHED, matches: SCOPE_MATCHES, stat: DIFF_STAT,
      against: PRE_SLICE_HEAD,
      law: 'the diff is taken against the PW-T0b RESULT commit, so this receipt cannot go '
        + 'silently empty once the amendment lands.',
    },
    pinSuite: {
      path: PIN_SUITE_PATH,
      bytes: PIN_SUITE_BYTES.length,
      tests: PIN_IT_COUNT,
      markersMissing: PIN_MISSING,
    },
  },
  receipts: RECEIPTS,
  worldIdentity: {
    seeds: IDENTITY_SEEDS,
    rows: identityRows,
    pooled: IDENTITY_POOLED,
    pooledAtCleanHead: WORLD_IDENTITY_POOLED_AT_HEAD,
    identical: IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD,
    completeBaseline: IDENTITY_COMPLETE,
    leagueFingerprint: LEAGUE_FP,
  },
  run: {
    receiptSeeds: RECEIPT_SEEDS,
    armsPerReceiptSeed: ['door-shut v7', 'pw armed · ladder {1}', 'pw armed · ladder {0.85,1,1.15}'],
    smokeSeeds: SMOKE_SEEDS,
    sampleSeeds: SAMPLE_SEEDS,
    cancelSeed: CANCEL_SEED,
    ladder: LADDER,
    collapsedLadder: COLLAPSED,
  },
  perWalkLedgers: {
    doorShut: OFF_WALKS.map((w) => ({ seed: w.seed, ...w.ledger })),
    collapsedLadder: FID_WALKS.map((w) => ({ seed: w.seed, ...w.ledger })),
    fullLadder: FULL_WALKS.map((w) => ({ seed: w.seed, ...w.ledger })),
    smoke: SMOKE_WALKS.map((w) => ({ seed: w.seed, ...w.ledger })),
  },
  walkSignatures: RECEIPT_SEEDS.map((s, i) => ({
    seed: s,
    doorShut: OFF_WALKS[i].signature,
    collapsedLadder: FID_WALKS[i].signature,
    fullLadder: FULL_WALKS[i].signature,
    collapsedIsIdentical: FID_WALKS[i].signature === OFF_WALKS[i].signature,
    fullLadderDiffers: FULL_WALKS[i].signature !== OFF_WALKS[i].signature,
  })),
  closureRows: CLOSURE,
  sampleRows: SAMPLE_ROWS,
  sampleControl,
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
    '⭐ THIS IS A PLUMBING AMENDMENT PROOF. Not one number here is an effect size, a football '
      + 'finding or a usage claim (#289 canon). PW-T1 owns every claim about the armed world.',
    'The rung distributions are RECEIPT-GRADE (a handful of seeds, no CI, no denominator '
      + 'discipline): they establish non-degeneracy after the re-base, nothing more.',
    'The mate-switch counts under the full ladder are NOT a measure of how much the weight axis '
      + 'is worth — they are the receipt that the axis is now the ONLY thing that can move the '
      + 'man. Whether those switches are good football is PW-T1\'s battery.',
    'The SEEN-UNREAD parity branch is structural but measured EMPTY in the walked worlds; it is '
      + 'reported as such and not counted as evidence.',
    'No wall-cost delta is claimed. The structural cost is now FOUR oracle questions per mate '
      + '(one shipped pricing at power 1 + three rungs at power × orientation), read off the '
      + 'ledger rather than assumed.',
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
  const crossPath = '/tmp/pw-t0c-cross-out.json';
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
banner(`\n  [pw-t0c] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pw-t0c] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
banner(`  [pw-t0c] FIDELITY ${FIDELITY_IDENTICAL}/${RECEIPT_SEEDS.length} worlds byte-identical at `
  + `ladder {1} · ${FID_DECISIONS} decisions · ${FID_MATE_SWITCHES} mate switches`);
banner(`  [pw-t0c] full ladder: ${FULL_LADDER_MOVES}/${RECEIPT_SEEDS.length} worlds moved · `
  + `${FULL_MATE_SWITCHES}/${FULL_DECISIONS} decisions switched the man`);
banner(`  [pw-t0c] unit sample ${SAMPLE_ROWS.length} moments · same man ${SAME_MAN} · parity `
  + `${PARITY_OK} · prices ${PRICE_IDENTICAL}/${PRICE_ROWS}`);
banner(`  [pw-t0c] ledger closes ${CLOSURE_OK}/${CLOSURE.length} · silent losses ${SILENT_LOSSES} · `
  + `cancel exhibit ${cancelExhibit.voidedBefore}→${cancelExhibit.voidedAfter}`);
banner(`  [pw-t0c] world identity ${IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD ? 'IDENTICAL' : 'MOVED'}`
  + ` · league fingerprint ${LEAGUE_FP === LEAGUE_FINGERPRINT_AT_HEAD ? 'UNMOVED' : LEAGUE_FP}`);
banner(`  [pw-t0c] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
