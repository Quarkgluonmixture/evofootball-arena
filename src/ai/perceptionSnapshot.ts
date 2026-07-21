import type { Match } from '../sim/Match';
import type { Side } from '../sim/types';
import type { V2 } from '../utils/vec';

export interface PerceptionTruthPlayer {
  readonly gid: number;
  readonly side: Side;
  readonly pos: Readonly<V2>;
  readonly vel: Readonly<V2>;
  readonly bodyDir: Readonly<V2>;
  readonly sentOff: boolean;
}

export interface PerceptionTruth {
  readonly tick: number;
  readonly ball: {
    readonly pos: Readonly<V2>;
    readonly vel: Readonly<V2>;
    readonly ownerGid: number | null;
  };
  readonly players: readonly PerceptionTruthPlayer[];
}

export interface ObservedPlayer {
  readonly gid: number;
  readonly side: Side;
  readonly pos: Readonly<V2>;
  readonly vel: Readonly<V2>;
  readonly bodyDir: Readonly<V2>;
  readonly observedTick: number;
  readonly ageTicks: number;
}

export interface ObservedBall {
  readonly pos: Readonly<V2>;
  readonly vel: Readonly<V2>;
  readonly ownerGid: number | null;
  readonly observedTick: number;
  readonly ageTicks: number;
}

export interface PerceptionSnapshot {
  readonly tick: number;
  readonly observerGid: number;
  readonly awareness: number;
  readonly ball: ObservedBall | null;
  readonly players: readonly ObservedPlayer[];
}

interface StoredPlayer extends Omit<ObservedPlayer, 'ageTicks'> {}
interface StoredBall extends Omit<ObservedBall, 'ageTicks'> {}

export interface PerceptionMemory {
  nextScanTick: number;
  ball: StoredBall | null;
  readonly players: Map<number, StoredPlayer>;
}

export function createPerceptionMemory(): PerceptionMemory {
  return { nextScanTick: -1, ball: null, players: new Map() };
}

export function capturePerceptionTruth(match: Match): PerceptionTruth {
  return {
    tick: match.simTick,
    ball: {
      pos: { x: match.ball.pos.x, y: match.ball.pos.y },
      vel: { x: match.ball.vel.x, y: match.ball.vel.y },
      ownerGid: match.ball.owner?.gid ?? null,
    },
    players: match.allPlayers.map((p) => ({
      gid: p.gid,
      side: p.side,
      pos: { x: p.pos.x, y: p.pos.y },
      vel: { x: p.vel.x, y: p.vel.y },
      bodyDir: { x: p.bodyDir.x, y: p.bodyDir.y },
      sentOff: p.sentOff,
    })),
  };
}

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

/** Stable functional noise: no RNG state and no call-order dependence. */
function keyedNoise(seed: number, observerGid: number, entityGid: number, tick: number, channel: number): number {
  let h = seed | 0;
  h = Math.imul(h ^ (observerGid + 0x9e3779b9), 0x85ebca6b);
  h = Math.imul(h ^ (entityGid + 0xc2b2ae35), 0x27d4eb2d);
  h = Math.imul(h ^ tick, 0x165667b1);
  h = Math.imul(h ^ channel, 0x9e3779b1);
  h ^= h >>> 16;
  return ((h >>> 0) / 0xffffffff) * 2 - 1;
}

function visible(observer: PerceptionTruthPlayer, entity: PerceptionTruthPlayer, awareness: number): boolean {
  if (entity.gid === observer.gid) return true;
  const dx = entity.pos.x - observer.pos.x;
  const dy = entity.pos.y - observer.pos.y;
  const d = Math.hypot(dx, dy);
  if (d <= 4) return true; // near-field bodies are felt/heard even outside the cone
  const range = 18 + awareness * 22;
  if (d > range) return false;
  const facing = d > 1e-9 ? (observer.bodyDir.x * dx + observer.bodyDir.y * dy) / d : 1;
  return facing >= -0.2 - awareness * 0.5;
}

