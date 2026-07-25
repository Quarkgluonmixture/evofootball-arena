import * as THREE from 'three';
import { GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
import type { FxEvent, RenderState } from './RenderStateAdapter';
import { stylePreset, type StylePreset } from './stylePresets';

/**
 * Event feedback: particle bursts (saves, interceptions) and floating xG
 * markers (shots). Consumes the RenderState `fx` stream and dedupes by event
 * time, so live play, fast-forward and replay scrubbing all trigger each
 * effect exactly once (reset() re-arms them for replays).
 * Pools are pre-allocated; per-frame work is position writes only.
 */

const BURST_N = 16;
/**
 * ⚠️ The flame jets are BUILT BUT NOT SHIPPED — they render nothing, and I
 * could not find out why inside a reasonable budget. Kept, disabled, because
 * the code is sound-looking and the eliminated hypotheses are worth more to
 * the next attempt than a blank page:
 *
 *   · not vertex colours — removed them, still nothing;
 *   · not size — 6m points (≈36px at that range) still nothing;
 *   · not occlusion — moved from behind the goal line onto the pitch flanking
 *     the posts, in open view of every camera, still nothing;
 *   · not integration style — rewritten to mirror `Firework` exactly (closed
 *     form, positions written only in update), still nothing;
 *   · not a shader failure — console is clean, no THREE warnings;
 *   · not scene-graph — probe reports points.visible true, parent Scene,
 *     material opacity ~1, drawRange full, 90 positions, and the particles
 *     project to sensible on-screen NDC.
 *
 * The maddening part: `Firework` below is near-identical `THREE.Points` and
 * renders fine. Next attempt should probably try Sprites (the label path,
 * known-good here) rather than debug Points further.
 */
const PYRO_ENABLED = false;

/** Particles per flame jet, and jets per goal (F7). */
const PYRO_N = 90;
const PYRO_JETS = 4;
/** Particles in one firework shell's burst (F7). */
const SHELL_N = 70;

/**
 * A pyrotechnic flame jet (F7, user: "进球得有点特效比如烟花喷火之类的").
 * Stadium pyro: a column of particles launched hard upward with a slight
 * spread, cooling white-hot → orange → dark as it rises and falls back.
 * Fires only on a goal, when play is already stopped, so it can never hide
 * the ball or the shape (F-DIRECTION's rule).
 */
class Pyro {
  readonly points: THREE.Points;
  private vels = new Float32Array(PYRO_N * 3);
  private seeds = new Float32Array(PYRO_N);
  private ox = 0;
  private oz = 0;
  private life = -1;
  private mat: THREE.PointsMaterial;
  private static readonly DUR = 1.35;

  constructor(blending: THREE.Blending) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PYRO_N * 3), 3));
    this.mat = new THREE.PointsMaterial({
      // Sized for the camera that actually watches: from the broadcast gantry
      // the goal line is ~40m away, where a 0.5m point is four pixels and the
      // whole effect may as well not exist. 1.6m reads without dominating.
      //
      // Deliberately NOT vertexColors: a per-vertex-coloured PointsMaterial
      // compiled without error here and then drew absolutely nothing, while
      // the otherwise-identical Burst and Firework (which set material.color)
      // drew fine. Root cause not established; the whole-jet colour ramp below
      // is simpler anyway, and for a flame column it is visually equivalent.
      size: 1.6, color: 0xffffff, transparent: true, opacity: 0,
      depthWrite: false, blending,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    this.points.visible = false;
  }

  fire(x: number, z: number): void {
    this.ox = x;
    this.oz = z;
    for (let i = 0; i < PYRO_N; i++) {
      // Staggered launch so the column keeps feeding instead of puffing once.
      this.seeds[i] = (i / PYRO_N) * 0.55;
      const a = Math.random() * Math.PI * 2;
      const out = Math.random() * 0.5;
      this.vels[i * 3] = Math.cos(a) * out;
      this.vels[i * 3 + 1] = 9 + Math.random() * 6;
      this.vels[i * 3 + 2] = Math.sin(a) * out;
    }
    this.life = 0;
    this.points.visible = true;
  }

  update(dt: number): void {
    if (this.life < 0) return;
    this.life += dt;
    if (this.life >= Pyro.DUR) {
      this.life = -1;
      this.points.visible = false;
      return;
    }
    // Positions are computed from t rather than integrated, mirroring the
    // firework shell exactly — closed form, no drift, nothing carried between
    // frames.
    const pos = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < PYRO_N; i++) {
      const t = Math.max(0, this.life - this.seeds[i]);
      pos.setXYZ(
        i,
        this.ox + this.vels[i * 3] * t,
        Math.max(0.06, 0.06 + this.vels[i * 3 + 1] * t - 7.5 * t * t),
        this.oz + this.vels[i * 3 + 2] * t,
      );
    }
    pos.needsUpdate = true;
    // The whole jet cools together: white-hot, then flame orange, then ember.
    const k = Math.min(1, this.life / 0.95);
    this.mat.color.setRGB(1, 0.95 - k * 0.55, 0.72 - k * 0.62);
    this.mat.opacity = 1 - (this.life / Pyro.DUR) ** 2.2;
  }
}

