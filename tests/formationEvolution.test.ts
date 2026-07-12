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
      const byName = new Map(fr.map((f) => [f.name, { ...f.style }]));
      const entries = evolveGroup(fr, fitness, 1, rng, { eliteN: 2, rebornN: 3 }, new Set(fr.map((f) => f.name)));
      for (const e of entries) {
        if (e.kind !== 'reborn') continue;
        const f = fr.find((x) => x.slot === e.slot)!;
        const parentStyles = e.parents!.map((p) => byName.get(p)!);
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
  it('after 10 seasons the identity distribution is non-degenerate and zonal stays rare', { timeout: 180000 }, async () => {
    // CI lesson (Phase 25 / 1c504f0): a minute of blocking sim starves the
    // vitest worker heartbeat — yield the event loop between matches.
    let played = 0;
    const league = new League({ seed: 31313 });
    for (let s = 0; s < 10; s++) {
      while (!league.seasonDone) {
        if (played++ % 25 === 0) await new Promise((r) => setImmediate(r));
        const f = league.nextFixture()!;
        league.applyResult(f, league.createMatch(f).runToCompletion());
      }
      league.finishSeason();
    }
    const rec = league.history[league.history.length - 1];
    expect(rec.styleShares).toBeDefined();
    const { atk, def, scheme } = rec.styleShares!;
    // Nothing extinct, no monoculture (16 clubs total).
    expect(atk['wide-212'] ?? 0).toBeGreaterThan(0);
    expect(atk['narrow-122'] ?? 0).toBeGreaterThan(0);
    expect(def['low-32'] ?? 0).toBeGreaterThan(0);
    expect(def['press-23'] ?? 0).toBeGreaterThan(0);
    // Zonal is the RARE identity by design (failure mode 18).
    expect(scheme['zonal'] ?? 0).toBeLessThanOrEqual(6);
    expect(scheme['man'] ?? 0).toBeGreaterThanOrEqual(10);
  });
});
