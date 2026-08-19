#!/usr/bin/env tsx
/**
 * ============================================================================
 * DF-C0 — THE DEFENSIVE-BRAIN CENSUS (instrument-only)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #319 item 3, bound by
 * `docs/world-model/DF-DEFENSIVE-BRAIN-CONTRACT.md` §3 (DF-C0) and the doctrine
 * `docs/world-model/DEF-DOCTRINE.md` §2. FIVE INSTRUMENTS, one artifact:
 *
 *   (a) THE HAND-RULE INVENTORY — every hardcoded defensive-coordination
 *       rule/cap/threshold inside a FROZEN, ANCHORED corpus of defensive
 *       constructs (the presser cap, the 0.62 mode threshold, assignMarks'
 *       scheme, the chaser counts, the role-conditioned constants), needle
 *       counts with a STATED PREFIX, every occurrence enumerated and CLASSED
 *       (cap / threshold / scheme / role-bias / other-constant), TOKENIZER-
 *       STRIPPED per the text-census corpus-integrity canon.
 *   (b) THE 乱跑 DIAGNOSIS — assignment churn at world grain in the WORLD-9
 *       base: mark-target switches per defender-minute · chase starts and
 *       abandonments · re-target latency (STORED BINS) · the dupRun-lineage
 *       duplicate-target faces (DUP_RUN_M = 4, reused verbatim) · the swarm's
 *       own face at anchored radii (the band the Phase-31 cap holds today).
 *   (c) THE ZONAL/CHAIN PRIMITIVE-GAP ANALYSIS — code facts only: what state
 *       and actions a line-link, a cover rotation, a mark handoff and an
 *       offside-trap step would CONSUME vs what exists today, CLASSED
 *       exists-live / exists-dormant / MISSING, every row carrying line
 *       receipts that are RE-VERIFIED VERBATIM against src at run time.
 *   (d) ⭐ THE SEASON LADDER — goals + the shipped defensive faces × GENERATION
 *       on long headless leagues, with FROZEN-GENOME CROSS ARMS: (i) both
 *       evolve (the live world), (ii) attack evolves × the defence-relevant
 *       genes FROZEN at gen-1 values, (iii) the converse. THE FREEZE IS BY
 *       CONSTRUCTION THROUGH THE SHIPPED PATH: nothing is ever written into
 *       `info.genome` by hand (dose-placement canon) — the frozen sub-vector is
 *       re-copied onto the FRANCHISE COACH GENOME, the exact field the shipped
 *       evolution writer (`evolveGroup` → `mutateGenome`/`mutateStyle`) writes,
 *       after each shipped `League.finishSeason()`, and `League.createMatch`
 *       serializes it into the match exactly as it always does. The serialized
 *       value is READ BACK on each generation's first fixture as a receipt.
 *   (e) THE DECISION-SURFACE SIZING — where the per-defender press/mark/cover/
 *       intercept chooser would live (the assignment call sites), which SHIPPED
 *       accounts it can consume today (L3 access-time · the defence books ·
 *       commitment physics), and the perf bound RE-ANCHORED against
 *       `docs/perf/baseline.json` (the IN-C0 perf-mislabel lesson: never a
 *       self-measured upper bound presented as the engine's cost).
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)) — this file is frozen in
 *     its own commit BEFORE the battery runs; the artifact records its sha256.
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1) — see `HASH_SCHEMA` in §14.
 *   · per-seed cells (home ruling #282.2(ii)) — every headline re-derives from
 *     `perSeedCells` / `ladderCells`.
 *   · gFaces-from-disk (home ruling #287 item 1) + "the re-derivation gate
 *     covers EVERY published face; a percentile face requires stored bins"
 *     (home PC-C0 §CORR item 4) — `gFacesFromDisk`, and the re-target latency
 *     median is computed from STORED BINS.
 *   · "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
 *     occurrence's site" (home PC-C0 §CORR item 1) — the needle PREFIX is
 *     stated in `needlePrefixAlphabet` / `literalNeedleRegex`.
 *   · text-census corpus integrity (home IN-C0 §CORR item 2, ruling #317 item
 *     2) — the tokenizer is COPIED BYTE-VERBATIM from the IN-C0-FIX rescan and
 *     drift-gated against that file; the naive (historically buggy) stripper is
 *     kept as the MUTANT ORACLE and the discrimination is proven on THIS corpus.
 *   · "a field carries the unit its name claims" (home ruling #294 item 3).
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes
 *     a gated face" (home PC-T2 §CORR item 4).
 *   · "a starred finding states its |Δ|÷half-width ratio" (home BU-T0B §CORR
 *     item 2).
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0 §CORR
 *     item 1) — §2's `NAMED_RULES`, each with an anchored EXACT-LINE match.
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared
 *     field" (home BU-T1 §CORR item 6) — the L3/PC dose files and
 *     `docs/perf/baseline.json` are hashed AS BYTES before being parsed.
 *   · moving denominators disclosed per face (home PW-C0 §CORR item 2).
 *   · clock honesty (paraphrase): every rate is published on the 240 s match
 *     clock AND per defender-minute; APPLIED values, never nominal.
 *   · seed discipline: BOOKED = WALKED; the block is consumed whole; stats
 *     floors step ≥ 200.
 *   · worker fixtures (home ruling #283.2(iv)) — VERBATIM: "WORKER-SIMMED
 *     fixtures play the SHIPPED world (League.toJSON omits matchFlags; true
 *     since #155, stated now, test-pinned; refines #270's E4 correction;
 *     matches the perf diagnostic)". THE LADDER THEREFORE RUNS THE SHIPPED
 *     WORLD (no matchFlags), in-process, never through a worker — and the
 *     ladder's own arm labels say so.
 *
 * INSTRUMENT-ONLY: `src/**` is untouched (`gSrcUntouched` publishes both
 * `git status --porcelain -- src` and `git diff --stat HEAD -- src`).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: DFC0_MODE (smoke|full, REQUIRED) · DFC0_N · DFC0_GENS · DFC0_OUT.
 *   ANY other `DFC0_*` var is a FATAL refusal, and so is ANY engine env door.
 *   Any override is an OVERRIDE run: it may not write the canonical path.
 *
 * RUN: DFC0_MODE=full npx tsx scripts/probes/df-c0-defensive-brain-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import { League } from '../../src/sim/League';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import { GENE_KEYS, randomGenome, type GeneKey, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type TeamInfo, type TeamStyle } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['DFC0_MODE', 'DFC0_N', 'DFC0_GENS', 'DFC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('DFC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('DF-C0 FATAL — refused env surface. '
    + `rogue DFC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
type Mode = 'smoke' | 'full';
const MODE_RAW = process.env.DFC0_MODE;
if (MODE_RAW !== 'smoke' && MODE_RAW !== 'full') {
  banner('DF-C0 FATAL — DFC0_MODE is REQUIRED and must be `smoke` or `full`.');
  process.exit(2);
}
const MODE: Mode = MODE_RAW;
const N_ENV = process.env.DFC0_N === undefined ? null : Number(process.env.DFC0_N);
const GENS_ENV = process.env.DFC0_GENS === undefined ? null : Number(process.env.DFC0_GENS);
const CANON_OUT = 'docs/world-model/data/df-c0-defensive-brain-census.json';
const OUT_PATH = process.env.DFC0_OUT ?? CANON_OUT;
const IS_OVERRIDE = MODE !== 'full' || N_ENV !== null || GENS_ENV !== null
  || process.env.DFC0_OUT !== undefined;
if (IS_OVERRIDE && OUT_PATH === CANON_OUT) {
  banner('DF-C0 FATAL — an OVERRIDE run (smoke / N / GENS / OUT) may not write the canonical '
    + `path ${CANON_OUT}. Pass DFC0_OUT=<side path>.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 HELPERS                                                                  */
/* ========================================================================== */
const SELF_PATH = 'scripts/probes/df-c0-defensive-brain-census.ts';
const RESCAN_PROBE = 'scripts/probes/in-c0-fix-surface-rescan.ts';
const sha256 = (s: string): string => createHash('sha256').update(s).digest('hex');
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const ratio = (a: number, b: number): number => (b === 0 ? Number.NaN : a / b);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((a, b) => a + b, 0) / xs.length);
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }).trim(); } catch { return ''; }
};

/* ========================================================================== */
/* §2 (a) THE HAND-RULE INVENTORY                                              */
/* ========================================================================== */
/**
 * ⭐⭐ THE TOKENIZER — COPIED BYTE-VERBATIM from `in-c0-fix-surface-rescan.ts`
 * (`stripTokens`, `stripComments`, `REGEX_ALLOWED_AFTER`) and DRIFT-GATED: §12's
 * `gTokenizerVerbatim` re-reads the rescan file at run time and compares the copied
 * blocks character for character, so this census cannot silently drift into its own
 * private stripper. `stripComments` is the HISTORICAL BUG (#317 item 1) and is kept
 * ONLY as the MUTANT ORACLE for the corpus-integrity gate below.
 */
const REGEX_ALLOWED_AFTER = new Set(
  ['', '(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%',
    '~', '^', '<', '>', 'return'],
);
/**
 * `keepInterpolations` (default TRUE, the census setting) keeps `${...}` code. The FALSE arm
 * exists for ONE published purpose: the verifier's independent tokenizer stripped whole
 * template literals, so the FALSE arm is what reconciles this probe's totals with the
 * verifier's expected magnitudes exactly, with the difference ENUMERATED rather than waved at.
 */
const stripTokens = (src: string, keepInterpolations = true): string => {
  const out: string[] = [];
  const n = src.length;
  /** the template/interpolation stack: `tmpl` = inside literal text, `interp` = inside ${} */
  const stack: Array<{ kind: 'tmpl' | 'interp'; braces: number }> = [];
  /** the last significant code character (for the regex-vs-division decision) */
  let prev = '';
  let i = 0;
  const nl = (from: number, to: number): void => {
    for (let j = from; j < to; j++) if (src[j] === '\n') out.push('\n');
  };
  const inTmplText = (): boolean => stack.length > 0 && stack[stack.length - 1].kind === 'tmpl';
  while (i < n) {
    if (inTmplText()) {
      /* inside template literal TEXT: strip until the closing backtick or an interpolation */
      if (src[i] === '\\') { nl(i, i + 2); i += 2; continue; }
      if (src[i] === '`') { stack.pop(); prev = 'x'; i += 1; continue; }
      if (src[i] === '$' && src[i + 1] === '{') {
        if (keepInterpolations) {
          stack.push({ kind: 'interp', braces: 0 });
          prev = '(';
          i += 2;
          continue;
        }
        /* the verifier's arm: swallow the interpolation as literal text, braces tracked */
        let depth = 1;
        let j = i + 2;
        while (j < n && depth > 0) {
          if (src[j] === '{') depth += 1;
          else if (src[j] === '}') depth -= 1;
          j += 1;
        }
        nl(i, j);
        i = j;
        continue;
      }
      nl(i, i + 1);
      i += 1;
      continue;
    }
    const c = src[i];
    const d = src[i + 1] ?? '';
    /* --- line comment: to the newline. It CANNOT open a block comment. --- */
    if (c === '/' && d === '/') {
      while (i < n && src[i] !== '\n') i += 1;
      continue;
    }
    /* --- block comment: to the first closer. It cannot be opened from any other state. --- */
    if (c === '/' && d === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? n : end + 2;
      nl(i, stop);
      i = stop;
      continue;
    }
    /* --- string literal --- */
    if (c === '"' || c === '\'') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c) { j += 1; break; }
        if (src[j] === '\n') break;
        j += 1;
      }
      nl(i, j);
      prev = 'x';
      i = j;
      continue;
    }
    /* --- template literal opens --- */
    if (c === '`') { stack.push({ kind: 'tmpl', braces: 0 }); i += 1; continue; }
    /* --- regex literal (only where a regex may legally start) --- */
    if (c === '/' && REGEX_ALLOWED_AFTER.has(prev)) {
      let j = i + 1;
      let cls = false;
      let closed = false;
      while (j < n && src[j] !== '\n') {
        const e = src[j];
        if (e === '\\') { j += 2; continue; }
        if (cls) { if (e === ']') cls = false; j += 1; continue; }
        if (e === '[') { cls = true; j += 1; continue; }
        if (e === '/') { j += 1; closed = true; break; }
        j += 1;
      }
      if (closed) {
        while (j < n && /[a-z]/.test(src[j])) j += 1; /* flags */
        prev = 'x';
        i = j;
        continue;
      }
      /* not a regex after all (an unterminated `/` on the line) — fall through as code */
    }
    /* --- code --- */
    if (stack.length > 0 && stack[stack.length - 1].kind === 'interp') {
      const top = stack[stack.length - 1];
      if (c === '{') top.braces += 1;
      else if (c === '}') {
        if (top.braces === 0) { stack.pop(); prev = 'x'; i += 1; continue; }
        top.braces -= 1;
      }
    }
    out.push(c);
    if (!/\s/.test(c)) prev = c;
    i += 1;
  }
  return out.join('');
};
const stripComments = (src: string): string => {
  // Strip block comments but PRESERVE newlines so line numbers survive.
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end < 0 ? src.length : end + 2;
      for (let j = i; j < stop; j++) if (src[j] === '\n') out += '\n';
      i = stop;
      continue;
    }
    out += src[i];
    i++;
  }
  return out.split('\n').map((l) => l.split('//')[0]).join('\n');
};
/**
 * ⭐⭐ THE PRODUCTION ALIAS — the ONE line the mutation receipt swaps. At HEAD it is the
 * tokenizer; setting it to `stripComments` (the historical bug) must turn
 * `gCorpusIntegrityDiscriminates` RED. Nothing else in this file selects a stripper.
 */
const strip: (src: string) => string = stripTokens;

/**
 * ⭐ THE DEFENSIVE CORPUS — a FROZEN list of ANCHORED CONSTRUCTS, not whole files. Each row
 * pins the construct's FIRST and LAST line VERBATIM; both anchors must occur EXACTLY ONCE in
 * the stripped file and in order, or the census refuses to run (§11's construction class).
 * This is the "anchored extraction" canon applied to a RANGE: the inventory's denominator is
 * the defensive-coordination layer, named line by line, never "whatever a grep matched".
 *
 * `assignRunners` and the corner routines are DELIBERATELY OUT: they are the ATTACKING
 * off-ball caps (runner counts, crash counts), a different arc's hand rules. Stated, not
 * silently dropped.
 */
