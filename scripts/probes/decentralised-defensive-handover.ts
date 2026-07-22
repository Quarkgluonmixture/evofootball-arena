// D-HANDOVER-0 CONTAINMENT-ESTABLISHED DEFENSIVE RELEASE.
// Authority: docs/world-model/DECENTRALISED-DEFENSIVE-HANDOVER.md
import { createHash } from 'node:crypto';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { estimateReach, type KnownReachProfile, type ReachState } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { AI_INTERVAL, CONTROL_RADIUS, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type ActionState, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';

const REQUIRED = Number(process.argv[2] ?? 64);
const SEED_START = Number(process.argv[3] ?? 66_000);
const MAX_SEEDS = 256;
const AWARENESS = 0.8;
const WINDOW_TICKS = Math.round(4 / DT);
const SIGNAL_TICKS = Math.round(AI_INTERVAL / DT);
const NS = 0xd4a0d0e0;

type CommitmentAction = 'ChaseBall' | 'MarkOpponent';
interface Candidate {
  playerGid: number;
  opponentGid: number;
  opponentIndex: number;
  arrivalTime: number;
  preference: number;
  action: CommitmentAction;
}
interface Commitment extends Candidate { committedTick: number }
interface Negotiation {
  commitments: readonly Commitment[];
  snapshots: ReadonlyMap<number, PerceptionSnapshot>;
  converged: boolean;
  duplicates: number;
  nonFinite: number;
  unsupported: number;
  orderDifference: number;
  rngChanged: boolean;
}
interface Opportunity {
  key: string;
  seed: number;
  defendingSide: Side;
  match: Match;
  memories: ReadonlyMap<number, PerceptionMemory>;
  holderGid: number;
  replacementGid: number;
  carrierGid: number;
  supersedingAction: ActionState;
  newCommitments: readonly Commitment[];
}
interface ArmResult {
  arm: 'I' | 'H' | 'U';
  completed: boolean;
  cancelled: boolean;
  seeking: boolean;
  established: boolean;
  supportedEstablished: boolean;
  releaseTick: number | null;
  prematureRelease: boolean;
  seekingOnlyRelease: boolean;
  ordered: boolean;
  completeRecovery: boolean;
  staleRelease: boolean;
  multipleReleases: number;
  snapshotsRngChanged: number;
  unsupported: number;
  coordinationPublications: number;
  forbiddenActionStates: number;
  signatures: readonly string[];
}

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const cloneMemory = (m: PerceptionMemory): PerceptionMemory => ({
  nextScanTick: m.nextScanTick,
  ball: m.ball === null ? null : { ...m.ball, pos: { ...m.ball.pos }, vel: { ...m.ball.vel } },
  players: new Map([...m.players].map(([gid, p]) => [gid, {
    ...p, pos: { ...p.pos }, vel: { ...p.vel }, bodyDir: { ...p.bodyDir },
  }])),
});
const cloneMemories = (source: ReadonlyMap<number, PerceptionMemory>): Map<number, PerceptionMemory> =>
  new Map([...source].map(([gid, memory]) => [gid, cloneMemory(memory)]));
const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(match.allPlayers
  .filter((p) => !p.sentOff).map((p) => [p.gid, {
    topSpeed: p.topSpeed, accel: p.accel, dribbling: p.attrs.dribbling,
  }]));
const reachState = (p: PerceptionSnapshot['players'][number], profile: KnownReachProfile): ReachState => ({
  pos: p.pos, vel: p.vel, bodyDir: p.bodyDir,
  topSpeed: profile.topSpeed, accel: profile.accel,
  attrs: { dribbling: profile.dribbling ?? 0.5 },
});
const beats = (a: Candidate, b: Candidate): boolean =>
  a.arrivalTime < b.arrivalTime || (a.arrivalTime === b.arrivalTime && a.playerGid < b.playerGid);
const same = (a?: Candidate, b?: Candidate): boolean =>
  a?.playerGid === b?.playerGid && a?.opponentGid === b?.opponentGid && a?.action === b?.action;

const settle = (
  input: readonly (readonly [number, readonly Candidate[]])[], tick: number, reverse = false,
): { commitments: Commitment[]; converged: boolean; duplicates: number } => {
  const entries = reverse ? [...input].reverse() : [...input];
  let proposals = new Map<number, Candidate>();
  for (const [gid, candidates] of entries) if (candidates[0]) proposals.set(gid, candidates[0]);
  let converged = false;
  for (let round = 0; round <= entries.length; round++) {
    const next = new Map<number, Candidate>();
    for (const [gid, candidates] of entries) {
      const pick = candidates.find((candidate) => ![...proposals.values()].some((other) =>
        other.playerGid !== gid && other.opponentGid === candidate.opponentGid && beats(other, candidate)));
      if (pick) next.set(gid, pick);
    }
    const gids = new Set([...proposals.keys(), ...next.keys()]);
    if ([...gids].every((gid) => same(proposals.get(gid), next.get(gid)))) {
      proposals = next; converged = true; break;
    }
    proposals = next;
  }
  const commitments = [...proposals.values()].sort((a, b) => a.playerGid - b.playerGid)
    .map((candidate) => ({ ...candidate, committedTick: tick }));
  const counts = new Map<number, number>();
  for (const c of commitments) counts.set(c.opponentGid, (counts.get(c.opponentGid) ?? 0) + 1);
  return {
    commitments, converged,
    duplicates: [...counts.values()].reduce((n, count) => n + Math.max(0, count - 1), 0),
  };
};

const negotiate = (
  match: Match, side: Side, seed: number, memories: Map<number, PerceptionMemory>,
): Negotiation => {
  const truth = capturePerceptionTruth(match);
  const profiles = profilesOf(match);
  const actual = new Map(match.allPlayers.map((p) => [p.gid, p]));
  const snapshots = new Map<number, PerceptionSnapshot>();
  const source: Array<readonly [number, readonly Candidate[]]> = [];
  let nonFinite = 0;
  let unsupported = 0;
  const rngBefore = (match.rng as unknown as { s: number }).s;
  for (const defender of match.teams[side].players) {
    if (defender.role === 'GK' || defender.sentOff) continue;
    const memory = memories.get(defender.gid) ?? createPerceptionMemory();
    memories.set(defender.gid, memory);
    const snapshot = perceiveSnapshot(truth, defender.gid, AWARENESS, hashSeed(NS, seed), memory);
    snapshots.set(defender.gid, snapshot);
    const self = snapshot.players.find((p) => p.gid === defender.gid);
    const profile = profiles.get(defender.gid);
    if (!self || !profile) continue;
    const policy = match.teams[side].policies[defender.index];
    const candidates: Candidate[] = [];
    for (const observed of snapshot.players) {
      if (observed.side === side) continue;
      const target = actual.get(observed.gid);
      if (!target || target.sentOff) { unsupported++; continue; }
      if (target.role === 'GK') continue;
      const chase = snapshot.ball?.ownerGid === observed.gid;
      const arrivalTime = estimateReach(reachState(self, profile), observed.pos, {
        reachRadius: CONTROL_RADIUS,
      }).eta;
      const preference = chase
        ? policy.chaseBase + match.teams[side].genome.pressIntensity * 0.15
        : policy.markBase + match.teams[side].genome.markingAggression * 0.15;
      if (!Number.isFinite(arrivalTime) || !Number.isFinite(preference)) { nonFinite++; continue; }
      candidates.push({
        playerGid: defender.gid, opponentGid: observed.gid, opponentIndex: target.index,
        arrivalTime, preference, action: chase ? 'ChaseBall' : 'MarkOpponent',
      });
    }
    candidates.sort((a, b) => b.preference - a.preference || a.arrivalTime - b.arrivalTime
      || a.opponentGid - b.opponentGid);
    source.push([defender.gid, candidates]);
  }
  const rngAfter = (match.rng as unknown as { s: number }).s;
  const forward = settle(source, match.simTick);
  const reverse = settle(source, match.simTick, true);
  return {
    ...forward, snapshots, nonFinite, unsupported, rngChanged: rngBefore !== rngAfter,
    orderDifference: JSON.stringify(forward) === JSON.stringify(reverse) ? 0 : 1,
  };
};

const actionOf = (commitment: Commitment | undefined): ActionState => commitment?.action === 'ChaseBall'
  ? { type: 'ChaseBall', scores: [] }
  : commitment?.action === 'MarkOpponent'
    ? { type: 'MarkOpponent', targetIdx: commitment.opponentIndex, scores: [] }
    : { type: 'MoveToFormationSpot', scores: [] };
const applyCommitments = (
  match: Match, side: Side, commitments: readonly Commitment[], retainGid?: number,
): void => {
  const byPlayer = new Map(commitments.map((c) => [c.playerGid, c]));
  for (const p of match.teams[side].players) {
    if (p.role === 'GK' || p.sentOff) continue;
    if (p.gid !== retainGid) p.action = actionOf(byPlayer.get(p.gid));
    p.decisionTimer = Number.POSITIVE_INFINITY;
  }
};
const chaser = (commitments: readonly Commitment[]): Commitment | null => {
  const found = commitments.filter((c) => c.action === 'ChaseBall');
  return found.length === 1 ? found[0] : null;
};
const adminClear = (match: Match): boolean => {
  const second = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1 ? match.duration / 2 : second + match.duration / 2;
  return boundary - match.simTime >= 4;
};

const discover = (seed: number): Opportunity | null => {
  const match = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
  });
  const memories = new Map<number, PerceptionMemory>();
  for (const p of match.allPlayers) if (p.role !== 'GK') memories.set(p.gid, createPerceptionMemory());
  let defendingSide: Side | null = null;
  let lastStableOwner: number | null = null;
  let commitments: readonly Commitment[] = [];
  while (!match.finished) {
    if (defendingSide !== null) {
      const t = match.teams[defendingSide];
      t.brainTimer = Number.POSITIVE_INFINITY; t.chasers.clear(); t.marks.clear();
    }
    match.step(DT);
    if (match.simTime < 10 || match.phase !== 'playing' || !adminClear(match)) continue;
    const owner = match.ball.owner;
    if (!owner || owner.role === 'GK' || owner.sentOff) continue;
    if (defendingSide === null) {
      defendingSide = (1 - owner.side) as Side;
      const t = match.teams[defendingSide];
      t.brainTimer = Number.POSITIVE_INFINITY; t.chasers.clear(); t.marks.clear();
      const initial = negotiate(match, defendingSide, seed, memories);
      if (!initial.converged || initial.duplicates || initial.nonFinite || initial.unsupported
        || initial.rngChanged || initial.orderDifference) return null;
      commitments = initial.commitments;
      applyCommitments(match, defendingSide, commitments);
      lastStableOwner = owner.gid;
      continue;
    }
    // Audit one defending team per seed. When it wins the ball, wait for the
    // opponent's next stable carrier instead of silently disabling both teams.
    if (owner.side === defendingSide) {
      lastStableOwner = null;
      continue;
    }
    if (lastStableOwner === null) {
      const initial = negotiate(match, defendingSide, seed, memories);
      if (!initial.converged || initial.duplicates || initial.nonFinite || initial.unsupported
        || initial.rngChanged || initial.orderDifference) return null;
      commitments = initial.commitments;
      applyCommitments(match, defendingSide, commitments);
      lastStableOwner = owner.gid;
      continue;
    }
    if (lastStableOwner === owner.gid) continue;
    const previousChaser = chaser(commitments);
    const next = negotiate(match, defendingSide, seed, memories);
    if (!next.converged || next.duplicates || next.nonFinite || next.unsupported || next.rngChanged
      || next.orderDifference) return null;
    const nextChaser = chaser(next.commitments);
    const superseding = previousChaser
      ? next.commitments.find((c) => c.playerGid === previousChaser.playerGid)
      : undefined;
    const aSnapshot = previousChaser ? next.snapshots.get(previousChaser.playerGid) : undefined;
    if (previousChaser && nextChaser && previousChaser.playerGid !== nextChaser.playerGid
      && (!superseding || superseding.action === 'MarkOpponent') && aSnapshot
      && aSnapshot.players.some((p) => p.gid === nextChaser.playerGid)
      && aSnapshot.players.some((p) => p.gid === owner.gid)) {
      return {
        key: `${seed}:${match.simTick}:${previousChaser.playerGid}:${nextChaser.playerGid}`,
        seed, defendingSide, match: cloneSimulationState(match), memories: cloneMemories(memories),
        holderGid: previousChaser.playerGid, replacementGid: nextChaser.playerGid,
        carrierGid: owner.gid, supersedingAction: actionOf(superseding),
        newCommitments: next.commitments,
      };
    }
    commitments = next.commitments;
    applyCommitments(match, defendingSide, commitments);
    lastStableOwner = owner.gid;
  }
  return null;
};

