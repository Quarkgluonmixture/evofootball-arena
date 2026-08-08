// A4 SLICE 2, S2-P1b — THE CONFIRMATORY GATE PREDICATE, lifted into its own module so
// its POLARITIES can be unit-tested (the #163.2.iv debt, discharged on S2-P2's test
// budget per ruling #164.3). This is a PURE MOVE: the predicate, its frozen constants
// and the two helpers it needs are byte-for-byte what
// `scripts/probes/a4-s2p1-vector-census.ts` held, and that probe now imports them from
// here — no constant re-cut, no polarity re-read, no behaviour change (the S2-P1b
// confirmatory run, ruling #164.1, was adjudicated on exactly this code).
//
// ⭐ THE S2-P1b CONFIRMATORY GATE (ruling #162.3, copied VERBATIM) — never re-cut.
//   (a) dupRun( backLoaded − none ) CI UPPER < 0    — 撞车大减 must REPLICATE on fresh seeds
//   (b) box   ( backLoaded − none ) CI UPPER < 0    — 门前的账不亏: the 12× currency must PAY
//   (c) deep  ( backLoaded − none ) CI LOWER ≤ 0    — 外围打平: must not RESOLVE worse
// PASS := (a) ∧ (b) ∧ (c) ∧ the football hard gates ∧ the X-family. The OFFSIDE FLAG is
// DESCRIPTIVE and NEVER gating: fired iff offsides(backLoaded − none) CI LOWER > +0.0338.

/** the paired match-cluster bootstrap CI record (the P1c idiom, verbatim). */
export type CI = { point: number; lower: number; upper: number; n: number };

export const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);

// ⭐ S2-P1b — THE CONFIRMATORY FREEZE (ruling #162.3, copied; NEVER re-cut here).
export const CONFIRM_N_FROZEN = 8_000; // ⭐ FROZEN EX ANTE by #162 — leg (c) must not be passable by underpowering
// ⭐ the frozen OFFSIDE FLAG threshold: 2 × the S2-P1 seen +0.0169 (the #152.4 doubling idiom).
export const CONFIRM_OFFSIDE_FLAG_ABS = 0.0338;
// the S2-P1 SEEN backLoaded−none anchors (docs/world-model/data/a4-s2p1-vector-census.json)
// — CONTEXT ONLY, the P3′ replication idiom: they name the magnitude, never the predicate.
export const S2P1_SEEN_VS_NONE = { dupRun: -2.4543, deep: 0.0026, box: -0.0023, offsides: 0.0169 } as const;
// ⭐ S2-P1b arms (#162.3): none / uniform (DESCRIPTIVE reference, in NO gate leg) / backLoaded.
export const CONFIRM_TREAT_ARM = 'backLoaded' as const; // the S2-P1 frozen vector, VERBATIM
export const CONFIRM_REFERENCE_ARM = 'uniform' as const;