interface ConstructDef {
  id: string;
  file: string;
  firstLine: string;
  lastLine: string;
  what: string;
}
const CONSTRUCTS: readonly ConstructDef[] = [
  {
    id: 'teamMode',
    file: 'src/ai/TeamBrain.ts',
    firstLine: '  let mode: TeamMode;',
    lastLine: '  team.mode = mode;',
    what: 'the whole-team tactical MODE decision — where the binary Press/Defend threshold '
      + 'lives (DEF-DOCTRINE §1: "the binary Press/Defend threshold at TeamBrain.ts:90")',
  },
  {
    id: 'assignChasers',
    file: 'src/ai/TeamBrain.ts',
    firstLine: 'function assignChasers(team: Team, match: Match): void {',
    lastLine: '  for (const p of byDist.slice(0, count)) team.chasers.add(p.index);',
    what: 'WHO PRESSES — the Phase-31 presser cap and every chaser-count rule',
  },
  {
    id: 'assignMarks',
    file: 'src/ai/TeamBrain.ts',
    firstLine: 'function assignMarks(team: Team, match: Match): void {',
    lastLine: '      team.marks.set(best.idx, threat.index);',
    what: 'WHO MARKS WHOM — the hand-written greedy scheme (the #248 assignMarks debt)',
  },
  {
    id: 'markStance',
    file: 'src/ai/actionExecutor.ts',
    firstLine: '        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;',
    lastLine: '            target = { x: target.x + (spot.x - target.x) * trapHold, y: target.y };',
    what: 'HOW TIGHT — the mark stance band, the L3 access-time sag seam and the trap hold',
  },
  {
    id: 'jockeyStandoff',
    file: 'src/ai/actionExecutor.ts',
    firstLine: '      const jockey = team.genome.jockeyBias ?? 0.5;',
    lastLine: '        const standoff = 0.9 + jockey * 0.5;',
    what: 'THE CONTAIN DECISION — the jockey gate and its standoff distance',
  },
  {
    id: 'defensiveActionMenu',
    file: 'src/ai/PlayerBrain.ts',
    firstLine: '    if (team.chasers.has(p.index)) {',
    lastLine: '          if (team.chasers.has(q.index) || team.marks.has(q.index)) continue;',
    what: 'THE PER-DEFENDER OPTION MENU as it exists today — chase-if-assigned, '
      + 'mark-if-assigned, the loose-ball radius: the seat the DF surface would take',
  },
  {
    id: 'restDefenceDepth',
    file: 'src/ai/formations.ts',
    firstLine: '      if (!abandonRest) x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);',
    lastLine: '      x -= ((g.coverBias ?? 0.5) - 0.5) * 8;',
    what: 'THE LINE\'S DEPTH — the coverBias (libero/stopper) rest-defence clamp',
  },
];

/**
 * THE NEEDLES. TWO FAMILIES, both with their PREFIX stated:
 *  · LITERAL needles — a numeric literal in CODE (comments and strings stripped): the
 *    regex below, whose PREFIX condition is "not preceded by a word character, a `.`, or a
 *    `$`" (so `p.pos.x`, `v2`, `_1` are not literals) and whose suffix condition is "not
 *    followed by a word character". Every hardcoded cap/threshold/scheme constant in the
 *    corpus is one of these by construction.
 *  · TOKEN needles — the named coordination surfaces the hand rules write and read.
 */
const LITERAL_PREFIX_NOTE = 'a numeric literal not preceded by [A-Za-z0-9_$.] and not '
  + 'followed by [A-Za-z0-9_$]; comments and string/template/regex literals are removed by '
  + 'the tokenizer FIRST';
const LITERAL_RE = /(?<![A-Za-z0-9_$.])\d+(?:\.\d+)?(?![A-Za-z0-9_$])/g;
const TOKEN_NEEDLES = ['team.chasers', 'team.marks', 'team.mode', 'style.scheme', 'count',
  'pressIntensity', 'markingAggression', 'jockeyBias', 'coverBias', 'trapBias',
  'transitionPress', 'p.role', 'role ==='] as const;
type LiteralClass = 'cap' | 'threshold' | 'scheme' | 'role-bias' | 'other-constant';
/**
 * ⭐ THE CLASSIFIER — FROZEN BEFORE ANY SITE WAS READ, precedence top to bottom (the first
 * matching rule wins; the order IS the definition). Every rule reads only the site's own
 * STRIPPED line text and the construct it sits in — no per-site hand classing anywhere, so
 * the inventory cannot be curated after sight.
 *
 *  cap        — the literal participates in a COUNT of bodies (`count` / `Math.min(count…`):
 *               a hard ceiling on how many defenders may do a thing.
 *  role-bias  — the literal sits on a line that tests or keys a ROLE (`p.role`, `role ===`,
 *               `Record<Role`): a constant that applies to some roles and not others.
 *  scheme     — the literal sits on a line mentioning the marking SCHEME machinery
 *               (`scheme`, `zonal`, `zones`, `threat`, `marks.set`): the assignMarks scheme.
 *  threshold  — the literal is compared with a relational operator (`>`/`<`/`>=`/`<=`):
 *               a hand-drawn cut on a continuous quantity.
 *  other-constant — everything else, ENUMERATED not dropped (offsets, blend weights, radii
 *               used in arithmetic rather than in a comparison).
 */
const classifyLiteral = (line: string): LiteralClass => {
  if (/\bcount\b/.test(line)) return 'cap';
  if (/\bp\.role\b|\brole ===|Record<Role/.test(line)) return 'role-bias';
  if (/scheme|zonal|zones|threat|marks\.set/.test(line)) return 'scheme';
  if (/[<>]=?/.test(line)) return 'threshold';
  return 'other-constant';
};

/**
 * ⭐ THE NAMED RULES OF RECORD — the hand rules the doctrine and the contract name, each
 * pinned to its NAMED CALL SITE by an EXACT-LINE anchored match (never first-occurrence),
 * per the anchored-extraction canon. Each anchor must match EXACTLY ONCE in the stripped
 * file; the line number is the RECEIPT, discovered at run time, never typed here.
 */
interface NamedRuleDef { id: string; file: string; line: string; klass: LiteralClass; what: string }
const NAMED_RULES: readonly NamedRuleDef[] = [
  {
    id: 'modeThreshold062',
    file: 'src/ai/TeamBrain.ts',
    line: '    mode = pressScore > 0.62 ? \'Press\' : \'Defend\';',
    klass: 'threshold',
    what: 'THE BINARY MODE THRESHOLD: the whole team is Press or Defend at a single hand '
      + 'number — the doctrine\'s 连续的 clause has no purchase here',
  },
  {
    id: 'presserBase',
    file: 'src/ai/TeamBrain.ts',
    line: '  let count = 1;',
    klass: 'cap',
    what: 'ONE presser by default — the base of the Phase-31 cap',
  },
  {
    id: 'presserSecond078',
    file: 'src/ai/TeamBrain.ts',
    line: '    if (team.mode === \'Press\' || team.genome.pressIntensity > 0.78) count += 1;',
    klass: 'cap',
    what: 'THE SECOND PRESSER: granted by MODE or by a gene crossing 0.78 — a cap and a '
      + 'threshold in one line (classed cap: it writes the count)',
  },
  {
    id: 'looseBallDuelCap',
    file: 'src/ai/TeamBrain.ts',
    line: '    if (possession === -1) count = Math.min(count, 1);',
    klass: 'cap',
    what: 'A LOOSE BALL IS A DUEL: one contester per team, by hand (Phase 30.5)',
  },
  {
    id: 'transitionThirdPresser',
    file: 'src/ai/TeamBrain.ts',
    line: '        if (tp > 0.3) count = Math.min(count + 1, 3);',
    klass: 'cap',
    what: 'THE WINDOW-BOUNDED THIRD PRESSER (Phase 112): the one licensed exception to '
      + '"NEVER three", itself capped by hand at three',
  },
  {
    id: 'transitionDropCap',
    file: 'src/ai/TeamBrain.ts',
    line: '        else if (tp < -0.3) count = Math.min(count, 1);',
    klass: 'cap',
    what: 'the drop-and-recover side\'s token single chaser in the same window',
  },
  {
    id: 'restartChaserCount',
    file: 'src/ai/TeamBrain.ts',
    line: '  if (match.phase === \'restart\') count = match.restart?.kind === \'goalKick\' ? 0 : 1;',
    klass: 'cap',
    what: 'restart chaser counts written literally (0 for a goal kick, else 1)',
  },
  {
    id: 'schemeSwitch',
    file: 'src/ai/TeamBrain.ts',
    line: '  const zonal = team.style.scheme === \'zonal\';',
    klass: 'scheme',
    what: 'THE MARKING SCHEME IS AN ENUM: man or zonal, a discrete team identity — the '
      + 'doctrine\'s "never an enum" clause names exactly this',
  },
  {
    id: 'zonalEngageRadius9',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (zones && !boxThreat && dist(zones.get(p.index)!, threat.pos) > 9) continue;',
    klass: 'scheme',
    what: 'THE ZONE RADIUS: 9 m from a defender\'s formation spot decides whether he may '
      + 'engage at all',
  },
  {
    id: 'markRange22',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };',
    klass: 'scheme',
    what: 'THE MARK RANGE: 22 m, and the choice is nearest-first greedy — no price, no '
      + 'threat value, no teammate state',
  },
  {
    id: 'widthDisciplineWG',
    file: 'src/ai/TeamBrain.ts',
    line: '      if (p.role === \'WG\' && Math.abs(p.pos.y) > 12 && Math.abs(threat.pos.y) < 8) continue;',
    klass: 'role-bias',
    what: 'THE ROLE-CONDITIONED VETO: a wide WG may not take a central threat (12 m / 8 m '
      + 'by hand) — a hand-coded style, exactly what M-DF.3 wants EMERGENT',
  },
  {
    id: 'markStanceBand',
    file: 'src/ai/actionExecutor.ts',
    line: '        let markDist = ball.owner === mark ? 2.6 : 2.6 - g.markingAggression * 1.4;',
    klass: 'other-constant',
    what: 'THE TIGHTNESS BAND: 2.6 m base, 1.4 m of gene-driven span — the CONTINUOUS half '
      + 'that already exists (the L3/MT arc\'s ratified law)',
  },
  {
    id: 'l3SagSeam',
    file: 'src/ai/actionExecutor.ts',
    line: '          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);',
    klass: 'other-constant',
    what: '⭐ THE ACCESS-TIME ACCOUNT AT ITS CONSUMER: the shipped continuous 盯多紧 law the '
      + 'DF surface is meant to consume — proof the account is LIVE, not hypothetical',
  },
  {
    id: 'jockeyGate025',
    file: 'src/ai/actionExecutor.ts',
    line: '      if (carrier && carrier.side !== p.side && jockey > 0.25 && goalSideOfCarrier && !dangerZone) {',
    klass: 'threshold',
    what: 'THE CONTAIN GATE: a gene crossing 0.25 flips jockeying on — a discrete gate on a '
      + 'continuous gene',
  },
  {
    id: 'trapHoldBlend',
    file: 'src/ai/actionExecutor.ts',
    line: '        const trapHold = ((g.trapBias ?? 0.5) - 0.5) * 2;',
    klass: 'other-constant',
    what: 'THE OFFSIDE-TRAP HOLD: a per-body blend toward the formation spot — the closest '
      + 'thing to a line step that exists, and it is per-body, not a line act',
  },
  {
    id: 'coverBiasClamp',
    file: 'src/ai/formations.ts',
    line: '      if (!abandonRest) x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);',
    klass: 'other-constant',
    what: 'THE REST-DEFENCE DEPTH CLAMP: the libero/stopper axis as a positional clamp',
  },
];

interface LiteralSite {
  construct: string; file: string; line: number; literal: string; klass: LiteralClass;
  text: string;
}
interface ConstructSpan {
  id: string; file: string; startLine: number; endLine: number; codeLines: number;
  literalSites: number; tokenHits: Record<string, number>;
}
/**
 * ⭐ WHERE EACH KIND OF MATCH HAPPENS, AND WHY. An ANCHOR (a construct boundary, a named
 * rule) is located on the RAW source line, because a receipt is a receipt about the file a
 * human opens — and a line carrying a STRING LITERAL (`'Press'`, `'zonal'`) exists only in
 * the raw text once the tokenizer has done its job. The anchor is then REQUIRED to be REAL
 * CODE: its stripped counterpart must be non-empty, so a commented-out twin of an anchor
 * line can never be mistaken for the site. The LITERAL CENSUS itself runs on the STRIPPED
 * text — comments and string contents cannot contribute a single counted number.
 */
const anchorIsCode = (rawLine: string, strippedLine: string, anchor: string): boolean =>
  rawLine === anchor && strippedLine.trim().length > 0;
const scanInventory = (stripper: (s: string) => string): {
  spans: ConstructSpan[]; sites: LiteralSite[]; anchorsOk: boolean;
  anchorReport: Array<{ id: string; firstHits: number; lastHits: number; ordered: boolean }>;
  strippedByFile: Record<string, string>;
} => {
  const spans: ConstructSpan[] = [];
  const sites: LiteralSite[] = [];
  const anchorReport: Array<{ id: string; firstHits: number; lastHits: number; ordered: boolean }> = [];
  const strippedByFile: Record<string, string> = {};
  const rawByFile: Record<string, string> = {};
  const files = [...new Set(CONSTRUCTS.map((c) => c.file))];
  for (const f of files) {
    rawByFile[f] = readFileSync(f, 'utf8');
    strippedByFile[f] = stripper(rawByFile[f]);
  }
  let anchorsOk = true;
  for (const c of CONSTRUCTS) {
    const lines = strippedByFile[c.file].split('\n');
    const rawLines = rawByFile[c.file].split('\n');
    const firstIdx: number[] = [];
    const lastIdx: number[] = [];
    rawLines.forEach((l, i) => {
      if (anchorIsCode(l, lines[i] ?? '', c.firstLine)) firstIdx.push(i);
      if (anchorIsCode(l, lines[i] ?? '', c.lastLine)) lastIdx.push(i);
    });
    const ordered = firstIdx.length === 1 && lastIdx.length === 1 && lastIdx[0] > firstIdx[0];
    anchorReport.push({ id: c.id, firstHits: firstIdx.length, lastHits: lastIdx.length, ordered });
    if (!ordered) { anchorsOk = false; continue; }
    const tokenHits: Record<string, number> = {};
    let codeLines = 0;
    let literalCount = 0;
    for (let i = firstIdx[0]; i <= lastIdx[0]; i++) {
      const text = lines[i];
      if (text.trim().length > 0) codeLines += 1;
      LITERAL_RE.lastIndex = 0;
      let m = LITERAL_RE.exec(text);
      while (m !== null) {
        sites.push({
          construct: c.id, file: c.file, line: i + 1, literal: m[0],
          klass: classifyLiteral(text), text: text.trim(),
        });
        literalCount += 1;
        m = LITERAL_RE.exec(text);
      }
      for (const t of TOKEN_NEEDLES) {
        let from = 0;
        for (;;) {
          const at = text.indexOf(t, from);
          if (at < 0) break;
          tokenHits[t] = (tokenHits[t] ?? 0) + 1;
          from = at + t.length;
        }
      }
    }
    spans.push({
      id: c.id, file: c.file, startLine: firstIdx[0] + 1, endLine: lastIdx[0] + 1,
      codeLines, literalSites: literalCount, tokenHits,
    });
  }
  return { spans, sites, anchorsOk, anchorReport, strippedByFile };
};

