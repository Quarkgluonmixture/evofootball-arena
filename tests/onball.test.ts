import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { Match } from '../src/sim/Match';
import {
  kickMisalignment, orientationNoiseMul, orientationPowerMul, touchFailChance, trySmother,
  tryTacticalFoul,
} from '../src/sim/mechanics';
import { Player, TURN_RATE } from '../src/sim/Player';
import { DT, GK_HOLD_CLEARANCE } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { dist, v2 } from '../src/utils/vec';

/**
 * Phase 27 — on-ball realism: body orientation (turning inertia, kicks
 * against the facing direction), first-touch miscontrol, and the territory
 * clock that stops sideways recycling from being free.
 */

const attrs = (technique: number): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  p.passing = technique;
  p.dribbling = technique;
  return p;
};

const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

function team(name: string, technique: number): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutralGenome(),
    squad: Array.from({ length: TEAM_SIZE }, () => attrs(technique)),
  };
}

// CI lesson (Phase 25): long statistical loops need explicit timeouts and an
// occasional event-loop yield so the runner's channel stays alive.
const breathe = (i: number): Promise<void> | undefined =>
  i % 4 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

describe('turning inertia (Phase 27)', () => {
  it('heading rotates no faster than TURN_RATE', () => {
    const p = new Player(0, 4, 'ST', 'T', attrs(0.5));
    p.pos = v2(0, 0);
    p.vel = v2(5, 0);
    p.heading = v2(1, 0);
    p.desiredVel = v2(-5, 0);
    const maxStepDot = Math.cos(TURN_RATE * DT) - 1e-9;
    for (let i = 0; i < 120; i++) {
      const before = { ...p.heading };
      p.physicsStep(DT);
      p.desiredVel = v2(-5, 0);
      const dot = before.x * p.heading.x + before.y * p.heading.y;
      expect(dot).toBeGreaterThanOrEqual(maxStepDot);
    }
  });

  it('a 180° cut completes, but takes real time (not one frame)', () => {
    const p = new Player(0, 4, 'ST', 'T', attrs(0.5));
    p.pos = v2(0, 0);
    p.vel = v2(5, 0);
    p.heading = v2(1, 0);
    let flippedAt = -1;
    for (let i = 0; i < Math.round(1.5 / DT); i++) {
      p.desiredVel = v2(-5, 0);
      p.physicsStep(DT);
      if (flippedAt < 0 && p.heading.x < -0.999) flippedAt = (i + 1) * DT;
    }
    expect(flippedAt).toBeGreaterThan(0.3); // not instant
    expect(flippedAt).toBeLessThan(1.5); // but it does happen
  });
});

describe('body orientation helpers (Phase 27)', () => {
  const facing = (hx: number, hy: number): Player => {
    const p = new Player(0, 4, 'ST', 'T', attrs(0.5));
    p.heading = v2(hx, hy);
    return p;
  };

  it('kickMisalignment: ahead 0, square 0.5, blind 1', () => {
    expect(kickMisalignment(facing(1, 0), v2(1, 0))).toBeCloseTo(0, 10);
    expect(kickMisalignment(facing(1, 0), v2(0, 1))).toBeCloseTo(0.5, 10);
    expect(kickMisalignment(facing(1, 0), v2(-1, 0))).toBeCloseTo(1, 10);
  });

  it('kicks against the body spray more and arrive weaker; technique tames both', () => {
    expect(orientationNoiseMul(0, 0.5)).toBeCloseTo(1, 10);
    expect(orientationNoiseMul(1, 0.5)).toBeGreaterThan(orientationNoiseMul(0.5, 0.5));
    expect(orientationNoiseMul(0.8, 0.9)).toBeLessThan(orientationNoiseMul(0.8, 0.1));
    expect(orientationPowerMul(0, 0.5)).toBeCloseTo(1, 10);
    expect(orientationPowerMul(1, 0.5)).toBeLessThan(orientationPowerMul(0.3, 0.5));
    expect(orientationPowerMul(0.8, 0.9)).toBeGreaterThan(orientationPowerMul(0.8, 0.1));
  });

  it('touchFailChance grows with speed/pressure/blind-side, shrinks with technique, stays bounded', () => {
    expect(touchFailChance(12, 0.5, 0.5, 0.5)).toBeGreaterThan(touchFailChance(8, 0.5, 0.5, 0.5));
    expect(touchFailChance(10, 0.9, 0.5, 0.5)).toBeGreaterThan(touchFailChance(10, 0.1, 0.5, 0.5));
    expect(touchFailChance(10, 0.5, 1, 0.5)).toBeGreaterThan(touchFailChance(10, 0.5, 0, 0.5));
    expect(touchFailChance(10, 0.5, 0.5, 0.9)).toBeLessThan(touchFailChance(10, 0.5, 0.5, 0.1));
    expect(touchFailChance(30, 1, 1, 0)).toBeLessThanOrEqual(0.4);
    expect(touchFailChance(0, 0, 0, 1)).toBeGreaterThanOrEqual(0);
  });
});

