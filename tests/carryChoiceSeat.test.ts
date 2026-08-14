import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { CONTROL_RADIUS, DT } from '../src/sim/constants';
import {
  carryChoiceSeatOf, knockAnchor, knockCandidates, knockCompassSteps,
} from '../src/ai/carryChoiceSeat';
import { touchPastPushFor } from '../src/sim/mechanics';
import {
  cbCarryPronenessOf, crossoverGenomes, mutateGenome, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { League } from '../src/sim/League';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * CB-T2 (docs/world-model/CB-T2-CHOICE-SEAT.md; contract CB-CARRY-BEAT-CONTRACT.md §2 M-CB.2;
 * ruling #268.4) — THE LAYER-2 CHOICE SEAT. The pins:
 *   • ⭐⭐ ONE TABLE — the knock is priced by the pass table's own pricer; this file pins the
 *     CANDIDATES the seat hands it (their aims, their pushes) and the arming that follows.
 *   • ⭐⭐ THE COMPASS IS DERIVED — resolution from `CONTROL_RADIUS` at the knock's own roll,
 *     anchored on the incumbent push's own bearing, and it spans the WHOLE circle (the back
 *     half CB-C0 proved unreachable is reachable here).
 *   • ⭐⭐ ONE OWNER FOR THE PUSH LAW — the seat prices a line with `touchPastPushFor`, the very
 *     function `performTouchPast` executes with.
 *   • ⭐⭐ BORN ABSENT, AND THE NEUTRAL FORM IS DERIVED — absent ⇒ no seat at all; present at 0
 *     ⇒ the seat forms, prices its whole compass, and the world is byte-identical anyway.
 *   • ⭐ ROAD B — the flag is hard-false everywhere, and a chosen knock still needs CB-T0's
 *     `cbTouchPast` door to fire.
 */

const team = (name: string, seed: number, proneness?: number): TeamInfo => {
  const rng = new Rng(seed);
  const genome = randomGenome(rng) as TacticalGenome;
  if (proneness !== undefined) genome.cbCarryProneness = proneness;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome, squad: randomSquad(rng),
  };
};
const SEED_A = 12_474_900;
const SEED_B = 12_474_901;
const SEED_C = 12_474_902;

interface Arm {
  seat?: 'absent' | boolean;
  touch?: boolean;
  proneness?: number;
  armedSubstrate?: boolean;
}
const matchOf = (seed: number, a: Arm = {}): Match => new Match({
  seed,
  teamA: team('A', seed * 2 + 1, a.proneness),
  teamB: team('B', seed * 2 + 2, a.proneness),
  ...(a.armedSubstrate === true ? a4MatchFlags(3) : {}),
  ...(a.seat === undefined || a.seat === 'absent' ? {} : { cbChoiceSeat: a.seat }),
  ...(a.touch === undefined ? {} : { cbTouchPast: a.touch }),
});
const signature = (m: Match): string => JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, stamina: p.stamina })),
});
const walk = (seed: number, a: Arm = {}): string => {
  const m = matchOf(seed, a);
  while (!m.finished) m.step(DT);
  return signature(m);
};
/** step a match until a live outfield carrier exists, then hand him back. */
const carrierOf = (m: Match): { p: NonNullable<Match['ball']['owner']>; m: Match } | null => {
  for (let i = 0; i < 20_000 && !m.finished; i++) {
    m.step(DT);
    const o = m.ball.owner;
    if (o !== null && o.role !== 'GK' && !o.sentOff && m.phase === 'playing') return { p: o, m };
  }
  return null;
};