const INV = scanInventory(strip);
const INV_NAIVE = scanInventory(stripComments);

/** the named-rule extraction: an EXACT-LINE anchored match, counted, receipt = the line no. */
const namedRuleReceipts = NAMED_RULES.map((r) => {
  const stripped = (INV.strippedByFile[r.file] ?? strip(readFileSync(r.file, 'utf8'))).split('\n');
  const raw = readFileSync(r.file, 'utf8').split('\n');
  const hits: number[] = [];
  raw.forEach((l, i) => { if (anchorIsCode(l, stripped[i] ?? '', r.line)) hits.push(i + 1); });
  const inConstruct = hits.length === 1
    ? INV.spans.find((s) => s.file === r.file && hits[0] >= s.startLine && hits[0] <= s.endLine)?.id ?? null
    : null;
  return {
    id: r.id, file: r.file, matches: hits.length, line: hits.length === 1 ? hits[0] : -1,
    receipt: hits.length === 1 ? `${r.file}:${hits[0]}` : 'NOT-UNIQUELY-ANCHORED',
    klass: r.klass, what: r.what, insideConstruct: inConstruct, lineVerbatim: r.line,
  };
});
const NAMED_RULES_OK = namedRuleReceipts.every((r) => r.matches === 1 && r.insideConstruct !== null);

/** the class census over the enumerated literal sites */
const LITERAL_CLASSES: readonly LiteralClass[] = ['cap', 'threshold', 'scheme', 'role-bias',
  'other-constant'];
const literalsByClass = Object.fromEntries(LITERAL_CLASSES
  .map((k) => [k, INV.sites.filter((s) => s.klass === k).length])) as Record<LiteralClass, number>;
const literalsByConstruct = Object.fromEntries(CONSTRUCTS
  .map((c) => [c.id, INV.sites.filter((s) => s.construct === c.id).length]));
const tokenNeedleCounts = Object.fromEntries(TOKEN_NEEDLES.map((t) => [t,
  sum(INV.spans.map((s) => s.tokenHits[t] ?? 0))]));

/* ---- corpus integrity: the mutant oracle must DISCRIMINATE on THIS corpus ---- */
const balanceOf = (text: string): { paren: number; brace: number; bracket: number; residue: string[] } => {
  let paren = 0; let brace = 0; let bracket = 0;
  for (const ch of text) {
    if (ch === '(') paren += 1; else if (ch === ')') paren -= 1;
    else if (ch === '{') brace += 1; else if (ch === '}') brace -= 1;
    else if (ch === '[') bracket += 1; else if (ch === ']') bracket -= 1;
  }
  const residue: string[] = [];
  if (text.includes('/*')) residue.push('/*');
  if (text.includes('*/')) residue.push('*/');
  if (text.includes('//')) residue.push('//');
  return { paren, brace, bracket, residue };
};
const corpusFiles = [...new Set(CONSTRUCTS.map((c) => c.file))].sort();
const balanceRows = corpusFiles.map((f) => ({ file: f, ...balanceOf(INV.strippedByFile[f]) }));
const naiveBalanceRows = corpusFiles.map((f) => ({ file: f, ...balanceOf(INV_NAIVE.strippedByFile[f]) }));
const bad = (b: { paren: number; brace: number; bracket: number; residue: string[] }): boolean =>
  b.paren !== 0 || b.brace !== 0 || b.bracket !== 0 || b.residue.length > 0;
const balanceFailures = balanceRows.filter(bad);
const naiveBalanceFailures = naiveBalanceRows.filter(bad);
/** per-file CODE-LINE deficit the naive stripper inflicts on THIS corpus (the truncation) */
const naiveDeficits = corpusFiles.map((f) => {
  const tok = INV.strippedByFile[f].split('\n');
  const nai = INV_NAIVE.strippedByFile[f].split('\n');
  let swallowed = 0;
  let tails = 0;
  for (let i = 0; i < tok.length; i++) {
    const a = (tok[i] ?? '').trim();
    const b = (nai[i] ?? '').trim();
    if (a.length > 0 && b.length === 0) swallowed += 1;
    else if (a.length > 0 && b.length > 0 && a !== b) tails += 1;
  }
  return { file: f, codeLinesSwallowedByNaive: swallowed, linesAlteredByNaive: tails };
}).filter((d) => d.codeLinesSwallowedByNaive > 0 || d.linesAlteredByNaive > 0);
/** the naive stripper's own anchor result: the truncation destroys the corpus definition */
const NAIVE_ANCHORS_OK = INV_NAIVE.anchorsOk;
const naiveLiteralTotal = INV_NAIVE.sites.length;

/* ========================================================================== */
/* §3 (c) THE ZONAL/CHAIN PRIMITIVE-GAP ANALYSIS (code facts, classed)         */
/* ========================================================================== */
/**
 * Every row is CODE FACTS: what the primitive would CONSUME, and the class of each
 * consumed item. Receipts are EXACT LINES, re-verified verbatim against src at run time
 * (`gGapReceiptsVerbatim`) — a receipt that drifts turns the gate RED rather than
 * decorating a claim. NO speculation beyond the classing: the "would consume" column names
 * quantities, not designs.
 */
type GapClass = 'exists-live' | 'exists-dormant' | 'MISSING';
interface GapItem { item: string; klass: GapClass; receiptFile?: string; receiptLine?: string; note: string }
interface GapRow { primitive: string; consumes: GapItem[] }
const GAP_ROWS: readonly GapRow[] = [
  {
    primitive: 'A LINE-LINK (链式防守: my depth is a function of my line-mates\' depth)',
    consumes: [
      {
        item: 'my own formation depth as a function of the ball and my role',
        klass: 'exists-live',
        receiptFile: 'src/ai/formations.ts',
        receiptLine: '      if (!abandonRest) x = Math.min(x, -8 - (g.coverBias ?? 0.5) * 8);',
        note: 'depth exists, and coverBias moves it — but it is computed PER BODY from the '
          + 'ball and the gene, never from a neighbour\'s state',
      },
      {
        item: 'the positions of my adjacent line-mates as an INPUT to my own station',
        klass: 'MISSING',
        note: 'no station term anywhere reads another defender\'s position: the station '
          + 'field is a per-body function of (ball, role, genes). A chain needs a '
          + 'neighbour term and there is none to switch on.',
      },
      {
        item: 'a shared line reference (the line\'s own y/x, agreed between bodies)',
        klass: 'MISSING',
        note: 'no team-level defensive-line object exists; `Team` carries `marks`, '
          + '`chasers`, `runners`, `arriver`, `overlapper` and no line state.',
      },
    ],
  },
  {
    primitive: 'A COVER ROTATION (补位: he went, so I take his zone)',
    consumes: [
      {
        item: 'the fact that a team-mate has left his post (a commitment with a lifetime)',
        klass: 'exists-dormant',
        receiptFile: 'src/ai/defensiveCoordination.ts',
        receiptLine: 'export function createDefensiveMovementCommitment(',
        note: '⭐ A COMMITMENT PRIMITIVE EXISTS AND IS UNWIRED: `defensiveCoordination.ts` '
          + 'builds observer-grounded commitments (target point, arrival time, valid-until '
          + 'tick) and cover-coordination FACTS — and nothing in `src/**` imports it.',
      },
      {
        item: 'observer-grounded arrival-time comparisons between me and the committed body',
        klass: 'exists-dormant',
        receiptFile: 'src/ai/defensiveCoordination.ts',
        receiptLine: 'export function evaluateDefensiveCoverCoordination(',
        note: 'the dormant module already computes selfArrival/committedArrival and a '
          + 'relatively-exposed outlet — facts, deliberately with no action permission.',
      },
      {
        item: 'an ACTION a defender can take to occupy a vacated zone',
        klass: 'MISSING',
        note: 'the defensive action menu is chase-if-assigned / mark-if-assigned / hold the '
          + 'formation spot; there is no "take that zone" action to price.',
      },
    ],
  },
  {
    primitive: 'A MARK HANDOFF (换人盯: you take mine, I take yours)',
    consumes: [
      {
        item: 'the current assignment map',
        klass: 'exists-live',
        receiptFile: 'src/ai/TeamBrain.ts',
        receiptLine: '      team.marks.set(best.idx, threat.index);',
        note: 'assignments exist — as a map the TEAM rewrites wholesale.',
      },
      {
        item: 'assignment PERSISTENCE (a mark I keep until a handoff is agreed)',
        klass: 'MISSING',
        receiptFile: 'src/ai/TeamBrain.ts',
        receiptLine: '  team.marks.clear();',
        note: '⭐ THE MECHANISM OF 乱跑, IN ONE LINE: every assignment pass CLEARS the whole '
          + 'map and re-runs the greedy scan, so a "switch" costs nothing and is not even '
          + 'represented — there is no state that a handoff could hand off.',
      },
      {
        item: 'a channel to agree the swap (shared information / the coach)',
        klass: 'MISSING',
        note: 'DEF-DOCTRINE §2 item 3 assigns this to the six-source cluster; no shared '
          + 'snapshot or coach channel exists to consume.',
      },
    ],
  },
  {
    primitive: 'AN OFFSIDE-TRAP STEP (造越位: the line steps together, now)',
    consumes: [
      {
        item: 'the offside law itself',
        klass: 'exists-live',
        receiptFile: 'src/sim/Match.ts',
        receiptLine: '    const trap = this.teams[defSide].info.genome.trapBias ?? 0.5;',
        note: 'offside is adjudicated by the world and the trap gene is already read there.',
      },
      {
        item: 'a per-body refusal to be dragged deeper (today\'s trap)',
        klass: 'exists-live',
        receiptFile: 'src/ai/actionExecutor.ts',
        receiptLine: '        const trapHold = ((g.trapBias ?? 0.5) - 0.5) * 2;',
        note: 'the trap is a PER-BODY blend toward the formation spot — a disposition, not '
          + 'an act, and not synchronised with anyone.',
      },
      {
        item: 'a synchronised STEP decision (one moment, all four bodies, now)',
        klass: 'MISSING',
        note: 'no team-level defensive act exists at all: `updateTeamBrain` hands out '
          + 'assignments and a mode, never a timed collective action.',
      },
    ],
  },
];

/* ========================================================================== */
/* §4 (e) THE DECISION-SURFACE SIZING (call sites · accounts · perf bound)      */
/* ========================================================================== */
/**
 * WHERE THE CHOOSER WOULD LIVE and WHAT IT COULD CONSUME TODAY — anchored receipts, all
 * re-verified verbatim (`gSizingReceiptsVerbatim`).
 */
interface SizingRow { id: string; file: string; line: string; role: string }
const SIZING_SITES: readonly SizingRow[] = [
  {
    id: 'callSite-assignChasers',
    file: 'src/ai/TeamBrain.ts',
    line: '  assignChasers(team, match);',
    role: 'THE CALL SITE: where "who presses" is decided today, once per team per '
      + 'TEAM_AI_INTERVAL — the natural seat for the per-defender chooser\'s press option.',
  },
  {
    id: 'callSite-assignMarks',
    file: 'src/ai/TeamBrain.ts',
    line: '  assignMarks(team, match);',
    role: 'THE CALL SITE: where "who marks whom" is decided today — the seat for the '
      + 'mark/cover/intercept options. Both calls sit in `updateTeamBrain`, one after the '
      + 'other, which is why ONE surface can replace both without a new tick.',
  },
  {
    id: 'consumer-playerBrainChase',
    file: 'src/ai/PlayerBrain.ts',
    line: '    if (team.chasers.has(p.index)) {',
    role: 'THE CONSUMER: the per-body option menu that reads the assignment. A continuous '
      + 'surface either scores here (per body, per tick) or is written into the same sets.',
  },
  {
    id: 'account-l3AccessTime',
    file: 'src/ai/actionExecutor.ts',
    line: '          if (w > 0) markDist += w * markSagMetres(ball.pos, mark.pos, p.pos, p.topSpeed);',
    role: 'ACCOUNT 1 — THE L3 ACCESS-TIME ACCOUNT, live at its consumer: t_ball − t_self is '
      + 'already computed and already priced into tightness. The same slack is the natural '
      + 'price of press-vs-hold.',
  },
  {
    id: 'account-defenceBook',
    file: 'src/ai/defenceBook.ts',
    line: 'export class DefenceAccountBook {',
    role: 'ACCOUNT 2 — THE DEFENCE BOOKS (learned lunge outcomes by arrival group), live in '
      + 'world 9 via l3DefenceLearn/l3DefenceVeto: the learned half of "what does this '
      + 'commitment cost me".',
  },
  {
    id: 'account-l3Decline',
    file: 'src/sim/mechanics.ts',
    line: '    if (match.l3DefenceDeclines(oppTeam.side, l3Group)) return;',
    role: 'ACCOUNT 3 — COMMITMENT PHYSICS, at its live decline site: the book already vetoes '
      + 'a reckless arrival. A priced surface reads the same account BEFORE choosing, '
      + 'instead of declining after.',
  },
  {
    id: 'account-commitmentDormant',
    file: 'src/ai/defensiveCoordination.ts',
    line: 'export function createDefensiveMovementCommitment(',
    role: 'ACCOUNT 4 — DORMANT: observer-grounded commitments + cover facts, built and '
      + 'unwired (nothing in src imports this module). Available to the surface at zero new '
      + 'mechanism cost, but it consumes SNAPSHOTS — the IN interlock.',
  },
];

/* ========================================================================== */
/* §5 THE WORLD — WORLD 9 for the 乱跑 battery (IN-C0/BK-T2's construction)     */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha256(L3_BYTES);
const PC_BYTES_SHA = sha256(PC_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_DOSE: readonly (readonly number[])[] = poolPcDoseTable(
  JSON.parse(PC_BYTES) as Record<string, unknown>,
);
const DF_WORLD = 8 as const;
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const buildMatch = (seed: number): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(DF_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, DF_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
const worldConjuncts = (m: Match): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: { books: { count(ri: number, key: string): number }[] } | null;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
  };
  const booksDosed = mm.pcLatency !== null && mm.pcLatency.books.every((b) => {
    for (let ri = 0; ri < ROSTER_SIZE; ri++) {
      for (let c = 0; c < PC_BOOK_CELLS.length; c++) {
        if (b.count(ri, PC_BOOK_CELLS[c]) !== PC_DOSE[ri][c]) return false;
      }
    }
    return true;
  });
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  return {
    armedVersionIsWorldNine: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    /** the defence books are the account the DF surface would consume — armed here */
    l3DefenceDoorsArmed: mm.l3DefenceLearn === true && mm.l3DefenceVeto === true,
  };
};

