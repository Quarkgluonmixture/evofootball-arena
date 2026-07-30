import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import type { PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import {
  CELL_FLOOR, EYE_R_M, EYE_W_S, candidateInPower, goingBits, perceivedContextV2,
  priceApproachesV2, type ControlLevels, type GoingConditionedTable, type GoingCell,
} from '../src/ai/stationEye';

/**
 * Stage III V2-P2 — the going-conditioned consumer's seam and selection rule
 * (docs/world-model/STAGE3-V2-P2-CONSUMER.md §2.2/§2.3/§2.4). The pins: the eye is
 * null in production (default-off, OFF bit-identity, ORACLE unreachable); the
 * chooser reads a PERCEIVED going-bit, not truth; the in-flight FACE repair
 * retains only a last-PERCEIVED owner; the going-conditioned argmax is the frozen
 * rule.
 */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const goingCell = (score: number, concede: number, n = 400): GoingCell => ({
  n, score, concede, value: score - concede, underPowered: n < CELL_FLOOR,
});

describe('V2-P2 — the going-conditioned eye is shut in production', () => {
  it('default-off: the eye AND its v2 owner ledger are null/empty on a fresh Match and League', () => {
    const m = matchOf(11);
    expect(m.stationEye).toBeNull();
    expect(m.stationEyeState.size).toBe(0);
    expect(m.stationEyeOwnerLedger.size).toBe(0);
    const league = new League({ seed: 20260728 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.stationEye).toBeNull();
    expect(live.stationEyeOwnerLedger.size).toBe(0);
  });

  it('ORACLE / v2 seam is unreachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      const flags = edsPreviewFlags(mode) as Record<string, unknown>;
      expect(flags.stationEye).toBeUndefined();
    }
  });

  it('OFF bit-identity: a shut eye plays the shipped enriched world, tick for tick', () => {
    for (const seed of [4242, 90210]) {
      const a = matchOf(seed);
      const b = matchOf(seed);
      while (!a.finished) a.step(DT);
      while (!b.finished) { b.stationEye = null; b.step(DT); }
      expect(signature(b)).toBe(signature(a));
      expect(b.stationEyeOwnerLedger.size).toBe(0);
    }
  });
});

describe('V2-P2 — the perceived going-bit (§2.2)', () => {
  it('goingBits fires iff a teammate advanced W lands within R of the ball-local point', () => {
    // candidate r7a0 sits at ball + attackDir*7 in x. A teammate whose advanced
    // position lands ON it → bit 1; a teammate moving away → bit 0.
    const ballX = 0; const ballY = 0; const attackDir = 1;
    const onto = { px: 7 - EYE_W_S * 1, py: 0, vx: 1, vy: 0 };   // advances to x=7 ≈ r7a0
    const away = { px: 7, py: 0, vx: 5, vy: 0 };                  // advances far past
    const near = goingBits(ballX, ballY, attackDir, [onto]);
    const far = goingBits(ballX, ballY, attackDir, [away]);
    expect(near.r7a0).toBe(1);
    expect(far.r7a0).toBe(0);
    // empty motion ⇒ every bit 0 (a teammate with no remembered fix contributes nothing)
    const none = goingBits(ballX, ballY, attackDir, []);
    expect(Object.values(none).every((b) => b === 0)).toBe(true);
  });

  it('percept-not-truth: the bit is computed from the SUPPLIED (perceived) motion', () => {
    // The same geometric slot yields opposite bits under perceived vs "true" motion,
    // proving the eye consumes whatever motion it is handed (the snapshot), not truth.
    const perceived = goingBits(0, 0, 1, [{ px: 7, py: 0, vx: 0, vy: 0 }]); // stationary ON r7a0
    const truthlike = goingBits(0, 0, 1, [{ px: 7, py: 0, vx: 3, vy: 3 }]); // moving away
    expect(perceived.r7a0).toBe(1);
    expect(truthlike.r7a0).toBe(0);
    expect(EYE_R_M).toBe(4.0);
    expect(EYE_W_S).toBe(3.0);
  });
});

describe('V2-P2 — the in-flight FACE repair (§2.3 repair 1)', () => {
  const mkSnap = (ownerGid: number | null): PerceptionSnapshot => ({
    tick: 100, observerGid: 1, awareness: 1,
    ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid, observedTick: 100, ageTicks: 0 },
    players: [],
  });
  const localX = (x: number) => x;
  const ownSide = 0; const ownGid = 1;

  it('a live perceived owner sets the face directly (no retention needed)', () => {
    const ctx = perceivedContextV2(mkSnap(2), ownGid, ownSide, { x: 0, y: 0 }, localX, null);
    expect(ctx).not.toBeNull();
    expect(ctx!.face).toBe('ours');   // gid 2 → side 0 → ours
    expect(ctx!.inflight).toBe(false);
  });

  it('a ball in flight retains the last-PERCEIVED owner and marks inflight', () => {
    const opponent = TEAM_SIZE + 1;    // side 1
    const ctx = perceivedContextV2(mkSnap(null), ownGid, ownSide, { x: 0, y: 0 }, localX, opponent);
    expect(ctx).not.toBeNull();
    expect(ctx!.face).toBe('theirs');  // retained owner is an opponent
    expect(ctx!.inflight).toBe(true);
  });

  it('no live and no retained owner ⇒ abstain (E-ABSTAIN-UNSEEN)', () => {
    expect(perceivedContextV2(mkSnap(null), ownGid, ownSide, { x: 0, y: 0 }, localX, null)).toBeNull();
    // no snapshot at all ⇒ abstain
    expect(perceivedContextV2(null, ownGid, ownSide, { x: 0, y: 0 }, localX, 2)).toBeNull();
  });
});

