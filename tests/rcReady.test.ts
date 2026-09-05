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
  DEFAULT_POLICY, TEAM_SIZE, type PolicyParams, type Side, type TeamInfo,
} from '../src/sim/types';
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
 * 「看见自己人拿球正转向我,先把身子打开对着他」 — armed, a receiver may push ONE candidate
 * into his OWN off-ball menu at `w · belief · s_receive`; when it wins his MOVEMENT is the
 * runner-up's byte for byte and the only addition is `faceTarget` = the carrier's `pos`.
 *
 * ⚠⚠ THE MEASURED FORK THIS SUITE CARRIES (G-REACH). Under the SHIPPED default policy the
 * candidate can NEVER win: RC-C0b's largest cell belief is `RC_READY_BELIEF_E[90]`, so the
 * candidate's ceiling at `w = 1` is `max(belief) · s_receive`, which is BELOW
 * `DEFAULT_POLICY.formationBase` — and the off-ball menu pushes `MoveToFormationSpot`
 * UNCONDITIONALLY at that score. The seam is therefore built exactly as #378 item 6 froze it
 * and is INERT on the default policy vector; it BITES on a LEARNED policy vector (`rolePolicies`,
 * the shipped Phase-18 channel), which is what the walk pins below use. Both facts are pinned,
 * DERIVED from the table and the shipped default — never typed.
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
 * ⭐ THE LEARNED POLICY VECTOR the walk pins use — the SHIPPED `rolePolicies` channel
 * (Phase 18: "a wildcard team can carry a LEARNED policy"), not a new constant and not a
 * source change. It lowers the three off-ball SHAPE weights so the menu's own floor drops
 * below the READY candidate's ceiling; every other weight stays `DEFAULT_POLICY`'s.
 */
const LEARNED_SHAPE: Partial<PolicyParams> = {
  formationBase: 0.02, supportBase: 0.02, supportProxW: 0.02,
};