function observePlayer(
  seed: number,
  observer: PerceptionTruthPlayer,
  entity: PerceptionTruthPlayer,
  awareness: number,
  tick: number,
): StoredPlayer {
  if (entity.gid === observer.gid) {
    return {
      gid: entity.gid,
      side: entity.side,
      pos: { x: entity.pos.x, y: entity.pos.y },
      vel: { x: entity.vel.x, y: entity.vel.y },
      bodyDir: { x: entity.bodyDir.x, y: entity.bodyDir.y },
      observedTick: tick,
    };
  }
  const d = Math.hypot(entity.pos.x - observer.pos.x, entity.pos.y - observer.pos.y);
  const error = 1 - awareness;
  const posAmp = (0.2 + d * 0.025) * error;
  const speed = Math.hypot(entity.vel.x, entity.vel.y);
  const velAmp = (0.45 + speed * 0.08) * error;
  const turn = keyedNoise(seed, observer.gid, entity.gid, tick, 4) * 0.35 * error;
  const c = Math.cos(turn);
  const s = Math.sin(turn);
  return {
    gid: entity.gid,
    side: entity.side,
    pos: {
      x: entity.pos.x + keyedNoise(seed, observer.gid, entity.gid, tick, 0) * posAmp,
      y: entity.pos.y + keyedNoise(seed, observer.gid, entity.gid, tick, 1) * posAmp,
    },
    vel: {
      x: entity.vel.x + keyedNoise(seed, observer.gid, entity.gid, tick, 2) * velAmp,
      y: entity.vel.y + keyedNoise(seed, observer.gid, entity.gid, tick, 3) * velAmp,
    },
    bodyDir: {
      x: entity.bodyDir.x * c - entity.bodyDir.y * s,
      y: entity.bodyDir.x * s + entity.bodyDir.y * c,
    },
    observedTick: tick,
  };
}

/**
 * Build one pass-facing snapshot. The memory mutates only when its deterministic
 * scan clock fires; between scans callers receive the last-known facts with age.
 */
export function perceiveSnapshot(
  truth: PerceptionTruth,
  observerGid: number,
  awarenessInput: number,
  seed: number,
  memory: PerceptionMemory,
): PerceptionSnapshot {
  const awareness = clamp01(awarenessInput);
  const observer = truth.players.find((p) => p.gid === observerGid);
  if (!observer) throw new Error(`Unknown perception observer gid ${observerGid}`);
  const intervalTicks = Math.round(15 - awareness * 9); // 4–10 Hz at 60 Hz sim
  const retentionTicks = Math.round(15 + awareness * 45); // 0.25–1.0 s memory
  const scan = memory.nextScanTick < 0 || truth.tick >= memory.nextScanTick;
  const ownsBall = truth.ball.ownerGid === observerGid;

  if (scan) {
    memory.nextScanTick = truth.tick + intervalTicks;
    for (const entity of truth.players) {
      if (entity.sentOff) {
        memory.players.delete(entity.gid);
        continue;
      }
      if (visible(observer, entity, awareness)) {
        memory.players.set(entity.gid, observePlayer(seed, observer, entity, awareness, truth.tick));
      }
    }
    const bdx = truth.ball.pos.x - observer.pos.x;
    const bdy = truth.ball.pos.y - observer.pos.y;
    const bd = Math.hypot(bdx, bdy);
    const ballFacing = bd > 1e-9 ? (observer.bodyDir.x * bdx + observer.bodyDir.y * bdy) / bd : 1;
    if (!ownsBall && (bd <= 4 || (bd <= 18 + awareness * 22 && ballFacing >= -0.2 - awareness * 0.5))) {
      const ballError = (0.12 + bd * 0.015) * (1 - awareness);
      memory.ball = {
        pos: {
          x: truth.ball.pos.x + keyedNoise(seed, observer.gid, -1, truth.tick, 5) * ballError,
          y: truth.ball.pos.y + keyedNoise(seed, observer.gid, -1, truth.tick, 6) * ballError,
        },
        vel: {
          x: truth.ball.vel.x + keyedNoise(seed, observer.gid, -1, truth.tick, 7) * ballError,
          y: truth.ball.vel.y + keyedNoise(seed, observer.gid, -1, truth.tick, 8) * ballError,
        },
        ownerGid: truth.ball.ownerGid,
        observedTick: truth.tick,
      };
    }
  }

  // Touch/proprioception is continuous: the carrier does not wait for a visual
  // scan to know the authoritative location and motion of the ball at their feet.
  if (ownsBall) {
    memory.ball = {
      pos: { x: truth.ball.pos.x, y: truth.ball.pos.y },
      vel: { x: truth.ball.vel.x, y: truth.ball.vel.y },
      ownerGid: truth.ball.ownerGid,
      observedTick: truth.tick,
    };
  }

  for (const [gid, observation] of memory.players) {
    if (truth.tick - observation.observedTick > retentionTicks) memory.players.delete(gid);
  }
  if (memory.ball && truth.tick - memory.ball.observedTick > retentionTicks) memory.ball = null;

  const players: ObservedPlayer[] = [];
  for (const entity of truth.players) {
    const observed = memory.players.get(entity.gid);
    if (!observed) continue;
    players.push({ ...observed, ageTicks: truth.tick - observed.observedTick });
  }
  const ball = memory.ball
    ? { ...memory.ball, ageTicks: truth.tick - memory.ball.observedTick }
    : null;
  return { tick: truth.tick, observerGid, awareness, ball, players };
}
