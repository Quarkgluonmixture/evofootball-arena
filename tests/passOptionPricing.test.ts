import { describe, expect, it } from 'vitest';
import { isObservedOption, pricePassOption } from '../src/ai/passOptionPricing';
import {
  PASS_PRIOR_BANDS, PASS_PRIOR_MARGINAL, PASS_PRIOR_TABLE, passPriorAt, passPriorBandIndex,
} from '../src/ai/passPrior';
import type { PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';

/**
 * EDS E2a hostile tests. The one that matters is NEVER-NULL: E0 deleted 55 of
 * 120 states for lack of an observation, and deleting options is what made
 * not-looking informationally superior in S3b. A pricing layer that can return
 * null has not fixed anything.
 */

const emptySnapshot = (observerGid: number): PerceptionSnapshot => ({
  tick: 100,
  observerGid,
  awareness: 0.8,
  ball: null,
  players: [],
});

const reachProfiles = new Map<number, KnownReachProfile>([
  [1, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [2, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
]);

describe('EDS E2a pricing layer', () => {
  it('NEVER returns null — an unseen man is unpriceable, not unavailable', () => {
    for (const power of [0.85, 1, 1.15]) {
      const option = pricePassOption({
        snapshot: emptySnapshot(1),
        passerGid: 1,
        targetGid: 2,
        powerMultiplier: power,
        attackDir: 1,
        reachProfiles,
      });
      expect(option).not.toBeNull();
      expect(option.source).toBe('prior');
      expect(option.powerMultiplier).toBe(power);
    }
  });

  it('an unknown reads as unknown, never as zero', () => {
    const option = pricePassOption({
      snapshot: emptySnapshot(1),
      passerGid: 1,
      targetGid: 2,
      powerMultiplier: 1,
      attackDir: 1,
      reachProfiles,
    });
    // No physical read at all — a consumer that wants seconds must ask whether
    // the option was observed, and get null if it was not.
    expect(option.observed).toBeNull();
    expect(isObservedOption(option)).toBe(false);
    expect(option.priorBand).toBeNull();
    expect(option.receptionSuccessPrior).toBe(PASS_PRIOR_MARGINAL.receptionSuccessRate);
  });

  it('an unseen option cannot be told apart by power — no information, no choice', () => {
    const price = (power: number) => pricePassOption({
      snapshot: emptySnapshot(1),
      passerGid: 1,
      targetGid: 2,
      powerMultiplier: power,
      attackDir: 1,
      reachProfiles,
    });
    expect(price(0.85).receptionSuccessPrior).toBe(price(1.15).receptionSuccessPrior);
    expect(price(0.85).interceptedPrior).toBe(price(1.15).interceptedPrior);
  });

  it('the band lookup covers the censused window and refuses to extrapolate', () => {
    expect(passPriorBandIndex(5.99)).toBeNull();
    expect(passPriorBandIndex(6)).toBe(0);
    expect(passPriorBandIndex(13.99)).toBe(1);
    expect(passPriorBandIndex(30)).toBe(PASS_PRIOR_BANDS.length - 1);
    expect(passPriorBandIndex(30.01)).toBeNull();
    // Outside the window the marginal is the honest answer, not an extension
    // of the nearest band.
    expect(passPriorAt(45)).toBe(PASS_PRIOR_MARGINAL);
    expect(passPriorAt(20)).toBe(PASS_PRIOR_TABLE[3]);
  });

  it('the table has one row per band', () => {
    expect(PASS_PRIOR_TABLE).toHaveLength(PASS_PRIOR_BANDS.length);
  });
});
