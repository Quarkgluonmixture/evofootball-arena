/**
 * DV T2-T0 — THE DORMANT LEARNING SEAM (docs/world-model/DV-T2-T0-LEARNING-SEAM.md).
 *
 * Contract DV-T2-LEARNED-MAP-CONTRACT.md §2 (M-DV2.1–.4), bound by ruling #255.2 and
 * dispatched by #256.4. Every gate below is FROZEN in the stage doc's §GATES before this
 * file ran; every number the doc publishes is quoted from this probe's artifact.
 *
 * ⭐ THE #247 SPLIT IS THE LAW OF THE INSTRUMENT/CODE BOUNDARY: this probe may READ the
 * committed censuses (DV-C0's and T2-C0's) — `src/**` may not, and G-NOTABLE greps the
 * whole tree for exactly that, on their own published values.
 *
 * RUN: npx tsx scripts/probes/dv-t2-t0-learning-seam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import {
  DV_ZONES, deliveryValueSeatOf, receptionZoneIndex,
} from '../../src/ai/deliveryValueSeat';
import {
  DV_LEARN_WINDOW_S, DeliveryAccountBook, DeliveryLabelLedger,
} from '../../src/ai/deliveryAccountBook';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, DV_BELIEF_SLOTS, GENE_KEYS, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/dv-t2-t0-learning-seam.json';
/** ⭐ INSTRUMENT-SIDE ONLY (#247): the probe may read the TRUE tables; `src/**` may not. */
const DVC0_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';
const T2C0_PATH = 'docs/world-model/data/dv-t2-c0-pass-level-census.json';
const GGC_PATH = 'docs/world-model/data/goal-genealogy-census.json';

/* ---- the frozen league-identity baselines (PRE-CHANGE, inherited UNTRUNCATED) -------- */
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ---- §SEED LEDGER ------------------------------------------------------------------- */
const BLOCK = 12_437_000;
const N = Number(process.env.DVT2T0_N ?? 24);
const CROSS_N = Math.min(N, 2);
/** the prefix/lockstep reads are per-tick and dear; a declared SUBSET of the receipt block. */
const PREFIX_N = Math.min(N, 8);
const READ_BASE = BLOCK + N; //          12,437,024 — label / book / reset / rng reads
const READ_SPAN = 6;
const SMOKE_BASE = BLOCK + 100; //       12,437,100 — the REPORTED dormant-armed smoke
const SMOKE_N = Number(process.env.DVT2T0_SMOKE_N ?? 40);

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts + corner/smoke read (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  { name: 'OBM-T0 receipts + geometry/EPI/smoke read (#228)', range: [12_424_000, 12_424_024] },
  { name: 'OBM-T0 REPORTED cost reading (#228)', range: [12_424_025, 12_424_025] },
  { name: 'OBM-T1 smoke (#228.6/#230)', range: [12_424_026, 12_424_037] },
  { name: 'OBM-T1 delivered-dose read (#230)', range: [12_424_040, 12_424_040] },
  { name: 'OBM-T1 guard band (#230)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#230)', range: [12_424_100, 12_424_899] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
  { name: 'PTP-T0 receipts + geometry/EPI-MOTION/smoke read (#232)', range: [12_425_000, 12_425_024] },
  { name: 'PTP-T0 REPORTED cost reading (#232)', range: [12_425_025, 12_425_025] },
  { name: 'PTP-T1 smoke (#232.3/#233)', range: [12_425_026, 12_425_037] },
  { name: 'PTP-T1 delivered-dose read (#233)', range: [12_425_040, 12_425_040] },
  { name: 'PTP-T1 guard band (#233)', range: [12_425_050, 12_425_099] },
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
  { name: 'DLC-T0 receipts + contest/winner/EPI/smoke read (#237)', range: [12_426_000, 12_426_024] },
  { name: 'DLC-T0 REPORTED chooser-cost reading (#237)', range: [12_426_025, 12_426_025] },
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_041] },
  { name: 'DLC-T1 delivered-dose read (#238)', range: [12_426_045, 12_426_045] },
  { name: 'DLC-T1 guard band (#238)', range: [12_426_050, 12_426_099] },
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
  { name: 'DLC-T0s receipts + grid/winner/EPI/smoke/decode read (#242)', range: [12_427_000, 12_427_024] },
  { name: 'DLC-T0s REPORTED chooser-cost reading (#242)', range: [12_427_025, 12_427_025] },
  { name: 'DLC-T0s test-file seeds (#242)', range: [12_427_900, 12_427_906] },
  { name: 'DLC-T1s smoke (#243)', range: [12_428_000, 12_428_011] },
  { name: 'DLC-T1s delivered-dose read (#243)', range: [12_428_015, 12_428_015] },
  { name: 'DLC-T1s strike read (#243)', range: [12_428_020, 12_428_020] },
  { name: 'DLC-T1s guard band (#243)', range: [12_428_050, 12_428_099] },
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_899] },
  { name: 'DLC-T1s test-file seed band (#243)', range: [12_428_900, 12_428_906] },
  { name: 'DV-C0 smoke (#249)', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 exit-semantics guard block (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD construction seed (#249)', range: [12_429_999, 12_429_999] },
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_026] },
  { name: '⚠ DV-T0 test-file seeds (#250 — THE ORDERED SKIP BAND)', range: [12_430_900, 12_430_911] },
  { name: 'DV-T1 smoke + reads + guard + battery (#251)', range: [12_430_027, 12_430_382] },
  { name: 'DV-T1b smoke + reads + guard + battery (#252)', range: [12_431_000, 12_431_742] },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  { name: 'DV-T1c smoke + reads + guard + battery (#253/#254)', range: [12_432_000, 12_434_035] },
  { name: 'DV-T1c reserved ceiling (#253.1)', range: [12_435_000, 12_435_099] },
  // ⭐ T2-C0's own five blocks (#256.4), read off its committed §SEEDS ledger.
  { name: 'T2-C0 smoke (#256)', range: [12_436_000, 12_436_011] },
  { name: 'T2-C0 wrapper-inertness twin (#256)', range: [12_436_020, 12_436_020] },
  { name: 'T2-C0 exit-semantics guard block (#256)', range: [12_436_050, 12_436_099] },
  { name: 'T2-C0 census + reserve (#256)', range: [12_436_100, 12_436_899] },
  { name: 'T2-C0 G-WORLD construction seed (#256)', range: [12_436_999, 12_436_999] },
];

const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);

/* ========================================================================== */
/* §THE WORLD — bare production, built exactly as T2-C0's census arm is        */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;
/** the neighbours' shared gene dose, for the door crossings (DV-T0's own value). */
const LEAD_DOSE = 0.7;
const OTHER_DOSE = { ctbDepth: CTB_GENE_MIN, ctbWidth: CTB_GENE_MAX } as const;

interface ArmSpec {
  /** flag omitted entirely (`absent`) vs explicitly false vs true. */
  learn: 'absent' | false | true;
  price?: boolean;
  percept?: boolean;
  /** hand-doped DV genes (the consumer's), independent of anything learned. */
  dvGenes?: 'absent' | 'zero' | readonly number[];
  neighbours?: boolean;
  books?: readonly [DeliveryAccountBook, DeliveryAccountBook];
}

const armGenes = (m: Match, state: 'absent' | 'zero' | readonly number[]): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (state === 'absent') { delete g.dvExposureWeight; delete g.dvLossBelief; continue; }
      g.dvExposureWeight = 0;
      g.dvLossBelief = state === 'zero' ? [0, 0, 0] : [...state];
    }
  }
};
const armNeighbours = (m: Match): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      g.passLeadSupport = LEAD_DOSE;
      g.ctbSupportDepth = OTHER_DOSE.ctbDepth;
      g.ctbSupportWidth = OTHER_DOSE.ctbWidth;
    }
  }
};

