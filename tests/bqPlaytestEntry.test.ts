import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import {
  BQ_WORLD_DOORS, BQ_WORLD_VERSION, CORRIDOR_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_VERSION,
  RA_WORLD_WEIGHT,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, bqArmedVersion, corridorArmedVersion,
  isBqWorld, isRaWorld, poolPcDoseTable, poolT1DoseCells, raArmedVersion,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_BQ, A4_BADGE_TEXT_BQ_EMPTY, A4_BADGE_TEXTS, A4_BADGE_TEXTS_EMPTY, A4WorldBadge,
} from '../src/ui/A4WorldBadge';
import type { TacticalGenome } from '../src/evolution/genome';

/**
 * ⭐⭐ THE BQ ENTRY — `?a4world=13` (缓冲留球, the ONE cushion door at BQ-T1's ARMED
 * composition). Ruling #386 item 5; docs/world-model/BQ-ENTRY-RUNG.md. The THIRTEENTH entry of
 * the #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6/#309.5/#337.5/#365 family.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 13 IS world 12 plus EXACTLY the ONE door `bqCushion`, and it says
 *       so by CALLING the world-12 composition; ⛔ NOTHING ELSE rides along (`bfFacingCost`,
 *       `rcAnticipate`, `rcReady`, `edsTouchCost` are all absent — #386 item 4(vii)).
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — 13 → 12 → 11 → … (the BU-T1 mislabel
 *       class): a world-13 match names itself 13 and NEVER 12; a world-12 match never reads 13.
 *   (3) ⭐ THE URL parses 13 and the bound moves to 14; the badge carries 13 in BOTH dose forms.
 *   (4) ⭐⭐ THE HONEST BRIEF — the blurbs carry WHAT IT DOES, THE COST (the defender's poke
 *       inside the window falls) and THE FIRST-LOOK DISCLOSURE (the user's three sentences did
 *       NOT move; the lane carom is not this door's).
 *   (5) ⭐⭐ IDENTITY BELOW 13 — pooled whole-match digests for the bare world, world 11 and
 *       world 12 equal the digests RECORDED at the dispatch HEAD `1d321cf` (clean worktree),
 *       and the production fingerprint literal is unchanged.
 *   (6) DORMANCY — worlds 1–12 carry no `bqCushion`; a plain League match reads as no world.
 *
 * ⚠ SEEDS: OUT-OF-BAND SCRATCH ONLY — 900,003,300–399 (#386 item 5(v)); zero frontier
 * consumption, ZERO sims of record.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/BQ-ENTRY-RUNG.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

/** ⭐ THE THREE BRIEF SENTENCES OF RECORD (#386 item 5(ii)) — the player must be able to read them. */
const DOES_LINE = '缓冲留球';
const COST_LINE = '每场 1.900802 → 1.406814';
const FIRST_LOOK = '三个区间全部含零';

const SCRATCH = 900_003_310;

/** A world built exactly the way the app builds it: flags at construction, arming after. */
const worldMatch = (version: 11 | 12 | 13, dosed = true, seed = SCRATCH): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = a4MatchFlags(version);
  const match = league.createMatch(league.nextFixture()!);
  armA4World(match, null, version, dosed ? L3_DOSE : null, dosed ? PC_DOSE : null);
  return match;
};

