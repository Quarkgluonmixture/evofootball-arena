import { hashSeed, Rng } from '../utils/rng';
import {
  CUP_ROUND_SHORT, CUP_SEED_TAG, CUP_SHOOTOUT_TAG, buildCup, buildCupRecord, cupRoundComplete,
  fillCupRound, resolveCupTie, shootoutLineup, type CupDrawMode, type CupRecord, type CupState,
  type ShootoutSquad,
} from './cup';
import {
  developPlayer, emptyCareer, retireChance, rookieAge, veteranAge,
  type LegendEntry, type PlayerCareer,
} from '../evolution/careers';
import { evolveGroup, type EvolutionReport } from '../evolution/evolve';
import { computeFitness, type FitnessBreakdown } from '../evolution/fitness';
import {
  createFranchise, emptyAggregates, type Franchise, type SeasonAggregates,
} from '../evolution/franchise';
import { GENE_KEYS, type GeneKey } from '../evolution/genome';
import { newgenName } from '../evolution/names';
import { ATTR_KEYS, SQUAD_ROLES, randomPlayer, randomSquad, type AttrKey } from '../evolution/playerGenome';
import { MATCH_DURATION } from './constants';
import { Match } from './Match';
import {
  ROLES, TEAM_SIZE, deriveTeamStyle, emptyPlayerStats,
  type MatchResult, type PlayerMatchStats, type TeamInfo,
} from './types';

export type Division = 0 | 1;
export const DIVISION_NAMES = ['Premier Division', 'Challenger Division'] as const;
export const DIVISION_SHORT = ['Premier', 'Challenger'] as const;

export type PromotionMode = 'auto' | 'playoff';

export interface Fixture {
  round: number;
  /** Match index within the division's round (0-3). */
  index: number;
  division: Division;
  /** Franchise slots. */
  home: number;
  away: number;
  played: boolean;
  scoreH?: number;
  scoreA?: number;
  /** Promotion playoff decider (home = Premier 7th, away = Challenger 2nd). */
  playoff?: boolean;
  /** Evo Cup tie: round/index address the bracket; standalone like the playoff. */
  cup?: boolean;
}

export interface TableRow {
  slot: number;
  played: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  pts: number;
}

/** A named player's season line, resolved at record time (players change on rebirth). */
export interface PlayerSeasonLine extends PlayerMatchStats {
  slot: number;
  name: string;
  team: string;
  role: string;
}

export interface SeasonAwards {
  topScorers: PlayerSeasonLine[];
  topAssists: PlayerSeasonLine[];
  topKeeper: PlayerSeasonLine | null;
  /** Most cards this season (reds weighted double); absent pre-Phase-25. */
  dirtiest?: { slot: number; name: string; yellows: number; reds: number } | null;
}

/** A season-end retirement, remembered in the season report (Phase 26). */
export interface RetirementEntry {
  name: string;
  team: string;
  role: string;
  age: number;
  seasons: number;
  goals: number;
  saves: number;
}

export interface SeasonRecord {
  generation: number;
  championSlot: number;
  championName: string;
  d2Champion?: string;
  promoted?: Array<{ slot: number; name: string }>;
  relegated?: Array<{ slot: number; name: string }>;
  table: Array<{
    slot: number; name: string; pts: number; w: number; d: number; l: number;
    gf: number; ga: number; elo?: number; division?: Division;
  }>;
  fitness: Array<FitnessBreakdown & { name: string }>;
  evolution: EvolutionReport;
  /** Playoff decider result, when promotion mode is 'playoff'. */
  playoff?: { homeName: string; awayName: string; score: [number, number]; winnerName: string };
  /** The season's Evo Cup (absent on pre-cup-era records from old saves). */
  cup?: CupRecord;
  /** Post-season additions (optional: absent on records from old saves). */
  awards?: SeasonAwards;
  /** Challenger Division top scorers (top 3). */
  awardsD2?: SeasonAwards;
  /** League-average gene values of the population that PLAYED this season. */
  geneMeans?: Record<GeneKey, number>;
  attrMeans?: Record<AttrKey, number>;
  /** Formation-identity counts of the population that PLAYED this season (Phase 31). */
  styleShares?: { atk: Record<string, number>; def: Record<string, number>; scheme: Record<string, number> };
  /** Players who hung up their boots at season end (Phase 26). */
  retirements?: RetirementEntry[];
  /** Cumulative points per slot after each round (slot-indexed, 7 rounds). */
  pointsTimeline?: number[][];
}

export const SAVE_VERSION = 8;
const TEAMS_PER_DIVISION = 8;
const TOTAL_TEAMS = 16;

