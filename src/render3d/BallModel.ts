import * as THREE from 'three';
import type { RenderBall, RenderPlayer } from './RenderStateAdapter';

const RADIUS = 0.42; // slightly oversized for readability at tactical distance
const TRAIL_N = 16;
const UP = new THREE.Vector3(0, 1, 0); // sidespin axis (Phase 74)

/**
 * The match ball: patterned sphere that rolls with its velocity, gets a
 * purely visual vertical hop when kicked hard, leaves a motion trail
 * (brighter/warmer on shots), and shows a depth-ignoring marker cone when
 * hidden inside a crowd. Height/trail are synthesized here — the sim stays 2D
 * and authoritative.
 */
export class BallModel {
  readonly root = new THREE.Group();
  private mesh: THREE.Mesh;
  private axis = new THREE.Vector3();
  private hopT = -1;
  private hopDur = 0;
  private hopHeight = 0;
  private heldY = 0;
  private prevSpeed = 0;
  private prevOwned = false;

  private trail: THREE.Line;
  private trailMat: THREE.LineBasicMaterial;
  private trailPts: Array<{ x: number; y: number; z: number }> = [];

  private marker: THREE.Mesh;
  private markerPhase = 0;
  private carryCur = { x: 0, z: 0 };
  private blob: THREE.Mesh;

  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 20, 14),
      new THREE.MeshStandardMaterial({ map: ballTexture(), roughness: 0.4 }),
    );
    this.mesh.castShadow = true;
    this.mesh.position.y = RADIUS;
    this.root.add(this.mesh);

    // Grounding blob under the ball (follows the carry offset too).
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }),
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.03;
    this.blob = blob;
    this.root.add(blob);

    // Motion trail (world-space, so it is a sibling-independent child of root's parent — we
    // keep it in root but write absolute-relative positions each frame instead).
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL_N * 3), 3));
    this.trailMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 });
    this.trail = new THREE.Line(trailGeo, this.trailMat);
    this.trail.frustumCulled = false;
    this.trail.visible = false;

    // Crowd marker: a small always-on-top cone pointing down at the ball.
    this.marker = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.55, 4),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthTest: false }),
    );
    this.marker.rotation.x = Math.PI;
    this.marker.renderOrder = 20;
    this.marker.visible = false;
    this.root.add(this.marker);
  }

  /** The trail lives in world space; add it to the scene next to root. */
  get worldTrail(): THREE.Line {
    return this.trail;
  }

  get markerVisible(): boolean {
    return this.marker.visible;
  }

  get trailVisible(): boolean {
    return this.trail.visible;
  }

  update(
    ball: RenderBall,
    players: RenderPlayer[],
    dt: number,
    hands: { x: number; y: number; z: number; t: number } | null = null,
    carry: { dx: number; dz: number } | null = null,
  ): void {
    this.root.position.set(ball.x, 0, ball.z);
    // The dribble read (Phase 76): ease toward the carrier's display offset
    // (pushed ahead at speed, screened from the presser when slow) and back
    // to the true spot the moment the ball is loose. Display-only.
    const cx = carry ? carry.dx : 0;
    const cz = carry ? carry.dz : 0;
    const ease = Math.min(1, dt * 7);
    this.carryCur.x += (cx - this.carryCur.x) * ease;
    this.carryCur.z += (cz - this.carryCur.z) * ease;

    const owned = ball.ownerGid !== null;
    const realH = ball.y ?? 0; // sim height (Phase 28); 0 in old replays
    // Kick detection: the ball leaves a player's feet with a burst of speed.
    // Only synthesize the visual hop for GROUND kicks — lofted balls carry
    // their real trajectory from the sim.
    if (!owned && realH <= 0.02 && ball.speed > 9 && (this.prevOwned || ball.speed > this.prevSpeed + 7)) {
      this.hopDur = Math.min(1.1, 0.35 + ball.speed * 0.02);
      this.hopHeight = Math.min(1.8, ball.speed * 0.055);
      this.hopT = 0;
    }
    if (owned || realH > 0.02) this.hopT = -1;

    let h = realH;
    if (this.hopT >= 0) {
      this.hopT += dt;
      const p = this.hopT / this.hopDur;
      if (p >= 1) this.hopT = -1;
      else h = Math.sin(Math.PI * p) * this.hopHeight;
    }
    // Keeper hold (Phase 27.2): the ball rides up into the hands and back
    // down as the keeper releases it — the "uses their hands" read.
    this.heldY = ball.heldByGk
      ? Math.min(0.95, this.heldY + dt * 5)
      : Math.max(0, this.heldY - dt * 5);
    this.mesh.position.set(this.carryCur.x, RADIUS + h + this.heldY, this.carryCur.z);
    this.blob.position.x = this.carryCur.x;
    this.blob.position.z = this.carryCur.z;
    // A tilted owner's hands carry it (31.9): blend the held ball toward
    // the hands anchor by tilt fraction — a diving keeper's catch sweeps
    // with the dive and eases back as he picks himself up. Render-only.
    if (hands && hands.t > 0) {
      this.mesh.position.set(
        this.mesh.position.x + (hands.x - ball.x - this.mesh.position.x) * hands.t,
        this.mesh.position.y + (hands.y - this.mesh.position.y) * hands.t,
        this.mesh.position.z + (hands.z - ball.z - this.mesh.position.z) * hands.t,
      );
    }

    // Roll around the axis perpendicular to travel.
    if (ball.speed > 0.2 && h < 0.05) {
      this.axis.set(-ball.vz, 0, ball.vx).normalize();
      this.mesh.rotateOnWorldAxis(this.axis, (ball.speed * dt) / RADIUS);
    }
    // Visible sidespin (Phase 74): a curled ball rotates about the vertical
    // axis. The sim's `spin` is the PATH's turn rate (rad/s) — small by
    // construction; the ball itself spins far faster (that's what bends
    // it), so scale up until the pattern visibly whirls in flight.
    if (!owned && ball.spin && Math.abs(ball.spin) > 0.03 && ball.speed > 4) {
      this.mesh.rotateOnWorldAxis(UP, ball.spin * 16 * dt);
    }

    this.updateTrail(ball, h);
    this.updateMarker(ball, players, dt);

    this.prevSpeed = ball.speed;
    this.prevOwned = owned;
  }

  private updateTrail(ball: RenderBall, h: number): void {
    // Record while the ball travels fast; fade out when it settles.
    if (ball.speed > 7 && ball.ownerGid === null) {
      this.trailPts.push({ x: ball.x, y: RADIUS + h, z: ball.z });
      if (this.trailPts.length > TRAIL_N) this.trailPts.shift();
    } else if (this.trailPts.length > 0) {
      this.trailPts.shift(); // shrink from the tail when slow
    }
    const n = this.trailPts.length;
    this.trail.visible = n >= 2;
    if (n < 2) return;
    const pos = this.trail.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < n; i++) pos.setXYZ(i, this.trailPts[i].x, this.trailPts[i].y, this.trailPts[i].z);
    pos.needsUpdate = true;
    this.trail.geometry.setDrawRange(0, n);
    // Shots burn hotter than passes.
    this.trailMat.color.setHex(ball.isShot ? 0xffb14d : 0xffffff);
    this.trailMat.opacity = ball.isShot ? 0.85 : 0.4;
  }

  private updateMarker(ball: RenderBall, players: RenderPlayer[], dt: number): void {
    // Show the marker when the ball sits inside a crowd (>=2 players close).
    let crowd = 0;
    for (const p of players) {
      const dx = p.x - ball.x;
      const dz = p.z - ball.z;
      if (dx * dx + dz * dz < 2.4 * 2.4) crowd++;
      if (crowd >= 2) break;
    }
    this.marker.visible = crowd >= 2;
    if (this.marker.visible) {
      this.markerPhase += dt * 5;
      this.marker.position.y = 2.7 + Math.sin(this.markerPhase) * 0.15;
    }
  }
}

function ballTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#f5f7fa';
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = '#20242c';
  for (let i = 0; i < 8; i++) {
    const x = (i % 4) * 32 + (i < 4 ? 8 : 24);
    const y = i < 4 ? 16 : 44;
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
