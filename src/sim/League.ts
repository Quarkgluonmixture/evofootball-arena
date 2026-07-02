import { hashSeed, Rng } from '../utils/rng';
import { evolveFranchises, type EvolutionReport } from '../evolution/evolve';
import { computeFitness, type FitnessBreakdown } from '../evolution/fitness';
import {
  createFranchise, emptyAggregates, type Franchise, type SeasonAggregates,
} from '../evolution/franchise';
import { GENE_KEYS, type GeneKey } from '../evolution/genome';
import { ATTR_KEYS, randomSquad, type AttrKey } from '../evolution/playerGenome';
import { MATCH_DURATION } from './constants';
import { Match } from './Match';
import {
  ROLES, emptyPlayerStats,
  type MatchResult, type PlayerMatchStats, type TeamInfo,
} from './types';

export interface Fixture {
  round: number;
  index: number;
  /** Franchise slots. */
  home: number;
  away: number;
  played: boolean;
  scoreH?: number;
  scoreA?: number;
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
}

export interface SeasonRecord {
  generation: number;
  championSlot: number;
  championName: string;
  table: Array<{
    slot: number; name: string; pts: number; w: number; d: number; l: number;
    gf: number; ga: number; elo?: number;
  }>;
  fitness: Array<FitnessBreakdown & { name: string }>;
  evolution: EvolutionReport;
  /** Post-season additions (optional: absent on records from old saves). */
  awards?: SeasonAwards;
  /** League-average gene values of the population that PLAYED this season. */
  geneMeans?: Record<GeneKey, number>;
  attrMeans?: Record<AttrKey, number>;
  /** Cumulative points per slot after each round (slot-indexed, 7 rounds). */
  pointsTimeline?: number[][];
}

const SAVE_VERSION = 3;

/**
 * Autonomous league: 8 evolving franchises, single round-robin seasons
 * (7 rounds × 4 matches). Fully derived randomness — every match seed is
 * hash(leagueSeed, generation, round, index) — so there is no live RNG state
 * to persist and a saved league replays identically after load.
 */
export class League {
  seed: number;
  generation = 1;
  matchDuration: number;
  franchises: Franchise[] = [];
  fixtures: Fixture[] = [];
  /** Index of the next unplayed fixture. */
  cursor = 0;
  table: TableRow[] = [];
  agg: SeasonAggregates[] = [];
  /** Per-player season totals: [slot][playerIndex 0-4]. */
  playerAgg: PlayerMatchStats[][] = [];
  history: SeasonRecord[] = [];

  constructor(cfg: { seed: number; matchDuration?: number }) {
    this.seed = cfg.seed >>> 0;
    this.matchDuration = cfg.matchDuration ?? MATCH_DURATION;
    const rng = new Rng(hashSeed(this.seed, 0xf0));
    const taken = new Set<string>();
    this.franchises = Array.from({ length: 8 }, (_, i) => createFranchise(i, rng, taken));
    this.startSeason();
  }

  private startSeason(): void {
    this.fixtures = buildRoundRobin(8);
    this.cursor = 0;
    this.table = this.franchises.map((f) => ({
      slot: f.slot, played: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0,
    }));
    this.agg = this.franchises.map(() => emptyAggregates());
    this.playerAgg = this.franchises.map(() => ROLES.map(() => emptyPlayerStats()));
  }

  get seasonDone(): boolean {
    return this.cursor >= this.fixtures.length;
  }

  nextFixture(): Fixture | null {
    return this.seasonDone ? null : this.fixtures[this.cursor];
  }

  currentRound(): number {
    return this.seasonDone ? 7 : this.fixtures[this.cursor].round + 1;
  }

  franchise(slot: number): Franchise {
    return this.franchises.find((f) => f.slot === slot)!;
  }

  teamInfo(slot: number): TeamInfo {
    const f = this.franchise(slot);
    return {
      id: f.id, name: f.name, short: f.short, colors: f.colors,
      playerNames: f.playerNames, genome: f.genome, squad: f.squad,
    };
  }

