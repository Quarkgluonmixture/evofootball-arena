import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { GENE_KEYS, randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import { dist, norm, sub, type V2 } from '../src/utils/vec';

/**
 * ⭐⭐ DX T0 — THE WIND-UP AIM DORMANT SEAM (docs/world-model/DX-T0-WINDUP-AIM-SEAM.md;
 * contract DX-DELIVERY-EXECUTION-CONTRACT.md §2 M-DX.1/M-DX.2; ruling #352 item 3, serving
 * the user's mandate 「对啊,肯定得修,包括高空球,弧线球,力度等,」) — THE SEAM'S PERMANENT PIN
 * SUITE, in the house form (`gcGroundCorridor.test.ts` / `dfCapOff.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * WHAT THE SEAM IS: a pass that enters the WIND-UP channel is struck toward THE ELECTED
 * CANDIDATE'S OWN AIM — the exact point the argmax scored — instead of discarding it. The
 * finding it repairs is GC-T1B's `O1-WINDUP-PRECEDENCE`: over 30,318 wind-up decisions the
 * displaced-aim share was EXACTLY 0, because `armPendingPass` re-aims at the target's body.
 *
 * The pins:
 *   • ⭐⭐ ROAD B / THE PROHIBITION SET (the `dfCapOff` form) — NO world and NO preset names
 *     the flag: `a4World.ts` does not contain the string at all, `a4MatchFlags` never
 *     carries it at any version, a bare Match / a world-11 match / a League match are all
 *     false, no env door on any seam line, and no serialized League can reach it.
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, in BOTH world shapes
 *     (bare · world 11, which arms the wind-up itself) × 2 scratch seeds, pooled.
 *   • ⭐⭐ G-INERT (M-DX.2) — ARMED WITHOUT A DELIVERY-CHOICE DOOR ≡ shut, byte for byte:
 *     with no seat, every election is a to-feet election and its displacement is ZERO, so
 *     the door has nothing to carry. MEASURED, never assumed.
 *   • ⭐⭐ G-BITE — armed + the DLC door + a displaced election ⇒ THE STRUCK POINT IS THE
 *     ELECTED POINT, proven on a deterministic fixture at the RESOLUTION SITE (direction
 *     exact, the weight law's distance the elected point's), plus a whole-match divergence.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon VERBATIM: "a
 *     seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site", home PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
 *   • ⭐⭐ §SCOPE — ONE fork, the SAME two guards the shipped synchronous led strike uses,
 *     ONE consumption site (inside `armPendingPass`), ONE plumb-through (the resolve), and
 *     the ONE-TOUCH BYPASS untouched: no strike path outside the wind-up reads the deposit.
 *   • ⭐ NO NEW GENE, NO NEW CONSTANT, NO NEW CANDIDATE, NO RNG — the door carries an
 *     EXISTING elected displacement through an EXISTING lead input.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite; the seam may not move it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS (canon, VERBATIM:
 * "verifier scratch walks use the stage's own consumed band or the out-of-band scratch
 * range (≥ 900,000,000) — never the next virgin block", home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS (≥ 900,000,000) — no frontier block is consumed. */
const SEED_A = 900_000_100;
const SEED_B = 900_000_101;
const SEED_C = 900_000_102;

/** The DX-T1 exam's own stack: world 11 — which arms `o1PassWindup` (via `a4MatchFlags(3)`). */
const W11 = 11 as const;

const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>);
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

