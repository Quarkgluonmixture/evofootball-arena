import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE } from '../src/sim/types';
import {
  effectiveHomePriorObedience, homePriorOffsets, HOME_PRIOR_OBEDIENCE_OFFSET_MAX,
  HOME_PRIOR_OFFSET_SLOTS, type TacticalGenome,
} from '../src/evolution/genome';
import { homePriorStrength } from '../src/ai/stationEye';
import {
  A4_OBEDIENCE, A4_V2_EFFECTIVE_OBEDIENCE, A4_V2_OFFSETS, A4_WORLD_FLAGS,
  a4ArmedVersion, a4UrlOverride, armA4World, isA4Armed, loadA4Tables,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT, A4_BADGE_TEXT_V2, A4_BADGE_TEXTS, A4WorldBadge,
  type BadgeDoc, type BadgeElement,
} from '../src/ui/A4WorldBadge';
import { isShellAsset, precacheList } from '../scripts/pwaAssets';

/**
 * A4 PLAY-TEST ENTRY v2 — THE DISCIPLINE WORLD (commander ruling #167.5).
 *
 * The #156 contract, extended to a SECOND world. What is pinned here:
 *   (1) THE ARMED CONTENT IS THE CERTIFIED ONE, not a retyped copy — the whisper
 *       (0.5) and the frozen family [0,+.4,+.2,0,−.2,−.4] are compared against
 *       THREE independent frozen sources: the banked Leg F artifact (re-hashed to
 *       its declared SHA), the S2-P3 probe SOURCE text, and the stage doc's ⭐
 *       FROZEN block. The whole derivation (effective = the S2-P1 backLoaded
 *       vector; outfield mean = the matched whisper) is re-derived, not asserted.
 *   (2) ARMING writes obedience AND the family on BOTH sides, on all three genome
 *       references — and v1 arming writes NO family (the worlds never blend).
 *   (3) THE EVOLUTION FLAGS STAY OFF (#165.2.ii): a FIXED armed world mutates
 *       nothing; no src/** path turns an evolve opt-in on.
 *   (4) FLAG-OFF BYTE-IDENTITY survives: the production fingerprint 57b0bdab…c673
 *       is re-derived unchanged, born genomes carry no family, and the SW
 *       precache still ships NOTHING of either opt-in table to every install.
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
/** The Leg F artifact's own declared SHA (commander ruling #167.1). */
const LEGF_SHA = '1f2fc5d4bd56a43c02fbe8a2a262d407a0f2d76041eb6853d5c38f1c0aff4334';

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
/** every number in a text fragment (the docs use the typographic minus U+2212). */
const nums = (s: string): number[] =>
  [...s.replace(/\u2212/g, '-').matchAll(/-?\d*\.?\d+/g)].map((m) => Number(m[0]));
/** slot-wise float comparison — clamp01(0.5 − 0.4) is 0.09999999999999998. */
const expectVec = (got: readonly number[], want: readonly number[]): void => {
  expect(got).toHaveLength(want.length);
  got.forEach((v, i) => expect(v).toBeCloseTo(want[i], 12));
};

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

