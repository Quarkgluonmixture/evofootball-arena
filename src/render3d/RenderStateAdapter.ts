import { formationSpot } from '../ai/formations';
import type { Match } from '../sim/Match';
import type { ActionType, MatchPhase, Role, Side } from '../sim/types';

/**
 * RenderStateAdapter — the ONLY bridge between the authoritative 2D sim and
 * the 3D viewer. Pure functions, no three.js imports, fully testable.
 *
 * Coordinate mapping:  sim x -> world x,  sim y -> world z,  height -> world y.
 * Yaw convention: 0 faces world +z (sim +y); yaw = atan2(heading.x, heading.y),
 * so a model built facing +z turns to match the player's sim heading.
 */

export interface RenderPlayer {
  gid: number;
  side: Side;
  role: Role;
  x: number;
  z: number;
  yaw: number;
  speed: number;
  action: ActionType;
  stamina: number;
}

export interface RenderBall {
  x: number;
  z: number;
  vx: number;
  vz: number;
  speed: number;
  ownerGid: number | null;
  /** A shot is currently in flight (drives trail emphasis + camera pulse). */
  isShot: boolean;
  /** A pass is currently in flight. */
  isPass: boolean;
}

/** A recent notable event, for visual/audio feedback (deduped by `t`). */
export interface FxEvent {
  type: 'goal' | 'save' | 'shot' | 'interception';
  side: Side;
  t: number;
  /** Attached for shots so the viewer can show chance quality. */
  xg?: number;
}

export interface OverlayState {
  /** Ball position -> intended receiver, while a pass is in flight. */
  passLine: { x1: number; z1: number; x2: number; z2: number } | null;
  /** Ball position -> short projection of shot velocity, while a shot flies. */
  shotLine: { x1: number; z1: number; x2: number; z2: number } | null;
  /** Marker -> marked opponent, both teams. */
  markLines: Array<{ x1: number; z1: number; x2: number; z2: number }>;
  /** Gids of players currently assigned to press. */
  chasers: number[];
  /** Formation target per player. */
  formation: Array<{ gid: number; side: Side; x: number; z: number }>;
}

export interface RenderState {
  t: number;
  phase: MatchPhase;
  minute: number;
  score: [number, number];
  /** Side celebrating during goalPause, else -1. */
  celebratingSide: Side | -1;
  /** The scorer's gid during goalPause (celebrates harder), else null. */
  celebratingGid: number | null;
  players: RenderPlayer[];
  ball: RenderBall;
  overlays: OverlayState | null;
  /** Events from the last ~0.5s of sim time — viewers dedupe by `t`. */
  fx: FxEvent[];
}

/** Static per-match info the 3D scene needs once (kits, names, roles). */
export interface RenderTheme {
  teams: Array<{ primary: number; secondary: number; short: string; name: string }>;
  players: Array<{ gid: number; side: Side; role: Role; name: string }>;
}

export function buildRenderTheme(match: Match): RenderTheme {
  return {
    teams: match.teams.map((t) => ({
      primary: t.info.colors.primary,
      secondary: t.info.colors.secondary,
      short: t.info.short,
      name: t.info.name,
    })),
    players: match.allPlayers.map((p) => ({ gid: p.gid, side: p.side, role: p.role, name: p.name })),
  };
}

export function buildRenderState(match: Match, includeOverlays: boolean): RenderState {
  let celebratingSide: Side | -1 = -1;
  if (match.phase === 'goalPause') {
    for (let i = match.events.length - 1; i >= 0; i--) {
      const ev = match.events[i];
      if (ev.type === 'goal') {
        celebratingSide = ev.side as Side;
        break;
      }
    }
  }

  const players: RenderPlayer[] = match.allPlayers.map((p) => ({
    gid: p.gid,
    side: p.side,
    role: p.role,
    x: p.pos.x,
    z: p.pos.y,
    yaw: Math.atan2(p.heading.x, p.heading.y),
    speed: Math.hypot(p.vel.x, p.vel.y),
    action: p.action.type,
    stamina: p.stamina,
  }));

  const ball: RenderBall = {
    x: match.ball.pos.x,
    z: match.ball.pos.y,
    vx: match.ball.vel.x,
    vz: match.ball.vel.y,
    speed: Math.hypot(match.ball.vel.x, match.ball.vel.y),
    ownerGid: match.ball.owner ? match.ball.owner.gid : null,
    isShot: match.pendingShot !== null,
    isPass: match.pendingPass !== null,
  };

  return {
    t: match.simTime,
    phase: match.phase,
    minute: match.minute(),
    score: [match.score[0], match.score[1]],
    celebratingSide,
    celebratingGid: match.phase === 'goalPause' ? match.lastScorerGid : null,
    players,
    ball,
    overlays: includeOverlays ? buildOverlays(match) : null,
    fx: buildFx(match),
  };
}

