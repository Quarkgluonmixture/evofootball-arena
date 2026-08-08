/**
 * O2 T0 — THE DORMANT LOOK SEAM: the receipts probe.
 *
 * Doc: docs/world-model/O2-T0-DORMANT-SEAM.md
 * Contract: docs/world-model/O2-LOOK-CONTRACT.md §2 M-O2.1–4, §3 O2-T0
 * Ruling: #193.2 (the dispatch), #181.2 (THE STANDING RECEIPT RULE).
 *
 * ⭐ #181.2: a HARD gate's evidence must be a COMMITTED, RECOMPUTABLE artifact.
 * Every hash below is computed IN THIS PROBE on the run that writes the JSON —
 * nothing is transcribed from a doc, and the doc quotes the artifact, never the
 * other way round. Re-run:
 *
 *     npx tsx scripts/probes/o2-t0-look-seam.ts
 *          → docs/world-model/data/o2-t0-look-seam.json
 *
 * The gates (all HARD unless marked REPORTED):
 *   G-IDENT   flag-off league byte-identity on THREE frozen league seeds
 *             (2 seasons each, recomputed here; the 1337 row IS X-FP-PROD)
 *   G-OFF     per-match tick identity: flag ABSENT ≡ flag FALSE ≡ a plain match,
 *             INCLUDING the rng stream state (RNG-stream identity, #75/S2-P2)
 *   G-BORN    ARMED with no instrument ≡ OFF, on the same seeds (M-O2.3: born
 *             incumbent-equivalent — an armed world with no forced look is the
 *             incumbent world)
 *   G-BITE    forced, the seam is REACHED and the world DIVERGES (identity is
 *             not the identity of dead code)
 *   G-LEN     every COMPLETED look window is exactly O2_LOOK_TICKS ticks, and
 *             O2_LOOK_TICKS === round(C7_W_CAP · 60) — the traced constant family
 *   G-SCAN    scans recorded === look ticks lived (the refresh cadence), and the
 *             ledger closes: looks === completed + abortedLoss + abortedPhase (+live)
 *   G-OWN     the seam never writes ownership: every window tick with the ball
 *             elsewhere is aborted at the very next head-of-tick
 *   G-RNG     the arm draws zero rng (the fixture, exact state compare)
 *   G-SEED    seed-block disjointness, proved in-probe
 *   G-DET     the experiment core runs TWICE, byte-identical digests
 *   REPORTED  the look census (windows, aborts) and the percept-freshness read
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { Match, O2_LOOK_TICKS } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const OUT_PATH = 'docs/world-model/data/o2-t0-look-seam.json';

/* ---- the frozen league-identity baselines (O1-T1 §GATES G2 / O1-T2 G-IDENT).
 * They are the PRE-CHANGE production hashes; this probe recomputes all three. */
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: FINGERPRINT_SEED, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ---- seeds: a FRESH block above everything the A4/O-arc ledger has consumed --- */
const BLOCK = 12_311_000;
const N = Number(process.env.O2T0_N ?? 24);
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
];

const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const round = (v: number, d = 4): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** The percept trunk alive — the world the whether seat (M-O2.4) reads in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

type Arm = 'absent' | 'off' | 'plain' | 'plainOff' | 'bornArmed' | 'forced';
/**
 * The five arms. `plain`/`plainOff` are PRODUCTION-shaped (no percept flags at
 * all); the rest run with the percept trunk alive, which is the world the whether
 * seat (M-O2.4) reads in. Identity is therefore proved TWICE over: within the
 * production shape and within the percept-armed shape.
 */
const matchOf = (seed: number, arm: Arm): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  ...(arm === 'plain' || arm === 'plainOff' ? {} : PERCEPT_FLAGS),
  ...(arm === 'off' || arm === 'plainOff' ? { o2Look: false } : {}),
  ...(arm === 'bornArmed' || arm === 'forced' ? { o2Look: true } : {}),
});

/**
 * The whole-match signature, INCLUDING the rng stream state — so this is also the
 * RNG-stream identity receipt the brief demands (any new draw on the flag-off path
 * would move `rng.s` and break G-OFF/G-BORN).
 */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

