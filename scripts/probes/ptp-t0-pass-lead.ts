/**
 * PTP T0 — THE DORMANT PASS-LEAD SEAM (传球到路): the receipts probe.
 *
 * Doc: docs/world-model/PTP-T0-DORMANT-SEAM.md
 * Contract: docs/world-model/PASS-TO-PATH-CONTRACT.md §2 M-PTP.1–4, §3 PTP-T0
 * Ruling: #231 (the dispatch), #181.2 (THE STANDING RECEIPT RULE), #194 (state each
 *         gate's semantics EXACTLY — say what the arms DIFFER in), #197-M1 (nothing
 *         commit-dependent inside the hashed body), #200 (no predicates), #202
 *         (traced bounds, cited at their source line), #228 (the two-doors lesson:
 *         the crossing of two arming doors is itself a required gate).
 *
 * ⭐ #181.2: a HARD gate's evidence must be a COMMITTED, RECOMPUTABLE artifact.
 * Every hash below is computed IN THIS PROBE on the run that writes the JSON —
 * nothing is transcribed from a doc, and the doc quotes the artifact, never the
 * other way round. Re-run:
 *
 *     npx tsx scripts/probes/ptp-t0-pass-lead.ts
 *          → docs/world-model/data/ptp-t0-pass-lead.json
 *
 * The gates (all HARD unless marked REPORTED):
 *   G-IDENT   flag/gene-absent league byte-identity on THREE frozen league seeds,
 *             recomputed here (2 seasons; the 1337 row IS the production
 *             fingerprint). The baselines are PRE-change, so THIS is the sim path's
 *             RNG-stream receipt.
 *   G-FP      the 1337 row IS X-FP-PROD.
 *   G-OFF     per-match whole-run signature (rng state included): flag ABSENT ≡ flag
 *             FALSE, percept-armed AND production-shaped. ⚠ CONFIG EQUIVALENCE only.
 *   G-BORN    ARMED with the gene ABSENT ≡ OFF. ⚠ The arms DIFFER in code path:
 *             armed ⇒ the seat is BUILT on every on-ball decision and (in a percept
 *             world) PULLS A PERCEPT, so byte-identity proves the born-absent read
 *             inert THROUGH the live branch and the pull side-effect free.
 *   G-ZERO    ARMED with the gene PRESENT AT 0 ≡ OFF — the projection term is
 *             exactly `+0` and the aim composition an IEEE-754 identity.
 *   G-BITE    ARMED at the domain corner the world DIVERGES (percept world AND bare
 *             world), and the AIM POINTS move as §LAW says: the led displacement
 *             equals gene · motion · flight · MUL in SIGN and MAGNITUDE, on
 *             independently recomputed corner fixtures and on the passes actually
 *             CHOSEN in a live match.
 *   G-EPI-MOTION ⭐ THE HONESTY CORE: on a fixture whose truth MOTION diverges from
 *             the remembered motion, the PERCEPT world's projection reproduces the
 *             PERCEPT-derived displacement for every body and the TRUTH-derived one
 *             for none — while the BARE world reproduces the truth-derived one,
 *             because that is ITS chooser's own source. Plus the source pin.
 *   G-CROSS ⭐⭐ THE TWO-DOORS MATRIX (#228, gated from birth): {ptp × obm × ctb}
 *             flags × their gene banks. Arming ptpPassLead alone must express NO
 *             other seam's genes, and arming another seam must express none of this
 *             one's — with the DISCRIMINATION rows that make the identities
 *             non-vacuous.
 *   G-RNG     the seam draws ZERO rng, and the opt-in's draws sit STRICTLY AFTER the
 *             OBM block in mutation and in crossover alike.
 *   G-HYGIENE `?? false`; flag and gene ABSENT from a4World.ts entirely; gene absent
 *             from GENE_KEYS; fresh Match and League match both OFF; no env door.
 *   G-FORK    the READ-FORK INVENTORY: EXACTLY ONE `match.ptpPassLead` fork in
 *             src/**, with every src occurrence of the seam's symbols enumerated and
 *             classed, zero unclassified.
 *   G-TRACE   both projection constants matched VERBATIM at the lines they are taken
 *             from, and the through-ball loop's own lines asserted UNTOUCHED.
 *   G-PINS    the §PINS inventory's machine-checkable rows — the O1 wind-up's
 *             verbatim strike-statement pin above all.
 *   G-SEED    seed-block disjointness, proved in-probe against the complete ledger.
 *   G-DET     the experiment core runs TWICE, byte-identical digests.
 *   REPORTED  (a) a forced-dose smoke: led passes actually chosen and aimed;
 *             (b) the seat's wall-clock cost. DESCRIPTIVE ONLY — no control, no CI.
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
  PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL, passLeadMotion, passLeadOffset, passLeadSeatOf,
} from '../../src/ai/passLeadSeat';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS,
  crossoverGenomes, mutateGenome, passLeadSupportWeight, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { decidePlayer } from '../../src/ai/PlayerBrain';
import { kickMisalignment, orientationPowerMul } from '../../src/sim/mechanics';
import { opennessAt } from '../../src/ai/perception';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { dist, norm, sub } from '../../src/utils/vec';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/ptp-t0-pass-lead.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited VERBATIM and UNTRUNCATED from the OBM-T0 committed artifact). */
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
const BLOCK = 12_425_000;
const N = Number(process.env.PTPT0_N ?? 24);
/** The two-doors matrix runs on the FIRST `CROSS_N` of the SAME seeds (no new block). */
const CROSS_N = Math.min(N, Number(process.env.PTPT0_CROSS_N ?? 4));
const READ_SEED = BLOCK + N; //      12,425,024 — geometry + EPI-MOTION + smoke
const COST_SEED = BLOCK + N + 1; //  12,425,025 — the REPORTED cost reading
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
  { name: 'CTB-T0 receipts + corner/smoke read (#223)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds', range: [12_423_900, 12_423_901] },
  { name: 'OBM-T0 receipts + geometry/EPI/smoke read (#227)', range: [12_424_000, 12_424_024] },
  { name: 'OBM-T0 REPORTED cost read (#227)', range: [12_424_025, 12_424_025] },
  { name: 'OBM-T1 smoke (#229/#230)', range: [12_424_026, 12_424_037] },
  { name: 'OBM-T1 dose-read (#230)', range: [12_424_040, 12_424_040] },
  { name: 'OBM-T1 guard band (#229)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#229/#230)', range: [12_424_100, 12_424_727] },
  { name: 'OBM-T0 test-file seeds', range: [12_424_900, 12_424_906] },
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
 * ⭐ THE INSTRUMENT DOSE. The gene's domain is `clamp01`'s own [0,1]; the dose is its
 * UPPER CORNER, `1` — "aim at the whole projected displacement". No number is
 * invented: 1 is the domain end, and 0 is the zero-point the identity gates use.
 */
const DOSE_FULL = 1;
const DOSE_ZERO = 0;

type Arm =
  | 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed' | 'zeroArmed' | 'forced'
  | 'plainForced';

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
  const percept = !(arm === 'plain' || arm === 'plainOff' || arm === 'plainForced');
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(percept ? PERCEPT_FLAGS : {}),
    ...(arm === 'off' || arm === 'plainOff' ? { ptpPassLead: false } : {}),
    ...(arm === 'bornArmed' || arm === 'zeroArmed' || arm === 'forced' || arm === 'plainForced'
      ? { ptpPassLead: true } : {}),
  });
  if (arm === 'zeroArmed') armGene(m, DOSE_ZERO);
  if (arm === 'forced' || arm === 'plainForced') armGene(m, DOSE_FULL);
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
/* ⭐⭐ G-CROSS — THE TWO-DOORS MATRIX (#228, gated from birth)                */
/* ========================================================================== */
/**
 * The OBM-T0 verify catch (#228) in its general form: *when a new seat lands beside
 * banked seams, the crossing of the arming doors is itself a required gate.* An
 * identity proved only where the neighbouring door is shut proves nothing about the
 * configuration where it is open.
 *
 * This matrix crosses all three doors of the movement family — the one this stage
 * adds and the two it shares code paths with (`obmMovement` and `ctbSupportPlane`
 * both live in the off-ball support path this seat now PRICES, and all three genes
 * live in the same genome and the same mutate/crossover ordering):
 *     {ptp on/off} × {obm on/off} × {ctb on/off}
 *   × {the OTHER two seams' gene banks dosed/absent} × {this gene absent/zero/dosed}
 * = 8 × 2 × 3 = 48 cells, each a FULL match on the same receipt seeds, hashed with
 * the whole-run signature (rng state included). Every claim is stated EX ANTE and
 * checked cell-against-cell — `equal:false` rows are DISCRIMINATION claims, which is
 * what makes the identities non-vacuous.
 */
