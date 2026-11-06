import type { League } from '../sim/League';
import { runHeadless, type SimRequest } from '../sim/simRunner';
import { a4HeadlessWorld, type A4LeagueWorld } from './a4World';

/**
 * Dedicated sim worker: receives a league save + request, runs the headless
 * loop off the main thread, streams progress, posts the finished league back.
 * Stateless per message — the main thread owns the real League and swaps it
 * for the returned one (structured clone isolates the two sides).
 *
 * Lives in game/ (not sim/): worker globals are a browser API, and sim/ must
 * stay environment-free (ARCHITECTURE invariant 1) — which is exactly what
 * makes the sim worker-safe in the first place.
 */

export interface SimWorkerRequest {
  league: Record<string, unknown>;
  req: SimRequest;
  /**
   * The main thread's `League.matchFlags` — session config the save does not carry. Absent
   * (a message from a build before this field) ⇒ no flags, the old headless behaviour.
   */
  matchFlags?: League['matchFlags'];
  /** The chosen world's arming payload. Absent or version 0 ⇒ no per-match arm. */
  a4?: A4LeagueWorld;
}

export type SimWorkerMessage =
  | { type: 'progress'; matches: number; generation: number }
  | { type: 'done'; league: Record<string, unknown>; matches: number; seasonsCompleted: number }
  | { type: 'error'; message: string };

const ctx = self as unknown as {
  postMessage(msg: SimWorkerMessage): void;
  onmessage: ((ev: MessageEvent<SimWorkerRequest>) => void) | null;
};

ctx.onmessage = (ev) => {
  try {
    const { league, req, matchFlags, a4 } = ev.data;
    // The league plays the world the watched fixture plays: same flags, same per-match arm.
    const world = matchFlags === undefined && a4 === undefined
      ? undefined
      : a4HeadlessWorld(
        a4 ?? { version: 0, tables: null, l3Dose: null, pcDose: null },
        matchFlags ?? {},
      );
    const out = runHeadless(league, req, (p) => {
      ctx.postMessage({ type: 'progress', matches: p.matches, generation: p.generation });
    }, undefined, world);
    ctx.postMessage({ type: 'done', league: out.league, matches: out.matches, seasonsCompleted: out.seasonsCompleted });
  } catch (err) {
    ctx.postMessage({ type: 'error', message: String(err) });
  }
};
