import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { applyMentality, applyUnderdogShift, mentalityOf, NEUTRAL_MENTALITY } from '../src/ai/mentality';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DT, HALF_L } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 35 — game-state tactics. The mentality layer is a PURE function of
 * (score diff, display minute, raw genes) served through the Team.genome
 * getter — never gene mutation. 0:1 at 85' must play differently from
 * 0:0 at 5', and the neutral state must be BIT-identical to before.
 */

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const genome = (over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return { ...g, ...over };
};
const team = (name: string, g: TacticalGenome = genome()): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: g,
  squad: Array.from({ length: TEAM_SIZE }, () => attrs()),
});

describe('the mentality curve (pure)', () => {
  it('level scores and early clocks are NEUTRAL — the identity object', () => {
    expect(mentalityOf(0, 85)).toBe(NEUTRAL_MENTALITY);
    expect(mentalityOf(-1, 45)).toBe(NEUTRAL_MENTALITY);
    expect(mentalityOf(-1, 68)).toBe(NEUTRAL_MENTALITY);
    expect(mentalityOf(1, 72)).toBe(NEUTRAL_MENTALITY);
  });

  it('the chase ramps with the clock and softens with a hopeless deficit', () => {
    expect(mentalityOf(-1, 88).urgency).toBe(1);
    expect(mentalityOf(-1, 76).urgency).toBeCloseTo(0.4, 5);
    expect(mentalityOf(-2, 88).urgency).toBeCloseTo(0.85, 5);
    expect(mentalityOf(-3, 90).urgency).toBeCloseTo(0.5, 5);
    expect(mentalityOf(-1, 88).holding).toBe(0);
  });

  it('the shut-down mirrors: full for one-goal leads, cruise for three', () => {
    expect(mentalityOf(1, 90).holding).toBe(1);
    expect(mentalityOf(2, 90).holding).toBeCloseTo(0.6, 5);
    expect(mentalityOf(3, 90).holding).toBeCloseTo(0.25, 5);
    expect(mentalityOf(1, 90).urgency).toBe(0);
  });
});

describe('applying the mentality to the gene read', () => {
  it('neutral returns the SAME object — the bit-identity discipline', () => {
    const raw = genome();
    expect(applyMentality(raw, NEUTRAL_MENTALITY)).toBe(raw);
    expect(applyMentality(raw, { urgency: 0, holding: 0 })).toBe(raw);
  });

  it('the chase floats risk/tempo/press/depth up, clamped, raw untouched', () => {
    const raw = genome({ riskTolerance: 0.9 });
    const eff = applyMentality(raw, { urgency: 1, holding: 0 });
    expect(eff).not.toBe(raw);
    expect(eff.riskTolerance).toBeGreaterThan(raw.riskTolerance);
    expect(eff.tempo).toBeGreaterThan(raw.tempo);
    expect(eff.pressIntensity).toBeGreaterThan(raw.pressIntensity);
    expect(eff.formationDepth).toBeGreaterThan(raw.formationDepth);
    for (const k of GENE_KEYS) {
      expect(eff[k]).toBeGreaterThanOrEqual(0);
      expect(eff[k]).toBeLessThanOrEqual(1);
    }
    expect(raw.riskTolerance).toBe(0.9); // pure — never mutates the input
    // The chase shoots on sight and stretches the block wide (probed:
    // risk/press/depth alone LOWERED the trailing side's shot share).
    expect(eff.shootBias).toBeGreaterThan(raw.shootBias);
    expect(eff.attackingWidth).toBeGreaterThan(raw.attackingWidth);
    // The untouched genes pass through exactly.
    expect(eff.passBias).toBe(raw.passBias);
    expect(eff.markingAggression).toBe(raw.markingAggression);
    expect(eff.counterAttackBias).toBe(raw.counterAttackBias);
  });

  it('identities chase DIFFERENTLY: the chaos side 梭哈 harder', () => {
    // Mid-curve values — at full urgency the ceiling clamp flattens the
    // high-risk side's delta, which is itself correct (genes saturate).
    const m = { urgency: 0.5, holding: 0 };
    const chaos = applyMentality(genome({ riskTolerance: 0.6 }), m);
    const careful = applyMentality(genome({ riskTolerance: 0.2 }), m);
    expect(chaos.riskTolerance - 0.6).toBeGreaterThan(careful.riskTolerance - 0.2);
  });

  it('a press identity keeps hunting even when it holds a lead', () => {
    const m = { urgency: 0, holding: 1 };
    const press = applyMentality(genome({ pressIntensity: 0.9 }), m);
    const passive = applyMentality(genome({ pressIntensity: 0.4 }), m);
    expect(0.9 - press.pressIntensity).toBeLessThan(0.4 - passive.pressIntensity);
    expect(press.tempo).toBeLessThan(0.5); // but everyone slows the game down
  });
});

/** A live match fast-forwarded naturally into the 89th minute, then forced
 * to a one-goal game — no private clock fields touched. */
function lateMatch(seed = 3): Match {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  while (m.phase !== 'playing') m.step(DT);
  while (!m.finished && !(m.half === 2 && m.minute() >= 89)) m.step(DT);
  m.score = [0, 1];
  return m;
}