/* ========================================================================== */
/* §6 (b) THE 乱跑 INSTRUMENT — definitions frozen here                        */
/* ========================================================================== */
/**
 * ⭐ THE dupRun LINEAGE, REUSED VERBATIM. `DUP_RUN_M = 4` is the duplicate-target radius of
 * the P3′/MT/PM ruler family — `scripts/probes/mt-t1-ruler-rerun.ts:235` (`const DUP_RUN_M =
 * 4;`), documented in MT-T1-RULER-RERUN.md and PM-T1-COMPRESSION-EXAM.md as "the P3′
 * duplicate-run radius". The attacking face asks whether two licensed RUNNERS aim at points
 * within 4 m; the DEFENSIVE analogue asks whether two assigned defenders aim at targets
 * within 4 m. Same radius, same pairwise test, same tick denominator — the lineage is
 * inherited, not re-invented.
 *
 * `familyOf` is likewise the ruler family's own function (mt-t1-ruler-rerun.ts:343),
 * COPIED VERBATIM and drift-gated (`gFamilyOfVerbatim`).
 */
const DUP_RUN_M = 4;
type Family = 'ONBALL' | 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'OTHER';
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
 * ⭐ THE SWARM RADII — DERIVED FROM THE CODE, never chosen (#200). Both are src-extracted
 * constants pinned to NAMED call sites (the anchored-extraction canon):
 *   · `SWARM_R_STANCE` = the mark stance base distance, 2.6 m — extracted from
 *     `markStanceBand` (actionExecutor.ts, the NAMED_RULES row). A body inside it is
 *     closer to the carrier than the engine's own containment stand-off.
 *   · `SWARM_R_ZONE` = the zonal engage radius, 9 m — extracted from `zonalEngageRadius9`
 *     (TeamBrain.ts). A body inside it is inside the engine's own "this is my problem" range.
 */
const extractNumber = (ruleId: string, re: RegExp): number => {
  const r = NAMED_RULES.find((x) => x.id === ruleId);
  const receipt = namedRuleReceipts.find((x) => x.id === ruleId);
  if (r === undefined || receipt === undefined || receipt.matches !== 1) return Number.NaN;
  const m = re.exec(r.line);
  return m === null ? Number.NaN : Number(m[1]);
};
const SWARM_R_STANCE = extractNumber('markStanceBand', /mark \? (\d+(?:\.\d+)?) :/);
const SWARM_R_ZONE = extractNumber('zonalEngageRadius9', /threat\.pos\) > (\d+(?:\.\d+)?)\)/);
const MODE_THRESHOLD = extractNumber('modeThreshold062', /pressScore > (\d+(?:\.\d+)?) \?/);
const PRESS_GENE_CUT = extractNumber('presserSecond078', /pressIntensity > (\d+(?:\.\d+)?)\)/);
const MARK_RANGE = extractNumber('markRange22', /d < (\d+(?:\.\d+)?) &&/);
const EXTRACTS = {
  SWARM_R_STANCE, SWARM_R_ZONE, MODE_THRESHOLD, PRESS_GENE_CUT, MARK_RANGE,
};
const EXTRACTS_OK = SWARM_R_STANCE === 2.6 && SWARM_R_ZONE === 9 && MODE_THRESHOLD === 0.62
  && PRESS_GENE_CUT === 0.78 && MARK_RANGE === 22;

/** the re-target latency bins: 8 bins of 0.5 SIM-SECONDS, last bin = 3.5 s and over */
const LAT_BINS = 8;
const LAT_BIN_S = 0.5;
const latBinOf = (s: number): number => Math.min(LAT_BINS - 1, Math.floor(s / LAT_BIN_S));
/** the swarm histograms: number of defending outfield bodies inside a radius, 0..5+ */
const SWARM_BINS = 6;

interface Row {
  seed: number;
  worldOk: boolean;
  ticks: number;
  playingTicks: number;
  /** team-ticks in which the team was OUT of possession (the churn denominator's parent) */
  defTeamTicks: number;
  /** body-ticks: a non-GK, not-sent-off body on a team that does not own the ball */
  defenderTicks: number;
  markSwitches: number;
  markAbandons: number;
  markStarts: number;
  chaseStarts: number;
  chaseAbandons: number;
  /** ticks a body spent with an assignment (mark) — the assignment-holding denominator */
  markHeldTicks: number;
  reTargetLatencyBins: number[];
  reTargetLatencyCount: number;
  reTargetLatencyTickSum: number;
  /** dupRun lineage: ticks with ≥2 MARK-family defenders, and those with a dup pair */
  markPairTicks: number;
  dupMarkTicks: number;
  /** ticks with ≥2 / ≥3 BALL-family bodies on the out-of-possession side */
  multiChase2Ticks: number;
  multiChase3Ticks: number;
  /** the carrier-present denominator for the swarm faces */
  carrierTicks: number;
  swarmStanceBins: number[];
  swarmZoneBins: number[];
  chaserCountBins: number[];
  goals: number;
  tackles: number;
  interceptions: number;
  stepWallMs: number;
}

const walk = (seed: number): Row => {
  const m = buildMatch(seed);
  const wOk = Object.values(worldConjuncts(m)).every(Boolean);
  const row: Row = {
    seed, worldOk: wOk, ticks: 0, playingTicks: 0, defTeamTicks: 0, defenderTicks: 0,
    markSwitches: 0, markAbandons: 0, markStarts: 0, chaseStarts: 0, chaseAbandons: 0,
    markHeldTicks: 0,
    reTargetLatencyBins: Array.from({ length: LAT_BINS }, () => 0),
    reTargetLatencyCount: 0, reTargetLatencyTickSum: 0,
    markPairTicks: 0, dupMarkTicks: 0, multiChase2Ticks: 0, multiChase3Ticks: 0,
    carrierTicks: 0,
    swarmStanceBins: Array.from({ length: SWARM_BINS }, () => 0),
    swarmZoneBins: Array.from({ length: SWARM_BINS }, () => 0),
    chaserCountBins: Array.from({ length: 5 }, () => 0),
    goals: 0, tackles: 0, interceptions: 0, stepWallMs: 0,
  };
  /** per (side, index): the previous mark target, whether he was a chaser, and the tick he
   *  lost his mark (for the re-target latency) */
  const prevMark = new Map<number, number | null>();
  const prevChaser = new Map<number, boolean>();
  const lostAt = new Map<number, number>();
  const key = (side: number, idx: number): number => side * 100 + idx;
  const t0 = Date.now();
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    tick += 1;
    if (m.phase !== 'playing') continue;
    row.playingTicks += 1;
    const carrier = m.ball.owner;
    if (carrier !== null) row.carrierTicks += 1;
    for (const t of m.teams) {
      const side = t.side;
      const defending = m.possessionSide !== side;
      if (!defending) {
        /* leaving the defensive phase ends every pending latency clock: not a re-target */
        for (const p of t.players) lostAt.delete(key(side, p.index));
        continue;
      }
      row.defTeamTicks += 1;
      row.chaserCountBins[Math.min(4, t.chasers.size)] += 1;
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      row.defenderTicks += outfield.length;
      /* --- assignment churn, per body --- */
      const markTargets: Array<{ idx: number; pos: { x: number; y: number } }> = [];
      let ballFamily = 0;
      for (const p of outfield) {
        const k = key(side, p.index);
        const cur = t.marks.has(p.index) ? (t.marks.get(p.index) as number) : null;
        const prev = prevMark.has(k) ? (prevMark.get(k) as number | null) : null;
        if (cur !== null) row.markHeldTicks += 1;
        if (prev !== null && cur !== null && prev !== cur) {
          row.markSwitches += 1;
          const at = lostAt.get(k);
          if (at !== undefined) lostAt.delete(k);
        } else if (prev !== null && cur === null) {
          row.markAbandons += 1;
          lostAt.set(k, tick);
        } else if (prev === null && cur !== null) {
          row.markStarts += 1;
          const at = lostAt.get(k);
          if (at !== undefined) {
            const dTicks = tick - at;
            row.reTargetLatencyBins[latBinOf(dTicks * DT)] += 1;
            row.reTargetLatencyCount += 1;
            row.reTargetLatencyTickSum += dTicks;
            lostAt.delete(k);
          }
        }
        prevMark.set(k, cur);
        const isChaser = t.chasers.has(p.index);
        const wasChaser = prevChaser.get(k) === true;
        if (isChaser && !wasChaser) row.chaseStarts += 1;
        if (!isChaser && wasChaser) row.chaseAbandons += 1;
        prevChaser.set(k, isChaser);
        /* the dupRun-lineage target: a MARK-family body aims at his mark's body */
        const fam = familyOf(p, m);
        if (fam === 'MARK' && cur !== null) {
          const target = m.teams[1 - side].players[cur];
          if (target !== undefined) markTargets.push({ idx: p.index, pos: target.pos });
        }
        if (fam === 'BALL') ballFamily += 1;
      }
      if (markTargets.length >= 2) {
        row.markPairTicks += 1;
        let dup = false;
        for (let i = 0; i < markTargets.length && !dup; i++) {
          for (let j = i + 1; j < markTargets.length && !dup; j++) {
            const dx = markTargets[i].pos.x - markTargets[j].pos.x;
            const dy = markTargets[i].pos.y - markTargets[j].pos.y;
            if (Math.hypot(dx, dy) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) row.dupMarkTicks += 1;
      }
      if (ballFamily >= 2) row.multiChase2Ticks += 1;
      if (ballFamily >= 3) row.multiChase3Ticks += 1;
      /* --- the swarm's own face: defending bodies inside the anchored radii --- */
      if (carrier !== null && carrier.side !== side) {
        let inStance = 0;
        let inZone = 0;
        for (const p of outfield) {
          const d = Math.hypot(p.pos.x - carrier.pos.x, p.pos.y - carrier.pos.y);
          if (d < SWARM_R_STANCE) inStance += 1;
          if (d < SWARM_R_ZONE) inZone += 1;
        }
        row.swarmStanceBins[Math.min(SWARM_BINS - 1, inStance)] += 1;
        row.swarmZoneBins[Math.min(SWARM_BINS - 1, inZone)] += 1;
      }
    }
  }
  row.stepWallMs = Date.now() - t0;
  row.goals = m.score[0] + m.score[1];
  for (const t of m.teams) {
    row.tackles += t.stats.tackles;
    row.interceptions += t.stats.interceptions;
  }
  return row;
};

/* ========================================================================== */
/* §7 (d) THE SEASON LADDER — the arms, the genes, the LAWFUL FREEZE            */
/* ========================================================================== */
/**
 * ⭐⭐ THE GENE PARTITION — read off the genome's own documentation (src/evolution/genome.ts)
 * and PARTITION-GATED (`gGenePartition`): DEFENCE ∪ ATTACK ∪ NEUTRAL = GENE_KEYS exactly,
 * pairwise disjoint. A gene is DEFENCE-RELEVANT iff its documented consumer is the
 * out-of-possession game (pressing, compactness, marking, the keeper's line, the block's
 * height, the three defensive schools, the transition instant). ATTACK-RELEVANT iff its
 * consumer is the in-possession game. NEUTRAL = the club-management / personality genes.
 */
const DEF_GENES = ['pressIntensity', 'defensiveCompactness', 'markingAggression',
  'keeperAggression', 'formationDepth', 'jockeyBias', 'coverBias', 'trapBias',
  'transitionPress'] as const;
const ATK_GENES = ['passBias', 'shootBias', 'dribbleBias', 'attackingWidth', 'riskTolerance',
  'counterAttackBias', 'tempo', 'supportDistance'] as const;
const NEUTRAL_GENES = ['staminaConservation', 'rotationBias', 'underdogShift', 'tinkerBias',
  'fitBias', 'moraleSensitivity'] as const;
/** the STYLE components: the marking scheme and the defensive shape are defensive identity */
const DEF_STYLE_KEYS = ['formationDef', 'scheme'] as const;
const ATK_STYLE_KEYS = ['formationAtk'] as const;
const GENE_PARTITION_OK = (() => {
  const all = [...DEF_GENES, ...ATK_GENES, ...NEUTRAL_GENES] as readonly string[];
  const keys = GENE_KEYS as readonly string[];
  return all.length === keys.length && new Set(all).size === all.length
    && all.every((k) => keys.includes(k));
})();

type ArmId = 'both' | 'defFrozen' | 'atkFrozen';
const ARMS: readonly ArmId[] = ['both', 'defFrozen', 'atkFrozen'];
const ARM_NOTE: Record<ArmId, string> = {
  both: 'THE LIVE WORLD — nothing frozen; the shipped evolution runs untouched.',
  defFrozen: 'ATTACK EVOLVES × DEFENCE FROZEN — the defence-relevant genes and the '
    + 'defensive style components are re-copied to their gen-1 values after every shipped '
    + 'finishSeason(); attack genes, neutral genes, squads, careers and coaches evolve.',
  atkFrozen: 'THE CONVERSE — attack-relevant genes + formationAtk frozen at gen-1; the '
    + 'defensive half evolves.',
};
const frozenKeysOf = (arm: ArmId): { genes: readonly string[]; style: readonly string[] } => {
  if (arm === 'defFrozen') return { genes: DEF_GENES, style: DEF_STYLE_KEYS };
  if (arm === 'atkFrozen') return { genes: ATK_GENES, style: ATK_STYLE_KEYS };
  return { genes: [], style: [] };
};

interface LadderCell {
  arm: ArmId; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; shotsOnTarget: number; xg: number;
  tackles: number; interceptions: number; clearances: number; blocks: number;
  passes: number; passesCompleted: number;
  /** the freeze receipt for this generation: frozen keys checked, and drift found */
  frozenKeysChecked: number; frozenKeyDrift: number;
  /** the SERIALIZED receipt: keys verified on the generation's first fixture's TeamInfo */
  serializedKeysChecked: number; serializedKeyDrift: number;
  /** the liveness half: how far the NON-frozen genes moved from gen-1 (mean |Δ| per gene) */
  frozenGeneMeanAbsDelta: number; freeGeneMeanAbsDelta: number;
  wallSeconds: number;
}

const runLadderArm = (arm: ArmId, leagueSeed: number, gens: number): LadderCell[] => {
  const league = new League({ seed: leagueSeed });
  const { genes: fGenes, style: fStyle } = frozenKeysOf(arm);
  /** gen-1 values, per SLOT — captured before a single match is played */
  const gen1 = new Map<number, { genome: Record<string, number>; style: Record<string, string> }>();
  for (const f of league.franchises) {
    gen1.set(f.slot, {
      genome: Object.fromEntries((GENE_KEYS as readonly string[])
        .map((k) => [k, (f.coach.genome as unknown as Record<string, number>)[k]])),
      style: Object.fromEntries(([...DEF_STYLE_KEYS, ...ATK_STYLE_KEYS] as readonly string[])
        .map((k) => [k, (f.coach.style as unknown as Record<string, string>)[k]])),
    });
  }
  /**
   * ⭐⭐ THE LAWFUL FREEZE. It writes the frozen sub-vector onto `f.coach.genome` /
   * `f.coach.style` — THE EXACT FIELDS the shipped evolution writer mutates
   * (`evolveGroup`: `coach.genome = mutateGenome(...)`, `mutateStyle(coach.style, ...)`) —
   * and NEVER onto a match's `info.genome` (the dose-placement canon). `League.createMatch`
   * then serializes the franchise's coach genome into `TeamInfo` exactly as it always does;
   * §7's per-generation SERIALIZED receipt reads that value back out of a real match object.
   * Consumes NO RNG, so determinism is untouched.
   *
   * ⚠ STATED LIMIT: freezing is by SLOT. A slot that REBIRTHS gets a brand-new club whose
   * frozen half is nonetheless the gen-1 vector — which is precisely the counterfactual the
   * arm asks for (「防守这一半从来没进化过」), and it is disclosed, not hidden. Squad
   * ATTRIBUTES (defending / positioning / pace) develop and cross over in EVERY arm: this
   * ladder freezes the TACTICAL GENOME half, never the players. That is the honest scope.
   */
  const applyFreeze = (): { checked: number; drift: number } => {
    let checked = 0;
    let drift = 0;
    for (const f of league.franchises) {
      const snap = gen1.get(f.slot);
      if (snap === undefined) continue;
      const g = f.coach.genome as unknown as Record<string, number>;
      for (const k of fGenes) {
        checked += 1;
        if (g[k] !== snap.genome[k]) drift += 1;
        g[k] = snap.genome[k];
      }
      const st = f.coach.style as unknown as Record<string, string>;
      for (const k of fStyle) {
        checked += 1;
        if (st[k] !== snap.style[k]) drift += 1;
        st[k] = snap.style[k];
      }
    }
    return { checked, drift };
  };
  const verifyFrozen = (): { checked: number; drift: number } => {
    let checked = 0;
    let drift = 0;
    for (const f of league.franchises) {
      const snap = gen1.get(f.slot);
      if (snap === undefined) continue;
      const g = f.coach.genome as unknown as Record<string, number>;
      for (const k of fGenes) { checked += 1; if (g[k] !== snap.genome[k]) drift += 1; }
      const st = f.coach.style as unknown as Record<string, string>;
      for (const k of fStyle) { checked += 1; if (st[k] !== snap.style[k]) drift += 1; }
    }
    return { checked, drift };
  };
  const geneDrift = (keys: readonly string[]): number => {
    if (keys.length === 0) return Number.NaN;
    const deltas: number[] = [];
    for (const f of league.franchises) {
      const snap = gen1.get(f.slot);
      if (snap === undefined) continue;
      const g = f.coach.genome as unknown as Record<string, number>;
      for (const k of keys) deltas.push(Math.abs(g[k] - snap.genome[k]));
    }
    return mean(deltas);
  };

  const cells: LadderCell[] = [];
  for (let gen = 1; gen <= gens; gen++) {
    const tGen = Date.now();
    let matches = 0;
    const acc = {
      goals: 0, shots: 0, shotsOnTarget: 0, xg: 0, tackles: 0, interceptions: 0,
      clearances: 0, blocks: 0, passes: 0, passesCompleted: 0,
    };
    /* --- the SERIALIZED freeze receipt: read the first fixture's TeamInfo back --- */
    let serializedKeysChecked = 0;
    let serializedKeyDrift = 0;
    let first = true;
    while (!league.seasonDone) {
      const fx = league.nextFixture();
      if (fx === null) break;
      const match = league.createMatch(fx);
      if (first) {
        first = false;
        for (const side of [0, 1] as const) {
          const info = (match as unknown as { teams: Array<{ info: TeamInfo }> }).teams[side].info;
          const slot = side === 0 ? fx.home : fx.away;
          const snap = gen1.get(slot);
          const ig = info.genome as unknown as Record<string, number>;
          const ist = (info.style ?? {}) as unknown as Record<string, string>;
          if (snap !== undefined) {
            for (const k of fGenes) {
              serializedKeysChecked += 1;
              if (ig[k] !== snap.genome[k]) serializedKeyDrift += 1;
            }
            for (const k of fStyle) {
              serializedKeysChecked += 1;
              if (ist[k] !== undefined && ist[k] !== snap.style[k]) serializedKeyDrift += 1;
            }
          }
        }
      }
      const res = match.runToCompletion();
      matches += 1;
      for (const s of res.stats) {
        acc.goals += s.goals;
        acc.shots += s.shots;
        acc.shotsOnTarget += s.shotsOnTarget;
        acc.xg += s.xg;
        acc.tackles += s.tackles;
        acc.interceptions += s.interceptions;
        acc.clearances += s.clearances;
        acc.blocks += s.blocks;
        acc.passes += s.passes;
        acc.passesCompleted += s.passesCompleted;
      }
      league.applyResult(fx, res);
    }
    const pre = verifyFrozen();
    cells.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, shotsOnTarget: acc.shotsOnTarget,
      xg: round(acc.xg, 4), tackles: acc.tackles, interceptions: acc.interceptions,
      clearances: acc.clearances, blocks: acc.blocks, passes: acc.passes,
      passesCompleted: acc.passesCompleted,
      frozenKeysChecked: pre.checked, frozenKeyDrift: pre.drift,
      serializedKeysChecked, serializedKeyDrift,
      frozenGeneMeanAbsDelta: round(geneDrift(fGenes), 6),
      freeGeneMeanAbsDelta: round(geneDrift(arm === 'defFrozen' ? ATK_GENES
        : arm === 'atkFrozen' ? DEF_GENES : GENE_KEYS as readonly string[]), 6),
      wallSeconds: round((Date.now() - tGen) / 1000, 1),
    });
    league.finishSeason();
    applyFreeze();
  }
  return cells;
};