/**
 * A firework shell (F7): rises above the stand on a fuse, then bursts into a
 * ring of coloured stars that fall under gravity. High FX quality only —
 * it is pure celebration and the phone budget buys the pyro first.
 */
class Firework {
  readonly points: THREE.Points;
  private vels = new Float32Array(SHELL_N * 3);
  private origin = new THREE.Vector3();
  private life = -1;
  private delay = 0;
  private mat: THREE.PointsMaterial;
  private static readonly FUSE = 0.75;
  private static readonly DUR = 2.4;

  constructor(blending: THREE.Blending) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SHELL_N * 3), 3));
    this.mat = new THREE.PointsMaterial({
      size: 1.7, color: 0xffffff, transparent: true, opacity: 0,
      depthWrite: false, blending,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    this.points.visible = false;
  }

  fire(x: number, z: number, peak: number, color: number, delay: number): void {
    this.origin.set(x, peak, z);
    this.delay = delay;
    this.mat.color.setHex(color);
    for (let i = 0; i < SHELL_N; i++) {
      // Spherical-ish shell, flattened so it reads as a ring from the side.
      const a = (i / SHELL_N) * Math.PI * 2;
      const tilt = (Math.random() - 0.5) * 1.1;
      const sp = 8 + Math.random() * 3.5;
      this.vels[i * 3] = Math.cos(a) * sp;
      this.vels[i * 3 + 1] = tilt * sp;
      this.vels[i * 3 + 2] = Math.sin(a) * sp;
    }
    this.life = 0;
    this.points.visible = true;
  }

  update(dt: number): void {
    if (this.life < 0) return;
    this.life += dt;
    const t = this.life - this.delay;
    const pos = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    if (t < 0) { this.mat.opacity = 0; return; }
    if (this.life >= this.delay + Firework.DUR) {
      this.life = -1;
      this.points.visible = false;
      return;
    }
    if (t < Firework.FUSE) {
      // The shell itself, climbing. All stars ride the same rising point.
      const rise = this.origin.y * (t / Firework.FUSE);
      for (let i = 0; i < SHELL_N; i++) pos.setXYZ(i, this.origin.x, rise, this.origin.z);
      this.mat.opacity = 0.85;
    } else {
      const b = t - Firework.FUSE;
      for (let i = 0; i < SHELL_N; i++) {
        pos.setXYZ(
          i,
          this.origin.x + this.vels[i * 3] * b,
          this.origin.y + this.vels[i * 3 + 1] * b - 4.2 * b * b,
          this.origin.z + this.vels[i * 3 + 2] * b,
        );
      }
      this.mat.opacity = Math.max(0, 1 - b / (Firework.DUR - Firework.FUSE)) ** 1.4;
    }
    pos.needsUpdate = true;
  }
}


class Burst {
  readonly points: THREE.Points;
  private vels = new Float32Array(BURST_N * 3);
  private life = -1;
  private mat: THREE.PointsMaterial;

