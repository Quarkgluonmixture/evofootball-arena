# IN-T0 — THE SNAPSHOT LAW AT THE CARRIER'S CHOOSER GATEWAY (the dormant src seam)

> **Ordered by** COMMANDER RULING #324 item 4 (the #322 ladder's named next-after).
> **Bound by** [`IN-SNAPSHOT-CONTRACT.md`](IN-SNAPSHOT-CONTRACT.md) §2 — M-IN.1 (the snapshot
> law; PHYSICS STAYS TRUTH; wrongness during staleness is FREE), M-IN.3 (no new attributes,
> no new genes) and M-IN.4 (flags off ⇒ byte-identity per seam; composition proof at the
> world-9 stack; pin suites from birth).
> **Census of record**: [`IN-C0-PERCEPTION-SURFACE.md`](IN-C0-PERCEPTION-SURFACE.md) §R-FIX —
> **1,490** occurrences · **255** interpose sites (chooser 178 / executor 77, 23 files) ·
> **79** truth-bearing gateway sites on the three NAMED world collections · **81**
> alias-bound gateway sites carrying THIS SLICE's call-graph homework (#319 item 3).
> **Road B**: nothing ships. Flag `inSnapshotLaw`, default OFF, absent from `a4World`.

---

## §PRE-REGISTRATION (frozen before the battery — freeze commit)

### §P0 What this stage is, and is NOT

