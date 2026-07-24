import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import {
  PASS_POWER_EXECUTED_MAX, PASS_POWER_EXECUTED_MIN, PASS_POWER_MAX, PASS_POWER_MIN,
} from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * C1-A pass power as an executable input (docs/world-model/PASS-POWER-SLICE.md
 * §8). Power 1.0 must be arithmetically inert AND consume no RNG; a harder ball
 * must leave faster; and the execution error must be technique-scaled, bounded,
 * and present only when the passer reaches away from 1.0.
 */

const attrs = (overrides: Partial<PlayerAttributes> = {}): PlayerAttributes => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  return { ...a, ...overrides };
};
const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const team = (name: string, passing = 0.5): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: neutralGenome(),
  squad: Array.from({ length: TEAM_SIZE }, () => attrs({ passing })),
});

const rngState = (match: Match): number => (match.rng as unknown as { s: number }).s;

/** A frozen, repeatable straight-ahead pass: same bodies, same aim, same seed. */
const stagedPass = (passing = 0.5) => {
  const match = new Match({
    seed: 4242, teamA: team('A', passing), teamB: team('B', passing), duration: 240,
  });
  const passer = match.teams[0].players[2];
  const mate = match.teams[0].players[5];
  passer.pos = v2(0, 0);
  passer.vel = v2(0, 0);
  passer.heading = v2(1, 0);
  passer.kickCooldown = 0;
  mate.pos = v2(15, 0);
  mate.vel = v2(0, 0);
  match.ball.owner = passer;
  match.ball.pos = v2(0, 0);
  match.ball.vel = v2(0, 0);
  return { match, passer, mate };
};

const launchSpeed = (power: number, passing = 0.5): number => {
  const { match, passer, mate } = stagedPass(passing);
  match.performPass(passer, mate, false, power);
  return Math.hypot(match.ball.vel.x, match.ball.vel.y);
};

describe('C1-A pass power (dormant substrate)', () => {
  it('power 1.0 draws no RNG and matches the untouched distance formula', () => {
    const { match, passer, mate } = stagedPass();
    const before = rngState(match);
    match.performPass(passer, mate, false, 1);
    const after = rngState(match);
    // The aim spray still draws (unchanged); the point is that no EXTRA draw
    // happens for power, so a 1.0 call is stream-identical to the old path.
    const control = stagedPass();
    const controlBefore = rngState(control.match);
    control.match.performPass(control.passer, control.mate);
    expect(rngState(control.match) - controlBefore).toBe(after - before);
    expect(Math.hypot(match.ball.vel.x, match.ball.vel.y))
      .toBeCloseTo(Math.hypot(control.match.ball.vel.x, control.match.ball.vel.y), 12);
    // 15m straight ahead, no misalignment: clamp(15*0.6+8.2, 9, 22) = 17.2.
    expect(Math.hypot(match.ball.vel.x, match.ball.vel.y)).toBeCloseTo(17.2, 3);
  });

  it('a harder intended ball leaves faster and a rolled one slower', () => {
    const hot = launchSpeed(PASS_POWER_MAX);
    const flat = launchSpeed(1);
    const soft = launchSpeed(PASS_POWER_MIN);
    expect(hot).toBeGreaterThan(flat);
    expect(flat).toBeGreaterThan(soft);
  });

  it('clamps the intended power to the pre-registered band', () => {
    expect(launchSpeed(4)).toBeCloseTo(launchSpeed(PASS_POWER_MAX), 12);
    expect(launchSpeed(0.1)).toBeCloseTo(launchSpeed(PASS_POWER_MIN), 12);
  });

  it('execution error exists off 1.0, is technique-scaled, and stays bounded', () => {
    const spread = (passing: number): number => {
      const ratios: number[] = [];
      for (let seed = 0; seed < 60; seed++) {
        const match = new Match({
          seed, teamA: team('A', passing), teamB: team('B', passing), duration: 240,
        });
        const passer = match.teams[0].players[2];
        const mate = match.teams[0].players[5];
        passer.pos = v2(0, 0);
        passer.vel = v2(0, 0);
        passer.heading = v2(1, 0);
        passer.kickCooldown = 0;
        mate.pos = v2(15, 0);
        mate.vel = v2(0, 0);
        match.ball.owner = passer;
        match.ball.pos = v2(0, 0);
        match.ball.vel = v2(0, 0);
        match.performPass(passer, mate, false, PASS_POWER_MAX);
        // 17.2 is the un-powered launch speed for this geometry.
        ratios.push(Math.hypot(match.ball.vel.x, match.ball.vel.y) / 17.2);
      }
      const mean = ratios.reduce((sum, value) => sum + value, 0) / ratios.length;
      const variance = ratios.reduce((sum, value) => sum + (value - mean) ** 2, 0) / ratios.length;
      for (const ratio of ratios) {
        expect(ratio).toBeGreaterThanOrEqual(PASS_POWER_EXECUTED_MIN - 1e-9);
        expect(ratio).toBeLessThanOrEqual(PASS_POWER_EXECUTED_MAX + 1e-9);
      }
      return Math.sqrt(variance);
    };
    const clumsy = spread(0.1);
    const elite = spread(1);
    expect(clumsy).toBeGreaterThan(0);
    expect(elite).toBeGreaterThan(0);
    expect(clumsy).toBeGreaterThan(elite);
  });

  it('the lead scales with the INTENDED power: a rolled ball is led further', () => {
    // A receiver running across: a slower intended ball spends longer in flight,
    // so it must be aimed further ahead of them. The lead is computed from what
    // the passer MEANT, before any execution error — which is why the two power
    // levels separate cleanly here despite the (unchanged) aim spray.
    const meanLeadAngle = (power: number): number => {
      let sum = 0;
      const samples = 40;
      for (let seed = 0; seed < samples; seed++) {
        const match = new Match({
          seed, teamA: team('A', 1), teamB: team('B', 1), duration: 240,
        });
        const passer = match.teams[0].players[2];
        const mate = match.teams[0].players[5];
        passer.pos = v2(0, 0);
        passer.vel = v2(0, 0);
        passer.heading = v2(1, 0);
        passer.kickCooldown = 0;
        mate.pos = v2(15, 0);
        mate.vel = v2(0, 6);
        match.ball.owner = passer;
        match.ball.pos = v2(0, 0);
        match.ball.vel = v2(0, 0);
        match.performPass(passer, mate, false, power);
        sum += Math.atan2(match.ball.vel.y, match.ball.vel.x);
      }
      return sum / samples;
    };
    const rolled = meanLeadAngle(PASS_POWER_MIN);
    const drilled = meanLeadAngle(PASS_POWER_MAX);
    // Analytic gap for this geometry: ~19.4° vs ~14.6°, far outside the spray.
    expect(rolled).toBeGreaterThan(drilled + 0.05);
  });
});
