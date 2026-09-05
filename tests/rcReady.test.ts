import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { Player, TURN_RATE } from '../src/sim/Player';
import { runHeadless } from '../src/sim/simRunner';
import { DT, STAMINA_DRAIN, STAMINA_RECOVERY } from '../src/sim/constants';
import { BF_DEPTH, facingCosine, facingFactor } from '../src/sim/bodyFacing';
import {
  GENE_KEYS, randomGenome, rcAnticipationWeightOf, type TacticalGenome,
} from '../src/evolution/genome';
import { randomPlayer, randomSquad } from '../src/evolution/playerGenome';
import {
  DEFAULT_POLICY, TEAM_SIZE, type Side, type TeamInfo,
} from '../src/sim/types';
import { executeAction } from '../src/ai/actionExecutor';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { alignmentRank as alignmentRank3a } from '../src/ai/receiverAnticipationSeat';
import {
  RC_READY_ANG_EDGES, RC_READY_BELIEF_E, RC_READY_N_ANG, RC_READY_N_CELL, RC_READY_N_RANK,
  RC_READY_N_SPEED, RC_READY_SPEED_EDGES, RC_READY_TICKS_E, RC_READY_WINDUP_TARGET_ME_E,
  alignmentRank, rcAngSpeedBin, rcCellIndex, rcRankSlot, rcReadyBelief, rcReadyCell, rcSpeedBin,
} from '../src/ai/receiverReadySeat';

/**
 * ⭐⭐ RC T0b — THE READY DORMANT SEAM (docs/world-model/RC-T0B-READY-SEAM.md; ruling #378
 * item 6; contracts RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3b and
 * BF-BODY-FACING-CONTRACT.md M-BF.4) — THE SEAM'S PERMANENT PIN SUITE, in the house form
 * (`rcAnticipate.test.ts` / `bfFacingCost.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * 「看见自己人拿球正转向我,先把身子打开对着他」 — armed, a receiver may open his BODY toward
 * the carrier before the ball is struck, while his LEGS keep the plan the menu gave them.
 *
 * ⭐⭐ THE FORM OF RECORD IS THE FIX'S (ruling #379 item 3, landed by item 5): ⭐ THE TRADE IS
 * THE DECISION. 「转不转身,不该和"跑不跑"抢同一个名额;该和"转过去会慢多少"比」. The receiver
 * faces the carrier iff BENEFIT > COST, STRICTLY, where BENEFIT = `w · belief · s_receive`
 * (the brain's, at his own decision cadence) and COST = `(1 − f(φ)) · S_move` (the executor's,
 * every frame) — BF's own `facingFactor` at the body's own `facingDepth`, at φ between this
 * frame's intended direction and the bearing to the carrier, times the movement plan's own
 * priority off the record. ⛔ NO NEW CONSTANT, and ⛔ THE MOVEMENT MENU IS UNTOUCHED — the
 * seam pushes NOTHING into `cands` and splices nothing back out.
 *
 * ⚠ SUPERSEDED: the #378 item 6(iv) form put the facing decision INSIDE the movement argmax,
 * where G-REACH measured that it could never win (ceiling `max(belief) · 1.2` BELOW
 * `DEFAULT_POLICY.formationBase`). G-REACH is REPLACED by **G-TRADE-DECISION** below, and the
 * walk pins now run on the DEFAULT vector — world 12 exactly as composed, no policy override.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,002,600–699 (canon,
 * VERBATIM: "verifier scratch walks use the stage's own consumed band or the out-of-band
 * scratch range (≥ 900,000,000) — never the next virgin block"; home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — RC-T0b's own band, 900,002,600–699. */
const SEED_A = 900_002_600;
const SEED_B = 900_002_601;
const SEED_C = 900_002_602;
const SEED_D = 900_002_603;

/** RC-C0b's artifact — the belief table's ONE source, with BOTH hashes of record (#378.6). */
const RC_ARTIFACT_PATH = 'docs/world-model/data/rc-c0b-detector-census.json';
const RC_ARTIFACT_SHA =
  'a07d5692879f98173b7b470ed47b704525dd5236ec6573026b8f334d95bd0f83';
const RC_ARTIFACT_BODY_SHA =
  '37cdff0b108e24ea0517882e089387c0a4e2124b221c0984c0b7d96606edf41b';

/** 3a's file, which this stage may not touch — its bytes at the dispatch HEAD (99125a4). */
const PC_LATENCY_SHA =
  '0abc5068d4545b53ce5dda9ba83d1fdacba45ae5328163623a31e4cd166e0c91';

const W12 = 12 as const;
const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>);
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

/**
 * ⭐⭐ NO POLICY OVERRIDE ANYWHERE IN THIS SUITE (ruling #379 item 4(ii)): every walk below
 * plays world 12 EXACTLY AS COMPOSED, on `DEFAULT_POLICY`'s own weights. The seam's own
 * `rolePolicies` fixture is GONE with the form that needed it.
 */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  } as TeamInfo;
};

