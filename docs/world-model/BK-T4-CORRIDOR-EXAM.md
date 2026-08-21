# BK-T4 — THE CORRIDOR EXAM (会看人之后,该学会「换条线开」)

> **The weight ladder that separates RE-AIM from SUPPRESS — and the season ladder that lets
> EVOLUTION find the weight.** Authorized by **ruling #335 item 5** (the #334 ladder), serving
> the **USER MANDATE of rulings #328/#330**. Contract:
> [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md). Parent slice:
> [`BK-T3-CORRIDOR-HAZARD.md`](BK-T3-CORRIDOR-HAZARD.md) (the seam under exam). Census:
> [`BK-C1-DISTRIBUTION-CENSUS.md`](BK-C1-DISTRIBUTION-CENSUS.md).
> Seam: `src/ai/deliveryValueSeat.ts` + `src/ai/PlayerBrain.ts` + the `bkCorridorPrice` flag.
> Pin suite: `tests/bkCorridorPrice.test.ts`.
> Instrument: `scripts/probes/bk-t4-corridor-exam.ts`.
> Artifact: `docs/world-model/data/bk-t4-corridor-exam.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> **THIS STAGE SHIPS NOTHING.** The flag stays default OFF and absent from `a4World`; the gene
> it rides stays BORN ABSENT; the production fingerprint
> `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved.
> **Commit 1's rider is the ONLY src change** and it moves nothing when the flag is off.

## §0 THE WORDS OF RECORD, AND THE QUESTION THIS EXAM ANSWERS

The user, ruling #328 item 1, verbatim:

> ①「我不喜欢的是:门将开球本来要给前面或者中锋,结果直接弹到后卫或者对面压迫过来的前锋的
> 身体上然后弹回来,这个不现实足球」

BK-T3 answered the first half at receipts grain: at the gene's domain **maximum** the carom
the user named fell **.0665 → .0085** per GK release (~8×) while the unpriced controls stood
still. But it answered it the WRONG WAY ROUND: the punt's launches fell **14 → 1**, the dink's
**123 → 32**. 会看人之后他先学会的是「别开」,还没学会「换条线开」.

**THIS EXAM, in one sentence**: walk the gene's own domain and find out whether there is a
weight at which the keeper stops hitting people **without stopping playing the ball forward** —
and then let a league of coaches, over twenty generations, decide for themselves how much to
care.

