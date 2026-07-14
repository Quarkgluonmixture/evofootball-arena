import { describe, expect, it } from 'vitest';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { updateTeamBrain } from '../src/ai/TeamBrain';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { DT, MATCH_DURATION } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * Phase 34 — the combination pack. Each pattern gets a §10.5 directional
 * harness: a genome built FOR the pattern must produce measurably more of it
 * than a genome built against it, side-balanced across seeds. The calibrate
 * economy (goals/shots) was verified separately across two seeds — these
 * tests pin the DIRECTION, not the volume.
 */

const flat = (v: number, over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = v;
  return { ...g, ...over };
};
const team = (name: string, seed: number, g: TacticalGenome, policy?: TeamInfo['policy']): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: g,
    squad: randomSquad(rng),
    policy,
  };
};

/** Subject-vs-neutral, side-balanced; returns the subject's summed stat. */
function harvest(
  g: TacticalGenome,
  stat: (s: import('../src/sim/types').TeamMatchStats) => number,
  seeds = 24,
  policy?: TeamInfo['policy'],
): number {
  let total = 0;
  for (let seed = 0; seed < seeds; seed++) {
    const home = seed % 2 === 0;
    const subject = team('S', 1000 + seed, g, policy);
    const neutral = team('N', 2000 + seed, flat(0.5));
    const m = new Match({
      seed,
      teamA: home ? subject : neutral,
      teamB: home ? neutral : subject,
      duration: MATCH_DURATION,
    });
    const res = m.runToCompletion();
    total += stat(res.stats[home ? 0 : 1]);
  }
  return total;
}

describe('2过1 — the wall pass (Phase 34)', () => {
  it('high tempo+passBias sides complete one-twos; slow sides are gated out', { timeout: 480000 }, () => {
    // Pool 24 → 48 seeds (Phase 47): the attribute split halved the
    // specialist completion rate (~0.5 → ~0.2/match — MF first touch lost
    // its role bias) and 24 seeds landed 5 vs the old floor 6. Deterministic
    // zero is mentality-safe here: max boosted tempo = 0.15+0.1+0.03 = 0.28
    // ⇒ gate (0.28+0.15)/2 = 0.215 < 0.35 even in a trailing endgame.
    const high = harvest(flat(0.5, { tempo: 0.85, passBias: 0.85 }), (s) => s.oneTwos, 48);
    const low = harvest(flat(0.5, { tempo: 0.15, passBias: 0.15 }), (s) => s.oneTwos, 48);
    expect(low).toBe(0);
    expect(high).toBeGreaterThanOrEqual(6);
  });
});

describe('third man — the bounce (Phase 34)', () => {
  it('possession genes release the third man far more often', { timeout: 240000 }, () => {
    const high = harvest(flat(0.5, { passBias: 0.85 }), (s) => s.thirdMan);
    const low = harvest(flat(0.5, { tempo: 0.15, passBias: 0.15 }), (s) => s.thirdMan);
    // Probed ~5/match vs ~2/match — direction with margin, not a knife edge.
    expect(high).toBeGreaterThan(low * 1.4);
    expect(high).toBeGreaterThanOrEqual(48); // ~2/match floor: the shape must be common for the specialist
  });
});

describe('套边 — the overlap (Phase 34)', () => {
  it('wide sides complete overlaps; narrow sides never even license one', { timeout: 480000 }, () => {
    const wide = harvest(flat(0.5, { attackingWidth: 0.85 }), (s) => s.overlaps, 48);
    const narrow = harvest(flat(0.5, { attackingWidth: 0.15 }), (s) => s.overlaps, 48);
    // The license gate is deterministic: width 0.15 < 0.3 ⇒ never granted.
    expect(narrow).toBe(0);
    // Structurally rare in 6v6 (no wing-backs) — probed ~0.13/match; alive ≥ 2/48.
    expect(wide).toBeGreaterThanOrEqual(2);
  });
});

/**
 * Phase 45 — combo appetites are POLICY GENES. Same genome, different evolved
 * policy ⇒ different 套路 identity. The gate flips are deterministic (the
 * appetite multiplies the gene score before the threshold); the third-man
 * bonus is a score multiplier, pinned directionally.
 */
