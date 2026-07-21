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

export type PhysicalControlState = 'own' | 'none' | 'opponent';
export type PayoffObservationAuthority =
  | 'kickPlus3s'
  | 'absorbedAdministrativeTerminal';

/** Honest comparable facts. Missing physical subjects remain null. */
export interface RawPayoffFacts {
  readonly tick: number;
  readonly observedSimTime: number;
  readonly phase: MatchPhase;
  readonly finished: boolean;
  readonly ballCoastingOut: boolean;
  readonly restartKind: RestartKind | null;
  readonly physicalControl: PhysicalControlState;
  readonly ownerGid: number | null;
  /** Diagnostic only. ComparablePassPayoffV1 must never read this field. */
  readonly macroPossessionSide: Side | -1;
  readonly possession: 1 | -1 | null;
  readonly goalDelta: number;
  readonly xgDelta: number;
  readonly currentPlayableProgressionMetres: number | null;
  readonly lastPlayableProgressionMetres: number;
  readonly attackingExitOptionCount: number | null;
  readonly ballControlPhase: BallControlPhase['kind'];
}

/** Fixed-from-kick authority used by the replicated oracle. */
export interface RawOraclePayoffObservation extends RawPayoffFacts {
  readonly authoritySimTime: number;
  readonly authority: PayoffObservationAuthority;
}

/** Separate event-relative anatomy; never substitutes for the primary horizon. */
export interface RawTransitionPayoffDiagnostic extends RawPayoffFacts {
  readonly transitionAuthoritySimTime: number;
}

/** Versioned, total comparison projection. This is not the raw observation. */
export interface ComparablePassPayoffV1 {
  readonly physicalControlValue: -1 | 0 | 1;
  readonly goalDelta: number;
  readonly xgDelta: number;
  readonly actionProgressionMetres: number;
  readonly ownExecutableExitOptions: number;
}

export interface ProjectedOraclePayoff {
  readonly projectionVersion: 'comparable-pass-payoff-v1';
  readonly raw: RawOraclePayoffObservation;
  readonly comparable: ComparablePassPayoffV1;
}

export interface ProjectedTransitionPayoffDiagnostic {
  readonly projectionVersion: 'comparable-pass-payoff-v1';
  readonly raw: RawTransitionPayoffDiagnostic;
  readonly comparable: ComparablePassPayoffV1;
}

export interface UnsupportedOutcomeSnapshot {
  readonly supported: false;
  readonly reason: OracleCensorCause | 'notResolved';
}

export type DiagnosticOutcomeSnapshot =
  | ProjectedTransitionPayoffDiagnostic
  | UnsupportedOutcomeSnapshot;

export interface ConditionalPostControlSnapshot {
  readonly supported: true;
  readonly controllerGid: number;
  readonly controllerSide: Side;
  readonly ballPos: Readonly<V2>;
  readonly controllerPos: Readonly<V2>;
  readonly controllerVel: Readonly<V2>;
  readonly controllerBodyDir: Readonly<V2>;
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
  readonly payoffFromKick3s: ProjectedOraclePayoff;
  readonly payoffFromTransition3s: DiagnosticOutcomeSnapshot;
}

export interface PayoffOrigin {
  readonly scoreDiff: number;
  readonly xgDiff: number;
  readonly localBallX: number;
}

export interface PayoffPathState {
  readonly origin: PayoffOrigin;
  lastPlayableProgressionMetres: number;
}

export interface RunOracleV2BranchInput {
  readonly frozen: Match;
  readonly passerGid: number;
  readonly targetGid: number;
  readonly side: Side;
  readonly branch: 'chosen' | 'alternative';
  /** Probe-only child stream; never mutates the supplied frozen Match. */
  readonly childRngState?: number;
  /** Replicated ceiling needs only first transition + kick+3s primary payoff. */
  readonly includeTransitionDiagnostic?: boolean;
}

