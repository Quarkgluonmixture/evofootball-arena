// STAGE III V2-P2R — PRE-FREEZE SIZING SMOKE (read-only, zero src/**)
//
// Authority: docs/world-model/STAGE3-V2-P2R-ABORTABLE.md (the freeze this smoke
// sizes) · commander ruling #73.2 (the abortable approach — D3-DUPLICATE) /
// #73.4 (this pre-registration) · #44.5/#65 (sizing before floors) · #46.2
// (smoke seeds DISJOINT, above 9.0M) · STAGE3-V2-P2-CONSUMER §3.4 (the
// perceived-attainable denominator this smoke re-confirms on a fresh block) ·
// the committed V2-P1 table (tableSha a33e9a73…) + the V2-P2 control-recovery
// (sha256 8bac58da…), BOTH byte-identical inputs, reused not re-cut.
//
// WHY THIS SMOKE: V2-P2R adds ONE break rule to the committed window
// (D3-DUPLICATE, §THE ONE CHANGE): at the body's own decision cadence during a
// committed deviation window, re-read the OWN percept; if a NEW teammate — one
// OTHER than the commit-time going-contributor set — is now going into the
// committed region, the override lapses and the incumbent resumes. The NO-CHANGE
// reading (§sign space) needs, EX ANTE, the ABORT-OPPORTUNITY rate: how often a
// duplicate forms mid-window AT NATURAL RATES (the eye's choice is computed but
// NEVER applied — the world evolves on its own null-eye trajectory, so this is
// the natural-rate opportunity, an over-count-free lower proxy for the treated
// rate). It also re-confirms the DEV denominator (perceived-attainable share) on
// the fresh 9.0M block. It FORKS NO COUNTERFACTUAL and prices no payoff (Road B):
// the only clones are (a) the pristine read clone and (b) the null-eye natural
// continuation used to observe whether a new contributor appears. Touches zero src.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { AI_INTERVAL, DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  EYE_LATTICE, EYE_R_M, EYE_W_S, STATION_FAMILY,
  goingBits, perceivedContextV2, priceApproachesV2,
  type ControlLevels, type GoingConditionedTable, type TeammateMotion,
} from '../../src/ai/stationEye';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen smoke parameters (disjoint above V2-P2's 8.90/8.91M) -------------
const MATCH_DURATION = 240;
const SMOKE_SEED_START = 9_000_000;                       // #46.2 disjoint block, above 9.0M
const SMOKE_MATCHES = envInt('V2P2R_SMOKE_MATCHES', 150); // read-only
const MOMENT_SPACING_S = 2.0;                             // P1R §3.4 verbatim
const R_M = EYE_R_M;                                      // 4.0, FROZEN
const W_S = EYE_W_S;                                      // 3.0
const W_TICKS = Math.round(W_S / DT);                     // 180
const CADENCE_TICKS = Math.round(AI_INTERVAL / DT);       // 9 — the body's decision cadence
const TABLE_PATH = 'docs/world-model/data/stage3-v2-p1-anticipatory-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v2-p2-control-recovery.json';
const OUT_PATH = process.env.V2P2R_SMOKE_OUT
  ?? 'docs/world-model/data/stage3-v2-p2r-sizing.json';

/** The enriched consumer world (#67.3: the full certified bundle; V2-P2 verbatim). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- the injected table + control (never bundled in src/**) ------------------
const rawTable = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string; table: GoingConditionedTable;
};
const goingTable: GoingConditionedTable = rawTable.table;
const TABLE_SHA = rawTable.tableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: ControlLevels; sha256: string;
};
const control: ControlLevels = rawControl.control;
const CONTROL_SHA = rawControl.sha256;

// NEUTRAL arm weights are (0.5, 0.5) regardless of genome; a fixed genome fixes it.
const NEUTRAL_GENOME = randomGenome(new Rng(1));

const localXBand = (localX: number): 'ownThird' | 'middle' | 'theirThird' => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});

const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);

/** The set of PERCEIVED teammate gids whose W-advanced perceived position lands
 *  within R of a fixed ball-local region point (the going-contributor identities). */
function contributorSet(
  ballX: number, ballY: number, attackDir: number,
  offset: { dx: number; dy: number }, teammates: readonly (TeammateMotion & { gid: number })[],
): Set<number> {
  const px = ballX + attackDir * offset.dx;
  const py = ballY + offset.dy;
  const out = new Set<number>();
  for (const t of teammates) {
    if (dist(t.px + t.vx * W_S, t.py + t.vy * W_S, px, py) <= R_M) out.add(t.gid);
  }
  return out;
}

/** Perceived teammate motion fixes off a body's OWN snapshot (NEUTRAL path). */
function perceivedTeammates(m: Match, body: Player, side: number): (TeammateMotion & { gid: number })[] {
  const snap = m.perceivedSnapshot(body);
  if (snap === null) return [];
  const gk = m.teams[side].goalkeeper.gid;
  const out: (TeammateMotion & { gid: number })[] = [];
  for (const o of snap.players) {
    if (o.side !== side || o.gid === body.gid || o.gid === gk) continue;
    out.push({ gid: o.gid, px: o.pos.x, py: o.pos.y, vx: o.vel.x, vy: o.vel.y });
  }
  return out;
}

interface SmokeOut {
  rows: number;                    // station-family qualifying moments
  ballDirectedSkipped: number;
  qualifying: number;
  noPool: number;
  // DEV denominator re-confirm (§3.4)
  hasPercept: number;
  perceivedAttainable: number;
  noCell: number;
  // the abort-opportunity measure (the NO-CHANGE reading's ex-ante quantity)
  deviatingWindows: number;        // dry-run NEUTRAL deviations (a committed window would exist)
  windowsAlive: number;            // deviating windows with >=1 in-window cadence re-read reached
  abortOpportunityWindows: number; // windows where a NEW contributor appeared mid-window (>= 1 re-read)
  timeToAbortTicks: number[];      // ticks from commit to the FIRST new contributor (per opp. window)
  newContributorCount: number;     // total distinct new-contributor identities seen (churn)
  commitBitOne: number;            // deviations whose chosen candidate was ALREADY going=1 at commit
}
const newOut = (): SmokeOut => ({
  rows: 0, ballDirectedSkipped: 0, qualifying: 0, noPool: 0,
  hasPercept: 0, perceivedAttainable: 0, noCell: 0,
  deviatingWindows: 0, windowsAlive: 0, abortOpportunityWindows: 0,
  timeToAbortTicks: [], newContributorCount: 0, commitBitOne: 0,
});

const inPowerContexts = (() => {
  const perContext = new Map<string, number>();
  const raw = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
    primaryContrast: { perCell: { context: string; inPower: boolean }[] };
  };
  for (const c of raw.primaryContrast.perCell) {
    if (c.inPower) perContext.set(c.context, (perContext.get(c.context) ?? 0) + 1);
  }
  return perContext;
})();

