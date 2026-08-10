import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import {
  PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL, passLeadMotion, passLeadOffset, passLeadSeatOf,
} from '../src/ai/passLeadSeat';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, GENE_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS,
  crossoverGenomes, mutateGenome, passLeadSupportWeight, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { clamp01 } from '../src/utils/math';
import { dist } from '../src/utils/vec';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import { Rng } from '../src/utils/rng';

/**
 * PTP-T0 (docs/world-model/PTP-T0-DORMANT-SEAM.md; contract
 * docs/world-model/PASS-TO-PATH-CONTRACT.md §2 M-PTP.1–4; ruling #231) — the
 * DORMANT PASS-LEAD SEAM (传球到路). The pins:
 *   • THE GENE `passLeadSupport` — one optional scalar in [0,1], BORN ABSENT,
 *     deliberately NOT in GENE_KEYS (the #148.5 / #75 RNG-stream trap), evolving
 *     only under its OWN `evolvePassLeadSupport` opt-in whose draws sit STRICTLY
 *     AFTER the `offballMovementWeights` block.
 *   • THE TRACED CONSTANTS — the flight divisor 18 from the through-ball loop's own
 *     line and the lead factor 1.6 from `runBurstPoint`'s own line, both asserted
 *     against the source text so the family cannot drift.
 *   • THE ZERO-POINT, ARITHMETIC-EXACT — gene absent or 0 ⇒ the projection is
 *     exactly ±0 and the world is byte-identical.
 *   • ⭐ G-EPI-MOTION — the motion channel is the CHOOSER'S OWN, per world shape:
 *     remembered percept velocity where the chooser reads percepts, truth velocity
 *     where it reads truth; and the seat module reads nothing off `match` but
 *     `perceivedSnapshot`.
 *   • ⭐⭐ THE TWO DOORS (#228) — arming this seam expresses NO other seam's genes,
 *     and the neighbours are unmoved by this one's, at any dose.
 *   • NO PREDICATES (#200) — a still mate's led point is his feet BY ARITHMETIC.
 *   • THE READ-FORK INVENTORY — exactly ONE `match.ptpPassLead` fork in `src/**`,
 *     and the O1 wind-up's pinned strike statement untouched beside the led one.
 * Road B: flag hard-false ⇒ byte-identical world (the 2-season fingerprint pin is
 * deliberately NOT duplicated here — the PM-T0 Deviation 2 load lesson; G-IDENT /
 * G-FP recompute it in the probe).
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
/** The neighbours' banks at THEIR own domain corners (their probes' convention). */
const OBM_DOSE = ((): number[] => {
  const w = new Array<number>(OBM_WEIGHT_SLOTS).fill(0);
  w[0] = OBM_WEIGHT_MIN;
  w[5] = OBM_WEIGHT_MAX;
  w[8] = OBM_WEIGHT_MAX;
  w[14] = OBM_WEIGHT_MIN;
  return w;
})();
const CTB_DOSE = { depth: CTB_GENE_MIN, width: CTB_GENE_MAX } as const;

interface Arm {
  ptp?: boolean;
  gene?: number | null; //   null / undefined ⇒ born absent
  percept?: boolean;
  obm?: boolean;
  ctb?: boolean;
  others?: boolean; //       the neighbours' gene banks dosed
}
const matchOf = (seed: number, arm: Arm = {}): Match => {
  const percept = arm.percept ?? true;
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...(percept ? { edsPerceivedDefence: true, edsPerceivedChoice: true } : {}),
    ...(arm.ptp === undefined ? {} : { ptpPassLead: arm.ptp }),
    ...(arm.obm ? { obmMovement: true } : {}),
    ...(arm.ctb ? { ctbSupportPlane: true } : {}),
  });
  // THE ARMING CHECKLIST (#196.3-D6): all three genome views of BOTH teams.
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (arm.gene !== undefined && arm.gene !== null) g.passLeadSupport = arm.gene;
      if (arm.others) {
        g.offballMovementWeights = [...OBM_DOSE];
        g.ctbSupportDepth = CTB_DOSE.depth;
        g.ctbSupportWidth = CTB_DOSE.width;
      }
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
const seatSource = readFileSync('src/ai/passLeadSeat.ts', 'utf8');

