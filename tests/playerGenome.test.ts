import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import {
  ATTR_KEYS, ROSTER_ROLES, SQUAD_BUDGET, crossoverSquads, enforceBudget, mutateSquad,
  newgenFromBloodline, randomSquad, squadSummary, squadTotal, type PlayerAttributes,
} from '../src/evolution/playerGenome';
import { Match, type ShotLogEntry } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo, type TeamMatchStats } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/* ---------------- genome operators ---------------- */

describe('player genome operators', () => {
  it('random squads stay in bounds and are role-biased', () => {
    let gkReflex = 0;
    let stReflex = 0;
    const N = 50;
    for (let i = 0; i < N; i++) {
      const squad = randomSquad(new Rng(i + 1));
      expect(squad.length).toBe(ROSTER_ROLES.length); // 9 since the bench (Phase 61)
      for (const p of squad) {
        for (const k of ATTR_KEYS) {
          expect(p[k]).toBeGreaterThanOrEqual(0);
          expect(p[k]).toBeLessThanOrEqual(1);
        }
      }
      gkReflex += squad[0].reflexes; // GK slot
      stReflex += squad[5].reflexes; // ST slot
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

  it('enforceBudget: over-cap squads rescale proportionally, under-cap pass through untouched', () => {
    const hot: PlayerAttributes[] = Array.from({ length: TEAM_SIZE }, () => {
      const p = {} as PlayerAttributes;
      for (const k of ATTR_KEYS) p[k] = 0.9;
      return p;
    });
    const capped = enforceBudget(hot);
    expect(squadTotal(capped)).toBeCloseTo(SQUAD_BUDGET, 6);
    // Proportional: relative allocation is untouched — the shave is unbiased.
    const mul = SQUAD_BUDGET / squadTotal(hot);
    expect(capped[0].pace).toBeCloseTo(0.9 * mul, 9);
    const modest: PlayerAttributes[] = Array.from({ length: TEAM_SIZE }, () => {
      const p = {} as PlayerAttributes;
      for (const k of ATTR_KEYS) p[k] = 0.3;
      return p;
    });
    expect(enforceBudget(modest)).toBe(modest); // same reference: no work under cap
  });

  it('newgenFromBloodline: the successor is grown in the club\'s image', () => {
    const legend = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) legend[k] = 0.1;
    legend.reflexes = 0.95; // a keeper dynasty's slot
    let topStaysReflexes = 0;
    const N = 60;
    for (let s = 0; s < N; s++) {
      const heir = newgenFromBloodline(legend, new Rng(1000 + s));
      for (const k of ATTR_KEYS) {
        expect(heir[k]).toBeGreaterThanOrEqual(0);
        expect(heir[k]).toBeLessThanOrEqual(1);
        expect(Math.abs(heir[k] - legend[k])).toBeLessThan(0.5); // σ0.12 mutation, not a reroll
      }
      const top = ATTR_KEYS.reduce((a, b) => (heir[a] >= heir[b] ? a : b));
      if (top === 'reflexes') topStaysReflexes++;
    }
    expect(topStaysReflexes / N).toBeGreaterThan(0.9); // the bloodline holds
  });

  it('newgenFromBloodline: the academy grows what the philosophy needs (94)', () => {
    // Same retiree, same rng stream — the philosophy pull is a pure shift:
    // a containment coach's heir gains defending and sheds pace, a dive-in
    // coach's heir mirrors it, and a neutral 0.5 coach is a no-op vs the
    // two-arg legacy call. Zero-sum on the axis, everything else untouched.
    const retiree = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) retiree[k] = 0.5;
    for (let s = 0; s < 20; s++) {
      const neutral = newgenFromBloodline(retiree, new Rng(2000 + s));
      const legacy = newgenFromBloodline(retiree, new Rng(2000 + s), 0.5);
      const jockey = newgenFromBloodline(retiree, new Rng(2000 + s), 0.9);
      const divein = newgenFromBloodline(retiree, new Rng(2000 + s), 0.1);
      for (const k of ATTR_KEYS) expect(legacy[k]).toBe(neutral[k]);
      expect(jockey.defending).toBeCloseTo(Math.min(1, neutral.defending + 0.4 * 0.24), 9);
      expect(jockey.pace).toBeCloseTo(Math.max(0, neutral.pace - 0.4 * 0.24), 9);
      expect(divein.pace).toBeCloseTo(Math.min(1, neutral.pace + 0.4 * 0.24), 9);
      expect(divein.defending).toBeCloseTo(Math.max(0, neutral.defending - 0.4 * 0.24), 9);
      for (const k of ATTR_KEYS) {
        if (k === 'defending' || k === 'pace') continue;
        expect(jockey[k]).toBe(neutral[k]);
        expect(divein[k]).toBe(neutral[k]);
      }
    }
  });

  it('squadSummary averages attributes', () => {
    const squad = randomSquad(new Rng(11));
    const s = squadSummary(squad);
    const manual = squad.reduce((acc, p) => acc + p.pace, 0) / squad.length;
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
  Array.from({ length: TEAM_SIZE }, () => {
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
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutralGenome(),
    squad,
  };
}

const SEEDS = [11, 42, 99, 1234, 777, 31337, 2026, 555];

function totals(
  sa: PlayerAttributes[],
  sb: PlayerAttributes[],
  seeds: readonly number[] = SEEDS,
): [TeamMatchStats, TeamMatchStats, ShotLogEntry[]] {
  const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
    // Numeric counters sum; goalChannels (Phase 113) merges per channel.
    const out = { ...a, goalChannels: { ...a.goalChannels } };
    const on = out as unknown as Record<string, number>;
    const bn = b as unknown as Record<string, number>;
    for (const k of Object.keys(out)) if (k !== 'goalChannels') on[k] += bn[k];
    for (const c of Object.keys(out.goalChannels) as Array<keyof typeof out.goalChannels>) {
      out.goalChannels[c] += b.goalChannels[c];
    }
    return out;
  };
  // Side-balanced: each seed runs both home/away orders so iteration- or
  // side-linked noise cancels (§10.5 — one-order pools flipped on real
  // effects twice as the engine's rng stream moved under them).
  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
  const shots: ShotLogEntry[] = [];
  for (const seed of seeds) {
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

  it('finishing: clinical squad converts more of its shots into goals', { timeout: 240000 }, async () => {
    // Two design notes, learned the hard way:
    // 1. "On target" is a bad proxy — sprayed shots drift toward the keeper
    //    and get "saved" (counted on target) while corner-shaving finishes
    //    either score or go just wide. Conversion is the honest metric.
    // 2. The effect is a few percentage points, so this needs POWER and
    //    side-balancing (hi-fin plays each side equally) — a handful of
    //    one-sided matches measures pitch-side noise, not finishing.
    const hi = { shots: 0, goals: 0 };
    const lo = { shots: 0, goals: 0 };
    // 270 seeds (was 90, was 30 — §10.5's law of this file): the effect is
    // a solid ~4pp at scale (verified 31.9: 21.3% vs 17.7% at 270×2), but
    // at 90×2 that's only ~1.6σ over shot-count noise and the pool flipped
    // on the corner-flood mechanics churn. 540 matches ⇒ ~2.8σ.
    for (let i = 0; i < 270; i++) {
      // Yield periodically: 180 full matches peg the CPU and starve
      // vitest's RPC heartbeat on 2-core CI runners (repo CI rule) — this
      // one first tripped it when 6v6 matches got ~30% dearer (phase 30).
      if (i % 25 === 0) await new Promise((r) => setImmediate(r));
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

  it('reflexes: better keeper saves a higher share of on-target shots', { timeout: 60000 }, () => {
    // Own wide pool (31.9, §10.5): at the 8-seed default a keeper faces
    // only ~35 on-target shots — the real ~13pp save-rate edge (54.8% vs
    // 41.7% at 120 matches) is ~1σ there and flipped on the tackle-economy
    // churn. 60 seeds ⇒ ~120 faced per arm, edge >2σ.
    const seeds = Array.from({ length: 60 }, (_, i) => 5000 + i * 13);
    const [a, b] = totals(squadWith({ reflexes: 0.95 }), squadWith({ reflexes: 0.05 }), seeds);
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
