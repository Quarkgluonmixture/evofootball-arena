import { describe, expect, it } from 'vitest';
import { HALF_L, HALF_W } from '../src/sim/constants';
import {
  resolveShootout, shootoutLineup, type ShootoutKick, type ShootoutResult,
} from '../src/sim/cup';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { ROLES, TEAM_SIZE } from '../src/sim/types';
import { interpolateStates, type RenderPlayer, type RenderState } from '../src/render3d/RenderStateAdapter';
import { ShootoutTheater } from '../src/render3d/ShootoutTheater';
import { Rng } from '../src/utils/rng';

const attrs = (finishing: number): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  p.finishing = finishing;
  return p;
};

const templatePlayers = (): RenderPlayer[] =>
  [0, 1].flatMap((side) =>
    ROLES.map((role, i) => ({
      gid: side * TEAM_SIZE + i,
      side: side as 0 | 1,
      role,
      x: 0,
      z: 0,
      yaw: 0,
      speed: 0,
      action: 'HoldPosition' as const,
      stamina: 1,
    })),
  );

/** A real script from the real resolver (seed-picked to be decisive). */
const script = (seed: number): { kicks: ShootoutKick[]; result: ShootoutResult } => {
  const squad = [attrs(0.5), attrs(0.7), attrs(0.6), attrs(0.5), attrs(0.4)];
  const kicks: ShootoutKick[] = [];
  const result = resolveShootout(shootoutLineup(squad), shootoutLineup(squad), new Rng(seed), kicks);
  if (!result) throw new Error(`seed ${seed} hit the failsafe — pick another`);
  return { kicks, result };
};

const runToEnd = (theater: ShootoutTheater, dt = 0.1): { states: RenderState[]; events: ShootoutKick[] } => {
  const states: RenderState[] = [];
  const events: ShootoutKick[] = [];
  for (let i = 0; i < 5000 && !theater.done; i++) {
    states.push(theater.advance(dt));
    events.push(...theater.takeEvents());
  }
  return { states, events };
};

describe('ShootoutTheater (Phase 24)', () => {
  it('plays the whole script: every kick lands, pens end at the recorded result', () => {
    const { kicks, result } = script(3);
    const theater = new ShootoutTheater(kicks, templatePlayers(), [1, 1]);
    const { states, events } = runToEnd(theater);
    expect(theater.done).toBe(true);
    expect(events).toEqual(kicks); // feed gets every kick, in strike order
    const last = states[states.length - 1];
    expect(last.shootout).toEqual({ h: result.scoreH, a: result.scoreA });
  });

  it('states stay well-formed: 12 players, ball on stage, monotonic pens', () => {
    const { kicks } = script(3);
    const theater = new ShootoutTheater(kicks, templatePlayers(), [2, 2]);
    const { states } = runToEnd(theater);
    let prevH = 0;
    let prevA = 0;
    for (const st of states) {
      expect(st.players).toHaveLength(TEAM_SIZE * 2);
      expect(st.players.map((p) => p.gid).sort((a, b) => a - b)).toEqual(
        Array.from({ length: TEAM_SIZE * 2 }, (_, g) => g),
      );
      expect(Math.abs(st.ball.x)).toBeLessThanOrEqual(HALF_L + 2);
      expect(Math.abs(st.ball.z)).toBeLessThanOrEqual(HALF_W);
      expect(st.score).toEqual([2, 2]); // the FT score never changes
      expect(st.phase).toBe('fulltime');
      expect(st.shootout!.h).toBeGreaterThanOrEqual(prevH);
      expect(st.shootout!.a).toBeGreaterThanOrEqual(prevA);
      prevH = st.shootout!.h;
      prevA = st.shootout!.a;
    }
  });

  it('fires one winning-moment goal fx and one save fx per miss (unique t keys)', () => {
    const { kicks } = script(3);
    const theater = new ShootoutTheater(kicks, templatePlayers(), [0, 0]);
    const { states } = runToEnd(theater);
    const seen = new Map<string, number>();
    for (const st of states) {
      for (const fx of st.fx) {
        seen.set(`${fx.type}:${fx.t.toFixed(2)}`, (seen.get(`${fx.type}:${fx.t.toFixed(2)}`) ?? 0) + 1);
      }
    }
    const goals = [...seen.keys()].filter((k) => k.startsWith('goal:'));
    const saves = [...seen.keys()].filter((k) => k.startsWith('save:'));
    expect(goals).toHaveLength(1);
    expect(saves).toHaveLength(kicks.filter((k) => !k.scored).length);
  });

  it('stages at the winning side\'s goal end', () => {
    for (const seed of [3, 5, 8, 11, 13]) {
      const { kicks, result } = script(seed);
      const theater = new ShootoutTheater(kicks, templatePlayers(), [0, 0]);
      const { states } = runToEnd(theater);
      const sign = result.scoreH > result.scoreA ? 1 : -1;
      // The ball lives in the staged half throughout.
      for (const st of states) expect(st.ball.x * sign).toBeGreaterThan(0);
    }
  });

  it('is deterministic for a given script and dt sequence', () => {
    const { kicks } = script(3);
    const a = runToEnd(new ShootoutTheater(kicks, templatePlayers(), [1, 1])).states;
    const b = runToEnd(new ShootoutTheater(kicks, templatePlayers(), [1, 1])).states;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('skip() jumps to the end and still hands every kick to the feed', () => {
    const { kicks, result } = script(3);
    const theater = new ShootoutTheater(kicks, templatePlayers(), [1, 1]);
    theater.advance(2.5); // partway in
    theater.skip();
    expect(theater.done).toBe(true);
    expect(theater.takeEvents()).toEqual(kicks);
    expect(theater.info().pens).toEqual([result.scoreH, result.scoreA]);
  });

  it('interpolateStates carries the shootout field through replay blending', () => {
    const { kicks } = script(3);
    const theater = new ShootoutTheater(kicks, templatePlayers(), [1, 1]);
    const a = theater.advance(1);
    const b = theater.advance(1);
    expect(interpolateStates(a, b, 0.75).shootout).toEqual(b.shootout);
  });
});
