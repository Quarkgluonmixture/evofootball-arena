// K0a-F READ-ONLY INSET FAILURE AUDIT.
// Authority: docs/world-model/CARRY-AFFORDANCE-INSET-FAILURE-AUDIT.md
import { createHash } from 'node:crypto';
import { evaluateCarryAffordances } from '../../src/ai/carryAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = 120;
const SEED_OFFSET = 43000;
const MATCH_DURATION = 240;
const SAMPLE_TICKS = Math.round(1 / DT);
const INSET_X = HALF_L - 2;
const INSET_Y = HALF_W - 2;

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

const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(
  match.allPlayers
    .filter((player) => !player.sentOff)
    .map((player) => [player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    }]),
);

const finiteProfile = (profile: KnownReachProfile | undefined): boolean =>
  profile !== undefined
  && Number.isFinite(profile.topSpeed)
  && profile.topSpeed > 0
  && Number.isFinite(profile.accel)
  && profile.accel > 0;

interface Violation {
  readonly seed: number;
  readonly simTick: number;
  readonly controllerGid: number;
  readonly candidateId: string;
  readonly hold: boolean;
  readonly controllerX: number;
  readonly controllerY: number;
  readonly candidateX: number;
  readonly candidateY: number;
  readonly excessX: number;
  readonly excessY: number;
  readonly equalsController: boolean;
  readonly insidePhysicalPitch: boolean;
}

const violations: Violation[] = [];
let eligibleStates = 0;
let nullEvaluations = 0;

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = SEED_OFFSET + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  while (!match.finished) {
    match.step(DT);
    if (match.simTick % SAMPLE_TICKS !== 0 || match.phase !== 'playing') continue;
    const controller = match.ball.owner;
    if (!controller || controller.sentOff || controller.role === 'GK') continue;
    const snapshot = oraclePerceptionSnapshot(capturePerceptionTruth(match), controller.gid);
    const profiles = profilesOf(match);
    const self = snapshot.players.find((player) => player.gid === controller.gid);
    if (
      self === undefined
      || snapshot.ball?.ownerGid !== controller.gid
      || snapshot.players.filter((player) => player.side !== self.side).length === 0
      || snapshot.players.filter((player) =>
        player.side === self.side && player.gid !== self.gid).length === 0
      || snapshot.players.some((player) => !finiteProfile(profiles.get(player.gid)))
    ) continue;
    eligibleStates++;
    const values = evaluateCarryAffordances({
      snapshot,
      controllerGid: controller.gid,
      attackDir: match.teams[controller.side].attackDir,
      reachProfiles: profiles,
    });
    if (!values) {
      nullEvaluations++;
      continue;
    }
    for (const value of values) {
      const { point } = value.candidate;
      const excessX = Math.max(0, Math.abs(point.x) - INSET_X);
      const excessY = Math.max(0, Math.abs(point.y) - INSET_Y);
      if (excessX <= 1e-9 && excessY <= 1e-9) continue;
      violations.push({
        seed,
        simTick: match.simTick,
        controllerGid: controller.gid,
        candidateId: value.candidate.id,
        hold: value.candidate.id === 'hold',
        controllerX: controller.pos.x,
        controllerY: controller.pos.y,
        candidateX: point.x,
        candidateY: point.y,
        excessX,
        excessY,
        equalsController: point.x === controller.pos.x && point.y === controller.pos.y,
        insidePhysicalPitch: Math.abs(point.x) <= HALF_L && Math.abs(point.y) <= HALF_W,
      });
    }
  }
}

const hold = violations.filter((violation) => violation.hold);
const directional = violations.filter((violation) => !violation.hold);
const physicalPitchViolations = violations.filter((violation) => !violation.insidePhysicalPitch);
const unequalHoldPoints = hold.filter((violation) => !violation.equalsController);
const report = {
  contract: 'K0a-F-carry-affordance-inset-audit-v1',
  matches: MATCHES,
  seedStart: SEED_OFFSET,
  seedEnd: SEED_OFFSET + MATCHES - 1,
  eligibleStates,
  nullEvaluations,
  outsideInset: violations.length,
  holdOutsideInset: hold.length,
  directionalOutsideInset: directional.length,
  physicalPitchViolations: physicalPitchViolations.length,
  unequalHoldPoints: unequalHoldPoints.length,
  conservation: violations.length === hold.length + directional.length,
  diagnosis: directional.length > 0
    ? 'B-directional-generation-defect'
    : physicalPitchViolations.length > 0
      ? 'C-physical-illegality'
      : hold.length === 204 && unequalHoldPoints.length === 0
        ? 'A-sentinel-domain-mismatch'
        : 'unclassified',
  violations,
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const valid = eligibleStates === 5873
  && nullEvaluations === 0
  && violations.length === 204
  && report.conservation;

console.log(JSON.stringify(report, null, 2));
console.log(`canonical sha256 ${digest}`);
console.log(`K0a-F audit: ${valid ? report.diagnosis : 'INVALID'}`);

if (!valid) process.exitCode = 2;