type WindowClass = 'completed' | 'abortedLoss' | 'abortedPhase' | 'unexplained';
interface ClosedWindow { ticks: number; cls: WindowClass }
interface RunOut {
  sig: string;
  steps: number;
  ledger: { looks: number; scans: number; completed: number; abortedLoss: number; abortedPhase: number };
  windows: ClosedWindow[];
  staleOwnerTicks: number;
  liveTicks: number;
  /** E-ENDED: the match finished with a window still live (the O1 ledger's own class). */
  endedLive: number;
}

/**
 * Walk one match. `force` = the M-O2.3 instrument seam (`forcedLook`, the
 * `forcedHold` idiom): force a LOOK on each NEW carrier — enough to prove the
 * seam is reachable and well-behaved. The EXAM vectors are T1's business, not
 * this stage's, and this probe claims nothing about football.
 */
const walk = (seed: number, arm: Arm): RunOut => {
  const m = matchOf(seed, arm);
  const force = arm === 'forced';
  let lastOwner = -1;
  let live = 0;
  let liveTicks = 0;
  let staleOwnerTicks = 0;
  let steps = 0;
  const windows: ClosedWindow[] = [];
  while (!m.finished) {
    const owner = m.ball.owner;
    if (force && owner !== null && owner.gid !== lastOwner && owner.role !== 'GK') {
      lastOwner = owner.gid;
      m.forcedLook = { gid: owner.gid, untilTick: m.simTick + 40 };
    }
    const before = m.o2LookWindow;
    const l0 = { ...m.o2LookLedger };
    m.step(DT);
    steps += 1;
    const now = m.o2LookWindow;
    // A window CLOSED this tick if the slot emptied, or if a different one is in
    // it (the head-of-tick close and a fresh arm at the same tick's decide).
    if (before !== null && (now === null || now.startTick !== before.startTick)) {
      const l1 = m.o2LookLedger;
      const cls: WindowClass = l1.completed > l0.completed ? 'completed'
        : l1.abortedLoss > l0.abortedLoss ? 'abortedLoss'
          : l1.abortedPhase > l0.abortedPhase ? 'abortedPhase' : 'unexplained';
      windows.push({ ticks: live, cls });
      live = 0;
    }
    if (now !== null) {
      live += 1;
      liveTicks += 1;
      const body = m.allPlayers.find((p) => p.gid === now.gid);
      if (m.ball.owner !== body) staleOwnerTicks += 1;
    }
  }
  return {
    sig: signature(m), steps, windows, staleOwnerTicks, liveTicks,
    endedLive: m.o2LookWindow === null ? 0 : 1,
    ledger: { ...m.o2LookLedger },
  };
};

/** G-RNG: a stepped fixture — arm a look and compare the rng state exactly. */
const rngFixture = (): { before: number; after: number; drew: boolean; armed: boolean } => {
  const m = matchOf(777_001, 'forced');
  while (m.phase !== 'playing') m.step(DT);
  for (let i = 0; i < 120 && m.ball.owner === null; i++) m.step(DT);
  const carrier = m.ball.owner ?? m.teams[0].players.filter((p) => p.role !== 'GK')[0];
  if (m.ball.owner !== carrier) { m.ball.owner = carrier; }
  const state = (): number => (m.rng as unknown as { s: number }).s;
  const before = state();
  m.armO2Look(carrier);
  const after = state();
  return { before, after, drew: before !== after, armed: m.o2LookWindow !== null };
};

/**
 * REPORTED — the percept-freshness read. Observation-only and measured on its OWN
 * matches (calling `perceivedSnapshot` reconstructs body memory, so it is never
 * done inside a run whose signature is compared). It is a DESCRIPTIVE reading at
 * smoke scale with no CI claim and no paired control; the wedge exam is T1's.
 */
