/**
 * CB T2 — ⭐⭐ THE BOTH-DOORS-ARMED FIRST ROW (docs/world-model/CB-T2-CHOICE-SEAT.md §ROW-0).
 *
 * Ruling #268.3(3) RATIFIED this as CB-T2's FIRST row, before any pricing work: H-CB.1's own
 * sentence spans BOTH mechanisms ("a defender ARRIVING AT SPEED eliminated by a WELL-AIMED
 * TOUCH"), and CB-T0's smoke and CB-T1's exam both armed the two doors ONE AT A TIME.
 *
 * ⭐ INSTRUMENT-ONLY, and deliberately so: `src/**` is byte-untouched by this row (the srcClean
 * check). The seam is CB-T0's; the doser is CB-T1's FROZEN policy re-implemented from that stage
 * doc's published §FORM text (E1–E5 + the away-from-the-nearest-challenger aim rule); and NOTHING
 * here is a pricing input to the choice seat — this is a REPORTED world row (#203), never a gate
 * and never a design input. It runs BEFORE the freeze commit precisely so its numbers cannot
 * shape the frozen design, and the stage doc states exactly what it saw (the CB-C0 §DEV 1 idiom).
 *
 * FOUR PAIRED ARMS on the same seeds: OFF · COMMIT (door a) · TOUCH (door b) · ⭐ BOTH.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2/#262.2) including the ENGINE's own doors.
 *   accepted: CBT2R_N · CBT2R_OUT (each an override ⇒ PREFLIGHT ⇒ the guard block; a preflight
 *   may never write a canonical repo path — checked on the RESOLVED absolute path).
 *
 * RUN:  npx tsx scripts/probes/cb-t2-both-doors-row.ts
 * EXIT: 0 = the row ran and its structural checks held · 1 = a check failed · 2 = a refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match, type MatchConfig } from '../../src/sim/Match';
import { CONTEST_RADIUS, DT, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { a4MatchFlags } from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ---------------- env: whitelist-or-refuse ---------------- */
const ENV_WHITELIST = ['CBT2R_N', 'CBT2R_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'EDS_SCALE_PITCH', 'EDS_SCALE_SPEED', 'EDS_SCALE_BALL', 'EDS_SCALE_TIME', 'EDS_SCALE_STAMINA',
] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('CBT2R_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  banner(`FATAL: unrecognised env ${rogue.join(', ')} — whitelist-or-refuse (#261.2)`);
  process.exit(2);
}
const doorsSet = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (doorsSet.length > 0) {
  banner(`FATAL: the ENGINE's own doors are set (${doorsSet.join(', ')}) — refused (#261.2)`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.CBT2R_N);
const OUT_ENV = process.env.CBT2R_OUT;
const OVERRIDES = [
  { name: 'CBT2R_N', set: N_ENV !== null },
  { name: 'CBT2R_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === CANONICAL_DIR_ABS || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV
  ?? (IS_PREFLIGHT ? '/tmp/cb-t2-both-doors-preflight.json'
    : 'docs/world-model/data/cb-t2-both-doors-row.json');
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner(`FATAL: a PREFLIGHT may not write a canonical repo path (${OUT_PATH}) — #262.2`);
  process.exit(2);
}

/* ---------------- seeds (band 12,474,000–999, ruling #268.4) ---------------- */
const GUARD_BLOCK = 12_474_050;
const ROW_BASE = IS_PREFLIGHT ? GUARD_BLOCK : 12_474_000;
const N = N_ENV ?? 12;
const SEEDS = Array.from({ length: N }, (_, i) => ROW_BASE + i);

/* ---------------- helpers ---------------- */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      return Object.keys(o).sort().reduce<Record<string, unknown>>((a, k) => {
        a[k] = walk(o[k]); return a;
      }, {});
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : v);
const sum = (a: readonly number[]): number => a.reduce((x, y) => x + y, 0);
const mean = (a: readonly number[]): number => (a.length === 0 ? Number.NaN : sum(a) / a.length);
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/* ---------------- the four arms ---------------- */
type ArmName = 'off' | 'commit' | 'touch' | 'both';
const ARMS: readonly ArmName[] = ['off', 'commit', 'touch', 'both'];
const armConfig = (arm: ArmName): Partial<MatchConfig> => ({
  cbCommitPhysics: arm === 'commit' || arm === 'both',
  cbTouchPast: arm === 'touch' || arm === 'both',
});
const matchOf = (seed: number, arm: ArmName): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
  ...a4MatchFlags(3),
  ...armConfig(arm),
});

