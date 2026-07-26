import { describe, expect, it } from 'vitest';
import {
  OPTION_SPACE_PRIOR_MARGINAL, VALUE_ZONE_MARGINAL, VALUE_ZONE_SAMPLE_FLOOR,
  VALUE_ZONE_TABLE, VALUE_ZONE_TABLE_TOPPED, valueZoneAt, valueZoneIndex,
} from '../src/ai/passPrior';
import { pricePassOption, threatQuintilePrice } from '../src/ai/perceivedPassChoice';
import type { PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';
import { EDS_PREVIEW_FLAGS } from '../src/game/edsPreview';
import { League } from '../src/sim/League';

/**
 * EDS E5 — the perpetual pins for the value axis (contract §5, gate Y5).
 *
 * The composition claim is exactly one sentence: `price = P̂ × V̂`, with V̂ read
 * from committed census data at the PERCEIVED position, and with the flag off
 * the price is the E3R price bit for bit. Both halves of that sentence are
 * cheap to break silently — a stray weight, a truth read instead of a percept,
 * a default that arms itself — so both are pinned here every commit.
 */

const observer = (gid: number, x: number, y: number) => ({
  gid,
  side: 0 as const,
  pos: { x, y },
  vel: { x: 0, y: 0 },
  bodyDir: { x: 1, y: 0 },
  observedTick: 0,
  ageTicks: 0,
});

/** A passer at the halfway line, one visible mate, two opponents to read past. */
const snapshotOf = (targetX: number, targetY: number): PerceptionSnapshot => ({
  tick: 0,
  observerGid: 1,
  awareness: 0.8,
  ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 1, observedTick: 0, ageTicks: 0 },
  players: [
    observer(1, 0, 0), observer(2, targetX, targetY),
    { ...observer(3, targetX * 0.5 + 3, targetY * 0.5 - 4), side: 1 as const },
    { ...observer(4, targetX * 0.5 - 3, targetY * 0.5 + 5), side: 1 as const },
  ],
});

const profile: KnownReachProfile = { topSpeed: 7, accel: 9, dribbling: 0.5 };
const reachProfiles: ReadonlyMap<number, KnownReachProfile> = new Map(
  [1, 2, 3, 4].map((gid) => [gid, profile]),
);

const price = (targetX: number, targetY: number, valueAxis: boolean, attackDir: 1 | -1 = 1) =>
  pricePassOption({
    snapshot: snapshotOf(targetX, targetY),
    passerGid: 1,
    targetGid: 2,
    attackDir,
    reachProfiles,
    valueAxis,
  });

describe('E5 value zones', () => {
  it('divides the pitch into thirds x the sim own wide gate, with no gaps', () => {
    expect(valueZoneIndex(-31, 0)).toBe(0); // own third, central
    expect(valueZoneIndex(-31, 12)).toBe(1); // own third, wide
    expect(valueZoneIndex(0, 0)).toBe(2);
    expect(valueZoneIndex(15, -3)).toBe(4);
    expect(valueZoneIndex(25, 0)).toBe(6);
    expect(valueZoneIndex(25, 11)).toBe(7); // the gate is inclusive at 11 m
    expect(valueZoneIndex(25, 10.999)).toBe(6);
    // Every cell index is in range, whatever is thrown at it.
    for (const x of [-1000, -31.5, -10.5, 0, 10.5, 21, 31.5, 1000]) {
      for (const y of [-1000, -11, 0, 11, 1000]) {
        const zone = valueZoneIndex(x, y);
        expect(zone).toBeGreaterThanOrEqual(0);
        expect(zone).toBeLessThan(VALUE_ZONE_TABLE.length);
        expect(zone).toBeLessThan(VALUE_ZONE_TABLE_TOPPED.length);
      }
    }
  });

  it('falls back to the marginal for cells the census could not measure', () => {
    // The pin follows the table the CONSUMER reads (E5c's topped-up one), not
    // the table it was derived from — a fallback rule guarding the wrong array
    // is not guarding anything.
    for (const row of VALUE_ZONE_TABLE_TOPPED) {
      if (row.receptions >= VALUE_ZONE_SAMPLE_FLOOR) continue;
      const wide = row.zone % 2 === 1;
      const band = Math.floor(row.zone / 2);
      const localX = [-20, 0, 15, 25][band];
      expect(valueZoneAt(localX, wide ? 14 : 0)).toBe(VALUE_ZONE_MARGINAL);
    }
  });
});

describe('E5 composition', () => {
  it('is exactly P-hat x V-hat, with the halves reported separately', () => {
    const on = price(12, 2, true);
    expect(on.infoClass).toBe('READ');
    expect(on.price).toBe(on.reception * on.value);
    expect(on.value).toBe(valueZoneAt(12, 2).shotRate);
  });

  it('reads the PERCEIVED position through the attack frame', () => {
    // The same body, the other way up the pitch: a man 25 m in front of a team
    // attacking +x is 25 m BEHIND one attacking -x, and V must know that.
    const forwards = price(25, 0, true);
    const backwards = price(25, 0, true, -1);
    expect(forwards.value).toBe(valueZoneAt(25, 0).shotRate);
    expect(backwards.value).toBe(valueZoneAt(-25, 0).shotRate);
  });

  it('prices an unseen man at both marginals, and never lets him be aimed at', () => {
    const blind = pricePassOption({
      snapshot: snapshotOf(12, 2),
      passerGid: 1,
      targetGid: 99, // nobody the passer can see
      attackDir: 1,
      reachProfiles,
      valueAxis: true,
    });
    expect(blind.infoClass).toBe('UNSEEN');
    expect(blind.executable).toBe(false);
    expect(blind.reception).toBe(
      OPTION_SPACE_PRIOR_MARGINAL.reachedRate * OPTION_SPACE_PRIOR_MARGINAL.cleanGivenReached,
    );
    expect(blind.value).toBe(VALUE_ZONE_MARGINAL.shotRate);
    expect(blind.price).toBe(blind.reception * blind.value);
  });

  it('with the axis off is the E3R price, bit for bit', () => {
    for (const [x, y] of [[12, 2], [25, 0], [-15, 14], [8, -9]] as const) {
      const off = price(x, y, false);
      expect(off.value).toBe(1);
      expect(off.price).toBe(off.reception);
      // And the reception half itself is untouched by arming the axis: the
      // value factor multiplies the E3R price, it never rewrites it.
      expect(price(x, y, true).reception).toBe(off.reception);
      // The READ half is still E2b-0's curve and nothing else.
      if (off.infoClass === 'READ') {
        expect(threatQuintilePrice(Number.NEGATIVE_INFINITY)).toBeGreaterThan(0);
      }
    }
  });
});

describe('E5 defaults', () => {
  it('is off in production, and the preview toggle does not arm it', () => {
    const league = new League({ seed: 7 });
    expect(league.matchFlags).toEqual({});
    const fixture = league.nextFixture()!;
    const match = league.createMatch(fixture);
    expect(match.edsValueAxis).toBe(false);
    expect(match.edsPerceivedChoice).toBe(false);
    expect(match.edsPerceivedDefence).toBe(false);
    // E4-PREP's toggle arms the v1 pair. E5 joins it only if E5b passes and the
    // commander says so — until then this assertion is the boundary.
    expect('edsValueAxis' in EDS_PREVIEW_FLAGS).toBe(false);
  });
});
