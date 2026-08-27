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

> *(pending — this is the FREEZE commit; the battery has not been walked.)*
