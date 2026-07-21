// Q0 SECURED-BALL ACCESS CENSUS (read-only).
// Authority: docs/world-model/SECURED-BALL-ACCESS-CENSUS.md
import { createHash } from 'node:crypto';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { directBallAccess } from '../../src/sim/physical';
import type { Player } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED_OFFSET = Number(process.argv[3] ?? 44000);
const MATCH_DURATION = 240;
const TACKLE_CENTER_RADIUS = 1.15;

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

const quantile = (values: readonly number[], p: number): number => {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((left, right) => left - right);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  return lower === upper
    ? sorted[lower]
    : sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const distribution = (values: readonly number[]) => ({
  n: values.length,
  min: values.length === 0 ? null : Math.min(...values),
  q25: quantile(values, 0.25),
  q50: quantile(values, 0.5),
  q75: quantile(values, 0.75),
  max: values.length === 0 ? null : Math.max(...values),
  mean: values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length),
});

interface AccessEpisode {
  readonly seed: number;
  readonly startTick: number;
  readonly ownerGid: number;
  readonly challengerGid: number;
  readonly centerDistance: number;
  readonly surfaceGap: number;
  readonly sector: 'front' | 'side' | 'back';
  readonly sectorCenterReach: number;
  readonly withinPlayingDistance: boolean;
  readonly mustTurn: boolean;
  readonly blockedByGid: number | null;
  readonly blockerKind: 'carrier' | 'otherAttacker' | 'none';
  readonly mustGoAround: boolean;
  readonly canDirectlyContact: boolean;
  readonly challengerReady: boolean;
  readonly challengerRole: string;
  readonly challengerTackleCooldown: number;
  readonly challengerStunTimer: number;
  readonly carrierSpeed: number;
  readonly ballCarrierDistance: number;
  readonly carrierBodyX: number;
  readonly carrierBodyY: number;
  readonly challengerBodyX: number;
  readonly challengerBodyY: number;
}

const minimalQueryState = (match: Match): string => JSON.stringify({
  ball: {
    pos: { x: match.ball.pos.x, y: match.ball.pos.y },
    radius: match.ball.radius,
  },
  players: match.allPlayers.map((player) => ({
    gid: player.gid,
    side: player.side,
    pos: { x: player.pos.x, y: player.pos.y },
    bodyDir: { x: player.bodyDir.x, y: player.bodyDir.y },
    coreRadius: player.coreRadius,
  })),
});

const nearestInRadius = (match: Match, owner: Player): Player | null => {
  let nearest: Player | null = null;
  let best = Infinity;
  for (const challenger of match.teams[1 - owner.side].players) {
    if (challenger.sentOff) continue;
    const distance = Math.hypot(
      challenger.pos.x - match.ball.pos.x,
      challenger.pos.y - match.ball.pos.y,
    );
    if (distance < TACKLE_CENTER_RADIUS && distance < best) {
      best = distance;
      nearest = challenger;
    }
  }
  return nearest;
};

const episodes: AccessEpisode[] = [];
const episodeIds = new Set<string>();
const representedMatches = new Set<number>();
let activePair: string | null = null;
let duplicateEpisodeIdentities = 0;
let distanceViolations = 0;
let partitionFailures = 0;
let blockerIdentityFailures = 0;
let nonFiniteGeometry = 0;
let inputMutations = 0;
let rngDraws = 0;

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = SEED_OFFSET + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  activePair = null;
  while (!match.finished) {
    const owner = match.phase === 'playing' && match.ball.owner?.role !== 'GK'
      ? match.ball.owner
      : null;
    const challenger = owner ? nearestInRadius(match, owner) : null;
    const pair = owner && challenger ? `${owner.gid}:${challenger.gid}` : null;
    if (owner && challenger && pair !== activePair) {
      const episodeId = `${seed}:${match.simTick}:${owner.gid}:${challenger.gid}`;
      if (episodeIds.has(episodeId)) duplicateEpisodeIdentities++;
      episodeIds.add(episodeId);
      representedMatches.add(seed);

      const before = minimalQueryState(match);
      const rngBefore = (match.rng as unknown as { s: number }).s;
      const access = directBallAccess(
        challenger,
        match.ball,
        match.allPlayers,
        TACKLE_CENTER_RADIUS,
      );
      const rngAfter = (match.rng as unknown as { s: number }).s;
      if (minimalQueryState(match) !== before) inputMutations++;
      if (rngBefore !== rngAfter) rngDraws++;

      const centerDistance = Math.hypot(
        challenger.pos.x - match.ball.pos.x,
        challenger.pos.y - match.ball.pos.y,
      );
      if (centerDistance >= TACKLE_CENTER_RADIUS) distanceViolations++;
      const blocker = access.blockedByGid === null
        ? null
        : match.allPlayers.find((player) => player.gid === access.blockedByGid) ?? null;
      if (
        (access.blockedByGid !== null && blocker === null)
        || (blocker !== null && (blocker.gid === challenger.gid || blocker.side === challenger.side))
      ) blockerIdentityFailures++;
      const numeric = [
        centerDistance,
        access.geometry.surfaceGap,
        access.geometry.forward,
        access.geometry.lateral,
        access.sectorCenterReach,
        challenger.tackleCooldown,
        challenger.stunTimer,
        Math.hypot(owner.vel.x, owner.vel.y),
        Math.hypot(match.ball.pos.x - owner.pos.x, match.ball.pos.y - owner.pos.y),
      ];
      if (numeric.some((value) => !Number.isFinite(value))) nonFiniteGeometry++;

      episodes.push({
        seed,
        startTick: match.simTick,
        ownerGid: owner.gid,
        challengerGid: challenger.gid,
        centerDistance,
        surfaceGap: access.geometry.surfaceGap,
        sector: access.geometry.sector,
        sectorCenterReach: access.sectorCenterReach,
        withinPlayingDistance: access.withinPlayingDistance,
        mustTurn: access.mustTurn,
        blockedByGid: access.blockedByGid,
        blockerKind: blocker === owner
          ? 'carrier'
          : blocker === null
            ? 'none'
            : 'otherAttacker',
        mustGoAround: access.mustGoAround,
        canDirectlyContact: access.canDirectlyContact,
        challengerReady: challenger.tackleCooldown <= 0 && challenger.stunTimer <= 0,
        challengerRole: challenger.role,
        challengerTackleCooldown: challenger.tackleCooldown,
        challengerStunTimer: challenger.stunTimer,
        carrierSpeed: Math.hypot(owner.vel.x, owner.vel.y),
        ballCarrierDistance: Math.hypot(
          match.ball.pos.x - owner.pos.x,
          match.ball.pos.y - owner.pos.y,
        ),
        carrierBodyX: owner.bodyDir.x,
        carrierBodyY: owner.bodyDir.y,
        challengerBodyX: challenger.bodyDir.x,
        challengerBodyY: challenger.bodyDir.y,
      });
    }
    activePair = pair;
    match.step(DT);
  }
}

