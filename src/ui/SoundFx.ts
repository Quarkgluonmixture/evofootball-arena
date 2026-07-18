/**
 * Event sounds (Phase 78: real recorded samples — the user's REAPER-cut
 * library under public/audio/, cleaned by scripts/audio/clean.py).
 * OFF by default; toggled from the left panel. Lazy: nothing is fetched
 * until the first enable (which is also the user gesture WebAudio needs).
 * Every failure (no AudioContext, missing file, undecodable codec) falls
 * back to the old generated beeps — sound stays strictly cosmetic.
 */
export type FxSoundType =
  | 'goal' | 'save' | 'shot' | 'interception' | 'corner' | 'foul' | 'card'
  | 'pass' | 'touch' | 'miss' | 'header' | 'woodwork';

/** Sample file(s) + gain per event; arrays play together (net + crowd).
 *
 * MIX PASS (Phase 105, user report round 3): every gain is now anchored to
 * MEASURED source loudness (afconvert→RMS; see the phase-105 ledger table)
 * instead of guessed. The recordings span a huge range — the ambience beds
 * sit at −45 dB RMS while the crowd reactions hit −26 dB, which is exactly
 * why the beds were inaudible and the cheers deafening at similar gains.
 * Target hierarchy (effective RMS = source + 20·log10(gain), master at 1):
 *   beds −29 · reactions −31..−33 · goal accents −28..−29 ·
 *   per-touch layer −34..−35 · UI −33..−36 · BGM −16.  */
const SAMPLES: Partial<Record<FxSoundType, Array<{ file: string; gain: number }>>> = {
  shot: [{ file: 'sfx_kick_power_01.m4a', gain: 1.35 }],
  goal: [
    { file: 'sfx_ball_hit_net_01.m4a', gain: 1.6 },
    { file: 'sfx_crowd_goal_celebration_01.m4a', gain: 0.66 },
  ],
  save: [
    { file: 'sfx_keeper_save_01.m4a', gain: 1.0 },
    { file: 'sfx_crowd_applause_01.m4a', gain: 0.6 },
  ],
  interception: [{ file: 'sfx_touch_heavy_01.m4a', gain: 2.5 }],
  pass: [
    { file: 'sfx_pass_short_02-001.m4a', gain: 0.74 },
    { file: 'sfx_pass_short_02-002.m4a', gain: 0.84 },
  ],
  touch: [{ file: 'sfx_touch_heavy_01.m4a', gain: 2.2 }],
  corner: [{ file: 'sfx_pass_short_02-001.m4a', gain: 0.6 }],
  foul: [{ file: 'sfx_referee_whistle_01.m4a', gain: 0.9 }],
  // A near thing goes wide/over — the crowd deflates (Phase 90).
  miss: [{ file: 'sfx_crowd_disappointment_01.m4a', gain: 0.45 }],
  // The clang the author recorded a phase range ago finally has its
  // mechanic (Phase 100): frame hit + the crowd's collective wince.
  woodwork: [
    { file: 'sfx_ball_hit_crossbar_01.m4a', gain: 1.2 },
    { file: 'sfx_crowd_disappointment_01.m4a', gain: 0.4 },
  ],
  // The aerial duel's thud (Phase 90) — header flags from the renderer.
  header: [{ file: 'sfx_aerial_duel_contact_01.m4a', gain: 1.5 }],
  // card: silent — the whistle already blew for the foul.
};

/** UI sounds (Phase 90) — the recorded clicks, routed through the same
 * master so the volume slider governs them too. */
const UI_SAMPLES: Record<'click' | 'toggle' | 'heavy', { file: string; gain: number }> = {
  click: { file: 'ui_button_click_01.m4a', gain: 0.8 },
  toggle: { file: 'ui_toggle_01.m4a', gain: 0.45 },
  heavy: { file: 'ui_button_press_heavy_tonal_01.m4a', gain: 0.5 },
};

