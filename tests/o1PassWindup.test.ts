import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags } from '../src/game/a4World';
import type { Player } from '../src/sim/Player';
import { Rng } from '../src/utils/rng';

/**
 * O1 T1 — the shortPass wind-up (`pendingPassWindup`), DORMANT
 * (docs/world-model/O1-T1-PASS-WINDUP.md).
 *
 * The C7-T1 test idiom (`tests/c7Windup.test.ts`), carried over. These are the
 * gate-pinning tests the freeze names (§GATES):
 *   G1  X-FP-PROD          the production fingerprint 57b0bdab…c673 is unchanged
 *   G2  FLAG-OFF IDENTITY  a flag-absent match is tick-identical to a plain one
 *   G3  NON-VACUITY        the armed world reaches the seam AND diverges
 *   G4  SEAM SINGULARITY   one arm site; cutback + kickoff never route (source AND
 *                          functional); no other kind's commit line sees the flag
 *   G5  NO NEW CHARGE      zero rng at arm; no price term in the arm body
 *   G6  NEVER RELEASES OWNERSHIP  the ball is owned across the window; no writes
 *   G7  RELEASE ONCE       performPass runs once, at readyTick; zero if interrupted
 *   G8  W ∈ [3,11]         the frozen clamp, and the law reads attrs.PASSING
 *   plus the re-decide lock (holds while owning, lapses on loss).
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, o1PassWindup?: boolean) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: 240, ...(o1PassWindup === undefined ? {} : { o1PassWindup }),
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const brainSource = readFileSync(new URL('../src/ai/PlayerBrain.ts', import.meta.url), 'utf8');
const matchSource = readFileSync(new URL('../src/sim/Match.ts', import.meta.url), 'utf8');
const execSource = readFileSync(new URL('../src/ai/actionExecutor.ts', import.meta.url), 'utf8');
const armSource = matchSource.slice(
  matchSource.indexOf('armPendingPass(passer: Player'),
  matchSource.indexOf('private resolvePendingPassWindup()'));

// Drive an OFF base to a 'playing' tick, then hand `passer` a clean owned ball with
// every opponent parked in the far corner (no ball-keyed tackle can reach the
// window). The controlled fixture the structural window tests step through.
const armedFixture = (seed: number): {
  m: Match; passer: Player; mate: Player; readyTick: number;
} => {
  const m = matchOf(seed, true);
  while (m.phase !== 'playing') m.step(DT);
  for (let i = 0; i < 30 && m.phase === 'playing'; i++) m.step(DT);
  const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
  const passer = outfield[0];
  const mate = outfield[1];
  for (const o of m.teams[1].players) {
    o.pos = { x: 50, y: 30 };
    o.vel = { x: 0, y: 0 };
  }
  passer.kickCooldown = 0;
  passer.stunTimer = 0;
  passer.sentOff = false;
  passer.firstTouchWindow = 0;
  passer.vel = { x: 3, y: 0 };
  m.ball.owner = passer;
  m.ball.pos = { x: passer.pos.x + 0.85, y: passer.pos.y };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.armPendingPass(passer, mate);
  return { m, passer, mate, readyTick: m.pendingPassWindup!.readyTick };
};

describe('O1 T1 — the shortPass wind-up is dormant (Road B)', () => {
  it('default-off: o1PassWindup false / pendingPassWindup null on a fresh Match and a League fixture', () => {
    const fresh = matchOf(7);
    expect(fresh.o1PassWindup).toBe(false);
    expect(fresh.pendingPassWindup).toBeNull();
    // Not env-armed, not default-ON, never EDS_BUNDLE_ARMED — OFF regardless of env.
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.o1PassWindup).toBe(false);
    expect(bare.pendingPassWindup).toBeNull();
    const league = new League({ seed: 20260808 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.o1PassWindup).toBe(false);
    expect(live.pendingPassWindup).toBeNull();
    // and the a4 play-test world only arms it for the EXPLICIT v3 opt-in
    // (#184.2 — until then this asserted the name was absent entirely; phase-0
    // trap 12 lives on as the narrower claim that matters): the CENSUS substrate
    // is not widened, so v1/v2 and every non-opt-in path stay wind-up-free.
    const a4Source = readFileSync(new URL('../src/game/a4World.ts', import.meta.url), 'utf8');
    const censusBlock = /export const A4_WORLD_FLAGS = \{([\s\S]*?)\} as const;/.exec(a4Source)?.[1];
    expect(censusBlock).toBeDefined();
    expect(censusBlock).not.toContain('o1PassWindup');
    expect(a4MatchFlags(1).o1PassWindup).toBeUndefined();
    expect(a4MatchFlags(2).o1PassWindup).toBeUndefined();
    expect(a4MatchFlags(3).o1PassWindup).toBe(true); // the one licensed arm site
  });

  it('G1 X-FP-PROD: the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 180_000);

  it('G2 FLAG-OFF IDENTITY: flag absent === flag false === a plain run, tick for tick', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    for (const seed of [7, 4242]) {
      const absent = runToEnd(matchOf(seed));
      expect(runToEnd(matchOf(seed, false))).toBe(absent);
      expect(runToEnd(matchOf(seed))).toBe(absent);
    }
  });

  it('G3 NON-VACUITY: arming o1PassWindup reaches the seam and changes the world', () => {
    for (const seed of [4242, 90210, 20260808]) {
      const off = matchOf(seed, false);
      const on = matchOf(seed, true);
      let reached = 0;
      while (!on.finished) {
        on.step(DT);
        if (on.pendingPassWindup !== null) reached++;
      }
      while (!off.finished) off.step(DT);
      expect(reached).toBeGreaterThan(0); // the wind-up actually fired
      expect(signature(on)).not.toBe(signature(off));
    }
  });

  it('G4 SEAM SINGULARITY (source): one arm site, in the performPass branch only', () => {
    expect((brainSource.match(/match\.armPendingPass\(/g) ?? []).length).toBe(1);
    expect((matchSource.match(/armPendingPass\(/g) ?? []).length).toBe(1); // the definition only
    const passCase = brainSource.slice(
      brainSource.indexOf("case 'Pass':"), brainSource.indexOf("case 'LoftedPass': {"));
    // the fork: armed + not a restart taker + the one-touch window CLOSED
    expect(passCase).toMatch(
      /if \(match\.o1PassWindup && !mustKick && p\.firstTouchWindow <= 0\) \{/);
    expect(passCase).toMatch(/match\.armPendingPass\(p, passMate!, offsideExemptKick\);/);
    expect(passCase).toMatch(/else match\.performPass\(p, passMate!, offsideExemptKick\);/);
    // the CUTBACK statement inside the same case is untouched, on its own line.
    const cutbackLine = brainSource.split('\n').find((l) => l.includes('match.performCutback('))!;
    expect(cutbackLine.trim()).toBe('match.performCutback(p, cutbackMate!);');
    expect(cutbackLine).not.toContain('o1PassWindup');
    // the KICKOFF pass (off-switch) is untouched.
    const kickoffLine = brainSource.split('\n').find((l) => l.includes('match.performPass(p, back)'))!;
    expect(kickoffLine.trim()).toBe('match.performPass(p, back);');
    expect(kickoffLine).not.toContain('o1PassWindup');
    // No other release path is wrapped by the flag — they release synchronously.
    for (const fn of [
      'performCutback', 'performLoftedPass', 'performCross', 'performKeeperThrow',
      'performThroughBall', 'performClear', 'performFreeKick', 'performShot',
    ]) {
      for (const line of brainSource.split('\n').filter((l) => l.includes(`match.${fn}(`))) {
        expect(line).not.toContain('o1PassWindup');
        expect(line).not.toContain('armPendingPass');
      }
    }
  });

  it('G4 NO-ROUTE (functional): a cutback never enters the wind-up', () => {
    let cutbacks = 0;
    for (const seed of [4242, 90210, 20260808]) {
      const m = matchOf(seed, true);
      const orig = m.performCutback.bind(m);
      m.performCutback = (p: Player, mate: Player) => {
        cutbacks++;
        // the cutback is synchronous: this body is not winding a pass up right now
        expect(m.pendingPassWindup === null || m.pendingPassWindup.gid !== p.gid).toBe(true);
        const before = m.ball.owner;
        orig(p, mate);
        // and it left the foot on this very tick (the ball is no longer owned)
        expect(before).toBe(p);
        expect(m.ball.owner).toBeNull();
        expect(m.pendingPassWindup === null || m.pendingPassWindup.gid !== p.gid).toBe(true);
      };
      while (!m.finished) m.step(DT);
    }
    expect(cutbacks).toBeGreaterThan(0); // non-vacuous
  });

  it('G4 NO-ROUTE (functional): the kickoff pass never enters the wind-up', () => {
    let kickoffs = 0;
    for (const seed of [4242, 90210]) {
      const m = matchOf(seed, true);
      while (!m.finished) {
        const pending = m.kickoffKickGid;
        m.step(DT);
        if (pending !== null && m.kickoffKickGid === null) {
          kickoffs++;
          // the kickoff release is synchronous — no wind-up was armed for that body
          expect(m.pendingPassWindup === null || m.pendingPassWindup.gid !== pending).toBe(true);
        }
      }
    }
    expect(kickoffs).toBeGreaterThan(0); // non-vacuous
  });

  it('THE ONE-TOUCH BYPASS: window > 0 ⇒ no wind-up, the release goes now', () => {
    let arms = 0;
    let bypasses = 0;
    for (const seed of [4242, 90210]) {
      const m = matchOf(seed, true);
      const origArm = m.armPendingPass.bind(m);
      m.armPendingPass = (p: Player, mate: Player, oe?: boolean) => {
        arms++;
        expect(p.firstTouchWindow).toBeLessThanOrEqual(0); // never armed one-touch
        origArm(p, mate, oe);
      };
      const origPass = m.performPass.bind(m);
      m.performPass = (p: Player, mate: Player, oe?: boolean, pc?: number) => {
        if (p.firstTouchWindow > 0) bypasses++; // released immediately, at oneTouchMul
        origPass(p, mate, oe, pc);
      };
      while (!m.finished) m.step(DT);
    }
    expect(arms).toBeGreaterThan(0);
    expect(bypasses).toBeGreaterThan(0); // the DESIGNED bypass has a real population
  });

  it('G5 NO NEW CHARGE: the arm draws zero rng and carries no price term', () => {
    const { m } = armedFixture(4242);
    // the arm body prices nothing — TIME only (the NO-TOUCH list)
    for (const term of [
      'oneTouchMul', 'orientationNoiseMul', 'orientationPowerMul', 'pressureAt',
      'gaussian', 'kickMisalignment', 'kickCooldown =', 'firstTouchWindow =',
    ]) expect(armSource).not.toContain(term);
    // and it consumes no rng: arming again leaves the stream untouched
    const before = (m.rng as unknown as { s: number }).s;
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    m.armPendingPass(outfield[0], outfield[1]);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  it('G6 NEVER RELEASES OWNERSHIP: the ball stays owned by the passer across the window', () => {
    const { m, passer, readyTick } = armedFixture(4242);
    while (m.simTick < readyTick - 1) {
      m.step(DT);
      expect(m.ball.owner).toBe(passer);
      expect(m.pendingPassWindup).not.toBeNull();
    }
    // (b) the arm + plant code write ball.owner nowhere
    expect(armSource).toContain('this.pendingPassWindup = {');
    expect(armSource).not.toMatch(/\.owner\s*=[^=]/);
    const plant = execSource.slice(
      execSource.indexOf('const pp = match.pendingPassWindup;'),
      execSource.indexOf('// Stay onside (Phase 29)'));
    expect(plant).toContain('target = { x: p.pos.x, y: p.pos.y };');
    expect(plant).not.toMatch(/\.owner\s*=[^=]/);
  });

  it('G7 RELEASE ONCE, AT readyTick: never at commit, never twice', () => {
    const { m, passer, mate, readyTick } = armedFixture(90210);
    const spy = vi.spyOn(m, 'performPass');
    while (m.simTick < readyTick - 1) {
      m.step(DT);
      expect(spy).not.toHaveBeenCalled(); // the deferred math never runs in-window
    }
    m.step(DT); // stepCount -> readyTick
    expect(m.simTick).toBe(readyTick);
    expect(spy).toHaveBeenCalledTimes(1);
    // ⚠⚠ NARROWED BY DX-T0 (#352 item 3; the DF-T0 §P7 form ratified at #323 item 1 — a
    // pinned test is NARROWED, never deleted, and made POSITIVELY). The resolve now hands
    // `performPass` its two DORMANT inputs explicitly: the certified power `1` and the
    // elected aim, which is `null` on this and every certified path. O1's claim — released
    // ONCE, at `readyTick`, to the ARM-TIME mate with the ARM-TIME offside flag — is
    // unweakened, and the two dormant inputs are now pinned at their certified values.
    expect(spy).toHaveBeenCalledWith(passer, mate, false, 1, null);
    expect(m.pendingPassWindup).toBeNull(); // consumed
    m.step(DT);
    expect(spy).toHaveBeenCalledTimes(1); // never twice
  });

  it('G7 INTERRUPTION cancels cleanly: ZERO releases when the passer is stunned in-window', () => {
    const { m, passer, readyTick } = armedFixture(90210);
    const spy = vi.spyOn(m, 'performPass');
    m.step(DT);
    passer.stunTimer = 1; // an EXISTING channel (INT-STUN)
    while (m.simTick < readyTick) m.step(DT);
    expect(m.simTick).toBe(readyTick);
    expect(spy).not.toHaveBeenCalled();
    expect(m.pendingPassWindup).toBeNull(); // the slot is cleared, not leaked
    expect(passer.faceTarget).toBeNull(); // the aim lock is released
  });

  it('G7 INTERRUPTION cancels cleanly: ZERO releases when the ball is lost in-window', () => {
    const { m, readyTick } = armedFixture(4242);
    const spy = vi.spyOn(m, 'performPass');
    m.step(DT);
    m.ball.owner = null; // the ball left through an existing channel (INT-LOSS)
    while (m.simTick < readyTick) m.step(DT);
    expect(spy).not.toHaveBeenCalled();
    expect(m.pendingPassWindup).toBeNull();
  });

  it('G8 the duration law: W ∈ [3,11] ticks and it reads attrs.PASSING (not dribbling)', () => {
    const wOf = (passing: number, dribbling: number): number => {
      const m = matchOf(31337, true);
      while (m.phase !== 'playing') m.step(DT);
      const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
      const [passer, mate] = outfield;
      passer.attrs.passing = passing;
      passer.attrs.dribbling = dribbling;
      passer.vel = { x: 4, y: 0 };
      m.armPendingPass(passer, mate);
      return m.pendingPassWindup!.readyTick - m.simTick;
    };
    const clumsy = wOf(0.05, 0.4);
    const skilled = wOf(0.95, 0.4);
    // technique buys the set-up time back — the C7 §LAW's tech term, on `passing`
    expect(skilled).toBeLessThan(clumsy);
    // and `dribbling` is NOT an input on this path
    expect(wOf(0.5, 0.05)).toBe(wOf(0.5, 0.95));
    for (const w of [clumsy, skilled, wOf(0.5, 0.5)]) {
      expect(Number.isInteger(w)).toBe(true);
      expect(w).toBeGreaterThanOrEqual(3);
      expect(w).toBeLessThanOrEqual(11);
    }
  });

  it('THE RE-DECIDE LOCK holds while the winding-up body still owns the ball', () => {
    const { m, passer } = armedFixture(4242);
    const sentinel = { type: 'HoldUp' as const, scores: [] };
    passer.action = sentinel;
    passer.decisionTimer = 0;
    decidePlayer(passer, m); // locked: returns before the switch
    expect(passer.action).toBe(sentinel);
    // the lock LAPSES the moment the ball is lost (a charge-down inside the window)
    m.ball.owner = null;
    decidePlayer(passer, m);
    expect(passer.action).not.toBe(sentinel);
  });

  it('the IN-ENGINE ledger is all-zero on a fresh Match and stays zero with the flag OFF', () => {
    const fresh = matchOf(7);
    expect(fresh.o1WindupLedger).toEqual({
      arms: 0, evictions: 0, struck: 0, cancelledMate: 0,
      cancelledPendingKick: 0, cancelledByPendingKick: 0,
    });
    const off = matchOf(4242, false);
    while (!off.finished) off.step(DT);
    expect(off.o1WindupLedger).toEqual({
      arms: 0, evictions: 0, struck: 0, cancelledMate: 0,
      cancelledPendingKick: 0, cancelledByPendingKick: 0,
    });
  });

  it('X-DET: the armed world is deterministic (no rng added to the wind-up)', () => {
    const a = matchOf(90210, true);
    const b = matchOf(90210, true);
    while (!a.finished) a.step(DT);
    while (!b.finished) b.step(DT);
    expect(signature(a)).toBe(signature(b));
    expect(a.score).toEqual(b.score);
  });
});

/**
 * O1 T2 — THE THREE #180.3 ROBUSTNESS DEBTS, fixed on the licensed seam path
 * (docs/world-model/O1-T2-MATCH-AB.md §DEBTS):
 *   (i)   INT-MATE      the arm-time mate must still be on the pitch AND still be
 *                       him at readyTick; a send-off or a substitution CANCELS.
 *   (ii)  EVICTIONS     slot overwrites are counted IN-ENGINE (not in a probe
 *                       wrapper), the counter is falsifiable, and the in-match
 *                       unreachability argument is TESTED, not assumed.
 *   (iii) PRECEDENCE    a body has one set of legs: arming one wind-up cancels a
 *                       live same-gid other one. BOTH orders.
 */
