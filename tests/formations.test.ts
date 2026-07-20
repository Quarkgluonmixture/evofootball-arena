import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { updateTeamBrain } from '../src/ai/TeamBrain';
import {
  ATTACK_FORMATIONS, DEFEND_FORMATIONS, formationSpot, setEmergentPos,
} from '../src/ai/formations';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { DT, HALF_L, HALF_W, PITCH_SCALE } from '../src/sim/constants';
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
      expect(table[0].x).toBeLessThan(-38 * PITCH_SCALE); // slot 0 is always the keeper (tables scale)
    }
  });
});

describe('formationSpot reads the team tables', () => {
  // This suite validates the FIXED formation TABLES; emergent positioning is
  // the default now, so force the fixed path (2026-07-20 density相变).
  beforeEach(() => setEmergentPos(false));
  afterEach(() => setEmergentPos(true));

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
    // Widths/depths scale with the pitch (2026-07-20 density相变).
    expect(Math.sign(wgl.y)).toBe(-Math.sign(wgr.y));
    expect(Math.abs(wgl.y)).toBeGreaterThan(15 * PITCH_SCALE);
    expect(wgl.x).toBeGreaterThan(0);

    // Defence reads the OTHER table: low-32 drops the same winger deep.
    const wglDef = formationSpot(A.players[3], A, m.ball, false);
    expect(wglDef.x).toBeLessThan(-15 * PITCH_SCALE);
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
    // One threat on the HIGH FLANK — far from every low-32 zone center (the
    // defending spots cluster low and central) — and one inside the box.
    B.players[5].pos = { x: -5, y: 25 };
    B.players[3].pos = { x: -38, y: 2 }; // inside the box (depth 13, width 28)
    // Defenders near both threats so man-marking range (22m) is satisfied;
    // A[4] stands on the carrier so the chaser role doesn't consume the
    // only defender in range of the flank threat.
    const A = m.teams[0];
    A.players[1].pos = { x: -36, y: -2 };
    A.players[2].pos = { x: -22, y: -1 };
    A.players[4].pos = { x: 5, y: 2 };
    A.players[5].pos = { x: -8, y: 12 };
    return m;
  };

  it('man tracks the flank threat; zonal defends its zones and the box', () => {
    const man = staged('man');
    updateTeamBrain(man.teams[0], man);
    const manMarked = new Set(man.teams[0].marks.values());
    expect(manMarked.has(5)).toBe(true); // flank threat tracked wherever it goes
    expect(manMarked.has(3)).toBe(true); // box threat picked up

    const zonal = staged('zonal');
    updateTeamBrain(zonal.teams[0], zonal);
    const zonalMarked = new Set(zonal.teams[0].marks.values());
    expect(zonalMarked.has(3)).toBe(true); // the box is still defended man-for-man
    // The flank threat sits in NOBODY's zone — the lattice holds instead.
    expect(zonalMarked.has(5)).toBe(false);
  });
});

