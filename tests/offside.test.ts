import { describe, expect, it } from 'vitest';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { offsideLineLocalX } from '../src/ai/formations';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT } from '../src/sim/constants';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { performPass, tryAerial } from '../src/sim/mechanics';
import type { TeamInfo } from '../src/sim/types';

/**
 * Phase 29 — offside. Judgment is frozen at kick time (the real law's
 * "moment the ball is played"), only the delivery target can be flagged, and
 * the whistle blows when the flagged target touches the ball (reception or a
 * won header). Focused harnesses drive the exact geometry (§10.5 — match
 * stats dilute the channel); league-level tests guard rate and liveness.
 */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

const squad = (): PlayerAttributes[] =>
  Array.from({ length: 5 }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });

function team(name: string): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome: neutral(),
    squad: squad(),
  };
}

/**
 * A live match in a controlled state: past kickoff, forced into open play,
 * everyone parked on a deterministic grid far from the action. Team 0
 * attacks +x. Tests then place only the players the scenario needs.
 */
function stage(seed = 11): Match {
  const m = new Match({ seed, teamA: team('Att'), teamB: team('Def'), duration: 240 });
  for (let i = 0; i < 70; i++) m.step(DT);
  m.phase = 'playing';
  m.restart = null;
  m.restartKickGid = null;
  m.restartKickKind = null;
  m.kickoffKickGid = null;
  m.pendingPass = null;
  m.pendingShot = null;
  // Park everyone out of the way; scenarios re-place who they need.
  for (const p of m.allPlayers) {
    p.pos = { x: p.side === 0 ? -40 : 40, y: -24 + p.index * 4 };
    p.vel = { x: 0, y: 0 };
    p.kickCooldown = 0;
    p.stunTimer = 0;
  }
  m.ball.z = 0;
  m.ball.vz = 0;
  return m;
}

/** Standard geometry: B keeper on their line, one B defender as the line. */
function defence(m: Match, secondLastX: number): void {
  const B = m.teams[1];
  B.players[0].pos = { x: 44, y: 0 }; // GK — the LAST defender
  B.players[1].pos = { x: secondLastX, y: 20 }; // second-last, wide of the lane
  // Remaining B outfielders shallow so players[1] really is second-last.
  B.players[2].pos = { x: 5, y: -20 };
  B.players[3].pos = { x: 5, y: -24 };
  B.players[4].pos = { x: 5, y: -28 };
}

