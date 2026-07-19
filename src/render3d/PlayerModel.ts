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
 *     body (whole-body pivot at the feet — dives tilt EVERYTHING)
 *       lean (hip pivot, forward/side lean)  -> torso, head, armL, armR
 *       legL, legR (hip pivots)              -> thigh+sock+foot
 *     selectRing (flat ring on the grass)
 *     label (sprite billboard)
 */

/* Shared geometries — created once, reused by all 10 players. */
let GEO: {
  torso: THREE.BoxGeometry;
  head: THREE.SphereGeometry;
  hair: THREE.SphereGeometry;
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
    // Hair cap (Phase 76): the top half-sphere, slightly proud of the head.
    hair: new THREE.SphereGeometry(0.315, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.52),
    // Limbs pivot at their top: translate geometry downward by half height.
    // Short sleeves: shirt-colored upper arm, skin (or GK glove) forearm.
    // Since Phase 73 the forearm hangs from an ELBOW group (y=-0.34 in the
    // arm) and sock/band/foot from a KNEE group (y=-0.55 in the leg), so
    // their geometry is translated relative to those pivots.
    sleeve: translate(new THREE.BoxGeometry(0.22, 0.36, 0.22), -0.18),
    forearm: translate(new THREE.BoxGeometry(0.18, 0.44, 0.18), -0.22),
    thigh: translate(new THREE.BoxGeometry(0.26, 0.55, 0.28), -0.27),
    sock: translate(new THREE.BoxGeometry(0.22, 0.42, 0.24), -0.21),
    sockBand: translate(new THREE.BoxGeometry(0.24, 0.1, 0.26), -0.03),
    foot: translate(new THREE.BoxGeometry(0.26, 0.16, 0.52), -0.45),
    hips: new THREE.BoxGeometry(0.8, 0.34, 0.46),
    ring: new THREE.RingGeometry(0.75, 0.98, 24),
    number: new THREE.PlaneGeometry(0.52, 0.58),
  };
  return GEO;
}

/* Shared skin/boot/glove materials — lazy like GEO so a full renderer
   dispose (whose scene traverse disposes them) can reset the cache. */
let MATS: {
  skin: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  glove: THREE.MeshStandardMaterial;
} | null = null;

function sharedMats(): NonNullable<typeof MATS> {
  if (MATS) return MATS;
  MATS = {
    skin: new THREE.MeshStandardMaterial({ color: 0xe0b089, roughness: 0.8 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x14171e, roughness: 0.65 }),
    glove: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 }),
  };
  return MATS;
}

/* Per-tone skin + per-color hair materials (Phase 76) — small shared caches,
   reset together with GEO/MATS on a full renderer dispose. */
const TONE_MATS = new Map<number, THREE.MeshStandardMaterial>();
function toneMat(color: number, roughness = 0.8): THREE.MeshStandardMaterial {
  let m = TONE_MATS.get(color);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness });
    TONE_MATS.set(color, m);
  }
  return m;
}

/**
 * Forget the shared geometry/material caches. Call after a full renderer
 * dispose() — its scene traverse has already disposed the GPU resources —
 * so the next 3D init builds fresh ones instead of reusing disposed objects.
 */
export function resetSharedPlayerResources(): void {
  GEO = null;
  MATS = null;
  TONE_MATS.clear();
}

/* ---------------- the individual body (Phase 76) ---------------- */

/** Skin tones + hair colors — small palettes indexed by the name hash. */
const SKIN_TONES = [0xf1c27d, 0xe0b089, 0xc68642, 0x9c6b3f, 0x6b4423, 0x4a2f1b];
const HAIR_COLORS = [0x17171a, 0x2c2118, 0x4a3220, 0x6e4a26, 0x8a8d93, 0xb0651f];

/** Deterministic 0..1 from a name (FNV-1a) — stable across sessions. */
export function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export interface BodySpec {
  /** Whole-body scale, 0.94 – 1.06 (identity — from the name). */
  height: number;
  /** Torso/hip width multiplier, 0.88 – 1.16 (ability — from strength). */
  bulk: number;
  tone: number;
  /** 0 = cap, 1 = buzz (flattened), 2 = bald (hidden). */
  hair: 0 | 1 | 2;
  hairColor: number;
}

/**
 * The body a player EARNS (Phase 76, user direction "和球员本身绑定再加上
 * 和能力绑定"): identity (height, skin, hair) hashes off the NAME so it
 * survives saves/replays and swaps correctly on substitution; build follows
 * the evolved STRENGTH attribute — the gym shows. Pure, unit-pinned.
 */
