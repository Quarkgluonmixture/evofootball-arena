import * as THREE from 'three';
import type { Side } from '../sim/types';
import { lerpAngle } from './RenderStateAdapter';

/**
 * The COACH on the touchline (Phase 66, N3 — user addition: "the coach
 * STANDS ON THE TOUCHLINE"; reactions expanded in 66.1, user report "coach
 * 得有点对应的动作"). Render-only — the sim knows nothing about this figure;
 * his match-day CALLS live in the feed (Match.ts), this is the body they're
 * attributed to. A suited man by his technical area on the bench side who
 * lives the match:
 *
 *   always      — tracks the ball with an eased pivot, shifts his weight
 *   celebrate   — his side scored: arms skyward + the touchline leap
 *   despair     — his side CONCEDED: hands to the head, shoulders drop
 *   shot nudge  — any strike: a sharp lean-in that eases off
 *   personality — the SAME gene the feed narrates (Phase 66 tinkerBias):
 *                 the tinkerer works the touchline in late decided games
 *                 (waving, pumping an arm on the mentality ramp the sim
 *                 actually plays); the stoic stands ARMS CROSSED all match
 *                 and barely stirs — visible temperament, zero sim state.
 *
 * Own small geometries (two instances per match — sharing with the player
 * cache buys nothing and couples the dispose paths).
 */
export class CoachModel {
  readonly root = new THREE.Group();
  readonly side: Side;
  /** The adjustment-personality gene, 0 stoic … 1 tinkerer (display copy). */
  readonly tinker: number;
  private readonly lean = new THREE.Group();
  private readonly armL: THREE.Group;
  private readonly armR: THREE.Group;
  private label: THREE.Sprite | null = null;
  private labelTex: THREE.CanvasTexture | null = null;
  private t = 0;
  /** Eased arms-up blend (0 = down at his sides, 1 = full celebration). */
  private celebrate = 0;
  /** Eased hands-to-head blend (his side just conceded). */
  private despair = 0;
  /** Shot-tension pulse — set by nudge(), decays fast. */
  private tension = 0;