const team = (name: string, seed: number, learned = false): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
    ...(learned
      ? { rolePolicies: Array.from({ length: TEAM_SIZE }, () => ({ ...LEARNED_SHAPE })) }
      : {}),
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
  /** world 12 with the recognition books left BORN ABSENT (`?pcdose=0`) */
  emptyBooks?: boolean;
  /** both teams carry the LEARNED shape policy (the walk pins' own world) */
  learned?: boolean;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1, a.learned === true),
    teamB: team('B', seed * 2 + 2, a.learned === true),
    duration: 240,
    ...base,
    ...(a.ready === true ? { rcReady: true } : {}),
    ...(a.readyExplicitFalse === true ? { rcReady: false } : {}),
    ...(a.anticipate === true ? { rcAnticipate: true } : {}),
    ...(a.bf === true ? { bfFacingCost: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) {
    armA4World(m, null, a.world, L3_DOSE, a.emptyBooks === true ? null : PC_DOSE);
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
 * the overlay, and the ticks on which the face the executor applied really is the carrier's
 * position AS IT STOOD WHEN THE BODY DECIDED (the executor writes it from the pre-step pos;
 * physics then moves the carrier, so a post-step comparison must use the pre-step snapshot).
 */
interface ReadyWalk {
  overlayTicks: number;
  faceTicks: number;
  turnedToward: number;
  heldTicks: number;
  heldFaceIsTheHold: number;
  firstOverlayTick: number;
  firstOverlayGid: number;
  typeLeaks: number;
}
const walkReady = (m: Match, twin: Match | null = null): ReadyWalk => {
  const out: ReadyWalk = {
    overlayTicks: 0, faceTicks: 0, turnedToward: 0, heldTicks: 0, heldFaceIsTheHold: 0,
    firstOverlayTick: -1, firstOverlayGid: -1, typeLeaks: 0,
  };
  let tick = 0;
  let firstDesiredMatched: boolean | null = null;
  while (!m.finished) {
    const pre = m.allPlayers.map((p) => ({
      x: p.pos.x, y: p.pos.y, hx: p.heading.x, hy: p.heading.y,
    }));
    m.step(DT);
    if (twin !== null && !twin.finished) twin.step(DT);
    tick++;
    for (const p of m.allPlayers) {
      if ((p.action.type as string) === 'AnticipatePass') out.typeLeaks += 1;
      const gid = p.action.readyFaceGid;
      if (gid === undefined) continue;
      out.overlayTicks += 1;
      if (out.firstOverlayTick < 0) {
        out.firstOverlayTick = tick;
        out.firstOverlayGid = p.gid;
        if (twin !== null) {
          const q = twin.allPlayers[p.gid];
          firstDesiredMatched = q.desiredVel.x === p.desiredVel.x
            && q.desiredVel.y === p.desiredVel.y;
        }
      }
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
      const b = pre[p.gid];
      const wx = c.x - b.x;
      const wy = c.y - b.y;
      const wl = Math.hypot(wx, wy) || 1;
      const before = b.hx * (wx / wl) + b.hy * (wy / wl);
      const after = p.heading.x * (wx / wl) + p.heading.y * (wy / wl);
      if (after > before) out.turnedToward += 1;
    }
  }
  if (twin !== null) expect(firstDesiredMatched).toBe(true);
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
      }
    }
    // no env / bundle door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/receiverReadySeat.ts',
      'src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts', 'src/sim/types.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/rcReady|AnticipatePass|readyFaceGid/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
    // ⛔ the ActionType UNION IS UNTOUCHED — the candidate's name is not an action type, so
    // it cannot become `p.action.type` even by mistake (the compiler refuses it)
    const union = typesSource.slice(
      typesSource.indexOf('export type ActionType ='),
      typesSource.indexOf('/** One scored candidate from utility evaluation'),
    );
    expect(union).not.toContain('AnticipatePass');
  });

  it('⭐ NO SERIALIZATION: the flag never reaches a serialized League, nor the overlay a result', () => {
    const league = new League({ seed: SEED_A });
    league.matchFlags = { rcReady: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('rcReady');
    // the gene is 3a's, still BORN ABSENT and still outside GENE_KEYS
    expect((GENE_KEYS as readonly string[])).not.toContain('rcAnticipationWeight');
    const g = randomGenome(new Rng(SEED_A));
    expect(rcAnticipationWeightOf(g)).toBeNull();
    const m = matchOf(SEED_A, { world: W12, ready: true, weight: 1, learned: true });
    for (let i = 0; i < 600; i++) m.step(DT);
    expect(JSON.stringify(m.getResult())).not.toContain('readyFaceGid');
    expect(JSON.stringify(m.getResult())).not.toContain('AnticipatePass');
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
      const shut = signatureOf(matchOf(seed, { world: W12, learned: true }));
      const armed = signatureOf(matchOf(seed, { world: W12, ready: true, learned: true }));
      expect(armed).toBe(shut);
    }
    const live = matchOf(SEED_A, { world: W12, ready: true, learned: true });
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
      shut.push(signatureOf(matchOf(seed, { world: W12, weight: 0, learned: true })));
      armedZero.push(signatureOf(
        matchOf(seed, { world: W12, weight: 0, ready: true, learned: true }),
      ));
    }
    expect(armedZero).toEqual(shut);
    expect(digest(armedZero)).toBe(digest(shut));
    const live = matchOf(SEED_C, { world: W12, weight: 0, ready: true, learned: true });
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
    // (b) THE LIVE PROOF: armed at w = 1 on the BARE world, whose composition has no wind-up
    // machinery at all — the seam still writes nothing that moves a byte when no candidate
    // ever wins, and the shut twin's signature is identical.
    for (const seed of [SEED_A, SEED_B]) {
      expect(signatureOf(matchOf(seed, { ready: true, weight: 1 })))
        .toBe(signatureOf(matchOf(seed, { weight: 1 })));
    }
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

  it('⭐⭐ G-REACH: the candidate\'s CEILING against the menu\'s own floor — DERIVED', () => {
    // ⚠⚠ THE MEASURED FORK (stage doc §4). The off-ball menu pushes `MoveToFormationSpot`
    // UNCONDITIONALLY at `W.formationBase`, so a candidate can only win by exceeding it. The
    // READY candidate's ceiling is `max(belief) · s_receive` at `w = 1`:
    const ceiling = Math.max(...RC_READY_BELIEF_E) * 1.2;
    // On the SHIPPED default policy the ceiling is BELOW the floor ⇒ the limb can never win.
    expect(ceiling).toBeLessThan(DEFAULT_POLICY.formationBase);
    // On a LEARNED policy vector (the shipped `rolePolicies` channel) it clears it.
    expect(ceiling).toBeGreaterThan(LEARNED_SHAPE.formationBase as number);
    // the two numbers this pin rests on, both re-derived from their own sources
    expect(Math.max(...RC_READY_BELIEF_E))
      .toBe(artifact.bins.cellWindupTargetMe.E[90] / artifact.bins.cellTicks.E[90]);
    expect(DEFAULT_POLICY.formationBase).toBe(0.45);
    // and the live consequence: armed at w = 1 on world 12 with the DEFAULT policy, zero
    // overlays are ever written — the shut byte, for a reason the arithmetic states.
    const m = matchOf(SEED_A, { world: W12, ready: true, weight: 1 });
    expect(walkReady(m).overlayTicks).toBe(0);
  }, 60_000);
});

