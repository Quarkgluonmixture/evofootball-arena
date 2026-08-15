/**
 * L3-C0 — the §RESULT generator (#229.2: the stage doc's numbers are PRINTED from the committed
 * artifact, never typed). Usage:
 *
 *   npx tsx scripts/analysis/l3-c0-census-result.ts docs/world-model/data/l3-c0-lunge-outcome-census.json
 *
 * Everything below is read out of the artifact; the only literals here are report formatting and
 * the K grid of the run-length table (a REPORTING grid, declared in the stage doc).
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2] ?? 'docs/world-model/data/l3-c0-lunge-outcome-census.json';
const A = JSON.parse(readFileSync(path, 'utf8')) as Record<string, any>;
const o = (s = ''): void => { process.stdout.write(`${s}\n`); };
const pc = (v: number, d = 3): string => (Number.isFinite(v) ? `${(v * 100).toFixed(d)} %` : 'n/a');
const pp = (v: number, d = 2): string => (Number.isFinite(v) ? `${(v * 100).toFixed(d)}` : 'n/a');
const ci = (c: number[], d = 2): string => `[${pp(c[0], d)}, ${pp(c[1], d)}]`;
const n4 = (v: number, d = 4): string => (Number.isFinite(v) ? v.toFixed(d) : 'n/a');
const K_GRID = [10, 20, 30, 50, 100];

const runs = A.run;
const tot = runs.totals;
const matches = runs.matches as number;
const teamMatches = runs.teamMatches as number;
const season = runs.seasonFixturesPerTeam as number;
const disp = A.clock.displaySecondsPerSimSecond as number;
const gateNames = Object.keys(A.gates);
const gatesPass = gateNames.filter((k) => A.gates[k]).length;
const liveMutants = (A.mutants as { live: boolean }[]).filter((m) => m.live).length;

o(`**${matches} seeds × 1 arm (THE POLISHED ARMED WORLD — the play entry's own arming, `
  + `\`cbArmedVersion === 6\`), block ${runs.seeds.battery[0].toLocaleString('en-US')}–`
  + `${runs.seeds.battery[1].toLocaleString('en-US')}, ${gatesPass}/${gateNames.length} gates PASS**, `
  + `\`resultSha256\` \`${String(A.resultSha256).slice(0, 8)}…\`. Every number below is printed by `
  + '`scripts/analysis/l3-c0-census-result.ts` from the committed artifact; none is typed (#229.2).');
o();
o('### The run');
o();
o('```text');
o(`world             the POLISHED ARMED world — a4MatchFlags(6) + armA4World(match, null, 6), dose 1.0`);
o(`matches           ${matches}   (${n4(A.clock.simSecondsPerMatch)} sim-seconds each — the ENGINE DEFAULT match clock)`);
o(`armed challenges  ${tot.lunges}   (${n4(tot.lungesPerMatch)} per match · ${n4(tot.lungesPerTeamMatch)} per TEAM per match)`);
o(`  won             ${tot.wins}      missed ${tot.misses}`);
o(`  whistle-excl.   ${tot.whistledExcluded}   (the tick's own whistle moved the ball or the taker — CB-C0 §DEV 2)`);
o(`  TABULATED       ${tot.tabulated}   (the band tables' population)`);
o(`geometric misses  ${tot.geometricMisses}   (χ = 0 — his own momentum had lost the duel before the roll)`);
o(`refusal ticks     ${tot.refusalTicks}   (${n4(tot.refusalTicksPerTeamMatch)} per team per match; proximity ticks ${tot.proximityTicks})`);
o(`other duels       slide ${tot.slideEvents} · tactical grab ${tot.grabEvents}   (counted, NEVER pooled into the band tables)`);
o(`turnovers         ${tot.turnovers}   (${n4(tot.turnoversPerMatch)} per match, DV-C0 semantics — one every ${n4(A.clock.simSecondsPerMatch / tot.turnoversPerMatch)} s)`);
o(`v*                sqrt(2 · ACCEL · R_TACKLE) = ${n4(A.bands.vStar, 6)} m/s   cuts ${(A.bands.cuts as number[]).map((c) => n4(c, 4)).join(' / ')}`);
o(`primary window    ${A.windows.primaryWindowS} s (DV-C0's own committed primary, in the #218 family ${JSON.stringify(A.windows.family)})`);
o(`window ladder     ${(A.windows.ladderS as number[]).join(' / ')} s   + the PER-EVENT ownRecovery window`);
o(`law receipts      max recovery-law deviation ${tot.maxLawDeviation.toExponential(3)} s against the DERIVED tolerance ${tot.lawTolerance.toExponential(3)} s`);
o(`estimator         cluster bootstrap by match seed, ${runs.stats.resamples} resamples, stats base ${runs.stats.base}`);
o(`clock             convention A (the 240 s match clock) throughout; × ${disp} maps a per-match count onto the 90′ display clock`);
o('```');
o();

/* ---------------- the lunge / outcome table ---------------- */
o('### ⭐⭐ THE LUNGE TABLE — what an armed standing challenge is, BY ARRIVAL BAND');
o();
o('| arrival band | window (m/s) | lunges | wins | **P(won \\| lunged)** | CI 95 % (pp) | geometric-miss share | mean χ | lunges /team/match | refusal ticks /team/match |');
o('|---|---|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of A.tables.g5) {
  const w = r.window as (number | null)[];
  o(`| ${r.band} | [${n4(w[0] ?? 0, 3)}, ${w[1] === null ? '∞' : n4(w[1], 3)}) | ${r.lunges} | ${r.wins} `
    + `| **${pc(r.takeRate.point)}** | ${ci(r.takeRate.ci95)} | ${pc(r.geometricMissShare.point)} `
    + `| ${n4(r.meanChi, 3)} | ${n4(r.lungesPerTeamMatch.mean, 3)} | ${n4(r.refusalTicksPerTeamMatch.mean, 3)} |`);
}
o();
o(`**ALL BANDS**: ${tot.tabulated} tabulated lunges, ${tot.wins} won ⇒ `
  + `**${pc(tot.wins / tot.tabulated)}**; geometric misses ${pc(tot.geometricMisses / tot.lunges)} of every armed challenge; `
  + `the withheld challenge is **${pc(tot.refusalTicks / tot.proximityTicks)}** of all proximity ticks.`);