const CHANTS = ['amb_stadium_crowd_chant_01.m4a', 'amb_stadium_crowd_chant_02.m4a'];
// The beds are recorded VERY quiet (−45.5/−44.8 dB RMS — 18 dB under every
// reaction sample). Both beds now play LAYERED (Phase 117 — the old
// Math.random pick left one bed unheard for a whole session): each bed's
// 105-measured gain (6.7 / 6.2 → ≈−29 dB effective solo) drops 3 dB
// (×0.71) so the UNCORRELATED pair sums back to the same ≈−29 dB floor,
// just denser. Peaks stay ≤−9 dB at the arousal ceiling (×1.6).
const AMB_BEDS = [
  { file: 'amb_stadium_crowd_low_loop_01.wav', gain: 4.8 },
  { file: 'amb_stadium_crowd_low_loop_02.wav', gain: 4.4 },
];
// Source is near the noise floor (−62 dB RMS) — it needs this much just to
// whisper under a sprint (was 0.3 = −72 dB effective, pure placebo).
const DRIBBLE = { file: 'sfx_dribble_fast_loop_01.m4a', gain: 8 };

const AMBIENCE_GAIN = 1;

export class SoundFx {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading = false;
  private ambSrcs: AudioBufferSourceNode[] = [];
  /** Shared arousal-scaled gain over the layered beds (per-bed level lives
   * in each bed's own constant node). */
  private ambGain: GainNode | null = null;
  private master: GainNode | null = null;
  private on = false;
  private vol = 0.8;
  /** Sim playback speed (Phase 89): at fast-forward the per-touch layer
   * machine-guns — GameApp feeds the multiplier so play() can gate. */
  simSpeed = 1;
  private chantTimer: ReturnType<typeof setTimeout> | null = null;
  private arousal = 0;
  private stadium = true;
  private dribbleSrc: AudioBufferSourceNode | null = null;

  /** The stands react (Phase 90): CrowdSystem arousal swells the bed. */
  setArousal(a: number): void {
    this.arousal = a;
    if (this.ambGain && this.ctx) {
      this.ambGain.gain.setTargetAtTime(
        AMBIENCE_GAIN * (0.7 + a * 0.9), this.ctx.currentTime, 0.4,
      );
    }
  }