const signature = (match: Match, side: Side): string => JSON.stringify({
  tick: match.simTick, owner: match.ball.owner?.gid ?? null, ball: [match.ball.pos, match.ball.vel],
  players: match.teams[side].players.map((p) => [p.gid, p.pos, p.vel, p.action, p.containing]),
  rng: (match.rng as unknown as { s: number }).s,
});
const goalSide = (snapshot: PerceptionSnapshot, gid: number, carrierGid: number, side: Side): boolean => {
  const p = snapshot.players.find((x) => x.gid === gid);
  const carrier = snapshot.players.find((x) => x.gid === carrierGid);
  if (!p || !carrier) return false;
  const gx = side === 0 ? -HALF_L : HALF_L;
  return Math.hypot(p.pos.x - gx, p.pos.y) < Math.hypot(carrier.pos.x - gx, carrier.pos.y);
};

const runArm = (op: Opportunity, arm: ArmResult['arm']): ArmResult => {
  const match = cloneSimulationState(op.match);
  const memories = cloneMemories(op.memories);
  const team = match.teams[op.defendingSide];
  const holder = match.allPlayers.find((p) => p.gid === op.holderGid)!;
  const replacement = match.allPlayers.find((p) => p.gid === op.replacementGid)!;
  const initialHolder = { ...holder.pos };
  applyCommitments(match, op.defendingSide, op.newCommitments, arm === 'I' ? undefined : holder.gid);
  if (arm !== 'I') {
    holder.action = { type: 'ChaseBall', scores: [] };
    holder.decisionTimer = Number.POSITIVE_INFINITY;
  }
  let seeking = false;
  let established = false;
  let supportedEstablished = false;
  let releaseTick: number | null = arm === 'I' ? match.simTick : null;
  let prematureRelease = arm === 'I';
  let seekingOnlyRelease = false;
  let cancelled = false;
  let completed = true;
  let staleRelease = false;
  let multipleReleases = 0;
  let snapshotsRngChanged = 0;
  let unsupported = 0;
  let coordinationPublications = 0;
  let forbiddenActionStates = 0;
  let releaseGoalSide = false;
  let observedEstablishedTick: number | null = null;
  const signatures: string[] = [];
  const openedTick = match.simTick;
  for (let step = 1; step <= WINDOW_TICKS; step++) {
    team.brainTimer = Number.POSITIVE_INFINITY; team.chasers.clear(); team.marks.clear();
    match.step(DT);
    coordinationPublications += team.chasers.size + team.marks.size;
    if (!['ChaseBall', 'MarkOpponent', 'MoveToFormationSpot'].includes(holder.action.type)
      || replacement.action.type !== 'ChaseBall') forbiddenActionStates++;
    signatures.push(signature(match, op.defendingSide));
    if (match.finished || match.phase !== 'playing' || match.ball.owner?.gid !== op.carrierGid) {
      cancelled = true; completed = false; break;
    }
    if (step % SIGNAL_TICKS !== 0) continue;
    const truth = capturePerceptionTruth(match);
    const before = (match.rng as unknown as { s: number }).s;
    const bSnapshot = perceiveSnapshot(
      truth, replacement.gid, AWARENESS, hashSeed(NS, op.seed), memories.get(replacement.gid)!,
    );
    const aSnapshot = perceiveSnapshot(
      truth, holder.gid, AWARENESS, hashSeed(NS, op.seed), memories.get(holder.gid)!,
    );
    if (before !== (match.rng as unknown as { s: number }).s) snapshotsRngChanged++;
    const bSupportsCarrier = bSnapshot.ball?.ownerGid === op.carrierGid
      && bSnapshot.players.some((p) => p.gid === op.carrierGid);
    const aSupports = aSnapshot.players.some((p) => p.gid === replacement.gid)
      && aSnapshot.players.some((p) => p.gid === op.carrierGid);
    if (!bSupportsCarrier || !aSupports) {
      // Observer uncertainty cancels honestly. It never authorises a fallback
      // to Match truth, and therefore is not counted as unsupported inference.
      cancelled = true; completed = false; break;
    }
    if (!seeking) {
      seeking = true;
      continue;
    }
    if (replacement.action.type === 'ChaseBall' && replacement.containing && match.simTick > openedTick) {
      established = true;
      supportedEstablished = true;
      if (observedEstablishedTick === null) {
        observedEstablishedTick = match.simTick;
      } else if (arm === 'H' && releaseTick === null && match.simTick > observedEstablishedTick) {
        releaseTick = match.simTick;
        holder.action = structuredClone(op.supersedingAction);
        holder.decisionTimer = Number.POSITIVE_INFINITY;
        releaseGoalSide = goalSide(aSnapshot, holder.gid, op.carrierGid, op.defendingSide);
      }
    } else {
      // A historical established signal is not valid after the replacement's
      // newest publication has returned to seeking.
      observedEstablishedTick = null;
    }
  }
  if (releaseTick !== null && arm === 'H' && !established) staleRelease = true;
  if (releaseTick !== null && arm === 'H' && !seeking) seekingOnlyRelease = true;
  const moved = Math.hypot(holder.pos.x - initialHolder.x, holder.pos.y - initialHolder.y);
  const ordered = arm === 'H' && seeking && established && supportedEstablished && releaseTick !== null
    && !prematureRelease && !staleRelease;
  return {
    arm, completed, cancelled, seeking, established, supportedEstablished, releaseTick,
    prematureRelease, seekingOnlyRelease, ordered,
    completeRecovery: ordered && releaseGoalSide && moved >= 0.25,
    staleRelease, multipleReleases, snapshotsRngChanged, unsupported,
    coordinationPublications, forbiddenActionStates, signatures,
  };
};

