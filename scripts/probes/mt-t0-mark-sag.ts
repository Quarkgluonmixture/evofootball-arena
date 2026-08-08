/**
 * MT T0 — THE DORMANT ACCESS-TIME MARK-SAG SEAM: the receipts probe.
 *
 * Doc: docs/world-model/MT-T0-DORMANT-SEAM.md
 * Contract: docs/world-model/MARK-TIGHTNESS-CONTRACT.md §2 M-MT.1–5, §3 MT-T0
 * Rulings: #201.4 (the dispatch), #181.2 (THE STANDING RECEIPT RULE), #194/#196/#197
 *          (the evidence-reporting defect classes: no doc-typed hashes, state each
 *          gate's semantics EXACTLY — say what the arms DIFFER in, nothing
 *          commit-dependent inside the hashed body), #200 (the predicate red line).
 *
 * ⭐ #181.2: a HARD gate's evidence must be a COMMITTED, RECOMPUTABLE artifact.
 * Every hash below is computed IN THIS PROBE on the run that writes the JSON —
 * nothing is transcribed from a doc, and the doc quotes the artifact, never the
 * other way round. ⚠ #197-M1: `head` rides the UNHASHED envelope, so
 * `resultSha256` re-derives at an arbitrary commit. Re-run:
 *
 *     npx tsx scripts/probes/mt-t0-mark-sag.ts
 *          → docs/world-model/data/mt-t0-mark-sag.json
 *
 * The gates (all HARD unless marked REPORTED):
 *   G-IDENT   flag-off league byte-identity on THREE frozen league seeds, each
 *             recomputed here (2 seasons; the 1337 row IS the production
 *             fingerprint). These baselines were frozen from PRE-change code, so
 *             THIS is the RNG-stream receipt for the sim path: any draw added on
 *             the dormant path, conditional or not, would break them.
 *   G-FP      the 1337 row IS X-FP-PROD.
 *   G-OFF     per-match whole-run signature (rng state included): flag ABSENT ≡
 *             flag FALSE, in the production-shaped world AND the percept-armed
 *             world. ⚠ SEMANTICS, exactly: both arms execute the SAME flag-off
 *             code path, so this proves CONFIG EQUIVALENCE (absent ≡ false) and
 *             nothing about RNG streams. G-IDENT is the RNG-stream evidence.
 *   G-BORN    ARMED (`mtMarkSag: true`) with the gene ABSENT ≡ OFF. ⚠ Its arms DO
 *             differ in code path: armed ⇒ `mtSag` is true ⇒ the M-MT.2 branch in
 *             the MarkOpponent stance is ENTERED on every out-of-possession marker
 *             tick and `markSagWeight` evaluates to 0. So this gate proves the
 *             born-absent read is inert THROUGH the live branch.
 *   G-BITE    armed AND dosed (gene = 1 ⇒ the full frozen sag): every seed's world
 *             DIVERGES — the identity gates are not the identity of dead code —
 *             AND the sag is INSTRUMENT-VISIBLE in the stance: on slack-positive
 *             marker-ticks the sagged stance distance is strictly GREATER than the
 *             unmodulated `markDist`, and on NO tick is it smaller (the seam can
 *             only ADD distance — the Phase 30.5 / 31.6 revert guarantee).
 *   G-ASSIGN  the assignment boundary: (a) an `src/**` scan — the seam's
 *             identifiers appear in NO assignment file (`TeamBrain.ts`) at all;
 *             (b) lockstep absent-vs-forced on one seed: `team.marks` never
 *             diverges BEFORE body positions do, so the seam has no direct
 *             assignment channel.
 *   G-EVORNG  the evolution path draws ZERO extra rng with the opt-in off: 8
 *             generations of mutate+crossover reproduce a pre-gene
 *             re-implementation's genomes AND final rng state exactly — and the
 *             PM-T0 opt-in's own stream is unmoved (the new draws sit STRICTLY
 *             after the `defLaneConvergence` block).
 *   G-CONST   the frozen constants are the TRACED ones, matched VERBATIM against
 *             their source lines: MARK_SAG_BALL_SPEED === 16 === the engine's own
 *             pass flight-time constant (mechanics.ts `performPass`), MARK_SAG_MAX
 *             === 9 === the zonal engagement radius (TeamBrain.ts `assignMarks`) —
 *             plus the two stance-floor lines the G-BITE replica mirrors and the
 *             seam line itself, so neither the family nor the replica can drift.
 *   G-HYGIENE the flag is `?? false`, absent from a4World / A4_WORLD_FLAGS /
 *             a4MatchFlags, never env-armed; the gene is absent from GENE_KEYS.
 *   G-SEED    seed-block disjointness, proved in-probe.
 *   G-DET     the experiment core runs TWICE, byte-identical digests.
 *   REPORTED  the BOX census, in two layers: MAN-IN-BOX (not the claim — a man in our
 *             box with the ball at the far end legitimately gets slack) and DELIVERY
 *             (the ball is in that box too), which is the contract's "the box prices
 *             itself" claim made VISIBLE. Descriptive, one match, no control, no CI:
 *             it gates nothing.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { markSagMetres } from '../../src/ai/actionExecutor';
import {
  GENE_KEYS, MARK_SAG_BALL_SPEED, MARK_SAG_MAX, crossoverGenomes, markSagWeight, mutateGenome,
  randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { dist } from '../../src/utils/vec';

const OUT_PATH = 'docs/world-model/data/mt-t0-mark-sag.json';

/* ---- the frozen league-identity baselines (the PRE-CHANGE production hashes,
 * inherited verbatim from PM-T0 §GATES G-IDENT). This probe recomputes all three. */
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: FINGERPRINT_SEED, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ---- seeds: a FRESH block above everything the A4/O/PM-arc ledger has consumed -- */
const BLOCK = 12_312_000;
const N = Number(process.env.MTT0_N ?? 24);
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
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 smoke (two plumbing runs)', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 full battery', range: [12_311_300, 12_311_949] },
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
/** THE INSTRUMENT DOSE (MT-T1's vector family, used here only to make the seam BITE):
 *  the gene at 1 ⇒ the full frozen sag, `sagOf` capped at MARK_SAG_MAX = 9 m. */
