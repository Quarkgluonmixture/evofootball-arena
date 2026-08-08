/**
 * PM T0 — THE DORMANT DEFENSIVE LANE-CONVERGENCE SEAM: the receipts probe.
 *
 * Doc: docs/world-model/PM-T0-DORMANT-SEAM.md
 * Contract: docs/world-model/PHASE-MODULATION-CONTRACT.md §2 M-PM.1–5, §3 PM-T0
 * Ruling: #195.2 (the dispatch), #181.2 (THE STANDING RECEIPT RULE), #194 (state
 *         each gate's semantics EXACTLY — say what the arms DIFFER in).
 *
 * ⭐ #181.2: a HARD gate's evidence must be a COMMITTED, RECOMPUTABLE artifact.
 * Every hash below is computed IN THIS PROBE on the run that writes the JSON —
 * nothing is transcribed from a doc, and the doc quotes the artifact, never the
 * other way round. Re-run:
 *
 *     npx tsx scripts/probes/pm-t0-lane-seam.ts
 *          → docs/world-model/data/pm-t0-lane-seam.json
 *
 * The gates (all HARD unless marked REPORTED):
 *   G-IDENT   flag-off league byte-identity on THREE frozen league seeds, each
 *             recomputed here (2 seasons; the 1337 row IS the production
 *             fingerprint). These baselines were frozen from PRE-change code, so
 *             THIS is the RNG-stream receipt for the sim path: any added draw on
 *             the dormant path would break them.
 *   G-FP      the 1337 row IS X-FP-PROD.
 *   G-OFF     per-match whole-run signature (rng state included): flag ABSENT ≡
 *             flag FALSE, in the production-shaped world AND the percept-armed
 *             world. ⚠ SEMANTICS, exactly: both arms execute the SAME flag-off
 *             code path, so this proves CONFIG EQUIVALENCE (absent ≡ false) and
 *             nothing about RNG streams. G-IDENT is the RNG-stream evidence.
 *   G-BORN    ARMED (`pmLaneConvergence: true`) with the gene ABSENT ≡ OFF. ⚠ Its
 *             arms DO differ in code path: armed ⇒ `pmMover` is true ⇒ the seam
 *             branch in `emergentStation` is ENTERED and `k_PM` evaluates to 0.
 *             So this gate proves the born-absent read is inert THROUGH the live
 *             branch, not merely that a dead branch is dead.
 *   G-BITE    armed AND dosed (gene = 1 ⇒ k_PM = 0.25, the frozen ceiling), the
 *             world DIVERGES — the identity gates are not the identity of dead
 *             code — AND the 甲/乙 boundary still holds under that force: the
 *             zonal zone-centre read equals the unmodulated station on every
 *             sampled body-tick while the mover read moves.
 *   G-READ    the M-PM.3 read table, computed by scanning `src/**`: EXACTLY two
 *             `formationSpot` call sites pass the mover fork, and every other
 *             call site is enumerated with its file:line and class.
 *   G-EVORNG  the evolution path draws ZERO extra rng with the opt-in off: 8
 *             generations of mutate+crossover reproduce a pre-gene
 *             re-implementation's genomes AND final rng state exactly.
 *   G-CONST   the frozen ceiling is the TRACED one: PM_LANE_CONVERGENCE_MAX ===
 *             0.25 === the legacy per-body convergence weight, whose source line
 *             is matched verbatim in formations.ts.
 *   G-HYGIENE the flag is `?? false`, absent from a4World / A4_WORLD_FLAGS /
 *             a4MatchFlags, never env-armed; the gene is absent from GENE_KEYS.
 *   G-SEED    seed-block disjointness, proved in-probe.
 *   G-DET     the experiment core runs TWICE, byte-identical digests.
 *   REPORTED  the ASK census: the mean send-target lane gap, unmodulated vs
 *             mover, at the frozen ceiling. DESCRIPTIVE ONLY — no control, no CI,
 *             no dose curve; the COMPRESSION EXAM is PM-T1's.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import { formationSpot } from '../../src/ai/formations';
import {
  GENE_KEYS, PM_LANE_CONVERGENCE_MAX, crossoverGenomes, mutateGenome, randomGenome,
  type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/pm-t0-lane-seam.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited verbatim from O2-T0 §GATES G-IDENT). This probe recomputes all three. */
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: FINGERPRINT_SEED, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ---- seeds: a FRESH block above everything the A4/O-arc ledger has consumed --- */
const BLOCK = 12_311_100;
const N = Number(process.env.PMT0_N ?? 24);
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
];