  constructor(blending: THREE.Blending) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BURST_N * 3), 3));
    this.mat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending,
    });
    this.points = new THREE.Points(geo, this.mat);
    this.points.frustumCulled = false;
    this.points.visible = false;
  }

  fire(x: number, y: number, z: number, color: number): void {
    const pos = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < BURST_N; i++) {
      pos.setXYZ(i, x, y, z);
      const a = (i / BURST_N) * Math.PI * 2;
      const up = 2 + Math.random() * 3;
      const out = 1.5 + Math.random() * 2.5;
      this.vels[i * 3] = Math.cos(a) * out;
      this.vels[i * 3 + 1] = up;
      this.vels[i * 3 + 2] = Math.sin(a) * out;
    }
    pos.needsUpdate = true;
    this.mat.color.setHex(color);
    this.life = 0;
    this.points.visible = true;
  }

  update(dt: number): void {
    if (this.life < 0) return;
    this.life += dt;
    const DUR = 0.55;
    if (this.life >= DUR) {
      this.life = -1;
      this.points.visible = false;
      return;
    }
    const pos = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < BURST_N; i++) {
      this.vels[i * 3 + 1] -= 12 * dt; // gravity
      pos.setXYZ(
        i,
        pos.getX(i) + this.vels[i * 3] * dt,
        Math.max(0.05, pos.getY(i) + this.vels[i * 3 + 1] * dt),
        pos.getZ(i) + this.vels[i * 3 + 2] * dt,
      );
    }
    pos.needsUpdate = true;
    this.mat.opacity = 1 - this.life / DUR;
  }
}

class Floater {
  readonly sprite: THREE.Sprite;
  private tex: THREE.CanvasTexture;
  private canvas = document.createElement('canvas');
  private life = -1;

  constructor() {
    this.canvas.width = 192;
    this.canvas.height = 64;
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.tex, transparent: true, depthWrite: false, opacity: 0 }),
    );
    this.sprite.scale.set(4.6, 1.55, 1);
    this.sprite.visible = false;
  }

  fire(x: number, z: number, text: string, color: string): void {
    const ctx = this.canvas.getContext('2d')!;
    ctx.clearRect(0, 0, 192, 64);
    ctx.font = 'bold 34px monospace';
    ctx.textAlign = 'center';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(0,0,0,0.9)';
    ctx.fillStyle = color;
    ctx.strokeText(text, 96, 42);
    ctx.fillText(text, 96, 42);
    this.tex.needsUpdate = true;
    this.sprite.position.set(x, 2.2, z);
    this.life = 0;
    this.sprite.visible = true;
  }

  update(dt: number): void {
    if (this.life < 0) return;
    this.life += dt;
    const DUR = 1.3;
    if (this.life >= DUR) {
      this.life = -1;
      this.sprite.visible = false;
      return;
    }
    this.sprite.position.y += dt * 1.6;
    (this.sprite.material as THREE.SpriteMaterial).opacity =
      this.life < 0.15 ? this.life / 0.15 : 1 - (this.life - 0.15) / (DUR - 0.15);
  }
}

export interface FxHooks {
  /** A goal happened (side) — banner, net shake, sound... */
  onGoal: (side: 0 | 1) => void;
  /** A shot was struck — camera pulse, sound. */
  onShot: () => void;
  /** Any fx event, for optional sound hooks. */
  onEvent?: (type: FxEvent['type']) => void;
}

export type FxQuality = 'low' | 'medium' | 'high';

export class FxSystem {
  readonly root = new THREE.Group();
  private bursts: Burst[];
  private floaters = [new Floater(), new Floater(), new Floater()];
  private pyros: Pyro[];
  private shells: Firework[];
  private nextBurst = 0;
  private nextFloater = 0;
  private seen = new Set<string>();
  hooks: FxHooks | null = null;
  /** low = feedback without particles; high = celebratory extras (confetti). */
  quality: FxQuality = 'medium';

  constructor(style: StylePreset = stylePreset()) {
    // F7: blending is a STYLE choice, not a constant. Additive particles glow
    // beautifully against the old night diorama and all but vanish against a
    // bright daylight pitch — which is what F0 quietly did to every goal
    // celebration. Daylight arms get solid confetti instead.
    const blending = style.fxBlending === 'additive'
      ? THREE.AdditiveBlending
      : THREE.NormalBlending;
    this.bursts = Array.from({ length: 5 }, () => new Burst(blending));
    this.pyros = Array.from({ length: PYRO_JETS * 2 }, () => new Pyro(blending));
    this.shells = Array.from({ length: 3 }, () => new Firework(blending));
    for (const b of this.bursts) this.root.add(b.points);
    for (const f of this.floaters) this.root.add(f.sprite);
    for (const j of this.pyros) this.root.add(j.points);
    for (const sh of this.shells) this.root.add(sh.points);
  }

