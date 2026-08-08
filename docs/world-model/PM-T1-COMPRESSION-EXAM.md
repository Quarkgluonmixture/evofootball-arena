# PM T1 — THE COMPRESSION EXAM (forced doses on the certified `defLaneConvergence` seam)

Status: **PRE-REGISTERED 2026-08-08. The battery has NOT been run.** Everything below
— the dose vector, the seed block, the N rule, every gate predicate with its numbers,
every tolerance and its source — was frozen **before any full-N number existed**. The
only numbers in this document are (a) the SMOKE's, labelled `SMOKE — PLUMBING ONLY`,
which adjudicate **nothing** and tune **no** threshold, and (b) constants quoted from
published, committed prior stages with their citations. §RESULT is empty by design:
the commander launches the full battery detached per §0.0.4 and adjudicates it.

⚠ **FIX ROUND, ruling #197.4 (2026-08-08).** #197's machine-verify FAILed this build on
**six evidence-reporting findings** (2 MEDIUM + 4 LOW) while verifying the DESIGN
contract-faithful end to end. All six are corrected **in place** below, each marked
**⚠ CORRECTION** with the old claim left readable: M1 the hashed body's `head` (§SMOKE),
M2 the asymmetrically abridged transcript (§SMOKE), L3 the N-input provenance (§4), L4
the p50-as-mean substitution (§4), L5 the two non-verbatim inheritances (§5.3, §5.4),
L6 §5.1's live-consumption wording. **The frozen exam design did not move**: no gate,
predicate, tolerance, dose, seed or the N rule was touched. The smoke was re-run on its
own already-consumed seeds (12,311,200–205) — a plumbing re-measurement, not an exam —
and the N rule's re-evaluated output on it is disclosed in §4 (**N\* = 650, unchanged**).

Authority chain: contract
[`PHASE-MODULATION-CONTRACT.md`](PHASE-MODULATION-CONTRACT.md) — §1 **H-PM** (the
claim) · §2 **M-PM.1–5** (the term, the phase gate, the read fork, perception
honesty, what is not built) · §3 the **PM-T1** clause (forced doses; success = the
ASK moves resolvedly and dose-responsively; **the ANSWER measured separately**;
guards at frozen tolerances; the #157 instrument debt rides; mark drift REPORTED not
gated) · §3 the pre-named **F-PM-a** / **F-PM-b** · §4 the non-claims. Seam:
[`PM-T0-DORMANT-SEAM.md`](PM-T0-DORMANT-SEAM.md) (§LAW `k_PM = clamp01(gene)·0.25`,
the read table, the restart trace, the ⚠ CORRECTION rows). Ruling **#196.5** (this
dispatch: PM-T1 first; one executor step drafts the doc, builds the instruments and
smokes at tiny N; the commander launches the battery), carrying **#196.3-D4** (⚠ THE
ARMING CHECKLIST IS BINDING), **#196.3-D6** (doses travel the REAL gene channel via
genome views — no engine-side dose surface), **#181.2** (receipts = committed
recomputable artifacts; no doc-typed hashes) and the **#194/#196** evidence-reporting
lessons (state each gate's semantics exactly — say what the arms DIFFER in;
completeness claims only from `git show --stat`).

