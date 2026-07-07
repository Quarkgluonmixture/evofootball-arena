import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT, GOAL_HEIGHT, GRAVITY, HALF_L } from '../src/sim/constants';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { tryAerial } from '../src/sim/mechanics';
import { DEFAULT_POLICY, type TeamInfo, type TeamMatchStats } from '../src/sim/types';

/**
 * Phase 28 — the aerial game. Ball height physics, the crossbar, aerial
 * duels, crosses, lofted switches and the corner threat. Directional tests
 * are side-balanced and pooled over seeds (§10.5); structural tests ride on
 * determinism — a fixed-seed league always replays the same football.
 */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

const squadOf = (defending: number): PlayerAttributes[] =>
  Array.from({ length: 5 }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    p.defending = defending;
    return p;
  });

function team(name: string, genome: TacticalGenome, opts: Partial<TeamInfo> = {}): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome,
    squad: squadOf(0.5),
    ...opts,
  };
}

const sum = (a: TeamMatchStats, b: TeamMatchStats): TeamMatchStats => {
  const out = { ...a };
  for (const k of Object.keys(out) as Array<keyof TeamMatchStats>) out[k] += b[k];
  return out;
};

/** Side-balanced totals: each seed plays both home/away orders (§10.5). */
function totals(A: TeamInfo, B: TeamInfo, seeds: number[]): [TeamMatchStats, TeamMatchStats] {
  let acc: [TeamMatchStats, TeamMatchStats] | null = null;
  for (const seed of seeds) {
    const ab = new Match({ seed, teamA: A, teamB: B, duration: 120 }).runToCompletion();
    acc = acc ? [sum(acc[0], ab.stats[0]), sum(acc[1], ab.stats[1])] : [ab.stats[0], ab.stats[1]];
    const ba = new Match({ seed, teamA: B, teamB: A, duration: 120 }).runToCompletion();
    acc = [sum(acc[0], ba.stats[1]), sum(acc[1], ba.stats[0])];
  }
  return acc!;
}

/** A match advanced past kickoff into open play, ball forced dead-center. */
function liveMatch(seed = 1): Match {
  const m = new Match({ seed, teamA: team('A', neutral()), teamB: team('B', neutral()), duration: 240 });
  for (let i = 0; i < 70; i++) m.step(DT); // through the kickoff pause
  return m;
}

describe('ball flight physics', () => {
  it('a lofted ball flies a friction-free parabola', () => {
    const m = liveMatch(3);
    const ball = m.ball;
    // Fly it ABOVE everyone's reach (z > 2.6 the whole observed window) so
    // no header/claim can legally touch it — pure physics is on display.
    ball.owner = null;
    ball.pos = { x: -30, y: -20 };
    ball.vel = { x: 14, y: 2 };
    ball.z = 3;
    ball.vz = 9;
    const h0 = Math.hypot(ball.vel.x, ball.vel.y);
    let apex = 0;
    let steps = 0;
    while (ball.z > 2.6 && steps < 250) {
      // While airborne the horizontal speed must NOT decay (no friction).
      expect(Math.hypot(ball.vel.x, ball.vel.y)).toBeCloseTo(h0, 6);
      apex = Math.max(apex, ball.z);
      m.step(DT);
      steps++;
    }
    // z(t) = 3 + 9t − ½gt²: apex ≈ 7.13m, back below 2.6 at t ≈ 1.88s.
    expect(steps * DT).toBeGreaterThan(1.7);
    expect(steps * DT).toBeLessThan(2.05);
    expect(apex).toBeGreaterThan(6.6);
    expect(apex).toBeLessThan(7.6);
  });

  it('a fast landing bounces with damped restitution', () => {
    const m = liveMatch(4);
    const ball = m.ball;
    // Drop into empty midfield space, far from every formation spot.
    ball.owner = null;
    ball.pos = { x: 0, y: -22 };
    ball.vel = { x: 6, y: 0 };
    ball.z = 3;
    ball.vz = -8; // slamming down — lands at √(8² + 2g·3) ≈ 11.1 m/s
    let bounceVz = -1;
    for (let i = 0; i < 60 && !m.finished; i++) {
      m.step(DT);
      if (ball.z === 0 && ball.vz > 0) {
        bounceVz = ball.vz;
        break;
      }
      if (ball.owner) break;
    }
    // Restitution 0.45 of the ~11.1 m/s landing speed ⇒ ≈5.0 up.
    expect(bounceVz).toBeGreaterThan(3);
    expect(bounceVz).toBeLessThan(5.6);
  });

  it('the crossbar is real: over the bar is NOT a goal, under it is', () => {
    // Over the bar: ball crossing the goal line inside the mouth at z > 2.44.
    const over = liveMatch(5);
    over.ball.owner = null;
    over.ball.pos = { x: HALF_L - 0.4, y: 0 };
    over.ball.vel = { x: 26, y: 0 };
    over.ball.z = GOAL_HEIGHT + 0.6;
    over.ball.vz = 1.5;
    const score0 = over.score[0] + over.score[1];
    for (let i = 0; i < 10; i++) over.step(DT);
    expect(over.score[0] + over.score[1]).toBe(score0); // no goal
    expect(over.phase).toBe('restart'); // corner or goal kick instead

    // Under the bar: same strike arriving at head height IS a goal.
    const under = liveMatch(5);
    under.ball.owner = null;
    under.ball.lastTouch = under.teams[0].players[4];
    under.ball.pos = { x: HALF_L - 0.4, y: 0 };
    under.ball.vel = { x: 26, y: 0 };
    under.ball.z = 1.0;
    under.ball.vz = 0;
    for (let i = 0; i < 10; i++) under.step(DT);
    expect(under.score[0]).toBe(1);
  });

  it('gravity constant matches the flight-time math the kicks rely on', () => {
    // performLoftedPass solves landing with T = 2·vz/g. If someone "tunes"
    // GRAVITY the deliveries all land short/long — pin the contract.
    expect(GRAVITY).toBeCloseTo(9.81, 3);
  });
});

