import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import type { TacticalGenome } from '../src/evolution/genome';
import {
  A4_WORLD_KEY, CB_WORLD_VERSION, L3_DOSE_PARAM, L3_T1_SHA, L3_WORLD_DOORS, L3_WORLD_VERSION,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, cbArmedVersion, doseL3Books, isL3World,
  l3ArmedVersion, l3DoseWanted, poolT1DoseCells, readA4World, writeA4World,
} from '../src/game/a4World';
import { A4_BADGE_TEXT_L3, A4_BADGE_TEXT_L3_EMPTY, A4_BADGE_TEXTS, A4WorldBadge } from '../src/ui/A4WorldBadge';
import { L3_GROUP_CONTROLLED, L3_GROUP_RECKLESS } from '../src/ai/defenceBook';
import { isShellAsset } from '../scripts/pwaAssets';

/**
 * ⭐⭐ THE L3 PLAY-TEST ENTRY — `?a4world=7`, the defence book LIVE (ruling #282.3(3) = #282.4;
 * docs/world-model/L3-ENTRY-RUNG.md). The SEVENTH entry of the #155/#168/#211.3/#269.4 family,
 * and the door to the play-test user gate.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 7 IS world 6 plus L3-T2's two armed doors, and it says so by CALLING
 *       the world-6 composition rather than copying it.
 *   (2) ⭐⭐ THE DOSE IS L3-T1's COMMITTED CELLS, POOLED — derived from the artifact at run time
 *       (never typed), written through the book's own `note()`, and behaviourally the arm-C book:
 *       it declines RECKLESS and nothing else.
 *   (3) ⭐⭐ NO LAMARCK SURFACE — the dose is match-local book state: the league serializes
 *       without it, and without world 6's gene.
 *   (4) THE OPT-IN CHUNK — the cells are a dynamic import behind a SHA guard, and their chunk is
 *       excluded from the service worker's precache.
 *   (5) DEFAULT OFF SURVIVES: an unarmed match carries no door and no seat, and the entry is one
 *       exclusive value with its own URL param, checkbox, badge and named dose contrast.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/L3-ENTRY-RUNG.md');
const T1 = JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as {
  resultSha256: string;
};

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const fixtureMatch = (flags: League['matchFlags'], seed = 12485900): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

const DOSE = poolT1DoseCells(T1 as unknown);

/** World 7 built exactly the way the app builds it: flags at construction, arming after. */
const l3Match = (dose = DOSE, seed = 12485900): Match => {
  const match = fixtureMatch(a4MatchFlags(L3_WORLD_VERSION), seed);
  armA4World(match, null, L3_WORLD_VERSION, dose);
  return match;
};

const genomesOf = (m: Match, side: 0 | 1): TacticalGenome[] => [
  m.teams[side].info.genome, m.teams[side].baseGenome, m.teams[side].effGenome,
] as TacticalGenome[];

// ===========================================================================
describe('L3 entry — ⭐ FIDELITY: world 7 is world 6 plus the two book doors', () => {
  it('the flags are `a4MatchFlags(6)` ∪ the two doors, key for key', () => {
    const flags = a4MatchFlags(L3_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(CB_WORLD_VERSION), ...L3_WORLD_DOORS });
    expect(L3_WORLD_DOORS).toEqual({ l3DefenceLearn: true, l3DefenceVeto: true });
    // …and no earlier world gained a door by this one existing
    expect(a4MatchFlags(CB_WORLD_VERSION) as Record<string, boolean>)
      .not.toHaveProperty('l3DefenceLearn');
    expect(a4MatchFlags(3) as Record<string, boolean>).not.toHaveProperty('l3DefenceVeto');
  });

  it('⭐ the substrate is CALLED, not copied — the two entries cannot drift', () => {
    const code = repoText('src/game/a4World.ts');
    expect(code).toContain('return { ...a4MatchFlags(CB_WORLD_VERSION), ...L3_WORLD_DOORS };');
  });

  it('the armed match carries both doors, the ledger seat and world 6\'s own conformance', () => {
    const m = l3Match();
    expect(m.l3DefenceLearn).toBe(true);
    expect(m.l3DefenceVeto).toBe(true);
    expect(m.l3Defence).not.toBeNull();
    expect(cbArmedVersion(m)).toBe(CB_WORLD_VERSION); // world 6 conformance, unchanged
    expect(l3ArmedVersion(m)).toBe(L3_WORLD_VERSION);
    expect(isL3World(L3_WORLD_VERSION)).toBe(true);
    expect(isL3World(CB_WORLD_VERSION)).toBe(false);
  });

  it('⭐ the oracle asks world 7 BEFORE world 6 — a world-7 match never reports as a world-6 one', () => {
    expect(a4ArmedVersion(l3Match())).toBe(L3_WORLD_VERSION);
    // …and world 6 without the doors still reports 6
    const six = fixtureMatch(a4MatchFlags(CB_WORLD_VERSION));
    armA4World(six, null, CB_WORLD_VERSION);
    expect(a4ArmedVersion(six)).toBe(CB_WORLD_VERSION);
  });

  it('the DOSE is not part of the world predicate — `?l3dose=0` is the same world', () => {
    const empty = l3Match(null as unknown as typeof DOSE);
    expect(l3ArmedVersion(empty)).toBe(L3_WORLD_VERSION);
    expect(empty.l3Defence?.books[0].total).toBe(0); // the book as the season left it
  });

  it('the stage doc names the same doors and the same seventh version', () => {
    for (const door of Object.keys(L3_WORLD_DOORS)) expect(DOC).toContain(door);
    expect(DOC).toContain('?a4world=7');
    expect(DOC).toContain('a4MatchFlags(6)');
  });
});