/**
 * CB-T1's FROZEN dosing policy, re-implemented from that stage doc's published §FORM text:
 * E1 playing · E2 outfield owner · E3 no keeper hold and off the kick cooldown · E4 no knock in
 * flight (the ENGINE's own `dribbleTouch` marker — the whole cadence rule) · E5 at least one
 * opponent inside CONTEST_RADIUS. The aim is the unit vector AWAY FROM THE NEAREST CHALLENGER,
 * deliberately independent of `beatsDefender`.
 */
interface Dose { carrierGid: number; side: number; dirX: number; dirY: number }
function eligibleDose(m: Match): Dose | null {
  if (m.phase !== 'playing') return null;
  const owner: Player | null = m.ball.owner;
  if (owner === null || owner.role === 'GK' || owner.sentOff) return null;
  if (!(owner.gkHoldTimer <= 0 && owner.kickCooldown <= 0)) return null;
  if (m.dribbleTouch !== null) return null;
  let nearest: Player | null = null;
  let bestD = Infinity;
  for (const o of m.teams[1 - owner.side].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - m.ball.pos.x, o.pos.y - m.ball.pos.y);
    if (d <= CONTEST_RADIUS && d < bestD) { bestD = d; nearest = o; }
  }
  if (nearest === null) return null;
  let dx = m.ball.pos.x - nearest.pos.x;
  let dy = m.ball.pos.y - nearest.pos.y;
  let len = Math.hypot(dx, dy);
  if (!(len > 1e-9)) { dx = -owner.heading.x; dy = -owner.heading.y; len = Math.hypot(dx, dy); }
  return { carrierGid: owner.gid, side: owner.side, dirX: dx / len, dirY: dy / len };
}

/* ---------------- the walker ---------------- */
interface Row {
  seed: number; arm: ArmName;
  duels: number; duelsWon: number; duelsMissed: number;
  armedChallenges: number; geometricMisses: number; recoveries: number; recoverySeconds: number;
  knocks: number; challengers: number; predBeaten: number; cleanBeats: number; pushMetres: number;
  /** THE RACE, scored against the engine's own captor inside the knock's OWN written window. */
  raceCaptured: number; raceUncaptured: number; raceCarrierRegather: number;
  knockRetained: number; knockLost: number;
  turnovers: number; segments: number; segmentTicks: number;
  goals: number; shots: number; fouls: number; yellows: number; reds: number;
  pressedFirstRec: number; firstRec: number;
}
const zero = (seed: number, arm: ArmName): Row => ({
  seed, arm,
  duels: 0, duelsWon: 0, duelsMissed: 0,
  armedChallenges: 0, geometricMisses: 0, recoveries: 0, recoverySeconds: 0,
  knocks: 0, challengers: 0, predBeaten: 0, cleanBeats: 0, pushMetres: 0,
  raceCaptured: 0, raceUncaptured: 0, raceCarrierRegather: 0,
  knockRetained: 0, knockLost: 0,
  turnovers: 0, segments: 0, segmentTicks: 0,
  goals: 0, shots: 0, fouls: 0, yellows: 0, reds: 0,
  pressedFirstRec: 0, firstRec: 0,
});

