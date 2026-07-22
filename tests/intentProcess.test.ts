import { describe, expect, it } from 'vitest';
import {
  captureObservedIntentEvidence,
  createPrivateIntentTransaction,
  evaluateObservedIntentHypotheses,
  invalidatePrivateIntentForReference,
  replacePrivateIntent,
  transitionPrivateIntent,
  type IntentCandidateHypothesis,
  type ObservedIntentEvidence,
} from '../src/ai/intentProcess';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';

const player = (
  gid: number,
  pos: { x: number; y: number },
  vel = { x: 0, y: 0 },
  bodyDir = { x: 1, y: 0 },
  observedTick = 10,
  ageTicks = 0,
): ObservedPlayer => ({
  gid,
  side: gid < 10 ? 0 : 1,
  pos,
  vel,
  bodyDir,
  observedTick,
  ageTicks,
});

const snapshot = (
  actor: ObservedPlayer | null,
  observerGid = 1,
  tick = 10,
): PerceptionSnapshot => ({
  tick,
  observerGid,
  awareness: 0.8,
  ball: null,
  players: [player(observerGid, { x: -2, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, tick, 0), ...(actor ? [actor] : [])],
});

const hypotheses: readonly IntentCandidateHypothesis[] = [
  { id: 'forward', point: { x: 10, y: 0 } },
  { id: 'left', point: { x: 0, y: 10 } },
  { id: 'back', point: { x: -10, y: 0 } },
];

const transaction = () => createPrivateIntentTransaction({
  actorGid: 2,
  referenceGid: 3,
  referenceEpoch: 4,
  targetPoint: { x: 10, y: 2 },
  intendedArrivalTime: 1.5,
  openedTick: 10,
})!;

describe('private intent and observer-local embodied evidence', () => {
  it('keeps identical exterior evidence identical across different private intents', () => {
    const firstIntent = transaction();
    const secondIntent = replacePrivateIntent(firstIntent, { x: -8, y: 6 }, 2, 11)!;
    expect(firstIntent.targetPoint).not.toEqual(secondIntent.targetPoint);

    const exterior = snapshot(player(2, { x: 1, y: 0 }, { x: 0.5, y: 0 }));
    const first = captureObservedIntentEvidence(exterior, 2);
    const second = captureObservedIntentEvidence(exterior, 2);
    expect(first).toEqual(second);
    expect(evaluateObservedIntentHypotheses(first!, hypotheses))
      .toEqual(evaluateObservedIntentHypotheses(second!, hypotheses));
  });

  it('changes evidence when the same intent is embodied differently', () => {
    const prior = captureObservedIntentEvidence(
      snapshot(player(2, { x: 0, y: 0 }), 1, 10),
      2,
    )!;
    const moving = captureObservedIntentEvidence(
      snapshot(player(2, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 0 }, 11), 1, 11),
      2,
      prior,
    )!;
    const lateral = captureObservedIntentEvidence(
      snapshot(player(2, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 1 }, 11), 1, 11),
      2,
      prior,
    )!;
    expect(moving).not.toEqual(lateral);
    expect(evaluateObservedIntentHypotheses(moving, hypotheses))
      .not.toEqual(evaluateObservedIntentHypotheses(lateral, hypotheses));
  });

  it('returns unsupported when the observer cannot see or remember the actor', () => {
    expect(captureObservedIntentEvidence(snapshot(null), 2)).toBeNull();
  });

  it('does not invent motion from a stale repeated observation', () => {
    const prior = captureObservedIntentEvidence(
      snapshot(player(2, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, 10, 0), 1, 10),
      2,
    )!;
    const stale = captureObservedIntentEvidence(
      snapshot(player(2, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, 10, 3), 1, 13),
      2,
      prior,
    )!;
    expect(stale.observationAgeTicks).toBe(3);
    expect(stale.displacementSincePrevious).toBeNull();
    expect(stale.velocityChangeSincePrevious).toBeNull();
    expect(stale.bodyTurnSincePrevious).toBeNull();
  });

  it('invalidates an active private intent when its reference epoch changes', () => {
    const committed = transitionPrivateIntent(transaction(), 'committed', 11)!;
    const unchanged = invalidatePrivateIntentForReference(committed, 3, 4, 12)!;
    const invalidated = invalidatePrivateIntentForReference(committed, 3, 5, 12)!;
    expect(unchanged.phase).toBe('committed');
    expect(invalidated.phase).toBe('invalidated');
    expect(transitionPrivateIntent(invalidated, 'executing', 13)).toBeNull();
  });

  it('keeps private revocation invisible until the body observation changes', () => {
    const committed = transitionPrivateIntent(transaction(), 'committed', 11)!;
    const revoked = transitionPrivateIntent(committed, 'revoked', 12)!;
    expect(revoked.phase).toBe('revoked');
    const exterior = snapshot(player(2, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, 12), 1, 12);
    expect(captureObservedIntentEvidence(exterior, 2))
      .toEqual(captureObservedIntentEvidence(exterior, 2));
  });

  it('records a body turn without accessing a private target', () => {
    const prior = captureObservedIntentEvidence(
      snapshot(player(2, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 }, 10), 1, 10),
      2,
    )!;
    const turned = captureObservedIntentEvidence(
      snapshot(player(2, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 1 }, 11), 1, 11),
      2,
      prior,
    )!;
    expect(turned.bodyTurnSincePrevious).toBeCloseTo(Math.PI / 2, 12);
    expect(evaluateObservedIntentHypotheses(turned, hypotheses)![0].bodyBearingAlignment).toBe(0);
  });

  it('is invariant to candidate input order and rejects duplicate identities', () => {
    const evidence = captureObservedIntentEvidence(
      snapshot(player(2, { x: 1, y: 1 }, { x: 2, y: 0 })),
      2,
    )!;
    const forward = evaluateObservedIntentHypotheses(evidence, hypotheses)!;
    const reversed = evaluateObservedIntentHypotheses(evidence, [...hypotheses].reverse())!;
    expect(forward).toEqual(reversed);
    expect(evaluateObservedIntentHypotheses(evidence, [hypotheses[0], hypotheses[0]])).toBeNull();
  });

  it('copies transaction and evidence vectors instead of retaining mutable inputs', () => {
    const target = { x: 4, y: 3 };
    const created = createPrivateIntentTransaction({
      actorGid: 2,
      referenceGid: 3,
      referenceEpoch: 1,
      targetPoint: target,
      intendedArrivalTime: 1,
      openedTick: 2,
    })!;
    target.x = 99;
    expect(created.targetPoint).toEqual({ x: 4, y: 3 });

    const actor = player(2, { x: 1, y: 2 }, { x: 3, y: 4 });
    const evidence = captureObservedIntentEvidence(snapshot(actor), 2)!;
    (actor.pos as { x: number }).x = 77;
    expect(evidence.observedPos).toEqual({ x: 1, y: 2 });
  });

  it('keeps familiarity and coach doctrine outside physical evidence authority', () => {
    const external = snapshot(player(2, { x: 2, y: 1 }, { x: 1, y: 0.5 }));
    const evidence: ObservedIntentEvidence = captureObservedIntentEvidence(external, 2)!;
    const unfamiliar = evaluateObservedIntentHypotheses(evidence, hypotheses);
    const familiar = evaluateObservedIntentHypotheses(evidence, hypotheses);
    expect(familiar).toEqual(unfamiliar);
    expect(Object.keys(evidence)).not.toContain('familiarity');
    expect(Object.keys(evidence)).not.toContain('coachDoctrine');
  });

  it('rejects malformed lifecycle data and illegal phase shortcuts', () => {
    expect(createPrivateIntentTransaction({
      actorGid: 2,
      referenceGid: 2,
      referenceEpoch: 0,
      targetPoint: { x: 0, y: 0 },
      intendedArrivalTime: 1,
      openedTick: 0,
    })).toBeNull();
    expect(transitionPrivateIntent(transaction(), 'fulfilled', 11)).toBeNull();
    const committed = transitionPrivateIntent(transaction(), 'committed', 11)!;
    expect(transitionPrivateIntent(committed, 'executing', 10)).toBeNull();
  });
});
