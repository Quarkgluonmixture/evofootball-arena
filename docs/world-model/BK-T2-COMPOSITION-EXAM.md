# BK-T2 — THE COMPOSITION EXAM (both BK laws armed atop the world-8 stack)

> **THE ONE SENTENCE**: with the facing law and the contact law armed together, does the world
> pay honest TIME for turning and stop letting the ball through bodies — and what does the rest
> of the game look like when it does?
>
> **Binding**: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) §1 — **H-BK.1** and
> **H-BK.2** are SCORED here; **H-BK.3** is REPORTED and never gated. Dispatched by
> **ruling #308 item 4**.
>
> **WHAT THIS STAGE IS**: an EXAM. **INSTRUMENT-ONLY — `src/**` is untouched.** The two seams
> are already banked and pinned ([#307](PROGRAMME-RULINGS.md) `bkFacingLaw`, #308
> `bkContactLaw`); this stage adds one probe and one artifact. Nothing ships from an exam.
>
> **Its predecessors, read as their truth of record (§COMMANDER CORRECTIONS included)**:
> [`BK-C0-BODYBALL-CENSUS.md`](BK-C0-BODYBALL-CENSUS.md) (the instruments and the disease map)
> · [`BK-T0-FACING-LAW.md`](BK-T0-FACING-LAW.md) (the cone, the law, the two red gates, the
> named exam observations) · [`BK-T1-CONTACT-LAW.md`](BK-T1-CONTACT-LAW.md) (the strike
> channel, the z-partition, the residual classes).

---

# §PRE-REGISTRATION (frozen in COMMIT 1, BEFORE any battery walk)

## §0 CANON QUOTED FOR THIS STAGE (copied from [`CANON.md`](CANON.md), never re-typed)

| sentence | home | how this stage meets it |
|---|---|---|
| freeze-before-battery (paraphrase) | **ruling #266.3(c)** | COMMIT 1 = the probe + this pre-registration incl. every face, CI rule and success criterion; the battery ran after it; `instrumentSha256` + `headCommit` record the frozen instrument |
| *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* | **PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1** | `BODY_SCHEMA` in the probe, published as `hashedBodySchema`; `hashedBodySha256` covers exactly those keys — wall-clock and git fields sit outside by construction |
| per-seed cells (paraphrase) | **ruling #282.2(ii)** | `perSeedCells[]` carries every counter and every histogram, per seed AND per arm |
| gFaces-from-disk (**ruling #287 item 1**) + *"the re-derivation gate covers EVERY published face; a percentile face requires stored bins"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4** | `gFaces` re-parses the SERIALIZED artifact off disk and re-derives EVERY face's numerator, denominator, point and Δ, plus eight stored-bin histograms; `faceCoverage` publishes checks-run / checks-passed / the failure list |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | every face carries `Ticks` / `Seconds` / `Share` / `PerMatch` / `Metres` in its name, and `unit` beside it; EPISODES and BODY-TICKS are separate faces with separate names |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every number in §RESULT names the artifact field it is read from; doc-side arithmetic says so and shows itself |
| *"a starred finding states its |Δ| ÷ half-width ratio"* | **BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2** | every face row publishes `absDeltaOverHalfWidth` by machine |
| *"a max−min face reports a noise-floor comparison, not a zero-null CI"* | **PC-T1-LEARNING-EXAM.md §COMMANDER CORRECTIONS item 3** | this stage publishes NO max−min face; the two maxima it does publish (`maxAppliedAddedTicks`, `ledMaxStrikeSpeed`) are bound receipts, never contrasts |
| moving denominators disclosed per face (paraphrase) | **PW-C0-WEIGHT-PHYSICS-CENSUS.md §COMMANDER CORRECTIONS item 2** | every face with a movable denominator carries a `denNote`; the denominator-stable per-match form is published beside every share |
| clock honesty (paraphrase) | **ruling #280.2(iii) + PC-T2 §CORR item 3** | every rate is per 240 s match (`MATCH_DURATION` published); the scored TIME face is **APPLIED**, never nominal |
| *"a src-extracted constant pins its extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"* | **BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1** | `C7_W_CAP` / `TURN_RATE` / `TOUCH_CONTROL_DIST` / the forward band are anchored at their declarations with line receipts; the `loftKick` tMax is extracted **inside the body of `performLoftedPass`** — the very trap #306 struck |
| *"a dose-source guard should hash the bytes it reads, not a self-declared field"* | **BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6** | `l3DoseFileBytesSha256`, `pcDoseFileBytesSha256` **and** `bkC0ArtifactBytesSha256` — all three files are read as TEXT and hashed before they are parsed |
| seed discipline, BOOKED = WALKED (paraphrase) | standing frontier practice | §SEED LEDGER below; `gSeedsBookedEqualWalked` checks it against the probe's own arithmetic |

## §1 THE TWO ARMS (frozen)

```
BASE   new Match({ seed, teamA, teamB, ...a4MatchFlags(8) })
       armA4World(m, null, 8, poolT1DoseCells(L3-T1), poolPcDoseTable(PC-T1))

ARMED  BASE + { bkFacingLaw: true, bkContactLaw: true }
```

The **world-8 composition** is the watched world of record — the world the user's three
sentences were spoken about, with both wind-up channels armed. The doses are read from the
COMMITTED artifacts at run time and **both files are hashed AS BYTES before they are parsed**.
The world identity is ASSERTED on the very match each walk measures (`worldConjuncts`):
`a4ArmedVersion(m) === 8` · `c7Windup && o1PassWindup` · the latency door live · both
recognition books bit-equal to the PC dose · both defence books bit-equal to the L3 dose ·
**and the two BK flags match the arm being walked**. A world receipt walks at `12,504,999`.

**PAIRED**: every seed is walked TWICE, once per arm, and ONE bootstrap resample-index matrix
draws both arms so the pairing sits inside every interval.

## §2 THE INSTRUMENTS — INHERITED, NOT INVENTED

* **(a) the release-facing census** — BK-C0 §2(a) VERBATIM in definition: the engine's own
  `kickMisalignment = (1 − cos θ)/2` between the striker's **PRE-STEP heading** and the ball's
  own horizontal velocity **de-rotated by the one tick of Magnus rotation `stepBall` applied**;
  the four quadrant tiers; the twelve classes read off the engine's own per-side stat
  signatures with the executor's action label as the `keeperThrow` tie-break; **20 stored bins**
  over [0, 1]. **OPEN PLAY ONLY**, declared. The probe's arithmetic is proven identical to
  `kickMisalignment` on the receipt match before anything is written.
* **(b) the through-body sweep** — BK-C0 §2(b) / BK-T1 §9(1) VERBATIM: free ball, phase
  `playing`, not `sentOff`, **not the ball's `lastTouch` nor this tick's contact**; the two
  radii (`PLAYER_CORE_RADIUS` visual / `CONTROL_RADIUS` reach); the seven-cause ladder in the
  census's own order; episodes as maximal per-body runs with a stored duration histogram.
* **(c) the GK-loop ledger** — BK-C0 §2(c), with the **CORRECTED window of record**: the
  bounce-back window is **240 ticks**, read off the COMMITTED BK-C0 artifact's own
  `definitions.bounceBackWindowTicks` (bytes hashed first) rather than re-derived, so the
  headline is commensurable with the census by construction. The NAMED `performLoftedPass`
  tMax is extracted and published beside it as the alternative window
  (`bounceBackWindowAlternativeTicks`). The turnover window stays the engine's own arrival law
  `L3_DEFENCE_WINDOW_S / DT`.
  ⭐ **THE ONE DECLARED IMPROVEMENT over BK-C0's instrument**: the GK record retires at
  **age > 420 ticks**, not at the window, so the stored 41 × 10-tick gap histogram is
  **UNCENSORED inside its own range** — BK-C0 §COMMANDER CORRECTIONS item 2's defect, fixed.
  The 240-tick headline is unaffected (it is a within-240 rate either way), and the
  any-gap rate is published beside it.
* **(d) the R-乙 chain faces** — [`R-YI-STANDING-GAP-TABLE.md`](R-YI-STANDING-GAP-TABLE.md)'s
  own definitions, **reused verbatim** (each is quoted in full in the artifact's `definitions`):
  **Q01** the #173 spell (same-owner-TEAM control while `playing`, SUSPENDED not ended while the
  ball is loose, duration includes in-spell loose time — the Opta "sequence" shape, openPlay
  origin only) · **Q05** ownership episodes inside each openPlay-origin spell · **Q06** the
  engine's OWN passive counters Σ`passesCompleted` / Σ`passes` · **Q14** among the FIRST
  reception of each openPlay-origin spell, the share whose nearest-opponent distance at the
  reception tick is ≤ the substrate's own `TOUCH_CONTROL_DIST` (restart/kickoff origins
  EXCLUDED). **The direction mix is Q07 VERBATIM**: the engine's own `team.stats.passesForward`.
* **(e) the corridor rung** — BU-C0's option ladder reused through the engine's own oracles
  (`passAffordance` → `arrivalMargin > 0` → `passCorridorInterception` over every live
  opponent), sampled at every open-play reception, split behind / lateral / ahead by the
  engine's own forward band. **AFFORDABLE AND THEREFORE WALKED** (the sizing smoke measured
  0.19 s per walk with it ON). ⚠ Its denominators MOVE (each rung is conditioned on the one
  above it) and it is **REPORTED — it gates nothing**.
