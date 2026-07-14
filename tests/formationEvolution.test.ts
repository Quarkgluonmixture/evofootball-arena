import { describe, expect, it } from 'vitest';
import { createFranchise } from '../src/evolution/franchise';
import { evolveGroup } from '../src/evolution/evolve';
import { League } from '../src/sim/League';
import { Rng } from '../src/utils/rng';

/**
 * Phase 31 step 4 — formations enter EVOLUTION. Style is franchise DNA:
 * a reborn club inherits its tactical identity from the dominant parent,
 * surviving clubs rarely mutate ONE component (lineage-logged 🔧), and the
 * league-wide distribution stays non-degenerate (zonal guarded rare —
 * failure mode 18).
 */

function group(rng: Rng, n = 8): ReturnType<typeof createFranchise>[] {
  const taken = new Set<string>();
  return Array.from({ length: n }, (_, i) => createFranchise(i, rng, taken, 0));
}

describe('rebirth inherits the dominant parent style', () => {
  it('a reborn club carries the first-picked parent identity, not its genome readout', () => {
    // Pool over seeds: every reborn club's style must equal SOME parent's
    // style object values (the dominant pick is rng-driven — asserting
    // membership in the two parents' styles is the deterministic form).
    for (let seed = 0; seed < 12; seed++) {
      const rng = new Rng(seed);
      const fr = group(rng);
      const fitness = new Map(fr.map((f, i) => [f.slot, 1 - i * 0.1]));
      const entries = evolveGroup(fr, fitness, 1, rng, { eliteN: 2, rebornN: 3 }, new Set(fr.map((f) => f.name)));
      // Parent styles read AFTER evolution: a pooled parent (top-4 spans the
      // mutated tier) may itself have been style-mutated earlier in the SAME
      // pass, and the reborn club inherits that FRESH identity. Parents keep
      // their names (only reborn clubs rename), so the lookup still resolves.
      const styleByName = new Map(fr.map((f) => [f.name, { ...f.style }]));
      for (const e of entries) {
        if (e.kind !== 'reborn') continue;
        const f = fr.find((x) => x.slot === e.slot)!;
        const parentStyles = e.parents!.map((p) => styleByName.get(p)!);
        const match = parentStyles.some(
          (s) =>
            s.formationAtk === f.style.formationAtk &&
            s.formationDef === f.style.formationDef &&
            // The zonal ecology budget may clamp an inherited zonal scheme
            // to man (failure mode 18 guard) — that's the design, not a
            // broken inheritance.
            (s.scheme === f.style.scheme || (s.scheme === 'zonal' && f.style.scheme === 'man')),
        );
        expect(match).toBe(true);
      }
    }
  });
});

describe('style mutation (🔧)', () => {
  it('happens rarely, switches exactly one component, and logs the lineage note', () => {
    let switches = 0;
    let seasons = 0;
    for (let seed = 0; seed < 10; seed++) {
      const rng = new Rng(seed * 7 + 1);
      const fr = group(rng);
      for (let gen = 1; gen <= 12; gen++) {
        seasons++;
        const before = new Map(fr.map((f) => [f.slot, { ...f.style }]));
        const fitness = new Map(fr.map((f, i) => [f.slot, 1 - ((i + gen) % 8) * 0.1]));
        evolveGroup(fr, fitness, gen, rng, { eliteN: 2, rebornN: 0 }, new Set(fr.map((f) => f.name)));
        for (const f of fr) {
          const last = f.lineage[f.lineage.length - 1];
          const b = before.get(f.slot)!;
          const changed =
            (b.formationAtk !== f.style.formationAtk ? 1 : 0) +
            (b.formationDef !== f.style.formationDef ? 1 : 0) +
            (b.scheme !== f.style.scheme ? 1 : 0);
          if (last.note?.startsWith('🔧')) {
            switches++;
            expect(changed).toBe(1); // ONE component, not a reshuffle
          } else if (last.event === 'mutated') {
            expect(changed).toBe(0); // no silent identity drift
          }
        }
      }
    }
    // ~0.08/season on the mutated band (6 of 8 clubs) over 120 seasons
    // ≈ 40-60 expected switches with the zonal guard — assert it's alive
    // and still rare.
    expect(switches).toBeGreaterThan(10);
    expect(switches).toBeLessThan(seasons * 3);
  });
});

describe('league-level style ecology', () => {
  it('ten seasons: shares stay accounted, the zonal budget holds, the founding pool is diverse', { timeout: 180000 }, async () => {
    // FAILURE MODE 12 lesson (paid on CI): a 10-season simulated TRAJECTORY
    // differs across V8 builds — one knife-edge match flips a champion,
    // parents change, and "which formation survived" diverges (low-32 went
    // extinct on CI's Node while thriving locally). So this test asserts
    // only ENGINE-STABLE properties: franchise creation is pure seeded
    // arithmetic (founding diversity is cross-engine exact), the share
    // bookkeeping must always sum to the 16 clubs, and the zonal budget's
    // CONTRACT (never more zonal clubs than max(4, founded count)) holds
    // on any trajectory. What the evolved distribution looks like is
    // evolve-check's job — a human eyeballs it, no assertion rides on it.
    const league = new League({ seed: 31313 });
    const founded = league.franchises.filter((f) => f.style.scheme === 'zonal').length;
    const foundedAtk = new Set(league.franchises.map((f) => f.style.formationAtk));
    const foundedDef = new Set(league.franchises.map((f) => f.style.formationDef));
    expect(foundedAtk.size).toBe(2); // both attack identities exist at founding
    expect(foundedDef.size).toBe(2);

    // CI lesson (Phase 25 / 1c504f0): a minute of blocking sim starves the
    // vitest worker heartbeat — yield the event loop between matches.
    let played = 0;
    for (let s = 0; s < 10; s++) {
      while (!league.seasonDone) {
        if (played++ % 25 === 0) await new Promise((r) => setImmediate(r));
        const f = league.nextFixture()!;
        league.applyResult(f, league.createMatch(f).runToCompletion());
      }
      league.finishSeason();
    }
    for (const rec of league.history) {
      expect(rec.styleShares).toBeDefined();
      const { atk, def, scheme } = rec.styleShares!;
      const sum = (r: Record<string, number>): number => Object.values(r).reduce((a, b) => a + b, 0);
      expect(sum(atk)).toBe(16);
      expect(sum(def)).toBe(16);
      expect(sum(scheme)).toBe(16);
      // The budget contract: entries are blocked once the league holds 4
      // zonal clubs, so the count can never EXCEED where it started (or 4,
      // whichever is higher) — on any engine, any trajectory.
      expect(scheme['zonal'] ?? 0).toBeLessThanOrEqual(Math.max(4, founded));
    }
  });
});