/* ========================================================================== */
/* §8 SEEDS + THE STATS-BASE REGISTRY                                          */
/* ========================================================================== */
const BLOCK = 12_508_000;
const RECEIPT_SEED = BLOCK + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 250 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
const CHURN_SEEDS = Array.from({ length: N_SEEDS }, (_, i) => BLOCK + i);
const GENS_BY_MODE: Record<Mode, number> = { smoke: 2, full: 20 };
const LADDER_GENS = GENS_ENV ?? GENS_BY_MODE[MODE];
const LADDER_SEEDS_ALL = [BLOCK + 900, BLOCK + 901, BLOCK + 902, BLOCK + 903];
const LADDER_SEEDS = MODE === 'smoke' ? LADDER_SEEDS_ALL.slice(0, 1) : LADDER_SEEDS_ALL;
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED is reported after):
 *   12,508,000 – 12,508,249  the 乱跑 battery (250 world-9 walks; the smoke's 3 are the
 *                            first three of this range — the in-band smoke prefix)
 *   12,508,900 – 12,508,903  the season ladder's league seeds (the SAME four leagues in all
 *                            three arms — the paired design; booked once, walked 3×)
 *   12,508,999               the world-construction receipt (the xxx,999 convention)
 * The block is CONSUMED WHOLE of record either way.
 */
const R9_INHERITED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
  113_800, 102_200, 102_800, 103_200, 103_600, 103_800, 104_200, 104_600, 104_800, 105_200,
  105_800, 109_400, 109_600, 109_800, 110_000, 114_000,
];
/** IN-C0 / IN-C0-FIX consumed 114,200 (#317 item 4) — the one entry added since the sweep */
const REGISTRY_ADDITIONS: readonly number[] = [114_200];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 57
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 114_400;
const STATS_STEP = 200;
/** TWO draws, TWO bases, both booked: the churn cluster bootstrap and the ladder's own */
const STATS_BASES_CONSUMED = [STATS_BASE, STATS_BASE + STATS_STEP] as const;
const minStatsGap = Math.min(...STATS_BASES_CONSUMED
  .flatMap((mine) => STATS_PUBLISHED_BASES.map((b) => Math.abs(mine - b))));

/* ========================================================================== */
/* §9 THE CONSTRUCTION CLASS — refuse BEFORE any battery (nothing written)      */
/* ========================================================================== */
const receiptMatch = buildMatch(RECEIPT_SEED);
const RECEIPT = worldConjuncts(receiptMatch);
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
/* the gap/sizing receipts must exist VERBATIM in src (re-read, never trusted) */
const srcCache = new Map<string, string[]>();
const linesOf = (f: string): string[] => {
  if (!srcCache.has(f)) srcCache.set(f, readFileSync(f, 'utf8').split('\n'));
  return srcCache.get(f) as string[];
};
const verifyReceipt = (file: string, line: string): { ok: boolean; hits: number[] } => {
  const hits: number[] = [];
  linesOf(file).forEach((l, i) => { if (l === line) hits.push(i + 1); });
  return { ok: hits.length >= 1, hits };
};
const gapReceipts = GAP_ROWS.flatMap((r) => r.consumes
  .filter((c) => c.receiptFile !== undefined && c.receiptLine !== undefined)
  .map((c) => {
    const v = verifyReceipt(c.receiptFile as string, c.receiptLine as string);
    return {
      primitive: r.primitive, item: c.item, klass: c.klass,
      file: c.receiptFile as string, lineVerbatim: c.receiptLine as string,
      lines: v.hits, ok: v.ok,
    };
  }));
const sizingReceipts = SIZING_SITES.map((s) => {
  const v = verifyReceipt(s.file, s.line);
  return { ...s, lines: v.hits, ok: v.ok };
});
const GAP_RECEIPTS_OK = gapReceipts.every((r) => r.ok);
const SIZING_RECEIPTS_OK = sizingReceipts.every((r) => r.ok);
/** the tokenizer/familyOf verbatim gates (drift protection) */
const RESCAN_SRC = readFileSync(RESCAN_PROBE, 'utf8');
const SELF_SRC = readFileSync(SELF_PATH, 'utf8');
const MT_SRC = readFileSync('scripts/probes/mt-t1-ruler-rerun.ts', 'utf8');
const blockOf = (src: string, a: string, b: string): string | null => {
  const i = src.indexOf(a);
  if (i < 0) return null;
  const j = src.indexOf(b, i);
  if (j < 0) return null;
  return src.slice(i, j + b.length);
};
const VERBATIM_BLOCKS: readonly (readonly [string, string, string, string])[] = [
  ['tokenizer', RESCAN_PROBE, 'const REGEX_ALLOWED_AFTER = new Set(',
    'return out.join(\'\');\n};'],
  ['naiveStripper', RESCAN_PROBE, 'const stripComments = (src: string): string => {',
    'return out.split(\'\\n\').map((l) => l.split(\'//\')[0]).join(\'\\n\');\n};'],
  ['familyOf', 'scripts/probes/mt-t1-ruler-rerun.ts', 'const familyOf = (p: Player, m: Match): Family => {',
    'default: return \'OTHER\';\n  }\n};'],
  ['dupRunRadius', 'scripts/probes/mt-t1-ruler-rerun.ts', 'const DUP_RUN_M = 4;', 'const DUP_RUN_M = 4;'],
];
const verbatimChecks = VERBATIM_BLOCKS.map(([id, file, a, b]) => {
  const donor = file === RESCAN_PROBE ? RESCAN_SRC : MT_SRC;
  const d = blockOf(donor, a, b);
  const s = blockOf(SELF_SRC, a, b);
  return {
    id, donorFile: file, ok: d !== null && s !== null && d === s,
    bytes: d === null ? 0 : d.length, sha256: d === null ? '' : sha256(d),
  };
});
const VERBATIM_OK = verbatimChecks.every((c) => c.ok);
const CONSTRUCTION_OK = RECEIPT_OK && INV.anchorsOk && NAMED_RULES_OK && EXTRACTS_OK
  && GAP_RECEIPTS_OK && SIZING_RECEIPTS_OK && VERBATIM_OK && GENE_PARTITION_OK
  && REGISTRY_COMPLETE;
if (!CONSTRUCTION_OK) {
  banner('DF-C0 FATAL — the construction class BIT. Nothing is written.');
  banner(`  world receipt=${RECEIPT_OK} ${JSON.stringify(RECEIPT)}`);
  banner(`  anchors=${INV.anchorsOk} ${JSON.stringify(INV.anchorReport)}`);
  banner(`  namedRules=${NAMED_RULES_OK} extracts=${EXTRACTS_OK} ${JSON.stringify(EXTRACTS)}`);
  banner(`  gapReceipts=${GAP_RECEIPTS_OK} sizingReceipts=${SIZING_RECEIPTS_OK}`);
  banner(`  verbatim=${VERBATIM_OK} ${JSON.stringify(verbatimChecks)}`);
  banner(`  genePartition=${GENE_PARTITION_OK} registry=${REGISTRY_COMPLETE}`);
  process.exit(3);
}

/* ========================================================================== */
/* §10 THE BATTERIES                                                           */
/* ========================================================================== */
const tWall0 = Date.now();
banner(`DF-C0: mode=${MODE} churnN=${N_SEEDS} block=${BLOCK} ladder=${LADDER_SEEDS.length}`
  + ` leagues × ${LADDER_GENS} generations × ${ARMS.length} arms`);
const rows: Row[] = [];
let walksBooked = 1; /* the world receipt */
for (const seed of CHURN_SEEDS) {
  rows.push(walk(seed));
  walksBooked += 1;
  if (rows.length % 25 === 0) {
    banner(`  … churn ${rows.length}/${N_SEEDS} (${((Date.now() - tWall0) / 1000).toFixed(0)} s)`);
  }
}
const churnWallSec = round((Date.now() - tWall0) / 1000, 1);