* **(f) the arm ledger** — every wind-up arm is observed at the step boundary in BOTH slots
  (`pendingKick`, `pendingPassWindup`) with its `gid`, arm tick, `readyTick`, the striker's
  pre-step speed, his `firstTouchWindow`, and **the law's added ticks re-derived probe-side**
  from the shipped constants. An arm is **APPLIED** if it reached its `readyTick`.

## §3 THE SCORED FACES AND THEIR FROZEN CI RULES

**THE ESTIMATOR (frozen)**: paired cluster bootstrap over match seeds, **2,000 resamples**,
percentile 95 % intervals, ONE resample-index matrix for both arms. Δ = armed − base. A rule
that says *"CI strictly below 0"* means `deltaCi95[1] < 0`; *"strictly above 0"* means
`deltaCi95[0] > 0`.

### H-BK.1 — the contract's own words (VERBATIM)

> *"release-facing misalignment collapses toward the strike cone as a DISTRIBUTION ... at an
> honest TIME cost, never a ban; deliberate high-misalign strikes (the backheel class) survive
> as a priced choice with usage > 0."*

| limb | face | frozen rule |
|---|---|---|
| **(a) COLLAPSE** | `outsideConeShareAtRelease` — the share of facing-priced open-play releases leaving the boot with misalign **> the cone edge 0.3149439624** (= the census's own 68.28°, re-derived from `C7_W_CAP` and `TURN_RATE` at run time) | Δ's paired 95 % CI **strictly below 0** |
| **(b) TIME PAID** | `meanAppliedWindupTicks` — the mean length of a wind-up window that actually **reached its `readyTick`** (APPLIED, never nominal) | Δ's paired 95 % CI **strictly above 0** ∧ the armed arm's APPLIED added ticks total **> 0** |
| **(c) NEVER A BAN** | `beyondConeReleasesPerMatch` + its lawful-channel split | armed beyond-cone releases **> 0** ∧ `beyondConeViaOneTouchPassBypass` **> 0** ∧ `beyondConeViaOutOfScopeFamily` **> 0** |

**H-BK.1 PASS := (a) ∧ (b) ∧ (c).**

The **lawful channels** are BK-T0 §3/§4/§6's own map, not this stage's invention: the
**one-touch PASS bypass** (`PlayerBrain`'s gate routes a body inside its `firstTouchWindow`
past `armPendingPass` entirely) and the **out-of-scope families** (loft incl. the GK punt ·
cross · through ball · cutback · clearance · keeper throw · the three header classes ·
restarts). The channel split publishes two further cells honestly: `windupResidual` (the
release came from an observed arm and still left outside the cone — #307 §CORR item 1's
MOVING-BODY residual) and `unarmedInScope` (an in-scope class with no arm and no one-touch
window — the synchronous fallback path).

### H-BK.2 — the contract's own words (VERBATIM)

> *"through-body flight events and dead-band pass-throughs collapse to ~0 by construction"*

Scored **at exam grain** on the two classes the contract names, and on nothing else:

| limb | face | frozen rule |
|---|---|---|
| **(a) COOLDOWN-INVISIBILITY** | `cooldownInvisibleCoreBodyTicksPerMatch` — the cooldown-invisible cause cell at the **VISUAL core radius** (the picture the user complained about) | Δ's CI **strictly below 0** ∧ armed point **≤ 0.50 × base point** |
| **(b) DEAD-BAND PASS-THROUGH** | `deadBandCauseReachBodyTicksPerMatch` — the dead-band cause cell at the **LAWFUL REACH radius**, i.e. BK-T1's own pre-registered `gDeadBandFalls` cell, reused unchanged | Δ's CI **strictly below 0** ∧ armed point **≤ 0.50 × base point** |

**H-BK.2 PASS := (a) ∧ (b).**

⭐ **THE 0.50 BAR'S PROVENANCE, STATED BEFORE THE BATTERY**: BK-T1 §R2's receipts on ITS OWN
40-seed band measured the cooldown class at 3,715 → 874 core body-ticks (ratio **0.235**) and
the dead-band cause cell at 0.575 → 0.25 per match (ratio **0.435**). The bar is set at
**0.50 — looser than both** — so it tests the word *"collapse"* rather than replaying the
receipt, while a mere nudge fails it.

⭐ **WHAT IS NOT CLAIMED**: *"~0"* is **NOT** scored as an absolute zero. BK-T1 §3 NAMED four
residual classes OUT of the contact law's scope — `aboveGkClaim` (honest physics above 2.55 m)
· `aerialBand` (a different lawful channel already exists) · `rollOrClaimOrder` (the
quality-roll class) · `speedAboveControl` — and each one's share is published **beside** the
verdict, armed and base. The law BOUNDS the residual; the residual it leaves is the residual it
declared.

## §4 THE REPORTED FACES (H-BK.3 — never gated)

* **the GK-loop ledger** — releases/match · the channel mix (`gkShortPass` · `punt` ·
  `throwOut` · `gkClearance` · `gkOther`) · landing first touch (own/opp × ground/aerial) ·
  `bounceBackWithin240PerGkRelease` **and** the uncensored `bounceBackAnyGapPerGkRelease` ·
  `shortTurnoverWithinWindowShare` · both full gap histograms.
* **the R-乙 chain faces** — Q01 spell seconds · Q05 touches per spell · Q06 completion ·
  Q14 pressed share, definitions reused verbatim and cited to
  [`R-YI-STANDING-GAP-TABLE.md`](R-YI-STANDING-GAP-TABLE.md).
* **the direction mix** — Q07 verbatim (`passesForward` / `passes`).
* **goals per match and the §2 equilibrium faces** — goals · crosses · headers · longBalls ·
  cutbacks per match, both arms, with CIs. **REPORT ONLY: the C1 §4 band is NOT a gate here**,
  because nothing ships from an exam (contract §4: *"no equilibrium promise — the faces are
  reported honestly"*).
* **the corridor rung** — corridor survival of race-winning options, whole and split
  behind / lateral / ahead, with the rung above it published so the moving denominator is
  visible.

⭐ **THE CONTRACT'S PRE-REGISTERED DIRECTION** (§1 H-BK.3, VERBATIM): *"once landing/contact is
physically honest, the EXISTING pricing (which already prices interception risk) should see the
punt's true cost by itself — distribution mix may move with zero hand-nudging. If it does not,
that verdict routes to the pricing shelf, not to a behaviour table."* This is a REPORTED
direction, not a gate: the GK channel-mix faces answer it, either way, and either answer is
banked as-is.

## §5 THE NAMED OBSERVATIONS (#307 / #308 — measured where cheap, never gated)

1. **THE ONE-TOUCH SHOT TAX** (#307 §CORR item 2): the one-touch bypass is PASS-side only, so a
   one-touch SHOT does enter `armPendingKick` and pays facing ticks. Measured: the share of
   one-touch shot arms that pay added ticks (`oneTouchShotTaxShare`) and their added-tick mean
   (`oneTouchShotTaxMeanTicks`).
2. **THE MOVING-BODY RESIDUAL** (#307 §CORR item 1): outside-cone-at-release ARMED, split by
   channel, and — for the arm-borne residual — **the striker's SPEED AT ARM published as a
   DISTRIBUTION** (0.5 m/s bins, index *i* = [*i*/2, (*i*+1)/2) m/s, last bin overflow).
   ⛔ **No speed threshold is invented**; the distribution is the report.
3. **REACH-CROSSING EPISODES vs BODY-TICKS** (BK-C0 §CORR item 4 / BK-T1 §R2's honest read):
   both are published, each under a name that says which unit it carries.

## §6 THE GATES (frozen)

`gWorld` (world-8 conjuncts + the arm's own flags on EVERY walked match and on the receipt) ·
`gDoseBytes` (three artifact files hashed as bytes) · `gConstants` (every constant anchored at
its NAMED site, the cone re-derived to the census's 68.28°/.3149 edge, the 240-tick window
present) · `gPaired` (both arms walk the same seed list, in the same order) · `gBaseDormant`
(the BASE arm books an all-zero facing ledger AND an all-zero contact ledger) · `gArmedFires`
(non-vacuity: the armed arm extends arms and applies strikes) · `gNoSuperpower` (zero strikes
followed by the striking body owning the ball) · `gLifecycle` (zero strikes outside `playing`) ·
`gReleasesObserved` (no empty denominator on any walk) · `gArmsObserved` ·
⭐⭐ `gLawReproduced` (**the instrument validates itself against the engine**: the probe's own
re-implementation of BK-T0 §LAW, at ARM TIME, equals the engine's `bkFacingLedger` EXACTLY on
arms-seen, arms-extended, extra-ticks and max-extra — the independent-implementation layer that
catches definition errors a tautological self-check cannot, BK-C0 §CORR item 3) · `gBoundHolds`
(no charge exceeds the structural 18) · `gStatsDisjoint` (base ≥ 113,800 and ≥ 200 from every
published base) · `gSrcUntouched` (`git diff --stat HEAD -- src` AND `git status --porcelain --
src`, both empty) · `gSeedsBookedEqualWalked` (against the probe's own arithmetic, not this
prose) · `gFaces` (EVERY published face's numerator, denominator, point and Δ re-derived by
re-parsing the SERIALIZED artifact off disk, plus eight stored-bin histograms).

⚠ **A RED GATE OR A FAIL VERDICT IS REPORTED, NEVER PATCHED** (the BK-T0 precedent, #307
item 2). A criterion is never re-cut after seeing results.

## §7 SEED LEDGER (BOOKED = WALKED)

**Block of record: 12,504,000–999** (opened by ruling #308 item 4).

| sub-range | count | what for |
|---|---|---|
| `12,504,000 – 12,504,002` | 3 | the **pre-freeze sizing/liveness smoke** (`BKT2_MODE=smoke`, `/tmp` output). **Inside the battery's own range — no extra consumption.** |
| `12,504,000 – 12,504,399` | 400 | **the battery of record**, each seed walked TWICE = **800 walks** |
| `12,504,999` | 1 | the **world-construction receipt** (the xxx,999 convention) |
| `12,504,400 – 12,504,998` | 599 | **NOT WALKED** — unconsumed inside the consumed block |

**THE SIZE, WITH ITS REASON — THE RAREST SCORED CELL GOVERNS.** The scored cells are the
outside-cone share (≈ 106 releases/match, saturated at any N), the applied added-ticks
distribution (≈ 26 arms/match), the cooldown-invisibility class (≈ 93 core body-ticks/match)
and — the RAREST — **the dead-band cause cell at the lawful reach radius**, which BK-C0
measured at 328 body-ticks over 500 matches = **0.656/match**. N = 400 paired seeds puts
≈ 260 base-arm events under that cell, the grain a paired cluster bootstrap needs to separate
it from zero; it also puts ≈ 320 punts under the thinnest REPORTED cell (the GK landing table
at 7.6 % of 10.58 releases/match). **Wall is not the binding constraint**: the sizing smoke
measured 0.19 s per walk, so 801 walks costs ≈ 2.6 min against a 60 min ceiling.

**STATS-STREAM DRAWS: base 113,800, ONE draw, step 200.** The single paired cluster bootstrap
(2,000 resamples) scores every face from one resample-index matrix. Checked in-probe against
every published base; the minimum gap is published as `stats.minimumGapToAnyPublishedBase`.
**Next base ≥ 114,000.**

## §8 VISION / REALITY (the #201 standing rule)

* **VISION §-1 (tactics emerge)**: this stage adds no mechanism at all — it measures two banked
  laws. What it can find is whether the world's own chooser and selection re-price the punt and
  the reversed pass **by themselves**; the contract pre-registered exactly that and pre-routed
  the negative answer to the pricing shelf rather than to a behaviour table. **PASS.**
* **VISION 底座给能力**: the faces measure substrate consequences (time, contact, possession
  chains), never a hand-authored tactic. **PASS.**
* **VISION #200 (no taste constants)**: the cone comes from `C7_W_CAP`, the turn from
  `TURN_RATE`, the pressure radius from `TOUCH_CONTROL_DIST`, the forward band from the
  engine's own forward-pass line, the turnover window from the engine's own arrival law, the
  bounce window from the committed census artifact. The ONE number this stage chooses is the
  **0.50 collapse bar**, and §3 states its provenance and why it is looser than the receipt it
  came from. **PASS.**
* **REALITY (真实足球怎么做)**: a player turns before he strikes or takes it on the wrong foot,
  and the ball hits bodies — the exam asks whether pricing that TIME and that CONTACT leaves a
  game whose possession chains, pressing share and pass completion still read like football.
  Those are exactly the R-乙 rows, and they are reported against R-乙's own real bands.
  **PASS.** *Honest limit, stated*: the exam cannot say whether the world PLAYS better — that
  is the BK play-test's USER GATE, not this stage's.

## §9 DECLARED DEVIATIONS AND DOUBTS (stated BEFORE the battery)

1. **The pre-freeze sizing smoke was run and its numbers were seen** (3 paired seeds, `/tmp`,
   non-canonical path, seeds inside this stage's own band). The success criteria and CI rules
   above were written into the probe **before** it ran and are **not** changed afterwards
   (the BK-T1 precedent, §R0: predicate-after-sight is forbidden). Disclosed of record: at
   n = 3 the smoke showed H-BK.2 limb (b) **failing** on counts of 2 vs 2 body-ticks. **The
   rule was not touched.**
2. **The release direction is OBSERVED, not intercepted** — BK-C0 §DOUBTS 1, inherited whole.
   No face here is the engine's internal pre-noise `misalign` variable.
3. **The cause ladder is an ORDERING, not an exclusive diagnosis** — BK-C0 §DOUBTS 2, inherited.
4. **The arm ledger observes SLOT TRANSITIONS.** An arm is keyed by `(gid, readyTick)`; two
   consecutive arms by the same body to the same ready tick would be seen as one. The engine's
   own ledger is the cross-check, and `gLawReproduced` asserts they agree exactly.
5. **The corridor rung's denominators move.** Every rung count is stored per seed so any other
   conditioning re-derives off disk.
6. **The §2 equilibrium band gates nothing here**, deliberately. If a dimension moves far, that
   is a REPORTED fact for the commander and the play-test, not an abort.

---

# §RESULT — appended in COMMIT 2, after the battery

> **Artifact:** [`data/bk-t2-composition-exam.json`](data/bk-t2-composition-exam.json) ·
> `resultSha256 = a86ccbc65992c13e12dcfc4b8457cd5cc03c188b96217d0f994bafccbfafabf3` ·
> `instrumentSha256 = 4810b86c85bd04f2fcfec38f3ca97c962c105be5c79d350de6612fd6477eba64` ·
> `headCommit = 936c9f1c8b598baeea4434bdb697b5544929d511` (the FREEZE commit — canon
> freeze-before-battery) · `hashedBodySha256 = eb1d1e8fd8affd7ce7dcb0ba5c526d8f86a8b056f7c4249d544421c80933a744`.
> Battery: **400 paired seeds × 2 arms + 1 world receipt = 801 walks**, 12,155,866 ticks,
> **98.9 s wall** (`battery.wallSeconds`). `gFaces` re-derived **392/392** published checks by
> re-parsing the serialized artifact off disk, plus 8 stored-bin histograms
> (`faceCoverage.failures = []`).
>
> **Every number below quotes an artifact FIELD by name** (canon: *"a stage doc's prose quotes
> artifact FIELDS verbatim or the number becomes a gated face"*). Where a number is doc-side
> arithmetic OVER artifact fields it says so and shows the arithmetic. Every Δ carries its
> paired 95 % CI and its `absDeltaOverHalfWidth`.

## §R0 THE WORLD IS THE WORLD, AND THE BASE ARM RE-VALIDATES THE CENSUS

`world.everyWalkedMatchConformed = true` on all 800 battery walks and on the `12,504,999`
receipt (all six `receiptConjuncts` true). Dose file-byte hashes:
`world.l3DoseFileBytesSha256 = a41a114c…37db` (`l3DoseLungesTotal = 27368`) ·
`world.pcDoseFileBytesSha256 = 0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f`
(`pcDoseExposuresTotal = 8281`) — the same two artifacts BK-C0, BK-T0 and BK-T1 dosed from.
`world.formulaIdentityHolds = true`.

⭐ **THE BASE ARM IS AN INSTRUMENT SELF-VALIDATION ON VIRGIN SEEDS** — it reproduces BK-C0's
500-match census closely, with nothing tuned:

| face (field) | BK-C0 (500 matches) | BK-T2 `base` (400) |
|---|---|---|
| `releasesPerMatch` | 106.11 | **105.735** |
| outside-cone share of releases | 33.6 – 36.3 % (bin-bracketed) | **0.351445** (`outsideConeShareAllReleases`) |
| mean misalign at release | 0.297567 | **0.295699** (`meanMisalignAtRelease`) |
| observed wind-up mean ticks | 6.458225 | **6.435060** (`meanAppliedWindupTicks`) |
| visual through-body body-ticks / match | 119.192 | **118.2325** |
| visual through-body EPISODES / match | 29.41 | **29.2375** |
| dead-band cause reach body-ticks / match | 0.656 (doc-side, 328 ÷ 500) | **0.5775** |
| GK releases / match | 10.578 | **10.645** |

## §R1 ⭐⭐ H-BK.1 — **PASS** on all three limbs

| limb | face (field) | base | armed | Δ [95 % CI] | \|Δ\|÷half-width |
|---|---|---|---|---|---|
| **(a) COLLAPSE** | `outsideConeShareAtRelease` | **0.332869** | **0.231131** | **−0.101738** [−0.107586, −0.095272] | **16.524** |
| **(b) TIME PAID** | `meanAppliedWindupTicks` | **6.435060** | **9.999856** | **+3.564797** [+3.472690, +3.664010] | **37.265** |
| **(c) NEVER A BAN** | `beyondConeReleasesPerMatch` | 37.16 | **25.82** (10,328 releases) | −11.34 [−12.08, −10.5625] | 14.946 |

**(a) THE DISTRIBUTION COLLAPSES TOWARD THE CONE, AND IT IS A DISTRIBUTION, NOT A GATE.** One
release in three left the boot outside the strike cone; now it is fewer than one in four —
a **30.6 % relative fall** (`relative = −0.3056`), CI strictly below zero at 16.5 half-widths.
The stored bins say the same shape-wise (`namedObservations.misalignBinsAllClasses`): the
lowest bin (misalign < 0.05) goes **16,898 → 19,964**, the median-from-bins **0.15 → 0.10**,
and `meanMisalignAtRelease` **0.295699 → 0.236529** (−20.0 %). ⭐ **AND THE FULLY-BACKWARDS TAIL
BARELY MOVES**: the top bin (misalign ≥ 0.95) goes **3,883 → 3,564**, −8.2 % (doc-side
arithmetic over the stored bins) — because that tail is overwhelmingly the header and
out-of-scope families the law never touches. *The law did not delete the backheel; it moved
the middle of the distribution.*

**(b) THE WORLD PAYS REAL TIME, MEASURED APPLIED.** The mean APPLIED wind-up window goes
**6.44 → 10.00 ticks** (+55.4 %) — an extra 3.56 ticks = **0.059 sim-s per armed release**, on
20,890 applied arms. The window's own distribution
(`namedObservations.appliedWindupWindowDistribution`) shows what that means: base p50 = 7,
p90 = 8 ticks (the shipped [3, 11] clamp); armed p50 = 8, **p90 = 19**, longest observed
window **28 ticks**. Per match the world pays `appliedAddedTicksPerMatch = 185.7` ticks
(**3.10 sim-s a match**, doc-side ÷ 60). `chargedShareOfAppliedArms = 0.441647` — **44 % of
applied arms pay something**, and when they pay it is `meanAppliedAddedTicksPerChargedArm =
8.051160` ticks. The charge histogram
(`namedObservations.appliedAddedTicksDistribution.armedBins`, index = ticks) runs the whole
structural range 0…18 and its top bin (18 = the 29 − 11 maximum) holds **323** arms.

**(c) BEYOND-CONE USAGE SURVIVES, AND BOTH LAWFUL CHANNELS ARE NON-EMPTY.** Armed, **10,328**
open-play releases still leave beyond the cone (25.82/match). The pre-registered channel split:

| channel (`beyondConeVia…PerMatch`) | base | armed | Δ [95 % CI] |
|---|---|---|---|
| `OutOfScopeFamily` (BK-T0 §6's named-out families) | 13.1325 | **13.0900** (5,236) | −0.0425 [−0.5425, +0.4775] — **unmoved** |
| `OneTouchPassBypass` (THE DESIGNED BYPASS) | 7.7575 | **5.9775** (2,391) | −1.78 [−2.155, −1.410] |
| `UnarmedInScope` (synchronous / restart paths) | 5.4325 | **5.2625** | −0.17 [−0.4175, +0.0575] — unmoved |
| `WindupResidual` (the arm-borne residual) | 10.8375 | **1.4900** (596) | **−9.3475** [−9.7625, −8.9125], ratio 21.99 |

⭐ **THE READ**: the out-of-scope families are **untouched to the decimal** — exactly as
designed — and the one-touch bypass stays a large live channel at 5.98 beyond-cone releases a
match. **The only thing that collapsed is the channel the law actually governs**: beyond-cone
releases coming out of a wind-up arm fall **86.3 %**. The backheel class is alive; it now lives
where the design said it would.

## §R2 ⭐⭐ H-BK.2 — **PASS** on both limbs, and the residual is exactly the declared one

| limb | face (field) | base | armed | armed ÷ base | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|---|---|
| **(a) cooldown-invisibility** | `cooldownInvisibleCoreBodyTicksPerMatch` | **97.6775** | **24.3575** | **0.2494** | −73.32 [−76.5225, −70.1825] | **23.129** |
| **(b) dead-band pass-through** | `deadBandCauseReachBodyTicksPerMatch` | **0.5775** | **0.2775** | **0.4805** | −0.30 [−0.4250, −0.1725] | **2.376** |

*(ratios are doc-side arithmetic over the two published points.)* Both limbs clear the frozen
**0.50** collapse bar — ⚠ **and limb (b) clears it by 0.0195**, which is stated plainly: the
dead-band limb is a **narrow pass**, on the thinnest cell in the stage (231 base body-ticks
over 400 matches). Its companion face at the visual core radius is far cleaner:
`deadBandCauseCoreBodyTicksPerMatch` **0.0675 → 0.0075** (27 → 3 body-ticks, ratio 0.111).

The headline picture the user complained about: `visualThroughBodyBodyTicksPerMatch`
**118.2325 → 44.9975** (ratio **0.381**, −62 %) in `visualThroughBodyEpisodesPerMatch`
**29.2375 → 20.9625**; `cooldownInvisibleCoreShare` **0.826148 → 0.541308**.

⭐ **THE RESIDUAL IS THE CLASSES BK-T1 §3 NAMED OUT, AND IT SAYS SO** (core shares; the
denominator is 62 % smaller armed, disclosed):

| residual class NAMED OUT by BK-T1 §3 | base core share | armed core share |
|---|---|---|
| `aboveGkClaim` (honest physics above 2.55 m) | 0.083057 | **0.229679** |
| `aerialBand` (a different lawful channel exists) | 0.051170 | **0.122896** |
| `speedAboveControl` | 0.007612 | 0.027668 |
| `rollOrClaimOrder` (the quality-roll class) | 0.001607 | 0.004945 |

Every one RISES as a share and every one is a share of a much smaller total. **The law BOUNDS
the residual; the residual it leaves is the residual it declared** (BK-T1 §R2's own sentence,
reproduced at exam grain on virgin seeds).

## §R3 H-BK.3 REPORTED — the GK loop: **the physics moved, the pricing did not**

⭐⭐ **THE CONTRACT'S PRE-REGISTERED DIRECTION IS ANSWERED, AND THE ANSWER IS NO.** Contract §1
H-BK.3 predicted: *"the EXISTING pricing ... should see the punt's true cost by itself —
distribution mix may move with zero hand-nudging. If it does not, that verdict routes to the
pricing shelf."* **It did not move:**

| channel share (field) | base | armed | Δ [95 % CI] |
|---|---|---|---|
| `gkShortPassShare` | 0.876703 | 0.885617 | +0.008914 [−0.007942, +0.025920] — **CI spans 0** |
| `gkPuntShare` | 0.065993 | 0.063897 | −0.002097 [−0.016160, +0.012067] — **CI spans 0** |
| `gkThrowOutShare` | 0.034054 | 0.031817 | −0.002237 [−0.008900, +0.004702] — CI spans 0 |
| `gkClearanceShare` | 0.007750 | 0.006574 | −0.001176 [−0.004931, +0.002668] — CI spans 0 |

**Not one distribution channel moved resolvedly.** Per the contract's own routing, that verdict
goes to **the pricing shelf** (the punt's missing landing price, M-BK.3), **not** to a behaviour
table. `gkReleasesPerMatch` itself falls 10.645 → 9.5075 (−10.7 %, CI [−1.5025, −0.7750]).

**But the LANDING CONTEST changed, without anyone choosing differently:**

| face (field) | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `puntAerialFirstTouchShare` (打到人身上) | **0.693950** | **0.539095** | −0.154856 [−0.257997, −0.048785] | 1.480 |
| `puntOppFirstTouchShare` | 0.142349 | **0.061728** | −0.080620 [−0.135973, −0.029022] | 1.508 |
| `gkShortOwnGroundShare` | 0.793668 | 0.766191 | −0.027477 [−0.047341, −0.007159] | 1.368 |
| `gkClearanceOppFirstTouchShare` | 0.818182 | 0.840000 | +0.021818 [−0.189441, +0.216249] | 0.108 |
| `shortTurnoverWithinWindowShare` (瞬间被断) | 0.095429 | 0.084658 | −0.010771 [−0.024277, +0.003665] | 0.771 |

⚠⚠ **AND ONE FINDING THAT POINTS THE WRONG WAY, REPORTED AS-IS**:

| face (field) | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `bounceBackWithin240PerGkRelease` | 0.089479 | **0.131738** | **+0.042259** [+0.023047, +0.060698] | **2.245** |
| `bounceBackAnyGapPerGkRelease` | 0.128699 | **0.173284** | +0.044585 [+0.024185, +0.064329] | 2.221 |

⭐ **弹回门将 GETS MORE COMMON, NOT LESS — +47 % relative, CI strictly above zero.** That is
the user's own third sentence moving the wrong way, and it is exactly what a contact law
should be expected to do to loose-ball traffic near a keeper: a carom that used to fly through
a body now comes back. **It is REPORTED, not explained** — no instrument here separates
save-and-regather from a punt that came home (BK-C0 §DOUBTS 4's gap, still open). It belongs in
front of the commander before the play-test.

⭐ **THE CENSORING DEFECT IS DISCHARGED** (BK-C0 §COMMANDER CORRECTIONS item 2). With the record
retired at 420 ticks, the stored gap histogram is uncensored inside its range, and it shows the
census could not have seen: **158 of 548 base bounce-backs (28.8 %) and 153 of 659 armed
(23.2 %) close at a gap ≥ 250 ticks** (doc-side arithmetic over
`namedObservations.gkGapHistograms`), and the median closing gap sits in the **90-tick** (base)
and **100-tick** (armed) bins — far later than the 40-tick median BK-C0 reported under
censoring. **BK-C0's 0.11609 headline stands as what its name says; its "the loop closes fast
or not at all" reading was correctly struck, and this is the measurement that replaces it.**

## §R4 H-BK.3 REPORTED — the R-乙 chain faces and the direction mix

Definitions reused **VERBATIM** from [`R-YI-STANDING-GAP-TABLE.md`](R-YI-STANDING-GAP-TABLE.md)
(quoted in full in the artifact's `definitions.ryiQ01/Q05/Q06/Q14/Q07`):

| R-乙 row | face (field) | base | armed | Δ [95 % CI] | \|Δ\|÷hw | R-乙's REAL band |
|---|---|---|---|---|---|---|
| Q01 spell length | `ryiQ01SpellSeconds` | 4.702252 | 4.278060 | −0.424192 [−0.531331, −0.320918] | 4.032 | 9.6 – 10.4 s |
| Q05 touches/spell | `ryiQ05TouchesPerSpell` | 2.807019 | 2.553204 | −0.253815 [−0.298793, −0.206962] | 5.528 | 2.88 – 5.12 |
| Q06 completion | `ryiQ06PassCompletion` | 0.686183 | **0.597493** | **−0.088690** [−0.095317, −0.081937] | **13.257** | 75.3 % – 88 % |
| Q14 pressed share | `ryiQ14PressedReceptionShare` | 0.788215 | 0.767891 | −0.020324 [−0.030317, −0.010174] | 2.018 | UNSOURCED |
| Q07 direction mix | `ryiQ07ForwardPassShare` | 0.576727 | 0.559283 | −0.017444 [−0.024432, −0.010164] | 2.445 | UNSOURCED |

⚠⚠ **THE ONE UNCOMFORTABLE ROW: PASS COMPLETION FALLS 8.9 POINTS**, at 13.3 half-widths — the
largest resolved chain move in the stage. *Doc-side arithmetic against R-乙's own low edge
(0.753):* the base arm sits at **0.91×** it, the armed arm at **0.79×** — i.e. **the armed
world moves AWAY from real football on the one chain row that carries a citable real band.**
Mechanically this is not mysterious — a ball that now hits bodies is a ball that arrives less
often — but it is a real cost, it is reported unhedged, and it is a question for the play-test
and for the commander, not something this stage may explain away.

Possession chains shorten by ~9 % on both Q01 and Q05; the pressed share and the forward-pass
mix move slightly DOWN, both resolvedly but both small (−2.6 % and −3.0 % relative). The
direction mix therefore did **not** shift toward safety in any large way.

## §R5 H-BK.3 REPORTED — goals, the §2 equilibrium faces, and the corridor rung

**⚠ REPORT ONLY — the §2 band GATES NOTHING here** (contract §4: *"no equilibrium promise"*;
nothing ships from an exam). The band below is transcribed from its home,
[`MT-T2-COEVOLUTION.md`](MT-T2-COEVOLUTION.md) §5 (which inherits A4-S2P3 §4.2 verbatim), for
reader context only.

| dimension | band (home: MT-T2 §5) | base | armed | Δ [95 % CI] |
|---|---|---|---|---|
| goals | 2.0352 .. 2.7536 | **2.865** ⛔ *base itself outside* | **2.685** ✔ in | −0.18 [−0.400, +0.0175] — CI spans 0 |
| crosses | 1.8671 .. 3.1118 | 2.575 ✔ | 2.8375 ✔ | +0.2625 [+0.055, +0.475] |
| headers | 6.8279 .. 11.3799 | 7.020 ✔ | 6.9525 ✔ | −0.0675 [−0.6525, +0.470] — CI spans 0 |
| longBalls | 4.6532 .. 7.7553 | **4.0325** ⛔ *base itself outside* | 3.705 ⛔ | −0.3275 [−0.6225, −0.030] |
| cutbacks | 2.8613 .. 4.7689 | **6.515** ⛔ *base itself outside* | 6.425 ⛔ | −0.09 [−0.4775, +0.2925] — CI spans 0 |

⭐ **THREE OF FIVE DIMENSIONS ARE ALREADY OUTSIDE ON THE BASE ARM** — that is the A4-S2P3
substrate-drift class (a dimension the CONTROL arm itself fails is the league's own drift, not
the arm's doing), and it is disclosed rather than attributed to the BK laws. **Goals do not
move** (CI spans 0); `shotsPerMatch` 12.7675 → 13.2125 (+0.445 [+0.0375, +0.8475]).

**THE CORRIDOR RUNG — affordable and therefore walked** (BU-C0's ladder, reused).
⚠ Moving denominators disclosed; the rung above the corridor is published so the reader can
see whether it moved — **it did not** (`raceRungShareOfFlightOptions` 0.883233 → 0.883383,
Δ +0.000150, CI spans 0), so the corridor contrast below is read on a stable denominator:

| face (field) | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `corridorSurvivalOfRaceWinners` | 0.257594 | 0.265704 | +0.008110 [+0.004184, +0.011870] | 2.111 |
| `behindCorridorSurvival` | 0.269411 | 0.259250 | −0.010160 [−0.015863, −0.004297] | 1.757 |
| `lateralCorridorSurvival` | 0.321905 | **0.374932** | **+0.053027** [+0.043138, +0.062678] | **5.427** |
| `aheadCorridorSurvival` | 0.191510 | 0.204557 | +0.013047 [+0.006165, +0.019516] | 1.954 |

The lateral lane opens by 16.5 % relative while the backward lane closes slightly. **Reported,
not explained.**

## §R6 THE NAMED OBSERVATIONS (#307 / #308)

1. ⭐ **THE ONE-TOUCH SHOT TAX IS AN EMPTY CLASS IN THIS WORLD — and that, not a rate, is the
   finding.** Over 400 armed matches and 20,890 applied arms, `oneTouchShotArms` totals
   **1**, and that single arm paid **0** added ticks (`oneTouchShotTaxShare = 0` on n = 1;
   `oneTouchShotTaxMeanTicks` is NaN on an empty denominator, published as such). **The honest
   read**: #307's registered question 「一脚出球的射门要不要付转身时间」 is answered on
   FREQUENCY (the class essentially never fires — one arm in 400 matches) and remains
   **UNANSWERED on MAGNITUDE** (n = 1 is not a measurement of what it costs). ⛔ A zero on
   n = 1 is not a rate and is not quoted as one.
2. ⭐⭐ **THE MOVING-BODY RESIDUAL IS NOT A SPEED STORY.** Armed,
   `armedOutsideConeFromWindupArm = 596` releases left outside the cone from an observed arm
   (down from 4,335 on the base arm's counterfactual labelling). **No threshold was invented**;
   the speed-at-arm distributions are published (0.5 m/s bins). *Doc-side arithmetic
   normalising the two stored histograms:* the outside-cone arms are **more** concentrated at
   the LOWEST speeds than arms in general — bin 0 (< 0.5 m/s) holds **13.1 %** of outside-cone
   arms against **4.7 %** of all arms, and the two distributions are otherwise similar in shape
   with no high-speed tail (both are empty above 8 m/s). ⇒ **#307 §CORR item 1's candidate
   mechanism (1) "the body drifts at speed" does NOT account for the bulk of this residual**;
   the split between it and mechanism (2) (the ownership-gated `faceTarget` plant) is still
   **not resolved**, but the drift half is now bounded by data rather than assumed. See §R7
   item 1 for a THIRD mechanism this stage found by accident.
3. ⭐ **EPISODES AND BODY-TICKS ARE DIFFERENT UNITS AND MOVE IN OPPOSITE DIRECTIONS** (BK-C0
   §CORR item 4 / BK-T1 §R2, reproduced at exam grain):
   `reachCrossingBodyTicksPerMatch` **491.4875 → 433.6900** (−11.8 %) while
   `reachCrossingEpisodesPerMatch` **78.8825 → 105.1525** (**+33.3 %**). Armed, reach crossings
   are **more numerous and shorter** — what a carom does to loose-ball traffic. Both are
   published; neither is quoted as the other.

## §R7 ⭐⭐ GATE RED — `gLawReproduced` FAILED, and the failure named a shipped mechanism

**15 of 16 gates GREEN.** `gLawReproduced` is **RED and was NOT patched.**

`namedObservations.lawReproduction`, armed arm, 400 matches:

| column | probe (independent re-implementation) | engine (`bkFacingLedger`) |
|---|---|---|
| arms seen | **20,904** | **20,904** ✔ exact |
| max added ticks | **18** | **18** ✔ exact |
| charged arms | **9,234** | 9,221 — **+13** |
| added ticks total | **74,351** | 74,186 — **+165** |

**THE MECHANISM, INSTRUMENTED NOT GUESSED.** A diagnostic re-walk of the 12 mismatching seeds
(recording, per tick, the probe's re-derivation against the engine's own ledger delta and
dumping the body state at every disagreement) found the discrepancies are **one arm per
affected match, all SHOT arms, all with `aim` = the goal-mouth centre (±31.5, 0)**, and in
every case the striker's heading rotated by far more than one tick of `TURN_RATE` across that
step — from ~90–180° off the aim to **exactly** the aim direction. The writer is shipped code
with its own comment: **`src/ai/PlayerBrain.ts`'s `if (mustKick)` run-up block** — *"A restart
taker sets themselves before striking (the run-up): face the chosen target so orientation
penalties don't gut dead-ball deliveries — corners arrived weak and wild while the taker still
faced the flag."* It assigns `p.heading` directly inside `executeAction`, **before**
`armPendingKick` runs, so:

⭐ **THE FACING LAW IS FREE FOR A RESTART TAKER** — the shipped run-up has already turned him,
so the engine charges 0. The probe, reading the step boundary, still sees the pre-run-up
heading and charges 6–15 ticks. **The ENGINE's ledger is the truth of record; the probe
OVER-states, never under-states**, by 13 arms in 20,904 (**0.06 %**) and 165 ticks in 74,186
(**0.22 %**).

**WHAT IS AND IS NOT CONTAMINATED, STATED EXACTLY:**

* **NEITHER SCORED VERDICT IS AFFECTED.** H-BK.1 (b)'s face `meanAppliedWindupTicks` is read
  from the ENGINE's own slot (`readyTick − armTick`) and never touches the re-derivation; its
  companion conjunct (armed applied added ticks > 0) holds on either number. Every H-BK.2 face
  is a through-body count with no arm arithmetic in it at all.
* **AFFECTED, ≤ 0.22 % HIGH**: `appliedAddedTicksPerMatch` (185.70),
  `meanAppliedAddedTicksPerChargedArm` (8.051160), `chargedShareOfAppliedArms` (0.441647) and
  the added-ticks histogram. The engine's own totals are published beside them in
  `lawReproduction`; **read those where the third decimal matters.**
* ⭐ **THE GATE EARNED ITS KEEP.** Had it not been written, this stage would have published an
  independently-re-derived charge table that silently disagreed with the engine — and the
  shipped restart run-up's interaction with the facing law would have gone unnamed. This is
  BK-C0 §CORR item 3's lesson working: the independent-implementation layer catches what a
  tautological self-check cannot.
* ⭐ **AND IT IS A REAL FOOTBALL FACT, NOT ONLY A PLUMBING ONE**: dead-ball deliveries pay **no**
  facing time, because the taker's shipped run-up already faced him. That was never claimed by
  BK-T0 (§6 names restarts OUT for the pass channel) and it is the right football answer — but
  it was **not registered anywhere before this walk**, and it belongs in the record.

## §R8 SEED LEDGER — BOOKED = WALKED

**Block 12,504,000–999 CONSUMED WHOLE of record.**

| sub-range | seeds | walks | what |
|---|---|---|---|
| `12,504,000 – 12,504,399` | 400 | **800** | the battery of record (base + armed per seed) |
| `12,504,000 – 12,504,002` | (inside the above) | 6 | the pre-freeze sizing smoke (`BKT2_MODE=smoke`, `/tmp` — no extra consumption) |
| `12,504,999` | 1 | **1** | the world-construction receipt |
| `12,504,036 · 068 · 071 · 080 · 121 · 170 · 193 · 208 · 216 · 282 · 337 · 346` | (inside the battery) | 12 | ⭐ the **§R7 diagnostic re-walk** of the mismatching seeds — inside the consumed block, no extra consumption, wrote no artifact |
| `12,504,400 – 12,504,998` (less the above) | 599 | 0 | **NOT WALKED** — unconsumed inside the consumed block |

`seeds.walksBooked = 801`, checked by `gSeedsBookedEqualWalked` against the probe's own
arithmetic. ⭐ **OUT-OF-BAND SCRATCH, DISCLOSED**: the §R7 diagnostic first ran on
**900,000,000 – 900,000,059** (60 scratch matches, 3,110 arms, zero mismatches — which is what
sent the diagnosis to the seed-specific walk), using the canon scratch range
(*"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
(≥ 900,000,000) — never the next virgin block"*, home PW-T0C §CORR item 6). **No virgin block
was touched.**

**STATS LEDGER**: base **113,800**, ONE draw, 2,000 resamples, step 200.
`stats.minimumGapToAnyPublishedBase = 200`. **Next base ≥ 114,000.**

**SRC**: `git diff --stat HEAD -- src` and `git status --porcelain -- src` both EMPTY
(`gSrcUntouched` GREEN). This stage changed no `src/**` byte, so the fingerprint of record
`57b0bdab…c673` cannot have moved and no re-run is claimed. `npx tsc --noEmit` clean.

## §DOUBTS (the executor's own, stated)

1. **`gLawReproduced` is RED in the frozen artifact and was NOT patched** (§R7). The instrument
   was frozen before it walked; making a pre-registered gate pass by editing it after seeing the
   result is the failure this stage exists to avoid.
2. **The dead-band limb of H-BK.2 passes narrowly** (ratio 0.4805 against a 0.50 bar) on the
   thinnest cell in the stage (231 base body-ticks). It is a PASS by the frozen rule; it is not
   a comfortable one, and a future re-read should size that cell deliberately.
3. **`bounceBackWithin240PerGkRelease` RISES** and this stage cannot say why (§R3). The
   save-and-regather / punt-came-home split needs a possession-chain instrument neither BK-C0
   nor this stage built.
4. **Q06 pass completion falls 8.9 points** and the armed world sits further from R-乙's real
   band than the base world did. Reported unhedged; not explained away.
5. **The base arm's beyond-cone CHANNEL labels are counterfactual.** With the law off, an arm's
   `added` is a would-be charge, so the base column of the channel split describes geometry,
   not lawful channels. Only the armed column carries the H-BK.1 (c) meaning.
6. **The corridor rung is an ORACLE census at receptions, not a record of passes played.** It
   answers "what was available", never "what was chosen".
7. **No football VERDICT is claimed anywhere.** Whether the world PLAYS better with a third of
   its strikes paying time and the ball meeting bodies is the **BK play-test's USER GATE**, not
   this stage's.

## §WHAT THIS STAGE HANDS FORWARD

1. **Both scored hypotheses PASS on virgin seeds against frozen rules** — the facing law
   collapses the release distribution toward the cone at an honest, measured 3.56 ticks per
   applied arm without banning anything, and the contact law takes the visual through-body
   picture down 62 % with its residual confined to the classes it declared out of scope.
2. **THREE THINGS FOR THE COMMANDER, none of them this stage's to decide**: (i) the GK
   distribution mix did **not** move ⇒ the contract's own pre-registered routing sends the
   punt's landing price to **the pricing shelf**; (ii) `bounceBackWithin240PerGkRelease` **rose
   47 %** — the user's own third complaint moving the wrong way; (iii) **Q06 pass completion
   fell 8.9 points**, away from R-乙's real band.
3. **A previously unregistered shipped interaction** (§R7): the restart run-up in
   `PlayerBrain.ts`'s `mustKick` block faces the taker before he arms, so **the facing law is
   free for dead-ball deliveries**.
4. **BK-C0 §COMMANDER CORRECTIONS item 2 is discharged**: the GK gap histogram is now
   uncensored, and roughly a quarter of all loop closures happen beyond the range the census
   could see.
5. **The BK play-test (the contract §3 USER GATE)** is what comes next: 传球像人了吗 ·
   球不再穿人了吗 · 门将的球看着讲理了吗.

---

## §COMMANDER CORRECTIONS OF RECORD (ruling #309, 2026-08-19 — frozen bytes stand)

1. **THE THIRTEENTH SEED (verify MED)**: the artifact's per-seed cells show **13** seeds
   with a probe/engine mismatch; §R7/§R8 list and re-walked **12** — the missing one is
   `12,504,379` (armsΔ +1, ticksΔ +15). Of record: the §R7 mechanism (the shipped restart
   run-up pre-faces the taker) is ESTABLISHED on 12 of 13 arms and EXTRAPOLATED to the
   13th (15 of 165 ticks, 9 % of the tick mass); the contamination bound itself (13 arms /
   165 ticks, over-charge only) is verified cell-by-cell and UNAFFECTED; all walks stayed
   inside the consumed block (no seed-hygiene breach). The §R8 diagnostic row is corrected
   to 12-of-13-re-walked.
2. §R6 item 2's "both are empty above 8 m/s" is FALSE for the all-arms histogram
   (`armSpeedBins[16]` = [8.0, 8.5) holds 5 of 20,890); the outside-cone histogram is
   genuinely empty there; the finding it supports (the residual is NOT a speed story) is
   re-derived exact and unaffected.
3. §R1(c)'s "ratio 21.99" is |Δ|÷half-width, NOT armed÷base (which is 0.137 there). The
   word "ratio" of record carries §R2's meaning (armed÷base) only; |Δ|÷half-width rows
   say so by name.
4. Bin-percentile EDGE CONVENTION was inconsistent (§R1(a) quotes upper edges, §R3 lower
   edges). One bin either way; no conclusion moves; the artifact's declared convention
   governs, and future prose states the edge per face.
5. Clock prose of record: per-match rates are per MATCH (walked matches average 253.2
   sim-s, not the nominal 240); the two arms are not exactly time-matched
   (playingTicks +0.57 % armed, undisclosed then, disclosed now) — immaterial at the
   scored effect sizes (−75 % / −52 %), material for any future face moving < 1 %.
