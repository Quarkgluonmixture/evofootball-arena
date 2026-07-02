import * as THREE from 'three';
import type { UiFlags } from '../ui/actions';
import type { OverlayState, RenderTheme } from './RenderStateAdapter';

const Y = 0.08; // just above the grass

/**
 * Tactical overlays in 3D — the same debugging channels as the 2D view,
 * driven by the same UiFlags. Everything is pre-allocated (line buffers,
 * marker pools) so per-frame updates only write positions.
 */
export class Overlays3D {
  readonly root = new THREE.Group();

  private passLine: THREE.Line;
  private shotLine: THREE.Line;
  private markLines: THREE.LineSegments;
  private markPositions: THREE.BufferAttribute;
  private formationMarkers: THREE.Mesh[] = [];
  private chaserRings: THREE.Mesh[] = [];

  constructor() {
    this.passLine = makeLine(0xfde047);
    this.shotLine = makeLine(0xef4444);

    const markGeo = new THREE.BufferGeometry();
    this.markPositions = new THREE.BufferAttribute(new Float32Array(16 * 2 * 3), 3);
    markGeo.setAttribute('position', this.markPositions);
    this.markLines = new THREE.LineSegments(
      markGeo,
      new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.6 }),
    );
    this.markLines.frustumCulled = false;

    const ringGeo = new THREE.RingGeometry(1.5, 1.75, 20);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf97316, transparent: true, opacity: 0.75, side: THREE.DoubleSide,
    });
    for (let i = 0; i < 4; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = Y;
      ring.visible = false;
      this.chaserRings.push(ring);
      this.root.add(ring);
    }

    this.root.add(this.passLine, this.shotLine, this.markLines);
  }

  /** Formation markers are team-colored — rebuilt when a match attaches. */
  applyTheme(theme: RenderTheme): void {
    for (const m of this.formationMarkers) {
      this.root.remove(m);
      (m.material as THREE.Material).dispose();
    }
    this.formationMarkers = [];
    const geo = new THREE.RingGeometry(0.28, 0.55, 4); // diamond-ish marker
    for (const p of theme.players) {
      const mat = new THREE.MeshBasicMaterial({
        color: theme.teams[p.side].primary, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
      });
      const m = new THREE.Mesh(geo, mat);
      m.rotation.x = -Math.PI / 2;
      m.position.y = Y;
      m.visible = false;
      this.formationMarkers.push(m);
      this.root.add(m);
    }
  }

  update(overlays: OverlayState | null, flags: UiFlags): void {
    const pass = flags.passLines ? overlays?.passLine : null;
    setLine(this.passLine, pass ?? null);
    const shot = flags.shotVector ? overlays?.shotLine : null;
    setLine(this.shotLine, shot ?? null);

    // Marking lines.
    let segs = 0;
    if (flags.marking && overlays) {
      for (const m of overlays.markLines.slice(0, 16)) {
        this.markPositions.setXYZ(segs * 2, m.x1, Y, m.z1);
        this.markPositions.setXYZ(segs * 2 + 1, m.x2, Y, m.z2);
        segs++;
      }
    }
    this.markLines.geometry.setDrawRange(0, segs * 2);
    this.markPositions.needsUpdate = true;
    this.markLines.visible = segs > 0;

    // Formation targets (marker index == theme player index == gid order).
    const showFormation = flags.formation && overlays !== null;
    for (let i = 0; i < this.formationMarkers.length; i++) {
      const marker = this.formationMarkers[i];
      const spot = showFormation ? overlays!.formation.find((f) => f.gid === i) : undefined;
      marker.visible = spot !== undefined;
      if (spot) marker.position.set(spot.x, Y, spot.z);
    }

    // Press rings — parked under the assigned chasers.
    const chasers = flags.chasers && overlays ? overlays.chasers : [];
    for (let i = 0; i < this.chaserRings.length; i++) {
      this.chaserRings[i].visible = i < chasers.length;
      this.chaserRings[i].userData.gid = chasers[i] ?? -1;
    }
  }

  /** Rings follow their player; called after player positions are known. */
  placeChaserRing(i: number, x: number, z: number): void {
    const ring = this.chaserRings[i];
    if (ring && ring.visible) ring.position.set(x, Y, z);
  }

  get activeChaserGids(): number[] {
    return this.chaserRings.filter((r) => r.visible).map((r) => r.userData.gid as number);
  }
}

function makeLine(color: number): THREE.Line {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3));
  const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 }));
  line.frustumCulled = false;
  line.visible = false;
  return line;
}

function setLine(line: THREE.Line, seg: { x1: number; z1: number; x2: number; z2: number } | null): void {
  line.visible = seg !== null;
  if (!seg) return;
  const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
  attr.setXYZ(0, seg.x1, Y + 0.3, seg.z1);
  attr.setXYZ(1, seg.x2, Y + 0.3, seg.z2);
  attr.needsUpdate = true;
}
