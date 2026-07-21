import { laneOpenness } from '../../src/ai/perception';
import type { Match, PendingPass } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import type { BallControlPhase } from '../../src/sim/physical';
import type { MatchPhase, RestartKind, Side } from '../../src/sim/types';
import type { V2 } from '../../src/utils/vec';

export type OraclePassKind = 'pass' | 'through' | 'cross' | 'lofted';

export interface OraclePassKey {
  readonly passerGid: number;
  readonly targetGid: number;
  readonly side: Side;
  readonly kickTick: number;
  readonly kickTime: number;
  readonly kind: OraclePassKind;
}

export type FirstTransitionOutcome =
  | 'intendedReception'
  | 'teammateRecovery'
  | 'opponentInterception'
  | 'loose'
  | 'deadBall';

export type OracleTransitionStatus = 'resolved' | 'censored' | 'forceFailure';
export type OracleCensorCause =
  | 'horizon'
  | 'halftime'
  | 'fulltime'
  | 'continuationStopped'
  | 'identityLost';

export interface CompletedPassSnapshot {
  readonly passerGid: number;
  readonly receiverGid: number;
  readonly t: number;
}

export interface PassLifecycleSnapshot {
  readonly tick: number;
  readonly simTime: number;
  readonly phase: MatchPhase;
  readonly finished: boolean;
  readonly restartKind: RestartKind | null;
  readonly ballCoastingOut: boolean;
  readonly ownerGid: number | null;
  readonly ownerSide: Side | null;
  readonly possessionSide: Side | -1;
  readonly pendingPass: PendingPass | null;
  readonly lastCompletedPass: CompletedPassSnapshot | null;
  readonly score: readonly [number, number];
  readonly ballControlPhase: BallControlPhase['kind'];
  readonly ballPos: Readonly<V2>;
  readonly ballVel: Readonly<V2>;
}

export interface FirstTransitionClassification {
  readonly status: OracleTransitionStatus;
  readonly outcome: FirstTransitionOutcome | null;
  readonly controllerGid: number | null;
  readonly controllerSide: Side | null;
  readonly censorCause: OracleCensorCause | null;
  readonly pendingPassWasMatchingBeforeStep: boolean;
  readonly pendingPassIsMatchingAfterStep: boolean;
  readonly lastCompletedPassChanged: boolean;
  readonly lastCompletedPassMatchesKick: boolean;
  readonly deadEvidence: 'goalPause' | 'restart' | 'ballCoastingOut' | null;
}

export interface FirstTransitionSnapshot extends FirstTransitionClassification {
  readonly tick: number;
  readonly simTime: number;
  readonly secondsFromKick: number;
  readonly phase: MatchPhase;
  readonly restartKind: RestartKind | null;
  readonly scoreDelta: number;
  readonly ownerGid: number | null;
  readonly possessionSide: Side | -1;
}

export interface SupportedOutcomeSnapshot {
  readonly supported: true;
  readonly tick: number;
  readonly simTime: number;
  readonly physicalControl: 'own' | 'opponent' | 'none';
  readonly macroPossessionSide: Side | -1;
  /** Null when no stable physical controller exists. */
  readonly possession: number | null;
  readonly goalDelta: number;
  /** Event-history value; unlike owner-dependent fields it remains defined. */
  readonly xgDelta: number;
  /** Null during a dead-ball phase or the deliberate out-of-play coast. */
  readonly progressionMetres: number | null;
  /** Null when there is no stable controller. */
  readonly exitOptionCount: number | null;
  readonly ballControlPhase: BallControlPhase['kind'];
  readonly phase: MatchPhase;
}

export interface UnsupportedOutcomeSnapshot {
  readonly supported: false;
  readonly reason: OracleCensorCause | 'notResolved';
}

export type OutcomeSnapshot = SupportedOutcomeSnapshot | UnsupportedOutcomeSnapshot;

export interface ConditionalPostControlSnapshot {
  readonly supported: true;
  readonly controllerGid: number;
  readonly controllerSide: Side;
  readonly ballPos: Readonly<V2>;
  readonly controllerPos: Readonly<V2>;
  readonly controllerVel: Readonly<V2>;
  readonly controllerBodyDir: Readonly<V2>;
  readonly outcomeVectorAtControl: SupportedOutcomeSnapshot;
}

