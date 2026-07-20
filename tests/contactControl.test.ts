import { describe, expect, it } from 'vitest';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { CONTACT_CONTROL_DELAY_TICKS } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import type { Player } from '../src/sim/Player';
import { TEAM_SIZE, type MatchResult, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

interface Claim {
  readonly player: Player;
  readonly reachMargin: number;
  readonly kind: 'controlAttempt' | 'deflection';
}

type ContactAccess = {
  stepCount: number;
  tryCapture(): void;
  collectGroundContactClaims(order: Player[], speed: number, deflectable: boolean): Claim[];
};

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name,
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `${name}${i}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const match = (traceContests = false): Match => new Match({
  seed: 37,
  teamA: team('A', 1),
  teamB: team('B', 2),
  duration: 1,
  traceContests,
});

const contactAccess = (m: Match): ContactAccess => m as unknown as ContactAccess;

const isolateThree = (m: Match): [Player, Player, Player] => {
  for (const p of m.allPlayers) {
    p.pos = { x: 100 + p.gid * 10, y: 100 };
    p.vel = { x: 0, y: 0 };
    p.kickCooldown = 0;
    p.stunTimer = 0;
  }
  const first = m.teams[0].players[1];
  const second = m.teams[1].players[1];
  const third = m.teams[0].players[2];
  first.pos = { x: -0.7, y: 0 };
  first.heading = { x: 1, y: 0 };
  second.pos = { x: 0.9, y: 0 };
  second.heading = { x: -1, y: 0 };
  third.pos = { x: 0, y: -1.1 };
  third.heading = { x: 0, y: 1 };
  m.ball.owner = null;
  m.ball.lastTouch = null;
  m.ball.pos = { x: 0, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  m.pendingPass = null;
  m.dribbleTouch = null;
  return [first, second, third];
};

describe('M3 contact is not control', () => {
  it('collects every eligible body from one snapshot without capping the contest at two', () => {
    const m = match();
    const [first, second, third] = isolateThree(m);

    const claims = contactAccess(m).collectGroundContactClaims(m.allPlayers, 0, false);

    expect(claims.map((c) => c.player.gid)).toEqual([first.gid, third.gid, second.gid]);
    expect(claims).toHaveLength(3);
    expect(claims.every((c) => c.kind === 'controlAttempt')).toBe(true);
  });

  it('records first contact as a ball impulse while ownership stays loose until a later attempt', () => {
    const m = match(true);
    const [first] = isolateThree(m);
    // Leave one claimant so the first-contact assertion is unambiguous.
    for (const p of m.allPlayers) if (p !== first) p.pos = { x: 100 + p.gid * 10, y: 100 };

    contactAccess(m).tryCapture();

    expect(m.ball.owner).toBeNull();
    expect(m.ball.lastTouch).toBe(first);
    expect(Math.hypot(m.ball.vel.x, m.ball.vel.y)).toBeGreaterThan(0);
    expect(m.contestEpisodes).toHaveLength(1);
    expect(m.contestEpisodes[0].contacts.map((c) => c.gid)).toEqual([first.gid]);
    expect(m.contestEpisodes[0].resolution).toBeUndefined();

    contactAccess(m).stepCount += CONTACT_CONTROL_DELAY_TICKS;
    contactAccess(m).tryCapture();
    expect(m.ball.owner).toBe(first);
    expect(m.contestEpisodes[0].resolution).toMatchObject({ kind: 'controlled', gid: first.gid });
  });

  it('allows an initial third contender to make the later contact and become final controller', () => {
    const m = match(true);
    const [first, second, third] = isolateThree(m);
    const access = contactAccess(m);

    access.tryCapture();
    expect(m.ball.lastTouch).toBe(first); // deepest reach = first physical contact
    expect(m.ball.owner).toBeNull();

    first.pos = { x: 100, y: 100 };
    second.pos = { x: 110, y: 100 };
    third.pos = { x: m.ball.pos.x, y: m.ball.pos.y - 0.8 };
    third.heading = { x: 0, y: 1 };
    access.stepCount += 1;
    access.tryCapture();
    expect(m.ball.lastTouch).toBe(third);
    expect(m.ball.owner).toBeNull();

    access.stepCount += CONTACT_CONTROL_DELAY_TICKS;
    access.tryCapture();

    const episode = m.contestEpisodes[0];
    expect(episode.contenderGids).toEqual(expect.arrayContaining([first.gid, second.gid, third.gid]));
    expect(episode.contacts.map((c) => c.gid)).toEqual([first.gid, third.gid]);
    expect(episode.resolution).toMatchObject({ kind: 'controlled', gid: third.gid });
    expect(m.ball.owner).toBe(third);
  });

  it('keeps contest tracing pure-observational', () => {
    const run = (traceContests: boolean): { result: MatchResult; match: Match } => {
      const m = new Match({
        seed: 91,
        teamA: team('A', 3),
        teamB: team('B', 4),
        duration: 30,
        traceContests,
      });
      return { result: m.runToCompletion(), match: m };
    };

    const traced = run(true);
    const plain = run(false);
    expect(JSON.stringify(traced.result)).toBe(JSON.stringify(plain.result));
    expect(traced.match.contestEpisodes.length).toBeGreaterThan(0);
    expect(traced.match.contestEpisodes.every((episode) => episode.resolution !== undefined)).toBe(true);
    expect(plain.match.contestEpisodes).toHaveLength(0);
  });
});
