import * as THREE from 'three';
import { ACTION_SHORT } from '../render/actionLabels';
import { CANVAS_H, CANVAS_W } from '../render/transform';
import type { UiFlags } from '../ui/actions';
import { AnimationSystem } from './AnimationSystem';
import { BallModel } from './BallModel';
import { CameraController, type CameraMode } from './CameraController';
import { FxSystem, type FxQuality } from './FxSystem';
import { Goal3D } from './GoalModel';
import { declutterLabels, type LabelItem } from './labelDeclutter';
import { Overlays3D } from './Overlays3D';
import { createPitch } from './PitchModel';
import { PlayerModel, disposeKit, makeKit, type KitMaterials } from './PlayerModel';
import type { FxEvent, RenderState, RenderTheme } from './RenderStateAdapter';
import { createScene } from './SceneFactory';

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
  private kits: KitMaterials[] = [];
  private anim = new AnimationSystem();
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

  constructor(host: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(CANVAS_W, CANVAS_H);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    host.appendChild(this.renderer.domElement);

    this.scene = createScene();
    this.scene.add(createPitch(this.renderer.capabilities.getMaxAnisotropy()));
    this.goals = [new Goal3D(1), new Goal3D(-1)];
    this.scene.add(this.goals[0].group, this.goals[1].group);
    this.scene.add(this.ball.root, this.ball.worldTrail, this.overlays.root, this.fx.root, this.playersGroup);

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
    host.append(this.vignette, this.scoreBug, this.banner);

    // Renderer-owned event feedback.
    this.fx.hooks = {
      onGoal: (side) => {
        this.goals[side].shake();
        const team = this.theme?.teams[side];
        const score = this.lastState ? `${this.lastState.score[0]}–${this.lastState.score[1]}` : '';
        if (team) this.showBanner(team.name, score, team.primary);
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
      const labelColor = `#${theme.teams[p.side].primary.toString(16).padStart(6, '0')}`;
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
      for (const p of state.players) {
        const model = this.players.get(p.gid);
        if (!model) continue;
        model.setPose(p.x, p.z, p.yaw);
        model.setSelected(selectedGid === p.gid);
        model.setLabel(ACTION_SHORT[p.action], flags.actionLabels);
        this.anim.update(model, p, state, dt);
      }
      this.declutter(state, selectedGid);
      this.updatePossessionRing(state, dt);
      this.ball.update(state.ball, state.players, dt);
      this.overlays.update(state.overlays, flags);
      const gids = this.overlays.activeChaserGids;
      gids.forEach((gid, i) => {
        const p = state.players.find((x) => x.gid === gid);
        if (p) this.overlays.placeChaserRing(i, p.x, p.z);
      });
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

  /** Broadcast score bug: `RUS 2–1 OBS · 34'` with kit-color chips. */
  private updateScoreBug(state: RenderState): void {
    const t = this.theme;
    if (!t) return;
    this.scoreBug.classList.remove('hidden');
    const text = `${t.teams[0].short}${state.score[0]}${state.score[1]}${t.teams[1].short}${state.minute}`;
    if (text === this.scoreBugText) return;
    this.scoreBugText = text;
    const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;
    this.scoreBug.innerHTML =
      `<span class="sb-chip" style="background:${hex(t.teams[0].primary)}"></span>` +
      `<span class="sb-team">${t.teams[0].short}</span>` +
      `<span class="sb-score">${state.score[0]}–${state.score[1]}</span>` +
      `<span class="sb-team">${t.teams[1].short}</span>` +
      `<span class="sb-chip" style="background:${hex(t.teams[1].primary)}"></span>` +
      `<span class="sb-min">${state.minute}'</span>`;
  }

  private showBanner(team: string, score: string, color: number): void {
    this.banner.innerHTML =
      `<div class="gb-title">GOAL!</div>` +
      `<div class="gb-sub">${team}${score ? ` · ${score}` : ''}</div>`;
    this.banner.style.borderColor = `#${color.toString(16).padStart(6, '0')}`;
    this.banner.style.color = `#${color.toString(16).padStart(6, '0')}`;
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
