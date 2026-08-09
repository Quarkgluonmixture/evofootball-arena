import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { markSagMetres } from '../src/ai/actionExecutor';
import {
  GENE_KEYS, MARK_SAG_BALL_SPEED, MARK_SAG_MAX, crossoverGenomes, markSagWeight, mutateGenome,
  randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { clamp01 } from '../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * MT-T0 (docs/world-model/MT-T0-DORMANT-SEAM.md; contract
 * docs/world-model/MARK-TIGHTNESS-CONTRACT.md §2 M-MT.1–5, §3 MT-T0; ruling #201.4)
 * — the DORMANT ACCESS-TIME MARK-SAG seam. The pins:
 *   • THE GENE `markSag` — optional, BORN ABSENT, deliberately NOT in GENE_KEYS (the
 *     #148.5 / #75 RNG-stream trap), evolving only under its OWN `evolveMarkSag`
 *     opt-in whose draws sit STRICTLY AFTER the `defLaneConvergence` block.
 *   • THE FROZEN CONSTANTS — `MARK_SAG_BALL_SPEED = 16` traced to the engine's own
 *     pass flight-time line in `mechanics.ts`, `MARK_SAG_MAX = 9` traced to the zonal
 *     engagement radius in `TeamBrain.ts`; both asserted against the source text so
 *     the families cannot drift silently.
 *   • THE `sagOf` SHAPE — 0 at slack ≤ 0, monotone in positive slack, hard-capped.
 *   • THE #200 RED LINE — the seam only ever ADDS stance distance; it can never
 *     tighten, and there is no decline/release predicate anywhere.
 *   • THE CONSUMPTION FLAG `mtMarkSag` — explicit `?? false`, never bundle-defaulted,
 *     absent from a4World; assignment (`TeamBrain.ts`) never names the seam.
 * Road B: gene absent ⇒ weight 0 ⇒ byte-identical world (the 2-season fingerprint pin
 * is deliberately NOT duplicated here — PM-T0 Deviation 2's load lesson; G-IDENT /
 * G-FP recompute it in the probe, and `a4HomePriorGene.test.ts` already asserts it).
 */

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, arm?: boolean, dose?: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    edsPerceivedDefence: true, edsPerceivedChoice: true,
    ...(arm === undefined ? {} : { mtMarkSag: arm }),
  });
  if (dose !== undefined) {
    for (const t of m.teams) {
      (t.info.genome as TacticalGenome).markSag = dose;
      (t.baseGenome as TacticalGenome).markSag = dose;
      (t.effGenome as TacticalGenome).markSag = dose;
    }
  }
  return m;
};
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const run = (m: Match): string => {
  while (!m.finished) m.step(DT);
  return signature(m);
};
const V = (x: number, y: number): { x: number; y: number } => ({ x, y });

