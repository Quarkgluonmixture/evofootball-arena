// STAGE III V2-P0 — THE WEDGE AND THE BASE-RATE MAP (read-only census, zero src/**)
//
// Authority: docs/world-model/STAGE3-V2-P0-WEDGE-MAP.md (the frozen spec — four
// deliverables (i)-(iv), R = 4.0 m, W = 3.0 s, warm-up 15 ticks, the binary
// primary + reported count, the stop teeth) · STAGE3-V2-ANTICIPATORY-EYE.md §2/§4
// (the OTHERS-GOING feature) · commander ruling #67 (PASS; the differencing
// clause ratified DEAD → motion source = the remembered VELOCITY; the full
// enriched bundle ratified; build + run in-session). Parents reused unamended:
// STAGE3-P1R-APPROACH-CENSUS (moment instrument, 18-candidate ball-local lattice,
// 12 contexts, W = 3.0 s) · STAGE3-P0-CONSUMER-MAP §2 (the four v1 anchors (iv)).
//
// It records OTHERS-GOING at NATURAL rates on the ENRICHED world (I3: never a
// treatment; no fork-and-force — that is V2-P1). Every value is read off a
// PRISTINE clone so the live enriched trajectory is never perturbed. It prices
// nothing and nothing ships (Road B). Deliverables:
//   (i)   TRUE base rates of OTHERS-GOING per candidate per context — the
//         conditioning population V2-P1's #24 floors bind against.
//   (ii)  PERCEIVED-vs-TRUE agreement — the wedge on motion, three-part
//         decomposed (never-saw / too-old / velocity-noise, #67.2) + a
//         retention-recoverability read.
//   (iii) In-flight share + warm-up validation of the §2 repairs.
//   (iv)  Drift of the four v1 P0 anchors (I1/I2/I3/I6) on the enriched world.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { cloneSimulationState } from '../../src/sim/cloneState';
import {
  advancePerceptionMemory, capturePerceptionTruth, createPerceptionMemory,
  materialisePerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { formationSpot, runTarget, supportSpot } from '../../src/ai/formations';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters (the spec, §2/§3/§7) ----------------------------------
const MATCH_DURATION = 240;
const CENSUS_SEED_START = 8_710_000;                       // §7, disjoint above 8.6M
const CENSUS_MATCHES = envInt('V2P0_MATCHES', 500);        // §7 frozen block
const MOMENT_SPACING_S = 2.0;                              // P1R §3.4 verbatim
const R_M = 4.0;                                           // §2.1 region radius, FROZEN
const W_S = 3.0;                                           // P1R §2.3, the advance horizon
const WARMUP_TICKS = 15;                                   // §2.3 repair-2 pre-roll
const CELL_FLOOR = 150;                                    // #24
const BOOTSTRAP_RESAMPLES = 2000;                          // #20
const BOOTSTRAP_SEED = 50066;                              // §7 frozen
const CLONE_CHECK_EVERY = 25;                              // X-CLONE 1-in-25 sample
// (iv) P0 anchors: sample every 10th tick (6 Hz), playing only (P0 §2).
const ANCHOR_SAMPLE_EVERY = 10;
const ANCHOR_SAMPLE_DT = ANCHOR_SAMPLE_EVERY * DT;
const DUP_RUN_M = 4;                                       // P0 I6 bucket
const DRIFT_FAST_MS = 4;                                   // P0 I2 bucket
const CLOSE_PAIR_M = 4;                                    // P0 I3 bucket
const PAIR_SUBSAMPLE = 6;                                  // P0 I3 sub-sample (~1 Hz)
const OUT_PATH = process.env.V2P0_OUT
  ?? 'docs/world-model/data/stage3-v2-p0-wedge-map.json';

// The stop-teeth reference numbers (C5-T2's measured hazard, §6 / #65.2).
const TOOTH_A_WALL = 0.502;   // agreement ≤ 50.2% ⇒ the percept is a coin
const TOOTH_B_WEDGE = 0.24;   // W_r ≤ 0.24 (with rarest perceived split cell < 150)

/** The enriched census world (§0.1 / #67.3: the full certified bundle). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

// --- the ball-local lattice (P1R §2.3): 18 candidates ------------------------
const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
interface Candidate { readonly id: string; readonly dx: number; readonly dy: number }
const LATTICE: Candidate[] = [];
for (const r of RADII) {
  for (const a of ANGLES) {
    const rad = (a * Math.PI) / 180;
    LATTICE.push({
      id: `r${r}a${a}`,
      dx: Number((r * Math.cos(rad)).toFixed(9)),
      dy: Number((r * Math.sin(rad)).toFixed(9)),
    });
  }
}

// --- contexts (P1R §3.2, verbatim) -------------------------------------------
type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const contextKey = (f: Face, t: Threat, d: Density): string => `${f}|${t}|${d}`;
const FACES: readonly Face[] = ['ours', 'theirs'];
const THREATS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const DENSITIES: readonly Density[] = ['sparse', 'crowded'];
const CONTEXTS: string[] = [];
for (const f of FACES) for (const t of THREATS) for (const d of DENSITIES) CONTEXTS.push(contextKey(f, t, d));
const localXBand = (localX: number): Threat => (
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

// --- helpers -----------------------------------------------------------------
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// --- (iv) P0 anchor instruments (STAGE3-P0-CONSUMER-MAP §2.2, verbatim) -------
type Family = 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'ONBALL' | 'OTHER';
const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': return 'FORMATION';
    case 'SupportBallCarrier': return 'SUPPORT';
    case 'MakeRun': return 'RUN';
    case 'MarkOpponent': return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass': return 'BALL';
    default: return 'OTHER';
  }
};
const stationTargetOf = (
  p: Player, t: Team, opp: Team, m: Match, family: Family,
): { x: number; y: number } | null => {
  const hasBall = m.possessionSide === t.side;
  switch (family) {
    case 'FORMATION': return formationSpot(p, t, m.ball, hasBall, opp);
    case 'SUPPORT': return supportSpot(p, t, m.ball);
    case 'RUN': return runTarget(p, t, opp.players);
    default: return null;
  }
};

/** Per-match running state for the four anchors. */
interface AnchorMatchState {
  dwells: number[];
  drifts: number[];
  pairDists: number[];
  familyChanges: number;
  runTicks: number;
  dupRunTicks: number;
  ticks: number;
  lastFamily: Map<number, Family>;
  dwellStart: Map<number, number>;
  lastTarget: Map<number, { x: number; y: number }>;
  anchorSamples: number;
}
const newAnchorState = (): AnchorMatchState => ({
  dwells: [], drifts: [], pairDists: [], familyChanges: 0, runTicks: 0, dupRunTicks: 0,
  ticks: 0, lastFamily: new Map(), dwellStart: new Map(), lastTarget: new Map(), anchorSamples: 0,
});
const sampleAnchors = (m: Match, tick: number, st: AnchorMatchState): void => {
  st.anchorSamples += 1;
  for (const t of m.teams) {
    const opp = m.teams[1 - t.side];
    const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
    // --- I1 / I2, per body ---
    for (const p of outfield) {
      const fam = familyOf(p, m);
      const prev = st.lastFamily.get(p.gid);
      if (prev !== fam) {
        if (prev !== undefined) {
          st.familyChanges += 1;
          const start = st.dwellStart.get(p.gid);
          if (start !== undefined && prev !== 'ONBALL' && prev !== 'OTHER') {
            st.dwells.push((tick - start) * DT);
          }
        }
        st.lastFamily.set(p.gid, fam);
        st.dwellStart.set(p.gid, tick);
        st.lastTarget.delete(p.gid);
      }
      const target = stationTargetOf(p, t, opp, m, fam);
      if (target !== null) {
        const before = st.lastTarget.get(p.gid);
        if (before !== undefined) st.drifts.push(dist(target.x, target.y, before.x, before.y) / ANCHOR_SAMPLE_DT);
        st.lastTarget.set(p.gid, { x: target.x, y: target.y });
      } else st.lastTarget.delete(p.gid);
    }
    // --- I3, own pairs (sub-sampled) ---
    if (st.anchorSamples % PAIR_SUBSAMPLE === 0) {
      for (let i = 0; i < outfield.length; i++) {
        for (let j = i + 1; j < outfield.length; j++) {
          st.pairDists.push(dist(outfield[i].pos.x, outfield[i].pos.y, outfield[j].pos.x, outfield[j].pos.y));
        }
      }
    }
    // --- I6, run targets (license-excluded exactly as P0) ---
    const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
    const liveCorner = m.restart?.kind === 'corner' && m.restart.side === t.side;
    const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
      && t.arriver !== p.index && t.overlapper !== p.index
      && !((crashLive || liveCorner) && t.runners.has(p.index)));
    if (runners.length >= 2) {
      st.runTicks += 1;
      const targets = runners.map((p) => runTarget(p, t, opp.players));
      let dup = false;
      for (let i = 0; i < targets.length && !dup; i++) {
        for (let j = i + 1; j < targets.length && !dup; j++) {
          if (dist(targets[i].x, targets[i].y, targets[j].x, targets[j].y) < DUP_RUN_M) dup = true;
        }
      }
      if (dup) st.dupRunTicks += 1;
    }
  }
};

