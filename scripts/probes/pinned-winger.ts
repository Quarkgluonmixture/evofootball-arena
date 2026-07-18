// Probe (Phase 99, user question ①): the PINNED WIDE CARRIER — pressed
// near the touchline in the final third. Does the situation occur, and is
// the ball in behind the presser (the fullback's shadow) ever played?
//   · occurrence: pinned-frames + distinct episodes per match
//   · the action mix while pinned (what does he actually choose?)
//   · geometric escape supply: how often a mate's run/position offers a
//     channel behind the nearest presser while pinned
//   npx tsx scripts/probes/pinned-winger.ts [matches]
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { dist } from '../../src/utils/vec';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const N = Number(process.argv[2] ?? 120);
let pinnedFrames = 0;
let episodes = 0;
let episodesWithChannel = 0;
let channelBallsPlayed = 0;
const actionMix: Record<string, number> = {};
let inEpisode = false;
let episodeHadChannel = false;
let episodeCarrier: { side: number; gid: number } | null = null;
const outcomes: Record<string, number> = {};

for (let i = 0; i < N; i++) {
  const m = new Match({ seed: 9000 + i, teamA: team('A', 30 + i), teamB: team('B', 700 + i), duration: 480 });
  const endEpisode = (): void => {
    if (!inEpisode) return;
    episodes++;
    if (episodeHadChannel) episodesWithChannel++;
    // How did it end? The carrier's own last action names the release.
    const c = episodeCarrier ? m.allPlayers[episodeCarrier.gid] : null;
    const owner = m.ball.owner;
    const key = owner && c && owner === c
      ? 'carried-out'
      : owner && episodeCarrier && owner.side !== episodeCarrier.side
        ? 'TURNOVER'
        : c
          ? `kick:${c.action.type}`
          : 'loose';
    outcomes[key] = (outcomes[key] ?? 0) + 1;
    inEpisode = false;
    episodeHadChannel = false;
    episodeCarrier = null;
  };
  while (!m.finished) {
    m.step(DT);
    const o = m.ball.owner;
    if (!o || o.role === 'GK' || m.phase !== 'playing') {
      endEpisode();
      continue;
    }
    const t = m.teams[o.side];
    const localX = t.localX(o.pos.x);
    const wide = Math.abs(o.pos.y) > 13;
    const advanced = localX > 32; // deep: the byline squeeze, not the whole final third
    // pinned = a presser within 2.2m goal-side-or-level, near the line
    let presser = null as typeof o | null;
    let pd = 2.2;
    for (const q of m.teams[1 - o.side].players) {
      if (q.sentOff) continue;
      const d = dist(q.pos, o.pos);
      if (d < pd) { pd = d; presser = q; }
    }
    const pinned = wide && advanced && presser !== null;
    if (!pinned) {
      endEpisode();
      continue;
    }
    pinnedFrames++;
    inEpisode = true;
    episodeCarrier = { side: o.side, gid: o.gid };
    actionMix[o.action.type] = (actionMix[o.action.type] ?? 0) + 1;
    // channel supply: a mate ahead-or-level, infield of the carrier, whose
    // position/run projects BEYOND the presser toward the byline/box
    for (const mate of t.players) {
      if (mate === o || mate.sentOff || mate.role === 'GK') continue;
      const mLocal = t.localX(mate.pos.x);
      if (mLocal > localX - 4 && Math.abs(mate.pos.y) < Math.abs(o.pos.y) - 2 &&
          mLocal < HALF_L - 2 && dist(mate.pos, o.pos) < 22) {
        episodeHadChannel = true;
        break;
      }
    }
    // was a through ball actually played from the pinned spot this frame?
    if (o.action.type === 'ThroughBall') channelBallsPlayed++;
  }
}
const total = Object.values(actionMix).reduce((a, b) => a + b, 0);
console.log(`pinned-wide: ${(pinnedFrames / N / 60).toFixed(2)}s/match, ${(episodes / N).toFixed(1)} episodes/match`);
console.log(`  channel available: ${((episodesWithChannel / Math.max(episodes, 1)) * 100).toFixed(0)}% of episodes`);
console.log(`  action mix while pinned: ${Object.entries(actionMix).sort((a, b) => b[1] - a[1]).slice(0, 7).map(([k, v]) => `${k} ${((v / total) * 100).toFixed(0)}%`).join(' · ')}`);
console.log(`  ThroughBall decisions (frames): ${channelBallsPlayed} across ${N} matches`);
const oTotal = Object.values(outcomes).reduce((a, b) => a + b, 0);
console.log(`  episode outcomes: ${Object.entries(outcomes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${((v / oTotal) * 100).toFixed(0)}%`).join(' · ')}`);