const FX_WINDOW = 0.5;

function buildFx(match: Match): FxEvent[] {
  const out: FxEvent[] = [];
  for (let i = match.events.length - 1; i >= 0; i--) {
    const ev = match.events[i];
    if (match.simTime - ev.t > FX_WINDOW) break;
    if (ev.type === 'goal' || ev.type === 'save' || ev.type === 'shot' || ev.type === 'interception') {
      const fx: FxEvent = { type: ev.type, side: ev.side as Side, t: ev.t };
      if (ev.type === 'shot') {
        for (let j = match.shotLog.length - 1; j >= 0; j--) {
          const s = match.shotLog[j];
          if (Math.abs(s.t - ev.t) < 0.03 && s.side === ev.side) {
            fx.xg = s.xg;
            break;
          }
          if (ev.t - s.t > FX_WINDOW) break;
        }
      }
      out.push(fx);
    }
  }
  return out.reverse();
}

function buildOverlays(match: Match): OverlayState {
  let passLine: OverlayState['passLine'] = null;
  if (match.pendingPass) {
    const target = match.allPlayers.find((p) => p.gid === match.pendingPass!.targetGid);
    if (target) {
      passLine = { x1: match.ball.pos.x, z1: match.ball.pos.y, x2: target.pos.x, z2: target.pos.y };
    }
  }

  let shotLine: OverlayState['shotLine'] = null;
  if (match.pendingShot && !match.ball.owner) {
    shotLine = {
      x1: match.ball.pos.x,
      z1: match.ball.pos.y,
      x2: match.ball.pos.x + match.ball.vel.x * 0.45,
      z2: match.ball.pos.y + match.ball.vel.y * 0.45,
    };
  }

  const markLines: OverlayState['markLines'] = [];
  const chasers: number[] = [];
  for (const team of match.teams) {
    const opp = match.teams[1 - team.side];
    for (const [ownIdx, oppIdx] of team.marks) {
      const a = team.players[ownIdx];
      const b = opp.players[oppIdx];
      markLines.push({ x1: a.pos.x, z1: a.pos.y, x2: b.pos.x, z2: b.pos.y });
    }
    for (const idx of team.chasers) chasers.push(team.side * 5 + idx);
  }

  const formation: OverlayState['formation'] = [];
  for (const team of match.teams) {
    const hasBall = match.possessionSide === team.side;
    for (const p of team.players) {
      const spot = formationSpot(p, team, match.ball, hasBall);
      formation.push({ gid: p.gid, side: team.side, x: spot.x, z: spot.y });
    }
  }

  return { passLine, shotLine, markLines, chasers, formation };
}

/* ---------------- interpolation (replay smoothing) ---------------- */

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Shortest-path angular interpolation. */
export function lerpAngle(a: number, b: number, t: number): number {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

/**
 * Blend two adjacent snapshots for smooth replay scrubbing. Discrete fields
 * (action, phase, score, possession) snap to the newer state at alpha >= 0.5.
 */
export function interpolateStates(a: RenderState, b: RenderState, alpha: number): RenderState {
  const t = Math.max(0, Math.min(1, alpha));
  const late = t >= 0.5 ? b : a;
  return {
    t: lerp(a.t, b.t, t),
    phase: late.phase,
    minute: late.minute,
    score: late.score,
    celebratingSide: late.celebratingSide,
    celebratingGid: late.celebratingGid,
    fx: late.fx,
    players: a.players.map((pa, i) => {
      const pb = b.players[i] ?? pa;
      return {
        gid: pa.gid,
        side: pa.side,
        role: pa.role,
        x: lerp(pa.x, pb.x, t),
        z: lerp(pa.z, pb.z, t),
        yaw: lerpAngle(pa.yaw, pb.yaw, t),
        speed: lerp(pa.speed, pb.speed, t),
        action: (t >= 0.5 ? pb : pa).action,
        stamina: lerp(pa.stamina, pb.stamina, t),
      };
    }),
    ball: {
      x: lerp(a.ball.x, b.ball.x, t),
      z: lerp(a.ball.z, b.ball.z, t),
      vx: lerp(a.ball.vx, b.ball.vx, t),
      vz: lerp(a.ball.vz, b.ball.vz, t),
      speed: lerp(a.ball.speed, b.ball.speed, t),
      ownerGid: late.ball.ownerGid,
      isShot: late.ball.isShot,
      isPass: late.ball.isPass,
    },
    overlays: null,
  };
}
