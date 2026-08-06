/**
 * A4 PLAY-TEST ENTRY (commander ruling #155) — the CERTIFIED PRIOR WORLD as a
 * player-facing, explicitly-opt-in switch.
 *
 * Slice 1 of the world-model programme closed with H-A4.1 AFFIRMED on the
 * amended ruler (#154): a coarse, WEAK, whole-team home agreement — 野球开场
 * 三十秒, at whisper volume — lets the eye-consuming team concede resolvedly
 * fewer deep AND box entries. Watchability, though, has no instrument: by the
 * #152 amendment the shape verdict belongs to the USER'S EYES. This module is
 * how that world reaches a live, watchable match.
 *
 * **The idiom is E4-PREP's** (`edsPreview.ts`, rulings #14.3 / #22.5): a closed,
 * audited arm expressed as a sticky user choice, pushed onto `League.matchFlags`
 * for matches started from now on, default OFF, nothing shipped. This module
 * adds the two things the EDS preview never needed — the eye CONFIG (a
 * post-construction `Match.stationEye` assignment) and the obedience GENE on
 * both teams — because the certified arm is not expressible as construction
 * flags alone.
 *
 * THE ARMED WORLD = the `PRIOR` arm of `scripts/probes/a4-p3prime-replication.ts`,
 * flag for flag (that probe is the fidelity source):
 *   • the ENRICHED substrate the v3 table + merged children were censused on
 *     (`A4_WORLD_FLAGS`, the probe's `CENSUS_FLAGS` verbatim);
 *   • the eye: `arm:'neutral'`, `scope:{kind:'both'}`, `table:{}`,
 *     `v3:{roleTable, control, children, mergedTableSha}` (the P3p-1 merged
 *     artifact) and `v4:{inSupportLaw, deliveryBit, offsideBit, homePrior}`;
 *   • the whisper prior: `homePriorObedience = 0.5` on BOTH teams' genomes
 *     (the fixture idiom — `info.genome` / `baseGenome` / `effGenome`), which
 *     is `homePriorStrength(0.5) = 0.25×VAL_SCALE = 0.040874`, the #148
 *     certified primary dose.
 *
 * DEFAULT OFF EVERYWHERE. With the entry off nothing here is imported at
 * runtime beyond this module's own constants (the ~440 kB census tables are a
 * DYNAMIC import, so a player who never opts in never downloads them), no
 * construction flag changes, no `stationEye` is assigned, no gene is written —
 * the production fingerprint `57b0bdab…c673` is untouched. Road B, unchanged.
 *
 * ⚠ The tables are, for the first time, reachable from `src/**` — the probe
 * header's "never bundled in src/**" rule was about the SIM never carrying a
 * table into production, and it still does not: the import lives behind the
 * opt-in in an async chunk, and `Match.stationEye` stays null unless the user
 * arms this. Ruling #155.2(ii) authorizes the bundling explicitly.
 */

import type { Match } from '../sim/Match';
import type { Side } from '../sim/types';
import type { TacticalGenome } from '../evolution/genome';
import type {
  MergedChildTable, RoleConditionedTable, RoleControlLevels,
} from '../ai/stationEye';

export const A4_WORLD_KEY = 'evo:a4World';
/** `?a4world=1` arms, `?a4world=0` disarms — the phone entry (see A4-PLAYTEST.md). */
export const A4_WORLD_PARAM = 'a4world';

/**
 * The ENRICHED world's construction flags — `CENSUS_FLAGS` from the P3′ probe,
 * verbatim. This is the substrate the v3 role table and the merged children
 * were censused on (#67.3); the eye prices candidates against levels recovered
 * in THIS world, so arming the eye in any other world is off-census.
 */
export const A4_WORLD_FLAGS = {
  edsPerceivedDefence: true,
  edsPerceivedChoice: true,
  edsValueAxis: true,
  c5Hold: true,
  c6Carry: true,
  c7Windup: true,
  c5TouchFork: false,
} as const;

/** The #148 certified PRIMARY dose: homePriorStrength(0.5) = 0.25×VAL_SCALE. */
export const A4_OBEDIENCE = 0.5;

/** The P3p-1 merged artifact's own SHA (X-MERGE-SHA's expectation). */
export const A4_MERGED_SHA =
  '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
/** The v3 base table's SHA — the merged file's `base` must still be this table. */
export const A4_BASE_SHA =
  '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
/** The v3 control-recovery artifact's declared SHA. */
export const A4_CONTROL_SHA =
  '968349ff52313df6ce6fe42683faff64b7509d32c108b7b40010c129e18acc1c';

/** The census artifacts the armed world needs, as loaded. */
export interface A4Tables {
  readonly roleTable: RoleConditionedTable;
  readonly control: RoleControlLevels;
  readonly children: MergedChildTable;
  readonly mergedTableSha: string;
  readonly controlSha: string;
}

type EyeConfig = NonNullable<Match['stationEye']>;

/**
 * The PRIOR arm's eye, built from loaded tables — `armEye('PRIOR', …)` of
 * `scripts/probes/a4-p3prime-replication.ts`, field for field. Pure.
 */
export function a4EyeConfig(tables: A4Tables): EyeConfig {
  return {
    arm: 'neutral',
    scope: { kind: 'both' },
    table: {},
    v3: {
      roleTable: tables.roleTable,
      control: tables.control,
      children: tables.children,
      mergedTableSha: tables.mergedTableSha,
    },
    v4: {
      inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: true,
    },
  };
}