interface Arm {
  /** arm THIS slice's door */
  ready?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  readyExplicitFalse?: boolean;
  /** arm 3a's door beside it — 3b is switchable APART from 3a */
  anticipate?: boolean;
  /** arm the BF facing price (M-BF.4's coupling) */
  bf?: boolean;
  /** the anticipation gene, written on all three genome views of BOTH teams (#196.3-D6) */
  weight?: number;
  /** write the gene on ONE side only */
  weightSideZeroOnly?: number;
  /** world 12's composition — the form the user plays */
  world?: 12;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
    ...base,
    ...(a.ready === true ? { rcReady: true } : {}),
    ...(a.readyExplicitFalse === true ? { rcReady: false } : {}),
    ...(a.anticipate === true ? { rcAnticipate: true } : {}),
    ...(a.bf === true ? { bfFacingCost: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) {
    armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  }
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (a.weight !== undefined) g.rcAnticipationWeight = a.weight;
    }
  }
  if (a.weightSideZeroOnly !== undefined) {
    const t = m.teams[0];
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      g.rcAnticipationWeight = a.weightSideZeroOnly;
    }
  }
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via RA-T0 / RC-T0 / BF-T0). */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
      for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
    }
  }
  const r = m.getResult();
  return createHash('sha256').update(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)),
    score: r.score, stats: r.stats, events: r.events.length, ticks,
  })).digest('hex');
};
const digest = (xs: string[]): string =>
  createHash('sha256').update(xs.join('|')).digest('hex');

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const readySource = src('ai/receiverReadySeat.ts');
const brainSource = src('ai/PlayerBrain.ts');
const execSource = src('ai/actionExecutor.ts');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const typesSource = src('sim/types.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/** the artifact, parsed once — the ONE source of every belief number in this suite */
interface CellBins { cells: number; E: number[]; D: number[] }
const artifactBytes = readFileSync(RC_ARTIFACT_PATH);
const artifact = JSON.parse(artifactBytes.toString('utf8')) as {
  bins: { cellTicks: CellBins; cellWindup: CellBins; cellWindupTargetMe: CellBins };
  familyF: { cells: number[] };
  cellDefinition: Record<string, unknown>;
  hashedBodySha256: string;
};

/**
 * ⭐ A WALK'S READY RECEIPTS, collected from PUBLIC state only: the action records that carry
 * the overlay INPUTS (`readyFaceGid` + `readyBenefit`), and the ticks on which the face the
 * executor actually applied — the trade's VERDICT — really is the carrier's position AS IT
 * STOOD WHEN THE BODY DECIDED (the executor writes it from the pre-step pos; physics then
 * moves the carrier, so a post-step comparison must use the pre-step snapshot).
 *
 * ⭐⭐ THE TWIN, WHEN GIVEN, IS THE SHUT ONE ON THE SAME SEED. Until the FIRST face is applied
 * the two worlds are identical (an overlay field moves no byte), so on that tick the twin is
 * the exact counterfactual: G-MOVEMENT-KEPT compares the MENU there — `p.action.type` and the
 * displayed `p.action.scores` — and checks that the shut body wrote NO face at all and so
 * turns with his motion under the shipped integrator.
 */
interface ReadyWalk {
  overlayTicks: number;
  noOverlayTicks: number;
  benefits: number[];
  faceTicks: number;
  turnedToward: number;
  heldTicks: number;
  heldFaceIsTheHold: number;
  firstFaceTick: number;
  firstFaceGid: number;
  typeLeaks: number;
  menuMatchedAtFirstFace: boolean | null;
  twinFaceWasNullAtFirstFace: boolean | null;
  twinFollowedMotionAtFirstFace: boolean | null;
}
const walkReady = (m: Match, twin: Match | null = null): ReadyWalk => {
  const out: ReadyWalk = {
    overlayTicks: 0, noOverlayTicks: 0, benefits: [], faceTicks: 0, turnedToward: 0, heldTicks: 0,
    heldFaceIsTheHold: 0, firstFaceTick: -1, firstFaceGid: -1, typeLeaks: 0,
    menuMatchedAtFirstFace: null, twinFaceWasNullAtFirstFace: null,
    twinFollowedMotionAtFirstFace: null,
  };
  let tick = 0;
  while (!m.finished) {
    const pre = m.allPlayers.map((p) => ({
      x: p.pos.x, y: p.pos.y, hx: p.heading.x, hy: p.heading.y,
    }));
    const twinPre = twin === null ? null : twin.allPlayers.map((p) => ({
      hx: p.heading.x, hy: p.heading.y,
    }));
    m.step(DT);
    if (twin !== null && !twin.finished) twin.step(DT);
    tick++;
    for (const p of m.allPlayers) {
      if ((p.action.type as string) === 'AnticipatePass') out.typeLeaks += 1;
      const gid = p.action.readyFaceGid;
      if (gid === undefined) {
        // ⛔ THE TWO FIELDS TRAVEL TOGETHER OR NOT AT ALL
        expect(p.action.readyBenefit).toBeUndefined();
        out.noOverlayTicks += 1;
        continue;
      }
      out.overlayTicks += 1;
      out.benefits.push(p.action.readyBenefit as number);
      const hold = m.pcLatency === null ? null : m.pcLatency.holdFor(p.gid, m.simTick);
      if (hold !== null) {
        out.heldTicks += 1;
        const f = hold.face;
        if ((f === null && p.faceTarget === null)
          || (f !== null && p.faceTarget !== null
            && p.faceTarget.x === f.x && p.faceTarget.y === f.y)) {
          out.heldFaceIsTheHold += 1;
        }
        continue;
      }
      const c = pre[gid];
      if (p.faceTarget === null || p.faceTarget.x !== c.x || p.faceTarget.y !== c.y) continue;
      out.faceTicks += 1;
      if (out.firstFaceTick < 0) {
        out.firstFaceTick = tick;
        out.firstFaceGid = p.gid;
        if (twin !== null && twinPre !== null) {
          const q = twin.allPlayers[p.gid];
          // ⭐⭐ G-MOVEMENT-KEPT: the MENU is byte-identical to the shut twin's
          out.menuMatchedAtFirstFace = q.action.type === p.action.type
            && JSON.stringify(q.action.scores) === JSON.stringify(p.action.scores);
          // ⭐ and the shut twin wrote NO face, so his heading follows his motion
          out.twinFaceWasNullAtFirstFace = q.faceTarget === null;
          const sp = Math.hypot(q.vel.x, q.vel.y);
          const t0 = twinPre[p.gid];
          out.twinFollowedMotionAtFirstFace = sp <= 0.5
            || (q.heading.x * (q.vel.x / sp) + q.heading.y * (q.vel.y / sp))
              >= (t0.hx * (q.vel.x / sp) + t0.hy * (q.vel.y / sp));
        }
      }
      const b = pre[p.gid];
      const wx = c.x - b.x;
      const wy = c.y - b.y;
      const wl = Math.hypot(wx, wy) || 1;
      const before = b.hx * (wx / wl) + b.hy * (wy / wl);
      const after = p.heading.x * (wx / wl) + p.heading.y * (wy / wl);
      if (after > before) out.turnedToward += 1;
    }
  }
  return out;
};

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('RC T0b — the READY limb is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset, no env and no default names the flag', () => {
    expect(matchSource).toContain('this.rcReady = cfg.rcReady ?? false;');
    // ⛔ the entry layer names NEITHER the flag nor the candidate: world 13 is a later
    // stage's business (#378 item 6)
    expect(a4Source).not.toContain('rcReady');
    expect(a4Source).not.toContain('AnticipatePass');
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      const flags = a4MatchFlags(v as never) as Record<string, unknown>;
      expect(flags.rcReady).toBeUndefined();
      expect(JSON.stringify(flags)).not.toContain('rcReady');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.rcReady).toBe(false);
    expect(matchOf(SEED_A).rcReady).toBe(false);
    expect(matchOf(SEED_A, { world: W12 }).rcReady).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).rcReady).toBe(false);
    // and the flag-gated memory is NOT EVEN BORN in any of them
    for (const m of [bare, matchOf(SEED_A), matchOf(SEED_A, { world: W12 }),
      league.createMatch(league.nextFixture()!)]) {
      expect(m.rcReadyPrevHeading(0)).toBeNull();
      for (const t of m.teams) for (const p of t.players) {
        expect(p.action.readyFaceGid).toBeUndefined();
        expect(p.action.readyBenefit).toBeUndefined();
      }
    }
    // no env / bundle door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/receiverReadySeat.ts',
      'src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts', 'src/sim/types.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/rcReady|readyFaceGid|readyBenefit/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
    // ⛔ the ActionType UNION IS UNTOUCHED, and after the fix there is no facing candidate at
    // all: `AnticipatePass` names nothing anywhere in `src/**` (the seam map counts it at 0)
    const union = typesSource.slice(
      typesSource.indexOf('export type ActionType ='),
      typesSource.indexOf('/** One scored candidate from utility evaluation'),
    );
    expect(union).not.toContain('AnticipatePass');
    expect(brainSource).not.toContain('AnticipatePass');
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League, nor the overlay a result', () => {
    const league = new League({ seed: SEED_A });
    league.matchFlags = { rcReady: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('rcReady');
    // the gene is 3a's, still BORN ABSENT and still outside GENE_KEYS
    expect((GENE_KEYS as readonly string[])).not.toContain('rcAnticipationWeight');
    const g = randomGenome(new Rng(SEED_A));
    expect(rcAnticipationWeightOf(g)).toBeNull();
    const m = matchOf(SEED_A, { world: W12, ready: true, weight: 1 });
    for (let i = 0; i < 600; i++) m.step(DT);
    expect(JSON.stringify(m.getResult())).not.toContain('readyFaceGid');
    expect(JSON.stringify(m.getResult())).not.toContain('readyBenefit');
  }, 60_000);

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE — the bare world AND world 12\'s composition × 2 seeds', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W12] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, readyExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell
  }, 120_000);

  it('⭐⭐ G-BORN: armed with the gene ABSENT ≡ shut, byte for byte (no candidate is built)', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const shut = signatureOf(matchOf(seed, { world: W12 }));
      const armed = signatureOf(matchOf(seed, { world: W12, ready: true }));
      expect(armed).toBe(shut);
    }
    const live = matchOf(SEED_A, { world: W12, ready: true });
    expect(live.rcReady).toBe(true);
    for (const t of live.teams) expect(rcAnticipationWeightOf(t.effGenome)).toBeNull();
    // structurally: the absent gene means no overlay was ever written
    const walk = walkReady(live);
    expect(walk.overlayTicks).toBe(0);
  }, 120_000);

  it('⭐⭐ G-ZERO: armed with the gene PRESENT AT ZERO ≡ shut, byte for byte', () => {
    // ⚠ THE COMPARATOR CARRIES THE SAME GENE (the GC-T0 lesson): both arms hold the gene at 0
    // so the ONLY difference is the flag. At w = 0 the score is 0 ⇒ nothing is ever pushed.
    const shut: string[] = [];
    const armedZero: string[] = [];
    for (const seed of [SEED_A, SEED_B]) {
      shut.push(signatureOf(matchOf(seed, { world: W12, weight: 0 })));
      armedZero.push(signatureOf(
        matchOf(seed, { world: W12, weight: 0, ready: true }),
      ));
    }
    expect(armedZero).toEqual(shut);
    expect(digest(armedZero)).toBe(digest(shut));
    const live = matchOf(SEED_C, { world: W12, weight: 0, ready: true });
    expect(walkReady(live).overlayTicks).toBe(0);
  }, 120_000);

  it('⭐⭐ G-INERT: armed at w = 1 with nothing to believe, the menu is byte-identical', () => {
    // (a) NO SAME-SIDE CARRIER: the bare world's own kickoff/restart phases have no owner, and
    // more sharply — a body whose cell has belief 0 pushes nothing. Both are proved on the
    // SEAT's own arithmetic, which is the thing the menu reads.
    const zeroCells = RC_READY_BELIEF_E
      .map((b, i) => ({ b, i })).filter((c) => c.b === 0).map((c) => c.i);
    expect(zeroCells.length).toBeGreaterThan(0);
    for (const c of zeroCells) expect(rcReadyBelief(c)).toBe(0);
    // no cell at all (a degenerate heading, or no rank) ⇒ 0, so `w · belief` is 0 and the
    // push is skipped
    expect(rcReadyBelief(-1)).toBe(0);
    expect(rcReadyCell(3, 0, 0, 1, 0, 1)).toBe(-1); // degenerate PREVIOUS heading
    expect(rcReadyCell(3, 1, 0, 0, 0, 1)).toBe(-1); // degenerate CURRENT heading
    expect(rcReadyCell(3, 1, 0, 0, 1, 0)).toBe(-1); // no rank ("rank 0", no cue)
    // (b) THE LIVE PROOF, RE-STATED FOR THE FIX (ruling #379 item 5(iv)). ⚠ "Nothing to
    // believe" is a PER-TICK condition, not a world: the belief table is a fixed measurement
    // and does not depend on the world being played, so the world-level shut byte is pinned
    // where it is actually true — G-BORN (the gene absent) and G-ZERO (the gene at 0) above,
    // both pooled digests. What THIS gate pins is that the fork really does ABSTAIN: on an
    // armed walk at w = 1 there are ticks with NO overlay at all, and NO record ever carries
    // one of the two fields without the other (asserted inside `walkReady`).
    const w = walkReady(matchOf(SEED_A, { world: W12, ready: true, weight: 1 }));
    expect(w.noOverlayTicks).toBeGreaterThan(0);
    expect(w.overlayTicks).toBeGreaterThan(0);
  }, 120_000);
});

