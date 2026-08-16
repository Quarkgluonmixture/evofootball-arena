import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { DT, PASS_POWER_MAX, PASS_POWER_MIN } from '../src/sim/constants';
import { choosePassWeight } from '../src/ai/passWeightChooser';
import {
  choosePerceivedPassTarget, passChoiceCandidateGids, pricePassOption,
} from '../src/ai/perceivedPassChoice';
import { kickMisalignment, orientationPowerMul } from '../src/sim/mechanics';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags, armA4World, poolT1DoseCells } from '../src/game/a4World';
import { League } from '../src/sim/League';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import { readFileSync } from 'node:fs';

/**
 * PW-T0c (docs/world-model/PW-T0C-OBJECTIVE-FIDELITY.md; contract PW-PASSWEIGHT-CONTRACT.md §2
 * M-PW.2/M-PW.4; ruling #293.3) — THE RUNG-GRAIN WEIGHT CHOOSER'S PERMANENT PIN SUITE, in the
 * house form (`carryChoiceSeat.test.ts`). The verify MED-3 said the whole PW-T0b proof was a
 * one-shot frozen probe; this file is the part that must keep being true. The pins:
 *   • ⭐⭐ OBJECTIVE FIDELITY — collapse the ladder to {1} and the chooser IS the shipped
 *     chooser: same objective (`pricePassOption` under the world's own flags), same candidate
 *     set, same tie-break ⇒ the same man, and a world that is BYTE-IDENTICAL to the door-shut
 *     one. THE KEY PIN: with the full ladder, a mate switch is therefore attributable to a RUNG.
 *   • ⭐⭐ ROAD B DORMANCY — flag absent ≡ flag false, byte for byte, in both world shapes.
 *   • ⭐ THE THREADING — deposit → consume → arm-time capture → wind-up re-deposit, and the
 *     CLOSED choice ledger (deposited = struck + voided + abandoned + in flight): no silent loss.
 *   • ⭐ PER-RUNG ADMISSION through the shipped oracle, and NO refusal inheritance.
 *   • ⭐ PTP × PW is an unsupported composition and the engine refuses to build it (#293.3 (d)).
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
const SEED_A = 12_493_500;
const SEED_B = 12_493_501;
const SEED_C = 12_493_502;
const V7 = 7 as const;
const DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>);

interface Arm {
  /** arm the weight chooser's door */
  pw?: boolean;
  /** hand the chooser a collapsed (or otherwise overridden) ladder */
  ladder?: readonly number[];
  /** the v7 exam world (armed E3 chooser + armed value axis) rather than a bare match */
  armed?: boolean;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const cfg = {
    seed,
    teamA,
    teamB,
    ...(a.armed === true ? a4MatchFlags(V7) : {}),
    ...(a.pw === undefined ? {} : { pwWeightChooser: a.pw }),
    ...(a.ladder === undefined ? {} : { pwPowerLadder: a.ladder }),
  };
  const m = new Match(cfg);
  if (a.armed === true) armA4World(m, null, V7, DOSE);
  return m;
};
const signature = (m: Match): string => JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, stamina: p.stamina })),
});
const walked = (seed: number, a: Arm = {}): Match => {
  const m = matchOf(seed, a);
  while (!m.finished) m.step(DT);
  return m;
};
const walk = (seed: number, a: Arm = {}): string => signature(walked(seed, a));
/** the in-flight tail: a choice still on the ball when the whistle goes is neither lost nor struck */
const inFlight = (m: Match): number => (m.pendingPassWindup !== null
  && m.pendingPassWindup.powerChoice !== 1 ? 1 : 0)
  + (m.pwStrikePower !== null && m.pwStrikePower.power !== 1 ? 1 : 0);