⛔ **THE PROHIBITION (#328 item 3, HELD)**: no default arc is raised, no launch
parameterization is touched, no hand rule says "don't hit people". `mechanics.ts` is
byte-untouched by this stage as it was by BK-T3.

---

# §P PRE-REGISTRATION (frozen at the freeze commit, BEFORE the battery)

## §P1 THE ARMS — A WEIGHT LADDER ON THE GENE'S OWN DOMAIN

`dvExposureWeight`'s domain is `[0, 1]`: `dvExposureWeightOf` clamps with `clamp01` (anchored
in the artifact at its named site, `src/evolution/genome.ts`'s bytes hashed). **THE RUNGS ARE
THAT DOMAIN'S OWN QUARTERS, ALL OF THEM**:

| rung | flag | gene | what it is |
|---|---|---|---|
| **0** | ABSENT | BORN ABSENT | ⭐ **THE CONTROL ARM** — BK-T3's shut world of record, unchanged |
| 0.25 | ARMED | 0.25 | the first quarter of the domain |
| 0.5 | ARMED | 0.5 | half of what a coach could ever care |
| 0.75 | ARMED | 0.75 | |
| 1 | ARMED | 1 | BK-T3's dose of record — the loudest legal arm |

**NO TASTE CONSTANT AND NO ARGUED SUBSET**: the ladder walks the gene's own even division of
its own domain. (#335 item 5 allowed a §P-argued subset of the quarters; taking them WHOLE
needs no argument at all, which is the cheaper honesty.)

**THE WEIGHT-SETTING IDIOM — the ratified post-#270.2 form ORDERED at #334 item 1**: the
weight is written on **MATCH-LOCAL COPIES** (bu-t1's `setMtDoseLocal` shape — `baseGenome` and
`effGenome` are replaced by copies carrying the weight) and **`info.genome` is NEVER
touched**. The world conjunct `infoGenomeCleanOfTheWeight` asserts, at every rung and on the
`…999` construction receipt, that the FRANCHISE genome — the thing that serializes and crosses
over — carries no `dvExposureWeight` key at all. `gGenomeClean` gates it.

## §P2 H-BK.3(a) — THE DEFLECTION FALLS WITH THE CONTROLS FLAT

> **FROZEN RULE.** At **SOME** rung `r > 0`: the paired per-seed bootstrap Δ of
> **`caromInFlightPerGkRelease`** against rung 0 has its **95 % interval ENTIRELY BELOW
> ZERO**, **AND** each of the two UNPRICED controls — **`blockedShortShare_cross`** and
> **`blockedShortShare_drivenPass`** — has its point estimate at rung `r` **INSIDE that
> control's own rung-0 95 % interval**.

* **THE FACE IS REUSED VERBATIM**: `caromInFlightPerGkRelease` = R9's distribution-carom
  chain family (window 240 ticks, retire 720, class for class), restricted to chains whose
  launch's FIRST CONTACT happened IN FLIGHT — BK-C1's and BK-T3's own face, the user's exact
  #328 pattern. Its walk-side rule is the pure `stepChain` of the instrument's §3a, and
  `stepChain` is exercised by six composition FIXTURES.
* **THE PAIRED FORM**: the same seed at two rungs is one pair, so the bootstrap resamples
  **SEEDS** and re-derives the pooled ratio at both rungs inside each draw (2,000 draws,
  percentile interval, `Rng(12,520,999)`). "Falls resolvedly" = the interval excludes zero on
  the falling side; the artifact also publishes `absDeltaOverHalfWidth` per rung (canon:
  "a starred finding states its |Δ|÷half-width ratio").
* **WHY CONTROLS AT ALL**: the cross and the driven pass are the deliveries this seam
  provably does not price (BK-C1 §R8's honest exclusion; a ground pass has apex 0). If they
  move with the priced ones, the effect is not the seam's.

## §P3 H-BK.3(b) — RE-AIM, NOT SUPPRESS

> **FROZEN RULE.** At the **LOWEST** rung where (a) passes: **`loftedLaunchesPerMatch_pooled`**
> (launches per match, pooled over the four priced deliveries) **AND** each of the four
> per-delivery volumes `loftedLaunchesPerMatch_{punt,loftSwitch,throughLoft,throw}` sit **AT OR
> ABOVE their own rung-0 95 % interval's LOWER EDGE**.

* **THE BAND'S FORM IS DERIVED FROM THE CONTROL ARM'S OWN INTERVAL** — the rung-0 bootstrap
  CI's lower edge, per face. **No taste constant** (no "within 20 %", no absolute floor).
* **THE UNIT IS PER MATCH** on the engine's own 240 s match clock (clock honesty; one row =
  one match, `matches: 1`).
* ⭐ **IF (a) PASSES ONLY WHERE VOLUME COLLAPSES, (b) FAILS AND THAT IS THE RESULT.** The
  frozen rule is not re-cut after sight, and a failed hypothesis is a measurement, not a red
  gate.
* ⚠ **DECLARED BEFORE THE BATTERY**: the punt's and the throw's own volumes are SMALL
  (BK-T3 saw 14 punts and 11 throws across 40 seeds), so their rung-0 intervals are WIDE and
  their band is correspondingly lenient. The **dink** (123 launches) and the **pooled** face
  are where this rule bites, and that is stated now rather than explained later.

## §P4 REPORTED, NEVER GATED

* **Q06 pass completion by rung** (`q06PassCompletion`, BK-T2's own definition
  `Σ passesCompleted / Σ passes`, both teams) — the recovery DIRECTION. BK-T3 missed its
  pre-registered expectation at the domain maximum (.607 → .597); whether a lower rung
  recovers it is a reported face, gated by nothing.
* **The presser-distance signature by rung** (BK-C1 §R5's 2 m bins, GK and outfield) — does a
  RISING limb appear. ⚠ BK-C1's range confound is carried, not removed.
* **Blocked-short by delivery by rung** (all nine delivery classes).
* **The price distribution by rung** (the hazard histogram on the launches actually played,
  10 bins × 0.1) and the price the rung actually subtracted.
* **Per-family reachability by rung** (BK-C1 §CORR 1's rider: CLEARS · INSTANTIABLE · BOTH,
  per family, over the blocked GK lofted launches).
* **The evaluation census** (`priceEvalNonZeroShare`, `priceEvalMeanHazard`) — see §P6.
* ⭐ **THE SEASON LADDER, all of it** (§P5).

## §P5 ⭐ THE SEASON LADDER — EVOLUTION FINDS THE WEIGHT

**TWO ARMS, one ecology, ONE difference: whether SELECTION MAY TOUCH THE GENE.**

| arm | `evolveDeliveryValue` | what it means |
|---|---|---|
| `geneAbsent` | **false** | the gene stays **STRUCTURALLY ABSENT** every generation — every club prices the corridor at nothing. **THE CONTROL** (and it carries the NEUTRAL-DRIFT SHADOW) |
| `geneEvolvable` | **true** | the gene may enter the population through the **SHIPPED** `mutateGenome` / `crossoverGenomes` opt-in path. **NOTHING pre-seeded. NO manual weight anywhere in this ladder.** |

* **BOTH arms arm `bkCorridorPrice`** (plus `bkFacingLaw` + `bkContactLaw` on the world-9
  stack), identical founders per league seed, identical fitness — so the door is open in both
  worlds and the only question is whether **a coach who values the corridor can spread**.
* **THE SELECTION LAW IS `evolveGroup`'s OWN**, mirrored and anchored: elite 2 · reborn 2 ·
  mutated 6, `{rate: 0.4, scale: 0.08}` and reborn `{rate: 0.5, scale: 0.15}`, both extracted
  from their named lines in `src/evolution/evolve.ts`. **WHY probe-side and not the shipped
  League**: `League.finishSeason` calls `mutateGenome`/`crossoverGenomes` with **HARD-CODED**
  options, so an evolution opt-in cannot be armed through the shipped League at all (the MT-T2
  precedent). ⚠ **THIS ECOLOGY IS THE EXAM'S, NOT THE SHIPPED LEAGUE'S** — no shipped-League
  number is quoted as this ladder's and none of this ladder's numbers is quoted as the
  shipped game's.
* **HORIZON: 20 generations × 10 teams × a single round robin (45 matches)**, 4 league seeds,
  both arms = 7,200 matches. 20 is **traced, not chosen**: it is the horizon the goals-warming
  reference line is itself defined on (DF-C0 §R4's early(1–5)→late(16–20) slope).
* **THE PER-MATCH SEEDS ARE DERIVED THROUGH THE SHIPPED `hashSeed`** — `hashSeed(leagueSeed,
  generation, fixtureIndex, 0xbc)`, the same mechanism `League.createMatch` uses to derive
  fixture seeds from the league's own seed. **The BOOKED seeds are the four league seeds**
  (the IN-T2 ladder precedent).
* **THE NEUTRAL-DRIFT SHADOW** (control arm): inert passengers mutated by the SAME law in
  their OWN rng namespace and inherited through the SAME elite/mutate/reborn assignments.
  They touch no match, so they are what the gene level looks like with **zero selection on
  it** — the honest null for 「进化到底有没有采纳这个感觉」.
* **REPORTED FACES × generation**: the evolved `dvExposureWeight` distribution (league mean ·
  max · present share · above-zero share · the drift shadow · the fitness–gene correlation) ·
  **goals per match** against the house floor idiom (DF-C0 §R4's atkFrozen +0.2211, QUOTED
  with its source, never re-run) · **the deflection face** `caromInFlightPerGkRelease` at
  ladder grain, through the SAME `stepChain` and the same in-flight rule · shots · pass
  completion · interceptions · long balls.
* **FROZEN DIRECTION**: deviations route to FUTURE SLICES, never to parameter nudges.

## §P6 THE INSTRUMENT LAW (all of it previously ordered)

1. ⭐⭐ **THE CORRECTED `gPriceFires` FORM (#334 item 4)**. BK-T3's gate demanded that the
   SURVIVING dosed launches still carry hazard, and so it "failed by succeeding". This exam
   gates on the price's **EVALUATION**: at every release tick in an armed world the probe
   evaluates the SHIPPED price over the releasing player's own team-mate set × the three
   priced families at the LED aim, and the gate requires `evaluations > 0` **and**
   `non-zero evaluations > 0` at **every** rung > 0. ⚠ DECLARED: that mate set is a
   **SUPERSET** of the chooser's own candidate set at that tick (the range/state gates are not
   applied) — it is a LIVENESS census of the price inside the armed world, never a model of
   the argmax. The residual-hazard faces are still PUBLISHED (`priceFiredShare_*`), now
   labelled REPORTED rather than gated.
2. ⭐⭐ **A COMPOSITION FIXTURE FOR EVERY WALK-SIDE PREDICATE** (canon REFINED at #334 item 2:
   *"anchored extraction protects the source line; a headline-bearing walk-side predicate ALSO
   needs a composition fixture"*). Every predicate that decides what a published face COUNTS
   is a **pure function** called by BOTH the walk and a fixture table published in the
   artifact: `priceBin` (4) · `pressBin` (6) · `deliveryOf` (10) · `blockedShortOf` (6) ·
   `instantiableOf` (13) · `stepChain` (6) — **45 fixtures**, gated by `gWalkFixtures`.
   **NEUTRALISATIONS RUN LIVE BEFORE THE FREEZE, each caught LOUDLY**: dropping
   `blockedShortOf`'s target-shell term → RED · neutralising `instantiableOf`'s punt-range
   conjunct → RED · widening `stepChain`'s 240-tick window to the retire cap → RED · writing
   the weight onto `info.genome` (the #334 HIGH's own violation) → `gGenomeClean` AND `gWorld`
   RED.
3. **THE RED-ROUTING IDIOM, IN CODE** (#334 item 5): `outPath = ALL_GREEN || IS_OVERRIDE ? OUT
   : OUT + '.RED.json'`. BK-T3's placement discipline held only because a human applied it;
   here it is the instrument's own line.
4. **BOOKED = WALKED FROM THE CELLS** (#335 item 4): `gSeedsBookedEqualWalked` compares the
   **cells' own distinct-seed set** to the booked list, checks the row count against
   seeds × rungs, and checks every walked seed is inside the block. Not a projection of the
   input list.
5. **NO GATE THAT CANNOT FAIL** (#334 item 3): there is deliberately **no `gStatsZero`** — a
   hardcoded `true` is not a gate. Zero registry statistics are drawn anywhere in this file
   and the stats ledger is a FIELD. Likewise `gArmedRungsDifferFromControl` demands only that
   each ARMED rung's ledger differ from the CONTROL's — **not** that neighbouring rungs differ
   from each other, because two weights behaving identically would be a FINDING, and a gate
   must never turn a result into a red.
6. **`gFaces` FROM DISK** over EVERY published face (all rungs), every stored bin summary
   (presser signature + price histograms) **and every ladder face** (goals, gene mean, GK
   releases and the deflection face per generation), re-derived from the SERIALIZED artifact.
7. **CLOCK HONESTY / UNIT-NAME TRUTH**: every face carries the unit its name claims —
   `…PerMatch` on the 240 s match clock, `…PerGkRelease` per GK release, `…Share` a share of
   its own named denominator.
8. **THE FULL GATE LIST**: `gWorld` · `gWeightSources` · `gAnchoredParams` ·
   `gStrikeSurfaceAnchored` · `gLeadAnchored` · `gSeamSitesAnchored` · `gWalkPredicatesPinned`
   · `gWalkFixtures` · `gReplayMatchesLive` · `gArmedRungsDifferFromControl` ·
   `gPriceIsZeroInControlRung` · `gPriceFires` · `gPriceScalesWithTheRung` ·
   `gDeliveryPartition` · `gReachabilityNested` · `gNonVacuous` · `gGenomeClean` ·
   `gSeedsBookedEqualWalked` · `gLadderDoors` · `gFaces`.

## §P7 THE RIDER UNDER EXAM (commit 1, authorized at #335 item 5)

BK-T3 priced `mate.pos` while `performLoftedPass` / `performKeeperThrow` **strike** at
`mate.pos + mate.vel · flight0 · 0.7` (§P10 item 4 there; struck as a verify LOW at #334
item 3). Commit 1 closes exactly that: `bkCorridorLeadAim` + `bkCorridorPriceLed` in the seat
module, and the **three** mate-aimed choosers (loft switch · keeper throw · punt) price at the
strike's own lead. `0.7` is an **anchored extraction** of the two strike sites' own line
(`gLeadAnchored` re-checks the anchor at battery time). The family's T comes from
`bkCorridorFlightOf` at the BODY distance, exactly as the strike computes `flight0`.

⚠ **THE DINK IS NOT LED, AND THAT IS DECLARED**: `performThroughBall`'s lofted branch leads
through `runBurstPoint(runner, team, opp, flight0 · 0.85)` — a different machine — and its
chooser already prices a PROJECTED point (`point`) rather than a standing body. The
authorization named the `0.7·flight` lead of the two named strike sites; the dink's own aim
gap stays OPEN and is named here rather than quietly closed.

⚠ **THE INSTRUMENT'S PRICE CENSUS reads the target's own position + velocity**, not the
chooser's internal `point` for the dink (BK-T3's own simplification, carried) — a declared
instrument bound on the REPORTED price faces, not on either hypothesis.

## §P8 SEEDS AND STATS

* Block **12,520,000–999**, consumed WHOLE of record: **60 battery seeds**
  (12,520,000–059) **× 5 rungs = 300 walks** · the season ladder's **4 league seeds**
  12,520,900–903 (per-match seeds DERIVED via the shipped `hashSeed`) · the in-band smoke
  prefix 12,520,800–802 · the **12,520,999** world-construction receipt (also the bootstrap's
  own seed).
* **BOOKED = WALKED**, gated from the CELLS' own distinct-seed set.
* **STATS CONSUMED: ZERO.** Every interval is a percentile bootstrap over the WALKED seeds
  (the IN-T0 / DF-T2 / BK-C1 / BK-T3 precedent), not a registry-consuming statistic. Next
  stats base remains ≥ **116,800** (registry of record **69**). The dispatch's authorized
  lattice bases from 116,800 are therefore **NOT drawn** — nothing is booked that is not
  walked.

## §P9 HONEST LIMITS, STATED BEFORE THE BATTERY

1. ⚠ **THE HAND THROW IS STILL OVER-PRICED BY CONSTRUCTION** (BK-T3 §P10 item 1): its shipped
   `0.3 + laneOpenness·0.7` factor is a pinned statement and stays, so an armed throw carries
   both a height-blind openness and the height-aware hazard.
2. ⚠ **CLEARED ≠ UNCONTESTED**: above 1.35 m the ball belongs to `tryAerial`, so a cleared
   line trades a body carom for an aerial duel. Neither hypothesis claims otherwise.
3. ⚠ **THE PRICE USES THE DESIGN DISTANCE**, not the struck one — `loftKick` draws its range
   error inside the strike, after the choice. The chooser prices the ball he MEANS to hit.
4. ⚠ **THE PRESSER SIGNATURE CARRIES BK-C1's RANGE CONFOUND** (presser measured at the
   kicker, blocks happen en route).
5. ⚠ **REACHABILITY IS OPTION-EXISTENCE, NOT WINNING** — the offside gate and the aerial
   outcome are not modelled.
6. ⚠ **THE LADDER'S ECOLOGY IS NOT THE SHIPPED LEAGUE'S** (§P5) and its gen-1 world differs
   from the friendly-match battery's. The IN-T2 §CORR 5 caution rides: a ladder's goals curve
   is a DIFFERENT ecology from a friendly battery, and ceiling-effect vs disciplined-inflation
   is not separated by anything here.
7. ⚠ **n IS SMALL ON THE LOUD ROWS**: the punt and the throw are rare deliveries. Their
   intervals are published and wide, and §P3 already declares that their band is lenient.
8. ⚠ **FOUR LEAGUE SEEDS IS FOUR** — the ladder's slope statistics are means over four
   leagues with their spread published, never a resolved test.

---

<!-- ⛔ NOTHING ABOVE THIS MARKER IS EDITED AFTER THE FREEZE COMMIT. -->

# RESULTS

(appended at the results commit)
