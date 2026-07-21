// B1c control-sequence layer gate.
// B1c-0 is representation-only, so the accepted baseline is zero sequences
// and zero micro-touch transitions. Later stages extend the same observer.
//   npx tsx scripts/probes/control-sequence-anatomy.ts [matches] [seedOffset]
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DT } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import type { ControlSequenceOrigin } from '../../src/sim/physical';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);

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

type Snapshot = {
  id: number;
  controllerGid: number;
  status: 'active' | 'broken' | 'released';
  touchIndex: number;
  startedTick: number;
};

const origin: Record<ControlSequenceOrigin, number> = {
  reception: 0,
  interception: 0,
  looseControl: 0,
  selfRegather: 0,
};

let sequences = 0;
let activeFrames = 0;
let microTouches = 0;
let broken = 0;
let released = 0;
let unresolved = 0;
let distanceSum = 0;
let distanceSamples = 0;
let relativeSpeedSum = 0;
let exposureFrames = 0;
let cadenceSum = 0;
let cadenceSamples = 0;
let opponentBreaks = 0;
let fastReacquire = 0;
let ownTouchOpenedM3 = 0;
let ownTouchChangedPossession = 0;
let passArrivalContactsAfterControl = 0;
let duplicateSequenceStart = 0;

for (let seed = OFF; seed < OFF + N; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
    traceContests: true,
  });
  const seenIds = new Set<number>();
  const lastTouchTick = new Map<number, number>();
  let previous: Snapshot | null = null;
  let observedContestEpisodes = 0;

  while (!match.finished) {
    const possessionBefore = match.possessionSide;
    const contestsBefore = match.contestEpisodes.length;
    match.step(DT);

    const sequence = match.controlSequence;
    const current: Snapshot | null = sequence === null ? null : {
      id: sequence.id,
      controllerGid: sequence.controllerGid,
      status: sequence.status,
      touchIndex: sequence.touchIndex,
      startedTick: sequence.startedTick,
    };

    if (sequence !== null && sequence.status === 'active') {
      activeFrames++;
      const controller = match.allPlayers[sequence.controllerGid];
      if (controller) {
        const dx = match.ball.pos.x - controller.pos.x;
        const dy = match.ball.pos.y - controller.pos.y;
        const distance = Math.hypot(dx, dy);
        distanceSum += distance;
        distanceSamples++;
        relativeSpeedSum += Math.hypot(
          match.ball.vel.x - controller.vel.x,
          match.ball.vel.y - controller.vel.y,
        );
        if (distance > 1.25) exposureFrames++;
      }
    }

    const started =
      current !== null && current.status === 'active' &&
      (previous === null || previous.id !== current.id || previous.status !== 'active');
    if (started) {
      sequences++;
      if (seenIds.has(current.id)) duplicateSequenceStart++;
      seenIds.add(current.id);
      origin[sequence!.origin]++;
    }

    const touchDelta =
      current !== null && current.status === 'active' &&
      previous !== null && previous.status === 'active' && previous.id === current.id
        ? Math.max(0, current.touchIndex - previous.touchIndex)
        : 0;
    if (touchDelta > 0) {
      microTouches += touchDelta;
      if (match.contestEpisodes.length > contestsBefore) ownTouchOpenedM3 += touchDelta;
      if (match.possessionSide !== possessionBefore) ownTouchChangedPossession += touchDelta;
      const priorTick = lastTouchTick.get(current!.id);
      if (priorTick !== undefined) {
        cadenceSum += (match.simTick - priorTick) * DT;
        cadenceSamples++;
      }
      lastTouchTick.set(current!.id, match.simTick);
    }

    if (current !== null && previous !== null && current.id === previous.id) {
      if (previous.status === 'active' && current.status === 'broken') {
        broken++;
        if (
          sequence !== null && sequence.status === 'broken' &&
          (sequence.breakCause === 'opponentContact' || sequence.breakCause === 'tackle')
        ) {
          opponentBreaks++;
        }
      } else if (previous.status === 'active' && current.status === 'released') {
        released++;
      }
    }

    for (let index = observedContestEpisodes; index < match.contestEpisodes.length; index++) {
      const episode = match.contestEpisodes[index];
      if (
        episode.origin === 'passArrival' &&
        (previous?.status === 'active' || current?.status === 'active')
      ) {
        passArrivalContactsAfterControl += episode.contacts.length;
      }
    }
    observedContestEpisodes = match.contestEpisodes.length;

    // B1c-2 will classify this from terminal sequence history. It remains an
    // explicit zero in the B1c-0 shell rather than inferring from ball.owner.
    fastReacquire += 0;
    previous = current;
  }

  if (previous?.status === 'active') unresolved++;
}

const perMatch = (value: number): string => (value / Math.max(N, 1)).toFixed(2);
const mean = (value: number, count: number, digits = 3): string =>
  count === 0 ? 'n/a' : (value / count).toFixed(digits);
const meanWithUnit = (value: number, count: number, unit: string): string =>
  count === 0 ? 'n/a' : `${(value / count).toFixed(3)}${unit}`;

console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})`);
console.log(
  `sequences ${perMatch(sequences)}/match · active ${(activeFrames * DT / Math.max(N, 1)).toFixed(3)}s/match · ` +
  `touches ${perMatch(microTouches)}/match · touches/sequence ${mean(microTouches, sequences, 2)}`,
);
console.log(
  `origin reception/interception/loose/self ` +
  `${origin.reception}/${origin.interception}/${origin.looseControl}/${origin.selfRegather} · ` +
  `broken ${broken} · released ${released} · unresolved ${unresolved}`,
);
console.log(
  `controller distance ${meanWithUnit(distanceSum, distanceSamples, 'm')} · relative speed ` +
  `${meanWithUnit(relativeSpeedSum, distanceSamples, 'm/s')} · exposure ${(exposureFrames * DT).toFixed(3)}s · ` +
  `virtual-foot distance n/a (B1c-1)` ,
);
console.log(
  `cadence ${meanWithUnit(cadenceSum, cadenceSamples, 's')} · opponent breaks ${opponentBreaks} · ` +
  `fast reacquire ${fastReacquire}`,
);
console.log(
  `EXACT ZERO ownTouchOpenedM3=${ownTouchOpenedM3} · ` +
  `ownTouchChangedPossession=${ownTouchChangedPossession} · ` +
  `passArrivalContactsAfterControl=${passArrivalContactsAfterControl} · ` +
  `duplicateSequenceStart=${duplicateSequenceStart}`,
);

if (
  ownTouchOpenedM3 !== 0 ||
  ownTouchChangedPossession !== 0 ||
  passArrivalContactsAfterControl !== 0 ||
  duplicateSequenceStart !== 0
) {
  process.exitCode = 1;
}
