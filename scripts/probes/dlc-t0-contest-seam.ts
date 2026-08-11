/**
 * DLC T0 — THE DORMANT DELIVERY CONTEST: the receipts.
 *
 * Stage doc: docs/world-model/DLC-T0-DORMANT-SEAM.md (frozen BEFORE this ran).
 * Contract:  docs/world-model/DELIVERY-CHOICE-CONTRACT.md §2 M-DLC.1–4 (+ the four #236
 *            amendments). Rulings #235 / #236.
 *
 * Everything is computed IN-PROBE (#181.2). The hashed body is commit-free, timing-free
 * and path-free (#197-M1), so `resultSha256` re-derives at any commit.
 *
 *   G-IDENT     3 league seeds vs the frozen pre-change baselines (the RNG-stream receipt,
 *               and — because the ground chain was HOISTED — the code-motion receipt).
 *   G-FP        the 1337 row IS the production fingerprint.
 *   G-OFF       flag ABSENT ≡ flag FALSE, both world shapes, rng state included.
 *   G-BORN      ARMED + gene ABSENT ≡ OFF (the arming rule returns null on a live path).
 *   G-ZERO      ARMED + gene 0 ≡ OFF, through a path where the led candidate REALLY FORMS.
 *   G-BITE      ARMED + DOSED diverges, both world shapes; the winner table is REPORTED.
 *   G-WINNER    the argmax entry, through the brain: every winner priced at ITS OWN aim,
 *               and BOTH outcomes occur (a real contest, not a disguised forcing).
 *   G-NOTASTE   #236 amendment 1: the two candidate calls differ in the AIM and nothing else.
 *   G-EPI-MOTION the honesty core, re-gated through THIS stage's arming path.
 *   G-CROSS     the FOUR-door matrix (96 cells), incl. the FROZEN ptpPassLead interaction.
 *   G-RNG       zero seam draws; genome.ts untouched (8-generation evolution comparison).
 *   G-HYGIENE   Road B: hard false, absent from a4World, no env door, no new gene.
 *   G-FORK      the read-fork inventory, every src occurrence classed, zero unclassified.
 *   G-TRACE     the banked projection function verbatim + the untouched incumbents.
 *   G-PINS      the pin inventory, machine-checked in the test files AND in src/**.
 *   G-SEED      seed-block disjointness against the COMPLETE ledger (incl. PTP-T1's).
 *   G-DET       the core runs TWICE, byte-identical digests.
 *   REPORTED    (a) the winner-identity table + the emergent led share;
 *               (b) the CHOOSER-COST reading (#236 amendment 4). DESCRIPTIVE ONLY.
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
import { deliveryChoiceSeatOf, ledDelivery } from '../../src/ai/deliveryChoiceSeat';
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

const OUT_PATH = 'docs/world-model/data/dlc-t0-contest-seam.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited VERBATIM and UNTRUNCATED from the PTP-T0 committed artifact). */
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
const BLOCK = 12_426_000;
const N = Number(process.env.DLCT0_N ?? 24);
/** The four-doors matrix runs on the FIRST `CROSS_N` of the SAME seeds (no new block). */
const CROSS_N = Math.min(N, Number(process.env.DLCT0_CROSS_N ?? 4));
const READ_SEED = BLOCK + N; //      12,426,024 — contest/winner/EPI-MOTION/smoke reads
const COST_SEED = BLOCK + N + 1; //  12,426,025 — the REPORTED chooser-cost reading
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
  { name: 'PTP-T0 receipts + geometry/EPI/smoke read (#232)', range: [12_425_000, 12_425_024] },
  { name: 'PTP-T0 REPORTED cost read (#232)', range: [12_425_025, 12_425_025] },
  { name: 'PTP-T1 smoke (#233/#234)', range: [12_425_026, 12_425_037] },
  { name: 'PTP-T1 delivered-dose read (#234)', range: [12_425_040, 12_425_040] },
  { name: 'PTP-T1 exit-semantics guard band (#233)', range: [12_425_050, 12_425_099] },
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
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
 * ⭐ THE GENE VALUE THIS STAGE PRICES WITH. The banked gene's domain is `clamp01`'s own
 * [0,1]; `1` is its UPPER CORNER — "price the whole projected displacement as a
 * candidate". It is NOT a dose here (the dial is retired): it is how far ahead this
 * chooser is willing to IMAGINE, with the candidate free to lose the argmax. `0` is the
 * degenerate value the zero-point identity uses.
 */
const GENE_FULL = 1;
const GENE_ZERO = 0;

type Arm =
  | 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed' | 'zeroArmed' | 'contest'
  | 'plainContest';

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
  const percept = !(arm === 'plain' || arm === 'plainOff' || arm === 'plainContest');
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(percept ? PERCEPT_FLAGS : {}),
    ...(arm === 'off' || arm === 'plainOff' ? { dlcDeliveryChoice: false } : {}),
    ...(arm === 'bornArmed' || arm === 'zeroArmed' || arm === 'contest' || arm === 'plainContest'
      ? { dlcDeliveryChoice: true } : {}),
  });
  if (arm === 'zeroArmed') armGene(m, GENE_ZERO);
  if (arm === 'contest' || arm === 'plainContest') armGene(m, GENE_FULL);
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
 * The #228 lesson in this stage's form. This seam lands beside THREE banked doors, and
 * one of them — `ptpPassLead` — reads THE SAME GENE, which makes the crossing not merely
 * a hygiene matrix but the place where the FROZEN PTP INTERACTION is proved:
 *
 *     {dlc on/off} × {ptp on/off} × {obm on/off} × {ctb on/off}
 *   × {the OBM/CTB gene banks dosed/absent} × {the shared gene absent/zero/dosed}
 *   = 16 × 2 × 3 = 96 cells, each a FULL match on the same receipt seeds, hashed with
 * the whole-run signature (rng state included). Every claim is stated EX ANTE.
 */
type GeneState = 'absent' | 'zero' | 'dosed';
interface CrossCell {
  dlc: boolean; ptp: boolean; obm: boolean; ctb: boolean; others: boolean; gene: GeneState;
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
const cellKey = (c: CrossCell): string => `dlc${c.dlc ? 1 : 0}·ptp${c.ptp ? 1 : 0}`
  + `·obm${c.obm ? 1 : 0}·ctb${c.ctb ? 1 : 0}·others${c.others ? 1 : 0}·gene-${c.gene}`;
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
    dlcDeliveryChoice: c.dlc, ptpPassLead: c.ptp, obmMovement: c.obm, ctbSupportPlane: c.ctb,
  });
  armOthers(m, c.others);
  armGene(m, c.gene === 'absent' ? null : c.gene === 'zero' ? GENE_ZERO : GENE_FULL);
  while (!m.finished) m.step(DT);
  return signature(m);
};
const CROSS_CELLS: readonly CrossCell[] = (() => {
  const cells: CrossCell[] = [];
  for (const dlc of [false, true]) {
    for (const ptp of [false, true]) {
      for (const obm of [false, true]) {
        for (const ctb of [false, true]) {
          for (const others of [false, true]) {
            for (const gene of ['absent', 'zero', 'dosed'] as const) {
              cells.push({ dlc, ptp, obm, ctb, others, gene });
            }
          }
        }
      }
    }
  }
  return cells;
})();
const K = (
  dlc: boolean, ptp: boolean, obm: boolean, ctb: boolean, others: boolean, gene: GeneState,
): string => cellKey({ dlc, ptp, obm, ctb, others, gene });

