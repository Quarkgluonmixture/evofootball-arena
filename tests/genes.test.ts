import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo, type TeamMatchStats } from '../src/sim/types';

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
  Array.from({ length: TEAM_SIZE }, () => {
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
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome,
    squad: neutralSquad(),
    // Phase 30: pin the tactical SYSTEM. Genes now also derive the
    // formation/scheme identity; these tests predate that and measure the
    // gene's in-system effect (e.g. low markingAggression must mean sloppy
    // marking, not "a zonal side" — the zone lattice out-defends man and
    // flipped the recovery test's sign).
    style: { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' },
  };
}

function totals(gA: TacticalGenome, gB: TacticalGenome, seeds: number[]): [TeamMatchStats, TeamMatchStats] {
  const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
    const out = { ...a };
    for (const k of Object.keys(out) as Array<keyof TeamMatchStats>) out[k] += b[k];
    return out;
  };
  // Side-balanced: each seed runs both home/away orders so iteration- or
  // side-linked noise cancels (§10.5 — a one-order 6-match pool lost a real
  // +46% shootBias effect to a 31–32 coin flip after Phase 27.2).
  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
  for (const seed of seeds) {
    const ab = new Match({ seed, teamA: team('A', gA), teamB: team('B', gB), duration: 120 }).runToCompletion();
    acc = acc ? [sum(acc[0], ab.stats[0]), sum(acc[1], ab.stats[1])] : [ab.stats[0], ab.stats[1]];
    const ba = new Match({ seed, teamA: team('B', gB), teamB: team('A', gA), duration: 120 }).runToCompletion();
    acc = [sum(acc[0], ba.stats[1]), sum(acc[1], ba.stats[0])];
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
    // Wide pool (§10.5, re-widened Phase 31.9): the organized league prices
    // shootBias at a ~9% shot margin — at the old 12-seed pool (24 matches)
    // that's diff≈21 vs σ≈22, a literal coin flip that re-rolled on every
    // mechanics change. 48 seeds ⇒ four disjoint pools probed +64/+40/+56/
    // +47 — the sign is stable at this size and only at this size.
    const [a, b] = totals(shooter, shy, Array.from({ length: 48 }, (_, i) => 10000 + i));
    expect(a.shots).toBeGreaterThan(b.shots);
  });

  it('markingAggression wins more tackles; pressIntensity sends the second chaser (focused)', () => {
    // Was a 24-match recovery-count pool — after the 30.5/31.6 stance
    // passes the genes' match-level margin (a few recoveries) sank below
    // pitch noise and the pool measured nothing (failure mode 15: dilution
    // is fixed by a focused harness, not a bigger soup). Channel 1: the
    // tackle roll itself, 300 seeded attempts per aggression extreme.
    const tackleWins = (aggr: number): number => {
      const g = neutral();
      g.markingAggression = aggr;
      let wins = 0;
      for (let seed = 0; seed < 300; seed++) {
        const m = new Match({ seed: seed * 3 + 1, teamA: team('A', neutral()), teamB: team('B', g), duration: 120 });
        while (m.phase !== 'playing') m.step(1 / 60);
        const carrier = m.teams[0].players[5];
        carrier.pos = { x: 0, y: 0 };
        m.ball.owner = carrier;
        m.ball.pos = { x: 0.4, y: 0 };
        m.possessionSide = 0;
        m.kickoffKickGid = null;
        const tackler = m.teams[1].players[1];
        tackler.pos = { x: 0.9, y: 0.3 };
        tackler.tackleCooldown = 0;
        tackler.stunTimer = 0;
        m.step(1 / 60); // one step: tryTackles rolls once for the adjacent man
        if (m.ball.owner !== carrier) wins++;
      }
      return wins;
    };
    expect(tackleWins(0.9)).toBeGreaterThan(tackleWins(0.1) + 20);

    // Channel 2: pressIntensity's coordination payoff — the pressing side
    // fields a SECOND chaser where the passive side keeps one.
    const chasers = (press: number): number => {
      const g = neutral();
      g.pressIntensity = press;
      const m = new Match({ seed: 7, teamA: team('A', neutral()), teamB: team('B', g), duration: 120 });
      while (m.phase !== 'playing') m.step(1 / 60);
      const carrier = m.teams[0].players[2];
      carrier.pos = { x: -20, y: 0 }; // deep in A's half — press territory for B
      m.ball.owner = carrier;
      m.ball.pos = { x: -19.6, y: 0 };
      m.possessionSide = 0;
      m.kickoffKickGid = null;
      for (let i = 0; i < 30; i++) m.step(1 / 60); // let the team brain settle
      return m.teams[1].chasers.size;
    };
    expect(chasers(0.95)).toBe(2);
    expect(chasers(0.05)).toBe(1);
  });

  it('direct sides (riskTolerance + tempo) play more through balls than patient sides', () => {
    // Phase 19: through balls are gated by riskTolerance and tempo — style,
    // not a global behavior. Side-balanced + pooled per §10.5.
    const direct = neutral();
    direct.riskTolerance = 0.95;
    direct.tempo = 0.9;
    const patient = neutral();
    patient.riskTolerance = 0.05;
    patient.tempo = 0.1;
    const seeds = [11, 42, 99, 1234, 777, 31337];
    const [a1, b1] = totals(direct, patient, seeds);
    const [b2, a2] = totals(patient, direct, seeds.map((s) => s + 13));
    expect(a1.throughBalls + a2.throughBalls).toBeGreaterThan(b1.throughBalls + b2.throughBalls);
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
