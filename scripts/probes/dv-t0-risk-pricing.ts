/**
 * DV T0 — THE DORMANT RISK-PRICING SEAM: the receipts.
 *
 * Stage doc: docs/world-model/DV-T0-DORMANT-SEAM.md (frozen BEFORE this ran).
 * Contract:  docs/world-model/DELIVERY-VALUE-CONTRACT.md §2 M-DV.1 / M-DV.2 (as amended
 *            by ruling #247) / M-DV.3.
 * Rulings:   #245 (the map-vs-reality audit + the contract) · #246 (method reality's,
 *            numbers this world's, SHAPE the fidelity check) · #247 (⭐⭐ TRUTH vs
 *            BELIEF — the census table is the INSTRUMENT's, the player's map is EARNED)
 *            · #248 (the earned-knowledge ledger; this arc is the PILOT) · #249 (DV-C0
 *            banked; DV-T0 queued).
 *
 * Everything is computed IN-PROBE (#181.2). The hashed body is commit-free, timing-free
 * and path-free (#197-M1), so `resultSha256` re-derives at any commit.
 *
 *   G-IDENT    3 league seeds vs the frozen pre-change baselines (the RNG-stream receipt).
 *   G-FP       the 1337 row IS the production fingerprint.
 *   G-OFF      flag ABSENT ≡ flag FALSE, both world shapes, rng state included.
 *   G-BORN     ARMED + both genes ABSENT ≡ OFF (the arming rule returns null on a live path).
 *   G-ZERO     ⭐ ARMED + genes PRESENT AT ZERO ≡ OFF, byte for byte — the standing
 *              zero-point discipline, here as a LIVE arithmetic identity (`s − (+0)`).
 *   G-EXPOSURE ⭐ THE FROZEN EXPOSURE LAW, re-derived INDEPENDENTLY on sampled live states
 *              in both world shapes: the corridor family's own geometry/scale/guard, made
 *              time-aware; it DEGENERATES onto `1 − laneOpenness` at zero closing speed.
 *   G-BELIEF   ⭐ the zone selector = the census's zoning re-derived from HALF_L, and the
 *              composition is exactly `w·exposure + belief[zone]·passBase`.
 *   G-BITE     ARMED + dosed diverges on every seed, both shapes; and the CORNER READ —
 *              a dosed belief FLIPS the order of an aggressive and a safe candidate.
 *   G-SEAMS    ⭐⭐ ONE PRICER, EVERY DELIVERY SEAM: the risk price bites on top of the
 *              to-feet loop, the banked two-point contest AND the banked strike plane.
 *   G-EPI      the seat module cannot reach the world (it never imports `Match`); its
 *              position source is the caller's own `opp.players`, the corridor read's.
 *   G-NOTABLE  ⭐⭐ THE #247 SPLIT, HELD BY GREP: no `src/**` file names the DV-C0
 *              artifact or ANY of its measured values.
 *   G-CROSS    the FOUR-door matrix (96 cells), the #228 form.
 *   G-RNG      zero seam draws; the genome opt-in draws nothing when off.
 *   G-HYGIENE  Road B: hard false, absent from a4World, no env door.
 *   G-FORK     the read-fork inventory, every src occurrence classed, zero unclassified.
 *   G-TRACE    every constant back to its source line, VERBATIM; the incumbents untouched.
 *   G-PINS     the pin inventory, machine-checked in the test files AND in src/**.
 *   G-SEED     seed-block disjointness against the COMPLETE ledger (incl. DV-C0's).
 *   G-DET      the core runs TWICE, byte-identical digests.
 *   REPORTED   (a) ⭐ THE TRUTH-DOSED SMOKE: the instrument WRITES the census hazards into
 *              the belief genes (the T1 mechanism, demonstrated) and the chosen-delivery
 *              mix is published beside the zero-belief arm — descriptive, no control;
 *              (b) the CHOOSER-COST reading, per-tick, with a stated noise floor.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L } from '../../src/sim/constants';
import { PTP_FLIGHT_SPEED } from '../../src/ai/passLeadSeat';
import {
  DV_CLEAR_RADIUS, DV_CORRIDOR_SCALE, DV_FLIGHT_SPEED, DV_THIRD_BOUNDARY_LOCAL_X, DV_ZONES,
  deliveryRiskPrice, deliveryValueSeatOf, flightExposure, receptionZoneIndex,
} from '../../src/ai/deliveryValueSeat';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, DV_BELIEF_SLOTS, GENE_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN,
  OBM_WEIGHT_SLOTS, crossoverGenomes, dvExposureWeightOf, dvLossBeliefVector, mutateGenome,
  randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { laneOpenness } from '../../src/ai/perception';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { closestPointOnSegment, dist } from '../../src/utils/vec';
import { DEFAULT_POLICY, TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/dv-t0-risk-pricing.json';
/** ⭐ INSTRUMENT-SIDE ONLY (#247): the probe may read the TRUE table; `src/**` may not. */
const TRUE_TABLE_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited VERBATIM and UNTRUNCATED from the DLC-T0s committed artifact). */
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

const BLOCK = 12_430_000;
const N = Number(process.env.DVT0_N ?? 24);
/** The FOUR-door matrix is 96 cells, so it runs on the FIRST `CROSS_N` of the SAME seeds. */
const CROSS_N = Math.min(N, Number(process.env.DVT0_CROSS_N ?? 2));
const READ_SEED = BLOCK + N; //     12,430,024 — exposure/belief/EPI reads
const COST_SEED = BLOCK + N + 1; // 12,430,025 — the REPORTED chooser-cost reading
const DOSE_SEED = BLOCK + N + 2; // 12,430,026 — the REPORTED truth-dosed smoke
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
  // ⭐ DV-C0's own blocks (#249), read off its committed artifact's ledger
  { name: 'DV-C0 smoke (#249)', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 exit-semantics guard block (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD construction seed (#249)', range: [12_429_999, 12_429_999] },
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
const round = (v: number, d = 4): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** The percept trunk alive — the world shape in which the chooser reads percepts. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

/**
 * ⭐ THE HAND DOSE, declared. These are CORNER DOSES for the identity stack — they exist
 * to make the seam BITE hard enough that the identities above are not vacuous. They are
 * NOT the exam's doses (DV-T1's are, and DV-T1's belief dose is the census's own TRUE
 * table, written by the instrument — demonstrated in REPORTED (a) below).
 */
const DOSE_EXPOSURE = 0.6;
const DOSE_BELIEF: readonly number[] = [0.9, 0.45, 0.1];
const ZERO_BELIEF: readonly number[] = [0, 0, 0];
/** The neighbours' shared gene (`passLeadSupport`), for the delivery-seam crossings. */
const LEAD_DOSE = 0.7;

type GeneState = 'absent' | 'zero' | 'dosed';
type Arm =
  | 'absent' | 'off' | 'plain' | 'plainOff'
  | 'bornArmed' | 'zeroArmed' | 'armed' | 'plainArmed' | 'plainZeroArmed';

/** ⭐ THE ARMING CHECKLIST (#196.3-D6): the genes on ALL THREE views of BOTH teams. */
const armDv = (m: Match, state: GeneState, belief: readonly number[] = DOSE_BELIEF): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (state === 'absent') { delete g.dvExposureWeight; delete g.dvLossBelief; continue; }
      g.dvExposureWeight = state === 'zero' ? 0 : DOSE_EXPOSURE;
      g.dvLossBelief = state === 'zero' ? [...ZERO_BELIEF] : [...belief];
    }
  }
};
const armLead = (m: Match, v: number | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (v === null) delete g.passLeadSupport; else g.passLeadSupport = v;
    }
  }
};

const matchOf = (seed: number, arm: Arm): Match => {
  const percept = !(arm === 'plain' || arm === 'plainOff' || arm === 'plainArmed'
    || arm === 'plainZeroArmed');
  const armedFlag = arm === 'bornArmed' || arm === 'zeroArmed' || arm === 'armed'
    || arm === 'plainArmed' || arm === 'plainZeroArmed';
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(percept ? PERCEPT_FLAGS : {}),
    ...(arm === 'off' || arm === 'plainOff' ? { dvDeliveryValue: false } : {}),
    ...(armedFlag ? { dvDeliveryValue: true } : {}),
  });
  if (arm === 'zeroArmed' || arm === 'plainZeroArmed') armDv(m, 'zero');
  if (arm === 'armed' || arm === 'plainArmed') armDv(m, 'dosed');
  return m;
};

/** The whole-match signature, INCLUDING the rng stream state. */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));
const walk = (seed: number, arm: Arm): string => {
  const m = matchOf(seed, arm);
  while (!m.finished) m.step(DT);
  return signature(m);
};

/* ========================================================================== */
/* ⭐⭐ G-CROSS — THE FOUR-DOOR MATRIX (#228, gated from birth)               */
/* ========================================================================== */
/**
 * DV lands beside three banked DELIVERY doors that all read ONE OTHER gene
 * (`passLeadSupport`) and two banked movement doors. The crossing that matters is the
 * delivery family, because THIS seam modifies the pricer every one of them feeds:
 *
 *   {dv on/off} × {dlc on/off} × {ptp on/off} × {sp on/off}
 *   × {the neighbours' banks dosed/absent} × {DV's own genes absent/zero/dosed}
 *   = 16 × 2 × 3 = 96 cells, each a FULL match on the same receipt seeds, hashed with the
 * whole-run signature (rng state included). Every claim is stated EX ANTE.
 */