describe('offside judgment at kick time', () => {
  it('beyond the second-last defender when the ball is struck → flagged, whistled on the touch', () => {
    const m = stage(11);
    const A = m.teams[0];
    defence(m, 30);
    const passer = A.players[2];
    const target = A.players[4];
    passer.pos = { x: 5, y: 0 };
    target.pos = { x: 35, y: 2 }; // beyond the 30m line — offside position
    m.giveBall(passer);
    performPass(m, passer, target);

    expect(m.pendingPass?.offside).toBe(true);
    expect(m.pendingPass?.offsideSpot?.x).toBeCloseTo(35, 5);

    m.giveBall(target); // the touch completes the offence
    expect(m.phase).toBe('restart');
    expect(m.restart?.kind).toBe('freeKick');
    expect(m.restart?.side).toBe(1); // defenders take it
    expect(m.restart?.pos.x).toBeCloseTo(35, 5); // where the offender stood
    expect(A.stats.offsides).toBe(1);
    expect(m.teams[1].stats.offsides).toBe(0);
    expect(A.stats.passesCompleted).toBe(0); // an offside ball is not a completed pass
    expect(m.events.some((e) => e.text.includes('Offside'))).toBe(true);
  });

  it('level with the second-last defender is onside', () => {
    const m = stage(12);
    const A = m.teams[0];
    defence(m, 30);
    const passer = A.players[2];
    const target = A.players[4];
    passer.pos = { x: 5, y: 0 };
    target.pos = { x: 30, y: 2 }; // exactly level
    m.giveBall(passer);
    performPass(m, passer, target);
    expect(m.pendingPass?.offside).toBe(false);
    m.giveBall(target);
    expect(m.phase).toBe('playing');
    expect(A.stats.offsides).toBe(0);
    expect(A.stats.passesCompleted).toBe(1);
  });

  it('never offside in your own half, even beyond every defender', () => {
    const m = stage(13);
    const A = m.teams[0];
    defence(m, -8); // the whole defence pushed past halfway
    m.teams[1].players[0].pos = { x: -5, y: 0 }; // even the keeper is up
    const passer = A.players[2];
    const target = A.players[4];
    passer.pos = { x: -20, y: 0 };
    target.pos = { x: -1, y: 2 }; // own half — protected by the law
    m.giveBall(passer);
    performPass(m, passer, target);
    expect(m.pendingPass?.offside).toBe(false);
  });

  it('level with or behind the ball is onside, beyond any defender', () => {
    const m = stage(14);
    const A = m.teams[0];
    defence(m, 25);
    const passer = A.players[2];
    const target = A.players[4];
    passer.pos = { x: 36, y: 0 }; // the carrier IS deeper than the line
    target.pos = { x: 34, y: 3 }; // behind the ball — onside
    m.giveBall(passer);
    performPass(m, passer, target);
    expect(m.pendingPass?.offside).toBe(false);
  });

  it('the line counts the keeper: keeper off their line makes the deep defender the line', () => {
    const m = stage(15);
    const B = m.teams[1];
    // Sweeper-keeper at 20m; two defenders deeper at 38 and 34. Second-last
    // counting the keeper = 34 — NOT the keeper's 20.
    B.players[0].pos = { x: 20, y: 0 };
    B.players[1].pos = { x: 38, y: 10 };
    B.players[2].pos = { x: 34, y: -10 };
    B.players[3].pos = { x: 5, y: -24 };
    B.players[4].pos = { x: 5, y: -28 };
    const line = offsideLineLocalX(m.teams[0], B.players, 0);
    expect(line).toBeCloseTo(34, 5);
  });

  it('kick-ins, corners and goal kicks are exempt (real law)', () => {
    for (const kind of ['kickIn', 'corner', 'goalKick'] as const) {
      const m = stage(16);
      const A = m.teams[0];
      defence(m, 30);
      const passer = A.players[2];
      const target = A.players[4];
      passer.pos = { x: 5, y: 0 };
      target.pos = { x: 35, y: 2 }; // offside position — but the kick is exempt
      m.giveBall(passer);
      performPass(m, passer, target, /* offsideExempt */ true);
      expect(m.pendingPass?.offside, kind).toBe(false);
      m.giveBall(target);
      expect(m.phase, kind).toBe('playing');
    }
  });

  it('wiring: a kick-in taker delivers beyond the line without a flag (exemption travels)', () => {
    // NOTE not a corner: at a corner the ball itself is on the goal line, so
    // "level with the ball" already makes everyone onside — the exemption
    // only BITES when the kick comes from deeper than the target.
    const m = stage(17);
    const A = m.teams[0];
    defence(m, 20);
    const taker = A.players[3]; // WG takes the kick-in
    const st = A.players[4];
    taker.pos = { x: 12, y: -28.5 };
    st.pos = { x: 30, y: -5 }; // beyond the 20m line — flagged in open play
    A.players[1].sentOff = true; // leave only the ST (and the deep GK) to aim at
    A.players[2].sentOff = true;
    m.giveBall(taker);
    m.restartKickGid = taker.gid;
    m.restartKickKind = 'kickIn';
    decidePlayer(taker, m);
    expect(m.pendingPass).not.toBeNull();
    expect(m.pendingPass!.targetGid).toBe(st.gid);
    expect(m.pendingPass!.offside).toBe(false);
  });

  it('a flagged target winning the header is whistled, not played on', () => {
    const m = stage(18);
    const A = m.teams[0];
    const st = A.players[4];
    st.pos = { x: 30, y: 0 };
    m.ball.owner = null;
    m.ball.pos = { x: 30.3, y: 0 };
    m.ball.vel = { x: 0, y: 0 };
    m.ball.z = 2.0;
    m.ball.vz = -3;
    m.pendingPass = {
      side: 0,
      passerGid: A.players[2].gid,
      targetGid: st.gid,
      t: m.simTime,
      offside: true,
      offsideSpot: { x: 31, y: 0 },
    };
    tryAerial(m, m.allPlayers);
    expect(m.phase).toBe('restart');
    expect(m.restart?.kind).toBe('freeKick');
    expect(m.restart?.side).toBe(1);
    expect(A.stats.offsides).toBe(1);
    expect(A.stats.headersWon).toBe(0); // the whistle beat the header
  });

  it('a defender touching the ball first plays on — no whistle for the flag alone', () => {
    const m = stage(19);
    const A = m.teams[0];
    const B = m.teams[1];
    defence(m, 30);
    const passer = A.players[2];
    const target = A.players[4];
    passer.pos = { x: 5, y: 0 };
    target.pos = { x: 35, y: 2 };
    m.giveBall(passer);
    performPass(m, passer, target);
    expect(m.pendingPass?.offside).toBe(true);
    m.giveBall(B.players[1]); // defender intercepts — advantage: play on
    expect(m.phase).toBe('playing');
    expect(A.stats.offsides).toBe(0);
    expect(B.stats.interceptions).toBe(1);
  });
});

