import * as THREE from 'three';
import { ACTION_SHORT } from '../render/actionLabels';
import { CANVAS_H, CANVAS_W } from '../render/transform';
import type { UiFlags } from '../ui/actions';
import { colorHex } from '../ui/dom';
import { AnimationSystem } from './AnimationSystem';
import { BallModel } from './BallModel';
import { CameraController, type CameraMode } from './CameraController';
import { CoachModel } from './CoachModel';
import { FxSystem, type FxQuality } from './FxSystem';
import { Goal3D } from './GoalModel';
import { declutterLabels, type LabelItem } from './labelDeclutter';
import { Overlays3D } from './Overlays3D';
import { createPitch } from './PitchModel';
import {
  PlayerModel, disposeKit, makeKit, resetSharedPlayerResources, type KitMaterials,
} from './PlayerModel';
import type { FxEvent, RenderState, RenderTheme } from './RenderStateAdapter';
import { createScene } from './SceneFactory';
import { HALF_W } from '../sim/constants';
import { TEAM_SIZE } from '../sim/types';

/** Half-time / full-time stroll speed (m/s) — an unhurried walk to the tunnel. */
const WALKOFF_SPEED = 1.4;

/**
 * ThreeMatchRenderer — the 3D match viewer. Pure consumer of RenderState
 * (from the live sim via the adapter, or from a ReplayBuffer); it never
 * touches simulation objects. Construction throws if WebGL is unavailable,
 * which the GameApp catches to fall back to 2D.
 */
export class ThreeMatchRenderer {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private cameraCtl: CameraController;
  private ball = new BallModel();
  private overlays = new Overlays3D();
  private fx = new FxSystem();
  private goals: [Goal3D, Goal3D];
  private playersGroup = new THREE.Group();
  private players = new Map<number, PlayerModel>();
  /** Touchline coaches (Phase 66, N3) — own group so raycast picking never
   * sees them. Empty when no coach travels with the team sheet. */
  private coachesGroup = new THREE.Group();
  private coaches: CoachModel[] = [];
  private kits: KitMaterials[] = [];
  private anim = new AnimationSystem();
  /** Half-time / full-time walk to the tunnel (Phase 41.1, render-only): per-gid
   * current walked position, seeded from the freeze pose and advanced each frame
   * so players stroll off instead of the stale-velocity run-in-place. */
  private walkOff = new Map<number, { x: number; z: number }>();
  private raycaster = new THREE.Raycaster();
  private lastState: RenderState | null = null;
  private theme: RenderTheme | null = null;

  private possessionRing: THREE.Mesh;
  private possessionMat: THREE.MeshBasicMaterial;
  private pulsePhase = 0;
  private labelVisibleCount = 10;

  private banner: HTMLDivElement;
  private bannerTimer: ReturnType<typeof setTimeout> | null = null;
  private scoreBug: HTMLDivElement;
  private scoreBugText = '';
  private vignette: HTMLDivElement;

  onSelectPlayer: ((gid: number) => void) | null = null;
  /** Optional external hook (sound etc.) fired once per fx event. */
  onFxEvent: ((type: FxEvent['type']) => void) | null = null;
  /** Tap on the broadcast score bug (Phase 33: pops the tactical-DNA clash). */
  onScoreBugTap: (() => void) | null = null;