/* ========================================================================== */
/* THE WALK SIDE — G-BITE, G-MOVEMENT-KEPT, G-HOLD on world 12's composition  */
/* ========================================================================== */

describe('RC T0b §WALK — armed at w = 1 on world 12\'s composition', () => {
  it('⭐⭐ G-BITE + G-MOVEMENT-KEPT (walk): faces EXIST, and the first one moves nothing', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const armed = matchOf(seed, {
        world: W12, ready: true, weight: 1, learned: true, emptyBooks: true,
      });
      const shut = matchOf(seed, { world: W12, weight: 1, learned: true, emptyBooks: true });
      const w = walkReady(armed, shut);
      // ⭐ RECEIPTS, NOT EFFECT SIZES (canon, home: ruling #289 item 1 +
      // BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5): these counts say the door
      // OPENS, never that the world plays better.
      expect(w.overlayTicks).toBeGreaterThan(0);
      expect(w.faceTicks).toBeGreaterThan(0);
      // ⭐ and on such a tick the body's heading really does rotate TOWARD the carrier
      expect(w.turnedToward).toBeGreaterThan(0);
      expect(w.turnedToward / w.faceTicks).toBeGreaterThan(0.5);
      // ⛔ THE OVERLAY IS NEVER A PLAN: `AnticipatePass` never becomes `p.action.type`
      expect(w.typeLeaks).toBe(0);
      // ⭐⭐ G-MOVEMENT-KEPT (walk): on the FIRST tick the overlay appears, that body's
      // `desiredVel` equals the shut twin's on the same seed at the same tick — the movement
      // is the runner-up's, byte for byte. (Asserted inside `walkReady`.)
      expect(w.firstOverlayTick).toBeGreaterThan(0);
    }
  }, 180_000);

  it('⭐⭐ G-HOLD: a LIVE PC reaction hold overrides the READY face exactly as it overrides the target', () => {
    const m = matchOf(SEED_C, {
      world: W12, ready: true, weight: 1, learned: true, emptyBooks: true,
    });
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
      '      p.faceTarget = { x: carrier.pos.x, y: carrier.pos.y };')).toBe(1);
    const m = matchOf(SEED_A, {
      world: W12, ready: true, weight: 1, learned: true, emptyBooks: true,
    });
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
    const endNeedle = '            cands.push(rcReadyCand);';
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

  it('⭐⭐ THE OVERLAY IS AN OVERLAY: the runner-up is what the record carries', () => {
    // the splice, the runner-up read and the ONE conditional overlay write, anchored
    expect(linesOf(brainSource, '    if (cands[0] === rcReadyCand) readyFaceGid = rcReadyCarrierGid;'))
      .toBe(1);
    expect(linesOf(brainSource, '    cands.splice(cands.indexOf(rcReadyCand), 1);')).toBe(1);
    expect(linesOf(brainSource, '  const menu = cands as UtilityScore[];')).toBe(1);
    expect(linesOf(brainSource, '  const top = menu[0];')).toBe(1);
    expect(linesOf(brainSource,
      '  if (readyFaceGid !== undefined) p.action.readyFaceGid = readyFaceGid;')).toBe(1);
    // the shipped sort is UNTOUCHED — the tie-break the runner-up inherits is the same one
    expect(count(brainSource, /cands\.sort\(\(a, b\) => b\.score - a\.score\);/g)).toBe(2);
    // ⛔ the overlay field is OPTIONAL on the action record, so a shut record is byte-identical
    expect(linesOf(typesSource, '  readyFaceGid?: number;')).toBe(1);
  });
});

