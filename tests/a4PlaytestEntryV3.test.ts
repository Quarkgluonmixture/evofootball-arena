import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import {
  effectiveHomePriorObedience, homePriorOffsets, HOME_PRIOR_OFFSET_SLOTS,
  type TacticalGenome,
} from '../src/evolution/genome';
import {
  A4_OBEDIENCE, A4_V2_EFFECTIVE_OBEDIENCE, A4_V2_OFFSETS, A4_WORLD_FLAGS, A4_WORLD_KEY,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, isA4Armed, loadA4Tables,
  readA4World, writeA4World,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT, A4_BADGE_TEXT_V2, A4_BADGE_TEXT_V3, A4_BADGE_TEXTS, A4WorldBadge,
  type BadgeDoc, type BadgeElement,
} from '../src/ui/A4WorldBadge';
import { isShellAsset, precacheList } from '../scripts/pwaAssets';

/**
 * A4 PLAY-TEST ENTRY v3 — 出球前摇 (commander ruling #184.2, on the user's 甲 at
 * #183.5: O1 cut-1 accepted as a certified banked mechanic and armed into the
 * play-test bundle).
 *
 * v3 is defined by SUBTRACTION: it is the v2 world with EXACTLY one thing added,
 * so what has to be pinned is the "exactly":
 *   (1) THE CONTENT IS V2's, not a re-derivation — the same whisper, the same
 *       frozen family on all three genome references on both sides, the same eye
 *       — asserted with the v2 test's own assertions, plus a direct v2-vs-v3
 *       content comparison. The ONE difference is `match.o1PassWindup`.
 *   (2) THE CENSUS SET IS NOT WIDENED (#184.2's binding constraint, contract §3
 *       FLAG HYGIENE): `A4_WORLD_FLAGS` is pinned key-for-key AND its source
 *       literal is pinned to contain no wind-up seam. v3 exists only as the
 *       ENTRY-LAYER composition `a4MatchFlags(3)`.
 *   (3) NO LEAK DOWNWARD: v1 and v2 arming leave the wind-up off — every world
 *       below v3 is the world it was before this commit, tick for tick.
 *   (4) DEFAULT OFF SURVIVES: the production fingerprint 57b0bdab…c673 is
 *       re-derived unchanged, an unarmed match carries no wind-up, and v3 adds
 *       NOTHING to the every-install precache (it ships no new payload at all).
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');

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
  const league = new League({ seed: 20260808, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

const genomesOf = (m: Match, side: 0 | 1): TacticalGenome[] => [
  m.teams[side].info.genome, m.teams[side].baseGenome, m.teams[side].effGenome,
] as TacticalGenome[];

/** The armed match of one version, built exactly the way the app builds it. */
const armedMatch = async (version: 1 | 2 | 3): Promise<Match> => {
  const tables = await loadA4Tables();
  const match = fixtureMatch(a4MatchFlags(version));
  armA4World(match, tables, version);
  return match;
};

/** The post-construction content the entry writes (everything except the flag). */
const contentOf = (m: Match): unknown => ({
  eye: m.stationEye === null ? null : {
    arm: m.stationEye.arm, scope: m.stationEye.scope, table: m.stationEye.table,
    v4: m.stationEye.v4, mergedTableSha: m.stationEye.v3?.mergedTableSha,
  },
  genomes: ([0, 1] as const).map((side) => genomesOf(m, side).map((g) => ({
    obedience: g.homePriorObedience,
    family: homePriorOffsets(g) === undefined ? undefined : [...homePriorOffsets(g)!],
  }))),
});

// ===========================================================================
describe('A4 v3 — the census set is NOT widened (the #184.2 binding constraint)', () => {
  it('⭐ A4_WORLD_FLAGS is byte-untouched: the same seven keys, the same values', () => {
    expect(A4_WORLD_FLAGS).toEqual({
      edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
      c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
    });
    expect(Object.keys(A4_WORLD_FLAGS)).toHaveLength(7);
    expect('o1PassWindup' in A4_WORLD_FLAGS).toBe(false);
    // …and the SOURCE literal itself carries no wind-up seam (a widened object
    // would move the eye's own census substrate, which is the trap #184.2 names).
    const block = /export const A4_WORLD_FLAGS = \{([\s\S]*?)\} as const;/
      .exec(repoText('src/game/a4World.ts'))?.[1];
    expect(block).toBeDefined();
    expect(block).not.toContain('o1PassWindup');
    const parsed: Record<string, boolean> = {};
    for (const [, k, v] of (block ?? '').matchAll(/(\w+):\s*(true|false)/g)) parsed[k] = v === 'true';
    expect(parsed).toEqual({ ...A4_WORLD_FLAGS });
    // it is still the P3′ probe's CENSUS_FLAGS, verbatim.
    const probe = repoText('scripts/probes/a4-p3prime-replication.ts');
    const census = /const CENSUS_FLAGS = \{([\s\S]*?)\} as const;/.exec(probe)?.[1];
    const probeParsed: Record<string, boolean> = {};
    for (const [, k, v] of (census ?? '').matchAll(/(\w+):\s*(true|false)/g)) probeParsed[k] = v === 'true';
    expect(probeParsed).toEqual({ ...A4_WORLD_FLAGS });
  });

  it('⭐ v3 exists ONLY as the entry-layer composition: v2 flags + o1PassWindup', () => {
    expect(a4MatchFlags(1)).toEqual({ ...A4_WORLD_FLAGS });
    expect(a4MatchFlags(2)).toEqual({ ...A4_WORLD_FLAGS });
    expect(a4MatchFlags(3)).toEqual({ ...A4_WORLD_FLAGS, o1PassWindup: true });
    // no leak into the versions below — the key is not even present.
    expect('o1PassWindup' in a4MatchFlags(1)).toBe(false);
    expect('o1PassWindup' in a4MatchFlags(2)).toBe(false);
    // and each call hands out its own object (no shared mutable world).
    const a = a4MatchFlags(3);
    a.o1PassWindup = false;
    expect(a4MatchFlags(3).o1PassWindup).toBe(true);
    expect(A4_WORLD_FLAGS.c7Windup).toBe(true);
  });
});

