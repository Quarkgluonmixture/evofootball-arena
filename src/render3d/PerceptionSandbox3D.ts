import * as THREE from 'three';
import type {
  ObserverGaze, PerceptionSnapshot, PerceptionTruth,
} from '../ai/perceptionSnapshot';

/**
 * The read-only payload the sandbox draws: the honest truth of a tick, the
 * selected observer's private PerceptionSnapshot of that same tick, and the
 * synthetic awareness it was perceived at. Everything here is a copy — the
 * sandbox never touches sim/ai state, and no AI ever reads this back.
 */
export interface PerceptionView {
  readonly truth: PerceptionTruth;
  readonly snapshot: PerceptionSnapshot;
  readonly awareness: number;
  /** A scheduled visual scan fired on the tick this view was built. */
  readonly scanPulse: boolean;
  /** Hypothetical gaze from chooseAttentionGaze at the carrier (sub-toggle). */
  readonly whatIfGaze: ObserverGaze | null;
}

/** Sim x → world x, sim y → world z (RenderStateAdapter contract). */
const CONE_Y = 0.05;
const RING_Y = 0.06;
const GHOST_Y = 0.14;
const LINE_Y = 0.16;
const BALL_Y = 0.3;
const CONE_SEG = 48;
const MAX_GHOSTS = 24; // 2 teams × squad, comfortable headroom

/** Awareness-derived vision geometry — mirrors perceptionSnapshot.visible(). */
function coneRange(awareness: number): number {
  return 18 + awareness * 22;
}
function coneHalfAngle(awareness: number): number {
  return Math.acos(Math.max(-1, -0.2 - awareness * 0.5));
}
/** Scan/retention cadence — mirrors perceiveSnapshot() for the readout. */
function scanInterval(awareness: number): number {
  return Math.round(15 - awareness * 9);
}
function retention(awareness: number): number {
  return Math.round(15 + awareness * 45);
}

/** One filled facing-cone plus its outline; positions rewritten each frame. */
class Cone {
  readonly mesh: THREE.Mesh;
  readonly outline: THREE.Line;
  private meshPos: THREE.BufferAttribute;
  private outPos: THREE.BufferAttribute;

  constructor(color: number, opacity: number) {
    const geo = new THREE.BufferGeometry();
    this.meshPos = new THREE.BufferAttribute(new Float32Array((CONE_SEG + 2) * 3), 3);
    geo.setAttribute('position', this.meshPos);
    const idx: number[] = [];
    for (let i = 0; i < CONE_SEG; i++) idx.push(0, i + 1, i + 2);
    geo.setIndex(idx);
    this.mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
      color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false,
    }));
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;

    const outGeo = new THREE.BufferGeometry();
    // center → rim(0..SEG) → back to center
    this.outPos = new THREE.BufferAttribute(new Float32Array((CONE_SEG + 3) * 3), 3);
    outGeo.setAttribute('position', this.outPos);
    this.outline = new THREE.Line(outGeo, new THREE.LineBasicMaterial({
      color, transparent: true, opacity: Math.min(1, opacity + 0.55),
    }));
    this.outline.frustumCulled = false;
    this.outline.visible = false;
  }

  hide(): void {
    this.mesh.visible = false;
    this.outline.visible = false;
  }

  /** Aim from (ox,oz) along the world-plane unit dir (dx,dz). */
  setPose(ox: number, oz: number, dx: number, dz: number, range: number, half: number): void {
    this.meshPos.setXYZ(0, ox, CONE_Y, oz);
    this.outPos.setXYZ(0, ox, CONE_Y, oz);
    for (let i = 0; i <= CONE_SEG; i++) {
      const a = -half + (2 * half * i) / CONE_SEG;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const rx = dx * c - dz * s;
      const rz = dx * s + dz * c;
      const px = ox + range * rx;
      const pz = oz + range * rz;
      this.meshPos.setXYZ(i + 1, px, CONE_Y, pz);
      this.outPos.setXYZ(i + 1, px, CONE_Y, pz);
    }
    this.outPos.setXYZ(CONE_SEG + 2, ox, CONE_Y, oz);
    this.meshPos.needsUpdate = true;
    this.outPos.needsUpdate = true;
    this.mesh.visible = true;
    this.outline.visible = true;
  }
}

/**
 * B1 perception sandbox (read-only). Renders what ONE selected player's world
 * model actually contains: honest facing cone + range, memory ghosts at
 * believed positions (aged by opacity) with a line to the true position,
 * the believed ball, a scan pulse, and an optional hypothetical gaze cone.
 * Absence of a ghost is the point — an unobserved body simply has none.
 *
 * Owns its own THREE.Group and a small DOM readout. It never reads or writes
 * Match/players/ball/RNG/brains, and no AI ever consumes what it renders.
 */
