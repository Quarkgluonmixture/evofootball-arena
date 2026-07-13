import { describe, expect, it } from 'vitest';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { MATCH_DURATION } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * Phase 34 — the combination pack. Each pattern gets a §10.5 directional
 * harness: a genome built FOR the pattern must produce measurably more of it
 * than a genome built against it, side-balanced across seeds. The calibrate
 * economy (goals/shots) was verified separately across two seeds — these
 * tests pin the DIRECTION, not the volume.
 */

const flat = (v: number, over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = v;
  return { ...g, ...over };
};
const team = (name: string, seed: number, g: TacticalGenome): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: g,
    squad: randomSquad(rng),
  };
};

/** Subject-vs-neutral, side-balanced; returns the subject's summed stat. */
function harvest(g: TacticalGenome, stat: (s: import('../src/sim/types').TeamMatchStats) => number, seeds = 24): number {
  let total = 0;
  for (let seed = 0; seed < seeds; seed++) {
    const home = seed % 2 === 0;
    const subject = team('S', 1000 + seed, g);
    const neutral = team('N', 2000 + seed, flat(0.5));
    const m = new Match({
      seed,
      teamA: home ? subject : neutral,
      teamB: home ? neutral : subject,
      duration: MATCH_DURATION,
    });
    const res = m.runToCompletion();
    total += stat(res.stats[home ? 0 : 1]);
  }
  return total;
}

describe('2过1 — the wall pass (Phase 34)', () => {
  it('high tempo+passBias sides complete one-twos; slow sides are gated out', { timeout: 240000 }, () => {
    const high = harvest(flat(0.5, { tempo: 0.85, passBias: 0.85 }), (s) => s.oneTwos);
    const low = harvest(flat(0.5, { tempo: 0.15, passBias: 0.15 }), (s) => s.oneTwos);
    // The license gate is deterministic: (0.15+0.15)/2 < 0.35 ⇒ never granted.
    expect(low).toBe(0);
    // Probed ~0.5/match for the specialist — a dead pattern fails here.
    expect(high).toBeGreaterThanOrEqual(6);
  });
});

describe('third man — the bounce (Phase 34)', () => {
  it('possession genes release the third man far more often', { timeout: 240000 }, () => {
    const high = harvest(flat(0.5, { passBias: 0.85 }), (s) => s.thirdMan);
    const low = harvest(flat(0.5, { tempo: 0.15, passBias: 0.15 }), (s) => s.thirdMan);
    // Probed ~5/match vs ~2/match — direction with margin, not a knife edge.
    expect(high).toBeGreaterThan(low * 1.4);
    expect(high).toBeGreaterThanOrEqual(48); // ~2/match floor: the shape must be common for the specialist
  });
});

describe('套边 — the overlap (Phase 34)', () => {
  it('wide sides complete overlaps; narrow sides never even license one', { timeout: 480000 }, () => {
    const wide = harvest(flat(0.5, { attackingWidth: 0.85 }), (s) => s.overlaps, 48);
    const narrow = harvest(flat(0.5, { attackingWidth: 0.15 }), (s) => s.overlaps, 48);
    // The license gate is deterministic: width 0.15 < 0.3 ⇒ never granted.
    expect(narrow).toBe(0);
    // Structurally rare in 6v6 (no wing-backs) — probed ~0.13/match; alive ≥ 2/48.
    expect(wide).toBeGreaterThanOrEqual(2);
  });
});
