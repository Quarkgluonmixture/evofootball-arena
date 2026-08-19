# IN-C0 — THE PERCEPTION-SURFACE CENSUS (instrument-only)

> **Authority**: [`IN-SNAPSHOT-CONTRACT.md`](IN-SNAPSHOT-CONTRACT.md) §3 IN-C0 (a)–(e),
> dispatched by **ruling #316 item 2**. First stage of the PRIVATE-SNAPSHOT arc
> (INFO-DOCTRINE slice 2, 拿住球买信息).
> **INSTRUMENT-ONLY**: `src/**` is untouched — nothing here arms, doses or edits a seam.
> **NOTHING IS SCORED**: every face is REPORTED. The gates are instrument-integrity gates;
> no football claim passes or fails here. The census PICKS the seam design, the refresh law
> and the slice order — the commander rules, this stage recommends.
>
> Probe: `scripts/probes/in-c0-perception-surface-census.ts`
> Artifact: `docs/world-model/data/in-c0-perception-surface-census.json`
> Run: `INC0_MODE=full npx tsx scripts/probes/in-c0-perception-surface-census.ts`

## §CANON QUOTED (copied from [`CANON.md`](CANON.md), never re-typed — #301)

* **freeze-before-battery** — freeze the instrument commit BEFORE the battery; artifact
  records the instrument hash. *home: ruling #266.3(c) (paraphrase).*
* VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the
  schema never enters the body; forbidden-name lists are retired". *home: PC-T0 §CORR item 1.*
* **per-seed cells** — stored so every headline re-derives. *home: ruling #282.2(ii)
  (paraphrase).*
