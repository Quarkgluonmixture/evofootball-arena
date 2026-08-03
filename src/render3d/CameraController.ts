import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HALF_L, HALF_W } from '../sim/constants';
import { clamp } from '../utils/math';

export type CameraMode =
  | 'tactical' | 'tacfeed' | 'broadcast' | 'follow' | 'behindGoal' | 'orbit' | 'penalty'
  | 'celebration';

/** How long the goal cut holds the camera before it eases back (seconds). */
export const CELEBRATION_DUR = 2.8;

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
    case 'tacfeed':
      // The ANALYST feed (Phase 72, user design): the UEFA-tactical-cam
      // lesson — near-vertical, static, every player in frame at once, so
      // the SHAPES carry the information. The one camera where the
      // broadcast layer draws its tactical elements.
      return { px: 0, py: 84, pz: 26, lx: 0, ly: 0, lz: 0 };
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
      // goalmouth: look at a blend of the goal and the ball. Kept LOW
      // (Phase 27.1): from the old 7.5 m gantry the view looked down onto
      // the net roof and the goal read as a flat grate — from ~4 m the
      // posts, crossbar and back net read as a real box.
      const sign = ball.x >= 0 ? 1 : -1;
      const goalX = sign * HALF_L;
      return {
        px: sign * (HALF_L + 12),
        py: 5.0,
        pz: clamp(ball.z * 0.35, -6, 6),
        lx: goalX * 0.45 + ball.x * 0.55,
        ly: 1.0,
        lz: ball.z * 0.65,
      };
    }
    case 'celebration': {
      // The GOAL CUT (F7c). Every other camera here frames the BALL; this one
      // frames the celebration, because the ball is dead in the net and play
      // has stopped. Three things have to be in one shot: the flame jets at
      // the end the ball just crossed, the players' celebrate pose around it,
      // and the shells bursting high above the FAR stand — F7 shipped all
      // three and the default wide camera left the pyro in the top corner of
      // frame, half of it outside.
      //
      // Which is a framing problem with an arithmetic answer. From a corner
      // vantage 14 m beyond the goal line and 16 m up, the goalmouth sits ~28°
      // below the aim and a shell ~14° above it — both inside the 46° vertical
      // FOV's 23° half-angle. So aiming BETWEEN them (this look-at works out to
      // ~11° down) holds the whole celebration in one frame.
      //
      // `pz` is the subtle one, and it is a FLOODLIGHT clearance, not a framing
      // preference. The towers stand at |x| = HALF_L+8, |z| = HALF_W+7 with
      // 17 m masts, so a corner camera further out than that shoots straight
      // through one — at night the mast split the frame in half and the lamp
      // hung over the middle of the shot. Sitting INSIDE the tower ring in z
      // swings it ~70° off-axis, well outside the horizontal half-angle, while
      // the goal and the shells both stay in frame (the test does that sum).
      //
      // The end comes from the ball's side, the same way `behindGoal` and
      // `penalty` read it; the controller latches the ball at cut time so a
      // restart at the centre spot cannot swing the shot halfway through.
      const sign = ball.x >= 0 ? 1 : -1;
      return {
        px: sign * (HALF_L + 14),
        py: 16,
        pz: HALF_W + 4,
        lx: sign * HALF_L * 0.45,
        ly: 8,
        lz: -HALF_W * 0.25,
      };
    }
    case 'penalty': {
      // Pens TV shot (Phase 24): low, over the taker's shoulder, keeper and
      // goalmouth filling the frame — the behind-goal shot hides the diving
      // keeper behind the net at this range. Following the ball gives a
      // gentle damped push-in as the kick flies.
      const sign = ball.x >= 0 ? 1 : -1;
      return {
        px: ball.x - sign * 10.5,
        py: 4.6,
        pz: 5.2,
        lx: sign * HALF_L,
        ly: 1.3,
        lz: 0,
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
  /** Goal cut: elapsed seconds (-1 = idle) and the ball as it crossed. */
  private celebrateT = -1;
  private celebrateBall = { x: 0, z: 0, vx: 0, vz: 0 };

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

  /**
   * Cut to the celebration for `CELEBRATION_DUR`, then ease back to whatever
   * the viewer had chosen. `mode` is deliberately NOT reassigned: the cut is a
   * borrow, so the camera buttons keep showing the real selection and there is
   * no state to restore if a match ends mid-celebration.
   *
   * The ball is COPIED, not referenced. The kickoff that follows a goal puts it
   * back on the centre spot, and a live reference would swing the shot to the
   * wrong end halfway through the fireworks.
   */
  goalCut(ball: { x: number; z: number; vx: number; vz: number }): void {
    if (this.mode === 'orbit') return; // the viewer is flying it by hand
    this.celebrateT = 0;
    this.celebrateBall = { x: ball.x, z: ball.z, vx: ball.vx, vz: ball.vz };
  }

  /** For tooling and tests: is the goal cut currently holding the camera? */
  get celebrating(): boolean {
    return this.celebrateT >= 0;
  }

  update(ball: { x: number; z: number; vx: number; vz: number }, dt: number): void {
    if (this.mode === 'orbit') {
      this.controls?.update();
      return;
    }
    if (this.celebrateT >= 0) {
      this.celebrateT += dt;
      if (this.celebrateT >= CELEBRATION_DUR) this.celebrateT = -1;
    }
    // While the cut holds, the celebration framing REPLACES the mode's own —
    // damping does the rest, so the cut in and the return are both eased and
    // neither needs a second code path.
    const g = this.celebrateT >= 0
      ? cameraGoalFor('celebration', this.celebrateBall)
      : cameraGoalFor(this.mode, ball);

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