describe('the mentality reaches the match (integration)', () => {
  it('the trailing side reads chase genes, the leader reads shut-down genes', () => {
    const m = lateMatch();
    for (let t = 0; t < 30; t++) m.step(DT); // past a team-brain tick
    const trailing = m.teams[0];
    const leading = m.teams[1];
    expect(trailing.mentality.urgency).toBeGreaterThan(0.9);
    expect(trailing.genome.riskTolerance).toBeGreaterThan(trailing.info.genome.riskTolerance);
    expect(leading.mentality.holding).toBeGreaterThan(0.9);
    expect(leading.genome.tempo).toBeLessThan(leading.info.genome.tempo);
    // The raw identity is untouched — evolution never sees the modifier.
    expect(trailing.info.genome.riskTolerance).toBe(0.5);
  });

  it('门将上前: a stoppage-time corner licenses the trailing keeper into the attack', () => {
    const m = lateMatch();
    for (let t = 0; t < 30; t++) m.step(DT);
    const trailing = m.teams[0];
    const gk = trailing.goalkeeper;
    // Hand the trailing side a corner in the dying minutes.
    m.phase = 'restart';
    m.restart = { kind: 'corner', side: 0, pos: v2(HALF_L - 0.6, 14), timer: 0, takerGid: trailing.players[3].gid };
    m.ball.owner = null;
    m.ball.pos = v2(HALF_L - 0.6, 14);
    m.ball.vel = v2(0, 0);
    let up = false;
    // The taker waits for the sprinting keeper (up to 8.5s) + the flight.
    // From a cold start at his own line the license carries him across
    // HALFWAY before the delivery resolves — in real play the chase
    // positioning has already parked him near midfield when it's awarded.
    for (let t = 0; t < 60 * 14 && !m.finished; t++) {
      m.step(DT);
      if (trailing.keeperUp && trailing.localX(gk.pos.x) > 0) up = true;
      if (up) break;
    }
    expect(up).toBe(true);
    // The license announces itself once.
    expect(m.events.some((e) => e.text.includes('UP for the corner'))).toBe(true);
    // When the moment dies, the license is torn up within a brain tick.
    for (let t = 0; t < 60 * 8 && trailing.keeperUp && !m.finished; t++) m.step(DT);
    if (!m.finished) expect(trailing.keeperUp).toBe(false);
  });

  it('a LEVEL late game stays bit-neutral: the gene view is the raw object', () => {
    const m = lateMatch();
    m.score = [1, 1];
    for (let t = 0; t < 30; t++) m.step(DT);
    expect(m.teams[0].genome).toBe(m.teams[0].info.genome);
    expect(m.teams[1].genome).toBe(m.teams[1].info.genome);
  });
});

describe('the underdog shift (Phase 64 — opponent-conditional tactics)', () => {
  it('pure: identity at zero, the bus vector at one, everything clamped', () => {
    const raw = genome({ formationDepth: 0.2, pressIntensity: 0.1 });
    expect(applyUnderdogShift(raw, 0)).toBe(raw); // the purist reads his own genes
    const shifted = applyUnderdogShift(raw, 1);
    expect(shifted.defensiveCompactness).toBeGreaterThan(raw.defensiveCompactness);
    expect(shifted.formationDepth).toBeLessThan(raw.formationDepth);
    expect(shifted.pressIntensity).toBeGreaterThanOrEqual(0); // clamped
    expect(shifted.counterAttackBias).toBeGreaterThan(raw.counterAttackBias);
    expect(shifted.riskTolerance).toBeLessThan(raw.riskTolerance);
    // Untouched genes pass through.
    expect(shifted.passBias).toBe(raw.passBias);
    expect(shifted.underdogShift).toBe(raw.underdogShift);
  });

  it('match integration: the outgunned pragmatist bends at kickoff, the favorite never does', () => {
    const weak = { ...team('W', genome({ underdogShift: 1 })), elo: 1350 };
    const strong = { ...team('S', genome({ underdogShift: 1 })), elo: 1650 };
    const m = new Match({ seed: 5, teamA: weak, teamB: strong });
    const w = m.teams[0];
    const s = m.teams[1];
    expect(w.baseGenome).not.toBe(w.info.genome);
    expect(w.baseGenome.defensiveCompactness).toBeCloseTo(0.8, 10); // full factor × 0.3
    expect(w.baseGenome.formationDepth).toBeCloseTo(0.2, 10);
    expect(s.baseGenome).toBe(s.info.genome); // the favorite plays his football
    // The brains read the shifted view through the usual getter.
    for (let t = 0; t < 60; t++) m.step(DT);
    expect(w.genome.defensiveCompactness).toBeCloseTo(0.8, 10);
  });

  it('a purist (gene 0) and an Elo-less team sheet stay bit-identical', () => {
    const purist = { ...team('P', genome({ underdogShift: 0 })), elo: 1350 };
    const strong = { ...team('S', genome()), elo: 1650 };
    const m1 = new Match({ seed: 5, teamA: purist, teamB: strong });
    expect(m1.teams[0].baseGenome).toBe(m1.teams[0].info.genome);
    const m2 = new Match({ seed: 5, teamA: team('A', genome({ underdogShift: 1 })), teamB: team('B') });
    expect(m2.teams[0].baseGenome).toBe(m2.teams[0].info.genome); // no Elo, no shift
  });
});
