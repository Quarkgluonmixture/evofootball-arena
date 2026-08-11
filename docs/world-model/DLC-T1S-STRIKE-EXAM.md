# DLC T1s — THE STRIKE-PLANE EXAM (控制的是那一脚: does choosing THE KICK keep the gain and shed the cost?)

Status: **FROZEN, SMOKED, then RUN AT FULL BATTERY.** Everything from §FORM to §NON-CLAIMS — the
world, the five arms and their exact door declarations, the JOINT pre-registered primary **and its
#240 OVERSHOOT contrast clause**, the ruler, the guards, the estimator, the seed ledger, the N rule
and the gate list — is the design fixed **in the probe's own frozen constants and gate predicates
before any receipt ran**, and every clause below is machine-checkable against the committed
artifact rather than a promise about it. The measured numbers live in two §RESULT sections, both
**GENERATED PROGRAMMATICALLY** from their artifacts by committed generators, never typed:

* [§RESULT — the smoke](#result--the-smoke) — 12 seeds × 5 arms, 22/22 gates PASS (the plumbing
  shakedown that sized the battery and first sighted the emergent strike);
* ⭐⭐ [§RESULT — the FULL BATTERY](#result--the-full-battery) — **446 seeds × 5 arms
  (12,428,100–12,428,545), 22/22 gates PASS**, `resultSha256`
  `82a7dd2a…629d2`. **This is the evidence layer**: at battery N the equilibrium band GATES and the
  ABSENT arm is inside it, so both JOINT limbs — and with them LIMB G of the #240 overshoot clause
  — are readable for the first time in this stage.

⚠ **This document reports; it does not adjudicate (#203).** The JOINT primary, the overshoot
clause, their limbs and their neighbours are printed exactly as the artifact records them, with
the mechanical CI and predicate flags the probe computed. **F-T1s-a/b/c are the commander's.**
Anything sharpened after a run is recorded in [Deviations](#deviations-recorded), never smoothed
away.

Authority chain: contract [`DELIVERY-CHOICE-CONTRACT.md`](DELIVERY-CHOICE-CONTRACT.md) — §2
**M-DLC.1″** (THE STRIKE SPACE; its **SLICE DISCIPLINE** names this exam's treatment exactly:
***one-s* = the GROUND strike plane, direction × power, elevation 0, spin 0, the incumbent ground
pass the zero-point**), §1 **H-DLC** read at this slice's cell, §4 the non-claims, and the **four
#236 amendments** binding throughout. Rulings **#240** (continuous aim ruled in; the gene's
magnitude RETIRES; ⭐ the OVERSHOOT prediction pre-registered) · **#241** (控制的是那一脚 —
M-DLC.1″ supersedes the unbuilt 1D aim segment) · **#242** (DLC-T0s BANKED — the plane dormant and
IEEE-exact at its zero-point; ⚠ **#242.2 the SUBSTITUTION FACT**) · **#239** (DLC-T1 adjudicated:
the two-point contest is strictly better than the dial on every measured axis, but leaves
**interceptions +4.1 resolved** and **goals 0.18 below the band** — the residual this slice is
about) · **#225.3(c)** (per-dose STOP granularity) · **#228.6** (the exam world must be
percept-armed) · **#203** (per-arm ROWS, never verdicts) · **#181.2** (every HARD gate in-probe) ·
**#197-M1/#198** (hashed body vs unhashed envelope) · **#163** (seed/stats disjointness) · **#20**
(cluster = match seed) · **#128** (wall is CONTEXT ONLY) · **#207** (checkpoint) · **#226.1** (the
transcript form) · **#229.2** (no table typed that the artifact does not carry — discharged by a
committed generator).