describe('W13 — ⭐ FIDELITY: the world IS the exam\'s ARMED composition, ONE door', () => {
  it('world 13 is `a4MatchFlags(12)` ∪ { bqCushion }, key for key', () => {
    expect(BQ_WORLD_VERSION).toBe(13);
    const flags = a4MatchFlags(BQ_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS });
    expect(BQ_WORLD_DOORS).toEqual({ bqCushion: true });
    const twelve = a4MatchFlags(RA_WORLD_VERSION) as Record<string, boolean>;
    expect(Object.keys(flags).filter((k) => !(k in twelve)).sort()).toEqual(['bqCushion']);
    for (const k of Object.keys(twelve)) expect(flags[k]).toBe(twelve[k]);
  });

  it('⛔ NOTHING ELSE RIDES ALONG (#386 item 4(vii)): no BF, no RC, no EDS touch cost', () => {
    const flags = a4MatchFlags(BQ_WORLD_VERSION) as Record<string, unknown>;
    for (const k of ['bfFacingCost', 'rcAnticipate', 'rcReady', 'edsTouchCost']) {
      expect(flags[k]).toBeUndefined();
    }
    const m = worldMatch(13) as unknown as Record<string, unknown>;
    expect(m.bfFacingCost).toBeFalsy();
    expect(m.rcAnticipate).toBeFalsy();
    expect(m.rcReady).toBeFalsy();
    expect(m.edsTouchCost).toBeFalsy();
  });

  it('⭐⭐ the composition is CALLED, not copied; the arming IS world 12\'s, called', () => {
    expect(SRC).toContain('return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };');
    expect(SRC).toContain('armRaWorld(match, l3Dose, pcDose);');
    // ⭐ NO GENE PINS — the cushion is a BODY LAW: world 12's two pins arrive by the call and
    // world 13 writes nothing of its own; the franchise genome stays clean.
    const m = worldMatch(13);
    for (const side of [0, 1] as const) {
      const eff = m.teams[side].effGenome as TacticalGenome;
      expect(eff.passLeadSupport).toBe(RA_WORLD_LEAD);
      expect(eff.raAccessWeight).toBe(RA_WORLD_WEIGHT);
      const info = m.teams[side].info.genome as TacticalGenome;
      expect(info.passLeadSupport).toBeUndefined();
      expect(info.raAccessWeight).toBeUndefined();
    }
    expect(m.bqCushion).toBe(true);
  });

  it('⭐⭐ the version value is containment-ordered: 13 names itself 13; 12 stays 12; 11 stays 11', () => {
    const thirteen = worldMatch(13);
    expect(bqArmedVersion(thirteen)).toBe(BQ_WORLD_VERSION);
    expect(a4ArmedVersion(thirteen)).toBe(BQ_WORLD_VERSION);
    // …and the worlds it contains still read as themselves underneath
    expect(raArmedVersion(thirteen)).toBe(RA_WORLD_VERSION);
    expect(corridorArmedVersion(thirteen)).toBe(CORRIDOR_WORLD_VERSION);
    const twelve = worldMatch(12);
    expect(bqArmedVersion(twelve)).toBe(0);
    expect(a4ArmedVersion(twelve)).toBe(RA_WORLD_VERSION); // ⛔ never 13
    const eleven = worldMatch(11);
    expect(bqArmedVersion(eleven)).toBe(0);
    expect(a4ArmedVersion(eleven)).toBe(CORRIDOR_WORLD_VERSION);
    // the EMPTY-BOOK form is the same world 13
    const emptyForm = worldMatch(13, false);
    expect(a4ArmedVersion(emptyForm)).toBe(BQ_WORLD_VERSION);
    // the SOURCE ORDER itself: 13 is asked before 12
    expect(SRC.indexOf('const raw13 = bqArmedVersion(match);'))
      .toBeLessThan(SRC.indexOf('const raw12 = raArmedVersion(match);'));
  });

  it('⭐ the URL parses 13 and the bound moves to 14; isBqWorld agrees', () => {
    expect(a4UrlOverride('?a4world=13')).toBe(13);
    expect(a4UrlOverride('?a4world=14')).toBe(14); // the LN entry (#396 item 4)
    // ⚠ NARROWED BY GK-ENTRY (ruling #402 item 5), the DF-T0 §P7 form — stated POSITIVELY:
    // `?a4world=15` now parses as the GK dive entry and the bound moves up by one.
    expect(a4UrlOverride('?a4world=15')).toBe(15); // the GK entry (#402 item 5)
    expect(a4UrlOverride('?a4world=16')).toBeNull(); // …and a sixteenth does not
    expect(isBqWorld(13)).toBe(true);
    expect(isBqWorld(12)).toBe(false);
    expect(isRaWorld(13)).toBe(false);
    expect(SRC).toContain('?a4world=13` arms that world + 缓冲留球');
  });

  it('⭐ the badge carries 13 in BOTH dose forms, and the chip mounts', () => {
    expect(A4_BADGE_TEXTS[13]).toBe(A4_BADGE_TEXT_BQ);
    expect(A4_BADGE_TEXTS_EMPTY[13]).toBe(A4_BADGE_TEXT_BQ_EMPTY);
    expect(A4_BADGE_TEXT_BQ).toContain('缓冲留球');
    expect(A4_BADGE_TEXT_BQ_EMPTY).toContain('空账本');
    expect(A4_BADGE_TEXT_BQ).not.toBe(A4_BADGE_TEXT_BQ_EMPTY);
    const els: { className: string; textContent: string | null }[] = [];
    const badge = new A4WorldBadge({
      createElement: () => {
        const e = { className: '', textContent: null as string | null, remove: () => {} };
        els.push(e);
        return e;
      },
      body: { appendChild: () => {} },
    });
    badge.setWorld(13);
    expect(badge.world).toBe(13);
    expect(badge.label).toBe(A4_BADGE_TEXT_BQ);
    badge.setWorld(13, A4_BADGE_TEXT_BQ_EMPTY);
    expect(badge.label).toBe(A4_BADGE_TEXT_BQ_EMPTY);
  });
});

