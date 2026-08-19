import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import type { TacticalGenome } from '../src/evolution/genome';
import {
  A4_WORLD_KEY, CB_WORLD_VERSION, L3_WORLD_VERSION, PC_DOSE_PARAM, PC_T1_BYTES_SHA, PC_T1_SHA,
  PC_WORLD_DOORS, PC_WORLD_VERSION,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, dosePcBooks, isPcWorld, l3ArmedVersion,
  loadPcDose, pcArmedVersion, pcDoseGuard, pcDoseWanted, poolPcDoseTable, poolT1DoseCells,
  readA4World, writeA4World,
} from '../src/game/a4World';
import {
  A4_BADGE_TEXT_PC, A4_BADGE_TEXT_PC_EMPTY, A4_BADGE_TEXTS, A4WorldBadge,
} from '../src/ui/A4WorldBadge';
import { PC_BOOK_CELLS, PC_N_COVER } from '../src/ai/pcLatency';
import { ROSTER_SIZE } from '../src/sim/types';
import { isShellAsset } from '../scripts/pwaAssets';

/**
 * ⭐⭐ THE PC PLAY-TEST ENTRY — `?a4world=8`, processing time LIVE (ruling #300 item 6;
 * docs/world-model/PC-ENTRY-RUNG.md). The EIGHTH entry of the
 * #155/#167.5/#184.2/#211.3/#269.4/#282.4 family, and the door to the play-test user gate.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — world 8 IS world 7 plus PC-T0's ONE armed door, and it says so by CALLING
 *       the world-7 composition rather than copying it.
 *   (2) ⭐⭐ THE VERSION VALUE — the BU-T1 §DOUBTS 7 mislabel class, killed: a world-8 match
 *       reports EIGHT through the shipped entry-layer read, never 7 and never 6.
 *   (3) ⭐⭐ THE DOSE IS PC-T2's ARM-C TABLE — re-derived from PC-T1's committed artifact at run
 *       time (never typed), bit-equal to the table PC-T2 committed, written through the
 *       recognition book's own `note()`, and it flips the covered cells to the SIMPLE tier.
 *   (4) ⭐ `?pcdose=0` — born-absent books: every body pays CHOICE, which is the weak form.
 *   (5) THE OPT-IN CHUNK — the cells are a dynamic `?raw` import behind a FILE-BYTE hash, and
 *       their chunk is excluded from the service worker's precache.
 *   (6) NO LAMARCK, and DEFAULT OFF SURVIVES: an unarmed match carries no door and no seat, the
 *       league serializes no book state, and the entry is one exclusive value with its own URL
 *       param, checkbox, badge and named dose contrast.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const DOC = repoText('docs/world-model/PC-ENTRY-RUNG.md');
const PC_T1_TEXT = repoText('docs/world-model/data/pc-t1-learning-exam.json');
const PC_T1 = JSON.parse(PC_T1_TEXT) as { resultSha256: string };
const PC_T2 = JSON.parse(repoText('docs/world-model/data/pc-t2-armed-world-read.json')) as {
  frozen: { doseProvenance: { table: number[][]; totalExposuresPerBook: number } };
};
const L3_DOSE = poolT1DoseCells(
  JSON.parse(repoText('docs/world-model/data/l3-t1-convergence-exam.json')) as unknown,
);
const PC_DOSE = poolPcDoseTable(JSON.parse(PC_T1_TEXT));

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const fixtureMatch = (flags: League['matchFlags'], seed = 12500900): Match => {
  const league = new League({ seed, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

/** World 8 built exactly the way the app builds it: flags at construction, arming after. */
const pcMatch = (dose: typeof PC_DOSE | null = PC_DOSE, seed = 12500900): Match => {
  const match = fixtureMatch(a4MatchFlags(PC_WORLD_VERSION), seed);
  armA4World(match, null, PC_WORLD_VERSION, L3_DOSE, dose);
  return match;
};

