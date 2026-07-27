import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  CELL_FLOOR, EYE_LATTICE, faceWeights, priceApproaches, type ApproachTable,
} from '../src/ai/stationEye';

/**
 * Stage III P2 — the dormant eye's seam and its selection rule
 * (docs/world-model/STAGE3-P2-DORMANT-EYE.md §3.4 X3, §2.4, §2.5).
 *
 * Shut, the seam must be the shipped world. Open, the rule must be the rule
 * that was frozen — argmax over eligible candidates against the census's own
 * control arm, strict positivity, and the inverted arm taking the argmin.
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
const matchOf = (seed: number) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const cell = (score: number, concede: number, n = 400) => ({
  n, score, concede, value: score - concede,
});

describe('Stage III P2 — the eye is shut in production', () => {
  it('X3: the eye is null on a fresh Match and on a League fixture', () => {
    const m = matchOf(11);
    expect(m.stationEye).toBeNull();
    expect(m.stationEyeState.size).toBe(0);
    const league = new League({ seed: 20260728 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.stationEye).toBeNull();
    expect(live.stationEyeState.size).toBe(0);
  });

  it('X3: the eye is unreachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      expect((edsPreviewFlags(mode) as Record<string, unknown>).stationEye).toBeUndefined();
    }
  });

  it('X3: a shut eye plays the shipped world, tick for tick', () => {
    for (const seed of [4242, 90210, 20260728]) {
      const a = matchOf(seed);
      const b = matchOf(seed);
      while (!a.finished) a.step(DT);
      while (!b.finished) {
        b.stationEye = null;
        b.step(DT);
      }
      expect(signature(b)).toBe(signature(a));
    }
  });
});

describe('Stage III P2 — the selection rule is the frozen one', () => {
  const context = 'ours|middle|sparse';
  const table: ApproachTable = {
    [context]: {
      control: cell(0.20, 0.10),          // value 0.10
      r7a0: cell(0.24, 0.10),             // +0.04  <- the argmax
      r14a0: cell(0.22, 0.10),            // +0.02
      r7a180: cell(0.10, 0.20),           // −0.20  <- the argmin
      r21a0: cell(0.90, 0.00, CELL_FLOOR - 1), // huge, but UNDER-POWERED
    },
  };
  const genome = randomGenome(new Rng(5));

  it('deviates to the argmax among candidates that meet the 150 floor', () => {
    const out = priceApproaches(table, context, 'neutral', genome);
    expect(out.kind).toBe('deviate');
    if (out.kind !== 'deviate') return;
    expect(out.candidate.id).toBe('r7a0');
    expect(out.advantage).toBeCloseTo(0.5 * 0.04, 12);
  });

  it('an under-powered cell is not a price, however good it looks', () => {
    const out = priceApproaches(table, context, 'neutral', genome);
    expect(out.kind === 'deviate' && out.candidate.id).not.toBe('r21a0');
  });

  it('the inverted arm takes the argmin — the positive control must hurt', () => {
    const out = priceApproaches(table, context, 'inverted', genome);
    expect(out.kind).toBe('deviate');
    if (out.kind !== 'deviate') return;
    expect(out.candidate.id).toBe('r7a180');
    expect(out.advantage).toBeLessThan(0);
  });

  it('no candidate better than the control ⇒ the eye chooses the incumbent', () => {
    const worse: ApproachTable = {
      [context]: { control: cell(0.30, 0.05), r7a0: cell(0.10, 0.05), r14a0: cell(0.30, 0.05) },
    };
    const out = priceApproaches(worse, context, 'neutral', genome);
    expect(out.kind).toBe('tie'); // r14a0 ties exactly: strict positivity binds
  });

  it('an unpriced or all-under-powered context ⇒ no override', () => {
    expect(priceApproaches(table, 'theirs|theirThird|crowded', 'neutral', genome).kind)
      .toBe('noCell');
    const thin: ApproachTable = {
      [context]: { control: cell(0.2, 0.1), r7a0: cell(0.9, 0.0, 3) },
    };
    expect(priceApproaches(thin, context, 'neutral', genome).kind).toBe('noCell');
  });

  it('a neutral genome maps to exactly (0.5, 0.5) — the census own axis', () => {
    const neutral = { ...genome, tempo: 0.5, attackingWidth: 0.5, defensiveCompactness: 0.5, coverBias: 0.5 };
    const w = faceWeights('gene', neutral);
    expect(w.ws).toBeCloseTo(0.5, 12);
    expect(w.wc).toBeCloseTo(0.5, 12);
  });

  it('the lattice is P1R\'s 18 candidates, unchanged', () => {
    expect(EYE_LATTICE).toHaveLength(18);
    expect(EYE_LATTICE.map((c) => c.id)).toContain('r21a180');
    const forward = EYE_LATTICE.find((c) => c.id === 'r21a0')!;
    expect(forward.dx).toBeCloseTo(21, 9);
    expect(forward.dy).toBeCloseTo(0, 9);
  });
});
