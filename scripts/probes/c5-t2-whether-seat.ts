// C5 T2 — THE WHETHER SEAT: THE FORK STAGE (price-fidelity, out of sample).
// Contract: docs/world-model/C5-T2-WHETHER-SEAT.md §3 (FROZEN) · rulings #64.3
// (build authorized), #64.1 (R-B adopted), #29.3 (the unpark predicate), #41.2
// (the estimand), #48.4 (fork window ex ante), #49.3 (event-keyed receipts),
// #38.1 (whole sign space), #20 (cluster = match seed), #46.2 (block disjoint).
//
// ⚠ THIS PROBE DOES NOT RUN FOR REAL UNTIL THE COMMANDER SIGNS OFF THE CEILING
// on the sizing smoke's MEASURED chooser-hold rate (§5.2 / #44.5). It is WRITTEN,
// tsc-clean, and engineering-smoked capped here; the real run is deferred.
//
// At every CHOOSER-HOLD moment (an eligible decision where THIS body's PERCEIVED
// cell's certified interval reaches zero, R-B) the probe forks the world two
// ways off the SAME pre-fork state — paired by construction: the SEAT's committed
// HOLD-k vs the untouched act-now continuation (A0). Both are scored on the
// census's own shot-for axis at the 240-tick horizon. It ships NOTHING; the
// certified table is INJECTED (P2 convention), the fingerprint is unchanged.
import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { whetherEyeDecision, type RecensusCostTable } from '../../src/ai/whetherEye';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen staging (§5.1) ---------------------------------------------------
const MATCH_DURATION = 240;
/** Fork build block: seeds 8,510,000+ (fresh, above every consumed range, §5.3). */
const BUILD_SEED_START = envInt('C5T2_FORK_SEED', 8_510_000);
/** Provisional ceiling (§5.1); FINALIZED at the smoke + commander sign-off (#44.5). */
const MAX_MATCHES = envInt('C5T2_FORK_MAX', 1_600);
const PER_MATCH_CAP = 80; // census verbatim
const MOMENT_SPACING = 30; // census verbatim
const HORIZON = 240; // census axis verbatim
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
const BOOTSTRAP_RESAMPLES = 2_000;
const BOOTSTRAP_SEED = 50_070; // §5.1, new seed
const RECEIPT_CAP = 1_000; // per-class per-record (#49.3)
const INJURY_REPOSITION_M = 3.0;
// The certified DEV floor (§3.4(B)) and the certified price + band (§3.4(A)).
const N_HOLD_FLOOR = 446;
const SHARE_FLOOR = 0.0029; // 0.29% of eligible moments
const THETA_CERT = -0.006726; // certified 0|0|0 k30 point cost
const CI_CERT: [number, number] = [-0.04662, 0.031461]; // certified CI
const CONTROL_SAMPLE = 25; // X-CONTROL: sample 1-in-25 records
const X5_BITE_FLOOR = 0.90;
const TABLE_PATH = process.env.C5T2_TABLE ?? 'docs/world-model/data/c5-recensus.json';
const OUT_PATH = process.env.C5T2_FORK_OUT ?? 'docs/world-model/data/c5-t2-whether-seat.json';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';

const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});
const distance = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const mean = (xs: readonly number[]): number =>
  (xs.length === 0 ? NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : NaN);

// --- inject the certified table (never bundled in src, P2 §2) ----------------
const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (raw.tableSha !== EXPECTED_TABLE_SHA) {
  throw new Error(`certified table SHA drift: ${raw.tableSha} != ${EXPECTED_TABLE_SHA}`);
}
const params = raw.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: params.pressureBands, staleBands: params.staleBands,
  supportCuts: params.supportCuts, supportWindowM: params.supportWindowM,
  cells: raw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper, reachesZero: k.reachesZero,
    })),
  })),
};

type Band = 0 | 1 | 2;
const pressureBandOf = (v: number): Band =>
  (v < TABLE.pressureBands[0] ? 0 : v < TABLE.pressureBands[1] ? 1 : 2);
const staleBandOf = (v: number): Band =>
  (v < TABLE.staleBands[0] ? 0 : v < TABLE.staleBands[1] ? 1 : 2);
const supportBandOf = (v: number): Band =>
  (v < TABLE.supportCuts.low ? 0 : v >= TABLE.supportCuts.high ? 2 : 1);

