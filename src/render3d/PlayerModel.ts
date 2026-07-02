import * as THREE from 'three';
import type { Role } from '../sim/types';
import type { AnimName } from './AnimationSystem';

/**
 * Procedural low-poly footballer: torso/head/arms/legs/feet built from shared
 * geometries; team kit via primary/secondary materials (goalkeepers wear the
 * inverted kit, like the 2D view). A billboard sprite above the head shows
 * role + name, plus the current action when the labels overlay is on.
 *
 * Joint hierarchy (all pivots chosen so AnimationSystem can pose it):
 *   root (pitch position, yaw, hop)
 *     lean (hip pivot, forward/side lean)  -> torso, head, armL, armR
 *     legL, legR (hip pivots)              -> thigh+sock+foot
 *     selectRing (flat ring on the grass)
 *     label (sprite billboard)
 */

/* Shared geometries — created once, reused by all 10 players. */
let GEO: {
  torso: THREE.BoxGeometry;
  head: THREE.SphereGeometry;
  arm: THREE.BoxGeometry;
  thigh: THREE.BoxGeometry;
  sock: THREE.BoxGeometry;
  foot: THREE.BoxGeometry;
  hips: THREE.BoxGeometry;
  ring: THREE.RingGeometry;
} | null = null;

function sharedGeo(): NonNullable<typeof GEO> {
  if (GEO) return GEO;
  const translate = (g: THREE.BoxGeometry, y: number) => {
    g.translate(0, y, 0);
    return g;
  };
  GEO = {
    torso: new THREE.BoxGeometry(0.86, 0.95, 0.5),
    head: new THREE.SphereGeometry(0.3, 12, 10),
    // Limbs pivot at their top: translate geometry downward by half height.
    arm: translate(new THREE.BoxGeometry(0.2, 0.78, 0.2), -0.39),
    thigh: translate(new THREE.BoxGeometry(0.26, 0.55, 0.28), -0.27),
    sock: translate(new THREE.BoxGeometry(0.22, 0.42, 0.24), -0.76),
    foot: translate(new THREE.BoxGeometry(0.24, 0.16, 0.5), -1.0),
    hips: new THREE.BoxGeometry(0.8, 0.34, 0.46),
    ring: new THREE.RingGeometry(0.75, 0.98, 24),
  };
  return GEO;
}

const SKIN = new THREE.MeshStandardMaterial({ color: 0xe0b089, roughness: 0.8 });
const DARK = new THREE.MeshStandardMaterial({ color: 0x1c1f26, roughness: 0.8 });

export interface KitMaterials {
  shirt: THREE.MeshStandardMaterial;
  shorts: THREE.MeshStandardMaterial;
  sock: THREE.MeshStandardMaterial;
}

export function makeKit(primary: number, secondary: number): KitMaterials {
  return {
    shirt: new THREE.MeshStandardMaterial({ color: primary, roughness: 0.7 }),
    shorts: new THREE.MeshStandardMaterial({ color: secondary, roughness: 0.75 }),
    sock: new THREE.MeshStandardMaterial({ color: primary, roughness: 0.8 }),
  };
}

export function disposeKit(kit: KitMaterials): void {
  kit.shirt.dispose();
  kit.shorts.dispose();
  kit.sock.dispose();
}

const HIP_Y = 1.06;

export class PlayerModel {
  readonly root = new THREE.Group();
  readonly lean = new THREE.Group();
  readonly legL: THREE.Group;
  readonly legR: THREE.Group;
  readonly armL: THREE.Group;
  readonly armR: THREE.Group;
  private selectRing: THREE.Mesh;
  private selectHalo!: THREE.Mesh;
  private blob!: THREE.Mesh;
  private label: THREE.Sprite;
  private labelCanvas = document.createElement('canvas');
  private labelTex: THREE.CanvasTexture;
  private labelDrawn = '';

  /* Animation state owned by AnimationSystem. */
  phase = 0;
  animTime = 0;
  kickT = -1;
  kickPower = 1;
  prevAnim: AnimName = 'idle';

  readonly gid: number;
  private name: string;
  private role: Role;
  private labelColor: string;