const MARKER_TICKS = Math.round(1.6 / DT);
const WON_COOLDOWN = 0.5;
/** the OTHER mechanics' own cooldown constants (slide / tactical / smother family) */
const OTHER_MECHANIC_COOLDOWNS = [2.5, 2.0, 0.9];
const GK_SMOTHER_STUN = 0.8;

interface OpenKnock {
  carrierGid: number; side: number; endTick: number; markerTick: number;
  captor: number | null; settled: boolean;
}

function walk(seed: number, arm: ArmName): Row {
  const m = matchOf(seed, arm);
  const row = zero(seed, arm);
  const live = arm === 'touch' || arm === 'both';
  const prevCd = new Map<number, number>();
  for (const p of m.allPlayers) prevCd.set(p.gid, p.tackleCooldown);
  let prevKnocks = m.cbLedger.touchPasts;
  let prevChal = m.cbLedger.touchPastChallengers;
  let prevBeaten = m.cbLedger.touchPastBeaten;
  let prevClean = m.cbLedger.touchPastCleanBeats;
  let prevPush = m.cbLedger.touchPastPushMetres;
  const open: OpenKnock[] = [];
  let curSide: number | null = null;
  let curTicks = 0;
  let prevOwnerGid: number | null = null;

  while (!m.finished) {
    m.forcedTouchPast = null;
    const dose = live ? eligibleDose(m) : null;
    if (dose !== null) m.forcedTouchPast = { gid: dose.carrierGid, dir: { x: dose.dirX, y: dose.dirY } };

    m.step(DT);
    const tick = m.simTick;
    const owner: Player | null = m.ball.owner;

    /* ---- duels (CB-C0's detector, narrowed per CB-T0 §DEV 7) ---- */
    for (const p of m.allPlayers) {
      const before = prevCd.get(p.gid) ?? 0;
      const now = p.tackleCooldown;
      prevCd.set(p.gid, now);
      if (!(now > before)) continue;
      if (OTHER_MECHANIC_COOLDOWNS.some((c) => Math.abs(now - c) < 1e-9)) continue;
      if (p.role === 'GK' && Math.abs(p.stunTimer - GK_SMOTHER_STUN) < 1e-9) continue;
      row.duels += 1;
      if (Math.abs(now - WON_COOLDOWN) < 1e-9) row.duelsWon += 1; else row.duelsMissed += 1;
    }

    /* ---- the knock, reconstructed from the ledger's own deltas ---- */
    const dK = m.cbLedger.touchPasts - prevKnocks;
    if (dK > 0 && dose !== null) {
      row.knocks += dK;
      row.challengers += m.cbLedger.touchPastChallengers - prevChal;
      row.predBeaten += m.cbLedger.touchPastBeaten - prevBeaten;
      row.cleanBeats += m.cbLedger.touchPastCleanBeats - prevClean;
      row.pushMetres += m.cbLedger.touchPastPushMetres - prevPush;
      const carrier = m.allPlayers.find((p) => p.gid === dose.carrierGid);
      if (carrier) {
        // ⭐ THE RACE WINDOW IS THE ENGINE'S OWN WRITE (the carrier's `kickCooldown`), never a
        // probe constant — CB-T1's G-RACE form.
        open.push({
          carrierGid: carrier.gid, side: dose.side,
          endTick: tick + Math.max(1, Math.round(carrier.kickCooldown / DT)),
          markerTick: tick + MARKER_TICKS, captor: null, settled: false,
        });
      }
    }
    prevKnocks = m.cbLedger.touchPasts;
    prevChal = m.cbLedger.touchPastChallengers;
    prevBeaten = m.cbLedger.touchPastBeaten;
    prevClean = m.cbLedger.touchPastCleanBeats;
    prevPush = m.cbLedger.touchPastPushMetres;

    /* ---- resolve open knocks against the ENGINE's own captor ---- */
    for (let i = open.length - 1; i >= 0; i--) {
      const k = open[i];
      if (!k.settled && tick <= k.endTick && owner !== null) {
        k.captor = owner.gid; k.settled = true;
        row.raceCaptured += 1;
        if (owner.gid === k.carrierGid) row.raceCarrierRegather += 1;
      }
      if (tick >= k.endTick && !k.settled) { k.settled = true; row.raceUncaptured += 1; }
      if (tick >= k.markerTick) {
        if (owner !== null && owner.side === k.side) row.knockRetained += 1;
        else row.knockLost += 1;
        open.splice(i, 1);
      }
    }

    /* ---- churn / pressing ---- */
    if (owner !== null) {
      if (curSide === null) { curSide = owner.side; curTicks = 0; }
      else if (owner.side !== curSide) {
        row.segments += 1; row.segmentTicks += curTicks; row.turnovers += 1;
        curSide = owner.side; curTicks = 0;
      }
      if (owner.gid !== prevOwnerGid) {
        let nearest = Infinity;
        for (const o of m.teams[1 - owner.side].players) {
          if (o.sentOff) continue;
          nearest = Math.min(nearest, Math.hypot(o.pos.x - owner.pos.x, o.pos.y - owner.pos.y));
        }
        row.firstRec += 1;
        if (nearest <= TOUCH_CONTROL_DIST) row.pressedFirstRec += 1;
      }
      prevOwnerGid = owner.gid;
    }
    curTicks += 1;
  }
  if (curSide !== null) { row.segments += 1; row.segmentTicks += curTicks; }

  row.armedChallenges = m.cbLedger.armedChallenges;
  row.geometricMisses = m.cbLedger.geometricMisses;
  row.recoveries = m.cbLedger.recoveries;
  row.recoverySeconds = round(m.cbLedger.recoverySeconds, 6);
  row.goals = m.score[0] + m.score[1];
  row.shots = m.teams[0].stats.shots + m.teams[1].stats.shots;
  row.fouls = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
  row.yellows = m.teams[0].stats.yellows + m.teams[1].stats.yellows;
  row.reds = m.teams[0].stats.reds + m.teams[1].stats.reds;
  row.pushMetres = round(row.pushMetres, 6);
  return row;
}

