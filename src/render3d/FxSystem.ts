import * as THREE from 'three';
import type { FxEvent, RenderState } from './RenderStateAdapter';

/**
 * Event feedback: particle bursts (saves, interceptions) and floating xG
 * markers (shots). Consumes the RenderState `fx` stream and dedupes by event
 * time, so live play, fast-forward and replay scrubbing all trigger each
 * effect exactly once (reset() re-arms them for replays).
 * Pools are pre-allocated; per-frame work is position writes only.
 */

const BURST_N = 16;

class Burst {
  readonly points: THREE.Points;
  private vels = new Float32Array(BURST_N * 3);
  private life = -1;
  private mat: THREE.PointsMaterial;

  constructor() {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(BURST_N * 3), 3));
    this.mat = new THREE.PointsMaterial({
      size: 0.35,
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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

export class FxSystem {
  readonly root = new THREE.Group();
  private bursts = [new Burst(), new Burst(), new Burst()];
  private floaters = [new Floater(), new Floater(), new Floater()];
  private nextBurst = 0;
  private nextFloater = 0;
  private seen = new Set<string>();
  hooks: FxHooks | null = null;

  constructor() {
    for (const b of this.bursts) this.root.add(b.points);
    for (const f of this.floaters) this.root.add(f.sprite);
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
          if (gk) this.burst().fire(gk.x, 1.4, gk.z, 0x7dd3fc);
          break;
        }
        case 'interception': {
          this.burst().fire(state.ball.x, 0.6, state.ball.z, teamColors[fx.side]);
          break;
        }
        case 'goal': {
          this.burst().fire(state.ball.x, 1.0, state.ball.z, teamColors[fx.side]);
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
  }

  private burst(): Burst {
    return this.bursts[this.nextBurst++ % this.bursts.length];
  }
  private floater(): Floater {
    return this.floaters[this.nextFloater++ % this.floaters.length];
  }
}
