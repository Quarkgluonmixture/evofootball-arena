# DF-T3B — THE POWER EXTENSION (H-DF.1(a2) re-run VERBATIM on a larger virgin battery)

> **Ordered by** COMMANDER RULING #334 item 5 (the shared power dispatch with IN-T2B), which
> ratified [`DF-T3-SURFACE-EXAM.md`](DF-T3-SURFACE-EXAM.md) §COMMANDER CORRECTIONS item 1's
> disposition, VERBATIM: *"THE REMEDY IS POWER, NOT A NEW RULE: **DF-T3B (the power
> extension)** is QUEUED — the SAME frozen (a2) conjunct on a larger virgin battery, plus this
> round's ordered instrument pin (item 2)."*
> **Bound by** [`DF-DEFENSIVE-BRAIN-CONTRACT.md`](DF-DEFENSIVE-BRAIN-CONTRACT.md) §1 (H-DF.1)
> and §2 — M-DF.2 (the cap-off arm stays HELD until (a) resolves), M-DF.3 (the 范戴克/佩佩 axis
> is REPORTED, never templated).
> **The parent**: DF-T3 §P1 (the frozen rule) · §P2 (the frozen CI rules) · §R0 (the draw this
> stage re-powers) · §R1 (the caution that rides beside it) · §CORR items 1–2.
> **Road B**: nothing ships. This stage is **INSTRUMENT-ONLY after commit 1** — `src/**` is
> UNTOUCHED and the door stays dormant.
>
> ⛔⛔ **THE RULE IS NOT RE-CUT.** Not re-binned, not re-thresholded, not softened to *"at
> least one option"*. The ONLY variable is the seed count. **A SECOND MISS AT HIGHER POWER IS
> A RESULT**, and §R0 reports it as one.

---

## §COMMIT 1 — THE RIDER (DF-T3 §CORR item 2's ordered pin; TESTS ONLY, zero src bytes)

Result commit: `3c39986`.

### §C1.1 ⭐⭐ THE CONTAIN-OFFER PREDICATE, PINNED

DF-T3 §COMMANDER CORRECTIONS item 2 records the gap in its own words: *"neutralising the offer
predicate's goal-side conjunct moves the starred headline ~2× with all 23 gates green —
gFacesFromDisk proves ARITHMETIC, not DEFINITIONS (the verifier demonstrated both teeth and
blind spot)"*, and it ORDERED: *"DF-T3B's commit 1 pins the offer predicate (anchored
three-term extraction + a fixture whose OFFER membership flips per term)."*

Canon VERBATIM (copied from [`CANON.md`](CANON.md) → *walk-side definitions pinned*, home
DF-T3 §COMMANDER CORRECTIONS item 2): *"a scored face's walk-side predicate is pinned —
anchored extraction or fixture — because the re-derivation gate proves arithmetic, not
definitions"*, **REFINED at #334 item 2**: *"anchored extraction protects the source line; a
headline-bearing walk-side predicate ALSO needs a composition fixture"* (home: BK-T3 §CORR
item 2).

So the rider is **both halves**, in `tests/dfSurface.test.ts`:

**(i) THE ANCHORED THREE-TERM EXTRACTION** over the shipped Phase-29.1 contain branch's ONE
line, matched **exactly once** (the line NUMBER is a run-time receipt, never typed):

| term | the text it is captured by | what it means |
|---|---|---|
| 1 | `dC < (\d+) &&` ⇒ **8** | the defender is inside 8 m of the carrier |
| 2 | `carrierGoalD < (\d+) &&` ⇒ **35** | the carrier is inside 35 m of OUR goal |
| 3 | `&& (dist\(p\.pos, ownGoal\) < carrierGoalD)\) \{$` | ⭐ the **goal-side RELATION** — **no literal at all**, which is exactly why it slipped the anchored-constant net and needed a fixture |

and `CONTAIN_OFFER_LINE.split('&&').length === 3` — the three terms are the WHOLE predicate.

**(ii) A FIXTURE PER TERM.** One hand-placed contain picture with every confounder removed by
construction (the defending team's chaser and mark sets CLEARED so the branch chain reaches
the contain else-if; every other body — ours and theirs — parked far upfield, OUTSIDE the
carrier's own goal-distance, so the branch's ONE-container loop can never find a nearer
goal-side rival). Only two offsets vary:

