import { describe, expect, it } from 'vitest';
import { createFranchise, type Franchise } from '../src/evolution/franchise';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import {
  ROSTER_SIZE, SUBS_MAX, TEAM_SIZE, type PlayerMatchStats, type TeamInfo,
} from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * The BENCH (Phase 61, N2): substitutions as an EVOLVABLE strategy. The
 * substrate provides dead-ball swaps under SUBS_MAX with no re-entry;
 * WHEN is the coach's rotationBias read as a fatigue threshold, WHO is
 * the tiredest body / the like-for-like bench row. These tests pin the
 * gene gate (deterministic zeros at 0), legality, and stat attribution.
 */

const franchisePair = (seed: number): [Franchise, Franchise] => {
  const rng = new Rng(seed);
  const taken = new Set<string>();
  return [createFranchise(0, rng, taken), createFranchise(1, rng, taken)];
};

const infoOf = (f: Franchise, rotationBias: number): TeamInfo => ({
  id: f.id,
  name: f.name,
  short: f.short,
  colors: f.colors,
  playerNames: f.playerNames,
  genome: { ...f.coach.genome, rotationBias },
  squad: f.squad,
  ages: f.ages,
  style: f.coach.style,
  policy: f.coach.policy,
});

const allSubs = (m: Match): number => m.events.filter((e) => e.text.startsWith('🔄')).length;
// The gene gate is about ROTATION subs — the injury sub (Phase 118) is
// forced regardless of rotationBias and rightly consumes the budget.
const rotationSubs = (m: Match): number =>
  m.events.filter((e) => e.text.startsWith('🔄') && !e.text.includes('injured')).length;

describe('substitutions (Phase 61)', () => {
  it('the gene gate: rotationBias 0 never subs, rotationBias 1 rotates', { timeout: 120000 }, () => {
    const [fa, fb] = franchisePair(42);
    let hungrySubs = 0;
    for (const seed of [1, 2, 3, 4, 5, 6]) {
      const still = new Match({ seed, teamA: infoOf(fa, 0), teamB: infoOf(fb, 0) });
      while (!still.finished) still.step(1 / 60);
      expect(rotationSubs(still)).toBe(0);
      // Injury subs (118) may still spend the budget — counters agree.
      expect(still.teams[0].subsUsed + still.teams[1].subsUsed).toBe(allSubs(still));

      const hungry = new Match({ seed, teamA: infoOf(fa, 1), teamB: infoOf(fb, 1) });
      while (!hungry.finished) hungry.step(1 / 60);
      hungrySubs += rotationSubs(hungry);
      // Feed lines and the counters agree.
      expect(allSubs(hungry)).toBe(hungry.teams[0].subsUsed + hungry.teams[1].subsUsed);
    }
    expect(hungrySubs).toBeGreaterThan(0);
  });

  it('legality: never the keeper, never past SUBS_MAX, no re-entry', { timeout: 120000 }, () => {
    const [fa, fb] = franchisePair(7);
    for (const seed of [11, 12, 13, 14]) {
      const m = new Match({ seed, teamA: infoOf(fa, 1), teamB: infoOf(fb, 1) });
      while (!m.finished) m.step(1 / 60);
      for (const team of m.teams) {
        expect(team.subsUsed).toBeLessThanOrEqual(SUBS_MAX);
        expect(team.players[0].rosterIdx).toBe(0); // the keeper is never subbed
        // No re-entry: every man on the pitch occupies a DISTINCT roster row,
        // and used bench entries match the count.
        const rows = team.players.map((p) => p.rosterIdx);
        expect(new Set(rows).size).toBe(rows.length);
        expect(team.bench.filter((b) => b.used).length).toBe(team.subsUsed);
        // A substitute on the pitch carries his own identity.
        for (const p of team.players) {
          if (p.rosterIdx >= TEAM_SIZE) {
            expect(p.name).toBe(team.info.playerNames[p.rosterIdx]);
            expect(p.attrs).toBe(team.info.squad[p.rosterIdx]);
          }
        }
      }
    }
  });

  it('attribution: apps land on roster rows — starters + subs used, bench rows stay empty', { timeout: 60000 }, () => {
    const [fa, fb] = franchisePair(19);
    const m = new Match({ seed: 5, teamA: infoOf(fa, 1), teamB: infoOf(fb, 1) });
    const res = m.runToCompletion();
    expect(res.playerStats).toHaveLength(ROSTER_SIZE * 2);
    for (const side of [0, 1] as const) {
      const rows = res.playerStats.slice(side * ROSTER_SIZE, (side + 1) * ROSTER_SIZE);
      const appearances = rows.filter((s) => s.apps > 0).length;
      expect(appearances).toBe(TEAM_SIZE + m.teams[side].subsUsed);
      // Whoever never came on has NOTHING on his row.
      for (const s of rows) {
        if (s.apps === 0) {
          expect(s.goals + s.assists + s.shots + s.saves + s.recoveries + s.rating).toBe(0);
        }
      }
    }
  });

  it('a benchless TeamInfo (legacy 6-man arrays) still plays, with zero subs', () => {
    const [fa, fb] = franchisePair(3);
    const legacy = (f: Franchise): TeamInfo => ({
      ...infoOf(f, 1),
      playerNames: f.playerNames.slice(0, TEAM_SIZE),
      squad: f.squad.slice(0, TEAM_SIZE),
      ages: f.ages.slice(0, TEAM_SIZE),
    });
    const m = new Match({ seed: 9, teamA: legacy(fa), teamB: legacy(fb), duration: 120 });
    const res = m.runToCompletion();
    expect(allSubs(m)).toBe(0);
    expect(res.playerStats.filter((s) => s.apps > 0)).toHaveLength(TEAM_SIZE * 2);
  });
});

