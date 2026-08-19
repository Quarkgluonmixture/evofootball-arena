#!/usr/bin/env tsx
/**
 * ============================================================================
 * IN-C0-FIX — THE PERCEPTION-SURFACE RESCAN (static half only)
 * ============================================================================
 * ORDERED BY RULING #317 item 3. This is a FIX GENERATION of the static half of
 * `scripts/probes/in-c0-perception-surface-census.ts` (frozen `e66269c`, results
 * `ab90ce0`). The frozen probe's BATTERY half is NOT re-run and is NOT touched: its
 * cells stand bit-exact (#317 item 2). Seeds: NONE — this is a text census.
 *
 * WHAT WAS BROKEN (#317 item 1, IN-C0 §COMMANDER CORRECTIONS 1):
 *   the frozen `stripComments` strips BLOCK comments FIRST and line comments LAST, so a
 *   `/*` appearing inside a LINE comment (the repo's own `src/**` doc-prose) opens a
 *   PHANTOM block comment that swallows real code down to the next `*​/`. 1,194 code
 *   lines were blanked across 8 files (PlayerBrain.ts 791/1,815). Every static number of
 *   record was therefore an UNDER-COUNT and is VOID; the QUALITATIVE verdicts survive.
 *
 * WHAT IS FIXED HERE, AND ONLY THIS:
 *   1. A REAL stripper (`stripTokens`): a single left-to-right tokenizer over the four
 *      lexical states that can hide a `/`, a `'` or a `` ` `` from each other — line
 *      comment, block comment, string/template literal, regex literal. A line comment
 *      cannot open a block; a string cannot open a comment; a regex cannot open either.
 *      Template INTERPOLATIONS (`${...}`) are kept as CODE, because they are code.
 *   2. THE CORPUS-INTEGRITY GATE, non-vacuous per the canon (CANON.md, "text-census
 *      corpus integrity", home IN-C0 §CORR 2): (a) an in-probe cross-check that the
 *      naive pass (the OLD buggy stripper, copied byte-verbatim below and kept as the
 *      MUTANT ORACLE) and the tokenizer pass agree on needle counts PER FILE, or the
 *      disagreement is ENUMERATED — the truncated files must surface BY NAME (7 blanking
 *      + 2 line-tail, pinned; the naive pass is itself vouched by reproducing the frozen
 *      published totals 1,336 / 215 / 157 exactly); and
 *      (b) an INDEPENDENT structural oracle: after correct stripping, every file's
 *      remaining code must be brace/paren/bracket BALANCED and free of residual comment
 *      markers. Swap `stripTokens` → `stripComments` at THE PRODUCTION ALIAS below and
 *      both gates go RED (the mutation receipt, quoted in the stage doc §R-FIX).
 *
 * WHAT IS DELIBERATELY UNCHANGED (the definitions were frozen and are not in question —
 * only the CORPUS was truncated): the needle regex + prefix alphabet, the indexed and
 * uncaptured forms, `FILE_GRADE`, `DIR_GRADE`, `RECEIVER_LEXICON`, `GATEWAY_RE`,
 * `GATEWAY_NEEDLES`, `walkTree`, `gradeOf`, `interface Site`. They are COPIED BYTE-
 * VERBATIM from the frozen probe and the copy is GATED (`gDefinitionsUnchanged` re-reads
 * the frozen file at run time and compares the blocks character for character), so this
 * file cannot silently drift into a redefinition of the instrument.
 *
 * PUBLISHES (the numbers of record, per canon "occurrence COUNTS per needle + EVERY
 * occurrence's site enumerated + the needle PREFIX stated"): occurrencesEnumerated ·
 * needleCounts · the full site list · interposeSiteCount with the chooser/executor split
 * and every interpose site · the physics-stay-truth count and its sites · the gateway
 * census (every token, `pwSnapshot.players` included) · gatewayDistinctTokens.
 *
 * SRC IS NOT TOUCHED (instrument-only): `gSrcUntouched` publishes `git status` over src.
 * RUN: `npx tsx scripts/probes/in-c0-fix-surface-rescan.ts`  (no env, no seeds, seconds)
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join as pathJoin } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const sha256 = (s: string): string => createHash('sha256').update(s).digest('hex');
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }).trim(); } catch { return ''; }
};

const FROZEN_PROBE = 'scripts/probes/in-c0-perception-surface-census.ts';
const SELF_PATH = 'scripts/probes/in-c0-fix-surface-rescan.ts';
const OUT_PATH = 'docs/world-model/data/in-c0-fix-surface-rescan.json';

/* ========================================================================== */
/* §1 THE FROZEN DEFINITIONS — copied byte-verbatim, drift-gated below         */
/* ========================================================================== */

const NEEDLES = ['pos', 'vel', 'bodyDir', 'heading'] as const;
type Needle = (typeof NEEDLES)[number];
const NEEDLE_PREFIX_ALPHABET = '[A-Za-z_$][A-Za-z0-9_$]*(?:\\.[A-Za-z_$][A-Za-z0-9_$]*)*';
const NEEDLE_RE = new RegExp(`(${NEEDLE_PREFIX_ALPHABET})\\.(pos|vel|bodyDir|heading)\\b`, 'g');
/**
 * The INDEXED receiver form — `this.allPlayers[gid].pos`, `team.players[i].vel`. The plain
 * prefix alphabet cannot cross a `]`, so these would otherwise be uncounted; they are captured
 * here with the receiver recorded as `<base>[]` and adjudicated in the SAME frozen lexicon.
 * Counted into the SAME per-needle totals — a read is a read however the body was indexed.
 */
const INDEXED_RE = new RegExp(
  `(${NEEDLE_PREFIX_ALPHABET})\\[[^\\]]*\\]\\.(pos|vel|bodyDir|heading)\\b`, 'g',
);
/** what remains uncapturable: a read off a CALL RESULT. A RED gate if it ever appears. */
const UNCAPTURED_RE = /\)\.(?:pos|vel|bodyDir|heading)\b/g;

