import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import {
  DV_LEARN_WINDOW_S, DeliveryAccountBook, DeliveryLabelLedger,
} from '../src/ai/deliveryAccountBook';
import { DV_ZONES, deliveryValueSeatOf, receptionZoneIndex } from '../src/ai/deliveryValueSeat';
import { DV_BELIEF_SLOTS, GENE_KEYS, randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * DV-T2-T0 (docs/world-model/DV-T2-T0-LEARNING-SEAM.md; contract
 * docs/world-model/DV-T2-LEARNED-MAP-CONTRACT.md §2 M-DV2.1–.4; rulings #255.2 / #256.4)
 * — the DORMANT LEARNING SEAM (自己的账本). The pins:
 *   • ⭐ THE ACCOUNT BOOK (M-DV2.2) — per team, per AIM zone, deliveries × punished; the
 *     belief is the MARGINAL running frequency (#256.2's ratified quantity), zero-constant
 *     for a zone with no observation, and an EMPTY book serves NO belief at all so the
 *     gene stays BORN ABSENT through arming.
 *   • ⭐ THE LABEL (M-DV2.1) — the chain, the loss, the ONE-TO-ONE attribution inside the
 *     10 s window, and the rule that the label closes AFTER the window.
 *   • ⭐⭐ TWO DOORS — `dvLearnedMap` LEARNS, `dvDeliveryValue` CONSUMES. Armed to learn
 *     alone the books fill and the world is byte-identical, because nothing reads them.
 *   • ⭐⭐ NO LAMARCK — the learned belief never reaches a franchise genome (crossover
 *     would inherit it even with the opt-in shut), so it dies with the match; the BOOK is
 *     what carries, and it is wiped at the season boundary.
 *   • THE EPISTEMIC PIN — the book module's import list makes the wider world unreachable.
 * Road B: flag hard-false ⇒ byte-identical world (the 2-season fingerprint pin is
 * deliberately NOT duplicated here — the PM-T0 Deviation 2 load lesson; G-IDENT /
 * X-FP-PROD recompute it in the probe).
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
const SEED_A = 12_437_900;
const SEED_B = 12_437_901;
const SEED_C = 12_437_902;
const SEED_D = 12_437_903;

interface Arm {
  learn?: 'absent' | boolean;
  price?: boolean;
  books?: readonly [DeliveryAccountBook, DeliveryAccountBook];
}
const matchOf = (seed: number, a: Arm = {}): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  ...(a.learn === undefined || a.learn === 'absent' ? {} : { dvLearnedMap: a.learn }),
  ...(a.learn === true && a.books !== undefined ? { dvLearnedBooks: a.books } : {}),
  ...(a.price === true ? { dvDeliveryValue: true } : {}),
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const walk = (seed: number, a: Arm = {}): string => {
  const m = matchOf(seed, a);
  while (!m.finished) m.step(DT);
  return signature(m);
};
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFiles(p);
  return p.endsWith('.ts') ? [p] : [];
});
const countOf = (s: string, needle: string): number => s.split(needle).length - 1;
const bookSrc = readFileSync('src/ai/deliveryAccountBook.ts', 'utf8');
const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
const leagueSrc = readFileSync('src/sim/League.ts', 'utf8');
const brainSrc = readFileSync('src/ai/PlayerBrain.ts', 'utf8');

describe('DV-T2-T0 — the account book (M-DV2.2)', () => {
  it('an EMPTY book serves NO belief, so the gene stays born-absent', () => {
    const b = new DeliveryAccountBook();
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
    expect(deliveryValueSeatOf({} as TacticalGenome)).toBeNull();
  });

  it('the belief is the MARGINAL punished/deliveries, zero-constant on an unseen zone', () => {
    const b = new DeliveryAccountBook();
    for (let i = 0; i < 8; i++) b.note(0, i < 2); // own: 8 deliveries, 2 punished
    b.note(1, false); // middle: 1 delivery, 0 punished; final: never played
    const bel = b.beliefVector();
    expect(bel).not.toBeNull();
    expect(bel).toHaveLength(DV_BELIEF_SLOTS);
    expect(bel?.[0]).toBe(2 / 8);
    expect(bel?.[1]).toBe(0);
    expect(bel?.[2]).toBe(0); // ⭐ the zero constant, not an absence
    expect(b.total).toBe(9);
    expect(b.punished.every((k, z) => k <= b.deliveries[z])).toBe(true);
  });

  it('reset wipes the whole book and returns it to serving null (the season boundary)', () => {
    const b = new DeliveryAccountBook();
    b.note(2, true);
    expect(b.beliefVector()).not.toBeNull();
    b.reset();
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
    expect(b.deliveries).toEqual([0, 0, 0]);
    expect(b.punished).toEqual([0, 0, 0]);
  });

  it('the zone order is the shipped DV_ZONES order and the width is DV_BELIEF_SLOTS', () => {
    expect(DV_ZONES).toEqual(['own', 'middle', 'final']);
    expect(new DeliveryAccountBook().deliveries).toHaveLength(DV_BELIEF_SLOTS);
  });
});

describe('DV-T2-T0 — the label (M-DV2.1)', () => {
  const ledgerOf = (): { books: [DeliveryAccountBook, DeliveryAccountBook]; l: DeliveryLabelLedger } => {
    const books: [DeliveryAccountBook, DeliveryAccountBook] = [
      new DeliveryAccountBook(), new DeliveryAccountBook(),
    ];
    return { books, l: new DeliveryLabelLedger(books, () => undefined) };
  };

  it('the label CLOSES AFTER THE WINDOW — nothing is written before it runs out', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 0, 0);
    l.observeOwner(1, 1); // team 0 loses it at t = 1
    l.expire(1 + DV_LEARN_WINDOW_S); // exactly AT the horizon: still open
    expect(books[0].total).toBe(0);
    l.expire(1 + DV_LEARN_WINDOW_S + DT);
    expect(books[0].deliveries[0]).toBe(1);
    expect(books[0].punished[0]).toBe(0);
  });

  it('a LOSS followed by a concession inside the window is PUNISHED', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 1, 0);
    l.observeOwner(1, 2);
    l.observeConcession(0, 2 + DV_LEARN_WINDOW_S - 1);
    l.expire(100);
    expect(books[0].deliveries[1]).toBe(1);
    expect(books[0].punished[1]).toBe(1);
  });

  it('a concession OUTSIDE the window punishes nothing', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 2, 0);
    l.observeOwner(1, 2);
    l.observeConcession(0, 2 + DV_LEARN_WINDOW_S + 1);
    l.expire(100);
    expect(books[0].deliveries[2]).toBe(1);
    expect(books[0].punished[2]).toBe(0);
  });

  it('a chain that ends on a DEAD BALL is not a loss — it closes unpunished, at once', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 0, 0);
    l.observeDeadBall();
    expect(books[0].deliveries[0]).toBe(1);
    expect(books[0].punished[0]).toBe(0);
  });

  it('⭐ the attribution is ONE-TO-ONE: one concession punishes one loss, the LATEST', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 0, 0); // chain 1 (own third)
    l.observeOwner(1, 1);
    l.observeOwner(0, 2);
    l.noteDelivery(0, 2, 2); // chain 2 (final third)
    l.observeOwner(1, 3);
    l.observeConcession(0, 4); // ONE goal, two eligible losses
    l.expire(100);
    expect(books[0].punished[2]).toBe(1); // the LATEST loss took it
    expect(books[0].punished[0]).toBe(0); // the older one did not
  });

  it('⭐ the whole CHAIN shares one punishment (the label is chain-level)', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 0, 0);
    l.noteDelivery(0, 0, 0);
    l.noteDelivery(0, 1, 0);
    l.observeOwner(1, 1);
    l.observeConcession(0, 2);
    l.expire(100);
    expect(books[0].deliveries).toEqual([2, 1, 0]);
    expect(books[0].punished).toEqual([2, 1, 0]);
  });

  it('the whistle closes every still-open label with what it knows', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 1, 0);
    l.observeOwner(1, 1);
    expect(books[0].total).toBe(0);
    l.flush();
    expect(books[0].deliveries[1]).toBe(1);
    expect(books[0].punished[1]).toBe(0);
  });

  it('a delivery-less loss still competes for the concession (it just writes nothing)', () => {
    const { books, l } = ledgerOf();
    l.observeOwner(0, 0);
    l.noteDelivery(0, 0, 0);
    l.observeOwner(1, 1); // loss WITH a delivery, t=1
    l.observeOwner(0, 2);
    l.observeOwner(1, 3); // loss with NO delivery, t=3 — the LATEST
    l.observeConcession(0, 4);
    l.expire(100);
    expect(books[0].deliveries[0]).toBe(1);
    expect(books[0].punished[0]).toBe(0);
  });

  it('the window constant is 10 and the index is the SHIPPED classifier', () => {
    expect(DV_LEARN_WINDOW_S).toBe(10);
    expect(receptionZoneIndex(-1e9)).toBe(0);
    expect(receptionZoneIndex(0)).toBe(1);
    expect(receptionZoneIndex(1e9)).toBe(2);
  });
});