/** step until a live outfield carrier exists, then hand him and his match back. */
const carrierOf = (m: Match): { p: NonNullable<Match['ball']['owner']>; m: Match } | null => {
  for (let i = 0; i < 20_000 && !m.finished; i++) {
    m.step(DT);
    const o = m.ball.owner;
    if (o !== null && o.role !== 'GK' && !o.sentOff && m.phase === 'playing') {
      const mates = passChoiceCandidateGids(o, m.teams[o.side].players);
      // he must also be a body that KEEPS a percept — a decision moment the live chooser
      // could actually have been asked at.
      if (mates.length >= 2 && m.perceivedSnapshot(o, null) !== null) return { p: o, m };
    }
  }
  return null;
};
/** the flagged caller's own inputs, reproduced exactly as `PlayerBrain` builds them */
const chooserInputs = (m: Match, p: NonNullable<Match['ball']['owner']>) => {
  const team_ = m.teams[p.side];
  const opp = m.teams[1 - p.side];
  const gids = passChoiceCandidateGids(p, team_.players);
  const scope = new Set<number>([p.gid, ...gids]);
  for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);
  const snapshot = m.perceivedSnapshot(p, scope)!;
  const reachProfiles = m.reachProfiles();
  const orientationMul = new Map<number, number>();
  for (const gid of gids) {
    const seenMate = snapshot.players.find((e) => e.gid === gid);
    const seenSelf = snapshot.players.find((e) => e.gid === p.gid);
    if (seenMate === undefined || seenSelf === undefined) continue;
    const dx = seenMate.pos.x - seenSelf.pos.x;
    const dy = seenMate.pos.y - seenSelf.pos.y;
    const dl = Math.sqrt(dx * dx + dy * dy);
    if (!(dl > 1e-6)) continue;
    orientationMul.set(gid, orientationPowerMul(
      kickMisalignment(p, { x: dx / dl, y: dy / dl }), p.attrs.passing,
    ));
  }
  return {
    snapshot,
    passerGid: p.gid,
    candidateGids: gids,
    attackDir: team_.attackDir,
    reachProfiles,
    orientationMul,
    valueAxis: m.edsValueAxis,
  };
};

describe('PW-T0c — the door is dormant (Road B, the hard gate)', () => {
  it('the flag defaults to false and the ladder to null, in both world shapes', () => {
    expect(matchOf(SEED_A).pwWeightChooser).toBe(false);
    expect(matchOf(SEED_A).pwPowerLadder).toBeNull();
    expect(matchOf(SEED_A, { armed: true }).pwWeightChooser).toBe(false);
    expect(matchOf(SEED_A, { armed: true }).pwPowerLadder).toBeNull();
  });

  it('⭐⭐ the flag ABSENT ≡ the flag FALSE, whole run, bare and v7', () => {
    for (const seed of [SEED_A, SEED_B]) {
      for (const armed of [false, true]) {
        expect(walk(seed, { armed })).toBe(walk(seed, { pw: false, armed }));
      }
    }
  });

  it('⭐ the fidelity instrument alone arms NOTHING — a ladder with the door shut is inert', () => {
    for (const seed of [SEED_A, SEED_B]) {
      expect(walk(seed, { armed: true, ladder: [1] })).toBe(walk(seed, { armed: true }));
      expect(walk(seed, { armed: true, ladder: [PASS_POWER_MIN, 1, PASS_POWER_MAX] }))
        .toBe(walk(seed, { armed: true }));
    }
  });

  it('the ledger stays all-zero with the door shut, after a full v7 walk', () => {
    const m = walked(SEED_A, { armed: true });
    for (const v of Object.values(m.pwChooserLedger)) {
      if (Array.isArray(v)) expect(v.every((n) => n === 0)).toBe(true);
      else expect(v).toBe(0);
    }
    expect(m.pwStrikePower).toBeNull();
  });

  it('no League can even express the door — neither key is in its flag surface', () => {
    const lg = new League({ seed: 12_493_503 });
    const flags = lg.matchFlags as Record<string, unknown>;
    expect(Object.keys(flags)).not.toContain('pwWeightChooser');
    expect(Object.keys(flags)).not.toContain('pwPowerLadder');
    expect(flags.pwWeightChooser).toBeUndefined();
  });

  it('no a4World preset carries either key', () => {
    for (const v of [3, 6, 7] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(flags.pwWeightChooser).toBeUndefined();
      expect(flags.pwPowerLadder).toBeUndefined();
    }
  });
});

