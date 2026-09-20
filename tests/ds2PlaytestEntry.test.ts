import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome, lnOwnLaneWeightOf, type TacticalGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  BQ_WORLD_VERSION, DS2_WORLD_DOORS, DS2_WORLD_VERSION, DS_WORLD_VERSION, GK_WORLD_VERSION,
  LN_WORLD_VERSION, LN_WORLD_WEIGHT, a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World,
  bqArmedVersion, ds2ArmedVersion, dsArmedVersion, gkArmedVersion, isBqWorld, isDs2World,
  isDsWorld, isGkWorld, isLnWorld, lnArmedVersion, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_DS2, A4_BADGE_TEXT_DS2_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';

/**
 * ⭐⭐ THE DS2 ENTRY — `?a4world=17` (配合帽子摘了, the ONE cooperation-hats door at DS-T1d's arm
 * of record `OWNCOOP-E13`). Ruling #414 item 5; docs/world-model/DS-ENTRY-2-RUNG.md. The
 * SEVENTEENTH entry of the
 * #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5/#365/#386/#396/#402/#411 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 17 IS world 16 plus EXACTLY the ONE door `dsCoopHatsOff`, and it
 *       says so by CALLING the world-16 composition. ⛔ NOTHING ELSE rides along, and there is
 *       NO DOSE, NO GENE AND NO CONSTANT (the switch is a pure subtraction), so `armDs2World`
 *       is `armDsWorld` CALLED and nothing more — world 14's own pin (`lnOwnLaneWeight` = 0.25
 *       on `baseGenome` AND `effGenome` of both sides, `info.genome` clean) arrives by the call.
 *       ⭐⭐⭐ And THE DOOR SET is the EXAM'S: DS-T1d built its OWN arm as `a4MatchFlags(13)` +
 *       the three flags + `armA4World(m, null, 13)` — a WORLD-13 composition, because the exam
 *       ran before this world existed. So the identity is pinned in TWO halves: (a) the exam's
 *       own construction, re-run here on WORLD 13, reproduces DS-T1d's STORED per-seed
 *       whole-match signatures for `OWNCOOP-E13` on its own first twelve battery seeds, and
 *       (b) `a4MatchFlags(16)` + the flag gives whole-match signatures IDENTICAL to
 *       `a4MatchFlags(17)`'s on six scratch seeds — so the DOOR SET world 17 adds is the door
 *       set the exam measured, on the substrate world 17 actually sits on.
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 17 → 16 → 15 → 14 → 13 → 12: a world-17
 *       match names itself 17 and NEVER 16; a world-16 match never reads 17. ⭐ AND THE FLAG
 *       ALONE IS NOT ENOUGH: on a world-15 match it reads 0 and falls back to 15.
 *   (3) ⭐ THE URL parses 17 and the bound moves to 18; the badge carries 17 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — the blurbs carry the DS-T1d field values as 6-dp strings, each in
 *       the surface that claims it, and each ARM's number under its OWN heading (E13 empty-book
 *       vs D13 mature — the #387 item 1 class), with the cost said BEFORE the win, the cost
 *       block's own ARM FRAME present (GK-ENTRY §COMMANDER CORRECTIONS 3), and ⭐ THE HONESTY
 *       LINE on every surface.
 *   (5) ⭐⭐ IDENTITY BELOW 17 — pooled whole-match digests for the bare world, world 12, 13, 14,
 *       15 AND 16 equal the digests RECORDED at the dispatch HEAD `4d3ff94` (clean worktree),
 *       and the production fingerprint literal is unchanged.
 *   (6) DORMANCY — worlds 1–16 carry no cooperation-hats flag; a plain League match reads as no
 *       world; `League.toJSON` omits matchFlags (canon worker fixtures).
 *   (7) ⭐⭐ LIVENESS in the #402 item 2(iii) form, and THE MUTANT WALK — four mutants killed.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — the family IDENTITY band 900,007,200–211 (re-used on
 * purpose: the bare/12/13/14/15 literals are DS-ENTRY-RUNG §IDENTITY's, unchanged) and this
 * executor's own 900,007,800–899 (#414 item 5(xii)); zero frontier consumption, ZERO sims of
 * record. The ONE exception is DS-T1d's OWN battery band 12,557,000–011, which the exam
 * consumed WHOLE (#414 item 8) and which item 5(v) names for the door-set identity pin —
 * re-walking a consumed seed reads no new frontier.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/DS-ENTRY-2-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

const SCRATCH = 900_007_830;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (
  version: 12 | 13 | 14 | 15 | 16 | 17, dosed = true, seed = SCRATCH,
): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(version);
  const match = league.createMatch(league.nextFixture()!);
  armA4World(match, null, version, dosed ? L3_DOSE : null, dosed ? PC_DOSE : null);
  return match;
};

const genomeOf = (m: Match, side: 0 | 1, view: 'base' | 'eff' | 'info'): TacticalGenome =>
  (view === 'base' ? m.teams[side].baseGenome
    : view === 'eff' ? m.teams[side].effGenome
      : m.teams[side].info.genome) as TacticalGenome;

/** THE WHOLE-MATCH SIGNATURE, field for field the `dsPlaytestEntry.test.ts` helper (rng included). */
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

