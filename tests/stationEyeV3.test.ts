import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  CELL_FLOOR, EYE_LATTICE, candidateInPowerRole, priceApproachesV3,
  type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';

/**
 * Stage III V3-P2 — the role-conditioned consumer's seam and selection rule
 * (docs/world-model/STAGE3-V3-P2-ROLE-CONSUMER.md §3.2/§3.4). The pins: the eye is
 * null in production (default-off, OFF bit-identity, ORACLE unreachable); each body
 * reads HIS OWN role's column (a DF and an ST at the same moment argmax different
 * candidates BY CONSTRUCTION); the chooser reads PERCEIVED context, not truth; NO
 * going-bit; and the perceptionPrice field is ORACLE − NEUTRAL (the §5.2 fix), not
 * ORACLE − CONTROL.
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
  n, score, concede, value: score - concede, underPowered: n < CELL_FLOOR,
});

describe('V3-P2 — the role-conditioned eye is shut in production', () => {
  it('default-off: the eye and its v3 variant are null on a fresh Match and League', () => {
    const m = matchOf(11);
    expect(m.stationEye).toBeNull();
    expect(m.stationEyeState.size).toBe(0);
    const league = new League({ seed: 20260731 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.stationEye).toBeNull();
  });

  it('X3: the v3 seam is unreachable from the E4 preview', () => {
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
    }
  });
});

describe('V3-P2 — the role-keyed selection rule (§3.4)', () => {
  const context = 'ours|middle|sparse';
  // DF column favours r7a0; ST column favours r21a60 — the SAME context, two roles.
  const roleTable: RoleConditionedTable = {
    [context]: {
      DF: { r7a0: roleCell(0.30, 0.05), r21a60: roleCell(0.02, 0.05) },
      MF: { r7a0: roleCell(0.10, 0.05), r21a60: roleCell(0.12, 0.05) },
      WG: { r7a0: roleCell(0.11, 0.05), r21a60: roleCell(0.13, 0.05) },
      ST: { r7a0: roleCell(0.10, 0.05), r21a60: roleCell(0.30, 0.05) },
    },
  };
  const control: RoleControlLevels = {
    [context]: {
      DF: roleCell(0.10, 0.05), MF: roleCell(0.10, 0.05),
      WG: roleCell(0.10, 0.05), ST: roleCell(0.10, 0.05),
    },
  };
  const genome = randomGenome(new Rng(5));

  it('a DF and an ST at the same moment read different columns → different candidates', () => {
    const df = priceApproachesV3(roleTable, control, context, 'DF', 'neutral', genome);
    const st = priceApproachesV3(roleTable, control, context, 'ST', 'neutral', genome);
    expect(df.kind).toBe('deviate');
    expect(st.kind).toBe('deviate');
    if (df.kind === 'deviate' && st.kind === 'deviate') {
      expect(df.candidate.id).toBe('r7a0');
      expect(st.candidate.id).toBe('r21a60');
      expect(df.candidate.id).not.toBe(st.candidate.id);   // divergence BY CONSTRUCTION
    }
  });

  it('candidateInPowerRole requires the floor and rejects under-powered', () => {
    expect(candidateInPowerRole(roleTable[context].DF, 'r7a0')).toBe(true);
    const thin = { x: roleCell(0.5, 0.1, CELL_FLOOR - 1) };
    expect(candidateInPowerRole(thin, 'x')).toBe(false);
  });

  it('an empty role column (all under-powered) ⇒ E-NOCELL for that role', () => {
    const upTable: RoleConditionedTable = {
      [context]: { DF: { r7a0: roleCell(0.9, 0.0, CELL_FLOOR - 1) }, MF: {}, WG: {}, ST: {} },
    };
    expect(priceApproachesV3(upTable, control, context, 'DF', 'neutral', genome).kind).toBe('noCell');
  });

  it('the incumbent wins when every eligible advantage is ≤ 0 (E-TIE, strict)', () => {
    const belowCtrl: RoleConditionedTable = {
      [context]: { DF: { r7a0: roleCell(0.02, 0.05) }, MF: {}, WG: {}, ST: {} },
    };
    expect(priceApproachesV3(belowCtrl, control, context, 'DF', 'neutral', genome).kind).toBe('tie');
  });

  it('INVERTED takes the argmin — the positive control must hurt', () => {
    const out = priceApproachesV3(roleTable, control, context, 'DF', 'inverted', genome);
    expect(out.kind).toBe('deviate');
    if (out.kind === 'deviate') expect(out.advantage).toBeLessThan(0);
  });

  it('an unpriced context or missing control ⇒ no override', () => {
    expect(priceApproachesV3(roleTable, control, 'theirs|theirThird|crowded', 'DF', 'neutral', genome).kind)
      .toBe('noCell');
    expect(priceApproachesV3(roleTable, {}, context, 'DF', 'neutral', genome).kind).toBe('noCell');
  });
});

describe('V3-P2 — role-keyed lookup live in the sim (own-state, no percept)', () => {
  it('co-located bodies of different roles commit to their OWN role\'s favourite', () => {
    // Every context maps each role to a distinct favourite; control below all.
    const fav: Record<Role, string> = { GK: 'r7a0', DF: 'r7a0', MF: 'r14a180', WG: 'r21a300', ST: 'r21a60' };
    const ctxKeys = [
      'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
      'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
      'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
      'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
    ];
    const columnFor = (favId: string): Record<string, RoleCell> =>
      Object.fromEntries(EYE_LATTICE.map((c) => [c.id, roleCell(c.id === favId ? 0.40 : 0.02, 0.05)]));
    const roleTable: RoleConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k, {
      DF: columnFor(fav.DF), MF: columnFor(fav.MF), WG: columnFor(fav.WG), ST: columnFor(fav.ST),
    }]));
    const control: RoleControlLevels = Object.fromEntries(ctxKeys.map((k) => [k, {
      DF: roleCell(0.10, 0.05), MF: roleCell(0.10, 0.05), WG: roleCell(0.10, 0.05), ST: roleCell(0.10, 0.05),
    }]));

    const m = matchOf(7);
    for (let i = 0; i < 500; i++) m.step(DT);
    const clone = cloneSimulationState(m);
    clone.stationEye = { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control } };
    for (let i = 0; i < 120; i++) clone.step(DT);

    let deviations = 0;
    const rolesSeen = new Set<Role>();
    for (const [gid, st] of clone.stationEyeState) {
      if (st.offset === null) continue;
      const body = clone.allPlayers.find((p) => p.gid === gid)!;
      // every committed override lands on the body's OWN role favourite
      expect(st.candidateId).toBe(fav[body.role]);
      deviations += 1;
      rolesSeen.add(body.role);
    }
    clone.stationEye = null;
    expect(deviations).toBeGreaterThan(0);
    // at least two DISTINCT roles committed — the between-role split is expressed
    expect(rolesSeen.size).toBeGreaterThanOrEqual(2);
  });
});

describe('V3-P2 — the armed seam is deterministic (X7-style)', () => {
  it('two identical v3-armed runs are byte-identical', () => {
    const ctxKeys = ['ours|middle|sparse', 'ours|theirThird|sparse', 'theirs|middle|sparse',
      'ours|ownThird|sparse', 'theirs|theirThird|sparse'];
    const col = Object.fromEntries(EYE_LATTICE.map((c) => [c.id, roleCell(0.30, 0.05)]));
    const roleTable: RoleConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k,
      { DF: col, MF: col, WG: col, ST: col }]));
    const control: RoleControlLevels = Object.fromEntries(ctxKeys.map((k) => [k,
      { DF: roleCell(0.20, 0.05), MF: roleCell(0.20, 0.05), WG: roleCell(0.20, 0.05), ST: roleCell(0.20, 0.05) }]));
    const build = () => {
      const m = matchOf(7);
      for (let i = 0; i < 400; i++) m.step(DT);
      const owner = m.ball.owner;
      const side = owner ? owner.side : 0;
      const body = m.teams[side].players.find((p) => p.role !== 'GK' && !p.sentOff && p !== owner)!;
      const clone = cloneSimulationState(m);
      clone.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: body.gid }, table: {}, v3: { roleTable, control } };
      for (let i = 0; i < 200; i++) clone.step(DT);
      clone.stationEye = null;
      return signature(clone);
    };
    expect(build()).toBe(build());
  });
});

describe('V3-P2 — perceptionPrice = ORACLE − NEUTRAL (the §5.2 serialization fix)', () => {
  // The diagnosed anti-pattern (stage3-v2-p2-consumer.ts:546) wrote the field as
  // pairedCI(rows,'oracleCtx') = ORACLE − CONTROL. §5(g) defines the perception price
  // as ORACLE − NEUTRAL. This pins the algebraic identity the fixed probe relies on:
  // over a FIXED row set, paired(ORACLE − NEUTRAL) == ate(ORACLE) − ate(NEUTRAL),
  // and it is NOT the old ORACLE − CONTROL field.
  interface O { score: boolean; concede: boolean }
  const signed = (o: O): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);
  const mean = (xs: number[]): number => xs.reduce((s, x) => s + x, 0) / xs.length;
  const rows = [
    { oracle: { score: true, concede: false }, neutral: { score: false, concede: false }, control: { score: false, concede: true } },
    { oracle: { score: true, concede: true }, neutral: { score: true, concede: false }, control: { score: false, concede: false } },
    { oracle: { score: false, concede: false }, neutral: { score: false, concede: true }, control: { score: true, concede: false } },
    { oracle: { score: false, concede: true }, neutral: { score: true, concede: true }, control: { score: false, concede: true } },
  ];
  const pairedDiff = (a: 'oracle' | 'neutral' | 'control', b: 'oracle' | 'neutral' | 'control'): number =>
    mean(rows.map((r) => signed(r[a]) - signed(r[b])));

  it('the field equals ate(ORACLE) − ate(NEUTRAL) to numerical tolerance', () => {
    const perceptionPrice = pairedDiff('oracle', 'neutral');          // the CORRECT field
    const oracleAte = pairedDiff('oracle', 'control');
    const neutralAte = pairedDiff('neutral', 'control');
    expect(perceptionPrice).toBeCloseTo(oracleAte - neutralAte, 12);  // §5(g) identity
  });

  it('the field is NOT ORACLE − CONTROL (the diagnosed :546 mislabel)', () => {
    const perceptionPrice = pairedDiff('oracle', 'neutral');
    const oldBuggyField = pairedDiff('oracle', 'control');
    expect(perceptionPrice).not.toBeCloseTo(oldBuggyField, 6);
  });
});
