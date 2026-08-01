import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { BOX_WIDTH, DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  EYE_LATTICE, newStationEyeTrace, type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';
import {
  LINE_STALE_TICKS, OFFSIDE_EPS, SUPPORT_STALE_TICKS, WIDE_EDGE, WIDTH_STALE_TICKS,
  beyondLineBit, evaluateInSupport, isInSupport, perceivedOffsideLine, widthHeldBit,
} from '../src/ai/eyeContextBitsV4';
import type { ObservedBall, ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';

/**
 * Stage III V4-P3-PARTIAL (P3p-0) — the DORMANT flag-gated seams: the in-support
 * law (§2) + the two S bits (§3), gated behind `eye.v4` (default OFF).
 * docs/world-model/STAGE3-V4-P3-PARTIAL.md, rulings #110/#111. The pins:
 * default-off + FLAG-OFF BIT-IDENTITY (X-OFF-IDENT, X-FP-PROD); the two bits are
 * OBSERVABILITY-ONLY at P3p-0 (bit flags on ⇒ trace moves but the sim is
 * byte-identical); every gate is an EXPLICIT `=== true` opt-in (ruling #75);
 * the percept functions are pure and tri-state (UNKNOWN, never a silent default).
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

const roleCell = (score: number, concede: number, n = 400): RoleCell => ({
  n, score, concede, value: score - concede, underPowered: false,
});
// A v3 table + control that favour one candidate per role, control below all.
const ctxKeys = [
  'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
  'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
  'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
  'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
];
const fav: Record<Role, string> = { GK: 'r7a0', DF: 'r7a0', MF: 'r14a180', WG: 'r21a300', ST: 'r21a60' };
const columnFor = (favId: string): Record<string, RoleCell> =>
  Object.fromEntries(EYE_LATTICE.map((c) => [c.id, roleCell(c.id === favId ? 0.40 : 0.02, 0.05)]));
const roleTable: RoleConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: columnFor(fav.DF), MF: columnFor(fav.MF), WG: columnFor(fav.WG), ST: columnFor(fav.ST),
}]));
const control: RoleControlLevels = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: roleCell(0.10, 0.05), MF: roleCell(0.10, 0.05), WG: roleCell(0.10, 0.05), ST: roleCell(0.10, 0.05),
}]));

type V4Flags = { inSupportLaw?: boolean; deliveryBit?: boolean; offsideBit?: boolean };
/** Warm a match, arm a both-scope v3 eye (optionally with v4 + a trace), run on. */
const runV3 = (v4?: V4Flags) => {
  const m = matchOf(7);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  const trace = newStationEyeTrace();
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control },
    ...(v4 ? { v4 } : {}), trace,
  };
  for (let i = 0; i < 200; i++) clone.step(DT);
  const sig = signature(clone);
  clone.stationEye = null;
  return { sig, trace };
};

describe('V4-P3p-0 — the v4 seam is shut in production (default OFF)', () => {
  it('the eye and every v4 flag are null/absent on a fresh Match and League', () => {
    const m = matchOf(11);
    expect(m.stationEye).toBeNull();
    const league = new League({ seed: 20260801 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.stationEye).toBeNull();
  });

  it('X3: the v4 seam is unreachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      const flags = edsPreviewFlags(mode) as Record<string, unknown>;
      expect(flags.stationEye).toBeUndefined();
    }
  });

  it('X-FP-PROD / OFF bit-identity: a shut eye plays the shipped enriched world tick-for-tick', () => {
    for (const seed of [4242, 90210]) {
      const a = matchOf(seed);
      const b = matchOf(seed);
      while (!a.finished) a.step(DT);
      while (!b.finished) { b.stationEye = null; b.step(DT); }
      expect(signature(b)).toBe(signature(a));
    }
  });
});

describe('V4-P3p-0 — X-OFF-IDENT: the v4 flags are inert when absent/false', () => {
  it('an armed v3 eye with NO v4, with empty v4, and with all-false v4 are byte-identical', () => {
    const base = runV3();
    const emptyV4 = runV3({});
    const falseV4 = runV3({ inSupportLaw: false, deliveryBit: false, offsideBit: false });
    expect(emptyV4.sig).toBe(base.sig);
    expect(falseV4.sig).toBe(base.sig);
    // absent/false flags NEVER write a v4 counter
    for (const t of [base.trace, emptyV4.trace, falseV4.trace]) {
      const sum = t.v4InSupport + t.v4OosPhase + t.v4OosUnseen + t.v4OosInflight + t.v4OosStale
        + t.v4WidthHeld0 + t.v4WidthHeld1 + t.v4WidthHeldUnknown
        + t.v4BeyondLine0 + t.v4BeyondLine1 + t.v4BeyondLineUnknown;
      expect(sum).toBe(0);
    }
    // sanity: the v3 eye actually decided something on this corpus
    expect(base.trace.decisions).toBeGreaterThan(0);
  });
});