export const evalConfirmGate = (
  vsNone: Record<string, Record<string, CI>>,
  levels: Record<string, Record<string, number>>,
) => {
  const t = vsNone[CONFIRM_TREAT_ARM];
  // magnitude reporting, the P3′ replication idiom: the S2-P1 SEEN value is CONTEXT ONLY.
  const replication = (key: 'dupRun' | 'deep' | 'box' | 'offsides') => {
    const seen: number = S2P1_SEEN_VS_NONE[key];
    const frac = seen === 0 ? Number.NaN : t[key].point / seen;
    return { s2p1Seen: seen, replicatedFractionOfSeen: round(frac, 4) };
  };

  const legA = {
    leg: '(a) PRIMARY 撞车大减', reading: 'dupRun(backLoaded − none) CI UPPER < 0',
    contrast: t.dupRun, holds: Number.isFinite(t.dupRun.upper) && t.dupRun.upper < 0,
    ...replication('dupRun'),
    note: 'MAGNITUDE IS DESCRIPTIVE, the P3′ replication idiom: the leg is DIRECTIONAL, so a '
      + 'confirmatory run reproducing even HALF the S2-P1 seen −2.4543 still HOLDS leg (a) — the '
      + 'honest reading is then "the effect replicates, smaller than first seen", and the fraction '
      + 'above is the number to report. The leg is never re-cut on the magnitude.',
  };
  const legB = {
    leg: '(b) 门前的账不亏', reading: 'box(backLoaded − none) CI UPPER < 0',
    contrast: t.box, holds: Number.isFinite(t.box.upper) && t.box.upper < 0,
    ...replication('box'),
    note: 'the 12×-currency limb: box entries suffered must resolvedly FALL against the WILD world '
      + '(the NONE anchor) — an agreement that costs the box is not bought.',
  };
  const legC = {
    leg: '(c) 外围打平', reading: 'deep(backLoaded − none) CI LOWER ≤ 0 (must not RESOLVE worse)',
    contrast: t.deep, holds: Number.isFinite(t.deep.lower) && t.deep.lower <= 0,
    ...replication('deep'),
    note: 'a BREAK-EVEN leg, not a benefit leg (#162.2.iii: break-even is the honest bar for rung ONE '
      + 'of the doctrine ladder). N is FROZEN EX ANTE at 8,000 precisely so this leg cannot be passed '
      + 'by underpowering — the S2-P1 source estimate carried the same N and the same forks.',
  };

  const offCI = t.offsides;
  const offsideFlagged = Number.isFinite(offCI.lower) && offCI.lower > CONFIRM_OFFSIDE_FLAG_ABS;
  const pass = legA.holds && legB.holds && legC.holds;

  return {
    predicate: 'PASS := (a) dupRun(backLoaded − none) CI UPPER < 0 ∧ (b) box(backLoaded − none) CI '
      + 'UPPER < 0 ∧ (c) deep(backLoaded − none) CI LOWER ≤ 0 ∧ the football hard gates ∧ the X-family '
      + '(ruling #162.3, copied verbatim). The uniform arm is a DESCRIPTIVE reference and appears in NO '
      + 'gate leg. The offside flag NEVER gates.',
    anchor: 'vs NONE (the wild world), per the user ruling 考 at the #161.5 fork: 门前的账不亏 · '
      + '外围打平 · 撞车大减 (#162.1).',
    nFrozen: CONFIRM_N_FROZEN,
    legA, legB, legC,
    offsideFlag: {
      contrast: offCI, threshold: CONFIRM_OFFSIDE_FLAG_ABS, ...replication('offsides'),
      flagged: offsideFlagged,
      note: 'DESCRIPTIVE, NEVER GATING (#162.3): fired iff the offsides(backLoaded − none) CI LOWER '
        + 'exceeds +0.0338 = 2 × the S2-P1 seen +0.0169 (the #152.4 doubling idiom). A fired flag ⇒ '
        + 'F-S2d: the 乙 offside axis returns to the USER, and it never flips PASS/FAIL.',
    },
    descriptiveReference: {
      arm: CONFIRM_REFERENCE_ARM, contrasts: vsNone[CONFIRM_REFERENCE_ARM] ?? null,
      note: 'the slice-1 PRIOR content (the whole-team whisper) carried as a LEVEL/CONTRAST reference '
        + 'so the confirmatory read has its S2-P1 context — it is in NO gate leg.',
    },
    pass,
    emptyCellVacuity: t.dupRun.n === 0
      ? 'POOLED CELL EMPTY ⇒ every leg reads UNRESOLVED ⇒ NOT-ADVANCE (attainability failure)'
      : 'co-populated (every admitted fork contributes to NONE and to every arm)',
    disposition: pass
      ? (offsideFlagged
        ? 'PASS with the OFFSIDE FLAG raised — the backLoaded read CONFIRMS on fresh seeds (撞车大减, '
          + '门前的账不亏, 外围打平), but the offside axis moved ≥ 2× the S2-P1 seen level: F-S2d, '
          + 'RETURNS TO THE USER (the 乙 axis is user-gated, #158).'
        : 'PASS — the S2-P1 descriptive backLoaded read is CONFIRMED on FRESH seeds against the wild '
          + 'world: duplication resolvedly falls, the box account resolvedly pays, and the outer account '
          + 'does not resolve worse. Self-drive proceeds to S2-P2 (gene-ization, offsets born ABSENT) on '
          + 'commander review.')
      : `NOT-ADVANCE — the confirmatory exam FAILED: ${[
        legA.holds ? null : 'leg (a) dupRun', legB.holds ? null : 'leg (b) box',
        legC.holds ? null : 'leg (c) deep',
      ].filter((x) => x !== null).join(' + ')}. STOP; the fork RETURNS TO THE USER (#162.3).`,
    levelsNote: `per-arm LEVELS are published for none/${CONFIRM_REFERENCE_ARM}/${CONFIRM_TREAT_ARM} on every `
      + 'instrument (levels.* above); the S2-P1 instrument debt (the DEDICATED foul counter, the E4 '
      + 'combination counters, the DESCRIPTIVE proximity block whose verdict authority is the USER\'s) '
      + 'is carried UNCHANGED.',
    offsideLevels: levels.offsides,
  };
};