/* ---------------- run ---------------- */
const t0 = Date.now();
const rows: Row[] = [];
for (const arm of ARMS) for (const seed of SEEDS) rows.push(walk(seed, arm));
const of = (arm: ArmName): Row[] => rows.filter((r) => r.arm === arm);
const per = (arm: ArmName, f: (r: Row) => number): number => round(mean(of(arm).map(f)), 4);
const tot = (arm: ArmName, f: (r: Row) => number): number => round(sum(of(arm).map(f)), 6);

const armSummary = (arm: ArmName): Record<string, number> => {
  const duels = tot(arm, (r) => r.duels);
  const knocks = tot(arm, (r) => r.knocks);
  const chal = tot(arm, (r) => r.challengers);
  const armed = tot(arm, (r) => r.armedChallenges);
  const races = tot(arm, (r) => r.raceCaptured) + tot(arm, (r) => r.raceUncaptured);
  const settled = tot(arm, (r) => r.knockRetained) + tot(arm, (r) => r.knockLost);
  return {
    duelsPerMatch: per(arm, (r) => r.duels),
    takeRate: duels > 0 ? round(tot(arm, (r) => r.duelsWon) / duels, 6) : 0,
    armedChallenges: armed,
    geometricMissShare: armed > 0 ? round(tot(arm, (r) => r.geometricMisses) / armed, 6) : 0,
    recoveries: tot(arm, (r) => r.recoveries),
    meanRecoverySeconds: tot(arm, (r) => r.recoveries) > 0
      ? round(tot(arm, (r) => r.recoverySeconds) / tot(arm, (r) => r.recoveries), 6) : 0,
    knocks,
    knocksPerMatch: per(arm, (r) => r.knocks),
    challengers: chal,
    predicateBeaten: tot(arm, (r) => r.predBeaten),
    predicateBeatenShare: chal > 0 ? round(tot(arm, (r) => r.predBeaten) / chal, 6) : 0,
    cleanBeats: tot(arm, (r) => r.cleanBeats),
    meanPushMetres: knocks > 0 ? round(tot(arm, (r) => r.pushMetres) / knocks, 6) : 0,
    raceCapturedShare: races > 0 ? round(tot(arm, (r) => r.raceCaptured) / races, 6) : 0,
    carrierRegatherShare: races > 0 ? round(tot(arm, (r) => r.raceCarrierRegather) / races, 6) : 0,
    knockRetention: settled > 0 ? round(tot(arm, (r) => r.knockRetained) / settled, 6) : 0,
    turnoversPerMatch: per(arm, (r) => r.turnovers),
    meanSpellSeconds: tot(arm, (r) => r.segments) > 0
      ? round((tot(arm, (r) => r.segmentTicks) * DT) / tot(arm, (r) => r.segments), 6) : 0,
    goalsPerMatch: per(arm, (r) => r.goals),
    shotsPerMatch: per(arm, (r) => r.shots),
    foulsPerMatch: per(arm, (r) => r.fouls),
    yellowsPerMatch: per(arm, (r) => r.yellows),
    redsPerMatch: per(arm, (r) => r.reds),
    pressedShare: tot(arm, (r) => r.firstRec) > 0
      ? round(tot(arm, (r) => r.pressedFirstRec) / tot(arm, (r) => r.firstRec), 6) : 0,
  };
};