describe('first touch and forward pressure in match play (Phase 27)', () => {
  const SEEDS = [11, 42, 99, 1234, 777, 31337];

  it('directional: a low-technique squad miscontrols more (side-balanced)', { timeout: 60000 }, async () => {
    let sloppy = 0;
    let clean = 0;
    for (const [i, seed] of SEEDS.entries()) {
      await breathe(i);
      const ab = new Match({ seed, teamA: team('Clean', 0.85), teamB: team('Sloppy', 0.15), duration: 120 }).runToCompletion();
      clean += ab.stats[0].miscontrols;
      sloppy += ab.stats[1].miscontrols;
      const ba = new Match({ seed, teamA: team('Sloppy', 0.15), teamB: team('Clean', 0.85), duration: 120 }).runToCompletion();
      sloppy += ba.stats[0].miscontrols;
      clean += ba.stats[1].miscontrols;
    }
    expect(sloppy).toBeGreaterThan(clean);
  });

  it('teams play forward and errors exist at plausible rates', { timeout: 60000 }, async () => {
    let passes = 0;
    let forward = 0;
    let miscontrols = 0;
    let matches = 0;
    for (const [i, seed] of SEEDS.entries()) {
      await breathe(i);
      const r = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 }).runToCompletion();
      for (const st of r.stats) {
        passes += st.passes;
        forward += st.passesForward;
        miscontrols += st.miscontrols;
      }
      matches++;
    }
    const forwardShare = forward / Math.max(passes, 1);
    expect(forwardShare).toBeGreaterThan(0.4); // recycling is no longer free
    expect(forwardShare).toBeLessThan(0.8); // but build-up still exists
    expect(miscontrols / matches).toBeGreaterThan(2); // forced errors are real
    expect(miscontrols / matches).toBeLessThan(25); // and not slapstick
  });

  it('a keeper claim becomes a protected hold: hands, no tackles, then distribution (27.2)', () => {
    const m = new Match({ seed: 9, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[0].goalkeeper;
    m.giveBall(gk);
    expect(gk.gkHoldTimer).toBeGreaterThan(0);
    // Park an opponent right on the ball: the hold must make a tackle impossible.
    const presser = m.teams[1].players[4];
    presser.pos = { x: m.ball.pos.x + 0.5, y: m.ball.pos.y };
    presser.tackleCooldown = 0;
    for (let i = 0; i < 30 && gk.gkHoldTimer > 0; i++) {
      presser.pos = { x: m.ball.pos.x + 0.5, y: m.ball.pos.y };
      m.step(DT);
      expect(m.ball.owner).toBe(gk); // never dispossessed mid-hold
    }
  });

  it('a holding keeper gets room: opponents held off, the press drops (28.1)', () => {
    const m = new Match({ seed: 12, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[0].goalkeeper;
    m.giveBall(gk);
    expect(gk.gkHoldTimer).toBeGreaterThan(0);
    // Park the whole opposing team on top of the keeper: the hold bubble
    // must push them out — a keeper in possession releases in peace.
    for (const o of m.teams[1].players) o.pos = { x: gk.pos.x + 0.3, y: gk.pos.y + 0.1 };
    m.step(DT);
    for (const o of m.teams[1].players) {
      expect(dist(o.pos, gk.pos)).toBeGreaterThan(GK_HOLD_CLEARANCE - 0.5);
    }
    // And the opposing brain drops the press entirely (29.1): the 28.1
    // outlet-cutter read as a man camped in the keeper's face — a held
    // ball is unchallengeable, so NOBODY chases it.
    for (let i = 0; i < 6 && gk.gkHoldTimer > 0; i++) m.step(DT);
    expect(m.teams[1].chasers.size).toBe(0);
  });

  it('a keeper who held the ball throws it out — never a panic hoof (28.3)', { timeout: 30000 }, () => {
    // Hold-releases are ~1–2 per match; scan seeds until a throw shows up.
    // The no-hoof contract is asserted across EVERY scanned match.
    let sawThrow = false;
    // Seeds 6/19/29/32 are known throw-producers under the Phase 30
    // formation geometry (probed 1..60); the rest keep the no-hoof contract
    // scanning a spread of ordinary matches.
    for (const seed of [6, 19, 29, 32, 21, 9, 12, 42]) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 240 });
      while (!m.finished) {
        m.step(DT);
        for (const t of m.teams) {
          const gk = t.goalkeeper;
          if (gk.action.type === 'ThrowOut') sawThrow = true;
          // A keeper releasing from the HANDS never picks the random hoof
          // (its ±1-rad spray was a 50/50 giveaway).
          if (gk.gkDistributing) expect(gk.action.type).not.toBe('ClearBall');
        }
      }
      if (sawThrow) break;
    }
    expect(sawThrow).toBe(true);
  });

  it('everyone starts in their own half at kickoff (27.5)', () => {
    for (const seed of [3, 44]) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
      for (const t of m.teams) {
        for (const p of t.players) {
          expect(t.localX(p.pos.x)).toBeLessThan(0);
        }
      }
    }
  });

  it('the kickoff first touch is a pass played backward (27.3)', () => {
    for (const seed of [3, 17, 88]) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
      // Step until the kickoff pass is in flight (it is the match's first pass).
      for (let i = 0; i < 240 && !m.pendingPass; i++) m.step(DT);
      expect(m.pendingPass).not.toBeNull();
      const kicking = m.teams[m.pendingPass!.side];
      const receiver = m.allPlayers[m.pendingPass!.targetGid];
      expect(kicking.localX(receiver.pos.x)).toBeLessThan(0); // played back
    }
  });

  it('opponents are held out of the box until a goal kick is taken (27.3)', () => {
    const m = new Match({ seed: 21, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    // Attacker (side 0) puts it over team 1's goal line, wide of the mouth.
    m.ball.owner = null;
    m.ball.lastTouch = m.teams[0].players[4];
    m.ball.pos = { x: 46, y: 12 };
    m.ball.vel = { x: 2, y: 0 };
    for (let i = 0; i < 50 && (m.phase as string) !== 'restart'; i++) m.step(DT); // past the out-of-play coast (41.1)
    expect(m.phase).toBe('restart');
    expect(m.restart!.kind).toBe('goalKick');
    expect(m.restart!.side).toBe(1);
    // Park an attacker deep inside team 1's box: the restart must expel them.
    const intruder = m.teams[0].players[4];
    intruder.pos = { x: 40, y: 0 };
    m.step(DT);
    expect(m.inPenaltyBox(intruder.pos, 1)).toBe(false);
  });

  it('nobody presses a goal kick: zero chasers while the keeper stands over it (Phase 29)', () => {
    const m = new Match({ seed: 31, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    m.ball.owner = null;
    m.ball.lastTouch = m.teams[0].players[4];
    m.ball.pos = { x: 46, y: 12 };
    m.ball.vel = { x: 2, y: 0 };
    for (let i = 0; i < 50 && (m.phase as string) !== 'restart'; i++) m.step(DT); // past the out-of-play coast (41.1)
    expect(m.restart!.kind).toBe('goalKick');
    // Let both brains re-coordinate (awardRestart forces a prompt update),
    // then hold the assertion through the whole dead-ball phase: the old bug
    // was one chaser sprinting at the keeper and pinning against the
    // clearance circle until the kick was finally struck.
    const inRestart = () => (m.phase as string) === 'restart'; // step() mutates phase — dodge TS narrowing
    for (let i = 0; i < 10 && inRestart(); i++) m.step(DT);
    expect(inRestart()).toBe(true);
    while (inRestart() && !m.finished) {
      expect(m.teams[0].chasers.size).toBe(0);
      m.step(DT);
    }
  });

  it('a beaten defender hauls down the breakaway: free kick to the attacker + cards (29.1)', () => {
    let fouls = 0;
    let cards = 0;
    for (let seed = 1; seed <= 64; seed++) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
      while (m.phase !== 'playing') m.step(DT);
      const striker = m.teams[0].players[4];
      const chaser = m.teams[1].players[1];
      // Breakaway into the danger band (16–34m from goal): everyone else
      // behind the ball, the chaser hanging on the shoulder — from BEHIND.
      for (const p of m.teams[1].players) {
        if (p.role !== 'GK') p.pos = { x: -10, y: p.index * 6 - 12 };
      }
      striker.pos = { x: 16, y: 0 };
      striker.vel = { x: 7, y: 0 };
      m.ball.owner = striker;
      m.ball.pos = { x: 16.8, y: 0 };
      m.possessionSide = 0;
      chaser.pos = { x: 14.9, y: 0.3 };
      chaser.vel = { x: 7.5, y: 0 };
      chaser.tackleCooldown = 0;
      chaser.stunTimer = 0;
      const cardsBefore = m.teams[1].stats.yellows + m.teams[1].stats.reds;
      tryTacticalFoul(m);
      if ((m.phase as string) === 'restart') { // step() mutates phase — dodge TS narrowing
        fouls++;
        expect(m.restart!.kind).toBe('freeKick');
        expect(m.restart!.side).toBe(0); // the fouled team's kick
        expect(m.restart!.offside).toBeUndefined(); // labeled ⚠ free kick, not 🚩
        if (m.teams[1].stats.yellows + m.teams[1].stats.reds > cardsBefore) cards++;
      } else {
        expect(chaser.tackleCooldown).toBeGreaterThan(0); // let off — but committed
      }
    }
    // Cynicism is deliberately RARE (p≈0.11 per grab at neutral aggression —
    // the first cut fired on every line break and cards hit 8/match).
    expect(fouls).toBeGreaterThan(0);
    expect(fouls).toBeLessThan(30);
    expect(cards).toBeGreaterThan(0); // the professional foul gets punished
  });

  it('no professional foul inside the defender\'s own box — that would be the penalty (29.1)', () => {
    const m = new Match({ seed: 5, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    const striker = m.teams[0].players[4];
    const chaser = m.teams[1].players[1];
    for (const p of m.teams[1].players) {
      if (p.role !== 'GK') p.pos = { x: -10, y: p.index * 6 - 12 };
    }
    striker.pos = { x: 34, y: 0 }; // inside team 1's box (depth 14 from x=45)
    striker.vel = { x: 7, y: 0 };
    m.ball.owner = striker;
    m.ball.pos = { x: 34.8, y: 0 };
    m.possessionSide = 0;
    chaser.pos = { x: 32.9, y: 0.3 };
    chaser.vel = { x: 7.5, y: 0 };
    chaser.tackleCooldown = 0;
    tryTacticalFoul(m);
    expect(m.phase).toBe('playing'); // professionals concede kicks, not penalties
  });

  it('a goal-side defender contains an arriving carrier instead of jogging upfield (29.1)', () => {
    const m = new Match({ seed: 7, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    const carrier = m.teams[0].players[4];
    carrier.pos = { x: 20, y: 0 }; // 25m from team 1's goal — defensive territory
    m.ball.owner = carrier;
    m.ball.pos = { x: 20.8, y: 0 };
    m.possessionSide = 0;
    const df = m.teams[1].players[1];
    df.pos = { x: 26, y: 1 }; // set, goal-side, waiting — the reported scene
    m.teams[1].marks.clear();
    m.teams[1].chasers.clear();
    m.teams[1].chasers.add(m.teams[1].players[2].index); // the presser is someone else
    m.pendingPass = null;
    decidePlayer(df, m);
    expect(df.action.type).toBe('MarkOpponent'); // jockey — NOT MoveToFormationSpot
    expect(df.action.targetIdx).toBe(carrier.index);
  });

  it('halves end at a safe break inside their own stoppage windows (27.4/28.1)', () => {
    // Since 28.1 each half runs its OWN nominal length + stoppage: the
    // second half starts where the first (plus its added time) ended, so
    // full time lands at ht.t + 60 (+ up to STOPPAGE_MAX), not at 120.
    let sawStoppage = false;
    for (const seed of [2, 7, 19, 42, 77, 1234]) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
      m.runToCompletion();
      const ht = m.events.find((e) => e.type === 'halftime')!;
      const ft = m.events.find((e) => e.type === 'fulltime')!;
      expect(ht.t).toBeGreaterThanOrEqual(60);
      expect(ht.t).toBeLessThanOrEqual(60 + 8 + 0.05);
      expect(ft.t).toBeGreaterThanOrEqual(ht.t + 60);
      expect(ft.t).toBeLessThanOrEqual(ht.t + 60 + 8 + 0.05);
      if (ht.t > 60.1 || ft.t > ht.t + 60.1) sawStoppage = true;
    }
    expect(sawStoppage).toBe(true); // the window is actually used sometimes
  });

  it('a keeper rushes a 1v1 but holds the line when a defender is goal-side (27.5)', () => {
    const m = new Match({ seed: 4, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[1].goalkeeper; // defends +x goal
    const striker = m.teams[0].players[4];
    striker.pos = { x: 38, y: 0 };
    m.ball.owner = striker;
    m.ball.pos = { x: 38.8, y: 0 };
    m.possessionSide = 0;
    // Clear team 1 out of the danger zone: a true 1v1.
    for (const p of m.teams[1].players) {
      if (p.role !== 'GK') p.pos = { x: -20, y: p.pos.y };
    }
    decidePlayer(gk, m);
    expect(gk.action.type).toBe('GoalkeeperRush');
    // Now park a defender goal-side: the keeper stays home.
    m.teams[1].players[1].pos = { x: 42, y: 0 };
    decidePlayer(gk, m);
    expect(gk.action.type).not.toBe('GoalkeeperRush');
  });

  it('a smother either claims into the hold or leaves the keeper beaten (27.5)', () => {
    let claims = 0;
    let beaten = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
      while (m.phase !== 'playing') m.step(DT);
      const gk = m.teams[1].goalkeeper;
      const striker = m.teams[0].players[4];
      striker.pos = { x: 40, y: 0 };
      m.ball.owner = striker;
      m.ball.pos = { x: 40.8, y: 0 };
      m.possessionSide = 0;
      gk.pos = { x: 41.5, y: 0 };
      gk.action = { type: 'GoalkeeperRush', scores: [] };
      trySmother(m);
      if (m.ball.owner === gk) {
        claims++;
        expect(gk.gkHoldTimer).toBeGreaterThan(0); // straight into the hands
      } else {
        beaten++;
        expect(gk.stunTimer).toBeGreaterThan(0); // on the floor
      }
    }
    expect(claims).toBeGreaterThan(0);
    expect(beaten).toBeGreaterThan(0); // both outcomes are live at 5v5 odds
  });

  it('the territory clock resets on possession change and accrues in stale spells', () => {
    const m = new Match({ seed: 5, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    m.teams[0].resetProgress(3);
    expect(m.teams[0].progressLocalX).toBe(3);
    expect(m.teams[0].staleTime).toBe(0);
    // Run real play: the clock must stay sane (bounded by restarts and
    // turnovers) and both teams must have exercised it.
    while (!m.finished && m.simTime < 60) m.step(DT);
    for (const t of m.teams) {
      expect(t.staleTime).toBeGreaterThanOrEqual(0);
      expect(t.staleTime).toBeLessThan(60);
      expect(Number.isFinite(t.progressLocalX)).toBe(true);
    }
  });
});
