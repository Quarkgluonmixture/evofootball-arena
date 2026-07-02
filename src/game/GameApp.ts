import { Application, type Ticker } from 'pixi.js';
import { clearSave, hasSave, loadLeague, saveLeague } from '../data/save';
import { DebugOverlay } from '../render/DebugOverlay';
import { MatchRenderer } from '../render/MatchRenderer';
import { PitchRenderer } from '../render/PitchRenderer';
import { CANVAS_H, CANVAS_W, toPx } from '../render/transform';
import { cameraForEvent, type CameraMode } from '../render3d/CameraController';
import {
  buildRenderState, buildRenderTheme, type RenderState,
} from '../render3d/RenderStateAdapter';
import { ThreeMatchRenderer } from '../render3d/ThreeMatchRenderer';
import { ReplayBuffer, type ReplayArchive } from '../replay/ReplayBuffer';
import { DT } from '../sim/constants';
import { League, type Fixture } from '../sim/League';
import type { Match } from '../sim/Match';
import type { MatchEvent } from '../sim/types';
import { defaultFlags, type GameActions, type UiFlags, type ViewMode } from '../ui/actions';
import { button, el } from '../ui/dom';
import { EventFeed } from '../ui/EventFeed';
import { LeagueScreen } from '../ui/LeagueScreen';
import { LeftPanel } from '../ui/LeftPanel';
import { ReplayBar } from '../ui/ReplayBar';
import { RightPanel } from '../ui/RightPanel';
import { SoundFx } from '../ui/SoundFx';

const DEFAULT_SEED = 1337;

/**
 * Top-level orchestrator: owns the League, the currently watched Match, the
 * Pixi renderers and the DOM panels. The watched match advances on a fixed
 * timestep accumulator (speed = sim-seconds per real second); headless
 * simulation runs the exact same Match code, so results are identical either
 * way (same seed => same game).
 */
export class GameApp implements GameActions {
  private league!: League;
  private fixture: Fixture | null = null;
  private match: Match | null = null;

  private app = new Application();
  private matchRenderer = new MatchRenderer();
  private debugOverlay = new DebugOverlay();

  private left!: LeftPanel;
  private right!: RightPanel;
  private feed!: EventFeed;
  private leagueScreen!: LeagueScreen;
  private statusEl!: HTMLElement;
  private seedInput!: HTMLInputElement;

  private paused = true;
  private speed = 1;
  private autoContinue = true;
  private flags: UiFlags = defaultFlags();
  private selectedGid: number | null = null;
  private acc = 0;
  private busy = false;
  private panelTimer = 0;

  // ---- 3D view & replay ----
  private viewMode: ViewMode = '2d';
  private three: ThreeMatchRenderer | null = null;
  private threeHost!: HTMLDivElement;
  private replayBar!: ReplayBar;
  private buffer = new ReplayBuffer();
  private archive: ReplayArchive | null = null;
  private sound = new SoundFx();
  private replay = {
    active: false,
    playing: false,
    t: 0,
    speed: 1,
    source: null as ReplayBuffer | null,
    events: [] as MatchEvent[],
  };