// --- standing exception classes (§5 / #38.1) ---------------------------------
// V2-P0 FORCES NOTHING (registered non-claim §8), so the force-fidelity classes
// (carrier / ball-won / onside / barred) are vacuous by construction; the census
// ledgers every qualifying moment's disposition and requires unexplained === 0.
interface Ledger {
  qualifying: number;       // playing + owner, spacing met
  rows: number;             // station-family moments that produced a record
  ballDirectedSkipped: number;
  noPool: number;
  eSentOff: number;         // sampled body sent off (E-INJURY family)
  eNoSnapshot: number;      // body carried no percept memory (excluded, ledgered)
  unexplained: number;      // must be 0
}
const newLedger = (): Ledger => ({
  qualifying: 0, rows: 0, ballDirectedSkipped: 0, noPool: 0, eSentOff: 0, eNoSnapshot: 0, unexplained: 0,
});

// --- per-moment aggregate (for the cluster bootstrap) ------------------------
interface MomentAgg {
  cluster: number;
  context: string;
  pairs: number;            // = 18 candidates
  agree: number;            // candidates where perceived bit == true bit
  trueGoing: number;        // candidates with true someone-going
  percGoing: number;        // candidates with perceived someone-going
}

// --- decomposition of the motion wedge (missed true-going teammate-events) ----
interface Decomp {
  trueGoingEvents: number;      // (moment,candidate,teammate) with true advance in R
  seenGoing: number;            // perception also has it going (no wedge)
  neverSaw: number;             // teammate absent from memory (scan coverage)
  tooLongAgo: number;           // stale fix (retention property)
  velocityNoise: number;        // fresh fix, velAmp noise crossed R (irreducible)
  ambiguous: number;            // neither single fix recovers — tie-broken by age
  falseGoing: number;           // perceived going where no true goer (hallucination)
  tooOldAges: number[];         // ageTicks of the too-long-ago misses (retention read)
}
const newDecomp = (): Decomp => ({
  trueGoingEvents: 0, seenGoing: 0, neverSaw: 0, tooLongAgo: 0, velocityNoise: 0,
  ambiguous: 0, falseGoing: 0, tooOldAges: [],
});