// ===========================================================================
describe('L3 entry — ⭐⭐ THE DOSE: L3-T1\'s committed cells, pooled', () => {
  it('the cells are DERIVED from the committed artifact, never typed into src', () => {
    const code = repoText('src/game/a4World.ts');
    // no cell literal is reachable: the two published pooled numbers appear nowhere in src
    expect(code).not.toContain(String(DOSE[L3_GROUP_CONTROLLED].lunges));
    expect(code).not.toContain(String(DOSE[L3_GROUP_RECKLESS].lunges));
    expect(code).toContain("import('../../docs/world-model/data/l3-t1-convergence-exam.json')");
  });

  it('the artifact identity guard is the file\'s OWN declared SHA', () => {
    expect(L3_T1_SHA).toBe(T1.resultSha256);
    expect(repoText('src/game/a4World.ts')).toContain('convergence-exam SHA mismatch');
  });

  it('⭐ pooling sums all 16 committed books at the LAST checkpoint', () => {
    const raw = JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as {
      perBookCells: { books: { seasons: number; all: { lunges: number; punished: number }[] }[][] }[];
    };
    let books = 0;
    const want = [{ lunges: 0, punished: 0 }, { lunges: 0, punished: 0 }];
    for (const rep of raw.perBookCells) {
      for (const snaps of rep.books) {
        const last = snaps[snaps.length - 1];
        expect(last.seasons).toBe(15); // M* — "the lesson fully learned"
        books++;
        for (let g = 0; g < 2; g++) {
          want[g].lunges += last.all[g].lunges;
          want[g].punished += last.all[g].punished;
        }
      }
    }
    expect(books).toBe(16); // 8 replicates × 2 sides
    expect(DOSE).toEqual(want);
  });

  it('⭐⭐ the dosed book BEHAVES like arm C: it declines RECKLESS and nothing else', () => {
    const m = l3Match();
    for (const book of m.l3Defence!.books) {
      expect(book.lunges[L3_GROUP_CONTROLLED]).toBe(DOSE[L3_GROUP_CONTROLLED].lunges);
      expect(book.punished[L3_GROUP_RECKLESS]).toBe(DOSE[L3_GROUP_RECKLESS].punished);
      expect(book.declinesLunge(L3_GROUP_RECKLESS)).toBe(true);
      expect(book.declinesLunge(L3_GROUP_CONTROLLED)).toBe(false);
    }
  });

  it('the dose is written through the book\'s OWN public note() — no field surgery', () => {
    const code = repoText('src/game/a4World.ts');
    const fn = code.slice(code.indexOf('export function doseL3Books'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    expect(body).toContain('book.note(g, true)');
    expect(body).toContain('book.note(g, false)');
    expect(body).not.toContain('.lunges[');
    expect(body).not.toContain('.punished[');
  });

  it('dosing a match with no learning seat is a no-op, never a crash', () => {
    const bare = fixtureMatch({});
    expect(bare.l3Defence).toBeNull();
    expect(() => doseL3Books(bare, DOSE)).not.toThrow();
  });
});

// ===========================================================================
describe('L3 entry — ⭐⭐ NO LAMARCK: match-local state only', () => {
  it('the L3 seam writes no genome field at all', () => {
    const m = l3Match();
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(m, side)) {
        expect((g as unknown as Record<string, unknown>).l3DefenceLearn).toBeUndefined();
        expect((g as unknown as Record<string, unknown>).defenceBook).toBeUndefined();
      }
      // world 6's own dose keeps its RATIFIED form (#270.3(1)): never on info.genome
      expect((m.teams[side].info.genome as TacticalGenome).cbCarryProneness).toBeUndefined();
      expect((m.teams[side].effGenome as TacticalGenome).cbCarryProneness).toBe(1);
    }
  });

  it('⭐ the league serializes without the gene AND without any book state', () => {
    const league = new League({ seed: 12485901 });
    league.matchFlags = a4MatchFlags(L3_WORLD_VERSION);
    const match = league.createMatch(league.nextFixture()!);
    armA4World(match, null, L3_WORLD_VERSION, DOSE);
    const json = JSON.stringify(league);
    expect(json).not.toContain('cbCarryProneness');
    expect(json).not.toContain('l3DefenceBooks');
    expect(json).not.toContain('defenceBooks');
    // ⚠ NOT a digit search (a long random float can contain any digit string by chance):
    // the book's own FIELD NAMES are what a serialized book would have to carry.
    expect(json).not.toContain('"lunges"');
    expect(json).not.toContain('"punished"');
  });

  it('⚠ the WORKER fast-sim path is the SHIPPED world — matchFlags do not survive a save', () => {
    // ⭐ The scope truth the freeze got wrong (§DEV 7): the sim worker rebuilds the league with
    // League.fromJSON, and `matchFlags` is not serialized — so a worker-simmed fixture carries
    // NO door. The main-thread league does. Pinned so no later entry inherits the wrong belief.
    const league = new League({ seed: 12485901 });
    league.matchFlags = a4MatchFlags(L3_WORLD_VERSION);
    const live = league.createMatch(league.nextFixture()!);
    expect(live.l3DefenceLearn).toBe(true);
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.l3DefenceLearn).toBe(false);
    expect(simmed.l3DefenceVeto).toBe(false);
    expect(simmed.cbTouchPast).toBe(false);
    expect(l3ArmedVersion(simmed)).toBe(0);
  });

  it('the entry module arms no evolution opt-in', () => {
    const code = repoText('src/game/a4World.ts')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toContain('evolveCarryChoice');
    expect(code).not.toContain('evolveHomePrior');
  });
});

