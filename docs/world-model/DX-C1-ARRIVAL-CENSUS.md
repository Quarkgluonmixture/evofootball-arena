# DX-C1 — THE ARRIVAL CENSUS (带位移的球到底差在哪?)

> **The autopsy that separates STALENESS from ARRIVAL CONTEXT.** Authorized by
> **COMMANDER RULING #355 item 2**, which is [#354 item 4](PROGRAMME-RULINGS.md)'s NAMED UNBUILT
> PROBE. Contract: [`DX-DELIVERY-EXECUTION-CONTRACT.md`](DX-DELIVERY-EXECUTION-CONTRACT.md).
> Predecessor and the arm this census dissects:
> [`DX-T1-EXPRESSION-EXAM.md`](DX-T1-EXPRESSION-EXAM.md) (freeze `324c9c2` → results `c68a35f` →
> rider `bd6384e`; artifact `docs/world-model/data/dx-t1-expression-exam.json`).
> Census form of record: [`BK-C2-CAROM-CENSUS.md`](BK-C2-CAROM-CENSUS.md).
> Instrument: `scripts/probes/dx-c1-arrival-census.ts`.
> Artifact: `docs/world-model/data/dx-c1-arrival-census.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5,
> implemented as the instrument's own line).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. It scores no hypothesis, arms no mechanism
> and makes no football claim. **IT ADJUDICATES NOTHING** — it PICKS the fix by measuring, and
> the commander rules. **THIS STAGE SHIPS NOTHING**: `dxWindupAim`, `bkGroundCorridor`,
> `dlcDeliveryChoice` and `dlcStrikePlane` all stay default OFF and absent from `a4World.ts`
> (re-asserted at battery time by `gSeamSitesPinned`).
> ⛔ **X-SRC-ZERO**: no file under `src/` is edited.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

DX-T1 §DOUBTS 3, verbatim:

> *"**THE COMPLETION FALL IS A LABELLED HYPOTHESIS WITH A NAMED PROBE** (§R3): a 6.97 m lead
> struck at a stale, arm-time election may simply arrive worse. The two mechanisms — the
> contract §4 **execution-error** door and DX-T0 §HONESTY 2's **staleness** — are NOT separated
> by this exam, and the completion-by-carry split that would separate them is **unbuilt**."*

**In plain football language**: the brain now picks a point in front of a moving teammate and the
legs finally kick at it — but the passes got WORSE (completion 59.07 % → 58.05 %, goals
3.35 → 3.11 in DX-T1's own two arms). Two stories fit. Either the decision goes STALE while the
player winds up, or a ball played into space is simply HARDER TO COLLECT. **This census
measures which.**

## §1 THE FOUR FROZEN QUESTION GROUPS (#355 item 2, verbatim scope)

* **(a) COMPLETION BY CARRY CLASS** — carried-election wind-up passes vs to-feet wind-up passes
  vs synchronous passes (led and to-feet separately), each with its completion rate, interval and
  volume share. **THE NUMBER THE FORK NEEDS: does the carried class underperform, and by how much.**
* **(b) ARRIVAL ANATOMY AT THE LED POINT** — for every carried pass: the receiver's distance to
  the elected point at BALL ARRIVAL (bins frozen at §P.B); reached / arriving / abandoned
  (definitions frozen at §P.B); the lane's state re-derived at BOTH instants (election tick vs
  strike tick: `laneOpenness` delta, shell-blocked delta, receiver displacement, nearest-defender
  displacement); and the outcome (completed / intercepted / carom / out).
* **(c) THE STALENESS–OUTCOME LINK — THE DISCRIMINATING FACE** — completion binned by
  world-motion-during-windup, with the metric, the bins **and the discrimination rule** all
  frozen at §P.C before any battery seed.
* **(d) THE COUNTERFACTUAL RE-ASK READ** — offline, from stored state: would the strike-time
  world elect a DIFFERENT displacement; agree/disagree share; outcome split by agreement. ⚠
  **SCOPED, AND THE SCOPE IS DECLARED AT §P.D** (the Q07 refusal discipline: never invent).

## §2 THE ONE ARM

**`armed`** = `a4MatchFlags(CORRIDOR_WORLD_VERSION)` + `dlcDeliveryChoice` + `dlcStrikePlane` +
`bkGroundCorridor` + **`dxWindupAim`** + `armA4World(m, null, 11)` + `passLeadSupport` = **1**
written MATCH-LOCAL (DX-T1 §4's own dose idiom, byte for byte) with `dvExposureWeight` at world
11's own **0.5** pin. **THE WORLD'S OWN COMPOSER IS CALLED, NEVER COPIED.**

⛔ **DX-T1's SHUT ARM IS NOT RE-WALKED.** Its published faces are **⚠ DIFFERENT-BATTERY CONTEXT**
(different block, two arms) and are labelled so wherever they appear. **NO Δ IS COMPUTED ACROSS
BATTERIES.**

## §3 ⛔ X-SRC-ZERO — WHAT THE OBSERVER IMPORTS INSTEAD OF ADDING

The probe **imports the exported readers and CALLS them, never re-implements them** —
`laneOpenness` (`src/ai/perception.ts`), `groundShellHazard` (`src/ai/deliveryValueSeat.ts`),
**`passLeadOffset`** (`src/ai/passLeadSeat.ts` — the PTP law ITSELF, for (d)), `a4MatchFlags` /
`armA4World`, `passLeadSupportWeight` — and reads public `Match` state and `bkContactLedger` per
tick (through one read-only cast, the BK-C1 idiom, for `pendingPass`, `pendingPassWindup`,
`dxStrikeAim` and `possessionSide`).

⭐ **THREE OBSERVATION WRAPPERS, THE DX-T1 §DEV 3 PRECEDENT** (`armPendingPass`,
`resolvePendingPassWindup`, `performPass`): each delegates with the **identical arguments** and
**`gLockstep` walks the same scratch seed with them ABSENT and requires a BYTE-IDENTICAL
whole-match signature.** They are the only honest way to see the class, the elected point and the
two instants — the dormant ledger has no counter (DX-T0 §COMMANDER CORRECTIONS (#353) item 1).
**Anything beyond a byte-inert wrapper = ESCALATE; nothing beyond one was needed.**

---

# §P PRE-REGISTRATION (frozen at the FREEZE COMMIT, BEFORE any battery seed was read)

## §CORRECTIONS-READ — every canon sentence COPIED from [`CANON.md`](CANON.md), never re-typed

| canon, verbatim | its home | how it binds here |
| --- | --- | --- |
| freeze-before-battery — freeze the instrument commit BEFORE the battery; artifact records the instrument hash (paraphrase) | **ruling #266.3(c)** | COMMIT 1 lands this §P + the probe; the artifact records `instrumentSha256` and `headAtRun`. **No battery seed was walked before it** (§DEV-PREFLIGHT lists every scratch seed that was). |
| *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* | **PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1** | `BODY_SCHEMA` is the 20-key allowlist; `hashedBodySha256` is computed LAST, over the final gate values |
| mutant liveness — every gate conjunct provably alive, or the probe refuses to run (paraphrase) | **ruling #268.3(a)** | `gClassesNonVacuous` gates that no face is computed on an empty cell; `gStratificationNonVacuous` gates (c)'s split; `gDepositCarriesElection` gates the arm→record→release identity; **every gate can fail** (§P.G item 1) |
| per-seed cells — per-seed/per-cluster cells stored so every headline re-derives (paraphrase) | **ruling #282.2(ii)** | `perSeedCells` stores the FULL row for all 800 cells, and every face, every Δ, every bin table and the VERDICT are computed from nothing else |
| *"the re-derivation gate covers EVERY published face; a percentile face requires stored bins"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4** | `gFaces` re-derives every face, every Δ point estimate, every stored bin table, both partitions, **every SIZING row's arithmetic** and **the (c) VERDICT ITSELF** off the SERIALIZED artifact |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | every `…PerMatch` face is on the 240 s match clock; every `…Share` is a share of its own named denominator; `…Metres` is metres; `…Ticks` is engine ticks |
| *"a src-extracted constant pins its extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"* | **BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1** | `gAnchoredConstants` pins **the structural fact of §P.A2** (`struckLead` + the aim composition), the chooser's own open-lane line, `PTP_FLIGHT_SPEED`, `PTP_LEAD_FLIGHT_MUL` and `CONTROL_RADIUS`, each with occurrence counts and line receipts. **This census introduces no constant of its own.** |
| *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1** | `gSeamSitesPinned` re-asserts at battery time: ONE `dxWindupAim` fork, ONE arm-time consumption gate, ONE plumb-through, ONE deposit write, ONE `armPendingPass` definition + ONE brain call site, ONE GC fork, ONE `dlcDeliveryChoice` fork, ONE `dlcStrikePlane` fork, and **ZERO of the four doors in `a4World.ts`** |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every number in §R below is a FIELD of the committed artifact at source precision |
| *"a starred finding states its \|Δ\|÷half-width ratio"* | **BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2** | every contrast publishes `absDeltaOverHalfWidth` |
| *"a scored face's walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate proves arithmetic, not definitions"*; REFINED at #334 item 2 | **DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2** (+ **BK-T3 §CORR item 2**) | `klassOf` · `isDelivery` · `isGroundLaunch` · `isMeasurableGroundPass` are DX-T1's / BK-C2's, byte for byte in substance; **`carryClassOf` · `outcomeOf` · `arrivalClassOf` · `agreeClassOf` are THIS census's own four**, and every one is a PURE function called by BOTH the walk and the published fixture table (`gWalkFixtures`) |
| *"a dose-source guard should hash the bytes it reads, not a self-declared field"* | **BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6** | DX-T1's quoted numbers are READ out of its committed artifact with the bytes hashed FIRST, never re-typed from prose (`gQuotedSourceIntact`) |
| ⭐ provenance hashes are COPIED from the artifact's own field, never from a terminal scroll-back (paraphrase) | **ruling #345 item 1 (the standing order)** | DX-T1's `hashedBodySha256` is published by COPYING that field out of its artifact; the file's own BYTE hash is published separately |
| ⭐⭐ **dose placement** — *"dose NEVER in info.genome; truth-dosing writes census values through the shipped writer."* (paraphrase); ratified form = the match-local-copy idiom PLUS an info.genome-cleanliness world conjunct | **ruling #270.2** (+ #334 item 1) | DX-T1 §4's idiom unchanged: both genes on MATCH-LOCAL views only, `gGenomeClean` proves the franchise object carries NEITHER |
| ⭐ the geneOk VALUE-check order | **GC-T1-GROUND-CORRIDOR-EXAM.md §COMMANDER CORRECTIONS item 2** (the #345 rider) | `gGeneValuePinned` checks BOTH genes **by VALUE** on BOTH match-local views of BOTH teams, every walked match, and reads the DLC gene back through the SHIPPED `passLeadSupportWeight` map |
| *"arming receipts, not football findings"* (receipts ≠ effect sizes) | **ruling #289 item 1** (+ BU-T1 §CORR item 5) | `strikeAttributionCompleteness`, the deposit-pin counts and the lockstep rows are labelled INSTRUMENT RECEIPTS wherever they appear |
| *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* | **PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6** | the LOCKSTEP receipt walks **900,000,700–702** and the PREFLIGHT / SIZING SMOKE walked **900,000,800–811** only |
| seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record (paraphrase) | the standing frontier practice (**rulings #286 item 5 onward**) | `gSeedsBookedEqualWalked` compares the CELLS' OWN distinct-seed set to the booked list and checks every walked seed is inside the block |
| clock honesty — every rate on the 240 s match clock or dual-axis (1 sim-s = 22.5 display-s) (paraphrase) | **ruling #280.2(iii)** + PC-T2 §CORR item 3 | every per-match count carries the clock in its unit string; §人话 opens with the dual-clock declaration (#339) |
| *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; …)"* | **ruling #283.2(iv)** | this probe builds `Match` DIRECTLY and never round-trips a League, so no worker fixture is generated |

## §P.A (a) THE CARRY CLASSES — THE FROZEN PARTITION

The population is **the MEASURED GROUND PASS** — BK-C2 §P.4's / DX-T1 §5's definition byte for
byte in substance: a GROUND launch of class shortPass / throughBall / cutback for which the
ENGINE itself names a target (`pendingPass.targetGid`). **Five classes, exhaustive and
mutually exclusive** (`gCarryPartition` proves the sums close):

| class | definition | why it is its own class |
|---|---|---|
| ⭐⭐ **`carried`** | released through `performPass` from **inside `resolvePendingPassWindup`**, with a **non-zero** `ptpLead` (i.e. the record's `aimLead` — DX-T1 §DEV 2's union-instrument lesson: **the carry is read from `pendingPassWindup.aimLead`, never from the legacy `aim` field, which is structurally zero**) | THE CLASS THE FORK IS ABOUT |
| **`windupToFeet`** | the same seat, `aimLead` null or zero | the WITHIN-SEAT control: same wind-up, same body, no carry |
| **`syncLed`** | released through `performPass` **outside** the wind-up (the one-touch bypass / restart path), with a non-zero `ptpLead` | a led ball with **NO staleness at all** — the election and the strike are the same tick |
| **`syncToFeet`** | the same, lead null or zero | the plainest ball in the game |
| ⚠ **`otherGround`** | a measured ground pass that is **not** a `performPass` release (throughBall / cutback) | it has no wind-up seat and this door can never carry for it. **Published, never folded into a wind-up class.** |

⭐⭐ **`syncLed` IS THE SHARPEST CONTROL IN THE CENSUS AND IT IS NAMED HERE, BEFORE THE BATTERY**:
it is a led ball whose election is ZERO ticks old. If the carried class underperforms `syncLed`
as well as `windupToFeet`, staleness is not the only story; if `carried` ≈ `syncLed` but both sit
below the to-feet classes, the LED BALL ITSELF is the cost. ⚠ It is a **SMALL** class (the smoke
put it at ~1.6 % of the population), and §N sizes nothing on it — the reading is directional and
is labelled so.

**FACES PER CLASS**: `completion` · `interceptedShare` · `caromShare` · `toIntendedShare`
(completed **by the intended receiver**) · `volumeShare` · `perMatch`. **CONTRASTS** (paired,
same resampled cells): `carriedVsWindupToFeet` (**the number the fork needs**) ·
`carriedVsSyncToFeet` · `carriedVsSyncLed` · `windupToFeetVsSyncToFeet`.

### §P.A2 ⭐⭐ THE STRUCTURAL FACT THE WHOLE CENSUS IS BUILT AROUND, PINNED CHARACTER-FOR-CHARACTER

`src/sim/mechanics.ts`, ONE occurrence each, with line receipts (`gAnchoredConstants`):

```ts
const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));
const lead = ptpLead === null ? struckLead
  : v2(struckLead.x + ptpLead.x, struckLead.y + ptpLead.y);