const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
for (const arm of ARMS) {
  for (const ls of LADDER_SEEDS) {
    ladderCells.push(...runLadderArm(arm, ls, LADDER_GENS));
    banner(`  … ladder ${arm} seed ${ls} done (${((Date.now() - tLadder0) / 1000).toFixed(0)} s)`);
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 1);
const ladderLeagueSeasons = ARMS.length * LADDER_SEEDS.length * LADDER_GENS;
const ladderMatches = sum(ladderCells.map((c) => c.matches));

/* ========================================================================== */
/* §11 FACES — every published face is (numerator, denominator) + cluster CI    */
/* ========================================================================== */
interface FaceDef {
  num: (r: Row) => number;
  den: (r: Row) => number;
  unit: string;
  what: string;
  denNote: string;
}
const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;
const defenderMatches = (r: Row): number => (r.defenderTicks * DT) / MATCH_DURATION;
const CHURN_FACES: Record<string, FaceDef> = {
  markSwitchesPerDefenderMinute: {
    num: (r) => r.markSwitches, den: defenderMinutes,
    unit: 'switches per defender-minute (sim clock; 1 defender-minute = 60 sim-s a body '
      + 'spent out of possession)',
    what: '换人盯 as it happens today: a marker\'s assigned man CHANGES',
    denNote: 'denominator = defender body-ticks × DT / 60; MOVING with sent-offs and with '
      + 'possession share — disclosed per face',
  },
  markSwitchesPerDefenderMatch: {
    num: (r) => r.markSwitches, den: defenderMatches,
    unit: `switches per defender-match (the ${MATCH_DURATION} s match clock — the dual axis)`,
    what: 'the same count on the match clock (clock honesty)',
    denNote: 'denominator = defender body-ticks × DT / MATCH_DURATION',
  },
  markAbandonsPerDefenderMinute: {
    num: (r) => r.markAbandons, den: defenderMinutes,
    unit: 'abandonments per defender-minute',
    what: 'a marker LOSES his man with no replacement assignment',
    denNote: 'same defender-minute denominator',
  },
  markStartsPerDefenderMinute: {
    num: (r) => r.markStarts, den: defenderMinutes,
    unit: 'assignments per defender-minute',
    what: 'a body is GIVEN a mark (the churn cycle\'s other half)',
    denNote: 'same defender-minute denominator',
  },
  chaseStartsPerDefenderMinute: {
    num: (r) => r.chaseStarts, den: defenderMinutes,
    unit: 'chase starts per defender-minute',
    what: 'a body is licensed to hunt the ball',
    denNote: 'same defender-minute denominator',
  },
  chaseAbandonsPerDefenderMinute: {
    num: (r) => r.chaseAbandons, den: defenderMinutes,
    unit: 'chase abandonments per defender-minute',
    what: 'a licensed presser is DE-licensed mid-flight (the 疯狂抽动 shape)',
    denNote: 'same defender-minute denominator',
  },
  markHeldShare: {
    num: (r) => r.markHeldTicks, den: (r) => r.defenderTicks,
    unit: 'share of defender body-ticks',
    what: 'how much of his defending life a body actually HAS a mark',
    denNote: 'denominator = defender body-ticks (the assignment-holding population)',
  },
  dupMarkShare: {
    num: (r) => r.dupMarkTicks, den: (r) => r.markPairTicks,
    unit: `share of ≥2-marker team-ticks with two mark targets within ${DUP_RUN_M} m`,
    what: `THE dupRun-LINEAGE FACE, defensive side (radius reused verbatim: DUP_RUN_M = `
      + `${DUP_RUN_M})`,
    denNote: 'denominator = team-ticks with ≥2 MARK-family defenders — MOVES with how often '
      + 'the scheme assigns two markers at all',
  },
  multiChaseShare2: {
    num: (r) => r.multiChase2Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '≥2 bodies in the BALL family at once (the cap\'s own output)',
    denNote: 'denominator = out-of-possession team-ticks',
  },
  multiChaseShare3: {
    num: (r) => r.multiChase3Ticks, den: (r) => r.defTeamTicks,
    unit: 'share of out-of-possession team-ticks',
    what: '≥3 bodies in the BALL family — the "NEVER three" the cap bans, as it actually '
      + 'occurs (the transition window licenses it)',
    denNote: 'denominator = out-of-possession team-ticks',
  },
  swarmStanceShare2: {
    num: (r) => sum(r.swarmStanceBins.slice(2)), den: (r) => sum(r.swarmStanceBins),
    unit: `share of carrier-present defending team-ticks with ≥2 bodies inside `
      + `${SWARM_R_STANCE} m`,
    what: 'THE SWARM\'S OWN FACE at the shipped stance radius — the band the cap holds today '
      + '(H-DF.1(b) will be matched against this)',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
  },
  swarmZoneShare3: {
    num: (r) => sum(r.swarmZoneBins.slice(3)), den: (r) => sum(r.swarmZoneBins),
    unit: `share of carrier-present defending team-ticks with ≥3 bodies inside ${SWARM_R_ZONE} m`,
    what: 'the wider pile-up face at the zonal engage radius',
    denNote: 'denominator = defending team-ticks with a carrier on the pitch',
  },
  reTargetLatencyMeanS: {
    num: (r) => r.reTargetLatencyTickSum * DT, den: (r) => r.reTargetLatencyCount,
    unit: 'sim-seconds',
    what: 'how long a body waits between losing a mark and being given one',
    denNote: 'denominator = completed abandon→assign cycles (a cycle broken by the team '
      + 'regaining possession is DISCARDED, not truncated)',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: () => 1,
    unit: 'goals per match',
    what: 'the world-9 base rate at this battery\'s grain (the ladder\'s match-grain twin)',
    denNote: 'one match per seed',
  },
  tacklesPlusInterceptionsPerMatch: {
    num: (r) => r.tackles + r.interceptions, den: () => 1,
    unit: 'events per match (both teams)',
    what: 'the shipped defensive event rate at match grain',
    denNote: 'one match per seed',
  },
};
const BOOTSTRAP = 2000;
const rngBoot = new Rng(STATS_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: rows.length }, () => Math.floor(rngBoot.next() * rows.length)));
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faceOf = (name: string, d: FaceDef): FaceRow => {
  const num = sum(rows.map(d.num));
  const den = sum(rows.map(d.den));
  const value = ratio(num, den);
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0;
    let q = 0;
    for (const i of idx) { n += d.num(rows[i]); q += d.den(rows[i]); }
    const v = ratio(n, q);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const pick = (p: number): number => (draws.length === 0 ? Number.NaN
    : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
  const lo = pick(0.025);
  const hi = pick(0.975);
  return {
    face: name, unit: d.unit, what: d.what, denNote: d.denNote,
    value: round(value), numerator: round(num), denominator: round(den),
    ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2),
  };
};
const faces: FaceRow[] = Object.entries(CHURN_FACES).map(([k, d]) => faceOf(k, d));

/* ---- the re-target latency PERCENTILE face, from STORED BINS (canon) ---- */
const latBinsPooled = Array.from({ length: LAT_BINS }, (_, b) =>
  sum(rows.map((r) => r.reTargetLatencyBins[b])));
const latTotal = sum(latBinsPooled);
const latQuantileFromBins = (p: number): number => {
  if (latTotal === 0) return Number.NaN;
  let acc = 0;
  for (let b = 0; b < LAT_BINS; b++) {
    acc += latBinsPooled[b];
    if (acc >= p * latTotal) return (b + 1) * LAT_BIN_S;
  }
  return LAT_BINS * LAT_BIN_S;
};

/* ---- the ladder faces ---- */
interface LadderFaceRow {
  arm: ArmId; generation: number; leagues: number; matches: number;
  goalsPerMatch: number; shotsPerTeamMatch: number; shotsConcededPerTeamMatch: number;
  xgPerTeamMatch: number; tacklesPerTeamMatch: number; interceptionsPerTeamMatch: number;
  clearancesPerTeamMatch: number; blocksPerTeamMatch: number; passCompletion: number;
  perLeagueGoalsPerMatch: number[];
}
const ladderFaces: LadderFaceRow[] = [];
for (const arm of ARMS) {
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const cs = ladderCells.filter((c) => c.arm === arm && c.generation === gen);
    const matches = sum(cs.map((c) => c.matches));
    const teamMatches = matches * 2;
    ladderFaces.push({
      arm, generation: gen, leagues: cs.length, matches,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), matches)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), teamMatches)),
      /** shots CONCEDED per team-match ≡ shots per team-match in a closed league (stated) */
      shotsConcededPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), teamMatches)),
      xgPerTeamMatch: round(ratio(sum(cs.map((c) => c.xg)), teamMatches)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), teamMatches)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), teamMatches)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), teamMatches)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), teamMatches)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
      perLeagueGoalsPerMatch: cs.map((c) => round(ratio(c.goals, c.matches))),
    });
  }
}
/** the early→late slope per arm, with a LEAGUE-CLUSTERED bootstrap over the paired seeds */
const EARLY_GENS = Math.min(5, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - EARLY_GENS + 1);
interface LadderSlope {
  arm: ArmId; face: string;
  early: number; late: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  earlyGens: string; lateGens: string; leagues: number;
}
const LADDER_SLOPE_FACES = ['goals', 'tackles', 'interceptions', 'shots', 'clearances'] as const;
const numOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>
  (f === 'goals' ? c.goals : f === 'tackles' ? c.tackles : f === 'interceptions'
    ? c.interceptions : f === 'shots' ? c.shots : c.clearances);
const denOf = (c: LadderCell, f: (typeof LADDER_SLOPE_FACES)[number]): number =>
  (f === 'goals' ? c.matches : c.matches * 2);
const rngLadder = new Rng(STATS_BASE + STATS_STEP);
const ladderSlopes: LadderSlope[] = [];
for (const arm of ARMS) {
  for (const f of LADDER_SLOPE_FACES) {
    const perLeague = LADDER_SEEDS.map((ls) => {
      const cs = ladderCells.filter((c) => c.arm === arm && c.leagueSeed === ls);
      const early = cs.filter((c) => c.generation <= EARLY_GENS);
      const late = cs.filter((c) => c.generation >= LATE_FROM);
      const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
      const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
      return { early: e, late: l, delta: l - e };
    });
    const draws: number[] = [];
    for (let b = 0; b < BOOTSTRAP; b++) {
      const ds: number[] = [];
      for (let i = 0; i < perLeague.length; i++) {
        ds.push(perLeague[Math.floor(rngLadder.next() * perLeague.length)].delta);
      }
      const v = mean(ds);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    const pick = (p: number): number => (draws.length === 0 ? Number.NaN
      : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
    const lo = pick(0.025);
    const hi = pick(0.975);
    const hw = (hi - lo) / 2;
    const delta = mean(perLeague.map((p) => p.delta));
    ladderSlopes.push({
      arm, face: f,
      early: round(mean(perLeague.map((p) => p.early))),
      late: round(mean(perLeague.map((p) => p.late))),
      delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
      ratioToHalfWidth: round(Math.abs(delta) / hw, 3),
      earlyGens: `1..${EARLY_GENS}`, lateGens: `${LATE_FROM}..${LADDER_GENS}`,
      leagues: LADDER_SEEDS.length,
    });
  }
}

/* ========================================================================== */
/* §12 (e) THE PERF BOUND — RE-ANCHORED, NEVER SELF-MEASURED                   */
/* ========================================================================== */
/**
 * ⭐ THE ANCHOR IS `docs/perf/baseline.json` — the shipped perf baseline of record, hashed
 * AS BYTES before it is parsed (the dose-source-guard canon applied to a perf anchor). The
 * IN-C0 lesson: a probe's own wall clock brackets the PROBE, so it is an upper bound on the
 * engine and must never be presented as the engine's cost. Nothing below is measured here.
 */
const PERF_PATH = 'docs/perf/baseline.json';
const PERF_BYTES = readFileSync(PERF_PATH, 'utf8');
const PERF_ANCHOR = JSON.parse(PERF_BYTES) as {
  head: string; usPerStep: number; matchesPerSec: number;
  phases: Array<{ phase: string; usPerStep: number; pct: number }>;
};
const teamBrainPhase = PERF_ANCHOR.phases.find((p) => p.phase === 'teamBrain') ?? null;
const decidePhase = PERF_ANCHOR.phases.find((p) => p.phase === 'decide') ?? null;
const perfSizing = {
  anchorFile: PERF_PATH,
  anchorSha256: sha256(PERF_BYTES),
  anchorHead: PERF_ANCHOR.head,
  anchorNote: 'the SHIPPED perf baseline of record, hashed as bytes before parsing; NOT a '
    + 'number this probe measured (the IN-C0 perf-mislabel lesson)',
  usPerStepTotal: PERF_ANCHOR.usPerStep,
  teamBrainUsPerStep: teamBrainPhase?.usPerStep ?? Number.NaN,
  teamBrainPctOfTick: teamBrainPhase?.pct ?? Number.NaN,
  decideUsPerStep: decidePhase?.usPerStep ?? Number.NaN,
  decidePctOfTick: decidePhase?.pct ?? Number.NaN,
  /** the budget statement: what a chooser may cost to stay inside a stated share of the tick */
  budgetAtOnePctOfTickUs: round(PERF_ANCHOR.usPerStep * 0.01, 3),
  budgetAtTwoPctOfTickUs: round(PERF_ANCHOR.usPerStep * 0.02, 3),
  seatNote: 'the surface would run at the assignment call sites (updateTeamBrain → '
    + 'assignChasers/assignMarks), i.e. once per team per TEAM_AI_INTERVAL, NOT once per '
    + 'body per tick; the teamBrain phase is the phase whose budget it spends',
  optionsPerDefender: 4,
  defendersPerTeam: 5,
  pricesPerTeamUpdate: 20,
  sizingClaim: 'A 20-price surface has to fit inside a phase that costs '
    + `${teamBrainPhase?.usPerStep ?? Number.NaN} µs/step today (`
    + `${teamBrainPhase?.pct ?? Number.NaN} % of the tick). The 2 %-of-tick budget is `
    + `${round(PERF_ANCHOR.usPerStep * 0.02, 3)} µs/step — i.e. roughly HALF the teamBrain `
    + 'phase again. This is a BUDGET, not a measurement: the slice measures its own cost '
    + 'against this anchor on the same machine.',
};

/* ========================================================================== */
/* §13 GATES                                                                   */
/* ========================================================================== */
const srcStatus = gitOut(['status', '--porcelain', '--', 'src']);
const srcDiff = gitOut(['diff', '--stat', 'HEAD', '--', 'src']);
const gates: Record<string, boolean> = {
  /** instrument-only: src untouched, both readings (the xSrcUntouched canon) */
  gSrcUntouched: srcStatus === '' && srcDiff === '',
  /** the tokenizer and the ruler-family definitions are byte-identical to their donors */
  gTokenizerVerbatim: VERBATIM_OK,
  /** (a) the anchored corpus resolved uniquely and in order */
  gCorpusAnchored: INV.anchorsOk
    && INV.anchorReport.every((a) => a.firstHits === 1 && a.lastHits === 1 && a.ordered),
  /** (a) canon: counts per needle AND every occurrence's site enumerated */
  gInventoryEnumerated: sum(Object.values(literalsByClass)) === INV.sites.length
    && sum(Object.values(literalsByConstruct)) === INV.sites.length
    && INV.sites.every((s) => s.line > 0 && s.file.startsWith('src/')),
  /** (a) the named rules of record each anchored EXACTLY ONCE, inside a censused construct */
  gNamedRulesAnchored: NAMED_RULES_OK,
  /** (a) the src-extracted constants match the values the doctrine cites */
  gExtractsMatchDoctrine: EXTRACTS_OK,
  /**
   * ⭐⭐ CORPUS INTEGRITY, NON-VACUOUS ON THIS CORPUS (canon, home IN-C0 §CORR 2): the
   * tokenizer's stripped corpus is structurally sound AND the naive (historically buggy)
   * stripper measurably BREAKS this very corpus — it swallows code lines and it destroys the
   * anchor resolution the inventory depends on. Swap the PRODUCTION ALIAS to `stripComments`
   * and this gate goes RED (the mutation receipt).
   */
  gCorpusIntegrityDiscriminates: balanceFailures.length === 0
    && naiveBalanceFailures.length > 0
    && naiveDeficits.length > 0
    && sum(naiveDeficits.map((d) => d.codeLinesSwallowedByNaive)) > 0
    /* the census-relevant harm, either manifestation: the naive pass loses counted literal
     * sites inside the corpus, or it loses the anchors that DEFINE the corpus */
    && (naiveLiteralTotal < INV.sites.length || NAIVE_ANCHORS_OK === false),
  /** (b) the world was WORLD 9 on every walk, and the receipt seed proved it too */
  gWorldNine: Object.values(RECEIPT).every(Boolean) && rows.every((r) => r.worldOk),
  /** (b) the battery is non-degenerate: churn actually happens, denominators non-zero */
  gChurnNonDegenerate: rows.length > 0
    && sum(rows.map((r) => r.defenderTicks)) > 0
    && sum(rows.map((r) => r.markSwitches)) > 0
    && sum(rows.map((r) => r.markPairTicks)) > 0
    && sum(rows.map((r) => sum(r.swarmZoneBins))) > 0,
  /** (b) the latency percentile face has its STORED BINS (canon) */
  gLatencyBinsStored: latBinsPooled.length === LAT_BINS && latTotal > 0
    && rows.every((r) => r.reTargetLatencyBins.length === LAT_BINS
      && sum(r.reTargetLatencyBins) === r.reTargetLatencyCount),
  /** (c) every gap receipt exists VERBATIM in src */
  gGapReceiptsVerbatim: GAP_RECEIPTS_OK,
  /** (c) the gap analysis is CLASSED end to end, and finds all three classes */
  gGapClassed: GAP_ROWS.every((r) => r.consumes.length > 0
    && r.consumes.every((c) => c.klass === 'exists-live' || c.klass === 'exists-dormant'
      || c.klass === 'MISSING'))
    && (['exists-live', 'exists-dormant', 'MISSING'] as GapClass[])
      .every((k) => GAP_ROWS.some((r) => r.consumes.some((c) => c.klass === k))),
  /** (d) the gene partition covers GENE_KEYS exactly */
  gGenePartition: GENE_PARTITION_OK,
  /**
   * ⭐⭐ (d) THE FREEZE BIT — and it bit at the SERIALIZED boundary too: in the frozen arms
   * every frozen key equals its gen-1 value at every generation, INCLUDING inside the
   * TeamInfo the shipped `createMatch` produced.
   */
  gFreezeHeld: ladderCells.filter((c) => c.arm !== 'both')
    .every((c) => c.frozenKeyDrift === 0 && c.serializedKeyDrift === 0
      && c.frozenKeysChecked > 0 && c.serializedKeysChecked > 0),
  /**
   * ⭐⭐ (d) THE FREEZE IS ALIVE, NOT A NO-OP (mutant liveness): in each frozen arm the
   * FREE half of the genome moved away from gen-1 by the last generation while the frozen
   * half moved EXACTLY zero — and in the `both` arm everything moved.
   */
  gFreezeBites: (() => {
    const last = (arm: ArmId): LadderCell[] => ladderCells
      .filter((c) => c.arm === arm && c.generation === LADDER_GENS);
    const frozenArmsOk = (['defFrozen', 'atkFrozen'] as ArmId[]).every((arm) => {
      const cs = last(arm);
      return cs.length > 0 && cs.every((c) => c.frozenGeneMeanAbsDelta === 0
        && c.freeGeneMeanAbsDelta > 0);
    });
    const bothOk = last('both').every((c) => c.freeGeneMeanAbsDelta > 0);
    return frozenArmsOk && bothOk && LADDER_GENS >= 2;
  })(),
  /**
   * ⭐ (d) GENERATION 1 IS IDENTICAL ACROSS THE THREE ARMS — the arms can only diverge from
   * generation 2, because the freeze is applied AFTER a shipped finishSeason(). A free and
   * total receipt that the cross arms are the same world until the intervention.
   */
  gGen1IdenticalAcrossArms: LADDER_SEEDS.every((ls) => {
    const cs = ARMS.map((a) => ladderCells
      .find((c) => c.arm === a && c.leagueSeed === ls && c.generation === 1));
    if (cs.some((c) => c === undefined)) return false;
    const k = (c: LadderCell): string => `${c.matches}|${c.goals}|${c.shots}|${c.tackles}`
      + `|${c.interceptions}|${c.clearances}|${c.blocks}|${c.passes}|${c.passesCompleted}`;
    return new Set(cs.map((c) => k(c as LadderCell))).size === 1;
  }),
  /** (d) the ladder walked every (arm × league × generation) cell it booked */
  gLadderComplete: ladderCells.length === ARMS.length * LADDER_SEEDS.length * LADDER_GENS
    && ladderCells.every((c) => c.matches > 0),
  /** (e) every sizing receipt exists VERBATIM in src */
  gSizingReceiptsVerbatim: SIZING_RECEIPTS_OK,
  /** (e) the perf bound came from the ANCHOR file, not from this process */
  gPerfAnchored: Number.isFinite(perfSizing.teamBrainUsPerStep)
    && Number.isFinite(perfSizing.usPerStepTotal) && perfSizing.anchorSha256.length === 64,
  /** seeds: BOOKED = WALKED, in-band, block consumed whole */
  gSeedDiscipline: CHURN_SEEDS.every((s) => s >= BLOCK && s <= BLOCK + 999)
    && LADDER_SEEDS.every((s) => s >= BLOCK && s <= BLOCK + 999)
    && RECEIPT_SEED === BLOCK + 999
    && walksBooked === rows.length + 1,
  /** stats: the completed registry, floor and step */
  gStatsDisjoint: STATS_BASE >= 114_400 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE,
};

/* ========================================================================== */
/* §14 ARTIFACT (ALLOWLIST-SCHEMA hashed body) + gFaces-from-disk               */
/* ========================================================================== */
const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, worldOk: r.worldOk, ticks: r.ticks, playingTicks: r.playingTicks,
  defTeamTicks: r.defTeamTicks, defenderTicks: r.defenderTicks,
  markSwitches: r.markSwitches, markAbandons: r.markAbandons, markStarts: r.markStarts,
  chaseStarts: r.chaseStarts, chaseAbandons: r.chaseAbandons, markHeldTicks: r.markHeldTicks,
  reTargetLatencyBins: r.reTargetLatencyBins, reTargetLatencyCount: r.reTargetLatencyCount,
  reTargetLatencyTickSum: r.reTargetLatencyTickSum,
  markPairTicks: r.markPairTicks, dupMarkTicks: r.dupMarkTicks,
  multiChase2Ticks: r.multiChase2Ticks, multiChase3Ticks: r.multiChase3Ticks,
  carrierTicks: r.carrierTicks, swarmStanceBins: r.swarmStanceBins,
  swarmZoneBins: r.swarmZoneBins, chaserCountBins: r.chaserCountBins,
  goals: r.goals, tackles: r.tackles, interceptions: r.interceptions,
  stepWallMs: r.stepWallMs,
});