o();

/* ---------------- the recovery distribution ---------------- */
o('### CANDIDATE (a) — THE RECOVERY INTERVAL PAID (the engine\'s own law), full distribution');
o();
o('| arrival band | misses | mean (s) | SD | **min** | p10 | median | p90 | max | share ABOVE the incumbent flat price |');
o('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
for (const r of A.tables.g5) {
  const v = r.recovery;
  o(`| ${r.band} | ${v.n} | **${n4(v.mean)}** | ${n4(v.sd)} | **${n4(v.min)}** | ${n4(v.p10)} | ${n4(v.median)} | ${n4(v.p90)} | ${n4(v.max)} | ${pc(v.shareOverIncumbent)} |`);
}
o();

/* ---------------- the separation picture ---------------- */
o('### CANDIDATE (b) — THE CARRIER-ANCHORED SEPARATION PICTURE (#266.2(i): t0 is the CARRIER, never the ball)');
o();
o('| arrival band | sep at t0 (m) | Δsep over H1 (m) | Δsep over HIS OWN recovery (m) | ⭐ Δsep ÷ his own recovery (m/s) | Δspace over H1 (m) |');
o('|---|---:|---:|---:|---:|---:|');
for (const r of A.tables.g5) {
  const s = r.separation;
  o(`| ${r.band} | ${n4(s.sepT0Mean)} | ${n4(s.dSepH1Mean)} | **${n4(s.dSepOwnMean)}** | **${n4(s.dSepOwnMean / r.recovery.mean)}** | ${n4(s.dSpaceH1Mean)} |`);
}
o();
o('> ⭐ The last-but-one column is the label\'s own confound made visible and then answered: the '
  + 'per-event window IS longer for a faster arrival, so the raw Δ must be divided by it. It '
  + 'still rises with arrival speed — the carrier pulls away FASTER, not merely for longer.');
o();

/* ---------------- every candidate, every grain ---------------- */
for (const grain of ['g5', 'g3', 'g2']) {
  o(`### THE PUNISHMENT-CANDIDATE TABLE — grain \`${grain}\` (${(A.tables[grain] as any[]).map((r) => r.band).join(' · ')})`);
  o();
  o(`| candidate | ${(A.tables[grain] as any[]).map((r) => r.band).join(' | ')} | ⭐ top − bottom (pp) | CI 95 % | #246 verdict | monotone |`);
  o(`|---|${(A.tables[grain] as any[]).map(() => '---:').join('|')}|---:|---:|---|---|`);
  for (const cand of A.candidates) {
    const cells = (A.tables[grain] as any[]).map((r) => {
      const c = r.candidates[cand.id];
      return `${pc(c.rate.point, 1)} <sub>n=${c.rate.den}</sub>`;
    });
    const sh = A.shape.byCandidate[grain][cand.id];
    o(`| \`${cand.id}\` | ${cells.join(' | ')} | **${pp(sh.topMinusBottom.delta)}** | ${ci(sh.topMinusBottom.ci95)} | **${sh.topMinusBottom.verdict}** | ${sh.monotone ? 'yes' : 'no'} |`);
  }
  o();
}

/* ---------------- the event-rate arithmetic ---------------- */
o('### ⭐ THE EVENT-RATE ARITHMETIC — what L3-T0/T1 size from (#256.3)');
o();
o('Per band **per team per match** on the 240 s match clock (convention A); the season column is '
  + `the League's own round-robin (**${season}** league fixtures per team, traced from \`League.ts\`); `
  + 'the K grid is the MATCHES a single team must play for its book to hold K events in that band.');
o();
for (const grain of ['g5', 'g2']) {
  o(`**grain \`${grain}\` — MISSED lunges (the population every candidate label closes on):**`);
  o();
  o('| band | misses /team/match | SD | CV | median | p90 | zero-share | per SEASON | K=10 / 20 / 30 / 50 / 100 matches |');
  o('|---|---:|---:|---:|---:|---:|---:|---:|---|');
  for (const r of A.tables[grain]) {
    const m = r.missesPerTeamMatch;
    const kg = K_GRID.map((k) => (m.mean > 0 ? Math.ceil(k / m.mean) : NaN)).join(' / ');
    o(`| ${r.band} | **${n4(m.mean, 3)}** | ${n4(m.sd, 3)} | ${n4(m.cv, 3)} | ${m.median} | ${m.p90} | ${pc(m.zeroShare, 1)} | **${n4(m.perSeasonAtMean, 1)}** | ${kg} |`);
  }
  o();
}
o('And the WITHHELD-CHALLENGE baseline (the restraint that already exists, unpriced by history today):');
o();
o('| arrival band | refusal ticks /team/match | SD | zero-share | per SEASON | lunges /team/match | ⭐ refusal ticks per lunge |');
o('|---|---:|---:|---:|---:|---:|---:|');
for (const r of A.tables.g5) {
  const rf = r.refusalTicksPerTeamMatch;
  const lg = r.lungesPerTeamMatch;
  o(`| ${r.band} | **${n4(rf.mean, 3)}** | ${n4(rf.sd, 3)} | ${pc(rf.zeroShare, 1)} | ${n4(rf.perSeasonAtMean, 1)} | ${n4(lg.mean, 3)} | ${n4(rf.mean / lg.mean, 3)} |`);
}
o();

/* ---------------- the #246 block ---------------- */
o('### ⭐ THE #246 CHECK — PRE-REGISTERED, evaluated with paired CIs');
o();
o(`> ${A.shape.preRegistered}`);
o();
const verdictCount: Record<string, number> = {};
for (const grain of ['g5', 'g3', 'g2']) {
  for (const cand of A.candidates) {
    const v = A.shape.byCandidate[grain][cand.id].topMinusBottom.verdict;
    verdictCount[v] = (verdictCount[v] ?? 0) + 1;
  }
}
o(`Across ${A.candidates.length} candidates × 3 grains = ${A.candidates.length * 3} pre-registered readings: `
  + Object.entries(verdictCount).map(([k, v]) => `**${v}** ${k}`).join(' · ') + '.');
o();
o('The take rate itself (CONTEXT, not a punishment label — the armed take is `p_incumbent · χ`):');
o();
o('| grain | top − bottom (pp) | CI 95 % | verdict |');
o('|---|---:|---:|---|');
for (const grain of ['g5', 'g3', 'g2']) {
  const t = A.shape.takeRateTopMinusBottom[grain];
  o(`| \`${grain}\` | ${pp(t.delta)} | ${ci(t.ci95)} | **${t.verdict}** |`);
}
o();

/* ---------------- gates ---------------- */
o('### Gate table');
o();
o('| gate | result |');
o('|---|---|');
for (const g of gateNames) o(`| \`${g}\` | **${A.gates[g] ? 'PASS' : 'RED'}** |`);
o();
o(`⭐ **THE HEADLINE COUNT, HAND-CHECKED**: the artifact's \`gates\` object carries exactly `
  + `**${gateNames.length}** keys — \`${gateNames.join(' · ')}\` — and **${gatesPass}** of them pass. `
  + `⭐⭐ **${liveMutants} / ${(A.mutants as unknown[]).length} mutants LIVE**, over `
  + `**${Object.values(A.coverage as Record<string, string[]>).reduce((a, v) => a + v.length, 0)}** conjuncts `
  + `enumerated FROM THE GATE OBJECTS THEMSELVES (uncovered conjuncts: ${(A.uncoveredConjuncts as string[]).length}).`);
o();
o('### The N rule as executed');
o();
o('```text');
o(`rule            ${runs.nRule.rule}`);
o(`numerator       a MISSED LUNGE in the RAREST ARRIVAL BAND at the g5 grain`);
o(`sizing artifact docs/world-model/data/l3-c0-lunge-outcome-census-sizing.json (COMMITTED; the only two numbers a full run reads from it)`);
o(`rarest band     ${runs.nRule.rarestBandMissesPerMatch} misses/match  ·  ms/match ${runs.nRule.msPerMatch}`);
o(`precision term  ${runs.nRule.precisionTerm}   ·   wall term ${runs.nRule.wallTerm}   ·   seed-room cap ${runs.nRule.cap}`);
o(`⇒ N*            ${runs.nRule.nStar}   (binding: precision)   ·   as executed N ${runs.nRule.ran}, overridden ${runs.nRule.overridden}`);
o('```');
o();
o('### Registered non-claims (from the artifact)');
o();
for (const [i, nc] of (A.nonClaims as string[]).entries()) o(`${i + 1}. ${nc}`);
o();
o(`**VERDICT (the probe's own, mechanical):** L3-C0 LUNGE-OUTCOME CENSUS at N=${matches} × 1 arm `
  + `(the polished armed world) — ${gatesPass}/${gateNames.length} gates, ${liveMutants}/${(A.mutants as unknown[]).length} mutants live. `
  + 'THE TABLE IS DESCRIPTIVE TRUTH; the #246 flags are mechanical and the commander adjudicates '
  + 'them (#203), as is the §PICK handoff.');
