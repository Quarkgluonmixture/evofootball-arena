/**
 * Probe (2026-07-19, the user's challenge): if "clump everyone centrally" were
 * truly optimal, real 6v6 champions would do it — they DON'T (a clump is
 * punished by width / combination / going around it). So WHY does clumping win
 * in OUR sim? Test it head-to-head: a CLUMP team (narrow + compact + central
 * dribble) vs a WIDE team (wide + passing + flanks). Real football says WIDE
 * should beat a central CLUMP. If CLUMP wins here, the substrate has a defect
 * — width can't punish the clump — and the goal-channel mix says why.
 *
 *   npx tsx scripts/probes/clump-vs-wide.ts [matchesPerPairing]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { GOAL_CHANNELS, TEAM_SIZE, type TeamInfo } from '../../src/sim/types';

const K = Number(process.argv[2] ?? 40);

const genome = (over: Partial<Record<string, number>>): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) (g as unknown as Record<string, number>)[k] = 0.5;
  for (const [k, v] of Object.entries(over)) (g as unknown as Record<string, number>)[k] = v!;
  return g;
};
const squad = (): PlayerAttributes[] => {
  const a = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) a[k] = 0.5;
  return Array.from({ length: TEAM_SIZE }, () => ({ ...a }));
};

// CLUMP: narrow (width<0.5 → narrow-122), compact, central dribble, low width.
const CLUMP = genome({ attackingWidth: 0.12, defensiveCompactness: 0.9, dribbleBias: 0.85, passBias: 0.3, riskTolerance: 0.6 });
// WIDE: wide (→ wide-212), stretch, pass + flanks, low dribble, high overlap appetite.
const WIDE = genome({ attackingWidth: 0.95, defensiveCompactness: 0.3, dribbleBias: 0.3, passBias: 0.85, tempo: 0.7 });

const info = (name: string, g: TacticalGenome): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: g, squad: squad(),
});

const tally: Record<string, { gf: number; ga: number; sf: number; ch: Record<string, number>; matches: number }> = {
  CLUMP: { gf: 0, ga: 0, sf: 0, ch: {}, matches: 0 },
  WIDE: { gf: 0, ga: 0, sf: 0, ch: {}, matches: 0 },
};
for (const c of GOAL_CHANNELS) { tally.CLUMP.ch[c] = 0; tally.WIDE.ch[c] = 0; }

let seed = 1;
for (let k = 0; k < K; k++) {
  // alternate home/away so kickoff/side bias cancels
  const clumpHome = k % 2 === 0;
  const m = new Match({
    seed: seed++,
    teamA: clumpHome ? info('CLUMP', CLUMP) : info('WIDE', WIDE),
    teamB: clumpHome ? info('WIDE', WIDE) : info('CLUMP', CLUMP),
    duration: 300,
  });
  while (!m.finished) m.step(DT);
  const r = m.getResult();
  const ci = clumpHome ? 0 : 1;
  const wi = 1 - ci;
  tally.CLUMP.gf += r.score[ci]; tally.CLUMP.ga += r.score[wi]; tally.CLUMP.sf += r.stats[ci].shots; tally.CLUMP.matches++;
  tally.WIDE.gf += r.score[wi]; tally.WIDE.ga += r.score[ci]; tally.WIDE.sf += r.stats[wi].shots; tally.WIDE.matches++;
  for (const c of GOAL_CHANNELS) { tally.CLUMP.ch[c] += r.stats[ci].goalChannels[c]; tally.WIDE.ch[c] += r.stats[wi].goalChannels[c]; }
}

console.log(`CLUMP (narrow+compact+dribble) vs WIDE (wide+pass+flanks) — ${K} matches, all attrs 0.5:`);
for (const t of ['CLUMP', 'WIDE'] as const) {
  const a = tally[t];
  const n = Math.max(a.matches, 1);
  const chan = GOAL_CHANNELS.map((c) => `${c} ${a.ch[c]}`).filter((s) => !s.endsWith(' 0')).join(' · ') || '(none)';
  console.log(`  ${t.padEnd(6)}: GF/m ${(a.gf / n).toFixed(2)}  GA/m ${(a.ga / n).toFixed(2)}  shots/m ${(a.sf / n).toFixed(1)}`);
  console.log(`          goals by channel: ${chan}`);
}
console.log(`\n⭐ real 6v6: WIDE should beat CLUMP. If CLUMP wins here, the channel mix shows why width can't punish it.`);
