import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import type { Match } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import type { TacticalGenome } from '../src/evolution/genome';
import { homePriorStrength, HOME_MAP_STRENGTH_MAX } from '../src/ai/stationEye';
import {
  A4_BASE_SHA, A4_CONTROL_SHA, A4_MERGED_SHA, A4_OBEDIENCE, A4_WORLD_FLAGS, A4_WORLD_KEY,
  A4_WORLD_PARAM, a4EyeConfig, a4MatchFlags, a4UrlOverride, armA4World, isA4Armed, loadA4Tables,
  readA4World, type A4Tables,
} from '../src/game/a4World';
import { A4_BADGE_CLASS, A4_BADGE_TEXT, A4WorldBadge, type BadgeDoc, type BadgeElement } from '../src/ui/A4WorldBadge';
import { isShellAsset, precacheList } from '../scripts/pwaAssets';

/**
 * A4 PLAY-TEST ENTRY (commander ruling #155) — the opt-in that puts the
 * CERTIFIED PRIOR WORLD under the user's eyes.
 *
 * What this file pins is not "does the checkbox work" but the two halves of
 * the contract that can rot silently:
 *   (1) ENTRY OFF ⇒ the shipped game, untouched. The production fingerprint
 *       57b0bdab…c673 unchanged (X-FP-PROD), an unarmed league builds a match
 *       with every A4 seam off, a null `stationEye` and no obedience gene, and
 *       that match reproduces itself byte-for-byte.
 *   (2) ENTRY ON ⇒ EXACTLY the world #154 certified, not an approximation:
 *       the enriched census substrate (`CENSUS_FLAGS` of the P3′ probe,
 *       compared against that probe's own source text), the PRIOR arm's eye
 *       (v3 {roleTable, control, children, mergedTableSha} + v4 {inSupportLaw,
 *       deliveryBit, offsideBit, homePrior}) built on artifacts whose SHAs
 *       REHASH to the frozen values, and obedience 0.5 on BOTH teams — and it
 *       demonstrably diverges from the same world unarmed.
 *
 * Fidelity source: `scripts/probes/a4-p3prime-replication.ts` (the PRIOR arm).
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');

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
  const league = new League({ seed: 20260806, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

const obedienceOf = (m: Match, side: 0 | 1): Array<number | undefined> => [
  (m.teams[side].info.genome as TacticalGenome).homePriorObedience,
  (m.teams[side].baseGenome as TacticalGenome).homePriorObedience,
  (m.teams[side].effGenome as TacticalGenome).homePriorObedience,
];

// ===========================================================================
describe('A4 entry OFF — the shipped world is untouched (Road B / X-FP-PROD)', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000);

  it('an unarmed league still builds the shipped match: no flags, no eye, no gene', () => {
    const league = new League({ seed: 20260806, matchDuration: 300 });
    expect(league.matchFlags).toEqual({}); // the widened key set changed no default
    const match = league.createMatch(league.nextFixture()!);
    for (const on of [
      match.edsPerceivedChoice, match.edsPerceivedDefence, match.edsValueAxis,
      match.edsTouchCost, match.c5Hold, match.c5TouchFork, match.c6Carry, match.c7Windup,
    ]) expect(on).toBe(false);
    expect(match.stationEye).toBeNull();
    expect(isA4Armed(match)).toBe(false);
    for (const side of [0, 1] as const) {
      expect(obedienceOf(match, side)).toEqual([undefined, undefined, undefined]);
    }
  });

  it('the unarmed match reproduces itself byte-for-byte (decision stream identical)', () => {
    expect(runToEnd(fixtureMatch({}))).toBe(runToEnd(fixtureMatch({})));
  });

  it('the entry defaults OFF with no storage and no URL, and is opt-in only', () => {
    expect(readA4World()).toBe(0); // the version-typed choice (#167.5): 0 = the shipped game
    expect(A4_WORLD_KEY).toBe('evo:a4World');
    // The ONE call site that can arm a live match, and its guard.
    const app = repoText('src/game/GameApp.ts');
    expect(app.match(/armA4World\(/g)).toHaveLength(1);
    // #211.3 widened the guard: the MT worlds carry no census payload, so they
    // arm without tables — the A4 worlds still cannot. #269.4 widened it once more for
    // the CB world, which likewise carries none.
    expect(app).toContain(
      'if (this.a4World !== 0 && (this.a4Tables !== null || isMtWorld(this.a4World) '
      + '|| isCbWorld(this.a4World))) {',
    );
    expect(app).toContain('armA4World(this.match, this.a4Tables, this.a4World);');
    expect(app).toContain('private a4World: A4WorldVersion = 0;');
  });

  it('the URL param is an explicit two-way opt-in and ignores anything else', () => {
    expect(A4_WORLD_PARAM).toBe('a4world');
    expect(a4UrlOverride('?a4world=1')).toBe(1);
    expect(a4UrlOverride('?a4world=on')).toBe(1);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=off')).toBe(0);
    expect(a4UrlOverride('')).toBeNull();
    expect(a4UrlOverride('?other=1')).toBeNull();
    expect(a4UrlOverride('?a4world=yes')).toBeNull(); // unparseable ⇒ no opinion ⇒ sticky wins
  });
});

// ===========================================================================
describe('A4 entry ON — EXACTLY the certified PRIOR configuration', () => {
  it('the substrate flags are the P3′ probe\'s CENSUS_FLAGS, verbatim', () => {
    expect(A4_WORLD_FLAGS).toEqual({
      edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
      c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
    });
    // …and that literal still IS the probe's, not a copy that drifted.
    const probe = repoText('scripts/probes/a4-p3prime-replication.ts');
    const block = /const CENSUS_FLAGS = \{([\s\S]*?)\} as const;/.exec(probe)?.[1];
    expect(block).toBeDefined();
    const parsed: Record<string, boolean> = {};
    for (const [, k, v] of (block ?? '').matchAll(/(\w+):\s*(true|false)/g)) parsed[k] = v === 'true';
    expect(parsed).toEqual({ ...A4_WORLD_FLAGS });
  });

  it('the whisper prior is the #148 certified primary dose (obedience 0.5)', () => {
    expect(A4_OBEDIENCE).toBe(0.5);
    expect(homePriorStrength(A4_OBEDIENCE)).toBeCloseTo(0.5 * HOME_MAP_STRENGTH_MAX, 12);
    expect(homePriorStrength(A4_OBEDIENCE)).toBeCloseTo(0.25 * 0.163494, 9);
  });

  it('the bundled census artifacts REHASH to the frozen SHAs (X-MERGE-IDENT)', async () => {
    const tables = await loadA4Tables();
    expect(tables.mergedTableSha).toBe(A4_MERGED_SHA);
    expect(tables.controlSha).toBe(A4_CONTROL_SHA);
    // the base rehashes to the injected v3 base, and the merged field
    // reproduces from {base, children} — the probe's own identity check.
    expect(sha(tables.roleTable)).toBe(A4_BASE_SHA);
    expect(sha({ base: tables.roleTable, children: tables.children })).toBe(A4_MERGED_SHA);
  });

  it('the eye config equals the PRIOR arm of the P3′ probe, field for field', async () => {
    const tables = await loadA4Tables();
    const eye = a4EyeConfig(tables);
    expect(eye.arm).toBe('neutral');
    expect(eye.scope).toEqual({ kind: 'both' });
    expect(eye.table).toEqual({});
    expect(eye.v2).toBeUndefined();
    expect(eye.v3?.roleTable).toBe(tables.roleTable);
    expect(eye.v3?.control).toBe(tables.control);
    expect(eye.v3?.children).toBe(tables.children);
    expect(eye.v3?.mergedTableSha).toBe(A4_MERGED_SHA);
    // the three P3p bits AND the home-prior master flag — nothing else.
    expect(eye.v4).toEqual({
      inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: true,
    });
  });

  it('arming writes obedience 0.5 onto BOTH teams, on all three genome references', async () => {
    const tables = await loadA4Tables();
    const match = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(match, tables);
    for (const side of [0, 1] as const) {
      expect(obedienceOf(match, side)).toEqual([0.5, 0.5, 0.5]);
    }
    expect(match.stationEye?.v4?.homePrior).toBe(true);
    expect(isA4Armed(match)).toBe(true);
    // the enriched substrate reached the Match too.
    expect([match.edsPerceivedChoice, match.edsPerceivedDefence, match.edsValueAxis])
      .toEqual([true, true, true]);
    expect([match.c5Hold, match.c6Carry, match.c7Windup, match.c5TouchFork])
      .toEqual([true, true, true, false]);
  });

  it('the armed match DIVERGES from the same fixture unarmed (the world really changed)', async () => {
    const tables = await loadA4Tables();
    const baseline = runToEnd(fixtureMatch({}));
    const substrate = runToEnd(fixtureMatch({ ...A4_WORLD_FLAGS }));
    const armed = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(armed, tables);
    const armedSig = runToEnd(armed);
    expect(armedSig).not.toBe(baseline);   // vs the shipped world
    expect(armedSig).not.toBe(substrate);  // …and vs the substrate WITHOUT the eye+prior
    // deterministic: the armed world reproduces itself.
    const again = fixtureMatch({ ...A4_WORLD_FLAGS });
    armA4World(again, tables);
    expect(runToEnd(again)).toBe(armedSig);
  }, 60_000);
});

// ===========================================================================
describe('A4 badge — the user always knows which world they are watching', () => {
  interface FakeEl extends BadgeElement { removed: boolean }
  const fakeDoc = (): { doc: BadgeDoc; children: FakeEl[] } => {
    const children: FakeEl[] = [];
    const doc: BadgeDoc = {
      createElement: (): BadgeElement => {
        const el: FakeEl = {
          className: '', textContent: null, removed: false,
          remove(): void { this.removed = true; children.splice(children.indexOf(el), 1); },
        };
        return el;
      },
      body: { appendChild: (node: BadgeElement): void => { children.push(node as FakeEl); } },
    };
    return { doc, children };
  };

  it('renders ONLY when armed, once, and disappears when disarmed', () => {
    const { doc, children } = fakeDoc();
    const badge = new A4WorldBadge(doc);
    expect(badge.mounted).toBe(false);
    expect(children).toHaveLength(0);

    badge.setWorld(0); // a no-op from the default state
    expect(children).toHaveLength(0);

    badge.setWorld(1);
    expect(badge.mounted).toBe(true);
    expect(children).toHaveLength(1);
    expect(children[0].className).toBe(A4_BADGE_CLASS);
    expect(children[0].textContent).toBe(A4_BADGE_TEXT);

    badge.setWorld(1); // idempotent — never a second chip
    expect(children).toHaveLength(1);

    badge.setWorld(0);
    expect(badge.mounted).toBe(false);
    expect(children).toHaveLength(0);
  });

  it('is safe headless (no document ⇒ no badge, no throw)', () => {
    const badge = new A4WorldBadge(null);
    badge.setWorld(1);
    expect(badge.mounted).toBe(false);
  });

  it('the chip has a stylesheet rule and stays out of the tap surface', () => {
    const css = repoText('src/ui/style.css');
    expect(css).toContain(`.${A4_BADGE_CLASS} {`);
    const rule = css.slice(css.indexOf(`.${A4_BADGE_CLASS} {`));
    expect(rule.slice(0, rule.indexOf('}'))).toContain('pointer-events: none');
    // reachable on a phone: fixed to the viewport, inside the safe area.
    expect(rule.slice(0, rule.indexOf('}'))).toContain('env(safe-area-inset-top)');
  });
});

// ===========================================================================
describe('A4 entry — reachable on desktop AND phone', () => {
  it('the settings screen carries the toggle (the ⚙ room is the phone entry)', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('actions.setA4World(version)');
    expect(settings).toContain('a4WorldInitial');
  });

  it('the census chunks are lazy AND out of the install-time precache', () => {
    // "Nothing changes for a player who does not opt in" (#155.2.v) includes
    // the download: the tables are a dynamic import (their own async chunk),
    // and the service worker must not precache them into every install.
    const mod = repoText('src/game/a4World.ts');
    expect(mod).toContain("import('../../docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json')");
    expect(isShellAsset('assets/stage3-v4-p3p1-merged-role-census-table-Dabc123.js')).toBe(false);
    expect(isShellAsset('assets/stage3-v3-p2-control-recovery-Dabc123.js')).toBe(false);
    expect(precacheList(['assets/index-abc.js', 'assets/stage3-v4-p3p1-merged-role-census-table-Dabc.js']))
      .toEqual(['./', './assets/index-abc.js', './index.html']);
  });

  it('arming replaces the EDS preview flags rather than mixing worlds', () => {
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('this.league.matchFlags = this.a4World');
    // the flags come from the entry-layer composer (#184.2); for v1 that composer
    // is the census set itself, spread from the untouched frozen object.
    expect(app).toContain('? a4MatchFlags(this.a4World)');
    expect(repoText('src/game/a4World.ts')).toContain('{ ...A4_WORLD_FLAGS }');
    expect(a4MatchFlags(1)).toEqual({ ...A4_WORLD_FLAGS });
  });
});

/** Type-only pin: the loader's shape is what `armA4World` consumes. */
export type _A4TablesPin = A4Tables;
