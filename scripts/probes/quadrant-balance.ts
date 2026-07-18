/**
 * Probe (119h, 2026-07-19): is FREEING the marking scheme SAFE? Today scheme
 * is derived from `markingAggression ≥ 0.3`, so two of the four defensive
 * quadrants are UNREACHABLE — you cannot be aggressive+zonal (the modern
 * zonal press) or passive+man. This probe FORCES all four by passing an
 * explicit `style.scheme` (Team uses info.style verbatim, bypassing
 * deriveTeamStyle) alongside an independent markingAggression, everything
 * else neutral (0.5 genes, 0.5 squad), and runs a round-robin so we can see
 * each quadrant's attack + defence balance.
 *
 * The decision it informs: if AGGRESSIVE-ZONAL dominates (concedes far less
 * while scoring the same), freeing → a monoculture collapse and we need the
 * attacking counter FIRST. If the four are roughly balanced, decoupling the
 * scheme into a free gene is safe and diversity can emerge.
 *
 *   npx tsx scripts/probes/quadrant-balance.ts [matchesPerPairing]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type TeamStyle } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 12); // matches per ordered pairing

const neutralGenome = (aggr: number): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
  g.markingAggression = aggr;
  return g;
};
const neutralSquad = (): PlayerAttributes[] => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
};
const STYLE = (scheme: 'man' | 'zonal'): TeamStyle => ({
  formationAtk: 'wide-212', formationDef: 'low-32', scheme,
});

interface Quad { key: string; scheme: 'man' | 'zonal'; aggr: number; }
const QUADS: Quad[] = [
  { key: 'man-aggr  ', scheme: 'man', aggr: 0.8 },
  { key: 'man-pass  ', scheme: 'man', aggr: 0.2 },
  { key: 'zonal-aggr', scheme: 'zonal', aggr: 0.8 }, // ← the UNREACHABLE quadrant
  { key: 'zonal-pass', scheme: 'zonal', aggr: 0.2 },
];

const info = (q: Quad, tag: string): TeamInfo => ({
  id: tag, name: tag, short: tag.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: neutralGenome(q.aggr),
  squad: neutralSquad(),
  style: STYLE(q.scheme),
});

const tally: Record<string, { gf: number; ga: number; sf: number; sa: number; matches: number }> = {};
for (const q of QUADS) tally[q.key] = { gf: 0, ga: 0, sf: 0, sa: 0, matches: 0 };

let seed = 1;
for (const a of QUADS) {
  for (const b of QUADS) {
    if (a === b) continue;
    for (let k = 0; k < K; k++) {
      const m = new Match({
        seed: seed++, teamA: info(a, a.key.trim()), teamB: info(b, b.key.trim()), duration: 300,
      });
      while (!m.finished) m.step(DT);
      const r = m.getResult();
      tally[a.key].gf += r.score[0]; tally[a.key].ga += r.score[1];
      tally[a.key].sf += r.stats[0].shots; tally[a.key].sa += r.stats[1].shots;
      tally[a.key].matches++;
      tally[b.key].gf += r.score[1]; tally[b.key].ga += r.score[0];
      tally[b.key].sf += r.stats[1].shots; tally[b.key].sa += r.stats[0].shots;
      tally[b.key].matches++;
    }
  }
}

console.log(`quadrant round-robin — ${K} matches/ordered-pairing, all genes+attrs 0.5 except scheme+markingAggression:`);
console.log(`  ${'quadrant'.padEnd(11)}  GF/m  GA/m   ShotsF ShotsA   (GA/m = defensive strength, lower=better)`);
for (const q of QUADS) {
  const t = tally[q.key];
  const n = Math.max(t.matches, 1);
  console.log(`  ${q.key}  ${(t.gf / n).toFixed(2)}  ${(t.ga / n).toFixed(2)}   ${(t.sf / n).toFixed(1)}    ${(t.sa / n).toFixed(1)}`);
}