describe('DV-T2-T0 — the arming checklist and dormancy', () => {
  it('the flag is born FALSE on a fresh Match and on a League match', () => {
    const m = matchOf(SEED_A);
    expect(m.dvLearnedMap).toBe(false);
    expect(m.dvLearn).toBeNull();
    const lg = new League({ seed: 4242 });
    const f = lg.nextFixture();
    expect(f).toBeTruthy();
    const lm = lg.createMatch(f!);
    expect(lm.dvLearnedMap).toBe(false);
    expect(lm.dvLearn).toBeNull();
    expect(lg.deliveryBooks).toBeNull(); // an unarmed League allocates NOTHING
  });

  it('the init is the explicit hard-false form — no env door, no bundle door', () => {
    expect(matchSrc).toContain('this.dvLearnedMap = cfg.dvLearnedMap ?? false;');
    expect(matchSrc).not.toMatch(/dvLearnedMap\s*=\s*cfg\.dvLearnedMap\s*\?\?\s*EDS_BUNDLE_ARMED/);
    const seamLines = [...matchSrc.split('\n'), ...leagueSrc.split('\n'), ...bookSrc.split('\n')]
      .filter((l) => /dvLearnedMap|dvLearn\b|DeliveryAccountBook|DeliveryLabelLedger/.test(l));
    expect(seamLines.some((l) => /envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))).toBe(false);
  });

  it('⭐ absent from a4World entirely (Road B)', () => {
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    expect(a4).not.toContain('dvLearnedMap');
    expect(a4).not.toContain('DeliveryAccountBook');
    for (const v of [1, 2, 3] as const) {
      expect(JSON.stringify(a4MatchFlags(v))).not.toContain('dvLearnedMap');
    }
  });

  it('the seam adds NO gene: dvLossBelief is still outside GENE_KEYS', () => {
    expect((GENE_KEYS as readonly string[]).includes('dvLossBelief')).toBe(false);
    expect((GENE_KEYS as readonly string[]).some((k) => k.startsWith('dvLearn'))).toBe(false);
  });

  it('⭐ the READ-FORK INVENTORY holds', () => {
    expect(countOf(matchSrc, 'this.dvLearn = this.dvLearnedMap')).toBe(1);
    expect(countOf(leagueSrc, 'this.matchFlags?.dvLearnedMap === true')).toBe(1);
    expect(countOf(matchSrc, 'this.dvLearn !== null')).toBe(4);
    // the banked ZERO-NEW-STRIKE pins, re-asserted from this side
    expect(countOf(brainSrc, 'match.performPass(')).toBe(3);
    expect(countOf(matchSrc, 'mech.performPass(')).toBe(1);
    expect(countOf(brainSrc, 'const groundCandidate = (')).toBe(1);
  });

  it('⭐ G-EPI: the book module imports the belief WIDTH and nothing else', () => {
    const imports = bookSrc.split('\n').filter((l) => l.trim().startsWith('import '));
    expect(imports).toEqual(["import { DV_BELIEF_SLOTS } from '../evolution/genome';"]);
    const exec = bookSrc.split('\n').filter((l) => {
      const t = l.trim();
      return t.length > 0 && !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*')
        && !t.startsWith('*/');
    }).join('\n');
    for (const n of ['Match', 'match.', 'Player', 'Team', 'perceivedSnapshot', 'opp', 'rng',
      'attrs', '.pos', 'readFileSync', 'docs/', 'import(']) {
      expect(exec.includes(n)).toBe(false);
    }
  });

  it('⭐ G-NOTABLE: no committed census VALUE is reachable from src', () => {
    const src = srcFiles('src').map((f) => readFileSync(f, 'utf8')).join('\n');
    const t2c0 = JSON.parse(
      readFileSync('docs/world-model/data/dv-t2-c0-pass-level-census.json', 'utf8'),
    ) as { result: { census: { yardstick: { zones: Record<string, { punishRate: number }> } } } };
    const zones = t2c0.result.census.yardstick.zones;
    const needles = DV_ZONES.flatMap((z) => {
      const r = zones[z].punishRate;
      return [String(r), (r * 100).toFixed(3), r.toFixed(5)];
    });
    for (const n of needles) {
      expect(new RegExp(`(?<![\\d.])${n.replace(/\./g, '\\.')}(?![\\d])`).test(src)).toBe(false);
    }
    expect(src).not.toContain('dv-t2-c0-pass-level-census');
    expect(src).not.toContain('dv-c0-loss-cost');
    expect(src).toContain('DV_LEARN_WINDOW_S'); // the control needle: the search IS live
  });
});