/* ---- structural checks. This row GATES no football claim (#203). ---- */
const srcClean = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim() === ''
  && execSync('git diff --stat -- src', { encoding: 'utf8' }).trim() === '';
const offLedgerZero = of('off').every((r) => r.armedChallenges === 0 && r.knocks === 0);
const commitNoKnocks = of('commit').every((r) => r.knocks === 0);
const touchNoArmedDuels = of('touch').every((r) => r.armedChallenges === 0);
const bothNonVacuous = tot('both', (r) => r.armedChallenges) > 0 && tot('both', (r) => r.knocks) > 0;
const checks = { srcClean, offLedgerZero, commitNoKnocks, touchNoArmedDuels, bothNonVacuous };
const red = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k);

const body = {
  stage: 'CB-T2 ROW-0 — the both-doors-armed first row (#268.3(3))',
  seeds: {
    band: [12_474_000, 12_474_999],
    block: [SEEDS[0], SEEDS[SEEDS.length - 1]],
    n: SEEDS.length,
  },
  arms: ARMS,
  checks,
  summary: Object.fromEntries(ARMS.map((a) => [a, armSummary(a)])),
  perSeedRows: rows,
};
const resultSha256 = sha(canonical(body));
const envelope = {
  generatedAt: new Date().toISOString(),
  head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
  outPath: OUT_PATH,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  wallMs: Date.now() - t0,
  msPerMatch: round((Date.now() - t0) / (rows.length || 1), 3),
};
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, resultSha256, envelope }, null, 2)}\n`);
banner(`CB-T2 ROW-0 → ${OUT_PATH}  sha ${resultSha256.slice(0, 8)}  ${envelope.wallMs} ms`);
for (const arm of ARMS) {
  const s = armSummary(arm);
  banner(`  ${arm.padEnd(7)} duels/m ${String(s.duelsPerMatch).padStart(7)} take ${
    (s.takeRate * 100).toFixed(2).padStart(6)}%  knocks ${String(s.knocks).padStart(5)}  beaten ${
    String(s.predicateBeaten).padStart(5)}/${String(s.challengers).padStart(5)}  goals/m ${
    s.goalsPerMatch}  turnovers/m ${s.turnoversPerMatch}  spell ${s.meanSpellSeconds}s`);
}
if (red.length > 0) { banner(`RED: ${red.join(', ')}`); process.exit(1); }