const CROSS_CLAIMS: readonly {
  name: string; a: string; b: string; equal: boolean; semantics: string;
}[] = [
  // ---- every door shut: no bank anywhere is readable ---------------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `DORMANT-ALL · gene ${gene} · others dosed`,
    a: K(false, false, false, false, true, gene), b: K(false, false, false, false, false, 'absent'),
    equal: true,
    semantics: 'all four flags OFF: no gene bank of any of the four seams can be read, so every '
      + 'gene state collapses onto the incumbent world.',
  })),
  // ---- ⭐ DOOR A: arming dlc alone expresses NO other seam's genes --------------
  {
    name: '⭐ A-DLC-ALONE-INERT · others DOSED · gene ABSENT',
    a: K(true, false, false, false, true, 'absent'), b: K(false, false, false, false, false, 'absent'),
    equal: true,
    semantics: '⭐ THE TWO-DOORS GATE (#228) in this seam\'s form: dlcDeliveryChoice ARMED with '
      + 'the banked obm matrix and ctbSupport* genes FULLY DOSED and its own gene ABSENT — '
      + 'byte-identical to ALL-OFF. Arming this door can never spend a bank it was not given the '
      + 'key to. (Gene ZERO is claimed separately below, because there the candidate really '
      + 'FORMS and the identity is the argmax tie rule\'s, not the arming rule\'s.)',
  },
  {
    name: '⭐ A-DLC-ZERO-INERT · others DOSED · gene ZERO',
    a: K(true, false, false, false, true, 'zero'), b: K(false, false, false, false, false, 'absent'),
    equal: true,
    semantics: '⭐ THE ZERO-POINT, crossed: the contest ARMED and FORMING candidates at gene 0, '
      + 'with both neighbour banks fully dosed — still byte-identical to ALL-OFF. The led '
      + 'candidate degenerates onto the feet candidate and loses the tie (§LAW).',
  },
  {
    name: '⭐ A-OTHER-GENES-INVISIBLE · dlc fully live, the other doors shut',
    a: K(true, false, false, false, true, 'dosed'), b: K(true, false, false, false, false, 'dosed'),
    equal: true,
    semantics: '⭐ THE CLEANEST FORM: the contest FULLY ARMED and biting hard — and the banked '
      + 'obm/ctb gene banks make NO difference to it whatsoever, because their own flags are shut.',
  },
  // ---- ⭐ DOOR B: the neighbours are unmoved by THIS door ----------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-OBM-UNTOUCHED-BY-DLC · obm armed alone · gene ${gene}`,
    a: K(false, false, true, false, true, gene), b: K(false, false, true, false, true, 'absent'),
    equal: true,
    semantics: '⭐ the converse door: with dlcDeliveryChoice SHUT, the shared gene is unreadable '
      + 'at any value — the banked OBM seat delivers exactly what it delivered before this stage '
      + 'existed.',
  })),
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐ B-CTB-UNTOUCHED-BY-DLC · ctb armed alone · gene ${gene}`,
    a: K(false, false, false, true, true, gene), b: K(false, false, false, true, true, 'absent'),
    equal: true,
    semantics: '⭐ the same converse for the banked CTB static plane.',
  })),
  // ---- ⭐⭐ THE FROZEN PTP INTERACTION ----------------------------------------
  ...(['absent', 'zero', 'dosed'] as const).map((gene) => ({
    name: `⭐⭐ PTP-KEEPS-PRECEDENCE · ptp1·dlc1 ≡ ptp1·dlc0 · gene ${gene}`,
    a: K(true, true, false, false, false, gene), b: K(false, true, false, false, false, gene),
    equal: true,
    semantics: '⭐⭐ THE FROZEN INTERACTION (§LAW), GATED RATHER THAN PROMISED. With BOTH doors '
      + 'armed the two candidates coincide by ARITHMETIC — the same gene, the same motion source '
      + 'and the same flight give the same aim — and the argmax\'s strict `>` keeps the candidate '
      + 'compared FIRST, which is the banked PTP forced aim. So armed-both IS ptpPassLead armed '
      + 'alone, byte for byte, at every gene state. (The doors stay INDEPENDENT: no exam design '
      + 'arms both, and DLC-T1\'s contrast anchor re-walks the PTP arm under ptpPassLead alone.)',
  })),
  {
    name: '⭐⭐ CONTEST-IS-NOT-THE-FORCED-DOSE · dlc-alone-dosed vs ptp-alone-dosed',
    a: K(true, false, false, false, false, 'dosed'), b: K(false, true, false, false, false, 'dosed'),
    equal: false,
    semantics: '⭐⭐ THE FALSIFIER THAT MAKES DLC-T1\'s CONTRAST ANCHOR MEANINGFUL: a world where '
      + 'the led ball must WIN a contest is NOT the world where every support pass is forced onto '
      + 'the led aim. If these two were byte-identical, "the contest" would be the dial wearing a '
      + 'new name — which is exactly the #234 poison the contract exists to dissolve.',
  },
  {
    name: '⭐ C-SEAMS-DISTINGUISHABLE · dlc-alone-dosed vs obm-alone-dosed',
    a: K(true, false, false, false, true, 'dosed'), b: K(false, false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐ arming and dosing THIS seam must not reproduce the banked OBM seat armed on its '
      + 'own bank. If these were identical, one door would be spending the other\'s bank — the '
      + 'exact defect #228 caught.',
  },
  {
    name: '⭐ C-SEAMS-DISTINGUISHABLE · dlc-alone-dosed vs ctb-alone-dosed',
    a: K(true, false, false, false, true, 'dosed'), b: K(false, false, false, true, true, 'absent'),
    equal: false,
    semantics: '⭐ the same falsifier against the banked CTB static plane.',
  },
  {
    name: '⭐ C-DLC-INERT-IS-NOT-THE-NEIGHBOURS · dlc armed inert vs obm-alone',
    a: K(true, false, false, false, true, 'zero'), b: K(false, false, true, false, true, 'absent'),
    equal: false,
    semantics: '⭐ the identity that WOULD hold if this door leaked: an inert contest sitting on a '
      + 'full neighbour bank must be the INCUMBENT world, hence DIFFERENT from the neighbour armed '
      + 'on that bank.',
  },
  // ---- non-vacuity: this seam bites where it should ---------------------------
  ...[true, false].map((others) => ({
    name: `BITE · dlc armed + dosed, other doors shut, others ${others ? 'dosed' : 'absent'}`,
    a: K(true, false, false, false, others, 'dosed'), b: K(false, false, false, false, false, 'absent'),
    equal: false,
    semantics: 'the contest is not inert everywhere: armed and dosed it moves the world — '
      + 'otherwise every identity above would be vacuous.',
  })),
  {
    name: 'ALL-FOUR-ARMED-AND-DOSED bites',
    a: K(true, false, true, true, true, 'dosed'), b: K(false, false, true, true, true, 'absent'),
    equal: false,
    semantics: 'with the contest open beside both banked movement seams and every bank dosed, '
      + 'adding THIS door\'s contest moves the world away from the other two armed alone. (What '
      + 'the combination BUYS is DLC-T1\'s exam, not adjudicated here.)',
  },
];

/* ---- G-ZERO's non-vacuity half + the contest's own geometry ------------------- */
/**
 * Observation, never intervention: on ONE armed match, sample every 15 playing ticks and
 * for the carrier and each of his mates FORM the two candidates exactly as the brain
 * does — at the DOSED gene and at the ZERO gene, on a COPY of the genome — checking the
 * frozen law directly against an INDEPENDENT re-derivation.
 *
 * ⚠ WHAT THESE COUNTERS ARE, EXACTLY (stated so nothing over-reads them): they are
 * PROBE-SIDE SEAT CONSTRUCTIONS. The probe builds the seat and calls `ledDelivery` itself,
 * off a COPY of the genome, on a sampled live match state — it is NOT a count of candidates
 * the BRAIN formed on that match. That the brain forms and scores them is established by
 * code reading (§SEAM's read-fork inventory, machine-checked by G-FORK/G-NOTASTE) and, in
 * simulation, by G-BITE's own divergence receipt (an armed+dosed world differs from OFF on
 * every seed, to 1e-15, which cannot happen unless the second candidate really enters the
 * argmax) and by G-WINNER end-to-end through the brain.
 *
 * ⚠ THE ARM CONFOUND, LABELLED RATHER THAN HIDDEN: the two world shapes are sampled on
 * DIFFERENT arms — percept on `bornArmed` (a gene-ABSENT match) and bare on `plainContest`
 * (a gene-DOSED match). The re-derivations themselves are arm-independent (dosed/zeroed
 * genome COPIES), but the SAMPLED MATCH STATES are not, so the percept column and the bare
 * column are NOT a clean world-shape contrast. `measuredOnArm` records which arm each was
 * read on. (Re-measuring both on the same arm would move HARD-gate numbers this round is
 * forbidden to move; it is a candidate for a later stage.)
 */
const contestGeometry = (seed: number, percept: boolean): {
  measuredOnArm: Arm;
  samples: number; supportSamples: number; movedSamples: number; stillSamples: number;
  meanLeadMetres: number; maxLeadMetres: number; meanFlightSeconds: number;
  meanMotionSpeed: number;
  zeroCandidatesFormed: number; zeroCandidatesDegenerate: number;
  absentSeatsFormed: number;
  violations: {
    arithmetic: number; direction: number; nonSupportNonZero: number;
    stillNonZero: number; zeroGeneNonZero: number; aimComposition: number;
  };
  pass: boolean;
} => {
  const arm: Arm = percept ? 'bornArmed' : 'plainContest';
  const m = matchOf(seed, arm);
  let samples = 0;
  let support = 0;
  let moved = 0;
  let still = 0;
  let leadSum = 0;
  let leadMax = 0;
  let flightSum = 0;
  let speedSum = 0;
  let zeroFormed = 0;
  let zeroDegenerate = 0;
  let absentSeats = 0;
  const v = {
    arithmetic: 0, direction: 0, nonSupportNonZero: 0, stillNonZero: 0, zeroGeneNonZero: 0,
    aimComposition: 0,
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
    const zeroed: TacticalGenome = { ...t.genome, passLeadSupport: GENE_ZERO };
    const absentGenome: TacticalGenome = { ...t.genome };
    delete absentGenome.passLeadSupport;
    // ⭐ THE ARMING RULE: an ABSENT gene gives NO seat, so no candidate can form at all
    if (deliveryChoiceSeatOf(carrier, m, absentGenome, percept) !== null) absentSeats += 1;
    const seat = deliveryChoiceSeatOf(carrier, m, dosed, percept);
    const zeroSeat = deliveryChoiceSeatOf(carrier, m, zeroed, percept);
    if (seat === null || zeroSeat === null) continue;
    for (const mate of t.players) {
      if (mate === carrier || mate.sentOff) continue;
      const led = ledDelivery(seat, carrier.pos, mate);
      const zeroLed = ledDelivery(zeroSeat, carrier.pos, mate);
      samples += 1;
      zeroFormed += 1;
      if (zeroLed.lead.x !== 0 || zeroLed.lead.y !== 0) v.zeroGeneNonZero += 1;
      // the ZERO candidate's aim IS the feet candidate's point — the tie the argmax keeps
      if (zeroLed.aim.x === mate.pos.x && zeroLed.aim.y === mate.pos.y) zeroDegenerate += 1;
      // the AIM COMPOSITION is `mate.pos + lead`, checked rather than trusted
      if (led.aim.x !== mate.pos.x + led.lead.x || led.aim.y !== mate.pos.y + led.lead.y) {
        v.aimComposition += 1;
      }
      if (mate.action.type !== 'SupportBallCarrier') {
        if (led.lead.x !== 0 || led.lead.y !== 0) v.nonSupportNonZero += 1;
        continue;
      }
      support += 1;
      // the INDEPENDENT re-derivation of the BANKED law, from the world's own motion source
      const motion = passLeadMotion(seat, mate);
      const flight = dist(carrier.pos, mate.pos) / PTP_FLIGHT_SPEED;
      const wantX = GENE_FULL * (motion.x * flight * PTP_LEAD_FLIGHT_MUL);
      const wantY = GENE_FULL * (motion.y * flight * PTP_LEAD_FLIGHT_MUL);
      if (led.lead.x !== wantX || led.lead.y !== wantY) v.arithmetic += 1;
      const speed = Math.hypot(motion.x, motion.y);
      const mag = Math.hypot(led.lead.x, led.lead.y);
      if (speed > 1e-9 && (led.lead.x * motion.x + led.lead.y * motion.y) <= 0) v.direction += 1;
      if (Math.abs(mag - GENE_FULL * speed * flight * PTP_LEAD_FLIGHT_MUL) > 1e-9) {
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
    measuredOnArm: arm,
    samples,
    supportSamples: support,
    movedSamples: moved,
    stillSamples: still,
    meanLeadMetres: round(leadSum / n),
    maxLeadMetres: round(leadMax),
    meanFlightSeconds: round(flightSum / n),
    meanMotionSpeed: round(speedSum / n),
    zeroCandidatesFormed: zeroFormed,
    zeroCandidatesDegenerate: zeroDegenerate,
    absentSeatsFormed: absentSeats,
    violations: v,
    pass: support > 0 && moved > 0 && zeroFormed > 0 && zeroDegenerate === zeroFormed
      && absentSeats === 0 && Object.values(v).every((c) => c === 0),
  };
};

/* ---- ⭐ G-WINNER: the ARGMAX ENTRY, proved end to end through the brain ------- */
/**
 * The G-LOFT-BODY idiom (#191: a claim becomes a gate) applied to the CONTEST itself. On
 * an ARMED + DOSED match the carrier is asked to decide, and the winning `Pass`
 * candidate's OWN reported openness (2 dp, in its `why` string) is compared against BOTH
 * re-derivations: `opennessAt(mate.pos)` (the to-feet candidate) and
 * `opennessAt(mate.pos + lead)` (the led candidate), the aim rebuilt independently.
 *
 * EVERY winner must be priced at ITS OWN aim. Where the two readings diverge MATERIALLY
 * (> 0.05, well beyond the 2 dp print) the winner is UNAMBIGUOUSLY identified, and BOTH
 * outcomes must occur across the sampled decisions — a contest in which the led ball
 * always won would be the retired dial, and one in which it never won would be a seam
 * with no reachable second candidate.
 *
 * ⚠ DECLARED INTERVENTION. This is an INSTRUMENT match (`decidePlayer` is called on the
 * carrier, which both re-decides and may execute); its trajectory is its own and is
 * compared to NO signature anywhere.
 */
const winnerPricing = (seed: number, percept: boolean): {
  decisions: number; passCandidates: number; ambiguousNames: number;
  materialSamples: number; ledWins: number; feetWins: number; violations: number;
  maxOpenDelta: number; meanOpenDelta: number; pass: boolean;
} => {
  const m = matchOf(seed, percept ? 'contest' : 'plainContest');
  const WHY = /^to (.+) · lane (\d+\.\d\d) · open (\d+\.\d\d) · passBias/;
  let decisions = 0;
  let cands = 0;
  let ambiguous = 0;
  let material = 0;
  let ledWins = 0;
  let feetWins = 0;
  let violations = 0;
  let maxDelta = 0;
  let deltaSum = 0;
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
    const seat = deliveryChoiceSeatOf(
      carrier, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
    );
    if (seat === null) { violations += 1; continue; }
    const led = ledDelivery(seat, carrier.pos, mate);
    const feetOpen = opennessAt(mate.pos, opp.players);
    const ledOpen = opennessAt(led.aim, opp.players);
    const delta = Math.abs(ledOpen - feetOpen);
    deltaSum += delta;
    maxDelta = Math.max(maxDelta, delta);
    const at2 = (x: number): number => Math.round(x * 100) / 100;
    const matchesFeet = Math.abs(reported - at2(feetOpen)) < 1e-9;
    const matchesLed = Math.abs(reported - at2(ledOpen)) < 1e-9;
    if (!matchesFeet && !matchesLed) { violations += 1; continue; }
    if (delta > 0.05) {
      material += 1;
      if (matchesLed && !matchesFeet) ledWins += 1;
      else if (matchesFeet && !matchesLed) feetWins += 1;
    }
  }
  return {
    decisions,
    passCandidates: cands,
    ambiguousNames: ambiguous,
    materialSamples: material,
    ledWins,
    feetWins,
    violations,
    maxOpenDelta: round(maxDelta),
    meanOpenDelta: round(deltaSum / Math.max(cands, 1)),
    // per-shape: every winner is priced at ITS OWN aim. The NON-VACUITY half (materially
    // divergent decisions, and BOTH outcomes occurring) is pooled across the two world
    // shapes at the call site, exactly as the frozen gate row words it.
    pass: cands > 0 && violations === 0,
  };
};

/* ---- ⭐ G-NOTASTE: #236 amendment 1, machine-checked --------------------------- */
const FEET_CALL = 'const feet = groundCandidate(mate, aim, d);';
const LED_CALL = 'const ledCand = groundCandidate(mate, ledBall.aim, d);';
const noTasteGate = (): {
  feetCall: boolean; ledCall: boolean; oneDeclaration: boolean;
  ledBranchTokens: string[]; seatModuleTokens: string[]; pass: boolean;
} => {
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const seatSrc = readFileSync('src/ai/deliveryChoiceSeat.ts', 'utf8');
  const decls = (brain.match(/const groundCandidate = \(/g) ?? []).length;
  // the LED branch's executable body: from its `if (dlcSeat !== null) {` to its close
  const from = brain.indexOf('      if (dlcSeat !== null) {');
  const to = brain.indexOf('      // Lofted switch:', from);
  const branch = from >= 0 && to > from ? brain.slice(from, to) : '';
  const code = (s: string): string => s.split('\n').filter((l) => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');
  // ⭐ NO TASTE TERM: the led candidate's score is the SHARED function's output, so the
  // branch may name no gene, no attribute and no multiplier of its own.
  const BANNED = [
    'riskTolerance', 'passBias', 'attackingWidth', 'tempo', 'shootBias', 'attrs.',
    'traits', '* 1.', '*= ', 'Math.max', 'Math.min',
  ];
  const branchCode = code(branch);
  const ledBranchTokens = BANNED.filter((b) => branchCode.includes(b));
  const seatTokens = BANNED.filter((b) => code(seatSrc).includes(b));
  return {
    feetCall: brain.includes(FEET_CALL),
    ledCall: brain.includes(LED_CALL),
    oneDeclaration: decls === 1,
    ledBranchTokens,
    seatModuleTokens: seatTokens,
    pass: brain.includes(FEET_CALL) && brain.includes(LED_CALL) && decls === 1
      && from >= 0 && to > from
      && ledBranchTokens.length === 0 && seatTokens.length === 0,
  };
};

/* ---- ⭐ G-EPI-MOTION: the motion channel is HONEST, per world shape ---------- */
/**
 * The PTP-T0 fixture, RE-RUN THROUGH THIS STAGE'S ARMING PATH (#236 amendment 2:
 * "inherited" never exempts a gate). A match is stepped, every eligible led candidate is
 * recorded, then EVERY BODY'S TRUTH VELOCITY IS REWRITTEN IN PLACE WITHOUT STEPPING — so
 * no scan moment is recorded, the remembered velocities still hold the old world, and
 * POSITIONS are untouched so `flight` is identical and ONLY the motion source can move a
 * candidate.
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
    const m = matchOf(seed, percept ? 'contest' : 'plainContest');
    for (let i = 0; i < 600; i++) m.step(DT);
    const pairs: {
      carrier: Player; mate: Player; before: { x: number; y: number }; age: number;
    }[] = [];
    for (let guard = 0; guard < 4000 && pairs.length < 3 && !m.finished; guard++) {
      m.step(DT);
      pairs.length = 0;
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const carrier of t.players) {
          if (carrier.sentOff || carrier.role === 'GK') continue;
          const seat = deliveryChoiceSeatOf(
            carrier, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
          );
          if (seat === null) continue;
          for (const mate of t.players) {
            if (mate === carrier || mate.sentOff) continue;
            if (mate.action.type !== 'SupportBallCarrier') continue;
            const led = ledDelivery(seat, carrier.pos, mate);
            if (led.lead.x === 0 && led.lead.y === 0) continue;
            const seen = seat.snapshot?.players.find((o) => o.gid === mate.gid) ?? null;
            pairs.push({
              carrier, mate, before: { x: led.lead.x, y: led.lead.y }, age: seen?.ageTicks ?? 0,
            });
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
      const seat = deliveryChoiceSeatOf(
        pair.carrier, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
      )!;
      const now = ledDelivery(seat, pair.carrier.pos, pair.mate).lead;
      const flight = dist(pair.carrier.pos, pair.mate.pos) / PTP_FLIGHT_SPEED;
      const truthNow = {
        x: 7.5 * flight * PTP_LEAD_FLIGHT_MUL, y: -6.25 * flight * PTP_LEAD_FLIGHT_MUL,
      };
      if (percept) {
        if (now.x === pair.before.x && now.y === pair.before.y) matchesOwn += 1;
        if (now.x === truthNow.x && now.y === truthNow.y) matchesOther += 1;
        if (pair.before.x !== truthNow.x || pair.before.y !== truthNow.y) diverged += 1;
      } else {
        if (now.x === truthNow.x && now.y === truthNow.y) matchesOwn += 1;
        if (now.x === pair.before.x && now.y === pair.before.y) matchesOther += 1;
        if (pair.before.x !== truthNow.x || pair.before.y !== truthNow.y) diverged += 1;
      }
      ageSum += pair.age;
    }
    return { bodies: pairs.length, matchesOwn, matchesOther, diverged, ageSum };
  };
  const percept = run(true);
  const bare = run(false);
  // the SOURCE-LEVEL pin: BOTH seat modules read nothing on `match` but the snapshot
  const strip = (src: string): string => src.split('\n').filter((l) => {
    const t = l.trim();
    return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
  }).join('\n');
  const code = `${strip(readFileSync('src/ai/passLeadSeat.ts', 'utf8'))}\n`
    + `${strip(readFileSync('src/ai/deliveryChoiceSeat.ts', 'utf8'))}`;
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

/* ---- G-RNG (a): an armed, dosed contest draws zero rng ----------------------- */
const seamRng = (seed: number): { before: number; after: number; pass: boolean; calls: number } => {
  const m = matchOf(seed, 'contest');
  for (let i = 0; i < 400; i++) m.step(DT);
  const before = (m.rng as unknown as { s: number }).s;
  let calls = 0;
  for (const t of m.teams) {
    for (const p of t.players) {
      if (p.sentOff || p.role === 'GK') continue;
      const seat = deliveryChoiceSeatOf(
        p, m, { ...t.genome, passLeadSupport: GENE_FULL }, true,
      );
      if (seat === null) continue;
      for (const mate of t.players) {
        if (mate === p || mate.sentOff) continue;
        ledDelivery(seat, p.pos, mate);
        calls += 1;
      }
    }
  }
  const after = (m.rng as unknown as { s: number }).s;
  return { before, after, pass: before === after && calls > 0, calls };
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
  'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const forkTable = (): {
  sites: { file: string; line: number; kind: string; text: string }[];
  flagForks: number; candScoreSites: number; ledFormSites: number; ledCaptureSites: number;
  newStrikeStatements: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  const TOKENS = /dlcDeliveryChoice|dlcSeat|deliveryChoiceSeat|ledDelivery|ledBall|ledCand|groundCandidate/;
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      const t = text.trim();
      if (!TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === FORK_LINE ? 'FLAG_FORK'
        : t === FEET_CALL || t === LED_CALL ? 'CAND_SCORE'
          : /^const ledBall = ledDelivery\(dlcSeat, p\.pos, mate\);$/.test(t) ? 'LED_FORM'
            : /^const groundCandidate = \(/.test(t) ? 'CAND_DECL'
              : /^bestLead[XY] = ledBall\.lead\.[xy];$/.test(t) ? 'LED_CAPTURE'
                : /^if \(dlcSeat !== null\) \{$/.test(t) ? 'LED_GUARD'
                  : /^if \(ledCand\.s > bestPass\) \{$/.test(t) ? 'LED_ARGMAX'
                    : /^(bestPass|bestMate|bestLane|bestOpen) = (ledCand|mate)/.test(t)
                      ? 'LED_ARGMAX'
                      : /^readonly dlcDeliveryChoice: boolean;$/.test(t) ? 'FIELD'
                        : /^dlcDeliveryChoice\?: boolean;$/.test(t) ? 'CONFIG'
                          : /this\.dlcDeliveryChoice = cfg\.dlcDeliveryChoice \?\? false;/.test(t)
                            ? 'INIT'
                            : /'dlcDeliveryChoice'/.test(t) ? 'UNION_KEY'
                              : /^import |^\} from |from '\.\/deliveryChoiceSeat'/.test(t) ? 'IMPORT'
                                : /^export function (deliveryChoiceSeatOf|ledDelivery)\($/.test(t)
                                  ? 'SEAT_DECL'
                                  : f.endsWith('deliveryChoiceSeat.ts') ? 'SEAT_BODY'
                                    : f.endsWith('PlayerBrain.ts') && /groundCandidate/.test(t)
                                      ? 'CAND_DECL'
                                      : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  const flagForks = sites.filter((s) => s.kind === 'FLAG_FORK');
  const candScore = sites.filter((s) => s.kind === 'CAND_SCORE');
  const ledForm = sites.filter((s) => s.kind === 'LED_FORM');
  const ledCapture = sites.filter((s) => s.kind === 'LED_CAPTURE');
  // ⭐ ZERO new strike statements: the banked PTP-T0 led strike is reused verbatim
  const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
  const strikes = (brain.match(/match\.performPass\(/g) ?? []).length;
  return {
    sites,
    flagForks: flagForks.length,
    candScoreSites: candScore.length,
    ledFormSites: ledForm.length,
    ledCaptureSites: ledCapture.length,
    newStrikeStatements: strikes,
    pass: flagForks.length === 1 && flagForks[0].file.endsWith('src/ai/PlayerBrain.ts')
      && candScore.length === 2 && candScore.every((s) => s.file.endsWith('PlayerBrain.ts'))
      && ledForm.length === 1 && ledCapture.length === 2
      && sites.filter((s) => s.kind === 'CAND_DECL').length === 1
      && sites.filter((s) => s.kind === 'OTHER').length === 0
      // the THREE `match.performPass(` statements this file has always had: the kickoff
      // back-pass, the incumbent synchronous strike and the BANKED PTP-T0 led strike.
      // This stage adds NONE — the contest's winner rides the banked statement.
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
    what: '⭐⭐ the BANKED PROJECTION BODY, verbatim (the law this stage reuses, untouched)',
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
    file: 'src/ai/PlayerBrain.ts', what: '⭐ M-DLC.4: the MakeRun through-ball guard, UNTOUCHED',
    line: "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
  },
  {
    file: 'src/ai/PlayerBrain.ts', what: '⭐ M-DLC.4: the through-ball burst call, UNTOUCHED',
    line: 'const burst = runBurstPoint(mate, team, opp.players, flight);',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐⭐ SLICE TWO\'s zero-point, UNTOUCHED: the lofted switch\'s own d > 24 hand gate',
    line: 'if (d > 24 && !layingOff) {',
  },
  {
    file: 'src/sim/mechanics.ts',
    what: '⭐⭐ SLICE THREE\'s zero-point, UNTOUCHED: the AUTOMATIC ground bender',
    line: 'bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);',
  },
  {
    file: 'src/sim/mechanics.ts', what: 'the incumbent strike-time lead, UNTOUCHED in arithmetic',
    line: 'const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐ the BANKED led-strike statement, reused VERBATIM (zero new strike statements)',
    line: 'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));',
  },
  {
    file: 'src/ai/PlayerBrain.ts',
    what: '⭐⭐ the PTP fork line, VERBATIM — the pin that shaped the PTP INTERACTION',
    line: 'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;',
  },
];
const traceGate = (): {
  pass: boolean; lines: { file: string; line: string; what: string; found: boolean }[];
  flightSpeed: number; leadMul: number; projectionFileSha256: string;
} => {
  const lines = TRACE_LINES.map((t) => ({
    ...t, found: readFileSync(t.file, 'utf8').includes(t.line),
  }));
  return {
    pass: lines.every((l) => l.found) && PTP_FLIGHT_SPEED === 18 && PTP_LEAD_FLIGHT_MUL === 1.6,
    lines,
    flightSpeed: PTP_FLIGHT_SPEED,
    leadMul: PTP_LEAD_FLIGHT_MUL,
    // the banked projection module's own content hash, so a later stage cannot edit it
    // quietly and still cite PTP-T0's law receipts
    projectionFileSha256: sha(readFileSync('src/ai/passLeadSeat.ts', 'utf8')),
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const SEAM_FILES = [
  'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/deliveryChoiceSeat.ts',
  'src/ai/PlayerBrain.ts',
];
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
  return {
    defaultFalse: matchSrc.includes('this.dlcDeliveryChoice = cfg.dlcDeliveryChoice ?? false;'),
    absentFromA4World: !a4.includes('dlcDeliveryChoice') && !a4.includes('passLeadSupport'),
    noNewGene: !(GENE_KEYS as readonly string[]).includes('passLeadSupport')
      && !readFileSync('src/evolution/genome.ts', 'utf8').includes('dlc'),
    noEnvDoor: SEAM_FILES.every((f) => readFileSync(f, 'utf8').split('\n')
      .filter((l) => /dlcDeliveryChoice|deliveryChoiceSeat|ledDelivery/.test(l))
      .every((l) => !/envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))),
    freshMatchOff: matchOf(1, 'absent').dlcDeliveryChoice === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260811 });
      return l.createMatch(l.nextFixture()!).dlcDeliveryChoice === false;
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
      pin: '⭐⭐ THE PIN THAT SHAPED THE PTP INTERACTION: PTP-T0\'s G-FORK asserts the '
        + 'ptpPassLead fork line as EXACT TEXT, so the recommended `!dlcDeliveryChoice` guard '
        + 'was never available — precedence went to the banked seam instead (§LAW)',
      file: 'tests/ptpPassLead.test.ts',
      needle: "'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;',",
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

/* ---- REPORTED (a): the FORCED SMOKE — the WINNER-IDENTITY table -------------- */
/**
 * ONE armed+dosed match per world shape with `performPass` WRAPPED on the instance: every
 * chosen pass records WHICH CANDIDATE WON — a non-null 5th argument is the LED candidate
 * (the winner's own priced displacement, carried into the strike), a null one is TO FEET.
 * The original is always called, so the trajectory is the armed arm's own; this reading
 * is never compared to a signature.
 *
 * The LED SHARE this yields is THE EMERGENT DOSE — the number the retired dial used to
 * fix at 1. It is descriptive: one match, one gene value, no control, no CI.
 */
const winnerSmoke = (seed: number, percept: boolean): {
  passes: number; ledWins: number; feetWins: number; supportTargets: number;
  ledShare: number; meanLeadMetres: number; maxLeadMetres: number;
  meanLeadShareOfDistance: number; signViolations: number; magnitudeViolations: number;
} => {
  const m = matchOf(seed, percept ? 'contest' : 'plainContest');
  const orig = m.performPass.bind(m);
  let passes = 0;
  let led = 0;
  let supportTargets = 0;
  let leadSum = 0;
  let leadMax = 0;
  let shareSum = 0;
  let signBad = 0;
  let magBad = 0;
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    passes += 1;
    if (mate.action.type === 'SupportBallCarrier') supportTargets += 1;
    if (ptpLead !== null) {
      led += 1;
      const t = m.teams[p.side];
      const seat = deliveryChoiceSeatOf(
        p, m, { ...t.genome, passLeadSupport: GENE_FULL }, percept,
      );
      if (seat !== null) {
        const motion = passLeadMotion(seat, mate);
        const flight = dist(p.pos, mate.pos) / PTP_FLIGHT_SPEED;
        const mag = Math.hypot(ptpLead.x, ptpLead.y);
        const want = GENE_FULL * Math.hypot(motion.x, motion.y) * flight * PTP_LEAD_FLIGHT_MUL;
        if (Math.abs(mag - want) > 1e-9) magBad += 1;
        if (mag > 1e-9 && (ptpLead.x * motion.x + ptpLead.y * motion.y) <= 0) signBad += 1;
        leadSum += mag;
        leadMax = Math.max(leadMax, mag);
        const d = dist(p.pos, mate.pos);
        shareSum += d > 0 ? mag / d : 0;
      }
    }
    orig(p, mate, offsideExempt, powerChoice, ptpLead);
  };
  while (!m.finished) m.step(DT);
  const n = Math.max(led, 1);
  return {
    passes,
    ledWins: led,
    feetWins: passes - led,
    supportTargets,
    ledShare: round(led / Math.max(passes, 1)),
    meanLeadMetres: round(leadSum / n),
    maxLeadMetres: round(leadMax),
    meanLeadShareOfDistance: round(shareSum / n),
    signViolations: signBad,
    magnitudeViolations: magBad,
  };
};

/* ---- REPORTED (b): the CHOOSER-COST reading (#236 amendment 4) --------------- */
/**
 * ⚠ THE READING IS NOT LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL, and the instrument says so
 * rather than hiding it. The armed+dosed arm is a DIVERGED WORLD: it plays a different
 * match and therefore simulates a DIFFERENT NUMBER OF TICKS from the off / born-armed arms
 * (which are byte-identical worlds to each other). Comparing total wall across arms would
 * therefore price a shorter match against a longer one.
 *
 * ⇒ PER-ARM TICK COUNTS ARE PUBLISHED, the HEADLINE is ms/TICK, and total wall is kept only
 *   as CONTEXT. The NOISE FLOOR is stated from the instrument's own control pair: `off` and
 *   `bornArmed` execute the SAME arithmetic (the seat is null, no second candidate forms),
 *   so their per-tick spread is pure measurement scatter, and any per-tick effect no larger
 *   than it is UNRESOLVED by this instrument.
 */
const COST_REPEATS = 3;
const costReading = (seed: number): {
  repeats: number;
  arms: { arm: string; ticks: number; ticksStableAcrossRepeats: boolean;
    minMs: number; msPerTick: number;
    perTickVsOffPct: number | null; totalWallVsOffPctContextOnly: number | null }[];
  tickCountsEqualAcrossArms: boolean;
  headlinePerTick: { bornArmedVsOffPct: number; contestVsOffPct: number };
  contextTotalWall: { bornArmedVsOffPct: number; contestVsOffPct: number };
  noiseFloorPerTickPct: number;
  contestResolvedAboveNoiseFloor: boolean;
} => {
  const timeOne = (arm: Arm): { ms: number; ticks: number } => {
    const m = matchOf(seed, arm);
    let ticks = 0;
    const t0 = Date.now();
    while (!m.finished) { m.step(DT); ticks += 1; }
    return { ms: Date.now() - t0, ticks };
  };
  const arms: Arm[] = ['off', 'bornArmed', 'contest'];
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
  const contestPerTick = pct(raw[2].msPerTick, offPerTick);
  const noiseFloor = round(Math.abs(bornPerTick), 2);
  return {
    repeats: COST_REPEATS,
    arms: rows,
    tickCountsEqualAcrossArms: raw.every((r) => r.ticks === raw[0].ticks),
    headlinePerTick: { bornArmedVsOffPct: bornPerTick, contestVsOffPct: contestPerTick },
    contextTotalWall: {
      bornArmedVsOffPct: pct(raw[1].minMs, offMs),
      contestVsOffPct: pct(raw[2].minMs, offMs),
    },
    noiseFloorPerTickPct: noiseFloor,
    contestResolvedAboveNoiseFloor: Math.abs(contestPerTick) > noiseFloor,
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; zeroArmed: string; contest: string; plainContest: string;
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
    const contest = walk(seed, 'contest');
    const plainContest = walk(seed, 'plainContest');
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, zeroArmed: zero, contest, plainContest,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      zeroIdentical: zero === absent,
      diverged: contest !== absent,
      bareDiverged: plainContest !== plain,
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

process.stderr.write(`=== DLC T0 CONTEST RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [dlc-t0] run A digest ${digestA}\n  [dlc-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [dlc-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ---------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [dlc-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [dlc-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const geometryPercept = contestGeometry(READ_SEED, true);
const geometryBare = contestGeometry(READ_SEED, false);
const epi = epiMotionFixture(READ_SEED);
const winnerPercept = winnerPricing(READ_SEED, true);
const winnerBare = winnerPricing(READ_SEED, false);
// ⭐ non-vacuity of the CONTEST is pooled across the two world shapes and stated as such
const contestBothWays = (winnerPercept.ledWins + winnerBare.ledWins) > 0
  && (winnerPercept.feetWins + winnerBare.feetWins) > 0;
const contestMaterial = (winnerPercept.materialSamples + winnerBare.materialSamples) > 0;
const gWinner = winnerPercept.pass && winnerBare.pass && contestBothWays && contestMaterial;
const smokePercept = winnerSmoke(READ_SEED, true);
const smokeBare = winnerSmoke(READ_SEED, false);
const seamDraws = seamRng(READ_SEED);
const evo = evoRng();
const fork = forkTable();
const trace = traceGate();
const noTaste = noTasteGate();
const hyg = hygiene();
const pins = pinTable();
process.stderr.write('  [dlc-t0] REPORTED chooser-cost reading...\n');
const cost = costReading(COST_SEED);
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const intervals = [
    { name: 'DLC-T0 receipts + contest/winner/EPI-MOTION/smoke read', first: BLOCK, last: READ_SEED },
    { name: 'DLC-T0 REPORTED chooser-cost reading', first: COST_SEED, last: COST_SEED },
    { name: 'DLC-T0 test-file seeds (tests/dlcDeliveryChoice.test.ts)', first: 12_426_900, last: 12_426_906 },
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
      + 'consumed ledger, which now includes PTP-T0\'s blocks (12,425,000–025 · 900–906) and '
      + 'PTP-T1\'s four (smoke 026–037 · dose-read 040 · guard 050–099 · battery+reserve '
      + '100–727).',
  };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gZero = runA.rows.every((r) => r.zeroIdentical)
  && geometryPercept.zeroCandidatesFormed > 0 && geometryBare.zeroCandidatesFormed > 0;
const gBite = runA.rows.every((r) => r.diverged && r.bareDiverged)
  && geometryPercept.pass && geometryBare.pass
  && smokePercept.signViolations === 0 && smokePercept.magnitudeViolations === 0
  && smokeBare.ledWins > 0 && smokeBare.signViolations === 0
  && smokeBare.magnitudeViolations === 0;
const gCross = runA.crossing.claims.every((c) => c.pass);
const gRng = seamDraws.pass && evo.genomesIdentical && evo.rngStateIdentical
  && evo.geneStayedAbsent && evo.optInDraws && evo.obmStreamUnmoved && evo.crossoverOrderHeld;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gZero && gBite && gWinner
  && noTaste.pass && epi.pass && gCross && gRng && gHygiene && fork.pass && trace.pass
  && pins.pass && seedDisjoint.pass;

const body = {
  stage: 'DLC T0 — the dormant DELIVERY CONTEST (`dlcDeliveryChoice`, to-feet vs led compete)',
  ruling: '#235 (the dial retired, the contract drafted) + #236 (the VISION re-audit and its '
    + 'four amendments) + #181.2 (the standing receipt rule) + #194 (gate semantics stated '
    + 'exactly) + #197-M1 (commit-free hashed body) + #200 (no predicates) + #228 (the '
    + 'two-doors lesson, gated from birth)',
  contract: 'docs/world-model/DELIVERY-CHOICE-CONTRACT.md',
  doc: 'docs/world-model/DLC-T0-DORMANT-SEAM.md',
  frozenLaw: {
    geneDomain: [0, 1],
    geneValues: { zero: GENE_ZERO, full: GENE_FULL },
    projection: { flightSpeed: PTP_FLIGHT_SPEED, leadFlightMul: PTP_LEAD_FLIGHT_MUL },
    derivation: 'THE CONTEST (M-DLC.1): armed (the dlcDeliveryChoice flag AND a NON-ABSENT '
      + 'passLeadSupport gene), the ordinary pass loop prices TWO candidates per mate — (a) TO '
      + 'FEET at the incumbent\'s own aim, byte-identical arithmetic, and (b) LED at '
      + 'mate.pos + passLeadOffset(...), the BANKED PTP-T0 projection reused VERBATIM — through '
      + 'ONE hoisted scoring function called twice, so the two calls differ in the AIM POINT and '
      + 'in NOTHING else (#236 amendment 1: NO taste multiplier on either candidate). Both enter '
      + 'the SAME bestPass argmax; the winner is struck at ITS OWN aim through the BANKED '
      + 'led-strike statement, unchanged. THE ORDER AND THE TIE (frozen here, the contract is '
      + 'silent): (a) is scored and compared FIRST and the argmax is strict `>`, so every tie '
      + 'goes to the INCUMBENT — which is why a ~zero-displacement led candidate is inert BY '
      + 'ARITHMETIC and why a still mate needs no branch (#200). THE GENE IS TASTE, NOT DOSE: '
      + 'passLeadSupport scales the projection MAGNITUDE the chooser is willing to price, with '
      + 'the candidate free to LOSE; it has NO zero-dose semantics (present at ANY value the '
      + 'candidate FORMS and competes). ZERO-POINT: flag off OR gene absent ⇒ no seat ⇒ the led '
      + 'candidate never forms ⇒ byte-identical (IEEE-exact). THE PTP INTERACTION, FROZEN: '
      + 'ptpPassLead and dlcDeliveryChoice are INDEPENDENT doors that no exam arms together; '
      + 'armed BOTH, the two candidates coincide by arithmetic and the tie rule keeps the banked '
      + 'PTP forced aim, so armed-both IS ptpPassLead armed alone, byte for byte (G-CROSS). The '
      + 'recommended !dlcDeliveryChoice guard was unavailable: the ptp fork line is pinned '
      + 'VERBATIM by tests/ptpPassLead.test.ts, and a pinned test is a STOP, never an edit.',
  },
  gates: {
    gDet: { pass: gDet, digestA, digestB },
    gIdent: {
      pass: gIdentPass, seasons: FINGERPRINT_SEASONS,
      procedure: 'new League({seed}) → runHeadless toGeneration(generation + 2) → '
        + 'sha256(JSON.stringify(out.league)) — identical to scripts/fingerprint.ts',
      semantics: 'THE RNG-STREAM RECEIPT for the sim path — and, this stage, ALSO THE '
        + 'CODE-MOTION RECEIPT: the ground-pass scoring chain was HOISTED into one function so '
        + 'both deliveries could be priced by the same code, and these baselines were frozen '
        + 'from PRE-change code, so any drift in that hoist — a reordered operand, a changed '
        + 'double — would break them.',
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
        + 'on-ball decision and returns null because the gene is absent, so the second candidate '
        + 'never forms. Byte-identity to OFF proves the born-absent world inert THROUGH the live '
        + 'branch.',
    },
    gZero: {
      pass: gZero, seeds: N,
      zeroCandidatesFormedPercept: geometryPercept.zeroCandidatesFormed,
      zeroCandidatesFormedBare: geometryBare.zeroCandidatesFormed,
      zeroCandidatesDegeneratePercept: geometryPercept.zeroCandidatesDegenerate,
      zeroCandidatesDegenerateBare: geometryBare.zeroCandidatesDegenerate,
      semantics: '⭐ DEFINED, NOT n/a — and a DIFFERENT claim from PTP-T0\'s. Under this '
        + 'contract the gene has NO zero-dose semantics: at 0 the led candidate FORMS, is SCORED '
        + 'and ENTERS THE ARGMAX, and the world is byte-identical to OFF only because its aim '
        + 'degenerates onto the feet candidate\'s point (x + ±0 === x) and the frozen tie rule '
        + 'keeps the incumbent. NON-VACUITY IS IN THE GATE: the zero candidates are counted in '
        + 'both world shapes and must be > 0. ⚠ WHAT THE COUNTER MEASURES, EXACTLY: '
        + '`zeroCandidatesFormed/Degenerate` are PROBE-SIDE SEAT CONSTRUCTIONS on sampled live '
        + 'match states (the probe builds the seat and calls `ledDelivery` off a genome COPY) — '
        + 'they are not a tally of candidates the BRAIN built. That the BRAIN builds, prices and '
        + 'argmaxes them is established by CODE READING (the read-fork inventory, machine-checked '
        + 'by G-FORK and G-NOTASTE) and IN SIMULATION by G-BITE\'s divergence receipt and by '
        + 'G-WINNER end to end through the brain — not by this counter.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      bareDivergedSeeds: runA.rows.filter((r) => r.bareDiverged).length,
      seeds: N,
      contestGeometryPercept: geometryPercept,
      contestGeometryBare: geometryBare,
      chosenPassesPercept: smokePercept,
      chosenPassesBare: smokeBare,
      semantics: 'THREE things at once. (i) DIVERGENCE: armed with the gene at its upper corner '
        + 'the world moves on every seed, in the percept world AND in the bare world. (ii) THE '
        + 'LAW ON SAMPLED DECISIONS: on live match states the led candidate\'s displacement is '
        + 're-derived INDEPENDENTLY from the world\'s own motion source and must match exactly, '
        + 'point along the motion (SIGN), have magnitude gene·|motion|·flight·MUL, be exactly '
        + 'zero for a NON-support mate and for a STILL mate WITHOUT a branch (#200), and its aim '
        + 'must be exactly mate.pos + lead. (iii) THE PASSES ACTUALLY STRUCK: performPass is '
        + 'wrapped on an armed match so the 5th argument identifies the WINNING candidate for '
        + 'every chosen pass — that table is the REPORTED emergent led share. ⚠ TWO LIMITS ON '
        + '(ii), LABELLED: the geometry counters are PROBE-SIDE SEAT CONSTRUCTIONS (see '
        + '`gZero.semantics`), and the two columns are sampled on DIFFERENT arms — percept on '
        + '`bornArmed` (gene-ABSENT match), bare on `plainContest` (gene-DOSED match), recorded '
        + 'per column as `measuredOnArm` — so percept-vs-bare is NOT a clean world-shape '
        + 'contrast. Neither limit touches (i), which is the whole-match divergence receipt.',
    },
    gWinner: {
      pass: gWinner, percept: winnerPercept, bare: winnerBare,
      bothOutcomesOccur: contestBothWays, materialDivergencesPooled: contestMaterial,
      semantics: '⭐ THE ARGMAX ENTRY, PROVED END TO END THROUGH THE BRAIN (the G-LOFT-BODY '
        + 'idiom). On an ARMED + DOSED match the carrier is asked to decide and the winning Pass '
        + 'candidate\'s OWN reported openness (2 dp, in its `why` string) is compared against '
        + 'BOTH re-derivations — opennessAt(mate.pos) and opennessAt(mate.pos + lead), the aim '
        + 'rebuilt independently. EVERY winner must be priced at ITS OWN aim (violations must be '
        + 'ZERO), the two readings must diverge MATERIALLY (> 0.05) on sampled decisions, and '
        + 'BOTH OUTCOMES MUST OCCUR across the two world shapes — a contest the led ball always '
        + 'won would be the retired dial wearing a new name, and one it never won would be a '
        + 'seam with no reachable second candidate. ⚠ DECLARED INTERVENTION: an INSTRUMENT match '
        + '(decidePlayer is called on the carrier), compared to no signature anywhere.',
    },
    gNoTaste: {
      ...noTaste,
      semantics: '⭐ #236 AMENDMENT 1, MACHINE-CHECKED. Slice one carries NO taste term at all: '
        + 'the two candidate calls are matched VERBATIM and differ in the AIM ARGUMENT alone, '
        + 'there is exactly ONE scoring-function declaration (so the pricing cannot drift into '
        + 'two copies), and neither the led branch nor the seat module names a gene, an '
        + 'attribute or a multiplier of its own. Wiring riskTolerance / passBias into the new '
        + 'candidate would be a NEW read of shipped genes — a LATER slice\'s contract question '
        + 'WITH numbers, never a drafting default.',
    },
    gEpiMotion: {
      ...epi,
      semantics: '⭐ THE HONESTY CORE, RE-GATED THROUGH THIS STAGE\'S ARMING PATH (#236 '
        + 'amendment 2: "inherited" never exempts a gate). A match is stepped, every eligible led '
        + 'candidate is recorded, then EVERY TRUTH VELOCITY IS REWRITTEN IN PLACE WITHOUT '
        + 'STEPPING — no scan moment is recorded, so the remembered velocities still hold the old '
        + 'world; POSITIONS ARE UNTOUCHED so `flight` is identical and the ONLY thing that can '
        + 'move a candidate is its motion source. PERCEPT: every candidate UNCHANGED, none equal '
        + 'to the truth-derived value. BARE: every candidate FOLLOWS truth exactly. Plus the '
        + 'SOURCE pin over BOTH seat modules: the only member of `match` either names is '
        + 'perceivedSnapshot.',
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
      semantics: '⭐⭐ THE TWO-DOORS MATRIX (#228) with FOUR doors, gated FROM BIRTH. '
        + '{dlcDeliveryChoice × ptpPassLead × obmMovement × ctbSupportPlane} × {the OBM/CTB '
        + 'banks dosed/absent} × {the SHARED gene absent/zero/dosed} = 96 cells, a FULL match per '
        + 'cell per seed, whole-run signature incl. rng state. ⭐ ptpPassLead is not merely a '
        + 'neighbour here — it READS THE SAME GENE — so this matrix is where the FROZEN PTP '
        + 'INTERACTION is proved (armed-both ≡ ptp-alone at every gene state) and where the '
        + 'CONTEST is proved NOT to be the FORCED DOSE.',
    },
    gRng: {
      pass: gRng,
      seam: {
        ...seamDraws,
        semantics: 'an ARMED, fully DOSED contest formed and scored over every outfielder of '
          + 'both teams against every mate on a 400-tick fixture: the match rng state is EXACT '
          + 'before and after. The percept pull draws nothing either.',
      },
      evolution: {
        ...evo,
        semantics: 'THIS STAGE ADDS NO GENE AND NO OPT-IN — genome.ts is untouched — and that '
          + 'is re-proved rather than asserted: the shipped mutate/crossover with the opt-in OFF '
          + 'vs a faithful PRE-GENE re-implementation gives identical genomes AND identical final '
          + 'rng state; optInDraws shows the banked opt-in path is still live; obmStreamUnmoved '
          + 'and crossoverOrderHeld show the banked draw ordering is unmoved.',
      },
    },
    gHygiene: { pass: gHygiene, ...hyg },
    gFork: {
      pass: fork.pass, flagForks: fork.flagForks, candScoreSites: fork.candScoreSites,
      ledFormSites: fork.ledFormSites, ledCaptureSites: fork.ledCaptureSites,
      performPassStatements: fork.newStrikeStatements,
      semantics: '⭐ THE READ-FORK INVENTORY: EXACTLY ONE `match.dlcDeliveryChoice` fork in '
        + 'src/** — the contest seat fork in PlayerBrain.decideOnBall\'s pass block — feeding '
        + 'exactly ONE led-candidate formation (`ledDelivery`), TWO candidate scorings (the ONE '
        + 'hoisted `groundCandidate`, called once per delivery) and ONE led capture pair, with '
        + '⭐ ZERO NEW STRIKE STATEMENTS: `match.performPass(` is called from the SAME THREE '
        + 'places as before this stage (the kickoff back-pass, the incumbent synchronous strike '
        + 'and the banked PTP-T0 led strike), because the contest\'s winner rides the BANKED '
        + 'statement rather than adding one. '
        + 'Everything else that names the flag or the module is a declaration, an init, the '
        + 'League union key, an import or the seat module\'s own body — all enumerated below '
        + 'with file:line and class, ZERO unclassified.',
      sites: fork.sites,
    },
    gTrace: {
      ...trace,
      semantics: 'THE BANKED PROJECTION IS VERBATIM-UNTOUCHED (its two constants, its two '
        + 'declarations, its projection body and its scope gate are matched line for line, and '
        + 'the module\'s whole-file sha256 is recorded so a later stage cannot edit it quietly '
        + 'and still cite PTP-T0\'s law receipts) — which is what entitles this stage to cite '
        + 'PTP-T0\'s law rather than re-derive it. The same gate asserts the UNTOUCHED '
        + 'INCUMBENTS in source form: the MakeRun guard and burst call, ⭐ the lofted switch\'s '
        + 'own `d > 24` hand gate (SLICE TWO\'s zero-point), ⭐ the AUTOMATIC ground bender '
        + '(SLICE THREE\'s zero-point — the user\'s own Phase-71 ask, a shipped incumbent and '
        + 'NOT a defect to repair, the #236 街机偏离 clause), the incumbent strike-time lead, and '
        + 'the ptpPassLead fork line whose VERBATIM pin shaped the PTP interaction.',
    },
    gPins: {
      pass: pins.pass, srcVerbatim: pins.srcVerbatim, namedPins: pins.namedPins,
      semantics: 'THE PIN INVENTORY, machine-checked in the test files AND in src/**. ⭐ The '
        + 'first row is the pin that SHAPED this design: PTP-T0\'s own G-FORK asserts the '
        + 'ptpPassLead fork line as EXACT TEXT and requires exactly one such line, so the '
        + 'dispatch\'s recommended `!dlcDeliveryChoice` guard on that line was never available. '
        + 'Nothing was renegotiated; a failing pin would have been a STOP, never a test edit.',
    },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    winnerTable: {
      note: 'REPORTED, observation-only, ONE armed+dosed match per world shape with performPass '
        + 'wrapped so the WINNING CANDIDATE is identified for every chosen pass (a non-null 5th '
        + 'argument is the LED candidate; a null one is TO FEET). ⭐ THE LED SHARE IS THE '
        + 'EMERGENT DOSE — the number the retired dial used to fix at 1. Descriptive counts only '
        + '— no control, no CI, no dose curve, no ANSWER. The CHOICE EXAM is DLC-T1\'s.',
      seed: READ_SEED,
      percept: smokePercept,
      bare: smokeBare,
    },
    chooserCost: {
      note: '⭐ REPORTED per #236 amendment 4. Wall-clock on a shared machine, minimum of 3 '
        + 'repeats, one full match per arm in a PERCEPT-ARMED world. Used in NO rate, bounds '
        + 'nothing. The mechanism it prices: ARMED AND DOSED, every support-mode mate is priced '
        + 'TWICE — two lane scans, two openness reads, two style-chain evaluations — against the '
        + 'incumbent\'s one. ⚠ NOT LIKE-FOR-LIKE AT THE TOTAL-WALL LEVEL: the armed+dosed arm is '
        + 'a DIVERGED world and simulates a DIFFERENT NUMBER OF TICKS from the off / born-armed '
        + 'arms, so PER-ARM TICK COUNTS are published, the HEADLINE is ms/TICK and total wall is '
        + 'CONTEXT ONLY. THE NOISE FLOOR IS THE INSTRUMENT\'S OWN CONTROL PAIR: off and bornArmed '
        + 'execute the SAME arithmetic (the seat is null, no second candidate forms), so their '
        + 'per-tick spread is pure scatter and ANY per-tick effect no larger than it is '
        + 'UNRESOLVED here (`contestResolvedAboveNoiseFloor` says which case this run is). The '
        + 'honest lever if it is dear is CANDIDATE SCOPING, never a pricing shortcut.',
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
o(`=== DLC T0 CONTEST RECEIPTS — head ${head} (context only) — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-ZERO ${gZero ? 'PASS' : 'FAIL'}`
  + ` · G-BITE ${gBite ? 'PASS' : 'FAIL'} · ⭐G-WINNER ${gWinner ? 'PASS' : 'FAIL'}`
  + ` · ⭐G-NOTASTE ${noTaste.pass ? 'PASS' : 'FAIL'} · ⭐G-EPI-MOTION ${epi.pass ? 'PASS' : 'FAIL'}`
  + ` · ⭐⭐G-CROSS ${gCross ? 'PASS' : 'FAIL'} · G-RNG ${gRng ? 'PASS' : 'FAIL'}`
  + ` · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'} · G-FORK ${fork.pass ? 'PASS' : 'FAIL'}`
  + ` · G-TRACE ${trace.pass ? 'PASS' : 'FAIL'} · G-PINS ${pins.pass ? 'PASS' : 'FAIL'}`
  + ` · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o('FROZEN LAW: two candidates per support mate — to feet (incumbent) and led '
  + `(mate.pos + gene · motion · dist/${PTP_FLIGHT_SPEED} · ${PTP_LEAD_FLIGHT_MUL}) — ONE scoring `
  + 'function, ONE argmax, ties to the incumbent.');
for (const [shape, r] of [['percept', geometryPercept], ['bare', geometryBare]] as const) {
  o(`CONTEST GEOMETRY ${shape.padEnd(8)} (${r.supportSamples} support of ${r.samples} samples):`
    + ` moved ${r.movedSamples} · still ${r.stillSamples}`
    + ` · mean lead ${r.meanLeadMetres} m (max ${r.maxLeadMetres})`
    + ` · zero-gene candidates formed ${r.zeroCandidatesFormed} (degenerate ${r.zeroCandidatesDegenerate})`
    + ` · violations ${JSON.stringify(r.violations)}`);
}
o('⭐ G-WINNER (the argmax entry, through the brain):');
for (const [shape, r] of [['percept', winnerPercept], ['bare', winnerBare]] as const) {
  o(`  ${shape.padEnd(8)} ${r.passCandidates} Pass candidates · material ${r.materialSamples}`
    + ` · LED wins ${r.ledWins} · TO-FEET wins ${r.feetWins} · violations ${r.violations}`
    + ` · max Δopen ${r.maxOpenDelta}`);
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
o(`G-RNG seam: rng ${seamDraws.before} → ${seamDraws.after} over ${seamDraws.calls} armed contests`);
o(`FORK TABLE: ${fork.flagForks} flag fork(s), ${fork.candScoreSites} candidate scoring(s), `
  + `${fork.ledFormSites} led formation(s), ${fork.ledCaptureSites} led capture(s), `
  + `${fork.newStrikeStatements} performPass statement(s) (UNCHANGED), `
  + `${fork.sites.length} src occurrence(s) total`);
o(`PIN INVENTORY: ${pins.namedPins.filter((p) => p.found).length}/${pins.namedPins.length} named pins present`
  + ` · src verbatim ${pins.srcVerbatim}`);
o('⭐ REPORTED — the WINNER TABLE (the emergent led share):');
for (const [shape, r] of [['percept', smokePercept], ['bare', smokeBare]] as const) {
  o(`  ${shape.padEnd(8)} ${r.passes} passes chosen · LED ${r.ledWins} (${r.ledShare}) · `
    + `TO FEET ${r.feetWins} · mean lead ${r.meanLeadMetres} m (max ${r.maxLeadMetres})`
    + ` · lead/distance ${r.meanLeadShareOfDistance}`
    + ` · sign/magnitude violations ${r.signViolations}/${r.magnitudeViolations}`);
}
o(`⭐ REPORTED chooser cost (min of ${cost.repeats}; HEADLINE = ms/tick, total wall = context;`
  + ` tick counts equal across arms: ${cost.tickCountsEqualAcrossArms}):`);
for (const a of cost.arms) {
  o(`  ${a.arm.padEnd(10)} ${String(a.ticks).padStart(6)} ticks · ${String(a.minMs).padStart(6)} ms`
    + ` · ${a.msPerTick} ms/tick`
    + ` · per-tick vs OFF ${a.perTickVsOffPct === null ? '—' : `${a.perTickVsOffPct}%`}`
    + ` · [context] total wall vs OFF ${a.totalWallVsOffPctContextOnly === null ? '—' : `${a.totalWallVsOffPctContextOnly}%`}`);
}
o(`  NOISE FLOOR (off vs bornArmed, identical arithmetic) ${cost.noiseFloorPerTickPct}% per tick`
  + ` · CONTEST per-tick ${cost.headlinePerTick.contestVsOffPct}%`
  + ` · resolved above the floor: ${cost.contestResolvedAboveNoiseFloor}`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