export interface UnsupportedPostControlSnapshot {
  readonly supported: false;
  readonly reason: 'loose' | 'deadBall' | 'censored' | 'forceFailure';
}

export type PostControlSnapshot =
  | ConditionalPostControlSnapshot
  | UnsupportedPostControlSnapshot;

export interface OracleV2BranchRecord {
  readonly branch: 'chosen' | 'alternative';
  readonly passKey: OraclePassKey;
  readonly firstTransition: FirstTransitionSnapshot;
  readonly postControl: PostControlSnapshot;
  readonly payoffFromKick3s: OutcomeSnapshot;
  readonly payoffFromTransition3s: OutcomeSnapshot;
}

export interface PayoffOrigin {
  readonly scoreDiff: number;
  readonly xgDiff: number;
  readonly localBallX: number;
}

export interface RunOracleV2BranchInput {
  readonly frozen: Match;
  readonly passerGid: number;
  readonly targetGid: number;
  readonly side: Side;
  readonly branch: 'chosen' | 'alternative';
}

export type RunOracleV2BranchResult =
  | { readonly ok: true; readonly record: OracleV2BranchRecord }
  | { readonly ok: false; readonly reason: string };

/** Probe-only cap. Live pendingPass expires at 3.5s; this adds bounded slack. */
export const FIRST_TRANSITION_CAP_SECONDS = 4;
export const PAYOFF_SECONDS = 3;

const cloneV2 = (value: Readonly<V2>): V2 => ({ x: value.x, y: value.y });

const clonePendingPass = (pass: PendingPass | null): PendingPass | null => pass === null
  ? null
  : {
      ...pass,
      offsideSpot: pass.offsideSpot === null ? null : cloneV2(pass.offsideSpot),
    };

const cloneCompletedPass = (
  pass: CompletedPassSnapshot | null,
): CompletedPassSnapshot | null => pass === null ? null : { ...pass };

export function pendingPassMatchesKey(
  pass: PendingPass | null,
  key: OraclePassKey,
): boolean {
  return pass !== null
    && pass.side === key.side
    && pass.passerGid === key.passerGid
    && pass.targetGid === key.targetGid
    && pass.t === key.kickTime;
}

const completedPassEqual = (
  left: CompletedPassSnapshot | null,
  right: CompletedPassSnapshot | null,
): boolean => left === right || (
  left !== null
  && right !== null
  && left.passerGid === right.passerGid
  && left.receiverGid === right.receiverGid
  && left.t === right.t
);

const completedPassMatchesKey = (
  pass: CompletedPassSnapshot | null,
  key: OraclePassKey,
  ownerGid: number | null,
  ownerSide: Side | null,
): boolean => pass !== null
  && ownerGid !== null
  && ownerSide === key.side
  && pass.passerGid === key.passerGid
  && pass.receiverGid === ownerGid
  && pass.t >= key.kickTime;

export function capturePassLifecycle(match: Match): PassLifecycleSnapshot {
  const owner = match.ball.owner;
  return {
    tick: match.simTick,
    simTime: match.simTime,
    phase: match.phase,
    finished: match.finished,
    restartKind: match.restart?.kind ?? null,
    ballCoastingOut: match.ballCoastingOut,
    ownerGid: owner?.gid ?? null,
    ownerSide: owner?.side ?? null,
    possessionSide: match.possessionSide,
    pendingPass: clonePendingPass(match.pendingPass),
    lastCompletedPass: cloneCompletedPass(match.lastCompletedPass),
    score: [match.score[0], match.score[1]],
    ballControlPhase: match.ballControlPhase.kind,
    ballPos: cloneV2(match.ball.pos),
    ballVel: cloneV2(match.ball.vel),
  };
}

/**
 * Single post-step first-transition authority. Administrative termination is
 * censoring; football law-dead beats stable control, which beats unowned pass
 * lifecycle termination. M3 first contact/pendingControl never appears here.
 */