const artifact = {
  probe: SELF_PATH,
  stage: 'DF-C0 — THE DEFENSIVE-BRAIN CENSUS',
  orderedBy: 'COMMANDER RULING #319 item 3; bound by DF-DEFENSIVE-BRAIN-CONTRACT.md §3 and '
    + 'DEF-DOCTRINE.md §2',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  git: {
    head: gitOut(['rev-parse', 'HEAD']),
    srcStatusPorcelain: srcStatus,
    srcDiffStatHead: srcDiff,
  },
  instrumentSha256: sha256(SELF_SRC),
  verbatimBlocks: verbatimChecks,
  /* ---------------- (a) THE HAND-RULE INVENTORY ---------------- */
  handRuleInventory: {
    corpus: CONSTRUCTS.map((c) => ({ ...c })),
    corpusFiles,
    spans: INV.spans,
    anchorReport: INV.anchorReport,
    needlePrefixAlphabet: LITERAL_PREFIX_NOTE,
    literalNeedleRegex: LITERAL_RE.source,
    tokenNeedles: TOKEN_NEEDLES,
    tokenNeedleCounts,
    literalSitesEnumerated: INV.sites.length,
    literalsByClass,
    literalsByConstruct,
    classifierPrecedence: ['cap', 'role-bias', 'scheme', 'threshold', 'other-constant'],
    /** EVERY occurrence's site (canon) */
    sites: INV.sites.map((s) => `${s.file}:${s.line}:${s.literal}:${s.klass}:${s.construct}`),
    siteTexts: INV.sites.map((s) => ({ receipt: `${s.file}:${s.line}`, literal: s.literal,
      klass: s.klass, construct: s.construct, text: s.text })),
    namedRulesOfRecord: namedRuleReceipts,
    srcExtractedConstants: EXTRACTS,
    excludedByDesign: 'assignRunners / pickCornerRoutine / the corner crash counts — the '
      + 'ATTACKING off-ball caps; a different arc\'s hand rules, named so the exclusion is '
      + 'auditable, not silent.',
    corpusIntegrity: {
      canon: 'text-census corpus integrity — a text-census completeness gate must be proven '
        + 'NON-VACUOUS against the FULL corpus (independent tokenizer cross-check or a '
        + 'mutation reintroducing the truncation goes red); comment/string stripping is '
        + 'itself an instrument. [CANON.md; home IN-C0 §COMMANDER CORRECTIONS 2]',
      tokenizerSource: `copied byte-verbatim from ${RESCAN_PROBE} and drift-gated`,
      structuralOracle: 'stripped corpus files must be ()/{}/[] balanced with no residual '
        + 'comment markers',
      balanceFailuresTokenizer: balanceFailures,
      balanceFailuresNaive: naiveBalanceFailures,
      naiveDeficits,
      naiveAnchorsResolved: NAIVE_ANCHORS_OK,
      naiveLiteralSites: naiveLiteralTotal,
      tokenizerLiteralSites: INV.sites.length,
      mutationReceiptHowTo: 'set the PRODUCTION ALIAS `const strip = stripTokens` to '
        + '`stripComments` and re-run: gCorpusIntegrityDiscriminates goes RED (the naive '
        + 'pass both breaks the structural oracle and loses the anchors).',
    },
  },
  /* ---------------- (b) THE 乱跑 DIAGNOSIS ---------------- */
  luanpaoDiagnosis: {
    world: 'WORLD 9 (a4MatchFlags(8) + armA4World with the matured L3/PC doses + '
      + 'bkFacingLaw + bkContactLaw) — SINGLE ARM, no dose ladder',
    worldReceipt: RECEIPT,
    doseGuards: { l3File: L3_T1_PATH, l3Sha256: L3_BYTES_SHA, pcFile: PC_T1_PATH,
      pcSha256: PC_BYTES_SHA },
    dupRunLineage: {
      radiusMetres: DUP_RUN_M,
      inheritedFrom: 'scripts/probes/mt-t1-ruler-rerun.ts (`const DUP_RUN_M = 4;`), the P3′ '
        + 'duplicate-run radius documented in MT-T1-RULER-RERUN.md and '
        + 'PM-T1-COMPRESSION-EXAM.md; `familyOf` copied verbatim from the same file',
      defensiveAnalogue: 'two MARK-family defenders whose target BODIES are within the same '
        + '4 m — the attacking face asks the same of two licensed runners\' target POINTS',
    },
    swarmRadii: { stanceMetres: SWARM_R_STANCE, zoneMetres: SWARM_R_ZONE,
      derivation: 'both src-extracted at NAMED call sites (markStanceBand / '
        + 'zonalEngageRadius9) — derived thresholds only, no taste constants (#200)' },
    clock: { dt: DT, matchDurationSeconds: MATCH_DURATION,
      note: 'every rate is published per defender-minute AND per defender-match; APPLIED '
        + 'values only' },
    latencyBins: { bins: LAT_BINS, binSeconds: LAT_BIN_S, pooled: latBinsPooled,
      total: latTotal,
      medianFromBinsSeconds: round(latQuantileFromBins(0.5)),
      p90FromBinsSeconds: round(latQuantileFromBins(0.9)) },
    swarmStanceBinsPooled: Array.from({ length: SWARM_BINS }, (_, b) =>
      sum(rows.map((r) => r.swarmStanceBins[b]))),
    swarmZoneBinsPooled: Array.from({ length: SWARM_BINS }, (_, b) =>
      sum(rows.map((r) => r.swarmZoneBins[b]))),
    chaserCountBinsPooled: Array.from({ length: 5 }, (_, b) =>
      sum(rows.map((r) => r.chaserCountBins[b]))),
    faces,
  },
  /* ---------------- (c) THE PRIMITIVE-GAP ANALYSIS ---------------- */
  primitiveGaps: {
    rows: GAP_ROWS.map((r) => ({
      primitive: r.primitive,
      consumes: r.consumes.map((c) => ({
        item: c.item, klass: c.klass, note: c.note,
        receipt: c.receiptFile === undefined ? null
          : `${c.receiptFile}:${(gapReceipts.find((g) => g.item === c.item
            && g.primitive === r.primitive)?.lines ?? []).join(',')}`,
        lineVerbatim: c.receiptLine ?? null,
      })),
    })),
    receiptVerification: gapReceipts,
    counts: {
      existsLive: GAP_ROWS.flatMap((r) => r.consumes).filter((c) => c.klass === 'exists-live').length,
      existsDormant: GAP_ROWS.flatMap((r) => r.consumes).filter((c) => c.klass === 'exists-dormant').length,
      missing: GAP_ROWS.flatMap((r) => r.consumes).filter((c) => c.klass === 'MISSING').length,
    },
  },
  /* ---------------- (d) THE SEASON LADDER ---------------- */
  seasonLadder: {
    world: 'THE SHIPPED WORLD (no matchFlags) — per the worker-fixture canon: "WORKER-SIMMED '
      + 'fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, '
      + 'stated now, test-pinned; refines #270\'s E4 correction; matches the perf '
      + 'diagnostic)". The ladder is the ECOLOGY\'s ruler; the world-9 arms are the '
      + 'match-grain instrument (b).',
    design: `${ARMS.length} arms × ${LADDER_SEEDS.length} league seeds × ${LADDER_GENS} `
      + 'generations, every generation measured (no sampling); the three arms share the same '
      + 'league seeds (paired) and generation 1 is bit-identical across arms by construction',
    arms: ARMS.map((a) => ({ arm: a, note: ARM_NOTE[a] })),
    genePartition: { defence: DEF_GENES, attack: ATK_GENES, neutral: NEUTRAL_GENES,
      defenceStyle: DEF_STYLE_KEYS, attackStyle: ATK_STYLE_KEYS,
      partitionsGeneKeys: GENE_PARTITION_OK, geneKeysCount: (GENE_KEYS as readonly string[]).length },
    freezeMechanism: 'THE SHIPPED WRITER\'S OWN FIELD: after each shipped '
      + 'League.finishSeason() the frozen sub-vector is re-copied onto f.coach.genome / '
      + 'f.coach.style — the exact fields evolveGroup/mutateGenome/mutateStyle write — and '
      + 'League.createMatch serializes it into TeamInfo as it always does. NOTHING is ever '
      + 'written into info.genome by hand (dose-placement canon). No RNG is consumed.',
    freezeLimits: 'Freezing is BY SLOT: a reborn club inherits the gen-1 frozen half (that '
      + 'IS the counterfactual). Squad ATTRIBUTES (defending/positioning/pace) and coaches '
      + 'develop in EVERY arm — this ladder freezes the TACTICAL GENOME half only, and says so.',
    missingFace: 'PRESSED SHARE has no shipped league-grain statistic (the shipped MatchStats '
      + 'carry tackles/interceptions/clearances/blocks, not a pressed share). It is reported '
      + 'at MATCH grain by instrument (b) instead of being invented here.',
    generations: LADDER_GENS,
    leagueSeeds: LADDER_SEEDS,
    perGenerationFaces: ladderFaces,
    earlyLateSlopes: ladderSlopes,
    slopeWindows: { early: `1..${EARLY_GENS}`, late: `${LATE_FROM}..${LADDER_GENS}`,
      disjoint: LATE_FROM > EARLY_GENS,
      note: 'in an override run with few generations the two windows OVERLAP and every '
        + 'slope is structurally 0 — the flag says which case a reader is looking at' },
    wallSeconds: ladderWallSec,
    leagueSeasonsPlayed: ladderLeagueSeasons,
    matchesPlayed: ladderMatches,
  },
  /* ---------------- (e) THE DECISION-SURFACE SIZING ---------------- */
  surfaceSizing: {
    callSitesAndAccounts: sizingReceipts,
    perf: perfSizing,
  },
  /* ---------------- seeds, stats, battery ---------------- */
  seeds: {
    block: BLOCK,
    blockRange: `${BLOCK}-${BLOCK + 999}`,
    consumedWhole: true,
    churnRange: `${BLOCK}-${BLOCK + N_SEEDS - 1}`,
    churnSeeds: N_SEEDS,
    ladderSeeds: LADDER_SEEDS,
    receiptSeed: RECEIPT_SEED,
    booked: walksBooked,
    walked: rows.length + 1,
    bookedEqualsWalked: walksBooked === rows.length + 1,
    smokePrefixInBand: `${BLOCK}-${BLOCK + 2}`,
    nextBlockAtLeast: BLOCK + 1000,
  },
  stats: {
    base: STATS_BASE,
    step: STATS_STEP,
    resamples: BOOTSTRAP,
    estimator: 'CLUSTER bootstrap by match seed for the 乱跑 faces (one resample-index '
      + 'matrix draws every face); LEAGUE-clustered bootstrap of per-league early→late '
      + 'deltas for the ladder slopes',
    registryCompletionMethod: 'inherited from IN-C0\'s COMPLETED 56-entry registry '
      + '(stats.registryCompletionMethod there: union of R9\'s 41-entry list, every '
      + 'committed docs/world-model/data/*.json base/statsBase/seedBase, and every '
      + 'scripts/** top-level `const …BASE… = <6 digits>`), PLUS the one base consumed since '
      + 'that sweep: 114,200 (IN-C0, #317 item 4).',
    registryEntries: STATS_PUBLISHED_BASES.length,
    publishedBasesCheckedAgainst: STATS_PUBLISHED_BASES,
    minimumGapToAnyPublishedBase: minStatsGap,
    drawsTaken: 2,
    basesConsumed: STATS_BASES_CONSUMED,
    nextBaseAtLeast: STATS_BASE + 2 * STATS_STEP,
  },
  battery: {
    churnWalks: rows.length,
    churnTicks: sum(rows.map((r) => r.ticks)),
    churnWallSeconds: churnWallSec,
    ladderWallSeconds: ladderWallSec,
    totalWallSeconds: round((Date.now() - tWall0) / 1000, 1),
    wallCeilingMinutes: 75,
  },
  perSeedCells: rows.map(cellOf),
  ladderCells,
  gates,
  allGreen: Object.values(gates).every(Boolean),
};

