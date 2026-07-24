import { describe, expect, it } from 'vitest';
import {
  buildMotionGatedBelief,
  evaluateMotionGatedReopening,
} from '../src/ai/motionGatedIntentResponse';
import type { ObserverIntentBelief } from '../src/ai/intentResponse';
import type { IntentCandidateHypothesis } from '../src/ai/intentProcess';
import type {
  ObservedMotionHistory,
  ObservedMotionSample,
} from '../src/ai/motionEvidence';
import { PLAYER_MIN_DIST } from '../src/sim/constants';

const sample = (
  observedTick: number,
  pos: { x: number; y: number },
  vel: { x: number; y: number },
  bodyDir: { x: number; y: number } = { x: 1, y: 0 },
  over: Partial<ObservedMotionSample> = {},
): ObservedMotionSample => ({
  observerGid: 2,
  actorGid: 1,
  observedTick,
  observationAgeTicks: 0,
  pos,
  vel,
  bodyDir,
  ...over,
});

const history = (
  samples: readonly ObservedMotionSample[],
  over: Partial<ObservedMotionHistory> = {},
): ObservedMotionHistory => ({
  observerGid: 2,
  actorGid: 1,
  referenceGid: 3,
  referenceEpoch: 4,
  samples,
  ...over,
});

// Active continuation east: net displacement 0.6m, speeds rising (no braking),
// newest inter-sample displacement bearing due east.
const activeEast = (): ObservedMotionHistory => history([
  sample(10, { x: 0, y: 0 }, { x: 1, y: 0 }),
  sample(20, { x: 0.3, y: 0 }, { x: 1.5, y: 0 }),
  sample(30, { x: 0.6, y: 0 }, { x: 2, y: 0 }),
]);

const actorCandidates: readonly IntentCandidateHypothesis[] = [
  { id: 'east', point: { x: 5, y: 0 } },
  { id: 'north', point: { x: 0, y: 5 } },
];
const ownCandidates: readonly IntentCandidateHypothesis[] = [
  { id: 'a', point: { x: 5.5, y: 0 } },
  { id: 'b', point: { x: -4, y: 0 } },
  { id: 'c', point: { x: 0, y: -4 } },
];

const reopen = (over: Partial<Parameters<typeof evaluateMotionGatedReopening>[0]> = {}) =>
  evaluateMotionGatedReopening({
    history: activeEast(),
    actorCandidates,
    ownCandidates,
    currentCandidateId: 'a',
    lastRevisionObservedTick: null,
    referenceGid: 3,
    referenceEpoch: 4,
    previousBelief: null,
    ...over,
  });