/** One qualifying station-family moment: dry-run the NEUTRAL eye choice (never
 *  applied), and if it deviates, observe the null-eye natural continuation for the
 *  window, testing at each decision-cadence re-read for a NEW going-contributor. */
function processMoment(m: Match, side: number, liveBody: Player, owner: Player, out: SmokeOut): void {
  const read = cloneSimulationState(m);
  const mine = read.teams[side];
  const body = read.allPlayers.find((p) => p.gid === liveBody.gid)!;
  const gkGid = mine.goalkeeper.gid;

  out.rows += 1;

  // DEV denominator (§3.4): a percept exists AND the context carries an in-power cell.
  // Percept-honest: NO retained-owner fallback (a one-shot smoke has no in-flight
  // ledger; passing the true owner would smuggle truth). The perceived-attainable
  // share here is therefore a LOWER bound — the in-flight FACE repair (repair 1),
  // which lifts it in the real consumer, is re-measured with its ledger in the run.
  const context = perceivedContextV2(
    read.perceivedSnapshot(body), body.gid, side as 0 | 1, body.pos,
    (x) => mine.localX(x), null,
  );
  const snap = read.perceivedSnapshot(body);
  const hasPercept = snap !== null
    && snap.players.some((o) => o.side === side && o.gid !== body.gid && o.gid !== gkGid);
  if (hasPercept) out.hasPercept += 1;
  const contextHasCell = context !== null && (inPowerContexts.get(context.key) ?? 0) > 0;
  if (context !== null && !contextHasCell) out.noCell += 1;
  if (hasPercept && contextHasCell) out.perceivedAttainable += 1;

  if (context === null || !contextHasCell) return;

  // dry-run the NEUTRAL going-conditioned choice (computed, NEVER applied).
  const teammates = perceivedTeammates(read, body, side);
  const bits = goingBits(read.ball.pos.x, read.ball.pos.y, mine.attackDir, teammates);
  const outcome = priceApproachesV2(goingTable, control, context.key, 'neutral', NEUTRAL_GENOME, bits);
  if (outcome.kind !== 'deviate') return;

  out.deviatingWindows += 1;
  const offset = { dx: outcome.candidate.dx, dy: outcome.candidate.dy };
  const commitBallX = read.ball.pos.x;
  const commitBallY = read.ball.pos.y;
  const gCommit = contributorSet(commitBallX, commitBallY, mine.attackDir, offset, teammates);
  if (gCommit.size > 0) out.commitBitOne += 1; // chosen candidate ALREADY going=1 at commit

  // observe the NATURAL (null-eye) continuation for the window; re-read at the
  // body's decision cadence; ABORT-OPPORTUNITY iff a NEW contributor (gid NOT in
  // gCommit) is going into the committed region at any alive-window re-read.
  const sim = cloneSimulationState(m);
  const simMine = sim.teams[side];
  const simBody = sim.allPlayers.find((p) => p.gid === liveBody.gid)!;
  const faceAtCommit = context.face;
  let alive = false;
  let opportunity = false;
  const newSeen = new Set<number>();
  for (let t = 1; t <= W_TICKS; t++) {
    sim.step(DT);
    if (t % CADENCE_TICKS !== 0) continue;
    // window break rules mirrored: phase / station-family / carrier / D2 face-flip.
    if (sim.phase !== 'playing') break;
    if (simBody.sentOff || sim.ball.owner === simBody) break;
    if (!STATION_FAMILY.has(simBody.action.type)) break;
    const seen = sim.perceivedBalls.get(simBody.gid);
    const ownerGid = seen ? seen.ownerGid : null;
    if (ownerGid !== null) {
      const face = Math.floor(ownerGid / TEAM_SIZE) === side ? 'ours' : 'theirs';
      if (face !== faceAtCommit) break;
    }
    alive = true;
    const tmNow = perceivedTeammates(sim, simBody, side);
    const gNow = contributorSet(sim.ball.pos.x, sim.ball.pos.y, simMine.attackDir, offset, tmNow);
    let firstNew = false;
    for (const gid of gNow) {
      if (!gCommit.has(gid)) { newSeen.add(gid); if (!opportunity) firstNew = true; }
    }
    if (firstNew) { opportunity = true; out.timeToAbortTicks.push(t); }
  }
  if (alive) out.windowsAlive += 1;
  if (opportunity) out.abortOpportunityWindows += 1;
  out.newContributorCount += newSeen.size;
}

