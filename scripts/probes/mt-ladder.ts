/**
 * MT LADDER — THE DOSE LADDER (which dose of the coupled tuck-in world does the user play-test?).
 *
 * Doc:      docs/world-model/MT-LADDER.md  (EVERY arm, seed, gate, threshold and predicate
 *           below — INCLUDING ⭐ THE KNEE RULE — is frozen THERE, ex ante, before any
 *           full-N number existed.)
 * Contract: docs/world-model/MARK-TIGHTNESS-CONTRACT.md §1 H-MT · §2 M-MT.1-5 · §4 the
 *           non-claims. (This stage adds NO contract clause: it is an EXHIBIT-dose battery,
 *           not a ship decision. Road B binds until the play-test rules.)
 * Seams:    docs/world-model/MT-T0-DORMANT-SEAM.md (the sag §LAW, the ARMING CHECKLIST)
 *           docs/world-model/PM-T0-DORMANT-SEAM.md (k_PM ≤ 0.25, its arming checklist)
 *           ⚠ EACH DOSED ARM THROWS ALL SWITCHES OF BOTH SEAMS (#196.3-D4), and the genes
 *           ride all three genome views of BOTH teams (#196.3-D6).
 * THE RULER: docs/world-model/MT-T1-RULER-RERUN.md + scripts/probes/mt-t1-ruler-rerun.ts,
 *           itself the PM-T1 compression exam's instrument set. Every measured QUANTITY
 *           below is that battery's, inherited VERBATIM and pinned line-by-line by
 *           G-INHERIT — and MT-T1's ⚠ CORRECTION rows (#197-M1 head outside the hashed
 *           body · #197-M2 unabridged transcripts · #197-L3 N provenance · #197-L4 the
 *           p50-as-mean substitution · #197-L5 the split steer taxonomy + pooled guard
 *           grain · #197-L6 the recomputed counterfactual ask · #203's four verify
 *           findings) BIND THIS BUILD. Differences are DISCLOSED in the artifact's
 *           `inheritance.disclosedDifferences` and in doc §5.0.
 * Rulings:  #209 (this dispatch, the user ruled 甲; ⭐ the KNEE RULE frozen ex ante) ·
 *           #208 (the two measured anchors: gene ≈ 0.2 healthy / gene = 1 deflated) ·
 *           #204 (MT-T1's cost finding at the top dose) · #199 (the ask/body split) ·
 *           #198 (the guard/band set incl. goals) · #196.3-D4 / -D6 · #181.2 (receipts =
 *           committed recomputable artifacts; every hash computed HERE) · #197-M1/M2 ·
 *           #194/#196 (state what the arms DIFFER in) · #203 (ADJUDICATE FROM THE PER-ARM
 *           ROWS, never from a verdict line) · #163 (stats-base discipline).
 *
 * INSTRUMENT-ONLY: zero src/** changes (X-SRC-ZERO is a HARD gate). Both seams stay
 * certified-and-dormant; the doses travel genome views + MatchConfig flags.
 *
 * THE QUESTION. #204 measured the coupled world at gene = 1 (body −2.80 m, but the
 * equilibrium band blown on 4 of 5 gated dimensions) and #208 measured it at the evolved
 * drift dose gene ≈ 0.2 (body −0.70 m, world healthy). The intermediate doses are
 * UNMEASURED. This battery walks the coupled axis at 0.2 / 0.4 / 0.6 / 0.8 against the
 * ABSENT control and applies the FROZEN KNEE RULE. 1.0 is NOT re-run: it is cited from
 * #204's committed artifact.
 *
 * ⭐ THE KNEE RULE (ruling #209.2, frozen ex ante, coded VERBATIM in §14):
 *   the play-test dose = the LARGEST dose d whose arm
 *     (a) holds the equilibrium BAND on EVERY control-gated dimension (the inherited
 *         substrate-drift caveat: a dimension the CONTROL itself fails is EXCLUDED),
 *     (b) passes GUARD-NI, and
 *     (c) has a RESOLVEDLY NEGATIVE bodyLatGap (CI_upper < 0).
 *   If NO dose ≥ 0.4 qualifies ⇒ the entry builds at 0.2 (the measured-healthy anchor).
 *   If ALL qualify ⇒ 0.8.
 * The knee is an EXHIBIT dose for the user's play-test verdict (the density precedent),
 * NOT a ship decision. THERE IS NO STOP CLASS HERE: every branch of the rule lands a dose,
 * and the commander adjudicates from the PER-ARM rows (#203).
 *
 * MODES:  MTLAD_MODE=smoke (default) — plumbing only, adjudicates NOTHING
 *         MTLAD_MODE=full            — the pre-registered battery
 *         MTLAD_N=<n>                — accepted in SMOKE ONLY (turns G-NDERIVED RED in
 *                                      full mode, the #188 nDerived precedent)
 *
 * NO CHECKPOINTING (a declared difference from MT-T2): the run is ~15 min, so a kill costs
 * the whole run and that is accepted. MT-T2's per-(pass, seed) resume is NOT carried here.
 *
 * EXIT SEMANTICS (the commander's monitor reads these):
 *   0 — X-family green; the knee is computed and printed per the frozen rule (INCLUDING
 *       its two fallback branches — every branch lands a dose)
 *   1 — an X-family HARD gate failed ⇒ the MEASUREMENT is invalid, read nothing else
 *   (there is no exit 2: this stage pre-names no STOP)
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { markSagMetres } from '../../src/ai/actionExecutor';
import { formationSpot, runTarget } from '../../src/ai/formations';
import {
  MARK_SAG_BALL_SPEED, MARK_SAG_MAX, PM_LANE_CONVERGENCE_MAX, markSagWeight, mutateGenome,
  pmLaneConvergenceK, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const wall0 = Date.now();

/* ========================================================================== */
/* §0 MODE / ENV                                                              */
/* ========================================================================== */
const MODE = (process.env.MTLAD_MODE ?? 'smoke') as 'smoke' | 'full';
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('MT-LADDER FATAL — MTLAD_MODE must be `smoke` or `full`.');
  process.exit(2);
}
const N_ENV = process.env.MTLAD_N === undefined ? null : Math.max(1, Number.parseInt(process.env.MTLAD_N, 10));
const OUT_PATH = process.env.MTLAD_OUT ?? (MODE === 'smoke'
  ? 'docs/world-model/data/mt-ladder-smoke.json'
  : 'docs/world-model/data/mt-ladder.json');
const SMOKE_PATH = 'docs/world-model/data/mt-ladder-smoke.json';
/** The two MEASURED ANCHORS this ladder sits between — CITED, never re-run (#209.1). */
const RULER_PATH = 'docs/world-model/data/mt-t1-ruler-rerun.json';   // #204: gene = 1
const COEVO_PATH = 'docs/world-model/data/mt-t2-coevolution.json';   // #208: gene ≈ 0.2 (drift)

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — THE FIVE ARMS: the control + the four DOSES (doc §2)  */
/* ========================================================================== */
/**
 * ⚠ THE TWO ARMING CHECKLISTS (#196.3-D4, BINDING), asserted per arm by G-ARM:
 *   PM armed = the `pmLaneConvergence` MatchConfig flag + the `evolveDefLaneConvergence`
 *              opt-in + a non-absent `defLaneConvergence` gene — ALL THREE.
 *   MT armed = the `mtMarkSag` MatchConfig flag + the `evolveMarkSag` opt-in + a
 *              non-absent `markSag` gene — ALL THREE.
 * This exam is FIXED-DOSE (no evolution runs), so the opt-ins are the channel the genes
 * WOULD travel under selection rather than ones this exam exercises; G-ARM asserts BOTH
 * channels are LIVE (PM-T0/MT-T0's `optInDraws` evidence form). Stated, not implied.
 * Genes are written on ALL THREE genome views (`info.genome` / `baseGenome` / `effGenome`)
 * of BOTH teams — the `a4World` `armGenes` idiom, i.e. the REAL gene channel
 * (#196.3-D6: this exam adds NO engine-side dose surface).
 */
interface ArmSpec {
  readonly id: string;
  readonly pmFlag: boolean;
  readonly mtFlag: boolean;
  /** `null` = the gene ABSENT. */
  readonly pmGene: number | null;
  readonly mtGene: number | null;
  readonly what: string;
}
/** ⭐ THE FOUR LADDER DOSES — BOTH genes equal, the COUPLED play-test world axis (#209.1).
 *  1.0 is NOT an arm: it is already measured (#204) and is CITED, never re-run. */
const LADDER_DOSES = [0.2, 0.4, 0.6, 0.8] as const;
const doseArmId = (d: number): string => `D${String(Math.round(d * 10)).padStart(2, '0')}`;
const ARMS = [
  {
    id: 'ABSENT', pmFlag: false, mtFlag: false, pmGene: null, mtGene: null,
    what: 'THE CONTROL — both flags OFF, both genes absent (the production-shaped defensive path)',
  },
  {
    id: 'D02', pmFlag: true, mtFlag: true, pmGene: 0.2, mtGene: 0.2,
    what: 'BOTH seams fully armed at dose 0.2 (k_PM = 0.05, markSagWeight = 0.2) — the coupled '
      + 'world; the DRIFT-DOSE anchor #208 measured healthy (body −0.70 m at gene ≈ 0.2)',
  },
  {
    id: 'D04', pmFlag: true, mtFlag: true, pmGene: 0.4, mtGene: 0.4,
    what: 'BOTH seams fully armed at dose 0.4 (k_PM = 0.10, markSagWeight = 0.4) — UNMEASURED',
  },
  {
    id: 'D06', pmFlag: true, mtFlag: true, pmGene: 0.6, mtGene: 0.6,
    what: 'BOTH seams fully armed at dose 0.6 (k_PM = 0.15, markSagWeight = 0.6) — UNMEASURED',
  },
  {
    id: 'D08', pmFlag: true, mtFlag: true, pmGene: 0.8, mtGene: 0.8,
    what: 'BOTH seams fully armed at dose 0.8 (k_PM = 0.20, markSagWeight = 0.8) — UNMEASURED',
  },
] as const satisfies readonly ArmSpec[];
type ArmId = (typeof ARMS)[number]['id'];
const ARM_IDS = ARMS.map((a) => a.id) as ArmId[];
const ARMS_COUNT = ARM_IDS.length;
const CONTROL_ARM: ArmId = 'ABSENT';
const specOf = (a: ArmId): ArmSpec => ARMS[ARM_IDS.indexOf(a)];
const DOSE_ARMS = ARM_IDS.filter((a) => a !== CONTROL_ARM);
/** dose → arm — the knee rule speaks in DOSES, the instruments in ARMS. */
const ARM_OF_DOSE = Object.fromEntries(LADDER_DOSES.map((d) => [d, doseArmId(d) as ArmId])) as Record<number, ArmId>;
/** ⭐ THE KNEE-RULE FALLBACKS (#209.2), as constants so the doc and the code cannot drift. */
const KNEE_FLOOR_DOSE = 0.2;   // "if no dose ≥ 0.4 qualifies, the entry builds at 0.2"
const KNEE_CEILING_DOSE = 0.8; // "if ALL qualify, 0.8"
const KNEE_LADDER_MIN_ABOVE_FLOOR = 0.4;
/** ⚠ THE MEASURED-BUT-NOT-RE-RUN ANCHOR: gene = 1.0 (#204). Cited from the committed
 *  MT-T1 artifact at run time, never typed as a number here (#181.2 / #194-M1). */
const CITED_TOP_DOSE = 1.0;
/** Both teams are dosed symmetrically — the PM-T1 §2.2 equilibrium frame, inherited. */
const DOSE_BOTH_TEAMS = true;

/** §2.3 the world: the percept-armed substrate PM-T0/PM-T1's own receipts ran in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;

/* --- §3 the seed ledger ----------------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_420_000, 12_420_999];
const SMOKE_BASE = 12_420_000;
const SMOKE_N = 6;
/** The EXIT-SEMANTICS sub-block: seeds this stage steps ONLY to prove that a full-mode
 *  `MTLAD_N` override turns `gNDerived` RED and exits 1. Declared here so the battery's own
 *  seeds stay VIRGIN — that check's output is discarded and adjudicates nothing. */
const EXIT_CHECK_BLOCK: readonly [number, number] = [12_420_100, 12_420_199];
const FULL_BASE = 12_420_200;
/** Honest hard cap: the reserved battery band 12,420,200..12,420,999 = 800 seeds.
 *  A SEED-BUDGET cap, not a statistical claim. */
const N_CAP = 800;
const N_STEP = 25;
/** Every block the A4/O/PM/MT arc has consumed (MT-T2's ledger + MT-T1's and MT-T2's own
 *  bands). MT-T2 consumed through 12,412,339 inside its reserved band 12,320,000..12,419,999,
 *  which is listed WHOLE — a reserved band is spent. Disjointness is computed IN-PROBE (G-SEED). */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208; evolution ..12,401,444 + body ..12,412,339)', range: [12_320_000, 12_419_999] },
];
/** §3: the stats stream — a SEPARATE namespace. MT-T2's base was 103,800 with 104,000
 *  RESERVED ⇒ the next legal base under the #163 200 floor is 104,200. */
const BOOTSTRAP_SEED = 104_200;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  101_403, 102_000, 102_200, 102_400, 102_600, 102_800, 103_000, 103_200, 103_400, 103_600,
  103_800, 104_000,
];

/* --- §4 THE N ARITHMETIC, frozen ex ante ------------------------------------ */
const Z_975 = 1.96;
/** ⭐ THE VARIANCE SOURCE IS SMOKE-FREE and is the SAME published one PM-T1's frozen rule
 *  used: #188's prod-world CI for the weak-side back's per-seed lane gap
 *  (FARSIDE-DEFENDER-FORENSIC §8.3, `sendLatGapMean` p50 19.86 [19.65, 20.04] over 700
 *  per-seed clusters — the WIDEST of its four published worlds, the conservative choice).
 *  ⚠ TWO SUBSTITUTIONS ARE DISCLOSED, NOT HIDDEN (stage doc §4):
 *   (a) it is a MEDIAN's interval used as if it were a mean's — inherited from PM-T1 §4's
 *       own ⚠ CORRECTION (#197-L4); direction CONSERVATIVE (over-sizes N);
 *   (b) PM-T1 GATED on the ask and this exam GATES on the BODY, so the variance term is
 *       a TARGET metric's applied to a BODY metric. Direction UNKNOWN. The rule is not
 *       re-cut for it: the achieved half-width is PUBLISHED per arm and any shortfall is
 *       disclosed (the #188 §8.0 precedent). */
