import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';

// Local neutral helpers (used to live in the removed wildcard module).
const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const a = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) a[k] = 0.5;
    return a;
  });
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

const team = (name: string, genes: Partial<ReturnType<typeof neutralGenome>> = {}): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: { ...neutralGenome(), ...genes },
  squad: neutralSquad(),
});

/**
 * Let the event loop breathe between simulated matches. The statistical
 * suites peg the CPU for 60s+ on slow CI runners, which starves vitest's
 * worker RPC heartbeat ("Timeout calling onTaskUpdate") — a periodic
 * setImmediate keeps the channel alive without touching determinism.
 */
const breathe = (i: number): Promise<void> | undefined =>
  i % 25 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

describe('cards (Phase 25)', () => {
  // Statistical suites simulate hundreds of full matches — generous timeouts
  // for CI runners that are ~2× slower than a dev machine.
  it('bookings land at a plausible rate; reds are rare but real', { timeout: 120000 }, async () => {
    let yellows = 0;
    let reds = 0;
    let fouls = 0;
    const N = 300;
    for (let seed = 0; seed < N; seed++) {
      await breathe(seed);
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

  it('directional: aggressive markers collect more cards (side-balanced)', { timeout: 60000 }, async () => {
    let aggressive = 0;
    let clean = 0;
    for (let seed = 0; seed < 120; seed++) {
      await breathe(seed);
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

  it('a second yellow is a red: events and stats stay consistent', { timeout: 90000 }, async () => {
    for (let seed = 0; seed < 200; seed++) {
      await breathe(seed);
      const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
      const r = m.runToCompletion();
      for (const side of [0, 1] as const) {
        const cardEvents = r.events.filter((e) => e.type === 'card' && e.side === side);
        const yellowEvents = cardEvents.filter((e) => e.text.includes('booked')).length;
        const secondYellow = cardEvents.filter((e) => e.text.includes('Second yellow')).length;
        const straightRed = cardEvents.filter((e) => e.text.includes('STRAIGHT RED')).length;
        expect(r.stats[side].yellows).toBe(yellowEvents + secondYellow);
        expect(r.stats[side].reds).toBe(secondYellow + straightRed);
        // The pitch agrees with the ledger. Since Phase 118 a player can
        // also leave for good on a stretcher with the bench exhausted —
        // every such exit is a 🚑 line WITHOUT a matching injury sub.
        const off = m.teams[side].players.filter((p) => p.sentOff).length;
        const stretchers = r.events.filter((e) => e.side === side && e.text.includes('stretchered')).length;
        const injurySubs = r.events.filter((e) => e.side === side && e.text.includes('for the injured')).length;
        expect(off).toBe(r.stats[side].reds + (stretchers - injurySubs));
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

  it('directional: playing a man short costs results (forced early red)', { timeout: 240000 }, async () => {
    // The robust cost channel moved THREE times (30: goals; 31: goal
    // difference; 31.8: neither survives n=60 — the calm-restart +
    // clean-reception era genuinely compresses the man-short RESULTS
    // penalty). 31.9 re-measured the noise on THREE disjoint 60-seed
    // pools: GD diff {+6, −17, −1} (σ≈12/pool — the old +4 margin sat
    // INSIDE single-pool noise and flipped on the tackle-economy change;
    // shots ratio {0.88, 1.03, 0.86} flaps at n=60 too). So: 180 seeds,
    // shots ratio < 0.97 (0.92 at scale) and GD margin +12 — the guard
    // exists to catch the SYSTEMATIC inversion (31.1's uncovered-breakaway
    // bug read as a whole-pool blowout, caught twice), not pool rolls.
    let shortShots = 0;
    let fullShots = 0;
    let shortGD = 0;
    let fullGD = 0;
    for (let seed = 0; seed < 180; seed++) {
      await breathe(seed);
      // Side-balanced: the sent-off player alternates teams; compare each
      // shorthanded match against the same seed at full strength.
      const full = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 }).runToCompletion();
      const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
      const shortSide = seed % 2;
      m.sendOff(m.teams[shortSide].players[2]); // the MF goes at kickoff
      const r = m.runToCompletion();
      shortShots += r.stats[shortSide].shots;
      fullShots += full.stats[shortSide].shots;
      shortGD += r.score[shortSide] - r.score[1 - shortSide];
      fullGD += full.score[shortSide] - full.score[1 - shortSide];
    }
    expect(shortShots).toBeLessThan(fullShots * 0.97); // a man short, you create less
    expect(shortGD).toBeLessThan(fullGD + 12); // and it must NEVER make you (systematically) better off
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

  it('league: cards aggregate into the dirtiest-team award and the save roundtrips', { timeout: 120000 }, async () => {
    // Full-length matches on purpose: the dirtiest award counts ONE division's
    // cards (League.finishSeason filters `f.division !== division`), and the
    // booking rate scales with match length — a 60s season yields only ~0.14
    // bookings/match and the awarded division can realistically see zero (a
    // legitimate outcome shift once tipped seed 9 there). At 240s the awarded
    // division collects ~25 cards, so a season without one is astronomically
    // unlikely and the assertion is robust to future outcome drift.
    // 56 full-length matches peg a 2-core CI runner past vitest's default
    // 20s (the previous docs push failed CI exactly here) — explicit timeout
    // + periodic yields keep the worker RPC heartbeat alive (repo CI rule).
    const league = new League({ seed: 9, matchDuration: 240 });
    let played = 0;
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
      if (++played % 10 === 0) await new Promise((r) => setImmediate(r));
    }
    const rec = league.finishSeason();
    expect(rec.awards).toBeDefined();
    // The award must exist and be non-empty.
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