const runSmoke = (): SmokeOut => {
  const out = newOut();
  let rotation = 0;
  for (let k = 0; k < SMOKE_MATCHES; k++) {
    const m = matchOf(SMOKE_SEED_START + k);
    let lastMomentTime = -Infinity;
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (qualifies) {
        out.qualifying += 1;
        lastMomentTime = m.simTime;
        const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
        const mine = m.teams[side];
        const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
        if (pool.length === 0) out.noPool += 1;
        else {
          const body = pool[Math.floor(rotation / 2) % pool.length];
          rotation += 1;
          if (!body.sentOff && STATION_FAMILY.has(body.action.type)) processMoment(m, side, body, owner!, out);
          else if (!body.sentOff) out.ballDirectedSkipped += 1;
        }
      }
      m.step(DT);
    }
  }
  return out;
};

const percentiles = (xs: readonly number[]): Record<string, number> => {
  if (xs.length === 0) return { p50: Number.NaN, p90: Number.NaN, min: Number.NaN, max: Number.NaN };
  const s = [...xs].sort((a, b) => a - b);
  const at = (q: number): number => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return { p50: at(0.5), p90: at(0.9), min: s[0], max: s[s.length - 1] };
};

const summarise = (c: SmokeOut) => {
  const totalMoments = c.rows;
  const ttaTicks = c.timeToAbortTicks;
  return {
    smokeMatches: SMOKE_MATCHES,
    seedBlock: `${SMOKE_SEED_START}..${SMOKE_SEED_START + SMOKE_MATCHES - 1}`,
    totalMoments,
    momentsPerMatch: round(totalMoments / SMOKE_MATCHES, 3),
    qualifying: c.qualifying,
    ballDirectedSkipped: c.ballDirectedSkipped,
    noPool: c.noPool,
    devDenominator: {
      note: 'DEV denominator re-confirm (§3.4): percept exists AND context carries an in-power cell',
      perceivedAttainableShare: round(totalMoments === 0 ? 0 : c.perceivedAttainable / totalMoments, 4),
      hasPerceptShare: round(totalMoments === 0 ? 0 : c.hasPercept / totalMoments, 4),
      noCellShare: round(totalMoments === 0 ? 0 : c.noCell / totalMoments, 4),
    },
    abortOpportunity: {
      note: 'NATURAL-RATE abort opportunity: dry-run NEUTRAL deviations, null-eye continuation, '
        + 'a NEW going-contributor (gid NOT in the commit-time set) at any decision-cadence re-read',
      deviatingWindows: c.deviatingWindows,
      windowsAlive: c.windowsAlive,
      abortOpportunityWindows: c.abortOpportunityWindows,
      // the headline: opportunities per deviating window, and per alive window
      abortOpportunityRatePerDeviation: round(c.deviatingWindows === 0 ? 0 : c.abortOpportunityWindows / c.deviatingWindows, 4),
      abortOpportunityRatePerAliveWindow: round(c.windowsAlive === 0 ? 0 : c.abortOpportunityWindows / c.windowsAlive, 4),
      commitBitOneShare: round(c.deviatingWindows === 0 ? 0 : c.commitBitOne / c.deviatingWindows, 4),
      newContributorsPerOpportunity: round(c.abortOpportunityWindows === 0 ? 0 : c.newContributorCount / c.abortOpportunityWindows, 3),
      timeToAbortTicks: percentiles(ttaTicks),
      timeToAbortSecondsP50: round(percentiles(ttaTicks).p50 * DT, 3),
      cadenceTicks: CADENCE_TICKS,
      windowTicks: W_TICKS,
    },
  };
};