```

⭐⭐ **`performPass` RE-READS THE RECEIVER'S POSITION AT STRIKE TIME AND ADDS THE CARRIED LEAD TO
IT.** So a wound-up led pass's **ANCHOR IS FRESH** and only its **DISPLACEMENT VECTOR** is
arm-time. **EVERY STALENESS STATEMENT IN THIS CENSUS IS A STATEMENT ABOUT THE LEAD VECTOR ALONE,
and a re-ask door could only ever change that vector.** Said here, before the battery, because it
materially narrows what (c) and (d) can possibly find — and because the alternative was to
discover it afterwards and call it a finding.

## §P.B (b) THE ARRIVAL ANATOMY — THE FROZEN DEFINITIONS AND BINS

**THE ELECTED POINT** is the point the chooser PRICED: `record.aim + record.aimLead`, i.e.
`mate.pos` **at the arm tick** plus the elected displacement. That is exactly `groundCandidate`'s
own `aim` (`mate.pos + lead`), so no arithmetic is re-implemented to obtain it.

**THE ARRIVAL INSTANT** — frozen, and it needs **no physics re-derivation**: the first tick of the
flight at which the ball's projection onto its own **launch → elected-point** line reaches the
elected point's own distance along that line. If the flight retires first, the pass is booked
**`neverReached`** and enters no distance bin. ⚠ **THIS IS A GEOMETRIC READ**, not a claim about
when a receiver could have taken the ball.

**THE CLASSES**, cut on the ANCHORED `CONTROL_RADIUS` (the engine's own control radius, extracted
with a line receipt):

| class | rule |
|---|---|
| **`reached`** | the receiver is within `CONTROL_RADIUS` of the elected point at the arrival instant |
| **`arriving`** | outside it but inside **3 × `CONTROL_RADIUS`** *and* **CLOSING** (nearer than he was at the strike tick) |
| **`abandoned`** | anything else the ball reached |
| **`neverReached`** | the flight died before the ball travelled as far as the elected point |

⚠ **THE CUTS ARE BIN EDGES ON AN ANCHORED CONSTANT, NOT MEASUREMENT THRESHOLDS.** The FULL
receiver-distance histogram (**1 m bins, 10 bins, last = ≥ 9 m overflow**) is stored per seed, so
any other cut re-derives off disk.

**THE LANE AT BOTH INSTANTS** — the shipped readers CALLED, on the elected point:
`laneOpenness` (with the playmaker's ×1.15 and `Math.min(1, ·)`, exactly as `groundCandidate`
computes it) and `groundShellHazard > 0` (the SHELL-BLOCKED predicate, the pricer's own body set,
kicker and receiver). Taken **at the tick the wind-up record appears** (the ELECTION) and **at the
tick `performPass` fires** (the STRIKE). Published: both levels, the signed `laneDelta` histogram
(0.1 wide, 11 bins, centre holds zero), and the signed shell delta
(`−1 blocked→clear` / `0` / `+1 clear→blocked`).

**THE DISPLACEMENTS**: `receiverDisplacement` (arm → strike) and
`nearestDefenderDisplacement` — the defender **nearest the elected point AT THE ELECTION**, his
identity **fixed there** and his displacement measured to the strike. Plus `windupTicks`.

**THE OUTCOME LADDER, FROZEN** — the FIRST terminal event of the flight wins:
`completed` (the engine credits the passer's side with a `passesCompleted`) →
`intercepted` (the opposing side's `interceptions` increments) →
`out` (the ball goes dead) → `unresolved`.
⭐ **`caromed` IS ORTHOGONAL TO THIS LADDER AND IS PUBLISHED AS A CROSS-TAB, NOT AS A FIFTH
OUTCOME** — a ball may strike a body and still be recovered by the passing side, and folding the
two would score two different facts identically. ⚠ **THE LADDER IS TEMPORAL, NOT CAUSAL**
(BK-C2 §P.7's own warning, inherited).

## §P.C (c) THE STALENESS–OUTCOME LINK — THE DISCRIMINATING FACE

**THE MOTION METRIC, FROZEN: the RECEIVER'S DISPLACEMENT DURING THE WIND-UP, in metres.** It is
the receiver's motion the elected lead is a projection OF, so it is the axis a stale election is
stale ALONG. Bins: **0.25 m wide, 12 bins, last = ≥ 2.75 m overflow.** Published beside it, both
gated by nothing: the nearest-defender displacement and the wind-up length.

⚠ **THE CONFOUND IS NAMED AND HANDLED BEFORE IT IS MEASURED** — motion-during-windup covaries
with **wind-up LENGTH** by construction (a longer backswing means more time for anybody to move),
so the raw marginal would price the two together. **BK-C2 §P.5's own handling, re-applied:**

1. the joint table `[windup-length bin][motion bin]` of carried flights and of completions is
   **stored per seed** (length: 3-tick bins, 10 bins, ≥ 27 overflow), so any stratification
   re-derives from disk;
2. **THE ANSWER OF RECORD** splits, WITHIN each wind-up-length stratum, at that stratum's own
   median motion bin (computed from the POOLED table and stored as `splitByWindupTickBin`), then
   pools the upper and lower halves ACROSS strata:
   `staleness.completionMotionUpperHalfWithinWindupLength` vs `…LowerHalf…`;
3. the **raw marginal pair** (`…Raw`, split at the pooled marginal median, length ignored) is
   published **ONLY so the confound's size is visible**. It is labelled ⚠ **NOT the answer**;
4. the split indices are frozen from the pooled table and then treated as constants by the
   per-seed face functions, so **the bootstrap is CONDITIONAL on the split. Stated, not hidden.**

> ### ⛔⛔ THE DISCRIMINATION RULE, STATED IN THE FREEZE
>
> Let **Δ = completion(upper motion half) − completion(lower motion half), WITHIN wind-up-length
> strata**, with a paired cluster-bootstrap 95 % interval.
>
> * **FALLING-WITH-MOTION** ⇔ the interval lies **ENTIRELY BELOW ZERO** ⇒ *a stale election fails
>   more* ⇒ **THE RE-ASK DOOR IS THE FIX** the census points at.
> * **FLAT-ACROSS-BINS** ⇔ the interval **CONTAINS ZERO** ⇒ **STALENESS IS EXONERATED** at this
>   power and **THE ARRIVAL CONTEXT OWNS THE LOSS**.
> * **RISING** ⇔ the interval lies **ENTIRELY ABOVE ZERO** ⇒ reported exactly as frozen; neither
>   door is pointed at by this face. **A rising read is a finding, not an error.**
>
> ⛔ **THE CENSUS STILL ADJUDICATES NOTHING**: the rule names which fix the NUMBERS point at.
> The commander rules. And ⚠ **A FLAT READ IS A POWER STATEMENT AS WELL AS A FINDING** — §N
> publishes the MDE, and a flat read at 800 pairs means *"no staleness effect bigger than the
> MDE"*, never *"no staleness effect"*.

## §P.D (d) THE COUNTERFACTUAL RE-ASK — AND ⚠⚠ EXACTLY WHAT IT CANNOT DO

The dispatch requires the honesty first, so it comes first. **TWO PARTS OF THE LIVE ELECTION ARE
NOT FAITHFULLY RE-DERIVABLE OFFLINE, AND NEITHER IS FAKED:**

1. ⛔ **THE ARGMAX IS NOT RE-RUN.** `groundCandidate` is a **closure** inside
   `PlayerBrain.decideOnBall` over the whole scoring chain (the `W` weights, `passMul`'s
   style/tilt chain, stagnation, pressure, team mode, the offside read, `openRun`, `wallRun`,
   the third-man and overlap tests, the DV and GC price limbs). It is not exported.
   **Re-implementing it would be a second, drifting copy of the pricing — REFUSED.**
   ⇒ **(d) answers *"would the door aim at a DIFFERENT POINT for the SAME target"*, and NEVER
   *"would the chooser pick a different man"*.**
2. ⛔ **THE PERCEPT MOTION SOURCE IS NOT RE-DERIVABLE WITHOUT PERTURBING THE WALK.**
   `edsPerceivedChoice` is **TRUE** in world 11, so the live chooser's `passLeadOffset` reads the
   body's **REMEMBERED** velocity; obtaining it means `match.perceivedSnapshot(p)`, which calls
   `reconstructBodyMemory` and **WRITES THAT MEMORY IN PLACE**. An observer pull could perturb the
   very walk it measures (DX-T1 §8A's own warning).
   ⇒ **the counterfactual runs on TRUTH motion at BOTH instants**, which holds the motion source
   fixed and isolates the **TIME** axis, which is the axis a re-ask door would actually move.

**WHAT IS PUBLISHED, THEREFORE:**

* **`reAsk.meanDeltaMetres`** = mean `|leadTruth(strike) − leadTruth(election)|`, where
  `leadTruth` is the **EXPORTED `passLeadOffset` CALLED** with a truth seat
  (`{weight: 1, perceived: false, snapshot: null}`) — the PTP law itself, not a re-implementation.
* **AGREEMENT CLASSES, FROZEN** on that delta: **`agree` < 0.5 m · `minor` [0.5, 1.5) ·
  `disagree` ≥ 1.5 m**, with the **full 0.5 m histogram (13 bins, ≥ 6 m overflow) stored**, so any
  other cut re-derives off disk. ⚠ These are BIN EDGES, not measurement thresholds.
* **completion split by agreement class**, and the contrast `reAskDisagreeVsAgree`.
* ⭐⭐ **THE INSTRUMENT'S OWN HONESTY FACE — `honesty.meanPerceptGapMetres`**: the distance
  between the lead the LIVE (percept) chooser actually carried and the TRUTH-motion lead **at the
  SAME election instant**. **It SIZES the part of any disagreement that is PERCEPT rather than
  TIME**, and it is published rather than hidden precisely because (d) could otherwise be read as
  a time measurement when part of it is a perception measurement.

## §P.E SEEDS, SIZING AND STATS

* **BLOCK 12,528,000–999**, opened by #355 item 3. The sub-band split, declared here:
  * ⭐ **the BATTERY** = **12,528,000–799** (**800** walks, ONE arm);
  * **the world-construction receipt** = **12,528,999** (**1** walk);
  * **BOOKED = WALKED**: `gSeedsBookedEqualWalked` requires **801** against 800 distinct battery
    seeds, derived from **the CELLS' OWN distinct-seed set**, every one inside the block.
  * ⚠ **THE BLOCK IS NOT CONSUMED WHOLE**: 12,528,800–998 are **not walked** and stay virgin.
    The next free sim seed is therefore **≥ 12,529,000** (the block is retired whole of record,
    the standing practice), and that is bookkeeping, not an artifact quotation.
* **OUT-OF-BAND SCRATCH ONLY**: the LOCKSTEP receipt walks **900,000,700–702** (3 seeds × 2 trace
  states = **6 walks**) and the PREFLIGHT / SIZING SMOKE walked **900,000,800–811**.
  **No battery seed was walked before this freeze.**
* **SIZING**: §N, from this census's own 12-cluster scratch smoke (BK-C2 §P.6's own situation).
* **STATS CONSUMED: ZERO.** Every interval is a percentile cluster bootstrap over the WALKED
  CELLS (2,000 draws, rng seeded from **12,528,000**; the cluster IS the match seed), not a
  registry-consuming statistic (#329 item 4). Next stats base remains ≥ **117,600**, registry of
  record **73**.

## §N ⭐ THE SIZING, SHOWN — AND WHAT 800 PAIRS CANNOT BUY

**The house form** (DV-T1B §N / GC-T2 §N / DX-T1 §N), with the variance source named honestly:

```text
1  se(n)      = half-width(n) / z.975                       (z.975 = 1.959963985)
2  se(needed) = |target| / (z.975 + z.80)                   (z.80  = 0.8416212336)
3  N          = ceil( n · (se(n) / se(needed))² )
4  MDE(N)     = half-width(n) · sqrt(n / N) · (z.975 + z.80) / z.975
```

⚠⚠ **THE VARIANCE SOURCE IS THIS CENSUS'S OWN 12-CLUSTER SCRATCH SMOKE** (seeds
900,000,800–811, disclosed in full at §DEV-PREFLIGHT), **not a published battery**. Twelve
clusters is a NOISY variance estimate — a **strictly weaker** assumption than DX-T1's was, and
the realised half-widths are published beside the projected ones at §R so the reader can see
whether it held.

| face | conjunct | smoke hw (n = 12) | target | se(needed) | **N required** | MDE at n = 800 | buyable at 800? |
|---|---|---:|---:|---:|---:|---:|---|
| `carriedVsWindupToFeet` | **(a)** | 0.1591075 | **0.0949** | 0.03387368 | **69** | **0.02785429** | ✅ **YES** |
| `stalenessWithinStrata` | **(c)** | 0.2029125 | **0.05** | 0.01784704 | **404** | **0.03552304** | ✅ **YES** |
| `stalenessWithinStrata` | **(c)** | 0.2029125 | **0.03** | 0.01070822 | **1122** | **0.03552304** | ❌ **NO** — needs **1.4 blocks** |

> ### ⛔ **N_FROZEN = 800 WALKS. (a)'s SPLIT AND A 5-POINT STALENESS EFFECT ARE BUYABLE HERE; A 3-POINT ONE IS NOT. SAID BEFORE THE BATTERY.**

**WHAT THAT MEANS FOR (c), PRE-COMMITTED**: a **FLAT** read at 800 is *"no staleness effect
larger than ≈ 3.6 completion points"*, and **that sentence is the finding, not "no effect"**.
⛔ The rule is NOT relaxed to compensate. Never promise power you do not have.

⚠ **THE SMALL CLASSES ARE SIZED BY NOTHING.** `syncLed` (~1.6 % of the population) and the
`reached` arrival class are read **directionally** and are labelled so at §R. A census may publish
an unpowered cell; it may not dress one as a resolution.

## §P.G THE GATES (frozen; a red gate is REPORTED, never patched, and ROUTES THE ARTIFACT)

`gWorld` · `gGeneValuePinned` · `gGenomeClean` · `gSeamSitesPinned` · `gAnchoredConstants` ·
`gWalkFixtures` · `gStrikeLedgerAgrees` · `gStrikeAttributionComplete` · **`gCarryPartition`** ·
**`gArrivalPartition`** · **`gClassesNonVacuous`** · **`gDepositCarriesElection`** ·
**`gLockstep`** · **`gStratificationNonVacuous`** · `gQuotedSourceIntact` · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · **`gN`** · **`gFaces`** — **19 gates**.

1. ⭐⭐ **NO GATE THAT CANNOT FAIL** (#334 item 3). There is deliberately **no `gStatsZero`**: a
   hardcoded `true` is not a gate. Zero registry statistics are drawn anywhere in this file and
   the stats ledger is a **FIELD** (`stats.consumed = 0`).
2. ⭐⭐ **NO GATE ON A DIRECTION AND NO GATE ON A RESULT.** `gClassesNonVacuous` reads LIVENESS
   only — that the carried, wind-up-to-feet and synchronous-to-feet classes are populated and
   that (d) has a denominator — so no face is computed on an empty cell. ⛔ **No gate asks any
   face to move in any direction, and no gate reads the (c) verdict's SIGN.**
3. ⭐⭐ **`gN` HAS TWO ARMS AND NO BYPASS** (#348 §CORR 2's order, DX-T1's implementation
   inherited). THE FROZEN ARM: no override env at all, and the battery ran at exactly
   `N_FROZEN`. THE OVERRIDE ARM: the override is DECLARED (a published field), the walked n
   equals the n the override itself declared, and the artifact sits **OFF every canonical path**
   (a separate FATAL refusal enforces the last one at start-up). Both arms also require every
   §N sizing row to derive.
4. **`gFaces` FROM DISK** covers every published face, every Δ point estimate, every stored bin
   table, both partitions, **every SIZING row's arithmetic** and **THE (c) VERDICT ITSELF** (the
   frozen rule re-evaluated from the serialized interval and compared to the published verdict).
5. ⭐ **THE RED-ROUTING IDIOM, IN CODE** (#334 item 5): `outPath = ALL_GREEN ? OUT : OUT +
   '.RED.json'` is the instrument's own line, evaluated after `gFaces`.

## §P.H HONEST LIMITS, STATED BEFORE THE BATTERY

1. ⭐⭐ **ONLY THE DISPLACEMENT IS STALE** (§P.A2, anchored). A re-ask door could only ever change
   the LEAD VECTOR; the anchor is already fresh. This narrows what (c) and (d) can find, and it
   is said before the numbers exist rather than discovered afterwards.
2. ⚠⚠ **(d) IS DOUBLY SCOPED** (§P.D): the argmax is not re-run, and the percept motion source is
   not re-derivable offline. The percept gap is published as its own face.
3. ⚠ **THE ARRIVAL READ IS GEOMETRIC** (§P.B), not a reachability model.
4. ⚠ **THE OUTCOME LADDER IS TEMPORAL, NOT CAUSAL**, and `caromed` is orthogonal to it (§P.B).
5. ⚠ **(c) IS CONDITIONAL ON THE FROZEN SPLIT**, and the raw marginal is published ONLY so the
   confound's size is visible — it is **NOT** the answer (§P.C item 4).
6. ⚠⚠ **THE SIZING'S VARIANCE SOURCE IS A 12-CLUSTER SCRATCH SMOKE** (§N), and a 3-point
   staleness effect is declared UNBUYABLE at 800 BEFORE the battery.
7. ⚠ **ONE ARM.** No between-arm effect size exists here; DX-T1's shut arm is DIFFERENT-BATTERY
   CONTEXT (§2) and no Δ is computed across batteries.
8. ⚠ **THE SMALL CLASSES ARE UNPOWERED** (`syncLed`, `reached`) and are read directionally (§N).
9. ⚠ **NO EXECUTION-ERROR MODEL EXISTS** (contract §4 / DX-T0 §HONESTY 3), so the "arrival
   context" this census can point at is the RECEIVER'S OWN GEOMETRY, not the passer's accuracy.
   The two are not separated here, and that is a named door, not a smuggled one.
10. ⚠ **THE COMPLETION COUNTER IS THE ENGINE'S OWN** — `passesCompleted` credits ANY same-side
    body but the passer, so a pass "completed" by a teammate who was not the intended man counts.
    That is why `toIntendedShare` is published beside every completion rate.
11. ⚠ **CLOCK.** 1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every
    per-match COUNT face carries the clock in its unit string; every SHARE face is
    clock-invariant.

## §DEV-PREFLIGHT — everything seen before the freeze, disclosed HERE (GC-T2 §DEV 2's form)

⚠⚠ **SCRATCH SMOKES ON SEEDS 900,000,800–811 (and 900,000,700–702 for the lockstep receipt) WERE
RUN AND THEIR NUMBERS WERE SEEN**, to prove the instrument runs, that all 19 gates are REACHABLE
(one — `gSeamSitesPinned` — read RED on a wrong occurrence count and the COUNT was corrected to
the source's truth, not the gate loosened), and to supply §N's variance. The 12-seed read, quoted
here **only because I saw it** and pure noise at 12 clusters:

* (a) completion — `carried` **0.487179** (n = 78) · `windupToFeet` **0.582090** (n = 469) ·
  `syncLed` **0.733333** (n = 15) · `syncToFeet` **0.623077** (n = 260) · `otherGround`
  **0.435185** (n = 108); Δ `carriedVsWindupToFeet` **−0.094910** [−0.261065, +0.057150].
* (b) `reached` **0.076923** · `arriving` **0.384615** · `abandoned` **0.115385** ·
  `neverReached` **0.423077**; mean receiver→point at arrival **2.825910** m; mean carried lead
  **7.186163** m; lane **0.863606 → 0.838360**; shell-blocked **0.012821 → 0.038462**; receiver
  displacement **0.911261** m; wind-up **10.1154** ticks.
* (c) upper **0.476190** (n = 21) vs lower **0.491228** (n = 57), Δ **−0.015038**
  [−0.230415, +0.175410] ⇒ **FLAT** on the frozen rule.
* (d) `agree` **0.141026** · `minor` **0.230769** · `disagree` **0.628205**; mean re-ask delta
  **2.715541** m; percept gap **0.409603** m.

⛔ **NOT ONE PREDICATE, NOT ONE BIN EDGE, NOT ONE CLASS DEFINITION AND NOT `N_FROZEN` WAS RE-CUT
ON THE STRENGTH OF THAT SIGHT.** Every definition, bin and rule above — including the (c)
discrimination rule's three branches — was written into the instrument BEFORE the smoke ran;
`N_FROZEN` is the block sub-band's own cap, which binds whatever §N computes. **If a face reads
differently on the battery, that reading is the result.**

---

<!-- ⛔ NOTHING ABOVE THIS MARKER IS EDITED AFTER THE FREEZE COMMIT. -->

# RESULTS

> Freeze `ae7efdd` → this commit. **19/19 GATES GREEN**, so the artifact sits at the **CANONICAL
> path** `docs/world-model/data/dx-c1-arrival-census.json` (the red-routing branch was live and
> not taken). **801 battery walks** (800 seeds × 1 arm + 1 world-construction receipt)
> **+ 6 lockstep scratch walks**; `perf.batteryWallSeconds` **105.493**.
> `gFaces` re-derived **73/73** face-and-Δ checks and **15/15** stored-bin / partition /
> **SIZING** / **VERDICT** checks off the serialized artifact, 0 failures; **36/36** walk-side
> fixtures pass. `strikes` **20,714** with `strikesUnattributed` **0**.
> `hashedBodySha256 = 5fb147d13185dee54682660ea2bd66a2975ed342d3a4220b2d28679810f4c2f1`;
> `instrumentSha256 = 0fc4aeeb88e74c3b6b7e7ed42501ec905b73930bf8cff4efe07bbba1f71fbfff`;
> `headAtRun = ae7efdd13aace136a5b86a22faf99e7985d177b6`.
>
> ⭐ **EVERY NUMBER BELOW IS A QUOTED ARTIFACT FIELD AT SOURCE PRECISION** (canon: doc-prose
> fidelity). No number in this section is computed here.

## §R0 THE CENSUS IN ONE LINE

**THE CARRIED BALL COMPLETES 12.2 POINTS WORSE — AND ALMOST NONE OF THAT IS STALENESS.**
`carried` **0.488889** against `windupToFeet` **0.610906** (Δ **−0.122017**
[−0.137078, −0.105819], **7.807** half-widths — the biggest split in the census). But
**`syncLed` — a led ball whose election is ZERO ticks old — completes 0.508513**, and
`carriedVsSyncLed` is **−0.019624** [−0.057277, **+0.017133**], **0.527** half-widths,
**UNRESOLVED**. ⭐⭐ **REMOVING STALENESS ENTIRELY BUYS AT MOST ~2 POINTS AND THIS CENSUS CANNOT
TELL IT FROM ZERO; THE LED BALL ITSELF COSTS ~13.**

⛔ **AND THE FROZEN (c) FACE READS `FALLING`** — Δ **−0.097718** [−0.129304, −0.065563], **3.066**
hw — which by the rule frozen at §P.C points at the re-ask door. **BOTH READINGS ARE PUBLISHED AS
FROZEN, AND §R3 SHOWS WHY THEY DISAGREE**: (c)'s motion metric is, by the *pinned* PTP law,
a near-proxy for **LEAD LENGTH** within a wind-up-length stratum, so §P.C's stratification
removed the wrong confound. **The two instruments that isolate staleness ALONE — (a)'s `syncLed`
control and (d)'s agreement split — BOTH read flat.**

⛔ **The census adjudicates nothing. This is what the numbers say; the commander rules.**

## §R1 (a) COMPLETION BY CARRY CLASS — THE NUMBER THE FORK NEEDS

| class | n | volume share | ⭐ **completion** | ci95 | intercepted | ⚠ carom (ORTHOGONAL) | to the INTENDED man | per match |
|---|---:|---:|---:|---|---:|---:|---:|---:|
| ⭐⭐ **`carried`** | **4545** | **0.074272** | **0.488889** | [0.474524, 0.503753] | **0.267767** | **0.065787** | 0.465127 | **5.68125** |
| **`windupToFeet`** | 30278 | 0.494787 | **0.610906** | [0.605321, 0.616452] | 0.324988 | 0.152652 | 0.562785 | 37.8475 |
| ⭐⭐ **`syncLed`** | **881** | 0.014397 | **0.508513** | [0.474558, 0.542411] | 0.328036 | 0.086266 | 0.477866 | 1.10125 |
| **`syncToFeet`** | 17556 | 0.286891 | **0.637617** | [0.630414, 0.644786] | 0.306049 | 0.195489 | 0.576840 | 21.945 |
| ⚠ `otherGround` | 7934 | 0.129653 | 0.437862 | [0.427208, 0.448731] | 0.452987 | 0.185153 | ⚠ **0** (§DOUBTS 6) | 9.9175 |

| contrast | Δ | ci95 | \|Δ\|÷hw | resolved? |
|---|---:|---|---:|---|
| ⭐⭐ `carriedVsWindupToFeet` | **−0.122017** | [−0.137078, **−0.105819**] | **7.807** | ✅ below zero |
| ⭐⭐ `carriedVsSyncToFeet` | **−0.148728** | [−0.164790, **−0.132535**] | **9.222** | ✅ below zero |
| ⭐⭐⭐ `carriedVsSyncLed` | **−0.019624** | [−0.057277, +0.017133] | **0.527** | ⛔ **NO — unresolved** |
| ⭐ `windupToFeetVsSyncToFeet` | **−0.026711** | [−0.035858, **−0.016825**] | **2.807** | ✅ below zero |

⭐⭐⭐ **THE FOUR ROWS DECOMPOSE THE LOSS, AND THE DECOMPOSITION IS THE FINDING.** Taking
`syncToFeet` **0.637617** as the plainest ball in the game:

* **the WIND-UP alone costs −0.026711** (`windupToFeet`, resolved at 2.807 hw) — a to-feet pass
  that waits ~10.6 ticks before it is struck completes 2.7 points worse;
* **the LEAD alone is the gap between `syncLed` 0.508513 [0.474558, 0.542411] and `syncToFeet`
  0.637617 [0.630414, 0.644786]** — a led ball with **no wind-up at all**, hence **no staleness
  whatsoever**, sits roughly thirteen points below the plainest ball, its interval nowhere near
  the to-feet one (⚠ the two levels are quoted; no cross-face Δ was computed for this pair);
* **BOTH TOGETHER cost −0.148728** (`carried`), i.e. **about the sum of the two**, and
* ⛔ **the STALENESS-ONLY contrast — `carried` vs `syncLed`, the SAME led geometry with and
  without a stale election — IS UNRESOLVED AT 0.527 HALF-WIDTHS.**

⚠⚠ **AND THE HONEST BRAKE, SAID BEFORE THE READING IS QUOTED ANYWHERE ELSE: THESE ARE
OBSERVATIONAL CLASSES, NOT RANDOMISED ARMS.** A one-touch release, a wound-up pass and a led
pass are chosen in different situations by the same chooser; the class differences carry that
selection with them. ⛔ **This is a decomposition of a CENSUS, not a decomposition of an effect**
(canon: receipts ≠ effect sizes, and this is the same discipline applied to a split). §N sized
`syncLed` at nothing, and its interval is read directionally.

## §R2 (b) THE ARRIVAL ANATOMY — 91 % OF LED BALLS ARRIVE WHERE HE ISN'T

| arrival class | n | share | completion | ci95 | intercepted | out | ⚠ unresolved |
|---|---:|---:|---:|---|---:|---:|---:|
| **`reached`** | **402** | **0.088449** | 0.480100 | [0.432367, 0.529870] | 0.1642 | 0.0149 | **0.3408** |
| **`arriving`** | 1539 | 0.338614 | **0.553606** | [0.529915, 0.578330] | 0.1449 | 0.0084 | 0.2930 |
| **`abandoned`** | 930 | 0.204620 | 0.494624 | [0.463816, 0.527436] | 0.2247 | 0.0140 | 0.2667 |
| **`neverReached`** | 1674 | 0.368317 | **0.428315** | [0.405241, 0.452039] | **0.4295** | 0.0060 | 0.1362 |

⭐⭐⭐ **THE HEADLINE OF THE ANATOMY: THE INTENDED MAN IS AT THE ELECTED POINT ON 8.84 % OF
CARRIED PASSES.** `arrival.meanReceiverDistanceMetres` is **2.889244** m
[2.827772, 2.948392] against a mean carried lead of **7.032958** m [6.928370, 7.134325]. **The
ball is played seven metres into space and gets there while he is still nearly three metres
short.** The distance histogram (1 m bins, pooled over 2,871 arrivals that reached the point):
**[241, 734, 716, 559, 335, 164, 65, 27, 14, 16]**.

⚠ **AND `arrivalAbandonedVsReached` IS UNRESOLVED** (Δ **+0.014524** [−0.045057, +0.075045],
**0.242** hw): among carried passes the ball actually reached, *how far short the receiver was*
does **not** predict completion at this power. §N sized nothing on the `reached` cell (n = 402)
and it is read directionally.

**THE LANE AT BOTH INSTANTS** — the shipped readers CALLED, on the elected point:

| face | at the ELECTION | at the STRIKE | Δ | ci95 | \|Δ\|÷hw |
|---|---:|---:|---:|---|---:|
| `laneOpenness` (mean) | **0.897891** | **0.880413** | **−0.017478** | [−0.020789, **−0.014054**] | **5.190** |
| shell-BLOCKED share | **0.009461** | **0.048405** | **+0.038944** | [**+0.033433**, +0.045003] | **6.732** |

⭐ **THE WORLD DOES MOVE, AND IT MOVES THE RIGHT WAY** — the lane closes a little and a body is
on the line **four times as often** at the strike as at the election. **⚠ BUT THE ABSOLUTE SIZE
IS TINY**: 4.84 % of carried lines are shell-blocked when the ball leaves, and the signed shell
delta is **[5, 4358, 182]** (`−1` / `0` / `+1`) — **the shell state is UNCHANGED on 4,358 of the
4,545 carried passes**. The signed lane-delta histogram (0.1 wide, centre holds zero) is
**[23, 12, 87, 237, 616, 3294, 124, 31, 31, 24, 66]** — **3,294 of 4,545 sit in the zero bin**.
⭐⭐ **AND THE CARRIED CLASS CAROMS LEAST OF ALL** (0.065787 against 0.152652 wind-up-to-feet and
0.195489 synchronous-to-feet), which is DX-T1 §R4's strike improvement seen from inside the
armed arm. **Whatever is eating the carried ball, it is not bodies on the line.**

⭐⭐⭐ **WHERE THE LOST BALLS ACTUALLY GO — THE OUTCOME LADDER, PER CLASS** (shares of the class):

| class | completed | intercepted | out | ⚠ **unresolved** |
|---|---:|---:|---:|---:|
| ⭐⭐ `carried` | 0.4889 | **0.2678** | 0.0092 | ⛔ **0.2341** |
| `windupToFeet` | 0.6109 | 0.3250 | 0.0020 | **0.0621** |
| `syncLed` | 0.5085 | 0.3280 | 0.0034 | **0.1600** |
| `syncToFeet` | 0.6376 | 0.3060 | 0.0010 | **0.0554** |

**THE CARRIED BALL IS INTERCEPTED LESS AND CAROMED LESS THAN EVERY OTHER CLASS. THE ENTIRE LOSS
SITS IN `unresolved`** — 23.41 % against 6.21 %, and `syncLed` (led, not stale) sits at 16.00 %,
between them. ⭐ **有故事就要有探针 — A LABELLED HYPOTHESIS WITH ITS SOURCE LINE, NOT A FINDING**:
the engine expires its own delivery record after 3.5 s
(`src/sim/Match.ts:3118`, ONE occurrence: `if (this.pendingPass && this.simTime -
this.pendingPass.t > 3.5) this.pendingPass = null;`), so a ball nobody collects inside that
window is scored as **neither** a completion **nor** an interception. A ball led 7 m into space
takes longer to be collected. ⚠ **That line was NOT pinned before the battery**, so this is a
labelled reading with a cited source, and the probe that would settle it is unbuilt.

## §R3 (c) THE STALENESS–OUTCOME LINK — THE FROZEN VERDICT, AND WHY IT IS NOT THE ANSWER

> **THE FROZEN RULE, §P.C**: the interval entirely below zero ⇒ **FALLING** ⇒ the re-ask door.

| face | upper motion half | lower motion half | Δ | ci95 | \|Δ\|÷hw | verdict |
|---|---:|---:|---:|---|---:|---|
| ⭐ **within wind-up-length strata (THE ANSWER OF RECORD)** | **0.417680** (n = 1233) | **0.515399** (n = 3312) | **−0.097718** | [−0.129304, **−0.065563**] | **3.066** | ⛔ **FALLING** |
| ⚠ the raw marginal (NOT the answer) | 0.416712 | 0.537051 | **−0.120338** | [−0.151204, −0.088984] | 3.868 | — |

The motion histogram (0.25 m bins) is **[220, 675, 1072, 759, 585, 511, 337, 208, 90, 50, 25, 13]**
with completions **[116, 410, 561, 377, 264, 212, 124, 82, 41, 22, 9, 4]**; the frozen per-stratum
split indices are **[−1, 1, 2, 3, 5, 6, 6, 8, 8, 8]** and the raw marginal split is **3**.
`motion.meanReceiverDisplacementMetres` **0.952932**, `motion.meanNearestDefenderDisplacementMetres`
**0.766843**, `motion.meanWindupTicks` **10.585479**.

⛔ **THE VERDICT OF RECORD IS `FALLING`, REPORTED EXACTLY AS FROZEN. NOTHING IS RE-CUT.**

⚠⚠⚠ **AND HERE IS THE HONEST READING THE FROZEN FACE CANNOT GIVE ITSELF — STATED AS A LIMIT OF
THE INSTRUMENT, NOT AS A RE-SCORE.** §P.A2's own anchored law is `lead = passLeadSupport ·
motion(ELECTION) · dist/PTP_FLIGHT_SPEED · PTP_LEAD_FLIGHT_MUL`. **The lead's length is
PROPORTIONAL TO THE RECEIVER'S SPEED AT THE ELECTION.** And (c)'s motion metric is that same
receiver's displacement over the wind-up, i.e. ≈ *his speed × the wind-up length*. §P.C
stratified on the **wind-up length** — so **WITHIN A STRATUM the motion metric is a near-monotone
proxy for the receiver's SPEED, and therefore for the LEAD LENGTH.** ⇒ *"completion falls with
world-motion"* and *"completion falls with how far the ball is played in front of him"* are, in
this census, **very nearly the same measurement**. §P.C removed the wrong confound, and it says
so here rather than being caught saying it later.

⭐⭐ **THE TWO INSTRUMENTS THAT ISOLATE STALENESS ALONE — NEITHER CONFOUNDED WITH LEAD LENGTH —
BOTH READ FLAT:**

1. **(a)'s `syncLed` CONTROL** — the SAME led geometry with the election **zero ticks old**:
   Δ **−0.019624** [−0.057277, +0.017133], **0.527** hw. **UNRESOLVED.**
2. **(d)'s AGREEMENT SPLIT** (§R4) — passes the strike-time world would have RE-AIMED against
   passes it would have left alone: Δ **−0.021073** [−0.066240, +0.022397], **0.475** hw.
   **UNRESOLVED.**

**BOTH point estimates are ≈ 2 points, in the same direction, and neither resolves from zero —
against a LED-BALL cost of ≈ 13 points (syncLed vs syncToFeet: intervals widely disjoint, [0.474558, 0.542411] vs [0.630414, 0.644786]; ⚠ #356 correction — no cross-face Δ was bootstrapped for THIS pair; the 7.8/9.2-hw figures belong to the carriedVs* contrasts).**

## §R4 (d) THE COUNTERFACTUAL RE-ASK — THE DOOR'S VALUE, MEASURED BEFORE IT IS BUILT

> ⚠⚠ Read §P.D before quoting anything here: **the argmax is NOT re-run** (so this is *"would the
> door aim at a different point for the same man"*, never *"would he pass to someone else"*) and
> **the motion source is TRUTH at both instants** (the percept source is not re-derivable
> offline without writing to the body's memory).

| agreement class | n | share | completion | ci95 |
|---|---:|---:|---:|---|
| **`agree`** (< 0.5 m) | 658 | **0.144774** | **0.512158** | [0.475358, 0.550926] |
| **`minor`** ([0.5, 1.5) m) | 1195 | **0.262926** | **0.471130** | [0.443973, 0.500820] |
| **`disagree`** (≥ 1.5 m) | 2692 | **0.592299** | **0.491085** | [0.472024, 0.510566] |

`reAsk.meanDeltaMetres` **2.829174** m [2.733978, 2.921447]; `reAsk.grewShare` **0.454125**
(the strike-time lead is LONGER on 45.4 % of carried passes, so the drift is close to
symmetric); the delta histogram (0.5 m bins, ≥ 6 m overflow) is
**[658, 680, 515, 431, 392, 397, 272, 232, 130, 132, 85, 81, 540]**.

⭐⭐⭐ **THE DOOR WOULD MOVE THE AIM ON 59.2 % OF CARRIED PASSES — AND IT WOULD BUY NOTHING
MEASURABLE.** `reAskDisagreeVsAgree` = **−0.021073** [−0.066240, **+0.022397**], **0.475**
half-widths. **The passes a strike-time re-ask would have re-aimed complete no worse than the
passes it would have left alone**, and the ordering is not even monotone (`minor` **0.471130**
sits *below* `disagree` **0.491085**). ⛔ **The re-ask door's measured ceiling on this census is
≈ 2 completion points, and it does not resolve from zero.**

⭐ **THE INSTRUMENT'S OWN HONESTY FACE** (§P.D): `honesty.meanPerceptGapMetres` **0.405738** m
[0.372591, 0.438258], histogram **[4235, 62, 38, 37, 26, 22, 18, 19, 16, 15, 7, 4, 46]** —
**the smallest bin holds 4,235 of the 4,545 carried passes.** So the TRUTH-motion
re-derivation is a faithful stand-in for the live percept election on the overwhelming majority
of decisions, and the 2.83 m mean re-ask delta is **TIME, not perception**. Said with the face
rather than assumed.

## §R5 THE INSTRUMENT RECEIPTS (⚠ never football findings)

* **`gDepositCarriesElection` — DX-T1 §R6's pin RE-RUN on this block**: **35,186** captures,
  **4,625** carried-and-EQUAL, **0** mismatches, **0** resolve mismatches. ⚠ 4,625 arm-time
  carries against **4,545** booked carried flights — the walk books a flight only when it retires
  as a MEASURED ground pass, so a carried wind-up that is cancelled or not classified measurable
  is captured by the pin and not by the face. Both counts published; neither derived from the
  other (DX-T1 §R6's own note, and the same arithmetic).
* **`gLockstep`** — the three observation wrappers are byte-inert: scratch seeds
  **900,000,700–702**, traced vs untraced, byte-identical whole-match signatures.
* **`gStrikeAttributionComplete`** — **20,714** strikes, **0** unattributed (completeness 1).
* **`gSeamSitesPinned`**, **`gSrcUntouched`**, **`gGenomeClean`**, **`gGeneValuePinned`** all
  green on every walked match; the four doors are named by no world and no preset.
* **PROVENANCE, COPIED FROM THE ARTIFACT'S OWN FIELDS** (#345 item 1): DX-T1's byte hash of
  record `16af272a6f9dfb7204ddc35d4dbc186a6352881a49f5f2031da18e405c32b799`
  (`quotedContext.dxT1.source.sha256`) and DX-T1's own
  `hashedBodySha256 = 708445faf6000318883f0d6f014399ad214beed31fc071f7ddf5ca239aca2496`.
* **PERF**: `batteryWallSeconds` **105.493**, `meanWallSecondsPerMatch` **0.129365** — ⚠ a
  machine reading on one machine, the walk's own timed region including three wrappers.

## §R6 CONTEXT, AND SEEDS AS CONSUMED

`context.measuredGroundPassesPerMatch` **76.4925** [75.5875, 77.45375] ·
`context.passCompletion` **0.576450** [0.572747, 0.580186] ·
`context.goalsPerMatch` **3.185** [3.06125, 3.30625]. ⚠ **DIFFERENT-BATTERY CONTEXT ONLY**:
DX-T1's armed arm published `passCompletion` **0.580483** and `goalsPerMatch` **3.11375** on
block 12,527,000–999. **No Δ is computed across batteries and none is implied.**

Block **12,528,000–999**: the BATTERY **12,528,000–799** (**800** walks, ONE arm; booked = walked
from the CELLS' own distinct-seed set) · the construction receipt **12,528,999** (**1**) —
**801 booked battery walks**. ⚠ **12,528,800–998 were NOT walked**; the block is retired whole of
record and the next free sim seed is **≥ 12,529,000** (⚠ derived bookkeeping, not an artifact
quotation). Scratch: the LOCKSTEP receipt walked **900,000,700–702** (6 walks) and the
PREFLIGHT / SIZING SMOKE walked **900,000,800–811**. The bootstrap's resample rng was seeded
from **12,528,000**. **STATS CONSUMED: ZERO** — registry of record stays **73**, next stats base
≥ **117,600**.

## §R7 THE SIZING, CHECKED AGAINST WHAT IT BOUGHT

| face | ex-ante EXPECTED Δ half-width (§N) | ⭐ REALISED Δ half-width | did the assumption hold? |
|---|---:|---:|---|
| `carriedVsWindupToFeet` (a) | **0.01948661** | **0.01562931** | ✅ **BETTER than assumed** (×0.80) |
| `stalenessWithinStrata` (c) | **0.02485160** | **0.03187053** | ⚠ **WORSE than assumed** (×1.28) |

⚠ **THE 12-CLUSTER SCRATCH VARIANCE WAS OPTIMISTIC ON (c) AND PESSIMISTIC ON (a)**, which is
what a 12-cluster estimate is for. Neither shortfall bound anything: (a) resolved at 7.8 hw and
(c) at 3.1 hw. ⭐ **THE REUSABLE LESSON**: a scratch-smoke variance is a *scale* estimate, not a
*precision* one — the §N table's job was to say which magnitudes were buyable, and it did
(a 3-point staleness effect was declared UNBUYABLE at 800 before the battery, and the two
staleness-isolating contrasts came back with half-widths of **0.03720513** and **0.04431844**,
i.e. exactly the ~3–4 point resolution §N promised).

## §DOUBTS (declared)

1. ⭐⭐⭐ **THE FROZEN (c) FACE AND THE TWO STALENESS-ISOLATING CONTRASTS DISAGREE, AND §R3 SAYS
   WHY.** (c) reads FALLING because its motion metric is a near-proxy for LEAD LENGTH under the
   pinned PTP law; `syncLed` and the (d) agreement split, neither of which varies lead length,
   both read flat at ≈ 2 points. ⛔ **The frozen verdict is published as FALLING because that is
   what was frozen.** The composite reading is the census's, and the commander's to weigh.
2. ⭐⭐ **`syncLed` IS THE LOAD-BEARING CONTROL AND IT IS UNPOWERED BY DESIGN** (n = 881, 1.44 %
   of the population; §N sized nothing on it). Its interval [−0.057277, +0.017133] is consistent
   with a staleness cost anywhere from **+1.7 to −5.7 points**. ⛔ **"Unresolved" is not "zero"**,
   and a further block on `syncLed` alone is the honest way to tighten it.
3. ⭐⭐ **THE CLASSES ARE OBSERVATIONAL, NOT RANDOMISED** (§R1's brake). A one-touch release
   happens in different situations from a wound-up pass, and the decomposition carries that
   selection. **The clean version of §R1 is an ARM, not a census** — and the arm that would give
   it is a `dxWindupAim`-armed world with the wind-up seat disabled, which is a mechanism door,
   not this stage's business.
4. ⭐ **`unresolved` CARRIES THE WHOLE LOSS AND IT IS PART INSTRUMENT** (§R2). The 3.5 s
   `pendingPass` expiry at `Match.ts:3118` is a **labelled hypothesis with a cited source line**,
   not a gated face — that line was not pinned before the battery, and the probe that would
   settle it (per-flight time-to-collection against the expiry) is unbuilt.
5. ⚠⚠ **(d) IS DOUBLY SCOPED** (§P.D) and one of the two scopes is now SIZED: the percept gap is
   in the smallest bin on 4,235 of the 4,545 decisions, so the truth-motion stand-in is faithful. **The
   OTHER scope is not sized at all** — the argmax was never re-run, so a re-ask that changed the
   TARGET is outside everything measured here. ⛔ **A re-ask door that re-elects the man is a
   strictly larger door than the one this census priced.**
6. ⚠ **`otherGround.toIntendedShare` IS A STRUCTURAL ZERO, NOT A MEASUREMENT.** The intended-man
   check reads the strike record the `performPass` wrapper builds, and throughBall / cutback
   releases have none. The class's completion (0.437862) and interception (0.452987) shares are
   real; its to-intended cell is an instrument artefact and is marked ⚠ in §R1 rather than
   quietly published.
7. ⚠ **THE ARRIVAL READ IS GEOMETRIC** (§P.B item 3 of §P.H) and `arrivalAbandonedVsReached` is
   unresolved (0.242 hw) — *how far short he was* does not predict completion at this power,
   which is itself consistent with §R2's finding that the loss is collection time rather than
   contest at the point.
8. ⚠ **ONE ARM, NO CROSS-BATTERY Δ.** Every DX-T1 number in this document is labelled
   DIFFERENT-BATTERY CONTEXT.

## §DEV — the deviations, declared

1. ⭐ **THE `syncLed` CONTROL IS THIS CENSUS'S OWN ADDITION**, not #355 item 2's words. The
   dispatch named *"one-touch/led synchronous passes"* in (a); freezing them as a SEPARATE class
   from `syncToFeet` (rather than pooling the synchronous population) is what turned (a) into a
   staleness discriminator, and it was written into §P.A **before** any battery seed. It is
   named here so the next executor sees which line of the census did the work.
2. ⭐ **THE OUTCOME LADDER TREATS `caromed` AS ORTHOGONAL** rather than as the fourth outcome the
   dispatch's *"completed / intercepted / carom / out"* phrasing suggests. Reason, frozen at
   §P.B: a ball may carom and still be recovered by the passing side, so folding it into the
   ladder would score two different facts identically. Both readings are published (the ladder
   AND `caromShare` per class), so nothing the dispatch asked for is missing.
3. ⭐⭐ **(d) IS SCOPED TWICE AND THE SCOPES ARE GATES, NOT PROSE** (§P.D): the argmax is not
   re-run and the motion source is truth at both instants. The dispatch's own ⚠ ordered exactly
   this ("scope the counterfactual to what IS re-derivable and say so"), and the percept gap is
   published as a face so the size of the second scope is visible rather than asserted.
4. ⭐ **THREE OBSERVATION WRAPPERS** (`armPendingPass`, `resolvePendingPassWindup`,
   `performPass`) — the DX-T1 §DEV 3 precedent, one more than DX-T1's two because the class and
   the strike-instant reads both live at the `performPass` seat. All three delegate unchanged
   and `gLockstep` proves them byte-inert. **X-SRC-ZERO holds.**
5. ⭐ **THE BLOCK IS NOT CONSUMED WHOLE** (§P.E): 800 of 1,000 seeds walked, one arm. The
   remaining 199 stay virgin and the block is retired whole of record — declared at §P, not
   discovered at §R.
6. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron rule:
   governance files are the commander's).

## §人话 — 带位移的球到底差在哪?是决定太陈旧,还是往空当传本来就难?

> ⚠ **先说钟**(#339 立的双钟法条):我们一场球显示钟走满 90 分钟,按 sim 秒直读只有 240 秒
> (1 sim 秒 = 22.5 显示秒)。下面所有「每场几次」都按**我们这一场**读,也就是显示钟的一场
> 90 分钟。占比类的数换钟不变。
>
> 上一轮的坏消息是:腿终于会往脑子选的那个点踢了,但**球反而更难传成**。当时留了两个说法:
> 一个是「引拍那一下算好的点,等真踢出去时已经过时了」(**陈旧**),另一个是
> 「往人前面空当传这件事本身就难」(**落点**)。这一轮只做一件事:**把这两个说法分开量。**

### 一、答案:**难的是「往空当传」,不是「决定过时」** ⭐⭐⭐

同样一场比赛里的地面传球,成功率(⚠ #356 补:下表是五类冻结分类里的四类;第五类 otherGround n=7,934、成功率 0.437862 —— 比带位移的还低 —— 是断球后的散球/解围类,不在「选择器选出来的传球」讨论范围内,完整五类见 §R1):

| 传法 | 成功率 | 每场次数 |
|---|---:|---:|
| 直接传到脚下(不引拍) | **63.8 %** | 21.9 |
| 引拍后传到脚下 | **61.1 %** | 37.8 |
| **不引拍、直接往空当踢**(⭐ 决定一秒都没放旧) | **50.9 %** | 1.1 |
| **引拍后往空当踢**(就是新门那种球) | **48.9 %** | 5.7 |

**关键在第三行。** 那种球是「脑子刚算完、腿立刻就踢」——**完全没有变旧的可能**。它的成功率
**50.9 %**,和会变旧的那种(**48.9 %**)**几乎一样**,差的那 **2 个百分点我们量不准,连
「是不是零」都说不了**。

而「传到脚下」和「传空当」之间差了 **13 个百分点**(两个区间完全不相交;⚠ #356 修正:这一对没有单独做配对检验,「8 到 9 个半宽」是 carried 对比组的数字,不是这一对的)。

> **一句话**:让球员在踢之前重新想一遍,最多值 **2 个百分点,而且这 2 个点我们证明不了存在**;
> 往空当传本身要付的是 **13 个百分点**。

### 二、球到的时候,人在哪? ⭐⭐

给他前面平均送了 **7.03 米**。球飞到那个点的时候:

* **只有 8.8 % 的情况人已经到了**;
* 平均**还差 2.89 米**;
* **36.8 % 的球,人根本没赶到那个点之前球就没了**。

### 三、丢的球去哪了 —— 不是被断,也不是弹身体 ⭐⭐⭐

反直觉但数据很干净:**往空当踢的球被断得更少**(26.8 % vs 32.5 %),**弹身体也最少**
(6.6 %,是四类里最低的——这正是上一轮「撞身体变少」的来源)。丢的球全落在第四类:
**「没人处理」——23.4 %,而传脚下只有 6.2 %。**

⭐ **一个说得通、但只是猜想的解释**(带源码出处,没做探针):引擎里传球记录 **3.5 秒**就过期
(`Match.ts:3118`)。球往前送七米,收球要更久;**超过 3.5 秒还没人捡,这球既不算传成也不算被断,
就消失在账上了**。⚠ 这条线出手前没钉,所以它是**带标签的猜想**,不是结论。

### 四、那「重新想一遍」这扇门到底值多少?我们**在造之前先量了** ⭐⭐

我们离线把每一脚球在**真正踢出去那一刻**重算了一遍落点:**59.2 % 的球,那一刻算出来的点和引拍时
算的不一样**(平均差 **2.83 米**)。

**但是——「会被改」的那些球,成功率 49.1 %;「不会被改」的那些球 51.2 % —— 差 2 个点,
量不准。** 也就是说:**门确实会动很多球的落点,但动了不见得更好。**

⚠ 老实交代两条这个算法**做不到**的事:(1) 我们**没有**重跑「传给谁」那一整套打分——那段代码
是闭包,抄一份出来迟早会跟真的漂开,所以**拒绝抄**;这里只回答「同一个人,落点会不会变」。
(2) 球员脑子里记的是**他看到的**速度,把它读出来会改写他的记忆、污染这场比赛,所以两边都用
**真实速度**算。⭐ 这一条我们**量了大小**:4,545 个球里 4,235 个,两者差落在最小那一格,所以这个替代是可信的。

### 五、有一条冻结的规矩读出了相反的结论,照实报 ⛔

出手前我们冻了一条规矩:「把球按**引拍期间世界动了多少**分档,如果成功率随之下降,就说明该修
陈旧」。它读出来是**下降的**(−9.8 个百分点,离零 3.1 个半宽)。**照冻结的规矩,这一条指向那扇门。**

⚠ **但这条尺子有毛病,而且毛病能从源码上说清**:引擎里那个提前量本来就 **= 队友速度 × 距离 ×
系数**——人跑得越快,球送得越远。而「引拍期间他动了多少」≈ **他的速度 × 引拍时长**。我们按
**引拍时长**分了层,所以层内「动得多」几乎就等于「跑得快」,也就等于「球送得更远」。
⇒ **这条尺子量的其实是「送得远不远」,不是「决定旧不旧」。** 而那两条真正只量「旧不旧」的
(第三行的对照 + 第四节的重算),**都读平**。

> **一句话收尾**:上一轮那个球变难的原因,**不是脑子的决定放旧了,是这种球本来就难收**——
> 人赶不到,球在场上多滚两秒就没人认领了。**「踢之前重新想一遍」这扇门,我们在造它之前先量了
> 它值多少:大约 2 个百分点,而且量不准。**
> ⛔ **这一版什么都没上线**,你现在玩的那个世界一个字节都没动。

## §COMMANDER CORRECTIONS OF RECORD (#356, 2026-08-27)

1. **The provenance digest DOES NOT REPRODUCE by the documented procedure** (verify MED):
   `hashedBodySha256` was computed BEFORE `gates.gFaces` was assigned (probe L1686 vs
   L1779), so the published value `5fb147d1…c2f1` hashes the body WITHOUT gFaces; a
   verifier following the allowlist gets `f9f0afa1…a167` and would suspect tampering.
   OF RECORD: the published digest is authentic but covers body-minus-gFaces; the
   verifier's empirical reproduction of BOTH values is the receipt. ⭐ STANDING ORDER
   (the third receipt-labelling lesson of the arc): the body hash is computed LAST,
   after every gate is written, and the artifact's own file byte-hash is published
   beside it.
2. **BODY_SCHEMA omitted `perSeedCells`** (verify LOW): the digest bound the conclusions
   but not the evidence they derive from (DX-T1's schema included the cells). Not
   exploited — the verifier re-derived every headline from the committed cells with
   zero mismatches — but the standing order extends: the hashed body INCLUDES the cells.
3. **The "13 points at 8–9 half-widths" sentence borrowed a resolution statistic**
   (verify LOW): the hw figures belong to the carriedVs* contrasts; the syncLed-vs-
   syncToFeet pair was never bootstrapped (its evidence is the widely disjoint
   intervals). Fixed in place at both sites. The 13-vs-2 fork's substance is unchanged.
4. **The §R3 PTP-proxy argument is post-sight and is RATIFIED AS AN INSTRUMENT LIMIT**
   (verify LOW): the realisation that §P.C's stratification made the motion metric a
   near-monotone proxy for lead length follows from the §P-anchored law itself; the
   FALLING verdict is published unchanged, and the two lead-fixed contrasts it defers
   to (syncLed; the (d) agreement split) were both §P-frozen. This is the honest form.
5. **The 人话 table silently dropped `otherGround`** (verify LOW): fixed in place — the
   five-class frozen partition is the partition; the fifth class (loose-ball/clearance
   grade, worst-completing) is now named where the reader can see it.
