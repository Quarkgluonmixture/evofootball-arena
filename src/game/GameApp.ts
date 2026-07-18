import { Application, type Ticker } from 'pixi.js';
import {
  clearSave, exportLeagueJSON, hasSave, importLeagueJSON, loadLeague, saveLeague,
} from '../data/save';
import { DebugOverlay } from '../render/DebugOverlay';
import { MatchRenderer } from '../render/MatchRenderer';
import { PitchRenderer } from '../render/PitchRenderer';
import { CANVAS_H, CANVAS_W, toPx } from '../render/transform';
import { cameraForEvent, type CameraMode } from '../render3d/CameraController';
import {
  buildOverlays, buildRenderState, buildRenderTheme, type RenderState,
} from '../render3d/RenderStateAdapter';
import { ShootoutTheater } from '../render3d/ShootoutTheater';
import { ThreeMatchRenderer } from '../render3d/ThreeMatchRenderer';
import { playerDimStats, playerNameplate, playerVector } from '../evolution/playerStyle';
import { ROSTER_ROLES } from '../evolution/playerGenome';
import { TRAIT_EMOJI, traitsOf } from '../evolution/traits';
import { momentWindow, pickHighlights } from '../replay/highlights';
import { ReplayBuffer, type ReplayArchive } from '../replay/ReplayBuffer';
import { DT } from '../sim/constants';
import { CUP_ROUND_NAMES, resolveShootout, shootoutLineup, type ShootoutKick } from '../sim/cup';
import { lang, setLang, t } from '../ui/i18n';
import { League, type Fixture, type SeasonRecord } from '../sim/League';
import { cupDrawLines, cupResultLines, seasonRecordLines } from './announcements';
import { Match } from '../sim/Match';
import type { SimRequest } from '../sim/simRunner';
import { hashSeed, Rng } from '../utils/rng';
import type { SimWorkerMessage } from './simWorker';
import type { MatchEvent } from '../sim/types';
import {
  anyOverlayOn, defaultFlags, type FxQuality, type GameActions, type UiFlags, type ViewMode,
} from '../ui/actions';
import { button, colorHex, el } from '../ui/dom';
import { ClashBanner } from '../ui/ClashBanner';
import { EventFeed } from '../ui/EventFeed';
import { EvolutionScreen } from '../ui/EvolutionScreen';
import { PlayerScreen } from '../ui/PlayerScreen';
import { LeagueScreen } from '../ui/LeagueScreen';
import { RebirthCeremony } from '../ui/RebirthCeremony';
import { LeftPanel } from '../ui/LeftPanel';
import { ReplayBar } from '../ui/ReplayBar';
import { RightPanel } from '../ui/RightPanel';
import { MusicSystem } from '../ui/MusicSystem';
import { SoundFx } from '../ui/SoundFx';

