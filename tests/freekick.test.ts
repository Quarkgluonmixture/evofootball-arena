import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DT, HALF_L, RESTART_CLEARANCE } from '../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../src/sim/types';
import { v2, type V2 } from '../src/utils/vec';

/**
 * Phase 32 — free kicks become REAL: a danger-band FK gets a defensive
 * WALL on the ball–goal line, the specialist steps up, and the direct
 * strike curls OVER the wall (z ≥ 2.6 at the wall line — above the header
 * band, the 31.9 corner-sentry lesson) on the pendingShot machinery.
 */

const attrs = (over: Partial<PlayerAttributes> = {}): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return { ...p, ...over };
};
const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
function team(name: string, squad?: PlayerAttributes[]): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutralGenome(),
    squad: squad ?? Array.from({ length: TEAM_SIZE }, () => attrs()),
  };
}

/** Manufacture a danger FK: let play develop, put the defenders in a
 * realistic defensive picture (a fouling team is BEHIND the ball, near its
 * goal — post-kickoff scatter left them 30m from any wall slot), award. */
function dangerFK(seed: number, pos: V2, side: Side = 0, squadA?: PlayerAttributes[]): Match {
  const m = new Match({ seed, teamA: team('A', squadA), teamB: team('B'), duration: 120 });
  for (let t = 0; t < 60 * 4 && !m.finished; t++) m.step(DT);
  const att = m.teams[side];
  const def = m.teams[1 - side];
  const dir = m.teams[side].attackDir;
  const goalX = dir * 45;
  // Attackers loiter around the box edge, each with a marker on his
  // shoulder — the league picture at a danger FK (open mates everywhere
  // made the pass outscore the strike and the harness measured nothing).
  att.players.forEach((p, i) => {
    if (p.role === 'GK') return;
    p.pos = v2(goalX - dir * (11 + i * 2.5), i * 4 - 10);
    p.vel = v2(0, 0);
  });
  def.players.forEach((p, i) => {
    if (p.role === 'GK') return;
    p.pos = v2(goalX - dir * (9.5 + i * 2.5), i * 4 - 9);
    p.vel = v2(0, 0);
  });
  (m as unknown as { awardRestart(kind: string, side: Side, pos: V2): void }).awardRestart(
    'freeKick', side, pos,
  );
  return m;
}

const breathe = (i: number): Promise<void> | undefined =>
  i % 25 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

