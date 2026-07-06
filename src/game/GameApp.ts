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
import { buildWildcardTeamInfo, WILDCARD_NAME } from '../ai/wildcard';
import { WILDCARD_POLICY } from '../ai/wildcardPolicy';
import { CUP_NAME, CUP_ROUND_NAMES, cupEntrant, cupTie } from '../sim/cup';
import { League, type Fixture, type SeasonRecord } from '../sim/League';
import { Match } from '../sim/Match';
import type { SimRequest } from '../sim/simRunner';
import { hashSeed } from '../utils/rng';
import type { SimWorkerMessage } from './simWorker';
import type { MatchEvent } from '../sim/types';
import { defaultFlags, type FxQuality, type GameActions, type UiFlags, type ViewMode } from '../ui/actions';
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
    // Cinematic mode chrome: an exit control (cinematic must always be
    // escapable) and a minimal 2D score bug (3D has its own broadcast bug).
    const cineExit = button('✕ exit cinematic', () => this.setCinematic(false));
    cineExit.className = 'cinematic-exit';
    stage.appendChild(cineExit);
    this.cineBug = el('div') as HTMLDivElement;
    this.cineBug.className = 'score-bug cine-bug hidden';
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
      cinematic: () => this.cinematic,
      simMode: () => this.lastSimMode,
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
    const key = `${m.teams[0].info.short}|${m.score[0]}|${m.score[1]}|${m.minute()}`;
    if (key === this.lastCineBugKey) return;
    this.lastCineBugKey = key;
    const hex = (c: number) => `#${c.toString(16).padStart(6, '0')}`;
    this.cineBug.innerHTML =
      `<span class="sb-chip" style="background:${hex(m.teams[0].info.colors.primary)}"></span>` +
      `<span class="sb-team">${m.teams[0].info.short}</span>` +
      `<span class="sb-score">${m.score[0]}–${m.score[1]}</span>` +
      `<span class="sb-team">${m.teams[1].info.short}</span>` +
      `<span class="sb-chip" style="background:${hex(m.teams[1].info.colors.primary)}"></span>` +
      `<span class="sb-min">${m.minute()}'</span>`;
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
    this.league.applyResult(this.fixture, this.match.getResult());
    this.afterFixtureApplied();
    if (!this.autoContinue) {
      this.paused = true;
      this.left.setSpeedUI(this.paused, this.speed);
    }
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
    if (this.league.seasonDone) {
      const prevChampion = this.league.history[this.league.history.length - 1]?.championName;
      const rec = this.league.finishSeason();
      // Cup lines were already announced live, fixture by fixture.
      this.announceSeasonRecord(rec, prevChampion, false);
      saveLeague(this.league);
      this.leagueScreen.refreshIfVisible(this.league);
    }
    this.loadNextFixture();
    this.announceCupDraw();
  }

  /**
   * Season-end feed lines from a SeasonRecord. `includeCup` adds the cup
   * summary for worker-simmed seasons, where the live per-tie announcements
   * never ran (the record carries the whole story).
   */
  private announceSeasonRecord(rec: SeasonRecord, prevChampion: string | undefined, includeCup: boolean): void {
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
    if (includeCup && rec.cup) {
      const final = rec.cup.ties[rec.cup.ties.length - 1];
      this.feed.pushSystem(
        `🏅 ${rec.cup.winnerName} win the ${CUP_NAME}! ${final.scoreH}–${final.scoreA} vs ${rec.cup.runnerUpName}.`,
      );
      if (rec.cup.upsets.length > 0) {
        this.feed.pushSystem(
          `⚡ ${rec.cup.upsets.length} giant killing${rec.cup.upsets.length > 1 ? 's' : ''} along the cup run.`,
        );
      }
    }
    if (rec.cup && rec.cup.winnerSlot === rec.championSlot && rec.cup.winnerName === rec.championName) {
      this.feed.pushSystem(`✨ DOUBLE: ${rec.cup.winnerName} won the league and ${CUP_NAME}.`);
    }
    for (const p of rec.promoted ?? []) this.feed.pushSystem(`⬆️ ${p.name} promoted to the Premier Division.`);
    for (const r of rec.relegated ?? []) this.feed.pushSystem(`⬇️ ${r.name} relegated to the Challenger Division.`);
    for (const e of rec.evolution.entries) {
      if (e.kind === 'reborn') {
        this.feed.pushSystem(`🔄 ${e.name} born from ${e.parents?.join(' × ')} (drift ${e.drift.toFixed(2)})`);
      }
    }
  }

  /** Feed lines for a just-applied cup tie: giant killings and the final. */
  private announceCupResult(f: Fixture): void {
    const cup = this.league.cup;
    if (!cup) return;
    const tie = cupTie(cup, f.round, f.index);
    if (!tie.played || tie.winner === undefined) return;
    const winner = cupEntrant(cup, tie.winner);
    const loser = cupEntrant(cup, tie.winner === tie.home ? tie.away : tie.home);
    const score = `${tie.scoreH}–${tie.scoreA}`;
    const drawNote = tie.byDrawRule ? ' — level at full time, the underdog advances' : '';
    if (tie.round === 3) {
      this.feed.pushSystem(`🏅 ${winner.name} win the ${CUP_NAME}! ${score} vs ${loser.name}${drawNote}.`);
    } else if (tie.upset) {
      this.feed.pushSystem(
        `⚡ GIANT KILLING: ${winner.name} knocked out ${loser.name} ${score} in the ${CUP_ROUND_NAMES[tie.round]}${drawNote}.`,
      );
    }
  }

  /** Announce a cup round the moment its first tie comes up. */
  private announceCupDraw(): void {
    const f = this.fixture;
    const cup = this.league.cup;
    if (!f?.cup || !cup || f.index !== 0 || f.played) return;
    if (f.round === 0) {
      this.feed.pushSystem(
        `🎪 ${CUP_NAME} — the Round of 16 draw is made: eight Premier–Challenger ties. Drawn ties send the underdog through.`,
      );
    } else if (f.round === 3) {
      const tie = cupTie(cup, 3, 0);
      this.feed.pushSystem(
        `🏆 ${CUP_NAME} Final: ${cupEntrant(cup, tie.home).name} vs ${cupEntrant(cup, tie.away).name}!`,
      );
    } else {
      this.feed.pushSystem(`🎪 ${CUP_NAME} ${CUP_ROUND_NAMES[f.round]}s are here.`);
    }
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
    if (this.exhibition && this.match) {
      this.match.runToCompletion();
      this.onWatchedMatchFinished();
      return;
    }
    this.finishCurrentMatchHeadless();
  }

  /** Field the ES-trained Wildcard XI against the current Premier leader. */
  playExhibition(): void {
    if (this.busy) return;
    this.exitReplay();
    const leader = this.league.standings(0)[0];
    const opp = this.league.teamInfo(leader.slot);
    this.exhibition = true;
    this.fixture = null; // standalone: never applied to the league
    this.match = new Match({
      seed: hashSeed(this.league.seed, this.league.generation, 0xeb),
      teamA: buildWildcardTeamInfo(WILDCARD_POLICY),
      teamB: opp,
      duration: this.league.matchDuration,
    });
    this.buffer.clear();
    this.matchRenderer.attach(this.match);
    this.three?.attach(buildRenderTheme(this.match));
    this.feed.attach(this.match);
    this.right.attach(this.match);
    this.left.updateHeader(this.match, this.league, true);
    this.selectedGid = null;
    this.acc = 0;
    this.paused = false;
    this.speed = 1;
    this.left.setSpeedUI(false, 1);
    this.feed.pushSystem(
      `⚡ Exhibition: ${WILDCARD_NAME} (learned policy, neutral genes) vs ${opp.name} — friendly, no league bookkeeping.`,
    );
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
      this.loadNextFixture();
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
    this.leagueScreen.toggle(this.league);
  }

  setSound(v: boolean): void {
    this.sound.enabled = v;
  }

  /* ---------------- presentation (Phase 15) ---------------- */

  setCinematic(v: boolean): void {
    this.cinematic = v;
    document.body.classList.toggle('cinematic', v);
    this.updateCineBug();
    this.left.setCinematicUI(v);
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

  copyShareSummary(): void {
    const summary = this.buildShareSummary();
    const done = () => this.feed.pushSystem('📋 Share summary copied to clipboard.');
    const fallback = () => {
      // Clipboard blocked (permissions/headless): surface the text itself.
      this.feed.pushSystem(`📋 Copy blocked — summary: ${summary.replace(/\n/g, ' · ')}`);
    };
    try {
      navigator.clipboard.writeText(summary).then(done, fallback);
    } catch {
      fallback();
    }
  }

  private buildShareSummary(): string {
    const m = this.match;
    const lines: string[] = [];
    if (m) {
      const [a, b] = m.teams;
      lines.push(
        `⚽ ${a.info.name} ${m.score[0]}–${m.score[1]} ${b.info.name} (${m.minute()}') · xG ${a.stats.xg.toFixed(2)}–${b.stats.xg.toFixed(2)}`,
      );
      const scorers = m.playerStats
        .map((s, gid) => ({ s, gid }))
        .filter(({ s }) => s.goals > 0)
        .map(({ s, gid }) => `${m.allPlayers[gid].name} ${'⚽'.repeat(Math.min(s.goals, 5))}`);
      if (scorers.length > 0) lines.push(`Scorers: ${scorers.join(', ')}`);
    }
    lines.push(
      `EvoFootball Arena · Gen ${this.league.generation} · Season ${this.league.history.length + 1} · ${this.league.roundLabel()} · seed ${this.league.seed}`,
    );
    return lines.join('\n');
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
