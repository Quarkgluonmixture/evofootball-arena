import { Application, type Ticker } from 'pixi.js';
import {
  clearSave, exportLeagueJSON, hasSave, importLeagueJSON, loadLeague, saveLeague,
} from '../data/save';
import { setEmergentPos } from '../ai/formations';
import { DebugOverlay } from '../render/DebugOverlay';
import { MatchRenderer } from '../render/MatchRenderer';
import { PitchRenderer } from '../render/PitchRenderer';
import { CANVAS_H, CANVAS_W, toPx } from '../render/transform';
import { cameraForEvent, type CameraMode } from '../render3d/CameraController';
import {
  buildOverlays, buildRenderState, buildRenderTheme, type RenderState,
} from '../render3d/RenderStateAdapter';
import { ShootoutTheater } from '../render3d/ShootoutTheater';
import {
  DEFAULT_LIGHTING, DEFAULT_STYLE, isLighting, isStyleId, stylePreset,
  type Lighting, type StyleId,
} from '../render3d/stylePresets';

/** Persisted time-of-day choice (Track F). */
const LIGHTING_KEY = 'evo:lighting';
function loadLighting(): Lighting {
  try {
    const v = localStorage.getItem(LIGHTING_KEY);
    return isLighting(v) ? v : DEFAULT_LIGHTING;
  } catch {
    return DEFAULT_LIGHTING;
  }
}
import {
  edsPreviewFlags, readEdsPreviewMode, writeEdsPreviewMode, type EdsPreviewMode,
} from './edsPreview';
import {
  a4MatchFlags, armA4World, isBkWorld, isCbWorld, isCorridorWorld, isDfWorld, isL3World, isRaWorld,
  isMtWorld, isPcWorld, l3DoseWanted,
  loadA4Tables, loadL3Dose, loadPcDose, pcDoseWanted, readA4World, writeA4World,
  type A4Tables, type A4WorldVersion, type L3DoseCell, type PcDoseTable,
} from './a4World';
import {
  A4_BADGE_TEXT_L3_EMPTY, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../ui/A4WorldBadge';
import { ThreeMatchRenderer } from '../render3d/ThreeMatchRenderer';
import type { PerceptionView } from '../render3d/PerceptionSandbox3D';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type ObserverGaze, type PerceptionMemory,
} from '../ai/perceptionSnapshot';
import { chooseAttentionGaze } from '../ai/attentionPolicy';
import { playerDimStats, playerNameplate, playerVector } from '../evolution/playerStyle';
import { ROSTER_ROLES } from '../evolution/playerGenome';
import { TRAIT_EMOJI, traitsOf } from '../evolution/traits';
import { momentWindow, pickHighlights } from '../replay/highlights';
import { ReplayBuffer, type ReplayArchive } from '../replay/ReplayBuffer';
import { DT } from '../sim/constants';
import { CUP_ROUND_NAMES, resolveShootout, shootoutLineup, type ShootoutKick } from '../sim/cup';
import { t } from '../ui/i18n';
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
import { ClubsScreen } from '../ui/ClubsScreen';
import { RebirthCeremony } from '../ui/RebirthCeremony';
import { SettingsScreen } from '../ui/SettingsScreen';
import { LeftPanel } from '../ui/LeftPanel';
import { ReplayBar } from '../ui/ReplayBar';
import { RightPanel } from '../ui/RightPanel';
import { MusicSystem } from '../ui/MusicSystem';
import { TitleScreen } from '../ui/TitleScreen';
import { SoundFx } from '../ui/SoundFx';
import { browserWakeLockEnv, screenShouldStayAwake, WakeLockManager } from '../ui/wakeLock';

// Chosen so a fresh league OPENS with a banger (Phase 28.2): seed 1168's
// first fixture is a 3–3 with 19 shots, 4 corners and a late goal — the
// first thing a new player watches should sell the game.
const DEFAULT_SEED = 1168;

/** Emergent positioning is the DEFAULT now (2026-07-20 density相变); this
 * persists the user's A/B toggle across reloads. Default ON — only an explicit
 * '0' (they turned it off) opts out. */
