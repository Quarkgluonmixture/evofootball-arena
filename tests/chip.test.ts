import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT, GK_CLAIM_HEIGHT, HALF_L } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 69 — the CHIP. A keeper off his line is beatable over the top:
 * the lob clears the claim ceiling as it passes him (unsavable above
 * GK_CLAIM_HEIGHT) and drops under the bar. Feasibility is geometry; a
 * keeper at home or in the shooter's face never sees a chip.
 */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] =>
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
  squad: squad(),
});

/** A clean stage: everyone parked far away except the shooter and the
 * defending keeper, ball at the shooter's feet, play running. */
function stage(gkOffLine: number, seed = 7): { m: Match; shooter: ReturnType<Match['teams'][0]['players']['at']> } {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  while (m.phase !== 'playing') m.step(DT);
  const shooter = m.teams[0].players[5]; // the striker
  // Team 0 attacks +x. Shooter 20m from the +x goal line, central.
  shooter.pos = v2(HALF_L - 20, 0);
  shooter.vel = v2(0, 0);
  const gk = m.teams[1].goalkeeper;
  gk.pos = v2(HALF_L - gkOffLine, 0.5);
  gk.vel = v2(0, 0);
  // Everyone else out of the picture (pressure ≈ 0, no blockers).
  for (const p of m.allPlayers) {
    if (p === shooter || p === gk) continue;
    p.pos = v2(p.side === 0 ? -HALF_L + 4 + p.index : -HALF_L + 12 + p.index, 24);
    p.vel = v2(0, 0);
  }
  m.giveBall(shooter);
  shooter.kickCooldown = 0;
  return { m, shooter };
}

describe('the chip (Phase 69)', () => {
  it('a keeper 8m off his line is chipped: airborne, unsavable over him, logged', () => {
    const { m, shooter } = stage(8);
    m.performShot(shooter!);
    const entry = m.shotLog[m.shotLog.length - 1];
    expect(entry.chip).toBe(true);
    expect(m.ball.vz).toBeGreaterThan(5); // a real lob, not a drilled ball
    expect(m.events.some((e) => e.text.includes('chips the keeper'))).toBe(true);
    // Sample the flight: as the ball passes the keeper's x it must be above
    // the claim ceiling — tryKeeperSave cannot touch it (the whole point).
    const gkX = m.teams[1].goalkeeper.pos.x;
    let zAtKeeper = -1;
    for (let i = 0; i < 240 && zAtKeeper < 0; i++) {
      const before = m.ball.pos.x;
      m.step(DT);
      if (before < gkX && m.ball.pos.x >= gkX) zAtKeeper = m.ball.z;
    }
    expect(zAtKeeper).toBeGreaterThan(GK_CLAIM_HEIGHT);
  });

  it('a keeper AT HOME never sees a chip — the ground strike stays', () => {
    const { m, shooter } = stage(1.2);
    m.performShot(shooter!);
    const entry = m.shotLog[m.shotLog.length - 1];
    expect(entry.chip).toBeUndefined();
    expect(m.ball.vz).toBe(0); // the placed curler is a ground ball
  });

  it('a keeper IN THE FACE is the smother problem, not a chip target', () => {
    const { m, shooter } = stage(18); // 20m out, keeper 2m from the shooter
    m.performShot(shooter!);
    expect(m.shotLog[m.shotLog.length - 1].chip).toBeUndefined();
  });

  it('deterministic: same stage, same seed ⇒ the same chip flight', () => {
    const flight = (): number[] => {
      const { m, shooter } = stage(8, 11);
      m.performShot(shooter!);
      const zs: number[] = [];
      for (let i = 0; i < 90; i++) {
        m.step(DT);
        zs.push(m.ball.z);
      }
      return zs;
    };
    expect(flight()).toEqual(flight());
  });
});
