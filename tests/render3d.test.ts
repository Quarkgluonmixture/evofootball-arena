import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { animFor } from '../src/render3d/AnimationSystem';
import { cameraForEvent, cameraGoalFor } from '../src/render3d/CameraController';
import { declutterLabels } from '../src/render3d/labelDeclutter';
import {
  buildRenderState, buildRenderTheme, interpolateStates, lerpAngle,
} from '../src/render3d/RenderStateAdapter';
import { ReplayBuffer } from '../src/replay/ReplayBuffer';
import { DT } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import type { TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

function makeTeam(name: string, seed: number): TeamInfo {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xd64550, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
}

const makeMatch = () =>
  new Match({ seed: 42, teamA: makeTeam('Alpha', 1), teamB: makeTeam('Beta', 2), duration: 60 });

describe('RenderStateAdapter', () => {
  it('maps sim coordinates: x->x, y->z, velocity->yaw', () => {
    const match = makeMatch();
    for (let i = 0; i < 300; i++) match.step(DT);
    const rs = buildRenderState(match, false);

    expect(rs.players.length).toBe(10);
    rs.players.forEach((rp, i) => {
      const sp = match.allPlayers[i];
      expect(rp.gid).toBe(sp.gid);
      expect(rp.x).toBe(sp.pos.x);
      expect(rp.z).toBe(sp.pos.y); // sim y -> world z
      expect(rp.yaw).toBe(Math.atan2(sp.heading.x, sp.heading.y));
      expect(rp.action).toBe(sp.action.type);
    });
    expect(rs.ball.x).toBe(match.ball.pos.x);
    expect(rs.ball.z).toBe(match.ball.pos.y);
    expect(rs.ball.ownerGid).toBe(match.ball.owner ? match.ball.owner.gid : null);
  });

  it('reports the celebrating side and scorer during a goal pause', () => {
    const match = makeMatch();
    match.phase = 'goalPause';
    match.lastScorerGid = 9;
    match.pushEvent('goal', 1, 'GOAL!');
    const rs = buildRenderState(match, false);
    expect(rs.celebratingSide).toBe(1);
    expect(rs.celebratingGid).toBe(9);
  });

  it('surfaces recent events as fx (with xG attached to shots)', () => {
    // Find a seeded match that produces a shot (deterministic once found).
    let match!: Match;
    for (const seed of [42, 7, 99, 1234, 777]) {
      const m = new Match({ seed, teamA: makeTeam('Alpha', 1), teamB: makeTeam('Beta', 2), duration: 120 });
      while (m.shotLog.length === 0 && !m.finished) m.step(DT);
      if (m.shotLog.length > 0) {
        match = m;
        break;
      }
    }
    expect(match.shotLog.length).toBeGreaterThan(0);
    // Freshly-emitted event: rebuild state right after the shot.
    const rs = buildRenderState(match, false);
    const shotFx = rs.fx.find((f) => f.type === 'shot');
    expect(shotFx).toBeDefined();
    expect(shotFx!.xg).toBeCloseTo(match.shotLog[match.shotLog.length - 1].xg);
    // Old events fall out of the fx window.
    for (let i = 0; i < 90; i++) match.step(DT);
    const later = buildRenderState(match, false);
    expect(later.fx.find((f) => f.t === shotFx!.t)).toBeUndefined();
  });

  it('includes overlays only when asked', () => {
    const match = makeMatch();
    for (let i = 0; i < 300; i++) match.step(DT);
    expect(buildRenderState(match, false).overlays).toBeNull();
    const withOv = buildRenderState(match, true);
    expect(withOv.overlays).not.toBeNull();
    expect(withOv.overlays!.formation.length).toBe(10);
  });

  it('builds a theme with kits and rosters', () => {
    const theme = buildRenderTheme(makeMatch());
    expect(theme.teams.length).toBe(2);
    expect(theme.players.length).toBe(10);
    expect(theme.players[0].role).toBe('GK');
  });

  it('interpolates positions linearly and angles across the wrap', () => {
    const match = makeMatch();
    for (let i = 0; i < 120; i++) match.step(DT);
    const a = buildRenderState(match, false);
    for (let i = 0; i < 60; i++) match.step(DT);
    const b = buildRenderState(match, false);
    const mid = interpolateStates(a, b, 0.5);
    expect(mid.players[3].x).toBeCloseTo((a.players[3].x + b.players[3].x) / 2);
    expect(mid.players[3].z).toBeCloseTo((a.players[3].z + b.players[3].z) / 2);
    expect(mid.ball.x).toBeCloseTo((a.ball.x + b.ball.x) / 2);

    // Angle wrap: 175deg -> -175deg should pass through 180deg, not 0.
    const wrapped = lerpAngle((175 * Math.PI) / 180, (-175 * Math.PI) / 180, 0.5);
    expect(Math.abs(Math.abs(wrapped) - Math.PI)).toBeLessThan(1e-6);
  });
});

describe('animFor (action -> animation mapping)', () => {
  it('maps kicks, dribbles, keeper and default locomotion', () => {
    expect(animFor('Pass', 3, false)).toBe('kick');
    expect(animFor('Shoot', 3, false)).toBe('kick');
    expect(animFor('ClearBall', 3, false)).toBe('kick');
    expect(animFor('Dribble', 5, false)).toBe('dribble');
    expect(animFor('InterceptPass', 6, false)).toBe('lunge');
    expect(animFor('GoalkeeperSave', 6, false)).toBe('gkDive');
    expect(animFor('GoalkeeperPosition', 1, false)).toBe('gkReady');
    expect(animFor('MoveToFormationSpot', 0.2, false)).toBe('idle');
    expect(animFor('MoveToFormationSpot', 3, false)).toBe('jog');
    expect(animFor('ChaseBall', 7, false)).toBe('sprint');
  });

  it('celebration overrides everything', () => {
    expect(animFor('ChaseBall', 7, true)).toBe('celebrate');
    expect(animFor('Pass', 2, true)).toBe('celebrate');
  });
});

describe('cameraGoalFor', () => {
  const ball = { x: 20, z: -10, vx: 5, vz: 0 };

  it('returns finite goals for every non-orbit mode', () => {
    for (const mode of ['tactical', 'broadcast', 'follow', 'behindGoal'] as const) {
      const g = cameraGoalFor(mode, ball);
      for (const v of Object.values(g)) expect(Number.isFinite(v)).toBe(true);
      expect(g.py).toBeGreaterThan(0);
    }
  });

  it('broadcast pans with the ball but clamps its travel', () => {
    const left = cameraGoalFor('broadcast', { x: -100, z: 0, vx: 0, vz: 0 });
    const right = cameraGoalFor('broadcast', { x: 100, z: 0, vx: 0, vz: 0 });
    expect(left.px).toBe(-28);
    expect(right.px).toBe(28);
  });

  it('behindGoal sits behind the goal nearest the ball', () => {
    expect(cameraGoalFor('behindGoal', { x: 30, z: 0, vx: 0, vz: 0 }).px).toBeGreaterThan(45);
    expect(cameraGoalFor('behindGoal', { x: -30, z: 0, vx: 0, vz: 0 }).px).toBeLessThan(-45);
  });

  it('broadcast pushes in when the ball reaches a final third', () => {
    const mid = cameraGoalFor('broadcast', { x: 0, z: 0, vx: 0, vz: 0 });
    const attack = cameraGoalFor('broadcast', { x: 40, z: 0, vx: 0, vz: 0 });
    expect(attack.py).toBeLessThan(mid.py);
    expect(attack.pz).toBeLessThan(mid.pz);
  });

  it('picks a fitting replay camera per event type', () => {
    expect(cameraForEvent('goal')).toBe('behindGoal');
    expect(cameraForEvent('shot')).toBe('broadcast');
    expect(cameraForEvent('save')).toBe('behindGoal');
    expect(cameraForEvent('interception')).toBe('tactical');
  });
});

describe('declutterLabels', () => {
  it('keeps everything when labels are far apart', () => {
    const items = [0, 1, 2].map((gid) => ({ gid, x: gid * 200, y: 0, priority: 1 }));
    expect(declutterLabels(items, 46).size).toBe(3);
  });

  it('drops the lower-priority label in a collision', () => {
    const visible = declutterLabels(
      [
        { gid: 1, x: 100, y: 100, priority: 1 },
        { gid: 2, x: 110, y: 105, priority: 3 }, // carrier wins
        { gid: 3, x: 500, y: 100, priority: 1 },
      ],
      46,
    );
    expect(visible.has(2)).toBe(true);
    expect(visible.has(1)).toBe(false);
    expect(visible.has(3)).toBe(true);
  });

  it('is deterministic for equal priorities (gid tie-break)', () => {
    const collide = [
      { gid: 5, x: 0, y: 0, priority: 1 },
      { gid: 4, x: 10, y: 0, priority: 1 },
    ];
    const v1 = declutterLabels(collide, 46);
    const v2 = declutterLabels([...collide].reverse(), 46);
    expect([...v1]).toEqual([...v2]);
    expect(v1.has(4)).toBe(true);
  });
});

describe('ReplayBuffer', () => {
  it('records at its cadence and interpolates between snapshots', () => {
    const match = makeMatch();
    const buffer = new ReplayBuffer(0.1);
    for (let i = 0; i < 600; i++) {
      match.step(DT);
      buffer.maybeRecord(match);
    }
    expect(buffer.hasContent).toBe(true);
    const range = buffer.range()!;
    expect(range[1]).toBeGreaterThan(range[0]);

    const t = (range[0] + range[1]) / 2;
    const s1 = buffer.stateAt(t)!;
    expect(Math.abs(s1.t - t)).toBeLessThan(0.11);
    // Clamps outside the recorded range.
    expect(buffer.stateAt(range[0] - 5)!.t).toBeCloseTo(range[0]);
    expect(buffer.stateAt(range[1] + 5)!.t).toBeCloseTo(range[1]);
    // Scrubbing to different times gives different ball positions eventually.
    const early = buffer.stateAt(range[0])!;
    const late = buffer.stateAt(range[1])!;
    const moved =
      Math.abs(early.ball.x - late.ball.x) + Math.abs(early.ball.z - late.ball.z) +
      Math.abs(early.players[4].x - late.players[4].x);
    expect(moved).toBeGreaterThan(0.5);
  });

  it('replay reads never mutate recorded snapshots', () => {
    const match = makeMatch();
    const buffer = new ReplayBuffer(0.1);
    for (let i = 0; i < 300; i++) {
      match.step(DT);
      buffer.maybeRecord(match);
    }
    const range = buffer.range()!;
    const before = JSON.stringify(buffer.stateAt(range[0]));
    buffer.stateAt((range[0] + range[1]) / 2);
    buffer.stateAt(range[1]);
    expect(JSON.stringify(buffer.stateAt(range[0]))).toBe(before);
  });
});

describe('dependency boundaries', () => {
  const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

  const walk = (dir: string): string[] => {
    const out: string[] = [];
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) out.push(...walk(p));
      else if (p.endsWith('.ts')) out.push(p);
    }
    return out;
  };

  it('sim/evolution/ai/utils never import three, pixi or render code', () => {
    for (const dir of ['sim', 'evolution', 'ai', 'utils']) {
      for (const file of walk(join(SRC, dir))) {
        const text = readFileSync(file, 'utf8');
        expect(text, file).not.toMatch(/from\s+'three'/);
        expect(text, file).not.toMatch(/from\s+'pixi\.js'/);
        expect(text, file).not.toMatch(/from\s+'[^']*render3d/);
        expect(text, file).not.toMatch(/from\s+'[^']*\/render\//);
      }
    }
  });

  it('the RenderStateAdapter itself is three-free (pure)', () => {
    const text = readFileSync(join(SRC, 'render3d', 'RenderStateAdapter.ts'), 'utf8');
    expect(text).not.toMatch(/from\s+'three'/);
  });
});