  /**
   * MOBILE UNLOCK (Phase 105, user report 手机端没有声音): call from a REAL
   * user gesture (the title screen's enter click). Two iOS problems at once:
   * ① SoundFx has its OWN AudioContext, created lazily inside play() — a
   *   frame-driven call site, so on iOS the context was born suspended and
   *   a non-gesture resume() never succeeds. The title click unlocked the
   *   MUSIC context (phase-96) but never this one.
   * ② The ringer switch: iOS mutes WebAudio while the phone is on silent
   *   UNLESS the page also plays an HTML <audio> element — playing a short
   *   silent loop flips the audio session to "playback" (the unmute.js
   *   trick), and every context on the page becomes audible.
   * Also re-resumes on visibilitychange — iOS suspends contexts when the
   * app backgrounds and does not wake them for you.
   */
  unlock(): void {
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      // one-shot empty buffer INSIDE the gesture — the classic warm-up
      const b = this.ctx.createBuffer(1, 1, 22050);
      const s = this.ctx.createBufferSource();
      s.buffer = b;
      s.connect(this.ctx.destination);
      s.start(0);
      if (!this.silentEl) {
        // ~46ms of silence, WAV built in code — loops forever, near-mute.
        const rate = 22050;
        const n = 1024;
        const wav = new ArrayBuffer(44 + n * 2);
        const v = new DataView(wav);
        const tag = (o: number, s: string): void => {
          for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i));
        };
        tag(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); tag(8, 'WAVE');
        tag(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
        v.setUint16(22, 1, true); v.setUint32(24, rate, true);
        v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true);
        v.setUint16(34, 16, true); tag(36, 'data'); v.setUint32(40, n * 2, true);
        const el = document.createElement('audio');
        el.src = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
        el.loop = true;
        el.volume = 0.01;
        (el as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
        void el.play().catch(() => undefined);
        this.silentEl = el;
      }
      if (!this.visHooked) {
        this.visHooked = true;
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && this.ctx?.state === 'suspended') {
            void this.ctx.resume();
          }
        });
      }
    } catch {
      /* no WebAudio — stay silent */
    }
  }

  private silentEl: HTMLAudioElement | null = null;
  private visHooked = false;

  /** Whether the match stage is on screen (Phase 90): management screens
   * and the ceremony cover it — the stadium falls silent there. */
  set stadiumVisible(v: boolean) {
    if (v === this.stadium) return;
    this.stadium = v;
    if (!v) {
      this.stopAmbience();
      this.setCarry(false);
    } else if (this.on) {
      this.startAmbience();
    }
  }

  /** A fast carry is on (renderer's carry state) — the dribble-step loop. */
  setCarry(on: boolean): void {
    if (!on || !this.on || !this.stadium || this.simSpeed > 4) {
      if (this.dribbleSrc) {
        try {
          this.dribbleSrc.stop();
        } catch {
          /* already stopped */
        }
        this.dribbleSrc = null;
      }
      return;
    }
    if (this.dribbleSrc || !this.ctx || !this.buffers.has(DRIBBLE.file)) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get(DRIBBLE.file)!;
    src.loop = true;
    const g = this.ctx.createGain();
    g.gain.value = DRIBBLE.gain;
    src.connect(g).connect(this.out());
    src.start();
    this.dribbleSrc = src;
  }

  /** UI click layer (Phase 90) — same master, same slider. */
  playUi(kind: 'click' | 'toggle' | 'heavy'): void {
    if (!this.on || !this.ctx) return;
    const u = UI_SAMPLES[kind];
    const buf = this.buffers.get(u.file);
    if (!buf) return;
    try {
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const g = this.ctx.createGain();
      g.gain.value = u.gain;
      src.connect(g).connect(this.out());
      src.start();
    } catch {
      /* best-effort */
    }
  }

  get enabled(): boolean {
    return this.on;
  }

  set enabled(v: boolean) {
    this.on = v;
    if (v) {
      void this.init();
    } else {
      this.stopAmbience();
    }
  }

  /** Master volume 0..1 (Phase 78.1, user ask) — a slider, 0 = mute. */
  get volume(): number {
    return this.vol;
  }

  set volume(v: number) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(this.vol, this.ctx.currentTime, 0.05);
    }
    this.enabled = this.vol > 0;
  }

  private out(): AudioNode {
    if (!this.master) {
      this.master = this.ctx!.createGain();
      this.master.gain.value = this.vol;
      this.master.connect(this.ctx!.destination);
    }
    return this.master;
  }

  private async init(): Promise<void> {
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      return; // no WebAudio — play() will silently do nothing
    }
    if (!this.loading && this.buffers.size === 0) {
      this.loading = true;
      const files = new Set<string>([...AMB_BEDS.map((b) => b.file), ...CHANTS, DRIBBLE.file]);
      for (const u of Object.values(UI_SAMPLES)) files.add(u.file);
      for (const list of Object.values(SAMPLES)) for (const s of list) files.add(s.file);
      await Promise.all(
        [...files].map(async (f) => {
          try {
            const res = await fetch(`${import.meta.env.BASE_URL}audio/${f}`);
            const buf = await this.ctx!.decodeAudioData(await res.arrayBuffer());
            this.buffers.set(f, buf);
          } catch {
            /* missing/undecodable file -> beep fallback for its events */
          }
        }),
      );
      this.loading = false;
    }
    if (this.on) this.startAmbience();
  }

  /** The stadium beds: the QA'd seamless-loop candidates, WAV (AAC's
   * encoder priming would click at the loop point), low in the mix —
   * BOTH layered since Phase 117 (level math at AMB_BEDS). */
  private startAmbience(): void {
    if (!this.ctx || this.ambSrcs.length > 0 || !this.stadium) return;
    const beds = AMB_BEDS.filter((b) => this.buffers.has(b.file));
    if (beds.length === 0) return;
    const shared = this.ctx.createGain();
    shared.gain.value = 0;
    shared.gain.linearRampToValueAtTime(
      AMBIENCE_GAIN * (0.7 + this.arousal * 0.9), this.ctx.currentTime + 1.2,
    );
    shared.connect(this.out());
    for (const bed of beds) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.buffers.get(bed.file)!;
      src.loop = true;
      const g = this.ctx.createGain();
      g.gain.value = bed.gain;
      src.connect(g).connect(shared);
      src.start();
      this.ambSrcs.push(src);
    }
    this.ambGain = shared;
    this.scheduleChant();
  }

  /** A chant rises from the stands every so often (Phase 90) — louder
   * when the crowd is already up. */
  private scheduleChant(): void {
    if (this.chantTimer) clearTimeout(this.chantTimer);
    this.chantTimer = setTimeout(() => {
      this.chantTimer = null;
      if (!this.ctx || this.ambSrcs.length === 0 || !this.on) return;
      const file = CHANTS[Math.floor(Math.random() * CHANTS.length)];
      const buf = this.buffers.get(file);
      if (buf) {
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const g = this.ctx.createGain();
        g.gain.value = 0.4 * (0.6 + this.arousal); // src −28 dB: lands ≈−32 eff
        src.connect(g).connect(this.out());
        src.start();
      }
      this.scheduleChant();
    }, 45000 + Math.random() * 55000);
  }

  private stopAmbience(): void {
    if (!this.ctx || this.ambSrcs.length === 0) return;
    const t = this.ctx.currentTime;
    this.ambGain?.gain.setValueAtTime(this.ambGain.gain.value, t);
    this.ambGain?.gain.linearRampToValueAtTime(0, t + 0.4);
    const srcs = this.ambSrcs;
    setTimeout(() => srcs.forEach((src) => src.stop()), 450);
    this.ambSrcs = [];
    this.ambGain = null;
    if (this.chantTimer) {
      clearTimeout(this.chantTimer);
      this.chantTimer = null;
    }
  }

  play(type: FxSoundType): void {
    if (!this.on) return;
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      // Self-heal (user report "平时没有 amb"): if the bed never started
      // (fetch raced the first enable, tab was suspended...), start it now.
      if (this.ambSrcs.length === 0) this.startAmbience();
      // Fast-forward gate (Phase 89): the frequent layer (passes, touches)
      // fires per sim event — at 8-32× it smears into noise. Big moments
      // (goal, save, whistle) still play.
      if (this.simSpeed > 4 && (type === 'pass' || type === 'touch' || type === 'interception' || type === 'corner')) {
        return;
      }
      let list = SAMPLES[type];
      if (type === 'pass' && list) {
        // Variation pool: one random take per pass, not all at once.
        list = [list[Math.floor(Math.random() * list.length)]];
      }
      if (list && list.some((s) => this.buffers.has(s.file))) {
        for (const s of list) {
          const buf = this.buffers.get(s.file);
          if (!buf) continue;
          const src = this.ctx.createBufferSource();
          src.buffer = buf;
          // ±4% playback-rate jitter so repeated events don't machine-gun.
          src.playbackRate.value = 0.96 + Math.random() * 0.08;
          const g = this.ctx.createGain();
          g.gain.value = s.gain;
          src.connect(g).connect(this.out());
          src.start();
        }
        return;
      }
      this.beepFor(type); // samples not (yet) loaded — the old beeps
    } catch {
      /* sound is best-effort */
    }
  }

  private beepFor(type: FxSoundType): void {
    switch (type) {
      case 'shot':
        this.beep(440, 0.06, 0.06, 'square');
        break;
      case 'save':
        this.beep(170, 0.14, 0.09, 'triangle');
        break;
      case 'interception':
        this.beep(320, 0.05, 0.04, 'triangle');
        break;
      case 'pass':
        this.beep(260, 0.04, 0.03, 'triangle');
        break;
      case 'touch':
        this.beep(210, 0.03, 0.02, 'triangle');
        break;
      case 'corner':
        this.beep(392, 0.09, 0.05, 'triangle');
        break;
      case 'goal':
        this.beep(523, 0.12, 0.09, 'triangle', 0);
        this.beep(659, 0.12, 0.09, 'triangle', 0.11);
        this.beep(784, 0.22, 0.1, 'triangle', 0.22);
        break;
      case 'foul':
        this.beep(2093, 0.07, 0.05, 'square', 0);
        this.beep(2093, 0.1, 0.05, 'square', 0.09);
        break;
      // 'card' stays silent — the whistle already blew.
    }
  }

  private beep(freq: number, dur: number, gain: number, wave: OscillatorType, delay = 0): void {
    const ctx = this.ctx!;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = wave;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.out());
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
}