  constructor(
    side: Side, name: string | undefined, accent: number, x: number, z: number, tinker = 0.5,
  ) {
    this.side = side;
    this.tinker = tinker;
    const suit = new THREE.MeshStandardMaterial({ color: 0x262a33, roughness: 0.7 });
    const shirt = new THREE.MeshStandardMaterial({ color: 0xe8e9ec, roughness: 0.85 });
    const skin = new THREE.MeshStandardMaterial({ color: 0xe0b089, roughness: 0.8 });
    const scarf = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.75 });

    // Torso pivots at the hips so poses move the whole upper body.
    this.lean.position.y = 1.06;
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.95, 0.46), suit);
    torso.position.y = 0.62;
    torso.castShadow = true;
    // Open jacket: a slim shirt panel down the chest.
    const chest = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.7), shirt);
    chest.position.set(0, 0.58, 0.235);
    // The club scarf — the one splash of team color, so ownership reads at
    // a glance from any camera.
    const scarfBand = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.16, 0.5), scarf);
    scarfBand.position.y = 1.06;
    const scarfDrop = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.06), scarf);
    scarfDrop.position.set(0.14, 0.78, 0.26);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.29, 12, 10), skin);
    head.position.y = 1.3;
    head.castShadow = true;

    // Arms pivot at the shoulders — every pose is two shoulder rotations.
    const armGeo = new THREE.BoxGeometry(0.2, 0.78, 0.2);
    armGeo.translate(0, -0.34, 0);
    this.armL = new THREE.Group();
    this.armL.position.set(-0.52, 1.0, 0);
    this.armL.add(new THREE.Mesh(armGeo, suit));
    this.armR = new THREE.Group();
    this.armR.position.set(0.52, 1.0, 0);
    this.armR.add(new THREE.Mesh(armGeo.clone(), suit));
    this.lean.add(torso, chest, scarfBand, scarfDrop, head, this.armL, this.armR);

    // Straight trouser legs — the coach never runs, so no gait rig.
    const legGeo = new THREE.BoxGeometry(0.24, 1.06, 0.26);
    legGeo.translate(0, -0.53, 0);
    const legL = new THREE.Mesh(legGeo, suit);
    legL.position.set(-0.2, 1.06, 0);
    const legR = new THREE.Mesh(legGeo.clone(), suit);
    legR.position.set(0.2, 1.06, 0);
    const shoeGeo = new THREE.BoxGeometry(0.24, 0.14, 0.44);
    const shoeL = new THREE.Mesh(shoeGeo, suit);
    shoeL.position.set(-0.2, 0.07, 0.08);
    const shoeR = new THREE.Mesh(shoeGeo.clone(), suit);
    shoeR.position.set(0.2, 0.07, 0.08);

    // Grounding blob, same trick as the players.
    const blob = new THREE.Mesh(
      new THREE.CircleGeometry(0.56, 14),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }),
    );
    blob.rotation.x = -Math.PI / 2;
    blob.position.y = 0.02;

    this.root.add(this.lean, legL, legR, shoeL, shoeR, blob);

    // Nameplate — only when a named coach travels with the team sheet.
    if (name) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.textAlign = 'center';
      ctx.font = 'bold 30px monospace';
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(0,0,0,0.85)';
      ctx.fillStyle = `#${accent.toString(16).padStart(6, '0')}`;
      ctx.strokeText(name, 128, 42);
      ctx.fillText(name, 128, 42);
      this.labelTex = new THREE.CanvasTexture(canvas);
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: this.labelTex, transparent: true, depthWrite: false }),
      );
      sprite.position.y = 2.7;
      sprite.scale.set(2.9, 0.72, 1);
      this.label = sprite;
      this.root.add(sprite);
    }

    this.root.position.set(x, 0, z);
  }

  /** A shot was struck (either side) — the whole dugout tightens. */
  nudge(): void {
    this.tension = 1;
  }

  /**
   * Per-frame. `mood` is the goal-pause read (his side celebrating, the
   * other side's = he conceded); `activity` is the LIVE mentality level
   * (max of urgency/holding at HIS tinker) — the tinkerer's cue to work
   * the touchline.
   */
  update(
    ballX: number, ballZ: number,
    mood: 'neutral' | 'celebrate' | 'despair', activity: number, dt: number,
  ): void {
    this.t += dt;
    const target = Math.atan2(ballX - this.root.position.x, ballZ - this.root.position.z);
    // Ease the turn — a man pivoting on the spot, not a turret.
    this.root.rotation.y = lerpAngle(this.root.rotation.y, target, Math.min(1, dt * 3));

    this.celebrate += ((mood === 'celebrate' ? 1 : 0) - this.celebrate) * Math.min(1, dt * 6);
    this.despair += ((mood === 'despair' ? 1 : 0) - this.despair) * Math.min(1, dt * 5);
    this.tension = Math.max(0, this.tension - dt * 2.2);

    const cel = this.celebrate;
    const des = this.despair;
    const rest = Math.max(0, 1 - cel - des);

    // Personality at rest: the stoic folds his arms and keeps them folded;
    // the tinkerer gesticulates on the live mentality ramp — one arm
    // pumping, the other flung wide, faster the hotter the game state.
    const crossed = Math.max(0, (0.3 - this.tinker) / 0.3);
    const gest = rest * activity * Math.min(1, this.tinker * 1.6);
    const pump = Math.sin(this.t * 6.5);
    const gestR = gest * (0.9 + 0.55 * pump);
    const gestL = gest * 0.35 * (1 - pump);

    // Shoulder z, mirrored: negative-L / positive-R swings the arm OUT and
    // UP away from the torso; the opposite sign folds it INWARD across the
    // chest (the crossed-arms read, together with the forward x below).
    this.armL.rotation.z = cel * -2.68 + des * -1.35 + rest * (-0.08 + crossed * 0.55 - gestL);
    this.armR.rotation.z = cel * 2.68 + des * 1.35 + rest * (0.08 - crossed * 0.55 + gestR);
    // Shoulder x: forward. Crossed arms fold across the chest; despair
    // brings both hands to the head (up via z, forward via x).
    this.armL.rotation.x = rest * crossed * 0.55 + des * 0.85;
    this.armR.rotation.x = rest * crossed * 0.6 + des * 0.85;

    // Torso: thoughtful hunch + idle weight shift; the shot pulse leans
    // him in sharply; despair slumps the shoulders; a celebrating coach
    // arches back.
    this.lean.rotation.z = Math.sin(this.t * 0.9) * 0.03 * (1 - crossed * 0.5);
    this.lean.rotation.x =
      0.06 + Math.sin(this.t * 0.5) * 0.015 + this.tension * 0.16 + des * 0.24 - cel * 0.12;

    // The touchline leap — celebration only; despair stays rooted.
    this.root.position.y = cel > 0.03 ? Math.abs(Math.sin(this.t * 9)) * 0.22 * cel : 0;
  }

  dispose(): void {
    this.labelTex?.dispose();
    if (this.label) (this.label.material as THREE.SpriteMaterial).dispose();
    this.root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      for (const m of mats) (m as THREE.Material).dispose();
    });
  }
}
