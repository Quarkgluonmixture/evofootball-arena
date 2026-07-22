// C-AC0 COUPLED ARRIVAL/CONTACT RACE CEILING.
// Authority: docs/world-model/COUPLED-ARRIVAL-CONTACT-RACE.md
import { createHash } from 'node:crypto';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type ActionState, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  capturePassLifecycle,
  classifyFirstTransition,
  type FirstTransitionOutcome,
  type OraclePassKey,
  type OracleTransitionStatus,
} from './oracle-v2';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED_START = Number(process.argv[3] ?? 68_000);
const MATCH_DURATION = 240;
const ADMIN_GUARD = 5;
const TRANSITION_CAP = 4;

type Binary = 'intended' | 'opponent';
type RacePrediction = Binary | 'other';

interface TransitionRun {
  readonly status: OracleTransitionStatus;
  readonly outcome: FirstTransitionOutcome | null;
  readonly controllerGid: number | null;
  readonly kickSignature: string;
  readonly delayedContactControl: boolean;
  readonly contactCount: number;
  readonly coordinationPublications: number;
  readonly forbiddenActionStates: number;
  readonly targetPosWrites: number;
}

interface RecordRow {
  readonly identity: string;
  readonly seed: number;
  readonly baseline: Binary;
  readonly coupledPrediction: RacePrediction;
  readonly actual: FirstTransitionOutcome;
  readonly coupled: FirstTransitionOutcome;
  readonly actualControllerGid: number | null;
  readonly coupledControllerGid: number | null;
  readonly participantCount: number;
  readonly delayedContactControl: boolean;
  readonly contactCount: number;
}

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

const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(
  match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
    topSpeed: player.topSpeed,
    accel: player.accel,
    dribbling: player.attrs.dribbling,
  }]),
);

const rngState = (match: Match): number => (match.rng as unknown as { s: number }).s;

const frozenSignature = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  time: match.simTime,
  phase: match.phase,
  score: match.score,
  possession: match.possessionSide,
  rng: rngState(match),
  ball: [match.ball.pos, match.ball.vel, match.ball.z, match.ball.vz, match.ball.owner?.gid ?? null],
  players: match.allPlayers.map((player) => [
    player.gid, player.pos, player.vel, player.heading, player.stamina,
    player.action, player.decisionTimer, player.kickCooldown,
  ]),
});

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= ADMIN_GUARD;
};

const setupAction = (type: ActionState['type']): ActionState => ({ type, scores: [] });

const runTransition = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
  raceParticipants: ReadonlySet<number> | null,
): TransitionRun => {
  const branch = cloneSimulationState(frozen);
  const passer = branch.allPlayers.find((player) => player.gid === passerGid);
  const target = branch.allPlayers.find((player) => player.gid === targetGid);
  if (!passer || !target || branch.ball.owner !== passer || branch.phase !== 'playing') {
    return {
      status: 'forceFailure', outcome: null, controllerGid: null, kickSignature: '',
      delayedContactControl: false, contactCount: 0, coordinationPublications: 0,
      forbiddenActionStates: 0, targetPosWrites: 0,
    };
  }
  branch.performPass(passer, target);
  const pending = branch.pendingPass;
  if (!pending || pending.passerGid !== passerGid || pending.targetGid !== targetGid
    || pending.side !== side || branch.lastPassKind?.kind !== 'pass') {
    return {
      status: 'forceFailure', outcome: null, controllerGid: null, kickSignature: '',
      delayedContactControl: false, contactCount: 0, coordinationPublications: 0,
      forbiddenActionStates: 0, targetPosWrites: 0,
    };
  }
  const key: OraclePassKey = {
    passerGid, targetGid, side, kickTick: branch.simTick, kickTime: pending.t, kind: 'pass',
  };
  const kickSignature = JSON.stringify({
    rng: rngState(branch), ball: [branch.ball.pos, branch.ball.vel, branch.ball.z, branch.ball.vz],
    pending: branch.pendingPass, kind: branch.lastPassKind,
  });
  const episodeStart = branch.contestEpisodes.length;
  let coordinationPublications = 0;
  let forbiddenActionStates = 0;
  let targetPosWrites = 0;

  if (raceParticipants !== null) {
    for (const player of branch.allPlayers) {
      player.action = player.gid === targetGid
        ? setupAction('ReceivePass')
        : raceParticipants.has(player.gid)
          ? setupAction('InterceptPass')
          : setupAction('HoldPosition');
      player.decisionTimer = Number.POSITIVE_INFINITY;
    }
    for (const raceTeam of branch.teams) {
      raceTeam.brainTimer = Number.POSITIVE_INFINITY;
      raceTeam.chasers.clear();
      raceTeam.marks.clear();
    }
  }

  let before = capturePassLifecycle(branch);
  const stop = pending.t + TRANSITION_CAP + DT * 2;
  while (!branch.finished && branch.simTime < stop) {
    if (raceParticipants !== null) {
      for (const player of branch.allPlayers) player.decisionTimer = Number.POSITIVE_INFINITY;
      for (const raceTeam of branch.teams) {
        raceTeam.brainTimer = Number.POSITIVE_INFINITY;
        raceTeam.chasers.clear();
        raceTeam.marks.clear();
      }
    }
    branch.step(DT);
    if (raceParticipants !== null) {
      coordinationPublications += branch.teams[0].chasers.size + branch.teams[0].marks.size
        + branch.teams[1].chasers.size + branch.teams[1].marks.size;
    }
    const after = capturePassLifecycle(branch);
    const classification = classifyFirstTransition(before, after, key);
    if (raceParticipants !== null && classification === null) {
      for (const player of branch.allPlayers) {
        const expected = player.gid === targetGid
          ? 'ReceivePass'
          : raceParticipants.has(player.gid)
            ? 'InterceptPass'
            : 'HoldPosition';
        if (player.action.type !== expected) forbiddenActionStates++;
        if (player.action.targetPos !== undefined) targetPosWrites++;
      }
    }
    if (classification !== null) {
      const episodes = branch.contestEpisodes.slice(episodeStart);
      const contacts = episodes.flatMap((episode) => episode.contacts);
      const delayed = episodes.some((episode) => {
        const first = episode.contacts[0];
        return first !== undefined && episode.resolution?.kind === 'controlled'
          && episode.resolution.tick > first.tick;
      });
      return {
        status: classification.status,
        outcome: classification.outcome,
        controllerGid: classification.controllerGid,
        kickSignature,
        delayedContactControl: delayed,
        contactCount: contacts.length,
        coordinationPublications,
        forbiddenActionStates,
        targetPosWrites,
      };
    }
    before = after;
  }
  return {
    status: 'censored', outcome: null, controllerGid: null, kickSignature,
    delayedContactControl: false, contactCount: 0, coordinationPublications,
    forbiddenActionStates, targetPosWrites,
  };
};