/**
 * Set the obedience gene on ALL the genome references a team reads through the
 * match — `info.genome` / `baseGenome` / `effGenome` share one object at
 * construction, but mentality/underdog rebuilds spread from `baseGenome`, so
 * all three are written (a4HomePriorGene.test.ts / the P3′ probe, verbatim).
 */
export function setA4Obedience(match: Match, side: Side, v: number): void {
  const team = match.teams[side];
  (team.info.genome as TacticalGenome).homePriorObedience = v;
  (team.baseGenome as TacticalGenome).homePriorObedience = v;
  (team.effGenome as TacticalGenome).homePriorObedience = v;
}

/**
 * Arm a freshly constructed match with the certified PRIOR world: the eye on
 * BOTH sides plus the whisper prior on BOTH genomes. Never called unless the
 * user opted in; a match already in flight keeps the brain it kicked off with
 * (the E4 rule — that is also what keeps the A/B clean).
 */
export function armA4World(match: Match, tables: A4Tables): void {
  match.stationEye = a4EyeConfig(tables);
  setA4Obedience(match, 0, A4_OBEDIENCE);
  setA4Obedience(match, 1, A4_OBEDIENCE);
}

/** Does this match carry exactly the certified PRIOR configuration? */
export function isA4Armed(match: Match): boolean {
  const eye = match.stationEye;
  return eye !== null
    && eye.v4?.homePrior === true
    && eye.v3?.mergedTableSha === A4_MERGED_SHA
    && (match.teams[0].effGenome as TacticalGenome).homePriorObedience === A4_OBEDIENCE
    && (match.teams[1].effGenome as TacticalGenome).homePriorObedience === A4_OBEDIENCE;
}

/* ---------------- the user's choice (sticky + URL) ---------------- */

const readStored = (): boolean => {
  try {
    return localStorage.getItem(A4_WORLD_KEY) === '1';
  } catch {
    return false; // private mode / no storage
  }
};

/** `?a4world=1` / `?a4world=0`, or null when the param is absent/unparseable. */
export function a4UrlOverride(search: string): boolean | null {
  try {
    const raw = new URLSearchParams(search).get(A4_WORLD_PARAM);
    if (raw === null) return null;
    if (raw === '1' || raw === 'true' || raw === 'on') return true;
    if (raw === '0' || raw === 'false' || raw === 'off') return false;
    return null;
  } catch {
    return null;
  }
}

/**
 * The user's choice: the URL param wins for this load (and sticks, so the
 * phone link only has to be opened once), otherwise the sticky value, and OFF
 * on anything unexpected or any environment without storage.
 */
export function readA4World(): boolean {
  let override: boolean | null = null;
  try {
    override = typeof location === 'undefined' ? null : a4UrlOverride(location.search);
  } catch {
    override = null;
  }
  if (override !== null) {
    writeA4World(override);
    return override;
  }
  return readStored();
}

export function writeA4World(on: boolean): void {
  try {
    if (on) localStorage.setItem(A4_WORLD_KEY, '1');
    else localStorage.removeItem(A4_WORLD_KEY);
  } catch { /* the choice still applies for this session */ }
}

/* ---------------- the census artifacts (async, opt-in only) ---------------- */

interface MergedTableFile {
  readonly mergedTableSha: string;
  readonly baseTableSha?: string;
  readonly base: RoleConditionedTable;
  readonly children: MergedChildTable;
}
interface ControlFile {
  readonly control: RoleControlLevels;
  readonly sha256: string;
}

let pending: Promise<A4Tables> | null = null;

/**
 * Load the P3p-1 merged table + the v3 control recovery. DYNAMIC on purpose:
 * ~440 kB of census JSON becomes its own async chunk that a player who never
 * arms the entry never fetches. Cached — the artifacts are frozen files.
 *
 * The declared SHAs are checked as an IDENTITY guard (X-MERGE-IDENT's cheap
 * half): if the artifact under these paths is ever swapped, the entry refuses
 * to arm rather than quietly play a different world. The full rehash stays in
 * the probes and in `tests/a4PlaytestEntry.test.ts`, where node's crypto is.
 */
export async function loadA4Tables(): Promise<A4Tables> {
  pending ??= (async (): Promise<A4Tables> => {
    const [merged, ctrl] = await Promise.all([
      import('../../docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json'),
      import('../../docs/world-model/data/stage3-v3-p2-control-recovery.json'),
    ]);
    const m = (merged as unknown as { default: MergedTableFile }).default;
    const c = (ctrl as unknown as { default: ControlFile }).default;
    if (m.mergedTableSha !== A4_MERGED_SHA) {
      throw new Error(`A4 world: merged table SHA mismatch (${m.mergedTableSha})`);
    }
    if (m.baseTableSha !== undefined && m.baseTableSha !== A4_BASE_SHA) {
      throw new Error(`A4 world: base table SHA mismatch (${m.baseTableSha})`);
    }
    if (c.sha256 !== A4_CONTROL_SHA) {
      throw new Error(`A4 world: control SHA mismatch (${c.sha256})`);
    }
    return {
      roleTable: m.base,
      control: c.control,
      children: m.children,
      mergedTableSha: m.mergedTableSha,
      controlSha: c.sha256,
    };
  })();
  try {
    return await pending;
  } catch (err) {
    pending = null; // a failed fetch must not poison the next attempt
    throw err;
  }
}