describe('O1 T2 — the three #180.3 seam-robustness debts', () => {
  const bothArmedMatch = (seed: number) => new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: 240, c7Windup: true, o1PassWindup: true,
  });

  /* ---------------- (i) INT-MATE ---------------- */

  it('(i) INT-MATE: a mate SENT OFF inside the window cancels the release', () => {
    const { m, passer, mate, readyTick } = armedFixture(4242);
    const spy = vi.spyOn(m, 'performPass');
    m.step(DT);
    m.sendOff(mate); // an EXISTING channel takes the mate off the pitch
    expect(mate.sentOff).toBe(true);
    while (m.simTick < readyTick) m.step(DT);
    expect(m.simTick).toBe(readyTick);
    expect(spy).not.toHaveBeenCalled(); // the pass NEVER left the foot
    expect(m.pendingPassWindup).toBeNull(); // the slot is cleared, not leaked
    expect(passer.faceTarget).toBeNull(); // the aim lock is released
    expect(m.ball.owner).toBe(passer); // the ball stays with the passer
    expect(m.o1WindupLedger.cancelledMate).toBe(1);
    expect(m.o1WindupLedger.struck).toBe(0);
  });

  it('(i) INT-MATE: a mate SUBSTITUTED inside the window (gid reused) cancels too', () => {
    const { m, passer, mate, readyTick } = armedFixture(90210);
    const spy = vi.spyOn(m, 'performPass');
    m.step(DT);
    // Phase 61: the pitch slot object is reused — a fresh identity, same gid.
    const armedRosterIdx = m.pendingPassWindup!.targetRosterIdx;
    mate.becomeSub(
      { rosterIdx: armedRosterIdx + 100, name: 'SUB', attrs: { ...mate.attrs } },
      { x: 0, y: 0 },
    );
    expect(mate.sentOff).toBe(false); // NOT a send-off — a gid-only check would pass
    expect(mate.rosterIdx).not.toBe(armedRosterIdx);
    while (m.simTick < readyTick) m.step(DT);
    expect(spy).not.toHaveBeenCalled();
    expect(m.pendingPassWindup).toBeNull();
    expect(m.ball.owner).toBe(passer);
    expect(m.o1WindupLedger.cancelledMate).toBe(1);
  });

  it('(i) INT-MATE is not vacuous: an untouched mate still receives at readyTick', () => {
    const { m, passer, mate, readyTick } = armedFixture(4242);
    const spy = vi.spyOn(m, 'performPass');
    while (m.simTick < readyTick) m.step(DT);
    expect(spy).toHaveBeenCalledTimes(1);
    // ⚠⚠ NARROWED BY DX-T0 (#352 item 3), exactly as G7 above and for the same reason:
    // the certified power `1` and the elected aim `null` are now explicit arguments. The
    // INT-MATE claim — the untouched ARM-TIME mate really receives — is unweakened.
    expect(spy).toHaveBeenCalledWith(passer, mate, false, 1, null);
    expect(m.o1WindupLedger.cancelledMate).toBe(0);
    expect(m.o1WindupLedger.struck).toBe(1);
  });

  /* ---------------- (ii) EVICTION ACCOUNTING, IN-ENGINE ---------------- */

  it('(ii) EVICTIONS are counted in-engine, and the counter is falsifiable', () => {
    const { m, readyTick } = armedFixture(4242);
    expect(m.o1WindupLedger.arms).toBe(1);
    expect(m.o1WindupLedger.evictions).toBe(0); // one live arm, nothing overwritten
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    // a second arm while the first is still live: the single slot is overwritten
    m.armPendingPass(outfield[0], outfield[2]);
    expect(m.o1WindupLedger.arms).toBe(2);
    expect(m.o1WindupLedger.evictions).toBe(1); // COUNTED, not assumed away
    expect(m.pendingPassWindup!.targetGid).toBe(outfield[2].gid); // the later arm holds it
    expect(readyTick).toBeGreaterThan(0);
  });

  it('(ii) the in-match unreachability argument, TESTED: zero evictions over armed matches', () => {
    for (const seed of [4242, 90210]) {
      const m = matchOf(seed, true);
      while (!m.finished) {
        m.step(DT);
        // the engine's own count, every tick — never a probe-side reconstruction
        expect(m.o1WindupLedger.evictions).toBe(0);
      }
      expect(m.o1WindupLedger.arms).toBeGreaterThan(0); // non-vacuous
      // and the ledger closes: every arm either struck, cancelled or is still live
      expect(m.o1WindupLedger.struck).toBeGreaterThan(0);
      expect(m.o1WindupLedger.struck + m.o1WindupLedger.cancelledMate)
        .toBeLessThanOrEqual(m.o1WindupLedger.arms);
    }
  });

  /* ---------------- (iii) PRECEDENCE, BOTH ORDERS ---------------- */

  it('(iii) PRECEDENCE pass→shot: arming the shot cancels the live pass wind-up', () => {
    const m = bothArmedMatch(4242);
    while (m.phase !== 'playing') m.step(DT);
    for (let i = 0; i < 30 && m.phase === 'playing'; i++) m.step(DT);
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    const [passer, mate] = outfield;
    for (const o of m.teams[1].players) { o.pos = { x: 50, y: 30 }; o.vel = { x: 0, y: 0 }; }
    passer.kickCooldown = 0; passer.stunTimer = 0; passer.firstTouchWindow = 0;
    m.ball.owner = passer;
    m.ball.pos = { x: passer.pos.x + 0.85, y: passer.pos.y };
    m.ball.vel = { x: 0, y: 0 }; m.ball.z = 0;

    m.armPendingPass(passer, mate);
    expect(m.pendingPassWindup).not.toBeNull();
    m.armPendingKick(passer, { x: 30, y: 0 });
    // one set of legs: the LATER arm owns them
    expect(m.pendingPassWindup).toBeNull();
    expect(m.pendingKick).not.toBeNull();
    expect(m.o1WindupLedger.cancelledByPendingKick).toBe(1);
    expect(m.o1WindupLedger.cancelledPendingKick).toBe(0);
    const passSpy = vi.spyOn(m, 'performPass');
    const shotSpy = vi.spyOn(m, 'performShot');
    const readyTick = m.pendingKick!.readyTick;
    while (m.simTick < readyTick) m.step(DT);
    expect(shotSpy).toHaveBeenCalledTimes(1); // the shot resolved
    expect(passSpy).not.toHaveBeenCalled(); // the cancelled pass never ran
  });

  it('(iii) PRECEDENCE shot→pass: arming the pass cancels the live shot wind-up', () => {
    const m = bothArmedMatch(90210);
    while (m.phase !== 'playing') m.step(DT);
    for (let i = 0; i < 30 && m.phase === 'playing'; i++) m.step(DT);
    const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
    const [passer, mate] = outfield;
    for (const o of m.teams[1].players) { o.pos = { x: 50, y: 30 }; o.vel = { x: 0, y: 0 }; }
    passer.kickCooldown = 0; passer.stunTimer = 0; passer.firstTouchWindow = 0;
    m.ball.owner = passer;
    m.ball.pos = { x: passer.pos.x + 0.85, y: passer.pos.y };
    m.ball.vel = { x: 0, y: 0 }; m.ball.z = 0;

    m.armPendingKick(passer, { x: 30, y: 0 });
    expect(m.pendingKick).not.toBeNull();
    m.armPendingPass(passer, mate);
    expect(m.pendingKick).toBeNull();
    expect(m.pendingPassWindup).not.toBeNull();
    expect(m.o1WindupLedger.cancelledPendingKick).toBe(1);
    expect(m.o1WindupLedger.cancelledByPendingKick).toBe(0);
    const passSpy = vi.spyOn(m, 'performPass');
    const shotSpy = vi.spyOn(m, 'performShot');
    const readyTick = m.pendingPassWindup!.readyTick;
    while (m.simTick < readyTick) m.step(DT);
    expect(passSpy).toHaveBeenCalledTimes(1); // the pass resolved
    expect(shotSpy).not.toHaveBeenCalled(); // the cancelled strike never ran
  });

  it('(iii) the double-pending body is UNREACHABLE in a live match (both flags armed)', () => {
    for (const seed of [4242, 90210]) {
      const m = bothArmedMatch(seed);
      let sawPass = 0; let sawShot = 0;
      while (!m.finished) {
        m.step(DT);
        const pp = m.pendingPassWindup;
        const pk = m.pendingKick;
        if (pp !== null) sawPass++;
        if (pk !== null) sawShot++;
        // never the same body in both slots at once
        expect(pp === null || pk === null || pp.gid !== pk.gid).toBe(true);
      }
      expect(sawPass).toBeGreaterThan(0); // non-vacuous on both seams
      expect(sawShot).toBeGreaterThan(0);
      // and the defensive precedence never had to fire
      expect(m.o1WindupLedger.cancelledPendingKick).toBe(0);
      expect(m.o1WindupLedger.cancelledByPendingKick).toBe(0);
    }
  });

  it('the C7 shot path is untouched with o1PassWindup OFF (the precedence line is gated)', () => {
    const armKick = matchSource.slice(
      matchSource.indexOf('armPendingKick(shooter: Player'),
      matchSource.indexOf('private resolvePendingKick()'));
    // the only O1 addition to the certified method is gated on the flag
    expect(armKick).toContain('this.o1PassWindup && this.pendingPassWindup !== null');
    expect(armKick).not.toMatch(/\.owner\s*=[^=]/); // still writes no ownership
    // and a c7-only world behaves exactly as the certified C7 world
    const c7Only = (seed: number) => new Match({
      seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
      duration: 240, c7Windup: true,
    });
    const withFlagAbsent = c7Only(4242);
    const withFlagFalse = new Match({
      seed: 4242, teamA: team('A', 4242 * 2 + 1), teamB: team('B', 4242 * 2 + 2),
      duration: 240, c7Windup: true, o1PassWindup: false,
    });
    while (!withFlagAbsent.finished) withFlagAbsent.step(DT);
    while (!withFlagFalse.finished) withFlagFalse.step(DT);
    expect(signature(withFlagFalse)).toBe(signature(withFlagAbsent));
  });
});