/* ========================================================================== */
/* ⭐ FIDELITY                                                                 */
/* ========================================================================== */

describe('W17 — ⭐ FIDELITY: world 16 plus ONE door, no gene, no constant', () => {
  it('world 17 is `a4MatchFlags(16)` ∪ { dsCoopHatsOff }, key for key', () => {
    expect(DS2_WORLD_VERSION).toBe(17);
    const flags = a4MatchFlags(DS2_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(DS_WORLD_VERSION), ...DS2_WORLD_DOORS });
    expect(DS2_WORLD_DOORS).toEqual({ dsCoopHatsOff: true });
    const sixteen = a4MatchFlags(DS_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in sixteen)).sort())
      .toEqual(['dsCoopHatsOff']);
    for (const k of Object.keys(sixteen)) expect(flags[k]).toBe(sixteen[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG (#414 item 5(i)): no OBM, no CTB, no RC, no BF, no EDS', () => {
    const KEYS = ['obmMovement', 'ctbSupportPlane', 'rcAnticipate', 'rcReady', 'bfFacingCost',
      'edsTouchCost'] as const;
    for (const v of [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      for (const k of KEYS) expect(flags[k]).toBeFalsy();
    }
    const m = worldMatch(17) as unknown as Record<string, unknown>;
    for (const k of KEYS) expect(m[k]).toBeFalsy();
    // ⛔ and NO OBM GENE: the seat is ABSENT — the arm of record `OWNCOOP-E13` is seat-absent
    for (const side of [0, 1] as const) {
      for (const view of ['base', 'eff', 'info'] as const) {
        expect((genomeOf(worldMatch(17), side, view) as unknown as Record<string, unknown>)
          .offballMovementWeights).toBeUndefined();
      }
    }
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 16\'s, called, and NOTHING more', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(DS_WORLD_VERSION), ...DS2_WORLD_DOORS };');
    expect(SRC).toContain('): void {\n  armDsWorld(match, l3Dose, pcDose);\n}');
    // ⛔ NO GENE AND NO CONSTANT: the entry layer names no DS2 weight and no DS2 gene setter
    expect(SRC).not.toContain('setDs2Gene');
    expect(SRC).not.toContain('DS2_WORLD_WEIGHT');
    // ⭐ AND THE CONTAINMENT READ CALLS THE WORLD BELOW — it re-reads no flag of world 16
    expect(SRC).toContain('  if (dsArmedVersion(match) !== DS_WORLD_VERSION) return 0;');
    const m = worldMatch(17);
    expect(m.dsCoopHatsOff).toBe(true);
    expect(m.dsOwnRun).toBe(true);
    expect(m.dsHatsOff).toBe(true);
    expect(m.gkDiveBody).toBe(true);
    expect(m.lnOwnLanePrice).toBe(true);
    expect(m.bqCushion).toBe(true);
    for (const side of [0, 1] as const) {
      // ⭐ world 14's ONE pin rides in from the CALL, on BOTH dosed views, never on info.genome
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(0.25);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(0.25);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(ds2ArmedVersion(m)).toBe(DS2_WORLD_VERSION);
    expect(dsArmedVersion(m)).toBe(DS_WORLD_VERSION);
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
  });

  it('⭐ the door and the inherited gene survive to FULL TIME; `info.genome` stays clean', () => {
    const m = worldMatch(17, true, 900_007_831);
    m.runToCompletion();
    expect(m.dsCoopHatsOff).toBe(true);
    expect(m.dsOwnRun).toBe(true);
    expect(m.dsHatsOff).toBe(true);
    expect(m.gkDiveBody).toBe(true);
    expect(m.lnOwnLanePrice).toBe(true);
    for (const side of [0, 1] as const) {
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'eff'))).toBe(LN_WORLD_WEIGHT);
      expect(lnOwnLaneWeightOf(genomeOf(m, side, 'base'))).toBe(LN_WORLD_WEIGHT);
      expect(Object.prototype.hasOwnProperty.call(genomeOf(m, side, 'info'), 'lnOwnLaneWeight'))
        .toBe(false);
    }
    expect(bqArmedVersion(m)).toBe(BQ_WORLD_VERSION);
    expect(lnArmedVersion(m)).toBe(LN_WORLD_VERSION);
    expect(gkArmedVersion(m)).toBe(GK_WORLD_VERSION);
    expect(dsArmedVersion(m)).toBe(DS_WORLD_VERSION);
    expect(ds2ArmedVersion(m)).toBe(DS2_WORLD_VERSION);
    expect(a4ArmedVersion(m)).toBe(DS2_WORLD_VERSION);
  }, 120_000);
});