const FORCED_DOSE = 1;
const matchOf = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(arm === 'plain' || arm === 'plainOff' ? {} : PERCEPT_FLAGS),
    ...(arm === 'off' || arm === 'plainOff' ? { mtMarkSag: false } : {}),
    ...(arm === 'bornArmed' || arm === 'forced' ? { mtMarkSag: true } : {}),
  });
  if (arm === 'forced') {
    for (const t of m.teams) {
      (t.info.genome as TacticalGenome).markSag = FORCED_DOSE;
      (t.baseGenome as TacticalGenome).markSag = FORCED_DOSE;
      (t.effGenome as TacticalGenome).markSag = FORCED_DOSE;
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

/* ========================================================================== */
/* G-BITE's second half + the REPORTED box census                             */
/* ========================================================================== */

/**
 * ⚠ STATED EXACTLY: `baseMarkDist` is a probe-side REPLICA of the two unmodulated
 * stance-floor lines in `actionExecutor.ts` (the Phase 30.5 floor and the Phase 31.6
 * distribution stand-off). It is a replica because the engine keeps `markDist` as a
 * block-local scalar and this slice deliberately adds no probe-only engine surface
 * (the #196-D6 discipline). The replica cannot drift silently: G-CONST matches BOTH
 * source lines VERBATIM, and the seam line itself, on every run.
 */
const baseMarkDist = (m: Match, side: 0 | 1, markIdx: number, aggression: number): number => {
  const opp = m.teams[1 - side];
  const mark = opp.players[markIdx];
  let d = m.ball.owner === mark ? 2.6 : 2.6 - aggression * 1.4;
  const oppGk = opp.goalkeeper;
  if (
    (m.restart?.kind === 'goalKick' && m.restart.side === mark.side)
    || ((oppGk.gkHoldTimer > 0 || oppGk.gkDistributing) && m.ball.owner === oppGk)
  ) d = Math.max(d, 2.6 - aggression * 0.6);
  return d;
};

/**
 * ONE forced match. At every sampled tick, for every body actually executing a
 * `MarkOpponent` stance out of possession, recompute the account and both stance
 * distances. Observation-only: it never runs inside an arm whose signature is
 * compared.
 */
const stanceCensus = (seed: number): {
  samples: number; slackPositive: number; slackNonPositive: number;
  saggedGtBase: number; tightened: number;
  meanBaseMarkDist: number; meanSaggedMarkDist: number;
  meanSagPositive: number; maxSag: number;
  boxSamples: number; boxZeroSag: number; boxMeanSag: number; boxMaxSag: number;
  boxMeanTBall: number;
  deliverySamples: number; deliveryZeroSag: number; deliveryMeanSag: number;
  deliveryMaxSag: number; deliveryMeanTBall: number;
} => {
  const m = matchOf(seed, 'forced');
  let samples = 0; let slackPositive = 0; let saggedGtBase = 0; let tightened = 0;
  let sumBase = 0; let sumSagged = 0; let sumSagPos = 0; let maxSag = 0;
  let boxSamples = 0; let boxZeroSag = 0; let boxSumSag = 0; let boxMaxSag = 0;
  let boxSumT = 0;
  let delSamples = 0; let delZeroSag = 0; let delSumSag = 0; let delMaxSag = 0; let delSumT = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % 15 !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      if (m.possessionSide === t.side) continue; // the seam is out-of-possession only
      const opp = m.teams[1 - t.side];
      for (const p of t.players) {
        if (p.sentOff || p.action.type !== 'MarkOpponent') continue;
        const markIdx = p.action.targetIdx;
        if (markIdx === undefined) continue;
        const mark = opp.players[markIdx];
        if (!mark) continue;
        const sag = markSagMetres(m.ball.pos, mark.pos, p.pos, p.topSpeed);
        const base = baseMarkDist(m, t.side as 0 | 1, markIdx, t.genome.markingAggression);
        const sagged = base + markSagWeight(t.genome) * sag;
        samples += 1;
        sumBase += base;
        sumSagged += sagged;
        if (sag > 0) { slackPositive += 1; sumSagPos += sag; }
        if (sagged > base + 1e-12) saggedGtBase += 1;
        if (sagged < base - 1e-12) tightened += 1;
        if (sag > maxSag) maxSag = sag;
        // the "box prices itself" read, in TWO honest layers (no invented threshold —
        // both use the engine's own box geometry):
        //   • MAN-IN-BOX: the mark stands inside the marker's own penalty box. This
        //     alone does NOT imply tight marking and is not claimed to: with the ball
        //     at the far end the flight time is long, slack is real, and the marker
        //     tucks in — the mechanism working exactly as designed.
        //   • DELIVERY (the contract's §7 claim): the BALL is in that box too, i.e.
        //     the delivery is actually there. Short flight ⇒ slack ≤ 0 ⇒ ZERO sag ⇒
        //     touch-tight, with no carve-out and no predicate.
        const inBox = (q: Readonly<{ x: number; y: number }>): boolean => Math.abs(q.y) < BOX_WIDTH / 2
          && t.localX(q.x) < -(HALF_L - BOX_DEPTH);
        const tBall = dist(m.ball.pos, mark.pos) / MARK_SAG_BALL_SPEED;
        if (inBox(mark.pos)) {
          boxSamples += 1;
          boxSumSag += sag;
          boxSumT += tBall;
          if (sag === 0) boxZeroSag += 1;
          if (sag > boxMaxSag) boxMaxSag = sag;
          if (inBox(m.ball.pos)) {
            delSamples += 1;
            delSumSag += sag;
            delSumT += tBall;
            if (sag === 0) delZeroSag += 1;
            if (sag > delMaxSag) delMaxSag = sag;
          }
        }
      }
    }
  }
  return {
    samples,
    slackPositive,
    slackNonPositive: samples - slackPositive,
    saggedGtBase,
    tightened,
    meanBaseMarkDist: round(sumBase / Math.max(samples, 1)),
    meanSaggedMarkDist: round(sumSagged / Math.max(samples, 1)),
    meanSagPositive: round(sumSagPos / Math.max(slackPositive, 1)),
    maxSag: round(maxSag),
    boxSamples,
    boxZeroSag,
    boxMeanSag: round(boxSumSag / Math.max(boxSamples, 1)),
    boxMaxSag: round(boxMaxSag),
    boxMeanTBall: round(boxSumT / Math.max(boxSamples, 1)),
    deliverySamples: delSamples,
    deliveryZeroSag: delZeroSag,
    deliveryMeanSag: round(delSumSag / Math.max(delSamples, 1)),
    deliveryMaxSag: round(delMaxSag),
    deliveryMeanTBall: round(delSumT / Math.max(delSamples, 1)),
  };
};