export function bodyFor(name: string, strength: number): BodySpec {
  const h1 = hash01(name);
  const h2 = hash01(`${name}#skin`);
  const h3 = hash01(`#hair${name}`);
  return {
    height: 0.94 + h1 * 0.12,
    bulk: 0.88 + Math.max(0, Math.min(1, strength)) * 0.28,
    tone: SKIN_TONES[Math.min(SKIN_TONES.length - 1, Math.floor(h2 * SKIN_TONES.length))],
    hair: h3 < 0.14 ? 2 : h3 < 0.62 ? 0 : 1,
    hairColor: HAIR_COLORS[Math.min(HAIR_COLORS.length - 1, Math.floor(((h3 * 7919) % 1) * HAIR_COLORS.length))],
  };
}

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
  /** Whole-body group (lean + legs), pivot at the feet: the keeper dive
   * tilts THIS, so the legs leave the ground with the torso — tilting only
   * `lean` folded the keeper at the hips while his legs stood planted (the
   * "只有上半身动" report). Label/ring/blob stay outside it, upright. */
  readonly body = new THREE.Group();
  readonly lean = new THREE.Group();
  readonly legL: THREE.Group;
  readonly legR: THREE.Group;
  readonly armL: THREE.Group;
  readonly armR: THREE.Group;
  /** Second joints (Phase 73): shins flex during the swing phase, forearms
   * carry at ~90° on the run — the single-segment limbs were the biggest
   * silhouette gap vs. a real runner. */
  readonly kneeL: THREE.Group;
  readonly kneeR: THREE.Group;
  readonly elbowL: THREE.Group;
  readonly elbowR: THREE.Group;
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
  headerT = -1;
  /** Smoothed swing amplitude / arm factor (31.9): players hovering on the
   * jog↔sprint speed threshold flipped limb amplitude INSTANTLY every few
   * frames — the "跑动眼花" strobe. These ease toward the anim's targets. */
  swingAmpCur = 0.05;
  armFCur = 0.7;
  /** Dive side frozen at dive start (29.1) — recomputing it per frame made
   * the pose mirror-flip as the ball crossed the keeper (the "twitch"). */
  diveSide = 1;
  /** One-shot dive clock: drives the launch → full-stretch → landed arc. */
  diveT = -1;
  /** Facing frozen at dive start (34.1) — the sim heading keeps tracking
   * the ball, and applying it raw ROTATED the horizontal body mid-save. */
  yawLock = 0;
  /** Ground position frozen at dive start (Phase B, user report: keeper's
   * feet drifted BACKWARD after landing). The save is a probability roll —
   * the sim keeper keeps steering back to his spot while the dive pose plays,
   * dragging the horizontal body with it. Plant the root where he dove. */
  diveX = 0;
  diveZ = 0;
  /** Recovery blend: 1 → still facing the lock, eases to the live heading. */
  yawEase = 0;
  /** One-shot trap clock (Phase 73): reaches for an arriving ball, gives. */
  receiveT = -1;
  /** Which leg meets the arriving ball: +1 = the local-+x slot (legR). */
  receiveSlot: 1 | -1 = 1;
  /** Kicking leg, frozen at kick start (Phase 73): the ball-side foot. */
  kickSlot: 1 | -1 = 1;
  /** Previous frame's yaw + smoothed bank — turns tip the torso (Phase 73). */
  yawPrev: number | null = null;
  bankCur = 0;
  prevAnim: AnimName = 'idle';

  readonly gid: number;
  private name: string;
  private role: Role;
  private labelColor: string;
  /* Body-binding refs (Phase 76). */
  private torso!: THREE.Mesh;
  private hips!: THREE.Mesh;
  private head!: THREE.Mesh;
  private hair!: THREE.Mesh;
  private skinMeshes: THREE.Mesh[] = [];
  private build!: { torsoW: number; torsoD: number };
  private bodyKey = '';

  constructor(gid: number, role: Role, name: string, kit: KitMaterials, labelColor: string) {
    this.gid = gid;
    this.role = role;
    this.name = name;
    this.labelColor = labelColor;
    const g = sharedGeo();

    // Upper body pivots at the hips. Builds differ subtly by role: keepers
    // are broad, wingers slim, strikers carry a slight forward hunch.
    const build = BUILD[role];
    this.build = { torsoW: build.torsoW, torsoD: build.torsoD };
    const isGK = role === 'GK';
    this.lean.position.y = HIP_Y;
    const torso = new THREE.Mesh(g.torso, kit.shirt);
    torso.position.y = 0.62;
    torso.scale.set(build.torsoW, 1, build.torsoD);
    torso.rotation.x = build.leanBias;
    torso.castShadow = true;
    this.torso = torso;
    const head = new THREE.Mesh(g.head, sharedMats().skin);
    head.position.y = 1.32;
    head.scale.setScalar(build.head);
    head.castShadow = true;
    this.head = head;
    this.skinMeshes.push(head);
    // Hair cap (Phase 76) — restyled per occupant by setBody.
    this.hair = new THREE.Mesh(g.hair, toneMat(HAIR_COLORS[0], 0.9));
    this.hair.position.y = 0.02;
    head.add(this.hair);
    const hips = new THREE.Mesh(g.hips, kit.shorts);
    hips.position.y = 0.06;
    hips.scale.set(build.torsoW, 1, build.torsoD);
    this.hips = hips;

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
    const aL = this.makeArm(g, kit, -armX, isGK);
    const aR = this.makeArm(g, kit, armX, isGK);
    this.armL = aL.arm;
    this.armR = aR.arm;
    this.elbowL = aL.elbow;
    this.elbowR = aR.elbow;
    this.lean.add(torso, head, hips, this.armL, this.armR);

    // Legs pivot at the hips too (siblings of the lean group so the upper
    // body can lean without dragging the legs).
    const lL = this.makeLeg(g, kit, -0.22);
    const lR = this.makeLeg(g, kit, 0.22);
    this.legL = lL.leg;
    this.legR = lR.leg;
    this.kneeL = lL.knee;
    this.kneeR = lR.knee;

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

    this.body.add(this.lean, this.legL, this.legR);
    this.root.add(this.body, this.blob, this.selectRing, this.selectHalo, this.label);
    // Raycast target for click-to-select.
    this.root.traverse((o) => (o.userData.gid = gid));
  }

  private makeArm(
    g: NonNullable<typeof GEO>, kit: KitMaterials, x: number, isGK: boolean,
  ): { arm: THREE.Group; elbow: THREE.Group } {
    const arm = new THREE.Group();
    arm.position.set(x, 1.0, 0);
    const sleeve = new THREE.Mesh(g.sleeve, kit.shirt);
    // Keepers wear long sleeves + big pale gloves; outfielders show skin.
    const m = sharedMats();
    const forearm = new THREE.Mesh(g.forearm, isGK ? m.glove : m.skin);
    if (isGK) forearm.scale.set(1.25, 1, 1.25);
    else this.skinMeshes.push(forearm); // retoned per occupant (Phase 76)
    sleeve.castShadow = true;
    forearm.castShadow = true;
    // Elbow joint (Phase 73): the forearm hangs from its own pivot so it
    // can carry bent while the shoulder swings.
    const elbow = new THREE.Group();
    elbow.position.y = -0.34;
    elbow.add(forearm);
    arm.add(sleeve, elbow);
    return { arm, elbow };
  }

  private makeLeg(
    g: NonNullable<typeof GEO>, kit: KitMaterials, x: number,
  ): { leg: THREE.Group; knee: THREE.Group } {
    const leg = new THREE.Group();
    leg.position.set(x, HIP_Y, 0);
    const thigh = new THREE.Mesh(g.thigh, kit.shorts);
    const sock = new THREE.Mesh(g.sock, kit.sock);
    const band = new THREE.Mesh(g.sockBand, kit.shorts); // contrast sock-top trim
    const foot = new THREE.Mesh(g.foot, sharedMats().dark);
    foot.position.z = 0.1; // toes forward (+z = facing direction)
    thigh.castShadow = true;
    sock.castShadow = true;
    // Knee joint (Phase 73): shin+foot flex during the swing phase — the
    // scissor-straight leg was the loudest "not a runner" tell.
    const knee = new THREE.Group();
    knee.position.y = -0.55;
    knee.add(sock, band, foot);
    leg.add(thigh, knee);
    return { leg, knee };
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

  /** A substitution changed this slot's man (Phase 61) — redraw the plate. */
  setName(name: string): void {
    if (name === this.name) return;
    this.name = name;
    this.drawLabel(this.labelDrawn);
  }

  /**
   * Bind the body to the slot's CURRENT occupant (Phase 76): identity
   * (height/skin/hair) from the name, build from the evolved strength.
   * Called per frame — early-outs on the (name, strength) key.
   */
  setBody(name: string | undefined, strength: number): void {
    const n = name ?? this.name; // old replays: the kickoff-sheet name
    const key = `${n}:${strength.toFixed(2)}`;
    if (key === this.bodyKey) return;
    this.bodyKey = key;
    const b = bodyFor(n, strength);
    this.body.scale.setScalar(b.height);
    this.torso.scale.set(this.build.torsoW * b.bulk, 1, this.build.torsoD * b.bulk);
    this.hips.scale.set(this.build.torsoW * b.bulk, 1, this.build.torsoD * b.bulk);
    const skin = toneMat(b.tone);
    for (const mesh of this.skinMeshes) mesh.material = skin;
    this.hair.visible = b.hair !== 2;
    this.hair.material = toneMat(b.hairColor, 0.9);
    this.hair.scale.set(1, b.hair === 1 ? 0.55 : 1, 1);
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
    // Per-instance (not shared) geometry+materials — these leaked on every
    // match attach until they were added here.
    this.selectHalo.geometry.dispose();
    (this.selectHalo.material as THREE.Material).dispose();
    this.blob.geometry.dispose();
    (this.blob.material as THREE.Material).dispose();
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
