// Probe: the tinker dial (Phase 66, N3 — the coach's adjustment personality).
//
// PART A (mechanism, paired): identical fixtures — same seeds, same squads,
// same opponents — except team A's tinkerBias is 0 (the stoic) in one block
// and 1 (the tinkerer) in the other. Both blocks share the 68' snapshot
// (mentality ramps open at 68'/72', so the variants are bit-identical until
// then); everything after is the dial's causal effect. The trade must show
// BOTH faces or the gene is a uniform virtue (failure mode 22): the
// tinkerer's chase should buy more late goals AND concede more counters;
// his early shut-down should trade initiative for safety.
//
// PART B (selection): two league worlds, 30 generations — does evolution
// keep tinkerBias ALIVE (spread, drift) or collapse it to a corner?
//   npx tsx scripts/probes/tinker-anatomy.ts [nMatches] [gens]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const N = Number(process.argv[2] ?? 400);
const GENS = Number(process.argv[3] ?? 30);

const team = (name: string, seed: number, tinker?: number): TeamInfo => {
  const rng = new Rng(seed);
  const genome = randomGenome(rng);
  if (tinker !== undefined) genome.tinkerBias = tinker;
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome, squad: randomSquad(rng),
  };
};

interface Block {
  label: string;
  trail68: number;
  comebackPts: number;   // points at FT from games trailing at 68'
  chaseScored: number;   // team-A goals after 68' while trailing at 68'
  chaseConceded: number; // goals conceded after 68' while trailing at 68'
  lead68: number;
  heldPts: number;       // points at FT from games leading at 68'
  surges: number;        // ⚡ lines
  shutdowns: number;     // 🧊 lines
}

function runBlock(tinker: number, label: string): Block {
  const b: Block = {
    label, trail68: 0, comebackPts: 0, chaseScored: 0, chaseConceded: 0,
    lead68: 0, heldPts: 0, surges: 0, shutdowns: 0,
  };
  for (let seed = 0; seed < N; seed++) {
    const m = new Match({
      seed,
      teamA: team('A', seed * 2 + 1, tinker),
      teamB: team('B', seed * 2 + 2),
      duration: 240,
    });
    let snap68: [number, number] | null = null;
    while (!m.finished) {
      m.step(DT);
      if (m.half === 2 && m.minute() >= 68 && snap68 === null) snap68 = [m.score[0], m.score[1]];
    }
    b.surges += m.events.filter((e) => e.side === 0 && e.text.startsWith('⚡')).length;
    b.shutdowns += m.events.filter((e) => e.side === 0 && e.text.startsWith('🧊')).length;
    if (!snap68 || snap68[0] === snap68[1]) continue;
    const pts = m.score[0] > m.score[1] ? 3 : m.score[0] === m.score[1] ? 1 : 0;
    if (snap68[0] < snap68[1]) {
      b.trail68++;
      b.comebackPts += pts;
      b.chaseScored += m.score[0] - snap68[0];
      b.chaseConceded += m.score[1] - snap68[1];
    } else {
      b.lead68++;
      b.heldPts += pts;
    }
  }
  return b;
}

const f2 = (v: number): string => v.toFixed(2);
const f3 = (v: number): string => v.toFixed(3);

console.log(`PART A — paired mechanism, n=${N} per block (identical until 68')`);
for (const b of [runBlock(0, 'STOIC  (0)'), runBlock(1, 'TINKER (1)')]) {
  console.log(
    `  ${b.label}: trailing@68 n=${b.trail68} → pts/game ${f2(b.comebackPts / Math.max(1, b.trail68))}, ` +
    `late GF ${f2(b.chaseScored / Math.max(1, b.trail68))} GA ${f2(b.chaseConceded / Math.max(1, b.trail68))} | ` +
    `leading@68 n=${b.lead68} → pts/game ${f2(b.heldPts / Math.max(1, b.lead68))} | ` +
    `⚡ ${b.surges} 🧊 ${b.shutdowns}`,
  );
}

console.log(`\nPART B — selection: tinkerBias across ${GENS} generations`);
for (const seed of [424242, 991]) {
  const league = new League({ seed });
  const stats = (): { mean: number; min: number; max: number } => {
    const vs = league.franchises.map((f) => f.coach.genome.tinkerBias ?? 0.5);
    return { mean: vs.reduce((a, v) => a + v, 0) / vs.length, min: Math.min(...vs), max: Math.max(...vs) };
  };
  const rows: string[] = [];
  for (let g = 0; g <= GENS; g++) {
    if (g % 5 === 0 || g === GENS) {
      const s = stats();
      rows.push(`gen ${String(g).padStart(2)}: mean ${f3(s.mean)}  spread [${f3(s.min)} … ${f3(s.max)}]`);
    }
    if (g < GENS) {
      while (!league.seasonDone) {
        const fx = league.nextFixture()!;
        league.applyResult(fx, league.createMatch(fx).runToCompletion());
      }
      league.finishSeason();
    }
  }
  console.log(`  world ${seed}:`);
  for (const r of rows) console.log(`    ${r}`);
}