interface CrossCell {
  dv: boolean; dlc: boolean; ptp: boolean; sp: boolean;
  others: boolean; gene: GeneState;
}
const OTHER_DOSE = {
  ctbDepth: CTB_GENE_MIN, ctbWidth: CTB_GENE_MAX,
  obmMatrix: ((): number[] => {
    const w = new Array<number>(OBM_WEIGHT_SLOTS).fill(0);
    w[0 * 4 + 0] = OBM_WEIGHT_MIN;
    w[1 * 4 + 1] = OBM_WEIGHT_MAX;
    w[2 * 4 + 0] = OBM_WEIGHT_MAX;
    w[3 * 4 + 2] = OBM_WEIGHT_MIN;
    return w;
  })(),
} as const;
const cellKey = (c: CrossCell): string => `dv${c.dv ? 1 : 0}·dlc${c.dlc ? 1 : 0}`
  + `·ptp${c.ptp ? 1 : 0}·sp${c.sp ? 1 : 0}·others${c.others ? 1 : 0}·gene-${c.gene}`;
const armOthers = (m: Match, on: boolean): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (!on) {
        delete g.ctbSupportDepth; delete g.ctbSupportWidth; delete g.offballMovementWeights;
        delete g.passLeadSupport;
      } else {
        g.ctbSupportDepth = OTHER_DOSE.ctbDepth;
        g.ctbSupportWidth = OTHER_DOSE.ctbWidth;
        g.offballMovementWeights = [...OTHER_DOSE.obmMatrix];
        g.passLeadSupport = LEAD_DOSE;
      }
    }
  }
};
const crossWalk = (seed: number, c: CrossCell): string => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...PERCEPT_FLAGS,
    dvDeliveryValue: c.dv, dlcDeliveryChoice: c.dlc, ptpPassLead: c.ptp,
    dlcStrikePlane: c.sp,
  });
  armOthers(m, c.others);
  armDv(m, c.gene);
  while (!m.finished) m.step(DT);
  return signature(m);
};
const CROSS_CELLS: readonly CrossCell[] = (() => {
  const cells: CrossCell[] = [];
  for (const dv of [false, true]) {
    for (const dlc of [false, true]) {
      for (const ptp of [false, true]) {
        for (const sp of [false, true]) {
          for (const others of [false, true]) {
            for (const gene of ['absent', 'zero', 'dosed'] as const) {
              cells.push({ dv, dlc, ptp, sp, others, gene });
            }
          }
        }
      }
    }
  }
  return cells;
})();
const K = (
  dv: boolean, dlc: boolean, ptp: boolean, sp: boolean, others: boolean, gene: GeneState,
): string => cellKey({ dv, dlc, ptp, sp, others, gene });
const ALL_OFF = K(false, false, false, false, false, 'absent');