const matchOf = (seed: number, a: ArmSpec): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.percept === true ? PERCEPT_FLAGS : {}),
    ...(a.learn === 'absent' ? {} : { dvLearnedMap: a.learn }),
    ...(a.learn === true && a.books !== undefined ? { dvLearnedBooks: a.books } : {}),
    ...(a.price === true ? { dvDeliveryValue: true } : {}),
    ...(a.neighbours === true
      ? { ptpPassLead: true, dlcDeliveryChoice: true, dlcStrikePlane: true } : {}),
  });
  if (a.dvGenes !== undefined) armGenes(m, a.dvGenes);
  if (a.neighbours === true) armNeighbours(m);
  return m;
};

/** The whole-match signature, INCLUDING the rng stream state (DV-T0's own form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));
const walk = (seed: number, a: ArmSpec): string => {
  const m = matchOf(seed, a);
  while (!m.finished) m.step(DT);
  return signature(m);
};

/** a cheap per-tick state read for the lockstep prefix comparison (no hashing). */
const tickState = (m: Match): number => {
  let s = (m.rng as unknown as { s: number }).s + m.score[0] * 1e7 + m.score[1] * 1e9;
  s += m.ball.pos.x * 1e3 + m.ball.pos.y * 1e5;
  for (const p of m.allPlayers) s += p.pos.x + p.pos.y * 3 + p.vel.x * 7;
  return s;
};

/* ========================================================================== */
/* ⭐⭐ G-LABEL — T2-C0's OWN SEMANTICS, re-implemented probe-side and compared */
/* ========================================================================== */
type Third = 'own' | 'middle' | 'final';
const THIRDS: readonly Third[] = DV_ZONES;

interface LabelMutant {
  deadBallNeverCloses?: boolean;
  lossNeverCloses?: boolean;
  indexByPasser?: boolean;
  windowS?: number;
  manyToOne?: boolean;
}

/**
 * The independent re-walk: T2-C0's chain rule (a maximal same-team control interval while
 * `phase === 'playing'`, suspended while loose, ended by the opponent establishing control
 * or by the ball going dead), its loss stamp, its ONE-TO-ONE nearest-in-window attribution
 * and its 10 s window. Returns per-team per-zone (deliveries, punished).
 *
 * ⚠ It walks the SAME match object the in-world book is filling, so the comparison is a
 * comparison of two accounts of ONE trajectory, not of two worlds.
 */
function reWalk(
  seed: number, books: readonly [DeliveryAccountBook, DeliveryAccountBook], mut: LabelMutant = {},
): { cells: { side: number; zone: number; deliveries: number; punished: number }[];
  deliveries: number; turnovers: number; conceded: number; punished: number } {
  const m = matchOf(seed, { learn: true, books });
  const W = mut.windowS ?? DV_LEARN_WINDOW_S;
  const deliveries: { side: Side; zone: number; tick: number; seg: number }[] = [];
  const pending: { side: Side; zone: number }[] = [];
  const segments: { team: Side; startTick: number; closeTick: number; lost: boolean; ti: number }[] = [];
  const turnovers: { tSim: number; loser: Side }[] = [];
  const conceded: { tSim: number; conceding: Side }[] = [];

  const orig = m.performPass.bind(m);
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<V2> | null = null,
  ): void => {
    const before = m.lastPassKind;
    orig(p, mate, offsideExempt, powerChoice, ptpLead);
    if (m.lastPassKind === before) return;
    const aim = mut.indexByPasser === true ? p.pos : mate.pos;
    pending.push({ side: p.side, zone: receptionZoneIndex(m.teams[p.side].localX(aim.x)) });
  };

  let cur: { team: Side; startTick: number } | null = null;
  const prevScore: [number, number] = [0, 0];
  const close = (lost: boolean, tick: number, tSim: number): void => {
    if (cur === null) return;
    let ti = -1;
    if (lost) { ti = turnovers.length; turnovers.push({ tSim, loser: cur.team }); }
    segments.push({ team: cur.team, startTick: cur.startTick, closeTick: tick, lost, ti });
    cur = null;
  };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    while (pending.length > 0) {
      const d = pending.shift()!;
      deliveries.push({ side: d.side, zone: d.zone, tick, seg: -1 });
    }
    for (const s of [0, 1] as const) {
      while (prevScore[s] < m.score[s]) {
        prevScore[s]++;
        conceded.push({ tSim: m.simTime, conceding: (1 - s) as Side });
      }
    }
    if (m.phase !== 'playing') {
      if (mut.deadBallNeverCloses !== true) close(false, tick, m.simTime);
      continue;
    }
    const owner = m.ball.owner;
    if (owner === null) continue;
    const side = owner.side;
    if (cur !== null && cur.team !== side && mut.lossNeverCloses !== true) close(true, tick, m.simTime);
    if (cur !== null && cur.team !== side) cur = null;
    if (cur === null) cur = { team: side, startTick: tick };
  }
  if (cur !== null) { segments.push({ team: cur.team, startTick: cur.startTick, closeTick: m.simTick, lost: false, ti: -1 }); cur = null; }

  for (const d of deliveries) {
    for (let i = 0; i < segments.length; i++) {
      const s = segments[i];
      if (s.team === d.side && d.tick >= s.startTick && d.tick <= s.closeTick) { d.seg = i; break; }
    }
  }

  const used = new Array<boolean>(turnovers.length).fill(false);
  const punishedTurnover = new Array<boolean>(turnovers.length).fill(false);
  const goalsSorted = [...conceded].sort((a, b) => a.tSim - b.tSim);
  for (const g of goalsSorted) {
    if (mut.manyToOne === true) {
      for (let i = 0; i < turnovers.length; i++) {
        const t = turnovers[i];
        if (t.loser === g.conceding && t.tSim <= g.tSim && t.tSim >= g.tSim - W) punishedTurnover[i] = true;
      }
      continue;
    }
    let best = -1;
    for (let i = 0; i < turnovers.length; i++) {
      const t = turnovers[i];
      if (t.loser !== g.conceding || used[i]) continue;
      if (t.tSim > g.tSim || t.tSim < g.tSim - W) continue;
      if (best === -1 || t.tSim > turnovers[best].tSim) best = i;
    }
    if (best >= 0) { used[best] = true; punishedTurnover[best] = true; }
  }

  const cells = ([0, 1] as const).flatMap((side) => THIRDS.map((_z, zone) => ({
    side, zone, deliveries: 0, punished: 0,
  })));
  let punished = 0;
  for (const d of deliveries) {
    const c = cells[d.side * DV_BELIEF_SLOTS + d.zone];
    c.deliveries++;
    const seg = d.seg < 0 ? null : segments[d.seg];
    if (seg !== null && seg.lost && seg.ti >= 0 && punishedTurnover[seg.ti]) { c.punished++; punished++; }
  }
  return {
    cells, deliveries: deliveries.length, turnovers: turnovers.length,
    conceded: conceded.length, punished,
  };
}

/* ========================================================================== */
/* THE RECEIPTS CORE                                                          */
/* ========================================================================== */
const SEEDS = Array.from({ length: N }, (_, i) => BLOCK + i);

