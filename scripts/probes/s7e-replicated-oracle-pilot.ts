// S7e-0C independent replicated-oracle feasibility pilot.
// Pre-registered authority: docs/world-model/S7E-REPLICATED-ORACLE-CEILING.md
//   npx tsx scripts/probes/s7e-replicated-oracle-pilot.ts
import { evaluatePassAffordance, type KnownReachProfile } from '../../src/ai/passAffordance';
import {
  comparePassNextStates,
  passNextStateValue,
  type PassNextStateValue,
} from '../../src/ai/passValue';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  projectComparablePassPayoffV1,
  runOracleV2Branch,
  type ComparablePassPayoffV1,
  type FirstTransitionOutcome,
  type OracleV2BranchRecord,
} from './oracle-v2';
import {
  COMPARABLE_PAYOFF_DIMENSIONS,
  compareComparablePassPayoffs,
  meanComparablePassPayoffs,
  type PayoffRelation,
} from './pass-payoff-relation';

const PILOT_SEED_START = 10000;
const PILOT_SEED_END = 10031;
const PILOT_PAIRS = 64;
const REPLICATES = 64;
const HALF_REPLICATES = 32;
const REQUIRED_AGREEMENT = 52;
const MAX_PROJECTED_HALF_WIDTH = 0.0125;
const FINAL_PAIR_COUNT = 509;
const S7E_NAMESPACE = 0x537e0001;

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

const profilesOf = (match: Match): Map<number, KnownReachProfile> => {
  const profiles = new Map<number, KnownReachProfile>();
  for (const player of match.allPlayers) {
    if (player.sentOff) continue;
    profiles.set(player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    });
  }
  return profiles;
};

const passValues = (match: Match, passerGid: number): PassNextStateValue[] => {
  const passer = match.allPlayers[passerGid];
  const snapshot = oraclePerceptionSnapshot(capturePerceptionTruth(match), passerGid);
  const profiles = profilesOf(match);
  const values: PassNextStateValue[] = [];
  for (const target of match.teams[passer.side].players) {
    if (target.sentOff || target.gid === passerGid) continue;
    const affordance = evaluatePassAffordance({
      snapshot,
      passerGid,
      targetGid: target.gid,
      attackDir: match.teams[passer.side].attackDir,
      reachProfiles: profiles,
    });
    if (!affordance) continue;
    const value = passNextStateValue(affordance);
    if (value) values.push(value);
  }
  return values;
};

const readRngState = (match: Match): number =>
  (match.rng as unknown as { s: number }).s >>> 0;

const canonicalSeed = (seed: number): number =>
  (seed >>> 0) === 0 ? 0x9e3779b9 : seed >>> 0;

const relationX = (relation: PayoffRelation): number =>
  relation === 'alternativeDominates'
    ? 1
    : relation === 'chosenDominates' ? -1 : 0;

const relations = (): Record<PayoffRelation, number> => ({
  alternativeDominates: 0,
  chosenDominates: 0,
  equivalent: 0,
  tradeoff: 0,
});

type AnatomyOutcome = FirstTransitionOutcome | 'administrativeCensor';
const anatomy = (): Record<AnatomyOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
  administrativeCensor: 0,
});

const validity = {
  forceFailures: 0,
  residualOther: 0,
  doubleClassifications: 0,
  unsupportedFilledWithZero: 0,
  rngCollisions: 0,
  pairIdCollisions: 0,
  deterministicRerunDifferences: 0,
  missingComparableVectors: 0,
  nonFiniteComparableFields: 0,
  macroPossessionProjectionReads: 0,
  rawNullFieldsOverwritten: 0,
  deadResetPositionReads: 0,
  administrativeTerminalUnsupported: 0,
  projectionVersionMismatch: 0,
  perDimensionDenominatorMismatch: 0,
};