interface Arm {
  /** arm THIS slice's door */
  dx?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  dxExplicitFalse?: boolean;
  /** arm the DLC delivery contest — the door that makes a DISPLACED election possible */
  dlc?: boolean;
  /** arm the wind-up itself on a bare world (world 11 already arms it) */
  o1?: boolean;
  /** the DLC/PTP taste gene, written on all three genome views of BOTH teams */
  gene?: number;
  world?: 11;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...base,
    ...(a.dx === true ? { dxWindupAim: true } : {}),
    ...(a.dxExplicitFalse === true ? { dxWindupAim: false } : {}),
    ...(a.dlc === true ? { dlcDeliveryChoice: true } : {}),
    ...(a.o1 === true ? { o1PassWindup: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  if (a.gene !== undefined) {
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.passLeadSupport = a.gene;
      }
    }
  }
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0/T1, DF, GC-T0). */
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
const brainSource = src('ai/PlayerBrain.ts');
const matchSource = src('sim/Match.ts');
const mechSource = src('sim/mechanics.ts');
const execSource = src('ai/actionExecutor.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});
const armSource = matchSource.slice(
  matchSource.indexOf('armPendingPass(passer: Player'),
  matchSource.indexOf('private resolvePendingPassWindup()'));
const resolveSource = matchSource.slice(
  matchSource.indexOf('private resolvePendingPassWindup()'),
  matchSource.indexOf('private pwNoteWindupChoiceVoid('));

/* ========================================================================== */
/* THE STRIKE FIXTURE — the resolution site, made deterministic               */
/* ========================================================================== */

/**
 * The O1-T1 `armedFixture` idiom, extended by exactly what this seam needs: the mate is
 * FROZEN (pos fixed, velocity zero) for the whole window, so `performPass`'s own
 * strike-time correction (`mate.vel · flight · 0.8`) is EXACTLY the zero vector and the
 * struck aim reduces to `mate.pos + electedLead` — the elected point itself. The gaussian
 * is stubbed to 0 so the spray term is exactly 0 and the struck direction is the aim.
 *
 * `lead === null` ⇒ NO election is deposited (the shut comparator, i.e. today's world).
 */
const strikeFixture = (seed: number, dxArmed: boolean, lead: V2 | null): {
  from: V2; matePos: V2; dir: V2; speed: number; ptpLead: V2 | null; strikes: number;
} => {
  const m = matchOf(seed, { o1: true, ...(dxArmed ? { dx: true } : {}) });
  while (m.phase !== 'playing') m.step(DT);
  for (let i = 0; i < 30 && m.phase === 'playing'; i++) m.step(DT);
  const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
  const passer = outfield[0];
  const mate = outfield[1];
  for (const o of m.teams[1].players) {
    o.pos = { x: 50, y: 30 };
    o.vel = { x: 0, y: 0 };
  }
  const matePos = { x: mate.pos.x, y: mate.pos.y };
  const freeze = (): void => {
    mate.pos = { x: matePos.x, y: matePos.y };
    mate.vel = { x: 0, y: 0 };
    passer.kickCooldown = 0;
    passer.stunTimer = 0;
    passer.firstTouchWindow = 0;
    passer.vel = { x: 0, y: 0 };
    if (m.ball.owner === passer) {
      m.ball.pos = { x: passer.pos.x + 0.85, y: passer.pos.y };
      m.ball.vel = { x: 0, y: 0 };
      m.ball.z = 0;
    }
  };
  m.ball.owner = passer;
  freeze();
  // the ELECTION, deposited exactly as `PlayerBrain`'s ONE fork deposits it
  if (lead !== null) m.dxStrikeAim = { gid: passer.gid, lead, tick: m.simTick };
  m.armPendingPass(passer, mate);
  const readyTick = m.pendingPassWindup!.readyTick;
  // the strike, captured at the SHIPPED `kickBall` — downstream of every aim statement
  let struck: { from: V2; dir: V2; speed: number } | null = null;
  let strikes = 0;
  let ptpLead: V2 | null = null;
  const origKick = m.kickBall.bind(m);
  m.kickBall = (p: Player, dir: V2, speed: number, loft = 0): void => {
    if (p === passer) {
      strikes++;
      struck = { from: { x: p.pos.x, y: p.pos.y }, dir: { x: dir.x, y: dir.y }, speed };
    }
    origKick(p, dir, speed, loft);
  };
  const origPass = m.performPass.bind(m);
  m.performPass = (
    p: Player, mt: Player, offsideExempt = false, powerChoice = 1,
    pl: Readonly<V2> | null = null,
  ): void => {
    if (p === passer) ptpLead = pl === null ? null : { x: pl.x, y: pl.y };
    origPass(p, mt, offsideExempt, powerChoice, pl);
  };
  (m.rng as unknown as { gaussian: () => number }).gaussian = () => 0;
  while (m.simTick <= readyTick && struck === null) {
    m.step(DT);
    if (struck === null) freeze();
  }
  expect(struck).not.toBeNull();
  return {
    from: struck!.from, matePos, dir: struck!.dir, speed: struck!.speed, ptpLead, strikes,
  };
};

/* ========================================================================== */
/* ROAD B — HYGIENE, THE PROHIBITION SET AND STRONG DORMANCY                  */
/* ========================================================================== */

describe('DX T0 — the wind-up aim door is dormant (Road B)', () => {
  it('⭐⭐ THE PROHIBITION SET: no world, no preset and no default names the flag', () => {
    expect(matchSource).toContain('this.dxWindupAim = cfg.dxWindupAim ?? false;');
    // ⭐ THE dfCapOff-STYLE PROHIBITION — the entry layer does not name the flag at all.
    // The entry rung is DX-T1's business (contract §3), not this stage's.
    expect(src('game/a4World.ts')).not.toContain('dxWindupAim');
    for (const v of [6, 7, 8, 9, 10, 11] as const) {
      expect((a4MatchFlags(v) as Record<string, unknown>).dxWindupAim).toBeUndefined();
      expect(JSON.stringify(a4MatchFlags(v))).not.toContain('dxWindupAim');
    }
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.dxWindupAim).toBe(false);
    expect(bare.dxStrikeAim).toBeNull();
    expect(matchOf(SEED_A).dxWindupAim).toBe(false);
    expect(matchOf(SEED_A, { world: W11 }).dxWindupAim).toBe(false);
    const league = new League({ seed: SEED_A });
    expect(league.createMatch(league.nextFixture()!).dxWindupAim).toBe(false);
    // no env door anywhere on a seam line
    for (const f of ['src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/PlayerBrain.ts']) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/dxWindupAim|dxStrikeAim/i.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('⭐ NO SERIALIZATION, NO NEW GENE, NO NEW CONSTANT', () => {
    // CANON, VERBATIM (home: ruling #283.2(iv)): "WORKER-SIMMED fixtures play the SHIPPED
    // world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned;
    // refines #270's E4 correction; matches the perf diagnostic)".
    const league = new League({ seed: SEED_A });
    league.matchFlags = { dxWindupAim: true };
    expect(JSON.stringify(league.toJSON())).not.toContain('dxWindupAim');
    // ⭐ THE DOOR CREATES NO GENE: the displacement it carries is the DLC/PTP seat's own,
    // and that gene is born absent exactly as it was.
    expect((GENE_KEYS as readonly string[])).not.toContain('passLeadSupport');
    const g = randomGenome(new Rng(SEED_A));
    expect(g.passLeadSupport).toBeUndefined();
    // ⭐ AND IT CREATES NO CONSTANT: the seam's own lines name no numeric literal but the
    // shipped defaults it re-states (`1` = the certified power argument).
    for (const line of armSource.split('\n')) {
      if (!/dxStrikeAim|dxDeposit|dxArmLead/.test(line)) continue;
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
      expect(line).not.toMatch(/(?<![A-Za-z_])[0-9]/); // a NUMBER, not the `2` of `V2`
    }
  });

  it('⭐⭐ G-OFF: ABSENT ≡ EXPLICIT-FALSE, both world shapes × 2 seeds, pooled', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W11] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, dxExplicitFalse: true })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    expect(new Set(absent).size).toBe(4); // one digest per (world × seed) cell — non-vacuity
  });

  it('⭐⭐ G-INERT (M-DX.2): ARMED without a delivery-choice door ≡ shut, byte for byte', () => {
    // The door carries an ELECTED DISPLACEMENT. With no DLC/PTP seat every election is a
    // to-feet election, its displacement is exactly zero, the ONE fork's second guard is
    // false and nothing is ever deposited — so the armed world is the shut world.
    const shut: string[] = [];
    const armed: string[] = [];
    for (const world of [undefined, W11] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        shut.push(signatureOf(matchOf(seed, { world })));
        armed.push(signatureOf(matchOf(seed, { world, dx: true })));
      }
    }
    expect(armed).toEqual(shut);
    expect(digest(armed)).toBe(digest(shut));
    // …and the arm is REAL, not a mis-built world: the flag is on, the wind-up channel
    // genuinely fires in world 11, and the deposit slot is never written in it.
    const live = matchOf(SEED_A, { world: W11, dx: true });
    expect(live.dxWindupAim).toBe(true);
    expect(live.o1PassWindup).toBe(true); // world 11 arms the wind-up itself
    let deposits = 0;
    let ticks = 0;
    while (!live.finished && ticks < 60_000) {
      live.step(DT);
      ticks++;
      if (live.dxStrikeAim !== null) deposits++;
    }
    expect(live.o1WindupLedger.struck).toBeGreaterThan(0); // the channel really ran
    expect(deposits).toBe(0); // and it had nothing to carry
  });

  it('⭐ THE FINGERPRINT OF RECORD is unmoved, and a bare Match has the door shut', () => {
    // ⚠ THE INHERITED HOUSE IDIOM, NAMED (GC-T0 §COMMANDER CORRECTIONS item 3): this
    // literal cannot fail if the world moves; the enforceable receipt is the stage doc's
    // real `npm run fingerprint` run.
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673');
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.dxWindupAim).toBe(false);
    expect(bare.o1PassWindup).toBe(false);
    expect(bare.pendingPassWindup).toBeNull();
  });
});