type GeneState = 'absent' | 'zero' | 'dosed';
interface CrossCell { ptp: boolean; obm: boolean; ctb: boolean; others: boolean; gene: GeneState }
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
const cellKey = (c: CrossCell): string => `ptp${c.ptp ? 1 : 0}·obm${c.obm ? 1 : 0}`
  + `·ctb${c.ctb ? 1 : 0}·others${c.others ? 1 : 0}·lead-${c.gene}`;
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
    ptpPassLead: c.ptp, obmMovement: c.obm, ctbSupportPlane: c.ctb,
  });
  armOthers(m, c.others);
  armGene(m, c.gene === 'absent' ? null : c.gene === 'zero' ? DOSE_ZERO : DOSE_FULL);
  while (!m.finished) m.step(DT);
  return signature(m);
};
const CROSS_CELLS: readonly CrossCell[] = (() => {
  const cells: CrossCell[] = [];
  for (const ptp of [false, true]) {
    for (const obm of [false, true]) {
      for (const ctb of [false, true]) {
        for (const others of [false, true]) {
          for (const gene of ['absent', 'zero', 'dosed'] as const) {
            cells.push({ ptp, obm, ctb, others, gene });
          }
        }
      }
    }
  }
  return cells;
})();
const K = (ptp: boolean, obm: boolean, ctb: boolean, others: boolean, gene: GeneState): string =>
  cellKey({ ptp, obm, ctb, others, gene });