export function classifyFirstTransition(
  before: PassLifecycleSnapshot,
  after: PassLifecycleSnapshot,
  key: OraclePassKey,
): FirstTransitionClassification | null {
  const beforeMatching = pendingPassMatchesKey(before.pendingPass, key);
  const afterMatching = pendingPassMatchesKey(after.pendingPass, key);
  const completedChanged = !completedPassEqual(
    before.lastCompletedPass,
    after.lastCompletedPass,
  );
  const completedMatches = completedChanged
    && after.phase === 'playing'
    && !after.finished
    && !after.ballCoastingOut
    && completedPassMatchesKey(
      after.lastCompletedPass,
      key,
      after.ownerGid,
      after.ownerSide,
    );
  const common = {
    pendingPassWasMatchingBeforeStep: beforeMatching,
    pendingPassIsMatchingAfterStep: afterMatching,
    lastCompletedPassChanged: completedChanged,
    lastCompletedPassMatchesKick: completedMatches,
  };

  if (!beforeMatching) {
    return {
      ...common,
      status: 'forceFailure',
      outcome: null,
      controllerGid: null,
      controllerSide: null,
      censorCause: 'identityLost',
      deadEvidence: null,
    };
  }

  if (after.phase === 'halftime' || after.phase === 'fulltime' || after.finished) {
    return {
      ...common,
      status: 'censored',
      outcome: null,
      controllerGid: null,
      controllerSide: null,
      censorCause: after.phase === 'halftime' ? 'halftime' : 'fulltime',
      deadEvidence: null,
    };
  }

  const deadEvidence = after.ballCoastingOut
    ? 'ballCoastingOut'
    : after.phase === 'goalPause'
      ? 'goalPause'
      : after.phase === 'restart'
        ? 'restart'
        : null;
  if (deadEvidence !== null) {
    return {
      ...common,
      status: 'resolved',
      outcome: 'deadBall',
      controllerGid: null,
      controllerSide: null,
      censorCause: null,
      deadEvidence,
    };
  }

  if (after.ownerGid !== null && after.ownerSide !== null) {
    const outcome: FirstTransitionOutcome = after.ownerGid === key.targetGid
      ? 'intendedReception'
      : after.ownerSide === key.side
        ? 'teammateRecovery'
        : 'opponentInterception';
    return {
      ...common,
      status: 'resolved',
      outcome,
      controllerGid: after.ownerGid,
      controllerSide: after.ownerSide,
      censorCause: null,
      deadEvidence: null,
    };
  }

  if (!afterMatching) {
    if (after.phase === 'playing') {
      return {
        ...common,
        status: 'resolved',
        outcome: 'loose',
        controllerGid: null,
        controllerSide: null,
        censorCause: null,
        deadEvidence: null,
      };
    }
    return {
      ...common,
      status: 'forceFailure',
      outcome: null,
      controllerGid: null,
      controllerSide: null,
      censorCause: 'identityLost',
      deadEvidence: null,
    };
  }

  return null;
}

export function censorAtObservationHorizon(
  snapshot: PassLifecycleSnapshot,
  key: OraclePassKey,
): FirstTransitionClassification {
  const matching = pendingPassMatchesKey(snapshot.pendingPass, key);
  return {
    status: matching ? 'censored' : 'forceFailure',
    outcome: null,
    controllerGid: null,
    controllerSide: null,
    censorCause: matching ? 'horizon' : 'identityLost',
    pendingPassWasMatchingBeforeStep: matching,
    pendingPassIsMatchingAfterStep: matching,
    lastCompletedPassChanged: false,
    lastCompletedPassMatchesKick: false,
    deadEvidence: null,
  };
}

const xgFor = (match: Match, side: Side): number => match.shotLog
  .filter((shot) => shot.side === side)
  .reduce((sum, shot) => sum + shot.xg, 0);

export const capturePayoffOrigin = (match: Match, side: Side): PayoffOrigin => ({
  scoreDiff: match.score[side] - match.score[1 - side],
  xgDiff: xgFor(match, side) - xgFor(match, (1 - side) as Side),
  localBallX: match.teams[side].localX(match.ball.pos.x),
});

