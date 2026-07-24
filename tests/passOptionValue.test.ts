import { describe, expect, it } from 'vitest';
import {
  GENERIC_RECEIVER_POSITIONING, GENERIC_RECEIVER_TECHNIQUE, groundBallSpeedAt,
  mirroredTouchFailChance, passOptionDominates, passOptionFrontier, type PassOptionValue,
} from '../src/ai/passOptionValue';
import { touchFailChance } from '../src/sim/mechanics';
import { BALL_FRICTION_K, DT } from '../src/sim/constants';

/**
 * EDS E0 hostile tests. The important one is the MIRROR CONTRACT: a pure ai/
 * module may not import the sim's mechanics, so `mirroredTouchFailChance`
 * restates `touchFailChance`'s curve — and this test is what stops the two from
 * ever drifting apart, including when EDS E1 moves the real curve.
 */

describe('EDS E0 pass-option valuation', () => {
  it('MIRROR CONTRACT: the mirrored touch curve equals the real one', () => {
    for (const speed of [0, 3, 6, 6.5, 8, 9.8, 11.1, 14, 18, 22, 26]) {
      for (const pressure of [0, 0.25, 0.5, 0.75, 1]) {
        for (const misalign of [0, 0.5, 1]) {
          for (const technique of [0, 0.5, 1]) {
            for (const positioning of [0, 0.5, 1]) {
              expect(mirroredTouchFailChance(speed, pressure, misalign, technique, positioning))
                .toBeCloseTo(touchFailChance(speed, pressure, misalign, technique, positioning), 12);
            }
          }
        }
      }
    }
  });

  it('defaults to a GENERIC receiver — never a particular teammate', () => {
    const generic = mirroredTouchFailChance(10, 0.3, 0.4);
    const explicit = mirroredTouchFailChance(
      10, 0.3, 0.4, GENERIC_RECEIVER_TECHNIQUE, GENERIC_RECEIVER_POSITIONING,
    );
    expect(generic).toBe(explicit);
    // A real receiver's technique would move it — which is exactly what E0 is
    // forbidden from knowing (that is familiarity, A4's question).
    expect(mirroredTouchFailChance(10, 0.3, 0.4, 1, 0.5)).not.toBeCloseTo(generic, 6);
  });

  it('the friction model matches the engine tick-by-tick', () => {
    // The engine moves then decays each step; after n steps speed is v0·f^n.
    let speed = 17.2;
    for (let tick = 1; tick <= 90; tick++) {
      speed *= Math.exp(-BALL_FRICTION_K * DT);
      expect(groundBallSpeedAt(17.2, tick * DT)).toBeCloseTo(speed, 9);
    }
  });

  const option = (over: Partial<PassOptionValue> = {}): PassOptionValue => ({
    targetGid: 1,
    powerMultiplier: 1,
    flightSeconds: 1,
    arrivalSpeed: 9,
    receptionRelativeSpeed: 9,
    arrivalMarginSeconds: 0.5,
    interceptionThreatSeconds: -0.4,
    threatDefenderGid: 7,
    touchFailPrior: 0.05,
    receivePressure: 0.2,
    bodyReadiness: 0.8,
    progressionMetres: 6,
    lineBreakCount: 1,
    offsideSafe: true,
    ...over,
  });

  it('dominance is oriented: less interception threat and less touch failure are better', () => {
    const safe = option({ interceptionThreatSeconds: -0.8, touchFailPrior: 0.04 });
    const risky = option({ interceptionThreatSeconds: 0.2, touchFailPrior: 0.09 });
    expect(passOptionDominates(safe, risky)).toBe(true);
    expect(passOptionDominates(risky, safe)).toBe(false);
  });

  it('a genuine tradeoff survives the frontier; a dominated option does not', () => {
    const fastHot = option({ powerMultiplier: 1.15, interceptionThreatSeconds: -0.9, touchFailPrior: 0.09 });
    const slowSafe = option({ powerMultiplier: 0.85, interceptionThreatSeconds: -0.2, touchFailPrior: 0.03 });
    const dominated = option({ powerMultiplier: 1, interceptionThreatSeconds: 0.1, touchFailPrior: 0.12 });
    const frontier = passOptionFrontier([fastHot, slowSafe, dominated]);
    expect(frontier).toHaveLength(2);
    expect(frontier).toContain(fastHot);
    expect(frontier).toContain(slowSafe);
    expect(frontier).not.toContain(dominated);
  });

  it('identical options never dominate each other', () => {
    expect(passOptionDominates(option(), option())).toBe(false);
    expect(passOptionFrontier([option(), option()])).toHaveLength(2);
  });
});
