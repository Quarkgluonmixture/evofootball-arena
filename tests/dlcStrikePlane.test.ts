import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL, passLeadMotion } from '../src/ai/passLeadSeat';
import {
  STRIKE_PLANE_K, STRIKE_PLANE_STEPS, STRIKE_PLANE_ZERO_INDEX,
  groundStrikeGrid, strikePlaneSeatOf, strikeReach,
} from '../src/ai/strikePlaneSeat';
import { GENE_KEYS, randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { opennessAt } from '../src/ai/perception';
import { a4MatchFlags } from '../src/game/a4World';
import { dist } from '../src/utils/vec';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import { Rng } from '../src/utils/rng';

/**
 * DLC-T0s (docs/world-model/DLC-T0S-DORMANT-SEAM.md; contract
 * docs/world-model/DELIVERY-CHOICE-CONTRACT.md §2 M-DLC.1″ slice ONE-S; rulings
 * #240/#241) — the DORMANT GROUND STRIKE PLANE (控制的是那一脚). The pins:
 *   • THE PLANE — armed, every support-mode mate is priced over K = 9 SAMPLED GROUND
 *     STRIKES (direction × power; elevation 0, spin 0) through the ONE hoisted
 *     `groundCandidate`, each AT ITS OWN RECEIVING POINT, all entering the SAME argmax.
 *     No threshold, no taste term, no new comparison logic: the argmax picks THE KICK.
 *   • ⭐ THE ZERO-POINT IS TODAY'S KICK — grid member 4 (direction step 0, power step 0)
 *     has EXACTLY ±0 displacement, so it prices to the incumbent's own double and the
 *     strict `>` keeps the incumbent on every tie.
 *   • ⭐ THE GRID IS TRACED — its one scale is the banked PTP-T0 projection at FULL
 *     weight (`|motion| · d0/18 · 1.6`): the angle it subtends is the direction step and
 *     the same length is the power step. Nothing here is a taste knob.
 *   • ⭐ THE GENE'S MAGNITUDE HAS RETIRED (#240/#241) — PRESENCE gates the grid, VALUE
 *     scales nothing: gene 0, 0.37 and 1 are the SAME WORLD, byte for byte.
 *   • ⭐⭐ THE PRECEDENCE CHAIN, FROZEN — the banked `ptpPassLead` and
 *     `dlcDeliveryChoice` doors keep precedence: no grid forms while either seat exists,
 *     so armed-both ≡ the banked door armed ALONE, at every gene state.
 *   • NO NEW GENE, NO NEW STRIKE STATEMENT; the loft's `d > 24` gate (two-s's zero-point)
 *     and the automatic bender (three-s's) untouched.
 * Road B: flag hard-false ⇒ byte-identical world (the 2-season fingerprint pin is
 * deliberately NOT duplicated here — the PM-T0 Deviation 2 load lesson; G-IDENT / G-FP
 * recompute it in the probe).
 */

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

interface Arm {
  sp?: boolean;
  dlc?: boolean;
  ptp?: boolean;
  gene?: number | null; //   null / undefined ⇒ born absent
  percept?: boolean;
}
const matchOf = (seed: number, arm: Arm = {}): Match => {
  const percept = arm.percept ?? true;
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...(percept ? { edsPerceivedDefence: true, edsPerceivedChoice: true } : {}),
    ...(arm.sp === undefined ? {} : { dlcStrikePlane: arm.sp }),
    ...(arm.dlc === undefined ? {} : { dlcDeliveryChoice: arm.dlc }),
    ...(arm.ptp === undefined ? {} : { ptpPassLead: arm.ptp }),
  });
  // THE ARMING CHECKLIST (#196.3-D6): all three genome views of BOTH teams.
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (arm.gene !== undefined && arm.gene !== null) g.passLeadSupport = arm.gene;
    }
  }
  return m;
};
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');
const run = (m: Match): string => {
  while (!m.finished) m.step(DT);
  return signature(m);
};
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = join(dir, e);
  return statSync(full).isDirectory() ? srcFiles(full) : full.endsWith('.ts') ? [full] : [];
});
const brainSource = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
const seatSource = readFileSync('src/ai/strikePlaneSeat.ts', 'utf8');