/* ========================================================================== */
/* G-ASSIGN — the assignment boundary                                          */
/* ========================================================================== */

const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full)
    : full.endsWith('.ts') ? [full] : [];
});

/** Every `src/**` line naming the seam, enumerated with file:line. */
const seamSites = (): { file: string; line: number; text: string }[] => {
  const out: { file: string; line: number; text: string }[] = [];
  for (const f of srcFiles('src')) {
    readFileSync(f, 'utf8').split('\n').forEach((text, i) => {
      if (/\bmarkSag|\bmtMarkSag|MARK_SAG_/.test(text)) {
        out.push({ file: f, line: i + 1, text: text.trim() });
      }
    });
  }
  return out;
};

/**
 * Lockstep absent-vs-forced on ONE seed: at every tick record whether `team.marks`
 * and whether body POSITIONS still agree. ⚠ SEMANTICS, exactly: the two arms DO
 * eventually diverge (that is G-BITE). The claim this gate makes is about ORDER —
 * assignment never diverges BEFORE the bodies do. If the seam had any direct
 * assignment channel, `marks` would differ at the first brain tick while every
 * position was still identical.
 */
const assignLockstep = (seed: number): {
  ticks: number; firstPosDiffTick: number; firstMarksDiffTick: number;
  marksLedDivergence: boolean; marksIdenticalTicks: number;
} => {
  const a = matchOf(seed, 'absent');
  const f = matchOf(seed, 'forced');
  const marksKey = (m: Match): string => m.teams
    .map((t) => [...t.marks.entries()].sort((x, y) => x[0] - y[0]).map((e) => e.join(':')).join(','))
    .join('|');
  const posKey = (m: Match): string => m.allPlayers
    .map((p) => `${p.pos.x},${p.pos.y}`).join(';');
  let ticks = 0;
  let firstPos = -1;
  let firstMarks = -1;
  let marksIdentical = 0;
  while (!a.finished && !f.finished) {
    a.step(DT); f.step(DT); ticks += 1;
    const mSame = marksKey(a) === marksKey(f);
    const pSame = posKey(a) === posKey(f);
    if (mSame) marksIdentical += 1;
    if (!pSame && firstPos < 0) firstPos = ticks;
    if (!mSame && firstMarks < 0) firstMarks = ticks;
    if (firstPos > 0 && firstMarks > 0) break;
  }
  return {
    ticks,
    firstPosDiffTick: firstPos,
    firstMarksDiffTick: firstMarks,
    // marks never LED: either they never diverged, or positions diverged first/at once
    marksLedDivergence: firstMarks > 0 && (firstPos < 0 || firstMarks < firstPos),
    marksIdenticalTicks: marksIdentical,
  };
};

