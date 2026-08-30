import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL } from '../src/ai/passLeadSeat';
import { deliveryChoiceSeatOf, ledDelivery } from '../src/ai/deliveryChoiceSeat';
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
 * DLC-T0 (docs/world-model/DLC-T0-DORMANT-SEAM.md; contract
 * docs/world-model/DELIVERY-CHOICE-CONTRACT.md §2 M-DLC.1–4; rulings #235/#236) —
 * the DORMANT DELIVERY CONTEST (出球的选择权). The pins:
 *   • THE CONTEST — armed, every mate is priced TWICE (to feet, and led at the
 *     BANKED PTP-T0 projection) through ONE hoisted scoring function, and BOTH
 *     enter the SAME `bestPass` argmax. No threshold, no taste multiplier, no new
 *     comparison logic: the argmax IS the choice (M-DLC.1, #200, #236 amendment 1).
 *   • THE ORDER AND THE TIE — the to-feet candidate is scored and compared FIRST
 *     and the argmax is strict `>`, so every tie goes to the INCUMBENT. That is
 *     why a ~zero-displacement led candidate is inert BY ARITHMETIC.
 *   • THE ARMING RULE — flag + NON-ABSENT gene. Born absent ⇒ no seat ⇒ the led
 *     candidate never forms ⇒ byte-identical.
 *   • ⭐ THE ZERO-POINT, REDEFINED — the gene has NO zero-dose semantics: at 0 the
 *     candidate REALLY FORMS and competes, and the world is identical only because
 *     it degenerates onto the feet candidate and loses the tie.
 *   • ⭐⭐ THE PTP INTERACTION, FROZEN — `ptpPassLead` and `dlcDeliveryChoice` are
 *     INDEPENDENT doors; armed BOTH, the banked seam keeps precedence by arithmetic
 *     (armed-both ≡ ptp-alone), while the CONTEST is NOT the FORCED dose.
 *   • NO NEW GENE, NO NEW STRIKE STATEMENT, and the loft's `d > 24` gate and the
 *     automatic bender — slice two's and slice three's zero-points — untouched.
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

interface Arm {
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
const seatSource = readFileSync('src/ai/deliveryChoiceSeat.ts', 'utf8');

describe('DLC-T0 — the dormant DELIVERY CONTEST', () => {
  /* ---------------- HYGIENE / Road B ---------------------------------------- */

  it('HYGIENE: the flag is an explicit hard false, absent from a4World and every default', () => {
    const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
    expect(matchSrc).toContain('this.dlcDeliveryChoice = cfg.dlcDeliveryChoice ?? false;');
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    // ⭐ NARROWED, NOT DELETED, by the RA ENTRY (ruling #365; the DF-T0 §P7 form): the entry
    // layer now names the flag — as ONE of world 12's five doors and nowhere below it.
    expect((a4MatchFlags(12 as never) as Record<string, unknown>).dlcDeliveryChoice).toBe(true);
    for (const v of [3, 6, 7, 8, 9, 10, 11] as const) {
      expect(JSON.stringify(a4MatchFlags(v))).not.toContain('dlcDeliveryChoice');
    }
    void a4;
    expect(matchOf(12_426_900, {}).dlcDeliveryChoice).toBe(false);
    const league = new League({ seed: 12_426_900 });
    expect(league.createMatch(league.nextFixture()!).dlcDeliveryChoice).toBe(false);
    // no env door on any seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/deliveryChoiceSeat.ts',
      'src/ai/PlayerBrain.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/dlcDeliveryChoice|deliveryChoiceSeat|ledDelivery/.test(line)) continue;
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('NO NEW GENE: this stage adds nothing to the genome at all', () => {
    expect((GENE_KEYS as readonly string[])).not.toContain('passLeadSupport');
    expect(readFileSync('src/evolution/genome.ts', 'utf8')).not.toContain('dlc');
    const g = randomGenome(new Rng(12_426_901));
    expect(g.passLeadSupport).toBeUndefined();
    expect(JSON.stringify(g)).not.toContain('passLead');
  });

  /* ---------------- THE ARMING RULE + the identities ------------------------ */

  it('ARMING: a seat exists only when the gene is NON-ABSENT (born absent ⇒ no candidate)', () => {
    const m = matchOf(12_426_900, { dlc: true });
    const p = m.teams[0].players[3];
    const absent: TacticalGenome = { ...m.teams[0].genome };
    delete absent.passLeadSupport;
    expect(deliveryChoiceSeatOf(p, m, absent, false)).toBeNull();
    expect(deliveryChoiceSeatOf(p, m, { ...absent, passLeadSupport: 0 }, false)).not.toBeNull();
    expect(deliveryChoiceSeatOf(p, m, { ...absent, passLeadSupport: 1 }, false)).not.toBeNull();
  });

  it('G-OFF: flag ABSENT ≡ flag FALSE, both world shapes', () => {
    for (const percept of [true, false]) {
      expect(run(matchOf(12_426_900, { percept })))
        .toBe(run(matchOf(12_426_900, { dlc: false, percept })));
    }
  });

  it('G-BORN: ARMED with the gene ABSENT ≡ OFF (inert through the LIVE arming rule)', () => {
    for (const seed of [12_426_900, 12_426_901]) {
      expect(run(matchOf(seed, { dlc: true }))).toBe(run(matchOf(seed, {})));
    }
  });

  it('⭐ G-ZERO: ARMED at gene 0 ≡ OFF — the candidate FORMS, competes and loses the tie', () => {
    for (const seed of [12_426_900, 12_426_901]) {
      expect(run(matchOf(seed, { dlc: true, gene: 0 }))).toBe(run(matchOf(seed, {})));
    }
    // ⭐ NON-VACUITY: at gene 0 the led candidate really is built — a seat exists, an aim
    // object is composed — and its aim is the FEET candidate's own point, which is why
    // the strict-`>` argmax keeps the incumbent.
    const m = matchOf(12_426_902, { dlc: true, gene: 0, percept: false });
    for (let i = 0; i < 400; i++) m.step(DT);
    let formed = 0;
    let degenerate = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        const seat = deliveryChoiceSeatOf(p, m, { ...t.genome, passLeadSupport: 0 }, false);
        expect(seat).not.toBeNull();
        for (const mate of t.players) {
          if (mate === p || mate.sentOff) continue;
          const led = ledDelivery(seat!, p.pos, mate);
          formed += 1;
          if (led.aim.x === mate.pos.x && led.aim.y === mate.pos.y) degenerate += 1;
        }
      }
    }
    expect(formed).toBeGreaterThan(0);
    expect(degenerate).toBe(formed);
  });

  it('G-BITE: ARMED at the gene\'s upper corner the world DIVERGES, in both world shapes', () => {
    for (const percept of [true, false]) {
      expect(run(matchOf(12_426_902, { dlc: true, gene: 1, percept })))
        .not.toBe(run(matchOf(12_426_902, { percept })));
    }
  });

  /* ---------------- THE CONTEST ITSELF -------------------------------------- */

  it('⭐ THE ARGMAX ENTRY: the winner is priced at ITS OWN aim, and BOTH candidates win', () => {
    // The G-LOFT-BODY idiom: the winning Pass candidate's own reported openness (2 dp in
    // its `why` string) must equal the openness of the aim IT was priced at — the feet
    // point or the led point — and never the loser's. Both outcomes must occur, or there
    // is no contest. ⚠ DECLARED INTERVENTION: an instrument match.
    const m = matchOf(12_426_903, { dlc: true, gene: 1, percept: false });
    const WHY = /^to (.+) · lane (\d+\.\d\d) · open (\d+\.\d\d) · passBias/;
    let cands = 0;
    let material = 0;
    let ledWins = 0;
    let feetWins = 0;
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
      const seat = deliveryChoiceSeatOf(carrier, m, { ...t.genome, passLeadSupport: 1 }, false);
      const led = ledDelivery(seat!, carrier.pos, mate);
      const feetOpen = opennessAt(mate.pos, opp.players);
      const ledOpen = opennessAt(led.aim, opp.players);
      const at2 = (x: number): number => Math.round(x * 100) / 100;
      const reported = Number(parsed[3]);
      const matchesFeet = reported === at2(feetOpen);
      const matchesLed = reported === at2(ledOpen);
      if (!matchesFeet && !matchesLed) { violations += 1; continue; }
      if (Math.abs(ledOpen - feetOpen) > 0.05) {
        material += 1;
        if (matchesLed && !matchesFeet) ledWins += 1;
        else if (matchesFeet && !matchesLed) feetWins += 1;
      }
    }
    expect(cands).toBeGreaterThan(0);
    expect(violations).toBe(0); // every winner priced at ITS OWN aim
    expect(material).toBeGreaterThan(0); // the two readings really do diverge
    expect(ledWins).toBeGreaterThan(0); // the led ball genuinely WINS sometimes
    expect(feetWins).toBeGreaterThan(0); // and genuinely LOSES sometimes — a contest
  });

  it('THE LED CANDIDATE IS THE BANKED PROJECTION: aim = mate.pos + gene·motion·(d/18)·1.6', () => {
    const m = matchOf(12_426_904, { dlc: true, gene: 1, percept: false });
    let support = 0;
    let moved = 0;
    let still = 0;
    let i = 0;
    while (!m.finished) {
      m.step(DT);
      i += 1;
      if (i % 15 !== 0 || m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const p of t.players) {
          const seat = deliveryChoiceSeatOf(p, m, { ...t.genome, passLeadSupport: 1 }, false)!;
          for (const mate of t.players) {
            if (mate === p || mate.sentOff) continue;
            const led = ledDelivery(seat, p.pos, mate);
            // the AIM COMPOSITION has ONE owner and it is checked, not trusted
            expect(led.aim.x).toBe(mate.pos.x + led.lead.x);
            expect(led.aim.y).toBe(mate.pos.y + led.lead.y);
            if (mate.action.type !== 'SupportBallCarrier') {
              expect(led.lead.x).toBe(0);
              expect(led.lead.y).toBe(0);
              continue;
            }
            support += 1;
            const flight = dist(p.pos, mate.pos) / PTP_FLIGHT_SPEED;
            expect(led.lead.x).toBe(mate.vel.x * flight * PTP_LEAD_FLIGHT_MUL);
            expect(led.lead.y).toBe(mate.vel.y * flight * PTP_LEAD_FLIGHT_MUL);
            const speed = Math.hypot(mate.vel.x, mate.vel.y);
            // ⭐ NO PREDICATE (#200): a STILL mate's led candidate IS his feet candidate
            if (speed < 1e-9) {
              still += 1;
              expect(Math.hypot(led.lead.x, led.lead.y)).toBe(0);
            } else if (Math.hypot(led.lead.x, led.lead.y) > 1e-9) moved += 1;
          }
        }
      }
    }
    expect(support).toBeGreaterThan(0);
    expect(moved).toBeGreaterThan(0);
    expect(still + moved).toBeGreaterThan(0);
  });

  it('⭐ NO TASTE TERM (#236 amendment 1): the two calls differ in the AIM and nothing else', () => {
    expect(brainSource).toContain('const feet = groundCandidate(mate, aim, d);');
    expect(brainSource).toContain('const ledCand = groundCandidate(mate, ledBall.aim, d);');
    // ONE scoring declaration ⇒ the pricing cannot drift into two copies
    expect((brainSource.match(/const groundCandidate = \(/g) ?? []).length).toBe(1);
    const from = brainSource.indexOf('      if (dlcSeat !== null) {');
    const to = brainSource.indexOf('      // Lofted switch:', from);
    expect(from).toBeGreaterThan(0);
    expect(to).toBeGreaterThan(from);
    const branch = brainSource.slice(from, to).split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    for (const banned of ['riskTolerance', 'passBias', 'attackingWidth', 'attrs.', '*= ']) {
      expect(branch).not.toContain(banned);
    }
    const seatCode = seatSource.split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    for (const banned of ['riskTolerance', 'passBias', 'attrs.', 'traits']) {
      expect(seatCode).not.toContain(banned);
    }
  });

  /* ---------------- ⭐⭐ THE FROZEN PTP INTERACTION -------------------------- */

  it('⭐⭐ PTP KEEPS PRECEDENCE: armed BOTH ≡ ptpPassLead armed ALONE, at every gene state', () => {
    for (const gene of [null, 0, 1] as const) {
      expect(run(matchOf(12_426_905, { dlc: true, ptp: true, gene, percept: false })))
        .toBe(run(matchOf(12_426_905, { ptp: true, gene, percept: false })));
    }
  });

  it('⭐⭐ THE CONTEST IS NOT THE FORCED DOSE: dlc-alone ≠ ptp-alone at the same gene', () => {
    expect(run(matchOf(12_426_905, { dlc: true, gene: 1, percept: false })))
      .not.toBe(run(matchOf(12_426_905, { ptp: true, gene: 1, percept: false })));
  });

  /* ---------------- ⭐ G-EPI-MOTION (re-gated through THIS path) ------------- */

  it('⭐ G-EPI-MOTION: the percept world\'s led candidate reads REMEMBERED motion', () => {
    const m = matchOf(12_426_906, { dlc: true, gene: 1 });
    for (let i = 0; i < 600; i++) m.step(DT);
    const pairs: { carrier: Player; mate: Player; before: { x: number; y: number } }[] = [];
    for (let guard = 0; guard < 4000 && pairs.length < 3 && !m.finished; guard++) {
      m.step(DT);
      pairs.length = 0;
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        for (const carrier of t.players) {
          if (carrier.sentOff || carrier.role === 'GK') continue;
          const seat = deliveryChoiceSeatOf(
            carrier, m, { ...t.genome, passLeadSupport: 1 }, true,
          );
          if (seat === null) continue;
          for (const mate of t.players) {
            if (mate === carrier || mate.sentOff) continue;
            if (mate.action.type !== 'SupportBallCarrier') continue;
            const led = ledDelivery(seat, carrier.pos, mate);
            if (led.lead.x === 0 && led.lead.y === 0) continue;
            pairs.push({ carrier, mate, before: { x: led.lead.x, y: led.lead.y } });
          }
        }
      }
    }
    expect(pairs.length).toBeGreaterThan(0);
    // rewrite every TRUTH velocity in place WITHOUT stepping: no scan moment is recorded,
    // positions are untouched, so only the motion source can move a candidate
    for (const p of m.allPlayers) { p.vel.x = 7.5; p.vel.y = -6.25; }
    for (const pair of pairs) {
      const t = m.teams[pair.carrier.side];
      const seat = deliveryChoiceSeatOf(
        pair.carrier, m, { ...t.genome, passLeadSupport: 1 }, true,
      )!;
      const now = ledDelivery(seat, pair.carrier.pos, pair.mate).lead;
      const flight = dist(pair.carrier.pos, pair.mate.pos) / PTP_FLIGHT_SPEED;
      expect(now.x).toBe(pair.before.x); // he reads HIS OWN EYES
      expect(now.y).toBe(pair.before.y);
      expect(now.x).not.toBe(7.5 * flight * PTP_LEAD_FLIGHT_MUL); // never the truth
    }
    // the source pin: the contest module names ONE member of `match`
    const code = seatSource.split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    const members = [...new Set([...code.matchAll(/\bmatch\.(\w+)/g)].map((mm) => mm[1]))];
    expect(members).toEqual([]); // it names none itself — it hands `match` to the banked seat
    for (const banned of ['allPlayers', 'perceptionTruth', 'match.teams', 'match.ball']) {
      expect(code).not.toContain(banned);
    }
  });

  /* ---------------- RNG / the read-fork inventory / the untouched ----------- */

  it('G-RNG: an armed, dosed contest draws ZERO rng', () => {
    const m = matchOf(12_426_902, { dlc: true, gene: 1 });
    for (let i = 0; i < 400; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    let calls = 0;
    for (const t of m.teams) {
      for (const p of t.players) {
        const seat = deliveryChoiceSeatOf(p, m, { ...t.genome, passLeadSupport: 1 }, true);
        if (seat === null) continue;
        for (const mate of t.players) {
          if (mate === p || mate.sentOff) continue;
          ledDelivery(seat, p.pos, mate);
          calls += 1;
        }
      }
    }
    expect(calls).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  it('G-FORK: EXACTLY ONE `match.dlcDeliveryChoice` fork in src/**', () => {
    let forks = 0;
    for (const f of srcFiles('src')) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        const t = line.trim();
        if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) continue;
        if (!/match\.dlcDeliveryChoice/.test(t)) continue;
        forks += 1;
        expect(f).toBe('src/ai/PlayerBrain.ts');
        expect(t).toBe(
          'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;',
        );
      }
    }
    expect(forks).toBe(1);
  });

  it('ZERO NEW STRIKE STATEMENTS: the winner rides the BANKED led strike', () => {
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
    // ⭐ slice two's zero-point: the loft's own hand gate is a SHIPPED INCUMBENT
    expect(brainSource).toContain('if (d > 24 && !layingOff) {');
    // ⭐ slice three's zero-point: the bender stays an AUTOMATIC rule
    expect(readFileSync('src/sim/mechanics.ts', 'utf8')).toContain(
      'bentKick(match, passer, dir, speed, groundBend(passer, lead, oppPlayers, d), d);',
    );
    // the through-ball block never sees this seam
    const throughBlock = brainSource.slice(
      brainSource.indexOf('// --- Through ball:'), brainSource.indexOf('// --- Cross (Phase 28)'),
    );
    expect(throughBlock).not.toContain('dlc');
    expect(throughBlock).not.toContain('ledDelivery');
  });

  it('the flag-off world never hands a lead to the strike, even with the gene dosed', () => {
    const m = matchOf(12_426_902, { gene: 1, percept: false });
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

  it('G-PINS: the PTP fork line that shaped the interaction is UNTOUCHED, in src and in its test', () => {
    const FORK =
      'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
    expect(brainSource).toContain(FORK);
    expect(readFileSync('tests/ptpPassLead.test.ts', 'utf8')).toContain(`'${FORK}',`);
  });
});