function receipts(): Record<string, unknown> {
  /* ---- G-OFF / G-BORN --------------------------------------------------- */
  const offBorn = SEEDS.map((seed) => {
    const row: Record<string, unknown> = { seed };
    for (const percept of [false, true]) {
      const tag = percept ? 'percept' : 'bare';
      const off = walk(seed, { learn: 'absent', percept });
      const flagFalse = walk(seed, { learn: false, percept });
      const books: [DeliveryAccountBook, DeliveryAccountBook] = [
        new DeliveryAccountBook(), new DeliveryAccountBook(),
      ];
      const learnOnly = walk(seed, { learn: true, percept, books });
      const filled = books.reduce((n, b) => n + b.total, 0);
      const cells = books.reduce(
        (n, b) => n + b.deliveries.filter((d) => d > 0).length, 0,
      );
      row[tag] = {
        gOff: off === flagFalse, gBorn: off === learnOnly,
        labelsClosed: filled, filledCells: cells,
        nonVacuous: filled > 0 && cells > 0,
      };
    }
    return row;
  });
  const gOff = offBorn.every((r) => (r.bare as { gOff: boolean }).gOff
    && (r.percept as { gOff: boolean }).gOff);
  const gBorn = offBorn.every((r) => (r.bare as { gBorn: boolean }).gBorn
    && (r.percept as { gBorn: boolean }).gBorn
    && (r.bare as { nonVacuous: boolean }).nonVacuous
    && (r.percept as { nonVacuous: boolean }).nonVacuous);

  /* ---- G-EMPTY (a) structural ------------------------------------------- */
  const emptyBook = new DeliveryAccountBook();
  const zeroBook = new DeliveryAccountBook();
  for (let k = 0; k < 7; k++) zeroBook.note(k % DV_BELIEF_SLOTS, false);
  const gEmptyStructural = {
    emptyServesNull: emptyBook.beliefVector() === null,
    emptyTotalZero: emptyBook.total === 0,
    absentGeneNoSeat: deliveryValueSeatOf({} as TacticalGenome) === null,
    zeroBookServesZeros: JSON.stringify(zeroBook.beliefVector()) === JSON.stringify([0, 0, 0]),
    zeroBookSeatFormsAtZero: (() => {
      const g = { dvLossBelief: zeroBook.beliefVector() ?? [] } as TacticalGenome;
      const seat = deliveryValueSeatOf(g);
      return seat !== null && seat.belief.every((v) => v === 0);
    })(),
    widthHeld: (emptyBook.deliveries.length === DV_BELIEF_SLOTS
      && emptyBook.punished.length === DV_BELIEF_SLOTS),
  };

  /* ---- G-EMPTY (b/c) PREFIX + G-BITE — the lockstep read ----------------- */
  const prefix = SEEDS.slice(0, PREFIX_N).map((seed) => {
    const books: [DeliveryAccountBook, DeliveryAccountBook] = [
      new DeliveryAccountBook(), new DeliveryAccountBook(),
    ];
    const armed = matchOf(seed, { learn: true, price: true, books });
    const off = matchOf(seed, { learn: 'absent' });
    let firstWriteTick = -1; let firstNonZeroTick = -1; let firstDiffTick = -1;
    let tick = 0;
    while (!armed.finished && !off.finished) {
      armed.step(DT); off.step(DT); tick++;
      const bel = armed.teams.map((t) => (t.baseGenome as TacticalGenome).dvLossBelief);
      if (firstWriteTick < 0 && bel.some((b) => b !== undefined)) firstWriteTick = tick;
      if (firstNonZeroTick < 0 && bel.some((b) => b !== undefined && b.some((v) => v > 0))) {
        firstNonZeroTick = tick;
      }
      if (firstDiffTick < 0 && tickState(armed) !== tickState(off)) firstDiffTick = tick;
      if (firstDiffTick >= 0 && firstNonZeroTick >= 0) break;
    }
    return {
      seed, firstWriteTick, firstNonZeroTick, firstDiffTick,
      /** ⭐ the identity claim: nothing moves before a POSITIVE belief exists. */
      prefixHeld: firstNonZeroTick > 0
        && (firstDiffTick < 0 || firstDiffTick >= firstNonZeroTick),
      /** the write itself happened well before any divergence (the zero-punishment form). */
      wroteBeforeDiverging: firstWriteTick > 0
        && (firstDiffTick < 0 || firstWriteTick < firstDiffTick),
      diverged: firstDiffTick >= 0,
    };
  });
  const gEmpty = Object.values(gEmptyStructural).every(Boolean)
    && prefix.every((p) => p.prefixHeld && p.wroteBeforeDiverging);
  const gBite = prefix.some((p) => p.diverged);

  /* ---- ⭐⭐ G-LABEL ------------------------------------------------------ */
  const labelRows = SEEDS.map((seed) => {
    const books: [DeliveryAccountBook, DeliveryAccountBook] = [
      new DeliveryAccountBook(), new DeliveryAccountBook(),
    ];
    const rw = reWalk(seed, books);
    let mismatches = 0;
    for (const c of rw.cells) {
      const b = books[c.side];
      if (b.deliveries[c.zone] !== c.deliveries) mismatches++;
      if (b.punished[c.zone] !== c.punished) mismatches++;
    }
    return {
      seed, mismatches,
      deliveries: rw.deliveries, turnovers: rw.turnovers,
      conceded: rw.conceded, punished: rw.punished,
      bookTotal: books[0].total + books[1].total,
      bookPunished: books[0].punished.reduce((a, b) => a + b, 0)
        + books[1].punished.reduce((a, b) => a + b, 0),
    };
  });
  const labelTotals = labelRows.reduce((acc, r) => ({
    mismatches: acc.mismatches + r.mismatches,
    deliveries: acc.deliveries + r.deliveries,
    punished: acc.punished + r.punished,
    turnovers: acc.turnovers + r.turnovers,
    conceded: acc.conceded + r.conceded,
  }), { mismatches: 0, deliveries: 0, punished: 0, turnovers: 0, conceded: 0 });
  /** ⭐ THE MUTANT SET — coverage stated: FOUR conjuncts, FOUR mutants, one each. */
  const mutantSeeds = SEEDS.slice(0, Math.min(N, 8));
  const mutants = ([
    { name: 'lossNeverCloses (the LOSS-closure conjunct)', mut: { lossNeverCloses: true } },
    { name: 'indexByPasser (the AIM-index conjunct)', mut: { indexByPasser: true } },
    { name: 'windowS=0 (the window conjunct)', mut: { windowS: 0 } },
    { name: 'manyToOne (the one-to-one attribution conjunct)', mut: { manyToOne: true } },
  ] as const).map(({ name, mut }) => {
    let mismatches = 0; let flippedOn = 0;
    for (const seed of mutantSeeds) {
      const books: [DeliveryAccountBook, DeliveryAccountBook] = [
        new DeliveryAccountBook(), new DeliveryAccountBook(),
      ];
      const rw = reWalk(seed, books, mut);
      let m = 0;
      for (const c of rw.cells) {
        const b = books[c.side];
        if (b.deliveries[c.zone] !== c.deliveries) m++;
        if (b.punished[c.zone] !== c.punished) m++;
      }
      mismatches += m;
      if (m > 0) flippedOn++;
    }
    return { name, seeds: mutantSeeds.length, mismatches, flippedOn, flipped: mismatches > 0 };
  });
  /** ⭐ ATTEMPTED AND REPORTED AS NOT LIVE (#256.2's coverage discipline, stated not
   *  hidden): the DEAD-BALL sub-rule of chain closure. Both mutants of it leave the cells
   *  untouched at this block's event rates, so that ONE conjunct is NOT mutant-covered
   *  here and this stage says so rather than letting the four-mutant claim cover it. */
  const mutantsNotLive = ([
    { name: 'deadBallNeverCloses (the DEAD-BALL sub-rule)', mut: { deadBallNeverCloses: true } },
  ] as const).map(({ name, mut }) => {
    let mismatches = 0;
    for (const seed of mutantSeeds) {
      const books: [DeliveryAccountBook, DeliveryAccountBook] = [
        new DeliveryAccountBook(), new DeliveryAccountBook(),
      ];
      const rw = reWalk(seed, books, mut);
      for (const c of rw.cells) {
        const b = books[c.side];
        if (b.deliveries[c.zone] !== c.deliveries) mismatches++;
        if (b.punished[c.zone] !== c.punished) mismatches++;
      }
    }
    return { name, seeds: mutantSeeds.length, mismatches, live: mismatches > 0 };
  });
  const gLabel = labelTotals.mismatches === 0 && labelTotals.punished > 0
    && mutants.every((m) => m.flipped);

  /* ---- G-BOOK ------------------------------------------------------------ */
  const bookProbe = new DeliveryAccountBook();
  const bookStream: { z: number; p: boolean }[] = [];
  const brng = new Rng(4242);
  for (let i = 0; i < 500; i++) {
    const z = Math.floor(brng.next() * DV_BELIEF_SLOTS) % DV_BELIEF_SLOTS;
    const p = brng.next() < 0.07;
    bookStream.push({ z, p });
    bookProbe.note(z, p);
  }
  const handCount = [0, 1, 2].map((z) => ({
    n: bookStream.filter((s) => s.z === z).length,
    k: bookStream.filter((s) => s.z === z && s.p).length,
  }));
  const bel = bookProbe.beliefVector() ?? [];
  const emptyZoneBook = new DeliveryAccountBook();
  emptyZoneBook.note(1, true);
  const gBookRows = {
    marginalExact: handCount.every((h, z) => bel[z] === (h.n > 0 ? h.k / h.n : 0)),
    countsExact: handCount.every((h, z) => bookProbe.deliveries[z] === h.n
      && bookProbe.punished[z] === h.k),
    punishedNeverExceeds: bookProbe.punished.every((k, z) => k <= bookProbe.deliveries[z]),
    totalIsSum: bookProbe.total === bookProbe.deliveries.reduce((a, b) => a + b, 0),
    widthHeld: bel.length === DV_BELIEF_SLOTS,
    zeroConstantOnEmptyZone: JSON.stringify(emptyZoneBook.beliefVector()) === JSON.stringify([0, 1, 0]),
    /** the MARGINAL, not the conditional-on-lost (#256.2's ratified quantity). */
    isMarginalNotConditional: bel[1] !== (handCount[1].k / Math.max(1, handCount[1].k)),
  };
  const gBook = Object.values(gBookRows).every(Boolean);

  /* ---- ⭐ G-RESET -------------------------------------------------------- */
  const resetLeague = new League({ seed: READ_BASE });
  resetLeague.matchFlags = { dvLearnedMap: true };
  let resetMatches = 0;
  while (!resetLeague.seasonDone) {
    const f = resetLeague.nextFixture();
    if (f === undefined || f === null) break;
    resetLeague.applyResult(f, resetLeague.createMatch(f).runToCompletion());
    resetMatches++;
  }
  const filledBooks = resetLeague.deliveryBooks ?? [];
  const filledTotal = filledBooks.reduce((n, b) => n + b.total, 0);
  const filledNonNull = filledBooks.filter((b) => b.beliefVector() !== null).length;
  resetLeague.finishSeason();
  const afterBooks = resetLeague.deliveryBooks ?? [];
  const afterTotal = afterBooks.reduce((n, b) => n + b.total, 0);
  const afterNonNull = afterBooks.filter((b) => b.beliefVector() !== null).length;
  const nextFixture = resetLeague.nextFixture();
  const nextMatch = nextFixture === undefined || nextFixture === null
    ? null : resetLeague.createMatch(nextFixture);
  const gResetRows = {
    seasonFilled: filledTotal > 0 && filledNonNull > 0,
    wipedCounts: afterTotal === 0,
    wipedBeliefs: afterNonNull === 0,
    bornAbsentAgain: nextMatch === null
      || nextMatch.teams.every((t) => (t.baseGenome as TacticalGenome).dvLossBelief === undefined),
  };
  const gReset = Object.values(gResetRows).every(Boolean);

  /* ---- ⭐ G-NOLAMARCK ---------------------------------------------------- */
  const lamBooks: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const lamMatch = matchOf(READ_BASE + 1, { learn: true, price: true, books: lamBooks });
  lamMatch.runToCompletion();
  const lamJson = JSON.stringify(resetLeague.toJSON());
  const gNoLamarckRows = {
    franchiseGenomesUntouched: lamMatch.teams.every(
      (t) => (t.info.genome as TacticalGenome).dvLossBelief === undefined
        && (t.info.genome as TacticalGenome).dvExposureWeight === undefined,
    ),
    matchLocalViewWrote: lamMatch.teams.some(
      (t) => (t.baseGenome as TacticalGenome).dvLossBelief !== undefined,
    ),
    leagueFranchisesClean: resetLeague.franchises.every(
      (f) => (f.coach.genome as TacticalGenome).dvLossBelief === undefined,
    ),
    saveCarriesNoBelief: !lamJson.includes('dvLossBelief') && !lamJson.includes('deliveries')
      && !lamJson.includes('dvLearnedMap'),
    geneStillOutsideGeneKeys: !(GENE_KEYS as readonly string[]).includes('dvLossBelief'),
  };
  const gNoLamarck = Object.values(gNoLamarckRows).every(Boolean);

  /* ---- G-RNG ------------------------------------------------------------- */
  const rngBooks: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const rngArmed = matchOf(READ_BASE + 2, { learn: true, books: rngBooks });
  const rngOff = matchOf(READ_BASE + 2, { learn: 'absent' });
  let rngStatesEqual = true;
  while (!rngArmed.finished && !rngOff.finished) {
    rngArmed.step(DT); rngOff.step(DT);
    if ((rngArmed.rng as unknown as { s: number }).s !== (rngOff.rng as unknown as { s: number }).s) {
      rngStatesEqual = false; break;
    }
  }
  const ledgerFixture = matchOf(READ_BASE + 3, { learn: 'absent' });
  for (let i = 0; i < 400; i++) ledgerFixture.step(DT);
  const sBefore = (ledgerFixture.rng as unknown as { s: number }).s;
  const standalone: [DeliveryAccountBook, DeliveryAccountBook] = [
    new DeliveryAccountBook(), new DeliveryAccountBook(),
  ];
  const standaloneLedger = new DeliveryLabelLedger(standalone, () => undefined);
  for (let i = 0; i < 300; i++) {
    standaloneLedger.observeOwner(i % 2, i * 0.1);
    standaloneLedger.noteDelivery(i % 2, i % DV_BELIEF_SLOTS, i * 0.1);
    if (i % 17 === 0) standaloneLedger.observeConcession(i % 2, i * 0.1);
    standaloneLedger.expire(i * 0.1);
  }
  standaloneLedger.flush();
  const sAfter = (ledgerFixture.rng as unknown as { s: number }).s;
  const gRngRows = {
    armedStreamIdentical: rngStatesEqual,
    ledgerDrawsNothing: sBefore === sAfter,
    ledgerNonVacuous: standalone[0].total + standalone[1].total > 0,
  };
  const gRng = Object.values(gRngRows).every(Boolean);

  return {
    offBorn, gOff, gBorn,
    gEmptyStructural, prefix, gEmpty, gBite,
    labelRows, labelTotals, mutants, mutantsNotLive, gLabel,
    gBookRows, gBook, bookBelief: bel.map((v) => round(v)),
    gResetRows, gReset, resetMatches, filledTotal, afterTotal,
    gNoLamarckRows, gNoLamarck,
    gRngRows, gRng, sBefore, sAfter,
  };
}