/* ---- G-EVORNG: the evolution path draws ZERO extra with the opt-in off ------- */
const evoRng = (): {
  genomesIdentical: boolean; rngStateIdentical: boolean; geneStayedAbsent: boolean;
  optInDraws: boolean; pmStreamUnmoved: boolean; sActual: number; sHead: number;
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
  // the opt-in really draws (so the zero-draw claim is about the flag, not dead code)
  const rngOn = new Rng(515151);
  let gOn = randomGenome(new Rng(11));
  for (let gen = 0; gen < 8; gen++) {
    gOn = mutateGenome(gOn, rngOn, { rate: 0.45, scale: 0.14, evolveMarkSag: true });
  }
  // ⭐ THE ORDER CLAIM: the PM-T0 opt-in's OWN stream is unmoved by this slice — the
  // new draws sit STRICTLY AFTER the defLaneConvergence block. Arms: the shipped
  // mutate with `evolveDefLaneConvergence` ON (markSag opt-in OFF) vs a
  // re-implementation carrying GENE_KEYS + the defLaneConvergence draw and nothing else.
  const rngPmA = new Rng(707707);
  const rngPmH = new Rng(707707);
  let pmA = randomGenome(new Rng(33));
  let pmH: TacticalGenome = { ...pmA };
  for (let gen = 0; gen < 8; gen++) {
    pmA = mutateGenome(pmA, rngPmA, { rate: 0.45, scale: 0.14, evolveDefLaneConvergence: true });
    pmH = headMutate(pmH, rngPmH, 0.45, 0.14);
    if (rngPmH.chance(0.45)) {
      pmH.defLaneConvergence = clamp01((pmH.defLaneConvergence ?? 0) + rngPmH.gaussian() * 0.14);
    }
  }
  const pmStreamUnmoved = (rngPmA as unknown as { s: number }).s === (rngPmH as unknown as { s: number }).s
    && pmA.defLaneConvergence === pmH.defLaneConvergence
    && pmA.markSag === undefined;
  return {
    genomesIdentical: GENE_KEYS.every((k) => a0[k] === h0[k] && a1[k] === h1[k]),
    rngStateIdentical: sActual === sHead,
    geneStayedAbsent: a0.markSag === undefined && a1.markSag === undefined,
    optInDraws: gOn.markSag !== undefined,
    pmStreamUnmoved,
    sActual,
    sHead,
  };
};

