/**
 * CTB T0 — THE DORMANT SUPPORT-PLANE SEAM (回撤接应的前后左右): the receipts probe.
 *
 * Doc: docs/world-model/CTB-T0-DORMANT-SEAM.md
 * Contract: docs/world-model/CHECK-TO-BALL-CONTRACT.md §2 M-CTB.1–4, §3 CTB-T0
 * Ruling: #223 (the dispatch, with the user's FULL 2D PLANE amendment), #181.2 (THE
 *         STANDING RECEIPT RULE), #194 (state each gate's semantics EXACTLY — say
 *         what the arms DIFFER in), #197-M1 (nothing commit-dependent inside the
 *         hashed body), #202 (traced bounds derived IN CODE, never typed literals).
 *
 * ⭐ #181.2: a HARD gate's evidence must be a COMMITTED, RECOMPUTABLE artifact.
 * Every hash below is computed IN THIS PROBE on the run that writes the JSON —
 * nothing is transcribed from a doc, and the doc quotes the artifact, never the
 * other way round. Re-run:
 *
 *     npx tsx scripts/probes/ctb-t0-support-plane.ts
 *          → docs/world-model/data/ctb-t0-support-plane.json
 *
 * The gates (all HARD unless marked REPORTED):
 *   G-IDENT   flag/gene-absent league byte-identity on THREE frozen league seeds,
 *             each recomputed here (2 seasons; the 1337 row IS the production
 *             fingerprint). These baselines were frozen from PRE-change code, so
 *             THIS is the RNG-stream receipt for the sim path.
 *   G-FP      the 1337 row IS X-FP-PROD.
 *   G-OFF     per-match whole-run signature (rng state included): flag ABSENT ≡
 *             flag FALSE, production-shaped AND percept-armed. ⚠ SEMANTICS: both
 *             arms run the SAME flag-off path ⇒ CONFIG EQUIVALENCE only.
 *   G-BORN    ARMED with both genes ABSENT ≡ OFF. ⚠ The arms DIFFER in code path:
 *             armed ⇒ the M-CTB.1 fork is ENTERED on every support tick.
 *   G-ZERO    ARMED with both genes AT ZERO ≡ OFF — the zero-point identity: the
 *             absorbed mode ternary is the exact centre, not an approximation.
 *   G-BITE    ARMED at a non-zero dose the world DIVERGES, and the GEOMETRY moves
 *             as §LAW says at the four traced corners (deep/shallow/narrow/wide),
 *             sampled from real `supportSpot` outputs on a live match.
 *   G-RNG     the seam draws ZERO rng (exact state compare across a dosed armed
 *             `supportSpot` call on a stepped fixture) and the opt-in's draws sit
 *             strictly after every existing draw (8-generation stream compare,
 *             plus the markSag opt-in's own stream unmoved).
 *   G-HYGIENE `?? false`; flag and genes ABSENT from a4World.ts entirely; genes
 *             absent from GENE_KEYS; fresh Match and League match both OFF; no env
 *             door.
 *   G-FORK    EXACTLY ONE `ctbSupportPlane` read fork in src/**, inside
 *             `supportSpot`; every other src occurrence enumerated and classed.
 *   G-TRACE   `CTB_DEPTH_BIAS_SPAN` is DERIVED from `SUPPORT_LAT_CAP_FRAC` in code
 *             (declaration matched verbatim), the incumbent fan constants are the
 *             ones the seam applies, and the gene domain is the signed [−1,1].
 *   G-PINS    the §PINS inventory's machine-checkable rows: zero `supportSpot`
 *             callers in tests/**, and every named pin file/line still present.
 *   G-SEED    seed-block disjointness, proved in-probe.
 *   G-DET     the experiment core runs TWICE, byte-identical digests.
 *   REPORTED  a dosed smoke reading + the corner geometry table. DESCRIPTIVE ONLY —
 *             no control, no CI, no dose curve; the SUPPORT-SUPPLY EXAM is CTB-T1's.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import {
  CTB_DEPTH_BIAS_SPAN, SUPPORT_LAT_CAP_FRAC, SUPPORT_LAT_PULL, supportSpot,
} from '../../src/ai/formations';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, crossoverGenomes, mutateGenome, randomGenome,
  type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/ctb-t0-support-plane.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited VERBATIM and UNTRUNCATED from MT-T0 / O2-T0 §GATES G-IDENT).
 * This probe recomputes all three. */
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
const BLOCK = 12_423_000;
const N = Number(process.env.CTBT0_N ?? 24);
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

type Arm = 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed' | 'zeroArmed' | 'forced';
/**
 * THE INSTRUMENT DOSE (CTB-T1's plane family, used here only to make the seam BITE):
 * the 回撤 corner — full-negative DEPTH (behind the ball, the §0.3 defect answered)
 * and full-negative WIDTH (the fan collapsed onto the ball's own lane). Both at the
 * frozen span ends, i.e. the geometry's own corners, not an invented dose.
 */