/**
 * Evo Cup rounds unlock after this many PLAYED league fixtures — i.e. after
 * league rounds 2 / 4 / 6 / 7 — so the cup weaves through the season and the
 * final lands after the last league round (before any promotion playoff).
 */
const CUP_GATES = [16, 32, 48, 56];

/**
 * The autonomous football pyramid: 16 evolving franchises in two divisions of
 * eight, each playing a single round-robin per season (7 rounds × 4 matches
 * per division, 56 matches total).
 *
 * End of season, in this order:
 *   1. Division fitness + season record (as played).
 *   2. Evolution per division — D1: 2 elite / 6 mutated (its strugglers get
 *      relegated, not killed); D2: promoted pair protected as elite, 3
 *      mutated, bottom-3 REBORN from D1's elite parent pool.
 *   3. Promotion/relegation by TABLE position (sporting merit, not fitness):
 *      bottom-2 of D1 swap with top-2 of D2.
 *
 * Randomness stays fully derived — every match seed is
 * hash(leagueSeed, generation, round, division*4+index) — so saves replay
 * identically after load.
 */
export class League {
  seed: number;
  generation = 1;
  matchDuration: number;
  /**
   * 'auto' (default): Premier bottom-2 swap with Challenger top-2.
   * 'playoff': Premier 8th down, Challenger 1st up, and Premier 7th hosts
   * Challenger 2nd in a one-match decider (a DRAW keeps the Premier side up).
   */
  promotionMode: PromotionMode = 'auto';
  /**
   * How drawn cup ties resolve: 'shootout' (new-league default — seeded
   * penalties, finishing vs reflexes) or 'underdog' (the classic draw rule;
   * also what pre-Phase-22 saves load as).
   */
  cupDrawMode: CupDrawMode = 'shootout';
  franchises: Franchise[] = [];
  fixtures: Fixture[] = [];
  /** Index of the next unplayed fixture. */
  cursor = 0;
  table: TableRow[] = [];
  agg: SeasonAggregates[] = [];
  /** Per-player season totals: [slot][playerIndex 0..TEAM_SIZE-1]. */
  playerAgg: PlayerMatchStats[][] = [];
  history: SeasonRecord[] = [];
  /** This season's Evo Cup; null on migrated saves until the next season starts. */
  cup: CupState | null = null;
  /** All-time greats, recorded at retirement (top 20 by career goals; Phase 26). */
  legends: LegendEntry[] = [];

  constructor(cfg: { seed: number; matchDuration?: number }) {
    this.seed = cfg.seed >>> 0;
    this.matchDuration = cfg.matchDuration ?? MATCH_DURATION;
    const rng = new Rng(hashSeed(this.seed, 0xf0));
    const taken = new Set<string>();
    this.franchises = Array.from({ length: TOTAL_TEAMS }, (_, i) =>
      createFranchise(i, rng, taken, i < TEAMS_PER_DIVISION ? 0 : 1),
    );
    this.startSeason();
  }

  division(d: Division): Franchise[] {
    return this.franchises.filter((f) => f.division === d);
  }

  private startSeason(): void {
    this.fixtures = [];
    // Interleave rounds so watching the league alternates divisions naturally.
    const perDiv = ([0, 1] as Division[]).map((d) =>
      buildDivisionFixtures(this.division(d).map((f) => f.slot), d),
    );
    for (let r = 0; r < TEAMS_PER_DIVISION - 1; r++) {
      for (const list of perDiv) this.fixtures.push(...list.filter((f) => f.round === r));
    }
    this.cursor = 0;
    this.table = this.franchises.map((f) => ({
      slot: f.slot, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
    }));
    this.agg = this.franchises.map(() => emptyAggregates());
    this.playerAgg = this.franchises.map(() => ROLES.map(() => emptyPlayerStats()));
    this.cup = buildCup(this.franchises, this.seed, this.generation);
  }

  get seasonDone(): boolean {
    this.ensureCupFixtures();
    this.ensurePlayoffFixture();
    return this.cursor >= this.fixtures.length;
  }

  nextFixture(): Fixture | null {
    return this.seasonDone ? null : this.fixtures[this.cursor];
  }

