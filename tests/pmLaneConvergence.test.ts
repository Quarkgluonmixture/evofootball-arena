import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { formationSpot } from '../src/ai/formations';
import {
  GENE_KEYS, PM_LANE_CONVERGENCE_MAX, crossoverGenomes, mutateGenome, pmLaneConvergenceK,
  randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { clamp01 } from '../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * PM-T0 (docs/world-model/PM-T0-DORMANT-SEAM.md; contract
 * docs/world-model/PHASE-MODULATION-CONTRACT.md §2 M-PM.1–5, §3 PM-T0; ruling
 * #195.2) — the DORMANT DEFENSIVE LANE-CONVERGENCE seam. The pins:
 *   • THE GENE `defLaneConvergence` — optional, BORN ABSENT, deliberately NOT in
 *     GENE_KEYS (the #148.5 / #75 RNG-stream trap), evolving only under its OWN
 *     `evolveDefLaneConvergence` opt-in whose draws sit AFTER both home-prior
 *     blocks.
 *   • THE FROZEN CEILING `PM_LANE_CONVERGENCE_MAX = 0.25` — traced to the LEGACY
 *     per-body convergence weight at formations.ts (`defensiveCompactness * 0.25`),
 *     asserted against the source text so the family cannot drift silently.
 *   • THE CONSUMPTION FLAG `pmLaneConvergence` — explicit `?? false`, never
 *     bundle-defaulted, absent from a4World.
 *   • THE M-PM.3 READ FORK (#35.3) — the modulated station reaches the two
 *     BODY-MOVEMENT reads ONLY; assignment/gate/clamp/restart/render reads keep the
 *     unmodulated station. The zonal zone-centre call signature (the 甲/乙 boundary)
 *     is pinned unmodulated even with the gene maxed and the flag armed.
 *   • THE M-PM.2 PHASE GATE — out of possession only; in-possession reads inert.
 * Road B: gene absent ⇒ k_PM = 0 ⇒ byte-identical world + the production
 * fingerprint 57b0bdab…c673 unchanged.
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
const matchOf = (seed: number, arm?: boolean): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true,
  ...(arm === undefined ? {} : { pmLaneConvergence: arm }),
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
/** The instrument dose: write the gene on all three genome views (the a4World idiom). */
const dose = (m: Match, v: number): Match => {
  for (const t of m.teams) {
    (t.info.genome as TacticalGenome).defLaneConvergence = v;
    (t.baseGenome as TacticalGenome).defLaneConvergence = v;
    (t.effGenome as TacticalGenome).defLaneConvergence = v;
  }
  return m;
};

const SRC = {
  formations: readFileSync('src/ai/formations.ts', 'utf8'),
  executor: readFileSync('src/ai/actionExecutor.ts', 'utf8'),
  teamBrain: readFileSync('src/ai/TeamBrain.ts', 'utf8'),
  a4World: readFileSync('src/game/a4World.ts', 'utf8'),
  match: readFileSync('src/sim/Match.ts', 'utf8'),
};

// ===========================================================================
describe('PM-T0 — the gene is BORN ABSENT and outside GENE_KEYS', () => {
  it('randomGenome produces no defLaneConvergence key, and GENE_KEYS never names it', () => {
    expect(GENE_KEYS as readonly string[]).not.toContain('defLaneConvergence');
    for (const s of [1, 2, 3, 99]) {
      expect(randomGenome(new Rng(s)).defLaneConvergence).toBeUndefined();
    }
  });

  it('an absent gene serializes away entirely (the fingerprint argument)', () => {
    const g = randomGenome(new Rng(4));
    expect(JSON.stringify(g)).not.toContain('defLaneConvergence');
  });

  it('k_PM is 0 when absent, scales linearly, and is clamped to the frozen ceiling', () => {
    const g = randomGenome(new Rng(5));
    expect(pmLaneConvergenceK(g)).toBe(0);
    expect(pmLaneConvergenceK({ ...g, defLaneConvergence: 0 })).toBe(0);
    expect(pmLaneConvergenceK({ ...g, defLaneConvergence: 1 })).toBe(PM_LANE_CONVERGENCE_MAX);
    expect(pmLaneConvergenceK({ ...g, defLaneConvergence: 0.5 }))
      .toBeCloseTo(PM_LANE_CONVERGENCE_MAX / 2, 12);
    // out-of-domain values cannot dose past the ceiling through this door
    expect(pmLaneConvergenceK({ ...g, defLaneConvergence: 5 })).toBe(PM_LANE_CONVERGENCE_MAX);
    expect(pmLaneConvergenceK({ ...g, defLaneConvergence: -3 })).toBe(0);
    expect(pmLaneConvergenceK({ ...g, defLaneConvergence: Number.NaN })).toBe(0);
  });

  it('THE FROZEN CEILING IS THE TRACED ONE: 0.25 is the legacy per-body convergence weight', () => {
    // formations.ts legacy (table-path) convergence toward the ball's lane — the
    // contract's named neighbour. If that line ever changes weight, this fails and
    // the ceiling must be re-argued rather than silently drifting.
    expect(SRC.formations).toContain(
      'if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;',
    );
    expect(PM_LANE_CONVERGENCE_MAX).toBe(0.25);
  });
});

// ===========================================================================
describe('PM-T0 — THE RNG-STREAM TRAP (#148.5 / #75): opt-in off draws ZERO extra', () => {
  // A faithful re-implementation of the pre-gene mutate/crossover (GENE_KEYS only).
  const headMutate = (g: TacticalGenome, rng: Rng, rate: number, scale: number): TacticalGenome => {
    const out = { ...g };
    for (const k of GENE_KEYS) if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
    return out;
  };
  const headCross = (a: TacticalGenome, b: TacticalGenome, rng: Rng): TacticalGenome => {
    const out = {} as TacticalGenome;
    for (const k of GENE_KEYS) { const r = rng.next(); out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2; }
    return out;
  };

  it('mutate+crossover over 8 generations is byte-identical to the pre-gene sequence', () => {
    const rngA = new Rng(515151);
    const rngH = new Rng(515151);
    let a0 = randomGenome(new Rng(11)); let a1 = randomGenome(new Rng(22));
    let h0: TacticalGenome = { ...a0 }; let h1: TacticalGenome = { ...a1 };
    for (let gen = 0; gen < 8; gen++) {
      a0 = mutateGenome(a0, rngA, { rate: 0.45, scale: 0.14 });       // opt-in OFF
      a1 = mutateGenome(a1, rngA, { rate: 0.4, scale: 0.08 });
      h0 = headMutate(h0, rngH, 0.45, 0.14);
      h1 = headMutate(h1, rngH, 0.4, 0.08);
      a0 = mutateGenome(crossoverGenomes(a0, a1, rngA), rngA, { rate: 0.5, scale: 0.15 });
      h0 = headMutate(headCross(h0, h1, rngH), rngH, 0.5, 0.15);
    }
    for (const k of GENE_KEYS) { expect(a0[k]).toBe(h0[k]); expect(a1[k]).toBe(h1[k]); }
    expect(a0.defLaneConvergence).toBeUndefined();
    expect(a1.defLaneConvergence).toBeUndefined();
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
  });

  it('a HOME-PRIOR-only run is unmoved by the new gene (own boolean, not a widening)', () => {
    // Both opt-ins ON for the home-prior family, the lane gene's opt-in OFF: the
    // draw sequence must be exactly what a home-prior run drew before this gene.
    const run = (): { g: TacticalGenome; s: number } => {
      const rng = new Rng(626262);
      let g = randomGenome(new Rng(33));
      for (let i = 0; i < 6; i++) {
        g = mutateGenome(g, rng, {
          rate: 0.5, scale: 0.2, evolveHomePrior: true, evolveHomePriorOffsets: true,
        });
      }
      return { g, s: (rng as unknown as { s: number }).s };
    };
    const out = run();
    expect(out.g.defLaneConvergence).toBeUndefined();
    // and the lane gene's own block draws only when ITS boolean is true
    const rngOn = new Rng(626262);
    let gOn = randomGenome(new Rng(33));
    for (let i = 0; i < 6; i++) {
      gOn = mutateGenome(gOn, rngOn, {
        rate: 0.5, scale: 0.2, evolveHomePrior: true, evolveHomePriorOffsets: true,
        evolveDefLaneConvergence: true,
      });
    }
    expect((rngOn as unknown as { s: number }).s).not.toBe(out.s); // it really draws
    expect(gOn.defLaneConvergence).toBeDefined();
  });

  it('flag-on evolution DOES move the gene, in [0,1] (the capability is not dead code)', () => {
    const rng = new Rng(717171);
    let g = randomGenome(new Rng(5));
    let moved = false;
    for (let i = 0; i < 200; i++) {
      g = mutateGenome(g, rng, { rate: 0.9, scale: 0.3, evolveDefLaneConvergence: true });
      if (g.defLaneConvergence !== undefined && g.defLaneConvergence > 0) moved = true;
      if (g.defLaneConvergence !== undefined) {
        expect(g.defLaneConvergence).toBeGreaterThanOrEqual(0);
        expect(g.defLaneConvergence).toBeLessThanOrEqual(1);
      }
    }
    expect(moved).toBe(true);
    const child = crossoverGenomes(
      g, { ...g, defLaneConvergence: 0.9 }, new Rng(7), false, false, true,
    );
    expect(child.defLaneConvergence).toBeGreaterThanOrEqual(0);
    expect(child.defLaneConvergence).toBeLessThanOrEqual(1);
    // crossover with the opt-in OFF carries parent A through with NO draw
    const rngOff = new Rng(9);
    const before = (rngOff as unknown as { s: number }).s;
    const kid = crossoverGenomes(g, { ...g, defLaneConvergence: 0.9 }, rngOff);
    const afterKeys = (rngOff as unknown as { s: number }).s;
    expect(kid.defLaneConvergence).toBe(g.defLaneConvergence);
    expect(afterKeys).not.toBe(before); // GENE_KEYS drew; the extra block did not
  });
});

// ===========================================================================
describe('PM-T0 — FLAG HYGIENE (Road B: nothing ships)', () => {
  it('pmLaneConvergence is false on a fresh Match and on a League match', () => {
    expect(matchOf(11).pmLaneConvergence).toBe(false);
    const league = new League({ seed: 20260808 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.pmLaneConvergence).toBe(false);
  });

  it('it is initialised `?? false`, never env-armed, and absent from a4World', () => {
    expect(SRC.match).toContain('this.pmLaneConvergence = cfg.pmLaneConvergence ?? false;');
    expect(SRC.a4World).not.toContain('pmLaneConvergence');
    expect(SRC.a4World).not.toContain('defLaneConvergence');
    // no environment door anywhere in src
    expect(SRC.match).not.toContain('PM_LANE_CONVERGENCE=');
    expect(SRC.formations).not.toContain('process.env.PM');
  });
});

// ===========================================================================
describe('PM-T0 — THE M-PM.3 READ FORK (#35.3: fork the read, never the function)', () => {
  it('exactly TWO src call sites pass the mover fork, both in actionExecutor', () => {
    const sites = SRC.executor.match(/formationSpot\([^)]*pmMover\)/g) ?? [];
    expect(sites.length).toBe(2);
    // and no other src module even knows the fork exists
    expect(SRC.teamBrain).not.toContain('pmMover');
    expect(readFileSync('src/render3d/RenderStateAdapter.ts', 'utf8')).not.toContain('pmMover');
  });

  it('the fork DEFAULTS OFF: formationSpot with the arg omitted === explicit false', () => {
    const m = dose(matchOf(7, true), 1);
    for (let i = 0; i < 400; i++) m.step(DT);
    const t = m.teams[0];
    const opp = m.teams[1];
    for (const p of t.players) {
      for (const hb of [true, false]) {
        expect(formationSpot(p, t, m.ball, hb, opp, false))
          .toEqual(formationSpot(p, t, m.ball, hb, opp, false, false));
        expect(formationSpot(p, t, m.ball, hb, opp))
          .toEqual(formationSpot(p, t, m.ball, hb, opp, false, false));
      }
    }
  });

  it('THE 甲/乙 BOUNDARY: the zonal zone-centre read is UNMODULATED even at max dose', () => {
    // TeamBrain.ts assignMarks' call, verbatim in shape: (p, team, ball, false, opp).
    expect(SRC.teamBrain).toContain(
      'formationSpot(p, team, match.ball, false, match.teams[1 - team.side])',
    );
    const m = dose(matchOf(7, true), 1);
    for (let i = 0; i < 400; i++) m.step(DT);
    const t = m.teams[0];
    const opp = m.teams[1];
    let anyMoverDiff = false;
    for (const p of t.players) {
      const zoneCentre = formationSpot(p, t, m.ball, false, opp);
      const unmodulated = formationSpot(p, t, m.ball, false, opp, false, false);
      const mover = formationSpot(p, t, m.ball, false, opp, false, true);
      expect(zoneCentre).toEqual(unmodulated);
      if (Math.abs(mover.y - unmodulated.y) > 1e-9) anyMoverDiff = true;
    }
    expect(anyMoverDiff).toBe(true); // the boundary is meaningful: the mover DOES move
  });
});

// ===========================================================================
describe('PM-T0 — THE M-PM.2 PHASE GATE and the mechanism itself', () => {
  it('IN POSSESSION the mover fork is inert (out-of-possession only)', () => {
    const m = dose(matchOf(9, true), 1);
    for (let i = 0; i < 400; i++) m.step(DT);
    const t = m.teams[0];
    const opp = m.teams[1];
    for (const p of t.players) {
      expect(formationSpot(p, t, m.ball, true, opp, false, true))
        .toEqual(formationSpot(p, t, m.ball, true, opp, false, false));
    }
  });

  it('with the gene ABSENT the mover fork is a no-op (born-absent ⇒ k_PM = 0)', () => {
    const m = matchOf(9, true); // armed, NOT dosed
    for (let i = 0; i < 400; i++) m.step(DT);
    const t = m.teams[0];
    const opp = m.teams[1];
    for (const p of t.players) {
      for (const hb of [true, false]) {
        expect(formationSpot(p, t, m.ball, hb, opp, false, true))
          .toEqual(formationSpot(p, t, m.ball, hb, opp, false, false));
      }
    }
  });

  it('THE TERM is an order-preserving contraction toward the ball lane (closed form)', () => {
    // The property the MECHANISM delivers, asserted where it is true: on the term
    // itself, `y ↦ y + (b − y)·k` with k ∈ (0, 0.25]. It is affine with slope
    // (1 − k) > 0 ⇒ lateral ORDER is preserved and every gap strictly shrinks.
    const k = PM_LANE_CONVERGENCE_MAX;
    const b = 14; // a flank lane
    const ys = [-18, -9, -2, 0, 3, 11, 19];
    const out = ys.map((y) => y + (b - y) * k);
    for (let i = 0; i < ys.length; i++) {
      expect(Math.abs(out[i] - b)).toBeLessThan(Math.abs(ys[i] - b) + 1e-12);
      if (i > 0) expect(out[i]).toBeGreaterThan(out[i - 1]); // order preserved
    }
  });

  it('dosed, the LIVE station field moves toward the ball lane in aggregate', () => {
    // ⚠ STATED EXACTLY (the #194 lesson): per-body monotonicity is NOT a property
    // of the final station — anti-clump and solidity compose AFTER the term (that
    // is deliberate: they are the guards that price the contraction), so an
    // individual body already on the lane can end up marginally further out. What
    // the seam delivers, and what is pinned here, is that the ASK moves: the MEAN
    // lane gap over the outfield falls, sampled across the match.
    const m = dose(matchOf(13, true), 1);
    let sumBase = 0;
    let sumMoved = 0;
    let n = 0;
    let anyMoved = false;
    for (let i = 0; i < 1200 && !m.finished; i++) {
      m.step(DT);
      if (i % 20 !== 0) continue;
      for (const t of m.teams) {
        const opp = m.teams[1 - t.side];
        for (const p of t.players.filter((q) => q.role !== 'GK')) {
          const b0 = formationSpot(p, t, m.ball, false, opp, false, false);
          const b1 = formationSpot(p, t, m.ball, false, opp, false, true);
          sumBase += Math.abs(b0.y - m.ball.pos.y);
          sumMoved += Math.abs(b1.y - m.ball.pos.y);
          if (Math.abs(b1.y - b0.y) > 1e-6) anyMoved = true;
          n += 1;
        }
      }
    }
    expect(n).toBeGreaterThan(100);
    expect(anyMoved).toBe(true);
    expect(sumMoved / n).toBeLessThan(sumBase / n);
  });
});

// ===========================================================================
describe('PM-T0 — FLAG-OFF byte-identity (Road B / X-FP-PROD)', () => {
  // ⚠ NOTE: the 2-season production-fingerprint pin (57b0bdab…c673) is deliberately
  // NOT duplicated here. It already runs in `a4HomePriorGene.test.ts` and
  // `a4RestAbandon.test.ts` (so any regression fails the suite anyway) and it is
  // recomputed in-probe as G-IDENT/G-FP; a fourth 29 s copy pushed two long-running
  // suites past their wall-clock timeouts under vitest's parallelism. Recorded as a
  // deviation in the stage doc rather than silently dropped.

  it('flag ABSENT === flag FALSE === flag ARMED-with-the-gene-absent, whole match', () => {
    for (const seed of [7, 4242]) {
      const absent = runToEnd(matchOf(seed));
      expect(runToEnd(matchOf(seed, false))).toBe(absent);
      expect(runToEnd(matchOf(seed, true))).toBe(absent); // born-equivalence
    }
  });

  it('BITE: armed AND dosed, the world diverges (the identities are not of dead code)', () => {
    for (const seed of [7, 4242]) {
      const absent = runToEnd(matchOf(seed));
      expect(runToEnd(dose(matchOf(seed, true), 1))).not.toBe(absent);
      // dosed but NOT armed stays identical — the consumption flag really gates
      expect(runToEnd(dose(matchOf(seed, false), 1))).toBe(absent);
    }
  });
});