/* ========================================================================== */
/* ⭐⭐⭐ THE DOOR-SET IDENTITY WITH THE EXAM                                    */
/* ========================================================================== */

/** DS-T1d's own team builder (`scripts/probes/ds-t1d-coop-hats-exam.ts` `teamInfo`, character for character). */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/**
 * ⭐⭐ THE EXAM'S OWN SIGNATURE RECIPE — `scripts/probes/ds-t1d-coop-hats-exam.ts` `signatureOf`,
 * field for field. It differs from this family's by ONE field (`action.type`), so it is written
 * out here rather than reused: a pin that reproduces a stored value has to use the recipe that
 * produced it.
 */
const examSignature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
    action: pp.action.type,
  })),
})).digest('hex');

/**
 * ⭐⭐ THE EXAM'S WAY — `ds-t1d-coop-hats-exam.ts` `buildMatch`, arm `OWNCOOP-E13`: the WORLD-13
 * construction flags PLUS all THREE DS flags in the CONSTRUCTOR's flags, then
 * `armA4World(m, null, 13)` — the EMPTY-BOOK form (E13 takes no doses), the seat ABSENT (no
 * `obmMovement`, no dose matrix). Walked by the exam's own unobserved loop.
 */
const examWay = (seed: number): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...{ dsOwnRun: true, dsHatsOff: true, dsCoopHatsOff: true },
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, BQ_WORLD_VERSION);
  return m;
};

/** DS-T1d's first twelve battery seeds — its own consumed band (#414 item 5(v)/(xii)). */
const EXAM_SEEDS = Array.from({ length: 12 }, (_, i) => 12_557_000 + i);

/** ⚠ THE ARTIFACT IS AT ITS `.RED.json` PATH — the instrument's own red-routing idiom, because
 *  `gBite` is a STORED red (#414 item 1 / item 4(ii)). The canonical path is EMPTY in the tree
 *  and the artifact is NEVER moved, renamed or copied (#414 item 5, and the exam's §CORR 4). */
const ARTIFACT_PATH = 'docs/world-model/data/ds-t1d-coop-hats-exam.json.RED.json';

describe('W17 — ⭐⭐⭐ THE DOOR SET IS DS-T1d\'s, PROVEN IN TWO HALVES', () => {
  it('(a) the exam\'s construction ON WORLD 13 reproduces its OWN stored `OWNCOOP-E13` signatures', () => {
    const artifact = JSON.parse(repoText(ARTIFACT_PATH)) as {
      perSeedCells: { seed: number; 'OWNCOOP-E13': { signature: string } }[];
    };
    const stored = new Map(artifact.perSeedCells.map(
      (row) => [row.seed, row['OWNCOOP-E13'].signature] as const,
    ));
    let reproduced = 0;
    for (const seed of EXAM_SEEDS) {
      const want = stored.get(seed);
      expect(want, `seed ${seed} is in the artifact`).toBeTypeOf('string');
      const m = examWay(seed);
      while (!m.finished) m.step(DT);
      expect(examSignature(m), `seed ${seed}`).toBe(want);
      reproduced += 1;
    }
    // ⭐ #414 item 5(v) asks for ≥ 2 of the band; the whole twelve reproduce, exactly.
    expect(reproduced).toBe(12);
  }, 900_000);

  it('(b) `a4MatchFlags(16)` + the flag ≡ `a4MatchFlags(17)`, whole-match, on 6 scratch seeds', () => {
    // the flag SET itself, key for key — the byte-for-byte claim
    expect({ ...a4MatchFlags(DS_WORLD_VERSION), dsCoopHatsOff: true })
      .toEqual(a4MatchFlags(DS2_WORLD_VERSION));
    const SEEDS = [900_007_820, 900_007_821, 900_007_822, 900_007_823, 900_007_824,
      900_007_825] as const;
    for (const seed of SEEDS) {
      const build = (spread: boolean): Match => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = spread
          ? { ...a4MatchFlags(DS_WORLD_VERSION), dsCoopHatsOff: true }
          : a4MatchFlags(DS2_WORLD_VERSION);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, DS2_WORLD_VERSION, null, null);
        return m;
      };
      const a = build(true);
      const b = build(false);
      expect(signature(b)).toBe(signature(a));
      a.runToCompletion();
      b.runToCompletion();
      expect(signature(b)).toBe(signature(a));
      expect(ds2ArmedVersion(a)).toBe(DS2_WORLD_VERSION);
      expect(ds2ArmedVersion(b)).toBe(DS2_WORLD_VERSION);
    }
  }, 600_000);
});

