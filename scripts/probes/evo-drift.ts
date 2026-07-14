// Diagnostic: does PLAYER evolution actually select skill? Runs 50 generations
// and tracks population-wide per-role attribute means + key gene means. The
// control is ST finishing: finishing PAYS (strikers score → win → selected),
// so it should drift UP. If WG pace/technique stay FLAT while ST finishing
// climbs, that proves the machinery works but there's no selection gradient on
// the skill dims that would make wingers emerge (they don't pay — see 1v1).
//   npx tsx scripts/probes/evo-drift.ts [gens] [seed]
import { League } from '../../src/sim/League';
import { SQUAD_ROLES } from '../../src/evolution/playerGenome';
import type { AttrKey } from '../../src/evolution/playerGenome';
import type { Role } from '../../src/sim/types';

const GENS = Number(process.argv[2] ?? 50);
const SEED = Number(process.argv[3] ?? 424242);
const league = new League({ seed: SEED });

const roleAttr = (role: Role, key: AttrKey): number => {
  let sum = 0, n = 0;
  for (const f of league.franchises) {
    for (let i = 0; i < f.squad.length; i++) {
      if (SQUAD_ROLES[i] === role) { sum += f.squad[i][key]; n++; }
    }
  }
  return sum / Math.max(n, 1);
};
const gene = (key: string): number => {
  let s = 0;
  for (const f of league.franchises) s += (f.genome as unknown as Record<string, number>)[key];
  return s / league.franchises.length;
};
const f2 = (v: number): string => v.toFixed(3);

console.log(`seed ${SEED}, ${GENS} generations`);
console.log('gen | WGpace WGdrb | STfin(ctrl) | DFdef | width dribble tempo press');
const row = (g: number): void => {
  console.log(
    `${String(g).padStart(3)} | ${f2(roleAttr('WG', 'pace'))} ${f2(roleAttr('WG', 'dribbling'))} | ` +
    `${f2(roleAttr('ST', 'finishing'))} | ${f2(roleAttr('DF', 'defending'))} | ` +
    `${f2(gene('attackingWidth'))} ${f2(gene('dribbleBias'))} ${f2(gene('tempo'))} ${f2(gene('pressIntensity'))}`,
  );
};

for (let g = 0; g <= GENS; g++) {
  if (g % 5 === 0 || g === GENS) row(g);
  if (g < GENS) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
}