describe('DV-T2-T0 — born-equivalence (learning OFF ⇒ byte-identical)', () => {
  it('flag ABSENT ≡ flag FALSE, whole run incl. the rng stream', () => {
    for (const seed of [SEED_A, SEED_B]) {
      expect(walk(seed, { learn: 'absent' })).toBe(walk(seed, { learn: false }));
    }
  });

  it('⭐ ARMED TO LEARN ALONE ≡ OFF — and the machinery is LIVE, not dead', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const books: [DeliveryAccountBook, DeliveryAccountBook] = [
        new DeliveryAccountBook(), new DeliveryAccountBook(),
      ];
      expect(walk(seed, { learn: true, books })).toBe(walk(seed, { learn: 'absent' }));
      // non-vacuity: the books really did fill during those identical matches
      expect(books[0].total + books[1].total).toBeGreaterThan(0);
      expect(books.some((b) => b.beliefVector() !== null)).toBe(true);
    }
  });

  it('⭐ an armed match with an EMPTY book writes no gene at construction', () => {
    const m = matchOf(SEED_C, {
      learn: true, price: true, books: [new DeliveryAccountBook(), new DeliveryAccountBook()],
    });
    for (const t of m.teams) {
      expect((t.baseGenome as TacticalGenome).dvLossBelief).toBeUndefined();
      expect(deliveryValueSeatOf(t.genome)).toBeNull();
    }
  });

  it('⭐ a CARRIED book is live from the first tick (and a zero book prices as +0)', () => {
    const carried = new DeliveryAccountBook();
    for (let i = 0; i < 5; i++) carried.note(0, false); // deliveries, no punishment
    const m = matchOf(SEED_C, {
      learn: true, price: true, books: [carried, new DeliveryAccountBook()],
    });
    expect((m.teams[0].baseGenome as TacticalGenome).dvLossBelief).toEqual([0, 0, 0]);
    expect((m.teams[1].baseGenome as TacticalGenome).dvLossBelief).toBeUndefined();
    // an all-zero belief leaves the world the shipped one (DV-T0's IEEE identity)
    expect(walk(SEED_C, { learn: 'absent' })).toBe((() => {
      const zeroBooks: [DeliveryAccountBook, DeliveryAccountBook] = [
        new DeliveryAccountBook(), new DeliveryAccountBook(),
      ];
      for (const b of zeroBooks) for (let i = 0; i < 5; i++) b.note(1, false);
      const mm = matchOf(SEED_C, { learn: false, price: true });
      for (const t of mm.teams) {
        (t.baseGenome as TacticalGenome).dvLossBelief = [0, 0, 0];
        (t.effGenome as TacticalGenome).dvLossBelief = [0, 0, 0];
      }
      while (!mm.finished) mm.step(DT);
      return signature(mm);
    })());
  });
});