/** A digest of the whole visible world — X-CONTROL / X5 bite pin. */
const stateSignature = (match: Match): string => {
  const d = createHash('sha256');
  d.update(`${match.simTick}|${match.phase}|${match.score[0]}:${match.score[1]}`);
  d.update(`|${match.ball.pos.x},${match.ball.pos.y},${match.ball.z}`);
  d.update(`|${match.ball.vel.x},${match.ball.vel.y},${match.ball.vz}`);
  d.update(`|${match.ball.owner?.gid ?? -1}|${match.ball.lastTouch?.gid ?? -1}`);
  for (const p of match.allPlayers) d.update(`|${p.gid},${p.pos.x},${p.pos.y},${p.vel.x},${p.vel.y},${p.stamina}`);
  for (const t of match.teams) d.update(`|${t.stats.shots},${t.stats.passes},${t.stats.tackles},${t.stats.goals}`);
  return d.digest('hex');
};

// --- per-record receipts (#49.3) ---------------------------------------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string): void => {
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

interface ArmOutcome {
  readonly shot: boolean;
  readonly conceded: boolean;
  readonly survivedHold: boolean | null;
  readonly lostToTackle: boolean | null;
  readonly endedInWindow: boolean;
  readonly stalled: boolean;
  readonly paused: boolean;
  readonly injured: boolean;
  readonly injuredGid: number;
  readonly signature: string;
}

/**
 * Run one fork forward and read the axis. holdTicks===0 is the untouched A0
 * (act-now); holdTicks>0 forces the SEAT's committed hold via the C5 T0 hold
 * machinery (forcedHold) — the identical physical hold the whetherEye seam
 * commits (both label the action `ShieldHold` to `untilTick`). The percept-
 * compliant shield rides here exactly as it does live.
 */
const runArm = (before: Match, ownerGid: number, holdTicks: number): ArmOutcome => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  const side = owner.side;
  const attacking = fork.teams[side];
  const defending = fork.teams[1 - side];
  const shotsBefore = attacking.stats.shots;
  const concededBefore = defending.stats.shots;
  const tacklesBefore = defending.stats.tackles;
  const startTick = fork.simTick;
  if (holdTicks > 0) fork.forcedHold = { gid: ownerGid, untilTick: startTick + holdTicks };
  let shot = false;
  let conceded = false;
  let horizonReached = false;
  let survivedHold: boolean | null = holdTicks > 0 ? true : null;
  let lostDuringHold = false;
  let paused = false;
  let injured = false;
  let injuredGid = -1;
  let prevDrb = owner.attrs.dribbling;
  let prevX = owner.pos.x;
  let prevY = owner.pos.y;
  for (let tick = 0; tick < HORIZON + holdTicks; tick++) {
    if (fork.finished) break;
    fork.step(DT);
    const elapsed = fork.simTick - startTick;
    if (fork.phase !== 'playing') paused = true;
    if (!injured && elapsed <= HORIZON) {
      const body = fork.allPlayers[ownerGid];
      if (body !== undefined) {
        const jump = Math.hypot(body.pos.x - prevX, body.pos.y - prevY);
        const attrsMutated = body.attrs.dribbling !== prevDrb;
        const teleported = fork.phase === 'playing' && jump > INJURY_REPOSITION_M;
        if (attrsMutated || teleported) { injured = true; injuredGid = ownerGid; }
        prevDrb = body.attrs.dribbling; prevX = body.pos.x; prevY = body.pos.y;
      }
    }
    if (holdTicks > 0 && elapsed === holdTicks && fork.ball.owner?.gid !== ownerGid) {
      survivedHold = false; lostDuringHold = true;
    }
    if (holdTicks > 0 && elapsed <= holdTicks && fork.ball.owner?.gid !== ownerGid) lostDuringHold = true;
    if (elapsed === HORIZON) {
      shot = attacking.stats.shots > shotsBefore;
      conceded = defending.stats.shots > concededBefore;
      horizonReached = true;
      break;
    }
  }
  if (!horizonReached) {
    shot = attacking.stats.shots > shotsBefore;
    conceded = defending.stats.shots > concededBefore;
  }
  return {
    shot, conceded,
    survivedHold: holdTicks > 0 ? survivedHold && !lostDuringHold : null,
    lostToTackle: holdTicks > 0 ? lostDuringHold && defending.stats.tackles > tacklesBefore : null,
    endedInWindow: !horizonReached && fork.finished,
    stalled: !horizonReached && !fork.finished,
    paused, injured, injuredGid, signature: stateSignature(fork),
  };
};

