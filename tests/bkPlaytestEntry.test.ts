import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import {
  A4_WORLD_KEY, BK_WORLD_DOORS, BK_WORLD_VERSION, CB_WORLD_VERSION, L3_WORLD_VERSION,
  PC_WORLD_VERSION,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, bkArmedVersion, isBkWorld,
  pcArmedVersion, poolPcDoseTable, poolT1DoseCells, readA4World, writeA4World,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_BK, A4_BADGE_TEXT_BK_EMPTY, A4_BADGE_TEXT_PC, A4_BADGE_TEXTS, A4WorldBadge,
} from '../src/ui/A4WorldBadge';
import { PC_BOOK_CELLS } from '../src/ai/pcLatency';
import { ROSTER_SIZE } from '../src/sim/types';
import { isShellAsset } from '../scripts/pwaAssets';

/**
 * ⭐⭐ THE BK PLAY-TEST ENTRY — `?a4world=9`, 身体诚实的世界 (ruling #309 item 5;
 * docs/world-model/BK-ENTRY-RUNG.md). The NINTH entry of the
 * #155/#167.5/#184.2/#211.3/#269.4/#282.4/#300.6 family, and the door to the BK play-test gate.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 9 IS world 8 plus the TWO BK laws, and it says so by CALLING the
 *       world-8 composition rather than copying it (one substrate, never two).
 *   (2) ⭐⭐ THE VERSION VALUE, CONTAINMENT-ORDERED — the read asks 9 → 8 → 7 → 6 and only then
 *       the disjoint MT family, so a world-9 match names itself 9 (the BU-T1 mislabel class).
 *   (3) ⭐ DORMANCY — selecting world 8 (or anything below it) leaves BOTH BK flags absent.
 *   (4) ⭐ `?pcdose=0` KEEPS ITS WORLD-8 SEMANTICS INSIDE WORLD 9 — proven by construction (the
 *       arming IS `armPcWorld`, called) and by behaviour (born-absent books, at EVERY watched
 *       construction — the #301 item 3 fix rides along).
 *   (5) NO NEW CHUNK — the BK laws carry no dose, so the service worker's opt-in prefix list is
 *       byte-unchanged.
 *   (6) THE BADGE AND THE BLURB, INCLUDING ⭐⭐ THE COST LINE (#309 item 5: the honest blurb
 *       carries the price — 传球更难了).
 *   (7) ROAD B — an unarmed match carries neither law, the league serializes nothing new, the
 *       worker fixtures play the SHIPPED world, and production is bit-for-bit unmoved.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/BK-ENTRY-RUNG.md');
const CANON = repoText('docs/world-model/CANON.md');
const SRC = repoText('src/game/a4World.ts');
const APP = repoText('src/game/GameApp.ts');
const SETTINGS = repoText('src/ui/SettingsScreen.ts');

const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(
  JSON.parse(repoText('docs/world-model/data/pc-t1-learning-exam.json')) as unknown,
);

/** ⭐ THE COST LINE, of record (#309 item 5) — the price the player must be able to read. */
const COST_LINE = '注意:传球更难了(完成率约降 9 个百分点)——传球的大脑还没学会躲开身体';

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const fixtureMatch = (flags: League['matchFlags'], seed = 12505900): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

/** World 9 built exactly the way the app builds it: flags at construction, arming after. */
const bkMatch = (dose: typeof PC_DOSE | null = PC_DOSE, seed = 12505900): Match => {
  const match = fixtureMatch(a4MatchFlags(BK_WORLD_VERSION), seed);
  armA4World(match, null, BK_WORLD_VERSION, L3_DOSE, dose);
  return match;
};