const PUB188_ASK = { p50: 19.86, lo: 19.65, hi: 20.04, clusters: 700 } as const;
const PAIRED_INFLATION = Math.SQRT2;
const TARGET_HALFWIDTH_M = 0.5;
const WALL_BUDGET_HOURS = 2.0;
const XDET_FACTOR = 2;
/** #188's published per-match cost — the PRIOR the wall term uses when no committed smoke
 *  artifact exists yet (the PM-T1 form). */
const PUB188_MS_PER_MATCH = 102.21;

/* --- §5 THE GUARDS: tolerances INHERITED, never invented -------------------- */
/** ⭐ THE S2 NON-INFERIORITY FRACTION, INHERITED VERBATIM (A4-S2P1-VECTOR-CENSUS §4,
 *  via PM-T1 §5.4): `1 − 0.275/0.380 = 0.2763`. The FRACTION is inherited; the SCALE is
 *  the control arm's own level in THIS run. */
const NI_FRACTION = 1 - 0.275 / 0.380;
/** §5 EQUILIBRIUM BAND — inherited VERBATIM from A4-S2P3-GENE-BATTERY §4.2 via PM-T1 §5.5,
 *  INCLUDING goals and INCLUDING its declared SUBSTRATE-DRIFT caveat (a dimension the
 *  CONTROL arm itself fails is DISCLOSED and EXCLUDED from the gate). */
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
type BandKey = keyof typeof BAND_BASELINE;
const BAND_KEYS = Object.keys(BAND_BASELINE) as BandKey[];

/* --- §6 the #188 instrument constants, inherited VERBATIM (via PM-T1 §6) ---- */
const OWN_THIRD_LOCAL_X = -HALF_L / 3;
const FLANK_ABS_Y = BOX_WIDTH / 2;
const MIN_EPISODE_TICKS = 30;
const SPREAD_R = 9;
/** ⚠ FLAGGED EXECUTOR'S CHOICE, inherited from PM-T1 §5.3 at the SAME value and with the
 *  SAME status: NO GATE PREDICATE READS IT. It only quantifies the REPORTED swallow share. */
const ASK_MATERIAL_M = 1.0;
const ASK_MATERIAL_LADDER = [0.5, 1.0, 2.0] as const;

/* --- the P3′ whole-match guard constants, inherited VERBATIM ---------------- */
const SAMPLE_EVERY = 10;      // 6 Hz
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;       // the spacing FLOOR read
const DUP_RUN_M = 4;

/* --- the SAG-FIRED instrument, INHERITED from MT-T1 (§5.2) ------------------ */
/** The census sampling cadence, inherited VERBATIM from MT-T0's `stanceCensus`. */
const SAG_SAMPLE_EVERY = 15;
/**
 * THE MATERIAL-SAG THRESHOLD — TRACED (never a free choice), carried at MT-T1's value.
 * ⚠ DECLARED DIFFERENCE FROM THE RULER: in MT-T1 a GATE predicate read this number
 * (F-MT-a's first limb). THIS stage pre-names NO STOP, so NO GATE AND NO KNEE LIMB READS
 * IT — the sag census rides REPORTED, as the sag-fired instrument the dispatch asks to
 * carry. It is pinned anyway so it cannot drift.
 * `1.4` is the FULL SPAN of the stance band the EXISTING tightness gene can express:
 * `src/ai/actionExecutor.ts:294` — `let markDist = ball.owner === mark ? 2.6 : 2.6 -
 * g.markingAggression * 1.4;` — i.e. `markingAggression` sweeping [0,1] moves the stance
 * by exactly 1.4 m. "The sag FIRES materially" therefore means: the new axis moved the
 * stance by at least as much as the whole of the old one can. G-INHERIT pins that source
 * line VERBATIM, so the anchor cannot drift silently.
 */
const SAG_MATERIAL_M = 1.4;

/* --- the X-family pins ------------------------------------------------------ */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* ========================================================================== */
/* §7 HELPERS (inherited from the ruler)                                      */
/* ========================================================================== */
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const pctlSorted = (s: readonly number[], q: number): number => {
  if (s.length === 0) return Number.NaN;
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const quantile = (xs: readonly number[], q: number): number => pctlSorted([...xs].sort((a, b) => a - b), q);
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number => Math.hypot(a.x - b.x, a.y - b.y);
const canonical = (v: unknown): string => {
  const w = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(w);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = w(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(w(v));
};
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');

/* ========================================================================== */
/* §8 THE ARMS — both arming checklists + the D6 gene channel                  */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const matchOf = (seed: number, arm: ArmId): Match => {
  const s = specOf(arm);
  const base = {
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...PERCEPT_FLAGS,
    ...(s.pmFlag ? { pmLaneConvergence: true } : {}),
    ...(s.mtFlag ? { mtMarkSag: true } : {}),
  };
  const m = new Match(base as ConstructorParameters<typeof Match>[0]);
  if (s.pmGene !== null || s.mtGene !== null) {
    const sides: Side[] = DOSE_BOTH_TEAMS ? [0, 1] : [0];
    for (const side of sides) {
      const t = m.teams[side];
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        if (s.pmGene !== null) g.defLaneConvergence = s.pmGene;
        if (s.mtGene !== null) g.markSag = s.mtGene;
      }
    }
  }
  return m;
};

/** The whole-match signature INCLUDING the rng stream state (PM-T0/PM-T1's form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/* ========================================================================== */
/* §9 THE INSTRUMENT — the ruler's tick-walk, plus the SAG census              */
/* ========================================================================== */
type SteerOwner = 'markStance' | 'markFallback' | 'stationHome' | 'ballDirected' | 'other';
const STATION_HOME_ACTIONS = new Set(['MoveToFormationSpot', 'HoldPosition']);
const BALL_DIRECTED_ACTIONS = new Set([
  'ChaseBall', 'InterceptPass', 'ReceivePass', 'Pass', 'Shoot', 'Dribble', 'Clear',
  'Tackle', 'HeaderChallenge', 'GkSave', 'GkDistribute',
]);
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

/**
 * ⚠ STATED EXACTLY (inherited from MT-T0 Deviation 5): `baseMarkDist` is a probe-side
 * REPLICA of the two unmodulated stance-floor lines in `actionExecutor.ts` (the Phase 30.5
 * floor and the Phase 31.6 distribution stand-off), because the engine keeps `markDist` a
 * block-local scalar and neither slice adds a probe-only engine surface (#196.3-D6). The
 * replica cannot drift silently: G-INHERIT pins BOTH source lines VERBATIM.
 */
const baseMarkDist = (m: Match, side: 0 | 1, markIdx: number, aggression: number): number => {
  const opp = m.teams[1 - side];
  const mark = opp.players[markIdx];
  let d = m.ball.owner === mark ? 2.6 : 2.6 - aggression * 1.4;
  const oppGk = opp.goalkeeper;
  if (
    (m.restart?.kind === 'goalKick' && m.restart.side === mark.side)
    || ((oppGk.gkHoldTimer > 0 || oppGk.gkDistributing) && m.ball.owner === oppGk)
  ) d = Math.max(d, 2.6 - aggression * 0.6);
  return d;
};

/** The SAG census accumulator (MT-T0's `stanceCensus` quantities, carried per arm). */
interface SagAcc {
  samples: number; slackPositive: number; saggedGtBase: number; tightened: number;
  sumBase: number; sumSagged: number; sumSagPositive: number; maxSag: number;
}
const newSagAcc = (): SagAcc => ({
  samples: 0, slackPositive: 0, saggedGtBase: 0, tightened: 0,
  sumBase: 0, sumSagged: 0, sumSagPositive: 0, maxSag: 0,
});
const sagObserve = (acc: SagAcc, m: Match, t: Team, p: Player, markIdx: number): void => {
  const opp = m.teams[1 - t.side];
  const mark = opp.players[markIdx];
  if (!mark) return;
  const sag = markSagMetres(m.ball.pos, mark.pos, p.pos, p.topSpeed);
  const base = baseMarkDist(m, t.side as 0 | 1, markIdx, t.genome.markingAggression);
  const sagged = base + markSagWeight(t.genome) * sag;
  acc.samples += 1;
  acc.sumBase += base;
  acc.sumSagged += sagged;
  if (sag > 0) { acc.slackPositive += 1; acc.sumSagPositive += sag; }
  if (sagged > base + 1e-12) acc.saggedGtBase += 1;
  if (sagged < base - 1e-12) acc.tightened += 1;
  if (sag > acc.maxSag) acc.maxSag = sag;
};
const sagSummary = (a: SagAcc) => ({
  samples: a.samples,
  slackPositive: a.slackPositive,
  slackNonPositive: a.samples - a.slackPositive,
  saggedGtBase: a.saggedGtBase,
  tightened: a.tightened,
  meanBaseMarkDist: round(a.sumBase / Math.max(1, a.samples)),
  meanSaggedMarkDist: round(a.sumSagged / Math.max(1, a.samples)),
  /** MT-T1's F-MT-a limb read THIS; here it is REPORTED: mean sag over slack-positive ticks. */
  meanSagOnSlackPositive: round(a.sumSagPositive / Math.max(1, a.slackPositive)),
  meanSagAllTicks: round(a.sumSagPositive / Math.max(1, a.samples)),
  maxSag: round(a.maxSag),
});
const mergeSag = (into: SagAcc, from: SagAcc): void => {
  into.samples += from.samples; into.slackPositive += from.slackPositive;
  into.saggedGtBase += from.saggedGtBase; into.tightened += from.tightened;
  into.sumBase += from.sumBase; into.sumSagged += from.sumSagged;
  into.sumSagPositive += from.sumSagPositive;
  into.maxSag = Math.max(into.maxSag, from.maxSag);
};

interface BodyAcc {
  ticks: number;
  detach: number[]; distToSend: number[];
  bodyLatGap: number[]; shortfall: number[];
  askLatGap: number[]; askLatGapUnmod: number[]; askShiftY: number[];
  markTicks: number; markFarSideTicks: number; distToMark: number[]; markLatGap: number[];
  steer: Map<SteerOwner, number>;
  materialTicks: number[]; materialMark: number[]; materialStation: number[]; materialOther: number[];
}
const newBodyAcc = (): BodyAcc => ({
  ticks: 0, detach: [], distToSend: [], bodyLatGap: [], shortfall: [],
  askLatGap: [], askLatGapUnmod: [], askShiftY: [],
  markTicks: 0, markFarSideTicks: 0, distToMark: [], markLatGap: [],
  steer: new Map(),
  materialTicks: ASK_MATERIAL_LADDER.map(() => 0),
  materialMark: ASK_MATERIAL_LADDER.map(() => 0),
  materialStation: ASK_MATERIAL_LADDER.map(() => 0),
  materialOther: ASK_MATERIAL_LADDER.map(() => 0),
});

interface EpisodeBody {
  detachMean: number; detachMax: number; distToSendMean: number;
  bodyLatGapMean: number; shortfallMean: number;
  askLatGapMean: number; askLatGapUnmodMean: number; askShiftYMean: number;
  markShare: number; markFarSideShare: number; distToMarkMean: number; markLatGapMean: number;
  steerMix: Record<string, number>;
}
const summarise = (a: BodyAcc): EpisodeBody => ({
  detachMean: mean(a.detach), detachMax: a.detach.length === 0 ? Number.NaN : Math.max(...a.detach),
  distToSendMean: mean(a.distToSend),
  bodyLatGapMean: mean(a.bodyLatGap), shortfallMean: mean(a.shortfall),
  askLatGapMean: mean(a.askLatGap), askLatGapUnmodMean: mean(a.askLatGapUnmod),
  askShiftYMean: mean(a.askShiftY),
  markShare: a.markTicks / Math.max(1, a.ticks),
  markFarSideShare: a.markTicks === 0 ? Number.NaN : a.markFarSideTicks / a.markTicks,
  distToMarkMean: mean(a.distToMark), markLatGapMean: mean(a.markLatGap),
  steerMix: Object.fromEntries([...a.steer.entries()].sort().map(([k, v]) => [k, v / Math.max(1, a.ticks)])),
});

interface Episode {
  seed: number; arm: ArmId; startTick: number; ticks: number; simSeconds: number;
  defSide: Side; flankSign: 1 | -1; weakIdx: 3 | 4;
  weak: EpisodeBody; ballSide: EpisodeBody;
}
interface GuardRow {
  spreadYOut: number; spreadYIn: number; spacingMedian: number; spacingUnder4: number;
  dupRunShare: number;
  offsides: number; fouls: number; penalties: number;
  thirdMan: number; overlaps: number; forwardPassShare: number;
  goals: number; crosses: number; headers: number; longBalls: number; cutbacks: number;
}
interface MatchWalk {
  seed: number; arm: ArmId; episodes: Episode[];
  triggerTicks: number; playedTicks: number; excludedShort: number; excludedSentOff: number;
  guards: GuardRow;
  swallow: { material: number[]; mark: number[]; station: number[]; other: number[] };
  sagAll: SagAcc; sagWeak: SagAcc;
  readOnly: boolean; eyeNull: boolean;
}

function walkMatch(arm: ArmId, seed: number): MatchWalk {
  const m = matchOf(seed, arm);
  const readOnly = m.abandonRestDesignation === null && m.homeRegionGrant === null && m.homeMapGrant === null;
  const eyeNull = m.stationEye === null;
  const episodes: Episode[] = [];
  let triggerTicks = 0; let playedTicks = 0; let excludedShort = 0; let excludedSentOff = 0;

  // --- episode state (the ruler's, verbatim) ---
  let openKey: string | null = null;
  let startTick = 0; let ticks = 0; let sentOffSeen = false;
  let defSide: Side = 0; let flankSign: 1 | -1 = 1; let weakIdx: 3 | 4 = 3; let ballIdx: 3 | 4 = 4;
  let weakAcc = newBodyAcc(); let ballAcc = newBodyAcc();
  const swallow = {
    material: ASK_MATERIAL_LADDER.map(() => 0), mark: ASK_MATERIAL_LADDER.map(() => 0),
    station: ASK_MATERIAL_LADDER.map(() => 0), other: ASK_MATERIAL_LADDER.map(() => 0),
  };
  // --- the SAG census: match-wide (MT-T0's layer) + the WEAK-SIDE BACK in-trigger layer
  //     (the body the knee's limb (c) reads — MT-T1's ⚠ #203 correction binds: this weak
  //     layer samples EVERY in-trigger tick, only the match-wide layer runs at cadence 15) ---
  const sagAll = newSagAcc(); const sagWeak = newSagAcc();

  // --- whole-match guard accumulators (the P3′ / B1-a instrument forms) ---
  const pairs: [number[], number[]] = [[], []];
  const runTicks = [0, 0]; const dupTicks = [0, 0];
  const spreadOut: [number[], number[]] = [[], []];
  const spreadIn: [number[], number[]] = [[], []];
  let samples = 0; let tick = 0;

  const closeEpisode = (): void => {
    if (openKey === null) return;
    if (ticks < MIN_EPISODE_TICKS) excludedShort += 1;
    else if (sentOffSeen || weakAcc.ticks === 0 || ballAcc.ticks === 0) excludedSentOff += 1;
    else {
      episodes.push({
        seed, arm, startTick, ticks, simSeconds: ticks * DT, defSide, flankSign, weakIdx,
        weak: summarise(weakAcc), ballSide: summarise(ballAcc),
      });
      for (let i = 0; i < ASK_MATERIAL_LADDER.length; i++) {
        swallow.material[i] += weakAcc.materialTicks[i];
        swallow.mark[i] += weakAcc.materialMark[i];
        swallow.station[i] += weakAcc.materialStation[i];
        swallow.other[i] += weakAcc.materialOther[i];
      }
    }
    openKey = null;
  };

  while (!m.finished) {
    m.step(DT);
    tick += 1;
    if (m.finished) break;
    if (m.phase === 'playing') playedTicks += 1;

    /* ---------------- the #188 §1 TRIGGER, verbatim ---------------------- */
    const a = m.possessionSide;
    const owner = m.ball.owner;
    const inTrigger = m.phase === 'playing' && m.restart === null && a !== -1
      && owner !== null && owner.side === a && owner.role !== 'GK'
      && m.teams[(1 - a) as Side].localX(m.ball.pos.x) < OWN_THIRD_LOCAL_X
      && Math.abs(m.ball.pos.y) >= FLANK_ABS_Y;

    if (inTrigger) {
      triggerTicks += 1;
      const d = (1 - a) as Side;
      const fs: 1 | -1 = m.ball.pos.y > 0 ? 1 : -1;
      const key = `${d}|${fs}`;
      if (openKey !== key) {
        closeEpisode();
        openKey = key; startTick = m.simTick; ticks = 0; sentOffSeen = false;
        defSide = d; flankSign = fs;
        weakIdx = fs > 0 ? 3 : 4; ballIdx = fs > 0 ? 4 : 3;
        weakAcc = newBodyAcc(); ballAcc = newBodyAcc();
      }
      ticks += 1;
      const dTeam = m.teams[d];
      const aTeam = m.teams[a as Side];
      const weak = dTeam.players[weakIdx];
      const mirror = dTeam.players[ballIdx];
      if (weak === undefined || mirror === undefined || weak.sentOff || mirror.sentOff) {
        sentOffSeen = true;
      } else {
        const observe = (p: Player, acc: BodyAcc, isWeak: boolean): void => {
          acc.ticks += 1;
          // §3.1 detachment — from the centroid of the REST of his outfield team
          let cx = 0; let cy = 0; let n = 0;
          for (const q of dTeam.players) {
            if (q === p || q.role === 'GK' || q.sentOff) continue;
            cx += q.pos.x; cy += q.pos.y; n += 1;
          }
          acc.detach.push(n === 0 ? Number.NaN : Math.hypot(p.pos.x - cx / n, p.pos.y - cy / n));

          // §3.2 THE SEND (the ASK) — a RECOMPUTED COUNTERFACTUAL STATION READ, exactly as
          // the ruler's ⚠ CORRECTION (#197-L6) states: the probe calls `formationSpot`
          // itself with `pmMover = true` (the same ARGUMENT actionExecutor.ts :145/:336
          // pass); on markStance ticks the executor never calls it at all.
          // ⚠ THE CONTROL ARM: `formationSpot`'s PM branch reads the GENE
          // (`pmLaneConvergenceK`), not the MatchConfig flag — so at ABSENT the modulated and
          // unmodulated reads are IDENTICAL BY CONSTRUCTION (k_PM = 0) and every ask quantity,
          // including the swallow share, is degenerate there. All FOUR dosed arms carry BOTH
          // genes, so (unlike MT-T1's MT-only arms) the ask is live at every dosed arm.
          const askMod = formationSpot(p, dTeam, m.ball, false, aTeam, false, true);
          const askUnmod = formationSpot(p, dTeam, m.ball, false, aTeam, false, false);
          acc.distToSend.push(Math.hypot(p.pos.x - askMod.x, p.pos.y - askMod.y));
          acc.askLatGap.push(Math.abs(askMod.y - m.ball.pos.y));
          acc.askLatGapUnmod.push(Math.abs(askUnmod.y - m.ball.pos.y));
          const shiftY = Math.abs(askMod.y - askUnmod.y);
          acc.askShiftY.push(shiftY);

          // §3.3 the ANSWER (the BODY) — ⭐ THE GATED QUANTITY OF THIS EXAM
          const bodyGap = Math.abs(p.pos.y - m.ball.pos.y);
          acc.bodyLatGap.push(bodyGap);
          acc.shortfall.push(Math.max(0, bodyGap - SPREAD_R));

          // D2 steer owner (NO switchKey anywhere — #188 §8.4 / map §5 trap 7)
          const markIdx = p.action.type === 'MarkOpponent' ? p.action.targetIdx : undefined;
          const marked = markIdx === undefined ? undefined : aTeam.players[markIdx];
          const steer: SteerOwner = p.action.type === 'MarkOpponent'
            ? (marked === undefined ? 'markFallback' : 'markStance')
            : STATION_HOME_ACTIONS.has(p.action.type) ? 'stationHome'
              : BALL_DIRECTED_ACTIONS.has(p.action.type) ? 'ballDirected' : 'other';
          acc.steer.set(steer, (acc.steer.get(steer) ?? 0) + 1);

          if (marked !== undefined && !marked.sentOff) {
            acc.markTicks += 1;
            acc.distToMark.push(Math.hypot(p.pos.x - marked.pos.x, p.pos.y - marked.pos.y));
            acc.markLatGap.push(Math.abs(marked.pos.y - m.ball.pos.y));
            if (Math.sign(marked.pos.y) === -flankSign) acc.markFarSideTicks += 1;
          }

          // ⭐ THE SAG-FIRED INSTRUMENT, weak-side-back layer: on the very ticks the BODY
          // contrast is built from, is the marker's stance actually sagged? (out of
          // possession + a resolvable mark — the seam's own conditions).
          if (isWeak && markIdx !== undefined && marked !== undefined) {
            sagObserve(sagWeak, m, dTeam as Team, p, markIdx);
          }

          // the REPORTED swallow share (PM-T1 §5.3's instrument, verbatim; NO gate reads it)
          if (isWeak) {
            for (let i = 0; i < ASK_MATERIAL_LADDER.length; i++) {
              if (shiftY < ASK_MATERIAL_LADDER[i]) continue;
              acc.materialTicks[i] += 1;
              if (steer === 'markStance') acc.materialMark[i] += 1;
              else if (steer === 'stationHome' || steer === 'markFallback') acc.materialStation[i] += 1;
              else acc.materialOther[i] += 1;
            }
          }
        };
        observe(weak, weakAcc, true);
        observe(mirror, ballAcc, false);
      }
    } else {
      closeEpisode();
    }

    /* -------- the MATCH-WIDE SAG census (MT-T0's `stanceCensus`, same cadence) -- */
    if (tick % SAG_SAMPLE_EVERY === 0 && m.phase === 'playing') {
      for (const t of m.teams) {
        if (m.possessionSide === t.side) continue; // the seam is out-of-possession only
        for (const p of t.players) {
          if (p.sentOff || p.action.type !== 'MarkOpponent') continue;
          const mi = p.action.targetIdx;
          if (mi === undefined) continue;
          sagObserve(sagAll, m, t as Team, p, mi);
        }
      }
    }

    /* ---------------- the whole-match GUARDS (B1-a + P3′ forms) ---------- */
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const opp = m.teams[1 - side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      const hasBall = m.possessionSide === side;
      (hasBall ? spreadIn : spreadOut)[side].push(sd(outfield.map((p) => p.pos.y)));
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
        }
      }
      const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
      const liveCorner = m.restart?.kind === 'corner' && m.restart.side === side;
      const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
        && t.arriver !== p.index && t.overlapper !== p.index
        && !((crashLive || liveCorner) && t.runners.has(p.index)));
      if (runners.length >= 2) {
        runTicks[side] += 1;
        const targets = runners.map((p) => runTarget(p, t as Team, opp.players));
        let dup = false;
        for (let i = 0; i < targets.length && !dup; i++) {
          for (let j = i + 1; j < targets.length && !dup; j++) {
            if (dist2(targets[i], targets[j]) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) dupTicks[side] += 1;
      }
    }
  }
  closeEpisode();

  const bothPairs = [...pairs[0], ...pairs[1]];
  const st = [m.teams[0].stats, m.teams[1].stats];
  const passes = st[0].passes + st[1].passes;
  const guards: GuardRow = {
    spreadYOut: mean([...spreadOut[0], ...spreadOut[1]]),
    spreadYIn: mean([...spreadIn[0], ...spreadIn[1]]),
    spacingMedian: quantile(bothPairs, 0.5),
    spacingUnder4: bothPairs.length === 0 ? Number.NaN
      : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length,
    dupRunShare: (runTicks[0] + runTicks[1]) === 0 ? Number.NaN
      : (dupTicks[0] + dupTicks[1]) / (runTicks[0] + runTicks[1]),
    offsides: st[0].offsides + st[1].offsides,
    fouls: st[0].fouls + st[1].fouls,
    penalties: st[0].penalties + st[1].penalties,
    thirdMan: st[0].thirdMan + st[1].thirdMan,
    overlaps: st[0].overlaps + st[1].overlaps,
    forwardPassShare: passes === 0 ? Number.NaN : (st[0].passesForward + st[1].passesForward) / passes,
    goals: st[0].goals + st[1].goals,
    crosses: st[0].crosses + st[1].crosses,
    headers: st[0].headersWon + st[1].headersWon,
    longBalls: st[0].longBalls + st[1].longBalls,
    cutbacks: st[0].cutbacks + st[1].cutbacks,
  };
  return {
    seed, arm, episodes, triggerTicks, playedTicks, excludedShort, excludedSentOff,
    guards, swallow, sagAll, sagWeak, readOnly, eyeNull,
  };
}

