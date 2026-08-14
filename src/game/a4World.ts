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
 * ⭐ V2 — THE DISCIPLINE WORLD (commander ruling #167.5, S2-P4). The SAME world
 * with one thing added: each squad SLOT gets its own tightness about the opening
 * agreement (后卫紧 · 前锋松) through the S2-P2 offset gene family, frozen at
 * `[0,+.4,+.2,0,−.2,−.4]` on top of the same 0.5 whisper. S2-P3 Leg F proved the
 * gene-expressed world is BYTE-IDENTICAL to the instrument-vector world on all 400
 * seeds, and Leg W passed every football gate. v1 stays available unchanged for the
 * A/B feel; the two are MUTUALLY EXCLUSIVE (one version value, never a blend), and
 * the badge names which one is on screen.
 *
 * ⭐ V3 — 出球前摇 (commander ruling #184.2, on the user's 甲 at #183.5). EXACTLY the
 * v2 world PLUS the O1 cut-1 mechanic `o1PassWindup` on the watched match: a short
 * pass is no longer struck the instant it is decided — the body holds it for a
 * readable wind-up (W ∈ [3,11] ticks, priced by speed / turn / the passer's own
 * `passing`), and only then releases. Certified at scale by O1-T2 (#183): the
 * equilibrium is QUIET inside every frozen band, reception-to-release +0.0425 s
 * RESOLVED, turnovers per watched minute −0.184 RESOLVED — and, disclosed honestly,
 * the spell-length gap moved only 1.7–4.3% (release time was the small half of the
 * tempo disease). One-touch releases, restarts and kickoffs are untouched.
 *
 * ⭐ V4 / V5 — THE MT PLAY-TEST WORLDS, 松盯内收 (commander ruling #211.3). These are
 * NOT A4 worlds: they carry no eye, no whisper, no discipline family. They are the
 * MT-LADDER's own measured arms made watchable — BOTH dormant defensive seams
 * (`pmLaneConvergence` + `mtMarkSag`) armed together, with `defLaneConvergence` and
 * `markSag` written at ONE fixed dose on all three genome views of both teams (the
 * `armGenes` idiom this module gave the probes). v4 = the ruled KNEE 0.2 (the
 * #209.2 fallback dose, the DEFAULT-named world); v5 = the 0.8 CONTRAST world, where
 * the mechanism is visible to the naked eye and the scoreline deflates with it.
 *
 * ⭐ V6 — THE CB PLAY-TEST WORLD, 过人 (commander ruling #269.4, contract §2 M-CB.3). Also
 * NOT an A4 world: no eye, no whisper, no discipline family. It is the CB-T2 battery's own
 * **both-armed** arm made watchable — CB-T0's TWO doors (`cbCommitPhysics` + `cbTouchPast`)
 * and CB-T2's choice seat (`cbChoiceSeat`) armed together, with the born-absent style gene
 * `cbCarryProneness` written at ONE fixed dose on both teams. The carrier can now knock the
 * ball past a man he has committed, and the man who dives in and misses pays the recovery
 * interval his OWN motion model needs.
 *
 * ⭐ THE FIDELITY SOURCE is `scripts/probes/cb-t2-choice-seat.ts`: the `'both'` arm, flag for
 * flag and dose for dose — `...a4MatchFlags(3)` as the substrate (the probe's own line, called
 * here rather than copied) plus `cbChoiceSeat`/`cbTouchPast`/`cbCommitPhysics`, and the probe's
 * `DOSE = 1` on both teams. `stationEye` stays NULL exactly as the probe left it.
 *
 * ⚠ THE DOSE IS PRESENTATION, NOT A WORLD-MODEL CLAIM (#269.4): 1.0 is the value the battery
 * ran at, chosen here as the play form because it is the only dose the arc has measured. What
 * dose (if any) belongs in a shipped world is the user's eyes' question at the gate and the
 * style-evolution arc's afterwards — nothing here claims 1.0 is right.
 *
 * ⚠ THE GENOME VIEWS ARE DE-ALIASED for the CB dose (the DV-T2 `dvLearn` idiom, Match.ts):
 * `cbCarryProneness` is BORN ABSENT and outside `GENE_KEYS`, and `TeamInfo.genome` is the
 * LEAGUE FRANCHISE'S OWN OBJECT — writing the key there would put a dormant gene into the
 * user's save and hand the genome CROSSOVER path a value to carry (it copies parent A's present
 * key even with the opt-in shut). So the dose is written onto MATCH-LOCAL genome views and dies
 * with the match. The A4/MT worlds write real, always-present, always-serialized gene keys and
 * legitimately use the `info.genome` idiom; this one may not.
 *
 * ⚠ FIXED DOSE, NO EVOLUTION. The arming checklists (#196.3-D4) name three channels
 * per seam — flag + evolve opt-in + non-absent gene. A play-test world arms the flag
 * and the gene and deliberately leaves the two opt-ins (`evolveDefLaneConvergence` /
 * `evolveMarkSag`) OFF: they govern mutation and crossover, and a FIXED armed world
 * mutates nothing (the #165.2.ii reading this module already applies to v2). Nothing
 * in the user's league evolves either gene.
 *
 * ⭐ THE FIDELITY SOURCE is `scripts/probes/mt-ladder.ts` + the committed
 * `docs/world-model/data/mt-ladder.json`: v4 is arm **D02** and v5 is arm **D08**,
 * construction flag for construction flag (`MT_WORLD_FLAGS` = the probe's
 * `PERCEPT_FLAGS` plus the two seam flags, and `stationEye` stays NULL exactly as
 * `frozenDesign.world` records) and dose for dose, both teams.
 *
 * ⚠ V3 COMPOSES AT **THIS** LAYER (the #184.2 binding constraint). `A4_WORLD_FLAGS`
 * is the CENSUS-FIDELITY set — the substrate the eye's tables were censused on —
 * and widening it would silently move every world off-census (contract §3 FLAG
 * HYGIENE). So the object stays byte-untouched and v3 is expressed by
 * `a4MatchFlags(3)`, which ADDS `o1PassWindup` on top of that same set for the
 * armed match only. v1/v2 flags are unchanged, to the key.
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

import type { League } from '../sim/League';
import type { Match } from '../sim/Match';
import type { Side } from '../sim/types';
import { homePriorOffsets, setHomePriorOffsets, type TacticalGenome } from '../evolution/genome';
import type {
  MergedChildTable, RoleConditionedTable, RoleControlLevels,
} from '../ai/stationEye';

export const A4_WORLD_KEY = 'evo:a4World';
/**
 * `?a4world=1` arms v1 (the uniform whisper), `?a4world=2` arms v2 (the discipline
 * world), `?a4world=3` arms v3 (v2 + 出球前摇), `?a4world=4` arms the MT knee world
 * (松盯内收 at 0.2), `?a4world=5` its 0.8 contrast, `?a4world=6` arms the CB 过人 world,
 * `?a4world=0` disarms — the phone entry (see A4-PLAYTEST.md, MT-LADDER.md §ENTRY and
 * CB-FRONTEND-VISIBILITY-RUNG.md §HOW-TO-SEE).
 */
export const A4_WORLD_PARAM = 'a4world';

/**
 * WHICH experimental world is armed: 0 = off (the shipped game), 1 = the #156
 * uniform-whisper world, 2 = the #167.5 discipline world, 3 = the #184.2 wind-up
 * world (v2 + `o1PassWindup`), 4/5 = the #211.3 MT play-test worlds (the ladder's
 * D02 / D08 arms), 6 = the #269.4 CB 过人 world (CB-T2's both-armed arm). Mutually
 * exclusive by construction — one value, never a blend.
 */
export type A4WorldVersion = 0 | 1 | 2 | 3 | 4 | 5 | 6;
/** The six armable worlds (0 is "no world"). */
export type A4ArmedVersion = 1 | 2 | 3 | 4 | 5 | 6;
/** The two MT play-test worlds (#211.3) — the fixed-dose coupled tuck-in worlds. */
export type MtWorldVersion = 4 | 5;

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

/** The construction flags one armed world pushes onto `League.matchFlags`. */
export type A4MatchFlags = League['matchFlags'];

/**
 * ⭐ THE ENTRY-LAYER COMPOSITION (#184.2). The construction flags for ONE armed
 * world: the census substrate for every version, and for v3 the O1 cut-1 mechanic
 * on top of it.
 *
 * `A4_WORLD_FLAGS` is deliberately NOT widened — it is the fidelity claim "this is
 * the world the tables were censused on", and a fourth seam inside it would make
 * every version off-census. v3's extra seam is therefore composed HERE, per armed
 * match, and v1/v2 return exactly the census set they always did.
 */
export function a4MatchFlags(version: A4ArmedVersion): A4MatchFlags {
  if (isMtWorld(version)) return { ...MT_WORLD_FLAGS };
  // ⭐ CB (#269.4): the battery's substrate line is `...a4MatchFlags(3)` — CALLED, not copied,
  // so the play world and the probe can never drift into two substrates.
  if (version === CB_WORLD_VERSION) return { ...a4MatchFlags(3), ...CB_WORLD_DOORS };
  const flags: A4MatchFlags = { ...A4_WORLD_FLAGS };
  if (version === 3) flags.o1PassWindup = true;
  return flags;
}

/* ---------------- the MT play-test worlds (#211.3) ---------------- */

/**
 * ⭐ THE MT WORLD'S CONSTRUCTION FLAGS = the MT-LADDER probe's dosed arms, verbatim:
 * its `PERCEPT_FLAGS` (the percept-armed substrate PM-T0/PM-T1's own receipts ran in)
 * plus the two consumption flags the arm throws. Deliberately NOT the A4 census set:
 * the ladder arms carried no eye and no C-family seams, and a play-test world that
 * added them would be watching a different world from the one that was measured.
 */
export const MT_WORLD_FLAGS = {
  edsPerceivedDefence: true,
  edsPerceivedChoice: true,
  pmLaneConvergence: true,
  mtMarkSag: true,
} as const;

/**
 * version ⇒ the ONE dose both genes carry (the ladder's coupled axis, #209.1: the two
 * genes EQUAL at each dose). 4 = the ruled knee (#211.1's NONE_ABOVE_FLOOR fallback),
 * 5 = the contrast arm D08.
 */
export const MT_WORLD_DOSE: Readonly<Record<MtWorldVersion, number>> = { 4: 0.2, 5: 0.8 };
/** The ladder arm each world reproduces — the fidelity anchor's key into the artifact. */
export const MT_WORLD_ARM: Readonly<Record<MtWorldVersion, string>> = { 4: 'D02', 5: 'D08' };

/** Is this an MT play-test world (as opposed to an A4 certified world)? */
export function isMtWorld(version: A4WorldVersion): version is MtWorldVersion {
  return version === 4 || version === 5;
}

/**
 * Write BOTH seam genes at one dose onto all three genome references of one side —
 * the `setA4Obedience` idiom, and the `armGenes` idiom the MT-LADDER / PM-T1 / MT-T1
 * probes took from this module (#196.3-D6: the REAL gene channel, no engine-side dose
 * surface anywhere).
 */
export function setMtDose(match: Match, side: Side, dose: number): void {
  const team = match.teams[side];
  for (const g of [team.info.genome, team.baseGenome, team.effGenome] as TacticalGenome[]) {
    g.defLaneConvergence = dose;
    g.markSag = dose;
  }
}

/**
 * Arm one MT play-test world on a freshly constructed match: both genes at the world's
 * fixed dose, on both teams (the ladder's `doseBothTeams` — the equilibrium frame).
 * The two consumption flags are CONSTRUCTION flags and arrived with `a4MatchFlags`;
 * the eye stays null, and no evolution opt-in is touched.
 */
export function armMtWorld(match: Match, version: MtWorldVersion): void {
  for (const side of [0, 1] as const) setMtDose(match, side, MT_WORLD_DOSE[version]);
}

/**
 * WHICH MT world this match is in (0 = none): both flags armed, no eye, and both genes
 * reading the same world's dose on the EFFECTIVE genome of both teams. Reads the MATCH,
 * never the user's stored intent.
 */
export function mtArmedVersion(match: Match): 0 | MtWorldVersion {
  if (!match.pmLaneConvergence || !match.mtMarkSag || match.stationEye !== null) return 0;
  for (const version of [4, 5] as const) {
    const dose = MT_WORLD_DOSE[version];
    const both = ([0, 1] as const).every((side) => {
      const g = match.teams[side].effGenome as TacticalGenome;
      return g.defLaneConvergence === dose && g.markSag === dose;
    });
    if (both) return version;
  }
  return 0;
}

/* ---------------- the CB play-test world (#269.4) ---------------- */

/** The CB 过人 world's version value — the sixth entry of the family. */
export const CB_WORLD_VERSION = 6 as const;
export type CbWorldVersion = typeof CB_WORLD_VERSION;

/**
 * ⭐ THE THREE DOORS the CB world throws on top of the substrate — CB-T0's two (the
 * commitment physics and the touch-past capability) and CB-T2's choice seat. Verbatim the
 * `armConfig('both')` of `scripts/probes/cb-t2-choice-seat.ts`, which is the arm every
 * headline in CB-T2 §RESULT was measured on.
 *
 * ⚠ THE CHOICE AND THE CAPABILITY ARE SEPARATE DOORS ON PURPOSE (CB-T2 §ARMING #4): a chosen
 * knock still has to clear CB-T0's own fork, so all three are needed for a knock to fire.
 */
export const CB_WORLD_DOORS = {
  cbCommitPhysics: true,
  cbTouchPast: true,
  cbChoiceSeat: true,
} as const;

/**
 * ⭐ THE DECLARED PRONENESS DOSE — the probe's `DOSE = 1`, i.e. "value a knock at exactly what
 * the delivery table says it is worth" (the gene is a multiplier on the knock's own priced
 * score, CB-T2 §GENE). PRESENTATION, ruled as such by #269.4: it is the only dose the arc has
 * measured, so it is the play form; the user's eyes judge it at the gate.
 */
export const CB_WORLD_DOSE = 1;

/** Is this the CB play-test world? */
export function isCbWorld(version: A4WorldVersion): version is CbWorldVersion {
  return version === CB_WORLD_VERSION;
}

/**
 * Write the carry-proneness dose onto MATCH-LOCAL genome views of one side.
 *
 * ⚠ DELIBERATELY NOT the `setMtDose` / `setA4Obedience` idiom (`info.genome` included): see the
 * module header — `cbCarryProneness` is born absent and `info.genome` IS the league franchise's
 * object, so writing it there would persist a dormant gene into the save and open the very
 * carry-through channel the genome CROSSOVER path keeps shut by absence. The de-aliasing form is the
 * engine's own (`Match`'s `dvLearn` block): replace `baseGenome` with a copy and point
 * `effGenome` at it. Mentality rebuilds spread from `baseGenome` (`applyMentality` returns
 * `{ ...raw, … }`), so the dose survives every in-match rebuild; nothing outside the match can
 * see it.
 */
export function setCbProneness(match: Match, side: Side, dose: number): void {
  const team = match.teams[side];
  const view = { ...team.baseGenome, cbCarryProneness: dose } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
}

/**
 * Arm the CB play-test world on a freshly constructed match: the dose on both teams (the
 * probe's `doseBothTeams` frame — the duel is symmetric, both sides may carry and both sides
 * may dive in). The three doors are CONSTRUCTION flags and arrived with `a4MatchFlags`; the
 * eye stays null, and no evolution opt-in is touched (`evolveCarryChoice` stays OFF — a fixed
 * armed world mutates nothing, the #165.2.ii reading this module has applied since v2).
 */
export function armCbWorld(match: Match): void {
  for (const side of [0, 1] as const) setCbProneness(match, side, CB_WORLD_DOSE);
}

/**
 * IS this match in the CB world: all three doors armed, no eye, and the style gene reading the
 * world's dose on the EFFECTIVE genome of both teams. Reads the MATCH, never the user's stored
 * intent — the badge and the tests take their ground truth from here.
 */
export function cbArmedVersion(match: Match): 0 | CbWorldVersion {
  if (!match.cbCommitPhysics || !match.cbTouchPast || !match.cbChoiceSeat) return 0;
  if (match.stationEye !== null) return 0;
  const dosed = ([0, 1] as const).every(
    (side) => (match.teams[side].effGenome as TacticalGenome).cbCarryProneness === CB_WORLD_DOSE,
  );
  return dosed ? CB_WORLD_VERSION : 0;
}

/** The #148 certified PRIMARY dose: homePriorStrength(0.5) = 0.25×VAL_SCALE. */
export const A4_OBEDIENCE = 0.5;

/**
 * ⭐ V2 — THE DISCIPLINE WORLD (commander ruling #167.5; content certified by the
 * S2-P3 Leg F gate, `docs/world-model/A4-S2P3-GENE-BATTERY.md` §1).
 *
 * The same certified whisper (`A4_OBEDIENCE` 0.5) PLUS the frozen backLoaded offset
 * family on both teams' genomes, indexed by SQUAD SLOT:
 *
 *     offsets   = [0, +0.4, +0.2, 0, −0.2, −0.4]
 *   ⇒ effective = [0.5, 0.9, 0.7, 0.5, 0.3, 0.1]   (clamp01(0.5 + offset))
 *   ⇒ outfield 1..5 = the S2-P1 `backLoaded` instrument vector, EXACTLY
 *   ⇒ outfield mean = 0.5 = the matched v1 whisper dose
 *
 * Slot 0 (the GK) is frozen at 0, the role-blind neutral — Leg F proved the choice
 * immaterial (the keeper never reaches the v3 consumption point). The family is
 * INSTRUMENT CONTENT written post-construction onto an opt-in fixture: no genome is
 * ever BORN with it (contract §3), and the two EVOLUTION opt-ins
 * (`evolveHomePrior` / `evolveHomePriorOffsets`) stay OFF — #165.2.ii's precise
 * reading: they govern mutation and crossover, and a FIXED armed world mutates
 * nothing.
 */
export const A4_V2_OFFSETS: readonly number[] = [0, 0.4, 0.2, 0, -0.2, -0.4];
/**
 * The effective per-slot obedience the family produces on top of the whisper.
 * Slots 1..5 ARE the S2-P1 `backLoaded` instrument vector (Leg F's V-arm); slot 0
 * reads 0.5 where the instrument read 0 — a difference Leg F proved immaterial
 * (byte-identical worlds on all 400 seeds), because the GK never reaches the eye.
 */
export const A4_V2_EFFECTIVE_OBEDIENCE: readonly number[] = [0.5, 0.9, 0.7, 0.5, 0.3, 0.1];

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
 * V2 only: write the certified offset family onto all three genome references of
 * one side (the same idiom as `setA4Obedience`; the family goes through the gene
 * module's own writer so this module never names the field).
 */
export function setA4Offsets(match: Match, side: Side, offsets: readonly number[]): void {
  const team = match.teams[side];
  for (const g of [team.info.genome, team.baseGenome, team.effGenome] as TacticalGenome[]) {
    setHomePriorOffsets(g, offsets);
  }
}

/**
 * Arm a freshly constructed match with a certified world: the eye on BOTH sides
 * plus the whisper prior on BOTH genomes (v1), and for v2 the frozen discipline
 * family on top. Never called unless the user opted in; a match already in flight
 * keeps the brain it kicked off with (the E4 rule — that is also what keeps the
 * A/B clean). The version is a single value, so the worlds can never blend.
 *
 * v3 arms EXACTLY v2's post-construction content: its one extra ingredient is a
 * CONSTRUCTION flag (`a4MatchFlags(3)`), which the match already carries by the
 * time it reaches here — there is nothing left to write.
 *
 * ⭐ v4/v5 (#211.3) take the EARLY branch: an MT play-test world is the ladder arm,
 * which carried no eye and no whisper, so nothing of A4 is written and the census
 * tables are not needed at all (`tables` may be null for them).
 */
export function armA4World(
  match: Match, tables: A4Tables | null, version: A4ArmedVersion = 1,
): void {
  if (isMtWorld(version)) {
    armMtWorld(match, version);
    return;
  }
  // ⭐ CB (#269.4) takes the same early branch: genes only, no eye, no census tables.
  if (isCbWorld(version)) {
    armCbWorld(match);
    return;
  }
  if (tables === null) return; // the A4 worlds cannot be armed without their census
  match.stationEye = a4EyeConfig(tables);
  for (const side of [0, 1] as const) {
    setA4Obedience(match, side, A4_OBEDIENCE);
    if (version === 2 || version === 3) setA4Offsets(match, side, A4_V2_OFFSETS);
  }
}

/** Does this match carry exactly the certified PRIOR configuration (v1 or v2)? */
export function isA4Armed(match: Match): boolean {
  const eye = match.stationEye;
  return eye !== null
    && eye.v4?.homePrior === true
    && eye.v3?.mergedTableSha === A4_MERGED_SHA
    && (match.teams[0].effGenome as TacticalGenome).homePriorObedience === A4_OBEDIENCE
    && (match.teams[1].effGenome as TacticalGenome).homePriorObedience === A4_OBEDIENCE;
}

/**
 * WHICH world is on this match: 4/5 for the MT play-test worlds (#211.3), 3 when the
 * discipline family is on both sides AND the wind-up seam is armed, 2 for the family
 * alone, 1 for the uniform whisper, 0 when unarmed or non-conforming. The badge and
 * the tests read the MATCH, not the user's stored intent.
 */
export function a4ArmedVersion(match: Match): A4WorldVersion {
  const mt = mtArmedVersion(match); // #211.3 — a different family, checked first
  if (mt !== 0) return mt;
  const cbw = cbArmedVersion(match); // #269.4 — a third family, likewise
  if (cbw !== 0) return cbw;
  if (!isA4Armed(match)) return 0;
  const family = (side: Side): readonly number[] | undefined =>
    homePriorOffsets(match.teams[side].effGenome as TacticalGenome);
  const matches = (v: readonly number[] | undefined): boolean =>
    v !== undefined && v.length === A4_V2_OFFSETS.length
      && v.every((x, i) => x === A4_V2_OFFSETS[i]);
  if (matches(family(0)) && matches(family(1))) return match.o1PassWindup ? 3 : 2;
  // the whisper alone; a wind-up without the family is no certified world at all.
  return family(0) === undefined && family(1) === undefined && !match.o1PassWindup ? 1 : 0;
}

/* ---------------- the user's choice (sticky + URL) ---------------- */

const readStored = (): A4WorldVersion => {
  try {
    const raw = localStorage.getItem(A4_WORLD_KEY);
    // '1' is what the #156 entry stored — an existing v1 player keeps v1.
    return raw === '6' ? 6 : raw === '5' ? 5 : raw === '4' ? 4
      : raw === '3' ? 3 : raw === '2' ? 2 : raw === '1' ? 1 : 0;
  } catch {
    return 0; // private mode / no storage
  }
};

/**
 * `?a4world=1` (v1) / `2` (v2) / `3` (v3) / `4` (MT 0.2) / `5` (MT 0.8) / `6` (CB 过人) / `0`, or null
 * when the param is absent or unparseable. One value ⇒ the worlds are mutually
 * exclusive.
 */
export function a4UrlOverride(search: string): A4WorldVersion | null {
  try {
    const raw = new URLSearchParams(search).get(A4_WORLD_PARAM);
    if (raw === null) return null;
    if (raw === '1' || raw === 'true' || raw === 'on') return 1;
    if (raw === '2') return 2;
    if (raw === '3') return 3;
    if (raw === '4') return 4;
    if (raw === '5') return 5;
    if (raw === '6') return 6;
    if (raw === '0' || raw === 'false' || raw === 'off') return 0;
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
export function readA4World(): A4WorldVersion {
  let override: A4WorldVersion | null = null;
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

export function writeA4World(version: A4WorldVersion): void {
  try {
    if (version === 0) localStorage.removeItem(A4_WORLD_KEY);
    else localStorage.setItem(A4_WORLD_KEY, String(version));
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