/* ========================================================================== */
/* G-TABLE — RC-C0b's OWN MEASUREMENT, RE-DERIVED FROM THE ARTIFACT ON DISK   */
/* ========================================================================== */

describe('RC T0b §G-TABLE — the belief is the census\'s, re-derived off disk', () => {
  it('⭐⭐ all 120 quotients re-derive BIT-EXACTLY, with BOTH hashes of record', () => {
    // the FILE bytes
    expect(createHash('sha256').update(artifactBytes).digest('hex')).toBe(RC_ARTIFACT_SHA);
    // and the BODY hash the artifact publishes about itself (the NON-body receipt form,
    // canon: "the body hash is computed after every body key is assigned, and a NON-body
    // receipt field records that the hash reproduces from the written file")
    expect(artifact.hashedBodySha256).toBe(RC_ARTIFACT_BODY_SHA);
    const ticks = artifact.bins.cellTicks.E;
    const targetMe = artifact.bins.cellWindupTargetMe.E;
    const windup = artifact.bins.cellWindup.E;
    expect(artifact.bins.cellTicks.cells).toBe(RC_READY_N_CELL);
    expect(RC_READY_N_CELL).toBe(120);
    // the transcription IS the artifact's own integers
    expect([...RC_READY_TICKS_E]).toEqual(ticks);
    expect([...RC_READY_WINDUP_TARGET_ME_E]).toEqual(targetMe);
    for (const n of [...RC_READY_TICKS_E, ...RC_READY_WINDUP_TARGET_ME_E]) {
      expect(Number.isInteger(n)).toBe(true);
    }
    // ⭐ BIT-EXACT quotients (`toBe`, not `toBeCloseTo`)
    for (let c = 0; c < RC_READY_N_CELL; c++) {
      const want = ticks[c] === 0 ? 0 : targetMe[c] / ticks[c];
      expect(RC_READY_BELIEF_E[c]).toBe(want);
      expect(rcReadyBelief(c)).toBe(want);
    }
    // ⭐⭐ THE DERIVATION OF #373's TWO TABLES: their product over a SHARED cell IS the stored
    // joint — the `cellWindup` arm cancels exactly, which is why the seat stores the two ends.
    for (let c = 0; c < RC_READY_N_CELL; c++) {
      if (windup[c] === 0) continue;
      expect((windup[c] / ticks[c]) * (targetMe[c] / windup[c]))
        .toBeCloseTo(RC_READY_BELIEF_E[c], 15);
    }
    // ⭐ THE ZERO-DENOMINATOR RULE, and NOTHING MORE: the only cells with no measurement are
    // the rank ≥ 6 slots, which 6v6 can never fill — so no populated cell is suppressed, and
    // there is NO count floor (#378 item 6(ii)).
    const empty = ticks.map((n, i) => ({ n, i })).filter((c) => c.n === 0).map((c) => c.i);
    expect(empty).toEqual(
      Array.from({ length: RC_READY_N_SPEED * RC_READY_N_ANG },
        (_, k) => k * RC_READY_N_RANK + (RC_READY_N_RANK - 1)),
    );
    expect(Math.min(...ticks.filter((n) => n > 0))).toBeGreaterThan(1000);
    // ⭐ THE SHAPE OF THE TABLE, so the stage doc quotes no second copy of it
    expect(RC_READY_BELIEF_E.filter((b) => b > 0).length).toBe(72);
    expect(RC_READY_BELIEF_E.filter((b) => b === 0).length).toBe(48);
    expect(ticks.filter((n) => n > 0).length).toBe(100);
    expect(Math.max(...RC_READY_BELIEF_E)).toBe(targetMe[90] / ticks[90]);
    expect(targetMe[90]).toBe(32231);
    expect(ticks[90]).toBe(134660);
    // outside the table there is no belief
    for (const c of [-1, -5, 120, 999, 1.5, Number.NaN]) expect(rcReadyBelief(c)).toBe(0);
  });

  it('⭐ THE DOSED ARM re-derives too — published beside as the book-independence check', () => {
    const tE = artifact.bins.cellTicks.E;
    const mE = artifact.bins.cellWindupTargetMe.E;
    const tD = artifact.bins.cellTicks.D;
    const mD = artifact.bins.cellWindupTargetMe.D;
    expect(tD.length).toBe(RC_READY_N_CELL);
    // the two arms' base rates, DERIVED (the stage doc quotes these two and nothing else)
    const baseE = mE.reduce((a, b) => a + b, 0) / tE.reduce((a, b) => a + b, 0);
    const baseD = mD.reduce((a, b) => a + b, 0) / tD.reduce((a, b) => a + b, 0);
    expect(baseE.toFixed(6)).toBe('0.020282');
    expect(baseD.toFixed(6)).toBe('0.020750');
    expect(Math.abs(baseD - baseE)).toBeLessThan(0.005); // the same world, a different book
    // ⛔ THE DOSED ARM IS NOT IN THE SHIPPED MODULE — it is published, never used
    expect(readySource).not.toContain('cellWindupTargetMe.D');
    expect(readySource).not.toContain('RC_READY_TICKS_D');
    // and the two arms AGREE cell by cell on which cells carry a belief at all
    let agree = 0;
    for (let c = 0; c < RC_READY_N_CELL; c++) {
      if ((mE[c] > 0) === (mD[c] > 0)) agree += 1;
    }
    expect(agree).toBeGreaterThanOrEqual(110);
  });
});

/* ========================================================================== */
/* G-CELL — RC-C0b §P.B's arithmetic, and the ORDERING confirmed by family F  */
/* ========================================================================== */

describe('RC T0b §G-CELL — the cell is RC-C0b\'s, on fixtures', () => {
  it('⭐⭐ the bin edges and the ordering are the census\'s (familyF reproduced)', () => {
    // the edges are the artifact's own, not re-typed decimals
    const def = artifact.cellDefinition as {
      speedBins: { edges: number[]; bins: number };
      angSpeedBins: { edges: number[]; bins: number };
      cellIndex: string;
    };
    expect([...RC_READY_SPEED_EDGES]).toEqual(def.speedBins.edges);
    expect([...RC_READY_ANG_EDGES]).toEqual(def.angSpeedBins.edges);
    expect(RC_READY_N_SPEED).toBe(def.speedBins.bins);
    expect(RC_READY_N_ANG).toBe(def.angSpeedBins.bins);
    expect(def.cellIndex).toContain('(speedBin · NANG + angBin) · NRANK + (rank − 1)');
    // ⭐⭐ THE ORDERING, CONFIRMED AND NOT GUESSED: family F = the top angular-speed bin ∧
    // rank 1, across the five speed bins, REPRODUCED from the index formula
    expect([0, 1, 2, 3, 4].map((s) => rcCellIndex(s, RC_READY_N_ANG - 1, 0)))
      .toEqual(artifact.familyF.cells);
    expect(artifact.familyF.cells).toEqual([18, 42, 66, 90, 114]);
    expect(rcCellIndex(RC_READY_N_SPEED - 1, RC_READY_N_ANG - 1, RC_READY_N_RANK - 1))
      .toBe(RC_READY_N_CELL - 1);
    expect(rcCellIndex(0, 0, 0)).toBe(0);
  });

  it('⭐ the SPEED bins, the ANGULAR-SPEED bins and the RANK slots — the census\'s fixtures', () => {
    // RC-C0b's own `speedBin.*` fixture table, byte for byte
    expect(rcSpeedBin(0)).toBe(0);
    expect(rcSpeedBin(0.999)).toBe(0);
    expect(rcSpeedBin(1)).toBe(1);
    expect(rcSpeedBin(3.4)).toBe(2);
    expect(rcSpeedBin(4)).toBe(3);
    expect(rcSpeedBin(8.8)).toBe(4);
    // the ANGULAR-SPEED bins, built from two headings the way the census builds them
    // ⚠ READ THROUGH THE HEADINGS, as the seat does: the rate is recovered by `acos` of a
    // `cos`/`sin` pair, so an EXACT edge value (0.5, 2, 4) round-trips to within ~1e-16 of
    // itself and its bin is float noise. The half-open `[edges[i−1], edges[i])` semantics are
    // therefore pinned on the SPEED axis, which takes its value directly (above); here the
    // bins are walked at their interiors and at the engine's own cap.
    const at = (rate: number): number =>
      rcAngSpeedBin(1, 0, Math.cos(rate * DT), Math.sin(rate * DT));
    expect(at(0)).toBe(0);
    expect(at(0.25)).toBe(0);
    expect(at(1)).toBe(1);
    expect(at(3)).toBe(2);
    expect(at(5)).toBe(3);
    // ⭐ THE CAP IS THE ENGINE'S OWN: no body can turn faster than TURN_RATE, so the top bin
    // is [4, TURN_RATE] and TURN_RATE itself lands in it
    expect(at(TURN_RATE)).toBe(RC_READY_N_ANG - 1);
    expect(at(TURN_RATE)).toBe(3);
    // ⭐⭐ THE DEGENERATE RULE — a non-finite angular speed enters NO cell (⚠ NOT the top bin,
    // which is where a naive `edgeBin(NaN, …)` would put it)
    expect(rcAngSpeedBin(0, 0, 1, 0)).toBe(-1);
    expect(rcAngSpeedBin(1, 0, 0, 0)).toBe(-1);
    expect(rcAngSpeedBin(0, 0, 0, 0)).toBe(-1);
    // the RANK slots: 1..5 take their own, ≥ 6 shares the sixth, 0 ("no cue") takes NONE
    expect([1, 2, 3, 4, 5].map(rcRankSlot)).toEqual([0, 1, 2, 3, 4]);
    expect(rcRankSlot(6)).toBe(RC_READY_N_RANK - 1);
    expect(rcRankSlot(11)).toBe(RC_READY_N_RANK - 1);
    for (const r of [0, -1, 1.5, Number.NaN]) expect(rcRankSlot(r)).toBe(-1);
    // and any degenerate axis kills the CELL, not just the axis
    expect(rcCellIndex(-1, 0, 0)).toBe(-1);
    expect(rcCellIndex(0, -1, 0)).toBe(-1);
    expect(rcCellIndex(0, 0, -1)).toBe(-1);
  });

  it('⭐ the WRAPPER composes the three axes exactly as the census does', () => {
    // a carrier at 4.2 m/s (speed bin 3) turning at 5 rad/s (ang bin 3) with me at rank 1
    const hx = Math.cos(5 * DT);
    const hy = Math.sin(5 * DT);
    const cell = rcReadyCell(4.2, 1, 0, hx, hy, 1);
    expect(cell).toBe(rcCellIndex(3, 3, 0));
    expect(cell).toBe(90);
    expect(artifact.familyF.cells).toContain(cell);
    // and this is the census's OWN best-believed cell — the fixture the walk pins lean on
    expect(RC_READY_BELIEF_E[cell]).toBe(Math.max(...RC_READY_BELIEF_E));
    expect(RC_READY_BELIEF_E[cell])
      .toBe(artifact.bins.cellWindupTargetMe.E[cell] / artifact.bins.cellTicks.E[cell]);
  });
});

