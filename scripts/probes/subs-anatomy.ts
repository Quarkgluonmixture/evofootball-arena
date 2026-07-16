/**
 * SUBS ANATOMY (Phase 61, N2) — two questions, per the phase-58 lesson
 * (failure mode 25: probe the BINDING, not the wiring):
 *
 *   1. Does the trigger BIND? rotationBias swept 0 → 1 on a fixed pair:
 *      subs/team/match must rise monotonically, with the when-and-who
 *      shape printed (minute distribution, stamina at the swap).
 *   2. Is the surface ALIVE under selection? Two league worlds evolve
 *      ~14 generations: the rotationBias population trajectory, the
 *      bench-investment share of the roster budget, and league subs/match.
 *      ANY consistent movement (or maintained spread) is life; a gene
 *      pinned at its founding mean with zero phenotype is a dead wire.
 *
 * Run: npx tsx scripts/probes/subs-anatomy.ts
 */
import { createFranchise, type Franchise } from '../../src/evolution/franchise';
import { ATTR_KEYS } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const infoOf = (f: Franchise, rotationBias: number): TeamInfo => ({
  id: f.id, name: f.name, short: f.short, colors: f.colors,
  playerNames: f.playerNames, genome: { ...f.coach.genome, rotationBias },
  squad: f.squad, ages: f.ages, style: f.coach.style, policy: f.coach.policy,
});

/* ---------------- 1. the trigger-binding curve ---------------- */

console.log('== 1. trigger binding: rotationBias sweep (12 seeds × fixed pair) ==');
{
  const rng = new Rng(20260716);
  const taken = new Set<string>();
  const fa = createFranchise(0, rng, taken);
  const fb = createFranchise(1, rng, taken);
  for (const bias of [0, 0.25, 0.5, 0.75, 1]) {
    let subs = 0;
    let matches = 0;
    const minutes: number[] = [];
    let ftStamina = 0;
    let ftBodies = 0;
    for (let seed = 1; seed <= 12; seed++) {
      const m = new Match({ seed, teamA: infoOf(fa, bias), teamB: infoOf(fb, bias) });
      while (!m.finished) m.step(1 / 60);
      matches++;
      for (const e of m.events) {
        if (e.text.startsWith('🔄')) {
          subs++;
          minutes.push(e.minute);
        }
      }
      for (const t of m.teams) for (const p of t.players) {
        ftStamina += p.stamina;
        ftBodies++;
      }
    }
    const perTeam = subs / matches / 2;
    minutes.sort((a, b) => a - b);
    const med = minutes.length ? minutes[Math.floor(minutes.length / 2)] : NaN;
    const q1 = minutes.length ? minutes[Math.floor(minutes.length * 0.25)] : NaN;
    console.log(
      `  bias ${bias.toFixed(2)}  subs/team ${perTeam.toFixed(2)}  ` +
      `minute q1/med ${Number.isNaN(q1) ? '—' : `${q1}'/${med}'`}  ` +
      `FT stamina (on pitch) ${(ftStamina / ftBodies).toFixed(3)}`,
    );
  }
}

/* ---------------- 2. the surface under selection ---------------- */

console.log('\n== 2. selection: rotationBias + bench investment over ~14 generations ==');
const benchShare = (f: Franchise): number => {
  let starters = 0;
  let bench = 0;
  f.squad.forEach((p, i) => {
    for (const k of ATTR_KEYS) {
      if (i < TEAM_SIZE) starters += p[k];
      else bench += p[k];
    }
  });
  return bench / Math.max(starters + bench, 1e-9);
};

for (const seed of [424242, 991]) {
  console.log(`  -- world ${seed} --`);
  const league = new League({ seed });
  const report = (gen: number | string, subsPerMatch?: number): void => {
    const biases = league.franchises.map((f) => f.coach.genome.rotationBias ?? 0.5);
    const mean = biases.reduce((a, b) => a + b, 0) / biases.length;
    const min = Math.min(...biases);
    const max = Math.max(...biases);
    const shares = league.franchises.map(benchShare);
    const shareMean = shares.reduce((a, b) => a + b, 0) / shares.length;
    console.log(
      `  gen ${String(gen).padStart(2)}  rotationBias mean ${mean.toFixed(3)} [${min.toFixed(2)}–${max.toFixed(2)}]  ` +
      `bench share ${(shareMean * 100).toFixed(1)}%` +
      (subsPerMatch !== undefined ? `  league subs/team/match ${subsPerMatch.toFixed(2)}` : ''),
    );
  };
  report(1);
  for (let s = 0; s < 14; s++) {
    let subs = 0;
    let matches = 0;
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      const m = league.createMatch(f);
      const res = m.runToCompletion();
      subs += m.teams[0].subsUsed + m.teams[1].subsUsed;
      matches++;
      league.applyResult(f, res);
    }
    league.finishSeason();
    if (s % 4 === 3 || s === 13) report(league.generation, subs / matches / 2);
  }
}
console.log('\nverdict inputs — (1) monotone binding curve, (2) non-flat gene/bench trajectories');