const validateRecord = (record: OracleV2BranchRecord): void => {
  const transition = record.firstTransition;
  if (
    (transition.status === 'resolved') !== (transition.outcome !== null)
    || transition.status === 'forceFailure'
  ) validity.doubleClassifications++;
  const payoff = record.payoffFromKick3s;
  if (payoff.projectionVersion !== 'comparable-pass-payoff-v1') {
    validity.projectionVersionMismatch++;
  }
  const { raw, comparable } = payoff;
  if (!Object.values(comparable).every(Number.isFinite)) {
    validity.nonFiniteComparableFields++;
  }
  if (raw.physicalControl === 'none') {
    if (raw.possession !== null || raw.attackingExitOptionCount !== null) {
      validity.rawNullFieldsOverwritten++;
      validity.unsupportedFilledWithZero++;
    }
    if (
      comparable.physicalControlValue !== 0
      || comparable.ownExecutableExitOptions !== 0
    ) validity.missingComparableVectors++;
  }
  const macroVariants = ([-1, 0, 1] as const).map((macroPossessionSide) =>
    projectComparablePassPayoffV1({ ...raw, macroPossessionSide }));
  if (
    JSON.stringify(macroVariants[0]) !== JSON.stringify(macroVariants[1])
    || JSON.stringify(macroVariants[1]) !== JSON.stringify(macroVariants[2])
  ) validity.macroPossessionProjectionReads++;
  if (
    raw.currentPlayableProgressionMetres === null
    && comparable.actionProgressionMetres !== raw.lastPlayableProgressionMetres
  ) validity.deadResetPositionReads++;
  if (
    raw.authority === 'absorbedAdministrativeTerminal'
    && (!raw.finished || raw.phase !== 'fulltime' || raw.observedSimTime >= raw.authoritySimTime)
  ) validity.administrativeTerminalUnsupported++;
};

interface PairPilotResult {
  relationH0: PayoffRelation;
  relationH1: PayoffRelation;
  xH0: number;
  xH1: number;
}

const pairIds = new Set<number>();
const childSeeds = new Map<number, string>();
const h0Relations = relations();
const h1Relations = relations();
const chosenAnatomy = anatomy();
const alternativeAnatomy = anatomy();
const pairResults: PairPilotResult[] = [];
let discoveredPairs = 0;
let lastSeedVisited = PILOT_SEED_START;

const addAnatomy = (
  target: Record<AnatomyOutcome, number>,
  record: OracleV2BranchRecord,
): void => {
  if (record.firstTransition.status === 'resolved') {
    target[record.firstTransition.outcome!]++;
  } else {
    target.administrativeCensor++;
  }
};