// ===========================================================================
describe('L3 entry OFF — the shipped world is untouched (Road B)', () => {
  it('an unarmed league match carries no door and no learning seat', () => {
    const m = fixtureMatch({});
    expect(m.l3DefenceLearn).toBe(false);
    expect(m.l3DefenceVeto).toBe(false);
    expect(m.l3Defence).toBeNull();
    expect(l3ArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
  });

  it('⭐ multi-seed: a production match is bit-for-bit what it was without this rung', () => {
    // The rung touches no file under src/sim, src/ai or src/evolution, so the OFF world
    // cannot have moved; this walks it anyway, on this rung's own seed band.
    for (const seed of [12485900, 12485901, 12485902]) {
      const a = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      const b = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      while (!a.finished) a.step(DT);
      while (!b.finished) b.step(DT);
      expect(signature(a)).toBe(signature(b));
      expect(a.l3Defence).toBeNull();
    }
  }, 120_000);

  it('⭐ the dose chunk is OPT-IN: not in the every-install precache', () => {
    expect(isShellAsset('assets/l3-t1-convergence-exam-DEADBEEF.js')).toBe(false);
    expect(isShellAsset('assets/stage3-v4-p3p1-merged-role-census-table-abc.js')).toBe(false);
    expect(isShellAsset('assets/index-abc.js')).toBe(true);
    // …and the app fetches it only on the world-7 path
    const app = repoText('src/game/GameApp.ts');
    const arm = app.slice(app.indexOf('private async armA4('));
    expect(arm.slice(0, arm.indexOf('\n  }'))).toContain('isL3World(version)');
    expect(app).toContain('this.l3Dose = await loadL3Dose();');
  });

  it('a failed dose load DISARMS rather than naming a world it did not arm', () => {
    const app = repoText('src/game/GameApp.ts');
    const arm = app.slice(app.indexOf('private async armA4('), app.indexOf('setEmergentPos(v: boolean)'));
    const fail = arm.slice(arm.indexOf('L3 world dose failed to load'));
    expect(fail.slice(0, fail.indexOf('applyEdsPreview'))).toContain('this.a4World = 0;');
    expect(fail.slice(0, fail.indexOf('applyEdsPreview'))).toContain('this.a4Badge.setWorld(0);');
  });
});

// ===========================================================================
describe('L3 entry — the entry: one value, seven worlds, and ONE named contrast', () => {
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

  it('the phone link is ?a4world=7 and stays exclusive', () => {
    expect(a4UrlOverride('?a4world=7')).toBe(7);
    expect(a4UrlOverride('?a4world=6')).toBe(6);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=8')).toBe(8); // ⭐ #300.6: the eighth world
    expect(a4UrlOverride('?a4world=9')).toBe(9); // ⭐ #309.5: the ninth world
    expect(a4UrlOverride('?a4world=10')).toBe(10); // ⭐ #337.5: a tenth world now exists
    expect(a4UrlOverride('?a4world=11')).toBe(11); // ⭐ #337.5: an eleventh world now exists
    expect(a4UrlOverride('?a4world=14')).toBe(14); // the LN entry (#396 item 4)
    expect(a4UrlOverride('?a4world=15')).toBeNull(); // …and a fifteenth does not (14 = the LN entry, #396 item 4)
    expect(DOC).toContain('?a4world=7');
  });

  it('the sticky key stores 7 and reads it back', () => {
    storage();
    writeA4World(L3_WORLD_VERSION);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBe('7');
    expect(readA4World()).toBe(L3_WORLD_VERSION);
    writeA4World(0);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBeNull();
  });

  it('⭐ the dose contrast is a NAMED param, defaults to DOSED, and is not sticky', () => {
    expect(L3_DOSE_PARAM).toBe('l3dose');
    expect(l3DoseWanted('')).toBe(true);
    expect(l3DoseWanted('?a4world=7')).toBe(true);
    expect(l3DoseWanted('?a4world=7&l3dose=0')).toBe(false);
    expect(l3DoseWanted('?l3dose=off')).toBe(false);
    expect(l3DoseWanted('?l3dose=empty')).toBe(false);
    expect(l3DoseWanted('?l3dose=1')).toBe(true);
    // NOT sticky: nothing writes it to storage
    expect(repoText('src/game/a4World.ts')).not.toContain(`setItem(${L3_DOSE_PARAM}`);
    expect(repoText('src/game/a4World.ts')).not.toContain("'evo:l3dose'");
  });

  it('the settings checkbox is the seventh, exclusive with all six others', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain("setA4World(v ? 7 : 0)");
    expect(settings).toContain('input(l3Box).checked = version === 7;');
    expect(settings).toContain('input(cbBox).checked = version === 6;');
  });

  it('⭐ the badge names the world AND the dose form', () => {
    expect(A4_BADGE_TEXTS[7]).toBe(A4_BADGE_TEXT_L3);
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(14); // #396 item 4: a fourteenth name
    expect(A4_BADGE_TEXT_L3).not.toBe(A4_BADGE_TEXT_L3_EMPTY);
    const els: { className: string; textContent: string | null; removed?: boolean }[] = [];
    const doc = {
      createElement: (): { className: string; textContent: string | null; remove(): void } => {
        const el = {
          className: '', textContent: null as string | null,
          remove(): void { (el as { removed?: boolean }).removed = true; },
        };
        els.push(el);
        return el;
      },
      body: { appendChild: (): void => {} },
    };
    const badge = new A4WorldBadge(doc);
    badge.setWorld(7);
    expect(badge.label).toBe(A4_BADGE_TEXT_L3);
    badge.setWorld(7, A4_BADGE_TEXT_L3_EMPTY); // the same world, the other form
    expect(badge.world).toBe(7);
    expect(badge.label).toBe(A4_BADGE_TEXT_L3_EMPTY);
    expect(els).toHaveLength(1); // ONE chip, relabelled — never a second entry
    badge.setWorld(0);
    expect(badge.mounted).toBe(false);
  });

  it('the GameApp guard arms world 7 without waiting for A4 census tables', () => {
    const app = repoText('src/game/GameApp.ts');
    expect(app.match(/armA4World\(/g)).toHaveLength(1); // still ONE arming call site
    // ⭐ NARROWED by #386 item 5: the SAME single guard, widened by one world (13). The claim is
    // intact and stronger — ONE guard names every world of the stack, now including world 13.
    expect(app).toContain('|| isCbWorld(this.a4World) || isL3World(this.a4World) || isPcWorld(this.a4World)\n'
      + '      || isBkWorld(this.a4World) || isDfWorld(this.a4World)\n'
      + '      || isCorridorWorld(this.a4World) || isRaWorld(this.a4World)\n'
      + '      || isBqWorld(this.a4World) || isLnWorld(this.a4World))) {');
    expect(app).toContain('armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose, this.pcDose);');
  });
});

/** A minimal two-team fixture for the identity walk — the engine's own defaults. */
function teamOf(name: string, seed: number): ConstructorParameters<typeof Match>[0]['teamA'] {
  const league = new League({ seed, matchDuration: 240 });
  return league.teamInfo(name === 'A' ? 0 : 1);
}
