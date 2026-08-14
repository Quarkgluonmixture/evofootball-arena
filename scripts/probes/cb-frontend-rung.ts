/**
 * ⭐ CB FRONTEND VISIBILITY RUNG — THE RECEIPTS RUN (#269.4;
 * docs/world-model/CB-FRONTEND-VISIBILITY-RUNG.md).
 *
 * This rung adds no mechanism and computes no statistic, so it deliberately does NOT pretend to
 * be a gate battery (#268.3(a)'s machine-liveness canon governs gate batteries; inflating three
 * assertions into a fake one would be the dishonesty that canon exists to catch). It runs two
 * things and prints them:
 *
 *   A. THE IDENTITY WALK — the shipped world, on this rung's own seeds, to the last tick. The
 *      structural argument is that the rung touches NO file under `src/sim`, `src/ai` or
 *      `src/evolution` (asserted here from `git diff --name-only` against the arc's base), so
 *      the OFF world cannot have moved; the walk is the measurement that backs it. Every CB
 *      ledger counter must be 0, and each seed's signature must reproduce on a re-run.
 *
 *   B. THE ARMED SMOKE — the ENTRY's exact arming (`a4MatchFlags(6)` at construction and
 *      `armA4World(match, null, 6)` after it: the app's own two calls, so no dose or flag is
 *      typed here), walked with the render bridge attached at the app's frame cadence. It
 *      reports how many 过人时刻 a match actually contains — the rate the play-test should
 *      expect — and how many of them the two affordances actually MARKED, which is the only
 *      way to know the eye will be shown them.
 *
 * NO PIXEL CLAIM IS MADE. Rendering correctness is argued at code level (the stage doc's
 * §TRACE table + the test file's source pins) and at the user's eyes at the gate.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { League } from '../../src/sim/League';
import type { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { a4MatchFlags, armA4World, cbArmedVersion } from '../../src/game/a4World';
import { buildRenderState } from '../../src/render3d/RenderStateAdapter';
import { CbVisibility } from '../../src/render/cbVisibility';

/** ⭐ SEED SUB-BANDS, booked = walked (band 12,475,000–999 per #269.4). */
const IDENT_SEEDS = [12475000, 12475001, 12475002, 12475003, 12475004, 12475005];
const SMOKE_SEEDS = [12475100, 12475101, 12475102, 12475103, 12475104, 12475105, 12475106, 12475107];
/** Full-length matches, so the rates below are per REAL match. */
const DURATION = 600;
/** The app steps the sim several times per rendered frame; 4 is its own typical cadence. */
const STEPS_PER_FRAME = 4;

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

const matchOf = (seed: number, armed: boolean): Match => {
  const league = new League({ seed, matchDuration: DURATION });
  if (armed) league.matchFlags = a4MatchFlags(6); // ⭐ the app's own construction call
  const match = league.createMatch(league.nextFixture()!);
  if (armed) armA4World(match, null, 6); // ⭐ …and the app's own arming call
  return match;
};

/* ============================== A. IDENTITY ============================== */

