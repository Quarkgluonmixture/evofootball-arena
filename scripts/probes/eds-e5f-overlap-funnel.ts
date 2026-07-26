// EDS E5f — THE OVERLAP FUNNEL: WHERE DOES THE COLLAPSE HAPPEN?
// Authority: docs/world-model/EDS-E5F-OVERLAP-FUNNEL.md
//
// Phase 0 (b) put the collapse UPSTREAM of the choice: at the moments his
// licence fires the overlap runner is already the top-priced option, and his
// forks land in the middle third, not attacking-wide. Yet the counter reads
// 0.516x on six leagues. Upstream has stages, and this counts them.
//
// Counting only — no forks, no cloning, no src/**. The expensive instrument
// already answered the choice-seat question; what is left is bookkeeping.
//
// The one thing to be careful about is that this instrument touches the world
// it measures (manual stepping; perceivedSnapshot() called at ticks the brain
// would not have called it). P0 is the guard: F4 must come back equal to part
// (a)'s banked integers, per cluster per arm, or the run is INVALID.
import { createHash } from 'node:crypto';
import { passChoiceCandidateGids, pricePassOption } from '../../src/ai/perceivedPassChoice';
import { League } from '../../src/sim/League';
import type { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { DT } from '../../src/sim/constants';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2, §4) ------------------------------------
const LEAGUE_SEEDS = [20260702, 20260801, 20260802, 20260803, 20260804, 20260805] as const;
const SEASONS = Number(process.argv[2] ?? 24);
/** P0: part (a)'s banked release counts, per cluster, per arm. */
const P0_BANKED = {
  matches: 1704,
  off: [158, 156, 186, 101, 287, 163],
  value: [74, 65, 82, 66, 126, 129],
} as const;
const P2_F2_FLOOR = 300; // pooled OFF-arm F2 assignments
const OVERLAP_MIN_ABS_Y = 9; // the come-around, PlayerBrain.ts verbatim
const OVERLAP_MIN_LOCAL_X_GAIN = -6;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50002; // frozen

type InfoClass = 'READ' | 'SEEN-UNREAD' | 'UNSEEN';

interface Assignment {
  /** F1 is implied — an assignment exists. */
  f2LicenceActive: boolean;
  f3Released: boolean;
  f4Counted: boolean;
  /** F2-active ticks by the holder's read of the runner (VALUE arm only). */
  readTicks: number;
  seenUnreadTicks: number;
  unseenTicks: number;
  unclassifiedTicks: number;
  everRead: boolean;
  /** Context (§3.2): the team's possession and passing while he is live. */
  possessionTicks: number;
  passesCompleted: number;
  liveTicks: number;
}

const emptyAssignment = (): Assignment => ({
  f2LicenceActive: false, f3Released: false, f4Counted: false,
  readTicks: 0, seenUnreadTicks: 0, unseenTicks: 0, unclassifiedTicks: 0, everRead: false,
  possessionTicks: 0, passesCompleted: 0, liveTicks: 0,
});

interface ArmTotals {
  matches: number;
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  /** F4 as the sim's own counter, so P0 compares like with like. */
  counterOverlaps: number;
  readTicks: number;
  seenUnreadTicks: number;
  unseenTicks: number;
  unclassifiedTicks: number;
  /** F2 assignments split by whether he was ever aimable, and their F3s. */
  f2EverRead: number;
  f3EverRead: number;
  f2NeverRead: number;
  f3NeverRead: number;
  possessionTicks: number;
  passesCompleted: number;
  liveTicks: number;
}

const emptyTotals = (): ArmTotals => ({
  matches: 0, f1: 0, f2: 0, f3: 0, f4: 0, counterOverlaps: 0,
  readTicks: 0, seenUnreadTicks: 0, unseenTicks: 0, unclassifiedTicks: 0,
  f2EverRead: 0, f3EverRead: 0, f2NeverRead: 0, f3NeverRead: 0,
  possessionTicks: 0, passesCompleted: 0, liveTicks: 0,
});

const bank = (into: ArmTotals, assignment: Assignment): void => {
  into.f1 += 1;
  into.readTicks += assignment.readTicks;
  into.seenUnreadTicks += assignment.seenUnreadTicks;
  into.unseenTicks += assignment.unseenTicks;
  into.unclassifiedTicks += assignment.unclassifiedTicks;
  into.possessionTicks += assignment.possessionTicks;
  into.passesCompleted += assignment.passesCompleted;
  into.liveTicks += assignment.liveTicks;
  if (!assignment.f2LicenceActive) return;
  into.f2 += 1;
  if (assignment.everRead) into.f2EverRead += 1; else into.f2NeverRead += 1;
  if (assignment.f3Released) {
    into.f3 += 1;
    if (assignment.everRead) into.f3EverRead += 1; else into.f3NeverRead += 1;
  }
  if (assignment.f4Counted) into.f4 += 1;
};