const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
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
/** The percept trunk alive — the enriched census world the arc's exams read in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

type Arm = 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed' | 'forced';
/** THE INSTRUMENT DOSE (PM-T1's vector family, used here only to make the seam BITE):
 *  the gene at 1 ⇒ k_PM = PM_LANE_CONVERGENCE_MAX = 0.25, the frozen ceiling. */
const FORCED_DOSE = 1;
const matchOf = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(arm === 'plain' || arm === 'plainOff' ? {} : PERCEPT_FLAGS),
    ...(arm === 'off' || arm === 'plainOff' ? { pmLaneConvergence: false } : {}),
    ...(arm === 'bornArmed' || arm === 'forced' ? { pmLaneConvergence: true } : {}),
  });
  if (arm === 'forced') {
    for (const t of m.teams) {
      (t.info.genome as TacticalGenome).defLaneConvergence = FORCED_DOSE;
      (t.baseGenome as TacticalGenome).defLaneConvergence = FORCED_DOSE;
      (t.effGenome as TacticalGenome).defLaneConvergence = FORCED_DOSE;
    }
  }
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

/**
 * G-BITE's second half + the REPORTED ask census, on ONE forced match: at every
 * sampled tick, for every outfield body of both sides, compare
 *   • the ZONE-CENTRE read  `formationSpot(p, t, ball, false, opp)`  (assignMarks'
 *     own call shape, TeamBrain.ts) — must equal the unmodulated station, and
 *   • the MOVER read        `formationSpot(p, t, ball, false, opp, false, true)`.
 * Observation-only: it never runs inside an arm whose signature is compared.
 */
const boundaryAndAsk = (seed: number): {
  samples: number; zoneCentreDeviations: number; moverMoved: number;
  meanLaneGapUnmodulated: number; meanLaneGapMover: number; maxMoverShiftY: number;
} => {
  const m = matchOf(seed, 'forced');
  let samples = 0;
  let zoneCentreDeviations = 0;
  let moverMoved = 0;
  let sumBase = 0;
  let sumMover = 0;
  let maxShift = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      const opp = m.teams[1 - t.side];
      for (const p of t.players) {
        if (p.role === 'GK' || p.sentOff) continue;
        const zone = formationSpot(p, t, m.ball, false, opp);
        const base = formationSpot(p, t, m.ball, false, opp, false, false);
        const mover = formationSpot(p, t, m.ball, false, opp, false, true);
        if (zone.x !== base.x || zone.y !== base.y) zoneCentreDeviations += 1;
        const shift = Math.abs(mover.y - base.y);
        if (shift > 1e-9) moverMoved += 1;
        if (shift > maxShift) maxShift = shift;
        sumBase += Math.abs(base.y - m.ball.pos.y);
        sumMover += Math.abs(mover.y - m.ball.pos.y);
        samples += 1;
      }
    }
  }
  return {
    samples,
    zoneCentreDeviations,
    moverMoved,
    meanLaneGapUnmodulated: round(sumBase / Math.max(samples, 1)),
    meanLaneGapMover: round(sumMover / Math.max(samples, 1)),
    maxMoverShiftY: round(maxShift),
  };
};

/* ---- G-EVORNG: the evolution path draws ZERO extra with the opt-in off ------- */
const evoRng = (): {
  genomesIdentical: boolean; rngStateIdentical: boolean; geneStayedAbsent: boolean;
  optInDraws: boolean; sActual: number; sHead: number;
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
  const rngA = new Rng(515151);
  const rngH = new Rng(515151);
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
  const rngOn = new Rng(515151);
  let gOn = randomGenome(new Rng(11));
  for (let gen = 0; gen < 8; gen++) {
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolveDefLaneConvergence: true });
  }
  return {
    genomesIdentical: GENE_KEYS.every((k) => a0[k] === h0[k] && a1[k] === h1[k]),
    rngStateIdentical: sActual === sHead,
    geneStayedAbsent: a0.defLaneConvergence === undefined && a1.defLaneConvergence === undefined,
    optInDraws: gOn.defLaneConvergence !== undefined,
    sActual,
    sHead,
  };
};

