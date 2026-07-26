// EDS E5c (b) — THE STATE-BLINDNESS TEST (the HM test).
// Authority: docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md §2.2, §5
//
// (a) removes the sampling defect. Whatever is left is the residual this asks
// about: is a cell-indexed value table blind to the STATE a pass is played in?
//
// The legacy pass loop already knows what a pattern looks like — it grants the
// third-man and 2过1 licences by predicate — so those predicates, read from
// truth, define the pattern arm. At each moment where one fires, the world is
// forked and the pass FORCED to the licensed runner; every OTHER window
// candidate at the SAME moment is forked too and forms the control. Both arms
// are then compared against what the topped-up table predicts for the
// destination they reached.
//
// That control is the whole design. A table that under-predicts everywhere is
// simply miscalibrated — which would be a third finding, not HM. A table that
// under-predicts ONLY where the pattern's runner arrives is blind to the state.
import { createHash } from 'node:crypto';
import {
  VALUE_ZONE_MARGINAL, VALUE_ZONE_SAMPLE_FLOOR, VALUE_ZONE_TABLE_TOPPED,
  valueZoneAt, valueZoneIndex,
} from '../../src/ai/passPrior';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2.2, §5) ----------------------------------
// E5a's staging constants, verbatim.
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const VALUE_HORIZON_TICKS = 240;
/** A fresh block again: neither E5a's sets nor E5c (a)'s top-up blocks. */
const SEED_START = 740_000;
const HARNESS_SEEDS = [740_001, 740_002, 740_003] as const;
const MAX_MATCHES = Number(process.argv[2] ?? 4000);
const ARM_FLOOR = 600; // M1
const PATTERN_GAP_FLOOR = 0.04; // M2, +4.0pp
const CONTROL_GAP_BAND = 0.02; // M2, ±2.0pp

// The legacy licence predicates (`PlayerBrain.ts`), read from truth.
const THIRD_MAN_WINDOW_SECONDS = 1.5;
const THIRD_MAN_MIN_GAIN = 0.15;
const WALL_RETURN_MIN_GAIN = 0.2;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};
const distanceBetween = (
  left: Readonly<{ x: number; y: number }>, right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);
const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);
const matchOf = (seed: number): Match => new Match({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION,
  traceFirstTouch: true,
});
const signature = (match: Match): string => createHash('sha256').update(JSON.stringify({
  tick: match.simTick,
  score: match.score,
  phase: match.phase,
  ball: { pos: match.ball.pos, vel: match.ball.vel, z: match.ball.z, vz: match.ball.vz },
  rng: (match.rng as unknown as { s: number }).s,
  players: match.allPlayers.map((player) => ({
    gid: player.gid, pos: player.pos, vel: player.vel, heading: player.heading,
  })),
})).digest('hex');

const newPassKey = (
  match: Match, previousKey: string, kindBefore: Match['lastPassKind'],
): string | null => {
  const pending = match.pendingPass;
  if (!pending) return null;
  const kind = match.lastPassKind;
  if (kind === null || kind === kindBefore || kind.kind !== 'pass') return null;
  const key = `${pending.passerGid}:${pending.targetGid}:${pending.t}`;
  return key === previousKey ? null : key;
};

// --- Y4: the fork must replay reality (E2a-2's gate, verbatim) --------------
const harnessReproduces = (seed: number): boolean => {
  const reference = matchOf(seed);
  const events: { tick: number; targetGid: number }[] = [];
  let key = '';
  while (!reference.finished) {
    const kindBefore = reference.lastPassKind;
    reference.step(DT);
    const fresh = newPassKey(reference, key, kindBefore);
    if (fresh !== null) {
      key = fresh;
      events.push({ tick: reference.simTick, targetGid: reference.pendingPass!.targetGid });
    }
  }
  const referenceSignature = signature(reference);
  const replay = matchOf(seed);
  let index = 0;
  while (!replay.finished) {
    const next = events[index];
    const arm = next !== undefined && replay.simTick + 1 === next.tick;
    if (arm) replay.forcedPassTarget = next.targetGid;
    replay.step(DT);
    if (arm) {
      replay.forcedPassTarget = null;
      index += 1;
    }
  }
  return signature(replay) === referenceSignature && index === events.length && events.length > 0;
};

// --- the licence predicates -------------------------------------------------
type Licence = 'third-man' | 'wall-return';

/**
 * Which licence, if any, the legacy pass loop would grant this mate right now.
 * These are `PlayerBrain.ts`'s own conditions, transcribed — not a new notion
 * of "pattern" invented for this probe.
 */