  constructor(host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(CANVAS_W, CANVAS_H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);

    this.scene = createScene();
    const maxAniso = this.renderer.capabilities.getMaxAnisotropy();
    this.scene.add(createPitch(maxAniso));
    this.goals = [new Goal3D(1, maxAniso), new Goal3D(-1, maxAniso)];
    this.scene.add(this.goals[0].group, this.goals[1].group);
    this.scene.add(this.ball.root, this.ball.worldTrail, this.overlays.root, this.fx.root, this.playersGroup, this.coachesGroup);

    // Possession indicator: pulsing team-colored ring under the ball carrier.
    this.possessionMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.85, side: THREE.DoubleSide,
    });
    this.possessionRing = new THREE.Mesh(new THREE.RingGeometry(0.85, 1.12, 24), this.possessionMat);
    this.possessionRing.rotation.x = -Math.PI / 2;
    this.possessionRing.position.y = 0.07;
    this.possessionRing.visible = false;
    this.scene.add(this.possessionRing);

    this.cameraCtl = new CameraController(CANVAS_W / CANVAS_H, this.renderer.domElement);

    // DOM overlays on the 3D host: goal banner, broadcast score bug, and a
    // subtle vignette that keeps the pitch the visual center.
    host.style.position = 'relative';
    this.banner = document.createElement('div');
    this.banner.className = 'goal-banner hidden';
    this.vignette = document.createElement('div');
    this.vignette.className = 'pitch-vignette';
    this.scoreBug = document.createElement('div');
    this.scoreBug.className = 'score-bug hidden';
    this.scoreBug.addEventListener('click', () => this.onScoreBugTap?.());
    host.append(this.vignette, this.scoreBug, this.banner);

    // Renderer-owned event feedback.
    this.fx.hooks = {
      onGoal: (side) => {
        this.goals[side].shake();
        const team = this.theme?.teams[side];
        const pens = this.lastState?.shootout;
        if (team && pens) {
          // Shootout theater's winning moment: pens score, not the FT score.
          this.showBanner('WINS THE SHOOTOUT!', `${team.name} · ${pens.h}–${pens.a} pens`, team.primary);
        } else if (team) {
          const score = this.lastState ? `${this.lastState.score[0]}–${this.lastState.score[1]}` : '';
          this.showBanner('GOAL!', `${team.name}${score ? ` · ${score}` : ''}`, team.primary);
        }
      },
      onShot: () => this.cameraCtl.pulse(),
      onEvent: (type) => this.onFxEvent?.(type),
    };

    this.renderer.domElement.addEventListener('pointerdown', (ev) => this.pick(ev));
  }

  get canvas(): HTMLCanvasElement {
    return this.renderer.domElement;
  }

  /** Rebuild player models and kit materials for a new match. */
  attach(theme: RenderTheme): void {
    this.theme = theme;
    for (const model of this.players.values()) {
      this.playersGroup.remove(model.root);
      model.dispose();
    }
    this.players.clear();
    for (const kit of this.kits) disposeKit(kit);
    this.kits = [];

    // Kit contrast: if the two primaries are too close (CVD/duplicate hues),
    // team B plays in its inverted kit so the teams stay tellable-apart.
    const clash = colorDist(theme.teams[0].primary, theme.teams[1].primary) < 110;
    const teamKits = theme.teams.map((t, side) => {
      const invert = clash && side === 1;
      const p = invert ? t.secondary : t.primary;
      const s = invert ? t.primary : t.secondary;
      return { outfield: makeKit(p, s), keeper: makeKit(s, p) };
    });
    for (const tk of teamKits) this.kits.push(tk.outfield, tk.keeper);

    for (const p of theme.players) {
      const tk = teamKits[p.side];
      const labelColor = colorHex(theme.teams[p.side].primary);
      const model = new PlayerModel(
        p.gid,
        p.role,
        p.name,
        p.role === 'GK' ? tk.keeper : tk.outfield,
        labelColor,
      );
      this.players.set(p.gid, model);
      this.playersGroup.add(model.root);
    }

    // The coaches take their technical areas (Phase 66, N3): bench side
    // (+z, where subs enter and the tunnel sits), either side of halfway,
    // clear of the walk-off fan (|x| ≤ 6.5 at z = HALF_W + 1.2). Only a
    // NAMED coach stands there — ad-hoc teams play with an empty dugout.
    for (const coach of this.coaches) {
      this.coachesGroup.remove(coach.root);
      coach.dispose();
    }
    this.coaches = [];
    theme.teams.forEach((t, side) => {
      if (!t.coach) return;
      const model = new CoachModel(
        side as 0 | 1, t.coach, t.primary, side === 0 ? -8 : 8, HALF_W + 1.7,
      );
      this.coaches.push(model);
      this.coachesGroup.add(model.root);
    });

    this.overlays.applyTheme(theme);
    this.fx.reset();
    this.hideBanner();
    this.lastState = null;
  }

  update(state: RenderState | null, dt: number, flags: UiFlags, selectedGid: number | null): void {
    if (state) {
      // Assign early so fx hooks (goal banner) see the post-event score.
      this.lastState = state;
      this.updateScoreBug(state);
      // Half-time / full-time: stroll to the tunnel instead of the stale-
      // velocity run-in-place (Phase 41.1). Render-only — the sim is frozen.
      const walkingOff = state.phase === 'halftime' || state.phase === 'fulltime';
      for (const p of state.players) {
        const model = this.players.get(p.gid);
        if (!model) continue;
        // A substitution changed the slot's man (Phase 61) — cheap string
        // compare per frame, canvas redraw only on the actual swap.
        if (p.name !== undefined) model.setName(p.name);
        if (walkingOff) {
          this.poseWalkOff(model, p, state, dt, selectedGid);
        } else {
          model.setPose(p.x, p.z, p.yaw);
          model.setSelected(selectedGid === p.gid);
          model.setLabel(ACTION_SHORT[p.action], flags.actionLabels);
          this.anim.update(model, p, state, dt);
        }
      }
      if (!walkingOff && this.walkOff.size > 0) this.walkOff.clear();
      this.declutter(state, selectedGid);
      if (walkingOff) this.possessionRing.visible = false; // dead ball — no carrier
      else this.updatePossessionRing(state, dt);
      // A diving keeper's hands carry the ball (31.9, user report "球的位置
      // 应该随着手部变化"): while the owner's body is tilted, hand the
      // BallModel a hands anchor in world space so the held ball rides the
      // dive instead of hovering at the standing carry spot. Render-only.
      let hands: { x: number; y: number; z: number; t: number } | null = null;
      if (state.ball.ownerGid !== null) {
        const ownerModel = this.players.get(state.ball.ownerGid);
        const tilt = ownerModel ? Math.abs(ownerModel.body.rotation.z) : 0;
        if (ownerModel && tilt > 0.05) {
          const v = new THREE.Vector3(0, 1.8, 0.25);
          ownerModel.body.updateWorldMatrix(true, false);
          ownerModel.body.localToWorld(v);
          hands = { x: v.x, y: v.y, z: v.z, t: Math.min(1, tilt / 0.9) };
        }
      }
      this.ball.update(state.ball, state.players, dt, hands);
      // The dugout lives the match too (Phase 66): each coach tracks the
      // ball and leaps while HIS side's goal celebration plays.
      for (const coach of this.coaches) {
        coach.update(state.ball.x, state.ball.z, state.celebratingSide === coach.side, dt);
      }
      this.overlays.update(state.overlays, flags);
      if (this.theme) {
        this.fx.process(state, [this.theme.teams[0].primary, this.theme.teams[1].primary]);
      }
      this.cameraCtl.update(state.ball, dt);
    } else {
      this.scoreBug.classList.add('hidden');
      this.cameraCtl.update({ x: 0, z: 0, vx: 0, vz: 0 }, dt);
    }
    this.fx.update(dt);
    this.goals[0].update(dt);
    this.goals[1].update(dt);
    this.renderer.render(this.scene, this.cameraCtl.camera);
  }

  /** The tunnel: a single mouth at the halfway line by one touchline. Players
   * fan across it by squad slot so they stream off without stacking on a point. */
  private tunnelTarget(gid: number): { x: number; z: number } {
    const slot = gid % TEAM_SIZE; // 0..TEAM_SIZE-1
    return { x: (slot - (TEAM_SIZE - 1) / 2) * 2.6, z: HALF_W + 1.2 };
  }

  /** Walk one model toward the tunnel at an unhurried pace (Phase 41.1). The sim
   * has frozen the players with stale velocity (a run-in-place), so ignore its
   * pose: advance a render-only position and feed the gait a matching speed so
   * the legs stroll instead of sprint. */
  private poseWalkOff(
    model: PlayerModel, p: RenderState['players'][number], state: RenderState,
    dt: number, selectedGid: number | null,
  ): void {
    let wp = this.walkOff.get(p.gid);
    if (!wp) { wp = { x: p.x, z: p.z }; this.walkOff.set(p.gid, wp); }
    const t = this.tunnelTarget(p.gid);
    const dx = t.x - wp.x;
    const dz = t.z - wp.z;
    const d = Math.hypot(dx, dz);
    let speed = 0;
    if (d > 0.3) {
      const move = Math.min(WALKOFF_SPEED * dt, d) / d;
      wp.x += dx * move;
      wp.z += dz * move;
      speed = WALKOFF_SPEED;
    }
    const yaw = d > 0.3 ? Math.atan2(dx, dz) : model.root.rotation.y;
    model.setPose(wp.x, wp.z, yaw);
    model.setSelected(selectedGid === p.gid);
    model.setLabel('', false);
    this.anim.update(
      model,
      { ...p, x: wp.x, z: wp.z, yaw, speed, action: 'MakeRun', saving: false, header: false, tackling: false, stunned: false },
      state,
      dt,
    );
  }

  /** Hide low-priority labels that would overlap on screen. */
  private declutter(state: RenderState, selectedGid: number | null): void {
    const items: LabelItem[] = [];
    const v = new THREE.Vector3();
    for (const p of state.players) {
      const model = this.players.get(p.gid);
      if (!model) continue;
      v.set(p.x, 3.1, p.z).project(this.cameraCtl.camera);
      const priority =
        p.gid === selectedGid ? 4 : p.gid === state.ball.ownerGid ? 3 : p.role === 'GK' ? 2 : 1;
      items.push({ gid: p.gid, x: (v.x * 0.5 + 0.5) * CANVAS_W, y: (-v.y * 0.5 + 0.5) * CANVAS_H, priority });
    }
    const visible = declutterLabels(items, 46);
    this.labelVisibleCount = visible.size;
    for (const [gid, model] of this.players) model.setLabelVisible(visible.has(gid));
  }

  private updatePossessionRing(state: RenderState, dt: number): void {
    const owner = state.ball.ownerGid !== null
      ? state.players.find((p) => p.gid === state.ball.ownerGid)
      : undefined;
    this.possessionRing.visible = owner !== undefined;
    if (owner && this.theme) {
      this.possessionRing.position.set(owner.x, 0.07, owner.z);
      this.possessionMat.color.setHex(this.theme.teams[owner.side].primary);
      this.pulsePhase += dt * 6;
      const s = 1 + Math.sin(this.pulsePhase) * 0.1;
      this.possessionRing.scale.set(s, s, 1);
    }
  }

  /** Broadcast score bug: `RUS 2–1 OBS · 34'` (`· pens 3–2` during shootouts). */
  private updateScoreBug(state: RenderState): void {
    const t = this.theme;
    if (!t) return;
    this.scoreBug.classList.remove('hidden');
    const pens = state.shootout ? `${state.shootout.h}:${state.shootout.a}` : '';
    // `?? minute` keeps pre-Phase-28.1 replay snapshots (no clock field) honest.
    const clock = state.clock ?? String(state.minute);
    const text = `${t.teams[0].short}${state.score[0]}${state.score[1]}${t.teams[1].short}${clock}${pens}`;
    if (text === this.scoreBugText) return;
    this.scoreBugText = text;
    this.scoreBug.innerHTML =
      `<span class="sb-chip" style="background:${colorHex(t.teams[0].primary)}"></span>` +
      `<span class="sb-team">${t.teams[0].short}</span>` +
      `<span class="sb-score">${state.score[0]}–${state.score[1]}</span>` +
      `<span class="sb-team">${t.teams[1].short}</span>` +
      `<span class="sb-chip" style="background:${colorHex(t.teams[1].primary)}"></span>` +
      (state.shootout
        ? `<span class="sb-min">pens ${state.shootout.h}–${state.shootout.a}</span>`
        : `<span class="sb-min">${clock}'</span>`);
  }

  private showBanner(title: string, sub: string, color: number): void {
    this.banner.innerHTML =
      `<div class="gb-title">${title}</div>` +
      `<div class="gb-sub">${sub}</div>`;
    this.banner.style.borderColor = colorHex(color);
    this.banner.style.color = colorHex(color);
    this.banner.classList.remove('hidden');
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => this.hideBanner(), 2200);
  }

  private hideBanner(): void {
    this.banner.classList.add('hidden');
  }

  /** FX quality: low = no particles/vignette + 1× pixel ratio; high = confetti. */
  setFxQuality(q: FxQuality): void {
    this.fx.quality = q;
    this.vignette.style.display = q === 'low' ? 'none' : '';
    this.renderer.setPixelRatio(q === 'low' ? 1 : Math.min(window.devicePixelRatio, 2));
  }

  get fxQuality(): FxQuality {
    return this.fx.quality;
  }

  /**
   * Capture the current 3D frame as a PNG data URL. Renders synchronously
   * first — reading a WebGL canvas outside the same task returns blank
   * (see ARCHITECTURE failure mode 9).
   */
  captureScreenshot(): string {
    this.renderer.render(this.scene, this.cameraCtl.camera);
    return this.renderer.domElement.toDataURL('image/png');
  }

  setCameraMode(mode: CameraMode): void {
    this.cameraCtl.setMode(mode);
  }

  get cameraMode(): CameraMode {
    return this.cameraCtl.mode;
  }

  resetCamera(): void {
    this.cameraCtl.reset();
  }

  /** Re-arm one-shot effects (replay jump/scrub). */
  resetFx(): void {
    this.fx.reset();
  }

  /* -------- selection & tooling -------- */

  private pick(ev: PointerEvent): void {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((ev.clientX - rect.left) / rect.width) * 2 - 1,
      -((ev.clientY - rect.top) / rect.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(ndc, this.cameraCtl.camera);
    const hits = this.raycaster.intersectObjects(this.playersGroup.children, true);
    for (const hit of hits) {
      const gid = hit.object.userData.gid as number | undefined;
      if (gid !== undefined) {
        this.onSelectPlayer?.(gid);
        return;
      }
    }
  }

  /** Player positions projected to renderer-logical pixels (for tests/tools). */
  playerScreenPositions(): Array<{ gid: number; x: number; y: number }> {
    const out: Array<{ gid: number; x: number; y: number }> = [];
    const v = new THREE.Vector3();
    for (const [gid, model] of this.players) {
      v.copy(model.root.position);
      v.y = 1.2;
      v.project(this.cameraCtl.camera);
      out.push({ gid, x: (v.x * 0.5 + 0.5) * CANVAS_W, y: (-v.y * 0.5 + 0.5) * CANVAS_H });
    }
    return out;
  }

  debugInfo(): {
    players: number;
    coaches: number;
    goals: number;
    cameraMode: CameraMode;
    drawCalls: number;
    ball: { x: number; z: number } | null;
    possessionRing: boolean;
    ballMarker: boolean;
    ballTrail: boolean;
    labelsVisible: number;
    netShaking: boolean;
    bannerVisible: boolean;
    scoreBugVisible: boolean;
    fxQuality: FxQuality;
  } {
    return {
      players: this.players.size,
      coaches: this.coaches.length,
      goals: 2,
      cameraMode: this.cameraCtl.mode,
      drawCalls: this.renderer.info.render.calls,
      ball: this.lastState ? { x: this.lastState.ball.x, z: this.lastState.ball.z } : null,
      possessionRing: this.possessionRing.visible,
      ballMarker: this.ball.markerVisible,
      ballTrail: this.ball.trailVisible,
      labelsVisible: this.labelVisibleCount,
      netShaking: this.goals[0].isShaking || this.goals[1].isShaking,
      bannerVisible: !this.banner.classList.contains('hidden'),
      scoreBugVisible: !this.scoreBug.classList.contains('hidden'),
      fxQuality: this.fx.quality,
    };
  }

  /** Free every GPU resource and remove the canvas. */
  dispose(): void {
    if (this.bannerTimer) clearTimeout(this.bannerTimer);
    this.banner.remove();
    this.scoreBug.remove();
    this.vignette.remove();
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mats = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
      for (const m of mats) {
        const std = m as THREE.MeshStandardMaterial;
        std.map?.dispose();
        m.dispose();
      }
    });
    for (const model of this.players.values()) model.dispose();
    this.players.clear();
    for (const coach of this.coaches) coach.dispose();
    this.coaches = [];
    // The traverse above disposed the shared player geometry/materials too —
    // forget the module caches so the next 3D init rebuilds them fresh.
    resetSharedPlayerResources();
    this.cameraCtl.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

function colorDist(a: number, b: number): number {
  const dr = ((a >> 16) & 0xff) - ((b >> 16) & 0xff);
  const dg = ((a >> 8) & 0xff) - ((b >> 8) & 0xff);
  const db = (a & 0xff) - (b & 0xff);
  return Math.sqrt(dr * dr + dg * dg + db * db);
}