/* ========================================================================== */
/* §10 THE PAIRED PER-SEED CONTRAST ENGINE (the ruler's, verbatim)            */
/* ========================================================================== */
interface Contrast {
  n: number; control: number; treated: number; point: number;
  lower: number; upper: number; resolved: boolean;
}
const EMPTY_CONTRAST: Contrast = {
  n: 0, control: Number.NaN, treated: Number.NaN, point: Number.NaN,
  lower: Number.NaN, upper: Number.NaN, resolved: false,
};
let bootOffset = 0;
const contrastOf = (ctrl: readonly number[], treat: readonly number[]): Contrast => {
  const ci: number[] = []; const ti: number[] = [];
  for (let i = 0; i < ctrl.length; i++) {
    if (Number.isFinite(ctrl[i]) && Number.isFinite(treat[i])) { ci.push(ctrl[i]); ti.push(treat[i]); }
  }
  const n = ci.length;
  if (n === 0) return { ...EMPTY_CONTRAST };
  const diffs = ti.map((v, i) => v - ci[i]);
  const point = mean(diffs);
  const rng = new Rng(BOOTSTRAP_SEED + (bootOffset += 1));
  const draws: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let s = 0;
    for (let k = 0; k < n; k++) s += diffs[Math.min(n - 1, Math.floor(rng.next() * n))];
    draws.push(s / n);
  }
  draws.sort((p, q) => p - q);
  const lower = pctlSorted(draws, 0.025); const upper = pctlSorted(draws, 0.975);
  return {
    n, control: round(mean(ci)), treated: round(mean(ti)), point: round(point),
    lower: round(lower), upper: round(upper), resolved: lower > 0 || upper < 0,
  };
};

/* ========================================================================== */
/* §11 N — DERIVED IN CODE, BEFORE A SINGLE BATTERY MATCH IS STEPPED          */
/* ========================================================================== */
const frozenNStar = (msPerMatch: number, msSource: string, pairYield: number, yieldSource: string) => {
  const halfWidth188 = (PUB188_ASK.hi - PUB188_ASK.lo) / 2;
  const sigmaPerSeed = (halfWidth188 / Z_975) * Math.sqrt(PUB188_ASK.clusters);
  const sigmaDelta = sigmaPerSeed * PAIRED_INFLATION;
  const pairsNeeded = Math.ceil(((Z_975 * sigmaDelta) / TARGET_HALFWIDTH_M) ** 2);
  const nRaw = Math.ceil(pairsNeeded / Math.max(1e-9, pairYield));
  const nStepped = Math.ceil(nRaw / N_STEP) * N_STEP;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * ARMS_COUNT * XDET_FACTOR));
  const terms = { precision: nStepped, wallBudget: nWall, reservedBandCap: N_CAP };
  const nStar = Math.min(nStepped, nWall, N_CAP);
  const bindingTerm = (Object.entries(terms).find(([, v]) => v === nStar) ?? ['none'])[0];
  return {
    arithmetic: 'pairsNeeded = ceil( (1.96·σ_delta / 0.5 m)² ) · '
      + 'N* = min( ceil(pairsNeeded / pairYield) rounded up to 25, '
      + 'floor( 2.0 h / (ms_per_match × 5 arms × 2 X-DET) ), 800 ) — frozen in stage doc §4',
    varianceSource: 'FARSIDE-DEFENDER-FORENSIC §8.3, prod world (the WIDEST of the four published '
      + 'worlds): weak-side back sendLatGapMean p50 19.86 [19.65, 20.04] over 700 per-seed '
      + 'clusters. σ_perSeed = (halfWidth / 1.96) · √700. NO SMOKE NUMBER FEEDS THIS TERM. '
      + '⚠ TWO DISCLOSED SUBSTITUTIONS: (a) a MEDIAN interval used as a mean\'s (inherited from '
      + 'PM-T1 §4 ⚠ #197-L4; direction CONSERVATIVE); (b) an ASK-metric variance applied to a '
      + 'BODY-metric gate (direction UNKNOWN — the achieved half-widths are PUBLISHED per arm '
      + 'and any shortfall is disclosed, never re-cut).',
    pub188: PUB188_ASK,
    pairsNeeded,
    pairYield: round(pairYield, 4), pairYieldSource: yieldSource,
    pairYieldNote: 'the trigger is rare and the arms diverge, so not every seed yields a PAIRED '
      + '(control, arm) BODY value. ⚠ DISCLOSED DIFFERENCE from the ruler: PM-T1 measured this '
      + 'yield on the ASK because the ask was its gated quantity; this exam measures it on the '
      + 'BODY, which is THIS exam\'s gated quantity. Same episodes, same pairing rule.',
    halfWidth188: round(halfWidth188), sigmaPerSeed: round(sigmaPerSeed),
    pairedInflation: round(PAIRED_INFLATION),
    pairedInflationNote: 'σ_delta = √2 · σ_perSeed — CONSERVATIVE: it treats the arms as '
      + 'INDEPENDENT, which over-states the variance of a paired same-seed delta.',
    targetHalfWidthM: TARGET_HALFWIDTH_M,
    msPerMatch: round(msPerMatch, 3), msPerMatchSource: msSource,
    nRaw, nStepped, nStep: N_STEP, nWall, nCap: N_CAP,
    capHonesty: 'N_CAP = 800 is the reserved battery band 12,420,200..12,420,999 — a SEED-BUDGET '
      + 'cap, not a statistical statement. If it binds, the achieved half-width may be wider than '
      + 'the 0.5 m target and that shortfall is DISCLOSED, never re-cut (the #188 §8.0 precedent). '
      + 'The achieved half-width of every body contrast is published in '
      + '`results.primary.achievedHalfWidthM`, so the shortfall (or its absence) is measured, not '
      + 'assumed.',
    terms, nStar, bindingTerm,
    projectedWallHours: round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 3),
  };
};

