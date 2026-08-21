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

> Freeze `62df2d0` → this commit. **20/20 GATES GREEN**, so the artifact sits at the
> **CANONICAL path** `docs/world-model/data/bk-t4-corridor-exam.json` (the red-routing branch
> was live and not taken). 300 battery walks (60 seeds × 5 rungs) + the 12,520,999
> construction receipt + the season ladder's 7,200 matches; **wall 921.291 s** (battery
> 36.009 s, ladder 884.306 s). `gFaces` re-derived **210/210** published faces, **100/100**
> stored-bin checks and **40/40** ladder faces off the serialized artifact, 0 failures;
> **45/45** walk-side fixtures pass. `hashedBodySha256 =
> 5f8853ed2b074f94864e0f813e0c5faf8435a3f13b18bd2eb5025dda785c7699`.
> `gReplayMatchesLive` GREEN on **25,514** per-tick samples at `maxAbsDiff = 0` m.
> Every number below is quoted from an artifact FIELD (canon: doc-prose fidelity).

## §R0 THE VERDICT, IN ONE LINE

**H-BK.3(a) PASSES AT EVERY ARMED RUNG. H-BK.3(b) FAILS AT THE LOWEST PASSING RUNG — AND AT
EVERY OTHER RUNG TOO.** 会看人之后,他在自己基因整个定义域上学会的都是「别开」,不是「换条线
开」。The #334 shape question is answered, and the answer is the one the parent stage feared:
**suppression is not an artefact of the domain maximum — it is what this price does at every
legal weight.**

## §R1 H-BK.3(a) — THE DEFLECTION FALLS, THE CONTROLS DO NOT MOVE ✅

`caromInFlightPerGkRelease` (R9's chain family, the user's exact #328 pattern):

| rung | value | n / GK releases | ci95 | Δ vs rung 0 | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|---|
| **0** (control) | **0.09514563** | 49 / 515 | [0.056311, 0.133581] | — | — | — |
| **0.25** | **0.05628518** | 30 / 533 | [0.028958, 0.085821] | **−0.03886045** | [−0.06859799, −0.01118434] | **1.3537** |
| **0.5** | **0.03780718** | 20 / 529 | [0.012797, 0.066055] | **−0.05733845** | [−0.09672247, −0.02269345] | **1.5491** |
| 0.75 | 0.04681648 | 25 / 534 | [0.014981, 0.084048] | −0.04832915 | [−0.09374419, −0.00432389] | 1.0809 |
| 1 | 0.04299065 | 23 / 535 | [0.012397, 0.079125] | −0.05215498 | [−0.09822066, −0.00677145] | 1.1406 |

**EVERY armed rung's paired interval lies entirely below zero**, so (a)'s first conjunct holds
at all four; the deepest fall is at **rung 0.5** (−0.0573, **1.55 half-widths**), not at the
domain maximum. ⭐ The rung-0.5 → rung-1 rows are statistically indistinguishable from each
other — **the price's work is done by the first half of the gene's domain**.

⛔ **THE UNPRICED CONTROLS STAND STILL** — the attribution signature, at every rung:

| face | rung 0 | 0.25 | 0.5 | 0.75 | 1 | rung-0 ci95 | inside? |
|---|---|---|---|---|---|---|---|
| `blockedShortShare_cross` | 0.81564246 | 0.79761905 | 0.80246914 | 0.78443114 | 0.78313253 | [0.759162, 0.87027] | **yes ×4** |
| `blockedShortShare_drivenPass` | 0 (0/4,313) | 0 (0/4,423) | 0 (0/4,569) | 0 (0/4,500) | 0 (0/4,499) | [0, 0] | **yes ×4** |

`caromWithin240PerGkRelease` (the wider chain face, reported): 0.10097087 → 0.0750469 →
0.05482042 → 0.06367041 → 0.05981308.

## §R2 H-BK.3(b) — RE-AIM vs SUPPRESS: **SUPPRESS**, AND THE FROZEN RULE SAYS FAIL ❌

The lowest rung passing (a) is **0.25**, so (b) is evaluated there (frozen rule, §P3).

| face | rung 0 | rung-0 ci95 LOWER EDGE (the band) | rung 0.25 | non-inferior? |
|---|---|---|---|---|
| ⭐⭐ `loftedLaunchesPerMatch_pooled` | 3.78333333 | **2.95** | **2.01666667** | ❌ |
| `loftedLaunchesPerMatch_punt` | 0.55 | 0.216667 | 0.2 | ❌ |
| `loftedLaunchesPerMatch_loftSwitch` | 0.26666667 | 0.133333 | 0.13333333 | ✅ (ON the edge) |
| `loftedLaunchesPerMatch_throughLoft` | 2.63333333 | 2.033333 | 1.5 | ❌ |
| `loftedLaunchesPerMatch_throw` | 0.33333333 | 0.15 | 0.18333333 | ✅ |

**H-BK.3(b) FAILS**: the pooled volume falls **3.78 → 2.02 launches per match, −47 %**, well
below the control arm's own interval. It fails at every other rung too (pooled 1.47 · 1.50 ·
1.45 at rungs 0.5 · 0.75 · 1), so **there is no rung of this gene's domain at which the carom
falls and the lofted game survives**. The rule was frozen before the battery and is not
re-cut: 这就是结果.

