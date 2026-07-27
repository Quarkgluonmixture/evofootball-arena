import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { DEFAULT_POLICY, TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * C4 T2-ARRIVAL — the dormant arrival licence's identity pins (contract §4.2).
 *
 * The stage's only unconditional job is that the shipped world does not move,
 * and that the corner machinery it borrows from does not move either.
 */
const team = (name: string, seed: number, wide = false): TeamInfo => {
  const rng = new Rng(seed);
  const genome = randomGenome(rng);
  if (wide) genome.attackingWidth = 0.85;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome, squad: randomSquad(rng),
    ...(wide ? { policy: { crossBase: DEFAULT_POLICY.crossBase * 2.2 } } : {}),
  };
};
type Flags = Partial<{ c4Flight: boolean; c4Arrival: boolean; c4ArrivalReroute: boolean }>;
const matchOf = (seed: number, flags: Flags = {}) =>
  new Match({
    seed,
    teamA: team('A', seed * 2 + 1, true),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
    ...flags,
  });
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const playOut = (m: Match): Match => {
  while (!m.finished) m.step(DT);
  return m;
};

describe('C4 T2-ARRIVAL — the arrival licence is dormant', () => {
  it('X3: the flags default OFF and the licence is null on a fresh Match and a League fixture', () => {
    const m = matchOf(7);
    expect(m.c4Arrival).toBe(false);
    expect(m.c4ArrivalReroute).toBe(false);
    expect(m.teams[0].crossFlight).toBeNull();
    expect(m.teams[1].crossFlight).toBeNull();
    const league = new League({ seed: 20260727 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.c4Arrival).toBe(false);
    expect(live.c4ArrivalReroute).toBe(false);
    expect(live.teams[0].crossFlight).toBeNull();
  });

  it('X3: `c4ArrivalReroute` is INERT without `c4Arrival`', () => {
    // The nesting is structural, not conventional: without the licence there
    // is no `crossFlight` for the re-route to read, so arming the second flag
    // alone must be indistinguishable from arming neither.
    for (const seed of [4242, 90210, 20260727]) {
      const off = playOut(matchOf(seed));
      const rerouteOnly = playOut(matchOf(seed, { c4ArrivalReroute: true }));
      expect(signature(rerouteOnly)).toBe(signature(off));
    }
  });

  it('X3: the flags-off world never writes a licence or a probe trace', () => {
    const m = matchOf(4242);
    let sawLicence = false;
    let sawTrace = false;
    while (!m.finished) {
      m.step(DT);
      if (m.teams[0].crossFlight !== null || m.teams[1].crossFlight !== null) sawLicence = true;
      for (const p of m.allPlayers) if (p.c4Trace !== null) sawTrace = true;
    }
    expect(sawLicence).toBe(false);
    expect(sawTrace).toBe(false);
  });

  it('X3: neither flag is reachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      expect(edsPreviewFlags(mode).c4Arrival).toBeUndefined();
      expect(edsPreviewFlags(mode).c4ArrivalReroute).toBeUndefined();
    }
  });

  it('X6: a corner is never licensed twice — the two crash states are exclusive', () => {
    // The open-play licence arms only when `cornerCrash === null`, so the
    // corner machinery this stage borrows from always owns its own personnel.
    for (const seed of [4242, 90210, 31337]) {
      const m = matchOf(seed, { c4Flight: true, c4Arrival: true, c4ArrivalReroute: true });
      while (!m.finished) {
        m.step(DT);
        for (const t of m.teams) {
          if (t.cornerCrash !== null && t.crossFlight !== null) {
            // Allowed only if the open-play licence was armed FIRST and has
            // already expired; a live pair would be the double licence.
            expect(m.simTime).toBeGreaterThanOrEqual(t.crossFlight.until);
          }
        }
      }
    }
  });

  it('the seam WORKS when armed — the licence survives the delivery', () => {
    // Dormant must not mean broken. Armed, a cross in open play leaves a
    // licence behind it, and somebody is still on MakeRun with NO carrier —
    // which is exactly the state the flags-off world cannot produce.
    let licences = 0;
    let runsWithNoCarrier = 0;
    for (let seed = 4242; seed < 4248; seed++) {
      const m = matchOf(seed, { c4Flight: true, c4Arrival: true, c4ArrivalReroute: true });
      while (!m.finished) {
        m.step(DT);
        const cf = m.teams[0].crossFlight;
        if (cf !== null && m.simTime < cf.until) {
          licences += 1;
          if (m.ball.owner === null) {
            for (const idx of cf.runners) {
              if (m.teams[0].players[idx].action.type === 'MakeRun') runsWithNoCarrier += 1;
            }
          }
        }
      }
    }
    expect(licences).toBeGreaterThan(0);
    expect(runsWithNoCarrier).toBeGreaterThan(0);
  });

  it('the re-route WORKS when armed — a trace is written and it matches its own arithmetic', () => {
    // F2's claim in miniature: the branch computes the meet point and the
    // downstream clamps leave it alone while the ball is in the air.
    let traces = 0;
    for (let seed = 4242; seed < 4248 && traces === 0; seed++) {
      const m = matchOf(seed, { c4Flight: true, c4Arrival: true, c4ArrivalReroute: true });
      while (!m.finished) {
        m.step(DT);
        for (const p of m.allPlayers) {
          const tr = p.c4Trace;
          if (tr === null) continue;
          traces += 1;
          expect(tr.applied.x).toBeCloseTo(tr.meet.x, 12);
          expect(tr.applied.y).toBeCloseTo(tr.meet.y, 12);
        }
      }
    }
    expect(traces).toBeGreaterThan(0);
  });
});
