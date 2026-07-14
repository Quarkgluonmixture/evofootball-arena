import { describe, expect, it } from 'vitest';
import {
  PLAYER_STYLE_KEYS, STYLE_MAX, STYLE_MIN, applyPlayerStyle, crossoverSquadStyles,
  neutralSquadStyles, neutralStyle, playerDimStats, playerNameplate, playerVector,
  styleFromBloodline,
} from '../src/evolution/playerStyle';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { defaultPolicyGenes } from '../src/evolution/policyGenome';
import { traitsOf } from '../src/evolution/traits';
import { League } from '../src/sim/League';
import { DEFAULT_POLICY } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

const attrs = (v: number): PlayerAttributes => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = v;
  return a;
};

describe('player personal style (Phase 54)', () => {
  it('a neutral player runs his coach\'s policy verbatim (bit-identity contract)', () => {
    const coach = defaultPolicyGenes();
    coach.shootBase = 2.5; // an evolved coach value
    const out = applyPlayerStyle(coach, neutralStyle());
    for (const k of PLAYER_STYLE_KEYS) expect(out[k]).toBe(coach[k]);
    expect(out.passBase).toBe(coach.passBase);
  });

  it('personal appetites multiply the coach but never break the policy bounds', () => {
    const coach = defaultPolicyGenes();
    coach.longShotW = DEFAULT_POLICY.longShotW * 1.6; // near the team ceiling
    const hungry = { ...neutralStyle(), longShotW: STYLE_MAX };
    const out = applyPlayerStyle(coach, hungry);
    expect(out.longShotW).toBeLessThanOrEqual(DEFAULT_POLICY.longShotW * 1.7 + 1e-12);
    const shy = { ...neutralStyle(), longShotW: STYLE_MIN };
    expect(applyPlayerStyle(coach, shy).longShotW!).toBeLessThan(coach.longShotW);
  });

  it('bloodline inheritance mutates within the personal range, deterministically', () => {
    const parent = { ...neutralStyle(), dribbleBase: 1.4 };
    const a = styleFromBloodline(parent, new Rng(7));
    const b = styleFromBloodline(parent, new Rng(7));
    expect(a).toEqual(b);
    for (const k of PLAYER_STYLE_KEYS) {
      expect(a[k]).toBeGreaterThanOrEqual(STYLE_MIN);
      expect(a[k]).toBeLessThanOrEqual(STYLE_MAX);
    }
  });

  it('crossover picks A, B or the blend per slot', () => {
    const A = neutralSquadStyles(6).map((s) => ({ ...s, shootBase: 0.8 }));
    const B = neutralSquadStyles(6).map((s) => ({ ...s, shootBase: 1.4 }));
    const child = crossoverSquadStyles(A, B, new Rng(3));
    for (const s of child) expect([0.8, 1.4, 1.1000000000000001, 1.1]).toContain(s.shootBase);
  });

  it('style traits are badges of expressed genes: present with style, absent without', () => {
    const a = attrs(0.5);
    const style = { ...neutralStyle(), longShotW: 1.45 };
    expect(traitsOf(a, 'MF', style)).toContain('maverick');
    expect(traitsOf(a, 'MF')).not.toContain('maverick');
  });

  it('personal nameplates are earned: the deviant gets a word, the average nobody none', () => {
    const pop = Array.from({ length: 95 }, () => playerVector(attrs(0.5), neutralStyle()));
    const deviant = playerVector(attrs(0.5), { ...neutralStyle(), dribbleBase: 1.5 });
    const stats = playerDimStats([...pop, deviant]);
    expect(playerNameplate(deviant, stats)).toContain('Take-on artist');
    expect(playerNameplate(pop[0], stats)).toEqual([]);
  });

  it('the league wires styles into rolePolicies and inherits them through the academy', () => {
    const league = new League({ seed: 6, matchDuration: 30 });
    for (const f of league.franchises) {
      expect(f.squadStyles).toHaveLength(6);
      for (const s of f.squadStyles) expect(s).toEqual(neutralStyle());
    }
    const info = league.teamInfo(0);
    expect(info.rolePolicies).toHaveLength(6);
    // Neutral start: every slot's effective policy equals the coach's.
    for (const rp of info.rolePolicies!) {
      for (const k of PLAYER_STYLE_KEYS) expect(rp[k]).toBe(league.franchise(0).coach.policy[k]);
    }
    // A few seasons of retirements + rebirths diverge someone from ×1.0.
    for (let s = 0; s < 3; s++) {
      while (!league.seasonDone) {
        const f = league.nextFixture()!;
        league.applyResult(f, league.createMatch(f).runToCompletion());
      }
      league.finishSeason();
    }
    const anyDiverged = league.franchises.some((f) =>
      f.squadStyles.some((s) => PLAYER_STYLE_KEYS.some((k) => s[k] !== 1)));
    expect(anyDiverged).toBe(true);
  });

  it('v15 saves migrate: everyone loads neutral', () => {
    const league = new League({ seed: 8, matchDuration: 30 });
    const json = JSON.parse(JSON.stringify(league.toJSON())) as {
      version: number;
      franchises: Array<{ squadStyles?: unknown }>;
    };
    json.version = 15;
    for (const f of json.franchises) delete f.squadStyles;
    const restored = League.fromJSON(json as unknown as Record<string, unknown>);
    for (const f of restored.franchises) {
      expect(f.squadStyles).toHaveLength(6);
      for (const s of f.squadStyles) expect(s).toEqual(neutralStyle());
    }
  });
});