describe('PW-T0c — ⭐⭐ OBJECTIVE FIDELITY: collapse the rungs and the chooser IS the shipped chooser', () => {
  it('⭐⭐ THE KEY PIN — armed at ladder {1}, the v7 world is BYTE-IDENTICAL to the door-shut world', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      expect(walk(seed, { armed: true, pw: true, ladder: [1] }))
        .toBe(walk(seed, { armed: true }));
    }
  });

  it('⭐⭐ …and it is NOT vacuous: the collapsed chooser really ran and never moved the man', () => {
    const m = walked(SEED_A, { armed: true, pw: true, ladder: [1] });
    expect(m.pwChooserLedger.decisions).toBeGreaterThan(0);
    expect(m.pwChooserLedger.matesPriced).toBeGreaterThan(0);
    // the whole claim, as one integer: the weight chooser moved nobody off the shipped pick.
    expect(m.pwChooserLedger.mateSwitches).toBe(0);
    // and no weight axis means no deposit ever bites
    expect(m.pwChooserLedger.depositsNonDefault).toBe(0);
    expect(m.pwChooserLedger.struckAtChosenPower).toBe(0);
  });

  it('⭐⭐ THE OBJECTIVE ITSELF: at ladder {1} every candidate price IS `pricePassOption`\'s price', () => {
    const found = carrierOf(matchOf(SEED_B, { armed: true, pw: true, ladder: [1] }));
    expect(found).not.toBeNull();
    const { p, m } = found!;
    const inputs = chooserInputs(m, p);
    const pw = choosePassWeight({ ...inputs, powers: [1] });
    expect(pw).not.toBeNull();
    for (const c of pw!.candidates) {
      const shipped = pricePassOption({
        snapshot: inputs.snapshot,
        passerGid: inputs.passerGid,
        targetGid: c.targetGid,
        attackDir: inputs.attackDir,
        reachProfiles: inputs.reachProfiles,
        valueAxis: inputs.valueAxis,
      });
      expect(c.shippedPrice).toBe(shipped.price);
      expect(c.rungFactor).toBe(1);
      expect(c.price).toBe(shipped.price);
      expect(c.infoClass).toBe(shipped.infoClass);
    }
  });

  it('⭐⭐ THE SAME MAN: at ladder {1} the argmax equals `choosePerceivedPassTarget`\'s', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const found = carrierOf(matchOf(seed, { armed: true, pw: true, ladder: [1] }));
      expect(found).not.toBeNull();
      const { p, m } = found!;
      const inputs = chooserInputs(m, p);
      const shipped = choosePerceivedPassTarget(inputs);
      const pw = choosePassWeight({ ...inputs, powers: [1] });
      expect(pw === null).toBe(shipped === null);
      if (shipped !== null) {
        expect(pw!.targetGid).toBe(shipped.targetGid);
        expect(pw!.price).toBe(shipped.price);
        expect(pw!.power).toBe(1);
      }
    }
  });

  it('⭐ CANDIDATE-SET PARITY: the same window, the same GK exclusion, SEEN-UNREAD included', () => {
    const found = carrierOf(matchOf(SEED_C, { armed: true, pw: true }));
    const { p, m } = found!;
    const inputs = chooserInputs(m, p);
    const shipped = choosePerceivedPassTarget(inputs)!;
    const pw = choosePassWeight({ ...inputs, powers: [PASS_POWER_MIN, 1, PASS_POWER_MAX] })!;
    const shippedExecutable = shipped.options.filter((o) => o.executable)
      .map((o) => o.targetGid).sort((a, b) => a - b);
    const pwMates = Array.from(new Set(pw.candidates.map((c) => c.targetGid)))
      .sort((a, b) => a - b);
    expect(pwMates).toEqual(shippedExecutable);
    // a GK is never a candidate on either side, and the window is the shipped one
    expect(inputs.candidateGids.some((g) => m.allPlayers[g].role === 'GK')).toBe(false);
    // every mate the shipped chooser prices but cannot aim at is skipped here too
    expect(pw.matesNotExecutable)
      .toBe(shipped.options.filter((o) => !o.executable).length);
    expect(pw.matesPriced).toBe(inputs.candidateGids.length);
  });

  it('⭐ EVERY candidate carries the shipped price of ITS OWN information class', () => {
    // The class the pre-amendment chooser could not represent at all is SEEN-UNREAD (no oracle
    // read at any rung ⇒ the pair was retired), and the shipped chooser CAN pick it. Parity is
    // structural here — the executable filter and the price both come from `pricePassOption` —
    // so this pin walks whatever classes the world actually produces and holds each to its own
    // shipped price. ⚠ The SEEN-UNREAD branch is measured EMPTY in these worlds (the stage
    // doc's §DOUBTS 3 says so out loud); it is pinned by construction, not by occurrence.
    let checked = 0;
    const classes = new Set<string>();
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const found = carrierOf(matchOf(seed, { armed: true, pw: true }));
      const { p, m } = found!;
      const inputs = chooserInputs(m, p);
      const pw = choosePassWeight({ ...inputs, powers: [PASS_POWER_MIN, 1, PASS_POWER_MAX] })!;
      for (const c of pw.candidates) {
        classes.add(c.infoClass);
        checked++;
        const shipped = pricePassOption({
          snapshot: inputs.snapshot,
          passerGid: inputs.passerGid,
          targetGid: c.targetGid,
          attackDir: inputs.attackDir,
          reachProfiles: inputs.reachProfiles,
          valueAxis: inputs.valueAxis,
        });
        expect(c.infoClass).toBe(shipped.infoClass);
        expect(c.shippedPrice).toBe(shipped.price);
        if (c.infoClass === 'SEEN-UNREAD') {
          expect(c.power).toBe(1);
          expect(c.price).toBe(c.shippedPrice);
          expect(Number.isNaN(c.threatSeconds)).toBe(true);
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
    // the UNSEEN class must NEVER be a candidate: the shipped chooser cannot aim at him either
    expect(classes.has('UNSEEN')).toBe(false);
  });

  it('⭐ the WEIGHT AXIS is what remains: the full ladder moves the world and bites', () => {
    const collapsed = walk(SEED_A, { armed: true, pw: true, ladder: [1] });
    const full = walked(SEED_A, { armed: true, pw: true });
    expect(signature(full)).not.toBe(collapsed);
    expect(full.pwChooserLedger.depositsNonDefault).toBeGreaterThan(0);
    expect(full.pwChooserLedger.struckAtChosenPower).toBeGreaterThan(0);
  });
});