const freshness = (seed: number, force: boolean): { samples: number; meanAgeTicks: number; meanOppSeen: number } => {
  const m = matchOf(seed, force ? 'forced' : 'bornArmed');
  let lastOwner = -1;
  const ages: number[] = [];
  const seen: number[] = [];
  let i = 0;
  while (!m.finished) {
    const owner = m.ball.owner;
    if (force && owner !== null && owner.gid !== lastOwner && owner.role !== 'GK') {
      lastOwner = owner.gid;
      m.forcedLook = { gid: owner.gid, untilTick: m.simTick + 40 };
    }
    m.step(DT);
    i += 1;
    if (i % 20 === 0) {
      const carrier = m.ball.owner;
      if (carrier !== null && carrier.role !== 'GK') {
        const snap = m.perceivedSnapshot(carrier);
        if (snap !== null) {
          const opp = snap.players.filter((o) => o.side !== carrier.side);
          if (opp.length > 0) {
            ages.push(opp.reduce((a, o) => a + o.ageTicks, 0) / opp.length);
            seen.push(opp.length);
          }
        }
      }
    }
  }
  const mean = (xs: number[]): number => (xs.length === 0 ? Number.NaN
    : xs.reduce((a, b) => a + b, 0) / xs.length);
  return { samples: ages.length, meanAgeTicks: round(mean(ages)), meanOppSeen: round(mean(seen)) };
};

/* ========================================================================== */
/* the experiment core (run TWICE for G-DET)                                  */
/* ========================================================================== */

const runExperiment = () => {
  const rows = [] as {
    seed: number; absent: string; off: string; plain: string; plainOff: string;
    bornArmed: string; forced: string;
    identical: boolean; plainIdentical: boolean; bornIdentical: boolean; diverged: boolean;
    ledger: RunOut['ledger']; windows: ClosedWindow[]; staleOwnerTicks: number;
    liveTicks: number; endedLive: number;
  }[];
  for (let k = 0; k < N; k++) {
    const seed = BLOCK + k;
    const absent = walk(seed, 'absent');
    const off = walk(seed, 'off');
    const plain = walk(seed, 'plain');
    const plainOff = walk(seed, 'plainOff');
    const born = walk(seed, 'bornArmed');
    const forced = walk(seed, 'forced');
    rows.push({
      seed,
      absent: absent.sig, off: off.sig, plain: plain.sig, plainOff: plainOff.sig,
      bornArmed: born.sig, forced: forced.sig,
      plainIdentical: plain.sig === plainOff.sig,
      identical: absent.sig === off.sig,
      bornIdentical: born.sig === absent.sig,
      diverged: forced.sig !== absent.sig,
      ledger: forced.ledger, windows: forced.windows,
      staleOwnerTicks: forced.staleOwnerTicks, liveTicks: forced.liveTicks,
      endedLive: forced.endedLive,
    });
  }
  const total = rows.reduce((acc, r) => ({
    looks: acc.looks + r.ledger.looks,
    scans: acc.scans + r.ledger.scans,
    completed: acc.completed + r.ledger.completed,
    abortedLoss: acc.abortedLoss + r.ledger.abortedLoss,
    abortedPhase: acc.abortedPhase + r.ledger.abortedPhase,
    liveTicks: acc.liveTicks + r.liveTicks,
    staleOwnerTicks: acc.staleOwnerTicks + r.staleOwnerTicks,
    endedLive: acc.endedLive + r.endedLive,
  }), {
    looks: 0, scans: 0, completed: 0, abortedLoss: 0, abortedPhase: 0,
    liveTicks: 0, staleOwnerTicks: 0, endedLive: 0,
  });
  const allWindows = rows.flatMap((r) => r.windows);
  const hist: Record<string, number> = {};
  for (const w of allWindows) hist[String(w.ticks)] = (hist[String(w.ticks)] ?? 0) + 1;
  const completedWindows = allWindows.filter((w) => w.cls === 'completed');
  return {
    seeds: { block: BLOCK, n: N, first: BLOCK, last: BLOCK + N - 1 },
    rows,
    lookCensus: {
      ...total,
      windowsClosed: allWindows.length,
      windowLengthHistogramTicks: hist,
      completedAllAtFrozenLength: completedWindows.length === total.completed
        && completedWindows.every((w) => w.ticks === O2_LOOK_TICKS),
      unexplainedWindows: allWindows.filter((w) => w.cls === 'unexplained').length,
      maxWindowTicks: allWindows.length === 0 ? 0 : Math.max(...allWindows.map((w) => w.ticks)),
      /* THE REFRESH CADENCE, as an exact identity: one recorded scan moment per
       * tick a window was live (the arm records the first, `stepO2Look` the rest).
       * `unexplained` counts arms that landed in no terminal class at all. */
      scansEqualLiveTicks: total.scans === total.liveTicks,
      unexplainedArms: total.looks
        - (total.completed + total.abortedLoss + total.abortedPhase + total.endedLive),
      scansPerLook: total.looks === 0 ? Number.NaN : round(total.scans / total.looks),
    },
  };
};

