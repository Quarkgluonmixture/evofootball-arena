/**
 * Probe (119j, 2026-07-19): does the new POSITIONING attribute BITE? The
 * maxed-genome test (emergence memo): force three squads identical except
 * positioning (0.9 / 0.5 / 0.1, everything else 0.5) and round-robin them.
 * If positioning matters, the high-positioning side should SPILL far less
 * (miscontrols) and retain possession better under pressure — the first
 * wiring point (touchFailChance reception). Neutral 0.5 must reproduce the
 * pre-119j reception exactly (the density-preserving budget raise).
 *
 *   npx tsx scripts/probes/positioning-bite.ts [matchesPerPairing]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 16);

const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
  return g;
};
const squad = (positioning: number): PlayerAttributes[] => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  a.positioning = positioning;
  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
};

const LEVELS: Array<[string, number]> = [
  ['pos-0.9', 0.9],
  ['pos-0.5', 0.5],
  ['pos-0.1', 0.1],
];

const info = (label: string, positioning: number): TeamInfo => ({
  id: label, name: label, short: label.slice(0, 5).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: neutralGenome(),
  squad: squad(positioning),
});

const tally: Record<string, { spills: number; gf: number; ga: number; matches: number }> = {};
for (const [label] of LEVELS) tally[label] = { spills: 0, gf: 0, ga: 0, matches: 0 };

let seed = 1;
for (const [la, pa] of LEVELS) {
  for (const [lb, pb] of LEVELS) {
    if (la === lb) continue;
    for (let k = 0; k < K; k++) {
      const m = new Match({ seed: seed++, teamA: info(la, pa), teamB: info(lb, pb), duration: 300 });
      while (!m.finished) m.step(DT);
      const r = m.getResult();
      tally[la].spills += r.stats[0].miscontrols; tally[la].gf += r.score[0]; tally[la].ga += r.score[1]; tally[la].matches++;
      tally[lb].spills += r.stats[1].miscontrols; tally[lb].gf += r.score[1]; tally[lb].ga += r.score[0]; tally[lb].matches++;
    }
  }
}

console.log(`positioning maxed-genome test — ${K} matches/ordered-pairing (all attrs 0.5 except positioning):`);
console.log(`  ${'squad'.padEnd(8)}  spills/m  GF/m  GA/m`);
for (const [label] of LEVELS) {
  const t = tally[label];
  const n = Math.max(t.matches, 1);
  console.log(`  ${label.padEnd(8)}  ${(t.spills / n).toFixed(2)}      ${(t.gf / n).toFixed(2)}  ${(t.ga / n).toFixed(2)}`);
}