const runPair = (
  matchSeed: number,
  frozen: Match,
  passerGid: number,
  chosenTargetGid: number,
  alternativeTargetGid: number,
  side: Side,
): void => {
  const pairId = hashSeed(
    matchSeed,
    frozen.simTick,
    passerGid,
    chosenTargetGid,
    alternativeTargetGid,
  );
  if (pairIds.has(pairId)) validity.pairIdCollisions++;
  pairIds.add(pairId);
  const frozenRngState = readRngState(frozen);
  const chosenValues: ComparablePassPayoffV1[] = [];
  const alternativeValues: ComparablePassPayoffV1[] = [];
  let replicateZeroChosen: OracleV2BranchRecord | null = null;
  let replicateZeroAlternative: OracleV2BranchRecord | null = null;

  for (let replicate = 0; replicate < REPLICATES; replicate++) {
    const childSeed = canonicalSeed(hashSeed(
      S7E_NAMESPACE,
      frozenRngState,
      pairId,
      replicate,
    ));
    const childIdentity = `${pairId}:${replicate}`;
    const priorIdentity = childSeeds.get(childSeed);
    if (priorIdentity !== undefined && priorIdentity !== childIdentity) {
      validity.rngCollisions++;
    } else {
      childSeeds.set(childSeed, childIdentity);
    }
    const common = {
      frozen,
      passerGid,
      side,
      childRngState: childSeed,
      includeTransitionDiagnostic: false,
    };
    const chosen = runOracleV2Branch({
      ...common,
      targetGid: chosenTargetGid,
      branch: 'chosen',
    });
    const alternative = runOracleV2Branch({
      ...common,
      targetGid: alternativeTargetGid,
      branch: 'alternative',
    });
    if (!chosen.ok || !alternative.ok) {
      validity.forceFailures++;
      continue;
    }
    validateRecord(chosen.record);
    validateRecord(alternative.record);
    addAnatomy(chosenAnatomy, chosen.record);
    addAnatomy(alternativeAnatomy, alternative.record);
    chosenValues.push(chosen.record.payoffFromKick3s.comparable);
    alternativeValues.push(alternative.record.payoffFromKick3s.comparable);
    if (replicate === 0) {
      replicateZeroChosen = chosen.record;
      replicateZeroAlternative = alternative.record;
    }
  }

  if (
    chosenValues.length !== REPLICATES
    || alternativeValues.length !== REPLICATES
  ) {
    validity.missingComparableVectors++;
    return;
  }
  for (const dimension of COMPARABLE_PAYOFF_DIMENSIONS) {
    const chosenDenominator = chosenValues.filter((value) =>
      Number.isFinite(value[dimension])).length;
    const alternativeDenominator = alternativeValues.filter((value) =>
      Number.isFinite(value[dimension])).length;
    if (
      chosenDenominator !== REPLICATES
      || alternativeDenominator !== REPLICATES
    ) validity.perDimensionDenominatorMismatch++;
  }

  // Pre-registered deterministic audit: replicate 0, both branches, every pair.
  const rerunSeed = canonicalSeed(hashSeed(S7E_NAMESPACE, frozenRngState, pairId, 0));
  const rerunCommon = {
    frozen,
    passerGid,
    side,
    childRngState: rerunSeed,
    includeTransitionDiagnostic: false,
  };
  const rerunChosen = runOracleV2Branch({
    ...rerunCommon,
    targetGid: chosenTargetGid,
    branch: 'chosen',
  });
  const rerunAlternative = runOracleV2Branch({
    ...rerunCommon,
    targetGid: alternativeTargetGid,
    branch: 'alternative',
  });
  if (
    !rerunChosen.ok
    || !rerunAlternative.ok
    || JSON.stringify(rerunChosen.record) !== JSON.stringify(replicateZeroChosen)
    || JSON.stringify(rerunAlternative.record) !== JSON.stringify(replicateZeroAlternative)
  ) validity.deterministicRerunDifferences++;

  const relationH0 = compareComparablePassPayoffs(
    meanComparablePassPayoffs(alternativeValues.slice(0, HALF_REPLICATES)),
    meanComparablePassPayoffs(chosenValues.slice(0, HALF_REPLICATES)),
  );
  const relationH1 = compareComparablePassPayoffs(
    meanComparablePassPayoffs(alternativeValues.slice(HALF_REPLICATES)),
    meanComparablePassPayoffs(chosenValues.slice(HALF_REPLICATES)),
  );
  h0Relations[relationH0]++;
  h1Relations[relationH1]++;
  pairResults.push({
    relationH0,
    relationH1,
    xH0: relationX(relationH0),
    xH1: relationX(relationH1),
  });
};

outer:
for (let seed = PILOT_SEED_START; seed <= PILOT_SEED_END; seed++) {
  lastSeedVisited = seed;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  let previousPass = match.pendingPass;
  while (!match.finished) {
    const owner = match.phase === 'playing' ? match.ball.owner : null;
    const frozen = owner && owner.decisionTimer <= 0 && owner.kickCooldown <= 0
      ? cloneSimulationState(match)
      : null;
    const frozenOwnerGid = owner?.gid ?? null;

    match.step(DT);
    const pass = match.pendingPass;
    const freshOrdinary = pass !== previousPass
      && pass
      && match.lastPassKind?.kind === 'pass'
      && match.lastPassKind.t === pass.t
      && frozen
      && frozen.phase === 'playing'
      && frozenOwnerGid === pass.passerGid;
    if (freshOrdinary) {
      const values = passValues(frozen, pass.passerGid);
      const chosen = values.find((value) => value.targetGid === pass.targetGid);
      if (chosen) {
        const alternatives = values.filter((value) =>
          value.targetGid !== chosen.targetGid
          && comparePassNextStates(value, chosen) === 'leftDominates');
        for (const alternative of alternatives) {
          discoveredPairs++;
          runPair(
            seed,
            frozen,
            pass.passerGid,
            pass.targetGid,
            alternative.targetGid,
            frozen.allPlayers[pass.passerGid].side,
          );
          if (discoveredPairs === PILOT_PAIRS) break outer;
        }
      }
    }
    previousPass = pass;
  }
}