  async init(root: HTMLElement): Promise<void> {
    // ---- DOM shell ----
    const topbar = el('header');
    topbar.id = 'topbar';
    topbar.appendChild(el('h1', '', 'EVOFOOTBALL ARENA'));
    topbar.appendChild(button('League table', () => this.toggleLeagueScreen()));
    topbar.appendChild(button('Save', () => this.saveNow()));
    topbar.appendChild(button('Load', () => this.loadNow()));
    this.seedInput = el('input');
    this.seedInput.type = 'text';
    this.seedInput.placeholder = 'seed';
    topbar.appendChild(this.seedInput);
    topbar.appendChild(button('New league', () => this.newLeague(this.seedInput.value)));
    topbar.appendChild(button('Reset', () => this.resetAll(), 'danger'));
    topbar.appendChild(el('div', 'spacer'));
    this.statusEl = el('span', 'status', '');
    topbar.appendChild(this.statusEl);

    const layout = el('main');
    layout.id = 'layout';
    const leftEl = el('aside');
    leftEl.id = 'left-panel';
    const stage = el('section');
    stage.id = 'stage';
    const rightEl = el('aside');
    rightEl.id = 'right-panel';
    layout.append(leftEl, stage, rightEl);

    const feedEl = el('footer');
    feedEl.id = 'event-feed';
    root.append(topbar, layout, feedEl);

    // ---- Pixi ----
    await this.app.init({ width: CANVAS_W, height: CANVAS_H, background: 0x0b1220, antialias: true });
    stage.appendChild(this.app.canvas);

    // ---- 3D host (renderer created lazily on first switch to 3D) ----
    this.threeHost = el('div');
    this.threeHost.id = 'three-host';
    this.threeHost.style.display = 'none';
    stage.appendChild(this.threeHost);
    this.replayBar = new ReplayBar(stage, {
      onPlayPause: () => {
        this.replay.playing = !this.replay.playing;
        this.replayBar.setTime(this.replay.t, this.replay.playing, this.replay.speed);
      },
      onSpeed: (s) => {
        this.replay.speed = s;
        this.replayBar.setTime(this.replay.t, this.replay.playing, s);
      },
      onScrub: (t) => {
        this.replay.t = t;
        this.replay.playing = false;
        this.replayBar.setTime(t, false, this.replay.speed);
      },
      onJump: (ev) => this.replayJump(ev),
      onExit: () => this.exitReplay(),
    });
    const pitch = new PitchRenderer();
    this.app.stage.addChild(pitch.container, this.matchRenderer.container, this.debugOverlay.container);
    this.matchRenderer.onSelectPlayer = (gid) => {
      this.selectedGid = this.selectedGid === gid ? null : gid;
    };

    // ---- Panels ----
    this.left = new LeftPanel(leftEl, this, this.flags);
    this.right = new RightPanel(rightEl);
    this.feed = new EventFeed(feedEl);
    this.leagueScreen = new LeagueScreen(stage);
    this.leagueScreen.onSetPromotionMode = (m) => {
      this.league.promotionMode = m;
      saveLeague(this.league);
      this.leagueScreen.refreshIfVisible(this.league);
      this.feed.pushSystem(
        m === 'playoff'
          ? '⚔ Promotion rules: playoff mode — Premier 7th will host Challenger 2nd for the last spot.'
          : '📋 Promotion rules: automatic top/bottom two.',
      );
    };

    // ---- League ----
    const loaded = hasSave() ? loadLeague() : null;
    this.league = loaded ?? new League({ seed: DEFAULT_SEED });
    this.loadNextFixture();
    this.feed.pushSystem(loaded ? '💾 Loaded saved league.' : `🌱 New league (seed ${this.league.seed}). Press 1× to watch, or simulate a season.`);
    this.left.setSpeedUI(this.paused, this.speed);

    this.app.ticker.add((t) => this.frame(t));

    // Dev/testing hook: lets tooling (visual smoke tests, console poking)
    // find players on the canvas and inspect live state. Not used by the game.
    (window as unknown as { __evo?: unknown }).__evo = {
      app: this,
      playerPositions: () =>
        this.match ? this.match.allPlayers.map((p) => ({ gid: p.gid, ...toPx(p.pos) })) : [],
      canvasSize: { w: CANVAS_W, h: CANVAS_H },
      three: () => (this.three ? this.three.debugInfo() : null),
      threePlayerPositions: () => (this.three ? this.three.playerScreenPositions() : []),
      replayInfo: () => ({
        active: this.replay.active,
        playing: this.replay.playing,
        t: this.replay.t,
        speed: this.replay.speed,
        hasArchive: this.archive !== null,
        bufferSize: this.buffer.size,
      }),
      viewMode: () => this.viewMode,
    };
  }

  /* ---------------- frame loop ---------------- */

  private frame(t: Ticker): void {
    const dtReal = Math.min(t.deltaMS / 1000, 0.1);
    let steps = 0;
    if (!this.paused && !this.busy && this.match && !this.match.finished) {
      this.acc += dtReal * this.speed;
      const maxSteps = this.speed * 4 + 8; // spiral-of-death guard
      while (this.acc >= DT && steps < maxSteps) {
        this.match.step(DT);
        this.buffer.maybeRecord(this.match); // replay snapshots, 10 Hz sim-time
        this.acc -= DT;
        steps++;
        if (this.match.finished) {
          this.onWatchedMatchFinished();
          break;
        }
      }
      if (this.acc > DT * maxSteps) this.acc = 0; // drop debt we'll never repay
    }

    if (this.viewMode === '3d' && this.three) {
      this.three.update(this.currentRenderState(dtReal), dtReal, this.flags, this.selectedGid);
    } else {
      this.matchRenderer.update(dtReal, this.flags, this.selectedGid, steps);
      this.debugOverlay.update(this.match, this.flags);
    }
    if (this.match) this.left.updateClock(this.match);
    this.feed.sync();

    this.panelTimer += dtReal;
    if (this.panelTimer > 0.12) {
      this.panelTimer = 0;
      if (this.match) this.right.updateDynamic(this.match, this.selectedGid);
    }
  }