/* ========================================================================== */
/* G-RANK — the SAME function object as 3a                                    */
/* ========================================================================== */

describe('RC T0b §G-RANK — the cue is 3a\'s, by IDENTITY', () => {
  it('⭐⭐ the ready seat re-exports RC-T0\'s own `alignmentRank` — not a copy', () => {
    expect(alignmentRank).toBe(alignmentRank3a); // identity, not equality
    expect(readySource).toContain('export { alignmentRank };');
    expect(count(readySource, /function alignmentRank|const alignmentRank =/g)).toBe(0);
    // and it still behaves as RC-C0 §P.A froze it (ties to the LOWEST gid, keeper included)
    const mates = [{ gid: 5, x: 10, y: 0 }, { gid: 6, x: 10, y: 10 }, { gid: 7, x: -10, y: 0 }];
    expect(alignmentRank(0, 0, 1, 0, mates, 5)).toBe(1);
    expect(alignmentRank(0, 0, 1, 0, mates, 7)).toBe(3);
    expect(alignmentRank(0, 0, 1, 0, mates, 42)).toBe(0); // outside the population: no cue
  });
});

/* ========================================================================== */
/* G-SCORE — the candidate's score is `w · belief · s_receive`, anchored      */
/* ========================================================================== */

describe('RC T0b §G-SCORE — the anchor is ReceivePass\'s OWN literal', () => {
  it('⭐⭐ the literal has ONE home and BOTH sites read it; ReceivePass still scores 1.2', () => {
    // canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
    // anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
    // §COMMANDER CORRECTIONS item 1).
    expect(linesOf(brainSource, 'const RC_S_RECEIVE = 1.2;')).toBe(1);
    expect(linesOf(brainSource,
      "      cands.push({ action: 'ReceivePass', score: RC_S_RECEIVE, why: 'pass is coming to me' });"))
      .toBe(1);
    expect(linesOf(brainSource,
      '          const score = w * rcReadyBelief(cell) * RC_S_RECEIVE;')).toBe(1);
    expect(count(brainSource, /RC_S_RECEIVE/g)).toBe(3); // the definition + the two sites
    // ⭐ THE SHIPPED PUSH IS UNCHANGED IN VALUE — the anchor IS 1.2, so hoisting moved no byte
    // of behaviour. Read the value back through the brain's own module, live.
    const m = matchOf(SEED_A, { world: W12 });
    for (let i = 0; i < 900 && !m.finished; i++) m.step(DT);
    const seen = new Set<number>();
    for (const p of m.allPlayers) {
      for (const s of p.action.scores) if (s.action === 'ReceivePass') seen.add(s.score);
    }
    for (const v of seen) expect(v).toBe(1.2);
    // ⛔ and the ONE push is gated on `score > 0`, so `w · belief = 0` pushes NOTHING
    expect(linesOf(brainSource, '          if (score > 0) {')).toBe(1);
  }, 60_000);

  it('⭐⭐ G-SCORE (live): `readyBenefit` on the record IS `w · belief · 1.2`', () => {
    // ⭐ THE BENEFIT IS THE OLD SCORE, unchanged by the fix: at w = 1 every value the brain
    // records must be one of the table's own 72 believing quotients times the anchor —
    // membership asserted BIT-EXACTLY (`toBe` through a Set), never `toBeCloseTo`.
    const legal = new Set(RC_READY_BELIEF_E.filter((b) => b > 0).map((b) => 1 * b * 1.2));
    const m = matchOf(SEED_A, { world: W12, ready: true, weight: 1 });
    const w = walkReady(m);
    expect(w.overlayTicks).toBeGreaterThan(0);
    expect(w.benefits.length).toBe(w.overlayTicks);
    for (const b of w.benefits) {
      expect(b).toBeGreaterThan(0);
      expect(legal.has(b)).toBe(true);
    }
    // the ceiling this stage's arithmetic rests on, re-derived from the artifact
    expect(Math.max(...w.benefits)).toBeLessThanOrEqual(Math.max(...RC_READY_BELIEF_E) * 1.2);
    expect(Math.max(...RC_READY_BELIEF_E))
      .toBe(artifact.bins.cellWindupTargetMe.E[90] / artifact.bins.cellTicks.E[90]);
  }, 60_000);
});

/* ========================================================================== */
/* ⭐⭐ G-TRADE-DECISION — the fix's own gate, through the REAL executor path   */
/* ========================================================================== */

/**
 * ⭐⭐ THE TRADE FIXTURE — the REAL `executeAction`, not a harness.
 *
 * `MoveToPoint` is the ONE executor case whose target is the CALLER's own world coordinate
 * (`p.action.targetPos`, `speedF = 1`), so this frame's intended direction is exactly ours to
 * choose while everything else — the clamps, the trade block, `p.faceTarget` — is the engine's.
 * The body sits 20 m inside his OWN half so no clamp can rewrite the target, which the fixture
 * PROVES rather than assumes (`p.clampTrace` is null on every case below).
 */
interface TradeCase {
  /** φ, the angle between the intended direction and the bearing to the carrier (degrees) */
  phiDeg: number;
  /** the body's own `facingDepth` — 0 when the BF price is shut, `BF_DEPTH` when it is armed */
  depth: number;
  /** `readyBenefit` on the record: `w · belief · s_receive` */
  benefit: number;
  /** `S_move`: the movement plan's own priority, `p.action.scores[0].score` */
  sMove: number;
  /** a HOLDING plan: the intended target IS his own position ⇒ no direction ⇒ no cost */
  holding?: boolean;
}
interface TradeOut { faced: boolean; cosPhi: number; cost: number; bound: number }
const tradeFace = (c: TradeCase): TradeOut => {
  const m = matchOf(SEED_D);
  const p = m.teams[0].players[3];
  const carrier = m.teams[0].players[2];
  expect(p.role).not.toBe('GK');
  expect(carrier.role).not.toBe('GK');
  const dir = { x: 1, y: 0 }; // the intended direction, ours by construction
  const phi = (c.phiDeg * Math.PI) / 180;
  const bear = { x: Math.cos(phi), y: Math.sin(phi) };
  p.pos = { x: -20 * m.teams[0].attackDir, y: 0 };
  p.vel = { x: 0, y: 0 };
  p.heading = { x: 1, y: 0 };
  p.facingDepth = c.depth;
  carrier.pos = { x: p.pos.x + bear.x * 15, y: p.pos.y + bear.y * 15 };
  m.ball.owner = carrier;
  m.ball.pos = { x: carrier.pos.x, y: carrier.pos.y };
  p.action = {
    type: 'MoveToPoint',
    targetPos: c.holding === true
      ? { x: p.pos.x, y: p.pos.y }
      : { x: p.pos.x + dir.x * 10, y: p.pos.y + dir.y * 10 },
    scores: [{ action: 'MoveToPoint', score: c.sMove, why: 'the fixture\'s movement plan' }],
    readyFaceGid: carrier.gid,
    readyBenefit: c.benefit,
  };
  executeAction(p, m, DT);
  expect(p.clampTrace).toBeNull(); // ⛔ no clamp rewrote the intended direction
  expect(m.ball.owner).toBe(carrier); // and he is still the carrier at the write
  // the COST this fixture's geometry implies, DERIVED by calling BF's own two functions —
  // ⛔ never typed (the 90° bound at BF_DEPTH is 0.30 × S_move, and this test never says so)
  const cosPhi = c.holding === true
    ? 1
    : facingCosine(dir.x, dir.y, bear.x, bear.y);
  const cost = c.holding === true
    ? 0
    : (1 - facingFactor(cosPhi, c.depth)) * c.sMove;
  const faced = p.faceTarget !== null
    && p.faceTarget.x === carrier.pos.x && p.faceTarget.y === carrier.pos.y;
  return { faced, cosPhi, cost, bound: cost };
};

