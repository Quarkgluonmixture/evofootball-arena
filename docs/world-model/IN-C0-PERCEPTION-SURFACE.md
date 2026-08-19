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

*(filled by the result commit; the freeze commit ends at PART I.)*