  /**
   * Schedule the next unlocked cup round by splicing its ties in at the
   * cursor (i.e. right after the league round that unlocked it). Idempotent
   * and save-safe: the bracket lives in `this.cup`; fixtures only mirror it.
   */
  private ensureCupFixtures(): void {
    if (!this.cup) return; // migrated mid-season save: cup starts next season
    const leaguePlayed = this.fixtures.reduce(
      (n, f) => n + (!f.cup && !f.playoff && f.played ? 1 : 0), 0,
    );
    for (let round = 0; round < CUP_GATES.length; round++) {
      if (this.fixtures.some((f) => f.cup && f.round === round)) continue; // scheduled
      if (leaguePlayed < CUP_GATES[round]) return;
      if (round > 0 && !cupRoundComplete(this.cup, round - 1)) return;
      const ties = round === 0
        ? this.cup.ties.filter((t) => t.round === 0)
        : fillCupRound(this.cup, round);
      this.fixtures.splice(this.cursor, 0, ...ties.map((t) => ({
        round: t.round, index: t.index, division: 0 as Division,
        home: t.home, away: t.away, played: false, cup: true,
      })));
      return;
    }
  }

  /** In playoff mode, append the decider once the regular season is complete. */
  private ensurePlayoffFixture(): void {
    if (this.promotionMode !== 'playoff') return;
    if (this.fixtures.some((f) => f.playoff)) return;
    if (this.cursor < this.fixtures.length) return;
    const seventh = this.standings(0)[6];
    const second = this.standings(1)[1];
    this.fixtures.push({
      round: TEAMS_PER_DIVISION - 1, // "round 8": seed hash stays unique
      index: 0,
      division: 0,
      home: seventh.slot,
      away: second.slot,
      played: false,
      playoff: true,
    });
  }

  currentRound(): number {
    return this.seasonDone ? TEAMS_PER_DIVISION - 1 : this.fixtures[this.cursor].round + 1;
  }

  /** Human label for the upcoming fixture: league round, cup round or playoff. */
  roundLabel(): string {
    const f = this.nextFixture();
    if (f?.cup) return `Cup ${CUP_ROUND_SHORT[f.round]}`;
    if (f?.playoff) return 'Playoff';
    return `Round ${this.currentRound()}/${TEAMS_PER_DIVISION - 1}`;
  }

  franchise(slot: number): Franchise {
    return this.franchises.find((f) => f.slot === slot)!;
  }

  teamInfo(slot: number): TeamInfo {
    const f = this.franchise(slot);
    return {
      id: f.id, name: f.name, short: f.short, colors: f.colors,
      playerNames: f.playerNames, genome: f.genome, squad: f.squad,
      ages: f.ages, style: f.style,
    };
  }

  /** Build the deterministic Match for a fixture (same seed => same game). */
  createMatch(f: Fixture): Match {
    return new Match({
      seed: f.cup
        ? hashSeed(this.seed, this.generation, CUP_SEED_TAG + f.round, f.index)
        : hashSeed(this.seed, this.generation, f.round, f.division * 4 + f.index),
      teamA: this.teamInfo(f.home),
      teamB: this.teamInfo(f.away),
      duration: this.matchDuration,
    });
  }

  /**
   * The shootout inputs a drawn cup tie will resolve with (mode 'shootout'):
   * lineups from squad DNA and a fresh derived-seed Rng. Pure and stateless —
   * `applyResult` consumes it, and the presentation layer calls it again to
   * replay the identical kick sequence (same seed ⇒ same shootout).
   */
  shootoutContext(fixture: Fixture): { home: ShootoutSquad; away: ShootoutSquad; rng: Rng } | undefined {
    if (this.cupDrawMode !== 'shootout') return undefined;
    return {
      home: shootoutLineup(this.franchise(fixture.home).squad),
      away: shootoutLineup(this.franchise(fixture.away).squad),
      rng: new Rng(hashSeed(this.seed, this.generation, CUP_SHOOTOUT_TAG + fixture.round, fixture.index)),
    };
  }