const CROSS_CLAIMS: readonly {
  name: string; a: string; b: string; equal: boolean; semantics: string;
}[] = [
  // ---- every door shut: no bank anywhere is readable ---------------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `DORMANT-ALL · lead ${gene} · others dosed`,
    a: K(false, false, false, true, gene), b: K(false, false, false, false, 'absent'),
    equal: true,
    semantics: 'all three flags OFF: no gene bank of any of the three seams can be read, so '
      + 'every gene state collapses onto the incumbent world.',
  })),
  // ---- ⭐ DOOR A: arming ptp alone expresses NO other seam's genes --------------
  ...(['absent', 'zero'] as const).map((gene) => ({
    name: `⭐ A-PTP-ALONE-INERT · others DOSED · lead ${gene}`,
    a: K(true, false, false, true, gene), b: K(false, false, false, false, 'absent'),
    equal: true,
    semantics: '⭐ THE TWO-DOORS GATE (#228) in this seam\'s form: ptpPassLead ARMED with the '
      + 'BANKED obm matrix and ctbSupport* genes FULLY DOSED and this seat\'s own gene inert — '
      + 'byte-identical to ALL-OFF. Arming this door can never spend a bank it was not given '
      + 'the key to.',
  })),
  {
    name: '⭐ A-OTHER-GENES-INVISIBLE · ptp fully live, the other doors shut',
    a: K(true, false, false, true, 'dosed'), b: K(true, false, false, false, 'dosed'),
    equal: true,
    semantics: '⭐ THE CLEANEST FORM: the pass-lead seat FULLY ARMED AND FULLY DOSED, biting '
      + 'hard — and the banked obm/ctb gene banks make NO difference to it whatsoever, because '
      + 'their own flags are shut.',
  },
  // ---- ⭐ DOOR B: the neighbours are unmoved by THIS gene ----------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-OBM-UNTOUCHED-BY-LEAD · obm armed alone · lead ${gene}`,
    a: K(false, true, false, true, gene), b: K(false, true, false, true, 'absent'),
    equal: true,
    semantics: '⭐ the converse door: with ptpPassLead SHUT, this stage\'s gene is unreadable at '
      + 'any dose — the banked OBM seat delivers exactly what it delivered before this stage '
      + 'existed.',
  })),
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-CTB-UNTOUCHED-BY-LEAD · ctb armed alone · lead ${gene}`,
    a: K(false, false, true, true, gene), b: K(false, false, true, true, 'absent'),
    equal: true,
    semantics: '⭐ the same converse for the banked CTB static plane.',
  })),
  // ---- ⭐ DISCRIMINATION: the three seams are distinguishable ------------------
  {
    name: '⭐ C-SEAMS-DISTINGUISHABLE · ptp-alone-dosed vs obm-alone-dosed',
    a: K(true, false, false, true, 'dosed'), b: K(false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐ THE FALSIFIER: arming and dosing THIS seam must not reproduce the banked OBM '
      + 'seat armed on its own bank. If these two were byte-identical, one door would be '
      + 'spending the other\'s bank — the exact defect #228 caught.',
  },
  {
    name: '⭐ C-SEAMS-DISTINGUISHABLE · ptp-alone-dosed vs ctb-alone-dosed',
    a: K(true, false, false, true, 'dosed'), b: K(false, false, true, true, 'absent'),
    equal: false,
    semantics: '⭐ the same falsifier against the banked CTB static plane.',
  },
  {
    name: '⭐ C-PTP-INERT-IS-NOT-THE-NEIGHBOURS · ptp armed inert vs obm-alone',
    a: K(true, false, false, true, 'zero'), b: K(false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐ the identity that WOULD hold if this door leaked: an inert ptp seat sitting '
      + 'on a full neighbour bank must be the INCUMBENT world, hence DIFFERENT from the '
      + 'neighbour armed on that bank.',
  },
  // ---- non-vacuity: this seam bites where it should ---------------------------
  ...[true, false].map((others) => ({
    name: `BITE · ptp armed + dosed, other doors shut, others ${others ? 'dosed' : 'absent'}`,
    a: K(true, false, false, others, 'dosed'), b: K(false, false, false, false, 'absent'),
    equal: false,
    semantics: 'the seat is not inert everywhere: armed and dosed it moves the world — '
      + 'otherwise every identity above would be vacuous.',
  })),
  {
    name: 'ALL-THREE-ARMED-AND-DOSED bites',
    a: K(true, true, true, true, 'dosed'), b: K(false, true, true, true, 'absent'),
    equal: false,
    semantics: 'with all three doors open and every bank dosed, adding THIS seam\'s dose moves '
      + 'the world away from the other two armed alone. (What the combination BUYS is PTP-T1\'s '
      + 'exam, not adjudicated here.)',
  },
];

/* ---- G-BITE's geometry half: the AIM POINTS move as §LAW says ---------------- */
/**
 * On ONE armed (born-absent) match — observation, never intervention — sample every
 * 15 playing ticks: for the ball carrier and each of his mates, compute the seat at
 * the DOSED gene on a COPY of the genome and check §LAW directly against an
 * INDEPENDENT re-derivation of the arithmetic.
 */
const aimGeometry = (seed: number, percept: boolean): {
  samples: number; supportSamples: number; movedSamples: number; stillSamples: number;
  meanLeadMetres: number; maxLeadMetres: number; meanFlightSeconds: number;
  meanMotionSpeed: number;
  violations: {
    arithmetic: number; direction: number; nonSupportNonZero: number;
    stillNonZero: number; zeroDoseNonZero: number;
  };
  pass: boolean;
} => {
  const m = matchOf(seed, percept ? 'bornArmed' : 'plainForced');
  let samples = 0;
  let support = 0;
  let moved = 0;
  let still = 0;
  let leadSum = 0;
  let leadMax = 0;
  let flightSum = 0;
  let speedSum = 0;
  const v = {
    arithmetic: 0, direction: 0, nonSupportNonZero: 0, stillNonZero: 0, zeroDoseNonZero: 0,
  };
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    const carrier = m.ball.owner;
    if (carrier === null) continue;
    const t = m.teams[carrier.side];
    const dosed: TacticalGenome = { ...t.genome, passLeadSupport: DOSE_FULL };
    const zeroed: TacticalGenome = { ...t.genome, passLeadSupport: DOSE_ZERO };
    const seat = passLeadSeatOf(carrier, m, dosed, percept);
    const zeroSeat = passLeadSeatOf(carrier, m, zeroed, percept);
    for (const mate of t.players) {
      if (mate === carrier || mate.sentOff) continue;
      const lead = passLeadOffset(seat, carrier.pos, mate);
      const zeroLead = passLeadOffset(zeroSeat, carrier.pos, mate);
      samples += 1;
      if (zeroLead.x !== 0 || zeroLead.y !== 0) v.zeroDoseNonZero += 1;
      if (mate.action.type !== 'SupportBallCarrier') {
        if (lead.x !== 0 || lead.y !== 0) v.nonSupportNonZero += 1;
        continue;
      }
      support += 1;
      // the INDEPENDENT re-derivation of §LAW, from the world's own motion source
      const motion = passLeadMotion(seat, mate);
      const flight = dist(carrier.pos, mate.pos) / PTP_FLIGHT_SPEED;
      const wantX = DOSE_FULL * (motion.x * flight * PTP_LEAD_FLIGHT_MUL);
      const wantY = DOSE_FULL * (motion.y * flight * PTP_LEAD_FLIGHT_MUL);
      if (lead.x !== wantX || lead.y !== wantY) v.arithmetic += 1;
      const speed = Math.hypot(motion.x, motion.y);
      const mag = Math.hypot(lead.x, lead.y);
      // SIGN: the lead points ALONG the motion (a lead behind a moving man is a
      // sign error, and it is what a mis-signed projection would produce)
      if (speed > 1e-9 && (lead.x * motion.x + lead.y * motion.y) <= 0) v.direction += 1;
      // MAGNITUDE: |lead| === gene · |motion| · flight · MUL
      if (Math.abs(mag - DOSE_FULL * speed * flight * PTP_LEAD_FLIGHT_MUL) > 1e-9) {
        v.direction += 1;
      }
      // ⭐ NO PREDICATE (#200): a STILL mate degenerates to his feet BY ARITHMETIC
      if (speed < 1e-9) { still += 1; if (mag !== 0) v.stillNonZero += 1; }
      if (mag > 1e-9) moved += 1;
      leadSum += mag;
      leadMax = Math.max(leadMax, mag);
      flightSum += flight;
      speedSum += speed;
    }
  }
  const n = Math.max(support, 1);
  return {
    samples,
    supportSamples: support,
    movedSamples: moved,
    stillSamples: still,
    meanLeadMetres: round(leadSum / n),
    maxLeadMetres: round(leadMax),
    meanFlightSeconds: round(flightSum / n),
    meanMotionSpeed: round(speedSum / n),
    violations: v,
    pass: support > 0 && moved > 0 && Object.values(v).every((c) => c === 0),
  };
};

/* ---- ⭐ G-LOFT-BODY: the LOFTED switch is priced AT THE BODY ------------------ */
/**
 * ⭐ THE VERIFY-ROUND CORRECTION, GATED (the #191 form: a finding becomes a gate, not
 * a promise). ⚠ THE JUSTIFICATION, RETRACTED AND RESTATED (the re-verify round): the
 * earlier text here said the switch "carries NO lead — struck at the man's FEET". That
 * was FALSE. `performLoftedPass` strikes on its OWN INCUMBENT lead — `src/sim/
 * mechanics.ts`, `const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));`,
 * measured mean 0.72 m — so it aims at NEITHER the body NOR this slice's `ptpLead`
 * point. That incumbent strike is out of this slice (M-PTP.4) and is left UNTOUCHED;
 * the gap between the loft's price and its strike is the INCUMBENT's own. What this
 * slice does is RESTORE the loft's incumbent BODY-anchored PRICING, and the coherence
 * rationale is unchanged by the retraction: a `ptpLead`-priced loft would be priced
 * against an aim its execution never uses. The first build priced it against the
 * aim-derived `open`/`gain` locals, which made the doc's "Untouched: the lofted
 * switch" prohibition FALSE. The fix recomputes openness, forward gain and the style
 * chain at `mate.pos` for the loft.
 *
 * THIS GATE MEASURES IT END TO END, through the brain itself, not through a reading
 * of the source: on an ARMED + FULLY DOSED match the carrier is asked to decide and
 * the `LoftedPass` candidate's OWN reported openness (`bestLoftOpen`, printed to 2 dp
 * in its `why` string) is compared against BOTH re-derivations — `opennessAt(feet)`
 * and `opennessAt(aim)` — with the aim rebuilt independently from the frozen law.
 * NON-VACUITY IS PART OF THE PREDICATE: the two re-derivations must diverge MATERIALLY
 * (> 0.05, well beyond the 2 dp print) on at least one sampled decision, otherwise the
 * gate proves nothing and reds.
 *
 * ⚠ DECLARED INTERVENTION. This is an INSTRUMENT match: `decidePlayer` is called on
 * the carrier at sample moments, which both re-decides and may execute. Its
 * trajectory is therefore its own and is compared to NO signature anywhere in this
 * probe — the same standing as the G-EPI-MOTION in-place rewrite fixture.
 */
const loftBodyPricing = (seed: number, percept: boolean): {
  decisions: number; loftCandidates: number; matchedBody: number; matchedLed: number;
  materialSamples: number; maxOpenDelta: number; meanOpenDelta: number;
  ambiguousNames: number; pass: boolean;
} => {
  const m = matchOf(seed, percept ? 'forced' : 'plainForced');
  const WHY = /^switch to (.+) · open (\d+\.\d\d) · air lane/;
  let decisions = 0;
  let loftCands = 0;
  let matchedBody = 0;
  let matchedLed = 0;
  let material = 0;
  let maxDelta = 0;
  let deltaSum = 0;
  let ambiguous = 0;
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
    decidePlayer(carrier, m);
    const cand = carrier.action.scores.find((c) => c.action === 'LoftedPass');
    if (cand === undefined) continue;
    const parsed = WHY.exec(cand.why);
    if (parsed === null) continue;
    const named = t.players.filter((q) => q.name === parsed[1]);
    if (named.length !== 1) { ambiguous += 1; continue; }
    const mate = named[0];
    loftCands += 1;
    const reported = Number(parsed[2]);
    // the two re-derivations: at his FEET, and at the point the GROUND pass is priced
    // against (the aim the first build wrongly handed the loft)
    const seat = passLeadSeatOf(
      carrier, m, { ...t.genome, passLeadSupport: DOSE_FULL }, percept,
    );
    const lead = passLeadOffset(seat, carrier.pos, mate);
    const bodyOpen = opennessAt(mate.pos, opp.players);
    const ledOpen = opennessAt({ x: mate.pos.x + lead.x, y: mate.pos.y + lead.y }, opp.players);
    const delta = Math.abs(ledOpen - bodyOpen);
    deltaSum += delta;
    maxDelta = Math.max(maxDelta, delta);
    if (Math.abs(reported - Math.round(bodyOpen * 100) / 100) < 1e-9) matchedBody += 1;
    if (delta > 0.05) {
      material += 1;
      if (Math.abs(reported - Math.round(ledOpen * 100) / 100) < 1e-9) matchedLed += 1;
    }
  }
  return {
    decisions,
    loftCandidates: loftCands,
    matchedBody,
    matchedLed,
    materialSamples: material,
    maxOpenDelta: round(maxDelta),
    meanOpenDelta: round(deltaSum / Math.max(loftCands, 1)),
    ambiguousNames: ambiguous,
    // ⭐ every lofted candidate priced at the BODY, at least one sampled decision where
    // that is a MATERIALLY different number from the led point, and NOT ONE priced at
    // the led point there.
    pass: loftCands > 0 && matchedBody === loftCands && material > 0 && matchedLed === 0,
  };
};

/* ---- ⭐ G-EPI-MOTION: the motion channel is HONEST, per world shape ---------- */
/**
 * The OBM-T0 G-EPI form, applied to the MOTION channel. A percept-armed match is
 * stepped, every eligible mate's projection is recorded, then EVERY BODY'S TRUTH
 * VELOCITY IS REWRITTEN IN PLACE WITHOUT STEPPING — so no scan moment is recorded and
 * the remembered velocities still hold the old world, while truth no longer does.
 * POSITIONS are deliberately left alone, so the ONLY thing that can move a projection
 * is the motion source: this isolates exactly the channel this stage adds.
 *
 * The percept world must reproduce the PERCEPT-derived displacement for every body
 * and the truth-derived one for NONE. The BARE world must reproduce the TRUTH-derived
 * one — because truth is what ITS chooser reads; that is not a leak, it is the frozen
 * law's other half, and gating both halves is what makes "one inference form per
 * world shape" a mechanism rather than a promise.
 */
const epiMotionFixture = (seed: number): {
  perceptBodies: number; perceptMatchesPercept: number; perceptMatchesTruth: number;
  divergedBodies: number; meanRememberedAgeTicks: number;
  bareBodies: number; bareMatchesTruth: number; bareMatchesStalePercept: number;
  moduleMatchMembers: string[]; moduleBannedHits: string[];
  pass: boolean;
} => {
  const run = (percept: boolean): {
    bodies: number; matchesOwn: number; matchesOther: number; diverged: number; ageSum: number;
  } => {
    const m = matchOf(seed, percept ? 'forced' : 'plainForced');
    for (let i = 0; i < 600; i++) m.step(DT);
    // The fixture instant is the FIRST tick from here at which at least three
    // (carrier, support-mate) pairs exist AND the percept world has something
    // remembered about them — chosen by a stated rule, never by inspecting results.
    const pairs: { carrier: Player; mate: Player; before: { x: number; y: number }; age: number }[] = [];
    for (let guard = 0; guard < 4000 && pairs.length < 3 && !m.finished; guard++) {
      m.step(DT);
      pairs.length = 0;
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const carrier of t.players) {
          if (carrier.sentOff || carrier.role === 'GK') continue;
          const seat = passLeadSeatOf(
            carrier, m, { ...t.genome, passLeadSupport: DOSE_FULL }, percept,
          );
          for (const mate of t.players) {
            if (mate === carrier || mate.sentOff) continue;
            if (mate.action.type !== 'SupportBallCarrier') continue;
            const lead = passLeadOffset(seat, carrier.pos, mate);
            // a projection of exactly zero cannot distinguish the two sources, so
            // the fixture requires bodies the question is ASKABLE of
            if (lead.x === 0 && lead.y === 0) continue;
            const seen = seat.snapshot?.players.find((o) => o.gid === mate.gid) ?? null;
            pairs.push({
              carrier, mate, before: { x: lead.x, y: lead.y }, age: seen?.ageTicks ?? 0,
            });
          }
        }
      }
    }
    // ⭐ THE DIVERGENCE: rewrite every truth velocity WITHOUT stepping. No scan moment
    // is recorded, so the remembered velocities are untouched; positions are untouched
    // too, so `flight` is identical and ONLY the motion source can move a projection.
    const truthVel = new Map<number, { x: number; y: number }>();
    for (const p of m.allPlayers) {
      truthVel.set(p.gid, { x: p.vel.x, y: p.vel.y });
      p.vel.x = 7.5;
      p.vel.y = -6.25;
    }
    let matchesOwn = 0;
    let matchesOther = 0;
    let diverged = 0;
    let ageSum = 0;
    for (const pair of pairs) {
      const t = m.teams[pair.carrier.side];
      const seat = passLeadSeatOf(
        pair.carrier, m, { ...t.genome, passLeadSupport: DOSE_FULL }, percept,
      );
      const now = passLeadOffset(seat, pair.carrier.pos, pair.mate);
      // what the OTHER source would have said, on the same flight
      const flight = dist(pair.carrier.pos, pair.mate.pos) / PTP_FLIGHT_SPEED;
      const other = percept
        ? { x: 7.5 * flight * PTP_LEAD_FLIGHT_MUL, y: -6.25 * flight * PTP_LEAD_FLIGHT_MUL }
        : { x: pair.before.x, y: pair.before.y };
      const truthNow = { x: 7.5 * flight * PTP_LEAD_FLIGHT_MUL, y: -6.25 * flight * PTP_LEAD_FLIGHT_MUL };
      if (percept) {
        // percept: the projection must be UNCHANGED by the truth rewrite
        if (now.x === pair.before.x && now.y === pair.before.y) matchesOwn += 1;
        if (now.x === other.x && now.y === other.y) matchesOther += 1;
        if (pair.before.x !== other.x || pair.before.y !== other.y) diverged += 1;
      } else {
        // bare: the projection must FOLLOW the truth rewrite exactly
        if (now.x === truthNow.x && now.y === truthNow.y) matchesOwn += 1;
        if (now.x === pair.before.x && now.y === pair.before.y) matchesOther += 1;
        if (pair.before.x !== truthNow.x || pair.before.y !== truthNow.y) diverged += 1;
      }
      ageSum += pair.age;
    }
    void truthVel;
    return { bodies: pairs.length, matchesOwn, matchesOther, diverged, ageSum };
  };
  const percept = run(true);
  const bare = run(false);
  // the SOURCE-LEVEL pin: the seat module reads nothing on `match` but the snapshot
  const src = readFileSync('src/ai/passLeadSeat.ts', 'utf8');
  const code = src.split('\n').filter((l) => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');
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
      && percept.matchesOwn === percept.bodies // every body reads his OWN eyes
      && percept.diverged === percept.bodies // and truth really did move away
      && percept.matchesOther === 0 // and NOT ONE body reads the truth
      && bare.matchesOwn === bare.bodies // the bare world reads ITS own source
      && bare.diverged === bare.bodies
      && members.length === 1 && members[0] === 'perceivedSnapshot'
      && bannedHits.length === 0,
  };
};

/* ---- G-RNG (a): an armed, dosed decision draws zero rng ---------------------- */
const seamRng = (seed: number): { before: number; after: number; pass: boolean; calls: number } => {
  const m = matchOf(seed, 'forced');
  for (let i = 0; i < 400; i++) m.step(DT);
  const before = (m.rng as unknown as { s: number }).s;
  let calls = 0;
  for (const t of m.teams) {
    for (const p of t.players) {
      if (p.sentOff || p.role === 'GK') continue;
      const seat = passLeadSeatOf(p, m, { ...t.genome, passLeadSupport: DOSE_FULL }, true);
      for (const mate of t.players) {
        if (mate === p || mate.sentOff) continue;
        passLeadOffset(seat, p.pos, mate);
        calls += 1;
      }
    }
  }
  const after = (m.rng as unknown as { s: number }).s;
  return { before, after, pass: before === after && calls > 0, calls };
};

/* ---- G-RNG (b): the evolution path draws ZERO extra with the opt-in off ------ */
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
  // the opt-in really draws (so the zero-draw claim is about the flag, not a no-op)
  const rngOn = new Rng(616161);
  let gOn = randomGenome(new Rng(11));
  for (let gen = 0; gen < 8; gen++) {
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolvePassLeadSupport: true });
  }
  // the PRIOR opt-in's OWN stream is unmoved: an OBM-only run's matrix is identical
  // whether or not the new block also runs, because the new draws sit STRICTLY AFTER
  // it — in mutation AND in crossover.
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
  'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
/**
 * ⭐ The counts the CONSUMER half is pinned at (drift detection, the inventory's own
 * job): the gain-derived score gates the GROUND pass rides the led read with, and the
 * lofted switch's body-anchored re-reads. A new consumer of either read must be
 * enumerated in the stage doc's §DEV 4 in the same commit that adds it — the gate is
 * what makes that a rule rather than a habit.
 */
const BONUS_GATE_SITES = 10;
const LOFT_BODY_SITES = 8;
const forkTable = (): {
  sites: { file: string; line: number; kind: string; text: string }[];
  flagForks: number; aimApplySites: number; strikeSites: number;
  bonusGateSites: number; loftBodySites: number; mulFactorSites: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  const TOKENS = /ptpPassLead|ptpSeat|ptpLead|passLead|PassLead|PTP_FLIGHT_SPEED|PTP_LEAD_FLIGHT_MUL|bestLead|struckLead|const aim = lead|laneOpenness\(p\.pos, aim|opennessAt\(aim|team\.localX\(aim\.x\)/;
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      const t = text.trim();
      if (!TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === FORK_LINE ? 'FLAG_FORK'
        : /^const lead = ptpSeat === null \? null : passLeadOffset\(ptpSeat, p\.pos, mate\);$/.test(t)
          ? 'LEAD_COMPUTE'
          : /^const aim = lead === null \? mate\.pos :/.test(t) ? 'AIM_COMPOSE'
            : /laneOpenness\(p\.pos, aim, opp\.players\)/.test(t) ? 'AIM_APPLY_LANE'
              : /^const open = opennessAt\(aim, opp\.players\);$/.test(t) ? 'AIM_APPLY_OPEN'
                : /team\.localX\(aim\.x\)/.test(t) ? 'AIM_APPLY_GAIN'
                  : /^bestLead[XY] = lead === null \? 0 : lead\.[xy];$/.test(t) ? 'LEAD_CAPTURE'
                    : /^let bestLead[XY] = 0;$/.test(t) ? 'LEAD_NEUTRAL'
                      : /^\} else if \(passMate === bestMate && \(bestLeadX !== 0/.test(t)
                        ? 'STRIKE_GUARD'
                        : /^match\.performPass\(p, passMate!, offsideExemptKick, 1, v2\(bestLeadX, bestLeadY\)\);$/.test(t)
                          ? 'STRIKE_LED'
                          : /^readonly ptpPassLead: boolean;$/.test(t) ? 'FIELD'
                            : /^ptpPassLead\?: boolean;$/.test(t) ? 'CONFIG'
                              : /this\.ptpPassLead = cfg\.ptpPassLead \?\? false;/.test(t) ? 'INIT'
                                : /'ptpPassLead'/.test(t) ? 'UNION_KEY'
                                  : /^passLeadSupport\?: number;$/.test(t) ? 'GENE_DECL'
                                    : /^evolvePassLeadSupport\?: boolean;$/.test(t) ? 'OPTIN_DECL'
                                      : /evolvePassLeadSupport/.test(t) ? 'OPTIN_RW'
                                        : /passLeadSupport/.test(t) ? 'GENE_RW'
                                          : /^import |^\} from |from '\.\/passLeadSeat'/.test(t) ? 'IMPORT'
                                            : /^export (const|function|interface) /.test(t) ? 'SEAT_DECL'
                                              : f.endsWith('passLeadSeat.ts') ? 'SEAT_BODY'
                                                : /struckLead|ptpLead/.test(t) ? 'STRIKE_MACHINERY'
                                                  : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  // ⭐ THE CONSUMER HALF OF THE INVENTORY (the verify-round correction). The three
  // AIM_APPLY sites CREATE the moved reads; the inventory above stopped there, and
  // the stage doc consequently claimed "every bonus stays anchored to the body",
  // which was FALSE. Every DOWNSTREAM consumer of the (led) `gain` read is therefore
  // enumerated here too — BONUS_GATE — beside the loft's body-anchored re-reads
  // (LOFT_BODY) and the shared style chain (MUL_FACTOR). Scoped to the pass block of
  // `decideOnBall` so the through-ball loop's own body-anchored `gain` is not swept in.
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8').split('\n');
  const from = brain.findIndex((l) => l.trim().startsWith('const layingOff = p.action.type'));
  const to = brain.findIndex((l) => l.trim().startsWith('if (pressure > 0.5) bestPass *='));
  const already = new Set(sites.filter((s) => s.file.endsWith('PlayerBrain.ts')).map((s) => s.line));
  const consumers: { file: string; line: number; kind: string; text: string }[] = [];
  for (let i = from; i >= 0 && to > from && i <= to; i += 1) {
    const t = brain[i].trim();
    if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) continue;
    if (already.has(i + 1)) continue;
    if (!/\bgain\b|gainBody|openBody|mulBody|passMul/.test(t)) continue;
    const kind = /gainBody|openBody|mulBody/.test(t) ? 'LOFT_BODY'
      : /passMul/.test(t) ? 'MUL_FACTOR' : 'BONUS_GATE';
    consumers.push({ file: 'src/ai/PlayerBrain.ts', line: i + 1, kind, text: t });
  }
  const all = [...sites, ...consumers];
  const flagForks = sites.filter((s) => s.kind === 'FLAG_FORK');
  const aimApply = sites.filter((s) => s.kind.startsWith('AIM_APPLY'));
  const strike = sites.filter((s) => s.kind === 'STRIKE_LED');
  const bonusGates = consumers.filter((s) => s.kind === 'BONUS_GATE');
  const loftBody = consumers.filter((s) => s.kind === 'LOFT_BODY');
  return {
    sites: all,
    flagForks: flagForks.length,
    aimApplySites: aimApply.length,
    strikeSites: strike.length,
    bonusGateSites: bonusGates.length,
    loftBodySites: loftBody.length,
    mulFactorSites: consumers.filter((s) => s.kind === 'MUL_FACTOR').length,
    // ⭐ EXACTLY ONE flag fork, at the named site; exactly THREE scoring inputs read
    // at the aim; exactly ONE led-strike statement. Zero unclassified occurrences.
    // ⭐ AND the consumer half: the led `gain` has BONUS_GATE consumers (so the doc's
    // enumeration is the whole of them and the region was found at all), and the loft
    // has its own body-anchored re-reads.
    pass: flagForks.length === 1 && flagForks[0].file.endsWith('PlayerBrain.ts')
      && aimApply.length === 3 && aimApply.every((s) => s.file.endsWith('PlayerBrain.ts'))
      && strike.length === 1 && strike[0].file.endsWith('PlayerBrain.ts')
      && sites.filter((s) => s.kind === 'AIM_COMPOSE').length === 1
      && sites.filter((s) => s.kind === 'LEAD_COMPUTE').length === 1
      && sites.filter((s) => s.kind === 'OTHER').length === 0
      && from >= 0 && to > from
      && bonusGates.length === BONUS_GATE_SITES && loftBody.length === LOFT_BODY_SITES,
  };
};

/* ---- G-TRACE: both constants matched VERBATIM at the lines they come from ---- */
const TRACE_LINES: readonly { file: string; line: string; what: string }[] = [
  {
    file: 'src/ai/PlayerBrain.ts', what: 'the through-ball loop\'s OWN flight divisor (18)',
    line: 'const flight = dist(p.pos, mate.pos) / 18;',
  },
  {
    file: 'src/ai/formations.ts', what: 'runBurstPoint\'s OWN in-stride lead factor (1.6)',
    line: 'return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);',
  },
  {
    file: 'src/ai/passLeadSeat.ts', what: 'this seat\'s flight-speed declaration',
    line: 'export const PTP_FLIGHT_SPEED = 18;',
  },
  {
    file: 'src/ai/passLeadSeat.ts', what: 'this seat\'s lead-factor declaration',
    line: 'export const PTP_LEAD_FLIGHT_MUL = 1.6;',
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: '⭐ M-PTP.4: the MakeRun through-ball guard, UNTOUCHED',
    line: "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: '⭐ M-PTP.4: the through-ball burst call, UNTOUCHED',
    line: 'const burst = runBurstPoint(mate, team, opp.players, flight);',
  },
  {
    file: 'src/sim/mechanics.ts', what: 'the incumbent strike-time lead, UNTOUCHED in arithmetic',
    line: 'const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));',
  },
  {
    file: 'src/ai/perception.ts', what: 'opennessOf is now the body form of opennessAt (code motion)',
    line: 'return opennessAt(p.pos, opponents);',
  },
  {
    file: 'src/sim/mechanics.ts',
    what: '⭐ THE COMPOSITION, pinned rather than described: the struck point is the '
      + 'INCUMBENT correction PLUS the chooser\'s priced lead — so a led pass is NOT struck '
      + 'at the priced aim, it is struck BEYOND it (the smoke reports by how much)',
    line: ': v2(struckLead.x + ptpLead.x, struckLead.y + ptpLead.y);',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐ M-PTP.4 kept TRUE: the LOFTED switch prices at the BODY (its openness re-read '
      + 'at `mate.pos`, never at the aim)',
    line: 'const openBody = lead === null ? open : opennessAt(mate.pos, opp.players);',
  },
];
const traceGate = (): {
  pass: boolean; lines: { file: string; line: string; what: string; found: boolean }[];
  flightSpeed: number; leadMul: number; geneDomain: readonly [number, number];
} => {
  const lines = TRACE_LINES.map((t) => ({
    ...t, found: readFileSync(t.file, 'utf8').includes(t.line),
  }));
  return {
    pass: lines.every((l) => l.found)
      && PTP_FLIGHT_SPEED === 18 && PTP_LEAD_FLIGHT_MUL === 1.6
      && passLeadSupportWeight({ passLeadSupport: 2 } as TacticalGenome) === 1
      && passLeadSupportWeight({ passLeadSupport: -1 } as TacticalGenome) === 0
      && passLeadSupportWeight({} as TacticalGenome) === 0,
    lines,
    flightSpeed: PTP_FLIGHT_SPEED,
    leadMul: PTP_LEAD_FLIGHT_MUL,
    geneDomain: [0, 1],
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const SEAM_FILES = [
  'src/sim/Match.ts', 'src/sim/League.ts', 'src/sim/mechanics.ts', 'src/ai/passLeadSeat.ts',
  'src/ai/PlayerBrain.ts', 'src/ai/perception.ts', 'src/evolution/genome.ts',
];
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
  return {
    defaultFalse: matchSrc.includes('this.ptpPassLead = cfg.ptpPassLead ?? false;'),
    absentFromA4World: !a4.includes('ptpPassLead') && !a4.includes('passLeadSupport'),
    notInGeneKeys: !(GENE_KEYS as readonly string[]).includes('passLeadSupport'),
    noEnvDoor: SEAM_FILES.every((f) => readFileSync(f, 'utf8').split('\n')
      .filter((l) => /ptpPassLead|passLeadSupport|passLeadSeat|PTP_/.test(l))
      .every((l) => !/envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))),
    freshMatchOff: matchOf(1, 'absent').ptpPassLead === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260811 });
      return l.createMatch(l.nextFixture()!).ptpPassLead === false;
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
      pin: '⭐ O1-T1: the SYNCHRONOUS strike statement, pinned VERBATIM (this is what shaped '
        + 'the design — the led strike is its OWN statement beside it, never an edit to it)',
      file: 'tests/o1PassWindup.test.ts',
      needle: 'expect(passCase).toMatch(/else match\\.performPass\\(p, passMate!, offsideExemptKick\\);/);',
    },
    {
      pin: 'O1-T1: the wind-up fork, pinned verbatim (it keeps PRECEDENCE over the led strike)',
      file: 'tests/o1PassWindup.test.ts',
      needle: '/if \\(match\\.o1PassWindup && !mustKick && p\\.firstTouchWindow <= 0\\) \\{/',
    },
    {
      pin: 'O1-T1: the KICKOFF pass line, untouched',
      file: 'tests/o1PassWindup.test.ts',
      needle: "expect(kickoffLine.trim()).toBe('match.performPass(p, back);');",
    },
    {
      pin: 'the SupportBallCarrier / ThroughBall action-type surface',
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
      pin: 'the goal-level shape pin (heir of the mirror-goals starvation receipt)',
      file: 'tests/formations.test.ts',
      needle: 'the novel shapes play REAL football — attack both ways over a seed pool',
    },
    {
      pin: 'the BANKED OBM seat\'s own fixtures (must pass verbatim)',
      file: 'tests/obmEyesSeat.test.ts',
      needle: 'obmMovement',
    },
    {
      pin: 'the BANKED CTB plane\'s own verbatim source pin (must pass unchanged)',
      file: 'tests/ctbSupportPlane.test.ts',
      needle: 'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {',
    },
    {
      pin: 'the perceived-chooser fork\'s own pins (the seam this stage READS the world shape from)',
      file: 'tests/perceivedPassChoice.test.ts',
      needle: 'edsPerceivedChoice',
    },
  ].map((p) => ({ ...p, found: readFileSync(p.file, 'utf8').includes(p.needle) }));
  // the source lines those pins assert must ALSO still be present in src, verbatim
  const srcVerbatim = ([
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

/* ---- REPORTED: the forced-dose smoke — are LED passes actually chosen? ------- */
/**
 * ONE forced match with `performPass` WRAPPED on the instance (the o1PassWindup test
 * idiom): every chosen pass is recorded with the 5th argument the brain handed the
 * strike — i.e. THE ACTUAL AIM the ball was struck at — and the law is re-checked on
 * those real choices. The original is always called, so the match trajectory is the
 * forced arm's own; this reading is never compared to a signature.
 */
const dosedSmoke = (seed: number, percept: boolean): {
  passes: number; ledPasses: number; supportTargets: number;
  meanLeadMetres: number; maxLeadMetres: number; meanLeadShareOfDistance: number;
  signViolations: number; magnitudeViolations: number;
  meanStruckBeyondPricedMetres: number; maxStruckBeyondPricedMetres: number;
  ledPassShare: number;
} => {
  const m = matchOf(seed, percept ? 'forced' : 'plainForced');
  const orig = m.performPass.bind(m);
  let passes = 0;
  let led = 0;
  let supportTargets = 0;
  let leadSum = 0;
  let leadMax = 0;
  let shareSum = 0;
  let signBad = 0;
  let magBad = 0;
  let beyondSum = 0;
  let beyondMax = 0;
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    passes += 1;
    if (mate.action.type === 'SupportBallCarrier') supportTargets += 1;
    if (ptpLead !== null) {
      led += 1;
      const t = m.teams[p.side];
      const seat = passLeadSeatOf(p, m, { ...t.genome, passLeadSupport: DOSE_FULL }, percept);
      const motion = passLeadMotion(seat, mate);
      const flight = dist(p.pos, mate.pos) / PTP_FLIGHT_SPEED;
      const mag = Math.hypot(ptpLead.x, ptpLead.y);
      const want = DOSE_FULL * Math.hypot(motion.x, motion.y) * flight * PTP_LEAD_FLIGHT_MUL;
      if (Math.abs(mag - want) > 1e-9) magBad += 1;
      if (mag > 1e-9 && (ptpLead.x * motion.x + ptpLead.y * motion.y) <= 0) signBad += 1;
      leadSum += mag;
      leadMax = Math.max(leadMax, mag);
      const d = dist(p.pos, mate.pos);
      shareSum += d > 0 ? mag / d : 0;
      // ⭐ THE COMPOSITION, MEASURED (the verify-round wording correction). The ball is
      // NOT struck at the priced aim: `performPass` composes the INCUMBENT strike-time
      // correction (`mate.pos + mate.vel · flightExec · 0.8`, the passer's own body
      // knowledge, untouched since long before this seam) WITH the chooser's priced
      // `ptpLead`. So the struck point is the priced aim PLUS that correction, and the
      // distance between them is exactly |struckLead − mate.pos| — re-derived here from
      // `performPass`'s own exported arithmetic, powerChoice 1 (what the led-strike
      // statement always hands it), and reported beside every "follows pricing" claim.
      const misalign = kickMisalignment(p, norm(sub(mate.pos, p.pos)));
      const powerMul = orientationPowerMul(misalign, p.attrs.passing);
      const flightExec = dist(p.pos, mate.pos) / (16 * powerMul);
      const beyond = Math.hypot(mate.vel.x, mate.vel.y) * flightExec * 0.8;
      beyondSum += beyond;
      beyondMax = Math.max(beyondMax, beyond);
    }
    orig(p, mate, offsideExempt, powerChoice, ptpLead);
  };
  while (!m.finished) m.step(DT);
  const n = Math.max(led, 1);
  return {
    passes,
    ledPasses: led,
    supportTargets,
    meanLeadMetres: round(leadSum / n),
    maxLeadMetres: round(leadMax),
    meanLeadShareOfDistance: round(shareSum / n),
    signViolations: signBad,
    magnitudeViolations: magBad,
    meanStruckBeyondPricedMetres: round(beyondSum / n),
    maxStruckBeyondPricedMetres: round(beyondMax),
    ledPassShare: round(led / Math.max(passes, 1)),
  };
};

/* ---- REPORTED: the seat's wall-clock cost ------------------------------------ */
const COST_REPEATS = 3;
const costReading = (seed: number): {
  repeats: number; ticksPerMatch: number;
  arms: { arm: string; minMs: number; msPerTick: number }[];
  armedZeroOverheadPct: number; dosedOverheadPct: number;
} => {
  const timeOne = (arm: Arm): { ms: number; ticks: number } => {
    const m = matchOf(seed, arm);
    let ticks = 0;
    const t0 = Date.now();
    while (!m.finished) { m.step(DT); ticks += 1; }
    return { ms: Date.now() - t0, ticks };
  };
  const arms: Arm[] = ['off', 'zeroArmed', 'forced'];
  let ticks = 0;
  const rows = arms.map((arm) => {
    let best = Number.POSITIVE_INFINITY;
    for (let r = 0; r < COST_REPEATS; r++) {
      const one = timeOne(arm);
      ticks = one.ticks;
      best = Math.min(best, one.ms);
    }
    return { arm, minMs: best, msPerTick: round(best / Math.max(ticks, 1), 6) };
  });
  const off = rows[0].minMs;
  return {
    repeats: COST_REPEATS,
    ticksPerMatch: ticks,
    arms: rows,
    armedZeroOverheadPct: round(((rows[1].minMs - off) / off) * 100, 2),
    dosedOverheadPct: round(((rows[2].minMs - off) / off) * 100, 2),
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; zeroArmed: string; forced: string; plainForced: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean;
    zeroIdentical: boolean; diverged: boolean; bareDiverged: boolean;
  }[];
  for (let k = 0; k < N; k++) {
    const seed = BLOCK + k;
    const absent = walk(seed, 'absent');
    const off = walk(seed, 'off');
    const plain = walk(seed, 'plain');
    const plainOff = walk(seed, 'plainOff');
    const born = walk(seed, 'bornArmed');
    const zero = walk(seed, 'zeroArmed');
    const forced = walk(seed, 'forced');
    const plainForced = walk(seed, 'plainForced');
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, zeroArmed: zero, forced, plainForced,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      zeroIdentical: zero === absent,
      diverged: forced !== absent,
      bareDiverged: plainForced !== plain,
    });
  }
  // ⭐ the TWO-DOORS crossing, inside the core so G-DET covers it too
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

process.stderr.write(`=== PTP T0 PASS-LEAD RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [ptp-t0] run A digest ${digestA}\n  [ptp-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [ptp-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ---------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [ptp-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, gene absent, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [ptp-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const geometryPercept = aimGeometry(READ_SEED, true);
const geometryBare = aimGeometry(READ_SEED, false);
const epi = epiMotionFixture(READ_SEED);
const loftPercept = loftBodyPricing(READ_SEED, true);
const loftBare = loftBodyPricing(READ_SEED, false);
const gLoftBody = loftPercept.pass && loftBare.pass;
const smokePercept = dosedSmoke(READ_SEED, true);
const smokeBare = dosedSmoke(READ_SEED, false);
const seamDraws = seamRng(READ_SEED);
const evo = evoRng();
const fork = forkTable();
const trace = traceGate();
const hyg = hygiene();
const pins = pinTable();
process.stderr.write('  [ptp-t0] REPORTED cost reading...\n');
const cost = costReading(COST_SEED);
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const intervals = [
    { name: 'PTP-T0 receipts + geometry/EPI-MOTION/smoke read', first: BLOCK, last: READ_SEED },
    { name: 'PTP-T0 REPORTED cost reading', first: COST_SEED, last: COST_SEED },
    { name: 'PTP-T0 test-file seeds (tests/ptpPassLead.test.ts)', first: 12_425_900, last: 12_425_906 },
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
      + 'consumed ledger, which now includes OBM-T1\'s four blocks (smoke 12,424,026–037 · '
      + 'dose-read 040 · guard 050–099 · battery+reserve 100–727) and OBM-T0\'s test seeds.',
  };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gZero = runA.rows.every((r) => r.zeroIdentical);
const gBite = runA.rows.every((r) => r.diverged && r.bareDiverged)
  && geometryPercept.pass && geometryBare.pass
  && smokePercept.ledPasses > 0 && smokePercept.signViolations === 0
  && smokePercept.magnitudeViolations === 0
  && smokeBare.ledPasses > 0 && smokeBare.signViolations === 0
  && smokeBare.magnitudeViolations === 0;
const gCross = runA.crossing.claims.every((c) => c.pass);
const gRng = seamDraws.pass && evo.genomesIdentical && evo.rngStateIdentical
  && evo.geneStayedAbsent && evo.optInDraws && evo.obmStreamUnmoved && evo.crossoverOrderHeld;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gZero && gBite && epi.pass
  && gLoftBody && gCross && gRng && gHygiene && fork.pass && trace.pass && pins.pass
  && seedDisjoint.pass;

const body = {
  stage: 'PTP T0 — the dormant PASS-LEAD seam (`passLeadSupport` / `ptpPassLead`)',
  ruling: '#231 (the dispatch) + #181.2 (the standing receipt rule) + #194 (gate semantics '
    + 'stated exactly) + #197-M1 (commit-free hashed body) + #200 (no predicates) + #202 '
    + '(traced bounds) + #228 (the two-doors lesson, gated from birth)',
  contract: 'docs/world-model/PASS-TO-PATH-CONTRACT.md',
  doc: 'docs/world-model/PTP-T0-DORMANT-SEAM.md',
  frozenLaw: {
    flightSpeed: PTP_FLIGHT_SPEED,
    leadFlightMul: PTP_LEAD_FLIGHT_MUL,
    geneDomain: [0, 1],
    dose: { zero: DOSE_ZERO, full: DOSE_FULL },
    derivation: 'THE PROJECTION (M-PTP.1), for a SUPPORT-mode mate in the ordinary pass loop: '
      + 'flight = dist(carrier.pos, mate.pos) / PTP_FLIGHT_SPEED (18 — the through-ball loop\'s '
      + 'OWN divisor, cited verbatim at src/ai/PlayerBrain.ts); displacement = motion · flight · '
      + 'PTP_LEAD_FLIGHT_MUL (1.6 — runBurstPoint\'s OWN in-stride lead factor, cited verbatim '
      + 'at src/ai/formations.ts); aim = mate.pos + passLeadSupportWeight(g) · displacement. The '
      + 'three scoring inputs the contract names — lane, open, gain — are evaluated AT the aim '
      + 'point; d, the offside read and the kick misalignment stay anchored to the BODY. '
      + 'THE MOTION SOURCE IS THE CHOOSER\'S OWN, per world shape: truth velocity in a bare '
      + 'world (the same source mate.pos already is) and the REMEMBERED velocity of that mate '
      + 'in this body\'s own perceived snapshot when edsPerceivedChoice has swapped the chooser '
      + 'onto percepts — a mate he has not seen has NO motion for him, hence zero, hence to '
      + 'feet. NO PREDICATE (#200): a still mate\'s displacement is zero BY ARITHMETIC. '
      + 'ZERO-POINT: gene absent or 0 ⇒ the displacement is exactly ±0 and mate.pos + ±0 === '
      + 'mate.pos in IEEE-754 ⇒ the ordinary loop\'s arithmetic is byte-identical. EXECUTION '
      + 'FOLLOWS PRICING: the winner\'s own lead is handed to performPass as a 5th argument and '
      + 'ADDED to the incumbent strike-time lead (mate.vel · flight · 0.8, untouched), on its '
      + 'own armed-only statement beside the pinned synchronous one. NO CAP is taken: the '
      + 'displacement is bounded by construction and an over-greedy lead prices ITSELF out '
      + 'through lane/open/gain, which are read AT the aim.',
  },
  gates: {
    gDet: { pass: gDet, digestA, digestB },
    gIdent: {
      pass: gIdentPass, seasons: FINGERPRINT_SEASONS,
      procedure: 'new League({seed}) → runHeadless toGeneration(generation + 2) → '
        + 'sha256(JSON.stringify(out.league)) — identical to scripts/fingerprint.ts',
      semantics: 'THE RNG-STREAM RECEIPT for the sim path: these baselines were frozen from '
        + 'PRE-change code, so any draw added on the dormant path — conditional or not — would '
        + 'break them.',
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
      semantics: 'THE ARMS DIFFER IN CODE PATH: armed ⇒ the seat is BUILT on every on-ball '
        + 'decision and, in the percept-armed world, PULLS THIS BODY\'S SNAPSHOT; the aim point '
        + 'is composed per candidate mate through the live branch. Byte-identity to OFF '
        + 'therefore proves the born-absent gene inert THROUGH the live branch AND the percept '
        + 'pull free of side effects on any other consumer.',
    },
    gZero: {
      pass: gZero, seeds: N,
      semantics: 'THE ZERO-POINT IDENTITY, ARITHMETIC-EXACT: armed with the gene PRESENT at 0. '
        + 'The arms differ in code path AND in gene state; byte-identity proves the projection '
        + 'term is exactly +0 and that the aim composition, the three re-anchored scoring inputs '
        + 'and the strike are IEEE-754 identities at the zero-point.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      bareDivergedSeeds: runA.rows.filter((r) => r.bareDiverged).length,
      seeds: N,
      aimGeometryPercept: geometryPercept,
      aimGeometryBare: geometryBare,
      chosenPassesPercept: smokePercept,
      chosenPassesBare: smokeBare,
      semantics: 'THREE things at once. (i) DIVERGENCE: armed at the gene\'s upper corner the '
        + 'world moves on every seed, in the percept world AND in the bare world. (ii) THE LAW '
        + 'ON SAMPLED DECISIONS: on live match states the led displacement is re-derived '
        + 'INDEPENDENTLY from the world\'s own motion source and must match exactly, point '
        + 'along the motion (SIGN) and have magnitude gene·|motion|·flight·MUL; a NON-support '
        + 'mate\'s lead must be exactly zero; a STILL mate\'s lead must be exactly zero WITHOUT '
        + 'a branch (#200); the zero dose must give exactly zero. (iii) THE PASSES ACTUALLY '
        + 'CHOSEN: `performPass` is wrapped on a forced match so the 5th argument — the aim the '
        + 'ball was really struck at — is recorded for every chosen pass, and the same sign and '
        + 'magnitude law is re-checked on those real choices.',
    },
    gLoftBody: {
      pass: gLoftBody, percept: loftPercept, bare: loftBare,
      semantics: '⭐ THE VERIFY-ROUND CORRECTION, GATED (#191 form). ⚠ JUSTIFICATION RETRACTED '
        + 'AND RESTATED by the re-verify round: the earlier wording here said `performLoftedPass` '
        + 'carries NO lead and is struck at the man\'s FEET — that was FALSE. The switch strikes '
        + 'on its OWN INCUMBENT lead (src/sim/mechanics.ts, `add(mate.pos, scale(mate.vel, '
        + 'flight0 * 0.7))`, measured mean 0.72 m), so it aims at NEITHER the body NOR this '
        + 'slice\'s ptpLead point. That incumbent strike is OUT OF SLICE (M-PTP.4) and is left '
        + 'UNTOUCHED — its price/strike gap is the INCUMBENT\'s own. What this slice does is '
        + 'RESTORE the loft\'s incumbent BODY-anchored PRICING, and the rationale survives the '
        + 'retraction intact: a ptpLead-priced loft would be priced against an aim its execution '
        + 'never uses. So its candidate is PRICED '
        + 'AT THE BODY: openness, forward gain and the style chain are read at `mate.pos` while '
        + 'the GROUND pass keeps the led values it will actually be struck with. Measured END TO '
        + 'END through the brain on an ARMED + FULLY DOSED match — the LoftedPass candidate\'s '
        + 'own reported openness against BOTH re-derivations (feet vs the led aim, the aim '
        + 'rebuilt independently from the frozen law). NON-VACUITY IS IN THE PREDICATE: the two '
        + 'must diverge MATERIALLY (> 0.05) on at least one sampled decision and the led value '
        + 'must be matched ZERO times there. ⚠ DECLARED INTERVENTION: an INSTRUMENT match '
        + '(`decidePlayer` is called on the carrier), compared to no signature anywhere.',
    },
    gEpiMotion: {
      ...epi,
      semantics: '⭐ THE HONESTY CORE, PROVED NOT ASSERTED. A match is stepped 600 ticks, every '
        + 'eligible (carrier, support-mate) projection is recorded, then EVERY TRUTH VELOCITY IS '
        + 'REWRITTEN IN PLACE WITHOUT STEPPING — no scan moment is recorded, so the remembered '
        + 'velocities still hold the old world. POSITIONS ARE UNTOUCHED, so `flight` is '
        + 'identical and the ONLY thing that can move a projection is its motion source. In the '
        + 'PERCEPT world every projection must be UNCHANGED (it reads his own eyes) and NOT ONE '
        + 'may equal the truth-derived value; in the BARE world every projection must FOLLOW '
        + 'the truth exactly, because truth is what THAT chooser reads. Both halves are gated: '
        + 'that is what makes "one inference form per world shape" a mechanism. Plus the SOURCE '
        + 'pin: the only member of `match` the seat module names is `perceivedSnapshot`.',
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
      semantics: '⭐⭐ THE TWO-DOORS MATRIX (#228), gated FROM BIRTH rather than remembered. '
        + 'The OBM-T0 verify catch found a seat that spent a NEIGHBOURING seam\'s banked genes '
        + 'because no gate ever crossed the two arming doors. This stage crosses all three '
        + 'doors of the family it lands in — {ptpPassLead × obmMovement × ctbSupportPlane} × '
        + '{the neighbours\' banks dosed/absent} × {this gene absent/zero/dosed} = 48 cells, a '
        + 'FULL match per cell per seed, whole-run signature incl. rng state. Arming this door '
        + 'alone with BOTH neighbour banks fully dosed must be byte-identical to ALL-OFF; the '
        + 'neighbours armed alone must be unmoved by this gene at any dose; and the '
        + 'DISCRIMINATION rows prove the three seams are distinguishable, without which every '
        + 'identity above would be vacuous.',
    },
    gRng: {
      pass: gRng,
      seam: {
        ...seamDraws,
        semantics: 'an ARMED, fully DOSED seat built and applied over every outfielder of both '
          + 'teams against every mate on a 400-tick fixture: the match rng state is EXACT before '
          + 'and after. The percept pull draws nothing either.',
      },
      evolution: {
        ...evo,
        semantics: 'THE ARMS DIFFER: the shipped mutate/crossover with the opt-in OFF vs a '
          + 'faithful PRE-GENE re-implementation (GENE_KEYS only). Identical genomes AND '
          + 'identical final rng state ⇒ zero extra draws; `optInDraws` shows the opt-in path is '
          + 'live; `obmStreamUnmoved` and `crossoverOrderHeld` show the new draws sit STRICTLY '
          + 'AFTER the offballMovement block (hence after ctbSupportPlane, markSag, '
          + 'defLaneConvergence and both home-prior blocks) in mutation and in crossover alike.',
      },
    },
    gHygiene: { pass: gHygiene, ...hyg },
    gFork: {
      pass: fork.pass, flagForks: fork.flagForks, aimApplySites: fork.aimApplySites,
      strikeSites: fork.strikeSites, bonusGateSites: fork.bonusGateSites,
      loftBodySites: fork.loftBodySites, mulFactorSites: fork.mulFactorSites,
      semantics: '⭐ THE READ-FORK INVENTORY: EXACTLY ONE `match.ptpPassLead` fork in src/** — '
        + 'the seat fork in PlayerBrain.decideOnBall\'s pass block — feeding exactly ONE lead '
        + 'computation, ONE aim composition, THREE aim-priced scoring inputs (lane, open, gain), '
        + 'ONE lead capture pair and ONE led-strike statement. Everything else that names the '
        + 'flag, the gene, the opt-in or the seat module is a declaration, an init, the League '
        + 'union key, an import or the seat module\'s own body — all enumerated below with '
        + 'file:line and class, ZERO unclassified. ⭐ AND THE CONSUMER HALF (the verify-round '
        + 'correction): the three AIM_APPLY sites CREATE the moved reads, so every DOWNSTREAM '
        + 'consumer is enumerated too — 10 BONUS_GATE rows (the gain-derived score gates the '
        + 'GROUND pass rides the LED gain with, BY DESIGN: it gates the pass it will strike), '
        + '8 LOFT_BODY rows (the lofted switch\'s body-anchored re-reads, M-PTP.4) and 2 '
        + 'MUL_FACTOR rows. ⭐ THE COUNTING RULE, STATED (the re-verify round\'s LOW): a row is '
        + 'ONE SOURCE LINE of the pass block that names a gain read and is not already '
        + 'classified above — NOT one logical gate. Two places where the two would diverge, so '
        + 'the doc\'s §DEV 4 table enumerates the SAME ten lines this gate counts: the '
        + 'stagnation tilt\'s `else` half is a SECOND logical branch but shares no gain token, '
        + 'so it is NOT a row (it rides the same row as the `gain > 0.05` half); and the '
        + '"don\'t hand it straight back" test and the third-man release test are TWO separate '
        + 'lines, hence TWO rows, not one. ⭐ AND THE MUL_FACTOR DUAL USE: `passMul` is ONE '
        + 'declaration called TWICE — with the LED gain for the ground pass and with `gainBody` '
        + 'for the loft (since the correction commit) — so the four style-chain gates inside it '
        + '(stagnation, CounterAttack, BuildUp, open-run suppression) are counted ONCE as '
        + 'BONUS_GATE rows but RUN on both gains, one world each. The counts '
        + 'are PINNED, so a new consumer cannot appear without reddening this gate and forcing '
        + 'the stage doc\'s §DEV 4 enumeration to be updated in the same commit.',
      sites: fork.sites,
    },
    gTrace: {
      ...trace,
      semantics: 'both projection constants are TRACED to the exact lines they are taken from, '
        + 'and those lines are matched VERBATIM (the MARK_SAG_BALL_SPEED precedent — the family '
        + 'cannot drift without reddening this gate): 18 from the through-ball loop\'s own '
        + 'flight divisor, 1.6 from runBurstPoint\'s own in-stride lead. The same gate asserts '
        + 'M-PTP.4 in source form — the MakeRun guard and the burst call are UNTOUCHED — and '
        + 'that the gene\'s domain really is clamp01\'s [0,1] at both ends and at absence.',
    },
    gPins: {
      pass: pins.pass, srcVerbatim: pins.srcVerbatim, namedPins: pins.namedPins,
      semantics: 'THE PIN INVENTORY, machine-checked. ⭐ The first row is the pin that SHAPED '
        + 'this design: tests/o1PassWindup.test.ts asserts the synchronous strike statement '
        + 'VERBATIM, so the led strike could never be an extra argument on that line — it is its '
        + 'own armed-only statement beside it, and the wind-up keeps precedence. Nothing was '
        + 'renegotiated; a failing pin would have been a STOP, never a test edit.',
    },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    chosenPassSmoke: {
      note: 'REPORTED, observation-only, ONE forced match per world shape with `performPass` '
        + 'wrapped so the ACTUAL struck aim is recorded. Descriptive counts only — no control, '
        + 'no CI, no dose curve, no ANSWER. The FULL-CHANNEL EXAM is PTP-T1\'s.',
      seed: READ_SEED,
      percept: smokePercept,
      bare: smokeBare,
    },
    seatCost: {
      note: 'REPORTED wall-clock on a shared machine, minimum of 3 repeats, one full match per '
        + 'arm in a PERCEPT-ARMED world. Used in NO rate, bounds nothing. The mechanism it '
        + 'prices: ONE percept pull per on-ball decision of the carrier (never per candidate '
        + 'mate, never per tick) plus a handful of multiply-adds per mate.',
      seed: COST_SEED,
      ...cost,
    },
  },
  result: runA,
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free
 *  body, so a third party re-deriving it at ANY later commit gets the same hash. */
const hashedBody = {
  ...body,
  reported: {
    ...body.reported,
    seatCost: { note: body.reported.seatCost.note, seed: COST_SEED },
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
o(`=== PTP T0 PASS-LEAD RECEIPTS — head ${head} (context only) — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-ZERO ${gZero ? 'PASS' : 'FAIL'}`
  + ` · G-BITE ${gBite ? 'PASS' : 'FAIL'} · ⭐G-EPI-MOTION ${epi.pass ? 'PASS' : 'FAIL'}`
  + ` · ⭐G-LOFT-BODY ${gLoftBody ? 'PASS' : 'FAIL'}`
  + ` · ⭐⭐G-CROSS ${gCross ? 'PASS' : 'FAIL'} · G-RNG ${gRng ? 'PASS' : 'FAIL'}`
  + ` · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'} · G-FORK ${fork.pass ? 'PASS' : 'FAIL'}`
  + ` · G-TRACE ${trace.pass ? 'PASS' : 'FAIL'} · G-PINS ${pins.pass ? 'PASS' : 'FAIL'}`
  + ` · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`FROZEN LAW: aim = mate.pos + gene · (motion · dist/${PTP_FLIGHT_SPEED} · ${PTP_LEAD_FLIGHT_MUL})`
  + ' · gene ∈ [0,1] · motion = truth vel (bare) / remembered percept vel (percept world)');
o(`AIM GEOMETRY percept (${geometryPercept.supportSamples} support samples of ${geometryPercept.samples}):`
  + ` moved ${geometryPercept.movedSamples} · still ${geometryPercept.stillSamples}`
  + ` · mean lead ${geometryPercept.meanLeadMetres} m (max ${geometryPercept.maxLeadMetres})`
  + ` · violations ${JSON.stringify(geometryPercept.violations)}`);
o(`AIM GEOMETRY bare    (${geometryBare.supportSamples} support samples of ${geometryBare.samples}):`
  + ` moved ${geometryBare.movedSamples} · still ${geometryBare.stillSamples}`
  + ` · mean lead ${geometryBare.meanLeadMetres} m (max ${geometryBare.maxLeadMetres})`
  + ` · violations ${JSON.stringify(geometryBare.violations)}`);
o(`⭐ G-EPI-MOTION: percept ${epi.perceptMatchesPercept}/${epi.perceptBodies} read their own eyes`
  + ` · truth-matched ${epi.perceptMatchesTruth} · diverged ${epi.divergedBodies}`
  + ` · mean remembered age ${epi.meanRememberedAgeTicks} ticks`
  + ` | bare ${epi.bareMatchesTruth}/${epi.bareBodies} follow truth`
  + ` · module match members [${epi.moduleMatchMembers.join(', ')}]`);
o('⭐ G-LOFT-BODY (the lofted switch prices at the BODY, armed + dosed):');
for (const [shape, r] of [['percept', loftPercept], ['bare', loftBare]] as const) {
  o(`  ${shape.padEnd(8)} ${r.matchedBody}/${r.loftCandidates} loft candidates priced at the BODY`
    + ` · material divergences ${r.materialSamples} (max Δopen ${r.maxOpenDelta})`
    + ` · priced at the LED point ${r.matchedLed}`);
}
o(`⭐⭐ G-CROSS (${CROSS_CELLS.length} cells × ${runA.crossing.seeds.n} seeds): `
  + `${runA.crossing.claims.filter((c) => c.pass).length}/${runA.crossing.claims.length} claims held`);
for (const c of runA.crossing.claims) {
  o(`  ${c.pass ? 'PASS' : '*** FAIL ***'} ${c.seedsHeld}/${c.seeds} ${c.equal ? '≡' : '≠'} ${c.name}`);
}
o(`⭐⭐ G-CROSS TABLE (seed ${String(runA.crossing.rows[0].seed)}, sha12 per cell):`);
for (const cell of runA.crossing.cells) {
  o(`  ${cell.padEnd(34)} ${runA.crossing.rows[0].cells[cell].slice(0, 12)}`);
}
o(`G-RNG seam: rng ${seamDraws.before} → ${seamDraws.after} over ${seamDraws.calls} armed dosed projections`);
o(`FORK TABLE: ${fork.flagForks} flag fork(s), ${fork.aimApplySites} aim-priced input(s), `
  + `${fork.strikeSites} led-strike statement(s), ${fork.bonusGateSites} BONUS_GATE consumer(s), `
  + `${fork.loftBodySites} LOFT_BODY re-read(s), ${fork.sites.length} src occurrence(s) total`);
o(`PIN INVENTORY: ${pins.namedPins.filter((p) => p.found).length}/${pins.namedPins.length} named pins present`
  + ` · src verbatim ${pins.srcVerbatim}`);
o(`REPORTED chosen-pass smoke (percept): ${smokePercept.ledPasses}/${smokePercept.passes} passes LED`
  + ` · mean lead ${smokePercept.meanLeadMetres} m (max ${smokePercept.maxLeadMetres})`
  + ` · lead/distance ${smokePercept.meanLeadShareOfDistance}`
  + ` · struck ${smokePercept.meanStruckBeyondPricedMetres} m BEYOND the priced aim`
  + ` · sign/magnitude violations ${smokePercept.signViolations}/`
  + `${smokePercept.magnitudeViolations}`);
o(`REPORTED chosen-pass smoke (bare):    ${smokeBare.ledPasses}/${smokeBare.passes} passes LED`
  + ` · mean lead ${smokeBare.meanLeadMetres} m (max ${smokeBare.maxLeadMetres})`
  + ` · lead/distance ${smokeBare.meanLeadShareOfDistance}`
  + ` · struck ${smokeBare.meanStruckBeyondPricedMetres} m BEYOND the priced aim`
  + ` · sign/magnitude violations ${smokeBare.signViolations}/`
  + `${smokeBare.magnitudeViolations}`);
o(`REPORTED cost (min of ${cost.repeats}, ${cost.ticksPerMatch} ticks/match):`);
for (const a of cost.arms) o(`  ${a.arm.padEnd(10)} ${String(a.minMs).padStart(6)} ms`);
o(`  armed-zero overhead ${cost.armedZeroOverheadPct}% · dosed overhead ${cost.dosedOverheadPct}%`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