| fixture | defender offset | carrier offset | the three terms | contain wins the argmax? |
|---|---:|---:|---|:--:|
| **POSITIVE** | 20 | 25 | 5 < 8 ✓ · 25 < 35 ✓ · 20 < 25 ✓ | **YES** |
| **PER TERM 1** (`dC < 8`) | 15 | 25 | **10 ≥ 8 ✗** · 25 < 35 ✓ · 15 < 25 ✓ | no |
| **PER TERM 2** (`carrierGoalD < 35`) | 35 | 40 | 5 < 8 ✓ · **40 ≥ 35 ✗** · 35 < 40 ✓ | no |
| **PER TERM 3** (goal-side) | 30 | 25 | 5 < 8 ✓ · 25 < 35 ✓ · **30 ≥ 25 ✗** | no |

plus a **non-vacuity pin**: the positive and the term-1 negative differ ONLY in the
defender's offset (20 vs 15), so *"no contain"* cannot be an artefact of a dead picture; and
placing an unassigned goal-side rival 2 m off the carrier takes the offer away again, so the
shipped ONE-container rule is still the shipped one.

The ACT is read **exactly as the DF-T3 / DF-T3B realisation walkers read it**:
`action.type === 'MarkOpponent'` AND `action.targetIdx === carrier.index` AND the winning
candidate's own `why` starts with `contain `.

### §C1.2 THE THREE MUTANTS, RUN LIVE

On an **UNCOMMITTED** tree, each restored from a `/tmp` **byte copy** (`cmp`-verified),
**never by `git checkout`**:

| mutant (single-line, on the anchored line) | pins killed |
|---|---|
| `dC < 8 &&` → `true &&` | **FIXTURE PER TERM 1** + the two anchored-LINE receipts + the non-vacuity pin (**4 of 27**) |
| `carrierGoalD < 35 &&` → `true &&` | **FIXTURE PER TERM 2** + the two anchored-LINE receipts (**3 of 27**) |
| `dist(p.pos, ownGoal) < carrierGoalD` → `true` | **FIXTURE PER TERM 3** + the two anchored-LINE receipts (**3 of 27**) |