const outcomeCounts = (): Record<FirstTransitionOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
});

const transitionValid = (
  match: Match,
  outcome: FirstTransitionOutcome,
  controllerGid: number | null,
  side: Side,
  targetGid: number,
): boolean => {
  const controller = controllerGid === null
    ? null
    : match.allPlayers.find((player) => player.gid === controllerGid) ?? null;
  if (outcome === 'intendedReception') {
    return controller?.gid === targetGid && controller.side === side;
  }
  if (outcome === 'teammateRecovery') {
    return controller !== null && controller.side === side && controller.gid !== targetGid;
  }
  if (outcome === 'opponentInterception') {
    return controller !== null && controller.side !== side;
  }
  return controllerGid === null;
};

const records: RecordRow[] = [];
const identities = new Set<string>();
const representedMatches = new Set<number>();
const actualCounts = outcomeCounts();
const coupledCounts = outcomeCounts();
let ordinaryPasses = 0;
let accepted = 0;
let boundaryExcluded = 0;
let invalidTarget = 0;
let duplicateIdentities = 0;
let queryMutations = 0;
let queryRngDraws = 0;
let normalFailures = 0;
let coupledFailures = 0;
let kickMismatches = 0;
let transitionConservationFailures = 0;
let administrativeCensors = 0;
let coordinationPublications = 0;
let forbiddenActionStates = 0;
let targetPosWrites = 0;