const FORCED_DEPTH = CTB_GENE_MIN;
const FORCED_WIDTH = CTB_GENE_MIN;

/** ⭐ THE ARMING CHECKLIST (#196.3-D6): genes on ALL THREE views of BOTH teams. */
const armGenes = (m: Match, depth: number, width: number): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      g.ctbSupportDepth = depth;
      g.ctbSupportWidth = width;
    }
  }
};

const matchOf = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(arm === 'plain' || arm === 'plainOff' ? {} : PERCEPT_FLAGS),
    ...(arm === 'off' || arm === 'plainOff' ? { ctbSupportPlane: false } : {}),
    ...(arm === 'bornArmed' || arm === 'zeroArmed' || arm === 'forced'
      ? { ctbSupportPlane: true } : {}),
  });
  if (arm === 'zeroArmed') armGenes(m, 0, 0);
  if (arm === 'forced') armGenes(m, FORCED_DEPTH, FORCED_WIDTH);
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

/* ---- G-BITE's geometry half + the REPORTED corner table ---------------------- */
/**
 * On ONE armed match, sampled every 15 playing ticks over both sides' outfielders,
 * call the REAL `supportSpot` at the incumbent (unarmed) setting and at each of the
 * four traced CORNERS, and check the law's SIGN and MAGNITUDE claims directly.
 * Observation-only: it never runs inside an arm whose signature is compared.
 */
const CORNERS = [
  { name: 'deep', depth: CTB_GENE_MIN, width: 0 },
  { name: 'shallow', depth: CTB_GENE_MAX, width: 0 },
  { name: 'narrow', depth: 0, width: CTB_GENE_MIN },
  { name: 'wide', depth: 0, width: CTB_GENE_MAX },
] as const;