export type RunOracleV2BranchResult =
  | { readonly ok: true; readonly record: OracleV2BranchRecord }
  | { readonly ok: false; readonly reason: string };

/** Probe-only cap. Live pendingPass expires at 3.5s; this adds bounded slack. */
export const FIRST_TRANSITION_CAP_SECONDS = 4;
export const PAYOFF_SECONDS = 3;

const setRngState = (match: Match, state: number): void => {
  const canonical = (state >>> 0) === 0 ? 0x9e3779b9 : state >>> 0;
  (match.rng as unknown as { s: number }).s = canonical;
};

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

export const createPayoffPathState = (
  match: Match,
  side: Side,
): PayoffPathState => ({
  origin: capturePayoffOrigin(match, side),
  // The kick snapshot is the zero-progress reference. Only completed live
  // steps may advance this ledger.
  lastPlayableProgressionMetres: 0,
});

const playableProgression = (
  match: Match,
  side: Side,
  origin: PayoffOrigin,
): number | null => match.phase === 'playing' && !match.ballCoastingOut
  ? match.teams[side].localX(match.ball.pos.x) - origin.localBallX
  : null;

/** Call once after every complete branch.step(DT), before any payoff capture. */
export function updatePayoffPathState(
  match: Match,
  side: Side,
  path: PayoffPathState,
): void {
  const progression = playableProgression(match, side, path.origin);
  if (progression !== null) path.lastPlayableProgressionMetres = progression;
}

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

const captureRawPayoffFacts = (
  match: Match,
  side: Side,
  path: PayoffPathState,
): RawPayoffFacts => {
  const owner = match.ball.owner;
  const physicalControl = owner === null
    ? 'none'
    : owner.side === side ? 'own' : 'opponent';
  return {
    tick: match.simTick,
    observedSimTime: match.simTime,
    phase: match.phase,
    finished: match.finished,
    ballCoastingOut: match.ballCoastingOut,
    restartKind: match.restart?.kind ?? null,
    physicalControl,
    ownerGid: owner?.gid ?? null,
    macroPossessionSide: match.possessionSide,
    possession: owner === null ? null : owner.side === side ? 1 : -1,
    goalDelta:
      (match.score[side] - match.score[1 - side]) - path.origin.scoreDiff,
    xgDelta:
      (xgFor(match, side) - xgFor(match, (1 - side) as Side)) - path.origin.xgDiff,
    currentPlayableProgressionMetres: playableProgression(
      match,
      side,
      path.origin,
    ),
    lastPlayableProgressionMetres: path.lastPlayableProgressionMetres,
    attackingExitOptionCount: optionCount(match, side),
    ballControlPhase: match.ballControlPhase.kind,
  };
};

export function captureRawPayoffObservation(
  match: Match,
  side: Side,
  path: PayoffPathState,
  authoritySimTime: number,
  authority: PayoffObservationAuthority = 'kickPlus3s',
): RawOraclePayoffObservation {
  return {
    ...captureRawPayoffFacts(match, side, path),
    authoritySimTime,
    authority,
  };
}

/**
 * Pure total projection. Deliberately never reads macroPossessionSide, phase,
 * ball position or restart placement.
 */
export function projectComparablePassPayoffV1(
  raw: RawPayoffFacts,
): ComparablePassPayoffV1 {
  if (raw.physicalControl === 'own' && raw.attackingExitOptionCount === null) {
    throw new Error('own physical controller requires an exit-option count');
  }
  return {
    physicalControlValue: raw.physicalControl === 'own'
      ? 1
      : raw.physicalControl === 'opponent' ? -1 : 0,
    goalDelta: raw.goalDelta,
    xgDelta: raw.xgDelta,
    actionProgressionMetres:
      raw.currentPlayableProgressionMetres ?? raw.lastPlayableProgressionMetres,
    ownExecutableExitOptions: raw.physicalControl === 'own'
      ? raw.attackingExitOptionCount as number
      : 0,
  };
}