// The awareness the enriched world perceives at (Match default; #67.3 bundle).
const FRESH_INTERVAL_TICKS = Math.round(15 - 0.8 * 9); // scan interval at aw 0.8 = 8

interface CensusOut {
  moments: MomentAgg[];
  ledger: Ledger;
  decomp: Decomp;
  // per (context × candidate) accumulators for the tables + rarest cell (i/ii)
  cellTrueGoing: Map<string, number>;   // key `${ctx}||${cand}`
  cellPercGoing: Map<string, number>;
  cellN: Map<string, number>;
  // (iii) in-flight + warm-up
  inflightTotal: number;
  inflightNoOwner: number;
  inflightRecovered: number;
  warmupBodies: number;
  warmupEmpty: number;           // no-snapshot residual WITH natural warm-up
  warmupTeammateCounts: number[];
  coldBodies: number;            // warm-up validation: fresh memory, no pre-roll
  coldEmpty: number;             // no-snapshot share with NO warm-up
  // anchors (iv)
  anchor: AnchorMatchState[];
  // gates
  clonesTaken: number;
  cloneChecked: number;
  cloneMismatched: number;
}

const cellKey = (ctx: string, cand: string): string => `${ctx}||${cand}`;

const runCensus = (): CensusOut => {
  const out: CensusOut = {
    moments: [], ledger: newLedger(), decomp: newDecomp(),
    cellTrueGoing: new Map(), cellPercGoing: new Map(), cellN: new Map(),
    inflightTotal: 0, inflightNoOwner: 0, inflightRecovered: 0,
    warmupBodies: 0, warmupEmpty: 0, warmupTeammateCounts: [],
    coldBodies: 0, coldEmpty: 0,
    anchor: [], clonesTaken: 0, cloneChecked: 0, cloneMismatched: 0,
  };
  let rotation = 0;

  for (let k = 0; k < CENSUS_MATCHES; k++) {
    const seed = CENSUS_SEED_START + k;
    const m = matchOf(seed);
    const anchorSt = newAnchorState();
    let lastMomentTime = -Infinity;
    let lastInflightTime = -Infinity;
    let lastOwnerSide: number | null = null;
    let tick = 0;

    while (!m.finished) {
      // --- (iii) in-flight FACE census: independent 2 s cadence, playing only ---
      if (m.phase === 'playing' && m.simTime - lastInflightTime >= MOMENT_SPACING_S) {
        lastInflightTime = m.simTime;
        out.inflightTotal += 1;
        if (m.ball.owner === null) {
          out.inflightNoOwner += 1;
          if (lastOwnerSide !== null) out.inflightRecovered += 1; // repair 1: last-perceived owner retained
        }
      }
      if (m.ball.owner !== null) lastOwnerSide = m.ball.owner.side;

      // --- (i)/(ii) census moment: frozen sizing-smoke sampler (pre-step) ---
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (qualifies) {
        out.ledger.qualifying += 1;
        lastMomentTime = m.simTime;
        const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
        const mine = m.teams[side];
        const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
        if (pool.length === 0) {
          out.ledger.noPool += 1;
        } else {
          const body = pool[Math.floor(rotation / 2) % pool.length];
          rotation += 1;
          if (body.sentOff) {
            out.ledger.eSentOff += 1;
          } else if (!STATION_FAMILY.has(body.action.type)) {
            out.ledger.ballDirectedSkipped += 1;
          } else {
            processMoment(m, k, side, body, owner!, out);
          }
        }
      }

      // step the LIVE match exactly once per iteration
      m.step(DT);
      tick += 1;
      // --- (iv) anchors: post-step, 6 Hz, playing only ---
      if (tick % ANCHOR_SAMPLE_EVERY === 0 && m.phase === 'playing') {
        sampleAnchors(m, tick, anchorSt);
      }
    }
    anchorSt.ticks = tick;
    out.anchor.push(anchorSt);
  }
  return out;
};