/* ---- G-READ: the M-PM.3 read table, computed by scanning src/** ------------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full)
    : full.endsWith('.ts') ? [full] : [];
});
const readTable = (): {
  sites: { file: string; line: number; kind: 'MOVER' | 'UNMODULATED'; text: string }[];
  moverSites: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: 'MOVER' | 'UNMODULATED'; text: string }[] = [];
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      // CALL sites only: `formationSpot(` with an argument list, never the
      // declaration line, never a comment/import.
      const t = text.trim();
      if (!/formationSpot\(/.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('import')
        || t.startsWith('export function formationSpot(')) return;
      sites.push({
        file: f, line: i + 1,
        kind: /formationSpot\([^)]*pmMover\)/.test(t) ? 'MOVER' : 'UNMODULATED',
        text: t,
      });
    });
  }
  const moverSites = sites.filter((s) => s.kind === 'MOVER').length;
  return {
    sites,
    moverSites,
    pass: moverSites === 2
      && sites.filter((s) => s.kind === 'MOVER').every((s) => s.file.endsWith('actionExecutor.ts')),
  };
};

/* ---- G-CONST: the ceiling is the TRACED legacy weight ----------------------- */
const LEGACY_LINE =
  'if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;';
const constGate = (): { pass: boolean; ceiling: number; legacyLineFound: boolean; legacyLine: string } => {
  const src = readFileSync('src/ai/formations.ts', 'utf8');
  const found = src.includes(LEGACY_LINE);
  return {
    pass: found && PM_LANE_CONVERGENCE_MAX === 0.25,
    ceiling: PM_LANE_CONVERGENCE_MAX,
    legacyLineFound: found,
    legacyLine: LEGACY_LINE,
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const match = readFileSync('src/sim/Match.ts', 'utf8');
  return {
    defaultFalse: match.includes('this.pmLaneConvergence = cfg.pmLaneConvergence ?? false;'),
    absentFromA4World: !a4.includes('pmLaneConvergence') && !a4.includes('defLaneConvergence'),
    notInGeneKeys: !(GENE_KEYS as readonly string[]).includes('defLaneConvergence'),
    freshMatchOff: matchOf(1, 'absent').pmLaneConvergence === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260808 });
      return l.createMatch(l.nextFixture()!).pmLaneConvergence === false;
    })(),
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; forced: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean; diverged: boolean;
  }[];
  for (let k = 0; k < N; k++) {
    const seed = BLOCK + k;
    const absent = walk(seed, 'absent');
    const off = walk(seed, 'off');
    const plain = walk(seed, 'plain');
    const plainOff = walk(seed, 'plainOff');
    const born = walk(seed, 'bornArmed');
    const forced = walk(seed, 'forced');
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, forced,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      diverged: forced !== absent,
    });
  }
  return { seeds: { block: BLOCK, n: N, first: BLOCK, last: BLOCK + N - 1 }, rows };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== PM T0 LANE SEAM RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [pm-t0] run A digest ${digestA}\n  [pm-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [pm-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [pm-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, gene absent, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [pm-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const boundary = boundaryAndAsk(BLOCK + N);
const evo = evoRng();
const table = readTable();
const cst = constGate();
const hyg = hygiene();
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const first = BLOCK;
  const last = BLOCK + N; // + the boundary/ask match at BLOCK + N
  const clashes = CONSUMED.filter((c) => !(last < c.range[0] || first > c.range[1]));
  return { first, last, consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gBite = runA.rows.every((r) => r.diverged)
  && boundary.moverMoved > 0 && boundary.zoneCentreDeviations === 0;
const gEvoRng = evo.genomesIdentical && evo.rngStateIdentical && evo.geneStayedAbsent && evo.optInDraws;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gBite && table.pass && gEvoRng
  && cst.pass && gHygiene && seedDisjoint.pass;

const body = {
  stage: 'PM T0 — the dormant defensive LANE-CONVERGENCE seam (`defLaneConvergence` / `pmLaneConvergence`)',
  ruling: '#195.2 (the dispatch) + #181.2 (the standing receipt rule) + #194 (gate semantics stated exactly)',
  contract: 'docs/world-model/PHASE-MODULATION-CONTRACT.md',
  doc: 'docs/world-model/PM-T0-DORMANT-SEAM.md',
  head,
  frozenBounds: {
    kPmMax: PM_LANE_CONVERGENCE_MAX,
    geneDomain: [0, 1],
    derivation: 'k_PM = clamp01(defLaneConvergence) * PM_LANE_CONVERGENCE_MAX, ceiling 0.25 = the '
      + 'LEGACY per-body convergence weight the emergent rewrite dropped '
      + '(src/ai/formations.ts, table path: `defensiveCompactness * 0.25`, i.e. its maximum at '
      + 'defensiveCompactness = 1) — the contract\'s named neighbour (§0.4 / §2 M-PM.1). '
      + 'No constant is invented for this slice.',
    forcedDose: FORCED_DOSE,
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
        + 'production-shaped and the percept-armed world. Both arms execute the SAME flag-off '
        + 'code path, so this gate cannot and does not prove RNG-stream identity — G-IDENT does.',
    },
    gBorn: {
      pass: gBorn, seeds: N,
      semantics: 'THE ARMS DIFFER IN CODE PATH: armed ⇒ `pmMover` true ⇒ the M-PM.1 branch in '
        + 'emergentStation is ENTERED on every defensive mover read and k_PM evaluates to 0 '
        + '(gene born absent). Byte-identity to OFF therefore proves the born-absent read is '
        + 'inert THROUGH the live branch.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      seeds: N,
      boundaryUnderForce: {
        samples: boundary.samples,
        zoneCentreDeviations: boundary.zoneCentreDeviations,
        moverMovedSamples: boundary.moverMoved,
        maxMoverShiftY: boundary.maxMoverShiftY,
        semantics: 'at the frozen ceiling the MOVER read moves and the zonal ZONE-CENTRE read '
          + '(assignMarks\' own call shape) is bit-identical to the unmodulated station — the '
          + '甲/乙 boundary, proved under force rather than asserted.',
      },
    },
    gRead: {
      pass: table.pass, moverSites: table.moverSites,
      semantics: 'M-PM.3 / #35.3: EXACTLY two src call sites read the modulated station, both in '
        + 'actionExecutor (the walk target and the marker no-target fallback); every other call '
        + 'site keeps the unmodulated station. Computed by scanning src/**.',
      sites: table.sites,
    },
    gEvoRng: {
      pass: gEvoRng,
      semantics: 'THE ARMS DIFFER: the actual shipped mutate/crossover with the opt-in OFF vs a '
        + 'faithful PRE-GENE re-implementation (GENE_KEYS only). Identical genomes AND identical '
        + 'final rng state ⇒ zero extra draws; `optInDraws` shows the opt-in path is live.',
      ...evo,
    },
    gConst: cst,
    gHygiene: { pass: gHygiene, ...hyg },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    askCensus: {
      note: 'REPORTED, observation-only, ONE forced match at the frozen ceiling, sampled every 15 '
        + 'ticks over both sides\' outfielders. No control, no CI, no dose curve, no ANSWER '
        + '(body positions) — the COMPRESSION EXAM is PM-T1\'s and this number adjudicates nothing.',
      seed: BLOCK + N,
      ...boundary,
    },
  },
  result: runA,
};
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, resultSha256, wallMsContextOnly: wallMs }, null, 2)}\n`);

const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== PM T0 LANE SEAM RECEIPTS — HEAD ${head} — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-BITE ${gBite ? 'PASS' : 'FAIL'}`
  + ` · G-READ ${table.pass ? 'PASS' : 'FAIL'} · G-EVORNG ${gEvoRng ? 'PASS' : 'FAIL'}`
  + ` · G-CONST ${cst.pass ? 'PASS' : 'FAIL'} · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'}`
  + ` · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`FROZEN CEILING k_PM ≤ ${PM_LANE_CONVERGENCE_MAX} (traced legacy weight; forced dose ${FORCED_DOSE})`);
o(`READ TABLE: ${table.moverSites} mover site(s), ${table.sites.length - table.moverSites} unmodulated site(s)`);
o(`BOUNDARY UNDER FORCE: samples ${boundary.samples} · zone-centre deviations ${boundary.zoneCentreDeviations}`
  + ` · mover moved ${boundary.moverMoved} · max |Δy| ${boundary.maxMoverShiftY} m`);
o(`REPORTED ask: mean lane gap unmodulated ${boundary.meanLaneGapUnmodulated} m → mover ${boundary.meanLaneGapMover} m`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
