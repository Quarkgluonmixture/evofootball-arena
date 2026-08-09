# MT LADDER — THE DOSE LADDER (which dose of the coupled tuck-in world does the user play-test?)

Status: **PRE-REGISTERED 2026-08-09. The battery has NOT been run.** Every arm, the seed
blocks, the N rule, every instrument, and — the load-bearing one — ⭐ **THE KNEE RULE**
were frozen **before any full-N number existed**. The only numbers in this document are
(a) the SMOKE's, labelled `SMOKE — PLUMBING ONLY`, which adjudicate **nothing** and tune
**no** threshold, and (b) constants quoted from published, committed prior stages with
their citations. [§RESULT](#result--the-ladder-runs) is **empty by design**: the commander
launches the battery per §LAUNCH and adjudicates it.

Authority chain: ruling **#209** (the user ruled 甲 — this dispatch, and ⭐ §209.2 the knee
rule frozen ex ante), carrying **#208** (MT-T2 adjudicated: selection is INDIFFERENT, so
the dose decision returned to the user with two measured anchors), **#204** (MT-T1's cost
finding at the top dose), **#203** (⚠ ADJUDICATE FROM THE PER-ARM ROWS, never from a
verdict line), **#196.3-D4** (⚠ THE ARMING CHECKLISTS ARE BINDING), **#196.3-D6** (doses
travel the REAL gene channel via genome views — no engine-side dose surface), **#181.2**
(receipts = committed recomputable artifacts; no doc-typed hashes), **#197-M1/M2**,
**#194/#196** (state each gate's semantics; say what the arms DIFFER in) and **#163**
(stats-base discipline). Contract:
[`MARK-TIGHTNESS-CONTRACT.md`](MARK-TIGHTNESS-CONTRACT.md) §1 H-MT · §2 M-MT.1–5 · §4 the
non-claims — **this stage adds no contract clause**: it is an EXHIBIT-dose battery, not a
ship decision, and **Road B binds until the play-test rules**. Seams:
[`MT-T0-DORMANT-SEAM.md`](MT-T0-DORMANT-SEAM.md) and
[`PM-T0-DORMANT-SEAM.md`](PM-T0-DORMANT-SEAM.md) — ⚠ **each dosed arm throws ALL switches
of BOTH seams**, on all three genome views of both teams.

⭐ **THE RULER**: [`MT-T1-RULER-RERUN.md`](MT-T1-RULER-RERUN.md) +
[`../../scripts/probes/mt-t1-ruler-rerun.ts`](../../scripts/probes/mt-t1-ruler-rerun.ts)
(itself the PM-T1 compression exam's instrument set). This battery re-runs that instrument
set **verbatim**, and MT-T1's ⚠ CORRECTION rows all **bind this build**: #197-M1 (the head
rides OUTSIDE the hashed body), #197-M2 (unabridged transcripts, failing rows included),
#197-L3 (N provenance is sha-audited, not git-enforced), #197-L4 (the p50-as-mean
substitution), #197-L5 (the SPLIT steer taxonomy; the guard limbs pool both teams),
#197-L6 (the ask is a RECOMPUTED COUNTERFACTUAL station read), and #203's four verify
findings — including the one that matters most here: **the weak-side in-trigger sag layer
samples EVERY in-trigger tick; only the match-wide layer runs at cadence 15.**

Probe: [`../../scripts/probes/mt-ladder.ts`](../../scripts/probes/mt-ladder.ts).
Artifacts: [`data/mt-ladder-smoke.json`](data/mt-ladder-smoke.json) (committed, this round)
and `data/mt-ladder.json` (the commander's run).

---

## §1 The question, in the order it is asked

1. ⭐ **WHERE IS THE KNEE?** #204 measured the coupled world at gene = 1 (body −2.80 m but
   the equilibrium band blown on 4 of 5 gated dimensions) and #208 measured it at the
   evolved drift dose gene ≈ 0.2 (body −0.70 m, world healthy). **The doses in between are
   unmeasured.** This battery walks 0.2 / 0.4 / 0.6 / 0.8 and applies the frozen knee rule.
2. **WHAT DOES EACH DOSE COST?** the equilibrium band **including goals** (control-gated,
   the inherited substrate-drift caveat) and the B1-a clump set at **inherited** tolerances.