describe('V2-P2 — the going-conditioned selection rule (§2.4)', () => {
  const context = 'ours|middle|sparse';
  const cells = {
    going0: {
      r7a0: goingCell(0.24, 0.10),   // going0 value 0.14  (+0.04 vs control.going0)
      r14a0: goingCell(0.05, 0.10),  // going0 value −0.05
    },
    going1: {
      r7a0: goingCell(0.05, 0.10),   // going1 value −0.05 (−0.05 vs control.going1)
      r14a0: goingCell(0.30, 0.10),  // going1 value +0.20 (+0.10 vs control.going1)
    },
  };
  const goingTable: GoingConditionedTable = { [context]: cells };
  const control: ControlLevels = {
    [context]: { going0: goingCell(0.20, 0.10), going1: goingCell(0.20, 0.10) }, // value 0.10 each
  };
  const genome = randomGenome(new Rng(5));

  it('candidateInPower requires BOTH going splits at the floor', () => {
    expect(candidateInPower(cells, 'r7a0')).toBe(true);
    const thin = { going0: { x: goingCell(0.5, 0.1) }, going1: { x: goingCell(0.5, 0.1, CELL_FLOOR - 1) } };
    expect(candidateInPower(thin, 'x')).toBe(false);
  });

  it('the argmax follows the PERCEIVED bit: r7a0 when going0, r14a0 when going1', () => {
    // going0 for both candidates ⇒ r7a0 wins (+0.04 > −0.05)
    const g0 = priceApproachesV2(goingTable, control, context, 'neutral', genome, { r7a0: 0, r14a0: 0 });
    expect(g0.kind).toBe('deviate');
    if (g0.kind === 'deviate') {
      expect(g0.candidate.id).toBe('r7a0');
      expect(g0.advantage).toBeCloseTo(0.5 * 0.04, 12);
    }
    // going1 for both ⇒ r14a0 wins (+0.10 > −0.05); r7a0's going1 price is negative
    const g1 = priceApproachesV2(goingTable, control, context, 'neutral', genome, { r7a0: 1, r14a0: 1 });
    expect(g1.kind).toBe('deviate');
    if (g1.kind === 'deviate') expect(g1.candidate.id).toBe('r14a0');
  });

  it('the incumbent wins when every eligible advantage is ≤ 0 (E-TIE, strict)', () => {
    // r7a0 going1 (−0.05) and r14a0 going0 (−0.05): both below control ⇒ tie
    const out = priceApproachesV2(goingTable, control, context, 'neutral', genome, { r7a0: 1, r14a0: 0 });
    expect(out.kind).toBe('tie');
  });

  it('INVERTED takes the argmin — the positive control must hurt', () => {
    const out = priceApproachesV2(goingTable, control, context, 'inverted', genome, { r7a0: 1, r14a0: 0 });
    expect(out.kind).toBe('deviate');
    if (out.kind === 'deviate') expect(out.advantage).toBeLessThan(0);
  });

  it('an unpriced context or missing control ⇒ no override', () => {
    expect(priceApproachesV2(goingTable, control, 'theirs|theirThird|crowded', 'neutral', genome, {}).kind)
      .toBe('noCell');
    expect(priceApproachesV2(goingTable, {}, context, 'neutral', genome, { r7a0: 0 }).kind).toBe('noCell');
  });
});

describe('V2-P2 — the armed seam is deterministic (X7-style)', () => {
  it('two identical v2-armed runs are byte-identical', () => {
    const cells = {
      going0: { r7a0: goingCell(0.30, 0.05), r14a0: goingCell(0.28, 0.05) },
      going1: { r7a0: goingCell(0.30, 0.05), r14a0: goingCell(0.28, 0.05) },
    };
    const build = () => {
      const m = matchOf(7);
      // step to a live moment, then arm the eye on one outfielder body.
      for (let i = 0; i < 400; i++) m.step(DT);
      const owner = m.ball.owner;
      const side = owner ? owner.side : 0;
      const body = m.teams[side].players.find((p) => p.role !== 'GK' && !p.sentOff && p !== owner)!;
      const ctxKeys = ['ours|middle|sparse', 'ours|theirThird|sparse', 'theirs|middle|sparse',
        'ours|ownThird|sparse', 'theirs|theirThird|sparse'];
      const goingTable: GoingConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k, cells]));
      const control: ControlLevels = Object.fromEntries(ctxKeys.map((k) => [k,
        { going0: goingCell(0.20, 0.05), going1: goingCell(0.20, 0.05) }]));
      const clone = cloneSimulationState(m);
      clone.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: body.gid }, table: {}, v2: { goingTable, control } };
      for (let i = 0; i < 200; i++) clone.step(DT);
      clone.stationEye = null;
      return signature(clone);
    };
    expect(build()).toBe(build());
  });
});
