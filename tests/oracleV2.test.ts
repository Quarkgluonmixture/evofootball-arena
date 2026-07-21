import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { Match, type PendingPass } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type MatchPhase, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  capturePassLifecycle,
  capturePayoffOrigin,
  captureSupportedOutcome,
  censorAtObservationHorizon,
  classifyFirstTransition,
  runOracleV2Branch,
  type OraclePassKey,
  type PassLifecycleSnapshot,
} from '../scripts/probes/oracle-v2';

const key: OraclePassKey = {
  passerGid: 1,
  targetGid: 2,
  side: 0,
  kickTick: 100,
  kickTime: 10,
  kind: 'pass',
};

const pending = (overrides: Partial<PendingPass> = {}): PendingPass => ({
  side: key.side,
  passerGid: key.passerGid,
  targetGid: key.targetGid,
  t: key.kickTime,
  offside: false,
  offsideSpot: null,
  ...overrides,
});

const lifecycle = (
  overrides: Partial<PassLifecycleSnapshot> = {},
): PassLifecycleSnapshot => ({
  tick: 101,
  simTime: 10 + DT,
  phase: 'playing',
  finished: false,
  restartKind: null,
  ballCoastingOut: false,
  ownerGid: null,
  ownerSide: null,
  possessionSide: 0,
  pendingPass: pending(),
  lastCompletedPass: null,
  score: [0, 0],
  ballControlPhase: 'free',
  ballPos: { x: 1, y: 2 },
  ballVel: { x: 4, y: 0 },
  ...overrides,
});

const transition = (
  after: Partial<PassLifecycleSnapshot>,
  before: Partial<PassLifecycleSnapshot> = {},
) => classifyFirstTransition(lifecycle(before), lifecycle({ tick: 102, ...after }), key);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const makeMatch = (): Match => new Match({
  seed: 71,
  teamA: team('A', 101),
  teamB: team('B', 102),
  duration: 60,
});

