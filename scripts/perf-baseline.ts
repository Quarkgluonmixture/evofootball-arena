/**
 * Perf baseline — the Match.step phase-profiler read-out + throughput/memory.
 * The regression gate (docs/PROBE-CONTRACTS.md §3 hard gate, §5.5): capture on a
 * clean tag, then compare RELATIVE on the SAME machine after adding per-tick
 * compute (the substrate rebuild will grow `decide`). Absolute numbers are
 * machine-specific — compare deltas, not cross-machine absolutes.
 *
 *   npm run perf            # 1 season profiled + 10-season throughput
 *   npm run perf -- 2 777   # <seasons> <seed>
 */
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { League } from '../src/sim/League';
import { PROFILER } from '../src/sim/profiler';

const SEASONS = Number(process.argv[2] ?? 1);
const SEED = Number(process.argv[3] ?? 20260702);

// 1) DETERMINISM GUARD — the profiler MUST be pure-observational: the same match
//    played with the profiler on vs off must produce an identical result.
function playFirst(seed: number, profile: boolean): [number, number] {
  const lg = new League({ seed });
  const f = lg.nextFixture()!;
  PROFILER.reset();
  PROFILER.enabled = profile;
  const r = lg.createMatch(f).runToCompletion();
  PROFILER.enabled = false;
  return [r.score[0], r.score[1]];
}
const off = playFirst(SEED, false);
const on = playFirst(SEED, true);
const detOk = off[0] === on[0] && off[1] === on[1];

// 2) PHASE BREAKDOWN + matches/s (profiler ON, sampling for step percentiles).
PROFILER.reset({ sample: true });
PROFILER.enabled = true;
const league = new League({ seed: SEED });
let matches = 0;
const t0 = performance.now();
for (let s = 0; s < SEASONS; s++) {
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    const r = league.createMatch(f).runToCompletion();
    league.applyResult(f, r);
    matches++;
  }
  league.finishSeason();
}
const profWall = (performance.now() - t0) / 1000;
PROFILER.enabled = false;
const rep = PROFILER.report();

// 3) THROUGHPUT + MEMORY over 10 seasons (profiler OFF = realistic runtime).
const heap0 = process.memoryUsage().heapUsed;
const lg10 = new League({ seed: SEED });
let m10 = 0;
const t10 = performance.now();
for (let s = 0; s < 10; s++) {
  while (!lg10.seasonDone) {
    const f = lg10.nextFixture()!;
    const r = lg10.createMatch(f).runToCompletion();
    lg10.applyResult(f, r);
    m10++;
  }
  lg10.finishSeason();
}
const wall10 = (performance.now() - t10) / 1000;
const heapMb = (process.memoryUsage().heapUsed - heap0) / 1e6;

let head = 'unknown';
try { head = execSync('git rev-parse --short HEAD').toString().trim(); } catch { /* not a repo */ }

const usStepOf = (totalMs: number): number => (rep.steps > 0 ? (totalMs / rep.steps) * 1000 : 0);

console.log(`\nPERF BASELINE @ ${head}  (seed ${SEED})`);
console.log(`determinism (profiler on == off): ${detOk ? 'OK ✅' : `FAIL ❌ ${JSON.stringify({ off, on })}`}`);
console.log(`\nprofiled: ${matches} matches (${SEASONS} season) in ${profWall.toFixed(1)}s`);
console.log(`  timed playing-steps: ${rep.steps}   µs/step: ${rep.usPerStep.toFixed(1)}`);
console.log(`  step µs p50/p95/p99: ${rep.stepP50Us.toFixed(1)} / ${rep.stepP95Us.toFixed(1)} / ${rep.stepP99Us.toFixed(1)}`);
console.log(`  phase breakdown (µs/step · % of tick):`);
for (const p of rep.phases) {
  console.log(`    ${p.phase.padEnd(10)} ${usStepOf(p.totalMs).toFixed(2).padStart(8)} µs  ${p.pctOfTick.toFixed(1).padStart(5)}%`);
}
console.log(`\nthroughput (profiler OFF):`);
console.log(`  10-season runtime: ${wall10.toFixed(1)}s   matches/s: ${(m10 / wall10).toFixed(1)}   (${m10} matches)`);
console.log(`  heap growth over 10 seasons (no forced GC, indicative): ${heapMb.toFixed(1)} MB`);

const baseline = {
  head,
  seed: SEED,
  seasons: SEASONS,
  determinismOk: detOk,
  usPerStep: Number(rep.usPerStep.toFixed(2)),
  stepP50Us: Number(rep.stepP50Us.toFixed(1)),
  stepP95Us: Number(rep.stepP95Us.toFixed(1)),
  stepP99Us: Number(rep.stepP99Us.toFixed(1)),
  phases: rep.phases.map((p) => ({
    phase: p.phase,
    usPerStep: Number(usStepOf(p.totalMs).toFixed(2)),
    pct: Number(p.pctOfTick.toFixed(1)),
  })),
  tenSeasonSec: Number(wall10.toFixed(1)),
  matchesPerSec: Number((m10 / wall10).toFixed(1)),
  heapGrowthMb: Number(heapMb.toFixed(1)),
};
mkdirSync('docs/perf', { recursive: true });
writeFileSync('docs/perf/baseline.json', `${JSON.stringify(baseline, null, 2)}\n`);
console.log(`\nwrote docs/perf/baseline.json`);
if (!detOk) process.exit(1);
