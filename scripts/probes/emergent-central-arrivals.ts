// E4 EMERGENT CENTRAL-ARRIVAL CENSUS (telemetry only).
// Pattern labels are derived after real trajectories and never feed live AI.
//   npx tsx scripts/probes/emergent-central-arrivals.ts [matches] [seedOffset]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, HALF_L } from '../../src/sim/constants';
import type { Player } from '../../src/sim/Player';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 34000);
const WINDOW = 4;
const MIN_PATH = 3;
const ZONE_MIN_X = HALF_L - 20;
const ZONE_MAX_X = HALF_L - 10;
const ZONE_HALF_WIDTH = 7;

type EndReason = 'arrived' | 'opponentControl' | 'deadBall' | 'expired' | 'removed' | 'matchEnd';

interface ActiveEpisode {
  readonly identity: string;
  readonly matchIndex: number;
  readonly eventId: number;
  readonly side: Side;
  readonly carrierGid: number;
  readonly moverGid: number;
  readonly moverRole: Role;
  readonly startedAt: number;
  readonly startLocalX: number;
  readonly startY: number;
  lastX: number;
  lastY: number;
  pathLength: number;
  arriverExposed: boolean;
  assignmentExposed: boolean;
  actionExposed: boolean;
  wallRunExposed: boolean;
}

interface ClosedEpisode extends ActiveEpisode {
  readonly endedAt: number;
  readonly endReason: EndReason;
  readonly endLocalX: number;
  readonly endY: number;
}

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

const inArrivalZone = (player: Player, match: Match): boolean => {
  const localX = match.teams[player.side].localX(player.pos.x);
  return localX >= ZONE_MIN_X && localX <= ZONE_MAX_X && Math.abs(player.pos.y) <= ZONE_HALF_WIDTH;
};

const wideOwner = (match: Match): Player | null => {
  if (match.phase !== 'playing') return null;
  const owner = match.ball.owner;
  if (!owner || owner.role === 'GK' || owner.sentOff) return null;
  const side = match.teams[owner.side];
  return side.localX(match.ball.pos.x) > HALF_L - 21 && Math.abs(match.ball.pos.y) > 10
    ? owner
    : null;
};

const active = new Map<string, ActiveEpisode>();
const closed: ClosedEpisode[] = [];
const identities = new Set<string>();
const endReasons = new Map<EndReason, number>();
let wideEvents = 0;
let duplicateIdentities = 0;
let nonFiniteFacts = 0;
let unfinishedEpisodes = 0;

const expose = (episode: ActiveEpisode, match: Match): void => {
  const mover = match.allPlayers[episode.moverGid];
  const side = match.teams[episode.side];
  if (side.arriver === mover.index) episode.arriverExposed = true;
  if (side.runners.has(mover.index) || side.overlapper === mover.index) {
    episode.assignmentExposed = true;
  }
  if (mover.action.type === 'MakeRun' || mover.action.type === 'SupportBallCarrier') {
    episode.actionExposed = true;
  }
  if (
    mover.wallRun !== null
    && mover.wallRun.partnerGid === episode.carrierGid
    && match.simTime < mover.wallRun.until
  ) episode.wallRunExposed = true;
};

const update = (episode: ActiveEpisode, match: Match): void => {
  const mover = match.allPlayers[episode.moverGid];
  episode.pathLength += Math.hypot(mover.pos.x - episode.lastX, mover.pos.y - episode.lastY);
  episode.lastX = mover.pos.x;
  episode.lastY = mover.pos.y;
  expose(episode, match);
  if (![
    mover.pos.x, mover.pos.y, episode.pathLength,
  ].every(Number.isFinite)) nonFiniteFacts++;
};

const closeEpisode = (identity: string, match: Match, endReason: EndReason): void => {
  const episode = active.get(identity);
  if (!episode) return;
  active.delete(identity);
  const mover = match.allPlayers[episode.moverGid];
  closed.push({
    ...episode,
    endedAt: match.simTime,
    endReason,
    endLocalX: match.teams[episode.side].localX(mover.pos.x),
    endY: mover.pos.y,
  });
  endReasons.set(endReason, (endReasons.get(endReason) ?? 0) + 1);
};

