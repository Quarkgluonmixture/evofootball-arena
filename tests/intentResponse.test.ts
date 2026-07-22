import { describe, expect, it } from 'vitest';
import {
  buildObserverIntentBelief,
  evaluateIntentReopening,
  type ObserverIntentBelief,
} from '../src/ai/intentResponse';
import type {
  IntentCandidateHypothesis,
  ObservedIntentEvidence,
  ObservedIntentHypothesisEvidence,
} from '../src/ai/intentProcess';
import { PLAYER_MIN_DIST } from '../src/sim/constants';

const evidence = (
  displacement: { x: number; y: number } | null = { x: 0.4, y: 0 },
  observedTick = 20,
): ObservedIntentEvidence => ({
  observerGid: 2,
  actorGid: 1,
  observedTick,
  observationAgeTicks: 0,
  observedPos: { x: 0, y: 0 },
  observedVel: { x: 2, y: 0 },
  observedBodyDir: { x: 1, y: 0 },
  displacementSincePrevious: displacement,
  velocityChangeSincePrevious: { x: 1, y: 0 },
  bodyTurnSincePrevious: 0,
});

const hypothesisEvidence = (): readonly ObservedIntentHypothesisEvidence[] => [
  {
    observerGid: 2,
    actorGid: 1,
    candidateId: 'east',
    velocityBearingAlignment: 1,
    displacementBearingAlignment: 1,
    bodyBearingAlignment: 1,
    observedClosingSpeed: 2,
    evidenceAgeTicks: 0,
  },
  {
    observerGid: 2,
    actorGid: 1,
    candidateId: 'north',
    velocityBearingAlignment: 0,
    displacementBearingAlignment: 0,
    bodyBearingAlignment: 0,
    observedClosingSpeed: 0,
    evidenceAgeTicks: 0,
  },
];

const belief = (
  ids: readonly string[] = ['east'],
  observedTick = 20,
): ObserverIntentBelief => ({
  observerGid: 2,
  actorGid: 1,
  referenceGid: 3,
  referenceEpoch: 4,
  observedTick,
  supportedCandidateIds: ids,
});

const actorCandidates: readonly IntentCandidateHypothesis[] = [
  { id: 'east', point: { x: 5, y: 0 } },
  { id: 'north', point: { x: 0, y: 5 } },
];
const ownCandidates: readonly IntentCandidateHypothesis[] = [
  { id: 'a', point: { x: 5.5, y: 0 } },
  { id: 'b', point: { x: -4, y: 0 } },
  { id: 'c', point: { x: 0, y: -4 } },
];

describe('observer-local embodied intent reopening', () => {
  it('does not let different private targets alter identical external belief input', () => {
    const first = buildObserverIntentBelief({
      evidence: evidence(), hypotheses: hypothesisEvidence(),
      referenceGid: 3, referenceEpoch: 4, previous: null,
    });
    const second = buildObserverIntentBelief({
      evidence: evidence(), hypotheses: hypothesisEvidence(),
      referenceGid: 3, referenceEpoch: 4, previous: null,
    });
    expect(first).toEqual(second);
  });

  it('is idempotent for a repeated stale observer tick', () => {
    const previous = belief(['north'], 20);
    const repeated = buildObserverIntentBelief({
      evidence: evidence({ x: 1, y: 0 }, 20),
      hypotheses: hypothesisEvidence(), referenceGid: 3, referenceEpoch: 4, previous,
    });
    expect(repeated).toEqual(previous);
    expect(repeated?.supportedCandidateIds).not.toBe(previous.supportedCandidateIds);
  });

  it('keeps the current intent when embodied support is empty', () => {
    const built = buildObserverIntentBelief({
      evidence: evidence({ x: 0.1, y: 0 }), hypotheses: hypothesisEvidence(),
      referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(built.supportedCandidateIds).toEqual([]);
    expect(evaluateIntentReopening({
      belief: built, actorCandidates, ownCandidates,
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    })).toMatchObject({ status: 'kept', reason: 'emptySupport' });
  });

  it('keeps a current target that is outside all supported actor regions', () => {
    expect(evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates,
      currentCandidateId: 'b', lastRevisionObservedTick: null,
    })).toMatchObject({ status: 'kept', reason: 'currentAdmissible' });
  });

  it('reopens below the existing physical minimum distance', () => {
    const result = evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates,
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    });
    expect(result).toMatchObject({
      status: 'reopened',
      reason: 'observedOccupancyConflict',
      currentCandidateId: 'a',
      replacement: { id: 'b' },
    });
  });

  it('treats exact physical minimum distance as admissible', () => {
    const exact = ownCandidates.map((candidate) => candidate.id === 'a'
      ? { ...candidate, point: { x: 5 + PLAYER_MIN_DIST, y: 0 } }
      : candidate);
    expect(evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates: exact,
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    })).toMatchObject({ status: 'kept', reason: 'currentAdmissible' });
  });

  it('never selects another candidate that remains conflicted', () => {
    const crowded = [
      ownCandidates[0],
      { id: 'b', point: { x: 4.5, y: 0 } },
      { id: 'c', point: { x: 5, y: 0.5 } },
    ];
    expect(evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates: crowded,
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    })).toMatchObject({ status: 'unsupported', replacement: null });
  });

  it('is invariant to candidate input ordering', () => {
    const forward = evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates,
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    });
    const reversed = evaluateIntentReopening({
      belief: belief(), actorCandidates: [...actorCandidates].reverse(),
      ownCandidates: [...ownCandidates].reverse(),
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    });
    expect(reversed).toEqual(forward);
  });

  it('rejects a changed reference epoch instead of carrying belief through it', () => {
    expect(buildObserverIntentBelief({
      evidence: evidence(undefined, 21), hypotheses: hypothesisEvidence(),
      referenceGid: 3, referenceEpoch: 5, previous: belief(),
    })).toBeNull();
  });

  it('keeps familiarity and coach doctrine outside support and reopening', () => {
    const first = buildObserverIntentBelief({
      evidence: evidence(), hypotheses: hypothesisEvidence(),
      referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    const second = buildObserverIntentBelief({
      evidence: evidence(), hypotheses: hypothesisEvidence(),
      referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(second).toEqual(first);
    expect(Object.keys(first)).not.toContain('familiarity');
    expect(Object.keys(first)).not.toContain('coachDoctrine');
  });

  it('copies replacement coordinates and rejects later source mutation', () => {
    const mutable = ownCandidates.map((candidate) => ({ ...candidate, point: { ...candidate.point } }));
    const result = evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates: mutable,
      currentCandidateId: 'a', lastRevisionObservedTick: null,
    })!;
    mutable[1].point.x = 99;
    expect(result.replacement).toEqual({ id: 'b', point: { x: -4, y: 0 } });
  });

  it('cannot revise twice from the same or an older observation', () => {
    expect(evaluateIntentReopening({
      belief: belief(), actorCandidates, ownCandidates,
      currentCandidateId: 'a', lastRevisionObservedTick: 20,
    })).toMatchObject({ status: 'kept', reason: 'alreadyEvaluated' });
    expect(evaluateIntentReopening({
      belief: belief(['east'], 19), actorCandidates, ownCandidates,
      currentCandidateId: 'a', lastRevisionObservedTick: 20,
    })).toMatchObject({ status: 'kept', reason: 'alreadyEvaluated' });
  });
});