describe('D-PROC-1G motion-gated intent reopening', () => {
  // 1. The module has no private-target channel; support is a pure function of
  // observed motion, so identical exterior histories yield identical belief.
  it('cannot let any private target alter identical observed-motion belief', () => {
    const build = () => buildMotionGatedBelief({
      history: activeEast(), actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    });
    expect(build()).toEqual(build());
    expect(build()!.supportedCandidateIds).toEqual(['east']);
  });

  // 2. A repeated newest observed tick is idempotent.
  it('is idempotent for a repeated newest observed tick', () => {
    const previous = buildMotionGatedBelief({
      history: activeEast(), actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    const repeated = buildMotionGatedBelief({
      history: activeEast(), actorCandidates, referenceGid: 3, referenceEpoch: 4, previous,
    });
    expect(repeated).toEqual(previous);
    expect(repeated?.supportedCandidateIds).not.toBe(previous.supportedCandidateIds);
  });

  // 3. Empty support (net displacement below 0.50m) keeps the current intent.
  it('keeps the current intent when motion support is empty', () => {
    const still = history([
      sample(10, { x: 0, y: 0 }, { x: 0.1, y: 0 }),
      sample(20, { x: 0.1, y: 0 }, { x: 0.1, y: 0 }),
      sample(30, { x: 0.2, y: 0 }, { x: 0.1, y: 0 }),
    ]);
    const belief = buildMotionGatedBelief({
      history: still, actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(belief.supportedCandidateIds).toEqual([]);
    expect(reopen({ history: still })!.reopening).toMatchObject({
      status: 'kept', reason: 'emptySupport',
    });
  });

  // 4. Supported actor hypotheses that do not overlap the current target keep it.
  it('keeps a current target outside all supported actor regions', () => {
    expect(reopen({ currentCandidateId: 'b' })!.reopening).toMatchObject({
      status: 'kept', reason: 'currentAdmissible',
    });
  });

  // 5. Overlap below the existing physical minimum distance reopens.
  it('reopens below the existing physical minimum distance', () => {
    expect(reopen()!.reopening).toMatchObject({
      status: 'reopened',
      reason: 'observedOccupancyConflict',
      currentCandidateId: 'a',
      replacement: { id: 'b' },
    });
  });

  // 6. Equality at PLAYER_MIN_DIST remains admissible.
  it('treats exact physical minimum distance as admissible', () => {
    const exact = ownCandidates.map((candidate) => candidate.id === 'a'
      ? { ...candidate, point: { x: 5 + PLAYER_MIN_DIST, y: 0 } }
      : candidate);
    expect(reopen({ ownCandidates: exact })!.reopening).toMatchObject({
      status: 'kept', reason: 'currentAdmissible',
    });
  });

  // 7. An inadmissible replacement can never be selected.
  it('never selects another candidate that remains conflicted', () => {
    const crowded = [
      ownCandidates[0],
      { id: 'b', point: { x: 4.5, y: 0 } },
      { id: 'c', point: { x: 5, y: 0.5 } },
    ];
    expect(reopen({ ownCandidates: crowded })!.reopening).toMatchObject({
      status: 'unsupported', replacement: null,
    });
  });

  // 8. Candidate input ordering is irrelevant.
  it('is invariant to candidate input ordering', () => {
    const forward = reopen()!.reopening;
    const reversed = reopen({
      actorCandidates: [...actorCandidates].reverse(),
      ownCandidates: [...ownCandidates].reverse(),
    })!.reopening;
    expect(reversed).toEqual(forward);
  });

  // 9. Belief cannot be carried across a changed reference epoch.
  it('rejects a belief carried through a changed reference epoch', () => {
    const previous: ObserverIntentBelief = {
      observerGid: 2, actorGid: 1, referenceGid: 3, referenceEpoch: 4,
      observedTick: 30, supportedCandidateIds: ['east'],
    };
    expect(buildMotionGatedBelief({
      history: history(activeEast().samples, { referenceEpoch: 5 }),
      actorCandidates, referenceGid: 5, referenceEpoch: 5, previous,
    })).toBeNull();
  });

  // 10. Neutral familiarity/doctrine has no representation in the belief.
  it('keeps familiarity and coach doctrine outside support', () => {
    const belief = buildMotionGatedBelief({
      history: activeEast(), actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(Object.keys(belief)).not.toContain('familiarity');
    expect(Object.keys(belief)).not.toContain('coachDoctrine');
  });

  // 11. Mutating source candidates after evaluation cannot change the result.
  it('copies replacement coordinates and rejects later source mutation', () => {
    const mutable = ownCandidates.map((candidate) => ({ ...candidate, point: { ...candidate.point } }));
    const result = reopen({ ownCandidates: mutable })!;
    mutable[1].point.x = 99;
    expect(result.reopening.replacement).toEqual({ id: 'b', point: { x: -4, y: 0 } });
  });

  // 12. Re-evaluation at one observed tick cannot create another revision.
  it('cannot revise twice from the same or an older observation', () => {
    expect(reopen({ lastRevisionObservedTick: 30 })!.reopening).toMatchObject({
      status: 'kept', reason: 'alreadyEvaluated',
    });
    const older = history([
      sample(9, { x: 0, y: 0 }, { x: 1, y: 0 }),
      sample(19, { x: 0.3, y: 0 }, { x: 1.5, y: 0 }),
      sample(29, { x: 0.6, y: 0 }, { x: 2, y: 0 }),
    ]);
    expect(reopen({ history: older, lastRevisionObservedTick: 30 })!.reopening).toMatchObject({
      status: 'kept', reason: 'alreadyEvaluated',
    });
  });

  // 13. A braking history yields empty support even past the displacement gate.
  it('treats a braking history as empty support despite large displacement', () => {
    const braking = history([
      sample(10, { x: 0, y: 0 }, { x: 2, y: 0 }),
      sample(20, { x: 0.3, y: 0 }, { x: 1.5, y: 0 }),
      sample(30, { x: 0.6, y: 0 }, { x: 1, y: 0 }),
    ]);
    const belief = buildMotionGatedBelief({
      history: braking, actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(belief.supportedCandidateIds).toEqual([]);
  });

  // 14. A two-sample history yields empty support regardless of magnitude.
  it('yields empty support for a two-sample history of any magnitude', () => {
    const two = history([
      sample(10, { x: 0, y: 0 }, { x: 2, y: 0 }),
      sample(20, { x: 9, y: 0 }, { x: 2, y: 0 }),
    ]);
    const belief = buildMotionGatedBelief({
      history: two, actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    });
    expect(belief).not.toBeNull();
    expect(belief!.supportedCandidateIds).toEqual([]);
    expect(belief!.observedTick).toBe(20);
  });

  // 15. An active-continuation history (>= 0.50m, no braking delta) is supported.
  it('supports an active-continuation history', () => {
    const belief = buildMotionGatedBelief({
      history: activeEast(), actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(belief.supportedCandidateIds).toEqual(['east']);
  });

  // 16. Support aligns with the NEWEST inter-sample displacement bearing, not
  // the stale pre-switch bearing.
  it('aligns support with the newest displacement bearing after a redirection', () => {
    const redirect = history([
      sample(10, { x: 0, y: 0 }, { x: 1, y: 0 }),
      sample(20, { x: 0.4, y: 0 }, { x: 0, y: 1 }),
      sample(30, { x: 0.4, y: 0.4 }, { x: 0, y: 1.2 }),
    ]);
    const candidates: readonly IntentCandidateHypothesis[] = [
      { id: 'east', point: { x: 5, y: 0.4 } },
      { id: 'north', point: { x: 0.4, y: 5 } },
    ];
    const belief = buildMotionGatedBelief({
      history: redirect, actorCandidates: candidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })!;
    expect(belief.supportedCandidateIds).toEqual(['north']);
    expect(belief.supportedCandidateIds).not.toContain('east');
  });

  // 17. A history from a different reference carrier or epoch is invalidated.
  it('invalidates a history from a different reference carrier or epoch', () => {
    expect(buildMotionGatedBelief({
      history: history(activeEast().samples, { referenceGid: 99 }),
      actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })).toBeNull();
    expect(buildMotionGatedBelief({
      history: history(activeEast().samples, { referenceEpoch: 7 }),
      actorCandidates, referenceGid: 3, referenceEpoch: 4, previous: null,
    })).toBeNull();
  });
});