/* ========================================================================== */
/* §SEAM MAP + G-3A-UNTOUCHED                                                 */
/* ========================================================================== */

describe('RC T0b §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLE FAMILY — counted and sited', () => {
    // PREFIX STATED: the seam's whole needle family is the flag `rcReady` (+ its memory
    // `rcReadyPrevH` / `rcReadyCurH` / `rcReadyObserve` / `rcReadyPrevHeading`), the candidate
    // name `AnticipatePass`, the overlay field `readyFaceGid`, the module `receiverReadySeat`
    // and its exports (`rcReadyCell`, `rcReadyBelief`, `rcSpeedBin`, `rcAngSpeedBin`,
    // `rcRankSlot`, `rcCellIndex`, `RC_READY_*`) and the hoisted anchor `RC_S_RECEIVE`.
    // No other spelling exists in `src/**`.
    const files = srcFiles('src');
    const SITES = [
      'src/ai/receiverReadySeat.ts', 'src/ai/PlayerBrain.ts', 'src/ai/actionExecutor.ts',
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/sim/types.ts',
    ];
    const FAMILY = /rcReady|RC_READY|AnticipatePass|readyFaceGid|receiverReadySeat|RC_S_RECEIVE|rcSpeedBin|rcAngSpeedBin|rcRankSlot|rcCellIndex/g;
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
    // PlayerBrain.ts — the ONE import, the ONE flag fork, the ONE candidate name, the anchor
    expect(count(brainSource, /import \{\n {2}alignmentRank, rcReadyBelief, rcReadyCell, type RcMateBearing,\n\} from '\.\/receiverReadySeat';/g))
      .toBe(1);
    expect(count(brainSource, /const RC_READY_ACTION = 'AnticipatePass';/g)).toBe(1);
    expect(count(brainSource, /AnticipatePass/g)).toBe(2); // the const + the type alias
    // the six: one prose mention in the overlay docblock, the local, the win-test write, and
    // the three on the ONE conditional record write
    expect(count(brainSource, /readyFaceGid/g)).toBe(6);
    expect(count(brainSource, /rcReadyCell\(/g)).toBe(1);
    expect(count(brainSource, /rcReadyBelief\(/g)).toBe(1);
    // actionExecutor.ts — the ONE overlay read and the ONE face write
    expect(count(execSource, /readyFaceGid/g)).toBe(5);
    expect(count(execSource, /p\.faceTarget = \{ x: carrier\.pos\.x, y: carrier\.pos\.y \};/g))
      .toBe(1);
    // ⛔ the executor names the flag NOWHERE in code — its ONE prose mention is the dormancy
    // note above the write, and the candidate's name never reaches this file at all
    expect(count(execSource, /rcReady/g)).toBe(1);
    expect(linesOf(execSource,
      '  // Dormant: `readyFaceGid` is written by NO shipped path (`rcReady` is false everywhere), so'))
      .toBe(1);
    expect(count(execSource, /AnticipatePass/g)).toBe(0);
    // League.ts — the matchFlags key union, and nowhere else
    expect(count(leagueSource, /rcReady/g)).toBe(1);
    // types.ts — the ONE optional overlay field
    expect(count(typesSource, /readyFaceGid/g)).toBe(1); // the ONE optional field
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
    const m = matchOf(SEED_C, { world: W12, ready: true, weight: 1, learned: true });
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
