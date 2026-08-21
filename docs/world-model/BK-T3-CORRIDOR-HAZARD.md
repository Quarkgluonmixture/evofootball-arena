# BK-T3 — THE CORRIDOR-HAZARD SLICE (a DORMANT src seam)

> **The lofted delivery choosers get a directional, HEIGHT-AWARE corridor price.** Authorized
> by **ruling #333 item 5** — the design pick ratified at **#331 item 3** — serving the **USER
> MANDATE of rulings #328/#330**. Contract: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md).
> Census that picked this slice: [`BK-C1-DISTRIBUTION-CENSUS.md`](BK-C1-DISTRIBUTION-CENSUS.md).
> Seam: `src/ai/deliveryValueSeat.ts` (the price) + `src/ai/PlayerBrain.ts` (the four
> choosers) + the flag. Pin suite: `tests/bkCorridorPrice.test.ts`.
> Instrument: `scripts/probes/bk-t3-corridor-receipts.ts`.
> Artifact: `docs/world-model/data/bk-t3-corridor-receipts.json`.
>
> **THIS STAGE SHIPS NOTHING.** The flag is default OFF, absent from `a4World` and every
> preset; the gene it rides is BORN ABSENT; a zero-weight world prices BYTE-IDENTICALLY. The
> production fingerprint is unchanged. Receipts are receipts — **the exam is later**.

## §0 THE WORDS OF RECORD

The user, ruling #328 item 1, verbatim:

> ①「我不喜欢的是:门将开球本来要给前面或者中锋,结果直接弹到后卫或者对面压迫过来的前锋的
> 身体上然后弹回来,这个不现实足球」
> ②「或者你觉得球的弧线要不要提高?」

And ruling #330 item 1, verbatim (the generalization):

> 「哦对,球员现在能知道自己传球/射门路线上有人会挡住,或者容易被预判从而选择其他的传球
> 方式(如高球弧线球)」

**In plain football language**: the keeper hits it long, it smacks into the nearest body and
comes straight back. BK-C1 measured WHY: **85.9 %** [.739, .949] of blocked GK lofted launches
had a clearing line available inside the shipped parameterization, raising the ceiling flips
**ZERO** of them, the pressure signature has **no rising limb** (blind launching), and the
punt's own score carries **no lane, corridor or flight term at all**. The gap is **PRICING**.

**THIS SLICE, in one sentence**: the keeper looks at who is standing in front of him before he
hits it — and a coach who values that can **learn** to value it.