describe('the keeper waits for shape (Phase 30.3)', () => {
  // The release GATE is what's under test (shapeReady + the hold budget), not
  // the positioning system. Force the fixed path so placing a player AT its
  // spot is idempotent — the emergent field's anti-clump term reads live
  // teammate positions, so place≠check by construction (2026-07-20 density相变).
  beforeEach(() => setEmergentPos(false));
  afterEach(() => setEmergentPos(true));

  const SPOT_RADIUS = 6;

  /** Mean/settled-count of team 0's outfielders vs their attacking spots. */
  const settledCount = (m: Match): number => {
    const A = m.teams[0];
    let n = 0;
    for (const p of A.players) {
      if (p.role === 'GK' || p.sentOff) continue;
      const spot = formationSpot(p, A, m.ball, true);
      if (Math.hypot(p.pos.x - spot.x, p.pos.y - spot.y) < SPOT_RADIUS) n++;
    }
    return n;
  };

  /** A match forced into a team-0 goal kick, outfielders scattered. */
  const goalKick = (scatter: boolean): Match => {
    const m = new Match({ seed: 17, teamA: team('A'), teamB: team('B'), duration: 240 });
    for (let i = 0; i < 70; i++) m.step(DT);
    const A = m.teams[0];
    const gk = A.goalkeeper;
    // On-pitch goal-area spot (2026-07-20 density相变): the old literal −40 is
    // behind the shrunk goal line (−HALF_L), so the taker got clamped onto the
    // pitch away from the spot and never read as "at the ball" — the gate then
    // only ever released on the timeout. Re-express via the goal area.
    const pos = { x: -HALF_L + 7, y: 0 };
    gk.pos = { x: -HALF_L + 7, y: 0.5 }; // taker already at the spot
    // Set the ball to the spot BEFORE laying out the shape, so a pre-settled
    // player placed at its attacking spot is measured against the SAME ball
    // position by shapeReady (place == check).
    m.ball.pos = { ...pos };
    for (const p of m.allPlayers) {
      if (p === gk) continue;
      if (p.side === 0) {
        p.pos = scatter
          ? { x: HALF_L - 4, y: p.index % 2 === 0 ? HALF_W - 3 : -(HALF_W - 3) } // far corner, way off shape
          : formationSpot(p, A, m.ball, true);
      } else {
        p.pos = { x: HALF_L - 3, y: -20 + p.index * 6 };
      }
      p.vel = { x: 0, y: 0 };
    }
    m.phase = 'restart';
    m.restart = { kind: 'goalKick', side: 0, pos, timer: 0, takerGid: gk.gid };
    m.possessionSide = 0;
    return m;
  };

  it('a goal kick waits for the outfielders to settle, then releases to a set shape', () => {
    const m = goalKick(true);
    let released = -1;
    for (let i = 0; i < 60 * 8 && released < 0; i++) {
      const timer = m.restart?.timer ?? 0;
      m.step(DT);
      if ((m.phase as string) !== 'restart') released = timer;
    }
    expect(released).toBeGreaterThan(2); // it WAITED well past the 1.0s setup
    // Released either into shape or by the timeout cap (minSetup 1.0 + 4).
    expect(settledCount(m) >= 3 || released >= 4.9).toBe(true);
  });

  it('pre-settled receivers release quickly — the gate costs nothing when shape exists', () => {
    const m = goalKick(false);
    let released = -1;
    for (let i = 0; i < 60 * 8 && released < 0; i++) {
      const timer = m.restart?.timer ?? 0;
      m.step(DT);
      if ((m.phase as string) !== 'restart') released = timer;
    }
    expect(released).toBeGreaterThan(0);
    expect(released).toBeLessThan(2);
  });

  it('never deadlocks: a team with every outfielder sent off kicks at the normal beat', () => {
    const m = goalKick(true);
    for (const p of m.teams[0].players) if (p.role !== 'GK') p.sentOff = true;
    let released = -1;
    for (let i = 0; i < 60 * 8 && released < 0; i++) {
      const timer = m.restart?.timer ?? 0;
      m.step(DT);
      if ((m.phase as string) !== 'restart') released = timer;
    }
    expect(released).toBeGreaterThan(0);
    expect(released).toBeLessThan(2); // min(3, outfield 0) = 0 — no pointless wait
  });

  it('a keeper with the ball in hand holds until shape (budget-capped), then releases', () => {
    const m = new Match({ seed: 23, teamA: team('A'), teamB: team('B'), duration: 240 });
    for (let i = 0; i < 70; i++) m.step(DT);
    m.phase = 'playing';
    m.restart = null;
    m.restartKickGid = null;
    m.restartKickKind = null;
    m.kickoffKickGid = null;
    const A = m.teams[0];
    const gk = A.goalkeeper;
    gk.pos = { x: -41, y: 0 };
    for (const p of m.allPlayers) {
      if (p === gk) continue;
      p.pos = p.side === 0 ? { x: 38, y: p.index % 2 === 0 ? 25 : -25 } : { x: 25, y: -20 + p.index * 6 };
      p.vel = { x: 0, y: 0 };
      p.decisionTimer = 999; // frozen: shape can NEVER form — the budget must release
    }
    // The scenario is a CLAIM into the hands — a live same-side pass would
    // now trip the 32.2 back-pass law and put it at his feet instead.
    m.pendingPass = null;
    m.giveBall(gk);
    expect(gk.gkHoldTimer).toBeGreaterThan(0);

    // Well past the base 1.1s hold the keeper still owns it, waiting.
    for (let i = 0; i < Math.round(2.5 / DT); i++) m.step(DT);
    expect(m.ball.owner).toBe(gk);

    // ...but the budget caps the wait: within ~7s total the ball has GONE.
    let releasedAt = -1;
    for (let i = 0; i < Math.round(5 / DT) && releasedAt < 0; i++) {
      m.step(DT);
      if (m.ball.owner !== gk) releasedAt = 1;
    }
    expect(releasedAt).toBe(1);
  });
});

describe('formations are tactics, not paint (directional)', () => {
  // Defensive HEIGHT separates the fixed formationDef tables; emergent is the
  // default now and ignores those tables, so force the fixed path here
  // (2026-07-20 density相变).
  beforeEach(() => setEmergentPos(false));
  afterEach(() => setEmergentPos(true));

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
    expect(height['press-23']).toBeGreaterThan(height['low-32'] + 3 * PITCH_SCALE);
  });
});

describe('the discovered shapes (Phase 67, N5)', () => {
  it('novel shapes never come from derivation — founders stay classic', () => {
    for (const w of [0, 0.25, 0.5, 0.75, 1]) {
      const atk = deriveTeamStyle(neutral({ attackingWidth: w })).formationAtk;
      expect(['wide-212', 'narrow-122']).toContain(atk);
    }
  });

  it('the novel shapes play REAL football — attack both ways over a seed pool', { timeout: 120000 }, () => {
    for (const shape of ['twin-st', 'false-nine', 'overload', 'target-man'] as const) {
      const novel = team('N', neutral(), { formationAtk: shape, formationDef: 'press-23', scheme: 'man' });
      const classic = team('C', neutral(), { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' });
      let goalsN = 0;
      let goalsC = 0;
      let shotsN = 0;
      let shotsC = 0;
      // Side-balanced (§10.5): each seed plays both home/away orders.
      for (let seed = 1; seed <= 8; seed++) {
        const ab = new Match({ seed, teamA: novel, teamB: classic, duration: 240 }).runToCompletion();
        goalsN += ab.score[0];
        goalsC += ab.score[1];
        shotsN += ab.stats[0].shots;
        shotsC += ab.stats[1].shots;
        const ba = new Match({ seed, teamA: classic, teamB: novel, duration: 240 }).runToCompletion();
        goalsN += ba.score[1];
        goalsC += ba.score[0];
        shotsN += ba.stats[1].shots;
        shotsC += ba.stats[0].shots;
      }
      // Playability, not balance: the shape generates a real attack and
      // concedes a real one (whether it WINS is the emergence probe's
      // question — selection prices that, not this pin).
      expect(shotsN).toBeGreaterThan(40);
      expect(shotsC).toBeGreaterThan(40);
      expect(goalsN).toBeGreaterThan(0);
      expect(goalsC).toBeGreaterThan(0);
    }
  });
});
