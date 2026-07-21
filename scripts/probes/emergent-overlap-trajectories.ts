// E3 EMERGENT OVERLAP-TRAJECTORY CENSUS (telemetry only).
// Pattern labels are derived after real trajectories and never feed live AI.
//   npx tsx scripts/probes/emergent-overlap-trajectories.ts [matches] [seedOffset]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, HALF_W } from '../../src/sim/constants';
import type { Player } from '../../src/sim/Player';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 30000);
const WINDOW = 4;
const WIDE_CARRIER = HALF_W * 0.5;
const CENTRAL_MOVER = 8;
const MIN_TRAILING = 1;
const MAX_TRAILING = 18;
const MAX_START_DISTANCE = 24;
const MIN_FORWARD_GAIN = 3;
const MIN_AHEAD = 2;
const MIN_OUTSIDE = 1;

type EndReason = 'overlapShaped' | 'controlEnded' | 'deadBall' | 'expired' | 'removed' | 'matchEnd';

interface CarrierSpell {
  readonly id: number;
  readonly carrierGid: number;
  readonly side: Side;
  readonly seenMovers: Set<number>;
}

interface ActiveEpisode {
  readonly identity: string;
  readonly matchIndex: number;
  readonly spellId: number;
  readonly side: Side;
  readonly carrierGid: number;
  readonly moverGid: number;
  readonly moverRole: Role;
  readonly flank: -1 | 1;
  readonly startedAt: number;
  readonly startMoverLocalX: number;
  readonly startTrailing: number;
  lastMoverX: number;
  lastMoverY: number;
  pathLength: number;
  peakForwardGain: number;
  peakAhead: number;
  peakOutside: number;
  overlapperExposed: boolean;
  assignmentExposed: boolean;
  actionExposed: boolean;
  wallRunExposed: boolean;
}

interface ClosedEpisode extends ActiveEpisode {
  readonly endedAt: number;
  readonly endReason: EndReason;
  readonly successForwardGain: number | null;
  readonly successAhead: number | null;
  readonly successOutside: number | null;
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

const active = new Map<string, ActiveEpisode>();
const closed: ClosedEpisode[] = [];
const identities = new Set<string>();
const endReasons = new Map<EndReason, number>();
let carrierSpells = 0;
let wideCarrierSpells = 0;
let duplicateIdentities = 0;
let nonFiniteFacts = 0;
let unfinishedEpisodes = 0;

const expose = (episode: ActiveEpisode, match: Match): void => {
  const mover = match.allPlayers[episode.moverGid];
  const side = match.teams[episode.side];
  if (side.overlapper === mover.index) episode.overlapperExposed = true;
  if (side.runners.has(mover.index) || side.arriver === mover.index) {
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

const update = (episode: ActiveEpisode, match: Match): {
  forwardGain: number;
  ahead: number;
  outside: number;
  sameFlank: boolean;
} => {
  const mover = match.allPlayers[episode.moverGid];
  const carrier = match.allPlayers[episode.carrierGid];
  const side = match.teams[episode.side];
  episode.pathLength += Math.hypot(
    mover.pos.x - episode.lastMoverX,
    mover.pos.y - episode.lastMoverY,
  );
  episode.lastMoverX = mover.pos.x;
  episode.lastMoverY = mover.pos.y;
  const forwardGain = side.localX(mover.pos.x) - episode.startMoverLocalX;
  const ahead = side.localX(mover.pos.x) - side.localX(carrier.pos.x);
  const outside = Math.abs(mover.pos.y) - Math.abs(carrier.pos.y);
  episode.peakForwardGain = Math.max(episode.peakForwardGain, forwardGain);
  episode.peakAhead = Math.max(episode.peakAhead, ahead);
  episode.peakOutside = Math.max(episode.peakOutside, outside);
  expose(episode, match);
  if (![
    mover.pos.x, mover.pos.y, carrier.pos.x, carrier.pos.y,
    episode.pathLength, forwardGain, ahead, outside,
  ].every(Number.isFinite)) nonFiniteFacts++;
  return {
    forwardGain,
    ahead,
    outside,
    sameFlank: Math.sign(mover.pos.y) === episode.flank,
  };
};

const closeEpisode = (
  identity: string,
  match: Match,
  endReason: EndReason,
  success: { forwardGain: number; ahead: number; outside: number } | null = null,
): void => {
  const episode = active.get(identity);
  if (!episode) return;
  active.delete(identity);
  closed.push({
    ...episode,
    endedAt: match.simTime,
    endReason,
    successForwardGain: success?.forwardGain ?? null,
    successAhead: success?.ahead ?? null,
    successOutside: success?.outside ?? null,
  });
  endReasons.set(endReason, (endReasons.get(endReason) ?? 0) + 1);
};

const closeAll = (match: Match, endReason: EndReason): void => {
  for (const identity of [...active.keys()]) closeEpisode(identity, match, endReason);
};

const eligible = (mover: Player, carrier: Player, match: Match): boolean => {
  if (mover.role === 'GK' || mover.sentOff || mover.side !== carrier.side || mover === carrier) {
    return false;
  }
  if (Math.abs(carrier.pos.y) < WIDE_CARRIER) return false;
  const sameFlank = Math.sign(mover.pos.y) === Math.sign(carrier.pos.y);
  if (!sameFlank && Math.abs(mover.pos.y) > CENTRAL_MOVER) return false;
  const side = match.teams[carrier.side];
  const trailing = side.localX(carrier.pos.x) - side.localX(mover.pos.x);
  if (trailing < MIN_TRAILING || trailing > MAX_TRAILING) return false;
  return Math.hypot(mover.pos.x - carrier.pos.x, mover.pos.y - carrier.pos.y) <= MAX_START_DISTANCE;
};

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = OFF + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
  });
  let nextSpellId = 1;
  let spell: CarrierSpell | null = null;