/* ========================================================================== */
/* G-BITE — THE STRUCK POINT IS THE ELECTED POINT                             */
/* ========================================================================== */

describe('DX T0 §G-BITE — the wound-up kick is struck at the ELECTED point', () => {
  it('⭐⭐ ARMED + a displaced election: the STRUCK direction is the ELECTED point\'s, exactly', () => {
    const lead = { x: 3.5, y: -2.25 };
    const shut = strikeFixture(SEED_A, false, lead); // the door SHUT: today's world
    const armed = strikeFixture(SEED_A, true, lead);
    // the fixture is the same world up to the strike
    expect(armed.from).toEqual(shut.from);
    expect(armed.matePos).toEqual(shut.matePos);
    expect(armed.strikes).toBe(1);
    expect(shut.strikes).toBe(1);
    // ⭐⭐ THE ELECTED POINT — `mate.pos + electedLead`, the exact point the argmax scored
    // (the mate is frozen, so `performPass`'s own strike-time correction is exactly zero).
    const elected = { x: armed.matePos.x + lead.x, y: armed.matePos.y + lead.y };
    expect(armed.dir).toEqual(norm(sub(elected, armed.from)));
    // ⛔ AND THE DISCARD IS WHAT IT REPLACES: shut, the very same wound-up kick flies at
    // the target's BODY — GC-T1B's `O1-WINDUP-PRECEDENCE`, reproduced in one fixture.
    expect(shut.dir).toEqual(norm(sub(shut.matePos, shut.from)));
    expect(armed.dir).not.toEqual(shut.dir);
    // ⭐ THE RESOLUTION SITE ITSELF: the elected displacement reaches `performPass`'s lead
    // input UNMUTATED, and reaches it ONLY when the door is armed.
    expect(armed.ptpLead).toEqual(lead);
    expect(shut.ptpLead).toBeNull();
  });

  it('⭐⭐ …and the WEIGHT LAW reads the ELECTED point\'s distance, not the body\'s', () => {
    const lead = { x: 3.5, y: -2.25 };
    const shut = strikeFixture(SEED_B, false, lead);
    const armed = strikeFixture(SEED_B, true, lead);
    const elected = { x: armed.matePos.x + lead.x, y: armed.matePos.y + lead.y };
    // `speed = clamp(d·0.6 + 8.2, 9, 22) · executedMul`, and `executedMul` reads the
    // misalignment TO THE BODY — identical in both arms — so the ratio is pure geometry.
    const band = (d: number): number => Math.min(22, Math.max(9, d * 0.6 + 8.2));
    const dElected = dist(armed.from, elected);
    const dBody = dist(shut.from, shut.matePos);
    expect(dElected).not.toBeCloseTo(dBody, 3); // the fixture really moves the point
    expect(armed.speed / shut.speed).toBeCloseTo(band(dElected) / band(dBody), 9);
  });

  it('⭐ G-BITE (walk): armed + the DLC door genuinely reprices a whole match', () => {
    const shut = signatureOf(matchOf(SEED_C, { world: W11, dlc: true, gene: 1 }));
    const armed = signatureOf(matchOf(SEED_C, { world: W11, dlc: true, gene: 1, dx: true }));
    expect(armed).not.toBe(shut);
    // ⛔ An arming receipt. It says NOTHING about whether the football improves — H-DX.1.
  });

  it('⭐⭐ THE STORED AIM IS THE DEPOSITED AIM — no mutation between arm and resolve', () => {
    const m = matchOf(SEED_A, { o1: true, dx: true });
    while (m.phase !== 'playing') m.step(DT);
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    const passer = outfield[0];
    const mate = outfield[1];
    m.ball.owner = passer;
    const lead = { x: -1.75, y: 4.5 };
    m.dxStrikeAim = { gid: passer.gid, lead, tick: m.simTick };
    m.armPendingPass(passer, mate);
    expect(m.pendingPassWindup!.aimLead).toEqual(lead);
    expect(m.dxStrikeAim).toBeNull(); // CONSUMED: one election is at most one strike
    // …and the deposit is keyed to THIS body at THIS tick — it cannot leak sideways
    const other = outfield[2];
    m.dxStrikeAim = { gid: passer.gid, lead, tick: m.simTick - 1 };
    m.armPendingPass(other, mate);
    expect(m.pendingPassWindup!.aimLead).toBeNull(); // wrong tick ⇒ not carried
    m.dxStrikeAim = { gid: other.gid, lead, tick: m.simTick };
    m.armPendingPass(passer, mate);
    expect(m.pendingPassWindup!.aimLead).toBeNull(); // wrong body ⇒ not carried
  });

  it('⭐⭐ THE DOOR IS THE ONLY GATE: shut, an identical deposit is never carried', () => {
    const m = matchOf(SEED_A, { o1: true }); // wind-up armed, DX door SHUT
    while (m.phase !== 'playing') m.step(DT);
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    const passer = outfield[0];
    m.ball.owner = passer;
    m.dxStrikeAim = { gid: passer.gid, lead: { x: 3, y: 3 }, tick: m.simTick };
    m.armPendingPass(passer, outfield[1]);
    expect(m.pendingPassWindup!.aimLead).toBeNull();
    expect(m.dxStrikeAim).not.toBeNull(); // not even consumed
  });
});