⛔ **THE PROHIBITION (#328 item 3, HELD ABSOLUTELY)**: no default arc is raised, no launch
parameterization is touched, and there is no hand rule saying "don't hit people". The price
makes height, angle and target choice **pay**; the chooser decides.

---

# §P PRE-REGISTRATION (frozen at the freeze commit, BEFORE the battery)

## §P1 THE PRICE ALGEBRA — every quantity anchored, no new magnitude

For a lofted delivery from `from` to the chooser's own aim `aim`, with `d = |aim − from|` and
the delivery's own family tuple `(tBase, tPerM, tMin, tMax)`:

```text
T      = clamp(tBase + tPerM·d, tMin, tMax)          ← loftKick's OWN expression
z(x)   = (g·T²/2)·(x/d)·(1 − x/d)                    ← BK-C1's closed form (apex g·T²/8 at d/2)
shell  = body.coreRadius + BALL_RADIUS   = 0.635 m   ← the contact law's OWN shell
edge   = HEADER_MIN_HEIGHT               = 1.35 m    ← the armed partition's OWN edge

CLEARED(body at along-line s)  ⇔  min( z(s − shell), z(s + shell) )  ≥  edge
hazard(from, aim, opponents, family)
       = max over opponents o NOT CLEARED of  flightExposure's OWN per-body term
       = max over o:  1 − clamp01( ( |cp − o.pos| − o.topSpeed·t(o) ) / DV_CORRIDOR_SCALE )
         with cp = closestPointOnSegment(from, aim, o.pos), t(o) = |cp − from| / DV_FLIGHT_SPEED,
         skipping o.sentOff and |cp − from| < DV_CLEAR_RADIUS  (laneOpenness's own guards)
price  = dvExposureWeight · hazard        ∈ [0, 1]
score′ = score − price                    (a subtraction, per delivery, nothing else)
```

* **T is the whole arc** (BK-C1 §R2): `loftKick` sets `vz = g·T/2` and `|v| = d/T`, so
  `z(x)` above is EXACT for the airborne phase and spin-invariant (Magnus rotates the path,
  not the height). `z` is concave ⇒ its minimum over a shell sits at an **endpoint**: no
  sampling, no invented sample count.
* **The only threshold is DERIVED (#200)**: the contact law's own strike edge, so the price
  asks exactly the question the contact law answers.
* **The four family tuples are the arguments the engine already calls `loftKick` with**, at
  its NAMED call sites, pinned by anchored extraction (canon, VERBATIM: *"a src-extracted
  constant pins its extraction to the NAMED call site — anchored match + line receipt — never
  first-occurrence"*, home: BK-C0 §CORR item 1). `mechanics.ts` is **not edited**.
* **DEGENERACY (why this is a sharpening, not a new sense)**: a flight that clears nobody
  prices **exactly** the shipped `flightExposure`; a flight that clears everybody prices `0`.

## §P2 THE FOUR PRICED CHOOSERS (and the one that is not)

| chooser | site | aim priced | family |
|---|---|---|---|
| ⭐ the keeper's **punt** | `PlayerBrain.ts` punt score | `puntMate.pos` | `performLoftedPass` |
| the open-play **loft switch** | the `d > 24` loft block | `mate.pos` (M-PTP.4's body pricing) | `performLoftedPass` |
| the **dink** over the top | the chip branch | `point` (the projected burst) | `performThroughBall` lofted |
| the keeper's **hand throw** | the throw score | `mate.pos` | `performKeeperThrow` |
| ⛔ the **cross** | — | NOT PRICED | (BK-C1 §R8's honest exclusion) |

**THE PUNT GETS A CORRIDOR TERM FOR THE FIRST TIME.**

## §P3 THE COMPOSITION AND THE DORMANCY STORY

* **The gene is `deliveryRiskPrice`'s own born-absent `dvExposureWeight`** — the same weight,
  the same IEEE-exact zero point, with the height half added. The **loss-belief limb is
  deliberately not extended** to lofted deliveries (that would be a second pricing decision
  this slice was not given), so the price is that function's EXPOSURE LIMB.
* **ONE corridor loop**: the height half is a single statement inside the shipped
  `flightExposure` walk (`aloft === null` ⇒ HEAD's arithmetic, character for character), never
  a second loop that could drift.
* **TWO limbs, both required**: flag `bkCorridorPrice` (default OFF, explicit boolean, absent
  from `a4World`) + a non-absent gene. Flag off, or gene absent ⇒ no seat ⇒ the shipped
  statements alone. Gene present at **ZERO** ⇒ the subtraction is exactly `−(+0)` and the world
  is byte-identical **with the code path LIVE**.
* **Composition proof** at the world-9 + `dfAssignPersist` + `dfSurface` + `inSnapshotLaw` +
  `inLookAct` stack (a stated economical subset), per the M-BU.2 lineage.

## §P4 THE DOSE, AND ITS DERIVATION (no taste constant)

The receipts' DOSED arm arms the flag and writes `dvExposureWeight = **1**` on the three
genome views of both teams (the #196.3-D6 arming checklist, DV-T0's own probe idiom).

**THE DERIVATION**: the gene's own domain is `[0, 1]` — `dvExposureWeightOf` clamps with
`clamp01` (anchored in the artifact, its file bytes hashed). **1 is the most a coach could
ever evolve**: the loudest LEGAL arm, chosen so a quiet receipt cannot be blamed on a timid
dose. Canon, VERBATIM: *"a dose-source guard should hash the bytes it reads, not a
self-declared field"* (home: BU-T1 §CORR item 6) — the artifact carries the sha256 of
`src/evolution/genome.ts` and `src/ai/deliveryValueSeat.ts`, plus the L3/PC world-dose FILES.
No CENSUS VALUE is dosed anywhere in this probe, so house law #270.2's `info.genome`
prohibition binds nothing here; the world doses still go through `armA4World`, the shipped
writer.

## §P5 THE FIVE DESIGN QUESTIONS (asked and decided BEFORE the code)

1. **WHERE does the price attach — a subtraction or a multiplier?** → **A SUBTRACTION**, the
   DV form (`score − w·exposure`) reused verbatim. A multiplier would have needed a scale of
   its own (an invented magnitude) and would have made the price's bite depend on the score's
   own units per chooser.
2. **WHICH bodies count?** → **only those the flight would actually strike**: below the
   contact law's own 1.35 m edge somewhere inside the body's own 0.635 m shell. Both halves
   are anchored extractions; the gate is a derived threshold (#200), not a taste constant.
3. **WHICH aim is priced?** → **the chooser's own incumbent aim** (the loft prices at the
   body per M-PTP.4; the chip at the `point` it already judges; the punt at its own target).
   Re-picking the TARGET is a different question and is **out of scope** (BK-C1 §8).
4. **WHICH gene carries it?** → **the DV seat's existing born-absent `dvExposureWeight`**, not
   a new gene: it gives the IEEE-exact zero point for free, adds no genome surface, and keeps
   "how much do I care about bodies on my line" ONE evolvable taste rather than two.
5. **WHAT IS LEFT OUT, honestly?** → the **cross** (92/116 blocked short is a wide-play
   question of its own) · **ground/driven passes** (apex 0 — nothing to price over) · **target
   choice** · the **z = 0 release height** (BK-C1's slice 2, unauthorized here) · the
   **shot-path** and **curl** doors (#330's, later).

## §P6 THE RECEIPTS (pre-registered; ⚠ receipts ≠ effect sizes)

CANON (homes: ruling #289 item 1 + BU-T1 §CORR item 5): arming and plumbing receipts are
never quoted as football effect sizes. **No between-arm test is frozen here and none is
invented.** Two arms, ~40 world-9 seeds each, shut vs dosed:

* **R1 THE PRICE'S DISTRIBUTION** on lofted deliveries — does it FIRE and does it
  DIFFERENTIATE (per delivery: priced launches, fired share, mean hazard, mean price, the
  hazard histogram).
* **R2 BLOCKED-SHORT SHARE BY DELIVERY** at dose (the direction receipt).
* **R3 THE DISTRIBUTION-CAROM FAMILY COUNT** (R9's family, window and class reused).
* **R4 THE PRESSURE SIGNATURE RE-READ** (BK-C1 §R5's bins). ⚠ A rising limb **may appear** —
  it is a RECEIPT, and BK-C1's range confound is not de-confounded here.
* **R5 Q06 COMPLETION DIRECTION** — the pre-registered linkage face, BK-T2's own definition
  (`Σ passesCompleted / Σ passes`, both teams), BK-T2's own field carried with hashed bytes.
* **R6 PER-FAMILY REACHABILITY** (BK-C1 §CORR 1's ordered rider): of the blocked GK lofted
  launches in the SHUT arm, per family — does it CLEAR, was it INSTANTIABLE by that chooser at
  that moment, and BOTH. This gives 85.9 % its chooser-agency grain, so it is never read as
  recoverable headroom. Every instantiability conjunct is an ANCHORED extraction of the
  shipped chooser's own gating line (canon, VERBATIM: *"a scored face's walk-side predicate is
  pinned — anchored extraction or fixture — because the re-derivation gate proves arithmetic,
  not definitions"*, home: DF-T3 §CORR item 2).

## §P7 THE GATES (frozen; a red gate is REPORTED, never patched)

`gWorld` · `gDoseBytes` · `gAnchoredParams` · `gStrikeSurfaceAnchored` · `gSeamSitesAnchored` ·
`gWalkPredicatesPinned` · `gReplayMatchesLive` · `gArmsAreDistinct` · `gPriceIsZeroInShutArm` ·
`gPriceFires` · `gDeliveryPartition` · `gReachabilityNested` · `gNonVacuous` ·
`gSeedsBookedEqualWalked` · `gStatsZero` · `gFaces`.

`gFaces` is the re-derivation gate: EVERY published face and EVERY stored bin summary is
re-derived from the SERIALIZED artifact off disk (canon: gFaces-from-disk; per-seed cells
stored, home #282.2(ii)).

## §P8 THE PIN SUITE FROM BIRTH

CANON (home: ruling #297 item 7): no one-shot-probe-only seams. `tests/bkCorridorPrice.test.ts`
pins: strong dormancy (absent ≡ false ≡ gene-zero, both world shapes × 2 seeds, pooled) · the
IEEE-exact zero point · the price law on constructed fixtures (under the arc prices, over the
flight does not, off the corridor does not, the gate reproduces BK-C1's own `x_clear` closed
form) · every constant anchored (the family tuples at their NAMED call sites, the strike
surface's two lines, the cross family's provable ABSENCE) · extend-not-duplicate (one corridor
loop; the throw's shipped `laneOpenness` factor untouched; the DV pricer's single call site
intact) · the four priced statements VERBATIM with their own aims · no serialization · no rng ·
composition · the ⛔ #328 prohibition (the launch parameterization untouched, no hand rule) ·
the seam map with occurrence counts per needle (canon, VERBATIM: *"a seam-map gate pins
occurrence COUNTS per needle and enumerates EVERY occurrence's site"*, home: PC-C0 §CORR
item 1; **needle PREFIX: `bkCorridor` / `BkCorridor` / `BK_CORRIDOR`**) · the fingerprint of
record as a literal.

## §P9 SEEDS AND STATS

Block **12,517,000–999**, consumed WHOLE of record: 40 battery seeds (12,517,000–039) × 2 arms
+ the in-band smoke prefix 12,517,800–802 + the 12,517,999 world-construction receipt.
**BOOKED = WALKED.** The pin suite's own walks use 12,517,800–802 (in band).

**STATS CONSUMED: ZERO.** The intervals are bootstrap resamples of the WALKED seeds, not a
registry-consuming statistic (the IN-T0 / DF-T2 / BK-C1 precedent). Next stats base remains
≥ **116,400** (registry of record 67).

## §P10 HONEST LIMITS, STATED BEFORE THE BATTERY

1. ⚠ **THE HAND THROW IS THE ONE DELIVERY THAT ALREADY PRICED A CORRIDOR** (`sT *= 0.3 +
   laneOpenness·0.7`). That shipped statement is a PINNED line and is left exactly as it is,
   so an armed throw carries BOTH a height-blind multiplicative openness AND the height-aware
   hazard — an admitted **over-pricing on that one delivery**. Replacing the shipped term
   would edit a pinned statement and would change the shipped world's meaning; extending was
   the ruled-safe half.
2. ⚠ **CLEARED ≠ UNCONTESTED** (BK-C1 §8, inherited): above 1.35 m the ball belongs to
   `tryAerial`, so a cleared line trades a body carom for an aerial duel. The price never
   claims a cleared line is a completed one.
3. ⚠ **THE PRICE USES THE DESIGN DISTANCE, not the struck one**: `loftKick` draws a range
   error INSIDE the strike, after the choice. Reading it in the chooser would be a truth
   channel. The chooser prices the ball he MEANS to hit.
4. ⚠ **THE INCUMBENT STRIKE'S OWN LEAD IS NOT PRICED**: `performLoftedPass` strikes at
   `mate.pos + mate.vel·flight0·0.7` while the price reads `mate.pos` (M-PTP.4's body pricing,
   kept). Measured mean displacement 0.72 m in the PTP stage.
5. ⚠ **R6's INSTANTIABILITY IS OPTION-EXISTENCE, NOT WINNING**: it asks whether the chooser
   could have played that family to that target at that tick (the shipped range/state gates),
   never whether it would have won the argmax. The offside gate and the aerial outcome are not
   modelled, and this is a declared bound in both directions.
6. ⚠ **R4's PRESSURE SIGNATURE CARRIES BK-C1's RANGE CONFOUND** (presser measured at the
   kicker, blocks happen en route). Not de-confounded here.
7. ⚠ **THE DOSE IS THE DOMAIN MAXIMUM** — deliberately the loudest legal arm. It is not an
   estimate of what evolution would select, and no claim about selected weights is made.

---

# RESULTS

> Freeze `b506d81` → this commit. **15/16 gates GREEN, `gPriceFires` RED and reported as
> red** (§R7 — the gate was mis-specified, and the measurement is the opposite of vacuous).
> ⛔ **ARTIFACT OF RECORD**: `docs/world-model/data/bk-t3-corridor-receipts.RED.json` — the
> **SIDE PATH**, because a run with a red gate never sits at the canonical path (DF-C0 §CORR
> item 2, ruling #321; the DF-C0 / DF-T0 / IN-T1 precedents). **The canonical path
> `…/bk-t3-corridor-receipts.json` is EMPTY** and stays empty for this stage. §P's header
> line names the canonical path because it was written before the gates were known; nothing
> above this marker is edited after the freeze, so the correction lives here.
> 80 walks (40 seeds × 2 arms) + the 12,517,999 construction receipt, **10.22 s wall**.
> `gFaces` re-derived **70/70** published faces and **40/40** stored-bin checks off the
> serialized artifact, 0 failures. `hashedBodySha256 =
> dfc93cefeadd82da3e6c0bcf5565c5ea1a54074579dbe4a578a7eac2ffe05df3`.
> Every number below is quoted from an artifact FIELD (canon: doc-prose fidelity).
> ⚠ **RECEIPTS, NOT EFFECT SIZES** — no between-arm test was frozen, none is invented, and
> nothing here is a football claim (canon, homes: #289 item 1 + BU-T1 §CORR item 5).

## §R0 THE SEAM IS DORMANT AND THE COUNTERFACTUAL IS THE ENGINE'S OWN BALL

`gPriceIsZeroInShutArm` GREEN: every shut-arm walk subtracts exactly `0`. `gReplayMatchesLive`
GREEN on **7,801 per-tick samples** at `maxAbsDiff = 0` metres — the transcribed integrator
reproduces live flights bit-for-bit, so R6's clearing test runs on the shipped flight model.
The permanent pin suite (23 pins) carries the byte-identity: flag ABSENT ≡ flag FALSE ≡ ARMED
AT GENE ZERO, both world shapes × 2 seeds, pooled; production fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` unmoved.

## §R1 THE PRICE FIRES AND DIFFERENTIATES — read on the SHUT arm, where the population lives

The hazard evaluated by the SHIPPED exported functions at every lofted launch's own
origin/aim/family (`priceFiredShare_*` · `meanHazard_*`, shut arm — the price the chooser
WOULD have paid):

| delivery | priced launches | fired share | mean hazard |
|---|---|---|---|
| **punt** | 14 | **1** (14/14) | **0.9520493** |
| loft switch | 14 | 0.64285714 (9/14) | 0.53823927 |
| dink (through-loft) | 123 | 0.97560976 (120/123) | 0.97213426 |
| keeper throw | 11 | 0.54545455 (6/11) | 0.46443272 |

**IT DIFFERENTIATES**: the same law reads 0.95 on the keeper's punt and 0.46 on his hand
throw — the throw's own family (T ≤ 1.5 s) flies low and short, so fewer bodies are cleared but
fewer are approached; the punt at keeper range meets bodies inside its climb-out. `meanPrice_*`
is `0` on every shut-arm row **by construction** (no seat), which is the dormancy receipt.

## §R2 THE DIRECTION RECEIPT — blocked-short share BY DELIVERY, and the DENOMINATORS MOVE

⚠ **MOVING DENOMINATORS, DISCLOSED** (canon, home: PW-C0 §CORR item 2): the dosed arm does not
play the same deliveries at all. `launches` (shut → dosed): punt **14 → 1** · loft switch
**14 → 4** · dink **123 → 32** · throw **11 → 12** · cross 130 → 134 · driven pass 2,609 → 2,720.

| delivery | blocked-short SHUT | blocked-short DOSED |
|---|---|---|
| punt | **0.57142857** (8/14) [0.142857, 0.857143] | **0** (0/1) [0, 0] |
| loft switch | 0.14285714 (2/14) [0, 0.3] | 0 (0/4) [0, 0] |
| dink | 0.64227642 (79/123) [0.544118, 0.742424] | 0.6875 (22/32) [0.518519, 0.837838] |
| keeper throw | 0.09090909 (1/11) [0, 0.375] | 0 (0/12) [0, 0] |
| ⛔ cross (unpriced) | 0.82307692 (107/130) | 0.81343284 (109/134) |
| driven pass (unpriced) | 0 (0/2,609) | 0 (0/2,720) |

**THE UNPRICED CONTROLS DO NOT MOVE** (the cross 0.823 → 0.813 with its own denominator intact;
the driven pass exactly zero both arms) — which is what an honest plumbing receipt looks like
when the seam touches only what it claims to touch.

## §R3 THE DISTRIBUTION-CAROM FAMILY (R9's family, window and class reused)

Denominator-stable: GK releases 361 (shut) vs 354 (dosed).

| face | SHUT | DOSED |
|---|---|---|
| `caromWithin240PerGkRelease` | 0.08033241 (29/361) [0.038576, 0.130919] | 0.03954802 (14/354) [0.021918, 0.059829] |
| `caromInFlightPerGkRelease` (**the user's exact pattern**) | 0.06648199 (24/361) [0.026012, 0.117808] | **0.00847458** (3/354) [0, 0.018919] |

⚠ Both point estimates fall and the intervals barely touch. **NO between-arm test was frozen
and none is invented** — this is the pre-registered receipt, and the exam is later.

## §R4 THE PRESSURE SIGNATURE RE-READ (2 m bins; blocked/launches)

**GK**, SHUT: 2/15 · 1/8 · 1/4 · **51/128** · 3/40 · 2/27 · 1/43 · 2/96.
**GK**, DOSED: 0/10 · 0/4 · 1/12 · **4/116** · 1/48 · 2/28 · 1/38 · 0/98.
**OUTFIELD**, SHUT: 8/1381 · 20/890 · 12/235 · 6/147 · **92/223** · 0/19 · 0/2 · 0/4.
**OUTFIELD**, DOSED: 8/1458 · 7/835 · 8/211 · 4/148 · **96/254** · 0/17 · 0/4 · 0/3.

BK-C1's shape reproduces on virgin seeds: **no rising-with-pressure limb** in either arm, the GK
peak still in the 6–8 m bin, the outfield peak still at 8–10 m. **No rising limb APPEARED.**
⚠ BK-C1's range confound is carried, not removed (§P10 item 6).

## §R5 Q06 — THE PRE-REGISTERED LINKAGE FACE

`q06PassCompletion` (BK-T2's own definition, `Σ passesCompleted / Σ passes`, both teams):
SHUT **0.60663798** (1974/3254) [0.589362, 0.624257] · DOSED **0.59719255** (1957/3277)
[0.581275, 0.614504]. BK-T2's own field, bytes hashed: `ryiQ06PassCompletion` base
`0.6861832642355529` → armed `0.5974930362116991`, delta `-0.08869022802385373`.

**THE PRE-REGISTERED EXPECTATION IS NOT MET AT THIS DOSE**: the −8.9 pp is **not** partially
recovered — the dosed arm's completion is flat-to-slightly-lower with overlapping intervals.
Reported exactly as measured (§P6 pre-registered the direction as the face, not the outcome).
A mechanism is visible in §R2 — at the domain-maximum dose the lofted deliveries are largely
**suppressed** rather than re-aimed, and the deliveries that replace them are ground balls whose
own completion the contact law taxes at reception. That sentence is a **labelled hypothesis**
(有故事就要有探针, #144(a)), not a finding: this stage froze no probe for it.

## §R6 PER-FAMILY REACHABILITY — the rider BK-C1 §CORR 1 ordered

Population: the **63** blocked GK lofted launches of the SHUT arm (9 in the dosed arm).
`reachClearShare_*` = that family's line would have cleared the struck body;
`reachInstantiableShare_*` = the chooser could have played that family to that target at that
tick (the shipped range/state gates, each anchored); `reachBothShare_*` = both.

| family | CLEARS (shut) | INSTANTIABLE (shut) | **REACHABLE** (shut) |
|---|---|---|---|
| loft (punt / switch) | 0.57142857 (36/63) | 0.93650794 (59/63) | **0.57142857** (36/63) [0.402985, 0.777778] |
| dink | 0.58730159 (37/63) | 0.92063492 (58/63) | **0.55555556** (35/63) [0.383333, 0.774194] |
| keeper throw | 0.11111111 (7/63) | **0** (0/63) | **0** (0/63) |

`reachAnyClearShare` **0.63492063** (40/63) [0.472727, 0.83871] · `reachAnyReachableShare`
**0.63492063** (40/63) — **identical**: at these launches every clearing family was also
instantiable, so on this population the existential availability and the chooser-agency grain
COINCIDE. ⭐ And the keeper's hand throw is the family the chooser could **never** reach at a
blocked lofted launch (0/63): those launches are outside its own 8–30 m band, which is a code
fact, not a taste.

⚠ **THIS IS A DIFFERENT NUMBER FROM BK-C1's 85.9 %, FOR TWO STATED REASONS**: (i) virgin seeds
(BK-C1's `blockedGkLoftAvailableShare` of record, bytes hashed: `0.859375` = 55/64), and
(ii) **this existential runs over the THREE PRICED families only** — the cross is out of scope
here and was one of BK-C1's four. Lower, and honestly lower.

## §R7 ⛔ THE RED GATE — `gPriceFires`, reported as red, NOT patched

**THE GATE, as frozen**: for each priced delivery, `pricedLaunches === 0 || priceFired > 0` in
the DOSED arm. **MEASURED**: `priceFiredShare_punt` dosed **0** (0/1), `loftSwitch` **0** (0/4),
`throw` **0** (0/12); only the dink fires (30/32). So the gate is RED. It is a **boolean gate
that measured `false`** — not an informational field misread from outside.

**WHAT IT ACTUALLY CAUGHT — the gate was MIS-SPECIFIED, not the seam**: it conflated "the price
is live" with "the surviving launches still carry hazard". At the domain-maximum dose the
choosers **stop launching into bodies**: the punt/switch/throw launches that survive the argmax
are the ones with hazard **exactly 0** (the stored histograms put all of them in the `[0, 0.1)`
bin — punt `[1,0,0,0,0,0,0,0,0,0]`, switch `[4,0,…]`, throw `[12,0,…]`), and the launches that
would have priced are gone from the population (§R2's denominators).
Liveness is proven twice over regardless: `gArmsAreDistinct` GREEN, `gPriceIsZeroInShutArm`
GREEN, the shut arm's own fired shares in §R1 (0.55–1.00), and the pin suite's dosed-arm
divergence rows.

⭐ **A RED GATE STAYS RED** (the standing rule; no re-cut after sight). The right form for the
next stage is a gate on the price's **evaluation** (was a non-zero hazard ever computed inside
an armed decision) rather than on the **chosen** launches' residual hazard — a chooser that has
learned to avoid bodies makes the second one false by succeeding.

## §R8 THE REPRODUCTION CHAIN — this battery was WALKED AGAIN, not inherited

The dispatch session died on a network outage with its results **staged but uncommitted**. Per
IN-T0 §R8 item 10 an inherited draft is a **hypothesis, not a receipt**, so those bytes were
backed up to `/tmp`, **discarded from the index and the tree**, and the battery was **re-walked
from scratch** at the frozen tree (`git diff b506d81..HEAD` empty; `git diff --cached -- src
tests scripts` empty; pin suite 23/23; one live mutant re-killed; fingerprint recomputed) with
the frozen instrument, the frozen seed block and the frozen dose.

**VERDICT: IDENTICAL.** A full `diff` of the 22,228-line artifact against the dead session's
copy shows **exactly one differing line** — `wallSeconds` (9.818 → 10.22), a declared volatile
field excluded from the hashed body. `hashedBodySha256` is **byte-equal** across the two runs
(`dfc93cef…5df3`), so all 80 per-seed cells, all 70 faces, all stored bins and all 16 gate
values reproduced exactly. The determinism claim is now a measurement.

⚠ **ONE PLACEMENT CORRECTION**: the dead session had staged the red artifact at the
**canonical** path. The red-routing idiom that `in-t1`/`in-t2`/`df-t3`'s probes carry in code
(`ALL_GREEN ? OUT : OUT.RED.json`) is **absent from this stage's frozen instrument** — a freeze
omission, not a measurement error. The instrument was NOT edited after the freeze; the routing
was applied by hand at landing time, and this is named as this stage's §CORR candidate for the
next ruling.

## §DOUBTS (declared)

1. **The dose is the domain maximum** and it behaves like one: suppression dominates re-aiming
   (punt 14 → 1). Nothing here says what a SELECTED weight would do; the exam needs a dose
   ladder, and the DV-T0 §RESULT `H-250a` suppression precedent is the reference.
2. **n is small on the loud rows** — 14 punts and 11 throws in the shut arm across 40 seeds.
   The intervals are published and wide; the punt's 0/1 dosed row carries no information at all.
3. **Q06 did not move the pre-registered way** (§R5). Declared as a miss, with a labelled
   hypothesis and no probe.
4. **The hand throw is over-priced by construction** (§P10 item 1) and it is the one delivery
   whose dosed launch count did not fall (11 → 12) — the two facts sit next to each other
   unexplained, and this stage froze nothing that separates them.
5. **R6's instantiability is option-existence** (§P10 item 5); a family that existed might
   still have lost the argmax by a mile.
6. **The instrument had no red-routing code** (§R8) — the placement discipline held only
   because a human applied it. That is a fragile arrangement and it is named, not smoothed.
