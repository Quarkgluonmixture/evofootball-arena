import * as THREE from 'three';
import { terraceSlabs } from './PitchModel';

/**
 * The LIVING crowd (Phase 66.1, user ask: the stands need actions too).
 * Same silhouette as the Phase-31.6 seated crowd — deterministic LCG
 * layout, two InstancedMeshes (~300 bodies + heads = 2 draw calls) — but
 * the instances now belong to the renderer's update loop:
 *
 *   idle    — a slow, quiet sway (alive, not a texture)
 *   ripple  — shots, saves, corners: a brief half-rise ("ooh")
 *   erupt   — goals: everybody jumps, each on his own beat, ~2.6s decay
 *
 * Per-frame cost is ~600 matrix writes + 2 buffer uploads — phone-safe.
 * Render-only; fed by FxSystem's deduped hooks, so live play, skip and
 * replay scrubbing each fire a reaction exactly once.
 */

interface Seat {
  x: number;
  y: number;
  z: number;
  /** Personal animation phase — the crowd never moves in lockstep. */
  phase: number;
  /** How high this fan jumps when the stands erupt (0.5–1). */
  eager: number;
}

export class CrowdSystem {
  readonly root = new THREE.Group();
  private readonly bodies: THREE.InstancedMesh;
  private readonly heads: THREE.InstancedMesh;
  private readonly seats: Seat[] = [];
  private readonly m4 = new THREE.Matrix4();
  private t = 0;
  /** Current arousal 0..1 — jumps on events, decays toward calm. */
  private excitement = 0;

  constructor() {
    let lcg = 987654321;
    const rand = () => ((lcg = (lcg * 48271) % 2147483647) / 2147483647);
    const palette = [0x33415e, 0x475c85, 0x8294b5, 0x4ade80, 0xf59e0b, 0xe2e8f0, 0x60a5fa, 0x1d3a5f];
    const colors: number[] = [];
    for (const s of terraceSlabs()) {
      const usable = s.w - 2;
      const n = Math.floor(usable / 1.15);
      for (let i = 0; i < n; i++) {
        if (rand() < 0.22) continue; // empty seats keep it from reading as a texture
        const along = -usable / 2 + (i + 0.5) * (usable / n) + (rand() - 0.5) * 0.3;
        this.seats.push({
          x: s.x + Math.cos(s.rot) * along,
          y: s.y + 0.36 + rand() * 0.06,
          z: s.z - Math.sin(s.rot) * along,
          phase: rand() * Math.PI * 2,
          eager: 0.5 + rand() * 0.5,
        });
        colors.push(palette[Math.floor(rand() * palette.length)]);
      }
    }
    this.bodies = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.42, 0.72, 0.34),
      new THREE.MeshStandardMaterial({ roughness: 0.9 }),
      this.seats.length,
    );
    this.heads = new THREE.InstancedMesh(
      new THREE.SphereGeometry(0.16, 6, 5),
      new THREE.MeshStandardMaterial({ color: 0xd9b99b, roughness: 0.85 }),
      this.seats.length,
    );
    const color = new THREE.Color();
    this.seats.forEach((s, i) => {
      this.m4.makeTranslation(s.x, s.y, s.z);
      this.bodies.setMatrixAt(i, this.m4);
      this.bodies.setColorAt(i, color.setHex(colors[i]));
      this.m4.makeTranslation(s.x, s.y + 0.5, s.z);
      this.heads.setMatrixAt(i, this.m4);
    });
    if (this.bodies.instanceColor) this.bodies.instanceColor.needsUpdate = true;
    // The stands span the whole diorama — default sphere culling blinks
    // them out at oblique camera angles once instances start moving.
    this.bodies.frustumCulled = false;
    this.heads.frustumCulled = false;
    this.root.add(this.bodies, this.heads);
  }

  /** A goal: the full eruption. */
  erupt(): void {
    this.excitement = 1;
  }

  /** A near-thing (shot, save, corner): rise toward `strength`, never calm DOWN. */
  ripple(strength: number): void {
    this.excitement = Math.max(this.excitement, strength);
  }

  /** Current arousal (debug/tests). */
  get arousal(): number {
    return this.excitement;
  }

  get count(): number {
    return this.seats.length;
  }

  update(dt: number): void {
    this.t += dt;
    this.excitement = Math.max(0, this.excitement - dt / 2.6);
    const ex = this.excitement;
    const t = this.t;
    for (let i = 0; i < this.seats.length; i++) {
      const s = this.seats[i];
      // Idle sway breathes; the jump is a personal beat — only its upward
      // half, so fans land back IN their seats, not below them.
      const bob = Math.sin(t * 1.1 + s.phase) * 0.035;
      const jump = ex * s.eager * Math.max(0, Math.sin(t * 7 + s.phase)) * 0.5;
      const y = s.y + bob + jump;
      this.m4.makeTranslation(s.x, y, s.z);
      this.bodies.setMatrixAt(i, this.m4);
      this.m4.makeTranslation(s.x, y + 0.5, s.z);
      this.heads.setMatrixAt(i, this.m4);
    }
    this.bodies.instanceMatrix.needsUpdate = true;
    this.heads.instanceMatrix.needsUpdate = true;
  }
}
