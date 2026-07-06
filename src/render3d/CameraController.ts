import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HALF_L } from '../sim/constants';
import { clamp } from '../utils/math';

export type CameraMode = 'tactical' | 'broadcast' | 'follow' | 'behindGoal' | 'orbit';

export interface CameraGoal {
  px: number;
  py: number;
  pz: number;
  lx: number;
  ly: number;
  lz: number;
}

/**
 * Pure per-mode camera goal (position + look-at) from the ball state — kept
 * free of three.js math so it's trivially unit-testable. The controller
 * damps toward this goal; it never snaps.
 */
export function cameraGoalFor(
  mode: Exclude<CameraMode, 'orbit'>,
  ball: { x: number; z: number; vx: number; vz: number },
): CameraGoal {
  switch (mode) {
    case 'tactical':
      // High angled full-pitch view: formations readable, both goals + corner
      // flags inside the frame.
      return { px: 0, py: 62, pz: 47, lx: 0, ly: 0, lz: 2 };
    case 'broadcast': {
      // TV gantry on the +z sideline. Pans with play, pushes in as the ball
      // enters a final third (attack), pulls back through midfield
      // transitions. Look-ahead follows ball velocity so play leads the frame.
      const attack = clamp((Math.abs(ball.x) - 12) / 28, 0, 1);
      const px = clamp(ball.x * 0.72 + ball.vx * 0.35, -28, 28);
      return {
        px,
        py: 19 - attack * 4.5,
        pz: 39 - attack * 7,
        lx: clamp(ball.x * 0.88 + ball.vx * 0.45, -38, 38),
        ly: 0.5,
        lz: clamp(ball.z * 0.55, -9, 9),
      };
    }
    case 'follow': {
      // Chase cam: higher and further back than a drone shot, with velocity
      // look-ahead — damped hard in update() to avoid motion sickness.
      return {
        px: clamp(ball.x, -HALF_L + 4, HALF_L - 4),
        py: 13,
        pz: ball.z + 18,
        lx: ball.x + ball.vx * 0.6,
        ly: 0.4,
        lz: ball.z + ball.vz * 0.6,
      };
    }
    case 'behindGoal': {
      // Sit behind whichever goal the ball is closer to and frame the
      // goalmouth: look at a blend of the goal and the ball.
      const sign = ball.x >= 0 ? 1 : -1;
      const goalX = sign * HALF_L;
      return {
        px: sign * (HALF_L + 13),
        py: 7.5,
        pz: clamp(ball.z * 0.35, -6, 6),
        lx: goalX * 0.45 + ball.x * 0.55,
        ly: 0.8,
        lz: ball.z * 0.65,
      };
    }
  }
}

/** Which camera best presents a replayed event (pure; unit-tested). */
export function cameraForEvent(type: 'goal' | 'shot' | 'save' | 'interception'): CameraMode {
  switch (type) {
    case 'goal':
      return 'behindGoal';
    case 'shot':
      return 'broadcast';
    case 'save':
      return 'behindGoal';
    case 'interception':
      return 'tactical';
  }
}

export class CameraController {
  readonly camera: THREE.PerspectiveCamera;
  mode: CameraMode = 'tactical';
  private look = new THREE.Vector3(0, 0, 0);
  private controls: OrbitControls | null = null;
  private domElement: HTMLElement;
  private pulseT = -1;

  constructor(aspect: number, domElement: HTMLElement) {
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.5, 500);
    this.domElement = domElement;
    const g = cameraGoalFor('tactical', { x: 0, z: 0, vx: 0, vz: 0 });
    this.camera.position.set(g.px, g.py, g.pz);
    this.look.set(g.lx, g.ly, g.lz);
    this.camera.lookAt(this.look);
  }

  setMode(mode: CameraMode): void {
    this.mode = mode;
    if (mode === 'orbit') {
      if (!this.controls) {
        this.controls = new OrbitControls(this.camera, this.domElement);
        this.controls.enableDamping = true;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
        this.controls.minDistance = 8;
        this.controls.maxDistance = 160;
      }
      this.controls.target.copy(this.look);
      this.controls.enabled = true;
    } else if (this.controls) {
      this.controls.enabled = false;
    }
  }

  reset(): void {
    if (this.mode === 'orbit' && this.controls) {
      const g = cameraGoalFor('tactical', { x: 0, z: 0, vx: 0, vz: 0 });
      this.camera.position.set(g.px, g.py, g.pz);
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
  }

  /** Brief push-in toward the action (used on shots). */
  pulse(): void {
    this.pulseT = 0;
  }

  update(ball: { x: number; z: number; vx: number; vz: number }, dt: number): void {
    if (this.mode === 'orbit') {
      this.controls?.update();
      return;
    }
    const g = cameraGoalFor(this.mode, ball);

    // Shot pulse: momentarily move the position goal toward the look target.
    if (this.pulseT >= 0) {
      this.pulseT += dt;
      const DUR = 0.9;
      if (this.pulseT >= DUR) this.pulseT = -1;
      else {
        const w = Math.sin((this.pulseT / DUR) * Math.PI) * 0.12;
        g.px += (g.lx - g.px) * w;
        g.py += (g.ly - g.py) * w;
        g.pz += (g.lz - g.pz) * w;
      }
    }

    // Exponential damping — frame-rate independent smoothing, no snapping.
    // Follow cam damps harder (motion-sickness guard); look leads slightly.
    const base = this.mode === 'follow' ? 1.9 : 2.6;
    const k = 1 - Math.exp(-dt * base);
    const kl = 1 - Math.exp(-dt * base * 1.35);
    this.camera.position.x += (g.px - this.camera.position.x) * k;
    this.camera.position.y += (g.py - this.camera.position.y) * k;
    this.camera.position.z += (g.pz - this.camera.position.z) * k;
    this.look.x += (g.lx - this.look.x) * kl;
    this.look.y += (g.ly - this.look.y) * kl;
    this.look.z += (g.lz - this.look.z) * kl;
    this.camera.lookAt(this.look);
  }

  dispose(): void {
    this.controls?.dispose();
  }
}
