import { describe, expect, it } from 'vitest';
import {
  choosePerceivedPassTarget, PASS_CHOICE_MAX_METRES, PASS_CHOICE_MIN_METRES,
  passChoiceCandidateGids, pricePassOption, preferredPassPower, threatQuintilePrice,
} from '../src/ai/perceivedPassChoice';
import {
  OPTION_SPACE_PRIOR_MARGINAL, optionSpacePriorAt, THREAT_CALIBRATION,
} from '../src/ai/passPrior';
import type { PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';
import { Match } from '../src/sim/Match';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * EDS E3 — the live perceived chooser.
 * Authority: docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md §2.1
 *
 * The probe's X4 gate proves the consumer reproduces E2b-1R's banked choices.
 * These are the properties that must hold on every commit afterwards: the
 * information classes, the executable-only rule, and — the load-bearing one —
 * that with the flags off the shipped match does not know this module exists.
 */
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
const matchOf = (seed: number, flags: Partial<{
  edsTouchCost: boolean; edsPerceivedDefence: boolean; edsPerceivedChoice: boolean;
  traceChoice: boolean;
}> = {}): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240, ...flags,
});
const signatureOf = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  score: match.score,
  ball: match.ball.pos,
  players: match.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
});

const observed = (gid: number, side: 0 | 1, x: number, y: number) => ({
  gid, side, pos: { x, y }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 },
  observedTick: 0, ageTicks: 0,
});
const snapshotOf = (players: ReturnType<typeof observed>[]): PerceptionSnapshot => ({
  tick: 0,
  observerGid: 0,
  awareness: 0.8,
  ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 0, observedTick: 0, ageTicks: 0 },
  players,
});
const profiles = (gids: readonly number[]): Map<number, KnownReachProfile> =>
  new Map(gids.map((gid) => [gid, { topSpeed: 7, accel: 6, dribbling: 0.5 }]));

