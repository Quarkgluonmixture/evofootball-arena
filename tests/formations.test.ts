import { describe, expect, it } from 'vitest';
import { updateTeamBrain } from '../src/ai/TeamBrain';
import {
  ATTACK_FORMATIONS, DEFEND_FORMATIONS, formationSpot,
} from '../src/ai/formations';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT, HALF_L, HALF_W } from '../src/sim/constants';
import { Match } from '../src/sim/Match';
import {
  TEAM_SIZE, deriveTeamStyle,
  type TeamInfo, type TeamStyle,
} from '../src/sim/types';

/**
 * Phase 30 — the formation system. Every team owns a fixed attacking +
 * defending formation and a marking scheme (its tactical identity), derived
 * from the genome at creation and stored. formationSpot reads the team's
 * tables; 'zonal' holds shape and only marks inside the penalty box.
 */

const neutral = (over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return { ...g, ...over };
};
const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (name: string, genome = neutral(), style?: TeamStyle): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome,
  squad: neutralSquad(),
  style,
});

describe('tactical identity derivation', () => {
  it('reads the genes that mean width, pressing and marking — deterministically', () => {
    const wide = deriveTeamStyle(neutral({ attackingWidth: 0.8 }));
    expect(wide.formationAtk).toBe('wide-212');
    const narrow = deriveTeamStyle(neutral({ attackingWidth: 0.2 }));
    expect(narrow.formationAtk).toBe('narrow-122');

    expect(deriveTeamStyle(neutral({ pressIntensity: 0.8 })).formationDef).toBe('press-23');
    expect(deriveTeamStyle(neutral({ pressIntensity: 0.2 })).formationDef).toBe('low-32');

    expect(deriveTeamStyle(neutral({ markingAggression: 0.8 })).scheme).toBe('man');
    expect(deriveTeamStyle(neutral({ markingAggression: 0.2 })).scheme).toBe('zonal');

    const g = neutral({ attackingWidth: 0.31, pressIntensity: 0.77, markingAggression: 0.12 });
    expect(deriveTeamStyle(g)).toEqual(deriveTeamStyle({ ...g }));
  });

  it('every formation table has one in-bounds spot per slot', () => {
    for (const table of [...Object.values(ATTACK_FORMATIONS), ...Object.values(DEFEND_FORMATIONS)]) {
      expect(table).toHaveLength(TEAM_SIZE);
      for (const spot of table) {
        expect(Math.abs(spot.x)).toBeLessThan(HALF_L);
        expect(Math.abs(spot.y)).toBeLessThan(HALF_W);
      }
      expect(table[0].x).toBeLessThan(-38); // slot 0 is always the keeper
    }
  });
});

describe('formationSpot reads the team tables', () => {
  it('attack uses formationAtk, defence uses formationDef, wingers split wings', () => {
    const m = new Match({
      seed: 3,
      teamA: team('A', neutral(), { formationAtk: 'wide-212', formationDef: 'low-32', scheme: 'man' }),
      teamB: team('B'),
      duration: 60,
    });
    const A = m.teams[0];
    m.ball.pos = { x: 0, y: 0 };
    A.mode = 'ResetShape'; // MODE_SHIFT 0; neutral genome ⇒ depth 0, slide 0

    const wgl = formationSpot(A.players[3], A, m.ball, true);
    const wgr = formationSpot(A.players[4], A, m.ball, true);
    // wide-212 wingers: high (+x for side 0) and on OPPOSITE touchlines.
    expect(Math.sign(wgl.y)).toBe(-Math.sign(wgr.y));
    expect(Math.abs(wgl.y)).toBeGreaterThan(15);
    expect(wgl.x).toBeGreaterThan(0);

    // Defence reads the OTHER table: low-32 drops the same winger deep.
    const wglDef = formationSpot(A.players[3], A, m.ball, false);
    expect(wglDef.x).toBeLessThan(-15);
    expect(wglDef.x).toBeLessThan(wgl.x);
  });
});

