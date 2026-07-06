import { describe, expect, it } from 'vitest';
import { neutralGenome, neutralSquad } from '../src/ai/wildcard';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import type { TeamInfo } from '../src/sim/types';

const team = (name: string, genes: Partial<ReturnType<typeof neutralGenome>> = {}): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
  genome: { ...neutralGenome(), ...genes },
  squad: neutralSquad(),
});

describe('cards (Phase 25)', () => {
  it('bookings land at a plausible rate; reds are rare but real', () => {
    let yellows = 0;
    let reds = 0;
    let fouls = 0;
    const N = 300;
    for (let seed = 0; seed < N; seed++) {
      const r = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 }).runToCompletion();
      yellows += r.stats[0].yellows + r.stats[1].yellows;
      reds += r.stats[0].reds + r.stats[1].reds;
      fouls += r.stats[0].fouls + r.stats[1].fouls;
    }
    // ~22% of fouls draw a booking at neutral genes (see maybeCard).
    expect(yellows / N).toBeGreaterThan(0.4);
    expect(yellows / N).toBeLessThan(2.0);
    expect(yellows).toBeLessThan(fouls); // a booking needs a foul
    expect(reds).toBeGreaterThan(0); // sendings-off genuinely happen...
    expect(reds / N).toBeLessThan(0.2); // ...but stay dramatic, not routine
  });

  it('directional: aggressive markers collect more cards (side-balanced)', () => {
    let aggressive = 0;
    let clean = 0;
    for (let seed = 0; seed < 120; seed++) {
      const dirty = team('Dirty', { markingAggression: 0.95 });
      const tidy = team('Tidy', { markingAggression: 0.05 });
      const home = seed % 2 === 0 ? dirty : tidy;
      const away = seed % 2 === 0 ? tidy : dirty;
      const r = new Match({ seed, teamA: home, teamB: away, duration: 240 }).runToCompletion();
      const dirtyIdx = seed % 2 === 0 ? 0 : 1;
      aggressive += r.stats[dirtyIdx].yellows + r.stats[dirtyIdx].reds;
      clean += r.stats[1 - dirtyIdx].yellows + r.stats[1 - dirtyIdx].reds;
    }
    expect(aggressive).toBeGreaterThan(clean * 1.5);
  });

  it('a second yellow is a red: events and stats stay consistent', () => {
    for (let seed = 0; seed < 200; seed++) {
      const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
      const r = m.runToCompletion();
      for (const side of [0, 1] as const) {
        const cardEvents = r.events.filter((e) => e.type === 'card' && e.side === side);
        const yellowEvents = cardEvents.filter((e) => e.text.includes('booked')).length;
        const secondYellow = cardEvents.filter((e) => e.text.includes('Second yellow')).length;
        const straightRed = cardEvents.filter((e) => e.text.includes('STRAIGHT RED')).length;
        expect(r.stats[side].yellows).toBe(yellowEvents + secondYellow);
        expect(r.stats[side].reds).toBe(secondYellow + straightRed);
        // The pitch agrees with the ledger.
        const off = m.teams[side].players.filter((p) => p.sentOff).length;
        expect(off).toBe(r.stats[side].reds);
        // Keepers are never carded (documented simplification — no bench).
        expect(m.teams[side].goalkeeper.sentOff).toBe(false);
        expect(m.teams[side].goalkeeper.booked).toBe(false);
      }
    }
  });

  it('determinism: same seed ⇒ identical cards, watched or skipped', () => {
    for (const seed of [77, 4242]) {
      const a = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 }).runToCompletion();
      const b = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
      while (!b.finished) b.step(1 / 60);
      const cardsOf = (r: typeof a) => r.events.filter((e) => e.type === 'card').map((e) => e.text);
      expect(cardsOf(b.getResult())).toEqual(cardsOf(a));
      expect(b.getResult().stats[0].reds).toBe(a.stats[0].reds);
    }
  });

  it('directional: playing a man short costs results (forced early red)', () => {
    let shorthandedGd = 0;
    let fullGd = 0;
    for (let seed = 0; seed < 40; seed++) {
      // Side-balanced: the sent-off player alternates teams; compare each
      // shorthanded match against the same seed at full strength.
      const full = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 }).runToCompletion();
      const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
      const shortSide = seed % 2;
      m.sendOff(m.teams[shortSide].players[2]); // the MF goes at kickoff
      const r = m.runToCompletion();
      shorthandedGd += r.score[shortSide] - r.score[1 - shortSide];
      fullGd += full.score[shortSide] - full.score[1 - shortSide];
    }
    expect(shorthandedGd).toBeLessThan(fullGd - 10); // 4v5 must genuinely hurt
  });

  it('a sent-off player never rejoins: parked off-pitch through kickoffs and restarts', () => {
    const m = new Match({ seed: 5, teamA: team('A'), teamB: team('B'), duration: 240 });
    const victim = m.teams[0].players[3];
    m.sendOff(victim);
    const r = m.runToCompletion();
    expect(victim.sentOff).toBe(true);
    expect(Math.abs(victim.pos.y)).toBeGreaterThan(29); // beyond the touchline
    // He touched nothing after going off: no kickoff, no restart, no capture.
    expect(m.ball.owner).not.toBe(victim);
    expect(r.duration).toBe(240);
  });

  it('league: cards aggregate into the dirtiest-team award and the save roundtrips', () => {
    const league = new League({ seed: 9, matchDuration: 60 });
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const rec = league.finishSeason();
    expect(rec.awards).toBeDefined();
    // At ~1 booking/match a 56-match season without a single card is
    // astronomically unlikely — the award must exist and be non-empty.
    expect(rec.awards!.dirtiest).toBeTruthy();
    expect(rec.awards!.dirtiest!.yellows + rec.awards!.dirtiest!.reds).toBeGreaterThan(0);
    // Save/load: v6 roundtrips, and the loaded league keeps playing.
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>);
    const f = loaded.nextFixture()!;
    loaded.applyResult(f, loaded.createMatch(f).runToCompletion());
    expect(loaded.generation).toBe(league.generation);
  });

  it('v5 saves migrate: card tallies backfill to zero', () => {
    const league = new League({ seed: 3, matchDuration: 30 });
    const data = league.toJSON() as Record<string, unknown> & { version: number; agg: Array<Record<string, unknown>> };
    // Forge a v5 save: strip the Phase-25 fields.
    data.version = 5;
    for (const a of data.agg) {
      delete a.yellows;
      delete a.reds;
    }
    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    const f = loaded.nextFixture()!;
    loaded.applyResult(f, loaded.createMatch(f).runToCompletion()); // aggregation must not NaN
    const agg = (loaded.toJSON() as { agg: Array<{ yellows: number; reds: number }> }).agg;
    for (const a of agg) {
      expect(Number.isFinite(a.yellows)).toBe(true);
      expect(Number.isFinite(a.reds)).toBe(true);
    }
  });
});