  /** Re-arm all effects (called when a replay jumps/scrubs or a match attaches). */
  reset(): void {
    this.seen.clear();
  }

  process(state: RenderState, teamColors: [number, number]): void {
    for (const fx of state.fx) {
      const key = `${fx.type}:${fx.t.toFixed(2)}`;
      if (this.seen.has(key)) continue;
      this.seen.add(key);
      if (this.seen.size > 400) this.seen.clear(); // unbounded-growth guard

      const particles = this.quality !== 'low';
      switch (fx.type) {
        case 'shot': {
          const label = fx.xg !== undefined ? `xG ${fx.xg.toFixed(2)}` : 'shot';
          this.floater().fire(state.ball.x, state.ball.z, label, '#fde047');
          this.hooks?.onShot();
          break;
        }
        case 'save': {
          // Burst at the saving side's keeper.
          const gk = state.players.find((p) => p.side === fx.side && p.role === 'GK');
          if (gk && particles) this.burst().fire(gk.x, 1.4, gk.z, 0x7dd3fc);
          break;
        }
        case 'interception': {
          if (particles) this.burst().fire(state.ball.x, 0.6, state.ball.z, teamColors[fx.side]);
          break;
        }
        case 'corner': {
          this.floater().fire(state.ball.x, state.ball.z, '⚑ corner', '#facc15');
          break;
        }
        case 'goal': {
          if (particles) this.burst().fire(state.ball.x, 1.0, state.ball.z, teamColors[fx.side]);
          if (this.quality === 'high') {
            // Confetti: two extra offset bursts in both kit colors.
            this.burst().fire(state.ball.x - 1.6, 1.6, state.ball.z + 1.2, teamColors[fx.side]);
            this.burst().fire(state.ball.x + 1.6, 1.9, state.ball.z - 1.2, 0xffffff);
          }
          // F7 pyro. Anchored on the GOAL, not the ball: the ball ends up
          // inside the net where the mesh hides it, and the goal line is
          // where the eye already is. Play is stopped, so nothing is masked.
          if (particles && PYRO_ENABLED) this.firePyro(Math.sign(state.ball.x) || 1);
          if (this.quality === 'high') this.fireShells(teamColors, fx.side);
          this.hooks?.onGoal(fx.side);
          break;
        }
      }
      this.hooks?.onEvent?.(fx.type);
    }
  }

  update(dt: number): void {
    for (const b of this.bursts) b.update(dt);
    for (const f of this.floaters) f.update(dt);
    for (const j of this.pyros) j.update(dt);
    for (const sh of this.shells) sh.update(dt);
  }

  /**
   * Flame jets at the end the ball just crossed. They stand just INSIDE the
   * goal line, flanking the posts and out by the corners — which is where a
   * real ground puts its pyro, and, less romantically, the only place every
   * camera can actually see them: behind the line they were hidden variously
   * by the net, the adboards and the goal-end crowd. Play is stopped when
   * these fire, so nothing on the pitch is masked.
   */
  private firePyro(endSign: number): void {
    const x = endSign * (HALF_L - 0.8);
    const inner = GOAL_WIDTH / 2 + 2.2;
    const outer = HALF_W - 1.5;
    const zs = [-outer, -inner, inner, outer];
    for (let i = 0; i < PYRO_JETS; i++) this.pyros[i].fire(x, zs[i]);
  }

  /** Three staggered shells over the main stand, in both kits plus white. */
  private fireShells(teamColors: [number, number], side: 0 | 1): void {
    const z = -HALF_W - 12;
    const colors = [teamColors[side], 0xffffff, teamColors[side]];
    for (let i = 0; i < this.shells.length; i++) {
      const x = (i - 1) * (HALF_L * 0.55);
      this.shells[i].fire(x, z, 17 + i * 2.5, colors[i], i * 0.32);
    }
  }

  private burst(): Burst {
    return this.bursts[this.nextBurst++ % this.bursts.length];
  }
  private floater(): Floater {
    return this.floaters[this.nextFloater++ % this.floaters.length];
  }
}
