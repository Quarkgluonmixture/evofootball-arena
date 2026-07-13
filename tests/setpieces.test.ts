import { describe, expect, it } from 'vitest';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT, HALF_L, HALF_W, RESTART_CLEARANCE, RESTART_MIN_SETUP, RESTART_TIMEOUT } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: neutral(),
  squad: neutralSquad(),
});

const playingMatch = (seed = 5): Match => {
  const m = new Match({ seed, teamA: team('Alpha'), teamB: team('Beta'), duration: 240 });
  while (m.phase !== 'playing') m.step(DT);
  return m;
};

/** Launch a free ball from `pos` with velocity `vel`, last touched by gid. */
const launch = (m: Match, pos: { x: number; y: number }, vel: { x: number; y: number }, touchGid: number) => {
  m.ball.owner = null;
  m.ball.lastTouch = m.allPlayers[touchGid];
  m.ball.pos = v2(pos.x, pos.y);
  m.ball.vel = v2(vel.x, vel.y);
  for (let i = 0; i < 300 && m.phase === 'playing'; i++) m.step(DT);
};

describe('set pieces — award rules', () => {
  it('over the touchline: kick-in against the side that touched it last', () => {
    const m = playingMatch();
    launch(m, { x: 4, y: 24 }, { x: 0, y: 25 }, 2); // team 0 puts it out
    expect(m.phase).toBe('restart');
    expect(m.restart!.kind).toBe('kickIn');
    expect(m.restart!.side).toBe(1);
    expect(Math.abs(m.restart!.pos.y)).toBeCloseTo(HALF_W - 0.4, 5);
    const taker = m.allPlayers[m.restart!.takerGid];
    expect(taker.side).toBe(1);
    expect(taker.role).not.toBe('GK');
  });

  it('attacker puts it over the goal line: goal kick, keeper takes it', () => {
    const m = playingMatch();
    launch(m, { x: 40, y: 12 }, { x: 30, y: 2 }, 4); // team 0 attacks +x and misses
    expect(m.phase).toBe('restart');
    expect(m.restart!.kind).toBe('goalKick');
    expect(m.restart!.side).toBe(1); // defenders of the +x goal
    expect(m.allPlayers[m.restart!.takerGid].role).toBe('GK');
    expect(m.restart!.pos.x).toBeCloseTo(HALF_L - 7, 5);
  });

  it('defender puts it over their own goal line: corner at the near corner', () => {
    const m = playingMatch();
    launch(m, { x: 40, y: -12 }, { x: 30, y: -4 }, 6); // team 1 (defending +x goal) last touch
    expect(m.phase).toBe('restart');
    expect(m.restart!.kind).toBe('corner');
    expect(m.restart!.side).toBe(0); // attackers get the corner
    expect(m.restart!.pos.x).toBeCloseTo(HALF_L - 0.6, 5);
    expect(m.restart!.pos.y).toBeCloseTo(-(HALF_W - 0.6), 5); // near corner (ball went out low)
  });

  it('a goal is NOT out of play: ball inside the mouth still scores', () => {
    const m = playingMatch();
    const before = m.score[0];
    launch(m, { x: 40, y: 0 }, { x: 30, y: 0 }, 4);
    expect(m.score[0]).toBe(before + 1);
  });
});

describe('set pieces — restart lifecycle', () => {
  it('holds opponents out, waits for the taker, then restarts with a kick (no dribble-on)', () => {
    const m = playingMatch();
    launch(m, { x: 4, y: 24 }, { x: 0, y: 25 }, 2);
    expect(m.phase).toBe('restart');
    const r = m.restart!;
    const spot = { ...r.pos };
    const taker = m.allPlayers[r.takerGid];
    const t0 = m.simTime;

    while (m.phase === 'restart') {
      m.step(DT);
      // Opponents never inside the clearance circle while the ball is dead.
      if (m.phase === 'restart') {
        for (const o of m.teams[1 - r.side].players) {
          const d = Math.hypot(o.pos.x - spot.x, o.pos.y - spot.y);
          expect(d).toBeGreaterThan(RESTART_CLEARANCE - 0.01);
        }
      }
    }

    const setup = m.simTime - t0;
    expect(setup).toBeGreaterThanOrEqual(RESTART_MIN_SETUP - 1e-9);
    expect(setup).toBeLessThanOrEqual(RESTART_TIMEOUT + 0.1);
    expect(m.ball.owner).toBe(taker);

    // First touch must be a kick: the taker releases the ball without dribbling away.
    const start = { ...taker.pos };
    for (let i = 0; i < 60 && m.ball.owner === taker; i++) m.step(DT);
    expect(m.ball.owner === taker).toBe(false);
    expect(Math.hypot(taker.pos.x - start.x, taker.pos.y - start.y)).toBeLessThan(3);
  });

  it('the clock runs during restarts and the match still ends on time', () => {
    const m = new Match({ seed: 7, teamA: team('Alpha'), teamB: team('Beta'), duration: 60 });
    const r = m.runToCompletion();
    expect(m.finished).toBe(true);
    expect(r.duration).toBe(60);
  });
});