const agreement = pairResults.filter((pair) => pair.relationH0 === pair.relationH1).length;
const errors = pairResults.map((pair) => pair.xH0 - pair.xH1);
const errorMean = errors.reduce((sum, value) => sum + value, 0) / Math.max(errors.length, 1);
const errorVariance = errors.length > 1
  ? errors.reduce((sum, value) => sum + (value - errorMean) ** 2, 0) / (errors.length - 1)
  : Infinity;
const mcVarianceAt32 = errorVariance / 2;
const projectedMcSe = Math.sqrt(mcVarianceAt32 / FINAL_PAIR_COUNT);
const projectedHalfWidth = 1.645 * projectedMcSe;
const edge = (half: 'xH0' | 'xH1'): number => pairResults
  .reduce((sum, pair) => sum + pair[half], 0) / Math.max(pairResults.length, 1);
const validityTotal = Object.values(validity).reduce((sum, count) => sum + count, 0);
const antiVacuous = (
  h0Relations.alternativeDominates + h0Relations.chosenDominates > 0
) && (
  h0Relations.equivalent + h0Relations.tradeoff > 0
);
const validityPass = discoveredPairs === PILOT_PAIRS
  && pairResults.length === PILOT_PAIRS
  && validityTotal === 0;
const feasibilityPass = validityPass
  && agreement >= REQUIRED_AGREEMENT
  && projectedHalfWidth <= MAX_PROJECTED_HALF_WIDTH
  && antiVacuous;

console.log('S7e-0C replicated oracle ceiling — independent pilot');
console.log(
  `seeds ${PILOT_SEED_START}-${PILOT_SEED_END} · last visited ${lastSeedVisited} · `
  + `pairs ${discoveredPairs}/${PILOT_PAIRS} · 64 continuations/action`,
);
for (const [label, value] of [['H0', h0Relations], ['H1', h1Relations]] as const) {
  console.log(
    `${label} relations alt/chosen/equivalent/tradeoff `
    + `${value.alternativeDominates}/${value.chosenDominates}/`
    + `${value.equivalent}/${value.tradeoff}`,
  );
}
console.log(
  `dominance edge H0/H1 ${(edge('xH0') * 100).toFixed(2)}pp/`
  + `${(edge('xH1') * 100).toFixed(2)}pp`,
);
console.log(
  `split-half agreement ${agreement}/${PILOT_PAIRS} (gate ${REQUIRED_AGREEMENT}) · `
  + `projected MC half-width ${(projectedHalfWidth * 100).toFixed(3)}pp `
  + `(gate ${(MAX_PROJECTED_HALF_WIDTH * 100).toFixed(2)}pp) · `
  + `anti-vacuity ${antiVacuous ? 'yes' : 'NO'}`,
);
console.log(
  `transition anatomy chosen ${JSON.stringify(chosenAnatomy)}\n`
  + `transition anatomy alternative ${JSON.stringify(alternativeAnatomy)}`,
);
console.log(
  `validity ${validityPass ? 'PASS' : 'FAIL'} · `
  + (Object.keys(validity) as Array<keyof typeof validity>)
    .map((key) => `${key}=${validity[key]}`)
    .join(' · '),
);
console.log(
  `pilotFeasibility ${feasibilityPass ? 'PASS' : validityPass ? 'INCONCLUSIVE' : 'FAIL'}`,
);

if (!validityPass) process.exitCode = 1;
else if (!feasibilityPass) process.exitCode = 2;