/* ========================================================================== */
/* ⭐⭐ CONTAINMENT, THE URL BOUND AND THE BADGE                                */
/* ========================================================================== */

describe('W17 — ⭐⭐ CONTAINMENT, the URL bound and the badge', () => {
  it('⭐⭐ the version value is containment-ordered: 17 names itself 17; 16 stays 16', () => {
    const seventeen = worldMatch(17);
    expect(ds2ArmedVersion(seventeen)).toBe(DS2_WORLD_VERSION);
    expect(a4ArmedVersion(seventeen)).toBe(DS2_WORLD_VERSION); // ⛔ never 16
    // …and the worlds it contains still read as themselves underneath: 17 → 16 → 15 → 14 → 13 → 12
    expect(dsArmedVersion(seventeen)).toBe(DS_WORLD_VERSION);
    expect(gkArmedVersion(seventeen)).toBe(GK_WORLD_VERSION);
    expect(lnArmedVersion(seventeen)).toBe(LN_WORLD_VERSION);
    expect(bqArmedVersion(seventeen)).toBe(BQ_WORLD_VERSION);
    const sixteen = worldMatch(16);
    expect(ds2ArmedVersion(sixteen)).toBe(0);
    expect(a4ArmedVersion(sixteen)).toBe(DS_WORLD_VERSION); // ⛔ never 17
    const fifteen = worldMatch(15);
    expect(ds2ArmedVersion(fifteen)).toBe(0);
    expect(a4ArmedVersion(fifteen)).toBe(GK_WORLD_VERSION);
    const fourteen = worldMatch(14);
    expect(ds2ArmedVersion(fourteen)).toBe(0);
    expect(a4ArmedVersion(fourteen)).toBe(LN_WORLD_VERSION);
    const thirteen = worldMatch(13);
    expect(ds2ArmedVersion(thirteen)).toBe(0);
    expect(a4ArmedVersion(thirteen)).toBe(BQ_WORLD_VERSION);
    const twelve = worldMatch(12);
    expect(ds2ArmedVersion(twelve)).toBe(0);
    expect(a4ArmedVersion(twelve)).toBe(12);
    // the EMPTY-BOOK form is the same world 17
    expect(a4ArmedVersion(worldMatch(17, false))).toBe(DS2_WORLD_VERSION);
    // ⭐ THE FLAG ALONE IS NOT ENOUGH: on world 15's substrate it reads 0 and falls back to 15
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = { ...a4MatchFlags(GK_WORLD_VERSION), dsCoopHatsOff: true };
    const lonely = league.createMatch(league.nextFixture()!);
    armA4World(lonely, null, DS2_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(lonely.dsCoopHatsOff).toBe(true);
    expect(ds2ArmedVersion(lonely)).toBe(0);
    expect(a4ArmedVersion(lonely)).toBe(GK_WORLD_VERSION);
    // ⭐ THE SOURCE ORDER itself: 17 is asked BEFORE 16 (mutant M4's home)
    expect(SRC.indexOf('const raw17 = ds2ArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw16 = dsArmedVersion(match);'));
    expect(SRC.indexOf('const raw16 = dsArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw15 = gkArmedVersion(match);'));
    expect(SRC.indexOf('const raw15 = gkArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw14 = lnArmedVersion(match);'));
    expect(SRC.indexOf('const raw14 = lnArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw13 = bqArmedVersion(match);'));
    expect(SRC.indexOf('const raw13 = bqArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw12 = raArmedVersion(match);'));
  });

  it('⭐ the URL parses 17 and the bound moves to 18; isDs2World agrees', () => {
    expect(a4UrlOverride('?a4world=17')).toBe(17);
    expect(a4UrlOverride('?a4world=18')).toBe(18); // #424 item 5: the IF entry
    expect(a4UrlOverride('?a4world=19')).toBeNull(); // …and a nineteenth does not
    expect(a4UrlOverride('?a4world=16')).toBe(16);
    expect(isDs2World(17)).toBe(true);
    expect(isDs2World(16)).toBe(false);
    expect(isDsWorld(17)).toBe(false);
    expect(isGkWorld(17)).toBe(false);
    expect(isLnWorld(17)).toBe(false);
    expect(isBqWorld(17)).toBe(false);
    expect(SRC).toContain('?a4world=17` arms that world +');
  });

  it('⭐ the badge carries 17 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[17]).toBe(A4_BADGE_TEXT_DS2);
    expect(A4_BADGE_TEXTS_EMPTY[17]).toBe(A4_BADGE_TEXT_DS2_EMPTY);
    expect(A4_BADGE_TEXT_DS2).toBe('🧪 配合帽子摘了 · 剂量成熟');
    expect(A4_BADGE_TEXT_DS2_EMPTY).toBe('🧪 配合帽子摘了 · 空账本(全新手)');
    expect(A4_BADGE_TEXT_DS2).not.toBe(A4_BADGE_TEXT_DS2_EMPTY);
    const badge = new A4WorldBadge({
      createElement: () => ({ className: '', textContent: null as string | null, remove: () => {} }),
      body: { appendChild: () => {} },
    });
    badge.setWorld(17);
    expect(badge.world).toBe(17);
    expect(badge.label).toBe(A4_BADGE_TEXT_DS2);
    badge.setWorld(17, A4_BADGE_TEXT_DS2_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_DS2_EMPTY);
  });
});

