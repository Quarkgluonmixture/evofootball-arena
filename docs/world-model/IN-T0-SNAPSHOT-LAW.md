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

*(written after the battery; the freeze commit ends here)*
