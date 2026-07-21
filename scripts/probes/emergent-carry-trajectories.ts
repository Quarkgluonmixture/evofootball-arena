// E1 EMERGENT CARRY-TRAJECTORY CENSUS (telemetry only).
// Pattern labels are derived after ordinary Dribble episodes; they never feed live AI.
//   npx tsx scripts/probes/emergent-carry-trajectories.ts [matches] [seedOffset]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import type { Player } from '../../src/sim/Player';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 26000);

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

type EndReason = 'actionChanged' | 'lostControl' | 'deadBall' | 'matchEnd';
type TrajectoryClass = 'inwardOnly' | 'outwardOnly' | 'mixedArc' | 'straight';

interface CarryEpisode {
  readonly gid: number;
  readonly side: Side;
  readonly role: Role;
  readonly matchIndex: number;
  readonly startTime: number;
  readonly startX: number;
  readonly startY: number;
  lastX: number;
  lastY: number;
  ticks: number;
  pathLength: number;
  peakForwardGain: number;
  minAbsY: number;
  maxAbsY: number;
  enteredExplicitWideDriveZone: boolean;
}

interface CompletedEpisode extends CarryEpisode {
  readonly duration: number;
  readonly endReason: EndReason;
}

const explicitWideDriveZone = (player: Player, match: Match): boolean => {
  const localX = match.teams[player.side].localX(player.pos.x);
  return Math.abs(player.pos.y) > 13 && localX > 20 && localX < HALF_L - 7;
};

const startEpisode = (player: Player, match: Match, matchIndex: number): CarryEpisode => ({
  gid: player.gid,
  side: player.side,
  role: player.role,
  matchIndex,
  startTime: match.simTime,
  startX: player.pos.x,
  startY: player.pos.y,
  lastX: player.pos.x,
  lastY: player.pos.y,
  ticks: 1,
  pathLength: 0,
  peakForwardGain: 0,
  minAbsY: Math.abs(player.pos.y),
  maxAbsY: Math.abs(player.pos.y),
  enteredExplicitWideDriveZone: explicitWideDriveZone(player, match),
});

const updateEpisode = (episode: CarryEpisode, player: Player, match: Match): void => {
  episode.pathLength += Math.hypot(player.pos.x - episode.lastX, player.pos.y - episode.lastY);
  episode.lastX = player.pos.x;
  episode.lastY = player.pos.y;
  episode.ticks++;
  episode.peakForwardGain = Math.max(
    episode.peakForwardGain,
    match.teams[episode.side].localX(player.pos.x)
      - match.teams[episode.side].localX(episode.startX),
  );
  episode.minAbsY = Math.min(episode.minAbsY, Math.abs(player.pos.y));
  episode.maxAbsY = Math.max(episode.maxAbsY, Math.abs(player.pos.y));
  if (explicitWideDriveZone(player, match)) episode.enteredExplicitWideDriveZone = true;
};

const completed: CompletedEpisode[] = [];
const endReasons = new Map<EndReason, number>();
let nonFiniteFacts = 0;
let shortEpisodes = 0;
let orphanTouchTicks = 0;

const closeEpisode = (episode: CarryEpisode, match: Match, endReason: EndReason): void => {
  endReasons.set(endReason, (endReasons.get(endReason) ?? 0) + 1);
  if (episode.ticks < 2) {
    shortEpisodes++;
    return;
  }
  const values = [
    episode.startX, episode.startY, episode.lastX, episode.lastY, episode.pathLength,
    episode.peakForwardGain, episode.minAbsY, episode.maxAbsY,
  ];
  if (!values.every(Number.isFinite)) {
    nonFiniteFacts++;
    return;
  }
  completed.push({
    ...episode,
    duration: Math.max(0, match.simTime - episode.startTime),
    endReason,
  });
};

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = OFF + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
  });
  let active: CarryEpisode | null = null;

  while (!match.finished) {
    const stableDriver = match.phase === 'playing'
      && match.ball.owner?.role !== 'GK'
      && match.ball.owner?.action.type === 'Dribble'
      ? match.ball.owner
      : null;
    if (!active && stableDriver) active = startEpisode(stableDriver, match, matchIndex);

    match.step(DT);
    if (!active) {
      if (match.ball.owner === null && match.dribbleTouch !== null) orphanTouchTicks++;
      continue;
    }

    const player = match.allPlayers[active.gid];
    updateEpisode(active, player, match);
    const ownStableDribble = match.phase === 'playing'
      && match.ball.owner === player
      && player.action.type === 'Dribble';
    const ownTouch = match.phase === 'playing'
      && match.ball.owner === null
      && match.dribbleTouch?.gid === player.gid
      && match.simTime <= match.dribbleTouch.until;
    if (ownStableDribble || ownTouch) continue;

    const endReason: EndReason = match.finished
      ? 'matchEnd'
      : match.phase !== 'playing'
        ? 'deadBall'
        : match.ball.owner === player
          ? 'actionChanged'
          : 'lostControl';
    closeEpisode(active, match, endReason);
    active = null;
  }
  if (active) closeEpisode(active, match, 'matchEnd');
}

