import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT, HALF_L, HALF_W } from '../src/sim/constants';
import {
  CTB_DEPTH_BIAS_SPAN, SUPPORT_LAT_CAP_FRAC, SUPPORT_LAT_PULL, supportSpot,
} from '../src/ai/formations';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, crossoverGenomes, ctbSupportDepthWeight,
  ctbSupportWidthWeight, mutateGenome, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { clamp01 } from '../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * CTB-T0 (docs/world-model/CTB-T0-DORMANT-SEAM.md; contract
 * docs/world-model/CHECK-TO-BALL-CONTRACT.md §2 M-CTB.1–4, §3 CTB-T0; ruling #223)
 * — the DORMANT SUPPORT-PLANE seam (回撤接应的前后左右). The pins:
 *   • THE GENES `ctbSupportDepth` / `ctbSupportWidth` — optional, BORN ABSENT,
 *     deliberately NOT in GENE_KEYS (the #148.5 / #75 RNG-stream trap), evolving only
 *     under their OWN `evolveCtbSupportPlane` opt-in whose draws sit STRICTLY AFTER
 *     the `markSag` block.
 *   • THE TRACED SPANS — `CTB_DEPTH_BIAS_SPAN` DERIVED IN CODE from the incumbent
 *     lateral cap fraction (never a typed literal, the #202 form), and the two
 *     incumbent fan constants asserted against the source text so they cannot drift.
 *   • THE ZERO-POINT — genes absent OR at zero ⇒ `supportSpot` byte-identical to the
 *     unarmed call, i.e. the mode ternary really is ABSORBED, not approximated.
 *   • THE LAW — signed depth (level-with / BEHIND the ball expressible, the §0.3 code
 *     fact), one coherent width scale on both fan constants, never sign-inverting.
 *   • THE #200 RED LINE — the deformation is unconditional geometry: no predicate.
 *   • THE CONSUMPTION FLAG `ctbSupportPlane` — explicit `?? false`, never
 *     bundle-defaulted, ABSENT from a4World entirely; exactly ONE read fork in src/**.
 * Road B: flag hard-false ⇒ byte-identical world (the 2-season fingerprint pin is
 * deliberately NOT duplicated here — PM-T0 Deviation 2's load lesson; G-IDENT / G-FP
 * recompute it in the probe, and `a4HomePriorGene.test.ts` already asserts it).
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
const matchOf = (
  seed: number, arm?: boolean, dose?: { depth?: number; width?: number },
): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    edsPerceivedDefence: true, edsPerceivedChoice: true,
    ...(arm === undefined ? {} : { ctbSupportPlane: arm }),
  });
  if (dose !== undefined) {
    // THE ARMING CHECKLIST (#196.3-D6): all three genome views of BOTH teams.
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        if (dose.depth !== undefined) g.ctbSupportDepth = dose.depth;
        if (dose.width !== undefined) g.ctbSupportWidth = dose.width;
      }
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
/** A stepped fixture: a live match state to sample real `supportSpot` outputs on. */
const steppedFixture = (seed: number, ticks = 400): Match => {
  const m = matchOf(seed, true);
  for (let i = 0; i < ticks; i++) m.step(DT);
  return m;
};

describe('CTB-T0 — the support-plane genes are BORN ABSENT and outside the RNG stream', () => {
  it('neither gene is a GENE_KEY, so randomGenome never creates them', () => {
    expect((GENE_KEYS as readonly string[]).includes('ctbSupportDepth')).toBe(false);
    expect((GENE_KEYS as readonly string[]).includes('ctbSupportWidth')).toBe(false);
    const g = randomGenome(new Rng(7));
    expect(g.ctbSupportDepth).toBeUndefined();
    expect(g.ctbSupportWidth).toBeUndefined();
    // Absent optional keys are omitted by JSON.stringify — the serialized genome, and
    // therefore the production fingerprint, is byte-identical.
    expect(JSON.stringify(g)).not.toContain('ctbSupport');
  });

  it('mutation draws ZERO extra rng with the opt-in off, and the genes stay absent', () => {
    const rngA = new Rng(4242);
    const rngH = new Rng(4242);
    let a = randomGenome(new Rng(11));
    let h: TacticalGenome = { ...a };
    const headMutate = (g: TacticalGenome, rng: Rng): TacticalGenome => {
      const out = { ...g };
      for (const k of GENE_KEYS) if (rng.chance(0.45)) out[k] = clamp01(out[k] + rng.gaussian() * 0.14);
      return out;
    };
    for (let i = 0; i < 8; i++) {
      a = mutateGenome(a, rngA, { rate: 0.45, scale: 0.14 });
      h = headMutate(h, rngH);
    }
    expect(GENE_KEYS.every((k) => a[k] === h[k])).toBe(true);
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(a.ctbSupportDepth).toBeUndefined();
    expect(a.ctbSupportWidth).toBeUndefined();
  });

  it('crossover draws ZERO extra rng with the opt-in off, and carries parent A through', () => {
    const rngA = new Rng(9090);
    const rngH = new Rng(9090);
    const p0 = { ...randomGenome(new Rng(3)), ctbSupportDepth: -0.5, ctbSupportWidth: 0.25 };
    const p1 = { ...randomGenome(new Rng(4)), ctbSupportDepth: 0.9, ctbSupportWidth: -0.9 };
    const child = crossoverGenomes(p0, p1, rngA);
    const headChild = (() => {
      const out = {} as TacticalGenome;
      for (const k of GENE_KEYS) {
        const r = rngH.next();
        out[k] = r < 0.4 ? p0[k] : r < 0.8 ? p1[k] : (p0[k] + p1[k]) / 2;
      }
      return out;
    })();
    expect(GENE_KEYS.every((k) => child[k] === headChild[k])).toBe(true);
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(child.ctbSupportDepth).toBe(-0.5);
    expect(child.ctbSupportWidth).toBe(0.25);
  });

  it('the opt-in path is LIVE and its draws sit STRICTLY AFTER the markSag block', () => {
    // (a) live: with the opt-in on, both genes gain values.
    let g = randomGenome(new Rng(5));
    const rngOn = new Rng(777);
    for (let i = 0; i < 8; i++) {
      g = mutateGenome(g, rngOn, { rate: 1, scale: 0.14, evolveCtbSupportPlane: true });
    }
    expect(g.ctbSupportDepth).not.toBeUndefined();
    expect(g.ctbSupportWidth).not.toBeUndefined();
    // (b) ordering: a markSag-only run's stream and value are UNMOVED by the new
    // block's existence — the new draws happen strictly after it.
    const mkSagOnly = (rng: Rng): TacticalGenome => {
      let x = randomGenome(new Rng(5));
      for (let i = 0; i < 8; i++) {
        x = mutateGenome(x, rng, { rate: 1, scale: 0.14, evolveMarkSag: true });
      }
      return x;
    };
    const r1 = new Rng(777);
    const sagOnly = mkSagOnly(r1);
    // the same seed, both opt-ins on: markSag's own draw sequence comes FIRST, so its
    // first-generation value is identical up to the point the new block starts drawing.
    const r2 = new Rng(777);
    let both = randomGenome(new Rng(5));
    both = mutateGenome(both, r2, {
      rate: 1, scale: 0.14, evolveMarkSag: true, evolveCtbSupportPlane: true,
    });
    const r3 = new Rng(777);
    let sagFirstGen = randomGenome(new Rng(5));
    sagFirstGen = mutateGenome(sagFirstGen, r3, { rate: 1, scale: 0.14, evolveMarkSag: true });
    expect(both.markSag).toBe(sagFirstGen.markSag);
    expect(sagOnly.markSag).not.toBeUndefined();
  });

  it('the crossover opt-in is its own positional gate, off by default', () => {
    const p0 = { ...randomGenome(new Rng(3)), ctbSupportDepth: 0.2, ctbSupportWidth: 0.2 };
    const p1 = { ...randomGenome(new Rng(4)), ctbSupportDepth: -0.2, ctbSupportWidth: -0.2 };
    const off = crossoverGenomes(p0, p1, new Rng(1), false, false, false, false);
    const on = crossoverGenomes(p0, p1, new Rng(1), false, false, false, false, true);
    expect(off.ctbSupportDepth).toBe(0.2);
    // ON draws twice more, so at least the stream differs; the values stay in-domain.
    expect(on.ctbSupportDepth!).toBeGreaterThanOrEqual(CTB_GENE_MIN);
    expect(on.ctbSupportWidth!).toBeLessThanOrEqual(CTB_GENE_MAX);
  });
});

describe('CTB-T0 — the LAW: traced spans, signed axes, exact zero-point', () => {
  it('CTB_DEPTH_BIAS_SPAN is DERIVED from the incumbent cap fraction, not typed', () => {
    // The identity, not the number: the span IS the seat's own lateral cap fraction.
    expect(CTB_DEPTH_BIAS_SPAN).toBe(SUPPORT_LAT_CAP_FRAC);
    expect(SUPPORT_LAT_CAP_FRAC).toBe(0.9);
    expect(SUPPORT_LAT_PULL).toBe(0.75);
    const src = readFileSync('src/ai/formations.ts', 'utf8');
    // derived in code — the declaration must reference the constant, not a literal
    expect(src).toContain('export const CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC;');
    // and the two incumbent constants are still applied at the seam site
    expect(src).toContain('const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;');
    expect(src).toContain(
      'const latPull = clamp((lane.y - ball.pos.y) * SUPPORT_LAT_PULL * widthScale, -maxLat, maxLat);',
    );
  });

  it('the gene domain is SIGNED and the weight maps clamp to it', () => {
    expect(CTB_GENE_MIN).toBe(-1);
    expect(CTB_GENE_MAX).toBe(1);
    expect(ctbSupportDepthWeight({} as TacticalGenome)).toBe(0);
    expect(ctbSupportWidthWeight({} as TacticalGenome)).toBe(0);
    expect(ctbSupportDepthWeight({ ctbSupportDepth: -5 } as TacticalGenome)).toBe(-1);
    expect(ctbSupportWidthWeight({ ctbSupportWidth: 5 } as TacticalGenome)).toBe(1);
    expect(ctbSupportDepthWeight({ ctbSupportDepth: Number.NaN } as TacticalGenome)).toBe(0);
    expect(ctbSupportWidthWeight({ ctbSupportWidth: -0.4 } as TacticalGenome)).toBe(-0.4);
  });

  it('LEVEL WITH and BEHIND the ball are expressible — the §0.3 code fact answered', () => {
    // attacking bias 0.75 − span 0.9 = −0.15 < 0; otherwise 0.35 − 0.9 = −0.55 < 0.
    expect(0.75 - CTB_DEPTH_BIAS_SPAN).toBeLessThan(0);
    expect(0.35 - CTB_DEPTH_BIAS_SPAN).toBeLessThan(0);
  });

  it('ZERO-POINT: absent genes and zero genes both give the incumbent point exactly', () => {
    const m = steppedFixture(12_423_900);
    let compared = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff) continue;
        const incumbent = supportSpot(p, t, m.ball);
        // (a) armed, genes ABSENT
        expect(supportSpot(p, t, m.ball, true)).toEqual(incumbent);
        // (b) armed, genes AT ZERO
        for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
          g.ctbSupportDepth = 0;
          g.ctbSupportWidth = 0;
        }
        const zeroed = supportSpot(p, t, m.ball, true);
        expect(zeroed.x).toBe(incumbent.x);
        expect(zeroed.y).toBe(incumbent.y);
        for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
          delete g.ctbSupportDepth;
          delete g.ctbSupportWidth;
        }
        compared += 1;
      }
    }
    expect(compared).toBeGreaterThan(0);
  });

  it('the DEPTH axis moves x against attackDir by exactly the law, at every dose', () => {
    const m = steppedFixture(12_423_901);
    let checked = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff) continue;
        const base = supportSpot(p, t, m.ball);
        for (const dose of [-1, -0.5, 0.5, 1]) {
          for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
            g.ctbSupportDepth = dose;
          }
          const got = supportSpot(p, t, m.ball, true);
          const radius = 10 + t.genome.supportDistance * 8;
          const bias = t.mode === 'CounterAttack' || t.mode === 'Attack' ? 0.75 : 0.35;
          const predicted = Math.max(
            -HALF_L + 2,
            Math.min(HALF_L - 2, m.ball.pos.x + t.attackDir * radius * (bias + dose * CTB_DEPTH_BIAS_SPAN)),
          );
          expect(got.x).toBeCloseTo(predicted, 9);
          // sign: a NEGATIVE dose pulls the seat back toward our own goal
          if (dose < 0) expect((got.x - base.x) * t.attackDir).toBeLessThanOrEqual(0);
          else expect((got.x - base.x) * t.attackDir).toBeGreaterThanOrEqual(0);
          expect(got.y).toBe(base.y); // the depth axis touches y NOWHERE
          checked += 1;
        }
        for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
          delete g.ctbSupportDepth;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('the WIDTH axis scales the fan coherently, collapses to the ball lane at −1, never inverts', () => {
    const m = steppedFixture(12_423_901);
    let checked = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff) continue;
        const base = supportSpot(p, t, m.ball);
        const baseGap = base.y - m.ball.pos.y;
        for (const dose of [-1, -0.5, 0.5, 1]) {
          for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
            g.ctbSupportWidth = dose;
          }
          const got = supportSpot(p, t, m.ball, true);
          const gap = got.y - m.ball.pos.y;
          expect(got.x).toBe(base.x); // the width axis touches x NOWHERE
          // the fan collapses onto the ball's lane — up to the INCUMBENT touchline
          // clamp, which is not this slice's (a ball outside ±(HALF_W−2) has always
          // been clamped inward). Stated as the exact predicted y.
          if (dose === -1) {
            expect(got.y).toBe(Math.max(-HALF_W + 2, Math.min(HALF_W - 2, m.ball.pos.y)));
          }
          // never inverts: the deformed offset keeps the incumbent's sign (or is 0)
          expect(gap * baseGap).toBeGreaterThanOrEqual(0);
          if (dose > 0) expect(Math.abs(gap)).toBeGreaterThanOrEqual(Math.abs(baseGap) - 1e-9);
          else expect(Math.abs(gap)).toBeLessThanOrEqual(Math.abs(baseGap) + 1e-9);
          checked += 1;
        }
        for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
          delete g.ctbSupportWidth;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe('CTB-T0 — Road B hygiene, the single read fork, and the arming checklist', () => {
  it('the flag is an explicit hard false, and a fresh Match / League match is OFF', () => {
    expect(readFileSync('src/sim/Match.ts', 'utf8'))
      .toContain('this.ctbSupportPlane = cfg.ctbSupportPlane ?? false;');
    expect(new Match({
      seed: 1, teamA: team('A', 1), teamB: team('B', 2), duration: 60,
    }).ctbSupportPlane).toBe(false);
    const l = new League({ seed: 20_260_810 });
    expect(l.createMatch(l.nextFixture()!).ctbSupportPlane).toBe(false);
  });

  it('the flag and both genes are ABSENT from a4World.ts ENTIRELY, and from every bundle', () => {
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    expect(a4).not.toContain('ctbSupportPlane');
    expect(a4).not.toContain('ctbSupportDepth');
    expect(a4).not.toContain('ctbSupportWidth');
    for (const v of [1, 2, 3] as const) {
      expect(Object.keys(a4MatchFlags(v))).not.toContain('ctbSupportPlane');
    }
  });

  it('no env door: the seam is never env-armed nor EDS_BUNDLE_ARMED', () => {
    for (const f of ['src/sim/Match.ts', 'src/ai/formations.ts', 'src/ai/actionExecutor.ts',
      'src/evolution/genome.ts', 'src/sim/League.ts']) {
      const lines = readFileSync(f, 'utf8').split('\n')
        .filter((l) => /ctbSupport/.test(l));
      expect(lines.some((l) => /envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))).toBe(false);
    }
  });

  it('EXACTLY ONE read fork on the flag in src/**, and it is inside supportSpot', () => {
    const forms = readFileSync('src/ai/formations.ts', 'utf8');
    // the fork itself
    expect(forms).toContain('  if (ctbPlane) {');
    expect(forms.match(/if \(ctbPlane\)/g)!.length).toBe(1);
    // the flag reaches it through exactly one call site
    const exec = readFileSync('src/ai/actionExecutor.ts', 'utf8');
    expect(exec.match(/match\.ctbSupportPlane/g)!.length).toBe(1);
    expect(exec).toContain('target = supportSpot(p, team, ball, match.ctbSupportPlane);');
    // and `supportSpot` defaults the fork OFF for every other caller
    expect(forms).toContain(
      'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {',
    );
  });

  it('ARMING CHECKLIST: flag alone and gene alone are both inert; only BOTH bite', () => {
    const seed = 12_423_900;
    const off = run(matchOf(seed, false));
    expect(run(matchOf(seed, undefined))).toBe(off); // absent ≡ false
    expect(run(matchOf(seed, true))).toBe(off); // armed, genes absent
    expect(run(matchOf(seed, true, { depth: 0, width: 0 }))).toBe(off); // armed at zero
    expect(run(matchOf(seed, false, { depth: -1, width: -1 }))).toBe(off); // dosed, flag off
    expect(run(matchOf(seed, true, { depth: -1, width: -1 }))).not.toBe(off); // ARMED
  });
});