const licenceFor = (
  before: Match, passer: Player, mate: Player,
): Licence | null => {
  const attacking = before.teams[passer.side];
  const gain = clamp01(
    (attacking.localX(mate.pos.x) - attacking.localX(passer.pos.x) + 30) / 60,
  ) * 2 - 1;
  if (mate.wallRun !== null && before.simTime < mate.wallRun.until
    && mate.wallRun.partnerGid === passer.gid && gain > WALL_RETURN_MIN_GAIN) {
    return 'wall-return';
  }
  const lp = before.lastCompletedPass;
  if (lp && lp.receiverGid === passer.gid && before.simTime - lp.t < THIRD_MAN_WINDOW_SECONDS
    && lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > THIRD_MAN_MIN_GAIN) {
    return 'third-man';
  }
  return null;
};

// --- one forced pass, followed to the value horizon -------------------------
interface Outcome {
  readonly arm: 'pattern' | 'control';
  readonly licence: Licence | null;
  readonly zone: number;
  /** V̂ the topped-up table gives this destination (marginal for starved cells). */
  readonly predicted: number;
  readonly cleanReception: boolean;
  readonly shot: boolean;
}

const forceAndFollow = (
  before: Match,
  passerGid: number,
  candidate: Player,
  arm: 'pattern' | 'control',
  licence: Licence | null,
): Outcome | null => {
  const passerBefore = before.allPlayers.find((player) => player.gid === passerGid);
  if (!passerBefore) return null;
  const attacking = before.teams[passerBefore.side];
  const zone = valueZoneIndex(attacking.localX(candidate.pos.x), candidate.pos.y);
  const predicted = valueZoneAt(attacking.localX(candidate.pos.x), candidate.pos.y).shotRate;
  const fork = cloneSimulationState(before);
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return null; // unplayable — the absence of a pass, never an outcome of one
  }
  const kickTick = fork.simTick;
  let reached = false;
  let toucherGid = -1;
  for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
    fork.step(DT);
    const toucher = fork.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) {
      toucherGid = toucher.gid;
      reached = toucher.gid === candidate.gid;
      break;
    }
    if (fork.phase !== 'playing') break;
  }
  if (!reached) return { arm, licence, zone, predicted, cleanReception: false, shot: false };
  const touchTick = fork.simTick;
  for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
    fork.step(DT);
  }
  const event = fork.firstTouchTrace.find((trace) => (
    trace.gid === toucherGid && trace.intendedTarget
    && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
  ));
  if (event === undefined || !event.clean) {
    return { arm, licence, zone, predicted, cleanReception: false, shot: false };
  }
  const side = passerBefore.side;
  const attackingFork = fork.teams[side];
  const shotsBefore = attackingFork.stats.shots;
  while (fork.simTick - kickTick < VALUE_HORIZON_TICKS && fork.phase === 'playing') {
    fork.step(DT);
  }
  return {
    arm,
    licence,
    zone,
    predicted,
    cleanReception: true,
    shot: attackingFork.stats.shots > shotsBefore,
  };
};

/** Two walks, as in (a): record the pass ticks, then clone only there. */
const harvestMatch = (seed: number): Outcome[] => {
  const scout = matchOf(seed);
  const passTicks: number[] = [];
  let key = '';
  while (!scout.finished) {
    const kindBefore = scout.lastPassKind;
    scout.step(DT);
    const fresh = newPassKey(scout, key, kindBefore);
    if (fresh === null) continue;
    key = fresh;
    passTicks.push(scout.simTick);
  }

  const outcomes: Outcome[] = [];
  const match = matchOf(seed);
  let index = 0;
  while (!match.finished && index < passTicks.length) {
    const isForkTick = match.simTick + 1 === passTicks[index];
    const before = isForkTick ? cloneSimulationState(match) : null;
    match.step(DT);
    if (!isForkTick) continue;
    index += 1;
    const pending = match.pendingPass;
    if (!pending || before === null) continue;
    const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
    if (!passerBefore) continue;
    const attacking = before.teams[passerBefore.side];
    // E5a's candidate window, so both arms live in the population the table was
    // measured over (contract §2.2).
    const candidates = attacking.players.filter((player) => (
      player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
      && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
      && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
    ));
    if (candidates.length < 2) continue;
    const licences = new Map<number, Licence | null>(
      candidates.map((mate) => [mate.gid, licenceFor(before, passerBefore, mate)]),
    );
    const licensed = candidates.filter((mate) => licences.get(mate.gid) !== null);
    // Pattern-ACTIVE moments only: no licence, no comparison. The control is
    // drawn from the same moments so both arms share their world.
    if (licensed.length === 0) continue;
    for (const mate of candidates) {
      const licence = licences.get(mate.gid) ?? null;
      const outcome = forceAndFollow(
        before, pending.passerGid, mate, licence === null ? 'control' : 'pattern', licence,
      );
      if (outcome !== null) outcomes.push(outcome);
    }
  }
  return outcomes;
};

