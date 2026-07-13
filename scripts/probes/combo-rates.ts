// Probe: combination-pack completion rates by genome (Phase 34).
// Run: npx tsx scripts/probes/combo-rates.ts — the directional evidence
// behind combos.test.ts thresholds (one-twos/thirdMan/overlaps per match).
import { Match } from '../../src/sim/Match';
import { MATCH_DURATION } from '../../src/sim/constants';
import { GENE_KEYS, randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const flat = (v: number, over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = v;
  return { ...g, ...over };
};
const team = (name: string, seed: number, g?: TacticalGenome): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: g ?? randomGenome(rng),
    squad: randomSquad(rng),
  };
};

// A: high one-two genes vs neutral opposition; B: low. Side-balanced (each
// condition plays home AND away). N seeds each.
const N = 24;
const run = (g: TacticalGenome, tag: string) => {
  let oneTwos = 0, thirdMan = 0, overlaps = 0, goals = 0, oppGoals = 0, comp = 0, total = 0;
  for (let seed = 0; seed < N; seed++) {
    const home = seed % 2 === 0;
    const subject = team('S', 1000 + seed, g);
    const neutral = team('N', 2000 + seed, flat(0.5));
    const m = new Match({
      seed,
      teamA: home ? subject : neutral,
      teamB: home ? neutral : subject,
      duration: MATCH_DURATION,
    });
    const res = m.runToCompletion();
    const si = home ? 0 : 1;
    oneTwos += res.stats[si].oneTwos;
    thirdMan += res.stats[si].thirdMan;
    overlaps += res.stats[si].overlaps;
    goals += res.score[si];
    oppGoals += res.score[1 - si];
    comp += res.stats[si].passesCompleted;
    total += res.stats[si].passes;
  }
  console.log(
    `${tag}: oneTwos ${(oneTwos / N).toFixed(2)} · thirdMan ${(thirdMan / N).toFixed(2)} · overlaps ${(overlaps / N).toFixed(2)} · ` +
    `goals ${(goals / N).toFixed(2)}–${(oppGoals / N).toFixed(2)} · completion ${((comp / total) * 100).toFixed(1)}%`,
  );
};

run(flat(0.5, { tempo: 0.85, passBias: 0.85 }), 'HIGH tempo+passBias');
run(flat(0.5, { attackingWidth: 0.85 }), 'WIDE 0.85           ');
run(flat(0.5, { attackingWidth: 0.15 }), 'NARROW 0.15         ');
run(flat(0.5, { tempo: 0.15, passBias: 0.15 }), 'LOW  tempo+passBias');
run(flat(0.5), 'NEUTRAL             ');