  while (!match.finished) {
    match.step(DT);

    if (spell) {
      const carrier = match.allPlayers[spell.carrierGid];
      const endReason: EndReason | null = match.finished
        ? 'matchEnd'
        : match.phase !== 'playing'
          ? 'deadBall'
          : carrier.sentOff
            ? 'removed'
            : match.ball.owner !== carrier
              ? 'controlEnded'
              : null;
      if (endReason) {
        closeAll(match, endReason);
        spell = null;
      }
    }

    const stableCarrier = match.phase === 'playing'
      && match.ball.owner !== null
      && match.ball.owner.role !== 'GK'
      && !match.ball.owner.sentOff
      ? match.ball.owner
      : null;
    if (!spell && stableCarrier) {
      spell = {
        id: nextSpellId++,
        carrierGid: stableCarrier.gid,
        side: stableCarrier.side,
        seenMovers: new Set(),
      };
      carrierSpells++;
      if (Math.abs(stableCarrier.pos.y) >= WIDE_CARRIER) wideCarrierSpells++;
    }

    if (!spell || !stableCarrier || stableCarrier.gid !== spell.carrierGid) continue;

    for (const [identity, episode] of [...active]) {
      const mover = match.allPlayers[episode.moverGid];
      if (mover.sentOff) {
        closeEpisode(identity, match, 'removed');
        continue;
      }
      const facts = update(episode, match);
      if (
        facts.forwardGain >= MIN_FORWARD_GAIN
        && facts.ahead >= MIN_AHEAD
        && facts.outside >= MIN_OUTSIDE
        && facts.sameFlank
      ) {
        closeEpisode(identity, match, 'overlapShaped', facts);
      } else if (match.simTime - episode.startedAt >= WINDOW - 1e-12) {
        closeEpisode(identity, match, 'expired');
      }
    }

    for (const mover of match.teams[spell.side].players) {
      if (spell.seenMovers.has(mover.gid) || !eligible(mover, stableCarrier, match)) continue;
      spell.seenMovers.add(mover.gid);
      const identity = `${matchIndex}:${spell.id}:${mover.gid}`;
      if (identities.has(identity)) duplicateIdentities++;
      identities.add(identity);
      const side = match.teams[spell.side];
      const startMoverLocalX = side.localX(mover.pos.x);
      const startTrailing = side.localX(stableCarrier.pos.x) - startMoverLocalX;
      const episode: ActiveEpisode = {
        identity,
        matchIndex,
        spellId: spell.id,
        side: spell.side,
        carrierGid: stableCarrier.gid,
        moverGid: mover.gid,
        moverRole: mover.role,
        flank: Math.sign(stableCarrier.pos.y) < 0 ? -1 : 1,
        startedAt: match.simTime,
        startMoverLocalX,
        startTrailing,
        lastMoverX: mover.pos.x,
        lastMoverY: mover.pos.y,
        pathLength: 0,
        peakForwardGain: 0,
        peakAhead: -startTrailing,
        peakOutside: Math.abs(mover.pos.y) - Math.abs(stableCarrier.pos.y),
        overlapperExposed: false,
        assignmentExposed: false,
        actionExposed: false,
        wallRunExposed: false,
      };
      active.set(identity, episode);
      expose(episode, match);
    }
  }