describe('MT-T0 — the markSag gene is BORN ABSENT and outside the RNG stream', () => {
  it('is not a GENE_KEY, so randomGenome never creates it', () => {
    expect((GENE_KEYS as readonly string[]).includes('markSag')).toBe(false);
    expect(randomGenome(new Rng(7)).markSag).toBeUndefined();
    // and an absent optional key is omitted by JSON.stringify ⇒ the serialized
    // genome (hence the production fingerprint) is byte-identical
    expect(JSON.stringify(randomGenome(new Rng(7)))).not.toContain('markSag');
  });

  it('mutateGenome with the opt-in OFF draws ZERO extra rng and leaves the gene absent', () => {
    const headMutate = (g: TacticalGenome, rng: Rng, rate: number, scale: number): TacticalGenome => {
      const out = { ...g };
      for (const k of GENE_KEYS) if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
      return out;
    };
    const rngA = new Rng(4242);
    const rngH = new Rng(4242);
    let a = randomGenome(new Rng(9));
    let h: TacticalGenome = { ...a };
    for (let i = 0; i < 8; i++) {
      a = mutateGenome(a, rngA, { rate: 0.45, scale: 0.14 });
      h = headMutate(h, rngH, 0.45, 0.14);
    }
    expect(GENE_KEYS.every((k) => a[k] === h[k])).toBe(true);
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(a.markSag).toBeUndefined();
  });

  it('the opt-in is LIVE (the zero is about the flag, not about dead code)', () => {
    const rng = new Rng(4242);
    let g = randomGenome(new Rng(9));
    for (let i = 0; i < 8; i++) g = mutateGenome(g, rng, { rate: 1, scale: 0.14, evolveMarkSag: true });
    expect(g.markSag).toBeDefined();
    expect(g.markSag!).toBeGreaterThanOrEqual(0);
    expect(g.markSag!).toBeLessThanOrEqual(1);
  });

  it('the new draws sit STRICTLY AFTER the defLaneConvergence block — PM-T0 unmoved', () => {
    // ARMS: the shipped mutate with the PM opt-in ON vs a re-implementation carrying
    // GENE_KEYS + the defLaneConvergence draw and NOTHING else. If the markSag draw
    // had been inserted anywhere earlier, the PM run's stream would have re-ordered.
    const rngA = new Rng(707707);
    const rngH = new Rng(707707);
    let a = randomGenome(new Rng(33));
    let h: TacticalGenome = { ...a };
    for (let i = 0; i < 8; i++) {
      a = mutateGenome(a, rngA, { rate: 0.45, scale: 0.14, evolveDefLaneConvergence: true });
      const out = { ...h };
      for (const k of GENE_KEYS) if (rngH.chance(0.45)) out[k] = clamp01(out[k] + rngH.gaussian() * 0.14);
      if (rngH.chance(0.45)) {
        out.defLaneConvergence = clamp01((out.defLaneConvergence ?? 0) + rngH.gaussian() * 0.14);
      }
      h = out;
    }
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(a.defLaneConvergence).toBe(h.defLaneConvergence);
    expect(a.markSag).toBeUndefined();
  });

  it('crossoverGenomes draws only under its own opt-in; flag-off carries parent A', () => {
    const a = randomGenome(new Rng(1));
    const b = randomGenome(new Rng(2));
    const rOff = new Rng(55);
    const rOn = new Rng(55);
    const off = crossoverGenomes(a, b, rOff);
    expect(off.markSag).toBeUndefined();
    const on = crossoverGenomes(
      { ...a, markSag: 0.9 }, { ...b, markSag: 0.1 }, rOn, false, false, false, true,
    );
    expect(on.markSag).toBeDefined();
    // flag-off with a carrier parent A: value carried through with NO draw
    const rCarry = new Rng(55);
    const carried = crossoverGenomes({ ...a, markSag: 0.42 }, b, rCarry);
    expect(carried.markSag).toBe(0.42);
    expect((rCarry as unknown as { s: number }).s).toBe((rOff as unknown as { s: number }).s);
  });
});

describe('MT-T0 — the FROZEN constants are TRACED, matched verbatim against source', () => {
  it('MARK_SAG_BALL_SPEED = 16 is the engine\'s own pass flight-time constant', () => {
    expect(MARK_SAG_BALL_SPEED).toBe(16);
    expect(readFileSync('src/sim/mechanics.ts', 'utf8')).toContain(
      'const flight = dist(passer.pos, mate.pos) / (16 * powerMul);',
    );
  });

  it('MARK_SAG_MAX = 9 is the zonal engagement radius in assignMarks', () => {
    expect(MARK_SAG_MAX).toBe(9);
    expect(readFileSync('src/ai/TeamBrain.ts', 'utf8')).toContain(
      'if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;',
    );
  });

  it('t_self keeps the existing arrival-time form', () => {
    expect(readFileSync('src/ai/TeamBrain.ts', 'utf8')).toContain(
      'const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);',
    );
  });
});