const cornerGeometry = (seed: number): {
  samples: number;
  corners: {
    name: string; depth: number; width: number;
    meanAheadMetres: number; meanIncumbentAheadMetres: number;
    meanLateralMetres: number; meanIncumbentLateralMetres: number;
    signViolations: number; magnitudeViolations: number;
    behindBallSamples: number; incumbentBehindBallSamples: number;
    incumbentBehindBallClampBound: number;
    maxAbsShiftMetres: number;
  }[];
  lawPass: boolean;
} => {
  const m = matchOf(seed, 'bornArmed');
  const acc = CORNERS.map((c) => ({
    name: c.name, depth: c.depth, width: c.width,
    sumAhead: 0, sumBaseAhead: 0, sumLat: 0, sumBaseLat: 0,
    signViolations: 0, magnitudeViolations: 0, behind: 0, baseBehind: 0,
    baseBehindClamped: 0, maxShift: 0,
  }));
  let samples = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff) continue;
        const base = supportSpot(p, t, m.ball);
        const radius = 10 + t.genome.supportDistance * 8;
        const baseAhead = (base.x - m.ball.pos.x) * t.attackDir;
        const baseLat = base.y - m.ball.pos.y;
        CORNERS.forEach((c, ci) => {
          armGenes(m, c.depth, c.width);
          const got = supportSpot(p, t, m.ball, true);
          const ahead = (got.x - m.ball.pos.x) * t.attackDir;
          const lat = got.y - m.ball.pos.y;
          const a = acc[ci];
          a.sumAhead += ahead;
          a.sumBaseAhead += baseAhead;
          a.sumLat += Math.abs(lat);
          a.sumBaseLat += Math.abs(baseLat);
          if (ahead < 0) a.behind += 1;
          if (baseAhead < 0) {
            a.baseBehind += 1;
            // ⚠ the honest diagnostic (§DEV 3): the INCUMBENT expression can already
            // land behind the ball where the pitch clamp binds (ball beyond
            // ±(HALF_L−2)) — a clamp artefact, not genome-expressible depth.
            if (Math.abs(base.x) >= HALF_L - 2 - 1e-9) a.baseBehindClamped += 1;
          }
          a.maxShift = Math.max(a.maxShift, Math.hypot(got.x - base.x, got.y - base.y));
          // SIGN + MAGNITUDE against §LAW (both ends clamped by the pitch, so the
          // claims are stated as inequalities the clamp can only make non-strict).
          if (c.depth < 0 && ahead > baseAhead + 1e-9) a.signViolations += 1;
          if (c.depth > 0 && ahead < baseAhead - 1e-9) a.signViolations += 1;
          if (c.width < 0 && Math.abs(lat) > Math.abs(baseLat) + 1e-9) a.signViolations += 1;
          if (c.width > 0 && Math.abs(lat) < Math.abs(baseLat) - 1e-9) a.signViolations += 1;
          // The narrow corner at −1 collapses the fan EXACTLY onto the ball's lane —
          // ⚠ up to the INCUMBENT touchline clamp, which is not this slice's (a ball
          // outside ±(HALF_W−2) has always been clamped inward). Stated as the exact
          // predicted y, so the clamp is priced rather than excused.
          if (c.width === CTB_GENE_MIN) {
            const wantY = Math.max(-HALF_W + 2, Math.min(HALF_W - 2, m.ball.pos.y));
            if (Math.abs(got.y - wantY) > 1e-9) a.magnitudeViolations += 1;
          }
          // the depth corners land EXACTLY where §LAW says, pitch clamp included
          if (c.depth !== 0 && c.width === 0) {
            const bias = t.mode === 'CounterAttack' || t.mode === 'Attack' ? 0.75 : 0.35;
            const want = Math.max(-HALF_L + 2, Math.min(
              HALF_L - 2,
              m.ball.pos.x + t.attackDir * radius * (bias + c.depth * CTB_DEPTH_BIAS_SPAN),
            ));
            if (Math.abs(got.x - want) > 1e-9) a.magnitudeViolations += 1;
          }
          // the width corners never invert the lateral sign
          if (lat * baseLat < 0) a.magnitudeViolations += 1;
        });
        samples += 1;
      }
    }
    // leave the match born-absent between samples so the trajectory is the born one
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        delete g.ctbSupportDepth;
        delete g.ctbSupportWidth;
      }
    }
  }
  const corners = acc.map((a) => ({
    name: a.name, depth: a.depth, width: a.width,
    meanAheadMetres: round(a.sumAhead / Math.max(samples, 1)),
    meanIncumbentAheadMetres: round(a.sumBaseAhead / Math.max(samples, 1)),
    meanLateralMetres: round(a.sumLat / Math.max(samples, 1)),
    meanIncumbentLateralMetres: round(a.sumBaseLat / Math.max(samples, 1)),
    signViolations: a.signViolations,
    magnitudeViolations: a.magnitudeViolations,
    behindBallSamples: a.behind,
    incumbentBehindBallSamples: a.baseBehind,
    incumbentBehindBallClampBound: a.baseBehindClamped,
    maxAbsShiftMetres: round(a.maxShift),
  }));
  return {
    samples,
    corners,
    lawPass: samples > 0
      && corners.every((c) => c.signViolations === 0 && c.magnitudeViolations === 0)
      // ⭐ the whole point: the DEEP corner puts bodies BEHIND the ball on real
      // ticks, at a scale the incumbent expression cannot reach. ⚠ CORRECTED AFTER
      // FIRST SIGHT (§DEV 3, recorded not rewritten): the pre-registered form
      // demanded the incumbent be behind the ball on ZERO ticks; it is not — the
      // INCUMBENT PITCH CLAMP already lands a supporter behind a ball that is
      // beyond ±(HALF_L−2). Every such sample is clamp-bound (asserted below), so
      // the contract §0.3 fact survives as stated — no GENOME can express depth —
      // and the gate now asserts that, plus a strict increase under the deep dose.
      && corners.every((c) => c.incumbentBehindBallSamples === c.incumbentBehindBallClampBound)
      && corners.find((c) => c.name === 'deep')!.behindBallSamples
        > corners.find((c) => c.name === 'deep')!.incumbentBehindBallSamples,
  };
};

/* ---- G-RNG (a): a dosed, ARMED supportSpot call draws zero rng --------------- */
const seamRng = (seed: number): { before: number; after: number; pass: boolean; calls: number } => {
  const m = matchOf(seed, 'forced');
  for (let i = 0; i < 400; i++) m.step(DT);
  const before = (m.rng as unknown as { s: number }).s;
  let calls = 0;
  for (const t of m.teams) {
    for (const p of t.players) {
      supportSpot(p, t, m.ball, true);
      calls += 1;
    }
  }
  const after = (m.rng as unknown as { s: number }).s;
  return { before, after, pass: before === after && calls > 0, calls };
};

