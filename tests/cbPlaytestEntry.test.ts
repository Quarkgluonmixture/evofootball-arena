import { afterEach, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import type { TacticalGenome } from '../src/evolution/genome';
import {
  A4_WORLD_KEY, CB_WORLD_DOORS, CB_WORLD_DOSE, CB_WORLD_VERSION,
  a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, cbArmedVersion, isA4Armed,
  isCbWorld, isMtWorld, readA4World, writeA4World,
} from '../src/game/a4World';
import { A4_BADGE_TEXT_CB, A4_BADGE_TEXTS } from '../src/ui/A4WorldBadge';
import { buildRenderState, interpolateStates } from '../src/render3d/RenderStateAdapter';
import {
  CB_KNOCK_LINGER_S, CB_TRAIL_MIN_STEP_M, CbVisibility, type CbBodyFrame,
} from '../src/render/cbVisibility';
import { isShellAsset } from '../scripts/pwaAssets';

/**
 * ⭐⭐ THE CB PLAY-TEST ENTRY + THE VISIBILITY AFFORDANCES (ruling #269.4, contract §2 M-CB.3;
 * docs/world-model/CB-FRONTEND-VISIBILITY-RUNG.md). The #156/#168/#211.3 entry form, sixth of
 * its family, plus the first rendering this programme has ever had to argue is HONEST.
 *
 * What has to be pinned:
 *   (1) ⭐ FIDELITY — the armed world IS the CB-T2 battery's `'both'` arm: the substrate is
 *       `a4MatchFlags(3)` (CALLED, so it cannot drift), the three doors are `armConfig('both')`
 *       and the dose is the probe's `DOSE`. Anchored against the probe SOURCE.
 *   (2) ⭐⭐ NO LEAK INTO THE SAVE — `cbCarryProneness` is BORN ABSENT and `TeamInfo.genome` is
 *       the league franchise's own object, so the dose must reach the MATCH and nothing else.
 *   (3) ⭐⭐ THE RENDER IS READ-ONLY AND REAL-STATE — the two new render modules import nothing
 *       from the sim, write nothing, and every quantity they draw is traceable to engine state;
 *       an unarmed match produces a render state with no CB field at all.
 *   (4) DEFAULT OFF SURVIVES: an unarmed match carries no door and no gene, the world ships no
 *       payload (nothing new in the every-install precache), and the entry is one exclusive
 *       value with its own URL param, checkbox and badge.
 */

const repoText = (p: string): string => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const PROBE = repoText('scripts/probes/cb-t2-choice-seat.ts');
const DOC = repoText('docs/world-model/CB-FRONTEND-VISIBILITY-RUNG.md');

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const fixtureMatch = (flags: League['matchFlags']): Match => {
  const league = new League({ seed: 12475900, matchDuration: 300 });
  league.matchFlags = flags;
  return league.createMatch(league.nextFixture()!);
};

/** The CB world built exactly the way the app builds it (flags at construction, gene after). */
const cbMatch = (): Match => {
  const match = fixtureMatch(a4MatchFlags(CB_WORLD_VERSION));
  armA4World(match, null, CB_WORLD_VERSION); // ⭐ no census tables: the CB world needs none
  return match;
};

const genomesOf = (m: Match, side: 0 | 1): TacticalGenome[] => [
  m.teams[side].info.genome, m.teams[side].baseGenome, m.teams[side].effGenome,
] as TacticalGenome[];

// ===========================================================================
describe('CB entry — ⭐ FIDELITY: the armed world IS the battery\'s both-arm', () => {
  it('the doors and the dose are the probe\'s own `armConfig(\'both\')` and `DOSE`', () => {
    // the probe's arm config, read out of its source
    const arm = /const armConfig = \(arm: ArmName\): Partial<MatchConfig> => \(\{([\s\S]*?)\}\);/
      .exec(PROBE)?.[1];
    expect(arm).toBeDefined();
    expect(arm).toContain("cbChoiceSeat: arm !== 'off'");
    expect(arm).toContain("cbTouchPast: arm !== 'off'");
    expect(arm).toContain("cbCommitPhysics: arm === 'both'"); // ⇒ 'both' throws all three
    expect(CB_WORLD_DOORS).toEqual({
      cbCommitPhysics: true, cbTouchPast: true, cbChoiceSeat: true,
    });
    // the probe's dose, likewise read from source
    const dose = /const DOSE = ([\d.]+);/.exec(PROBE)?.[1];
    expect(Number(dose)).toBe(CB_WORLD_DOSE);
    expect(CB_WORLD_DOSE).toBe(1);
    // the probe's substrate line is the same CALL this entry makes
    expect(PROBE).toContain('...a4MatchFlags(3),');
  });

  it('the flags are `a4MatchFlags(3)` ∪ the three doors, key for key', () => {
    const flags = a4MatchFlags(CB_WORLD_VERSION) as Record<string, boolean>;
    expect(flags).toEqual({ ...a4MatchFlags(3), ...CB_WORLD_DOORS });
    // …and the A4 census set itself is NOT widened by this world existing
    expect(a4MatchFlags(3) as Record<string, boolean>).not.toHaveProperty('cbTouchPast');
    expect(a4MatchFlags(1) as Record<string, boolean>).not.toHaveProperty('cbChoiceSeat');
  });

  it('the stage doc\'s arming table names the same three doors and the same dose', () => {
    for (const door of Object.keys(CB_WORLD_DOORS)) expect(DOC).toContain(door);
    expect(DOC).toContain('`cbCarryProneness` = **1.0**');
  });
});

// ===========================================================================
describe('CB entry — arming: three doors at construction, the dose on the MATCH only', () => {
  it('⭐ the doors arrive at construction and the dose reaches the effective genome', () => {
    const match = cbMatch();
    expect(match.cbCommitPhysics).toBe(true);
    expect(match.cbTouchPast).toBe(true);
    expect(match.cbChoiceSeat).toBe(true);
    for (const side of [0, 1] as const) {
      expect((match.teams[side].effGenome as TacticalGenome).cbCarryProneness).toBe(CB_WORLD_DOSE);
      expect((match.teams[side].baseGenome as TacticalGenome).cbCarryProneness).toBe(CB_WORLD_DOSE);
    }
    expect(cbArmedVersion(match)).toBe(CB_WORLD_VERSION);
    expect(a4ArmedVersion(match)).toBe(CB_WORLD_VERSION);
    expect(isCbWorld(CB_WORLD_VERSION)).toBe(true);
    expect(isMtWorld(CB_WORLD_VERSION)).toBe(false);
  });

  it('⭐⭐ THE SAVE IS NOT TOUCHED: the born-absent gene never reaches the franchise', () => {
    const league = new League({ seed: 12475901, matchDuration: 300 });
    league.matchFlags = a4MatchFlags(CB_WORLD_VERSION);
    const match = league.createMatch(league.nextFixture()!);
    armA4World(match, null, CB_WORLD_VERSION);
    // the match sees the dose…
    expect((match.teams[0].effGenome as TacticalGenome).cbCarryProneness).toBe(CB_WORLD_DOSE);
    // …and `info.genome` — which IS `franchise.coach.genome`, one object — does not.
    for (const side of [0, 1] as const) {
      expect((match.teams[side].info.genome as TacticalGenome).cbCarryProneness).toBeUndefined();
    }
    // the whole league serializes without the key, so no save can carry it
    expect(JSON.stringify(league.toJSON())).not.toContain('cbCarryProneness');
    // and the writer deliberately does NOT use the `info.genome` idiom
    const src = repoText('src/game/a4World.ts');
    const setter = src.slice(src.indexOf('export function setCbProneness'));
    expect(setter.slice(0, setter.indexOf('\n}'))).not.toContain('info.genome');
  });

  it('the dose survives the in-match mentality rebuild (it spreads from baseGenome)', () => {
    const match = cbMatch();
    const team = match.teams[0];
    team.effGenome = { ...team.baseGenome } as TacticalGenome; // the applyMentality shape
    expect((team.effGenome as TacticalGenome).cbCarryProneness).toBe(CB_WORLD_DOSE);
  });

  it('a CB world is NOT an A4 or MT world: no eye, no whisper, no seam genes', () => {
    const match = cbMatch();
    expect(match.stationEye).toBeNull();
    expect(isA4Armed(match)).toBe(false);
    expect(match.pmLaneConvergence).toBe(false);
    expect(match.mtMarkSag).toBe(false);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(match, side)) {
        expect(g.homePriorObedience).toBeUndefined();
        expect(g.defLaneConvergence).toBeUndefined();
        expect(g.markSag).toBeUndefined();
      }
    }
  });

  it('FIXED DOSE: nothing in the module arms an evolution opt-in', () => {
    // comments stripped — an assertion about what the CODE does, not what it says
    const code = repoText('src/game/a4World.ts')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    expect(code).not.toContain('evolveCarryChoice');
    expect(code).not.toContain('evolveHomePrior');
  });
});