/* ========================================================================== */
/* ⭐⭐ THE HONEST BRIEF — every number a DS-T1d field at 6 dp                  */
/* ========================================================================== */

/**
 * The EMPTY-BOOK (E13) arm's OWN values — the ARM OF RECORD `OWNCOOP-E13` against its control
 * `OWN-E13`, `docs/world-model/data/ds-t1d-coop-hats-exam.json.RED.json`.
 */
const E13_VALUES = [
  '0.092092', // coupling.overlapArrivalsPerMatch (→ 0)
  '0.211211', // coupling.wallReturnsPerMatch (→ 0)
  '10.067067', // passer.wallReturnFiresPerMatch (→ 0)
  '2.629630', // passer.overlapReleaseFiresPerMatch (→ 0)
  '28.503504', '27.558559', '0.944945', '1.582583', '0.304304', // passer.thirdManFiresPerMatch + Δ/CI
  '0.247172', '0.238918', // r1.runsPerInPossessionTick
  '0.966607', '0.953676', '0.980174', // r1.ratioOfRecord + its interval
  '0.025057', '0.008874', // runsByRole.share.MF
  '0.619676', '0.643971', // runsByRole.share.ST
  '3.254254', '0.061061', '0.073073', '0.190190', // guard.goalsPerMatch + Δ/CI
  '5.476476', '0.120120', '0.050050', '0.283283', // guard.throughBallsPerMatch + Δ/CI
  '0.120532', // state.runShare.own.ballInFlight — the stale-eyes leak
  '0.440822', '0.444334', // crowd.crashShare
] as const;
/** The MATURE-BOOK (D13) arm's OWN values — `OWNCOOP-D13` against `OWN-D13`, MEASURED this time. */
const D13_VALUES = [
  '0.252708', '0.239194', // r1.runsPerInPossessionTick
  '0.146146', // coupling.overlapArrivalsPerMatch (→ 0)
  '0.455455', // coupling.wallReturnsPerMatch (→ 0)
] as const;
/** The D13 values the FEED's mature line adds, all of them `OWNCOOP-D13`/`OWN-D13` fields. */
const D13_FEED_ONLY = [
  '14.424424', // passer.wallReturnFiresPerMatch (→ 0)
  '3.709710', // passer.overlapReleaseFiresPerMatch (→ 0)
  '35.280280', '34.731732', // passer.thirdManFiresPerMatch
  '0.155785', // state.runShare.own.ballInFlight
  '0.467635', '0.463894', // crowd.crashShare
] as const;

/** ⭐⭐ THE HONESTY LINE, rendered in plain Chinese — `reads.honestyLine`, on EVERY surface. */
const HONESTY = '这块表看不见,不等于眼睛看不见——这道门就是请你的眼睛来判';