  applyResult(fixture: Fixture, result: MatchResult): void {
    fixture.played = true;
    fixture.scoreH = result.score[0];
    fixture.scoreA = result.score[1];

    // The playoff is a standalone decider: no table/stats/Elo bookkeeping.
    if (fixture.playoff) {
      this.cursor++;
      return;
    }

    // Cup ties are standalone too: resolve the bracket (draws send the
    // underdog through) and track cup-only scorer stats — nothing here may
    // touch the table, Elo, season aggregates or fitness.
    if (fixture.cup) {
      if (this.cup) {
        // Drawn ties: seeded shootout in 'shootout' mode (its own derived
        // seed — never the match's rng), underdog rule otherwise.
        resolveCupTie(this.cup, fixture.round, fixture.index, result.score[0], result.score[1], this.shootoutContext(fixture));
        for (let gid = 0; gid < result.playerStats.length; gid++) {
          const slot = gid < TEAM_SIZE ? fixture.home : fixture.away;
          this.cup.playerGoals[slot][gid % TEAM_SIZE] += result.playerStats[gid].goals;
        }
      }
      this.cursor++;
      return;
    }

    const rows = [this.table[fixture.home], this.table[fixture.away]];
    const [sh, sa] = result.score;
    for (const [i, row] of rows.entries()) {
      const gf = i === 0 ? sh : sa;
      const ga = i === 0 ? sa : sh;
      row.played++;
      row.gf += gf;
      row.ga += ga;
      if (gf > ga) {
        row.w++;
        row.pts += 3;
      } else if (gf === ga) {
        row.d++;
        row.pts += 1;
      } else {
        row.l++;
      }
    }

    // Season aggregates for fitness.
    const slots = [fixture.home, fixture.away];
    for (const [i, slot] of slots.entries()) {
      const s = result.stats[i as 0 | 1];
      const so = result.stats[(1 - i) as 0 | 1];
      const a = this.agg[slot];
      a.played++;
      const gf = i === 0 ? sh : sa;
      const ga = i === 0 ? sa : sh;
      a.gf += gf;
      a.ga += ga;
      if (gf > ga) {
        a.wins++;
        a.pts += 3;
      } else if (gf === ga) {
        a.draws++;
        a.pts += 1;
      } else a.losses++;
      a.shots += s.shots;
      a.xg += s.xg;
      a.passes += s.passes;
      a.passesCompleted += s.passesCompleted;
      a.recoveries += s.interceptions + s.tackles;
      a.staminaSpent += s.staminaSpent;
      a.distance += s.distance;
      a.yellows += s.yellows;
      a.reds += s.reds;
      const possMin = Math.max(s.possessionTime / 60, 0.25);
      const oppPossMin = Math.max(so.possessionTime / 60, 0.25);
      a.styleSamples.push({
        passVol: s.passes / possMin,
        pressVol: (s.tackles + s.interceptions) / oppPossMin,
      });
    }

    // Per-player season totals (home gids first, then away — TEAM_SIZE each).
    for (let gid = 0; gid < result.playerStats.length; gid++) {
      const slot = gid < TEAM_SIZE ? fixture.home : fixture.away;
      const acc = this.playerAgg[slot][gid % TEAM_SIZE];
      const s = result.playerStats[gid];
      acc.goals += s.goals;
      acc.assists += s.assists;
      acc.shots += s.shots;
      acc.saves += s.saves;
      acc.recoveries += s.recoveries;
    }

    // Elo (K=28) — a single ladder across both divisions.
    const fh = this.franchise(fixture.home);
    const fa = this.franchise(fixture.away);
    const expected = 1 / (1 + 10 ** ((fa.elo - fh.elo) / 400));
    const actual = sh > sa ? 1 : sh === sa ? 0.5 : 0;
    const delta = 28 * (actual - expected);
    fh.elo += delta;
    fa.elo -= delta;

    this.cursor++;
  }

  standings(division: Division): Array<TableRow & { franchise: Franchise }> {
    return this.table
      .map((row) => ({ ...row, franchise: this.franchise(row.slot) }))
      .filter((r) => r.franchise.division === division)
      .sort(
        (a, b) =>
          b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.slot - b.slot,
      );
  }

