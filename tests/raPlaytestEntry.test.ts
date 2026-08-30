import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import {
  CORRIDOR_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT, RA_WORLD_DOORS, RA_WORLD_LEAD,
  RA_WORLD_VERSION, RA_WORLD_WEIGHT,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, corridorArmedVersion, isRaWorld,
  poolPcDoseTable, poolT1DoseCells, raArmedVersion,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_RA, A4_BADGE_TEXT_RA_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY,
} from '../src/ui/A4WorldBadge';
import { randomGenome, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * ⭐⭐ THE RA ENTRY — `?a4world=12` (传球先问赶不赶得到, the five delivery/access doors at the
 * RA-T1B exam pins). Ruling #364 item 3, landed at #365; docs/world-model/RA-ENTRY-RUNG.md.
 * The TWELFTH entry of the #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 12 IS world 11 plus EXACTLY the RA-T1B exam's five armed doors,
 *       and it says so by CALLING the world-11 composition; the two gene pins are the exam's
 *       own values (1 and 1).
 *   (2) ⭐⭐ MATCH-LOCAL ONLY — the pins ride `baseGenome`/`effGenome` COPIES; the franchise's
 *       `info.genome` never carries any of the three written genes (#334 item 1's form).
 *   (3) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 12 → 11 → … (the BU-T1 mislabel class):
 *       a world-12 match names itself 12; a world-11 match does NOT.
 *   (4) ⭐ THE URL BOUND moves to 13; the badge tables carry 12 in BOTH dose forms.
 *   (5) ⭐⭐ THE BLURBS CARRY THE COST (fewer passes — the measured style shift) AND the
 *       first-look disclosure (the exams ran the EMPTY-BOOK form).
 *   (6) DORMANCY — worlds 6–11 gain nothing (their flag sets are byte-unchanged and none of
 *       them reads as world 12).
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY (≥ 900,000,000); zero frontier consumption.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/RA-ENTRY-RUNG.md');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');
const APP = repoText('src/game/GameApp.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

const SCRATCH = 900_001_800;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (version: 11 | 12, dosed = true, seed = SCRATCH): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(version);
  const match = league.createMatch(league.nextFixture()!);
  armA4World(match, null, version, dosed ? L3_DOSE : null, dosed ? PC_DOSE : null);
  return match;
};

describe('W12 — ⭐ FIDELITY: the world IS the exam\'s armed composition', () => {
  it('world 12 is `a4MatchFlags(11)` ∪ the five RA-T1B doors, key for key', () => {
    const flags = a4MatchFlags(RA_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS });
    expect(RA_WORLD_DOORS).toEqual({
      dlcDeliveryChoice: true, dlcStrikePlane: true, bkGroundCorridor: true,
      dxWindupAim: true, raAccessPrice: true,
    });
    const eleven = a4MatchFlags(CORRIDOR_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in eleven)).sort()).toEqual(
      ['bkGroundCorridor', 'dlcDeliveryChoice', 'dlcStrikePlane', 'dxWindupAim', 'raAccessPrice'],
    );
    for (const k of Object.keys(eleven)) expect(flags[k]).toBe(eleven[k]);
    // the two pins are the exam's own values
    expect(RA_WORLD_LEAD).toBe(1);
    expect(RA_WORLD_WEIGHT).toBe(1);
  });

  it('⭐⭐ the pins ride MATCH-LOCAL copies; the franchise genome stays clean', () => {
    const m = worldMatch(12);
    for (const side of [0, 1] as const) {
      const eff = m.teams[side].effGenome as TacticalGenome;
      const base = m.teams[side].baseGenome as TacticalGenome;
      for (const g of [eff, base]) {
        expect(g.passLeadSupport).toBe(RA_WORLD_LEAD);
        expect(g.raAccessWeight).toBe(RA_WORLD_WEIGHT);
        // world 11's own pin is CARRIED, not clobbered (the spread order pin)
        expect(g.dvExposureWeight).toBe(CORRIDOR_WORLD_WEIGHT);
      }
      const info = m.teams[side].info.genome as TacticalGenome;
      expect(info.passLeadSupport).toBeUndefined();
      expect(info.raAccessWeight).toBeUndefined();
      expect(info.dvExposureWeight).toBeUndefined();
    }
  });

  it('⭐⭐ the version value is containment-ordered: 12 names itself 12; 11 stays 11', () => {
    const twelve = worldMatch(12);
    expect(raArmedVersion(twelve)).toBe(RA_WORLD_VERSION);
    expect(a4ArmedVersion(twelve)).toBe(RA_WORLD_VERSION);
    // …and the world it contains still reads as itself underneath
    expect(corridorArmedVersion(twelve)).toBe(CORRIDOR_WORLD_VERSION);
    const eleven = worldMatch(11);
    expect(raArmedVersion(eleven)).toBe(0);
    expect(a4ArmedVersion(eleven)).toBe(CORRIDOR_WORLD_VERSION);
    // the EMPTY-BOOK form (the exams' own shape) is the same world 12
    const emptyForm = worldMatch(12, false);
    expect(raArmedVersion(emptyForm)).toBe(RA_WORLD_VERSION);
    expect(a4ArmedVersion(emptyForm)).toBe(RA_WORLD_VERSION);
  });

  it('⭐ the URL parses 12 and the bound moves to 13; isRaWorld agrees', () => {
    expect(a4UrlOverride('?a4world=12')).toBe(12);
    expect(a4UrlOverride('?a4world=13')).toBeNull();
    expect(isRaWorld(12)).toBe(true);
    expect(isRaWorld(11)).toBe(false);
  });

  it('⭐ the badge carries 12 in BOTH dose forms', () => {
    expect(A4_BADGE_TEXTS[12]).toBe(A4_BADGE_TEXT_RA);
    expect(A4_BADGE_TEXTS_EMPTY[12]).toBe(A4_BADGE_TEXT_RA_EMPTY);
    expect(A4_BADGE_TEXT_RA).toContain('传球先问赶不赶得到');
    expect(A4_BADGE_TEXT_RA_EMPTY).toContain('空账本');
  });
});

describe('W12 — ⭐⭐ THE BLURBS CARRY THE COST AND THE FIRST-LOOK DISCLOSURE', () => {
  it('the settings blurb says the passes fell, the ruler story, and the first look', () => {
    expect(SETTINGS).toContain('整体传球变少了');
    expect(SETTINGS).toContain('空账本形态');
    expect(SETTINGS).toContain('赶不到的提前球每场 3.91 → 2.82');
    expect(SETTINGS).toContain('接应时间入价 1.0 (play-test)');
  });
  it('the feed blurb (GameApp) carries the same cost, in both dose forms', () => {
    expect(APP).toContain('传球先问赶不赶得到 ON');
    expect(APP).toContain('传球先问赶不赶得到 · 空账本 ON');
    expect(APP).toContain('整体传球变少了');
  });
  it('the entry doc exists and names its rulings', () => {
    expect(DOC).toContain('#364');
    expect(DOC).toContain('#365');
    expect(DOC).toContain('RA-T1B');
  });
});

describe('W12 — DORMANCY below and Road B', () => {
  it('worlds 6–11 carry NONE of the five doors', () => {
    for (const v of [6, 7, 8, 9, 10, 11] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of Object.keys(RA_WORLD_DOORS)) {
        if (v === 11 && k === 'bkCorridorPrice') continue; // not in the five; guard anyway
        expect(flags[k]).toBeUndefined();
      }
    }
  });
  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(raArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.raAccessPrice).toBe(false);
    expect(m.dxWindupAim).toBe(false);
  });
});
