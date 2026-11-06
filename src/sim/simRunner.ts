import { League } from './League';
import type { Match } from './Match';

/**
 * Headless fast-sim core — the exact loop the sim worker executes, kept as a
 * pure sim-side function so vitest can prove it equivalent to simulating on
 * the League directly (same seed ⇒ byte-identical save JSON).
 *
 * Ownership note: the caller owns cloning. `League.fromJSON` adopts the data
 * object's arrays by reference, so pass a copy (postMessage's structured
 * clone provides one for free in the worker path).
 */

export type SimRequest =
  /** Simulate until the league reaches this generation (season/10-seasons). */
  | { kind: 'toGeneration'; target: number }
  /** Simulate to the end of the current league/cup round (or the playoff). */
  | { kind: 'round' };

export interface SimProgress {
  matches: number;
  generation: number;
  /** Set on season boundaries so the UI can narrate long runs. */
  seasonFinished?: boolean;
}

/**
 * What the caller's chosen world adds to a bare save. `League.matchFlags` is
 * session config, not save data (a `fromJSON` league has none), and a world
 * may also rewrite each freshly built match before it kicks off. sim/ stays
 * world-agnostic: the game layer builds this (`a4HeadlessWorld`) and the
 * worker receives the plain-data half of it by message.
 */
export interface HeadlessWorld {
  matchFlags: League['matchFlags'];
  /** Applied to every match right after `createMatch`, before the first step. */
  arm?: (match: Match) => void;
}

export interface SimOutcome {
  /** League save data (v-current) after the run — feed to League.fromJSON. */
  league: Record<string, unknown>;
  matches: number;
  seasonsCompleted: number;
}

export function runHeadless(
  data: Record<string, unknown>,
  req: SimRequest,
  onProgress?: (p: SimProgress) => void,
  progressEvery = 8,
  world?: HeadlessWorld,
): SimOutcome {
  const league = League.fromJSON(data);
  // No world ⇒ exactly the pre-world loop (the production fingerprint path).
  if (world) league.matchFlags = world.matchFlags;
  let matches = 0;
  let seasonsCompleted = 0;

  // Round runs stop when the round context changes — same grouping rule as
  // GameApp.simRound (generation, displayed round, league-vs-cup block).
  const gen0 = league.generation;
  const round0 = league.currentRound();
  const cup0 = league.nextFixture()?.cup ?? false;
  const done = (): boolean =>
    req.kind === 'toGeneration'
      ? league.generation >= req.target
      : league.generation !== gen0 ||
        league.currentRound() !== round0 ||
        (league.nextFixture()?.cup ?? false) !== cup0;

  while (!done()) {
    const f = league.nextFixture();
    if (!f) break; // defensive: a saved league is never parked on seasonDone
    const match = league.createMatch(f);
    world?.arm?.(match);
    league.applyResult(f, match.runToCompletion());
    matches++;
    if (league.seasonDone) {
      league.finishSeason();
      seasonsCompleted++;
      onProgress?.({ matches, generation: league.generation, seasonFinished: true });
    } else if (matches % progressEvery === 0) {
      onProgress?.({ matches, generation: league.generation });
    }
  }

  return { league: league.toJSON() as Record<string, unknown>, matches, seasonsCompleted };
}
