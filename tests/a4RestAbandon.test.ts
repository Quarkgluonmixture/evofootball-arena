import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { formationSpot } from '../src/ai/formations';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * A4-P1b (docs/world-model/A4-P1B-ABANDON-CENSUS.md, ruling #133) — the DORMANT
 * fork-and-abandon seam `Match.abandonRestDesignation` (0|1|null; null in every
 * production path). The pins:
 *   • DEFAULT OFF — null on a fresh Match and a League match.
 *   • FLAG-OFF BYTE-IDENTITY — the shipped enriched world plays tick-for-tick as
 *     HEAD, and the production fingerprint 57b0bdab…c673 is unchanged (X-FP-PROD).
 *     (src IS touched by this step, but the seam is dormant ⇒ zero behaviour
 *     change flag-off; Road B is proven HERE + by the fingerprint, not by an
 *     empty src diff.)
 *   • FLAG-ON EFFECT EXISTENCE — abandoned, the index-1 in-possession clamp stops
 *     binding (the body keeps his ordinary depth) and a full match diverges.
 *   • SIDE-SCOPING — abandoning side 0 vs side 1 change different worlds; the
 *     unabandoned side computes its formation spot bit-for-bit as HEAD.
 * The seam gates BOTH in-possession faces (the PlayerBrain support-fan exclusion
 * + the formations in-possession clamp — the LIVE clamp is emergentStation's,
 * emergentPos defaults ON); the out-of-possession sweeper face is untouched.
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
// the enriched eye-null census world (the A4-P1b world), short duration for the tests.
const matchOf = (seed: number, abandon?: Side): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true,
  ...(abandon !== undefined ? { abandonRestDesignation: abandon } : {}),
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };

describe('A4-P1b — the abandon seam is shut in production (default OFF)', () => {
  it('abandonRestDesignation is null on a fresh Match and on a League match', () => {
    expect(matchOf(11).abandonRestDesignation).toBeNull();
    const league = new League({ seed: 20260802 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.abandonRestDesignation).toBeNull();
  });
});

describe('A4-P1b — FLAG-OFF byte-identity (Road B / X-FP-PROD)', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000); // the 2-season league fingerprint is heavy; override the 20 s global timeout

  it('a match with the seam left null plays tick-for-tick as an independent plain run', () => {
    for (const seed of [7, 4242]) {
      expect(runToEnd(matchOf(seed))).toBe(runToEnd(matchOf(seed)));
    }
  });

  it('formationSpot with abandonRest omitted === abandonRest=false (default is inert)', () => {
    const m = matchOf(7);
    for (let i = 0; i < 300; i++) m.step(DT);
    const t = m.teams[0];
    const opp = m.teams[1];
    const df = t.players.find((p) => p.index === 1 && p.role !== 'GK')!;
    for (const hb of [true, false]) {
      expect(formationSpot(df, t, m.ball, hb, opp))
        .toEqual(formationSpot(df, t, m.ball, hb, opp, false));
    }
  });
});

describe('A4-P1b — FLAG-ON effect existence (the clamp stops binding)', () => {
  it('abandoned, the index-1 in-possession spot differs from the clamped spot on some tick', () => {
    const m = matchOf(7);
    const t = m.teams[0];
    const opp = m.teams[1];
    const df = t.players.find((p) => p.index === 1 && p.role !== 'GK')!;
    let diverged = false;
    let maxGap = 0;
    for (let i = 0; i < 2000 && !m.finished; i++) {
      m.step(DT);
      // the in-possession (hasBall) face: clamped vs abandoned, evaluated on the live state.
      const clamped = formationSpot(df, t, m.ball, true, opp, false);
      const freed = formationSpot(df, t, m.ball, true, opp, true);
      const gap = Math.hypot(clamped.x - freed.x, clamped.y - freed.y);
      if (gap > 1e-9) { diverged = true; maxGap = Math.max(maxGap, gap); }
    }
    expect(diverged).toBe(true); // the clamp binds sometimes ⇒ removing it moves the spot
    expect(maxGap).toBeGreaterThan(0);
  });

  it('a full match with side 0 abandoned DIVERGES from the baseline world', () => {
    const base = runToEnd(matchOf(7));
    const abandoned0 = runToEnd(matchOf(7, 0));
    expect(abandoned0).not.toBe(base);
  });
});

describe('A4-P1b — SIDE-SCOPING (the other side is untouched)', () => {
  it('abandoning side 0 vs side 1 are different worlds, both differ from baseline', () => {
    const base = runToEnd(matchOf(7));
    const abandon0 = runToEnd(matchOf(7, 0));
    const abandon1 = runToEnd(matchOf(7, 1));
    expect(abandon0).not.toBe(base);
    expect(abandon1).not.toBe(base);
    expect(abandon0).not.toBe(abandon1);
  });

  it('the UNABANDONED side computes its formation spot bit-for-bit as HEAD', () => {
    // abandoning side 0 ⇒ side 1's threaded abandonRest is false (=== team.side is false) ⇒
    // side 1's spot is identical to the no-seam spot.
    const m = matchOf(7, 0);
    for (let i = 0; i < 300; i++) m.step(DT);
    const other = m.teams[1];
    const opp = m.teams[0];
    const df1 = other.players.find((p) => p.index === 1 && p.role !== 'GK')!;
    for (const hb of [true, false]) {
      expect(formationSpot(df1, other, m.ball, hb, opp, false))
        .toEqual(formationSpot(df1, other, m.ball, hb, opp));
    }
  });
});
