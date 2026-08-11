/**
 * DLC T0s — THE DORMANT GROUND STRIKE PLANE: the receipts.
 *
 * Stage doc: docs/world-model/DLC-T0S-DORMANT-SEAM.md (frozen BEFORE this ran).
 * Contract:  docs/world-model/DELIVERY-CHOICE-CONTRACT.md §2 M-DLC.1″ (slice ONE-S).
 * Rulings #240 (continuous aim; the gene's magnitude retires) / #241 (控制的是那一脚).
 *
 * Everything is computed IN-PROBE (#181.2). The hashed body is commit-free, timing-free
 * and path-free (#197-M1), so `resultSha256` re-derives at any commit.
 *
 *   G-IDENT      3 league seeds vs the frozen pre-change baselines (the RNG-stream receipt).
 *   G-FP         the 1337 row IS the production fingerprint.
 *   G-OFF        flag ABSENT ≡ flag FALSE, both world shapes, rng state included.
 *   G-BORN       ARMED + gene ABSENT ≡ OFF (the arming rule returns null on a live path).
 *   G-VALUE      ⭐ the #240/#241 MAGNITUDE RETIREMENT, measured: gene 0 ≡ 0.37 ≡ 1, and
 *                none of them is the incumbent world. (This stage's G-ZERO-form: there is
 *                no "zero dose" any more, so the identity that exists is stated and gated.)
 *   G-GRID       ⭐ THE TRACED GRID: reach = the banked projection at FULL weight; the
 *                direction step is the angle it subtends; the power step is the same
 *                length along the bearing; the zero-point member is EXACTLY today's kick.
 *   G-BITE       ARMED + PRESENT diverges, both world shapes; the strike table is REPORTED.
 *   G-WINNER     the argmax entry, through the brain: every winner priced at ITS OWN
 *                receiving point, and BOTH outcomes occur (today's kick and a sampled one).
 *   G-NOTASTE    the #236 amendment: the plane's calls differ in the AIM and nothing else.
 *   G-EPI-MOTION the honesty core, re-gated through THIS stage's arming path.
 *   G-CROSS      the FIVE-door matrix (192 cells), incl. the FROZEN precedence chain.
 *   G-RNG        zero seam draws; genome.ts untouched (8-generation evolution comparison).
 *   G-HYGIENE    Road B: hard false, absent from a4World, no env door, no new gene.
 *   G-FORK       the read-fork inventory, every src occurrence classed, zero unclassified.
 *   G-TRACE      the banked projection verbatim + the untouched incumbents.
 *   G-PINS       the pin inventory, machine-checked in the test files AND in src/**.
 *   G-SEED       seed-block disjointness against the COMPLETE ledger (incl. DLC-T1's).
 *   G-DET        the core runs TWICE, byte-identical digests.
 *   REPORTED     (a) the STRIKE-DISTRIBUTION table (which grid member won each pass);
 *                (b) the CHOOSER-COST reading, per-tick with a stated noise floor.
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
  PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL, passLeadMotion,
} from '../../src/ai/passLeadSeat';
import {
  STRIKE_PLANE_K, STRIKE_PLANE_STEPS, STRIKE_PLANE_ZERO_INDEX,
  groundStrikeGrid, strikePlaneSeatOf, strikeReach,
} from '../../src/ai/strikePlaneSeat';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS,
  crossoverGenomes, mutateGenome, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { decidePlayer } from '../../src/ai/PlayerBrain';
import { opennessAt } from '../../src/ai/perception';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { dist } from '../../src/utils/vec';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/dlc-t0s-strike-plane.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited VERBATIM and UNTRUNCATED from the DLC-T0 committed artifact). */
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: FINGERPRINT_SEED, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ---- seeds: a FRESH block above everything the ledger has consumed ------------ */
const BLOCK = 12_427_000;
const N = Number(process.env.DLCT0S_N ?? 24);
/** ⭐ The FIVE-door matrix is 192 cells, so it runs on the FIRST `CROSS_N` of the SAME
 *  seeds (no new block) and CROSS_N is 2 rather than DLC-T0's 4 — the cell count doubled,
 *  so the seed count halves and the crossing's total match load is unchanged. Declared. */
const CROSS_N = Math.min(N, Number(process.env.DLCT0S_CROSS_N ?? 2));
const READ_SEED = BLOCK + N; //      12,427,024 — grid/winner/EPI-MOTION/smoke reads
const COST_SEED = BLOCK + N + 1; //  12,427,025 — the REPORTED chooser-cost reading
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
  /** ⭐ read off the COMMITTED DLC-T0 artifact's own `gates.seedDisjoint.intervals`. */
  { name: 'DLC-T0 receipts + contest/winner/EPI/smoke read (#237)', range: [12_426_000, 12_426_024] },
  { name: 'DLC-T0 REPORTED chooser-cost reading (#237)', range: [12_426_025, 12_426_025] },
  /** ⭐⭐ read off the COMMITTED DLC-T1 artifacts' own `gates.seedDisjoint.walkedBlocks`
   *  (the battery block is RESERVED to 12,426,727 even though the run walked to 545). */
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_041] },
  { name: 'DLC-T1 delivered-dose read (#239)', range: [12_426_045, 12_426_045] },
  { name: 'DLC-T1 exit-semantics guard band (#239)', range: [12_426_050, 12_426_099] },
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
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
 * ⭐ THE GENE VALUES THIS STAGE WALKS — and the point is that they are the SAME WORLD.
 * `passLeadSupport`'s magnitude retired at #240/#241: under this door the gene GATES
 * PRESENCE and scales NOTHING, so 0, 0.37 and 1 are three names for one arm (G-VALUE).
 * They are walked separately anyway, because "it scales nothing" is a measurement here.
 */
const GENE_ZERO = 0;
const GENE_MID = 0.37;
const GENE_FULL = 1;

type Arm =
  | 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed'
  | 'zeroArmed' | 'midArmed' | 'armed' | 'plainArmed';

/** ⭐ THE ARMING CHECKLIST (#196.3-D6): the gene on ALL THREE views of BOTH teams. */
const armGene = (m: Match, v: number | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (v === null) delete g.passLeadSupport;
      else g.passLeadSupport = v;
    }
  }
};

const matchOf = (seed: number, arm: Arm): Match => {
  const percept = !(arm === 'plain' || arm === 'plainOff' || arm === 'plainArmed');
  const armedFlag = arm === 'bornArmed' || arm === 'zeroArmed' || arm === 'midArmed'
    || arm === 'armed' || arm === 'plainArmed';
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(percept ? PERCEPT_FLAGS : {}),
    ...(arm === 'off' || arm === 'plainOff' ? { dlcStrikePlane: false } : {}),
    ...(armedFlag ? { dlcStrikePlane: true } : {}),
  });
  if (arm === 'zeroArmed') armGene(m, GENE_ZERO);
  if (arm === 'midArmed') armGene(m, GENE_MID);
  if (arm === 'armed' || arm === 'plainArmed') armGene(m, GENE_FULL);
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
/* ⭐⭐ G-CROSS — THE FIVE-DOOR MATRIX (#228, gated from birth)               */
/* ========================================================================== */
/**
 * This seam lands beside FOUR banked doors, and TWO of them — `ptpPassLead` and
 * `dlcDeliveryChoice` — read THE SAME GENE, which makes the crossing the place where the
 * FROZEN PRECEDENCE CHAIN is proved rather than promised:
 *
 *     {sp on/off} × {dlc on/off} × {ptp on/off} × {obm on/off} × {ctb on/off}
 *   × {the OBM/CTB gene banks dosed/absent} × {the shared gene absent/zero/dosed}
 *   = 32 × 2 × 3 = 192 cells, each a FULL match on the same receipt seeds, hashed with
 * the whole-run signature (rng state included). Every claim is stated EX ANTE.
 */
type GeneState = 'absent' | 'zero' | 'dosed';
interface CrossCell {
  sp: boolean; dlc: boolean; ptp: boolean; obm: boolean; ctb: boolean;
  others: boolean; gene: GeneState;
}
/** The neighbours' dose: their OWN domain corners, exactly their probes' convention. */
const OTHER_DOSE = {
  ctbDepth: CTB_GENE_MIN, ctbWidth: CTB_GENE_MAX,
  obmMatrix: ((): number[] => {
    const w = new Array<number>(OBM_WEIGHT_SLOTS).fill(0);
    w[0 * 4 + 0] = OBM_WEIGHT_MIN; // planeDepth   ← carrierPlight (回撤)
    w[1 * 4 + 1] = OBM_WEIGHT_MAX; // planeWidth   ← ownMarker
    w[2 * 4 + 0] = OBM_WEIGHT_MAX; // supportScore ← carrierPlight
    w[3 * 4 + 2] = OBM_WEIGHT_MIN; // runScore     ← targetCongestion
    return w;
  })(),
} as const;
const cellKey = (c: CrossCell): string => `sp${c.sp ? 1 : 0}·dlc${c.dlc ? 1 : 0}`
  + `·ptp${c.ptp ? 1 : 0}·obm${c.obm ? 1 : 0}·ctb${c.ctb ? 1 : 0}`
  + `·others${c.others ? 1 : 0}·gene-${c.gene}`;
const armOthers = (m: Match, on: boolean): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (!on) {
        delete g.ctbSupportDepth; delete g.ctbSupportWidth; delete g.offballMovementWeights;
      } else {
        g.ctbSupportDepth = OTHER_DOSE.ctbDepth;
        g.ctbSupportWidth = OTHER_DOSE.ctbWidth;
        g.offballMovementWeights = [...OTHER_DOSE.obmMatrix];
      }
    }
  }
};
const crossWalk = (seed: number, c: CrossCell): string => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...PERCEPT_FLAGS,
    dlcStrikePlane: c.sp, dlcDeliveryChoice: c.dlc, ptpPassLead: c.ptp,
    obmMovement: c.obm, ctbSupportPlane: c.ctb,
  });
  armOthers(m, c.others);
  armGene(m, c.gene === 'absent' ? null : c.gene === 'zero' ? GENE_ZERO : GENE_FULL);
  while (!m.finished) m.step(DT);
  return signature(m);
};
const CROSS_CELLS: readonly CrossCell[] = (() => {
  const cells: CrossCell[] = [];
  for (const sp of [false, true]) {
    for (const dlc of [false, true]) {
      for (const ptp of [false, true]) {
        for (const obm of [false, true]) {
          for (const ctb of [false, true]) {
            for (const others of [false, true]) {
              for (const gene of ['absent', 'zero', 'dosed'] as const) {
                cells.push({ sp, dlc, ptp, obm, ctb, others, gene });
              }
            }
          }
        }
      }
    }
  }
  return cells;
})();
const K = (
  sp: boolean, dlc: boolean, ptp: boolean, obm: boolean, ctb: boolean,
  others: boolean, gene: GeneState,
): string => cellKey({ sp, dlc, ptp, obm, ctb, others, gene });
const ALL_OFF = K(false, false, false, false, false, false, 'absent');