describe('staying onside (behavior)', () => {
  it('a licensed runner holds at the line while a teammate carries the ball', () => {
    const m = stage(21);
    const A = m.teams[0];
    defence(m, 22);
    const carrier = A.players[2];
    const runner = A.players[4];
    carrier.pos = { x: 8, y: -4 };
    runner.pos = { x: 19, y: 4 };
    m.giveBall(carrier);
    A.runners.add(runner.index);
    runner.action = { type: 'MakeRun', scores: [] };
    carrier.action = { type: 'HoldPosition', scores: [] };
    // Freeze decisions AND pin the defence: executor-level behavior is what's
    // under test, so the line must not drift and nobody may tackle.
    for (const p of m.allPlayers) p.decisionTimer = 999;
    for (const t of m.teams) t.brainTimer = 999;
    const pinned = m.teams[1].players.map((p) => ({ x: p.pos.x, y: p.pos.y }));
    let maxRunnerX = -Infinity;
    for (let i = 0; i < 150; i++) {
      for (const [j, p] of m.teams[1].players.entries()) {
        p.pos = { x: pinned[j].x, y: pinned[j].y };
        p.vel = { x: 0, y: 0 };
      }
      m.step(DT);
      if (m.ball.owner !== carrier || m.phase !== 'playing') break;
      maxRunnerX = Math.max(maxRunnerX, runner.pos.x);
    }
    // runTarget aims for line+7 (29m); the onside hold must cap the run at
    // the second-last defender's shoulder (22m line − 0.4 hold + inertia).
    expect(maxRunnerX).toBeLessThan(23);
    expect(maxRunnerX).toBeGreaterThan(20); // still pushing right up to it
  });
});

describe('offside in league play', () => {
  it('flags happen at a sane rate, and the game stays alive', { timeout: 30000 }, () => {
    const league = new League({ seed: 292901 });
    let offsides = 0;
    let goals = 0;
    let matches = 0;
    for (let i = 0; i < 48; i++) {
      const f = league.nextFixture();
      if (!f) break;
      const r = league.createMatch(f).runToCompletion();
      league.applyResult(f, r);
      offsides += r.stats[0].offsides + r.stats[1].offsides;
      goals += r.score[0] + r.score[1];
      matches++;
    }
    expect(matches).toBeGreaterThan(40);
    // The mechanism exists (flags actually happen in organic play) without
    // strangling the game (order-of-magnitude ceiling, not a tuned rate —
    // calibrate owns the exact number).
    expect(offsides).toBeGreaterThan(0);
    expect(offsides / matches).toBeLessThan(10);
    expect(goals).toBeGreaterThan(matches); // football still produces goals
  });
});
