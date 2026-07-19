/**
 * Probe (2026-07-19, the user's reality anchor): "过一个还有另一个 vs 盯人 的
 * 权衡,应该参考现实." Real football's rock-paper-scissors:
 *   · DRIBBLE beats MAN-marking (beat your marker 1v1 → through; no cover
 *     because every other defender is glued to his own man)
 *   · DRIBBLE loses to ZONAL (beat one, the next zone's cover is there —
 *     过一个还有另一个)
 *   · WIDTH/COMBO beats ZONAL (stretch + overload + seams between zones)
 *   · WIDTH/COMBO is tracked by MAN (every runner picked up)
 *
 * Measures a DRIBBLE attack and a WIDTH attack, each vs a MAN-scheme and a
 * ZONAL-scheme defence (defender genome held fixed, ONLY style.scheme varies,
 * so we isolate the scheme mechanism). If the sim already shows the RPS we
 * SHARPEN it; if the carry beats BOTH schemes, zonal cover doesn't bite —
 * build it.
 *
 *   npx tsx scripts/probes/scheme-matchup.ts [matches]
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { GOAL_CHANNELS, TEAM_SIZE, type MarkScheme, type TeamInfo, type TeamStyle } from '../../src/sim/types';

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
const info = (name: string, g: TacticalGenome, style?: TeamStyle): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
  genome: g, squad: squad(), ...(style ? { style } : {}),
});

const DRIBBLE = genome({ attackingWidth: 0.15, dribbleBias: 0.85, passBias: 0.3, defensiveCompactness: 0.5 });
const WIDTH = genome({ attackingWidth: 0.9, dribbleBias: 0.3, passBias: 0.8, tempo: 0.6, overlapW: 1, defensiveCompactness: 0.4 });

// Defender: FIXED genome; only the scheme in `style` varies (isolate the mechanism).
const DEF = genome({ markingAggression: 0.5, defensiveCompactness: 0.6, pressIntensity: 0.4 });
const defStyle = (scheme: MarkScheme): TeamStyle => ({ formationAtk: 'wide-212', formationDef: 'low-32', scheme });

function run(atkName: string, atk: TacticalGenome, scheme: MarkScheme) {
  let gf = 0, ga = 0, sf = 0, matches = 0;
  const ch: Record<string, number> = {};
  for (const c of GOAL_CHANNELS) ch[c] = 0;
  let seed = 1;
  for (let k = 0; k < K; k++) {
    const atkHome = k % 2 === 0;
    const m = new Match({
      seed: seed++,
      teamA: atkHome ? info('ATK', atk) : info('DEF', DEF, defStyle(scheme)),
      teamB: atkHome ? info('DEF', DEF, defStyle(scheme)) : info('ATK', atk),
      duration: 300,
    });
    while (!m.finished) m.step(DT);
    const r = m.getResult();
    const ai = atkHome ? 0 : 1;
    gf += r.score[ai]; ga += r.score[1 - ai]; sf += r.stats[ai].shots; matches++;
    for (const c of GOAL_CHANNELS) ch[c] += r.stats[ai].goalChannels[c];
  }
  const n = Math.max(matches, 1);
  const chan = GOAL_CHANNELS.map((c) => `${c} ${ch[c]}`).filter((s) => !s.endsWith(' 0')).join(' · ');
  console.log(`  ${atkName} vs ${scheme.toUpperCase().padEnd(5)}:  GF/m ${(gf / n).toFixed(2)}  GA/m ${(ga / n).toFixed(2)}  shots ${(sf / n).toFixed(1)}   [${chan}]`);
}

console.log(`Scheme rock-paper-scissors — ${K} matches each, 0.5 squads, defender genome fixed (scheme isolated)\n`);
run('DRIBBLE', DRIBBLE, 'man');
run('DRIBBLE', DRIBBLE, 'zonal');
console.log('');
run('WIDTH  ', WIDTH, 'man');
run('WIDTH  ', WIDTH, 'zonal');
console.log(`\n⭐ reality: DRIBBLE beats MAN > ZONAL (cover stops the dribble); WIDTH beats ZONAL > MAN (man tracks runners).`);
console.log(`  If DRIBBLE's GF vs ZONAL ≈ vs MAN, zonal cover does NOT bite — build 过一个还有另一个.`);