// ===========================================================================
describe('CB entry OFF — the shipped world is untouched (Road B)', () => {
  it('an unarmed league match carries no door and no gene', () => {
    const match = fixtureMatch({});
    expect(match.cbCommitPhysics).toBe(false);
    expect(match.cbTouchPast).toBe(false);
    expect(match.cbChoiceSeat).toBe(false);
    expect(cbArmedVersion(match)).toBe(0);
    expect(a4ArmedVersion(match)).toBe(0);
    for (const side of [0, 1] as const) {
      for (const g of genomesOf(match, side)) expect(g.cbCarryProneness).toBeUndefined();
    }
  });

  it('⭐ multi-seed: a production match is bit-for-bit what it was without this rung', () => {
    // The rung touches no file under src/sim, src/ai or src/evolution, so the OFF world
    // cannot have moved; this walks it anyway, on this rung's own seed band.
    for (const seed of [12475900, 12475901, 12475902]) {
      const a = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      const b = new Match({ seed, teamA: teamOf('A', seed), teamB: teamOf('B', seed), duration: 240 });
      while (!a.finished) a.step(DT);
      while (!b.finished) b.step(DT);
      expect(signature(a)).toBe(signature(b));
      expect(a.cbLedger.touchPasts).toBe(0);
      expect(a.cbLedger.recoveries).toBe(0);
    }
  }, 120_000);

  it('the world ships NO payload — nothing new in the every-install precache', () => {
    // The CB world needs no census artifact at all (unlike the A4 worlds' ~440 kB), so the
    // opt-in exclusion list is unchanged and there is nothing to add to it.
    expect(isShellAsset('assets/stage3-v4-p3p1-merged-role-census-table-abc.js')).toBe(false);
    expect(isShellAsset('assets/index-abc.js')).toBe(true);
    const app = repoText('src/game/GameApp.ts');
    const arm = app.slice(app.indexOf('private async armA4('));
    expect(arm.slice(0, arm.indexOf('\n  }'))).toContain('!isCbWorld(version)'); // skips the load
  });
});

