/**
 * Probe: AERIAL ANATOMY (Phase 63, the route-one/target-man channel).
 *
 * The Everton question: real football's cheap counter-tactic — a tall
 * target man bombarded with crosses — beats HIGH-PRESSING teams (their box
 * is empty when the ball arrives) and dies against a LOW BLOCK (four
 * goal-side bodies). Phase-60's cross-anatomy showed our cross channel
 * loses to EVERYTHING. Before any lever, decompose the pipeline per link
 * and per profile:
 *
 *   crosses → keeper claim / attacker header / defender header / no aerial
 *           → headed shots → goals → match share
 *
 * with the key A/B: does a STRENGTH-loaded target man (budget-neutral:
 * +0.45 strength funded from dribbling/passing) change ANY link? The
 * current duel formula is aerialSense = role + defending·0.3 +
 * strength·0.1 — the target-man gradient is suspiciously flat (+0.45
 * strength buys +0.045 duel score vs a 0-0.45 random roll).
 *
 *   npx tsx scripts/probes/aerial-anatomy.ts
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
const flatSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
/** Budget-neutral target man at the ST slot: +0.45 strength, paid for with
 * dribbling −0.25 and passing −0.20 (the classic big-man trade). */
const targetManSquad = (): PlayerAttributes[] => {
  const s = flatSquad();
  s[5] = { ...s[5], strength: 0.95, dribbling: 0.25, passing: 0.3 };
  return s;
};
const team = (
  name: string, genome: TacticalGenome, style: TeamStyle,
  squad: PlayerAttributes[], policy?: Partial<PolicyParams>,
): TeamInfo => ({
  id: name, name, short: name.toUpperCase().slice(0, 3),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome, squad, style, policy,
});

const wideStyle: TeamStyle = { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' };
const crossPolicy = { crossBase: DEFAULT_POLICY.crossBase * 2.2 };
const crossGenes = (): TacticalGenome => {
  const g = neutral();
  g.attackingWidth = 0.85;
  return g;
};

interface Atk { tag: string; genome: TacticalGenome; squad: PlayerAttributes[]; policy?: Partial<PolicyParams> }
const attackers: Atk[] = [
  { tag: 'TM-CROSS ', genome: crossGenes(), squad: targetManSquad(), policy: crossPolicy },
  { tag: 'GEN-CROSS', genome: crossGenes(), squad: flatSquad(), policy: crossPolicy },
  { tag: 'BAL      ', genome: crossGenes(), squad: flatSquad() },
];

interface Shell { tag: string; genome: TacticalGenome; style: TeamStyle }
const shells: Shell[] = [
  (() => {
    const g = neutral();
    g.pressIntensity = 0.9;
    g.defensiveCompactness = 0.35;
    g.formationDepth = 0.8;
    return { tag: 'PRESS  ', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } as TeamStyle };
  })(),
  (() => {
    const g = neutral();
    g.defensiveCompactness = 0.9;
    g.formationDepth = 0.15;
    g.pressIntensity = 0.15;
    return { tag: 'BUS    ', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: 'man' } as TeamStyle };
  })(),
  { tag: 'NEUTRAL', genome: neutral(), style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } },
];

const MATCHES = 250;
const WINDOW = 4;

for (const atk of attackers) {
  for (const shell of shells) {
    const acc = {
      pts: 0, goals: 0, oppGoals: 0, crosses: 0,
      gkClaim: 0, atkHeader: 0, defHeader: 0,
      groundAtk: 0, groundDef: 0, dead: 0,
      shots: 0, shotGoals: 0,
    };
    const bandDists: number[] = []; // target distance when the ball drops into the header band
    for (let k = 0; k < MATCHES; k++) {
      const m = new Match({
        seed: 636000 + k,
        teamA: team('ATK', atk.genome, wideStyle, atk.squad, atk.policy),
        teamB: team(shell.tag.trim(), shell.genome, shell.style, flatSquad()),
      });
      let open: {
        t: number; ah0: number; dh0: number; claims0: number;
        targetGid: number | null; bandLogged: boolean; touch0: number;
      } | null = null;
      const claimsOf = (): number =>
        m.events.filter((e) => e.type === 'save' && e.text.includes('claims the high ball')).length;
      const closeWindow = (): void => {
        if (!open) return;
        const ah = m.teams[0].stats.headersWon - open.ah0;
        const dh = m.teams[1].stats.headersWon - open.dh0;
        const cl = claimsOf() - open.claims0;
        if (cl > 0) acc.gkClaim++;
        else if (ah > 0) acc.atkHeader++;
        else if (dh > 0) acc.defHeader++;
        else if (m.ball.lastTouch && m.ball.lastTouch.gid !== open.touch0) {
          // No aerial contest — who met it on the GROUND?
          if (m.ball.lastTouch.side === 0) acc.groundAtk++;
          else acc.groundDef++;
        } else acc.dead++;
        const s = m.shotLog.find((e) => e.side === 0 && e.t >= open!.t && e.t <= open!.t + WINDOW && e.outcome !== 'pending');
        if (s) {
          acc.shots++;
          if (s.outcome === 'goal') acc.shotGoals++;
        }
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
            claims0: claimsOf(),
            targetGid: m.pendingPass?.targetGid ?? null,
            bandLogged: false,
            touch0: m.ball.lastTouch?.gid ?? -1,
          };
          crosses0 = c;
          acc.crosses++;
        }
        // The overshoot check: when the delivery DROPS into the header band,
        // how far is the intended target from the ball? > HEADER_RADIUS
        // (1.35m) means contact was geometrically impossible right then.
        if (open && !open.bandLogged && open.targetGid !== null && m.ball.vz < 0 && m.ball.z <= 2.5 && m.ball.z > 1.3) {
          const tp = m.allPlayers[open.targetGid];
          bandDists.push(Math.hypot(tp.pos.x - m.ball.pos.x, tp.pos.y - m.ball.pos.y));
          open.bandLogged = true;
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
    bandDists.sort((a, b) => a - b);
    const q = (f: number): string =>
      bandDists.length ? bandDists[Math.floor(bandDists.length * f)].toFixed(1) : '—';
    console.log(
      `${atk.tag} vs ${shell.tag} (${MATCHES}m): share ${(acc.pts / MATCHES).toFixed(2)}  ` +
      `goals ${(acc.goals / MATCHES).toFixed(2)}-${(acc.oppGoals / MATCHES).toFixed(2)}  ` +
      `crosses ${(acc.crosses / MATCHES).toFixed(2)}/m\n` +
      `    air: gk ${pc(acc.gkClaim, acc.crosses)} atk ${pc(acc.atkHeader, acc.crosses)} def ${pc(acc.defHeader, acc.crosses)}` +
      `  ground: atk ${pc(acc.groundAtk, acc.crosses)} def ${pc(acc.groundDef, acc.crosses)}  dead ${pc(acc.dead, acc.crosses)}` +
      `  shot ${pc(acc.shots, acc.crosses)} goal ${pc(acc.shotGoals, acc.crosses)}` +
      `  target-dist@band q25/50/75: ${q(0.25)}/${q(0.5)}/${q(0.75)}m`,
    );
  }
  console.log('');
}