  /**
   * Close the season: record → evolve per division → promote/relegate.
   * The D1 champion and the promoted D2 pair are always protected as elite.
   */
  finishSeason(): SeasonRecord {
    const eps = 0.001;
    // Careers bank the season BEFORE evolution can rebirth a squad away
    // (a reborn club's players vanish with their ledgers — that's the point).
    for (const f of this.franchises) {
      this.playerAgg[f.slot].forEach((s, i) => {
        const c = f.careers[i];
        c.seasons++;
        c.goals += s.goals;
        c.assists += s.assists;
        c.saves += s.saves;
        c.recoveries += s.recoveries;
      });
    }
    const standings1 = this.standings(0);
    const standings2 = this.standings(1);

    const fitnessFor = (d: Division) =>
      computeFitness(this.division(d).map((f) => ({ slot: f.slot, agg: this.agg[f.slot] })));
    const fit1 = fitnessFor(0);
    const fit2 = fitnessFor(1);
    const map1 = new Map(fit1.map((x) => [x.slot, x.total]));
    const map2 = new Map(fit2.map((x) => [x.slot, x.total]));

    // Who goes up and down. 'auto': straight top/bottom-2 swap. 'playoff':
    // 8th down + 1st up automatically, 7th-vs-2nd decider for the last spot
    // (a draw keeps the Premier side up).
    let promoted: typeof standings2;
    let relegated: typeof standings1;
    let playoffResult: SeasonRecord['playoff'];
    if (this.promotionMode === 'playoff') {
      const decider = this.fixtures.find((f) => f.playoff && f.played);
      relegated = [standings1[7]];
      promoted = [standings2[0]];
      if (decider && decider.scoreH !== undefined && decider.scoreA !== undefined) {
        const challengerWon = decider.scoreA > decider.scoreH;
        const homeF = this.franchise(decider.home);
        const awayF = this.franchise(decider.away);
        playoffResult = {
          homeName: homeF.name,
          awayName: awayF.name,
          score: [decider.scoreH, decider.scoreA],
          winnerName: challengerWon ? awayF.name : homeF.name,
        };
        if (challengerWon) {
          relegated = [...relegated, standings1[6]];
          promoted = [...promoted, standings2[1]];
        }
      }
    } else {
      promoted = standings2.slice(0, 2);
      relegated = standings1.slice(-2);
    }

    // Protections: the champion, and the promoted team(s) (they earned it on
    // the pitch — evolution must not delete them on style grounds).
    map1.set(standings1[0].slot, Math.max(...map1.values()) + eps);
    for (const p of [...promoted].reverse()) {
      map2.set(p.slot, Math.max(...map2.values()) + eps);
    }

    const record: SeasonRecord = {
      generation: this.generation,
      championSlot: standings1[0].slot,
      championName: standings1[0].franchise.name,
      d2Champion: standings2[0].franchise.name,
      promoted: promoted.map((r) => ({ slot: r.slot, name: r.franchise.name })),
      relegated: relegated.map((r) => ({ slot: r.slot, name: r.franchise.name })),
      playoff: playoffResult,
      table: [...standings1, ...standings2].map((r) => ({
        slot: r.slot, name: r.franchise.name, pts: r.pts, w: r.w, d: r.d, l: r.l,
        gf: r.gf, ga: r.ga, elo: Math.round(r.franchise.elo),
        division: r.franchise.division,
      })),
      fitness: [...fit1, ...fit2]
        .map((x) => ({ ...x, name: this.franchise(x.slot).name }))
        .sort((a, b) => b.total - a.total),
      evolution: undefined as unknown as EvolutionReport,
      cup: this.cup && cupRoundComplete(this.cup, 3)
        ? buildCupRecord(this.cup, (slot, i) => this.franchise(slot).playerNames[i] ?? ROLES[i])
        : undefined,
      awards: this.buildAwards(0),
      awardsD2: this.buildAwards(1),
      geneMeans: this.geneMeans(),
      attrMeans: this.attrMeans(),
      styleShares: this.styleShares(),
      pointsTimeline: this.buildPointsTimeline(),
    };

    // Evolution per division. D2's reborn slots draw parents from D1's best.
    const evoRng = new Rng(hashSeed(this.seed, this.generation, 0xe0));
    const taken = new Set(this.franchises.map((f) => f.name));
    const d1 = this.division(0);
    const d2 = this.division(1);
    const d1Ranked = [...d1].sort((a, b) => (map1.get(b.slot) ?? 0) - (map1.get(a.slot) ?? 0));
    // Zonal ecology budget (Phase 31): one shared counter for both division
    // passes — zonal stays the RARE identity (~4 of 16) no matter which
    // channel (mutation or rebirth inheritance) tries to spread it.
    const zonalCount = this.franchises.filter((f) => f.style.scheme === 'zonal').length;
    const zonal = { room: Math.max(0, 4 - zonalCount) };
    const entries = [
      ...evolveGroup(d1, map1, this.generation, evoRng, { eliteN: 2, rebornN: 0, zonal }, taken),
      ...evolveGroup(
        d2, map2, this.generation, evoRng,
        { eliteN: 2, rebornN: 3, parentPool: d1Ranked, zonal },
        taken,
      ),
    ];
    record.evolution = { generation: this.generation + 1, entries };

    // Careers pass (Phase 26): everyone still at their club ages a year,
    // develops along the age curve, and may retire — replaced by a newgen.
    // Reborn squads are brand-new people and sit this generation out.
    const rebornSlots = new Set(entries.filter((e) => e.kind === 'reborn').map((e) => e.slot));
    const ageRng = new Rng(hashSeed(this.seed, this.generation, 0xa9));
    const retirements: RetirementEntry[] = [];
    for (const f of this.franchises) {
      if (rebornSlots.has(f.slot)) continue;
      for (let i = 0; i < f.squad.length; i++) {
        f.ages[i]++;
        f.squad[i] = developPlayer(f.squad[i], f.ages[i], ageRng);
        if (ageRng.chance(retireChance(f.ages[i]))) {
          const career = f.careers[i];
          retirements.push({
            name: f.playerNames[i] ?? ROLES[i],
            team: f.name,
            role: ROLES[i],
            age: f.ages[i],
            seasons: career.seasons,
            goals: career.goals,
            saves: career.saves,
          });
          this.recordLegend(f, i, career);
          f.playerNames[i] = newgenName(ageRng, f.playerNames);
          f.squad[i] = randomPlayer(ageRng, SQUAD_ROLES[i]);
          f.ages[i] = rookieAge(ageRng);
          f.careers[i] = emptyCareer();
        }
      }
    }
    record.retirements = retirements;

    // Promotion & relegation by table position.
    for (const r of relegated) {
      const f = this.franchise(r.slot);
      f.division = 1;
      f.lineage.push({ generation: this.generation + 1, event: 'relegated' });
    }
    for (const r of promoted) {
      const f = this.franchise(r.slot);
      f.division = 0;
      f.lineage.push({ generation: this.generation + 1, event: 'promoted' });
    }

    this.history.push(record);
    this.generation++;
    this.startSeason();
    return record;
  }