process.stderr.write('  [dv-t2-t0] receipts core run A...\n');
const runA = receipts();
const digestA = sha(canonical(runA));
process.stderr.write(`  [dv-t2-t0] run A digest ${digestA}\n  [dv-t2-t0] G-DET second run...\n`);
const runB = receipts();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [dv-t2-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ========================================================================== */
/* ⭐⭐ G-CROSS — THE DOORS MATRIX, INCLUDING THE DV PRICING DOOR ITSELF        */
/* ========================================================================== */
interface CrossCell { learn: boolean; price: boolean; neighbours: boolean; genes: 'absent' | 'dosed' }
const CROSS_DOSE: readonly number[] = [0.9, 0.45, 0.1];
const crossKey = (c: CrossCell): string =>
  `learn${c.learn ? 1 : 0}·price${c.price ? 1 : 0}·nb${c.neighbours ? 1 : 0}·genes-${c.genes}`;
const crossCells: CrossCell[] = [];
for (const learn of [false, true]) {
  for (const price of [false, true]) {
    for (const neighbours of [false, true]) {
      for (const genes of ['absent', 'dosed'] as const) {
        crossCells.push({ learn, price, neighbours, genes });
      }
    }
  }
}
const crossSeeds = SEEDS.slice(0, CROSS_N);
const crossSig: Record<number, Record<string, string>> = {};
for (const seed of crossSeeds) {
  crossSig[seed] = {};
  for (const c of crossCells) {
    crossSig[seed][crossKey(c)] = walk(seed, {
      learn: c.learn ? true : 'absent',
      price: c.price,
      neighbours: c.neighbours,
      dvGenes: c.genes === 'dosed' ? CROSS_DOSE : undefined,
      books: c.learn ? [new DeliveryAccountBook(), new DeliveryAccountBook()] : undefined,
    });
  }
}
const cs = (seed: number, c: CrossCell): string => crossSig[seed][crossKey(c)];
const crossClaims = crossSeeds.map((seed) => {
  const base = cs(seed, { learn: false, price: false, neighbours: false, genes: 'absent' });
  return {
    seed,
    dormantAll: base === cs(seed, { learn: true, price: false, neighbours: false, genes: 'absent' }),
    /** (A) learning armed beside DOSED neighbours ≡ those neighbours alone. */
    aNeighboursUnmoved:
      cs(seed, { learn: false, price: false, neighbours: true, genes: 'absent' })
      === cs(seed, { learn: true, price: false, neighbours: true, genes: 'absent' }),
    /** (B) each neighbour bank armed alone is unmoved by the learning door, at both gene states. */
    bNeighboursUnmovedDosed:
      cs(seed, { learn: false, price: false, neighbours: true, genes: 'dosed' })
      === cs(seed, { learn: true, price: false, neighbours: true, genes: 'dosed' }),
    /** (INTERACTION) the door bites ONLY with the consumer door also armed. */
    interactionNeedsPricer:
      cs(seed, { learn: true, price: false, neighbours: false, genes: 'absent' }) === base
      && cs(seed, { learn: true, price: true, neighbours: false, genes: 'absent' }) !== base,
    /** the pricing door alone at gene-absent is still the incumbent world (DV-T0's G-BORN). */
    priceAloneBornInert:
      cs(seed, { learn: false, price: true, neighbours: false, genes: 'absent' }) === base,
    /** (DISCRIMINATION) a LEARNED world is not a HAND-DOSED world. */
    discriminationLearnedIsNotDosed:
      cs(seed, { learn: true, price: true, neighbours: false, genes: 'absent' })
      !== cs(seed, { learn: false, price: true, neighbours: false, genes: 'dosed' }),
    /** non-vacuity: the dosed pricing door really does move the world. */
    doseBites: cs(seed, { learn: false, price: true, neighbours: false, genes: 'dosed' }) !== base,
  };
});
const gCross = crossClaims.every((r) => Object.entries(r).every(([k, v]) => k === 'seed' || v === true));

/* ========================================================================== */
/* G-IDENT / X-FP-PROD                                                        */
/* ========================================================================== */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [dv-t2-t0] G-IDENT league seed ${seed}...\n`);
  const observed = leagueHash(seed);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdent = gIdentRows.every((r) => r.identical);
const xFpProd = gIdentRows[0].observed === FINGERPRINT_BASELINE;

/* ========================================================================== */
/* SOURCE-LEVEL GATES: G-FORK / G-HYGIENE / G-EPI / G-NOTABLE / G-TRACE       */
/* ========================================================================== */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFiles(p);
  return p.endsWith('.ts') ? [p] : [];
});
const SRC = srcFiles('src');
const srcText = new Map(SRC.map((f) => [f, readFileSync(f, 'utf8')]));
const matchSrc = srcText.get('src/sim/Match.ts') ?? '';
const leagueSrc = srcText.get('src/sim/League.ts') ?? '';
const bookSrc = readFileSync('src/ai/deliveryAccountBook.ts', 'utf8');
const brainSrc = srcText.get('src/ai/PlayerBrain.ts') ?? '';
const a4Src = srcText.get('src/game/a4World.ts') ?? '';
const countOf = (s: string, needle: string): number => s.split(needle).length - 1;

/* ---- G-FORK: every src occurrence of the seam's names, classed ------------- */
const SEAM_RE = /dvLearnedMap|dvLearnedBooks|dvLearn\b|dvLearnObserve|dvLearnWriteBelief|dvLearnSeenScore|DeliveryAccountBook|DeliveryLabelLedger|deliveryAccountBook|DV_LEARN_WINDOW_S|dvBooks|dvBooksFor|deliveryBooks/;
const forkOccurrences: { file: string; line: number; text: string; cls: string }[] = [];
for (const [file, text] of srcText) {
  text.split('\n').forEach((line, i) => {
    if (!SEAM_RE.test(line)) return;
    const t = line.trim();
    let cls = 'unclassified';
    if (file === 'src/ai/deliveryAccountBook.ts') cls = 'the book module\'s own body';
    else if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/')) cls = 'comment';
    else if (t.startsWith('import ')) cls = 'import';
    else if (t === 'this.dvLearn = this.dvLearnedMap' || t.includes('? new DeliveryLabelLedger(')) cls = '⭐ THE LEDGER FORK (Match)';
    else if (t.includes('this.matchFlags?.dvLearnedMap === true')) cls = '⭐ THE SEASON FORK (League)';
    else if (t.includes('this.dvLearn !== null')) cls = 'seat consumer (nullable-seat test)';
    else if (t.includes('this.dvLearn === null ? null : this.lastPassKind')) cls = 'seat consumer (capture pre-read)';
    else if (t.includes('const ledger = this.dvLearn;')) cls = 'seat consumer (local bind)';
    else if (t.includes('this.dvLearnedMap = cfg.dvLearnedMap ?? false;')) cls = 'flag init';
    else if (t.startsWith('dvLearnedMap?:') || t.startsWith('dvLearnedBooks?:')) cls = 'MatchConfig declaration';
    else if (t.startsWith('readonly dvLearnedMap:') || t.startsWith('readonly dvLearn:')
      || t.startsWith('private readonly dvLearnSeenScore') || t.startsWith('private dvBooks:')) cls = 'field declaration';
    else if (t.includes('private dvLearnObserve()') || t.includes('private dvLearnWriteBelief(')) cls = 'seam method declaration';
    else if (t.includes('this.dvLearnObserve()') || t.includes('this.dvLearnWriteBelief(')
      || t.includes('this.dvLearn.flush()') || t.includes('this.dvLearn.noteDelivery(')) cls = 'seat consumer body';
    else if (t.includes('this.dvLearnSeenScore')) cls = 'seam scoreboard cursor';
    else if (t.includes("| 'dvLearnedMap'")) cls = 'League matchFlags union key';
    else if (t.includes('dvBooksFor(') || t.includes('this.dvBooks')) cls = 'League season-book body';
    else if (t.includes('get deliveryBooks()')) cls = 'League instrument accessor';
    else if (t.includes('dvLearnedBooks: this.dvBooksFor(')) cls = 'season fork payload';
    else if (t.includes('cfg.dvLearnedBooks ?? [new DeliveryAccountBook()')) cls = 'ledger fork payload';
    else if (t.includes('DeliveryAccountBook()')) cls = 'book construction (armed paths only)';
    forkOccurrences.push({ file, line: i + 1, text: t.slice(0, 110), cls });
  });
}
const gForkRows = {
  ledgerForkCount: countOf(matchSrc, 'this.dvLearn = this.dvLearnedMap'),
  seasonForkCount: countOf(leagueSrc, 'this.matchFlags?.dvLearnedMap === true'),
  seatConsumerSites: countOf(matchSrc, 'this.dvLearn !== null'),
  performPassBrain: countOf(brainSrc, 'match.performPass('),
  mechPerformPassMatch: countOf(matchSrc, 'mech.performPass('),
  groundCandidateDecl: countOf(brainSrc, 'const groundCandidate = ('),
  unclassified: forkOccurrences.filter((o) => o.cls === 'unclassified').length,
  totalOccurrences: forkOccurrences.length,
};
const gFork = gForkRows.ledgerForkCount === 1 && gForkRows.seasonForkCount === 1
  && gForkRows.seatConsumerSites === 4 && gForkRows.performPassBrain === 3
  && gForkRows.mechPerformPassMatch === 1 && gForkRows.groundCandidateDecl === 1
  && gForkRows.unclassified === 0;

/* ---- G-HYGIENE ------------------------------------------------------------ */
const freshMatch = new Match({ seed: 1, teamA: team('A', 3), teamB: team('B', 5) });
const hygieneLeague = new League({ seed: 99 });
const hygieneFixture = hygieneLeague.nextFixture();
const hygieneMatch = hygieneFixture === undefined || hygieneFixture === null
  ? null : hygieneLeague.createMatch(hygieneFixture);
const seamLines = [...matchSrc.split('\n'), ...leagueSrc.split('\n'), ...bookSrc.split('\n')]
  .filter((l) => SEAM_RE.test(l));
const gHygieneRows = {
  hardFalseInit: matchSrc.includes('this.dvLearnedMap = cfg.dvLearnedMap ?? false;'),
  absentFromA4World: !a4Src.includes('dvLearnedMap') && !a4Src.includes('DeliveryAccountBook'),
  freshMatchOff: freshMatch.dvLearnedMap === false && freshMatch.dvLearn === null,
  leagueMatchOff: hygieneMatch !== null && hygieneMatch.dvLearnedMap === false
    && hygieneMatch.dvLearn === null,
  unarmedLeagueAllocatesNothing: hygieneLeague.deliveryBooks === null,
  noEnvDoor: !seamLines.some((l) => /envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l)),
  noNewGeneKey: !(GENE_KEYS as readonly string[]).includes('dvLossBelief')
    && !(GENE_KEYS as readonly string[]).some((k) => k.startsWith('dvLearn')),
  bookNeverSerialized: !JSON.stringify(hygieneLeague.toJSON()).includes('dvBooks'),
};
const gHygiene = Object.values(gHygieneRows).every(Boolean);

/* ---- ⭐ G-EPI: the book module's import list and named members ------------- */
const bookImports = bookSrc.split('\n').filter((l) => l.trim().startsWith('import '))
  .map((l) => l.trim());
const bookExec = bookSrc.split('\n')
  .filter((l) => {
    const t = l.trim();
    return t.length > 0 && !t.startsWith('//') && !t.startsWith('*') && !t.startsWith('/*')
      && !t.startsWith('*/');
  }).join('\n');
const FORBIDDEN_EPI = [
  'Match', 'match.', 'Player', 'Team', 'perceivedSnapshot', 'perceptionSnapshot', 'opp',
  'rng', 'attrs', '.pos', 'readFileSync', 'docs/', 'import(', 'process.env', 'census',
];
const gEpiRows = {
  importListExact: bookImports.length === 1
    && bookImports[0] === "import { DV_BELIEF_SLOTS } from '../evolution/genome';",
  noForbiddenName: FORBIDDEN_EPI.filter((n) => bookExec.includes(n)),
  publicEventKinds: ['noteDelivery(', 'observeOwner(', 'observeDeadBall(', 'observeConcession(']
    .every((n) => bookSrc.includes(n)),
};
const gEpi = gEpiRows.importListExact && gEpiRows.noForbiddenName.length === 0
  && gEpiRows.publicEventKinds;

/* ---- ⭐⭐ G-NOTABLE (EXTENDED): DV-C0's AND T2-C0's values unreachable ------ */
const readJson = (p: string): Record<string, unknown> =>
  JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;
const dvc0 = readJson(DVC0_PATH);
const t2c0 = readJson(T2C0_PATH);
const ggc = readJson(GGC_PATH);
const deepNumbers = (v: unknown, out: number[] = []): number[] => {
  if (typeof v === 'number') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => deepNumbers(x, out));
  else if (v !== null && typeof v === 'object') {
    Object.values(v as Record<string, unknown>).forEach((x) => deepNumbers(x, out));
  }
  return out;
};
const t2c0Census = ((t2c0.result as Record<string, unknown>).census ?? {}) as Record<string, unknown>;
const dvc0Census = ((dvc0.result as Record<string, unknown>).census ?? {}) as Record<string, unknown>;
/** the RATE-VALUED members of both yardsticks — the ANSWERS #247 forbids in src. */
const NEEDLE_FLOOR = 0.0005;
const rateNeedles = [
  ...deepNumbers(t2c0Census.yardstick),
  ...deepNumbers(dvc0Census.yardstick),
].filter((v) => v > NEEDLE_FLOOR && v < 1);
const needleForms = new Set<string>();
for (const v of rateNeedles) {
  needleForms.add(String(v));
  needleForms.add(String(round(v * 100, 3)));
  needleForms.add((v * 100).toFixed(3));
  needleForms.add((v * 100).toFixed(2));
  needleForms.add(v.toFixed(5));
}
const srcAll = [...srcText.values()].join('\n');
/** ⭐ TOKEN-BOUNDARY matching: `0.03828` must not "hit" the unrelated shipped constant
 *  `0.038289205702647655`. A census value is only reachable if it appears as ITS OWN
 *  number, which is what a copied table would look like. */
const tokenHit = (needle: string): boolean => {
  const re = new RegExp(`(?<![\\d.])${needle.replace(/\./g, '\\.')}(?![\\d])`);
  return re.test(srcAll);
};
const valueHits = [...needleForms].filter((s) => s.length >= 5 && tokenHit(s));
/** ARTIFACT FILE NAMES and SCHEMA IDS — the identifiers a loader would have to name.
 *  ⚠ NOT included: the ordinary English word "yardstick", which appears in two BANKED src
 *  comments (genome.ts ×2, mechanics.ts ×1) correctly DESCRIBING the #247 split ("which
 *  lives with the instrument"). A comment saying the table is instrument-side is the
 *  split being stated, not breached; the gate searches identifiers and values. */
const NAME_NEEDLES = [
  'dv-c0-loss-cost', 'dv-t2-c0-pass-level-census', 'goal-genealogy-census',
  'dv-c0.truth-table', 'dv-t2c0.pass-truth-table',
];
const nameHits = NAME_NEEDLES.filter((s) => srcAll.includes(s));
/** the loader search is on EXECUTABLE source (comments stripped) — a doc-path citation in
 *  a header comment is a REFERENCE, a `readFileSync` is a CHANNEL. */
const execOnly = (t: string): string => t.split('\n').filter((l) => {
  const x = l.trim();
  return x.length > 0 && !x.startsWith('//') && !x.startsWith('*') && !x.startsWith('/*')
    && !x.startsWith('*/');
}).join('\n');
const loaderHits = ['readFileSync', 'docs/world-model', 'import(', 'process.env']
  .filter((s) => execOnly(bookSrc).includes(s)
    || execOnly(srcText.get('src/ai/deliveryValueSeat.ts') ?? '').includes(s));
/** ⭐ the CONTROL NEEDLE: a string that MUST be found, so an empty search cannot pass. */
const controlNeedleFound = srcAll.includes('DV_LEARN_WINDOW_S');
const gNotableRows = {
  needleFormsSearched: needleForms.size,
  rateNeedles: rateNeedles.length,
  valueHits, nameHits, loaderHits, controlNeedleFound,
  coverage: 'the search set is every rate-valued member of BOTH committed yardsticks '
    + `above the declared floor ${NEEDLE_FLOOR}, in five string forms (raw, ×100 rounded, `
    + 'two fixed percentage forms, 5-dp); degenerate/zero cells are excluded by that floor, '
    + 'and the CONTROL NEEDLE proves the search is live.',
};
const gNotable = valueHits.length === 0 && nameHits.length === 0 && loaderHits.length === 0
  && controlNeedleFound && rateNeedles.length >= 12;

/* ---- G-TRACE (incl. ⭐ G-TRACE-WINDOW) ------------------------------------- */
const dvc0Window = ((dvc0Census.yardstick ?? {}) as Record<string, unknown>).windowS
  ?? (dvc0.result as Record<string, unknown> | undefined
    ? deepNumbers(((dvc0.result as Record<string, unknown>).census as Record<string, unknown>)?.primaryWindowS) [0] : undefined);
const t2c0Window = ((t2c0Census.yardstick ?? {}) as Record<string, unknown>).windowS;
const ggcWindows = deepNumbers(
  ((ggc.frozenDesign as Record<string, unknown> | undefined)?.definitions as
    Record<string, unknown> | undefined)?.dangerWindowsS ?? [],
);
const gTraceRows = {
  windowIsT2C0Primary: t2c0Window === DV_LEARN_WINDOW_S,
  windowIsDvC0Primary: dvc0Window === DV_LEARN_WINDOW_S || dvc0Window === undefined,
  dvc0WindowRead: dvc0Window ?? null,
  ggcFamily: ggcWindows,
  windowInGgcFamily: ggcWindows.length >= 2 && ggcWindows.includes(DV_LEARN_WINDOW_S),
  zoneClassifierImported: bookSrc.indexOf('receptionZoneIndex') < 0
    && matchSrc.includes("import { receptionZoneIndex } from '../ai/deliveryValueSeat';"),
  frameIsTeamLocalX: matchSrc.includes('receptionZoneIndex(this.teams[p.side].localX(mate.pos.x))'),
  widthIsBeliefSlots: bookSrc.includes("import { DV_BELIEF_SLOTS } from '../evolution/genome';"),
  strikeTestIsEngines: matchSrc.includes('this.lastPassKind !== dvBefore'),
  writeTargetsMatchLocal: matchSrc.includes('for (const g of [team.baseGenome, team.effGenome] as TacticalGenome[]) {'),
  /** M-DV2.4: the exposure weight is NOT learned — the write method never names it. */
  exposureNotLearned: !matchSrc.slice(
    matchSrc.indexOf('private dvLearnWriteBelief('),
    matchSrc.indexOf('private dvLearnObserve('),
  ).includes('dvExposureWeight'),
};
const gTrace = Object.entries(gTraceRows)
  .filter(([k]) => !['dvc0WindowRead', 'ggcFamily'].includes(k))
  .every(([, v]) => v === true);

/* ---- G-PINS ---------------------------------------------------------------- */
const testText = (f: string): string => readFileSync(f, 'utf8');
const gPinsRows = {
  dvForkPinIntact: countOf(brainSrc, 'match.dvDeliveryValue ?') === 1
    && testText('tests/dvDeliveryValue.test.ts').includes('this.dvDeliveryValue = cfg.dvDeliveryValue ?? false;'),
  ptpForkPinIntact: countOf(brainSrc, 'match.ptpPassLead ?') === 1,
  dlcForkPinIntact: countOf(brainSrc, 'match.dlcDeliveryChoice ?') === 1,
  spForkPinIntact: countOf(brainSrc, 'match.dlcStrikePlane ?') === 1,
  zeroNewStrike: countOf(brainSrc, 'match.performPass(') === 3,
  onePricer: countOf(brainSrc, 'const groundCandidate = (') === 1,
  pricerModuleUntouched: execSync('git diff --stat -- src/ai/deliveryValueSeat.ts', { encoding: 'utf8' }).trim() === '',
  noTestFileEdited: execSync('git diff --name-only -- tests', { encoding: 'utf8' })
    .split('\n').filter((l) => l.trim().length > 0).length === 0,
};
const gPins = Object.values(gPinsRows).every(Boolean);

/* ---- G-SEED ---------------------------------------------------------------- */
const collide = (a: number, b: number): string[] => CONSUMED
  .filter((c) => !(b < c.range[0] || a > c.range[1])).map((c) => c.name);
const seedBlocks = [
  { name: 'T2-T0 receipts (24 seeds; G-CROSS re-uses the first 2)', first: BLOCK, last: BLOCK + N - 1 },
  { name: 'T2-T0 label/book/reset/rng reads', first: READ_BASE, last: READ_BASE + READ_SPAN - 1 },
  { name: 'T2-T0 REPORTED dormant-armed smoke', first: SMOKE_BASE, last: SMOKE_BASE + SMOKE_N - 1 },
  { name: 'T2-T0 test-file seeds', first: 12_437_900, last: 12_437_911 },
].map((b) => {
  const ledgerCollisions = collide(b.first, b.last);
  return { ...b, seeds: b.last - b.first + 1, ledgerCollisions, ok: ledgerCollisions.length === 0 };
});
const blocksOrdered = seedBlocks.every((b, i) => i === 0 || b.first > seedBlocks[i - 1].last);
const gSeed = seedBlocks.every((b) => b.ok) && blocksOrdered;

/* ========================================================================== */
/* ⭐ REPORTED — THE DORMANT-ARMED SMOKE                                       */
/* ========================================================================== */
process.stderr.write(`  [dv-t2-t0] REPORTED smoke: ${SMOKE_N} matches, learning armed alone...\n`);
const smokeBooks: [DeliveryAccountBook, DeliveryAccountBook] = [
  new DeliveryAccountBook(), new DeliveryAccountBook(),
];
let smokeIdentical = true;
for (let i = 0; i < SMOKE_N; i++) {
  const seed = SMOKE_BASE + i;
  const armed = walk(seed, { learn: true, books: smokeBooks });
  const off = walk(seed, { learn: 'absent' });
  if (armed !== off) smokeIdentical = false;
}
const smokeDeliveries = DV_ZONES.map((_z, i) => smokeBooks[0].deliveries[i] + smokeBooks[1].deliveries[i]);
const smokePunished = DV_ZONES.map((_z, i) => smokeBooks[0].punished[i] + smokeBooks[1].punished[i]);
const smokeRates = DV_ZONES.map((_z, i) => (smokeDeliveries[i] > 0
  ? smokePunished[i] / smokeDeliveries[i] : 0));
const t2c0Zones = ((t2c0Census.yardstick as Record<string, unknown>).zones
  ?? {}) as Record<string, { punishRate: number; deliveries: number; punished: number }>;
const smokeRows = DV_ZONES.map((z, i) => ({
  zone: z,
  bookDeliveries: smokeDeliveries[i], bookPunished: smokePunished[i],
  bookRatePct: round(smokeRates[i] * 100, 3),
  censusRatePct: round((t2c0Zones[z]?.punishRate ?? 0) * 100, 3),
  censusDeliveries: t2c0Zones[z]?.deliveries ?? 0,
}));
const smokeAllZones = {
  bookDeliveries: smokeDeliveries.reduce((a, b) => a + b, 0),
  bookPunished: smokePunished.reduce((a, b) => a + b, 0),
  bookRatePct: round(100 * smokePunished.reduce((a, b) => a + b, 0)
    / Math.max(1, smokeDeliveries.reduce((a, b) => a + b, 0)), 3),
  deliveriesPerTeamMatch: round(smokeDeliveries.reduce((a, b) => a + b, 0) / (SMOKE_N * 2), 4),
};
const smokeOrdering = [...DV_ZONES].map((z, i) => ({ z, r: smokeRates[i] }))
  .sort((a, b) => b.r - a.r).map((x) => x.z);

/* ========================================================================== */
/* THE ARTIFACT                                                               */
/* ========================================================================== */
const gates: Record<string, boolean> = {
  gIdent, xFpProd,
  gOff: runA.gOff as boolean,
  gBorn: runA.gBorn as boolean,
  gEmpty: runA.gEmpty as boolean,
  gLabel: runA.gLabel as boolean,
  gBook: runA.gBook as boolean,
  gReset: runA.gReset as boolean,
  gBite: runA.gBite as boolean,
  gCross,
  gNotable, gEpi, gNoLamarck: runA.gNoLamarck as boolean,
  gRng: runA.gRng as boolean,
  gHygiene, gFork, gTrace, gPins, gSeed, gDet,
};
const allPass = Object.values(gates).every(Boolean);

const result = {
  stage: 'DV-T2-T0 — THE DORMANT LEARNING SEAM',
  contract: 'docs/world-model/DV-T2-LEARNED-MAP-CONTRACT.md §2 (M-DV2.1–.4); rulings #255.2, #256.4',
  doc: 'docs/world-model/DV-T2-T0-LEARNING-SEAM.md',
  seedBlock: { first: BLOCK, last: BLOCK + N - 1, n: N, crossSeeds: crossSeeds.length },
  statsStream: 'NOT DRAWN — this stage runs no bootstrap at all (the identity-round form). '
    + 'Ruling #256.4\'s ≥107,800 floor is left unconsumed; T2-T1 opens at 107,800 unchanged.',
  gates,
  gIdent: { rows: gIdentRows, pass: gIdent },
  xFpProd: { observed: gIdentRows[0].observed, baseline: FINGERPRINT_BASELINE, pass: xFpProd },
  gOffBorn: {
    rows: runA.offBorn, gOff: runA.gOff, gBorn: runA.gBorn,
    semantics: 'G-OFF is CONFIG EQUIVALENCE (flag absent ≡ flag false). G-BORN is the '
      + 'STRONGER form: the learning door ARMED ALONE runs the whole ledger — chains '
      + 'tracked, labels closed, books filled, beliefs written to the match-local views — '
      + 'and the world is byte-identical because NOTHING READS THEM. The non-vacuity '
      + 'conjunct (labels closed > 0, filled cells > 0) is what stops this being a gate on '
      + 'a dead path.',
  },
  gEmpty: {
    structural: runA.gEmptyStructural, prefix: runA.prefix, pass: runA.gEmpty,
    semantics: 'THE FLAG\'S OWN G-ZERO ANALOGUE. (a) an empty book serves null ⇒ the gene '
      + 'stays ABSENT ⇒ DV-T0\'s seat is null. (b/c) with BOTH doors armed the world is '
      + 'identical to OFF for every tick before the first POSITIVE belief exists — which '
      + 'covers the empty book AND the all-zero book (DV-T0\'s IEEE identity carried '
      + 'through this write path). `firstWriteTick < firstDiffTick` is the measured proof '
      + 'that the write happens, and is inert, before anything moves.',
  },
  gLabel: {
    rows: runA.labelRows, totals: runA.labelTotals, mutants: runA.mutants,
    mutantsAttemptedNotLive: runA.mutantsNotLive, pass: runA.gLabel,
    semantics: 'EQUALITY, not resemblance: the in-world book\'s per-team per-zone '
      + '(deliveries, punished) cells vs an INDEPENDENT probe-side re-walk of T2-C0\'s own '
      + 'chain rule, loss stamp, one-to-one nearest-in-window attribution and 10 s window, '
      + 'on the SAME trajectory. COVERAGE SET (#256.2): four conjuncts — chain closure, the '
      + 'AIM index, the window, the one-to-one rule — and FOUR mutants, one per conjunct, '
      + 'each of which must flip the comparison to false. ⚠ COVERAGE STATED, NOT '
      + 'OVERCLAIMED: the DEAD-BALL sub-rule of chain closure is NOT mutant-covered at '
      + 'this block\'s event rates (its mutant is run and REPORTED as not live in '
      + '`mutantsAttemptedNotLive`); the four-mutant claim does not reach it.',
  },
  gBook: { rows: runA.gBookRows, belief: runA.bookBelief, pass: runA.gBook },
  gReset: {
    rows: runA.gResetRows, matches: runA.resetMatches,
    filledTotal: runA.filledTotal, afterTotal: runA.afterTotal, pass: runA.gReset,
  },
  gBite: { pass: runA.gBite, semantics: 'whole-run DIVERGENCE, never a target flip (#250.3).' },
  gCross: {
    cells: crossCells.length, seeds: crossSeeds, claims: crossClaims, pass: gCross,
    semantics: 'THE DOORS MATRIX extended to this door and INCLUDING the DV pricing door '
      + 'itself. DISCRIMINATION is the load-bearing row: a LEARNED world is not a HAND-DOSED '
      + 'world, so the seam is not a disguised table lookup.',
  },
  gNotable: { ...gNotableRows, pass: gNotable },
  gEpi: { ...gEpiRows, imports: bookImports, pass: gEpi },
  gNoLamarck: {
    rows: runA.gNoLamarckRows, pass: runA.gNoLamarck,
    semantics: 'crossoverGenomes copies a PRESENT dvLossBelief from parent A even with the '
      + 'evolveDeliveryValue opt-in shut, so a learned belief in a FRANCHISE genome would be '
      + 'inherited — the Lamarck channel the contract names as a LATER slice. The write '
      + 'therefore targets the match-local views only, and this gate measures it.',
  },
  gRng: { rows: runA.gRngRows, sBefore: runA.sBefore, sAfter: runA.sAfter, pass: runA.gRng },
  gHygiene: { ...gHygieneRows, pass: gHygiene },
  gFork: { ...gForkRows, occurrences: forkOccurrences, pass: gFork },
  gTrace: { ...gTraceRows, window: DV_LEARN_WINDOW_S, pass: gTrace },
  gPins: { ...gPinsRows, pass: gPins },
  gSeed: { blocks: seedBlocks, ordered: blocksOrdered, pass: gSeed },
  gDet: { pass: gDet, digestA, digestB },
  reported: {
    smoke: {
      matches: SMOKE_N, block: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1],
      worldIdenticalToOff: smokeIdentical,
      rows: smokeRows, allZones: smokeAllZones, ordering: smokeOrdering,
      censusOrdering: ['own', 'middle', 'final'],
      semantics: 'THE DORMANT-ARMED SMOKE: the door armed to LEARN ALONE in a bare '
        + 'production world (the consumer door shut, so the world is byte-identical to the '
        + 'shipped one — measured as `worldIdenticalToOff`), the books filled over the '
        + 'declared block, and the filled books\' MARGINAL rates published beside T2-C0\'s '
        + 'census rates. ⚠ DESCRIPTIVE ONLY — one pooled two-team book over a small block, '
        + 'no control, no CI, no verdict (#203). Ballpark agreement is a plumbing check; '
        + 'divergence is REPORTED, never fixed.',
    },
  },
};

const envelope = {
  head: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
  generatedAt: new Date().toISOString(),
  outPath: OUT_PATH,
};
const resultSha256 = sha(canonical(result));
writeFileSync(OUT_PATH, `${JSON.stringify({ envelope, resultSha256, result }, null, 2)}\n`);

for (const [k, v] of Object.entries(gates)) {
  process.stdout.write(`${v ? 'PASS' : 'FAIL'}  ${k}\n`);
}
process.stdout.write(`resultSha256 ${resultSha256}\n`);
process.stdout.write(`G-DET digest ${digestA}\n`);
process.stdout.write(`${allPass ? 'ALL HARD GATES PASS' : '*** A GATE IS RED ***'}\n`);
process.exit(allPass ? 0 : 1);
