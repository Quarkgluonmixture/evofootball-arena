/**
 * ⭐ L3 ENTRY RUNG — THE RECEIPTS RUN (#282.3(3) = #282.4;
 * docs/world-model/L3-ENTRY-RUNG.md).
 *
 * Like the CB frontend rung this is an ENTRY, not a gate battery: it adds no mechanism and draws
 * no inferential statistic, so it deliberately does NOT dress three assertions up as a gate list
 * (#268.3(a) governs gate batteries; inflating this would be exactly the dishonesty that canon
 * exists to catch). It runs two things and prints them:
 *
 *   A. THE IDENTITY WALK — the shipped world on this rung's own seeds, to the last tick: each
 *      seed's signature reproduces, the defence seat is `null`, the CB ledgers are all-zero.
 *      The structural argument (no file under `src/sim` / `src/ai` / `src/evolution` moved) is
 *      asserted here from `git diff --name-only` against the freeze commit.
 *
 *   B. THE ARMED SMOKE, THROUGH THE ENTRY'S OWN CODE PATH — `a4MatchFlags(7)` at construction
 *      and `armA4World(match, null, 7, dose)` after it, with the dose obtained from the entry's
 *      OWN `loadL3Dose()` (the same async chunk the browser fetches). No flag, no door and no
 *      cell is typed here, so the probe and the app cannot drift into two worlds. Three arms:
 *      the instrumented BASELINE (learn-only — proven byte-identical to the entry's own world 6
 *      here, on every smoke seed), world 7 EMPTY (`?l3dose=0`) and world 7 DOSED (the default).
 *      Every number is a REPORTED count read off the seam's own meters.
 */
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { League } from '../../src/sim/League';
import type { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, loadL3Dose, type L3DoseCell,
} from '../../src/game/a4World';
import { L3_GROUP_CONTROLLED, L3_GROUP_RECKLESS } from '../../src/ai/defenceBook';

/** ⭐ SEED SUB-BANDS, booked = walked (band 12,485,000–999 per #282.4). */
const IDENT_SEEDS = [12485000, 12485001, 12485002, 12485003, 12485004, 12485005];
const SMOKE_SEEDS = [12485100, 12485101, 12485102, 12485103, 12485104, 12485105, 12485106, 12485107];
/** ⭐ THE ENGINE DEFAULT CLOCK — the league's own, never overridden (#272.3(ii) clock honesty). */

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

/**
 * The three armed arms.
 *
 * ⭐ WHY THE BASELINE IS `baseline` AND NOT PLAIN WORLD 6 (T2's own §FORM reasoning, inherited):
 * the lunge counters this smoke lives on are the SEAM'S OWN (`fired[g]`), and the seam only
 * exists when `l3DefenceLearn` is on — a plain world-6 match reports zeros because it has no
 * meter, not because it throws no lunges. So the baseline is world 7 with the VETO switched off
 * (T2's arm A: learn ON, veto OFF), which is the entry's own world-6 football with a meter
 * attached — and this run PROVES that byte-identity on every smoke seed rather than citing it.
 */
type Arm = 'baseline' | 'v7empty' | 'v7dosed';

/** ⭐ THE ENTRY'S OWN TWO CALLS, and nothing else (the baseline unsets ONE door on top). */
const matchOf = (seed: number, arm: Arm | 'v6' | null, dose: readonly L3DoseCell[] | null): Match => {
  const league = new League({ seed });
  const version = arm === null ? 0 : arm === 'v6' ? 6 : 7;
  if (version !== 0) {
    league.matchFlags = a4MatchFlags(version); // the app's construction call
    if (arm === 'baseline') league.matchFlags = { ...league.matchFlags, l3DefenceVeto: false };
  }
  const match = league.createMatch(league.nextFixture()!);
  if (version !== 0) {
    armA4World(match, null, version, arm === 'v7dosed' ? dose : null); // the app's arming call
  }
  return match;
};

/* ============================== A. IDENTITY ============================== */

