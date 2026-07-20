import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { updateTeamBrain } from '../src/ai/TeamBrain';
import { formationSpot, setEmergentPos } from '../src/ai/formations';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT, HALF_L, PITCH_SCALE } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 31 step 2 — the byline cutback and the overload runs. The arriving
 * runner (team.arriver) attacks the edge-of-box arc; the carrier in the
 * wide-deep zone pulls the ball back to them; the weak-side winger leaves
 * the far touchline for the back post.
 */

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
function team(name: string, genes: Partial<TacticalGenome> = {}): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: { ...neutralGenome(), ...genes },
    squad: Array.from({ length: TEAM_SIZE }, () => attrs()),
  };
}

const breathe = (i: number): Promise<void> | undefined =>
  i % 25 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

/** A live match with the ball owned by team 0's right winger, wide and deep. */
function bylineScene(seed = 11): { m: Match; carrier: Match['teams'][0]['players'][number] } {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  const carrier = m.teams[0].players[4]; // WGR
  carrier.pos = v2(HALF_L - 8, 16);
  carrier.heading = { x: 0, y: -1 };
  m.ball.owner = carrier;
  m.ball.pos = v2(HALF_L - 8, 15.2);
  m.possessionSide = 0;
  m.pendingPass = null;
  m.kickoffKickGid = null;
  m.restartKickGid = null;
  return { m, carrier };
}

describe('the arriving runner (Phase 31)', () => {
  it('ball wide and deep in possession licenses the MF onto the arc', () => {
    const { m } = bylineScene();
    updateTeamBrain(m.teams[0], m);
    expect(m.teams[0].arriver).toBe(2); // the MF
  });

  it('the weak-side winger stands in when the MF carries', () => {
    const { m } = bylineScene();
    const mf = m.teams[0].players[2];
    m.ball.owner = mf;
    mf.pos = v2(HALF_L - 8, 16);
    m.ball.pos = v2(HALF_L - 8, 15.2);
    updateTeamBrain(m.teams[0], m);
    expect(m.teams[0].arriver).toBe(3); // ball on +y → WGL is weak-side
  });

  it('no license when the ball is central or shallow', () => {
    const { m } = bylineScene();
    m.ball.pos = v2(10, 2);
    m.ball.owner!.pos = v2(10, 2);
    updateTeamBrain(m.teams[0], m);
    expect(m.teams[0].arriver).toBeNull();
  });
});

describe('the weak-side far-post pull (Phase 31)', () => {
  // The far-post pull is a FIXED-table feature of formationSpot; emergent
  // positioning (now the default) has no explicit pull, so force the fixed
  // path here (2026-07-20 density相变). Thresholds scale with the pitch.
  beforeEach(() => setEmergentPos(false));
  afterEach(() => setEmergentPos(true));

  it('with the attack wide right, the LEFT winger tucks toward the back post', () => {
    const { m } = bylineScene();
    const wgl = m.teams[0].players[3];
    const wgr = m.teams[0].players[4];
    const weak = formationSpot(wgl, m.teams[0], m.ball, true);
    const strong = formationSpot(wgr, m.teams[0], m.ball, true);
    expect(Math.abs(weak.y)).toBeLessThan(8 * PITCH_SCALE); // attacking the frame
    expect(Math.abs(strong.y)).toBeGreaterThan(14 * PITCH_SCALE); // width held
  });
});

describe('the cutback (Phase 31)', () => {
  it('byline carrier with the arriver ON the arc pulls it back — a hard, low, registered pass', () => {
    const { m, carrier } = bylineScene();
    updateTeamBrain(m.teams[0], m);
    const arr = m.teams[0].players[m.teams[0].arriver!];
    arr.pos = v2(HALF_L - 16, 2); // arrived at the arc
    arr.vel = v2(0, 0);
    // Park the box the way a set defence does: bodies goal-side, none on
    // the pull-back lane.
    m.teams[1].players[1].pos = v2(HALF_L - 5, 6);
    m.teams[1].players[2].pos = v2(HALF_L - 4, -2);
    m.teams[1].players[5].pos = v2(HALF_L - 7, 1);
    decidePlayer(carrier, m);
    expect(carrier.action.type).toBe('Pass');
    expect(carrier.action.targetIdx).toBe(arr.gid);
    expect(m.teams[0].stats.cutbacks).toBe(1);
    expect(m.pendingPass?.targetGid).toBe(arr.gid);
    const speed = Math.hypot(m.ball.vel.x, m.ball.vel.y);
    expect(speed).toBeGreaterThan(10); // driven, not rolled
    expect(m.ball.vz).toBe(0); // flat along the ground
  });

  it('directional: cutbacks happen in league play and score (pooled seasons)', { timeout: 120000 }, async () => {
    const league = new League({ seed: 424242 });
    let cutbacks = 0;
    let cutbackGoals = 0;
    let matches = 0;
    for (let i = 0; i < 150; i++) {
      await breathe(i);
      const f = league.nextFixture();
      if (!f) {
        league.finishSeason();
        continue;
      }
      const r = league.createMatch(f).runToCompletion();
      league.applyResult(f, r);
      matches++;
      cutbacks += r.stats[0].cutbacks + r.stats[1].cutbacks;
      cutbackGoals += r.stats[0].cutbackGoals + r.stats[1].cutbackGoals;
    }
    expect(matches).toBeGreaterThan(100);
    expect(cutbacks / matches).toBeGreaterThan(0.15); // the channel exists
    expect(cutbackGoals).toBeGreaterThan(0); // and it scores
  });
});