type Grade = 'chooser' | 'executor' | 'physics' | 'observed' | 'outside';
const DIR_GRADE: readonly (readonly [string, Grade])[] = [
  ['src/render3d/', 'outside'], ['src/render/', 'outside'], ['src/ui/', 'outside'],
  ['src/game/', 'outside'], ['src/evolution/', 'outside'], ['src/utils/', 'outside'],
  ['src/audio/', 'outside'], ['src/pwa/', 'outside'], ['src/style/', 'outside'],
  ['src/replay/', 'outside'], ['src/data/', 'outside'],
];
const FILE_GRADE: Readonly<Record<string, Grade>> = {
  /* --- the perception trunk: already-observed reads --- */
  'src/ai/perceptionSnapshot.ts': 'observed',
  'src/ai/perception.ts': 'observed',
  'src/ai/attentionPolicy.ts': 'observed',
  'src/ai/motionEvidence.ts': 'observed',
  'src/ai/offballEyes.ts': 'observed',
  'src/ai/eyeContextBitsV4.ts': 'observed',
  /* --- the choosers: option scoring, valuation, assignment --- */
  'src/ai/PlayerBrain.ts': 'chooser',
  'src/ai/TeamBrain.ts': 'chooser',
  'src/ai/passAffordance.ts': 'chooser',
  'src/ai/passOptionPricing.ts': 'chooser',
  'src/ai/passOptionValue.ts': 'chooser',
  'src/ai/passValue.ts': 'chooser',
  'src/ai/passPrior.ts': 'chooser',
  'src/ai/passWeightChooser.ts': 'chooser',
  'src/ai/passLeadSeat.ts': 'chooser',
  'src/ai/passCorridorInterception.ts': 'chooser',
  'src/ai/perceivedPassChoice.ts': 'chooser',
  'src/ai/carryAffordance.ts': 'chooser',
  'src/ai/carryChoiceSeat.ts': 'chooser',
  'src/ai/offBallAffordance.ts': 'chooser',
  'src/ai/offBallCoordination.ts': 'chooser',
  'src/ai/defensiveCoordination.ts': 'chooser',
  'src/ai/defenceBook.ts': 'chooser',
  'src/ai/deliveryAccountBook.ts': 'chooser',
  'src/ai/deliveryChoiceSeat.ts': 'chooser',
  'src/ai/deliveryValueSeat.ts': 'chooser',
  'src/ai/holdAccountBook.ts': 'chooser',
  'src/ai/whetherEye.ts': 'chooser',
  'src/ai/stationEye.ts': 'chooser',
  'src/ai/strikePlaneSeat.ts': 'chooser',
  'src/ai/lookSeat.ts': 'chooser',
  'src/ai/mentality.ts': 'chooser',
  'src/ai/intentProcess.ts': 'chooser',
  'src/ai/intentResponse.ts': 'chooser',
  'src/ai/motionGatedIntentResponse.ts': 'chooser',
  'src/ai/teamTaskOccupancy.ts': 'chooser',
  'src/ai/relativeAffordance.ts': 'chooser',
  'src/ai/reachability.ts': 'chooser',
  'src/ai/prediction.ts': 'chooser',
  'src/ai/kickTransitionFeatures.ts': 'chooser',
  'src/ai/kickTransitionCorridorFeatures.ts': 'chooser',
  'src/ai/pcLatency.ts': 'chooser',
  /* --- the executors: steering, targets, spots --- */
  'src/ai/actionExecutor.ts': 'executor',
  'src/ai/steering.ts': 'executor',
  'src/ai/formations.ts': 'executor',
  'src/ai/offBallMove.ts': 'executor',
  'src/sim/rendezvousRecovery.ts': 'executor',
  /* --- the physics: contact, capture, kick resolution, the tick --- */
  'src/sim/Match.ts': 'physics',
  'src/sim/mechanics.ts': 'physics',
  'src/sim/Player.ts': 'physics',
  'src/sim/Team.ts': 'physics',
  'src/sim/physical.ts': 'physics',
  'src/sim/carryBeat.ts': 'physics',
  'src/sim/controlCoupling.ts': 'physics',
  'src/sim/League.ts': 'outside',
  'src/sim/types.ts': 'outside',
  'src/sim/constants.ts': 'outside',
  /* --- the remaining sim/app files: not decision surfaces --- */
  'src/sim/Ball.ts': 'physics',
  'src/sim/chronicle.ts': 'outside',
  'src/sim/cloneState.ts': 'outside',
  'src/sim/cup.ts': 'outside',
  'src/sim/profiler.ts': 'outside',
  'src/sim/ratings.ts': 'outside',
  'src/sim/records.ts': 'outside',
  'src/sim/simRunner.ts': 'outside',
  'src/main.ts': 'outside',
  'src/vite-env.d.ts': 'outside',
};

type Role = 'self' | 'ball' | 'other' | 'seen' | 'frame' | 'nonbody';
const RECEIVER_LEXICON: Readonly<Record<string, Role>> = {
  /* the deciding body — the engine's universal parameter name for "this body" */
  p: 'self', this: 'self', self: 'self', observer: 'self', me: 'self',
  /* the ball, in every alias the tree uses */
  ball: 'ball', 'match.ball': 'ball', 'this.ball': 'ball', 'truth.ball': 'ball',
  'input.ball': 'ball', 'snap.ball': 'ball', 'memory.ball': 'ball', 'buffer.ball': 'ball',
  'ball.owner': 'other',
  /* ANOTHER BODY — every alias the decision layers use for a body that is not the reader */
  o: 'other', q: 'other', mate: 'other', carrier: 'other', owner: 'other', gk: 'other',
  target: 'other', mark: 'other', threat: 'other', defender: 'other', runner: 'other',
  crosser: 'other', taker: 'other', tackler: 'other', trapper: 'other', winner: 'other',
  candidate: 'other', opponent: 'other', other: 'other', middle: 'other', back: 'other',
  outletA: 'other', outletB: 'other', bestCrossMate: 'other', bestThrowMate: 'other',
  'team.goalkeeper': 'other', shooter: 'other', passer: 'other', actor: 'other',
  player: 'other', body: 'other', entity: 'other', controller: 'other', 'input.player': 'other',
  a: 'other', b: 'other', c: 'other', d: 'other', r: 'other', lm: 'other', st: 'other',
  near: 'other', pinch: 'other', first: 'other', last: 'other', newest: 'other',
  arr: 'other', reference: 'other', real: 'other', predictedPlayer: 'other',
  /* PERCEPT reads — already private, already aged */
  seen: 'seen', observed: 'seen', obs: 'seen', fact: 'seen', seenTarget: 'seen',
  seenMate: 'seen', seenSelf: 'seen', seenPasser: 'seen', snapshot: 'seen', entry: 'seen',
  sample: 'seen', state: 'seen',
  /* perception-trunk bookkeeping copies */
  into: 'frame', from: 'frame', to: 'frame',
  /* not bodies */
  'match.fkWall': 'nonbody', 'match.restart': 'nonbody', 'style.sun': 'nonbody',
  'this.referee': 'nonbody', wall: 'nonbody', block: 'nonbody', context: 'nonbody',
  'plan.ballAfterSingleImpulse': 'nonbody', D: 'nonbody', ref: 'nonbody', team: 'nonbody',
  slider: 'nonbody',
  /* INDEXED receivers — a body taken out of a collection by index */
  'this.allPlayers[]': 'other', 'allPlayers[]': 'other', 'team.players[]': 'other',
  'opp.players[]': 'other', 'players[]': 'other', 'truth.players[]': 'other',
  'frame.players[]': 'other', 'buffer.players[]': 'other', 'snapshot.players[]': 'seen',
};