* **gFaces-from-disk** *(home: ruling #287 item 1)* + VERBATIM: "the re-derivation gate covers
  EVERY published face; a percentile face requires stored bins". *home: PC-C0 §CORR item 4.*
* VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
  occurrence's site". *home: PC-C0 §CORR item 1.* — the needle PREFIX is stated (#307 §CORR 3).
* VERBATIM: "a field carries the unit its name claims". *home: ruling #294 item 3.*
* VERBATIM: "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
  face". *home: PC-T2 §CORR item 4.*
* VERBATIM: "a starred finding states its |Δ|÷half-width ratio". *home: BU-T0B §CORR item 2.*
* VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site — anchored
  match + line receipt — never first-occurrence". *home: BK-C0 §CORR item 1.*
* VERBATIM: "a dose-source guard should hash the bytes it reads, not a self-declared field".
  *home: BU-T1 §CORR item 6.*
* **moving denominators** disclosed per face. *home: PW-C0 §CORR item 2 (paraphrase).*
* **seed discipline** — BOOKED = WALKED; blocks consumed whole; stats floors step ≥ 200.
  *(paraphrase.)*

---

# PART I — THE FREEZE (pre-registration, written BEFORE the battery)

## §1 The five instruments, as built

### (a) THE TRUTH-READ SURFACE — a static census of `src/**`

**THE NEEDLE PREFIX, STATED.** The needle is a property-access suffix matched against a
captured RECEIVER expression. The prefix alphabet is

```
[A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*
```

optionally followed by a bracket index (`this.allPlayers[gid].pos`, recorded as
`this.allPlayers[]`). The four needles are the four body-state fields a decision could read
off another body: **`.pos` `.vel` `.bodyDir` `.heading`**. Line comments and block-comment
interiors are stripped before matching (newlines preserved, so line receipts survive). A read
off a CALL RESULT (`foo().pos`) is uncapturable by construction and is a **RED gate**
(`gNoUncapturedReceiver`) if it ever appears.

**THE TWO FROZEN MAPS.** Every occurrence is classed by two lookups, both frozen here:

1. a **RECEIVER LEXICON** — every captured token maps to exactly one ROLE:
   `self` (proprioception, FREE by M-IN.1) · `ball` (slice 1's domain) · `other` (another
   body's TRUTH — the surface to interpose at) · `seen` (already a percept record) ·
   `frame` (perception-trunk bookkeeping) · `nonbody`. An unmapped token is a **RED gate**
   (`gNoUnknownReceiver`), never a silent bucket.
2. a **FILE GRADE MAP** — every file under `src/` gets exactly one grade: `chooser` (option
   scoring / valuation / assignment) · `executor` (steering, targets, spots) · `physics`
   (contact, capture, kick resolution, the tick — **STAYS TRUTH by M-IN.1**) · `observed`
   (the perception trunk itself) · `outside` (render / ui / shell / evolution). An unmapped
   file is a **RED gate** (`gNoUnmappedFile`).

**THE VERDICT QUANTITY**: `interposeSiteCount` = occurrences with role `other` at grade
`chooser` or `executor`. Beside it, the **BODY-ENUMERATION GATEWAY** census: the expressions
that hand a decision a COLLECTION of bodies at all (`team.players`, `opp.players`,
`match.allPlayers`, …). A snapshot interposing at a gateway reaches every downstream read at
once — which is what decides BOUNDED vs STAGE-STOP.

### (b) THE VISION-ALGEBRA INVENTORY — candidates derived, never chosen

**THE ALGEBRA.** The shipped blind form is `blind = (1 + ĥ·d̂) / 2` with `ĥ` the body's
heading and `d̂` the ball's travel direction. For an approaching object the unit vector FROM
the body TOWARD it is `û ≈ −d̂`, so the same expression read as a SEEING weight is

```
s = 1 − blind = (1 + ĥ·û) / 2      (1 dead ahead · 0.5 square across the body · 0 behind)
```

That is the **only** facing price the engine ships. Every candidate is a THRESHOLD ON IT,
obtained by asking the engine's own prices where they bite. All extractions are anchored to
their NAMED declarations with line receipts (`visionAlgebra` in the artifact).

| candidate | edge | derivation chain | derived from the blind algebra? |
|---|---|---|---|
| **F1 bkCone** | half-angle `BK_CONE_RAD` | `BK_CONE_TICKS · DT · TURN_RATE` = the rotation the world's EXISTING wind-up time price already absorbs (BK-T0 §LAW). Inside it the engine treats the body as ALIGNED FOR FREE. | no — from `TURN_RATE` + `C7_W_CAP` |
| **F2 squareAcross** | `ĥ·û ≥ 0` | `s ≥ 0.5`, the engine's own midpoint, named in mechanics.ts's own words: "0.5 = square across the body". | **yes** |
| **F3 deflectHalfPrice** | `ĥ·û ≥ 1 − 2·(0.5/DEFLECT_BLIND_PEN)` | the deflection roll multiplies by `(1 − blind·DEFLECT_BLIND_PEN)`; the facing at which the engine has taken HALF the odds away. | **yes** |
| **F4 contactHalfPrice** | `ĥ·û ≥ 1 − 2·(0.5/CONTACT_BLIND_PEN)` | the same construction at the CAPTURE roll; the WIDEST field the blind algebra names, because 0.7 is the gentler pen. | **yes** |
| **F5 incumbentCone** | `facing ≥ −0.2 − awareness·0.5`, range `18 + awareness·22` m, 4 m near field | `visibleDistance`'s own shipped gate. ⚠ **TASTE CONSTANTS from the EDS era** — the CONTRAST arm, published as what the two already-armed percept consumers use TODAY, never as a derivation. | **no (labelled)** |

**THE HONEST LIMIT, STATED BEFORE THE BATTERY**: the blind algebra prices FACING and nothing
else — it carries **no distance term anywhere**. F1–F4 are therefore ANGLE-ONLY fields. The
only shipped RANGE lives in F5. Consequence, registered here: F5 is **not** a set-superset of
F4 (a body 40 m dead ahead is inside every angle-only field and outside F5), so the
monotonicity gate is SCOPED to F1–F4 (`gStalenessMonotoneInAngleOnlyFields`) and the
out-of-range population is published as its own face (`pairsBeyondIncumbentRangeShare`).

### (c) THE o2Look INVENTORY

Needle counts over `src/**` for `o2Look` · `o2LookWindow` · `forcedLook` · `o2LookLedger` ·
`O2_LOOK_TICKS` · `armO2Look` · `stepO2Look` · `o2LookEligible` · `o2LookDecision` ·
`recordObserverScanFrame`, every occurrence's site listed, plus a structural assertion that
the seam is still shaped the way O2-T0 banked it and is **DORMANT in world 9**.

### (d) THE STALENESS-OPPORTUNITY CENSUS + THE COUNTERFACTUAL DOSE LADDER

**THE WORLD**: single arm, the **WORLD-9 composition** — BK-T2/R9's `buildMatch` reused
exactly (`a4MatchFlags(8)` + `armA4World` with the matured L3/PC doses, **both dose files
hashed AS BYTES before they are parsed**) + `bkFacingLaw` + `bkContactLaw`. No armed arm: the
dose ladder is ORACLE-side.

**THE SAMPLE STRIDE, DERIVED**: every `round(15 − awareness·9)` at awareness = 1 = **6 ticks**
— the fastest interval the SHIPPED perception trunk ever scans at.

**THE READ CLASSES** (from instrument (a)'s own findings, not invented): `chooserOpp` (the
carrier's chooser scans EVERY opponent) · `chooserMate` (the carrier's pass-candidate window,
the engine's own `passChoiceCandidateGids`) · `executorMark` (`Team.marks`) · `executorBall`
(the carrier as chase/press target) · `executorTeammate` (⚠ **an explicit UPPER BOUND** —
the enumerated executor sites read teammate bodies by alias and the census does not resolve
which one per site, so it books all of them and says so).

⭐ **A PRE-FREEZE CORRECTION OF RECORD**, made from CODE FACTS before any battery result was
read: the OFF-BALL chooser is **already snapshot-based** (`offBallAffordance` builds its
context from `snapshot.players.filter(...)`; `stationEye`'s `perceivedContext` likewise), so
an off-ball body's opponent reads are not truth reads at all — which is why `chooserOpp` /
`chooserMate` are scoped to the CARRIER. Without the upper-bound class the `receiver`
situation would have carried a ZERO denominator: a vacuous face dressed as a measurement.

**THE SITUATIONS** (reader's own state, first arm that matches): `carrier` · `receiver`
(target of a live `pendingPass`) · `defender` (his side does not hold the ball) · `supporter`.

**PHYSICS PAIRS ARE EXCLUDED** by M-IN.1 VERBATIM ("PHYSICS STAYS TRUTH: contact/collision/
capture read the world — a body you do not see still blocks you") and their count is
published so the exclusion is auditable, never silent.

**THE COUNTERFACTUAL DOSE LADDER — the bounded, well-defined subset, pre-registered.** At
**RECEPTION MOMENTS** (the tick a non-GK body newly establishes ownership in open play) the
**pass chooser's ranked candidates** are re-evaluated twice per (field × k):

* FRESH — the engine's own `choosePerceivedPassTarget` on a full-truth oracle snapshot
  (awareness 1, ageTicks 0), the documented offline path.
* DEGRADED — the same call with every body OUTSIDE the reader's candidate field having its
  `pos`/`vel`/`bodyDir` replaced by the truth frame from **k ticks ago** (a ring buffer).

Published per (field × k): `flipShare` (the ARGMAX target changed) and `reorderShare` (the
ranked order changed at all — a superset, gated to contain the flips).

**THE k LADDER, DERIVED** (never chosen): `{6, 12, 27}` ticks = {the fastest SHIPPED scan
interval, `PC_TIER_SIMPLE_TICKS` (slice 1's SIMPLE tier, 0.20 sim-s), `PC_TIER_CHOICE_TICKS`
(slice 1's CHOICE tier, 0.45 sim-s)}. Every rung is a number the world already ships.

**GRAIN**: CENSUS-GRAIN COUNTERFACTUAL — oracle re-evaluation only. No live seam is armed, no
engine tick is altered, nothing is written back into the match.

### (e) PERF SIZING

The bookkeeping bound is **12 bodies × 11 seen × 5 fields** = 132 records and 660 field tests
per tick. Two numbers are published with what each one IS: an **UPPER BOUND** on per-tick step
cost (`stepWallMs` brackets the whole walk loop, this probe's sampling included — the shipped
`scripts/perf-baseline.ts` remains the authority for the engine's own cost) and an **ISOLATED**
micro-measurement of the bookkeeping arithmetic in the same process on the same machine.

## §2 The seed & stats plan (frozen)

* **SEEDS**: block **12,507,000–999**, consumed whole. Battery = `12,507,000 … 12,507,239`
  (240 walks, single arm) + the world-construction receipt at **12,507,999**. Smoke prefix
  in-band: `12,507,000–002`. **BOOKED = WALKED** (`gSeedsBookedEqualWalked`).
* **STATS**: base **114,200**, step **200**, 2000-resample CLUSTER bootstrap by match seed,
  percentile 95 % CIs, ONE resample-index matrix for every face.
* ⭐⭐ **THE STATS-BASE REGISTRY ORDER (#315 item 4 / §CORR 4) IS DISCHARGED FIRST**, before
  the disjointness check is evaluated. Method (published in the artifact so it re-runs): the
  union of (i) R9's inherited 41-entry list, (ii) every committed
  `docs/world-model/data/*.json` stats base at a key named `base`/`statsBase`/`seedBase`
  (`nextBaseAtLeast` and `publishedBasesCheckedAgainst` EXCLUDED — a forward pointer and a
  copy of this registry respectively), (iii) every `scripts/**` top-level
  `const …BASE… = <6 digits>` declaration. `gStatsDisjoint` checks against **the COMPLETED
  registry** and says so (`stats.checkedAgainstTheCompletedRegistry`).

## §3 The gates (frozen — a red gate is REPORTED, never patched)

`gWorld` · `gDoseBytes` · `gNeedleEnumeration` (per-needle counts sum to the enumerated site
list AND to the grade×role matrix) · `gNoUnknownReceiver` · `gNoUnmappedFile` ·
`gNoUncapturedReceiver` · `gAnchoredExtraction` · `gFieldsNested` · `gLadderDerived` ·
`gO2Inventory` · `gNonVacuous` · `gLadderNonVacuous` (every field × k cell has a denominator)
· `gLadderDenominatorsAgree` · `gStalenessMonotoneInAngleOnlyFields` · `gPairPartition` ·
`gReorderContainsFlips` · `gRegistryComplete` · `gStatsDisjoint` · `gPerfAnchored` ·
`gSrcUntouched` · `gSeedsBookedEqualWalked` · `gFaces` (every published face + every stored
matrix re-derived by RE-PARSING the artifact off disk).

## §4 Declared doubts (before the battery)

1. **`executorTeammate` over-counts by construction.** It is an upper bound and is labelled
   one everywhere it appears. Read the four other classes for the tight numbers.
2. **The situation axis is a snapshot of the reader's state at the sampled tick**, not a
   spell-level attribution; a body can change situation between strides.
3. **The dose ladder degrades ONE consumer** (the pass target chooser). It is the only
   consumer whose ranked menu is a well-defined, engine-owned object. Openness, lanes,
   pressure and marking are NOT re-evaluated — their sensitivity is a later stage's work, and
   the ladder's numbers must not be read as the whole decision layer's sensitivity.
4. **The oracle path runs at awareness 1** (full truth, no keyed error). The census measures
   the effect of STALENESS ALONE, cleanly separated from the incumbent snapshot's noise.

---

# PART II — THE RESULTS

> Freeze commit `e66269c` (probe blob unchanged between freeze and result). Battery: **240
> walks**, single arm, block 12,507,000–239 + receipt 12,507,999, `battery.wallSeconds`
> **90.8**, `battery.ticksTotal` **3,638,260**. **ALL 22 GATES GREEN.**
> `faceCoverage`: 94 published faces, 282 checks run, 282 passed, zero bin failures.
> `hashedBodySha256` = `9eab1fca3f4b81b6…`.
>
> Every number below is quoted from an artifact FIELD (canon doc-prose fidelity).

## §R1 (a) THE TRUTH-READ SURFACE — **BOUNDED. NOT A STAGE-STOP.**

`needleCounts`: **`.pos` 909 · `.vel` 311 · `.bodyDir` 74 · `.heading` 42** =
`occurrencesEnumerated` **1,336** over `filesScanned` **148**. Every occurrence is listed in
`truthReadSurface.sites` (`file:line:receiver.needle:role:grade`).
`uncapturedReceivers` = **0**.

⭐⭐ **THE VERDICT QUANTITY**: `interposeSiteCount` = **215** other-body TRUTH reads at
decision grade, across `interposeFileCount` **23** files — `interposeByGrade.chooser` **146**,
`interposeByGrade.executor` **69**. Beside it `physicsOtherBodySitesStayTruth` = **300**
occurrences that stay truth by M-IN.1, published so the exclusion is auditable.

⭐⭐ **AND THE SURFACE IS SMALLER THAN THAT**, because reads are downstream of ENUMERATION.
`gatewayDistinctTokens` = **11** over `gatewaySiteCount` **157** sites, and the truth-bearing
ones are few: `team.players` **26** · `opp.players` **14** · `match.allPlayers` **2**. The
rest of the gateway traffic is ALREADY percept-side — `snapshot.players` **32** ·
`opponents` **45** · `teammates` **18** · `snap.players` **3** · `perceived.players` **1** ·
`input.snapshot.players` **1**. **A snapshot that interposes at `Team.players`-shaped
enumeration reaches the whole chooser surface at ~42 sites, not 215.**

⭐ **THE FINDING THE CENSUS EXISTS TO FIND** (`world.receiptConjuncts`): the private snapshot
is NOT virgin ground. In the world-9 composition `edsPerceivedChoiceArmed` = **true** and
`edsPerceivedDefenceArmed` = **true** — the pass TARGET chooser and the perceived-defence read
ALREADY run off a per-body private memory with a scan cadence, a retention horizon and keyed
positional error. And (`stalenessCensus.offBallChooserIsAlreadySnapshotBased`) the OFF-BALL
chooser is percept-based too. What is still full truth is the CARRIER's context layer
(openness / lanes / pressure / blockers), the marking and steering executors, and physics.

## §R2 (b) THE VISION ALGEBRA — the derived fields bracket 90°–115.4°; the shipped one is taste

`visionAlgebra.candidates`, half-angles as published:

| candidate | half-angle | `dotMin` | range | derived from the blind algebra |
|---|---|---|---|---|
| F1 bkCone | **68.2775°** | 0.369975 | none | no (`TURN_RATE` × `C7_W_CAP`) |
| F2 squareAcross | **90°** | 0 | none | **yes** |
| F3 deflectHalfPrice | **109.4712°** | −0.333333 | none | **yes** |
| F4 contactHalfPrice | **115.3768°** | −0.428571 | none | **yes** |
| F5 incumbentCone | **126.8699°** | −0.6 | **35.6 m** + 4 m near field | **no — TASTE (EDS era)** |

`visionAlgebra.honestLimit` (verbatim): "the blind algebra prices FACING and nothing else — it
carries NO distance term, so F1–F4 are ANGLE-ONLY fields. The only shipped RANGE
(18 + awareness·22 m, plus a 4 m felt/heard near field) lives in the INCUMBENT cone F5, which
is NOT derived from the blind algebra and is published as the taste-labelled contrast arm."
`candidatesAreNested` = **true** (in ANGLE only; `f5NotNestedBecauseItCarriesARange` = true).

## §R3 (c) THE o2Look INVENTORY — the seam is right-shaped and **cannot turn**

`o2LookInventory.countsTotal` = **97** needle occurrences, every site listed;
`dormantInWorldNine` = **true**. What a look IS today, verbatim from
`o2LookInventory.whatALookIsToday`: 11 ticks (`round(C7_W_CAP · 60)`) during which the body
PLANTS, does not act, and **one extra scan MOMENT is recorded per tick through the EXISTING
recorder** — "It opens NO new information channel: `visibleDistance`'s cone is applied
unchanged when the frames are replayed, so what his heading does not cover stays uncovered."

⭐⭐ **THAT IS THE DECISIVE FACT FOR EXTEND-VS-NEW.** Under a vision field, a look that does
not TURN buys freshness only on the bodies he can already see and **nothing** on the ones he
cannot. The user's own story (接球前观察 · 预判队友和对手) is about the bodies he cannot
currently see. `o2LookInventory.extendVsNewMaterial` names the three lacks: (i) the look does
not turn; (ii) `forcedLook` is an instrument channel, not a chooser; (iii) its consumer was
the whether-seat, and ruling #222's F-O2a STOP proved that consumer does not move.
`namedDebts` carries the arming-lifecycle debt, due IN THIS ARC if the seam is extended.

## §R4 (d) THE STALENESS-OPPORTUNITY CENSUS — a third of decision reads are out of field

`stalenessCensus.pairsBooked` = **35,852,225** booked (reader, read-body) pairs;
`physicsPairsExcluded` = **32,466,033** (excluded by M-IN.1, published).

`wouldBeStaleShare_*_all` — the whole booked surface, per candidate:

| candidate | would-be-stale share | CI 95 % |
|---|---|---|
| F1 bkCone | **0.514538** | [0.513623, 0.515452] |
| F2 squareAcross | **0.415987** | [0.415261, 0.416703] |
| F3 deflectHalfPrice | **0.328040** | [0.327096, 0.329030] |
| F4 contactHalfPrice | **0.303195** | [0.302199, 0.304282] |
| F5 incumbentCone | **0.301019** | [0.298567, 0.303473] |

⭐ At the WIDEST DERIVED field (F4) **30.3 %** of decision reads are of a body the reader is
not facing; at the engine's own midpoint (F2) **41.6 %**. Per read class at F4:
`chooserOpp` **0.290184** · `chooserMate` **0.303102** · `executorMark` **0.175965** ·
`executorBall` **0.234183** · `executorTeammate` **0.315301** (⚠ upper bound by construction).
Per situation at F4: `carrier` **0.310466** · **`receiver` 0.360678** · `defender` **0.269737**
· `supporter` **0.338391**. ⭐ **THE RECEIVER IS THE BLINDEST REAL SITUATION** at every
candidate (F2: 0.505195 vs carrier 0.407648) — the doctrine's 接球前观察 sits exactly where
the census says the information is missing.

`pairsBeyondIncumbentRangeShare` = **0.089614** [0.086901, 0.092681]: 9.0 % of booked reads are
farther than the ONLY shipped range term. An angle-only field therefore lets a body "see" a
teammate 50 m away — a named fork, not a defect of the derivation.

### THE COUNTERFACTUAL DOSE LADDER — staleness FLIPS real choices

Denominator `evalByFieldK` = **25,913** (k=6) / **25,897** (k=12) / **25,818** (k=27) chooser
re-evaluations, identical across fields (`gLadderDenominatorsAgree` GREEN);
`receptionMomentsPerMatch` **117.120833**, `ladderEvaluablePerMatch` **116.079167**.

`flipShare` — the ARGMAX pass target CHANGED:

| candidate | k=6 | k=12 (simple tier) | k=27 (choice tier) |
|---|---|---|---|
| F1 bkCone | 0.084243 | 0.144187 | **0.230924** |
| F2 squareAcross | 0.071894 | 0.124030 | **0.198505** |
| F3 deflectHalfPrice | 0.059352 | 0.102522 | **0.166396** |
| F4 contactHalfPrice | 0.055609 | 0.096807 | **0.157138** |
| F5 incumbentCone | 0.046270 | 0.080743 | **0.130142** |

`reorderShare` (the superset) at k=27: F2 **0.324735**, F4 **0.260632**.
Context: `anyCandidateOutOfFieldShare_F4_contactHalfPrice` **0.931871** — at 93 % of reception
moments at least one body is out of field; `outOfFieldCandidateShare_F4_contactHalfPrice`
**0.453080** — 45 % of PRICED PASS CANDIDATES are men the passer is not facing.

⭐ **|Δ|÷half-width for the starred ladder finding** (canon): F4 at k=27, 0.157138 with CI
[0.152002, 0.162345] ⇒ half-width 0.0051715, and the distance from the no-effect value 0 is
**30.4 half-widths**. F4 k=6 (0.055609, hw 0.002908) = **19.1 half-widths**. The staleness
effect is not a noise artefact at any rung.

## §R5 (e) PERF SIZING — cheap, and the published SHARE is mislabelled (disclosed)

`perfSizing`: `bookkeepingRecordsPerTick` **132** (12 bodies × 11 seen), 
`bookkeepingFieldTestsPerTick` **660**, `microMsPerTick` **0.00535** measured over
`microTicks` 20,000 in-process, against `msPerTickUpperBound` **0.024721708** across
`anchorTicks` 3,638,260.

⛔ **A SELF-CAUGHT DEFECT, REPORTED NOT PATCHED**: the field
`bookkeepingShareOfStepUpperBound` = **0.216409** and the transcript's `share ≤` wording are
**directionally wrong**. The denominator is an UPPER bound on step cost (it brackets this
probe's own sampling and up to 15 extra chooser evaluations per reception moment), so the
quotient is a **LOWER bound** on the bookkeeping share of the engine's own step: the true
share is **≥ 0.2164**, not ≤. The number is correct; its name claims the wrong direction, and
canon unit-name truth is struck. **NAMED DEBT for IN-T0**: re-anchor the denominator against
the shipped `scripts/perf-baseline.ts` before any snapshot seam is sized, and rename the
field. No prose number is quoted here that is not an artifact field.

## §R6 THE STATS-BASE REGISTRY — the #315 §CORR 4 ORDER, DISCHARGED

`stats.registryEntries` = **56**; `stats.registryWasIncompleteBy` = **15**;
`stats.checkedAgainstTheCompletedRegistry` = **true**;
`stats.minimumGapToAnyPublishedBase` = **200** against base **114,200**, step **200**.
R9's inherited list held 41. The 15 recovered bases (`stats.registryAdditions`): 102,200 ·
102,800 · 103,200 · 103,600 · 103,800 · 104,200 · 104,600 · 104,800 · 105,200 · 105,800 ·
109,400 · 109,600 · 109,800 · 110,000 · 114,000. **A disjointness check against an incomplete
registry was a green light that could not see 15 of the bases it was protecting** — that class
is now closed, method published in `stats.registryCompletionMethod`.

## §R7 WHAT THE CENSUS RECOMMENDS (the commander rules)

1. **THE SEAM DESIGN: interpose at the ENUMERATION GATEWAY, not at the 215 read sites.** The
   surface is bounded precisely because reads are downstream of `team.players` / `opp.players`
   / `allPlayers` (42 truth-bearing gateway sites). A per-reader snapshot view handed in where
   those collections are handed in reaches the whole chooser surface. **NOT a stage-stop.**
2. **THE FIELD: F2 `squareAcross` as the law of record, with F4 as the declared sensitivity
   arm.** F2 is the only candidate whose threshold is the engine's OWN NAMED midpoint
   (mechanics.ts: "0.5 = square across the body"); it sits between the two pen-derived fields;
   and it states in football language — 肩线前面的看得见,后面的是记忆. F1 is too tight (it is a
   turn BUDGET, not a seeing law: 51.5 % stale, and 99.8 % of reception moments have someone
   out of field — that field makes almost every read stale, which is a different world, not a
   perception law). **F5 must not be inherited**: it is EDS-era taste and #200 forbids it.
3. **ANGLE-ONLY for slice 2.** The blind algebra has no distance term; adding a range would be
   importing taste. The 9.0 % of reads beyond 35.6 m is registered as a NAMED FORK for a later
   stage, not smuggled in now.
4. **THE REFRESH LAW: fresh inside the field at the shipped scan cadence, stale outside, and
   the staleness is FREE** (M-IN.1). The ladder says the price is real without any new penalty
   term: at slice 1's own CHOICE tier (27 ticks) **15.7–23.1 %** of pass choices already flip
   on staleness alone.
5. **SLICE ORDER: IN-T0 = the snapshot law at the CARRIER's chooser gateway FIRST.** It is the
   smallest surface with proven sensitivity (the ladder is measured exactly there), and it is
   the one place the user's story is already testable. The executors and the marking layer
   come after.
6. **o2Look: EXTEND — but the look must TURN.** The seam already owns eligibility, a traced
   time price, a re-decide lock, an abort lifecycle and a ledger; it lacks a GAZE DIRECTION,
   and without one a look buys nothing under any vision field. Note the trunk already ships
   `ObserverGaze` / `createObserverGaze` / `chooseAttentionGaze` — the turn half exists and is
   unwired to any DECISION. Measured precisely, so the claim is not overstated:
   `chooseAttentionGaze` has exactly one caller, `GameApp.ts:648`, and it is a
   **what-if debug overlay** (`whatIfGaze`, the B1 gaze-cone sub-toggle in `ui/actions.ts`) —
   no sim decision path calls it, and `advancePerceptionMemory`'s `gaze` parameter is passed
   `null` everywhere in `src/sim`. ⚠ `attentionPolicy.ts`'s own header still says "no
   production caller", which the overlay has since made stale — a one-line comment debt. And its CONSUMER must change: #222 proved
   the whether-seat does not move; the census proves the **pass chooser** does.

## §R8 HONEST GAPS

1. `executorTeammate` over-counts by construction (declared in §4 doubt 1); read the four
   tight classes for the load-bearing numbers.
2. The ladder degrades ONE consumer (the pass target chooser). Openness / lanes / pressure /
   marking sensitivity is unmeasured — a later stage's work, and these flip shares are not the
   decision layer's whole sensitivity.
3. The perf share field is mislabelled (§R5) — reported, not patched.
4. The oracle runs at awareness 1, so this is the effect of STALENESS ALONE; the incumbent
   snapshot's keyed positional error is deliberately not compounded in.
5. The situation axis is a per-stride snapshot of the reader's state, not a spell-level
   attribution.

---

## §COMMANDER CORRECTIONS OF RECORD (ruling #317, 2026-08-19 — frozen bytes stand)

1. ⛔ **VERIFY FAIL — THE STATIC SEAM-MAP NUMBERS ARE VOID OF RECORD** (HIGH ×2): the
   frozen `stripComments` strips block comments FIRST, so a `/*` inside a LINE comment
   (e.g. the repo's own `src/**` doc-comments, 8 files) opens a phantom block that
   swallows real code — 1,194 code lines blanked (PlayerBrain.ts 791/1,815). Published
   1,336 occurrences / 215 interpose sites / 42 gateways are UNDER-COUNTS; the verifier's
   independent tokenizer (probe's own lexicons) reads 1,488 / 254 / 77 (+ the missed
   `pwSnapshot.players` token). THE QUALITATIVE VERDICTS SURVIVE (BOUNDED, not a
   stage-stop; interpose at the enumeration gateway; 0 unknown receivers on the full
   corpus) — the NUMBERS of record await IN-C0-FIX (ordered, #317 item 3).
2. **THE GATES WERE VACUOUS OVER THE BLANKED CORPUS** (MED): gNeedleEnumeration asserts
   self-consistency of whatever text survived stripping. ⭐ NEW CANON (ledgered this
   round): a text-census completeness gate must be proven NON-VACUOUS against the FULL
   corpus (an independent tokenizer cross-check or a mutation that reintroduces the
   truncation must go red).
3. **WHAT STANDS UNTOUCHED** (verifier re-derived bit-exactly from stored cells): the
   staleness ladder (would-be-stale 0.303–0.416 by field; receiver the blindest at every
   candidate; argmax flips 5.6→15.7 % across k at F4, 30.4 half-widths), the vision
   algebra (five anchored candidates; F1/F5 rejections), the o2Look inventory (the look
   cannot turn; ObserverGaze unwired; consumer must move off the whether-seat), the
   perf micro-measure (its share field's direction mislabel = the named IN-T0 debt),
   the stats-registry completion (R9's list was short by FIFTEEN, now 56 entries), the
   seed/stats ledgers, freeze discipline, git hygiene.
4. LOW notes of record: three Match.ts restart/wall-readiness reads are exempted by
   FILENAME as physics — of record they are WORLD-OWNED referee/setup judgements, and
   IN-C0-FIX classes them explicitly; the report's "11 receipt conjuncts" is 10 + a
   sibling field; src/ai/attentionPolicy.ts:8's "no production caller" comment is stale
   (GameApp.ts:648) — one-line comment debt for the next src-touching slice.

---

## §R-FIX THE STATIC HALF, REPAIRED AND REPUBLISHED (IN-C0-FIX, ruling #317 item 3)

**Instrument:** `scripts/probes/in-c0-fix-surface-rescan.ts` (a FIX GENERATION — the frozen
probe's bytes are untouched). **Artifact:** `docs/world-model/data/in-c0-fix-surface-rescan.json`.
**Corpus:** 148 `.ts` files under `src/`, all 148 graded, 2,214,491 bytes. **Seeds: NONE**
(text census). **STATIC-ONLY: the battery/ladder cells of §R2–§R6 are NOT re-run and are NOT
restated — they stand bit-exact per #317 item 2.** Runs in ~1 s; 17 gates, ALL GREEN at HEAD
`02299c2`; `git status --porcelain -- src` EMPTY (instrument-only); `npx tsx
scripts/fingerprint.ts` = `sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

### §R-FIX.1 WHAT THE FIX IS

A single left-to-right **tokenizer** over the five lexical states that can hide a delimiter
from another delimiter: line comment (**cannot open a block** — the whole bug), block comment,
string literal, template literal (`${...}` interpolations kept as **code**, because they are
code), regex literal. Newlines are preserved for every stripped span, so `file:line` survives.

**The definitions were NOT touched** — the needle regex + prefix alphabet, `INDEXED_RE`,
`UNCAPTURED_RE`, `FILE_GRADE`, `DIR_GRADE`, `RECEIVER_LEXICON`, `GATEWAY_RE`,
`GATEWAY_NEEDLES`, `walkTree`, `gradeOf`, `interface Site` are **copied byte-verbatim** from
the frozen probe, and `gDefinitionsUnchanged` re-reads the frozen file at run time and
compares all eight blocks character for character. Only the CORPUS was ever in question.

⭐ **THE NEEDLE PREFIX, RESTATED** (canon: the prefix is named, not implied):
`([A-Za-z_$][A-Za-z0-9_$]*(?:\.[A-Za-z_$][A-Za-z0-9_$]*)*)\.(pos|vel|bodyDir|heading)\b`,
plus the indexed form `<base>[...]` recorded as `<base>[]`.

### §R-FIX.2 THE CORPUS-INTEGRITY GATE, NON-VACUOUS (the new canon, discharged)

Three independent legs, all in-probe:

1. **THE CROSS-CHECK, ENUMERATED** (per file, tokenizer vs the OLD buggy stripper kept as the
   naive pass): **9 files disagree**, and they are pinned BY NAME — the gate fails if the set
   changes. Seven by the phantom-block mechanism (**1,190 code lines swallowed**):
   `PlayerBrain.ts` 791/1,815 lines (needles 99 vs 24, deficit **75**) · `actionExecutor.ts`
   204/1,443 (144 vs 112, **32**) · `Match.ts` 173/5,260 (302 vs 255, **47**) ·
   `deliveryValueSeat.ts` 9 · `formations.ts` 8 · `mechanics.ts` 4 ·
   `deliveryAccountBook.ts` 1. Two by a SECOND mechanism the same bug carries — the naive pass
   splits on `//` **inside a string literal**, cutting the line tail: `ui/EvolutionScreen.ts`
   and `ui/PlayerScreen.ts` (1 line, 2 chars each). Needle deficit total **154** = exactly
   1,490 − 1,336.
2. **THE MUTANT IS THE HISTORICAL BUG, PROVEN** (`gNaiveReproducesFrozenNumbers`): the naive
   pass reproduces the frozen probe's PUBLISHED totals **exactly** — 1,336 occurrences / 215
   interpose sites / 157 gateway sites / 11 distinct tokens. The straw man is not a straw man.
3. **AN INDEPENDENT STRUCTURAL ORACLE**, needle-free: after correct stripping every file must
   be `()`/`{}`/`[]` **balanced** with no residual `/*`, `*/`, `//`. Tokenizer failures **0**;
   naive failures **9** (`gOracleDiscriminates` — the oracle can fail, and does).

⭐ **THE INDEPENDENT-TOKENIZER CROSS-CHECK CLOSES EXACTLY.** The verifier's tokenizer read
1,488 / 254 / 77; this probe reads 1,490 / 255 / 77 and the whole difference is **enumerated,
not waved at**: two occurrences inside a template interpolation at `PlayerBrain.ts:1026`
(`dist(p.pos, bestThrowMate.pos)` in a `why:` string), of which one is an interpose site
(`bestThrowMate.pos`, chooser). Strip whole template literals as the verifier did and the
numbers are **1,488 / 254 / 77, identical** (`gVerifierCrossCheckReconciled`). This probe keeps
interpolation code: a read inside a `${...}` is a read.

⚠ **ONE HONEST DISCREPANCY, LINE-ACCOUNTING ONLY**: #317 recorded "8 files, 1,194 code lines";
the directional per-line measure here reads 7 blanking files / 1,190 fully-blanked lines + 2
tail-truncated files. Both ENDPOINTS reproduce exactly (frozen 1,336/215/157 under the naive
pass; verifier 1,488/254/77 under the tokenizer), so the corpus is not in dispute — only the
bookkeeping convention for "a line the bug damaged" is.

### §R-FIX.3 THE MUTATION RECEIPT (run, quoted, restored)

Swapping the ONE production alias (`const strip = stripTokens` → `stripComments`), byte copy
kept in `/tmp` and restored after (`sha256 7fe1fe00892d9670346650881ad3ca08504c5c60aca0a3b648ef58536736f49d`
before and after, artifact byte-identical):

```
  **RED**  gCorpusCrossCheckNonVacuous
  **RED**  gStrippedCorpusStructurallySound
  **RED**  gVerifierCrossCheckReconciled
  **RED**  gPwSnapshotTokenCounted
  **RED**  gFixIsAnUnderCountRepair
  disagreeing files = 0 (code lines swallowed by the naive strip = 0, needle deficit = 0)
  structural oracle: tokenizer failures 9 / naive failures 9 (the oracle discriminates)
**GATES RED — the census is NOT of record**
```

The gate is therefore NOT vacuous: reintroducing the truncation goes red, and the numbers of
record cannot be published over a blanked corpus again without the probe saying so.

### §R-FIX.4 THE NUMBERS OF RECORD (these supersede §R5's static half)

| instrument | REPUBLISHED | void (frozen) | Δ |
|---|---|---|---|
| `occurrencesEnumerated` | **1,490** | 1,336 | +154 |
| `needleCounts` | `.pos` **1,028** · `.vel` **340** · `.bodyDir` **74** · `.heading` **48** | 909 · 311 · 74 · 42 | +119 · +29 · 0 · +6 |
| ⭐ `interposeSiteCount` (other-body truth, chooser+executor) | **255** across **23** files — chooser **178** · executor **77** | 215 (146 · 69) | +40 |
| physics other-body sites (STAY TRUTH by M-IN.1) | **330** | 300 | +30 |
| `gatewayDistinctTokens` / `gatewaySiteCount` | **12** / **200** | 11 / 157 | +1 / +43 |
| truth-bearing gateways, the three NAMED world collections | **79** = `team.players` **40** + `opp.players` **37** + `match.allPlayers` **2** | 42 (26 + 14 + 2) | +37 |

Grade totals: chooser **301** · executor **240** · physics **650** · observed **220** ·
outside **79**. Role totals: self **322** · ball **376** · other **677** · seen **68** ·
frame **30** · nonbody **17**. Unknown receivers **0** · unmapped files **0** · uncaptured
(call-result) reads **0** — the frozen lexicons cover the FULL corpus, which is the one
qualitative verdict the bug could have destroyed and did not.

Interpose sites by file (top): `actionExecutor.ts` **45** · `PlayerBrain.ts` **44** ·
`rendezvousRecovery.ts` **23** · `TeamBrain.ts` **20** · `defensiveCoordination.ts` **20** ·
`carryAffordance.ts` **15** · `intentProcess.ts` **11** · `relativeAffordance.ts` **11** ·
`passCorridorInterception.ts` **10** — every one of the 255 enumerated in the artifact
(`interposeSitesEnumerated`), and all 1,490 occurrences in `sites`.

**THE GATEWAY CENSUS, FULLY CLASSED** (200 sites / 12 tokens): truth-bearing **160** —
`opponents` **45** · `team.players` **40** · `opp.players` **37** · `teammates` **22** ·
`players` **8** · `outfield` **6** · `match.allPlayers` **2**. Percept-side **40** — `snapshot.players` **32** · `snap.players`
**4** · ⭐ `pwSnapshot.players` **2** (the token the frozen census MISSED) ·
`perceived.players` **1** · `input.snapshot.players` **1**.
⭐ `pwSnapshot.players` is **PERCEPT-SIDE of record**: `pwSnapshot =
match.perceivedSnapshot(p, pwScope)` (`PlayerBrain.ts:1269`, read at `:1274`/`:1275`) —
already private, already aged, nothing to interpose. It is counted and classed, not dropped.
⚠ NAMED OPEN ITEM: `opponents`/`teammates`/`players`/`outfield` (81 sites) are local
bindings; whether each derives from one of the three named world collections is NOT audited by
a text census — it is a read of the call graph, and IN-T0 must do it before it can claim those
sites are covered by the same interposition.

### §R-FIX.5 THE THREE Match.ts RESTART/WALL READS, CLASSED EXPLICITLY

No more file-granular hand-waving on these three: they are **world-owned referee/setup
judgements**, not decisions a body makes, and no snapshot interposes at them.

1. **The goal-kick line walk-back** (`~:4364-4370`, `r.kind === 'goalKick'` branch: `o.pos.x`
   clamped to `line - 0.3`, `o.vel.x *= 0.2`): the REFEREE walks campers back behind the
   offside line during setup — the world WRITING bodies, not a body reading another body to
   decide, so a private snapshot of where the referee put you would be a bug, not a feature.
2. **Wall readiness** (`~:4425`, `dist(this.allPlayers[gid].pos, wallCenter) < 4`): the world
   asks whether the free-kick wall has formed, to decide if the restart may be taken early — a
   RESTART-LEGALITY judgement made with ground truth, which must not be degraded by any body's
   perception.
3. **Wall slot count** (`~:4472`, `dist(this.allPlayers[gid].pos, slots[i]) < 1.5`): the same
   setup clock counts how many wall members have reached their assigned slots before releasing
   the kick — world-owned setup bookkeeping, ground truth by construction, outside the surface.

### §R-FIX.6 THE RECOMMENDATION, RESTATED AT THE CORRECTED MAGNITUDES

The QUALITATIVE form survives untouched (#317 item 1) and only the arithmetic moves.
**THE SURFACE IS STILL BOUNDED, AND STILL SMALLER AT THE GATEWAY THAN AT THE READS**: **255**
other-body truth reads (chooser 178 · executor 77) across **23** files sit downstream of
**79** sites where the three named world collections are handed out — a **3.2×** reduction
(the void numbers said 215 vs 42, 5.1×; the ratio shrank, the argument did not). **NOT a
stage-stop.** IN-T0 interposes a per-reader snapshot view where `team.players` /
`opp.players` / `match.allPlayers` are handed in, starting at the CARRIER's pass chooser, and
inherits one honest piece of homework the fix exposed: the 81 further truth-bearing gateway
sites bound to `opponents`/`teammates`/`players`/`outfield` must be traced to their source
collection (call-graph read, not text) before the interposition can be called complete.
Physics keeps ground truth at **330** other-body sites by M-IN.1 — unchanged as a rule, larger
as a number.

## §COMMANDER CORRECTIONS OF RECORD, SECOND SERIES (ruling #319, 2026-08-19 — on §R-FIX)

1. **THE NUMBERS OF RECORD**: 1,490 occurrences · 255 interpose sites (chooser 178 /
   executor 77, 23 files) · named-collection gateways 79 · percept-side 40 · the +2/+1
   vs the verifier's scan = interpolation-code reads, enumerated by site. The frozen
   §R1–§R7 static numbers stay VOID; read §R-FIX.
2. `rawBytes = 2,214,491` counts UTF-16 CODE UNITS, not bytes (true UTF-8: 2,240,954 —
   the recurring unit-name class, struck again). A RED run of the fix probe OVERWRITES
   the artifact of record (self-labelling via gates/allGreen + exit 1 — mitigated;
   future probes write red artifacts to a side path). `gOracleDiscriminates` proves
   "the naive arm CAN fail", not "the arms differ" (the discrimination is carried by
   gStrippedCorpusStructurallySound, which does go red). §R-FIX's "at HEAD 02299c2" =
   the parent (the landed commit is 17a3019); the per-file line totals are
   split('\n') counts (wc -l + 1).
3. **IN-T0 HOMEWORK OF RECORD**: 81 truth-bearing gateway sites bound to local aliases
   (opponents/teammates/players/outfield) need CALL-GRAPH provenance before the
   interposition is complete — a text census cannot see it; §R-FIX.4 carries the list.