  /** Build the deterministic Match for a fixture (same seed => same game). */
  createMatch(f: Fixture): Match {
    return new Match({
      seed: hashSeed(this.seed, this.generation, f.round, f.index),
      teamA: this.teamInfo(f.home),
      teamB: this.teamInfo(f.away),
      duration: this.matchDuration,
    });
  }

  applyResult(fixture: Fixture, result: MatchResult): void {
    fixture.played = true;
    fixture.scoreH = result.score[0];
    fixture.scoreA = result.score[1];

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
      // Style sample: pass volume per possession-minute, press volume per
      // opponent-possession-minute — the axes styleConsistency is scored on.
      const possMin = Math.max(s.possessionTime / 60, 0.25);
      const oppPossMin = Math.max(so.possessionTime / 60, 0.25);
      a.styleSamples.push({
        passVol: s.passes / possMin,
        pressVol: (s.tackles + s.interceptions) / oppPossMin,
      });
    }

    // Per-player season totals (gids 0-4 = home slot, 5-9 = away slot).
    for (let gid = 0; gid < result.playerStats.length; gid++) {
      const slot = gid < 5 ? fixture.home : fixture.away;
      const acc = this.playerAgg[slot][gid % 5];
      const s = result.playerStats[gid];
      acc.goals += s.goals;
      acc.assists += s.assists;
      acc.shots += s.shots;
      acc.saves += s.saves;
      acc.recoveries += s.recoveries;
    }

    // Elo (K=28).
    const fh = this.franchise(fixture.home);
    const fa = this.franchise(fixture.away);
    const expected = 1 / (1 + 10 ** ((fa.elo - fh.elo) / 400));
    const actual = sh > sa ? 1 : sh === sa ? 0.5 : 0;
    const delta = 28 * (actual - expected);
    fh.elo += delta;
    fa.elo -= delta;