3. **WHAT DOES EACH DOSE DELIVER?** the body: `bodyLatGap` (the knee's limb (c)),
   `compressionShortfall` and `detachMean` (both REPORTED here).
4. **WHAT DOES IT DRAG WITH IT?** mark-assignment drift, the swallow share, the ask, the
   sag census per dose. **REPORTED, never gated, never designed away.**

## §2 THE FROZEN DESIGN — the five arms

| arm | `pmLaneConvergence` | `defLaneConvergence` | `mtMarkSag` | `markSag` | what it is |
| --- | --- | --- | --- | --- | --- |
| **ABSENT** | off | **ABSENT** | off | **ABSENT** | ⭐ **THE CONTROL** — the production-shaped defensive path |
| **D02** | **on** | **0.2** (`k_PM` 0.05) | **on** | **0.2** | the coupled world at 0.2 — #208's measured-healthy anchor |
| **D04** | **on** | **0.4** (`k_PM` 0.10) | **on** | **0.4** | UNMEASURED |
| **D06** | **on** | **0.6** (`k_PM` 0.15) | **on** | **0.6** | UNMEASURED |
| **D08** | **on** | **0.8** (`k_PM` 0.20) | **on** | **0.8** | UNMEASURED |

**The arms differ in exactly what the table says**: two `MatchConfig` booleans and two gene
values, **the two genes EQUAL at each dose** — the coupled play-test world axis (#209.1).
Nothing else moves. `src/**` is untouched (`xSrcZero`, HARD).

⭐ **DOSE 1.0 IS NOT AN ARM.** It is already measured (#204) and is **CITED, never re-run**
(#209.1). The drift dose (#208) is cited the same way. Both citations are **byte-hashes of
the committed artifacts computed in-probe** (`results.citedAnchors`) — **no level is read
out of either**, so no prior number can leak into a predicate.

### §2.1 The dose channel — no new engine surface

Genes are written onto **all three genome views** (`info.genome` / `baseGenome` /
`effGenome`) of **both** teams, the `a4World.ts` `armGenes` idiom — **#196.3-D6** honoured
literally, inherited from MT-T1 §2.1 unchanged.

⚠ **THE TWO ARMING CHECKLISTS (#196.3-D4), asserted by `gArm` on EVERY arm:**
* **PM armed** = the `pmLaneConvergence` flag **+** the `evolveDefLaneConvergence` opt-in
  **+** a non-absent `defLaneConvergence` gene — **all three**.
* **MT armed** = the `mtMarkSag` flag **+** the `evolveMarkSag` opt-in **+** a non-absent
  `markSag` gene — **all three** (MT-T0 §SEAM, verbatim).

This battery is **FIXED-DOSE — no evolution runs** — so the two opt-ins are the channels the
genes *would* travel under selection rather than ones this stage exercises; `gArm` asserts
**both channels are LIVE**. It additionally pins, per arm and per team, that
`pmLaneConvergenceK(effGenome)` and `markSagWeight(effGenome)` equal their frozen values
**exactly** (0.05/0.10/0.15/0.20 and 0.2/0.4/0.6/0.8).

### §2.2 Both teams are dosed, symmetrically

**FROZEN: symmetric**, for PM-T1 §2.2's three reasons unchanged, inherited through MT-T1.
Consequence, disclosed: every episode's defending team is dosed, and this battery says
nothing about the asymmetric case.

### §2.3 The world

`edsPerceivedDefence: true, edsPerceivedChoice: true`; **no station eye**
(`stationEye === null`, gated), exactly MT-T1's world. Prod-shaped and A4-armed worlds are
**not** measured (the inherited boundary).

### §2.4 Nothing is re-cut

`k_PM ≤ 0.25` is PM-T0's traced constant; `MARK_SAG_BALL_SPEED = 16`, `MARK_SAG_MAX = 9`
and the `sagOf` shape are MT-T0's; `NI_FRACTION` is A4-S2P1 §4's; the band is A4-S2P3
§4.2's; `SAG_MATERIAL_M = 1.4` is `markingAggression`'s own stance band. ⭐ **THIS STAGE
INTRODUCES NO NEW THRESHOLD**: the knee is a *recomposition* of three inherited predicates.

## §3 SEEDS — a fresh block, disjointness proved in-probe

| item | block | status |
| --- | --- | --- |
| A4/O/PM/MT arc consumed through | …12,313,999 (MT-T1) · **12,320,000–12,419,999 (MT-T2's reserved band; evolution ..12,401,444 + body ..12,412,339)** | prior |
| **MT-LADDER sizing smoke** | **12,420,000 – 12,420,005** (6 seeds × 5 arms) | **CONSUMED this round** |
| **MT-LADDER exit-semantics sub-block** | **12,420,100 – 12,420,199** (only 12,420,100–101 stepped) | **CONSUMED this round** — see §6.5 |
| **MT-LADDER battery (reserved, VIRGIN)** | **12,420,200 – 12,420,999** (N ≤ 800) | reserved; N = 800 ⇒ 12,420,200–999 |
| free above | 12,421,000 + | later stages |

A **reserved band is spent**, so MT-T2's band is listed WHOLE (12,320,000–12,419,999) even
though it consumed through 12,412,339. Disjointness against **every** consumed block
(sixteen of them) is computed **in-probe** (`gates.gSeed`), never asserted here; the three
own sub-blocks are asserted mutually disjoint and ordered.

⚠ CORRECTION INHERITED (MT-T1 §3, #203 finding 3): an overridden full-mode run is **BASED**
on the exit-semantics sub-block but `RUN_N` is unclamped, so an override larger than 100
would overflow into the battery block and be caught **post hoc** by `gSeed` (exit 1) —
**detected, not prevented**. Operationally the commander launches full mode with **no**
`MTLAD_N` (any full-mode override is `gNDerived`-RED anyway), so the battery block stays
virgin.

**Stats stream (a separate namespace)**: bootstrap base **104,200**, `B = 2000`, cluster =
seed. MT-T2's base was 103,800 with **104,000 RESERVED**, so 104,200 is the next legal base
under the #163 200 floor; disjointness from all **twelve** published bases is gated
(`gates.gStats`, measured minimum gap 200).

## §4 N — DERIVED IN CODE, PRINTED BEFORE THE FIRST BATTERY MATCH

N is **not** a constant in the probe. **The frozen rule is MT-T1's, re-derived for this
stage's own reserved band; the variance term is unchanged and SMOKE-FREE:**

```text
σ_perSeed  = (halfWidth188 / 1.96) · √700          ← SMOKE-FREE, published variance
σ_delta    = √2 · σ_perSeed                        ← conservative (arms treated independent)
pairsNeeded= ceil( (1.96 · σ_delta / 0.5 m)² )     ← target CI half-width 0.5 m
N*         = min( ceil(pairsNeeded / pairYield) rounded UP to 25,
                  floor( 2.0 h / (ms_per_match × 5 arms × 2 X-DET) ),
                  800 )                            ← this stage's reserved band cap
```

* **The variance source** is #188's **published** prod-world CI
  ([FARSIDE-DEFENDER-FORENSIC §8.3](FARSIDE-DEFENDER-FORENSIC.md), weak-side back
  `sendLatGapMean` **p50 19.86 [19.65, 20.04] over 700 per-seed clusters**) ⇒
  `halfWidth188 = 0.195`, `σ_perSeed = 2.632263 m`, `σ_delta = 3.722347 m`,
  **`pairsNeeded = 213`**. `gInherit` pins that line in MT-T1's probe.
* ⚠ **THE TWO SUBSTITUTIONS RIDE UNCHANGED AND ARE DISCLOSED, NOT HIDDEN** (MT-T1 §4):
  (a) a **MEDIAN's** interval used as a mean's (#197-L4; direction **conservative**);
  (b) a **TARGET-metric** variance sizing a **BODY-metric** quantity (direction
  **UNKNOWN**). Not re-cut for it: the **achieved half-width of every body contrast is
  PUBLISHED** (`results.body.achievedHalfWidthM`), so any shortfall is measured and
  disclosed, never assumed away.
* **`pairYield` and `ms_per_match` are the ONLY two numbers read out of the smoke** (the
  #188 §4.3 form). The committed smoke's two numbers: `msPerMatch 113.367`,
  `pairYieldMin 0.1667` (the minimum over D02 0.1667 / D04 0.3333 / D06 0.3333 /
  D08 0.3333).
* **N\* = 800.** `ceil(213 / 0.1667) = 1278 → 1300` (precision) · wall term **6336** ·
  **cap 800**. ⚠ **THE CAP BINDS** (`bindingTerm = reservedBandCap`); projected wall
  **0.252 h**. Stated honestly and not re-cut: the reserved band is a SEED-BUDGET, not a
  statistical statement, and with the precision term at 1,300 the battery may land **wider
  than the 0.5 m target half-width**. The shortfall (or its absence) is read off the
  published achieved half-widths, and **the band is not widened after seeing the smoke's
  yield**. (Context, not justification: the 0.1667 minimum is one paired seed out of six at
  D02; MT-T1's smoke read the same 0.1667 and its battery delivered materially better.)
* ⚠ **Where N's inputs are actually read from (#197-L3, inherited verbatim).** The committed
  smoke artifact is [`data/mt-ladder-smoke.json`](data/mt-ladder-smoke.json), **file sha256
  `16a5644259274c8d9964606418d5c5c60c94ca8de1731ce77d30b6e4553473b7`** (of the artifact BYTES as committed this
  round; distinct from its `resultSha256`, which covers the measured body only). Full mode
  reads the **WORKING-TREE** file at that path and records the sha256 of the bytes it
  actually read as `nDerivation.smokeArtifactSha256`. The provenance is
  **discipline-enforced and sha-audited, not git-enforced**: compare that recorded value
  against the pin above at adjudication.
* `gates.gNDerived` fails **RED** if the N actually run is not the rule's output — an
  `MTLAD_N` override in full mode turns the gate red rather than passing quietly.

## §5 ⭐ THE KNEE — THE ONLY DECISION RULE, FROZEN EX ANTE

All contrasts are **paired per-seed deltas** (arm − ABSENT control) of the weak-side back's
per-seed mean, bootstrapped on the **seed** cluster (`B = 2000`, base 104,200, CI =
2.5/97.5 percentiles). ⚠ **Disclosed**: the arms diverge tick-for-tick, so pairing is on
the **seed**, not on the episode.

```text
QUALIFIES(d) := (a) the arm at dose d holds the equilibrium BAND on EVERY CONTROL-GATED
                    dimension  (a dimension the CONTROL itself fails is DISCLOSED and
                    EXCLUDED as substrate drift — the inherited caveat)
              ∧ (b) GUARD-NI passes
              ∧ (c) CI_upper( bodyLatGap( d − ABSENT ) ) < 0     [resolvedly negative]

KNEE := the LARGEST d ∈ {0.2, 0.4, 0.6, 0.8} with QUALIFIES(d)
        · if NO d ≥ 0.4 qualifies ⇒ 0.2   (the measured-healthy anchor, #208)
        · if ALL qualify          ⇒ 0.8
```

⭐ **This is ruling #209.2 verbatim, and it is coded verbatim** (`scripts/probes/mt-ladder.ts`
§14). Three properties, stated so nothing is read wider than it is:

1. **EVERY BRANCH LANDS A DOSE.** There is **no STOP class** and **no exit 2**. The knee is
   an **EXHIBIT dose** for the user's play-test verdict (the density-verdict precedent),
   **not a ship decision** — Road B binds until the play-test rules.
2. ⚠ **THE FLOOR BRANCH FIRES REGARDLESS of whether 0.2 itself qualifies.** That is what the
   rule says; the 0.2 row is published either way, with its failing limbs.
3. ⚠ **A DOSE CAN FAIL ON ONE LIMB AND THAT IS INVISIBLE IN THE KNEE NUMBER.** The knee is a
   maximum over a three-limb conjunction, so **the commander adjudicates from the PER-ARM
   ROWS** (#203-L4), never from the knee line.

### §5.1 Limb (a) — the equilibrium BAND, inherited verbatim INCLUDING goals

From [A4-S2P3-GENE-BATTERY §4.2](A4-S2P3-GENE-BATTERY.md) via PM-T1 §5.5 and MT-T1 §5.4:

```text
goals     2.3944 ±15 %      crosses 2.4894 ±25 %      headers   9.1039 ±25 %
longBalls 6.2042 ±25 %      cutbacks 3.8151 ±25 %

BAND(a) := arm a inside the band on every dimension the CONTROL arm itself holds
           (a dimension the CONTROL fails is DISCLOSED as substrate drift and EXCLUDED)
```

⚠ **#208's caveat binds**: long-evolution worlds can drift the goals dimension on the
CONTROL itself. If that happens here, goals is **EXCLUDED and the exclusion is published**,
and the knee then holds only over the dimensions that survive. The band is computed and
printed for **every** arm regardless, so nothing is hidden by the gating.

### §5.2 Limb (b) — GUARD-NI, fraction inherited, scale from THIS run's control

```text
tol(limb)      = NI_FRACTION × | control-arm level of that limb, THIS run |
NI_FRACTION    = 1 − 0.275/0.380 = 0.2763          ← INHERITED, NOT INVENTED

GUARD-NI(a) := CI_lower( ΔspreadY_outOfPossession ) > −tol   ∧
               CI_lower( Δ spacingMedian )          > −tol   ∧
               CI_upper( Δ spacingUnder4 )          < +tol   ∧
               CI_upper( Δ dupRunShare )            < +tol
```

`0.2763` is [A4-S2P1-VECTOR-CENSUS §4](A4-S2P1-VECTOR-CENSUS.md)'s `fraction_box`. An
UNRESOLVED (too-wide) CI **fails** the limb, per the S2 degeneracy clause.

### §5.3 Limb (c) — the BODY

`bodyLatGap` = `|p.pos.y − ball.pos.y|` on the weak-side back's in-trigger ticks —
#188 §3.1–§3.3's definition, inherited verbatim and pinned. `compressionShortfall` and
`detachMean` are computed and published per arm but **ride REPORTED**: MT-T1 gated on all
three, the knee reads only `bodyLatGap`. ⚠ `SPREAD_R = 9 m` is a **RULER, not a target**
(#188 §3.3's own words) — passing limb (c) says the weak-side body sits closer to the
ball's lane; it does **not** say that is good football. **That verdict is the play-test's.**

### §5.4 THE SAG CENSUS — REPORTED per dose (the sag-fired instrument rides)

MT-T0's `stanceCensus` quantities in two layers: **match-wide** (cadence 15) and ⭐
**weak-side back, in-trigger, EVERY tick** (MT-T1's ⚠ #203 correction of record, carried
correctly here). Per layer the probe publishes ticks / slack-positive / sagged>base /
**tightened** / mean sag / max sag / mean stance before → after, plus the inherited
`SAG-FIRED` predicate at `SAG_MATERIAL_M = 1.4 m`.

⚠ **DIFFERENCE FROM THE RULER, stated exactly**: in MT-T1 a **gate** (F-MT-a limb 1) read
`SAG_MATERIAL_M`. **In this stage NO gate and NO knee limb reads it.** The census is the
per-dose trace the dispatch asks to carry, and the threshold is still pinned so it cannot
drift.

### §5.5 GUARDS riding the battery — the #157 instrument debt

* **offside FLAG** — a resolved rise at any dosed arm returns the axis to the **USER**; it
  **never** flips the knee and never fails the run (the F-S2d form).
* **foul counter**, **penalties** and the **E4 combination counters** — **REPORTED with
  CIs, never gated** (A4-S2P3 §4.3's binding "not a second bite" rule).

### §5.6 REPORTED — no gate anywhere

* **The swallow share** at 0.5/1.0/2.0 m. **Degenerate (NaN) at the CONTROL only** — all
  four dosed arms carry the PM gene, so unlike MT-T1 the ask is **live at every dosed arm**.
* **Mark-assignment drift**: `markShare`, far-side mark share, `distToMark`, `markLatGap`
  per arm with CIs — the [MARK-SELECTION-CODE-MAP §2.4](MARK-SELECTION-CODE-MAP.md)
  positional-feedback channel named by #202.2. Visible and attributed, **not a predicate**.
* **The ask instruments** (a RECOMPUTED COUNTERFACTUAL station read, #197-L6) and the D2
  steer mix in PM-T1's **SPLIT** taxonomy (#197-L5b: not bucket-comparable to #188's
  without re-merging).
* **The detach / steer receipts**: per-arm episode counts, trigger-tick share, levels for
  the weak back **and** the ball-side control mirror, and the six worst-detachment episodes
  per arm with `watchHint` strings.
* **The per-arm body rows in MT-T1's PRIMARY shape** (`mtT1PrimaryShape`) — continuity
  only; it decides nothing here.

### §5.7 The X-family (HARD — failure ⇒ the measurement is invalid)

| gate | predicate / semantics |
| --- | --- |
| `xDet` | the whole core computed **twice**, canonical-JSON digests equal |
| `xFpProd` | the shipped fingerprint re-derived **in-probe** (seed 1337, 2 seasons) = `57b0bdab…c673` (#181.2) |
| `xSrcZero` | `git diff --stat -- src` empty — instrument-only |
| `gArm` | **BOTH** #196.3-D4 checklists per arm: the two flags exactly as frozen, each gene on all three views of both teams, `pmLaneConvergenceK` **and** `markSagWeight` exact, **both** evolution opt-in channels shown LIVE |
| `gInherit` | ⭐ **the ruler is inherited, not re-implemented**: **26** defining lines pinned VERBATIM in their original files (`gates.gInherit.rows.length === 26` in the committed artifact — the #203 miscount lesson: the count is read from the artifact, not typed from memory). 19 are MT-T1's own pin set (pm-t1 / mt-t0 / `src/ai/actionExecutor.ts`); **7 are new pins into `mt-t1-ruler-rerun.ts` itself** — `SPREAD_R`, `NI_FRACTION`, both band rows, `SAG_MATERIAL_M`, the N rule's variance term and its precision term. **If MT-T1 moves, this gate goes RED.** |
| `gCtrlEq` | an ARMED-ZERO **world** (both flags on, both genes ABSENT) ≡ ABSENT (both flags off), whole-match signature **including the rng stream**, first min(8, N) seeds. ⚠ **THE TWO WORLDS DIFFER IN CODE PATH** — armed ⇒ both seam branches are ENTERED and both weights evaluate to 0. ⚠ **DIFFERENCE FROM THE RULER**: MT-T1 ran armed-zero as an ARM; here it is a **gate world only** and contributes no measured quantity |
| `gSeed` | block disjointness vs all **sixteen** consumed blocks, in-band, and the three own sub-blocks mutually disjoint + ordered |
| `gStats` | bootstrap base 104,200, gap ≥ 200 from all twelve published bases |
| `gReadOnly` | `abandonRestDesignation` / `homeRegionGrant` / `homeMapGrant` null on every match **and** `stationEye === null` |
| `gNDerived` | the N run **is** the frozen §4 rule's output (RED on an `MTLAD_N` override in full mode) |

**EXIT SEMANTICS** (the commander's monitor reads these):

```text
0 — X-family green; the knee is computed and printed per the frozen rule,
    INCLUDING its two fallback branches (every branch lands a dose)
1 — an X-family HARD gate failed ⇒ the MEASUREMENT is invalid, read nothing else
    (there is NO exit 2: this stage pre-names no STOP)
```

## §6 FREEZE HONESTY

1. **The smoke adjudicates NOTHING.** It proves plumbing and publishes exactly two sizing
   numbers (ms/match, minimum paired-BODY yield) which feed **only N**. No level, share,
   rate, CI, knee row or verdict from it is a finding, and **it may not tune any threshold**
   (machine-readable as `smokeAdjudicatesNothing`).
2. **No re-cut after sight, and NO NEW THRESHOLD ANYWHERE.** Every constant is a prior
   stage's traced one; the knee rule is a recomposition of three inherited predicates, and
   **its fallback branches were frozen WITH it** so no branch can be chosen after sight.
3. **FAILs are reported as-is.** A dose that fails a limb is published with its failing limb
   and its numbers; the achieved half-widths are published whether or not they meet the
   target.
4. **Dose 1.0 is not re-run** (#209.1) — cited, byte-hashed, and **no level is read out of
   any prior artifact**.
5. **No checkpoint/resume**, unlike MT-T2: the battery is ~15 min, so a kill costs the whole
   run and the run is simply relaunched. **Stated, not hidden.**
6. **This stage ships nothing.** Road B: `src/**` untouched, both flags absent from every
   bundle and play-test world, both genes born absent, the production fingerprint re-derived
   unchanged.

### §6.5 The exit-semantics sub-block, stated exactly

Proving that a full-mode `MTLAD_N` override turns `gNDerived` **RED** and exits **1**
requires stepping full-mode matches. The probe routes any overridden full-mode run onto
**12,420,100–199**; that check consumed **12,420,100–101** this round and its artifact was
written to `/tmp` and discarded. **The battery block 12,420,200–999 is therefore VIRGIN.**

## §7 WHAT THIS BATTERY DOES NOT DO

* It does **not** decide whether the tuck-in is **good football**, and it cannot authorize
  shipping. The knee is an exhibit dose; **the play-test is the verdict**.
* It does **not** re-measure the 2×2 seam decomposition (PM-alone / MT-alone): it walks the
  **coupled** axis the user would play (#209.1).
* It makes **no oscillation claim** (`switchKey` is retracted, #188 §8.4) and touches mark
  **selection** not at all — drift is measured and reported, never gated, never fixed.
* It does not measure prod-shaped or A4-armed worlds, the asymmetric dose, the attacking
  phase, the carrier-state term, or the coach layer.
* It says nothing about what **selection** would do with these doses — #208 already
  answered that (indifferent), and this battery runs **no evolution**.

---

## §SMOKE — PLUMBING ONLY (adjudicates NOTHING)

6 seeds @ 12,420,000–005 × 5 arms, `MTLAD_MODE=smoke`, wall **20.3 s**, **113.4 ms/match**.
Artifact [`data/mt-ladder-smoke.json`](data/mt-ladder-smoke.json), `resultSha256`
**`8f723c2ff66865d2fb829039feb6597d65e720abce4b287cd98929299bd15602`**, artifact-bytes sha256
**`16a5644259274c8d9964606418d5c5c60c94ca8de1731ce77d30b6e4553473b7`** — both quoted from **this
round's committed artifact** and nowhere else (the #194-M1 lesson). Per #197-M1 the hashed
body is **commit-free and timing-free** (`headContextOnly` / `wallContextOnly` ride the
envelope, outside the hash), so `MTLAD_MODE=smoke npx tsx scripts/probes/mt-ladder.ts`
re-derives `8f723c2f…5602` at any commit — **measured, not asserted**: two consecutive
smoke runs produced the identical `resultSha256` while the artifact FILE bytes moved
(timings), which is exactly why the two shas are distinct and both are pinned.

**What this section is**: proof that the five arms construct, the instruments produce
numbers, the knee rule evaluates and prints, the artifact writes and the exit codes work.
**What it is not**: evidence about anything. At 6 seeds the paired contrasts run on
**n = 1–2 seeds**; every number below is noise with a decimal point.

⚠ **The transcript below is the COMPLETE stdout of the committed run, copied whole** (the
#197-M2 lesson): all four body rows, all four MT-T1-shape rows, all ten sag-census rows,
all five BAND rows **including the four FAILs**, all four GUARD-NI rows, every REPORTED row,
**all four knee rows including the four `QUALIFIES false`**, and the full gate/verdict tail.
**Nothing is elided.** The band failures, the positive body deltas at D06/D08 and the
`NONE_ABOVE_FLOOR` knee branch adjudicate **nothing** — they are n = 1–2 plumbing — but they
are the smoke's output and they are published.

```text
=== MT-LADDER — THE DOSE LADDER (smoke) — HEAD fd8c9e6 — 6 seeds × 5 arms, block 12420000..12420005 ===
arms ABSENT[pm off/absent · mt off/absent]  D02[pm on/0.2 · mt on/0.2]  D04[pm on/0.4 · mt on/0.4]  D06[pm on/0.6 · mt on/0.6]  D08[pm on/0.8 · mt on/0.8]
episodes/arm ABSENT:8  D02:2  D04:7  D06:7  D08:5

THE BODY, per dose (paired per-seed vs ABSENT; bodyLatGap is KNEE LIMB (c), the rest REPORTED):
  D02       body -2.455087 [-2.455087, -2.455087] n=1 ✔ · shortfall +0 [0, 0] n=1 · detach +1.075579 [1.075579, 1.075579] n=1 ✔
  D04       body -2.553442 [-8.101429, 2.994545] n=2 · shortfall -3.421411 [-8.101429, 1.258607] n=2 · detach -3.774372 [-6.138512, -1.410233] n=2 ✔
  D06       body +2.040085 [-5.237554, 9.317724] n=2 · shortfall -0.814339 [-4.980296, 3.351619] n=2 · detach +0.404868 [-7.902386, 8.712121] n=2
  D08       body +4.54179 [2.680245, 6.403334] n=2 ✔ · shortfall +0.905942 [0.769205, 1.04268] n=2 ✔ · detach +0.022383 [-1.319646, 1.364412] n=2
  D02       bodyFalls true · shortfallFalls false · detachNotUp false ⇒ MT-T1-PRIMARY-shape false (REPORTED — gates nothing here)
  D04       bodyFalls false · shortfallFalls false · detachNotUp true ⇒ MT-T1-PRIMARY-shape false (REPORTED — gates nothing here)
  D06       bodyFalls false · shortfallFalls false · detachNotUp true ⇒ MT-T1-PRIMARY-shape false (REPORTED — gates nothing here)
  D08       bodyFalls false · shortfallFalls false · detachNotUp true ⇒ MT-T1-PRIMARY-shape false (REPORTED — gates nothing here)
  achieved body half-widths: D02 ±0 · D04 ±5.547987 · D06 ±7.277639 · D08 ±1.861544

SAG CENSUS (weak-side back, EVERY in-trigger tick — REPORTED; no gate reads it here):
  ABSENT    ticks 1081 · slack+ 999 · sagged>base 0 · tightened 0 · meanSag(slack+) 6.504853 m · max 9 m · stance 1.93008 → 1.93008 m ⇒ SAG-FIRED false
  D02       ticks 359 · slack+ 287 · sagged>base 287 · tightened 0 · meanSag(slack+) 6.182525 m · max 9 m · stance 1.756877 → 2.745392 m ⇒ SAG-FIRED true
  D04       ticks 614 · slack+ 565 · sagged>base 565 · tightened 0 · meanSag(slack+) 5.882268 m · max 9 m · stance 1.851459 → 4.016594 m ⇒ SAG-FIRED true
  D06       ticks 887 · slack+ 858 · sagged>base 858 · tightened 0 · meanSag(slack+) 7.175951 m · max 9 m · stance 1.835356 → 6.000158 m ⇒ SAG-FIRED true
  D08       ticks 733 · slack+ 532 · sagged>base 532 · tightened 0 · meanSag(slack+) 5.023075 m · max 9 m · stance 1.93271 → 4.849246 m ⇒ SAG-FIRED true
  ABSENT    [match-wide] ticks 15741 · slack+ 10764 · sagged>base 0 · tightened 0 · meanSag(slack+) 5.011002 m · max 9 m
  D02       [match-wide] ticks 14652 · slack+ 9757 · sagged>base 9757 · tightened 0 · meanSag(slack+) 4.498025 m · max 9 m
  D04       [match-wide] ticks 14310 · slack+ 9697 · sagged>base 9697 · tightened 0 · meanSag(slack+) 4.3851 m · max 9 m
  D06       [match-wide] ticks 14298 · slack+ 9607 · sagged>base 9607 · tightened 0 · meanSag(slack+) 4.011992 m · max 9 m
  D08       [match-wide] ticks 14369 · slack+ 9412 · sagged>base 9412 · tightened 0 · meanSag(slack+) 3.764743 m · max 9 m

BAND — gated crosses,headers,longBalls,cutbacks · excluded as substrate drift goals
  BAND ABSENT    PASS: goals 1.5 [2.03524, 2.75356] OUT · crosses 3 [1.86705, 3.11175] ok · headers 8.833333 [6.827925, 11.379875] ok · longBalls 5.5 [4.65315, 7.75525] ok · cutbacks 3 [2.861325, 4.768875] ok
  BAND D02       FAIL: goals 1.5 [2.03524, 2.75356] OUT · crosses 2.166667 [1.86705, 3.11175] ok · headers 3.166667 [6.827925, 11.379875] OUT · longBalls 2.666667 [4.65315, 7.75525] OUT · cutbacks 2.833333 [2.861325, 4.768875] OUT
  BAND D04       FAIL: goals 1.666667 [2.03524, 2.75356] OUT · crosses 1.666667 [1.86705, 3.11175] OUT · headers 5.5 [6.827925, 11.379875] OUT · longBalls 5.333333 [4.65315, 7.75525] ok · cutbacks 3.666667 [2.861325, 4.768875] ok
  BAND D06       FAIL: goals 1.166667 [2.03524, 2.75356] OUT · crosses 3.5 [1.86705, 3.11175] OUT · headers 4.333333 [6.827925, 11.379875] OUT · longBalls 2.666667 [4.65315, 7.75525] OUT · cutbacks 2.166667 [2.861325, 4.768875] OUT
  BAND D08       FAIL: goals 2.5 [2.03524, 2.75356] ok · crosses 1.666667 [1.86705, 3.11175] OUT · headers 3.833333 [6.827925, 11.379875] OUT · longBalls 2 [4.65315, 7.75525] OUT · cutbacks 2.833333 [2.861325, 4.768875] OUT

GUARD-NI (knee limb (b)) — tol = 0.2763 × the CONTROL's own level, THIS run:
  GUARD-NI D02       PASS: spreadYOut ok (-0.253829 [-0.584684, 0.084034] n=6 vs ±1.637471) · spacingMedian ok (-0.558029 [-1.168861, -0.129042] n=6 ✔ vs ±3.741563) · spacingUnder4 ok (+0.000199 [-0.016213, 0.013077] n=6 vs ±0.023599) · dupRunShare ok (-0.062076 [-0.252282, 0.152415] n=6 vs ±0.157302)
  GUARD-NI D04       PASS: spreadYOut ok (-0.460165 [-0.568303, -0.329898] n=6 ✔ vs ±1.637471) · spacingMedian ok (-0.149031 [-0.613383, 0.452194] n=6 vs ±3.741563) · spacingUnder4 ok (+0.000408 [-0.009932, 0.012141] n=6 vs ±0.023599) · dupRunShare ok (-0.018718 [-0.134068, 0.138246] n=6 vs ±0.157302)
  GUARD-NI D06       PASS: spreadYOut ok (-0.484418 [-0.655021, -0.289636] n=6 ✔ vs ±1.637471) · spacingMedian ok (-0.363041 [-1.02706, 0.153229] n=6 vs ±3.741563) · spacingUnder4 ok (-0.005658 [-0.018013, 0.004089] n=6 vs ±0.023599) · dupRunShare ok (-0.180509 [-0.360589, -0.031096] n=6 ✔ vs ±0.157302)
  GUARD-NI D08       PASS: spreadYOut ok (-0.715996 [-0.830475, -0.560872] n=6 ✔ vs ±1.637471) · spacingMedian ok (-0.467968 [-1.158607, 0.208308] n=6 vs ±3.741563) · spacingUnder4 ok (-0.002218 [-0.014443, 0.007444] n=6 vs ±0.023599) · dupRunShare ok (-0.185157 [-0.33079, -0.053981] n=6 ✔ vs ±0.157302)

REPORTED — THE ASK (no gate; LIVE at every dosed arm — all four carry the PM gene):
  D02       ask -9.818871 [-9.818871, -9.818871] n=1 ✔ · askShiftY +0.77927 [0.77927, 0.77927] n=1 ✔
  D04       ask -1.964943 [-2.502049, -1.427837] n=2 ✔ · askShiftY +1.811087 [1.781863, 1.84031] n=2 ✔
  D06       ask -5.71278 [-9.329147, -2.096412] n=2 ✔ · askShiftY +2.488635 [2.427682, 2.549588] n=2 ✔
  D08       ask -5.934951 [-9.221867, -2.648035] n=2 ✔ · askShiftY +3.542856 [3.245771, 3.839941] n=2 ✔
REPORTED — THE SWALLOW SHARE (no gate; NaN at the CONTROL, where the PM gene is absent):
  ABSENT    @1 m: material ticks 0 · markStance NaN · stationWalk NaN
  D02       @1 m: material ticks 39 · markStance 0.25641 · stationWalk 0
  D04       @1 m: material ticks 456 · markStance 0.756579 · stationWalk 0.243421
  D06       @1 m: material ticks 420 · markStance 1 · stationWalk 0
  D08       @1 m: material ticks 394 · markStance 1 · stationWalk 0
REPORTED — MARK-ASSIGNMENT DRIFT (no gate; the #202.2 emergent feedback channel):
  D02       markShare -0.359223 [-0.359223, -0.359223] n=1 ✔ · farSide NaN [NaN, NaN] n=0 · distToMark NaN [NaN, NaN] n=0
  D04       markShare -0.023077 [-0.046154, 0] n=2 · farSide +0.109947 [0.109947, 0.109947] n=1 ✔ · distToMark +1.771189 [1.771189, 1.771189] n=1 ✔
  D06       markShare +0.320388 [0, 0.640777] n=2 · farSide -0.074987 [-0.372196, 0.222222] n=2 · distToMark +1.083996 [0.880175, 1.287818] n=2 ✔
  D08       markShare +0.320388 [0, 0.640777] n=2 · farSide +0.000062 [0, 0.000124] n=2 · distToMark +5.844291 [4.780684, 6.907899] n=2 ✔
OFFSIDE FLAG quiet — D02 -0.833333 [-1.833333, -0.166667] n=6 ✔ · D04 -0.833333 [-1.5, -0.166667] n=6 ✔ · D06 -1 [-1.666667, -0.333333] n=6 ✔ · D08 -1.333333 [-2.166667, -0.666667] n=6 ✔

⭐ THE KNEE (ruling #209.2, frozen ex ante — the LARGEST dose holding band ∧ GUARD-NI ∧ body<0):
  dose 0.2 (D02) band FAILS[headers,longBalls,cutbacks] · GUARD-NI PASS · body<0 true (-2.455087 [-2.455087, -2.455087] n=1 ✔) ⇒ QUALIFIES false
  dose 0.4 (D04) band FAILS[crosses,headers] · GUARD-NI PASS · body<0 false (-2.553442 [-8.101429, 2.994545] n=2) ⇒ QUALIFIES false
  dose 0.6 (D06) band FAILS[crosses,headers,longBalls,cutbacks] · GUARD-NI PASS · body<0 false (+2.040085 [-5.237554, 9.317724] n=2) ⇒ QUALIFIES false
  dose 0.8 (D08) band FAILS[crosses,headers,longBalls,cutbacks] · GUARD-NI PASS · body<0 false (+4.54179 [2.680245, 6.403334] n=2 ✔) ⇒ QUALIFIES false
  qualifying doses: none · branch NONE_ABOVE_FLOOR ⇒ ⭐ KNEE = 0.2
  NO dose ≥ 0.4 qualifies ⇒ the pre-registered fallback: 0.2, the measured-healthy anchor (#208). ⚠ This branch fires REGARDLESS of whether 0.2 itself qualifies on this run — that is what the rule says, and the 0.2 row is published either way.
  CITED, NOT RE-RUN: dose 1 (#204) sha256 9d4d1fc8524c… · drift dose (#208) sha256 12cb2fd42d31…

X-FAMILY GREEN: xDet ok · xFpProd ok · xSrcZero ok · gArm ok · gInherit ok · gCtrlEq ok · gSeed ok · gStats ok · gReadOnly ok · gNDerived ok
X-DET digest 4dada639b8a4fbab6bb2301b5a90e84fa7907e5d3a9157315a62738b0b39c5ad
resultSha256 8f723c2ff66865d2fb829039feb6597d65e720abce4b287cd98929299bd15602
wall 20.268s · 113.4 ms/match · pairYieldMin 0.1667 · artifact docs/world-model/data/mt-ladder-smoke.json
VERDICT: SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING
⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.
```

**The plumbing verdict, and only that:** all ten X-family gates green (X-DET byte-identical
across two core passes; the production fingerprint re-derived `57b0bdab…c673`;
`git diff --stat -- src` empty; **both** arming checklists satisfied on all five arms with
`k_PM` and `markSagWeight` exact at every dose and **both** opt-in channels live; **all 26**
inheritance pins found; the armed-zero gate world byte-identical to ABSENT on 6/6 seeds
*through both live branches*; seeds and stats disjoint — measured minimum stats gap 200; the
read-only assertions and `stationEye === null` hold). The knee rule evaluated every row and
printed the branch it took; the sag census is instrument-visible and **tightened = 0 on
every arm** (the seam only ever adds distance) with the mean stance rising with dose
(1.76 → 2.75 m at D02 · 1.84 → 6.00 m at D06), which is the plumbing check that the dose
channel actually carries the dose.

**Exit-code verification, stated exactly.** `MTLAD_MODE=full MTLAD_N=2` (routed onto the
exit-semantics sub-block 12,420,100–101, artifact written to `/tmp` and discarded) printed
`gNDerived FAIL`, `X-FAMILY *** RED ***`, `VERDICT: X-FAMILY FAIL — the measurement is
invalid` and returned **exit 1** — and, on the way, printed the full-mode derivation
`pairsNeeded 213 / pairYield 0.1667 = 1278 → step 1300 · wall 6336 · cap 800 ⇒ N* 800
(reservedBandCap binds)`. There is no exit 2 to exercise: this stage pre-names no STOP.

⚠ **Do not read the smoke's body movements, its band results, its sag magnitudes or its
knee row as findings.** They are n = 1–2 realisations of a battery sized at n = 800.

## §LAUNCH — the commander's run

```bash
cd /Users/jamie/Documents/Promptfoo/evofootball-arena && \
  nohup env MTLAD_MODE=full npx tsx scripts/probes/mt-ladder.ts \
  > /tmp/mt-ladder-full.log 2>&1 &
```

* **N is NOT passed**: `MTLAD_N` in full mode turns `gNDerived` RED **and** diverts the run
  off the battery block. N = 800 comes from the frozen §4 rule on the committed smoke
  artifact, and the probe prints the whole derivation at startup before the first match.
* **Artifact**: `docs/world-model/data/mt-ladder.json` (the smoke's own artifact at
  `…-smoke.json` is not overwritten).
* **Expected wall**: 800 seeds × 5 arms × 2 X-DET passes × ~113 ms ≈ **0.25 h ≈ 15 min** of
  core, plus ~30 s for the 8-seed armed-zero gate and ~10 s for the in-probe fingerprint ⇒
  **≈ 16 min** on the smoke's box; budget 2 h. A projection, gating nothing.
* **Progress cadence**: a `[mt-ladder passN] done/total · elapsed · s/match · ETA` line at
  least every **30 s** of wall time, on stderr.
* ⚠ **NO RESUME**: a kill costs the whole run (§6 item 5); relaunch from scratch. Launch
  from the repo root (the pins and `git diff -- src` are read relative to cwd).
* **Exit semantics**: `0` clean (the knee is printed) · `1` X-family failure (measurement
  invalid). There is no exit 2.
* **At adjudication**: compare the run's `nDerivation.smokeArtifactSha256` against the §4
  pin; read `results.body.achievedHalfWidthM` against the 0.5 m target before quoting any
  CI (the cap binds); and ⭐ **adjudicate from `results.knee.rows` and the per-arm band /
  GUARD-NI rows, never from the knee line or the verdict string** (#203).

## §RESULT — the ladder runs

*(Filled by the COMMANDER at adjudication, ruling #211 — every number quoted FROM the
committed [`data/mt-ladder.json`](data/mt-ladder.json) / its stdout; recompute with
`MTLAD_MODE=full npx tsx scripts/probes/mt-ladder.ts`.)*

**Run**: 2026-08-09, HEAD `3cb11c3`, N = 800 × 5 arms × 2 X-DET passes, wall 768.6 s,
EXIT 0, X-FAMILY GREEN (all ten). `resultSha256 1716ffa3…393b` · X-DET `6a5f69fa…008d`.

**THE KNEE (the frozen #209.2 rule): no dose qualifies ⇒ branch NONE_ABOVE_FLOOR ⇒
KNEE = 0.2** (the pre-registered fallback; the 0.2 row itself also fails the band —
published either way, as the rule requires):

```
  dose 0.2  band FAILS[goals 1.99, headers 6.57, longBalls 4.42] · GUARD-NI PASS · body −0.586 [−1.294, +0.147] NOT resolved
  dose 0.4  band FAILS[goals 1.91, headers, longBalls]           · GUARD-NI PASS · body −1.445 ✔
  dose 0.6  band FAILS[goals 1.74, crosses, headers, longBalls]  · GUARD-NI PASS · body −2.339 ✔
  dose 0.8  band FAILS[goals 1.73, crosses, headers, longBalls]  · GUARD-NI PASS · body −2.396 ✔
  (control holds the band on all five: goals 2.19, crosses 2.25, headers 8.55, longBalls 5.87, cutbacks 3.36)
```

⭐ **THE LOAD-BEARING FINDING: the trade is CONTINUOUS — there is no free dose.** The
dose-response is smooth on both axes (ask −1.12/−1.77/−2.76/−3.66; body −0.59/−1.45/
−2.34/−2.40; goals 1.99/1.91/1.74/1.73; headers −23 %…−44 %), GUARD-NI passes
everywhere (compression, never clump), offsides fall at every dose, far-side glue
softens (D04+ resolved). **The equilibrium band — calibrated on the no-tuck world —
and a visibly working weak-side defence are mutually exclusive**: even 0.2 dents
headers −23 % below tolerance, while 0.2's own body effect is not resolved at N = 800.
Reconciliation with #208 (honest, frames differ): #208's "healthy at ≈0.2" was the
EVOLUTION frame (evolved genomes + goals-warming inflation masking the dent; gen-8 in
band, gen-25 confounded); THIS ladder is the ruler's production frame — the calibrated
one — and it prices the same dose at headers −23 %. No contradiction; the ruler frame
is the honest price tag. **Watchability has no instrument (the E4 lesson) — whether a
lower-scoring, better-defended world is better FOOTBALL is exactly the user's
play-test verdict, now carrying the whole decision.**

---

## §ENTRY — the two play-test worlds (ruling #211.3)

*(Appended by the ENTRY executor. The worlds are **opt-in, default OFF, nothing ships**:
production is byte-identical with them off — fingerprint `57b0bdab…c673` re-derived
unchanged, `League.matchFlags` still `{}`, both genes still born absent. Road B intact.)*

### How to reach them

| | world | how | badge on screen |
| --- | --- | --- | --- |
| **the ruled knee** | `4` | ⚙ → 🧬 Experimental → **MT 0.2 · 松盯内收 (play-test)**, or `?a4world=4` | `🧪 MT 0.2 · 松盯内收` |
| **the contrast** | `5` | ⚙ → 🧬 Experimental → **MT 0.8 · 松盯内收 对比 (play-test)**, or `?a4world=5` | `🧪 MT 0.8 · 松盯内收(对比)` |

The `?a4world=N` link is the phone entry (it sticks, so it only has to be opened once);
`?a4world=0` or unticking the box returns the shipped world. **One value, five worlds** —
arming either MT world disarms the A4 worlds v1/v2/v3 and vice versa, so every A/B is
between two clean worlds. **WATCHED MATCHES ONLY** (the E4 semantics, unchanged since
#155): the world is pushed onto matches started from now on — a match already in flight
keeps the brain it kicked off with, the league's simulated results are untouched, and no
saved league is rewritten.

### What each world arms (fidelity: the ladder arms, not a re-derivation)

Both worlds arm **BOTH seams together**, exactly as every dosed ladder arm did:

* construction flags `MT_WORLD_FLAGS` = `edsPerceivedDefence` + `edsPerceivedChoice`
  (the probe's `PERCEPT_FLAGS`, i.e. the substrate PM-T0/PM-T1's receipts ran in) **+**
  the two consumption flags `pmLaneConvergence` + `mtMarkSag`; `stationEye` stays
  **null** (`frozenDesign.world`, verbatim — these are **not** A4 worlds: no eye, no
  whisper, no discipline family);
* the genes `defLaneConvergence` **and** `markSag`, EQUAL, at the world's one dose
  (world 4 → **0.2** = arm **D02**; world 5 → **0.8** = arm **D08**), written on all
  **three** genome views (`info.genome` / `baseGenome` / `effGenome`) of **both** teams
  — the `a4World` `armGenes` idiom, the REAL gene channel (#196.3-D6; the ladder's
  `doseBothTeams`).

⚠ **FIXED DOSE — the evolution opt-ins are NOT armed.** The arming checklists (#196.3-D4)
name three channels per seam: flag + evolve opt-in + non-absent gene. A play-test world
arms the flag and the gene and deliberately leaves `evolveDefLaneConvergence` /
`evolveMarkSag` **OFF** — they govern mutation and crossover, and a fixed armed world
mutates nothing. **Nothing in your league evolves either gene**: the dose you switch on is
the dose you watch, season after season, and it never drifts (the #165.2.ii reading the
entry already applies to the A4 v2 family).

**The fidelity receipt** is `tests/mtPlaytestEntry.test.ts`, triple-anchored per the #168
precedent — every flag and both doses are read back from (i) the committed artifact
[`data/mt-ladder.json`](data/mt-ladder.json) (`frozenDesign.arms` D02/D08 +
`frozenDesign.world`, run `resultSha256 1716ffa3…`), (ii) the probe source
[`../../scripts/probes/mt-ladder.ts`](../../scripts/probes/mt-ladder.ts) (its `ARMS` and
`PERCEPT_FLAGS` literals) and (iii) §2's arm table above — no number is typed into the
entry that the ladder did not measure. The same file pins byte-identity off (fingerprint,
unarmed match, flags-only ≡ unarmed) and that the dose BITES (armed ≠ flags-only ≠
production, 0.8 ≠ 0.2), and the worlds add **nothing** to the every-install payload — they
carry no census tables at all, unlike the A4 worlds.

### What you are looking at

**MT 0.2 (the ruled knee)** — a marker holds a little further off the man he is watching
while the ball is in flight, and the back line drifts toward the ball's lane. This is the
dose the frozen knee rule returned (#211.1: its NONE_ABOVE_FLOOR fallback).

⚠ **HONEST EXPECTATION: at 0.2 the body effect is SUB-RESOLUTION.** The ladder measured
the weak-side body at **−0.586 m [−1.294, +0.147] — not resolved at N = 800**. The eye may
see nothing at all. That is not a bug in the world and not a failure of your eyes; it is
what "the knee is small" means. It is here as the *default*-named world because it is the
ruled dose, and because the honest question is whether the smallest defensible dose is
already enough to fix what you saw.

**MT 0.8 (the contrast)** — the same world at the visible dose. Body **−2.396 m
(resolved)**, the weak-side defender genuinely stops spinning; and the price is equally
visible — **goals 1.73 vs the control's 2.19**, headers −44 %, crosses and long balls
down with them. This is the mechanism world: watch it to learn what the tuck-in *is*, then
go back to 0.2 and ask whether you can still see it.

⭐ **THE FINDING THIS PAIR EXISTS TO SHOW: there is no free dose.** The band and a visibly
working weak-side defence are mutually exclusive — you are choosing a point on a
continuous trade, not finding a setting that gets both.

### The exit questions (yours to answer — watchability has no instrument)

1. **弱侧后卫还乱转吗?** — the thing that started this: does the far-side defender still
   spin on the spot when play is on the other flank?
2. **防守知道往哪走了吗?** — does the defensive shape look like it has a plan?
3. **看得出松盯内收吗?** — can you actually SEE the sag-and-tuck (at 0.8, and then at
   0.2)?
4. ⭐ **进球变少的世界好看还是难看?** — the one that decides this: is a
   lower-scoring, better-defended match better football, or worse?

*(No instrument answers #4. The play-test verdict is the ruling.)*
