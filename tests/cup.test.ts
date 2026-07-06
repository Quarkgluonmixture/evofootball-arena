import { describe, expect, it } from 'vitest';
import {
  CUP_ROUNDS, buildCupRecord, cupUnderdog, fillCupRound, resolveCupTie, type CupState,
} from '../src/sim/cup';
import { League } from '../src/sim/League';
import { challengerCupRuns, cupTitles, domesticDoubles, giantKillingCounts } from '../src/sim/records';

const makeLeague = (seed = 99) => new League({ seed, matchDuration: 30 });

const playSeason = (league: League) => {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
};

/** Everything a cup tie must never touch. */
const leagueSnapshot = (l: League) =>
  JSON.stringify({
    table: l.table,
    agg: l.agg,
    playerAgg: l.playerAgg,
    elo: l.franchises.map((f) => f.elo),
  });

describe('Evo Cup — draw', () => {
  it('seeds 16 entrants and pairs Premier vs Challenger in every R16 tie', () => {
    const cup = makeLeague().cup!;
    expect(cup.entrants.length).toBe(16);
    expect(new Set(cup.entrants.map((e) => e.seed)).size).toBe(16);
    for (const e of cup.entrants) {
      expect(e.division).toBe(e.seed <= 8 ? 0 : 1); // Premier seeds 1-8
    }
    const r16 = cup.ties.filter((t) => t.round === 0);
    expect(r16.length).toBe(8);
    const entered = r16.flatMap((t) => [t.home, t.away]);
    expect(new Set(entered).size).toBe(16); // every team enters exactly once
    for (const t of r16) {
      const home = cup.entrants.find((e) => e.slot === t.home)!;
      const away = cup.entrants.find((e) => e.slot === t.away)!;
      expect(home.division).toBe(1); // the Challenger underdog hosts
      expect(away.division).toBe(0);
    }
    // Later rounds are TBD skeleton: 4 + 2 + 1 ties.
    expect(cup.ties.length).toBe(15);
    for (const t of cup.ties.filter((x) => x.round > 0)) {
      expect(t.home).toBe(-1);
      expect(t.away).toBe(-1);
    }
  });

  it('is deterministic per (seed, generation) and differs across generations', () => {
    const a = makeLeague(7).cup!;
    const b = makeLeague(7).cup!;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));

    const later = makeLeague(7);
    playSeason(later);
    later.finishSeason();
    // Season 2's draw is its own: pairings must not just repeat season 1's.
    const pair = (c: CupState) => c.ties.filter((t) => t.round === 0).map((t) => `${t.home}v${t.away}`).join(',');
    expect(pair(later.cup!)).not.toBe(pair(a));
  });
});