describe('Counterfactual Oracle v2-0 first-transition semantics', () => {
  it('gives football-law death priority over a same-tick apparent controller', () => {
    const result = transition({
      phase: 'restart',
      restartKind: 'kickIn',
      pendingPass: null,
      ownerGid: key.targetGid,
      ownerSide: key.side,
    });
    expect(result).toMatchObject({
      status: 'resolved',
      outcome: 'deadBall',
      controllerGid: null,
      deadEvidence: 'restart',
    });
  });

  it('gives stable control priority over same-tick pending-pass termination', () => {
    const intended = transition({
      pendingPass: null,
      ownerGid: key.targetGid,
      ownerSide: key.side,
      lastCompletedPass: {
        passerGid: key.passerGid,
        receiverGid: key.targetGid,
        t: key.kickTime + DT,
      },
    });
    expect(intended).toMatchObject({
      status: 'resolved',
      outcome: 'intendedReception',
      controllerGid: key.targetGid,
      lastCompletedPassMatchesKick: true,
    });
  });

  it('classifies the first stable controller, not the first contact', () => {
    const teammate = transition({
      pendingPass: null,
      ownerGid: 3,
      ownerSide: 0,
    });
    const opponent = transition({
      pendingPass: null,
      ownerGid: 8,
      ownerSide: 1,
    });
    expect(teammate).toMatchObject({ outcome: 'teammateRecovery', controllerGid: 3 });
    expect(opponent).toMatchObject({ outcome: 'opponentInterception', controllerGid: 8 });
  });

  it('classifies unowned playing-phase lifecycle termination as loose', () => {
    const result = transition({
      pendingPass: null,
      ownerGid: null,
      ownerSide: null,
      possessionSide: key.side,
    });
    expect(result).toMatchObject({
      status: 'resolved',
      outcome: 'loose',
      controllerGid: null,
    });
  });

  it.each([
    ['halftime', 'halftime'],
    ['fulltime', 'fulltime'],
  ] as Array<[MatchPhase, 'halftime' | 'fulltime']>)(
    'treats %s as administrative censoring',
    (phase, cause) => {
      expect(transition({ phase, pendingPass: null })).toMatchObject({
        status: 'censored',
        outcome: null,
        censorCause: cause,
      });
    },
  );

  it('does not treat a same-tick administrative censor as a completion', () => {
    const result = transition({
      phase: 'halftime',
      pendingPass: null,
      ownerGid: key.targetGid,
      ownerSide: key.side,
      lastCompletedPass: {
        passerGid: key.passerGid,
        receiverGid: key.targetGid,
        t: key.kickTime + DT,
      },
    });
    expect(result).toMatchObject({
      status: 'censored',
      lastCompletedPassChanged: true,
      lastCompletedPassMatchesKick: false,
    });
  });

  it('separates a horizon censor from a loose transition', () => {
    expect(censorAtObservationHorizon(lifecycle(), key)).toMatchObject({
      status: 'censored',
      outcome: null,
      censorCause: 'horizon',
    });
  });

  it('never lets a historical completed pass create the current transition', () => {
    const old = {
      passerGid: key.passerGid,
      receiverGid: key.targetGid,
      t: key.kickTime - 2,
    };
    const result = transition(
      { pendingPass: null, lastCompletedPass: old },
      { lastCompletedPass: old },
    );
    expect(result).toMatchObject({
      outcome: 'loose',
      lastCompletedPassChanged: false,
      lastCompletedPassMatchesKick: false,
    });
  });

  it('does not corroborate an opponent controller with an unrelated completion update', () => {
    const result = transition({
      pendingPass: null,
      ownerGid: 8,
      ownerSide: 1,
      lastCompletedPass: {
        passerGid: key.passerGid,
        receiverGid: key.targetGid,
        t: key.kickTime + DT,
      },
    });
    expect(result).toMatchObject({
      outcome: 'opponentInterception',
      lastCompletedPassChanged: true,
      lastCompletedPassMatchesKick: false,
    });
  });

  it('uses null, not zero, for owner-dependent fields when the ball is free', () => {
    const match = makeMatch();
    match.ball.owner = null;
    match.possessionSide = 0;
    match.phase = 'playing';
    const origin = capturePayoffOrigin(match, 0);
    const snapshot = captureSupportedOutcome(match, 0, origin);
    expect(snapshot).toMatchObject({
      physicalControl: 'none',
      macroPossessionSide: 0,
      possession: null,
      exitOptionCount: null,
    });
  });

  it('freezes lifecycle evidence rather than retaining mutable Match references', () => {
    const match = makeMatch();
    match.pendingPass = pending();
    match.ball.pos = { x: 3, y: 4 };
    const snapshot = capturePassLifecycle(match);
    match.pendingPass.targetGid = 9;
    match.ball.pos.x = 99;
    expect(snapshot.pendingPass?.targetGid).toBe(key.targetGid);
    expect(snapshot.ballPos).toEqual({ x: 3, y: 4 });
  });

  it('runs an isolated forced branch deterministically without mutating the frozen state', () => {
    const match = makeMatch();
    while (
      !match.finished
      && !(match.phase === 'playing' && match.ball.owner !== null)
    ) match.step(DT);
    const passer = match.ball.owner!;
    passer.kickCooldown = 0;
    const target = match.teams[passer.side].players.find(
      (candidate) => !candidate.sentOff && candidate.gid !== passer.gid,
    )!;
    const frozenBefore = capturePassLifecycle(match);
    const input = {
      frozen: match,
      passerGid: passer.gid,
      targetGid: target.gid,
      side: passer.side as Side,
      branch: 'chosen' as const,
    };
    const first = runOracleV2Branch(input);
    const second = runOracleV2Branch(input);
    expect(first).toEqual(second);
    expect(first.ok).toBe(true);
    expect(capturePassLifecycle(match)).toEqual(frozenBefore);
  });
});