function readEmergentPos(): boolean {
  try {
    return localStorage.getItem('evo:emergentPos') !== '0';
  } catch {
    return true;
  }
}

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
  private clubsScreen!: ClubsScreen;
  private evolutionScreen!: EvolutionScreen;
  private playerScreen!: PlayerScreen;
  private settingsScreen!: SettingsScreen;
  private ceremony!: RebirthCeremony;
  private clash!: ClashBanner;
  /** Pre-match clash auto-hides at kickoff; scoreboard-opened ones are pinned. */
  private clashAutoHide = true;
  /** Pause state to restore when the auto-shown rebirth ceremony closes. */
  private ceremonyPrevPaused = false;
  /** Keeps the phone from dimming mid-match; inert where unsupported. */
  private wakeLock = new WakeLockManager(browserWakeLockEnv());
  private statusEl!: HTMLElement;
  /** Topbar nav buttons + their "is my screen open" probes (119a.5). */
  private navEntries: Array<[HTMLButtonElement, () => boolean]> = [];

  private paused = true;
  private speed = 1;
  private autoContinue = true;
  /** A standalone Wildcard-vs-leader match is on screen (no league bookkeeping). */
  private exhibition = false;
  private cinematic = false;
  private fxQuality: FxQuality = 'medium';
  private cineBug!: HTMLDivElement;
  /** D1: the floating mini-player's "back to the match" control. */
  private miniRestore!: HTMLButtonElement;
  private flags: UiFlags = defaultFlags();
  private selectedGid: number | null = null;

  /** B1 perception sandbox (read-only). Memory is owned here, one per selected
   * observer, recreated on selection change / disable; fed once per new tick. */
  private perceptionMemory: PerceptionMemory | null = null;
  private perceptionMemoryGid: number | null = null;
  /** The synthetic awareness the current memory was built at (B2 toggle). */
  private perceptionAwareness: number | null = null;
  private perceptionView: PerceptionView | null = null;
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
  private titleScreen: TitleScreen | null = null;
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
    // The topbar carries DESTINATIONS only (119a.5): the four screens in the
    // user's reading order (118.5) + ⚙. Saves, seed, language and the debug
    // overlays all moved to the settings screen. Each button lights up while
    // its screen is open (nav state was invisible before).
    const navTab = (label: string, on: () => void, active: () => boolean) => {
      const b = button(label, on, 'nav-btn');
      this.navEntries.push([b, active]);
      topbar.appendChild(b);
    };
    navTab(`🏆 ${t('League table')}`, () => this.toggleLeagueScreen(), () => this.leagueScreen?.isVisible ?? false);
    navTab(`🧬 ${t('Evolution')}`, () => this.toggleEvolutionScreen(), () => this.evolutionScreen?.isVisible ?? false);
    navTab(`🏟 ${t('Clubs')}`, () => this.toggleClubsScreen(), () => this.clubsScreen?.isVisible ?? false);
    navTab(`👥 ${t('Players')}`, () => this.togglePlayerScreen(), () => this.playerScreen?.isVisible ?? false);
    topbar.appendChild(el('div', 'spacer'));
    navTab(`⚙ ${t('Settings')}`, () => this.toggleSettingsScreen(), () => this.settingsScreen?.isVisible ?? false);
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
    // D1 dual shell: the mini-player's own control, shown only in world mode.
    this.miniRestore = button('⤢', () => this.closeWorldScreens()) as HTMLButtonElement;
    this.miniRestore.className = 'mini-restore hidden';
    this.miniRestore.title = t('Back to the match');
    stage.appendChild(this.miniRestore);
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape' && this.cinematic) this.setCinematic(false);
      // SPACE = pause/play (user ask, 118.5). Not while typing in the seed
      // box, and not when a button/checkbox has focus (space already
      // activates those — a double toggle reads as a no-op).
      if (ev.key === ' ' || ev.code === 'Space') {
        const t = ev.target as HTMLElement | null;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'BUTTON' || t.tagName === 'SELECT')) return;
        ev.preventDefault(); // the page must not scroll
        this.setPaused(!this.paused);
      }
    });

    const pitch = new PitchRenderer();
    this.app.stage.addChild(pitch.container, this.matchRenderer.container, this.debugOverlay.container);
    this.matchRenderer.onSelectPlayer = (gid) => {
      this.selectedGid = this.selectedGid === gid ? null : gid;
    };

    // ---- Panels ----
    this.left = new LeftPanel(leftEl, this);
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
      this.clubsScreen.refreshIfVisible(this.league);
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
      this.clubsScreen.refreshIfVisible(this.league);
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
    // Emergent positioning field (Phase B): restore the sticky toggle so it
    // survives reloads (the user examines it across sessions) without being a
    // hard-coded global default — the field is still WIP and evolved play
    // leans MORE on carry, so it must be an OPT-IN the user turns on, not the
    // shipped default.
    const emergentSticky = readEmergentPos();
    setEmergentPos(emergentSticky);
    // A4 (#155): the checkbox shows the user's stored/URL intent even though the
    // world itself only arms once the census tables land (see the boot arm below).
    const a4Sticky = readA4World();
    this.settingsScreen = new SettingsScreen(
      stage, this, this.flags, emergentSticky, this.edsPreview, a4Sticky,
    );
    this.evolutionScreen = new EvolutionScreen(stage);
    this.evolutionScreen.onShowCeremony = () => this.showCeremony();
    this.playerScreen = new PlayerScreen(stage);
    this.clubsScreen = new ClubsScreen(stage);
    // Entity links (Phase 108): any club/player NAME in chronicle, market
    // or census prose jumps to its deep dive across screens.
    const nav = {
      openClub: (slot: number) => this.openClubDive(slot),
      openPlayer: (slot: number, index: number) => this.openPlayerDive(slot, index),
    };
    this.leagueScreen.nav = nav;
    this.playerScreen.nav = nav;
    this.clubsScreen.nav = nav;
    this.evolutionScreen.nav = nav;
    this.clash = new ClashBanner(stage);
    // The launch overlay (Phase 96): the match boots and runs beneath it as
    // attract mode; the first click is the WebAudio gesture that starts the
    // Title BGM, START reveals the game.
    this.titleScreen = new TitleScreen({
      onEnter: () => {
        // The gesture unlocks BOTH audio contexts (Phase 105: SoundFx has
        // its own — on iOS it was never resumed inside a gesture, which was
        // the whole "手机端没有声音" report) + the ringer-switch session.
        this.music.unlock();
        this.sound.unlock();
        this.updateMusic();
      },
      onStart: () => this.updateMusic(),
    });
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
    this.applyEdsPreview(); // E4-PREP: every League swap re-arms the user's choice
    this.loadNextFixture();
    this.feed.pushSystem(loaded ? '💾 Loaded saved league.' : `🌱 New league (seed ${this.league.seed}). Watch the match, or simulate a season.`);
    // A4 (#155): re-arm the user's sticky / URL opt-in. Deliberately AFTER the
    // first fixture is on screen — the tables are a network fetch, and a player
    // who has not opted in must never wait on (or download) them.
    if (a4Sticky !== 0) void this.armA4(a4Sticky);
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
      audioState: () => ({ ...this.music.state, paused: this.paused }),
      // Track F / F0: the screenshot harness shoots every style arm.
      style: () => ({ id: this.styleId, lighting: this.lighting }),
      setStyle: (id: unknown, lighting: unknown) => {
        if (!isStyleId(id) || !isLighting(lighting)) return false;
        this.setStyle(id, lighting);
        return true;
      },
      titleVisible: () => this.titleScreen?.isVisible ?? false,
      skipTitle: () => this.titleScreen?.skip(),
      reelActive: () => this.reel !== null,
      liveMoments: () =>
        this.match
          ? this.match.events.filter((e) => e.type === 'goal' || e.type === 'shot' || e.type === 'save').length
          : 0,
    };

    // Default view is 3D (Phase 27.5, user request) — setViewMode falls back
    // to 2D with a feed notice where WebGL is unavailable.
    this.setViewMode('3d');
    // Reflect the persisted time-of-day choice in the panel (Track F).
    this.left.setLightingUI(this.lighting);
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
      this.three.update(
        this.currentRenderState(dtReal), dtReal, this.flags, this.selectedGid,
        this.buildPerceptionView(steps),
      );
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
      // The pre-match clash is now a FULL-SCREEN matchup card (2026-07-20): it
      // holds while the game is paused (between fixtures — study the evolved
      // shapes) and clears the instant ▶ is pressed, so it never covers the
      // opening play. Manual mid-match opens are pinned (clashAutoHide=false).
      if (this.clash.isVisible && this.clashAutoHide && this.match && !this.paused) {
        this.clash.hide();
        this.updateMusic();
      }
      this.updateCineBug();
    }

    // Keep the phone awake only while the game is genuinely running itself.
    this.wakeLock.setWanted(this.wantsScreenAwake());
  }

  /** Snapshot for the pure `screenShouldStayAwake` rule (tested there). */
  private wantsScreenAwake(): boolean {
    return screenShouldStayAwake({
      paused: this.paused,
      titleVisible: this.titleScreen?.isVisible ?? false,
      theaterActive: this.theater !== null,
      replayActive: this.replay.active,
      replayPlaying: this.replay.playing,
      hasLiveMatch: this.match !== null && !this.match.finished,
    });
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

  /**
   * B1: build the read-only perception payload for the selected observer, or
   * null when the sandbox is off / no live selection. Reads Match only, never
   * writes it; the memory advances once per new sim tick (steps > 0), so the
   * belief ages honestly and a paused frame re-renders the last snapshot.
   */
  private buildPerceptionView(steps: number): PerceptionView | null {
    // Synthetic — no live awareness attribute exists. B2 exposes the 0.2↔0.8
    // contrast, because that is where the world model becomes legible.
    const AWARENESS = this.flags.perceptionLowAwareness ? 0.2 : 0.8;
    const SEED = 0x5eed; // fixed: read-only path, never touches sim RNG
    const m = this.match;
    const live = m !== null && !this.theater && !this.replay.active && !m.finished;
    if (!this.flags.perception || !live || this.selectedGid === null) {
      this.perceptionMemory = null;
      this.perceptionMemoryGid = null;
      this.perceptionAwareness = null;
      this.perceptionView = null;
      return null;
    }
    const observer = m.allPlayers.find((p) => p.gid === this.selectedGid);
    if (!observer || observer.sentOff) {
      this.perceptionView = null;
      return null;
    }
    // Awareness changes scan cadence and retention, so a switched value gets a
    // fresh memory rather than a half-and-half belief.
    if (this.perceptionMemory === null || this.perceptionMemoryGid !== this.selectedGid
      || this.perceptionAwareness !== AWARENESS) {
      this.perceptionMemory = createPerceptionMemory();
      this.perceptionMemoryGid = this.selectedGid;
      this.perceptionAwareness = AWARENESS;
      this.perceptionView = null;
    }
    const mem = this.perceptionMemory;
    if (steps > 0 || this.perceptionView === null) {
      const truth = capturePerceptionTruth(m);
      const willScan = mem.nextScanTick < 0 || truth.tick >= mem.nextScanTick;
      const snapshot = perceiveSnapshot(truth, this.selectedGid, AWARENESS, SEED, mem);
      let whatIfGaze: ObserverGaze | null = null;
      const carrier = truth.ball.ownerGid;
      if (this.flags.perceptionGaze && carrier !== null && carrier !== this.selectedGid) {
        whatIfGaze = chooseAttentionGaze(snapshot, carrier, null);
      }
      this.perceptionView = { truth, snapshot, awareness: AWARENESS, scanPulse: willScan, whatIfGaze };
    }
    return this.perceptionView;
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
    // A4 PLAY-TEST ENTRY (#155): the certified PRIOR arm is not expressible as
    // construction flags — the eye config and the obedience gene are applied
    // to the freshly built match. Unarmed (the default) this is a no-op and
    // `stationEye` stays null, exactly as in production.
    // MT play-test worlds (#211.3) need no census tables at all — they are the
    // ladder's own arms (genes only), so they arm the moment they are chosen.
    // #282.4 widened it once more for the defence-book world, whose only payload is the
    // matured dose — and the dose is OPTIONAL (`?l3dose=0` plays the same world with the book
    // as the season left it), so world 7 arms as soon as it is chosen too.
    if (this.a4World !== 0 && (this.a4Tables !== null || isMtWorld(this.a4World)
      || isCbWorld(this.a4World) || isL3World(this.a4World) || isPcWorld(this.a4World)
      || isBkWorld(this.a4World) || isDfWorld(this.a4World)
      || isCorridorWorld(this.a4World) || isRaWorld(this.a4World))) {
      armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose, this.pcDose);
    }
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
      {
        population: this.league.franchises.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })),
        league: this.league,
        fixture: this.fixture,
      },
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
      {
        population: this.league.franchises.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })),
        league: this.league,
        fixture: this.exhibition ? null : this.fixture,
      },
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
      this.updateMusic(); // between fixtures = paused: the ducked anthem (105)
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
      this.updateMusic();
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
    this.updateMusic(); // reel owns the stage: crowd, not anthem (105)
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
    this.updateMusic();
    // An FT reel covered the next fixture's pre-match clash — bring it back.
    if (this.match && this.match.simTime < 10 && this.fixture) {
      this.clashAutoHide = true;
      this.clash.show(
        this.match,
        this.fixture.cup ? `${CUP_ROUND_NAMES[this.fixture.round]}` : this.league.roundLabel(),
        {
          population: this.league.franchises.map((f) => ({ genome: f.coach.genome, policy: f.coach.policy })),
          league: this.league,
          fixture: this.fixture,
        },
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
    this.updateMusic();
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
      this.clubsScreen.refreshIfVisible(this.league);
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
      this.clubsScreen.refreshIfVisible(this.league);
      if (this.league.history.length > historyBefore) this.showCeremony();
    }
  }

  /* ---------------- GameActions ---------------- */

  setPaused(p: boolean): void {
    this.paused = p;
    this.left.setSpeedUI(this.paused, this.speed);
    this.updateMusic(); // pause = the ducked anthem returns (Phase 105)
  }

  setSpeed(s: number): void {
    this.sound.simSpeed = s;
    this.speed = s;
    this.paused = false;
    this.left.setSpeedUI(this.paused, this.speed);
    this.updateMusic(); // play resumes = the anthem fades out (Phase 105)
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
      this.clubsScreen.refreshIfVisible(this.league);
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
        this.applyEdsPreview(); // E4-PREP: every League swap re-arms the user's choice
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
      this.clubsScreen.refreshIfVisible(this.league);
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

  /**
   * E4-PREP: arm or disarm the EDS bundle for matches STARTED from now on. The
   * flags are Match construction config — a match already in flight keeps the
   * brain it kicked off with, which is also what makes the A/B clean.
   */
  setEdsPreview(mode: EdsPreviewMode): void {
    this.edsPreview = mode;
    this.applyEdsPreview();
    writeEdsPreviewMode(mode);
    this.feed.pushSystem(
      mode === 'triple'
        ? '👁 EDS preview ON + VALUE — from the next kickoff, players choose passes from what they SEE and price them by measured shot value.'
        : mode === 'v1'
          ? '👁 EDS preview ON — from the next kickoff, players choose passes from what they SEE.'
          : '👁 EDS preview OFF — the legacy lane-score brain returns at the next kickoff.',
    );
  }

  /**
   * Push the current choice onto whichever League object is live right now.
   *
   * A4 (#155): while the play-test entry is armed the census substrate
   * (`A4_WORLD_FLAGS`) replaces the EDS preview's set — it CONTAINS the triple
   * bundle and adds the C-family seams the eye's table was censused on, so the
   * two cannot be mixed. Disarming restores the user's own EDS choice exactly.
   *
   * The armed world's flags come from `a4MatchFlags(version)` (#184.2): v1/v2 are
   * the census set unchanged, v3 is that set plus the wind-up seam.
   */
  private applyEdsPreview(): void {
    this.league.matchFlags = this.a4World !== 0
      ? a4MatchFlags(this.a4World)
      : edsPreviewFlags(this.edsPreview);
  }

  /**
   * A4 PLAY-TEST ENTRY (ruling #155, #167.5, #184.2): arm / disarm a certified
   * world (1 = the uniform whisper, 2 = the discipline family, 3 = the discipline
   * family plus the short-pass wind-up, 0 = the shipped game).
   *
   * Unlike the EDS preview this RELOADS the current fixture: the eye and the
   * obedience gene are applied at match construction, and a play-test whose
   * verdict is the user's eyes should not make them wait a fixture to see the
   * world the badge names. The reload is deterministic — the same fixture,
   * same seed, rebuilt in the armed world.
   */
  setA4World(version: A4WorldVersion): void {
    void this.armA4(version);
  }

  private async armA4(version: A4WorldVersion): Promise<void> {
    // ⭐ L3 (#282.4): the matured dose is an OPT-IN ASYNC CHUNK (L3-T1's committed exam), so it
    // is fetched here, before the world is named — never in the main bundle path. `?l3dose=0`
    // skips the fetch entirely and plays the shipped law's own empty-book state.
    let l3Empty = false;
    let pcEmpty = false;
    // ⭐ #309 item 5: world 9 CONTAINS world 8 WHOLE — the same two doses, the same single named
    // contrast, the same fetches, the same failure path. It is expressed as ONE predicate so the
    // world-8 semantics of `?pcdose=0` cannot drift inside world 9: there is only one branch.
    // ⭐ #337 item 5 extends the SAME single predicate by two: worlds 10 and 11 CONTAIN world 8
    // whole, so they take the same two doses, the same named contrast and the same failure path.
    // ⭐ #365 extends the SAME single predicate by one more: world 12 CONTAINS world 8 whole.
    const pcStack = isPcWorld(version) || isBkWorld(version)
      || isDfWorld(version) || isCorridorWorld(version) || isRaWorld(version);
    // ⭐ #300.6: world 8 CONTAINS world 7, so it needs the matured defence cells too — and it
    // takes them ALWAYS, because "the v7 stack" is what PC-T2 measured the latency on. `?l3dose=0`
    // is therefore not read in world 8; the only contrast that world offers is `?pcdose=0`.
    if (isL3World(version) || pcStack) {
      l3Empty = isL3World(version)
        && !l3DoseWanted(typeof location === 'undefined' ? '' : location.search);
      if (l3Empty) this.l3Dose = null; // the named contrast: the book as the season left it
      if (!l3Empty && this.l3Dose === null) {
        this.setStatus('防守账本世界:正在读取成熟账本…');
        try {
          this.l3Dose = await loadL3Dose();
        } catch (err) {
          console.error('L3 world dose failed to load:', err);
          this.feed.pushSystem('⚠️ 防守账本世界读不到成熟账本 —— 留在原版世界。');
          this.a4World = 0;
          writeA4World(0);
          this.a4Badge.setWorld(0);
          this.applyEdsPreview();
          return;
        }
      }
    } else {
      // Leaving worlds 7/8: the next armed match must not silently inherit a dose.
      this.l3Dose = null;
    }
    // ⭐ PC (#300.6): the matured recognition dose is its own OPT-IN ASYNC CHUNK (PC-T1's
    // committed exam, imported as raw text so its FILE BYTES can be hashed), fetched here before
    // the world is named — never in the main bundle path. `?pcdose=0` skips the fetch entirely
    // and plays the born-absent world: everyone a novice.
    if (pcStack) {
      pcEmpty = !pcDoseWanted(typeof location === 'undefined' ? '' : location.search);
      if (pcEmpty) this.pcDose = null; // the named contrast: books as a new season finds them
      if (!pcEmpty && this.pcDose === null) {
        this.setStatus('处理时间世界:正在读取成熟的识别账本…');
        try {
          this.pcDose = await loadPcDose();
        } catch (err) {
          console.error('PC world dose failed to load:', err);
          this.feed.pushSystem('⚠️ 处理时间世界读不到成熟账本 —— 留在原版世界。');
          this.a4World = 0;
          writeA4World(0);
          this.a4Badge.setWorld(0);
          this.applyEdsPreview();
          return;
        }
      }
    } else {
      this.pcDose = null;
    }
    if (version !== 0 && !isMtWorld(version) && !isCbWorld(version) && !isL3World(version)
      && !pcStack
      && this.a4Tables === null) {
      this.setStatus('A4 world: loading the census tables…');
      try {
        this.a4Tables = await loadA4Tables();
      } catch (err) {
        console.error('A4 world tables failed to load:', err);
        this.feed.pushSystem('⚠️ A4 world unavailable — the census tables failed to load. Staying in the shipped world.');
        this.a4World = 0;
        writeA4World(0);
        this.a4Badge.setWorld(0);
        this.applyEdsPreview();
        return;
      }
    }
    this.a4World = version;
    writeA4World(version);
    // ⭐ #282.4: the chip names the FORM as well as the world — the two dose forms are the two
    // arms L3-T2 measured, and the gate must not be answered about the wrong one. (The #270.2
    // honesty note still holds: this is the REQUESTED world; a failed dose load disarms above,
    // so a chip that is present is a world that is armed.)
    // ⭐ #337 item 5: the EMPTY-form chip comes from ONE table keyed by the version (worlds
    // 8/9/10/11), so a new world of this family can never inherit a LOWER world's chip.
    this.a4Badge.setWorld(version, l3Empty ? A4_BADGE_TEXT_L3_EMPTY
      : pcEmpty ? A4_BADGE_TEXTS_EMPTY[version]
      : undefined);
    this.applyEdsPreview();
    this.feed.pushSystem(version === 12
      // ⭐ #365: THE BLURB CARRIES THE COST (fewer passes, more carries — a style shift the
      // exams measured) AND THE UNMEASURED COMPOSITION (the exams ran the EMPTY-BOOK form;
      // the dosed default is this entry's first look). A brief that printed only the wins
      // would ask the gate about a world that does not exist.
      ? (pcEmpty
        ? '🧪 传球先问赶不赶得到 · 空账本 ON — 同一个世界,但每个人都是全新手。传球的脑子先问「他赶得到吗」:赶不到的球要按差的秒数付钱(在意程度 1.0)。⚠ 这个空账本形态才是考试量过的那一档(RA-T1B 的两条臂都没带成熟账本)。⚠ 代价一样:整体传球更少 —— 球员在烂传球的位置改带球/持球。'
        : '🧪 传球先问赶不赶得到 ON — 上面那个世界,再加上传球脑子欠得最久的一问:「他赶得到吗」。同一脚传球现在有两个候选(传到脚下 / 往他跑动方向顶),九宫格里还能挑方向和力度;挡人的线路要付钱;出脚真的踢向脑子选中的那个点;⭐ 最要紧的新价格 —— 传向一个队友赶不到的点,按他差的秒数付钱(账就是他自己追球用的那本:距离÷他的速度+0.15 秒反应)。量到的(RA-T1B,495 对种子):赶不到的提前球每场 3.91 → 2.82(确定,零翻转);射门 11.7 → 12.2(升,确定);被断球 27.9 → 27.3(降,确定);进球 3.14 → 3.16(持平);还在飞的提前球完成率 47.7% → 53.5%。⚠ 代价说在前面:整体传球变少了 —— 每场地面传球少约 2.1 脚,球员在烂传球的位置改成带球或持球;传球成功率反而升了半个点。这是风格转移,不是退化 —— 但好不好看只有你的眼睛能判。⚠ 还有一件必须说的:考试跑的是空账本那一档(&pcdose=0 的形态);默认这档成熟账本是第一次同场,你的眼睛就是第一次观测。你的眼睛要判的:提前球像给人的球了吗?少传两脚球的比赛,更好看还是更闷?对比对象是上面的 v11,不是原版。⚠ 注意:你看的是屏幕上这一场;联赛后台快速模拟的比赛跑的是原版世界(联赛存档不带这些开关)。')
      : version === 11
      // ⭐ #337 item 5: THE BLURB CARRIES THE COST. H-BK.3(b) failed at every legal weight —
      // the lofted game is played LESS and that is STRUCTURAL, and the corridor × DF-brain
      // composition has never been measured together. Both are said here, unhedged.
      ? (pcEmpty
        ? '🧪 门将不再往人身上开球 · 空账本 ON — 同一个世界,但每个人都是全新手:没有人认得任何场面。开高球的人仍然会先算这条线上有没有人挡着(权重 0.5)。⚠ 代价一样:高球本身被开得更少了 —— 每场 3.78 → 1.47 脚,整条梯子上每一档都这样。⚠ 还有:走廊价格和上面那个会思考的防守,从来没有一起量过 —— 这一档是它们第一次同场。'
        : '🧪 门将不再往人身上开球 ON — 上面那个世界,再加上一条价格:开高球的人(门将的大脚、边路的转移吊传、越顶的挑传、门将的手抛球)现在会先算一下这条线上有没有人挡着,挡得越死,这脚球在他心里越不划算。价格的权重固定在 0.5(BK-T4 那把梯子上碰球回弹掉得最狠的一档),不会进化、不会自己变大。量到的(BK-T4,60 对种子):门将开出去的球在飞行中撞到人的比例 0.0951 → 0.0378 每次门将出球,门将身前那格最密的距离上被挡下的比例 .435 → .170,而不该被这个价格影响的地面传中、平快传都没有动。⚠ 代价说在前面:高球本身被开得更少了 —— 每场 3.78 → 1.47 脚,而且这不是剂量调错了:整条梯子上每一档都是这样(1.45–2.02),他学会的是「别开」,不是「换条线开」。⚠ 还有一件必须说的:走廊价格和上面那个会思考的防守,从来没有一起量过 —— BK-T4 的两条臂跑的是没有防守开关的那个世界。这一档是它们第一次同场,你的眼睛就是第一次观测。你的眼睛要判的:门将的球看着讲理了吗?高球还敢不敢开?对比对象是上面的 v10,不是原版。')
      : version === 10
      // ⭐ #337 item 5: THE BLURB CARRIES THE HONEST STATE. The Phase-31 cap STAYS, and the
      // receipt for why (DF-T4's own fields) is in the player's own football language.
      ? (pcEmpty
        ? '🧪 会思考的防守 · 空账本 ON — 同一个会思考的防守,但每个人都是全新手:没有人认得任何场面,全场都慢半拍。⚠ 那条写死的老规矩(永远不许三个人抢球)还在:我们真的拿掉试过 —— 拿掉帽子,人又堆到球上去了(DF-T4)。'
        : '🧪 会思考的防守 ON — 上面那个世界,再加上这条线欠得最久的东西:一个会思考的防守。一,盯人不再每次球一动就整队重新分:他就守他那个人。二,每个防守球员都用同一套账给自己的选择定价 —— 上抢持球的人、守住我这个人、退回去补位、在身体接触里把球断下来。量到的:换人盯的频率每防守分钟 15.47 → 5.59 次(DF-T0);上抢也真的落地了 —— 机会里 27.9% → 40.7% 变成真的贴上去(DF-T3);好的后卫真的更愿意上抢(防守属性最高的三分之一比最低的三分之一多 2.4 倍,DF-T3 量到、DF-T3B 在 121 个种子上重新证过)。⚠ 老实说一件事:那条写死的老规矩(一个人上抢,压迫时两个,永远不许三个)还在。我们真的把它拿掉试过 —— 拿掉帽子,人又堆到球上去了:四个人抢球的画面从 0 涨到 13,069 帧,三个人以上抢球从 9.7% 涨到 17.0%,每个防守球员守住自己人的时间从 66.0% 掉到 64.1%(DF-T4)。所以帽子留着,而且现在它有一张写着"它值多少"的收据。你的眼睛要判的:防守像在思考吗?乱跑消失了吗?赛季后期还守得住吗?对比对象是上面的 v9,不是原版。')
      : version === 9
      // ⭐ #309 item 5: THE BLURB CARRIES THE COST. The world became honest and the pass oracle
      // did not learn it yet — a play-test brief that hid that would ask the gate about a world
      // that does not exist. BK-T2's own field: .6861832642355529 → .5974930362116991.
      ? (pcEmpty
        ? '🧪 身体诚实的世界 · 空账本 ON — 身体诚实,而且每个人都是全新手:转身才能踢,球会撞到人,同时没有人认得任何场面。这是最"野"的一档。注意:传球更难了(完成率约降 9 个百分点)——传球的大脑还没学会躲开身体。'
        : '🧪 身体诚实的世界 ON — 转身才能踢,球会撞到人。踢球的人要先把身子转过去,这段转身的时间是从他自己的转向速度算出来的(完全反身约 0.48 秒);刚踢完球的人不再是透明的,球会真的撞在他身上弹开。量到的:出球前的准备时间 6.44 → 10.00 帧(一场多付 3.10 秒),背对着出球的比例 33.3% → 23.1%,球穿过人的画面每场 118 → 45 帧(少了六成)。注意:传球更难了(完成率约降 9 个百分点)——传球的大脑还没学会躲开身体。想看最野的一档,在网址后面加 &pcdose=0。')
      : version === 8
      ? (pcEmpty
        ? '🧪 处理时间世界 · 空账本 ON — 同一个世界,但每个人都是全新手:没有人认得任何场面,所有的反应都要付 0.45 秒的长档。这是最"野"的一档 —— 全场的防守都会慢半拍,过人会变得容易得多。对照的是默认那一档(账本已经过完一个赛季)。'
        : '🧪 处理时间世界 · 剂量成熟 ON — 防守要先"看见"才能反应:熟悉的场面付 0.20 秒,没见过的场面付 0.45 秒,这段时间里他还在执行上一个念头。量到的:成熟的账本里 94.9% 的意外走短档(空账本只有 11.6%);被过掉的人,走短档的丢 0.34 米、走长档的丢 1.42 米 —— 4.1 倍。过人买到的时间,是对手没学过这一课的那部分。想看最野的一档,在网址后面加 &pcdose=0。')
      : version === 7
      ? (l3Empty
        ? '🧪 防守账本世界 · 空账本 ON — 同一个过人世界,防守的账本从这个赛季自己学到的东西开始(这就是现在的规矩:每个赛季清空)。这是对照档:一场比赛里账本几乎还没学到东西。'
        : '🧪 防守账本世界 · 剂量成熟 ON — 防守现在记得自己扑空的账:自己的账本说这个速度扑上去更吃亏时,这一次上抢就收回来(只会收回,不会多扑)。量到的:全速飞铲 2.26 → 0,收着的对抗 15.20 → 17.01,总对抗几乎没变 —— 挑战是晚一点、在控制中再上。世界稍微更快了一点,不是更平静。你的眼睛要判:像博弈,还是像磨蹭?')
      : version === 6
      ? '🧪 CB 过人世界 ON — 带球的人可以把球捅过扑上来的人(球真的离脚,谁都可能先到),扑空的防守球员付的是他自己身体算出来的恢复时间。屏幕上:捅球的球自己走过的轨迹 + 被过的人脚下那圈会收的光。比赛在这个世界里重开。'
      : version === 5
      ? '🧪 MT 0.8 · 松盯内收(对比) ON — the same weak-side tuck-in, turned up to the visible dose: defenders sag off their man toward the middle and the back line squeezes the far lane. Measured at this dose: the weak-side body moves 2.4 m, and goals fall to ~1.7 a match. The contrast world — look at it, then go back to 0.2.'
      : version === 4
        ? '🧪 MT 0.2 · 松盯内收 ON — both teams now defend the coupled tuck-in world at the ruled dose 0.2: a marker holds a little further off the man he is watching while the ball is travelling, and the back line drifts toward the ball\'s lane. Measured small (the body effect is under the ruler\'s resolution at this dose) — if you want to SEE the mechanism, arm the 0.8 contrast.'
        : version === 3
          ? '🧪 A4 约定世界 v3 · 前摇 ON — the discipline world, and now a short pass is not struck the instant it is decided: the leg goes back first (fast for the technical ones), and the match restarts in that world.'
          : version === 2
            ? '🧪 A4 约定世界 v2 · 纪律 ON — the same agreement, but every position holds it at its own tightness (后卫紧 · 前锋松), and the match restarts in that world.'
            : version === 1
              ? '🧪 A4 约定世界 v1 · 统一 ON — both teams now share the measured pre-match agreement, and the match restarts in that world.'
              : '🧪 A4 约定世界 OFF — the shipped world returns.');
    this.loadNextFixture();
    this.setStatus(version === 0 ? 'A4 world off.'
      : isRaWorld(version)
        ? `receiver-access play-test world armed at the exam pins (${pcEmpty ? 'born-absent books' : 'matured dose'}).`
      : isCorridorWorld(version)
        ? `corridor play-test world armed at weight 0.5 (${pcEmpty ? 'born-absent books' : 'matured dose'}).`
      : isDfWorld(version)
        ? `defensive-brain play-test world armed, cap intact (${pcEmpty ? 'born-absent books' : 'matured dose'}).`
      : isBkWorld(version)
        ? `body-honest play-test world armed (${pcEmpty ? 'born-absent books' : 'matured dose'}).`
      : isPcWorld(version)
        ? `CB + defence-book + reaction-latency play-test world armed (${pcEmpty ? 'born-absent books' : 'matured dose'}).`
      : isL3World(version)
        ? `CB + defence-book play-test world armed (${l3Empty ? 'empty book' : 'matured dose'}).`
      : isCbWorld(version) ? 'CB 过人 play-test world armed (proneness 1.0).'
        : isMtWorld(version) ? `MT play-test world ${version === 4 ? '0.2' : '0.8'} armed.`
          : `A4 world v${version} armed.`);
  }

  setEmergentPos(v: boolean): void {
    setEmergentPos(v);
    try {
      localStorage.setItem('evo:emergentPos', v ? '1' : '0');
    } catch { /* private mode / no storage — the flag still applies this session */ }
  }

  toggleLeagueScreen(): void {
    this.evolutionScreen.hide();
    this.playerScreen.hide();
    this.clubsScreen.hide();
    this.settingsScreen.hide();
    this.leagueScreen.toggle(this.league);
    this.syncShellMode();
    this.updateMusic();
  }

  /** The CLUB CENTER (Phase 113.5) — the clubs' own stage. */
  toggleClubsScreen(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.evolutionScreen.hide();
    this.playerScreen.hide();
    this.settingsScreen.hide();
    this.clubsScreen.toggle(this.league);
    this.syncShellMode();
    this.updateMusic();
  }

  /** The evolution CENTER (Phase 51) — evolution's own stage, not a league tab. */
  toggleEvolutionScreen(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.playerScreen.hide();
    this.clubsScreen.hide();
    this.settingsScreen.hide();
    this.evolutionScreen.toggle(this.league);
    this.syncShellMode();
    this.updateMusic();
  }

  /** The PLAYER center (Phase 56) — the people's own stage. */
  togglePlayerScreen(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.evolutionScreen.hide();
    this.clubsScreen.hide();
    this.settingsScreen.hide();
    this.playerScreen.toggle(this.league);
    this.syncShellMode();
    this.updateMusic();
  }

  /** The SETTINGS room (119a.5) — saves, seed, language, debug overlays. */
  toggleSettingsScreen(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.evolutionScreen.hide();
    this.playerScreen.hide();
    this.clubsScreen.hide();
    this.settingsScreen.toggle();
    this.syncShellMode();
    this.updateMusic();
  }

  /** Entity links (Phase 108): jump to a club's deep dive from anywhere —
   * since 113.5 the identity dive lives on the club center. */
  openClubDive(slot: number): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.playerScreen.hide();
    this.evolutionScreen.hide();
    this.settingsScreen.hide();
    this.clubsScreen.focusClub(this.league, slot);
    this.syncShellMode();
    this.updateMusic();
  }

  /** Entity links (Phase 108): jump to a player's deep dive from anywhere. */
  openPlayerDive(slot: number, index: number): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league); // close
    this.evolutionScreen.hide();
    this.clubsScreen.hide();
    this.settingsScreen.hide();
    this.playerScreen.focusPlayer(this.league, slot, index);
    this.syncShellMode();
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

  /** Context-driven BGM (Phase 89 → 105): the launch overlay = the title
   * anthem FULL; the pre-match clash and any PAUSE = the same anthem
   * DUCKED (user design: enter the game and it drops back naturally, fades
   * out when play resumes, returns when you pause); ceremony = the victory
   * track (enters at its 20s drop), management screens = the league track,
   * live play = crowd only. */
  /**
   * D1 dual shell (UI-NORTHSTAR §全盘采纳 1): while a WORLD page is open the
   * match side-columns step aside and the live match keeps running as a small
   * floating player in the stage's top-right corner. Match mode is untouched.
   * Pure chrome — the sim never learns which shell is on screen.
   */
  private syncShellMode(): void {
    const world = this.leagueScreen?.isVisible
      || this.evolutionScreen?.isVisible
      || this.clubsScreen?.isVisible
      || this.playerScreen?.isVisible;
    document.body.classList.toggle('world-mode', !!world);
    this.miniRestore.classList.toggle('hidden', !world);
  }

  /** The mini-player's ⤢ control: leave world mode, back to the match. */
  private closeWorldScreens(): void {
    if (this.leagueScreen.isVisible) this.leagueScreen.toggle(this.league);
    this.evolutionScreen.hide();
    this.clubsScreen.hide();
    this.playerScreen.hide();
    this.syncShellMode();
    this.updateMusic();
  }

  private updateMusic(): void {
    // Optional chaining throughout: the music slider's build-time default
    // (Phase 96) calls this while the screens are still being constructed.
    const pauseMusic =
      this.paused && !this.reel && !this.replay?.active && !this.theater;
    const [slot, mul]: [Parameters<MusicSystem['play']>[0], number] = this.titleScreen?.isVisible
      ? ['title', 1]
      : this.ceremony?.isVisible
        ? ['victory', 1]
        : this.leagueScreen?.isVisible || this.evolutionScreen?.isVisible || this.playerScreen?.isVisible || this.clubsScreen?.isVisible || this.settingsScreen?.isVisible
          ? ['league', 1]
          : pauseMusic // the clash no longer keeps the anthem by itself —
            // live play is crowd-only the moment ▶ is pressed (105), and
            // between fixtures the game IS paused, so the clash still gets
            // its anthem there.
            ? ['title', 0.4]
            : [null, 1];
    this.music.play(slot, mul);
    // The stadium falls silent when a screen covers the stage (Phase 90);
    // the pre-match clash is a broadcast graphic — the crowd stays. The
    // launch overlay is a TITLE SCREEN: synthwave only, no crowd under it.
    this.sound.stadiumVisible =
      (slot === null || slot === 'title') && !this.titleScreen?.isVisible;
    // Every screen change funnels through here — cheapest single place to
    // keep the topbar nav state honest (119a.5).
    for (const [b, active] of this.navEntries) b.classList.toggle('active', active());
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

  /**
   * Track F: the world's time of day. The user picked the toy direction with
   * BOTH lightings live ("两个都要,做成可切换"), so this is a real player
   * setting, persisted like emergent positioning — not a debug flag.
   */
  setLighting(l: Lighting): void {
    try {
      localStorage.setItem(LIGHTING_KEY, l);
    } catch {
      /* private browsing — the choice just won't survive a reload */
    }
    this.setStyle(this.styleId, l);
    this.left.setLightingUI(l);
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
    this.applyEdsPreview(); // E4-PREP: every League swap re-arms the user's choice
    this.loadNextFixture();
    this.feed.pushSystem('💾 League loaded.');
    this.leagueScreen.refreshIfVisible(this.league);
    this.clubsScreen.refreshIfVisible(this.league);
  }

  /** Download the current league as a .json save file (Phase 21). */
  exportSave(): void {
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
  importSave(): void {
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
        this.applyEdsPreview(); // E4-PREP: every League swap re-arms the user's choice
        this.loadNextFixture();
        this.feed.pushSystem(
          `📥 League imported — Gen ${league.generation}, seed ${league.seed}. Press Save to keep it.`,
        );
        this.leagueScreen.refreshIfVisible(this.league);
      this.evolutionScreen.refreshIfVisible(this.league);
      this.playerScreen.refreshIfVisible(this.league);
      this.clubsScreen.refreshIfVisible(this.league);
      });
    });
    input.click();
  }

  newLeague(seedText: string): void {
    if (this.busy) return;
    const seed = parseSeed(seedText);
    this.league = new League({ seed });
    this.applyEdsPreview(); // E4-PREP: every League swap re-arms the user's choice
    this.loadNextFixture();
    this.paused = true;
    this.left.setSpeedUI(this.paused, this.speed);
    this.feed.pushSystem(`🌱 New league, seed ${seed}.`);
    this.leagueScreen.refreshIfVisible(this.league);
    this.clubsScreen.refreshIfVisible(this.league);
  }

  resetAll(): void {
    if (this.busy) return;
    if (!window.confirm(t('Delete the save and start over?'))) return;
    clearSave();
    this.league = new League({ seed: DEFAULT_SEED });
    this.applyEdsPreview(); // E4-PREP: every League swap re-arms the user's choice
    this.loadNextFixture();
    this.paused = true;
    this.left.setSpeedUI(this.paused, this.speed);
    this.feed.pushSystem('🗑️ Save cleared. Fresh league.');
    this.leagueScreen.refreshIfVisible(this.league);
    this.clubsScreen.refreshIfVisible(this.league);
  }

  /* ---------------- 3D view & replay actions ---------------- */

  /** E4-PREP: the user's EDS preview choice, sticky across reloads. */
  private edsPreview: EdsPreviewMode = readEdsPreviewMode();
  /**
   * A4 PLAY-TEST (ruling #155; v2 by #167.5, v3 by #184.2 — one value, so the
   * worlds can never blend). Starts OFF even when the sticky choice / URL
   * param says otherwise: the census tables are fetched asynchronously, so the
   * boot path arms through `setA4World` once they land (below). Until then the
   * game is byte-identically the production game.
   */
  private a4World: A4WorldVersion = 0;
  private a4Tables: A4Tables | null = null;
  /**
   * ⭐ L3 (#282.4): the matured dose, once its opt-in chunk has landed. `null` in every path that
   * is not the DOSED form of world 7 — including `?l3dose=0`, which plays the same world with the
   * book as the season left it (the shipped law's own state).
   */
  private l3Dose: readonly L3DoseCell[] | null = null;
  /**
   * ⭐ PC (#300.6): the matured recognition dose, once its opt-in chunk has landed. `null` in
   * every path that is not the MATURED form of world 8 — including `?pcdose=0`, which plays the
   * same world with every book born absent (everyone a novice).
   */
  private pcDose: PcDoseTable | null = null;
  private readonly a4Badge = new A4WorldBadge();
  /** F0 style arm + lighting the 3D view is built with (defaults = shipped). */
  private styleId: StyleId = DEFAULT_STYLE;
  private lighting: Lighting = loadLighting();

  setViewMode(v: ViewMode): void {
    if (v === this.viewMode) return;
    if (v === '3d') {
      try {
        this.build3d();
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

  /** Build the 3D renderer under the current F0 style preset (no-op if it
   * already exists). Extracted from setViewMode so a style switch can rebuild. */
  private build3d(): void {
    if (this.three) return;
    this.three = new ThreeMatchRenderer(this.threeHost, stylePreset(this.styleId, this.lighting));
    this.three.onSelectPlayer = (gid) => {
      this.selectedGid = this.selectedGid === gid ? null : gid;
    };
    this.three.onFxEvent = (type) => {
      this.sound.play(type);
      // The goal cut (F7c) is a LIVE broadcast reflex. In a replay the viewer
      // has already picked the angle they wanted — `cameraForEvent` set it on
      // the jump — so borrowing the camera back off them there would fight the
      // very thing they asked for.
      if (type === 'goal' && !this.replay.active) this.three?.goalCut();
    };
    this.three.onArousal = (a) => this.sound.setArousal(a);
    this.three.onCarry = (on) => this.sound.setCarry(on);
    this.three.onScoreBugTap = () => this.toggleClash();
    // B2: the sandbox's own awareness chip flips the synthetic value.
    this.three.onPerceptionAwarenessToggle = () => {
      this.flags.perceptionLowAwareness = !this.flags.perceptionLowAwareness;
    };
    this.three.setFxQuality(this.fxQuality);
    if (this.match) this.three.attach(buildRenderTheme(this.match));
  }

  /**
   * Track F / F0: rebuild the 3D view under a different style arm + lighting.
   * Tooling-facing (exposed on `__evo` so the screenshot harness can shoot
   * every arm at the same frozen tick); nothing in the UI calls it yet, and
   * the defaults reproduce the shipped look.
   */
  setStyle(id: StyleId, lighting: Lighting): void {
    if (this.styleId === id && this.lighting === lighting && this.three) return;
    this.styleId = id;
    this.lighting = lighting;
    this.left.setLightingUI(lighting);
    if (this.viewMode !== '3d' || !this.three) return;
    const camera = this.three.cameraMode;
    this.three.dispose();
    this.three = null;
    this.build3d();
    this.three!.setCameraMode(camera);
    this.left.setViewUI(this.viewMode, camera);
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
