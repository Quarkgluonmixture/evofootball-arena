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

> Freeze `PENDING` → this commit. Filled in by the receipts commit; nothing above this marker
> is edited after the freeze.
