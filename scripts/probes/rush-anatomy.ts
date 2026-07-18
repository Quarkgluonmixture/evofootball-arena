// Probe (Phase 103, user design 门将出击): does the sweeper school WORK and
// what does it cost? Three keeper schools (timid 0.1 / neutral 0.5 /
// sweeper 0.9) defend against the SAME neutral attack over N matches:
//   · rush events + how far out (out-of-box share)
//   · the foot duel's ledger: pokes won / beaten (empty net) / fouls
//   · what the school concedes: goals against, xg/shot faced, chips faced
//   npx tsx scripts/probes/rush-anatomy.ts [matches]
import type { TacticalGenome } from '../../src/evolution/genome';
import { GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { dist } from '../../src/utils/vec';

const attrs = (over: Partial<PlayerAttributes> = {}): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  Object.assign(p, over);
  return p;
};
const genome = (over: Partial<Record<string, number>>): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  for (const [k, v] of Object.entries(over)) (g as unknown as Record<string, number>)[k] = v!;
  return g;
};
const team = (n: string, over: Partial<Record<string, number>> = {}, a: Partial<PlayerAttributes> = {}): TeamInfo => ({
  id: n, name: n, short: n.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: genome(over),
  squad: Array.from({ length: TEAM_SIZE }, () => attrs(a)),
});

const N = Number(process.argv[2] ?? 60);
// The dribble-meta attack = the LATE-GEN inflation regime the sweeper
// school exists for (evolved carriers, walk-in conversion 50-64%).
const ATTACKS: Array<[string, Partial<PlayerAttributes>]> = [
  ['vs neutral attack ', {}],
  ['vs dribble meta    ', { pace: 0.68, dribbling: 0.68, defending: 0.35 }],
];
for (const [aLabel, aAttrs] of ATTACKS)
for (const [label, aggr] of [['timid  0.1', 0.1], ['neutral 0.5', 0.5], ['sweeper 0.9', 0.9]] as Array<[string, number]>) {
  let rushFrames = 0;
  let outBoxRushFrames = 0;
  let pokes = 0;
  let beaten = 0;
  let ga = 0;
  let shotsFaced = 0;
  let xgFaced = 0;
  let chipsFaced = 0;
  for (let i = 0; i < N; i++) {
    // Team A defends with the school; team B is the same neutral attack.
    const m = new Match({ seed: 6000 + i, teamA: team('A', { keeperAggression: aggr }), teamB: team('B', {}, aAttrs), duration: 480 });
    const gk = m.teams[0].goalkeeper;
    let prevStun = 0;
    let prevTackles = 0;
    while (!m.finished) {
      m.step(DT);
      if (gk.action.type === 'GoalkeeperRush') {
        rushFrames++;
        if (!m.inPenaltyBox(gk.pos, 0)) outBoxRushFrames++;
      }
      const tk = m.teams[0].stats.tackles;
      if (tk > prevTackles && gk.kickCooldown > 0 && !m.inPenaltyBox(gk.pos, 0)) pokes++;
      prevTackles = tk;
      // A fresh 0.9 stun on the keeper = beaten outside the box.
      if (gk.stunTimer > 0.85 && prevStun <= 0.85 && !m.inPenaltyBox(gk.pos, 0)) beaten++;
      prevStun = gk.stunTimer;
    }
    ga += m.score[1];
    for (const s of m.shotLog) {
      if (s.side !== 1) continue;
      shotsFaced++;
      xgFaced += s.xg;
    }
    for (const e of m.events) {
      if (e.side === 1 && /chip|lob|吊/i.test(e.text)) chipsFaced++;
    }
  }
  console.log(
    `${aLabel}${label}: rush ${(rushFrames / N / 60).toFixed(2)}s/match (out-box ${((outBoxRushFrames / Math.max(rushFrames, 1)) * 100).toFixed(0)}%) | ` +
    `pokes won ${(pokes / N).toFixed(2)}/m · beaten out-box ${(beaten / N).toFixed(2)}/m | ` +
    `GA ${(ga / N).toFixed(2)} · xg/shot faced ${(xgFaced / Math.max(shotsFaced, 1)).toFixed(3)} · shots faced ${(shotsFaced / N).toFixed(1)}`,
  );
}