/* ---- G-CONST: every frozen constant matched VERBATIM against its source ------ */
const TRACED = {
  ballSpeedLine: 'const flight = dist(passer.pos, mate.pos) / (16 * powerMul);',
  ballSpeedFile: 'src/sim/mechanics.ts',
  sagCapLine: 'if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;',
  sagCapFile: 'src/ai/TeamBrain.ts',
  tSelfLine: 'const t = dist(p.pos, land) / Math.max(p.topSpeed, 0.1);',
  tSelfFile: 'src/ai/TeamBrain.ts',
  floor305Line: 'let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;',
  standOff316Line: 'markDist = Math.max(markDist, 2.6 - g.markingAggression * 0.6);',
  seamLine: 'if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);',
  stanceFile: 'src/ai/actionExecutor.ts',
} as const;
const constGate = (): Record<string, boolean | number | string> => {
  const has = (file: string, line: string): boolean => readFileSync(file, 'utf8').includes(line);
  const rows = {
    ballSpeedLineFound: has(TRACED.ballSpeedFile, TRACED.ballSpeedLine),
    sagCapLineFound: has(TRACED.sagCapFile, TRACED.sagCapLine),
    tSelfLineFound: has(TRACED.tSelfFile, TRACED.tSelfLine),
    floor305LineFound: has(TRACED.stanceFile, TRACED.floor305Line),
    standOff316LineFound: has(TRACED.stanceFile, TRACED.standOff316Line),
    seamLineFound: has(TRACED.stanceFile, TRACED.seamLine),
    ballSpeedValue: MARK_SAG_BALL_SPEED === 16,
    sagCapValue: MARK_SAG_MAX === 9,
  };
  return {
    pass: Object.values(rows).every(Boolean),
    ...rows,
    ballSpeed: MARK_SAG_BALL_SPEED,
    sagCap: MARK_SAG_MAX,
    ...TRACED,
  };
};