function identity(): void {
  console.log('\n=== A. IDENTITY — the shipped world, untouched ===');
  const files = execSync('git diff --name-only 4e2c394~1 -- src | cat', { encoding: 'utf8' })
    .split('\n').filter((f) => f.length > 0);
  const engine = files.filter((f) => /^src\/(sim|ai|evolution)\//.test(f));
  console.log(`  src files touched by this rung: ${files.length}`);
  for (const f of files) console.log(`    · ${f}`);
  console.log(`  ⭐ engine files (src/sim, src/ai, src/evolution) touched: ${engine.length}`
    + `${engine.length === 0 ? '  ⇒ the OFF world CANNOT have moved' : '  ⚠ ' + engine.join(', ')}`);

  let allZero = true;
  let allSame = true;
  for (const seed of IDENT_SEEDS) {
    const a = matchOf(seed, false);
    const b = matchOf(seed, false);
    while (!a.finished) a.step(DT);
    while (!b.finished) b.step(DT);
    const sa = signature(a);
    const same = sa === signature(b);
    const zero = Object.values(a.cbLedger).every((v) => v === 0)
      && Object.values(a.cbChoiceLedger).every((v) => v === 0);
    allSame &&= same;
    allZero &&= zero;
    // the render bridge publishes NOTHING in the shipped world
    const st = buildRenderState(a, false);
    const clean = st.cb === undefined && st.players.every((p) => p.cbRecover === undefined);
    allZero &&= clean;
    console.log(`  seed ${seed}  sig ${sa.slice(0, 12)}…  reproduces ${same}`
      + `  cbLedger all-zero ${zero}  render-state CB-free ${clean}`);
  }
  console.log(`  ⇒ identity: reproduces ${allSame}, dormant ${allZero}`);
}

/* ============================ B. THE ARMED SMOKE ========================= */

interface SmokeRow {
  seed: number;
  /** `cbLedger.touchPasts` — aimed knocks that fired. */
  knocks: number;
  /** `cbChoiceLedger.chosen` — knocks the one table picked. */
  chosen: number;
  /** `cbLedger.touchPastBeaten` — challengers the geometry beat at those knocks. */
  beatenAtKnock: number;
  /** `cbLedger.recoveries` — beaten lunges that paid a physics-derived recovery. */
  recoveries: number;
  /** Mean of `cbLedger.recoverySeconds ÷ recoveries` — how long a ring lives, on average. */
  meanRecoveryS: number;
  /** ⭐ knock episodes the VIEWER actually opened and drew a trail for. */
  drawnKnocks: number;
  /** Knocks that fell inside a frame in which another knock also fired (episode overwritten). */
  coalesced: number;
  /** ⭐ distinct bodies the VIEWER actually ringed. */
  drawnRings: number;
  /** Longest trail the viewer held for one knock, in real sampled points. */
  maxTrailPoints: number;
  goals: number;
}

function smoke(): SmokeRow[] {
  console.log('\n=== B. THE ARMED SMOKE — the ENTRY\'s exact arming, at the app\'s cadence ===');
  const rows: SmokeRow[] = [];
  for (const seed of SMOKE_SEEDS) {
    const match = matchOf(seed, true);
    if (cbArmedVersion(match) !== 6) throw new Error(`seed ${seed}: the entry did not arm`);
    const vis = new CbVisibility();
    let drawnKnocks = 0;
    let coalesced = 0;
    let maxTrailPoints = 0;
    let prevKnocks = -1;
    const ringed = new Set<number>();
    let step = 0;
    while (!match.finished) {
      match.step(DT);
      if (++step % STEPS_PER_FRAME !== 0) continue;
      const state = buildRenderState(match, false);
      const out = vis.update(
        state.t, state.ball.x, state.ball.z, state.ball.ownerGid !== null,
        state.cb ?? null, state.players,
      );
      // ⭐ DID THE VIEWER OPEN AN EPISODE FOR THIS KNOCK? The counter rose on this frame and
      // the tracker is now showing a live knock ⇒ yes. A rise of MORE than one means two knocks
      // fell inside one rendered frame, and the second overwrites the first's episode — counted
      // separately and disclosed rather than hidden inside the drawn total.
      const now = state.cb?.knocks ?? 0;
      if (prevKnocks >= 0 && now > prevKnocks) {
        if (out.knock !== null && out.knock.live) drawnKnocks++;
        coalesced += now - prevKnocks - 1;
      }
      prevKnocks = now;
      if (out.knock !== null && out.knock.points > maxTrailPoints) maxTrailPoints = out.knock.points;
      for (let i = 0; i < out.beatenCount; i++) ringed.add(out.beaten[i].gid);
    }
    const L = match.cbLedger;
    rows.push({
      seed,
      knocks: L.touchPasts,
      chosen: match.cbChoiceLedger.chosen,
      beatenAtKnock: L.touchPastBeaten,
      recoveries: L.recoveries,
      meanRecoveryS: L.recoveries > 0 ? L.recoverySeconds / L.recoveries : 0,
      drawnKnocks,
      coalesced,
      drawnRings: ringed.size,
      maxTrailPoints,
      goals: match.score[0] + match.score[1],
    });
    const r = rows[rows.length - 1];
    console.log(`  seed ${seed}  knocks ${r.knocks} (drawn ${r.drawnKnocks}, coalesced ${r.coalesced},`
      + ` trail≤${r.maxTrailPoints} pts)`
      + `  beaten-at-knock ${r.beatenAtKnock}  recoveries ${r.recoveries}`
      + ` (mean ${r.meanRecoveryS.toFixed(3)} s)  bodies ringed ${r.drawnRings}  goals ${r.goals}`);
  }
  return rows;
}

const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;

identity();
const rows = smoke();
console.log('\n=== THE RATE THE PLAY-TEST SHOULD EXPECT (per match, dose 1.0) ===');
console.log(`  matches: ${rows.length} × ${DURATION} sim-seconds`);
console.log(`  过人时刻 — knocks fired      : ${mean(rows.map((r) => r.knocks)).toFixed(2)}`
  + `  (viewer drew ${mean(rows.map((r) => r.drawnKnocks)).toFixed(2)},`
  + ` coalesced into a neighbour ${mean(rows.map((r) => r.coalesced)).toFixed(2)})`);
console.log(`  …of which beat a challenger : ${mean(rows.map((r) => r.beatenAtKnock)).toFixed(2)}`);
console.log(`  beaten lunges (rings)       : ${mean(rows.map((r) => r.recoveries)).toFixed(2)}`
  + `  (distinct bodies ringed ${mean(rows.map((r) => r.drawnRings)).toFixed(2)})`);
console.log(`  mean ring lifetime          : ${mean(rows.map((r) => r.meanRecoveryS)).toFixed(3)} s`);
console.log(`  goals                       : ${mean(rows.map((r) => r.goals)).toFixed(2)}`);
console.log('\n  STATS DRAWN: none. This run computes counts and means only — no inferential');
console.log('  test, no confidence interval, no gate. Stats budget consumed: 0.');
