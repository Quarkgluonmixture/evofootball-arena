/**
 * Probe (119l, 2026-07-19): the run-repertoire BASELINE + headroom. The user
 * reframe: off-ball runs are a VARIED repertoire (fish-hook / half-space /
 * pull-wide / overlap) that should EMERGE — 119k's single hand-coded "run to
 * the gap" was refuted. Before building the first evolvable primitive, measure
 * what the CURRENT runs do at gen 21:
 *   - runs/match (MakeRun frames → distinct run episodes per player)
 *   - MARKED share: is a defender assigned to the runner (marks map)? — how
 *     much room a marker-DRAG primitive (the fish-hook) has to work
 *   - separation the run achieves from its nearest opponent
 *   - FOUND: a pass/through-ball played to the runner during the run
 *   - CHANCE: a shot by the running side within 3s of being found
 * Establishes the headroom (runs rarely found/converted?) and whether runners
 * are tightly marked (a drag would pull the marker) — informing the primitive.
 *
 *   npx tsx scripts/probes/run-repertoire.ts [gens]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { League } from '../../src/sim/League';
import { DT } from '../../src/sim/constants';
import { dist } from '../../src/utils/vec';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';

const GENS = Number(process.argv[2] ?? 21);
const TAG = process.env.SNAP_TAG ? `-${process.env.SNAP_TAG}` : '';

function loadWorld(seed: number): League {
  const path = `/tmp/evo-snap${TAG}-${seed}-g${GENS}.json`;
  if (existsSync(path)) return League.fromJSON(JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>);
  const league = new League({ seed });
  for (let g = 0; g < GENS; g++) {
    while (!league.seasonDone) {
      const fx = league.nextFixture()!;
      league.applyResult(fx, league.createMatch(fx).runToCompletion());
    }
    league.finishSeason();
  }
  writeFileSync(path, JSON.stringify(league.toJSON()));
  return league;
}

function nearestOppDist(p: Player, m: Match): number {
  let best = Infinity;
  for (const o of m.teams[1 - p.side].players) {
    if (o.sentOff || o.role === 'GK') continue;
    const d = dist(o.pos, p.pos);
    if (d < best) best = d;
  }
  return best;
}

for (const seed of [991, 424242]) {
  const league = loadWorld(seed);
  let matches = 0;
  let runs = 0;
  let markedRuns = 0;
  let foundRuns = 0;
  let chanceRuns = 0;
  let sepSum = 0;

  while (!league.seasonDone) {
    const fx = league.nextFixture()!;
    const m: Match = league.createMatch(fx);
    matches++;
    // one run episode per player: active while MakeRun, closed on stop
    const active = new Map<number, { marked: boolean; peakSep: number; found: boolean; foundT: number; charged: boolean }>();
    let prevShots = 0;

    while (!m.finished) {
      m.step(DT);
      const shots = m.teams[0].stats.shots + m.teams[1].stats.shots;
      for (const team of m.teams) {
        for (const p of team.players) {
          const running = p.action.type === 'MakeRun' && p.role !== 'GK';
          if (running && !active.has(p.gid)) {
            // a defender assigned to him?
            const opp = m.teams[1 - p.side];
            const marked = [...opp.marks.values()].includes(p.index);
            active.set(p.gid, { marked, peakSep: 0, found: false, foundT: -1, charged: false });
            runs++;
            if (marked) markedRuns++;
          }
          const rec = active.get(p.gid);
          if (rec && running) {
            const sep = nearestOppDist(p, m);
            if (sep > rec.peakSep) rec.peakSep = sep;
            // found: a pass in flight aimed at him
            if (!rec.found && m.pendingPass && m.pendingPass.targetGid === p.gid && m.pendingPass.side === p.side) {
              rec.found = true;
              rec.foundT = m.simTime;
              foundRuns++;
            }
            // chance: a shot by his side within 3s of being found
            if (rec.found && !rec.charged && shots > prevShots && m.simTime - rec.foundT < 3) {
              rec.charged = true;
              chanceRuns++;
            }
          }
          if (rec && !running) {
            sepSum += rec.peakSep;
            active.delete(p.gid);
          }
        }
      }
      prevShots = shots;
    }
    league.applyResult(fx, m.getResult());
  }
  league.finishSeason();

  const pct = (n: number): string => `${((n / Math.max(runs, 1)) * 100).toFixed(0)}%`;
  console.log(`\nworld ${seed} (gen ${GENS}, ${matches} matches):`);
  console.log(`  runs ${(runs / matches).toFixed(1)}/match · MARKED ${pct(markedRuns)} · peak separation x̄ ${(sepSum / Math.max(runs, 1)).toFixed(1)}m`);
  console.log(`  FOUND (a pass aimed at the runner) ${pct(foundRuns)} · led to a CHANCE <3s ${pct(chanceRuns)}`);
}