describe('DV-T2-T0 — the label capture in a real match', () => {
  it('⭐ a stepped match fills the books, in the AIM zone, and only on closed labels', () => {
    const books: [DeliveryAccountBook, DeliveryAccountBook] = [
      new DeliveryAccountBook(), new DeliveryAccountBook(),
    ];
    const m = matchOf(SEED_D, { learn: true, books });
    let sawOpen = false;
    while (!m.finished) {
      m.step(DT);
      if (m.dvLearn !== null && m.dvLearn.openLabels > 0) sawOpen = true;
    }
    expect(sawOpen).toBe(true); // labels really do wait on their window
    expect(m.dvLearn?.openLabels).toBe(0); // the whistle closed them all
    const total = books[0].total + books[1].total;
    expect(total).toBeGreaterThan(20);
    expect(m.dvLearn?.closedLabels).toBe(total);
    for (const b of books) {
      expect(b.deliveries.reduce((a, c) => a + c, 0)).toBe(b.total);
      expect(b.punished.every((k, z) => k <= b.deliveries[z])).toBe(true);
      const bel = b.beliefVector();
      expect(bel).not.toBeNull();
      bel?.forEach((v, z) => {
        expect(v).toBe(b.deliveries[z] > 0 ? b.punished[z] / b.deliveries[z] : 0);
      });
    }
  });

  it('⭐⭐ NO LAMARCK: the franchise genome is never written', () => {
    const books: [DeliveryAccountBook, DeliveryAccountBook] = [
      new DeliveryAccountBook(), new DeliveryAccountBook(),
    ];
    const m = matchOf(SEED_D, { learn: true, price: true, books });
    m.runToCompletion();
    for (const t of m.teams) {
      expect((t.info.genome as TacticalGenome).dvLossBelief).toBeUndefined();
      expect((t.info.genome as TacticalGenome).dvExposureWeight).toBeUndefined();
    }
    expect(m.teams.some((t) => (t.baseGenome as TacticalGenome).dvLossBelief !== undefined))
      .toBe(true);
  });
});