const accessible = episodes.filter((episode) => episode.canDirectlyContact);
const inaccessible = episodes.filter((episode) => !episode.canDirectlyContact);
if (accessible.length + inaccessible.length !== episodes.length) partitionFailures++;

const denial = {
  turnOnly: inaccessible.filter((episode) => episode.mustTurn && !episode.mustGoAround).length,
  aroundOnly: inaccessible.filter((episode) => !episode.mustTurn && episode.mustGoAround).length,
  both: inaccessible.filter((episode) => episode.mustTurn && episode.mustGoAround).length,
  unexplained: inaccessible.filter((episode) => !episode.mustTurn && !episode.mustGoAround).length,
};
const blocker = {
  carrier: episodes.filter((episode) => episode.blockerKind === 'carrier').length,
  otherAttacker: episodes.filter((episode) => episode.blockerKind === 'otherAttacker').length,
  none: episodes.filter((episode) => episode.blockerKind === 'none').length,
};
const sectors = Object.fromEntries((['front', 'side', 'back'] as const).map((sector) => {
  const values = episodes.filter((episode) => episode.sector === sector);
  const direct = values.filter((episode) => episode.canDirectlyContact).length;
  return [sector, {
    episodes: values.length,
    accessible: direct,
    accessRate: direct / Math.max(1, values.length),
  }];
}));
const readiness = {
  ready: episodes.filter((episode) => episode.challengerReady).length,
  unavailable: episodes.filter((episode) => !episode.challengerReady).length,
};
const accessibleShare = accessible.length / Math.max(1, episodes.length);
const inaccessibleShare = inaccessible.length / Math.max(1, episodes.length);
const ledgerDigest = createHash('sha256').update(JSON.stringify(episodes)).digest('hex');
const gates = {
  matchesRepresented: representedMatches.size === 120,
  episodeSupport: episodes.length >= 500,
  duplicateEpisodeIdentities: duplicateEpisodeIdentities === 0,
  distanceViolations: distanceViolations === 0,
  partitionFailures: partitionFailures === 0,
  blockerIdentityFailures: blockerIdentityFailures === 0,
  nonFiniteGeometry: nonFiniteGeometry === 0,
  inputMutations: inputMutations === 0,
  rngDraws: rngDraws === 0,
  accessibleSupport: accessibleShare >= 0.1,
  inaccessibleSupport: inaccessibleShare >= 0.1,
};
const report = {
  contract: 'Q0-secured-ball-access-census-v1',
  matches: MATCHES,
  seedStart: SEED_OFFSET,
  seedEnd: SEED_OFFSET + MATCHES - 1,
  matchDuration: MATCH_DURATION,
  representedMatches: representedMatches.size,
  episodes: episodes.length,
  accessible: { count: accessible.length, share: accessibleShare },
  inaccessible: { count: inaccessible.length, share: inaccessibleShare },
  denial,
  blocker,
  sectors,
  readiness,
  distributions: {
    centerDistance: distribution(episodes.map((episode) => episode.centerDistance)),
    surfaceGap: distribution(episodes.map((episode) => episode.surfaceGap)),
    carrierSpeed: distribution(episodes.map((episode) => episode.carrierSpeed)),
    ballCarrierDistance: distribution(episodes.map((episode) => episode.ballCarrierDistance)),
  },
  violations: {
    duplicateEpisodeIdentities,
    distanceViolations,
    partitionFailures,
    blockerIdentityFailures,
    nonFiniteGeometry,
    inputMutations,
    rngDraws,
  },
  ledgerSha256: ledgerDigest,
  gates,
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pass = MATCHES === 120
  && SEED_OFFSET === 44000
  && Object.values(gates).every(Boolean);

console.log(JSON.stringify(report, null, 2));
console.log(`canonical sha256 ${digest}`);
console.log(`Q0 verdict: ${pass ? 'PASS' : 'FAIL — STOP'}`);

if (!pass) process.exitCode = 2;