const WIDE_START = HALF_W * 0.5;
const MATERIAL_FORWARD = 3;
const MATERIAL_LATERAL = 3;
const qualifying = completed.filter((episode) =>
  Math.abs(episode.startY) >= WIDE_START && episode.peakForwardGain >= MATERIAL_FORWARD);

const classify = (episode: CompletedEpisode): TrajectoryClass => {
  const startAbsY = Math.abs(episode.startY);
  const inward = startAbsY - episode.minAbsY >= MATERIAL_LATERAL;
  const outward = episode.maxAbsY - startAbsY >= MATERIAL_LATERAL;
  if (inward && outward) return 'mixedArc';
  if (inward) return 'inwardOnly';
  if (outward) return 'outwardOnly';
  return 'straight';
};

const classes = new Map<TrajectoryClass, CompletedEpisode[]>([
  ['inwardOnly', []],
  ['outwardOnly', []],
  ['mixedArc', []],
  ['straight', []],
]);
for (const episode of qualifying) classes.get(classify(episode))!.push(episode);

const inward = [...classes.get('inwardOnly')!, ...classes.get('mixedArc')!];
const cleanInward = inward.filter((episode) => !episode.enteredExplicitWideDriveZone);
const roleCounts = new Map<Role, number>();
const sideCounts = new Map<Side, number>();
const qualifyingMatches = new Set<number>();
const inwardMatches = new Set<number>();
for (const episode of qualifying) {
  roleCounts.set(episode.role, (roleCounts.get(episode.role) ?? 0) + 1);
  sideCounts.set(episode.side, (sideCounts.get(episode.side) ?? 0) + 1);
  qualifyingMatches.add(episode.matchIndex);
}
for (const episode of inward) inwardMatches.add(episode.matchIndex);

const mean = (episodes: readonly CompletedEpisode[], value: (episode: CompletedEpisode) => number): number =>
  episodes.reduce((sum, episode) => sum + value(episode), 0) / Math.max(1, episodes.length);
const pct = (part: number, whole: number): string =>
  `${(part / Math.max(1, whole) * 100).toFixed(1)}%`;
const mapLine = <T extends string | number>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');

console.log(`E1 EMERGENT CARRY TRAJECTORIES · matches ${MATCHES} · seed start ${OFF}`);
console.log(
  `completed episodes ${completed.length} · short ${shortEpisodes}`
  + ` · orphan-touch ticks ${orphanTouchTicks} · non-finite ${nonFiniteFacts}`,
);
console.log(`end reasons ${mapLine(endReasons)}`);
console.log(
  `wide-progressive ${qualifying.length} (${qualifyingMatches.size}/${MATCHES} matches)`
  + ` · sides ${mapLine(sideCounts)} · roles ${mapLine(roleCounts)}`,
);
for (const kind of ['inwardOnly', 'outwardOnly', 'mixedArc', 'straight'] as const) {
  const episodes = classes.get(kind)!;
  console.log(
    `  ${kind.padEnd(11)} ${episodes.length} (${pct(episodes.length, qualifying.length)})`
    + ` · forward ${mean(episodes, (episode) => episode.peakForwardGain).toFixed(2)}m`
    + ` · inward ${mean(episodes, (episode) => Math.abs(episode.startY) - episode.minAbsY).toFixed(2)}m`
    + ` · outward ${mean(episodes, (episode) => episode.maxAbsY - Math.abs(episode.startY)).toFixed(2)}m`
    + ` · path ${mean(episodes, (episode) => episode.pathLength).toFixed(2)}m`
    + ` · duration ${mean(episodes, (episode) => episode.duration).toFixed(2)}s`,
  );
}
console.log(
  `inward-or-mixed ${inward.length} (${pct(inward.length, qualifying.length)})`
  + ` · no explicit-wideDrive-zone ${cleanInward.length} (${pct(cleanInward.length, inward.length)})`
  + ` · ${inwardMatches.size}/${MATCHES} matches`,
);

if (
  MATCHES !== 120 || qualifying.length < 100 || inward.length < 10 ||
  inward.length / Math.max(1, qualifying.length) < 0.05 || nonFiniteFacts > 0
) process.exitCode = 1;