describe('v17 → v18 migration (the bench)', () => {
  it('backfills bench rows, the rotation gene, and apps — deterministically', () => {
    const league = new League({ seed: 77, matchDuration: 30 });
    for (let i = 0; i < 3; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    league.finishSeason();
    // Forge an authentic v17 save: strip everything Phase 61 added.
    const data = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown> & {
      franchises: Franchise[];
      playerAgg: PlayerMatchStats[][];
      history: Array<{ geneMeans?: Record<string, number> }>;
      coachPool: Array<{ coach: { genome: Record<string, number> } }>;
    };
    data.version = 17;
    for (const f of data.franchises) {
      f.playerNames.splice(TEAM_SIZE);
      f.squad.splice(TEAM_SIZE);
      f.squadStyles.splice(TEAM_SIZE);
      f.ages.splice(TEAM_SIZE);
      f.careers.splice(TEAM_SIZE);
      delete (f.coach.genome as unknown as Partial<Record<string, number>>).rotationBias;
    }
    for (const arr of data.playerAgg) {
      arr.splice(TEAM_SIZE);
      for (const s of arr) delete (s as Partial<PlayerMatchStats>).apps;
    }
    for (const e of data.coachPool) delete (e.coach.genome as Partial<Record<string, number>>).rotationBias;
    for (const r of data.history) delete r.geneMeans?.rotationBias;

    const loaded = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    for (const f of loaded.franchises) {
      expect(f.squad).toHaveLength(ROSTER_SIZE);
      expect(f.playerNames).toHaveLength(ROSTER_SIZE);
      expect(f.squadStyles).toHaveLength(ROSTER_SIZE);
      expect(f.ages).toHaveLength(ROSTER_SIZE);
      expect(f.careers).toHaveLength(ROSTER_SIZE);
      expect(new Set(f.playerNames).size).toBe(ROSTER_SIZE);
      expect(f.coach.genome.rotationBias).toBe(0.5); // neutral backfill
    }
    for (const arr of loaded.playerAgg) expect(arr).toHaveLength(ROSTER_SIZE);
    // History snapshots read by the UI got the gene too.
    for (const r of loaded.history) {
      if (r.geneMeans) expect(r.geneMeans.rotationBias).toBe(0.5);
    }
    // Deterministic: migrating twice gives the identical league.
    const again = League.fromJSON(JSON.parse(JSON.stringify(data)) as Record<string, unknown>);
    expect(JSON.stringify(again.toJSON())).toBe(JSON.stringify(loaded.toJSON()));
    // And the loaded league keeps simulating.
    const next = loaded.nextFixture()!;
    expect(() => loaded.applyResult(next, loaded.createMatch(next).runToCompletion())).not.toThrow();
  });
});
