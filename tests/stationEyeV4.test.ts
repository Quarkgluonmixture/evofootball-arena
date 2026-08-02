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
  EYE_LATTICE, newStationEyeTrace, priceApproachesV3, priceApproachesV3Partial,
  type MergedChildTable, type PartialBitInputs, type RoleCell, type RoleConditionedTable,
  type RoleControlLevels,
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
/** Warm a match, arm a both-scope v3 eye (optionally with v4 flags + merged
 *  children + a trace), run on. Children are injected on the eye.v3 block (§2.3). */
const runV3 = (v4?: V4Flags, children?: MergedChildTable) => {
  const m = matchOf(7);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  const trace = newStationEyeTrace();
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {},
    v3: { roleTable, control, ...(children ? { children } : {}) },
    ...(v4 ? { v4 } : {}), trace,
  };
  for (let i = 0; i < 200; i++) clone.step(DT);
  const sig = signature(clone);
  clone.stationEye = null;
  return { sig, trace };
};

// --- V4-P3p-2a §2.3: a MergedChildTable built over the runV3 roleTable ----------
// `children[family][ctx‖role][cand][bit]`. Delivery carries ONLY the '1' child
// (STRICT keying by artifact shape, #115.1); offside carries '0' and '1'.
const buildChildren = (cellFor: (base: RoleCell, cand: string) => RoleCell): MergedChildTable => {
  const delivery: Record<string, Record<string, Partial<Record<'0' | '1', RoleCell>>>> = {};
  const offside: Record<string, Record<string, Partial<Record<'0' | '1', RoleCell>>>> = {};
  for (const k of ctxKeys) {
    for (const role of ['DF', 'MF', 'WG', 'ST'] as const) {
      const col = roleTable[k][role];
      const key = `${k}||${role}`;
      const d: Record<string, Partial<Record<'0' | '1', RoleCell>>> = {};
      const o: Record<string, Partial<Record<'0' | '1', RoleCell>>> = {};
      for (const c of EYE_LATTICE) {
        d[c.id] = { 1: cellFor(col[c.id], c.id) };
        o[c.id] = { 0: cellFor(col[c.id], c.id), 1: cellFor(col[c.id], c.id) };
      }
      delivery[key] = d;
      offside[key] = o;
    }
  }
  return { delivery, offside };
};
/** Children equal the v3 base cell everywhere ⇒ value-neutral (argmax unchanged). */
const childrenEqualBase = buildChildren((base) => base);
/** Children strongly boosted everywhere ⇒ the child pick beats the v3 base pick. */
const childrenBoosted = buildChildren(() => roleCell(0.60, 0.10));

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
    // absent/false flags NEVER write a v4 counter (incl. the P3p-2a ledger)
    for (const t of [base.trace, emptyV4.trace, falseV4.trace]) {
      const sum = t.v4InSupport + t.v4OosPhase + t.v4OosUnseen + t.v4OosInflight + t.v4OosStale
        + t.v4WidthHeld0 + t.v4WidthHeld1 + t.v4WidthHeldUnknown
        + t.v4BeyondLine0 + t.v4BeyondLine1 + t.v4BeyondLineUnknown
        + t.v4DeliveryChild + t.v4DeliveryBase + t.v4OffsideChild + t.v4OffsideBase;
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

// ===========================================================================
// STAGE III V4-P3p-2a — THE EXTENDED-KEY CONSUMPTION WIRING (§2.2)
// The frozen per-candidate fallback order, unit-tested branch by branch, plus
// the flag-off / children-off / no-children inertness pins and the argmax-
// unchanged-when-children-equal-base identity. Rulings #116.4 / #117.
// ===========================================================================
const g = randomGenome(new Rng(1));
// A ONE-context ONE-role fixture: base = neutral (val 0), control = neutral
// (base 0), so the plain v3 eye TIES (no deviation) and any deviation below is
// the CHILD's doing. r7a0 is an OFFSIDE candidate (dx = +7); r7a180 a DELIVERY
// candidate (dx = −7).
const PCTX = 'ours|middle|sparse';
const PROLE: Role = 'ST';
const flatCell = roleCell(0.10, 0.10);              // val = 0.5·0.10 − 0.5·0.10 = 0 (== control)
const hiCell = roleCell(0.60, 0.10);                // val = 0.25 (beats control ⇒ deviate)
const loCell = roleCell(0.02, 0.30);                // val = −0.14 (below control ⇒ the argmin picks it)
const flatColumn = Object.fromEntries(EYE_LATTICE.map((c) => [c.id, flatCell]));
const pRoleTable: RoleConditionedTable = {
  [PCTX]: { DF: flatColumn, MF: flatColumn, WG: flatColumn, ST: flatColumn },
};
const pControl: RoleControlLevels = {
  [PCTX]: { DF: flatCell, MF: flatCell, WG: flatCell, ST: flatCell },
};
const CKROLE = `${PCTX}||${PROLE}`;
const bits = (o: Partial<PartialBitInputs>): PartialBitInputs => ({
  deliveryOn: false, offsideOn: false, widthHeld: undefined, offsideLine: null, ballLocalX: 0, ...o,
});
const priceP = (children: MergedChildTable, b: PartialBitInputs, arm: 'neutral' | 'inverted' = 'neutral') =>
  priceApproachesV3Partial(pRoleTable, pControl, children, PCTX, PROLE, arm, g, b);

describe('V4-P3p-2a §2.2 — the per-candidate fallback order (branch by branch)', () => {
  it('IN-SCOPE + offside bit=1 + in-power child ⇒ the CHILD is priced (deviate)', () => {
    const children: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a0: { 0: flatCell, 1: hiCell } } } };
    // beyondLineBit(line=5, ballLocalX=0, dx=7) ⇒ target 7 > 5.2 ⇒ bit 1 ⇒ child '1' = hiCell
    const res = priceP(children, bits({ offsideOn: true, offsideLine: 5 }));
    expect(res.outcome.kind).toBe('deviate');
    expect(res.outcome.kind === 'deviate' && res.outcome.candidate.id).toBe('r7a0');
    expect(res.offsideChild).toBe(1);
    expect(res.offsideBase).toBe(0);
    expect(res.deliveryChild + res.deliveryBase).toBe(0);   // out-of-scope candidates never touch the ledger
  });

  it('IN-SCOPE + offside bit=0 + in-power child ⇒ the \'0\' child is priced', () => {
    const children: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a0: { 0: hiCell, 1: flatCell } } } };
    // beyondLineBit(line=20, ballLocalX=0, dx=7) ⇒ target 7 !> 20.2 ⇒ bit 0 ⇒ child '0' = hiCell
    const res = priceP(children, bits({ offsideOn: true, offsideLine: 20 }));
    expect(res.outcome.kind === 'deviate' && res.outcome.candidate.id).toBe('r7a0');
    expect(res.offsideChild).toBe(1);
  });

  it('IN-SCOPE + bit UNKNOWN ⇒ BASE (abstention never invents a value)', () => {
    const children: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a0: { 0: hiCell, 1: hiCell } } } };
    // offsideLine null ⇒ beyondLine UNKNOWN ⇒ base ⇒ no deviation, base ledger
    const res = priceP(children, bits({ offsideOn: true, offsideLine: null }));
    expect(res.outcome.kind).toBe('tie');
    expect(res.offsideBase).toBe(1);
    expect(res.offsideChild).toBe(0);
  });

  it('IN-SCOPE + child ABSENT for the read bit ⇒ BASE (delivery STRICT keying: widthHeld=0 has no child)', () => {
    const children: MergedChildTable = { delivery: { [CKROLE]: { r7a180: { 1: hiCell } } }, offside: {} };
    // widthHeld 0 ⇒ delivery child '0' is undefined (never materialised) ⇒ base
    const at0 = priceP(children, bits({ deliveryOn: true, widthHeld: 0 }));
    expect(at0.outcome.kind).toBe('tie');
    expect(at0.deliveryBase).toBe(1);
    expect(at0.deliveryChild).toBe(0);
    // widthHeld 1 ⇒ delivery child '1' = hiCell ⇒ deviate
    const at1 = priceP(children, bits({ deliveryOn: true, widthHeld: 1 }));
    expect(at1.outcome.kind === 'deviate' && at1.outcome.candidate.id).toBe('r7a180');
    expect(at1.deliveryChild).toBe(1);
  });

  it('IN-SCOPE + child under-powered (n < CELL_FLOOR or underPowered) ⇒ BASE', () => {
    const lowN: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a0: { 1: roleCell(0.60, 0.10, 100) } } } };
    const flagged: MergedChildTable = {
      delivery: {}, offside: { [CKROLE]: { r7a0: { 1: { ...roleCell(0.60, 0.10), underPowered: true } } } },
    };
    for (const children of [lowN, flagged]) {
      const res = priceP(children, bits({ offsideOn: true, offsideLine: 5 }));
      expect(res.outcome.kind).toBe('tie');       // child rejected ⇒ base ⇒ no deviation
      expect(res.offsideBase).toBe(1);
      expect(res.offsideChild).toBe(0);
    }
  });

  it('the family flag OFF ⇒ BASE, no bit consulted, no ledger, == plain v3', () => {
    const children: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a0: { 0: hiCell, 1: hiCell } } } };
    // offside flag off (widthHeld set, but delivery flag off too) ⇒ nothing consumed
    const res = priceP(children, bits({ deliveryOn: false, offsideOn: false, widthHeld: 1, offsideLine: 5 }));
    expect(res.outcome.kind).toBe('tie');
    expect(res.deliveryChild + res.deliveryBase + res.offsideChild + res.offsideBase).toBe(0);
    // byte-for-byte the plain v3 outcome
    expect(res.outcome).toEqual(priceApproachesV3(pRoleTable, pControl, PCTX, PROLE, 'neutral', g));
  });

  it('NOT in-scope (no child entry for this ctx‖role×cand) ⇒ BASE, uncounted', () => {
    // a child only for r7a60, so r7a0 (and the other 8 offside cands) are out of scope
    const children: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a60: { 0: flatCell, 1: flatCell } } } };
    const res = priceP(children, bits({ offsideOn: true, offsideLine: 5 }));
    // only r7a60 is in scope ⇒ ledger total is exactly 1 (r7a60), the rest untouched
    expect(res.offsideChild + res.offsideBase).toBe(1);
  });

  it('the INVERTED arm (PC) prices the child too, taking the argmin', () => {
    const children: MergedChildTable = { delivery: {}, offside: { [CKROLE]: { r7a0: { 0: flatCell, 1: loCell } } } };
    // bit 1 ⇒ child '1' = loCell (val −0.14); the argmin commits to it whatever the sign
    const res = priceP(children, bits({ offsideOn: true, offsideLine: 5 }), 'inverted');
    expect(res.outcome.kind === 'deviate' && res.outcome.candidate.id).toBe('r7a0');
    expect(res.offsideChild).toBe(1);
  });

  it('argmax UNCHANGED when every resolved child equals base (path runs, value-neutral)', () => {
    // children equal to THIS fixture's (flat) base ⇒ value-neutral
    const dfam: Record<string, Partial<Record<'0' | '1', RoleCell>>> = {};
    const ofam: Record<string, Partial<Record<'0' | '1', RoleCell>>> = {};
    for (const c of EYE_LATTICE) { dfam[c.id] = { 1: flatCell }; ofam[c.id] = { 0: flatCell, 1: flatCell }; }
    const equal: MergedChildTable = { delivery: { [CKROLE]: dfam }, offside: { [CKROLE]: ofam } };
    const res = priceP(equal, bits({ deliveryOn: true, offsideOn: true, widthHeld: 1, offsideLine: 5 }));
    // children consumed (ledger moves) but each equals base ⇒ same TIE as plain v3
    expect(res.outcome).toEqual(priceApproachesV3(pRoleTable, pControl, PCTX, PROLE, 'neutral', g));
    expect(res.offsideChild + res.deliveryChild).toBeGreaterThan(0);   // children WERE consumed
  });
});

