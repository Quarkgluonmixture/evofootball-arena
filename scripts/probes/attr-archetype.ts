// Do player ARCHETYPES emerge from the split attributes (Phase 47)? The old
// `technique` forced passer≡dribbler; with passing/dribbling separate genes,
// selection can specialise them by role and by club. Tracks per-role means of
// the SPLIT (passing − dribbling) plus strength/stamina drift, and the
// cross-club std of each role's split (clubs disagreeing about what their
// winger IS = emergent player identity).
//   npx tsx scripts/probes/attr-archetype.ts [gens] [seed]
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
/** Cross-club std of a role's (passing − dribbling) split. */
const splitStd = (role: Role): number => {
  const vals: number[] = [];
  for (const f of league.franchises) {
    let s = 0, n = 0;
    for (let i = 0; i < f.squad.length; i++) {
      if (SQUAD_ROLES[i] === role) { s += f.squad[i].passing - f.squad[i].dribbling; n++; }
    }
    if (n > 0) vals.push(s / n);
  }
  const m = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.sqrt(vals.reduce((a, b) => a + (b - m) ** 2, 0) / vals.length);
};
const f2 = (v: number): string => (v >= 0 ? '+' : '') + v.toFixed(2);

console.log(`seed ${SEED}, ${GENS} gens — role split = mean(passing−dribbling); clubStd = cross-club std of WG split`);
console.log('gen | WGsplit MFsplit | WGclubStd | STR STA (league) | WGdrb MFpas');
const row = (g: number): void => {
  console.log(
    `${String(g).padStart(3)} | ${f2(roleAttr('WG', 'passing') - roleAttr('WG', 'dribbling'))}   ${f2(roleAttr('MF', 'passing') - roleAttr('MF', 'dribbling'))}  |   ${splitStd('WG').toFixed(3)}   | ` +
    `${roleAttr('MF', 'strength').toFixed(2)} ${roleAttr('MF', 'stamina').toFixed(2)}       | ${roleAttr('WG', 'dribbling').toFixed(2)} ${roleAttr('MF', 'passing').toFixed(2)}`,
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