/**
 * ⭐ THE HASHED BODY — an explicit ALLOWLIST SCHEMA (canon, home PC-T0 §CORR item 1): a
 * field not named here never enters the hash. Wall clocks, git state and machine-dependent
 * timings are OUT by construction (not by a forbidden-name list).
 */
const HASH_SCHEMA = ['handRuleInventory', 'luanpaoDiagnosis', 'primitiveGaps',
  'seasonLadder', 'surfaceSizing', 'seeds', 'stats', 'perSeedCells', 'ladderCells',
  'gates'] as const;
const hashBody = Object.fromEntries(HASH_SCHEMA.map((k) =>
  [k, (artifact as unknown as Record<string, unknown>)[k]]));
const artifactWithHash = {
  ...artifact,
  hashSchema: HASH_SCHEMA,
  bodySha256: sha256(JSON.stringify(hashBody)),
};

mkdirSync('docs/world-model/data', { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(artifactWithHash, null, 2)}\n`);

/* ---- gFaces: re-derive EVERY published face by RE-PARSING the artifact off disk ---- */
const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as {
  luanpaoDiagnosis: { faces: FaceRow[]; latencyBins: { pooled: number[]; total: number;
    medianFromBinsSeconds: number; p90FromBinsSeconds: number } };
  seasonLadder: { perGenerationFaces: LadderFaceRow[]; earlyLateSlopes: LadderSlope[] };
  perSeedCells: Array<Record<string, number | number[] | boolean>>;
  ladderCells: LadderCell[];
};
const diskRows = onDisk.perSeedCells as unknown as Row[];
const faceMismatches: string[] = [];
for (const [name, d] of Object.entries(CHURN_FACES)) {
  const published = onDisk.luanpaoDiagnosis.faces.find((f) => f.face === name);
  if (published === undefined) { faceMismatches.push(`${name}: MISSING from artifact`); continue; }
  const v = round(ratio(sum(diskRows.map(d.num)), sum(diskRows.map(d.den))));
  if (!(Object.is(v, published.value))) faceMismatches.push(`${name}: ${v} ≠ ${published.value}`);
}
/* the percentile face, re-derived from the STORED BINS on disk */
{
  const pooled = Array.from({ length: LAT_BINS }, (_, b) =>
    sum(diskRows.map((r) => r.reTargetLatencyBins[b])));
  const total = sum(pooled);
  const q = (p: number): number => {
    if (total === 0) return Number.NaN;
    let acc = 0;
    for (let b = 0; b < LAT_BINS; b++) {
      acc += pooled[b];
      if (acc >= p * total) return (b + 1) * LAT_BIN_S;
    }
    return LAT_BINS * LAT_BIN_S;
  };
  if (!Object.is(round(q(0.5)), onDisk.luanpaoDiagnosis.latencyBins.medianFromBinsSeconds)) {
    faceMismatches.push('latency median from bins mismatch');
  }
  if (!Object.is(round(q(0.9)), onDisk.luanpaoDiagnosis.latencyBins.p90FromBinsSeconds)) {
    faceMismatches.push('latency p90 from bins mismatch');
  }
}
/* every ladder face, re-derived from ladderCells on disk */
for (const lf of onDisk.seasonLadder.perGenerationFaces) {
  const cs = onDisk.ladderCells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
  const matches = sum(cs.map((c) => c.matches));
  const tm = matches * 2;
  const check: Array<[string, number, number]> = [
    ['goalsPerMatch', round(ratio(sum(cs.map((c) => c.goals)), matches)), lf.goalsPerMatch],
    ['shotsPerTeamMatch', round(ratio(sum(cs.map((c) => c.shots)), tm)), lf.shotsPerTeamMatch],
    ['tacklesPerTeamMatch', round(ratio(sum(cs.map((c) => c.tackles)), tm)), lf.tacklesPerTeamMatch],
    ['interceptionsPerTeamMatch', round(ratio(sum(cs.map((c) => c.interceptions)), tm)),
      lf.interceptionsPerTeamMatch],
    ['clearancesPerTeamMatch', round(ratio(sum(cs.map((c) => c.clearances)), tm)),
      lf.clearancesPerTeamMatch],
    ['blocksPerTeamMatch', round(ratio(sum(cs.map((c) => c.blocks)), tm)), lf.blocksPerTeamMatch],
    ['xgPerTeamMatch', round(ratio(sum(cs.map((c) => c.xg)), tm)), lf.xgPerTeamMatch],
    ['passCompletion', round(ratio(sum(cs.map((c) => c.passesCompleted)),
      sum(cs.map((c) => c.passes)))), lf.passCompletion],
  ];
  for (const [n, a, b] of check) {
    if (!Object.is(a, b)) faceMismatches.push(`ladder ${lf.arm} gen${lf.generation} ${n}: ${a} ≠ ${b}`);
  }
}
/* the slope faces: early/late levels re-derived from disk cells */
for (const s of onDisk.seasonLadder.earlyLateSlopes) {
  const perLeague = LADDER_SEEDS.map((ls) => {
    const cs = onDisk.ladderCells.filter((c) => c.arm === s.arm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    const f = s.face as (typeof LADDER_SLOPE_FACES)[number];
    return {
      early: ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f)))),
      late: ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f)))),
    };
  });
  const e = round(mean(perLeague.map((p) => p.early)));
  const l = round(mean(perLeague.map((p) => p.late)));
  if (!Object.is(e, s.early) || !Object.is(l, s.late)) {
    faceMismatches.push(`slope ${s.arm}/${s.face}: ${e}/${l} ≠ ${s.early}/${s.late}`);
  }
  if (!Object.is(round(l - e), s.delta)) {
    faceMismatches.push(`slope ${s.arm}/${s.face} delta: ${round(l - e)} ≠ ${s.delta}`);
  }
}
const gFacesFromDisk = faceMismatches.length === 0;
const finalGates = { ...gates, gFacesFromDisk };
const ALL_GREEN = Object.values(finalGates).every(Boolean);
const finalArtifact = {
  ...artifactWithHash,
  gates: finalGates,
  allGreen: ALL_GREEN,
  faceReDerivationMismatches: faceMismatches,
};
writeFileSync(OUT_PATH, `${JSON.stringify(finalArtifact, null, 2)}\n`);

/* ========================================================================== */
/* §15 BANNER                                                                  */
/* ========================================================================== */
banner('');
banner('=== DF-C0 — THE DEFENSIVE-BRAIN CENSUS ===');
banner(`artifact → ${OUT_PATH}  (bodySha256 ${artifactWithHash.bodySha256.slice(0, 16)}…)`);
for (const [k, v] of Object.entries(finalGates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
banner('--- (a) THE HAND-RULE INVENTORY ---');
banner(`  corpus: ${CONSTRUCTS.length} anchored constructs in ${corpusFiles.length} files, `
  + `${sum(INV.spans.map((s) => s.codeLines))} code lines`);
banner(`  literal sites = ${INV.sites.length}  ${JSON.stringify(literalsByClass)}`);
banner(`  by construct: ${JSON.stringify(literalsByConstruct)}`);
banner(`  named rules of record = ${namedRuleReceipts.length}, all uniquely anchored: `
  + `${NAMED_RULES_OK}`);
for (const r of namedRuleReceipts) banner(`    ${r.klass.padEnd(15)} ${r.receipt}  ${r.id}`);
banner(`  naive stripper on this corpus: anchors resolved=${NAIVE_ANCHORS_OK}, `
  + `code lines swallowed=${sum(naiveDeficits.map((d) => d.codeLinesSwallowedByNaive))}, `
  + `balance failures=${naiveBalanceFailures.length} (tokenizer ${balanceFailures.length})`);
banner('--- (b) THE 乱跑 DIAGNOSIS ---');
for (const f of faces) {
  banner(`  ${f.face.padEnd(34)} ${String(round(f.value, 4)).padStart(9)}  `
    + `[${round(f.ciLo, 4)}, ${round(f.ciHi, 4)}]  ${f.unit.slice(0, 48)}`);
}
banner(`  latency bins (0.5 s each) = ${JSON.stringify(latBinsPooled)}  `
  + `median ${round(latQuantileFromBins(0.5))} s  p90 ${round(latQuantileFromBins(0.9))} s`);
banner(`  chaser-count bins (0..4+) = ${JSON.stringify(artifact.luanpaoDiagnosis.chaserCountBinsPooled)}`);
banner(`  swarm@${SWARM_R_STANCE}m bins = ${JSON.stringify(artifact.luanpaoDiagnosis.swarmStanceBinsPooled)}`);
banner(`  swarm@${SWARM_R_ZONE}m bins = ${JSON.stringify(artifact.luanpaoDiagnosis.swarmZoneBinsPooled)}`);
banner('--- (c) THE PRIMITIVE GAPS ---');
banner(`  ${JSON.stringify(artifact.primitiveGaps.counts)}`);
for (const r of GAP_ROWS) {
  banner(`  ${r.primitive}`);
  for (const c of r.consumes) banner(`    ${c.klass.padEnd(15)} ${c.item}`);
}
banner('--- (d) THE SEASON LADDER ---');
for (const arm of ARMS) {
  const g1 = ladderFaces.find((f) => f.arm === arm && f.generation === 1);
  const gN = ladderFaces.find((f) => f.arm === arm && f.generation === LADDER_GENS);
  banner(`  ${arm.padEnd(10)} gen1 goals ${g1?.goalsPerMatch} → gen${LADDER_GENS} `
    + `${gN?.goalsPerMatch}   tackles ${g1?.tacklesPerTeamMatch} → ${gN?.tacklesPerTeamMatch}`
    + `   int ${g1?.interceptionsPerTeamMatch} → ${gN?.interceptionsPerTeamMatch}`);
}
for (const s of ladderSlopes) {
  banner(`  slope ${s.arm.padEnd(10)} ${s.face.padEnd(14)} ${String(s.early).padStart(8)} → `
    + `${String(s.late).padStart(8)}  Δ ${String(s.delta).padStart(9)}  `
    + `hw ${s.halfWidth}  |Δ|/hw ${s.ratioToHalfWidth}`);
}
banner('--- (e) THE SURFACE SIZING ---');
banner(`  perf anchor ${PERF_PATH} @ ${PERF_ANCHOR.head}: step ${PERF_ANCHOR.usPerStep} µs, `
  + `teamBrain ${perfSizing.teamBrainUsPerStep} µs (${perfSizing.teamBrainPctOfTick} %), `
  + `2 %-of-tick budget ${perfSizing.budgetAtTwoPctOfTickUs} µs/step`);
banner(`  call sites + accounts verified verbatim: ${sizingReceipts.length}`);
banner('');
banner(`seeds: block ${BLOCK}-${BLOCK + 999} consumed whole · booked ${walksBooked} = walked `
  + `${rows.length + 1} · ladder leagues ${JSON.stringify(LADDER_SEEDS)} × ${LADDER_GENS} gens `
  + `× ${ARMS.length} arms (${ladderMatches} matches)`);
banner(`stats: bases ${JSON.stringify(STATS_BASES_CONSUMED)} step ${STATS_STEP} registry `
  + `${STATS_PUBLISHED_BASES.length} entries, min gap ${minStatsGap}, next ≥ `
  + `${STATS_BASE + 2 * STATS_STEP}`);
banner(`wall: churn ${churnWallSec} s + ladder ${ladderWallSec} s = `
  + `${round((Date.now() - tWall0) / 1000, 1)} s (ceiling 75 min)`);
banner('');
banner(ALL_GREEN ? 'ALL GATES GREEN' : '**GATES RED — reported, not patched**');
if (!ALL_GREEN) process.exit(1);