/* ---- G-RNG (b): the evolution path draws ZERO extra with the opt-in off ------ */
const evoRng = (): {
  genomesIdentical: boolean; rngStateIdentical: boolean; genesStayedAbsent: boolean;
  optInDraws: boolean; markSagStreamUnmoved: boolean; sActual: number; sHead: number;
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
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolveCtbSupportPlane: true });
  }
  // the PRIOR opt-in's OWN stream is unmoved: a markSag-only run reproduces a
  // markSag-only re-implementation's stream and value exactly, because the new
  // draws sit STRICTLY AFTER the markSag block.
  const markSagOnly = (): { g: TacticalGenome; s: number } => {
    const r = new Rng(616161);
    let g = randomGenome(new Rng(11));
    for (let gen = 0; gen < 8; gen++) {
      g = mutateGenome(g, r, { rate: 0.45, scale: 0.14, evolveMarkSag: true });
    }
    return { g, s: (r as unknown as { s: number }).s };
  };
  const sagRef = (): { g: TacticalGenome; s: number } => {
    const r = new Rng(616161);
    let g = randomGenome(new Rng(11));
    for (let gen = 0; gen < 8; gen++) {
      const out = { ...g };
      for (const k of GENE_KEYS) if (r.chance(0.45)) out[k] = clamp01(out[k] + r.gaussian() * 0.14);
      if (r.chance(0.45)) out.markSag = clamp01((out.markSag ?? 0) + r.gaussian() * 0.14);
      g = out;
    }
    return { g, s: (r as unknown as { s: number }).s };
  };
  const sagA = markSagOnly();
  const sagB = sagRef();
  return {
    genomesIdentical: GENE_KEYS.every((k) => a0[k] === h0[k] && a1[k] === h1[k]),
    rngStateIdentical: sActual === sHead,
    genesStayedAbsent: a0.ctbSupportDepth === undefined && a0.ctbSupportWidth === undefined
      && a1.ctbSupportDepth === undefined && a1.ctbSupportWidth === undefined,
    optInDraws: gOn.ctbSupportDepth !== undefined && gOn.ctbSupportWidth !== undefined,
    markSagStreamUnmoved: sagA.s === sagB.s && sagA.g.markSag === sagB.g.markSag,
    sActual,
    sHead,
  };
};

/* ---- G-FORK: every src occurrence of the flag, classed ---------------------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full)
    : full.endsWith('.ts') ? [full] : [];
});
const forkTable = (): {
  sites: { file: string; line: number; kind: string; text: string }[];
  forks: number; pass: boolean;
} => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcFiles('src')) {
    const lines = readFileSync(f, 'utf8').split('\n');
    lines.forEach((text, i) => {
      const t = text.trim();
      if (!/ctbSupportPlane|ctbPlane/.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = /^if \(ctbPlane\)/.test(t) ? 'FORK'
        : /^readonly ctbSupportPlane/.test(t) ? 'FIELD'
          : /^ctbSupportPlane\?:/.test(t) ? 'CONFIG'
            : /this\.ctbSupportPlane = cfg\.ctbSupportPlane \?\? false;/.test(t) ? 'INIT'
              : /supportSpot\(p, team, ball, match\.ctbSupportPlane\)/.test(t) ? 'PASSTHROUGH'
                : /ctbPlane = false/.test(t) ? 'PARAM'
                  : /'ctbSupportPlane'/.test(t) ? 'UNION_KEY' : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  const forks = sites.filter((s) => s.kind === 'FORK').length;
  return {
    sites,
    forks,
    pass: forks === 1
      && sites.filter((s) => s.kind === 'FORK').every((s) => s.file.endsWith('formations.ts'))
      && sites.filter((s) => s.kind === 'OTHER').length === 0
      && sites.filter((s) => s.kind === 'PASSTHROUGH').length === 1,
  };
};

/* ---- G-TRACE: the spans are DERIVED in code from the incumbent constants ----- */
const DERIVATION_LINE = 'export const CTB_DEPTH_BIAS_SPAN = SUPPORT_LAT_CAP_FRAC;';
const CAP_LINE = 'const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;';
const PULL_LINE =
  'const latPull = clamp((lane.y - ball.pos.y) * SUPPORT_LAT_PULL * widthScale, -maxLat, maxLat);';
