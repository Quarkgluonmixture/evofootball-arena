import { deriveTeamStyle, type TeamStyle } from '../sim/types';
import type { Rng } from '../utils/rng';
import { emptyCareer, veteranAge, type PlayerCareer } from './careers';
import { randomGenome, type TacticalGenome } from './genome';
import { KIT_COLORS, generatePlayerNames, shortName, uniqueTeamName } from './names';
import { SQUAD_ROLES, randomSquad, type PlayerAttributes } from './playerGenome';

/** One historical entry in a franchise's evolutionary lineage. */
export interface LineageEntry {
  generation: number;
  event: 'founded' | 'elite' | 'mutated' | 'reborn' | 'promoted' | 'relegated';
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
  /**
   * Tactical identity (Phase 30): formations + marking scheme. Derived from
   * the genome at creation/rebirth and STORED — season-to-season gene
   * mutation must not flip a club's formation (switching is Phase 31's
   * explicit, lineage-logged mutation).
   */
  style: TeamStyle;
  /** Per-player attribute genes, slot order [GK, DF, MF, WGL, WGR, ST]. */
  squad: PlayerAttributes[];
  /** Player ages in slot order (Phase 26) — drive development & retirement. */
  ages: number[];
  /** Career ledgers in slot order — accumulated season stats + seasons. */
  careers: PlayerCareer[];
  elo: number;
  /** 0 = top flight, 1 = second division. Changes via promotion/relegation. */
  division: 0 | 1;
  lineage: LineageEntry[];
}

export function createFranchise(
  slot: number,
  rng: Rng,
  takenNames: Set<string>,
  division: 0 | 1 = 0,
  generation = 1,
): Franchise {
  const name = uniqueTeamName(rng, takenNames);
  const genome = randomGenome(rng);
  return {
    slot,
    id: `T${slot}-g${generation}`,
    name,
    short: shortName(name),
    colors: KIT_COLORS[slot % KIT_COLORS.length],
    playerNames: generatePlayerNames(rng),
    genome,
    style: deriveTeamStyle(genome),
    squad: randomSquad(rng),
    ages: SQUAD_ROLES.map(() => veteranAge(rng)),
    careers: SQUAD_ROLES.map(() => emptyCareer()),
    elo: 1500,
    division,
    lineage: [{ generation, event: 'founded' }],
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
  /** Cards picked up over the season (Phase 25) — feeds the dirtiest-team award. */
  yellows: number;
  reds: number;
  /** Longest completed-pass chain in one move this season (Phase 33). */
  longestChain: number;
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
  yellows: 0,
  reds: 0,
  longestChain: 0,
  styleSamples: [],
});