  constructor(gid: number, role: Role, name: string, kit: KitMaterials, labelColor: string) {
    this.gid = gid;
    this.role = role;
    this.name = name;
    this.labelColor = labelColor;
    const g = sharedGeo();

    // Upper body pivots at the hips.
    this.lean.position.y = HIP_Y;
    const torso = new THREE.Mesh(g.torso, kit.shirt);
    torso.position.y = 0.62;
    torso.castShadow = true;
    const head = new THREE.Mesh(g.head, SKIN);
    head.position.y = 1.32;
    head.castShadow = true;
    const hips = new THREE.Mesh(g.hips, kit.shorts);
    hips.position.y = 0.06;
    this.armL = limb(g.arm, kit.shirt, -0.55, 1.0);
    this.armR = limb(g.arm, kit.shirt, 0.55, 1.0);
    this.lean.add(torso, head, hips, this.armL, this.armR);

    // Legs pivot at the hips too (siblings of the lean group so the upper
    // body can lean without dragging the legs).
    this.legL = this.makeLeg(g, kit, -0.22);
    this.legR = this.makeLeg(g, kit, 0.22);

    // Selection highlight: bright inner ring + soft outer halo (pulsing).
    this.selectRing = new THREE.Mesh(
      g.ring,
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, side: THREE.DoubleSide }),
    );
    this.selectRing.rotation.x = -Math.PI / 2;
    this.selectRing.position.y = 0.06;
    this.selectRing.visible = false;
    this.selectHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.05, 1.5, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, side: THREE.DoubleSide }),
    );
    this.selectHalo.rotation.x = -Math.PI / 2;
    this.selectHalo.position.y = 0.05;
    this.selectHalo.visible = false;

    // Grounding blob so players read as standing on the grass.
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.52, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }),
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.02;
    this.blob = blob;

    // Label billboard.
    this.labelCanvas.width = 256;
    this.labelCanvas.height = 96;
    this.labelTex = new THREE.CanvasTexture(this.labelCanvas);
    this.label = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: this.labelTex, transparent: true, depthWrite: false }),
    );
    this.label.position.y = 3.15;
    this.label.scale.set(3.4, 1.28, 1);
    this.drawLabel('');

    this.root.add(this.lean, this.legL, this.legR, this.blob, this.selectRing, this.selectHalo, this.label);
    // Raycast target for click-to-select.
    this.root.traverse((o) => (o.userData.gid = gid));
  }

  private makeLeg(g: NonNullable<typeof GEO>, kit: KitMaterials, x: number): THREE.Group {
    const leg = new THREE.Group();
    leg.position.set(x, HIP_Y, 0);
    const thigh = new THREE.Mesh(g.thigh, kit.shorts);
    const sock = new THREE.Mesh(g.sock, kit.sock);
    const foot = new THREE.Mesh(g.foot, DARK);
    foot.position.z = 0.1; // toes forward (+z = facing direction)
    thigh.castShadow = true;
    sock.castShadow = true;
    leg.add(thigh, sock, foot);
    return leg;
  }

  setPose(x: number, z: number, yaw: number): void {
    this.root.position.x = x;
    this.root.position.z = z;
    this.root.rotation.y = yaw;
  }

  setSelected(sel: boolean): void {
    this.selectRing.visible = sel;
    this.selectHalo.visible = sel;
    if (sel) {
      // The blob is stationary relative to root; pulse the halo instead.
      this.animTimePulse += 0.05;
      const s = 1 + Math.sin(this.animTimePulse * 2) * 0.08;
      this.selectHalo.scale.set(s, s, 1);
    }
  }

  private animTimePulse = 0;

  /** Hide/show the billboard (label decluttering). */
  setLabelVisible(v: boolean): void {
    this.label.visible = v;
  }

  /** Update the billboard: role letter + surname, optional action line. */
  setLabel(action: string, showAction: boolean): void {
    const key = showAction ? action : '';
    if (key === this.labelDrawn) return;
    this.drawLabel(key);
  }

  private drawLabel(action: string): void {
    this.labelDrawn = action;
    const ctx = this.labelCanvas.getContext('2d')!;
    ctx.clearRect(0, 0, 256, 96);
    ctx.textAlign = 'center';
    ctx.font = 'bold 34px monospace';
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.fillStyle = this.labelColor;
    const line1 = `${this.role[0]}·${this.name}`;
    ctx.strokeText(line1, 128, action ? 38 : 58);
    ctx.fillText(line1, 128, action ? 38 : 58);
    if (action) {
      ctx.font = '28px monospace';
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeText(action, 128, 76);
      ctx.fillText(action, 128, 76);
    }
    this.labelTex.needsUpdate = true;
  }

  dispose(): void {
    this.labelTex.dispose();
    (this.label.material as THREE.SpriteMaterial).dispose();
    (this.selectRing.material as THREE.Material).dispose();
  }
}

function limb(geo: THREE.BoxGeometry, mat: THREE.Material, x: number, y: number): THREE.Group {
  const group = new THREE.Group();
  group.position.set(x, y, 0);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true;
  group.add(mesh);
  return group;
}