export class PerceptionSandbox3D {
  readonly root = new THREE.Group();

  private liveCone = new Cone(0x38bdf8, 0.1);
  private gazeCone = new Cone(0xf59e0b, 0.09);
  private nearRing: THREE.Mesh;
  private pulseRing: THREE.Mesh;
  private pulseMat: THREE.MeshBasicMaterial;
  private pulseT = 0;
  private lastTick = -1;

  private ghosts: THREE.Mesh[] = [];
  private beliefLines: THREE.LineSegments;
  private beliefPos: THREE.BufferAttribute;
  private ballGhost: THREE.Mesh;
  private ballGhostMat: THREE.MeshBasicMaterial;
  private ballLine: THREE.Line;

  private readout: HTMLDivElement;

  constructor(host: HTMLElement) {
    this.root.add(this.liveCone.mesh, this.liveCone.outline, this.gazeCone.mesh, this.gazeCone.outline);

    const nearGeo = new THREE.RingGeometry(3.85, 4.05, 40);
    this.nearRing = new THREE.Mesh(nearGeo, new THREE.MeshBasicMaterial({
      color: 0x38bdf8, transparent: true, opacity: 0.35, side: THREE.DoubleSide,
    }));
    this.nearRing.rotation.x = -Math.PI / 2;
    this.nearRing.position.y = RING_Y;
    this.nearRing.visible = false;
    this.root.add(this.nearRing);

    this.pulseMat = new THREE.MeshBasicMaterial({
      color: 0xbae6fd, transparent: true, opacity: 0, side: THREE.DoubleSide,
    });
    this.pulseRing = new THREE.Mesh(new THREE.RingGeometry(0.7, 0.95, 40), this.pulseMat);
    this.pulseRing.rotation.x = -Math.PI / 2;
    this.pulseRing.position.y = RING_Y;
    this.pulseRing.visible = false;
    this.root.add(this.pulseRing);

    const ghostGeo = new THREE.RingGeometry(0.42, 0.66, 20);
    for (let i = 0; i < MAX_GHOSTS; i++) {
      const g = new THREE.Mesh(ghostGeo, new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false,
      }));
      g.rotation.x = -Math.PI / 2;
      g.position.y = GHOST_Y;
      g.visible = false;
      this.ghosts.push(g);
      this.root.add(g);
    }

    const lineGeo = new THREE.BufferGeometry();
    this.beliefPos = new THREE.BufferAttribute(new Float32Array(MAX_GHOSTS * 2 * 3), 3);
    lineGeo.setAttribute('position', this.beliefPos);
    this.beliefLines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
      color: 0x94a3b8, transparent: true, opacity: 0.5,
    }));
    this.beliefLines.frustumCulled = false;
    this.root.add(this.beliefLines);

    this.ballGhostMat = new THREE.MeshBasicMaterial({ color: 0xfde047, transparent: true, opacity: 0.8 });
    this.ballGhost = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), this.ballGhostMat);
    this.ballGhost.visible = false;
    this.root.add(this.ballGhost);

    const ballLineGeo = new THREE.BufferGeometry();
    ballLineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));
    this.ballLine = new THREE.Line(ballLineGeo, new THREE.LineBasicMaterial({
      color: 0xfde047, transparent: true, opacity: 0.55,
    }));
    this.ballLine.frustumCulled = false;
    this.ballLine.visible = false;
    this.root.add(this.ballLine);

    this.readout = document.createElement('div');
    this.readout.className = 'perception-readout hidden';
    this.readout.style.cssText = [
      'position:absolute', 'left:12px', 'bottom:12px', 'z-index:6',
      'padding:8px 11px', 'border-radius:8px', 'pointer-events:none',
      'background:rgba(9,14,24,0.72)', 'border:1px solid rgba(56,189,248,0.5)',
      'color:#e2e8f0', 'font:12px/1.5 ui-monospace,Menlo,monospace',
      'letter-spacing:0.02em', 'max-width:280px',
    ].join(';');
    host.appendChild(this.readout);
  }

  /** Remove the DOM readout; scene meshes are freed by the renderer's traverse. */
  dispose(): void {
    this.readout.remove();
  }

  private hideAll(): void {
    this.root.visible = false;
    this.readout.classList.add('hidden');
  }

  update(view: PerceptionView | null, dt: number): void {
    if (!view) {
      this.hideAll();
      this.lastTick = -1;
      this.pulseT = 0;
      return;
    }
    const { truth, snapshot, awareness } = view;
    const observer = truth.players.find((p) => p.gid === snapshot.observerGid);
    if (!observer || observer.sentOff) {
      this.hideAll();
      return;
    }
    this.root.visible = true;
    const ox = observer.pos.x;
    const oz = observer.pos.y;
    const range = coneRange(awareness);
    const half = coneHalfAngle(awareness);

    // Honest body-facing cone + near-field ring.
    const bd = observer.bodyDir;
    const blen = Math.hypot(bd.x, bd.y) || 1;
    this.liveCone.setPose(ox, oz, bd.x / blen, bd.y / blen, range, half);
    this.nearRing.position.set(ox, RING_Y, oz);
    this.nearRing.visible = true;

    // Hypothetical gaze cone (clearly labelled in the readout; never live).
    if (view.whatIfGaze) {
      const g = view.whatIfGaze.gazeDir;
      this.gazeCone.setPose(ox, oz, g.x, g.y, range, half);
    } else {
      this.gazeCone.hide();
    }

    // Memory ghosts: believed position (aged by opacity) + line to truth.
    const ret = retention(awareness);
    let n = 0;
    for (const obs of snapshot.players) {
      if (obs.gid === snapshot.observerGid) continue; // self is exact, no ghost
      if (n >= MAX_GHOSTS) break;
      const real = truth.players.find((p) => p.gid === obs.gid);
      const alpha = Math.max(0.12, 1 - obs.ageTicks / ret);
      const g = this.ghosts[n];
      const mat = g.material as THREE.MeshBasicMaterial;
      mat.color.setHex(obs.side === 0 ? 0x60a5fa : 0xf87171);
      mat.opacity = alpha;
      g.position.set(obs.pos.x, GHOST_Y, obs.pos.y);
      g.visible = true;
      // Belief-error tie line (only when we can see how wrong the belief is).
      this.beliefPos.setXYZ(n * 2, obs.pos.x, LINE_Y, obs.pos.y);
      if (real) this.beliefPos.setXYZ(n * 2 + 1, real.pos.x, LINE_Y, real.pos.y);
      else this.beliefPos.setXYZ(n * 2 + 1, obs.pos.x, LINE_Y, obs.pos.y);
      n++;
    }
    for (let i = n; i < MAX_GHOSTS; i++) this.ghosts[i].visible = false;
    this.beliefLines.geometry.setDrawRange(0, n * 2);
    this.beliefPos.needsUpdate = true;
    this.beliefLines.visible = n > 0;

    // Believed ball.
    if (snapshot.ball) {
      const b = snapshot.ball;
      const alpha = Math.max(0.15, 1 - b.ageTicks / ret);
      this.ballGhostMat.opacity = alpha;
      this.ballGhost.position.set(b.pos.x, BALL_Y, b.pos.y);
      this.ballGhost.visible = true;
      const bl = this.ballLine.geometry.getAttribute('position') as THREE.BufferAttribute;
      bl.setXYZ(0, b.pos.x, BALL_Y, b.pos.y);
      bl.setXYZ(1, truth.ball.pos.x, BALL_Y, truth.ball.pos.y);
      bl.needsUpdate = true;
      this.ballLine.visible = true;
    } else {
      this.ballGhost.visible = false;
      this.ballLine.visible = false;
    }

    // Scan pulse — fire once per new tick that ran a scheduled scan.
    if (snapshot.tick !== this.lastTick) {
      this.lastTick = snapshot.tick;
      if (view.scanPulse) this.pulseT = 1;
    }
    if (this.pulseT > 0) {
      this.pulseT = Math.max(0, this.pulseT - dt * 3);
      const scale = 1 + (1 - this.pulseT) * 5;
      this.pulseRing.position.set(ox, RING_Y, oz);
      this.pulseRing.scale.set(scale, scale, scale);
      this.pulseMat.opacity = this.pulseT * 0.6;
      this.pulseRing.visible = true;
    } else {
      this.pulseRing.visible = false;
    }

    // Readout.
    const ballAge = snapshot.ball ? `${snapshot.ball.ageTicks}t` : '—';
    this.readout.innerHTML =
      `<b style="color:#38bdf8">Perception sandbox</b> · observer #${snapshot.observerGid}<br>` +
      `synthetic awareness ${awareness.toFixed(2)} · scan ~${scanInterval(awareness)}t · memory ${ret}t<br>` +
      `ghosts ${n} · ball age ${ballAge}` +
      (view.whatIfGaze ? '<br><span style="color:#f59e0b">what-if gaze (hypothetical)</span>' : '');
    this.readout.classList.remove('hidden');
  }
}