describe('V4-P3p-0 — the two S bits are OBSERVABILITY-ONLY (sim byte-identical, trace moves)', () => {
  it('deliveryBit + offsideBit on ⇒ same signature as off, but the tri-state counters fire', () => {
    const off = runV3();
    const bits = runV3({ deliveryBit: true, offsideBit: true });
    expect(bits.sig).toBe(off.sig);                       // pure observability, no divergence
    const widthReads = bits.trace.v4WidthHeld0 + bits.trace.v4WidthHeld1 + bits.trace.v4WidthHeldUnknown;
    const lineReads = bits.trace.v4BeyondLine0 + bits.trace.v4BeyondLine1 + bits.trace.v4BeyondLineUnknown;
    expect(widthReads).toBeGreaterThan(0);                // the delivery bit is READ at its point
    expect(lineReads).toBeGreaterThan(0);                 // the offside bit is READ, per candidate
    // the offside bit is per-CANDIDATE: 18 reads per in-support priced decision
    expect(lineReads % EYE_LATTICE.length).toBe(0);
  });
});

describe('V4-P3p-0 — the in-support law is READ at its actionExecutor point (X-SEAM)', () => {
  it('law on ⇒ the four E-OOS classes + IN_SUPPORT are tallied over a live corpus', () => {
    const { trace } = runV3({ inSupportLaw: true });
    const oos = trace.v4OosPhase + trace.v4OosUnseen + trace.v4OosInflight + trace.v4OosStale;
    // the ~46% out-of-support surface (P0b) guarantees some abstention over 200 ticks,
    // and some in-support consultation too — the law classifies both, none silently.
    expect(oos).toBeGreaterThan(0);
    expect(trace.v4InSupport).toBeGreaterThan(0);
  });
});

// --- pure-function unit tests (the frozen definitions) -----------------------
const obsBall = (ownerGid: number | null, ageTicks: number, x = 0, y = 0): ObservedBall =>
  ({ pos: { x, y }, vel: { x: 0, y: 0 }, ownerGid, observedTick: 0, ageTicks });
const obsPlayer = (gid: number, side: 0 | 1, x: number, y: number, ageTicks: number): ObservedPlayer =>
  ({ gid, side, pos: { x, y }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, observedTick: 0, ageTicks });
const snapOf = (ball: ObservedBall | null, players: ObservedPlayer[]): PerceptionSnapshot =>
  ({ tick: 0, observerGid: 1, awareness: 1, ball, players });
const idX = (x: number): number => x; // side 0, attackDir +1 ⇒ localX is the identity

describe('V4-P3p-0 §2 — evaluateInSupport (percept-honest, four named abstentions)', () => {
  it('phase ≠ playing ⇒ E-OOS-PHASE regardless of the ball', () => {
    expect(evaluateInSupport(snapOf(obsBall(2, 0), []), false)).toBe('E-OOS-PHASE');
  });
  it('no ball percept ⇒ E-OOS-UNSEEN', () => {
    expect(evaluateInSupport(null, true)).toBe('E-OOS-UNSEEN');
    expect(evaluateInSupport(snapOf(null, []), true)).toBe('E-OOS-UNSEEN');
  });
  it('a perceived loose / in-flight ball ⇒ E-OOS-INFLIGHT', () => {
    expect(evaluateInSupport(snapOf(obsBall(null, 0), []), true)).toBe('E-OOS-INFLIGHT');
  });
  it('a stale perceived owner (age > SUPPORT_STALE_TICKS) ⇒ E-OOS-STALE', () => {
    expect(evaluateInSupport(snapOf(obsBall(2, SUPPORT_STALE_TICKS + 1), []), true)).toBe('E-OOS-STALE');
  });
  it('a FRESH live perceived owner (age ≤ 30) ⇒ IN_SUPPORT', () => {
    expect(evaluateInSupport(snapOf(obsBall(2, 0), []), true)).toBe('IN_SUPPORT');
    expect(evaluateInSupport(snapOf(obsBall(2, SUPPORT_STALE_TICKS), []), true)).toBe('IN_SUPPORT');
    expect(isInSupport(evaluateInSupport(snapOf(obsBall(2, 0), []), true))).toBe(true);
  });
});