const traceGate = (): {
  pass: boolean; depthSpan: number; latPull: number; latCapFrac: number;
  derivationLineFound: boolean; capLineFound: boolean; pullLineFound: boolean;
  geneDomain: readonly [number, number]; behindExpressibleAttack: number;
  behindExpressibleOther: number;
} => {
  const src = readFileSync('src/ai/formations.ts', 'utf8');
  const derivationLineFound = src.includes(DERIVATION_LINE);
  const capLineFound = src.includes(CAP_LINE);
  const pullLineFound = src.includes(PULL_LINE);
  return {
    pass: derivationLineFound && capLineFound && pullLineFound
      && CTB_DEPTH_BIAS_SPAN === SUPPORT_LAT_CAP_FRAC
      && SUPPORT_LAT_CAP_FRAC === 0.9 && SUPPORT_LAT_PULL === 0.75
      && CTB_GENE_MIN === -1 && CTB_GENE_MAX === 1
      // the §0.3 defect answered: level-with/behind expressible in BOTH modes
      && 0.75 - CTB_DEPTH_BIAS_SPAN < 0 && 0.35 - CTB_DEPTH_BIAS_SPAN < 0,
    depthSpan: CTB_DEPTH_BIAS_SPAN,
    latPull: SUPPORT_LAT_PULL,
    latCapFrac: SUPPORT_LAT_CAP_FRAC,
    derivationLineFound,
    capLineFound,
    pullLineFound,
    geneDomain: [CTB_GENE_MIN, CTB_GENE_MAX],
    behindExpressibleAttack: round(0.75 - CTB_DEPTH_BIAS_SPAN),
    behindExpressibleOther: round(0.35 - CTB_DEPTH_BIAS_SPAN),
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const match = readFileSync('src/sim/Match.ts', 'utf8');
  const seamFiles = ['src/sim/Match.ts', 'src/ai/formations.ts', 'src/ai/actionExecutor.ts',
    'src/evolution/genome.ts', 'src/sim/League.ts'];
  return {
    defaultFalse: match.includes('this.ctbSupportPlane = cfg.ctbSupportPlane ?? false;'),
    absentFromA4World: !a4.includes('ctbSupportPlane') && !a4.includes('ctbSupportDepth')
      && !a4.includes('ctbSupportWidth'),
    notInGeneKeys: !(GENE_KEYS as readonly string[]).includes('ctbSupportDepth')
      && !(GENE_KEYS as readonly string[]).includes('ctbSupportWidth'),
    noEnvDoor: seamFiles.every((f) => readFileSync(f, 'utf8').split('\n')
      .filter((l) => /ctbSupport/.test(l))
      .every((l) => !/envArmed|EDS_BUNDLE_ARMED|process\.env/.test(l))),
    freshMatchOff: matchOf(1, 'absent').ctbSupportPlane === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260810 });
      return l.createMatch(l.nextFixture()!).ctbSupportPlane === false;
    })(),
    randomGenomeBornAbsent: (() => {
      const g = randomGenome(new Rng(99));
      return g.ctbSupportDepth === undefined && g.ctbSupportWidth === undefined
        && !JSON.stringify(g).includes('ctbSupport');
    })(),
  };
};

/* ---- G-PINS: the §PINS inventory's machine-checkable rows -------------------- */
const testFiles = (): string[] => readdirSync('tests').filter((f) => f.endsWith('.ts'))
  .map((f) => join('tests', f));