/* ---- G-HYGIENE -------------------------------------------------------------- */
const hygiene = (): Record<string, boolean> => {
  const a4 = readFileSync('src/game/a4World.ts', 'utf8');
  const match = readFileSync('src/sim/Match.ts', 'utf8');
  return {
    defaultFalse: match.includes('this.mtMarkSag = cfg.mtMarkSag ?? false;'),
    absentFromA4World: !a4.includes('mtMarkSag') && !a4.includes('markSag'),
    notInGeneKeys: !(GENE_KEYS as readonly string[]).includes('markSag'),
    freshMatchOff: matchOf(1, 'absent').mtMarkSag === false,
    leagueMatchOff: (() => {
      const l = new League({ seed: 20260808 });
      return l.createMatch(l.nextFixture()!).mtMarkSag === false;
    })(),
    noSeamInAssignmentFile: !readFileSync('src/ai/TeamBrain.ts', 'utf8').includes('markSag'),
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

process.stderr.write(`=== MT T0 MARK-SAG RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [mt-t0] run A digest ${digestA}\n  [mt-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [mt-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [mt-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, gene absent, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [mt-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const stance = stanceCensus(BLOCK + N);
const lockstep = assignLockstep(BLOCK + N + 1);
const sites = seamSites();
const evo = evoRng();
const cst = constGate();
const hyg = hygiene();
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const seedDisjoint = (() => {
  const first = BLOCK;
  const last = BLOCK + N + 1; // + the stance census and the lockstep match
  const clashes = CONSUMED.filter((c) => !(last < c.range[0] || first > c.range[1]));
  return { first, last, consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
})();

const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gBite = runA.rows.every((r) => r.diverged)
  && stance.slackPositive > 0
  && stance.saggedGtBase === stance.slackPositive
  && stance.tightened === 0;
const assignFiles = [...new Set(sites.map((s) => s.file))].sort();
const gAssign = !sites.some((s) => s.file.endsWith('TeamBrain.ts'))
  && !lockstep.marksLedDivergence;
const gEvoRng = evo.genomesIdentical && evo.rngStateIdentical && evo.geneStayedAbsent
  && evo.optInDraws && evo.pmStreamUnmoved;
const gHygiene = Object.values(hyg).every(Boolean);

const gatesPass = gDet && gIdentPass && gOff && gBorn && gBite && gAssign && gEvoRng
  && (cst.pass as boolean) && gHygiene && seedDisjoint.pass;

const body = {
  stage: 'MT T0 — the dormant ACCESS-TIME MARK-SAG seam (`markSag` / `mtMarkSag`)',
  ruling: '#201.4 (the dispatch) + #181.2 (the standing receipt rule) + #194/#196/#197 '
    + '(evidence reporting) + #200 (no decline predicate, ever)',
  contract: 'docs/world-model/MARK-TIGHTNESS-CONTRACT.md',
  doc: 'docs/world-model/MT-T0-DORMANT-SEAM.md',
  frozenConstants: {
    ballSpeed: MARK_SAG_BALL_SPEED,
    sagCap: MARK_SAG_MAX,
    geneDomain: [0, 1],
    sagOfShape: 'slack = dist(ball,mark)/MARK_SAG_BALL_SPEED − dist(marker,mark)/max(topSpeed,0.1); '
      + 'sagOf = slack <= 0 ? 0 : min(slack · max(topSpeed,0.1), MARK_SAG_MAX). Monotone '
      + 'increasing in positive slack, exactly 0 at zero/negative slack, hard-capped. The metre '
      + 'value is the distance the marker RECOVERS in his spare time, so the shape introduces no '
      + 'conversion constant of its own.',
    derivation: 'markDist′ = markDist + clamp01(markSag) · sagOf(slack). 16 = the engine\'s own '
      + 'pass FLIGHT-TIME constant (src/sim/mechanics.ts performPass: `const flight = '
      + 'dist(passer.pos, mate.pos) / (16 * powerMul);`) — the family member chosen by QUESTION '
      + 'IDENTITY, the only one that answers "how long would the ball take to reach my man". '
      + '9 = the ZONAL ENGAGEMENT RADIUS in assignMarks (src/ai/TeamBrain.ts: `... '
      + 'dist(zones.get(p.index)!, threat.pos) > 9) continue;`), the contract\'s named neighbour. '
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
      semantics: 'THE ARMS DIFFER IN CODE PATH: armed ⇒ `mtSag` true ⇒ the M-MT.2 branch in the '
        + 'MarkOpponent stance is ENTERED on every out-of-possession marker tick and '
        + 'markSagWeight evaluates to 0 (gene born absent). Byte-identity to OFF therefore proves '
        + 'the born-absent read is inert THROUGH the live branch.',
    },
    gBite: {
      pass: gBite,
      divergedSeeds: runA.rows.filter((r) => r.diverged).length,
      seeds: N,
      stanceUnderForce: {
        seed: BLOCK + N,
        ...stance,
        semantics: 'at the frozen dose the stance sag is INSTRUMENT-VISIBLE: on every '
          + 'slack-positive marker-tick the sagged stance distance strictly EXCEEDS the '
          + 'unmodulated markDist, and on ZERO ticks is it smaller (the seam only ADDS distance — '
          + 'the Phase 30.5 / 31.6 revert guarantee). ⚠ The unmodulated markDist is a probe-side '
          + 'REPLICA of the two stance-floor lines (the engine keeps it block-local and this '
          + 'slice adds no probe-only engine surface); G-CONST matches both source lines and the '
          + 'seam line VERBATIM so the replica cannot drift.',
      },
    },
    gAssign: {
      pass: gAssign,
      semantics: 'TWO independent arms, stated exactly. (a) SOURCE: the seam\'s identifiers are '
        + 'scanned across src/** — ZERO occurrences in TeamBrain.ts, the file that owns '
        + 'assignMarks/team.marks, so the assignment path cannot read the seam at all. (b) ORDER '
        + '(lockstep absent vs forced, one seed): the two worlds DO diverge (that is G-BITE); the '
        + 'claim is that `team.marks` never diverges BEFORE body positions do. A direct '
        + 'assignment channel would show marks differing at the first brain tick with every '
        + 'position still identical.',
      seamSiteFiles: assignFiles,
      seamSiteCount: sites.length,
      sites,
      lockstep,
    },
    gEvoRng: {
      pass: gEvoRng,
      semantics: 'THE ARMS DIFFER: the actual shipped mutate/crossover with the opt-in OFF vs a '
        + 'faithful PRE-GENE re-implementation (GENE_KEYS only). Identical genomes AND identical '
        + 'final rng state ⇒ zero extra draws; `optInDraws` shows the opt-in path is live; '
        + '`pmStreamUnmoved` shows the PM-T0 opt-in\'s OWN stream is unmoved (the new draws sit '
        + 'STRICTLY after the defLaneConvergence block).',
      ...evo,
    },
    gConst: cst,
    gHygiene: { pass: gHygiene, ...hyg },
    seedDisjoint,
    allPass: gatesPass,
  },
  reported: {
    boxCensus: {
      note: 'REPORTED, observation-only, ONE forced match at the frozen dose, sampled every 15 '
        + 'ticks over every body actually executing a MarkOpponent stance out of possession. No '
        + 'control, no CI, no dose curve — it gates NOTHING. It exists to make the contract\'s '
        + '"the box prices itself" claim (§7 REALITY) VISIBLE rather than asserted: when the man '
        + 'stands inside the defending box the flight time is short, so slack is non-positive and '
        + 'the sag is zero — tight marking, with no carve-out and no predicate anywhere.',
      seed: BLOCK + N,
      samples: stance.samples,
      slackPositive: stance.slackPositive,
      slackNonPositive: stance.slackNonPositive,
      meanSagOnSlackPositiveTicks: stance.meanSagPositive,
      maxSag: stance.maxSag,
      manInBox: {
        samples: stance.boxSamples,
        zeroSagSamples: stance.boxZeroSag,
        meanSag: stance.boxMeanSag,
        maxSag: stance.boxMaxSag,
        meanTBallSeconds: stance.boxMeanTBall,
        note: 'the MAN is in the defending box — this layer is NOT the claim and is NOT '
          + 'tight by itself: with the ball at the far end the flight time is long, the slack '
          + 'is real and the marker tucks in. Published so the claim below is not read wider '
          + 'than it is.',
      },
      delivery: {
        samples: stance.deliverySamples,
        zeroSagSamples: stance.deliveryZeroSag,
        meanSag: stance.deliveryMeanSag,
        maxSag: stance.deliveryMaxSag,
        meanTBallSeconds: stance.deliveryMeanTBall,
        note: 'THE CONTRACT §7 CLAIM: the BALL is in that box too — the delivery is actually '
          + 'there. Short flight ⇒ slack ≤ 0 ⇒ zero sag ⇒ touch-tight, with no carve-out and no '
          + 'predicate. Both layers use the engine\'s own box geometry; no threshold is invented.',
      },
    },
  },
  result: runA,
};
/** ⭐ #181.2 + ⚠ CORRECTION (#197-M1): `resultSha256` hashes ONLY the timing-free AND
 *  commit-free body, so a third party re-deriving it at ANY later commit gets the same
 *  hash. `head` and `wallMs` ride the envelope, unhashed. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  wallMsContextOnly: wallMs,
  headContextOnly: head,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (⚠ #197-M1): the git short-hash of the tree '
    + 'this run observed. Embedding it in the hashed body would make the receipt un-re-derivable '
    + 'at any later commit.',
}, null, 2)}\n`);

const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== MT T0 MARK-SAG RECEIPTS — head ${head} (context only) — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-BITE ${gBite ? 'PASS' : 'FAIL'}`
  + ` · G-ASSIGN ${gAssign ? 'PASS' : 'FAIL'} · G-EVORNG ${gEvoRng ? 'PASS' : 'FAIL'}`
  + ` · G-CONST ${cst.pass ? 'PASS' : 'FAIL'} · G-HYGIENE ${gHygiene ? 'PASS' : 'FAIL'}`
  + ` · G-SEED ${seedDisjoint.pass ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`FROZEN: t_ball speed ${MARK_SAG_BALL_SPEED} m/s (mechanics.ts performPass flight) · sag cap `
  + `${MARK_SAG_MAX} m (TeamBrain.ts zonal engagement radius) · forced dose ${FORCED_DOSE}`);
o(`STANCE UNDER FORCE: ${stance.samples} marker-ticks · slack>0 ${stance.slackPositive}`
  + ` · sagged>base ${stance.saggedGtBase} · tightened ${stance.tightened}`
  + ` · mean markDist ${stance.meanBaseMarkDist} → ${stance.meanSaggedMarkDist} m · max sag ${stance.maxSag} m`);
o(`REPORTED box census — MAN-IN-BOX ${stance.boxSamples} ticks · zero-sag ${stance.boxZeroSag}`
  + ` · mean sag ${stance.boxMeanSag} m · mean t_ball ${stance.boxMeanTBall} s`);
o(`REPORTED box census — DELIVERY (ball in that box too) ${stance.deliverySamples} ticks · zero-sag `
  + `${stance.deliveryZeroSag} · mean sag ${stance.deliveryMeanSag} m · max ${stance.deliveryMaxSag} m`
  + ` · mean t_ball ${stance.deliveryMeanTBall} s`);
o(`ASSIGNMENT BOUNDARY: seam sites ${sites.length} in ${assignFiles.length} file(s), TeamBrain.ts `
  + `${sites.some((s) => s.file.endsWith('TeamBrain.ts')) ? '*** PRESENT ***' : 'clean'}`
  + ` · first pos diff tick ${lockstep.firstPosDiffTick} · first marks diff tick ${lockstep.firstMarksDiffTick}`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