/* ========================================================================== */
/* main                                                                       */
/* ========================================================================== */

process.stderr.write(`=== O2 T0 LOOK SEAM RECEIPTS — ${N} seeds, block ${BLOCK} ===\n`);
const wall0 = Date.now();
const runA = runExperiment();
const digestA = sha(canonical(runA));
process.stderr.write(`  [o2-t0] run A digest ${digestA}\n  [o2-t0] G-DET second run...\n`);
const runB = runExperiment();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
process.stderr.write(`  [o2-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}\n`);

/* ---- G-IDENT (#181.2): all THREE league-seed hashes recomputed HERE ------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  process.stderr.write(`  [o2-t0] G-IDENT league seed ${seed} (${FINGERPRINT_SEASONS} seasons, flag absent)...\n`);
  const observed = leagueHash(seed);
  process.stderr.write(`  [o2-t0] G-IDENT ${seed} ${observed === baseline ? 'IDENTICAL' : '*** DIFFERS ***'} ${observed}\n`);
  return { seed, seasons: FINGERPRINT_SEASONS, baseline, observed, identical: observed === baseline };
});
const gIdentPass = gIdentRows.every((r) => r.identical);
const fpRow = gIdentRows.find((r) => r.seed === FINGERPRINT_SEED)!;

const rng = rngFixture();
const freshForced = freshness(BLOCK + N, true);
const freshNoLook = freshness(BLOCK + N, false);
const wallMs = Date.now() - wall0;

let head = '';
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const seedDisjoint = (() => {
  const first = BLOCK;
  const last = BLOCK + N; // + the freshness match at BLOCK + N
  const clashes = CONSUMED.filter((c) => !(last < c.range[0] || first > c.range[1]));
  return { first, last, consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name), pass: clashes.length === 0 };
})();

const c = runA.lookCensus;
const gOff = runA.rows.every((r) => r.identical && r.plainIdentical);
const gBorn = runA.rows.every((r) => r.bornIdentical);
const gBite = runA.rows.some((r) => r.diverged) && c.looks > 0 && c.scans > 0;
const gLen = c.completedAllAtFrozenLength && c.maxWindowTicks <= O2_LOOK_TICKS
  && c.unexplainedWindows === 0;
/* The ledger CLOSES per match: every arm lands in exactly one terminal class,
 * `endedLive` being the O1 ledger's own E-ENDED (the match stopped mid-window). */
const gLedgerCloses = runA.rows.every(
  (r) => r.ledger.looks
    === r.ledger.completed + r.ledger.abortedLoss + r.ledger.abortedPhase + r.endedLive,
) && c.scansEqualLiveTicks;
const gOwn = runA.rows.every((r) => r.staleOwnerTicks === r.ledger.abortedLoss);
const gRng = !rng.drew && rng.armed;
const gConst = O2_LOOK_TICKS === Math.round(0.18 * 60) && O2_LOOK_TICKS === 11;

const gatesPass = gDet && gIdentPass && gOff && gBorn && gBite && gLen && gLedgerCloses
  && gOwn && gRng && gConst && seedDisjoint.pass;