  /** What the 3D view should draw this frame: live sim state or replay state. */
  private currentRenderState(dtReal: number): RenderState | null {
    if (this.replay.active && this.replay.source) {
      if (this.replay.playing) {
        const range = this.replay.source.range();
        if (range) {
          this.replay.t = Math.min(this.replay.t + dtReal * this.replay.speed, range[1]);
          if (this.replay.t >= range[1]) this.replay.playing = false;
        }
        this.replayBar.setTime(this.replay.t, this.replay.playing, this.replay.speed);
      }
      return this.replay.source.stateAt(this.replay.t);
    }
    if (!this.match) return null;
    const anyOverlay =
      this.flags.formation || this.flags.passLines || this.flags.shotVector ||
      this.flags.marking || this.flags.chasers;
    return buildRenderState(this.match, anyOverlay);
  }

  /* ---------------- match lifecycle ---------------- */

  private loadNextFixture(): void {
    this.exitReplay();
    this.fixture = this.league.nextFixture();
    if (!this.fixture) return; // never happens: finishSeason immediately schedules the next
    this.match = this.league.createMatch(this.fixture);
    this.buffer.clear();
    this.matchRenderer.attach(this.match);
    this.three?.attach(buildRenderTheme(this.match));
    this.feed.attach(this.match);
    this.right.attach(this.match);
    this.left.updateHeader(this.match, this.league);
    this.selectedGid = null;
    this.acc = 0;
  }

  private onWatchedMatchFinished(): void {
    if (!this.fixture || !this.match) return;
    this.league.applyResult(this.fixture, this.match.getResult());
    this.afterFixtureApplied();
    if (!this.autoContinue) {
      this.paused = true;
      this.left.setSpeedUI(this.paused, this.speed);
    }
  }

  private afterFixtureApplied(): void {
    // Keep the finished match's recording around for 3D replay.
    if (this.match && this.buffer.hasContent) {
      this.archive = {
        buffer: this.buffer,
        theme: buildRenderTheme(this.match),
        events: this.match.events.filter((e) => e.type === 'goal' || e.type === 'shot' || e.type === 'save'),
        label: `${this.match.teams[0].info.short} ${this.match.score[0]}–${this.match.score[1]} ${this.match.teams[1].info.short}`,
      };
      this.buffer = new ReplayBuffer();
    }
    if (this.league.seasonDone) {
      const prevChampion = this.league.history[this.league.history.length - 1]?.championName;
      const rec = this.league.finishSeason();
      this.feed.pushSystem(
        rec.championName === prevChampion
          ? `🏆 ${rec.championName} retained the Premier title! (Season ${rec.generation})`
          : `🏆 ${rec.championName} are Premier champions! (Season ${rec.generation})`,
      );
      if (rec.d2Champion) this.feed.pushSystem(`🥇 ${rec.d2Champion} won the Challenger Division.`);
      if (rec.playoff) {
        this.feed.pushSystem(
          `⚔ Playoff: ${rec.playoff.homeName} ${rec.playoff.score[0]}–${rec.playoff.score[1]} ${rec.playoff.awayName} — ${rec.playoff.winnerName} take the final Premier spot.`,
        );
      }
      for (const p of rec.promoted ?? []) this.feed.pushSystem(`⬆️ ${p.name} promoted to the Premier Division.`);
      for (const r of rec.relegated ?? []) this.feed.pushSystem(`⬇️ ${r.name} relegated to the Challenger Division.`);
      for (const e of rec.evolution.entries) {
        if (e.kind === 'reborn') {
          this.feed.pushSystem(`🔄 ${e.name} born from ${e.parents?.join(' × ')} (drift ${e.drift.toFixed(2)})`);
        }
      }
      saveLeague(this.league);
      this.leagueScreen.refreshIfVisible(this.league);
    }
    this.loadNextFixture();
  }