describe('MT-T0 — sagOf: continuous tightness, never a switch (#200)', () => {
  it('is exactly 0 at zero/negative slack — the ball at the man prices tight marking', () => {
    // ball ON the man: t_ball = 0 ⇒ slack < 0 ⇒ no sag (the 29.1 contain stand-off
    // and every box delivery are untouched, with no carve-out and no predicate)
    expect(markSagMetres(V(0, 0), V(0, 0), V(3, 0), 7)).toBe(0);
    // a 16 m ball flight = 1 s; a marker 8 m away at 7 m/s needs 1.14 s ⇒ slack < 0
    expect(markSagMetres(V(16, 0), V(0, 0), V(8, 0), 7)).toBe(0);
  });

  it('grows with positive slack and is hard-capped at MARK_SAG_MAX', () => {
    // both below the ceiling (at v = 7, d = 2 the cap binds from ball distance ≈ 25 m)
    const near = markSagMetres(V(15, 0), V(0, 0), V(2, 0), 7);
    const far = markSagMetres(V(22, 0), V(0, 0), V(2, 0), 7);
    expect(near).toBeGreaterThan(0);
    expect(far).toBeGreaterThan(near);
    expect(markSagMetres(V(90, 0), V(0, 0), V(1, 0), 7)).toBe(MARK_SAG_MAX);
    // monotone across a whole sweep, and never above the ceiling
    let prev = -1;
    for (let d = 0; d <= 100; d += 5) {
      const s = markSagMetres(V(d, 0), V(0, 0), V(2, 0), 7);
      expect(s).toBeGreaterThanOrEqual(prev);
      expect(s).toBeLessThanOrEqual(MARK_SAG_MAX);
      prev = s;
    }
  });

  it('is NON-NEGATIVE everywhere — the seam can only ADD distance, never tighten', () => {
    // the Phase 30.5 floor / Phase 31.6 stand-off revert guarantee, at the term
    for (let bx = -60; bx <= 60; bx += 7) {
      for (let mx = -30; mx <= 30; mx += 6) {
        for (const v of [0.1, 4, 7, 9]) {
          const s = markSagMetres(V(bx, 3), V(0, 0), V(mx, -2), v);
          expect(s).toBeGreaterThanOrEqual(0);
          expect(s).toBeLessThanOrEqual(MARK_SAG_MAX);
        }
      }
    }
  });

  it('markSagWeight is 0 for an absent or non-finite gene, and clamps to [0,1]', () => {
    expect(markSagWeight({} as TacticalGenome)).toBe(0);
    expect(markSagWeight({ markSag: Number.NaN } as TacticalGenome)).toBe(0);
    expect(markSagWeight({ markSag: 0.4 } as TacticalGenome)).toBe(0.4);
    expect(markSagWeight({ markSag: 5 } as TacticalGenome)).toBe(1);
    expect(markSagWeight({ markSag: -2 } as TacticalGenome)).toBe(0);
  });
});

describe('MT-T0 — Road B: the flag is dormant and the seam is inert until dosed', () => {
  it('a fresh Match and a League match are both OFF; the default is an explicit `?? false`', () => {
    expect(matchOf(1).mtMarkSag).toBe(false);
    const l = new League({ seed: 20260808 });
    expect(l.createMatch(l.nextFixture()!).mtMarkSag).toBe(false);
    expect(readFileSync('src/sim/Match.ts', 'utf8'))
      .toContain('this.mtMarkSag = cfg.mtMarkSag ?? false;');
  });

  it('is never bundle-defaulted (only the explicit MT opt-in worlds) and absent from the assignment file', () => {
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    // #211.3 armed the seam into the two EXPLICITLY opt-in MT play-test worlds
    // (until then this asserted the name was absent entirely; the narrower claim
    // is the one that matters): the A4 CENSUS substrate is not widened, so every
    // non-opt-in path — and every A4 world — stays sag-free.
    const censusBlock = /export const A4_WORLD_FLAGS = \{([\s\S]*?)\} as const;/.exec(a4)?.[1];
    expect(censusBlock).toBeDefined();
    expect(censusBlock).not.toContain('mtMarkSag');
    expect(a4MatchFlags(1).mtMarkSag).toBeUndefined();
    expect(a4MatchFlags(2).mtMarkSag).toBeUndefined();
    expect(a4MatchFlags(3).mtMarkSag).toBeUndefined();
    expect(a4MatchFlags(4).mtMarkSag).toBe(true); // the licensed arm sites
    expect(a4MatchFlags(5).mtMarkSag).toBe(true);
    // the 甲/乙 boundary: assignMarks / team.marks live here and never name the seam
    expect(readFileSync('src/ai/TeamBrain.ts', 'utf8')).not.toContain('markSag');
  });

  it('flag ABSENT ≡ flag FALSE, and ARMED with the gene ABSENT ≡ OFF', () => {
    const absent = run(matchOf(12_312_900));
    expect(run(matchOf(12_312_900, false))).toBe(absent);
    // the arms DIFFER in code path: armed ⇒ the M-MT.2 branch is entered on every
    // out-of-possession marker tick and the weight evaluates to 0
    expect(run(matchOf(12_312_900, true))).toBe(absent);
  });

  it('BITES when dosed — the identity above is not the identity of dead code', () => {
    expect(run(matchOf(12_312_901, true, 1))).not.toBe(run(matchOf(12_312_901)));
  });
});
