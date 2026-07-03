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
  sleeve: THREE.BoxGeometry;
  forearm: THREE.BoxGeometry;
  thigh: THREE.BoxGeometry;
  sock: THREE.BoxGeometry;
  sockBand: THREE.BoxGeometry;
  foot: THREE.BoxGeometry;
  hips: THREE.BoxGeometry;
  ring: THREE.RingGeometry;
  number: THREE.PlaneGeometry;
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
    // Short sleeves: shirt-colored upper arm, skin (or GK glove) forearm.
    sleeve: translate(new THREE.BoxGeometry(0.22, 0.36, 0.22), -0.18),
    forearm: translate(new THREE.BoxGeometry(0.18, 0.44, 0.18), -0.56),
    thigh: translate(new THREE.BoxGeometry(0.26, 0.55, 0.28), -0.27),
    sock: translate(new THREE.BoxGeometry(0.22, 0.42, 0.24), -0.76),
    sockBand: translate(new THREE.BoxGeometry(0.24, 0.1, 0.26), -0.58),
    foot: translate(new THREE.BoxGeometry(0.26, 0.16, 0.52), -1.0),
    hips: new THREE.BoxGeometry(0.8, 0.34, 0.46),
    ring: new THREE.RingGeometry(0.75, 0.98, 24),
    number: new THREE.PlaneGeometry(0.52, 0.58),
  };
  return GEO;
}

const SKIN = new THREE.MeshStandardMaterial({ color: 0xe0b089, roughness: 0.8 });
const DARK = new THREE.MeshStandardMaterial({ color: 0x14171e, roughness: 0.65 });
const GLOVE = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });

/** Squad numbers by role — instantly readable football shorthand. */
const ROLE_NUMBER: Record<Role, number> = { GK: 1, DF: 4, MF: 8, WG: 7, ST: 9 };

/** Subtle silhouette variation so roles read at a glance (visual only). */
const BUILD: Record<Role, { torsoW: number; torsoD: number; head: number; leanBias: number }> = {
  GK: { torsoW: 1.14, torsoD: 1.12, head: 1.06, leanBias: 0 },
  DF: { torsoW: 1.07, torsoD: 1.05, head: 1.0, leanBias: 0 },
  MF: { torsoW: 1.0, torsoD: 1.0, head: 1.0, leanBias: 0 },
  WG: { torsoW: 0.9, torsoD: 0.94, head: 0.97, leanBias: 0.02 },
  ST: { torsoW: 0.98, torsoD: 1.0, head: 1.0, leanBias: 0.07 },
};

export interface KitMaterials {
  shirt: THREE.MeshStandardMaterial;
  shorts: THREE.MeshStandardMaterial;
  sock: THREE.MeshStandardMaterial;
  /** Back-number digit color, picked for contrast against the shirt. */
  numberColor: string;
}

export function makeKit(primary: number, secondary: number): KitMaterials {
  // Digits must survive on any shirt: white on dark kits, near-black on pale.
  const lum = 0.299 * ((primary >> 16) & 0xff) + 0.587 * ((primary >> 8) & 0xff) + 0.114 * (primary & 0xff);
  return {
    shirt: new THREE.MeshStandardMaterial({ color: primary, roughness: 0.7 }),
    shorts: new THREE.MeshStandardMaterial({ color: secondary, roughness: 0.75 }),
    sock: new THREE.MeshStandardMaterial({ color: primary, roughness: 0.8 }),
    numberColor: lum > 150 ? '#14171e' : '#f5f7fa',
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
  private numberTex!: THREE.CanvasTexture;
  private numberMat!: THREE.MeshBasicMaterial;

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

    // Upper body pivots at the hips. Builds differ subtly by role: keepers
    // are broad, wingers slim, strikers carry a slight forward hunch.
    const build = BUILD[role];
    const isGK = role === 'GK';
    this.lean.position.y = HIP_Y;
    const torso = new THREE.Mesh(g.torso, kit.shirt);
    torso.position.y = 0.62;
    torso.scale.set(build.torsoW, 1, build.torsoD);
    torso.rotation.x = build.leanBias;
    torso.castShadow = true;
    const head = new THREE.Mesh(g.head, SKIN);
    head.position.y = 1.32;
    head.scale.setScalar(build.head);
    head.castShadow = true;
    const hips = new THREE.Mesh(g.hips, kit.shorts);
    hips.position.y = 0.06;
    hips.scale.set(build.torsoW, 1, build.torsoD);

    // Back number: a small canvas plane on the shirt (kit-secondary digits).
    const numberTex = numberTexture(ROLE_NUMBER[role], kit.numberColor);
    this.numberTex = numberTex;
    this.numberMat = new THREE.MeshBasicMaterial({
      map: numberTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1,
    });
    const backNumber = new THREE.Mesh(g.number, this.numberMat);
    backNumber.position.set(0, 0.66, -0.253 * build.torsoD - 0.012);
    backNumber.rotation.y = Math.PI;
    this.lean.add(backNumber);

    const armX = 0.55 * build.torsoW + (isGK ? 0.03 : 0);
    this.armL = this.makeArm(g, kit, -armX, isGK);
    this.armR = this.makeArm(g, kit, armX, isGK);
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
      new THREE.CircleGeometry(isGK ? 0.64 : 0.58, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.34, depthWrite: false }),
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

  private makeArm(g: NonNullable<typeof GEO>, kit: KitMaterials, x: number, isGK: boolean): THREE.Group {
    const arm = new THREE.Group();
    arm.position.set(x, 1.0, 0);
    const sleeve = new THREE.Mesh(g.sleeve, kit.shirt);
    // Keepers wear long sleeves + big pale gloves; outfielders show skin.
    const forearm = new THREE.Mesh(g.forearm, isGK ? GLOVE : SKIN);
    if (isGK) forearm.scale.set(1.25, 1, 1.25);
    sleeve.castShadow = true;
    forearm.castShadow = true;
    arm.add(sleeve, forearm);
    return arm;
  }

  private makeLeg(g: NonNullable<typeof GEO>, kit: KitMaterials, x: number): THREE.Group {
    const leg = new THREE.Group();
    leg.position.set(x, HIP_Y, 0);
    const thigh = new THREE.Mesh(g.thigh, kit.shorts);
    const sock = new THREE.Mesh(g.sock, kit.sock);
    const band = new THREE.Mesh(g.sockBand, kit.shorts); // contrast sock-top trim
    const foot = new THREE.Mesh(g.foot, DARK);
    foot.position.z = 0.1; // toes forward (+z = facing direction)
    thigh.castShadow = true;
    sock.castShadow = true;
    leg.add(thigh, sock, band, foot);
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
    this.numberTex.dispose();
    this.numberMat.dispose();
    (this.label.material as THREE.SpriteMaterial).dispose();
    (this.selectRing.material as THREE.Material).dispose();
  }
}

/** Back-number canvas: one small texture per player, drawn once. */
function numberTexture(n: number, color: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 64, 64);
  ctx.font = 'bold 46px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(String(n), 32, 36);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
