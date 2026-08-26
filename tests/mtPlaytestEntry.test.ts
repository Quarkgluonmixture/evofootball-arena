import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import {
  homePriorOffsets, markSagWeight, pmLaneConvergenceK, type TacticalGenome,
} from '../src/evolution/genome';
import {
  A4_WORLD_FLAGS, A4_WORLD_KEY, MT_WORLD_ARM, MT_WORLD_DOSE, MT_WORLD_FLAGS,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, isA4Armed, isMtWorld,
  mtArmedVersion, readA4World, writeA4World, type MtWorldVersion,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_MT02, A4_BADGE_TEXT_MT08, A4_BADGE_TEXTS, A4WorldBadge,
  type BadgeDoc, type BadgeElement,
} from '../src/ui/A4WorldBadge';
import { isShellAsset, precacheList } from '../scripts/pwaAssets';

/**
 * THE MT PLAY-TEST ENTRY — 松盯内收 (commander ruling #211.3), the #168/#185 form.
 *
 * Two opt-in worlds, both the MT-LADDER's own measured arms made watchable:
 * world 4 = arm **D02**, the ruled KNEE 0.2 (the #209.2 pre-registered fallback, the
 * DEFAULT-named world); world 5 = arm **D08**, the 0.8 CONTRAST world where the
 * mechanism is visible and the scoreline deflates with it. What has to be pinned:
 *   (1) ⭐ FIDELITY — each world's armed state IS its ladder arm. TRIPLE-ANCHORED
 *       (the #168 precedent): the committed artifact `data/mt-ladder.json`
 *       (`frozenDesign.arms` + `frozenDesign.world`), the probe source
 *       `scripts/probes/mt-ladder.ts` (its `ARMS` / `PERCEPT_FLAGS` literals) and the
 *       stage doc's own §2 arm table must all agree with `MT_WORLD_FLAGS` /
 *       `MT_WORLD_DOSE` — no number is typed into this test that is not read back
 *       from at least one of the three.
 *   (2) BOTH SEAMS, BOTH CHECKLIST CHANNELS THAT A FIXED-DOSE WORLD OWNS (#196.3-D4):
 *       the two consumption flags AND a non-absent gene each, on all THREE genome
 *       views of BOTH teams (the `armGenes` idiom). The two EVOLUTION opt-ins stay
 *       OFF by construction — the world is fixed-dose, nothing in the user's league
 *       mutates either gene, and this module never even names them.
 *   (3) NO LEAK: the A4 census set is not widened, the A4 worlds stay seam-free, and
 *       an MT world carries no eye / no whisper / no discipline family.
 *   (4) DEFAULT OFF SURVIVES: the production fingerprint 57b0bdab…c673 unchanged, an
 *       unarmed match carries neither flag nor gene, and the worlds add NOTHING to
 *       the every-install precache (they ship no payload — not even the census).
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
/** Source with comments stripped — assertions about what the CODE does, not what it says. */
const codeOf = (p: string): string => repoText(p)
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/* --- the three fidelity anchors -------------------------------------------- */
interface LadderArm {
  arm: string; pmFlag: boolean; mtFlag: boolean;
  defLaneConvergence: number | null; markSag: number | null;
  kPm: number; markSagWeight: number;
}
interface LadderArtifact {
  resultSha256: string;
  frozenDesign: {
    arms: LadderArm[];
    doseBothTeams: boolean;
    world: Record<string, unknown>;
  };
}
const LADDER = JSON.parse(
  repoText('docs/world-model/data/mt-ladder.json'),
) as LadderArtifact;
const ladderArm = (id: string): LadderArm => {
  const arm = LADDER.frozenDesign.arms.find((a) => a.arm === id);
  if (arm === undefined) throw new Error(`ladder artifact has no arm ${id}`);
  return arm;
};
const PROBE = repoText('scripts/probes/mt-ladder.ts');
const DOC = repoText('docs/world-model/MT-LADDER.md');

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const runToEnd = (m: Match): string => {
  while (!m.finished) m.step(DT);
  return signature(m);
};