describe('free kicks become REAL (Phase 32)', () => {
  it('a danger FK arms a wall sized by range; out of range there is none', () => {
    const near = dangerFK(11, v2(45 - 17, 2)); // 17m out → 3 bodies
    expect(near.fkWall).not.toBeNull();
    expect(near.fkWall!.gids.length).toBe(3);
    const far = dangerFK(11, v2(45 - 25, 2)); // 25m out → 2 bodies
    expect(far.fkWall!.gids.length).toBe(2);
    const harmless = dangerFK(11, v2(0, 8)); // halfway line → no wall
    expect(harmless.fkWall).toBeNull();
  });

  it('the wall FORMS: bodies on the ball–goal line at the clearance edge at kick time', () => {
    let formed = 0;
    let checked = 0;
    for (let seed = 0; seed < 12; seed++) {
      const pos = v2(45 - 19, seed % 2 === 0 ? 3 : -5);
      const m = dangerFK(seed, pos);
      if (!m.fkWall) continue;
      const wall = m.fkWall;
      checked++;
      let guard = 0;
      while (m.restart && guard++ < 60 * 12 && !m.finished) m.step(DT);
      // At hand-off: ≥2 wall bodies near the line, at the clearance edge.
      const goal = v2(m.teams[0].attackDir * HALF_L, 0);
      const dl = Math.hypot(goal.x - pos.x, goal.y - pos.y);
      const dir = v2((goal.x - pos.x) / dl, (goal.y - pos.y) / dl);
      let ok = 0;
      for (const gid of wall.gids) {
        const p = m.allPlayers[gid];
        const dBall = Math.hypot(p.pos.x - pos.x, p.pos.y - pos.y);
        // Perp distance from the ball–goal line.
        const px = p.pos.x - pos.x;
        const py = p.pos.y - pos.y;
        const perp = Math.abs(px * -dir.y + py * dir.x);
        // The law wall: 9.15m out (Phase 32 uses CORNER_CLEARANCE).
        if (perp < 2.0 && dBall > 7.5 && dBall < 11.5) ok++;
      }
      if (ok >= 2) formed++;
    }
    expect(checked).toBeGreaterThan(8);
    // The taker may go QUICK when the wall is slow — but a formed wall must
    // be the NORM (probed 38/45 in league play).
    expect(formed).toBeGreaterThan(checked * 0.6);
  });

  it('the specialist takes it: best finishing + technique/2 steps up in range', () => {
    const squad = Array.from({ length: TEAM_SIZE }, () => attrs());
    squad[5] = attrs({ finishing: 0.95, passing: 0.9 }); // the ST slot
    const m = dangerFK(7, v2(45 - 20, 4), 0, squad);
    expect(m.restart).not.toBeNull();
    expect(m.restart!.takerGid).toBe(m.teams[0].players[5].gid);
  });

  it('direct strikes happen and convert in the real-football band', { timeout: 240000 }, async () => {
    let strikes = 0;
    let goals = 0;
    for (let seed = 0; seed < 250; seed++) {
      await breathe(seed);
      const m = dangerFK(seed, v2(45 - 19, 3));
      if (!m.fkWall) continue;
      const shots0 = m.shotLog.length;
      let guard = 0;
      while (m.restart && guard++ < 60 * 12 && !m.finished) m.step(DT);
      for (let t = 0; t < 60 * 4 && !m.finished; t++) m.step(DT);
      // Only the MANUFACTURED kick counts — natural danger FKs can occur
      // (and bend) during the 4s of open play before the award.
      const entry = m.shotLog[shots0];
      if (!entry) continue;
      const bentAfter = m.events.some(
        (e) => e.type === 'shot' && e.t >= entry.t - 0.01 && e.text.includes('bends the free kick'),
      );
      if (!bentAfter) continue;
      strikes++;
      if (entry.outcome === 'goal') goals++;
    }
    // The direct option is a REGULAR choice from 19m (the marked scene
    // still lets a clearly better pass win sometimes — football)...
    expect(strikes).toBeGreaterThan(75);
    // ...and converts like the real thing (~4-9% probed; the band is wide
    // because ~100 strikes carry ±2pp of seed noise).
    expect(goals / strikes).toBeGreaterThan(0.01);
    expect(goals / strikes).toBeLessThan(0.16);
  });

  it('the wall cannot contest the climb: no defending header inside 0.6s of the strike', () => {
    // The geometry (z ≥ 2.6 at the wall) is the MEANS; this is the END —
    // the 31.9 corner-sentry disaster (a body free-heading every climbing
    // delivery) must not reappear at free kicks.
    let strikes = 0;
    let contested = 0;
    for (let seed = 0; seed < 30; seed++) {
      const m = dangerFK(seed, v2(45 - 19, 3));
      if (!m.fkWall) continue;
      // A deep defender heading the DIPPER near the goal is honest defence;
      // only the WALL free-heading the climb is the forbidden failure.
      const wallers = m.fkWall.gids.map((gid) => m.allPlayers[gid]);
      let guard = 0;
      const bent0 = m.events.filter((e) => e.type === 'shot' && e.text.includes('bends the free kick')).length;
      while (m.restart && guard++ < 60 * 12 && !m.finished) m.step(DT);
      let struckAt = -1;
      const timers = wallers.map((p) => p.headerAnimTimer);
      for (let t = 0; t < 60 * 6 && !m.finished; t++) {
        m.step(DT);
        if (struckAt < 0) {
          if (m.events.filter((e) => e.type === 'shot' && e.text.includes('bends the free kick')).length > bent0) {
            struckAt = t;
            strikes++;
          }
          wallers.forEach((p, i) => (timers[i] = p.headerAnimTimer));
          continue;
        }
        if (t - struckAt > 36) break; // 0.6s window — the climb past the wall
        let jumped = false;
        wallers.forEach((p, i) => {
          if (p.headerAnimTimer > timers[i]) jumped = true;
          timers[i] = p.headerAnimTimer;
        });
        if (jumped) {
          contested++;
          break;
        }
      }
    }
    expect(strikes).toBeGreaterThan(12); // the harness genuinely strikes
    expect(contested).toBeLessThanOrEqual(1); // ≤ a stray, never the norm
  });

  it('a danger-band foul is whistled back; elsewhere advantage still plays', () => {
    const m = new Match({ seed: 3, teamA: team('A'), teamB: team('B'), duration: 120 });
    for (let t = 0; t < 60 * 3; t++) m.step(DT);
    // In the band: whistle → free kick restart.
    m.ball.pos = v2(45 - 20, 2);
    m.awardFoul(m.teams[1].players[1], m.teams[0].players[5]);
    expect(m.restart?.kind).toBe('freeKick');
    // Outside the band (own half): advantage — play continues.
    const m2 = new Match({ seed: 3, teamA: team('A'), teamB: team('B'), duration: 120 });
    for (let t = 0; t < 60 * 3; t++) m2.step(DT);
    m2.ball.pos = v2(-10, 2);
    const restartBefore = m2.restart;
    m2.awardFoul(m2.teams[1].players[1], m2.teams[0].players[5]);
    expect(m2.restart).toBe(restartBefore); // no new dead ball
  });

  it('determinism: the same seed replays the same free kick, watched or skipped', () => {
    const run = () => {
      const m = dangerFK(42, v2(45 - 19, 3));
      let guard = 0;
      while (m.restart && guard++ < 60 * 12 && !m.finished) m.step(DT);
      for (let t = 0; t < 60 * 4 && !m.finished; t++) m.step(DT);
      return m.events.filter((e) => e.type === 'shot' || e.type === 'goal').map((e) => e.text);
    };
    expect(run()).toEqual(run());
  });
});
