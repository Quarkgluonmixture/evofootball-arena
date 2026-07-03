import type { Franchise } from '../evolution/franchise';
import { hashSeed, Rng } from '../utils/rng';
import type { Division } from './League';

/**
 * The Evo Cup: a deterministic single-elimination knockout across both
 * divisions, woven between league rounds. Pure bracket logic lives here so
 * it is unit-testable; the League owns the state and the fixture scheduling.
 *
 * Rules (all deterministic, no live RNG state):
 *  - 16 entrants (all of Premier + Challenger), seeded 1–16 at draw time:
 *    Premier 1–8 by Elo, Challenger 9–16 by Elo. Higher number = underdog.
 *  - The R16 draw pairs every Premier side against a Challenger side
 *    (hash-shuffled), with Premier seeds placed so top seeds meet late.
 *  - The underdog hosts every tie — the cup loves an upset.
 *  - A DRAWN tie sends the LOWER-DIVISION (else lower-seeded) team through:
 *    no extra time, no penalties — the engine stays untouched and the rule
 *    is surfaced in the UI/records via `byDrawRule`.
 *  - Cup ties are standalone: no league table/Elo/season-stat/fitness
 *    bookkeeping (same pattern as the promotion playoff decider).
 */

export const CUP_NAME = 'Evo Cup';
export const CUP_ROUNDS = 4;
export const CUP_ROUND_NAMES = ['Round of 16', 'Quarter-final', 'Semi-final', 'Final'] as const;
export const CUP_ROUND_SHORT = ['R16', 'QF', 'SF', 'Final'] as const;
/** Seed-derivation tag: cup match seed = hash(leagueSeed, generation, 0xC0 + round, index). */
export const CUP_SEED_TAG = 0xc0;
/** The R16 draw shuffle uses hash(leagueSeed, generation, 0xC5). */
export const CUP_DRAW_TAG = 0xc5;

export interface CupEntrant {
  slot: number;
  /** Name at draw time — history views stay honest across later renames. */
  name: string;
  division: Division;
  /** 1–16; Premier 1–8, Challenger 9–16, by Elo at draw time. Higher = underdog. */
  seed: number;
  /** Elo at draw time (rounded), for bracket display. */
  elo: number;
}

export interface CupTie {
  round: number; // 0 = R16, 1 = QF, 2 = SF, 3 = Final
  index: number; // within the round
  /** Franchise slots; -1 until the feeder ties resolve. The underdog hosts. */
  home: number;
  away: number;
  played: boolean;
  scoreH?: number;
  scoreA?: number;
  winner?: number; // slot
  /** Giant killing: the lower-division side knocked out a higher-division side. */
  upset?: boolean;
  /** The tie ended level and the draw rule (underdog advances) decided it. */
  byDrawRule?: boolean;
}

export interface CupState {
  entrants: CupEntrant[]; // 16
  /** 15 ties in bracket order: R16 0–7, QF 0–3, SF 0–1, Final 0. */
  ties: CupTie[];
  /** Cup goals per [slot][playerIndex 0–4] — cup-only, never enters fitness. */
  playerGoals: number[][];
}

/** SeasonRecord entry: the completed bracket plus mined story data. */
export interface CupRecord {
  winnerSlot: number;
  winnerName: string;
  runnerUpName: string;
  entrants: CupEntrant[];
  ties: CupTie[];
  /** Giant killings, in bracket order. */
  upsets: Array<{ round: number; winnerName: string; loserName: string; score: [number, number] }>;
  topScorer: { name: string; team: string; goals: number } | null;
}

/** Bracket placement of Premier seeds 1..8 so 1 and 2 can only meet in the final. */
const PREMIER_BRACKET_ORDER = [0, 7, 3, 4, 1, 6, 2, 5];

/**
 * Draw the cup at season start. Seeding uses Elo as of the draw (ties broken
 * by slot); the Challenger opponents are shuffled with a hashed seed so every
 * league/generation gets its own draw.
 */