const GATEWAY_RE = /\b(?:[A-Za-z_$][A-Za-z0-9_$]*\.)*(?:allPlayers|players|teammates|opponents|outfield)\b(?!\s*[:(])/g;
const GATEWAY_NEEDLES = ['team.players', 'opp.players', 'match.allPlayers', 'this.allPlayers',
  'allPlayers', '.players'] as const;

interface Site {
  file: string; line: number; needle: Needle; receiver: string; role: Role; grade: Grade;
}

/**
 * ⛔ THE OLD BUGGY STRIPPER, byte-verbatim from the frozen probe. It is KEPT — not to be
 * used for the census, but as the NAIVE PASS of the corpus-integrity cross-check and as
 * the MUTANT for the canon's mutation receipt.
 */
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

const walkTree = (dir: string, into: string[]): string[] => {
  for (const entry of readdirSync(dir)) {
    const full = pathJoin(dir, entry);
    if (statSync(full).isDirectory()) walkTree(full, into);
    else if (entry.endsWith('.ts')) into.push(full);
  }
  return into;
};
const SRC_FILES = walkTree('src', []).sort();

const gradeOf = (file: string): Grade | null => {
  if (FILE_GRADE[file] !== undefined) return FILE_GRADE[file];
  for (const [prefix, g] of DIR_GRADE) if (file.startsWith(prefix)) return g;
  return null;
};

/* ========================================================================== */
/* §2 THE FIX — A REAL STRIPPER (comments AND strings AND regex literals)      */
/* ========================================================================== */
/**
 * One pass, left to right, over the lexical states that can hide a delimiter from another
 * delimiter. Newlines are PRESERVED for every stripped span so line numbers survive
 * (the census reports `file:line`, so this is load-bearing).
 *
 *   code          — emitted verbatim; the only state in which `//`, `/*`, a quote, a
 *                   backtick or a regex literal can OPEN.
 *   lineComment   — opened by `//`; closes at the newline. CANNOT open a block comment:
 *                   this single ordering fact is the whole bug of record.
 *   blockComment  — opened by `/*`; closes at the first `*​/`. CANNOT be opened from
 *                   inside a line comment, a string or a regex.
 *   string        — `'` or `"`; honours backslash escapes; a newline terminates it (the
 *                   tree has no line-continued strings, and stopping at the newline
 *                   fails SAFE — it cannot swallow the next line).
 *   template      — `` ` ``; literal chunks are stripped, but `${ ... }` INTERPOLATIONS
 *                   are processed as CODE (brace-depth tracked on a stack), because a
 *                   read inside an interpolation is a real read.
 *   regex         — `/` in a position where a regex may start (decided from the last
 *                   significant code character); honours `[...]` classes and escapes.
 *                   Without this state, `.replace(/&/g, '&amp;')`-style lines could hand
 *                   a stray quote to the string state.
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

/**
 * ⭐⭐ THE PRODUCTION ALIAS — the ONE line the mutation receipt swaps. At HEAD it is the
 * tokenizer; setting it to `stripComments` (the old bug) must turn the corpus-integrity
 * gates RED. Nothing else in this file selects a stripper.
 */
const strip: (src: string) => string = stripTokens;

/* ========================================================================== */
/* §3 THE CENSUS — one scan function, run under BOTH strippers                 */
/* ========================================================================== */
interface Scan {
  sites: Site[];
  unknownReceivers: Map<string, number>;
  uncaptured: number;
  uncapturedSites: string[];
  unmappedFiles: string[];
  perFileNeedles: Record<string, number>;
  strippedByFile: Record<string, string>;
}
const scan = (stripper: (s: string) => string): Scan => {
  const sites: Site[] = [];
  const unknownReceivers = new Map<string, number>();
  const unmappedFiles: string[] = [];
  const uncapturedSites: string[] = [];
  const perFileNeedles: Record<string, number> = {};
  const strippedByFile: Record<string, string> = {};
  let uncaptured = 0;
  for (const file of SRC_FILES) {
    const grade = gradeOf(file);
    if (grade === null) { unmappedFiles.push(file); continue; }
    const stripped = stripper(readFileSync(file, 'utf8'));
    strippedByFile[file] = stripped;
    const lines = stripped.split('\n');
    let hits = 0;
    for (let li = 0; li < lines.length; li++) {
      const line = lines[li];
      NEEDLE_RE.lastIndex = 0;
      let m = NEEDLE_RE.exec(line);
      while (m !== null) {
        const receiver = m[1];
        const needle = m[2] as Needle;
        const role = RECEIVER_LEXICON[receiver];
        hits += 1;
        if (role === undefined) {
          unknownReceivers.set(receiver, (unknownReceivers.get(receiver) ?? 0) + 1);
        } else {
          sites.push({ file, line: li + 1, needle, receiver, role, grade });
        }
        m = NEEDLE_RE.exec(line);
      }
      INDEXED_RE.lastIndex = 0;
      let ix = INDEXED_RE.exec(line);
      while (ix !== null) {
        const receiver = `${ix[1]}[]`;
        const needle = ix[2] as Needle;
        const role = RECEIVER_LEXICON[receiver];
        hits += 1;
        if (role === undefined) {
          unknownReceivers.set(receiver, (unknownReceivers.get(receiver) ?? 0) + 1);
        } else {
          sites.push({ file, line: li + 1, needle, receiver, role, grade });
        }
        ix = INDEXED_RE.exec(line);
      }
      UNCAPTURED_RE.lastIndex = 0;
      let u = UNCAPTURED_RE.exec(line);
      while (u !== null) {
        uncaptured += 1;
        uncapturedSites.push(`${file}:${li + 1}`);
        u = UNCAPTURED_RE.exec(line);
      }
    }
    perFileNeedles[file] = hits;
  }
  return {
    sites, unknownReceivers, uncaptured, uncapturedSites, unmappedFiles, perFileNeedles,
    strippedByFile,
  };
};

const FIX = scan(strip);
const NAIVE = scan(stripComments);
/** the verifier's arm (whole template literals stripped) — used ONLY for reconciliation */
const TMPLARM = scan((s) => stripTokens(s, false));
const sites = FIX.sites;
const needleCounts = Object.fromEntries(NEEDLES.map((n) => [n,
  sites.filter((s) => s.needle === n).length])) as Record<Needle, number>;
const GRADES: readonly Grade[] = ['chooser', 'executor', 'physics', 'observed', 'outside'];
const ROLES: readonly Role[] = ['self', 'ball', 'other', 'seen', 'frame', 'nonbody'];
const surfaceMatrix = GRADES.map((g) => ROLES.map((r) => sites
  .filter((s) => s.grade === g && s.role === r).length));
/** ⭐ THE VERDICT QUANTITY: other-body truth reads a private snapshot must interpose at */
const interposeSites = sites.filter((s) => s.role === 'other'
  && (s.grade === 'chooser' || s.grade === 'executor'));
const interposeChooser = interposeSites.filter((s) => s.grade === 'chooser');
const interposeExecutor = interposeSites.filter((s) => s.grade === 'executor');
const physicsOtherSites = sites.filter((s) => s.role === 'other' && s.grade === 'physics');
const interposeFiles = [...new Set(interposeSites.map((s) => s.file))].sort();

/* the gateway census — where a decision OBTAINS a collection of bodies */
const gatewayCounts: Record<string, number> = {};
const gatewaySites: string[] = [];
for (const file of SRC_FILES) {
  const grade = gradeOf(file);
  if (grade !== 'chooser' && grade !== 'executor') continue;
  const lines = (FIX.strippedByFile[file] ?? '').split('\n');
  for (let li = 0; li < lines.length; li++) {
    GATEWAY_RE.lastIndex = 0;
    let m = GATEWAY_RE.exec(lines[li]);
    while (m !== null) {
      const tok = m[0];
      gatewayCounts[tok] = (gatewayCounts[tok] ?? 0) + 1;
      gatewaySites.push(`${file}:${li + 1}:${tok}`);
      m = GATEWAY_RE.exec(lines[li]);
    }
  }
}
const gatewayNaiveCounts: Record<string, number> = {};
for (const file of SRC_FILES) {
  const grade = gradeOf(file);
  if (grade !== 'chooser' && grade !== 'executor') continue;
  const lines = (NAIVE.strippedByFile[file] ?? '').split('\n');
  for (const l of lines) {
    GATEWAY_RE.lastIndex = 0;
    let m = GATEWAY_RE.exec(l);
    while (m !== null) {
      gatewayNaiveCounts[m[0]] = (gatewayNaiveCounts[m[0]] ?? 0) + 1;
      m = GATEWAY_RE.exec(l);
    }
  }
}

/* ========================================================================== */
/* §4 THE CORPUS-INTEGRITY GATE (canon: NON-VACUOUS against the FULL corpus)   */
/* ========================================================================== */
/**
 * (a) THE CROSS-CHECK. Per-file needle counts under the naive pass vs the tokenizer pass.
 *     Agreement is the norm; every DISAGREEMENT is enumerated with its deficit and its
 *     blanked-code-line count. The 8 files the verifier named must surface here — pinned
 *     by NAME below so the regression cannot come back silently.
 * (b) THE STRUCTURAL ORACLE, independent of needles entirely: correctly stripped TS must
 *     be brace/paren/bracket BALANCED per file and carry no residual comment markers. A
 *     stripper that swallows real code destroys the balance — which is why the mutation
 *     goes red on files the needle cross-check alone might not notice.
 */
interface Disagreement {
  file: string; tokenizer: number; naive: number; deficit: number;
  codeLinesSwallowedByNaive: number; partialLinesTruncatedByNaive: number;
  charsLostOnPartialLines: number; codeLinesOfFile: number;
}
/**
 * A line is SWALLOWED by the naive pass when the tokenizer leaves code on it and the naive
 * pass leaves it blank — a directional, per-line measure (the earlier
 * "count-the-nonempty-lines" difference is NOT directional: this tokenizer also blanks
 * template-literal text, which is correct behaviour and must not be scored as truncation).
 */
const lossOf = (tok: string, nv: string): { swallowed: number; partial: number; chars: number } => {
  const a = tok.split('\n');
  const b = nv.split('\n');
  let swallowed = 0; let partial = 0; let chars = 0;
  for (let i = 0; i < a.length; i++) {
    const x = a[i].trim();
    const y = (b[i] ?? '').trim();
    if (x.length > 0 && y.length === 0) { swallowed += 1; continue; }
    /* a TAIL loss: `//` inside a STRING literal, cut by the naive line-comment split */
    if (y.length < x.length) { partial += 1; chars += x.length - y.length; }
  }
  return { swallowed, partial, chars };
};
const codeLines = (s: string): number => s.split('\n').filter((l) => l.trim().length > 0).length;
const disagreements: Disagreement[] = [];
let codeLinesSwallowedTotal = 0;
for (const file of Object.keys(FIX.perFileNeedles)) {
  const t = FIX.perFileNeedles[file];
  const nv = NAIVE.perFileNeedles[file] ?? 0;
  const loss = lossOf(FIX.strippedByFile[file], NAIVE.strippedByFile[file]);
  if (t !== nv || loss.swallowed > 0 || loss.partial > 0) {
    disagreements.push({
      file, tokenizer: t, naive: nv, deficit: t - nv, codeLinesSwallowedByNaive: loss.swallowed,
      partialLinesTruncatedByNaive: loss.partial, charsLostOnPartialLines: loss.chars,
      codeLinesOfFile: readFileSync(file, 'utf8').split('\n').length,
    });
    codeLinesSwallowedTotal += loss.swallowed;
  }
}
disagreements.sort((a, b) => b.codeLinesSwallowedByNaive - a.codeLinesSwallowedByNaive
  || a.file.localeCompare(b.file));
/**
 * ⭐ THE PINNED TRUNCATION SET, MEASURED AND SPLIT BY MECHANISM. Pinned BY NAME so the
 * regression cannot come back quietly: the cross-check must enumerate exactly these, no
 * more and no fewer.
 *
 *  BLANKED — the phantom-block mechanism of record: a `/*` inside a LINE comment opens a
 *            block that swallows whole code lines. SEVEN files, 1,190 lines.
 *  TAIL    — the SECOND, smaller mechanism the same bug carries: the naive pass splits on
 *            `//` even inside a STRING literal, cutting the tail of the line. TWO files,
 *            2 characters each (a protocol-relative `//` in a UI string).
 *
 * ⚠ THE VERIFIER'S FIGURE WAS "8 files, 1,194 code lines" (#317 item 1). This probe measures
 * 7 blanking files / 1,190 fully-blanked lines + 2 tail-truncated files, i.e. NINE files
 * touched by the bug under a directional per-line measure. The disagreement is a LINE-
 * ACCOUNTING convention, not a corpus disagreement: the naive pass here reproduces the
 * frozen published totals EXACTLY (1,336 / 215 / 157 — `gNaiveReproducesFrozenNumbers`) and
 * the tokenizer reproduces the verifier's magnitudes EXACTLY (1,488 / 254 / 77 —
 * `gVerifierCrossCheckReconciled`). Both endpoints agree; only the middle bookkeeping does not.
 */
const BLANKED_FILES_OF_RECORD: readonly string[] = [
  'src/ai/PlayerBrain.ts',
  'src/ai/actionExecutor.ts',
  'src/ai/deliveryAccountBook.ts',
  'src/ai/deliveryValueSeat.ts',
  'src/ai/formations.ts',
  'src/sim/Match.ts',
  'src/sim/mechanics.ts',
];
const TAIL_TRUNCATED_FILES_OF_RECORD: readonly string[] = [
  'src/ui/EvolutionScreen.ts',
  'src/ui/PlayerScreen.ts',
];
const TRUNCATED_FILES_OF_RECORD: readonly string[] = [...BLANKED_FILES_OF_RECORD,
  ...TAIL_TRUNCATED_FILES_OF_RECORD].sort();
const disagreeFiles = new Set(disagreements.map((d) => d.file));

interface Balance { file: string; paren: number; brace: number; bracket: number; residue: string[] }
const balanceOf = (file: string, text: string): Balance => {
  let paren = 0; let brace = 0; let bracket = 0;
  let minParen = 0; let minBrace = 0; let minBracket = 0;
  for (const ch of text) {
    if (ch === '(') paren += 1; else if (ch === ')') { paren -= 1; minParen = Math.min(minParen, paren); }
    else if (ch === '{') brace += 1; else if (ch === '}') { brace -= 1; minBrace = Math.min(minBrace, brace); }
    else if (ch === '[') bracket += 1; else if (ch === ']') { bracket -= 1; minBracket = Math.min(minBracket, bracket); }
  }
  const residue: string[] = [];
  if (text.includes('/*')) residue.push('/*');
  if (text.includes('*/')) residue.push('*/');
  if (text.includes('//')) residue.push('//');
  if (minParen < 0) residue.push('paren-underflow');
  if (minBrace < 0) residue.push('brace-underflow');
  if (minBracket < 0) residue.push('bracket-underflow');
  return { file, paren, brace, bracket, residue };
};
const balances = Object.keys(FIX.strippedByFile)
  .map((f) => balanceOf(f, FIX.strippedByFile[f]));
const balanceFailures = balances.filter((b) => b.paren !== 0 || b.brace !== 0
  || b.bracket !== 0 || b.residue.length > 0);
const naiveBalances = Object.keys(NAIVE.strippedByFile)
  .map((f) => balanceOf(f, NAIVE.strippedByFile[f]));
const naiveBalanceFailures = naiveBalances.filter((b) => b.paren !== 0 || b.brace !== 0
  || b.bracket !== 0 || b.residue.length > 0);

/* ---- the frozen-definition drift gate: the copied blocks, re-compared at run time ---- */
const BLOCK_ANCHORS: readonly (readonly [string, string])[] = [
  ["const NEEDLES = ['pos'", 'const UNCAPTURED_RE = /\\)\\.(?:pos|vel|bodyDir|heading)\\b/g;'],
  ["type Grade = 'chooser'", "'src/vite-env.d.ts': 'outside',\n};"],
  ["type Role = 'self'", "'snapshot.players[]': 'seen',\n};"],
  ['const GATEWAY_RE =', "'allPlayers', '.players'] as const;"],
  ['interface Site {', 'grade: Grade;\n}'],
  ['const stripComments = (src: string): string => {',
    "return out.split('\\n').map((l) => l.split('//')[0]).join('\\n');\n};"],
  ['const walkTree = (dir: string', "const SRC_FILES = walkTree('src', []).sort();"],
  ['const gradeOf = (file: string)', '  return null;\n};'],
];
const blockOf = (src: string, a: string, b: string): string | null => {
  const i = src.indexOf(a);
  if (i < 0) return null;
  const j = src.indexOf(b, i);
  if (j < 0) return null;
  return src.slice(i, j + b.length);
};
const FROZEN_SRC = readFileSync(FROZEN_PROBE, 'utf8');
const SELF_SRC = readFileSync(SELF_PATH, 'utf8');
const blockChecks = BLOCK_ANCHORS.map(([a, b]) => {
  const f = blockOf(FROZEN_SRC, a, b);
  const s = blockOf(SELF_SRC, a, b);
  return {
    anchor: a, ok: f !== null && s !== null && f === s, sha256: f === null ? '' : sha256(f),
    bytes: f === null ? 0 : f.length,
  };
});

/* ========================================================================== */
/* §5 THE THREE Match.ts REFEREE/SETUP READS — classed EXPLICITLY (#317 item 3)*/
/* ========================================================================== */
/**
 * The frozen census exempted these by FILENAME (Match.ts = physics grade). Of record they
 * are WORLD-OWNED referee/setup judgements, not decisions a body makes — one sentence each,
 * anchored to the enclosing construct, not to a line number alone.
 */
const REFEREE_READS: readonly { anchor: string; sentence: string }[] = [
  {
    anchor: 'goalKick offside-line walk-back (o.pos.x / o.vel.x clamp)',
    sentence: 'THE REFEREE WALKS THE CAMPERS BACK: during goal-kick setup the world moves '
      + 'stranded attackers behind the offside line and damps their velocity — the world '
      + 'writing bodies, not a body reading another body to decide, so no snapshot '
      + 'interposes (a private snapshot of where the referee put you would be a bug).',
  },
  {
    anchor: 'freeKick wall-readiness: dist(this.allPlayers[gid].pos, wallCenter) < 4',
    sentence: 'THE REFEREE ASKS IF THE WALL HAS FORMED: the world measures wall members '
      + 'against the wall centre to decide whether the restart may be taken early — a '
      + 'RESTART-LEGALITY judgement made by the world with ground truth, which must not be '
      + 'degraded by any body\'s perception.',
  },
  {
    anchor: 'freeKick wall-set count: dist(this.allPlayers[gid].pos, slots[i]) < 1.5',
    sentence: 'THE REFEREE COUNTS BODIES INTO THEIR SLOTS: the same setup clock checks how '
      + 'many wall members have reached their assigned slots before releasing the kick — '
      + 'world-owned setup bookkeeping, ground truth by construction, outside the '
      + 'snapshot surface.',
  },
];

/* ========================================================================== */
/* §6 THE VERIFIER CROSS-CHECK + THE VOIDED FROZEN NUMBERS                     */
/* ========================================================================== */
/** the verifier's INDEPENDENT tokenizer read these magnitudes (#317 item 1) */
const VERIFIER_EXPECTED = { occurrences: 1488, interposeSites: 254, truthBearingGateways: 77 } as const;
/**
 * the VOID published numbers, kept for the delta of record. `truthBearingGateways` 42 was
 * `team.players` 26 + `opp.players` 14 + `match.allPlayers` 2 (§R5 / §R7 item 1 of the
 * frozen report); `gatewaySiteCount` 157 and `gatewayDistinctTokens` 11 were its siblings.
 */
const VOID_PUBLISHED = {
  occurrences: 1336, interposeSites: 215, truthBearingGateways: 42, gatewaySiteCount: 157,
  gatewayDistinctTokens: 11,
} as const;
/**
 * ⭐ THE TRUTH-BEARING gateway tokens — the ones that hand a decision the WORLD's own
 * collection of bodies. Everything else in the gateway census is already percept-side
 * (a snapshot/percept collection: nothing to interpose at). `pwSnapshot.players` — the
 * token the frozen census MISSED (#317 item 3) — is PERCEPT-SIDE of record: `pwSnapshot`
 * is `match.perceivedSnapshot(p, pwScope)` (PlayerBrain.ts:1269), i.e. already private,
 * already aged. It is published here with that classification, not buried.
 */
const TRUTH_BEARING_GATEWAY_TOKENS = ['team.players', 'opp.players', 'match.allPlayers',
  'this.allPlayers', 'allPlayers', 'players', 'teammates', 'opponents', 'outfield'] as const;
const PERCEPT_SIDE_GATEWAY_TOKENS = ['snapshot.players', 'snap.players', 'perceived.players',
  'input.snapshot.players', 'pwSnapshot.players'] as const;
const truthBearingGatewayCounts = Object.fromEntries(Object.entries(gatewayCounts)
  .filter(([t]) => (TRUTH_BEARING_GATEWAY_TOKENS as readonly string[]).includes(t)));
const perceptSideGatewayCounts = Object.fromEntries(Object.entries(gatewayCounts)
  .filter(([t]) => (PERCEPT_SIDE_GATEWAY_TOKENS as readonly string[]).includes(t)));
/** the verifier's own comparable: the two named world collections */
const teamOppGateways = (gatewayCounts['team.players'] ?? 0) + (gatewayCounts['opp.players'] ?? 0);
const measured = {
  occurrences: sites.length,
  interposeSites: interposeSites.length,
  truthBearingGateways: sum(Object.values(truthBearingGatewayCounts)),
  teamOppGateways,
  gatewaySiteCount: gatewaySites.length,
  gatewayDistinctTokens: Object.keys(gatewayCounts).length,
};
/**
 * ⭐⭐ THE RECONCILIATION WITH THE VERIFIER'S INDEPENDENT TOKENIZER, ENUMERATED. This probe
 * keeps `${...}` interpolation code (a read inside an interpolation IS a read); the
 * verifier's tokenizer stripped whole template literals. The whole difference is the
 * `TMPLARM` scan, and it is enumerated site by site — not asserted.
 */
const tmplSiteKey = (s: Site): string => `${s.file}:${s.line}:${s.receiver}.${s.needle}`;
const tmplArmKeys = new Set(TMPLARM.sites.map(tmplSiteKey));
const interpolationBorneSites = sites.filter((s) => !tmplArmKeys.has(tmplSiteKey(s)));
const interpolationBorneInterpose = interpolationBorneSites.filter((s) => s.role === 'other'
  && (s.grade === 'chooser' || s.grade === 'executor'));
const reconciled = {
  occurrences: sites.length - interpolationBorneSites.length,
  interposeSites: interposeSites.length - interpolationBorneInterpose.length,
};

/* ========================================================================== */
/* §7 GATES                                                                    */
/* ========================================================================== */
const srcStatus = gitOut(['status', '--porcelain', '--', 'src']);
const gates: Record<string, boolean> = {
  /** the frozen instrument definitions are byte-identical to the frozen probe's */
  gDefinitionsUnchanged: blockChecks.every((b) => b.ok),
  /** src is untouched: this is an instrument-only step */
  gSrcUntouched: srcStatus === '',
  /** canon: counts per needle AND every occurrence's site enumerated */
  gNeedleEnumeration: sum(NEEDLES.map((n) => needleCounts[n])) === sites.length
    && sites.every((s) => s.line > 0 && s.file.startsWith('src/'))
    && sum(surfaceMatrix.map((r) => sum(r))) === sites.length,
  gNoUnknownReceiver: FIX.unknownReceivers.size === 0,
  gNoUnmappedFile: FIX.unmappedFiles.length === 0,
  gNoUncapturedReceiver: FIX.uncaptured === 0,
  /** line numbers survive stripping — the census reports file:line */
  gLineNumbersPreserved: SRC_FILES.every((f) => {
    const raw = readFileSync(f, 'utf8').split('\n').length;
    const st = FIX.strippedByFile[f];
    return st === undefined || st.split('\n').length === raw;
  }),
  /**
   * ⭐⭐ CORPUS INTEGRITY (a) — the cross-check is NON-VACUOUS: the naive pass and the
   * tokenizer pass are compared per file, the tokenizer never sees LESS than the naive
   * pass (blanking can only lose), and the enumerated disagreement is exactly the 8
   * truncated files of record. Under the mutation both passes are the same stripper, the
   * disagreement set is EMPTY, and this gate goes RED.
   */
  gCorpusCrossCheckNonVacuous: disagreements.length > 0
    && disagreements.every((d) => d.deficit >= 0)
    && TRUNCATED_FILES_OF_RECORD.every((f) => disagreeFiles.has(f))
    && disagreements.length === TRUNCATED_FILES_OF_RECORD.length
    && BLANKED_FILES_OF_RECORD.every((f) => (disagreements
      .find((d) => d.file === f)?.codeLinesSwallowedByNaive ?? 0) > 0)
    && TAIL_TRUNCATED_FILES_OF_RECORD.every((f) => (disagreements
      .find((d) => d.file === f)?.partialLinesTruncatedByNaive ?? 0) > 0)
    && codeLinesSwallowedTotal > 0,
  /**
   * ⭐⭐ THE MUTANT IS THE HISTORICAL BUG, PROVEN: the naive pass reproduces the frozen
   * probe's PUBLISHED totals exactly (1,336 occurrences / 215 interpose / 157 gateway sites
   * / 11 distinct tokens). Without this, "the naive pass" would be an unvouched straw man.
   */
  gNaiveReproducesFrozenNumbers: NAIVE.sites.length === VOID_PUBLISHED.occurrences
    && NAIVE.sites.filter((s) => s.role === 'other'
      && (s.grade === 'chooser' || s.grade === 'executor')).length
      === VOID_PUBLISHED.interposeSites
    && sum(Object.values(gatewayNaiveCounts)) === VOID_PUBLISHED.gatewaySiteCount
    && Object.keys(gatewayNaiveCounts).length === VOID_PUBLISHED.gatewayDistinctTokens,
  /**
   * ⭐⭐ CORPUS INTEGRITY (b) — the INDEPENDENT structural oracle: every file's stripped
   * code is balanced and comment-marker free. Under the mutation, swallowed code leaves
   * unbalanced braces and stray `*​/` markers, and this gate goes RED.
   */
  gStrippedCorpusStructurallySound: balanceFailures.length === 0,
  /** the oracle must be able to FAIL: it does, on the naive pass, at HEAD */
  gOracleDiscriminates: naiveBalanceFailures.length > 0,
  /**
   * ⭐ THE INDEPENDENT-TOKENIZER CROSS-CHECK (canon route (a)): the verifier's magnitudes
   * are reproduced EXACTLY once the one known methodological difference — template
   * interpolations kept as code here, stripped there — is removed, and that difference is
   * enumerated site by site rather than asserted.
   */
  gVerifierCrossCheckReconciled: reconciled.occurrences === VERIFIER_EXPECTED.occurrences
    && reconciled.interposeSites === VERIFIER_EXPECTED.interposeSites
    && teamOppGateways === VERIFIER_EXPECTED.truthBearingGateways
    && interpolationBorneSites.length
      === sites.length - VERIFIER_EXPECTED.occurrences,
  /** the missed token of record is now counted */
  gPwSnapshotTokenCounted: (gatewayCounts['pwSnapshot.players'] ?? 0) > 0,
  /** the interpose split partitions the surface */
  gInterposeSplitPartitions:
    interposeChooser.length + interposeExecutor.length === interposeSites.length
    && interposeSites.length > 0,
  /** the three referee/setup reads are classed, one sentence each */
  gRefereeReadsClassed: REFEREE_READS.length === 3
    && REFEREE_READS.every((r) => r.sentence.length > 120),
  /** the fix can only have RAISED the voided numbers */
  gFixIsAnUnderCountRepair: measured.occurrences > VOID_PUBLISHED.occurrences
    && measured.interposeSites > VOID_PUBLISHED.interposeSites
    && measured.truthBearingGateways > VOID_PUBLISHED.truthBearingGateways
    && measured.gatewaySiteCount > VOID_PUBLISHED.gatewaySiteCount,
  /** the gateway census partitions: every token is classed truth-bearing or percept-side */
  gGatewayCensusPartitions: Object.keys(gatewayCounts).every(
    (t) => (TRUTH_BEARING_GATEWAY_TOKENS as readonly string[]).includes(t)
      || (PERCEPT_SIDE_GATEWAY_TOKENS as readonly string[]).includes(t),
  )
    && sum(Object.values(truthBearingGatewayCounts))
      + sum(Object.values(perceptSideGatewayCounts)) === gatewaySites.length,
};
const ALL_GREEN = Object.values(gates).every((v) => v);

/* ========================================================================== */
/* §8 ARTIFACT + BANNER                                                        */
/* ========================================================================== */
const artifact = {
  probe: SELF_PATH,
  orderedBy: 'COMMANDER RULING #317 item 3 (IN-C0-FIX, static half only; battery stands)',
  canon: 'text-census corpus integrity — a text-census completeness gate must be proven '
    + 'NON-VACUOUS against the FULL corpus (independent tokenizer cross-check or a mutation '
    + 'reintroducing the truncation goes red); comment/string stripping is itself an '
    + 'instrument. [CANON.md; home IN-C0 §COMMANDER CORRECTIONS 2]',
  staticOnly: 'the battery/ladder cells are NOT re-run and are NOT restated here; seeds: NONE',
  git: {
    head: gitOut(['rev-parse', 'HEAD']),
    srcStatusPorcelain: srcStatus,
    frozenProbeSha256: sha256(FROZEN_SRC),
  },
  corpus: {
    files: SRC_FILES.length,
    filesGraded: Object.keys(FIX.perFileNeedles).length,
    rawBytes: sum(SRC_FILES.map((f) => readFileSync(f, 'utf8').length)),
  },
  /* --- the numbers of record --- */
  needlePrefixAlphabet: NEEDLE_PREFIX_ALPHABET,
  needlePrefixNote: 'the PREFIX is the receiver expression immediately left of the dot '
    + '(plain or dotted, plus the indexed form `<base>[]`); the four needles are the four '
    + 'body-state fields a decision could read off another body',
  needles: NEEDLES,
  needleCounts,
  occurrencesEnumerated: sites.length,
  surfaceMatrixGrades: GRADES,
  surfaceMatrixRoles: ROLES,
  surfaceMatrix,
  byGrade: Object.fromEntries(GRADES.map((g) => [g, sites.filter((s) => s.grade === g).length])),
  byRole: Object.fromEntries(ROLES.map((r) => [r, sites.filter((s) => s.role === r).length])),
  interposeSiteCount: interposeSites.length,
  interposeByGrade: { chooser: interposeChooser.length, executor: interposeExecutor.length },
  interposeFileCount: interposeFiles.length,
  interposeFiles,
  interposeSitesEnumerated: interposeSites
    .map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}:${s.grade}`),
  physicsOtherBodySitesStayTruth: physicsOtherSites.length,
  physicsOtherBodySitesEnumerated: physicsOtherSites
    .map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}`),
  refereeSetupReadsClassed: REFEREE_READS,
  /** EVERY occurrence's site (canon) */
  sites: sites.map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}:${s.role}:${s.grade}`),
  /* --- the gateway census --- */
  gatewayNeedles: GATEWAY_NEEDLES,
  gatewayRegexSource: GATEWAY_RE.source,
  gatewayCounts,
  gatewayDistinctTokens: Object.keys(gatewayCounts).length,
  gatewaySiteCount: gatewaySites.length,
  gatewaySites,
  truthBearingGatewayCounts,
  truthBearingGatewaySites: sum(Object.values(truthBearingGatewayCounts)),
  perceptSideGatewayCounts,
  perceptSideGatewaySites: sum(Object.values(perceptSideGatewayCounts)),
  pwSnapshotPlayersClassification: 'PERCEPT-SIDE — `pwSnapshot = match.perceivedSnapshot(p, '
    + 'pwScope)` at src/ai/PlayerBrain.ts:1269, read at :1274 and :1275; already private, '
    + 'already aged, nothing to interpose. The token the frozen census missed is COUNTED '
    + 'and CLASSED, not silently dropped.',
  gatewayCountsUnderNaiveStrip: gatewayNaiveCounts,
  /* --- the frozen lexicons, republished for audit (byte-identical, gated) --- */
  frozenDefinitionBlocks: blockChecks,
  receiverLexicon: RECEIVER_LEXICON,
  fileGradeMap: FILE_GRADE,
  dirGradeMap: DIR_GRADE,
  /* --- corpus integrity --- */
  corpusIntegrity: {
    crossCheck: 'per-file needle counts, tokenizer pass vs naive (old buggy) pass',
    disagreements,
    disagreementFiles: disagreements.map((d) => d.file),
    truncatedFilesOfRecord: TRUNCATED_FILES_OF_RECORD,
    blankedFilesOfRecord: BLANKED_FILES_OF_RECORD,
    tailTruncatedFilesOfRecord: TAIL_TRUNCATED_FILES_OF_RECORD,
    verifierFigureOfRecord: '8 files / 1,194 code lines (#317 item 1); measured here as 7 '
      + 'blanking files / 1,190 fully-blanked lines + 2 tail-truncated files. A line-'
      + 'ACCOUNTING difference: both endpoints (frozen 1,336/215/157 under the naive pass, '
      + 'verifier 1,488/254/77 under the tokenizer) are reproduced EXACTLY.',
    codeLinesSwallowedByNaiveTotal: codeLinesSwallowedTotal,
    needleDeficitTotal: sum(disagreements.map((d) => d.deficit)),
    structuralOracle: 'stripped code must be ()/{}/[] balanced with no residual /* */ //',
    balanceFailuresTokenizer: balanceFailures,
    balanceFailuresNaive: naiveBalanceFailures,
    naiveTotals: {
      occurrences: NAIVE.sites.length,
      interposeSites: NAIVE.sites.filter((s) => s.role === 'other'
        && (s.grade === 'chooser' || s.grade === 'executor')).length,
      gatewayTokens: sum(Object.values(gatewayNaiveCounts)),
      unknownReceiverKinds: NAIVE.unknownReceivers.size,
    },
    mutationReceiptHowTo: 'set the PRODUCTION ALIAS `const strip = stripTokens` to '
      + '`stripComments` and re-run: gCorpusCrossCheckNonVacuous and '
      + 'gStrippedCorpusStructurallySound both go RED (receipt quoted in IN-C0 §R-FIX)',
  },
  crossChecks: {
    verifierExpected: VERIFIER_EXPECTED,
    measured,
    reconciledToVerifierMethod: reconciled,
    reconciliationNote: 'this probe keeps `${...}` interpolation code; the verifier stripped '
      + 'whole template literals. The entire difference is enumerated below.',
    interpolationBorneSites: interpolationBorneSites
      .map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}:${s.role}:${s.grade}`),
    interpolationBorneInterposeSites: interpolationBorneInterpose
      .map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}:${s.grade}`),
    voidedPublished: VOID_PUBLISHED,
    delta: {
      occurrences: measured.occurrences - VOID_PUBLISHED.occurrences,
      interposeSites: measured.interposeSites - VOID_PUBLISHED.interposeSites,
      truthBearingGateways: measured.truthBearingGateways
        - VOID_PUBLISHED.truthBearingGateways,
      gatewaySiteCount: measured.gatewaySiteCount - VOID_PUBLISHED.gatewaySiteCount,
    },
  },
  unknownReceivers: Object.fromEntries(FIX.unknownReceivers),
  uncapturedReceiverReads: FIX.uncaptured,
  uncapturedSites: FIX.uncapturedSites,
  unmappedFiles: FIX.unmappedFiles,
  gates,
  allGreen: ALL_GREEN,
};
mkdirSync('docs/world-model/data', { recursive: true });
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