for (let index = 0; index < MATCHES; index++) {
  const seed = SEED_START + index;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
    traceContests: true,
  });
  let previousPass = match.pendingPass;
  while (!match.finished) {
    const owner = match.phase === 'playing' ? match.ball.owner : null;
    const frozen = owner !== null && owner.decisionTimer <= 0 && owner.kickCooldown <= 0
      ? cloneSimulationState(match)
      : null;
    const frozenOwnerGid = owner?.gid ?? null;
    match.step(DT);
    const pass = match.pendingPass;
    const freshOrdinary = pass !== previousPass
      && pass !== null
      && match.lastPassKind?.kind === 'pass'
      && match.lastPassKind.t === pass.t
      && frozen !== null
      && frozenOwnerGid === pass.passerGid;
    if (freshOrdinary && frozen !== null && pass !== null) {
      ordinaryPasses++;
      if (!beforeAdministrativeBoundary(frozen)) {
        boundaryExcluded++;
        previousPass = pass;
        continue;
      }
      const passer = frozen.allPlayers.find((player) => player.gid === pass.passerGid);
      const target = frozen.allPlayers.find((player) => player.gid === pass.targetGid);
      if (!passer || !target || target.role === 'GK' || target.sentOff) {
        invalidTarget++;
        previousPass = pass;
        continue;
      }
      const identity = `${seed}:${frozen.simTick}:${pass.passerGid}:${pass.targetGid}`;
      if (identities.has(identity)) duplicateIdentities++;
      identities.add(identity);

      const beforeQuery = frozenSignature(frozen);
      const beforeRng = rngState(frozen);
      const snapshot = oraclePerceptionSnapshot(capturePerceptionTruth(frozen), passer.gid);
      const profiles = profilesOf(frozen);
      const participants = new Set<number>();
      for (const opponent of frozen.teams[1 - passer.side].players) {
        if (opponent.role === 'GK' || opponent.sentOff) continue;
        const facts = evaluatePassCorridorInterception({
          snapshot,
          passerGid: passer.gid,
          targetGid: target.gid,
          defenderGid: opponent.gid,
          reachProfiles: profiles,
        });
        if (facts !== null && facts.strongestMargin >= 0) participants.add(opponent.gid);
      }
      if (beforeRng !== rngState(frozen)) queryRngDraws++;
      if (beforeQuery !== frozenSignature(frozen)) queryMutations++;

      const normal = runTransition(frozen, passer.gid, target.gid, passer.side, null);
      const coupled = runTransition(frozen, passer.gid, target.gid, passer.side, participants);
      if (normal.status !== 'resolved' || normal.outcome === null) {
        normalFailures++;
        if (normal.status === 'censored') administrativeCensors++;
        previousPass = pass;
        continue;
      }
      if (coupled.status !== 'resolved' || coupled.outcome === null) {
        coupledFailures++;
        if (coupled.status === 'censored') administrativeCensors++;
        previousPass = pass;
        continue;
      }
      if (normal.kickSignature !== coupled.kickSignature) kickMismatches++;
      if (!transitionValid(frozen, normal.outcome, normal.controllerGid, passer.side, target.gid)) {
        transitionConservationFailures++;
      }
      if (!transitionValid(frozen, coupled.outcome, coupled.controllerGid, passer.side, target.gid)) {
        transitionConservationFailures++;
      }
      coordinationPublications += coupled.coordinationPublications;
      forbiddenActionStates += coupled.forbiddenActionStates;
      targetPosWrites += coupled.targetPosWrites;
      actualCounts[normal.outcome]++;
      coupledCounts[coupled.outcome]++;
      accepted++;
      representedMatches.add(seed);
      const coupledPrediction: RacePrediction = coupled.outcome === 'intendedReception'
        ? 'intended'
        : coupled.outcome === 'opponentInterception'
          ? 'opponent'
          : 'other';
      records.push({
        identity,
        seed,
        baseline: participants.size > 0 ? 'opponent' : 'intended',
        coupledPrediction,
        actual: normal.outcome,
        coupled: coupled.outcome,
        actualControllerGid: normal.controllerGid,
        coupledControllerGid: coupled.controllerGid,
        participantCount: participants.size,
        delayedContactControl: coupled.delayedContactControl,
        contactCount: coupled.contactCount,
      });
    }
    previousPass = pass;
  }
}

const binaryRows = records.filter((row) =>
  row.actual === 'intendedReception' || row.actual === 'opponentInterception');
const actualBinary = (row: RecordRow): Binary => row.actual === 'intendedReception'
  ? 'intended'
  : 'opponent';
const correct = (prediction: RacePrediction, actual: Binary): boolean => prediction === actual;
const recall = (prediction: (row: RecordRow) => RacePrediction, label: Binary): number => {
  const rows = binaryRows.filter((row) => actualBinary(row) === label);
  return rows.filter((row) => prediction(row) === label).length / Math.max(1, rows.length);
};
const baselineIntendedRecall = recall((row) => row.baseline, 'intended');
const baselineOpponentRecall = recall((row) => row.baseline, 'opponent');
const coupledIntendedRecall = recall((row) => row.coupledPrediction, 'intended');
const coupledOpponentRecall = recall((row) => row.coupledPrediction, 'opponent');
const baselineBalanced = (baselineIntendedRecall + baselineOpponentRecall) / 2;
const coupledBalanced = (coupledIntendedRecall + coupledOpponentRecall) / 2;
const changed = binaryRows.filter((row) => row.baseline !== row.coupledPrediction);
const changedBaselineCorrect = changed.filter((row) => correct(row.baseline, actualBinary(row))).length
  / Math.max(1, changed.length);
const changedCoupledCorrect = changed.filter((row) => correct(row.coupledPrediction, actualBinary(row))).length
  / Math.max(1, changed.length);