describe('marking schemes', () => {
  /** A staged match where team 1 owns the ball and team 0 defends. */
  const staged = (scheme: 'man' | 'zonal'): Match => {
    const m = new Match({
      seed: 9,
      teamA: team('Def', neutral(), { formationAtk: 'wide-212', formationDef: 'low-32', scheme }),
      teamB: team('Att'),
      duration: 240,
    });
    for (let i = 0; i < 70; i++) m.step(DT);
    m.phase = 'playing';
    m.restart = null;
    m.restartKickGid = null;
    m.restartKickKind = null;
    m.kickoffKickGid = null;
    for (const p of m.allPlayers) {
      p.pos = { x: p.side === 0 ? -40 : 20, y: -24 + p.index * 4 };
      p.vel = { x: 0, y: 0 };
    }
    const B = m.teams[1];
    const carrier = B.players[2];
    carrier.pos = { x: 10, y: 0 }; // team 1 attacks -x: 10 is their own half
    m.giveBall(carrier);
    // One threat at deep midfield (NOT in team 0's box), one inside the box.
    B.players[5].pos = { x: -20, y: 3 };
    B.players[3].pos = { x: -38, y: 2 }; // inside the box (depth 13, width 28)
    // Defenders near both threats so man-marking range (22m) is satisfied.
    const A = m.teams[0];
    A.players[1].pos = { x: -36, y: -2 };
    A.players[2].pos = { x: -22, y: -1 };
    A.players[5].pos = { x: -18, y: 5 };
    return m;
  };

  it('man marks the midfield threat; zonal holds shape and only marks in the box', () => {
    const man = staged('man');
    updateTeamBrain(man.teams[0], man);
    const manMarked = new Set(man.teams[0].marks.values());
    expect(manMarked.has(5)).toBe(true); // midfield threat picked up
    expect(manMarked.has(3)).toBe(true); // box threat picked up

    const zonal = staged('zonal');
    updateTeamBrain(zonal.teams[0], zonal);
    const zonalMarked = new Set(zonal.teams[0].marks.values());
    expect(zonalMarked.has(3)).toBe(true); // the box is still defended man-for-man
    expect(zonalMarked.has(5)).toBe(false); // midfield belongs to the zone
  });
});

describe('formations are tactics, not paint (directional)', () => {
  // Metric choice (probed, §10.5): outcome soups don't carry the signal at
  // any affordable n — conceded shots/xG/goals and opponent completion all
  // flipped direction between seed pools. What separates robustly (5–8m gap
  // on every pool probed) is defensive HEIGHT: the mean team-local x of the
  // outfielders while the opponent has the ball in open play. That is the
  // formation EXPRESSING through the whole brain stack (spots, marks,
  // chasers, executor) in live matches — behavior, not the table read the
  // formationSpot unit test already covers. The scheme is 'zonal' on
  // purpose: under man-marking defenders chase bodies and the defend tables
  // barely express at all.
  it('under zonal, a press-23 side defends 3m+ higher than a low-32 side', { timeout: 120000 }, () => {
    const height = { 'low-32': 0, 'press-23': 0 };
    for (const def of ['low-32', 'press-23'] as const) {
      const style: TeamStyle = { formationAtk: 'narrow-122', formationDef: def, scheme: 'zonal' };
      let sum = 0;
      let n = 0;
      // Side-balanced pooled seeds (§10.5): the SAME neutral opponent
      // attacks each defensive identity from both home and away slots.
      for (let s = 0; s < 8; s++) {
        for (const home of [true, false]) {
          const m = new Match({
            seed: 9000 + s * 2 + (home ? 0 : 1),
            teamA: home ? team('D', neutral(), style) : team('O'),
            teamB: home ? team('O') : team('D', neutral(), style),
            duration: 240,
          });
          const D = m.teams[home ? 0 : 1];
          let steps = 0;
          while (!m.finished) {
            m.step(DT);
            if (++steps % 60 === 0 && m.phase === 'playing' && m.possessionSide === 1 - D.side) {
              for (const p of D.players) {
                if (p.role !== 'GK' && !p.sentOff) {
                  sum += D.localX(p.pos.x);
                  n++;
                }
              }
            }
          }
        }
      }
      height[def] = sum / n;
    }
    expect(height['press-23']).toBeGreaterThan(height['low-32'] + 3);
  });
});