describe('RC T0b §G-TRADE-DECISION — he faces iff BENEFIT > COST (ruling #379 item 3)', () => {
  // the two ends of the census's own believing range, so every benefit below is a REAL one
  const believing = RC_READY_BELIEF_E.filter((b) => b > 0);
  const bTop = Math.max(...believing) * 1.2; // the ceiling at w = 1
  const bLow = Math.min(...believing) * 1.2; // the faintest belief the table carries

  it('⭐⭐ (a) BF SHUT (`facingDepth` 0) ⇒ COST 0 ⇒ he faces at ANY φ, on the faintest belief', () => {
    for (const phiDeg of [0, 45, 90, 135, 180]) {
      const r = tradeFace({ phiDeg, depth: 0, benefit: bLow, sMove: DEFAULT_POLICY.formationBase });
      expect(`${phiDeg}:${r.cost}`).toBe(`${phiDeg}:0`); // the free turn, stated as arithmetic
      expect(`${phiDeg}:${r.faced}`).toBe(`${phiDeg}:true`);
    }
    // ⛔ and nothing to believe is still nothing: benefit 0 is not > cost 0
    expect(tradeFace({
      phiDeg: 90, depth: 0, benefit: 0, sMove: DEFAULT_POLICY.formationBase,
    }).faced).toBe(false);
  });

  it('⭐⭐ (b) depth = BF_DEPTH, φ = 90°, S_move = the menu winner\'s own score ⇒ the BOUND', () => {
    // S_move here is the DEFAULT menu's unconditional floor — `MoveToFormationSpot` is pushed
    // at `W.formationBase` on every off-ball tick, so this is the score a believing receiver
    // most often has to price his turn against.
    expect(DEFAULT_POLICY.formationBase).toBe(0.45);
    const sMove = DEFAULT_POLICY.formationBase;
    // ⭐ THE BOUND, DERIVED by CALLING `facingFactor` — never typed as a decimal
    const bound = (1 - facingFactor(facingCosine(1, 0, 0, 1), BF_DEPTH)) * sMove;
    const above = tradeFace({ phiDeg: 90, depth: BF_DEPTH, benefit: bTop, sMove });
    const below = tradeFace({ phiDeg: 90, depth: BF_DEPTH, benefit: bLow, sMove });
    const atIt = tradeFace({ phiDeg: 90, depth: BF_DEPTH, benefit: bound, sMove });
    expect(above.cost).toBe(bound);
    expect(bTop).toBeGreaterThan(bound);
    expect(bLow).toBeLessThan(bound);
    expect(above.faced).toBe(true);
    expect(below.faced).toBe(false);
    // ⭐ STRICT: exactly AT the bound he does NOT turn (`benefit > cost`, not `>=`)
    expect(atIt.faced).toBe(false);
    // and the cell that clears it is a REAL one — the census's own best-believed cell 90
    expect(bTop).toBe(RC_READY_BELIEF_E[90] * 1.2);
    // ⭐ HOW MANY CELLS CLEAR THE 90° BOUND AT w = 1 — DERIVED from the table and the bound,
    // so the stage doc quotes no second copy of it (canon, VERBATIM: "a gate's NOTE derives
    // from the same pinned values the gate checks; a count typed beside its pin is a second
    // copy"; home: PT-C0-PLAYTEST-FORENSIC-CENSUS.md §COMMANDER CORRECTIONS item 1).
    expect(RC_READY_BELIEF_E.filter((b) => b * 1.2 > bound).length).toBe(7);
  });

  it('⭐⭐ (c) φ = 0 ⇒ COST 0 ⇒ he faces on any positive belief, priced body or not', () => {
    const r = tradeFace({
      phiDeg: 0, depth: BF_DEPTH, benefit: bLow, sMove: DEFAULT_POLICY.formationBase,
    });
    expect(r.cosPhi).toBe(1);
    expect(r.cost).toBe(0); // `facingFactor(1, depth)` is exactly 1 — a straight run pays nothing
    expect(r.faced).toBe(true);
  });

  it('⭐⭐ (d) a HOLDING plan (no intended direction) ⇒ COST 0 ⇒ he turns for free', () => {
    // ⚠ the degenerate limb of the guard, reached the way a shipped body reaches it: the plan's
    // target IS his own position, so `target − p.pos` names no direction at all.
    const r = tradeFace({
      phiDeg: 180, depth: BF_DEPTH, benefit: bLow, sMove: 1.2, holding: true,
    });
    expect(r.cost).toBe(0);
    expect(r.faced).toBe(true);
    // ⚠ THE OTHER LIMB IS A GUARD, NOT A LIVE CASE (honest limit): no shipped executor case
    // sets `speedF` to 0, so the standing body reaches COST 0 through the degenerate direction
    // above. The conjunct is pinned on its own source line.
    expect(linesOf(execSource,
      '      if (speedF > 0 && dirLen > 1e-6 && bearLen > 1e-6) {')).toBe(1);
  });

  it('⭐⭐ (e) a HIGHER-priority run raises the bound — monotone in S_move', () => {
    const lo = DEFAULT_POLICY.formationBase;
    const hi = 1.2; // `ReceivePass`'s own priority — a body already told the ball is coming
    const boundLo = (1 - facingFactor(facingCosine(1, 0, 0, 1), BF_DEPTH)) * lo;
    const boundHi = (1 - facingFactor(facingCosine(1, 0, 0, 1), BF_DEPTH)) * hi;
    expect(boundHi).toBeGreaterThan(boundLo);
    // a belief BETWEEN the two bounds turns him on the cheap plan and not on the urgent one
    const between = (boundLo + boundHi) / 2;
    expect(tradeFace({ phiDeg: 90, depth: BF_DEPTH, benefit: between, sMove: lo }).faced)
      .toBe(true);
    expect(tradeFace({ phiDeg: 90, depth: BF_DEPTH, benefit: between, sMove: hi }).faced)
      .toBe(false);
  });

  it('⭐⭐ (f) MUTANT: a body that ignores its own depth would face where the priced one does not', () => {
    // ⚠ MUTANT LIVENESS (canon, home: ruling #268.3(a)): the depth is a LIVE conjunct, not
    // decoration. A benefit STRICTLY BETWEEN the two bounds separates the two bodies.
    const sMove = DEFAULT_POLICY.formationBase;
    const boundPriced = (1 - facingFactor(facingCosine(1, 0, 0, 1), BF_DEPTH)) * sMove;
    const boundShut = (1 - facingFactor(facingCosine(1, 0, 0, 1), 0)) * sMove;
    expect(boundShut).toBe(0);
    const between = boundPriced / 2;
    expect(between).toBeGreaterThan(boundShut);
    expect(between).toBeLessThan(boundPriced);
    expect(tradeFace({ phiDeg: 90, depth: 0, benefit: between, sMove }).faced).toBe(true);
    expect(tradeFace({ phiDeg: 90, depth: BF_DEPTH, benefit: between, sMove }).faced).toBe(false);
  });

  it('⭐⭐ THE FORM AT THE SITE: both formulae IMPORTED, S_move off the record, no literal', () => {
    // ⛔ NEITHER FORMULA IS RE-TYPED: the executor imports BF's own two functions and the
    // module keeps its single home for the law.
    expect(linesOf(execSource,
      "import { facingCosine, facingFactor } from '../sim/bodyFacing';")).toBe(1);
    expect(count(execSource, /facingFactor\(/g)).toBe(1);
    expect(count(execSource, /facingCosine\(/g)).toBe(1);
    expect(execSource).not.toContain('1 - depth');
    expect(execSource).not.toContain('BF_DEPTH');
    // the three factors, at their own lines: the body's OWN depth, the record's OWN S_move,
    // and the STRICT comparison
    expect(linesOf(execSource,
      '        cost = (1 - facingFactor(cosPhi, p.facingDepth)) * p.action.scores[0].score;'))
      .toBe(1);
    expect(linesOf(execSource, '      if (readyBenefit > cost) {')).toBe(1);
    expect(count(execSource, /readyBenefit >= cost/g)).toBe(0);
    // ⛔ and the trade never writes the movement
    const blockStart = execSource.indexOf('  const readyFaceGid = p.action.readyFaceGid;');
    const block = execSource.slice(blockStart,
      execSource.indexOf('  const pcSeat = match.pcLatency;'));
    expect(blockStart).toBeGreaterThan(0);
    for (const forbidden of ['target = ', 'speedF = ', 'p.desiredVel', 'p.vel = ', 'p.pos = ']) {
      expect(`${forbidden}:${block.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
  });
});

/* ========================================================================== */
/* THE WALK SIDE — G-BITE, G-MOVEMENT-KEPT, G-HOLD on world 12's composition  */
/* ========================================================================== */

describe('RC T0b §WALK — the DEFAULT vector, armed at w = 1 on world 12 as composed', () => {
  it('⭐⭐ G-BITE (default vector): faces EXIST, the heading turns, and the PRICE BITES', () => {
    // ⭐⭐ THE FORK IS CLOSED (ruling #379 item 4(ii)): this walk uses world 12 EXACTLY AS
    // COMPOSED — ⛔ no `rolePolicies` override — with `rcReady` AND `bfFacingCost` armed at
    // w = 1 on both teams, which is the vector the user actually plays.
    for (const seed of [SEED_A, SEED_B]) {
      const armed = matchOf(seed, { world: W12, ready: true, bf: true, weight: 1 });
      const shut = matchOf(seed, { world: W12, bf: true, weight: 1 });
      const w = walkReady(armed, shut);
      // ⭐ RECEIPTS, NOT EFFECT SIZES (canon, home: ruling #289 item 1 +
      // BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5): these counts say the door
      // OPENS, never that the world plays better.
      expect(w.overlayTicks).toBeGreaterThan(0);
      expect(w.faceTicks).toBeGreaterThan(0);
      // ⭐ and on such a tick the body's heading really does rotate TOWARD the carrier
      expect(w.turnedToward).toBeGreaterThan(0);
      expect(w.turnedToward / w.faceTicks).toBeGreaterThan(0.5);
      // ⛔ THE OVERLAY IS NEVER A PLAN: `AnticipatePass` never becomes `p.action.type` — and
      // the name does not exist in `src/**` at all any more (the seam map pins that).
      expect(w.typeLeaks).toBe(0);
      // ⭐⭐ G-MOVEMENT-KEPT: on the FIRST tick a face is applied, that body's MENU — his
      // `p.action.type` and his displayed `p.action.scores` — is the shut twin's, and the shut
      // twin wrote NO face at all, so his heading follows his motion under the shipped law.
      expect(w.firstFaceTick).toBeGreaterThan(0);
      expect(w.menuMatchedAtFirstFace).toBe(true);
      expect(w.twinFaceWasNullAtFirstFace).toBe(true);
      expect(w.twinFollowedMotionAtFirstFace).toBe(true);
    }
  }, 240_000);

  it('⭐⭐ G-BITE (the price bites ON THE DECISION): BF shut faces MORE often than BF armed', () => {
    // ⭐ THE FREE TURN, MEASURED: with `bfFacingCost` shut every body's `facingDepth` is 0, so
    // COST is 0 and he faces on every believing tick; with it armed he must clear
    // `(1 − f(φ)) · S_move` first. Both walks are the SAME seed on the SAME composition, and
    // the counts are RECEIPTS — never a football effect size.
    const withPrice = walkReady(matchOf(SEED_B, { world: W12, ready: true, bf: true, weight: 1 }));
    const noPrice = walkReady(matchOf(SEED_B, { world: W12, ready: true, weight: 1 }));
    expect(withPrice.faceTicks).toBeGreaterThan(0);
    expect(noPrice.faceTicks).toBeGreaterThan(withPrice.faceTicks);
  }, 240_000);

  it('⭐⭐ G-MOVEMENT-KEPT (structural): the menu can never carry a non-`ActionType`', () => {
    // ⛔ AN ANCHORED ABSENCE: the widening, the candidate interface, the splice and the cast
    // are GONE from the brain — `cands` is the shipped `UtilityScore[]` again, so the movement
    // argmax is untouched BY CONSTRUCTION and not merely by measurement.
    for (const gone of [
      'OffballCandidate', 'RcReadyCandidate', 'RC_READY_ACTION', 'AnticipatePass',
      'cands.splice', 'as UtilityScore[]', 'rcReadyCand',
    ]) expect(`${gone}:${brainSource.includes(gone)}`).toBe(`${gone}:false`);
    // BOTH menus (on-ball and off-ball) carry the SHIPPED element type again
    expect(linesOf(brainSource, '  const cands: UtilityScore[] = [];')).toBe(2);
    expect(linesOf(brainSource, '  const top = cands[0];')).toBe(2); // both menus, as shipped
    expect(linesOf(brainSource, '    scores: cands.slice(0, 4),')).toBe(1);
  });

  it('⭐⭐ G-HOLD: a LIVE PC reaction hold overrides the READY face exactly as it overrides the target', () => {
    const m = matchOf(SEED_C, { world: W12, ready: true, bf: true, weight: 1 });
    const w = walkReady(m);
    expect(w.heldTicks).toBeGreaterThan(0); // the case really occurs
    expect(w.heldFaceIsTheHold).toBe(w.heldTicks); // and the held face wins EVERY time
    // ⭐ STRUCTURAL, at the LIVE call site: the READY write sits ABOVE the gate, so the gate's
    // own unconditional rewrite lands last, and `remember` records the face he really ran.
    expect(execSource.indexOf('  const readyFaceGid = p.action.readyFaceGid;'))
      .toBeLessThan(execSource.indexOf('  const pcSeat = match.pcLatency;'));
    expect(linesOf(execSource,
      '      p.faceTarget = hold.face === null ? null : { x: hold.face.x, y: hold.face.y };'))
      .toBe(1);
    expect(linesOf(execSource,
      '      pcSeat.remember(p.gid, target, p.faceTarget, p.action.type);')).toBe(1);
  }, 120_000);

  it('⭐ THE FACE IS COPIED, NEVER ALIASED — the starred actionExecutor hazard', () => {
    expect(linesOf(execSource,
      '        p.faceTarget = { x: carrier.pos.x, y: carrier.pos.y };')).toBe(1);
    const m = matchOf(SEED_A, { world: W12, ready: true, bf: true, weight: 1 });
    let checked = 0;
    while (!m.finished && checked === 0) {
      m.step(DT);
      for (const p of m.allPlayers) {
        const gid = p.action.readyFaceGid;
        if (gid === undefined || p.faceTarget === null) continue;
        const carrier = m.ball.owner;
        if (carrier === null || carrier.gid !== gid) continue;
        expect(p.faceTarget).not.toBe(carrier.pos); // ⛔ not the same object
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(0);
  }, 120_000);
});

/* ========================================================================== */
/* G-TRADE — the turn COSTS ground once BF is armed (M-BF.4), and only then   */
/* ========================================================================== */

/** BF-T0's own fixture body, re-derived here (the G-SIDE form, ruling #376 item 4). */
const TRADE_TICKS = 120;
const TRADE_TARGET_X = 100;
const mkTradeBody = (depth: number): Player => {
  const p = new Player(0 as Side, 2, 'MF', 'FIX', randomPlayer(new Rng(4242), 'MF'));
  p.pos = { x: 0, y: 0 };
  p.vel = { x: 0, y: 0 };
  p.heading = { x: 1, y: 0 };
  p.stamina = 1;
  p.facingDepth = depth;
  return p;
};
/**
 * Drive the fixture THROUGH THE ENGINE. `ready` = the body that took the READY decision: his
 * `faceTarget` is the CARRIER's position — a body standing 50 m off his line of travel, i.e.
 * 90° off his motion — written from the PRE-step position exactly as `actionExecutor` writes
 * it. The shut twin faces where he runs.
 */
const driveTrade = (ready: boolean, depth: number): number => {
  const p = mkTradeBody(depth);
  for (let t = 0; t < TRADE_TICKS; t++) {
    const dx = TRADE_TARGET_X - p.pos.x;
    const dy = 0 - p.pos.y;
    const dl = Math.sqrt(dx * dx + dy * dy);
    p.desiredVel = { x: (dx / dl) * p.topSpeed, y: (dy / dl) * p.topSpeed };
    p.faceTarget = ready ? { x: p.pos.x, y: p.pos.y + 50 } : null;
    p.physicsStep(DT);
  }
  return p.pos.x;
};
/**
 * ⭐⭐ THE SAME DRIVE, INTEGRATED OUTSIDE THE ENGINE — BF's law's own prediction for the
 * heading path the body actually takes, step by step, from `facingFactor` / `facingCosine`
 * and nothing the engine hands us. DERIVED, never typed.
 */
const predictTrade = (ready: boolean, depth: number): number => {
  const proto = mkTradeBody(depth);
  const baseSpeed = proto.baseSpeed;
  const accel = proto.accel;
  const drainMul = proto.staminaDrainMul;
  const staminaAttr = proto.attrs.stamina;
  let stamina = 1;
  const turnCos = Math.cos(TURN_RATE * DT);
  const turnSin = Math.sin(TURN_RATE * DT);
  let px = 0; let py = 0; let vx = 0; let vy = 0; let hx = 1; let hy = 0;
  for (let t = 0; t < TRADE_TICKS; t++) {
    const topSpeed = baseSpeed * (0.62 + 0.38 * stamina);
    const dx = TRADE_TARGET_X - px;
    const dy = 0 - py;
    const dl = Math.sqrt(dx * dx + dy * dy);
    let tx = (dx / dl) * topSpeed;
    let ty = (dy / dl) * topSpeed;
    const ml = Math.sqrt(tx * tx + ty * ty);
    if (ml > topSpeed && ml > 1e-8) { tx *= topSpeed / ml; ty *= topSpeed / ml; }
    if (depth > 0) {
      const tl = Math.sqrt(tx * tx + ty * ty);
      if (tl > 1e-8) {
        const f = facingFactor(facingCosine(hx, hy, tx / tl, ty / tl), depth);
        tx *= f;
        ty *= f;
      }
    }
    const maxDelta = accel * DT;
    const ax = tx - vx;
    const ay = ty - vy;
    const al = Math.sqrt(ax * ax + ay * ay);
    if (al <= maxDelta || al < 1e-8) { vx = tx; vy = ty; } else {
      vx += ax * (maxDelta / al);
      vy += ay * (maxDelta / al);
    }
    const px0 = px;
    const py0 = py;
    px += vx * DT;
    py += vy * DT;
    const sp = Math.sqrt(vx * vx + vy * vy);
    let wx = 0; let wy = 0; let turn = false;
    if (ready) {
      const fx = px0 - px;
      const fy = py0 + 50 - py;
      const fl = Math.sqrt(fx * fx + fy * fy);
      if (fl > 1e-6) { wx = fx / fl; wy = fy / fl; turn = true; }
    } else if (sp > 0.5) { wx = vx / sp; wy = vy / sp; turn = true; }
    if (turn) {
      if (hx * wx + hy * wy >= turnCos) { hx = wx; hy = wy; } else {
        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
        const nx = hx * turnCos - hy * s;
        const ny = hx * s + hy * turnCos;
        hx = nx;
        hy = ny;
      }
    }
    const effort = sp / baseSpeed;
    if (effort > 0.55) {
      stamina = Math.max(0.05, stamina
        - STAMINA_DRAIN * effort * effort * DT * drainMul * (1.24 - staminaAttr * 0.6));
    } else {
      stamina = Math.min(1, stamina + STAMINA_RECOVERY * DT * (0.88 + staminaAttr * 0.3));
    }
  }
  return px;
};

describe('RC T0b §G-TRADE — the READY turn costs ground, but only with BF armed', () => {
  it('⭐⭐ with `bfFacingCost` armed the READY body covers LESS ground, by BF\'s own prediction', () => {
    const readyM = driveTrade(true, BF_DEPTH);
    const shutM = driveTrade(false, BF_DEPTH);
    expect(readyM).toBeLessThan(shutM);
    // the shortfall is BF's own law, integrated OUTSIDE the engine for the heading path the
    // body actually took — DERIVED, never typed
    expect(readyM).toBeCloseTo(predictTrade(true, BF_DEPTH), 9);
    expect(shutM).toBeCloseTo(predictTrade(false, BF_DEPTH), 9);
    expect(shutM - readyM).toBeCloseTo(
      predictTrade(false, BF_DEPTH) - predictTrade(true, BF_DEPTH), 9,
    );
    // ⭐ AND WITH THE PRICE SHUT THE TURN IS FREE — the reason RC-T1b arms BF in BOTH arms
    expect(driveTrade(true, 0)).toBe(driveTrade(false, 0));
    // the READY cell this trade is taken in is a REAL, POPULATED one (the fixture's carrier
    // stands 90° off a body running at ~top speed while swinging his shoulders): cell 90 —
    // speed bin 3, the top angular-speed bin, rank 1 — with the census's largest belief.
    expect(rcCellIndex(3, 3, 0)).toBe(90);
    expect(artifact.bins.cellTicks.E[90]).toBeGreaterThan(1000);
    expect(RC_READY_BELIEF_E[90]).toBeGreaterThan(0);
  });

  it('⭐ the two doors are INDEPENDENT: 3b is switchable apart from 3a', () => {
    const m = matchOf(SEED_A, { world: W12, ready: true });
    expect(m.rcReady).toBe(true);
    expect(m.rcAnticipate).toBe(false);
    const n = matchOf(SEED_A, { world: W12, anticipate: true });
    expect(n.rcReady).toBe(false);
    expect(n.rcAnticipate).toBe(true);
    const both = matchOf(SEED_A, { world: W12, ready: true, anticipate: true, bf: true });
    expect(both.rcReady && both.rcAnticipate && both.bfFacingCost).toBe(true);
  });
});

/* ========================================================================== */
/* CHANNEL CLOSURE — the module's imports, and the LIVE read set at the site  */
/* ========================================================================== */

describe('RC T0b §CHANNEL CLOSURE — the seat is blind, and the read set is pinned', () => {
  it('⭐⭐ the ready module\'s IMPORT LIST is closed', () => {
    const imports = [...readySource.matchAll(/^import [\s\S]*?from '(.*?)';$/gm)]
      .map((mm) => mm[1]);
    expect(imports).toEqual(['../sim/constants', './receiverAnticipationSeat']);
    // ⛔ the module's CODE cannot NAME the world, the bodies, the private commitment or the
    // plan. ⚠ Read off the COMMENT-STRIPPED source (the docblock legitimately names what it
    // may not touch).
    const code = readySource
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .split('\n').filter((l) => !l.trimStart().startsWith('//')).join('\n');
    expect(code).toContain('export function rcReadyBelief(');
    expect(code).not.toContain('⭐'); // the stripper really did remove the prose
    for (const forbidden of [
      'Match', 'Player', 'TeamBrain', 'pendingPassWindup', 'faceTarget', 'pendingPass',
      'runners', 'arriver', 'overlapper', 'wallRun', 'info.genome', 'Rng', 'rng',
      'Math.random', 'perceivedSnapshot', 'localStorage', 'process.env', 'targetGid',
    ]) {
      expect(`${forbidden}:${code.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
  });

  it('⭐⭐ THE LIVE READ SET: the off-ball menu call site\'s argument list, anchored', () => {
    const lines = brainSource.split('\n');
    const at = (needle: string): number => {
      const idx = lines.findIndex((l) => l === needle);
      expect(lines.filter((l) => l === needle).length).toBe(1);
      expect(idx).toBeGreaterThan(0);
      return idx + 1; // 1-based line receipt
    };
    // THE READ SET, line by line — the CARRIER's external body state, his heading one step
    // earlier (the match's own flag-gated memory), the mates' external fields, my own gid,
    // and the team's own gene. NOTHING ELSE.
    const readSet = [
      '    if (match.rcReady) {',
      '      const holder = ball.owner;',
      '      const w = rcAnticipationWeightOf(team.effGenome);',
      '        const prevH = match.rcReadyPrevHeading(holder.gid);',
      '            if (q.gid === holder.gid || q.side !== holder.side || q.sentOff) continue;',
      '            mates.push({ gid: q.gid, x: q.pos.x, y: q.pos.y });',
      '          const rank = alignmentRank(',
      '            holder.pos.x, holder.pos.y, holder.heading.x, holder.heading.y, mates, p.gid,',
      '          const cell = rcReadyCell(',
      '            Math.sqrt(holder.vel.x * holder.vel.x + holder.vel.y * holder.vel.y),',
      '            prevH.x, prevH.y, holder.heading.x, holder.heading.y, rank,',
      '          const score = w * rcReadyBelief(cell) * RC_S_RECEIVE;',
    ];
    const receipts = readSet.map(at);
    for (let i = 1; i < receipts.length; i++) expect(receipts[i]).toBeGreaterThan(receipts[i - 1]);
    // ⛔ THE FORBIDDEN CHANNELS never appear in the seam's own block (the whole span from the
    // flag fork to the push).
    const blockStart = brainSource.indexOf('    if (match.rcReady) {');
    const endNeedle = '            rcReadyBenefit = score;';
    expect(blockStart).toBeGreaterThan(0);
    const block = brainSource.slice(blockStart, brainSource.indexOf(endNeedle) + endNeedle.length);
    for (const forbidden of [
      'pendingPassWindup', 'faceTarget', 'pendingPass', 'runners', 'arriver', 'overlapper',
      'wallRun', 'info.genome', 'scores', 'aim', 'targetGid', 'match.rng', 'designat',
    ]) {
      expect(`${forbidden}:${block.includes(forbidden)}`).toBe(`${forbidden}:false`);
    }
    // the ONE fork on the flag in the brain, and the ONE gene read
    expect(count(brainSource, /match\.rcReady\b/g)).toBe(1);
    expect(count(brainSource, /match\.rcReadyPrevHeading\(/g)).toBe(1);
    expect(count(brainSource, /rcAnticipationWeightOf\(/g)).toBe(1);
    // ⛔ and the ONE gate on the carrier being a same-side, on-pitch OTHER body
    expect(linesOf(brainSource,
      '      if (holder !== null && holder !== p && holder.side === p.side && !holder.sentOff'))
      .toBe(1);
  });

  it('⭐⭐ THE OVERLAY IS AN OVERLAY: two INPUTS on the record, and no menu entry at all', () => {
    // the two locals, the ONE conditional record write, and the two fields — anchored
    expect(linesOf(brainSource, '  let rcReadyCarrierGid = -1;')).toBe(1);
    expect(linesOf(brainSource, '  let rcReadyBenefit = 0;')).toBe(1);
    expect(linesOf(brainSource, '            rcReadyCarrierGid = holder.gid;')).toBe(1);
    expect(linesOf(brainSource, '            rcReadyBenefit = score;')).toBe(1);
    expect(linesOf(brainSource, '  if (rcReadyCarrierGid >= 0) {')).toBe(1);
    expect(linesOf(brainSource, '    p.action.readyFaceGid = rcReadyCarrierGid;')).toBe(1);
    expect(linesOf(brainSource, '    p.action.readyBenefit = rcReadyBenefit;')).toBe(1);
    // the shipped sort is UNTOUCHED, and so is everything it sorts
    expect(count(brainSource, /cands\.sort\(\(a, b\) => b\.score - a\.score\);/g)).toBe(2);
    // ⛔ both overlay fields are OPTIONAL on the action record, so a shut record is
    // byte-identical, and they are written in ONE place, together
    expect(linesOf(typesSource, '  readyFaceGid?: number;')).toBe(1);
    expect(linesOf(typesSource, '  readyBenefit?: number;')).toBe(1);
  });
});

/* ========================================================================== */
/* §SEAM MAP + G-3A-UNTOUCHED                                                 */
/* ========================================================================== */

describe('RC T0b §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLE FAMILY — counted and sited', () => {
    // PREFIX STATED: the seam's whole needle family is the flag `rcReady` (+ its memory
    // `rcReadyPrevH` / `rcReadyCurH` / `rcReadyObserve` / `rcReadyPrevHeading`), the two
    // overlay fields `readyFaceGid` and `readyBenefit`, the module `receiverReadySeat` and its
    // exports (`rcReadyCell`, `rcReadyBelief`, `rcSpeedBin`, `rcAngSpeedBin`, `rcRankSlot`,
    // `rcCellIndex`, `RC_READY_*`) and the hoisted anchor `RC_S_RECEIVE`.
    // ⭐ THE FIX REMOVED A NEEDLE: `AnticipatePass` (the candidate's name), with the widening,
    // the interface and the splice — it is counted here at ZERO in every file of `src/**`.
    // No other spelling exists in `src/**`.
    const files = srcFiles('src');
    const SITES = [
      'src/ai/receiverReadySeat.ts', 'src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts',
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/sim/types.ts',
    ];
    for (const f of files) {
      expect(`${f}:${count(readFileSync(f, 'utf8'), /AnticipatePass/g)}`).toBe(`${f}:0`);
    }
    const FAMILY = /rcReady|RC_READY|readyFaceGid|readyBenefit|receiverReadySeat|RC_S_RECEIVE|rcSpeedBin|rcAngSpeedBin|rcRankSlot|rcCellIndex/g;
    const FAMILY_I = new RegExp(FAMILY.source, 'gi');
    for (const f of files) {
      const hay = readFileSync(f, 'utf8');
      if (count(hay, FAMILY) > 0) expect(SITES).toContain(f);
      if (!SITES.includes(f)) expect(hay).not.toMatch(FAMILY_I);
    }
    // Match.ts — the config field, the readonly field, the initialiser, the two memory slots,
    // the ONE observe hook + its ONE call, the ONE public read
    expect(count(matchSource, /^ {2}rcReady\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly rcReady: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.rcReady = cfg\.rcReady \?\? false;/g)).toBe(1);
    expect(linesOf(matchSource, '    if (this.rcReady) this.rcReadyObserve();')).toBe(1);
    expect(count(matchSource, /private rcReadyObserve\(\): void \{/g)).toBe(1);
    expect(count(matchSource, /rcReadyObserve\(/g)).toBe(2); // the definition + the ONE call
    expect(count(matchSource, /rcReadyPrevHeading\(/g)).toBe(1); // the ONE definition
    expect(count(matchSource, /AnticipatePass/g)).toBe(0);
    expect(count(matchSource, /readyFaceGid/g)).toBe(0);
    // PlayerBrain.ts — the ONE import, the ONE flag fork, the anchor, and the ONE record write
    expect(count(brainSource, /import \{\n {2}alignmentRank, rcReadyBelief, rcReadyCell, type RcMateBearing,\n\} from '\.\/receiverReadySeat';/g))
      .toBe(1);
    // ONE occurrence each: the ONE conditional record write's two lines
    expect(count(brainSource, /readyFaceGid/g)).toBe(1);
    expect(count(brainSource, /readyBenefit/g)).toBe(1);
    expect(count(brainSource, /rcReadyCarrierGid/g)).toBe(5); // 2 prose + the local + 2 uses
    expect(count(brainSource, /rcReadyBenefit/g)).toBe(3); // the local + its two uses
    expect(count(brainSource, /rcReadyCell\(/g)).toBe(1);
    expect(count(brainSource, /rcReadyBelief\(/g)).toBe(1);
    // actionExecutor.ts — the two overlay reads, the ONE priced face write
    expect(count(execSource, /readyFaceGid/g)).toBe(5);
    expect(count(execSource, /readyBenefit/g)).toBe(4);
    expect(count(execSource, /p\.faceTarget = \{ x: carrier\.pos\.x, y: carrier\.pos\.y \};/g))
      .toBe(1);
    // ⛔ the executor names the flag NOWHERE in code — its ONE prose mention is the dormancy
    // note above the write, and the candidate's name never reaches this file at all
    expect(count(execSource, /rcReady/g)).toBe(1);
    expect(linesOf(execSource,
      '  // Dormant: `readyFaceGid` is written by NO shipped path (`rcReady` is false everywhere), so'))
      .toBe(1);
    // League.ts — the matchFlags key union, and nowhere else
    expect(count(leagueSource, /rcReady/g)).toBe(1);
    // types.ts — the TWO optional overlay fields (the second docblock names the first twice)
    expect(count(typesSource, /readyFaceGid\?: number;/g)).toBe(1);
    expect(count(typesSource, /readyBenefit\?: number;/g)).toBe(1);
    expect(count(typesSource, /readyFaceGid/g)).toBe(3);
    expect(count(typesSource, /readyBenefit/g)).toBe(1);
    // the ready module — the exports, defined once each
    for (const n of [
      'rcSpeedBin', 'rcAngSpeedBin', 'rcRankSlot', 'rcCellIndex', 'rcReadyCell', 'rcReadyBelief',
    ]) {
      expect(count(readySource, new RegExp(`export function ${n}\\(`, 'g'))).toBe(1);
    }
    expect(count(readySource, /export const RC_READY_BELIEF_E/g)).toBe(1);
  });

  it('⭐⭐ G-3A-UNTOUCHED: `pcLatency.ts` and the 3a arm-loop read are byte-identical', () => {
    // the WHOLE of 3a's own file, hashed at the dispatch HEAD (99125a4)
    expect(createHash('sha256').update(readFileSync('src/ai/pcLatency.ts')).digest('hex'))
      .toBe(PC_LATENCY_SHA);
    // and 3a's arm-loop read in `Match.ts`, line by line (anchored source-line pins)
    for (const line of [
      '        let preCue: { belief: number; weight: number } | null = null;',
      "        if (this.rcAnticipate && w.klass === 'passRelease' && w.rel === 'own'",
      '          && w.initiatorGid !== null) {',
      '          const initiator = players[w.initiatorGid] as Player | undefined;',
      '          const weight = rcAnticipationWeightOf(this.teams[side].effGenome);',
      '            const rank = alignmentRank(',
      '            preCue = { belief: rcBeliefForRank(rank), weight };',
      '        seat.arm(gid, p.rosterIdx, side, w.klass, key, this.stepCount, preCue);',
    ]) expect(linesOf(matchSource, line)).toBe(1);
    expect(count(matchSource, /this\.rcAnticipate/g)).toBe(2); // the initialiser + the fork
    expect(count(matchSource, /seat\.arm\(/g)).toBe(1);
    // ⛔ and the READY seam does not touch the PC seat at all
    expect(readySource).not.toContain('pcLatency');
    expect(brainSource).not.toContain('pcLatency');
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.rcReady).toBe(false);
    expect(bare.rcAnticipate).toBe(false);
    expect(bare.bfFacingCost).toBe(false);
  });

  it('⭐⭐ THE PRODUCTION FINGERPRINT IS UNCHANGED (57b0bdab…c673) — the a4HomeGrant form', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_OF_RECORD);
  }, 120_000);
});

/* ========================================================================== */
/* G-RNG — the seam draws nothing                                             */
/* ========================================================================== */

describe('RC T0b §G-RNG', () => {
  it('G-RNG: the cell, the table and the candidate draw ZERO rng; the gene streams are 3a\'s', () => {
    const m = matchOf(SEED_C, { world: W12, ready: true, weight: 1 });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    let priced = 0;
    const mates = m.teams[0].players.map((p) => ({ gid: p.gid, x: p.pos.x, y: p.pos.y }));
    for (const p of m.teams[0].players) {
      const q = m.teams[1].players[0];
      const prevH = m.rcReadyPrevHeading(q.gid);
      expect(prevH).not.toBeNull();
      const rank = alignmentRank(q.pos.x, q.pos.y, q.heading.x, q.heading.y, mates, p.gid);
      const cell = rcReadyCell(
        Math.hypot(q.vel.x, q.vel.y), prevH!.x, prevH!.y, q.heading.x, q.heading.y, rank,
      );
      rcReadyBelief(cell);
      priced += 1;
    }
    expect(priced).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
    // ⛔ NO NEW GENE: this slice adds none — the gene is 3a's, born absent, outside GENE_KEYS
    expect((GENE_KEYS as readonly string[])).not.toContain('rcAnticipationWeight');
    expect(readySource).not.toContain('GENE_KEYS');
    expect(readySource).not.toContain('mutate');
  }, 60_000);
});