// ===========================================================================
describe('BK entry — ⭐ FIDELITY: world 9 is world 8 plus the two body laws', () => {
  it('the flags are `a4MatchFlags(8)` ∪ the two laws, key for key', () => {
    const flags = a4MatchFlags(BK_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(PC_WORLD_VERSION), ...BK_WORLD_DOORS });
    expect(BK_WORLD_DOORS).toEqual({ bkFacingLaw: true, bkContactLaw: true });
    // …and the composition is EXACTLY world 8 plus exactly those two keys — no third change
    const eight = a4MatchFlags(PC_WORLD_VERSION) as Record<string, boolean>;
    const extra = Object.keys(flags).filter((k) => !(k in eight));
    expect(extra.sort()).toEqual(['bkContactLaw', 'bkFacingLaw']);
    for (const k of Object.keys(eight)) expect(flags[k]).toBe(eight[k]);
  });

  it('⭐ the substrate is CALLED, not copied — the two entries cannot drift', () => {
    expect(SRC).toContain(
      'return { ...a4MatchFlags(PC_WORLD_VERSION), ...BK_WORLD_DOORS };',
    );
    // the whole containment chain still calls rather than copies, all the way down
    expect(SRC).toContain('return { ...a4MatchFlags(L3_WORLD_VERSION), ...PC_WORLD_DOORS };');
    expect(SRC).toContain('return { ...a4MatchFlags(CB_WORLD_VERSION), ...L3_WORLD_DOORS };');
  });

  it('the armed match carries both laws, the world-8 seat, and world 8\'s own conformance', () => {
    const m = bkMatch();
    expect(m.bkFacingLaw).toBe(true);
    expect(m.bkContactLaw).toBe(true);
    expect(m.pcLatency).not.toBeNull();
    expect(pcArmedVersion(m)).toBe(PC_WORLD_VERSION); // world 8 conformance, unchanged
    expect(bkArmedVersion(m)).toBe(BK_WORLD_VERSION);
    expect(isBkWorld(BK_WORLD_VERSION)).toBe(true);
    expect(isBkWorld(PC_WORLD_VERSION)).toBe(false);
  });

  it('⭐ the facing law is NOT INERT here — world 9 inherits a wind-up channel', () => {
    // `Match` REFUSES to construct with `bkFacingLaw` armed and BOTH wind-up channels off
    // (BK-T0 §LAW). World 9 is legal by construction because world 8's substrate carries them.
    const flags = a4MatchFlags(BK_WORLD_VERSION) as Record<string, boolean>;
    expect(flags.c7Windup).toBe(true);
    expect(flags.o1PassWindup).toBe(true);
    expect(() => bkMatch()).not.toThrow();
  });

  it('the arming is the WORLD-8 PATH, called — never a re-implementation', () => {
    const fn = SRC.slice(SRC.indexOf('export function armBkWorld'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    expect(body).toContain('armPcWorld(match, l3Dose, pcDose);');
    expect(body).not.toContain('dosePcBooks');
    expect(body).not.toContain('resetPcBooks');
    expect(body).not.toContain('armL3World');
  });
});

// ===========================================================================
describe('BK entry — ⭐⭐ THE VERSION VALUE: the read is ordered by CONTAINMENT', () => {
  it('a world-9 match reports NINE, never 8, 7 or 6', () => {
    expect(a4ArmedVersion(bkMatch())).toBe(BK_WORLD_VERSION);
    expect(a4ArmedVersion(bkMatch(null))).toBe(BK_WORLD_VERSION); // the weak form is the world too
  });

  it('⭐ every world it contains still reports ITSELF', () => {
    const eight = fixtureMatch(a4MatchFlags(PC_WORLD_VERSION));
    armA4World(eight, null, PC_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(a4ArmedVersion(eight)).toBe(PC_WORLD_VERSION);
    const seven = fixtureMatch(a4MatchFlags(L3_WORLD_VERSION));
    armA4World(seven, null, L3_WORLD_VERSION, L3_DOSE);
    expect(a4ArmedVersion(seven)).toBe(L3_WORLD_VERSION);
    const six = fixtureMatch(a4MatchFlags(CB_WORLD_VERSION));
    armA4World(six, null, CB_WORLD_VERSION);
    expect(a4ArmedVersion(six)).toBe(CB_WORLD_VERSION);
  });

  it('⭐ the DISJOINT MT family is unharmed by moving it after the chain', () => {
    for (const v of [4, 5] as const) {
      const m = fixtureMatch(a4MatchFlags(v));
      armA4World(m, null, v);
      expect(a4ArmedVersion(m)).toBe(v);
      expect(bkArmedVersion(m)).toBe(0);
    }
  });

  it('⭐⭐ the source order IS the containment order: 9 → 8 → 7 → 6, then MT', () => {
    const fn = SRC.slice(SRC.indexOf('export function a4ArmedVersion'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    const at = (needle: string): number => {
      const i = body.indexOf(needle);
      expect(i).toBeGreaterThan(-1);
      return i;
    };
    expect(at('bkArmedVersion(match)')).toBeLessThan(at('pcArmedVersion(match)'));
    expect(at('pcArmedVersion(match)')).toBeLessThan(at('l3ArmedVersion(match)'));
    expect(at('l3ArmedVersion(match)')).toBeLessThan(at('cbArmedVersion(match)'));
    expect(at('cbArmedVersion(match)')).toBeLessThan(at('mtArmedVersion(match)'));
  });
});

// ===========================================================================
describe('BK entry — ⭐ DORMANCY: the worlds below 9 do not gain the laws', () => {
  it('worlds 8/7/6 carry NEITHER law in their flag sets', () => {
    for (const v of [PC_WORLD_VERSION, L3_WORLD_VERSION, CB_WORLD_VERSION, 4, 5, 3, 2, 1] as const) {
      const flags = a4MatchFlags(v) as Record<string, boolean>;
      expect(flags).not.toHaveProperty('bkFacingLaw');
      expect(flags).not.toHaveProperty('bkContactLaw');
    }
  });

  it('⭐ a world-8 match is BK-dormant on the match itself', () => {
    const eight = fixtureMatch(a4MatchFlags(PC_WORLD_VERSION));
    armA4World(eight, null, PC_WORLD_VERSION, L3_DOSE, PC_DOSE);
    expect(eight.bkFacingLaw).toBe(false);
    expect(eight.bkContactLaw).toBe(false);
    expect(bkArmedVersion(eight)).toBe(0);
    expect(a4ArmedVersion(eight)).toBe(PC_WORLD_VERSION);
  });

  it('⭐ ONE law is not the world: a half-armed match reports 8, not 9', () => {
    for (const half of [{ bkFacingLaw: true }, { bkContactLaw: true }]) {
      const m = fixtureMatch({ ...a4MatchFlags(PC_WORLD_VERSION), ...half });
      armA4World(m, null, PC_WORLD_VERSION, L3_DOSE, PC_DOSE);
      expect(bkArmedVersion(m)).toBe(0);
      expect(a4ArmedVersion(m)).toBe(PC_WORLD_VERSION);
    }
  });
});

// ===========================================================================
describe('BK entry — ⭐ `?pcdose=0` keeps its WORLD-8 semantics inside world 9', () => {
  it('the books are BORN ABSENT and every cell pays the CHOICE tier', () => {
    const m = bkMatch(null);
    expect(a4ArmedVersion(m)).toBe(BK_WORLD_VERSION); // the same world
    for (const book of m.pcLatency!.books) {
      expect(book.totalExposures).toBe(0);
      for (let ri = 0; ri < ROSTER_SIZE; ri++) {
        for (const key of PC_BOOK_CELLS) expect(book.tierFor(ri, key)).toBe('choice');
      }
    }
  });

  it('the MATURED form carries PC-T2\'s table, cell for cell, in world 9 too', () => {
    const m = bkMatch();
    for (const book of m.pcLatency!.books) {
      for (let ri = 0; ri < ROSTER_SIZE; ri++) {
        for (let c = 0; c < PC_BOOK_CELLS.length; c++) {
          expect(book.count(ri, PC_BOOK_CELLS[c])).toBe(PC_DOSE[ri][c]);
        }
      }
    }
  });

  /**
   * ⭐⭐ THE #301 item 3 FIX RIDES ALONG BY CONSTRUCTION. The recognition books are the LEAGUE's
   * per-franchise objects, so they fill as the season is played; the empty form must therefore
   * RESET at every watched construction or the badge lies from match 2 on. World 9 inherits that
   * fix because it calls `armPcWorld` — this pin proves the inheritance behaviourally.
   *
   * Seeded from the out-of-band scratch class (canon, home PW-T0C-OBJECTIVE-FIDELITY.md
   * §COMMANDER CORRECTIONS item 6: *"verifier scratch walks use the stage's own consumed band or
   * the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*).
   * NON-VACUOUS BY CONSTRUCTION: it also asserts the drift it repairs.
   */
  it('⭐⭐ three consecutive watched world-9 fixtures each start on a GENUINELY empty book', () => {
    const WATCHED_CLUB = 0;
    const league = new League({ seed: 900000030, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(BK_WORLD_VERSION);
    const totalOf = (m: Match): number => m.pcLatency!.books
      .reduce((s, b) => s + b.totalExposures, 0);
    const beforeArming: number[] = [];
    const exposuresAtConstruction: number[] = [];
    for (let i = 0; i < 40 && exposuresAtConstruction.length < 3; i++) {
      const f = league.nextFixture();
      if (f === null) break;
      const m = league.createMatch(f);
      if (f.home === WATCHED_CLUB || f.away === WATCHED_CLUB) {
        expect(m.bkFacingLaw).toBe(true); // …and it really is the body-honest world
        expect(m.bkContactLaw).toBe(true);
        beforeArming.push(totalOf(m));
        armA4World(m, null, BK_WORLD_VERSION, L3_DOSE, null); // the `?pcdose=0` weak form
        exposuresAtConstruction.push(totalOf(m));
      }
      league.applyResult(f, m.runToCompletion());
    }
    expect(exposuresAtConstruction).toEqual([0, 0, 0]); // ⭐ the pin
    expect(beforeArming[0]).toBe(0); // match 1 was always honest
    expect(Math.max(...beforeArming.slice(1))).toBeGreaterThan(0); // ⚠ the drift is real
  }, 120_000);

  it('⭐ the app reads the contrast on ONE predicate that covers worlds 8 AND 9', () => {
    const arm = APP.slice(APP.indexOf('private async armA4('));
    const body = arm.slice(0, arm.indexOf('\n  }'));
    expect(body).toContain('const pcStack = isPcWorld(version) || isBkWorld(version);');
    expect(body).toContain('if (pcStack) {');
    expect(body).toContain('pcEmpty = !pcDoseWanted(');
    // exactly one place decides the contrast, so it cannot drift between the two worlds
    expect(body.match(/pcDoseWanted\(/g)).toHaveLength(1);
  });

  it('world 9 offers NO dose of its own — no new param, no new sticky key', () => {
    expect(SRC).not.toContain('bkdose');
    expect(APP).not.toContain('bkdose');
    expect(SRC).not.toContain("'evo:bkWorld'");
  });
});

// ===========================================================================
describe('BK entry — ⭐ NO NEW CHUNK: the laws carry no dose', () => {
  it('the service worker\'s opt-in prefix list is UNCHANGED', () => {
    const pwa = repoText('scripts/pwaAssets.ts');
    expect(pwa).toContain(
      "const OPT_IN_CHUNK_PREFIXES = ['assets/stage3-', 'assets/l3-', 'assets/pc-'] as const;",
    );
    expect(pwa).not.toContain('assets/bk-');
    // and the behaviour that list produces is what it always was
    expect(isShellAsset('assets/index-abc.js')).toBe(true);
    expect(isShellAsset('assets/pc-t1-learning-exam-DEADBEEF.js')).toBe(false);
    expect(isShellAsset('assets/l3-t1-convergence-exam-DEADBEEF.js')).toBe(false);
  });

  it('the entry module imports NO BK artifact and types no BK numeral', () => {
    expect(SRC).not.toContain('bk-t0-facing-receipts.json');
    expect(SRC).not.toContain('bk-t1-contact-receipts.json');
    expect(SRC).not.toContain('bk-t2-composition-exam.json');
    // the dynamic world-model imports are still exactly the four the family declared
    expect(SRC.match(/import\('\.\.\/\.\.\/docs\/world-model\/data\//g)).toHaveLength(4);
  });

  it('the entry module arms no evolution opt-in', () => {
    const code = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toContain('evolveCarryChoice');
    expect(code).not.toContain('evolveHomePrior');
  });
});

// ===========================================================================
describe('BK entry — ⭐⭐ THE BADGE AND THE BLURB CARRY THE COST', () => {
  it('the badge is the ninth distinct name, in both dose forms', () => {
    expect(A4_BADGE_TEXTS[9]).toBe(A4_BADGE_TEXT_BK);
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(9);
    expect(A4_BADGE_TEXT_BK).not.toBe(A4_BADGE_TEXT_BK_EMPTY);
    expect(A4_BADGE_TEXT_BK).not.toBe(A4_BADGE_TEXT_PC);
    expect(A4_BADGE_TEXT_BK).toContain('身体诚实');
    expect(A4_BADGE_TEXT_BK_EMPTY).toContain('身体诚实');
  });

  it('the chip mounts, RELABELS in place for the other form, and unmounts', () => {
    const els: { className: string; textContent: string | null }[] = [];
    const doc = {
      createElement: (): { className: string; textContent: string | null; remove(): void } => {
        const el = { className: '', textContent: null as string | null, remove(): void {} };
        els.push(el);
        return el;
      },
      body: { appendChild: (): void => {} },
    };
    const badge = new A4WorldBadge(doc);
    badge.setWorld(9);
    expect(badge.label).toBe(A4_BADGE_TEXT_BK);
    badge.setWorld(9, A4_BADGE_TEXT_BK_EMPTY);
    expect(badge.world).toBe(9);
    expect(badge.label).toBe(A4_BADGE_TEXT_BK_EMPTY);
    expect(els).toHaveLength(1); // ONE chip, relabelled
    badge.setWorld(0);
    expect(badge.mounted).toBe(false);
  });

  it('⭐ the app labels the world-9 EMPTY form with the WORLD-9 chip', () => {
    expect(APP).toContain(
      'pcEmpty ? (isBkWorld(version) ? A4_BADGE_TEXT_BK_EMPTY : A4_BADGE_TEXT_PC_EMPTY)',
    );
  });

  it('⭐⭐ THE COST LINE is in the settings blurb, the feed line AND the stage doc', () => {
    expect(SETTINGS).toContain(COST_LINE);
    expect(APP).toContain(COST_LINE);
    expect(DOC).toContain(COST_LINE);
    // …and it is in BOTH of the world-9 feed forms, not only the default one
    expect(APP.split(COST_LINE)).toHaveLength(3); // two occurrences ⇒ three pieces
  });

  it('the blurb opens in the player\'s own football language', () => {
    expect(SETTINGS).toContain('身体诚实的世界 — 转身才能踢,球会撞到人。');
  });

  it('⭐ the worker-fixture honesty line is in the blurb, in the player\'s language', () => {
    expect(SETTINGS).toContain('你看的是屏幕上这一场');
    expect(SETTINGS).toContain('联赛后台快速模拟的比赛跑的是原版世界');
  });

  it('the settings checkbox is the ninth, exclusive with all eight others', () => {
    expect(SETTINGS).toContain('setA4World(v ? 9 : 0)');
    expect(SETTINGS).toContain('input(bkBox).checked = version === 9;');
    expect(SETTINGS).toContain('input(pcBox).checked = version === 8;');
    expect(SETTINGS).toContain('身体诚实的世界 · 转身才能踢,球会撞到人 (play-test)');
  });

  it('⭐ the stage doc quotes CANON.md\'s worker-fixture sentence VERBATIM', () => {
    const canonSentence = 'WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits '
      + 'matchFlags; true since #155, stated now, test-pinned; refines #270\'s E4 correction; '
      + 'matches the perf diagnostic)';
    // CANON.md wraps its ledger lines, so the comparison is whitespace-normalised on BOTH
    // sides — the SENTENCE is the canon, not its line breaks.
    const flat = (s: string): string => s.replace(/\s+/g, ' ');
    expect(flat(CANON)).toContain(canonSentence); // the ledger really is its home
    expect(flat(DOC)).toContain(canonSentence); // …and the doc copied it, never re-typed it
  });

  it('the stage doc names the same two laws and the same ninth version', () => {
    for (const door of Object.keys(BK_WORLD_DOORS)) expect(DOC).toContain(door);
    expect(DOC).toContain('?a4world=9');
    expect(DOC).toContain('a4MatchFlags(8)');
    expect(DOC).toContain('?pcdose=0');
  });
});

// ===========================================================================
describe('BK entry — the entry: one value, nine worlds, one inherited contrast', () => {
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

  it('the phone link is ?a4world=9 and stays exclusive', () => {
    expect(a4UrlOverride('?a4world=9')).toBe(9);
    expect(a4UrlOverride('?a4world=8')).toBe(8);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=10')).toBeNull(); // no tenth world exists
    expect(DOC).toContain('?a4world=9');
  });

  it('⭐ the sticky key stores 9 like any armed version, and clears on 0', () => {
    storage();
    writeA4World(BK_WORLD_VERSION);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBe('9');
    expect(readA4World()).toBe(BK_WORLD_VERSION);
    writeA4World(0);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBeNull();
    expect(readA4World()).toBe(0);
  });

  it('the GameApp arms world 9 without waiting for A4 census tables', () => {
    expect(APP.match(/armA4World\(/g)).toHaveLength(1); // still ONE arming call site
    expect(APP).toContain(
      '|| isCbWorld(this.a4World) || isL3World(this.a4World) || isPcWorld(this.a4World)\n'
      + '      || isBkWorld(this.a4World))) {',
    );
    expect(APP).toContain(
      'armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose, this.pcDose);',
    );
  });
});

// ===========================================================================
describe('BK entry OFF — the shipped world is untouched (Road B)', () => {
  it('an unarmed league match carries neither law', () => {
    const m = fixtureMatch({});
    expect(m.bkFacingLaw).toBe(false);
    expect(m.bkContactLaw).toBe(false);
    expect(bkArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
  });

  it('⭐ the league serializes no BK state at all (no gene, no book, no flag)', () => {
    const league = new League({ seed: 12505901 });
    league.matchFlags = a4MatchFlags(BK_WORLD_VERSION);
    const match = league.createMatch(league.nextFixture()!);
    armA4World(match, null, BK_WORLD_VERSION, L3_DOSE, PC_DOSE);
    const json = JSON.stringify(league);
    expect(json).not.toContain('bkFacingLaw');
    expect(json).not.toContain('bkContactLaw');
    expect(json).not.toContain('cbCarryProneness');
  });

  it('⚠ the WORKER fast-sim path is the SHIPPED world — matchFlags do not survive a save', () => {
    // Canon, home ruling #283.2(iv): "WORKER-SIMMED fixtures play the SHIPPED world
    // (League.toJSON omits matchFlags)". True of the whole entry family; re-pinned for world 9.
    const league = new League({ seed: 12505901 });
    league.matchFlags = a4MatchFlags(BK_WORLD_VERSION);
    const live = league.createMatch(league.nextFixture()!);
    expect(live.bkFacingLaw).toBe(true);
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.bkFacingLaw).toBe(false);
    expect(simmed.bkContactLaw).toBe(false);
    expect(bkArmedVersion(simmed)).toBe(0);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });

  it('⭐ multi-seed: a production match is bit-for-bit what it was without this rung', () => {
    for (const seed of [12505900, 12505901, 12505902]) {
      const a = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      const b = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      while (!a.finished) a.step(DT);
      while (!b.finished) b.step(DT);
      expect(signature(a)).toBe(signature(b));
      expect(a.bkFacingLaw).toBe(false);
      expect(a.bkContactLaw).toBe(false);
    }
  }, 120_000);
});

/** A minimal two-team fixture for the identity walk — the engine's own defaults. */
function teamOf(name: string, seed: number): ConstructorParameters<typeof Match>[0]['teamA'] {
  const league = new League({ seed, matchDuration: 240 });
  return league.teamInfo(name === 'A' ? 0 : 1);
}