describe('W13 — ⭐⭐ THE HONEST BRIEF: what it does, what it costs, what NOT to expect', () => {
  it('the settings blurb carries all three sentences', () => {
    expect(SETTINGS).toContain('缓冲留球 · 球跟着人走,三拍之后还在脚边 (play-test)');
    expect(SETTINGS).toContain(DOES_LINE);
    expect(SETTINGS).toContain('0.188637 → 0.117556'); // population.intended.nonPossessionShare, D
    expect(SETTINGS).toContain('0.077366 → 0.001666'); // notReachedMarginOfAttempts, D
    expect(SETTINGS).toContain(COST_LINE); // duel.opponentContactsPerMatch, D
    expect(SETTINGS).toContain('2.183367 → 2.205411'); // duel.tacklesPerMatch, D — contains zero
    expect(SETTINGS).toContain('30.845691 → 31.079158'); // df.interceptionsPerMatch, D
    expect(SETTINGS).toContain(FIRST_LOOK); // the user's three faces did NOT move
    expect(SETTINGS).toContain('不是这扇门的事'); // the lane carom is ②/③'s
  });
  it('the feed blurb (GameApp) carries the same brief, in BOTH dose forms', () => {
    expect(APP).toContain('🧪 缓冲留球 ON');
    expect(APP).toContain('🧪 缓冲留球 · 空账本 ON');
    expect(APP).toContain(COST_LINE);
    expect(APP).toContain('不是这扇门的事');
  });
  it('⛔ the brief promises NOTHING about the user\'s three sentences', () => {
    // the exam found them unmoved; the blurbs must SAY so rather than claim a move
    for (const text of [SETTINGS, APP]) {
      const i = text.indexOf('对手先碰到球');
      expect(i).toBeGreaterThan(-1);
      expect(text.slice(i, i + 400)).toContain('含零');
    }
  });
  it('the entry doc exists and names its rulings and its exam', () => {
    expect(DOC).toContain('#386');
    expect(DOC).toContain('#384');
    expect(DOC).toContain('BQ-T1');
    expect(DOC).toContain('BQ-T0');
  });
});

describe('W13 — DORMANCY below and Road B', () => {
  it('worlds 1–12 carry NO bqCushion; world 13 carries it (the #386 narrow, positively)', () => {
    for (const v of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const) {
      const flags = a4MatchFlags(v) as Record<string, unknown>;
      expect(flags.bqCushion).toBeUndefined();
    }
    expect((a4MatchFlags(13) as Record<string, unknown>).bqCushion).toBe(true);
  });
  it('a plain League match reads as no world at all', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    const m = league.createMatch(league.nextFixture()!);
    expect(bqArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
    expect(m.bqCushion).toBe(false);
  });
  it('the league serializes nothing new (the worker plays the SHIPPED world)', () => {
    const league = new League({ seed: SCRATCH, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(BQ_WORLD_VERSION);
    expect(JSON.stringify(league.toJSON())).not.toContain('bqCushion');
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.bqCushion).toBe(false);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });
});

/* ========================================================================== */
/* ⭐⭐ IDENTITY — every world BELOW 13 is byte-identical to the dispatch HEAD */
/* ========================================================================== */

/** The whole-match signature, field for field the `bkPlaytestEntry.test.ts` helper. */
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

/** The IDENTITY seeds — scratch, out of band (#386 item 5(v)). */
const IDENTITY_SEEDS = [900_003_300, 900_003_301];

/**
 * ⭐ THE DIGESTS RECORDED AT THE DISPATCH HEAD `1d321cf`, in a CLEAN throwaway worktree
 * (`git worktree add /tmp/bq-entry-base 1d321cf`, `git status --short` EMPTY), BEFORE a single
 * byte of this rung was written. Each is `sha256` of the two per-seed whole-match signatures
 * joined by `|`, each walk armed through the SHIPPED composer (`a4MatchFlags` + `armA4World`)
 * at the ENGINE DEFAULT clock.
 */
const BASELINE_DIGESTS = {
  bare: '088450df2498bdb1f0c8374fa58bf2b59c5246d2b6e0ebc13d33d1e5fde7054f',
  world11: '4ab7cfee2494b8428becf5bbd2f8e30533344cdcf8483ac5eaa5ec01e0d9b5d6',
  world12: '4dcddca8a641e740f15bd68d5693204b883573eb1594909bca125f5f1eaecc06',
} as const;

const pooledDigest = (version: 0 | 11 | 12 | 13): string => createHash('sha256').update(
  IDENTITY_SEEDS.map((seed) => {
    const league = new League({ seed });
    if (version !== 0) league.matchFlags = a4MatchFlags(version);
    const match = league.createMatch(league.nextFixture()!);
    if (version !== 0) armA4World(match, null, version, L3_DOSE, PC_DOSE);
    match.runToCompletion();
    return signature(match);
  }).join('|'),
).digest('hex');

describe('W13 — ⭐⭐ IDENTITY: the shipped world and every world below 13 are byte-identical', () => {
  it('the bare world, world 11 and world 12 equal their `1d321cf` digests', () => {
    expect(pooledDigest(0)).toBe(BASELINE_DIGESTS.bare);
    expect(pooledDigest(11)).toBe(BASELINE_DIGESTS.world11);
    expect(pooledDigest(12)).toBe(BASELINE_DIGESTS.world12);
  }, 600_000);

  it('⭐ NON-VACUOUS: world 13 is a DIFFERENT world from world 12', () => {
    expect(pooledDigest(13)).not.toBe(BASELINE_DIGESTS.world12);
  }, 600_000);

  it('⭐ the production fingerprint literal is UNCHANGED (57b0bdab…c673)', () => {
    // the literal of record lives in `tests/a4HomeGrant.test.ts`; this rung re-states it so a
    // world-13 change that moved production would go red here too
    expect(repoText('tests/a4HomeGrant.test.ts')).toContain(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
  });
});
