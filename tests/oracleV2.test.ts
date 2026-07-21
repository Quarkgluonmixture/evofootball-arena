import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { Match, type PendingPass } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type MatchPhase, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  capturePassLifecycle,
  captureProjectedPayoff,
  captureRawPayoffObservation,
  censorAtObservationHorizon,
  classifyFirstTransition,
  createPayoffPathState,
  projectComparablePassPayoffV1,
  runOracleV2Branch,
  type OraclePassKey,
  type PassLifecycleSnapshot,
  type RawOraclePayoffObservation,
} from '../scripts/probes/oracle-v2';
import {
  COMPARABLE_PAYOFF_DIMENSIONS,
  compareComparablePassPayoffs,
  compareLegacyPassPayoffs,
  meanComparablePassPayoffs,
  type LegacyRolloutOutcome,
  type PayoffRelation,
} from '../scripts/probes/pass-payoff-relation';

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
    const path = createPayoffPathState(match, 0);
    const raw = captureRawPayoffObservation(match, 0, path, match.simTime + 3);
    const comparable = projectComparablePassPayoffV1(raw);
    expect(raw).toMatchObject({
      physicalControl: 'none',
      macroPossessionSide: 0,
      possession: null,
      attackingExitOptionCount: null,
    });
    expect(comparable).toMatchObject({
      physicalControlValue: 0,
      ownExecutableExitOptions: 0,
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

const rawPayoff = (
  overrides: Partial<RawOraclePayoffObservation> = {},
): RawOraclePayoffObservation => ({
  tick: 180,
  observedSimTime: 13,
  authoritySimTime: 13,
  authority: 'kickPlus3s',
  phase: 'playing',
  finished: false,
  ballCoastingOut: false,
  restartKind: null,
  physicalControl: 'none',
  ownerGid: null,
  macroPossessionSide: 0,
  possession: null,
  goalDelta: 0,
  xgDelta: 0,
  currentPlayableProgressionMetres: 4,
  lastPlayableProgressionMetres: 4,
  attackingExitOptionCount: null,
  ballControlPhase: 'free',
  ...overrides,
});

describe('ComparablePassPayoffV1 preflight semantics', () => {
  it('does not read macro possession and preserves nullable raw facts', () => {
    const base = rawPayoff();
    const before = structuredClone(base);
    const projections = ([-1, 0, 1] as const).map((macroPossessionSide) =>
      projectComparablePassPayoffV1({ ...base, macroPossessionSide }));

    expect(projections[0]).toEqual(projections[1]);
    expect(projections[1]).toEqual(projections[2]);
    expect(projections[0]).toMatchObject({
      physicalControlValue: 0,
      ownExecutableExitOptions: 0,
    });
    expect(base).toEqual(before);
    expect(base.possession).toBeNull();
    expect(base.attackingExitOptionCount).toBeNull();
  });

  it('distinguishes own control with zero lanes, no controller, and opponent control', () => {
    const own = projectComparablePassPayoffV1(rawPayoff({
      physicalControl: 'own',
      ownerGid: 2,
      possession: 1,
      attackingExitOptionCount: 0,
    }));
    const none = projectComparablePassPayoffV1(rawPayoff());
    const opponent = projectComparablePassPayoffV1(rawPayoff({
      physicalControl: 'opponent',
      ownerGid: 8,
      possession: -1,
      attackingExitOptionCount: 0,
    }));
    expect(own).toMatchObject({ physicalControlValue: 1, ownExecutableExitOptions: 0 });
    expect(none).toMatchObject({ physicalControlValue: 0, ownExecutableExitOptions: 0 });
    expect(opponent).toMatchObject({ physicalControlValue: -1, ownExecutableExitOptions: 0 });
  });

  it('uses the last playable progression during dead state and live progression after restart', () => {
    const dead = projectComparablePassPayoffV1(rawPayoff({
      phase: 'restart',
      restartKind: 'goalKick',
      currentPlayableProgressionMetres: null,
      lastPlayableProgressionMetres: 12,
      ballControlPhase: 'deadBall',
    }));
    const resumed = projectComparablePassPayoffV1(rawPayoff({
      phase: 'playing',
      restartKind: null,
      currentPlayableProgressionMetres: -3,
      lastPlayableProgressionMetres: 12,
    }));
    expect(dead.actionProgressionMetres).toBe(12);
    expect(resumed.actionProgressionMetres).toBe(-3);
  });

  it('is invariant to dead-ball reset position in the capture path', () => {
    const match = makeMatch();
    const path = createPayoffPathState(match, 0);
    path.lastPlayableProgressionMetres = 12;
    match.phase = 'restart';
    match.ball.owner = null;
    const values = [-30, 0, 30].map((x) => {
      match.ball.pos = { x, y: 0 };
      return captureProjectedPayoff(match, 0, path, match.simTime + 3).comparable;
    });
    expect(values.map((value) => value.actionProgressionMetres)).toEqual([12, 12, 12]);
  });

  it('creates a total absorbing terminal payoff at the fixed authority time', () => {
    const match = makeMatch();
    const path = createPayoffPathState(match, 0);
    path.lastPlayableProgressionMetres = 7;
    match.finished = true;
    match.phase = 'fulltime';
    match.ball.owner = null;
    const authority = match.simTime + 3;
    const payoff = captureProjectedPayoff(
      match,
      0,
      path,
      authority,
      'absorbedAdministrativeTerminal',
    );
    expect(payoff.raw).toMatchObject({
      observedSimTime: match.simTime,
      authoritySimTime: authority,
      authority: 'absorbedAdministrativeTerminal',
      possession: null,
      attackingExitOptionCount: null,
    });
    expect(payoff.comparable).toMatchObject({
      physicalControlValue: 0,
      actionProgressionMetres: 7,
      ownExecutableExitOptions: 0,
    });
    expect(Object.values(payoff.comparable).every(Number.isFinite)).toBe(true);
  });

  it('uses all 32 records as the denominator for all five means', () => {
    const samples = Array.from({ length: 32 }, (_, index) => ({
      physicalControlValue: (index % 3) - 1 as -1 | 0 | 1,
      goalDelta: index === 31 ? 1 : 0,
      xgDelta: index / 100,
      actionProgressionMetres: index,
      ownExecutableExitOptions: index % 5,
    }));
    const mean = meanComparablePassPayoffs(samples);
    for (const dimension of COMPARABLE_PAYOFF_DIMENSIONS) {
      const direct = samples.reduce((sum, sample) => sum + sample[dimension], 0) / 32;
      expect(mean[dimension]).toBe(direct);
    }
  });

  it('preserves the outcome-tree mixture identity with nullable raw strata', () => {
    const records = [
      { outcome: 'intended', raw: rawPayoff({
        physicalControl: 'own', ownerGid: 2, possession: 1, attackingExitOptionCount: 3,
      }) },
      { outcome: 'opponent', raw: rawPayoff({
        physicalControl: 'opponent', ownerGid: 8, possession: -1, attackingExitOptionCount: 0,
      }) },
      { outcome: 'loose', raw: rawPayoff() },
      { outcome: 'dead', raw: rawPayoff({
        phase: 'restart', currentPlayableProgressionMetres: null,
        lastPlayableProgressionMetres: 9, ballControlPhase: 'deadBall',
      }) },
    ];
    const projected = records.map((record) => ({
      outcome: record.outcome,
      value: projectComparablePassPayoffV1(record.raw),
    }));
    const direct = meanComparablePassPayoffs(projected.map((record) => record.value));
    const groups = new Map<string, typeof projected>();
    for (const record of projected) {
      const group = groups.get(record.outcome) ?? [];
      group.push(record);
      groups.set(record.outcome, group);
    }
    for (const dimension of COMPARABLE_PAYOFF_DIMENSIONS) {
      let mixture = 0;
      for (const group of groups.values()) {
        const conditional = meanComparablePassPayoffs(group.map((record) => record.value));
        mixture += (group.length / projected.length) * conditional[dimension];
      }
      expect(mixture).toBe(direct[dimension]);
    }
  });

  it('keeps the extracted comparator bit-for-bit equivalent to the legacy algorithm', () => {
    const oldComparator = (
      alternative: LegacyRolloutOutcome,
      chosen: LegacyRolloutOutcome,
    ): PayoffRelation => {
      const dimensions = [
        ['possession', 0],
        ['goalDelta', 0],
        ['xgDelta', 0.01],
        ['progressionMetres', 0.5],
        ['exitOptionCount', 0],
      ] as const;
      let altNoWorse = true;
      let chosenNoWorse = true;
      let altStrict = false;
      let chosenStrict = false;
      for (const [dimension, tolerance] of dimensions) {
        const delta = alternative[dimension] - chosen[dimension];
        if (delta < -tolerance) altNoWorse = false;
        if (delta > tolerance) chosenNoWorse = false;
        if (delta > tolerance) altStrict = true;
        if (delta < -tolerance) chosenStrict = true;
      }
      if (altNoWorse && altStrict) return 'alternativeDominates';
      if (chosenNoWorse && chosenStrict) return 'chosenDominates';
      if (!altStrict && !chosenStrict) return 'equivalent';
      return 'tradeoff';
    };
    const samples: LegacyRolloutOutcome[] = [];
    for (const possession of [-1, 0, 1]) {
      for (const xgDelta of [-0.02, -0.01, 0, 0.01, 0.02]) {
        for (const progressionMetres of [-1, -0.5, 0, 0.5, 1]) {
          samples.push({
            possession,
            goalDelta: 0,
            xgDelta,
            progressionMetres,
            exitOptionCount: possession + 1,
          });
        }
      }
    }
    for (const alternative of samples) {
      for (const chosen of samples) {
        expect(compareLegacyPassPayoffs(alternative, chosen)).toBe(
          oldComparator(alternative, chosen),
        );
      }
    }
    expect(compareComparablePassPayoffs(
      projectComparablePassPayoffV1(rawPayoff({ currentPlayableProgressionMetres: 1 })),
      projectComparablePassPayoffV1(rawPayoff({ currentPlayableProgressionMetres: 0 })),
    )).toBe('alternativeDominates');
  });
});
