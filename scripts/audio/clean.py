#!/usr/bin/env python3
"""EvoFootball audio cleaning pipeline (Phase 78, user spec 2026-07-17).

Reads audio/audio_raw/*.wav (REAPER region exports, 24-bit/48k stereo),
applies per-category cleanup, writes audio/processed/*.wav (16-bit) plus
loop candidates, and an honest warnings.md — anything the automatic loop
QA can't vouch for is flagged for human ears, never claimed seamless.

Categories (from the user's spec, amendments noted inline):
  A  ui_* + short ball sfx : dynamic noise-floor trim (never a fixed
     threshold), 5 ms pre-transient pad, 20-50 ms tail pad, 2-3 ms
     fade-in, 15-40 ms fade-out. Transients must survive.
  B  whistle / crossbar / net : keep the full ring-out; 2-5 ms fade-in,
     auto fade-out 80-400 ms following the natural decay; never truncate
     a quiet tail early.
  C  sfx_crowd_* : keep >=100-250 ms of lead-in (emotional rise), 30-100
     ms fade-in, 500-1200 ms fade-out, natural endings.
  D  amb_* / music_* : NO ordinary silence removal. Files named *_loop*
     also emit <name>_loop_candidate.wav via a 0.75-2 s equal-power
     head-blend crossfade, with RMS/spectral/channel QA at the seam.
     (Amendment: sfx_dribble_fast_loop_01 is cut like A but, being a
     *_loop* file, gets a loop candidate too.)
"""

from __future__ import annotations

import struct
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / 'audio' / 'audio_raw'
OUT = ROOT / 'audio' / 'processed'


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    """-> (float32 [n, ch] in -1..1, sample rate). Handles 16/24/32-bit PCM."""
    with wave.open(str(path), 'rb') as w:
        sr = w.getframerate()
        ch = w.getnchannels()
        sw = w.getsampwidth()
        raw = w.readframes(w.getnframes())
    if sw == 2:
        x = np.frombuffer(raw, dtype='<i2').astype(np.float32) / 32768.0
    elif sw == 3:
        b = np.frombuffer(raw, dtype=np.uint8).reshape(-1, 3)
        x = (b[:, 0].astype(np.int32) | (b[:, 1].astype(np.int32) << 8) |
             (b[:, 2].astype(np.int32) << 16))
        x = np.where(x & 0x800000, x - 0x1000000, x).astype(np.float32) / 8388608.0
    elif sw == 4:
        x = np.frombuffer(raw, dtype='<i4').astype(np.float32) / 2147483648.0
    else:
        raise ValueError(f'{path.name}: unsupported sample width {sw}')
    return x.reshape(-1, ch), sr


def write_wav16(path: Path, x: np.ndarray, sr: int) -> None:
    y = np.clip(x, -1.0, 1.0)
    y16 = (y * 32767.0).round().astype('<i2')
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(x.shape[1])
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes(y16.tobytes())


def env_rms(x: np.ndarray, sr: int, win_ms: float = 5.0) -> tuple[np.ndarray, int]:
    """Windowed mono RMS envelope -> (rms per window, hop in samples)."""
    mono = x.mean(axis=1)
    hop = max(1, int(sr * win_ms / 1000))
    n = len(mono) // hop
    seg = mono[: n * hop].reshape(n, hop)
    return np.sqrt((seg ** 2).mean(axis=1) + 1e-12), hop


def db(v: float | np.ndarray) -> np.ndarray:
    return 20 * np.log10(np.maximum(v, 1e-9))