It is a **dormant src seam plus its permanent pin suite plus arming RECEIPTS**. Canon:
**receipts ≠ effect sizes** (homes: ruling #289 item 1 + BU-T1 §CORR item 5) — the walks
below publish counts with units and **make no football claim**. H-IN.1 (looks genuinely
taken; information differentiating outcomes) is the EXAM's business, and the LOOK itself is
IN-T1's (#324 item 4: *"NO look yet (o2Look/gaze = IN-T1)"*).

### §P1 The scope, as bound at dispatch (#324 item 4)

* **THE CARRIER'S CHOOSER ONLY** — `decideCarrier`'s option scoring and its helpers.
* Other-body reads resolve through a **per-reader SNAPSHOT VIEW**: inside the reader's field
  ⇒ **refresh to truth this decision**; outside it ⇒ **his LAST-SEEN position/velocity**.
* **F2 squareAcross** (90°, the engine's own named midpoint) is the field **OF RECORD**;
  **F4 contactHalfPrice** (115.376934°) is the **declared sensitivity arm**. ANGLE-ONLY.
* **PHYSICS STAYS TRUTH** (M-IN.1): executor / steering / contact untouched; the BALL is
  slice 1's domain and stays truth.
* **NO look**, **no new attrs/genes** (M-IN.3), **no new penalty terms** — staleness is FREE
  wrongness.

### §P2 ⭐⭐ THE FIVE DESIGN QUESTIONS, ANSWERED BEFORE THE CODE

**(a) THE LAW, and where it interposes.** ⭐ **AT THE GATEWAY, NOT AT THE READS** (IN-C0
§R-FIX.6's recommendation, taken literally): `decideCarrier`'s other-body truth reads all sit
DOWNSTREAM of the two sites where the named world collections are handed out, so the law
interposes **ONCE**, at the top of the function: the two `Team` bindings the whole chooser
reads through are **SHADOWED** by per-reader snapshot views, and **not one existing read line
is renamed**.

⭐ **WHY SHADOWING AND NOT RENAMING** — a dozen of `decideCarrier`'s exact source lines are
**PINNED VERBATIM** by other seams' permanent suites (`ptpPassLead` · `dlcDeliveryChoice` ·
`dlcStrikePlane` · `dvDeliveryValue`), and **A PINNED TEST IS A STOP, NEVER AN EDIT** (the
house rule stated in `PlayerBrain.ts`'s own DLC-T0s §SEAM comment). Shadowing turns that
constraint into a virtue: the seam is **ONE fork**, not thirty, and every pinned line stays
green. The shadow is a prototype-delegating `Team` whose ONLY own property is `players`, and
the bodies inside it are prototype-delegating `Player` views whose ONLY own properties are
`pos` and `vel` — so `gid`, `index`, `role`, `attrs`, `traits`, `sentOff`, `topSpeed`,
`heading` and everything else resolve to the real body and **nothing can silently go missing
when `Player` grows a field**.

**(b) ⭐⭐ THE COLD-START RULE, pre-registered and justified** (#324 item 4 asks for both).
A body this reader has **never had occasion to resolve** is seeded with **TRUTH at his first
read**, then ages normally. The three candidates, and why this one:

| candidate | verdict |
|---|---|
| **absent ⇒ unreadable** | REJECTED — it would make the seam a candidate FILTER (a man you never looked at vanishes from the pass ladder). That is a different and much larger mechanism than staleness; #324 item 4 scopes this slice to *"returns his LAST-SEEN position/velocity"*, not to deletion. |
| **seeded from the formation table** | REJECTED — it writes a position the reader NEVER SAW out of a hand-authored lattice: a taste constant exactly where #200 forbids one. (`formationSpot` is also a live function of the whole team's state, not a lineup card.) |
| ⭐ **truth at first read** | **ADOPTED** — the only seeding that adds **no error of its own**, so every stale read the receipts count was EARNED by a body leaving the field and moving. The doctrine's books are born absent; a footballer, by contrast, walks out knowing the lineup — the first read IS that knowledge, and everything after it is bought by looking. |

Operationally the first read of a body happens at the reader's FIRST carrier decision, so
"seeded at kickoff truth" and "seeded at first read" **coincide** for every body on the pitch
at kickoff, and a substitute is seeded when he is first priced rather than born invisible.
The receipts publish `chooserReadsColdStartShare` so the seeding's weight is auditable.

**(c) ⭐⭐ THE RESOLUTION BACK TO TRUTH — the M-IN.1 boundary, and it has THREE sites.**
The ladder is priced on the snapshot; from the winner onward every body is his TRUTH object
again, so the heading he sets, the `targetIdx` he publishes and the `perform*` strike that
follows all read the world **as it IS**. He CHOOSES on what he believes and the ball then
goes where his legs actually send it — the world corrects him, and staleness costs him
nothing but being wrong (M-IN.1's 延迟期间 principle, extended from time to space).

⚠ **THREE sites, not one — stated at freeze because a single site would have been a BUG**:

| # | site | why it is needed |
|---|---|---|
| 1 | the ladder's seven winners (`bestMate` · `bestLoftMate` · `bestRunner` · `bestCrossMate` · `cutbackMate` · `bestThrowMate` · `puntMate`), resolved immediately after the last `cands.push` | the ordinary path |
| 2 | `passMate`, resolved at the last statement before dispatch | it is **re-seated BELOW the ladder** by three blocks — the E2a-2 forced target, the perceived pass chooser's `chosen`, and the PW chooser's `pwMate` — each of which finds its body by scanning `team.players`, i.e. **the shadow**. Left alone, a stale view body would reach `performPass`/`armPendingPass` and **physics would strike a ghost**. ⭐ It is also the RIGHT semantics: `passMate === bestMate` gates the PTP lead on "the chooser's own winner is the man being passed to", and comparing a view against a truth object would answer NO for the very same body. |
| 3 | the kickoff back-pass `back`, resolved before the turn and the strike | a **pre-ladder** branch that scores its own target off the shadow and then strikes. (At kickoff the cold-start rule makes every entry truth anyway, so this is a correctness guard, not a live path — stated rather than relied on.) |

⚠ **WHAT DOES ride snapshot-derived arithmetic into the strike, disclosed**: the PTP lead
vector, the CB knock direction/push, the through-ball chip flag and the corner key zone are
**numbers the chooser computed**, and they are handed to the executor as the chooser's own
output — as they are today. `performPass` itself re-reads the target's TRUTH position; only
the additive priced displacement carries snapshot-borne arithmetic. That is the choice/act
split the law is made of, not a leak.

**(d) The re-decide cadence, and what the view costs.** The view is built **once at entry to
`decideCarrier`**, on the shipped `AI_INTERVAL` decide cadence — **no new tick, no new call
site**. ⚠ Consequence, stated not hidden: the refresh half therefore also fires on the
pre-ladder restart/keeper branches (a body on the ball is looking at the picture whether or
not he ends up scoring options).

**(e) ⭐ SERIALIZATION — the decision, made explicitly (the DF-T0 precedent, #323 item 1).**
The store and the ledger are **PER-MATCH TRANSIENT STATE**, exactly like `perceptionMemories`:
`League.toJSON` does not name them, `cloneSimulationState` does not copy them, the render
adapter never sees them. Canon VERBATIM: *"WORKER-SIMMED fixtures play the SHIPPED world
(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4
correction; matches the perf diagnostic)"* (home: ruling #283.2(iv)) — so a worker-simmed
fixture plays with the door SHUT and **no book exists at all**. Pinned as source facts.

### §P3 ⭐⭐ THE FIELD LAW (frozen, pre-registered, exact)

A body is IN the reader's field **iff**

```
(heading · (body.pos − reader.pos)) / |body.pos − reader.pos|  ≥  dotMin(field)
      or   |body.pos − reader.pos| ≤ 1e-9      (the degenerate guard: felt, not seen)
```

with the two ceilings taken by **ANCHORED EXTRACTION** — canon VERBATIM: *"a src-extracted
constant pins its extraction to the NAMED call site — anchored match + line receipt — never
first-occurrence"* (home: BK-C0 §CORR item 1):

| field | the NAMED anchor line, verbatim | misalign ≤ | `dotMin` | half-angle |
|---|---|---:|---:|---:|
| **F2 squareAcross** (OF RECORD) | `src/sim/mechanics.ts`: `` * 0 = striking dead ahead, 0.5 = square across the body, 1 = fully blind.`` | **0.5** | **0** | **90°** |
| **F4 contactHalfPrice** (SENSITIVITY ARM) | `src/sim/Match.ts`: `          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),` | **0.5 / CONTACT_BLIND_PEN** | **−0.428571…** | **115.376934°** |

* F2 is the **engine's own named midpoint** — `kickMisalignment` is `(1 − cosθ)/2` and its own
  doc comment calls `0.5` *"square across the body"*. Not a taste cone (#200).
* F4 is the CONTACT blind price **at half**: that factor equals 0.5 exactly when
  `blind = 0.5 / CONTACT_BLIND_PEN`. The census's published `dotMin = −0.428571…` is
  reproduced **by derivation** and never typed.
* ⚠ **DISCLOSED, not smoothed**: the derivation gives **115.376934°**; IN-C0 §R2 PUBLISHED
  **115.3768°** — the census's own 4th-decimal rounding. The seam pins the DERIVATION and the
  pin suite asserts both forms so the discrepancy can never be lost.
* ⚠ **ANGLE-ONLY, no distance term** — IN-C0 §R2 `visionAlgebra.honestLimit`, verbatim: *"the
  blind algebra prices FACING and nothing else — it carries NO distance term, so F1–F4 are
  ANGLE-ONLY fields."* A body therefore "sees" a mate 50 m away if he faces him: a **named
  fork** (IN-C0 §R8), not a defect of the derivation. The only shipped range lives in the
  TASTE-labelled F5 cone, which this slice does not use.
* ⚠ **POSITION AND VELOCITY ONLY** (#324 item 4, verbatim: *"returns his LAST-SEEN
  position/velocity"*). Other bodies' `heading`/`bodyDir` are **NOT** staled — see §P4's
  named-out row.

### §P4 ⭐⭐ THE SEAM MAP + THE CALL-GRAPH HOMEWORK, DISCHARGED FOR THE CARRIER SURFACE

**Needle PREFIX stated** (canon VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle
and enumerates EVERY occurrence's site"*, home PC-C0 §CORR item 1): the needle family is
**`inSnapshot*`** and its members are exactly `inSnapshotLaw`, `inSnapshotField`,
`inSnapshotStore`, `inSnapshotLedger` and the module name `inSnapshotView`.

**THE INTERPOSED SURFACE** (numbers re-derived from the census artifact `gatewaySites` /
`interposeSitesEnumerated` against HEAD's `decideCarrier` line span 121–1486):

| what | count | disposition |
|---|---:|---|
| named-collection gateway sites INSIDE `decideCarrier` (`opp.players` 26 + `team.players` 12) | **38** | ⭐ **ALL INTERPOSED** by the two shadow rebindings — zero read lines renamed |
| other-body chooser truth reads (interpose sites) INSIDE `decideCarrier` | **31** | ⭐ **ALL snapshot-borne at run time**, byte-identical in source |
| `PlayerBrain.ts` named-collection gateway sites OUTSIDE `decideCarrier` (`:1530`, `:1570`, `:1760`, `:1781`) | **4** | **NAMED OUT** — the keeper decider and the off-ball chooser (the latter is ALREADY percept-based, IN-C0 §R1) |
| `PlayerBrain.ts` interpose sites OUTSIDE `decideCarrier` | **13** | **NAMED OUT**, same two consumers |

**⭐⭐ THE 81 ALIAS-BOUND GATEWAY SITES (#319 item 3's homework — a text census could not do
this; this is a read of the CALL GRAPH).** All 81 are enumerated in the census artifact
(`opponents` 45 · `teammates` 22 · `players` 8 · `outfield` 6, across 14 files). Verdict:

| group | sites | provenance, proven | disposition |
|---|---:|---|---|
| **`opponents` PARAMETER-BOUND, on the carrier's call graph** — `formations.ts:511` (`defenderLineLocalX`) · `:530` (`offsideLineLocalX`) · `:552` (`runTarget`) · `:582` (`runBurstPoint`) · `deliveryValueSeat.ts:185` (`flightExposure`) · `:251` (`deliveryRiskPrice`) · `carryChoiceSeat.ts:177` (`knockCandidates`) | **7** | each is a **function PARAMETER**, and every call site inside `decideCarrier` feeds it `opp.players` — i.e. the SHADOW. None of the seven re-enters `team`/`opp`/`match` for another body's position. | ⭐ **INTERPOSED** (covered by the same interposition) |
| **`teammates` PARAMETER-BOUND** — `perceivedPassChoice.ts:152` (`passChoiceCandidateGids`) | **1** | a parameter, fed `team.players` at both call sites in `decideCarrier`; its output is a **gid list**, and `gid` delegates through the view, so the candidate set is identical either way. | ⭐ **INTERPOSED** |
| ⭐ **NOT A COLLECTION AT ALL** — `formations.ts:490`, `:493`, `:502` | **3** | `shapeReady`'s `outfield` is a **scalar COUNTER** (`let outfield = 0;` · `outfield++` · `Math.min(3, outfield)`). ⭐ **THE CALL-GRAPH-ONLY FINDING**: a text census cannot tell a counter from a roster; three of the 81 are needle false positives. | **NOTHING TO INTERPOSE** (reported, not counted as covered) |
| **REACHED FOR, not passed** — `whetherEye.ts:147` | **1** | `for (const mate of match.teams[p.side].players)` — but the POSITION it prices comes from **the whether-seat's own SNAPSHOT** (its own comment: *"counted from the SNAPSHOT … the POSITION is the percept"*); the roster read is registered **identity** truth (`role`/`sentOff`), which #324 item 4 scopes out (position/velocity only). | **NAMED OUT**, with provenance |
| **OFF THE CARRIER'S CALL GRAPH ENTIRELY** — `carryAffordance.ts` 18 · `offBallAffordance.ts` 18 · `passAffordance.ts` 9 · `actionExecutor.ts` 7 · `relativeAffordance.ts` 6 · `TeamBrain.ts` 5 · `offBallCoordination.ts` 3 · `stationEye.ts` 2 · `steering.ts` 1 | **69** | the executor, off-ball and team-brain phases. **PROOF**: a module-level import closure from `decideCarrier`'s 13 callee modules reaches only 5 of these 9, and **every one of those 5 hits is a TYPE-ONLY chain through `Match`'s own imports** (`updateTeamBrain` / `executeAction` / the eye tables) — not a value call from the chooser. | **NAMED OUT** |
| **TOTAL** | **81** | 8 interposed · 3 not-a-collection · 70 named out | ✔ every one accounted |

**OTHER NAMED-OUT READS ON THE CARRIER SURFACE, each with its reason:**

* `match.shotQuality(p)` — its `pressureAt` is **SHARED** with `mechanics.performShot`, so
  interposing there would price a **STRIKE** off a snapshot and break M-IN.1.
* `match.perceivedSnapshot(p, scope)` / `match.reachProfiles()` — **already percept-side**
  (IN-C0 §R1: `edsPerceivedChoiceArmed` and `edsPerceivedDefenceArmed` are both `true` in
  world 9); nothing to interpose. The `scope` sets are built from `gid`s, which delegate.
* every other body's `heading` / `bodyDir` (the one carrier-surface facing read is
  `blockReadiness` inside `effectiveBlockers`) — #324 item 4 scopes the law to
  position/velocity.
* every `perform*` call, every heading write and every executor read — **M-IN.1**.
* the marking surface, the off-ball chooser, the physics layers — **UNTOUCHED**; the pin suite
  asserts no executor/marking/physics/render file names the needle at all.

### §P5 The pin suite (from birth — canon: *pin suites from birth*, home ruling #297 item 7)

`tests/inSnapshotLaw.test.ts`, in the house form (`dfAssignPersist.test.ts`): **26 pins** —
dormancy (absent ≡ false ≡ field-set-but-shut, byte for byte, BOTH world shapes × 2 seeds,
pooled digest) · the ledger and the store empty when shut · arming is a real change at both
fields · the two fields are different worlds · **the field law** (seen at A, turn away, he
moves to B, the chooser still reads A — with the prototype delegation proven) · **the refresh
law** · **the cold-start rule** (truth exactly once, then it ages) · the reader is his own
truth object · sent-off bodies never staled · the degenerate guard · `real()` as the physics
gate · **the anchored F2/F4 extractions** (named lines, singular, with the 4th-decimal
disclosure) · **the F4-only band proven to be a band** · the three resolution sites verbatim
and the nine `inView.real(` calls counted · **the armed-walk identity audit** (no action ever
names a body absent from the truth rosters, at both fields, non-vacuously) · one consumer
only · no look / no new knobs (the import list pinned exactly) · no serialization · the store
bounded at ≤ 11 per reader · the composition power set · lifecycle clean · no refusal · the
seam map (occurrence COUNTS per needle, PREFIX stated) · the fingerprint of record.

### §P6 Gates (frozen; a RED gate stays red and is reported)

`gWorldOkEveryWalk` · `gSeedsBookedEqualWalked` · `gArmsTripledPerSeed` ·
`gAnchorsResolveOnce` · ⭐ `gBothFieldsFire` · `gShutLedgerEmpty` · ⭐ `gF4LessStaleThanF2`
(the wider field must serve strictly less staleness — the band, as a gate) ·
`gFlipDenominatorsAgree` · `gFlipPopulationNonEmpty` · `gStoreWithinCeiling` ·
`gArmsDistinguishable` · ⭐⭐ `gDormancyByteIdentical` · `gFingerprintUnmoved`.

### §P7 Seeds and stats (pre-registered — BOOKED = WALKED, the block consumed whole)

* **Block 12,511,000–999**, opened by #324 item 4, **consumed whole**.
* Battery: `12,511,000–039` (40 seeds) **+ the block's `12,511,999` receipt seed** = 41 seeds
  × **3 arms** (shut · armed-F2 · armed-F4) = **123 walks**.
* Smoke prefix **in band**: `12,511,800/801/802` — the same seeds the permanent pin suite uses.
* **STATS: none expected.** The receipts publish counts; cluster CIs are bootstrap resamples
  of the walked seeds, not a registry-consuming statistic. The next stats base stays ≥
  **115,200**.

### §P8 PERF — the budget is a BUDGET (the DF-C0 anchor idiom)

`docs/perf/baseline.json` is hashed as **bytes** and its own fields quoted: `usPerStep`
**5.32**, and the phase this seam lives entirely inside — `decide` **0.54 µs/step** (10.0 %).
**The budget is 20 % of the anchor's own decide phase = 0.108 µs/step.** The store's
STRUCTURAL ceiling is **132** records (12 bodies as readers × 11 others); the MEASURED
footprint is published as `storeEntriesAtFullTime`. ⚠ IN-C0 §R5's named debt (its
`bookkeepingShareOfStepUpperBound` was direction-mislabelled) is discharged the way it was
ordered — by re-anchoring against the shipped baseline file instead of a self-declared
denominator, and by publishing **no share at all**: a budget and a measurement, each named.

### §P9 Declared doubts (before the battery)

1. **The law without a look may produce VERY old books.** A reader refreshes only when he is
   the carrier, so between his spells on the ball his book ages with the match clock. If the
   mean staleness age comes back in the tens of sim-seconds, that is the honest measured
   input to IN-T1 (the look is exactly what buys freshness) — **not** a defect to patch here.
2. **The flip receipt's oracle is not `decideCarrier`'s full ladder** but the shipped
   perceived-choice chooser (the census's own instrument). It is a receipt for that reason.
3. **F2 vs the census's would-be-stale share** are different estimands: the census measured
   the instantaneous out-of-field share of reads; this seam measures the share SERVED FROM
   THE BOOK, which compounds (once unseen, a body stays remembered until re-seen). The two
   are expected to have the same shape and not the same value.

---

## §RESULTS — THE RECEIPT WALKS

> **Instrument**: `scripts/probes/in-t0-snapshot-law.ts`
> (`instrument.sha256` = `eade9284a2992c01ba51b11959f40e7315a56af3231896303702cb91c34409da`).
> **Artifact of record**: `docs/world-model/data/in-t0-snapshot-law.json`
> (`bodySha256` = `5d9a9b0712d27b1a91cf8aaae75234a97472263c41738866190d2900d1ddeba5`).
> **123 walks** (41 seeds × 3 arms: shut · armed-F2 · armed-F4), every `worldOk` true,
> **all thirteen gates GREEN**, `srcTouched.head` = `4d1deead989c84b890bcf0bc1d73c8ef0bbfe11f`
> (the freeze commit) with `gitStatusSrc` EMPTY.
> ⭐ These are RECEIPTS, not effect sizes — **no football claim is made here**.
> Every number below is quoted VERBATIM from an artifact field (canon: *"a stage doc's prose
> quotes artifact FIELDS verbatim or the number becomes a gated face"*, home PC-T2 §CORR
> item 4).

### §R1 ⭐⭐ THE STALENESS RECEIPTS — the seam's own ledger (value [95 % cluster CI])

| face | armed-F2 | armed-F4 | unit (verbatim) |
|---|---:|---:|---|
| `chooserReadsStaleShare` | **0.440451957721** [0.393138330087, 0.502714600147] | **0.302560899438** [0.273439748125, 0.332766547716] | share of the carrier chooser's other-body reads served from the private book |
| `chooserReadsInFieldShare` | 0.548200115384 [0.486614741559, 0.595354786011] | 0.688677531089 [0.658149399589, 0.718147502412] | share refreshed to truth |
| `chooserReadsColdStartShare` | 0.0113479268943 [0.0101409283532, 0.012672053295] | 0.00876156947362 [0.00778032274316, 0.00985062091307] | share served by the cold-start rule |
| `staleAgeMeanTicks` | **1782.5942466** [1463.67083998, 2219.71915204] | **1138.85068689** [1064.90818177, 1230.00565465] | TICKS (sim ticks; 1 tick = DT sim-seconds) |
| `staleAgeMeanSimSeconds` | 29.7099041099 [24.3945139997, 36.9953192006] | 18.9808447814 [17.7484696962, 20.5000942442] | sim-seconds (the dual axis; clock honesty) |
| `viewsBuiltPerMatch` | 409.292682927 [371.707317073, 450.317073171] | 393.536585366 [363.87804878, 427.097560976] | views per match |
| `bodiesViewedPerView` | 10.9489303379 [10.8881710988, 10.9979264174] | 10.9147815308 [10.8155908, 10.9915360502] | other bodies resolved per view |
| `storeEntriesAtFullTime` | 131.390243902 [130.585365854, 132] | 131.365853659 [130.536585366, 131.975609756] | remembered (reader, body) pairs alive at full time |

`staleAgeMaxTicks` = `{ "shut": 0, "armedF2": 14940, "armedF4": 14681 }` (a MAX face, reported
as a max — canon: *"a max−min face reports a noise-floor comparison, not a zero-null CI"*, so
no interval is attached to it).

**THE ARMING RECEIPT, in one line**: at the field of record the man on the ball prices
**44.0 %** of what he looks at from memory rather than from sight, and the cold-start seeding
accounts for only **1.13 %** of his reads — so the staleness was **earned**, not manufactured
by the seeding. `gShutLedgerEmpty` GREEN: on all 41 shut walks the ledger and the store are
**exactly zero and exactly empty**, which is what makes the armed numbers attributable.

⭐ **THE BAND IS REAL, AND IT IS A GATE**: `gF4LessStaleThanF2` GREEN — the wider field serves
strictly less staleness (0.4405 vs 0.3026), and the two intervals do not touch.

⚠⚠ **THE DOUBT OF §P9(1) IS CONFIRMED, AND IT IS THE STAGE'S MOST IMPORTANT HONEST NUMBER**:
the mean staleness age is **1,782.59 ticks = 29.71 sim-seconds** at F2 (1,138.85 ticks =
18.98 s at F4), and the max reaches **14,940 ticks** — essentially a whole 240 s match. A
reader refreshes ONLY while he is the carrier, so between his spells on the ball his book ages
with the match clock and nothing brings it back. **That is not a defect to patch here — it is
the measured size of the hole IN-T1's look exists to fill**, and it is pre-registered as such.
A stage that reported only the share would have hidden it.

### §R2 ⭐⭐ THE FLIP RECEIPT — the IN-C0 ladder's prediction, made live

Measured at MATCHED MOMENTS in the **SHUT** world (one world, one moment, two informations),
with the shipped `choosePerceivedPassTarget` as the oracle. Denominator
`flipEvalByField` = **191,870** priced carrier moments, **identical across fields**
(`gFlipDenominatorsAgree` GREEN); the oracle's own read population is **2,125,086**.

| face | F2 squareAcross | F4 contactHalfPrice |
|---|---:|---:|
| `flipShare_*` | **0.220638974306** [0.200024291375, 0.239658547016] | **0.156918747068** [0.143835813869, 0.170313503252] |
| `anyOutOfFieldShare_*` | 0.702720592068 [0.649465627874, 0.750245364459] | 0.67555636629 [0.624381128901, 0.721967770191] |
| `oracleStaleShare_*` | 0.42110060487 [0.389132543934, 0.4502131128] | 0.323311621271 [0.29816867244, 0.346458933444] |
| `oracleStaleAgeMeanTicks_*` | 1124.21058248 [1059.90109724, 1190.34051224] | 831.6536776 [771.554748634, 897.262442217] |

⭐ **|Δ|÷half-width for the starred finding** (canon: *"a starred finding states its
|Δ|÷half-width ratio"*, home BU-T0B §CORR item 2): F4's flip share 0.156918747068 with
half-width 0.0132388446919 sits **11.85 half-widths** from the no-effect value 0; F2's
0.220638974306 with half-width 0.0198171278203 sits **11.13 half-widths** from 0. Believing
your own book is not a noise artefact.

⭐⭐ **THE CENSUS'S PREDICTION LANDS.** IN-C0 §R4's dose ladder published, at its deepest rung
(k = 27, the choice tier), `flipShare` **0.157138** at F4 and **0.198505** at F2, and
`wouldBeStaleShare_F4_contactHalfPrice` **0.303195**. This seam, with a real per-reader book
instead of a uniform k-tick freeze, measures **0.156919** and **0.220639** flips and
**0.302561** stale reads. ⚠ **The agreement is NOT an identity and must not be quoted as one**
(§P9(3)): the census froze every out-of-field read at exactly k ticks, while this seam lets
staleness compound until the body is re-seen, and the two are different estimands that happen
to sit on top of each other at F4. What is honestly established is that the census picked the
right seam and sized it correctly.

⚠ **AND THE FLIP SHARE IS A LOWER BOUND** (`instrument.flipOracleLimits`, verbatim): *"the
oracle is the PERCEIVED-CHOICE chooser, not decideCarrier's full ladder; and the probe's book
refreshes on EVERY carrier tick (a superset of his decision ticks), so the flip share is a
LOWER BOUND"*.

### §R3 ⭐⭐ DORMANCY — flags-off BYTE IDENTITY and the fingerprint

`gDormancyByteIdentical` GREEN over **both world shapes × 2 seeds**: for every cell the
signature with the flag **ABSENT**, with it **EXPLICITLY FALSE**, and with
`inSnapshotField: 'F4contactHalfPrice'` set **but the law shut** are the SAME string — so the
field parameter is proven inert rather than assumed inert.

`dormancy.pooledDigest` = **`e1ed61274abe245f715821ca2be7a531e8388ea1b04cec4cf7e69aa28dd41dd3`**
(the pooled-digest idiom: the four `absent` signatures, in order, over worlds 8/9 × seeds
12,511,800/801).

`fingerprint.ofRecord` = `fingerprint.recomputed` =
**`sha256=57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`**
(`gFingerprintUnmoved` GREEN — recomputed on this tree by the probe's own hands, and
independently by `npx tsx scripts/fingerprint.ts` before the freeze commit).

`goalsPerMatch` receipts, same run: shut **2.70731707317**, armed-F2 **2.43902439024**,
armed-F4 **2.34146341463**. ⚠ These are **receipts of the walk, not findings** — the exam owns
football, and no between-arm test was frozen for them.

### §R4 THE ANCHORED EXTRACTIONS (line receipts; numbers REPORTED, never asserted)

| id | file | line no. AT THIS COMMIT | captured | `misalignMax` | `dotMin` | half-angle |
|---|---|---|---|---:|---:|---:|
| `f2SquareAcrossMidpoint` | `src/sim/mechanics.ts` | 76 | `0.5` | 0.5 | 0 | **90** |
| `f4ContactBlindPrice` | `src/sim/Match.ts` | 5146 | `CONTACT_BLIND_PEN` | 0.7142857142857143 | −0.4285714285714286 | **115.3769335251523** |

Each named line matched EXACTLY ONCE (`gAnchorsResolveOnce` GREEN). ⚠ The half-angle of record
for F4 is therefore **115.3769335251523°**; IN-C0 §R2 published **115.3768°**. The census's
4th decimal is a rounding, the derivation is the authority, and the pin suite asserts both
forms so the discrepancy cannot be lost again.

### §R5 PERF, against the anchor

`anchorFile` `docs/perf/baseline.json` · `anchorSha256`
`192ed9481524eea3186e4acbf62b77cf0ed8b16741413cd8da8518d66647bd3a` · `anchorHead` `c07a19b` ·
`anchorUsPerStep` **5.32** · `anchorDecideUsPerStep` **0.54** · `budgetUsPerStep` **0.108**.

⚠ **THE ONLY CLEAN MEASURED DELTA IS ARMED-vs-ARMED.** `shutWallUsPerStep`
**199.171917134** is dominated by the flip oracle, which runs *inside the timer on the shut
arm only* — it is published, and it is **not** a seam cost. The two armed arms carry no
oracle, so their difference is the honest instrument: `armedF2WallUsPerStep`
**19.5945281135** · `armedF4WallUsPerStep` **19.5181889385** ·
`armedF2MinusArmedF4UsPerStep` **0.0763391749889** µs/step — **inside the 0.108 µs/step
budget**, and it prices the *whole* extra 13.8 percentage points of staleness bookkeeping that
F2 does over F4.

Memory: `bookkeepingRecordsCeiling` **132** (12 bodies as readers × 11 others) against a
measured `storeEntriesAtFullTime` of **131.390243902** — i.e. by full time essentially every
body has been a carrier and holds a complete book. **The whole memory footprint of the law is
131 records per match** (`gStoreWithinCeiling` GREEN).

⭐ IN-C0 §R5's NAMED DEBT IS DISCHARGED as ordered: the denominator is re-anchored against the
shipped `docs/perf/baseline.json` (hashed as bytes), and **no share is published at all** — a
budget and a measurement, each named, so there is no field left whose name can claim the wrong
direction.

### §R6 SEEDS AND STATS

**BOOKED = WALKED**: `12,511,000–039` + `12,511,999` = **41 seeds, 123 walks**
(`gSeedsBookedEqualWalked` and `gArmsTripledPerSeed` GREEN). The pin suite walks
`12,511,800/801/802` (the smoke prefix, in band); the dormancy cells walk
`12,511,800/801`. **Block 12,511,000–999 CONSUMED WHOLE.**
**STATS: NONE CONSUMED** (`statsConsumed` = 0) — the CIs are bootstrap resamples of the walked
seeds; the next stats base remains ≥ **115,200**.

### §R7 ⭐⭐ MUTANTS (run live, restored from `/tmp` BYTE COPIES — never `git checkout`)

| mutant | edit, verbatim | pins killed | which |
|---|---|---:|---|
| **M1 THE FIELD LAW** | `/ d >= dotMin;` → `/ d >= -2;` (everything reads in-field) | **9** | the field law · the refresh law · the cold-start pin · `real()` · the F4-only band · arming-is-real · two-fields-differ · the armed-walk identity audit · lifecycle |
| **M2 THE COLD START** | the out-of-field branch's `seen!.set(body.gid, coldStart(body, tick));` deleted (he cold-starts forever) | **1** | exactly the cold-start pin |
| **M3 THE PHYSICS GATE** | `real: (body: Player): Player => back.get(body) ?? body,` → `=> body,` | **1** | exactly the `real()` physics-gate pin |
| **M4 THE SHADOW** | `snapshotTeamView`'s `return view;` → `return team;` (the gateway does nothing) | **4** | arming-is-real · two-fields-differ · lifecycle · the shadow's own delegation pin |
| **M5 THE `passMate` RESOLUTION** | the §P2(c) site-2 line deleted (a stale view can reach `performPass`) | **1** | exactly the three-resolution-sites pin |

**16 pin deaths over five mutants**, every row re-run **live by this session's own hands**.
Which pins die is itself the argument: the deep mutant (M1) takes down nine pins across four
sections, while M2, M3 and M5 each kill **exactly one** — the pin that names them and no
other, which is what makes those three pins *specific* rather than merely present. Both `src`
files were restored by **`/tmp` byte copy** and `cmp`-verified after every mutant (`view` sha
`72d2a15b47181dce7b2661ed7b5c6631fa933892f51f5b3cf5886008aa798d76`, `brain` sha
`03690b93632836862681291375b616708f7051f81930bec355db3f4e10889f02`, identical before and
after all five, and re-confirmed against `git status --short` showing **no `src` change** at
commit time), and the suite is **26/26 green** on the restored tree.

⚠ **A COUNTING CORRECTION, MADE HERE RATHER THAN QUIETLY** (two of them, in sequence):

1. The **first** sweep reported "0 pins dead" for **all five** mutants. That was a **vacuous
   signal**, not a result — the capture used `grep -E "^\s+(×|✓)"`, and `\s` is not POSIX ERE,
   so nothing matched and every file was empty. It was caught by asserting the capture COUNT
   (26 pin lines per run) before reading any death count. Note also that one PASSING test's own
   NAME contains `×` (`{inSnapshotLaw} × {dfAssignPersist}`), so a raw `grep '×'` count is one
   higher than the death count in **every** row — which is why the table above is read off
   vitest's own `Failed Tests N` header instead.
2. ⭐ The **second** sweep published **18** deaths with M3 = 2 and M4 = 5. This session re-ran
   all five mutants independently and reproduces **M1 = 9 · M2 = 1 · M3 = 1 · M4 = 4 · M5 = 1
   = 16**. The reproduced counts are the counts **of record**; the table's `edit` column now
   carries each mutant **verbatim** so the row is re-runnable rather than re-describable. The
   two divergences, honestly unresolved: M3's second death (`two-fields-differ`) does **not**
   reproduce — the two field arms stay distinguishable under a broken `real()`, so that
   attribution was an error, not a finding; and M4's `import-list` death almost certainly came
   from a *differently shaped* M4 (deleting the function body drops a parameter/type use and
   trips the import-list pin incidentally), which is a property of that edit and **not of the
   law**. ⚠ The earlier edits were not preserved, so this cause is **named, not proven**. The
   argument the mutants exist to make is unaffected: every load-bearing clause of the law has
   at least one pin that dies when it is broken.

### §R8 DEVIATIONS (honest)

1. ⭐ **A REAL BUG WAS FOUND AND FIXED INSIDE THIS STEP, before the freeze**: the inherited
   work-in-progress resolved only the ladder's seven winners. `passMate` is re-seated BELOW
   the ladder by three blocks that scan the SHADOW, and the kickoff back-pass branch scores
   and strikes above it — so a **stale view body could have reached `performPass`**, breaching
   M-IN.1. Both extra resolution sites are in the freeze commit, pinned, and M5 proves the
   `passMate` one is load-bearing. §P2(c) carries the enumeration.
2. **This step INHERITED an uncommitted working tree** from the session-limited 2026-08-19
   dispatch (#324's queue note says the partial tree was cleaned; it was not — three modified
   `src` files plus `src/ai/inSnapshotView.ts` were present). Every file was IN-T0's own and
   contained IN-T0 content, so it was continued rather than refused, and it is surfaced here.
   **Nothing foreign was in the tree at any point**; `git status --short` was read before each
   commit.
3. **The flip receipt's oracle is not `decideCarrier`'s ladder** but the shipped
   perceived-choice chooser (the census's own instrument), and the probe's book refreshes on
   every carrier tick — so the flip share is a **LOWER BOUND**. Pre-registered in §P9(2).
4. **Shut-vs-armed wall perf is not a seam cost** (the oracle is inside the shut arm's timer);
   the armed-F2-vs-armed-F4 delta is published in its place. Stated in §R5.
5. **Three of the 81 alias-bound gateway sites are a scalar counter, not a collection**
   (`shapeReady`'s `outfield`). Reported as a census needle false positive, **not** counted as
   "covered by the interposition" — the homework table separates the two.
6. **The F4 half-angle differs from IN-C0 §R2's published value in the 4th decimal**
   (115.3769335251523 vs 115.3768). Disclosed in §P3 and §R4; the derivation is pinned.
7. **Two pre-existing full-suite contention flakes** — with the default 20 s `testTimeout`,
   `cards` / `careers` / `formationEvolution` / `genes` / `simRunner` time out inside a
   149-file parallel run (the failing SET changes between runs, which is the tell).
   `formationEvolution`'s one test needs **151,623 ms** by itself and passes green in
   isolation. Same class as DF-T0 §R7 item 4 and DF-C0 §R7 item 3; **unrelated to this seam**,
   which is dormant.
8. ⚠ **BOTH COMMITS LAND ON `main`**, as every prior stage commit in this programme does.
   Nothing was pushed.
9. **`PROGRAMME.md`, the rulings file and every other stage doc are NOT edited by this
   session** (executor iron rule: governance files are the commander's). The queue's status
   line, the frontier update (next sim block ≥ **12,512,000**; stats still ≥ **115,200**) and
   the ruling are the commander's to write.

10. ⭐ **THE RECEIPTS COMMIT WAS LANDED BY A SECOND CONTINUATION SESSION.** The 2026-08-19
    dispatch died at the account session limit before any commit; a second session wrote the
    seam, the pins and the freeze commit `4d1deea`, and then died with §RESULTS drafted but
    **uncommitted**. This third session **re-verified the freeze from scratch before trusting
    a single number of it** rather than committing the inherited draft: the artifact's
    `bodySha256` and `dormancy.pooledDigest` recomputed from the file's own bytes, the
    instrument's self-sha, the perf anchor's byte sha, all thirteen gates read, every
    long-precision number and hash in §RESULTS matched back to an artifact field
    programmatically, the fingerprint recomputed independently (`npx tsx
    scripts/fingerprint.ts` → `57b0bdab…c673`), the suite re-run **26/26 green**, and
    **all five mutants re-run live** — which is how §R7's count was corrected from 18 to 16.
    The lesson, stated for the record: **an inherited draft is a hypothesis, not a receipt.**
11. ⚠ **M5's suite run took > 10 minutes** (the others ≈ 14 s). Removing the `passMate`
    resolution lets a stale view body reach `performPass`, and the resulting match does not
    play like football at all — an incidental but pointed confirmation of §P2(c)'s "physics
    would strike a ghost". Reported as an observation; no timing claim is made from it.

### §R9 WHAT THIS STAGE HANDS FORWARD (no claims, just the open items)

* **IN-T1's sizing is now measured, not guessed**: a book that ages to a mean of **29.71
  sim-seconds** at the field of record is exactly what a LOOK has to buy back, and the
  reader-only-while-carrying refresh cadence is the mechanism that makes it that old.
* **The field parameter is live and separable** (0.4405 vs 0.3026 stale; 0.2206 vs 0.1569
  flips), so the exam can walk F2/F4 as a real arm rather than a nominal one.
* **The receiver is still untouched.** IN-C0 §R4 found the RECEIVER is the blindest situation
  at every field (F2 0.505195 vs carrier 0.407648) and the doctrine's 接球前观察 lives there;
  this slice was scoped to the CARRIER by #324 item 4, so that surface remains open.

## §COMMANDER CORRECTIONS OF RECORD (ruling #325, 2026-08-20 — frozen bytes stand)

1. **(verify MED 1) §P4's off-graph "proof" for passAffordance.ts is FALSE; the verdict
   survives on the RIGHT ground.** A real VALUE chain exists and is live inside
   decideCarrier: PlayerBrain --choosePerceivedPassTarget--> perceivedPassChoice
   --evaluatePassOption--> passOptionValue --evaluatePassAffordance--> passAffordance —
   so 9 of the 69 "off the carrier's call graph" sites ARE on it. The disposition stands
   because the verifier proved the true reason: passAffordance.ts:87 binds
   `opponents = snapshot.players.filter(...)` over `ObservedPlayer` — PERCEPT-BORNE, the
   same class as the pwSnapshot row; nothing to interpose, no mechanism hole. The row of
   record is re-classed: on-graph, percept-borne. The lesson: a call-graph homework row
   states the provenance that was TRACED, never the one that would be convenient.
2. **(verify MED 2) THE 81 IS A CENSUS ARTEFACT, NOT THE ALIAS SURFACE.**
   src/ai/perception.ts — the module owning the carrier's core helpers (pressureAt,
   opennessAt, laneOpenness, effectiveBlockers, spaceAhead, escapeCarry) — is absent from
   IN-C0's gatewaySites corpus, yet the census's own gatewayRegexSource finds **15**
   matches there. HARMLESS TO THE LAW: the verifier grepped the module for
   `match.`/`team.`/`Match` re-entry and got ZERO hits — all 15 are strictly
   parameter-bound and interposed by the same shadow argument. **The alias denominator of
   record becomes 96 (= 81 + 15), every one with call-graph provenance.** IN-C0 §R-FIX.4
   is corrected of record by that doc's THIRD §CORR series (same round); the
   corpus-integrity canon takes its first recurrence: THE CORPUS INCLUDES THE FILE LIST.
3. **(verify LOW) PlayerBrain.ts's in-code §SEAM gateway comment is a DRIFTED STRONGER
   COPY of §P4** — it claims no helper re-enters team/opp/match for another body's
   position, but `whetherEyeDecision` re-enters `match.teams[p.side].players` at
   whetherEye.ts:147 (identity-only; §P4 names it out correctly). The doc is right; the
   comment is the copy a reader of PlayerBrain.ts sees first — the one-authoritative-
   source law's exact failure shape. ORDERED FIXED: one clause added to that comment,
   riding IN-T1's first commit (the arc's own file; the DF executor touches no IN seam).
4. **§R8 item 4's tree-provenance is WRONG; the content conclusion stands.** #324's queue
   note was NOT false: the 2026-08-19 afternoon partial tree WAS cleaned (commit
   `130fd46` was made on a porcelain-empty tree at 18:24 BST, fingerprint re-verified;
   the afternoon partials — PlayerBrain/Match/snapshotView.ts, no League.ts — were backed
   up OFF-REPO and never restored). The uncommitted tree the continuation inherited
   (three modified src files + inSnapshotView.ts under its final name, League.ts among
   them) was the SAME NIGHT's resumed workflow's OWN earlier stall-retry work (five
   stall-retries are on the workflow log). Only the attribution is corrected — every
   inherited file was IN-T0's own and nothing foreign ever entered the tree; §R8 item
   10's lesson (an inherited draft is a hypothesis, not a receipt) is exactly right and
   was exactly followed.
5. **The 18→16 mutant correction is RATIFIED as the honest form**: re-run live, each edit
   recorded VERBATIM (re-runnable, not re-describable), counts read off vitest's own
   header, the unreproduced cause NAMED-NOT-PROVEN. The specificity argument stands at
   16 (three mutants kill exactly one pin each).