    this.cursor++;
  }

  standings(): Array<TableRow & { franchise: Franchise }> {
    return this.table
      .map((row) => ({ ...row, franchise: this.franchise(row.slot) }))
      .sort(
        (a, b) =>
          b.pts - a.pts || b.gf - b.ga - (a.gf - a.ga) || b.gf - a.gf || a.slot - b.slot,
      );
  }

  /**
   * Close the season: compute fitness, record history, evolve the population,
   * and schedule the next season. The champion is always protected as elite
   * regardless of its style scores — winning the league must never get a team
   * deleted, or the incentive landscape stops making sense.
   */
  finishSeason(): SeasonRecord {
    const fitness = computeFitness(this.franchises.map((f) => ({ slot: f.slot, agg: this.agg[f.slot] })));
    const fitnessMap = new Map(fitness.map((x) => [x.slot, x.total]));
    const standings = this.standings();
    const champion = standings[0];
    const maxFit = Math.max(...fitnessMap.values());
    fitnessMap.set(champion.slot, maxFit + 0.001);

    const record: SeasonRecord = {
      generation: this.generation,
      championSlot: champion.slot,
      championName: champion.franchise.name,
      table: standings.map((r) => ({
        slot: r.slot, name: r.franchise.name, pts: r.pts, w: r.w, d: r.d, l: r.l, gf: r.gf, ga: r.ga,
        elo: Math.round(r.franchise.elo),
      })),
      fitness: fitness
        .map((x) => ({ ...x, name: this.franchise(x.slot).name }))
        .sort((a, b) => b.total - a.total),
      evolution: undefined as unknown as EvolutionReport,
      awards: this.buildAwards(),
      geneMeans: this.geneMeans(),
      attrMeans: this.attrMeans(),
      pointsTimeline: this.buildPointsTimeline(),
    };

    const evoRng = new Rng(hashSeed(this.seed, this.generation, 0xe0));
    record.evolution = evolveFranchises(this.franchises, fitnessMap, this.generation, evoRng);

    this.history.push(record);
    this.generation++;
    this.startSeason();
    return record;
  }

  /* ---------------- season report inputs ---------------- */

  /** Named player season lines, resolved against current rosters. */
  playerLines(): PlayerSeasonLine[] {
    const lines: PlayerSeasonLine[] = [];
    for (const f of this.franchises) {
      this.playerAgg[f.slot].forEach((s, i) => {
        lines.push({ ...s, slot: f.slot, name: f.playerNames[i] ?? ROLES[i], team: f.name, role: ROLES[i] });
      });
    }
    return lines;
  }

  private buildAwards(): SeasonAwards {
    const lines = this.playerLines();
    const topScorers = [...lines]
      .sort((a, b) => b.goals - a.goals || b.assists - a.assists || a.slot - b.slot)
      .slice(0, 5)
      .filter((l) => l.goals > 0);
    const topAssists = [...lines]
      .sort((a, b) => b.assists - a.assists || b.goals - a.goals || a.slot - b.slot)
      .slice(0, 3)
      .filter((l) => l.assists > 0);
    const keepers = lines.filter((l) => l.role === 'GK').sort((a, b) => b.saves - a.saves || a.slot - b.slot);
    return { topScorers, topAssists, topKeeper: keepers[0] && keepers[0].saves > 0 ? keepers[0] : null };
  }

  private geneMeans(): Record<GeneKey, number> {
    const out = {} as Record<GeneKey, number>;
    for (const k of GENE_KEYS) {
      out[k] = this.franchises.reduce((a, f) => a + f.genome[k], 0) / this.franchises.length;
    }
    return out;
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
    let round = 0;
    for (const f of this.fixtures) {
      if (f.round !== round) {
        for (let s = 0; s < pts.length; s++) timeline[s].push(pts[s]);
        round = f.round;
      }
      if (!f.played || f.scoreH === undefined || f.scoreA === undefined) continue;
      if (f.scoreH > f.scoreA) pts[f.home] += 3;
      else if (f.scoreH === f.scoreA) {
        pts[f.home] += 1;
        pts[f.away] += 1;
      } else pts[f.away] += 3;
    }
    for (let s = 0; s < pts.length; s++) timeline[s].push(pts[s]);
    return timeline;
  }

  /* ---------------- persistence ---------------- */

  toJSON(): object {
    return {
      version: SAVE_VERSION,
      seed: this.seed,
      generation: this.generation,
      matchDuration: this.matchDuration,
      franchises: this.franchises,
      fixtures: this.fixtures,
      cursor: this.cursor,
      table: this.table,
      agg: this.agg,
      playerAgg: this.playerAgg,
      history: this.history,
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
      // v2 -> v3: player season stats didn't exist — start the counters at
      // zero mid-season (awards may undercount this one season; documented).
      data.playerAgg = (data.franchises as Franchise[]).map(() => ROLES.map(() => emptyPlayerStats()));
      data.version = 3;
    }
    if (data.version !== SAVE_VERSION) throw new Error(`Unsupported save version: ${String(data.version)}`);
    const lg = Object.create(League.prototype) as League;
    Object.assign(lg, {
      seed: data.seed,
      generation: data.generation,
      matchDuration: data.matchDuration,
      franchises: data.franchises,
      fixtures: data.fixtures,
      cursor: data.cursor,
      table: data.table,
      agg: data.agg,
      playerAgg: data.playerAgg,
      history: data.history,
    });
    return lg;
  }
}

/** Single round-robin via the circle method: n-1 rounds of n/2 matches. */
export function buildRoundRobin(n: number): Fixture[] {
  const ids = Array.from({ length: n }, (_, i) => i);
  const fixtures: Fixture[] = [];
  for (let r = 0; r < n - 1; r++) {
    for (let i = 0; i < n / 2; i++) {
      const a = ids[i];
      const b = ids[n - 1 - i];
      fixtures.push({
        round: r,
        index: i,
        home: r % 2 === 0 ? a : b,
        away: r % 2 === 0 ? b : a,
        played: false,
      });
    }
    // rotate all but the first
    ids.splice(1, 0, ids.pop()!);
  }
  return fixtures;
}