Instruments re-armed from [`FARSIDE-DEFENDER-FORENSIC.md`](FARSIDE-DEFENDER-FORENSIC.md)
(#188): the trigger §1, the weak-side-back slot rule §2.1 with its ball-side control
mirror, the send-target lane gap §3.3 (**the ASK**), the body lane gap / compression
shortfall / detachment §3.1–§3.3 (**the ANSWER**), the D1 mark anchor and the D2
steer-owner mix. **Two of that census's own retractions bind this build**: the
`switchKey` oscillation metric is **not computed anywhere in this probe** (§8.4
retraction; [`MARK-SELECTION-CODE-MAP.md`](MARK-SELECTION-CODE-MAP.md) §5 trap 7 —
any oscillation read needs a NEW instrument or none, and this exam takes *none*), and
the heading-flip metric is likewise absent (§8.4 disclosed it as near-vacuous by
construction). This exam therefore makes **no oscillation claim at all**.

Probe: [`../../scripts/probes/pm-t1-compression-exam.ts`](../../scripts/probes/pm-t1-compression-exam.ts).
Artifacts: [`data/pm-t1-compression-exam-smoke.json`](data/pm-t1-compression-exam-smoke.json)
(committed, this round) and `data/pm-t1-compression-exam.json` (the commander's run).

---

## §1 The question, in the order it is asked

1. **THE ASK** (the PRIMARY, the only thing H-PM claims): with the gene forced, does
   the defensive send target for the weak-side back stop sitting 18–20 m off the
   ball's lane? Resolvedly, and dose-responsively.
2. **THE ANSWER** (measured separately, never merged into the ask): does the BODY
   follow? The #188 body instruments — lane gap, compression shortfall, detachment.
3. **WHAT IT COSTS**: the B1-a collapse the architecture froze this choice to avoid
   (spreadY), the spacing floors, dupRun — all at tolerances **inherited**, not
   invented.
4. **WHAT IT DRAGS WITH IT**: mark-assignment drift through the map §2.4
   positional-feedback channel — REPORTED, never gated, never designed away.

## §2 THE FROZEN DESIGN

### §2.1 The dose vector

| arm | `defLaneConvergence` | `k_PM` | what it is |
| --- | --- | --- | --- |
| **D000** | **ABSENT** | 0.0000 | the CONTROL |
| D025 | 0.25 | 0.0625 | |
| D050 | 0.50 | 0.1250 | |
| D075 | 0.75 | 0.1875 | |
| **D100** | **1.00** | **0.2500** | the frozen PM-T0 ceiling |

Four equal steps spanning the gene's whole domain `[0,1]`, plus the absent control.
**No dose exceeds the ceiling**, and the ceiling is PM-T0's traced constant (the
legacy `:209` convergence weight) — **it is not re-cut to make this exam succeed**
(PM-T0 §LAW pre-committed to exactly that).

**The control is the gene ABSENT with the flag ARMED**, not flag-off. That is PM-T0's
G-BORN world, and it makes the arms differ in **exactly one thing**: the value of
`defLaneConvergence`. `G-CTRLEQ` re-proves inside this exam's own world that the
control is byte-identical to flag-off, rng stream included. ⚠ **Semantics, exactly
(#194)**: those two arms **differ in code path** — armed ⇒ `pmMover` is true ⇒ the
M-PM.1 branch is *entered* on every defensive mover read and `k_PM` evaluates to 0 —
so the identity is evidence about the live branch, not about dead code.

### §2.2 Both teams are dosed, symmetrically — and why

**FROZEN: symmetric.** Three reasons, all from the contract's own equilibrium frame:

1. The contract's §0.4/§6 reality anchor is that over-compression is **punished by
   the switch of play**, and that counter is *in-engine*. A one-sided dose measures a
   team exploiting an un-dosed opponent — an asymmetry price, not the phase
   modulation H-PM claims.
2. The guards are whole-match world-health reads (spreadY, spacing, dupRun, the
   equilibrium band). Under a one-sided dose every one of them mixes the dosed team's
   shape with the un-dosed team's, and the band baselines
   ([A4-S2P3 §4.2](A4-S2P3-GENE-BATTERY.md)) are **whole-world** numbers.
3. It is the banked A/B form: A4-S2P3 Leg W's arms are both stated as *"both teams:
   …"*, and the S2 exams are paired-per-seed on symmetric worlds.

Consequence, disclosed: each match yields defensive episodes for **both** sides, and
every episode's defending team is dosed. This exam therefore says nothing about the
asymmetric case; that is not in scope.

### §2.3 The world

`edsPerceivedDefence: true, edsPerceivedChoice: true` — the percept-armed substrate
**PM-T0's own receipts ran in** (its `PERCEPT_FLAGS`), plus `pmLaneConvergence: true`.
No station eye is armed (`stationEye === null`, gated), so the #188 send precedence
reduces to its second limb — the station field — and the `eyeOverride` steer bucket is
empty **by construction**, not by observation.

**Boundary, disclosed**: prod-shaped and A4-armed (v1/v2/v3) worlds are **not**
measured here. #188 §8.3 found the 18–20 m ask in **all four** worlds with cm-wide
CIs, so the finding this exam answers is not world-specific — but every number this
exam produces is percept-world-only.

### §2.4 The dose channel — no new engine surface

Doses are written onto **all three genome views** of both teams
(`info.genome` / `baseGenome` / `effGenome`), the `a4World.ts` `armGenes` idiom.
That is **#196.3-D6** honoured literally: the dose travels the REAL gene channel and
the engine gains **no probe-only dose field**. `src/**` is untouched (X-SRC-ZERO).

⚠ **THE ARMING CHECKLIST (#196.3-D4), asserted by `G-ARM`:** armed = the
`pmLaneConvergence` MatchConfig flag **+** the `evolveDefLaneConvergence` opt-in **+**
a non-absent gene, **all three**. The flag is set per arm; the gene is written on all
three views of both teams and `pmLaneConvergenceK(effGenome)` is checked to equal
`dose × 0.25` exactly. This exam is **FIXED-DOSE — no evolution runs** — so the
evolution opt-in is the channel the gene *would* travel under selection rather than
one this exam exercises; `G-ARM` asserts that channel is **LIVE** (`mutateGenome`
writes the key with the opt-in and leaves it absent without), which is PM-T0's own
`optInDraws` evidence form. Stated, not implied.

## §3 SEEDS — a fresh block, disjointness proved in-probe

| item | block | status |
| --- | --- | --- |
| A4/O/PM arc consumed through | 12,311,124 (PM-T0's receipts + boundary read) | prior |
| **PM-T1 sizing smoke** | **12,311,200 – 12,311,205** (6 seeds × 5 arms) | **CONSUMED this round** |
| **PM-T1 battery (reserved)** | **12,311,300 – 12,311,999** (N ≤ 700) | reserved; N = 650 ⇒ 12,311,300–12,311,949 |
| free above | 12,312,000 + | later stages |

Disjointness against **every** consumed block — including O2-T0's 12,311,000–024 and
PM-T0's own 12,311,100–124 — is computed **in-probe** (`gates.gSeed`, the
`pm-t0-lane-seam.ts` idiom), never asserted here. The smoke and battery blocks are
also asserted disjoint from each other.

**Stats stream (a third namespace)**: bootstrap base **103,400**, `B = 2000`, cluster
= seed. #188's base was 103,200 ⇒ the gap is exactly the #163 200 floor; disjointness
from all eight published bases is gated (`gates.gStats`).

## §4 N — DERIVED IN CODE, PRINTED BEFORE THE FIRST BATTERY MATCH

The #188 `nDerived` precedent: N is **not** a constant in the probe. The frozen rule:

```text
σ_perSeed  = (halfWidth188 / 1.96) · √700          ← SMOKE-FREE, published variance
σ_delta    = √2 · σ_perSeed                        ← conservative (arms treated independent)
pairsNeeded= ceil( (1.96 · σ_delta / 0.5 m)² )     ← target CI half-width 0.5 m
N*         = min( ceil(pairsNeeded / pairYield) rounded UP to 25,
                  floor( 2.0 h / (ms_per_match × 5 arms × 2 X-DET) ),
                  700 )                            ← the reserved band's own ceiling
```

* **The variance term is smoke-free**, as the dispatch requires. It comes from #188's
  **published** CI for the very quantity this exam gates on —
  [FARSIDE-DEFENDER-FORENSIC §8.3](FARSIDE-DEFENDER-FORENSIC.md), weak-side back
  `sendLatGapMean`, **prod world: p50 19.86 [19.65, 20.04] over 700 per-seed
  clusters**. Prod is the **widest** of its four published worlds; taking the widest
  is the conservative choice. `halfWidth188 = 0.195` ⇒ `σ_perSeed = 2.6325 m`,
  `σ_delta = 3.7229 m`, **`pairsNeeded = 213`**.
  ⚠ **CORRECTION (#197-L4) — the p50-vs-mean substitution, disclosed.** The interval
  quoted above is #188's CI for a **MEDIAN** (`sendLatGapMean`'s p50 across per-seed
  clusters), and this rule uses it **as if it were a mean's** CI to back out σ. That
  substitution was undisclosed in the pre-registered text; it is stated here plainly.
  **Direction: conservative.** For a roughly symmetric, non-degenerate distribution the
  median's sampling variance is the larger one (≈ π/2 × the mean's in the Gaussian
  case), so σ backed out of a median interval **over**-states the mean's σ and the rule
  **over-sizes N**. Nothing in the rule, its inputs or its output is changed by this
  disclosure — it is a label on a number that was already frozen.
* **The `√2` inflation is conservatism, not a measurement**: it treats the two arms
  as independent, which *over*-states the variance of a paired same-seed delta.
* **The target half-width 0.5 m is frozen against the mechanism's own analytic
  movement**: at the ceiling `y += (b−y)·0.25` shrinks a 19 m gap by ≈4.75 m, and the
  lowest dose by ≈1.19 m — so 0.5 m resolves every dose in the vector with margin.
* **`pairYield` and `ms_per_match` are the ONLY two numbers read out of the smoke**
  (the #188 §4.3 form: *the smoke informs only N*). `pairYield` = the **minimum over
  the four doses** of the share of seeds yielding a paired (control, dose) ask value —
  necessary because the trigger is rare (#188: ≈1.2–1.5 episodes/match) and the arms
  diverge, so arm coverage is per-seed ragged **by construction**.
  ⚠ **CORRECTION (#197 fix round) — the smoke inputs are now the FIXED smoke's.**
  Superseded reading (the `94eba83` smoke, left readable): `msPerMatch 105.933`,
  `pairYieldMin 0.3333`. **This round's committed smoke: `msPerMatch 110.367`,
  `pairYieldMin 0.3333`** — the re-run is a plumbing re-measurement on the SAME
  consumed seeds (12,311,200–205), and ms/match is a box-speed number that moves
  between runs by construction.
* **N* = 650** — `ceil(213/0.3333) = 640 → 650`; wall term **6,523**; cap **700**.
  **The PRECISION term binds** (`bindingTerm = precision`); projected wall **0.199 h**.
  ⚠ **The N RULE was NOT touched; this is its re-evaluated OUTPUT on the fixed smoke**
  (old inputs `105.933 / 0.3333` → wall term 6,796, projected wall 0.191 h; new inputs
  `110.367 / 0.3333` → wall term 6,523, projected wall 0.199 h). **N* is 650 in both** —
  the precision term binds in both, and the precision term reads only `pairYieldMin`,
  which did not move. A changed N would have been the rule's output, not a re-cut.
* ⚠ **CORRECTION (#197-L3) — where the N inputs are actually read from.** The FIXED
  committed smoke artifact is
  [`data/pm-t1-compression-exam-smoke.json`](data/pm-t1-compression-exam-smoke.json),
  file sha256
  **`ac6c9042a06e98f07f9a2d8b2d0b2e25f7992ae02866024615826d7a717e49c0`**
  (of the artifact BYTES as committed this round; distinct from the artifact's own
  `resultSha256`, which covers the measured body only). Stated honestly: full mode
  reads the **WORKING-TREE** file at that path — not the committed blob — and records
  the sha256 of the bytes it actually read into the full artifact as
  `nDerivation.smokeArtifactSha256`. So the provenance is **discipline-enforced and
  sha-audited, not git-enforced**: a re-run of the smoke before launch would silently
  change N's inputs, and the only thing that catches it is comparing the full run's
  recorded `smokeArtifactSha256` against the pinned value above. Do that comparison at
  adjudication.
* **The cap, stated honestly**: `N_CAP = 700` is the reserved band 12,311,300–999. It
  is a **seed-budget** cap, not a statistical statement. It does not bind here; if it
  ever did, the achieved half-width would be wider than the target and that shortfall
  would be **disclosed, never re-cut** (the #188 §8.0 precedent).
* `gates.gNDerived` fails **RED** if the N actually run is not the rule's output — a
  `PMT1_N` override in full mode turns the gate red rather than passing quietly.
  `PMT1_N` is accepted in **smoke mode only**.
* N is fixed by the **committed** smoke artifact. Re-running the smoke changes
  nothing unless the artifact is re-committed — which would be a re-cut, and is
  forbidden.
  ⚠ **CORRECTION (#197-L3 / #197.4).** Two things in that sentence need saying
  precisely. (a) Mechanically the probe reads the **working-tree** file, so a bare
  re-run *does* change the inputs a subsequent full run would use — the protection is
  the discipline plus the recorded `smokeArtifactSha256`, not git (above). (b) This fix
  round DID re-run and re-commit the smoke, **under ruling #197.4 and before any full-N
  number existed**: it is an evidence-layer re-measurement of the plumbing on its own
  already-consumed seeds, with the N RULE untouched and its re-evaluated output
  disclosed. That is the one authorised exception, and it is not a re-cut: no
  threshold, tolerance, predicate, dose or seed moved, and N* is unchanged at 650.

## §5 ⭐ THE FROZEN GATES — verbatim predicates, with their numbers

All contrasts are **paired per-seed deltas** (dose − control) of the weak-side back's
per-seed mean, bootstrapped on the **seed** cluster (`B = 2000`, base 103,400, CI =
2.5/97.5 percentiles). ⚠ **Disclosed**: the arms diverge tick-for-tick, so pairing is
on the **seed**, not on the episode; and each dose's delta is computed over its own
contributing seed pairs, which is exactly why the dose-response test below is a
**within-seed** slope.

### §5.1 PRIMARY — the ASK (this is the whole of what H-PM claims)

```text
P1   CI_upper( ask( D100 − D000 ) )  <  0
P2a  askΔ(D025) ≥ askΔ(D050) ≥ askΔ(D075) ≥ askΔ(D100)      (weakly monotone points)
P2b  CI_upper( mean per-seed OLS slope of ask on k_PM )  <  0

PRIMARY := P1 ∧ P2a ∧ P2b
```

`ask` = `sendLatGapMean` = `|sendTarget.y − ball.pos.y|` on in-trigger ticks — #188
§3.3's own definition, the metric that read **18–20 m** in all four worlds. The send
is the **MOVER read** (`formationSpot(..., pmMover = true)`), i.e. the same call shape
`actionExecutor.ts:145` / `:336` make under the armed flag in `playing`.

⚠ **CORRECTION (#197-L6) — what the ask IS, exactly.** The wording above (and the
superseded phrasing "exactly what `actionExecutor.ts:145` / `:336` pass") reads as a
**live-consumption** claim: that the number measured is a target the executor was
consuming on those ticks. It is not, and must not be read that way. The ASK is a
**RECOMPUTED COUNTERFACTUAL STATION READ**: on every in-trigger tick the probe calls
`formationSpot(..., pmMover = true)` itself and records where the station **would**
send him. On the ticks that dominate this seam the executor is in a **mark stance** and
never calls `formationSpot` at all — the fixed smoke measured **markStance ≈ 99.4 %**
of material-ask ticks at D100 (n = 6, plumbing only, adjudicates nothing).

Two things survive that correction intact, and one dies:

* **ALIVE — the `pmMover` ARGUMENT claim.** The probe's read passes `pmMover = true`,
  which is the same argument the executor passes at `:145` / `:336`; the M-PM.1 branch
  and `k_PM` under measurement are the live ones, not a probe-side reimplementation.
* **ALIVE — the PRIMARY as contracted.** H-PM claims the **ASK** moves; §3 of the
  contract measures the ask **separately** from the body precisely because the two can
  come apart.
* **DEAD — any implication that a moving ask is by itself a moving defence.** The gap
  between "the station would send him here" and "his body goes there" is exactly the
  **wedge** the swallow instrument (§5.3) quantifies and **F-PM-a** is pre-named to
  catch. If that wedge is total, PM-T1's honest result is F-PM-a, not a success.

**P2b is the exact dose-response test** (the dispatch asked for it by name): for each
seed, an ordinary least-squares slope of that seed's ask on `k_PM`, fitted over the
arms in which that seed yielded ≥1 qualifying episode; the statistic is the **mean
slope over seeds**, with the same seed-cluster bootstrap. ⚠ **ADMISSION RULE, frozen
here**: a seed is admitted iff it has **≥3 finite arm values spanning ≥2 distinct
k**. Requiring all five arms would discard most seeds for a reason that is structural
(rare trigger × diverging arms), not evidential. The admitted count is published.

### §5.2 The ANSWER — measured separately, never merged

`bodyLatGapMean` (= `|p.pos.y − ball.pos.y|`), `compressionShortfallMean`
(= `mean(max(0, |p.y − ball.y| − 9))`) and `detachMean` (distance from the centroid of
the REST of his outfield team), each with the same paired contrast and a slope on
`k_PM`. ⚠ **The #188 §8.3 lesson, applied prospectively**: the ask is a **TARGET**
metric and the body is a **BODY** metric. They are not two views of one quantity and
**do not subtract into each other**. The artifact says so in the block itself.

### §5.3 F-PM-a — the ask moves but the body does not ⇒ **STOP**

```text
F-PM-a := P1  ∧  CI( body( D100 − D000 ) ) INCLUDES ZERO   (lower ≤ 0 ≤ upper)
```

i.e. the ask clears its resolved-fall threshold while the top-dose body contrast is
unresolved. Disposition, by contract §3: **STOP; the result returns to the 乙 fork
WITH numbers** (the #193.1 parked user decision — its formal seat).

**The quantified swallow-share instrument** rides whether or not F-PM-a fires. Over
the weak-side back's in-trigger ticks at each dose, take the ticks where the modulated
ask differs **materially** from the unmodulated one
(`|askMod.y − askUnmod.y| ≥ ASK_MATERIAL_M`) and bucket them by the **D2 STEER
OWNER**:

* `markStance` — the body is executing a **mark stance** on a resolvable man instead
  of the station walk ⇒ **the compression is swallowed**;
* `stationWalk` — `MoveToFormationSpot` / `HoldPosition`, **or** `MarkOpponent` with
  no resolvable target (the M-PM.3 mover read #2 fallback) ⇒ the modulated ask is the
  thing the body is actually walking to;
* `other` — ball-directed jobs; the station is not steering him at all.

⚠ **`ASK_MATERIAL_M = 1.0 m` is a FLAGGED EXECUTOR'S CHOICE**, in exactly the class
of #188's `SPEED_MIN = 1.0 m/s` and `CORNER_MATERIAL = 0.05`: no substrate anchor
exists for "materially". It is declared ex ante, the share is reported at **0.5 / 1.0
/ 2.0 m**, and — decisively — **no gate predicate reads it**. F-PM-a fires on the two
CI predicates alone.

⚠ **Attribution discipline**: the buckets come from the **D2 steer-owner** read the
#188 artifacts already carry. `switchKey` is **not computed anywhere in this probe**
(§8.4 retraction; map §5 trap 7).

⚠ **CORRECTION (#197-L5b) — the steer taxonomy is #188's SPLIT, not #188's.** #188's
D2 mix has four buckets in precedence order — `eyeOverride` > `markStance` >
`stationHome` > `ballDirected` — where **`markStance` = any `MarkOpponent` tick**. This
probe **splits that bucket in two**: `markStance` (a `MarkOpponent` whose target index
resolves to a live opponent) vs **`markFallback`** (`MarkOpponent` with no resolvable
target — the M-PM.3 mover read #2 fallback, where the station *is* still steering him).
Consequences, stated: (a) the per-arm **`steerMix` reported in §5.6 is NOT
bucket-comparable to #188's D2 mix** — e.g. #188's prod `markStance 81.5 %` is the
union of this probe's `markStance + markFallback`, so any cross-reading must add the
two before comparing; (b) inside the swallow instrument the split is deliberate and
load-bearing — `markFallback` is counted with `stationWalk`, **not** with the swallowed
share, because a fallback tick is a tick the station still owns; (c) `eyeOverride` is
empty here **by construction** (`stationEye === null`, §2.3), which is a fifth
difference from #188's armed worlds and is not evidence about anything.

### §5.4 F-PM-b — the clump re-imports ⇒ **STOP**

The guard limbs, in the **S2 non-inferiority form** and with the S2 tolerance:

```text
tol(limb)      = NI_FRACTION × | control-arm level of that limb, THIS run |
NI_FRACTION    = 1 − 0.275/0.380 = 0.2763          ← INHERITED, NOT INVENTED

GUARD-NI(d) := CI_lower( ΔspreadY_outOfPossession ) > −tol   ∧
               CI_lower( Δ spacingMedian )          > −tol   ∧
               CI_upper( Δ spacingUnder4 )          < +tol   ∧
               CI_upper( Δ dupRunShare )            < +tol

F-PM-b := ( ∃ a dose with CI_upper(askΔ) < 0 )  ∧
          ( ∀ such dose:  ¬GUARD-NI(dose) )
```

**Where the tolerance comes from, exactly.** `0.2763` is
[A4-S2P1-VECTOR-CENSUS §4](A4-S2P1-VECTOR-CENSUS.md)'s `fraction_box = 1 − 0.275/0.380`
— itself #154's certified box price (`0.380`) and the CI bound nearest zero
(`0.275`), i.e. *the give-back slice 1 never certified*. It is the **27.6 % frozen
tolerance** the PROGRAMME QUEUE cites for the S2-P1 box limb. That doc's own rule is
that the **fraction** is inherited while the **scale** is the control arm's own level
in *this* run ("no slice-1 number is transplanted across units") — followed here
literally. **Nothing is invented**, and an UNRESOLVED (too-wide) CI **fails** the
limb, exactly as the S2 degeneracy clause requires.

**The metrics and their live implementations:**

* **spreadY** — the B1-a metric named in the very code comment this contract
  un-freezes (`formations.ts:309`, *"…halving spreadY"*). Live implementation:
  [`stage3-p0-instruments.ts`](../../scripts/probes/stage3-p0-instruments.ts) §I7
  (`acc.sy += sd(ys)` at `:261`, `sd` at `:134`) — the stdev of outfielders' world-y,
  sampled at 6 Hz and split by **possession**. The **out-of-possession** face is the
  gated one (it is the phase this seam modulates); the in-possession face is reported.
* **spacingMedian / spacingUnder4** — the P3′ pair-distance instrument, inherited
  ~~verbatim~~ from [`a4-s2p3-gene-battery.ts`](../../scripts/probes/a4-s2p3-gene-battery.ts)
  (`SAMPLE_EVERY 10`, `PAIR_SUBSAMPLE 6`, `CLOSE_PAIR_M 4`). `spacingUnder4` is the
  **spacing floor** read: the share of pairs inside 4 m.
* **dupRunShare** — the same battery's I6 (`familyOf` RUN, `runTarget`,
  `DUP_RUN_M 4`, arriver/overlapper/corner-crash runners excluded).
* ⚠ **CORRECTION (#197-L5a) — "inherited verbatim" was wrong about the GRAIN.** The
  constants, the sampling and the definitions are inherited exactly; the **aggregation
  grain is not**. A4-S2P3 computes these **PER SIDE** (`quantile(pairs[side], …)`,
  `dupRunTicks[side] / runTicks[side]`); this probe **POOLS both teams into one
  per-match value** (`[...pairs[0], ...pairs[1]]`, `(dupTicks[0]+dupTicks[1]) /
  (runTicks[0]+runTicks[1])`), and the same pooling applies to `spreadYOut` /
  `spreadYIn`. **Why it is harmless here, stated rather than assumed**: §2.2 doses
  **both teams symmetrically**, so the two sides are exchangeable within every arm and
  the pooled per-match value is a weighted average of two like-distributed quantities —
  the contrast it feeds is the same contrast, measured with *less* per-match noise, not
  a different quantity. It would **not** be harmless under an asymmetric dose, which
  this exam does not run (§2.2, §7). What this costs: these limbs cannot attribute a
  guard movement to one side, and this exam does not attempt to.

Disposition if F-PM-b fires, by contract §3: **STOP; the dimension is wrong, not the
dose.** A guard failing at *some but not all* ask-moving doses is **not** F-PM-b; it
is reported as a dose-limited cost and returned to the commander.

### §5.5 GUARDS riding every battery — the equilibrium band and the #157 debt

**The equilibrium band**, inherited **verbatim** from
[A4-S2P3-GENE-BATTERY §4.2](A4-S2P3-GENE-BATTERY.md) (itself P3a §4.2 / C1 §4
absolute), together with its **declared substrate-drift caveat**:

```text
goals     2.3944 ±15 %      crosses 2.4894 ±25 %      headers   9.1039 ±25 %
longBalls 6.2042 ±25 %      cutbacks 3.8151 ±25 %
```

**BAND := the top-dose arm inside the band on every dimension the CONTROL arm itself
holds.** A dimension the **CONTROL** fails is **DISCLOSED as substrate drift and
EXCLUDED from the gate** — that caveat is A4-S2P3's own, laid down before it was ever
measured, and the S2-P3 smoke showed it load-bearing (`headers` and `longBalls`
already outside on the control there). Band failure on a gated dimension ⇒ **STOP**.

**The #157 instrument debt** rides the battery, in the form the S2 family froze:

* **offside FLAG** — a resolved rise in offsides at the top dose returns the axis to
  the **USER**; it **never flips PASS/FAIL** (the F-S2d form).
* **foul counter**, **penalties** and the **E4 combination counters** (`thirdMan`,
  `overlaps`, forward-pass share) — **REPORTED with CIs, never gated** (A4-S2P3 §4.3's
  binding "not a second bite" rule).

### §5.6 REPORTED — no gate

* **Mark-assignment drift**: `markShare`, the far-side mark share, `distToMark`,
  `markLatGap`, per dose, with CIs. This is the
  [MARK-SELECTION-CODE-MAP §2.4](MARK-SELECTION-CODE-MAP.md) **positional-feedback
  channel** — `assignMarks` reads `p.pos` (`TeamBrain.ts:494/:499`), so dosed bodies
  re-rank nearest-body claims. That drift must be **visible and attributed, not
  designed away**; the map labels the channel AMBIGUOUS/hypothesis and nothing here
  upgrades it.
* Everything the #188 receipts print: per-arm episode counts, trigger-tick share,
  levels (mean/p50/p90) for weak back **and** ball-side control mirror, the D2 steer
  mix (⚠ in this probe's **SPLIT** taxonomy — `markStance` / `markFallback` /
  `stationHome` / `ballDirected` / `other`; **not bucket-comparable to #188's D2 mix**
  without re-merging the two mark buckets — see §5.3's ⚠ CORRECTION #197-L5b), and the
  six worst-detachment episodes per arm with `watchHint` strings.

### §5.7 The X-family (HARD — failure ⇒ the measurement is invalid)

| gate | predicate / semantics |
| --- | --- |
| `xDet` | the whole core computed **twice**, canonical-JSON digests equal |
| `xFpProd` | the shipped fingerprint re-derived **in-probe** (seed 1337, 2 seasons) = `57b0bdab…c673` (#181.2) |
| `xSrcZero` | `git diff --stat -- src` empty — instrument-only |
| `gArm` | the #196.3-D4 arming checklist per arm (flag ∧ gene on all three views of both teams ∧ `pmLaneConvergenceK === dose × 0.25`) + the evolution opt-in channel shown LIVE |
| `gCtrlEq` | control (ARMED, gene ABSENT) ≡ FLAG-OFF, whole-match signature **including the rng stream**, first min(8, N) seeds. ⚠ **THE ARMS DIFFER IN CODE PATH** — armed ⇒ `pmMover` true ⇒ the M-PM.1 branch is entered and `k_PM` evaluates to 0 |
| `gSeed` | block disjointness vs all ten consumed blocks, in-band, smoke/battery blocks disjoint |
| `gStats` | bootstrap base 103,400, gap ≥ 200 from all eight published bases |
| `gReadOnly` | `abandonRestDesignation` / `homeRegionGrant` / `homeMapGrant` null on every match **and** `stationEye === null` |
| `gNDerived` | the N run **is** the frozen §4 rule's output (RED on a `PMT1_N` override in full mode) |

**EXIT SEMANTICS** (the commander's monitor reads these):

```text
0 — X-family green, PRIMARY passes, no pre-named fork fired
1 — an X-family HARD gate failed              ⇒ the MEASUREMENT is invalid
2 — the exam ran clean and a STOP fired       ⇒ the RESULT is a fork (by contract, the user's):
    PRIMARY fail  ·  F-PM-a  ·  F-PM-b  ·  the equilibrium band on a gated dimension
```

## §6 FREEZE HONESTY

1. **The smoke adjudicates NOTHING.** It proves plumbing and publishes exactly two
   sizing numbers (ms/match, minimum paired-ask yield) which feed **only N**. No
   level, share, rate, CI or verdict from it is a finding, and **it may not tune any
   threshold**. The smoke artifact carries this as a machine-readable field
   (`smokeAdjudicatesNothing`).
2. **No re-cut after sight.** The `k_PM` ceiling is PM-T0's traced 0.25; the NI
   fraction is A4-S2P1 §4's 0.2763; the band is A4-S2P3 §4.2's. None may be moved to
   make a limb pass. If PM-T1 needs a different ceiling, that is a fork for the
   commander **with numbers**.
3. **FAILs are reported as-is.** A fired F-PM-a or F-PM-b is a result, not a defect to
   engineer around; a failing guard limb is published with its CI and its tolerance.
4. **Two changes were made to this design AFTER the plumbing smoke and BEFORE any
   full-N sight, both forced by structure and neither by a level** (declared here in
   the #188 §4.4 form): (a) the P2b **admission rule** (≥3 arms, ≥2 distinct k) —
   the all-five-arm version admitted 0 of 6 smoke seeds because arm coverage is
   ragged by construction; (b) the N rule's **`pairYield`** term, for the same
   structural reason. Nothing in §5's predicates, tolerances or thresholds was
   removed, redefined or re-thresholded.
5. **PM-T1 ships nothing.** Road B: `src/**` untouched, the flag absent from every
   bundle and play-test world, the production fingerprint re-derived unchanged.

## §7 WHAT THIS EXAM DOES NOT DO

* It makes **no oscillation claim** — the banked instrument for it is retracted and
  this exam builds no replacement (map §5 trap 7).
* It does not touch mark **selection** (#193.1 DEFER stands): mark drift is measured
  and reported, never gated, never fixed.
* It does not measure prod-shaped or A4-armed worlds (§2.3), the asymmetric dose
  (§2.2), the attacking phase, the lateral opponent-shape term, or the coach layer.
* It does not decide whether the compression is **good football**. The compression
  yardstick (`SPREAD_R = 9 m`) is a RULER, not a target — #188 §3.3's own words.
* It cannot authorize PM-T2, and nothing reaches the user's play-test without the
  commander's ruling.

---

## §SMOKE — PLUMBING ONLY (adjudicates NOTHING)

6 seeds @ 12,311,200–205 × 5 arms, `PMT1_MODE=smoke`, wall **18.1 s**, `110.4
ms/match`. Artifact [`data/pm-t1-compression-exam-smoke.json`](data/pm-t1-compression-exam-smoke.json),
`resultSha256` **`900b7efa2cae81c55d2c08ebc789d5b116cc132a536b66d3a6cdd3b9170a0182`**,
artifact-bytes sha256 **`ac6c9042a06e98f07f9a2d8b2d0b2e25f7992ae02866024615826d7a717e49c0`**
— both quoted from **this round's committed artifact** and nowhere else (the #194-M1
lesson).

⚠ **CORRECTION (#197-M1) — what `resultSha256` covers, and the superseded claim.**
Superseded, left readable: the `94eba83` smoke published
`56588f04…2c564` with the claim that *"the hash is over the timing-free body, so
`npx tsx scripts/probes/pm-t1-compression-exam.ts` reproduces it exactly"*. **That
claim was false for any third party**: the hashed body embedded the git short-hash
(`head`), so the receipt could only ever re-derive at commit `94eba83` itself. #197's
independent verifier reproduced every measured number and the X-DET digest
byte-identically and saw exactly one delta — `.head`.

The fix, in the probe: `head` is now **RECORDED but NOT HASHED**, in the envelope
beside the wall-clock fields (`headContextOnly`, the PM-T0 `wallMsContextOnly` idiom).
**`resultSha256` therefore covers exactly the timing-free, commit-free MEASURED body**
— doses, seeds, frozen design, N derivation, predicates, every result series and
contrast, and the gate objects — and **excludes** `resultSha256` itself, `sizing`,
`wallContextOnly` (`corePassMs`, `totalMs`) and `headContextOnly`. Re-running
`PMT1_MODE=smoke npx tsx scripts/probes/pm-t1-compression-exam.ts` on this seed block
re-derives `900b7efa…0a0182` **at any commit**; the artifact FILE bytes still differ
run to run, because the recorded wall-clock and `head` fields move — which is why the
two shas above are distinct and both are pinned. The only git-derived field still
inside the hash is `gates.xSrcZero`'s `git diff --stat -- src` output, and that is
deliberate: it is a **gate output** (empty on any clean tree at any commit), not a
commit identifier. In FULL mode `nDerivation.smokeArtifactSha256` is likewise inside
the hash on purpose — it is N's provenance (§4, #197-L3).

**What this section is**: proof that the arms construct, the instruments produce
numbers, the artifact writes and the exit codes work. **What it is not**: evidence
about anything. At 6 seeds the paired contrasts run on **n = 2–4 seeds**; every
number below is noise with a decimal point.

⚠ **CORRECTION (#197-M2) — the transcript below is UNABRIDGED, and the previous one
was not.** The `94eba83` version of this section printed a silently and
**ASYMMETRICALLY** abridged transcript: it kept the **one PASSING** `GUARD-NI` row
(D100) and dropped the **two FAILING** ones (D050 / D075, `dupRunShare` BLOWN at n = 6
noise), and dropped 3 of 4 ANSWER rows and 4 of 5 swallow rows — with **no elision
markers**. Dropping failures while keeping passes is the exact selection #194/#196
forbid. What follows is the **complete stdout** of this round's fixed re-run, copied
whole: all four ASK rows, all four ANSWER rows, all five swallow rows, all four
GUARD-NI rows **including the two FAILs**, and the full gate/verdict tail. **Nothing is
elided.** (Those two D050/D075 GUARD-NI failures adjudicate nothing — like every other
number here they are n = 6 plumbing — but they are the smoke's output and they are
published.)

```text
=== PM-T1 COMPRESSION EXAM (smoke) — HEAD 4eab062 — 6 seeds × 5 arms, block 12311200..12311205 ===
doses D000:absent(k=0)  D025:0.25(k=0.0625)  D050:0.5(k=0.125)  D075:0.75(k=0.1875)  D100:1(k=0.25)
episodes/arm D000:7  D025:3  D050:5  D075:5  D100:11

ASK (send-target lane gap, weak-side back, paired per-seed vs D000):
  D025  +0.401951 [-0.242062, 1.045964] n=2   level 22.538229 m (control 22.136278 m)
  D050  -1.344676 [-2.2068, -0.482552] n=2 ✔   level 17.83756 m (control 19.182237 m)
  D075  -3.529643 [-4.695914, -2.363372] n=2 ✔   level 15.504907 m (control 19.03455 m)
  D100  -4.95822 [-6.804135, -3.862927] n=4 ✔   level 15.627194 m (control 20.585414 m)
  slope on k_PM  -21.579693 [-29.255155, -16.212914] n=4 ✔  m per unit k  (seeds admitted: 4)
  P1 PASS · P2a PASS · P2b PASS ⇒ PRIMARY PASS

ANSWER (body lane gap / shortfall / detachment — measured SEPARATELY):
  D025  body +2.243997 [-0.865859, 5.353854] n=2 · shortfall +2.190083 [-0.865859, 5.246025] n=2 · detach +0.871433 [-1.066722, 2.809589] n=2
  D050  body +0.08899 [-2.411554, 2.589533] n=2 · shortfall +0.08899 [-2.411554, 2.589533] n=2 · detach +0.999082 [-2.018136, 4.016299] n=2
  D075  body +2.454728 [-4.885396, 9.794851] n=2 · shortfall +0.685634 [-4.885396, 6.256663] n=2 · detach -1.401918 [-5.117786, 2.313951] n=2
  D100  body -1.066291 [-6.997834, 4.192792] n=4 · shortfall -0.544971 [-4.057627, 2.763121] n=4 · detach -1.710646 [-4.648899, 0.536875] n=4

F-PM-a *** FIRED *** (P1 true ∧ top-dose body CI includes zero true)
  swallow D000 @1 m: material ticks 0 · markStance NaN · stationWalk NaN
  swallow D025 @1 m: material ticks 131 · markStance 1 · stationWalk 0
  swallow D050 @1 m: material ticks 202 · markStance 0.821782 · stationWalk 0.009901
  swallow D075 @1 m: material ticks 308 · markStance 1 · stationWalk 0
  swallow D100 @1 m: material ticks 895 · markStance 0.994413 · stationWalk 0.005587

F-PM-b not fired (ask-moving doses: D050,D075,D100)
  GUARD-NI D025 PASS: spreadYOut ok (-0.185457 [-0.551767, 0.212954] n=6 vs ±1.630365) · spacingMedian ok (-0.637357 [-1.127521, -0.108921] n=6 ✔ vs ±3.69343) · spacingUnder4 ok (-0.00568 [-0.017571, 0.00669] n=6 vs ±0.024351) · dupRunShare ok (+0.041912 [-0.039468, 0.112541] n=6 vs ±0.118905)
  GUARD-NI D050 FAIL: spreadYOut ok (+0.18659 [-0.12769, 0.52529] n=6 vs ±1.630365) · spacingMedian ok (-0.146902 [-0.566315, 0.297844] n=6 vs ±3.69343) · spacingUnder4 ok (-0.002513 [-0.012225, 0.005616] n=6 vs ±0.024351) · dupRunShare BLOWN (-0.007238 [-0.109608, 0.120716] n=6 vs ±0.118905)
  GUARD-NI D075 FAIL: spreadYOut ok (+0.206585 [-0.149165, 0.562335] n=6 vs ±1.630365) · spacingMedian ok (+0.324699 [-0.852728, 1.319051] n=6 vs ±3.69343) · spacingUnder4 ok (-0.013167 [-0.021831, -0.006092] n=6 ✔ vs ±0.024351) · dupRunShare BLOWN (+0.042513 [-0.094509, 0.182293] n=6 vs ±0.118905)
  GUARD-NI D100 PASS: spreadYOut ok (-0.045862 [-0.373912, 0.262034] n=6 vs ±1.630365) · spacingMedian ok (-0.47203 [-1.193742, 0.245517] n=6 vs ±3.69343) · spacingUnder4 ok (-0.005233 [-0.01585, 0.00546] n=6 vs ±0.024351) · dupRunShare ok (+0.005844 [-0.113667, 0.118765] n=6 vs ±0.118905)

BAND FAIL — gated goals,crosses,headers,cutbacks · excluded as substrate drift longBalls
OFFSIDE FLAG quiet — +1 [-0.166667, 2.166667] n=6

X-FAMILY GREEN: xDet ok · xFpProd ok · xSrcZero ok · gArm ok · gCtrlEq ok · gSeed ok · gStats ok · gReadOnly ok · gNDerived ok
X-DET digest b14d3b7869887f7138c85d6efaccaebf20503f1ef724572774037b891b1c0b94
resultSha256 900b7efa2cae81c55d2c08ebc789d5b116cc132a536b66d3a6cdd3b9170a0182
wall 18.141s · 110.4 ms/match · pairYieldMin 0.3333 · artifact docs/world-model/data/pm-t1-compression-exam-smoke.json
VERDICT: SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING
⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.
```

**The plumbing verdict, and only that:** all nine X-family gates green (X-DET
byte-identical across two core passes; the production fingerprint re-derived
`57b0bdab…c673`; `git diff --stat -- src` empty; the arming checklist satisfied on
all five arms with `k_PM` exact and the opt-in channel live; the control arm
byte-identical to flag-off on 6/6 seeds *through the live branch*; seeds and stats
disjoint; the read-only assertions and `stationEye === null` hold). Every gate
predicate evaluated and printed; both STOP paths and the flag path exercised;
`process.exit` verified — **exit 0** in smoke mode even with `F-PM-a` "fired" and
`BAND` "failed", because smoke mode adjudicates nothing (exit 2 is reachable only in
full mode), and `gNDerived` verified **RED with exit 1** under a `PMT1_N` override in
full mode.

⚠ **Do not read the smoke's ask movement, its swallow share, its band result or its
F-PM-a "firing" as findings.** They are n=2–6 realisations of a battery sized at
n=650, and the band read in particular is meaningless at 6 matches. The COMPRESSION
EXAM is the commander's detached run.

## §LAUNCH — the commander's detached full run

```bash
cd /Users/jamie/Documents/Promptfoo/evofootball-arena && \
  nohup env PMT1_MODE=full npx tsx scripts/probes/pm-t1-compression-exam.ts \
  > /tmp/pm-t1-full.log 2>&1 &
```

* **N is NOT passed**: `PMT1_N` in full mode turns `gNDerived` RED. N = 650 comes from
  the frozen §4 rule on the committed smoke artifact, and the probe prints the whole
  derivation at startup before the first match.
* **Artifact**: `docs/world-model/data/pm-t1-compression-exam.json` (the smoke's own
  artifact at `…-smoke.json` is not overwritten).
* **Expected wall**: 650 seeds × 5 arms × 2 X-DET passes × 110.4 ms ≈ **0.20 h ≈ 12
  min** of core, plus ~30 s for the 8-seed control-equivalence check and ~10 s for the
  in-probe fingerprint ⇒ **≈ 13–14 min** on the smoke's box; budget 2 h.
  (⚠ CORRECTION, #197 fix round: superseded reading `105.9 ms ≈ 0.19 h` — the fixed
  smoke re-measured the box at `110.4 ms/match`. A projection, gating nothing.)
* **Progress cadence**: a `[pm-t1 passN] done/total · elapsed · s/match · ETA` line at
  least every **30 s** of wall time, on stderr.
* **Exit semantics**: `0` clean pass · `1` X-family failure (measurement invalid) ·
  `2` a pre-named STOP fired (PRIMARY fail / F-PM-a / F-PM-b / band) — by contract
  §3, forks go to the user.

## §RESULT — the gates run

*(EMPTY BY DESIGN. To be filled from the committed
[`data/pm-t1-compression-exam.json`](data/pm-t1-compression-exam.json) after the
commander's detached run — every number quoted FROM that artifact, never the other
way round, and every hash from that run only. Files touched: `git show <commit>
--stat`.)*
