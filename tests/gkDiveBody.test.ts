import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match, type PendingShot } from '../src/sim/Match';
import type { Player } from '../src/sim/Player';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { tryKeeperSave } from '../src/sim/mechanics';
import { executeAction } from '../src/ai/actionExecutor';
import { randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐ GK T0b — THE DIVE LAW RE-FORMED 「身体跟着手走 · 重形」 (docs/world-model/GK-T0-DIVE-LAW.md;
 * contract GK-KEEPER-BODY-CONTRACT.md; COMMANDER RULING #399 items 3–4) — THE SEAM'S
 * PERMANENT PIN SUITE, in the house form (`lnOwnLane.test.ts` / `bqCushion.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * GK-C0 measured the user's sentence 「门将…突然瞬移到球的那个地方」 and found THE HANDS
 * WITHOUT THE BODY. GK-T0 built the seam and ruling #399 struck the LAW: the caught ball's
 * jump was merely DEFERRED to the animation window's expiry, because the enumerated keeper
 * cases never fired for a keeper who OWNS the ball. The re-form:
 *
 *   • M-GK.2′ — the executor steers the keeper to the contact on EVERY tick while
 *     `saveContact` is set, WHATEVER his action. The keeper is the ONLY body that ever
 *     carries a contact, so the field IS the scope — pinned on every body of every tick.
 *   • M-GK.3′ — the contact carries a `caught` mark, set true ONLY in the catch branch. A
 *     caught ball WAITS at the hands until the body ARRIVES (its carry point within `carry`
 *     of the contact) or until the keeper LOSES OWNERSHIP. NEVER until the sprite's timer.
 *     A parry contact is steer-only and dies with that timer.
 *
 * The pins:
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte (score, phase, ball
 *     pos/vel/z/vz, every body's pos/vel/heading/stamina, AND the rng stream state), on
 *     twelve scratch seeds, in the BARE world AND world 13 AND world 14, full matches.
 *   • ⭐⭐ G-NULL — the OFF path executes no new assignment: `saveContact` is null on every
 *     body on every tick of a full match that CONTAINS saves.
 *   • ⭐⭐ G-NOSAVE · G-BITE · G-SAVE-IDENTITY (lockstep outcome-at-save, ≥ 1 save per seed).
 *   • ⭐⭐ M-GK.1 — the TWO writes: the contact IS the ball's own position at the save tick on
 *     BOTH branches, `caught: true` on the catch and `caught: false` on the parry; the failed
 *     roll writes nothing; the decrement clears a PARRY contact and NEVER a caught one.
 *   • ⭐⭐ M-GK.2′ — NO OUTFIELD BODY EVER HAS A CONTACT (armed matches, every body, every
 *     tick); the body closes on the contact under the REAL brain's post-catch action
 *     (`HoldPosition` / `MoveToFormationSpot` — the very cases GK-T0 did not cover); the
 *     steering CONTINUES after `saveAnimTimer` reaches 0 (the OLD law's timer-clear fails
 *     this); the arrival arithmetic and its PUBLISHED shortfall from rest.
 *   • ⭐⭐ M-GK.3′ — THE 2.5 m CATCH walked with the FULL `m.step(DT)` over the WHOLE episode
 *     from the catch tick to the first tick after release, per-tick displacement recorded
 *     EVERY tick with NO scoping by `saveContact`: exactly 0 while waiting, and on an ARRIVAL
 *     release at most `carry`; the arrival time in ticks as a RECEIPT; the ball then follows
 *     the shipped carry law; a wait ended by OWNERSHIP LOSS leaves the ball where the engine
 *     puts it; a REGATHERED PARRY is never pinned; and the `gkFeet` contest exposure reported
 *     as a receipt, not a claim.
 *   • ⭐⭐ THE ANCHORS — the flag's and the field's occurrence counts per file with every site
 *     enumerated, exactly TWO `saveContact` writes, ONE waiting branch, ONE ownership-loss
 *     sweep, ONE executor override with NO action-type enumeration, `a4World.ts` and every
 *     preset free of the flag, no env.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite, and the suite RUNS it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,004,800–899 and
 * 900,005,000–099 (canon, VERBATIM: "verifier scratch walks use the stage's own consumed band
 * or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"; home:
 * PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6). ZERO frontier consumption.
 *
 * ⭐ Receipts are receipts (home: ruling #289 item 1): the fixture metres and tick counts
 * below are ARMING PLUMBING — the law's arithmetic proved on a handful of bodies — and are
 * never quoted as football effect sizes. What the dive BUYS is GK-T1's question.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ OUT-OF-BAND SCRATCH SEEDS — GK-T0's own band, 900,004,800–899. */
const SEEDS: readonly number[] = Array.from({ length: 12 }, (_, i) => 900_004_800 + i);
const FIXTURE_BASE = 900_004_840;
/**
 * ⚠ THE SECOND OUT-OF-BAND SCRATCH BAND — GK-T0b's own, 900,005,000–099.
 * ⭐ EIGHT seeds, not three: a CATCH is the rare save family (GK-C0's `catch.share`), and the
 * pin below is only teeth if a CAUGHT contact was actually seen — it asserts exactly that,
 * and the first three seeds of the band contain none.
 */
const INPLAY_SEEDS: readonly number[] = Array.from({ length: 8 }, (_, i) => 900_005_000 + i);

/** The two composed worlds of record beside the bare one. */
const W13 = 13 as const;
const W14 = 14 as const;
type WorldArm = undefined | typeof W13 | typeof W14;

/** ⭐ THE CENSUS ITSELF — every census number this suite pins is READ OFF THE ARTIFACT by
 *  FIELD NAME (canon "doc-prose fidelity"), never typed. */
const CENSUS = JSON.parse(readFileSync(
  'docs/world-model/data/gk-c0-keeper-jump-census.json', 'utf8',
)) as {
  faces: { face: string; arm: string; value: number }[];
  bins: Record<string, Record<string, { width: number; bins: number; pooled: number[] }>>;
};
const face = (name: string): number => {
  const row = CENSUS.faces.find((f) => f.face === name && f.arm === 'E13');
  if (row === undefined) throw new Error(`no E13 face ${name}`);
  return row.value;
};
/** The census's mean reconstructed `keeperReach` and its fingertip envelope. */
const CENSUS_REACH = face('save.meanReconstructedReachMetres');
const CENSUS_REACH_STRETCH = face('save.meanReachTimesStretchMetres');
/** The largest `dNow` the census STORED: the upper edge of the top non-empty bin. */
const CENSUS_MAX_SAVE_DISTANCE = ((): number => {
  const b = CENSUS.bins.E13.saveDistanceM;
  let top = -1;
  b.pooled.forEach((n, i) => { if (n > 0) top = i; });
  return (top + 1) * b.width;
})();
/** The engine's own window, read off the ONE line that sets it (anchored below). */
const SAVE_WINDOW_S = 0.7;

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
  gk?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  gkExplicitFalse?: boolean;
  /** the composed world, or bare */
  world?: WorldArm;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined ? {} : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: a.duration ?? 240,
    ...base,
    ...(a.gk === true ? { gkDiveBody: true } : {}),
    ...(a.gkExplicitFalse === true ? { gkDiveBody: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/**
 * ⭐⭐ THE WORLD-IDENTITY SIGNATURE (the house form, `lnOwnLane.test.ts`): the trace PLUS
 * the ball's height channel, every body's velocity and stamina, the phase, and — the last
 * thing the digest eats — ONE DRAW off the finished match's own rng. A draw is a pure
 * function of the stream state, so an equal digest means the two arms consumed the same
 * number of draws in the same order as well as reaching the same world.
 */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  const phases: string[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(
        m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.ball.z, m.ball.vz,
        m.score[0], m.score[1],
      );
      phases.push(m.phase);
      for (const t of m.teams) {
        for (const p of t.players) {
          trace.push(
            p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.heading.x, p.heading.y, p.stamina,
          );
        }
      }
    }
  }
  const r = m.getResult();
  const rngProbe = m.rng.next();
  return createHash('sha256').update(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)), phases,
    score: r.score, stats: r.stats, events: r.events.length, ticks, rngProbe,
  })).digest('hex');
};

const digest = (xs: readonly string[]): string =>
  createHash('sha256').update(xs.join('|')).digest('hex');

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const matchSource = src('sim/Match.ts');
const leagueSource = src('sim/League.ts');
const playerSource = src('sim/Player.ts');
const mechSource = src('sim/mechanics.ts');
const execSource = src('ai/actionExecutor.ts');
const a4Source = src('game/a4World.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});

/** ⭐ MEMOISED so the bite arm is compared against ONE computed control. */
const offCache = new Map<string, string>();
const offSignature = (seed: number, world: WorldArm): string => {
  const key = `${seed}:${world ?? 0}`;
  const hit = offCache.get(key);
  if (hit !== undefined) return hit;
  const sig = signatureOf(matchOf(seed, world === undefined ? {} : { world }));
  offCache.set(key, sig);
  return sig;
};

/* ------------------------------------------------------------------ */
/* THE FIXTURES                                                        */
/* ------------------------------------------------------------------ */

interface SaveScene {
  m: Match; gk: Player; shooter: Player; kind: 'catch' | 'parry' | 'none';
  ballAtSave: { x: number; y: number };
  seed: number;
}

/**
 * A HAND-BUILT SAVE. The keeper is placed in front of his own goal with his reach FIXED by
 * his own genes (`keeperReach` = 2.05 + aggression·0.4 + (reflexes − 0.5)·0.5), the ball is
 * placed exactly `d` metres to one side of him travelling goalward at `speed`, and
 * `tryKeeperSave` is called ONCE. The catch branch needs `speed < 21`; a faster ball can
 * only be parried, which is how the parry fixture is built without touching a roll. The
 * SAVE ROLL is the engine's own — the scene walks its own scratch seeds until the engine
 * produces the wanted outcome, and every number below is read off the result.
 */
const saveScene = (
  arm: Arm,
  opts: {
    d: number; speed: number; want: 'catch' | 'parry'; topSpeed?: number;
    /** 'y' (the ruling's own fixture — the contact BESIDE him) or 'x' (the contact AHEAD of
     *  him, on the line his hold-facing already points down). */
    axis?: 'y' | 'x';
    /** stand him 20 m off his line ⇒ `giveBall`'s `gkFeet` gate ⇒ a catch with NO hold. */
    outsideBox?: boolean;
  },
): SaveScene => {
  for (let seed = FIXTURE_BASE; seed < FIXTURE_BASE + 60; seed++) {
    const m = matchOf(seed, { ...arm, duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    const def = m.teams[1];
    const att = m.teams[0];
    const gk = def.goalkeeper;
    const shooter = att.players[5];
    for (const g of [def.info.genome, def.baseGenome, def.effGenome] as TacticalGenome[]) {
      g.keeperAggression = 1;
    }
    gk.attrs = { ...gk.attrs, reflexes: 1 };
    if (opts.topSpeed !== undefined) gk.baseSpeed = opts.topSpeed;
    gk.stamina = 1;
    const goal = def.ownGoal();
    const inward = goal.x > 0 ? -1 : 1;
    gk.pos = { x: goal.x + inward * (opts.outsideBox === true ? 20 : 6), y: 0 };
    gk.vel = { x: 0, y: 0 };
    gk.kickCooldown = 0;
    gk.saveAnimTimer = 0;
    const ball = m.ball;
    ball.owner = null;
    ball.pos = opts.axis === 'x'
      ? { x: gk.pos.x + inward * opts.d, y: 0 }
      : { x: gk.pos.x, y: opts.d };
    ball.z = 0;
    ball.vz = 0;
    // goalward, and receding from the keeper in y so the fingertip branch is reachable too
    const dx = goal.x - ball.pos.x;
    const nx = dx > 0 ? 1 : -1;
    ball.vel = opts.axis === 'x'
      ? { x: nx * opts.speed, y: 0.5 }
      : { x: nx * opts.speed, y: opts.d > 0 ? 0.5 : -0.5 };
    ball.lastTouch = shooter;
    m.pendingPass = null;
    m.pendingShot = {
      side: 0, shooterGid: shooter.gid, xg: 0.05, t: m.simTime, resolved: false,
      logIndex: -1, assistGid: null, difficulty: 1,
    } as PendingShot;
    const before = m.events.length;
    const ballAtSave = { x: ball.pos.x, y: ball.pos.y };
    tryKeeperSave(m);
    const fresh = m.events.slice(before).filter((e) => e.type === 'save');
    const kind: 'catch' | 'parry' | 'none' = fresh.length === 0 ? 'none'
      : fresh[0].text.includes('catches it') ? 'catch'
        : fresh[0].text.includes('parries!') ? 'parry' : 'none';
    if (kind === opts.want) return { m, gk, shooter, kind, ballAtSave, seed };
  }
  throw new Error(`no ${opts.want} in the fixture band at d=${opts.d}`);
};

/**
 * THE ARRIVAL FIXTURE — M-GK.2's arithmetic ALONE, on one shipped body. The keeper is given
 * a contact point `d` metres away and the engine's own window, and is then driven by the
 * SHIPPED executor and the SHIPPED integrator (`physicsStep` — the only position integrator)
 * for the whole window. `GoalkeeperRush` is the un-clamped keeper case, so what this
 * measures is the travel and nothing else.
 */
const arrivalFixture = (d: number, baseSpeed?: number): {
  start: number; end: number; ticks: number; topSpeed: number; gk: Player;
} => {
  const m = matchOf(FIXTURE_BASE, { gk: true, duration: 600 });
  while (m.phase !== 'playing') m.step(DT);
  const def = m.teams[1];
  const gk = def.goalkeeper;
  if (baseSpeed !== undefined) gk.baseSpeed = baseSpeed;
  gk.stamina = 1;
  gk.pos = { x: 0, y: 0 };
  gk.vel = { x: 0, y: 0 };
  gk.heading = { x: 1, y: 0 };
  gk.saveAnimTimer = SAVE_WINDOW_S;
  gk.saveContact = { x: 0, y: d, caught: false };
  gk.action = {
    type: 'GoalkeeperRush', scores: [{ action: 'GoalkeeperRush', score: 1, why: 'fixture' }],
  };
  const topSpeed = gk.topSpeed;
  const start = Math.hypot(gk.pos.x - gk.saveContact.x, gk.pos.y - gk.saveContact.y);
  let ticks = 0;
  let last = start;
  while (gk.saveAnimTimer > 0 && ticks < 200) {
    executeAction(gk, m, DT);
    gk.physicsStep(DT);
    ticks++;
    if (gk.saveContact !== null) {
      last = Math.hypot(gk.pos.x - gk.saveContact.x, gk.pos.y - gk.saveContact.y);
    }
  }
  return { start, end: last, ticks, topSpeed, gk };
};

/* ------------------------------------------------------------------ */

describe('GK T0b — Road B: the dive law is DORMANT', () => {
  it('⭐⭐ THE PROHIBITION SET — no world, no preset, no env, no bundle names the flag', () => {
    expect(count(a4Source, /gkDiveBody/g)).toBe(0);
    expect(count(a4Source, /saveContact/g)).toBe(0);
    const VERSIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;
    for (const v of VERSIONS) {
      expect(Object.prototype.hasOwnProperty.call(a4MatchFlags(v), 'gkDiveBody')).toBe(false);
    }
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.gkDiveBody).toBe(false);
    for (const w of [W13, W14] as const) {
      expect(matchOf(SEEDS[0], { world: w }).gkDiveBody).toBe(false);
    }
    const league = new League({ seed: 4242 });
    expect(league.createMatch(league.nextFixture()!).gkDiveBody).toBe(false);
    // no env or bundle door anywhere in src/**
    for (const file of srcFiles('src')) {
      const text = readFileSync(file, 'utf8');
      if (!text.includes('gkDiveBody')) continue;
      expect(['sim/Match.ts', 'sim/League.ts', 'sim/mechanics.ts', 'ai/actionExecutor.ts',
        'sim/Player.ts'].some((tail) => file.replace(/\\/g, '/').endsWith(tail))).toBe(true);
      expect(text).not.toContain('EDS_BUNDLE_ARMED && cfg.gkDiveBody');
      expect(/process\.env[^\n]*gkDiveBody/.test(text)).toBe(false);
    }
  });

  it('⭐ NO SERIALIZATION — the flag and the field never enter a save', () => {
    const league = new League({ seed: 99 });
    const json = JSON.stringify(league.toJSON());
    expect(json).not.toContain('gkDiveBody');
    expect(json).not.toContain('saveContact');
  });

  it('⭐⭐ G-OFF: flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte — bare, world 13, world 14', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [undefined, W13, W14] as const) {
      for (const seed of SEEDS) {
        absent.push(offSignature(seed, world));
        explicitFalse.push(signatureOf(matchOf(seed, {
          gkExplicitFalse: true, ...(world === undefined ? {} : { world }),
        })));
      }
    }
    expect(explicitFalse).toEqual(absent);
    expect(digest(explicitFalse)).toBe(digest(absent));
    // one distinct cell per (world × seed): the pin is not comparing a degenerate constant
    expect(new Set(absent).size).toBe(SEEDS.length * 3);
  }, 600_000);

  it('⭐⭐ G-NULL: the OFF path executes NO new assignment — the field is null every tick', () => {
    const m = matchOf(SEEDS[0], { world: W13 });
    let ticks = 0;
    let saves = 0;
    let seen = 0;
    while (!m.finished && ticks < 60_000) {
      m.step(DT);
      ticks++;
      for (const t of m.teams) {
        for (const p of t.players) {
          expect(p.saveContact).toBeNull();
          seen++;
        }
      }
      saves = m.events.filter((e) => e.type === 'save').length;
    }
    // the pin is NOT vacuous: this match really did contain saves
    expect(saves).toBeGreaterThan(0);
    expect(seen).toBeGreaterThan(0);
  }, 120_000);

  it('⭐⭐ G-NOSAVE: flag ON with no save ever rolled ≡ OFF', () => {
    // a scene the ball never leaves: both arms walked from the same fixture construction,
    // stepped only while NO save event has fired. The armed arm executes every guarded
    // statement and writes nothing, because nothing ever set a contact point.
    const shut = matchOf(FIXTURE_BASE + 1, { duration: 30 });
    const armed = matchOf(FIXTURE_BASE + 1, { gk: true, duration: 30 });
    let ticks = 0;
    while (!shut.finished && ticks < 3_000) {
      shut.step(DT);
      armed.step(DT);
      ticks++;
      if (armed.events.some((e) => e.type === 'save')) break;
      expect(armed.ball.pos.x).toBe(shut.ball.pos.x);
      expect(armed.ball.pos.y).toBe(shut.ball.pos.y);
      for (let s = 0; s < 2; s++) {
        for (let i = 0; i < TEAM_SIZE; i++) {
          expect(armed.teams[s].players[i].pos.x).toBe(shut.teams[s].players[i].pos.x);
          expect(armed.teams[s].players[i].pos.y).toBe(shut.teams[s].players[i].pos.y);
          expect(armed.teams[s].players[i].saveContact).toBeNull();
        }
      }
    }
    expect(ticks).toBeGreaterThan(100);
  }, 120_000);

  it('⭐⭐ G-BITE: flag ON MOVES the world — bare, world 13, world 14', () => {
    for (const world of [undefined, W13, W14] as const) {
      let moved = 0;
      for (const seed of SEEDS) {
        const armed = signatureOf(matchOf(seed, {
          gk: true, ...(world === undefined ? {} : { world }),
        }));
        if (armed !== offSignature(seed, world)) moved++;
      }
      expect(moved).toBeGreaterThan(0);
    }
  }, 600_000);

  it('⭐⭐ G-SAVE-IDENTITY: every save event and every shotLog outcome identical in lockstep', () => {
    const worldSig = (m: Match): string => JSON.stringify([
      m.ball.pos, m.ball.vel, m.ball.z, m.ball.vz, m.score, m.phase,
      m.teams.map((t) => t.players.map((p) => [p.pos.x, p.pos.y, p.vel.x, p.vel.y])),
    ]);
    const outcomes = (m: Match): string => JSON.stringify(m.shotLog.map((e) => e.outcome));
    const savesOf = (m: Match, from: number): string => JSON.stringify(
      m.events.slice(from).filter((e) => e.type === 'save').map((e) => [e.t, e.side, e.text]),
    );
    let compared = 0;
    for (const seed of SEEDS) {
      const shut = matchOf(seed, { world: W13 });
      const armed = matchOf(seed, { gk: true, world: W13 });
      let ticks = 0;
      let diverged = false;
      let ea = 0;
      let eb = 0;
      let perSeed = 0;
      while (!shut.finished && !armed.finished && ticks < 60_000) {
        if (!diverged && worldSig(shut) !== worldSig(armed)) diverged = true;
        shut.step(DT);
        armed.step(DT);
        ticks++;
        const sa = savesOf(shut, ea);
        const sb = savesOf(armed, eb);
        const n = shut.events.slice(ea).filter((e) => e.type === 'save').length;
        ea = shut.events.length;
        eb = armed.events.length;
        if (!diverged) {
          expect(sb).toBe(sa);
          expect(outcomes(armed)).toBe(outcomes(shut));
          perSeed += n;
          compared += n;
        }
        if (!diverged && worldSig(shut) !== worldSig(armed)) diverged = true;
      }
      // ⭐ NON-VACUOUS PER SEED: at least the save that CREATED the first contact point was
      // compared on both arms — divergence cannot precede it.
      expect(perSeed).toBeGreaterThan(0);
    }
    expect(compared).toBeGreaterThanOrEqual(SEEDS.length);
  }, 600_000);
});

/**
 * ⭐⭐ THE EPISODE WALKER (ruling #399 item 3(iv)) — the whole of M-GK.3′'s measurement.
 *
 * From the tick the save resolved, the scene is walked with the FULL `m.step(DT)` — the real
 * brains, the real executor, the real integrator, the real carry law — and the ball's per-tick
 * displacement is recorded on EVERY tick, with NO scoping by `saveContact`. That scoping is
 * exactly the hole ruling #399 item 1(i) struck: the OLD suite looped `while (saveContact !==
 * null)` and could not see the tick the field was nulled, which is the tick the ball jumped.
 *
 * The walk ends on the FIRST TICK AFTER THE RELEASE, whichever release fired, and reports
 * which one it was:
 *   • ARRIVAL — the keeper still owns the ball on the release tick (the carry law consumed
 *     the contact because his carry point came within `carry` of it).
 *   • OWNERSHIP-LOSS — he does not (he kicked it, or it was taken, or the ball went dead);
 *     the sweep above `stepBall` voided the claim.
 */
interface Episode {
  /** every tick's ball displacement, in order, from the catch tick onward */
  disp: number[];
  /** the ball displacement on the tick the contact was released */
  releaseDisp: number;
  /** ticks of waiting BEFORE the release tick */
  waitTicks: number;
  /** 1-based index of the release tick within `disp` */
  releaseTick: number;
  release: 'arrival' | 'ownershipLoss' | 'none';
  /** the `carry` in force on the release tick — 0.3 while he holds/distributes, else 0.85 */
  carryAtRelease: number;
  /** |carry point − contact| on the release tick: the law's OWN arrival predicate */
  carryPointAtRelease: number;
  /** |body − contact| on the release tick (a receipt, not the predicate) */
  bodyAtRelease: number;
  /** the first tick (1-based, from the catch) on which |body − contact| < `carry` */
  bodyWithinCarryTick: number;
  /** the ball's displacement on the tick AFTER the release */
  afterDisp: number;
  /** |ball − (owner.pos + heading·carry)| on the tick after an arrival release */
  afterCarryResidual: number;
  /** ticks on which the ball sat EXACTLY on the contact point */
  heldAtContact: number;
  /** the action types the real brain gave the keeper while the contact was set */
  actions: Set<string>;
  /** |body − contact| on the tick `saveAnimTimer` first reached 0, and 30 ticks later */
  bodyAtTimerZero: number;
  bodyThirtyAfterTimerZero: number;
  contactAliveAfterTimerZero: boolean;
}

const walkEpisode = (scene: SaveScene, maxTicks = 3_000): Episode => {
  const { m, gk } = scene;
  const contact = { x: gk.saveContact!.x, y: gk.saveContact!.y };
  const out: Episode = {
    disp: [], releaseDisp: NaN, waitTicks: 0, releaseTick: -1, release: 'none',
    carryAtRelease: NaN, carryPointAtRelease: NaN, bodyAtRelease: NaN,
    bodyWithinCarryTick: -1, afterDisp: NaN, afterCarryResidual: NaN, heldAtContact: 0,
    actions: new Set<string>(), bodyAtTimerZero: NaN, bodyThirtyAfterTimerZero: NaN,
    contactAliveAfterTimerZero: false,
  };
  let timerZeroAt = -1;
  let prev = { x: m.ball.pos.x, y: m.ball.pos.y };
  for (let tick = 1; tick <= maxTicks; tick++) {
    const had = gk.saveContact !== null;
    const ownedBefore = m.ball.owner === gk;
    const carry = gk.gkHoldTimer > 0 || (gk.role === 'GK' && gk.gkDistributing) ? 0.3 : 0.85;
    if (had) out.actions.add(gk.action.type);
    m.step(DT);
    const disp = Math.hypot(m.ball.pos.x - prev.x, m.ball.pos.y - prev.y);
    out.disp.push(disp);
    const bodyD = Math.hypot(gk.pos.x - contact.x, gk.pos.y - contact.y);
    if (had && gk.saveAnimTimer === 0 && timerZeroAt < 0) {
      timerZeroAt = tick;
      out.bodyAtTimerZero = bodyD;
      out.contactAliveAfterTimerZero = gk.saveContact !== null;
    }
    if (timerZeroAt > 0 && tick === timerZeroAt + 30) out.bodyThirtyAfterTimerZero = bodyD;
    if (had && gk.saveContact !== null) {
      out.waitTicks++;
      if (out.bodyWithinCarryTick < 0 && bodyD < carry) out.bodyWithinCarryTick = tick;
      if (m.ball.pos.x === contact.x && m.ball.pos.y === contact.y) out.heldAtContact++;
    }
    if (had && gk.saveContact === null) {
      out.releaseTick = tick;
      out.releaseDisp = disp;
      out.carryAtRelease = carry;
      out.bodyAtRelease = bodyD;
      out.carryPointAtRelease = Math.hypot(
        gk.pos.x + gk.heading.x * carry - contact.x,
        gk.pos.y + gk.heading.y * carry - contact.y,
      );
      out.release = ownedBefore && m.ball.owner === gk ? 'arrival' : 'ownershipLoss';
      const at = { x: m.ball.pos.x, y: m.ball.pos.y };
      m.step(DT);
      out.afterDisp = Math.hypot(m.ball.pos.x - at.x, m.ball.pos.y - at.y);
      if (m.ball.owner === gk) {
        const c2 = gk.gkHoldTimer > 0 || gk.gkDistributing ? 0.3 : 0.85;
        out.afterCarryResidual = Math.hypot(
          m.ball.pos.x - (gk.pos.x + gk.heading.x * c2),
          m.ball.pos.y - (gk.pos.y + gk.heading.y * c2),
        );
      }
      break;
    }
    prev = { x: m.ball.pos.x, y: m.ball.pos.y };
  }
  return out;
};

/* ------------------------------------------------------------------ */

describe('GK T0b §M-GK.1 — THE CONTACT POINT, AND THE `caught` MARK', () => {
  it('⭐⭐ the contact IS the ball\'s own position at the save tick — catch marks TRUE, parry FALSE', () => {
    for (const want of ['catch', 'parry'] as const) {
      const scene = saveScene({ gk: true }, {
        d: want === 'catch' ? 2.5 : 2, speed: want === 'catch' ? 10 : 25, want,
      });
      expect(scene.kind).toBe(want);
      expect(scene.gk.saveContact).not.toBeNull();
      expect(scene.gk.saveContact!.x).toBe(scene.ballAtSave.x);
      expect(scene.gk.saveContact!.y).toBe(scene.ballAtSave.y);
      // ⭐⭐ THE MARK IS THE BRANCH — this is the whole of ruling #399 item 1(iii)'s fix.
      expect(scene.gk.saveContact!.caught).toBe(want === 'catch');
      // MUTANT — the OWNER-RELATIVE frame (the keeper's own position, or an offset from it)
      // is a DIFFERENT point on this fixture: the contact is the BALL's, not the body's.
      expect(scene.gk.saveContact!.y).not.toBe(scene.gk.pos.y);
      const ownerRelative = {
        x: scene.gk.pos.x + scene.gk.heading.x * 0.3, y: scene.gk.pos.y + scene.gk.heading.y * 0.3,
      };
      expect(scene.gk.saveContact!.y).not.toBe(ownerRelative.y);
      // and the SAME scene shut records nothing at all
      const shut = saveScene({}, {
        d: want === 'catch' ? 2.5 : 2, speed: want === 'catch' ? 10 : 25, want,
      });
      expect(shut.gk.saveContact).toBeNull();
      // ⭐ ONLY THE CATCH OWNS THE BALL — the two branches really are two different worlds
      expect(scene.m.ball.owner === scene.gk).toBe(want === 'catch');
      // ⭐⭐ GK-T0c: the CATCH write now runs AFTER `match.giveBall(gk)`, and the recorded
      // value is IDENTICAL because `giveBall` never writes `ball.pos` — it zeroes the
      // velocity and sets z / vz / spin. Pinned on the ball itself, not on the claim.
      expect(scene.m.ball.pos.x).toBe(scene.ballAtSave.x);
      expect(scene.m.ball.pos.y).toBe(scene.ballAtSave.y);
    }
  }, 120_000);

  it('⭐⭐ the field is NEVER set when the save roll FAILS', () => {
    // the same construction, walked over the whole fixture band: on every seed where the
    // engine rolled NO save, the contact point is null and the window never opened.
    let failures = 0;
    for (let seed = FIXTURE_BASE; seed < FIXTURE_BASE + 60; seed++) {
      const m = matchOf(seed, { gk: true, duration: 600 });
      while (m.phase !== 'playing') m.step(DT);
      const def = m.teams[1];
      const gk = def.goalkeeper;
      const goal = def.ownGoal();
      const inward = goal.x > 0 ? -1 : 1;
      gk.pos = { x: goal.x + inward * 6, y: 0 };
      gk.saveAnimTimer = 0;
      gk.saveContact = null;
      const ball = m.ball;
      ball.owner = null;
      ball.pos = { x: gk.pos.x, y: 2 };
      ball.z = 0;
      ball.vz = 0;
      ball.vel = { x: (goal.x - ball.pos.x) > 0 ? 10 : -10, y: 0.5 };
      m.pendingShot = {
        side: 0, shooterGid: m.teams[0].players[5].gid, xg: 0.9, t: m.simTime, resolved: false,
        logIndex: -1, assistGid: null, difficulty: 1,
      } as PendingShot;
      const before = m.events.length;
      tryKeeperSave(m);
      const saved = m.events.slice(before).some((e) => e.type === 'save');
      if (!saved) {
        failures++;
        expect(gk.saveContact).toBeNull();
      } else {
        expect(gk.saveContact).not.toBeNull();
      }
    }
    // the pin is NOT vacuous: the band really does contain failed rolls
    expect(failures).toBeGreaterThan(0);
  }, 120_000);

  it('⭐⭐ THE DECREMENT CLEARS A PARRY CONTACT AND NEVER A CAUGHT ONE', () => {
    // ⭐⭐ THE LESSON OF RECORD (#399 item 2): the sprite's window and the law's window are
    // DIFFERENT THINGS. Steer-only (a parry) ends with the sprite; a caught ball's claim does
    // not — it is released by ARRIVAL or by the LOSS OF OWNERSHIP, and by nothing else.
    const m = matchOf(FIXTURE_BASE, { gk: true, duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[1].goalkeeper;
    for (const caught of [false, true] as const) {
      gk.saveAnimTimer = 2 * DT;
      gk.saveContact = { x: 40, y: 20, caught }; // a point he can never reach in two ticks
      gk.physicsStep(DT);
      expect(gk.saveContact).not.toBeNull(); // the window still runs
      gk.physicsStep(DT);
      expect(gk.saveAnimTimer).toBe(0);
      expect(gk.saveContact === null).toBe(!caught);
    }
    gk.saveContact = null;
    // the ONE guarded clear in the integrator, anchored with its `caught` conjunct
    expect(linesOf(
      playerSource,
      '    if (this.saveContact !== null && !this.saveContact.caught && this.saveAnimTimer === 0) this.saveContact = null;',
    )).toBe(1);
    // ⛔ and the OLD, struck line is GONE from the file
    expect(playerSource).not.toContain(
      '    if (this.saveContact !== null && this.saveAnimTimer === 0) this.saveContact = null;',
    );
    // the two other clears ride the two other `saveAnimTimer = 0` resets
    expect(count(playerSource, /^ {4}this\.saveAnimTimer = 0;$/gm)).toBe(2);
    expect(linesOf(playerSource, '    if (this.saveContact !== null) this.saveContact = null;'))
      .toBe(2);
  }, 120_000);
});

describe('GK T0b §M-GK.2′ — THE BODY FOLLOWS THE HANDS, EVERY TICK', () => {
  it('⭐⭐ NO OUTFIELD BODY EVER HAS A CONTACT — every body, every tick, armed matches', () => {
    // ⭐⭐ THE GATE'S WHOLE JUSTIFICATION. M-GK.2′ drops the action-type enumeration and lets
    // the FIELD be the keeper scope. That is only sound if the field is a keeper-only field —
    // so this walks armed matches and reads EVERY body on EVERY tick.
    let keeperContactTicks = 0;
    let keeperCaughtTicks = 0;
    let outfieldContactTicks = 0;
    let ticks = 0;
    for (const seed of INPLAY_SEEDS) {
      const m = matchOf(seed, { gk: true, world: W13 });
      let t = 0;
      while (!m.finished && t < 60_000) {
        m.step(DT);
        t++;
        ticks++;
        for (const team of m.teams) {
          for (const p of team.players) {
            if (p.saveContact === null) continue;
            if (p.role === 'GK') {
              keeperContactTicks++;
              if (p.saveContact.caught) keeperCaughtTicks++;
            } else outfieldContactTicks++;
          }
        }
      }
    }
    expect(outfieldContactTicks).toBe(0);
    // ⭐ NOT VACUOUS: contacts really were set in these matches — BOTH KINDS. The `caught`
    // half is the one a wrong-body mutant in the CATCH branch would move, so it is asserted
    // separately (a parry-only walk would let that mutant through).
    expect(keeperContactTicks).toBeGreaterThan(0);
    expect(keeperCaughtTicks).toBeGreaterThan(0);
    expect(ticks).toBeGreaterThan(10_000);
  }, 600_000);

  it('⭐⭐ THE STEERING FIRES IN THE VERY CASES GK-T0 DID NOT COVER (the real brain decides)', () => {
    // ruling #399 item 1(i): after a CATCH the keeper OWNS the ball, `decidePlayer` routes him
    // into `decideCarrier`, and he holds `HoldPosition` / `MoveToFormationSpot` — NONE of
    // GK-T0's three enumerated keeper cases. Nothing is stubbed here: the real brain decides.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch' });
    const contact = { x: scene.gk.saveContact!.x, y: scene.gk.saveContact!.y };
    const start = Math.hypot(scene.gk.pos.x - contact.x, scene.gk.pos.y - contact.y);
    const ep = walkEpisode(scene);
    const GK_CASES = new Set(['GoalkeeperSave', 'GoalkeeperPosition', 'GoalkeeperRush']);
    const uncovered = [...ep.actions].filter((a) => !GK_CASES.has(a));
    expect(uncovered.length).toBeGreaterThan(0);   // he really was in a shared case
    expect(ep.bodyWithinCarryTick).toBeGreaterThan(0); // …and he still closed on the hands
    expect(ep.bodyAtRelease).toBeLessThan(start);
    // the SHUT arm, driven by its own brain on the same construction, does NOT close
    const shutScene = saveScene({}, { d: 2.5, speed: 10, want: 'catch' });
    const shutStart = Math.hypot(shutScene.gk.pos.x - contact.x, shutScene.gk.pos.y - contact.y);
    expect(shutStart).toBeCloseTo(start, 9);
    let shutEnd = shutStart;
    for (let i = 0; i < ep.releaseTick; i++) {
      shutScene.m.step(DT);
      shutEnd = Math.hypot(shutScene.gk.pos.x - contact.x, shutScene.gk.pos.y - contact.y);
    }
    expect(ep.bodyAtRelease).toBeLessThan(shutEnd);
  }, 300_000);

  it('⭐⭐ THE WINDOW-IGNORED MUTANT, RE-FORMED — the steering CONTINUES past `saveAnimTimer` 0', () => {
    // ⭐⭐ THE PIN THE OLD LAW WOULD FAIL. GK-T0 cleared the contact when the animation timer
    // hit 0 — so after that tick there was nothing to steer to and nothing to wait for. Under
    // M-GK.2′/M-GK.3′ the caught contact SURVIVES the timer and the body keeps closing.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch' });
    const ep = walkEpisode(scene);
    expect(ep.contactAliveAfterTimerZero).toBe(true);
    expect(Number.isNaN(ep.bodyAtTimerZero)).toBe(false);
    expect(Number.isNaN(ep.bodyThirtyAfterTimerZero)).toBe(false);
    // he was NOT yet arrived when the sprite finished, and he went on closing anyway
    expect(ep.bodyThirtyAfterTimerZero).toBeLessThan(ep.bodyAtTimerZero);
  }, 300_000);

  it('⭐⭐ THE ARRIVAL ARITHMETIC — the census reach, its stretch, and the largest stored dNow', () => {
    // the arithmetic of record, from the ANCHORED constants only: a contact anywhere
    // inside the fingertip envelope is `CENSUS_REACH_STRETCH` metres away at most, and the
    // sprite's window is `SAVE_WINDOW_S` seconds, so a body that could hold its top speed
    // from the first tick would cross it whenever that top speed exceeds the quotient.
    // ⚠ The LAW no longer ends at that window — this is arithmetic about the BODY, kept
    // because ruling #399 item 1(iv) put the falsification of it on the record.
    const needed = CENSUS_REACH_STRETCH / SAVE_WINDOW_S;
    expect(needed).toBeCloseTo(4.616130621354217, 12);
    expect(CENSUS_REACH_STRETCH).toBeCloseTo(CENSUS_REACH * 1.35, 12);

    for (const d of [CENSUS_REACH, CENSUS_REACH_STRETCH, CENSUS_MAX_SAVE_DISTANCE]) {
      const fast = arrivalFixture(d);
      expect(fast.start).toBeCloseTo(d, 12);
      expect(fast.ticks).toBe(Math.round(SAVE_WINDOW_S / DT));
      expect(fast.topSpeed).toBeGreaterThan(needed);
      // he CLOSES — the receipt is the closing, and the shortfall is published
      expect(fast.end).toBeLessThan(fast.start);
      // ⚠ …AND HE DOES NOT ARRIVE FROM REST, even above the quotient: the arithmetic ignores
      // ACCELERATION, so part of the window is spent getting up to speed. This is doc §4's
      // FIRST honest limit, pinned so it cannot be quietly claimed away.
      expect(fast.end).toBeGreaterThan(0);
      // ⛔ THE BODY IS NEVER WRITTEN: every metre he covered came out of `physicsStep`,
      // so his displacement over the window cannot exceed his own cap × the ticks.
      expect(fast.start - fast.end).toBeLessThanOrEqual(fast.topSpeed * SAVE_WINDOW_S + 1e-9);
    }
  }, 120_000);

  it('⭐⭐ THE SHORTFALL IS PUBLISHED — a slow keeper does not arrive, and that is a receipt', () => {
    const needed = CENSUS_REACH_STRETCH / SAVE_WINDOW_S;
    // a hand-built keeper whose top speed is BELOW the quotient (stamina 1 ⇒ topSpeed =
    // baseSpeed): the same law, the same window, and he is still short at the whistle.
    const slow = arrivalFixture(CENSUS_REACH_STRETCH, needed * 0.5);
    expect(slow.topSpeed).toBeLessThan(needed);
    expect(slow.end).toBeGreaterThan(0);
    // and a fast body on the same fixture is strictly closer at the end — the shortfall is
    // the SPEED's, not the law's
    const fast = arrivalFixture(CENSUS_REACH_STRETCH);
    expect(fast.topSpeed).toBeGreaterThan(slow.topSpeed);
    expect(fast.end).toBeLessThan(slow.end);
  }, 120_000);

  it('⭐⭐ MUTANT — the body is NOT steered without the flag', () => {
    const m = matchOf(FIXTURE_BASE, { duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[1].goalkeeper;
    gk.stamina = 1;
    gk.pos = { x: 0, y: 0 };
    gk.vel = { x: 0, y: 0 };
    gk.saveAnimTimer = SAVE_WINDOW_S;
    gk.saveContact = { x: 0, y: CENSUS_REACH_STRETCH, caught: false };
    gk.action = {
      type: 'GoalkeeperRush', scores: [{ action: 'GoalkeeperRush', score: 1, why: 'fixture' }],
    };
    expect(m.gkDiveBody).toBe(false);
    const start = CENSUS_REACH_STRETCH;
    for (let i = 0; i < Math.round(SAVE_WINDOW_S / DT); i++) {
      executeAction(gk, m, DT);
      gk.physicsStep(DT);
    }
    const shutEnd = Math.hypot(gk.pos.x - 0, gk.pos.y - start);
    const armed = arrivalFixture(CENSUS_REACH_STRETCH);
    expect(armed.end).toBeLessThan(shutEnd);
  }, 120_000);
});

describe('GK T0b §M-GK.3′ — THE CAUGHT BALL WAITS UNTIL ARRIVAL', () => {
  it('⭐⭐ A CATCH AT 2.5 m, THE CONTACT AHEAD — 0 every waiting tick, ≤ `carry` on the ARRIVAL tick', () => {
    // ⭐⭐ THE WHOLE EPISODE, INCLUDING THE RELEASE TICK, with NO scoping by `saveContact`
    // (ruling #399 item 1(ii)). The contact lies on the line his hold-facing already points
    // down, so his CARRY POINT — the law's own arrival predicate — reaches it and the ARRIVAL
    // release fires.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch', axis: 'x' });
    const gk = scene.gk;
    expect(scene.m.ball.owner).toBe(gk);
    expect(gk.saveContact!.caught).toBe(true);
    const ep = walkEpisode(scene);

    expect(ep.release).toBe('arrival');
    expect(ep.waitTicks).toBeGreaterThan(0);
    // ⭐⭐ THE BALL-JUMP FACE IS EXACTLY ZERO WHILE IT WAITS — every tick before the release,
    // measured with the full step, not just the ones the field happened to be set on.
    for (let i = 0; i < ep.releaseTick - 1; i++) expect(ep.disp[i]).toBe(0);
    expect(ep.heldAtContact).toBe(ep.waitTicks);

    // ⭐⭐ THE RELEASE TICK'S BOUND, derived from the code and stated: the ball sat exactly ON
    // the contact at the end of the previous tick; the arrival test that fired says the
    // owner's carry point is within `carry` of that contact; the shipped placement then puts
    // the ball ON that carry point THE SAME TICK. So the release displacement is at most
    // `carry` — 0.3 m while he holds or distributes, 0.85 m otherwise.
    expect(ep.carryPointAtRelease).toBeLessThanOrEqual(ep.carryAtRelease);
    expect(ep.releaseDisp).toBeLessThanOrEqual(ep.carryAtRelease + 1e-9);
    // …and, the bound the ruling asks for in the body's own currency, comfortably:
    expect(ep.releaseDisp)
      .toBeLessThanOrEqual(gk.topSpeed * DT * (1 + 1e-6) + ep.carryAtRelease);
    // ⛔ THE SHUT WORLD'S OWN FIRST TICK IS THE JUMP THIS REMOVES
    const shut = saveScene({}, { d: 2.5, speed: 10, want: 'catch', axis: 'x' });
    const before = { x: shut.m.ball.pos.x, y: shut.m.ball.pos.y };
    shut.m.step(DT);
    const shutFirst = Math.hypot(shut.m.ball.pos.x - before.x, shut.m.ball.pos.y - before.y);
    expect(shutFirst).toBeGreaterThan(ep.releaseDisp);
  }, 300_000);

  it('⭐⭐ ARRIVAL KILLS "WAITS FOREVER" — the ball then follows the SHIPPED carry law', () => {
    // ruling #399 item 1(ii): a count-preserving mutant disabling the arrival release passed
    // all 25 of GK-T0's pins. It cannot pass this one: the release is asserted to HAPPEN, to
    // happen by ARRIVAL, and to hand the ball to the shipped placement on the next tick.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch', axis: 'x' });
    const ep = walkEpisode(scene);
    expect(ep.release).toBe('arrival');
    expect(scene.gk.saveContact).toBeNull();
    expect(scene.m.ball.owner).toBe(scene.gk);
    // ⭐ the shipped law, to the bit: `owner.pos + heading · carry` (this keeper HOLDS, so the
    // 0.3 branch — C6's honest offset excludes it by construction).
    expect(ep.afterCarryResidual).toBeLessThan(1e-9);
    expect(ep.afterDisp).toBeLessThanOrEqual(scene.gk.topSpeed * DT * (1 + 1e-6) + 1e-9);
  }, 300_000);

  it('⭐⭐ THE RULING\'S OWN FIXTURE (the contact BESIDE him) — 0 for the whole wait, released by OWNERSHIP LOSS', () => {
    // ⚠ THE HONEST HALF, PUBLISHED. With the contact abeam, the keeper's hold-facing points
    // at the opposite goal, so his CARRY POINT sticks out sideways and never comes within
    // `carry` of the contact even though his BODY does. The law's fail-safe (#399 item 3(iii))
    // is what then runs: he holds the ball at the hands for as long as he owns it, the shipped
    // hold bubble protects it, and the wait ends when he distributes.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch' });
    const ep = walkEpisode(scene);
    expect(ep.release).toBe('ownershipLoss');
    expect(ep.waitTicks).toBeGreaterThan(Math.round(SAVE_WINDOW_S / DT)); // outlives the sprite
    for (let i = 0; i < ep.releaseTick - 1; i++) expect(ep.disp[i]).toBe(0);
    expect(ep.heldAtContact).toBe(ep.waitTicks);
    // the BODY did arrive, on the body's own predicate — a RECEIPT, in ticks from the catch
    expect(ep.bodyWithinCarryTick).toBeGreaterThan(0);
    expect(ep.bodyAtRelease).toBeLessThan(ep.carryAtRelease);
    // ⭐ and the ball is where the ENGINE put it, not at the hands
    expect(scene.m.ball.owner).not.toBe(scene.gk);
    expect(scene.gk.saveContact).toBeNull();
  }, 300_000);

  it('⭐⭐ OWNERSHIP LOSS MID-WAIT — the contact clears and the ball is loose where the engine put it', () => {
    // The keeper is dispossessed while the ball waits: an opponent is stood AT THE HANDS of a
    // keeper who caught it OUTSIDE his area (`giveBall`'s `gkFeet` gate — no hold, no bubble).
    // ⭐ THIS IS ALSO THE `gkFeet` EXPOSURE RECEIPT (ruling #399 item 3(iii)): the tackler scan
    // reads the BALL's position at 1.15 m and `looseTouch` reads it at 0.85 m from the OWNER,
    // and the waiting ball is at neither of the places those predicates expect.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch', outsideBox: true });
    const { m, gk } = scene;
    expect(gk.gkHoldTimer).toBe(0);        // gkFeet: no hold
    expect(gk.gkDistributing).toBe(false); // gkFeet: no bubble
    expect(m.ball.owner).toBe(gk);
    const contact = { x: gk.saveContact!.x, y: gk.saveContact!.y };
    const opp = m.teams[0].players[3];
    opp.pos = { x: contact.x, y: contact.y };
    opp.vel = { x: 0, y: 0 };
    opp.tackleCooldown = 0;
    opp.stunTimer = 0;
    // the two contest predicates, evaluated on the state the engine will read this tick
    const tacklerCandidate = Math.hypot(opp.pos.x - m.ball.pos.x, opp.pos.y - m.ball.pos.y) < 1.15;
    const looseTouch = Math.hypot(m.ball.pos.x - gk.pos.x, m.ball.pos.y - gk.pos.y) > 0.85;
    expect(tacklerCandidate).toBe(true);
    expect(looseTouch).toBe(true);
    m.step(DT);
    // ⭐ THE RECEIPT: he lost it on that tick — the exposure is REAL and is published, not
    // argued away. (GK-T1 measures how often it happens in play.)
    expect(m.ball.owner).not.toBe(gk);
    // the ball is where the engine put it, and NOT pinned to the hands from here on
    m.step(DT);
    expect(gk.saveContact).toBeNull();
    m.step(DT);
    const pinned = m.ball.pos.x === contact.x && m.ball.pos.y === contact.y;
    expect(pinned).toBe(false);
  }, 300_000);

  it('⭐⭐ A REGATHERED PARRY IS NEVER PINNED — the shipped carry law runs from the regather tick', () => {
    // ruling #399 item 1(iii): GK-T0's branch tested ownership and role, so a keeper who
    // regathered his own parry INSIDE the window pinned the ball to the PRE-PARRY contact, up
    // to 5.481300 m from him. The `caught` mark is the fix, and this is its behavioural pin.
    const scene = saveScene({ gk: true }, { d: 2, speed: 25, want: 'parry' });
    const { m, gk } = scene;
    const contact = { x: gk.saveContact!.x, y: gk.saveContact!.y };
    expect(gk.saveContact!.caught).toBe(false);
    m.step(DT);
    expect(gk.saveAnimTimer).toBeGreaterThan(0); // still INSIDE the window
    expect(gk.saveContact).not.toBeNull();
    m.giveBall(gk); // the engine's own ownership entry — the regather
    expect(m.ball.owner).toBe(gk);
    expect(gk.saveContact).not.toBeNull(); // the steer-only contact survives the regather
    for (let i = 0; i < 5; i++) {
      m.step(DT);
      if (m.ball.owner !== gk) break;
      // ⭐ NOT PINNED, and riding the SHIPPED carry length
      expect(m.ball.pos.x === contact.x && m.ball.pos.y === contact.y).toBe(false);
      const carry = gk.gkHoldTimer > 0 || gk.gkDistributing ? 0.3 : 0.85;
      expect(Math.hypot(m.ball.pos.x - gk.pos.x, m.ball.pos.y - gk.pos.y))
        .toBeLessThanOrEqual(carry + 1e-9);
    }
  }, 120_000);

  /* ---------------- GK-T0c — RELEASE (c) REGAIN-CLEARED (ruling #400 item 3) --------------- */

  it('⭐⭐ THE UNIT PIN — `giveBall` RETIRES A STALE CAUGHT CONTACT, and never a parry one', () => {
    // The close, at the smallest scale the engine allows: a hand-built keeper carrying a
    // contact he should no longer own, and the engine's own ownership GAIN.
    const m = matchOf(FIXTURE_BASE, { gk: true, duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[1].goalkeeper;

    // (a) a STALE CAUGHT contact — retired by the gain
    gk.saveContact = { x: gk.pos.x + 5, y: gk.pos.y + 5, caught: true };
    m.ball.owner = null;
    m.giveBall(gk);
    expect(m.ball.owner).toBe(gk);
    expect(gk.saveContact).toBeNull();

    // (b) a PARRY contact — NOT cleared by the gain. ⭐ THE REASON, of record: a parry
    // contact is STEER-ONLY (the ball is already away, nothing waits on it), so ownership
    // says nothing about it; it dies with the sprite's window in `Player.physicsStep`, and
    // clearing it here would silently un-do M-GK.2′'s steering for the regathered parry that
    // ruling #399 item 1(iii) put on the record.
    const parry = { x: gk.pos.x + 5, y: gk.pos.y + 5, caught: false };
    gk.saveContact = { ...parry };
    m.ball.owner = null;
    m.giveBall(gk);
    expect(gk.saveContact).not.toBeNull();
    expect(gk.saveContact!.caught).toBe(false);
    expect(gk.saveContact!.x).toBe(parry.x);
    expect(gk.saveContact!.y).toBe(parry.y);

    // (c) the OFF path: the same two scenes with the door shut execute NO assignment — the
    // field is null on every body, so the first conjunct short-circuits. (G-NULL is the
    // whole-match form of this; here it is the statement itself.)
    const shut = matchOf(FIXTURE_BASE, { gkExplicitFalse: true, duration: 600 });
    while (shut.phase !== 'playing') shut.step(DT);
    const shutGk = shut.teams[1].goalkeeper;
    expect(shutGk.saveContact).toBeNull();
    shut.ball.owner = null;
    shut.giveBall(shutGk);
    expect(shutGk.saveContact).toBeNull();
  }, 120_000);

  it('⭐⭐ LOSE AND REGAIN BETWEEN TWO SWEEPS — the contact is retired, the ball is NOT snapped back', () => {
    // ⭐⭐ THE VERIFIER'S V6 SHAPE (ruling #400 item 3): the ownership sweep runs ONCE per
    // tick, ABOVE the restart/ball fork, so it only sees a loss that PERSISTS to the next
    // sweep. A keeper who loses the ball and regains it inside that window presents the SAME
    // owner to the sweep — and before GK-T0c his stale `caught` contact survived and the
    // waiting law pinned the ball to it (the verifier's hand-built regather: a 5.000000 m
    // jump, the ball 2.495500 m from the keeper).
    //
    // ⚠ HOW MUCH OF THIS THE ENGINE ITSELF CAN DO, stated: the LOSS is the engine's own
    // (`tryTackles` on a `gkFeet` catch — no hold, no bubble). The REGAIN is hand-built
    // `m.giveBall(gk)` in the same inter-sweep window, exactly as the regathered-parry pin
    // above builds its regather, because at this head the engine cannot regain inside the
    // same `stepBall`: the owned branch RETURNS after the tackle calls, and every non-null
    // `ball.owner` assignment reachable in play is `giveBall` itself. That is the residual,
    // published in the doc §4 — not a claim that the engine produces this shape.
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch', outsideBox: true });
    const { m, gk } = scene;
    const contact = { x: gk.saveContact!.x, y: gk.saveContact!.y };
    expect(gk.gkHoldTimer).toBe(0);
    expect(m.ball.owner).toBe(gk);

    const opp = m.teams[0].players[3];
    opp.pos = { x: contact.x, y: contact.y };
    opp.vel = { x: 0, y: 0 };
    opp.tackleCooldown = 0;
    opp.stunTimer = 0;
    m.step(DT);                       // THE LOSS — the engine's own tackle
    expect(m.ball.owner).not.toBe(gk);
    expect(gk.saveContact).not.toBeNull();   // the sweep has not run again yet
    expect(gk.saveContact!.caught).toBe(true);

    m.giveBall(gk);                   // THE REGAIN, inside the same inter-sweep window
    expect(m.ball.owner).toBe(gk);
    // ⭐⭐ THE CLOSE: the fresh gain retired the stale contact. (Delete the `giveBall` clear
    // and this line fails first, then every line below it.)
    expect(gk.saveContact).toBeNull();

    // …and on the FOLLOWING tick the ball is with its OWNER under the shipped carry law —
    // NOT yanked back to the pre-loss contact.
    m.step(DT);
    const atOldContact = m.ball.pos.x === contact.x && m.ball.pos.y === contact.y;
    expect(atOldContact).toBe(false);
    const carry = gk.gkHoldTimer > 0 || gk.gkDistributing ? 0.3 : 0.85;
    expect(Math.hypot(m.ball.pos.x - gk.pos.x, m.ball.pos.y - gk.pos.y))
      .toBeLessThanOrEqual(carry + 1e-9);   // THE CARRY-LAW BOUND
    // and it keeps riding him: from here the per-tick displacement is the body's own travel
    // plus at most the carry length, never a jump to a fixed point in the world.
    for (let i = 0; i < 5; i++) {
      const before = { x: m.ball.pos.x, y: m.ball.pos.y };
      m.step(DT);
      if (m.ball.owner !== gk) break;
      expect(Math.hypot(m.ball.pos.x - before.x, m.ball.pos.y - before.y))
        .toBeLessThanOrEqual(gk.topSpeed * DT * (1 + 1e-6) + 1e-9);
      expect(m.ball.pos.x === contact.x && m.ball.pos.y === contact.y).toBe(false);
    }
  }, 300_000);
});

describe('GK T0b §SEAM MAP — the anchors (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE FLAG `gkDiveBody` — counts per file, every site enumerated', () => {
    const perFile = srcFiles('src')
      .map((f) => [f.replace(/\\/g, '/'), count(readFileSync(f, 'utf8'), /gkDiveBody/g)] as const)
      .filter(([, n]) => n > 0);
    expect(new Set(perFile.map(([f]) => f))).toEqual(new Set([
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/sim/mechanics.ts',
      'src/ai/actionExecutor.ts', 'src/sim/Player.ts',
    ]));
    // Match.ts: the config field, the readonly field, the constructor `?? false` (twice on
    // that one line) and the TWO executable reads (the ownership sweep, the carry law).
    expect(count(matchSource, /gkDiveBody/g)).toBe(6);
    expect(linesOf(matchSource, '  gkDiveBody?: boolean;')).toBe(1);
    expect(linesOf(matchSource, '  readonly gkDiveBody: boolean;')).toBe(1);
    expect(linesOf(matchSource, '    this.gkDiveBody = cfg.gkDiveBody ?? false;')).toBe(1);
    expect(count(leagueSource, /^ {4}\| 'gkDiveBody'$/gm)).toBe(1);
    // Player.ts names the flag in PROSE only — the field's own docblock. It cannot read it.
    expect(count(playerSource, /gkDiveBody/g)).toBe(1);
    for (const line of playerSource.split('\n').filter((l) => l.includes('gkDiveBody'))) {
      expect(line.trimStart().startsWith('*')).toBe(true);
    }
    // ⭐⭐ mechanics.ts: ONE executable read per WRITE — two branches, two guards.
    expect(count(mechSource, /match\.gkDiveBody/g)).toBe(2);
    expect(count(mechSource, /^ {6}if \(match\.gkDiveBody\) gk\.saveContact = /gm)).toBe(2);
    // the executor names it twice: ONE executable read plus the docblock line that says
    // what the flag does. The prose line cannot read anything.
    expect(count(execSource, /match\.gkDiveBody/g)).toBe(2);
    expect(count(execSource, /^ *\/\/[^\n]*match\.gkDiveBody/gm)).toBe(1);
    expect(linesOf(execSource, '  if (match.gkDiveBody && p.saveContact !== null) {')).toBe(1);
    expect(count(matchSource, /this\.gkDiveBody/g)).toBe(3); // the ctor write + the TWO reads
  });

  it('⭐⭐ EXACTLY TWO `saveContact` WRITES IN mechanics.ts, one per branch of the save', () => {
    expect(count(mechSource, /saveContact/g)).toBe(3); // the docblock line + the two writes
    expect(count(mechSource, /gk\.saveContact = /g)).toBe(2);
    expect(linesOf(
      mechSource,
      '      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };',
    )).toBe(1);
    expect(linesOf(
      mechSource,
      '      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: false };',
    )).toBe(1);
    // ⛔ THE STRUCK GK-T0 LINE — the ONE write above the split — is GONE
    expect(mechSource).not.toContain(
      '    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y };',
    );
    // ANCHORED ORDER: the roll, then the split, then each branch's own write — so each write
    // is AFTER its branch's own roll succeeded.
    // ⭐⭐ GK-T0c (ruling #400 item 3): the CATCH write is now the branch's LAST statement,
    // AFTER `match.giveBall(gk)` — `giveBall` retires a stale caught contact on the body that
    // GAINS the ball, so a write placed above it would be wiped by this very save. The PARRY
    // write is still FIRST in its branch (a parry takes no `giveBall`).
    const rollAt = mechSource.indexOf('  if (match.rng.chance(saveP)) {');
    const splitAt = mechSource.indexOf('    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {');
    const catchWriteAt = mechSource.indexOf('caught: true };');
    const parryWriteAt = mechSource.indexOf('caught: false };');
    const pushAt = mechSource.indexOf('      match.pushEvent(\'save\', defSide, `${gk.name} catches it`);');
    // ⭐ CANON "anchored extraction": the NAMED call site — the `giveBall` of THIS branch,
    // found from the catch event, never the file's first `match.giveBall(gk);`.
    const giveAt = mechSource.indexOf('      match.giveBall(gk);', pushAt);
    expect(rollAt).toBeGreaterThan(0);
    expect(splitAt).toBeGreaterThan(rollAt);
    expect(pushAt).toBeGreaterThan(splitAt);
    expect(giveAt).toBeGreaterThan(pushAt);
    expect(catchWriteAt).toBeGreaterThan(giveAt);   // ⭐ THE REORDER, anchored
    expect(parryWriteAt).toBeGreaterThan(catchWriteAt);
    expect(mechSource.indexOf('      const inDir = norm(ball.vel);')).toBeGreaterThan(parryWriteAt);
    // ⛔ THE STRUCK GK-T0b ORDERING — the catch write ABOVE the event — is GONE
    expect(mechSource).not.toContain(
      '      if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y, caught: true };\n'
      + '      match.pushEvent(',
    );
    // ⛔ NOTHING ELSE MOVED IN THE SAVE: the window, the reach, the stretch, the parry's
    // velocity, the cooldown and the two event texts are the shipped lines.
    expect(linesOf(mechSource, '  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)')).toBe(1);
    expect(linesOf(mechSource, 'const SAVE_STRETCH = 1.35;')).toBe(1);
    expect(linesOf(mechSource, '      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));')).toBe(1);
    expect(linesOf(mechSource, '      gk.kickCooldown = 0.6; // let the parry leave the keeper\'s feet')).toBe(1);
    expect(count(mechSource, /keeperReach\(defTeam, gk\)/g)).toBe(1);
  });

  it('⭐⭐ EXACTLY ONE EXECUTOR OVERRIDE, and it names NO action type in its gate', () => {
    expect(count(execSource, /saveContact/g)).toBe(5); // the prose line, the gate, the two rush reads, the clamp
    expect(count(execSource, /p\.saveContact !== null/g)).toBe(1);
    // ⛔ THE ENUMERATION IS GONE — the field is the scope (ruling #399 item 3(i))
    expect(execSource).not.toContain(
      "    && (p.action.type === 'GoalkeeperSave' || p.action.type === 'GoalkeeperPosition'",
    );
    expect(execSource).not.toContain('p.saveAnimTimer > 0 && p.saveContact !== null');
    // ⭐ the ONE action-type read that remains is the CLAMP discipline, not the gate
    expect(execSource).toContain("    target = p.action.type === 'GoalkeeperRush'");
    expect(execSource).toContain('      : clampToBox(p.saveContact, team.attackDir);');
    // …and each keeper case clamps its OWN target the same way (the anchored lines)
    expect(linesOf(execSource, '      target = clampToBox(sol.point, team.attackDir);')).toBe(1);
    expect(linesOf(execSource,
      '      target = clampToBox({ x: goal.x + tbx * k, y: goal.y + tby * k }, team.attackDir);'))
      .toBe(1);
    // the override sits AFTER the switch and BEFORE the free-kick wall block, exactly where
    // GK-T0 put it, so it still wins over every keeper case's own target.
    const posCaseAt = execSource.indexOf("    case 'GoalkeeperPosition': {");
    const overrideAt = execSource.indexOf('  if (match.gkDiveBody && p.saveContact !== null) {');
    const wallAt = execSource.indexOf('  // Free-kick WALL (Phase 32):');
    expect(posCaseAt).toBeGreaterThan(0);
    expect(overrideAt).toBeGreaterThan(posCaseAt);
    expect(wallAt).toBeGreaterThan(overrideAt);
    // ⭐ THE FK WALL CANNOT TAKE A KEEPER, so nothing downstream can steal the dive
    expect(matchSource).toContain("          .filter((p) => p.role !== 'GK' && !p.sentOff)");
    // ⭐ AND THE TWO CLAMPS BELOW IT EXCLUDE KEEPERS — anchored, both of them
    expect(execSource).toContain(
      "  if (target && carrier && carrier !== p && carrier.side === p.side && p.role !== 'GK') {",
    );
    expect(execSource).toContain(
      "  if (target && barred && p.role !== 'GK' && Math.abs(target.y) < BOX_WIDTH / 2 + 0.5) {",
    );
    // ⭐ …and the barred-box backstop at the VELOCITY level excludes them too
    expect(execSource).toContain(
      "  if (barred && p.role !== 'GK' && Math.abs(p.pos.y) < BOX_WIDTH / 2 + 0.5) {",
    );
  });

  it('⭐⭐ ONE WAITING BRANCH, ONE OWNERSHIP SWEEP AND ONE `giveBall` CLEAR IN Match.ts', () => {
    // 12 at GK-T0b + the THREE reads/writes of GK-T0c's ONE new statement in `giveBall`.
    expect(count(matchSource, /saveContact/g)).toBe(15);
    // (a) THE WAITING BRANCH, before the normal placement, gated on the `caught` mark
    expect(count(matchSource, /const gkHands = this\.gkDiveBody/g)).toBe(1);
    expect(linesOf(matchSource,
      '        && ball.owner.saveContact !== null && ball.owner.saveContact.caught')).toBe(1);
    // ⛔ THE STRUCK GK-T0 CONJUNCT — the animation timer — is GONE from the gate
    expect(matchSource).not.toContain(
      '        && ball.owner.saveContact !== null && ball.owner.saveAnimTimer > 0',
    );
    expect(linesOf(matchSource, '        ball.pos.x = gkHands.x;')).toBe(1);
    expect(linesOf(matchSource, '        ball.pos.y = gkHands.y;')).toBe(1);
    expect(count(matchSource, /ball\.owner\.saveContact = null; \/\/ consumed/g)).toBe(1);
    // the SHIPPED placements are untouched and still follow it
    expect(linesOf(matchSource,
      '        ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;')).toBe(1);
    expect(linesOf(matchSource,
      '        ball.pos.y = ball.owner.pos.y + ball.owner.heading.y * carry;')).toBe(1);
    const gateAt = matchSource.indexOf('      const gkHands = this.gkDiveBody');
    const c6At = matchSource.indexOf('      } else if (this.c6Carry && carry === 0.85) {');
    const plainAt = matchSource.indexOf(
      '        ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;');
    expect(gateAt).toBeGreaterThan(0);
    expect(c6At).toBeGreaterThan(gateAt);
    expect(plainAt).toBeGreaterThan(c6At);
    // ⛔ NO NEW DISTANCE CONSTANT: the branch reads `carry`, the same value the placement
    // below uses on the same tick.
    expect(count(matchSource, /const cx = ball\.owner\.pos\.x \+ ball\.owner\.heading\.x \* carry - gkHands\.x;/g))
      .toBe(1);
    expect(count(matchSource, /cx \* cx \+ cy \* cy > carry \* carry/g)).toBe(1);

    // (b) THE OWNERSHIP-LOSS SWEEP — ONE site, immediately ABOVE the restart/ball fork, so
    // the tick a keeper stops owning the ball is already a tick the ball is not at his hands.
    expect(linesOf(matchSource,
      '          if (q.saveContact !== null && q.saveContact.caught && this.ball.owner !== q) {')).toBe(1);
    expect(linesOf(matchSource, '            q.saveContact = null;')).toBe(1);
    const sweepAt = matchSource.indexOf('    if (this.gkDiveBody) {\n      for (const t of this.teams) {');
    const forkAt = matchSource.indexOf("    if (this.phase === 'restart') this.stepRestart(dt);");
    expect(sweepAt).toBeGreaterThan(0);
    expect(forkAt).toBeGreaterThan(sweepAt);
    expect(forkAt - sweepAt).toBeLessThan(400); // it is the statement immediately above the fork

    // (c) ⭐⭐ GK-T0c — THE REGAIN CLEAR: EXACTLY ONE new statement, in `giveBall`, at the
    // ownership gain. Ruling #400 item 3.
    expect(linesOf(matchSource,
      '    if (p.saveContact !== null && p.saveContact.caught) p.saveContact = null;')).toBe(1);
    expect(count(matchSource, /p\.saveContact = null;/g)).toBe(1);
    const giveBallAt = matchSource.indexOf('  giveBall(p: Player): void {');
    const offsideReturnAt = matchSource.indexOf('      this.callOffside(p, flagged.offsideSpot ?? p.pos);');
    const gainAt = matchSource.indexOf('    const ball = this.ball;\n    ball.owner = p;');
    const clearAt = matchSource.indexOf(
      '    if (p.saveContact !== null && p.saveContact.caught) p.saveContact = null;');
    const lastTouchAt = matchSource.indexOf('    ball.owner = p;\n');
    expect(giveBallAt).toBeGreaterThan(0);
    expect(offsideReturnAt).toBeGreaterThan(giveBallAt);
    // ⭐ AFTER the offside early-return ⇒ it runs on EVERY successful gain, never on the
    // dead ball; and IMMEDIATELY AFTER the gain itself — no statement in between.
    expect(gainAt).toBeGreaterThan(offsideReturnAt);
    expect(clearAt).toBeGreaterThan(gainAt);
    expect(lastTouchAt).toBe(gainAt + '    const ball = this.ball;\n'.length);
    expect(matchSource.slice(gainAt, clearAt)).toContain('ball.owner = p;');
    // nothing executable sits between the gain and its retirement: every line between the
    // two is a comment.
    const between = matchSource.slice(
      gainAt + '    const ball = this.ball;\n    ball.owner = p;\n'.length, clearAt,
    ).split('\n').filter((l) => l.trim().length > 0);
    expect(between.length).toBeGreaterThan(0); // the doc comment IS there
    for (const l of between) expect(l.trimStart().startsWith('//')).toBe(true);
  });

  it('⭐⭐ THE FIELD `saveContact` — one declaration, three clears, no serialization path', () => {
    expect(count(playerSource, /saveContact/g)).toBe(8); // the declaration + 3 clears (7 reads/writes) …
    expect(linesOf(playerSource,
      '  saveContact: { x: number; y: number; caught: boolean } | null = null;')).toBe(1);
    // ⛔ it never enters a save, a clone or the render adapter
    for (const rel of ['sim/League.ts', 'sim/rendezvousRecovery.ts', 'render3d/RenderStateAdapter.ts',
      'render/MatchRenderer.ts']) {
      expect(src(rel)).not.toContain('saveContact');
    }
  });
});

describe('GK T0b — the fingerprint of record', () => {
  it('⭐ the fingerprint literal is in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
  });

  it('⭐⭐ THE PRODUCTION FINGERPRINT IS UNCHANGED (57b0bdab…c673) — the a4HomeGrant form', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_OF_RECORD);
  }, 180_000);
});