const startEvent = (
  match: Match,
  matchIndex: number,
  eventId: number,
  carrier: Player,
): void => {
  wideEvents++;
  const side = match.teams[carrier.side];
  for (const mover of side.players) {
    if (
      mover === carrier || mover.role === 'GK' || mover.sentOff
      || inArrivalZone(mover, match)
    ) continue;
    const identity = `${matchIndex}:${eventId}:${mover.gid}`;
    if (identities.has(identity)) duplicateIdentities++;
    identities.add(identity);
    const episode: ActiveEpisode = {
      identity,
      matchIndex,
      eventId,
      side: carrier.side,
      carrierGid: carrier.gid,
      moverGid: mover.gid,
      moverRole: mover.role,
      startedAt: match.simTime,
      startLocalX: side.localX(mover.pos.x),
      startY: mover.pos.y,
      lastX: mover.pos.x,
      lastY: mover.pos.y,
      pathLength: 0,
      arriverExposed: false,
      assignmentExposed: false,
      actionExposed: false,
      wallRunExposed: false,
    };
    active.set(identity, episode);
    expose(episode, match);
  }
};

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = OFF + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
  });
  let previousWideSide: Side | null = null;
  let nextEventId = 1;

  while (!match.finished) {
    match.step(DT);

    for (const [identity, episode] of [...active]) {
      const mover = match.allPlayers[episode.moverGid];
      update(episode, match);
      if (match.finished) {
        closeEpisode(identity, match, 'matchEnd');
      } else if (match.phase !== 'playing') {
        closeEpisode(identity, match, 'deadBall');
      } else if (mover.sentOff) {
        closeEpisode(identity, match, 'removed');
      } else if (match.ball.owner && match.ball.owner.side !== episode.side) {
        closeEpisode(identity, match, 'opponentControl');
      } else if (episode.pathLength >= MIN_PATH && inArrivalZone(mover, match)) {
        closeEpisode(identity, match, 'arrived');
      } else if (match.simTime - episode.startedAt >= WINDOW - 1e-12) {
        closeEpisode(identity, match, 'expired');
      }
    }

    const owner = wideOwner(match);
    const currentWideSide = owner?.side ?? null;
    if (owner && currentWideSide !== previousWideSide) {
      startEvent(match, matchIndex, nextEventId++, owner);
    }
    previousWideSide = currentWideSide;
  }

  for (const identity of [...active.keys()]) closeEpisode(identity, match, 'matchEnd');
  if (active.size > 0) unfinishedEpisodes += active.size;
}

const arrivals = closed.filter((episode) => episode.endReason === 'arrived');
const unlicensed = arrivals.filter((episode) => !episode.arriverExposed);
const strict = arrivals.filter((episode) => (
  !episode.arriverExposed
  && !episode.assignmentExposed
  && !episode.actionExposed
  && !episode.wallRunExposed
));
const arrivalMatches = new Set(arrivals.map((episode) => episode.matchIndex));
const unlicensedMatches = new Set(unlicensed.map((episode) => episode.matchIndex));
const roleCounts = new Map<Role, number>();
for (const episode of arrivals) {
  roleCounts.set(episode.moverRole, (roleCounts.get(episode.moverRole) ?? 0) + 1);
}

const pct = (part: number, whole: number): string =>
  `${(part / Math.max(1, whole) * 100).toFixed(1)}%`;
const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const quantile = (values: readonly number[], q: number): number => {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)))];
};
const summary = (name: string, values: readonly number[], unit: string): void => {
  console.log(
    `  ${name.padEnd(22)} n=${values.length} · mean ${mean(values).toFixed(3)}${unit}`
    + ` · q10/q50/q90 ${quantile(values, 0.1).toFixed(3)}`
    + `/${quantile(values, 0.5).toFixed(3)}/${quantile(values, 0.9).toFixed(3)}${unit}`,
  );
};
const mapLine = <T extends string>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');

console.log(`E4 EMERGENT CENTRAL ARRIVALS · matches ${MATCHES} · seed start ${OFF}`);
console.log(
  `wide events ${wideEvents} · episodes started/closed ${identities.size}/${closed.length}`
  + ` · duplicate identities ${duplicateIdentities} · unfinished ${unfinishedEpisodes}`
  + ` · non-finite ${nonFiniteFacts}`,
);
console.log(`end reasons ${mapLine(endReasons)}`);
console.log(
  `central arrivals ${arrivals.length} (${(arrivals.length / Math.max(1, MATCHES)).toFixed(3)}/match; `
  + `${arrivalMatches.size}/${MATCHES} matches) · roles ${mapLine(roleCounts)}`,
);
console.log(
  `named-arriver exposed ${arrivals.length - unlicensed.length}`
  + ` (${pct(arrivals.length - unlicensed.length, arrivals.length)})`
  + ` · unlicensed ${unlicensed.length} (${pct(unlicensed.length, arrivals.length)}; `
  + `${unlicensedMatches.size}/${MATCHES} matches) · strict no-authority ${strict.length}`,
);
console.log(
  `other authority exposure runner/overlapper=${arrivals.filter((episode) => episode.assignmentExposed).length}`
  + ` · run/support action=${arrivals.filter((episode) => episode.actionExposed).length}`
  + ` · wallRun=${arrivals.filter((episode) => episode.wallRunExposed).length}`,
);
summary('start local x', arrivals.map((episode) => episode.startLocalX), 'm');
summary('forward displacement', arrivals.map((episode) => episode.endLocalX - episode.startLocalX), 'm');
summary('inward displacement', arrivals.map((episode) => Math.abs(episode.startY) - Math.abs(episode.endY)), 'm');
summary('path length', arrivals.map((episode) => episode.pathLength), 'm');
summary('elapsed', arrivals.map((episode) => episode.endedAt - episode.startedAt), 's');

if (
  MATCHES !== 120
  || identities.size !== closed.length
  || duplicateIdentities > 0
  || nonFiniteFacts > 0
  || unfinishedEpisodes > 0
  || arrivals.length < 10
  || unlicensed.length < 5
  || unlicensedMatches.size < 5
) process.exitCode = 1;