describe('CB-T2 — the style gene is born absent, and its neutral form is derived', () => {
  it('an absent gene reads 0 and forms NO seat at all', () => {
    const g = randomGenome(new Rng(1)) as TacticalGenome;
    expect(g.cbCarryProneness).toBeUndefined();
    expect(cbCarryPronenessOf(g)).toBe(0);
    expect(carryChoiceSeatOf(g)).toBeNull();
  });

  it('a PRESENT gene forms the seat — even at zero (the identity is arithmetic, not absence)', () => {
    const g = randomGenome(new Rng(2)) as TacticalGenome;
    g.cbCarryProneness = 0;
    expect(carryChoiceSeatOf(g)).not.toBeNull();
    expect(carryChoiceSeatOf(g)?.proneness).toBe(0);
  });

  it('the appetite is clamped to [0,1] and degrades a malformed genome to zero', () => {
    const g = randomGenome(new Rng(3)) as TacticalGenome;
    g.cbCarryProneness = 4.2;
    expect(cbCarryPronenessOf(g)).toBe(1);
    g.cbCarryProneness = -3;
    expect(cbCarryPronenessOf(g)).toBe(0);
    g.cbCarryProneness = Number.NaN;
    expect(cbCarryPronenessOf(g)).toBe(0);
  });

  it('⭐ it draws NO rng and stays ABSENT without its own explicit opt-in', () => {
    const g = randomGenome(new Rng(7)) as TacticalGenome;
    const a = mutateGenome(g, new Rng(11), { rate: 1 });
    const b = mutateGenome(g, new Rng(11), { rate: 1, evolveCarryChoice: true });
    expect(a.cbCarryProneness).toBeUndefined();
    expect(b.cbCarryProneness).not.toBeUndefined();
    // every SHIPPED gene draws the identical stream in both — the opt-in's draws are last.
    for (const k of Object.keys(a) as (keyof TacticalGenome)[]) {
      if (k === 'cbCarryProneness') continue;
      expect(b[k]).toEqual(a[k]);
    }
  });

  it('⭐ crossover carries it through untouched without the opt-in, and blends with it', () => {
    const p1 = randomGenome(new Rng(21)) as TacticalGenome;
    const p2 = randomGenome(new Rng(22)) as TacticalGenome;
    expect(crossoverGenomes(p1, p2, new Rng(23)).cbCarryProneness).toBeUndefined();
    p1.cbCarryProneness = 0.8;
    p2.cbCarryProneness = 0.2;
    expect(crossoverGenomes(p1, p2, new Rng(23)).cbCarryProneness).toBe(0.8);
    const child = crossoverGenomes(p1, p2, new Rng(23), false, false, false, false,
      false, false, false, false, true);
    expect([0.8, 0.2, 0.5]).toContain(child.cbCarryProneness);
  });
});

describe('CB-T2 — the compass is derived, and it spans the whole circle', () => {
  it('step 0 IS the incumbent push\'s own bearing (travel, heading as the slow fallback)', () => {
    const found = carrierOf(matchOf(SEED_A, { seat: true, touch: true, proneness: 1 }));
    expect(found).not.toBeNull();
    const { p, m } = found!;
    const anchor = knockAnchor(p);
    const cands = knockCandidates(p, m.ball.pos, m.teams[1 - p.side].players);
    expect(cands[0].step).toBe(0);
    expect(cands[0].dir.x).toBeCloseTo(anchor.x, 12);
    expect(cands[0].dir.y).toBeCloseTo(anchor.y, 12);
  });

  it('⭐⭐ the BACK half of the compass is reachable (CB-C0\'s degenerate half)', () => {
    const found = carrierOf(matchOf(SEED_B, { seat: true, touch: true, proneness: 1 }));
    const { p, m } = found!;
    const cands = knockCandidates(p, m.ball.pos, m.teams[1 - p.side].players);
    expect(cands.some((c) => c.back)).toBe(true);
    expect(cands.filter((c) => c.back).length).toBeGreaterThan(cands.length / 3);
  });

  it('⭐ the resolution is CONTROL_RADIUS at the knock\'s own roll — never a chosen K', () => {
    const found = carrierOf(matchOf(SEED_C, { seat: true, touch: true, proneness: 1 }));
    const { p } = found!;
    const n = knockCompassSteps(p);
    expect(n).toBeGreaterThan(1);
    // the chord between adjacent AIMS, at the roll each of them implies, is of order the
    // control radius — the whole justification of the sampling.
    const step = (2 * Math.PI) / n;
    const cands = knockCandidates(p, { x: 0, y: 0 }, []);
    const chord = 2 * cands[0].rolled * Math.sin(step / 2);
    expect(chord).toBeLessThanOrEqual(CONTROL_RADIUS * 1.05);
  });

  it('⭐⭐ ONE OWNER: every candidate\'s push IS `touchPastPushFor` on its own line', () => {
    const found = carrierOf(matchOf(SEED_A, { seat: true, touch: true, proneness: 1 }));
    const { p, m } = found!;
    const opp = m.teams[1 - p.side].players;
    for (const c of knockCandidates(p, m.ball.pos, opp)) {
      expect(c.push).toBe(touchPastPushFor(p, c.dir, opp));
      expect(c.speed).toBeCloseTo(Math.hypot(p.vel.x, p.vel.y) + Math.max(c.push, 0.8), 12);
    }
  });

  it('the candidates are pure — the same body twice gives the same compass', () => {
    const found = carrierOf(matchOf(SEED_B, { seat: true, touch: true, proneness: 1 }));
    const { p, m } = found!;
    const opp = m.teams[1 - p.side].players;
    expect(JSON.stringify(knockCandidates(p, m.ball.pos, opp)))
      .toBe(JSON.stringify(knockCandidates(p, m.ball.pos, opp)));
  });
});