⚠ **STATED, NOT HIDDEN**: every mutant also kills the two anchored-LINE receipts (DF-T2's own
and this rider's), because the mutant *edits the anchored line itself* — that is unavoidable
and is the anchor doing its job. Mutant 1 additionally kills the non-vacuity pin for the same
reason it should: at 10 m the offer becomes real once the radius stops gating. **Each term's
own fixture dies ONLY under its own mutant**, which is the specificity the order asked for.

### §C1.3 THE FINGERPRINT, RE-VERIFIED AFTER COMMIT 1

`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` — **unmoved**, as a
tests-only commit must leave it; verified by hand with `npm run fingerprint`. `git status
--porcelain -- src` and `git diff --stat HEAD -- src` both **EMPTY**. **27/27 pins green** in
`dfSurface.test.ts` (21 + 6).

---

## §PRE-REGISTRATION (frozen before the battery — THIS commit is the freeze commit)

### §P0 What this stage is, and is NOT

A **POWER EXTENSION**, in the [`DV-T1B-POWER-EXTENSION.md`](DV-T1B-POWER-EXTENSION.md) form:
the same frozen letter, more clusters, **nothing else**. It re-scores **ONE conjunct** and
reports the caution that rides with it.

⛔ **NAMED OUT, EXPLICITLY** — and each of these is *banked elsewhere*, not skipped:

* **THE SEASON LADDER.** DF-T3 §R3 owns it (160 league-seasons, the atkFrozen floor read).
  A power re-run of a **within-arm** conjunct buys **CLUSTERS, not estimands** — every second
  of ladder wall is a seed not spent on the tercile intervals (the DV-T1B rule: *"a power
  extension buys clusters, not cells"*).
* **EVERY BETWEEN-ARM FOOTBALL FACE**: the churn/coverage family, the R-乙 chain (Q01/Q05/
  Q06/Q07/Q14), the §2 equilibrium faces, `multiChaseShare2/3`, the chaser and swarm bins.
  All are DF-T3 §R4–§R6's and are not re-asked.
* **H-DF.1(b)'s THREE CONJUNCTS** — banked **PASS** on all three at DF-T3 §R0.
* **THE PRESS-REALISATION WALKER.** ⚠ Therefore the contain-offer predicate **this stage's own
  commit 1 pinned is NOT scored here**; its anchored line receipt rides in the artifact as the
  rider's source receipt and nothing more. Stated so no reader infers that the pinned
  headline was re-measured.
* **THE CAP-OFF ARM** — HELD (M-DF.2: retirement needs (a) AND (b); DF-T3 §CORR item 1).
* **ANY DOSING.** Both arms are **flag worlds**; nothing is written to any genome view, so
  #334 item 3's match-local-copy dose idiom and its `info.genome`-cleanliness conjunct are
  **N/A** — stated, not silently omitted.
* Any nudge answering anything measured here (#320 item 3's frozen direction: **deviations
  ROUTE TO SLICES, never to nudges**).

### §P1 ⭐⭐ THE SCORED CLAIM — THE FROZEN RULE, QUOTED VERBATIM

> **(a2) BY BODY** (DF-T3 §P1's table, VERBATIM): *"the `attrs.defending` **TERCILE gradient**
> resolves for **PRESS** *and* for **TAKE**: top vs bottom tercile intervals **DISJOINT** *and*
> the three point estimates **STRICTLY MONOTONE** in tercile index, for BOTH options"*.
> **kind**: CI (unpaired, within-arm).

**THE PRIOR DRAW (DF-T3 §R0, 41 paired seeds, stats base 115,600):**

| limb | points | bottom | top | verdict |
|---|---|---|---|:--:|
| PRESS | `[0.00150781962269, 0.00324652656566, 0.00362976406534]` | [0.000909642207398, 0.00231122149781] | [0.00257751497233, 0.00481417292509] | ✅ |
| TAKE | `[0.150150781962, 0.156426726245, 0.166339494055]` | [0.139787870547, 0.160352359808] | [0.152372659991, 0.180705992363] | ⛔ **overlap 0.0080 of share** |

**(a2) passes iff BOTH limbs pass.** The verdict string names which limb failed if either does.

⚠⚠ **THE INHERITED CAUTION, STATED AS LOUDLY AS THE VERDICT** (DF-T2 §R11 item 1, ratified
#327 §CORR item 2, reproduced digit-for-digit at DF-T3 §R1 as **407 of 410 bodies
HOLD-MODAL**): the body-modal census is **RE-RUN on this stage's virgin battery and published
beside the verdict**. It is **NOT a conjunct**: if (a2) passes while the body-modal degeneracy
persists, **BOTH are reported** — the verdict is the conjunct's, the caution is the reader's.

⭐ **(a1) IS A COMPANION, REPORTED AND NEVER SCORED HERE.** DF-T3 §R0 banked it ✅ at
|Δ|÷hw **3.19307** and **that remains the verdict of record**. It is re-read on the virgin
battery because the mode-slot walk-side predicate is pinned anyway and the read costs nothing;
it is published as `a1Companion` with `scored: false`.

### §P2 ⭐ THE FROZEN CI RULES — DF-T3 §P2's, REPRODUCED

* **PER-SEED CELLS** are stored so every headline re-derives (canon, home ruling #282.2(ii)).
* **WITHIN-ARM contrasts** ((a2)'s terciles, the (a1) companion's two modes) are **UNPAIRED**:
  each side gets its own **seed-clustered** bootstrap interval and the frozen test is
  **INTERVAL OVERLAP** — **DISJOINT = resolved apart**. **In every draw the tercile CUTS are
  recomputed from the resampled bodies**, so the cut is inside the bootstrap, not outside it.
* **2,000 resamples**; **95 % percentile** intervals; the bootstrap rng is seeded from its
  **own published STATS BASE** (block-base discipline).
* Canon (paraphrase): **moving denominators disclosed per face** (home PW-C0 §CORR item 2) —
  each tercile publishes its own decision denominator, and the (a1) companion publishes its
  `denNote`.
* Canon VERBATIM: *"a max−min face reports a noise-floor comparison, not a zero-null CI"*
  (home PC-T1 §CORR item 3) — **no max−min face is published by this stage**.
* Canon VERBATIM: *"arming receipts, not football findings"* (home ruling #289 item 1) — the
  arms-distinguishable check is an **OUTCOME DIGEST** comparison, deliberately **not** a
  football effect size, and no CI is attached to it.

### §P3 The arms, and the world

* **shut** = the **world-9 stack** (`a4MatchFlags(9)` + `bkFacingLaw` + `bkContactLaw` +
  `armA4World` with the matured L3/PC doses) **+ `dfAssignPersist`** — DF-T1's BANKED world,
  the matched floor. **DF-T3 §P3's arms, byte-for-byte.**
* **armed** = the same **+ `dfSurface`**. That is the ONLY difference; asserted per walk by
  `persistenceArmedBothArms` and `surfaceDoorMatchesArm`.
* ⭐ **ONE SEAM FAMILY**: `inSnapshotLaw` and `inLookAct` are **shut on both arms**, asserted
  per walk (`inDoorsShutBothArms`) — DF-T3's stack, unchanged.

### §P4 ⭐⭐ WALK-SIDE PREDICATES PINNED (the refined canon's composition half)

**28 hand-computed fixtures**, evaluated in the **CONSTRUCTION CLASS before a single battery
walk**; a disagreement **exits 3 and writes nothing**. They cover every predicate the conjunct
is scored *through*:

* `modeSlotOf` / `byModeIndexOf` — src's OWN slot (**anchored**: `team.mode === 'Press' ? 1 :
  0`) and the ledger's index composition `modeSlot × |DF_SURFACE_OPTIONS| + opt`, including
  ⭐ *Press × press = 4* (the slot is a **multiplier**, not an offset by one) and *Attack ⇒
  slot 0* (the src line is a Press test, not a switch).
* `tercileBoundsOf` — three contiguous ascending slices at `floor(t·n/3)`, including ⭐ *the
  remainder lands in the TOP tercile*, *the three slices always PARTITION n*, and ⚠ *n = 2
  leaves the BOTTOM tercile EMPTY* (the degenerate cut, stated rather than discovered).
* `strictlyMonotone` — strict, either direction, **a TIE is FALSE**, a kink is FALSE, a NaN
  anywhere is FALSE, and ⭐ **DF-T3 §R0's published TAKE points score monotone TRUE**, as
  recorded.
* ⭐⭐ `disjoint` — **the whole (a2) criterion turns on this one function**, so it is pinned
  against **DF-T3 §R0's OWN PUBLISHED INTERVALS**: the record's PRESS pair must come out
  **DISJOINT** and the record's TAKE pair must come out **OVERLAPPING**. Endpoint-touching is
  FALSE (strict `<`), nesting is FALSE, a NaN edge is FALSE, and the test is order-symmetric.
  **The criterion is proven to reproduce the very red this stage exists to re-power.**

### §P5 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` (**booked from the declared constant, walked
derived from the per-seed cells — two independent records, per #334 item 3: gates that cannot
fail are not gates**) · `gArmsPairedPerSeed` · `gAnchorsResolveOnce` ·
⭐ `gWalkSidePredicatesPinned` · ⭐ `gSrcUntouched` (porcelain AND `diff --stat HEAD` over
`src`) · `gLedgerZeroWhenShut` (dormancy measured IN-BATTERY) · ⭐ `gEveryOptionUsed`
(NON-DEGENERACY LIVENESS — a one-corner surface goes RED and is reported as such) ·
`gUsageCellsStored` · ⭐ `gTercileCellsAlive` (every tercile carries bodies AND decisions in
BOTH scored options — an empty cell is a silently dead instrument, not a pass) ·
⭐ `gWithinBootstrapAlive` (a zero-width interval is not a measurement) ·
⭐ `gArmsDistinguishable` (the outcome digests differ on **every** seed) · `gSeedDiscipline` ·
`gStatsDisjoint` · `gFingerprintUnmoved` · ⭐ `gFacesFromDisk` (canon, home ruling #287 item 1:
the body is **STAGED to disk, re-parsed, and every published face re-derived** — the usage
block and both mode shares, the tercile table re-cut from the stored body rows, (a2)'s six
point estimates, both monotone booleans, both disjointness booleans, both overlaps, both
|gap|÷half-width ratios, both limb passes, the conjunct pass **and the verdict string**, the
(a1) companion's two values/disjointness/gap/ratio, the body-modal census, in-battery dormancy
and the arming receipt).

⭐ **THE BODY IS HASHED LAST**, after every gate is written including `gFacesFromDisk`
(DF-C0 §CORR item 2, ruling #321). ⭐ **RED ROUTING** (#334 item 3, a REQUIRED brief clause):
a RED run writes `…RED.json`; the canonical path is only reached all-green.

### §P6 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,518,000–999**, opened by #334 item 5, **CONSUMED WHOLE**. Sub-ranges:
  `…000–…119` the power battery (**120 paired virgin seeds**) · `…800–…802` the in-band smoke
  prefix · `…999` the xxx,999 world-construction receipt seed (**WALKED**, so 121 seeds ×
  2 arms = **242 walks**). ⛔ **NO LADDER SUB-RANGE** — this stage runs no ladder.
* **THE POWER RATIO**: DF-T3 walked **41** paired seeds; this stage walks **121** — **2.95×
  the clusters**, published in the artifact as `seeds.seedsVsDfT3`.
* **Stats base 116,400, step 200.** ⭐ **THE REGISTRY OF RECORD ENTERING THIS STAGE IS 67**
  (ruling #333 item 4): IN-C0's completed 56 + 114,200 + 114,400 + 114,600 + 114,800 +
  115,000 + 115,200 + 115,400 + 115,600 + 115,800 + 116,000 + 116,200. **BK-T3 consumed ZERO**
  (#334 item 4).
* **ONE draw ⇒ ONE base**: **116,400** (the WITHIN-ARM seed-clustered bootstrap that carries
  (a2), and the (a1) companion, which shares the SAME resample index by construction — exactly
  as DF-T3's single within-arm draw did). **The registry leaves at 68.** Next base ≥
  **116,600**; next sim block ≥ **12,519,000**.
* **Override discipline**: a smoke / N / OUT run may NOT write the canonical artifact path
  (the probe refuses, exit 2).

### §P7 The instrument

`scripts/probes/df-t3b-power-extension.ts`, frozen in **this** commit **BEFORE** the battery
(canon: **freeze-before-battery**, home ruling #266.3(c)); the artifact records its `sha256`.
The hashed body is built from an explicit **ALLOWLIST SCHEMA** — canon VERBATIM: *"the hashed
body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the
body; forbidden-name lists are retired"* (home PC-T0 §CORR item 1). Env surface is
**whitelist-or-refuse**: `DFT3B_MODE` (required) · `DFT3B_N` · `DFT3B_OUT`; any other
`DFT3B_*` var and any engine door is a fatal refusal.

**THE FOUR ANCHORED EXTRACTIONS** (values REPORTED with line receipts, never asserted in
prose): `dfLedgerModeSlot` · `dfLedgerModeIndex` · `dfLedgerByGid` · and
`containOfferPredicateRiderReceipt` — **the rider's source line only**, carried because
commit 1 pinned it, explicitly **not scored** by this thin instrument. Canon VERBATIM: *"a
src-extracted constant pins its extraction to the NAMED call site — anchored match + line
receipt — never first-occurrence"* (home BK-C0 §CORR item 1).

**THE MACHINERY IS REPRODUCED, NOT REINVENTED**: `bodiesOf` / `tercilesOf` / `tercileShare` /
`a2Interval` / `strictlyMonotone` / `disjoint` / `intervalOf` / the `withinIndex` resampler
come from `scripts/probes/df-t3-surface-exam.ts` §9, and the usage-ledger read at the whistle
with the `gid → attrs.defending` join comes from its §3 — **the join lives in the instrument,
never in src**.

### §P8 Declared doubts (before the battery)

1. **(a2)'s TAKE LIMB MAY MISS AGAIN, AND THAT IS A RESULT.** DF-T3's overlap was **0.0080 of
   share** on intervals of half-width ~0.010/0.014 with three point estimates spanning **1.6
   points of share**. 2.95× the clusters shrinks a seed-clustered half-width by roughly
   √2.95 ≈ 1.72 **if the per-seed variance behaves**, which is not guaranteed — and the point
   estimates themselves are a fresh draw and may not span 1.6 points again. **The rule is
   frozen as it stands**; if the intervals overlap, (a2) is RED, is reported as RED, and is
   **not** re-cut to "monotone is enough".
2. **THE PRESS LIMB MAY ALSO MOVE.** It passed at 41 seeds on shares of order 10⁻³ — small
   numerators. More clusters may narrow it or may reveal it was borderline. Both limbs are
   re-scored, and a PRESS miss would be reported as loudly as a TAKE one.
3. **THE TERCILE CUT IS A WITHIN-ARM CONTRAST AND FRESHNESS OF BODY IS NOT RANDOMISED.**
   `attrs.defending` is drawn with the squad, so the terciles are a **descriptive** split of
   the population, not an intervention. That was true at DF-T3 and is restated, not repaired.
4. **THE BODY-MODAL DEGENERACY WILL ALMOST CERTAINLY PERSIST** (it reproduced digit-for-digit
   across two independent 41-seed draws). Pre-registered here so a third reproduction is read
   as *structure confirmed*, not as new information.

---
<!-- RESULTS MARKER — not one byte above this line moves after the battery -->