describe('Evo Cup — tie resolution rules', () => {
  const mkCup = (): CupState => ({
    entrants: [
      { slot: 0, name: 'Prem A', division: 0, seed: 1, elo: 1550 },
      { slot: 1, name: 'Prem B', division: 0, seed: 2, elo: 1520 },
      { slot: 2, name: 'Chal A', division: 1, seed: 9, elo: 1480 },
      { slot: 3, name: 'Chal B', division: 1, seed: 10, elo: 1450 },
    ],
    ties: [
      { round: 0, index: 0, home: 2, away: 0, played: false },
      { round: 0, index: 1, home: 3, away: 1, played: false },
      { round: 1, index: 0, home: -1, away: -1, played: false },
    ],
    playerGoals: Array.from({ length: 4 }, () => [0, 0, 0, 0, 0]),
  });

  it('a decisive Challenger win is a giant killing', () => {
    const cup = mkCup();
    const tie = resolveCupTie(cup, 0, 0, 2, 1); // Chal A 2-1 Prem A
    expect(tie.winner).toBe(2);
    expect(tie.upset).toBe(true);
    expect(tie.byDrawRule).toBeUndefined();
  });

  it('a drawn tie sends the lower-division side through', () => {
    const cup = mkCup();
    const tie = resolveCupTie(cup, 0, 0, 1, 1);
    expect(tie.byDrawRule).toBe(true);
    expect(tie.winner).toBe(2); // Challenger advances
    expect(tie.upset).toBe(true);
  });

  it('a drawn same-division tie sends the lower seed through (no upset flag)', () => {
    const cup = mkCup();
    cup.ties[0] = { round: 0, index: 0, home: 1, away: 0, played: false }; // Prem B hosts Prem A
    const tie = resolveCupTie(cup, 0, 0, 0, 0);
    expect(tie.winner).toBe(1); // seed 2 beats seed 1 on the draw rule
    expect(tie.byDrawRule).toBe(true);
    expect(tie.upset).toBe(false);
  });

  it('fills the next round from feeder winners with the underdog hosting', () => {
    const cup = mkCup();
    resolveCupTie(cup, 0, 0, 0, 3); // Prem A through
    resolveCupTie(cup, 0, 1, 2, 2); // draw: Chal B through
    const [qf] = fillCupRound(cup, 1);
    expect(qf.home).toBe(3); // Chal B (seed 10) hosts
    expect(qf.away).toBe(0);
    expect(cupUnderdog(cup, 0, 3)).toBe(3);
  });
});

describe('Evo Cup — season integration', () => {
  it('weaves 15 ties between league rounds: R16/QF/SF/Final after rounds 2/4/6/7', () => {
    const league = makeLeague(31);
    const sequence: string[] = [];
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      if (f.cup) expect(league.roundLabel().startsWith('Cup')).toBe(true);
      sequence.push(f.cup ? `C${f.round}` : 'L');
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const expected = [
      ...Array(16).fill('L'), ...Array(8).fill('C0'),
      ...Array(16).fill('L'), ...Array(4).fill('C1'),
      ...Array(16).fill('L'), ...Array(2).fill('C2'),
      ...Array(8).fill('L'), 'C3',
    ];
    expect(sequence).toEqual(expected);
    expect(league.cup!.ties.every((t) => t.played)).toBe(true);
  });

  it('cup ties are standalone: table/aggregates/player stats/Elo byte-identical across them', () => {
    const league = makeLeague(555);
    let cupTies = 0;
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      const result = league.createMatch(f).runToCompletion();
      if (f.cup) {
        cupTies++;
        const before = leagueSnapshot(league);
        league.applyResult(f, result);
        expect(leagueSnapshot(league)).toBe(before);
      } else {
        league.applyResult(f, result);
      }
    }
    expect(cupTies).toBe(15);
    const rec = league.finishSeason();
    // Points timeline stays a pure league artifact: 7 rounds, totals = table.
    for (const t of rec.pointsTimeline!) expect(t.length).toBe(7);
    for (const row of rec.table) expect(rec.pointsTimeline![row.slot][6]).toBe(row.pts);
  });

  it('cup never touches lineage or evolution inputs during the season', () => {
    const league = makeLeague(202);
    const lineages = JSON.stringify(league.franchises.map((f) => f.lineage));
    playSeason(league);
    expect(JSON.stringify(league.franchises.map((f) => f.lineage))).toBe(lineages);
  });

  it('records the winner, runner-up, upsets and top scorer in season history', () => {
    const league = makeLeague(99);
    playSeason(league);
    const finished = league.cup!;
    const rec = league.finishSeason();
    expect(rec.cup).toBeDefined();
    const final = rec.cup!.ties[rec.cup!.ties.length - 1];
    expect(final.round).toBe(CUP_ROUNDS - 1);
    expect(rec.cup!.winnerSlot).toBe(final.winner);
    expect(rec.cup!.winnerName).not.toBe(rec.cup!.runnerUpName);
    expect(rec.cup!.upsets.length).toBe(finished.ties.filter((t) => t.upset).length);
    if (rec.cup!.topScorer) expect(rec.cup!.topScorer.goals).toBeGreaterThan(0);
    // Record mining stays consistent with the record itself.
    expect(cupTitles(league.history).get(rec.cup!.winnerName)).toBe(1);
    expect(giantKillingCounts(league.history).size).toBeGreaterThanOrEqual(0);
    for (const d of domesticDoubles(league.history)) expect(d.name).toBe(rec.championName);
    for (const run of challengerCupRuns(rec.cup!)) expect(run.roundReached).toBeGreaterThanOrEqual(2);
    // The next season is drawn fresh.
    expect(league.cup).not.toBeNull();
    expect(league.cup!.ties.every((t) => !t.played)).toBe(true);
  });

  it('same seed ⇒ same cup champion, tie for tie (and drawn ties obey the underdog rule)', { timeout: 20000 }, () => {
    let drawRuleSeen = 0;
    for (const seed of [3, 11]) {
      const a = makeLeague(seed);
      const b = makeLeague(seed);
      a.cupDrawMode = 'underdog'; // this test pins the classic draw rule
      b.cupDrawMode = 'underdog';
      playSeason(a);
      playSeason(b);
      expect(JSON.stringify(a.cup)).toBe(JSON.stringify(b.cup));
      for (const tie of a.cup!.ties) {
        if (!tie.byDrawRule) continue;
        drawRuleSeen++;
        expect(tie.winner).toBe(cupUnderdog(a.cup!, tie.home, tie.away));
      }
      expect(JSON.stringify(a.finishSeason().cup)).toBe(JSON.stringify(b.finishSeason().cup));
    }
    // 30 s matches draw often — the rule must actually have been exercised.
    expect(drawRuleSeen).toBeGreaterThan(0);
  });

  it('save/load mid-cup roundtrips and replays the future identically', () => {
    const league = makeLeague(77);
    // Into the R16: 16 league fixtures + 3 cup ties.
    for (let i = 0; i < 19; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    expect(league.fixtures.filter((f) => f.cup).length).toBe(8);
    const restored = League.fromJSON(JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>);
    expect(JSON.stringify(restored.cup)).toBe(JSON.stringify(league.cup));
    playSeason(league);
    playSeason(restored);
    expect(JSON.stringify(restored.cup)).toBe(JSON.stringify(league.cup));
    expect(restored.finishSeason().cup).toEqual(league.finishSeason().cup);
  });
});