/** The first fixture of a short-match league, in whichever world `flags` names. */
const fixtureMatch = (flags: League['matchFlags']): Match => {
  const league = new League({ seed: 20260809, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

const genomesOf = (m: Match, side: 0 | 1): TacticalGenome[] => [
  m.teams[side].info.genome, m.teams[side].baseGenome, m.teams[side].effGenome,
] as TacticalGenome[];

/** An MT world built exactly the way the app builds it (flags at construction, genes after). */
const mtMatch = (version: MtWorldVersion): Match => {
  const match = fixtureMatch(a4MatchFlags(version));
  armA4World(match, null, version); // ⭐ no census tables: an MT world needs none
  return match;
};

// ===========================================================================
describe('MT entry — ⭐ FIDELITY: each world IS its ladder arm (triple-anchored)', () => {
  it('the ARTIFACT: flags and dose match arms D02 / D08 of the committed run', () => {
    expect(LADDER.resultSha256.startsWith('1716ffa3')).toBe(true); // the adjudicated run
    expect(LADDER.frozenDesign.doseBothTeams).toBe(true); // ⇒ both teams dosed
    for (const version of [4, 5] as const) {
      const arm = ladderArm(MT_WORLD_ARM[version]);
      expect(arm.pmFlag).toBe(true);
      expect(arm.mtFlag).toBe(true);
      // the coupled axis (#209.1): the two genes EQUAL, and equal to our dose
      expect(arm.defLaneConvergence).toBe(arm.markSag);
      expect(MT_WORLD_DOSE[version]).toBe(arm.defLaneConvergence);
      // the arm's own derived levels are what the engine will compute from that dose
      expect(pmLaneConvergenceK({ defLaneConvergence: MT_WORLD_DOSE[version] } as TacticalGenome))
        .toBeCloseTo(arm.kPm, 12);
      expect(markSagWeight({ markSag: MT_WORLD_DOSE[version] } as TacticalGenome))
        .toBeCloseTo(arm.markSagWeight, 12);
    }
    // world 4 is the ruled KNEE, world 5 the top of the measured ladder
    expect(MT_WORLD_DOSE[4]).toBe(0.2);
    expect(MT_WORLD_DOSE[5]).toBe(0.8);
    // …and the arm world carried NO eye and exactly the percept substrate
    expect(LADDER.frozenDesign.world.stationEye).toBeNull();
    expect(LADDER.frozenDesign.world.edsPerceivedDefence).toBe(true);
    expect(LADDER.frozenDesign.world.edsPerceivedChoice).toBe(true);
    expect(MT_WORLD_FLAGS).toEqual({
      edsPerceivedDefence: LADDER.frozenDesign.world.edsPerceivedDefence,
      edsPerceivedChoice: LADDER.frozenDesign.world.edsPerceivedChoice,
      pmLaneConvergence: true,
      mtMarkSag: true,
    });
  });

  it('the PROBE SOURCE: PERCEPT_FLAGS + the two seam flags, key for key', () => {
    const percept = /const PERCEPT_FLAGS = \{([\s\S]*?)\} as const;/.exec(PROBE)?.[1];
    expect(percept).toBeDefined();
    const parsed: Record<string, boolean> = {};
    for (const [, k, v] of (percept ?? '').matchAll(/(\w+):\s*(true|false)/g)) parsed[k] = v === 'true';
    expect(parsed).toEqual({ edsPerceivedDefence: true, edsPerceivedChoice: true });
    // MT_WORLD_FLAGS = that substrate ∪ the two flags the dosed arms throw
    expect(MT_WORLD_FLAGS).toEqual({ ...parsed, pmLaneConvergence: true, mtMarkSag: true });
    // and the probe's own arm rows carry our doses
    for (const version of [4, 5] as const) {
      const row = new RegExp(
        `id: '${MT_WORLD_ARM[version]}', pmFlag: true, mtFlag: true, pmGene: ([\\d.]+), mtGene: ([\\d.]+),`,
      ).exec(PROBE);
      expect(row).not.toBeNull();
      expect(Number(row![1])).toBe(MT_WORLD_DOSE[version]);
      expect(Number(row![2])).toBe(MT_WORLD_DOSE[version]);
    }
  });

  it('the STAGE DOC §2 table: the same two rows, the same two doses', () => {
    for (const version of [4, 5] as const) {
      const arm = MT_WORLD_ARM[version];
      const row = new RegExp(`\\| \\*\\*${arm}\\*\\* \\| \\*\\*on\\*\\* \\| \\*\\*([\\d.]+)\\*\\*`)
        .exec(DOC);
      expect(row).not.toBeNull();
      expect(Number(row![1])).toBe(MT_WORLD_DOSE[version]);
    }
  });
});

// ===========================================================================
describe('MT entry — arming: both seams, both teams, all three genome views', () => {
  it('⭐ the two consumption flags arrive at CONSTRUCTION and the dose on every view', () => {
    for (const version of [4, 5] as const) {
      const match = mtMatch(version);
      expect(match.pmLaneConvergence).toBe(true);
      expect(match.mtMarkSag).toBe(true);
      for (const side of [0, 1] as const) {
        for (const g of genomesOf(match, side)) {
          expect(g.defLaneConvergence).toBe(MT_WORLD_DOSE[version]);
          expect(g.markSag).toBe(MT_WORLD_DOSE[version]);
        }
      }
      expect(mtArmedVersion(match)).toBe(version);
      expect(a4ArmedVersion(match)).toBe(version);
    }
  });

  it('an MT world is NOT an A4 world: no eye, no whisper, no discipline family', () => {
    for (const version of [4, 5] as const) {
      const match = mtMatch(version);
      expect(match.stationEye).toBeNull();
      expect(isA4Armed(match)).toBe(false);
      for (const side of [0, 1] as const) {
        for (const g of genomesOf(match, side)) {
          expect(g.homePriorObedience).toBeUndefined();
          expect(homePriorOffsets(g)).toBeUndefined();
        }
      }
    }
  });

  it('FIXED DOSE: no evolution opt-in is armed — the entry never touches them', () => {
    // the CODE, comments stripped: the two mutation/crossover opt-ins
    // (`evolveDefLaneConvergence` / `evolveMarkSag`) are never written anywhere the
    // player's league can reach, so an armed world mutates nothing.
    for (const p of ['src/game/a4World.ts', 'src/game/GameApp.ts', 'src/ui/SettingsScreen.ts']) {
      expect(codeOf(p)).not.toContain('evolveMarkSag');
      expect(codeOf(p)).not.toContain('evolveDefLaneConvergence');
    }
  });

  it('the census set is NOT widened, and the A4 worlds stay seam-free', () => {
    expect('pmLaneConvergence' in A4_WORLD_FLAGS).toBe(false);
    expect('mtMarkSag' in A4_WORLD_FLAGS).toBe(false);
    for (const version of [1, 2, 3] as const) {
      expect(a4MatchFlags(version).pmLaneConvergence).toBeUndefined();
      expect(a4MatchFlags(version).mtMarkSag).toBeUndefined();
    }
    expect(a4MatchFlags(4)).toEqual({ ...MT_WORLD_FLAGS });
    expect(a4MatchFlags(5)).toEqual({ ...MT_WORLD_FLAGS });
    // each call hands out its own object (no shared mutable world)
    const a = a4MatchFlags(4);
    a.mtMarkSag = false;
    expect(a4MatchFlags(4).mtMarkSag).toBe(true);
  });

  it('⭐ the DOSE BITES: armed ≠ flags-only ≠ production, and each world reproduces itself', () => {
    const production = runToEnd(fixtureMatch({}));
    const flagsOnly = runToEnd(fixtureMatch(a4MatchFlags(4))); // both flags, genes ABSENT
    const w4 = runToEnd(mtMatch(4));
    const w5 = runToEnd(mtMatch(5));
    expect(w4).not.toBe(production);
    expect(w4).not.toBe(flagsOnly); // ⇐ the gene, not the flag, is doing the work
    expect(w5).not.toBe(w4); // ⇐ the two worlds are genuinely different doses
    expect(runToEnd(mtMatch(4))).toBe(w4);
    expect(runToEnd(mtMatch(5))).toBe(w5);
  }, 180_000);
});

// ===========================================================================
describe('MT entry — the entry: one value, five worlds, desktop AND phone', () => {
  const storage = (): void => {
    const map = new Map<string, string>();
    (globalThis as unknown as { localStorage: unknown }).localStorage = {
      getItem: (k: string): string | null => map.get(k) ?? null,
      setItem: (k: string, v: string): void => { map.set(k, v); },
      removeItem: (k: string): void => { map.delete(k); },
    };
  };
  afterEach(() => {
    delete (globalThis as unknown as { localStorage?: unknown }).localStorage;
  });

  it('the URL entry carries ?a4world=4 / 5 (the phone link) and stays exclusive', () => {
    expect(a4UrlOverride('?a4world=4')).toBe(4);
    expect(a4UrlOverride('?a4world=5')).toBe(5);
    expect(a4UrlOverride('?a4world=3')).toBe(3);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=6')).toBe(6); // the CB 过人 world (#269.4)
    expect(a4UrlOverride('?a4world=0.2')).toBeNull(); // the DOSE is not the param
  });

  it('the sticky key stores 4 / 5 and reads back the same world', () => {
    storage();
    for (const version of [4, 5] as const) {
      writeA4World(version);
      expect(localStorage.getItem(A4_WORLD_KEY)).toBe(String(version));
      expect(readA4World()).toBe(version);
    }
    writeA4World(0);
    expect(readA4World()).toBe(0);
  });

  it('⭐ arming one world DISARMS every other — a single version value, no blend', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('setA4World(v ? 4 : 0)');
    expect(settings).toContain('setA4World(v ? 5 : 0)');
    expect(settings).toContain('input(mt02Box).checked = version === 4;');
    expect(settings).toContain('input(mt08Box).checked = version === 5;');
    expect(settings).toContain('input(a4V1Box).checked = version === 1;');
    // …and the app still holds ONE version, armed through ONE call, ONE flag site.
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('private a4World: A4WorldVersion = 0;');
    expect(app.match(/armA4World\(/g)).toHaveLength(1);
    expect(app.match(/a4MatchFlags\(this\./g)).toHaveLength(1);
  });

  it('the ⚙ room names both worlds in plain Chinese, with the honest expectation', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('MT 0.2 · 松盯内收 (play-test)');
    expect(settings).toContain('MT 0.8 · 松盯内收 对比 (play-test)');
    // the sub-resolution disclosure at 0.2 and the price tag at 0.8, in the user's words
    expect(settings).toContain('在尺子的分辨率以下');
    expect(settings).toContain('进球变少的世界,好看还是难看');
  });

  it('⭐ the badge NAMES the dose and relabels in place', () => {
    interface FakeEl extends BadgeElement { removed: boolean }
    const children: FakeEl[] = [];
    const doc: BadgeDoc = {
      createElement: (): BadgeElement => {
        const el: FakeEl = {
          className: '', textContent: null, removed: false,
          remove(): void { this.removed = true; children.splice(children.indexOf(el), 1); },
        };
        return el;
      },
      body: { appendChild: (n: BadgeElement): void => { children.push(n as FakeEl); } },
    };
    expect(A4_BADGE_TEXT_MT02).toBe('🧪 MT 0.2 · 松盯内收');
    expect(A4_BADGE_TEXT_MT08).toBe('🧪 MT 0.8 · 松盯内收(对比)');
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(11); // eleven distinct names (#337.5)
    const badge = new A4WorldBadge(doc);
    badge.setWorld(4);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT_MT02);
    badge.setWorld(5); // switching worlds: ONE chip, renamed
    expect(children).toHaveLength(1);
    expect(badge.world).toBe(5);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT_MT08);
    badge.setWorld(0);
    expect(children).toHaveLength(0);
  });

  it('the feed says WHICH world was armed, and arming reloads the fixture', () => {
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('🧪 MT 0.2 · 松盯内收 ON');
    expect(app).toContain('🧪 MT 0.8 · 松盯内收(对比) ON');
    const arm = app.slice(app.indexOf('private async armA4('));
    const body = arm.slice(0, arm.indexOf('\n  }'));
    expect(body.indexOf('this.applyEdsPreview();'))
      .toBeLessThan(body.indexOf('this.loadNextFixture();'));
    // the MT worlds skip the census load entirely
    expect(body).toContain('!isMtWorld(version)');
  });
});

// ===========================================================================
describe('MT entry — DEFAULT OFF: the non-opt-in player gets a byte-identical game', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 180_000);

  it('an unarmed match carries neither flag nor gene, and reads as world 0', () => {
    const match = fixtureMatch({});
    expect(match.pmLaneConvergence).toBe(false);
    expect(match.mtMarkSag).toBe(false);
    expect(mtArmedVersion(match)).toBe(0);
    expect(a4ArmedVersion(match)).toBe(0);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(match, side)) {
        expect(g.defLaneConvergence).toBeUndefined();
        expect(g.markSag).toBeUndefined();
      }
    }
    const league = new League({ seed: 20260809, matchDuration: 300 });
    expect(league.matchFlags).toEqual({});
  });

  it('a flags-only match (gene absent) is still byte-identical to the same world unarmed', () => {
    // the G-BORN claim, at the entry layer: arming the flags without a dose changes
    // nothing, so a half-armed world can never leak a different game.
    const armedZero = fixtureMatch({ ...MT_WORLD_FLAGS });
    const percept = fixtureMatch({ edsPerceivedDefence: true, edsPerceivedChoice: true });
    expect(runToEnd(armedZero)).toBe(runToEnd(percept));
  }, 120_000);

  it('the MT worlds add NOTHING to the every-install payload (no census, no chunk)', () => {
    const mod = repoText('src/game/a4World.ts');
    expect(mod.match(/await Promise\.all\(\[/g)).toHaveLength(1);
    // ⭐ #282.4: a THIRD dynamic import — world 7's matured dose (L3-T1's committed exam).
    // ⭐ #300.6: a FOURTH — world 8's matured recognition dose (PC-T1's committed exam, `?raw`).
    // Still every world-model artifact behind an `import()`, so still nothing in the main path.
    expect(mod.match(/import\('\.\.\/\.\.\/docs\/world-model\/data\//g)).toHaveLength(4);
    expect(isShellAsset('assets/stage3-v4-p3p1-merged-role-census-table-Dabc123.js')).toBe(false);
    expect(precacheList([
      'assets/index-abc.js',
      'assets/stage3-v4-p3p1-merged-role-census-table-Dabc.js',
      'assets/stage3-v3-p2-control-recovery-Dabc.js',
    ])).toEqual(['./', './assets/index-abc.js', './index.html']);
    // and the ladder artifact/probe is NOT imported by src — the fidelity anchor
    // lives in THIS test, not in the bundle.
    expect(codeOf('src/game/a4World.ts')).not.toContain('mt-ladder');
  });

  it('isMtWorld is the whole family predicate (nothing else is an MT world)', () => {
    expect([0, 1, 2, 3].map((v) => isMtWorld(v as 0 | 1 | 2 | 3))).toEqual([false, false, false, false]);
    expect(isMtWorld(4)).toBe(true);
    expect(isMtWorld(5)).toBe(true);
  });
});