// ===========================================================================
describe('CB affordances — ⭐⭐ the render is READ-ONLY and made of real state', () => {
  const RENDER_MODULES = ['src/render/cbVisibility.ts', 'src/render3d/CbLayer.ts'];

  it('⭐ the new render modules hold no sim reference at all', () => {
    for (const p of RENDER_MODULES) {
      const src = repoText(p);
      // no value import from the sim/ai/evolution trunks — types only, and CbLayer not even that
      for (const m of src.matchAll(/^import\s+(type\s+)?\{[^}]*\}\s+from\s+'([^']+)'/gm)) {
        const isType = m[1] !== undefined;
        const from = m[2];
        if (/\.\.\/(sim|ai|evolution|game)\//.test(from)) {
          expect(isType, `${p} value-imports ${from}`).toBe(true);
        }
      }
      // and nothing that could write through one
      expect(src).not.toContain('match.');
      expect(src).not.toContain('.owner =');
      expect(src).not.toContain('rng');
    }
  });

  it('⭐ the bridge\'s CB block only READS — one guarded loop, two assignments, both to the view', () => {
    const src = repoText('src/render3d/RenderStateAdapter.ts');
    const block = src.slice(src.indexOf('if (match.cbCommitPhysics'), src.indexOf('const ball: RenderBall'));
    // every assignment in the block writes a render-state object, never a sim object
    for (const m of block.matchAll(/^\s*([\w.[\]]+)\s*=\s*/gm)) {
      expect(m[1].startsWith('players[i].')).toBe(true);
    }
    expect(block).toContain('players[i].cbRecover = p.tackleCooldown;');
    expect(block).toContain('players[i].cbCarryThrough = p.stunTimer;');
    // the feed is likewise a pure read of two engine quantities
    const feed = src.slice(src.indexOf('function cbFeedOf'));
    expect(feed).toContain('knocks: match.cbLedger.touchPasts,');
    expect(feed.slice(0, feed.indexOf('\n}'))).not.toMatch(/match\.[\w.]+\s*=/);
  });

  it('an UNARMED match publishes no CB field anywhere in the render state', () => {
    const match = fixtureMatch({});
    for (let i = 0; i < 200; i++) match.step(DT);
    const state = buildRenderState(match, false);
    expect(state.cb).toBeUndefined();
    for (const p of state.players) {
      expect(p.cbRecover).toBeUndefined();
      expect(p.cbCarryThrough).toBeUndefined();
    }
    // …so the tracker draws nothing, and says so
    const vis = new CbVisibility().update(state.t, 0, 0, false, state.cb ?? null, state.players);
    expect(vis.knock).toBeNull();
    expect(vis.beatenCount).toBe(0);
  });

  it('⭐⭐ ARMED: every rendered quantity traces to the match\'s own state', () => {
    const match = cbMatch();
    const vis = new CbVisibility();
    let sawFeed = false;
    let sawKnock = false;
    let sawRing = false;
    /** Every ball position the viewer ever sampled — the trail may contain nothing else. */
    const seen = new Set<string>();
    for (let i = 0; i < 20_000 && !match.finished; i++) {
      match.step(DT);
      if (i % 4 !== 0) continue; // a frame is several sim steps, as in the app
      const state = buildRenderState(match, false);
      expect(state.cb).toBeDefined();
      sawFeed = true;
      // the feed IS the ledger and the engine's own touch marker
      expect(state.cb!.knocks).toBe(match.cbLedger.touchPasts);
      expect(state.cb!.touch?.gid ?? null).toBe(match.dribbleTouch?.gid ?? null);
      seen.add(`${state.ball.x},${state.ball.z}`);
      const out = vis.update(
        state.t, state.ball.x, state.ball.z, state.ball.ownerGid !== null,
        state.cb!, state.players,
      );
      if (out.knock !== null && out.knock.points > 0) {
        sawKnock = true;
        // ⭐ THE TRAIL IS THE BALL'S OWN PAST POSITIONS — every point was sampled off the ball
        for (let j = 0; j < out.knock.points; j++) {
          expect(seen.has(`${out.knock.path[j * 2]},${out.knock.path[j * 2 + 1]}`)).toBe(true);
        }
        expect(out.knock.alpha).toBeGreaterThan(0);
      }
      for (let j = 0; j < out.beatenCount; j++) {
        const m = out.beaten[j];
        const body = match.allPlayers.find((p) => p.gid === m.gid)!;
        sawRing = true;
        // ⭐ THE RING'S CLOCK IS HIS OWN `tackleCooldown`, and it never outlives it
        expect(m.remain).toBe(body.tackleCooldown);
        expect(m.carryThrough).toBe(body.stunTimer > 0);
        expect(m.x).toBe(body.pos.x);
        expect(m.z).toBe(body.pos.y);
        expect(m.frac).toBeGreaterThan(0);
        expect(m.frac).toBeLessThanOrEqual(1);
        // the man who came away with the ball is never marked
        expect(match.ball.lastTouch === body).toBe(false);
      }
    }
    expect(sawFeed).toBe(true);
    expect(sawKnock).toBe(true); // the armed world really does produce knocks to draw
    expect(sawRing).toBe(true); // …and beaten bodies to ring
  }, 180_000);

  it('the tracker opens on the ledger\'s rise, closes on the engine\'s own resolution', () => {
    const vis = new CbVisibility();
    const bodies: CbBodyFrame[] = [];
    const feed = (knocks: number, until: number | null): { knocks: number; touch: { gid: number; until: number } | null } =>
      ({ knocks, touch: until === null ? null : { gid: 7, until } });
    // frame 0 establishes the counter — a knock we did not see is not drawn
    expect(vis.update(0, 0, 0, true, feed(3, null), bodies).knock).toBeNull();
    // the counter rises ⇒ the episode opens at the ball's own position
    let out = vis.update(0.1, 10, 5, false, feed(4, 1.7), bodies);
    expect(out.knock).not.toBeNull();
    expect(out.knock!.x0).toBe(10);
    expect(out.knock!.z0).toBe(5);
    expect(out.knock!.live).toBe(true);
    // …grows only with real movement (a ball that has not moved adds no point)
    out = vis.update(0.2, 10, 5 + CB_TRAIL_MIN_STEP_M / 2, false, feed(4, 1.7), bodies);
    expect(out.knock!.points).toBe(1);
    out = vis.update(0.3, 12, 5, false, feed(4, 1.7), bodies);
    expect(out.knock!.points).toBe(2);
    // …and the race ends when someone OWNS the ball
    out = vis.update(0.4, 12.5, 5, true, feed(4, 1.7), bodies);
    expect(out.knock!.live).toBe(false);
    expect(out.knock!.alpha).toBe(1); // the resolving frame itself: the linger starts here
    expect(vis.update(0.6, 12.5, 5, true, feed(4, 1.7), bodies).knock!.alpha).toBeLessThan(1);
    // …then lingers exactly the declared linger and disappears
    expect(vis.update(0.4 + CB_KNOCK_LINGER_S - 0.01, 12.5, 5, true, feed(4, 1.7), bodies).knock)
      .not.toBeNull();
    expect(vis.update(0.4 + CB_KNOCK_LINGER_S + 0.01, 12.5, 5, true, feed(4, 1.7), bodies).knock)
      .toBeNull();
  });

  it('⭐ the ring\'s fraction is read off the RISING EDGE — the price the engine wrote', () => {
    const vis = new CbVisibility();
    const feed = { knocks: 0, touch: null };
    const at = (recover: number, carry: number): CbBodyFrame[] =>
      [{ gid: 3, x: 1, z: 2, cbRecover: recover, cbCarryThrough: carry }];
    // the miss writes 1.4 s: full ring, and his brake leg is running
    let out = vis.update(0, 0, 0, true, feed, at(1.4, 0.5));
    expect(out.beatenCount).toBe(1);
    expect(out.beaten[0].frac).toBe(1);
    expect(out.beaten[0].carryThrough).toBe(true);
    // half way through HIS interval — not half of any constant
    out = vis.update(0.7, 0, 0, true, feed, at(0.7, 0));
    expect(out.beaten[0].frac).toBeCloseTo(0.5, 12);
    expect(out.beaten[0].carryThrough).toBe(false);
    // back in the duel ⇒ no mark, and the memory of the price goes with him
    expect(vis.update(1.4, 0, 0, true, feed, at(0, 0)).beatenCount).toBe(0);
    expect(vis.update(1.5, 0, 0, true, feed, at(0.5, 0)).beaten[0].frac).toBe(1); // a NEW miss
  });

  it('replay interpolation carries the CB fields without inventing a clock', () => {
    const mk = (t: number, recover?: number): ReturnType<typeof buildRenderState> => {
      const m = cbMatch();
      const s = buildRenderState(m, false);
      s.t = t;
      s.players[0].cbRecover = recover;
      return s;
    };
    const a = mk(0, 1.2);
    const b = mk(1, 0.2);
    // discrete SNAP, never a blended countdown no tick ever held
    expect(interpolateStates(a, b, 0.4).players[0].cbRecover).toBe(1.2);
    expect(interpolateStates(a, b, 0.6).players[0].cbRecover).toBe(0.2);
    expect(interpolateStates(a, b, 0.6).cb).toBe(b.cb);
  });
});