  if (active.size > 0) closeAll(match, 'matchEnd');
  if (active.size > 0) unfinishedEpisodes += active.size;
}

const overlaps = closed.filter((episode) => episode.endReason === 'overlapShaped');
const unlicensed = overlaps.filter((episode) => !episode.overlapperExposed);
const strict = overlaps.filter((episode) => (
  !episode.overlapperExposed
  && !episode.assignmentExposed
  && !episode.actionExposed
  && !episode.wallRunExposed
));
const overlapMatches = new Set(overlaps.map((episode) => episode.matchIndex));
const unlicensedMatches = new Set(unlicensed.map((episode) => episode.matchIndex));
const roleCounts = new Map<Role, number>();
for (const episode of overlaps) {
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

console.log(`E3 EMERGENT OVERLAP TRAJECTORIES · matches ${MATCHES} · seed start ${OFF}`);
console.log(
  `carrier spells ${carrierSpells} · wide-at-start ${wideCarrierSpells}`
  + ` · episodes started/closed ${identities.size}/${closed.length}`
  + ` · duplicate identities ${duplicateIdentities} · unfinished ${unfinishedEpisodes}`
  + ` · non-finite ${nonFiniteFacts}`,
);
console.log(`end reasons ${mapLine(endReasons)}`);
console.log(
  `overlap-shaped ${overlaps.length} (${(overlaps.length / Math.max(1, MATCHES)).toFixed(3)}/match; `
  + `${overlapMatches.size}/${MATCHES} matches)`
  + ` · roles ${mapLine(roleCounts)}`,
);
console.log(
  `named-overlapper exposed ${overlaps.length - unlicensed.length}`
  + ` (${pct(overlaps.length - unlicensed.length, overlaps.length)})`
  + ` · unlicensed ${unlicensed.length} (${pct(unlicensed.length, overlaps.length)}; `
  + `${unlicensedMatches.size}/${MATCHES} matches)`
  + ` · strict no-authority ${strict.length}`,
);
console.log(
  `other authority exposure runner/arriver=${overlaps.filter((episode) => episode.assignmentExposed).length}`
  + ` · run/support action=${overlaps.filter((episode) => episode.actionExposed).length}`
  + ` · wallRun=${overlaps.filter((episode) => episode.wallRunExposed).length}`,
);
summary('start trailing', overlaps.map((episode) => episode.startTrailing), 'm');
summary('success forward gain', overlaps.map((episode) => episode.successForwardGain!), 'm');
summary('success ahead', overlaps.map((episode) => episode.successAhead!), 'm');
summary('success outside', overlaps.map((episode) => episode.successOutside!), 'm');
summary('path length', overlaps.map((episode) => episode.pathLength), 'm');
summary('elapsed', overlaps.map((episode) => episode.endedAt - episode.startedAt), 's');

if (
  MATCHES !== 120
  || identities.size !== closed.length
  || duplicateIdentities > 0
  || nonFiniteFacts > 0
  || unfinishedEpisodes > 0
  || overlaps.length < 10
  || unlicensed.length < 5
  || unlicensedMatches.size < 5
) process.exitCode = 1;