describe('V4-P3p-0 §3.1 — widthHeldBit (per-MOMENT, tri-state)', () => {
  it('a fresh own-side outfield teammate wide in the attacking half ⇒ 1', () => {
    const snap = snapOf(obsBall(1, 0), [obsPlayer(3, 0, 10, WIDE_EDGE + 1, 0)]);
    expect(widthHeldBit(snap, 1, 0, idX)).toBe(1);
  });
  it('the attacking half freshly seen but nobody wide ⇒ 0 (a genuine reading)', () => {
    const snap = snapOf(obsBall(1, 0), [obsPlayer(3, 0, 10, WIDE_EDGE - 1, 0)]);
    expect(widthHeldBit(snap, 1, 0, idX)).toBe(0);
  });
  it('no fresh own-side percept of the attacking half ⇒ UNKNOWN (E-ABSTAIN-WIDTH-STALE)', () => {
    expect(widthHeldBit(null, 1, 0, idX)).toBe('UNKNOWN');
    // wide teammate but STALE
    expect(widthHeldBit(snapOf(obsBall(1, 0), [obsPlayer(3, 0, 10, WIDE_EDGE + 1, WIDTH_STALE_TICKS + 1)]), 1, 0, idX))
      .toBe('UNKNOWN');
    // wide teammate but in the OWN half (localX < 0)
    expect(widthHeldBit(snapOf(obsBall(1, 0), [obsPlayer(3, 0, -10, WIDE_EDGE + 1, 0)]), 1, 0, idX))
      .toBe('UNKNOWN');
    // only a wide GK (gid % TEAM_SIZE === 0) — keeper excluded
    expect(widthHeldBit(snapOf(obsBall(1, 0), [obsPlayer(0, 0, 10, WIDE_EDGE + 1, 0)]), 1, 0, idX))
      .toBe('UNKNOWN');
    // only opponents wide in the attacking half — own-side only
    expect(widthHeldBit(snapOf(obsBall(1, 0), [obsPlayer(9, 1, 10, WIDE_EDGE + 1, 0)]), 1, 0, idX))
      .toBe('UNKNOWN');
  });
  it('the observer\'s own wide body does not count', () => {
    expect(widthHeldBit(snapOf(obsBall(1, 0), [obsPlayer(1, 0, 10, WIDE_EDGE + 5, 0)]), 1, 0, idX))
      .toBe('UNKNOWN');
  });
  it('WIDE_EDGE is BOX_WIDTH / 2 (§3.1)', () => {
    expect(WIDE_EDGE).toBe(BOX_WIDTH / 2);
  });
});

describe('V4-P3p-0 §3.2 — perceivedOffsideLine + beyondLineBit', () => {
  it('fewer than two fresh opponents ⇒ null (E-ABSTAIN-LINE-STALE)', () => {
    expect(perceivedOffsideLine(null, 0, idX)).toBeNull();
    expect(perceivedOffsideLine(snapOf(obsBall(1, 0), [obsPlayer(9, 1, 20, 0, 0)]), 0, idX)).toBeNull();
    // two opponents but one is stale ⇒ only one fresh ⇒ null
    expect(perceivedOffsideLine(
      snapOf(obsBall(1, 0), [obsPlayer(9, 1, 20, 0, 0), obsPlayer(10, 1, 15, 0, LINE_STALE_TICKS + 1)]), 0, idX,
    )).toBeNull();
  });
  it('the SECOND-LAST perceived opponent local-x, keeper counted, floored at ball and 0', () => {
    const ballAt = (bx: number) => obsBall(1, 0, bx, 0);
    // three opponents 30/20/10, ball at 0 ⇒ second-last = 20
    expect(perceivedOffsideLine(
      snapOf(ballAt(0), [obsPlayer(9, 1, 30, 0, 0), obsPlayer(10, 1, 20, 0, 0), obsPlayer(11, 1, 10, 0, 0)]), 0, idX,
    )).toBe(20);
    // ball deeper than the second-last ⇒ floored at the ball
    expect(perceivedOffsideLine(
      snapOf(ballAt(25), [obsPlayer(9, 1, 20, 0, 0), obsPlayer(10, 1, 10, 0, 0)]), 0, idX,
    )).toBe(25);
    // opponents in the observer's own half ⇒ floored at 0 (no offside in own half)
    expect(perceivedOffsideLine(
      snapOf(ballAt(-20), [obsPlayer(9, 1, -5, 0, 0), obsPlayer(10, 1, -10, 0, 0)]), 0, idX,
    )).toBe(0);
    // own-side players are ignored (opponents only)
    expect(perceivedOffsideLine(
      snapOf(ballAt(0), [obsPlayer(9, 1, 20, 0, 0), obsPlayer(3, 0, 40, 0, 0), obsPlayer(10, 1, 10, 0, 0)]), 0, idX,
    )).toBe(10);
  });
  it('beyondLineBit: beyond the line by more than OFFSIDE_EPS ⇒ 1, level/near ⇒ 0', () => {
    expect(beyondLineBit(10, 5, 6)).toBe(1);            // target 11 > 10.2
    expect(beyondLineBit(10, 5, 5)).toBe(0);            // target 10, not > 10.2
    expect(beyondLineBit(10, 5, 5 + OFFSIDE_EPS + 0.01)).toBe(1); // just past the epsilon
    expect(beyondLineBit(10, 5, 5 + OFFSIDE_EPS)).toBe(0);        // exactly level with the epsilon
    expect(beyondLineBit(10, 5, -7)).toBe(0);          // a behind-ball candidate is never beyond
  });
  it('a null (UNKNOWN) line ⇒ the bit ABSTAINS to UNKNOWN', () => {
    expect(beyondLineBit(null, 5, 20)).toBe('UNKNOWN');
  });
  it('OFFSIDE_EPS is the sim\'s own offside epsilon 0.2 (read from mechanics.offsideAtKick)', () => {
    expect(OFFSIDE_EPS).toBe(0.2);
  });
});