The instrument this stage stands on: [`DLC-T1-CHOICE-EXAM.md`](DLC-T1-CHOICE-EXAM.md) and its
probe — inherited **whole** (world, ruler, guards, estimator, genealogy lift, N rule, checkpoint,
guard block, per-dose STOP granularity, joint-primary form), and that inheritance is **proved**
rather than asserted by ⭐⭐ **G-ANCHOR** (below), on top of DLC-T1's own G-REPRO receipts, which
ride here unchanged. The seam being dosed is
[`DLC-T0S-DORMANT-SEAM.md`](DLC-T0S-DORMANT-SEAM.md), banked at `54a45df`/`8333911` (ruling #242);
the CONTRAST anchor's seam is [`DLC-T0-DORMANT-SEAM.md`](DLC-T0-DORMANT-SEAM.md) at
`9360882`/`b8f5ef0` (#237); the receiver-side seam is
[`OBM-T0-DORMANT-SEAM.md`](OBM-T0-DORMANT-SEAM.md) at `600ff04` (#228).

> ⭐ **INSTRUMENT-ONLY ROUND.** `src/**` is **byte-untouched** (X-SRC-UNTOUCHED is a HARD gate).
> **Every seam is already banked**; the arms are built by three MatchConfig flags
> (`dlcStrikePlane`, `dlcDeliveryChoice`, `obmMovement`) plus two gene channels (the scalar
> `passLeadSupport`, the 16-weight OBM matrix) written on all three genome views of both teams.
> No engine byte moves.

---

## §FORM

### The world — ONE percept-armed base world, IDENTICAL in every arm

```text
new Match({ seed, teamA, teamB, duration: 240, edsPerceivedChoice: true })
```

**The world is DLC-T1's, exactly** — and, as at DLC-T1, it is a *forced* choice rather than a
defensible one: the CONTRAST ANCHOR re-walks DLC-T1's CHOICE arm against its committed battery
rows, and that arm lives in this world. Any other world forfeits G-ANCHOR, and with it the right
to say the plane is being compared against ruling #239's own arm. The OBM arming requirement
(OBM-T0's G-BLIND) still binds for PLANE × CHECK-AND-SHOW, and G-BLIND-WORLD stays HARD for
exactly that reason.

> ⭐⭐ **AND THIS WORLD SUBSTITUTES ~2/3 OF THE PLANE'S CHOICES AWAY — STATED AT THE HEAD, NOT
> DISCOVERED AT THE FOOT (#242.2, the third application of the OBM P1-trap lesson).** The plane
> chooses at DECISION time. In a percept world the pass **TARGET** is then re-chosen
> (`choosePerceivedPassTarget`), and the banked led-strike guard
> `passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)` **DISCARDS the plane's winner**
> whenever the man changed — the ball goes to the substituted man's feet. DLC-T0s measured it:
> **delivered rate 0.298 percept vs 0.776 bare**, substitution rate 0.560.
>
> ⭐ **THAT IS THE TREATMENT AS REALLY DELIVERED, AND THIS EXAM PUBLISHES IT PER ARM** rather than
> discovering it afterwards. It is a treatment-DELIVERY fact, not a mechanism failure: the seam
> does exactly what §LAW says and the guard that drops the winner is correct, banked behaviour (a
> substituted target was never priced with that strike). Two forms are published side by side:
> **(a)** the zero-pull **STRIKE-TIME** rate on the exam walks themselves
> (`ledPassesNonZero / passesChosen`, at battery grain, inside the bootstrap as `ledPassShare`);
> **(b)** the **DECODED** four-bucket rate on a declared observational seed (sampled-struck ·
> genuine zero-point · target-substituted · no chooser row), with a lockstep twin proving the
> chooser's sidecar trace perturbed nothing. ⚠ Power is budgeted against the DELIVERED n, and a
> DECISION-time rate is never read as a strike-time one.
>
> ⚠⚠ **SUPERSEDED IN PART — #242.3 (post-smoke decode correction, this round).** Form **(b)** as
> first published is **RETRACTED as a treatment reading**: its buckets are decided solely by
> `chosenGid === legacyGid` and carry **no grid information**, so a decision where the plane was
> **FULLY DEGENERATE** (all nine members exactly (0,0) — no remembered motion ⇒ reach 0 ⇒ the whole
> plane collapses onto today's kick by arithmetic) counted as *delivered* exactly like a live-grid
> zero-point win. The symptom that proves it matters: **the old statistic was not monotone in
> treatment** — PLANE-INERT, where no grid can exist, scored HIGHER than PLANE. ⇒ liveness is now
> **measured per decision** and the reading is `deliveredRateLiveGrid`, conditioned on decisions
> where the plane really had another kick to offer; the old number is kept, struck through, with
> the bracket it can honestly support. **Form (a), the strike-time rate, is untouched** — it never
> depended on the bucket decode. See §RESULT.
> ⚠⚠ **AND THE MEMBER-4 CELL IS `n/a`, NOT A MEASURED 0** (#242.3): a zero-displacement kick
> carries no 5th argument, so today's kick is **structurally unrecordable at strike time**. The
> inherited *"legacy man kept AND member 4 won"* bucket definition is corrected with it — that
> conjunction is unobservable on this channel. **No gate, rate, CI or verdict reads any of this**,
> and `src/**` is untouched by the correction.

⚠ Declared, as DLC-T1 declared it: `edsPerceivedChoice` also moves the CARRIER onto the
perceived-snapshot pass chooser, so this world is **not** a bare production world and absolute
levels are not comparable across exams. The paired contrast is clean either way, because all five
arms share this world exactly and differ by nothing but the delivery DOOR and the OBM matrix.

⭐ **THE FOUR-DOORS DECLARATION.** `ctbSupportPlane` is **FALSE in every arm** and `ptpPassLead` is
**FALSE in every arm** (the dial is retired, #235) — both asserted per arm in-probe off the REAL
constructed matches. Each arm declares its delivery door and its gene state, and ⭐⭐ **NO ARM
EVER OPENS TWO DELIVERY DOORS** (`neverBothDeliveryDoors`, a FLAG-HYGIENE row). That is not
tidiness: under DLC-T0s §LAW the **NEWEST seam YIELDS to every banked one** (`o1PassWindup >
ptpPassLead > dlcDeliveryChoice > dlcStrikePlane`, guarded on SEATS never on flags), so an
armed-both arm would silently **BE** the banked two-point contest wearing the plane's name, and
the whole PLANE-versus-CONTEST contrast would be a comparison of an arm with itself.

### ⭐⭐ The gene-semantics trap, disarmed in the arm table itself

`passLeadSupport` is **one gene read through three doors, and it means three different things**:

| door | what the gene is | what value 0 means |
| --- | --- | --- |
| `ptpPassLead` (the RETIRED dial — **no arm here**) | a **DOSE** forcing the aim | a forced aim of zero displacement |
| `dlcDeliveryChoice` (the banked two-point CONTEST — the CHOICE ANCHOR) | **TASTE**: it scales the ONE led candidate's projection magnitude, the candidate free to lose | the candidate still forms, competes and loses every tie |
| ⭐ `dlcStrikePlane` (**THE TREATMENT**) | ⭐⭐ **PRESENCE-GATE ONLY.** The magnitude RETIRED at #240/#241 and was MEASURED retired at DLC-T0s (**G-VALUE: gene 0 ≡ 0.37 ≡ 1, byte for byte**). The grid's scale is the banked projection **at weight 1** — the receiver-reachable set the engine already believes in | ⚠ **NOT "the mechanism off".** A gene-zero plane is a LIVE plane. What disables it is **ABSENCE**, and only absence (DLC-T0s G-BORN) |

⭐ **THIS IS WHY THIS STAGE'S IDENTITY ARM IS `PLANE-INERT` (flag armed, gene ABSENT) AND NOT A
GENE-ZERO ARM.** DLC-T1's ARMED-ZERO arm could exist because under the contest door 0 kept the
candidate alive at zero displacement. Under the plane door that arm would be a live treatment
wearing an identity arm's name. Every arm's row declares its door AND the gene's meaning under
that door (`geneSemanticsUnderThisDoor` in the artifact).

### The arms — 5, paired on ONE shared seed list (#20: cluster = match seed)

| arm | door | `passLeadSupport` | OBM matrix | the football sentence |
| --- | --- | --- | --- | --- |
| **ABSENT** | none | absent | none | the CONTROL — the percept-armed world with every seat unreached. DLC-T1's own ABSENT arm, world for world |
| **PLANE-INERT** | `sp` | **absent** | none | ⭐ **THE ARMING IDENTITY AT EXAM GRAIN.** The plane's door OPEN with the gene absent: the arming rule is EVALUATED on every on-ball decision and returns `null`, so no grid forms, nothing is priced and the pass loop runs the shipped statements alone ⇒ must be **BYTE-IDENTICAL to ABSENT** per seed. The statement it buys: *the plane costs the world nothing until it is given a gene* — measured here, not cited from T0s |
| ⭐ **PLANE** | `sp` | 1 | none | ⭐⭐ **THE CELL THE STAGE EXISTS FOR (M-DLC.1″ one-s)**: per support mate a 3×3 ground strike plane — direction (±θ, θ = `atan2(reach, d0)` DERIVED) × power (`d0 ± reach`) — priced by the ONE hoisted `groundCandidate` at each member's own receiving point, the ARGMAX picking THE KICK. The zero-point (i=0, j=0) **IS** today's kick (±0 IEEE) and wins every tie. The JOINT primary and the OVERSHOOT contrast are read here |
| **PLANE × CHECK-AND-SHOW** | `sp` | 1 | CHECK-AND-SHOW | ⭐ **the OBM MATRIX BESIDE IT**: the receiver comes short and asks (OBM-T1's own frozen matrix, re-walked as a receipt) AND the passer chooses his kick. DLC-T1's COMBINED cell with the two-point contest replaced by the plane |
| ⭐ **CHOICE-ANCHOR** | `dlc` | 1 | none | ⭐⭐ **THE CONTRAST ANCHOR**: DLC-T1's CHOICE arm — the banked two-point contest, `dlcStrikePlane` OFF — RE-WALKED on this stage's own seeds. Ruling #239's own arm: strictly better than the dial on every axis, and still interceptions +4.1 resolved with goals 0.18 below the band. The #240 OVERSHOOT prediction is read against it |

**Why exactly these five, and no sixth.** The contract's T1 set with the treatment swapped for this
slice's seam: control · arming identity · treatment · treatment × the relational pair · the
CONTRAST anchor (the #206 shadow idiom). ⭐ **No dose ladder exists to walk**: under the plane door
the gene has no magnitude at all (#240/#241, measured at T0s), so a ladder would be a knee on a
dial that does not exist. **K = 9 is the plane's own frozen constant** (DLC-T0s §LAW / §DEV 3), read
from the shipped module by G-TRACE-SP, and widening it is a commander's fork WITH cost numbers,
never an arm here.

### The ruler — ALL INHERITED, each with its own G-REPRO gate

| # | quantity | provenance | gate |
| --- | --- | --- | --- |
| **1** | **TRUE-holdable supply** (share of eligible moments) | the O2-T1 `trueCellOf` instrument VERBATIM on the #186 population | G-REPRO-O2T1 |
| **2** | **pressed-first-reception** (openPlay spells, `TOUCH_CONTROL_DIST`) | the #173 tempo-census instrument VERBATIM | G-REPRO-173 |
| 3 | short-option supply (poss ticks · first receptions) | #224.4(i)'s debt; radius family PARSED from source | G-TRACE-RADIUS |
| 4 | support-existence at PRESSED moments | (3) under (2)'s pressure test | — |
| **5** | the #218 arc shares (constructed ≥3/4/5 · scramble · set-piece) | the goal-genealogy ORIGIN CLASSIFIER, LOSS-TICK semantics verbatim | G-REPRO-GGC |

⭐⭐ **AND THE WHOLE SET IS PROVED TO BE DLC-T1's — G-ANCHOR (= G-REPRO-DLCT1).** This probe
re-walks the first rows of the **committed DLC-T1 BATTERY block** on **its CHOICE arm**, in
DLC-T1's own world, and must reproduce every published per-match field **exactly** — whole-match
**signature** (rng stream state inside) **and the DELIVERED-STRIKE columns** (`passesChosen` ·
`ptpLedHandled` · `ptpLedNonZero` · `ptpLeadSum` · `ptpLeadMax`). **One receipt, three loads:**

1. **the instrument is DLC-T1's** — every ruler, sampling rule, walk order and constant;
2. ⭐⭐ **the CONTRAST ANCHOR is ruling #239's own arm, not a look-alike** — the CHOICE-ANCHOR exam
   arm is *configuration-identical* to this walk (`armConfigurationIdentical` is itself a gate
   field), so the whole #240 OVERSHOOT clause is read against the arm that actually ran;
3. **this stage's `performPass` wrapper perturbs NOTHING** — it is installed on the anchor walk
   too, and the columns it produces are themselves compared.

### The estimator

The DLC-T1 set verbatim: per-match (seed-clustered) **paired** bootstrap, ratio-of-totals,
2.5/97.5 percentiles, 2,000 resamples, **one resampled seed-index set feeds every arm**.
`resolved` is a **mechanical CI flag**, **never a verdict** (#203). ⭐⭐ **ONE ADDITION, FROZEN WITH
THE OVERSHOOT PREDICTION**: the same resampled index sets are ALSO differenced against the CHOICE
ANCHOR (`contrasts.ratesVsAnchor`), because the overshoot clause is a PLANE-versus-ANCHOR sentence
and a paired CI for it cannot be read off two control-referenced CIs.

## §SUCCESS — the pre-registered primary, frozen verbatim

> **THE JOINT FORM (contract §1 H-DLC at this slice's cell):** at the **PLANE** arm the
> TRUE-holdable gain is retained (resolved helpful) **AND** goals stay inside the frozen band.
>
> **PLUS THE #240 OVERSHOOT PREDICTION AS THE CONTRAST CLAUSE (ruling #240.2, verbatim):** *"a led
> ball that wins the two-way contest is forced to the FULL projection magnitude; intermediate aims
> may retain the gain at lower cost … supply retained + interceptions fall + goals recover toward
> the band, vs the two-point contest as CONTRAST ANCHOR."* The finer grid should pick **gentler**
> strikes.

Operationally, frozen with the probe's own predicates:

* **LIMB A (the gain)** — `trueHoldableShare` at PLANE, paired-delta CI excluding zero in the
  **UP** direction (`resolvedHelpful`).
* **LIMB B (the poison)** — the `goals` equilibrium-band dimension at PLANE **inside** the frozen
  band (baseline 2.3944, tolerance ±15 %).
* ⭐ **JOINT = BOTH, TOGETHER.** Neither limb alone is the prediction: the retired dial already had
  the gain and died on the band; the two-point contest kept the gain unresolved-vs-control and
  stayed 0.18 below the band; and the band alone is what ABSENT has for free.
* ⭐⭐ **THE OVERSHOOT CLAUSE, MECHANICALLY EXACT, EX ANTE** (computed against the CHOICE ANCHOR
  with the anchor-referenced paired bootstrap):
  * **LIMB I — interceptions FALL**: `point(PLANE) < point(ANCHOR)` on `interceptionsPerMatch`.
    STRICT form `resolvedFall`: the anchor-referenced paired CI lies entirely below zero.
  * **LIMB G — goals RECOVER toward the band**: `bandDistance` **strictly decreases**, where
    `bandDistance` is 0 inside the frozen band and otherwise the distance to the **nearer** edge.
    STRICT form `intoBand`: PLANE inside the band where the ANCHOR is not.
  * **SATISFIED = LIMB I OR LIMB G** — the ruling's own disjunction, with both limbs and both
    strict forms published separately, and `trueHoldableShare` PLANE − ANCHOR published beside
    them so *"retained at lower cost"* is one sentence rather than one assembled after sight.
  * It is a **contrast clause of the primary, not a replacement for it**: the JOINT limbs are read
    first and this is read beside them.

⚠ **THE BAND LIMB'S GRAIN, FROZEN WITH IT AND INHERITED VERBATIM**: the equilibrium band **GATES
AT BATTERY N ONLY** (the PTP-T1/#198 form), and a dimension the ABSENT arm itself fails is
**EXCLUDED and DISCLOSED**. At smoke grain limb B — and with it the overshoot's LIMB G — is a
**plumbing reading**, computed and published so the predicate cannot be re-cut after sight.

### ⭐ REPORTED headline (secondary, never a primary)

1. ⭐⭐ **THE CHOSEN-STRIKE DISTRIBUTION over the NINE grid members, per arm** — by member, by
   direction step and by power step (index = `(dirStep+1)·3 + (powerStep+1)`; member 4 is today's
   kick). *This is the emergent KICK* — what the chooser actually does when the whole ground plane
   is priced. A DISCOVERY, never a set point. ⚠ **#242.3: the member-4 cell is `n/a`** — a
   zero-displacement kick carries no 5th argument, so today's kick is structurally unrecordable on
   this channel; zero-point wins are countable only at DECISION time.
2. ⭐⭐ **THE DELIVERED RATE PER ARM**, in both forms (§FORM's world note): the zero-pull
   strike-time share at battery grain, and — ⚠ **#242.3, corrected** — the **LIVE-GRID-conditioned**
   decoded rate with its substitution rate and its measured degeneracy split (the old
   `(sampled + zero-point) / kicks` form is retracted and kept struck through, with a bracket).
3. **THE EMERGENT LED SHARE** with its **situational profile** (pressed vs unpressed carrier at the
   instant of the strike, binned by the #173 census's own test) — the column that makes the plane's
   share readable beside the two-point contest's on one ruler.
4. The **tier-2 #218 shares** with their CIs, exactly as at DLC-T1.

No gate and no success condition reads any of them.

### Pre-named failure branches

* **F-T1s-a** — *the plane RETAINS the poison*: goals out of band at PLANE; the pricing itself
  misprices strikes, and the evaluation surgery reopens.
* **F-T1s-b** — *the plane KILLS the gain*: supply null at PLANE; the contest's gain was the
  two-point geometry's artifact.
* **F-T1s-c** — *a guard STOPs.* ⭐ The NAMED risk stays interceptions: a driven, turned ball into
  traffic is a through-ball-shaped gamble, and this stage publishes the strike distribution and the
  interception attribution beside the (unchanged) guard.

### The STOP granularity — FROZEN, inherited verbatim (#225.3(c))

F-T1s-b/c fire **per dose**: a dose whose guard **breaches** (resolved AND beyond the frozen
tolerance) is **disqualified**; the **arc-level STOP** fires only if **every** dose that moves a
primary ruler helpfully is disqualified. Every row is read **beside its delivered rate** — the
#242.2 discipline — so a null can never be read as *a strong treatment that failed* when it was *a
treatment that reached the ball on a third of kicks*.

⚠ **The probe fires none of them** (#203): it emits per-arm rows, paired deltas and mechanical CI
flags. Adjudication is the commander's.

## §GUARDS — every tolerance frozen ex ante (inherited verbatim)

| limb | direction | tolerance |
| --- | --- | --- |
| `interceptionsPerMatch` | ceiling | `NI_FRACTION · \|control\|` |
| `spreadYOut` | floor | `NI_FRACTION · \|control\|` |
| `spacingMedian` | floor | `NI_FRACTION · \|control\|` |
| `spacingUnder4` | ceiling | `NI_FRACTION · \|control\|` |
| offsides/match | the #157 **FLAG** form — a resolved increase returns to the commander, flips no gate |
| equilibrium band (goals/crosses/headers/longBalls/cutbacks) | **gates at battery N only**; the #198-form exclusion applies — ⭐ and `goals` is *also* limb B of the primary, so its exclusion state is published with the primary |

`NI_FRACTION = 1 − 0.275/0.380` (PM-T1 §5). `breach = resolved AND beyondTolerance` — **evidence**
for F-T1s-b/c, never the firing of it.

## §SEEDS — fresh, strictly above everything DLC-T0s consumed (#163)

DLC-T0s's own committed ledger (read off `data/dlc-t0s-strike-plane.json`): **12,427,000–024**
(receipts) · **12,427,025** (the REPORTED cost read) · **12,427,900–906** (test seeds). DLC-T1's
blocks (12,426,030–041 · 045 · 050–099 · 100–727 reserved) are in the ledger too. This stage
therefore starts at **12,428,000**.

| block | range | use |
| --- | --- | --- |
| **smoke** | **12,428,000 – 12,428,011** (12) | all 5 arms |
| **delivered-dose read** | **12,428,015** (1 seed × 5 arms) | the DECLARED observational block — the features, the two score multipliers and this stage's LAW CHECK pull percepts, so it may never touch exam data |
| ⭐⭐ **strike read** | **12,428,020** (1 seed × 5 arms × 2 matches) | the DECLARED fifth block — the member distribution + the substitution decode + its untraced LOCKSTEP TWIN |
| **exit-semantics guard** | **12,428,050 – 12,428,099** | any `DLCT1S_N`/`DLCT1S_SKIP_FP` override is routed here and adjudicates nothing |
| **battery** | **12,428,100 – (12,428,100 + N − 1)**, contiguous, cap **628** (⇒ ≤ 12,428,727) | the battery, if dispatched |
| reserved ceiling | 12,428,900 – 12,428,906 | this stage's test-seed band; keeps the battery room finite and below 12,428,899 |

⭐⭐ **AND THE ANCHOR ARM'S RE-WALK BLOCK: 12,426,100 – 12,426,107** — *inside* DLC-T1's own battery
block, with the **INVERTED** predicate: it MUST collide with its source, and a re-walk that came
back clash-free would prove it is walking fresh seeds instead of reproducing a receipt.

Disjointness is computed **in-probe** against the COMPLETE consumed ledger, never asserted here,
and for **every one of the eleven blocks this stage touches**: 3 FRESH · 2 RESERVED · **6
RE-WALKS** (O2-T1 · #173 · GGC · CTB-T1 · OBM-T1 · ⭐⭐ DLC-T1 CHOICE). The stage-own pairwise
predicate is the **corrected** `stageOwnUnified` form: intersecting stage-own intervals FAIL
**unless they are EXACTLY equal** — a PARTIAL overlap still FAILS.

**Stats stream**: base **105,800** (DLC-T1 consumed 105,400), min gap to any published base
**≥ 200**, complete namespace published in-probe.

## §NRULE — the DLC-T1 MDE form, recomputed for THIS stage

```text
m_iid  = (z.975 + z.80)² · (p0(1−p0) + p1(1−p1)) / (p1 − p0)²
DEFF   = MAX( inherited O2-T1 paired-delta DEFF , this stage's own smoke DEFF when it exists )
m_req  = DEFF · m_iid
N(q)   = ceil( m_req / momentsPerSeed )
N      = max_q N(q) , capped by the LEDGER ROOM and by the CTB-T1 precedent cap (628)
```

Unchanged from DLC-T1 except the same-world DEFF source, which is this stage's **most-perturbed**
arm (`planeXCas`). The MDEs stay the traced committed ones (the O2-T1 resolved delta for q1; the
#173 census's own smallest cross-arm gap for q2): no same-world MDE exists, and choosing one after
sight is exactly what frozen-before-sight forbids. The cap is a **CEILING, not a target**, and is
FLAGGED when it binds (`capBinds` beside `nRaw`; the probe re-cuts nothing).

## §GATES — frozen ex ante, ALL computed in-probe (#181.2)

| gate | predicate | kind |
| --- | --- | --- |
| **X-DET** | the whole core (5 arms + 7 receipt walks + 5 dose reads + ⭐ 5 strike reads × 2 matches + summaries + bootstrap) runs **TWICE**, byte-identical digests | HARD |
| **X-FP-PROD** | the production fingerprint re-derives `57b0bdab…c673` in-probe | HARD |
| **X-SRC-UNTOUCHED** | `git diff --stat -- src` is EMPTY | HARD |
| ⭐⭐ **G-ANCHOR** (= G-REPRO-DLCT1) | a re-walk of the committed DLC-T1 **battery** block's first rows **on its CHOICE arm** reproduces **every published field exactly** — signature AND the delivered-strike columns — and the exam's CHOICE-ANCHOR arm is proved CONFIGURATION-IDENTICAL to it | HARD |
| ⭐ **G-REPRO-OBMT1** | the OBM-T1 battery block re-walked on TWO arms (ABSENT · CHECK-AND-SHOW), every field exact | HARD |
| **G-REPRO-CTBT1** | the CTB-T1 battery block re-walked in CTB-T1's world, every field exact | HARD |
| **G-REPRO-O2T1** | ruler 1's rows reproduce the committed O2-T1 control rows | HARD |
| **G-REPRO-173** | ruler 2 reproduces the committed tempo-census numbers field for field | HARD |
| **G-REPRO-GGC** | ruler 5's ported classifier reproduces the committed genealogy census counts (63 fields) | HARD |
| **G-TRACE-RADIUS** | ruler 3's radius family is PARSED from `src/ai/formations.ts`, never typed | HARD |
| **G-TRACE-PTP** | the projection's constants are read from `src/**`, never typed (`PTP_FLIGHT_SPEED === 18`, `PTP_LEAD_FLIGHT_MUL === 1.6`, the through-ball loop's `/ 18`, `runBurstPoint`'s `* 1.6`), and the gene map probed through the shipped `passLeadSupportWeight` at absence, both ends and beyond both ends | HARD |
| ⭐ **G-TRACE-SP** | **the PLANE's own constants, traced**: `STRIKE_PLANE_K === 9`, `STRIKE_PLANE_ZERO_INDEX === 4`, `STRIKE_PLANE_STEPS === [-1,0,1]` read from the SHIPPED module's exports and the zero-point index CHECKED to be the (direction 0, power 0) member; plus the two INCUMBENT STRIKE lines matched VERBATIM (`const aim = norm(sub(lead, passer.pos));` and `const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;`) — because those two lines are what turn a moved aim point into (direction, power) | HARD |
| ⭐⭐ **G-FORK-TOKENS-SP** | **DLC-T0s's READ-FORK INVENTORY, RE-RUN at T1s** (#236 amendment 2): exactly ONE `match.dlcStrikePlane` fork in `src/**` at the named site, ONE `GRID_FORM`, ONE `CAND_SCORE` into the ONE hoisted pricer, ONE `GRID_CAPTURE` pair (2 lines), ⭐⭐ ONE `PLANE_GUARD` **naming no flag**, and ⭐ **THREE** `match.performPass(` statements in the brain — i.e. **ZERO added by the plane**; zero unclassified | HARD |
| ⭐ **G-FORK-TOKENS-DLC** | the banked CONTEST's inventory re-run (it is the ANCHOR's seam): ONE flag fork, ONE `groundCandidate` DECLARATION, exactly TWO of its calls matched VERBATIM, ONE led formation, TWO led captures, and ⭐ the plane's own THIRD call site counted at exactly ONE under its own class; zero unclassified | HARD |
| **G-FORK-TOKENS-PTP** | PTP-T0's inventory re-run: exactly ONE `ptpPassLead` fork, ONE lead computation, ONE aim composition, THREE aim-priced inputs, TWO lead captures, ONE strike guard, ONE led strike; zero unclassified | HARD |
| **G-FORK-TOKENS (OBM)** | OBM-T1's own inventory, unchanged; zero unclassified | HARD |
| ⭐ **G-BLIND-WORLD** | the percept trunk is **LIVE** in every arm's constructed world and the features are non-degenerate. ⚠ `allFeaturesZeroShare` is published as an **upper bound** on blindness | HARD |
| ⭐ **G-ARM** | **delivery on the axes an arm doses, silence on the ones it does not.** OBM half (DLC-T1 verbatim). Delivery half: the gene on all six genome views wherever a gene is declared; `ledPassesHandled === ledPassesNonZero` in **every** arm (the STRIKE_GUARD identity); an arm with a gene delivers a NON-ZERO displacement on at least one chosen pass; an arm with the gene ABSENT delivers **exactly zero** metres and reaches **no** law check; and on the observational read every struck displacement obeys **its own door's law** — for a PLANE arm, MEMBERSHIP of its own K = 9 grid re-derived through the shipped `groundStrikeGrid` (`planeUnmatched === 0`, IEEE-exact); for the CONTEST anchor, the projection ALGEBRA (0 sign, 0 magnitude violations) | HARD |
| **FLAG-HYGIENE** | ⭐ PLANE-INERT ≡ ABSENT per seed on the whole-match signature **and** every row field; the doses well-formed; ⭐⭐ the doors row read off the REAL constructed matches: `ctbSupportPlane` FALSE, `edsPerceivedChoice` TRUE and `ptpPassLead` FALSE in every arm, each delivery flag matching its arm's declared door, **`neverBothDeliveryDoors`**, `doorMatchesGenePresence` and **`exactlyOneArmedInertArm`** | HARD |
| **SEED-DISJOINT** | ⭐ EVERY one of the eleven blocks vs the COMPLETE consumed ledger, each under its own predicate; the **six RE-WALKS** must land **INSIDE** their sources' consumed intervals; the corrected `stageOwnUnified` form; sub-blocks ordered; battery clash-free and below 12,428,899 | HARD |
| **STATS-DISJOINT** | base 105,800, min gap ≥ 200 against the complete published namespace | HARD |
| **G-CLEAN-INVOCATION** | any `DLCT1S_N` / `DLCT1S_SKIP_FP` override routes onto the guard block, reds this gate and exits 1 | HARD |
| **REPORTED (a)** | ⭐⭐ the **CHOSEN-STRIKE DISTRIBUTION** over the 9 members per arm (member / direction / power). ⚠ **#242.3**: member 4 publishes `n/a` — structurally unrecordable at strike time | REPORTED |
| **REPORTED (b)** | ⭐⭐ the **DELIVERED RATE per arm**, both forms, with the substitution decode and its lockstep twin. ⚠ **#242.3**: the decoded form is now **LIVE-GRID-conditioned**; the old form is retracted, kept for audit with a bracket | REPORTED |
| **REPORTED (c)** | the **EMERGENT LED SHARE** + situational profile; the delivered OBM dose; the tier-2 #218 shares with CIs | REPORTED |

Checkpoint/resume is the #207 form (`DLCT1S_MODE` / `DLCT1S_RESUME` / `DLCT1S_CHECKPOINT`),
resilience only: the unit is the per-(pass, seed) set of 5 arm rows, nothing pooled is stored, a
resumed run is byte-identical to a fresh one, and the checkpoint is /tmp scratch read by no gate.

**Pre-named FAIL ⇒ STOP**: any HARD gate failing, any `src/**` diff, or any contradiction between
this document and the run — reported as-is, never re-cut after sight.

## §NON-CLAIMS

This stage claims **no** football effect and adjudicates **nothing**: it produces per-arm rows and
paired deltas. The smoke below is **12 seeds** — a plumbing shakedown and a first sight of the
emergent strike, **not** evidence. It changes no TeamBrain assignment or licence, no price table,
no receiver-side law and no engine byte; `src/**` is untouched and the production fingerprint is
unchanged. It does not claim the five cells exhaust the space, it does not claim the chooser's
PRICING is RIGHT (DLC-T0s §HONESTY 2 — that is precisely F-T1s-a's question), it does not claim
nine points is the strike space (elevation and spin are slices two-s and three-s, NAMED not built),
and the strike distribution it reports is a description of one arm's behaviour, not a
recommendation. It cannot authorize the battery or the later slices — only the commander can.
**F-T1s-a/b/c are the commander's.**

---

## §RESULT — the smoke

*(every number below is quoted FROM the committed artifact
[`data/dlc-t1s-strike-exam-smoke.json`](data/dlc-t1s-strike-exam-smoke.json), recomputed by
`DLCT1S_MODE=smoke npx tsx scripts/probes/dlc-t1s-strike-exam.ts`, and every table below was
**GENERATED PROGRAMMATICALLY** from that artifact by
[`scripts/analysis/dlc-t1s-smoke-result.ts`](../../scripts/analysis/dlc-t1s-smoke-result.ts) — the
generator is COMMITTED beside the doc this round, so the #229.2 rule is discharged in code rather
than promised in prose. No cell below was typed. The doc carries no evidence the artifact does
not — #181.2.)*

<!-- GENERATED: npx tsx scripts/analysis/dlc-t1s-smoke-result.ts -->

### The run

* **`resultSha256`** `e9888d5f6e70a300d176eec1edc3fbd590885c30680c3faea400c995a1f10e47`
* **X-DET core digest** `3a81267bafcf7d33cee9bc0b26041856f0e60965ae4ccbc9dfcb0a7ca2103a7f` (both passes)
* **12 seeds × 5 arms** (12428000..12428011), paired on one shared seed list, **plus** the SEVEN receipt walks (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · OBM-T1 8 × 2 arms · ⭐⭐ G-ANCHOR 8), the 5 delivered-dose reads and ⭐⭐ the 5 STRIKE READS (each a traced match + its untraced LOCKSTEP TWIN) — and the whole core runs **twice** (X-DET).
* Verdict: **ALL 22 GATES PASS** (`allGatesPass: true`), probe exit 0.
* Wall ≈ **290 s** — CONTEXT ONLY (#128), used in no rate and no gate. Per #197-M1 the hashed body is commit-free, timing-free and path-free.

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **X-DET** | ✅ PASS | two passes of the whole core, identical digests |
| **X-FP-PROD** | ✅ PASS | `57b0bdab…c673` re-derived unchanged (seed 1337, 2 seasons) |
| **X-SRC-UNTOUCHED** | ✅ PASS | `git diff --stat -- src` **EMPTY** — INSTRUMENT-ONLY, no engine byte moved |
| **⭐⭐ G-ANCHOR (G-REPRO-DLCT1)** | ✅ PASS | block 12426100..12426107 against the committed DLC-T1 **battery** artifact (`62865f9d…215b`), arm `choice`: **8 rows × 27 fields, 0 mismatches** (of 446 committed rows available) — whole-match **signature** (rng stream state inside) AND the DELIVERED-STRIKE columns included. `armConfigurationIdentical: true` |
| **⭐ G-REPRO-OBMT1** | ✅ PASS | block 12424100..12424107: 8 rows × 22 fields, **0 mismatches on ABSENT and 0 on CHECK-AND-SHOW** |
| **G-REPRO-CTBT1** | ✅ PASS | 8 rows × 20 fields, 0 mismatches, signature included |
| **G-REPRO-O2T1** | ✅ PASS | 12/12 rows, 0 mismatches |
| **G-REPRO-173** | ✅ PASS | pressedShare **0.7959** · pressed **1049** · unpressed **269** · all **1318**, field for field |
| **G-REPRO-GGC** | ✅ PASS | **63/63** committed fields, 0 mismatches |
| **⭐ G-TRACE-SP** | ✅ PASS | all 5 source lines matched VERBATIM; K = 9, zero-point index 4, steps [-1, 0, 1], and the zero-point member IS (direction 0, power 0): `true` |
| **G-TRACE-PTP** | ✅ PASS | all 4 source lines matched VERBATIM; the gene map probed through the shipped `passLeadSupportWeight`: absent 0, min 0, half 0.5, max 1, clamped at 0 / 1 beyond both ends |
| **G-TRACE-RADIUS** | ✅ PASS | `radius = 10 + g.supportDistance * 8` parsed from source |
| **⭐⭐ G-FORK-TOKENS-SP** | ✅ PASS | **24 src occurrences, ZERO unclassified**; exactly **1** `FLAG_FORK` · **1** `GRID_FORM` · **1** `CAND_SCORE` (into the ONE hoisted pricer) · **2** `GRID_CAPTURE` · **1** `PLANE_GUARD` (naming NO flag) · 4 `PLANE_ARGMAX`; and **3 `match.performPass(` statements in the brain — i.e. ZERO added by the plane** |
| **⭐ G-FORK-TOKENS-DLC** | ✅ PASS | **21 src occurrences, ZERO unclassified**; the banked contest's frozen counts UNCHANGED (1 `FLAG_FORK` · 1 `CAND_DECL` · 2 `CAND_SCORE` matched VERBATIM · 1 `LED_FORM` · 2 `LED_CAPTURE`), plus this stage's declared plane-era classes (SP_CAND_SCORE, SP_PRECEDENCE_GUARD) at 1 each |
| **G-FORK-TOKENS-PTP** | ✅ PASS | **68 src occurrences, ZERO unclassified**; exactly 1 `FLAG_FORK` · 1 `LEAD_COMPUTE` · 1 `AIM_COMPOSE` · 3 `AIM_APPLY` · 2 `LEAD_CAPTURE` · 1 `STRIKE_GUARD` · 1 `STRIKE_LED`. ⚠ the plane-era classes (SP_GRID_CAPTURE, SP_PRECEDENCE_GUARD, SP_SEAT_BODY) are this stage's declared Deviation 1 |
| **G-FORK-TOKENS (OBM)** | ✅ PASS | 37 src occurrences, 0 unclassified — OBM-T1's own inventory, unchanged |
| **⭐ G-BLIND-WORLD** | ✅ PASS | every arm percept-armed in its CONSTRUCTED world; `sawSnapshotShare` 99.942 % / 99.942 % / 99.935 % / 99.943 % / 99.940 %, all four feature means > 0 in every arm. ⚠ `allFeaturesZeroShare` 0.90 % / 0.90 % / 1.40 % / 1.15 % / 1.01 % is an **UPPER BOUND** on genuine silence |
| **SEED-DISJOINT** | ✅ PASS | ⭐ all **11** block rows machine-checked against the complete **52-entry** consumed ledger: 3 FRESH + 2 RESERVED clash-free, **6 RE-WALKS each landing INSIDE its source's consumed interval** (the inverted predicate, including ⭐⭐ the G-ANCHOR block). `stageOwnOverlaps` empty, sub-blocks ordered, battery room 800, next consumed 12428900 |
| **STATS-DISJOINT** | ✅ PASS | base **105800**, min gap **400** against the complete published namespace (50 bases) |
| **FLAG-HYGIENE** | ✅ PASS | **12/12** seeds ⭐ PLANE-INERT ≡ ABSENT — whole-match signature **and** every row field; ⭐⭐ the doors row: `ctbSupportPlaneFalseInEveryArm` true · `perceptArmedInEveryArm` true · `dialNeverArmed` true · `spFlagMatchesDoor` true · `dlcFlagMatchesDoor` true · **`neverBothDeliveryDoors` true** · `doorMatchesGenePresence` true · **`exactlyOneArmedInertArm` true** |
| **⭐ G-ARM** | ✅ PASS | delivery on the axes each arm doses and silence on the ones it does not. `ledPassesHandled === ledPassesNonZero` in **every** arm; zero metres in the inert arm; ⭐ the PLANE arms' law is MEMBERSHIP — `planeChecked` 0 / 0 / 15 / 20 / 0 with `planeUnmatched` 0 / 0 / 0 / 0 / 0 (IEEE-exact against the shipped `groundStrikeGrid`); the CONTEST anchor's is the ALGEBRA (0 sign / 0 magnitude violations); the four support-tick classes `partitionExact` in 5/5 |
| **G-CLEAN-INVOCATION** | ✅ PASS | no override in force |

### ⭐⭐ THE CHOSEN STRIKE — the emergent KICK over the NINE grid members (REPORTED)

*(observational, seed 12428020; index = (dirStep+1)·3 + (powerStep+1), so member **4 is TODAY'S KICK**. ⚠ An arm without the plane door has no grid: its member row is all zeros BY CONSTRUCTION.)*

⚠⚠ **MEMBER 4 IS `n/a`, NOT A MEASURED 0 (#242.3 — corrected this round).** This table is tallied from the **5th argument of `performPass`**, and a ZERO-DISPLACEMENT kick carries no 5th argument (the banked strike guard's own `bestLeadX !== 0 || bestLeadY !== 0`). So TODAY'S KICK HAS NO OBSERVATION CHANNEL HERE: the 0 this cell used to publish was a property of the instrument, not of the world, and the inherited bucket definition *"legacy man kept AND member 4 won"* is corrected with it — keeping the legacy man is observable, member 4 winning is not. ⭐ **Zero-point wins are countable only at DECISION time**, through an instrument that reads the argmax rather than the ball. The nearest banked evidence is DLC-T0s's **G-WINNER** (`data/dlc-t0s-strike-plane.json` → `gates.gWinner`): of the materially-spread decisions, **6 of 96 won by TODAY'S KICK** in the percept world and **5 of 75** in the bare world. ⚠ That is T0s's world, cited as the honest source for the QUANTITY — this stage runs no decision-time winner instrument of its own.

| arm | door | kicks | sampled-struck | 0 `d−1p−1` | 1 `d−1p0` | 2 `d−1p+1` | 3 `d0p−1` | **4 `d0p0` (today)** | 5 `d0p+1` | 6 `d+1p−1` | 7 `d+1p0` | 8 `d+1p+1` | unmatched |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | none | 52 | 0 | 0 | 0 | 0 | 0 | **n/a** | 0 | 0 | 0 | 0 | 0 |
| PLANE-INERT | sp | 52 | 0 | 0 | 0 | 0 | 0 | **n/a** | 0 | 0 | 0 | 0 | 0 |
| ⭐ **PLANE** | sp | 60 | 6 | 0 | 0 | 2 | 0 | **n/a** | 2 | 1 | 0 | 1 | 0 |
| PLANE-X-CAS | sp | 93 | 20 | 0 | 1 | 9 | 1 | **n/a** | 2 | 0 | 1 | 6 | 0 |
| ⭐ CHOICE-ANCHOR | dlc | 63 | 13 | 0 | 0 | 0 | 0 | **n/a** | 0 | 0 | 0 | 0 | 0 |

By DIRECTION and by POWER, and the size of the displacement that rode the ball:

| arm | by direction | by power | mean displacement | max | share of pass distance |
| --- | --- | --- | --- | --- | --- |
| ABSENT | `{"dir-1":0,"dir0":0,"dir1":0}` | `{"pow-1":0,"pow0":0,"pow1":0}` | 0.0000 m | 0.0000 m | 0.00000 |
| PLANE-INERT | `{"dir-1":0,"dir0":0,"dir1":0}` | `{"pow-1":0,"pow0":0,"pow1":0}` | 0.0000 m | 0.0000 m | 0.00000 |
| ⭐ **PLANE** | `{"dir-1":2,"dir0":2,"dir1":2}` | `{"pow-1":1,"pow0":0,"pow1":5}` | 10.4750 m | 16.9473 m | 0.64209 |
| PLANE-X-CAS | `{"dir-1":10,"dir0":3,"dir1":7}` | `{"pow-1":1,"pow0":2,"pow1":17}` | 8.3376 m | 20.4247 m | 0.61505 |
| ⭐ CHOICE-ANCHOR | `{"dir-1":0,"dir0":0,"dir1":0}` | `{"pow-1":0,"pow0":0,"pow1":0}` | 6.2664 m | 13.4019 m | 0.48966 |

### ⭐⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242.2)

⭐⭐ **CORRECTED THIS ROUND (#242.3).** The first table is the reading; the second is the RETRACTED one, kept so the supersession is auditable.

**(a) THE CORRECTED READING — delivered rate CONDITIONED ON LIVE-GRID DECISIONS.** A zero-displacement kick only counts as *the plane declining* if the plane had another kick to decline. Liveness is now MEASURED per decision, on the LEGACY man's own grid (the man the plane's argmax winner was priced on): **LIVE** = at least one of the nine members is a different kick; **DEGENERATE** = all nine exactly (0,0) — no remembered motion ⇒ reach 0 ⇒ the whole plane collapses onto today's kick BY ARITHMETIC, so the treatment was IMPOSSIBLE at that decision; **no seat** = the gene is absent, so no grid forms at all.

| arm | a PLANE reading? | kicks | sampled-struck | zero-point: LIVE / **DEGENERATE** / no seat | substituted: LIVE / **DEGENERATE** / no seat | no chooser row | live-grid n | ⭐⭐ **delivered rate (LIVE-GRID)** | ⭐ delivered rate (strike-time, BATTERY GRAIN) | lockstep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | no — no grid here | 52 | 0 | 0 / **0** / 0 | 0 / **0** / 0 | 14 | 0 | n/a — no plane here | 0.00000 | true |
| PLANE-INERT | no — no grid here | 52 | 0 | 0 / **0** / 20 | 0 / **0** / 18 | 14 | 0 | n/a — no plane here | 0.00000 | true |
| ⭐ **PLANE** | **yes** | 60 | 6 | 0 / **12** / 0 | 19 / **11** / 0 | 12 | 25 | **0.2400** | 0.22437 | true |
| PLANE-X-CAS | **yes** | 93 | 20 | 2 / **13** / 0 | 36 / **11** / 0 | 11 | 58 | **0.3793** | 0.22871 | true |
| ⭐ CHOICE-ANCHOR | no — no grid here | 63 | 13 | 0 / **0** / 0 | 0 / **0** / 0 | 8 | 0 | n/a — no plane here | 0.13797 | true |

⭐ **WHY THE CORRECTED COLUMN IS `n/a` ON THREE ARMS AND THAT IS THE POINT.** An arm with no plane has no treatment to deliver, so it gets no delivered rate — where the old column happily printed one. PLANE-INERT reads `n/a` for the sharpest possible reason: the gene is ABSENT, so **no seat and therefore no grid ever forms**, and every one of its decisions lands in *no seat*.

**(b) THE RETRACTED READING**, kept for audit — `(sampled-struck + genuine zero-point) / kicks`, with the bracket it can honestly support:

| arm | kicks | sampled-struck | genuine zero-point | ⚠ target-SUBSTITUTED | no chooser row | substitution rate | ⚠ **delivered rate (decoded — RETRACTED)** | ⭐ honest bracket for that formula |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 52 | 0 | 20 | 18 | 14 | (0.3462) | (~~0.3846~~) | ([0.0000, 0.3846]) |
| PLANE-INERT | 52 | 0 | 20 | 18 | 14 | (0.3462) | (~~0.3846~~) | ([0.0000, 0.3846]) |
| ⭐ **PLANE** | 60 | 6 | 12 | 30 | 12 | 0.5000 | ~~0.3000~~ | [0.1000, 0.3000] |
| PLANE-X-CAS | 93 | 20 | 15 | 47 | 11 | 0.5054 | ~~0.3763~~ | [0.2150, 0.3763] |
| ⭐ CHOICE-ANCHOR | 63 | 13 | 13 | 29 | 8 | (0.4603) | (~~0.4127~~) | ([0.2064, 0.4127]) |

⚠⚠ **THE RETRACTION, STATED PLAINLY.** `deliveredRateDecoded`'s bucket is decided SOLELY by `chosenGid === legacyGid` and carries **no grid information at all**, so it scored two OPPOSITE facts identically: *the plane offered another kick and the decision declined it* (a real zero-point win) and *the plane had nothing to offer* (a fully degenerate grid — the treatment was impossible at that decision). ⭐ **THE SYMPTOM THAT PROVES IT MATTERS: the old statistic was NOT MONOTONE IN TREATMENT.** PLANE-INERT — where no grid can exist — scored **0.3846**, HIGHER than PLANE's **0.3000**, because on an arm with no plane every kept-legacy kick banks into the same numerator. ⭐ And on THIS match the PLANE arm's **all 12** "genuine zero-point" kicks had a FULLY DEGENERATE grid — the thin-channel mechanism never connected at a single one of them — so the honest statement the old formula supports there is the BRACKET **[0.1000, 0.3000]**, not the point value 0.3000.

⚠⚠ **PARENTHESISED CELLS ARE NOT A PLANE READING** (`deliveredRateIsATreatmentReading: false`): the percept chooser runs — and substitutes — in EVERY arm, so the four buckets fill even where no grid exists, but with no grid there is no plane winner to deliver or discard and "genuine zero-point" means only that the chooser kept the legacy man. ⭐ THE STRIKE-TIME COLUMN IS THE EXCEPTION AND IS NEVER PARENTHESISED: it counts kicks that carried the CHOOSER'S OWN displacement, whichever chooser the arm has — so at CHOICE-ANCHOR it is the two-point contest's own delivered rate, and at ABSENT / PLANE-INERT it is exactly 0 because no chooser exists to displace anything.

⚠ **READ THE COLUMNS EXACTLY.** The LIVE-GRID rate is `(sampled-struck + live-grid zero-point) / (that + live-grid substituted)` on ONE observational match — degenerate grids, seatless decisions and `no chooser row` enter NEITHER side; the RETRACTED decoded rate was `(sampled-struck + genuine zero-point) / kicks` on the same match; the STRIKE-TIME rate is `ledPassesNonZero / passesChosen` across ALL 12 exam seeds with zero percept pulls, i.e. the rate the treatment was delivered at in the matches every ruler is computed on. `no chooser row` (a keeper, a restart with no executable option, a cutback) is UNDETERMINED and folded into NEITHER side. `lockstep` is the receipt that the chooser's sidecar trace perturbed nothing: same kicks, same sampled count, same per-member wins as an UNTRACED twin at the same seed and arm.

### ⭐ THE EMERGENT LED SHARE and its SITUATIONAL PROFILE (REPORTED — no gate reads them)

| arm | door | gene | passes chosen | displacement wins | **share** | mean | max | disp / pass dist | interceptions per such pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | none | absent | 1370 | 0 | **0.00 %** | 0.0000 m | 0.0000 m | 0.00000 | n/a (none) |
| PLANE-INERT | sp | absent | 1370 | 0 | **0.00 %** | 0.0000 m | 0.0000 m | 0.00000 | n/a (none) |
| ⭐ **PLANE** | sp | 1 | 1658 | 372 | **22.44 %** | 7.4048 m | 24.4517 m | 0.55202 | 1.11559 |
| PLANE-X-CAS | sp | 1 | 1902 | 435 | **22.87 %** | 7.3087 m | 24.3951 m | 0.54859 | 1.17241 |
| ⭐ CHOICE-ANCHOR | dlc | 1 | 1638 | 226 | **13.80 %** | 5.8441 m | 15.2696 m | 0.44329 | 1.76991 |

| arm | share at PRESSED | share at UNPRESSED | pressed passes | unpressed passes | partition exact |
| --- | --- | --- | --- | --- | --- |
| ABSENT | 0.00 % (0/1022) | 0.00 % (0/348) | 1022 | 348 | true |
| PLANE-INERT | 0.00 % (0/1022) | 0.00 % (0/348) | 1022 | 348 | true |
| ⭐ **PLANE** | 21.72 % (250/1151) | 24.06 % (122/507) | 1151 | 507 | true |
| PLANE-X-CAS | 21.20 % (297/1401) | 27.54 % (138/501) | 1401 | 501 | true |
| ⭐ CHOICE-ANCHOR | 12.78 % (147/1150) | 16.19 % (79/488) | 1150 | 488 | true |

### ⭐⭐ THE JOINT PRE-REGISTERED PRIMARY — mechanical flags only, NOTHING is fired (#203)

| arm | supply Δ (pp) | 95 % CI (pp) | `resolvedHelpful` | goals/match | frozen band | `inBand` | **JOINT** | which limb fails |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PLANE-INERT | 0.0000 | [0.0000, 0.0000] | false | 2.0833 | [2.0352, 2.7536] | true | **false** | the SUPPLY GAIN (the F-T1s-b shape: the gain killed) |
| ⭐ **PLANE** | 0.2640 | [-0.3080, 0.8056] | false | 1.5833 | [2.0352, 2.7536] | false | **false** | BOTH |
| PLANE-X-CAS | -0.0024 | [-0.4514, 0.4149] | false | 1.75 | [2.0352, 2.7536] | false | **false** | BOTH |
| ⭐ CHOICE-ANCHOR | 0.4096 | [0.1004, 0.8391] | true | 1.5833 | [2.0352, 2.7536] | false | **false** | the GOALS BAND (the F-T1s-a shape: the poison retained) |

⚠ **THE BAND LIMB'S GRAIN, STATED WITH THE ROW.** `controlAlsoInBand` is **true** (the ABSENT arm reads 2.0833 goals/match against the frozen band [2.0352, 2.7536] at 12 seeds); excluded dimensions ["crosses"], gated dimensions ["goals","headers","longBalls","cutbacks"]. The band **GATES AT BATTERY N ONLY** — inherited verbatim, frozen before this ran. At smoke grain every `inBand` cell above is a **plumbing reading, not evidence**, and no F-branch may be read off it.

### ⭐⭐ THE #240 OVERSHOOT CONTRAST — PLANE vs the CHOICE ANCHOR (mechanical flags only)

| limb | quantity | reading | flag | strict form |
| --- | --- | --- | --- | --- |
| **I — interceptions FALL** | `interceptionsPerMatch`, PLANE − ANCHOR | 1.2500 [-4.0833, 6.0000] | `fall` **false** | `resolvedFall` false |
| **G — goals RECOVER** | band distance (0 inside; else distance to the nearer edge) | plane 0.4519 vs anchor 0.4519 | `recover` **false** | `intoBand` false |
| (retention, published beside them) | `trueHoldableShare`, PLANE − ANCHOR | -0.1456 pp [-1.0037, 0.5672] | `resolvedVsAnchor` false | — |

⇒ **SATISFIED = false** (LIMB I **OR** LIMB G, the ruling's own disjunction); strict form **false**. The estimator is the ANCHOR-REFERENCED paired bootstrap — the same resampled seed-index sets differenced PLANE − ANCHOR, never two control-referenced CIs **subtracted**. ⚠ At smoke grain these are plumbing readings: the band gates at battery N only and the CIs at 12 clusters are wider than anything they could detect.

### THE GUARDS

| limb | control | tolerance | resolved arms | **breaches** |
| --- | --- | --- | --- | --- |
| interceptionsPerMatch (ceiling) | 28.1667 | ±7.7829 | PLANE +6.4167, PLANE-X-CAS +14.3333, CHOICE-ANCHOR +5.1667 | **planeXCas** |
| spreadYOut (floor) | 5.9735 | ±1.6506 | none | **none** |
| spacingMedian (floor) | 13.7133 | ±3.7892 | none | **none** |
| spacingUnder4 (ceiling) | 0.0838 | ±0.0232 | none | **none** |

Offsides (the #157 FLAG form): resolved INCREASES — **none**.

### THE N RULE (in-probe, from the committed artifacts)

DEFF **0.8302** (INHERITED from the O2-T1 committed paired-delta CI (no same-world source yet)). q1 ⇒ **N 628** (p0 0.006391, MDE 0.001575, 59.65 eligible moments/seed), q2 ⇒ N 66 (p0 0.8085, MDE 0.03073, 34.48 first receptions/seed), binding **q1TrueHoldable**, **N\* = 628**; ledger room 800 (binds=false), cap 628 (binds=false). Battery block **12428100..12428727** — inside the ledger and below the 12428900 ceiling. Source of p0: INHERITED (out-of-world: O2-T1 control + #173 prod).

### TIER-1 SUPPLY RULERS AND THE TIER-2 SHARES — rows, never verdicts (#203)

**Ruler 1 — TRUE-holdable supply** (ABSENT **0.4237 %**):

| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 0.4237 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 0.4237 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 0.6878 % | 0.2640 | [-0.3080, 0.8056] | false |
| PLANE-X-CAS | sp | 0.4213 % | -0.0024 | [-0.4514, 0.4149] | false |
| ⭐ CHOICE-ANCHOR | dlc | 0.8333 % | 0.4096 | [0.1004, 0.8391] | true |

**Ruler 2 — pressed first reception** (ABSENT **85.0746 %**):

| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 85.0746 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 85.0746 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 83.5185 % | -1.5561 | [-5.6666, 2.7277] | false |
| PLANE-X-CAS | sp | 84.3750 % | -0.6996 | [-4.8174, 3.1326] | false |
| ⭐ CHOICE-ANCHOR | dlc | 81.9392 % | -3.1355 | [-8.4018, 2.1675] | false |

**The named risk — interceptions per match** (ABSENT **28.1667**):

| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 28.1667 | — | (CONTROL) | — |
| PLANE-INERT | sp | 28.1667 | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 34.5833 | 641.6667 | [166.6667, 1208.3333] | true |
| PLANE-X-CAS | sp | 42.5000 | 1433.3333 | [1116.6667, 1775.0000] | true |
| ⭐ CHOICE-ANCHOR | dlc | 33.3333 | 516.6667 | [91.6667, 991.6667] | true |

**Tier 2 — constructed ≥5 (non-set-piece pool)** (ABSENT **4.7619 %**):

| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 4.7619 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 4.7619 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 12.5000 % | 7.7381 | [-8.3333, 31.2500] | false |
| PLANE-X-CAS | sp | 5.8824 % | 1.1204 | [-11.5385, 20.3762] | false |
| ⭐ CHOICE-ANCHOR | dlc | 0.0000 % | -4.7619 | [-12.0000, 0.0000] | false |

**Tier 2 — scramble share of goals** (ABSENT **60.0000 %**):

| arm | door | point | Δ (pp) | 95 % CI (pp) | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 60.0000 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 60.0000 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 57.8947 % | -2.1053 | [-22.7273, 14.8148] | false |
| PLANE-X-CAS | sp | 76.1905 % | 16.1905 | [-20.5882, 40.1515] | false |
| ⭐ CHOICE-ANCHOR | dlc | 52.6316 % | -7.3684 | [-26.3868, 22.2222] | false |

⚠ **THE CAPTION THAT MATTERS MORE THAN THE CELLS.** At 12 seeds each arm scores 25 / 25 / 19 / 21 / 19 goals in total (in arm order), so a single goal is worth several pp on any of these shares: they move in STEPS and their CIs are wider than anything they could detect. **These are plumbing readings, not evidence.**

### §CHECKS

```text
$ npx tsc --noEmit
(clean)

$ DLCT1S_MODE=smoke npx tsx scripts/probes/dlc-t1s-strike-exam.ts
  ALL                PASS      (22 gates)
  exit 0 · artifact docs/world-model/data/dlc-t1s-strike-exam-smoke.json

$ npx tsx scripts/analysis/dlc-t1s-smoke-result.ts    (the committed §RESULT generator, #229.2)
  → the whole §RESULT section above, on stdout

$ npx vitest run tests/dlcStrikePlane.test.ts          (the stage's own test file, #242.3 round)
  21 passed (21)
```

⭐⭐ **THE #242.3 RE-RUN, AND WHAT MOVED (this round's decode correction).** The probe was re-run
whole after the two REPORTED-layer fixes above. **All 22 gates PASS, exit 0**, and the artifact was
diffed field by field against the superseded one: **every HARD-gate measurement is byte-identical**
— every kick count, sampled count, per-member win, displacement statistic, reproduction row and
fork-token count. The ONLY value changes outside the strike-read block are the two whole-body
digests and `resultSha256` (they hash the REPORTED layer too, so they were *expected* to move;
`digestA === digestB`, X-DET intact) plus the two CONTEXT-ONLY envelope fields (git head, wall
clock), which ride outside `resultSha256` by construction. Inside the strike-read block the only
pre-existing field whose value changed is `byMember[4].wins`, `0 → null` on all five arms — the
member-4 correction itself. ⭐ **And the liveness measurement did NOT perturb the read**:
`lockstepWithUntraced` is `true` on all five arms and every count is unchanged, even though the
correction adds percept pulls at decisions that previously had none.

* superseded `resultSha256` `8abb1e9a61f1fb5fd306bf6c0892bbfb93aca27dfcf33ef7eb693e99e9b1880f`
* superseded X-DET digest `291d793e55a6226de69bd90bc22d93e2c169957f67f8d4827e0a18f8de0c94c8`

`npm test` and the override-route (`DLCT1S_N=1 DLCT1S_SKIP_FP=1`) guard check: the override route
**was** exercised on this round (twice, on the guard block 12,428,050+, as the plumbing shakedown
that found the two instrument gaps in Deviations 1 and 2) and behaved exactly as frozen —
G-CLEAN-INVOCATION RED, X-FP-PROD skipped-and-RED, the exam block routed onto the guard band (whose
partial overlap with the reserved guard block correctly reds SEED-DISJOINT), exit 1, artifact to
`/tmp`. `npm test` is **not** re-run in this round's receipts and is named here rather than
implied: this round adds **one probe, one generator, one doc and one artifact**, touches **no**
`tests/**` file and **no** `src/**` byte (X-SRC-UNTOUCHED is a HARD gate and PASSES on the run that
wrote the artifact), so the suite's state is the one banked at `a7dbc48`, including the known
#196.2 wall-clock flake.

### Deviations recorded

1. ⭐⭐ **TWO INHERITED GATE PREDICATES WERE INCOMPLETE ABOUT THE *CURRENT* TREE, AND WERE
   COMPLETED RATHER THAN LOOSENED** (the #228.5(b) form; DLC-T1's own Deviation 1 precedent,
   followed exactly). `G-FORK-TOKENS-PTP` and `G-FORK-TOKENS-DLC` enumerate every `src/**` line
   carrying their token families and require **zero unclassified**. Both were frozen **before the
   STRIKE PLANE was banked** (#242), so on this tree the plane's own lines have no name in them:
   for the PTP inventory its **two grid captures**, its **precedence guard** (which names `ptpSeat`
   precisely so the pinned `match.ptpPassLead` fork line is never edited) and the seat module's
   body; for the DLC inventory its **third call into the one hoisted `groundCandidate`** and the
   same precedence guard (which names `dlcSeat`). **The first full run of this probe reported
   exactly that and went RED, correctly.** The fix is INSTRUMENT-SIDE ONLY and STRICTLY ADDITIVE:
   new classes (`SP_GRID_CAPTURE`, `SP_PRECEDENCE_GUARD`, `SP_SEAT_BODY`, `SP_CAND_SCORE`), the
   SAME token sets, and **every frozen count asserted UNCHANGED** — the banked contest still has
   exactly ONE `groundCandidate` declaration and exactly TWO candidate scorings matched VERBATIM,
   and the plane's own call is counted at exactly ONE under its own class. No `src/**` byte moved
   and no predicate was loosened.
2. ⚠ **THE LEDGER'S CEILING FOR THIS STAGE WAS ENTERED EX ANTE, NOT INFERRED.** The battery ROOM is
   computed in-probe as *the distance to the next consumed interval above the battery base*, and
   nothing in the inherited ledger sits above 12,428,100 — the first guard run reported
   `batteryRoom: Infinity`, i.e. a ceiling that does not exist. The stage's own reserved test-seed
   band (**12,428,900–906**) is therefore entered in the CONSUMED ledger as a row of its own, which
   restores the finite structural ceiling every stage in this family has carried (room **800**, the
   battery cap 628 binding first). Declared here rather than left as a silent Infinity.
3. **THE ANCHOR IS THE CONTEST, NOT THE DIAL.** DLC-T1's G-ANCHOR re-walked PTP-T1's LEAD arm
   because the dial was the arm under contrast there. This stage's contrast is the #240 overshoot
   clause, whose reference is the two-point CONTEST, so G-ANCHOR re-walks **DLC-T1's CHOICE arm**
   against DLC-T1's committed battery artifact instead. The retired dial is armed in **no** arm of
   this exam (`dialNeverArmed`, a FLAG-HYGIENE row).
4. ⭐ **THE ESTIMATOR GREW A SECOND REFERENCE, AND ONLY ONE.** The #240 clause is a
   PLANE-versus-ANCHOR sentence, so `contrasts.ratesVsAnchor` differences the SAME resampled
   seed-index sets against the CHOICE ANCHOR. Nothing else about the estimator moved, and no
   control-referenced number in this stage is computed from it.
5. **THE IDENTITY ARM CHANGED SHAPE BECAUSE THE GENE DID.** DLC-T1's ARMED-ZERO arm (door open,
   gene 0) has no counterpart under this door: the magnitude retired at #240/#241 and DLC-T0s
   MEASURED gene 0 ≡ 0.37 ≡ 1, so a gene-zero plane is a LIVE plane. The arming identity is
   therefore **PLANE-INERT** (door open, gene ABSENT), and `exactlyOneArmedInertArm` is a
   FLAG-HYGIENE row so the substitution cannot be made silently in a later stage.
6. ⚠ **THE STRIKE READ IS A DECLARED POST-T0s INSTRUMENT, FROZEN EX ANTE HERE.** DLC-T0s added its
   substitution decode AFTER its run, in response to a verify finding (#242.2), and said so. This
   stage takes that instrument as a FROZEN, pre-registered REPORTED reading on its own declared
   seed block, with a lockstep twin — i.e. the correction is inherited as design rather than
   repeated as a discovery.

---

## §RESULT — the FULL BATTERY

*(every number below is quoted FROM the committed artifact
[`data/dlc-t1s-strike-exam.json`](data/dlc-t1s-strike-exam.json), recomputed by
`DLCT1S_MODE=full npx tsx scripts/probes/dlc-t1s-strike-exam.ts`, and every table below was
**GENERATED PROGRAMMATICALLY** from that artifact by
[`scripts/analysis/dlc-t1s-battery-result.ts`](../../scripts/analysis/dlc-t1s-battery-result.ts) —
the smoke generator extended to battery grain, COMMITTED beside the doc this round, so the #229.2
rule is discharged in code rather than promised in prose. No cell below was typed. The doc carries
no evidence the artifact does not — #181.2.)*

⚠ **NOTHING BELOW IS ADJUDICATED (#203).** The rows, the paired deltas and the mechanical
`resolved` / `inBand` / `jointSatisfied` / `fall` / `recover` / `satisfied` flags are the probe's;
the reading of them is **ruling #244**'s. No F-branch is fired in the probe, in the generator or in
this section.

<!-- GENERATED: npx tsx scripts/analysis/dlc-t1s-battery-result.ts docs/world-model/data/dlc-t1s-strike-exam.json -->

### The run

* **`resultSha256`** `82a7dd2a8f5d95616a79c3dc52b7e653cdaf04bcb1118a4a87395a965cd629d2`
* **X-DET core digest** `42e8d2ad628555dc2b4b34503994b0fe5f7e571c513c0956765f28377204448e` (both passes)
* **446 seeds × 5 arms** (12428100..12428545), paired on one shared seed list, **plus** the SEVEN receipt walks (O2-T1 12 · #173 40 · GGC 12 · CTB-T1 8 · OBM-T1 8 × 2 arms · ⭐⭐ G-ANCHOR 8), the 5 delivered-dose reads and ⭐⭐ the 5 STRIKE READS (each a traced match + its untraced LOCKSTEP TWIN) — and the whole core runs **twice** (X-DET).
* Verdict: **ALL 22 GATES PASS** (`allGatesPass: true`), probe exit 0.
* Wall ≈ **5,868 s** — CONTEXT ONLY (#128), used in no rate and no gate. Per #197-M1 the hashed body is commit-free, timing-free and path-free.

### Gate table

| gate | verdict | evidence (all recomputed in-probe, #181.2) |
| --- | --- | --- |
| **X-DET** | ✅ PASS | two passes of the whole core, identical digests |
| **X-FP-PROD** | ✅ PASS | `57b0bdab…c673` re-derived unchanged (seed 1337, 2 seasons) |
| **X-SRC-UNTOUCHED** | ✅ PASS | `git diff --stat -- src` **EMPTY** — INSTRUMENT-ONLY, no engine byte moved |
| **⭐⭐ G-ANCHOR (G-REPRO-DLCT1)** | ✅ PASS | block 12426100..12426107 against the committed DLC-T1 **battery** artifact (`62865f9d…215b`), arm `choice`: **8 rows × 27 fields, 0 mismatches** (of 446 committed rows available) — whole-match **signature** (rng stream state inside) AND the DELIVERED-STRIKE columns included. `armConfigurationIdentical: true` |
| **⭐ G-REPRO-OBMT1** | ✅ PASS | block 12424100..12424107: 8 rows × 22 fields, **0 mismatches on ABSENT and 0 on CHECK-AND-SHOW** |
| **G-REPRO-CTBT1** | ✅ PASS | 8 rows × 20 fields, 0 mismatches, signature included |
| **G-REPRO-O2T1** | ✅ PASS | 12/12 rows, 0 mismatches |
| **G-REPRO-173** | ✅ PASS | pressedShare **0.7959** · pressed **1049** · unpressed **269** · all **1318**, field for field |
| **G-REPRO-GGC** | ✅ PASS | **63/63** committed fields, 0 mismatches |
| **⭐ G-TRACE-SP** | ✅ PASS | all 5 source lines matched VERBATIM; K = 9, zero-point index 4, steps [-1, 0, 1], and the zero-point member IS (direction 0, power 0): `true` |
| **G-TRACE-PTP** | ✅ PASS | all 4 source lines matched VERBATIM; the gene map probed through the shipped `passLeadSupportWeight`: absent 0, min 0, half 0.5, max 1, clamped at 0 / 1 beyond both ends |
| **G-TRACE-RADIUS** | ✅ PASS | `radius = 10 + g.supportDistance * 8` parsed from source |
| **⭐⭐ G-FORK-TOKENS-SP** | ✅ PASS | **24 src occurrences, ZERO unclassified**; exactly **1** `FLAG_FORK` · **1** `GRID_FORM` · **1** `CAND_SCORE` (into the ONE hoisted pricer) · **2** `GRID_CAPTURE` · **1** `PLANE_GUARD` (naming NO flag) · 4 `PLANE_ARGMAX`; and **3 `match.performPass(` statements in the brain — i.e. ZERO added by the plane** |
| **⭐ G-FORK-TOKENS-DLC** | ✅ PASS | **21 src occurrences, ZERO unclassified**; the banked contest's frozen counts UNCHANGED (1 `FLAG_FORK` · 1 `CAND_DECL` · 2 `CAND_SCORE` matched VERBATIM · 1 `LED_FORM` · 2 `LED_CAPTURE`), plus this stage's declared plane-era classes (SP_CAND_SCORE, SP_PRECEDENCE_GUARD) at 1 each |
| **G-FORK-TOKENS-PTP** | ✅ PASS | **68 src occurrences, ZERO unclassified**; exactly 1 `FLAG_FORK` · 1 `LEAD_COMPUTE` · 1 `AIM_COMPOSE` · 3 `AIM_APPLY` · 2 `LEAD_CAPTURE` · 1 `STRIKE_GUARD` · 1 `STRIKE_LED`. ⚠ the plane-era classes (SP_GRID_CAPTURE, SP_PRECEDENCE_GUARD, SP_SEAT_BODY) are this stage's declared Deviation 1 |
| **G-FORK-TOKENS (OBM)** | ✅ PASS | 37 src occurrences, 0 unclassified — OBM-T1's own inventory, unchanged |
| **⭐ G-BLIND-WORLD** | ✅ PASS | every arm percept-armed in its CONSTRUCTED world; `sawSnapshotShare` 99.942 % / 99.942 % / 99.935 % / 99.943 % / 99.940 %, all four feature means > 0 in every arm. ⚠ `allFeaturesZeroShare` 0.90 % / 0.90 % / 1.40 % / 1.15 % / 1.01 % is an **UPPER BOUND** on genuine silence |
| **SEED-DISJOINT** | ✅ PASS | ⭐ all **11** block rows machine-checked against the complete **52-entry** consumed ledger: 3 FRESH + 2 RESERVED clash-free, **6 RE-WALKS each landing INSIDE its source's consumed interval** (the inverted predicate, including ⭐⭐ the G-ANCHOR block). `stageOwnOverlaps` empty, sub-blocks ordered, battery block **12428100..12428545** (N 446), room 800, next consumed 12428900 |
| **STATS-DISJOINT** | ✅ PASS | base **105800**, min gap **400** against the complete published namespace (50 bases) |
| **FLAG-HYGIENE** | ✅ PASS | **446/446** seeds ⭐ PLANE-INERT ≡ ABSENT — whole-match signature **and** every row field; ⭐⭐ the doors row: `ctbSupportPlaneFalseInEveryArm` true · `perceptArmedInEveryArm` true · `dialNeverArmed` true · `spFlagMatchesDoor` true · `dlcFlagMatchesDoor` true · **`neverBothDeliveryDoors` true** · `doorMatchesGenePresence` true · **`exactlyOneArmedInertArm` true** |
| **⭐ G-ARM** | ✅ PASS | delivery on the axes each arm doses and silence on the ones it does not. `ledPassesHandled === ledPassesNonZero` in **every** arm; zero metres in the inert arm; ⭐ the PLANE arms' law is MEMBERSHIP — `planeChecked` 0 / 0 / 15 / 20 / 0 with `planeUnmatched` 0 / 0 / 0 / 0 / 0 (IEEE-exact against the shipped `groundStrikeGrid`); the CONTEST anchor's is the ALGEBRA (0 sign / 0 magnitude violations); the four support-tick classes `partitionExact` in 5/5 |
| **G-CLEAN-INVOCATION** | ✅ PASS | no override in force |

### ⭐⭐ THE JOINT PRE-REGISTERED PRIMARY — mechanical flags only, NOTHING is fired (#203)

The prediction, restated VERBATIM as the artifact records it:

> ⭐ THE JOINT FORM, contract §1 H-DLC read at THIS slice's treatment cell: at the PLANE arm the TRUE-holdable gain is retained (resolved helpful) AND goals stay inside the frozen band — BOTH, JOINTLY. ⭐⭐ PLUS THE #240 OVERSHOOT PREDICTION AS THE CONTRAST CLAUSE: against the CHOICE ANCHOR (the banked two-point contest), interceptions FALL or goals RECOVER toward the band — the finer grid should pick GENTLER strikes. Both are frozen in this probe's own predicates before any receipt ran.

Operational rule, as frozen in the probe: ⭐ JOINT: at the PLANE arm, `trueHoldableShare` RESOLVED HELPFUL (paired-delta CI excludes zero in the UP direction) AND the `goals` equilibrium-band dimension INSIDE the frozen band (2.3944 ± 15 %), BOTH TOGETHER. Neither limb alone is the prediction: the retired dial already had the gain and died on the band, the banked two-point contest kept the gain unresolved-vs-control and stayed 0.18 below the band, and the band alone is what ABSENT has for free.

| arm | supply Δ (pp) | 95 % CI (pp) | `resolvedHelpful` | goals/match | frozen band | `inBand` | **JOINT** | which limb fails |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PLANE-INERT | 0.0000 | [0.0000, 0.0000] | false | 2.1457 | [2.0352, 2.7536] | true | **false** | the SUPPLY GAIN (the F-T1s-b shape: the gain killed) |
| ⭐ **PLANE** | +0.1365 | [0.0252, 0.2456] | true | 1.7063 | [2.0352, 2.7536] | false | **false** | the GOALS BAND (the F-T1s-a shape: the poison retained) |
| PLANE-X-CAS | +0.1626 | [0.0478, 0.2741] | true | 1.6614 | [2.0352, 2.7536] | false | **false** | the GOALS BAND (the F-T1s-a shape: the poison retained) |
| ⭐ CHOICE-ANCHOR | +0.0845 | [-0.0184, 0.1860] | false | 1.9417 | [2.0352, 2.7536] | false | **false** | BOTH |

⭐⭐ **THE CELL THE STAGE EXISTS FOR, READ MECHANICALLY.** At **plane**, LIMB A (`trueHoldableShare`) is **+0.1365 pp [0.0252, 0.2456]**, `resolved: true` / `resolvedHelpful: true`; LIMB B (goals) is **1.7063/match** against the frozen band [2.0352, 2.7536], `inBand: false`. `jointSatisfied: false`, `whichLimbFails`: *the GOALS BAND (the F-T1s-a shape: the poison retained)*.

⚠ **AND THE FOUR MECHANICAL NEIGHBOURS THAT MUST BE READ BESIDE IT** — rows, not readings:

1. **THE CONTRAST ANCHOR, RE-WALKED ON THIS STAGE'S OWN SEEDS, IS UNRESOLVED ON SUPPLY.** CHOICE-ANCHOR's supply delta is **+0.0845 pp [-0.0184, 0.1860]**, `resolved: false` (`pointDirectionHelpful: true`), goals **1.9417** (`inBand: false`), `jointSatisfied: false`, `whichLimbFails`: *BOTH*. Same world, same instrument, different seeds (G-ANCHOR, 8 rows × 27 fields, 0 mismatches, `armConfigurationIdentical: true`).
2. **THE CONTROL IS INSIDE THE BAND.** ABSENT scores **2.1457** goals/match against a floor of **2.0352**: `controlAlsoInBand: true`, headroom **0.1105 goals/match**. So `excludedBecauseControlFails` is **[]** and the gated dimensions are ["goals","crosses","headers","longBalls","cutbacks"] — the #198-form exclusion does **not** fire here, and the band GATES at this N (`the band GATES at battery N only (inherited verbatim); at smoke grain this row is a plumbing reading`).
3. **THE PAIRED GOALS DELTA IS RESOLVED DOWN AT EVERY DOSED ARM, THE ANCHOR INCLUDED.** PLANE **-0.4395 [-0.6345, -0.2511]** (`resolved: true`) · PLANE-X-CAS **-0.4843 [-0.6704, -0.3004]** (`resolved: true`) · CHOICE-ANCHOR **-0.2040 [-0.3991, -0.0224]** (`resolved: true`). The BAND limb and the PAIRED limb are two different instruments on one column, and the artifact publishes both.
4. **THE OTHER PLANE ARM AGREES WITH PLANE ON BOTH LIMBS.** PLANE-X-CAS supply **+0.1626 pp [0.0478, 0.2741]** (`resolvedHelpful: true`), goals **1.6614** (`inBand: false`), `jointSatisfied: false`. And the ARMING IDENTITY, PLANE-INERT, is the row that shows what the band alone is worth: goals **2.1457** (`inBand: true`) with supply delta EXACTLY 0.0000 pp — `jointSatisfied: false` all the same.

⚠ **Adjudication is the commander's (#203).** Nothing above is a branch: F-T1s-a/b/c are named in this stage's §SUCCESS and fired nowhere in this probe or this generator.

### ⭐⭐ THE #240 OVERSHOOT CONTRAST — PLANE vs the CHOICE ANCHOR (mechanical flags only)

The clause, restated VERBATIM as the artifact records it:

> ruling #240.2, VERBATIM: "the residual poison … may be OVERSHOOT: a led ball that wins the two-way contest is forced to the FULL projection magnitude; intermediate aims may retain the gain at lower cost. Frozen as the T1c pre-registered prediction (supply retained + interceptions fall + goals recover toward the band, vs the two-point contest as CONTRAST ANCHOR)." Carried into slice one-s by #241 (the 1D segment is SUBSUMED by the strike plane) and named as this exam's contrast clause by #242.3.

Estimator: the ANCHOR-REFERENCED paired bootstrap (`contrasts.ratesVsAnchor`): the same resampled seed-index sets, differenced PLANE − ANCHOR. Never two control-referenced CIs subtracted.

| limb | quantity | reading | flag | strict form |
| --- | --- | --- | --- | --- |
| **I — interceptions FALL** | `interceptionsPerMatch`, PLANE − ANCHOR | +1.5897 [0.8004, 2.4731] | `fall` **false** | `resolvedFall` false |
| **G — goals RECOVER** | band distance (0 inside; else distance to the nearer edge) | plane 0.3289 vs anchor 0.0935 | `recover` **false** | `intoBand` false |
| (retention, published beside them) | `trueHoldableShare`, PLANE − ANCHOR | +0.0520 pp [-0.0546, 0.1604] | `resolvedVsAnchor` false | — |

⇒ **SATISFIED = false** (LIMB I **OR** LIMB G, the ruling's own disjunction); strict form **false**.

⭐ **THE THREE LIMBS AT BATTERY N, STATED AS THE ARTIFACT HAS THEM.** LIMB I: the anchor-referenced paired CI on `interceptionsPerMatch` is **+1.5897 [0.8004, 2.4731]**, `resolved: true` — the interval lies entirely ABOVE zero, i.e. a RESOLVED RISE against the anchor, so `fall` is **false** and `resolvedFall` **false**. LIMB G: the band distance is **0.3289** at PLANE against **0.0935** at the ANCHOR — it INCREASED, so `recover` is **false** and `intoBand` **false** (`0 inside the frozen band; otherwise the distance to the NEARER edge`). RETENTION: **+0.0520 pp [-0.0546, 0.1604]**, `resolvedVsAnchor: false` — the plane-versus-anchor supply difference is UNRESOLVED. ⚠ *Note the reference frames: the retention row is PLANE − ANCHOR, while LIMB A of the JOINT primary is PLANE − CONTROL, and the artifact publishes both rather than one standing for the other (RETENTION is the JOINT primary's limb A against the CONTROL; this row is the plane-versus-anchor difference, published so "retained at lower cost" can be read as one sentence rather than assembled after sight.)*.

⚠ These are the probe's MECHANICAL predicate flags on published CIs and on the frozen band, exactly like `resolved` (#203). **The probe adjudicates nothing**; what the disjunction's `false` means for the arc is the commander's.

### ⭐⭐ THE CHOSEN STRIKE — the emergent KICK over the NINE grid members (REPORTED)

*(observational, seed 12428020; index = (dirStep+1)·3 + (powerStep+1), so member **4 is TODAY'S KICK**. ⚠ An arm without the plane door has no grid: its member row is all zeros BY CONSTRUCTION.)*

⚠⚠ **THE GRAIN OF THIS TABLE IS THE DECLARED OBSERVATIONAL BLOCK, NOT THE BATTERY.** The strike read is the §SEEDS block reserved for it — **one seed × five arms × two matches** (a traced match and its untraced LOCKSTEP TWIN) — because the member tally needs the chooser's sidecar trace and percept pulls that the exam walks may never take. It therefore does **not** scale with N and is IDENTICAL to the smoke round's table, by construction rather than by coincidence. ⭐ What DOES move with N is the **strike-time delivered rate** and the **led share** below, both computed across all 446 battery seeds.

⚠⚠ **MEMBER 4 IS `n/a`, NOT A MEASURED 0 (#242.3).** This table is tallied from the **5th argument of `performPass`**, and a ZERO-DISPLACEMENT kick carries no 5th argument (the banked strike guard's own `bestLeadX !== 0 || bestLeadY !== 0`). So TODAY'S KICK HAS NO OBSERVATION CHANNEL HERE, and the inherited bucket definition *"legacy man kept AND member 4 won"* is corrected with it — keeping the legacy man is observable, member 4 winning is not. ⭐ **Zero-point wins are countable only at DECISION time.** The nearest banked evidence is DLC-T0s's **G-WINNER** (`data/dlc-t0s-strike-plane.json` → `gates.gWinner`): of the materially-spread decisions, **6 of 96 won by TODAY'S KICK** in the percept world and **5 of 75** in the bare world — T0s's world, cited as the honest source for the QUANTITY.

| arm | door | kicks | sampled-struck | 0 `d−1p−1` | 1 `d−1p0` | 2 `d−1p+1` | 3 `d0p−1` | **4 `d0p0` (today)** | 5 `d0p+1` | 6 `d+1p−1` | 7 `d+1p0` | 8 `d+1p+1` | unmatched |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | none | 52 | 0 | 0 | 0 | 0 | 0 | **n/a** | 0 | 0 | 0 | 0 | 0 |
| PLANE-INERT | sp | 52 | 0 | 0 | 0 | 0 | 0 | **n/a** | 0 | 0 | 0 | 0 | 0 |
| ⭐ **PLANE** | sp | 60 | 6 | 0 | 0 | 2 | 0 | **n/a** | 2 | 1 | 0 | 1 | 0 |
| PLANE-X-CAS | sp | 93 | 20 | 0 | 1 | 9 | 1 | **n/a** | 2 | 0 | 1 | 6 | 0 |
| ⭐ CHOICE-ANCHOR | dlc | 63 | 13 | 0 | 0 | 0 | 0 | **n/a** | 0 | 0 | 0 | 0 | 0 |

By DIRECTION and by POWER, and the size of the displacement that rode the ball:

| arm | by direction | by power | mean displacement | max | share of pass distance |
| --- | --- | --- | --- | --- | --- |
| ABSENT | `{"dir-1":0,"dir0":0,"dir1":0}` | `{"pow-1":0,"pow0":0,"pow1":0}` | 0.0000 m | 0.0000 m | 0.00000 |
| PLANE-INERT | `{"dir-1":0,"dir0":0,"dir1":0}` | `{"pow-1":0,"pow0":0,"pow1":0}` | 0.0000 m | 0.0000 m | 0.00000 |
| ⭐ **PLANE** | `{"dir-1":2,"dir0":2,"dir1":2}` | `{"pow-1":1,"pow0":0,"pow1":5}` | 10.4750 m | 16.9473 m | 0.64209 |
| PLANE-X-CAS | `{"dir-1":10,"dir0":3,"dir1":7}` | `{"pow-1":1,"pow0":2,"pow1":17}` | 8.3376 m | 20.4247 m | 0.61505 |
| ⭐ CHOICE-ANCHOR | `{"dir-1":0,"dir0":0,"dir1":0}` | `{"pow-1":0,"pow0":0,"pow1":0}` | 6.2664 m | 13.4019 m | 0.48966 |

⭐ **AND THE SECOND, INDEPENDENT MEMBER TALLY — G-ARM's OWN LAW CHECK ON THE BATTERY WALKS.** The membership half of G-ARM re-derives every sampled struck displacement through the shipped `groundStrikeGrid` and records which member it matched, on the battery run itself:

| arm | `planeChecked` | `planeUnmatched` | member wins 0..8 (member 4 unobservable at strike time) |
| --- | --- | --- | --- |
| ABSENT | 0 | 0 | `[0,0,0,0,0,0,0,0,0]` |
| PLANE-INERT | 0 | 0 | `[0,0,0,0,0,0,0,0,0]` |
| ⭐ **PLANE** | 15 | 0 | `[0,0,2,0,0,4,2,0,7]` |
| PLANE-X-CAS | 20 | 0 | `[1,0,9,0,0,5,1,0,4]` |
| ⭐ CHOICE-ANCHOR | 0 | 0 | `[0,0,0,0,0,0,0,0,0]` |

### ⭐⭐ THE DELIVERED RATE PER ARM — the treatment AS REALLY DELIVERED (#242.2/#242.3)

**(a) THE CORRECTED READING — delivered rate CONDITIONED ON LIVE-GRID DECISIONS.** A zero-displacement kick only counts as *the plane declining* if the plane had another kick to decline. Liveness is MEASURED per decision, on the LEGACY man's own grid: **LIVE** = at least one of the nine members is a different kick; **DEGENERATE** = all nine exactly (0,0) — no remembered motion ⇒ reach 0 ⇒ the whole plane collapses onto today's kick BY ARITHMETIC, so the treatment was IMPOSSIBLE at that decision; **no seat** = the gene is absent, so no grid forms at all.

| arm | a PLANE reading? | kicks | sampled-struck | zero-point: LIVE / **DEGENERATE** / no seat | substituted: LIVE / **DEGENERATE** / no seat | no chooser row | live-grid n | ⭐⭐ **delivered rate (LIVE-GRID, observational)** | ⭐ delivered rate (strike-time, **BATTERY GRAIN**) | lockstep |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | no — no grid here | 52 | 0 | 0 / **0** / 0 | 0 / **0** / 0 | 14 | 0 | n/a — no plane here | **0.00000** | true |
| PLANE-INERT | no — no grid here | 52 | 0 | 0 / **0** / 20 | 0 / **0** / 18 | 14 | 0 | n/a — no plane here | **0.00000** | true |
| ⭐ **PLANE** | **yes** | 60 | 6 | 0 / **12** / 0 | 19 / **11** / 0 | 12 | 25 | **0.2400** | **0.23177** | true |
| PLANE-X-CAS | **yes** | 93 | 20 | 2 / **13** / 0 | 36 / **11** / 0 | 11 | 58 | **0.3793** | **0.23399** | true |
| ⭐ CHOICE-ANCHOR | no — no grid here | 63 | 13 | 0 / **0** / 0 | 0 / **0** / 0 | 8 | 0 | n/a — no plane here | **0.14079** | true |

⭐ **THE ONE COLUMN THAT IS AT BATTERY GRAIN IS THE STRIKE-TIME ONE**, and it is the rate every ruler above is computed under: `ledPassesNonZero / passesChosen` across all 446 exam seeds with ZERO percept pulls. At PLANE it reads **0.23177** (14,879 of 64,196 chosen passes), at PLANE-X-CAS **0.23399**, and at the CHOICE ANCHOR — where it is the two-point contest's own delivered rate on the same ruler — **0.14079**. ⚠ So the PLANE arms are read at roughly ONE KICK IN FOUR carrying the chooser's own displacement: a null on any ruler is a reading of a treatment delivered at that rate, never of one delivered at 1.

⭐ **WHY THE LIVE-GRID COLUMN IS `n/a` ON THREE ARMS AND THAT IS THE POINT.** An arm with no plane has no treatment to deliver, so it gets no delivered rate. PLANE-INERT reads `n/a` for the sharpest possible reason: the gene is ABSENT, so **no seat and therefore no grid ever forms**, and every one of its decisions lands in *no seat*.

**(b) THE RETRACTED READING**, kept for audit — `(sampled-struck + genuine zero-point) / kicks`, with the bracket it can honestly support:

| arm | kicks | sampled-struck | genuine zero-point | ⚠ target-SUBSTITUTED | no chooser row | substitution rate | ⚠ **delivered rate (decoded — RETRACTED)** | ⭐ honest bracket for that formula |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 52 | 0 | 20 | 18 | 14 | (0.3462) | (~~0.3846~~) | ([0.0000, 0.3846]) |
| PLANE-INERT | 52 | 0 | 20 | 18 | 14 | (0.3462) | (~~0.3846~~) | ([0.0000, 0.3846]) |
| ⭐ **PLANE** | 60 | 6 | 12 | 30 | 12 | 0.5000 | ~~0.3000~~ | [0.1000, 0.3000] |
| PLANE-X-CAS | 93 | 20 | 15 | 47 | 11 | 0.5054 | ~~0.3763~~ | [0.2150, 0.3763] |
| ⭐ CHOICE-ANCHOR | 63 | 13 | 13 | 29 | 8 | (0.4603) | (~~0.4127~~) | ([0.2064, 0.4127]) |

⚠⚠ **THE RETRACTION RIDES UNCHANGED FROM THE SMOKE ROUND (#242.3).** `deliveredRateDecoded`'s bucket is decided SOLELY by `chosenGid === legacyGid` and carries no grid information, so it scored two OPPOSITE facts identically: *the plane offered another kick and the decision declined it* and *the plane had nothing to offer*. The symptom that proves it matters is that the old statistic was NOT MONOTONE IN TREATMENT — PLANE-INERT scored **0.3846**, HIGHER than PLANE's **0.3000**. Parenthesised cells are NOT a plane reading (`deliveredRateIsATreatmentReading: false`).

### ⭐⭐ THE EMERGENT LED SHARE — battery grain (REPORTED — no gate reads it)

| arm | door | gene | passes chosen | displacement wins | **share** | mean | max | disp / pass dist | interceptions per such pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | none | absent | 49,525 | 0 | **0.00 %** | 0.0000 m | 0.0000 m | 0.00000 | n/a (none) |
| PLANE-INERT | sp | absent | 49,525 | 0 | **0.00 %** | 0.0000 m | 0.0000 m | 0.00000 | n/a (none) |
| ⭐ **PLANE** | sp | 1 | 64,196 | 14,879 | **23.18 %** | 7.6186 m | 27.1471 m | 0.56428 | 1.00813 |
| PLANE-X-CAS | sp | 1 | 64,525 | 15,098 | **23.40 %** | 7.7678 m | 28.5669 m | 0.56868 | 1.00033 |
| ⭐ CHOICE-ANCHOR | dlc | 1 | 58,898 | 8,292 | **14.08 %** | 5.5598 m | 19.0200 m | 0.42851 | 1.72347 |

⭐ **THE SUPPORT-SCOPED SHARE** — the same wins over the denominator the seam can actually reach (`passesToSupportTarget`; a displaced strike exists only on a support-mode mate), a ratio of two counters the artifact publishes:

| arm | displacement wins | passes to a SUPPORT target | **support-scoped share** | all chosen passes | headline share |
| --- | --- | --- | --- | --- | --- |
| ABSENT | 0 | 25,897 | **0.00 %** | 49,525 | 0.00 % |
| PLANE-INERT | 0 | 25,897 | **0.00 %** | 49,525 | 0.00 % |
| ⭐ **PLANE** | 14,879 | 35,015 | **42.49 %** | 64,196 | 23.18 % |
| PLANE-X-CAS | 15,098 | 35,746 | **42.24 %** | 64,525 | 23.40 % |
| ⭐ CHOICE-ANCHOR | 8,292 | 31,481 | **26.34 %** | 58,898 | 14.08 % |

And the share as the ESTIMATOR pairs it (`ledPassShare`, the only one of these three that carries a CI):

**REPORTED — displaced-strike share, paired** (ABSENT **0.0000 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 0.0000 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 0.0000 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 23.1775 % | 23.1775 | [22.7026, 23.6450] | true |
| PLANE-X-CAS | sp | 23.3987 % | 23.3987 | [22.9328, 23.8156] | true |
| ⭐ CHOICE-ANCHOR | dlc | 14.0786 % | 14.0786 | [13.6946, 14.4909] | true |

### ⭐ The SITUATIONAL PROFILE of the emergent share (REPORTED — no gate reads it)

| arm | share at PRESSED | share at UNPRESSED | pressed passes | unpressed passes | partition exact |
| --- | --- | --- | --- | --- | --- |
| ABSENT | 0.00 % (0/36,268) | 0.00 % (0/13,257) | 36,268 | 13,257 | true |
| PLANE-INERT | 0.00 % (0/36,268) | 0.00 % (0/13,257) | 36,268 | 13,257 | true |
| ⭐ **PLANE** | 22.00 % (9,823/44,652) | 25.87 % (5,056/19,544) | 44,652 | 19,544 | true |
| PLANE-X-CAS | 22.33 % (9,997/44,774) | 25.83 % (5,101/19,751) | 44,774 | 19,751 | true |
| ⭐ CHOICE-ANCHOR | 13.88 % (5,843/42,082) | 14.56 % (2,449/16,816) | 42,082 | 16,816 | true |

⚠ The bin is the #173 census's own pressure test (nearest opponent within 4.2 m of the CARRIER at the instant of the strike). It is a **DESCRIPTION** of when the chooser picked which ball, **not** a claim that pressure caused the choice and not a controlled contrast; the estimator pairs no cell in this table.

### TIER-1 SUPPLY RULERS AND THE TIER-2 SHARES — rows, never verdicts (#203)

**Ruler 1 — TRUE-holdable supply (LIMB A of the primary)** (ABSENT **0.5304 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 0.5304 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 0.5304 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 0.6669 % | 0.1365 | [0.0252, 0.2456] | true |
| PLANE-X-CAS | sp | 0.6930 % | 0.1626 | [0.0478, 0.2741] | true |
| ⭐ CHOICE-ANCHOR | dlc | 0.6149 % | 0.0845 | [-0.0184, 0.1860] | false |

**Ruler 2 — pressed first reception** (ABSENT **82.8087 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 82.8087 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 82.8087 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 83.7265 % | 0.9177 | [0.0813, 1.7683] | true |
| PLANE-X-CAS | sp | 83.0022 % | 0.1934 | [-0.5584, 0.9601] | false |
| ⭐ CHOICE-ANCHOR | dlc | 83.3857 % | 0.5770 | [-0.1464, 1.3301] | false |

**Ruler 3 — short-option supply (possession ticks)** (ABSENT **93.9413 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 93.9413 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 93.9413 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 92.6312 % | -1.3101 | [-1.6760, -0.9243] | true |
| PLANE-X-CAS | sp | 92.3385 % | -1.6028 | [-1.9701, -1.2249] | true |
| ⭐ CHOICE-ANCHOR | dlc | 92.8690 % | -1.0723 | [-1.4536, -0.6941] | true |

**Ruler 3 — short-option supply (first receptions)** (ABSENT **97.4171 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 97.4171 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 97.4171 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 97.9510 % | 0.5338 | [0.2090, 0.8724] | true |
| PLANE-X-CAS | sp | 97.8733 % | 0.4562 | [0.1453, 0.7805] | true |
| ⭐ CHOICE-ANCHOR | dlc | 97.7268 % | 0.3097 | [-0.0289, 0.6848] | false |

**Ruler 4 — support existence at PRESSED (possession ticks)** (ABSENT **96.3800 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 96.3800 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 96.3800 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 96.3499 % | -0.0300 | [-0.3817, 0.3748] | false |
| PLANE-X-CAS | sp | 96.2015 % | -0.1784 | [-0.5603, 0.2133] | false |
| ⭐ CHOICE-ANCHOR | dlc | 95.9881 % | -0.3918 | [-0.7879, 0.0169] | false |

**Ruler 4 — support existence at PRESSED (first receptions)** (ABSENT **97.4008 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 97.4008 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 97.4008 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 98.0459 % | 0.6451 | [0.2905, 1.0124] | true |
| PLANE-X-CAS | sp | 97.9490 % | 0.5482 | [0.1959, 0.8907] | true |
| ⭐ CHOICE-ANCHOR | dlc | 97.7764 % | 0.3756 | [0.0074, 0.7689] | true |

### ⭐ THE #218 GENEALOGY SHARES, WITH CIs (REPORTED — no gate reads them)

**Tier 2 — constructed ≥3 (non-set-piece pool)** (ABSENT **20.6553 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 20.6553 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 20.6553 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 20.7641 % | 0.1088 | [-3.9144, 4.3612] | false |
| PLANE-X-CAS | sp | 21.8371 % | 1.1818 | [-3.1166, 5.5622] | false |
| ⭐ CHOICE-ANCHOR | dlc | 20.8841 % | 0.2289 | [-3.7002, 4.4171] | false |

**Tier 2 — constructed ≥4 (non-set-piece pool)** (ABSENT **12.2507 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 12.2507 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 12.2507 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 10.9635 % | -1.2873 | [-4.6954, 1.9875] | false |
| PLANE-X-CAS | sp | 12.3050 % | 0.0543 | [-3.5715, 3.5391] | false |
| ⭐ CHOICE-ANCHOR | dlc | 13.2622 % | 1.0115 | [-2.1736, 4.1933] | false |

**Tier 2 — constructed ≥5 (non-set-piece pool)** (ABSENT **6.6952 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 6.6952 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 6.6952 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 6.3123 % | -0.3829 | [-2.8775, 2.1158] | false |
| PLANE-X-CAS | sp | 7.4523 % | 0.7572 | [-1.8403, 3.4697] | false |
| ⭐ CHOICE-ANCHOR | dlc | 7.9268 % | 1.2317 | [-1.3853, 3.7839] | false |

**Tier 2 — scramble share of goals** (ABSENT **55.6949 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 55.6949 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 55.6949 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 60.7096 % | 5.0147 | [0.6644, 9.1998] | true |
| PLANE-X-CAS | sp | 57.4899 % | 1.7950 | [-2.8552, 6.4500] | false |
| ⭐ CHOICE-ANCHOR | dlc | 59.1224 % | 3.4275 | [-1.0400, 7.6051] | false |

**Tier 2 — set-piece share of goals** (ABSENT **26.6458 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 26.6458 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 26.6458 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 20.8936 % | -5.7522 | [-9.4028, -1.8239] | true |
| PLANE-X-CAS | sp | 22.1323 % | -4.5135 | [-8.5451, -0.8664] | true |
| ⭐ CHOICE-ANCHOR | dlc | 24.2494 % | -2.3963 | [-6.1504, 1.4180] | false |

At 446 seeds each arm scores 957 / 957 / 761 / 741 / 866 goals in total (in arm order) — so unlike the smoke, a single goal is no longer worth several pp on these shares, and the CIs above are the ones the estimator actually produced. **They are still REPORTED rows: no gate and no success condition reads any of them.**

Goal ORIGIN family counts (the classifier's own classes, per arm):

| arm | goals | set piece | restart | open play | scramble / loose ball | turnover (own / mid / final third) |
| --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 957 | 255 | 125 | 577 | 533 | 16 / 14 / 14 |
| PLANE-INERT | 957 | 255 | 125 | 577 | 533 | 16 / 14 / 14 |
| ⭐ **PLANE** | 761 | 159 | 88 | 514 | 462 | 19 / 13 / 20 |
| PLANE-X-CAS | 741 | 164 | 107 | 470 | 426 | 12 / 13 / 19 |
| ⭐ CHOICE-ANCHOR | 866 | 210 | 102 | 554 | 512 | 12 / 13 / 17 |

### THE GUARDS — every tolerance frozen ex ante

| limb | control | tolerance | resolved arms | **breaches** |
| --- | --- | --- | --- | --- |
| interceptionsPerMatch (ceiling) | 27.7175 | ±7.6588 | PLANE +5.9148, PLANE-X-CAS +6.1457, CHOICE-ANCHOR +4.3251 | **none** |
| spreadYOut (floor) | 5.7347 | ±1.5846 | PLANE +0.2508, PLANE-X-CAS +0.2452, CHOICE-ANCHOR +0.1380 | **none** |
| spacingMedian (floor) | 13.0689 | ±3.6112 | PLANE +0.1361, PLANE-X-CAS +0.1650, CHOICE-ANCHOR +0.0898 | **none** |
| spacingUnder4 (ceiling) | 0.0926 | ±0.0256 | PLANE -0.0083, PLANE-X-CAS -0.0085, CHOICE-ANCHOR -0.0049 | **none** |

⭐ **THE NAMED RISK (F-T1s-c), STATED AGAINST ITS FROZEN TOLERANCE.** The interception rise is RESOLVED at every dosed arm and BEYOND TOLERANCE at **none**:

| arm | interceptions/match | Δ vs control | 95 % CI | `resolved` | tolerance | `beyondTolerance` | **`breach`** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 27.7175 | (CONTROL) | — | — | — | — | — |
| PLANE-INERT | 27.7175 | 0.0000 | [0.0000, 0.0000] | false | ±7.6588 | false | **false** |
| ⭐ **PLANE** | 33.6323 | +5.9148 | [5.1390, 6.6794] | true | ±7.6588 | false | **false** |
| PLANE-X-CAS | 33.8632 | +6.1457 | [5.3318, 6.9170] | true | ±7.6588 | false | **false** |
| ⭐ CHOICE-ANCHOR | 32.0426 | +4.3251 | [3.5807, 5.0269] | true | ±7.6588 | false | **false** |

⭐ And the SAME limb against the CONTRAST ANCHOR — the reference LIMB I of the overshoot clause is read in (`contrasts.ratesVsAnchor`, ARM − CHOICE-ANCHOR on the same resampled seed-index sets):

| arm | Δ vs ANCHOR | 95 % CI | `resolved` |
| --- | --- | --- | --- |
| ABSENT | -4.3251 | [-5.0381, -3.5807] | true |
| PLANE-INERT | -4.3251 | [-5.0381, -3.5807] | true |
| ⭐ **PLANE** | +1.5897 | [0.8004, 2.4731] | true |
| PLANE-X-CAS | +1.8206 | [1.0067, 2.6368] | true |
| ⭐ CHOICE-ANCHOR | (ANCHOR) | — | — |

**Offsides per match (the #157 FLAG form — flips no gate)** (ABSENT **2.3767**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 2.3767 | — | (CONTROL) | — |
| PLANE-INERT | sp | 2.3767 | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 2.4507 | +0.0740 | [-0.1099, 0.2713] | false |
| PLANE-X-CAS | sp | 2.3251 | -0.0516 | [-0.2444, 0.1435] | false |
| ⭐ CHOICE-ANCHOR | dlc | 2.3946 | +0.0179 | [-0.1973, 0.2175] | false |

Offsides: resolved INCREASES — **none**.

**Fouls per match (context row — no tolerance is frozen on it)** (ABSENT **4.2534**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 4.2534 | — | (CONTROL) | — |
| PLANE-INERT | sp | 4.2534 | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 3.3789 | -0.8744 | [-1.1099, -0.6480] | true |
| PLANE-X-CAS | sp | 3.4484 | -0.8049 | [-1.0493, -0.5650] | true |
| ⭐ CHOICE-ANCHOR | dlc | 3.8700 | -0.3834 | [-0.6166, -0.1525] | true |

**Spacing median (guard limb — floor)** (ABSENT **13.0689**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 13.0689 | — | (CONTROL) | — |
| PLANE-INERT | sp | 13.0689 | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 13.2050 | +0.1361 | [0.0508, 0.2202] | true |
| PLANE-X-CAS | sp | 13.2339 | +0.1650 | [0.0821, 0.2423] | true |
| ⭐ CHOICE-ANCHOR | dlc | 13.1587 | +0.0898 | [0.0112, 0.1643] | true |

**Spacing under 4 m (guard limb — ceiling)** (ABSENT **9.2631 %**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 9.2631 % | — | (CONTROL) | — |
| PLANE-INERT | sp | 9.2631 % | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 8.4282 % | -0.8348 | [-0.9928, -0.6730] | true |
| PLANE-X-CAS | sp | 8.4107 % | -0.8524 | [-1.0084, -0.6818] | true |
| ⭐ CHOICE-ANCHOR | dlc | 8.7764 % | -0.4867 | [-0.6347, -0.3381] | true |

**Spread-Y out of possession (guard limb — floor)** (ABSENT **5.7347**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 5.7347 | — | (CONTROL) | — |
| PLANE-INERT | sp | 5.7347 | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 5.9855 | +0.2508 | [0.2108, 0.2866] | true |
| PLANE-X-CAS | sp | 5.9799 | +0.2452 | [0.2034, 0.2842] | true |
| ⭐ CHOICE-ANCHOR | dlc | 5.8726 | +0.1380 | [0.0987, 0.1727] | true |

**Spread-Y in possession (context row)** (ABSENT **6.4909**):

| arm | door | point | Δ | 95 % CI | `resolved` |
| --- | --- | --- | --- | --- | --- |
| ABSENT | none | 6.4909 | — | (CONTROL) | — |
| PLANE-INERT | sp | 6.4909 | 0.0000 | [0.0000, 0.0000] | false |
| ⭐ **PLANE** | sp | 6.8191 | +0.3282 | [0.2835, 0.3731] | true |
| PLANE-X-CAS | sp | 6.8198 | +0.3288 | [0.2796, 0.3730] | true |
| ⭐ CHOICE-ANCHOR | dlc | 6.6714 | +0.1805 | [0.1374, 0.2202] | true |

### ⭐ THE EQUILIBRIUM BAND — IT GATES AT THIS N, AND THE CONTROL PASSES

`excludedBecauseControlFails`: **[]** · gated dimensions: ["goals","crosses","headers","longBalls","cutbacks"]. Baselines {"goals":2.3944,"crosses":2.4894,"headers":9.1039,"longBalls":6.2042,"cutbacks":3.8151} with tolerances {"goals":0.15,"crosses":0.25,"headers":0.25,"longBalls":0.25,"cutbacks":0.25}.

| arm | goals | crosses | headers | longBalls | cutbacks | all gated dims in band |
| --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 2.1457 | 2.3206 | 8.204 | 5.6525 | 3.2466 | true |
| PLANE-INERT | 2.1457 | 2.3206 | 8.204 | 5.6525 | 3.2466 | true |
| ⭐ **PLANE** | 1.7063 **OUT** | 1.787 **OUT** | 5.6233 **OUT** | 3.4507 **OUT** | 3.2466 | false |
| PLANE-X-CAS | 1.6614 **OUT** | 1.7354 **OUT** | 5.6839 **OUT** | 3.417 **OUT** | 3.2825 | false |
| ⭐ CHOICE-ANCHOR | 1.9417 **OUT** | 1.8991 | 6.4081 **OUT** | 4.3857 **OUT** | 3.5538 | false |

Out-of-band cells, exhaustively (11): **PLANE `goals` 1.7063 · PLANE `crosses` 1.787 · PLANE `headers` 5.6233 · PLANE `longBalls` 3.4507 · PLANE-X-CAS `goals` 1.6614 · PLANE-X-CAS `crosses` 1.7354 · PLANE-X-CAS `headers` 5.6839 · PLANE-X-CAS `longBalls` 3.417 · CHOICE-ANCHOR `goals` 1.9417 · CHOICE-ANCHOR `headers` 6.4081 · CHOICE-ANCHOR `longBalls` 4.3857**. ⭐ Only `goals` is a PRIMARY limb; the other band dimensions are guard limbs and are published here for the same reason — the band gates at this N and the control passes every one of them.

### ⭐⭐ THE PLANE-INERT IDENTITY AT BATTERY N

**446/446** seeds: PLANE-INERT is byte-identical to ABSENT on the whole-match **signature** (rng stream state inside) **and every measured row field**. That arm is the plane's door OPEN with the gene ABSENT: the arming rule is EVALUATED on every on-ball decision and returns `null`, so no grid forms, nothing is priced and the pass loop runs the shipped statements alone. Every PLANE-INERT delta in every table above is therefore **exactly 0 with a [0, 0] CI by construction**, and that is the receipt, not a coincidence — *the plane costs the world nothing until it is given a gene*, measured at battery grain rather than cited from T0s. (`exactlyOneArmedInertArm: true`, `doorMatchesGenePresence: true`.)

### POPULATIONS (per arm, battery grain)

| arm | matches to full time | ticks walked | played ticks | eligible moments (ruler 1) | TRUE-holdable | first receptions | pressed | possession ticks | goals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ABSENT | 446 | 6,716,458 | 5,800,546 | 27,338 | 145 | 17,887 | 14,812 | 1,443,435 | 957 |
| PLANE-INERT | 446 | 6,716,458 | 5,800,546 | 27,338 | 145 | 17,887 | 14,812 | 1,443,435 | 957 |
| ⭐ **PLANE** | 446 | 6,675,485 | 5,769,904 | 26,390 | 176 | 19,375 | 16,222 | 1,279,534 | 761 |
| PLANE-X-CAS | 446 | 6,675,154 | 5,772,096 | 26,406 | 183 | 19,326 | 16,041 | 1,265,996 | 741 |
| ⭐ CHOICE-ANCHOR | 446 | 6,701,071 | 5,803,001 | 26,834 | 165 | 19,092 | 15,920 | 1,351,003 | 866 |

⭐ LIMB A's counter, in full: at plane the TRUE-holdable numerator is **176 of 26,390 eligible moments** against ABSENT's **145 of 27,338**, and the CHOICE ANCHOR's **165 of 26,834** — the estimates the paired bootstrap above is built on, printed so each CI is read against its own population.

### THE N RULE AS EXECUTED (in-probe, from the committed artifacts)

DEFF **0.8302** (MAX(inherited 0.8302, same-world smoke 0.7454) — the MOST-PERTURBED arm (planeXCas — the relational pair with the chooser free) paired-delta CI on ruler 2, this stage, 12 clusters — NOISY by construction and therefore used only through a MAX with the inherited DEFF.) — inherited 0.8302, same-world smoke 0.7454. q1 ⇒ **N 446** (p0 0.004237, MDE 0.001575, 59 eligible moments/seed), q2 ⇒ N 49 (p0 0.850746, MDE 0.03073, 39.0833 first receptions/seed), binding **q1TrueHoldable**, nRaw 446, **N\* = 446**; ledger room 800 (binds=false), cap 628 (binds=false). Battery block **12428100..12428545** — inside the ledger and below the 12428900 ceiling.

⭐⭐ **N\* MOVED FROM THE SMOKE'S 628 TO 446, AND THE RULE IS WHY — NOT A RE-CUT.** The frozen §NRULE reads p0 and moments-per-seed from **this world** wherever this stage's own committed smoke exists. `sourceOfP0` is now **"THIS WORLD (this stage's OWN committed smoke, its ABSENT arm)"** (at smoke-sizing time it was the inherited out-of-world pair), quoted from the artifact verbatim. The artifact states the rule's own world clause: *"⚠ p0 AND moments-per-seed are WORLD-DEPENDENT and this world (percept-armed) is NOT CTB-T1's (bare production). Where this probe's own committed smoke exists they are read from ITS absent arm; where it does not, they are the inherited out-of-world numbers and that substitution is stated in `sourceOfP0` rather than hidden."* The MDEs are unchanged and still the traced committed ones (q1: the O2-T1 COMMITTED paired delta on trueContextShare — the ONE paired delta this instrument has resolved in a banked battery. INHERITED knowingly: no same-world MDE exists, and choosing one after sight is forbidden.; q2: the SMALLEST cross-arm difference the #173 census itself published on this column (prod vs v1/v2), read from the committed artifact), the DEFF is still a MAX over the inherited and same-world values (and the same-world one is the SMALLER here, so the inherited value carries), and the cap (628) did **not** bind. Sizing sources, by hash: O2-T1 `2100760d…` · tempo `797f6e5c…` · this stage's own smoke `e9888d5f…` (12 seeds).

### §CHECKS (the battery round, #226.1)

```text
$ npx tsc --noEmit
(clean)

$ DLCT1S_MODE=full DLCT1S_RESUME=1 npx tsx scripts/probes/dlc-t1s-strike-exam.ts
  ALL                PASS      (22 gates)
  exit 0 · resultSha256 82a7dd2a8f5d95616a79c3dc52b7e653cdaf04bcb1118a4a87395a965cd629d2
  wall 5868 s (CONTEXT ONLY) · artifact docs/world-model/data/dlc-t1s-strike-exam.json
  checkpoint armed, resume requested, restored 0 / 0 units — the run computed all
  446 × 2 passes fresh (RESILIENCE ONLY; /tmp scratch, read by no gate)

$ npx tsx scripts/analysis/dlc-t1s-battery-result.ts docs/world-model/data/dlc-t1s-strike-exam.json
  → the whole §RESULT (FULL BATTERY) section above, on stdout
```

⭐ Exactly two commands were re-run in **this** round: `npx tsc --noEmit` (clean) and the battery
generator. The probe line is the run that WROTE the committed artifact; it is transcribed, not
re-executed, and its `resultSha256` above is the one this section is generated from — the two are
the same string or this doc would not build. `npm test` and the override-route
(`DLCT1S_N=1 DLCT1S_SKIP_FP=1`) guard check are **not** re-run here and are named rather than
implied: this round adds **one generator, one artifact and one doc section**, touches **no**
`tests/**` file and **no** `src/**` byte (X-SRC-UNTOUCHED is a HARD gate and PASSES on the run that
wrote the artifact), so the suite's state is the one banked at `1f6b30e`, including the known
#196.2 wall-clock flake.

### Deviations recorded — the battery round

**None.** The smoke round's six deviations ride unchanged and are not restated. Four facts that are
*not* deviations are recorded here anyway, because each one is a place a reader could suspect one:

1. ⭐⭐ **N\* IS 446, NOT THE SMOKE'S 628 — THE FROZEN RULE PRODUCED BOTH.** §NRULE reads p0 and
   moments-per-seed from **this world** wherever this stage's own committed smoke exists, and says
   so in its own `worldNote`; at smoke-sizing time no same-world source existed and the inherited
   out-of-world pair was used, with the substitution disclosed in `sourceOfP0`. With the smoke
   committed, `sourceOfP0` became *"THIS WORLD (this stage's OWN committed smoke, its ABSENT
   arm)"* and the same arithmetic returned 446. **No predicate, MDE, DEFF rule or cap was touched**
   (the MDEs are still the traced committed ones; the DEFF is still `MAX(inherited, same-world)`,
   and the same-world value 0.7454 is the SMALLER one so the inherited 0.8302 carries; the 628 cap
   did **not** bind), and the executed block **12,428,100–12,428,545** lies inside the block §SEEDS
   reserved before any receipt ran.
2. **THE BAND LIMB CHANGED STATE BECAUSE THE GRAIN DID, EXACTLY AS FROZEN.** At smoke grain the
   ABSENT arm read 2.0833 goals/match and every `inBand` cell was published as a plumbing reading.
   At battery N the control is **inside** every gated dimension (`excludedBecauseControlFails` is
   empty, headroom on `goals` **0.1105/match**) and the band GATES — which is what "gates at
   battery N only" meant when it was frozen. With it, LIMB B of the JOINT primary and LIMB G of the
   #240 overshoot clause are readable for the first time in this stage.
3. ⚠ **THE STRIKE-READ TABLE DID NOT MOVE, AND THAT IS ITS DESIGN, NOT A COPY-PASTE.** The chosen
   strike distribution is measured on the **declared one-seed observational block (12,428,020)**,
   reserved in §SEEDS before any receipt ran, because the member tally needs the chooser's sidecar
   trace and percept pulls the exam walks may never take. It does not scale with N, so its cells
   are byte-identical to the smoke round's — including `lockstepWithUntraced: true` on all five
   arms. The quantities that DO scale with N are printed beside it: the **strike-time delivered
   rate** (PLANE 0.23177 across all 446 seeds) and the whole led-share block, plus G-ARM's own
   independent battery-walk membership tally (`planeChecked` 15 / 20, `planeUnmatched` 0).
4. **THE WALL IS RECORDED AGAINST THE ONLY BUDGET THIS STAGE CARRIED.** §NRULE's `costNote`
   budgeted an armed percept-armed battery at ≈1.4× a CTB-T1-shaped one; the actual battery cost
   **5,868 s**, within 3 % of DLC-T1's own 5,743 s at the same N in the same world. Wall is CONTEXT
   ONLY (#128), enters no rate and no gate, and is reconciled here rather than left standing.

### Disposition — the battery round

The battery is run, twice-deterministic, and **gate-green on 22/22 at 446 seeds**, with G-ANCHOR
still reproducing DLC-T1's committed battery rows field for field (signature and delivered-strike
columns included, `armConfigurationIdentical: true`) and FLAG-HYGIENE carrying the PLANE-INERT ≡
ABSENT identity on **446/446** seeds. Both limbs of the JOINT pre-registered primary and all three
limbs of the #240 OVERSHOOT contrast clause are readable at this grain, and all of them are
published above exactly as the artifact records them, with the mechanical neighbours beside them —
the anchor's own row on the same fresh seeds, the control's headroom inside the band, the paired
goals delta at every arm, the full band table, and the delivered rate the treatment actually
reached the ball at.

**Nothing here is adjudicated.** `jointSatisfied`, `fall`, `recover` and `satisfied` are
predicates, not verdicts; `whichLimbFails` is the predicate's own label for which conjunct
evaluated false, not a fired branch. **F-T1s-a/b/c are the commander's, in ruling #244**, and so is
every question this run raises about what the resolved supply gain, the band state, the
anchor-referenced interception rise and the unresolved retention mean together.