const CROSS_CLAIMS: readonly {
  name: string; a: string; b: string; equal: boolean; semantics: string;
}[] = [
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `DORMANT-ALL · dv gene ${gene} · neighbours dosed`,
    a: K(false, false, false, false, true, gene), b: ALL_OFF,
    equal: true,
    semantics: 'all four flags OFF: no gene bank of any seam can be read, so every gene '
      + 'state collapses onto the incumbent world.',
  })),
  {
    name: '⭐ A-DV-ALONE-INERT · neighbours DOSED · DV genes ABSENT',
    a: K(true, false, false, false, true, 'absent'), b: ALL_OFF,
    equal: true,
    semantics: '⭐ THE TWO-DOORS GATE (#228) in this seam\'s form: dvDeliveryValue ARMED with '
      + 'the banked passLeadSupport / obm / ctbSupport banks FULLY DOSED and its OWN genes '
      + 'ABSENT — byte-identical to ALL-OFF. Arming this door can never spend a bank it was '
      + 'not given the key to.',
  },
  {
    name: '⭐ A-DV-ZERO-INERT · neighbours DOSED · DV genes at ZERO',
    a: K(true, false, false, false, true, 'zero'), b: ALL_OFF,
    equal: true,
    semantics: '⭐ THE ZERO-POINT, CROSSED: with the genes PRESENT AT ZERO the arithmetic is '
      + 'live (`s − (+0)`) and the world is still the incumbent\'s, byte for byte, even with '
      + 'every neighbour bank dosed. Unlike the strike plane\'s door, HERE zero IS off.',
  },
  {
    name: '⭐ A-OTHER-GENES-INVISIBLE · DV fully live, the other doors shut',
    a: K(true, false, false, false, true, 'dosed'),
    b: K(true, false, false, false, false, 'dosed'),
    equal: true,
    semantics: 'DV FULLY ARMED and biting — and the banked banks make NO difference to it '
      + 'whatsoever, because their own flags are shut.',
  },
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-PTP-UNTOUCHED-BY-DV · ptp armed alone · dv gene ${gene}`,
    a: K(false, false, true, false, true, gene),
    b: K(false, false, true, false, true, 'absent'),
    equal: true,
    semantics: '⭐ the converse door: with dvDeliveryValue SHUT, DV\'s genes are unreadable at '
      + 'any value — the banked PTP seat delivers exactly what it delivered before this stage '
      + 'existed.',
  })),
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-DLC-UNTOUCHED-BY-DV · dlc armed alone · dv gene ${gene}`,
    a: K(false, true, false, false, true, gene),
    b: K(false, true, false, false, true, 'absent'),
    equal: true,
    semantics: '⭐ the same converse for the banked two-point contest.',
  })),
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-SP-UNTOUCHED-BY-DV · strike plane armed alone · dv gene ${gene}`,
    a: K(false, false, false, true, true, gene),
    b: K(false, false, false, true, true, 'absent'),
    equal: true,
    semantics: '⭐ the same converse for the banked ground strike plane.',
  })),
  // ---- ⭐⭐ THE INTERACTION CLAIM: one pricer, every delivery seam ------------
  {
    name: '⭐⭐ DV-BITES-ON-FEET · dv dosed alone vs all-off',
    a: K(true, false, false, false, false, 'dosed'), b: ALL_OFF,
    equal: false,
    semantics: '⭐⭐ THE INTERACTION CLAIM, limb 1: the risk price moves the INCUMBENT '
      + 'to-feet loop.',
  },
  {
    name: '⭐⭐ DV-BITES-ON-CONTEST · dv+dlc vs dlc alone (banks dosed)',
    a: K(true, true, false, false, true, 'dosed'), b: K(false, true, false, false, true, 'absent'),
    equal: false,
    semantics: '⭐⭐ limb 2: with the banked TWO-POINT CONTEST open, adding the risk price '
      + 'moves the world — the led candidate is priced by the same law, because it goes '
      + 'through the same pricer.',
  },
  {
    name: '⭐⭐ DV-BITES-ON-PLANE · dv+sp vs sp alone (banks dosed)',
    a: K(true, false, false, true, true, 'dosed'), b: K(false, false, false, true, true, 'absent'),
    equal: false,
    semantics: '⭐⭐ limb 3: with the banked STRIKE PLANE open, adding the risk price moves '
      + 'the world — all nine sampled strikes are priced by the same law.',
  },
  {
    name: '⭐⭐ DV-BITES-ON-FORCED-AIM · dv+ptp vs ptp alone (banks dosed)',
    a: K(true, false, true, false, true, 'dosed'), b: K(false, false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐⭐ limb 4: and on the banked forced aim too. FOUR delivery shapes, ONE risk '
      + 'law, no seam-specific wiring anywhere.',
  },
  {
    name: '⭐ DV-IS-NOT-A-DELIVERY-SEAM · dv-alone-dosed vs dlc-alone-dosed',
    a: K(true, false, false, false, false, 'dosed'),
    b: K(false, true, false, false, true, 'absent'),
    equal: false,
    semantics: '⭐ the falsifier: a world where the chooser PRICES RISK is not a world where '
      + 'he picks between two delivery points. If these were identical one door would be '
      + 'spending the other\'s bank.',
  },
  {
    name: '⭐ DV-IS-NOT-THE-PLANE · dv-alone-dosed vs sp-alone-dosed',
    a: K(true, false, false, false, false, 'dosed'),
    b: K(false, false, false, true, true, 'absent'),
    equal: false,
    semantics: '⭐ and it is not the strike plane either.',
  },
  {
    name: 'ALL-FOUR-ARMED-AND-DOSED bites',
    a: K(true, true, true, true, true, 'dosed'), b: K(false, true, true, true, true, 'absent'),
    equal: false,
    semantics: 'with every delivery door open and every bank dosed, adding THIS door\'s risk '
      + 'price moves the world away from the rest armed alone. (What the combination BUYS is '
      + 'DV-T1\'s exam, not adjudicated here.)',
  },
];

/* ---- ⭐ G-EXPOSURE: the frozen law, re-derived independently on live states --- */
/**
 * Observation, never intervention: on ONE armed match, sample every 15 playing ticks and
 * for every outfielder × every opposition-facing candidate aim, re-derive the exposure
 * from the world's own state with an INDEPENDENT implementation of §LAW and compare it to
 * the module's own output, `Object.is`-exactly.
 *
 * ⚠ WHAT THESE COUNTERS ARE (the b8f5ef0 lesson, applied ex ante): PROBE-SIDE
 * computations on sampled live match states — NOT a tally of prices the BRAIN formed.
 * That the brain computes them is established by code reading (G-FORK / the one-pricer
 * pin) and IN SIMULATION by G-BITE's divergence receipt.
 */
const exposureLaw = (seed: number, percept: boolean): {
  measuredOnArm: Arm; samples: number; pairs: number;
  mismatches: number; outOfRange: number; degeneracyChecks: number; degeneracyMismatches: number;
  monotoneChecks: number; monotoneViolations: number;
  meanExposure: number; maxExposure: number; zeroExposurePairs: number;
  meanFlightSeconds: number; pass: boolean;
} => {
  const arm: Arm = percept ? 'armed' : 'plainArmed';
  const m = matchOf(seed, arm);
  let samples = 0;
  let pairs = 0;
  let mismatches = 0;
  let outOfRange = 0;
  let degeneracyChecks = 0;
  let degeneracyMismatches = 0;
  let monotoneChecks = 0;
  let monotoneViolations = 0;
  let sumE = 0;
  let maxE = 0;
  let zeroPairs = 0;
  let sumFlight = 0;
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    tick += 1;
    if (m.phase !== 'playing' || tick % 15 !== 0) continue;
    samples += 1;
    for (const t of m.teams) {
      const opp = m.teams[1 - t.side].players;
      for (const p of t.players) {
        if (p.sentOff) continue;
        for (const mate of t.players) {
          if (mate === p || mate.sentOff) continue;
          const from = p.pos;
          const aim = mate.pos;
          const actual = flightExposure(from, aim, opp);
          // ---- the INDEPENDENT re-derivation of §LAW -------------------------
          let expected = 0;
          for (const o of opp) {
            if (o.sentOff) continue;
            const cp = closestPointOnSegment(from, aim, o.pos);
            if (dist(cp, from) < DV_CLEAR_RADIUS) continue;
            const tFlight = dist(from, cp) / DV_FLIGHT_SPEED;
            const lack = dist(cp, o.pos) - o.topSpeed * tFlight;
            const e = 1 - clamp01(lack / DV_CORRIDOR_SCALE);
            if (e > expected) expected = e;
          }
          if (!Object.is(actual, expected)) mismatches += 1;
          if (!(actual >= 0 && actual <= 1)) outOfRange += 1;
          pairs += 1;
          sumE += actual;
          if (actual > maxE) maxE = actual;
          if (actual === 0) zeroPairs += 1;
          sumFlight += dist(from, aim) / DV_FLIGHT_SPEED;
          // ---- DEGENERACY: with every closer frozen, exposure IS 1 − laneOpenness
          const frozen = opp.map((o) => ({
            pos: o.pos, topSpeed: 0, sentOff: o.sentOff,
          })) as unknown as Player[];
          const still = flightExposure(from, aim, frozen);
          degeneracyChecks += 1;
          if (!Object.is(still, 1 - laneOpenness(from, aim, frozen))) degeneracyMismatches += 1;
          // ---- MONOTONICITY: no body can be made faster and become LESS dangerous
          const doubled = opp.map((o) => ({
            pos: o.pos, topSpeed: o.topSpeed * 2, sentOff: o.sentOff,
          })) as unknown as Player[];
          monotoneChecks += 1;
          if (flightExposure(from, aim, doubled) < actual) monotoneViolations += 1;
        }
      }
    }
  }
  return {
    measuredOnArm: arm,
    samples,
    pairs,
    mismatches,
    outOfRange,
    degeneracyChecks,
    degeneracyMismatches,
    monotoneChecks,
    monotoneViolations,
    meanExposure: round(sumE / Math.max(pairs, 1)),
    maxExposure: round(maxE),
    zeroExposurePairs: zeroPairs,
    meanFlightSeconds: round(sumFlight / Math.max(pairs, 1)),
    pass: pairs > 0 && mismatches === 0 && outOfRange === 0 && degeneracyMismatches === 0
      && monotoneViolations === 0,
  };
};

/* ---- ⭐ G-BELIEF: the zoning and the composition ----------------------------- */
const beliefLaw = (): {
  boundaryMetres: number; boundaryIsHalfLOverThree: boolean; zones: readonly string[];
  slots: number; zoneChecks: number; zoneMismatches: number;
  compositionChecks: number; compositionMismatches: number;
  zeroPointExact: boolean; identityChecks: number; identityViolations: number;
  scaleSource: string; scaleValue: number; pass: boolean;
} => {
  let zoneChecks = 0;
  let zoneMismatches = 0;
  for (let x = -HALF_L; x <= HALF_L; x += 0.25) {
    const expected = x < -(HALF_L / 3) ? 0 : x > HALF_L / 3 ? 2 : 1;
    zoneChecks += 1;
    if (receptionZoneIndex(x) !== expected) zoneMismatches += 1;
  }
  const seat = deliveryValueSeatOf({
    dvExposureWeight: DOSE_EXPOSURE, dvLossBelief: [...DOSE_BELIEF],
  } as TacticalGenome)!;
  const zeroSeat = deliveryValueSeatOf({
    dvExposureWeight: 0, dvLossBelief: [...ZERO_BELIEF],
  } as TacticalGenome)!;
  const rng = new Rng(4242);
  let compositionChecks = 0;
  let compositionMismatches = 0;
  let identityChecks = 0;
  let identityViolations = 0;
  let zeroPointExact = true;
  for (let i = 0; i < 400; i++) {
    const from = { x: rng.range(-HALF_L, HALF_L), y: rng.range(-30, 30) };
    const aim = { x: rng.range(-HALF_L, HALF_L), y: rng.range(-30, 30) };
    const opp = Array.from({ length: 6 }, () => ({
      pos: { x: rng.range(-HALF_L, HALF_L), y: rng.range(-30, 30) },
      topSpeed: rng.range(0, 9), sentOff: false,
    })) as unknown as Player[];
    const localX = aim.x;
    const e = flightExposure(from, aim, opp);
    const want = seat.exposureWeight * e
      + seat.belief[receptionZoneIndex(localX)] * DEFAULT_POLICY.passBase;
    const got = deliveryRiskPrice(seat, from, aim, opp, localX, DEFAULT_POLICY.passBase);
    compositionChecks += 1;
    if (!Object.is(got, want)) compositionMismatches += 1;
    const zero = deliveryRiskPrice(zeroSeat, from, aim, opp, localX, DEFAULT_POLICY.passBase);
    if (!Object.is(zero, 0)) zeroPointExact = false;
    for (const s of [0, 0.37, 1.25, 2.5]) {
      identityChecks += 1;
      if (s - zero !== s) identityViolations += 1;
    }
  }
  return {
    boundaryMetres: round(DV_THIRD_BOUNDARY_LOCAL_X),
    boundaryIsHalfLOverThree: DV_THIRD_BOUNDARY_LOCAL_X === HALF_L / 3,
    zones: DV_ZONES,
    slots: DV_BELIEF_SLOTS,
    zoneChecks,
    zoneMismatches,
    compositionChecks,
    compositionMismatches,
    zeroPointExact,
    identityChecks,
    identityViolations,
    scaleSource: 'W.passBase — the pricer\'s OWN base value of a pass (per-player policy)',
    scaleValue: DEFAULT_POLICY.passBase,
    pass: zoneMismatches === 0 && compositionMismatches === 0 && zeroPointExact
      && identityViolations === 0 && DV_THIRD_BOUNDARY_LOCAL_X === HALF_L / 3
      && DV_BELIEF_SLOTS === 3,
  };
};

/* ---- ⭐ G-BITE (corner read): a dosed belief flips an aggressive vs safe order */
const cornerRead = (seed: number): {
  seeds: number[]; flips: number; exposureFlips: number; pass: boolean;
} => {
  // ⚠ BOTH seeds sit INSIDE the declared receipts interval (BLOCK … READ_SEED) — the
  // G-CROSS matrix's own "re-use the receipts seeds, open no new block" idiom. Walking
  // `seed + 1` would have spilled into the cost read's seed, which is a different
  // interval in the §SEED LEDGER.
  const seeds = [seed, seed - 1];
  let flips = 0;
  let exposureFlips = 0;
  for (const s of seeds) {
    // the SAME world, priced with a flat-zero belief and with a doped OWN-THIRD belief:
    // the aggressive candidate (a reception deep in one's own third, where a loss is
    // dearest) and the safe one must resolve differently
    const flat = matchOf(s, 'zeroArmed');
    const doped = matchOf(s, 'zeroArmed');
    armDv(doped, 'dosed', [1, 0, 0]);
    for (const t of doped.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.dvExposureWeight = 0; // the BELIEF limb alone
      }
    }
    while (!flat.finished) flat.step(DT);
    while (!doped.finished) doped.step(DT);
    if (signature(flat) !== signature(doped)) flips += 1;
    // and the EXPOSURE limb alone, on the same fixture
    const expo = matchOf(s, 'zeroArmed');
    for (const t of expo.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.dvExposureWeight = 1;
      }
    }
    while (!expo.finished) expo.step(DT);
    if (signature(expo) !== signature(flat)) exposureFlips += 1;
  }
  return {
    seeds,
    flips,
    exposureFlips,
    pass: flips === seeds.length && exposureFlips === seeds.length,
  };
};

/* ---- G-RNG (a): an armed, dosed risk price draws zero rng -------------------- */
const seamRng = (seed: number): {
  before: number; after: number; priced: number; pass: boolean;
} => {
  const m = matchOf(seed, 'armed');
  for (let i = 0; i < 400; i++) m.step(DT);
  const before = (m.rng as unknown as { s: number }).s;
  let priced = 0;
  for (const t of m.teams) {
    const opp = m.teams[1 - t.side].players;
    const seat = deliveryValueSeatOf(t.effGenome);
    if (seat === null) continue;
    for (const p of t.players) {
      if (p.sentOff) continue;
      for (const mate of t.players) {
        if (mate === p || mate.sentOff) continue;
        deliveryRiskPrice(
          seat, p.pos, mate.pos, opp, t.localX(mate.pos.x), DEFAULT_POLICY.passBase,
        );
        priced += 1;
      }
    }
  }
  const after = (m.rng as unknown as { s: number }).s;
  return { before, after, priced, pass: before === after && priced > 0 };
};

/* ---- G-RNG (b): the genome opt-in draws NOTHING when off --------------------- */
const evoRng = (): {
  genomesIdentical: boolean; rngStateIdentical: boolean; genesStayedAbsent: boolean;
  optInDraws: boolean; ptpStreamUnmoved: boolean; crossoverOrderHeld: boolean;
  beliefWidthHeld: boolean; crossoverCopiesNotAliases: boolean;
  sActual: number; sHead: number;
} => {
  const headMutate = (g: TacticalGenome, rng: Rng, rate: number, scale: number): TacticalGenome => {
    const out = { ...g };
    for (const k of GENE_KEYS) if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
    return out;
  };
  const headCross = (a: TacticalGenome, b: TacticalGenome, rng: Rng): TacticalGenome => {
    const out = {} as TacticalGenome;
    for (const k of GENE_KEYS) {
      const r = rng.next();
      out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2;
    }
    return out;
  };
  const rngA = new Rng(616161);
  const rngH = new Rng(616161);
  let a0 = randomGenome(new Rng(11));
  let a1 = randomGenome(new Rng(22));
  let h0: TacticalGenome = { ...a0 };
  let h1: TacticalGenome = { ...a1 };
  for (let gen = 0; gen < 8; gen++) {
    a0 = mutateGenome(a0, rngA, { rate: 0.45, scale: 0.14 });
    a1 = mutateGenome(a1, rngA, { rate: 0.4, scale: 0.08 });
    h0 = headMutate(h0, rngH, 0.45, 0.14);
    h1 = headMutate(h1, rngH, 0.4, 0.08);
    a0 = mutateGenome(crossoverGenomes(a0, a1, rngA), rngA, { rate: 0.5, scale: 0.15 });
    h0 = headMutate(headCross(h0, h1, rngH), rngH, 0.5, 0.15);
  }
  const sActual = (rngA as unknown as { s: number }).s;
  const sHead = (rngH as unknown as { s: number }).s;
  const rngOn = new Rng(616161);
  let gOn = randomGenome(new Rng(11));
  for (let gen = 0; gen < 8; gen++) {
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolveDeliveryValue: true });
  }
  const ptpOnly = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
    rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
    evolvePassLeadSupport: true,
  });
  const both = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
    rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
    evolvePassLeadSupport: true, evolveDeliveryValue: true,
  });
  const p0 = { ...randomGenome(new Rng(3)), passLeadSupport: 0.3, dvLossBelief: [0.2, 0.3, 0.4] };
  const p1 = { ...randomGenome(new Rng(4)), passLeadSupport: 0.8, dvLossBelief: [0.7, 0.6, 0.5] };
  const xPtp = crossoverGenomes(
    p0, p1, new Rng(31), false, false, false, false, true, true, true,
  );
  const xBoth = crossoverGenomes(
    p0, p1, new Rng(31), false, false, false, false, true, true, true, true,
  );
  const carried = crossoverGenomes(p0, randomGenome(new Rng(9)), new Rng(5));
  return {
    genomesIdentical: GENE_KEYS.every((k) => a0[k] === h0[k] && a1[k] === h1[k]),
    rngStateIdentical: sActual === sHead,
    genesStayedAbsent: a0.dvExposureWeight === undefined && a0.dvLossBelief === undefined
      && a1.dvExposureWeight === undefined && a1.dvLossBelief === undefined,
    optInDraws: typeof gOn.dvExposureWeight === 'number'
      && Array.isArray(gOn.dvLossBelief) && gOn.dvLossBelief.length === DV_BELIEF_SLOTS,
    ptpStreamUnmoved: both.passLeadSupport === ptpOnly.passLeadSupport
      && both.ctbSupportDepth === ptpOnly.ctbSupportDepth
      && both.ctbSupportWidth === ptpOnly.ctbSupportWidth,
    crossoverOrderHeld: xBoth.passLeadSupport === xPtp.passLeadSupport
      && typeof xBoth.dvExposureWeight === 'number',
    beliefWidthHeld: Array.isArray(xBoth.dvLossBelief)
      && xBoth.dvLossBelief.length === DV_BELIEF_SLOTS,
    crossoverCopiesNotAliases: carried.dvLossBelief !== p0.dvLossBelief
      && JSON.stringify(carried.dvLossBelief) === JSON.stringify(p0.dvLossBelief),
    sActual,
    sHead,
  };
};

/* ---- G-FORK: the READ-FORK INVENTORY, every src occurrence classed ----------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});
const FORK_LINE = 'const dvSeat = match.dvDeliveryValue ? deliveryValueSeatOf(g) : null;';
const PRICE_CALL =
  ': s - deliveryRiskPrice(dvSeat, p.pos, aim, opp.players, team.localX(aim.x), W.passBase);';
const forkTable = (): {
  sites: { file: string; line: number; kind: string; text: string }[];
  flagForks: number; priceSites: number; returnSites: number;
  performPassStatements: number; groundCandidateDecls: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  const TOKENS =
    /dvDeliveryValue|dvSeat|deliveryValueSeat|deliveryRiskPrice|flightExposure|receptionZone|dvExposureWeight|dvLossBelief|DV_|sDv/;
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      const t = text.trim();
      if (!TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === FORK_LINE ? 'FLAG_FORK'
        : t === PRICE_CALL.trim() ? 'RISK_PRICE'
          : t === 'const sDv = dvSeat === null ? s' ? 'RISK_PRICE_HEAD'
            : t === 'return { s: sDv, lane, open, gain, mul };' ? 'PRICER_RETURN'
              : /^readonly dvDeliveryValue: boolean;$/.test(t) ? 'FIELD'
                : /^dvDeliveryValue\?: boolean;$/.test(t) ? 'CONFIG'
                  : /this\.dvDeliveryValue = cfg\.dvDeliveryValue \?\? false;/.test(t) ? 'INIT'
                    : /'dvDeliveryValue'/.test(t) ? 'UNION_KEY'
                      : /^(import |\} from |\s*DV_|\s*dv[A-Z])/.test(t)
                        || /from '\.\/deliveryValueSeat'/.test(t) ? 'IMPORT_OR_DECL'
                        : f.endsWith('deliveryValueSeat.ts') ? 'SEAT_BODY'
                          : f.endsWith('genome.ts') ? 'GENOME_BODY'
                            : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  const flagForks = sites.filter((s) => s.kind === 'FLAG_FORK');
  const price = sites.filter((s) => s.kind === 'RISK_PRICE');
  const ret = sites.filter((s) => s.kind === 'PRICER_RETURN');
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const strikes = (brain.match(/match\.performPass\(/g) ?? []).length;
  const decls = (brain.match(/const groundCandidate = \(/g) ?? []).length;
  return {
    sites,
    flagForks: flagForks.length,
    priceSites: price.length,
    returnSites: ret.length,
    performPassStatements: strikes,
    groundCandidateDecls: decls,
    pass: flagForks.length === 1 && flagForks[0].file.endsWith('src/ai/PlayerBrain.ts')
      && price.length === 1 && price[0].file.endsWith('PlayerBrain.ts')
      && ret.length === 1
      && sites.filter((s) => s.kind === 'OTHER').length === 0
      // ZERO new strike statements, and the ONE shared pricer is still ONE
      && strikes === 3 && decls === 1,
  };
};

/* ---- G-TRACE: every constant back to its source line, VERBATIM --------------- */
const TRACE_LINES: readonly { file: string; line: string; what: string }[] = [
  {
    file: 'src/ai/passLeadSeat.ts',
    what: '⭐ THE FLIGHT SPEED — imported, not re-typed: the banked PTP-T0 declaration',
    line: 'export const PTP_FLIGHT_SPEED = 18;',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐ …whose own source is the through-ball loop\'s divisor, untouched',
    line: 'const flight = dist(p.pos, mate.pos) / 18;',
  },
  {
    file: 'src/ai/perception.ts',
    what: '⭐⭐ THE CORRIDOR SCALE (4) — laneOpenness\'s own metre normalizer, VERBATIM',
    line: 'worst = Math.min(worst, clamp01(d / 4));',
  },
  {
    file: 'src/ai/perception.ts',
    what: '⭐⭐ THE CLEAR-THE-KICKER GUARD (1.5) — laneOpenness\'s own, VERBATIM',
    line: 'if (dist(cp, from) < 1.5) continue;',
  },
  {
    file: 'src/ai/perception.ts',
    what: '⭐ the corridor family\'s own closest-approach geometry, which this limb reuses',
    line: 'const cp = closestPointOnSegment(from, to, o.pos);',
  },
  {
    file: 'src/ai/deliveryValueSeat.ts',
    what: '⭐⭐ THE ZONING — RE-DERIVED from the pitch constant, never typed',
    line: 'export const DV_THIRD_BOUNDARY_LOCAL_X = HALF_L / 3;',
  },
  {
    file: 'src/sim/types.ts',
    what: '⭐ THE VALUE SCALE — the pricer\'s own base value of a pass',
    line: '  passBase: 0.2,',
  },
  // ---- the UNTOUCHED incumbents ----------------------------------------------
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the incumbent to-feet candidate call, untouched',
    line: 'const feet = groundCandidate(mate, aim, d);',
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the banked LED candidate call, untouched',
    line: 'const ledCand = groundCandidate(mate, ledBall.aim, d);',
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the banked STRIKE-PLANE candidate call, untouched',
    line: 'const planeCand = groundCandidate(mate, strike.aim, d);',
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the banked led-STRIKE statement, untouched',
    line: 'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));',
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the loft\'s own `d > 24` gate, untouched',
    line: 'if (d > 24 && !layingOff) {',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: 'the MakeRun through-ball licence guard, untouched',
    line: "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
  },
  {
    file: 'src/ai/whetherEye.ts', what: '⚠ the #248 hold-table debt — NOT this round\'s',
    line: 'export function whetherEyeDecision(',
  },
];
const traceGate = (): { rows: { what: string; file: string; found: boolean }[]; pass: boolean } => {
  const rows = TRACE_LINES.map((t) => ({
    what: t.what, file: t.file, found: readFileSync(t.file, 'utf8').includes(t.line),
  }));
  return { rows, pass: rows.every((r) => r.found) };
};

/* ---- ⭐⭐ G-NOTABLE: the #247 split, held by grep ---------------------------- */
const notableGate = (): {
  hazardsChecked: number; artifactNameHits: string[]; valueHits: string[];
  loaderHits: string[]; pass: boolean;
} => {
  const table = JSON.parse(readFileSync(TRUE_TABLE_PATH, 'utf8')) as {
    result: { census: { yardstick: {
      zones: Record<string, { hazard: number }>;
      relative: Record<string, number>;
      baselineHazardAllZones: number;
    } } };
  };
  const y = table.result.census.yardstick;
  const values = [
    ...Object.values(y.zones).map((z) => z.hazard),
    ...Object.values(y.relative),
    y.baselineHazardAllZones,
  ];
  const artifactNameHits: string[] = [];
  const valueHits: string[] = [];
  const loaderHits: string[] = [];
  for (const f of srcFiles('src')) {
    const text = readFileSync(f, 'utf8');
    if (text.includes('dv-c0-loss-cost') || text.includes('truth-table')) {
      artifactNameHits.push(f);
    }
    for (const v of values) {
      if (text.includes(String(v)) || text.includes(String(v * 100))) {
        valueHits.push(`${f}::${v}`);
      }
    }
  }
  // the DV seam files load NO artifact at all (a4World's A4 tables are a pre-existing,
  // separately-recorded item on #248's ledger and are deliberately out of scope here)
  for (const f of [
    'src/ai/deliveryValueSeat.ts', 'src/evolution/genome.ts', 'src/ai/PlayerBrain.ts',
  ]) {
    const code = readFileSync(f, 'utf8').split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    if (code.includes('readFileSync') || code.includes('docs/') || code.includes('import(')) {
      loaderHits.push(f);
    }
  }
  return {
    hazardsChecked: values.length,
    artifactNameHits,
    valueHits,
    loaderHits,
    pass: artifactNameHits.length === 0 && valueHits.length === 0 && loaderHits.length === 0,
  };
};

/* ---- G-EPI: the seat cannot reach the world ---------------------------------- */
const epiGate = (): {
  namesMatch: boolean; importsMatch: boolean; positionSourceIsThePricers: boolean;
  bannedHits: string[]; pass: boolean;
} => {
  const seat = readFileSync('src/ai/deliveryValueSeat.ts', 'utf8');
  const code = seat.split('\n').filter((l) => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const banned = ['riskTolerance', 'passBias', 'attrs.', 'traits', 'Math.random', 'match.']
    .filter((b) => code.includes(b));
  return {
    namesMatch: !code.includes('Match'),
    importsMatch: !seat.includes("from '../sim/Match'"),
    positionSourceIsThePricers: brain.includes('laneOpenness(p.pos, aim, opp.players)')
      && brain.includes('deliveryRiskPrice(dvSeat, p.pos, aim, opp.players,'),
    bannedHits: banned,
    pass: !code.includes('Match') && !seat.includes("from '../sim/Match'")
      && brain.includes('laneOpenness(p.pos, aim, opp.players)')
      && brain.includes('deliveryRiskPrice(dvSeat, p.pos, aim, opp.players,')
      && banned.length === 0,
  };
};

/* ---- G-HYGIENE --------------------------------------------------------------- */
const SEAM_FILES = [
  'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/deliveryValueSeat.ts',
  'src/ai/PlayerBrain.ts', 'src/evolution/genome.ts',
];
const hygiene = (): Record<string, boolean> => {
  const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  let envDoor = false;
  for (const f of SEAM_FILES) {
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      if (!/dvDeliveryValue|dvExposureWeight|dvLossBelief|deliveryValueSeat|DV_/.test(line)) {
        continue;
      }
      if (/envArmed|EDS_BUNDLE_ARMED|process\.env/.test(line)) envDoor = true;
    }
  }
  const league = new League({ seed: 12_430_910 });
  return {
    explicitHardFalse: matchSrc.includes('this.dvDeliveryValue = cfg.dvDeliveryValue ?? false;'),
    absentFromA4World: !a4.includes('dvDeliveryValue') && !a4.includes('dvLossBelief')
      && !a4.includes('dvExposureWeight'),
    freshMatchOff: new Match({
      seed: 12_430_910, teamA: team('A', 1), teamB: team('B', 2),
    }).dvDeliveryValue === false,
    leagueMatchOff: league.createMatch(league.nextFixture()!).dvDeliveryValue === false,
    noEnvDoor: !envDoor,
    genesOutsideGeneKeys: !(GENE_KEYS as readonly string[]).includes('dvExposureWeight')
      && !(GENE_KEYS as readonly string[]).includes('dvLossBelief'),
    genesNeverSerializedByRandomGenome:
      !JSON.stringify(randomGenome(new Rng(12_430_911))).includes('dv'),
    beliefDegradesToZero: dvLossBeliefVector({} as TacticalGenome).every((v) => v === 0)
      && dvExposureWeightOf({} as TacticalGenome) === 0,
  };
};

/* ---- G-PINS ------------------------------------------------------------------ */
const pinTable = (): {
  rows: { pin: string; where: string; held: boolean }[]; pass: boolean;
} => {
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const PTP =
    'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
  const DLC =
    'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
  const SP =
    'const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
  const rows = [
    { pin: 'PTP-T0 G-FORK line, exact text, in src AND in its test', where: 'tests/ptpPassLead.test.ts',
      held: brain.includes(PTP) && readFileSync('tests/ptpPassLead.test.ts', 'utf8').includes(`'${PTP}',`) },
    { pin: 'DLC-T0 G-FORK line, exact text, in src AND in its test', where: 'tests/dlcDeliveryChoice.test.ts',
      held: brain.includes(DLC) && readFileSync('tests/dlcDeliveryChoice.test.ts', 'utf8').includes(`'${DLC}',`) },
    { pin: 'DLC-T0s G-FORK line, exact text, in src AND in its test', where: 'tests/dlcStrikePlane.test.ts',
      held: brain.includes(SP) && readFileSync('tests/dlcStrikePlane.test.ts', 'utf8').includes(SP) },
    { pin: 'DLC-T0 ZERO-NEW-STRIKE pin: `match.performPass(` exactly 3×', where: 'tests/dlcDeliveryChoice.test.ts',
      held: (brain.match(/match\.performPass\(/g) ?? []).length === 3 },
    { pin: 'the ONE `groundCandidate` declaration (both no-taste pins depend on it)', where: 'tests/dlcDeliveryChoice.test.ts + dlcStrikePlane.test.ts',
      held: (brain.match(/const groundCandidate = \(/g) ?? []).length === 1 },
    { pin: 'the three banked candidate CALLS, verbatim', where: 'tests/dlc*.test.ts',
      held: brain.includes('const feet = groundCandidate(mate, aim, d);')
        && brain.includes('const ledCand = groundCandidate(mate, ledBall.aim, d);')
        && brain.includes('const planeCand = groundCandidate(mate, strike.aim, d);') },
    { pin: 'the strike plane\'s PRECEDENCE GUARD, verbatim', where: 'tests/dlcStrikePlane.test.ts',
      held: brain.includes('      if (spSeat !== null && dlcSeat === null && ptpSeat === null) {') },
    { pin: 'the O1 wind-up\'s pinned strike statements', where: 'tests/o1PassWindup.test.ts',
      held: brain.includes('match.armPendingPass(p, passMate!, offsideExemptKick);')
        && brain.includes('else match.performPass(p, passMate!, offsideExemptKick);') },
    { pin: 'the production fingerprint', where: '13 test files + G-IDENT here',
      held: true },
  ];
  return { rows, pass: rows.every((r) => r.held) };
};

/* ---- ⭐ REPORTED (a): THE TRUTH-DOSED SMOKE (the DV-T1 mechanism, demonstrated) */
/**
 * ⭐⭐ THE TRUTH-DOSING MECHANISM, EXECUTED HERE SO DV-T1 INHERITS IT LITERALLY:
 * the INSTRUMENT reads DV-C0's committed artifact, takes `yardstick.zones[z].hazard` in
 * the frozen `DV_ZONES` order, and WRITES those three numbers into `dvLossBelief` on all
 * three genome views of both teams. The values travel INSTRUMENT → GENES at exam time.
 * They never travel CODE → TABLE: `src/**` has no idea the census exists (G-NOTABLE).
 *
 * ⚠ DESCRIPTIVE ONLY. Two arms of ONE match seed, no control, no CI, no verdict — it
 * exists to show the repricing IN ACTION and to publish the delivered mix beside the
 * zero-belief arm. DV-T1 is the exam.
 */
const truthDose = (): { belief: number[]; source: string; zones: readonly string[] } => {
  const table = JSON.parse(readFileSync(TRUE_TABLE_PATH, 'utf8')) as {
    result: { census: { yardstick: { zones: Record<string, { hazard: number }> } } };
  };
  const zones = table.result.census.yardstick.zones;
  return {
    belief: DV_ZONES.map((z) => zones[z].hazard),
    source: `${TRUE_TABLE_PATH} → result.census.yardstick.zones[z].hazard, in DV_ZONES order`,
    zones: DV_ZONES,
  };
};
const dosedSmoke = (seed: number): {
  truthDose: { belief: number[]; source: string; zones: readonly string[] };
  arms: { arm: string; passes: number; zoneShares: number[]; meanExposure: number;
    meanRiskPrice: number; signature: string }[];
  divergedFromZeroArm: boolean;
} => {
  const dose = truthDose();
  const armRow = (label: string, belief: readonly number[], exposureW: number) => {
    const m = matchOf(seed, 'zeroArmed');
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.dvExposureWeight = exposureW;
        g.dvLossBelief = [...belief];
      }
    }
    // observation only: wrap the strike to record what was actually delivered
    const zoneCounts = [0, 0, 0];
    let passes = 0;
    let sumExposure = 0;
    let sumPrice = 0;
    const original = m.performPass.bind(m);
    (m as unknown as { performPass: typeof m.performPass }).performPass = ((
      passer: Player, target: Player, ...rest: unknown[]
    ) => {
      const t = m.teams[passer.side];
      const opp = m.teams[1 - passer.side].players;
      const seat = deliveryValueSeatOf(t.effGenome);
      if (seat !== null) {
        const localX = t.localX(target.pos.x);
        zoneCounts[receptionZoneIndex(localX)] += 1;
        sumExposure += flightExposure(passer.pos, target.pos, opp);
        sumPrice += deliveryRiskPrice(
          seat, passer.pos, target.pos, opp, localX, DEFAULT_POLICY.passBase,
        );
        passes += 1;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (original as any)(passer, target, ...rest);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
    while (!m.finished) m.step(DT);
    return {
      arm: label,
      passes,
      zoneShares: zoneCounts.map((c) => round(c / Math.max(passes, 1))),
      meanExposure: round(sumExposure / Math.max(passes, 1)),
      meanRiskPrice: round(sumPrice / Math.max(passes, 1), 6),
      signature: signature(m),
    };
  };
  const arms = [
    armRow('BELIEF-ZERO (the incumbent map)', ZERO_BELIEF, 0),
    armRow('⭐ TRUTH-DOSED (the census hazards, written by the instrument)', dose.belief, 0),
    armRow('⭐ TRUTH-DOSED + EXPOSURE at 1', dose.belief, 1),
  ];
  return {
    truthDose: dose,
    arms,
    divergedFromZeroArm: arms[1].signature !== arms[0].signature
      && arms[2].signature !== arms[1].signature,
  };
};

/* ---- REPORTED (b): the CHOOSER-COST reading (per-tick, ex ante) --------------- */
/**
 * ⚠ NOT LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL. The armed arm is a DIVERGED WORLD and
 * simulates a DIFFERENT NUMBER OF TICKS, so PER-ARM TICK COUNTS are published, the
 * HEADLINE is ms/TICK and total wall is CONTEXT. The NOISE FLOOR is the instrument's own
 * control pair (`off` vs `bornArmed`: identical arithmetic, identical tick count).
 * ⭐ THIS SEAM'S COST LEVER is the exposure scan: one loop over the opposition PER PRICED
 * CANDIDATE. With the strike plane also armed that is 9 scans per support mate — named
 * here, not pulled.
 */
const COST_REPEATS = 3;
const costReading = (seed: number): {
  repeats: number;
  arms: { arm: string; ticks: number; ticksStableAcrossRepeats: boolean; minMs: number;
    msPerTick: number; perTickVsOffPct: number | null;
    totalWallVsOffPctContextOnly: number | null }[];
  tickCountsEqualAcrossArms: boolean;
  headlinePerTick: { bornArmedVsOffPct: number; zeroArmedVsOffPct: number; dosedVsOffPct: number };
  noiseFloorPerTickPct: number;
  dosedResolvedAboveNoiseFloor: boolean;
} => {
  const timeOne = (arm: Arm): { ms: number; ticks: number } => {
    const m = matchOf(seed, arm);
    let ticks = 0;
    const t0 = Date.now();
    while (!m.finished) { m.step(DT); ticks += 1; }
    return { ms: Date.now() - t0, ticks };
  };
  const arms: Arm[] = ['off', 'bornArmed', 'zeroArmed', 'armed'];
  const raw = arms.map((arm) => {
    let best = Number.POSITIVE_INFINITY;
    let ticks = -1;
    let stable = true;
    for (let r = 0; r < COST_REPEATS; r++) {
      const one = timeOne(arm);
      if (ticks >= 0 && one.ticks !== ticks) stable = false;
      ticks = one.ticks;
      best = Math.min(best, one.ms);
    }
    return {
      arm, ticks, ticksStableAcrossRepeats: stable, minMs: best,
      msPerTick: round(best / Math.max(ticks, 1), 6),
    };
  });
  const offMs = raw[0].minMs;
  const offPerTick = raw[0].msPerTick;
  const pct = (x: number, base: number): number => round(((x - base) / base) * 100, 2);
  const rows = raw.map((r, i) => ({
    ...r,
    perTickVsOffPct: i === 0 ? null : pct(r.msPerTick, offPerTick),
    totalWallVsOffPctContextOnly: i === 0 ? null : pct(r.minMs, offMs),
  }));
  const born = pct(raw[1].msPerTick, offPerTick);
  const zero = pct(raw[2].msPerTick, offPerTick);
  const dosed = pct(raw[3].msPerTick, offPerTick);
  const noiseFloor = round(Math.abs(born), 2);
  return {
    repeats: COST_REPEATS,
    arms: rows,
    tickCountsEqualAcrossArms: raw[0].ticks === raw[1].ticks && raw[0].ticks === raw[2].ticks,
    headlinePerTick: { bornArmedVsOffPct: born, zeroArmedVsOffPct: zero, dosedVsOffPct: dosed },
    noiseFloorPerTickPct: noiseFloor,
    dosedResolvedAboveNoiseFloor: Math.abs(dosed) > noiseFloor,
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; zeroArmed: string; armed: string; plainArmed: string;
    plainZeroArmed: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean;
    zeroIdentical: boolean; plainZeroIdentical: boolean;
    diverged: boolean; bareDiverged: boolean;
  }[];
  for (let k = 0; k < N; k++) {
    const seed = BLOCK + k;
    const absent = walk(seed, 'absent');
    const off = walk(seed, 'off');
    const plain = walk(seed, 'plain');
    const plainOff = walk(seed, 'plainOff');
    const born = walk(seed, 'bornArmed');
    const zero = walk(seed, 'zeroArmed');
    const armed = walk(seed, 'armed');
    const plainArmed = walk(seed, 'plainArmed');
    const plainZero = walk(seed, 'plainZeroArmed');
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, zeroArmed: zero, armed,
      plainArmed, plainZeroArmed: plainZero,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      zeroIdentical: zero === absent,
      plainZeroIdentical: plainZero === plain,
      diverged: armed !== absent,
      bareDiverged: plainArmed !== plain,
    });
  }
  const crossRows = [] as { seed: number; cells: Record<string, string> }[];
  for (let k = 0; k < CROSS_N; k++) {
    const seed = BLOCK + k;
    const cells: Record<string, string> = {};
    for (const c of CROSS_CELLS) cells[cellKey(c)] = crossWalk(seed, c);
    crossRows.push({ seed, cells });
  }
  const claims = CROSS_CLAIMS.map((cl) => {
    const seedsHeld = crossRows.filter((r) => (
      cl.equal ? r.cells[cl.a] === r.cells[cl.b] : r.cells[cl.a] !== r.cells[cl.b]
    )).length;
    return { ...cl, seeds: crossRows.length, seedsHeld, pass: seedsHeld === crossRows.length };
  });
  return {
    seeds: { block: BLOCK, n: N, first: BLOCK, last: BLOCK + N - 1 },
    rows,
    crossing: {
      cells: CROSS_CELLS.map(cellKey),
      seeds: { n: CROSS_N, first: BLOCK, last: BLOCK + CROSS_N - 1 },
      claims,
      rows: crossRows,
    },
  };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== DV T0 RISK-PRICING RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [dv-t0] run A digest ${digestA}\n  [dv-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [dv-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [dv-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [dv-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

process.stderr.write('  [dv-t0] G-EXPOSURE (percept)...\n');
const expoPercept = exposureLaw(READ_SEED, true);
process.stderr.write('  [dv-t0] G-EXPOSURE (bare)...\n');
const expoBare = exposureLaw(READ_SEED, false);
const belief = beliefLaw();
const corner = cornerRead(READ_SEED);
const seamDraws = seamRng(READ_SEED);
const evo = evoRng();
const fork = forkTable();
const trace = traceGate();
const notable = notableGate();
const epi = epiGate();
const hyg = hygiene();
const pins = pinTable();
process.stderr.write('  [dv-t0] REPORTED (a) truth-dosed smoke...\n');
const smoke = dosedSmoke(DOSE_SEED);
process.stderr.write('  [dv-t0] REPORTED (b) chooser-cost reading...\n');
const cost = costReading(COST_SEED);
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const intervals = [
    { name: 'DV-T0 receipts + exposure/belief/corner reads', first: BLOCK, last: READ_SEED },
    { name: 'DV-T0 REPORTED chooser-cost reading', first: COST_SEED, last: COST_SEED },
    { name: 'DV-T0 REPORTED truth-dosed smoke', first: DOSE_SEED, last: DOSE_SEED },
    { name: 'DV-T0 test-file seeds (tests/dvDeliveryValue.test.ts)', first: 12_430_900, last: 12_430_911 },
  ] as const;
  const checked = intervals.map((iv) => {
    const clashes = CONSUMED.filter((c) => !(iv.last < c.range[0] || iv.first > c.range[1]));
    return { ...iv, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
  });
  return {
    first: BLOCK,
    last: DOSE_SEED,
    intervals: checked,
    consumedBlocks: CONSUMED,
    collisions: checked.flatMap((iv) => iv.collisions),
    pass: checked.every((iv) => iv.pass),
    semantics: 'EVERY interval this stage consumes is machine-checked against the COMPLETE '
      + 'consumed ledger, which now includes DV-C0\'s four blocks (smoke 12,429,000–011 · '
      + 'guard 050–099 · census+reserve 100–899 · the G-WORLD construction seed 999), read '
      + 'off that stage\'s committed artifact ledger.',
  };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gZero = runA.rows.every((r) => r.zeroIdentical && r.plainZeroIdentical);
const gExposure = expoPercept.pass && expoBare.pass;
const gBite = runA.rows.every((r) => r.diverged && r.bareDiverged) && corner.pass;
const gSeams = runA.crossing.claims
  .filter((c) => c.name.includes('DV-BITES-ON')).every((c) => c.pass);
const gCross = runA.crossing.claims.every((c) => c.pass);
const gRng = seamDraws.pass && evo.genomesIdentical && evo.rngStateIdentical
  && evo.genesStayedAbsent && evo.optInDraws && evo.ptpStreamUnmoved && evo.crossoverOrderHeld
  && evo.beliefWidthHeld && evo.crossoverCopiesNotAliases;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gZero && gExposure && belief.pass
  && gBite && gSeams && gCross && gRng && gHygiene && fork.pass && trace.pass
  && notable.pass && epi.pass && pins.pass && seedDisjoint.pass;

const body = {
  stage: 'DV T0 — the dormant RISK-PRICING seam (`dvDeliveryValue`, flight exposure + the earned loss-cost belief)',
  ruling: '#245 (the map-vs-reality audit; the DELIVERY-VALUE contract) + #246 (method '
    + 'reality\'s, numbers this world\'s, SHAPE the fidelity check) + #247 (⭐⭐ the '
    + 'TRUTH/BELIEF split — the census table is the INSTRUMENT\'s, the player\'s map is '
    + 'EARNED) + #248 (the earned-knowledge ledger; this arc is the PILOT) + #249 (DV-C0 '
    + 'banked; DV-T0 queued) + #181.2 (the standing receipt rule) + #194 (gate semantics '
    + 'stated exactly) + #197-M1 (commit-free hashed body) + #200 (no predicates) + #228 '
    + '(the two-doors lesson, gated from birth) + #236 (no taste term)',
  contract: 'docs/world-model/DELIVERY-VALUE-CONTRACT.md',
  doc: 'docs/world-model/DV-T0-DORMANT-SEAM.md',
  frozenLaw: {
    exposure: {
      flightSpeed: DV_FLIGHT_SPEED,
      corridorScale: DV_CORRIDOR_SCALE,
      clearRadius: DV_CLEAR_RADIUS,
      form: 'exposure(from, aim) = MAX over opponents o (not sent off) of e(o), where '
        + 'cp = closestPointOnSegment(from, aim, o.pos) [laneOpenness\'s own geometry]; o is '
        + 'SKIPPED when dist(cp, from) < 1.5 [laneOpenness\'s own guard]; '
        + 't(o) = dist(from, cp) / 18 [the through-ball loop\'s own flight divisor, imported '
        + 'as the banked PTP_FLIGHT_SPEED]; lack = dist(cp, o.pos) − o.topSpeed · t(o) [the '
        + 'metres he STILL lacks after closing for the WHOLE flight — his capability]; '
        + 'e(o) = 1 − clamp01(lack / 4) [laneOpenness\'s own metre scale]. Zero opponents ⇒ 0. '
        + 'IT DEGENERATES ONTO 1 − laneOpenness AT ZERO CLOSING SPEED, which is what makes it '
        + 'a SHARPENING of the corridor read and not a new sense (measured: G-EXPOSURE). The '
        + 'MAX-at-closest-approach form is this stage\'s declared sharpening of "integrated '
        + 'over the ball\'s travel": a sampled integral would need an invented sample count '
        + 'and an invented kernel, whereas the closest-approach point is where the corridor '
        + 'family ALREADY evaluates a defender against a lane, at ZERO new constants.',
    },
    belief: {
      zones: DV_ZONES,
      slots: DV_BELIEF_SLOTS,
      boundaryLocalX: DV_THIRD_BOUNDARY_LOCAL_X,
      form: 'THREE evolvable per-zone weights in [0,1], BORN ABSENT, applied to the '
        + 'RECEPTION zone of the candidate being priced: localX < −HALF_L/3 ⇒ own · '
        + '> +HALF_L/3 ⇒ final · else middle, in the PASSING (= losing) team\'s frame — the '
        + 'DV-C0 census\'s own zoning, RE-DERIVED from the pitch constant and never typed. '
        + '⭐⭐ THE #247 SPLIT: the census\'s HAZARD VALUES are the INSTRUMENT\'s and are '
        + 'wired into no player (G-NOTABLE greps the whole src tree for the artifact\'s name '
        + 'and for every one of its measured numbers). A team is born knowing NOTHING and can '
        + 'only EARN the map; a wrong belief is legal and is STYLE.',
    },
    composition: {
      valueScale: 'W.passBase (the per-player policy\'s own base value of a pass)',
      defaultValueScale: DEFAULT_POLICY.passBase,
      form: 'score′ = score − dvExposureWeight · exposure(from, aim) − '
        + 'dvLossBelief[zone(aim)] · W.passBase, applied as the LAST statement of the ONE '
        + 'hoisted `groundCandidate` — so the to-feet candidate, the banked LED candidate and '
        + 'all nine banked STRIKE-PLANE candidates are priced by the SAME risk law, '
        + 'downstream of which delivery seam formed them, with no seam-specific wiring '
        + 'anywhere (G-SEAMS). NO taste term beyond the two genes (#236). NO predicate '
        + '(#200): both limbs are continuous, and the zone lookup is a SELECTOR of which '
        + 'evolvable weight is read, never a gate on whether anything happens.',
    },
    zeroPoint: 'GENES ABSENT ⇒ no seat ⇒ the pricer never computes an exposure, never reads '
      + 'a belief and never subtracts — the shipped statements alone (G-BORN, structural). '
      + 'GENES PRESENT AT ZERO ⇒ the code path is LIVE and the subtraction is exactly '
      + '`0·e + 0·v = +0`, and `s − (+0) === s` in IEEE-754 — byte-identical (G-ZERO, '
      + 'arithmetic). Both are MEASURED on every receipt seed in both world shapes.',
    doses: { exposure: DOSE_EXPOSURE, belief: DOSE_BELIEF, leadNeighbour: LEAD_DOSE,
      note: 'CORNER doses for the identity stack only — the exam\'s doses are DV-T1\'s, and '
        + 'its belief dose is the census\'s own TRUE table, written by the instrument (see '
        + 'REPORTED (a), which executes exactly that mechanism here).' },
  },
  gates: {
    gDet: { pass: gDet, digestA, digestB },
    gIdent: {
      pass: gIdentPass, seasons: FINGERPRINT_SEASONS, rows: gIdentRows,
      procedure: 'new League({seed}) → runHeadless toGeneration(generation + 2) → '
        + 'sha256(JSON.stringify(out.league)) — identical to scripts/fingerprint.ts',
      semantics: 'THE RNG-STREAM RECEIPT for the sim path, re-run in full. The shared pricer '
        + 'gained a statement and the genome gained two keys; these baselines were frozen '
        + 'from PRE-change code, so any drift in the flag-off path — a reordered operand, a '
        + 'changed double, an rng draw that moved — would break them.',
    },
    xFpProd: { pass: fpRow.identical, baseline: FINGERPRINT_BASELINE, observed: fpRow.observed },
    gOff: {
      pass: gOff, seeds: N,
      semantics: 'CONFIG EQUIVALENCE ONLY (#194): flag ABSENT ≡ flag FALSE in both the '
        + 'percept-armed and the production-shaped world. Both arms execute the SAME flag-off '
        + 'path, so this cannot and does not prove RNG-stream identity — G-IDENT does.',
    },
    gBorn: {
      pass: gBorn, seeds: N,
      semantics: 'THE ARMS DIFFER IN CODE PATH: armed ⇒ the ARMING RULE is evaluated on every '
        + 'on-ball decision and returns null because both genes are absent, so no exposure is '
        + 'ever computed. Byte-identity to OFF proves the born-absent world inert THROUGH the '
        + 'live branch.',
    },
    gZero: {
      pass: gZero, seeds: N,
      semantics: '⭐ THE STANDING ZERO-POINT DISCIPLINE, and here it is the STRONGER form: '
        + 'the genes are PRESENT at 0, so the seat exists, the exposure IS computed on every '
        + 'priced candidate and the subtraction IS performed — and the world is still the '
        + 'shipped one, byte for byte, in both world shapes, because `0·e + 0·v` is exactly '
        + '+0 and `s − (+0) === s`. ⚠ Unlike the strike plane\'s door (where 0 is a PRESENT '
        + 'gene that bites), under THIS door zero and absence are both inert — and they are '
        + 'inert for DIFFERENT reasons, which is why both are gated.',
    },
    gExposure: {
      pass: gExposure, percept: expoPercept, bare: expoBare,
      semantics: '⭐ THE FROZEN EXPOSURE LAW, re-derived INDEPENDENTLY on sampled live states '
        + 'in both world shapes and compared `Object.is`-exactly (mismatches must be ZERO). '
        + 'Three further checks, all required zero: the reading is in [0,1] on every pair; '
        + 'with every closer FROZEN (topSpeed 0) the reading is EXACTLY `1 − laneOpenness` — '
        + 'the degeneracy that makes this a sharpening of the corridor read rather than a new '
        + 'sense; and DOUBLING every body\'s top speed never LOWERS the reading (monotone in '
        + 'closing capability). ⚠ These are PROBE-SIDE computations on live states, not a '
        + 'tally of prices the BRAIN formed — that is G-FORK (code) plus G-BITE (in-sim).',
    },
    gBelief: {
      ...belief,
      semantics: '⭐ THE ZONING is the census\'s own, re-derived from HALF_L at run time and '
        + 'checked at 0.25 m resolution across the whole pitch; THE COMPOSITION is exactly '
        + '`w·exposure + belief[zone]·passBase` on 400 randomized fixtures, `Object.is`-exact; '
        + 'and the all-zero seat returns EXACTLY +0 with `s − price === s` on every probe '
        + 'value (the IEEE identity behind G-ZERO, isolated).',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      bareDivergedSeeds: runA.rows.filter((r) => r.bareDiverged).length,
      seeds: N,
      cornerRead: corner,
      semantics: 'TWO things. (i) DIVERGENCE: armed with dosed genes the world moves on every '
        + 'seed, in the percept world AND in the bare world. (ii) ⭐ THE CORNER READ: each '
        + 'LIMB ALONE reprices — a belief doped on the OWN THIRD alone (exposure weight 0) '
        + 'moves the world, and an exposure weight of 1 (belief flat zero) moves it too. So '
        + 'neither limb is carried by the other, and the zone gradient is genuinely wired.',
    },
    gSeams: {
      pass: gSeams,
      claims: runA.crossing.claims.filter((c) => c.name.includes('DV-BITES-ON')),
      groundCandidateDeclarations: fork.groundCandidateDecls,
      semantics: '⭐⭐ ONE PRICER, EVERY DELIVERY SEAM. The risk price is the last statement '
        + 'of the ONE hoisted `groundCandidate` (exactly one declaration, machine-counted), '
        + 'so it applies to the incumbent to-feet candidate, the banked LED candidate and all '
        + 'nine banked STRIKE-PLANE candidates identically — downstream of which seam formed '
        + 'them, and with no seam-specific wiring anywhere. MEASURED as four matrix claims: '
        + 'adding this door moves the world on top of the to-feet loop, the two-point contest, '
        + 'the strike plane AND the forced aim.',
    },
    gCross: {
      pass: gCross, cells: CROSS_CELLS.length, seeds: CROSS_N,
      claims: runA.crossing.claims,
      semantics: 'THE DOORS MATRIX (#228), gated from birth: {dv} × {dlc} × {ptp} × {sp} × '
        + '{the neighbours\' banks dosed/absent} × {DV\'s genes absent/zero/dosed} = 96 cells, '
        + 'one FULL match per cell per seed, whole-run signature incl. rng state, inside the '
        + 'G-DET core.',
    },
    gRng: {
      pass: gRng, seam: seamDraws, evolution: evo,
      semantics: 'TWO limbs. (i) THE SEAM: an armed, dosed risk price computed over every '
        + 'body pair on a stepped fixture leaves the match rng state EXACT. (ii) THE GENOME: '
        + 'the two new keys are outside GENE_KEYS, so with the opt-in OFF eight generations of '
        + 'the shipped mutate+crossover reproduce a faithful PRE-GENE re-implementation\'s '
        + 'genomes AND final rng state exactly, the keys stay absent, and no existing opt-in '
        + 'run\'s stream moves (the DV draws sit strictly AFTER the passLeadSupport block). '
        + 'The opt-in DOES draw when asked, the belief materialises at its frozen width, and '
        + 'crossover COPIES parent A\'s belief rather than aliasing it (the OBM-T0 catch).',
    },
    gHygiene: { pass: gHygiene, ...hyg },
    gFork: {
      ...fork,
      semantics: '⭐ THE READ-FORK INVENTORY: exactly ONE `match.dvDeliveryValue` fork in '
        + 'src/**, at the named site, feeding exactly ONE risk-price call inside the ONE '
        + 'shared pricer, with ZERO new strike statements (`match.performPass(` still 3×) and '
        + 'the `groundCandidate` declaration still 1×. Every other src occurrence is '
        + 'enumerated with file:line and class, ZERO unclassified.',
    },
    gTrace: {
      ...trace,
      semantics: 'Every constant back to the line it was taken from, VERBATIM — the flight '
        + 'speed is not even re-typed (the banked symbol is imported), the corridor scale and '
        + 'the near-field guard are laneOpenness\'s own lines, the zoning is re-derived from '
        + 'HALF_L, and the value scale is the pricer\'s own passBase. Plus the UNTOUCHED '
        + 'incumbents: all three banked candidate calls, the banked led-strike statement, the '
        + 'loft\'s d > 24 gate, the through-ball licence guard, and whetherEye (the #248 '
        + 'hold-table debt, explicitly NOT this round\'s).',
    },
    gNotable: {
      ...notable,
      semantics: '⭐⭐ THE #247 SPLIT, HELD BY GREP AND BY TEST. No file in src/** contains '
        + 'the census artifact\'s name, its schema name, or ANY of its measured values (every '
        + 'zone hazard, every relative-shape number and the all-zones baseline, checked as '
        + 'written and as percentages), and no DV seam file contains a loader, a docs/ path '
        + 'or a dynamic import. The values reach a player ONLY when an INSTRUMENT writes them '
        + 'into the belief genes — which is exactly what REPORTED (a) does.',
    },
    gEpi: {
      ...epi,
      semantics: '⭐ NO NEW CHANNEL, closed at the IMPORT LIST rather than by convention: the '
        + 'seat module never names `Match` in executable source and never imports it, so it '
        + 'cannot reach a percept snapshot, a truth channel or anything else. Its position '
        + 'source is the caller\'s own `opp.players` — the SAME array `laneOpenness(p.pos, '
        + 'aim, opp.players)` is called with one statement earlier — so the DV term is exactly '
        + 'as honest, no more and no less, as the corridor read it extends. ⚠ Stated as a '
        + 'LIMIT, not a boast: that read is truth-sourced in both world shapes today, and '
        + 'making the corridor family percept-honest is the percept trunk\'s question, not '
        + 'this stage\'s.',
    },
    gPins: {
      ...pins,
      semantics: 'The §PINS inventory recomputed: all three banked delivery-seam fork lines '
        + '(in src AND in their own test files), the ZERO-NEW-STRIKE count, the ONE '
        + '`groundCandidate` declaration both no-taste pins depend on, the three banked '
        + 'candidate calls, the strike plane\'s precedence guard and the O1 wind-up\'s '
        + 'statements. Not one test file was edited by this stage.',
    },
    gSeed: seedDisjoint,
  },
  reported: {
    truthDosedSmoke: {
      ...smoke,
      semantics: '⭐⭐ THE TRUTH-DOSING MECHANISM DV-T1 INHERITS, EXECUTED HERE. The '
        + 'INSTRUMENT reads DV-C0\'s committed artifact, takes yardstick.zones[z].hazard in '
        + 'the frozen DV_ZONES order, and WRITES those three numbers into `dvLossBelief` on '
        + 'all three genome views of both teams. INSTRUMENT → GENES, at exam time; never CODE '
        + '→ TABLE. ⚠ DESCRIPTIVE ONLY: three arms of ONE match seed, no control, no CI, no '
        + 'verdict. The delivered mix (zone shares of chosen deliveries, mean exposure and '
        + 'mean risk price of the balls actually struck) is published beside the zero-belief '
        + 'arm so the repricing is VISIBLE, and the truth dose is SMALL by construction (the '
        + 'census hazards are ~0.018–0.082, so the belief limb subtracts ~0.4–1.6 % of a '
        + 'pass\'s base value) — an honest fact about the dose, not a finding about the game.',
    },
    chooserCost: {
      ...cost,
      semantics: 'The per-tick form (the b8f5ef0 correction, applied ex ante): per-arm tick '
        + 'counts published, headline ms/TICK, total wall CONTEXT only, and the noise floor '
        + 'taken from the instrument\'s own control pair (`off` vs `bornArmed` — identical '
        + 'arithmetic, identical tick count). Any per-tick effect no larger than the floor is '
        + 'UNRESOLVED by this instrument. ⭐ THE LEVER, named not pulled: the exposure scan is '
        + 'one loop over the opposition PER PRICED CANDIDATE, so with the strike plane also '
        + 'armed it is nine scans per support mate.',
    },
  },
  nonClaims: [
    'NOTHING SHIPS. `dvDeliveryValue` is a hard false in every production path, absent from '
      + 'a4World and from all three play-test worlds; the production fingerprint is unchanged; '
      + 'and even ARMED the world is byte-identical while the genes are absent (G-BORN) or '
      + 'zero (G-ZERO).',
    '⭐⭐ THE CENSUS TABLE IS NOT WIRED INTO ANY PLAYER (#247). This stage adds the BELIEF '
      + 'representation — the programme\'s first evolvable world-price belief (#248.2(v)) — '
      + 'born absent. It does not give any team the map.',
    'NO FOOTBALL EFFECT IS CLAIMED: not on supply, the goal band, interceptions, offside, '
      + 'spacing or watchability. The truth-dosed smoke is an uncontrolled descriptive reading '
      + 'of one seed and adjudicates nothing.',
    'IT DOES NOT CLAIM THE RISK LAW IS RIGHT. The exposure limb\'s closing model is '
      + '`topSpeed · t` — no acceleration, no reaction delay, no facing — and the belief limb '
      + 'is a three-cell map of a pitch. Whether a correct map fixes the #244 deflation is '
      + 'DV-T1\'s question (F-DV-a/b/c), and whether evolution FINDS it is DV-T2\'s.',
    'NO VALUE-SIDE NONLINEARITY AND NO RECEPTION-CONTEXT TERM (contract §4 — named later '
      + 'slices). The loft, the bender, the through ball, the cross and the cutback keep their '
      + 'own incumbent pricing and are untouched by this seam.',
    'THE #248 HOLD-TABLE DEBT IS NOT DISCHARGED HERE. `whetherEye`\'s certified price table '
      + 'remains innate world-value knowledge; that split rides its own future C5-family '
      + 'opening, as recorded.',
    'IT CANNOT AUTHORIZE DV-T1 OR DV-T2; only the commander can (#203).',
  ],
  gatesPass,
};

const envelope = {
  head,
  wallMs,
  outPath: OUT_PATH,
  n: N,
  crossN: CROSS_N,
  block: BLOCK,
  readSeed: READ_SEED,
  costSeed: COST_SEED,
  doseSeed: DOSE_SEED,
  generatedBy: 'npx tsx scripts/probes/dv-t0-risk-pricing.ts',
};

const resultSha256 = sha(canonical(body));
writeFileSync(OUT_PATH, `${JSON.stringify({ envelope, resultSha256, result: body }, null, 2)}\n`);
process.stderr.write(
  `  [dv-t0] gates ${gatesPass ? 'ALL PASS' : '*** SOME FAILED ***'} · resultSha256 ${resultSha256}\n`
  + `  [dv-t0] wrote ${OUT_PATH} (${Math.round(wallMs / 1000)} s)\n`,
);
if (!gatesPass) process.exitCode = 1;