banner('');
banner('=== IN-C0-FIX — THE PERCEPTION-SURFACE RESCAN (static half) ===');
banner(`artifact → ${OUT_PATH}`);
banner(`corpus: ${SRC_FILES.length} .ts files under src/, `
  + `${Object.keys(FIX.perFileNeedles).length} graded, ${artifact.corpus.rawBytes} bytes`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
banner('--- THE NUMBERS OF RECORD (republished) ---');
banner(`  needles: ${NEEDLES.map((n) => `${n}=${needleCounts[n]}`).join(' · ')} `
  + `→ occurrencesEnumerated = ${sites.length} (was ${VOID_PUBLISHED.occurrences}, VOID)`);
banner(`  ⭐ INTERPOSE SITES = ${interposeSites.length} across ${interposeFiles.length} files `
  + `(chooser ${interposeChooser.length} · executor ${interposeExecutor.length}) `
  + `(was ${VOID_PUBLISHED.interposeSites}, VOID)`);
banner(`  physics other-body sites (STAY TRUTH by M-IN.1) = ${physicsOtherSites.length}`);
banner(`  gatewayDistinctTokens = ${Object.keys(gatewayCounts).length} `
  + `(was ${VOID_PUBLISHED.gatewayDistinctTokens}) over ${gatewaySites.length} sites `
  + `(was ${VOID_PUBLISHED.gatewaySiteCount}, VOID)`);
banner(`  ⭐ TRUTH-BEARING gateway sites = ${measured.truthBearingGateways} `
  + `(was ${VOID_PUBLISHED.truthBearingGateways}, VOID) `
  + `${JSON.stringify(truthBearingGatewayCounts)}`);
banner(`  percept-side gateway sites = ${sum(Object.values(perceptSideGatewayCounts))} `
  + `${JSON.stringify(perceptSideGatewayCounts)} `
  + `— pwSnapshot.players = ${gatewayCounts['pwSnapshot.players'] ?? 0} (PERCEPT-SIDE)`);
banner(`  verifier cross-check: reconciled ${reconciled.occurrences}/`
  + `${reconciled.interposeSites}/${teamOppGateways} vs expected `
  + `${VERIFIER_EXPECTED.occurrences}/${VERIFIER_EXPECTED.interposeSites}/`
  + `${VERIFIER_EXPECTED.truthBearingGateways} `
  + `(+${interpolationBorneSites.length} interpolation-borne here: `
  + `${interpolationBorneSites.map((s) => `${s.file}:${s.line}:${s.receiver}.${s.needle}`).join(', ')})`);
banner('--- CORPUS INTEGRITY ---');
banner(`  naive pass totals: occurrences=${artifact.corpusIntegrity.naiveTotals.occurrences} `
  + `interpose=${artifact.corpusIntegrity.naiveTotals.interposeSites} `
  + `gatewayTokenSites=${artifact.corpusIntegrity.naiveTotals.gatewayTokens}`);
banner(`  disagreeing files = ${disagreements.length} `
  + `(code lines swallowed by the naive strip = ${codeLinesSwallowedTotal}, `
  + `needle deficit = ${sum(disagreements.map((d) => d.deficit))})`);
for (const d of disagreements) {
  banner(`    ${d.file}: tokenizer ${d.tokenizer} vs naive ${d.naive} `
    + `(deficit ${d.deficit}, ${d.codeLinesSwallowedByNaive} code lines swallowed, `
    + `${d.partialLinesTruncatedByNaive} line tails cut)`);
}
banner(`  structural oracle: tokenizer failures ${balanceFailures.length} / `
  + `naive failures ${naiveBalanceFailures.length} (the oracle discriminates)`);
banner('--- THE THREE WORLD-OWNED REFEREE/SETUP READS ---');
for (const r of REFEREE_READS) banner(`  · ${r.anchor}`);
banner('');
banner(ALL_GREEN ? 'ALL GATES GREEN' : '**GATES RED — the census is NOT of record**');
if (!ALL_GREEN) process.exit(1);