/* ========================================================================== */
/* §SCOPE — one fork, the shipped guards, the bypass untouched                */
/* ========================================================================== */

describe('DX T0 §SCOPE — what the door may touch, and what it may not', () => {
  it('⭐⭐ THE ONE FORK, with the SHIPPED synchronous statement\'s OWN two guards', () => {
    // the ONE `match.dxWindupAim` fork in `src/**`, and it is in the pass case
    let forks = 0;
    for (const f of srcFiles('src')) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        const t = line.trim();
        if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) continue;
        if (!/match\.dxWindupAim/.test(t)) continue;
        forks += 1;
        expect(f).toBe('src/ai/PlayerBrain.ts');
        expect(t).toBe(
          'if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {',
        );
      }
    }
    expect(forks).toBe(1);
    // ⭐⭐ THE GUARDS ARE THE SHIPPED LED STRIKE'S OWN, verbatim — the door adds no
    // condition of its own, so it can only carry an election the synchronous path would
    // itself have struck.
    const passCase = brainSource.slice(
      brainSource.indexOf("case 'Pass':"), brainSource.indexOf("case 'LoftedPass': {"));
    expect(passCase).toContain(
      '} else if (passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {');
    // …and the BANKED statements are untouched, byte for byte (a pinned test is a STOP)
    expect(passCase).toMatch(
      /if \(match\.o1PassWindup && !mustKick && p\.firstTouchWindow <= 0\) \{/);
    expect(passCase).toMatch(/match\.armPendingPass\(p, passMate!, offsideExemptKick\);/);
    expect(passCase).toMatch(/else match\.performPass\(p, passMate!, offsideExemptKick\);/);
    expect(passCase).toContain(
      'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));');
    expect(count(brainSource, /match\.armPendingPass\(/g)).toBe(1); // still ONE arm site
  });

  it('⭐⭐ ONE CONSUMPTION SITE and ONE PLUMB-THROUGH — the bypass and every other kick are shut out', () => {
    // the deposit is READ in exactly one place: inside `armPendingPass`
    expect(count(matchSource, /this\.dxStrikeAim/g)).toBe(2); // the read + the clear
    expect(count(armSource, /this\.dxStrikeAim/g)).toBe(2);
    expect(armSource).toContain('const dxDeposit = this.dxStrikeAim;');
    // ⛔ NO OTHER STRIKE PATH CAN SEE IT — the one-touch bypass releases through
    // `performPass`, which never names the deposit, and neither does the executor, the
    // mechanics module or any other seam.
    expect(mechSource).not.toMatch(/dxStrikeAim|dxWindupAim|aimLead/);
    expect(execSource).not.toMatch(/dxStrikeAim|dxWindupAim|aimLead/);
    const performPassSlice = matchSource.slice(
      matchSource.indexOf('  performPass('), matchSource.indexOf('  performThroughBall('));
    expect(performPassSlice).not.toMatch(/dxStrikeAim|dxWindupAim|aimLead/);
    // the ONE plumb-through: the resolve, handing the SHIPPED lead input
    expect(count(resolveSource, /aimLead/g)).toBe(2); // the prose + the call
    expect(resolveSource).toContain(
      'this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);');
    // ⛔ and no flight parameter is touched anywhere on a seam line
    for (const line of (armSource + resolveSource).split('\n')) {
      if (!/dxStrikeAim|dxArmLead|dxDeposit|aimLead/.test(line)) continue;
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
      for (const forbidden of [
        'speed', 'loft', 'spin', 'curl', 'vz', 'kickBall', 'readyTick', 'rng',
      ]) expect(line).not.toContain(forbidden);
    }
  });

  it('⭐ NO RNG, NO NEW CANDIDATE, NO NEW SCORING TERM', () => {
    // the fork DEPOSITS a value the chooser already computed: it forms no candidate, calls
    // no pricer and draws nothing.
    const forkSlice = brainSource.slice(
      brainSource.indexOf('if (match.dxWindupAim'),
      brainSource.indexOf('if (match.o1PassWindup && !mustKick'));
    for (const forbidden of [
      'groundCandidate(', 'bestPass', 'rng', 'Math.random', 'ledDelivery(', 'groundStrikeGrid(',
    ]) expect(forkSlice).not.toContain(forbidden);
    // and arming draws no rng at the arm site either (the O1 G5 claim, re-asserted here)
    const m = matchOf(SEED_A, { o1: true, dx: true });
    while (m.phase !== 'playing') m.step(DT);
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    m.ball.owner = outfield[0];
    m.dxStrikeAim = { gid: outfield[0].gid, lead: { x: 1, y: 1 }, tick: m.simTick };
    const before = (m.rng as unknown as { s: number }).s;
    m.armPendingPass(outfield[0], outfield[1]);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });
});

