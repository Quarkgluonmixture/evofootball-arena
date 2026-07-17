import * as THREE from 'three';
import type { RenderState, RenderTheme } from './RenderStateAdapter';

/**
 * The tactical BROADCAST layer (Phase 68, N4): evolution made visible IN
 * PLAY, presentation-grade — this is TV graphics language, not the debug
 * overlays (those stay on their own flags).
 *
 *   block outline — a soft team-colored hull under the DEFENDING side's
 *     outfielders: compactness, depth and shape identity readable at a
 *     glance (a low-32 bus and a press-23 line look nothing alike).
 *   press waves — while the defending side hunts in Press mode, its
 *     assigned chasers emit expanding ring pulses: the pack is ON.
 *
 * Everything is pre-allocated (a fixed 5-triangle fan + a line loop + a
 * ring pool); per-frame work is position writes. Old replays carry no
 * possession/press fields — the layer simply stays dark.
 */

const BLOCK_Y = 0.045; // under the debug overlays (0.08), over the grass
const PULSE_LIFE = 0.9;
const PULSE_EVERY = 0.7;

interface Pulse {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  age: number; // ≥ PULSE_LIFE = free
}

export class BroadcastLayer {
  readonly root = new THREE.Group();
  private readonly fill: THREE.Mesh;
  private readonly fillPos: THREE.BufferAttribute;
  private readonly fillMat: THREE.MeshBasicMaterial;
  private readonly edge: THREE.LineLoop;
  private readonly edgePos: THREE.BufferAttribute;
  private readonly edgeMat: THREE.LineBasicMaterial;
  private readonly pulses: Pulse[] = [];
  private pulseTimer = 0;
  private teamColors: [number, number] = [0x60a5fa, 0xf59e0b];
  /** Debug/tests: the outline drew this frame. */
  blockVisible = false;
  /** Debug/tests: pulses fired since attach. */
  pulsesFired = 0;

