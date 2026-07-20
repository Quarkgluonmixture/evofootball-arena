import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { DT } from '../src/sim/constants';
import { Match, type MatchConfig } from '../src/sim/Match';
import type { TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

function makeTeam(name: string, seed: number): TeamInfo {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
}
const cfg = (seed: number, duration = 60): MatchConfig => ({ seed, teamA: makeTeam('A', 1), teamB: makeTeam('B', 2), duration });

describe('possession phase (S0)', () => {
  it('post-step phase is consistent with the ball/match state', () => {
    const m = new Match(cfg(42));
    const seen = new Set<string>();
    while (!m.finished) {
      m.step(DT);
      const pp = m.possessionPhase;
      seen.add(pp.kind);
      if (pp.kind === 'controlled') {
        // controlled ⟺ playing AND the ball has exactly that owner
        expect(m.phase).toBe('playing');
        expect(m.ball.owner).not.toBeNull();
        expect(m.ball.owner!.gid).toBe(pp.gid);
        expect(m.ball.owner!.side).toBe(pp.side);
      } else if (pp.kind === 'contested' || pp.kind === 'loose') {
        // contested/loose ⟺ playing with no owner
        expect(m.phase).toBe('playing');
        expect(m.ball.owner).toBeNull();
      } else {
        // deadBall ⟺ not playing
        expect(m.phase).not.toBe('playing');
      }
    }
    // a full match exercises controlled possession and dead-ball phases
    expect(seen.has('controlled')).toBe(true);
    expect(seen.has('deadBall')).toBe(true);
  });

  it('is deterministic — same seed => identical phase sequence', () => {
    const seq = (): string[] => {
      const m = new Match(cfg(7, 40));
      const out: string[] = [];
      while (!m.finished) {
        m.step(DT);
        out.push(m.possessionPhase.kind);
      }
      return out;
    };
    expect(seq()).toEqual(seq());
  });
});
