// E2 EMERGENT PASS-RETURN CENSUS (telemetry only).
// Pattern labels are derived after stable pass completions and never feed AI.
//   npx tsx scripts/probes/emergent-pass-returns.ts [matches] [seedOffset]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 28000);
const RETURN_WINDOW = 3;
const MATERIAL_RETURN_GAIN = 2;

type EndReason =
  | 'returned'
  | 'otherTeamPass'
  | 'otherTeammateControl'
  | 'opponentControl'
  | 'deadBall'
  | 'expired'
  | 'matchEnd';

interface ActiveEpisode {
  readonly completionKey: string;
  readonly matchIndex: number;
  readonly side: Side;
  readonly passerGid: number;
  readonly receiverGid: number;
  readonly startedAt: number;
  readonly startLocalX: number;
  lastX: number;
  lastY: number;
  pathLength: number;
  peakForwardGain: number;
  wallRunExposed: boolean;
  assignmentExposed: boolean;
  supportActionExposed: boolean;
}

interface ClosedEpisode extends ActiveEpisode {
  readonly endedAt: number;
  readonly endReason: EndReason;
  readonly returnGain: number | null;
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

const completionKey = (
  pass: { passerGid: number; receiverGid: number; t: number },
  matchIndex: number,
): string => `${matchIndex}:${pass.passerGid}:${pass.receiverGid}:${pass.t}`;

const active = new Map<string, ActiveEpisode>();
const closed: ClosedEpisode[] = [];
const endReasons = new Map<EndReason, number>();
const allCompletionKeys = new Set<string>();
let completedPasses = 0;
let duplicateCompletionKeys = 0;
let nonFiniteFacts = 0;
let unfinishedEpisodes = 0;
let namedOneTwos = 0;

const exposeAndMove = (episode: ActiveEpisode, match: Match): void => {
  const player = match.allPlayers[episode.passerGid];
  const teamState = match.teams[episode.side];
  episode.pathLength += Math.hypot(player.pos.x - episode.lastX, player.pos.y - episode.lastY);
  episode.lastX = player.pos.x;
  episode.lastY = player.pos.y;
  episode.peakForwardGain = Math.max(
    episode.peakForwardGain,
    teamState.localX(player.pos.x) - episode.startLocalX,
  );
  if (
    player.wallRun !== null
    && match.simTime < player.wallRun.until
    && player.wallRun.partnerGid === episode.receiverGid
  ) episode.wallRunExposed = true;
  if (
    teamState.runners.has(player.index)
    || teamState.arriver === player.index
    || teamState.overlapper === player.index
  ) episode.assignmentExposed = true;
  if (
    player.action.type === 'SupportBallCarrier'
    || player.action.type === 'MakeRun'
  ) episode.supportActionExposed = true;
};

const closeEpisode = (
  key: string,
  match: Match,
  endReason: EndReason,
): void => {
  const episode = active.get(key);
  if (!episode) return;
  active.delete(key);
  const player = match.allPlayers[episode.passerGid];
  const returnGain = endReason === 'returned'
    ? match.teams[episode.side].localX(player.pos.x) - episode.startLocalX
    : null;
  const values = [
    episode.startedAt,
    episode.startLocalX,
    episode.lastX,
    episode.lastY,
    episode.pathLength,
    episode.peakForwardGain,
    match.simTime,
    ...(returnGain === null ? [] : [returnGain]),
  ];
  if (!values.every(Number.isFinite)) nonFiniteFacts++;
  closed.push({
    ...episode,
    endedAt: match.simTime,
    endReason,
    returnGain,
  });
  endReasons.set(endReason, (endReasons.get(endReason) ?? 0) + 1);
};

const startEpisode = (
  pass: { passerGid: number; receiverGid: number; t: number },
  match: Match,
  matchIndex: number,
): void => {
  const passer = match.allPlayers[pass.passerGid];
  if (!passer || passer.side !== match.allPlayers[pass.receiverGid]?.side) return;
  const key = completionKey(pass, matchIndex);
  const episode: ActiveEpisode = {
    completionKey: key,
    matchIndex,
    side: passer.side,
    passerGid: pass.passerGid,
    receiverGid: pass.receiverGid,
    startedAt: match.simTime,
    startLocalX: match.teams[passer.side].localX(passer.pos.x),
    lastX: passer.pos.x,
    lastY: passer.pos.y,
    pathLength: 0,
    peakForwardGain: 0,
    wallRunExposed: false,
    assignmentExposed: false,
    supportActionExposed: false,
  };
  active.set(key, episode);
  exposeAndMove(episode, match);
};

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = OFF + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
  });
  let previousCompletionKey = match.lastCompletedPass
    ? completionKey(match.lastCompletedPass, matchIndex)
    : null;

  while (!match.finished) {
    match.step(DT);
    for (const episode of active.values()) exposeAndMove(episode, match);

    const completed = match.lastCompletedPass;
    const currentCompletionKey = completed ? completionKey(completed, matchIndex) : null;
    const newCompletion = completed !== null && currentCompletionKey !== previousCompletionKey;
    if (newCompletion) {
      completedPasses++;
      if (allCompletionKeys.has(currentCompletionKey!)) duplicateCompletionKeys++;
      allCompletionKeys.add(currentCompletionKey!);

      for (const [key, episode] of [...active]) {
        if (
          completed!.passerGid === episode.receiverGid
          && completed!.receiverGid === episode.passerGid
          && match.simTime - episode.startedAt <= RETURN_WINDOW + 1e-12
        ) {
          closeEpisode(key, match, 'returned');
        } else if (match.allPlayers[completed!.passerGid]?.side === episode.side) {
          closeEpisode(key, match, 'otherTeamPass');
        } else {
          closeEpisode(key, match, 'opponentControl');
        }
      }
      startEpisode(completed!, match, matchIndex);
      previousCompletionKey = currentCompletionKey;
    }

    for (const [key, episode] of [...active]) {
      if (match.phase !== 'playing') {
        closeEpisode(key, match, 'deadBall');
        continue;
      }
      const owner = match.ball.owner;
      if (owner !== null && owner.side !== episode.side) {
        closeEpisode(key, match, 'opponentControl');
      } else if (
        owner !== null
        && owner.side === episode.side
        && owner.gid !== episode.receiverGid
      ) {
        closeEpisode(key, match, 'otherTeammateControl');
      } else if (match.simTime - episode.startedAt > RETURN_WINDOW + 1e-12) {
        closeEpisode(key, match, 'expired');
      }
    }
  }
  for (const key of [...active.keys()]) closeEpisode(key, match, 'matchEnd');
  if (active.size > 0) unfinishedEpisodes += active.size;
  namedOneTwos += match.teams[0].stats.oneTwos + match.teams[1].stats.oneTwos;
}