// ===========================================================================
describe('CB entry — the entry: one value, six worlds, desktop AND phone', () => {
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

  it('the phone link is ?a4world=6 and stays exclusive', () => {
    expect(a4UrlOverride('?a4world=6')).toBe(6);
    expect(a4UrlOverride('?a4world=5')).toBe(5);
    expect(a4UrlOverride('?a4world=0')).toBe(0);
    expect(a4UrlOverride('?a4world=7')).toBe(7); // ⭐ #282.4: a seventh world now exists
    expect(a4UrlOverride('?a4world=8')).toBe(8); // ⭐ #300.6: an eighth world now exists
    expect(a4UrlOverride('?a4world=9')).toBe(9); // ⭐ #309.5: a ninth world now exists
    expect(a4UrlOverride('?a4world=10')).toBe(10); // ⭐ #337.5: a tenth world now exists
    expect(a4UrlOverride('?a4world=11')).toBe(11); // ⭐ #337.5: an eleventh world now exists
    expect(a4UrlOverride('?a4world=14')).toBe(14); // the LN entry (#396 item 4)
    // ⚠ NARROWED BY GK-ENTRY (ruling #402 item 5), the DF-T0 §P7 form — stated POSITIVELY:
    // `?a4world=15` now parses as the GK dive entry and the bound moves up by one.
    expect(a4UrlOverride('?a4world=15')).toBe(15); // the GK entry (#402 item 5)
    expect(a4UrlOverride('?a4world=16')).toBeNull(); // …and a sixteenth does not
    expect(DOC).toContain('?a4world=6');
  });

  it('the sticky key stores 6 and reads it back', () => {
    storage();
    writeA4World(CB_WORLD_VERSION);
    expect(localStorage.getItem(A4_WORLD_KEY)).toBe('6');
    expect(readA4World()).toBe(CB_WORLD_VERSION);
    writeA4World(0);
    expect(readA4World()).toBe(0);
  });

  it('⭐ arming the CB world DISARMS every other — one value, no blend', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('setA4World(v ? 6 : 0)');
    expect(settings).toContain('input(cbBox).checked = version === 6;');
    expect(settings).toContain('input(a4V1Box).checked = version === 1;');
    expect(settings).toContain('input(mt02Box).checked = version === 4;');
    expect(settings).toContain('CB · 过人世界 (play-test)');
    const app = repoText('src/game/GameApp.ts');
    expect(app.match(/armA4World\(/g)).toHaveLength(1);
    expect(app.match(/a4MatchFlags\(this\./g)).toHaveLength(1);
  });

  it('⭐ the badge names the world AND its declared dose', () => {
    expect(A4_BADGE_TEXT_CB).toBe('🧪 CB 过人世界 · 剂量 1.0');
    expect(A4_BADGE_TEXTS[6]).toBe(A4_BADGE_TEXT_CB);
    expect(new Set(Object.values(A4_BADGE_TEXTS)).size).toBe(15); // #402 item 5: a fifteenth name
    // the dose in the chip is the dose in the code
    expect(A4_BADGE_TEXT_CB).toContain(CB_WORLD_DOSE.toFixed(1));
  });

  it('the ⚙ room says, in plain football Chinese, what to look at', () => {
    const settings = repoText('src/ui/SettingsScreen.ts');
    expect(settings).toContain('过人时刻看得见吗');
    expect(settings).toContain('球自己走过的路'); // the honesty line about the trail
    expect(settings).toContain('这个剂量是给眼睛看的选择,不是结论');
    const app = repoText('src/game/GameApp.ts');
    expect(app).toContain('🧪 CB 过人世界 ON');
  });
});

/** A minimal two-team fixture for the identity walk — the engine's own defaults. */
function teamOf(name: string, seed: number): ConstructorParameters<typeof Match>[0]['teamA'] {
  const league = new League({ seed, matchDuration: 240 });
  const info = league.teamInfo(name === 'A' ? 0 : 1);
  return info;
}