⭐⭐ **BUT THE MECHANISM IS NOT PURE SUPPRESSION — THERE IS RE-AIMING INSIDE THE SURVIVORS**,
and it is measurable in the price the survivors pay (`meanHazard_*`, the hazard of the launches
actually played):

| delivery | rung 0 | 0.25 | 0.5 | 0.75 | 1 |
|---|---|---|---|---|---|
| punt | 0.93912038 | 0.58333333 | **0** | **0** | **0** |
| loftSwitch | 0.58995724 | 0.05857477 | 0.06694259 | **0** | **0** |
| keeper throw | 0.50389042 | 0.29544106 | 0.21405762 | 0.09551702 | 0.09257966 |
| **dink** | 0.97000632 | **0.98428502** | 0.94903958 | 0.92374157 | **0.92153118** |

**THE THREE LED DELIVERIES CLEAN THEIR LINES** (the punt's and the switch's surviving launches
carry hazard exactly 0 from rung 0.5 up; the throw's mean hazard falls 5.4×) — **the dink does
not, at any rung.** The dink is the volume-dominant delivery (158 of 227 pooled launches at
rung 0) and it is the one delivery whose aim the rider did NOT close (§P7): its chooser prices
a projected burst point, its whole line is hazardous, and so its only available answer to a
price is to be played less (2.63 → 1.50 → 1.15 per match). ⭐ **THE SUPPRESSION IS
CONCENTRATED EXACTLY WHERE THE AIM IS STILL WRONG** — a labelled hypothesis (有故事就要有探针),
not a finding: this exam froze no probe that tests it, and the dink's own lead is an
unauthorized change.

`blockedShortShare_*` by delivery, the direction receipt: punt **0.87878788 → 0.58333333 →
0.25** (rungs 0 → 0.25 → 0.5+) · throw **0.05 → 0** · loftSwitch 0.125 → 0.25 → 0.33333333
(2/16 → 2/6, the same two blocks against a shrinking denominator) · dink 0.67721519 →
0.68888889 → 0.7826087 (⚠ moving denominators, disclosed).

## §R3 REPORTED — Q06, THE PRESSER SIGNATURE, THE PRICE, THE REACHABILITY

**Q06 (`q06PassCompletion`, BK-T2's own definition)**: 0.60204278 [0.584618, 0.618773] ·
0.59237875 · **0.59259955** · 0.59174748 · 0.59170472. ⛔ **THE RECOVERY DOES NOT HAPPEN AT ANY
RUNG** — the direction pre-registered at BK-T3 §P6 misses again, flat-to-slightly-lower with
overlapping intervals, and the ladder rung that was supposed to reveal it (0.25) is the one
that moves it least. BK-T2's own field, bytes hashed: `ryiQ06PassCompletion` base
`0.6861832642355529` → armed `0.5974930362116991`.

**THE PRESSER SIGNATURE (2 m bins, blocked/launches)** — no rising limb appears at any rung,
and the GK peak bin FALLS with the weight:
* **GK**, rung 0: 0/14 · 2/11 · 5/20 · **74/170** · 10/67 · 0/44 · 0/52 · 3/137
* **GK**, rung 0.25: 0/19 · 2/13 · 4/23 · **41/164** · 2/58 · 1/45 · 1/60 · 0/151
* **GK**, rung 1: 0/19 · 1/11 · 8/26 · **26/153** · 2/63 · 0/50 · 1/62 · 0/151
* **OUTFIELD**, rung 0: 9/2287 · 21/1380 · 20/314 · 13/249 · **131/391** · 0/38 · 0/11 · 0/12
* **OUTFIELD**, rung 1: 5/2348 · 9/1401 · 10/318 · 10/237 · **118/374** · 0/32 · 0/16 · 0/8

⚠ BK-C1's range confound is carried, not removed (§P9 item 4).

**THE PRICE'S EVALUATION CENSUS** (the corrected liveness record): rung 0 evaluates the price
**0** times (no seat — `gPriceIsZeroInControlRung` GREEN); every armed rung evaluates it
~78–80 k times per rung with `priceEvalNonZeroShare` **0.67758047 · 0.67905833 · 0.67829974 ·
0.67854692** and `priceEvalMeanHazard` ~**0.589** — i.e. **two of every three lines the armed
chooser looks at have a body on them**, at every rung, and that number does NOT move with the
weight. The chooser's information is identical across rungs; only what he does with it changes.

**THE PRICE DISTRIBUTION** (hazard histogram of the launches played, 10 × 0.1 bins) shows the
same story as §R2 from the other side — the punt's population moves from `[2,0,…,31]` (rung 0)
to `[5,0,…,7]` (0.25) to `[4,0,…,0]` (rung 1): the high-hazard launches do not get re-aimed,
they **stop being played**, while the dink keeps 62 of its 69 launches in the top bin at rung 1.

**PER-FAMILY REACHABILITY AT THE PASSING RUNG (0.25)**: `reachAnyClearShare` **0.92156863**
(47/51) · `reachAnyReachableShare` **0.90196078** (46/51) · per family BOTH: loft
**0.66666667** · dink **0.84313725** · keeper throw **0** (0/51 — the family the chooser can
never reach at a blocked lofted launch, its own 8–30 m band, reproduced from BK-T3's 0/63).
At rung 0 the same faces read 0.87234043 and 0.86170213 over 94 blocked launches.

## §R4 ⭐⭐ THE SEASON LADDER — EVOLUTION DOES **NOT** ADOPT THE CORRIDOR SENSE

7,200 matches (2 arms × 4 leagues × 20 generations × 45), `gLadderDoors` GREEN (both arms
armed, generation 1 identical, the control's gene structurally absent throughout).

| gen | arm | goals/match | gene mean | gene max | present | > 0 | **drift null** | carom/GK release | long balls/match |
|---|---|---|---|---|---|---|---|---|---|
| 1 | geneAbsent | 2.428 | 0 | 0 | 0 | 0 | 0 | 0.07147 | 3.47 |
| 1 | geneEvolvable | 2.428 | 0 | 0 | 0 | 0 | — | 0.07147 | 3.47 |
| 5 | geneAbsent | 2.811 | 0 | 0 | 0 | 0 | 0.042528 | 0.06135 | 3.22 |
| 5 | geneEvolvable | 2.878 | 0.05791 | 0.3895 | 0.825 | 0.350 | — | 0.05357 | 3.10 |
| 10 | geneAbsent | 2.933 | 0 | 0 | 0 | 0 | 0.073632 | 0.14277 | 4.93 |
| 10 | geneEvolvable | 2.989 | 0.08809 | 0.4705 | 0.950 | 0.650 | — | 0.08598 | 3.43 |
| 20 | geneAbsent | 3.950 | 0 | 0 | 0 | 0 | **0.226223** | **0.16085** | 5.43 |
| 20 | geneEvolvable | 3.850 | **0.12411** | 0.4687 | 1.000 | 0.625 | — | **0.07031** | 2.46 |

⭐⭐ **THE ADOPTION ANSWER IS NO — AND THE NEUTRAL-DRIFT SHADOW IS WHAT SAYS SO.** The gene
does SPREAD (present share 0 → 1.000 by generation 15, above-zero share 0.625 at generation
20, league-mean weight **0.12411**), but the control arm's INERT PASSENGERS — mutated by the
same law, selected on by nothing — reach **0.226223**, i.e. **1.8× higher than the level
selection actually produced**. Per league the selected finals are 0.31416861 · 0.00218746 ·
0.07733286 · 0.1027348 against drift finals 0.09770595 · 0.17252809 · 0.44027093 · 0.19438985.
**Selection does not pull this weight up; it does not obviously pull it down either — the gene
behaves like a near-neutral marker whose spread is drift.** The fitness–gene correlation wanders
either side of zero by generation (+0.034 · +0.024 · −0.080 · −0.100 · +0.153 · −0.040 ·
+0.149 · +0.146 at generations 2 · 3 · 5 · 8 · 10 · 15 · 16 · 20). 教练自己不会学着更在乎这
件事 —— 至少在这个生态里,在二十代之内,不会。

⭐ **AND YET THE LADDER SHOWS THE PRICE'S EFFECT SURVIVING SELECTION**: the control league's
own deflection face **grows** 0.07147 → 0.16085 per GK release over twenty generations (the
evolving attack learns to launch into bodies more, exactly the DF-C0 「进球逐季通胀」 pattern),
while the evolvable league's stays **flat at 0.07031** — and its long balls per match fall
3.47 → 2.46 against the control's rise to 5.43. **The suppression signature of §R2 reproduces
at ladder grain, across twenty generations, with nothing set by hand.**

**GOALS × GENERATION vs THE HOUSE FLOOR IDIOM**: early(1–5) → late(16–20) goals/match slope
**geneAbsent +0.742222** (sd 0.613237, per league +0.848889 · +1.257778 · −0.142222 ·
+1.004444) · **geneEvolvable +0.952222** (sd 0.979758, per league +2.244444 · +0.328889 ·
+0.071111 · +1.164444). Both sit well above DF-C0 §R4's quoted atkFrozen floor **+0.2211**
(QUOTED, not re-run), both spreads are enormous at four leagues, and **no between-arm test was
frozen and none is invented**. ⚠ IN-T2 §CORR 5's caution rides: a ladder's goals curve is a
different ecology from the friendly battery, and ceiling-effect vs disciplined-inflation is
separated by nothing here.

## §R5 THE GATES

All twenty GREEN: `gWorld` · `gWeightSources` · `gAnchoredParams` · `gStrikeSurfaceAnchored` ·
`gLeadAnchored` · `gSeamSitesAnchored` · `gWalkPredicatesPinned` · `gWalkFixtures` (45/45) ·
`gReplayMatchesLive` (25,514 samples, 0 m) · `gArmedRungsDifferFromControl` ·
`gPriceIsZeroInControlRung` · `gPriceFires` (**the corrected form** — every armed rung
evaluates the price and sees non-zero hazard; it could no longer "fail by succeeding") ·
`gPriceScalesWithTheRung` · `gDeliveryPartition` · `gReachabilityNested` · `gNonVacuous` ·
`gGenomeClean` (**`info.genome` carries no `dvExposureWeight` at any rung** — the #334 item 1
form, discharged) · `gSeedsBookedEqualWalked` (from the cells' own distinct-seed set) ·
`gLadderDoors` · `gFaces`.

**THE RIDER'S OWN RECEIPT**: `gLeadAnchored` re-proved at battery time that both named strike
bodies carry `const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));` exactly once and
that the seam's exported fraction IS that line's number. The production fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved
(`npm run fingerprint`, seed 1337 · 2 seasons · 142 matches).

## §R6 SEEDS AND STATS, AS CONSUMED

Block **12,520,000–999 CONSUMED WHOLE**: 60 battery seeds 12,520,000–059 × 5 rungs = **300
walks** (booked = walked, gated from the CELLS' own distinct-seed set: 60 distinct seeds, 300
rows) · ladder leagues **12,520,900–903** (per-match seeds derived through the shipped
`hashSeed`) · in-band smoke prefix 12,520,800–802 · the **12,520,999** construction receipt,
also the bootstrap's own seed. **STATS CONSUMED: ZERO** — every interval is a percentile
bootstrap over walked seeds; registry of record stays **69**, next stats base ≥ **116,800**.

## §DOUBTS (declared)

1. **(b) FAILED, AND THE FAILURE IS THE HEADLINE.** No rung of the gene's own domain buys the
   carom without buying volume loss. Nothing here says a DIFFERENT price (a multiplier, a
   target re-pick, a raised arc) would fail too — those are unmeasured, and three of them are
   explicitly outside #328's prohibition or this slice's authorization.
2. **THE DINK IS THE UNCLOSED AIM.** §R2's mechanism reading — that suppression concentrates
   where the priced aim is still not the flown line — is a LABELLED HYPOTHESIS with no probe.
   The obvious next slice (price the dink at `runBurstPoint`'s own lead) is a src change nobody
   has authorized.
3. **THE LADDER'S DRIFT COMPARISON IS A COMPARISON ACROSS ARMS**, and from generation 2 the
   two arms' evolution RNG streams are displaced by the opt-in's own extra draws (the MT-T2
   declaration, inherited). Generation 1 is identical by construction (asserted by
   `gLadderDoors`), and four leagues is four.
4. **THE LADDER'S ECOLOGY IS NOT THE SHIPPED LEAGUE'S** (§P5/§P9 item 6): 10 teams, one round
   robin, the probe's own selection loop. No number here is a claim about the shipped game.
5. **n IS STILL SMALL ON THE LOUD ROWS**: 33 punts and 20 throws at rung 0 across 60 seeds.
   §P3 declared their bands lenient before the battery, and both of them "passed" (b)'s
   conjunct at rung 0.25 while the pooled face — the one with the population — failed hard.
6. **Q06's MISS IS NOW TWICE MEASURED AND STILL UNEXPLAINED.** The labelled hypothesis from
   BK-T3 §R5 (ground balls replacing lofted ones and paying the contact law's reception tax)
   remains without a probe.
7. **THE EVALUATION CENSUS IS A SUPERSET** of the chooser's candidate set (§P6 item 1). It
   proves the price is live and shows what the chooser sees; it is not a model of the argmax.

## §COMMANDER CORRECTIONS OF RECORD (ruling #336, 2026-08-22 — frozen bytes stand)

1. **(verify MED) THE RIDER CLOSED THE LEAD GAP, NOT THE SWING GAP — corrected of
   record**: "the priced aim is the line the strike flies" is exactly true only for the
   keeper throw; performLoftedPass adds aerialSwing Magnus (±0.12+passing·0.18 rad) the
   price does not model, so the priced line is the PRE-SWING straight line. Same family
   as BK-T3's declared spin-0 counterfactual limit; the residual is now NAMED. Any future
   claim quotes "the strike's own lead, pre-swing".
2. **(verify LOW ×2)**: the starred "three led deliveries clean their lines" rests on
   tiny dosed-arm denominators (punt 0/4, switch 0/6 at the top rungs) — the n rides
   inline with the claim of record; the stale PTP-T0 sibling comment (PlayerBrain.ts
   ~L694) is a one-clause rider on the next BK-touching slice.
3. **H-BK.3(b)'s FAIL IS THE FINDING OF RECORD, AND THE CONSTRAINT IS NOW NAMED**: 换条
   线开 does not happen at ANY legal weight because the volume-dominant DINK has no
   alternative line to price — its corridors are occupied (~0.92–0.98 hazard at every
   rung) and its aim is a different machine the authorization did not open. RE-AIMING
   REQUIRES THE CORRIDOR PRICE AT TARGET CHOICE — BK-C1's deliberately-held exclusion is
   now MEASURED as the binding constraint — and/or the #330 curl door. NAMED DOORS, not
   dispatched: the TARGET-CHOICE corridor slice · the curl election. The gate re-shape
   before freeze (null ≠ red) is ratified; the probe-side ladder ecology (League
   hard-codes its evolution options) is ratified on the MT-T2 precedent.
4. ⭐⭐ **THE ADOPTION ANSWER IS NO, AND IT ECHOES #167 LEG S**: selection does not adopt
   the corridor gene in twenty generations (selected league-mean 0.124 vs the
   neutral-drift shadow 0.226 — BELOW drift; fitness–gene correlation wandering zero) —
   win-only fitness does not SEE the carom cost, exactly as it did not see defensive
   look-value. Yet the price's effect is real at ladder grain: the control's carom face
   INFLATES across generations (0.071 → 0.161/GK release) while the evolvable arm stays
   flat (0.070). The fitness-visibility question is a NAMED DOOR (what winning sees —
   an ecology question, never a nudge).
5. **THE ENTRY CANDIDATE, HELD FOR THE ENTRIES ROUND**: the corridor at a fixed modest
   rung (0.5 = the deepest carom fall) fixes the user's named pattern at exam grain
   (carom −60 %, GK peak-bin block rate .435→.170, controls flat) at the disclosed cost
   of lofted-volume suppression (pooled 3.78→1.5/match — a texture change only the
   user's eyes can price). Decided when the DF cap-off lands and the entries bundle.