describe('combo policy genes (Phase 45)', () => {
  it('wallPassW flips the one-two license on the SAME genome', { timeout: 480000 }, () => {
    // Genes 0.5/0.5 (not 0.6 — Phase 35 mentality floats a trailing side's
    // tempo up to +0.1+0.2·passBias, and 0.6 genes could cross the averse
    // gate at 0.355 in an endgame chase): averse max (0.7+0.5)/2·0.5 = 0.30
    // < 0.35 ⇒ deterministic zero; hungry 0.5·1.7 = 0.85 ⇒ licensed.
    const g = flat(0.5);
    const hungry = harvest(g, (s) => s.oneTwos, 24, { wallPassW: 1.7 });
    const averse = harvest(g, (s) => s.oneTwos, 24, { wallPassW: 0.5 });
    expect(averse).toBe(0);
    expect(hungry).toBeGreaterThanOrEqual(1);
  });

  it('overlapW gates the overlap license on the SAME genome (unit level)', () => {
    // The harvest version pinned a "deterministic zero" that Phase 35
    // mentality quietly broke (a trailing side's width floats +0.15·u and a
    // boundary width re-crosses the gate late). Pin the GATE itself: one
    // staged confrontation, only the policy differs, score level (raw genes).
    const license = (overlapW: number): number | null => {
      const m = new Match({
        seed: 5,
        teamA: team('S', 1000, flat(0.5, { attackingWidth: 0.58 }), { overlapW }),
        teamB: team('N', 2000, flat(0.5)),
        duration: 120,
      });
      while (m.phase !== 'playing') m.step(DT);
      const t0 = m.teams[0];
      const carrier = t0.players[4]; // WGR, wide right in the attacking half
      carrier.pos = { x: 8, y: 14 };
      m.ball.owner = carrier;
      m.ball.pos = { x: 8.5, y: 14 };
      m.possessionSide = 0;
      m.pendingPass = null;
      t0.players[3].pos = { x: 0, y: 10 }; // the trailing same-wing mate
      m.teams[1].players[1].pos = { x: 11, y: 14 }; // the confronter, goal-side
      t0.overlapper = null;
      t0.runners.clear();
      t0.arriver = null;
      updateTeamBrain(t0, m);
      return t0.overlapper;
    };
    expect(license(1.7)).not.toBeNull(); // 0.58·1.7 crosses the 0.3 gate
    expect(license(0.5)).toBeNull(); // 0.58·0.5 = 0.29 stays under
  });

  it('thirdManW widens the bounce acceptance region (deterministic sweep)', { timeout: 60000 }, () => {
    // The appetite multiplies the bounce score (×1.36 vs ×1.12 at passBias
    // 0.7) — a marginal per-decision lever, so per-match counts are noise
    // at test sizes (probed: 135 vs 127 over 24 matches). Test the
    // MECHANISM instead: one fresh-receiver scene, a defender swept across
    // the bounce lane — the hungry policy must release the runner in a
    // strictly wider band of scenes. Deterministic: no rng between setups.
    const g = flat(0.5, { passBias: 0.7 });
    const picks = (thirdManW: number): number => {
      let n = 0;
      for (let k = 0; k < 40; k++) {
        const m = new Match({
          seed: 5,
          teamA: team('S', 1000, g, { thirdManW }),
          teamB: team('N', 2000, flat(0.5)),
          duration: 120,
        });
        while (m.phase !== 'playing') m.step(DT);
        const t0 = m.teams[0];
        const carrier = t0.players[2]; // MF — the fresh receiver (B)
        const runner = t0.players[5]; // ST bursting ahead (C)
        const safe = t0.players[3]; // the square outlet
        carrier.pos = { x: 5, y: 0 };
        m.ball.owner = carrier;
        m.ball.pos = { x: 5.6, y: 0 };
        m.possessionSide = 0;
        m.pendingPass = null;
        m.lastCompletedPass = { passerGid: t0.players[1].gid, receiverGid: carrier.gid, t: m.simTime - 0.3 };
        runner.pos = { x: 15, y: 2 };
        runner.action = { type: 'MakeRun', scores: [] };
        safe.pos = { x: 2, y: -10 };
        safe.action = { type: 'SupportBallCarrier', scores: [] };
        t0.players[4].pos = { x: -20, y: 15 }; // out of the scene
        const opp = m.teams[1];
        opp.players[1].pos = { x: 35, y: -15 }; // deep line: the runner is onside
        opp.players[2].pos = { x: 35, y: 15 };
        opp.players[3].pos = { x: 3.5, y: 0 }; // the presser at the carrier's back
        opp.players[4].pos = { x: 11, y: -4 + k * 0.3 }; // sweeps the bounce lane
        opp.players[5].pos = { x: -25, y: 0 };
        decidePlayer(carrier, m);
        const a = carrier.action;
        if ((a.type === 'Pass' || a.type === 'ThroughBall') && a.targetIdx === runner.gid) n++;
      }
      return n;
    };
    const hungry = picks(1.7);
    const averse = picks(0.5);
    // Measured at build time: hungry 29 vs averse 26 — three marginal
    // scenes flip. Small per decision, compounding over a season.
    expect(hungry).toBeGreaterThan(averse);
    expect(averse).toBeGreaterThanOrEqual(1); // the averse side still plays SOME bounces
  });
});