describe('W17 — ⭐⭐ THE HONEST BRIEF: the cost first, and each arm under its own heading', () => {
  it('the settings blurb carries the checkbox label and every field it claims', () => {
    expect(SETTINGS).toContain('配合帽子摘了 · 套边和二过一不再由教练和传球手点名 (play-test)');
    for (const v of E13_VALUES) expect(SETTINGS).toContain(v);
    for (const v of D13_VALUES) expect(SETTINGS).toContain(v);
    expect(SETTINGS).toContain('没有新常数'); // no new constant, said plainly
    expect(SETTINGS).toContain('?a4world=17');
    expect(SETTINGS).toContain('?a4world=17&pcdose=0'); // the E13 arm of record, named
    expect(SETTINGS).toContain(HONESTY);
  });

  it('⭐⭐ THE COST BLOCK OPENS WITH ITS ARM FRAME (GK-ENTRY §CORR 3), and the cost precedes the win', () => {
    expect(SETTINGS).toContain('(以下数字来自 E13 空账本臂,也就是这扇门量过的那一档)');
    const blurb = SETTINGS.split('\n').find((l) => l.includes('配合帽子摘了 —— 套边和二过一不再由教练'))!;
    expect(blurb).toBeDefined();
    expect(blurb.indexOf('⚠ 代价说在最前面')).toBeGreaterThan(-1);
    expect(blurb.indexOf('⚠ 代价说在最前面')).toBeLessThan(blurb.indexOf('⭐ 量到的:'));
  });

  it('⭐⭐ THE ARM LABELS ARE ADJACENT TO THE NUMBERS (#387 item 1, in the settings blurb)', () => {
    expect(SETTINGS).toContain('前插人数(成熟账本)0.252708 → 0.239194');
    expect(SETTINGS).toContain('套边到位(成熟账本)0.146146 → 0');
    expect(SETTINGS).toContain('二过一(成熟账本)0.455455 → 0');
    expect(SETTINGS).toContain('护栏(还是 E13 空账本臂)');
    // ⭐ the disclosure block's own E13 label — the #412 §COMMANDER CORRECTIONS 1 lesson
    expect(SETTINGS).toContain('(以下两条仍是 E13 空账本臂的数)');
  });

  it('⭐ THE LIKELIEST 「change」 AND ITS ANSWER ARE WRITTEN ON THE SURFACE', () => {
    expect(SETTINGS).toContain('DS-T0e');
    expect(SETTINGS).toContain('连续的排位权重');
  });

  it('the feed blurb (GameApp) carries the brief in BOTH dose forms', () => {
    expect(APP).toContain('🧪 配合帽子摘了 ON');
    expect(APP).toContain('🧪 配合帽子摘了 · 空账本 ON');
  });

  it('⭐⭐ THE ATTRIBUTION IS PINNED: each arm\'s number under its OWN heading', () => {
    const emptyLine = APP.split('\n').find((l) => l.includes('🧪 配合帽子摘了 · 空账本 ON'))!;
    expect(emptyLine).toBeDefined();
    for (const v of E13_VALUES) expect(emptyLine).toContain(v);
    for (const v of [...D13_VALUES, ...D13_FEED_ONLY]) expect(emptyLine).not.toContain(v);
    const matureLine = APP.split('\n').find(
      (l) => l.includes('🧪 配合帽子摘了 ON') && !l.includes('空账本 ON'),
    )!;
    expect(matureLine).toBeDefined();
    for (const v of [...D13_VALUES, ...D13_FEED_ONLY]) expect(matureLine).toContain(v);
    for (const v of E13_VALUES) expect(matureLine).not.toContain(v);
    // ⭐ THE COST IS SAID BEFORE THE WIN, in both dose forms
    for (const line of [emptyLine, matureLine]) {
      expect(line.indexOf('代价说在最前面')).toBeGreaterThan(-1);
      expect(line.indexOf('代价说在最前面')).toBeLessThan(line.indexOf('⭐ 量到的:'));
      // ⭐ and BOTH lines carry the league-worker caveat, the eyes' block and the honesty line
      expect(line).toContain('联赛后台快速模拟的比赛跑的是原版世界');
      expect(line).toContain('你的眼睛要判的');
      expect(line).toContain(HONESTY);
      expect(line).toContain('?a4world=17 对 ?a4world=16');
    }
  });

  it('the entry doc exists and names its rulings and its exam', () => {
    expect(DOC).toContain('#414');
    expect(DOC).toContain('DS-T1d');
    expect(DOC).toContain('DS-T0d');
    expect(DOC).toContain(ARTIFACT_PATH.split('/').pop()!);
  });
});

/* ========================================================================== */
/* DORMANCY and Road B                                                        */
/* ========================================================================== */