/* ========================================================================== */
/* §SEAM MAP                                                                  */
/* ========================================================================== */

describe('DX T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE NEEDLES `dxWindupAim` and `dxStrikeAim` — counted and sited', () => {
    // PREFIX STATED: this seam's whole needle family is exactly two names — the flag
    // `dxWindupAim` and the deposit slot `dxStrikeAim`. There is no third spelling, no
    // type, no constant and no gene. The record field `aimLead` and the two local
    // bindings are counted separately below.
    const files = srcFiles('src');
    const SITES = ['src/ai/PlayerBrain.ts', 'src/sim/Match.ts', 'src/sim/League.ts'];
    for (const f of files) {
      const hay = readFileSync(f, 'utf8');
      if (count(hay, /dxWindupAim|dxStrikeAim/g) > 0) expect(SITES).toContain(f);
      // no other casing or spelling of the family exists anywhere
      expect(count(hay, /dxWindupAim|dxStrikeAim/gi))
        .toBe(count(hay, /dxWindupAim|dxStrikeAim/g));
    }
    for (const f of files) {
      if (SITES.includes(f)) continue;
      expect(readFileSync(f, 'utf8')).not.toMatch(/dxWindupAim|dxStrikeAim|aimLead/i);
    }
    // Match.ts — 9 × the flag: the `MatchConfig` field, the `readonly` field, the
    // `this.`/`cfg.` pair on the ONE initialiser line, the arm-time gate, and FOUR prose
    // mentions inside docblocks. 4 × the deposit: its declaration, the arm-time read, the
    // arm-time clear, and one prose mention.
    expect(count(matchSource, /dxWindupAim/g)).toBe(9);
    expect(count(matchSource, /dxStrikeAim/g)).toBe(4);
    expect(linesOf(matchSource, '  readonly dxWindupAim: boolean;')).toBe(1);
    expect(linesOf(matchSource, '  dxWindupAim?: boolean;')).toBe(1);
    expect(linesOf(matchSource, '    this.dxWindupAim = cfg.dxWindupAim ?? false;')).toBe(1);
    expect(linesOf(matchSource, '  dxStrikeAim: { gid: number; lead: V2; tick: number } | null = null;'))
      .toBe(1);
    // PlayerBrain.ts — 2 × the flag (the ONE fork + one prose mention) and 1 × the
    // deposit (the ONE write).
    expect(count(brainSource, /dxWindupAim/g)).toBe(2);
    expect(count(brainSource, /dxStrikeAim/g)).toBe(1);
    expect(brainSource).toContain('          match.dxStrikeAim = {\n');
    // League.ts — 1: the `matchFlags` key union, and nowhere else.
    expect(count(src('sim/League.ts'), /dxWindupAim/g)).toBe(1);
    expect(count(src('sim/League.ts'), /dxStrikeAim|aimLead/g)).toBe(0);
    // the record field `aimLead` — 5 in Match.ts (the type, the record literal, the
    // resolve's read, and two prose mentions) and 0 everywhere else in src/**.
    expect(count(matchSource, /aimLead/g)).toBe(5);
    expect(count(brainSource, /aimLead/g)).toBe(0);
    // the two local bindings, same discipline
    expect(count(matchSource, /dxDeposit/g)).toBe(5); // decl + 4 uses in the ONE gate
    expect(count(matchSource, /dxArmLead/g)).toBe(3); // decl + the assignment + the record
  });
});
