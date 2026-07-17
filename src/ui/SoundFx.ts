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
  | 'pass' | 'touch';

/** Sample file(s) + gain per event; arrays play together (net + crowd). */
const SAMPLES: Partial<Record<FxSoundType, Array<{ file: string; gain: number }>>> = {
  shot: [{ file: 'sfx_kick_power_01.m4a', gain: 0.8 }],
  goal: [
    { file: 'sfx_ball_hit_net_01.m4a', gain: 0.9 },
    { file: 'sfx_crowd_goal_celebration_01.m4a', gain: 0.85 },
  ],
  save: [
    { file: 'sfx_keeper_save_01.m4a', gain: 0.9 },
    { file: 'sfx_crowd_applause_01.m4a', gain: 0.5 },
  ],
  interception: [{ file: 'sfx_touch_heavy_01.m4a', gain: 0.7 }],
  pass: [
    { file: 'sfx_pass_short_02-001.m4a', gain: 0.55 },
    { file: 'sfx_pass_short_02-002.m4a', gain: 0.55 },
  ],
  touch: [{ file: 'sfx_touch_heavy_01.m4a', gain: 0.35 }],
  corner: [{ file: 'sfx_pass_short_02-001.m4a', gain: 0.7 }],
  foul: [{ file: 'sfx_referee_whistle_01.m4a', gain: 0.55 }],
  // card: silent — the whistle already blew for the foul.
};

const AMBIENCE = { file: 'amb_stadium_crowd_low_loop_01.wav', gain: 0.22 };

export class SoundFx {
  private ctx: AudioContext | null = null;
  private buffers = new Map<string, AudioBuffer>();
  private loading = false;
  private ambSrc: AudioBufferSourceNode | null = null;
  private ambGain: GainNode | null = null;
  private master: GainNode | null = null;
  private on = false;
  private vol = 0.8;

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
      const files = new Set<string>([AMBIENCE.file]);
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

  /** The stadium bed: the QA'd seamless-loop candidate, WAV (AAC's encoder
   * priming would click at the loop point), low in the mix. */
  private startAmbience(): void {
    if (!this.ctx || this.ambSrc || !this.buffers.has(AMBIENCE.file)) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffers.get(AMBIENCE.file)!;
    src.loop = true;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    g.gain.linearRampToValueAtTime(AMBIENCE.gain, this.ctx.currentTime + 1.2);
    src.connect(g).connect(this.out());
    src.start();
    this.ambSrc = src;
    this.ambGain = g;
  }

  private stopAmbience(): void {
    if (!this.ctx || !this.ambSrc) return;
    const t = this.ctx.currentTime;
    this.ambGain?.gain.setValueAtTime(this.ambGain.gain.value, t);
    this.ambGain?.gain.linearRampToValueAtTime(0, t + 0.4);
    const src = this.ambSrc;
    setTimeout(() => src.stop(), 450);
    this.ambSrc = null;
    this.ambGain = null;
  }

  play(type: FxSoundType): void {
    if (!this.on) return;
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      // Self-heal (user report "平时没有 amb"): if the bed never started
      // (fetch raced the first enable, tab was suspended...), start it now.
      if (!this.ambSrc) this.startAmbience();
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