describe('W17 — DORMANCY below and Road B', () => {
  it('worlds 1–16 carry NO cooperation-hats flag; world 17 carries it (the #414 narrow, positively)', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(Object.prototype.hasOwnProperty.call(flags, 'dsCoopHatsOff'), `world ${v}`)
        .toBe(false);
    }
    expect((a4MatchFlags(17) as Record<string, unknown>).dsCoopHatsOff).toBe(true);
    for (const v of [12, 13, 14, 15, 16] as const) {
      expect(worldMatch(v).dsCoopHatsOff).toBe(false);
    }
    expect(worldMatch(17).dsCoopHatsOff).toBe(true);
  });

  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(ds2ArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.dsCoopHatsOff).toBe(false);
  });

  it('the league serializes nothing new (the worker plays the SHIPPED world — canon #283.2(iv))', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(DS2_WORLD_VERSION);
    expect(Object.keys(league.toJSON())).not.toContain('matchFlags');
    const serialized = JSON.stringify(league.toJSON());
    expect(serialized).not.toContain('dsCoopHatsOff');
    expect(serialized).not.toContain('dsOwnRun');
    expect(serialized).not.toContain('dsHatsOff');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.dsCoopHatsOff).toBe(false);
    expect(simmed.dsOwnRun).toBe(false);
    expect(simmed.dsHatsOff).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ THE DEFAULT LANDING WORLD IS UNCHANGED — the app still starts at 0', () => {
    expect(APP).toContain('private a4World: A4WorldVersion = 0;');
  });
});

/* ========================================================================== */
/* ⭐⭐ THE MUTANT WALK — four mutants, each killed by a NAMED pin              */
/* ========================================================================== */