export const projectRawPayoff = (
  raw: RawOraclePayoffObservation,
): ProjectedOraclePayoff => ({
  projectionVersion: 'comparable-pass-payoff-v1',
  raw,
  comparable: projectComparablePassPayoffV1(raw),
});

export const captureProjectedPayoff = (
  match: Match,
  side: Side,
  path: PayoffPathState,
  authoritySimTime: number,
  authority: PayoffObservationAuthority = 'kickPlus3s',
): ProjectedOraclePayoff => projectRawPayoff(captureRawPayoffObservation(
  match,
  side,
  path,
  authoritySimTime,
  authority,
));

export const captureTransitionPayoffDiagnostic = (
  match: Match,
  side: Side,
  path: PayoffPathState,
  transitionAuthoritySimTime: number,
): ProjectedTransitionPayoffDiagnostic => {
  const raw: RawTransitionPayoffDiagnostic = {
    ...captureRawPayoffFacts(match, side, path),
    transitionAuthoritySimTime,
  };
  return {
    projectionVersion: 'comparable-pass-payoff-v1',
    raw,
    comparable: projectComparablePassPayoffV1(raw),
  };
};

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
  if (input.childRngState !== undefined) setRngState(branch, input.childRngState);
  const passer = branch.allPlayers[input.passerGid];
  const target = branch.allPlayers[input.targetGid];
  if (
    passer === undefined
    || target === undefined
    || branch.phase !== 'playing'
    || branch.ball.owner !== passer
    || passer.kickCooldown > 0
  ) return { ok: false, reason: 'invalid forced-pass precondition' };

  const kickPath = createPayoffPathState(branch, input.side);
  const startScoreDiff = kickPath.origin.scoreDiff;
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
  let transitionPath: PayoffPathState | null = null;
  let primary: ProjectedOraclePayoff | null = null;
  let diagnostic: DiagnosticOutcomeSnapshot | null = null;
  const includeDiagnostic = input.includeTransitionDiagnostic ?? true;
  const primaryAuthorityTime = key.kickTime + PAYOFF_SECONDS;
  const absoluteStop = key.kickTime + FIRST_TRANSITION_CAP_SECONDS + PAYOFF_SECONDS + DT * 2;

  while (!branch.finished && branch.simTime < absoluteStop) {
    branch.step(DT);
    updatePayoffPathState(branch, input.side, kickPath);
    if (transitionPath !== null) {
      updatePayoffPathState(branch, input.side, transitionPath);
    }
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
        transitionPath = createPayoffPathState(branch, input.side);
        postControl = makePostControl(branch, firstTransition);
      }
    }

    if (primary === null && after.simTime + 1e-12 >= primaryAuthorityTime) {
      primary = captureProjectedPayoff(
        branch,
        input.side,
        kickPath,
        primaryAuthorityTime,
      );
    } else if (primary === null && branch.finished) {
      primary = captureProjectedPayoff(
        branch,
        input.side,
        kickPath,
        primaryAuthorityTime,
        'absorbedAdministrativeTerminal',
      );
    }
    if (
      diagnostic === null
      && firstTransition !== null
      && firstTransition.status === 'resolved'
      && transitionPath !== null
      && includeDiagnostic
      && after.simTime + 1e-12 >= firstTransition.simTime + PAYOFF_SECONDS
    ) diagnostic = captureTransitionPayoffDiagnostic(
      branch,
      input.side,
      transitionPath,
      firstTransition.simTime + PAYOFF_SECONDS,
    );

    before = after;
    if (
      firstTransition !== null
      && primary !== null
      && (
        !includeDiagnostic
        || firstTransition.status !== 'resolved'
        || diagnostic !== null
      )
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
  if (primary === null) return {
    ok: false,
    reason: `primary payoff missing: ${firstTransition.censorCause ?? 'continuationStopped'}`,
  };
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