/** Read ONE census moment off a pristine clone (X-CLONE): true + perceived. */
function processMoment(
  m: Match, cluster: number, side: number, liveBody: Player, owner: Player, out: CensusOut,
): void {
  const clone = cloneSimulationState(m);
  out.clonesTaken += 1;
  // X-CLONE 1-in-25: the fresh clone must equal the live match bit-identically
  // at capture (clone fidelity + proof no prior read perturbed the live path).
  if (out.clonesTaken % CLONE_CHECK_EVERY === 0) {
    out.cloneChecked += 1;
    if (signatureOf(clone) !== signatureOf(m)) out.cloneMismatched += 1;
  }

  const mine = clone.teams[side];
  const oppSide = 1 - side;
  const gkGid = mine.goalkeeper.gid;
  const body = clone.allPlayers.find((p) => p.gid === liveBody.gid)!;
  const face: Face = side === owner.side ? 'ours' : 'theirs';
  let near = 0;
  for (const q of mine.players) {
    if (q === body || q.role === 'GK' || q.sentOff) continue;
    if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
  }
  const context = contextKey(face, localXBand(mine.localX(clone.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');

  // Own outfield teammates (not self, not GK): the OTHERS in OTHERS-GOING.
  const teammates = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p.gid !== body.gid);

  // The body's own perceived snapshot — the remembered VELOCITY path (#67.2),
  // reconstructed from the recorded scan frames (perception is PULL). Naturally
  // warmed (the body has played the whole match ≫ 15-tick warm-up, repair 2).
  const snap = clone.perceivedSnapshot(body);
  if (snap === null) { out.ledger.eNoSnapshot += 1; return; }
  // perceived own teammates, keyed by gid
  const perc = new Map<number, { px: number; py: number; vx: number; vy: number; age: number }>();
  for (const o of snap.players) {
    if (o.side !== body.side || o.gid === body.gid || o.gid === gkGid) continue;
    perc.set(o.gid, { px: o.pos.x, py: o.pos.y, vx: o.vel.x, vy: o.vel.y, age: o.ageTicks });
  }

  out.ledger.rows += 1;
  let agree = 0;
  let trueGoingCands = 0;
  let percGoingCands = 0;
  const ball = clone.ball.pos;

  for (const cand of LATTICE) {
    const cx = ball.x + mine.attackDir * cand.dx;
    const cy = ball.y + cand.dy;
    // TRUE goers into this candidate region
    const trueGoers: Player[] = [];
    for (const t of teammates) {
      const ax = t.pos.x + t.vel.x * W_S;
      const ay = t.pos.y + t.vel.y * W_S;
      if (dist(ax, ay, cx, cy) <= R_M) trueGoers.push(t);
    }
    // PERCEIVED goers into this candidate region
    const percGoerGids = new Set<number>();
    for (const [gid, o] of perc) {
      const ax = o.px + o.vx * W_S;
      const ay = o.py + o.vy * W_S;
      if (dist(ax, ay, cx, cy) <= R_M) percGoerGids.add(gid);
    }
    const trueBit = trueGoers.length > 0 ? 1 : 0;
    const percBit = percGoerGids.size > 0 ? 1 : 0;
    if (trueBit === percBit) agree += 1;
    trueGoingCands += trueBit;
    percGoingCands += percBit;

    const key = cellKey(context, cand.id);
    out.cellN.set(key, (out.cellN.get(key) ?? 0) + 1);
    out.cellTrueGoing.set(key, (out.cellTrueGoing.get(key) ?? 0) + trueBit);
    out.cellPercGoing.set(key, (out.cellPercGoing.get(key) ?? 0) + percBit);

    // --- (ii) three-part decomposition of the motion wedge ---
    for (const t of trueGoers) {
      out.decomp.trueGoingEvents += 1;
      const o = perc.get(t.gid);
      if (o === undefined) { out.decomp.neverSaw += 1; continue; }
      if (percGoerGids.has(t.gid)) { out.decomp.seenGoing += 1; continue; }
      // remembered but perception says NOT going → too-old vs velocity-noise
      const velFix = dist(o.px + t.vel.x * W_S, o.py + t.vel.y * W_S, cx, cy) <= R_M; // fix velocity
      const posFix = dist(t.pos.x + o.vx * W_S, t.pos.y + o.vy * W_S, cx, cy) <= R_M; // fix position (staleness)
      if (velFix && !posFix) out.decomp.velocityNoise += 1;
      else if (posFix && !velFix) { out.decomp.tooLongAgo += 1; out.decomp.tooOldAges.push(o.age); }
      else {
        out.decomp.ambiguous += 1;
        if (o.age > FRESH_INTERVAL_TICKS) { out.decomp.tooLongAgo += 1; out.decomp.tooOldAges.push(o.age); }
        else out.decomp.velocityNoise += 1;
      }
    }
    // hallucinations: perceived going where no true goer
    for (const gid of percGoerGids) {
      const isTrue = trueGoers.some((t) => t.gid === gid);
      if (!isTrue) out.decomp.falseGoing += 1;
    }
  }

  out.moments.push({ cluster, context, pairs: LATTICE.length, agree, trueGoing: trueGoingCands, percGoing: percGoingCands });

  // --- (iii) warm-up validation: natural-warm residual + cold (no warm-up) ---
  out.warmupBodies += 1;
  out.warmupTeammateCounts.push(perc.size);
  if (perc.size === 0) out.warmupEmpty += 1;
  // Cold contrast (repair-2 baseline): a fresh percept memory that has just
  // opened its eyes ONCE at the current tick — no accumulated warm-up. This
  // reproduces v1's "no-snapshot share of first windows" (banked 20.5%): even a
  // single eager scan leaves a body blind when its teammates are out of
  // cone+range. Uses the exported honesty path; no extra clone.
  const truth = capturePerceptionTruth(clone);
  const coldMem = createPerceptionMemory();
  advancePerceptionMemory(truth, body.gid, 0.8, CENSUS_SEED_START + cluster, coldMem);
  const coldSnap = materialisePerceptionSnapshot(truth, body.gid, 0.8, coldMem);
  let coldTeammates = 0;
  for (const o of coldSnap.players) {
    if (o.side === body.side && o.gid !== body.gid && o.gid !== gkGid) coldTeammates += 1;
  }
  out.coldBodies += 1;
  if (coldTeammates === 0) out.coldEmpty += 1;
}

// --- cluster bootstrap over match seeds (#20) --------------------------------
const clusterBootstrap = (
  moments: readonly MomentAgg[], stat: (rs: readonly MomentAgg[]) => number, offset: number,
): { point: number; lower: number; upper: number } => {
  const byCluster = new Map<number, MomentAgg[]>();
  for (const r of moments) {
    const b = byCluster.get(r.cluster) ?? [];
    b.push(r);
    byCluster.set(r.cluster, b);
  }
  const clusters = [...byCluster.values()];
  const point = stat(moments);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentAgg[] = [];
    for (let i = 0; i < clusters.length; i++) {
      for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    }
    const v = stat(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};

const agreementStat = (rs: readonly MomentAgg[]): number => {
  let a = 0; let n = 0;
  for (const r of rs) { a += r.agree; n += r.pairs; }
  return n === 0 ? Number.NaN : a / n;
};
const trueRateStat = (rs: readonly MomentAgg[]): number => {
  let g = 0; let n = 0;
  for (const r of rs) { g += r.trueGoing; n += r.pairs; }
  return n === 0 ? Number.NaN : g / n;
};
const percRateStat = (rs: readonly MomentAgg[]): number => {
  let g = 0; let n = 0;
  for (const r of rs) { g += r.percGoing; n += r.pairs; }
  return n === 0 ? Number.NaN : g / n;
};
const wedgeStat = (rs: readonly MomentAgg[]): number => {
  let tp = 0; let pp = 0;
  for (const r of rs) { tp += r.trueGoing; pp += r.percGoing; }
  return tp === 0 ? Number.NaN : pp / tp;
};

// --- reduce a census run to the report object --------------------------------
const summarise = (c: CensusOut) => {
  const M = c.moments;
  // (i) per-candidate marginal true rate; per-context true/perc rate; headline.
  const perContext = Object.fromEntries(CONTEXTS.map((ctx) => {
    const rs = M.filter((r) => r.context === ctx);
    return [ctx, {
      n: rs.length,
      trueRate: clusterBootstrap(rs, trueRateStat, CONTEXTS.indexOf(ctx) + 1),
      percRate: clusterBootstrap(rs, percRateStat, 100 + CONTEXTS.indexOf(ctx)),
      agreement: clusterBootstrap(rs, agreementStat, 200 + CONTEXTS.indexOf(ctx)),
      wedge: clusterBootstrap(rs, wedgeStat, 300 + CONTEXTS.indexOf(ctx)),
    }];
  }));
  // per (context × candidate) table + rarest cells (i true, ii perceived)
  const cellRows: Record<string, Record<string, { n: number; trueGoing: number; percGoing: number; trueRate: number; percRate: number }>> = {};
  let rarestTrueCell = { key: '', count: Number.POSITIVE_INFINITY };
  let rarestPercCell = { key: '', count: Number.POSITIVE_INFINITY };
  let trueCellsClearing = 0; let percCellsClearing = 0; let totalCells = 0;
  for (const ctx of CONTEXTS) {
    cellRows[ctx] = {};
    for (const cand of LATTICE) {
      const key = cellKey(ctx, cand.id);
      const n = c.cellN.get(key) ?? 0;
      const tg = c.cellTrueGoing.get(key) ?? 0;
      const pg = c.cellPercGoing.get(key) ?? 0;
      cellRows[ctx][cand.id] = {
        n, trueGoing: tg, percGoing: pg,
        trueRate: round(n === 0 ? Number.NaN : tg / n, 4),
        percRate: round(n === 0 ? Number.NaN : pg / n, 4),
      };
      totalCells += 1;
      if (tg >= CELL_FLOOR) trueCellsClearing += 1;
      if (pg >= CELL_FLOOR) percCellsClearing += 1;
      if (tg < rarestTrueCell.count) rarestTrueCell = { key, count: tg };
      if (pg < rarestPercCell.count) rarestPercCell = { key, count: pg };
    }
  }

  const headline = {
    moments: M.length,
    trueSomeoneGoingRate: clusterBootstrap(M, trueRateStat, 900),
    perceivedSomeoneGoingRate: clusterBootstrap(M, percRateStat, 901),
    agreement: clusterBootstrap(M, agreementStat, 902),
    wedgeRatio: clusterBootstrap(M, wedgeStat, 903),
  };

  // (ii) decomposition shares (of missed true-going events)
  const d = c.decomp;
  const missed = d.neverSaw + d.tooLongAgo + d.velocityNoise;
  const decomposition = {
    trueGoingEvents: d.trueGoingEvents,
    seenGoing: d.seenGoing,
    seenGoingShare: round(d.trueGoingEvents === 0 ? Number.NaN : d.seenGoing / d.trueGoingEvents, 4),
    missedEvents: missed,
    missedShare: round(d.trueGoingEvents === 0 ? Number.NaN : missed / d.trueGoingEvents, 4),
    neverSaw: d.neverSaw,
    tooLongAgo: d.tooLongAgo,
    velocityNoise: d.velocityNoise,
    ambiguousTieBroken: d.ambiguous,
    ofMissed: {
      neverSaw: round(missed === 0 ? Number.NaN : d.neverSaw / missed, 4),
      tooLongAgo: round(missed === 0 ? Number.NaN : d.tooLongAgo / missed, 4),
      velocityNoise: round(missed === 0 ? Number.NaN : d.velocityNoise / missed, 4),
    },
    falseGoing: d.falseGoing,
    // retention read: never-saw = scan-coverage irreducible; too-long-ago =
    // retention-recoverable slice; velocity-noise = irreducible noise (§4-ii).
    retention: {
      irreducibleScanCoverageShare: round(missed === 0 ? Number.NaN : d.neverSaw / missed, 4),
      retentionRecoverableShare: round(missed === 0 ? Number.NaN : d.tooLongAgo / missed, 4),
      irreducibleNoiseShare: round(missed === 0 ? Number.NaN : d.velocityNoise / missed, 4),
      tooOldAgeTicks: {
        n: d.tooOldAges.length,
        median: round(quantile(d.tooOldAges, 0.5), 2),
        p90: round(quantile(d.tooOldAges, 0.9), 2),
        max: d.tooOldAges.length ? Math.max(...d.tooOldAges) : Number.NaN,
      },
      note: 'An EXACT longer-retention replay needs a retention parameter on '
        + 'reconstructBodyMemory; I8/zero-src forbids adding one here, so the '
        + 'retention-recoverable slice is bounded by the too-long-ago share and '
        + 'never-saw is reported as the retention-irreducible scan-coverage floor.',
    },
  };

  // (iii) in-flight + warm-up
  const iii = {
    inflight: {
      decisions: c.inflightTotal,
      noOwnerShare: round(c.inflightTotal === 0 ? Number.NaN : c.inflightNoOwner / c.inflightTotal, 4),
      v1Banked: 0.287,
      recoveredShare: round(c.inflightNoOwner === 0 ? Number.NaN : c.inflightRecovered / c.inflightNoOwner, 4),
      note: 'repair 1: last-perceived owner retained while the ball is in flight; '
        + 'recoveredShare = in-flight decisions with a known last owner (non-abstaining).',
    },
    warmup: {
      bodies: c.warmupBodies,
      naturalWarmNoSnapshotShare: round(c.warmupBodies === 0 ? Number.NaN : c.warmupEmpty / c.warmupBodies, 4),
      coldNoSnapshotShare: round(c.coldBodies === 0 ? Number.NaN : c.coldEmpty / c.coldBodies, 4),
      v1BankedNoWarmup: 0.205,
      rememberedTeammates: {
        median: round(quantile(c.warmupTeammateCounts, 0.5), 2),
        mean: round(mean(c.warmupTeammateCounts), 3),
      },
      note: 'coldNoSnapshotShare = a fresh percept memory pulled with NO warm-up '
        + '(≈ v1 20.5%); naturalWarmNoSnapshotShare = the residual with the census '
        + 'body naturally warmed over the whole match (≫ 15-tick pre-roll); '
        + 'the gap is repair 2 validated. Residual NEVER-SAW persists out-of-range.',
    },
  };

  // (iv) anchors on the enriched world
  const a = c.anchor;
  const poolAnchor = (pick: (r: AnchorMatchState) => readonly number[]): number[] => {
    const o: number[] = [];
    for (const r of a) for (const v of pick(r)) o.push(v);
    return o;
  };
  const dwells = poolAnchor((r) => r.dwells);
  const drifts = poolAnchor((r) => r.drifts);
  const pairs = poolAnchor((r) => r.pairDists);
  const totalTicks = a.reduce((s, r) => s + r.ticks, 0);
  const totalChanges = a.reduce((s, r) => s + r.familyChanges, 0);
  const minutes = (totalTicks * DT) / 60;
  const perMatchDup = a.filter((r) => r.runTicks > 0).map((r) => r.dupRunTicks / r.runTicks);
  const anchors = {
    i1DwellSeconds: {
      median: round(quantile(dwells, 0.5), 4), mean: round(mean(dwells), 4),
      p90: round(quantile(dwells, 0.9), 4),
      // v1 reports per BODY per minute (43.98); 2·(TEAM_SIZE−1) outfielders.
      familyChangesPerBodyPerMin: round(minutes === 0 ? Number.NaN : totalChanges / minutes / (2 * (TEAM_SIZE - 1)), 4),
      v1: { median: 0.667, mean: 1.466, changesPerBodyPerMin: 43.98 },
    },
    i2TargetDriftMs: {
      median: round(quantile(drifts, 0.5), 4), mean: round(mean(drifts), 4),
      shareAbove4: round(drifts.filter((v) => v > DRIFT_FAST_MS).length / (drifts.length || 1), 4),
      v1: { median: 2.571, shareAbove4: 0.2735 },
    },
    i3PairwiseSpacingM: {
      p10: round(quantile(pairs, 0.1), 4), median: round(quantile(pairs, 0.5), 4),
      shareUnder4: round(pairs.filter((v) => v < CLOSE_PAIR_M).length / (pairs.length || 1), 4),
      v1: { p10: 4.188, median: 12.955, shareUnder4: 0.0940 },
    },
    i6DuplicateRuns: {
      share: round(mean(perMatchDup), 4),
      v1: 0.5471,
    },
  };

  // --- STOP TEETH (§6) ---
  const A = headline.agreement.point;
  const Wr = headline.wedgeRatio.point;
  const rarestPercCount = Number.isFinite(rarestPercCell.count) ? rarestPercCell.count : 0;
  const toothA = A <= TOOTH_A_WALL;
  const toothB = Wr <= TOOTH_B_WEDGE && rarestPercCount < CELL_FLOOR;
  const fired = toothA || toothB;
  let reading: string;
  if (fired) reading = 'W3 — WEDGE KILLS (return to commander; R3-first fallback on the table)';
  else if (Wr >= 0.85 && A > 0.7) reading = 'W1 — WEDGE NARROW (feature is SEEN; V2-P1 proceeds; DEV from true)';
  else reading = 'W2 — WEDGE MODERATE (V2-P1 proceeds; DEV floor from the perceived-attainable population)';

  const teeth = {
    toothA: {
      predicate: `agreement A ≤ ${TOOTH_A_WALL}`,
      agreement: A, wall: TOOTH_A_WALL, fired: toothA,
      verdict: toothA ? 'FIRED — percept no better than the C5-T2 coin' : 'NOT fired — percept beats the coin',
    },
    toothB: {
      predicate: `wedge W_r ≤ ${TOOTH_B_WEDGE} AND rarest perceived split cell < ${CELL_FLOOR}`,
      wedgeRatio: Wr, wedgeThreshold: TOOTH_B_WEDGE,
      rarestPerceivedCell: rarestPercCell.key, rarestPerceivedCount: rarestPercCount, floor: CELL_FLOOR,
      fired: toothB,
      verdict: toothB ? 'FIRED — perceived-attainable population cannot field #24'
        : 'NOT fired — either the wedge is above 0.24 or the rarest cell clears 150',
    },
    anyFired: fired,
    reading,
  };

  return {
    headline,
    deliverableI_baseRates: {
      note: 'TRUE someone-going rate per candidate per context; the conditioning '
        + 'population V2-P1 #24 floors bind against.',
      perContext,
      cellTable: cellRows,
      floors: {
        cellFloor: CELL_FLOOR, totalCells,
        trueCellsClearingFloor: trueCellsClearing,
        perceivedCellsClearingFloor: percCellsClearing,
        rarestTrueCell: rarestTrueCell.key, rarestTrueCount: Number.isFinite(rarestTrueCell.count) ? rarestTrueCell.count : 0,
        rarestPerceivedCell: rarestPercCell.key, rarestPerceivedCount: rarestPercCount,
      },
    },
    deliverableII_wedge: { decomposition },
    deliverableIII_repairs: iii,
    deliverableIV_anchors: anchors,
    teeth,
    ledger: c.ledger,
    gates: {
      clonesTaken: c.clonesTaken,
      cloneCoverage: c.clonesTaken === c.ledger.rows + c.ledger.eNoSnapshot,
      cloneChecked: c.cloneChecked,
      cloneMismatched: c.cloneMismatched,
      xClone: c.cloneChecked > 0 && c.cloneMismatched === 0,
      xFid: c.ledger.unexplained === 0,
    },
  };
};

// --- run: X-DET double run + canonical SHA (§5) ------------------------------
const first = runCensus();
const firstSummary = summarise(first);
const second = runCensus();
const secondSummary = summarise(second);
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(firstSummary) === canonical(secondSummary);
const sha256 = createHash('sha256').update(canonical(firstSummary)).digest('hex');
const tableSha = createHash('sha256').update(canonical(firstSummary.deliverableI_baseRates.cellTable)).digest('hex');

const gates = { ...firstSummary.gates, xDet: deterministic };
const verdict = gates.xClone && gates.xFid && gates.xDet
  ? (firstSummary.teeth.anyFired ? 'GATES PASS · TOOTH FIRED (return to commander)' : 'GATES PASS · teeth clear')
  : 'GATES FAIL';

const output = {
  experiment: 'STAGE3-V2-P0 (the wedge and the base-rate map)',
  authority: 'STAGE3-V2-P0-WEDGE-MAP',
  head: '92876e5 (v2 contract)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  parameters: {
    seedStart: CENSUS_SEED_START, matches: CENSUS_MATCHES, block: `${CENSUS_SEED_START}..${CENSUS_SEED_START + CENSUS_MATCHES - 1}`,
    regionRadiusM: R_M, advanceHorizonS: W_S, warmupTicks: WARMUP_TICKS,
    momentSpacingS: MOMENT_SPACING_S, motionSource: 'remembered velocity (differencing clause dead, #67.2)',
    lattice: LATTICE.map((c) => c.id), contexts: CONTEXTS, cellFloor: CELL_FLOOR,
    clusterUnit: 'match seed', bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
    awareness: 0.8, freshIntervalTicks: FRESH_INTERVAL_TICKS,
  },
  ...firstSummary,
  gates,
  deterministic,
  tableSha,
  sha256,
  verdict,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const h = firstSummary.headline;
const t = firstSummary.teeth;
console.error(
  `V2-P0 ${verdict}`
  + ` · ${CENSUS_MATCHES} matches · moments ${h.moments} rows ${first.ledger.rows}`
  + ` · TRUE someone-going ${pct(h.trueSomeoneGoingRate.point)} PERC ${pct(h.perceivedSomeoneGoingRate.point)}`
  + ` · A ${pct(h.agreement.point)} (wall ${pct(TOOTH_A_WALL)})`
  + ` · W_r ${h.wedgeRatio.point} (thr ${TOOTH_B_WEDGE})`
  + ` · decomp never-saw/too-old/vel ${pct(firstSummary.deliverableII_wedge.decomposition.ofMissed.neverSaw)}/`
  + `${pct(firstSummary.deliverableII_wedge.decomposition.ofMissed.tooLongAgo)}/`
  + `${pct(firstSummary.deliverableII_wedge.decomposition.ofMissed.velocityNoise)}`
  + ` · toothA ${t.toothA.fired} toothB ${t.toothB.fired} → ${t.reading.split(' ')[0]}`
  + ` · rarestPercCell ${t.toothB.rarestPerceivedCell}=${t.toothB.rarestPerceivedCount}`
  + ` · inflight ${pct(firstSummary.deliverableIII_repairs.inflight.noOwnerShare)}`
  + ` · X-CLONE ${first.cloneChecked}/${first.cloneMismatched} · det ${deterministic}`
  + ` · SHA ${sha256}`,
);