describe('PW-T0c — the deposit / consume / wind-up threading, and the CLOSED choice ledger', () => {
  it('⭐ the chosen weight reaches the strike, and the wind-up carries it', () => {
    const m = walked(SEED_A, { armed: true, pw: true });
    expect(m.pwChooserLedger.decisions).toBeGreaterThan(0);
    expect(m.pwChooserLedger.struckAtChosenPower).toBeGreaterThan(0);
    // v7 arms `o1PassWindup` by construction, so the wound-up ball is the MAIN path (#293.4)
    expect(m.o1PassWindup).toBe(true);
    expect(m.pwChooserLedger.windupCarried).toBeGreaterThan(0);
  });

  it('⭐⭐ NO SILENT LOSS: every deposited non-default weight is struck, voided or abandoned', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const m = walked(seed, { armed: true, pw: true });
      const led = m.pwChooserLedger;
      expect(led.depositsNonDefault).toBe(
        led.struckAtChosenPower + led.windupChoiceVoided + led.depositsAbandoned + inFlight(m),
      );
      expect(led.depositsNonDefault).toBeGreaterThan(0);
    }
  });

  it('⭐⭐ THE CANCELLED WIND-UP IS COUNTED, never silently dropped (#293.3 (c))', () => {
    // a constructed cancel: arm a wind-up carrying a chosen weight, then take the mate off the
    // pitch before it resolves. The pass never runs — and the choice is ACCOUNTED, not lost.
    const m = matchOf(SEED_A, { armed: true, pw: true });
    while (!m.finished && m.pendingPassWindup === null) m.step(DT);
    // force a carried weight onto the live wind-up record, then void it the engine's own way
    const pp = m.pendingPassWindup;
    expect(pp).not.toBeNull();
    (pp as { powerChoice: number }).powerChoice = PASS_POWER_MAX;
    const before = m.pwChooserLedger.windupChoiceVoided;
    const mate = m.allPlayers[pp!.targetGid];
    mate.sentOff = true;
    const cancelledBefore = m.o1WindupLedger.cancelledMate;
    for (let i = 0; i < 600 && m.o1WindupLedger.cancelledMate === cancelledBefore
      && !m.finished; i++) m.step(DT);
    expect(m.o1WindupLedger.cancelledMate).toBeGreaterThan(cancelledBefore);
    expect(m.pwChooserLedger.windupChoiceVoided).toBe(before + 1);
  });

  it('⭐ a stale deposit is swept and counted, never left to fire on a later tick', () => {
    const m = matchOf(SEED_A, { armed: true, pw: true });
    m.step(DT);
    m.pwStrikePower = { gid: 0, power: PASS_POWER_MAX, tick: m.simTick };
    const before = m.pwChooserLedger.depositsAbandoned;
    m.step(DT);
    expect(m.pwStrikePower === null || m.pwStrikePower.tick === m.simTick).toBe(true);
    expect(m.pwChooserLedger.depositsAbandoned).toBe(before + 1);
  });

  it('the deposit is gid+tick keyed — a weight never leaks to another body\'s kick', () => {
    const m = walked(SEED_B, { armed: true, pw: true });
    // the walk ends with nothing in the slot for a body that no longer exists in this tick
    expect(m.pwStrikePower === null || m.pwStrikePower.tick === m.simTick).toBe(true);
  });
});