describe('EDS E3 — perceived pass choice', () => {
  it('the candidate window is E0\'s censused 6-30 m, and nothing else', () => {
    const passer = { gid: 0, pos: { x: 0, y: 0 } };
    const mates = [
      { gid: 1, pos: { x: 5.9, y: 0 }, role: 'MF', sentOff: false }, // too near
      { gid: 2, pos: { x: 6, y: 0 }, role: 'MF', sentOff: false }, // edge, in
      { gid: 3, pos: { x: 30, y: 0 }, role: 'MF', sentOff: false }, // edge, in
      { gid: 4, pos: { x: 30.1, y: 0 }, role: 'MF', sentOff: false }, // too far
      { gid: 5, pos: { x: 12, y: 0 }, role: 'GK', sentOff: false }, // keepers never
      { gid: 6, pos: { x: 12, y: 0 }, role: 'MF', sentOff: true }, // sent off never
      { gid: 0, pos: { x: 0, y: 0 }, role: 'MF', sentOff: false }, // himself never
    ];
    expect(passChoiceCandidateGids(passer, mates)).toEqual([2, 3]);
    expect(PASS_CHOICE_MIN_METRES).toBe(6);
    expect(PASS_CHOICE_MAX_METRES).toBe(30);
  });

  it('an UNSEEN man is priced at the option-space marginal and is NOT executable', () => {
    // Ruling #8 (l): priced always (zero deletion), kicked to never — a man you
    // cannot see is a man you cannot aim at.
    const snapshot = snapshotOf([observed(0, 0, 0, 0)]);
    const option = pricePassOption({
      snapshot, passerGid: 0, targetGid: 9, attackDir: 1, reachProfiles: profiles([0, 9]),
    });
    expect(option.infoClass).toBe('UNSEEN');
    expect(option.executable).toBe(false);
    expect(option.price).toBe(
      OPTION_SPACE_PRIOR_MARGINAL.reachedRate * OPTION_SPACE_PRIOR_MARGINAL.cleanGivenReached);
    expect(Number.isNaN(option.distance)).toBe(true); // never reads as zero metres
  });

  it('a READ option prices on E2b-0\'s measured curve, monotone in threat', () => {
    // The curve is the exchange rate; the price must be the banked composite for
    // the quintile the predicted threat falls in, and safer must never price worse.
    const prices = THREAT_CALIBRATION.map((row) => threatQuintilePrice(row.keyTo));
    expect(prices).toEqual(THREAT_CALIBRATION.map((row) => row.realizedSuccess));
    for (let index = 1; index < prices.length; index++) {
      expect(prices[index]).toBeLessThan(prices[index - 1]);
    }
    // Below the first quintile's edge and above the last: clamped, never extrapolated.
    expect(threatQuintilePrice(-99)).toBe(THREAT_CALIBRATION[0].realizedSuccess);
    expect(threatQuintilePrice(99)).toBe(
      THREAT_CALIBRATION[THREAT_CALIBRATION.length - 1].realizedSuccess);
  });

  it('chooses the best EXECUTABLE option, ties to the lower gid, and reports look-pressure', () => {
    // gid 1 is seen at 8 m with nobody near the lane; gid 9 is unseen and prices
    // at the marginal. The blind man must not win, and the pressure is reported.
    const snapshot = snapshotOf([
      observed(0, 0, 0, 0),
      observed(1, 0, 8, 0),
      observed(2, 1, -20, 20), // a defender nowhere near the corridor
    ]);
    const choice = choosePerceivedPassTarget({
      snapshot, passerGid: 0, candidateGids: [1, 9], attackDir: 1,
      reachProfiles: profiles([0, 1, 2, 9]),
    });
    expect(choice).not.toBeNull();
    expect(choice!.targetGid).toBe(1);
    expect(choice!.options.map((option) => option.infoClass)).toEqual(['READ', 'UNSEEN']);
    expect(choice!.blindOutpricesRead).toBe(
      OPTION_SPACE_PRIOR_MARGINAL.reachedRate * OPTION_SPACE_PRIOR_MARGINAL.cleanGivenReached
      > choice!.price);
    expect(choice!.blindOutpricesBand).toBe(
      OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate
      > optionSpacePriorAt(choice!.distance).receptionSuccessRate);
  });

  it('refuses to choose when nothing is executable — it never invents an aim point', () => {
    const snapshot = snapshotOf([observed(0, 0, 0, 0)]);
    expect(choosePerceivedPassTarget({
      snapshot, passerGid: 0, candidateGids: [7, 8, 9], attackDir: 1,
      reachProfiles: profiles([0, 7, 8, 9]),
    })).toBeNull();
  });

  it('the power canary is neutral at power 1.0 and reads the touch cost either side', () => {
    const snapshot = snapshotOf([
      observed(0, 0, 0, 0), observed(1, 0, 14, 0), observed(2, 1, 7, 6),
    ]);
    const reachProfiles = profiles([0, 1, 2]);
    const preference = preferredPassPower({
      snapshot, passerGid: 0, targetGid: 1, attackDir: 1, reachProfiles,
      powers: [0.85, 1, 1.15], heavyTouchCost: true,
    });
    expect(preference).not.toBeNull();
    // At the reference power the canary IS the choice axis: no double counting.
    expect(preference!.prices[1]).toBe(threatQuintilePrice(preference!.threatSeconds[1]));
    // A harder pass arrives sooner (less corridor threat) and costs the receiver
    // more; the substrate's own two-sided price, which is the canary's point.
    expect(preference!.threatSeconds[2]).toBeLessThan(preference!.threatSeconds[0]);
    expect(preference!.touchFailPriors[2]).toBeGreaterThan(preference!.touchFailPriors[0]);
    expect(preference!.preferredIndex).toBeGreaterThanOrEqual(0);
  });

  it('flags OFF: the shipped match never touches perception or the chooser', () => {
    // X1's fingerprint gate covers the league; this covers one match, on every
    // commit, and pins that arming the flags explicitly to false is the same
    // world as not knowing about them.
    const plain = matchOf(7);
    plain.runToCompletion();
    const armedOff = matchOf(7, {
      edsTouchCost: false, edsPerceivedDefence: false, edsPerceivedChoice: false,
    });
    armedOff.runToCompletion();
    expect(signatureOf(armedOff)).toBe(signatureOf(plain));
    expect(plain.passChoiceTrace).toHaveLength(0);
    expect(plain.perceptionMemories.size).toBe(0);
    expect(plain.edsPerceivedChoice).toBe(false);
  });

  it('the trace is pure observation: the bundle plays the same match with it on', () => {
    const off = matchOf(11, {
      edsTouchCost: true, edsPerceivedDefence: true, edsPerceivedChoice: true,
    });
    off.runToCompletion();
    const on = matchOf(11, {
      edsTouchCost: true, edsPerceivedDefence: true, edsPerceivedChoice: true, traceChoice: true,
    });
    on.runToCompletion();
    expect(signatureOf(on)).toBe(signatureOf(off));
    expect(on.passChoiceTrace.length).toBeGreaterThan(0);
    expect(off.passChoiceTrace).toHaveLength(0);
  });

  it('the choice flag stands ALONE: it does not need the defence flag to work', () => {
    // The §4 ablation caught this: `refreshPerception` was gated on the defence
    // flag, so "perceived choice only" silently played the legacy game (no
    // memory chain ⇒ no snapshot ⇒ the lane-score target). An ablation arm that
    // reproduces the baseline exactly is a dead flag, not a null result.
    const alone = matchOf(4242, { edsPerceivedChoice: true, traceChoice: true });
    alone.runToCompletion();
    expect(alone.passChoiceTrace.length).toBeGreaterThan(10);
    expect(alone.perceptionMemories.size).toBeGreaterThan(0);
    const plain = matchOf(4242);
    plain.runToCompletion();
    expect(signatureOf(alone)).not.toBe(signatureOf(plain));
  });

  it('the live chooser really does choose: it diverges from the lane-score brain', () => {
    // FIRES, at the match level: if every traced choice agreed with `bestMate`
    // the seam would be decorative. Ruling #10.4 measured 38-47% agreement.
    const match = matchOf(4242, {
      edsTouchCost: true, edsPerceivedDefence: true, edsPerceivedChoice: true, traceChoice: true,
    });
    match.runToCompletion();
    const priced = match.passChoiceTrace.filter((entry) => entry.chosenGid >= 0);
    expect(priced.length).toBeGreaterThan(10);
    const diverged = priced.filter((entry) => entry.chosenGid !== entry.legacyGid).length;
    expect(diverged).toBeGreaterThan(0);
    expect(diverged).toBeLessThan(priced.length);
  });
});