describe('W17 — ⭐⭐ THE MUTANT WALK: four mutants, each killed', () => {
  it('M1 — the door dropped from `DS2_WORLD_DOORS` ⇒ the flag set stops matching and 17 reads 0', () => {
    const mutated = { ...a4MatchFlags(DS_WORLD_VERSION) };
    expect(mutated).not.toEqual(a4MatchFlags(DS2_WORLD_VERSION)); // killed by FIDELITY
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = mutated;
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, DS2_WORLD_VERSION);
    expect(m.dsCoopHatsOff).toBe(false);
    expect(ds2ArmedVersion(m)).toBe(0); // killed by CONTAINMENT
    expect(a4ArmedVersion(m)).toBe(DS_WORLD_VERSION); // …it falls back to what it contains
  });

  it('M2 — the composer calling `a4MatchFlags(15)` instead of 16 ⇒ world 16\'s doors are gone', () => {
    const mutated = { ...a4MatchFlags(GK_WORLD_VERSION), ...DS2_WORLD_DOORS };
    expect(mutated).not.toEqual(a4MatchFlags(DS2_WORLD_VERSION)); // killed by FIDELITY
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = mutated;
    const m = league.createMatch(league.nextFixture()!);
    armA4World(m, null, DS2_WORLD_VERSION);
    expect(m.dsOwnRun).toBe(false);
    expect(m.dsHatsOff).toBe(false);
    expect(dsArmedVersion(m)).toBe(0);
    expect(ds2ArmedVersion(m)).toBe(0); // killed by CONTAINMENT (17 requires 16)
  });

  it('M3 — the URL bound NOT MOVED ⇒ `?a4world=17` would read null', () => {
    expect(a4UrlOverride('?a4world=17')).toBe(17); // killed by THE URL pin
    expect(a4UrlOverride('?a4world=18')).toBe(18); // #424 item 5: the IF entry
    expect(a4UrlOverride('?a4world=19')).toBeNull(); // …and a nineteenth does not
  });

  it('M4 — `a4ArmedVersion` reading 16 BEFORE 17 ⇒ a world-17 match would name itself 16', () => {
    // the mutant's own read, spelled out: asking 16 first on a world-17 match answers 16
    const seventeen = worldMatch(17);
    expect(dsArmedVersion(seventeen)).toBe(DS_WORLD_VERSION); // …what the mutant would return
    expect(a4ArmedVersion(seventeen)).toBe(DS2_WORLD_VERSION); // killed by CONTAINMENT
    expect(SRC.indexOf('const raw17 = ds2ArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw16 = dsArmedVersion(match);')); // killed by SOURCE ORDER
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 17 is byte-identical to the dispatch HEAD  */
/* ========================================================================== */

/** The IDENTITY seeds — the family's own band, re-used on purpose (#414 item 5(vii)). */
const IDENTITY_SEEDS = Array.from({ length: 12 }, (_, i) => 900_007_200 + i);

/**
 * ⭐ THE DIGESTS RECORDED AT THE DISPATCH HEAD `4d3ff94`, in a CLEAN throwaway worktree
 * (`git worktree add /tmp/ds2-entry-base 4d3ff94`, a symlinked shared `node_modules`,
 * `git status --short` EMPTY), BEFORE a single byte of this rung was written. Each is `sha256`
 * of the twelve per-seed whole-match signatures joined by `|`, each walk armed through the
 * SHIPPED composer (`a4MatchFlags` + `armA4World`) at the ENGINE DEFAULT clock.
 * ⭐⭐ The bare / 12 / 13 / 14 / 15 literals are DS-ENTRY-RUNG §IDENTITY's, character for
 * character — no sim byte has moved since world 16's entry, and the band is deliberately the
 * same one.
 */
const BASELINE_DIGESTS = {
  bare: '062067553ef3ae85f329d3d422b0576e15296471666a0ecb3b6912c40554a8ab',
  world12: '34e882b240967047c746203cadcc39311ddee4a9fe595361365b3daa8ffaeae0',
  world13: '9c9d3117a27192ef31229294ecc050f1e0b5b3a08ca047cc50a8631dc03704e3',
  world14: '0f3887d491099f4a4a17e220d6a63fae929de1af46b45948ae3cf1069e7821cf',
  world15: '2016c431bdadf5401d38ddedf82bd0596b4062986b6eea6ee06ccdbf34c3f4be',
  world16: '7090f7e67350e80e63e4413020c22d1c381845c1e84fcd7417840bdde944d8a4',
} as const;

const pooledDigest = (version: 0 | 12 | 13 | 14 | 15 | 16 | 17): string => createHash('sha256')
  .update(IDENTITY_SEEDS.map((seed) => {
    const league = new League({ seed });
    if (version !== 0) league.matchFlags = a4MatchFlags(version);
    const match = league.createMatch(league.nextFixture()!);
    if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
    match.runToCompletion();
    return signature(match);
  }).join('|')).digest('hex');

describe('W17 — ⭐⭐ IDENTITY: the shipped world and every world below 17 are byte-identical', () => {
  it('the bare world, 12, 13, 14, 15 and 16 equal their `4d3ff94` digests', () => {
    expect(pooledDigest(0)).toBe(BASELINE_DIGESTS.bare);
    expect(pooledDigest(12)).toBe(BASELINE_DIGESTS.world12);
    expect(pooledDigest(13)).toBe(BASELINE_DIGESTS.world13);
    expect(pooledDigest(14)).toBe(BASELINE_DIGESTS.world14);
    expect(pooledDigest(15)).toBe(BASELINE_DIGESTS.world15);
    expect(pooledDigest(16)).toBe(BASELINE_DIGESTS.world16);
  }, 900_000);

  it('⭐ NON-VACUOUS: world 17 is a DIFFERENT world from world 16', () => {
    expect(pooledDigest(17)).not.toBe(BASELINE_DIGESTS.world16);
  }, 900_000);

  it('⭐ the production fingerprint literal is UNCHANGED (57b0bdab…c673)', () => {
    expect(repoText('tests/a4HomeGrant.test.ts')).toContain(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
  });
});

/* ========================================================================== */
/* ⭐⭐ LIVENESS — the #402 item 2(iii) form, with the dead-time exemption      */
/* ========================================================================== */

const LIVENESS_SEEDS = Array.from({ length: 12 }, (_, i) => 900_007_840 + i);

describe('W17 — ⭐⭐ LIVENESS: the door BITES (the #402 item 2(iii) form)', () => {
  /**
   * ⚠ THE DEAD-TIME EXEMPTION, STATED (ruling #402 item 2(iii), the G-BITE FORM RULE, extended
   * by #414 item 4(ii)): a liveness receipt NEVER claims "every seed". A population of full
   * matches contains DEAD TIME in which a flag has nothing to bite, and THIS flag's effect is a
   * RARE EVENT — DS-T1d's own frozen `gBite` went RED for exactly that reason: on 25 of 994
   * eligible E13 seeds and 4 of 999 D13 the two arms' FULL-TIME signatures coincided although
   * the control had issued a hat, and on EVERY one of them the per-seed ROW differed in 8–30
   * measurement fields. A full-time state snapshot is not a trajectory hash. This pin therefore
   * counts how many of twelve scratch seeds bit and asserts AT LEAST ONE — never a universal
   * over a population in which a rare hat can be absorbed before the whistle.
   */
  it('world 17 ≠ world 16 on at least ONE of 12 scratch seeds (rare-event dead time exempted)', () => {
    let bit = 0;
    for (const seed of LIVENESS_SEEDS) {
      const build = (v: 16 | 17): string => {
        const league = new League({ seed, matchDuration: 300 });
        league.matchFlags = a4MatchFlags(v);
        const m = league.createMatch(league.nextFixture()!);
        armA4World(m, null, v, L3_DOSE, PC_DOSE);
        m.runToCompletion();
        return signature(m);
      };
      if (build(17) !== build(16)) bit += 1;
    }
    expect(bit).toBeGreaterThanOrEqual(1);
  }, 900_000);
});