const returns = closed.filter((episode) => episode.endReason === 'returned');
const unlicensed = returns.filter((episode) => !episode.wallRunExposed);
const unlicensedProgressive = unlicensed.filter((episode) => (
  episode.returnGain !== null && episode.returnGain >= MATERIAL_RETURN_GAIN
));
const strict = returns.filter((episode) => (
  !episode.wallRunExposed
  && !episode.assignmentExposed
  && !episode.supportActionExposed
));
const returnMatches = new Set(returns.map((episode) => episode.matchIndex));
const unlicensedMatches = new Set(unlicensed.map((episode) => episode.matchIndex));
const progressiveMatches = new Set(unlicensedProgressive.map((episode) => episode.matchIndex));

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
    `  ${name.padEnd(18)} n=${values.length} · mean ${mean(values).toFixed(3)}${unit}`
    + ` · q10/q50/q90 ${quantile(values, 0.1).toFixed(3)}`
    + `/${quantile(values, 0.5).toFixed(3)}/${quantile(values, 0.9).toFixed(3)}${unit}`,
  );
};
const mapLine = <T extends string>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');

console.log(`E2 EMERGENT PASS-RETURN CENSUS · matches ${MATCHES} · seed start ${OFF}`);
console.log(
  `completed passes ${completedPasses} · episodes started/closed ${allCompletionKeys.size}/${closed.length}`
  + ` · duplicate keys ${duplicateCompletionKeys} · unfinished ${unfinishedEpisodes}`
  + ` · non-finite ${nonFiniteFacts}`,
);
console.log(`end reasons ${mapLine(endReasons)}`);
console.log(
  `returns ${returns.length} (${(returns.length / Math.max(1, MATCHES)).toFixed(3)}/match; `
  + `${returnMatches.size}/${MATCHES} matches)`
  + ` · named baseline oneTwos ${namedOneTwos}`,
);
console.log(
  `wallRun-exposed ${returns.length - unlicensed.length} (${pct(returns.length - unlicensed.length, returns.length)})`
  + ` · unlicensed ${unlicensed.length} (${pct(unlicensed.length, returns.length)}; `
  + `${unlicensedMatches.size}/${MATCHES} matches)`
  + ` · unlicensed progressive ${unlicensedProgressive.length}`
  + ` (${progressiveMatches.size}/${MATCHES} matches)`
  + ` · strict no-authority ${strict.length}`,
);
console.log(
  `return authority exposure assignment=${returns.filter((episode) => episode.assignmentExposed).length}`
  + ` · support/make-run=${returns.filter((episode) => episode.supportActionExposed).length}`,
);
summary('return gain', returns.map((episode) => episode.returnGain!), 'm');
summary('peak forward gain', returns.map((episode) => episode.peakForwardGain), 'm');
summary('path length', returns.map((episode) => episode.pathLength), 'm');
summary('elapsed time', returns.map((episode) => episode.endedAt - episode.startedAt), 's');

if (
  MATCHES !== 120
  || allCompletionKeys.size !== closed.length
  || duplicateCompletionKeys > 0
  || nonFiniteFacts > 0
  || unfinishedEpisodes > 0
  || returns.length < 10
  || unlicensed.length < 5
  || unlicensedMatches.size < 5
  || unlicensedProgressive.length < 1
) process.exitCode = 1;