let scannedSeeds = 0;
const opportunities: Opportunity[] = [];
for (let seed = SEED_START; seed < SEED_START + MAX_SEEDS && opportunities.length < REQUIRED; seed++) {
  scannedSeeds++;
  const opportunity = discover(seed);
  if (opportunity) opportunities.push(opportunity);
}

let deterministicDifferences = 0;
let completedH = 0;
let seekingCount = 0;
let establishedCount = 0;
let supportedEstablishedCount = 0;
let seekingOnlyCount = 0;
let orderedH = 0;
let recoveryH = 0;
let orderedI = 0;
let recoveryI = 0;
let prematureH = 0;
let seekingOnlyReleases = 0;
let releasesU = 0;
let signatureDifferences = 0;
let rngChanges = 0;
let unsupported = 0;
let staleReleases = 0;
let multipleReleases = 0;
let coordinationPublications = 0;
let forbiddenActionStates = 0;
const participantCounts = new Map<number, number>();
const records = [];
for (const opportunity of opportunities) {
  const immediate = runArm(opportunity, 'I');
  const handover = runArm(opportunity, 'H');
  const blind = runArm(opportunity, 'U');
  const replay = runArm(opportunity, 'H');
  if (JSON.stringify(handover) !== JSON.stringify(replay)) deterministicDifferences++;
  if (handover.completed) completedH++;
  if (handover.seeking) seekingCount++;
  if (handover.established) establishedCount++;
  if (handover.supportedEstablished) supportedEstablishedCount++;
  if (handover.seeking && !handover.established) seekingOnlyCount++;
  if (handover.ordered) orderedH++;
  if (handover.completeRecovery) recoveryH++;
  if (immediate.ordered) orderedI++;
  if (immediate.completeRecovery) recoveryI++;
  if (handover.prematureRelease) prematureH++;
  if (handover.seekingOnlyRelease) seekingOnlyReleases++;
  if (blind.releaseTick !== null) releasesU++;
  if (handover.releaseTick !== null) {
    const prefix = handover.releaseTick - opportunity.match.simTick;
    if (JSON.stringify(handover.signatures.slice(0, prefix))
      !== JSON.stringify(blind.signatures.slice(0, prefix))) signatureDifferences++;
  }
  rngChanges += handover.snapshotsRngChanged + blind.snapshotsRngChanged;
  unsupported += handover.unsupported + blind.unsupported;
  staleReleases += handover.staleRelease ? 1 : 0;
  multipleReleases += handover.multipleReleases;
  coordinationPublications += handover.coordinationPublications + blind.coordinationPublications;
  forbiddenActionStates += handover.forbiddenActionStates + blind.forbiddenActionStates;
  for (const gid of [opportunity.holderGid, opportunity.replacementGid]) {
    participantCounts.set(gid, (participantCounts.get(gid) ?? 0) + (handover.ordered ? 1 : 0));
  }
  records.push({ key: opportunity.key, immediate, handover, blind });
}
const largestShare = Math.max(0, ...participantCounts.values()) / Math.max(1, orderedH * 2);
const gates = {
  accepted: opportunities.length === REQUIRED,
  scannedRange: scannedSeeds <= MAX_SEEDS,
  completedH: completedH >= 56,
  seeking: seekingCount >= 48,
  established: establishedCount >= 24,
  supportedEstablished: supportedEstablishedCount >= 24,
  seekingOnly: seekingOnlyCount >= 12,
  noPrematureH: prematureH === 0,
  noSeekingOnlyRelease: seekingOnlyReleases === 0,
  noBlindRelease: releasesU === 0,
  orderedH: orderedH >= 16,
  recoveryH: recoveryH >= 16,
  orderedEdge: orderedH - orderedI >= 12,
  recoveryEdge: recoveryH - recoveryI >= 12,
  roleNeutrality: largestShare <= 0.60,
  deterministic: deterministicDifferences === 0,
  pairedPrefix: signatureDifferences === 0,
  rngPurity: rngChanges === 0,
  supported: unsupported === 0,
  noStaleRelease: staleReleases === 0,
  singleRelease: multipleReleases === 0,
  noCoordinationPublications: coordinationPublications === 0,
  frozenActionVocabulary: forbiddenActionStates === 0,
};
const report = {
  authority: 'D-HANDOVER-0 containment-established defensive release',
  parameters: { required: REQUIRED, seedStart: SEED_START, maxSeeds: MAX_SEEDS,
    windowTicks: WINDOW_TICKS, signalTicks: SIGNAL_TICKS, awareness: AWARENESS },
  support: { scannedSeeds, opportunities: opportunities.length, completedH, seekingCount,
    establishedCount, supportedEstablishedCount, seekingOnlyCount, orderedH, recoveryH,
    orderedI, recoveryI, largestShare },
  validity: { deterministicDifferences, signatureDifferences, rngChanges, unsupported,
    prematureH, seekingOnlyReleases, releasesU, staleReleases, multipleReleases,
    coordinationPublications, forbiddenActionStates },
  records, gates, pass: Object.values(gates).every(Boolean),
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
console.log('D-HANDOVER-0 CONTAINMENT-ESTABLISHED DEFENSIVE RELEASE');
console.log(`opportunities ${opportunities.length}/${REQUIRED} · scanned ${scannedSeeds}/${MAX_SEEDS}`);
console.log(`completed H ${completedH}/${opportunities.length} · seeking ${seekingCount}`
  + ` · established ${establishedCount} · supported ${supportedEstablishedCount}`);
console.log(`ordered H/I ${orderedH}/${orderedI} · recovery H/I ${recoveryH}/${recoveryI}`
  + ` · seeking-only ${seekingOnlyCount} · largest share ${(largestShare * 100).toFixed(1)}%`);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${report.pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