function identity(): void {
  console.log('\n=== A. IDENTITY — the shipped world, untouched ===');
  const files = execSync('git diff --name-only 2aac493 -- src scripts | cat', { encoding: 'utf8' })
    .split('\n').filter((f) => f.length > 0);
  const engine = files.filter((f) => /^src\/(sim|ai|evolution)\//.test(f));
  console.log(`  src/scripts files touched by this rung: ${files.length}`);
  for (const f of files) console.log(`    · ${f}`);
  console.log(`  ⭐ engine files (src/sim, src/ai, src/evolution) touched: ${engine.length}`
    + `${engine.length === 0 ? '  ⇒ the OFF world CANNOT have moved' : `  ⚠ ${engine.join(', ')}`}`);

  let allSame = true;
  let allDormant = true;
  for (const seed of IDENT_SEEDS) {
    const a = matchOf(seed, null, null);
    const b = matchOf(seed, null, null);
    while (!a.finished) a.step(DT);
    while (!b.finished) b.step(DT);
    const sa = signature(a);
    const same = sa === signature(b);
    const dormant = a.l3Defence === null && !a.l3DefenceLearn && !a.l3DefenceVeto
      && Object.values(a.cbLedger).every((v) => v === 0)
      && a4ArmedVersion(a) === 0;
    allSame &&= same;
    allDormant &&= dormant;
    console.log(`  seed ${seed}  sig ${sa.slice(0, 12)}…  reproduces ${same}  dormant ${dormant}`);
  }
  console.log(`  ⇒ identity: reproduces ${allSame}, dormant ${allDormant}`);
}

/* ============================ B. THE ARMED SMOKE ========================= */

interface Row {
  seed: number;
  arm: Arm;
  /** the seam's own fired meter, per group — BOTH teams, so per team is half of it. */
  reckless: number;
  controlled: number;
  /** `LungeLabelLedger.vetoes` — refusals SERVED (⚠ not lunges removed, #282's §DEV 6). */
  vetoes: number;
  labels: number;
  /** the book cells at full time, home side (the state the eye's world was played from). */
  bookHome: string;
  armedVersion: number;
  goals: number;
}

function smoke(dose: readonly L3DoseCell[]): Row[] {
  console.log('\n=== B. THE ARMED SMOKE — through the entry\'s own arming ===');
  console.log(`  the dose, from the entry's own loadL3Dose(): `
    + `controlled ${dose[L3_GROUP_CONTROLLED].punished}/${dose[L3_GROUP_CONTROLLED].lunges}`
    + `  reckless ${dose[L3_GROUP_RECKLESS].punished}/${dose[L3_GROUP_RECKLESS].lunges}`);
  // ⭐ THE BASELINE IS THE ENTRY'S OWN WORLD 6, PROVEN: learn-only ≡ world 6, byte for byte.
  let identical = 0;
  for (const seed of SMOKE_SEEDS) {
    const a = matchOf(seed, 'baseline', null);
    const b = matchOf(seed, 'v6', null);
    while (!a.finished) a.step(DT);
    while (!b.finished) b.step(DT);
    if (signature(a) === signature(b)) identical++;
  }
  console.log(`  ⭐ the learn-only baseline IS the entry's world 6: `
    + `${identical}/${SMOKE_SEEDS.length} seeds byte-identical`);
  const rows: Row[] = [];
  for (const arm of ['baseline', 'v7empty', 'v7dosed'] as const) {
    for (const seed of SMOKE_SEEDS) {
      const m = matchOf(seed, arm, dose);
      while (!m.finished) m.step(DT);
      const led = m.l3Defence;
      const book = led?.books[0];
      rows.push({
        seed,
        arm,
        reckless: led?.fired[L3_GROUP_RECKLESS] ?? 0,
        controlled: led?.fired[L3_GROUP_CONTROLLED] ?? 0,
        vetoes: led?.vetoes ?? 0,
        labels: led?.closedLabels ?? 0,
        bookHome: book === undefined ? '—'
          : `[${book.punished[0]}/${book.lunges[0]}, ${book.punished[1]}/${book.lunges[1]}]`,
        armedVersion: a4ArmedVersion(m),
        goals: m.score[0] + m.score[1],
      });
    }
  }
  return rows;
}

const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;

function report(rows: Row[]): void {
  console.log('\n  seed        arm       reckless  controlled   vetoes   labels  world  goals  book(home)');
  for (const r of rows) {
    console.log(`  ${r.seed}  ${r.arm.padEnd(8)}  ${String(r.reckless).padStart(8)}`
      + `  ${String(r.controlled).padStart(10)}  ${String(r.vetoes).padStart(7)}`
      + `  ${String(r.labels).padStart(7)}  ${String(r.armedVersion).padStart(5)}`
      + `  ${String(r.goals).padStart(5)}  ${r.bookHome}`);
  }
  console.log('\n  ARM MEANS (per team per match — the seam\'s fired meter ÷ 2):');
  for (const arm of ['baseline', 'v7empty', 'v7dosed'] as const) {
    const rs = rows.filter((r) => r.arm === arm);
    const rec = mean(rs.map((r) => r.reckless)) / 2;
    const con = mean(rs.map((r) => r.controlled)) / 2;
    const base = rows.filter((r) => r.arm === 'baseline');
    const bRec = mean(base.map((r) => r.reckless)) / 2;
    const bCon = mean(base.map((r) => r.controlled)) / 2;
    console.log(`    ${arm.padEnd(8)}  reckless ${rec.toFixed(4)}`
      + `${arm === 'baseline' ? '' : ` (${(100 * (rec - bRec) / bRec).toFixed(1)} %)`}`
      + `   controlled ${con.toFixed(4)}`
      + `${arm === 'baseline' ? '' : ` (${(100 * (con - bCon) / bCon).toFixed(1)} %)`}`
      + `   every ${(rec + con).toFixed(4)}`
      + `   vetoes/match ${mean(rs.map((r) => r.vetoes)).toFixed(1)}`
      + `   goals ${mean(rs.map((r) => r.goals)).toFixed(2)}`);
  }
}

async function main(): Promise<void> {
  identity();
  const dose = await loadL3Dose(); // ⭐ the entry's OWN loader, the same async chunk the app uses
  report(smoke(dose));
  console.log('\n  ⚠ counts and means only — no interval, no test, no gate (§STATS: 0 drawn).');
}

void main();