// ===========================================================================
describe('A4 v3 — arming is EXACTLY v2, plus the wind-up', () => {
  it('⭐ the v2 assertions hold verbatim on a v3 match (whisper + family, both sides)', async () => {
    const match = await armedMatch(3);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(match, side)) {
        expect(g.homePriorObedience).toBe(A4_OBEDIENCE);
        expect(homePriorOffsets(g)).toEqual([...A4_V2_OFFSETS]);
        for (let slot = 0; slot < HOME_PRIOR_OFFSET_SLOTS; slot++) {
          expect(effectiveHomePriorObedience(g, slot))
            .toBeCloseTo(A4_V2_EFFECTIVE_OBEDIENCE[slot], 12);
        }
      }
    }
    expect(match.stationEye?.v4?.homePrior).toBe(true);
    expect(isA4Armed(match)).toBe(true);
    expect(a4ArmedVersion(match)).toBe(3);
  });

  it('⭐ v3 content === v2 content: the ONE difference is o1PassWindup', async () => {
    const v2 = await armedMatch(2);
    const v3 = await armedMatch(3);
    expect(contentOf(v3)).toEqual(contentOf(v2));
    expect(v2.o1PassWindup).toBe(false);
    expect(v3.o1PassWindup).toBe(true);
    // the mechanic is not just declared — it FIRES in the armed world.
    let reached = 0;
    while (!v3.finished) {
      v3.step(DT);
      if (v3.pendingPassWindup !== null) reached++;
    }
    expect(reached).toBeGreaterThan(0);
    expect(v3.pendingPassWindup).toBeNull(); // and nothing is left hanging at the whistle
  }, 90_000);

  it('v1/v2 arming leaves the wind-up OFF — no leak into the worlds below', async () => {
    for (const version of [1, 2] as const) {
      const match = await armedMatch(version);
      expect(match.o1PassWindup).toBe(false);
      expect(match.pendingPassWindup).toBeNull();
      expect(a4ArmedVersion(match)).toBe(version);
    }
    // v1 still carries no family, so v3's arming path did not widen v1 either.
    const v1 = await armedMatch(1);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(v1, side)) expect(homePriorOffsets(g)).toBeUndefined();
    }
  });

  it('v3 is a DIFFERENT world from v2 and from unarmed — and reproduces itself', async () => {
    const unarmed = runToEnd(fixtureMatch({}));
    const v2Sig = runToEnd(await armedMatch(2));
    const v3Sig = runToEnd(await armedMatch(3));
    expect(v3Sig).not.toBe(unarmed);
    expect(v3Sig).not.toBe(v2Sig);
    expect(runToEnd(await armedMatch(3))).toBe(v3Sig);
  }, 120_000);
});