export function buildCup(franchises: Franchise[], leagueSeed: number, generation: number): CupState {
  const byElo = (d: Division) =>
    franchises
      .filter((f) => f.division === d)
      .sort((a, b) => b.elo - a.elo || a.slot - b.slot);
  const premier = byElo(0);
  const challenger = byElo(1);
  const entrants: CupEntrant[] = [...premier, ...challenger].map((f, i) => ({
    slot: f.slot,
    name: f.name,
    division: f.division,
    seed: i + 1,
    elo: Math.round(f.elo),
  }));

  const rng = new Rng(hashSeed(leagueSeed, generation, CUP_DRAW_TAG));
  const drawnChallengers = rng.shuffle([...challenger]);

  const ties: CupTie[] = [];
  for (let i = 0; i < 8; i++) {
    ties.push({
      round: 0,
      index: i,
      // Every R16 tie is Premier vs Challenger; the underdog (Challenger) hosts.
      home: drawnChallengers[i].slot,
      away: premier[PREMIER_BRACKET_ORDER[i]].slot,
      played: false,
    });
  }
  for (let round = 1; round < CUP_ROUNDS; round++) {
    for (let index = 0; index < 8 >> round; index++) {
      ties.push({ round, index, home: -1, away: -1, played: false });
    }
  }
  return {
    entrants,
    ties,
    playerGoals: franchises.map(() => [0, 0, 0, 0, 0]),
  };
}

export function cupTie(cup: CupState, round: number, index: number): CupTie {
  return cup.ties.find((t) => t.round === round && t.index === index)!;
}

export function cupEntrant(cup: CupState, slot: number): CupEntrant {
  return cup.entrants.find((e) => e.slot === slot)!;
}

/** The underdog of a pairing: higher seed number (lower division always is). */
export function cupUnderdog(cup: CupState, slotA: number, slotB: number): number {
  return cupEntrant(cup, slotA).seed > cupEntrant(cup, slotB).seed ? slotA : slotB;
}

/**
 * Apply a tie's final score: pick the winner (draw → underdog advances) and
 * flag giant killings. Returns the resolved tie.
 */
export function resolveCupTie(cup: CupState, round: number, index: number, scoreH: number, scoreA: number): CupTie {
  const tie = cupTie(cup, round, index);
  tie.played = true;
  tie.scoreH = scoreH;
  tie.scoreA = scoreA;
  if (scoreH !== scoreA) {
    tie.winner = scoreH > scoreA ? tie.home : tie.away;
  } else {
    tie.byDrawRule = true;
    tie.winner = cupUnderdog(cup, tie.home, tie.away);
  }
  const loser = tie.winner === tie.home ? tie.away : tie.home;
  tie.upset = cupEntrant(cup, tie.winner).division > cupEntrant(cup, loser).division;
  return tie;
}

/** True once every tie of `round` has been played. */
export function cupRoundComplete(cup: CupState, round: number): boolean {
  return cup.ties.filter((t) => t.round === round).every((t) => t.played);
}

/**
 * Fill the ties of `round` from the previous round's winners (bracket order:
 * tie i takes the winners of feeders 2i and 2i+1). The underdog hosts.
 */
export function fillCupRound(cup: CupState, round: number): CupTie[] {
  const ties = cup.ties.filter((t) => t.round === round);
  for (const tie of ties) {
    const w0 = cupTie(cup, round - 1, tie.index * 2).winner!;
    const w1 = cupTie(cup, round - 1, tie.index * 2 + 1).winner!;
    tie.home = cupUnderdog(cup, w0, w1);
    tie.away = tie.home === w0 ? w1 : w0;
  }
  return ties;
}

/** Snapshot the finished cup into a SeasonRecord entry (deep-copied). */
export function buildCupRecord(cup: CupState, playerNameOf: (slot: number, i: number) => string): CupRecord {
  const final = cupTie(cup, CUP_ROUNDS - 1, 0);
  const winner = cupEntrant(cup, final.winner!);
  const runnerUp = cupEntrant(cup, final.winner === final.home ? final.away : final.home);

  let topScorer: CupRecord['topScorer'] = null;
  cup.playerGoals.forEach((goals, slot) => {
    goals.forEach((g, i) => {
      if (g > 0 && (!topScorer || g > topScorer.goals)) {
        topScorer = { name: playerNameOf(slot, i), team: cupEntrant(cup, slot).name, goals: g };
      }
    });
  });

  return {
    winnerSlot: winner.slot,
    winnerName: winner.name,
    runnerUpName: runnerUp.name,
    entrants: cup.entrants.map((e) => ({ ...e })),
    ties: cup.ties.map((t) => ({ ...t })),
    upsets: cup.ties
      .filter((t) => t.upset)
      .map((t) => ({
        round: t.round,
        winnerName: cupEntrant(cup, t.winner!).name,
        loserName: cupEntrant(cup, t.winner === t.home ? t.away : t.home).name,
        score: [t.scoreH!, t.scoreA!] as [number, number],
      })),
    topScorer,
  };
}
