// B1/B2 ANATOMY — how much VISIBLE divergence does the perception overlay have to show?
// Diagnostic census (not a frozen experiment): at each awareness level, how far do
// believed facts actually sit from truth, how often is anything missing or stale?
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  perceiveSnapshot,
  type PerceptionMemory,
} from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const SEEDS = [95_000, 95_001, 95_002, 95_003];
const AWARENESS_LEVELS = [0.2, 0.5, 0.8];
const MATCH_DURATION = 240;
const NEAR_RADIUS = 12; // "a body the player should care about"

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

interface Acc {
  ticks: number;
  ghostCount: number;
  errSum: number;
  errOver05: number;
  errOver10: number;
  ageSum: number;
  ageOver15: number;
  absentTotal: number;
  absentNear: number;
  ballMissing: number;
  ballAgeSum: number;
  ballTicks: number;
}

const emptyAcc = (): Acc => ({
  ticks: 0, ghostCount: 0, errSum: 0, errOver05: 0, errOver10: 0,
  ageSum: 0, ageOver15: 0, absentTotal: 0, absentNear: 0,
  ballMissing: 0, ballAgeSum: 0, ballTicks: 0,
});

const accs = new Map<number, Acc>(AWARENESS_LEVELS.map((a) => [a, emptyAcc()]));

for (const seed of SEEDS) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  // one fixed non-GK observer per side, memories per awareness level
  const observers = [match.teams[0].players[3], match.teams[1].players[3]];
  const memories = new Map<string, PerceptionMemory>();
  for (const a of AWARENESS_LEVELS) {
    for (const o of observers) memories.set(`${a}:${o.gid}`, createPerceptionMemory());
  }
  while (!match.finished) {
    match.step(DT);
    if (match.simTime < 10 || match.phase !== 'playing') continue;
    const truth = capturePerceptionTruth(match);
    for (const a of AWARENESS_LEVELS) {
      const acc = accs.get(a)!;
      for (const o of observers) {
        if (o.sentOff) continue;
        const snap = perceiveSnapshot(truth, o.gid, a, seed, memories.get(`${a}:${o.gid}`)!);
        acc.ticks++;
        const seen = new Set<number>();
        for (const g of snap.players) {
          if (g.gid === o.gid) continue;
          seen.add(g.gid);
          const t = truth.players.find((p) => p.gid === g.gid)!;
          const err = Math.hypot(g.pos.x - t.pos.x, g.pos.y - t.pos.y);
          acc.ghostCount++;
          acc.errSum += err;
          if (err > 0.5) acc.errOver05++;
          if (err > 1.0) acc.errOver10++;
          acc.ageSum += g.ageTicks;
          if (g.ageTicks > 15) acc.ageOver15++;
        }
        for (const t of truth.players) {
          if (t.gid === o.gid || t.sentOff || seen.has(t.gid)) continue;
          acc.absentTotal++;
          const d = Math.hypot(t.pos.x - o.pos.x, t.pos.y - o.pos.y);
          if (d <= NEAR_RADIUS) acc.absentNear++;
        }
        if (snap.ball) {
          acc.ballTicks++;
          acc.ballAgeSum += snap.ball.ageTicks;
        } else {
          acc.ballMissing++;
        }
      }
    }
  }
}

console.log('awareness | ghosts/tick | meanErr(m) | err>0.5m | err>1m | meanAge(tk) | age>15tk | absent/tick | absentNear/tick | ballMissing% | ballAge(tk)');
for (const a of AWARENESS_LEVELS) {
  const c = accs.get(a)!;
  const gpt = c.ghostCount / c.ticks;
  console.log([
    a.toFixed(1).padStart(9),
    gpt.toFixed(2).padStart(11),
    (c.errSum / c.ghostCount).toFixed(3).padStart(10),
    ((c.errOver05 / c.ghostCount) * 100).toFixed(1).padStart(7) + '%',
    ((c.errOver10 / c.ghostCount) * 100).toFixed(1).padStart(5) + '%',
    (c.ageSum / c.ghostCount).toFixed(1).padStart(11),
    ((c.ageOver15 / c.ghostCount) * 100).toFixed(1).padStart(7) + '%',
    (c.absentTotal / c.ticks).toFixed(2).padStart(11),
    (c.absentNear / c.ticks).toFixed(3).padStart(15),
    ((c.ballMissing / c.ticks) * 100).toFixed(1).padStart(11) + '%',
    (c.ballAgeSum / Math.max(1, c.ballTicks)).toFixed(1).padStart(10),
  ].join(' |'));
}