  private finishCurrentMatchHeadless(): void {
    if (!this.match || !this.fixture) return;
    this.match.runToCompletion();
    this.league.applyResult(this.fixture, this.match.getResult());
    this.afterFixtureApplied();
  }

  /** Run fixtures headless while `cont()` holds, yielding to keep UI alive. */
  private async simFixtures(cont: () => boolean, label: string): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.left.setBusy(true);
    const t0 = performance.now();
    let count = 0;
    try {
      while (cont()) {
        this.finishCurrentMatchHeadless();
        count++;
        if (count % 4 === 0) {
          this.setStatus(`${label}: ${count} matches…`);
          await nextFrame();
        }
      }
    } finally {
      this.busy = false;
      this.left.setBusy(false);
      this.setStatus(`${label}: ${count} matches in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
      this.leagueScreen.refreshIfVisible(this.league);
    }
  }

  /* ---------------- GameActions ---------------- */

  setPaused(p: boolean): void {
    this.paused = p;
    this.left.setSpeedUI(this.paused, this.speed);
  }

  setSpeed(s: number): void {
    this.speed = s;
    this.paused = false;
    this.left.setSpeedUI(this.paused, this.speed);
  }

  skipMatch(): void {
    if (this.busy) return;
    this.finishCurrentMatchHeadless();
  }

  simRound(): void {
    const gen = this.league.generation;
    const round = this.league.currentRound();
    void this.simFixtures(
      () => this.league.generation === gen && this.league.currentRound() === round,
      `Round ${round}`,
    );
  }

  simSeason(): void {
    const gen = this.league.generation;
    void this.simFixtures(() => this.league.generation === gen, `Season ${gen}`);
  }

  simSeasons(n: number): void {
    const target = this.league.generation + n;
    void this.simFixtures(() => this.league.generation < target, `${n} seasons`);
  }

  setAutoContinue(v: boolean): void {
    this.autoContinue = v;
  }

  setFlag(key: keyof UiFlags, v: boolean): void {
    this.flags[key] = v;
  }

  toggleLeagueScreen(): void {
    this.leagueScreen.toggle(this.league);
  }

  setSound(v: boolean): void {
    this.sound.enabled = v;
  }

  saveNow(): void {
    if (saveLeague(this.league)) this.feed.pushSystem('💾 League saved.');
  }

  loadNow(): void {
    const loaded = loadLeague();
    if (!loaded) {
      this.feed.pushSystem('⚠️ No save found.');
      return;
    }
    this.league = loaded;
    this.loadNextFixture();
    this.feed.pushSystem('💾 League loaded.');
    this.leagueScreen.refreshIfVisible(this.league);
  }

  newLeague(seedText: string): void {
    if (this.busy) return;
    const seed = parseSeed(seedText);
    this.league = new League({ seed });
    this.loadNextFixture();
    this.paused = true;
    this.left.setSpeedUI(this.paused, this.speed);
    this.feed.pushSystem(`🌱 New league, seed ${seed}.`);
    this.leagueScreen.refreshIfVisible(this.league);
  }

  resetAll(): void {
    if (this.busy) return;
    if (!window.confirm('Delete the save and start over?')) return;
    clearSave();
    this.league = new League({ seed: DEFAULT_SEED });
    this.loadNextFixture();
    this.paused = true;
    this.left.setSpeedUI(this.paused, this.speed);
    this.feed.pushSystem('🗑️ Save cleared. Fresh league.');
    this.leagueScreen.refreshIfVisible(this.league);
  }

  /* ---------------- 3D view & replay actions ---------------- */

  setViewMode(v: ViewMode): void {
    if (v === this.viewMode) return;
    if (v === '3d') {
      try {
        if (!this.three) {
          this.three = new ThreeMatchRenderer(this.threeHost);
          this.three.onSelectPlayer = (gid) => {
            this.selectedGid = this.selectedGid === gid ? null : gid;
          };
          this.three.onFxEvent = (type) => this.sound.play(type);
          if (this.match) this.three.attach(buildRenderTheme(this.match));
        }
      } catch (err) {
        console.error('3D init failed:', err);
        this.feed.pushSystem('⚠️ 3D unavailable (WebGL init failed) — staying in 2D.');
        return;
      }
      this.viewMode = '3d';
      this.app.canvas.style.display = 'none';
      this.threeHost.style.display = '';
    } else {
      this.exitReplay();
      this.viewMode = '2d';
      this.threeHost.style.display = 'none';
      this.app.canvas.style.display = '';
      // Free GPU resources; the renderer is rebuilt lazily on the next switch.
      this.three?.dispose();
      this.three = null;
    }
    this.left.setViewUI(this.viewMode, this.three?.cameraMode ?? 'tactical');
  }

  setCameraMode(m: CameraMode): void {
    if (!this.three) return;
    this.three.setCameraMode(m);
    this.left.setViewUI(this.viewMode, m);
  }

  resetCamera(): void {
    this.three?.resetCamera();
  }

  openReplay(): void {
    if (this.replay.active) return;
    if (this.viewMode !== '3d') this.setViewMode('3d');
    if (this.viewMode !== '3d' || !this.three) return; // 3D init failed
    const useLive = this.buffer.hasContent;
    const source = useLive ? this.buffer : this.archive?.buffer ?? null;
    if (!source || !source.hasContent) {
      this.feed.pushSystem('🎬 Nothing recorded yet — watch some play first (headless sims are not recorded).');
      return;
    }
    const events = useLive
      ? this.match?.events.filter((e) => e.type === 'goal' || e.type === 'shot' || e.type === 'save') ?? []
      : this.archive!.events;
    if (!useLive) this.three.attach(this.archive!.theme);

    this.paused = true;
    this.left.setSpeedUI(true, this.speed);
    const range = source.range()!;
    this.replay = { active: true, playing: true, t: range[0], speed: 1, source, events };
    this.replayBar.show(range, events, {
      onPlayPause: () => {
        this.replay.playing = !this.replay.playing;
        this.replayBar.setTime(this.replay.t, this.replay.playing, this.replay.speed);
      },
      onSpeed: (s) => {
        this.replay.speed = s;
        this.replayBar.setTime(this.replay.t, this.replay.playing, s);
      },
      onScrub: (t) => {
        this.replay.t = t;
        this.replay.playing = false;
        this.replayBar.setTime(t, false, this.replay.speed);
      },
      onJump: (ev) => this.replayJump(ev),
      onExit: () => this.exitReplay(),
    });
    this.replayBar.setTime(this.replay.t, true, 1);
    this.feed.pushSystem(useLive ? '🎬 Replaying the current match.' : `🎬 Replaying ${this.archive!.label}.`);
  }

  private replayJump(ev: MatchEvent): void {
    const range = this.replay.source?.range();
    if (!range) return;
    this.replay.t = Math.max(range[0], ev.t - 3); // 3s lead-in to the moment
    // Goals and saves replay in slow motion.
    this.replay.speed = ev.type === 'goal' || ev.type === 'save' ? 0.5 : 1;
    this.replay.playing = true;
    // Pick the camera that best presents this kind of moment, and re-arm
    // one-shot effects so the banner/net-shake/xG marker fire again.
    if (this.three && (ev.type === 'goal' || ev.type === 'shot' || ev.type === 'save' || ev.type === 'interception')) {
      const cam = cameraForEvent(ev.type);
      this.three.setCameraMode(cam);
      this.left.setViewUI(this.viewMode, cam);
      this.three.resetFx();
    }
    this.replayBar.setTime(this.replay.t, true, this.replay.speed);
  }

  private exitReplay(): void {
    if (!this.replay.active) return;
    this.replay.active = false;
    this.replay.source = null;
    this.replayBar.hide();
    // Restore the live match's kits if the replay used an archived theme.
    if (this.three && this.match) this.three.attach(buildRenderTheme(this.match));
  }

  private setStatus(text: string): void {
    this.statusEl.textContent = text;
  }
}

function parseSeed(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return Math.floor(Math.random() * 2 ** 31);
  const n = Number.parseInt(trimmed, 10);
  if (Number.isFinite(n)) return n >>> 0;
  // Hash arbitrary strings so "gegenpress" is a valid seed.
  let h = 2166136261;
  for (let i = 0; i < trimmed.length; i++) {
    h ^= trimmed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const nextFrame = (): Promise<void> => new Promise((r) => requestAnimationFrame(() => r()));
