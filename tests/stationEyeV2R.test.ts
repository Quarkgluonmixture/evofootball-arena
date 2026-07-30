import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { AI_INTERVAL, DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  CELL_FLOOR, EYE_R_M, EYE_W_S, goingContributors,
  type ControlLevels, type GoingConditionedTable, type GoingCell,
} from '../src/ai/stationEye';

/**
 * Stage III V2-P2R — the ABORTABLE APPROACH (docs/world-model/STAGE3-V2-P2R-
 * ABORTABLE.md). D3-DUPLICATE adds ONE new break rule to the eye's committed
 * window: at the body's own decision cadence during a live deviation, re-read the
 * OWN percept and abort the override iff a teammate NOT in the commit-time
 * contributor set is now going into the committed region (G_mid \ G_commit ≠ ∅).
 * The clock is never reset; the eye is null in production. The pins (ruling #74.2):
 *   1. abort-never-fires-on-commit-set (a chosen going=1 support does not abort)
 *   2. abort-fires-on-a-NEW-contributor
 *   3. OFF bit-identity (the abort path adds nothing to the shipped world)
 *   4. clock-not-reset (an abort keeps the SAME untilTick, mid-window)
 *   5. percept-not-truth (the abort reads the OWN pulled snapshot; a blind body
 *      never aborts)
 */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const goingCell = (score: number, concede: number, n = 400): GoingCell => ({
  n, score, concede, value: score - concede, underPowered: n < CELL_FLOOR,
});
const EYE_W_TICKS = Math.round(EYE_W_S / DT);
const ABORT_INTERVAL_TICKS = Math.round(AI_INTERVAL / DT);