const body = {
  stage: 'O2 T0 — the dormant LOOK seam (`o2Look`)',
  ruling: '#193.2 (the dispatch) + #181.2 (the standing receipt rule)',
  contract: 'docs/world-model/O2-LOOK-CONTRACT.md',
  doc: 'docs/world-model/O2-T0-DORMANT-SEAM.md',
  head,
  frozenInterval: {
    o2LookTicks: O2_LOOK_TICKS,
    seconds: round(O2_LOOK_TICKS / 60, 5),
    derivation: 'round(C7_W_CAP * 60) with C7_W_CAP = 0.18 s (src/sim/Match.ts, the C7 '
      + '§LAW constant family) — also the [3,11] clamp ceiling c7WindupTicks enforces. '
      + 'No constant is invented for this slice.',
  },
  gates: {
    gDet: { pass: gDet, digestA, digestB },
    /* #181.2 THE STANDING RECEIPT RULE: computed in-probe on this run, never transcribed. */
    gIdent: {
      pass: gIdentPass, seasons: FINGERPRINT_SEASONS,
      procedure: 'new League({seed}) → runHeadless toGeneration(generation + 2) → '
        + 'sha256(JSON.stringify(out.league)) — identical to scripts/fingerprint.ts',
      rows: gIdentRows,
    },
    xFpProd: { pass: fpRow.identical, baseline: FINGERPRINT_BASELINE, observed: fpRow.observed },
      gOff: {
      pass: gOff, seeds: N,
      note: 'flag ABSENT ≡ flag FALSE, in BOTH the production-shaped world and the '
        + 'percept-armed world; whole-match signature INCLUDING the rng stream state, '
        + 'so a single added draw on the flag-off path would fail this gate',
    },
    gBorn: { pass: gBorn, seeds: N, note: 'armed with forcedLook null ≡ OFF (M-O2.3 born incumbent-equivalent)' },
    gBite: { pass: gBite, divergedSeeds: runA.rows.filter((r) => r.diverged).length },
    gLen: { pass: gLen, frozenTicks: O2_LOOK_TICKS, maxObserved: c.maxWindowTicks },
      gScanLedger: {
      pass: gLedgerCloses, unexplainedArms: c.unexplainedArms,
      scansEqualLiveTicks: c.scansEqualLiveTicks, endedLive: c.endedLive,
      scansPerLook: c.scansPerLook,
    },
    gOwn: { pass: gOwn, staleOwnerTicks: c.staleOwnerTicks, abortedLoss: c.abortedLoss },
    gRng: { pass: gRng, ...rng },
    gConst: { pass: gConst },
    seedDisjoint,
    allPass: gatesPass,
    srcDiffStatContextOnly: srcDiff,
  },
  reported: {
    lookCensus: c,
    perceptFreshness: {
      note: 'REPORTED, observation-only, measured on its own match (perceivedSnapshot '
        + 'reconstructs memory, so it never runs inside a compared arm). Smoke scale, '
        + 'no control, no CI: the wedge exam is O2-T1.',
      seed: BLOCK + N,
      forced: freshForced,
      noLook: freshNoLook,
    },
  },
  result: runA,
};
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, resultSha256, wallMsContextOnly: wallMs }, null, 2)}\n`);

const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== O2 T0 LOOK SEAM RECEIPTS — HEAD ${head} — ${N} seeds, block ${BLOCK} ===`);
o(`G-IDENT (3 league seeds, computed here) ${gIdentPass ? 'PASS' : 'FAIL'}`);
for (const r of gIdentRows) {
  o(`  seed ${String(r.seed).padStart(9)} ${r.observed} ${r.identical ? 'IDENTICAL' : '*** DIFFERS ***'}`);
}
o(`G-OFF ${gOff ? 'PASS' : 'FAIL'} · G-BORN ${gBorn ? 'PASS' : 'FAIL'} · G-BITE ${gBite ? 'PASS' : 'FAIL'}`
  + ` · G-LEN ${gLen ? 'PASS' : 'FAIL'} · G-SCAN ${gLedgerCloses ? 'PASS' : 'FAIL'}`
  + ` · G-OWN ${gOwn ? 'PASS' : 'FAIL'} · G-RNG ${gRng ? 'PASS' : 'FAIL'} · G-DET ${gDet ? 'PASS' : 'FAIL'}`);
o(`LOOK CENSUS (forced arm): looks ${c.looks} · scans ${c.scans} · completed ${c.completed}`
  + ` · abortedLoss ${c.abortedLoss} · abortedPhase ${c.abortedPhase} · windows closed ${c.windowsClosed}`);
o(`window length histogram (ticks): ${JSON.stringify(c.windowLengthHistogramTicks)}`);
o(`FROZEN INTERVAL O2_LOOK_TICKS = ${O2_LOOK_TICKS} ticks (${round(O2_LOOK_TICKS / 60, 5)} s)`);
o(`REPORTED freshness — forced ${JSON.stringify(freshForced)} · no-look ${JSON.stringify(freshNoLook)}`);
o(`resultSha256 ${resultSha256}`);
o(`GATES ${gatesPass ? 'PASS' : '*** FAIL ***'} — artifact ${OUT_PATH}`);
if (!gatesPass) process.exitCode = 1;
