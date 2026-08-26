# GC-T1 — THE GROUND-CORRIDOR EXAM (传球要为它撞到的身体买单,那比赛会变好吗)

> **SHUT vs ARMED on the world-11 stack — the exam the user's RED is waiting on.** Authorized by
> **COMMANDER RULING #344 item 4**; bound by
> [`GC-GROUND-CORRIDOR-CONTRACT.md`](GC-GROUND-CORRIDOR-CONTRACT.md) §3. Seam under exam:
> [`GC-T0-DORMANT-SEAM.md`](GC-T0-DORMANT-SEAM.md) (`bkGroundCorridor` + `groundShellHazard`).
> Design facts: [`BK-C2-CAROM-CENSUS.md`](BK-C2-CAROM-CENSUS.md) (#342 item 2).
> Instrument: `scripts/probes/gc-t1-ground-corridor-exam.ts`.
> Artifact: `docs/world-model/data/gc-t1-ground-corridor-exam.json`
> (**or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5,
> implemented as the instrument's own line, not a human's discipline).
>
> **THIS STAGE SHIPS NOTHING.** `bkGroundCorridor` stays default OFF and **absent from
> `a4World.ts` at every version** (re-asserted at battery time by `gSeamSitesPinned`); the
> production fingerprint `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is
> unmoved. ⛔ **X-SRC-ZERO**: no file under `src/` is edited — the probe arms the flag
> IN-INSTRUMENT, as a construction flag on its own `Match`.

## §0 THE WORDS OF RECORD, AND THE QUESTION THIS EXAM ANSWERS

The user, at the play-test gate that made this THE RED (#341 item 1, verbatim):

> 「我直接看的最后一版,传球像人,防守还可以,乱跑缓解,**但是弹身体感觉很影响比赛**,门将球
> 合理了」

and the question that opened the arc (#340 item 1):

> 「我发现传球经常会传到别人身上然后反弹回来,这个和传球速度有关系吗?还是怎么样,」

BK-C2 sized it and picked the design facts: 95.7 % of caroms ride GROUND flights, 43.1 % strike
the passer's OWN teammate, the caroming body was already standing in the first half-metre of the
line when the ball left, and on lines the chooser's own gate called OPEN a contact-shell read
separates a 0.28598307 carom population from a 0.085788 one. GC-T0 wired that discriminator into
the ground pricer and proved it asleep.

**THIS EXAM, in one sentence**: arm it, and find out whether making the pass PAY for the bodies
it would strike takes the caroms out **without taking the ground game with them**.

---

# §P PRE-REGISTRATION (frozen at the FREEZE COMMIT, BEFORE any battery seed was read)

## §CORRECTIONS-READ — every canon sentence COPIED from [`CANON.md`](CANON.md), never re-typed

Per ruling #301 item 2's mechanism fix: the ledger is where a brief copies from. ⚠ Per **#342
item 3** (the MED-1 lesson), a constraint that binds this executor beyond the ruling's own
sentences is cited as **"the dispatch brief"**, never as the ruling.

| canon, verbatim | its home | how it binds here |
| --- | --- | --- |
| freeze-before-battery — freeze the instrument commit BEFORE the battery; artifact records the instrument hash (paraphrase) | **ruling #266.3(c)** | COMMIT 1 lands this §P + the probe; the artifact records `instrumentSha256` and `headAtRun` |
| *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* | **PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1** | `BODY_SCHEMA` is the 16-key allowlist; `hashedBodySha256` is computed LAST, over the final gate values |
| mutant liveness — every gate conjunct provably alive, exactly-one enforced, or the probe refuses to run (paraphrase) | **ruling #268.3(a)** | `gPriceFires` gates the price's EVALUATION (the corrected form, #334 item 4) and `gArmsDiverge` gates the bite; ⚠ §P8 states which gates are receipts and which can fail |
| per-seed cells — per-seed/per-cluster cells stored so every headline re-derives (paraphrase) | **ruling #282.2(ii)** | `perSeedCells` stores BOTH arms' full rows per seed; `ladder.cells` stores every generation's row |
| *"the re-derivation gate covers EVERY published face; a percentile face requires stored bins"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4** | `gFaces` re-derives every face, every Δ point estimate, every stored bin table, every ladder face and the VERDICT itself off the SERIALIZED artifact |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | every `…PerMatch` face is on the 240 s match clock; every `…Share` is a share of its own named denominator; `possessionSpellSeconds` is sim-seconds |
| *"a src-extracted constant pins its extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"* | **BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1** | the shell, the open-lane line, `KICK_COOLDOWN`, both seam sites and both selection-law lines are anchored with occurrence counts and line receipts |
| *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1** | `gSeamSitesPinned` re-asserts GC-T0's read-fork inventory at battery time: ONE fork, ONE pricer statement, ONE hazard call, ONE definition, ZERO in `a4World.ts` |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every number in §R below is a FIELD of the committed artifact at source precision |
| *"a starred finding states its \|Δ\|÷half-width ratio"* | **BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2** | every paired Δ publishes `absDeltaOverHalfWidth` |
| *"a scored face's walk-side predicate is pinned — anchored extraction or fixture — because the re-derivation gate proves arithmetic, not definitions"*; REFINED at #334 item 2: *"anchored extraction protects the source line; a headline-bearing walk-side predicate ALSO needs a composition fixture"* | **DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2** (+ **BK-T3 §CORR item 2**) | `klassOf` · `isDelivery` · `isGroundLaunch` · `isMeasurableGroundPass` are PURE functions called by BOTH the walk and a published fixture table, gated by `gWalkFixtures` |
| *"a dose-source guard should hash the bytes it reads, not a self-declared field"* | **BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6** | BK-C2's reference intervals are READ out of its committed artifact with the bytes hashed first, never re-typed from prose |
| *"arming receipts, not football findings"* (receipts ≠ effect sizes) | **ruling #289 item 1** (+ BU-T1 §CORR item 5) | `strikeAttributionCompleteness`, `priceEvalNonZeroShare` and the world receipts are labelled INSTRUMENT RECEIPTS wherever they appear |
| dose placement — dose NEVER in info.genome; the ratified form = the match-local-copy idiom PLUS an info.genome-cleanliness world conjunct (paraphrase, #270.2 + #334 item 1) | **ruling #270.2** | `gGenomeClean`: in the BATTERY the franchise `info.genome` carries no `dvExposureWeight` on any walked match or receipt (world 11's pin is match-local); in the LADDER's `geneAbsent` control no club may ever hold a DV seat. §P5 states why the ladder's evolvable arm is not a dose |
| *"WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)"* | **ruling #283.2(iv)** | this probe builds `Match` DIRECTLY — battery AND ladder — and never round-trips a League, so no worker fixture is generated; the ladder's ecology is the EXAM'S, declared at §P5 |
| *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"* | **PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6** | the SIZING SMOKE walked **900,000,200–259** only; no battery seed was walked before this freeze |
| seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record (paraphrase) | the standing frontier practice (**rulings #286 item 5 onward**) | `gSeedsBookedEqualWalked` compares the CELLS' OWN distinct-seed set to the booked list and checks every walked seed is inside the block |
| clock honesty — every rate on the 240 s match clock or dual-axis (1 sim-s = 22.5 display-s); APPLIED values, never nominal (paraphrase) | **ruling #280.2(iii)** + PC-T2 §CORR item 3 | every per-match count carries the clock in its unit string; §人话 opens with the dual-clock declaration (#339) |
| composition proof — any world arming a new seam alongside the CB/L3 stack proves the doors/lifecycle at THAT composition first (paraphrase) | **BU contract M-BU.2 (ruling #285)** | the ARMED arm IS the world-11 stack — the composition an entry rung would ship |

## §P1 THE TWO ARMS — ONE CONSTRUCTION FLAG APART

| arm | construction | `bkGroundCorridor` | `dvExposureWeight` |
|---|---|---|---|
| **`shut`** | `a4MatchFlags(CORRIDOR_WORLD_VERSION)` + `armA4World(m, null, 11)` | **false** | **0.5**, world 11's own pin |
| **`armed`** | THE SAME, plus `bkGroundCorridor: true` | **true** | **0.5**, world 11's own pin |

* **THE WORLD'S OWN COMPOSER IS CALLED, NEVER COPIED** — no flag literal and no version literal
  is typed in the probe beyond the ONE new door. `gArmsIsolated` compares the two constructed
  worlds AS OBJECTS over `a4MatchFlags(11)`'s own key set plus the new door, and requires the
  difference set to be **exactly `['bkGroundCorridor']`**.
* ⭐⭐ **THE GENE SITS AT WORLD 11's OWN 0.5 PIN IN BOTH ARMS** — written by the SHIPPED
  `armCorridorWorld` → `setCorridorWeight`, on MATCH-LOCAL views. This is **GC-T0 §R2's G-ZERO
  comparator lesson made an arm**: the honest control carries the SAME gene, so the ONLY
  difference between the arms is the ground price itself. (A control without the gene would be
  measuring the LOFTED price as well, which is world 11's, not this seam's.)
* **SHARED VIRGIN SEEDS, PAIRED WALKS**: every seed is walked by both arms and the bootstrap
  CLUSTER IS THE SEED, so every Δ below is paired by construction.
* ⛔ **NO WEIGHT LADDER.** #344 item 4 pinned the gene at 0.5 in both arms; the gene's own domain
  is BK-T4's question, and what a DIFFERENT ground weight would do is **unmeasured and named**
  (§P9 item 3).

## §P2 THE INSTRUMENTS — BK-C2's OWN, RE-DERIVED, AND THE SHIPPED PREDICATE ITSELF

* **THE STRIKE ATTRIBUTION** is BK-C2 §P.1's rule in substance: a tick on which
  `bkContactLedger.strikesApplied` moved by exactly one; the struck body is the ball's own
  `lastTouch` after the step, **GATED** by that body still being inside the contact law's
  cooldown/stun gate and by his class agreeing with the ledger's own split for that tick.
  Anything else is booked `strikesUnattributed` and enters no other cell.
  `gStrikeLedgerAgrees` requires `strikes + unattributed === strikesApplied` **match by match, in
  both arms**; `gStrikeAttributionComplete` fails below 99 %.
* **THE LIVE FLIGHT** is R9's / BK-C1 §3's: the most recent release, retired when any body other
  than the kicker owns the ball or after **720 ticks**.
* **THE MEASURED GROUND PASS** is BK-C2 §P.4's population verbatim in substance — a GROUND launch
  (no positive vertical component at release) of class shortPass / throughBall / cutback for which
  the ENGINE itself names a target (`pendingPass.targetGid`) — **and it is exactly the population
  the GC term is charged on**. Shots and every headed contact are named out.
* ⭐⭐ **THE SHELL READ IS THE SHIPPED FUNCTION ITSELF.** `groundShellHazard` is IMPORTED from
  `src/ai/deliveryValueSeat.ts` and CALLED with the pricer's own body set
  (`[team.players, opp.players]`), the same kicker gid and the same receiver gid. **The observer's
  "shell-blocked" cell and the ARMED arm's price are, by construction, the SAME predicate** —
  nothing is re-implemented.
* **THE OPEN-LANE CUT** is the chooser's own literal, anchored at its named site inside
  `groundCandidate`. ⚠ **BK-C2 §CORR item 5 RIDES, unchanged**: at that site the literal lives in
  `if (gain > 0.15 && lane < 0.4)`, a contested-FORWARD-ball risk gate that never fires on
  sideways or backward passes — so 0.4 is BK-C2's chosen EXTRACTION of the chooser's literal, not
  a line the chooser draws over every pass. The full lane histogram is stored, so any other cut
  re-derives off disk.
* **THE MOMENT OF CHOICE** is the ARM-TIME seat (`pendingPassWindup`) wherever the shipped wind-up
  formed one; the RELEASE tick for the one-touch bypass that releases synchronously. The split is
  published per arm and the joint table is republished on the wind-up-only subset.

### §P2b ⭐ THE INSTRUMENT-FIDELITY CONJUNCT — BK-C2's PUBLISHED INTERVALS, FROZEN

The SHUT arm **is BK-C2's `w11` world** (the world-11 stack, gene 0.5, no ground price) walked on
FRESH seeds. So BK-C2's published `w11` intervals are the reference lines this exam's instrument
must reproduce. **The three faces the gate covers, and the exact numbers, frozen here** — READ out
of `docs/world-model/data/bk-c2-carom-census.json` with its bytes hashed first (canon: dose/data-source
guards hash the bytes they read), and asserted against these literals by `gBkC2Quoted`:

| face | BK-C2 `w11` point | BK-C2 `w11` ci95 |
|---|---|---|
| `caromedGroundOnOpenLaneShare` | **0.50322119** | [0.47622378, 0.53133903] |
| `strikeShareTeammateOfKicker` | **0.43107769** | [0.39156035, 0.46922698] |
| `groundCaromRate` | **0.16295346** | [0.15463338, 0.1716608] |

Two more are quoted (not gated), so the artifact carries the whole reference block:
`strikesPerMatch` **23.05833333** [21.14166667, 25.06666667] · `strikeShareOnGroundFlight`
**0.95739348** [0.9262607, 0.97915608].

> **FROZEN RULE (`gInstrumentReDerivesBkC2`).** For each of the three named faces, the SHUT arm's
> own 95 % bootstrap interval **OVERLAPS** BK-C2's published `w11` interval.

⚠ **OVERLAP, NOT CONTAINMENT, AND THE REASON IS STATED BEFORE THE BATTERY**: two 95 % bootstrap
intervals drawn from the same population overlap with very high probability, while a
point-inside-interval rule on three faces would carry a ~14 % family-wise false-red rate — a gate
that goes red for the wrong reason is worse than no gate. This one asks *"is this the SAME
instrument on the SAME world"*, and overlap is the honest form of that question.

## §P3 H-GC.1(a) — THE GROUND-STRIKE FACES FALL RESOLVEDLY

> **FROZEN RULE.** At **BOTH** named faces, the **PAIRED per-seed bootstrap Δ (armed − shut)** has
> its **95 % interval ENTIRELY BELOW ZERO** (the house resolution form).

| face | what it is |
|---|---|
| ⭐⭐ `groundStrikesPerMatch` | attributed body strikes on a **GROUND** flight, per match. BK-C2 §R1(ii)'s `strikeShareOnGroundFlight` numerator, published as a per-match **COUNT** so a fall cannot be manufactured by a shrinking denominator |
| ⭐⭐ `caromedGroundOnOpenLaneShare` | of the measured ground passes that ACTUALLY caromed, the share played on a line the chooser's OWN gate called OPEN. BK-C2 §R2(i)'s face verbatim — the stale map's own signature, the thing the price exists to remove |

* **THE PAIRED FORM**: the same seed in both arms is one pair; each of the 2,000 bootstrap draws
  resamples SEEDS once and re-derives BOTH arms' pooled ratios inside that draw. Percentile
  interval, resample rng seeded from the block base **12,524,000**.
* `absDeltaOverHalfWidth` is published for every Δ (canon: starred |Δ|÷half-width).
* ⭐ **THE SHARE FACE IS DELIBERATELY A SHARE AND THE COUNT FACE IS DELIBERATELY A COUNT**: one
  answers *did the caroms stop happening*, the other *did they stop happening on lines the old map
  called open*. A price that only moved volume would move the first and not the second.

## §P4 H-GC.1(b) ⭐ NON-SUPPRESSION — THE BK-T4(b) LESSON AS A CONJUNCT

> **FROZEN RULE.** `armed.groundPassesPerMatch`'s point estimate sits **AT OR ABOVE the SHUT
> arm's OWN 95 % interval's LOWER EDGE**.

* **THE BAND'S CONSTRUCTION IS DERIVED FROM THE CONTROL ARM'S OWN INTERVAL** — BK-T4 §P3's form
  exactly. **No taste constant** (no "within 10 %", no absolute floor): the band is
  `shut.groundPassesPerMatch.ci95[0]`, computed by the same bootstrap as every other interval and
  published beside the verdict.
* **THE UNIT IS PER MATCH** on the engine's own 240 s match clock (one row = one match).
* ⭐ **WHY THIS EXISTS**: BK-T4 armed the LOFTED corridor and (a) passed at every rung while (b)
  failed at every rung — 会看人之后他学会的是「别开」. **The cure must not be 「别传了」.**
* ⛔ **IF (a) PASSES ONLY WHERE VOLUME COLLAPSES, (b) FAILS AND THAT IS THE RESULT.** The rule is
  not re-cut after sight, and a failed conjunct is a measurement, not a red gate.
* **REPORTED BESIDE IT, GATED BY NOTHING**: `passCompletion` (BK-T2's own Q06 definition,
  Σ passesCompleted / Σ passes, both teams) · `possessionSpellSeconds` (playing sim-seconds per
  possession change) · `possessionFlipsPerMatch` · `flipsCaromLastContactShare`.

## §P5 H-GC.1(c) THE TEAMMATE FACE · H-GC.1(d) THE LOFTED CONTROLS

> **(c) FROZEN RULE.** `teammateStrikesPerMatch` — attributed strikes whose struck body is the
> PASSER'S OWN TEAMMATE, per match — has its **paired Δ 95 % interval ENTIRELY BELOW ZERO**, the
> same form as (a).

This is the face the widened body set exists to see: BK-C2 §R1(ii) sized side-blindness at
**0.43107769** of attributable caroms, and BK-T3's opponents-only corridor form structurally
cannot price it (#343 item 3). Published as a COUNT for the same reason as (a); the SHARE form
`strikeShareTeammateOfKicker` is reported beside it (and is one of the three fidelity faces).

> **(d) FROZEN RULE.** Each lofted-family control's **ARMED point estimate lies INSIDE the SHUT
> arm's own 95 % interval** [lo, hi] (BK-T4 §P2's control form).

| control | what it is | why it is a control |
|---|---|---|
| `loftedDeliveriesPerMatch` | deliveries whose launch had a POSITIVE vertical component | the GC term never enters the lofted `sL` chain — GC-T0 §SCOPE machine-pinned it, and `gSeamSitesPinned` re-asserts that at battery time |
| `crossesPerMatch` | the engine's OWN `crosses` counter, both teams | a delivery family with its own chooser and its own scoring chain, untouched by this seam |

⚠ **THE CONTROLS ARE NOT PERFECTLY INSULATED AND THAT IS DECLARED**: the ground price changes what
the chooser picks at ONE argmax that also contains the lofted switch, so a *substitution* effect
can move a lofted volume without the term ever being applied to it. (d) tests that the price does
not REACH the flighted lines; it cannot separate "not priced" from "not substituted into".

## §P6 ⭐ THE SEASON LADDER — THE GENE EVOLVABLE (REPORTED, NEVER GATED)

**TWO ARMS, one ecology, ONE difference: whether SELECTION MAY TOUCH THE GENE.**

| arm | `evolveDeliveryValue` | what it means |
|---|---|---|
| `geneAbsent` | **false** | the DV gene SET stays **STRUCTURALLY ABSENT** every generation, so no club holds a corridor seat and BOTH corridor prices are dead. **THE CONTROL** — and it carries the **NEUTRAL-DRIFT SHADOW** |
| `geneEvolvable` | **true** | `dvExposureWeight` may enter the population through the **SHIPPED** `mutateGenome` / `crossoverGenomes` opt-in. **NOTHING pre-seeded. NO weight set by hand anywhere in this ladder.** |

* ⭐⭐ **BOTH ARMS ARM `bkGroundCorridor` AND `bkCorridorPrice`** on the world-10 stack (= the
  world-11 flag set **plus** the ground door), so the door is open in both worlds and the only
  question is whether **a coach who values the corridor can spread**. `gLadderDoors` checks the
  doors on every one of the 7,200 matches and checks that **generation 1 is IDENTICAL across arms**
  (same founders, same fixtures).
* ⚠ **THE WORLD-11 PIN IS DELIBERATELY NOT USED HERE**: the ladder builds
  `a4MatchFlags(DF_WORLD_VERSION)` + the two corridor doors and arms through
  `armA4World(m, null, 10)`, so the genome's OWN evolved weight rides instead of world 11's fixed
  0.5. Otherwise the ladder would measure the pin, not evolution.
* ⭐⭐ **THE DOSE-PLACEMENT CONJUNCT, AND WHERE IT BINDS.** Canon (home ruling #270.2, ratified
  form at #334 item 1) is *"dose NEVER in info.genome"* + the match-local-copy idiom + an
  info.genome-cleanliness world conjunct. **This ladder writes NO weight anywhere** — the genome
  the match plays IS the franchise genome the selection loop carries, so a `dvExposureWeight` on
  `info.genome` in the evolvable arm is **EVOLUTION'S OWN VALUE, not a dose**. The conjunct is
  therefore asserted where it is meaningful, and `gGenomeClean` does both: (i) in the **BATTERY**,
  the franchise `info.genome` carries no `dvExposureWeight` on any walked match or receipt (world
  11's pin stays match-local); (ii) in the ladder's **`geneAbsent` CONTROL**, no club may ever
  hold a DV seat at all. Stated here, not discovered afterwards.
* **THE SELECTION LAW IS `evolveGroup`'s OWN**, mirrored and ANCHORED at its named lines in
  `src/evolution/evolve.ts`: elite 2 · reborn 2 · mutated 6, `{rate: 0.4, scale: 0.08}` and reborn
  `{rate: 0.5, scale: 0.15}`. **WHY probe-side**: `League.finishSeason` calls the mutators with
  **HARD-CODED** options, so an evolution opt-in cannot be armed through the shipped League at all
  (the MT-T2 / BK-T4 precedent). ⚠ **THIS ECOLOGY IS THE EXAM'S, NOT THE SHIPPED LEAGUE'S** — no
  shipped-League number is quoted as this ladder's and none of this ladder's numbers is quoted as
  the shipped game's.
* **HORIZON: 20 generations × 10 teams × a single round robin (45 matches) × 4 league seeds × 2
  arms = 7,200 matches.** 20 is **traced, not chosen**: it is the horizon the goals-warming
  reference line is itself defined on (DF-C0 §R4's early(1–5)→late(16–20) slope).
* **THE PER-MATCH SEEDS ARE DERIVED THROUGH THE SHIPPED `hashSeed`** —
  `hashSeed(leagueSeed, generation, fixtureIndex, 0xbc)`, the same mechanism `League.createMatch`
  uses. **The BOOKED seeds are the four league seeds** (the IN-T2 / BK-T4 ladder precedent).
* **THE NEUTRAL-DRIFT SHADOW** (control arm): inert passengers mutated by the SAME law in their
  OWN rng namespace and inherited through the SAME elite/mutate/reborn assignments. They touch no
  match, so they are what the gene level looks like with **zero selection on it** — the honest null
  for 「进化到底有没有采纳这个感觉」.
* **REPORTED FACES × generation**: goals · shots · pass completion · interceptions · crosses ·
  ground strikes · teammate strikes · all strikes · ground passes · lofted deliveries ·
  `caromedGroundOnOpenLaneShare` at ladder grain · the evolved gene distribution (league mean ·
  max · present share · above-zero share) · the drift shadow · the fitness–gene correlation ·
  **goals × generation** against the house floor idiom (DF-C0 §R4's atkFrozen **+0.2211**, QUOTED
  with its source, never re-run).
* ⭐ **THE FITNESS-VISIBILITY QUESTION IS REPORTED, NEVER GATED** (the #336 §CORR 4 door):
  win-only fitness may simply not SEE the carom cost. The correlation and the drift shadow are
  published so the question is answerable; **nothing is nudged either way**.
* **FROZEN DIRECTION**: deviations route to FUTURE SLICES, never to parameter nudges.

## §P7 THE PERF FACE — THE METHOD, DECLARED BEFORE THE NUMBER (GC-T0 §DEV 3's debt)

`wallSecondsPerMatch`, per arm. **METHOD**: each walk is timed end to end (`Date.now()` around the
walk); the two arms are walked **BACK TO BACK on the same seed** (shut first, armed second), so
scheduler and thermal drift are spread across both arms rather than concentrated in one; the face
is Σ wall seconds ÷ walks, and its paired Δ is published like any other.

⚠ **WHAT IT MEASURES AND WHAT IT DOES NOT.** The timed region is the **WALK**, not the engine
alone: the observer's own `laneOpenness` and `groundShellHazard` reads sit inside it **in BOTH
arms**, so the **DIFFERENCE** is the priced chooser's cost and the **LEVEL** is not the game's
frame cost. It is a **MACHINE reading on one machine**, never a portable number. GC-T0 §HONESTY 5
predicted the shape: the hazard is one loop over both teams per priced candidate with an EARLY
RETURN on the first blocking body, so the armed cost is strictly **data-dependent** and may even
be negative if the priced chooser plays fewer long lines.

## §P8 THE GATES (frozen; a red gate is REPORTED, never patched, and ROUTES THE ARTIFACT)

`gWorld` · `gArmsIsolated` · `gSharedSeeds` · `gAnchoredConstants` · `gSeamSitesPinned` ·
`gWalkFixtures` · `gStrikeLedgerAgrees` · `gStrikeAttributionComplete` · `gJointPartition` ·
`gPriceFires` · `gArmsDiverge` · `gBkC2Quoted` · `gInstrumentReDerivesBkC2` · `gGenomeClean` ·
`gLadderDoors` · `gNonVacuous` · `gSrcUntouched` · `gSeedsBookedEqualWalked` · `gFaces` —
**19 gates**.

1. ⭐⭐ **NO GATE THAT CANNOT FAIL** (#334 item 3). There is deliberately **no `gStatsZero`**: a
   hardcoded `true` is not a gate. Zero registry statistics are drawn anywhere in this file and the
   stats ledger is a **FIELD** (`stats.consumed = 0`).
2. ⭐⭐ **NO TAUTOLOGICAL GATE, AND NO GATE ON A DIRECTION.** `gPriceFires` is the corrected
   `gPriceFires` form (#334 item 4): it requires the shipped predicate to be **EVALUATED** on the
   armed arm's priced ground lines **and** to be non-zero somewhere — a LIVENESS census, so it can
   never "fail by succeeding". `gArmsDiverge` requires only that SOME paired cell differ between
   the arms (a bite receipt); two arms behaving identically would mean the flag never reached the
   pricer. **No gate asks any face to move in any direction** — that is H-GC.1's business, and
   H-GC.1 is a VERDICT, not a gate.
3. **`gFaces` FROM DISK** covers every published face, every Δ point estimate, every stored bin
   table, every ladder face, every ladder slope, the BK-C2 quotation **and the VERDICT ITSELF**
   (the four conjuncts are re-evaluated from the serialized faces and deltas and compared to the
   published verdict).
4. **BOOKED = WALKED FROM THE CELLS** (#335 item 4): `gSeedsBookedEqualWalked` derives the walked
   set from the CELLS' own distinct seeds, checks the count against the booked list, checks the
   walk arithmetic, and checks every walked seed and every ladder league seed lies inside the
   authorized block. Not a projection of the input list.
5. ⭐ **THE RED-ROUTING IDIOM, IN CODE** (#334 item 5): `outPath = ALL_GREEN ? OUT : OUT +
   '.RED.json'` is the instrument's own line, evaluated after `gFaces`.

## §P9 SEEDS, SIZING AND STATS

* **BLOCK 12,524,000–999**, opened by #344 item 4 and **consumed WHOLE of record**. The sub-band
  split, declared here:
  * **battery** = **12,524,000–159** (160 seeds × 2 arms = **320 walks**);
  * **ladder leagues** = **12,524,900 / 901 / 902 / 903** (per-match seeds DERIVED through the
    shipped `hashSeed`);
  * **world-construction receipt** = **12,524,999**, one per arm (2 walks).
  * **BOOKED = WALKED**: `gSeedsBookedEqualWalked` requires 322 walks against 160 distinct cells.
* **THE SIZING SMOKE WALKED THE OUT-OF-BAND SCRATCH RANGE, 900,000,200–259** (canon: verifier
  scratch seeds). **No battery seed was walked before this freeze.**
* **SIZING, and what the smoke already showed — DECLARED HERE RATHER THAN EXPLAINED LATER.** On
  60 scratch seeds the paired Δ half-width on `groundStrikesPerMatch` was **1.733333** strikes per
  match. A cluster bootstrap's half-width falls like `1/√n`, so **160 seeds** gives ≈ **1.06**
  strikes per match — the battery can resolve a fall of ≳ 7 % of the shut arm's level. 160 is
  taken because a paired walk costs ≈ 0.24 s and the block is consumed whole either way.
  ⚠⚠ **AND THE SMOKE'S OWN Δ POINT ESTIMATES ARE DISCLOSED NOW, BEFORE THE BATTERY, BECAUSE I SAW
  THEM**: `groundStrikesPerMatch` Δ = **+0.65** [−1.066667, 2.4] and `caromedGroundOnOpenLaneShare`
  Δ = **−0.00546** [−0.047426, 0.035044] — i.e. **flat, and (a)'s direction not visible at scratch
  grain**. The conjunct FORMS above are ruling #344 item 4's, not mine, and **not one of them is
  re-cut** on the strength of that sight. If (a) fails on the battery, that failure is the result.
* **STATS CONSUMED: ZERO.** Every interval is a percentile bootstrap over the WALKED SEEDS (the
  IN-T0 / DF-T2 / IN-T1 / BK-C1 / BK-C2 precedent, #329 item 4), not a registry-consuming
  statistic. Next stats base remains ≥ **117,600**, registry of record **73**.

## §P10 HONEST LIMITS, STATED BEFORE THE BATTERY

1. ⚠ **NO CLAIM THAT THE CAROM DISAPPEARS** (contract §4): the price is a price, not a wall. A
   blocked line still COMPETES, at a price, in the same argmax.
2. ⚠ **ONE COMPOSITION ONLY.** The armed arm is the world-11 stack. **DV + GC double-arming is
   unmeasured** (contract §4 names it; no world arms both).
3. ⚠ **THE GENE IS PINNED AT 0.5 IN BOTH ARMS.** This exam walks no weight ladder; what a
   different ground weight would do is unmeasured and is a NAMED DOOR, not a finding here.
4. ⚠ **THE BINARY FORM IS BK-C2's MEASURED DISCRIMINATOR, NOT A PROVEN OPTIMUM** (GC-T0 §HONESTY
   3). A graded refinement is the contract §4's held door.
5. ⚠ **THE CONTROLS CANNOT SEPARATE "NOT PRICED" FROM "NOT SUBSTITUTED INTO"** (§P5).
6. ⚠ **THE INTERCEPTION DECOMPOSITION IS TEMPORAL, NOT CAUSAL** (BK-C2 §P.7's own warning,
   inherited): *"a carom happened before this interception"* is not *"this interception happened
   because of the carom"*.
7. ⚠ **THE LADDER'S ECOLOGY IS NOT THE SHIPPED LEAGUE'S** (§P6), its gen-1 world differs from the
   friendly-match battery's, and **four league seeds is four**. IN-T2 §CORR 5's caution rides: a
   ladder's goals curve is a DIFFERENT ecology from a friendly battery, and ceiling-effect vs
   disciplined-inflation is separated by nothing here.
8. ⚠ **THE PERF FACE IS A MACHINE READING** (§P7), not a portable cost.
9. ⚠ **THE OPEN-LANE CUT IS BK-C2's EXTRACTION** of the chooser's literal (BK-C2 §CORR item 5),
   carried unchanged; the full lane histogram is stored so any other cut re-derives off disk.
10. ⚠ **THE ONE-TOUCH BYPASS HAS NO WIND-UP SEAT** (BK-C2 §P.4), so its choice read is taken at
    the RELEASE tick. The split is published per arm and the joint table is republished on the
    wind-up-only subset.

---

<!-- ⛔ NOTHING ABOVE THIS MARKER IS EDITED AFTER THE FREEZE COMMIT. -->

# RESULTS

> *(written by COMMIT 2, after the battery)*