describe('PW-T0c — per-rung admission through the shipped oracle, and no refusal inheritance', () => {
  it('⭐ a rung the oracle refuses retires THAT pair and nothing else', () => {
    const found = carrierOf(matchOf(SEED_A, { armed: true, pw: true }));
    const { p, m } = found!;
    const inputs = chooserInputs(m, p);
    // 0.001 of the shipped pace cannot reach anybody: the oracle refuses that rung for every
    // mate, and the shipped rule would have refused the WHOLE option for it (its price divides
    // by the reference rung). Here the reference rung survives untouched.
    const pw = choosePassWeight({ ...inputs, powers: [0.001, 1, PASS_POWER_MAX] })!;
    expect(pw.candidates.some((c) => c.powerIndex === 0)).toBe(false);
    expect(pw.candidates.some((c) => c.powerIndex === 1)).toBe(true);
    expect(pw.pairsDroppedForOtherRungRefusal).toBe(0);
    expect(pw.pairsAsked).toBe(3 * (inputs.candidateGids.length - pw.matesNotExecutable));
  });

  it('⭐ NO REFUSAL INHERITANCE over a whole armed walk, at the engine\'s own ladder', () => {
    for (const seed of [SEED_A, SEED_B]) {
      const m = walked(seed, { armed: true, pw: true });
      expect(m.pwChooserLedger.pairsDroppedForOtherRungRefusal).toBe(0);
      expect(m.pwChooserLedger.pairsAsked % 3).toBe(0);
      expect(m.pwChooserLedger.pairsAsked).toBeGreaterThan(0);
    }
  });

  it('the rung factor is exactly 1 at the reference rung, and a ratio elsewhere', () => {
    const found = carrierOf(matchOf(SEED_C, { armed: true, pw: true }));
    const { p, m } = found!;
    const inputs = chooserInputs(m, p);
    const pw = choosePassWeight({ ...inputs, powers: [PASS_POWER_MIN, 1, PASS_POWER_MAX] })!;
    for (const c of pw.candidates) {
      if (c.powerIndex === 1) expect(c.rungFactor).toBe(1);
      else if (c.hasReferenceNormaliser) expect(c.rungFactor).toBeGreaterThan(0);
      else expect(c.rungFactor).toBe(1);
      expect(c.price).toBeCloseTo(c.shippedPrice * c.rungFactor, 15);
    }
  });

  it('the ladder is the engine\'s own canary ladder unless a probe hands one in', () => {
    expect([PASS_POWER_MIN, 1, PASS_POWER_MAX]).toEqual([0.85, 1, 1.15]);
    expect(matchOf(SEED_A, { armed: true, pw: true }).pwPowerLadder).toBeNull();
  });
});

describe('PW-T0c — PTP × PW is an unsupported composition (#293.3 (d))', () => {
  it('⭐⭐ the engine REFUSES to build a world that arms both', () => {
    expect(() => matchOf(SEED_A, { pw: true })).not.toThrow();
    expect(() => new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2), ptpPassLead: true,
    })).not.toThrow();
    expect(() => new Match({
      seed: SEED_A,
      teamA: team('A', 1),
      teamB: team('B', 2),
      ptpPassLead: true,
      pwWeightChooser: true,
    })).toThrow(/UNSUPPORTED COMPOSITION/);
  });

  it('the refusal names the ruling and the missing slice, so the door is readable', () => {
    let message = '';
    try {
      // eslint-disable-next-line no-new
      new Match({
        seed: SEED_A,
        teamA: team('A', 1),
        teamB: team('B', 2),
        ptpPassLead: true,
        pwWeightChooser: true,
      });
    } catch (e) { message = (e as Error).message; }
    expect(message).toContain('#293.3');
    expect(message).toContain('ptpPassLead');
    expect(message).toContain('lead-at-rung');
  });
});