/** The full legacy release predicate — the come-around, `PlayerBrain.ts`. */
const licenceActive = (team: Team, holder: Player, runner: Player): boolean => {
  if (!passChoiceCandidateGids(holder, team.players).includes(runner.gid)) return false;
  if (Math.abs(runner.pos.y) <= OVERLAP_MIN_ABS_Y) return false;
  return team.localX(runner.pos.x) > team.localX(holder.pos.x) + OVERLAP_MIN_LOCAL_X_GAIN;
};

/**
 * The runner's information class in the HOLDER's own snapshot. VALUE arm only:
 * with the flags off there are no perception memories and this returns null,
 * which is the honest answer rather than a fabricated class.
 */
const classOf = (
  match: Match, team: Team, holder: Player, runner: Player,
): InfoClass | null => {
  // `PlayerBrain.ts`'s own scope, verbatim: the passer, his candidate window,
  // and every opponent still on the pitch. A narrower scope would change the
  // corridor read and therefore the class, which is the thing being measured.
  const candidateGids = passChoiceCandidateGids(holder, team.players);
  const scope = new Set<number>([holder.gid, ...candidateGids]);
  for (const other of match.teams[1 - team.side].players) {
    if (!other.sentOff) scope.add(other.gid);
  }
  const snapshot = match.perceivedSnapshot(holder, scope);
  if (snapshot === null) return null;
  // The deployed pricing function decides the class; re-deriving it here would
  // be a second implementation of the thing under measurement.
  return pricePassOption({
    snapshot,
    passerGid: holder.gid,
    targetGid: runner.gid,
    attackDir: team.attackDir,
    reachProfiles: match.reachProfiles(),
    valueAxis: match.edsValueAxis,
  }).infoClass;
};

/**
 * One league arm, stepped by hand so the funnel can be observed between ticks.
 * `getResult()` is what `runToCompletion` would have handed back.
 */
const runLeagueArm = (seed: number, valueAxis: boolean): ArmTotals => {
  const league = new League({ seed });
  if (valueAxis) {
    league.matchFlags = {
      edsPerceivedDefence: true,
      edsPerceivedChoice: true,
      edsValueAxis: true,
      traceChoice: false,
    };
  }
  const totals = emptyTotals();
  for (let season = 0; season < SEASONS; season++) {
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      // Per side: the open assignment, the index it belongs to, and the
      // counter's value when the span opened.
      const open: (Assignment | null)[] = [null, null];
      const openIndex: (number | null)[] = [null, null];
      const openOverlaps: number[] = [0, 0];
      const closeSpan = (side: 0 | 1, team: Team) => {
        const assignment = open[side];
        if (assignment === null) return;
        assignment.f4Counted = team.stats.overlaps > openOverlaps[side];
        bank(totals, assignment);
        open[side] = null;
        openIndex[side] = null;
      };
      while (!match.finished) {
        for (const side of [0, 1] as const) {
          const team = match.teams[side];
          const index = team.overlapper;
          if (index !== openIndex[side]) {
            closeSpan(side, team);
            if (index !== null) {
              open[side] = emptyAssignment();
              openIndex[side] = index;
              openOverlaps[side] = team.stats.overlaps;
            }
          }
          const assignment = open[side];
          if (assignment === null || index === null) continue;
          assignment.liveTicks += 1;
          const runner = team.players[index];
          const holder = match.ball.owner;
          if (holder === null || holder.side !== side) continue;
          assignment.possessionTicks += 1;
          if (holder.gid === runner.gid) continue;
          if (!licenceActive(team, holder, runner)) continue;
          assignment.f2LicenceActive = true;
          const infoClass = classOf(match, team, holder, runner);
          if (infoClass === 'READ') { assignment.readTicks += 1; assignment.everRead = true; }
          else if (infoClass === 'SEEN-UNREAD') assignment.seenUnreadTicks += 1;
          else if (infoClass === 'UNSEEN') assignment.unseenTicks += 1;
          else assignment.unclassifiedTicks += 1;
        }
        // F3: a release TO the licensed runner during his span.
        for (const side of [0, 1] as const) {
          const assignment = open[side];
          const index = openIndex[side];
          if (assignment === null || index === null) continue;
          const pending = match.pendingPass;
          if (pending && pending.targetGid === match.teams[side].players[index].gid) {
            assignment.f3Released = true;
          }
        }
        const before = [match.teams[0].stats.passesCompleted, match.teams[1].stats.passesCompleted];
        match.step(DT);
        for (const side of [0, 1] as const) {
          const assignment = open[side];
          if (assignment === null) continue;
          assignment.passesCompleted += match.teams[side].stats.passesCompleted - before[side];
        }
      }
      for (const side of [0, 1] as const) closeSpan(side, match.teams[side]);
      const result = match.getResult();
      league.applyResult(fixture, result);
      totals.matches += 1;
      for (const stat of result.stats) totals.counterOverlaps += stat.overlaps;
    }
    league.finishSeason();
  }
  return totals;
};

