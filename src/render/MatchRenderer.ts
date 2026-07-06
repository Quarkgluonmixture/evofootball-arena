import { Circle, Container, Graphics, Text } from 'pixi.js';
import type { Match } from '../sim/Match';
import type { Player } from '../sim/Player';
import { HALF_L, HALF_W, PITCH_LENGTH, PITCH_WIDTH } from '../sim/constants';
import { ACTION_SHORT } from './actionLabels';
import { CANVAS_H, CANVAS_W, MARGIN, SCALE, toPx } from './transform';

interface PlayerSprite {
  root: Container;
  body: Graphics;
  label: Text;
  actionLabel: Text;
  staminaBar: Graphics;
  selectRing: Graphics;
  lastAction: string;
}

export interface RenderFlags {
  actionLabels: boolean;
  heatmap: boolean;
}

/**
 * Draws the dynamic match state: players, ball + trail, goal FX, heatmap.
 * Renderers only read Match state — they never touch simulation data.
 */
export class MatchRenderer {
  readonly container = new Container();
  private heatLayer = new Graphics();
  private trailG = new Graphics();
  private playersLayer = new Container();
  private ballG = new Graphics();
  private fxLayer = new Container();

  private sprites = new Map<number, PlayerSprite>();
  private trail: Array<{ x: number; y: number }> = [];
  private eventCursor = 0;

  // Heatmap grid of ball positions (cols x rows over the pitch).
  private heatCols = 30;
  private heatRows = 20;
  private heat = new Float32Array(this.heatCols * this.heatRows);
  private heatDirty = 0;

  private goalText: Text;
  private flash: Graphics;
  private fxTime = -1;
  private match: Match | null = null;

  onSelectPlayer: ((gid: number) => void) | null = null;

  constructor() {
    this.container.addChild(this.heatLayer, this.trailG, this.playersLayer, this.ballG, this.fxLayer);

    this.flash = new Graphics();
    this.flash.rect(0, 0, CANVAS_W, CANVAS_H).fill(0xffffff);
    this.flash.alpha = 0;
    this.goalText = new Text({
      text: 'GOAL!',
      style: { fontFamily: 'Arial Black, sans-serif', fontSize: 64, fontWeight: '900', fill: 0xffffff, stroke: { color: 0x000000, width: 6 } },
    });
    this.goalText.anchor.set(0.5);
    this.goalText.position.set(CANVAS_W / 2, CANVAS_H / 2);
    this.goalText.alpha = 0;
    this.fxLayer.addChild(this.flash, this.goalText);
  }

  /** Rebuild sprites for a new match. */
  attach(match: Match): void {
    this.match = match;
    // destroy() the old containers (Text objects own GPU textures that GC
    // alone does not reliably free in Pixi v8) — removeChildren only detaches.
    for (const child of this.playersLayer.removeChildren()) {
      child.destroy({ children: true });
    }
    this.sprites.clear();
    this.trail = [];
    this.heat.fill(0);
    this.heatLayer.clear();
    this.eventCursor = match.events.length;
    this.fxTime = -1;
    this.goalText.alpha = 0;
    this.flash.alpha = 0;

    for (const p of match.allPlayers) {
      const team = match.teams[p.side];
      const root = new Container();
      const selectRing = new Graphics();
      selectRing.circle(0, 0, 10).stroke({ width: 2, color: 0xffffff, alpha: 0.9 });
      selectRing.visible = false;

      const body = new Graphics();
      const isGK = p.role === 'GK';
      const fill = isGK ? team.info.colors.secondary : team.info.colors.primary;
      const edge = isGK ? team.info.colors.primary : team.info.colors.secondary;
      body.circle(0, 0, 6.5).fill(fill).stroke({ width: 2, color: edge });

      const label = new Text({
        text: p.role[0],
        style: { fontFamily: 'monospace', fontSize: 9, fontWeight: '700', fill: isGK ? team.info.colors.primary : team.info.colors.secondary },
      });
      label.anchor.set(0.5);

      const actionLabel = new Text({
        text: '',
        style: { fontFamily: 'monospace', fontSize: 10, fill: 0xffffff, stroke: { color: 0x000000, width: 3 } },
      });
      actionLabel.anchor.set(0.5, 1);
      actionLabel.position.set(0, -10);

      const staminaBar = new Graphics();

      root.addChild(selectRing, body, label, staminaBar, actionLabel);
      root.eventMode = 'static';
      root.cursor = 'pointer';
      root.hitArea = new Circle(0, 0, 12);
      root.on('pointerdown', () => this.onSelectPlayer?.(p.gid));

      this.playersLayer.addChild(root);
      this.sprites.set(p.gid, { root, body, label, actionLabel, staminaBar, selectRing, lastAction: '' });
    }
  }