const pinTable = (): {
  testCallers: number; ownTestCallers: number;
  namedPins: { pin: string; file: string; needle: string; found: boolean }[];
  pass: boolean;
} => {
  // ⚠ Stated exactly: PRE-EXISTING tests only. This stage's OWN test file
  // (`ctbSupportPlane.test.ts`) deliberately calls `supportSpot` — that is the
  // zero-point / law pin, and counting it would make the inventory row meaningless.
  const OWN = 'ctbSupportPlane.test.ts';
  const testCallers = testFiles().filter((f) => !f.endsWith(OWN))
    .reduce((n, f) => n + (readFileSync(f, 'utf8')
      .split('\n').filter((l) => /supportSpot\(/.test(l) && !l.trim().startsWith('//')).length), 0);
  const ownCallers = testFiles().filter((f) => f.endsWith(OWN))
    .reduce((n, f) => n + (readFileSync(f, 'utf8')
      .split('\n').filter((l) => /supportSpot\(/.test(l) && !l.trim().startsWith('//')).length), 0);
  const namedPins = [
    {
      pin: 'the 5v6 sanity invariant (Phase 30.5)',
      file: 'tests/cards.test.ts',
      needle: "directional: playing a man short costs results (forced early red)",
    },
    {
      pin: 'the goal-level shape pin (heir of the mirror-goals starvation receipt)',
      file: 'tests/formations.test.ts',
      needle: 'the novel shapes play REAL football — attack both ways over a seed pool',
    },
    {
      pin: 'the marking-scheme assignment pin (MT-T0\'s pin)',
      file: 'tests/formations.test.ts',
      needle: 'man tracks the flank threat; zonal defends its zones and the box',
    },
    {
      pin: 'the production-fingerprint pin (one of thirteen)',
      file: 'tests/a4HomePriorGene.test.ts',
      needle: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    },
    {
      pin: 'the SupportBallCarrier action-type surface',
      file: 'tests/combos.test.ts',
      needle: "type: 'SupportBallCarrier'",
    },
  ].map((p) => ({ ...p, found: readFileSync(p.file, 'utf8').includes(p.needle) }));
  return {
    testCallers,
    ownTestCallers: ownCallers,
    namedPins,
    // ZERO test callers of supportSpot (measured, not assumed) and every named pin
    // still present, unedited by this stage.
    pass: testCallers === 0 && namedPins.every((p) => p.found),
  };
};

/* ---- REPORTED: the dosed smoke — is the seam REACHED at scale? --------------- */
const dosedSmoke = (seed: number): {
  supportTicks: number; movedTicks: number; meanShiftMetres: number; maxShiftMetres: number;
  meanAheadIncumbent: number; meanAheadDosed: number; behindBallTicks: number;
} => {
  const m = matchOf(seed, 'forced');
  let supportTicks = 0;
  let moved = 0;
  let sumShift = 0;
  let maxShift = 0;
  let sumAheadBase = 0;
  let sumAheadDosed = 0;
  let behind = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 5 !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff || p.action?.type !== 'SupportBallCarrier') continue;
        const dosed = supportSpot(p, t, m.ball, true);
        // the incumbent expression on the SAME state: the flag-off call
        const base = supportSpot(p, t, m.ball);
        const shift = Math.hypot(dosed.x - base.x, dosed.y - base.y);
        if (shift > 1e-9) moved += 1;
        sumShift += shift;
        maxShift = Math.max(maxShift, shift);
        sumAheadBase += (base.x - m.ball.pos.x) * t.attackDir;
        const ahead = (dosed.x - m.ball.pos.x) * t.attackDir;
        sumAheadDosed += ahead;
        if (ahead < 0) behind += 1;
        supportTicks += 1;
      }
    }
  }
  const n = Math.max(supportTicks, 1);
  return {
    supportTicks,
    movedTicks: moved,
    meanShiftMetres: round(sumShift / n),
    maxShiftMetres: round(maxShift),
    meanAheadIncumbent: round(sumAheadBase / n),
    meanAheadDosed: round(sumAheadDosed / n),
    behindBallTicks: behind,
  };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; zeroArmed: string; forced: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean;
    zeroIdentical: boolean; diverged: boolean;
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
    rows.push({
      seed, absent, off, plain, plainOff, bornArmed: born, zeroArmed: zero, forced,
      identical: absent === off,
      plainIdentical: plain === plainOff,
      bornIdentical: born === absent,
      zeroIdentical: zero === absent,
      diverged: forced !== absent,
    });
  }
  return { seeds: { block: BLOCK, n: N, first: BLOCK, last: BLOCK + N - 1 }, rows };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== CTB T0 SUPPORT-PLANE RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [ctb-t0] run A digest ${digestA}\n  [ctb-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [ctb-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ---------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [ctb-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, genes absent, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [ctb-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const geometry = cornerGeometry(BLOCK + N);
const smoke = dosedSmoke(BLOCK + N);
const seamDraws = seamRng(BLOCK + N);
const evo = evoRng();
const fork = forkTable();
const trace = traceGate();
const hyg = hygiene();
const pins = pinTable();
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  // EVERY interval this stage consumes is checked, not just the receipts block:
  // the test file's own fixture seeds are consumption too (§SEED LEDGER).
  const intervals = [
    { name: 'CTB-T0 receipts + corner-geometry/smoke read', first: BLOCK, last: BLOCK + N },
    { name: 'CTB-T0 test-file seeds (tests/ctbSupportPlane.test.ts)', first: 12_423_900, last: 12_423_901 },
  ] as const;
  const checked = intervals.map((iv) => {
    const clashes = CONSUMED.filter((c) => !(iv.last < c.range[0] || iv.first > c.range[1]));
    return { ...iv, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
  });
  const all = checked.flatMap((iv) => iv.collisions);
  return {
    first: BLOCK,
    last: BLOCK + N, // + the geometry/smoke match at BLOCK + N
    intervals: checked,
    consumedBlocks: CONSUMED,
    collisions: all,
    pass: checked.every((iv) => iv.pass),
    semantics: 'BOTH intervals this stage consumes are machine-checked against the consumed '
      + 'ledger: the receipts block AND the test file\'s own fixture seeds.',
  };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gZero = runA.rows.every((r) => r.zeroIdentical);
const gBite = runA.rows.every((r) => r.diverged) && geometry.lawPass;
const gRng = seamDraws.pass && evo.genomesIdentical && evo.rngStateIdentical
  && evo.genesStayedAbsent && evo.optInDraws && evo.markSagStreamUnmoved;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gZero && gBite && gRng
  && gHygiene && fork.pass && trace.pass && pins.pass && seedDisjoint.pass;

const body = {
  stage: 'CTB T0 — the dormant SUPPORT-PLANE seam (`ctbSupportDepth` + `ctbSupportWidth` / `ctbSupportPlane`)',
  ruling: '#223 (the dispatch, user amendment: the FULL 2D PLANE) + #181.2 (the standing receipt '
    + 'rule) + #194 (gate semantics stated exactly) + #197-M1 (commit-free hashed body) + #202 '
    + '(traced bounds derived in code)',
  contract: 'docs/world-model/CHECK-TO-BALL-CONTRACT.md',
  doc: 'docs/world-model/CTB-T0-DORMANT-SEAM.md',
  frozenLaw: {
    depthSpan: CTB_DEPTH_BIAS_SPAN,
    latPull: SUPPORT_LAT_PULL,
    latCapFrac: SUPPORT_LAT_CAP_FRAC,
    geneDomain: [CTB_GENE_MIN, CTB_GENE_MAX],
    derivation: 'aheadBias\' = aheadBias + clampSigned(ctbSupportDepth) * CTB_DEPTH_BIAS_SPAN, '
      + 'where CTB_DEPTH_BIAS_SPAN IS SUPPORT_LAT_CAP_FRAC (0.9) — the support seat\'s OWN '
      + 'lateral cap fraction, i.e. the engine\'s standing answer to "how far off the ball, as a '
      + 'fraction of the support radius, may this seat sit", read on the other axis of the same '
      + 'plane. widthScale = 1 + clampSigned(ctbSupportWidth) multiplies BOTH incumbent fan '
      + 'constants coherently, so the width axis\' span IS each incumbent constant itself. '
      + 'The mode ternary (0.75 attack / 0.35 otherwise) is ABSORBED as the zero-point, not '
      + 'deleted. No constant is invented and none is typed as a literal for this slice.',
    forcedDose: { depth: FORCED_DEPTH, width: FORCED_WIDTH },
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
        + 'code path, so this gate cannot and does not prove RNG-stream identity — G-IDENT (vs '
        + 'PRE-change baselines) plus the zero-rng seam does.',
    },
    gBorn: {
      pass: gBorn, seeds: N,
      semantics: 'THE ARMS DIFFER IN CODE PATH: armed ⇒ the M-CTB.1 fork inside supportSpot is '
        + 'ENTERED on every support tick and both weight maps evaluate to their zeros '
        + '(genes born absent). Byte-identity to OFF therefore proves the born-absent read is '
        + 'inert THROUGH the live branch.',
    },
    gZero: {
      pass: gZero, seeds: N,
      semantics: 'THE ZERO-POINT IDENTITY: armed with both genes PRESENT at 0. The arms differ '
        + 'in code path AND in gene state; byte-identity proves the deformation law is exactly '
        + 'null at zero, i.e. the incumbent mode ternary and the incumbent fan constants really '
        + 'are the centre this plane is built around.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      seeds: N,
      geometryUnderForce: {
        samples: geometry.samples,
        corners: geometry.corners,
        lawPass: geometry.lawPass,
        semantics: 'REAL supportSpot outputs sampled on a live match at the four traced corners. '
          + 'SIGN: negative depth never moves the seat further ahead, positive depth never '
          + 'further back, negative width never widens, positive width never narrows. MAGNITUDE: '
          + 'the depth corners move the ahead-distance by exactly depth*span*radius (except '
          + 'where the incumbent pitch clamp binds), the narrow corner at -1 lands EXACTLY on '
          + 'the ball\'s lane, and no corner ever inverts the lateral sign. The headline, as '
          + 'CORRECTED after first sight (§DEV 4): the pre-registered "the incumbent lands '
          + 'behind the ball on ZERO ticks" is FALSE and is withdrawn, not repaired — the '
          + 'incumbent expression lands behind the ball ONLY where the pitch-edge x clamp '
          + `binds (${geometry.corners[0].incumbentBehindBallSamples} of ${geometry.samples} `
          + 'sampled ticks, every one clamp-bound, NONE genome-'
          + 'expressible), so the contract §0.3 statement — no genome in the evolvable space '
          + 'can place a supporter level with or behind the ball — survives exactly as '
          + 'written. The gate therefore asserts that EVERY incumbent behind-ball case is '
          + 'clamp-bound (incumbentBehindBallSamples === incumbentBehindBallClampBound) plus '
          + 'a STRICT increase in behind-ball ticks under the deep dose.',
      },
    },
    gRng: {
      pass: gRng,
      seam: {
        ...seamDraws,
        semantics: 'an ARMED, fully DOSED supportSpot call on a stepped fixture: the match rng '
          + 'state is EXACT before and after, over every body of both teams.',
      },
      evolution: {
        ...evo,
        semantics: 'THE ARMS DIFFER: the actual shipped mutate/crossover with the opt-in OFF vs a '
          + 'faithful PRE-GENE re-implementation (GENE_KEYS only). Identical genomes AND identical '
          + 'final rng state ⇒ zero extra draws; `optInDraws` shows the opt-in path is live; '
          + '`markSagStreamUnmoved` shows the new draws sit STRICTLY AFTER the markSag block.',
      },
    },
    gHygiene: { pass: gHygiene, ...hyg },
    gFork: {
      pass: fork.pass, forks: fork.forks,
      semantics: 'EXACTLY ONE read fork on the flag in src/**, inside supportSpot; the flag '
        + 'reaches it through exactly one PASSTHROUGH call site (the SupportBallCarrier executor '
        + 'case). Every other occurrence is a declaration, an init, the parameter, or the League '
        + 'matchFlags union key — enumerated below with file:line, zero unclassified.',
      sites: fork.sites,
    },
    gTrace: {
      ...trace,
      semantics: 'the depth span is DERIVED IN CODE from the incumbent lateral cap fraction '
        + '(the declaration line is matched VERBATIM, so the number cannot be re-typed as a '
        + 'literal), the two incumbent fan constants are the ones the seam applies, and the '
        + 'gene domain is the SIGNED [-1,1] that makes level-with/behind expressible.',
    },
    gPins: {
      pass: pins.pass, testCallers: pins.testCallers, ownTestCallers: pins.ownTestCallers,
      namedPins: pins.namedPins,
      semantics: 'THE PIN INVENTORY (contract §3), machine-checked: ZERO PRE-EXISTING tests call supportSpot '
        + '(so no test asserts a support point and none can be perturbed even when armed), and '
        + '(this stage\'s own pin file excluded and counted separately), and '
        + 'every named pin still exists verbatim — nothing was renegotiated to make this stage '
        + 'pass. The behavioural guards (interception ceiling, clump, offside) are CTB-T1\'s '
        + 'named guards, not T0 pins.',
    },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    dosedSmoke: {
      note: 'REPORTED, observation-only, ONE forced match at the 回撤 corner (depth -1, width -1), '
        + 'sampled every 5 ticks over bodies actually holding the SupportBallCarrier action. No '
        + 'control, no CI, no dose curve, no ANSWER — the SUPPORT-SUPPLY EXAM is CTB-T1\'s and '
        + 'these numbers adjudicate nothing.',
      seed: BLOCK + N,
      ...smoke,
    },
  },
  result: runA,
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free
 *  body, so a third party re-deriving it at ANY later commit gets the same hash.
 *  `head`, wall-clock and the artifact path ride the envelope, unhashed. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  wallMsContextOnly: wallMs,
  headContextOnly: head,
  artifactPathContextOnly: OUT_PATH,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (⚠ #197-M1): the git short-hash of the tree '
    + 'this run observed. Embedding it in the hashed body would make the receipt un-re-derivable '
    + 'at any later commit.',
}, null, 2)}\n`);

const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== CTB T0 SUPPORT-PLANE RECEIPTS — head ${head} (context only) — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-ZERO ${gZero ? 'PASS' : 'FAIL'}`
  + ` · G-BITE ${gBite ? 'PASS' : 'FAIL'} · G-RNG ${gRng ? 'PASS' : 'FAIL'}`
  + ` · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'} · G-FORK ${fork.pass ? 'PASS' : 'FAIL'}`
  + ` · G-TRACE ${trace.pass ? 'PASS' : 'FAIL'} · G-PINS ${pins.pass ? 'PASS' : 'FAIL'}`
  + ` · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`FROZEN LAW: depth span ${CTB_DEPTH_BIAS_SPAN} (= SUPPORT_LAT_CAP_FRAC, derived in code) · `
  + `fan pull ${SUPPORT_LAT_PULL} · cap frac ${SUPPORT_LAT_CAP_FRAC} · gene domain `
  + `[${CTB_GENE_MIN}, ${CTB_GENE_MAX}] · forced dose depth ${FORCED_DEPTH} width ${FORCED_WIDTH}`);
o(`CORNER GEOMETRY (${geometry.samples} samples):`);
for (const c of geometry.corners) {
  o(`  ${c.name.padEnd(8)} depth ${String(c.depth).padStart(2)} width ${String(c.width).padStart(2)}`
    + ` · ahead ${c.meanIncumbentAheadMetres} → ${c.meanAheadMetres} m`
    + ` · |lat| ${c.meanIncumbentLateralMetres} → ${c.meanLateralMetres} m`
    + ` · behind-ball ${c.incumbentBehindBallSamples} → ${c.behindBallSamples}`
    + ` · violations ${c.signViolations}/${c.magnitudeViolations}`);
}
o(`G-RNG seam: rng ${seamDraws.before} → ${seamDraws.after} over ${seamDraws.calls} armed dosed calls`);
o(`FORK TABLE: ${fork.forks} fork(s), ${fork.sites.length} src occurrence(s) total`);
o(`PIN INVENTORY: ${pins.testCallers} pre-existing supportSpot caller(s) in tests/** `
  + `(this stage's own file: ${pins.ownTestCallers}), `
  + `${pins.namedPins.filter((p) => p.found).length}/${pins.namedPins.length} named pins present`);
o(`REPORTED smoke: ${smoke.supportTicks} support ticks · moved ${smoke.movedTicks}`
  + ` · mean shift ${smoke.meanShiftMetres} m (max ${smoke.maxShiftMetres})`
  + ` · mean ahead ${smoke.meanAheadIncumbent} → ${smoke.meanAheadDosed} m`
  + ` · behind-ball ticks ${smoke.behindBallTicks}`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