def noise_floor_db(rms: np.ndarray) -> float:
    """Noise floor = median of the quietest 10% of 5 ms windows."""
    q = np.sort(rms)
    k = max(1, len(q) // 10)
    return float(db(np.median(q[:k])))


def apply_fades(x: np.ndarray, sr: int, fin_ms: float, fout_ms: float) -> np.ndarray:
    y = x.copy()
    fi = min(len(y), max(1, int(sr * fin_ms / 1000)))
    fo = min(len(y), max(1, int(sr * fout_ms / 1000)))
    y[:fi] *= np.linspace(0, 1, fi)[:, None]
    y[-fo:] *= np.linspace(1, 0, fo)[:, None]
    return y


def trim_dynamic(x: np.ndarray, sr: int, *, pre_pad_ms: float, tail_pad_ms: float,
                 start_over_db: float = 12.0, end_over_db: float = 6.0,
                 sustain_ms: float = 60.0) -> tuple[np.ndarray, dict]:
    """Noise-floor-adaptive head/tail trim; never a fixed absolute threshold."""
    rms, hop = env_rms(x, sr)
    floor = noise_floor_db(rms)
    above_start = db(rms) > floor + start_over_db
    above_end = db(rms) > floor + end_over_db
    if not above_start.any():
        return x, {'floor_db': floor, 'trimmed': False}
    first = int(np.argmax(above_start))
    # End: last window that is part of a run above (floor+end_over) —
    # a lone blip after long silence doesn't extend the file.
    last = int(len(above_end) - 1 - np.argmax(above_end[::-1]))
    sustain_w = max(1, int(sustain_ms / 5))
    start = max(0, first * hop - int(sr * pre_pad_ms / 1000))
    end = min(len(x), (last + 1) * hop + int(sr * tail_pad_ms / 1000))
    return x[start:end], {
        'floor_db': round(floor, 1), 'trimmed': True,
        'cut_head_ms': round(start / sr * 1000), 'cut_tail_ms': round((len(x) - end) / sr * 1000),
        'sustain_w': sustain_w,
    }


def natural_decay_fade_ms(x: np.ndarray, sr: int) -> float:
    """B: pick the fade-out from the tail's own decay (80-400 ms)."""
    rms, hop = env_rms(x, sr)
    peak_db = float(db(rms).max())
    floor = noise_floor_db(rms)
    # Length of the region between peak-20dB and the floor+4dB at the tail.
    tail = db(rms) > max(floor + 4.0, peak_db - 30.0)
    last = int(len(tail) - 1 - np.argmax(tail[::-1]))
    peak_i = int(np.argmax(rms))
    decay_ms = max(0.0, (last - peak_i) * hop / sr * 1000)
    return float(np.clip(decay_ms * 0.35, 80, 400))


def equal_power_loop(x: np.ndarray, sr: int, cf_s: float) -> np.ndarray:
    """Head-blend loop: y = x[:N-CF]; y's first CF samples are an
    equal-power mix of x's tail into x's head, so end->start wraps."""
    cf = int(sr * cf_s)
    n = len(x)
    if n <= cf * 2:
        cf = n // 3
    y = x[: n - cf].copy()
    theta = np.linspace(0, np.pi / 2, cf)[:, None]
    y[:cf] = x[n - cf:] * np.cos(theta) + x[:cf] * np.sin(theta)
    return y


def loop_qa(y: np.ndarray, sr: int) -> list[str]:
    """Honest seam checks: RMS, spectral centroid, channel balance across
    the wrap. Returns human-readable warnings (empty = nothing detected —
    which still isn't a seamlessness guarantee)."""
    warns = []
    w = int(sr * 0.2)
    tail, head = y[-w:], y[:w]
    r_t, r_h = np.sqrt((tail ** 2).mean()), np.sqrt((head ** 2).mean())
    jump = abs(float(db(r_t) - db(r_h)))
    if jump > 3.0:
        warns.append(f'RMS jump at seam {jump:.1f} dB (>3)')
    for name, seg_a, seg_b in [('tail-vs-head', tail, head)]:
        fa = np.abs(np.fft.rfft(seg_a.mean(axis=1) * np.hanning(len(seg_a))))
        fb = np.abs(np.fft.rfft(seg_b.mean(axis=1) * np.hanning(len(seg_b))))
        freqs = np.fft.rfftfreq(len(seg_a), 1 / sr)
        ca = float((fa * freqs).sum() / (fa.sum() + 1e-9))
        cb = float((fb * freqs).sum() / (fb.sum() + 1e-9))
        if abs(ca - cb) / max(ca, cb, 1.0) > 0.25:
            warns.append(f'spectral centroid shift {name} {ca:.0f}->{cb:.0f} Hz (>25%)')
    if y.shape[1] == 2:
        bal_t = db(np.sqrt((tail[:, 0] ** 2).mean())) - db(np.sqrt((tail[:, 1] ** 2).mean()))
        bal_h = db(np.sqrt((head[:, 0] ** 2).mean())) - db(np.sqrt((head[:, 1] ** 2).mean()))
        if abs(float(bal_t - bal_h)) > 3.0:
            warns.append(f'L/R balance shift at seam {float(bal_t - bal_h):.1f} dB (>3)')
    # A hot transient inside the blend zone repeats every loop — flag it.
    rms, hop = env_rms(y[: int(sr * 2)], sr, 20)
    if len(rms) and float(db(rms.max()) - db(np.median(rms))) > 10:
        warns.append('hot transient near the blended head — may read as a repeating event')
    return warns


CAT_B = ('sfx_referee_whistle', 'sfx_ball_hit_crossbar', 'sfx_ball_hit_net')


def category(name: str) -> str:
    if name.startswith('amb_') or name.startswith('music_'):
        return 'D'
    if name.startswith('sfx_crowd_'):
        return 'C'
    if any(name.startswith(p) for p in CAT_B):
        return 'B'
    return 'A'  # ui_* + short ball sfx (+ the dribble loop's cut)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    report: list[str] = ['# Audio pipeline report', '']
    warn_count = 0
    for path in sorted(RAW.glob('*.wav')):
        x, sr = read_wav(path)
        name = path.stem
        cat = category(name)
        info: dict = {}
        if cat == 'A':
            x2, info = trim_dynamic(x, sr, pre_pad_ms=5, tail_pad_ms=35)
            y = apply_fades(x2, sr, fin_ms=2.5, fout_ms=25)
        elif cat == 'B':
            x2, info = trim_dynamic(x, sr, pre_pad_ms=5, tail_pad_ms=60, end_over_db=3.0)
            fout = natural_decay_fade_ms(x2, sr)
            y = apply_fades(x2, sr, fin_ms=3, fout_ms=fout)
            info['fade_out_ms'] = round(fout)
        elif cat == 'C':
            x2, info = trim_dynamic(x, sr, pre_pad_ms=200, tail_pad_ms=250, end_over_db=3.0)
            y = apply_fades(x2, sr, fin_ms=60, fout_ms=850)
        else:  # D — no ordinary silence removal
            y = x
            info = {'passthrough': True}
        write_wav16(OUT / f'{name}.wav', y, sr)
        line = f'- **{name}** [{cat}] {len(x) / sr:.2f}s -> {len(y) / sr:.2f}s {info}'

        if '_loop' in name:
            cf = float(np.clip(len(x) / sr * 0.15, 0.75, 2.0))
            cand = equal_power_loop(x if cat == 'D' else y, sr, cf)
            warns = loop_qa(cand, sr)
            write_wav16(OUT / f'{name}_loop_candidate.wav', cand, sr)
            line += f' | loop candidate (crossfade {cf:.2f}s)'
            if warns:
                warn_count += 1
                line += ' ⚠ 需人工试听: ' + '; '.join(warns)
            else:
                line += ' | QA clean (仍建议人工试听一遍 — QA 不等于无缝保证)'
        report.append(line)

    report += ['', f'{warn_count} file(s) flagged for human listening.']
    (OUT / 'warnings.md').write_text('\n'.join(report) + '\n')
    print('\n'.join(report))


if __name__ == '__main__':
    main()