describe('V4-P3p-2a — children injected but flags off ⇒ INERT (X-OFF-IDENT)', () => {
  it('children on eye.v3, every v4 flag absent/false ⇒ byte-identical to no children, ledger 0', () => {
    const base = runV3();
    const childrenAbsent = runV3(undefined, childrenEqualBase);
    const childrenFalse = runV3({ deliveryBit: false, offsideBit: false }, childrenBoosted);
    expect(childrenAbsent.sig).toBe(base.sig);
    expect(childrenFalse.sig).toBe(base.sig);     // even STRONGLY-boosted children are inert with flags off
    for (const t of [childrenAbsent.trace, childrenFalse.trace]) {
      expect(t.v4DeliveryChild + t.v4DeliveryBase + t.v4OffsideChild + t.v4OffsideBase).toBe(0);
    }
  });
});

describe('V4-P3p-2a — no children + bit flags on ⇒ BASE everywhere (inert consumption)', () => {
  it('bit flags on but NO children injected ⇒ same signature as the plain v3 eye', () => {
    const base = runV3();
    const flagsNoChildren = runV3({ deliveryBit: true, offsideBit: true });
    expect(flagsNoChildren.sig).toBe(base.sig);   // no children ⇒ the plain v3 lookup runs
    // the ledger never moves without children, though the observability bits are read
    const t = flagsNoChildren.trace;
    expect(t.v4DeliveryChild + t.v4DeliveryBase + t.v4OffsideChild + t.v4OffsideBase).toBe(0);
  });
});

describe('V4-P3p-2a — the extended path is LIVE and load-bearing', () => {
  it('children==base + flags on ⇒ signature unchanged, but the consumption ledger fires', () => {
    const base = runV3();
    const on = runV3({ deliveryBit: true, offsideBit: true }, childrenEqualBase);
    expect(on.sig).toBe(base.sig);                // value-neutral children ⇒ argmax unchanged
    const t = on.trace;
    const child = t.v4DeliveryChild + t.v4OffsideChild;
    const total = child + t.v4DeliveryBase + t.v4OffsideBase;
    expect(total).toBeGreaterThan(0);            // the extended lookup was exercised live
    expect(child).toBeGreaterThan(0);            // children were actually consumed
  });

  it('BOOSTED children + flags on ⇒ signature DIVERGES (consumption changed a pick)', () => {
    const base = runV3();
    const boosted = runV3({ deliveryBit: true, offsideBit: true }, childrenBoosted);
    expect(boosted.sig).not.toBe(base.sig);      // a child out-priced the v3 base pick
    expect(boosted.trace.v4OffsideChild).toBeGreaterThan(0);
  });
});
