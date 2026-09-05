import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT, HALF_L } from '../src/sim/constants';
import { PTP_FLIGHT_SPEED } from '../src/ai/passLeadSeat';
import {
  DV_CLEAR_RADIUS, DV_CORRIDOR_SCALE, DV_FLIGHT_SPEED, DV_THIRD_BOUNDARY_LOCAL_X, DV_ZONES,
  deliveryRiskPrice, deliveryValueSeatOf, flightExposure, receptionZoneIndex,
} from '../src/ai/deliveryValueSeat';
import {
  DV_BELIEF_SLOTS, GENE_KEYS, crossoverGenomes, dvExposureWeightOf, dvLossBeliefVector,
  mutateGenome, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { laneOpenness } from '../src/ai/perception';
import { a4MatchFlags } from '../src/game/a4World';
import { closestPointOnSegment, dist } from '../src/utils/vec';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * DV-T0 (docs/world-model/DV-T0-DORMANT-SEAM.md; contract
 * docs/world-model/DELIVERY-VALUE-CONTRACT.md §2 M-DV.1/M-DV.2 as amended by ruling
 * #247/M-DV.3; rulings #245/#246/#247/#248/#249) — the DORMANT RISK-PRICING SEAM
 * (出球价值). The pins:
 *   • THE FLIGHT EXPOSURE — a continuous hazard over the ball's own travel, the corridor
 *     read MADE TIME-AWARE: `laneOpenness`'s own geometry, scale and near-field guard,
 *     with each opponent's own closing capability over the flight subtracted from the
 *     metres he still lacks. It DEGENERATES onto today's corridor read at zero closing
 *     speed — which is what makes it a sharpening and not a new sense.
 *   • ⭐⭐ THE TRUTH/BELIEF SPLIT (#247) — the DV-C0 census's TRUE table is
 *     INSTRUMENT-side: `src/**` references neither its artifact nor any of its values.
 *     What a player owns is a BELIEF: three per-zone weights BORN ABSENT, earned only by
 *     evolving. The census's ZONING is imported (re-derived from `HALF_L`); its ANSWERS
 *     are not.
 *   • ⭐ ONE PRICER, EVERY SEAM — the risk price is the last statement of the ONE hoisted
 *     `groundCandidate`, so to-feet, led and strike-plane candidates are priced by the
 *     SAME risk law, downstream of which delivery seam formed them.
 *   • THE ZERO-POINT — genes absent ⇒ no seat ⇒ the shipped statements alone; genes
 *     present at ZERO ⇒ the subtraction is exactly `−(+0)` and the world is byte-identical
 *     with the code path LIVE.
 *   • NO PREDICATE (#200), no new channel (the seat module cannot even name `Match`).
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
  dv?: boolean;
  /** null / undefined ⇒ BORN ABSENT (no key written at all). */
  exposure?: number | null;
  belief?: readonly number[] | null;
  /** The neighbours' banked doors + their shared gene, for the two-doors rows. */
  sp?: boolean;
  dlc?: boolean;
  ptp?: boolean;
  lead?: number | null;
  percept?: boolean;
}
const matchOf = (seed: number, arm: Arm = {}): Match => {
  const percept = arm.percept ?? true;
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
    ...(percept ? { edsPerceivedDefence: true, edsPerceivedChoice: true } : {}),
    ...(arm.dv === undefined ? {} : { dvDeliveryValue: arm.dv }),
    ...(arm.sp === undefined ? {} : { dlcStrikePlane: arm.sp }),
    ...(arm.dlc === undefined ? {} : { dlcDeliveryChoice: arm.dlc }),
    ...(arm.ptp === undefined ? {} : { ptpPassLead: arm.ptp }),
  });
  // THE ARMING CHECKLIST (#196.3-D6): all three genome views of BOTH teams.
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (arm.exposure !== undefined && arm.exposure !== null) g.dvExposureWeight = arm.exposure;
      if (arm.belief !== undefined && arm.belief !== null) g.dvLossBelief = [...arm.belief];
      if (arm.lead !== undefined && arm.lead !== null) g.passLeadSupport = arm.lead;
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
const seatSource = readFileSync('src/ai/deliveryValueSeat.ts', 'utf8');
const perceptionSource = readFileSync('src/ai/perception.ts', 'utf8');

/** A frozen body-shaped stub: exactly what `flightExposure` reads and nothing more. */
const body = (x: number, y: number, topSpeed: number, sentOff = false): {
  pos: { x: number; y: number }; topSpeed: number; sentOff: boolean;
} => ({ pos: { x, y }, topSpeed, sentOff });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const exposureOf = (from: { x: number; y: number }, aim: { x: number; y: number }, os: any[]) =>
  flightExposure(from, aim, os);

describe('DV-T0 — the dormant RISK-PRICING seam', () => {
  /* ---------------- HYGIENE / Road B ---------------------------------------- */

  it('HYGIENE: the flag is an explicit hard false, absent from a4World and every default', () => {
    const matchSrc = readFileSync('src/sim/Match.ts', 'utf8');
    expect(matchSrc).toContain('this.dvDeliveryValue = cfg.dvDeliveryValue ?? false;');
    const a4 = readFileSync('src/game/a4World.ts', 'utf8');
    expect(a4).not.toContain('dvDeliveryValue');
    // ⭐ #337 item 5: the ENTRY now names `dvExposureWeight` — world 11 pins the born-absent
    // gene at BK-T4's rung 0.5 for the CORRIDOR price (`bkCorridorPrice`), which reads the same
    // gene. THIS seam's flag is still absent, so the pin is made POSITIVE rather than dropped:
    // the entry may name the gene EXACTLY TWICE in non-comment code (the match-local write and
    // the armed-version read) and must name no seat of this seam at all.
    const a4Code = a4.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect((a4Code.match(/dvExposureWeight/g) ?? []).length).toBe(2);
    expect(a4Code).toContain('const view = { ...team.baseGenome, dvExposureWeight: weight }');
    expect(a4).not.toContain('deliveryValueSeatOf');
    expect(a4).not.toContain('dvExposureWeightOf');
    expect(a4).not.toContain('dvLossBelief');
    expect(JSON.stringify(a4MatchFlags(3))).not.toContain('dvDeliveryValue');
    expect(matchOf(12_430_900, {}).dvDeliveryValue).toBe(false);
    const league = new League({ seed: 12_430_900 });
    expect(league.createMatch(league.nextFixture()!).dvDeliveryValue).toBe(false);
    // no env door anywhere on a seam line
    for (const f of [
      'src/sim/Match.ts', 'src/sim/League.ts', 'src/ai/deliveryValueSeat.ts',
      'src/ai/PlayerBrain.ts', 'src/evolution/genome.ts',
    ]) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        if (!/dvDeliveryValue|dvExposureWeight|dvLossBelief|deliveryValueSeat|DV_/.test(line)) {
          continue;
        }
        expect(line).not.toMatch(/envArmed|EDS_BUNDLE_ARMED|process\.env/);
      }
    }
  });

  it('BORN ABSENT: both genes are outside GENE_KEYS and never serialized', () => {
    expect((GENE_KEYS as readonly string[])).not.toContain('dvExposureWeight');
    expect((GENE_KEYS as readonly string[])).not.toContain('dvLossBelief');
    const g = randomGenome(new Rng(12_430_901));
    expect(g.dvExposureWeight).toBeUndefined();
    expect(g.dvLossBelief).toBeUndefined();
    expect(JSON.stringify(g)).not.toContain('dv');
    expect(dvExposureWeightOf(g)).toBe(0);
    expect(dvLossBeliefVector(g)).toEqual([0, 0, 0]);
    // and with NOTHING present there is no seat at all — the born-absent identity is
    // STRUCTURAL, not arithmetic
    expect(deliveryValueSeatOf(g)).toBeNull();
  });

  it('the gene maps clamp to [0,1] and degrade absent / short / non-finite to 0', () => {
    expect(dvExposureWeightOf({ dvExposureWeight: 0.4 } as TacticalGenome)).toBe(0.4);
    expect(dvExposureWeightOf({ dvExposureWeight: 5 } as TacticalGenome)).toBe(1);
    expect(dvExposureWeightOf({ dvExposureWeight: -3 } as TacticalGenome)).toBe(0);
    expect(dvExposureWeightOf({ dvExposureWeight: NaN } as TacticalGenome)).toBe(0);
    expect(DV_BELIEF_SLOTS).toBe(3);
    expect(DV_ZONES).toEqual(['own', 'middle', 'final']);
    expect(dvLossBeliefVector({ dvLossBelief: [0.5] } as TacticalGenome)).toEqual([0.5, 0, 0]);
    expect(dvLossBeliefVector({ dvLossBelief: [2, -1, NaN] } as TacticalGenome))
      .toEqual([1, 0, 0]);
    expect(dvLossBeliefVector({ dvLossBelief: [0.1, 0.2, 0.3, 0.9] } as TacticalGenome))
      .toEqual([0.1, 0.2, 0.3]);
    // ONE present gene is enough to arm the seat (the arming rule, in one place)
    expect(deliveryValueSeatOf({ dvExposureWeight: 0 } as TacticalGenome)).not.toBeNull();
    expect(deliveryValueSeatOf({ dvLossBelief: [0, 0, 0] } as TacticalGenome)).not.toBeNull();
  });

  /* ---------------- G-TRACE: every constant, back to its source line --------- */

  it('⭐ G-TRACE: all four constants match the lines they were taken from, VERBATIM', () => {
    // the flight speed is not even re-typed: it IS the banked PTP-T0 symbol
    expect(DV_FLIGHT_SPEED).toBe(PTP_FLIGHT_SPEED);
    expect(DV_FLIGHT_SPEED).toBe(18);
    expect(brainSource).toContain('const flight = dist(p.pos, mate.pos) / 18;');
    expect(seatSource).toContain("import { PTP_FLIGHT_SPEED } from './passLeadSeat';");
    // the corridor scale and the near-field guard are laneOpenness's own, verbatim
    expect(DV_CORRIDOR_SCALE).toBe(4);
    expect(perceptionSource).toContain('worst = Math.min(worst, clamp01(d / 4));');
    expect(DV_CLEAR_RADIUS).toBe(1.5);
    expect(perceptionSource).toContain('if (dist(cp, from) < 1.5) continue;');
    // the zoning is RE-DERIVED from the pitch, never typed
    expect(DV_THIRD_BOUNDARY_LOCAL_X).toBe(HALF_L / 3);
    expect(seatSource).toContain('export const DV_THIRD_BOUNDARY_LOCAL_X = HALF_L / 3;');
  });

  /* ---------------- ⭐⭐ G-NOTABLE: the #247 split, held by grep ------------- */

  it('⭐⭐ G-NOTABLE: no src file names the census artifact or ANY of its values', () => {
    const table = JSON.parse(
      readFileSync('docs/world-model/data/dv-c0-loss-cost.json', 'utf8'),
    ) as { result: { census: { yardstick: { zones: Record<string, { hazard: number }> } } } };
    const zones = table.result.census.yardstick.zones;
    const hazards = Object.values(zones).map((z) => z.hazard);
    expect(hazards.length).toBe(3);
    for (const f of srcFiles('src')) {
      const text = readFileSync(f, 'utf8');
      expect(text).not.toContain('dv-c0-loss-cost');
      expect(text).not.toContain('truth-table');
      for (const h of hazards) {
        // the value in every plausible written form
        expect(text).not.toContain(String(h));
        expect(text).not.toContain(String(h * 100));
      }
    }
    // and NO DV seam file can even reach a data file — no loader, no path, no import.
    // ⚠ Deliberately scoped to THIS seam: `src/game/a4World.ts` does import committed
    // census tables for the A4 play-test worlds, which is precisely the kind of wiring
    // #248's earned-knowledge ledger records as standing debt elsewhere. DV-T0 does not
    // widen that, and this gate proves DV does not join it.
    for (const f of [
      'src/ai/deliveryValueSeat.ts', 'src/evolution/genome.ts', 'src/ai/PlayerBrain.ts',
    ]) {
      const code = readFileSync(f, 'utf8').split('\n').filter((l) => {
        const t = l.trim();
        return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
      }).join('\n');
      expect(code).not.toContain('readFileSync');
      expect(code).not.toContain('docs/');
    }
  });

  /* ---------------- ⭐ THE FLIGHT-EXPOSURE LAW ------------------------------ */

  it('⭐ EXPOSURE DEGENERATES onto today\'s corridor read when nobody can close', () => {
    const from = { x: -10, y: 0 };
    const aim = { x: 10, y: 0 };
    for (const off of [0, 0.5, 1, 2, 3, 3.9, 4, 6]) {
      const os = [body(0, off, 0)];
      const e = exposureOf(from, aim, os);
      // laneOpenness's own per-body term is clamp01(d/4); exposure is its complement
      const cp = closestPointOnSegment(from, aim, os[0].pos);
      expect(dist(cp, from)).toBeGreaterThanOrEqual(DV_CLEAR_RADIUS);
      expect(e).toBe(1 - Math.min(1, Math.max(0, dist(cp, os[0].pos) / DV_CORRIDOR_SCALE)));
      // and the whole-lane reading agrees with the shipped corridor read's complement
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(e).toBe(1 - laneOpenness(from, aim, os as any));
    }
  });

  it('⭐ EXPOSURE is CONTINUOUS, in [0,1], and MONOTONE in closing capability', () => {
    const from = { x: -10, y: 0 };
    const aim = { x: 10, y: 0 };
    let prev = -1;
    for (const speed of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
      const e = exposureOf(from, aim, [body(0, 6, speed)]);
      expect(e).toBeGreaterThanOrEqual(0);
      expect(e).toBeLessThanOrEqual(1);
      expect(e).toBeGreaterThanOrEqual(prev); // faster body ⇒ never less exposed
      prev = e;
    }
    expect(prev).toBeGreaterThan(0); // a quick body genuinely reaches this lane
    // a longer flight gives the SAME body more time — the whole point of the limb
    const near = exposureOf({ x: -2, y: 0 }, { x: 2, y: 0 }, [body(0, 6, 7)]);
    const far = exposureOf({ x: -20, y: 0 }, { x: 20, y: 0 }, [body(0, 6, 7)]);
    expect(far).toBeGreaterThan(near);
    // no opponents ⇒ exactly zero
    expect(exposureOf(from, aim, [])).toBe(0);
    // a sent-off body and a body at the passer's feet are both skipped (the inherited
    // GUARDS — laneOpenness's own, not this stage's)
    expect(exposureOf(from, aim, [body(0, 0, 8, true)])).toBe(0);
    expect(exposureOf(from, aim, [body(-10, 0, 8)])).toBe(0);
  });

  it('⭐ EXPOSURE is a MAX over bodies — the corridor family\'s own aggregation', () => {
    const from = { x: -10, y: 0 };
    const aim = { x: 10, y: 0 };
    const a = body(-4, 5, 2);
    const b = body(4, 3, 5);
    const ea = exposureOf(from, aim, [a]);
    const eb = exposureOf(from, aim, [b]);
    expect(exposureOf(from, aim, [a, b])).toBe(Math.max(ea, eb));
    expect(exposureOf(from, aim, [b, a])).toBe(Math.max(ea, eb)); // order-independent
  });

  /* ---------------- THE ZONE SELECTOR + THE COMPOSITION --------------------- */

  it('the zone SELECTOR is the census\'s frozen zoning, re-derived from the pitch', () => {
    const b = HALF_L / 3;
    expect(receptionZoneIndex(-b - 0.001)).toBe(0); // own third
    expect(receptionZoneIndex(-b)).toBe(1); // the boundary itself is MIDDLE (census: `<`)
    expect(receptionZoneIndex(0)).toBe(1);
    expect(receptionZoneIndex(b)).toBe(1); // and again (census: `>`)
    expect(receptionZoneIndex(b + 0.001)).toBe(2); // final third
    expect(DV_ZONES[0]).toBe('own');
    expect(DV_ZONES[2]).toBe('final');
  });

  it('⭐ THE COMPOSITION is exactly `w·exposure + belief[zone]·scale`, and nothing else', () => {
    const seat = deliveryValueSeatOf(
      { dvExposureWeight: 0.6, dvLossBelief: [0.9, 0.5, 0.1] } as TacticalGenome,
    )!;
    const from = { x: -10, y: 0 };
    const aim = { x: 10, y: 0 };
    const os = [body(0, 3, 5)];
    const e = exposureOf(from, aim, os);
    for (const [localX, zone] of [[-HALF_L / 2, 0], [0, 1], [HALF_L / 2, 2]] as const) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const price = deliveryRiskPrice(seat, from, aim, os as any, localX, 0.2);
      expect(price).toBe(0.6 * e + seat.belief[zone] * 0.2);
    }
  });

  it('⭐ THE ZERO-POINT is IEEE-EXACT: all-zero genes ⇒ the price is exactly +0', () => {
    const seat = deliveryValueSeatOf(
      { dvExposureWeight: 0, dvLossBelief: [0, 0, 0] } as TacticalGenome,
    )!;
    const os = [body(0, 1, 8), body(2, 0.2, 7)];
    for (const localX of [-30, -10, 0, 10, 30]) {
      const price = deliveryRiskPrice(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        seat, { x: -10, y: 0 }, { x: 10, y: 0 }, os as any, localX, 0.2,
      );
      expect(Object.is(price, 0)).toBe(true); // exactly +0, not merely ≈ 0
      for (const s of [0, 0.37, 1.25, -0.5]) expect(s - price).toBe(s);
    }
  });

  /* ---------------- THE READ-FORK INVENTORY + the pricer -------------------- */

  it('G-FORK: EXACTLY ONE `match.dvDeliveryValue` fork in src/**', () => {
    let forks = 0;
    for (const f of srcFiles('src')) {
      for (const line of readFileSync(f, 'utf8').split('\n')) {
        const t = line.trim();
        if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) continue;
        if (!/match\.dvDeliveryValue/.test(t)) continue;
        forks += 1;
        expect(f).toBe('src/ai/PlayerBrain.ts');
        expect(t).toBe('const dvSeat = match.dvDeliveryValue ? deliveryValueSeatOf(g) : null;');
      }
    }
    expect(forks).toBe(1);
  });

  it('⭐ ONE PRICER: the risk price is the last statement of the ONE `groundCandidate`', () => {
    expect((brainSource.match(/const groundCandidate = \(/g) ?? []).length).toBe(1);
    expect(brainSource).toContain(
      '        : s - deliveryRiskPrice(dvSeat, p.pos, aim, opp.players, team.localX(aim.x), W.passBase);',
    );
    // ⭐ NARROWED, NOT DELETED, by GC-T0 (ruling #343 item 4 orders a SECOND and LAST
    // subtraction beside this one — `s″ = s′ − wExposure · groundShellHazard` — so the
    // pricer no longer RETURNS `sDv`; it returns the value formed FROM `sDv`. The DF-T0
    // §P7 precedent, ratified at #323 item 1: narrow, never delete, and state it
    // POSITIVELY. DV-T0's substantive claim is unweakened — `sDv` is still formed from
    // `s` by exactly ONE `deliveryRiskPrice` call (pinned below) and is still the value
    // the rest of the pricer consumes, so the risk price cannot drift into a per-seam
    // copy nor be applied twice. Ratified precedent re-applied by RA-T0 (ruling #360
    // item 3 orders a THIRD and LAST subtraction — `s‴ = s″ − weight · deficit ·
    // passBase` — so the return value is now formed from `sGc`; the chain `s → sDv →
    // sGc → sRa` is pinned link by link and each seam's own suite pins its own limb).
    // ⚠ FLAGGED FOR COMMANDER RATIFICATION (the GC-T0 §DEV 1 form; ruling #361).
    // ⭐ NARROWED AGAIN, NOT DELETED, by LN-T0 (ruling #393 item 5(iii)(a) orders a FOURTH
    // subtraction between `sGc` and `sRa` — `s⁗ = s″ − w · (1 − ownLaneOpenness)` — so the
    // `sRa` link now reads `sLn`. The chain is `s → sDv → sGc → sLn → sRa`, still pinned
    // link by link here, and each seam's own suite pins its own limb. DV-T0's substantive
    // claim is untouched: `sDv` is still formed from `s` by exactly ONE `deliveryRiskPrice`
    // call and is still the value the rest of the pricer consumes.
    expect(brainSource).toContain('      const sDv = dvSeat === null ? s\n');
    expect(brainSource).toContain('      const sGc = gcSeat === null ? sDv\n');
    expect(brainSource).toContain('      const sLn = lnSeat === null ? sGc\n');
    expect(brainSource).toContain('      const sRa = raSeat === null ? sLn\n');
    expect(brainSource).toContain('      return { s: sRa, lane, open, gain, mul };');
    // exactly ONE risk-price call site ⇒ it cannot drift into a per-seam copy
    expect((brainSource.match(/deliveryRiskPrice\(/g) ?? []).length).toBe(1);
    // the three banked candidate call sites are UNTOUCHED and all reach the same pricer
    expect(brainSource).toContain('const feet = groundCandidate(mate, aim, d);');
    expect(brainSource).toContain('const ledCand = groundCandidate(mate, ledBall.aim, d);');
    expect(brainSource).toContain('const planeCand = groundCandidate(mate, strike.aim, d);');
    // NO TASTE TERM: the added statement names no gene, no attribute, no multiplier
    const from = brainSource.indexOf('      // DV T0 §SEAM — THE RISK PRICE');
    const to = brainSource.indexOf('    for (const mate of team.players) {', from);
    expect(from).toBeGreaterThan(0);
    const added = brainSource.slice(from, to).split('\n')
      .filter((l) => !l.trim().startsWith('//')).join('\n');
    for (const banned of ['riskTolerance', 'passBias', 'attackingWidth', 'attrs.', '*= ']) {
      expect(added).not.toContain(banned);
    }
  });

  it('⭐ G-EPI: the seat module cannot reach the world — it never names `Match`', () => {
    // the EXECUTABLE source (comments stripped, the banked seams' own convention)
    const code = seatSource.split('\n').filter((l) => {
      const t = l.trim();
      return !t.startsWith('*') && !t.startsWith('//') && !t.startsWith('/*');
    }).join('\n');
    expect(code).not.toContain('Match');
    expect(code).not.toContain('perceivedSnapshot');
    expect(code).not.toContain('match.');
    // no import of the world at all — the channel is closed at the import list, not by
    // a convention a later edit could quietly break
    expect(seatSource).not.toContain("from '../sim/Match'");
    // its position source is the caller's own `opp.players` — the SAME array the shipped
    // corridor read is called with, one statement earlier
    expect(brainSource).toContain('laneOpenness(p.pos, aim, opp.players)');
    expect(brainSource).toContain('deliveryRiskPrice(dvSeat, p.pos, aim, opp.players,');
    // no predicate, no threshold vocabulary in the seat's executable source
    for (const banned of ['riskTolerance', 'passBias', 'attrs.', 'traits', 'Math.random']) {
      expect(code).not.toContain(banned);
    }
  });

  it('G-PINS: the banked seams\' fork lines and strike statements are UNTOUCHED', () => {
    const PTP =
      'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
    const DLC =
      'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
    const SP =
      'const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
    for (const line of [PTP, DLC, SP]) expect(brainSource).toContain(line);
    // ZERO new strike statements — the pinned three stand
    expect((brainSource.match(/match\.performPass\(/g) ?? []).length).toBe(3);
    expect(brainSource).toContain(
      'match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));',
    );
    // and the strike-plane precedence guard is untouched by this stage
    expect(brainSource).toContain(
      '      if (spSeat !== null && dlcSeat === null && ptpSeat === null) {',
    );
  });

  /* ---------------- THE IDENTITY STACK, on whole matches -------------------- */

  it('G-OFF: the flag ABSENT is byte-identical to the flag FALSE', () => {
    for (const seed of [12_430_902, 12_430_903]) {
      for (const percept of [true, false]) {
        expect(run(matchOf(seed, { percept })))
          .toBe(run(matchOf(seed, { dv: false, percept })));
      }
    }
  });

  it('G-BORN: ARMED with both genes ABSENT is byte-identical to OFF', () => {
    for (const seed of [12_430_902, 12_430_903]) {
      for (const percept of [true, false]) {
        expect(run(matchOf(seed, { dv: true, percept })))
          .toBe(run(matchOf(seed, { percept })));
      }
    }
  });

  it('⭐ G-ZERO: ARMED with the genes PRESENT AT ZERO is byte-identical to OFF', () => {
    for (const seed of [12_430_902, 12_430_903]) {
      for (const percept of [true, false]) {
        const armedZero = matchOf(seed, {
          dv: true, exposure: 0, belief: [0, 0, 0], percept,
        });
        // the code path is LIVE (a seat exists on every genome view) and yet the world
        // is the shipped one, byte for byte
        expect(deliveryValueSeatOf(armedZero.teams[0].effGenome)).not.toBeNull();
        expect(run(armedZero)).toBe(run(matchOf(seed, { percept })));
      }
    }
  });

  it('⭐ G-BITE: dosed weights genuinely REPRICE — the world diverges, both limbs', () => {
    for (const seed of [12_430_902, 12_430_903]) {
      const off = run(matchOf(seed, {}));
      // the exposure limb alone
      expect(run(matchOf(seed, { dv: true, exposure: 1 }))).not.toBe(off);
      // the belief limb alone, and it must be the ZONE GRADIENT that bites (a flat
      // belief shifts every candidate by the same constant, so it can still move the
      // world only through the pass-vs-other-action comparison — both are real, and
      // the gradient row is the one that proves the zoning is wired)
      expect(run(matchOf(seed, { dv: true, belief: [1, 0.5, 0] }))).not.toBe(off);
      // both together
      expect(run(matchOf(seed, { dv: true, exposure: 0.8, belief: [0.9, 0.4, 0.05] })))
        .not.toBe(off);
    }
  });

  it('⭐ G-BITE (corner read): a dosed belief DIVERGES the armed world (retitled of record #250.3 — whole-run divergence, not a mate flip)', () => {
    // the SAME fixture run with and without a doped own-third belief must resolve
    // differently at least once over a match. #250.3: this measures WHOLE-RUN signature
    // divergence only — WHICH decision moved is not measured here; the independent
    // counterfactual found 0/64 target flips at these doses (suppression instead, H-250a)
    // — see DV-T0-DORMANT-SEAM.md §RESULT gBite.
    let flips = 0;
    for (const seed of [12_430_904, 12_430_905]) {
      const plain = matchOf(seed, { dv: true, exposure: 0, belief: [0, 0, 0] });
      const doped = matchOf(seed, { dv: true, exposure: 0, belief: [1, 0, 0] });
      while (!plain.finished) plain.step(DT);
      while (!doped.finished) doped.step(DT);
      if (signature(plain) !== signature(doped)) flips += 1;
    }
    expect(flips).toBe(2); // the zone weight reprices, on every seed
  });

  it('⭐ G-CROSS (two doors): DV armed with the neighbours\' gene dosed ≡ ALL OFF', () => {
    const seed = 12_430_906;
    const allOff = run(matchOf(seed, {}));
    // DV's own genes ABSENT, every neighbour bank dosed and its door SHUT ⇒ all-off
    expect(run(matchOf(seed, { dv: true, lead: 0.7 }))).toBe(allOff);
    // each neighbour armed ALONE is unmoved by this door at every DV gene state
    for (const nb of [{ ptp: true }, { dlc: true }, { sp: true }] as const) {
      const alone = run(matchOf(seed, { ...nb, lead: 0.7 }));
      expect(run(matchOf(seed, { ...nb, lead: 0.7, dv: true }))).toBe(alone); // DV absent
      expect(run(matchOf(seed, {
        ...nb, lead: 0.7, dv: true, exposure: 0, belief: [0, 0, 0],
      }))).toBe(alone); // DV present at zero
      // and DISCRIMINATION: dosed DV is NOT any of them
      expect(run(matchOf(seed, { ...nb, lead: 0.7, dv: true, exposure: 1 })))
        .not.toBe(alone);
    }
  });

  /* ---------------- G-RNG: the seam draws nothing --------------------------- */

  it('G-RNG: an armed, dosed risk price draws ZERO rng', () => {
    const m = matchOf(12_430_906, { dv: true, exposure: 1, belief: [1, 0.5, 0.1] });
    for (let i = 0; i < 300; i++) m.step(DT);
    const before = (m.rng as unknown as { s: number }).s;
    const seat = deliveryValueSeatOf(m.teams[0].effGenome)!;
    let priced = 0;
    for (const p of m.allPlayers) {
      for (const o of m.teams[1].players) {
        deliveryRiskPrice(
          seat, p.pos, o.pos, m.teams[1].players, m.teams[0].localX(o.pos.x), 0.2,
        );
        priced += 1;
      }
    }
    expect(priced).toBeGreaterThan(0);
    expect((m.rng as unknown as { s: number }).s).toBe(before);
  });

  it('G-RNG (genome): with the opt-in OFF the mutate/crossover streams are UNMOVED', () => {
    const streamOf = (evolve: boolean): { genomes: string; state: number } => {
      const rng = new Rng(12_430_907);
      let a = randomGenome(new Rng(1));
      let b = randomGenome(new Rng(2));
      for (let i = 0; i < 8; i++) {
        const child = crossoverGenomes(
          a, b, rng, false, false, false, false, false, false, false, evolve,
        );
        a = mutateGenome(child, rng, { rate: 0.5, scale: 0.15, evolveDeliveryValue: evolve });
        b = mutateGenome(b, rng, { rate: 0.5, scale: 0.15 });
      }
      return {
        genomes: JSON.stringify([a, b]),
        state: (rng as unknown as { s: number }).s,
      };
    };
    const off = streamOf(false);
    // the opt-in OFF path never names the genes at all
    expect(off.genomes).not.toContain('dv');
    const on = streamOf(true);
    expect(on.state).not.toBe(off.state); // the opt-in DOES draw when asked
    expect(on.genomes).toContain('dvExposureWeight');
    expect(on.genomes).toContain('dvLossBelief');
    // the belief vector always materialises at its frozen width
    const parsed = JSON.parse(on.genomes) as TacticalGenome[];
    expect(parsed[0].dvLossBelief!.length).toBe(DV_BELIEF_SLOTS);
    // crossover COPIES parent A's belief rather than aliasing it (the OBM-T0 catch)
    const pa = { dvLossBelief: [0.2, 0.3, 0.4] } as TacticalGenome;
    const child = crossoverGenomes(pa, randomGenome(new Rng(3)), new Rng(4));
    expect(child.dvLossBelief).toEqual([0.2, 0.3, 0.4]);
    expect(child.dvLossBelief).not.toBe(pa.dvLossBelief);
  });
});