const optionCount = (match: Match, side: Side): number | null => {
  const owner = match.ball.owner;
  if (owner === null) return null;
  // Preserve the existing rollout vector's attacking-side semantics. Zero is
  // meaningful when the opponent controls; null is reserved for no controller.
  if (owner.side !== side) return 0;
  const opponents = match.teams[1 - side].players;
  let options = 0;
  for (const teammate of match.teams[side].players) {
    if (teammate.sentOff || teammate.gid === owner.gid) continue;
    if (laneOpenness(owner.pos, teammate.pos, opponents) >= 0.6) options++;
  }
  return options;
};

export function captureSupportedOutcome(
  match: Match,
  side: Side,
  origin: PayoffOrigin,
): SupportedOutcomeSnapshot {
  const owner = match.ball.owner;
  const physicalControl = owner === null
    ? 'none'
    : owner.side === side ? 'own' : 'opponent';
  const liveBallPosition = match.phase === 'playing' && !match.ballCoastingOut;
  return {
    supported: true,
    tick: match.simTick,
    simTime: match.simTime,
    physicalControl,
    macroPossessionSide: match.possessionSide,
    possession: owner === null ? null : owner.side === side ? 1 : -1,
    goalDelta:
      (match.score[side] - match.score[1 - side]) - origin.scoreDiff,
    xgDelta:
      (xgFor(match, side) - xgFor(match, (1 - side) as Side)) - origin.xgDiff,
    progressionMetres: liveBallPosition
      ? match.teams[side].localX(match.ball.pos.x) - origin.localBallX
      : null,
    exitOptionCount: optionCount(match, side),
    ballControlPhase: match.ballControlPhase.kind,
    phase: match.phase,
  };
}

const makeFirstTransitionSnapshot = (
  classification: FirstTransitionClassification,
  after: PassLifecycleSnapshot,
  key: OraclePassKey,
  startScoreDiff: number,
): FirstTransitionSnapshot => ({
  ...classification,
  tick: after.tick,
  simTime: after.simTime,
  secondsFromKick: after.simTime - key.kickTime,
  phase: after.phase,
  restartKind: after.restartKind,
  scoreDelta: (after.score[key.side] - after.score[1 - key.side]) - startScoreDiff,
  ownerGid: after.ownerGid,
  possessionSide: after.possessionSide,
});

const unsupportedPostControl = (
  transition: FirstTransitionSnapshot,
): UnsupportedPostControlSnapshot => ({
  supported: false,
  reason: transition.status === 'censored'
    ? 'censored'
    : transition.status === 'forceFailure'
      ? 'forceFailure'
      : transition.outcome === 'loose' ? 'loose' : 'deadBall',
});

const makePostControl = (
  match: Match,
  transition: FirstTransitionSnapshot,
  side: Side,
  kickOrigin: PayoffOrigin,
): PostControlSnapshot => {
  if (
    transition.status !== 'resolved'
    || transition.outcome === 'loose'
    || transition.outcome === 'deadBall'
  ) return unsupportedPostControl(transition);
  const controller = transition.controllerGid === null
    ? null
    : match.allPlayers[transition.controllerGid];
  if (controller === null || match.ball.owner?.gid !== controller.gid) {
    return { supported: false, reason: 'forceFailure' };
  }
  return {
    supported: true,
    controllerGid: controller.gid,
    controllerSide: controller.side,
    ballPos: cloneV2(match.ball.pos),
    controllerPos: cloneV2(controller.pos),
    controllerVel: cloneV2(controller.vel),
    controllerBodyDir: cloneV2(controller.bodyDir),
    outcomeVectorAtControl: captureSupportedOutcome(match, side, kickOrigin),
  };
};

const unsupportedOutcome = (
  reason: UnsupportedOutcomeSnapshot['reason'],
): UnsupportedOutcomeSnapshot => ({ supported: false, reason });