const saysOpponent = binaryRows.filter((row) => row.coupledPrediction === 'opponent');
const saysIntended = binaryRows.filter((row) => row.coupledPrediction === 'intended');
const actualOpponentRate = (rows: readonly RecordRow[]): number => rows.filter((row) =>
  row.actual === 'opponentInterception').length / Math.max(1, rows.length);
const opponentSeparation = actualOpponentRate(saysOpponent) - actualOpponentRate(saysIntended);
const delayedCount = records.filter((row) => row.delayedContactControl).length;
const controlledIdentityRows = records.filter((row) => row.actualControllerGid !== null
  && row.coupledControllerGid !== null);
const identityAgreement = controlledIdentityRows.filter((row) =>
  row.actualControllerGid === row.coupledControllerGid).length / Math.max(1, controlledIdentityRows.length);

const gates = {
  matches: representedMatches.size === MATCHES,
  binarySupport: binaryRows.length >= 5_000,
  resolvedSupport: accepted / Math.max(1, ordinaryPasses - boundaryExcluded - invalidTarget) >= 0.95,
  finitePredictions: records.every((row) => Number.isFinite(row.participantCount)),
  coupledBalanced: coupledBalanced >= 0.60,
  balancedEdge: coupledBalanced - baselineBalanced >= 0.05,
  intendedRecall: coupledIntendedRecall >= 0.50,
  opponentRecall: coupledOpponentRecall >= 0.50,
  changedSupport: changed.length / Math.max(1, binaryRows.length) >= 0.10,
  changedEdge: changedCoupledCorrect - changedBaselineCorrect >= 0.10,
  opponentSeparation: opponentSeparation >= 0.15,
  delayedControl: delayedCount / Math.max(1, accepted) >= 0.10,
  noDuplicateIdentities: duplicateIdentities === 0,
  noQueryMutations: queryMutations === 0,
  noQueryRngDraws: queryRngDraws === 0,
  noNormalFailures: normalFailures === 0,
  noCoupledFailures: coupledFailures === 0,
  noKickMismatches: kickMismatches === 0,
  transitionConservation: transitionConservationFailures === 0,
  noAdministrativeCensors: administrativeCensors === 0,
  noCoordinationPublications: coordinationPublications === 0,
  frozenActionVocabulary: forbiddenActionStates === 0,
  noTargetPosWrites: targetPosWrites === 0,
};

const report = {
  authority: 'C-AC0 coupled arrival/contact race ceiling',
  parameters: { matches: MATCHES, seedStart: SEED_START, duration: MATCH_DURATION,
    transitionCap: TRANSITION_CAP },
  support: { representedMatches: representedMatches.size, ordinaryPasses, accepted,
    boundaryExcluded, invalidTarget, binaryRows: binaryRows.length },
  outcomes: { actual: actualCounts, coupled: coupledCounts },
  baseline: { intendedRecall: baselineIntendedRecall, opponentRecall: baselineOpponentRecall,
    balancedAccuracy: baselineBalanced },
  coupled: { intendedRecall: coupledIntendedRecall, opponentRecall: coupledOpponentRecall,
    balancedAccuracy: coupledBalanced, identityAgreement, delayedCount },
  mediators: { changed: changed.length, changedRate: changed.length / Math.max(1, binaryRows.length),
    changedBaselineCorrect, changedCoupledCorrect, opponentSeparation,
    saysOpponent: saysOpponent.length, saysIntended: saysIntended.length },
  validity: { duplicateIdentities, queryMutations, queryRngDraws, normalFailures,
    coupledFailures, kickMismatches, transitionConservationFailures, administrativeCensors,
    coordinationPublications, forbiddenActionStates, targetPosWrites },
  gates,
  pass: Object.values(gates).every(Boolean),
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;
console.log('C-AC0 COUPLED ARRIVAL/CONTACT RACE CEILING');
console.log(`matches ${representedMatches.size}/${MATCHES} · passes ${accepted}/${ordinaryPasses}`
  + ` · binary ${binaryRows.length}`);
console.log(`baseline BA ${pct(baselineBalanced)} (I ${pct(baselineIntendedRecall)}`
  + ` / O ${pct(baselineOpponentRecall)})`);
console.log(`coupled  BA ${pct(coupledBalanced)} (I ${pct(coupledIntendedRecall)}`
  + ` / O ${pct(coupledOpponentRecall)}) · edge ${pct(coupledBalanced - baselineBalanced)}`);
console.log(`changed ${changed.length}/${binaryRows.length} (${pct(changed.length / Math.max(1, binaryRows.length))})`
  + ` · changed correctness ${pct(changedBaselineCorrect)}→${pct(changedCoupledCorrect)}`
  + ` · opponent separation ${pct(opponentSeparation)}`);
console.log(`delayed control ${delayedCount}/${accepted} · identity agreement ${pct(identityAgreement)}`);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${report.pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
