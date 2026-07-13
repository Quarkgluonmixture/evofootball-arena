import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { momentWindow, pickHighlights } from '../src/replay/highlights';
import { ReplayBuffer } from '../src/replay/ReplayBuffer';
import { DT, MATCH_DURATION } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type MatchEvent, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * Phase 33 — the highlight reel's data layer. The reel is presentation only:
 * it picks recorded moments (pure) and replays ReplayBuffer frames. What must
 * hold: the picker's cap/ordering rules, and frame identity — the same
 * recorded match serves the exact same interpolated states every time.
 */

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const ev = (type: MatchEvent['type'], t: number): MatchEvent => ({
  t, minute: Math.round(t / 60), type, side: 0, text: type,
});

describe('pickHighlights (pure)', () => {
  it('keeps goals over saves, chronological, capped', () => {
    const events = [
      ev('save', 10), ev('goal', 20), ev('save', 30), ev('goal', 40),
      ev('save', 50), ev('goal', 60), ev('goal', 70), ev('goal', 80),
    ];
    const picked = pickHighlights(events, -1, 4);
    // Five goals fight for four slots: the newest survive, saves drop.
    expect(picked.map((e) => e.type)).toEqual(['goal', 'goal', 'goal', 'goal']);
    expect(picked.map((e) => e.t)).toEqual([40, 60, 70, 80]);
  });

  it('newest goals survive the cap; saves fill spare room; minT excludes the shown half', () => {
    const events = [ev('goal', 10), ev('goal', 20), ev('goal', 30), ev('goal', 40), ev('goal', 50)];
    expect(pickHighlights(events, -1, 4).map((e) => e.t)).toEqual([20, 30, 40, 50]);
    const sparse = [ev('goal', 15), ev('save', 25), ev('save', 35)];
    expect(pickHighlights(sparse, -1, 4).map((e) => e.type)).toEqual(['goal', 'save', 'save']);
    expect(pickHighlights(sparse, 20, 4).map((e) => e.t)).toEqual([25, 35]); // H1 already shown
    expect(pickHighlights([], -1)).toEqual([]);
  });

  it('momentWindow clamps to the recorded range and slows the drama', () => {
    const w = momentWindow(ev('goal', 100), [95, 200]);
    expect(w.from).toBe(97); // 100 − 3
    expect(w.to).toBe(101.5);
    expect(w.speed).toBe(0.5);
    const early = momentWindow(ev('goal', 1), [0, 200]);
    expect(early.from).toBe(0); // clamped lead-in
  });
});

describe('reel frame identity', () => {
  const record = (seed: number) => {
    const m = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
    });
    const buffer = new ReplayBuffer();
    while (!m.finished) {
      m.step(DT);
      buffer.maybeRecord(m);
    }
    return { m, buffer };
  };

  it('replays identical frames: same recording, same sample times, same states', () => {
    const { m, buffer } = record(4);
    const goals = m.events.filter((e) => e.type === 'goal');
    expect(buffer.hasContent).toBe(true);
    const range = buffer.range()!;
    const samples = (goals.length > 0 ? goals : m.events.filter((e) => e.type === 'shot')).slice(0, 3);
    for (const g of samples) {
      const w = momentWindow(g, range);
      for (const t of [w.from, (w.from + w.to) / 2, w.to]) {
        const a = buffer.stateAt(t);
        const b = buffer.stateAt(t); // reading is pure — byte-identical
        expect(a).toBeTruthy();
        expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      }
    }
  });

  it('two identical watched matches record identical reel frames', () => {
    const a = record(6);
    const b = record(6);
    const goalsA = a.m.events.filter((e) => e.type === 'goal');
    const goalsB = b.m.events.filter((e) => e.type === 'goal');
    expect(goalsA.map((e) => e.t)).toEqual(goalsB.map((e) => e.t));
    const range = a.buffer.range()!;
    for (const g of goalsA.slice(0, 2)) {
      const w = momentWindow(g, range);
      expect(JSON.stringify(a.buffer.stateAt(w.from))).toBe(JSON.stringify(b.buffer.stateAt(w.from)));
      expect(JSON.stringify(a.buffer.stateAt(w.to))).toBe(JSON.stringify(b.buffer.stateAt(w.to)));
    }
  });
});