const CROSS_CLAIMS: readonly {
  name: string; a: string; b: string; equal: boolean; semantics: string;
}[] = [
  // ---- every door shut: no bank anywhere is readable ---------------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `DORMANT-ALL · gene ${gene} · others dosed`,
    a: K(false, false, false, false, false, true, gene), b: ALL_OFF,
    equal: true,
    semantics: 'all five flags OFF: no gene bank of any of the five seams can be read, so '
      + 'every gene state collapses onto the incumbent world.',
  })),
  // ---- ⭐ DOOR A: arming the plane alone expresses NO other seam's genes --------
  {
    name: '⭐ A-PLANE-ALONE-INERT · others DOSED · gene ABSENT',
    a: K(true, false, false, false, false, true, 'absent'), b: ALL_OFF,
    equal: true,
    semantics: '⭐ THE TWO-DOORS GATE (#228) in this seam\'s form: dlcStrikePlane ARMED with '
      + 'the banked obm matrix and ctbSupport* genes FULLY DOSED and its own gene ABSENT — '
      + 'byte-identical to ALL-OFF. Arming this door can never spend a bank it was not given '
      + 'the key to. ⚠ Note what is NOT claimed: gene ZERO is NOT inert under this door (see '
      + 'PLANE-ZERO-BITES) — the magnitude retired, so PRESENCE is the whole arming rule.',
  },
  {
    name: '⭐ A-OTHER-GENES-INVISIBLE · the plane fully live, the other doors shut',
    a: K(true, false, false, false, false, true, 'dosed'),
    b: K(true, false, false, false, false, false, 'dosed'),
    equal: true,
    semantics: '⭐ THE CLEANEST FORM: the plane FULLY ARMED and biting hard — and the banked '
      + 'obm/ctb gene banks make NO difference to it whatsoever, because their own flags are '
      + 'shut.',
  },
  // ---- ⭐ THE MAGNITUDE RETIREMENT, CROSSED ------------------------------------
  {
    name: '⭐ PLANE-VALUE-INERT · gene ZERO ≡ gene DOSED (the #240/#241 retirement)',
    a: K(true, false, false, false, false, false, 'zero'),
    b: K(true, false, false, false, false, false, 'dosed'),
    equal: true,
    semantics: '⭐ THE MAGNITUDE RETIREMENT, MEASURED IN THE MATRIX: with the two gene-reading '
      + 'banked doors SHUT, the plane at gene 0 and the plane at gene 1 are the SAME WORLD — '
      + 'the gene\'s VALUE scales nothing at all. The grid\'s scale is the projection\'s own '
      + 'geometry, taken at full weight.',
  },
  {
    name: '⭐ PLANE-ZERO-BITES · gene ZERO is NOT "off" under this door',
    a: K(true, false, false, false, false, false, 'zero'), b: ALL_OFF,
    equal: false,
    semantics: '⭐ THE HONEST CONVERSE, stated so nobody reads a future gene-0 arm as "the '
      + 'mechanism disabled": under THIS door 0 is a PRESENT gene, the grid forms and the world '
      + 'moves. What disables the plane is ABSENCE, and only absence.',
  },
  // ---- ⭐ DOOR B: the neighbours are unmoved by THIS door ----------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-OBM-UNTOUCHED-BY-PLANE · obm armed alone · gene ${gene}`,
    a: K(false, false, false, true, false, true, gene),
    b: K(false, false, false, true, false, true, 'absent'),
    equal: true,
    semantics: '⭐ the converse door: with dlcStrikePlane SHUT, the shared gene is unreadable '
      + 'at any value — the banked OBM seat delivers exactly what it delivered before this '
      + 'stage existed.',
  })),
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-CTB-UNTOUCHED-BY-PLANE · ctb armed alone · gene ${gene}`,
    a: K(false, false, false, false, true, true, gene),
    b: K(false, false, false, false, true, true, 'absent'),
    equal: true,
    semantics: '⭐ the same converse for the banked CTB static plane.',
  })),
  // ---- ⭐⭐ THE FROZEN PRECEDENCE CHAIN ---------------------------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐⭐ PTP-KEEPS-PRECEDENCE · sp1·ptp1 ≡ sp0·ptp1 · gene ${gene}`,
    a: K(true, false, true, false, false, false, gene),
    b: K(false, false, true, false, false, false, gene),
    equal: true,
    semantics: '⭐⭐ THE FROZEN PRECEDENCE CHAIN (§LAW), GATED RATHER THAN PROMISED. The plane '
      + 'is the NEWEST seam and yields to every banked one: no grid forms while the banked '
      + 'forced-aim seat exists, so armed-both IS ptpPassLead armed alone, byte for byte, at '
      + 'every gene state. The guard is on the SEAT, never on the other seam\'s flag line — '
      + 'that line is pinned VERBATIM by its own test, and a pinned test is a STOP.',
  })),
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐⭐ DLC-KEEPS-PRECEDENCE · sp1·dlc1 ≡ sp0·dlc1 · gene ${gene}`,
    a: K(true, true, false, false, false, false, gene),
    b: K(false, true, false, false, false, false, gene),
    equal: true,
    semantics: '⭐⭐ THE SAME LAW against the banked TWO-POINT CONTEST — the seam that stays '
      + 'BANKED as DLC-T1s\'s CONTRAST ANCHOR. No exam arms both; armed-both is the banked '
      + 'contest alone, byte for byte, at every gene state.',
  })),
  {
    name: '⭐⭐ CHAIN-IS-TRANSITIVE · sp1·dlc1·ptp1 ≡ ptp1 ALONE · gene dosed',
    a: K(true, true, true, false, false, false, 'dosed'),
    b: K(false, false, true, false, false, false, 'dosed'),
    equal: true,
    semantics: '⭐⭐ ALL THREE GENE-READING DOORS OPEN AT ONCE resolves to the OLDEST: the '
      + 'plane yields to the contest and to the forced aim, the contest yields to the forced '
      + 'aim (the banked DLC-T0 law), so the world is ptpPassLead\'s. The chain is stated once '
      + 'and measured once.',
  },
  {
    name: '⭐⭐ PLANE-IS-NOT-THE-CONTEST · sp-alone-dosed vs dlc-alone-dosed',
    a: K(true, false, false, false, false, false, 'dosed'),
    b: K(false, true, false, false, false, false, 'dosed'),
    equal: false,
    semantics: '⭐⭐ THE FALSIFIER THAT MAKES DLC-T1s\'s CONTRAST ANCHOR MEANINGFUL: a world '
      + 'where the chooser samples a PLANE of kicks is not the world where he picks between '
      + 'TWO points. If these were byte-identical, the strike space would be the two-point '
      + 'contest wearing a new name.',
  },
  {
    name: '⭐⭐ PLANE-IS-NOT-THE-FORCED-DOSE · sp-alone-dosed vs ptp-alone-dosed',
    a: K(true, false, false, false, false, false, 'dosed'),
    b: K(false, false, true, false, false, false, 'dosed'),
    equal: false,
    semantics: '⭐⭐ and it is not the retired dial either — the #234 poison\'s own world.',
  },
  {
    name: '⭐ C-SEAMS-DISTINGUISHABLE · sp-alone-dosed vs obm-alone-dosed',
    a: K(true, false, false, false, false, true, 'dosed'),
    b: K(false, false, false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐ arming and dosing THIS seam must not reproduce the banked OBM seat armed on '
      + 'its own bank. If these were identical, one door would be spending the other\'s bank — '
      + 'the exact defect #228 caught.',
  },
  {
    name: '⭐ C-SEAMS-DISTINGUISHABLE · sp-alone-dosed vs ctb-alone-dosed',
    a: K(true, false, false, false, false, true, 'dosed'),
    b: K(false, false, false, false, true, true, 'absent'),
    equal: false,
    semantics: '⭐ the same falsifier against the banked CTB static plane.',
  },
  {
    name: '⭐ C-PLANE-INERT-IS-NOT-THE-NEIGHBOURS · plane armed born-absent vs obm-alone',
    a: K(true, false, false, false, false, true, 'absent'),
    b: K(false, false, false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐ the identity that WOULD hold if this door leaked: an inert plane sitting on '
      + 'a full neighbour bank must be the INCUMBENT world, hence DIFFERENT from the neighbour '
      + 'armed on that bank.',
  },
  // ---- non-vacuity: this seam bites where it should ---------------------------
  ...[true, false].map((others) => ({
    name: `BITE · plane armed + gene present, other doors shut, others ${others ? 'dosed' : 'absent'}`,
    a: K(true, false, false, false, false, others, 'dosed'), b: ALL_OFF,
    equal: false,
    semantics: 'the plane is not inert everywhere: armed with a present gene it moves the '
      + 'world — otherwise every identity above would be vacuous.',
  })),
  {
    name: 'ALL-FIVE-ARMED-AND-DOSED bites',
    a: K(true, false, false, true, true, true, 'dosed'),
    b: K(false, false, false, true, true, true, 'absent'),
    equal: false,
    semantics: 'with the plane open beside both banked movement seams and every bank dosed, '
      + 'adding THIS door\'s grid moves the world away from the other two armed alone. (What '
      + 'the combination BUYS is DLC-T1s\'s exam, not adjudicated here.)',
  },
];

/* ---- ⭐ G-GRID: the TRACED grid, re-derived independently on live states ------ */
/**
 * Observation, never intervention: on ONE armed match, sample every 15 playing ticks and
 * for the carrier and each of his mates BUILD the grid exactly as the brain does, off a
 * COPY of the genome, checking the frozen law directly against an INDEPENDENT
 * re-derivation from the world's own motion source.
 *
 * ⚠ WHAT THESE COUNTERS ARE, EXACTLY (the b8f5ef0 lesson, applied ex ante): they are
 * PROBE-SIDE SEAT CONSTRUCTIONS on sampled live match states — NOT a tally of grids the
 * BRAIN formed. That the brain forms and prices them is established by code reading (the
 * read-fork inventory, machine-checked by G-FORK / G-NOTASTE) and IN SIMULATION by
 * G-BITE's divergence receipt and G-WINNER end to end through the brain. ⚠ And BOTH
 * columns are measured on the SAME arm per world shape (`armed` / `plainArmed`), stated
 * as `measuredOnArm`, so the percept-vs-bare contrast is a WORLD-SHAPE contrast and not
 * an arm confound — the DLC-T0 §RESULT caveat, fixed here rather than repeated.
 */
const gridGeometry = (seed: number, percept: boolean): {
  measuredOnArm: Arm;
  samples: number; supportSamples: number; movedSamples: number; stillSamples: number;
  gridMembers: number;
  meanReachMetres: number; maxReachMetres: number; meanFlightSeconds: number;
  meanMotionSpeed: number; minLengthRatio: number; maxRotationDegrees: number;
  meanMaxDisplacement: number;
  zeroPointExact: number; absentSeatsFormed: number;
  violations: {
    gridSize: number; order: number; zeroPointNonZero: number; aimComposition: number;
    reachLaw: number; powerLaw: number; directionLaw: number;
    nonSupportNonZero: number; stillNonZero: number; reachExceedsDistance: number;
  };
  pass: boolean;
} => {
  const arm: Arm = percept ? 'armed' : 'plainArmed';
  const m = matchOf(seed, arm);
  let samples = 0;
  let support = 0;
  let moved = 0;
  let still = 0;
  let members = 0;
  let reachSum = 0;
  let reachMax = 0;
  let flightSum = 0;
  let speedSum = 0;
  let dispSum = 0;
  let minLengthRatio = 1;
  let maxRotation = 0;
  let zeroExact = 0;
  let absentSeats = 0;
  const v = {
    gridSize: 0, order: 0, zeroPointNonZero: 0, aimComposition: 0,
    reachLaw: 0, powerLaw: 0, directionLaw: 0,
    nonSupportNonZero: 0, stillNonZero: 0, reachExceedsDistance: 0,
  };
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    const carrier = m.ball.owner;
    if (carrier === null) continue;
    const t = m.teams[carrier.side];
    const dosed: TacticalGenome = { ...t.genome, passLeadSupport: GENE_FULL };
    const absentGenome: TacticalGenome = { ...t.genome };
    delete absentGenome.passLeadSupport;
    // ⭐ THE ARMING RULE: an ABSENT gene gives NO seat, so no grid can form at all
    if (strikePlaneSeatOf(carrier, m, absentGenome, percept) !== null) absentSeats += 1;
    const seat = strikePlaneSeatOf(carrier, m, dosed, percept);
    if (seat === null) continue;
    for (const mate of t.players) {
      if (mate === carrier || mate.sentOff) continue;
      const grid = groundStrikeGrid(seat, carrier.pos, mate);
      samples += 1;
      members += grid.length;
      if (grid.length !== STRIKE_PLANE_K) v.gridSize += 1;
      grid.forEach((c, k) => {
        if (c.dirStep !== STRIKE_PLANE_STEPS[Math.floor(k / 3)]
          || c.powerStep !== STRIKE_PLANE_STEPS[k % 3]) v.order += 1;
        if (c.aim.x !== mate.pos.x + c.strike.x || c.aim.y !== mate.pos.y + c.strike.y) {
          v.aimComposition += 1;
        }
      });
      const zero = grid[STRIKE_PLANE_ZERO_INDEX];
      // ⭐ THE ZERO-POINT IS TODAY'S KICK, exactly (IEEE): x + ±0 === x
      if (zero.strike.x !== 0 || zero.strike.y !== 0
        || zero.aim.x !== mate.pos.x || zero.aim.y !== mate.pos.y) v.zeroPointNonZero += 1;
      else zeroExact += 1;
      const d0 = dist(carrier.pos, mate.pos);
      const reach = strikeReach(seat, carrier.pos, mate);
      if (mate.action.type !== 'SupportBallCarrier') {
        // the SCOPE GATE is the banked seat's own — the whole plane collapses, no branch
        if (reach !== 0 || grid.some((c) => c.strike.x !== 0 || c.strike.y !== 0)) {
          v.nonSupportNonZero += 1;
        }
        continue;
      }
      support += 1;
      const motion = passLeadMotion(seat, mate);
      const speed = Math.hypot(motion.x, motion.y);
      const flight = d0 / PTP_FLIGHT_SPEED;
      // THE GRID'S SCALE: the banked projection at FULL weight (the gene scales nothing)
      if (Math.abs(reach - speed * flight * PTP_LEAD_FLIGHT_MUL) > 1e-12) v.reachLaw += 1;
      if (speed < 1e-9) {
        still += 1;
        // ⭐ NO PREDICATE (#200): no motion ⇒ every member IS today's kick, by arithmetic
        if (grid.some((c) => c.strike.x !== 0 || c.strike.y !== 0)) v.stillNonZero += 1;
        continue;
      }
      moved += 1;
      if (reach >= d0) v.reachExceedsDistance += 1;
      if (d0 > 0) minLengthRatio = Math.min(minLengthRatio, (d0 - reach) / d0);
      const theta = Math.atan2(reach, d0);
      maxRotation = Math.max(maxRotation, (theta * 180) / Math.PI);
      const ux = (mate.pos.x - carrier.pos.x) / d0;
      const uy = (mate.pos.y - carrier.pos.y) / d0;
      let dispMax = 0;
      for (const c of grid) {
        const rx = c.aim.x - carrier.pos.x;
        const ry = c.aim.y - carrier.pos.y;
        // POWER: the struck LENGTH is d0 + j·reach (the shipped speed law is monotone in it)
        if (Math.abs(Math.hypot(rx, ry) - (d0 + c.powerStep * reach)) > 1e-9) v.powerLaw += 1;
        // DIRECTION: the struck BEARING is the mate-ward one rotated by i·θ (signed, via
        // atan2 — well-conditioned near zero, unlike acos whose floor there is √ε)
        const ang = Math.atan2(ux * ry - uy * rx, ux * rx + uy * ry);
        if (Math.abs(ang - c.dirStep * theta) > 1e-9) v.directionLaw += 1;
        dispMax = Math.max(dispMax, Math.hypot(c.strike.x, c.strike.y));
      }
      dispSum += dispMax;
      reachSum += reach;
      reachMax = Math.max(reachMax, reach);
      flightSum += flight;
      speedSum += speed;
    }
  }
  const n = Math.max(support, 1);
  return {
    measuredOnArm: arm,
    samples,
    supportSamples: support,
    movedSamples: moved,
    stillSamples: still,
    gridMembers: members,
    meanReachMetres: round(reachSum / n),
    maxReachMetres: round(reachMax),
    meanFlightSeconds: round(flightSum / n),
    meanMotionSpeed: round(speedSum / n),
    minLengthRatio: round(minLengthRatio),
    maxRotationDegrees: round(maxRotation, 2),
    meanMaxDisplacement: round(dispSum / Math.max(moved, 1)),
    zeroPointExact: zeroExact,
    absentSeatsFormed: absentSeats,
    violations: v,
    pass: support > 0 && moved > 0 && zeroExact === samples && absentSeats === 0
      && members === samples * STRIKE_PLANE_K
      && Object.values(v).every((c) => c === 0),
  };
};

/* ---- ⭐ G-WINNER: the ARGMAX ENTRY, proved end to end through the brain ------- */
/**
 * The G-LOFT-BODY idiom (#191: a claim becomes a gate) applied to the STRIKE PLANE. On an
 * ARMED match the carrier is asked to decide, and the winning `Pass` candidate's OWN
 * reported openness (2 dp, in its `why` string) is compared against the openness of EVERY
 * grid member's receiving point, re-derived independently.
 *
 * EVERY winner must be priced at ONE OF ITS OWN grid points. Where the grid's openness
 * readings SPREAD materially (> 0.05, well beyond the 2 dp print) the winner is
 * identifiable, and BOTH outcomes must occur across the sampled decisions — a plane where
 * a sampled strike always won would be a forcing, and one where today's kick always won
 * would be a seam with no reachable second candidate.
 *
 * ⚠ DECLARED INTERVENTION. This is an INSTRUMENT match (`decidePlayer` is called on the
 * carrier, which both re-decides and may execute); its trajectory is its own and is
 * compared to NO signature anywhere.
 */
const winnerPricing = (seed: number, percept: boolean): {
  decisions: number; passCandidates: number; ambiguousNames: number;
  materialSamples: number; planeWins: number; zeroWins: number; violations: number;
  maxOpenSpread: number; meanOpenSpread: number; pass: boolean;
} => {
  const m = matchOf(seed, percept ? 'armed' : 'plainArmed');
  const WHY = /^to (.+) · lane (\d+\.\d\d) · open (\d+\.\d\d) · passBias/;
  let decisions = 0;
  let cands = 0;
  let ambiguous = 0;
  let material = 0;
  let planeWins = 0;
  let zeroWins = 0;
  let violations = 0;
  let maxSpread = 0;
  let spreadSum = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    const carrier = m.ball.owner;
    if (carrier === null || carrier.kickCooldown > 0) continue;
    const t = m.teams[carrier.side];
    const opp = m.teams[1 - carrier.side];
    decisions += 1;
    decidePlayer(carrier, m); // DECLARED INTERVENTION: an instrument match
    const cand = carrier.action.scores.find((c) => c.action === 'Pass');
    if (cand === undefined) continue;
    const parsed = WHY.exec(cand.why);
    if (parsed === null) continue; // the cutback candidate has its own why form
    const named = t.players.filter((q) => q.name === parsed[1]);
    if (named.length !== 1) { ambiguous += 1; continue; }
    const mate = named[0];
    cands += 1;
    const reported = Number(parsed[3]);
    const seat = strikePlaneSeatOf(
      carrier, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
    );
    if (seat === null) { violations += 1; continue; }
    const grid = groundStrikeGrid(seat, carrier.pos, mate);
    const at2 = (x: number): number => Math.round(x * 100) / 100;
    const opens = grid.map((c) => at2(opennessAt(c.aim, opp.players)));
    const zeroOpen = opens[STRIKE_PLANE_ZERO_INDEX];
    const spread = Math.max(...opens.map((o) => Math.abs(o - zeroOpen)));
    spreadSum += spread;
    maxSpread = Math.max(maxSpread, spread);
    if (!opens.some((o) => Math.abs(reported - o) < 1e-9)) { violations += 1; continue; }
    if (spread > 0.05) {
      material += 1;
      if (Math.abs(reported - zeroOpen) < 1e-9) zeroWins += 1;
      else planeWins += 1;
    }
  }
  return {
    decisions,
    passCandidates: cands,
    ambiguousNames: ambiguous,
    materialSamples: material,
    planeWins,
    zeroWins,
    violations,
    maxOpenSpread: round(maxSpread),
    meanOpenSpread: round(spreadSum / Math.max(cands, 1)),
    // per-shape: every winner is priced at ONE OF ITS OWN grid points. The NON-VACUITY
    // half (both outcomes occurring) is pooled across the two world shapes at the call
    // site, exactly as the frozen gate row words it.
    pass: cands > 0 && violations === 0,
  };
};

/* ---- ⭐ G-NOTASTE: the #236 amendment, machine-checked ------------------------ */
const PLANE_CALL = 'const planeCand = groundCandidate(mate, strike.aim, d);';
const PLANE_GUARD = '      if (spSeat !== null && dlcSeat === null && ptpSeat === null) {';
const noTasteGate = (): {
  planeCall: boolean; oneDeclaration: boolean;
  planeBranchTokens: string[]; seatModuleTokens: string[]; pass: boolean;
} => {
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const seatSrc = readFileSync('src/ai/strikePlaneSeat.ts', 'utf8');
  const decls = (brain.match(/const groundCandidate = \(/g) ?? []).length;
  const from = brain.indexOf(PLANE_GUARD);
  const to = brain.indexOf('    if (pressure > 0.5)', from);
  const branch = from >= 0 && to > from ? brain.slice(from, to) : '';
  const code = (s: string): string => s.split('\n').filter((l) => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');
  // ⭐ NO TASTE TERM: the plane's candidates are the SHARED function's output, so the
  // branch may name no gene, no attribute and no multiplier of its own.
  const BANNED = [
    'riskTolerance', 'passBias', 'attackingWidth', 'tempo', 'shootBias', 'attrs.',
    'traits', '* 1.', '*= ', 'Math.max', 'Math.min',
  ];
  const branchCode = code(branch);
  const planeBranchTokens = BANNED.filter((b) => branchCode.includes(b));
  const seatTokens = ['riskTolerance', 'passBias', 'attackingWidth', 'tempo', 'shootBias',
    'attrs.', 'traits'].filter((b) => code(seatSrc).includes(b));
  return {
    planeCall: brain.includes(PLANE_CALL),
    oneDeclaration: decls === 1,
    planeBranchTokens,
    seatModuleTokens: seatTokens,
    pass: brain.includes(PLANE_CALL) && decls === 1 && from >= 0 && to > from
      && planeBranchTokens.length === 0 && seatTokens.length === 0,
  };
};

/* ---- ⭐ G-EPI-MOTION: the motion channel is HONEST, per world shape ---------- */
/**
 * The PTP-T0 / DLC-T0 fixture, RE-RUN THROUGH THIS STAGE'S ARMING PATH (#236 amendment 2:
 * "inherited" never exempts a gate). A match is stepped, every eligible grid SCALE is
 * recorded, then EVERY BODY'S TRUTH VELOCITY IS REWRITTEN IN PLACE WITHOUT STEPPING — so
 * no scan moment is recorded, the remembered velocities still hold the old world, and
 * POSITIONS are untouched so `flight` is identical and ONLY the motion source can move
 * the grid.
 */
const epiMotionFixture = (seed: number): {
  perceptBodies: number; perceptMatchesPercept: number; perceptMatchesTruth: number;
  divergedBodies: number; meanRememberedAgeTicks: number;
  bareBodies: number; bareMatchesTruth: number; bareMatchesStalePercept: number;
  moduleMatchMembers: string[]; moduleBannedHits: string[];
  pass: boolean;
} => {
  const runShape = (percept: boolean): {
    bodies: number; matchesOwn: number; matchesOther: number; diverged: number; ageSum: number;
  } => {
    const m = matchOf(seed, percept ? 'armed' : 'plainArmed');
    for (let i = 0; i < 600; i++) m.step(DT);
    const pairs: { carrier: Player; mate: Player; before: number; age: number }[] = [];
    for (let guard = 0; guard < 4000 && pairs.length < 3 && !m.finished; guard++) {
      m.step(DT);
      pairs.length = 0;
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const carrier of t.players) {
          if (carrier.sentOff || carrier.role === 'GK') continue;
          const seat = strikePlaneSeatOf(
            carrier, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
          );
          if (seat === null) continue;
          for (const mate of t.players) {
            if (mate === carrier || mate.sentOff) continue;
            if (mate.action.type !== 'SupportBallCarrier') continue;
            const reach = strikeReach(seat, carrier.pos, mate);
            if (reach === 0) continue;
            const seen = seat.snapshot?.players.find((o) => o.gid === mate.gid) ?? null;
            pairs.push({ carrier, mate, before: reach, age: seen?.ageTicks ?? 0 });
          }
        }
      }
    }
    for (const p of m.allPlayers) { p.vel.x = 7.5; p.vel.y = -6.25; }
    let matchesOwn = 0;
    let matchesOther = 0;
    let diverged = 0;
    let ageSum = 0;
    for (const pair of pairs) {
      const t = m.teams[pair.carrier.side];
      const seat = strikePlaneSeatOf(
        pair.carrier, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
      )!;
      const now = strikeReach(seat, pair.carrier.pos, pair.mate);
      const flight = dist(pair.carrier.pos, pair.mate.pos) / PTP_FLIGHT_SPEED;
      // ⚠ the truth re-derivation must walk the SAME arithmetic path, componentwise and
      // then `sqrt(x² + y²)` — `hypot(v) · flight · mul` is a different rounding and the
      // identity would be approximate rather than exact (measured: 2 of 4 matched).
      const tx = 7.5 * flight * PTP_LEAD_FLIGHT_MUL;
      const ty = -6.25 * flight * PTP_LEAD_FLIGHT_MUL;
      const truthNow = Math.sqrt(tx * tx + ty * ty);
      if (percept) {
        if (now === pair.before) matchesOwn += 1;
        if (now === truthNow) matchesOther += 1;
      } else {
        if (now === truthNow) matchesOwn += 1;
        if (now === pair.before) matchesOther += 1;
      }
      if (pair.before !== truthNow) diverged += 1;
      ageSum += pair.age;
    }
    return { bodies: pairs.length, matchesOwn, matchesOther, diverged, ageSum };
  };
  const percept = runShape(true);
  const bare = runShape(false);
  // the SOURCE-LEVEL pin: BOTH seat modules read nothing on `match` but the snapshot
  const strip = (src: string): string => src.split('\n').filter((l) => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');
  const code = `${strip(readFileSync('src/ai/passLeadSeat.ts', 'utf8'))}\n`
    + `${strip(readFileSync('src/ai/strikePlaneSeat.ts', 'utf8'))}`;
  const members = [...new Set([...code.matchAll(/\bmatch\.(\w+)/g)].map((mm) => mm[1]))].sort();
  const BANNED = [
    'allPlayers', 'perceptionTruth', 'oraclePerceptionSnapshot', 'capturePerceptionTruth',
    'match.teams', 'match.ball', 'team.players', 'opp.',
  ];
  const bannedHits = BANNED.filter((b) => code.includes(b));
  return {
    perceptBodies: percept.bodies,
    perceptMatchesPercept: percept.matchesOwn,
    perceptMatchesTruth: percept.matchesOther,
    divergedBodies: percept.diverged,
    meanRememberedAgeTicks: round(percept.ageSum / Math.max(percept.bodies, 1)),
    bareBodies: bare.bodies,
    bareMatchesTruth: bare.matchesOwn,
    bareMatchesStalePercept: bare.matchesOther,
    moduleMatchMembers: members,
    moduleBannedHits: bannedHits,
    pass: percept.bodies > 0 && bare.bodies > 0
      && percept.matchesOwn === percept.bodies
      && percept.diverged === percept.bodies
      && percept.matchesOther === 0
      && bare.matchesOwn === bare.bodies
      && bare.diverged === bare.bodies
      && members.length === 1 && members[0] === 'perceivedSnapshot'
      && bannedHits.length === 0,
  };
};

/* ---- G-RNG (a): an armed strike plane draws zero rng ------------------------- */
const seamRng = (seed: number): { before: number; after: number; pass: boolean; grids: number } => {
  const m = matchOf(seed, 'armed');
  for (let i = 0; i < 400; i++) m.step(DT);
  const before = (m.rng as unknown as { s: number }).s;
  let grids = 0;
  for (const t of m.teams) {
    for (const p of t.players) {
      if (p.sentOff || p.role === 'GK') continue;
      const seat = strikePlaneSeatOf(
        p, m, { ...t.genome, passLeadSupport: GENE_FULL }, true,
      );
      if (seat === null) continue;
      for (const mate of t.players) {
        if (mate === p || mate.sentOff) continue;
        groundStrikeGrid(seat, p.pos, mate);
        grids += 1;
      }
    }
  }
  const after = (m.rng as unknown as { s: number }).s;
  return { before, after, pass: before === after && grids > 0, grids };
};

/* ---- G-RNG (b): genome.ts is UNTOUCHED by this stage ------------------------- */
const evoRng = (): {
  genomesIdentical: boolean; rngStateIdentical: boolean; geneStayedAbsent: boolean;
  optInDraws: boolean; obmStreamUnmoved: boolean; crossoverOrderHeld: boolean;
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
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolvePassLeadSupport: true });
  }
  const obmOnly = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
    rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
  });
  const both = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
    rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
    evolvePassLeadSupport: true,
  });
  const p0 = { ...randomGenome(new Rng(3)), offballMovementWeights: [...OTHER_DOSE.obmMatrix] };
  const p1 = {
    ...randomGenome(new Rng(4)),
    offballMovementWeights: OTHER_DOSE.obmMatrix.map((w) => -w),
  };
  const xObm = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true, true);
  const xBoth = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true, true, true);
  const sameMatrix = (a?: number[], b?: number[]): boolean =>
    Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
  return {
    genomesIdentical: GENE_KEYS.every((k) => a0[k] === h0[k] && a1[k] === h1[k]),
    rngStateIdentical: sActual === sHead,
    geneStayedAbsent: a0.passLeadSupport === undefined && a1.passLeadSupport === undefined,
    optInDraws: typeof gOn.passLeadSupport === 'number' && gOn.passLeadSupport !== 0,
    obmStreamUnmoved: sameMatrix(both.offballMovementWeights, obmOnly.offballMovementWeights)
      && both.ctbSupportDepth === obmOnly.ctbSupportDepth
      && both.ctbSupportWidth === obmOnly.ctbSupportWidth,
    crossoverOrderHeld: sameMatrix(xBoth.offballMovementWeights, xObm.offballMovementWeights)
      && typeof xBoth.passLeadSupport === 'number',
    sActual,
    sHead,
  };
};

/* ---- G-FORK: the READ-FORK INVENTORY, every src occurrence classed ----------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});
const FORK_LINE =
  'const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const forkTable = (): {
  sites: { file: string; line: number; kind: string; text: string }[];
  flagForks: number; candScoreSites: number; gridFormSites: number; captureSites: number;
  performPassStatements: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  const TOKENS =
    /dlcStrikePlane|spSeat|strikePlaneSeat|groundStrikeGrid|strikeReach|planeCand|STRIKE_PLANE|strike\.strike/;
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      const t = text.trim();
      if (!TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === FORK_LINE ? 'FLAG_FORK'
        : t === PLANE_CALL ? 'CAND_SCORE'
          : /^for \(const strike of groundStrikeGrid\(spSeat, p\.pos, mate\)\) \{$/.test(t)
            ? 'GRID_FORM'
            : /^bestLead[XY] = strike\.strike\.[xy];$/.test(t) ? 'GRID_CAPTURE'
              : t === PLANE_GUARD.trim() ? 'PLANE_GUARD'
                : /^if \(planeCand\.s > bestPass\) \{$/.test(t) ? 'PLANE_ARGMAX'
                  : /^(bestPass|bestMate|bestLane|bestOpen) = (planeCand|mate)/.test(t)
                    ? 'PLANE_ARGMAX'
                    : /^readonly dlcStrikePlane: boolean;$/.test(t) ? 'FIELD'
                      : /^dlcStrikePlane\?: boolean;$/.test(t) ? 'CONFIG'
                        : /this\.dlcStrikePlane = cfg\.dlcStrikePlane \?\? false;/.test(t)
                          ? 'INIT'
                          : /'dlcStrikePlane'/.test(t) ? 'UNION_KEY'
                            : /^import |^\} from |from '\.\/strikePlaneSeat'/.test(t) ? 'IMPORT'
                              : f.endsWith('strikePlaneSeat.ts') ? 'SEAT_BODY'
                                : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  const flagForks = sites.filter((s) => s.kind === 'FLAG_FORK');
  const candScore = sites.filter((s) => s.kind === 'CAND_SCORE');
  const gridForm = sites.filter((s) => s.kind === 'GRID_FORM');
  const capture = sites.filter((s) => s.kind === 'GRID_CAPTURE');
  // ⭐ ZERO new strike statements: the banked led strike is reused verbatim
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const strikes = (brain.match(/match\.performPass\(/g) ?? []).length;
  return {
    sites,
    flagForks: flagForks.length,
    candScoreSites: candScore.length,
    gridFormSites: gridForm.length,
    captureSites: capture.length,
    performPassStatements: strikes,
    pass: flagForks.length === 1 && flagForks[0].file.endsWith('src/ai/PlayerBrain.ts')
      && candScore.length === 1 && candScore[0].file.endsWith('PlayerBrain.ts')
      && gridForm.length === 1 && capture.length === 2
      && sites.filter((s) => s.kind === 'OTHER').length === 0
      // the THREE `match.performPass(` statements this file has always had: the kickoff
      // back-pass, the incumbent synchronous strike and the BANKED led strike. This stage
      // adds NONE — the winning KICK rides the banked statement.
      && strikes === 3,
  };
};

/* ---- G-TRACE: the banked projection is VERBATIM; the incumbents are UNTOUCHED - */
const TRACE_LINES: readonly { file: string; line: string; what: string }[] = [
  {
    file: 'src/ai/passLeadSeat.ts', what: '⭐ the BANKED projection\'s flight-speed declaration',
    line: 'export const PTP_FLIGHT_SPEED = 18;',
  },
  {
    file: 'src/ai/passLeadSeat.ts', what: '⭐ the BANKED projection\'s lead-factor declaration',
    line: 'export const PTP_LEAD_FLIGHT_MUL = 1.6;',
  },
  {
    file: 'src/ai/passLeadSeat.ts',
    what: '⭐⭐ the BANKED PROJECTION BODY, verbatim (the grid\'s SCALE, untouched)',
    line: '    x: seat.weight * (motion.x * flight * PTP_LEAD_FLIGHT_MUL),',
  },
  {
    file: 'src/ai/passLeadSeat.ts', what: '⭐⭐ the banked projection\'s SCOPE GATE, verbatim',
    line: "  if (mate.action.type !== 'SupportBallCarrier') return ZERO_MOTION;",
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the through-ball loop\'s OWN flight divisor (18)',
    line: 'const flight = dist(p.pos, mate.pos) / 18;',
  },
  {
    file: 'src/ai/formations.ts', what: 'runBurstPoint\'s OWN in-stride lead factor (1.6)',
    line: 'return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);',
  },
  {
    file: 'src/sim/mechanics.ts',
    what: '⭐⭐ THE INCUMBENT STRIKE\'S OWN PARAMETERIZATION — the DIRECTION: the struck '
      + 'bearing is the bearing to the handed point, so the plane\'s direction control rides '
      + 'the machinery unchanged',
    line: '  const aim = norm(sub(lead, passer.pos));',
  },
  {
    file: 'src/sim/mechanics.ts',
    what: '⭐⭐ THE INCUMBENT STRIKE\'S OWN PARAMETERIZATION — the POWER: the shipped ground '
      + 'speed law is monotone in the struck DISTANCE, which is what makes "length" the '
      + 'weight control (and `powerChoice` stays at the incumbent 1 on every call)',
    line: '  const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;',
  },
  {
    file: 'src/sim/mechanics.ts',
    what: '⭐ the composition the winning kick inherits: the incumbent strike-time lead PLUS '
      + 'the chooser\'s own displacement (PTP-T0 §HONESTY 5, unchanged)',
    line: 'const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));',
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: '⭐ M-DLC.4: the MakeRun through-ball guard, UNTOUCHED',
    line: "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: '⭐ M-DLC.4: the through-ball burst call, UNTOUCHED',
    line: 'const burst = runBurstPoint(mate, team, opp.players, flight);',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐⭐ SLICE TWO-S\'s zero-point, UNTOUCHED: the lofted switch\'s own d > 24 hand gate',
    line: 'if (d > 24 && !layingOff) {',
  },
  {
    file: 'src/sim/mechanics.ts',
    what: '⭐⭐ SLICE THREE-S\'s zero-point, UNTOUCHED: the AUTOMATIC ground bender',
    line: 'bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐ the BANKED led-strike statement, reused VERBATIM (zero new strike statements)',
    line: 'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐⭐ the ptpPassLead fork line, VERBATIM — a pin this design had to yield to',
    line: 'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐⭐ the dlcDeliveryChoice fork line, VERBATIM — the other pin it yields to',
    line: 'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐ the BANKED two-point contest\'s own candidate calls, VERBATIM',
    line: 'const ledCand = groundCandidate(mate, ledBall.aim, d);',
  },
];
const traceGate = (): {
  pass: boolean; lines: { file: string; line: string; what: string; found: boolean }[];
  flightSpeed: number; leadMul: number; gridK: number; zeroIndex: number;
  gridSteps: readonly number[];
  projectionFileSha256: string; contestFileSha256: string;
} => {
  const lines = TRACE_LINES.map((t) => ({
    ...t, found: readFileSync(t.file, 'utf8').includes(t.line),
  }));
  return {
    pass: lines.every((l) => l.found) && PTP_FLIGHT_SPEED === 18 && PTP_LEAD_FLIGHT_MUL === 1.6
      && STRIKE_PLANE_K === 9 && STRIKE_PLANE_ZERO_INDEX === 4
      && STRIKE_PLANE_STEPS.length === 3 && STRIKE_PLANE_STEPS[1] === 0,
    lines,
    flightSpeed: PTP_FLIGHT_SPEED,
    leadMul: PTP_LEAD_FLIGHT_MUL,
    gridK: STRIKE_PLANE_K,
    zeroIndex: STRIKE_PLANE_ZERO_INDEX,
    gridSteps: STRIKE_PLANE_STEPS,
    // the banked modules' own content hashes, so a later stage cannot edit them quietly
    projectionFileSha256: sha(readFileSync('src/ai/passLeadSeat.ts', 'utf8')),
    contestFileSha256: sha(readFileSync('src/ai/deliveryChoiceSeat.ts', 'utf8')),
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const SEAM_FILES = [
  'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/strikePlaneSeat.ts',
  'src/ai/PlayerBrain.ts',
];
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
  return {
    defaultFalse: matchSrc.includes('this.dlcStrikePlane = cfg.dlcStrikePlane ?? false;'),
    absentFromA4World: !a4.includes('dlcStrikePlane') && !a4.includes('passLeadSupport'),
    noNewGene: !(GENE_KEYS as readonly string[]).includes('passLeadSupport')
      && !readFileSync('src/evolution/genome.ts', 'utf8').includes('strikePlane'),
    noEnvDoor: SEAM_FILES.every((f) => readFileSync(f, 'utf8').split('\n')
      .filter((l) => /dlcStrikePlane|strikePlaneSeat|groundStrikeGrid/.test(l))
      .every((l) => !/envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))),
    freshMatchOff: matchOf(1, 'absent').dlcStrikePlane === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260811 });
      return l.createMatch(l.nextFixture()!).dlcStrikePlane === false;
    })(),
    randomGenomeBornAbsent: (() => {
      const g = randomGenome(new Rng(99));
      return g.passLeadSupport === undefined && !JSON.stringify(g).includes('passLead');
    })(),
  };
};

/* ---- G-PINS: the §PINS inventory's machine-checkable rows -------------------- */
const pinTable = (): {
  namedPins: { pin: string; file: string; needle: string; found: boolean }[];
  srcVerbatim: boolean; pass: boolean;
} => {
  const namedPins = [
    {
      pin: '⭐⭐ PTP-T0\'s G-FORK pin — the ptpPassLead fork line as EXACT TEXT, which is why '
        + 'this seam\'s precedence is achieved by SEAT guards rather than by a flag guard',
      file: 'tests/ptpPassLead.test.ts',
      needle: "'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;',",
    },
    {
      pin: '⭐⭐ DLC-T0\'s G-FORK pin — the dlcDeliveryChoice fork line as EXACT TEXT',
      file: 'tests/dlcDeliveryChoice.test.ts',
      needle: "'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;',",
    },
    {
      pin: '⭐⭐ DLC-T0\'s ZERO-NEW-STRIKE pin — exactly THREE `match.performPass(` statements '
        + 'in the brain (this stage adds none either)',
      file: 'tests/dlcDeliveryChoice.test.ts',
      needle: "expect((brainSource.match(/match\\.performPass\\(/g) ?? []).length).toBe(3);",
    },
    {
      pin: '⭐ DLC-T0\'s NO-TASTE pin — the two banked candidate calls, verbatim',
      file: 'tests/dlcDeliveryChoice.test.ts',
      needle: "expect(brainSource).toContain('const ledCand = groundCandidate(mate, ledBall.aim, d);');",
    },
    {
      pin: '⭐ PTP-T0\'s LOFT-BODY pin (the lofted switch prices at the BODY)',
      file: 'tests/ptpPassLead.test.ts',
      needle: 'the LOFTED switch prices at the BODY, never at the led aim (M-PTP.4)',
    },
    {
      pin: '⭐ O1-T1: the SYNCHRONOUS strike statement, pinned VERBATIM (this stage adds NO '
        + 'strike statement at all)',
      file: 'tests/o1PassWindup.test.ts',
      needle: 'expect(passCase).toMatch(/else match\\.performPass\\(p, passMate!, offsideExemptKick\\);/);',
    },
    {
      pin: 'O1-T1: the wind-up fork, pinned verbatim',
      file: 'tests/o1PassWindup.test.ts',
      needle: '/if \\(match\\.o1PassWindup && !mustKick && p\\.firstTouchWindow <= 0\\) \\{/',
    },
    {
      pin: 'O1-T1: the KICKOFF pass line, untouched',
      file: 'tests/o1PassWindup.test.ts',
      needle: "expect(kickoffLine.trim()).toBe('match.performPass(p, back);');",
    },
    {
      pin: 'the Pass / ThroughBall action-type surface',
      file: 'tests/combos.test.ts',
      needle: "(a.type === 'Pass' || a.type === 'ThroughBall')",
    },
    {
      pin: 'the production-fingerprint pin (one of thirteen)',
      file: 'tests/a4HomePriorGene.test.ts',
      needle: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    },
    {
      pin: 'the 5v6 sanity invariant (Phase 30.5)',
      file: 'tests/cards.test.ts',
      needle: 'directional: playing a man short costs results (forced early red)',
    },
    {
      pin: 'the goal-level shape pin',
      file: 'tests/formations.test.ts',
      needle: 'the novel shapes play REAL football — attack both ways over a seed pool',
    },
    {
      pin: 'the BANKED OBM seat\'s own fixtures (must pass verbatim)',
      file: 'tests/obmEyesSeat.test.ts',
      needle: 'obmMovement',
    },
    {
      pin: 'the BANKED CTB plane\'s own verbatim source pin',
      file: 'tests/ctbSupportPlane.test.ts',
      needle: 'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {',
    },
    {
      pin: 'the perceived-chooser fork\'s own pins',
      file: 'tests/perceivedPassChoice.test.ts',
      needle: 'edsPerceivedChoice',
    },
  ].map((p) => ({ ...p, found: readFileSync(p.file, 'utf8').includes(p.needle) }));
  const srcVerbatim = ([
    ['src/ai/PlayerBrain.ts', 'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;'],
    ['src/ai/PlayerBrain.ts', 'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;'],
    ['src/ai/PlayerBrain.ts', 'const feet = groundCandidate(mate, aim, d);'],
    ['src/ai/PlayerBrain.ts', 'else match.performPass(p, passMate!, offsideExemptKick);'],
    ['src/ai/PlayerBrain.ts', 'if (match.o1PassWindup && !mustKick && p.firstTouchWindow <= 0) {'],
    ['src/ai/PlayerBrain.ts', 'match.performPass(p, back);'],
    ['src/ai/PlayerBrain.ts', 'match.performCutback(p, cutbackMate!);'],
    ['src/ai/formations.ts', 'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {'],
  ] as const).every(([f, needle]) => readFileSync(f, 'utf8').includes(needle));
  return {
    namedPins,
    srcVerbatim,
    pass: namedPins.every((p) => p.found) && srcVerbatim,
  };
};

/* ---- REPORTED (a): the FORCED SMOKE — the STRIKE-DISTRIBUTION table ---------- */
/**
 * ONE armed match per world shape with `performPass` WRAPPED on the instance: every chosen
 * pass records WHICH GRID MEMBER WON. A non-null 5th argument is a SAMPLED strike (the
 * winner's own displacement, carried into the kick) and is matched EXACTLY against the
 * grid re-derived at strike time; a null one is the ZERO-POINT member — TODAY'S KICK,
 * which by construction is indistinguishable at the strike from the incumbent (its
 * displacement is exactly ±0, so the incumbent 3-argument statement is the one reached).
 *
 * ⭐ THE DISTRIBUTION IS THE EMERGENT READING — the first sight of WHICH KICKS this
 * chooser picks when the whole ground plane is on the table. It is descriptive: one match,
 * one gene value, no control, no CI.
 */
const strikeSmoke = (seed: number, percept: boolean): {
  passes: number; sampledWins: number; zeroPointWins: number; supportTargets: number;
  sampledShare: number; unmatchedStrikes: number;
  byMember: { index: number; dirStep: number; powerStep: number; wins: number }[];
  byDirection: Record<string, number>; byPower: Record<string, number>;
  meanDisplacementMetres: number; maxDisplacementMetres: number;
  meanDisplacementShareOfDistance: number;
} => {
  const m = matchOf(seed, percept ? 'armed' : 'plainArmed');
  const orig = m.performPass.bind(m);
  const wins = new Array<number>(STRIKE_PLANE_K).fill(0);
  let passes = 0;
  let sampled = 0;
  let unmatched = 0;
  let supportTargets = 0;
  let dispSum = 0;
  let dispMax = 0;
  let shareSum = 0;
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    passes += 1;
    if (mate.action.type === 'SupportBallCarrier') supportTargets += 1;
    if (ptpLead === null) wins[STRIKE_PLANE_ZERO_INDEX] += 1;
    else {
      sampled += 1;
      const t = m.teams[p.side];
      const seat = strikePlaneSeatOf(
        p, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
      );
      let found = -1;
      if (seat !== null) {
        const grid = groundStrikeGrid(seat, p.pos, mate);
        grid.forEach((c, k) => {
          if (c.strike.x === ptpLead.x && c.strike.y === ptpLead.y) found = k;
        });
      }
      if (found < 0) unmatched += 1;
      else wins[found] += 1;
      const mag = Math.hypot(ptpLead.x, ptpLead.y);
      dispSum += mag;
      dispMax = Math.max(dispMax, mag);
      const d = dist(p.pos, mate.pos);
      shareSum += d > 0 ? mag / d : 0;
    }
    orig(p, mate, offsideExempt, powerChoice, ptpLead);
  };
  while (!m.finished) m.step(DT);
  const byMember = wins.map((w, k) => ({
    index: k,
    dirStep: STRIKE_PLANE_STEPS[Math.floor(k / 3)],
    powerStep: STRIKE_PLANE_STEPS[k % 3],
    wins: w,
  }));
  const byDirection: Record<string, number> = {};
  const byPower: Record<string, number> = {};
  for (const r of byMember) {
    byDirection[`dir${r.dirStep}`] = (byDirection[`dir${r.dirStep}`] ?? 0) + r.wins;
    byPower[`pow${r.powerStep}`] = (byPower[`pow${r.powerStep}`] ?? 0) + r.wins;
  }
  return {
    passes,
    sampledWins: sampled,
    zeroPointWins: wins[STRIKE_PLANE_ZERO_INDEX],
    supportTargets,
    sampledShare: round(sampled / Math.max(passes, 1)),
    unmatchedStrikes: unmatched,
    byMember,
    byDirection,
    byPower,
    meanDisplacementMetres: round(dispSum / Math.max(sampled, 1)),
    maxDisplacementMetres: round(dispMax),
    meanDisplacementShareOfDistance: round(shareSum / Math.max(sampled, 1)),
  };
};

/* ---- REPORTED (b): the CHOOSER-COST reading (the b8f5ef0 lesson, ex ante) ----- */
/**
 * ⚠ NOT LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL, and the instrument says so rather than
 * hiding it. The armed arm is a DIVERGED WORLD and simulates a DIFFERENT NUMBER OF TICKS,
 * so PER-ARM TICK COUNTS are published, the HEADLINE is ms/TICK and total wall is CONTEXT.
 * The NOISE FLOOR is the instrument's own control pair (`off` vs `bornArmed`: identical
 * arithmetic, identical tick count), and any per-tick effect no larger than it is
 * UNRESOLVED by this instrument. ⭐ This seam prices K = 9 candidates per support mate
 * against the incumbent's ONE, so it is the first stage where the sampling lever has real
 * teeth — which is exactly why the number is reported and no lever is pulled on it here.
 */
const COST_REPEATS = 3;
const costReading = (seed: number): {
  repeats: number; gridK: number;
  arms: { arm: string; ticks: number; ticksStableAcrossRepeats: boolean;
    minMs: number; msPerTick: number;
    perTickVsOffPct: number | null; totalWallVsOffPctContextOnly: number | null }[];
  tickCountsEqualAcrossArms: boolean;
  headlinePerTick: { bornArmedVsOffPct: number; planeVsOffPct: number };
  contextTotalWall: { bornArmedVsOffPct: number; planeVsOffPct: number };
  noiseFloorPerTickPct: number;
  planeResolvedAboveNoiseFloor: boolean;
} => {
  const timeOne = (arm: Arm): { ms: number; ticks: number } => {
    const m = matchOf(seed, arm);
    let ticks = 0;
    const t0 = Date.now();
    while (!m.finished) { m.step(DT); ticks += 1; }
    return { ms: Date.now() - t0, ticks };
  };
  const arms: Arm[] = ['off', 'bornArmed', 'armed'];
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
    return { arm, ticks, ticksStableAcrossRepeats: stable, minMs: best,
      msPerTick: round(best / Math.max(ticks, 1), 6) };
  });
  const offMs = raw[0].minMs;
  const offPerTick = raw[0].msPerTick;
  const pct = (x: number, base: number): number => round(((x - base) / base) * 100, 2);
  const rows = raw.map((r, i) => ({
    ...r,
    perTickVsOffPct: i === 0 ? null : pct(r.msPerTick, offPerTick),
    totalWallVsOffPctContextOnly: i === 0 ? null : pct(r.minMs, offMs),
  }));
  const bornPerTick = pct(raw[1].msPerTick, offPerTick);
  const planePerTick = pct(raw[2].msPerTick, offPerTick);
  const noiseFloor = round(Math.abs(bornPerTick), 2);
  return {
    repeats: COST_REPEATS,
    gridK: STRIKE_PLANE_K,
    arms: rows,
    tickCountsEqualAcrossArms: raw.every((r) => r.ticks === raw[0].ticks),
    headlinePerTick: { bornArmedVsOffPct: bornPerTick, planeVsOffPct: planePerTick },
    contextTotalWall: {
      bornArmedVsOffPct: pct(raw[1].minMs, offMs),
      planeVsOffPct: pct(raw[2].minMs, offMs),
    },
    noiseFloorPerTickPct: noiseFloor,
    planeResolvedAboveNoiseFloor: Math.abs(planePerTick) > noiseFloor,
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; zeroArmed: string; midArmed: string; armed: string; plainArmed: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean;
    valueInert: boolean; diverged: boolean; bareDiverged: boolean;
  }[];
  for (let k = 0; k < N; k++) {
    const seed = BLOCK + k;
    const absent = walk(seed, 'absent');
    const off = walk(seed, 'off');
    const plain = walk(seed, 'plain');
    const plainOff = walk(seed, 'plainOff');
    const born = walk(seed, 'bornArmed');
    const zero = walk(seed, 'zeroArmed');
    const mid = walk(seed, 'midArmed');
    const armed = walk(seed, 'armed');
    const plainArmed = walk(seed, 'plainArmed');
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, zeroArmed: zero, midArmed: mid,
      armed, plainArmed,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      // ⭐ THE MAGNITUDE RETIREMENT: three gene values, ONE world — and not the incumbent's
      valueInert: zero === armed && mid === armed && armed !== absent,
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

process.stderr.write(`=== DLC T0s STRIKE-PLANE RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [dlc-t0s] run A digest ${digestA}\n  [dlc-t0s] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [dlc-t0s] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ---------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [dlc-t0s] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [dlc-t0s] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const gridPercept = gridGeometry(READ_SEED, true);
const gridBare = gridGeometry(READ_SEED, false);
const epi = epiMotionFixture(READ_SEED);
const winnerPercept = winnerPricing(READ_SEED, true);
const winnerBare = winnerPricing(READ_SEED, false);
// ⭐ non-vacuity of the CONTEST is pooled across the two world shapes and stated as such
const bothOutcomes = (winnerPercept.planeWins + winnerBare.planeWins) > 0
  && (winnerPercept.zeroWins + winnerBare.zeroWins) > 0;
const material = (winnerPercept.materialSamples + winnerBare.materialSamples) > 0;
const gWinner = winnerPercept.pass && winnerBare.pass && bothOutcomes && material;
const smokePercept = strikeSmoke(READ_SEED, true);
const smokeBare = strikeSmoke(READ_SEED, false);
const seamDraws = seamRng(READ_SEED);
const evo = evoRng();
const fork = forkTable();
const trace = traceGate();
const noTaste = noTasteGate();
const hyg = hygiene();
const pins = pinTable();
process.stderr.write('  [dlc-t0s] REPORTED chooser-cost reading...\n');
const cost = costReading(COST_SEED);
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const intervals = [
    { name: 'DLC-T0s receipts + grid/winner/EPI-MOTION/smoke read', first: BLOCK, last: READ_SEED },
    { name: 'DLC-T0s REPORTED chooser-cost reading', first: COST_SEED, last: COST_SEED },
    { name: 'DLC-T0s test-file seeds (tests/dlcStrikePlane.test.ts)', first: 12_427_900, last: 12_427_906 },
  ] as const;
  const checked = intervals.map((iv) => {
    const clashes = CONSUMED.filter((c) => !(iv.last < c.range[0] || iv.first > c.range[1]));
    return { ...iv, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
  });
  return {
    first: BLOCK,
    last: COST_SEED,
    intervals: checked,
    consumedBlocks: CONSUMED,
    collisions: checked.flatMap((iv) => iv.collisions),
    pass: checked.every((iv) => iv.pass),
    semantics: 'EVERY interval this stage consumes is machine-checked against the COMPLETE '
      + 'consumed ledger, which now includes DLC-T0\'s blocks (12,426,000–025 · 900–906) and '
      + 'DLC-T1\'s four (smoke 030–041 · dose-read 045 · guard 050–099 · battery+reserve '
      + '100–727, the RESERVED extent read off the committed artifact, not the walked one).',
  };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gValue = runA.rows.every((r) => r.valueInert);
const gGrid = gridPercept.pass && gridBare.pass;
const gBite = runA.rows.every((r) => r.diverged && r.bareDiverged)
  && smokePercept.unmatchedStrikes === 0 && smokeBare.unmatchedStrikes === 0
  && (smokePercept.sampledWins + smokeBare.sampledWins) > 0;
const gCross = runA.crossing.claims.every((c) => c.pass);
const gRng = seamDraws.pass && evo.genomesIdentical && evo.rngStateIdentical
  && evo.geneStayedAbsent && evo.optInDraws && evo.obmStreamUnmoved && evo.crossoverOrderHeld;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gValue && gGrid && gBite && gWinner
  && noTaste.pass && epi.pass && gCross && gRng && gHygiene && fork.pass && trace.pass
  && pins.pass && seedDisjoint.pass;

const body = {
  stage: 'DLC T0s — the dormant GROUND STRIKE PLANE (`dlcStrikePlane`, direction × power)',
  ruling: '#240 (continuous aim ruled in; the gene\'s magnitude retires) + #241 (控制的是那一脚 '
    + '— M-DLC.1″ supersedes the unbuilt 1D segment) + #181.2 (the standing receipt rule) + '
    + '#194 (gate semantics stated exactly) + #197-M1 (commit-free hashed body) + #200 (no '
    + 'predicates) + #228 (the two-doors lesson, gated from birth) + #236 (no taste term)',
  contract: 'docs/world-model/DELIVERY-CHOICE-CONTRACT.md',
  doc: 'docs/world-model/DLC-T0S-DORMANT-SEAM.md',
  frozenLaw: {
    grid: { k: STRIKE_PLANE_K, steps: STRIKE_PLANE_STEPS, zeroIndex: STRIKE_PLANE_ZERO_INDEX },
    projection: { flightSpeed: PTP_FLIGHT_SPEED, leadFlightMul: PTP_LEAD_FLIGHT_MUL },
    geneValues: { zero: GENE_ZERO, mid: GENE_MID, full: GENE_FULL },
    derivation: 'THE GROUND STRIKE PLANE (M-DLC.1″, slice one-s): armed (the dlcStrikePlane '
      + 'flag AND a NON-ABSENT passLeadSupport gene — PRESENCE only), the ordinary pass loop '
      + 'prices, per support-mode mate, K = 9 SAMPLED GROUND STRIKES — direction × power, '
      + 'elevation 0, spin 0 — through the ONE hoisted groundCandidate, each AT ITS OWN '
      + 'RECEIVING POINT. THE GRID IS TRACED: its one scale is `reach`, the BANKED PTP-T0 '
      + 'projection at FULL weight (motion · d0/18 · 1.6, the through-ball loop\'s own divisor '
      + 'and runBurstPoint\'s own factor); the DIRECTION step is θ = atan2(reach, d0), the '
      + 'angle that reach subtends at the pass distance; the POWER step is that same reach '
      + 'along the bearing (L = d0 + j·reach), and the shipped speed law clamp(d·0.6+8.2,9,22) '
      + 'is monotone in the struck distance, so length IS weight. THE ZERO-POINT IS TODAY\'S '
      + 'KICK: member 4 (dirStep 0, powerStep 0) has EXACTLY ±0 displacement because the '
      + 'grid is written as a DIFFERENCE of displacements (r·L − u·d0), so it prices to the '
      + 'incumbent\'s own double and the argmax\'s strict `>` keeps the incumbent on every tie. '
      + 'THE GENE\'S MAGNITUDE HAS RETIRED (#240/#241): presence gates the grid, value scales '
      + 'nothing — gene 0 ≡ 0.37 ≡ 1, and 0 is NOT "off". BOUNDED BY CONSTRUCTION: reach = '
      + 'd0·|motion|/11.25 and no body exceeds 8.848 m/s, so reach < d0 always (measured) — no '
      + 'clamp is taken. THE STRIKE: the winning kick\'s own displacement rides bestLeadX/Y '
      + 'into the BANKED led-strike statement, so there are ZERO new strike statements and the '
      + 'direction and power are carried by machinery performPass already owns; the incumbent '
      + 'strike-time correction is NOT replaced (struck = struckLead + handed), the banked '
      + 'composition. THE PRECEDENCE CHAIN, FROZEN: this is the newest seam and yields to every '
      + 'banked one — no grid forms while the ptpPassLead seat or the dlcDeliveryChoice seat '
      + 'exists, so armed-both IS the banked door armed alone, byte for byte, at every gene '
      + 'state (G-CROSS). The guards are on SEATS, never on another seam\'s flag line: those '
      + 'lines are pinned VERBATIM by their own tests, and a pinned test is a STOP, never an '
      + 'edit.',
  },
  gates: {
    gDet: { pass: gDet, digestA, digestB },
    gIdent: {
      pass: gIdentPass, seasons: FINGERPRINT_SEASONS,
      procedure: 'new League({seed}) → runHeadless toGeneration(generation + 2) → '
        + 'sha256(JSON.stringify(out.league)) — identical to scripts/fingerprint.ts',
      semantics: 'THE RNG-STREAM RECEIPT for the sim path, re-run in full (#236 amendment 2: '
        + '"inherited" never exempts an identity gate). The pass block gained a loop; these '
        + 'baselines were frozen from PRE-change code, so any drift in the flag-off path — a '
        + 'reordered operand, a changed double, a stray allocation that moved an rng draw — '
        + 'would break them.',
      rows: gIdentRows,
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
        + 'on-ball decision and returns null because the gene is absent, so no grid forms. '
        + 'Byte-identity to OFF proves the born-absent world inert THROUGH the live branch.',
    },
    gValue: {
      pass: gValue, seeds: N, values: [GENE_ZERO, GENE_MID, GENE_FULL],
      semantics: '⭐ THIS STAGE\'S G-ZERO-FORM, AND IT IS A DIFFERENT CLAIM. The #240/#241 '
        + 'MAGNITUDE RETIREMENT is measured rather than asserted: at gene 0, 0.37 and 1 the '
        + 'world is the SAME world, byte for byte, on every receipt seed — the gene\'s VALUE '
        + 'scales nothing, because the grid\'s scale is the projection\'s own geometry taken at '
        + 'full weight. ⚠ AND THE CONVERSE IS PART OF THE GATE: none of the three equals the '
        + 'incumbent world. Under this door 0 is NOT "off" — what disables the plane is gene '
        + 'ABSENCE and only absence (G-BORN). Nobody may read a future gene-0 arm as "the '
        + 'mechanism disabled".',
    },
    gGrid: {
      pass: gGrid, percept: gridPercept, bare: gridBare,
      semantics: '⭐ THE TRACED GRID, re-derived INDEPENDENTLY on sampled live states in both '
        + 'world shapes. Ten law checks, all of which must be ZERO: the grid is exactly K = 9 '
        + 'members in the FROZEN order (direction-major, then power); the ZERO-POINT member\'s '
        + 'displacement is EXACTLY ±0 and its receiving point is mate.pos coordinate for '
        + 'coordinate (which is what makes today\'s kick a member of its own grid, and what '
        + 'makes the tie rule bite); every aim is mate.pos + strike; `reach` equals the banked '
        + 'projection at FULL weight; every member\'s struck LENGTH is d0 + j·reach and its '
        + 'struck BEARING is the mate-ward one rotated by i·θ; a NON-SUPPORT mate and a mate '
        + 'with no remembered motion collapse the whole plane onto today\'s kick BY ARITHMETIC '
        + '(#200 — no branch, no threshold); and `reach < d0` on every sample, the '
        + 'construction bound that is why no clamp is taken. ⚠ These counters are PROBE-SIDE '
        + 'SEAT CONSTRUCTIONS (the probe builds the seat and the grid itself off a genome '
        + 'COPY) — that the BRAIN builds and prices them is G-FORK/G-NOTASTE (code) plus '
        + 'G-BITE (in-sim divergence) and G-WINNER (end to end). ⚠ Both columns are measured '
        + 'on the arm of their own world shape (`measuredOnArm`), so percept-vs-bare here is a '
        + 'WORLD-SHAPE contrast and NOT the arm confound DLC-T0\'s geometry table carried.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      bareDivergedSeeds: runA.rows.filter((r) => r.bareDiverged).length,
      seeds: N,
      chosenPassesPercept: smokePercept,
      chosenPassesBare: smokeBare,
      semantics: 'TWO things. (i) DIVERGENCE: armed with a present gene the world moves on '
        + 'every seed, in the percept world AND in the bare world. (ii) THE PASSES ACTUALLY '
        + 'STRUCK: performPass is wrapped on an armed match so the 5th argument identifies the '
        + 'WINNING GRID MEMBER for every chosen pass, matched EXACTLY against the grid '
        + 're-derived at strike time — `unmatchedStrikes` must be ZERO (every ball struck is a '
        + 'ball the chooser priced) and at least one SAMPLED strike must win somewhere (else '
        + 'the plane is unreachable). That table is the REPORTED strike distribution.',
    },
    gWinner: {
      pass: gWinner, percept: winnerPercept, bare: winnerBare,
      bothOutcomesOccur: bothOutcomes, materialDivergencesPooled: material,
      semantics: '⭐ THE ARGMAX ENTRY, PROVED END TO END THROUGH THE BRAIN (the G-LOFT-BODY '
        + 'idiom). On an ARMED match the carrier is asked to decide and the winning Pass '
        + 'candidate\'s OWN reported openness (2 dp, in its `why` string) is compared against '
        + 'the openness of EVERY grid member\'s receiving point, re-derived independently. '
        + 'EVERY winner must be priced at ONE OF ITS OWN grid points (violations ZERO), the '
        + 'grid\'s readings must SPREAD materially (> 0.05) on sampled decisions, and BOTH '
        + 'OUTCOMES MUST OCCUR across the two world shapes — a plane a sampled strike always '
        + 'won would be a forcing, and one today\'s kick always won would be a seam with no '
        + 'reachable alternative. ⚠ DECLARED INTERVENTION: an INSTRUMENT match (decidePlayer '
        + 'is called on the carrier), compared to no signature anywhere.',
    },
    gNoTaste: {
      ...noTaste,
      semantics: '⭐ THE #236 AMENDMENT BINDS, MACHINE-CHECKED. The plane carries NO taste term '
        + 'at all: its candidates are scored by the SAME hoisted groundCandidate the incumbent '
        + 'is (exactly ONE declaration, so the pricing cannot drift into a second copy), and '
        + 'neither the plane block nor the seat module names a gene, an attribute or a '
        + 'multiplier of its own. Wiring shipped genes into the new candidates would be a NEW '
        + 'read of them — a later slice\'s contract question WITH numbers, never a default.',
    },
    gEpiMotion: {
      ...epi,
      semantics: '⭐ THE HONESTY CORE, RE-GATED THROUGH THIS STAGE\'S ARMING PATH. A match is '
        + 'stepped, every eligible grid SCALE is recorded, then EVERY TRUTH VELOCITY IS '
        + 'REWRITTEN IN PLACE WITHOUT STEPPING — no scan moment is recorded, so the remembered '
        + 'velocities still hold the old world; POSITIONS ARE UNTOUCHED so `flight` is '
        + 'identical and the ONLY thing that can move the grid is its motion source. PERCEPT: '
        + 'every scale UNCHANGED, none equal to the truth-derived value. BARE: every scale '
        + 'FOLLOWS truth exactly. Plus the SOURCE pin over BOTH seat modules: the only member '
        + 'of `match` either names is perceivedSnapshot.',
    },
    gCross: {
      pass: gCross,
      cells: CROSS_CELLS.length,
      seeds: runA.crossing.seeds,
      neighbourDose: OTHER_DOSE,
      claims: runA.crossing.claims.map((c) => ({
        name: c.name, a: c.a, b: c.b, mustBeIdentical: c.equal,
        seeds: c.seeds, seedsHeld: c.seedsHeld, pass: c.pass, semantics: c.semantics,
      })),
      table: runA.crossing.rows,
      semantics: '⭐⭐ THE TWO-DOORS MATRIX (#228) with FIVE doors, gated FROM BIRTH. '
        + '{dlcStrikePlane × dlcDeliveryChoice × ptpPassLead × obmMovement × ctbSupportPlane} × '
        + '{the OBM/CTB banks dosed/absent} × {the SHARED gene absent/zero/dosed} = 192 cells, '
        + 'a FULL match per cell per seed, whole-run signature incl. rng state. ⭐ TWO of the '
        + 'neighbours READ THE SAME GENE, so this matrix is where the FROZEN PRECEDENCE CHAIN '
        + 'is proved (armed-both ≡ the banked door alone at every gene state, and all three '
        + 'open resolves to the oldest) and where the PLANE is proved to be neither the '
        + 'two-point contest nor the forced dose.',
    },
    gRng: {
      pass: gRng,
      seam: {
        ...seamDraws,
        semantics: 'an ARMED strike plane formed over every outfielder of both teams against '
          + 'every mate on a 400-tick fixture: the match rng state is EXACT before and after. '
          + 'The percept pull draws nothing either.',
      },
      evolution: {
        ...evo,
        semantics: 'THIS STAGE ADDS NO GENE AND NO OPT-IN — genome.ts is untouched — and that '
          + 'is re-proved rather than asserted: the shipped mutate/crossover with the opt-in '
          + 'OFF vs a faithful PRE-GENE re-implementation gives identical genomes AND identical '
          + 'final rng state; optInDraws shows the banked opt-in path is still live; '
          + 'obmStreamUnmoved and crossoverOrderHeld show the banked draw ordering is unmoved.',
      },
    },
    gHygiene: { pass: gHygiene, ...hyg },
    gFork: {
      pass: fork.pass, flagForks: fork.flagForks, candScoreSites: fork.candScoreSites,
      gridFormSites: fork.gridFormSites, captureSites: fork.captureSites,
      performPassStatements: fork.performPassStatements,
      semantics: '⭐ THE READ-FORK INVENTORY: EXACTLY ONE `match.dlcStrikePlane` fork in '
        + 'src/** — the strike-plane seat fork in PlayerBrain.decideOnBall\'s pass block — '
        + 'feeding exactly ONE grid formation (`groundStrikeGrid`), ONE candidate scoring call '
        + '(the ONE hoisted `groundCandidate`, called once per grid member inside the loop) and '
        + 'ONE capture pair, with ⭐ ZERO NEW STRIKE STATEMENTS: `match.performPass(` is called '
        + 'from the SAME THREE places as before this stage, because the winning KICK rides the '
        + 'BANKED statement rather than adding one. Everything else that names the flag or the '
        + 'module is a declaration, an init, the League union key, an import or the seat '
        + 'module\'s own body — all enumerated below with file:line and class, ZERO '
        + 'unclassified.',
      sites: fork.sites,
    },
    gTrace: {
      ...trace,
      semantics: 'THE BANKED PROJECTION IS VERBATIM-UNTOUCHED (its constants, declarations, '
        + 'body and scope gate matched line for line, and the module\'s whole-file sha256 '
        + 'recorded), as is the banked two-point contest module — which is what entitles this '
        + 'stage to reuse their law rather than re-derive it, and what keeps DLC-T1\'s CONTRAST '
        + 'ANCHOR walkable. ⭐⭐ The same gate traces THE INCUMBENT STRIKE\'S OWN '
        + 'PARAMETERIZATION — the bearing line and the ground speed law in mechanics.ts — '
        + 'because those two lines ARE the (direction, power) this plane samples: nothing new '
        + 'was added to the strike, the chooser simply now picks among the values the shipped '
        + 'kick already takes. And it asserts the UNTOUCHED INCUMBENTS in source form: the '
        + 'MakeRun guard and burst call, ⭐ the lofted switch\'s own `d > 24` hand gate (slice '
        + 'TWO-S\'s zero-point) and ⭐ the AUTOMATIC ground bender (slice THREE-S\'s zero-point '
        + '— the user\'s own Phase-71 ask, a shipped incumbent and NOT a defect to repair).',
    },
    gPins: {
      pass: pins.pass, srcVerbatim: pins.srcVerbatim, namedPins: pins.namedPins,
      semantics: 'THE PIN INVENTORY, machine-checked in the test files AND in src/**. ⭐ The '
        + 'first three rows are the pins that SHAPED this design: the ptpPassLead and '
        + 'dlcDeliveryChoice fork lines are asserted as EXACT TEXT by their own suites (so this '
        + 'seam\'s precedence had to be achieved by SEAT guards, never by a flag guard), and '
        + 'DLC-T0 pins the brain at EXACTLY THREE performPass statements (so the winning kick '
        + 'had to ride the banked strike). Nothing was renegotiated; a failing pin would have '
        + 'been a STOP, never a test edit.',
    },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    strikeTable: {
      note: 'REPORTED, observation-only, ONE armed match per world shape with performPass '
        + 'wrapped so the WINNING GRID MEMBER is identified for every chosen pass. ⭐ THIS IS '
        + 'THE EMERGENT STRIKE DISTRIBUTION — the first reading of WHICH KICKS a chooser picks '
        + 'with the whole ground plane on the table. ⚠ READ THE ZERO-POINT ROW CORRECTLY: a '
        + 'null 5th argument IS the zero-point member (today\'s kick), because its displacement '
        + 'is exactly ±0 and the incumbent 3-argument statement is the one reached — the two '
        + 'are indistinguishable at the strike BY CONSTRUCTION, which is the whole point of the '
        + 'zero-point. Descriptive counts only — no control, no CI, no ANSWER. The exam is '
        + 'DLC-T1s\'s.',
      seed: READ_SEED,
      percept: smokePercept,
      bare: smokeBare,
    },
    chooserCost: {
      note: '⭐ REPORTED (the #236 amendment 4 form, and the b8f5ef0 correction applied EX '
        + 'ANTE). Wall-clock on a shared machine, minimum of 3 repeats, one full match per arm '
        + 'in a PERCEPT-ARMED world. Used in NO rate, bounds nothing. The mechanism it prices: '
        + 'ARMED, every support-mode mate is priced K = 9 TIMES — nine lane scans, nine '
        + 'openness reads, nine style-chain evaluations — against the incumbent\'s ONE. ⚠ NOT '
        + 'LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL: the armed arm is a DIVERGED world and '
        + 'simulates a DIFFERENT NUMBER OF TICKS, so PER-ARM TICK COUNTS are published, the '
        + 'HEADLINE is ms/TICK and total wall is CONTEXT ONLY. THE NOISE FLOOR IS THE '
        + 'INSTRUMENT\'S OWN CONTROL PAIR: off and bornArmed execute the SAME arithmetic (the '
        + 'seat is null, no grid forms) on the same tick count, so their per-tick spread is '
        + 'pure scatter and any per-tick effect no larger than it is UNRESOLVED here '
        + '(`planeResolvedAboveNoiseFloor` says which case this run is). The honest lever if it '
        + 'is dear is CANDIDATE SCOPING — K is the lever and it is stated — never a pricing '
        + 'shortcut.',
      seed: COST_SEED,
      ...cost,
    },
  },
  result: runA,
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free body. */
const hashedBody = {
  ...body,
  reported: {
    ...body.reported,
    chooserCost: { note: body.reported.chooserCost.note, seed: COST_SEED },
  },
};
const resultSha256 = createHash('sha256').update(canonical(hashedBody)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  wallMsContextOnly: wallMs,
  headContextOnly: head,
  artifactPathContextOnly: OUT_PATH,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (⚠ #197-M1): the git short-hash of the tree '
    + 'this run observed. Embedding it in the hashed body would make the receipt un-re-derivable '
    + 'at any later commit.',
  hashNote: 'resultSha256 covers the body with the WALL-CLOCK cost numbers replaced by their '
    + 'note and seed — timings are machine-dependent and would make the hash un-re-derivable. '
    + 'Every GATE input is inside the hash.',
}, null, 2)}\n`);

const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== DLC T0s STRIKE-PLANE RECEIPTS — head ${head} (context only) — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · ⭐G-VALUE ${gValue ? 'PASS' : 'FAIL'}`
  + ` · ⭐G-GRID ${gGrid ? 'PASS' : 'FAIL'} · G-BITE ${gBite ? 'PASS' : 'FAIL'}`
  + ` · ⭐G-WINNER ${gWinner ? 'PASS' : 'FAIL'} · ⭐G-NOTASTE ${noTaste.pass ? 'PASS' : 'FAIL'}`
  + ` · ⭐G-EPI-MOTION ${epi.pass ? 'PASS' : 'FAIL'} · ⭐⭐G-CROSS ${gCross ? 'PASS' : 'FAIL'}`
  + ` · G-RNG ${gRng ? 'PASS' : 'FAIL'} · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'}`
  + ` · G-FORK ${fork.pass ? 'PASS' : 'FAIL'} · G-TRACE ${trace.pass ? 'PASS' : 'FAIL'}`
  + ` · G-PINS ${pins.pass ? 'PASS' : 'FAIL'} · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'}`
  + ` · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`FROZEN LAW: K = ${STRIKE_PLANE_K} ground strikes per support mate — direction i·atan2(reach, d0)`
  + ` × power d0 + j·reach, reach = |motion| · d0/${PTP_FLIGHT_SPEED} · ${PTP_LEAD_FLIGHT_MUL};`
  + ` member ${STRIKE_PLANE_ZERO_INDEX} IS today's kick and wins every tie.`);
for (const [shape, r] of [['percept', gridPercept], ['bare', gridBare]] as const) {
  o(`GRID GEOMETRY ${shape.padEnd(8)} (${r.supportSamples} support of ${r.samples} samples,`
    + ` ${r.gridMembers} members): moved ${r.movedSamples} · still ${r.stillSamples}`
    + ` · mean reach ${r.meanReachMetres} m (max ${r.maxReachMetres})`
    + ` · max rotation ${r.maxRotationDegrees}° · min (d0−reach)/d0 ${r.minLengthRatio}`
    + ` · zero-point exact ${r.zeroPointExact}/${r.samples}`
    + ` · violations ${JSON.stringify(r.violations)}`);
}
o('⭐ G-WINNER (the argmax entry, through the brain):');
for (const [shape, r] of [['percept', winnerPercept], ['bare', winnerBare]] as const) {
  o(`  ${shape.padEnd(8)} ${r.passCandidates} Pass candidates · material ${r.materialSamples}`
    + ` · SAMPLED wins ${r.planeWins} · ZERO-POINT wins ${r.zeroWins} · violations ${r.violations}`
    + ` · max spread ${r.maxOpenSpread}`);
}
o(`⭐ G-EPI-MOTION: percept ${epi.perceptMatchesPercept}/${epi.perceptBodies} read their own eyes`
  + ` · truth-matched ${epi.perceptMatchesTruth} · diverged ${epi.divergedBodies}`
  + ` · mean remembered age ${epi.meanRememberedAgeTicks} ticks`
  + ` | bare ${epi.bareMatchesTruth}/${epi.bareBodies} follow truth`
  + ` · module match members [${epi.moduleMatchMembers.join(', ')}]`);
o(`⭐⭐ G-CROSS (${CROSS_CELLS.length} cells × ${runA.crossing.seeds.n} seeds): `
  + `${runA.crossing.claims.filter((c) => c.pass).length}/${runA.crossing.claims.length} claims held`);
for (const c of runA.crossing.claims) {
  o(`  ${c.pass ? 'PASS' : '*** FAIL ***'} ${c.seedsHeld}/${c.seeds} ${c.equal ? '≡' : '≠'} ${c.name}`);
}
o(`G-RNG seam: rng ${seamDraws.before} → ${seamDraws.after} over ${seamDraws.grids} armed grids`);
o(`FORK TABLE: ${fork.flagForks} flag fork(s), ${fork.candScoreSites} candidate scoring(s), `
  + `${fork.gridFormSites} grid formation(s), ${fork.captureSites} capture(s), `
  + `${fork.performPassStatements} performPass statement(s) (UNCHANGED), `
  + `${fork.sites.length} src occurrence(s) total`);
o(`PIN INVENTORY: ${pins.namedPins.filter((p) => p.found).length}/${pins.namedPins.length} named pins present`
  + ` · src verbatim ${pins.srcVerbatim}`);
o('⭐ REPORTED — the STRIKE DISTRIBUTION (which kick the chooser picked):');
for (const [shape, r] of [['percept', smokePercept], ['bare', smokeBare]] as const) {
  o(`  ${shape.padEnd(8)} ${r.passes} passes chosen · SAMPLED ${r.sampledWins} (${r.sampledShare})`
    + ` · ZERO-POINT ${r.zeroPointWins} · unmatched ${r.unmatchedStrikes}`
    + ` · mean displacement ${r.meanDisplacementMetres} m (max ${r.maxDisplacementMetres})`
    + ` · displacement/distance ${r.meanDisplacementShareOfDistance}`);
  o(`           by member ${r.byMember.map((b) => `${b.index}(d${b.dirStep}p${b.powerStep}):${b.wins}`).join(' ')}`);
  o(`           by direction ${JSON.stringify(r.byDirection)} · by power ${JSON.stringify(r.byPower)}`);
}
o(`⭐ REPORTED chooser cost (min of ${cost.repeats}, K = ${cost.gridK}; HEADLINE = ms/tick,`
  + ` total wall = context; tick counts equal across arms: ${cost.tickCountsEqualAcrossArms}):`);
for (const a of cost.arms) {
  o(`  ${a.arm.padEnd(10)} ${String(a.ticks).padStart(6)} ticks · ${String(a.minMs).padStart(6)} ms`
    + ` · ${a.msPerTick} ms/tick`
    + ` · per-tick vs OFF ${a.perTickVsOffPct === null ? '—' : `${a.perTickVsOffPct}%`}`
    + ` · [context] total wall vs OFF ${a.totalWallVsOffPctContextOnly === null ? '—' : `${a.totalWallVsOffPctContextOnly}%`}`);
}
o(`  NOISE FLOOR (off vs bornArmed, identical arithmetic) ${cost.noiseFloorPerTickPct}% per tick`
  + ` · PLANE per-tick ${cost.headlinePerTick.planeVsOffPct}%`
  + ` · resolved above the floor: ${cost.planeResolvedAboveNoiseFloor}`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