// ===========================================================================
describe('A4 v2 — the armed content IS the S2-P3 certified content (SHA-enforced)', () => {
  it('the banked Leg F artifact re-hashes to its declared SHA and carries the PASS', () => {
    const raw = repoText('docs/world-model/data/a4-s2p3-legf-fidelity.json');
    const doc = JSON.parse(raw) as Record<string, unknown> & { sha256: string };
    const { sha256, ...body } = doc;
    expect(createHash('sha256').update(JSON.stringify(body)).digest('hex')).toBe(sha256);
    expect(sha256).toBe(LEGF_SHA);
    expect(doc.mode).toBe('legF');
    expect(doc.hardGatesPass).toBe(true);
    expect(String(doc.verdict)).toContain('LEG F PASS');
  });

  it('⭐ the whisper + the family EQUAL the Leg F artifact\'s frozen parameters', () => {
    const doc = JSON.parse(repoText('docs/world-model/data/a4-s2p3-legf-fidelity.json')) as {
      parameters: {
        whisperObedience: number; frozenOffsetFamily: number[];
        backLoadedVector: number[]; offsetSlots: number;
      };
    };
    expect(A4_OBEDIENCE).toBe(doc.parameters.whisperObedience);
    expect([...A4_V2_OFFSETS]).toEqual(doc.parameters.frozenOffsetFamily);
    expect(A4_V2_OFFSETS).toHaveLength(doc.parameters.offsetSlots);
    // the OUTFIELD slots are the S2-P1 instrument vector exactly; slot 0 differs by
    // design (instrument 0 vs gene 0.5 for the GK) and Leg F proved that immaterial.
    expectVec(A4_V2_EFFECTIVE_OBEDIENCE.slice(1), doc.parameters.backLoadedVector.slice(1));
    expect(A4_V2_EFFECTIVE_OBEDIENCE[0]).toBe(A4_OBEDIENCE);
    expect(doc.parameters.backLoadedVector[0]).toBe(0);
  });

  it('…and the S2-P3 probe SOURCE\'s own literals (not a copy that drifted)', () => {
    const probe = repoText('scripts/probes/a4-s2p3-gene-battery.ts');
    const family = /const BACKLOADED_OFFSETS = \[([^\]]*)\] as const;/.exec(probe)?.[1];
    const vector = /const BACKLOADED_VECTOR = \[([^\]]*)\] as const;/.exec(probe)?.[1];
    const whisper = /const WHISPER_OBEDIENCE = ([\d.]+);/.exec(probe)?.[1];
    expect(family).toBeDefined();
    expect(vector).toBeDefined();
    expect(whisper).toBeDefined();
    expect(nums(family ?? '')).toEqual([...A4_V2_OFFSETS]);
    expectVec(nums(vector ?? '').slice(1), A4_V2_EFFECTIVE_OBEDIENCE.slice(1));
    expect(Number(whisper)).toBe(A4_OBEDIENCE);
  });

  it('…and the stage doc\'s ⭐ FROZEN FOR THE WHOLE STAGE block', () => {
    const doc = repoText('docs/world-model/A4-S2P3-GENE-BATTERY.md');
    const frozen = /FROZEN FOR THE WHOLE STAGE[\s\S]*?```text([\s\S]*?)```/.exec(doc)?.[1];
    expect(frozen).toBeDefined();
    const line = (label: string): number[] =>
      nums(new RegExp(`${label}[^\\n]*`).exec(frozen ?? '')?.[0]?.split('=')[1] ?? '');
    expect(line('homePriorObedience  ')).toEqual([A4_OBEDIENCE]);
    expect(line('homePriorObedienceOffset')).toEqual([...A4_V2_OFFSETS]);
    expectVec(line('⇒ effective obedience'), A4_V2_EFFECTIVE_OBEDIENCE);
  });

  it('⭐ the derivation re-computes: effective = the S2-P1 vector, outfield mean = the whisper', () => {
    const g: TacticalGenome = {} as TacticalGenome;
    g.homePriorObedience = A4_OBEDIENCE;
    const armed = { ...g, homePriorObedienceOffset: [...A4_V2_OFFSETS] } as TacticalGenome;
    const effective = Array.from({ length: HOME_PRIOR_OFFSET_SLOTS },
      (_, i) => effectiveHomePriorObedience(armed, i));
    expectVec(effective, A4_V2_EFFECTIVE_OBEDIENCE);
    // the outfield (slots 1..5) IS the S2-P1 backLoaded vector, and its mean is the
    // matched v1 dose — v2 redistributes the whisper, it does not raise it.
    const outfield = effective.slice(1);
    expectVec(outfield, [0.9, 0.7, 0.5, 0.3, 0.1]);
    expect(outfield.reduce((a, b) => a + b, 0) / outfield.length).toBeCloseTo(A4_OBEDIENCE, 12);
    // slot 0 (the GK) is the role-blind neutral, and every offset is inside the bound.
    expect(A4_V2_OFFSETS[0]).toBe(0);
    for (const off of A4_V2_OFFSETS) {
      expect(Math.abs(off)).toBeLessThanOrEqual(HOME_PRIOR_OBEDIENCE_OFFSET_MAX);
    }
    expect(HOME_PRIOR_OFFSET_SLOTS).toBe(TEAM_SIZE);
    // consumption goes through the SAME shipped map (no new mechanism, M-S2.2).
    expect(homePriorStrength(effective[1])).toBeGreaterThan(homePriorStrength(effective[5]));
  });
});

