/**
 * Optional event sounds — tiny generated WebAudio tones, no assets.
 * OFF by default; toggled from the left panel. Failures (no AudioContext,
 * autoplay policy) are swallowed silently: sound is strictly cosmetic.
 */
export type FxSoundType = 'goal' | 'save' | 'shot' | 'interception' | 'corner' | 'foul' | 'card';

export class SoundFx {
  enabled = false;
  private ctx: AudioContext | null = null;

  play(type: FxSoundType): void {
    if (!this.enabled) return;
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
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
        case 'corner':
          this.beep(392, 0.09, 0.05, 'triangle');
          break;
        case 'goal':
          this.beep(523, 0.12, 0.09, 'triangle', 0);
          this.beep(659, 0.12, 0.09, 'triangle', 0.11);
          this.beep(784, 0.22, 0.1, 'triangle', 0.22);
          break;
        case 'foul':
          // The referee's whistle (Phase 75): a short high double-trill.
          this.beep(2093, 0.07, 0.05, 'square', 0);
          this.beep(2093, 0.1, 0.05, 'square', 0.09);
          break;
        // 'card' stays silent — the whistle already blew for the foul.
      }
    } catch {
      /* sound is best-effort */
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
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
}