const decidedActionOf = (before: Match, ownerGid: number): string => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  let action = owner.action.type;
  const startTick = fork.simTick;
  for (let t = 0; t < HORIZON; t++) {
    if (fork.finished) break;
    fork.step(DT);
    if (fork.simTick - startTick === 1) { action = owner.action.type; break; }
  }
  return action;
};

const trueCellOf = (match: Match, owner: Player): [Band, Band, Band] => {
  const side = owner.side;
  const support = match.teams[side].players.filter((p) => (
    p.gid !== owner.gid && p.role !== 'GK' && !p.sentOff
    && distance(p.pos, owner.pos) >= SUPPORT_MIN_M && distance(p.pos, owner.pos) <= SUPPORT_MAX_M
  )).length;
  return [
    pressureBandOf(pressureAt(owner.pos, match.teams[1 - side].players)),
    staleBandOf(match.teams[side].staleTime),
    supportBandOf(support),
  ];
};

// --- cluster bootstrap (cluster unit = match seed, #20) ----------------------
interface CI { point: number; lower: number; upper: number; clusters: number }
const clusterBootstrap = (
  rows: readonly { cluster: number; value: number }[], offset: number,
): CI => {
  const byCluster = new Map<number, number[]>();
  for (const row of rows) {
    const b = byCluster.get(row.cluster);
    if (b === undefined) byCluster.set(row.cluster, [row.value]); else b.push(row.value);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let sum = 0; let n = 0;
    for (let i = 0; i < clusters.length; i++) {
      for (const v of clusters[rng.int(0, clusters.length - 1)]) { sum += v; n += 1; }
    }
    if (n > 0) draws.push(sum / n);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const point = rows.length === 0 ? NaN : rows.reduce((s, r) => s + r.value, 0) / rows.length;
  return { point, lower: at(0.025), upper: at(0.975), clusters: clusters.length };
};
/** CI-overlap consistency (§3.4(A)): two independent intervals overlap. */
const overlaps = (a: [number, number], b: [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];

interface HoldRecord {
  cluster: number; seed: number; tick: number; gid: number; k: number;
  holdShot: boolean; actNowShot: boolean;
  holdConceded: boolean; actNowConceded: boolean;
  survivedHold: boolean | null; lostToTackle: boolean | null;
  perceivedCell: string; trueCell: string;
  cloneOk: boolean; controlOk: boolean | null;
}

const runExperiment = () => {
  const receipts: ReceiptBook = {};
  const holds: HoldRecord[] = [];
  const classCounts: Record<string, number> = {
    'D-HOLD': 0, 'E-ACTNOW-DECLINED': 0, 'E-ABSTAIN-UNSEEN': 0, 'E-NOCELL': 0,
  };
  const coverageExcl: Record<string, number> = {};
  const exceptions = { paused: 0, injured: 0, matchEnd: 0, unexplained: 0 };
  const clustersWithHold = new Set<number>();
  let matches = 0;
  let eligible = 0;
  let controlChecked = 0;
  let controlUnexplained = 0;
  let biteSeen = 0;
  let biteDiff = 0;

  for (let seed = BUILD_SEED_START; seed < BUILD_SEED_START + MAX_MATCHES; seed++) {
    matches += 1;
    const cluster = seed - BUILD_SEED_START;
    const match = matchOf(seed);
    let sinceLast = MOMENT_SPACING;
    let inMatch = 0;
    while (!match.finished && inMatch < PER_MATCH_CAP) {
      const owner: Player | null = match.ball.owner;
      const qualifies = match.phase === 'playing' && owner !== null
        && owner.role !== 'GK' && !owner.sentOff
        && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
      if (qualifies) {
        const gid = owner!.gid;
        const tick = match.simTick;
        if (owner!.firstTouchWindow > 0) {
          coverageExcl['X-FIRSTTOUCH'] = (coverageExcl['X-FIRSTTOUCH'] ?? 0) + 1;
        } else if (match.restartKickGid === gid) {
          coverageExcl['X-MUSTKICK'] = (coverageExcl['X-MUSTKICK'] ?? 0) + 1;
        } else {
          const before = cloneSimulationState(match);
          const decided = decidedActionOf(before, gid);
          if (decided === 'Shoot') {
            coverageExcl['X-A0-SHOOT'] = (coverageExcl['X-A0-SHOOT'] ?? 0) + 1;
          } else if (decided === 'ClearBall') {
            coverageExcl['X-A0-CLEAR'] = (coverageExcl['X-A0-CLEAR'] ?? 0) + 1;
          } else {
            eligible += 1;
            const cloneOwner = before.allPlayers.find((p) => p.gid === gid)!;
            const decision = whetherEyeDecision(cloneOwner, before, TABLE);
            classCounts[decision.cls] += 1;
            if (decision.cls === 'D-HOLD' && decision.k !== null) {
              // CHOOSER-HOLD MOMENT — fork paired: hold-k vs act-now (A0).
              const actNow = runArm(before, gid, 0);
              const hold = runArm(before, gid, decision.k);
              // X-CLONE: the act-now fork must reproduce A0's own signature; a
              // second A0 fork off the same state is byte-identical.
              const cloneOk = runArm(before, gid, 0).signature === actNow.signature;
              // X-CONTROL (1-in-25): act-now reproduces the base continuation.
              let controlOk: boolean | null = null;
              if ((clustersWithHold.size + holds.length) % CONTROL_SAMPLE === 0) {
                const control = cloneSimulationState(before);
                for (let s = 0; s < HORIZON && !control.finished; s++) control.step(DT);
                controlOk = stateSignature(control) === actNow.signature;
                controlChecked += 1;
                if (!controlOk) controlUnexplained += 1;
              }
              biteSeen += 1;
              if (hold.signature !== actNow.signature) biteDiff += 1;
              for (const arm of [actNow, hold]) {
                if (arm.paused) { exceptions.paused += 1; addReceipt(receipts, 'E-PAUSED', seed, tick, gid, 'window-non-playing'); }
                if (arm.injured) { exceptions.injured += 1; addReceipt(receipts, 'E-INJURY', seed, tick, arm.injuredGid, 'attrs-or-reposition'); }
                if (arm.endedInWindow) { exceptions.matchEnd += 1; addReceipt(receipts, 'E-MATCHEND', seed, tick, gid, 'match-ended-in-window'); }
                if (arm.stalled) { exceptions.unexplained += 1; addReceipt(receipts, 'UNEXPLAINED', seed, tick, gid, 'window-stalled'); }
              }
              clustersWithHold.add(cluster);
              holds.push({
                cluster, seed, tick, gid, k: decision.k,
                holdShot: hold.shot, actNowShot: actNow.shot,
                holdConceded: hold.conceded, actNowConceded: actNow.conceded,
                survivedHold: hold.survivedHold, lostToTackle: hold.lostToTackle,
                perceivedCell: decision.cell ?? '?',
                trueCell: trueCellOf(match, owner!).join('|'),
                cloneOk, controlOk,
              });
            }
          }
        }
        sinceLast = 0;
        inMatch += 1;
      }
      match.step(DT);
      sinceLast += 1;
    }
    // Delivery-driven stop (§5.1): finish the match once the floor clears.
    const share = eligible > 0 ? holds.length / eligible : 0;
    if (holds.length >= N_HOLD_FLOOR && share >= SHARE_FLOOR) break;
  }

  // --- (A) PRICE-FIDELITY (the estimand §1.3 / §3.4A) ------------------------
  const fidelity = clusterBootstrap(holds.map((h) => ({
    cluster: h.cluster, value: (h.holdShot ? 1 : 0) - (h.actNowShot ? 1 : 0),
  })), 0);
  const ciLive: [number, number] = [fidelity.lower, fidelity.upper];
  const diff = clusterBootstrap(holds.map((h) => ({
    cluster: h.cluster, value: ((h.holdShot ? 1 : 0) - (h.actNowShot ? 1 : 0)) - THETA_CERT,
  })), 1);

  // --- (B) DELIVERY (the two-part DEV floor §3.4B) --------------------------
  const share = eligible > 0 ? holds.length / eligible : 0;
  const delivered = holds.length >= N_HOLD_FLOOR && share >= SHARE_FLOOR;

  // --- mediators (§3.5) ------------------------------------------------------
  const concede = clusterBootstrap(holds.map((h) => ({
    cluster: h.cluster, value: (h.holdConceded ? 1 : 0) - (h.actNowConceded ? 1 : 0),
  })), 2);
  const ctxAgree = holds.length === 0 ? NaN
    : holds.filter((h) => h.perceivedCell === h.trueCell).length / holds.length;
  const anatomy = {
    survived: round(mean(holds.map((h) => (h.survivedHold ? 1 : 0)))),
    lostToTackle: round(mean(holds.map((h) => (h.lostToTackle ? 1 : 0)))),
  };

  // --- gates (§3.2) ----------------------------------------------------------
  const cloneCoverage = holds.length === 0 ? 1 : holds.filter((h) => h.cloneOk).length / holds.length;
  const bite = biteSeen === 0 ? NaN : biteDiff / biteSeen;
  const gates = {
    xCloneAllOk: holds.every((h) => h.cloneOk), // X-CLONE 100%
    xControlZeroUnexplained: controlUnexplained === 0, // X-CONTROL
    x5SeamBites: Number.isFinite(bite) ? bite >= X5_BITE_FLOOR : false, // X5
    unexplainedZero: exceptions.unexplained === 0, // ledger
  };

  return {
    experiment: 'C5-T2-WHETHER-FORK',
    authority: 'C5-T2-WHETHER-SEAT',
    tableSha: EXPECTED_TABLE_SHA,
    parameters: {
      buildSeedStart: BUILD_SEED_START, maxMatches: MAX_MATCHES, perMatchCap: PER_MATCH_CAP,
      momentSpacing: MOMENT_SPACING, horizon: HORIZON, bootstrapSeed: BOOTSTRAP_SEED,
      nHoldFloor: N_HOLD_FLOOR, shareFloor: SHARE_FLOOR, thetaCert: THETA_CERT, ciCert: CI_CERT,
    },
    matches, eligible, nHold: holds.length,
    coverage: { eligible, exclusions: coverageExcl },
    classCounts,
    delivery: {
      nHold: holds.length, share: round(share), floorShare: SHARE_FLOOR, floorN: N_HOLD_FLOOR,
      delivered,
    },
    fidelity: {
      deltaLive: round(fidelity.point), ciLive: [round(ciLive[0]), round(ciLive[1])],
      thetaCert: THETA_CERT, ciCert: CI_CERT,
      overlap: overlaps(ciLive, CI_CERT),
      pairedDiff: { point: round(diff.point), lower: round(diff.lower), upper: round(diff.upper) },
    },
    mediators: {
      mCtxAgree: round(ctxAgree), mConcede: { point: round(concede.point), lower: round(concede.lower), upper: round(concede.upper) },
      mAnatomy: anatomy,
      mAbstain: {
        actNowDeclined: classCounts['E-ACTNOW-DECLINED'],
        abstainUnseen: classCounts['E-ABSTAIN-UNSEEN'],
        noCell: classCounts['E-NOCELL'],
      },
    },
    exceptions,
    controlChecked,
    seamBiteShare: round(bite),
    cloneCoverage: round(cloneCoverage),
    receipts: {
      cap: RECEIPT_CAP,
      counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
    },
    gates,
  };
};

// --- the sign space (§3.6), decided by the numbers, never after them --------
const signSpace = (o: ReturnType<typeof runExperiment>): string => {
  const harnessFail = !Object.values(o.gates).every(Boolean);
  if (harnessFail) return 'F5-HARNESS-FAIL';
  if (!o.delivery.delivered) return 'F2-DELIVERY-SHORTFALL';
  if (o.fidelity.ciLive[1] < o.fidelity.ciCert[0]) return 'F3-PRICE-DID-NOT-TRANSFER';
  if (o.fidelity.ciLive[0] > o.fidelity.ciCert[1]) return 'F4-SURPRISE-POSITIVE';
  if (o.fidelity.overlap) return 'F1-CONFIRM';
  return 'F-UNRESOLVED';
};

// --- X-DET: two invocations byte-identical + canonical SHA (§3.2) ------------
const first = runExperiment();
const second = runExperiment();
const firstJson = JSON.stringify(first);
const deterministic = firstJson === JSON.stringify(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const reading = signSpace(first);
const gates = { ...first.gates, xDetDeterministic: deterministic };
const output = { ...first, reading, gates, sha256 };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pp = (x: number) => `${(x * 100).toFixed(2)}pp`;
const pct = (x: number) => `${(x * 100).toFixed(2)}%`;
console.error(
  `C5-T2-WHETHER-FORK ${reading} · ${output.matches} matches · eligible ${output.eligible}`
  + ` · N_hold ${output.nHold} (share ${pct(output.delivery.share)}, delivered ${output.delivery.delivered})`
  + ` · delta_live ${pp(output.fidelity.deltaLive)} CI[${pp(output.fidelity.ciLive[0])}, ${pp(output.fidelity.ciLive[1])}]`
  + ` vs theta_cert ${pp(output.fidelity.thetaCert)} CI[${pp(CI_CERT[0])}, ${pp(CI_CERT[1])}] overlap ${output.fidelity.overlap}`
  + ` · M-CTX agree ${pct(output.mediators.mCtxAgree)} · bite ${pct(output.seamBiteShare)} · clone ${pct(output.cloneCoverage)}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
