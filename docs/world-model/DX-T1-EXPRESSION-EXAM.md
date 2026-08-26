# DX-T1 — THE EXPRESSION EXAM (脑子会选,现在腿也会踢 —— 那球场变好了吗?)

> **The GC-T2 composition in BOTH arms, SHUT vs ARMED on `dxWindupAim` ALONE.**
> Authorized by **COMMANDER RULING #353 item 4**; bound by
> [`DX-DELIVERY-EXECUTION-CONTRACT.md`](DX-DELIVERY-EXECUTION-CONTRACT.md) §3. The seam is
> [`DX-T0-WINDUP-AIM-SEAM.md`](DX-T0-WINDUP-AIM-SEAM.md) (seam `f3fa820` → receipts `c388716`
> → rider `85dca23`), whose §COMMANDER CORRECTIONS (#353) item 2 ORDERS the deposit-side
> behavioural pin into THIS §P and whose item 1 tells this instrument where the carry lives.
> Predecessor: [`GC-T2-POWER-EXTENSION.md`](GC-T2-POWER-EXTENSION.md) (freeze `be42ac4` →
> results; artifact `docs/world-model/data/gc-t2-power-extension.json`), which supplies BOTH
> arms' composition, the sizing variances AND the re-aim signature's different-battery context.
> Instrument: `scripts/probes/dx-t1-expression-exam.ts`.
> Artifact: `docs/world-model/data/dx-t1-expression-exam.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5,
> implemented as the instrument's own line).
>
> **THIS STAGE SHIPS NOTHING.** `dxWindupAim`, `bkGroundCorridor`, `dlcDeliveryChoice` and
> `dlcStrikePlane` all stay default OFF and **absent from `a4World.ts` at every version**
> (re-asserted at battery time by `gSeamSitesPinned`); the production fingerprint
> `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved. ⛔
> **X-SRC-ZERO**: no file under `src/` is edited — the probe arms every flag IN-INSTRUMENT, as
> construction flags on its own `Match`.

## §0 WHAT THIS EXAM IS, AND WHAT IT IS NOT

Three stages built one sentence: **DLC** made alternative lines exist, **GC** made blocked lines
cost, and **DX-T0** made the body able to strike the alternative. GC-T2 then found, at power,
that the price alone **suppresses**: ground passes fell **2.31875** a match, resolved, and the
blocked mass mostly did not come back as clear passes (**174 of 2,029**). The reason it could
not come back was named in the same document: `O1-WINDUP-PRECEDENCE` — over **73,079** wind-up
decisions the wound-up pass's own aim was displaced on **exactly zero** of them, because the
wind-up branch threw the elected point away.

**THIS EXAM, in one sentence**: the SAME composition, the SAME predicates, ⛔ not one of them
re-cut — with the wound-up kick now able to strike the point the chooser already elected, and
the suppression face asked again.

⛔ **IT IS NOT A NEW MECHANISM AND NOT A REDESIGN.** No candidate is added, no scoring term, no
gene, no flight physics — DX-T0's door only changes WHICH POINT the already-shipped kick is
struck toward. The graded-hazard door (GC contract §4) stays shut; the weight, curl and lofted
slices (contract §3) are not opened here.

---

# §P PRE-REGISTRATION (frozen at the FREEZE COMMIT, BEFORE any battery seed was read)

## §CORRECTIONS-READ — every canon sentence COPIED from [`CANON.md`](CANON.md), never re-typed

Per ruling #301 item 2's mechanism fix: the ledger is where a brief copies from. ⚠ Per **#342
item 3** (the MED-1 lesson), a constraint that binds this executor beyond the ruling's own
sentences is cited as **"the dispatch brief"**, never as the ruling.

| canon, verbatim | its home | how it binds here |
| --- | --- | --- |
| freeze-before-battery — freeze the instrument commit BEFORE the battery; artifact records the instrument hash (paraphrase) | **ruling #266.3(c)** | COMMIT 1 lands this §P + the probe; the artifact records `instrumentSha256` and `headAtRun`. **No battery seed was walked before it.** |
| *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* | **PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1** | `BODY_SCHEMA` is the 22-key allowlist (GC-T2's 20 plus `depositPin` and `seasonLadder`); `hashedBodySha256` is computed LAST, over the final gate values |
| mutant liveness — every gate conjunct provably alive, exactly-one enforced, or the probe refuses to run (paraphrase) | **ruling #268.3(a)** | `gPriceFires` gates the price's EVALUATION (the corrected form, #334 item 4), `gArmsDiverge` gates the bite, `gAlternativesLive` gates the DLC machinery's delivery, `gDepositCarriesElection` gates the arm→record→release identity, and **`gN` can fail on BOTH of its arms** (§N) |
| per-seed cells — per-seed/per-cluster cells stored so every headline re-derives (paraphrase) | **ruling #282.2(ii)** | `perSeedCells` stores BOTH arms' full rows per cell, all 800 of them — and the sensitivity face is computed from nothing else. The season ladder stores its own per-generation cells the same way |
| *"the re-derivation gate covers EVERY published face; a percentile face requires stored bins"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4** | `gFaces` re-derives every face, every Δ point estimate, every stored bin table, the composition relations, the quotations, the SIZING rows, the SENSITIVITY rows, **the DEPOSIT PIN's counts**, **the SEASON LADDER's aggregates and slopes** and the VERDICT itself off the SERIALIZED artifact |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | every `…PerMatch` face is on the 240 s match clock; every `…Share` is a share of its own named denominator; `…Metres` is metres |
| *"a src-extracted constant pins its extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"* | **BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1** | the shell, the open-lane line and `KICK_COOLDOWN` are anchored with occurrence counts and line receipts; this exam introduces **no constant of its own** |
| *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1** | `gSeamSitesPinned` re-asserts at battery time: ONE `bkGroundCorridor` fork, ONE pricer statement, ONE hazard call, ONE definition, ONE `dlcDeliveryChoice` fork, ONE `dlcStrikePlane` fork, ONE PRECEDENCE GUARD, **ONE `dxWindupAim` fork, ONE arm-time consumption gate, ONE plumb-through, ONE `armPendingPass` definition and ONE call site, ONE deposit write**, and ZERO of the four doors in `a4World.ts` |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every number in §R below is a FIELD of the committed artifact at source precision |
| *"a starred finding states its \|Δ\|÷half-width ratio"* | **BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2** | every paired Δ publishes `absDeltaOverHalfWidth` |
| *"a scored face's walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate proves arithmetic, not definitions"*; REFINED at #334 item 2 | **DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2** (+ **BK-T3 §CORR item 2**) | `klassOf` · `isDelivery` · `isGroundLaunch` · `isMeasurableGroundPass` are PURE functions called by BOTH the walk and a published fixture table, gated by `gWalkFixtures`. **They are GC-T2's, byte for byte.** |
| *"a dose-source guard should hash the bytes it reads, not a self-declared field"* | **BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6** | BK-C2's **and GC-T2's** quoted numbers are READ out of their committed artifacts with the bytes hashed first, never re-typed from prose. **The sizing inputs are in that class** (§N) |
| ⭐ provenance hashes are COPIED from the artifact's own field, never from a terminal scroll-back (paraphrase) | **ruling #345 item 1 (the standing order)** | GC-T2's `hashedBodySha256` is published by COPYING that field out of its artifact; the file's own BYTE hash is published separately and re-checked by `gFaces` |
| ⭐⭐ **dose placement** — *"dose NEVER in info.genome; truth-dosing writes census values through the shipped writer."* (paraphrase); ratified form = the match-local-copy idiom PLUS an info.genome-cleanliness world conjunct | **ruling #270.2** (+ #334 item 1) | unchanged from GC-T2 §P1: both genes on MATCH-LOCAL views only, `gGenomeClean` proves the franchise object carries NEITHER — **and the SEASON LADDER carries the same conjunct** (`gLadderClean`) |
| ⭐ the geneOk VALUE-check order | **GC-T1-GROUND-CORRIDOR-EXAM.md §COMMANDER CORRECTIONS item 2** (the #345 rider) | `gGeneValuePinned` checks BOTH genes **by VALUE** on BOTH match-local views of BOTH teams, every walked match, and reads the DLC gene back through the SHIPPED `passLeadSupportWeight` map on the receipts |
| ⭐⭐ **composition proof** — *"any world arming a new seam alongside the CB/L3 stack proves the doors/lifecycle at THAT composition first."* (paraphrase) | **BU contract M-BU.2 (ruling #285)** | re-run in full at §P11 on **this** exam's own scratch seeds — DX × the GC-T2 composition is UNMEASURED, and inheritance is not proof |
| *"arming receipts, not football findings"* (receipts ≠ effect sizes) | **ruling #289 item 1** (+ BU-T1 §CORR item 5) | every composition relation, the deposit pin's counts, `strikeAttributionCompleteness`, `priceEvalNonZeroShare` and the world receipts are labelled INSTRUMENT RECEIPTS wherever they appear |
| *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* | **PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6** | the COMPOSITION PROOF walks **900,000,700–702** and the PREFLIGHT SMOKE walked **900,000,800–802** (its ladder league **900,000,850**) only |
| seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record (paraphrase) | the standing frontier practice (**rulings #286 item 5 onward**) | `gSeedsBookedEqualWalked` compares the CELLS' OWN distinct-seed set to the booked list, checks every walked seed is inside the block, **and checks every ladder LEAGUE seed is inside it too** |
| clock honesty — every rate on the 240 s match clock or dual-axis (1 sim-s = 22.5 display-s); APPLIED values, never nominal (paraphrase) | **ruling #280.2(iii)** + PC-T2 §CORR item 3 | every per-match count carries the clock in its unit string; §人话 opens with the dual-clock declaration (#339) |
| *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; …)"* | **ruling #283.2(iv)** | this probe builds `Match` DIRECTLY and never round-trips a League, so no worker fixture is generated |

## §P1 THE ARMS — THE GC-T2 COMPOSITION IN BOTH, ONE CONSTRUCTION FLAG APART

| arm | construction | `dxWindupAim` | `bkGroundCorridor` | `dlcDeliveryChoice` | `dlcStrikePlane` | `dvExposureWeight` | `passLeadSupport` |
|---|---|---|---|---|---|---|---|
| ⭐ **`shut`** | `a4MatchFlags(11)` + both DLC doors + `bkGroundCorridor` + `armA4World(m, null, 11)` + the gene | **false** | true | true | true | **0.5** | **1** |
| ⭐ **`armed`** | THE SAME, plus `dxWindupAim: true` | **true** | true | true | true | **0.5** | **1** |

* **THE WORLD'S OWN COMPOSER IS CALLED, NEVER COPIED** — `a4MatchFlags(CORRIDOR_WORLD_VERSION)`
  is the substrate and the four doors are the only literals. `gArmsIsolated` compares the two
  constructed worlds AS OBJECTS over `a4MatchFlags(11)`'s own key set plus the four doors, and
  requires the difference set to be **exactly `['dxWindupAim']`**.
* ⭐⭐ **NEITHER THE DLC AXIS NOR THE GROUND PRICE DIFFERS BETWEEN THE ARMS** — asserted off the
  REAL constructed matches by `gWorld` (`bkGroundCorridor` TRUE in both, both DLC doors TRUE in
  both), never merely stated.
* **SHARED VIRGIN SEEDS, PAIRED WALKS**: every seed is walked by both arms and the bootstrap
  CLUSTER IS THE CELL, so every Δ below is paired by construction.
* **`passLeadSupport` is pinned at 1** (DLC-T1's own `PTP_GENE_MAX`, the value its CONTEST arms
  used) and **`dvExposureWeight` at world 11's own 0.5** in BOTH arms. ⛔ **NO WEIGHT LADDER ON
  EITHER AXIS IN THE BATTERY.** Per-cell `geneOk` is a **VALUE** check.

## §P2 ⭐⭐ WHERE THE CARRY IS READ FROM — AND WHY GC-T2's OWN INSTRUMENT WOULD READ ZERO

**DX-T0 §COMMANDER CORRECTIONS (#353) item 1 and §HONESTY 8 bind this section.** The door does
**not** touch the wind-up record's `aim` field — `armPendingPass` still writes
`aim: { x: mate.pos.x, y: mate.pos.y }`. The elected displacement rides a NEW field,
`pendingPassWindup.aimLead`, and no ledger counter was added (§DEV 3 of that stage). So:

* GC-T1B's and GC-T2's displacement instrument — *the record's own `aim` against the target's
  PRE-STEP position* — **would still read exactly zero in BOTH arms**, and reporting it alone
  would silently hide the whole door.
* **THE FROZEN DEFINITION OF A DISPLACED DECISION, THEREFORE, IS THE UNION OF TWO COMPONENTS**:
  (i) **the CARRIED election** — `pendingPassWindup.aimLead` non-null with non-zero magnitude;
  (ii) **the LEGACY aim-field read** — GC-T2's own instrument, byte for byte.
  In a `dxWindupAim`-SHUT arm (i) is identically zero, so `altDisplacedShare` **collapses
  EXACTLY to GC-T2's face** and reads its structural zero. Both components are ALSO published
  alone (`altCarriedShare`, `altAimFieldDisplacedShare`), and the composition proof asserts
  `O1-WINDUP-AIM-FIELD-UNMOVED` — the legacy read stays zero in every world, armed included.

## §P3 H-DX.1(a) ⭐⭐ THE DOOR EXPRESSES — `altDisplacedShare` LEAVES ZERO RESOLVEDLY

> **FROZEN RULE.** In the **ARMED** arm, `altDisplacedShare` on WIND-UP flights leaves zero
> **RESOLVEDLY**: the **PAIRED per-cell bootstrap Δ (`armed` − `shut`)** has its **95 % interval
> ENTIRELY ABOVE ZERO** *and* the **ARMED arm's own 95 % interval** has its **LOWER EDGE ABOVE
> ZERO**. Both conjuncts, or (a) FAILS.

* The denominator is **wind-up-seat measured ground passes**: the release-tick one-touch bypass
  has no wind-up seat and its aim is the target's own position BY CONSTRUCTION, so it enters
  neither side of the ratio (GC-T2 §8A's own scoping, inherited).
* ⚠ **THE FACE IS A USAGE SHARE, NEVER A DECLINE RATE** — DLC-T1s's #243 item 1 retraction rides
  in full: an undisplaced kick may be a declined LIVE alternative or a DEGENERATE one, and this
  instrument cannot separate them.
* ⛔ **THIS FACE HAS NO VARIANCE SOURCE AND §N SAYS SO** (see §N's `unsizableFaces`): GC-T2
  published it at exactly 0 with a zero-width interval in both arms. (a) is therefore a
  **STRUCTURAL / LIVENESS resolution** — *does the door express at all, resolvedly* — and NOT a
  powered estimate of a magnitude. **Said here, before the battery.**

## §P4 H-DX.1(b) ⭐ NON-INFERIORITY — THE BAND, FROM THIS EXAM'S OWN SHUT ARM

> **FROZEN RULE, GC-T1B §P4 / GC-T2 §P4's construction VERBATIM.**
> `armed.groundPassesPerMatch`'s point estimate sits **AT OR ABOVE THIS EXAM'S OWN `shut` ARM'S
> 95 % interval's LOWER EDGE**.

* **THE BAND IS DERIVED FROM THIS BATTERY'S OWN CONTROL ARM** — **no taste constant**, and **not
  GC-T2's 78.9125**, which belongs to a different block and a different treatment. The band is
  `faces['shut.groundPassesPerMatch'].ci95[0]`, computed by the same bootstrap as every other
  interval and published beside the verdict.
* ⚠⚠ **THIS IS THE GC-T2 SUPPRESSION FACE RE-ASKED WITH EXPRESSION POSSIBLE**, and it is asked
  at the same n, so it is exactly as hard as it was there. GC-T2 FAILED it on both readings
  (level and Δ). **A pass here would be the arc's claim; a fail here is the arc's pause.**
* **THE UNIT IS PER MATCH** on the engine's own 240 s match clock (one row = one match).
* **REPORTED BESIDE IT, GATED BY NOTHING**: `passCompletion` · `possessionSpellSeconds` ·
  `possessionFlipsPerMatch` · `flipsCaromLastContactShare` · `deliveriesPerMatch` ·
  `goalsPerMatch` · `shotsPerMatch`.

## §P5 H-DX.1(c) ⭐ THE STRIKE FACES DO NOT WORSEN · H-DX.1(d) THE LOFTED CONTROLS

> **(c) FROZEN RULE — THE NON-WORSENING FORM, STATED EXACTLY.** For **each** of
> `groundStrikesPerMatch`, `teammateStrikesPerMatch` and `caromedGroundOnOpenLaneShare`: the
> **PAIRED Δ (`armed` − `shut`) 95 % interval's UPPER EDGE** lies **AT OR BELOW the
> NON-WORSENING MARGIN**, where the margin is **THIS exam's own `shut` arm's 95 % interval
> HALF-WIDTH for that face**.

* ⭐ **WHY THAT MARGIN AND NOT A CONSTANT**: (b)'s frozen band is `shut point − shut half-width`,
  i.e. `Δ ≥ −hw(shut)`. (c) is the SAME construction mirrored onto the worsening direction:
  `Δ ≤ +hw(shut)`. **The margin is a measurement of this battery's own control arm, never a
  taste constant** (#200), and it is published per face beside the verdict.
* ⚠ **A NON-WORSENING TEST IS NOT AN IMPROVEMENT TEST.** Passing (c) says the interval does not
  reach past the margin; it does **not** say the strike faces fell. Whether they fell is read
  off the same published Δs, and is REPORTED, not gated.
* ⭐⭐ **EACH FACE IS REPORTED WITH ITS LEAVE-ONE-OUT SENSITIVITY** (#346 item 1's standing
  order, re-affirmed by #348) — see §P6B. ⚠ In the LOO redraw the **margin is held at the
  full-n shut arm's**: the sensitivity face asks *"does one seed carry the Δ"*, not *"does one
  seed move the margin"*.

> **(d) FROZEN RULE, GC-T2 §P5's VERBATIM.** Each lofted-family control's **ARMED point estimate
> lies INSIDE THIS EXAM'S OWN `shut` arm's 95 % interval** [lo, hi]:
> `loftedDeliveriesPerMatch` · `crossesPerMatch`.

⚠⚠ **(d) IS NOT A CLEAN CONTROL AND #348 §CORR 1 SAYS SO OUT LOUD.** At GC-T2 the lofted control
passed its level test by **0.00125** under the upper edge and the verifier's independent
bootstrap stream excluded zero on its Δ — the face sits ON the resolution boundary and its
status is RNG-stream-sensitive. It is carried here unchanged **because the conjunct form is not
re-cut**, and it is read with that limit attached. **THE CONTROLS ALSO CANNOT SEPARATE "NOT
PRICED" FROM "NOT SUBSTITUTED INTO"** (GC-T1 §P5, inherited).

## §P5B ⭐⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN — ORDERED INTO THIS §P BY THE #353 RIDER

**DX-T0 §COMMANDER CORRECTIONS (#353) item 2, quoted**: *"a captured armed-world decision must
assert `pendingPassWindup.aimLead` equals the elected candidate's own displacement — closing the
one link currently held by a source-text pin alone (the fork line, pinned
character-for-character)."*

**THE PIN, FROZEN** (`gDepositCarriesElection`, plus the composition relation `DX-DEPOSIT-PIN`):
a wrapper on the match's own `armPendingPass` reads `match.dxStrikeAim` **before** the call —
the value the ONE fork deposited, with the seam's own gid+tick eligibility applied — delegates
with the **identical arguments**, then reads `pendingPassWindup.aimLead`. A second wrapper on
`resolvePendingPassWindup` captures the record's `aimLead` and the `performPass` wrapper asserts
the release received exactly it. The law:

* **armed ∧ an eligible deposit ⇒ `aimLead` EQUALS it, component for component**;
* **otherwise ⇒ `aimLead` is EXACTLY `null`** (the certified path);
* **the release hands `performPass` that same record value**;
* **ZERO mismatches**, in every arm and every composition world.

⚠ **PURE OBSERVATION**: both wrappers delegate unchanged, and the composition proof's
**G-LOCKSTEP** relation walks every world with them ABSENT and requires a **byte-identical
whole-match signature**.

⛔ **THE NON-VACUITY OF THE CARRIED CASE (`depCarriedOk > 0`) IS GATED ON THE SCRATCH COMPOSITION
PROOF ONLY, NEVER ON THE BATTERY.** Gating the battery on *"the door carried something"* would
make H-DX.1(a) unfailable-in-artifact — **a gate must not read the result it is meant to leave
free**. The battery arm of the gate asserts only the identity and the shut arm's structural
emptiness.

## §P6 ⭐ REPORTED, NEVER GATED — THE RE-AIM SIGNATURE AND THE REST

* ⭐⭐ **THE RE-AIM SIGNATURE, GC-T1B §P6's OWN PRE-REGISTERED READING RULE RE-APPLIED VERBATIM.**
  The `jointLaneOpenByShellBlocked` cells (`[laneOpen, laneContested]` × `[shellBlocked,
  shellClear]`) per arm, their within-pair cell differences, the blocked/clear column deltas, and
  `groundPassesPerMatch` + `deliveriesPerMatch` beside them. **The reading rule, stated before
  the battery (GC-T1B's words, unchanged)**: *a RE-AIM signature is blocked mass falling while
  the CLEAR column RISES and the delivery volume holds; a SUPPRESSION signature is blocked mass
  falling with the clear column flat and the deliveries falling too.* GC-T2's published cells are
  quoted beside ours as ⚠ **DIFFERENT-BATTERY CONTEXT** — different block, and its arm axis is
  TRUE in **both** of these arms.
* **THE USAGE SHARES** (GC-T2 §P6's two instruments, unchanged: `ledDeliveredShare` and
  `ledDeliveredShareSupportScoped`, plus this exam's `altCarriedShare` /
  `altAimFieldDisplacedShare` / `altDisplacedShareSupportScoped`, ⛔ **usage, never a decline
  rate** — DLC-T1s's #243 item 1 retraction rides in full).
* **completion + possession spells** · **the interception decomposition** · **goals/shots** ·
  **the strike anatomy split** (`bySideTeammateOpponentNoFlight`) · **perf** (§P7).
* ⭐ **THE SEASON LADDER** (§P6C).

## §P6B ⭐⭐ THE LEAVE-ONE-OUT SENSITIVITY FACE — PRE-REGISTERED, REPORTED, GATED BY NOTHING

**RULING #346 item 1's standing order, verbatim in substance**: *"A future exam pre-registers an
outlier-sensitivity face (leave-one-out influence, REPORTED) alongside its primary faces."*

For **every scored face** — (a)'s face, (b)'s face, **all three of (c)'s** and **both** (d)
controls (7 rows) — the artifact publishes:

1. **THE INFLUENCE CENSUS** — all n cells are examined; the cell whose removal moves the scored
   statistic FURTHEST is named (`maxInfluenceSeed`), with the movement (`maxInfluence`) and its
   share of the full Δ (`influenceShareOfDelta`).
2. **THE LEAVE-THAT-ONE-OUT RE-BOOTSTRAP** — run with **this exam's own estimator** on n − 1
   cells (2,000 draws, its own rng stream seeded from `BLOCK_BASE + 1`). For a resolution face
   that is the Δ interval (and, for (a), the armed arm's own interval too); for a level face
   ((b), (d)) it is the SHUT band **and** the ARMED point, both recomputed without that cell.
3. **`conjunctFlips`** — whether the **FROZEN predicate** reads differently on the LOO draw.

> ⛔⛔ **NO SCORING GATE READS THIS FACE, AND NOTHING IS TRIMMED** (#348 §CORR 3's standing
> phrasing: `gFaces` re-derives its arithmetic, but no conjunct consults it). The primary faces
> are the **FULL-n UNTRIMMED** readings and they alone carry H-DX.1's verdict. No seed is ever
> dropped from a published face. A face that flips is reported as **FRAGILE** — it is not
> re-scored, re-cut, or quietly upgraded.

## §P6C ⭐ THE SEASON LADDER — REPORTED, THE HOUSE FORM, THE DLC GENE EVOLVABLE

The dispatch brief orders it: *the season ladder (probe-side, the DLC gene evolvable, goals ×
generation per the house form, match-local dose idiom + info.genome-cleanliness conjunct)*. The
BK-T4 §10 / DF-C0 §R4 house ladder, with the gene axis re-pointed at the **DLC gene
`passLeadSupport`**:

* **`geneAbsent`** — `evolvePassLeadSupport` FALSE: the gene stays STRUCTURALLY ABSENT for every
  generation. THE CONTROL.
* **`geneEvolvable`** — TRUE: the gene may enter through the SHIPPED `mutateGenome` /
  `crossoverGenomes` opt-in. ⛔ **NOTHING IS PRE-SEEDED and NO VALUE IS EVER SET BY HAND.**
* **BOTH arms walk THE ARMED WORLD** (the GC-T2 composition + `dxWindupAim`), so the door is open
  in both and the only question is whether a coach who plays the alternative line can SPREAD.
* 10 clubs · 20 generations · 45 fixtures a generation · **4 league seeds from THIS block**
  (12,527,990–993); every ladder MATCH seed is derived from them through the SHIPPED `hashSeed`,
  the `League.createMatch` idiom. Selection = `evolveGroup`'s band law mirrored (elite 2 · reborn
  2 · mutate {0.4, 0.08} · reborn {0.5, 0.15}) — the MT-T2 precedent, because
  `League.finishSeason` calls the shipped mutators with hard-coded options.
* ⚠ **THE NEUTRAL-DRIFT SHADOW rides the control arm**: inert passengers mutated by the SAME law
  in their OWN rng namespace and inherited through the SAME assignments. They touch no match, so
  they are what the gene level looks like with ZERO selection on it — the honest null for *"did
  selection ADOPT it"*.
* ⭐ **THE DOSE IDIOM AND THE CLEANLINESS CONJUNCT** (`gLadderClean`): `armA4World` writes
  `dvExposureWeight` on MATCH-LOCAL views only; the franchise `info.genome` carries **no exposure
  weight on any ladder match**, and **no `passLeadSupport` at all in the CONTROL arm**.
* ⛔ **NO H-DX.1 CONJUNCT READS ANY LADDER NUMBER.** Faces: goals × generation (the house form),
  shots, pass completion, interceptions, long balls, and the gene's own level / above-zero share
  / fitness correlation, plus the early(1–5)→late(17–20) goals slope per arm.

## §P7 THE PERF FACE — GC-T1 §P7's METHOD, INHERITED VERBATIM

`wallSecondsPerMatch`, per arm. **METHOD**: each walk is timed end to end (`Date.now()` around
the walk); the two arms are walked **BACK TO BACK on the same seed** (shut first, armed second),
so scheduler and thermal drift are spread across both arms rather than concentrated in one; the
face is Σ wall seconds ÷ walks, and its paired Δ is published like any other.

⚠ **WHAT IT MEASURES AND WHAT IT DOES NOT.** The timed region is the **WALK**, not the engine
alone: the observer's own `laneOpenness` and `groundShellHazard` reads, the `performPass` trace
**and this exam's two deposit-pin wrappers** sit inside it **in EVERY arm**, so the **DIFFERENCE**
is the armed door's cost and the **LEVEL** is not the game's frame cost. It is a **MACHINE
reading on one machine**, never a portable number.

## §P8 THE GATES (frozen; a red gate is REPORTED, never patched, and ROUTES THE ARTIFACT)

`gWorld` · `gArmsIsolated` · `gSharedSeeds` · `gAnchoredConstants` · `gSeamSitesPinned` ·
`gWalkFixtures` · `gStrikeLedgerAgrees` · `gStrikeAttributionComplete` · `gJointPartition` ·
`gPriceFires` · `gArmsDiverge` · `gQuotationsFaithful` · **`gN`** · `gGenomeClean` ·
`gGeneValuePinned` · `gCompositionProof` · `gAlternativesLive` · `gNonVacuous` · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · **`gDepositCarriesElection`** · **`gLadderClean`** · `gFaces` —
**23 gates** (GC-T2's 21 plus the deposit pin and the ladder's hygiene).

1. ⭐⭐ **NO GATE THAT CANNOT FAIL** (#334 item 3). There is deliberately **no `gStatsZero`**: a
   hardcoded `true` is not a gate. Zero registry statistics are drawn anywhere in this file and
   the stats ledger is a **FIELD** (`stats.consumed = 0`).
2. ⭐⭐ **NO TAUTOLOGICAL GATE, AND NO GATE ON A DIRECTION.** `gPriceFires` is the corrected
   liveness form (#334 item 4); `gArmsDiverge` requires only that SOME paired cell differ (a bite
   receipt); `gAlternativesLive` requires only that the DLC machinery DELIVER a non-zero lead
   somewhere in every arm. **No gate asks any face to move in any direction**, ⛔ no scoring gate
   reads the sensitivity face, and ⛔ **no gate reads whether the door carried anything in the
   battery** (§P5B).
3. ⭐⭐ **`gN` HAS TWO ARMS AND NO BYPASS — THE #348 §CORR 2 ORDER, IMPLEMENTED.** *"Future power
   gates close the escape (the override mode gets its own gate arm, never a bypass)."* Here:
   * **THE FROZEN ARM** (no override env at all): the battery **must have run at exactly
     `N_FROZEN`**, on top of the derivation conjuncts below.
   * **THE OVERRIDE ARM** (`DXT1_MODE=smoke` / `DXT1_N` / `DXT1_LADDER` set): the override must
     be **DECLARED** (the reasons are a published field), the walked n must **equal the n the
     override itself declared**, and the artifact must sit **OFF every canonical path** (a
     separate FATAL refusal enforces the last one at start-up).
   ⛔ Setting an env var does not make the gate pass; it moves the gate onto a **different,
   equally falsifiable** set of conjuncts whose artifact **can never be the artifact of record**.
   The derivation conjuncts, common to both arms and each able to fail: a drifted sizing source
   (the quoted deltas no longer match GC-T2's hashed bytes), a sizing accessor that no longer
   reproduces GC-T2's published Δ exactly, a robust point that no longer reproduces GC-T2's
   published `looDelta` / `maxInfluenceSeed` exactly, or an `N_FROZEN` that is not the capped max
   requirement.
4. **`gFaces` FROM DISK** covers every published face, every Δ point estimate, every stored bin
   table, the composition relations, both quotations, **every SIZING row's arithmetic**, **every
   SENSITIVITY row's point estimates and flip flag**, **the DEPOSIT PIN's counts**, **the SEASON
   LADDER's per-generation aggregates and its goals slopes**, and **the VERDICT ITSELF** (the four
   conjuncts are re-evaluated from the serialized faces and deltas and compared to the published
   verdict).
5. **BOOKED = WALKED FROM THE CELLS** (#335 item 4): `gSeedsBookedEqualWalked` derives the walked
   set from the CELLS' own distinct seeds, checks the count against the booked list, checks the
   walk arithmetic, checks every walked seed **and every ladder league seed** lies inside the
   authorized block, and checks every composition seed is out-of-band scratch.
6. ⭐ **THE RED-ROUTING IDIOM, IN CODE** (#334 item 5): `outPath = ALL_GREEN ? OUT : OUT +
   '.RED.json'` is the instrument's own line, evaluated after `gFaces`.

## §N ⭐⭐ THE SIZING, SHOWN — n FROM GC-T2's OWN PUBLISHED VARIANCES AT ITS ROBUST MAGNITUDES

**The house form** (DV-T1B §N / DF-T3B / GC-T2 §N, applied face by face). Every input is a
**FIELD** of `docs/world-model/data/gc-t2-power-extension.json`, read from bytes that are
**hashed first**; `gN` reds if the source artifact has drifted.

```text
1  half-width   = (ci95[1] − ci95[0]) / 2                     ← GC-T2's PUBLISHED field
2  se(800)      = half-width / z.975      (z.975 = 1.959963985)
3  se(needed)   = |target| / (z.975 + z.80)   (z.80 = 0.8416212336; sum = 2.8015852186)
4  N            = ceil( 800 · (se(800) / se(needed))² )
```

Step 4 uses the fact that a **paired cluster** bootstrap's SE scales as `1/√N` in the number of
**clusters**, and here the cluster IS the match seed.

⭐ **EVERY TARGET MAGNITUDE IS GC-T2's OUTLIER-ROBUST POINT** — its own leave-one-out Δ,
**RE-DERIVED IN-PROBE from GC-T2's stored cells** (find the max-single-seed-influence cell,
recompute the paired point without it), never re-typed from its prose; `gN` proves the accessors
are the same definitions by requiring them to reproduce GC-T2's **published full-sample Δ** AND
its **published `looDelta` and `maxInfluenceSeed`** exactly.

| face | conjunct | GC-T2 hw | se(800) | target magnitude (robust) | se(needed) | **N required** |
|---|---|---:|---:|---:|---:|---:|
| `groundPassesPerMatch` | **(b)** | 0.815 | 0.41582397 | **−2.37296621** | 0.84700840 | **193** |
| `groundStrikesPerMatch` | **(c) face 1** | 0.61 | 0.31123021 | **−0.73717146** | 0.26312655 | **1120** |
| `teammateStrikesPerMatch` | **(c) face 2** | 0.40375 | 0.20599868 | **−0.59699625** | 0.21309230 | **748** |
| `caromedGroundOnOpenLaneShare` | **(c) face 3** | 0.01168361 | 0.00596114 | **+0.00606300** | 0.00216413 | **6070** |
| `loftedDeliveriesPerMatch` | **(d) control 1** | 0.190625 | 0.09725944 | **+0.15018773** | 0.05360812 | **2634** |
| `crossesPerMatch` | **(d) control 2** | 0.1525 | 0.07780755 | **+0.07759700** | 0.02769753 | **6314** |

**N required (max) = 6,314. The block holds 1,000 seeds and the sub-band split caps the battery
at 800 pairs. So the cap BINDS and**

> ### ⛔ **N_FROZEN = 800 PAIRED SEEDS — AND FOUR OF THE SIX SIZED FACES CANNOT BE BOUGHT INSIDE ONE BLOCK. SAID HERE, BEFORE THE BATTERY.**

| face | conjunct | N required | **MDE at n = 800** | resolvable at 800? |
|---|---|---:|---:|---|
| `groundPassesPerMatch` | (b) | 193 | **1.16496628** | ✅ **YES** — the robust magnitude 2.373 clears it |
| `teammateStrikesPerMatch` | (c) face 2 | 748 | **0.57712287** | ✅ **YES** — 0.597 clears it, barely |
| `groundStrikesPerMatch` | (c) face 1 | **1120** | **0.87193795** | ❌ **NO** — needs **1.4 blocks** |
| `caromedGroundOnOpenLaneShare` | (c) face 3 | **6070** | **0.01670063** | ❌ **NO** — needs **7.6 blocks** |
| `loftedDeliveriesPerMatch` | (d) control 1 | **2634** | **0.27248061** | ❌ **NO** — needs **3.3 blocks** |
| `crossesPerMatch` | (d) control 2 | **6314** | **0.21798449** | ❌ **NO** — needs **7.9 blocks** |

⛔ **AND ONE SCORED FACE CANNOT BE SIZED AT ALL**: `altDisplacedShare`, conjunct **(a)**. GC-T2
published it at **exactly 0** in both arms (0 / 37,450 shut and 0 / 35,629 armed) with a
**zero-width interval**, so there is no variance to size against. **(a) is scored as a
STRUCTURAL / LIVENESS resolution, not as a powered estimate of a magnitude**, and that is stated
here rather than discovered afterwards.

**WHAT THAT MEANS FOR THE VERDICT, PRE-COMMITTED**: the four ❌ rows are declared **UNDERPOWERED
HERE**. Whatever they read, **a non-resolution on them is NOT evidence of no effect** — it is a
sample-size statement, and the honest next step for any of them is a further block, not a
re-cut. ⛔ **The predicates are NOT relaxed to compensate. Never promise power you do not have.**

⚠⚠ **AND (c)'s AND (d)'s PREDICATES ARE NOT Δ-RESOLUTION TESTS.** (c) is a NON-WORSENING test
against a within-battery margin and (d) is a LEVEL test against a within-battery band; the N
column above sizes the **Δ** for each face, which is the honest way to say *"how big an effect
could this block see at all"*, and it is **not** the same question as the frozen predicate. Both
readings are published.

⚠ **WHAT THIS RULE ASSUMES, DECLARED.** That this battery's per-seed cluster variance is
GC-T2's. Same composition, same estimator, the same walk-side predicates — but a **DIFFERENT ARM
AXIS** (GC-T2 varied `bkGroundCorridor`, which is TRUE in **both** arms here) and **different
seeds**, so it is a **strictly weaker assumption than GC-T2's own was**. Because `N_SOURCE` and
`N_FROZEN` are both 800, the **ex-ante expected Δ half-width for every row is GC-T2's own
half-width, unchanged** (0.815 · 0.61 · 0.40375 · 0.01168361 · 0.190625 · 0.1525) — the probe
publishes them beside the **realised** ones so the reader can see whether it held.

⚠ **AND WHAT IT DOES NOT CLAIM.** Resolving an estimate is not the same as the estimate being
real, and 80 % power is 80 % power: a face sized at its target can still fail to resolve one time
in five even if the target is exactly true.

## §P9 SEEDS, SIZING AND STATS

* **BLOCK 12,527,000–999**, opened by #353 item 4 and **consumed WHOLE of record**. The sub-band
  split, declared here:
  * ⭐ **the SCORED pair** = **12,527,000–799** (**800** seeds × 2 arms = **1,600 walks**);
  * ⭐ **the SEASON LADDER** = **12,527,990–993** (**4 LEAGUE seeds**; every ladder MATCH seed is
    derived from them through the SHIPPED `hashSeed`, so no further block seed is consumed);
  * **world-construction receipts** = **12,527,999**, one per arm (**2 constructions**);
  * **BOOKED = WALKED**: `gSeedsBookedEqualWalked` requires **1,602** against 800 distinct
    scored seeds, plus every ladder league seed inside the block.
* **OUT-OF-BAND SCRATCH ONLY** (canon: verifier scratch seeds): the COMPOSITION PROOF and the
  DEPOSIT PIN walk **900,000,700–702** (7 worlds × 2 trace states × 3 seeds = **42 walks**) and
  the PREFLIGHT SMOKE walked **900,000,800–802** with its ladder league at **900,000,850**.
  **No battery seed was walked before this freeze.**
* **SIZING**: §N, from GC-T2's published variances. ⛔ **NO SIZING SMOKE WAS RUN** — this exam
  does not need one, because the variance it sizes against is a published field rather than a
  scratch estimate.
* **STATS CONSUMED: ZERO.** Every interval — primary and leave-one-out alike — is a percentile
  bootstrap over the WALKED CELLS (the IN-T0 / DF-T2 / IN-T1 / BK-C1 / BK-C2 / GC-T1 / GC-T1B /
  GC-T2 precedent, #329 item 4), not a registry-consuming statistic. Next stats base remains ≥
  **117,600**, registry of record **73**.

## §P10 HONEST LIMITS, STATED BEFORE THE BATTERY

1. ⛔⛔ **ONE SCORED FACE IS UNSIZABLE AND FOUR SIZED ONES ARE UNDERPOWERED, AND §N NAMES THEM
   ALL.** A non-resolution on any of them is a SAMPLE-SIZE statement, not evidence of no effect.
2. ⚠⚠ **THE CARRY MUST BE READ FROM `pendingPassWindup.aimLead`** (§P2): the record's `aim` field
   is byte-untouched, so GC-T2's own instrument still reads zero in both arms. The legacy read is
   published separately and asserted zero as a composition relation.
3. ⚠⚠ **NO EXECUTION-ERROR MODEL EXISTS** (contract §4 / DX-T0 §HONESTY 3). Expression without
   error makes the body MORE precise than a human. A named door, not smuggled — and it means a
   pass here is a statement about *this* substrate, not about football's own accuracy.
4. ⚠ **"THE STRUCK POINT IS THE ELECTED POINT" IS EXACT ONLY WHERE THE INCUMBENT STRIKE-TIME
   CORRECTION IS ZERO** (DX-T0 §HONESTY 1), and **the aim is the ARM-TIME election, which can be
   W ticks stale** (§HONESTY 2). Both inherited unchanged, neither re-argued.
5. ⚠ **THE DOOR CANNOT EXPRESS AN ELECTION THE SYNCHRONOUS PATH WOULD NOT HAVE STRUCK** (DX-T0
   §HONESTY 4): both guards are the shipped statement's own.
6. ⚠⚠ **THE FROZEN PRECEDENCE LAW STILL MAKES THE K = 9 GRID STRUCTURALLY INERT IN THESE ARMS**
   (measured again at §P11's `G-PRECEDENCE.dx`). The alternatives the verdict is about are **the
   two-point contest's led candidates**.
7. ⚠ **BOTH BATTERY GENES ARE PINNED** (0.5 and 1). No ladder on either axis in the battery; the
   season ladder is a SEPARATE, REPORTED ecology and no conjunct reads it.
8. ⚠ **THE USAGE SHARES ARE NOT DECLINE RATES** (DLC-T1s's #243 retraction rides in full).
9. ⚠⚠ **(d) IS NOT A CLEAN CONTROL** (#348 §CORR 1, quoted at §P5), and it cannot separate "not
   priced" from "not substituted into" (GC-T1 §P5).
10. ⚠ **THE INTERCEPTION DECOMPOSITION IS TEMPORAL, NOT CAUSAL** (BK-C2 §P.7's own warning).
11. ⚠ **THE PERF FACE IS A MACHINE READING** (§P7), not a portable cost — and this exam's timed
    region carries two extra observation wrappers, in both arms.
12. ⚠ **THIS EXAM'S SHUT ARM IS NOT GC-T2's SHUT ARM** (different block; and GC-T2's arm axis is
    TRUE in both of these arms) and it is not BK-C2's `w11` world. Every quotation from either is
    labelled DIFFERENT-BATTERY CONTEXT, and **no Δ is computed across batteries**.
13. ⚠ **THE SIZING RULE ASSUMES GC-T2's PER-SEED VARIANCE UNDER A DIFFERENT TREATMENT** (§N).
14. ⚠ **THE SENSITIVITY FACE IS A ONE-OUT FACE, NOT A ROBUSTNESS THEORY.** It answers "does the
    single most influential seed carry this verdict?"; it does not answer "do the two most
    influential", and it is not a trimmed estimator.
15. ⚠ **THE SEASON LADDER IS ONE PROBE-SIDE ECOLOGY** (10 clubs × 20 generations × 4 leagues),
    not the shipped League, and its goals slope carries no interval here.

## §P11 ⭐⭐ THE COMPOSITION PROOF — RE-RUN, NOT INHERITED

Canon's own form. Seven worlds are constructed and walked to completion on the scratch seeds
**900,000,700–702**, twice each (traced / untraced), and compared by **WHOLE-MATCH SIGNATURE**
(tick · score · phase · ball · rng stream state · every body's pos/vel/heading/stamina). ⭐ Every
one of them carries the GC-T2 composition's own ground price, because the composition that must
be proven is **DX × THAT stack**:

| world | construction | relation |
|---|---|---|
| `shutRef` | world 11 + GC + both DLC doors, gene 1, dx OFF | the SCORED shut arm's world — the reference |
| `armedRef` | + `dxWindupAim` | ≠ `shutRef` — ⭐ **G-BITE.dx** (⚠ an arming receipt, never an effect size) |
| `noDlcShut` | world 11 + GC, no DLC door, gene ABSENT, dx OFF | the G-INERT reference |
| `noDlcArmed` | + `dxWindupAim` | ≡ `noDlcShut` — ⭐⭐ **G-INERT.dx** (DX-T0 §R2's claim RE-MEASURED at THIS composition) |
| `dlcZeroShut` | world 11 + GC + both doors, gene **0**, dx OFF | the zero-dose reference |
| `dlcZeroArmed` | + `dxWindupAim` | ≡ `dlcZeroShut` — ⭐ **G-ZERO.dx** (at gene 0 no displaced election wins, so the door has nothing to carry) |
| `contestOnlyArmed` | `dlcDeliveryChoice` ALONE, gene 1, dx ON | ≡ `armedRef` — ⭐⭐ **G-PRECEDENCE.dx** |

Plus **LIFECYCLE**, **CANDIDATES-FORM**, ⭐ **G-LOCKSTEP** (the `performPass` trace **and both
deposit-pin wrappers** are INERT — byte-identical signatures traced vs untraced),
⭐ **WINDUP-CHANNEL-LIVE** (no identity above is an identity between two worlds in which nothing
happened), ⭐⭐ **DX-EXPRESSION** (the wind-up record carries a non-zero elected displacement in
the armed world on every scratch seed, and on **exactly zero** decisions in every dx-OFF world —
`O1-WINDUP-PRECEDENCE` shown to be a property **of the shut door** rather than of the engine),
⭐ **O1-WINDUP-AIM-FIELD-UNMOVED** and ⭐⭐ **DX-DEPOSIT-PIN** (§P5B).

⚠ **THESE ARE ARMING RECEIPTS, NEVER FOOTBALL FINDINGS**, and `gCompositionProof` is red if any
relation fails. **They are re-run here rather than inherited: inheritance is not proof.**

## §DEV-PREFLIGHT — the ONE thing seen before the freeze, disclosed HERE (GC-T2 §DEV 2's form)

⚠⚠ **A 3-SEED PREFLIGHT SMOKE ON SCRATCH SEEDS 900,000,800–802 (ladder league 900,000,850, 2
generations) WAS RUN AND ITS NUMBERS WERE SEEN**, to prove the instrument runs and all 23 gates
are reachable. All 23 read GREEN on it. It read (3 seeds, so pure noise, and quoted here only
because I saw it): `altDisplacedShare` shut **0** → armed **0.177632**, Δ **+0.177632**
[+0.117647, +0.214286] · `altAimFieldDisplacedShare` **0** in both arms ·
`groundPassesPerMatch` Δ **−13.666667** · `groundStrikesPerMatch` Δ **−20** ·
`teammateStrikesPerMatch` Δ **−10.333333** · `caromedGroundOnOpenLaneShare` Δ **−0.106061** ·
`loftedDeliveriesPerMatch` Δ **−1** · `crossesPerMatch` Δ **+0.333333**; H-DX.1 read
(a) PASS · (b) FAIL · (c) PASS · (d) PASS on it. The deposit pin read: shut 164 captures / 0
carried / 0 mismatches, armed 153 captures / 27 carried / 0 mismatches.

⚠ **AND ONE ENGINE ODDITY WAS SEEN AND IS DISCLOSED RATHER THAN GLOSSED**: on scratch seed
900,000,801 the ARMED cell ledgered **1,220** body strikes in one match (against 21–68 in every
other cell), with only 13 of them on a live ground flight. The walk's own count agreed with the
engine's ledger exactly (`gStrikeLedgerAgrees` green, zero unattributed), so it is a real engine
state on a scratch seed and not an instrument fault. **It is named here because it is the kind of
tail the battery may contain, and because the leave-one-out sensitivity face exists for exactly
that.** ⛔ **NOT ONE PREDICATE, AND NOT `N_FROZEN`, WAS RE-CUT ON THE STRENGTH OF THAT SIGHT** —
`N_FROZEN` comes from §N's arithmetic over GC-T2's published fields alone, and every conjunct
form was written above before the smoke ran. If a conjunct fails on the battery, that failure is
the result.

---

<!-- ⛔ NOTHING ABOVE THIS MARKER IS EDITED AFTER THE FREEZE COMMIT. -->

# RESULTS

> Freeze `324c9c2` → this commit. **23/23 GATES GREEN**, so the artifact sits at the **CANONICAL
> path** `docs/world-model/data/dx-t1-expression-exam.json` (the red-routing branch was live and
> not taken). **1,602 battery walks** (800 seeds × 2 arms + 2 world-construction receipts)
> **+ 42 composition-proof scratch walks + 7,200 season-ladder matches**;
> `perf.batteryWallSeconds` **177.64**, `seasonLadder.wallSeconds` **688.227**.
> `gFaces` re-derived **98/98** face-and-Δ checks and **67/67** stored-bin / composition /
> quotation / **sizing** / **sensitivity** / **deposit-pin** / **ladder** / **verdict** checks off
> the serialized artifact, 0 failures; **30/30** walk-side fixtures pass.
> `hashedBodySha256 = 708445faf6000318883f0d6f014399ad214beed31fc071f7ddf5ca239aca2496`;
> `instrumentSha256 = d94e890e7f2edb28f45775082c8f185940adea07887ef8e456c0883c9f059d71`;
> `headAtRun = 324c9c2c2c0a4d65e91ac80f854680f723c15fb1`.
> `attributedStrikes ÷ ledgerAppliedStrikes` = **1** in BOTH arms — ⚠ an instrument receipt,
> never a football finding.
>
> ⭐ **EVERY NUMBER BELOW IS A QUOTED ARTIFACT FIELD AT SOURCE PRECISION** (canon: doc-prose
> fidelity). No number in this section is computed here; where two faces are compared, both are
> quoted with their intervals and the comparison is stated in words.

## §R0 THE VERDICT, IN ONE LINE

**H-DX.1 FAILS AS A CONJUNCTION — AND THE SPLIT IS THE FINDING: (a) ⭐⭐ PASS (the door
expresses, overwhelmingly — the 30,318 / 73,079-zero fact is dead) · (b) ⛔ FAIL (the ground
volume falls FURTHER, resolved) · (c) ⛔ FAIL as a conjunction, 2 of 3 faces holding and both
of those falling resolvedly · (d) PASS.**

The wound-up pass now strikes the elected point on **13.014 %** of wind-up-seat measured ground
passes (**4,504 / 34,609**) against **exactly 0 / 35,850** in the shut arm, an interval **31.35
half-widths** clear of zero. And the body it stops hitting is real: attributed ground-flight
strikes fall **−1.83** a match with the whole interval below zero, teammate strikes fall
**−0.90875**, likewise. ⛔ But **the ground game does not hold**: `groundPassesPerMatch`
**77.55125 → 75.845** against a band of **76.67**, with the paired Δ **−1.70625** [−2.51125,
−0.89375] at **2.11** half-widths — **expression does NOT cure the suppression; at this
composition it deepens it.** And the third strike face, `caromedGroundOnOpenLaneShare`, fails
the frozen non-worsening rule on WIDTH rather than on movement. ⛔ Reported exactly as frozen.
Nothing is re-cut.

## §R1 ⭐⭐ THE SIZING, CHECKED AGAINST WHAT IT BOUGHT

`gN` GREEN on its **FROZEN arm** (no override env was set; `ranAtFrozenN` **true**). `nFrozen`
**800**, `capBinds` **true**. The §N arithmetic is re-derived from disk by `gFaces` (six rows,
every step), and each robust point reproduced GC-T2's published `looDelta` and
`maxInfluenceSeed` exactly.

Because `N_SOURCE` and `N_FROZEN` are both 800, the ex-ante expected Δ half-width for each row
IS GC-T2's own half-width:

| face | ex-ante EXPECTED Δ half-width | ⭐ REALISED Δ half-width | did the assumption hold? |
|---|---:|---:|---|
| `groundPassesPerMatch` (b) | **0.815** | **0.80875** | held |
| `groundStrikesPerMatch` (c) f1 | **0.61** | **1.02375** | ⚠ **WORSE than assumed** (×1.68) |
| `teammateStrikesPerMatch` (c) f2 | **0.40375** | **0.6475** | ⚠ **WORSE than assumed** (×1.60) |
| `caromedGroundOnOpenLaneShare` (c) f3 | **0.01168361** | **0.01251635** | held (slightly worse) |
| `loftedDeliveriesPerMatch` (d) c1 | **0.190625** | **0.2025** | held |
| `crossesPerMatch` (d) c2 | **0.1525** | **0.159375** | held |

⚠⚠ **THE TWO STRIKE-COUNT ROWS CAME BACK NOISIER THAN THE SOURCE, AND THAT IS THE HONEST
COUNTERPART OF GC-T2 §R1's LESSON.** GC-T2 sized off a battery whose outlier had **inflated**
those variances and got a conservative projection; this exam sizes off GC-T2's own **clean**
battery and the ARMED arm here contains its own heavy tail (the preflight already showed one
scratch match ledgering 1,220 strikes — §DEV-PREFLIGHT named it before the run). **Sizing off a
quiet battery under-buys**, exactly as GC-T2 §DOUBTS 6 said it would cut. Both faces still
resolved below zero, so the shortfall did not bind — but it is stated rather than glossed.

⛔ **THE DECLARED SHORTFALLS SURVIVE**: (c) face 3 needed **6,070** pairs and (d)'s two controls
**2,634** and **6,314**; all three were declared UNDERPOWERED at §N BEFORE the battery, and (c)
face 3's failure below is precisely a width failure at that declared shortfall.

## §R2 H-DX.1(a) ⭐⭐ THE DOOR EXPRESSES — AND IT IS THE STRONGEST READING IN THE ARC ✅

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw | above 0? |
|---|---|---|---|---|---|---|
| ⭐⭐ `altDisplacedShare` | **0** [0, 0] (0/35850) | **0.13014** [0.12612, 0.134422] (4504/34609) | **+0.13014** | [**+0.12612**, +0.134422] | **31.35** | ✅ |
| `altCarriedShare` | **0** [0, 0] | **0.13014** [0.12612, 0.134422] | **+0.13014** | [+0.12612, +0.134422] | **31.35** | ✅ |
| ⚠ `altAimFieldDisplacedShare` | **0** [0, 0] | **0** [0, 0] | **0** | [0, 0] | — | — |
| `altDisplacedShareSupportScoped` | — | — | **+0.464634** | [+0.454432, +0.474691] | **45.869** | ✅ |

**(a) PASSES ON BOTH ITS CONJUNCTS** — the Δ interval and the armed arm's own interval are both
entirely above zero. ⭐⭐ **THE 30,318-ZERO FACT IS DEAD**: GC-T1B measured `altDisplacedShare`
= 0 over 30,318 wind-up decisions and GC-T2 over 73,079, and the reason was the wind-up branch,
not the chooser. With the door armed, **13.014 %** of wind-up-seat measured ground passes carry
the elected displacement, and **on the DLC seats' own support scope the share is 46.46 points
higher than shut**.

⭐ **AND THE THIRD ROW IS WHY §P2 EXISTS.** `altAimFieldDisplacedShare` — GC-T2's OWN instrument,
the record's `aim` against the target's pre-step position — reads **exactly 0 in BOTH arms**,
34,609 and 35,850 decisions. Had this exam inherited that instrument unexamined it would have
published "the door does nothing" while the door was carrying 4,504 elected aims. The
composition relation `O1-WINDUP-AIM-FIELD-UNMOVED` asserts the same thing in every one of the
seven scratch worlds.

**HOW FAR THE BODY RE-AIMS**: `meanCarriedLeadMetres` **6.968225** [6.868516, 7.071261] m, over
4,504 carrying decisions; the carried-lead histogram's median bin lower edge is **6** m (bins
`[19, 39, 74, 92, 117, 148, 169, 241, 238, 245, 254, 249, 2619]`, 0.5 m wide, last bin the ≥ 6 m
overflow). ⚠ A moving denominator (carrying decisions only) — disclosed.

⭐ **THE SENSITIVITY FACE**: max single-seed influence **0.00039419** (seed **12,527,799**,
`influenceShareOfDelta` **0.003029**); LOO Δ **0.129745** [0.125747, 0.134023] — **no flip**.

## §R3 H-DX.1(b) ⛔ THE GROUND VOLUME FALLS FURTHER — THE HEADLINE

> Frozen band = **THIS EXAM'S OWN** shut arm's 95 % interval LOWER EDGE, **76.67** ground passes
> per match. Armed point estimate: **75.845** — **BELOW IT.**

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⛔ `groundPassesPerMatch` | **77.55125** [76.67, 78.5175] (62041/800) | **75.845** [74.9125, 76.7175] (60676/800) | **−1.70625** | [−2.51125, **−0.89375**] | **2.11** |

**(b) FAILS ON BOTH READINGS AT ONCE — the level test AND the Δ.** §N sized this face at 193
pairs and it is the one row that was comfortably powered; the Δ resolves **2.11 half-widths**
below zero. The sensitivity face agrees: max influence **0.05668805** (seed **12,527,016**,
share **0.033224**), LOO Δ **−1.649562** [−2.46433, −0.77597] — **no flip**.

⭐⭐ **AND THE §P6 RE-AIM SIGNATURE, READ AGAINST GC-T1B's OWN PRE-REGISTERED RULE, READS
SUPPRESSION WITH NO RE-AIM COMPONENT AT ALL.** `jointLaneOpenByShellBlocked`, rows
`[laneOpen, laneContested]` × cols `[shellBlocked, shellClear]`, over every measured ground pass:

| arm | measured | open·blocked | open·clear | contested·blocked | contested·clear |
|---|---|---|---|---|---|
| `shut` | 62041 | **6231** | 34472 | 9547 | 11791 |
| `armed` | 60676 | **5793** | 34006 | 9234 | 11643 |

⚠ FIELDS of `reAimSignature.byPair[0]`, re-derived by `gFaces` from the cells above:
`cellDeltas` **[[−438, −466], [−313, −148]]** · `blockedColumnDelta` **−751** ·
`clearColumnDelta` **−614** · `measuredGroundPassDelta` **−1365** · `deliveriesDelta` **−1295**.

**THE RULE, FROZEN BEFORE THE BATTERY** (GC-T1B's words, unchanged): *a RE-AIM signature is
blocked mass falling while the CLEAR column RISES and the delivery volume holds; a SUPPRESSION
signature is blocked mass falling with the clear column flat and the deliveries falling too.*
**The blocked column falls 751; the clear column falls 614 as well; and the delivery volume does
NOT hold** (`deliveriesPerMatch` **82.68375** [81.85625, 83.56] → **81.065** [80.2175, 81.885],
Δ **−1.61875** [−2.33875, **−0.90875**], **2.264** half-widths — resolved down). ⭐ **THE
SIGNATURE READS PURE SUPPRESSION.** ⚠ GC-T2's own cells, as DIFFERENT-BATTERY CONTEXT: blocked
**−2029** with clear **+174** and deliveries resolved down — its arm axis was the ground price,
which is TRUE in **both** of these arms, so no Δ is computed between them and none is implied.

**REPORTED BESIDE (b), GATED BY NOTHING:**

| face | shut | armed | Δ ci95 |
|---|---|---|---|
| ⛔ `passCompletion` | **0.590707** [0.586945, 0.594381] | **0.580483** [0.576564, 0.584245] | [−0.015112, **−0.005355**] (**2.096** hw) |
| `possessionSpellSeconds` | **4.396808** [4.351635, 4.441598] | **4.419799** [4.373183, 4.46529] | [−0.032236, +0.080827] |
| ⛔ `goalsPerMatch` | **3.35375** [3.2375, 3.47375] | **3.11375** [2.9925, 3.23875] | [−0.39, **−0.0775**] (**1.536** hw) |
| ⛔ `interceptionsPerMatch` | **28.29375** [27.8675, 28.7325] | **27.4725** [27.05875, 27.89625] | [−1.29125, **−0.3825**] (**1.807** hw) |
| ⛔ `groundCaromRate` | **0.167148** [0.16406, 0.170211] | **0.161464** [0.158395, 0.164739] | [−0.00955, **−0.001681**] (**1.444** hw) |
| `priceEvalNonZeroShare` | **0.254316** [0.250793, 0.258085] | **0.24766** [0.244192, 0.250988] | — |

⚠⚠ **THE POSSESSION FAMILY IS NOT FLAT THIS TIME, AND THAT IS THE UNCOMFORTABLE PART.** Pass
completion falls **1.02 points** resolved, and goals fall **0.24 a match** resolved. GC-T2's
same-family faces were all unresolved. ⭐ **THE STORY THE NUMBERS ARE CONSISTENT WITH — AND DO
NOT ESTABLISH**: a wound-up ball struck **6.97 m** into space ahead of a moving teammate arrives
harder to control than a ball struck at his feet, so the re-aimed delivery COMPLETES LESS, and
the chooser (which is not re-run after the wind-up, DX-T0 §HONESTY 2) cannot see the W-tick
staleness it is now committing to. ⭐ 有故事就要有探针: **this is a LABELLED HYPOTHESIS**, and
the probe that would settle it — a completion split by carried-vs-uncarried delivery at the same
decision — is **unbuilt**. The two candidate mechanisms it would separate are the **execution
error** the contract's §4 door names and the **staleness** §HONESTY 2 names, and this exam
cannot tell them apart.

## §R4 H-DX.1(c) ⛔ FAILS 2-OF-3 · H-DX.1(d) THE LOFTED CONTROLS HOLD ✅

> **(c)'s frozen form**: the paired Δ's 95 % UPPER edge ≤ THIS exam's own shut arm's 95 %
> half-width for that face.

| face | shut | armed | paired Δ | Δ ci95 | margin | verdict |
|---|---|---|---|---|---|---|
| ⭐ `groundStrikesPerMatch` | **17.28375** [16.41625, 18.2425] | **15.45375** [14.98, 15.99] | **−1.83** | [−2.865, **−0.8175**] | 0.913125 | ✅ **DOES NOT WORSEN — and falls resolvedly** (1.788 hw) |
| ⭐ `teammateStrikesPerMatch` | **7.2675** [6.73875, 7.8875] | **6.35875** [6.06, 6.67] | **−0.90875** | [−1.60125, **−0.30625**] | 0.574375 | ✅ **DOES NOT WORSEN — and falls resolvedly** (1.403 hw) |
| ⛔ `caromedGroundOnOpenLaneShare` | **0.49325** [0.482874, 0.503242] | **0.495152** [0.485386, 0.504919] | **+0.001902** | [−0.010369, **+0.014664**] | **0.010184** | ❌ **FAILS** — the upper edge exceeds the margin |

⭐⭐ **TWO OF THE THREE STRIKE FACES DO NOT MERELY HOLD — THEY FALL, RESOLVEDLY, AND THIS IS THE
FIRST TIME IN THE ARC THAT EXPRESSION RATHER THAN PRICE HAS MOVED THEM.** Body strikes on a
ground flight fall **1.83 a match** and strikes on the passer's own teammate fall **0.90875**,
both with the whole interval below zero, both robust to leave-one-out (f1: max influence
**0.31310388**, seed 12,527,752, share **0.171095**, LOO Δ **−1.516896** [−2.365457,
−0.705882]; f2: **0.17408166**, same seed, share **0.191562**, LOO Δ **−0.734668** [−1.284105,
−0.22403]) — **no flips**. The anatomy agrees: `bySideTeammateOpponentNoFlight` **[5814, 8574,
6634]** → **[5087, 7850, 5783]** — every bucket falls, and `strikesPerMatch` (ALL attributed
strikes) falls **−2.8775** [−4.6425, −1.12875], **1.638** half-widths.

⛔ **AND THE THIRD FACE FAILS ON WIDTH, NOT ON MOVEMENT — SAID PLAINLY.** Its point estimate is
**+0.001902**, **0.152** half-widths, thoroughly unresolved; the interval simply reaches
**+0.014664**, past a margin of **0.010184**. §N declared this face needed **6,070** pairs
BEFORE the battery and named its MDE at **0.01670063**. So the honest reading is: **the frozen
predicate reads FAIL, and what it is telling us is that 800 pairs cannot certify this face's
non-worsening either way.** ⛔ It is reported as a FAIL because that is what was frozen; it is
**not** evidence that the stale-map share worsened. The sensitivity face agrees on the
non-resolution (max influence **0.00087231**, seed 12,527,100, share **0.458669** — ⚠ the
largest influence share anywhere in this exam, on the one face whose Δ is essentially zero, so
the share is a small number over a smaller one; LOO Δ **0.00103** [−0.011682, +0.013365], no
flip).

| control | shut ci95 (the band) | armed point | inside? |
|---|---|---|---|
| `loftedDeliveriesPerMatch` | **5.1325** [4.96875, **5.29375**] | **5.22** | ✅ |
| `crossesPerMatch` | **3.66125** [**3.53**, 3.78625] | **3.56** | ✅ (**0.03** above the LOWER edge) |

**(d) PASSES**, and both Δs are unresolved (`loftedDeliveriesPerMatch` **+0.0875** [−0.11375,
+0.29125], **0.432** hw; `crossesPerMatch` **−0.10125** [−0.26, +0.05875], **0.635** hw). ⚠⚠
**DECLARED LOUDLY, AS AT §P5: THE CROSSES CONTROL PASSES BY 0.03 OF A CROSS PER MATCH**, this
time near the LOWER edge (GC-T2's near-miss was the lofted control at the UPPER edge). #348
§CORR 1's warning rides in full: **(d) is not a clean control**, its boundary status is
RNG-stream-sensitive, and §P5's limit — it cannot separate "not priced" from "not substituted
into" — stands. ⭐ The one thing the two controls do say together is that the lofted family did
**not** absorb the missing ground volume: ground passes fall 1.71 a match while lofted
deliveries and crosses both stay inside their bands.

## §R5 ⭐⭐ THE LEAVE-ONE-OUT SENSITIVITY FACE — NOT ONE SCORED FACE FLIPS

⛔ **REPORTED; NO SCORING GATE READS IT AND NOTHING IS TRIMMED** (`gFaces` re-derives its
arithmetic — #348 §CORR 3's standing phrasing). `anyScoredFaceFlips` = **false**;
`facesThatFlip` = **[]**. Each row's max-influence cell is found over **all 800 cells**, and the
leave-that-one-out re-bootstrap is 2,000 draws on 799 cells, rng seeded from **12,527,001**.

| conjunct | face | max-influence seed | `maxInfluence` | share of Δ | LOO reading | primary | LOO | flips? |
|---|---|---|---:|---:|---|---|---|---|
| (a) | `altDisplacedShare` | 12,527,799 | **0.00039419** | **0.003029** | Δ **0.129745** [0.125747, 0.134023] | PASS | PASS | **no** |
| (b) | `groundPassesPerMatch` | 12,527,016 | **0.05668805** | **0.033224** | Δ **−1.649562** [−2.46433, −0.77597] | FAIL | FAIL | **no** |
| (c) f1 | `groundStrikesPerMatch` | 12,527,752 | **0.31310388** | **0.171095** | Δ **−1.516896** [−2.365457, −0.705882] | PASS | PASS | **no** |
| (c) f2 | `teammateStrikesPerMatch` | 12,527,752 | **0.17408166** | **0.191562** | Δ **−0.734668** [−1.284105, −0.22403] | PASS | PASS | **no** |
| (c) f3 | `caromedGroundOnOpenLaneShare` | 12,527,100 | **0.00087231** | **0.458669** | Δ **0.00103** [−0.011682, +0.013365] | FAIL | FAIL | **no** |
| (d) c1 | `loftedDeliveriesPerMatch` | 12,527,694 | **0.01741239** | **0.198999** | shut band recomputed, armed **0.070088** Δ | PASS | PASS | **no** |
| (d) c2 | `crossesPerMatch` | 12,527,536 | **0.01013924** | **0.100141** | Δ **−0.111389** [−0.271589, +0.045056] | PASS | PASS | **no** |

⚠ **THE LIMIT §P10 item 14 DECLARED RIDES IN FULL**: this is a ONE-out face. It answers "does the
single most influential seed carry this verdict?" — not "do the two most influential", and it is
not a trimmed estimator. No seed was dropped from any published face.

## §R6 ⭐⭐ THE DEPOSIT-SIDE BEHAVIOURAL PIN — THE #353 RIDER, DISCHARGED

| arm | captures | carried & EQUAL | `null` as certified | ⛔ mismatches | resolves | ⛔ resolve mismatches |
|---|---:|---:|---:|---:|---:|---:|
| `shut` | **36206** | **0** | **36206** | **0** | **35825** | **0** |
| `armed` | **34927** | **4589** | **30338** | **0** | **34591** | **0** |

⭐⭐ **THE LINK DX-T0 HELD WITH A SOURCE-TEXT PIN ALONE IS NOW HELD BEHAVIOURALLY, 71,133 TIMES.**
On every captured decision in every walked match, `pendingPassWindup.aimLead` equalled the
displacement the ONE fork deposited — component for component — whenever the door was armed and
an eligible deposit existed, and was **exactly `null`** otherwise; and every release handed
`performPass` that same record value. **Zero mismatches**, and the shut arm carried **nothing**,
structurally. The same relation holds on all 42 composition-proof scratch walks
(`DX-DEPOSIT-PIN`), where the carried case is also proven NON-VACUOUS — the conjunct this
battery deliberately does **not** gate (§P5B).

⚠ Note the arithmetic that is NOT a football finding: 4,589 arm-time carries against 4,504
booked displaced decisions — the walk books a decision only when its flight is retired as a
MEASURED ground pass, so a carried wind-up that is cancelled, or whose release is not classified
measurable, is captured by the pin and not by the face. Both counts are published; neither is
derived from the other.

## §R7 ⭐ REPORTED — THE COMPOSITION PROOF, THE USAGE, THE PERF

**THE COMPOSITION PROOF — 11/11 RELATIONS HOLD, RE-RUN NOT INHERITED** (`gCompositionProof`
GREEN; 7 worlds × 2 trace states × 3 scratch seeds **900,000,700–702** = **42 walks**, compared
by whole-match signature). ⚠ ARMING RECEIPTS, NEVER FOOTBALL FINDINGS. `G-BITE.dx` ·
⭐⭐ `G-INERT.dx` · `G-ZERO.dx` · ⭐⭐ `G-PRECEDENCE.dx` · ⭐⭐ `DX-EXPRESSION` ·
⭐ `O1-WINDUP-AIM-FIELD-UNMOVED` · ⭐⭐ `DX-DEPOSIT-PIN` · `LIFECYCLE` · `CANDIDATES-FORM` ·
`G-LOCKSTEP` · `WINDUP-CHANNEL-LIVE`. **DX-T0's G-INERT claim reproduces at THIS composition**
(armed without a delivery-choice door is byte-identical to shut), the K = 9 grid is still
structurally inert beside the contest **with the door open**, and the wind-up seat's aim FIELD is
still displaced on exactly zero decisions in every world — while the armed world's records carry
elected displacements on every scratch seed.

**THE USAGE SHARES** (⛔ usage, never a decline rate — §P6's limit and DLC-T1s's #243 retraction
ride in full):

| arm | `performPass` calls | to a support target | led strikes (non-zero) | `ledDeliveredShare` | `ledDeliveredShareSupportScoped` | mean delivered lead (m) |
|---|---|---|---|---|---|---|
| `shut` | 54376 | 20041 | **883** | **0.016239** [0.015143, 0.017298] | **0.04406** [0.041166, 0.046978] | **6.328105** |
| `armed` | 52942 | 19623 | **5420** | **0.102376** [0.099337, 0.105577] | **0.254242** [0.247312, 0.261156] | **6.91897** |

⭐⭐ **THIS IS THE SAME FACT AS (a), SEEN FROM THE STRIKE SIDE**: the share of ground-pass strikes
the chooser handed a non-zero lead rises **+0.086137** [+0.083074, +0.089385] (**27.295** half-
widths), and on the DLC seats' own scope **+0.210183** [+0.202738, +0.217445] (**28.583**). ⚠ In
GC-T2 the same face was dead flat between its arms (Δ −0.00001597) because BOTH of its arms were
wind-up-shut. **The door did not make the chooser elect more alternatives — it let the ones it
already elected be struck.**

**THE PERF FACE (§P7's method):**

| arm | wall seconds total | walks | `wallSecondsPerMatch` |
|---|---|---|---|
| `shut` | **89.211** | 800 | **0.111514** [0.111031, 0.112086] |
| `armed` | **88.429** | 800 | **0.110536** [0.110107, 0.110979] |

Paired Δ **−0.000978** s [−0.001511, **−0.000489**], **1.912** half-widths — ⭐ **the armed world
is FASTER, resolved**, by about one millisecond a match on this machine. ⚠ Read §P7 before
quoting: the timed region is the WALK (observer reads, the `performPass` trace and this exam's
two deposit-pin wrappers included, in every arm), so the DIFFERENCE is the armed door's cost and
the LEVEL is not the game's frame cost. The most likely reason for a NEGATIVE cost is that the
armed world has **2.88 fewer body strikes a match** to resolve; ⚠ that is an inference, not a
measurement.

**THE SEAM'S OWN RECEIPT**: the production fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved (run on the
finished tree), and `dxWindupAim`, `bkGroundCorridor`, `dlcDeliveryChoice` and `dlcStrikePlane`
are still named by no world and no preset.

**PROVENANCE, COPIED FROM THE ARTIFACTS' OWN FIELDS** (the #345 item 1 standing order): GC-T2's
byte hash of record `8ca3cc90aa628c291a44c12e4ff25e205618ad8d1e79e7147c1317540fda0121` (this
artifact's `quotedContext.gcT2.source.sha256`) and GC-T2's own
`hashedBodySha256 = 80ab04ecbaf0280b86cefb4100eef935d442b629f699466834a8d6555c2a4ed2`
(`quotedContext.gcT2.hashedBodySha256`, which the probe reads out of GC-T2's artifact — **not**
from a terminal) · BK-C2's byte hash
`84a78ea92d895a0f3fc5afbf1af61ae0704a0527188cea7adb4411dc553cdcba`.

## §R8 ⭐ THE SEASON LADDER — REPORTED, GATED BY NOTHING AS FOOTBALL

`gLadderClean` GREEN: 800 ladder cells (2 arms × 4 leagues × 20 generations × 45 fixtures =
**7,200 matches**), every one of them the ARMED world, `doorWrong` **0** and `franchiseDirty`
**0** everywhere — the dose stayed match-local and the franchise genome carried no
`passLeadSupport` in the control arm.

| arm | gen 1 | gen 5 | gen 10 | gen 15 | gen 20 | goals slope (early 1–5 → late 17–20) |
|---|---:|---:|---:|---:|---:|---:|
| `geneAbsent` (control) | 3.25 | 3.772222 | 4.272222 | 4.177778 | **3.783333** | **+0.331111** (sd 0.189346) |
| `geneEvolvable` | 3.25 | 4.088889 | 4.022222 | 4.172222 | **4.138889** | **+0.586667** (sd **1.05333**) |

**THE GENE'S OWN AXIS** (`geneEvolvable`): league-mean `passLeadSupport` **0 → 0.06634141 →
0.11303336 → 0.14720407 → 0.22153498**, `geneAboveZeroShare` **0 → 0.45 → 0.725 → 0.8 → 0.85**,
and `fitnessGeneCorrelation` **−0.022695 → 0.15217 → 0.176401 → 0.227533**. The CONTROL arm's
NEUTRAL-DRIFT SHADOW — inert passengers mutated by the SAME law, touching no match — reads
**0 → 0.04757894 → 0.0762771 → 0.09446131 → 0.11253241**.

⭐ **THE READING, STATED WITH ITS LIMIT**: at generation 20 the evolvable gene sits at
**0.22153498** against a neutral drift of **0.11253241** — roughly **twice** what pure drift
produces — and the fitness correlation is positive and rising. **Selection appears to be
ADOPTING the delivery-choice gene in a world where the body can actually strike the alternative.**
⚠⚠ **AND THE HONEST BRAKE**: the goals slope carries **NO INTERVAL** here, its cross-league sd in
the evolvable arm (**1.05333**) is larger than the slope itself, and its four leagues disagree in
sign (**−0.502222, +0.115556, +0.773333, +1.96**). **Four leagues is not a measurement of
evolution; it is a first look.** ⛔ No H-DX.1 conjunct reads any number in this section.

## §R9 THE GATES

All twenty-three GREEN: `gWorld` (both arms world 11, the DLC axis and the ground price identical
across the pair) · `gArmsIsolated` (**the difference set is exactly `['dxWindupAim']`**) ·
`gSharedSeeds` · `gAnchoredConstants` · `gSeamSitesPinned` (ONE GC fork, ONE pricer statement,
ONE hazard call, ONE definition, ONE `dlcDeliveryChoice` fork, ONE `dlcStrikePlane` fork, ONE
PRECEDENCE GUARD, **ONE `dxWindupAim` fork, ONE arm-time consumption gate, ONE plumb-through, ONE
`armPendingPass` definition and ONE call site, ONE deposit write**, ZERO of the four doors in
`a4World.ts`) · `gWalkFixtures` (30/30) · `gStrikeLedgerAgrees` · `gStrikeAttributionComplete` ·
`gJointPartition` · `gPriceFires` · `gArmsDiverge` · `gQuotationsFaithful` · **`gN`** (the FROZEN
arm) · `gGenomeClean` · `gGeneValuePinned` · **`gCompositionProof`** (11/11) · `gAlternativesLive`
· `gNonVacuous` · `gSrcUntouched` · `gSeedsBookedEqualWalked` · **`gDepositCarriesElection`** ·
**`gLadderClean`** · `gFaces`.

## §R10 SEEDS AND STATS, AS CONSUMED

Block **12,527,000–999 CONSUMED WHOLE**: the SCORED pair **12,527,000–799** × 2 arms = **1,600
walks** (booked = walked, gated from the CELLS' own distinct-seed set: 800 distinct seeds, 800
paired rows) · the SEASON LADDER's **4 league seeds 12,527,990–993** (every ladder MATCH seed
derived from them through the SHIPPED `hashSeed`; **7,200 ladder matches**, no further block seed
consumed) · the **12,527,999** construction receipts, one per arm (**2**) — **1,602 booked battery
walks**. The COMPOSITION PROOF and the DEPOSIT PIN walked the out-of-band scratch range
**900,000,700–702** (**42 walks**) and the PREFLIGHT SMOKE walked **900,000,800–802** with its
ladder league at **900,000,850**; the bootstrap's own resample rng was seeded from **12,527,000**
and the leave-one-out resample's from **12,527,001**. **STATS CONSUMED: ZERO** — every interval,
primary and leave-one-out alike, is a percentile bootstrap over walked cells; registry of record
stays **73**, next stats base ≥ **117,600**, next sim ≥ **12,528,000** (⚠ derived bookkeeping —
block + 1,000 — not an artifact quotation).

## §DOUBTS (declared)

1. ⭐⭐⭐ **THE ARC'S TWO HALVES CAME APART, AND THAT IS THE MAIN RESULT.** *The body now does what
   the brain chose* — (a) passes at 31 half-widths and the strike faces fall resolvedly. *The
   ground game does not come back* — (b) fails, and it fails **worse** than a null: volume falls
   1.71 a match, completion falls a point, goals fall 0.24. ⛔ **Expression is not the cure for
   the GC suppression.** The DX contract's §-1 doctrine — that the seam artifact was what stood
   between election and execution — is **vindicated as a mechanism claim** and **not** vindicated
   as a football claim at this composition.
2. ⭐⭐ **THE RE-AIM SIGNATURE IS THE SHARPEST NEGATIVE.** GC-T2's clear column ROSE (+174 of
   2,029); here BOTH columns fall (−751 blocked, −614 clear). A world where the alternative can
   be struck plays FEWER ground passes on lines of every kind. ⚠ Within-battery statement of
   stored cells; no cross-battery Δ.
3. ⭐ **THE COMPLETION FALL IS A LABELLED HYPOTHESIS WITH A NAMED PROBE** (§R3): a 6.97 m lead
   struck at a stale, arm-time election may simply arrive worse. The two mechanisms — the
   contract §4 **execution-error** door and DX-T0 §HONESTY 2's **staleness** — are NOT separated
   by this exam, and the completion-by-carry split that would separate them is **unbuilt**.
4. ⛔ **(c) FAILED ON ONE FACE, AND THAT FACE FAILED ON WIDTH.** `caromedGroundOnOpenLaneShare`'s
   Δ is **+0.001902** at **0.152** half-widths — unresolved in every direction — and §N declared
   **6,070** pairs BEFORE the battery. The conjunct is reported FAIL because that is the frozen
   rule; it is **not** evidence that the stale-map share worsened. ⭐ This face has now been asked
   by GC-T1B, GC-T2 and DX-T1 and has **never once resolved**.
5. ⚠⚠ **THE SIZING UNDER-BOUGHT ON THE TWO STRIKE COUNTS** (§R1) — realised half-widths 1.68× and
   1.60× the projection, because the armed arm carries its own heavy tail. Both faces resolved
   anyway. ⭐ The reusable lesson, the mirror of GC-T2 §DOUBTS 6: **sizing off a quiet battery
   under-buys, exactly as sizing off an outlier-contaminated one over-buys.**
6. ⚠⚠ **(d) IS STILL NOT A CLEAN CONTROL** (#348 §CORR 1) and this time the CROSSES pass by
   **0.03**, near the LOWER edge. Read with §P5's limit.
7. ⭐ **THE PERF DIFFERENCE IS NEGATIVE** (−0.000978 s/match, 1.912 hw) — the armed world is
   cheaper, most likely because it has fewer strikes to resolve. ⚠ A machine reading on one
   machine, and the causal half is an inference.
8. ⭐⭐ **THE LADDER IS THE ONE PLACE THE DOOR LOOKS GOOD FOR THE ECOLOGY**: with the body able to
   strike the alternative, selection carries the delivery-choice gene to **0.2215** against a
   **0.1125** neutral drift, 85 % of clubs above zero, fitness correlation **+0.2275**. ⚠⚠ Four
   leagues, no interval, leagues disagreeing in sign on goals. **A first look, not a measurement.**
9. ⚠ **THE SENSITIVITY FACE IS ONE-OUT ONLY** (§P10 item 14), and nothing here is a robustness
   theory.
10. ⚠ **NO EXECUTION-ERROR MODEL, NO RE-DECISION AT `readyTick`, NO NEW PHYSICS** (§P10 items
    3–5). Every one of those is a named door this exam did not open, and item 3 in particular is
    the door §DOUBTS 3 points at.

## §DEV — the deviations, declared

1. ⭐⭐ **(c)'s NON-WORSENING FORM IS THIS EXAM'S OWN CONSTRUCTION, WRITTEN AT §P5 BEFORE THE
   BATTERY.** The dispatch named the form as a choice ("e.g. paired Δ upper bound") and required
   it frozen at §P; the margin chosen is (b)'s band construction mirrored onto the Δ scale, so it
   is a measurement of this battery's own control arm and **not a taste constant** (#200). It is
   published per face beside the verdict, and it is the reason (c) can fail on width — stated
   here so the next executor sees the trade the form makes.
2. ⭐⭐ **THE DISPLACEMENT FACE IS A UNION OF TWO COMPONENTS, NOT GC-T2's FACE UNCHANGED** (§P2).
   GC-T2's instrument alone would have read a structural zero in both arms and hidden the door
   entirely. Both components are also published alone, and the legacy component is asserted zero
   as a composition relation, so nothing about GC-T2's own reading is overwritten.
3. ⭐ **TWO OBSERVATION WRAPPERS WERE ADDED TO THE WALK** (`armPendingPass` and
   `resolvePendingPassWindup`) for the deposit-side pin the #353 rider ordered. They delegate
   unchanged and G-LOCKSTEP proves them byte-inert on all seven composition worlds; they sit
   inside the perf face's timed region in **both** arms.
4. ⭐ **TWO GATES WERE ADDED** (`gDepositCarriesElection`, `gLadderClean`) — 23 against GC-T2's
   21 — and **`gN` was re-built with two arms and no bypass** per #348 §CORR 2. The old
   `MODE === 'smoke' || N_ENV !== undefined` disjunct is gone; an override run now has to satisfy
   its own conjuncts and can never write a canonical path.
5. ⭐ **GC-T1 AND GC-T1B ARE NO LONGER QUOTED.** GC-T2 is both the sizing source and the re-aim
   signature's different-battery context, so the quotation surface is one artifact instead of
   three. GC-T1B's §P6 READING RULE is quoted verbatim in substance (through GC-T2's own
   re-statement of it) and applied unchanged.
6. **THE SEASON LADDER'S GENE AXIS IS `passLeadSupport`, NOT `dvExposureWeight`** — the dispatch
   brief names "the DLC gene evolvable"; BK-T4's ladder used the DV gene, and everything else
   about the form (10 clubs, 20 generations, elite/reborn/mutate law, the drift shadow, the
   early→late goals slope) is BK-T4 §10's, unchanged.
7. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron rule:
   governance files are the commander's). The queue's status line, the verdict of record and the
   next dispatch are the commander's to write.

## §人话 — 脑子会选,现在腿也会踢了 —— 但球没变好

> ⚠ **先说钟**(#339 立的双钟法条):我们一场球显示钟走满 90 分钟,按 sim 秒直读只有 240 秒
> (1 sim 秒 = 22.5 显示秒)。下面所有「每场几次」都按**我们这一场**读,也就是显示钟的一场
> 90 分钟。占比类的数换钟不变。
>
> 之前发现一件很蠢的事:球员的脑子会算「这球该传到他跑过去的位置」,但只要他做了**引拍**
> 这个动作,那个位置就被扔掉了,腿照样往人身上踢。上一轮量到 **73,079 次引拍传球,一次都
> 没有踢向算出来的那个点**。这一轮我们把这条线接上了,然后**只改这一件事**,踢了 800 对球。

### 一、腿真的会踢了 ✅

引拍传球里有 **13.014 %** 现在踢向脑子算出来的那个点(4,504 次 / 34,609 次),对照那一边是
**0 次 / 35,850 次** —— 一次都没有。平均往前送 **6.97 米**。⭐ 这条是这一整段里最结实的一个数
(离零 **31 个半宽**),而且把影响最大的那一场整场拿掉再算,一个字不变。

### 二、你抱怨的「弹身体」,这次是**表达**降下来的 ✅

每场撞身体 **17.28 → 15.45**,撞到自己人 **7.27 → 6.36**,两条区间整段在零以下,都经得起挑刺。
⭐ 之前几轮是靠**给挡住的线扣分**把它压下去的;这一次一分没扣,只是**让腿踢向脑子选的那个点**,
撞身体就少了。这是这条线第一次靠「会踢」而不是靠「不许踢」拿到的。

### 三、可是球没变好 ❌ —— 这是这一轮真正要报的坏消息

每场地面传球 **77.55 → 75.85**,对照区间下边缘 **76.67** —— **又掉出去了**,而且掉了
**1.71** 次,区间整段在零以下。更难看的是后面几条:传球成功率 **59.07 % → 58.05 %**、
进球 **3.35 → 3.11**,两条都量准了在往下走。

那些没传的球去哪了?挡着的那一列少了 **751** 次,**干净的那一列也少了 614 次** —— 上一轮至少
还有一小部分换到干净的线上(318 换回 132),**这一轮两列一起少**。也就是说:让他能踢那个点
以后,他不是改传别的线,而是**整体少传了**。

⭐ **一个说得通但还没证明的解释**:把球往队友前方 7 米的空当踢,球到的时候人不一定跟得上;
而且脑子是在**引拍那一刻**算的,引拍这段时间里场上还在动。所以「踢得更准」不等于「传得更成」。
⚠ 这只是**一个带标签的猜想**,要证明它得再做一个探针(把「踢向空当的球」和「踢向脚下的球」
分开看成功率),**那个探针还没造**。

### 四、四条规矩过了两条

(a) 会踢了 ✅ · (b) 没有少传 ❌ · (c) 三条撞身体的面「不许变差」—— 过了两条,第三条
(老地图那条占比)**因为量不准而算失败**:它的点估计只有 **+0.0019**,根本没动,但区间太宽,
出手前我们就写明了这一条要 **6,070 对**才买得起,我们只有 800 对 · (d) 高球和传中都在区间里 ✅
(⚠ 传中只差 **0.03** 就掉出去)。

### 五、一个好消息在「进化」那边 ⭐

让联赛自己跑 20 代:在**腿会踢**的世界里,「选择传球落点」这个基因被选择**推上去了** ——
第 20 代平均 **0.2215**,85 % 的球队带着它,而纯随机漂移的对照只有 **0.1125**。
⚠⚠ 但这是 **4 个联赛、没有区间**,四个联赛的进球趋势甚至方向都不一致。**这是第一眼,不是结论。**

> **一句话收尾**:这一版把「腿不会踢」这个毛病**修好了,而且证据非常硬**;
> 但**修好它并没有让球场变好** —— 地面传球反而更少了,传球成功率和进球都在往下掉。
> ⛔ **这一版什么都没上线**,你现在玩的那个世界一个字节都没动。