describe('DV-T2-T0 — the season boundary (M-DV2.2)', () => {
  it('⭐ an armed League fills its books over a season and WIPES them at the boundary', () => {
    const lg = new League({ seed: 12_437_904 });
    lg.matchFlags = { dvLearnedMap: true };
    // ⚠ SIX fixtures, not the whole season: a full 71-match season takes ~17 s alone and
    // times out under the parallel suite's load. The season BOUNDARY is what this pin is
    // about, and `finishSeason` closes it from wherever the cursor stands. The probe's
    // G-RESET runs the FULL season.
    for (let i = 0; i < 6 && !lg.seasonDone; i++) {
      const f = lg.nextFixture();
      if (!f) break;
      lg.applyResult(f, lg.createMatch(f).runToCompletion());
    }
    const filled = lg.deliveryBooks ?? [];
    expect(filled.length).toBeGreaterThan(0);
    expect(filled.reduce((n, b) => n + b.total, 0)).toBeGreaterThan(0);
    expect(filled.some((b) => b.beliefVector() !== null)).toBe(true);
    lg.finishSeason();
    const after = lg.deliveryBooks ?? [];
    expect(after.reduce((n, b) => n + b.total, 0)).toBe(0);
    expect(after.every((b) => b.beliefVector() === null)).toBe(true);
    // and the next match is BORN ABSENT again
    const f2 = lg.nextFixture();
    expect(f2).toBeTruthy();
    const m2 = lg.createMatch(f2!);
    for (const t of m2.teams) {
      expect((t.baseGenome as TacticalGenome).dvLossBelief).toBeUndefined();
    }
  });

  it('the book is never serialized into a save', () => {
    const lg = new League({ seed: 12_437_905 });
    lg.matchFlags = { dvLearnedMap: true };
    const f = lg.nextFixture();
    lg.applyResult(f!, lg.createMatch(f!).runToCompletion());
    const json = JSON.stringify(lg.toJSON());
    expect(json).not.toContain('dvBooks');
    expect(json).not.toContain('dvLossBelief');
    expect(json).not.toContain('dvLearnedMap');
  });
});