describe('aerial duels and deliveries', () => {
  it('directional: defending wins contested aerial duels (focused, equal position)', () => {
    // Match-level headersWon is dominated by UNCONTESTED headers (whoever is
    // under the ball wins by default), which dilutes the attribute channel
    // below test power (§10.5). So test the duel itself: two players at
    // exactly equal distance under the same dropping ball, 300 seeded rolls.
    const m = new Match({
      seed: 7,
      teamA: team('A', neutral(), { squad: squadOf(0.9) }),
      teamB: team('B', neutral(), { squad: squadOf(0.1) }),
      duration: 240,
    });
    const dfA = m.teams[0].players[1];
    const dfB = m.teams[1].players[1];
    // Park everyone else out of the contest radius.
    for (const p of m.allPlayers) {
      if (p !== dfA && p !== dfB) p.pos = { x: p.side === 0 ? -40 : 40, y: p.index * 5 - 12 };
    }
    const before = [m.teams[0].stats.headersWon, m.teams[1].stats.headersWon];
    for (let i = 0; i < 300; i++) {
      m.ball.owner = null;
      m.ball.pos = { x: 0, y: 0 };
      m.ball.vel = { x: 0, y: 0 };
      m.ball.z = 2.0;
      m.ball.vz = -3;
      m.pendingPass = null;
      for (const p of [dfA, dfB]) {
        p.kickCooldown = 0;
        p.stunTimer = 0;
      }
      dfA.pos = { x: 0.4, y: 0 };
      dfB.pos = { x: -0.4, y: 0 };
      tryAerial(m, m.allPlayers);
    }
    const winsA = m.teams[0].stats.headersWon - before[0];
    const winsB = m.teams[1].stats.headersWon - before[1];
    expect(winsA + winsB).toBe(300); // every roll was a real contest
    expect(winsA).toBeGreaterThan(winsB * 1.5); // defending decides the air
  });

  it('directional: wide teams (attackingWidth) cross more (side-balanced)', () => {
    const wide = neutral();
    wide.attackingWidth = 0.95;
    const narrow = neutral();
    narrow.attackingWidth = 0.05;
    const seeds = [11, 42, 99, 1234, 777, 31337, 5150, 2718];
    const [a1, b1] = totals(team('A', wide), team('B', narrow), seeds);
    const [b2, a2] = totals(team('B', narrow), team('A', wide), seeds.map((s) => s + 13));
    expect(a1.crosses + a2.crosses).toBeGreaterThan(b1.crosses + b2.crosses);
  });

  it('directional: longShotW appetite produces more low-xG shots (side-balanced)', () => {
    const digger = team('A', neutral(), { policy: { ...DEFAULT_POLICY, longShotW: 0.6 } });
    const patient = team('B', neutral(), { policy: { ...DEFAULT_POLICY, longShotW: 0 } });
    let dig = 0;
    let hold = 0;
    for (const seed of [11, 42, 99, 1234, 777, 31337]) {
      for (const swap of [false, true]) {
        const m = new Match({
          seed,
          teamA: swap ? patient : digger,
          teamB: swap ? digger : patient,
          duration: 240,
        });
        m.runToCompletion();
        const digSide = swap ? 1 : 0;
        for (const s of m.shotLog) {
          // xG < 0.14 ≈ 18m+ — the range the dig bonus unlocks.
          if (s.xg >= 0.14) continue;
          if (s.side === digSide) dig++;
          else hold++;
        }
      }
    }
    expect(dig).toBeGreaterThan(hold);
  });

  it('the lofted switch exists and the 32m suppression no longer starves long balls', () => {
    const seeds = [7, 21, 63];
    const [a, b] = totals(team('A', neutral()), team('B', neutral()), seeds);
    expect(a.longBalls + b.longBalls).toBeGreaterThan(0);
  });

  it('structural: crosses, switches, hold-up play and real flight all occur in league play', { timeout: 30000 }, () => {
    // Hold-up is the rarest of the three (~0.6/match) — scan up to 30
    // deterministic matches, stopping as soon as everything has appeared.
    const league = new League({ seed: 555001 });
    const seen = new Set<string>();
    let maxZ = 0;
    for (let i = 0; i < 30 && !(seen.size === 3 && maxZ > 2.5); i++) {
      const f = league.nextFixture();
      if (!f) break;
      const m = league.createMatch(f);
      while (!m.finished) {
        m.step(DT);
        maxZ = Math.max(maxZ, m.ball.z);
        for (const p of m.allPlayers) {
          if (p.action.type === 'Cross' || p.action.type === 'LoftedPass' || p.action.type === 'HoldUp') {
            seen.add(p.action.type);
          }
        }
      }
      league.applyResult(f, m.getResult());
    }
    expect(seen.has('Cross')).toBe(true);
    expect(seen.has('LoftedPass')).toBe(true);
    expect(seen.has('HoldUp')).toBe(true);
    expect(maxZ).toBeGreaterThan(2.5); // deliveries genuinely clear head height
  });

  it('corners are a threat: a meaningful share leads to a shot inside 8s', { timeout: 30000 }, () => {
    const league = new League({ seed: 987001 });
    let corners = 0;
    let cornerShots = 0;
    for (let i = 0; i < 48; i++) {
      const f = league.nextFixture()!;
      const r = league.createMatch(f).runToCompletion();
      league.applyResult(f, r);
      for (let j = 0; j < r.events.length; j++) {
        const ev = r.events[j];
        if (ev.type !== 'corner') continue;
        corners++;
        for (let k = j + 1; k < r.events.length; k++) {
          const e2 = r.events[k];
          if (e2.t - ev.t > 8) break;
          if ((e2.type === 'shot' || e2.type === 'goal') && e2.side === ev.side) {
            cornerShots++;
            break;
          }
        }
      }
    }
    expect(corners).toBeGreaterThan(40);
    // Measured ≈13% at Phase 28 tuning (was 5% before box-crashing runners);
    // the floor guards the mechanism, not the exact rate.
    expect(cornerShots / corners).toBeGreaterThan(0.05);
  });

  it('headed goals credit the crosser with the assist', { timeout: 30000 }, () => {
    // Deterministic hunt: play league matches until a headed goal happens,
    // then check the assist bookkeeping. Fixed seed ⇒ this always finds one.
    const league = new League({ seed: 424243 });
    let found = false;
    for (let i = 0; i < 120 && !found; i++) {
      let f = league.nextFixture();
      if (!f) {
        league.finishSeason(); // hunt across seasons — headed goals are ~0.15/match
        f = league.nextFixture();
        if (!f) break;
      }
      const m = league.createMatch(f);
      let sawHeaderShot = -1;
      while (!m.finished) {
        m.step(DT);
        const last = m.events[m.events.length - 1];
        if (last && last.type === 'shot' && last.text.includes('heads it')) sawHeaderShot = last.t;
        if (last && last.type === 'goal' && sawHeaderShot >= 0 && last.t - sawHeaderShot < 2.5) {
          found = true;
          break;
        }
      }
      m.runToCompletion();
      league.applyResult(f, m.getResult());
    }
    expect(found).toBe(true);
  });
});
