import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { animFor, bankFor, jostling, lateralSlot, rideSide } from '../src/render3d/AnimationSystem';
import {
  BALL_VISUAL_RADIUS, BALL_VISUAL_SCALE, carryDisplayOffset, contactCue,
} from '../src/render3d/ballPresentation';
import { cameraForEvent, cameraGoalFor } from '../src/render3d/CameraController';
import { declutterLabels } from '../src/render3d/labelDeclutter';
import { defensiveLineX, linesmanTargetX } from '../src/render3d/LinesmanModel';
import {
  armSpan, bodyFor, hash01, MAX_BODY_HEIGHT, maxArmSpan, HUMAN_MODEL_SCALE,
} from '../src/render3d/PlayerModel';
import { refereeTarget } from '../src/render3d/RefereeModel';
import {
  DEFAULT_LIGHTING, DEFAULT_STYLE, isLighting, isStyleId, LIGHTINGS, STYLE_IDS, stylePreset,
} from '../src/render3d/stylePresets';
import {
  buildRenderState, buildRenderTheme, interpolateStates, lerpAngle,
  type RenderPlayer, type RenderState,
} from '../src/render3d/RenderStateAdapter';
import { ReplayBuffer } from '../src/replay/ReplayBuffer';
import { BALL_RADIUS, DT, FIELD_SCALE, HALF_L, PLAYER_MIN_DIST } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