const first = runSmoke();
const second = runSmoke();
const s1 = summarise(first);
const s2 = summarise(second);
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(s1) === canonical(s2);
const sha256 = createHash('sha256').update(canonical(s1)).digest('hex');

const output = {
  experiment: 'STAGE3-V2-P2R (pre-freeze sizing smoke — abort-opportunity rate)',
  authority: 'STAGE3-V2-P2R-ABORTABLE · #73.2/#73.4 · #44.5/#65 · #46.2 · #24',
  head: 'c5f2913 (ruling #68; src identical to V2-P0 HEAD 92876e5 / V2-P1 / V2-P2)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  consumedTableSha: TABLE_SHA,
  controlRecoverySha: CONTROL_SHA,
  parameters: {
    seedStart: SMOKE_SEED_START, matches: SMOKE_MATCHES,
    regionRadiusM: R_M, advanceHorizonS: W_S, windowTicks: W_TICKS,
    decisionCadenceTicks: CADENCE_TICKS, momentSpacingS: MOMENT_SPACING_S,
    note: 'read-only, forks NO counterfactual and prices NO payoff; the abort-opportunity '
      + 'rate is measured at NATURAL rates (the eye choice is computed but never applied)',
  },
  ...s1,
  deterministic,
  sha256,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

console.error(
  `V2-P2R SIZING SMOKE · ${SMOKE_MATCHES} matches · moments ${s1.totalMoments} (${s1.momentsPerMatch}/match)`
  + ` · perceived-attainable ${(s1.devDenominator.perceivedAttainableShare * 100).toFixed(2)}%`
  + ` · deviating windows ${s1.abortOpportunity.deviatingWindows}`
  + ` · abort-opportunity/dev ${(s1.abortOpportunity.abortOpportunityRatePerDeviation * 100).toFixed(2)}%`
  + ` · /alive ${(s1.abortOpportunity.abortOpportunityRatePerAliveWindow * 100).toFixed(2)}%`
  + ` · tta p50 ${s1.abortOpportunity.timeToAbortSecondsP50}s`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
