import { describe, expect, it } from 'vitest';
import {
  resolveShootout, shootoutLineup, type ShootoutSquad,
} from '../src/sim/cup';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { League } from '../src/sim/League';
import { Rng } from '../src/utils/rng';

const squadOf = (finishing: number, reflexes: number): ShootoutSquad => ({
  kickers: [finishing, finishing, finishing, finishing, finishing],
  order: [1, 2, 3, 4, 0],
  gkReflexes: reflexes,
});

const attrs = (finishing: number, reflexes = 0.5): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  p.finishing = finishing;
  p.reflexes = reflexes;
  return p;
};

describe('penalty shootout (Phase 22)', () => {
  it('is deterministic: same seed ⇒ same result', () => {
    for (const seed of [1, 22, 333, 4444]) {
      const a = resolveShootout(squadOf(0.6, 0.5), squadOf(0.4, 0.5), new Rng(seed));
      const b = resolveShootout(squadOf(0.6, 0.5), squadOf(0.4, 0.5), new Rng(seed));
      expect(a).toEqual(b);
    }
  });

  it('always ends decisive (or the rare failsafe null) with plausible scores', () => {
    let decided = 0;
    for (let seed = 0; seed < 300; seed++) {
      const r = resolveShootout(squadOf(0.5, 0.5), squadOf(0.5, 0.5), new Rng(seed));
      if (r === null) continue; // failsafe: caller applies the underdog rule
      decided++;
      expect(r.scoreH).not.toBe(r.scoreA);
      expect(Math.max(r.scoreH, r.scoreA)).toBeLessThanOrEqual(15);
      // Without sudden death the best-of-5 caps at 5.
      if (!r.sudden) expect(Math.max(r.scoreH, r.scoreA)).toBeLessThanOrEqual(5);
    }
    expect(decided).toBeGreaterThan(290); // the failsafe must be genuinely rare
  });

  it('directional: sharper finishers win the shootout more often', () => {
    let sharp = 0;
    let blunt = 0;
    for (let seed = 0; seed < 400; seed++) {
      // Side-balanced: the sharp squad kicks first half the time.
      const home = seed % 2 === 0 ? squadOf(0.9, 0.5) : squadOf(0.1, 0.5);
      const away = seed % 2 === 0 ? squadOf(0.1, 0.5) : squadOf(0.9, 0.5);
      const r = resolveShootout(home, away, new Rng(seed));
      if (!r) continue;
      const homeWon = r.scoreH > r.scoreA;
      const sharpWon = seed % 2 === 0 ? homeWon : !homeWon;
      if (sharpWon) sharp++;
      else blunt++;
    }
    expect(sharp).toBeGreaterThan(blunt * 1.5);
  });

  it('directional: a better keeper wins their team more shootouts', () => {
    let cat = 0;
    let statue = 0;
    for (let seed = 0; seed < 400; seed++) {
      const home = seed % 2 === 0 ? squadOf(0.5, 0.95) : squadOf(0.5, 0.05);
      const away = seed % 2 === 0 ? squadOf(0.5, 0.05) : squadOf(0.5, 0.95);
      const r = resolveShootout(home, away, new Rng(seed));
      if (!r) continue;
      const homeWon = r.scoreH > r.scoreA;
      const catWon = seed % 2 === 0 ? homeWon : !homeWon;
      if (catWon) cat++;
      else statue++;
    }
    expect(cat).toBeGreaterThan(statue * 1.5);
  });

  it('shootoutLineup: best outfield finishers kick first, the keeper kicks fifth', () => {
    const squad = [attrs(0.2, 0.7), attrs(0.4), attrs(0.9), attrs(0.6), attrs(0.6)];
    const lineup = shootoutLineup(squad);
    // Outfield sorted by finishing desc with index tiebreak (2 → 0.9, then 3 & 4 at 0.6, then 1), GK last.
    expect(lineup.kickers).toEqual([0.9, 0.6, 0.6, 0.4, 0.2]);
    expect(lineup.order).toEqual([2, 3, 4, 1, 0]);
    // The order indices and kicker values must describe the same players.
    lineup.order.forEach((pi, i) => expect(squad[pi].finishing).toBe(lineup.kickers[i]));
    expect(lineup.gkReflexes).toBe(0.7);
  });

  it('kick recording (Phase 24): same result, honest kick-by-kick script', () => {
    for (let seed = 0; seed < 200; seed++) {
      const bare = resolveShootout(squadOf(0.6, 0.5), squadOf(0.4, 0.6), new Rng(seed));
      const kicks: import('../src/sim/cup').ShootoutKick[] = [];
      const recorded = resolveShootout(squadOf(0.6, 0.5), squadOf(0.4, 0.6), new Rng(seed), kicks);
      // Recording must not shift a single rng draw.
      expect(recorded).toEqual(bare);
      if (!recorded) continue;
      // The script's running score ends exactly at the recorded result.
      const last = kicks[kicks.length - 1];
      expect([last.h, last.a]).toEqual([recorded.scoreH, recorded.scoreA]);
      // Best-of-5 kicks alternate home/away starting with the hosts.
      kicks.filter((k) => !k.sudden).forEach((k, i) => expect(k.side).toBe(i % 2));
      // Sudden-death kicks appear only after the best-of-5, in home/away pairs.
      const firstSudden = kicks.findIndex((k) => k.sudden);
      if (firstSudden >= 0) {
        expect(recorded.sudden).toBe(true);
        kicks.slice(firstSudden).forEach((k, i) => {
          expect(k.sudden).toBe(true);
          expect(k.side).toBe(i % 2);
        });
      }
      // Scores only ever step up by the recorded kick's own outcome.
      let h = 0;
      let a = 0;
      for (const k of kicks) {
        if (k.scored) k.side === 0 ? h++ : a++;
        expect([k.h, k.a]).toEqual([h, a]);
        expect(k.kicker).toBeGreaterThanOrEqual(0);
        expect(k.kicker).toBeLessThanOrEqual(4);
      }
    }
  });

  it('league shootoutContext replays the exact shootout applyResult recorded', { timeout: 20000 }, () => {
    const league = new League({ seed: 3, matchDuration: 30 });
    let checked = 0;
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      const result = league.createMatch(f).runToCompletion();
      // Capture the presentation script BEFORE applying, like the theater does.
      const ctx = f.cup && result.score[0] === result.score[1] ? league.shootoutContext(f) : undefined;
      const kicks: import('../src/sim/cup').ShootoutKick[] = [];
      const replayed = ctx ? resolveShootout(ctx.home, ctx.away, ctx.rng, kicks) : null;
      league.applyResult(f, result);
      if (ctx && replayed) {
        const tie = league.cup!.ties.find((t) => t.round === f.round && t.index === f.index)!;
        expect(tie.shootout).toEqual(replayed); // same seed ⇒ same shootout
        expect(kicks.length).toBeGreaterThan(0);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('league integration: in shootout mode drawn ties carry a shootout and its winner', { timeout: 20000 }, () => {
    let shootoutsSeen = 0;
    for (const seed of [3, 11]) {
      const a = new League({ seed, matchDuration: 30 });
      const b = new League({ seed, matchDuration: 30 });
      expect(a.cupDrawMode).toBe('shootout'); // new-league default
      for (const l of [a, b]) {
        while (!l.seasonDone) {
          const f = l.nextFixture()!;
          l.applyResult(f, l.createMatch(f).runToCompletion());
        }
      }
      expect(JSON.stringify(a.cup)).toBe(JSON.stringify(b.cup)); // deterministic
      for (const tie of a.cup!.ties) {
        if (tie.scoreH === undefined || tie.scoreH !== tie.scoreA) continue;
        shootoutsSeen++;
        expect(tie.shootout).toBeDefined();
        expect(tie.byDrawRule).toBeUndefined();
        const penWinner = tie.shootout!.scoreH > tie.shootout!.scoreA ? tie.home : tie.away;
        expect(tie.winner).toBe(penWinner);
      }
    }
    // 30s matches draw often — the shootout path must actually be exercised.
    expect(shootoutsSeen).toBeGreaterThan(0);
  });

  it('save/load: cupDrawMode roundtrips; pre-Phase-22 saves default to the underdog rule', () => {
    const league = new League({ seed: 5, matchDuration: 30 });
    const data = league.toJSON() as Record<string, unknown>;
    expect(data.cupDrawMode).toBe('shootout');
    expect(League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>).cupDrawMode).toBe('shootout');

    delete data.cupDrawMode; // simulate an old save
    const old = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(old.cupDrawMode).toBe('underdog');
  });
});