// ===========================================================================
describe('A4 v2 — arming writes the certified world on BOTH sides', () => {
  it('⭐ obedience 0.5 AND the family land on all three genome references, both sides', async () => {
    const tables = await loadA4Tables();
    const match = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(match, tables, 2);
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
    expect(a4ArmedVersion(match)).toBe(2);
  });

  it('v1 arming stays v1: the whisper only, NO family anywhere (the worlds never blend)', async () => {
    const tables = await loadA4Tables();
    const v1 = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(v1, tables); // the #156 default
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(v1, side)) {
        expect(g.homePriorObedience).toBe(A4_OBEDIENCE);
        expect(homePriorOffsets(g)).toBeUndefined();
      }
    }
    expect(a4ArmedVersion(v1)).toBe(1);
  });

  it('⭐ the EVOLUTION opt-ins stay OFF — a FIXED armed world mutates nothing (#165.2.ii)', () => {
    const files: string[] = [];
    const walk = (dir: string): void => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.ts')) files.push(p);
      }
    };
    walk('src');
    for (const f of files) {
      for (const raw of readFileSync(f, 'utf8').split('\n')) {
        expect(/evolveHomePrior\w*\s*:\s*true/.test(raw)).toBe(false);
      }
    }
    // the entry itself never reaches for a mutation path.
    const mod = repoText('src/game/a4World.ts');
    expect(mod).not.toContain('mutateGenome');
    expect(mod).not.toContain('crossoverGenomes');
  });

  it('v2 is a DIFFERENT world from v1 and from unarmed — and reproduces itself', async () => {
    const tables = await loadA4Tables();
    const unarmed = runToEnd(fixtureMatch({}));
    const v1 = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(v1, tables, 1);
    const v1Sig = runToEnd(v1);
    const v2 = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(v2, tables, 2);
    const v2Sig = runToEnd(v2);
    expect(v2Sig).not.toBe(unarmed);
    expect(v2Sig).not.toBe(v1Sig);
    const again = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(again, tables, 2);
    expect(runToEnd(again)).toBe(v2Sig);
  }, 90_000);
});

// ===========================================================================
describe('A4 v2 — the entry: one value, two worlds, desktop AND phone', () => {
  it('the URL entry carries ?a4world=2 (the phone link) and stays two-way', () => {
    expect(a4UrlOverride('?a4world=2')).toBe(2);
    expect(a4UrlOverride('?a4world=1')).toBe(1);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=3')).toBe(3); // the #184.2 wind-up world
    expect(a4UrlOverride('?a4world=4')).toBe(4); // the #211.3 MT worlds
    expect(a4UrlOverride('?a4world=5')).toBe(5);
    expect(a4UrlOverride('?a4world=6')).toBe(6); // the CB 过人 world (#269.4)
    expect(a4UrlOverride('')).toBeNull();
  });

  it('⭐ arming one world DISARMS the other — a single version value, no blend', () => {
    // the UI types one value: each checkbox writes the whole choice.
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('setA4World(v ? 1 : 0)');
    expect(settings).toContain('setA4World(v ? 2 : 0)');
    expect(settings).toContain('input(a4V1Box).checked = version === 1;');
    expect(settings).toContain('input(a4V2Box).checked = version === 2;');
    // …and the app holds ONE version, so no code path can carry both.
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('private a4World: A4WorldVersion = 0;');
    expect(app.match(/armA4World\(/g)).toHaveLength(1);
    // #282.4 added the world-7 dose as a fourth argument (null in every other world).
    expect(app).toContain('armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose);');
  });

  it('the ⚙ room (the phone entry) names both worlds in plain Chinese', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('A4 world v1 · 统一约定 (play-test)');
    expect(settings).toContain('A4 world v2 · 纪律 (play-test)');
    expect(settings).toContain('后卫紧、中场居中、前锋松');
  });

  it('⭐ the badge DISTINGUISHES the two worlds and relabels in place', () => {
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
    expect(A4_BADGE_TEXT).not.toBe(A4_BADGE_TEXT_V2);
    // v3 joined the record at #184.2 (its own chip is pinned in the v3 suite).
    expect(A4_BADGE_TEXTS[1]).toBe(A4_BADGE_TEXT);
    expect(A4_BADGE_TEXTS[2]).toBe(A4_BADGE_TEXT_V2);

    const badge = new A4WorldBadge(doc);
    badge.setWorld(1);
    expect(badge.world).toBe(1);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT);
    badge.setWorld(2); // switching worlds: ONE chip, renamed
    expect(children).toHaveLength(1);
    expect(badge.world).toBe(2);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT_V2);
    badge.setWorld(2); // idempotent
    expect(children).toHaveLength(1);
    badge.setWorld(0);
    expect(badge.world).toBe(0);
    expect(children).toHaveLength(0);
  });

  it('the feed says WHICH world was armed', () => {
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('🧪 A4 约定世界 v2 · 纪律 ON');
    expect(app).toContain('🧪 A4 约定世界 v1 · 统一 ON');
  });
});

// ===========================================================================
describe('A4 v2 — DEFAULT OFF: the non-opt-in player gets a byte-identical game', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000);

  it('an unarmed match carries no eye, no whisper and NO family', () => {
    const match = fixtureMatch({});
    expect(match.stationEye).toBeNull();
    expect(a4ArmedVersion(match)).toBe(0);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(match, side)) {
        expect(g.homePriorObedience).toBeUndefined();
        expect(homePriorOffsets(g)).toBeUndefined();
      }
    }
  });

  it('v2 adds NOTHING to the every-install payload (the #156.2 precache exclusion holds)', () => {
    const mod = repoText('src/game/a4World.ts');
    // still exactly the two opt-in tables, still dynamic — v2 reuses them.
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
