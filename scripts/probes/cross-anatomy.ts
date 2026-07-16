/**
 * Probe: CROSS ANATOMY (N1.5 lever-3 diagnostic, pre-lever).
 *
 * The phase-59 matrix's dominance anatomy named crossBase +0.87 — cross
 * bombardment is the new strong axis and the near-king (T08 .610). Before
 * any lever: is the cross MECHANICALLY over-strong (an unpunished lump into
 * the box), or was that a style-package accident? A/B a cross-heavy
 * attacker against a balanced one across three defensive shells and trace
 * every cross's 4s payoff window: who wins the header, does a shot come,
 * does the box crowd actually defend the air, where does the second ball
 * go. The counter-surface question: does a PACKED box (the bus) punish the
 * bombardment the way real football does?
 *
 *   npx tsx scripts/probes/cross-anatomy.ts
 */
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { DEFAULT_POLICY, TEAM_SIZE, type PolicyParams, type TeamInfo, type TeamStyle } from '../../src/sim/types';

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (
  name: string, genome: TacticalGenome, style: TeamStyle, policy?: Partial<PolicyParams>,
): TeamInfo => ({
  id: name, name, short: name.toUpperCase().slice(0, 3),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome, squad: squad(), style, policy,
});

const wideStyle: TeamStyle = { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' };

interface Atk { tag: string; genome: TacticalGenome; policy?: Partial<PolicyParams> }
const attackers: Atk[] = [
  (() => {
    const g = neutral();
    g.attackingWidth = 0.85;
    return { tag: 'CROSS', genome: g, policy: { crossBase: DEFAULT_POLICY.crossBase * 2.2 } };
  })(),
  (() => {
    const g = neutral();
    g.attackingWidth = 0.85;
    return { tag: 'BAL  ', genome: g };
  })(),
];

interface Shell { tag: string; genome: TacticalGenome; style: TeamStyle }
const shells: Shell[] = [
  { tag: 'NEUTRAL', genome: neutral(), style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } },
  (() => {
    const g = neutral();
    g.defensiveCompactness = 0.9;
    g.formationDepth = 0.15;
    g.pressIntensity = 0.15;
    return { tag: 'BUS    ', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: 'man' } as TeamStyle };
  })(),
  (() => {
    const g = neutral();
    g.pressIntensity = 0.9;
    g.defensiveCompactness = 0.35;
    g.formationDepth = 0.8;
    return { tag: 'PRESS  ', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } as TeamStyle };
  })(),
];

const MATCHES = 250;
const WINDOW = 4;

for (const atk of attackers) {
  for (const shell of shells) {
    const acc = {
      pts: 0, goals: 0, oppGoals: 0, crosses: 0,
      atkHeader: 0, defHeader: 0, noHeader: 0,
      shots: 0, shotGoals: 0, keptBall: 0,
    };
    for (let k = 0; k < MATCHES; k++) {
      const m = new Match({
        seed: 909000 + k,
        teamA: team('ATK', atk.genome, wideStyle, atk.policy),
        teamB: team(shell.tag.trim(), shell.genome, shell.style),
      });
      let open: { t: number; ah0: number; dh0: number; sh0: number } | null = null;
      const closeWindow = (): void => {
        if (!open) return;
        const ah = m.teams[0].stats.headersWon - open.ah0;
        const dh = m.teams[1].stats.headersWon - open.dh0;
        if (ah > 0) acc.atkHeader++;
        else if (dh > 0) acc.defHeader++;
        else acc.noHeader++;
        const s = m.shotLog.find((e) => e.side === 0 && e.t >= open!.t && e.t <= open!.t + WINDOW && e.outcome !== 'pending');
        if (s) {
          acc.shots++;
          if (s.outcome === 'goal') acc.shotGoals++;
        }
        if (m.possessionSide === 0) acc.keptBall++;
        open = null;
      };
      let crosses0 = 0;
      while (!m.finished) {
        m.step(DT);
        const c = m.teams[0].stats.crosses;
        if (c > crosses0) {
          if (open) closeWindow();
          open = {
            t: m.simTime,
            ah0: m.teams[0].stats.headersWon,
            dh0: m.teams[1].stats.headersWon,
            sh0: m.shotLog.length,
          };
          crosses0 = c;
          acc.crosses++;
        }
        if (open && m.simTime > open.t + WINDOW) closeWindow();
      }
      if (open) closeWindow();
      acc.goals += m.score[0];
      acc.oppGoals += m.score[1];
      const gd = m.score[0] - m.score[1];
      acc.pts += gd > 0 ? 1 : gd === 0 ? 0.5 : 0;
    }
    const pc = (n: number, d: number): string => (d ? ((n / d) * 100).toFixed(1) + '%' : '—');
    console.log(
      `${atk.tag} vs ${shell.tag} (${MATCHES}m): share ${(acc.pts / MATCHES).toFixed(2)}  ` +
      `goals ${(acc.goals / MATCHES).toFixed(2)}-${(acc.oppGoals / MATCHES).toFixed(2)}  ` +
      `crosses ${(acc.crosses / MATCHES).toFixed(2)}/m → atkHeader ${pc(acc.atkHeader, acc.crosses)}  ` +
      `defHeader ${pc(acc.defHeader, acc.crosses)}  noAerial ${pc(acc.noHeader, acc.crosses)}  ` +
      `shot ${pc(acc.shots, acc.crosses)} (goal ${pc(acc.shotGoals, acc.crosses)})  kept ${pc(acc.keptBall, acc.crosses)}`,
    );
  }
}