  /** Keep the best retirees forever: top 20 by career goals (saves, then seasons break ties). */
  private recordLegend(f: Franchise, i: number, career: PlayerCareer): void {
    this.legends.push({
      name: f.playerNames[i] ?? ROLES[i],
      team: f.name,
      role: ROLES[i],
      age: f.ages[i],
      career: { ...career },
    });
    this.legends.sort(
      (a, b) =>
        b.career.goals - a.career.goals ||
        b.career.saves - a.career.saves ||
        b.career.seasons - a.career.seasons ||
        a.name.localeCompare(b.name),
    );
    this.legends = this.legends.slice(0, 20);
  }

  /* ---------------- season report inputs ---------------- */

  /** Named player season lines, resolved against current rosters. */
  playerLines(division?: Division): PlayerSeasonLine[] {
    const lines: PlayerSeasonLine[] = [];
    for (const f of this.franchises) {
      if (division !== undefined && f.division !== division) continue;
      this.playerAgg[f.slot].forEach((s, i) => {
        lines.push({ ...s, slot: f.slot, name: f.playerNames[i] ?? ROLES[i], team: f.name, role: ROLES[i] });
      });
    }
    return lines;
  }

  private buildAwards(division: Division): SeasonAwards {
    const lines = this.playerLines(division);
    const topScorers = [...lines]
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.slot - b.slot)
      .slice(0, 5)
      .filter((l) => l.goals > 0);
    const topAssists = [...lines]
      .sort((a, b) => b.assists - a.assists || b.goals - a.goals || a.slot - b.slot)
      .slice(0, 3)
      .filter((l) => l.assists > 0);
    const keepers = lines.filter((l) => l.role === 'GK').sort((a, b) => b.saves - a.saves || a.slot - b.slot);
    let dirtiest: SeasonAwards['dirtiest'] = null;
    for (const f of this.franchises) {
      if (f.division !== division) continue;
      const a = this.agg[f.slot];
      const score = a.yellows + a.reds * 2;
      if (score > 0 && (!dirtiest || score > dirtiest.yellows + dirtiest.reds * 2)) {
        dirtiest = { slot: f.slot, name: f.name, yellows: a.yellows, reds: a.reds };
      }
    }
    return {
      topScorers,
      topAssists,
      topKeeper: keepers[0] && keepers[0].saves > 0 ? keepers[0] : null,
      dirtiest,
    };
  }

  private geneMeans(): Record<GeneKey, number> {
    const out = {} as Record<GeneKey, number>;
    for (const k of GENE_KEYS) {
      out[k] = this.franchises.reduce((a, f) => a + f.genome[k], 0) / this.franchises.length;
    }
    return out;
  }

  /** Formation-identity counts across the 16 clubs (Phase 31 — the
   * Evolution tab's share strips read these per generation). */
  private styleShares(): { atk: Record<string, number>; def: Record<string, number>; scheme: Record<string, number> } {
    const atk: Record<string, number> = {};
    const def: Record<string, number> = {};
    const scheme: Record<string, number> = {};
    for (const f of this.franchises) {
      atk[f.style.formationAtk] = (atk[f.style.formationAtk] ?? 0) + 1;
      def[f.style.formationDef] = (def[f.style.formationDef] ?? 0) + 1;
      scheme[f.style.scheme] = (scheme[f.style.scheme] ?? 0) + 1;
    }
    return { atk, def, scheme };
  }

  private attrMeans(): Record<AttrKey, number> {
    const out = {} as Record<AttrKey, number>;
    for (const k of ATTR_KEYS) {
      let sum = 0;
      let n = 0;
      for (const f of this.franchises) {
        for (const p of f.squad) {
          sum += p[k];
          n++;
        }
      }
      out[k] = sum / Math.max(n, 1);
    }
    return out;
  }

  /** Cumulative points per slot after each round — derived from fixtures. */
  private buildPointsTimeline(): number[][] {
    const timeline: number[][] = this.franchises.map(() => []);
    const pts = this.franchises.map(() => 0);
    for (let r = 0; r < TEAMS_PER_DIVISION - 1; r++) {
      for (const f of this.fixtures) {
        // Cup ties reuse low round numbers and award no points — league only.
        if (f.cup || f.playoff) continue;
        if (f.round !== r || !f.played || f.scoreH === undefined || f.scoreA === undefined) continue;
        if (f.scoreH > f.scoreA) pts[f.home] += 3;
        else if (f.scoreH === f.scoreA) {
          pts[f.home] += 1;
          pts[f.away] += 1;
        } else pts[f.away] += 3;
      }
      for (let s = 0; s < pts.length; s++) timeline[s].push(pts[s]);
    }
    return timeline;
  }

  /* ---------------- persistence ---------------- */

  toJSON(): object {
    return {
      version: SAVE_VERSION,
      seed: this.seed,
      generation: this.generation,
      matchDuration: this.matchDuration,
      promotionMode: this.promotionMode,
      cupDrawMode: this.cupDrawMode,
      franchises: this.franchises,
      fixtures: this.fixtures,
      cursor: this.cursor,
      table: this.table,
      agg: this.agg,
      playerAgg: this.playerAgg,
      history: this.history,
      cup: this.cup,
      legends: this.legends,
    };
  }

  static fromJSON(data: Record<string, unknown>): League {
    if (data.version === 1) {
      // v1 -> v2: squads didn't exist yet — deal every franchise a fresh,
      // seed-derived squad so old leagues keep their tactical history.
      for (const f of data.franchises as Franchise[]) {
        f.squad = randomSquad(new Rng(hashSeed(Number(data.seed), f.slot, 0xa7)));
      }
      data.version = 2;
    }
    if (data.version === 2) {
      // v2 -> v3: player season stats didn't exist — start the counters at zero.
      data.playerAgg = (data.franchises as Franchise[]).map(() => ROLES.map(() => emptyPlayerStats()));
      data.version = 3;
    }
    if (data.version === 3) {
      // v3 -> v4: the single 8-team division becomes Division 1, and a brand
      // new Division 2 spawns beneath it. The current season's D1 fixtures
      // (and results) are preserved; fresh D2 fixtures are appended.
      const franchises = data.franchises as Franchise[];
      for (const f of franchises) f.division = 0;
      const rng = new Rng(hashSeed(Number(data.seed), Number(data.generation), 0xd2));
      const taken = new Set(franchises.map((f) => f.name));
      const newcomers: Franchise[] = [];
      for (let slot = franchises.length; slot < TOTAL_TEAMS; slot++) {
        newcomers.push(createFranchise(slot, rng, taken, 1, Number(data.generation)));
      }
      data.franchises = [...franchises, ...newcomers];
      (data.table as TableRow[]).push(
        ...newcomers.map((f) => ({ slot: f.slot, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 })),
      );
      (data.agg as SeasonAggregates[]).push(...newcomers.map(() => emptyAggregates()));
      (data.playerAgg as PlayerMatchStats[][]).push(
        ...newcomers.map(() => ROLES.map(() => emptyPlayerStats())),
      );
      for (const f of data.fixtures as Fixture[]) f.division = 0;
      (data.fixtures as Fixture[]).push(
        ...buildDivisionFixtures(newcomers.map((f) => f.slot), 1),
      );
      data.version = 4;
    }
    if (data.version === 4) {
      // v4 -> v5: the Evo Cup arrives. The in-progress season has no cup
      // fixtures scheduled, so it finishes cup-less (pre-cup era); the next
      // startSeason draws the first bracket. Never fabricate old cup history.
      data.cup = null;
      data.version = 5;
    }
    if (data.version === 5) {
      // v5 -> v6: cards arrive (Phase 25). Season aggregates gain card
      // tallies — the in-progress season simply starts counting from here.
      for (const a of data.agg as Array<Record<string, unknown>>) {
        a.yellows ??= 0;
        a.reds ??= 0;
      }
      data.version = 6;
    }
    if (data.version === 6) {
      // v6 -> v7: player careers (Phase 26). Existing squads get seeded ages
      // spanning the career arc; ledgers start blank from here — never
      // fabricate career history that wasn't simulated.
      const rng = new Rng(hashSeed(Number(data.seed), 0xa9));
      for (const f of data.franchises as Franchise[]) {
        // Squad-length-driven, NOT SQUAD_ROLES-driven: this migration must
        // produce era-correct (5-slot) data even though the constant has
        // since grown to 6 (Phase 30) — v7→v8 is where the 6th slot appears.
        f.ages = f.squad.map(() => veteranAge(rng));
        f.careers = f.squad.map(() => emptyCareer());
      }
      data.legends = [];
      data.version = 7;
    }
    if (data.version === 7) {
      // v7 -> v8: 6v6 (Phase 30). Every club signs a second winger — a
      // generated WG newgen spliced in at slot 4 (between the old WG, now
      // WGL, and the striker, who moves to slot 5). Old saves keep playing;
      // their remaining fixtures are simply contested six-a-side. Every
      // splice is length-guarded: franchises minted by EARLIER migrations
      // (v1→v2 squads, v3→v4 Division 2 newcomers) already used today's
      // 6-slot generators and must not grow a 7th player.
      const rng = new Rng(hashSeed(Number(data.seed), 0xb8));
      for (const f of data.franchises as Franchise[]) {
        if (f.squad.length < TEAM_SIZE) f.squad.splice(4, 0, randomPlayer(rng, 'WG'));
        if (f.playerNames.length < TEAM_SIZE) f.playerNames.splice(4, 0, newgenName(rng, f.playerNames));
        if (f.ages.length < TEAM_SIZE) f.ages.splice(4, 0, rookieAge(rng));
        if (f.careers.length < TEAM_SIZE) f.careers.splice(4, 0, emptyCareer());
      }
      // Mid-season counters grow a sixth row; the newcomer starts at zero.
      for (const arr of data.playerAgg as PlayerMatchStats[][]) {
        if (arr.length < TEAM_SIZE) arr.splice(4, 0, emptyPlayerStats());
      }
      const cup = data.cup as CupState | null | undefined;
      if (cup) for (const goals of cup.playerGoals) {
        if (goals.length < TEAM_SIZE) goals.splice(4, 0, 0);
      }
      // The formation system arrives with 6v6: backfill every club's
      // tactical identity from its genome (the same derivation creation
      // uses, so a loaded club looks like a freshly created one).
      for (const f of data.franchises as Franchise[]) {
        f.style ??= deriveTeamStyle(f.genome);
      }
      data.version = 8;
    }
    if (data.version !== SAVE_VERSION) throw new Error(`Unsupported save version: ${String(data.version)}`);
    const lg = Object.create(League.prototype) as League;
    Object.assign(lg, {
      seed: data.seed,
      generation: data.generation,
      matchDuration: data.matchDuration,
      promotionMode: data.promotionMode ?? 'auto',
      // Pre-Phase-22 saves keep the behavior they were built with.
      cupDrawMode: data.cupDrawMode ?? 'underdog',
      franchises: data.franchises,
      fixtures: data.fixtures,
      cursor: data.cursor,
      table: data.table,
      agg: data.agg,
      playerAgg: data.playerAgg,
      history: data.history,
      cup: data.cup ?? null,
      legends: data.legends ?? [],
    });
    return lg;
  }
}

/** Single round-robin via the circle method: n-1 rounds of n/2 pairings. */
export function buildRoundRobin(n: number): Array<{ round: number; index: number; home: number; away: number }> {
  const ids = Array.from({ length: n }, (_, i) => i);
  const out: Array<{ round: number; index: number; home: number; away: number }> = [];
  for (let r = 0; r < n - 1; r++) {
    for (let i = 0; i < n / 2; i++) {
      const a = ids[i];
      const b = ids[n - 1 - i];
      out.push({ round: r, index: i, home: r % 2 === 0 ? a : b, away: r % 2 === 0 ? b : a });
    }
    ids.splice(1, 0, ids.pop()!);
  }
  return out;
}

/** Map a division's member slots onto a round-robin schedule. */
export function buildDivisionFixtures(memberSlots: number[], division: Division): Fixture[] {
  return buildRoundRobin(memberSlots.length).map((p) => ({
    round: p.round,
    index: p.index,
    division,
    home: memberSlots[p.home],
    away: memberSlots[p.away],
    played: false,
  }));
}
