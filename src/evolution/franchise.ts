import type { Rng } from '../utils/rng';
import { randomGenome, type TacticalGenome } from './genome';
import { KIT_COLORS, generatePlayerNames, shortName, uniqueTeamName } from './names';
import { randomSquad, type PlayerAttributes } from './playerGenome';

/** One historical entry in a franchise's evolutionary lineage. */
export interface LineageEntry {
  generation: number;
  event: 'founded' | 'elite' | 'mutated' | 'reborn';
  /** Parent team names for 'reborn' (crossover) entries. */
  parents?: string[];
  fitness?: number;
  note?: string;
}

/**
 * A league slot that persists across seasons. Elite franchises keep their
 * genome; weak ones are reborn from crossover — the slot (and kit color)
 * stays, so you can follow a lane through history.
 */
export interface Franchise {
  slot: number;
  id: string;
  name: string;
  short: string;
  colors: { primary: number; secondary: number };
  playerNames: string[];
  genome: TacticalGenome;
  /** Per-player attribute genes, role order [GK, DF, MF, WG, ST]. */
  squad: PlayerAttributes[];
  elo: number;
  lineage: LineageEntry[];
}

export function createFranchise(slot: number, rng: Rng, takenNames: Set<string>): Franchise {
  const name = uniqueTeamName(rng, takenNames);
  return {
    slot,
    id: `T${slot}-g1`,
    name,
    short: shortName(name),
    colors: KIT_COLORS[slot % KIT_COLORS.length],
    playerNames: generatePlayerNames(rng),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
    elo: 1500,
    lineage: [{ generation: 1, event: 'founded' }],
  };
}

/** Season totals per franchise, accumulated by the League — input to fitness. */
export interface SeasonAggregates {
  played: number;
  wins: number;
  draws: number;
  losses: number;
  gf: number;
  ga: number;
  pts: number;
  shots: number;
  xg: number;
  passes: number;
  passesCompleted: number;
  recoveries: number;
  staminaSpent: number;
  distance: number;
  /** Per-match style samples for consistency scoring. */
  styleSamples: Array<{ passVol: number; pressVol: number }>;
}

export const emptyAggregates = (): SeasonAggregates => ({
  played: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  gf: 0,
  ga: 0,
  pts: 0,
  shots: 0,
  xg: 0,
  passes: 0,
  passesCompleted: 0,
  recoveries: 0,
  staminaSpent: 0,
  distance: 0,
  styleSamples: [],
});
