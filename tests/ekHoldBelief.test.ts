import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import {
  EK_HOLD_BANDS, EK_HOLD_WINDOW_S, HoldAccountBook, HoldLabelLedger,
} from '../src/ai/holdAccountBook';
import { GENE_KEYS, randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * EK-T0 (docs/world-model/EK-T0-HOLD-BELIEF-SEAM.md; contract
 * docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §2 M-EK.1–.4; rulings #259.2 / #261.3 /
 * #261.4) — the DORMANT HOLD-BELIEF SEAM (持球的账本). The pins:
 *   • ⭐ THE BOOK (M-EK.2) — per team, per PERCEIVED pressure band, holds × punished; the
 *     belief is the MARGINAL rate, zero-constant on an unheld band, and an EMPTY book serves
 *     NO belief at all.
 *   • ⭐ THE LABEL (M-EK.1) — the FIRST possession loss by the holding team inside the traced
 *     10 s window; a dead ball is not a loss; the label closes when the window does.
 *   • ⭐⭐ THE VETO (M-EK.3) — the ZERO-CONSTANT COMPARATIVE form: this band's own believed
 *     risk strictly above the book's OWN pooled cross-band reference. Empty, one-band and tie
 *     books decline NOTHING, and no unlicensed hold is ever created (no subsidy, #64.1).
 *   • ⭐⭐ TWO DOORS — `ekHoldLearn` LEARNS, `ekHoldVeto` CONSUMES; armed to learn alone the
 *     books fill and the world is byte-identical, because nothing reads them.
 *   • NO GENE AT ALL — nothing is written to any genome, nothing is serialized, and the
 *     season's books are wiped at the boundary.
 * Road B: both flags hard-false ⇒ byte-identical world (the 2-season fingerprint pin is
 * deliberately NOT duplicated here — G-IDENT / X-FP-PROD recompute it in the probe).
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
const SEED_A = 12_450_900;
const SEED_B = 12_450_901;
const SEED_C = 12_450_902;

interface Arm {
  learn?: 'absent' | boolean;
  veto?: boolean;
  books?: readonly [HoldAccountBook, HoldAccountBook];
}
const matchOf = (seed: number, a: Arm = {}): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 60,
  ...(a.learn === undefined || a.learn === 'absent' ? {} : { ekHoldLearn: a.learn }),
  ...(a.learn === true && a.books !== undefined ? { ekHoldBooks: a.books } : {}),
  ...(a.veto === true ? { ekHoldVeto: true } : {}),
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
const bookOf = (holds: readonly number[], punished: readonly number[]): HoldAccountBook => {
  const b = new HoldAccountBook();
  for (let i = 0; i < EK_HOLD_BANDS; i++) for (let k = 0; k < holds[i]; k++) b.note(i, k < punished[i]);
  return b;
};
const BOOK_SRC = readFileSync('src/ai/holdAccountBook.ts', 'utf8');
const EYE_SRC = readFileSync('src/ai/whetherEye.ts', 'utf8');

describe('EK-T0 — the hold account book (M-EK.2)', () => {
  it('is BORN ABSENT: an empty book serves no belief and can decline nothing', () => {
    const b = new HoldAccountBook();
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
    for (let i = 0; i < EK_HOLD_BANDS; i++) expect(b.declinesHold(i)).toBe(false);
  });

  it('serves the MARGINAL rate per band, zero-constant on a band never held in', () => {
    const b = bookOf([4, 0, 2], [1, 0, 2]);
    expect(b.beliefVector()).toEqual([0.25, 0, 1]);
    expect(b.total).toBe(6);
  });

  it('never lets punished exceed holds, and keeps the seat\'s band width', () => {
    const b = bookOf([3, 1, 1], [3, 1, 0]);
    expect(b.punished.every((p, i) => p <= b.holds[i])).toBe(true);
    expect(b.holds.length).toBe(EK_HOLD_BANDS);
    expect(b.punished.length).toBe(EK_HOLD_BANDS);
    expect((b.beliefVector() ?? []).length).toBe(EK_HOLD_BANDS);
  });

  it('ignores a band outside the seat\'s own range', () => {
    const b = new HoldAccountBook();
    b.note(EK_HOLD_BANDS, true);
    b.note(-1, false);
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
  });

  it('is WIPED at the season boundary (structural, untuned)', () => {
    const b = bookOf([2, 2, 2], [2, 0, 1]);
    b.reset();
    expect(b.total).toBe(0);
    expect(b.beliefVector()).toBeNull();
  });
});

describe('EK-T0 — the COMPARATIVE VETO (M-EK.3, the #261.3(iv) form)', () => {
  it('declines nothing from a ONE-BAND book (no cross-band reference)', () => {
    const b = bookOf([5, 0, 0], [5, 0, 0]);
    for (let i = 0; i < EK_HOLD_BANDS; i++) expect(b.declinesHold(i)).toBe(false);
  });

  it('declines nothing on a TIE (the comparison is STRICT)', () => {
    const b = bookOf([2, 2, 0], [1, 1, 0]);
    expect(b.declinesHold(0)).toBe(false);
    expect(b.declinesHold(1)).toBe(false);
  });

  it('declines the band its own book says is strictly worse, and only that one', () => {
    const b = bookOf([4, 4, 0], [4, 1, 0]);
    expect(b.declinesHold(0)).toBe(true);
    expect(b.declinesHold(1)).toBe(false);
  });

  it('matches an INDEPENDENT float re-derivation over an exhaustive small sweep', () => {
    let checked = 0;
    for (let h0 = 0; h0 <= 2; h0++) for (let p0 = 0; p0 <= h0; p0++) {
      for (let h1 = 0; h1 <= 2; h1++) for (let p1 = 0; p1 <= h1; p1++) {
        for (let h2 = 0; h2 <= 2; h2++) for (let p2 = 0; p2 <= h2; p2++) {
          const holds = [h0, h1, h2]; const punished = [p0, p1, p2];
          const b = bookOf(holds, punished);
          for (let band = 0; band < EK_HOLD_BANDS; band++) {
            let oh = 0; let op = 0;
            for (let i = 0; i < EK_HOLD_BANDS; i++) {
              if (i === band) continue; oh += holds[i]; op += punished[i];
            }
            const expected = holds[band] > 0 && oh > 0 && punished[band] / holds[band] > op / oh;
            expect(b.declinesHold(band)).toBe(expected);
            checked++;
          }
        }
      }
    }
    expect(checked).toBe(648);
  });

  it('is ZERO-CONSTANT: the veto\'s own source carries no numeric literal but 0', () => {
    const body = BOOK_SRC.slice(BOOK_SRC.indexOf('declinesHold(band: number): boolean'));
    const method = body.slice(0, body.indexOf('\n  }'));
    const literals = (method.match(/(?<![\w.])\d+(?:\.\d+)?/g) ?? []).filter((n) => n !== '0');
    expect(literals).toEqual([]);
  });
});

describe('EK-T0 — the label ledger (M-EK.1, EK-C0\'s semantics)', () => {
  const freshLedger = (): { led: HoldLabelLedger; books: [HoldAccountBook, HoldAccountBook] } => {
    const books: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
    return { led: new HoldLabelLedger(books), books };
  };

  it('PUNISHES a hold whose team loses the ball inside the window', () => {
    const { led, books } = freshLedger();
    led.observeOwner(0, 0);
    led.noteTakeHold(0, 1, 0);
    led.observeOwner(1, EK_HOLD_WINDOW_S - 1);
    expect(books[0].holds[1]).toBe(1);
    expect(books[0].punished[1]).toBe(1);
  });

  it('does NOT punish when the first loss falls outside the window', () => {
    const { led, books } = freshLedger();
    led.observeOwner(0, 0);
    led.noteTakeHold(0, 2, 0);
    led.expire(EK_HOLD_WINDOW_S + 1);
    led.observeOwner(1, EK_HOLD_WINDOW_S + 2);
    expect(books[0].holds[2]).toBe(1);
    expect(books[0].punished[2]).toBe(0);
  });

  it('does NOT treat a dead ball as a loss', () => {
    const { led, books } = freshLedger();
    led.observeOwner(0, 0);
    led.noteTakeHold(0, 0, 0);
    led.observeDeadBall();
    led.expire(EK_HOLD_WINDOW_S + 1);
    expect(books[0].holds[0]).toBe(1);
    expect(books[0].punished[0]).toBe(0);
  });

  it('closes every still-open label UNPUNISHED at the whistle', () => {
    const { led, books } = freshLedger();
    led.observeOwner(1, 0);
    led.noteTakeHold(1, 1, 0);
    expect(led.openLabels).toBe(1);
    led.flush();
    expect(led.openLabels).toBe(0);
    expect(books[1].holds[1]).toBe(1);
    expect(books[1].punished[1]).toBe(0);
  });

  it('counts a drill COMMITMENT once, and only with the band the drill displaced', () => {
    const { led, books } = freshLedger();
    led.noteSeatBand(7, 2, 100);
    led.noteDrillHold(0, 7, 131, 101, 1.7); // lag 1 — the decision the drill displaced
    led.noteDrillHold(0, 7, 131, 102, 1.72); // same commitment, later tick
    expect(led.drillHolds).toBe(1);
    led.flush();
    expect(books[0].holds[2]).toBe(1);
  });

  it('REFUSES a drill hold whose placement is stale or absent, and says which', () => {
    const { led, books } = freshLedger();
    led.noteDrillHold(0, 3, 40, 10, 0.16); // never placed
    led.noteSeatBand(4, 0, 10);
    led.noteDrillHold(0, 4, 100, 90, 1.5); // placed 80 ticks ago — not this decision
    expect(led.drillHolds).toBe(0);
    expect(led.drillHoldsUnbanded).toBe(2);
    expect(led.drillHoldsUnseen).toBe(1);
    expect(led.drillHoldsStale).toBe(1);
    expect(led.drillStaleMaxTicks).toBe(80);
    led.flush();
    expect(books[0].total).toBe(0);
  });
});

describe('EK-T0 — the doors, the wiring and Road B', () => {
  it('is OFF by default in a fresh Match and in a League match', () => {
    const m = matchOf(SEED_A);
    expect(m.ekHoldLearn).toBe(false);
    expect(m.ekHoldVeto).toBe(false);
    expect(m.ekHold).toBeNull();
    const league = new League({ seed: SEED_A });
    const f = league.nextFixture();
    expect(f).toBeDefined();
    expect(league.createMatch(f!).ekHold).toBeNull();
    expect(league.holdBooks).toBeNull();
  });

  it('is absent from a4World\'s flag set entirely (Road B)', () => {
    expect(JSON.stringify([1, 2, 3].map((v) => a4MatchFlags(v as 1 | 2 | 3)))).not.toContain('ekHold');
    expect(readFileSync('src/game/a4World.ts', 'utf8')).not.toContain('ekHold');
  });

  it('armed to LEARN alone leaves the world byte-identical to off', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const off = walk(seed, { learn: 'absent' });
      expect(walk(seed, { learn: false })).toBe(off);
      expect(walk(seed, {
        learn: true, books: [new HoldAccountBook(), new HoldAccountBook()],
      })).toBe(off);
    }
  });

  it('an EMPTY book declines nothing, so both doors armed is still the shipped world', () => {
    const off = walk(SEED_C, { learn: 'absent' });
    const books: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
    expect(walk(SEED_C, { learn: true, veto: true, books })).toBe(off);
    const armed = matchOf(SEED_C, { learn: true, veto: true, books });
    expect(armed.ekHoldDeclines(0, 0)).toBe(false);
  });

  it('never consults the book with the veto door shut', () => {
    const books: [HoldAccountBook, HoldAccountBook] = [bookOf([4, 4, 0], [4, 1, 0]), new HoldAccountBook()];
    const learnOnly = matchOf(SEED_A, { learn: true, books });
    expect(books[0].declinesHold(0)).toBe(true);
    expect(learnOnly.ekHoldDeclines(0, 0)).toBe(false);
    const both = matchOf(SEED_A, { learn: true, veto: true, books });
    expect(both.ekHoldDeclines(0, 0)).toBe(true);
    expect(both.ekHoldDeclines(1, 0)).toBe(false);
  });

  it('gives a season\'s books to its fixtures and wipes them at the boundary', () => {
    const league = new League({ seed: SEED_B });
    league.matchFlags = { ekHoldLearn: true };
    const f = league.nextFixture();
    expect(f).toBeDefined();
    const m = league.createMatch(f!);
    const books = league.holdBooks;
    expect(books).not.toBeNull();
    expect(m.ekHold).not.toBeNull();
    expect(m.ekHold!.books[0]).toBe(books![f!.home]);
    books![f!.home].note(1, true);
    expect(books![f!.home].total).toBe(1);
    league.applyResult(f!, m.runToCompletion());
    league.finishSeason();
    expect((league.holdBooks ?? []).every((b) => b.total === 0)).toBe(true);
    expect((league.holdBooks ?? []).every((b) => b.beliefVector() === null)).toBe(true);
  });

  it('writes NO gene and serializes NOTHING', () => {
    const league = new League({ seed: SEED_C });
    league.matchFlags = { ekHoldLearn: true, ekHoldVeto: true };
    const f = league.nextFixture();
    const m = league.createMatch(f!);
    m.runToCompletion();
    expect(GENE_KEYS.some((k) => k.toLowerCase().includes('hold'))).toBe(false);
    for (const t of m.teams) {
      const g = t.baseGenome as unknown as Record<string, unknown>;
      expect(g.ekHoldBelief).toBeUndefined();
      expect(g.holdBelief).toBeUndefined();
    }
    expect(JSON.stringify(league.toJSON())).not.toContain('ekHold');
  });

  it('keeps the learner\'s import list EMPTY and the seat untouched', () => {
    expect(BOOK_SRC.split('\n').filter((l) => /^\s*import\s/.test(l))).toEqual([]);
    for (const forbidden of ['Match', 'Player', 'perceivedSnapshot', 'readFileSync', 'docs/']) {
      const executable = BOOK_SRC.split('\n')
        .filter((l) => {
          const t = l.trim();
          return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/'));
        }).join('\n');
      expect(executable).not.toContain(forbidden);
    }
    expect(EYE_SRC).not.toContain('ekHold');
  });
});