// Chosen so a fresh league OPENS with a banger (Phase 28.2): seed 1168's
// first fixture is a 3–3 with 19 shots, 4 corners and a late goal — the
// first thing a new player watches should sell the game.
const DEFAULT_SEED = 1168;

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
  private evolutionScreen!: EvolutionScreen;
  private playerScreen!: PlayerScreen;
  private ceremony!: RebirthCeremony;
  private clash!: ClashBanner;
  /** Pre-match clash auto-hides at kickoff; scoreboard-opened ones are pinned. */
  private clashAutoHide = true;
  /** Pause state to restore when the auto-shown rebirth ceremony closes. */
  private ceremonyPrevPaused = false;
  private statusEl!: HTMLElement;
  private seedInput!: HTMLInputElement;

  private paused = true;
  private speed = 1;
  private autoContinue = true;
  /** A standalone Wildcard-vs-leader match is on screen (no league bookkeeping). */
  private exhibition = false;
  private cinematic = false;
  private fxQuality: FxQuality = 'medium';
  private cineBug!: HTMLDivElement;
  private flags: UiFlags = defaultFlags();
  private selectedGid: number | null = null;
  private acc = 0;
  private busy = false;
  private panelTimer = 0;

  // ---- sim worker (fast-sim off the main thread; falls back gracefully) ----
  private simWorker: Worker | null = null;
  private simWorkerBroken = false;
  private lastSimMode: 'worker' | 'main' | null = null;

  // ---- 3D view & replay ----
  private viewMode: ViewMode = '2d';
  private three: ThreeMatchRenderer | null = null;
  private threeHost!: HTMLDivElement;
  private replayBar!: ReplayBar;
  private buffer = new ReplayBuffer();
  private archive: ReplayArchive | null = null;
  private sound = new SoundFx();
  private music = new MusicSystem();
  private replay = {
    active: false,
    playing: false,
    t: 0,
    speed: 1,
    source: null as ReplayBuffer | null,
    events: [] as MatchEvent[],
  };

  // ---- highlight reel (Phase 33): HT/FT moments, auto-played ----
  private autoHighlights = false;
  private reel: { moments: MatchEvent[]; idx: number; endT: number; prevCam: CameraMode; prevPaused: boolean } | null = null;
  private reelBug!: HTMLDivElement;
  /** HT reel already covered everything up to this sim time (per match). */
  private reelShownUpTo = -1;
  private htReelDone = false;
  /** Half-time / full-time presentation hold (Phase 41.1): real seconds to
   * linger on the frozen match so the walk-to-tunnel plays. Only when auto-
   * highlights is off (else the reel owns the whistle). */
  private presentHoldT = 0;
  private htHeld = false;

  // ---- shootout theater (Phase 24): kick-by-kick pens presentation ----
  private theater: ShootoutTheater | null = null;
  /** Camera mode to restore when the theater ends. */
  private theaterPrevCam: CameraMode | null = null;
  /** Debug-hook theater: presentation only, never applies a result. */
  private theaterDebug = false;
  private shootoutHintShown = false;

  async init(root: HTMLElement): Promise<void> {
    // ---- DOM shell ----
    const topbar = el('header');
    topbar.id = 'topbar';
    // Publish the topbar's real height (it wraps to two rows on phones) so
    // the fixed-position league overlay can sit exactly below it (28.3).
    const setTopbarVar = () =>
      document.documentElement.style.setProperty('--topbar-h', `${topbar.offsetHeight}px`);
    window.addEventListener('resize', setTopbarVar);
    requestAnimationFrame(setTopbarVar);
    topbar.appendChild(el('h1', '', 'EVOFOOTBALL ARENA'));
    topbar.appendChild(button(t('League table'), () => this.toggleLeagueScreen()));
    topbar.appendChild(button(`🧬 ${t('Evolution')}`, () => this.toggleEvolutionScreen()));
    topbar.appendChild(button(`👥 ${t('Players')}`, () => this.togglePlayerScreen()));
    topbar.appendChild(button(t('Save'), () => this.saveNow()));
    topbar.appendChild(button(t('Load'), () => this.loadNow()));
    topbar.appendChild(button(t('Export'), () => this.exportSave()));
    topbar.appendChild(button(t('Import'), () => this.importSave()));
    this.seedInput = el('input');
    this.seedInput.type = 'text';
    this.seedInput.placeholder = t('seed');
    topbar.appendChild(this.seedInput);
    topbar.appendChild(button(t('New league'), () => this.newLeague(this.seedInput.value)));
    topbar.appendChild(button(t('Reset'), () => this.resetAll(), 'danger'));
    // Language toggle (Phase 28.1) — persists and reloads (panels build once).
    topbar.appendChild(button(lang === 'zh' ? 'EN' : '中文', () => setLang(lang === 'zh' ? 'en' : 'zh')));
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
    // Highlight-reel chip (Phase 33): tells the viewer this is a replay, not
    // live play, and which moment of how many is running.
    this.reelBug = el('div') as HTMLDivElement;
    this.reelBug.className = 'reel-bug hidden';
    stage.appendChild(this.reelBug);

    // Cinematic mode chrome: the ENTER control lives on the stage (34.1,
    // user request — it's used constantly, one tap beats a panel dive), the
    // exit control appears in its place, and 2D keeps a minimal score bug.
    const cineEnter = button(t('🎥'), () => this.setCinematic(true));
    cineEnter.className = 'cinematic-enter';
    cineEnter.title = t('🎥 Cinematic');
    stage.appendChild(cineEnter);
    const cineExit = button(t('✕ exit cinematic'), () => this.setCinematic(false));
    cineExit.className = 'cinematic-exit';
    stage.appendChild(cineExit);
    this.cineBug = el('div') as HTMLDivElement;
    this.cineBug.className = 'score-bug cine-bug hidden';
    this.cineBug.addEventListener('click', () => this.toggleClash());
    stage.appendChild(this.cineBug);
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && this.cinematic) this.setCinematic(false);
    });

    const pitch = new PitchRenderer();
    this.app.stage.addChild(pitch.container, this.matchRenderer.container, this.debugOverlay.container);
    this.matchRenderer.onSelectPlayer = (gid) => {
      this.selectedGid = this.selectedGid === gid ? null : gid;
    };

    // ---- Panels ----
    this.left = new LeftPanel(leftEl, this, this.flags);
    this.right = new RightPanel(rightEl);
    // Player identity context (Phase 54): traits + data-driven nameplate
    // (z vs the CURRENT 144-player population) + the career highlight —
    // league-side knowledge the match view can't derive on its own.
    this.right.playerContext = (teamId, index) => {
      const f = this.league.franchises.find((x) => x.id === teamId);
      const style = f?.squadStyles?.[index];
      if (!f || !style) return null;
      const stats = playerDimStats(
        this.league.franchises.flatMap((x) =>
          x.squad.map((p, i) => playerVector(p, x.squadStyles[i]))),
      );
      const chips = traitsOf(f.squad[index], ROSTER_ROLES[index], style)
        .map((tt) => TRAIT_EMOJI[tt]).join('');
      const c = f.careers[index];
      const highlight = c?.bestGoals
        ? `🌟 S${c.bestGoalsSeason}: ${c.bestGoals} goals${c.bestRating ? ` · best rating ${c.bestRating.toFixed(2)} (S${c.bestRatingSeason})` : ''}`
        : c?.bestRating
          ? `🌟 best rating ${c.bestRating.toFixed(2)} (S${c.bestRatingSeason})`
          : undefined;
      return {
        chips,
        plate: playerNameplate(playerVector(f.squad[index], style), stats),
        highlight,
      };
    };
    this.feed = new EventFeed(feedEl);
    this.leagueScreen = new LeagueScreen(stage);
    this.leagueScreen.onSetPromotionMode = (m) => {
      this.league.promotionMode = m;
      saveLeague(this.league);
      this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      this.feed.pushSystem(
        m === 'playoff'
          ? '⚔ Promotion rules: playoff mode — Premier 7th will host Challenger 2nd for the last spot.'
          : '📋 Promotion rules: automatic top/bottom two.',
      );
    };
    this.leagueScreen.onSetCupDrawMode = (m) => {
      this.league.cupDrawMode = m;
      saveLeague(this.league);
      this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      this.feed.pushSystem(
        m === 'shootout'
          ? '🥅 Cup draw rule: level ties now go to a penalty shootout.'
          : '⚡ Cup draw rule: level ties send the underdog through.',
      );
    };
    // Phase 32.5: evolution made visible — the season-end rebirth ceremony
    // (auto-shown, reopenable from the Evolution tab) and the pre-match clash.
    this.ceremony = new RebirthCeremony(stage, () => this.onCeremonyClosed());
    this.leagueScreen.onShowCeremony = () => this.showCeremony();
    this.evolutionScreen = new EvolutionScreen(stage);
    this.evolutionScreen.onShowCeremony = () => this.showCeremony();
    this.playerScreen = new PlayerScreen(stage);
    this.clash = new ClashBanner(stage);
    // UI click sounds (Phase 90): one capture listener; the big match
    // controls get the heavy press, checkboxes the toggle.
    document.addEventListener('click', (e) => {
      const el = e.target as HTMLElement;
      const btn = el.closest('button');
      if (btn) this.sound.playUi(btn.closest('.speed-row') ? 'heavy' : 'click');
      else if (el instanceof HTMLInputElement && el.type === 'checkbox') this.sound.playUi('toggle');
    });

    // ---- League ----
    const loaded = hasSave() ? loadLeague() : null;
    this.league = loaded ?? new League({ seed: DEFAULT_SEED });
    this.loadNextFixture();
    this.feed.pushSystem(loaded ? '💾 Loaded saved league.' : `🌱 New league (seed ${this.league.seed}). Watch the match, or simulate a season.`);
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
      cinematic: () => this.cinematic,
      simMode: () => this.lastSimMode,
      theater: () => (this.theater ? this.theater.info() : null),
      debugShootout: () => this.debugShootout(),
      showCeremony: () => this.showCeremony(),
      clashVisible: () => this.clash.isVisible,
      reelActive: () => this.reel !== null,
      liveMoments: () =>
        this.match
          ? this.match.events.filter((e) => e.type === 'goal' || e.type === 'shot' || e.type === 'save').length
          : 0,
    };

    // Default view is 3D (Phase 27.5, user request) — setViewMode falls back
    // to 2D with a feed notice where WebGL is unavailable.
    this.setViewMode('3d');
  }

  /* ---------------- frame loop ---------------- */

  private frame(t: Ticker): void {
    const dtReal = Math.min(t.deltaMS / 1000, 0.1);
    let steps = 0;
    // A shootout theater owns the stage — the sim never advances behind it.
    if (!this.paused && !this.busy && this.match && !this.match.finished && !this.theater && this.presentHoldT <= 0) {
      this.acc += dtReal * this.speed;
      const maxSteps = this.speed * 4 + 8; // spiral-of-death guard
      while (this.acc >= DT && steps < maxSteps) {
        this.match.step(DT);
        this.buffer.maybeRecord(this.match); // replay snapshots, 10 Hz sim-time
        this.acc -= DT;
        steps++;
        // Half-time / full-time: linger ~3s so the walk-to-tunnel plays (41.1),
        // unless auto-highlights owns the whistle with a reel.
        if (this.match.finished) {
          if (this.autoHighlights) this.onWatchedMatchFinished();
          else this.presentHoldT = 3;
          break;
        }
        if (this.match.phase === 'halftime' && !this.htHeld && !this.autoHighlights) {
          this.htHeld = true;
          this.presentHoldT = 3;
          break;
        }
      }
      if (this.acc > DT * maxSteps) this.acc = 0; // drop debt we'll never repay
    }

    // Tick the HT/FT presentation hold down on real time; at full-time, move on
    // to the next fixture once it elapses (a manual pause freezes it too).
    if (this.presentHoldT > 0 && !this.paused) {
      this.presentHoldT -= dtReal;
      if (this.presentHoldT <= 0 && this.match && this.match.finished) this.onWatchedMatchFinished();
    }

    // Highlight reel (Phase 33): advance to the next moment, and catch the
    // half-time whistle of a watched match to roll the H1 moments.
    if (this.reel && this.replay.active && this.replay.t >= this.reel.endT) this.nextReelMoment();
    if (this.match && !this.match.finished && this.match.phase === 'halftime' && !this.htReelDone) {
      this.htReelDone = true;
      const shownUpTo = this.match.simTime;
      const evs = this.match.events.filter((e) => e.type === 'goal' || e.type === 'save');
      if (this.maybeStartReel(this.buffer, evs, -1)) this.reelShownUpTo = shownUpTo;
    }

    if (this.viewMode === '3d' && this.three) {
      this.three.update(this.currentRenderState(dtReal), dtReal, this.flags, this.selectedGid);
    } else {
      this.matchRenderer.update(dtReal, this.flags, this.selectedGid, steps);
      const m = this.match;
      this.debugOverlay.update(
        m && anyOverlayOn(this.flags) ? buildOverlays(m) : null,
        this.flags,
        m ? [m.teams[0].info.colors.primary, m.teams[1].info.colors.primary] : [0xffffff, 0xffffff],
      );
    }
    if (this.match) this.left.updateClock(this.match);
    this.feed.sync();

    this.panelTimer += dtReal;
    if (this.panelTimer > 0.12) {
      this.panelTimer = 0;
      if (this.match) this.right.updateDynamic(this.match, this.selectedGid);
      // The pre-match clash is a broadcast graphic, not a modal: it clears
      // itself once the match is properly under way (manual opens are pinned).
      if (this.clash.isVisible && this.clashAutoHide && this.match && this.match.simTime > 10) {
        this.clash.hide();
        this.updateMusic();
      }
      this.updateCineBug();
    }
  }

  private lastCineBugKey = '';

  /** Minimal broadcast overlay for 2D cinematic mode (3D has its own bug). */
  private updateCineBug(): void {
    const show = this.cinematic && this.viewMode === '2d' && this.match !== null;
    this.cineBug.classList.toggle('hidden', !show);
    if (!show || !this.match) return;
    const m = this.match;
    // Diff before rebuilding the markup (same pattern as the 3D score bug).
    const key = `${m.teams[0].info.short}|${m.score[0]}|${m.score[1]}|${m.clockText()}`;
    if (key === this.lastCineBugKey) return;
    this.lastCineBugKey = key;
    this.cineBug.innerHTML =
      `<span class="sb-chip" style="background:${colorHex(m.teams[0].info.colors.primary)}"></span>` +
      `<span class="sb-team">${m.teams[0].info.short}</span>` +
      `<span class="sb-score">${m.score[0]}–${m.score[1]}</span>` +
      `<span class="sb-team">${m.teams[1].info.short}</span>` +
      `<span class="sb-chip" style="background:${colorHex(m.teams[1].info.colors.primary)}"></span>` +
      `<span class="sb-min">${m.clockText()}'</span>`;
  }

  /** What the 3D view should draw this frame: live sim, replay, or theater. */
  private currentRenderState(dtReal: number): RenderState | null {
    if (this.theater) {
      const st = this.theater.advance(this.paused ? 0 : dtReal);
      for (const k of this.theater.takeEvents()) this.announceKick(k);
      // Director's cut: wide shot for the closing celebration (only if the
      // user hasn't taken the camera over themselves).
      if (this.theater.finale && this.three && this.three.cameraMode === 'penalty') {
        this.three.setCameraMode('broadcast');
        this.left.setViewUI(this.viewMode, 'broadcast');
      }
      if (this.theater.done) this.finishTheater();
      return st;
    }
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
    return buildRenderState(this.match, anyOverlayOn(this.flags));
  }

  /* ---------------- match lifecycle ---------------- */

  private loadNextFixture(): void {
    this.exitReplay();
    this.dropTheater(); // league (re)loads discard any pending presentation
    this.exhibition = false; // any league (re)load ends a pending exhibition
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
    this.htReelDone = false;
    this.htHeld = false;
    this.presentHoldT = 0;
    this.reelShownUpTo = -1;
    // The clash of identities this fixture is (32.5) — tap or kickoff clears it.
    this.clashAutoHide = true;
    this.clash.show(
      this.match,
      this.fixture.cup ? `${CUP_ROUND_NAMES[this.fixture.round]}` : this.league.roundLabel(),
      this.league.franchises.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })),
    );
    this.updateMusic();
  }

  /**
   * Toggle the tactical-DNA clash for the current match (user request,
   * Phase 33): the scoreboard is the button, any time — a manual open is
   * pinned (no kickoff auto-hide), a tap on the banner still closes it.
   */
  toggleClash(): void {
    if (this.clash.isVisible) {
      this.clash.hide();
      this.updateMusic();
      return;
    }
    if (!this.match) return;
    this.clashAutoHide = false;
    this.clash.show(
      this.match,
      this.exhibition || !this.fixture
        ? 'Friendly'
        : this.fixture.cup
          ? `${CUP_ROUND_NAMES[this.fixture.round]}`
          : this.league.roundLabel(),
      this.league.franchises.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })),
    );
    this.updateMusic();
  }

  private onWatchedMatchFinished(): void {
    // Exhibition FT: report, archive the replay, restore the league fixture —
    // absolutely no league bookkeeping (table/Elo/stats untouched).
    if (this.exhibition && this.match) {
      const m = this.match;
      this.feed.pushSystem(
        `⚡ Exhibition FT: ${m.teams[0].info.short} ${m.score[0]}–${m.score[1]} ${m.teams[1].info.short}.`,
      );
      this.archiveReplay();
      this.loadNextFixture();
      this.paused = true;
      this.left.setSpeedUI(true, this.speed);
      return;
    }
    if (!this.fixture || !this.match) return;
    // Phase 24: a drawn cup tie in shootout mode is presented kick by kick in
    // 3D — the result (same seeded pure function the League applies) is
    // staged first; applyResult runs when the theater ends.
    if (this.fixture.cup && this.match.score[0] === this.match.score[1]) {
      const ctx = this.league.shootoutContext(this.fixture);
      if (ctx) {
        const kicks: ShootoutKick[] = [];
        if (resolveShootout(ctx.home, ctx.away, ctx.rng, kicks)) {
          if (this.viewMode === '3d' && this.three) {
            this.startTheater(kicks);
            return;
          }
          if (!this.shootoutHintShown) {
            this.shootoutHintShown = true;
            this.feed.pushSystem('🥅 Tip: watch cup ties in 3D to see shootouts play out kick by kick.');
          }
        }
      }
    }
    // FT highlights (Phase 33): what the HT reel already showed stays shown.
    const reelMinT = this.reelShownUpTo;
    this.league.applyResult(this.fixture, this.match.getResult());
    this.afterFixtureApplied();
    if (!this.autoContinue) {
      this.paused = true;
      this.left.setSpeedUI(this.paused, this.speed);
    }
    // The archive holds the finished match; the reel plays over the loaded
    // next fixture and hands control back where it found it.
    if (this.archive) this.maybeStartReel(this.archive.buffer, this.archive.events, reelMinT);
  }

  /* ---------------- highlight reel (Phase 33) ---------------- */

  /**
   * Auto-play recorded moments (goals + big saves) back-to-back. Presentation
   * only: frames come from the ReplayBuffer, cameras from cameraForEvent,
   * slow-mo for the drama, ⏭ skips. 3D watched matches only — headless sims
   * record nothing and 2D has no cinematic cameras. Returns whether it ran.
   */
  private maybeStartReel(source: ReplayBuffer | null, events: MatchEvent[], minT: number): boolean {
    if (!this.autoHighlights || this.viewMode !== '3d' || !this.three) return false;
    if (this.replay.active || this.theater || this.reel || this.ceremony.isVisible) return false;
    if (!source || !source.hasContent) return false;
    const range = source.range();
    if (!range) return false;
    const moments = pickHighlights(events, minT);
    if (moments.length === 0) return false;
    this.clash.hide(); // the reel owns the stage; the clash returns after
    this.reel = { moments, idx: -1, endT: 0, prevCam: this.three.cameraMode, prevPaused: this.paused };
    this.paused = true;
    this.left.setSpeedUI(true, this.speed);
    this.replay = { active: true, playing: true, t: range[0], speed: 0.5, source, events: [] };
    this.feed.pushSystem('🎬 Highlights (⏭ skips).');
    this.nextReelMoment();
    return true;
  }

  private nextReelMoment(): void {
    const reel = this.reel;
    if (!reel || !this.three || !this.replay.source) return;
    reel.idx++;
    if (reel.idx >= reel.moments.length) {
      this.endReel();
      return;
    }
    const range = this.replay.source.range()!;
    const ev = reel.moments[reel.idx];
    const w = momentWindow(ev, range);
    reel.endT = w.to;
    this.replay.t = w.from;
    this.replay.speed = w.speed;
    this.replay.playing = true;
    if (ev.type === 'goal' || ev.type === 'shot' || ev.type === 'save' || ev.type === 'interception') {
      this.three.setCameraMode(cameraForEvent(ev.type));
    }
    this.three.resetFx();
    this.reelBug.textContent = `🎬 ${ev.minute}' · ${reel.idx + 1}/${reel.moments.length}`;
    this.reelBug.classList.remove('hidden');
  }

  private endReel(): void {
    const reel = this.reel;
    if (!reel) return;
    this.reel = null;
    this.reelBug.classList.add('hidden');
    this.replay.active = false;
    this.replay.playing = false;
    this.replay.source = null;
    if (this.three) {
      this.three.setCameraMode(reel.prevCam);
      this.left.setViewUI(this.viewMode, reel.prevCam);
      if (this.match) this.three.attach(buildRenderTheme(this.match));
    }
    this.paused = reel.prevPaused;
    this.left.setSpeedUI(this.paused, this.speed);
    // An FT reel covered the next fixture's pre-match clash — bring it back.
    if (this.match && this.match.simTime < 10 && this.fixture) {
      this.clashAutoHide = true;
      this.clash.show(
        this.match,
        this.fixture.cup ? `${CUP_ROUND_NAMES[this.fixture.round]}` : this.league.roundLabel(),
      );
      this.updateMusic();
    }
  }

  setAutoHighlights(v: boolean): void {
    this.autoHighlights = v;
    if (!v) this.endReel();
  }

  /* ---------------- shootout theater (Phase 24) ---------------- */

  private startTheater(kicks: ShootoutKick[]): void {
    if (!this.match || !this.three) return;
    const m = this.match;
    this.theater = new ShootoutTheater(kicks, buildRenderState(m, false).players, [m.score[0], m.score[1]]);
    this.theaterPrevCam = this.three.cameraMode;
    this.three.setCameraMode('penalty');
    this.left.setViewUI(this.viewMode, 'penalty');
    this.paused = false;
    this.left.setSpeedUI(false, this.speed);
    this.feed.pushSystem(
      `🥅 Level at full time — penalty shootout: ${m.teams[0].info.name} vs ${m.teams[1].info.name} (⏭ to skip).`,
    );
  }

  /** One feed line per landed kick, with the real kicker/keeper names. */
  private announceKick(k: ShootoutKick): void {
    const m = this.match;
    if (!m) return;
    const kicker = m.teams[k.side].players[k.kicker];
    const keeper = m.teams[1 - k.side].players[0];
    const tag = k.sudden ? 'Sudden death' : 'Pens';
    this.feed.pushSystem(
      k.scored
        ? `🥅 ${tag}: ${kicker.name} scores — ${k.h}–${k.a}.`
        : `🥅 ${tag}: ${kicker.name} — SAVED by ${keeper.name}! Still ${k.h}–${k.a}.`,
    );
  }

  /**
   * End the theater: drain remaining feed lines, restore the camera, then
   * apply the deferred result (the League's own seeded shootout resolves to
   * the exact same score). Debug theaters apply nothing.
   */
  private finishTheater(): void {
    const th = this.theater;
    if (!th) return;
    th.skip();
    for (const k of th.takeEvents()) this.announceKick(k);
    this.theater = null;
    if (this.three && this.theaterPrevCam) {
      this.three.setCameraMode(this.theaterPrevCam);
      this.left.setViewUI(this.viewMode, this.theaterPrevCam);
    }
    this.theaterPrevCam = null;
    if (this.theaterDebug) {
      this.theaterDebug = false;
      return;
    }
    if (this.fixture && this.match) {
      this.league.applyResult(this.fixture, this.match.getResult());
      this.afterFixtureApplied();
      if (!this.autoContinue) {
        this.paused = true;
        this.left.setSpeedUI(true, this.speed);
      }
    }
  }

  /** Discard a pending theater without applying anything (league swaps). */
  private dropTheater(): void {
    if (!this.theater) return;
    this.theater = null;
    this.theaterDebug = false;
    if (this.three && this.theaterPrevCam) {
      this.three.setCameraMode(this.theaterPrevCam);
      this.left.setViewUI(this.viewMode, this.theaterPrevCam);
    }
    this.theaterPrevCam = null;
  }

  /** Dev hook: stage a synthetic shootout over the current match (3D only). */
  private debugShootout(): boolean {
    if (this.viewMode !== '3d' || !this.three || !this.match || this.theater) return false;
    const m = this.match;
    const kicks: ShootoutKick[] = [];
    const res = resolveShootout(
      shootoutLineup(m.teams[0].info.squad),
      shootoutLineup(m.teams[1].info.squad),
      new Rng(7),
      kicks,
    );
    if (!res) return false;
    this.theaterDebug = true;
    this.startTheater(kicks);
    return true;
  }

  /** Keep the finished match's recording around for 3D replay. */
  private archiveReplay(): void {
    if (this.match && this.buffer.hasContent) {
      this.archive = {
        buffer: this.buffer,
        theme: buildRenderTheme(this.match),
        events: this.match.events.filter((e) => e.type === 'goal' || e.type === 'shot' || e.type === 'save'),
        label: `${this.match.teams[0].info.short} ${this.match.score[0]}–${this.match.score[1]} ${this.match.teams[1].info.short}`,
      };
      this.buffer = new ReplayBuffer();
    }
  }

  private afterFixtureApplied(): void {
    this.archiveReplay();
    // Cup storylines must be read before finishSeason resets the bracket.
    if (this.fixture?.cup) this.announceCupResult(this.fixture);
    let seasonEnded = false;
    if (this.league.seasonDone) {
      const prevChampion = this.league.history[this.league.history.length - 1]?.championName;
      const rec = this.league.finishSeason();
      // Cup lines were already announced live, fixture by fixture.
      this.announceSeasonRecord(rec, prevChampion, false);
      saveLeague(this.league);
      this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      seasonEnded = true;
    }
    this.loadNextFixture();
    this.announceCupDraw();
    // The moment of evolution becomes an EVENT (32.5). During bulk sims the
    // loop stays headless — the ceremony shows once, at the end.
    if (seasonEnded && !this.busy) this.showCeremony();
  }

  /**
   * Season-end feed lines from a SeasonRecord. `includeCup` adds the cup
   * summary for worker-simmed seasons, where the live per-tie announcements
   * never ran (the record carries the whole story).
   */
  private announceSeasonRecord(rec: SeasonRecord, prevChampion: string | undefined, includeCup: boolean): void {
    for (const line of seasonRecordLines(rec, prevChampion, includeCup)) this.feed.pushSystem(line);
  }

  /** Feed lines for a just-applied cup tie: giant killings and the final. */
  private announceCupResult(f: Fixture): void {
    if (!this.league.cup) return;
    for (const line of cupResultLines(this.league.cup, f)) this.feed.pushSystem(line);
  }

  /** Announce a cup round the moment its first tie comes up. */
  private announceCupDraw(): void {
    const f = this.fixture;
    if (!f || !this.league.cup) return;
    for (const line of cupDrawLines(this.league.cup, f)) this.feed.pushSystem(line);
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
    const historyBefore = this.league.history.length;
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
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      if (this.league.history.length > historyBefore) this.showCeremony();
    }
  }

  /* ---------------- GameActions ---------------- */

  setPaused(p: boolean): void {
    this.paused = p;
    this.left.setSpeedUI(this.paused, this.speed);
  }

  setSpeed(s: number): void {
    this.sound.simSpeed = s;
    this.speed = s;
    this.paused = false;
    this.left.setSpeedUI(this.paused, this.speed);
  }

  skipMatch(): void {
    if (this.busy) return;
    if (this.reel) {
      this.endReel(); // ⏭ during highlights: back to live
      return;
    }
    if (this.theater) {
      this.finishTheater(); // ⏭ during a shootout: jump to the result
      return;
    }
    if (this.exhibition && this.match) {
      this.match.runToCompletion();
      this.onWatchedMatchFinished();
      return;
    }
    this.finishCurrentMatchHeadless();
  }

  simRound(): void {
    const gen = this.league.generation;
    const round = this.league.currentRound();
    const cup = this.league.nextFixture()?.cup ?? false;
    this.runSim(
      { kind: 'round' },
      () =>
        this.league.generation === gen &&
        this.league.currentRound() === round &&
        (this.league.nextFixture()?.cup ?? false) === cup,
      this.league.roundLabel(),
    );
  }

  simSeason(): void {
    const gen = this.league.generation;
    this.runSim({ kind: 'toGeneration', target: gen + 1 }, () => this.league.generation === gen, `Season ${gen}`);
  }

  simSeasons(n: number): void {
    const target = this.league.generation + n;
    this.runSim({ kind: 'toGeneration', target }, () => this.league.generation < target, `${n} seasons`);
  }

  /* ---------------- sim worker plumbing ---------------- */

  private ensureSimWorker(): Worker | null {
    if (this.simWorkerBroken) return null;
    if (this.simWorker) return this.simWorker;
    try {
      this.simWorker = new Worker(new URL('./simWorker.ts', import.meta.url), { type: 'module' });
    } catch (err) {
      console.error('Sim worker unavailable — using main-thread sim:', err);
      this.simWorkerBroken = true;
      return null;
    }
    return this.simWorker;
  }

  /**
   * Fast-sim dispatch: run `req` on the sim worker (main thread stays at
   * 60fps), falling back to the chunked main-thread loop (`cont`) when
   * workers are unavailable or fail. Both paths produce identical league
   * state — regression-tested in tests/simRunner.test.ts.
   */
  private runSim(req: SimRequest, cont: () => boolean, label: string): void {
    if (this.busy) return;
    this.finishTheater(); // apply a pending shootout before fast-simming on
    const w = this.ensureSimWorker();
    if (!w) {
      this.lastSimMode = 'main';
      void this.simFixtures(cont, label);
      return;
    }
    this.lastSimMode = 'worker';
    this.busy = true;
    this.left.setBusy(true);
    this.setStatus(`${label}: starting…`);
    const t0 = performance.now();

    // Finish a half-watched match on the main thread first: its replay
    // archive, live feed events and possible season rollover behave exactly
    // as before, and the worker starts from a clean next-fixture state.
    if (this.match && this.fixture && !this.match.finished) this.finishCurrentMatchHeadless();
    if (!cont()) {
      // That match already completed the request (it was the round/season end).
      this.busy = false;
      this.left.setBusy(false);
      this.setStatus(`${label}: 1 match in ${((performance.now() - t0) / 1000).toFixed(1)}s`);
      this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      return;
    }

    const historyBefore = this.league.history.length;
    let prevChampion = this.league.history[historyBefore - 1]?.championName;
    const fallback = () => {
      this.simWorkerBroken = true;
      this.busy = false;
      this.left.setBusy(false);
      this.lastSimMode = 'main';
      void this.simFixtures(cont, label);
    };

    w.onerror = (ev) => {
      console.error('Sim worker crashed:', ev.message);
      fallback();
    };
    w.onmessage = (ev: MessageEvent<SimWorkerMessage>) => {
      const msg = ev.data;
      if (msg.type === 'progress') {
        this.setStatus(`${label}: ${msg.matches} matches…`);
        return;
      }
      w.onmessage = null;
      if (msg.type === 'error') {
        console.error('Sim worker failed:', msg.message);
        fallback();
        return;
      }
      try {
        this.league = League.fromJSON(msg.league);
      } catch (err) {
        console.error('Sim worker result rejected:', err);
        fallback();
        return;
      }
      for (const rec of this.league.history.slice(historyBefore)) {
        this.announceSeasonRecord(rec, prevChampion, true);
        prevChampion = rec.championName;
      }
      if (this.league.history.length > historyBefore) saveLeague(this.league);
      this.busy = false;
      this.left.setBusy(false);
      this.setStatus(`${label}: ${msg.matches} matches in ${((performance.now() - t0) / 1000).toFixed(1)}s (worker)`);
      this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      this.loadNextFixture();
      if (this.league.history.length > historyBefore) this.showCeremony();
    };
    w.postMessage({ league: this.league.toJSON(), req });
  }

  setAutoContinue(v: boolean): void {
    this.autoContinue = v;
  }

  setFlag(key: keyof UiFlags, v: boolean): void {
    this.flags[key] = v;
  }

  toggleLeagueScreen(): void {
    this.evolutionScreen.hide();
    this.playerScreen.hide();
    this.leagueScreen.toggle(this.league);
    this.updateMusic();
  }

  /** The evolution CENTER (Phase 51) — evolution's own stage, not a league tab. */
  toggleEvolutionScreen(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.playerScreen.hide();
    this.evolutionScreen.toggle(this.league);
    this.updateMusic();
  }

  /** The PLAYER center (Phase 56) — the people's own stage. */
  togglePlayerScreen(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.evolutionScreen.hide();
    this.playerScreen.toggle(this.league);
    this.updateMusic();
  }

  /* ---------------- rebirth ceremony (Phase 32.5) ---------------- */

  /**
   * Show the latest generation's rebirth ceremony. Auto-shown at season end
   * (game pauses; the pre-ceremony pause state is restored on close) and
   * reopenable from the league screen's Evolution tab.
   */
  private showCeremony(): void {
    if (this.league.history.length === 0) return;
    if (!this.ceremony.isVisible) this.ceremonyPrevPaused = this.paused;
    this.paused = true;
    this.left.setSpeedUI(true, this.speed);
    this.ceremony.show(this.league);
    this.updateMusic();
  }

  private onCeremonyClosed(): void {
    this.paused = this.ceremonyPrevPaused;
    this.left.setSpeedUI(this.paused, this.speed);
    this.updateMusic();
  }

  setSound(volume: number): void {
    this.sound.volume = volume;
  }

  setMusic(volume: number): void {
    this.music.volume = volume;
    this.updateMusic();
  }

  /** Context-driven BGM (Phase 89): ceremony = the victory track (enters
   * at its 20s drop), management screens = the league track, the pre-match
   * clash = the title anthem, live play = crowd only. */
  private updateMusic(): void {
    const slot = this.ceremony.isVisible
      ? 'victory'
      : this.leagueScreen.isVisible || this.evolutionScreen.isVisible || this.playerScreen.isVisible
        ? 'league'
        : this.clash.isVisible
          ? 'title'
          : null;
    this.music.play(slot);
    // The stadium falls silent when a screen covers the stage (Phase 90);
    // the pre-match clash is a broadcast graphic — the crowd stays.
    this.sound.stadiumVisible = slot === null || slot === 'title';
  }

  /* ---------------- presentation (Phase 15) ---------------- */

  setCinematic(v: boolean): void {
    this.cinematic = v;
    document.body.classList.toggle('cinematic', v);
    this.updateCineBug();
    if (v) this.feed.pushSystem('🎥 Cinematic mode — press Esc or ✕ to exit.');
  }

  setFxQuality(q: FxQuality): void {
    this.fxQuality = q;
    this.three?.setFxQuality(q);
    this.left.setFxQualityUI(q);
  }

  takeScreenshot(): void {
    try {
      let dataUrl: string;
      if (this.viewMode === '3d' && this.three) {
        dataUrl = this.three.captureScreenshot();
      } else {
        // Pixi: extract renders synchronously into a fresh canvas — safe to read.
        const canvas = this.app.renderer.extract.canvas(this.app.stage) as HTMLCanvasElement;
        dataUrl = canvas.toDataURL('image/png');
      }
      const m = this.match;
      const name = m
        ? `evofootball-${m.teams[0].info.short}-${m.score[0]}-${m.score[1]}-${m.teams[1].info.short}-${m.minute()}min.png`
        : 'evofootball.png';
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = name;
      a.click();
      this.feed.pushSystem(`📸 Screenshot saved: ${name}`);
    } catch (err) {
      console.error('Screenshot failed:', err);
      this.feed.pushSystem('⚠️ Screenshot not supported in this browser — try the OS screenshot tool.');
    }
  }

  saveNow(): void {
    if (this.busy) {
      this.feed.pushSystem('⏳ Simulation running — save again in a moment.');
      return;
    }
    if (saveLeague(this.league)) this.feed.pushSystem('💾 League saved.');
  }

  loadNow(): void {
    if (this.busy) {
      this.feed.pushSystem('⏳ Simulation running — load again in a moment.');
      return;
    }
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

  /** Download the current league as a .json save file (Phase 21). */
  private exportSave(): void {
    if (this.busy) {
      this.feed.pushSystem('⏳ Simulation running — export again in a moment.');
      return;
    }
    const blob = new Blob([exportLeagueJSON(this.league)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evofootball-save-gen${this.league.generation}-seed${this.league.seed}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.feed.pushSystem('📤 Save exported as a .json file.');
  }

  /**
   * Load a league from a .json save file. Like Load, this only swaps the
   * running league — the localStorage slot is untouched until the next
   * Save/auto-save, so a bad import can't destroy the existing league.
   */
  private importSave(): void {
    if (this.busy) {
      this.feed.pushSystem('⏳ Simulation running — import again in a moment.');
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      void file.text().then((text) => {
        const league = importLeagueJSON(text);
        if (!league) {
          this.feed.pushSystem('⚠️ Not a valid EvoFootball save file.');
          return;
        }
        this.league = league;
        this.loadNextFixture();
        this.feed.pushSystem(
          `📥 League imported — Gen ${league.generation}, seed ${league.seed}. Press Save to keep it.`,
        );
        this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      });
    });
    input.click();
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
    if (!window.confirm(t('Delete the save and start over?'))) return;
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
          this.three.onArousal = (a) => this.sound.setArousal(a);
          this.three.onCarry = (on) => this.sound.setCarry(on);
          this.three.onScoreBugTap = () => this.toggleClash();
          this.three.setFxQuality(this.fxQuality);
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
      this.finishTheater(); // switching away = skipping the shootout
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
    if (this.theater) {
      this.feed.pushSystem('🎬 After the shootout — ⏭ skips it.');
      return;
    }
    this.clash.hide(); // the replay owns the stage
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
    this.replayBar.setContext(ev); // broadcast-style "what am I rewatching" label
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
    if (this.reel) {
      // A reel is a replay too — anything that tears replay down ends it.
      this.endReel();
      return;
    }
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