const summarise = (outcomes: readonly Outcome[]) => {
  const clean = outcomes.filter((row) => row.cleanReception);
  const n = clean.length;
  const predicted = n === 0 ? 0 : clean.reduce((sum, row) => sum + row.predicted, 0) / n;
  const realized = n === 0 ? 0 : clean.filter((row) => row.shot).length / n;
  const cellMix = new Map<number, number>();
  for (const row of clean) cellMix.set(row.zone, (cellMix.get(row.zone) ?? 0) + 1);
  return {
    forks: outcomes.length,
    cleanReceptions: n,
    cleanRate: outcomes.length === 0 ? 0 : n / outcomes.length,
    predicted,
    realized,
    gap: realized - predicted,
    cellMix: [...cellMix.entries()].sort((left, right) => left[0] - right[0])
      .map(([zone, count]) => ({ zone, count, share: n === 0 ? 0 : count / n })),
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const outcomes: Outcome[] = [];
  let matches = 0;
  for (let seed = SEED_START; seed < SEED_START + MAX_MATCHES; seed++) {
    const pattern = outcomes.filter((row) => row.arm === 'pattern' && row.cleanReception).length;
    const control = outcomes.filter((row) => row.arm === 'control' && row.cleanReception).length;
    if (pattern >= ARM_FLOOR && control >= ARM_FLOOR) break;
    outcomes.push(...harvestMatch(seed));
    matches += 1;
  }

  const pattern = summarise(outcomes.filter((row) => row.arm === 'pattern'));
  const control = summarise(outcomes.filter((row) => row.arm === 'control'));
  const thirdMan = summarise(outcomes.filter((row) => row.licence === 'third-man'));
  const wallReturn = summarise(outcomes.filter((row) => row.licence === 'wall-return'));

  const coverage = {
    m1Pattern: pattern.cleanReceptions >= ARM_FLOOR,
    m1Control: control.cleanReceptions >= ARM_FLOOR,
  };
  const hmConfirmed = pattern.gap >= PATTERN_GAP_FLOOR
    && Math.abs(control.gap) <= CONTROL_GAP_BAND;
  const controlOutOfBand = Math.abs(control.gap) > CONTROL_GAP_BAND;

  return {
    experiment: 'EDS-E5c-b',
    authority: 'EDS-E5C-VALUE-ATTRIBUTION',
    parameters: {
      seedStart: SEED_START,
      maxMatches: MAX_MATCHES,
      armFloor: ARM_FLOOR,
      patternGapFloor: PATTERN_GAP_FLOOR,
      controlGapBand: CONTROL_GAP_BAND,
      valueHorizonTicks: VALUE_HORIZON_TICKS,
      tableFloor: VALUE_ZONE_SAMPLE_FLOOR,
      marginal: VALUE_ZONE_MARGINAL.shotRate,
      toppedTable: VALUE_ZONE_TABLE_TOPPED,
    },
    harness,
    matches,
    pattern,
    control,
    m2: {
      patternGap: pattern.gap,
      controlGap: control.gap,
      hmConfirmed,
      /** A table wrong everywhere is a third finding, not HM (contract §5). */
      controlOutOfBand,
    },
    reported: {
      b1ByPattern: { thirdMan, wallReturn },
      b2CellMix: { pattern: pattern.cellMix, control: control.cellMix },
      b3Parts: {
        pattern: { predicted: pattern.predicted, realized: pattern.realized },
        control: { predicted: control.predicted, realized: control.realized },
      },
      b4CleanRate: { pattern: pattern.cleanRate, control: control.cleanRate },
    },
    coverage,
    verdict: Object.values(coverage).every(Boolean) && harness.every((entry) => entry.reproduces)
      ? 'MEASURED' : 'INVALID',
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
if (!deterministic) output.verdict = 'INVALID';
console.log(JSON.stringify(output, null, 2));
console.error(
  `EDS-E5c-b ${output.verdict} · harness ${output.harness.every((entry) => entry.reproduces)}`
  + ` · pattern n=${output.pattern.cleanReceptions}`
  + ` predicted ${(output.pattern.predicted * 100).toFixed(2)}%`
  + ` realized ${(output.pattern.realized * 100).toFixed(2)}%`
  + ` gap ${(output.m2.patternGap * 100).toFixed(2)}pp`
  + ` · control n=${output.control.cleanReceptions}`
  + ` predicted ${(output.control.predicted * 100).toFixed(2)}%`
  + ` realized ${(output.control.realized * 100).toFixed(2)}%`
  + ` gap ${(output.m2.controlGap * 100).toFixed(2)}pp`
  + ` · HM ${output.m2.hmConfirmed ? 'CONFIRMED' : 'REFUTED'}`
  + (output.m2.controlOutOfBand ? ' · CONTROL OUT OF BAND (third finding)' : '')
  + ` · SHA ${sha256}`,
);
