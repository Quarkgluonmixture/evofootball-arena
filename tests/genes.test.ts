import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import type { TeamInfo, TeamMatchStats } from '../src/sim/types';

/**
 * The core product claim: tactical genes visibly change behavior. We pit
 * opposite extremes against each other across several seeds and check that
 * aggregate stats move in the expected direction. Squads are neutral (all
 * attributes 0.5) so tactical gene effects are isolated.
 */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

export const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: 5 }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });

function team(name: string, genome: TacticalGenome): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome,
    squad: neutralSquad(),
  };
}

function totals(gA: TacticalGenome, gB: TacticalGenome, seeds: number[]): [TeamMatchStats, TeamMatchStats] {
  const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
    const out = { ...a };
    for (const k of Object.keys(out) as Array<keyof TeamMatchStats>) out[k] += b[k];
    return out;
  };
  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
  for (const seed of seeds) {
    const r = new Match({ seed, teamA: team('A', gA), teamB: team('B', gB), duration: 120 }).runToCompletion();
    acc = acc ? [sum(acc[0], r.stats[0]), sum(acc[1], r.stats[1])] : [r.stats[0], r.stats[1]];
  }
  return acc!;
}

const SEEDS = [11, 42, 99, 1234, 777, 31337];

describe('tactical genes influence behavior', () => {
  it('high passBias team passes more than a dribble-heavy team', () => {
    const passer = neutral();
    passer.passBias = 0.95;
    passer.dribbleBias = 0.1;
    passer.shootBias = 0.3;
    const dribbler = neutral();
    dribbler.passBias = 0.1;
    dribbler.dribbleBias = 0.95;
    dribbler.shootBias = 0.3;
    const [a, b] = totals(passer, dribbler, SEEDS);
    expect(a.passes).toBeGreaterThan(b.passes);
  });

  it('high shootBias team takes more shots', () => {
    const shooter = neutral();
    shooter.shootBias = 0.95;
    const shy = neutral();
    shy.shootBias = 0.05;
    const [a, b] = totals(shooter, shy, SEEDS);
    expect(a.shots).toBeGreaterThan(b.shots);
  });

  it('high pressIntensity + markingAggression team recovers the ball more', () => {
    // Side-balanced + pooled (§10.5): the raw margin is a few recoveries per
    // match, so a one-sided six-seed sample measures pitch-side noise.
    const pressing = neutral();
    pressing.pressIntensity = 0.95;
    pressing.markingAggression = 0.9;
    const passive = neutral();
    passive.pressIntensity = 0.05;
    passive.markingAggression = 0.1;
    const seeds = [11, 42, 99, 1234, 777, 31337, 5150, 2718];
    const [a1, b1] = totals(pressing, passive, seeds);
    const [b2, a2] = totals(passive, pressing, seeds.map((s) => s + 13));
    expect(a1.tackles + a1.interceptions + a2.tackles + a2.interceptions)
      .toBeGreaterThan(b1.tackles + b1.interceptions + b2.tackles + b2.interceptions);
  });

  it('stamina conservation saves energy', () => {
    const miser = neutral();
    miser.staminaConservation = 0.95;
    const sprinter = neutral();
    sprinter.staminaConservation = 0.05;
    const [a, b] = totals(miser, sprinter, SEEDS);
    expect(a.staminaSpent).toBeLessThan(b.staminaSpent);
  });
});