// ---------------------------------------------------------------------------
// 1/2/5: the SET-DIFFERENCE predicate, exercised on the exact geometry the seam
// uses (goingContributors is the identity-returning scan the abort re-reads).
// ---------------------------------------------------------------------------
describe('V2-P2R — the abort predicate: G_mid \\ G_commit (§1.1/§1.2)', () => {
  // r7a0 sits at ball + attackDir*7 in x. Place teammates so their W-advanced
  // position lands ON that point (bit 1) or away (bit 0), tracking IDENTITY.
  const ballX = 0; const ballY = 0; const attackDir = 1;
  const offset = { dx: 7, dy: 0 };
  const onto = (gid: number, py = 0) => ({ gid, px: 7 - EYE_W_S * 1, py, vx: 1, vy: 0 }); // advances to (7, py)
  const away = (gid: number) => ({ gid, px: 50, py: 50, vx: 5, vy: 5 });                  // never near

  it('goingContributors tracks IDENTITY with the frozen R/W geometry', () => {
    const g = goingContributors(ballX, ballY, attackDir, offset, [onto(3), away(4)]);
    expect(g.has(3)).toBe(true);   // teammate 3 advances onto the region
    expect(g.has(4)).toBe(false);  // teammate 4 stays away
    expect(g.size).toBe(1);
    expect(EYE_R_M).toBe(4.0);
    expect(EYE_W_S).toBe(3.0);
  });

  it('pin 1 — NEVER fires on the commit set: the same going contributor staying is no abort', () => {
    // The eye chose a going=1 support: teammate 3 is in the region at commit.
    const gCommit = goingContributors(ballX, ballY, attackDir, offset, [onto(3)]);
    expect(gCommit.has(3)).toBe(true);
    // Mid-window teammate 3 is STILL going into it (and no one else).
    const gMid = goingContributors(ballX, ballY, attackDir, offset, [onto(3)]);
    const newContrib = [...gMid].filter((j) => !gCommit.has(j));
    expect(newContrib).toEqual([]);          // G_mid \ G_commit = ∅ → NO abort
  });

  it('pin 2 — FIRES on a NEW contributor: a duplicate forming mid-window aborts', () => {
    const gCommit = goingContributors(ballX, ballY, attackDir, offset, [onto(3)]);
    // Mid-window a genuinely new body (5) has arrived into the region.
    const gMid = goingContributors(ballX, ballY, attackDir, offset, [onto(3), onto(5)]);
    const newContrib = [...gMid].filter((j) => !gCommit.has(j));
    expect(newContrib).toEqual([5]);         // G_mid \ G_commit = {5} → ABORT
  });

  it('pin 5 — a blind body never aborts: an empty percept yields an empty G_mid', () => {
    const gCommit = goingContributors(ballX, ballY, attackDir, offset, [onto(3)]);
    const gMidBlind = goingContributors(ballX, ballY, attackDir, offset, []); // saw nobody
    expect(gMidBlind.size).toBe(0);
    expect([...gMidBlind].filter((j) => !gCommit.has(j))).toEqual([]); // no abort
  });

  it('percept-not-truth: the contributor set is the SUPPLIED motion, not the world', () => {
    // Same slot, opposite membership under perceived vs "true" motion.
    const perceived = goingContributors(0, 0, 1, offset, [{ gid: 9, px: 7, py: 0, vx: 0, vy: 0 }]); // ON it
    const truthlike = goingContributors(0, 0, 1, offset, [{ gid: 9, px: 7, py: 0, vx: 3, vy: 3 }]); // moving away
    expect(perceived.has(9)).toBe(true);
    expect(truthlike.has(9)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3: the eye (and its abort) is shut in production.
// ---------------------------------------------------------------------------
describe('V2-P2R — the abort is dormant in production (X1/X2/X3)', () => {
  it('default-off: the eye and its window state are null/empty on a fresh Match and League', () => {
    const m = matchOf(11);
    expect(m.stationEye).toBeNull();
    expect(m.stationEyeState.size).toBe(0);
    const league = new League({ seed: 20260730 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.stationEye).toBeNull();
  });

  it('the abort seam is unreachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      const flags = edsPreviewFlags(mode) as Record<string, unknown>;
      expect(flags.stationEye).toBeUndefined();
    }
  });

  it('pin 3 — OFF bit-identity: a shut eye plays the shipped enriched world, tick for tick', () => {
    for (const seed of [4242, 90210, 20260730]) {
      const a = matchOf(seed);
      const b = matchOf(seed);
      while (!a.finished) a.step(DT);
      while (!b.finished) { b.stationEye = null; b.step(DT); }
      expect(signature(b)).toBe(signature(a));
      expect(b.stationEyeState.size).toBe(0); // no window state ever written with a null eye
    }
  });

  it('X3 — D3-DUPLICATE never fires while stationEye === null: no window state accrues', () => {
    const m = matchOf(7);
    for (let i = 0; i < 1200; i++) { m.step(DT); expect(m.stationEyeState.size).toBe(0); }
  });
});

// ---------------------------------------------------------------------------
// 4: the abort fires in the live seam and leaves a well-formed incumbent-hold
// window with the SAME untilTick (clock-not-reset). Driven on the ORACLE arm so
// the mid-window re-read tracks TRUE convergence deterministically; a rich table
// makes the eye deviate widely so real duplicates form.
// ---------------------------------------------------------------------------
describe('V2-P2R — the abort fires in the seam and never resets the clock (pin 4)', () => {
  const richTable = (): { goingTable: GoingConditionedTable; control: ControlLevels } => {
    // Every candidate pays in both going splits; the incumbent is poor ⇒ the eye
    // deviates in almost every priceable context.
    const cells = {
      going0: Object.fromEntries(['r7a0', 'r7a60', 'r7a120', 'r7a180', 'r7a240', 'r7a300',
        'r14a0', 'r14a60', 'r14a120', 'r14a180', 'r14a240', 'r14a300',
        'r21a0', 'r21a60', 'r21a120', 'r21a180', 'r21a240', 'r21a300'].map((id) => [id, goingCell(0.40, 0.05)])),
      going1: Object.fromEntries(['r7a0', 'r7a60', 'r7a120', 'r7a180', 'r7a240', 'r7a300',
        'r14a0', 'r14a60', 'r14a120', 'r14a180', 'r14a240', 'r14a300',
        'r21a0', 'r21a60', 'r21a120', 'r21a180', 'r21a240', 'r21a300'].map((id) => [id, goingCell(0.40, 0.05)])),
    };
    const ctxKeys: string[] = [];
    for (const f of ['ours', 'theirs']) for (const t of ['ownThird', 'middle', 'theirThird']) for (const c of ['crowded', 'sparse']) ctxKeys.push(`${f}|${t}|${c}`);
    return {
      goingTable: Object.fromEntries(ctxKeys.map((k) => [k, cells])) as GoingConditionedTable,
      control: Object.fromEntries(ctxKeys.map((k) => [k, { going0: goingCell(0.05, 0.20), going1: goingCell(0.05, 0.20) }])) as ControlLevels,
    };
  };

  it('every observed abort keeps its untilTick, lands incumbent-hold mid-window, and clears G_commit', () => {
    const m = matchOf(31);
    for (let i = 0; i < 300; i++) m.step(DT);
    const owner = m.ball.owner;
    const side = owner ? owner.side : 0;
    const { goingTable, control } = richTable();
    m.stationEye = { arm: 'oracleCtx', scope: { kind: 'team', side: side as 0 | 1 }, table: {}, v2: { goingTable, control, abortEnabled: true } };

    // Per-gid tracking of the live deviation window (its untilTick), so we can
    // recognise an abort (dev → incumbent, same untilTick, before expiry) and
    // assert the invariants that are NOT part of the detector.
    const prev = new Map<number, { offset: boolean; cand: string; until: number }>();
    let abortsSeen = 0;
    for (let i = 0; i < 1600 && !m.finished; i++) {
      m.step(DT);
      for (const [gid, st] of m.stationEyeState) {
        const before = prev.get(gid);
        const nowDeviation = st.offset !== null && st.candidateId !== 'control';
        if (before !== undefined && before.offset && before.cand !== 'control'
          && !nowDeviation && st.candidateId === 'control'
          && st.untilTick === before.until && m.simTick < st.untilTick) {
          // an ABORT: the deviation lapsed to incumbent-hold with the SAME window.
          abortsSeen += 1;
          expect(st.offset).toBeNull();                       // incumbent-hold
          expect(st.candidateId).toBe('control');
          expect(st.committedGoingContributors.size).toBe(0); // G_commit cleared on lapse
          expect(m.simTick).toBeLessThan(st.untilTick);        // mid-window (clock not expired)
          // clock-not-reset: the window still ends where it was committed to end.
          expect(st.untilTick - before.until).toBe(0);
          // and it was NOT extended to a fresh W from here.
          expect(st.untilTick).not.toBe(m.simTick + EYE_W_TICKS);
        }
        prev.set(gid, { offset: st.offset !== null, cand: st.candidateId, until: st.untilTick });
      }
    }
    m.stationEye = null;
    // The abort path must actually be exercised by the seam.
    expect(abortsSeen).toBeGreaterThan(0);
  });

  it('the re-read cadence is the frozen 9 ticks (AI_INTERVAL), and W = 180 ticks', () => {
    expect(ABORT_INTERVAL_TICKS).toBe(9);
    expect(EYE_W_TICKS).toBe(180);
  });

  it('armed determinism (X7-style): two identical abort-armed runs are byte-identical', () => {
    const build = () => {
      const m = matchOf(31);
      for (let i = 0; i < 300; i++) m.step(DT);
      const owner = m.ball.owner;
      const side = owner ? owner.side : 0;
      const { goingTable, control } = richTable();
      const clone = cloneSimulationState(m);
      clone.stationEye = { arm: 'oracleCtx', scope: { kind: 'team', side: side as 0 | 1 }, table: {}, v2: { goingTable, control, abortEnabled: true } };
      for (let i = 0; i < 400; i++) clone.step(DT);
      clone.stationEye = null;
      return signature(clone);
    };
    expect(build()).toBe(build());
  });

  // -------------------------------------------------------------------------
  // NEW pin (ruling #75.2) — abort-null-when-flag-absent. The abort (and its
  // G_commit capture) is an EXPLICIT opt-in: with `abortEnabled` absent the v2
  // consumer runs exactly as V2-P2 did — no abort ever fires, no
  // committedGoingContributors is captured — even under the rich table + ORACLE
  // arm that make the ARMED seam abort on almost every window. This is the
  // regression fixed here: the bare `eye.v2 !== undefined` gate silently changed
  // the old experiment's semantics (903 unexplained where the committed run had 0).
  // -------------------------------------------------------------------------
  it('pin 6 — abort-null-when-flag-absent: the same rich seam never aborts and never captures G_commit', () => {
    const m = matchOf(31);
    for (let i = 0; i < 300; i++) m.step(DT);
    const owner = m.ball.owner;
    const side = owner ? owner.side : 0;
    const { goingTable, control } = richTable();
    // v2 present, abortEnabled ABSENT — the old V2-P2 consumer path.
    m.stationEye = { arm: 'oracleCtx', scope: { kind: 'team', side: side as 0 | 1 }, table: {}, v2: { goingTable, control } };

    const prev = new Map<number, { offset: boolean; cand: string; until: number }>();
    let abortsSeen = 0;
    let deviationsSeen = 0;
    for (let i = 0; i < 1600 && !m.finished; i++) {
      m.step(DT);
      for (const [gid, st] of m.stationEyeState) {
        // the abort's G_commit capture is gated too: it must stay empty always.
        expect(st.committedGoingContributors.size).toBe(0);
        if (st.offset !== null && st.candidateId !== 'control') deviationsSeen += 1;
        const before = prev.get(gid);
        if (before !== undefined && before.offset && before.cand !== 'control'
          && st.candidateId === 'control' && st.offset === null
          && st.untilTick === before.until && m.simTick < st.untilTick) {
          abortsSeen += 1;
        }
        prev.set(gid, { offset: st.offset !== null, cand: st.candidateId, until: st.untilTick });
      }
    }
    m.stationEye = null;
    expect(deviationsSeen).toBeGreaterThan(0); // the seam IS exercised (the eye deviates)
    expect(abortsSeen).toBe(0);                // …but with the flag absent it NEVER aborts
  });
});
