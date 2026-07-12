/**
 * Pass-outcome probe (Phase 30.5): where do the ~37 failed passes per match
 * actually die? Buckets every registered pass by delivery kind × distance ×
 * kick-time lane openness and prints completion rates, so selection levers
 * aim at the real failure mass instead of the imagined one.
 * Run with: npx tsx scripts/probe-pass.ts [matches] [seed]
 */
import { League } from '../src/sim/League';
import { DT } from '../src/sim/constants';
import { laneOpenness } from '../src/ai/perception';
import { dist } from '../src/utils/vec';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED = Number(process.argv[3] ?? 20260702);

const league = new League({ seed: SEED });

interface Bucket {
  n: number;
  ok: number;
  cut: number; // intercepted by an opponent
}
const buckets = new Map<string, Bucket>();
const bucket = (k: string): Bucket => {
  let b = buckets.get(k);
  if (!b) {
    b = { n: 0, ok: 0, cut: 0 };
    buckets.set(k, b);
  }
  return b;
};

const dBucket = (d: number): string => (d < 12 ? 'short' : d < 24 ? 'mid  ' : 'long ');
const laneBucket = (l: number): string => (l < 0.35 ? 'blocked' : l < 0.7 ? 'contest' : 'open   ');

let matches = 0;
let totalPasses = 0;
while (matches < MATCHES) {
  const f = league.nextFixture();
  if (!f) {
    league.finishSeason();
    continue;
  }
  const match = league.createMatch(f);
  let live: { key: string[]; ints: number } | null = null;
  let prevPass = match.pendingPass;
  const interceptions = (): number =>
    match.teams[0].stats.interceptions + match.teams[1].stats.interceptions;

  while (!match.finished) {
    match.step(DT);
    const pass = match.pendingPass;
    if (pass !== prevPass) {
      // The previous pass resolved some steps back — attribute its outcome.
      if (live && prevPass) {
        const lc = match.lastCompletedPass;
        const ok = lc !== null && lc.passerGid === prevPass.passerGid && lc.t >= prevPass.t;
        const cut = !ok && interceptions() > live.ints;
        for (const k of live.key) {
          const b = bucket(k);
          b.n++;
          if (ok) b.ok++;
          if (cut) b.cut++;
        }
        totalPasses++;
      }
      live = null;
      if (pass) {
        const passer = match.allPlayers[pass.passerGid];
        const target = match.allPlayers[pass.targetGid];
        const opp = match.teams[1 - pass.side].players;
        const kind = passer.action.type;
        const d = dist(passer.pos, target.pos);
        const lane = laneOpenness(passer.pos, target.pos, opp);
        live = {
          key: [
            `kind ${kind}`,
            `dist ${dBucket(d)}`,
            `lane ${laneBucket(lane)}`,
            `kind×lane ${kind}·${laneBucket(lane)}`,
          ],
          ints: interceptions(),
        };
      }
      prevPass = pass;
    }
  }
  matches++;
  league.applyResult(f, match.getResult());
}

console.log(`\n${matches} matches, ${totalPasses} tracked passes (${(totalPasses / matches).toFixed(1)}/match)\n`);
const rows = [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
for (const [k, b] of rows) {
  const fail = b.n - b.ok;
  console.log(
    `${k.padEnd(38)} n/match ${(b.n / matches).toFixed(1).padStart(5)}  comp ${((b.ok / b.n) * 100).toFixed(0).padStart(3)}%  fails/match ${(fail / matches).toFixed(1).padStart(5)}  (cut ${((b.cut / Math.max(fail, 1)) * 100).toFixed(0)}%)`,
  );
}