  constructor() {
    // Hull fill: centroid-fan over ≤5 hull points = ≤5 triangles.
    const fillGeo = new THREE.BufferGeometry();
    this.fillPos = new THREE.BufferAttribute(new Float32Array(5 * 3 * 3), 3);
    fillGeo.setAttribute('position', this.fillPos);
    this.fillMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.09, depthWrite: false, side: THREE.DoubleSide,
    });
    this.fill = new THREE.Mesh(fillGeo, this.fillMat);
    this.fill.frustumCulled = false;
    this.fill.visible = false;

    const edgeGeo = new THREE.BufferGeometry();
    this.edgePos = new THREE.BufferAttribute(new Float32Array(5 * 3), 3);
    edgeGeo.setAttribute('position', this.edgePos);
    this.edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32 });
    this.edge = new THREE.LineLoop(edgeGeo, this.edgeMat);
    this.edge.frustumCulled = false;
    this.edge.visible = false;

    const ringGeo = new THREE.RingGeometry(0.85, 1.05, 22);
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(ringGeo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = BLOCK_Y + 0.01;
      mesh.visible = false;
      this.pulses.push({ mesh, mat, age: PULSE_LIFE });
      this.root.add(mesh);
    }
    this.root.add(this.fill, this.edge);
  }

  applyTheme(theme: RenderTheme): void {
    this.teamColors = [theme.teams[0].primary, theme.teams[1].primary];
    this.pulsesFired = 0;
  }

  update(state: RenderState | null, on: boolean, dt: number): void {
    // Live pulses keep animating even while spawning is off/paused.
    for (const p of this.pulses) {
      if (p.age >= PULSE_LIFE) continue;
      p.age += dt;
      if (p.age >= PULSE_LIFE) {
        p.mesh.visible = false;
        continue;
      }
      const k = p.age / PULSE_LIFE;
      const s = 1 + k * 1.9;
      p.mesh.scale.set(s, s, 1);
      p.mat.opacity = 0.38 * (1 - k);
    }

    const playing = state !== null && on && !state.shootout &&
      state.phase !== 'halftime' && state.phase !== 'fulltime';
    const possession = playing ? state.possession ?? -1 : -1;
    if (!playing || possession === -1) {
      this.fill.visible = false;
      this.edge.visible = false;
      this.blockVisible = false;
      return;
    }
    const defSide = (1 - possession) as 0 | 1;

    // ---- the defensive block hull ----
    const pts: Array<{ x: number; z: number }> = [];
    for (const p of state.players) {
      if (p.side === defSide && p.role !== 'GK') pts.push({ x: p.x, z: p.z });
    }
    const hull = convexHull(pts);
    if (hull.length >= 3) {
      // Small outward margin so bodies stand INSIDE their block.
      let cx = 0;
      let cz = 0;
      for (const h of hull) {
        cx += h.x;
        cz += h.z;
      }
      cx /= hull.length;
      cz /= hull.length;
      for (const h of hull) {
        const dx = h.x - cx;
        const dz = h.z - cz;
        const d = Math.hypot(dx, dz) || 1;
        h.x += (dx / d) * 1.2;
        h.z += (dz / d) * 1.2;
      }
      for (let i = 0; i < hull.length; i++) {
        const a = hull[i];
        const b = hull[(i + 1) % hull.length];
        this.fillPos.setXYZ(i * 3, cx, BLOCK_Y, cz);
        this.fillPos.setXYZ(i * 3 + 1, a.x, BLOCK_Y, a.z);
        this.fillPos.setXYZ(i * 3 + 2, b.x, BLOCK_Y, b.z);
        this.edgePos.setXYZ(i, a.x, BLOCK_Y + 0.005, a.z);
      }
      this.fill.geometry.setDrawRange(0, hull.length * 3);
      this.edge.geometry.setDrawRange(0, hull.length);
      this.fillPos.needsUpdate = true;
      this.edgePos.needsUpdate = true;
      const color = this.teamColors[defSide];
      this.fillMat.color.setHex(color);
      this.edgeMat.color.setHex(color);
      this.fill.visible = true;
      this.edge.visible = true;
      this.blockVisible = true;
    } else {
      this.fill.visible = false;
      this.edge.visible = false;
      this.blockVisible = false;
    }

    // ---- press waves: the defending pack hunting in Press mode ----
    this.pulseTimer -= dt;
    const pressing = state.modes?.[defSide] === 'Press' ? (state.press ?? []).filter((c) => c.side === defSide) : [];
    if (pressing.length > 0 && this.pulseTimer <= 0) {
      this.pulseTimer = PULSE_EVERY;
      for (const c of pressing.slice(0, 4)) {
        const free = this.pulses.find((p) => p.age >= PULSE_LIFE);
        if (!free) break;
        free.age = 0;
        free.mesh.position.set(c.x, BLOCK_Y + 0.01, c.z);
        free.mesh.scale.set(1, 1, 1);
        free.mat.color.setHex(this.teamColors[defSide]);
        free.mat.opacity = 0.38;
        free.mesh.visible = true;
        this.pulsesFired++;
      }
    }
  }
}

/** Gift-wrap convex hull for ≤5 points — tiny inputs, no allocations to
 * speak of. Returns points in winding order. */
function convexHull(pts: Array<{ x: number; z: number }>): Array<{ x: number; z: number }> {
  if (pts.length < 3) return pts.slice();
  let start = 0;
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].x < pts[start].x || (pts[i].x === pts[start].x && pts[i].z < pts[start].z)) start = i;
  }
  const hull: Array<{ x: number; z: number }> = [];
  let cur = start;
  do {
    hull.push(pts[cur]);
    let next = (cur + 1) % pts.length;
    for (let i = 0; i < pts.length; i++) {
      if (i === cur) continue;
      const cross =
        (pts[next].x - pts[cur].x) * (pts[i].z - pts[cur].z) -
        (pts[next].z - pts[cur].z) * (pts[i].x - pts[cur].x);
      if (cross < 0) next = i;
    }
    cur = next;
  } while (cur !== start && hull.length <= pts.length);
  return hull;
}
