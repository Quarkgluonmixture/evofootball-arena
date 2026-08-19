import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { CONTROL_MAX_HEIGHT, DT, HEADER_MIN_HEIGHT, PLAYER_CORE_RADIUS } from '../src/sim/constants';
import type { Player } from '../src/sim/Player';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * BK T1 — THE CONTACT LAW (docs/world-model/BK-T1-CONTACT-LAW.md; contract
 * BK-BODYBALL-CONTRACT.md §2 M-BK.2; ruling #307 item 4) — THE SEAM'S PERMANENT PIN SUITE,
 * in the house form (`bkFacingLaw.test.ts` / `pcLatencySeam.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY — flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes;
 *     the ledger stays all-zero on an armed-world walk with the door shut.
 *   • ⭐⭐ THE LAWFUL CHANNEL — a body in kick cooldown CAN now be struck, and a control
 *     SUPERPOWER did not appear (he never gains the ball off his own strike).
 *   • ⭐⭐ THE Z PARTITION — no untouchable band when armed; the band intact when shut;
 *     neither shipped height constant edited.
 *   • ⭐ EXISTENCE vs QUALITY — the strike branch carries no existence roll; the two draws it
 *     does make are the DEFLECT family's own quality draws.
 *   • ⭐⭐ COMPOSITION SEMANTICS — composes freely with everything; no refusal of its own;
 *     it does NOT rescue `bkFacingLaw`'s inert-law refusal.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, prefix STATED (canon: PC-C0 §CORR
 *     item 1), INCLUDING the census's most-quoted citation site itself.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside BK-T1's OWN booked block (ruling #307 item 4: 12,503,000–999). */
const SEED_A = 12_503_800;
const SEED_B = 12_503_801;
const SEED_C = 12_503_802;

const W8 = 8 as const;
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
  /** arm the contact law */
  bk?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  bkExplicitFalse?: boolean;
  /** the world-8 stack the user plays, rather than a bare match */
  armed?: boolean;
  /** the OTHER BK seam, for the composition pins */
  facing?: boolean;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.armed === true ? a4MatchFlags(W8) : { c7Windup: true, o1PassWindup: true };
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.duration === undefined ? {} : { duration: a.duration }),
    ...base,
    ...(a.bk === true ? { bkContactLaw: true } : {}),
    ...(a.bkExplicitFalse === true ? { bkContactLaw: false } : {}),
    ...(a.facing === true ? { bkFacingLaw: true } : {}),
  });
  if (a.armed === true) armA4World(m, null, W8, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0 and BK-T0). */
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

const matchSource = readFileSync(new URL('../src/sim/Match.ts', import.meta.url), 'utf8');
const constantsSource = readFileSync(new URL('../src/sim/constants.ts', import.meta.url), 'utf8');

/* ========================================================================== */
/* THE CONTROLLED CROSSING FIXTURE                                            */
/* ========================================================================== */

type Mode = 'cooldown' | 'stun' | 'clean' | 'sentOff' | 'lastToucher' | 'outward' | 'deadBand';

interface Crossing {
  /** did the TARGET body ever become the ball's `lastTouch` during the flight? */
  touched: boolean;
  /** did he ever OWN the ball (the superpower question)? */
  owned: boolean;
  /** was a CONTROL ATTEMPT ever opened naming him (the superpower's first step)? */
  attempted: boolean;
  ledger: Match['bkContactLedger'];
  m: Match;
  target: Player;
}

/**
 * Fly a free ball straight through one body while every other body is parked in the far
 * corner, and report whether that body ever touched it. The target's state is re-pinned each
 * tick (the O1/BK-T0 `armedFixture` idiom) so the crossing is the only thing under test.
 */
const crossing = (seed: number, bk: boolean, mode: Mode): Crossing => {
  const m = matchOf(seed, bk ? { bk: true } : {});
  while (m.phase !== 'playing') m.step(DT);
  const outfield = m.teams[0].players.filter((p) => p.role !== 'GK');
  const target = outfield[0];
  const decoy = outfield[1];
  let touched = false;
  let owned = false;
  let attempted = false;
  for (let t = 0; t < 16; t++) {
    for (const p of m.allPlayers) {
      if (p === target) continue;
      p.pos = { x: 50, y: 30 };
      p.vel = { x: 0, y: 0 };
    }
    target.pos = { x: 0, y: 0 };
    target.vel = { x: 0, y: 0 };
    target.heading = { x: 1, y: 0 };
    target.kickCooldown = mode === 'cooldown' || mode === 'lastToucher' || mode === 'outward' ? 0.4 : 0;
    target.stunTimer = mode === 'stun' ? 0.4 : 0;
    target.sentOff = mode === 'sentOff';
    if (mode === 'sentOff') target.kickCooldown = 0.4;
    m.ball.owner = null;
    m.ball.lastTouch = mode === 'lastToucher' ? target : decoy;
    if (mode === 'deadBand') {
      m.ball.z = (CONTROL_MAX_HEIGHT + HEADER_MIN_HEIGHT) / 2; // 1.325 — the dead band
      m.ball.vz = 0;
    }
    if (t === 0) {
      // ⭐ `outward` starts the ball INSIDE the shell already moving away: geometry alone is
      // not a strike, the ball must be CLOSING (the M1 `resolveOverlaps` rule).
      m.ball.pos = mode === 'outward' ? { x: 0.3, y: 0 } : { x: -1.6, y: 0 };
      m.ball.vel = mode === 'outward' ? { x: 6, y: 0 } : { x: 14, y: 0 };
      if (mode !== 'deadBand') { m.ball.z = 0; m.ball.vz = 0; }
    }
    m.step(DT);
    if (m.ball.lastTouch === target) touched = true;
    if (m.ball.owner === target) owned = true;
    const pc = (m as unknown as { pendingControl: { gid: number } | null }).pendingControl;
    if (pc !== null && pc.gid === target.gid) attempted = true;
  }
  return { touched, owned, attempted, ledger: m.bkContactLedger, m, target };
};

/* ========================================================================== */

describe('BK T1 — the contact law is dormant (Road B)', () => {
  it('⭐ default-off: bkContactLaw false and the ledger all-zero everywhere it can be read', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bkContactLaw).toBe(false);
    expect(bare.bkContactLedger).toEqual({
      strikeClaimsCooldown: 0, strikeClaimsStunned: 0, strikesApplied: 0,
      strikesAppliedCooldown: 0, strikesAppliedStunned: 0, maxStrikeRelativeSpeed: 0,
      partitionGroundTicks: 0,
    });
    const league = new League({ seed: 20260819 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.bkContactLaw).toBe(false);
    // the shipped play-test world of record does NOT arm it (Road B: nothing ships)
    expect((a4MatchFlags(W8) as Record<string, unknown>).bkContactLaw).toBeUndefined();
    const a4Source = readFileSync(new URL('../src/game/a4World.ts', import.meta.url), 'utf8');
    expect(a4Source).not.toContain('bkContactLaw');
  });

  it('⭐⭐ ROAD B DORMANCY: flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes', () => {
    for (const armed of [false, true]) {
      for (const seed of [SEED_A, SEED_B]) {
        const absent = signatureOf(matchOf(seed, { armed }));
        const explicitFalse = signatureOf(matchOf(seed, { armed, bkExplicitFalse: true }));
        expect(explicitFalse).toBe(absent);
      }
    }
  });

  it('⭐ the ledger stays all-zero on an ARMED-world walk with the contact door shut', () => {
    const shut = matchOf(SEED_A, { armed: true, duration: 240 });
    shut.runToCompletion();
    expect(shut.bkContactLedger).toEqual({
      strikeClaimsCooldown: 0, strikeClaimsStunned: 0, strikesApplied: 0,
      strikesAppliedCooldown: 0, strikesAppliedStunned: 0, maxStrikeRelativeSpeed: 0,
      partitionGroundTicks: 0,
    });
    // liveness: that zero is a zero of ABSENCE-OF-LAW, not of exposure — the same world with
    // the door open books real strikes on the same seed
    const open = matchOf(SEED_A, { armed: true, duration: 240, bk: true });
    open.runToCompletion();
    expect(open.bkContactLedger.strikesApplied).toBeGreaterThan(0);
  });

  it('⭐ arming it is a REAL change — the armed world is distinguishable from the shut one', () => {
    for (const armed of [false, true]) {
      const shut = signatureOf(matchOf(SEED_A, { armed }));
      const open = signatureOf(matchOf(SEED_A, { armed, bk: true }));
      expect(open).not.toBe(shut);
    }
  });
});

describe('BK T1 §SEAM (1) — the cooling body can be STRUCK, and gains nothing', () => {
  it('⭐⭐ THE DISEASE AND ITS CURE: shut, the ball passes THROUGH him; armed, it hits him', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      expect(crossing(seed, false, 'cooldown').touched).toBe(false); // 球穿身, as shipped
      const open = crossing(seed, true, 'cooldown');
      expect(open.touched).toBe(true);
      expect(open.ledger.strikesAppliedCooldown).toBeGreaterThan(0);
    }
  });

  it('⭐⭐ (b) THE STUNNED BODY: a body on the ground still occupies space', () => {
    for (const seed of [SEED_A, SEED_B]) {
      expect(crossing(seed, false, 'stun').touched).toBe(false);
      const open = crossing(seed, true, 'stun');
      expect(open.touched).toBe(true);
      expect(open.ledger.strikesAppliedStunned).toBeGreaterThan(0);
    }
  });

  it('⭐⭐ NO CONTROL SUPERPOWER: the struck body never gains the ball off his own strike', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      for (const mode of ['cooldown', 'stun'] as const) {
        const open = crossing(seed, true, mode);
        expect(open.touched).toBe(true);
        expect(open.owned).toBe(false);     // he never owns it
        expect(open.attempted).toBe(false); // and no control attempt was ever opened naming him
        // the gate that excluded him was NOT cleared by being struck
        if (mode === 'cooldown') expect(open.target.kickCooldown).toBeGreaterThan(0);
        else expect(open.target.stunTimer).toBeGreaterThan(0);
      }
    }
    // ...and the CLEAN body — the same fixture with no cooldown at all — DOES open a control
    // attempt, which is the shipped path and proves the fixture can express the superpower
    // it just failed to find
    expect(crossing(SEED_A, true, 'clean').attempted).toBe(true);
  });

  it('⭐ the code says it too: the strike resolve opens no control, takes no ball', () => {
    const apply = matchSource.slice(
      matchSource.indexOf('  private bkApplyBodyStrike('),
      matchSource.indexOf('  private applyControlContact('),
    );
    expect(apply.length).toBeGreaterThan(400);
    for (const forbidden of ['giveBall', 'attemptFirstTouch', 'pendingControl = {', 'owner =']) {
      expect(apply).not.toContain(forbidden);
    }
    expect(apply).toContain('this.pendingControl = null');
  });

  it('⭐ sentOff stays excluded, and the LAST TOUCHER is excluded (passes still leave)', () => {
    expect(crossing(SEED_A, true, 'sentOff').touched).toBe(false);
    // the ball sitting inside the boot that just struck it is a self-contact artefact, not
    // 球穿身 (BK-C0 §3(b)'s own exclusion) — and it is what keeps KICK_COOLDOWN's stated job
    const own = crossing(SEED_A, true, 'lastToucher');
    expect(own.ledger.strikesApplied).toBe(0);
  });

  it('⭐ THE CLOSING CONDITION: a ball already LEAVING the shell is not a strike', () => {
    const out = crossing(SEED_A, true, 'outward');
    expect(out.ledger.strikeClaimsCooldown + out.ledger.strikeClaimsStunned).toBe(0);
    // the same geometry with the ball closing DOES strike — so the pin is about motion,
    // not about the fixture failing to place the ball
    expect(crossing(SEED_A, true, 'cooldown').ledger.strikesApplied).toBeGreaterThan(0);
  });
});

describe('BK T1 §EXISTENCE vs QUALITY — the split, made precise', () => {
  it('⭐⭐ EXISTENCE IS GEOMETRY: the collection carries no roll, on any seed', () => {
    const collect = matchSource.slice(
      matchSource.indexOf('  private bkCollectBodyStrikes('),
      matchSource.indexOf('  /**\n   * ⭐⭐ BK T1 §SEAM — resolving a body strike'),
    );
    expect(collect.length).toBeGreaterThan(400);
    for (const forbidden of ['rng', 'Math.random', 'chance(']) expect(collect).not.toContain(forbidden);
    // ...and behaviourally: the crossing lands on TWELVE different worlds, never refused
    for (let i = 0; i < 12; i++) {
      expect(crossing(SEED_A + i, true, 'cooldown').touched).toBe(true);
    }
  });

  it('⭐ QUALITY IS THE DEFLECT FAMILY\'S OWN TWO DRAWS, and nothing else', () => {
    const apply = matchSource.slice(
      matchSource.indexOf('  private bkApplyBodyStrike('),
      matchSource.indexOf('  private applyControlContact('),
    );
    expect((apply.match(/this\.rng\./g) ?? []).length).toBe(2);
    // both are the shipped tryDeflection outcome's own ranges — extracted from ITS named site
    const mechSource = readFileSync(new URL('../src/sim/mechanics.ts', import.meta.url), 'utf8');
    const deflect = mechSource.slice(
      mechSource.indexOf('export function tryDeflection('),
      mechSource.indexOf('export function trySmother('),
    );
    expect(deflect).toContain('match.rng.range(-1.2, 1.2)), match.rng.range(4, 8))');
    expect(apply).toContain('this.rng.range(-1.2, 1.2)');
    expect(apply).toContain('this.rng.range(4, 8)');
    // a passive body adds NO pace — the cap is a derivation, not a constant
    expect(apply).toContain('Math.min(incoming, this.rng.range(4, 8))');
  });

  it('⭐ OUT OF SCOPE, STATED: the blind/speed roll class and the one-contact order survive', () => {
    // the shipped blind roll (BK-C0: rollOrClaimOrder = 5.2 % / 0.18 %) is untouched…
    expect(matchSource).toContain('if (!this.rng.chance(pContact)) {');
    // …and so is the reach-margin mediator that picks ONE claim per tick
    expect(matchSource).toContain('if (remaining[i].reachMargin > remaining[first].reachMargin) first = i;');
  });
});

describe('BK T1 §SEAM (2) — the z bands PARTITION', () => {
  it('⭐⭐ THE DEAD BAND: untouchable when shut, ordinary when armed', () => {
    for (const seed of [SEED_A, SEED_B]) {
      // z = 1.325 sits in (CONTROL_MAX_HEIGHT, HEADER_MIN_HEIGHT): feet can't, heads won't
      expect(crossing(seed, false, 'deadBand').touched).toBe(false);
      const open = crossing(seed, true, 'deadBand');
      expect(open.touched).toBe(true);
      expect(open.ledger.partitionGroundTicks).toBeGreaterThan(0);
    }
  });

  it('⭐⭐ THE PARTITION IS CLOSED BY CONSTRUCTION — one edge, both sides', () => {
    // the two shipped constants, extracted from their NAMED declarations (canon: anchored
    // extraction, home BK-C0 §CORR item 1) — neither is edited by this seam
    expect(/export const CONTROL_MAX_HEIGHT = ([0-9.]+);/.exec(constantsSource)![1]).toBe('1.3');
    expect(/export const HEADER_MIN_HEIGHT = ([0-9.]+);/.exec(constantsSource)![1]).toBe('1.35');
    expect(CONTROL_MAX_HEIGHT).toBe(1.3);
    expect(HEADER_MIN_HEIGHT).toBe(1.35);
    // the ARMED dispatch: feet strictly below the header floor, heads at it and above
    expect(matchSource).toContain(
      'const aerialOnly = this.bkContactLaw ? ball.z >= HEADER_MIN_HEIGHT : ball.z > CONTROL_MAX_HEIGHT;',
    );
    // …and `tryAerial`'s own floor is the SAME number, so the armed edge meets it exactly
    const mechSource = readFileSync(new URL('../src/sim/mechanics.ts', import.meta.url), 'utf8');
    expect(mechSource).toContain('if (ball.z < HEADER_MIN_HEIGHT || ball.z > GK_CLAIM_HEIGHT) return;');
  });

  it('⭐ NAMED OUT: above GK_CLAIM_HEIGHT stays untouchable, and that is not a partition defect', () => {
    // BK-C0's `aboveGkClaim` (11.0 % of reach crossings) is honest physics — a ball 3 m up is
    // out of a standing body's reach. T1 does not widen it, and the shipped guard is intact.
    const mechSource = readFileSync(new URL('../src/sim/mechanics.ts', import.meta.url), 'utf8');
    expect(mechSource).toContain('if (ball.z > GK_CLAIM_HEIGHT) return; // sailing over the keeper\'s hands');
  });
});

describe('BK T1 §FLAG SEMANTICS — it composes freely, and owns no refusal', () => {
  it('⭐⭐ THE POWER SET BUILDS: {bkFacingLaw, bkContactLaw} × the world-8 stack', () => {
    for (const facing of [false, true]) {
      for (const bk of [false, true]) {
        const m = matchOf(SEED_A, { armed: true, facing, bk });
        expect(m.bkContactLaw).toBe(bk);
        expect(m.bkFacingLaw).toBe(facing);
      }
    }
  });

  it('⭐⭐ INDEPENDENCE: it needs no wind-up channel, and it does NOT rescue BK-T0\'s refusal', () => {
    // alone, with NEITHER wind-up channel: perfectly legal — it owns its own sites
    const alone = new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      c7Windup: false, o1PassWindup: false, bkContactLaw: true,
    });
    expect(alone.bkContactLaw).toBe(true);
    // but it cannot make an INERT facing law legal — that door stays shut and loud
    expect(() => new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      c7Windup: false, o1PassWindup: false, bkFacingLaw: true, bkContactLaw: true,
    })).toThrow(/INERT WITHOUT A WIND-UP CHANNEL/);
  });

  it('⭐ no constructor refusal anywhere names this flag', () => {
    for (const chunk of matchSource.split('throw new Error(').slice(1)) {
      expect(chunk.slice(0, 600)).not.toContain('bkContactLaw');
    }
  });
});

describe('BK T1 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  const src = (rel: string): string => readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
  const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;

  it('⭐⭐ THE CENSUS\'S MOST-QUOTED CITATION, PINNED (BK-C0 §CORR item 5)', () => {
    // BK-C0 cited this gate as `Match.ts:4562` — correct at the census commit `e310401`,
    // ALREADY 4701 at BK-T1's freeze HEAD (139 lines of drift in two slices). The pin is the
    // anchored TEXT plus its occurrence count; the line number is reported, never asserted,
    // because it is the thing that drifts (canon: anchored extraction, home BK-C0 §CORR 1).
    const gate = 'if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;';
    const lines = matchSource.split('\n');
    const hits = lines
      .map((l, i) => (l.includes(gate) ? i + 1 : 0))
      .filter((n) => n > 0);
    expect(hits.length).toBe(1); // ⭐ EXACTLY ONE site — the claim filter BK-T1 was dispatched at
    expect(lines[hits[0] - 1].trim()).toBe(gate); // …and it is the WHOLE statement, unedited
    // it lives inside `collectGroundContactClaims`, and BK-T1 appends its channel AFTER it
    const collect = matchSource.slice(
      matchSource.indexOf('  private collectGroundContactClaims('),
      matchSource.indexOf('  private bkCollectBodyStrikes('),
    );
    expect(collect).toContain(gate);
    expect(collect).toContain('if (this.bkContactLaw) this.bkCollectBodyStrikes(order, claims);');
  });

  it('⭐⭐ THE PREFIX `bkContact` — every occurrence, counted and sited', () => {
    // PREFIX STATED (#307 §CORR 3): the needle family is `bkContact*`.
    expect(count(matchSource, /bkContactLaw/g)).toBe(10);
    expect(count(matchSource, /bkContactLedger/g)).toBe(4);
    expect(count(matchSource, /bkCollectBodyStrikes\(/g)).toBe(2); // 1 call + 1 declaration
    expect(count(matchSource, /bkApplyBodyStrike\(/g)).toBe(2);    // 1 call + 1 declaration
    expect(count(matchSource, /'bodyStrike'/g)).toBe(3);           // type + produce + consume
    // the two SEAM SITES, one each
    expect(count(matchSource, /if \(this\.bkContactLaw\) this\.bkCollectBodyStrikes\(order, claims\);/g)).toBe(1);
    expect(count(matchSource, /const aerialOnly = this\.bkContactLaw \?/g)).toBe(1);
    // nothing outside Match.ts contains the prefix at all
    for (const rel of ['ai/PlayerBrain.ts', 'sim/mechanics.ts', 'sim/Player.ts', 'sim/physical.ts',
      'sim/constants.ts', 'game/a4World.ts', 'ai/actionExecutor.ts']) {
      expect(src(rel)).not.toContain('bkContact');
    }
  });

  it('⭐ THE SHELL IS THE ENGINE\'S OWN — `coreRadius + ball.radius`, physical.ts\'s clearance', () => {
    // canon: a src-extracted quantity pins its extraction to the NAMED call site
    expect(src('sim/physical.ts')).toContain('const clearance = blockerCoreRadius + ball.radius;');
    expect(matchSource).toContain('const shell = p.coreRadius + ball.radius;');
    // and the shell really is the CORE, not the 1.25 m reach
    expect(/export const PLAYER_CORE_RADIUS = ([A-Z_]+) \/ 2;/.test(constantsSource)).toBe(true);
    expect(PLAYER_CORE_RADIUS).toBeCloseTo(0.525, 10);
  });
});

describe('BK T1 — the production world is untouched', () => {
  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    expect(new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) }).bkContactLaw).toBe(false);
  });
});