  /** @param stepsThisFrame how many sim steps ran — weights heatmap sampling. */
  update(dtReal: number, flags: RenderFlags, selectedGid: number | null, stepsThisFrame: number): void {
    const match = this.match;
    if (!match) return;

    for (const p of match.allPlayers) {
      const s = this.sprites.get(p.gid);
      if (!s) continue;
      const px = toPx(p.pos);
      s.root.position.set(px.x, px.y);
      s.selectRing.visible = selectedGid === p.gid;

      const short = ACTION_SHORT[p.action.type];
      s.actionLabel.visible = flags.actionLabels;
      if (flags.actionLabels && s.lastAction !== short) {
        s.actionLabel.text = short;
        s.lastAction = short;
      }

      s.staminaBar.clear();
      const w = 14 * p.stamina;
      const color = p.stamina > 0.5 ? 0x4ade80 : p.stamina > 0.25 ? 0xfacc15 : 0xef4444;
      s.staminaBar.rect(-7, 9, w, 2).fill({ color, alpha: 0.9 });
    }

    this.updateBall(match, stepsThisFrame, flags);
    this.updateFx(match, dtReal);
  }

  private updateBall(match: Match, steps: number, flags: RenderFlags): void {
    const px = toPx(match.ball.pos);

    // Trail: record when the ball actually moved.
    const last = this.trail[this.trail.length - 1];
    if (!last || Math.hypot(px.x - last.x, px.y - last.y) > 2) {
      this.trail.push(px);
      if (this.trail.length > 16) this.trail.shift();
    }
    this.trailG.clear();
    for (let i = 0; i < this.trail.length; i++) {
      const t = this.trail[i];
      this.trailG.circle(t.x, t.y, 1.5 + (i / this.trail.length) * 2).fill({ color: 0xffffff, alpha: 0.06 + (i / this.trail.length) * 0.15 });
    }

    this.ballG.clear();
    this.ballG.circle(px.x, px.y, 4).fill(0xffffff).stroke({ width: 1, color: 0x333333 });

    // Heatmap accumulation (weighted by sim steps so fast-forward still counts).
    if (flags.heatmap && match.phase === 'playing' && steps > 0) {
      const cx = Math.floor(((match.ball.pos.x + HALF_L) / PITCH_LENGTH) * this.heatCols);
      const cy = Math.floor(((match.ball.pos.y + HALF_W) / PITCH_WIDTH) * this.heatRows);
      if (cx >= 0 && cx < this.heatCols && cy >= 0 && cy < this.heatRows) {
        this.heat[cy * this.heatCols + cx] += steps;
      }
      if (++this.heatDirty >= 30) {
        this.heatDirty = 0;
        this.drawHeatmap();
      }
    }
    this.heatLayer.visible = flags.heatmap;
  }

  private drawHeatmap(): void {
    const g = this.heatLayer;
    g.clear();
    let max = 1;
    for (let i = 0; i < this.heat.length; i++) max = Math.max(max, this.heat[i]);
    const cw = (PITCH_LENGTH * SCALE) / this.heatCols;
    const ch = (PITCH_WIDTH * SCALE) / this.heatRows;
    for (let y = 0; y < this.heatRows; y++) {
      for (let x = 0; x < this.heatCols; x++) {
        const v = this.heat[y * this.heatCols + x] / max;
        if (v < 0.02) continue;
        g.rect(MARGIN + x * cw, MARGIN + y * ch, cw, ch).fill({ color: 0xff4400, alpha: v * 0.4 });
      }
    }
  }

  private updateFx(match: Match, dtReal: number): void {
    // Watch for new goal events to trigger celebration FX.
    while (this.eventCursor < match.events.length) {
      const ev = match.events[this.eventCursor++];
      if (ev.type === 'goal' && ev.side !== -1) {
        this.fxTime = 0;
        this.goalText.tint = match.teams[ev.side].info.colors.primary;
      }
    }
    if (this.fxTime >= 0) {
      this.fxTime += dtReal;
      const t = this.fxTime;
      const DUR = 1.6;
      if (t >= DUR) {
        this.fxTime = -1;
        this.goalText.alpha = 0;
        this.flash.alpha = 0;
      } else {
        this.flash.alpha = Math.max(0, 0.35 * (1 - t / 0.4));
        this.goalText.alpha = t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / (DUR - 0.2);
        this.goalText.scale.set(0.6 + Math.min(t / 0.3, 1) * 0.6);
      }
    }
  }
}