const nDerivation = ((): Record<string, unknown> & { n: number } => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke',
      note: 'SMOKE. N is fixed by stage doc §3 at 6 seeds (12,420,000..12,420,005). The §4 '
        + 'arithmetic does not select it: THE SMOKE ADJUDICATES NOTHING and may not tune any '
        + 'threshold; it exists to prove plumbing and to publish ms/match + the paired yield.',
      n: N_ENV ?? SMOKE_N,
      envOverride: N_ENV,
    };
  }
  let msPerMatch = PUB188_MS_PER_MATCH;
  let msSource = 'PUBLISHED PRIOR — FARSIDE-DEFENDER-FORENSIC §8.0 census cost 102.21 ms/match '
    + '(no committed smoke artifact found)';
  let pairYield = 1;
  let yieldSource = 'DEGENERATE PRIOR 1.0 (no committed smoke artifact found) — N is then stated '
    + 'in matches as if every seed paired, and the shortfall would be disclosed';
  let smokeSha: string | null = null;
  if (existsSync(SMOKE_PATH)) {
    const bytes = readFileSync(SMOKE_PATH);
    const smoke = JSON.parse(bytes.toString('utf8')) as {
      mode?: string; sizing?: { msPerMatch?: number; pairYieldMin?: number };
    };
    const v = smoke.sizing?.msPerMatch;
    const y = smoke.sizing?.pairYieldMin;
    if (smoke.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof y === 'number' && y > 0) {
      msPerMatch = v;
      pairYield = y;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      yieldSource = `the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N (the #188 §4.3 `
        + 'precedent): exactly two numbers are read out of it, ms/match and the MINIMUM paired-BODY '
        + 'yield over the four non-control arms. No level, share, rate, CI or threshold from it is '
        + 'read anywhere. ⚠ The probe reads the WORKING-TREE file at that path, not the committed '
        + 'blob — the provenance is sha-audited (this field), not git-enforced (PM-T1 §4 #197-L3).';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, pairYield, yieldSource);
  return {
    mode: 'full', smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, envOverride: N_ENV, n: N_ENV ?? derived.nStar,
  };
})();

/** ⭐ A full-mode `MTLAD_N` override is BY DEFINITION not the battery: `gNDerived` goes RED
 *  and the process exits 1. Such a run is therefore routed onto the EXIT-SEMANTICS
 *  sub-block, so it can never consume a battery seed. The battery itself always starts at
 *  `FULL_BASE` and can only be reached with NO override. */
const RUN_BASE = MODE === 'smoke' ? SMOKE_BASE
  : (N_ENV === null ? FULL_BASE : EXIT_CHECK_BLOCK[0]);
const RUN_N = nDerivation.n;