/** Run one forced branch without modifying the supplied frozen Match. */
export function runOracleV2Branch(
  input: RunOracleV2BranchInput,
): RunOracleV2BranchResult {
  const branch = cloneSimulationState(input.frozen);
  const passer = branch.allPlayers[input.passerGid];
  const target = branch.allPlayers[input.targetGid];
  if (
    passer === undefined
    || target === undefined
    || branch.phase !== 'playing'
    || branch.ball.owner !== passer
    || passer.kickCooldown > 0
  ) return { ok: false, reason: 'invalid forced-pass precondition' };

  const kickOrigin = capturePayoffOrigin(branch, input.side);
  const startScoreDiff = kickOrigin.scoreDiff;
  branch.performPass(passer, target);
  const pending = branch.pendingPass;
  const kind = branch.lastPassKind?.kind;
  if (
    pending === null
    || pending.targetGid !== input.targetGid
    || pending.passerGid !== input.passerGid
    || pending.side !== input.side
    || kind === undefined
  ) return { ok: false, reason: 'forced pass did not create matching pendingPass' };

  const key: OraclePassKey = {
    passerGid: pending.passerGid,
    targetGid: pending.targetGid,
    side: pending.side,
    kickTick: branch.simTick,
    kickTime: pending.t,
    kind,
  };
  let before = capturePassLifecycle(branch);
  let firstTransition: FirstTransitionSnapshot | null = null;
  let postControl: PostControlSnapshot | null = null;
  let transitionOrigin: PayoffOrigin | null = null;
  let primary: OutcomeSnapshot | null = null;
  let diagnostic: OutcomeSnapshot | null = null;
  const absoluteStop = key.kickTime + FIRST_TRANSITION_CAP_SECONDS + PAYOFF_SECONDS + DT * 2;

  while (!branch.finished && branch.simTime < absoluteStop) {
    branch.step(DT);
    const after = capturePassLifecycle(branch);

    if (firstTransition === null) {
      let classification = classifyFirstTransition(before, after, key);
      if (
        classification === null
        && after.simTime + 1e-12 >= key.kickTime + FIRST_TRANSITION_CAP_SECONDS
      ) classification = censorAtObservationHorizon(after, key);
      if (classification !== null) {
        firstTransition = makeFirstTransitionSnapshot(
          classification,
          after,
          key,
          startScoreDiff,
        );
        transitionOrigin = capturePayoffOrigin(branch, input.side);
        postControl = makePostControl(branch, firstTransition, input.side, kickOrigin);
      }
    }

    if (primary === null && after.simTime + 1e-12 >= key.kickTime + PAYOFF_SECONDS) {
      primary = captureSupportedOutcome(branch, input.side, kickOrigin);
    }
    if (
      diagnostic === null
      && firstTransition !== null
      && firstTransition.status === 'resolved'
      && transitionOrigin !== null
      && after.simTime + 1e-12 >= firstTransition.simTime + PAYOFF_SECONDS
    ) diagnostic = captureSupportedOutcome(branch, input.side, transitionOrigin);

    before = after;
    if (
      firstTransition !== null
      && primary !== null
      && (firstTransition.status !== 'resolved' || diagnostic !== null)
    ) break;
  }

  if (firstTransition === null) {
    const classification: FirstTransitionClassification = {
      ...censorAtObservationHorizon(before, key),
      status: branch.finished ? 'censored' : 'forceFailure',
      censorCause: branch.finished ? 'continuationStopped' : 'identityLost',
    };
    firstTransition = makeFirstTransitionSnapshot(
      classification,
      before,
      key,
      startScoreDiff,
    );
    postControl = unsupportedPostControl(firstTransition);
  }
  if (primary === null) {
    primary = unsupportedOutcome(
      firstTransition.censorCause ?? 'continuationStopped',
    );
  }
  if (diagnostic === null) {
    diagnostic = unsupportedOutcome(
      firstTransition.status === 'resolved'
        ? 'continuationStopped'
        : firstTransition.censorCause ?? 'notResolved',
    );
  }

  return {
    ok: true,
    record: {
      branch: input.branch,
      passKey: key,
      firstTransition,
      postControl: postControl ?? unsupportedPostControl(firstTransition),
      payoffFromKick3s: primary,
      payoffFromTransition3s: diagnostic,
    },
  };
}