function makeTeam(name: string, seed: number): TeamInfo {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xd64550, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
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

    expect(rs.players.length).toBe(TEAM_SIZE * 2);
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
    // Old events fall out of the fx window. Advance SIM time (not raw
    // frames): a scoring shot freezes simTime through the goal pause.
    const t0 = match.simTime;
    for (let i = 0; i < 900 && match.simTime < t0 + 1.5 && !match.finished; i++) match.step(DT);
    const later = buildRenderState(match, false);
    expect(later.fx.find((f) => f.t === shotFx!.t)).toBeUndefined();
  });

  it('includes overlays only when asked', () => {
    const match = makeMatch();
    for (let i = 0; i < 300; i++) match.step(DT);
    expect(buildRenderState(match, false).overlays).toBeNull();
    const withOv = buildRenderState(match, true);
    expect(withOv.overlays).not.toBeNull();
    expect(withOv.overlays!.formation.length).toBe(TEAM_SIZE * 2);
  });

  it('builds a theme with kits and rosters', () => {
    const theme = buildRenderTheme(makeMatch());
    expect(theme.teams.length).toBe(2);
    expect(theme.players.length).toBe(TEAM_SIZE * 2);
    expect(theme.players[0].role).toBe('GK');
  });

  it('carries the broadcast-layer inputs: possession, modes, pressers (68)', () => {
    const match = makeMatch();
    for (let i = 0; i < 600; i++) match.step(DT);
    const rs = buildRenderState(match, false);
    expect(rs.possession).toBe(match.possessionSide);
    expect(rs.modes).toEqual([match.teams[0].mode, match.teams[1].mode]);
    expect(Array.isArray(rs.press)).toBe(true);
    for (const c of rs.press!) {
      expect([0, 1]).toContain(c.side);
      expect(Math.abs(c.x)).toBeLessThanOrEqual(46);
    }
    // Interpolation passes the discrete broadcast fields through (late).
    for (let i = 0; i < 60; i++) match.step(DT);
    const b = buildRenderState(match, false);
    const mid = interpolateStates(rs, b, 0.8);
    expect(mid.possession).toBe(b.possession);
    expect(mid.modes).toEqual(b.modes);
    expect(mid.press).toEqual(b.press);
  });

  it('carries the occupant strength per frame for the body binding (76)', () => {
    const match = makeMatch();
    const rs = buildRenderState(match, false);
    for (const p of rs.players) {
      const sim = match.allPlayers.find((sp) => sp.gid === p.gid)!;
      expect(p.str).toBe(sim.attrs.strength);
    }
    // Interpolation passes it through discretely; absent (old replays) stays absent.
    const mid = interpolateStates(rs, rs, 0.5);
    expect(mid.players[0].str).toBe(rs.players[0].str);
  });

  it('surfaces fouls and cards to the fx stream, mining the card color (75)', () => {
    const match = makeMatch();
    for (let i = 0; i < 100; i++) match.step(DT);
    match.events.push({ t: match.simTime, minute: 1, type: 'foul', side: 0, text: 'Foul by A on B — free kick in range' });
    match.events.push({ t: match.simTime, minute: 1, type: 'foul', side: 1, text: 'Offside — Ovie (Alpha)' });
    // ADVANTAGE fouls never reach the fx stream (Phase 111, user report):
    // play never stopped, so neither the whistle sound nor the ref blows.
    match.events.push({ t: match.simTime, minute: 1, type: 'foul', side: 0, text: 'Foul by X on Y — advantage' });
    match.events.push({ t: match.simTime, minute: 1, type: 'card', side: 0, text: 'A is booked' });
    match.events.push({ t: match.simTime, minute: 1, type: 'card', side: 1, text: 'STRAIGHT RED! C is sent off' });
    const fx = buildRenderState(match, false).fx;
    expect(fx.some((f) => f.type === 'foul')).toBe(true);
    expect(fx.filter((f) => f.type === 'foul' && f.side === 0)).toHaveLength(1); // advantage filtered
    expect(fx.find((f) => f.type === 'card' && f.side === 0)?.red).toBe(false);
    expect(fx.find((f) => f.type === 'card' && f.side === 1)?.red).toBe(true);
    // Offside rides the foul channel, marked from its text (77).
    expect(fx.find((f) => f.type === 'foul' && f.side === 0)?.offside).toBe(false);
    expect(fx.find((f) => f.type === 'foul' && f.side === 1)?.offside).toBe(true);
  });

  it('carries ball spin for the curve visual; absent spin lerps to 0 (74)', () => {
    const match = makeMatch();
    match.ball.spin = 0.4;
    const rs = buildRenderState(match, false);
    expect(rs.ball.spin).toBeCloseTo(0.4);
    const hotter = { ...rs, ball: { ...rs.ball, spin: 0.8 } };
    expect(interpolateStates(rs, hotter, 0.5).ball.spin).toBeCloseTo(0.6);
    // Pre-74 replay snapshots carry no spin — the lerp maps them to 0, not NaN.
    const old = { ...rs, ball: { ...rs.ball, spin: undefined } };
    expect(interpolateStates(old, old, 0.5).ball.spin).toBe(0);
  });

  it('the theme carries the named coach to the touchline; ad-hoc dugouts stay empty (66)', () => {
    const bare = buildRenderTheme(makeMatch());
    expect(bare.teams[0].coach).toBeUndefined();
    const withCoach = new Match({
      seed: 42,
      teamA: { ...makeTeam('Alpha', 1), coachName: 'Ferguson' },
      teamB: makeTeam('Beta', 2),
      duration: 60,
    });
    const theme = buildRenderTheme(withCoach);
    expect(theme.teams[0].coach).toBe('Ferguson');
    expect(theme.teams[1].coach).toBeUndefined();
    // 66.1: the touchline figure's temperament rides along — the theme
    // carries the same gene the feed narrates.
    expect(theme.teams[0].tinker).toBe(withCoach.teams[0].info.genome.tinkerBias);
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

describe('ball presentation tells the same truth as the sim', () => {
  it('keeps the tactical-readability sphere close to the physical ball scale', () => {
    // F1: the M4-accepted readability factor 2.6 rides the body shrink, so the
    // ball holds the same share of a player's height instead of inflating.
    expect(BALL_VISUAL_SCALE).toBeCloseTo(2.6 * HUMAN_MODEL_SCALE, 10);
    expect(BALL_VISUAL_RADIUS).toBe(BALL_RADIUS * BALL_VISUAL_SCALE);
    expect(BALL_VISUAL_RADIUS).toBeLessThan(0.42);
    expect(BALL_VISUAL_RADIUS).toBeGreaterThan(BALL_RADIUS); // still readable, never "real"
  });

  it('never moves an outfield-controlled display ball away from its authoritative position', () => {
    const ball = { x: 4, z: -2, ownerGid: 5, heldByGk: false };
    const owner = { x: 3.2, z: -2, yaw: Math.PI / 2 };
    expect(carryDisplayOffset(ball, owner)).toBeNull();

    const held = carryDisplayOffset({ ...ball, ownerGid: 0, heldByGk: true }, owner);
    // Keeper hands remain a render-only height/pose anchor; the reach rides F1.
    expect(held!.dx).toBeCloseTo(-0.8 + 0.3 * HUMAN_MODEL_SCALE, 10);
    expect(held!.dz).toBeCloseTo(0, 10);
  });

  it('distinguishes a real tackle contact from an ordinary loose-ball touch', () => {
    const base = {
      x: 0, z: 0, vx: 0, vz: 0, speed: 0,
      ownerGid: null, isShot: false, isPass: false,
    };
    expect(contactCue(2, { ...base, lastTouchGid: 7 }, [{ gid: 7, tackling: true }])).toBe('tackle');
    expect(contactCue(2, { ...base, lastTouchGid: 5 }, [{ gid: 5, tackling: false }])).toBe('touch');
    expect(contactCue(5, { ...base, lastTouchGid: 5 }, [{ gid: 5, tackling: true }])).toBeNull();
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

  it('HoldUp shields ON the ball, moves normally off it (Phase 38)', () => {
    expect(animFor('HoldUp', 1, false, true)).toBe('shield');
    expect(animFor('HoldUp', 1, false, false)).toBe('dribble');
    expect(animFor('HoldUp', 1, false)).toBe('dribble'); // legacy callers
  });
});

describe('limb pickers (Phase 73, pure)', () => {
  it('lateralSlot picks the ball-side leg in model space', () => {
    // Facing +z (yaw 0): world +x IS local +x — the legR slot.
    expect(lateralSlot(0, 1, 0)).toBe(1);
    expect(lateralSlot(0, -1, 0)).toBe(-1);
    // Facing +x (yaw π/2): a ball toward world -z sits on local +x.
    expect(lateralSlot(Math.PI / 2, 0, -1)).toBe(1);
    expect(lateralSlot(Math.PI / 2, 0, 1)).toBe(-1);
    // Dead ahead defaults to the +x slot, never NaN-flaps.
    expect(lateralSlot(0, 0, 1)).toBe(1);
  });

  it('bankFor tips into the turn, scales with speed, clamps, and ignores walkers', () => {
    // Positive yaw rate (turning toward local +x) → negative rotation.z.
    expect(bankFor(2, 7)).toBeLessThan(0);
    expect(bankFor(-2, 7)).toBeGreaterThan(0);
    expect(Math.abs(bankFor(2, 8))).toBeGreaterThan(Math.abs(bankFor(2, 4)));
    expect(Math.abs(bankFor(50, 9))).toBeLessThanOrEqual(0.32);
    expect(bankFor(3, 1)).toBe(0); // near-standing pivots don't bank
  });
});

describe('body-contact detection (Phase 38, pure fns of RenderState)', () => {
  const rp = (over: Partial<RenderPlayer>): RenderPlayer => ({
    gid: 0, side: 0, role: 'ST', x: 0, z: 0, yaw: 0, speed: 0,
    action: 'MoveToFormationSpot', stamina: 1, ...over,
  });

  it('rideSide: parallel sprinters dueling FOR the ball read it; trackers do not', () => {
    const ballAt = (x: number, z: number) => ({ x, z, ownerGid: null });
    const a = rp({ gid: 1, side: 0, x: 0, z: 0, yaw: 0, speed: 6 });
    const rider = rp({ gid: 7, side: 1, x: 0.9, z: 0, yaw: 0.2, speed: 6 });
    expect(rideSide(a, [a, rider], ballAt(0.5, 1.5))).not.toBe(0);
    // The ball gate: the same pair 20m from the ball is a marking run, not
    // a duel — without this every pair on the resolver's min-dist shell
    // "leaned" (probed 185-286 bouts/match).
    expect(rideSide(a, [a, rider], ballAt(20, 0))).toBe(0);
    // A teammate never triggers it; neither does a crossing (perpendicular) run.
    expect(rideSide(a, [a, rp({ gid: 2, side: 0, x: 0.9, z: 0, yaw: 0, speed: 6 })], ballAt(0.5, 1.5))).toBe(0);
    expect(rideSide(a, [a, rp({ gid: 8, side: 1, x: 0.9, z: 0, yaw: Math.PI / 2, speed: 6 })], ballAt(0.5, 1.5))).toBe(0);
    // Standing bodies aren't riding anyone.
    expect(rideSide(rp({ speed: 1 }), [rider], ballAt(0.5, 1.5))).toBe(0);
  });

  it('jostling: corner setups wrestle in the goalmouth, open play never', () => {
    const marker = rp({ gid: 9, side: 1, x: 40, z: 6, speed: 0.5 });
    const crasher = rp({ gid: 3, side: 0, x: 40.6, z: 6.4, speed: 0.5 });
    const corner: RenderState = {
      t: 10, phase: 'restart', minute: 30, score: [0, 0], celebratingSide: -1,
      celebratingGid: null, players: [marker, crasher],
      ball: { x: 44.4, z: 28.4, vx: 0, vz: 0, speed: 0, ownerGid: null, isShot: false, isPass: false },
      overlays: null, fx: [],
    };
    expect(jostling(crasher, corner)).toBe(true);
    expect(jostling(marker, corner)).toBe(true);
    // Live play: same bodies, no corner — nobody grapples.
    expect(jostling(crasher, { ...corner, phase: 'playing' })).toBe(false);
    // A kick-in on the touchline is not a corner picture.
    expect(jostling(crasher, { ...corner, ball: { ...corner.ball, x: 10, z: 28.4 } })).toBe(false);
    // A sprinting player is running a crash, not wrestling.
    expect(jostling({ ...crasher, speed: 5 }, corner)).toBe(false);
  });
});

describe('the linesman law (Phase 77, pure)', () => {
  const pl = (side: 0 | 1, role: string, x: number) => ({ side, role, x }) as never;

  it('defensiveLineX picks the second-deepest outfielder toward the own goal', () => {
    // Side 0 defends -x: deepest outfielder -40, second-deepest -35.
    const players = [
      pl(0, 'GK', -44), pl(0, 'DF', -40), pl(0, 'DF', -35), pl(0, 'MF', -10),
      pl(1, 'GK', 44), pl(1, 'DF', 38), pl(1, 'DF', 30), pl(1, 'ST', -20),
    ];
    expect(defensiveLineX(players, 0)).toBe(-35);
    expect(defensiveLineX(players, 1)).toBe(30);
  });

  it('linesmanTargetX stays level with the line or the ball, inside his half', () => {
    // density相变 re-baseline (2026-07-20): coordinates are pitch-x, so they
    // scale with FIELD_SCALE; the clamp is HALF_L. Same law, scaled inputs.
    // Level with the second-last defender.
    expect(linesmanTargetX(1, 30 * FIELD_SCALE, 10 * FIELD_SCALE)).toBe(30 * FIELD_SCALE);
    // The ball is nearer the goal line — track the ball instead.
    expect(linesmanTargetX(1, 30 * FIELD_SCALE, 41 * FIELD_SCALE)).toBe(41 * FIELD_SCALE);
    // Play in the other half: he waits at halfway, never crosses.
    expect(linesmanTargetX(1, -20 * FIELD_SCALE, -30 * FIELD_SCALE)).toBe(0);
    // Never past the goal line; mirrored end works the same.
    expect(linesmanTargetX(1, 60, 0)).toBeLessThanOrEqual(HALF_L);
    expect(linesmanTargetX(-1, -30 * FIELD_SCALE, -41 * FIELD_SCALE)).toBe(-41 * FIELD_SCALE);
    expect(linesmanTargetX(-1, 20 * FIELD_SCALE, 30 * FIELD_SCALE)).toBe(-0);
  });
});

describe('bodyFor (Phase 76, pure)', () => {
  it('is deterministic per name, bounded, and strength-monotone in bulk', () => {
    expect(bodyFor('Zubat', 0.5)).toEqual(bodyFor('Zubat', 0.5));
    expect(hash01('Zubat')).toBe(hash01('Zubat'));
    const weak = bodyFor('Zubat', 0.1);
    const strong = bodyFor('Zubat', 0.9);
    expect(strong.bulk).toBeGreaterThan(weak.bulk);
    // Identity (height/skin/hair) hangs off the NAME alone — training in
    // the gym must not change who you are.
    expect(strong.height).toBe(weak.height);
    expect(strong.tone).toBe(weak.tone);
    expect(strong.hair).toBe(weak.hair);
    for (const n of ['Zubat', 'Eska', 'Ovie', 'Mirek', 'Yano']) {
      const b = bodyFor(n, 0.5);
      expect(b.height).toBeGreaterThanOrEqual(0.94);
      expect(b.height).toBeLessThanOrEqual(1.061);
      expect([0, 1, 2]).toContain(b.hair);
    }
    // Different names actually diverge somewhere (the point of the phase).
    const specs = ['Zubat', 'Eska', 'Ovie', 'Mirek', 'Yano', 'Kade', 'Brix'].map((n) => bodyFor(n, 0.5));
    expect(new Set(specs.map((s) => `${s.height}:${s.tone}:${s.hair}`)).size).toBeGreaterThan(3);
  });
});

describe('player scale honesty (Track F1)', () => {
  const ROLES = ['GK', 'DF', 'MF', 'WG', 'ST'] as const;

  it('no body the game can build is wider than the footprint the sim gives it', () => {
    // The anchor: the overlap solver holds centres PLAYER_MIN_DIST apart, so
    // any body wider than that intersects its marker during close marking.
    expect(maxArmSpan()).toBeLessThanOrEqual(PLAYER_MIN_DIST);
    for (const role of ROLES) {
      expect(armSpan(role, MAX_BODY_HEIGHT), role).toBeLessThanOrEqual(PLAYER_MIN_DIST);
    }
    // …and the unscaled model was NOT — the keeper spanned 1.63m and even a
    // midfielder 1.32m. That gap IS what F1 closed; if this ever stops being
    // true the shrink has become a taste choice instead of a correction.
    expect(maxArmSpan(1)).toBeGreaterThan(PLAYER_MIN_DIST);
    expect(armSpan('MF', 1, 1)).toBeCloseTo(1.32, 10);
  });

  it('the shrink is derived, not tuned: 0.64 is the LARGEST 0.01 step that fits', () => {
    expect(HUMAN_MODEL_SCALE).toBe(0.64);
    const next = Math.round((HUMAN_MODEL_SCALE + 0.01) * 100) / 100;
    expect(maxArmSpan(next)).toBeGreaterThan(PLAYER_MIN_DIST);
  });

  it('bodyFor stays inside the identity-height band the anchor was derived at', () => {
    for (const n of ['Zubat', 'Eska', 'Ovie', 'Mirek', 'Yano', 'Kade', 'Brix']) {
      expect(bodyFor(n, 0.5).height).toBeLessThanOrEqual(MAX_BODY_HEIGHT);
    }
  });
});

describe('style presets (Track F0, pure data)', () => {
  it('the default preset still reproduces the SHIPPED look, literal for literal', () => {
    // F0 must not change the game while it is only a showcase. If someone
    // edits `current`/night to make a screenshot look better, this fails.
    const p = stylePreset();
    expect([p.id, p.lighting]).toEqual([DEFAULT_STYLE, DEFAULT_LIGHTING]);
    expect(p.toneMapping).toBe('none'); // three's default — what shipped
    expect(p.exposure).toBe(1);
    expect(p.background).toBe(0x0b1220);
    expect(p.fog).toEqual({ color: 0x0b1220, near: 160, far: 320 });
    expect(p.hemi).toEqual({ sky: 0xbdd4ff, ground: 0x1c2b1e, intensity: 1.05 });
    expect(p.sun).toEqual({ color: 0xfff2df, intensity: 2.2, pos: [-40, 70, 30] });
    expect(p.ambient).toBeNull();
    expect(p.pedestal).toBe(0x111a2c);
    expect(p.grass.stripes).toBe(14);
    expect([p.grass.base, p.grass.stripeA, p.grass.stripeB]).toEqual(['#1f5c2e', '#2d7a3e', '#37904b']);
    expect(p.grass.wear).toBe(0);
    expect(p.lineAlpha).toBe(0.96);
    expect(p.lineWidth).toBe(0.24);
    expect(p.floodlights).toBe(true);
    expect(p.toon).toBe(false);
    expect(p.contactShadow).toBe(1);
  });

  it('every arm × lighting resolves and reports itself honestly', () => {
    for (const id of STYLE_IDS) {
      for (const lighting of LIGHTINGS) {
        const p = stylePreset(id, lighting);
        expect(p.id, `${id}/${lighting}`).toBe(id);
        expect(p.lighting, `${id}/${lighting}`).toBe(lighting);
      }
    }
    expect(isStyleId('toy')).toBe(true);
    expect(isStyleId('realism')).toBe(false);
    expect(isLighting('day')).toBe(true);
    expect(isLighting('dusk')).toBe(false);
  });

  it('no daylight arm leaves the floodlights burning', () => {
    // A lit lamp at noon is the exact incoherence Track F exists to kill.
    for (const id of STYLE_IDS) {
      expect(stylePreset(id, 'day').floodlights, id).toBe(false);
      expect(stylePreset(id, 'night').floodlights, id).toBe(true);
    }
  });

  it('denser turf grain uses FINER blobs (the first F0 pass painted bubbles)', () => {
    // 900 blobs at up to 2.55m radius stacked into visible soap bubbles.
    // Count and max radius must move in opposite directions.
    const byCount = STYLE_IDS
      .map((id) => stylePreset(id, 'night').grass)
      .sort((a, b) => a.grainCount - b.grainCount);
    for (let i = 1; i < byCount.length; i++) {
      expect(byCount[i].grainRadius[1]).toBeLessThan(byCount[i - 1].grainRadius[1]);
    }
  });
});

describe('refereeTarget (Phase 75, pure)', () => {
  it('shadows play, stands off the ball, stays inside the pitch', () => {
    // He tracks ends: deep ball at -x pulls him deep too.
    expect(refereeTarget(-40, 0).x).toBeLessThan(-20);
    expect(refereeTarget(40, 0).x).toBeGreaterThan(20);
    // Never crowds the ball (7m adjudicating stand-off), anywhere.
    for (const [bx, bz] of [[0, 0], [44, 20], [-44, -25], [10, -5], [30, 8]] as const) {
      const t = refereeTarget(bx, bz);
      expect(Math.hypot(t.x - bx, t.z - bz)).toBeGreaterThanOrEqual(6.99);
    }
    // Never enters the goalmouth picture: x stays ≥6m off the goal lines.
    expect(Math.abs(refereeTarget(45, 0).x)).toBeLessThanOrEqual(39 + 1e-9);
    expect(Math.abs(refereeTarget(-45, -28).x)).toBeLessThanOrEqual(39 + 1e-9);
  });
});

describe('cameraGoalFor', () => {
  const ball = { x: 20, z: -10, vx: 5, vz: 0 };

  it('returns finite goals for every non-orbit mode', () => {
    for (const mode of ['tactical', 'broadcast', 'follow', 'behindGoal', 'penalty'] as const) {
      const g = cameraGoalFor(mode, ball);
      for (const v of Object.values(g)) expect(Number.isFinite(v)).toBe(true);
      expect(g.py).toBeGreaterThan(0);
    }
  });

  it('penalty shot sits behind the taker looking at the goal (Phase 24)', () => {
    for (const sign of [1, -1] as const) {
      // density相变 re-baseline (2026-07-20): the penalty spot is a pitch-x
      // (scales), and the look-at is the goal line HALF_L (scales too).
      const spot = { x: sign * 35.6 * FIELD_SCALE, z: 0, vx: 0, vz: 0 };
      const g = cameraGoalFor('penalty', spot);
      expect(g.lx).toBe(sign * HALF_L); // frames the goal
      // Camera between halfway and the spot — behind the kicker, not the net.
      expect(Math.abs(g.px)).toBeLessThan(Math.abs(spot.x));
      expect(Math.sign(g.px)).toBe(sign);
      expect(g.py).toBeLessThan(7.5); // lower than the behind-goal gantry
    }
  });

  it('broadcast pans with the ball but clamps its travel', () => {
    const left = cameraGoalFor('broadcast', { x: -100, z: 0, vx: 0, vz: 0 });
    const right = cameraGoalFor('broadcast', { x: 100, z: 0, vx: 0, vz: 0 });
    expect(left.px).toBe(-28);
    expect(right.px).toBe(28);
  });

  it('tacfeed is the near-vertical everyone-in-frame analyst view (72)', () => {
    const g = cameraGoalFor('tacfeed', { x: 30, z: 10, vx: 5, vz: 0 });
    expect(g.py).toBeGreaterThan(70); // higher than every other mode
    expect(g.px).toBe(0); // static — the shapes carry the information
    expect(g.lx).toBe(0);
  });

  it('behindGoal sits behind the goal nearest the ball', () => {
    // density相变 re-baseline (2026-07-20): "behind the goal" = beyond the
    // (scaled) goal line HALF_L, not the old literal 45.
    expect(cameraGoalFor('behindGoal', { x: 30, z: 0, vx: 0, vz: 0 }).px).toBeGreaterThan(HALF_L);
    expect(cameraGoalFor('behindGoal', { x: -30, z: 0, vx: 0, vz: 0 }).px).toBeLessThan(-HALF_L);
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
