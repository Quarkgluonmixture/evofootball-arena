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
 * ⭐⭐ GK T0 — THE DIVE LAW 「身体跟着手走」 (docs/world-model/GK-T0-DIVE-LAW.md; contract
 * GK-KEEPER-BODY-CONTRACT.md; COMMANDER RULING #398 item 5) — THE SEAM'S PERMANENT PIN
 * SUITE, in the house form (`lnOwnLane.test.ts` / `bqCushion.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * GK-C0 measured the user's sentence 「门将…突然瞬移到球的那个地方」 and found THE HANDS
 * WITHOUT THE BODY: the save resolves a mean `save.meanDistanceMetres` from the keeper's
 * body while the body stays put, and the caught ball then JUMPS into his feet on
 * `ballJump.catchShare` of catches. Armed, this seam records the contact point on the
 * KEEPER, steers his BODY to it over the existing 0.7 s window at his own `topSpeed`, and
 * makes the caught ball WAIT at the hands until the body's carry point arrives. No new
 * constant; no roll, no reach, no save outcome moves.
 *
 * The pins:
 *   • ⭐⭐ G-OFF — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte (score, phase, ball
 *     pos/vel/z/vz, every body's pos/vel/heading/stamina, AND the rng stream state), on
 *     twelve scratch seeds, in the BARE world AND world 13 AND world 14, full matches.
 *   • ⭐⭐ G-NULL — the OFF path executes no new assignment: `saveContact` is null on every
 *     body on every tick of a full match that CONTAINS saves.
 *   • ⭐⭐ G-NOSAVE — flag ON in a fixture where no save is ever rolled ≡ OFF.
 *   • ⭐⭐ G-BITE — flag ON ⇒ the signature DIFFERS on at least one seed in each world.
 *   • ⭐⭐ G-SAVE-IDENTITY — walked in LOCKSTEP, every `save` event and the whole `shotLog`
 *     outcome sequence are IDENTICAL while the two arms still stand in the same world;
 *     divergence can begin only AFTER a contact point exists, so the save that CREATES it
 *     is compared on both arms.
 *   • ⭐⭐ THE FIXTURES — a hand-built catch at 2.5 m (the contact IS the ball's own
 *     position; the ball never moves faster than the keeper's own cap while it waits; the
 *     normal carry resumes with `saveContact` null); a hand-built parry (the ball's
 *     velocity is the OFF world's, to the bit); the timer clearing an UNARRIVED contact;
 *     the failed roll writing nothing; and the ARRIVAL ARITHMETIC on a body fixture at the
 *     census's own mean reach, its reach × stretch and its largest stored `dNow`, with the
 *     slow-keeper SHORTFALL published as a receipt.
 *   • ⭐⭐ THE ANCHORS — the flag's occurrence counts per file with every site enumerated,
 *     exactly ONE `saveContact` write, ONE waiting branch, ONE executor override naming
 *     exactly three action types, `a4World.ts` and every preset free of the flag, no env.
 *   • ⭐⭐ THE MUTANTS — the contact on the owner-relative frame, the ball waiting forever,
 *     the body steered without the flag, the window ignored: each recomputed and asserted
 *     UNEQUAL to the shipped law, so no pin can be vacuous.
 *   • ⭐ THE FINGERPRINT OF RECORD — a literal in this suite, and the suite RUNS it.
 *
 * ⚠ Every walk in this file lives in the OUT-OF-BAND SCRATCH CLASS 900,004,800–899 (canon,
 * VERBATIM: "verifier scratch walks use the stage's own consumed band or the out-of-band
 * scratch range (≥ 900,000,000) — never the next virgin block"; home:
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
  arm: Arm, opts: { d: number; speed: number; want: 'catch' | 'parry'; topSpeed?: number },
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
    gk.pos = { x: goal.x + inward * 6, y: 0 };
    gk.vel = { x: 0, y: 0 };
    gk.kickCooldown = 0;
    gk.saveAnimTimer = 0;
    const ball = m.ball;
    ball.owner = null;
    ball.pos = { x: gk.pos.x, y: opts.d };
    ball.z = 0;
    ball.vz = 0;
    // goalward, and receding from the keeper in y so the fingertip branch is reachable too
    const dx = goal.x - ball.pos.x;
    const nx = dx > 0 ? 1 : -1;
    ball.vel = { x: nx * opts.speed, y: opts.d > 0 ? 0.5 : -0.5 };
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
  gk.saveContact = { x: 0, y: d };
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

describe('GK T0 — Road B: the dive law is DORMANT', () => {
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

describe('GK T0 §M-GK.1 — THE CONTACT POINT', () => {
  it('⭐⭐ the contact IS the ball\'s own position at the save tick — catch AND parry', () => {
    for (const want of ['catch', 'parry'] as const) {
      const scene = saveScene({ gk: true }, {
        d: want === 'catch' ? 2.5 : 2, speed: want === 'catch' ? 10 : 25, want,
      });
      expect(scene.kind).toBe(want);
      expect(scene.gk.saveContact).not.toBeNull();
      expect(scene.gk.saveContact!.x).toBe(scene.ballAtSave.x);
      expect(scene.gk.saveContact!.y).toBe(scene.ballAtSave.y);
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

  it('⭐⭐ the contact is cleared with the window — the ONE guarded clear in the integrator', () => {
    const m = matchOf(FIXTURE_BASE, { gk: true, duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[1].goalkeeper;
    gk.saveAnimTimer = 2 * DT;
    gk.saveContact = { x: 40, y: 20 }; // a point he can never reach in two ticks
    gk.physicsStep(DT);
    expect(gk.saveContact).not.toBeNull(); // the window still runs
    gk.physicsStep(DT);
    expect(gk.saveAnimTimer).toBe(0);
    expect(gk.saveContact).toBeNull(); // …and the hands are forgotten with it
    // MUTANT — a clear that ignored the window would already have fired on the first tick
    expect(linesOf(
      playerSource,
      '    if (this.saveContact !== null && this.saveAnimTimer === 0) this.saveContact = null;',
    )).toBe(1);
    // the two other clears ride the two other `saveAnimTimer = 0` resets
    expect(count(playerSource, /^ {4}this\.saveAnimTimer = 0;$/gm)).toBe(2);
    expect(linesOf(playerSource, '    if (this.saveContact !== null) this.saveContact = null;'))
      .toBe(2);
  }, 120_000);
});

describe('GK T0 §M-GK.2 — THE BODY FOLLOWS THE HANDS', () => {
  it('⭐⭐ THE ARRIVAL ARITHMETIC — the census reach, its stretch, and the largest stored dNow', () => {
    // the arithmetic of record, from the ANCHORED constants only: a contact anywhere
    // inside the fingertip envelope is `CENSUS_REACH_STRETCH` metres away at most, and the
    // window is `SAVE_WINDOW_S` seconds, so a body that could hold its top speed from the
    // first tick arrives whenever that top speed exceeds the quotient.
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

  it('⭐⭐ MUTANT — the body is NOT steered without the flag, and NOT steered outside the window', () => {
    // (a) the same fixture with the flag SHUT: the executor's own keeper case decides, and
    // the body does not converge on the contact point.
    const m = matchOf(FIXTURE_BASE, { duration: 600 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[1].goalkeeper;
    gk.stamina = 1;
    gk.pos = { x: 0, y: 0 };
    gk.vel = { x: 0, y: 0 };
    gk.saveAnimTimer = SAVE_WINDOW_S;
    gk.saveContact = { x: 0, y: CENSUS_REACH_STRETCH };
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

    // (b) THE WINDOW IGNORED: the armed executor with the timer already at 0 steers by the
    // case's own target, not the contact point — the same body, the same contact.
    const m2 = matchOf(FIXTURE_BASE, { gk: true, duration: 600 });
    while (m2.phase !== 'playing') m2.step(DT);
    const gk2 = m2.teams[1].goalkeeper;
    gk2.stamina = 1;
    gk2.pos = { x: 0, y: 0 };
    gk2.vel = { x: 0, y: 0 };
    gk2.saveAnimTimer = 0;
    gk2.saveContact = { x: 0, y: CENSUS_REACH_STRETCH };
    gk2.action = {
      type: 'GoalkeeperRush', scores: [{ action: 'GoalkeeperRush', score: 1, why: 'fixture' }],
    };
    for (let i = 0; i < Math.round(SAVE_WINDOW_S / DT); i++) {
      executeAction(gk2, m2, DT);
      gk2.physicsStep(DT);
    }
    const noWindowEnd = Math.hypot(gk2.pos.x - 0, gk2.pos.y - start);
    expect(armed.end).toBeLessThan(noWindowEnd);
  }, 120_000);
});

describe('GK T0 §M-GK.3 — THE BALL WAITS AT THE HANDS', () => {
  it('⭐⭐ A CATCH AT 2.5 m — the ball holds at the hands, never faster than the keeper\'s own cap', () => {
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch' });
    const { m, gk } = scene;
    expect(m.ball.owner).toBe(gk);
    const contact = { x: gk.saveContact!.x, y: gk.saveContact!.y };
    let waited = 0;
    let maxStep = 0;
    let ticks = 0;
    let heldAtContact = 0;
    while (gk.saveContact !== null && m.ball.owner === gk && ticks < 200) {
      const before = { x: m.ball.pos.x, y: m.ball.pos.y };
      m.step(DT);
      ticks++;
      if (m.ball.owner !== gk) break;
      const step = Math.hypot(m.ball.pos.x - before.x, m.ball.pos.y - before.y);
      if (gk.saveContact !== null) {
        waited++;
        maxStep = Math.max(maxStep, step);
        if (m.ball.pos.x === contact.x && m.ball.pos.y === contact.y) heldAtContact++;
      }
    }
    // the ball really did wait, and it waited AT THE CONTACT POINT
    expect(waited).toBeGreaterThan(0);
    expect(heldAtContact).toBe(waited);
    // ⭐⭐ THE BALL-JUMP FACE IS ZERO WHILE IT WAITS: the ball's per-tick displacement never
    // exceeds the keeper's own cap (it is exactly 0 — the ball is held, not carried).
    expect(maxStep).toBeLessThanOrEqual(gk.topSpeed * DT * (1 + 1e-6));
    // …and once the wait is over the contact point is CONSUMED and the normal carry law
    // places the ball again.
    expect(gk.saveContact).toBeNull();
  }, 120_000);

  it('⭐⭐ A PARRY — the ball is NOT owned, so the wait never applies and the arithmetic is HEAD\'s', () => {
    const armed = saveScene({ gk: true }, { d: 2, speed: 25, want: 'parry' });
    const shut = saveScene({}, { d: 2, speed: 25, want: 'parry' });
    expect(armed.seed).toBe(shut.seed); // the same construction on both arms
    // the parry's own arithmetic, to the bit
    expect(armed.m.ball.vel.x).toBe(shut.m.ball.vel.x);
    expect(armed.m.ball.vel.y).toBe(shut.m.ball.vel.y);
    expect(armed.m.ball.owner).toBeNull();
    expect(shut.m.ball.owner).toBeNull();
    expect(armed.gk.kickCooldown).toBe(shut.gk.kickCooldown);
    // the contact point exists on the armed arm and is the ball's own position
    expect(armed.gk.saveContact).not.toBeNull();
    expect(shut.gk.saveContact).toBeNull();
    const contact = { x: armed.gk.saveContact!.x, y: armed.gk.saveContact!.y };
    expect(contact.x).toBe(armed.ballAtSave.x);
    expect(contact.y).toBe(armed.ballAtSave.y);

    // ⭐⭐ THE BODY MOVES TOWARD THE CONTACT POINT over the window — driven by the SHIPPED
    // executor and the SHIPPED integrator, with the keeper held in one of the THREE COVERED
    // keeper cases. Both arms are driven identically; only the flag differs.
    const drive = (scene: SaveScene): number => {
      const { m, gk } = scene;
      let ticks = 0;
      while (gk.saveAnimTimer > 0 && ticks < 200) {
        gk.action = {
          type: 'GoalkeeperPosition',
          scores: [{ action: 'GoalkeeperPosition', score: 1, why: 'fixture' }],
        };
        executeAction(gk, m, DT);
        gk.physicsStep(DT);
        ticks++;
      }
      return Math.hypot(gk.pos.x - contact.x, gk.pos.y - contact.y);
    };
    const startArmed = Math.hypot(armed.gk.pos.x - contact.x, armed.gk.pos.y - contact.y);
    const startShut = Math.hypot(shut.gk.pos.x - contact.x, shut.gk.pos.y - contact.y);
    expect(startArmed).toBeCloseTo(startShut, 12);
    const endArmed = drive(armed);
    const endShut = drive(shut);
    expect(endArmed).toBeLessThan(startArmed);
    expect(endArmed).toBeLessThan(endShut);
  }, 120_000);

  it('⭐⭐ THE PUBLISHED LIMIT — the window can run in an UNCOVERED case, and then nothing steers', () => {
    // ⚠ HONEST LIMIT, PINNED (doc §4): M-GK.2 covers exactly the three KEEPER cases. After a
    // parry the keeper's own brain routes him into `ChaseBall` — an OUTFIELD case too — and
    // after a catch he owns the ball, so `decidePlayer` routes him into `decideCarrier` and
    // he holds in `HoldPosition`. In those ticks the dive does not steer, and the two arms'
    // bodies stand in the same place. This pin exists so that fact cannot change in silence.
    const armed = saveScene({ gk: true }, { d: 2, speed: 25, want: 'parry' });
    const shut = saveScene({}, { d: 2, speed: 25, want: 'parry' });
    const COVERED = new Set(['GoalkeeperSave', 'GoalkeeperPosition', 'GoalkeeperRush']);
    let ticks = 0;
    let uncovered = 0;
    while (armed.gk.saveAnimTimer > 0 && ticks < 200) {
      armed.m.step(DT);
      shut.m.step(DT);
      ticks++;
      if (!COVERED.has(armed.gk.action.type)) uncovered++;
    }
    expect(ticks).toBeGreaterThan(0);
    expect(uncovered).toBeGreaterThan(0); // the uncovered case really is held in the window
    expect(armed.gk.pos.x).toBe(shut.gk.pos.x);
    expect(armed.gk.pos.y).toBe(shut.gk.pos.y);
  }, 120_000);

  it('⭐⭐ THE TIMER CLEARS AN UNARRIVED CONTACT, and the normal carry law resumes', () => {
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch', topSpeed: 0.2 });
    const { m, gk } = scene;
    expect(m.ball.owner).toBe(gk);
    expect(gk.saveContact).not.toBeNull();
    let ticks = 0;
    while (gk.saveAnimTimer > 0 && ticks < 200) {
      m.step(DT);
      ticks++;
      if (m.ball.owner !== gk) break;
    }
    // the window expired with the body still short of the hands — and the field is null
    expect(gk.saveContact).toBeNull();
    if (m.ball.owner === gk) {
      // the normal carry law owns the ball again: it rides at the shipped carry length
      const carry = gk.gkHoldTimer > 0 || gk.gkDistributing ? 0.3 : 0.85;
      m.step(DT);
      if (m.ball.owner === gk) {
        const d = Math.hypot(m.ball.pos.x - gk.pos.x, m.ball.pos.y - gk.pos.y);
        expect(d).toBeLessThanOrEqual(carry + 1e-6);
      }
    }
  }, 120_000);

  it('⭐⭐ MUTANT — a ball that waited FOREVER would still be at the hands; the shipped law releases it', () => {
    const scene = saveScene({ gk: true }, { d: 2.5, speed: 10, want: 'catch' });
    const { m, gk } = scene;
    const contact = { x: gk.saveContact!.x, y: gk.saveContact!.y };
    let ticks = 0;
    while (ticks < 200 && gk.saveContact !== null && m.ball.owner === gk) {
      m.step(DT);
      ticks++;
    }
    expect(gk.saveContact).toBeNull();
    // the consumption condition is REAL: the ball is no longer pinned to the contact point
    if (m.ball.owner === gk) {
      m.step(DT);
      const stillPinned = m.ball.pos.x === contact.x && m.ball.pos.y === contact.y;
      expect(stillPinned).toBe(false);
    }
  }, 120_000);
});

describe('GK T0 §SEAM MAP — the anchors (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE FLAG `gkDiveBody` — counts per file, every site enumerated', () => {
    const perFile = srcFiles('src')
      .map((f) => [f.replace(/\\/g, '/'), count(readFileSync(f, 'utf8'), /gkDiveBody/g)] as const)
      .filter(([, n]) => n > 0);
    expect(new Set(perFile.map(([f]) => f))).toEqual(new Set([
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/sim/mechanics.ts',
      'src/ai/actionExecutor.ts', 'src/sim/Player.ts',
    ]));
    // Match.ts: the config field, the readonly field, the constructor `?? false` (twice on
    // that one line) and the ONE executable read in the carry law.
    expect(count(matchSource, /gkDiveBody/g)).toBe(5); // config · readonly · ctor ×2 · the read
    expect(linesOf(matchSource, '  gkDiveBody?: boolean;')).toBe(1);
    expect(linesOf(matchSource, '  readonly gkDiveBody: boolean;')).toBe(1);
    expect(linesOf(matchSource, '    this.gkDiveBody = cfg.gkDiveBody ?? false;')).toBe(1);
    expect(count(leagueSource, /^ {4}\| 'gkDiveBody'$/gm)).toBe(1);
    // Player.ts names the flag in PROSE only — the field's own docblock. It cannot read it.
    expect(count(playerSource, /gkDiveBody/g)).toBe(1);
    for (const line of playerSource.split('\n').filter((l) => l.includes('gkDiveBody'))) {
      expect(line.trimStart().startsWith('*')).toBe(true);
    }
    // ⭐⭐ ONE EXECUTABLE READ PER FILE, THREE FILES, THREE SITES
    expect(count(mechSource, /match\.gkDiveBody/g)).toBe(1);
    // the executor names it twice: ONE executable read plus the docblock line that says
    // what the flag does. The prose line cannot read anything.
    expect(count(execSource, /match\.gkDiveBody/g)).toBe(2);
    expect(count(execSource, /^ *\/\/[^\n]*match\.gkDiveBody/gm)).toBe(1);
    expect(count(execSource, /^ {4}match\.gkDiveBody && p\.saveAnimTimer > 0 && p\.saveContact !== null$/gm)).toBe(1);
    expect(count(matchSource, /this\.gkDiveBody/g)).toBe(2); // the ctor write + the ONE read
  });

  it('⭐⭐ EXACTLY ONE `saveContact` WRITE IN mechanics.ts, above the catch/parry split', () => {
    expect(count(mechSource, /saveContact/g)).toBe(2); // the docblock line + the write
    expect(linesOf(
      mechSource,
      '    if (match.gkDiveBody) gk.saveContact = { x: ball.pos.x, y: ball.pos.y };',
    )).toBe(1);
    expect(count(mechSource, /gk\.saveContact = /g)).toBe(1);
    // ANCHORED ORDER: the write sits after the roll and BEFORE the catch/parry split, so
    // both branches carry it and neither branch's arithmetic moved.
    const rollAt = mechSource.indexOf('  if (match.rng.chance(saveP)) {');
    const writeAt = mechSource.indexOf('    if (match.gkDiveBody) gk.saveContact =');
    const splitAt = mechSource.indexOf('    if (dNow <= reach && speed < 21 && match.rng.chance(0.8)) {');
    expect(rollAt).toBeGreaterThan(0);
    expect(writeAt).toBeGreaterThan(rollAt);
    expect(splitAt).toBeGreaterThan(writeAt);
    // ⛔ NOTHING ELSE MOVED IN THE SAVE: the window, the reach, the stretch, the parry's
    // velocity, the cooldown and the two event texts are the shipped lines.
    expect(linesOf(mechSource, '  gk.saveAnimTimer = 0.7; // the dive is visible whether it saves or not (27.4)')).toBe(1);
    expect(linesOf(mechSource, 'const SAVE_STRETCH = 1.35;')).toBe(1);
    expect(linesOf(mechSource, '      ball.vel = scale(rotate(inDir, ang), clamp(len(ball.vel) * 0.45, 7, 12));')).toBe(1);
    expect(linesOf(mechSource, '      gk.kickCooldown = 0.6; // let the parry leave the keeper\'s feet')).toBe(1);
    expect(count(mechSource, /keeperReach\(defTeam, gk\)/g)).toBe(1);
  });

  it('⭐⭐ EXACTLY ONE EXECUTOR OVERRIDE, naming exactly THREE action types', () => {
    expect(count(execSource, /saveContact/g)).toBe(4); // the guard, the two rush reads, the clamp
    expect(count(execSource, /p\.saveAnimTimer > 0 && p\.saveContact !== null/g)).toBe(1);
    expect(execSource).toContain(
      "    && (p.action.type === 'GoalkeeperSave' || p.action.type === 'GoalkeeperPosition'\n"
      + "      || p.action.type === 'GoalkeeperRush')",
    );
    // the clamp discipline: the two BOX cases carry `clampToBox`, the rush is raw
    expect(execSource).toContain("    target = p.action.type === 'GoalkeeperRush'");
    expect(execSource).toContain('      : clampToBox(p.saveContact, team.attackDir);');
    // …and each of those cases clamps its OWN target the same way (the anchored lines)
    expect(linesOf(execSource, '      target = clampToBox(sol.point, team.attackDir);')).toBe(1);
    expect(linesOf(execSource,
      '      target = clampToBox({ x: goal.x + tbx * k, y: goal.y + tby * k }, team.attackDir);'))
      .toBe(1);
    // the override sits AFTER the switch, so it wins over every keeper case's own target —
    // including `GoalkeeperPosition`'s early-break branch.
    const posCaseAt = execSource.indexOf("    case 'GoalkeeperPosition': {");
    const overrideAt = execSource.indexOf('  if (\n    match.gkDiveBody && p.saveAnimTimer > 0');
    const wallAt = execSource.indexOf('  // Free-kick WALL (Phase 32):');
    expect(posCaseAt).toBeGreaterThan(0);
    expect(overrideAt).toBeGreaterThan(posCaseAt);
    expect(wallAt).toBeGreaterThan(overrideAt);
    // ⭐ THE FK WALL CANNOT TAKE A KEEPER, so nothing downstream can steal the dive
    expect(matchSource).toContain("          .filter((p) => p.role !== 'GK' && !p.sentOff)");
  });

  it('⭐⭐ EXACTLY ONE WAITING BRANCH IN Match.ts, BEFORE the normal placement', () => {
    expect(count(matchSource, /saveContact/g)).toBe(8);
    expect(count(matchSource, /const gkHands = this\.gkDiveBody/g)).toBe(1);
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
  });

  it('⭐⭐ THE FIELD `saveContact` — one declaration, three clears, no serialization path', () => {
    expect(count(playerSource, /saveContact/g)).toBe(7); // the docblock ×3, the declaration, 3 clears
    expect(linesOf(playerSource, '  saveContact: { x: number; y: number } | null = null;')).toBe(1);
    // ⛔ it never enters a save, a clone or the render adapter
    for (const rel of ['sim/League.ts', 'sim/rendezvousRecovery.ts', 'render3d/RenderStateAdapter.ts',
      'render/MatchRenderer.ts']) {
      expect(src(rel)).not.toContain('saveContact');
    }
  });
});

describe('GK T0 — the fingerprint of record', () => {
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