describe('set pieces — full-match invariants', () => {
  it('the ball never leaves the pitch in live play, restarts occur, none hang', () => {
    let restarts = 0;
    const kinds = { kickIn: 0, corner: 0, goalKick: 0, freeKick: 0, penalty: 0 };
    for (const seed of [3, 21, 99, 1234]) {
      const m = new Match({ seed, teamA: team('Alpha'), teamB: team('Beta'), duration: 240 });
      let prev = false;
      let started = 0;
      let keeperUpCorner = false;
      while (!m.finished) {
        m.step(DT);
        // Free balls never rest out of bounds (a crossing becomes a restart in
        // the same step). Owned balls may poke ~0.85m past the line while a
        // clamped-in dribbler shields them — that's the futsal-style hug.
        if ((m.phase === 'playing' || m.phase === 'restart') && m.ball.owner === null) {
          expect(Math.abs(m.ball.pos.x)).toBeLessThanOrEqual(HALF_L + 0.01);
          expect(Math.abs(m.ball.pos.y)).toBeLessThanOrEqual(HALF_W + 0.01);
        }
        const active = m.restart !== null;
        if (active && !prev) {
          restarts++;
          kinds[m.restart!.kind]++;
          started = m.simTime;
        }
        // 门将上前 (Phase 35): a stoppage-time corner whose taker waits for
        // the sprinting keeper runs on a licensed longer clock (8.5s cap).
        if (active && m.restart!.kind === 'corner' && m.teams[m.restart!.side].keeperUp) {
          keeperUpCorner = true;
        }
        if (!active && prev) {
          expect(m.simTime - started).toBeLessThanOrEqual(keeperUpCorner ? 8.6 : RESTART_TIMEOUT + 0.1);
          keeperUpCorner = false;
        }
        prev = active;
      }
    }
    expect(restarts).toBeGreaterThanOrEqual(8); // set pieces are a real part of play
    expect(kinds.goalKick).toBeGreaterThan(0);
    expect(kinds.corner + kinds.kickIn).toBeGreaterThan(0); // sample has line-outs too
  });

  it('same seed ⇒ identical result, corner count and event log', () => {
    const run = () => {
      const m = new Match({ seed: 4242, teamA: team('Alpha'), teamB: team('Beta'), duration: 240 });
      const r = m.runToCompletion();
      return {
        score: r.score,
        corners: [r.stats[0].corners, r.stats[1].corners],
        events: r.events.length,
      };
    };
    expect(run()).toEqual(run());
  });
});

describe('distribution stand-off (Phase 31.6)', () => {
  // User report: opponents body-glued the receivers while the keeper stood
  // over a goal kick (the box clamp only moves them in x, so they camped ON
  // the edge millimetres from a receiver). Markers now cover from ≥2.4m
  // while the distribution is being prepared.
  it('a presser glued to a goal-kick receiver is pushed off during the setup', () => {
    const m = new Match({ seed: 9, teamA: team('Alpha'), teamB: team('Beta'), duration: 240 });
    while (m.phase !== 'playing') m.step(DT);
    m.ball.owner = null;
    m.ball.lastTouch = m.allPlayers[4]; // team 0 touch
    m.ball.pos = v2(45.5, 8); // over team 1's goal line, wide of goal
    m.ball.vel = v2(6, 0);
    m.step(DT);
    expect(m.restart?.kind).toBe('goalKick');
    expect(m.restart?.side).toBe(1);
    const receiver = m.teams[1].players[1];
    receiver.pos = v2(30, 3); // waiting for the distribution outside the box
    const presser = m.teams[0].players[5];
    presser.pos = v2(29.2, 3.4); // glued — 0.9m away
    for (let i = 0; i < 90 && (m.phase as string) === 'restart'; i++) m.step(DT);
    const d = Math.hypot(presser.pos.x - receiver.pos.x, presser.pos.y - receiver.pos.y);
    expect(d).toBeGreaterThan(1.7); // covering the lane, not wrestling
  });
});
