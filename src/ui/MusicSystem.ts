/**
 * BGM (Phase 89) — the user's Suno tracks, context-driven. Three slots so
 * far (title / league / victory); missing slots simply stay silent. Every
 * transition is a 1.2s equal-power crossfade; tracks loop natively via
 * loopStart (the victory track starts at 20s — the author's own cut,
 * encoded in config, not by editing the file). Lazy per-slot loading on
 * the first nonzero volume (the required user gesture); all failures are
 * silent — music is strictly cosmetic.
 */
export type MusicSlot = 'title' | 'league' | 'victory';

// Gains equalize the three masters to the same effective loudness (−16 dB;
// measured RMS: title −15.5, league −12.6, victory −12.2 — victory was the
// hottest source AND carried the biggest gain; Phase 105 mix pass).
const TRACKS: Record<MusicSlot, { file: string; offset: number; gain: number }> = {
  title: { file: 'audio/bgm/music_title.m4a', offset: 0, gain: 0.94 },
  league: { file: 'audio/bgm/music_league.m4a', offset: 0, gain: 0.68 },
  // 用户: "其中一个从20s开始" — the victory track enters at its drop.
  victory: { file: 'audio/bgm/music_victory.m4a', offset: 20, gain: 0.65 },
};

const XFADE = 1.2;

export class MusicSystem {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffers = new Map<MusicSlot, AudioBuffer>();
  private loading = new Set<MusicSlot>();
  private current: { slot: MusicSlot; src: AudioBufferSourceNode; gain: GainNode; mul: number } | null = null;
  private want: MusicSlot | null = null;
  private wantMul = 1;
  private vol = 0;

  get volume(): number {
    return this.vol;
  }

  /** What the system WANTS to be playing (tooling/debug; Phase 105). */
  get state(): { slot: MusicSlot | null; mul: number } {
    return { slot: this.want, mul: this.wantMul };
  }

  set volume(v: number) {
    this.vol = Math.max(0, Math.min(1, v));
    if (this.vol > 0) {
      try {
        this.ctx ??= new AudioContext();
        if (this.ctx.state === 'suspended') void this.ctx.resume();
      } catch {
        return;
      }
      if (this.master && this.ctx) {
        this.master.gain.setTargetAtTime(this.vol, this.ctx.currentTime, 0.05);
      }
      this.apply(); // a slot may have been requested while muted
    } else if (this.current) {
      this.stopCurrent();
    }
  }

  /** Request the context's music; null = fade out. Deduped and mute-safe.
   * `mul` scales the track's gain (Phase 105): the title anthem plays FULL
   * on the launch screen but DUCKED as pause/pre-match music — same track,
   * different presence, smooth retarget without restarting the source. */
  play(slot: MusicSlot | null, mul = 1): void {
    this.want = slot;
    this.wantMul = mul;
    this.apply();
  }

  /** Call from a REAL user gesture (Phase 96, the title screen's enter
   * click): resumes a context that was born suspended by autoplay policy
   * and re-applies the wanted slot. A muted slider still rules — vol 0
   * stays silent. */
  unlock(): void {
    if (!this.visHooked) {
      // iOS suspends the context when the app backgrounds and never wakes
      // it for you (Phase 105, the mobile-silence report).
      this.visHooked = true;
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.ctx?.state === 'suspended') {
          void this.ctx.resume();
        }
      });
    }
    if (this.vol <= 0) return;
    if (!this.ctx) {
      this.volume = this.vol; // creates + resumes via the setter
      return;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    this.apply();
  }

  private visHooked = false;

  private out(): GainNode {
    if (!this.master) {
      this.master = this.ctx!.createGain();
      this.master.gain.value = this.vol;
      this.master.connect(this.ctx!.destination);
    }
    return this.master;
  }

  private apply(): void {
    if (this.vol <= 0 || !this.ctx) return;
    if (this.want === (this.current?.slot ?? null)) {
      // Same track, new presence (Phase 105): retarget the gain smoothly —
      // this is the duck/unduck path, no source restart.
      if (this.current && this.current.mul !== this.wantMul) {
        this.current.mul = this.wantMul;
        this.current.gain.gain.setTargetAtTime(
          TRACKS[this.current.slot].gain * this.wantMul, this.ctx.currentTime, XFADE / 3,
        );
      }
      return;
    }
    if (this.want === null) {
      this.stopCurrent();
      return;
    }
    const slot = this.want;
    const buf = this.buffers.get(slot);
    if (!buf) {
      void this.load(slot);
      return; // apply() re-runs when the fetch lands
    }
    this.stopCurrent();
    const t = TRACKS[slot];
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.loopStart = Math.min(t.offset, buf.duration - 1);
    src.loopEnd = buf.duration;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    g.gain.setTargetAtTime(t.gain * this.wantMul, this.ctx.currentTime, XFADE / 3);
    src.connect(g).connect(this.out());
    src.start(0, src.loopStart);
    this.current = { slot, src, gain: g, mul: this.wantMul };
  }

  private stopCurrent(): void {
    if (!this.ctx || !this.current) return;
    const { src, gain } = this.current;
    gain.gain.setTargetAtTime(0, this.ctx.currentTime, XFADE / 3);
    setTimeout(() => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    }, XFADE * 1000);
    this.current = null;
  }

  private async load(slot: MusicSlot): Promise<void> {
    if (this.loading.has(slot) || this.buffers.has(slot) || !this.ctx) return;
    this.loading.add(slot);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}${TRACKS[slot].file}`);
      this.buffers.set(slot, await this.ctx.decodeAudioData(await res.arrayBuffer()));
      this.apply();
    } catch {
      /* missing/undecodable — the slot stays silent */
    } finally {
      this.loading.delete(slot);
    }
  }
}