/** A stepped fixture plus the first (carrier, support-mate) pairs it offers. */
const pairsOf = (m: Match, gene: number, percept: boolean): {
  carrier: Player; mate: Player; lead: Readonly<{ x: number; y: number }>;
}[] => {
  const out: { carrier: Player; mate: Player; lead: Readonly<{ x: number; y: number }> }[] = [];
  for (const t of m.teams) {
    for (const carrier of t.players) {
      if (carrier.sentOff || carrier.role === 'GK') continue;
      const seat = passLeadSeatOf(carrier, m, { ...t.genome, passLeadSupport: gene }, percept);
      for (const mate of t.players) {
        if (mate === carrier || mate.sentOff) continue;
        out.push({ carrier, mate, lead: passLeadOffset(seat, carrier.pos, mate) });
      }
    }
  }
  return out;
};

describe('PTP-T0 — the dormant PASS-LEAD seam', () => {
  /* ---------------- HYGIENE / Road B ---------------------------------------- */

  it('HYGIENE: the flag is an explicit hard false, absent from a4World and every default', () => {
    const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
    expect(matchSrc).toContain('this.ptpPassLead = cfg.ptpPassLead ?? false;');
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    expect(a4).not.toContain('ptpPassLead');
    expect(a4).not.toContain('passLeadSupport');
    expect(JSON.stringify(a4MatchFlags(3))).not.toContain('ptpPassLead');
    expect(matchOf(12_425_900, {}).ptpPassLead).toBe(false);
    const league = new League({ seed: 12_425_900 });
    expect(league.createMatch(league.nextFixture()!).ptpPassLead).toBe(false);
    // no env door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/ai/passLeadSeat.ts', 'src/ai/PlayerBrain.ts',
      'src/evolution/genome.ts', 'src/sim/mechanics.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/ptpPassLead|passLeadSupport|passLeadSeat|PTP_|ptpLead/.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('BORN ABSENT: the gene is outside GENE_KEYS and never serialized', () => {
    expect((GENE_KEYS as readonly string[])).not.toContain('passLeadSupport');
    const g = randomGenome(new Rng(12_425_901));
    expect(g.passLeadSupport).toBeUndefined();
    expect(JSON.stringify(g)).not.toContain('passLead');
    expect(passLeadSupportWeight(g)).toBe(0);
  });

  it('the gene map clamps to [0,1] and degrades absent/non-finite to 0', () => {
    expect(passLeadSupportWeight({ passLeadSupport: 0.4 } as TacticalGenome)).toBe(0.4);
    expect(passLeadSupportWeight({ passLeadSupport: 5 } as TacticalGenome)).toBe(1);
    expect(passLeadSupportWeight({ passLeadSupport: -3 } as TacticalGenome)).toBe(0);
    expect(passLeadSupportWeight({ passLeadSupport: Number.NaN } as TacticalGenome)).toBe(0);
    expect(passLeadSupportWeight({} as TacticalGenome)).toBe(0);
  });

  /* ---------------- ARMING / the identities --------------------------------- */

  it('G-OFF: flag ABSENT ≡ flag FALSE, both world shapes', () => {
    for (const seed of [12_425_900, 12_425_901]) {
      for (const percept of [true, false]) {
        expect(run(matchOf(seed, { percept })))
          .toBe(run(matchOf(seed, { ptp: false, percept })));
      }
    }
  });

  it('G-BORN: ARMED with the gene ABSENT ≡ OFF (inert through the LIVE branch)', () => {
    for (const seed of [12_425_900, 12_425_901]) {
      expect(run(matchOf(seed, { ptp: true }))).toBe(run(matchOf(seed, {})));
    }
  });

  it('G-ZERO: ARMED at gene 0 ≡ OFF — the projection term is exactly +0', () => {
    for (const seed of [12_425_900, 12_425_901]) {
      expect(run(matchOf(seed, { ptp: true, gene: 0 }))).toBe(run(matchOf(seed, {})));
    }
    // and the arithmetic reason, directly: a zero weight gives an exactly-zero lead
    const m = matchOf(12_425_902, { ptp: true, gene: 0 });
    for (let i = 0; i < 300; i++) m.step(DT);
    const zero = pairsOf(m, 0, true);
    expect(zero.length).toBeGreaterThan(0);
    for (const pair of zero) expect(Math.abs(pair.lead.x) + Math.abs(pair.lead.y)).toBe(0);
  });

  it('G-BITE: ARMED at the domain corner the world DIVERGES, in both world shapes', () => {
    for (const percept of [true, false]) {
      expect(run(matchOf(12_425_902, { ptp: true, gene: 1, percept })))
        .not.toBe(run(matchOf(12_425_902, { percept })));
    }
  });

  /* ---------------- THE LAW ------------------------------------------------- */

  it('THE LAW: lead = gene · motion · (dist/18) · 1.6, in sign and magnitude', () => {
    const m = matchOf(12_425_903, { ptp: true, gene: 1, percept: false });
    for (let i = 0; i < 400; i++) m.step(DT);
    let checked = 0;
    for (const t of m.teams) {
      for (const carrier of t.players) {
        if (carrier.sentOff || carrier.role === 'GK') continue;
        for (const gene of [0.25, 0.5, 1]) {
          const seat = passLeadSeatOf(
            carrier, m, { ...t.genome, passLeadSupport: gene }, false,
          );
          for (const mate of t.players) {
            if (mate === carrier || mate.sentOff) continue;
            const lead = passLeadOffset(seat, carrier.pos, mate);
            if (mate.action.type !== 'SupportBallCarrier') {
              expect(lead.x).toBe(0);
              expect(lead.y).toBe(0);
              continue;
            }
            const flight = dist(carrier.pos, mate.pos) / PTP_FLIGHT_SPEED;
            expect(lead.x).toBe(gene * (mate.vel.x * flight * PTP_LEAD_FLIGHT_MUL));
            expect(lead.y).toBe(gene * (mate.vel.y * flight * PTP_LEAD_FLIGHT_MUL));
            // SIGN: the lead points ALONG his motion, never behind him
            const speed = Math.hypot(mate.vel.x, mate.vel.y);
            if (speed > 1e-9) expect(lead.x * mate.vel.x + lead.y * mate.vel.y).toBeGreaterThan(0);
            checked += 1;
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('NO PREDICATE (#200): a STILL mate degenerates to his feet by ARITHMETIC', () => {
    const m = matchOf(12_425_903, { ptp: true, gene: 1, percept: false });
    for (let i = 0; i < 200; i++) m.step(DT);
    const t = m.teams[0];
    const carrier = t.players.find((p) => p.role !== 'GK' && !p.sentOff)!;
    const mate = t.players.find((p) => p !== carrier && p.role !== 'GK' && !p.sentOff)!;
    mate.action = { type: 'SupportBallCarrier', scores: [] };
    const seat = passLeadSeatOf(carrier, m, { ...t.genome, passLeadSupport: 1 }, false);
    mate.vel.x = 0;
    mate.vel.y = 0;
    const still = passLeadOffset(seat, carrier.pos, mate);
    expect(still.x).toBe(0);
    expect(still.y).toBe(0);
    mate.vel.x = 4;
    mate.vel.y = -2;
    const moving = passLeadOffset(seat, carrier.pos, mate);
    expect(Math.hypot(moving.x, moving.y)).toBeGreaterThan(0);
    // and the seat's source contains no threshold on motion — the complete
    // conditional set is gate / guard / zero
    const code = seatSource.split('\n')
      .filter((l) => {
        const s = l.trim();
        return !s.startsWith('*') && !s.startsWith('//') && !s.startsWith('/*');
      }).join('\n');
    expect(code).not.toMatch(/speed\s*[<>]/);
    expect(code).not.toMatch(/Math\.hypot/);
    expect(code).not.toMatch(/checking|isMoving|threshold/);
  });

  it('TRACED: both constants match the lines they were taken from, VERBATIM', () => {
    expect(PTP_FLIGHT_SPEED).toBe(18);
    expect(PTP_LEAD_FLIGHT_MUL).toBe(1.6);
    expect(brainSource).toContain('const flight = dist(p.pos, mate.pos) / 18;');
    expect(readFileSync('src/ai/formations.ts', 'utf8')).toContain(
      'return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);',
    );
    expect(seatSource).toContain('export const PTP_FLIGHT_SPEED = 18;');
    expect(seatSource).toContain('export const PTP_LEAD_FLIGHT_MUL = 1.6;');
  });

  it('M-PTP.4: the MakeRun through-ball loop is UNTOUCHED', () => {
    expect(brainSource).toContain(
      "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
    );
    expect(brainSource).toContain('const burst = runBurstPoint(mate, team, opp.players, flight);');
    expect(brainSource).toContain('const lane = laneOpenness(p.pos, point, opp.players);');
    // the through-ball's own aim point never sees this seam
    const throughBlock = brainSource.slice(
      brainSource.indexOf('// --- Through ball:'), brainSource.indexOf('// --- Cross (Phase 28)'),
    );
    expect(throughBlock).not.toContain('ptp');
    expect(throughBlock).not.toContain('passLead');
  });

  /* ---------------- ⭐ G-EPI-MOTION ---------------------------------------- */

  it('⭐ G-EPI-MOTION: the percept world reads REMEMBERED motion, never the truth', () => {
    const m = matchOf(12_425_904, { ptp: true, gene: 1 });
    for (let i = 0; i < 600; i++) m.step(DT);
    let pairs = pairsOf(m, 1, true).filter((p) => p.lead.x !== 0 || p.lead.y !== 0);
    for (let guard = 0; guard < 3000 && pairs.length === 0; guard++) {
      m.step(DT);
      pairs = pairsOf(m, 1, true).filter((p) => p.lead.x !== 0 || p.lead.y !== 0);
    }
    expect(pairs.length).toBeGreaterThan(0);
    const before = pairs.map((p) => ({ ...p, was: { x: p.lead.x, y: p.lead.y } }));
    // ⭐ THE DIVERGENCE: rewrite every TRUTH velocity in place WITHOUT stepping, so
    // no scan moment is recorded and the remembered velocities still hold the old
    // world. Positions are untouched, so `flight` is identical and the ONLY thing
    // that can move a projection is its motion source.
    for (const p of m.allPlayers) { p.vel.x = 7.5; p.vel.y = -6.25; }
    for (const pair of before) {
      const t = m.teams[pair.carrier.side];
      const seat = passLeadSeatOf(
        pair.carrier, m, { ...t.genome, passLeadSupport: 1 }, true,
      );
      const now = passLeadOffset(seat, pair.carrier.pos, pair.mate);
      const flight = dist(pair.carrier.pos, pair.mate.pos) / PTP_FLIGHT_SPEED;
      const truth = { x: 7.5 * flight * PTP_LEAD_FLIGHT_MUL, y: -6.25 * flight * PTP_LEAD_FLIGHT_MUL };
      expect(now.x).toBe(pair.was.x); // his own eyes
      expect(now.y).toBe(pair.was.y);
      expect(now.x === truth.x && now.y === truth.y).toBe(false); // and NOT the truth
    }
  });

  it('⭐ G-EPI-MOTION: the BARE world reads TRUTH — that is ITS chooser\'s own source', () => {
    const m = matchOf(12_425_904, { ptp: true, gene: 1, percept: false });
    for (let i = 0; i < 400; i++) m.step(DT);
    const t = m.teams[0];
    const carrier = t.players.find((p) => p.role !== 'GK' && !p.sentOff)!;
    const mate = t.players.find((p) => p !== carrier && p.role !== 'GK' && !p.sentOff)!;
    mate.action = { type: 'SupportBallCarrier', scores: [] };
    const seat = passLeadSeatOf(carrier, m, { ...t.genome, passLeadSupport: 1 }, false);
    expect(seat.snapshot).toBeNull(); // no pull at all in a bare world
    mate.vel.x = 3;
    mate.vel.y = 1;
    const flight = dist(carrier.pos, mate.pos) / PTP_FLIGHT_SPEED;
    const lead = passLeadOffset(seat, carrier.pos, mate);
    expect(lead.x).toBe(3 * flight * PTP_LEAD_FLIGHT_MUL);
    expect(passLeadMotion(seat, mate)).toBe(mate.vel);
  });

  it('⭐ G-EPI-MOTION (source): the seat names ONE member of `match`', () => {
    const code = seatSource.split('\n')
      .filter((l) => {
        const s = l.trim();
        return !s.startsWith('*') && !s.startsWith('//') && !s.startsWith('/*');
      }).join('\n');
    const members = [...new Set([...code.matchAll(/\bmatch\.(\w+)/g)].map((mm) => mm[1]))];
    expect(members).toEqual(['perceivedSnapshot']);
    for (const banned of ['allPlayers', 'perceptionTruth', 'match.teams', 'match.ball']) {
      expect(code).not.toContain(banned);
    }
  });

  it('an unseen mate has NO motion for him: zero displacement, to feet', () => {
    const m = matchOf(12_425_905, { ptp: true, gene: 1 });
    for (let i = 0; i < 400; i++) m.step(DT);
    const t = m.teams[0];
    const carrier = t.players.find((p) => p.role !== 'GK' && !p.sentOff)!;
    const seat = passLeadSeatOf(carrier, m, { ...t.genome, passLeadSupport: 1 }, true);
    const ghost = t.players.find((p) => p !== carrier && p.role !== 'GK' && !p.sentOff)!;
    ghost.action = { type: 'SupportBallCarrier', scores: [] };
    ghost.vel.x = 6;
    ghost.vel.y = 6;
    const seen = seat.snapshot?.players.some((o) => o.gid === ghost.gid) ?? false;
    const lead = passLeadOffset(seat, carrier.pos, ghost);
    if (!seen) {
      expect(lead.x).toBe(0);
      expect(lead.y).toBe(0);
    } else {
      // he IS remembered: then the motion is the REMEMBERED one, not this new truth
      const remembered = seat.snapshot!.players.find((o) => o.gid === ghost.gid)!;
      const flight = dist(carrier.pos, ghost.pos) / PTP_FLIGHT_SPEED;
      expect(lead.x).toBe(remembered.vel.x * flight * PTP_LEAD_FLIGHT_MUL);
    }
  });

  /* ---------------- ⭐⭐ THE TWO DOORS (#228) ------------------------------ */

  it('⭐⭐ TWO DOORS: arming ptpPassLead expresses NO other seam\'s genes', () => {
    const seed = 12_425_905;
    const allOff = run(matchOf(seed, {}));
    // armed, with BOTH neighbour banks fully dosed and this gene inert
    expect(run(matchOf(seed, { ptp: true, others: true }))).toBe(allOff);
    expect(run(matchOf(seed, { ptp: true, gene: 0, others: true }))).toBe(allOff);
    // and fully dosed, this seam is UNCHANGED by the neighbours' banks
    expect(run(matchOf(seed, { ptp: true, gene: 1, others: true })))
      .toBe(run(matchOf(seed, { ptp: true, gene: 1 })));
    // ... which is not vacuous: dosed, it moves the world
    expect(run(matchOf(seed, { ptp: true, gene: 1 }))).not.toBe(allOff);
  });

  it('⭐⭐ TWO DOORS: the neighbours are UNMOVED by this gene, at any dose', () => {
    const seed = 12_425_906;
    for (const door of [{ obm: true }, { ctb: true }] as const) {
      const alone = run(matchOf(seed, { ...door, others: true }));
      for (const gene of [0, 0.5, 1]) {
        expect(run(matchOf(seed, { ...door, others: true, gene }))).toBe(alone);
      }
      // and the seams are DISTINGUISHABLE: this one dosed is not that one armed
      expect(run(matchOf(seed, { ptp: true, gene: 1, others: true }))).not.toBe(alone);
    }
  });

  /* ---------------- RNG ORDERING -------------------------------------------- */

  it('G-RNG: the opt-in draws NOTHING when off, and STRICTLY AFTER the OBM block when on', () => {
    // (a) flag-off: identical genomes and identical rng state vs a pre-gene re-impl
    const headMutate = (g: TacticalGenome, rng: Rng): TacticalGenome => {
      const out = { ...g };
      for (const k of GENE_KEYS) if (rng.chance(0.45)) out[k] = clamp01(out[k] + rng.gaussian() * 0.14);
      return out;
    };
    const rngA = new Rng(4242);
    const rngH = new Rng(4242);
    let a = randomGenome(new Rng(7));
    let h: TacticalGenome = { ...a };
    for (let i = 0; i < 6; i++) {
      a = mutateGenome(a, rngA, { rate: 0.45, scale: 0.14 });
      h = headMutate(h, rngH);
    }
    expect(GENE_KEYS.every((k) => a[k] === h[k])).toBe(true);
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
    expect(a.passLeadSupport).toBeUndefined();

    // (b) the opt-in really draws
    const on = mutateGenome(randomGenome(new Rng(7)), new Rng(4242), {
      rate: 1, scale: 0.2, evolvePassLeadSupport: true,
    });
    expect(typeof on.passLeadSupport).toBe('number');

    // (c) STRICTLY AFTER: an OBM-opted-in run's own values are unmoved by adding this
    const obmOnly = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
      rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
    });
    const both = mutateGenome(randomGenome(new Rng(5)), new Rng(777), {
      rate: 1, scale: 0.2, evolveCtbSupportPlane: true, evolveOffballMovement: true,
      evolvePassLeadSupport: true,
    });
    expect(both.offballMovementWeights).toEqual(obmOnly.offballMovementWeights);
    expect(both.ctbSupportDepth).toBe(obmOnly.ctbSupportDepth);
    expect(both.ctbSupportWidth).toBe(obmOnly.ctbSupportWidth);

    // (d) the same in CROSSOVER
    const p0 = { ...randomGenome(new Rng(3)), offballMovementWeights: [...OBM_DOSE] };
    const p1 = { ...randomGenome(new Rng(4)), offballMovementWeights: OBM_DOSE.map((w) => -w) };
    const xObm = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true, true);
    const xBoth = crossoverGenomes(p0, p1, new Rng(31), false, false, false, false, true, true, true);
    expect(xBoth.offballMovementWeights).toEqual(xObm.offballMovementWeights);
    expect(typeof xBoth.passLeadSupport).toBe('number');
    // and with the opt-in OFF the parent's value is carried with NO draw
    const carried = crossoverGenomes(
      { ...p0, passLeadSupport: 0.3 }, p1, new Rng(31), false, false, false, false, true, true,
    );
    expect(carried.passLeadSupport).toBe(0.3);
  });

  it('G-RNG: an armed, dosed projection draws ZERO rng', () => {
    const m = matchOf(12_425_906, { ptp: true, gene: 1 });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    const pairs = pairsOf(m, 1, true);
    expect(pairs.length).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  /* ---------------- THE READ-FORK INVENTORY + the strike -------------------- */

  it('G-FORK: EXACTLY ONE `match.ptpPassLead` fork in src/**', () => {
    let forks = 0;
    for (const f of srcFiles('src')) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        const t = line.trim();
        if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) continue;
        if (!/match\.ptpPassLead/.test(t)) continue;
        forks += 1;
        expect(f).toBe('src/ai/PlayerBrain.ts');
        expect(t).toBe(
          'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;',
        );
      }
    }
    expect(forks).toBe(1);
  });

  it('G-PINS: the O1 wind-up\'s pinned statements are UNTOUCHED beside the led strike', () => {
    const passCase = brainSource.slice(
      brainSource.indexOf("case 'Pass':"), brainSource.indexOf("case 'LoftedPass': {"));
    // the pinned incumbent statements, verbatim (a failing pin is a STOP, never an edit)
    expect(passCase).toMatch(
      /if \(match\.o1PassWindup && !mustKick && p\.firstTouchWindow <= 0\) \{/);
    expect(passCase).toMatch(/match\.armPendingPass\(p, passMate!, offsideExemptKick\);/);
    expect(passCase).toMatch(/else match\.performPass\(p, passMate!, offsideExemptKick\);/);
    // and the led strike is its OWN statement, after the wind-up fork
    expect(passCase).toContain(
      'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));',
    );
    expect(passCase.indexOf('match.o1PassWindup'))
      .toBeLessThan(passCase.indexOf('v2(bestLeadX, bestLeadY)'));
  });

  it('EXECUTION FOLLOWS PRICING: a led pass is struck at the led point', () => {
    const m = matchOf(12_425_902, { ptp: true, gene: 1, percept: false });
    const orig = m.performPass.bind(m);
    let led = 0;
    let plain = 0;
    let lawBad = 0;
    m.performPass = (
      p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<{ x: number; y: number }> | null = null,
    ): void => {
      if (ptpLead === null) plain += 1;
      else {
        led += 1;
        const flight = dist(p.pos, mate.pos) / PTP_FLIGHT_SPEED;
        const want = Math.hypot(mate.vel.x, mate.vel.y) * flight * PTP_LEAD_FLIGHT_MUL;
        if (Math.abs(Math.hypot(ptpLead.x, ptpLead.y) - want) > 1e-9) lawBad += 1;
        if (mate.action.type !== 'SupportBallCarrier') lawBad += 1;
      }
      orig(p, mate, offsideExempt, powerChoice, ptpLead);
    };
    while (!m.finished) m.step(DT);
    expect(led).toBeGreaterThan(0); // led passes really are chosen and struck
    expect(plain).toBeGreaterThan(0); // and to-feet passes still happen (no predicate)
    expect(lawBad).toBe(0);
  });

  it('the flag-off world never hands a lead to the strike', () => {
    const m = matchOf(12_425_902, { percept: false });
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
});
