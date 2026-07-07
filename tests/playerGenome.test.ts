import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import {
  ATTR_KEYS, crossoverSquads, mutateSquad, randomSquad, squadSummary, type PlayerAttributes,
} from '../src/evolution/playerGenome';
import { Match, type ShotLogEntry } from '../src/sim/Match';
import type { TeamInfo, TeamMatchStats } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/* ---------------- genome operators ---------------- */

describe('player genome operators', () => {
  it('random squads stay in bounds and are role-biased', () => {
    let gkReflex = 0;
    let stReflex = 0;
    const N = 50;
    for (let i = 0; i < N; i++) {
      const squad = randomSquad(new Rng(i + 1));
      expect(squad.length).toBe(5);
      for (const p of squad) {
        for (const k of ATTR_KEYS) {
          expect(p[k]).toBeGreaterThanOrEqual(0);
          expect(p[k]).toBeLessThanOrEqual(1);
        }
      }
      gkReflex += squad[0].reflexes; // GK slot
      stReflex += squad[4].reflexes; // ST slot
    }
    expect(gkReflex / N).toBeGreaterThan(stReflex / N);
  });

  it('mutation is bounded and deterministic', () => {
    const squad = randomSquad(new Rng(7));
    const a = mutateSquad(squad, new Rng(9));
    const b = mutateSquad(squad, new Rng(9));
    expect(a).toEqual(b);
    for (const p of a) {
      for (const k of ATTR_KEYS) {
        expect(p[k]).toBeGreaterThanOrEqual(0);
        expect(p[k]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('crossover children stay within parents per-slot bounds', () => {
    const rng = new Rng(3);
    const a = randomSquad(rng);
    const b = randomSquad(rng);
    const child = crossoverSquads(a, b, new Rng(5));
    child.forEach((p, i) => {
      for (const k of ATTR_KEYS) {
        expect(p[k]).toBeGreaterThanOrEqual(Math.min(a[i][k], b[i][k]) - 1e-9);
        expect(p[k]).toBeLessThanOrEqual(Math.max(a[i][k], b[i][k]) + 1e-9);
      }
    });
  });

  it('squadSummary averages attributes', () => {
    const squad = randomSquad(new Rng(11));
    const s = squadSummary(squad);
    const manual = squad.reduce((acc, p) => acc + p.pace, 0) / 5;
    expect(s.pace).toBeCloseTo(manual);
  });
});

/* ---------------- attribute effects in the sim ---------------- */

const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

const squadWith = (overrides: Partial<PlayerAttributes>): PlayerAttributes[] =>
  Array.from({ length: 5 }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return { ...p, ...overrides };
  });

function team(name: string, squad: PlayerAttributes[]): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome: neutralGenome(),
    squad,
  };
}

const SEEDS = [11, 42, 99, 1234, 777, 31337, 2026, 555];

function totals(
  sa: PlayerAttributes[],
  sb: PlayerAttributes[],
): [TeamMatchStats, TeamMatchStats, ShotLogEntry[]] {
  const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
    const out = { ...a };
    for (const k of Object.keys(out) as Array<keyof TeamMatchStats>) out[k] += b[k];
    return out;
  };
  // Side-balanced: each seed runs both home/away orders so iteration- or
  // side-linked noise cancels (§10.5 — one-order pools flipped on real
  // effects twice as the engine's rng stream moved under them).
  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
  const shots: ShotLogEntry[] = [];
  for (const seed of SEEDS) {
    const ab = new Match({ seed, teamA: team('A', sa), teamB: team('B', sb), duration: 120 });
    const rab = ab.runToCompletion();
    shots.push(...ab.shotLog);
    acc = acc ? [sum(acc[0], rab.stats[0]), sum(acc[1], rab.stats[1])] : [rab.stats[0], rab.stats[1]];
    const ba = new Match({ seed, teamA: team('B', sb), teamB: team('A', sa), duration: 120 });
    const rba = ba.runToCompletion();
    for (const s of ba.shotLog) shots.push({ ...s, side: (1 - s.side) as 0 | 1 });
    acc = [sum(acc[0], rba.stats[1]), sum(acc[1], rba.stats[0])];
  }
  return [acc![0], acc![1], shots];
}

describe('player attributes influence the sim', () => {
  it('pace: faster squad covers more distance', () => {
    const [a, b] = totals(squadWith({ pace: 0.95 }), squadWith({ pace: 0.05 }));
    expect(a.distance).toBeGreaterThan(b.distance);
  });

  it('finishing: clinical squad converts more of its shots into goals', () => {
    // Two design notes, learned the hard way:
    // 1. "On target" is a bad proxy — sprayed shots drift toward the keeper
    //    and get "saved" (counted on target) while corner-shaving finishes
    //    either score or go just wide. Conversion is the honest metric.
    // 2. The effect is a few percentage points, so this needs POWER and
    //    side-balancing (hi-fin plays each side equally) — a handful of
    //    one-sided matches measures pitch-side noise, not finishing.
    const hi = { shots: 0, goals: 0 };
    const lo = { shots: 0, goals: 0 };
    // 90 seeds: the Phase 19 dynamics (through balls/runs) added enough match
    // variance that 30 seeds could land on the wrong side of noise (verified:
    // at 90×2 the margin is a solid ~4pp, 23.7% vs 19.7%).
    for (let i = 0; i < 90; i++) {
      const seed = 1000 + i * 37;
      for (const hiSide of [0, 1] as const) {
        const squads =
          hiSide === 0
            ? [squadWith({ finishing: 0.95 }), squadWith({ finishing: 0.05 })]
            : [squadWith({ finishing: 0.05 }), squadWith({ finishing: 0.95 })];
        const m = new Match({ seed, teamA: team('A', squads[0]), teamB: team('B', squads[1]), duration: 120 });
        m.runToCompletion();
        for (const s of m.shotLog) {
          const t = s.side === hiSide ? hi : lo;
          t.shots++;
          if (s.outcome === 'goal') t.goals++;
        }
      }
    }
    expect(hi.goals / Math.max(hi.shots, 1)).toBeGreaterThan(lo.goals / Math.max(lo.shots, 1));
  });

  it('defending: stronger tacklers win the ball more', () => {
    const [a, b] = totals(squadWith({ defending: 0.95 }), squadWith({ defending: 0.05 }));
    expect(a.tackles).toBeGreaterThan(b.tackles);
  });

  it('reflexes: better keeper saves a higher share of on-target shots', () => {
    const [a, b] = totals(squadWith({ reflexes: 0.95 }), squadWith({ reflexes: 0.05 }));
    // Team A's keeper faces B's on-target shots and vice versa.
    const rateA = a.saves / Math.max(b.shotsOnTarget, 1);
    const rateB = b.saves / Math.max(a.shotsOnTarget, 1);
    expect(rateA).toBeGreaterThan(rateB);
  });

  it('shot log is consistent: goals in log match the score', () => {
    for (const seed of SEEDS.slice(0, 3)) {
      const m = new Match({
        seed,
        teamA: team('A', squadWith({})),
        teamB: team('B', squadWith({})),
        duration: 120,
      });
      const r = m.runToCompletion();
      const logGoals: [number, number] = [0, 0];
      for (const s of m.shotLog) {
        if (s.outcome === 'goal') logGoals[s.side]++;
        expect(s.outcome).not.toBe('pending'); // everything resolved by full time
      }
      // Every logged goal came from a shot; scramble/own goals may add to score.
      expect(logGoals[0]).toBeLessThanOrEqual(r.score[0]);
      expect(logGoals[1]).toBeLessThanOrEqual(r.score[1]);
    }
  });
});