// ===========================================================================
describe('A4 v3 — the entry: one value, three worlds, desktop AND phone', () => {
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

  it('the URL entry carries ?a4world=3 (the phone link) and stays exclusive', () => {
    expect(a4UrlOverride('?a4world=3')).toBe(3);
    expect(a4UrlOverride('?a4world=2')).toBe(2);
    expect(a4UrlOverride('?a4world=1')).toBe(1);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=4')).toBe(4); // the #211.3 MT worlds
    expect(a4UrlOverride('?a4world=5')).toBe(5);
    expect(a4UrlOverride('?a4world=6')).toBe(6); // the CB 过人 world (#269.4)
    expect(a4UrlOverride('')).toBeNull();
  });

  it('⭐ the sticky key stores 1 / 2 / 3 and reads back the same world', () => {
    storage();
    for (const version of [1, 2, 3] as const) {
      writeA4World(version);
      expect(localStorage.getItem(A4_WORLD_KEY)).toBe(String(version));
      expect(readA4World()).toBe(version);
    }
    writeA4World(0);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBeNull();
    expect(readA4World()).toBe(0);
  });

  it('⭐ arming one world DISARMS the others — a single version value, no blend', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('setA4World(v ? 1 : 0)');
    expect(settings).toContain('setA4World(v ? 2 : 0)');
    expect(settings).toContain('setA4World(v ? 3 : 0)');
    expect(settings).toContain('input(a4V1Box).checked = version === 1;');
    expect(settings).toContain('input(a4V2Box).checked = version === 2;');
    expect(settings).toContain('input(a4V3Box).checked = version === 3;');
    // …and the app holds ONE version, armed through ONE call, with ONE flag site.
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('private a4World: A4WorldVersion = 0;');
    expect(app.match(/armA4World\(/g)).toHaveLength(1);
    // #282.4 added the world-7 dose as a fourth argument (null in every other world).
    expect(app).toContain('armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose);');
    expect(app.match(/a4MatchFlags\(this\./g)).toHaveLength(1);
    expect(app).toContain('this.league.matchFlags = this.a4World');
    expect(app).toContain('? a4MatchFlags(this.a4World)');
  });

  it('the ⚙ room names v3 in plain Chinese (the feel list, in the user\'s words)', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('A4 world v3 · 出球前摇 (play-test)');
    expect(settings).toContain('出球前有一个看得见的摆腿窗口');
    expect(settings).toContain('一脚出球');
  });

  it('⭐ the badge DISTINGUISHES v3 and relabels in place', () => {
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
    expect(A4_BADGE_TEXT_V3).toBe('🧪 A4 约定世界 v3 · 前摇');
    expect(new Set([A4_BADGE_TEXT, A4_BADGE_TEXT_V2, A4_BADGE_TEXT_V3]).size).toBe(3);
    // (4/5 = the #211.3 MT worlds, a different family with its own names)
    expect(A4_BADGE_TEXTS[1]).toBe(A4_BADGE_TEXT);
    expect(A4_BADGE_TEXTS[2]).toBe(A4_BADGE_TEXT_V2);
    expect(A4_BADGE_TEXTS[3]).toBe(A4_BADGE_TEXT_V3);

    const badge = new A4WorldBadge(doc);
    badge.setWorld(2);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT_V2);
    badge.setWorld(3); // switching worlds: ONE chip, renamed
    expect(children).toHaveLength(1);
    expect(badge.world).toBe(3);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT_V3);
    badge.setWorld(3); // idempotent
    expect(children).toHaveLength(1);
    badge.setWorld(0);
    expect(badge.world).toBe(0);
    expect(children).toHaveLength(0);
  });

  it('the feed says WHICH world was armed, and arming reloads the fixture', () => {
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('🧪 A4 约定世界 v3 · 前摇 ON');
    expect(app).toContain('🧪 A4 约定世界 v2 · 纪律 ON');
    expect(app).toContain('🧪 A4 约定世界 v1 · 统一 ON');
    // the same-fixture reload (the flag is a CONSTRUCTION flag, so the world only
    // arrives on a rebuilt match): flags pushed, then the fixture reloaded.
    const arm = app.slice(app.indexOf('private async armA4('));
    const body = arm.slice(0, arm.indexOf('\n  }'));
    expect(body.indexOf('this.applyEdsPreview();'))
      .toBeLessThan(body.indexOf('this.loadNextFixture();'));
  });
});

// ===========================================================================
describe('A4 v3 — DEFAULT OFF: the non-opt-in player gets a byte-identical game', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000);

  it('an unarmed match carries no eye, no whisper, no family and NO wind-up', () => {
    const match = fixtureMatch({});
    expect(match.stationEye).toBeNull();
    expect(match.o1PassWindup).toBe(false);
    expect(match.pendingPassWindup).toBeNull();
    expect(a4ArmedVersion(match)).toBe(0);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(match, side)) {
        expect(g.homePriorObedience).toBeUndefined();
        expect(homePriorOffsets(g)).toBeUndefined();
      }
    }
  });

  it('a plain League still builds an unarmed match (matchFlags empty in production)', () => {
    const league = new League({ seed: 20260808, matchDuration: 300 });
    expect(league.matchFlags).toEqual({});
    expect(league.createMatch(league.nextFixture()!).o1PassWindup).toBe(false);
  });

  it('v3 adds NOTHING to the every-install payload (the #156.2 precache exclusion holds)', () => {
    const mod = repoText('src/game/a4World.ts');
    // still exactly the two opt-in tables, still dynamic — v3 is a flag, no payload.
    expect(mod.match(/await Promise\.all\(\[/g)).toHaveLength(1);
    // ⭐ #282.4: a THIRD dynamic import — world 7's matured dose (L3-T1's committed exam).
    // Still every world-model artifact behind an `import()`, so still nothing in the main path.
    expect(mod.match(/import\('\.\.\/\.\.\/docs\/world-model\/data\//g)).toHaveLength(3);
    expect(isShellAsset('assets/stage3-v4-p3p1-merged-role-census-table-Dabc123.js')).toBe(false);
    expect(isShellAsset('assets/stage3-v3-p2-control-recovery-Dabc123.js')).toBe(false);
    expect(precacheList([
      'assets/index-abc.js',
      'assets/stage3-v4-p3p1-merged-role-census-table-Dabc.js',
      'assets/stage3-v3-p2-control-recovery-Dabc.js',
    ])).toEqual(['./', './assets/index-abc.js', './index.html']);
  });
});