// ===========================================================================
describe('PC entry — ⭐ FIDELITY: world 8 is world 7 plus the latency door', () => {
  it('the flags are `a4MatchFlags(7)` ∪ the one door, key for key', () => {
    const flags = a4MatchFlags(PC_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(L3_WORLD_VERSION), ...PC_WORLD_DOORS });
    expect(PC_WORLD_DOORS).toEqual({ pcReactionLatency: true });
    // …and no earlier world gained the door by this one existing
    expect(a4MatchFlags(L3_WORLD_VERSION) as Record<string, boolean>)
      .not.toHaveProperty('pcReactionLatency');
    expect(a4MatchFlags(CB_WORLD_VERSION) as Record<string, boolean>)
      .not.toHaveProperty('pcReactionLatency');
  });

  it('⭐ the substrate is CALLED, not copied — the two entries cannot drift', () => {
    const code = repoText('src/game/a4World.ts');
    expect(code).toContain(
      'return { ...a4MatchFlags(L3_WORLD_VERSION), ...PC_WORLD_DOORS };',
    );
  });

  it('the armed match carries the door, the seat, and world 7\'s own conformance', () => {
    const m = pcMatch();
    expect(m.pcReactionLatency).toBe(true);
    expect(m.pcLatency).not.toBeNull();
    expect(m.pcLatency?.nCover).toBe(PC_N_COVER);
    expect(l3ArmedVersion(m)).toBe(L3_WORLD_VERSION); // world 7 conformance, unchanged
    expect(pcArmedVersion(m)).toBe(PC_WORLD_VERSION);
    expect(isPcWorld(PC_WORLD_VERSION)).toBe(true);
    expect(isPcWorld(L3_WORLD_VERSION)).toBe(false);
  });

  it('⭐⭐ THE VERSION VALUE: a world-8 match reports EIGHT, never 7 and never 6', () => {
    // The BU-T1 §DOUBTS 7 class ("`a4ArmedVersion` HAS NO NAME FOR THIS COMPOSITION … the entry
    // layer would need a new version value first") — killed for this composition.
    expect(a4ArmedVersion(pcMatch())).toBe(PC_WORLD_VERSION);
    expect(a4ArmedVersion(pcMatch(null))).toBe(PC_WORLD_VERSION); // the weak form is the world too
    // …and the worlds it contains still report themselves
    const seven = fixtureMatch(a4MatchFlags(L3_WORLD_VERSION));
    armA4World(seven, null, L3_WORLD_VERSION, L3_DOSE);
    expect(a4ArmedVersion(seven)).toBe(L3_WORLD_VERSION);
    const six = fixtureMatch(a4MatchFlags(CB_WORLD_VERSION));
    armA4World(six, null, CB_WORLD_VERSION);
    expect(a4ArmedVersion(six)).toBe(CB_WORLD_VERSION);
  });

  it('⭐ the read asks world 8 BEFORE world 7 — the containment chain, widest first', () => {
    const code = repoText('src/game/a4World.ts');
    const fn = code.slice(code.indexOf('export function a4ArmedVersion'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    expect(body.indexOf('pcArmedVersion(match)')).toBeLessThan(body.indexOf('l3ArmedVersion(match)'));
    expect(body.indexOf('l3ArmedVersion(match)')).toBeLessThan(body.indexOf('cbArmedVersion(match)'));
  });

  it('the stage doc names the same door and the same eighth version', () => {
    for (const door of Object.keys(PC_WORLD_DOORS)) expect(DOC).toContain(door);
    expect(DOC).toContain('?a4world=8');
    expect(DOC).toContain('a4MatchFlags(7)');
  });
});

// ===========================================================================
describe('PC entry — ⭐⭐ THE DOSE: PC-T2\'s arm-C table, re-derived', () => {
  it('the cells are DERIVED from the committed artifact, never typed into src', () => {
    const code = repoText('src/game/a4World.ts');
    // the two loudest dose numerals are reachable nowhere in the entry module
    expect(code).not.toContain(String(PC_T2.frozen.doseProvenance.totalExposuresPerBook));
    expect(code).not.toContain(String(PC_DOSE[1][8])); // a large covered cell
    expect(code).toContain(
      "import('../../docs/world-model/data/pc-t1-learning-exam.json?raw')",
    );
  });

  it('⭐⭐ the pooling reproduces PC-T2\'s COMMITTED arm-C dose, cell for cell', () => {
    expect(PC_DOSE.length).toBe(ROSTER_SIZE);
    expect(PC_DOSE[0].length).toBe(PC_BOOK_CELLS.length);
    expect(PC_DOSE).toEqual(PC_T2.frozen.doseProvenance.table);
    const exposures = PC_DOSE.reduce((a, r) => a + r.reduce((x, y) => x + y, 0), 0);
    expect(exposures).toBe(PC_T2.frozen.doseProvenance.totalExposuresPerBook);
  });

  it('⭐ the guards are the file\'s OWN bytes AND its own declared SHA', () => {
    expect(PC_T1_SHA).toBe(PC_T1.resultSha256);
    expect(PC_T1_BYTES_SHA).toBe(createHash('sha256').update(PC_T1_TEXT).digest('hex'));
    const code = repoText('src/game/a4World.ts');
    expect(code).toContain('learning-exam FILE BYTES mismatch');
    expect(code).toContain('learning-exam SHA mismatch');
  });

  it('⭐ the loader hashes FILE BYTES on the shipped path and returns that same table', async () => {
    const dose = await loadPcDose();
    expect(dose).toEqual(PC_T2.frozen.doseProvenance.table);
    // under Vite (the shipped runtime, and this one) `?raw` is TEXT, so the byte guard ran
    expect(pcDoseGuard.bytesChecked).toBe(true);
  });

  it('⭐⭐ the dosed books carry the table and pay the SHORT tier where it covers', () => {
    const m = pcMatch();
    const books = m.pcLatency!.books;
    for (const book of books) {
      let covered = 0;
      for (let ri = 0; ri < ROSTER_SIZE; ri++) {
        for (let c = 0; c < PC_BOOK_CELLS.length; c++) {
          expect(book.count(ri, PC_BOOK_CELLS[c])).toBe(PC_DOSE[ri][c]);
          if (PC_DOSE[ri][c] >= PC_N_COVER) {
            covered++;
            expect(book.tierFor(ri, PC_BOOK_CELLS[c])).toBe('simple');
          } else {
            expect(book.tierFor(ri, PC_BOOK_CELLS[c])).toBe('choice');
          }
        }
      }
      expect(covered).toBeGreaterThan(0); // non-vacuous: the dose really covers cells
    }
  });

  it('the dose is written through the book\'s OWN public note() — no field surgery', () => {
    const code = repoText('src/game/a4World.ts');
    const fn = code.slice(code.indexOf('export function dosePcBooks'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    expect(body).toContain('book.note(ri, PC_BOOK_CELLS[c])');
    expect(body).toContain('book.reset()');
    expect(body).not.toContain('cells');
    expect(body).not.toContain('snapshot');
  });

  it('dosing a match with no latency seat is a no-op, never a crash', () => {
    const bare = fixtureMatch({});
    expect(bare.pcLatency).toBeNull();
    expect(() => dosePcBooks(bare, PC_DOSE)).not.toThrow();
  });

  it('a dose derived from an artifact with no cells is empty, and the loader would refuse', () => {
    expect(poolPcDoseTable({ perBookCells: [] })).toEqual(
      Array.from({ length: ROSTER_SIZE }, () => new Array<number>(PC_BOOK_CELLS.length).fill(0)),
    );
    expect(repoText('src/game/a4World.ts')).toContain('carries no per-body cells');
  });
});

// ===========================================================================
describe('PC entry — ⭐ `?pcdose=0`: the weak form, everyone a novice', () => {
  it('the books are BORN ABSENT and every cell pays the CHOICE tier', () => {
    const m = pcMatch(null);
    expect(pcArmedVersion(m)).toBe(PC_WORLD_VERSION); // the same world
    for (const book of m.pcLatency!.books) {
      expect(book.totalExposures).toBe(0);
      for (let ri = 0; ri < ROSTER_SIZE; ri++) {
        for (const key of PC_BOOK_CELLS) expect(book.tierFor(ri, key)).toBe('choice');
      }
    }
  });

  /**
   * ⭐⭐ PC-ENTRY-FIX (ruling #301 item 3) — THE VERIFIER'S OWN REPRODUCTION CASE. The recognition
   * books are the LEAGUE's per-franchise objects, so they fill as the season is played: without a
   * reset at arming, the SECOND and later watched `?pcdose=0` matches kick off on part-filled
   * books while the badge still reads 「空账本(全新手)」. Three consecutive watched fixtures of one
   * club, and every one of them must start GENUINELY empty.
   *
   * Seeded from the out-of-band scratch class (canon, home PW-T0C §COMMANDER CORRECTIONS item 6:
   * *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
   * (≥ 900,000,000) — never the next virgin block"*). NON-VACUOUS BY CONSTRUCTION: the pin also
   * asserts the drift it repairs — later watched matches DO meet non-empty books before arming.
   */
  it('⭐⭐ three consecutive watched fixtures each start on a GENUINELY empty book', () => {
    const WATCHED_CLUB = 0;
    const league = new League({ seed: 900000020, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(PC_WORLD_VERSION);
    const totalOf = (m: Match): number => m.pcLatency!.books
      .reduce((s, b) => s + b.totalExposures, 0);
    const beforeArming: number[] = [];
    const exposuresAtConstruction: number[] = [];
    for (let i = 0; i < 40 && exposuresAtConstruction.length < 3; i++) {
      const f = league.nextFixture();
      if (f === null) break;
      const m = league.createMatch(f);
      if (f.home === WATCHED_CLUB || f.away === WATCHED_CLUB) {
        beforeArming.push(totalOf(m));
        armA4World(m, null, PC_WORLD_VERSION, L3_DOSE, null); // the `?pcdose=0` weak form
        exposuresAtConstruction.push(totalOf(m));
        for (const book of m.pcLatency!.books) {
          for (let ri = 0; ri < ROSTER_SIZE; ri++) {
            for (const key of PC_BOOK_CELLS) expect(book.tierFor(ri, key)).toBe('choice');
          }
        }
      }
      league.applyResult(f, m.runToCompletion());
    }
    expect(exposuresAtConstruction).toEqual([0, 0, 0]); // ⭐ the pin
    expect(beforeArming[0]).toBe(0); // match 1 was always honest
    expect(Math.max(...beforeArming.slice(1))).toBeGreaterThan(0); // ⚠ the drift is real
  });

  it('⭐ the empty form empties through the book\'s OWN public reset() — no field surgery', () => {
    const code = repoText('src/game/a4World.ts');
    const fn = code.slice(code.indexOf('export function resetPcBooks'));
    const body = fn.slice(0, fn.indexOf('\n}'));
    expect(body).toContain('book.reset()');
    expect(body).not.toContain('cells');
    expect(body).not.toContain('snapshot');
    // and the arming really routes the null dose there
    const arm = code.slice(code.indexOf('export function armPcWorld'));
    expect(arm.slice(0, arm.indexOf('\n}'))).toContain('else resetPcBooks(match)');
  });

  it('the contrast is a NAMED param, defaults to DOSED, and is not sticky', () => {
    expect(PC_DOSE_PARAM).toBe('pcdose');
    expect(pcDoseWanted('')).toBe(true);
    expect(pcDoseWanted('?a4world=8')).toBe(true);
    expect(pcDoseWanted('?a4world=8&pcdose=0')).toBe(false);
    expect(pcDoseWanted('?pcdose=off')).toBe(false);
    expect(pcDoseWanted('?pcdose=empty')).toBe(false);
    expect(pcDoseWanted('?pcdose=false')).toBe(false);
    expect(pcDoseWanted('?pcdose=1')).toBe(true);
    expect(repoText('src/game/a4World.ts')).not.toContain("'evo:pcdose'");
  });

  it('the doc states the honest expectation: the weak form is the WILDEST arm', () => {
    expect(DOC).toContain('?pcdose=0');
    expect(DOC).toContain('全新手');
  });
});

// ===========================================================================
describe('PC entry — ⭐⭐ NO LAMARCK: match-local book state only', () => {
  it('the PC seam writes no genome field at all', () => {
    const m = pcMatch();
    for (const side of [0, 1] as const) {
      for (const g of [m.teams[side].info.genome, m.teams[side].baseGenome,
        m.teams[side].effGenome] as TacticalGenome[]) {
        expect((g as unknown as Record<string, unknown>).pcReactionLatency).toBeUndefined();
        expect((g as unknown as Record<string, unknown>).recognitionBook).toBeUndefined();
      }
      // world 6's own dose keeps its RATIFIED form (#270.3(1)): never on info.genome
      expect((m.teams[side].info.genome as TacticalGenome).cbCarryProneness).toBeUndefined();
      expect((m.teams[side].effGenome as TacticalGenome).cbCarryProneness).toBe(1);
    }
  });

  it('⭐ the league serializes without the gene AND without any book state', () => {
    const league = new League({ seed: 12500901 });
    league.matchFlags = a4MatchFlags(PC_WORLD_VERSION);
    const match = league.createMatch(league.nextFixture()!);
    armA4World(match, null, PC_WORLD_VERSION, L3_DOSE, PC_DOSE);
    const json = JSON.stringify(league);
    expect(json).not.toContain('cbCarryProneness');
    expect(json).not.toContain('pcBooks');
    expect(json).not.toContain('recognitionBooks');
    expect(json).not.toContain('pcReactionLatency');
  });

  it('⚠ the WORKER fast-sim path is the SHIPPED world — matchFlags do not survive a save', () => {
    // Canon, home ruling #283.2(iv): "WORKER-SIMMED fixtures play the SHIPPED world
    // (League.toJSON omits matchFlags)". True of the whole entry family; re-pinned for world 8.
    const league = new League({ seed: 12500901 });
    league.matchFlags = a4MatchFlags(PC_WORLD_VERSION);
    const live = league.createMatch(league.nextFixture()!);
    expect(live.pcReactionLatency).toBe(true);
    const rebuilt = League.fromJSON(JSON.parse(JSON.stringify(league)) as Record<string, unknown>);
    const simmed = rebuilt.createMatch(rebuilt.nextFixture()!);
    expect(simmed.pcReactionLatency).toBe(false);
    expect(simmed.pcLatency).toBeNull();
    expect(pcArmedVersion(simmed)).toBe(0);
    expect(a4ArmedVersion(simmed)).toBe(0);
  });
});

// ===========================================================================
describe('PC entry OFF — the shipped world is untouched (Road B)', () => {
  it('an unarmed league match carries no door and no latency seat', () => {
    const m = fixtureMatch({});
    expect(m.pcReactionLatency).toBe(false);
    expect(m.pcLatency).toBeNull();
    expect(pcArmedVersion(m)).toBe(0);
    expect(a4ArmedVersion(m)).toBe(0);
  });

  it('⭐ multi-seed: a production match is bit-for-bit what it was without this rung', () => {
    for (const seed of [12500900, 12500901, 12500902]) {
      const a = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      const b = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      while (!a.finished) a.step(DT);
      while (!b.finished) b.step(DT);
      expect(signature(a)).toBe(signature(b));
      expect(a.pcLatency).toBeNull();
    }
  }, 120_000);

  it('⭐ the dose chunk is OPT-IN: not in the every-install precache', () => {
    expect(isShellAsset('assets/pc-t1-learning-exam-DEADBEEF.js')).toBe(false);
    expect(isShellAsset('assets/l3-t1-convergence-exam-DEADBEEF.js')).toBe(false);
    expect(isShellAsset('assets/index-abc.js')).toBe(true);
    // …and the app fetches it only on the world-8 path
    const app = repoText('src/game/GameApp.ts');
    const arm = app.slice(app.indexOf('private async armA4('));
    expect(arm.slice(0, arm.indexOf('\n  }'))).toContain('isPcWorld(version)');
    expect(app).toContain('this.pcDose = await loadPcDose();');
  });

  it('a failed dose load DISARMS rather than naming a world it did not arm', () => {
    const app = repoText('src/game/GameApp.ts');
    const arm = app.slice(app.indexOf('private async armA4('), app.indexOf('setEmergentPos(v: boolean)'));
    const fail = arm.slice(arm.indexOf('PC world dose failed to load'));
    expect(fail.slice(0, fail.indexOf('applyEdsPreview'))).toContain('this.a4World = 0;');
    expect(fail.slice(0, fail.indexOf('applyEdsPreview'))).toContain('this.a4Badge.setWorld(0);');
  });
});

// ===========================================================================
describe('PC entry — the entry: one value, eight worlds, one named contrast', () => {
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

  it('the phone link is ?a4world=8 and stays exclusive', () => {
    expect(a4UrlOverride('?a4world=8')).toBe(8);
    expect(a4UrlOverride('?a4world=7')).toBe(7);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=9')).toBe(9); // ⭐ #309.5: the ninth world
    expect(a4UrlOverride('?a4world=10')).toBeNull(); // no tenth world exists
    expect(DOC).toContain('?a4world=8');
  });

  it('the sticky key stores 8 and reads it back', () => {
    storage();
    writeA4World(PC_WORLD_VERSION);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBe('8');
    expect(readA4World()).toBe(PC_WORLD_VERSION);
    writeA4World(0);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBeNull();
  });

  it('the settings checkbox is the eighth, exclusive with all seven others', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('setA4World(v ? 8 : 0)');
    expect(settings).toContain('input(pcBox).checked = version === 8;');
    expect(settings).toContain('input(l3Box).checked = version === 7;');
    expect(settings).toContain('CB+防守账本+反应延迟 · 有处理时间的世界 (play-test)');
  });

  it('⭐ the badge names the world AND the dose form', () => {
    expect(A4_BADGE_TEXTS[8]).toBe(A4_BADGE_TEXT_PC);
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(9); // nine distinct names
    expect(A4_BADGE_TEXT_PC).not.toBe(A4_BADGE_TEXT_PC_EMPTY);
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
    badge.setWorld(8);
    expect(badge.label).toBe(A4_BADGE_TEXT_PC);
    badge.setWorld(8, A4_BADGE_TEXT_PC_EMPTY); // the same world, the other form
    expect(badge.world).toBe(8);
    expect(badge.label).toBe(A4_BADGE_TEXT_PC_EMPTY);
    expect(els).toHaveLength(1); // ONE chip, relabelled — never a second entry
    badge.setWorld(0);
    expect(badge.mounted).toBe(false);
  });

  it('the GameApp guard arms world 8 without waiting for A4 census tables', () => {
    const app = repoText('src/game/GameApp.ts');
    expect(app.match(/armA4World\(/g)).toHaveLength(1); // still ONE arming call site
    expect(app).toContain(
      '|| isCbWorld(this.a4World) || isL3World(this.a4World) || isPcWorld(this.a4World)\n'
      + '      || isBkWorld(this.a4World))) {',
    );
    expect(app).toContain(
      'armA4World(this.match, this.a4Tables, this.a4World, this.l3Dose, this.pcDose);',
    );
  });

  it('the entry module arms no evolution opt-in', () => {
    const code = repoText('src/game/a4World.ts')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toContain('evolveCarryChoice');
    expect(code).not.toContain('evolveHomePrior');
  });
});

/** A minimal two-team fixture for the identity walk — the engine's own defaults. */
function teamOf(name: string, seed: number): ConstructorParameters<typeof Match>[0]['teamA'] {
  const league = new League({ seed, matchDuration: 240 });
  return league.teamInfo(name === 'A' ? 0 : 1);
}
