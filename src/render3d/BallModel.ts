import * as THREE from 'three';
import type { RenderBall, RenderPlayer } from './RenderStateAdapter';

const RADIUS = 0.42; // slightly oversized for readability at tactical distance
const TRAIL_N = 16;

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
  private prevSpeed = 0;
  private prevOwned = false;

  private trail: THREE.Line;
  private trailMat: THREE.LineBasicMaterial;
  private trailPts: Array<{ x: number; y: number; z: number }> = [];

  private marker: THREE.Mesh;
  private markerPhase = 0;

  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 20, 14),
      new THREE.MeshStandardMaterial({ map: ballTexture(), roughness: 0.4 }),
    );
    this.mesh.castShadow = true;
    this.mesh.position.y = RADIUS;
    this.root.add(this.mesh);

    // Grounding blob under the ball.
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }),
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.03;
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

  update(ball: RenderBall, players: RenderPlayer[], dt: number): void {
    this.root.position.set(ball.x, 0, ball.z);

    const owned = ball.ownerGid !== null;
    // Kick detection: the ball leaves a player's feet with a burst of speed.
    if (!owned && ball.speed > 9 && (this.prevOwned || ball.speed > this.prevSpeed + 7)) {
      this.hopDur = Math.min(1.1, 0.35 + ball.speed * 0.02);
      this.hopHeight = Math.min(1.8, ball.speed * 0.055);
      this.hopT = 0;
    }
    if (owned) this.hopT = -1;

    let h = 0;
    if (this.hopT >= 0) {
      this.hopT += dt;
      const p = this.hopT / this.hopDur;
      if (p >= 1) this.hopT = -1;
      else h = Math.sin(Math.PI * p) * this.hopHeight;
    }
    this.mesh.position.y = RADIUS + h;

    // Roll around the axis perpendicular to travel.
    if (ball.speed > 0.2 && h < 0.05) {
      this.axis.set(-ball.vz, 0, ball.vx).normalize();
      this.mesh.rotateOnWorldAxis(this.axis, (ball.speed * dt) / RADIUS);
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
