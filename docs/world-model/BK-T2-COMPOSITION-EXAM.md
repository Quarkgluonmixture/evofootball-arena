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