// --- intervals (ruling #20: the cluster unit is the LEAGUE SEED) ------------
const clusterBootstrapCI = (
  clusters: readonly { readonly on: number; readonly off: number }[], offset: number,
) => {
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const ratios: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let on = 0;
    let off = 0;
    for (let index = 0; index < clusters.length; index++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      on += pick.on;
      off += pick.off;
    }
    ratios.push(off === 0 ? Number.NaN : on / off);
  }
  ratios.sort((left, right) => left - right);
  const at = (q: number) => ratios[Math.min(ratios.length - 1,
    Math.max(0, Math.floor(q * (ratios.length - 1))))];
  return { lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

const poissonRatioCI = (kOn: number, kOff: number) => {
  const total = kOn + kOff;
  const ratio = kOff === 0 ? Number.NaN : kOn / kOff;
  if (total === 0) return { ratio, lower: Number.NaN, upper: Number.NaN };
  const z = 1.959963984540054;
  const share = kOn / total;
  const denominator = 1 + (z * z) / total;
  const centre = (share + (z * z) / (2 * total)) / denominator;
  const spread = (z * Math.sqrt((share * (1 - share)) / total
    + (z * z) / (4 * total * total))) / denominator;
  const low = Math.max(0, centre - spread);
  const high = Math.min(1, centre + spread);
  return { ratio, lower: low / (1 - low), upper: high === 1 ? Infinity : high / (1 - high) };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const STAGES = ['f1', 'f2', 'f3', 'f4'] as const;
type Stage = typeof STAGES[number];

const runExperiment = () => {
  const clusters = LEAGUE_SEEDS.map((seed) => ({
    seed,
    off: runLeagueArm(seed, false),
    value: runLeagueArm(seed, true),
  }));

  // P0: the instrument is inert, or nothing below means anything.
  const p0 = clusters.every((cluster, index) => (
    cluster.off.matches === P0_BANKED.matches
    && cluster.value.matches === P0_BANKED.matches
    && cluster.off.counterOverlaps === P0_BANKED.off[index]
    && cluster.value.counterOverlaps === P0_BANKED.value[index]
  ));
  // P1: a funnel that grows downstream is a coding error, not a finding.
  const p1 = clusters.every((cluster) => [cluster.off, cluster.value].every((arm) => (
    arm.f1 >= arm.f2 && arm.f2 >= arm.f3 && arm.f3 >= arm.f4
  )));
  const p2 = clusters.reduce((sum, cluster) => sum + cluster.off.f2, 0) >= P2_F2_FLOOR;

  const stageReport = (stage: Stage, offset: number) => {
    const rows = clusters.map((cluster) => ({
      seed: cluster.seed, off: cluster.off[stage], on: cluster.value[stage],
    }));
    const on = rows.reduce((sum, row) => sum + row.on, 0);
    const off = rows.reduce((sum, row) => sum + row.off, 0);
    const pooled = poissonRatioCI(on, off);
    return {
      stage,
      off,
      on,
      offPerMatch: off / (clusters.length * P0_BANKED.matches),
      onPerMatch: on / (clusters.length * P0_BANKED.matches),
      ratio: pooled.ratio,
      pooledCI: { lower: pooled.lower, upper: pooled.upper },
      clusterCI: clusterBootstrapCI(rows, offset),
      perCluster: rows.map((row) => ({
        ...row, ratio: row.off === 0 ? Number.NaN : row.on / row.off,
      })),
    };
  };

  const stages = STAGES.map((stage, index) => stageReport(stage, index));
  const sum = (pick: (arm: ArmTotals) => number, valueArm: boolean) => clusters
    .reduce((total, cluster) => total + pick(valueArm ? cluster.value : cluster.off), 0);

  const conditional = (numerator: Stage, denominator: Stage) => {
    const offRate = sum((arm) => arm[numerator], false) / Math.max(sum((arm) => arm[denominator], false), 1);
    const onRate = sum((arm) => arm[numerator], true) / Math.max(sum((arm) => arm[denominator], true), 1);
    return { transition: `${denominator}->${numerator}`, off: offRate, on: onRate, ratio: onRate / offRate };
  };

  // §3.1: the decomposition, VALUE arm.
  const valueTicks = {
    read: sum((arm) => arm.readTicks, true),
    seenUnread: sum((arm) => arm.seenUnreadTicks, true),
    unseen: sum((arm) => arm.unseenTicks, true),
    unclassified: sum((arm) => arm.unclassifiedTicks, true),
  };
  const releaseBy = (valueArm: boolean) => ({
    everRead: {
      f2: sum((arm) => arm.f2EverRead, valueArm),
      f3: sum((arm) => arm.f3EverRead, valueArm),
      rate: sum((arm) => arm.f3EverRead, valueArm)
        / Math.max(sum((arm) => arm.f2EverRead, valueArm), 1),
    },
    neverRead: {
      f2: sum((arm) => arm.f2NeverRead, valueArm),
      f3: sum((arm) => arm.f3NeverRead, valueArm),
      rate: sum((arm) => arm.f3NeverRead, valueArm)
        / Math.max(sum((arm) => arm.f2NeverRead, valueArm), 1),
    },
  });

  return {
    experiment: 'EDS-E5f',
    authority: 'EDS-E5F-OVERLAP-FUNNEL',
    parameters: {
      leagueSeeds: LEAGUE_SEEDS,
      seasons: SEASONS,
      clusterUnit: 'league seed',
      banked: P0_BANKED,
      f2Floor: P2_F2_FLOOR,
      bootstrapResamples: BOOTSTRAP_RESAMPLES,
      bootstrapSeed: BOOTSTRAP_SEED,
    },
    stages,
    conditionals: [conditional('f2', 'f1'), conditional('f3', 'f2'), conditional('f4', 'f3')],
    decomposition: {
      valueArmF2Ticks: valueTicks,
      releaseByClass: { value: releaseBy(true), off: releaseBy(false) },
    },
    context: {
      off: {
        possessionTicksPerAssignment: sum((arm) => arm.possessionTicks, false) / Math.max(sum((arm) => arm.f1, false), 1),
        passesPerAssignment: sum((arm) => arm.passesCompleted, false) / Math.max(sum((arm) => arm.f1, false), 1),
        liveTicksPerAssignment: sum((arm) => arm.liveTicks, false) / Math.max(sum((arm) => arm.f1, false), 1),
      },
      value: {
        possessionTicksPerAssignment: sum((arm) => arm.possessionTicks, true) / Math.max(sum((arm) => arm.f1, true), 1),
        passesPerAssignment: sum((arm) => arm.passesCompleted, true) / Math.max(sum((arm) => arm.f1, true), 1),
        liveTicksPerAssignment: sum((arm) => arm.liveTicks, true) / Math.max(sum((arm) => arm.f1, true), 1),
      },
    },
    perCluster: clusters,
    gates: { p0, p1, p2 },
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, p3Deterministic: deterministic };
const output = {
  ...first,
  gates,
  sha256,
  // A MEASUREMENT step (contract §4): INVALID only on the pins.
  verdict: gates.p0 && gates.p1 && gates.p3Deterministic ? 'MEASURED' : 'INVALID',
};
console.log(JSON.stringify(output, null, 2));
const stage = (name: Stage) => output.stages.find((entry) => entry.stage === name)!;
console.error(
  `EDS-E5f ${output.verdict}`
  + ` · P0 ${output.gates.p0} P1 ${output.gates.p1} P2 ${output.gates.p2}`
  + STAGES.map((name) => {
    const row = stage(name);
    return ` · ${name.toUpperCase()} ${row.off}→${row.on} ${row.ratio.toFixed(3)}x`
      + ` [${row.clusterCI.lower.toFixed(3)}, ${row.clusterCI.upper.toFixed(3)}]`;
  }).join('')
  + ` · cond ${output.conditionals.map((c) => `${c.transition} ${(c.off * 100).toFixed(1)}%→${(c.on * 100).toFixed(1)}% (${c.ratio.toFixed(3)}x)`).join(' ')}`
  + ` · VALUE F2 ticks READ ${output.decomposition.valueArmF2Ticks.read}`
  + ` / SEEN-UNREAD ${output.decomposition.valueArmF2Ticks.seenUnread}`
  + ` / UNSEEN ${output.decomposition.valueArmF2Ticks.unseen}`
  + ` · F3|everRead ${(output.decomposition.releaseByClass.value.everRead.rate * 100).toFixed(1)}%`
  + ` (n=${output.decomposition.releaseByClass.value.everRead.f2})`
  + ` vs F3|neverRead ${(output.decomposition.releaseByClass.value.neverRead.rate * 100).toFixed(1)}%`
  + ` (n=${output.decomposition.releaseByClass.value.neverRead.f2})`
  + ` · SHA ${sha256}`,
);