describe('Evo Cup — v5 migration', () => {
  it('v4 saves load cup-less, finish the season without a cup, then join in', () => {
    const league = makeLeague(99);
    for (let i = 0; i < 14; i++) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const json = JSON.parse(JSON.stringify(league.toJSON())) as Record<string, unknown>;
    expect(json.version).toBe(5);
    json.version = 4;
    delete json.cup;

    const restored = League.fromJSON(json);
    expect(restored.cup).toBeNull();
    while (!restored.seasonDone) {
      const f = restored.nextFixture()!;
      expect(f.cup).toBeUndefined(); // no mid-season cup fabrication
      restored.applyResult(f, restored.createMatch(f).runToCompletion());
    }
    const rec = restored.finishSeason();
    expect(rec.cup).toBeUndefined(); // pre-cup era stays honest

    // The next season draws the first bracket and schedules its ties.
    expect(restored.cup).not.toBeNull();
    playSeason(restored);
    expect(restored.cup!.ties.every((t) => t.played)).toBe(true);
    expect(restored.finishSeason().cup).toBeDefined();
  });

  it('buildCupRecord survives an empty scorer sheet', () => {
    const league = makeLeague(1);
    playSeason(league);
    const cup = league.cup!;
    cup.playerGoals = cup.playerGoals.map(() => [0, 0, 0, 0, 0]);
    expect(buildCupRecord(cup, () => 'x').topScorer).toBeNull();
  });
});
