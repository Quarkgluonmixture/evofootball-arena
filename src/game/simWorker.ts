import { runHeadless, type SimRequest } from '../sim/simRunner';

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

interface SimWorkerRequest {
  league: Record<string, unknown>;
  req: SimRequest;
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
    const { league, req } = ev.data;
    const out = runHeadless(league, req, (p) => {
      ctx.postMessage({ type: 'progress', matches: p.matches, generation: p.generation });
    });
    ctx.postMessage({ type: 'done', league: out.league, matches: out.matches, seasonsCompleted: out.seasonsCompleted });
  } catch (err) {
    ctx.postMessage({ type: 'error', message: String(err) });
  }
};