describe('CB-T2 — the door is dormant (Road B)', () => {
  it('the flag defaults to false on a fresh Match, in both world shapes', () => {
    expect(matchOf(SEED_A).cbChoiceSeat).toBe(false);
    expect(matchOf(SEED_A, { armedSubstrate: true }).cbChoiceSeat).toBe(false);
  });

  it('⭐ the flag ABSENT ≡ the flag FALSE, whole run, both shapes', () => {
    for (const seed of [SEED_A, SEED_B]) {
      for (const armedSubstrate of [false, true]) {
        expect(walk(seed, { armedSubstrate })).toBe(walk(seed, { seat: false, armedSubstrate }));
      }
    }
  });

  it('⭐⭐ the door armed with the gene ABSENT is byte-identical — no seat is ever formed', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      expect(walk(seed, { seat: true, touch: true })).toBe(walk(seed, {}));
    }
    const m = matchOf(SEED_A, { seat: true, touch: true });
    while (!m.finished) m.step(DT);
    for (const v of Object.values(m.cbChoiceLedger)) expect(v).toBe(0);
  });

  it('⭐⭐ THE DERIVED NEUTRAL FORM: the gene PRESENT AT ZERO prices its whole compass and the world is STILL byte-identical', () => {
    for (const seed of [SEED_A, SEED_B]) {
      expect(walk(seed, { seat: true, touch: true, proneness: 0 })).toBe(walk(seed, {}));
    }
    const m = matchOf(SEED_A, { seat: true, touch: true, proneness: 0 });
    while (!m.finished) m.step(DT);
    expect(m.cbChoiceLedger.seats).toBeGreaterThan(0);
    expect(m.cbChoiceLedger.candidates).toBeGreaterThan(0);
    expect(m.cbChoiceLedger.chosen).toBe(0);
    expect(m.cbLedger.touchPasts).toBe(0);
  });

  it('⭐ the seat BITES at full appetite — and its knocks really fire', () => {
    const m = matchOf(SEED_A, { seat: true, touch: true, proneness: 1 });
    while (!m.finished) m.step(DT);
    expect(m.cbChoiceLedger.chosen).toBeGreaterThan(0);
    expect(m.cbLedger.touchPasts).toBeGreaterThan(0);
  });

  it('⭐⭐ a CHOSEN knock without CB-T0\'s touch door NEVER fires (the checklist\'s two locks)', () => {
    const m = matchOf(SEED_A, { seat: true, touch: false, proneness: 1 });
    while (!m.finished) m.step(DT);
    expect(m.cbChoiceLedger.chosen).toBeGreaterThan(0);
    expect(m.cbLedger.touchPasts).toBe(0);
  });

  it('the arming is withdrawn by the same body\'s own next decision — no stale aim', () => {
    const m = matchOf(SEED_A, { seat: true, touch: false, proneness: 1 });
    while (!m.finished) m.step(DT);
    expect(m.cbChoiceLedger.armingsCleared).toBeGreaterThan(0);
    expect(m.forcedTouchPast === null || m.forcedTouchPast.gid >= 0).toBe(true);
  });

  it('no League arms the door by default, and the key is an explicit opt-in', () => {
    const lg = new League({ seed: 12_474_903 });
    expect(lg.matchFlags.cbChoiceSeat).toBeUndefined();
    lg.matchFlags.cbChoiceSeat = true;
    expect(lg.matchFlags.cbChoiceSeat).toBe(true);
  });
});