describe('DLC-T0s — the dormant GROUND STRIKE PLANE', () => {
  /* ---------------- HYGIENE / Road B ---------------------------------------- */

  it('HYGIENE: the flag is an explicit hard false, absent from a4World and every default', () => {
    const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
    expect(matchSrc).toContain('this.dlcStrikePlane = cfg.dlcStrikePlane ?? false;');
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    expect(a4).not.toContain('dlcStrikePlane');
    expect(JSON.stringify(a4MatchFlags(3))).not.toContain('dlcStrikePlane');
    expect(matchOf(12_427_900, {}).dlcStrikePlane).toBe(false);
    const league = new League({ seed: 12_427_900 });
    expect(league.createMatch(league.nextFixture()!).dlcStrikePlane).toBe(false);
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/strikePlaneSeat.ts',
      'src/ai/PlayerBrain.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/dlcStrikePlane|strikePlaneSeat|groundStrikeGrid/.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('NO NEW GENE: this stage adds nothing to the genome at all', () => {
    expect((GENE_KEYS as readonly string[])).not.toContain('passLeadSupport');
    expect(readFileSync('src/evolution/genome.ts', 'utf8')).not.toContain('strikePlane');
    const g = randomGenome(new Rng(12_427_901));
    expect(g.passLeadSupport).toBeUndefined();
    expect(JSON.stringify(g)).not.toContain('passLead');
  });

  /* ---------------- THE ARMING RULE + the identities ------------------------ */

  it('ARMING: a seat exists only when the gene is NON-ABSENT (born absent ⇒ no grid)', () => {
    const m = matchOf(12_427_900, { sp: true });
    const p = m.teams[0].players[3];
    const absent: TacticalGenome = { ...m.teams[0].genome };
    delete absent.passLeadSupport;
    expect(strikePlaneSeatOf(p, m, absent, false)).toBeNull();
    for (const v of [0, 0.37, 1]) {
      expect(strikePlaneSeatOf(p, m, { ...absent, passLeadSupport: v }, false)).not.toBeNull();
    }
  });

  it('G-OFF: flag ABSENT ≡ flag FALSE, both world shapes', () => {
    for (const percept of [true, false]) {
      expect(run(matchOf(12_427_900, { percept })))
        .toBe(run(matchOf(12_427_900, { sp: false, percept })));
    }
  });

  it('G-BORN: ARMED with the gene ABSENT ≡ OFF (inert through the LIVE arming rule)', () => {
    for (const seed of [12_427_900, 12_427_901]) {
      expect(run(matchOf(seed, { sp: true }))).toBe(run(matchOf(seed, {})));
    }
  });

  it('⭐ G-VALUE-INERT (#240/#241): PRESENCE gates the grid, the gene VALUE scales nothing', () => {
    // ⚠ THE ZERO-DOSE READING IS RETIRED: gene 0 is NOT "off" under this door — the grid
    // forms exactly as it does at 1, and the world is the SAME world at every value.
    for (const seed of [12_427_900, 12_427_902]) {
      const base = run(matchOf(seed, { sp: true, gene: 0 }));
      expect(run(matchOf(seed, { sp: true, gene: 0.37 }))).toBe(base);
      expect(run(matchOf(seed, { sp: true, gene: 1 }))).toBe(base);
      expect(base).not.toBe(run(matchOf(seed, {}))); // and it is not the incumbent world
    }
  });

  it('G-BITE: ARMED with the gene PRESENT the world DIVERGES, in both world shapes', () => {
    for (const percept of [true, false]) {
      expect(run(matchOf(12_427_902, { sp: true, gene: 1, percept })))
        .not.toBe(run(matchOf(12_427_902, { percept })));
    }
  });

  /* ---------------- THE GRID ITSELF ----------------------------------------- */

  it('⭐ THE ZERO-POINT IS TODAY\'S KICK: member 4 has EXACTLY ±0 displacement', () => {
    const m = matchOf(12_427_903, { sp: true, gene: 1, percept: false });
    let members = 0;
    let i = 0;
    while (!m.finished && i < 3000) {
      m.step(DT);
      i += 1;
      if (i % 15 !== 0 || m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const p of t.players) {
          const seat = strikePlaneSeatOf(p, m, { ...t.genome, passLeadSupport: 1 }, false)!;
          for (const mate of t.players) {
            if (mate === p || mate.sentOff) continue;
            const grid = groundStrikeGrid(seat, p.pos, mate);
            expect(grid.length).toBe(STRIKE_PLANE_K);
            members += grid.length;
            // the FROZEN ORDER: direction-major, then power, both ascending
            grid.forEach((c, k) => {
              expect(c.dirStep).toBe(STRIKE_PLANE_STEPS[Math.floor(k / 3)]);
              expect(c.powerStep).toBe(STRIKE_PLANE_STEPS[k % 3]);
              // the AIM COMPOSITION has ONE owner and it is checked, not trusted
              expect(c.aim.x).toBe(mate.pos.x + c.strike.x);
              expect(c.aim.y).toBe(mate.pos.y + c.strike.y);
            });
            const zero = grid[STRIKE_PLANE_ZERO_INDEX];
            expect(zero.dirStep).toBe(0);
            expect(zero.powerStep).toBe(0);
            expect(zero.strike.x).toBe(0);
            expect(zero.strike.y).toBe(0);
            // ⇒ its RECEIVING POINT is the incumbent's own point, coordinate for coordinate
            expect(zero.aim.x).toBe(mate.pos.x);
            expect(zero.aim.y).toBe(mate.pos.y);
          }
        }
      }
    }
    expect(members).toBeGreaterThan(0);
  });

  it('⭐ THE GRID IS TRACED: reach = |motion|·(d0/18)·1.6, direction = i·θ, power = d0 + j·reach', () => {
    const m = matchOf(12_427_903, { sp: true, gene: 1, percept: false });
    let support = 0;
    let moved = 0;
    let still = 0;
    let minLengthRatio = 1;
    let i = 0;
    while (!m.finished && i < 3000) {
      m.step(DT);
      i += 1;
      if (i % 15 !== 0 || m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const p of t.players) {
          const seat = strikePlaneSeatOf(p, m, { ...t.genome, passLeadSupport: 1 }, false)!;
          for (const mate of t.players) {
            if (mate === p || mate.sentOff) continue;
            const grid = groundStrikeGrid(seat, p.pos, mate);
            const d0 = dist(p.pos, mate.pos);
            const reach = strikeReach(seat, p.pos, mate);
            if (mate.action.type !== 'SupportBallCarrier') {
              // ⭐ NO PREDICATE (#200): the SCOPE GATE is the banked seat's own, so a
              // non-support mate's whole plane collapses onto today's kick BY ARITHMETIC
              expect(reach).toBe(0);
              for (const c of grid) {
                expect(c.strike.x).toBe(0);
                expect(c.strike.y).toBe(0);
              }
              continue;
            }
            support += 1;
            const motion = passLeadMotion(seat, mate);
            const speed = Math.hypot(motion.x, motion.y);
            // the banked projection at FULL weight — the gene's magnitude is retired
            expect(reach).toBeCloseTo(speed * (d0 / PTP_FLIGHT_SPEED) * PTP_LEAD_FLIGHT_MUL, 12);
            if (speed < 1e-9) {
              still += 1;
              for (const c of grid) {
                expect(c.strike.x).toBe(0);
                expect(c.strike.y).toBe(0);
              }
              continue;
            }
            moved += 1;
            // BOUNDED BY CONSTRUCTION: reach < d0, so every power variant is a real ball
            expect(reach).toBeLessThan(d0);
            minLengthRatio = Math.min(minLengthRatio, (d0 - reach) / d0);
            const theta = Math.atan2(reach, d0);
            const u = { x: (mate.pos.x - p.pos.x) / d0, y: (mate.pos.y - p.pos.y) / d0 };
            for (const c of grid) {
              const rx = c.aim.x - p.pos.x;
              const ry = c.aim.y - p.pos.y;
              // POWER: the struck LENGTH is d0 + j·reach (the shipped speed law is
              // monotone in it, so length IS the weight)
              expect(Math.hypot(rx, ry)).toBeCloseTo(d0 + c.powerStep * reach, 9);
              // DIRECTION: the struck BEARING is the mate-ward one rotated by i·θ.
              // Read as a SIGNED angle through atan2 (well-conditioned near zero, unlike
              // acos, whose error floor there is √ε ≈ 1.5e-8 — measured, not guessed).
              expect(Math.atan2(u.x * ry - u.y * rx, u.x * rx + u.y * ry))
                .toBeCloseTo(c.dirStep * theta, 9);
            }
          }
        }
      }
    }
    expect(support).toBeGreaterThan(0);
    expect(moved).toBeGreaterThan(0);
    expect(still + moved).toBe(support);
    expect(minLengthRatio).toBeGreaterThan(0);
  });

  it('⭐ THE ARGMAX ENTRY: the winner is priced at ITS OWN receiving point, and BOTH win', () => {
    // The G-LOFT-BODY idiom: the winning Pass candidate's own reported openness (2 dp in
    // its `why` string) must equal the openness of the receiving point IT was priced at.
    // ⚠ DECLARED INTERVENTION: an instrument match.
    const m = matchOf(12_427_904, { sp: true, gene: 1, percept: false });
    const WHY = /^to (.+) · lane (\d+\.\d\d) · open (\d+\.\d\d) · passBias/;
    let cands = 0;
    let material = 0;
    let planeWins = 0;
    let zeroWins = 0;
    let violations = 0;
    let i = 0;
    while (!m.finished) {
      m.step(DT);
      i += 1;
      if (i % 15 !== 0 || m.phase !== 'playing') continue;
      const carrier = m.ball.owner;
      if (carrier === null || carrier.kickCooldown > 0) continue;
      const t = m.teams[carrier.side];
      const opp = m.teams[1 - carrier.side];
      decidePlayer(carrier, m);
      const cand = carrier.action.scores.find((c) => c.action === 'Pass');
      const parsed = cand === undefined ? null : WHY.exec(cand.why);
      if (parsed === null) continue;
      const named = t.players.filter((q) => q.name === parsed[1]);
      if (named.length !== 1) continue;
      const mate = named[0];
      cands += 1;
      const seat = strikePlaneSeatOf(carrier, m, { ...t.genome, passLeadSupport: 1 }, false)!;
      const grid = groundStrikeGrid(seat, carrier.pos, mate);
      const at2 = (x: number): number => Math.round(x * 100) / 100;
      const opens = grid.map((c) => at2(opennessAt(c.aim, opp.players)));
      const reported = Number(parsed[3]);
      const zeroOpen = opens[STRIKE_PLANE_ZERO_INDEX];
      if (!opens.includes(reported)) { violations += 1; continue; }
      // MATERIAL: some member's receiving point reads materially differently from today's
      const spread = Math.max(...opens.map((o) => Math.abs(o - zeroOpen)));
      if (spread > 0.05) {
        material += 1;
        if (reported === zeroOpen) zeroWins += 1;
        else planeWins += 1;
      }
    }
    expect(cands).toBeGreaterThan(0);
    expect(violations).toBe(0); // every winner priced at ITS OWN receiving point
    expect(material).toBeGreaterThan(0);
    expect(planeWins).toBeGreaterThan(0); // a sampled strike genuinely WINS sometimes
    expect(zeroWins).toBeGreaterThan(0); // and today's kick genuinely wins too — a contest
  });

  it('⭐ NO TASTE TERM (#236 amendment binds): the plane block names no gene and no factor', () => {
    expect(brainSource).toContain('const planeCand = groundCandidate(mate, strike.aim, d);');
    // ONE scoring declaration ⇒ the pricing cannot drift into a second copy
    expect((brainSource.match(/const groundCandidate = \(/g) ?? []).length).toBe(1);
    const from = brainSource.indexOf(
      '      if (spSeat !== null && dlcSeat === null && ptpSeat === null) {',
    );
    const to = brainSource.indexOf('    if (pressure > 0.5)', from);
    expect(from).toBeGreaterThan(0);
    expect(to).toBeGreaterThan(from);
    const code = (s: string): string => s.split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    for (const banned of ['riskTolerance', 'passBias', 'attackingWidth', 'attrs.', '*= ']) {
      expect(code(brainSource.slice(from, to))).not.toContain(banned);
    }
    for (const banned of ['riskTolerance', 'passBias', 'attrs.', 'traits']) {
      expect(code(seatSource)).not.toContain(banned);
    }
  });

  /* ---------------- ⭐⭐ THE FROZEN PRECEDENCE CHAIN ------------------------ */

  it('⭐⭐ PTP KEEPS PRECEDENCE: armed BOTH ≡ ptpPassLead armed ALONE, at every gene state', () => {
    for (const gene of [null, 0, 1] as const) {
      expect(run(matchOf(12_427_905, { sp: true, ptp: true, gene, percept: false })))
        .toBe(run(matchOf(12_427_905, { ptp: true, gene, percept: false })));
    }
  });

  it('⭐⭐ THE BANKED TWO-POINT DOOR KEEPS PRECEDENCE: sp+dlc ≡ dlc alone, every gene state', () => {
    for (const gene of [null, 0, 1] as const) {
      expect(run(matchOf(12_427_905, { sp: true, dlc: true, gene, percept: false })))
        .toBe(run(matchOf(12_427_905, { dlc: true, gene, percept: false })));
    }
  });

  it('⭐⭐ THE PLANE IS NOT THE TWO-POINT CONTEST (T1s\'s contrast anchor stays meaningful)', () => {
    expect(run(matchOf(12_427_905, { sp: true, gene: 1, percept: false })))
      .not.toBe(run(matchOf(12_427_905, { dlc: true, gene: 1, percept: false })));
    expect(run(matchOf(12_427_905, { sp: true, gene: 1, percept: false })))
      .not.toBe(run(matchOf(12_427_905, { ptp: true, gene: 1, percept: false })));
  });

  /* ---------------- ⭐ G-EPI-MOTION (re-gated through THIS path) ------------- */

  it('⭐ G-EPI-MOTION: the percept world\'s grid reads REMEMBERED motion', () => {
    const m = matchOf(12_427_906, { sp: true, gene: 1 });
    for (let i = 0; i < 600; i++) m.step(DT);
    const pairs: { carrier: Player; mate: Player; before: number }[] = [];
    for (let guard = 0; guard < 4000 && pairs.length < 3 && !m.finished; guard++) {
      m.step(DT);
      pairs.length = 0;
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const carrier of t.players) {
          if (carrier.sentOff || carrier.role === 'GK') continue;
          const seat = strikePlaneSeatOf(carrier, m, { ...t.genome, passLeadSupport: 1 }, true);
          if (seat === null) continue;
          for (const mate of t.players) {
            if (mate === carrier || mate.sentOff) continue;
            if (mate.action.type !== 'SupportBallCarrier') continue;
            const reach = strikeReach(seat, carrier.pos, mate);
            if (reach === 0) continue;
            pairs.push({ carrier, mate, before: reach });
          }
        }
      }
    }
    expect(pairs.length).toBeGreaterThan(0);
    // rewrite every TRUTH velocity in place WITHOUT stepping: no scan moment is recorded,
    // positions are untouched, so only the motion source can move the grid's scale
    for (const p of m.allPlayers) { p.vel.x = 7.5; p.vel.y = -6.25; }
    for (const pair of pairs) {
      const t = m.teams[pair.carrier.side];
      const seat = strikePlaneSeatOf(
        pair.carrier, m, { ...t.genome, passLeadSupport: 1 }, true,
      )!;
      const now = strikeReach(seat, pair.carrier.pos, pair.mate);
      const flight = dist(pair.carrier.pos, pair.mate.pos) / PTP_FLIGHT_SPEED;
      // the truth re-derivation walks the SAME arithmetic path (componentwise, then the
      // root) so the comparison is EXACT rather than approximate
      const tx = 7.5 * flight * PTP_LEAD_FLIGHT_MUL;
      const ty = -6.25 * flight * PTP_LEAD_FLIGHT_MUL;
      const truth = Math.sqrt(tx * tx + ty * ty);
      expect(now).toBe(pair.before); // he reads HIS OWN EYES
      expect(now).not.toBe(truth); // never the truth
    }
    // the source pin: the plane module names NO member of `match` itself
    const code = seatSource.split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    const members = [...new Set([...code.matchAll(/\bmatch\.(\w+)/g)].map((mm) => mm[1]))];
    expect(members).toEqual([]); // it hands `match` to the banked seat and reads nothing
    for (const banned of ['allPlayers', 'perceptionTruth', 'match.teams', 'match.ball']) {
      expect(code).not.toContain(banned);
    }
  });

  /* ---------------- RNG / the read-fork inventory / the untouched ----------- */

  it('G-RNG: an armed, dosed strike plane draws ZERO rng', () => {
    const m = matchOf(12_427_902, { sp: true, gene: 1 });
    for (let i = 0; i < 400; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    let grids = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        const seat = strikePlaneSeatOf(p, m, { ...t.genome, passLeadSupport: 1 }, true);
        if (seat === null) continue;
        for (const mate of t.players) {
          if (mate === p || mate.sentOff) continue;
          groundStrikeGrid(seat, p.pos, mate);
          grids += 1;
        }
      }
    }
    expect(grids).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  it('G-FORK: EXACTLY ONE `match.dlcStrikePlane` fork in src/**', () => {
    let forks = 0;
    for (const f of srcFiles('src')) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        const t = line.trim();
        if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) continue;
        if (!/match\.dlcStrikePlane/.test(t)) continue;
        forks += 1;
        expect(f).toBe('src/ai/PlayerBrain.ts');
        expect(t).toBe(
          'const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;',
        );
      }
    }
    expect(forks).toBe(1);
  });

  it('ZERO NEW STRIKE STATEMENTS: the winning kick rides the BANKED led strike', () => {
    expect((brainSource.match(/match\.performPass\(/g) ?? []).length).toBe(3);
    expect(brainSource).toContain(
      'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));',
    );
    expect(brainSource).toContain('else match.performPass(p, passMate!, offsideExemptKick);');
  });

  it('UNTOUCHED: the through ball, the loft\'s d > 24 gate and the AUTOMATIC bender', () => {
    expect(brainSource).toContain(
      "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
    );
    expect(brainSource).toContain('const burst = runBurstPoint(mate, team, opp.players, flight);');
    // ⭐ slice two-s's zero-point: the loft's own hand gate is a SHIPPED INCUMBENT
    expect(brainSource).toContain('if (d > 24 && !layingOff) {');
    // ⭐ slice three-s's zero-point: the bender stays an AUTOMATIC rule
    expect(readFileSync('src/sim/mechanics.ts', 'utf8')).toContain(
      'bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);',
    );
    // the through-ball block never sees this seam
    const throughBlock = brainSource.slice(
      brainSource.indexOf('// --- Through ball:'), brainSource.indexOf('// --- Cross (Phase 28)'),
    );
    expect(throughBlock).not.toContain('spSeat');
    expect(throughBlock).not.toContain('groundStrikeGrid');
  });

  it('the flag-off world never hands a lead to the strike, even with the gene dosed', () => {
    const m = matchOf(12_427_902, { gene: 1, percept: false });
    const orig = m.performPass.bind(m);
    let leads = 0;
    m.performPass = (
      p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<{ x: number; y: number }> | null = null,
    ): void => {
      if (ptpLead !== null) leads += 1;
      orig(p, mate, offsideExempt, powerChoice, ptpLead);
    };
    while (!m.finished) m.step(DT);
    expect(leads).toBe(0);
  });

  it('G-PINS: the banked fork lines this design yields to are UNTOUCHED, in src and in tests', () => {
    const PTP =
      'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
    const DLC =
      'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
    expect(brainSource).toContain(PTP);
    expect(brainSource).toContain(DLC);
    expect(readFileSync('tests/ptpPassLead.test.ts', 'utf8')).toContain(`'${PTP}',`);
    expect(readFileSync('tests/dlcDeliveryChoice.test.ts', 'utf8')).toContain(`'${DLC}',`);
    // the banked two-point seam's own candidate calls, verbatim
    expect(brainSource).toContain('const feet = groundCandidate(mate, aim, d);');
    expect(brainSource).toContain('const ledCand = groundCandidate(mate, ledBall.aim, d);');
  });
});