/* ========================================================================== */
/* §12 THE STARTUP BANNER — the derived N + the frozen predicates enforced    */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
banner('');
banner('=============================================================================');
banner(`MT-LADDER — THE DOSE LADDER · mode ${MODE} · N ${RUN_N} seeds × ${ARMS_COUNT} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
for (const s of ARMS) {
  banner(`  ${s.id.padEnd(9)} pmFlag ${String(s.pmFlag).padEnd(5)} mtFlag ${String(s.mtFlag).padEnd(5)}`
    + ` defLaneConvergence ${s.pmGene === null ? 'ABSENT' : s.pmGene}  markSag ${s.mtGene === null ? 'ABSENT' : s.mtGene}`);
}
banner(`ceilings      k_PM ≤ ${PM_LANE_CONVERGENCE_MAX} (PM-T0, not re-cut) · sag ≤ ${MARK_SAG_MAX} m,`
  + ` t_ball speed ${MARK_SAG_BALL_SPEED} m/s (MT-T0, not re-cut)`);
banner(`N derivation  ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
if (MODE === 'full') {
  banner(`              pairsNeeded ${nDerivation.pairsNeeded} / pairYield ${nDerivation.pairYield}`
    + ` = ${nDerivation.nRaw} → step ${nDerivation.nStepped} · wall ${nDerivation.nWall} · cap ${N_CAP}`
    + ` ⇒ N* ${nDerivation.nStar} (${String(nDerivation.bindingTerm)} binds; projected wall ${String(nDerivation.projectedWallHours)} h)`);
} else {
  banner('              ⚠ SMOKE — PLUMBING ONLY. It adjudicates NOTHING and tunes NO threshold;');
  banner('                it publishes exactly two sizing numbers (ms/match, min paired-BODY yield).');
}
banner('FROZEN PREDICATES ENFORCED THIS RUN (all contrasts paired per-seed vs the ABSENT control):');
banner('  ⭐ THE KNEE RULE (#209.2, frozen ex ante — coded exactly as ruled):');
banner('     QUALIFIES(d) := (a) the arm holds the equilibrium BAND on EVERY CONTROL-GATED');
banner('                         dimension (a dimension the CONTROL itself fails is EXCLUDED');
banner('                         as substrate drift — the inherited caveat)');
banner('                   ∧ (b) GUARD-NI passes');
banner('                   ∧ (c) bodyLatGap is RESOLVEDLY NEGATIVE  [CI_upper < 0]');
banner(`     KNEE := the LARGEST d ∈ {${LADDER_DOSES.join(', ')}} with QUALIFIES(d);`);
banner(`             if NO d ≥ ${KNEE_LADDER_MIN_ABOVE_FLOOR} qualifies ⇒ ${KNEE_FLOOR_DOSE} (the measured-healthy anchor, #208);`);
banner(`             if ALL qualify ⇒ ${KNEE_CEILING_DOSE}.`);
banner('     THERE IS NO STOP CLASS: every branch lands a dose. The knee is an EXHIBIT dose');
banner('     for the user\'s play-test verdict, NOT a ship decision (Road B binds).');
banner(`    GUARD-NI(a) := spreadY_out & spacingMedian CI_lower > −tol ∧ under4 & dupRun CI_upper < +tol,`);
banner(`                   tol = ${round(NI_FRACTION, 4)} × the CONTROL arm's own level, THIS run (S2 form, A4-S2P1 §4)`);
banner('  BODY (per arm, REPORTED in full): bodyLatGap · compressionShortfall · detachMean');
banner('  SAG CENSUS (REPORTED — no gate reads it here, unlike MT-T1\'s F-MT-a):');
banner(`     SAG-FIRED(arm) := saggedGtBase > 0 ∧ tightened = 0 ∧ meanSagOnSlackPositive ≥ ${SAG_MATERIAL_M} m`);
banner('  FLAG    := offsides — returns to the USER, NEVER flips PASS/FAIL (the #157 debt / F-S2d form)');
banner('  REPORTED, NO GATE: the swallow share · mark-assignment drift · the ask instruments');
banner('            (all four dosed arms carry BOTH genes, so the ask is LIVE at each; at ABSENT it');
banner('             is UNMODULATED BY CONSTRUCTION — formationSpot reads the GENE, which is absent)');
banner(`  CITED, NOT RE-RUN: dose ${CITED_TOP_DOSE} (#204, ${RULER_PATH}) and the drift dose (#208, ${COEVO_PATH})`);
banner('=============================================================================');
banner('');

/* ========================================================================== */
/* §13 THE CORE (run TWICE for X-DET)                                         */
/* ========================================================================== */
const PROGRESS_EVERY_MS = 30_000;
let lastProgress = Date.now();
const progress = (tag: string, done: number, total: number): void => {
  const now = Date.now();
  if (now - lastProgress < PROGRESS_EVERY_MS && done !== total) return;
  lastProgress = now;
  const el = (now - wall0) / 1000;
  const rate = done === 0 ? 0 : el / done;
  process.stderr.write(`  [mt-ladder ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(2)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

interface CoreOut {
  seeds: { base: number; n: number; first: number; last: number };
  perArm: Record<string, {
    matches: number; episodes: number; episodesPerMatch: number;
    triggerTickShare: number; excludedShort: number; excludedSentOff: number;
  }>;
  perSeed: Record<string, Record<string, number[]>>;
  guardSeries: Record<string, Record<string, number[]>>;
  swallow: Record<string, { material: number[]; mark: number[]; station: number[]; other: number[] }>;
  sag: Record<string, { matchWide: ReturnType<typeof sagSummary>; weakInTrigger: ReturnType<typeof sagSummary> }>;
  levels: Record<string, Record<string, unknown>>;
  receipts: unknown[];
  readOnly: boolean; eyeNull: boolean;
}

const EPI_KEYS = [
  'askLatGapMean', 'askLatGapUnmodMean', 'askShiftYMean',
  'bodyLatGapMean', 'shortfallMean', 'detachMean', 'distToSendMean',
  'markShare', 'markFarSideShare', 'distToMarkMean', 'markLatGapMean',
] as const;
const GUARD_KEYS = [
  'spreadYOut', 'spreadYIn', 'spacingMedian', 'spacingUnder4', 'dupRunShare',
  'offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps', 'forwardPassShare',
  'goals', 'crosses', 'headers', 'longBalls', 'cutbacks',
] as const;

const runCore = (tag: string): CoreOut => {
  const seeds = Array.from({ length: RUN_N }, (_, i) => RUN_BASE + i);
  const perArm = {} as CoreOut['perArm'];
  const perSeed = {} as CoreOut['perSeed'];
  const guardSeries = {} as CoreOut['guardSeries'];
  const swallowOut = {} as CoreOut['swallow'];
  const sagOut = {} as CoreOut['sag'];
  const levels = {} as CoreOut['levels'];
  const receipts: unknown[] = [];
  let readOnly = true; let eyeNull = true;
  let done = 0; const total = RUN_N * ARMS_COUNT;

  for (const arm of ARM_IDS) {
    const walks: MatchWalk[] = [];
    for (const seed of seeds) {
      walks.push(walkMatch(arm, seed));
      done += 1;
      progress(tag, done, total);
    }
    readOnly = readOnly && walks.every((w) => w.readOnly);
    eyeNull = eyeNull && walks.every((w) => w.eyeNull);
    const eps = walks.flatMap((w) => w.episodes);
    perArm[arm] = {
      matches: walks.length, episodes: eps.length,
      episodesPerMatch: round(eps.length / Math.max(1, walks.length), 4),
      triggerTickShare: round(walks.reduce((s, w) => s + w.triggerTicks, 0)
        / Math.max(1, walks.reduce((s, w) => s + w.playedTicks, 0))),
      excludedShort: walks.reduce((s, w) => s + w.excludedShort, 0),
      excludedSentOff: walks.reduce((s, w) => s + w.excludedSentOff, 0),
    };
    const bySeedEp: Record<string, number[]> = {};
    for (const k of EPI_KEYS) { bySeedEp[k] = []; bySeedEp[`mirror_${k}`] = []; }
    for (const w of walks) {
      for (const k of EPI_KEYS) {
        bySeedEp[k].push(mean(w.episodes.map((e) => e.weak[k]).filter(Number.isFinite)));
        bySeedEp[`mirror_${k}`].push(mean(w.episodes.map((e) => e.ballSide[k]).filter(Number.isFinite)));
      }
    }
    perSeed[arm] = bySeedEp;
    const bySeedGuard: Record<string, number[]> = {};
    for (const k of GUARD_KEYS) bySeedGuard[k] = walks.map((w) => w.guards[k]);
    guardSeries[arm] = bySeedGuard;
    swallowOut[arm] = {
      material: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.material[i], 0)),
      mark: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.mark[i], 0)),
      station: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.station[i], 0)),
      other: ASK_MATERIAL_LADDER.map((_, i) => walks.reduce((s, w) => s + w.swallow.other[i], 0)),
    };
    const allAcc = newSagAcc(); const weakAccAll = newSagAcc();
    for (const w of walks) { mergeSag(allAcc, w.sagAll); mergeSag(weakAccAll, w.sagWeak); }
    sagOut[arm] = { matchWide: sagSummary(allAcc), weakInTrigger: sagSummary(weakAccAll) };
    const lv: Record<string, unknown> = {};
    for (const k of EPI_KEYS) {
      const xs = eps.map((e) => e.weak[k]).filter(Number.isFinite);
      const mx = eps.map((e) => e.ballSide[k]).filter(Number.isFinite);
      lv[k] = {
        weak: { mean: round(mean(xs)), p50: round(quantile(xs, 0.5)), p90: round(quantile(xs, 0.9)), n: xs.length },
        mirror: { mean: round(mean(mx)), p50: round(quantile(mx, 0.5)), n: mx.length },
      };
    }
    const steerMix = new Map<string, number>();
    let steerTicks = 0;
    for (const e of eps) {
      for (const [k, v] of Object.entries(e.weak.steerMix)) steerMix.set(k, (steerMix.get(k) ?? 0) + v * e.ticks);
      steerTicks += e.ticks;
    }
    lv.steerMix = Object.fromEntries([...steerMix.entries()].sort((p, q) => q[1] - p[1])
      .map(([k, v]) => [k, round(v / Math.max(1, steerTicks), 5)]));
    lv.detachP90 = round(quantile(eps.map((e) => e.weak.detachMean).filter(Number.isFinite), 0.9));
    levels[arm] = lv;
    receipts.push(...[...eps].sort((p, q) => q.weak.detachMean - p.weak.detachMean).slice(0, 6).map((e) => ({
      arm, seed: e.seed, startTick: e.startTick, simSeconds: round(e.simSeconds, 3),
      defendingSide: e.defSide, flankSign: e.flankSign, weakSideSlot: e.weakIdx,
      askLatGap: round(e.weak.askLatGapMean, 3), askLatGapUnmodulated: round(e.weak.askLatGapUnmodMean, 3),
      bodyLatGap: round(e.weak.bodyLatGapMean, 3), detach: round(e.weak.detachMean, 3),
      distToSend: round(e.weak.distToSendMean, 3), markShare: round(e.weak.markShare, 4),
      steerMix: Object.fromEntries(Object.entries(e.weak.steerMix).map(([k, v]) => [k, round(v, 4)])),
      watchHint: `MT-T1 arm ${arm} (defLaneConvergence ${String(specOf(arm).pmGene)}, markSag `
        + `${String(specOf(arm).mtGene)}), seed ${e.seed}, from tick ${e.startTick} `
        + `(${round(e.startTick * DT, 2)} sim-s), defending side ${e.defSide}, ball flank `
        + `${e.flankSign > 0 ? '+y' : '-y'}, weak-side slot ${e.weakIdx}`,
    })));
  }
  return {
    seeds: { base: RUN_BASE, n: RUN_N, first: seeds[0], last: seeds[seeds.length - 1] },
    perArm, perSeed, guardSeries, swallow: swallowOut, sag: sagOut, levels, receipts, readOnly, eyeNull,
  };
};

const tCore = Date.now();
const coreA = runCore('pass1');
const passMs = Date.now() - tCore;
const coreB = runCore('pass2');
const digestA = sha(canonical(coreA));
const digestB = sha(canonical(coreB));
const xDet = digestA === digestB;
process.stderr.write(`  [mt-ladder] X-DET ${xDet ? 'PASS' : '*** FAIL ***'} (${digestA.slice(0, 12)} / ${digestB.slice(0, 12)})\n`);

/* ========================================================================== */
/* §14 THE FROZEN GATE ARITHMETIC                                             */
/* ========================================================================== */
const bodyKey = 'bodyLatGapMean';
const askKey = 'askLatGapMean';
const ctrlSeries = (k: string): number[] => coreA.perSeed[CONTROL_ARM][k];
const guardCtrl = (k: string): number[] => coreA.guardSeries[CONTROL_ARM][k];

/** ---- THE BODY (knee limb (c) reads bodyLatGap; shortfall/detach ride REPORTED) ---- */
const bodyContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(bodyKey), coreA.perSeed[a][bodyKey])])) as Record<string, Contrast>;
const shortfallContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('shortfallMean'), coreA.perSeed[a].shortfallMean)])) as Record<string, Contrast>;
const detachContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('detachMean'), coreA.perSeed[a].detachMean)])) as Record<string, Contrast>;

const fallsResolved = (c: Contrast): boolean => Number.isFinite(c.upper) && c.upper < 0;
const risesResolved = (c: Contrast): boolean => Number.isFinite(c.lower) && c.lower > 0;

/** The MT-T1 PRIMARY row, carried per DOSED ARM as a REPORTED read (it gates nothing here):
 *  the ladder's own gate is the knee, and the commander adjudicates from these rows (#203). */
const bodyPerArm = Object.fromEntries(DOSE_ARMS.map((a) => {
  const bodyFalls = fallsResolved(bodyContrasts[a]);
  const shortfallFalls = fallsResolved(shortfallContrasts[a]);
  const detachNotUp = !risesResolved(detachContrasts[a]);
  return [a, {
    bodyFalls, shortfallFalls, detachNotUp,
    mtT1PrimaryShape: bodyFalls && shortfallFalls && detachNotUp,
  }];
}));

/** achieved precision, published (the N-rule substitution disclosure, §4) */
const achievedHalfWidth = Object.fromEntries(DOSE_ARMS.map((a) => {
  const c = bodyContrasts[a];
  return [a, round((c.upper - c.lower) / 2)];
}));

/** ---- SAG-FIRED — REPORTED here (MT-T1's F-MT-a limb; NO gate reads it) ---- */
const sagFired = Object.fromEntries(ARM_IDS.map((a) => {
  const s = coreA.sag[a].weakInTrigger;
  const fired = s.saggedGtBase > 0 && s.tightened === 0
    && Number.isFinite(s.meanSagOnSlackPositive) && s.meanSagOnSlackPositive >= SAG_MATERIAL_M;
  return [a, { fired, weakInTrigger: s, matchWide: coreA.sag[a].matchWide }];
}));

/** ---- the BODY-MOVING arms — REPORTED (MT-T1's F-MT-b/c scope; no STOP here) ---- */
const bodyMovingArms = DOSE_ARMS.filter((a) => fallsResolved(bodyContrasts[a]));

/** ---- the equilibrium BAND, per arm, with the substrate-drift exclusion ---- */
const bandRow = (arm: ArmId) => Object.fromEntries(BAND_KEYS.map((k) => {
  const lvl = mean(coreA.guardSeries[arm][k].filter(Number.isFinite));
  const lo = BAND_BASELINE[k] * (1 - BAND_TOLERANCE[k]);
  const hi = BAND_BASELINE[k] * (1 + BAND_TOLERANCE[k]);
  return [k, { level: round(lvl), lo: round(lo), hi: round(hi), inBand: lvl >= lo && lvl <= hi }];
})) as Record<BandKey, { level: number; lo: number; hi: number; inBand: boolean }>;
const bandControl = bandRow(CONTROL_ARM);
const bandExcluded = BAND_KEYS.filter((k) => !bandControl[k].inBand);
const bandGated = BAND_KEYS.filter((k) => bandControl[k].inBand);
const bandByArm = Object.fromEntries(ARM_IDS.map((a) => {
  const row = bandRow(a);
  const failed = bandGated.filter((k) => !row[k].inBand);
  return [a, { row, failedGatedDimensions: failed, pass: failed.length === 0 }];
}));

/** ---- GUARD-NI (the PM-T1 §5.4 form, tolerance INHERITED, scale THIS run) -- */
type GuardLimb = { key: string; direction: 'floor' | 'ceiling' };
const GUARD_LIMBS: readonly GuardLimb[] = [
  { key: 'spreadYOut', direction: 'floor' },
  { key: 'spacingMedian', direction: 'floor' },
  { key: 'spacingUnder4', direction: 'ceiling' },
  { key: 'dupRunShare', direction: 'ceiling' },
];
const guardNI = Object.fromEntries(DOSE_ARMS.map((a) => {
  const limbs = GUARD_LIMBS.map((l) => {
    const c = contrastOf(guardCtrl(l.key), coreA.guardSeries[a][l.key]);
    const tol = NI_FRACTION * Math.abs(c.control);
    const pass = l.direction === 'floor'
      ? Number.isFinite(c.lower) && c.lower > -tol
      : Number.isFinite(c.upper) && c.upper < tol;
    return { ...l, contrast: c, tolerance: round(tol), pass };
  });
  return [a, { limbs, pass: limbs.every((l) => l.pass) }];
})) as Record<string, { limbs: { key: string; direction: string; contrast: Contrast; tolerance: number; pass: boolean }[]; pass: boolean }>;

/* -------------------------------------------------------------------------- */
/* ⭐ THE KNEE — ruling #209.2, coded EXACTLY as frozen ex ante                */
/* -------------------------------------------------------------------------- */
/**
 * "the play-test dose = the LARGEST dose d whose arm (a) holds the band on EVERY gated
 *  dimension (control-gated, the inherited caveat), (b) passes GUARD-NI, and (c) has a
 *  resolvedly negative bodyLatGap. If no dose ≥ 0.4 qualifies, the entry builds at 0.2
 *  (the measured-healthy anchor); if ALL qualify, 0.8."
 *
 * Every branch lands a dose ⇒ there is NO STOP class and no exit 2. The rule was frozen
 * BEFORE any full-N number existed, so no branch can be chosen after sight.
 */
const kneeRows = LADDER_DOSES.map((d) => {
  const arm = ARM_OF_DOSE[d];
  const bandHolds = bandByArm[arm].pass;                 // (a) control-gated band
  const guardHolds = guardNI[arm].pass;                  // (b) GUARD-NI
  const bodyNegative = fallsResolved(bodyContrasts[arm]); // (c) resolvedly negative bodyLatGap
  return {
    dose: d, arm,
    bandHoldsOnGatedDimensions: bandHolds,
    failedGatedBandDimensions: bandByArm[arm].failedGatedDimensions,
    guardNiPasses: guardHolds,
    bodyLatGapResolvedlyNegative: bodyNegative,
    bodyLatGap: bodyContrasts[arm],
    qualifies: bandHolds && guardHolds && bodyNegative,
  };
});
const qualifyingDoses = kneeRows.filter((r) => r.qualifies).map((r) => r.dose);
const qualifyingAtOrAboveFloor = qualifyingDoses.filter((d) => d >= KNEE_LADDER_MIN_ABOVE_FLOOR);
const allQualify = qualifyingDoses.length === LADDER_DOSES.length;
const kneeBranch: 'ALL_QUALIFY' | 'LARGEST_QUALIFYING' | 'NONE_ABOVE_FLOOR' = allQualify
  ? 'ALL_QUALIFY'
  : (qualifyingAtOrAboveFloor.length > 0 ? 'LARGEST_QUALIFYING' : 'NONE_ABOVE_FLOOR');
const KNEE_DOSE = kneeBranch === 'ALL_QUALIFY' ? KNEE_CEILING_DOSE
  : kneeBranch === 'LARGEST_QUALIFYING' ? Math.max(...qualifyingAtOrAboveFloor)
    : KNEE_FLOOR_DOSE;
const kneeResult = {
  rule: 'the play-test dose = the LARGEST dose d whose arm (a) holds the band on EVERY gated '
    + 'dimension (control-gated, the inherited substrate-drift caveat), (b) passes GUARD-NI, and '
    + '(c) has a resolvedly negative bodyLatGap. If no dose ≥ 0.4 qualifies, the entry builds at '
    + '0.2 (the measured-healthy anchor); if ALL qualify, 0.8. — ruling #209.2, frozen ex ante.',
  ladderDoses: [...LADDER_DOSES],
  rows: kneeRows,
  qualifyingDoses,
  qualifyingDosesAtOrAboveFloor: qualifyingAtOrAboveFloor,
  branch: kneeBranch,
  branchNote: kneeBranch === 'ALL_QUALIFY'
    ? 'ALL four doses qualify ⇒ the rule\'s "if ALL qualify, 0.8" branch (which is also the '
      + 'largest qualifying dose — the two agree by construction).'
    : kneeBranch === 'LARGEST_QUALIFYING'
      ? 'at least one dose ≥ 0.4 qualifies ⇒ the LARGEST such dose.'
      : 'NO dose ≥ 0.4 qualifies ⇒ the pre-registered fallback: 0.2, the measured-healthy anchor '
        + '(#208). ⚠ This branch fires REGARDLESS of whether 0.2 itself qualifies on this run — '
        + 'that is what the rule says, and the 0.2 row is published either way.',
  kneeDose: KNEE_DOSE,
  exhibitOnly: 'THE KNEE IS AN EXHIBIT DOSE for the user\'s play-test verdict (the density-verdict '
    + 'precedent), NOT a ship decision. Road B binds until the play-test rules: both seams stay '
    + 'BANKED-DORMANT and src/** is untouched.',
  adjudicationNote: 'ADJUDICATE FROM THE PER-ARM ROWS (#203), never from the knee line alone: the '
    + 'rule is a MAXIMUM over a three-limb conjunction, so a dose can fail on ONE limb (e.g. one '
    + 'band dimension) and that is invisible in the knee number.',
};

/** ---- the #157 instrument debt: FLAG + REPORTED counters ------------------ */
const debtKeys = ['offsides', 'fouls', 'penalties', 'thirdMan', 'overlaps', 'forwardPassShare'] as const;
const instrumentDebt = Object.fromEntries(debtKeys.map((k) => [k,
  Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(guardCtrl(k), coreA.guardSeries[a][k])])),
]));
const offsideByArm = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(guardCtrl('offsides'), coreA.guardSeries[a].offsides)]));
const OFFSIDE_FLAG = DOSE_ARMS.some((a) => risesResolved(offsideByArm[a]));

/** ---- REPORTED (no gate): the ASK instruments ------------------------------ */
const askContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(askKey), coreA.perSeed[a][askKey])])) as Record<string, Contrast>;
const askShiftContrasts = Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries('askShiftYMean'), coreA.perSeed[a].askShiftYMean)])) as Record<string, Contrast>;

/** ---- REPORTED (no gate): the swallow share ------------------------------- */
const swallowShare = Object.fromEntries(ARM_IDS.map((a) => {
  const s = coreA.swallow[a];
  return [a, ASK_MATERIAL_LADDER.map((cut, i) => ({
    materialCutM: cut, materialTicks: s.material[i],
    markStanceShare: s.material[i] === 0 ? Number.NaN : round(s.mark[i] / s.material[i]),
    stationWalkShare: s.material[i] === 0 ? Number.NaN : round(s.station[i] / s.material[i]),
    otherShare: s.material[i] === 0 ? Number.NaN : round(s.other[i] / s.material[i]),
  }))];
}));

/** ---- REPORTED (no gate): mark-assignment drift, the map §2.4 channel ------ */
const markDrift = Object.fromEntries(['markShare', 'markFarSideShare', 'distToMarkMean', 'markLatGapMean']
  .map((k) => [k, Object.fromEntries(DOSE_ARMS.map((a) => [a, contrastOf(ctrlSeries(k), coreA.perSeed[a][k])]))]));

/* ========================================================================== */
/* §15 THE X-FAMILY GATES                                                     */
/* ========================================================================== */
/** G-CTRLEQ: the ARMED-ZERO world (BOTH flags on, BOTH genes absent) ≡ the ABSENT control
 *  (both flags off), whole-run signature with the rng stream included, first min(8, N)
 *  seeds. ⚠ SEMANTICS, exactly (#194): THE TWO WORLDS DIFFER IN CODE PATH — armed ⇒
 *  `pmMover` and `mtSag` are true ⇒ BOTH seam branches are ENTERED (on every defensive
 *  mover read and on every out-of-possession marker tick) and BOTH weights evaluate to 0.
 *  So this re-proves, inside THIS stage's own world, that the born-absent reads are inert
 *  THROUGH THE LIVE BRANCHES (PM-T0 G-BORN + MT-T0 G-BORN, jointly).
 *  ⚠ DECLARED DIFFERENCE FROM THE RULER: in MT-T1 armed-zero was an ARM of the battery; the
 *  ladder's five arms are the control plus the four doses (#209.1), so armed-zero is built
 *  HERE, as a GATE WORLD only. It contributes NO measured quantity. */
const armedZeroMatch = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
  ...PERCEPT_FLAGS, pmLaneConvergence: true, mtMarkSag: true,
} as ConstructorParameters<typeof Match>[0]);
const CTRLEQ_SEEDS = Math.min(8, RUN_N);
const ctrlEq = (() => {
  const rows: { seed: number; identical: boolean }[] = [];
  for (let i = 0; i < CTRLEQ_SEEDS; i++) {
    const seed = RUN_BASE + i;
    const a = matchOf(seed, CONTROL_ARM); while (!a.finished) a.step(DT);
    const b = armedZeroMatch(seed); while (!b.finished) b.step(DT);
    rows.push({ seed, identical: signature(a) === signature(b) });
  }
  return { pass: rows.every((r) => r.identical), seeds: CTRLEQ_SEEDS, rows };
})();

/** G-ARM: BOTH #196.3-D4 ARMING CHECKLISTS, asserted per arm. */
const armCheck = (() => {
  const rows = ARM_IDS.map((arm) => {
    const s = specOf(arm);
    const m = matchOf(RESERVED_BAND[1], arm); // CONSTRUCTION ONLY — never stepped
    const pmViews = m.teams.map((t) => [
      (t.info.genome as TacticalGenome).defLaneConvergence ?? null,
      (t.baseGenome as TacticalGenome).defLaneConvergence ?? null,
      (t.effGenome as TacticalGenome).defLaneConvergence ?? null,
    ]);
    const mtViews = m.teams.map((t) => [
      (t.info.genome as TacticalGenome).markSag ?? null,
      (t.baseGenome as TacticalGenome).markSag ?? null,
      (t.effGenome as TacticalGenome).markSag ?? null,
    ]);
    const kPm = m.teams.map((t) => round(pmLaneConvergenceK(t.effGenome as TacticalGenome), 8));
    const wPm = round(s.pmGene === null ? 0 : s.pmGene * PM_LANE_CONVERGENCE_MAX, 8);
    const wMt = m.teams.map((t) => round(markSagWeight(t.effGenome as TacticalGenome), 8));
    const wMtWant = round(s.mtGene === null ? 0 : s.mtGene, 8);
    return {
      arm, pmGene: s.pmGene, mtGene: s.mtGene,
      pmFlag: m.pmLaneConvergence === true, pmFlagExpected: s.pmFlag,
      mtFlag: m.mtMarkSag === true, mtFlagExpected: s.mtFlag,
      pmGeneOnAllViews: pmViews.every((v) => v.every((x) => x === s.pmGene)),
      mtGeneOnAllViews: mtViews.every((v) => v.every((x) => x === s.mtGene)),
      kPm, kPmExpected: wPm, kPmCorrect: kPm.every((k) => k === wPm),
      markSagWeight: wMt, markSagWeightExpected: wMtWant, markSagWeightCorrect: wMt.every((w) => w === wMtWant),
      bothTeamsDosed: DOSE_BOTH_TEAMS,
      pass: m.pmLaneConvergence === s.pmFlag && m.mtMarkSag === s.mtFlag
        && pmViews.every((v) => v.every((x) => x === s.pmGene))
        && mtViews.every((v) => v.every((x) => x === s.mtGene))
        && kPm.every((k) => k === wPm) && wMt.every((w) => w === wMtWant),
    };
  });
  // BOTH evolution opt-in channels are LIVE (the PM-T0 / MT-T0 `optInDraws` evidence form)
  const rngPm = new Rng(770_101); const rngMt = new Rng(770_101); const rngOff = new Rng(770_101);
  let gPm = randomGenome(new Rng(11)); let gMt = randomGenome(new Rng(11)); let gOff = randomGenome(new Rng(11));
  for (let i = 0; i < 4; i++) {
    gPm = mutateGenome(gPm, rngPm, { rate: 0.45, scale: 0.14, evolveDefLaneConvergence: true });
    gMt = mutateGenome(gMt, rngMt, { rate: 0.45, scale: 0.14, evolveMarkSag: true });
    gOff = mutateGenome(gOff, rngOff, { rate: 0.45, scale: 0.14 });
  }
  const pmOptInLive = gPm.defLaneConvergence !== undefined && gOff.defLaneConvergence === undefined;
  const mtOptInLive = gMt.markSag !== undefined && gOff.markSag === undefined;
  return {
    pass: rows.every((r) => r.pass) && pmOptInLive && mtOptInLive,
    pmOptInLive, mtOptInLive, rows,
    semantics: 'BOTH ARMING CHECKLISTS (#196.3-D4): each arm\'s two flags are exactly as frozen, '
      + 'each gene is written on all three genome views of BOTH teams (the a4World armGenes idiom — '
      + 'the REAL gene channel, #196.3-D6: this exam adds NO engine-side dose surface), the two '
      + 'expressed weights (k_PM, markSagWeight) equal their frozen values exactly, and BOTH '
      + 'evolution opt-in channels are shown LIVE (mutateGenome writes each key with its own '
      + 'opt-in and leaves it absent without). This exam is FIXED-DOSE, so the opt-ins are not '
      + 'exercised — asserted, not implied.',
  };
})();

/** G-INHERIT: ⭐ THE RULER IS INHERITED, NOT RE-IMPLEMENTED. Every quantity this exam
 *  gates or reports on is defined by a line that must still exist VERBATIM in the ruler's
 *  own probe (or, for the sag replica and its anchor, in MT-T0's probe / the engine).
 *  A silent definitional drift is therefore impossible: the gate goes RED. */
const INHERIT_PINS: readonly { file: string; line: string; what: string }[] = [
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const OWN_THIRD_LOCAL_X = -HALF_L / 3;', what: 'the #188 trigger own-third cut' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const FLANK_ABS_Y = BOX_WIDTH / 2;', what: 'the #188 trigger flank cut' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const MIN_EPISODE_TICKS = 30;', what: 'the episode floor' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const SPREAD_R = 9;', what: 'the compression yardstick' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const ASK_MATERIAL_M = 1.0;', what: 'the swallow materiality cut (no gate reads it)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const NI_FRACTION = 1 - 0.275 / 0.380;', what: 'the S2 non-inferiority fraction' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const DUP_RUN_M = 4;', what: 'the P3′ duplicate-run radius' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: 'const PAIR_SUBSAMPLE = 6;', what: 'the P3′ pair subsample' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,', what: 'the equilibrium band baselines (incl. goals)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,', what: 'the equilibrium band tolerances' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          const bodyGap = Math.abs(p.pos.y - m.ball.pos.y);', what: 'THE GATED QUANTITY: bodyLatGap' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          acc.shortfall.push(Math.max(0, bodyGap - SPREAD_R));', what: 'THE GATED QUANTITY: compressionShortfall' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          acc.detach.push(n === 0 ? Number.NaN : Math.hypot(p.pos.x - cx / n, p.pos.y - cy / n));', what: 'THE GATED QUANTITY: detachment' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          const askMod = formationSpot(p, dTeam, m.ball, false, aTeam, false, true);', what: 'the REPORTED ask (modulated station read)' },
  { file: 'scripts/probes/pm-t1-compression-exam.ts', line: '          const askUnmod = formationSpot(p, dTeam, m.ball, false, aTeam, false, false);', what: 'the REPORTED ask (unmodulated station read)' },
  { file: 'scripts/probes/mt-t0-mark-sag.ts', line: '  let d = m.ball.owner === mark ? 2.6 : 2.6 - aggression * 1.4;', what: 'the MT-T0 base-stance replica, floor line' },
  { file: 'scripts/probes/mt-t0-mark-sag.ts', line: '  ) d = Math.max(d, 2.6 - aggression * 0.6);', what: 'the MT-T0 base-stance replica, stand-off line' },
  { file: 'src/ai/actionExecutor.ts', line: '        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;', what: '⭐ THE SAG_MATERIAL_M ANCHOR: markingAggression\'s own 1.4 m stance band' },
  { file: 'src/ai/actionExecutor.ts', line: '          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);', what: 'the MT-T0 seam line itself' },
  // ⭐ THE IMMEDIATE RULER — MT-T1's own battery, whose instrument set, band, guard and N rule
  //    this stage carries verbatim. If MT-T1 moves, this gate goes RED.
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: 'const SPREAD_R = 9;', what: 'MT-T1: the compression yardstick as re-run' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: 'const NI_FRACTION = 1 - 0.275 / 0.380;', what: 'MT-T1: the S2 non-inferiority fraction as re-run' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: '  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,', what: 'MT-T1: the band baselines (incl. goals) as re-run' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: '  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,', what: 'MT-T1: the band tolerances as re-run' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: 'const SAG_MATERIAL_M = 1.4;', what: 'MT-T1: the traced material-sag threshold (REPORTED here, no gate reads it)' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: 'const PUB188_ASK = { p50: 19.86, lo: 19.65, hi: 20.04, clusters: 700 } as const;', what: 'MT-T1: the SMOKE-FREE variance term of the frozen N rule' },
  { file: 'scripts/probes/mt-t1-ruler-rerun.ts', line: '  const pairsNeeded = Math.ceil(((Z_975 * sigmaDelta) / TARGET_HALFWIDTH_M) ** 2);', what: 'MT-T1: the frozen N-rule precision term' },
];
const inheritCheck = (() => {
  const cache = new Map<string, string>();
  const rows = INHERIT_PINS.map((pin) => {
    let src = cache.get(pin.file);
    if (src === undefined) {
      src = existsSync(pin.file) ? readFileSync(pin.file, 'utf8') : '';
      cache.set(pin.file, src);
    }
    return { ...pin, found: src.includes(pin.line) };
  });
  return {
    pass: rows.every((r) => r.found),
    rows,
    semantics: 'THE RULER IS INHERITED, NOT RE-IMPLEMENTED. Because probe scripts execute on '
      + 'import (top-level side effects + process.exit), the instrument code cannot be imported '
      + 'from pm-t1-compression-exam.ts; it is carried here VERBATIM and this gate pins each '
      + 'defining line in its ORIGINAL file, the MT-T0 G-CONST idiom. If the ruler moves, this '
      + 'gate goes RED rather than the two exams drifting apart silently.',
    disclosedDifferences: [
      'ARMS: the control plus FOUR COUPLED DOSES (ABSENT · D02 · D04 · D06 · D08 — BOTH genes '
        + 'equal, BOTH seams fully armed) replace MT-T1\'s five flag/gene arms. The 2x2 seam '
        + 'decomposition (PM-alone / MT-alone) is therefore NOT re-measured here: this stage walks '
        + 'the COUPLED axis the user would play, which is what #209.1 dispatched.',
      'THERE IS NO GATED PRIMARY AND NO STOP CLASS. MT-T1\'s PRIMARY, F-MT-a, F-MT-b and F-MT-c '
        + 'do NOT exist here; their quantities all still run and are published PER ARM. The one '
        + 'decision rule is ⭐ THE KNEE (#209.2), whose three limbs are (a) MT-T1\'s band, (b) '
        + 'MT-T1\'s GUARD-NI and (c) MT-T1\'s bodyLatGap contrast — the SAME predicates, '
        + 'recomposed. Consequently exit 2 does not exist: every branch of the rule lands a dose.',
      'THE BAND is computed on every arm and its CONTROL-GATED subset feeds knee limb (a); the '
        + 'baselines, tolerances and the substrate-drift exclusion are unchanged and inherited '
        + 'verbatim, goals INCLUDED. ⚠ #208 disclosed that long-evolution worlds can drift the '
        + 'goals dimension on the CONTROL itself; if that happens here goals is EXCLUDED and the '
        + 'exclusion is published — the knee then holds only over the dimensions that survive.',
      'GUARD-NI is unchanged (spreadYOut / spacingMedian / spacingUnder4 / dupRunShare, fraction '
        + '0.2763) and is evaluated PER DOSED ARM as knee limb (b), not quantified over a '
        + 'body-moving subset. The tolerance SCALE is re-derived on THIS run\'s control.',
      'ARMED-ZERO IS A GATE WORLD, NOT AN ARM: MT-T1 ran it as a battery arm; here G-CTRLEQ builds '
        + 'it directly and it contributes no measured quantity.',
      'THE SAG CENSUS rides REPORTED at every arm, both layers. ⚠ MT-T1\'s #203 correction is '
        + 'carried CORRECTLY here: only the MATCH-WIDE layer runs at cadence 15; the WEAK-SIDE '
        + 'in-trigger layer samples EVERY in-trigger tick. SAG_MATERIAL_M = 1.4 m is still TRACED '
        + 'and pinned, but NO gate and NO knee limb reads it in this stage.',
      'AT THE CONTROL ARM ONLY the ask instruments and the swallow share are DEGENERATE BY '
        + 'CONSTRUCTION (formationSpot\'s PM branch reads the gene, which is absent ⇒ shiftY ≡ 0 ⇒ '
        + 'zero material ticks ⇒ NaN shares). All four DOSED arms carry the PM gene, so unlike '
        + 'MT-T1 the ask is live at every dosed arm — REPORTED, never gated.',
      'DOSE 1.0 IS NOT AN ARM. It is already measured (#204) and dose ≈ 0.2 under drift (#208); '
        + 'both are CITED from their committed artifacts (rehashed at run time), never re-run and '
        + 'never re-typed as numbers.',
      'NO CHECKPOINT/RESUME. MT-T2\'s per-(pass, seed) checkpoint is NOT carried: this battery is '
        + '~15 min, so a kill costs the whole run and that cost is accepted, stated not hidden.',
      'pairYield (an N input) is measured on the BODY, as in MT-T1; the variance term, the '
        + 'inflation, the 0.5 m target, the 25-step and the wall term are unchanged, and the '
        + 'reserved-band cap is this stage\'s own 800-seed band.',
    ],
  };
})();

/** X-FP-PROD (#181.2): the shipped fingerprint re-derived HERE. */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
process.stderr.write('  [mt-ladder] X-FP-PROD: re-deriving the production fingerprint...\n');
const fpObserved = leagueHash(FINGERPRINT_SEED);
const xFpProd = fpObserved === FINGERPRINT_BASELINE;
process.stderr.write(`  [mt-ladder] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + RUN_N - 1;
const seedDisjoint = (() => {
  const clashes = CONSUMED.filter((c) => !(lastSeed < c.range[0] || firstSeed > c.range[1]));
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  /** THE THREE OWN SUB-BLOCKS must be mutually disjoint AND ordered: the smoke's 6 seeds,
   *  the exit-semantics sub-block (stepped only to prove gNDerived goes RED / exit 1), and
   *  the battery's. The battery's seeds are therefore VIRGIN. */
  const smokeLast = SMOKE_BASE + SMOKE_N - 1;
  const ownBlocks = smokeLast < EXIT_CHECK_BLOCK[0]
    && EXIT_CHECK_BLOCK[1] < FULL_BASE
    && (MODE === 'smoke'
      ? (lastSeed <= smokeLast)
      : (N_ENV === null
        ? (firstSeed >= FULL_BASE && firstSeed > EXIT_CHECK_BLOCK[1])
        : (firstSeed >= EXIT_CHECK_BLOCK[0] && lastSeed <= EXIT_CHECK_BLOCK[1])));
  return {
    pass: clashes.length === 0 && inBand && ownBlocks,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, inBand,
    smokeBlock: `${SMOKE_BASE}..${smokeLast}`,
    exitSemanticsBlock: `${EXIT_CHECK_BLOCK[0]}..${EXIT_CHECK_BLOCK[1]}`,
    exitSemanticsNote: 'stepped ONLY to prove the MTLAD_N override turns gNDerived RED and exits 1; '
      + 'its output is discarded and adjudicates nothing. Reserved so the battery block stays VIRGIN.',
    fullBase: FULL_BASE, ownBlocksDisjoint: ownBlocks,
    consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name),
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

const xGates = {
  xDet: { pass: xDet, digestA, digestB, note: 'the whole core computed TWICE, canonical-JSON digests' },
  xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS },
  xSrcZero: { pass: srcDiff === '', srcDiff, note: 'instrument-only: zero src/** changes' },
  gArm: armCheck,
  gInherit: inheritCheck,
  gCtrlEq: {
    ...ctrlEq,
    semantics: 'the ARMED-ZERO WORLD (BOTH flags on, BOTH genes ABSENT) ≡ ABSENT (both flags off), '
      + 'whole-match signature INCLUDING the rng stream. THE TWO WORLDS DIFFER IN CODE PATH (armed '
      + '⇒ pmMover and mtSag true ⇒ both seam branches are entered and both weights evaluate to 0), '
      + 'so the born-absent reads are proven inert THROUGH the live branches. ⚠ Armed-zero is a '
      + 'GATE WORLD here, not an arm (MT-T1 ran it as an arm); it contributes no measured quantity.',
  },
  gSeed: seedDisjoint,
  gStats: { pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap },
  gReadOnly: {
    pass: coreA.readOnly && coreA.eyeNull,
    abandonRestAndGrantsNull: coreA.readOnly, stationEyeNull: coreA.eyeNull,
    note: 'no station eye is armed in this world, so the #188 send precedence reduces to the '
      + 'station read and the eyeOverride steer bucket is empty BY CONSTRUCTION',
  },
  gNDerived: {
    pass: MODE === 'smoke' ? true : (N_ENV === null && RUN_N === nDerivation.nStar),
    ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, envOverride: N_ENV,
    note: 'in FULL mode the N run must BE the frozen §4 rule\'s output — an MTLAD_N override turns '
      + 'this gate RED rather than passing quietly (the #188 nDerived precedent). MTLAD_N is '
      + 'accepted in SMOKE only.',
  },
};
const xPass = Object.values(xGates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §15.5 THE CITED ANCHORS — measured elsewhere, REHASHED here, never re-run   */
/* ========================================================================== */
/** #181.2: the two doses this ladder sits between are quoted FROM their committed
 *  artifacts, with the bytes sha-audited here, and are NOT re-run (#209.1: "1.0 and the
 *  ≈0.2 drift dose are already measured — cite, do not re-run 1.0"). Absence of either
 *  file is REPORTED, not fatal: they inform no gate, no knee limb and no N term. */
const citedAnchor = (path: string, what: string) => {
  if (!existsSync(path)) return { path, what, present: false, sha256: null, resultSha256: null };
  const bytes = readFileSync(path);
  let inner: string | null = null;
  try { inner = (JSON.parse(bytes.toString('utf8')) as { resultSha256?: string }).resultSha256 ?? null; } catch { inner = null; }
  return {
    path, what, present: true,
    sha256: createHash('sha256').update(bytes).digest('hex'),
    resultSha256: inner,
  };
};
const citedAnchors = {
  note: 'CITED, NEVER RE-RUN and NEVER GATED ON: these two artifacts hold the measured doses this '
    + 'ladder is placed between. Nothing in this run reads a LEVEL out of them — only their bytes '
    + 'are hashed, so the citation is auditable (#181.2) and no prior number can leak into a '
    + 'predicate (#194-M1: quote hashes only from the run that produced them).',
  topDose: { dose: CITED_TOP_DOSE, ...citedAnchor(RULER_PATH, 'MT-T1 / #204 — gene = 1 on both teams: body −2.80 m, band blown on 4 of 5 gated dimensions') },
  driftDose: { dose: null, ...citedAnchor(COEVO_PATH, 'MT-T2 / #208 — the evolved drift dose gene ≈ 0.2: body −0.70 m, world healthy') },
};

/* ========================================================================== */
/* §16 ARTIFACT                                                               */
/* ========================================================================== */
const msPerMatchMeasured = passMs / Math.max(1, RUN_N * ARMS_COUNT);
const pairYieldByArm = Object.fromEntries(DOSE_ARMS.map((a) => [a, round(bodyContrasts[a].n / Math.max(1, RUN_N), 4)]));
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  pairYieldByArm,
  pairYieldMin: Math.min(...Object.values(pairYieldByArm)),
  provenance: MODE === 'smoke'
    ? 'THE SMOKE\'S TWO SIZING NUMBERS — ms/match and the MINIMUM paired-BODY yield over the four '
      + 'non-control arms. These are the ONLY numbers a FULL run reads out of this artifact, and '
      + 'they feed ONLY N. THE SMOKE ADJUDICATES NOTHING.'
    : 'POST-HOC on this FULL run — it selected nothing (N came from the frozen rule on the SMOKE\'s '
      + 'two numbers). Reported so the smoke\'s estimate can be checked against reality.',
};
const verdict = !xPass ? 'X-FAMILY FAIL — the measurement is invalid'
  : MODE === 'smoke' ? 'SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING'
    : `KNEE = ${KNEE_DOSE} (branch ${kneeBranch}; qualifying doses `
      + `${qualifyingDoses.length === 0 ? 'none' : qualifyingDoses.join(',')}) — an EXHIBIT dose for `
      + 'the play-test, NOT a ship decision; adjudicate from the PER-ARM rows (#203)';

const body = {
  stage: 'MT LADDER — THE DOSE LADDER (the coupled tuck-in world at 0.2 / 0.4 / 0.6 / 0.8)',
  doc: 'docs/world-model/MT-LADDER.md',
  contract: 'docs/world-model/MARK-TIGHTNESS-CONTRACT.md',
  seams: ['docs/world-model/MT-T0-DORMANT-SEAM.md', 'docs/world-model/PM-T0-DORMANT-SEAM.md'],
  ruler: 'docs/world-model/MT-T1-RULER-RERUN.md + scripts/probes/mt-t1-ruler-rerun.ts (itself the '
    + 'PM-T1 compression exam\'s instrument set)',
  ruling: '#209 (this dispatch; ⭐ the KNEE RULE frozen ex ante) · #208 (the drift-dose anchor) · '
    + '#204 (the top-dose anchor) · #199 · #198 (the guard/band set incl. goals) · #196.3-D4 (the '
    + 'arming checklists) · #196.3-D6 (the gene channel) · #181.2 (committed recomputable '
    + 'receipts) · #197-M1/M2 · #194/#196 · #203 (adjudicate from PER-ARM rows) · #163',
  mode: MODE, verdict,
  frozenDesign: {
    arms: ARMS.map((s) => ({
      arm: s.id, pmFlag: s.pmFlag, mtFlag: s.mtFlag,
      defLaneConvergence: s.pmGene, markSag: s.mtGene,
      kPm: round(s.pmGene === null ? 0 : s.pmGene * PM_LANE_CONVERGENCE_MAX, 6),
      markSagWeight: s.mtGene === null ? 0 : s.mtGene,
      what: s.what,
    })),
    controlArm: CONTROL_ARM, ladderDoses: [...LADDER_DOSES],
    citedNotRerunDose: CITED_TOP_DOSE,
    kCeiling: PM_LANE_CONVERGENCE_MAX,
    sagCeilingM: MARK_SAG_MAX, sagBallSpeed: MARK_SAG_BALL_SPEED,
    ceilingHonesty: 'NEITHER seam constant is re-cut for this exam: k_PM ≤ 0.25 is PM-T0\'s traced '
      + 'legacy convergence weight and the sag family (16 m/s, 9 m cap, the sagOf shape) is MT-T0\'s '
      + 'traced freeze. If MT-T1 needs different ones, that is a fork for the commander WITH numbers.',
    doseBothTeams: DOSE_BOTH_TEAMS,
    world: { ...PERCEPT_FLAGS, stationEye: null, flagsPerArm: 'see arms above' },
    seeds: coreA.seeds, reservedBand: RESERVED_BAND,
    bootstrap: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed' },
    niFraction: round(NI_FRACTION, 6),
    niFractionSource: 'A4-S2P1-VECTOR-CENSUS §4 via PM-T1 §5.4: fraction_box = 1 − 0.275/0.380 = '
      + '0.2763. INHERITED, NOT INVENTED; the S2 form scales the FRACTION by the control arm\'s own '
      + 'level in THIS run.',
    bandSource: 'A4-S2P3-GENE-BATTERY §4.2 (P3a §4.2 / C1 §4 absolute) via PM-T1 §5.5 — baselines '
      + 'and tolerances verbatim INCLUDING goals, WITH the declared substrate-drift exclusion.',
    askMaterialM: ASK_MATERIAL_M,
    askMaterialNote: '⚠ FLAGGED EXECUTOR\'S CHOICE inherited from PM-T1 §5.3 at the same value and '
      + 'with the same status: NO GATE PREDICATE READS IT.',
    sagMaterialM: SAG_MATERIAL_M,
    sagMaterialNote: 'TRACED (1.4 m is the full span of markingAggression\'s own stance band at '
      + 'src/ai/actionExecutor.ts:294, pinned VERBATIM by G-INHERIT), carried at MT-T1\'s value. '
      + '⚠ DIFFERENCE FROM THE RULER: MT-T1\'s F-MT-a gate read this number; HERE NO GATE AND NO '
      + 'KNEE LIMB READS IT — the sag census rides REPORTED.',
    kneeRule: kneeResult.rule,
    kneeRuleFrozenExAnte: 'ruling #209.2, written into MT-LADDER.md §5 and this probe BEFORE any '
      + 'full-N number existed. The three limbs are MT-T1\'s own band / GUARD-NI / bodyLatGap '
      + 'predicates, recomposed — no new threshold is introduced anywhere in this stage.',
    switchKeyProhibition: 'switchKey is NOT computed anywhere in this probe: #188 §8.4 retracted it '
      + 'and MARK-SELECTION-CODE-MAP §5 trap 7 forbids reusing it. Attribution is the D2 '
      + 'STEER-OWNER read only. This exam makes NO oscillation claim.',
  },
  inheritance: {
    rulerProbe: 'scripts/probes/pm-t1-compression-exam.ts',
    pins: inheritCheck.rows,
    semantics: inheritCheck.semantics,
    disclosedDifferences: inheritCheck.disclosedDifferences,
  },
  nDerivation,
  smokeAdjudicatesNothing: MODE === 'smoke'
    ? '⚠ THIS IS A SMOKE ARTIFACT. Every number under `results` is PLUMBING EVIDENCE ONLY — it '
      + 'adjudicates nothing, tunes no threshold, and may not be cited as a finding. The gate '
      + 'booleans below are computed so the wiring is exercised, not so they can be read.'
    : false,
  predicates: {
    'THE KNEE (the ONLY decision rule this stage carries)':
      'QUALIFIES(d) := the arm at dose d (a) holds the equilibrium BAND on EVERY CONTROL-GATED '
      + 'dimension (a dimension the CONTROL itself fails is DISCLOSED and EXCLUDED as substrate '
      + 'drift) AND (b) passes GUARD-NI AND (c) has CI_upper(bodyLatGap − ABSENT) < 0. '
      + 'KNEE := the LARGEST qualifying d; if NO d ≥ 0.4 qualifies ⇒ 0.2 (the measured-healthy '
      + 'anchor); if ALL qualify ⇒ 0.8. Ruling #209.2, frozen ex ante. EVERY BRANCH LANDS A DOSE — '
      + 'there is no STOP class and no exit 2.',
    'GUARD-NI': 'spreadY_out and spacingMedian CI_lower > −tol AND spacingUnder4 and dupRun '
      + 'CI_upper < +tol, tol = 0.2763 × |the CONTROL arm\'s own level, THIS run| (the S2 form; an '
      + 'UNRESOLVED, too-wide CI FAILS the limb, per the S2 degeneracy clause)',
    BAND: 'the A4-S2P3 §4.2 baselines and tolerances INCLUDING goals, via PM-T1 §5.5 and MT-T1 §5.4 '
      + '— control-gated with the declared substrate-drift exclusion',
    FLAG: 'offsides — resolvedly UP at any dosed arm returns the axis to the USER; it NEVER flips '
      + 'the knee and never fails the run (the #157 instrument debt, the F-S2d form)',
    'SAG-FIRED (REPORTED, no gate reads it here)':
      'weak-side-back in-trigger sag census: saggedGtBase > 0 AND tightened = 0 AND '
      + `meanSagOnSlackPositive ≥ ${SAG_MATERIAL_M} m (the traced markingAggression stance band)`,
    REPORTED: 'the per-arm body rows in MT-T1\'s PRIMARY shape (bodyLatGap / compressionShortfall / '
      + 'detachMean) · the swallow share · mark-assignment drift (markShare / far-side share / '
      + 'distToMark / markLatGap — the map §2.4 EMERGENT feedback channel named by #202.2) · the '
      + 'ask instruments · the detach/steer receipts · the sag census · the per-dose sag census. '
      + 'NONE of these decides the knee except bodyLatGap, which is limb (c).',
  },
  results: {
    perArm: coreA.perArm,
    levels: coreA.levels,
    knee: kneeResult,
    body: {
      bodyLaneGap: bodyContrasts, compressionShortfall: shortfallContrasts, detachment: detachContrasts,
      perArm: bodyPerArm,
      achievedHalfWidthM: achievedHalfWidth,
      bodyMovingArms,
      note: 'bodyLatGap is KNEE LIMB (c); shortfall and detachment ride REPORTED (MT-T1 gated on all '
        + 'three, this stage does not). `mtT1PrimaryShape` per arm is MT-T1\'s PRIMARY conjunction '
        + 'recomputed for continuity — it decides NOTHING here. The achieved half-widths are '
        + 'published whether or not they meet the 0.5 m target (the #188 §8.0 precedent).',
    },
    sagCensus: sagFired,
    guardNI,
    band: {
      control: bandControl, byArm: bandByArm,
      gatedDimensions: bandGated, excludedAsSubstrateDrift: bandExcluded,
      note: 'the A4-S2P3 §4.2 substrate-drift caveat, verbatim: a dimension the CONTROL arm itself '
        + 'fails is DISCLOSED and EXCLUDED from the gate.',
    },
    instrumentDebt157: { offsideFlagFired: OFFSIDE_FLAG, offsideByArm, contrasts: instrumentDebt },
    reportedAsk: {
      note: 'REPORTED, NEVER GATED. All four DOSED arms carry the PM gene, so the ask is LIVE at '
        + 'each of them (unlike MT-T1, where three arms were degenerate). At the ABSENT control the '
        + 'ask is UNMODULATED BY CONSTRUCTION — formationSpot\'s PM branch reads '
        + 'pmLaneConvergenceK(gene), and the gene is absent. #199 measured its D100 ask at '
        + '−4.705904 [−4.954743, −4.445391]; that number is context, not a comparison this stage makes.',
      contrasts: askContrasts, askShiftY: askShiftContrasts,
    },
    reportedSwallow: {
      note: 'REPORTED, NEVER GATED (the contract §3: the body may compress WHILE markStance stays '
        + 'the steer owner — the gate is the BODY, not the label). #199 measured markStance owning '
        + '79.97–84.57 % of material-ask ticks. DEGENERATE (NaN) at the CONTROL arm only.',
      share: swallowShare,
    },
    reportedMarkDrift: {
      note: 'REPORTED, NEVER GATED — the MARK-SELECTION-CODE-MAP §2.4 positional-feedback channel, '
        + 'named again by #202.2: a sagged body moves the distances assignMarks\' own 22 m / 9 m '
        + 'gates read, so assignment CAN churn DOWNSTREAM of the body. Visible and attributed, not '
        + 'designed away, and NOT a predicate.',
      contrasts: markDrift,
    },
    receipts: coreA.receipts,
    citedAnchors,
  },
  gates: { ...xGates, xFamilyPass: xPass },
  honesty: [
    'FROZEN BEFORE SIGHT: the arms, the seeds, the N rule, the gates, the instruments and ⭐ THE '
      + 'KNEE RULE ITSELF were written in the stage doc and this probe before any full-N number '
      + 'existed, and are not re-cut afterwards. The knee rule\'s fallback branches were frozen '
      + 'WITH it, so no branch can be selected after sight.',
    'THE SMOKE ADJUDICATES NOTHING and may not tune any threshold: it proves plumbing and publishes '
      + 'exactly two sizing numbers (ms/match, min paired-BODY yield) which feed ONLY N.',
    'NO RE-CUT AFTER SIGHT: k_PM ≤ 0.25 is PM-T0\'s traced constant; 16 m/s, the 9 m cap and the '
      + 'sagOf shape are MT-T0\'s; the NI fraction is A4-S2P1 §4\'s; the band is A4-S2P3 §4.2\'s; '
      + 'SAG_MATERIAL_M is markingAggression\'s own stance band. THIS STAGE INTRODUCES NO NEW '
      + 'THRESHOLD — the knee is a recomposition of three inherited predicates.',
    'THE ARMS DIFFER IN EXACTLY WHAT THE TABLE SAYS: two MatchConfig flags and two gene values, '
      + 'the two genes EQUAL at each dose. Nothing else moves; src/** is untouched (X-SRC-ZERO) and '
      + 'the doses travel the real gene channel on all three genome views of BOTH teams '
      + '(#196.3-D6), throwing ALL switches of BOTH arming checklists (#196.3-D4).',
    'The arms diverge tick-for-tick, so PAIRING IS ON THE SEED, not on the episode: each seed '
      + 'contributes one paired delta per arm, and the bootstrap clusters on the seed.',
    'NO STOP CLASS AND NO EXIT 2: every branch of the knee rule lands a dose. A dose that fails a '
      + 'limb is PUBLISHED with its failing limb and its numbers — the commander adjudicates from '
      + 'the PER-ARM rows (#203), never from the knee line.',
    'DOSE 1.0 IS NOT RE-RUN (#209.1): it is cited from MT-T1\'s committed artifact, whose bytes are '
      + 'hashed here. No level is read out of any prior artifact anywhere in this run.',
    'NO CHECKPOINT/RESUME (unlike MT-T2): the battery is ~15 min, so a kill costs the whole run. '
      + 'Stated, not hidden.',
    'THIS STAGE SHIPS NOTHING (Road B): both flags stay absent from every bundle and play-test '
      + 'world, both genes stay born-absent, and the production fingerprint is re-derived '
      + 'unchanged. The knee is an EXHIBIT dose for the user\'s play-test verdict, not a ship '
      + 'decision, and it does NOT say the compression is good football.',
  ],
};
/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free MEASURED
 *  body, so a third party re-running this probe at ANY commit re-derives it. `head` and the
 *  wall-clock fields ride the envelope, outside the hash. The one git-derived field still
 *  INSIDE is `gates.xSrcZero` (`git diff --stat -- src`) — a GATE OUTPUT (empty on any clean
 *  tree at any commit), not a commit identifier. In full mode
 *  `nDerivation.smokeArtifactSha256` also stays inside: it is N's provenance. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  sizing: sizingOut,
  headContextOnly: head,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (#197-M1): the git short-hash of the tree this '
    + 'run was launched from. Recorded for provenance and hashed NOWHERE, so the receipt '
    + 're-derives at any later commit.',
  wallContextOnly: {
    corePassMs: passMs, totalMs: Date.now() - wall0,
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 — used in no gate. `sizing.msPerMatch` is the one '
      + 'timing number with a job: the wall term of the frozen N rule reads it.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §17 STDOUT                                                                 */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const fmt = (c: Contrast): string => `${c.point >= 0 ? '+' : ''}${c.point} [${c.lower}, ${c.upper}] n=${c.n}${c.resolved ? ' ✔' : ''}`;
o('');
o(`=== MT-LADDER — THE DOSE LADDER (${MODE}) — HEAD ${head} — ${RUN_N} seeds × ${ARMS_COUNT} arms, block ${firstSeed}..${lastSeed} ===`);
o(`arms ${ARMS.map((s) => `${s.id}[pm ${s.pmFlag ? 'on' : 'off'}/${s.pmGene ?? 'absent'} · mt ${s.mtFlag ? 'on' : 'off'}/${s.mtGene ?? 'absent'}]`).join('  ')}`);
o(`episodes/arm ${ARM_IDS.map((a) => `${a}:${coreA.perArm[a].episodes}`).join('  ')}`);
o('');
o('THE BODY, per dose (paired per-seed vs ABSENT; bodyLatGap is KNEE LIMB (c), the rest REPORTED):');
for (const a of DOSE_ARMS) {
  o(`  ${a.padEnd(9)} body ${fmt(bodyContrasts[a])} · shortfall ${fmt(shortfallContrasts[a])} · detach ${fmt(detachContrasts[a])}`);
}
for (const a of DOSE_ARMS) {
  const p = bodyPerArm[a];
  o(`  ${a.padEnd(9)} bodyFalls ${p.bodyFalls} · shortfallFalls ${p.shortfallFalls} · detachNotUp ${p.detachNotUp}`
    + ` ⇒ MT-T1-PRIMARY-shape ${p.mtT1PrimaryShape} (REPORTED — gates nothing here)`);
}
o(`  achieved body half-widths: ${DOSE_ARMS.map((a) => `${a} ±${achievedHalfWidth[a]}`).join(' · ')}`);
o('');
o('SAG CENSUS (weak-side back, EVERY in-trigger tick — REPORTED; no gate reads it here):');
for (const a of ARM_IDS) {
  const s = sagFired[a].weakInTrigger;
  o(`  ${a.padEnd(9)} ticks ${s.samples} · slack+ ${s.slackPositive} · sagged>base ${s.saggedGtBase} · tightened ${s.tightened}`
    + ` · meanSag(slack+) ${s.meanSagOnSlackPositive} m · max ${s.maxSag} m · stance ${s.meanBaseMarkDist} → ${s.meanSaggedMarkDist} m`
    + ` ⇒ SAG-FIRED ${sagFired[a].fired}`);
}
for (const a of ARM_IDS) {
  const s = sagFired[a].matchWide;
  o(`  ${a.padEnd(9)} [match-wide] ticks ${s.samples} · slack+ ${s.slackPositive} · sagged>base ${s.saggedGtBase}`
    + ` · tightened ${s.tightened} · meanSag(slack+) ${s.meanSagOnSlackPositive} m · max ${s.maxSag} m`);
}
o('');
o(`BAND — gated ${bandGated.join(',') || 'none'} · excluded as substrate drift ${bandExcluded.join(',') || 'none'}`);
for (const a of ARM_IDS) {
  o(`  BAND ${a.padEnd(9)} ${bandByArm[a].pass ? 'PASS' : 'FAIL'}: `
    + BAND_KEYS.map((k) => `${k} ${bandByArm[a].row[k].level} [${bandByArm[a].row[k].lo}, ${bandByArm[a].row[k].hi}] ${bandByArm[a].row[k].inBand ? 'ok' : 'OUT'}`).join(' · '));
}
o('');
o(`GUARD-NI (knee limb (b)) — tol = ${round(NI_FRACTION, 4)} × the CONTROL's own level, THIS run:`);
for (const a of DOSE_ARMS) {
  o(`  GUARD-NI ${a.padEnd(9)} ${guardNI[a].pass ? 'PASS' : 'FAIL'}: `
    + guardNI[a].limbs.map((l) => `${l.key} ${l.pass ? 'ok' : 'BLOWN'} (${fmt(l.contrast)} vs ±${l.tolerance})`).join(' · '));
}
o('');
o('REPORTED — THE ASK (no gate; LIVE at every dosed arm — all four carry the PM gene):');
for (const a of DOSE_ARMS) o(`  ${a.padEnd(9)} ask ${fmt(askContrasts[a])} · askShiftY ${fmt(askShiftContrasts[a])}`);
o('REPORTED — THE SWALLOW SHARE (no gate; NaN at the CONTROL, where the PM gene is absent):');
for (const a of ARM_IDS) {
  const row = (swallowShare as Record<string, { materialCutM: number; materialTicks: number; markStanceShare: number; stationWalkShare: number }[]>)[a][1];
  o(`  ${a.padEnd(9)} @${row.materialCutM} m: material ticks ${row.materialTicks} · markStance ${row.markStanceShare} · stationWalk ${row.stationWalkShare}`);
}
o('REPORTED — MARK-ASSIGNMENT DRIFT (no gate; the #202.2 emergent feedback channel):');
for (const a of DOSE_ARMS) {
  o(`  ${a.padEnd(9)} markShare ${fmt((markDrift.markShare as Record<string, Contrast>)[a])}`
    + ` · farSide ${fmt((markDrift.markFarSideShare as Record<string, Contrast>)[a])}`
    + ` · distToMark ${fmt((markDrift.distToMarkMean as Record<string, Contrast>)[a])}`);
}
o(`OFFSIDE FLAG ${OFFSIDE_FLAG ? '*** FIRED (returns to the USER; never flips PASS/FAIL) ***' : 'quiet'} — `
  + DOSE_ARMS.map((a) => `${a} ${fmt(offsideByArm[a])}`).join(' · '));
o('');
o('⭐ THE KNEE (ruling #209.2, frozen ex ante — the LARGEST dose holding band ∧ GUARD-NI ∧ body<0):');
for (const r of kneeRows) {
  o(`  dose ${r.dose} (${r.arm}) band ${r.bandHoldsOnGatedDimensions ? 'HOLDS' : `FAILS[${r.failedGatedBandDimensions.join(',') || '—'}]`}`
    + ` · GUARD-NI ${r.guardNiPasses ? 'PASS' : 'FAIL'}`
    + ` · body<0 ${r.bodyLatGapResolvedlyNegative} (${fmt(r.bodyLatGap)})`
    + ` ⇒ QUALIFIES ${r.qualifies}`);
}
o(`  qualifying doses: ${qualifyingDoses.length === 0 ? 'none' : qualifyingDoses.join(',')}`
  + ` · branch ${kneeBranch} ⇒ ⭐ KNEE = ${KNEE_DOSE}`);
o(`  ${kneeResult.branchNote}`);
o(`  CITED, NOT RE-RUN: dose ${CITED_TOP_DOSE} (#204) ${citedAnchors.topDose.present ? `sha256 ${String(citedAnchors.topDose.sha256).slice(0, 12)}…` : 'ARTIFACT ABSENT'}`
  + ` · drift dose (#208) ${citedAnchors.driftDose.present ? `sha256 ${String(citedAnchors.driftDose.sha256).slice(0, 12)}…` : 'ARTIFACT ABSENT'}`);
o('');
o(`X-FAMILY ${xPass ? 'GREEN' : '*** RED ***'}: `
  + Object.entries(xGates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${(Date.now() - wall0) / 1000}s · ${round(msPerMatchMeasured, 1)} ms/match`
  + ` · pairYieldMin ${sizingOut.pairYieldMin} · artifact ${OUT_PATH}`);
o(`VERDICT: ${verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!xPass) process.exit(1);
process.exit(0);
