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

> Freeze `5d3e6b1` → this commit. **19/19 GATES GREEN**, so the artifact sits at the **CANONICAL
> path** `docs/world-model/data/gc-t1-ground-corridor-exam.json` (the red-routing branch was live
> and not taken). **322 battery walks** (160 seeds × 2 arms + 2 world-construction receipts) +
> the season ladder's **7,200 matches**; `batteryWallSeconds` **34.992** + `ladderWallSeconds` **811.81**.
> `gFaces` re-derived **68/68** face-and-Δ checks and **74/74** stored-bin / ladder / quotation /
> **verdict** checks off the serialized artifact, 0 failures; **30/30** walk-side fixtures pass.
> `hashedBodySha256 = d5bdc4cf5dd3a7b4fb54f09aebc24414690063cfa5cc92cddde8b997ce8d246a`.
> `strikeAttributionCompleteness` = **1** in BOTH arms (shut 4104/4104, armed 4161/4161) —
> ⚠ an instrument receipt, never a football finding.
>
> ⭐ **EVERY NUMBER BELOW IS A QUOTED ARTIFACT FIELD AT SOURCE PRECISION** (canon: doc-prose
> fidelity). No number in this section is computed here; where two faces are compared, both are
> quoted with their intervals and the comparison is stated in words.

## §R0 THE VERDICT, IN ONE LINE

**H-GC.1 FAILS: (a) FAIL · (b) FAIL · (c) FAIL · (d) PASS.** The ground price **changes which
lines the chooser picks — and it buys that change by not passing.** 会看人之后,地面传球学会的
和门将当初学会的是同一件事:**「别传了」,不是「换条线传」**。BK-T4 §R2's suppression
signature reproduces on the GROUND chooser at the world's own pinned weight, and — unlike the
lofted case — **the carom it was built to remove does not resolvedly fall.**

## §R1 H-GC.1(a) — THE GROUND-STRIKE FACES DO NOT FALL RESOLVEDLY ❌

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw | interval below 0? |
|---|---|---|---|---|---|---|
| ⭐⭐ `groundStrikesPerMatch` | **16.48125** [15.2375, 17.8125] (2637/160) | **15.825** [14.19375, 18.0625] (2532/160) | **−0.65625** | [−2.66875, 1.7375] | **0.2979** | ❌ |
| ⭐⭐ `caromedGroundOnOpenLaneShare` | **0.5258664** [0.50233524, 0.54912099] (1047/1991) | **0.51579521** [0.49276974, 0.53973333] (947/1836) | **−0.01007119** | [−0.03791517, 0.01914887] | **0.353** | ❌ |

**Both conjuncts fail, and the second fails flat.** The stale map's own signature — the share of
caroms played on lines the chooser's gate called OPEN — is **unmoved**: a price that saw exactly
those lines did not stop the ball hitting people on them.

⚠ The base rate is the near miss, and it is reported as one: `groundCaromRate` **0.17076936**
[0.16337582, 0.17822463] → **0.16491512** [0.15805933, 0.17212434], Δ **−0.00585425**
[−0.01321731, **0.00153688**], 0.7936 half-widths — falling, not resolved.

## §R2 H-GC.1(b) ⭐ NON-SUPPRESSION FAILS — AND IT IS THE HEADLINE ❌

> Frozen band = the SHUT arm's own 95 % interval LOWER EDGE, **70.775** ground passes per match.
> Armed point estimate: **69.58125**.

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐⭐ `groundPassesPerMatch` | **72.86875** [70.775, 74.9] (11659/160) | **69.58125** [67.59375, 71.5125] (11133/160) | **−3.2875** | [−4.9125, **−1.64375**] | **2.0115** |

**The armed arm plays −3.2875 ground passes a match — below the control arm's own interval,
with the paired Δ resolvedly negative at two half-widths.** The rule was frozen before the
battery and is not re-cut: **(b) FAILS.**

⭐⭐ **AND THE STORED JOINT TABLES SAY EXACTLY WHERE THE PASSES WENT — NOWHERE.**
`jointLaneOpenByShellBlocked`, rows `[laneOpen, laneContested]` × cols `[shellBlocked,
shellClear]`, over every measured ground pass:

| arm | measured | open·blocked | open·clear | contested·blocked | contested·clear |
|---|---|---|---|---|---|
| `shut` | 11659 | **1447** | 6365 | 1772 | 2075 |
| `armed` | 11133 | **1134** | 6349 | 1632 | 2018 |

⚠ The four numbers that follow are DIFFERENCES OF THE TABLE CELLS DIRECTLY ABOVE, not separate
faces: the blocked column loses **1447 − 1134 = 313** and **1772 − 1632 = 140**, i.e. 453 of the
**11659 − 11133 = 526** missing ground passes, while the CLEAR columns lose only
**6365 − 6349 = 16** and **2075 − 2018 = 57**. So the price does what it was designed to do at the level of line choice —
`groundOpenLaneButShellBlockedShare` falls **0.12411013** [0.1178431, 0.13043478] →
**0.10185934** [0.09661139, 0.10738498], and the price's own liveness census
`priceEvalNonZeroShare` falls **0.27609572** [0.26717172, 0.28517143] → **0.24845055**
[0.2412523, 0.2556384] — **but the blocked lines it declines do not come back as clear ground
passes, as lofted deliveries or as crosses.** `deliveriesPerMatch` **78.075** [76.14375, 79.975]
→ **75.08125** [73.275, 76.85625]: **the deliveries simply stop happening.**

⭐ **THE PHYSICS PER LINE CLASS IS UNCHANGED, WHICH IS THE PROOF THAT THIS IS SELECTION AND NOT
LUCK**: `caromRateOnOpenLaneShellBlocked` **0.31720802** [0.29206118, 0.3436867] → **0.31040564**
[0.27655838, 0.34375] and `caromRateOnOpenLaneShellClear` **0.0923802** [0.08496138, 0.09992082]
→ **0.09371555** [0.08683918, 0.1008456]. BK-C2's ~3.4× discrimination is still there in both
arms, untouched. The armed chooser simply plays a slightly smaller share of the dangerous
population — and pays for it in volume.

**REPORTED BESIDE (b), GATED BY NOTHING:**

| face | shut | armed | Δ ci95 |
|---|---|---|---|
| `passCompletion` | **0.58506457** [0.57660396, 0.59335793] | **0.59083319** [0.58139144, 0.60041494] | [−0.00419785, 0.01543736] |
| `possessionSpellSeconds` | **4.47541307** [4.36300623, 4.59374943] | **4.57789338** [4.46348555, 4.69827136] | [−0.01343352, 0.22616185] |
| `possessionFlipsPerMatch` | **47.03125** [45.75625, 48.25] | **45.95625** [44.75625, 47.1875] | — |
| `flipsCaromLastContactShare` | **0.11122924** [0.10411687, 0.118237] | **0.10567115** [0.09852083, 0.11310913] | — |

⭐ **THE HONEST OTHER HALF**: completion and possession-spell length both drift the RIGHT way and
neither resolves. The team that passes less keeps the ball slightly better — which is what
declining a risky pass buys, and it is not football's answer to 弹身体.

## §R3 H-GC.1(c) — THE TEAMMATE FACE FALLS, BUT NOT RESOLVEDLY ❌

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐⭐ `teammateStrikesPerMatch` | **6.89375** [6.21875, 7.58125] (1103/160) | **6.20625** [5.65, 6.78125] (993/160) | **−0.6875** | [−1.4625, **0.0625**] | **0.9016** |

**A NEAR MISS, REPORTED AS THE FAIL IT IS.** The interval's upper edge is **+0.0625** — the
frozen rule demands the whole interval below zero and it is not. The direction is right and the
magnitude is a tenth of the face; nothing here is re-cut to make it pass.

The share form moves the same way and also fails to resolve: `strikeShareTeammateOfKicker`
**0.40343819** [0.37265918, 0.43498233] → **0.38354577** [0.33595801, 0.42633099].
⭐ And BK-C2 §R1(iii)'s sharpest fact survives arming unchanged: the striking body's
`perpDistanceFromLineAtKick` median bin lower edge is **0.5** m in **both** arms
(shut bins **[1106, 514, 320, 138, 130, 71, 92, 57, 43, 48, 25, 27, 163]**, armed
**[908, 504, 251, 159, 135, 90, 60, 103, 39, 26, 28, 20, 266]**) — **the man who gets hit was
still standing on the line when the ball left, in the priced world too.**

## §R4 H-GC.1(d) — THE LOFTED CONTROLS STAY INSIDE ✅

| control | shut ci95 (the band) | armed point | inside? |
|---|---|---|---|
| `loftedDeliveriesPerMatch` | **5.20625** [4.86875, **5.5625**] | **5.5** | ✅ |
| `crossesPerMatch` | **3.84375** [3.56875, 4.1375] | **3.84375** | ✅ (identical to eight figures: 615/160 in both arms) |

⛔ **THE GROUND PRICE DOES NOT REACH THE FLIGHTED LINES.** The cross count is byte-identical
between the arms; the lofted volume drifts up **+0.29375** [−0.0875, 0.66875] and stays inside
its own control interval — a substitution nudge that does not resolve, and §P5's declared limit
rides (this conjunct tests that the price is not APPLIED to the lofted family, and cannot
separate that from "not substituted into").

## §R5 REPORTED — THE INTERCEPTION DECOMPOSITION, AND THE PERF FACE

**THE INTERCEPTION DECOMPOSITION (BK-C2 §R4's form):**

| face | shut | armed | paired Δ | Δ ci95 | \|Δ\|÷hw |
|---|---|---|---|---|---|
| `interceptionsPerMatch` | **27.1** [26.23125, 28.00625] | **25.65625** [24.79375, 26.5625] | **−1.44375** | [−2.375, −0.5] | **1.54** |
| `interceptionCaromPrecededShare` | **0.35332103** [0.33999546, 0.36731876] | **0.35127893** [0.33792271, 0.3652968] | **−0.00204211** | [−0.01588184, 0.01135281] | 0.15 |
| `interceptionsPerTackle` | **17.48387097** [15.24381625, 20.20465116] | **16.16141732** [14.08965517, 18.69724771] | — | — | — |

⭐⭐ **THE COUNT FALLS RESOLVEDLY AND THE SHARE DOES NOT MOVE AT ALL.** A third of every event
this engine scores as an "interception" still has a body carom on the ball before it — in the
priced world exactly as in the unpriced one. **The price shrinks the interception pile
proportionally, by shrinking the passing; it does not clean the carom out of it.**
⚠ Temporal, not causal (§P10 item 6).

**THE PERF FACE (GC-T0 §DEV 3's debt, discharged):**

| arm | wall seconds total | walks | `wallSecondsPerMatch` |
|---|---|---|---|
| `shut` | **17.498** | 160 | **0.1093625** [0.10701875, 0.1129375] |
| `armed` | **17.494** | 160 | **0.1093375** [0.10768125, 0.11125] |

⭐ **THE ARMED COST IS INDISTINGUISHABLE FROM ZERO ON THIS MACHINE**: paired Δ **−0.000025** s
[−0.00285, 0.002], **0.0103** half-widths. GC-T0 §HONESTY 5 predicted the shape and the shape
holds — the hazard's early return on the first blocking body makes the term nearly free, and the
armed chooser plays fewer lines besides. ⚠ Read §P7 before quoting this: the timed region is the
WALK (observer reads included, in both arms), so the **DIFFERENCE** is the number, never the
level, and it is a machine reading on one machine.

**THE INSTRUMENT-FIDELITY GATE, GREEN** — the SHUT arm IS BK-C2's `w11` instrument on fresh seeds
(BK-C2 artifact `sha256 = bb5210dba9a2bf6863cf4421414384fb5e15e63c29a09dfa54c6591fe81e4bf9`):

| face | this exam's shut arm | BK-C2 `w11` (frozen at §P2b) | overlap |
|---|---|---|---|
| `caromedGroundOnOpenLaneShare` | **0.5258664** [0.50233524, 0.54912099] | **0.50322119** [0.47622378, 0.53133903] | ✅ |
| `strikeShareTeammateOfKicker` | **0.40343819** [0.37265918, 0.43498233] | **0.43107769** [0.39156035, 0.46922698] | ✅ |
| `groundCaromRate` | **0.17076936** [0.16337582, 0.17822463] | **0.16295346** [0.15463338, 0.1716608] | ✅ |

## §R6 ⭐⭐ THE SEASON LADDER — EVOLUTION SPREADS THE GENE AT EXACTLY DRIFT SPEED

7,200 matches (2 arms × 4 leagues × 20 generations × 45), `gLadderDoors` GREEN (both arms armed
on every match, generation 1 identical across arms by construction, the control's DV gene set
structurally absent throughout).

| gen | arm | goals/match | ground strikes/match | ground passes/match | caromed-on-open-lane | gene mean | present | > 0 | **drift null** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | geneAbsent | 3.411111 | 14.7 | 69.433333 | 0.53563 | 0 | 0 | 0 | 0 |
| 1 | geneEvolvable | 3.411111 | 14.7 | 69.433333 | 0.53563 | 0 | 0 | 0 | — |
| 5 | geneAbsent | 3.922222 | 11.133333 | 53.638889 | 0.55542 | 0 | 0 | 0 | 0.05457704 |
| 5 | geneEvolvable | 4.183333 | 11.116667 | 51.044444 | 0.598346 | 0.02414504 | 0.9 | 0.375 | — |
| 10 | geneAbsent | 3.855556 | 8.711111 | 44.727778 | 0.56298 | 0 | 0 | 0 | 0.12676503 |
| 10 | geneEvolvable | 4.394444 | 9.861111 | 40.311111 | 0.657427 | 0.10164362 | 1 | 0.675 | — |
| 15 | geneAbsent | 3.861111 | 7.75 | 40.944444 | 0.564407 | 0 | 0 | 0 | 0.12216123 |
| 15 | geneEvolvable | 4.911111 | 9.172222 | 37.655556 | 0.644875 | 0.14402386 | 1 | 0.775 | — |
| 20 | geneAbsent | 3.694444 | 6.111111 | 31.933333 | 0.526198 | 0 | 0 | 0 | **0.13903439** |
| 20 | geneEvolvable | 4.127778 | 6.372222 | 30.505556 | 0.640082 | **0.15192507** | 1 | 0.825 | — |

⭐⭐ **THE ADOPTION ANSWER IS "NOT DISTINGUISHABLE FROM DRIFT", AND THE SHADOW IS WHAT SAYS SO.**
The gene DOES spread — present share 0 → **1** by generation 10, above-zero share **0.825** at
generation 20, league-mean weight **0.15192507** — but the control arm's INERT PASSENGERS,
mutated by the same law and selected on by nothing, reach **0.13903439**. Per league the selected
finals are **0.26283003 · 0.10512787 · 0.20985295 · 0.02988942** against drift finals
**0.34158071 · 0.00921464 · 0.05075388 · 0.15458832** — two leagues above their shadow, two
below. The fitness–gene correlation wanders either side of zero by generation
(**+0.218796 · +0.014623 · −0.203412 · −0.02703 · +0.301656 · +0.040449 · +0.35064 · +0.139848 ·
−0.377494 · −0.009283** at generations 2 · 3 · 4 · 5 · 7 · 10 · 14 · 15 · 19 · 20).
**教练自己不会学着更在乎这件事 —— 这是 #167 leg S 和 BK-T4 §R4 的第三次同一个回答**, and it is
REPORTED, never nudged: the **fitness-visibility question stays a NAMED DOOR** (what winning
sees — an ecology question).

⭐⭐ **AND THE LADDER CONTRADICTS THE PRICE'S OWN PURPOSE AT ITS OWN GRAIN.** In the evolvable
arm `caromedGroundOnOpenLaneShare` **RISES** 0.53563 → **0.640082** across twenty generations
while the control's stays flat (0.53563 → 0.526198). Where the gene spread, the caroms that
happened were MORE concentrated on lines the old map called open, not less. ⚠ Multi-factor —
the two arms' evolution rng streams displace from generation 2 (the MT-T2 declaration,
inherited) and four leagues is four — but it is the opposite of what an adoption story would
predict, and it is stated rather than left out.

⚠ **THE ECOLOGY DEGRADES THE PASSING GAME IN BOTH ARMS AND THAT SWAMPS EVERYTHING**: ground
passes per match fall **69.433333 → 31.933333** (control) and **69.433333 → 30.505556**
(evolvable) over twenty generations, and ground strikes fall with them (**14.7 → 6.111111** /
**6.372222**). Whatever the price does, it does it inside a league that is teaching itself not
to pass along the floor. IN-T2 §CORR 5's caution rides in full (§P10 item 7).

**GOALS × GENERATION vs THE HOUSE FLOOR IDIOM**: early(1–5) → late(16–20) goals/match slope
**geneAbsent +0.081111** (sd 0.695025; per league +0.302222 · +0.964444 · −0.542222 · −0.4) ·
**geneEvolvable +0.388889** (sd 0.530889; per league −0.12 · +0.017778 · +0.653333 · +1.004444).
DF-C0 §R4's quoted atkFrozen floor is **+0.2211** (QUOTED, never re-run) — **the two arms
BRACKET it**, both spreads are enormous at four leagues, and **no between-arm test was frozen
and none is invented.**

## §R7 THE GATES

All nineteen GREEN: `gWorld` · `gArmsIsolated` (the difference set is exactly
`['bkGroundCorridor']`) · `gSharedSeeds` · `gAnchoredConstants` · `gSeamSitesPinned` (ONE fork,
ONE pricer statement, ONE hazard call, ONE definition, ZERO in `a4World.ts`) · `gWalkFixtures`
(30/30) · `gStrikeLedgerAgrees` · `gStrikeAttributionComplete` (**1** in both arms) ·
`gJointPartition` · `gPriceFires` (**the corrected liveness form** — 11,133 evaluations in the
armed arm, 2,766 non-zero) · `gArmsDiverge` · `gBkC2Quoted` · `gInstrumentReDerivesBkC2` ·
`gGenomeClean` (`info.genome` carries no `dvExposureWeight` on any battery match or receipt; the
ladder's control never grew a DV seat) · `gLadderDoors` · `gNonVacuous` · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · `gFaces`.

**THE SEAM'S OWN RECEIPT**: the production fingerprint
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` is unmoved, and
`bkGroundCorridor` is still named by no world and no preset.

## §R8 SEEDS AND STATS, AS CONSUMED

Block **12,524,000–999 CONSUMED WHOLE**: battery seeds **12,524,000–159** × 2 arms = **320
walks** (booked = walked, gated from the CELLS' own distinct-seed set: 160 distinct seeds, 160
paired rows) · ladder leagues **12,524,900–903** (per-match seeds derived through the shipped
`hashSeed`, 7,200 matches) · the **12,524,999** construction receipt, one per arm (2 walks) ·
the bootstrap's own resample rng seeded from **12,524,000**. The SIZING SMOKE used the
out-of-band scratch range **900,000,200–259** only.
**STATS CONSUMED: ZERO** — every interval is a percentile bootstrap over walked seeds; registry
of record stays **73**, next stats base ≥ **117,600**, next sim ≥ **12,525,000**.

## §DOUBTS (declared)

1. **THREE CONJUNCTS FAILED AND THE FAILURE IS THE HEADLINE.** Nothing here says a DIFFERENT
   ground price would fail too. Three named alternatives are all UNMEASURED and all outside this
   dispatch: a **graded** hazard (contract §4's held door), a **different weight** (the gene's
   own domain — this exam pinned 0.5 by order), and **pricing the ground aim's own lead** rather
   than the standing target.
2. ⭐⭐ **THE MECHANISM READING IS A LABELLED HYPOTHESIS, NOT A FINDING** (有故事就要有探针): §R2's
   arithmetic — 453 of the 526 missing ground passes are blocked lines, and the clear columns do
   not grow — is consistent with *"the chooser has no better GROUND line to move to, so it
   declines"*, which is **BK-T4 §CORR 3's constraint in a new place** (换条线 requires an
   alternative line to price). This exam froze **no probe that tests it**: it stores the joint
   tables and the lane histograms, not the argmax's runner-up.
3. **(c) MISSED BY 0.0625.** The teammate face is the one conjunct where the frozen rule and the
   measurement nearly agreed. It is reported as a FAIL, and a future exam that wants it should
   size for it rather than re-read this one.
4. **THE LADDER'S DRIFT COMPARISON IS ACROSS ARMS**, and from generation 2 the two arms' rng
   streams are displaced by the opt-in's own extra draws (the MT-T2 declaration, inherited).
   Generation 1 is identical by construction (asserted by `gLadderDoors`), and four leagues is
   four.
5. **THE LADDER'S ECOLOGY IS NOT THE SHIPPED LEAGUE'S** (§P6/§P10 item 7), and its own collapse
   of ground passing (**69.433333 → 31.933333** per match in the control arm) is a much larger effect than anything the price
   does. No number in §R6 is a claim about the shipped game.
6. **THE PERF FACE IS A SINGLE-MACHINE READING** and its LEVEL includes the observer.
7. **THE PRICE'S LIVENESS CENSUS IS NOT A MODEL OF THE ARGMAX** (BK-T4 §P6 item 1's caution,
   inherited): `priceEvalNonZeroShare` counts one evaluation per measured ground pass ACTUALLY
   PLAYED, so it reports what the chooser ended up doing, never what he compared.

## §DEV — the deviations, declared

1. ⚠⚠ **THE SIZING SMOKE'S Δ POINT ESTIMATES WERE SEEN BEFORE THE FREEZE**, and were disclosed
   at §P9 in the freeze commit itself rather than after the fact. The conjunct FORMS are ruling
   #344 item 4's and the gate CONSTRUCTIONS were written before the battery; **not one predicate
   was re-cut** after the smoke or after the battery. Stated as a deviation because a clean
   freeze would not have looked.
2. **`fitnessGeneCorrelation` IS `null` IN THE `geneAbsent` ARM** at every generation: the gene
   vector is identically zero there, so the correlation is undefined, not zero. Published as
   `null` rather than as a fabricated 0.
3. **NO WEIGHT LADDER AND NO ENTRY RUNG.** #344 item 4 pinned the gene at 0.5 in both arms and
   scoped the entry rung behind this exam; neither is attempted here.
4. **THE LADDER USES NULL L3/PC DOSES**, like the battery and like BK-C2 — the R-乙 epoch-3
   `matchFor` idiom. BK-T4's ladder dosed its L3/PC books from their artifacts; this exam does
   not, so its ladder world is the undosed world-11 shape. Declared, not hidden.
5. **`PROGRAMME.md` / the rulings file are NOT edited by this session** (executor iron rule:
   governance files are the commander's). The queue's status line, the verdict of record and the
   next dispatch are the commander's to write.

## §人话 — 让传球为撞到的人买单,试过了,结果是这样

> ⚠ **先说钟**(#339 立的双钟法条):我们一场球显示钟走满 90 分钟,按 sim 秒直读只有 240 秒
> (1 sim 秒 = 22.5 显示秒)。下面所有「每场几次」都按**我们这一场**读,也就是显示钟的一场
> 90 分钟。占比类的数换钟不变。
>
> 两个世界完全一样,只差一件事:**11 号世界**(你上次看的那一版),和 **11 号世界 + 传球要为
> 它路上要撞到的身体扣分**。同一批 160 个种子,两边各踢一遍。

### 一、你抱怨的那件事,有没有变少 —— 基本没有

「弹身体」的次数,每场从 **16.48125** 次降到 **15.825** 次。看着降了,但这个降幅比我们能量准的
噪声还小(区间 [−2.66875, 1.7375] 跨过零),**说不上真降了**。

更要紧的是第二条:**真的弹了身体的那些传球里,有多少是「老图说这条线是通的」** —— 从
**0.5258664** 变成 **0.51579521**。**几乎一动没动。** 也就是说,那个「传球的人明明看得见却没看
的信息」,加了价格之后,还是没被用上。

### 二、代价是有的,而且很清楚 —— 他改成不传了

每场地面传球从 **72.86875** 次掉到 **69.58125** 次(差 **−3.2875**),而且这个降幅是**结实的**
(区间整段在零以下)。少掉的球里(11659 − 11133 = 526 次),**453 次正是「线上真的有人挡着」那一类** —— 价格确实
认出了危险的线,他也确实少传了。

**但少传的那些球,没有变成别的球。** 干净的地面线没有变多(6365 → 6349,2075 → 2018),吊传没有变多,传中
一次不差(两边都是 615 次)。整体出球从每场 **78.075** 次掉到 **75.08125** 次 —— **球就是没传
出去。**

这跟门将那次(BK-T4)是同一个毛病:**先学会的是「别传了」,不是「换条线传」。**

### 三、撞自己人有没有少 —— 有一点,但没量准

每场撞到自己队友从 **6.89375** 次到 **6.20625** 次。方向对,幅度差一点点就能算数(区间上边缘
是 **+0.0625**,差 0.0625 就整段在零以下)。**按我们出手前就定死的规矩,这条算没过。**
我们不会因为「差一点」就改规矩。

而且那条最扎心的事实一点没变:**被撞到的那个人,在球被踢出去的那一瞬间,就已经站在传球线的
半米以内了** —— 加了价格的世界里也一样。

### 四、吊传和传中有没有被误伤 —— 没有 ✅

传中每场 **3.84375** 次,两边**一模一样**;吊传 **5.20625** → **5.5**,还在对照区间里面。
这条我们是特意设的:**这个价格只管地面球,不许碰高空球** —— 它确实没碰。

### 五、顺带看到的两件事

**每场「拦截」从 27.1 次降到 25.65625 次**(这个是结实的),但**「拦截里有多少其实是球撞了
人」还是三分之一**(0.35332103 → 0.35127893,一动没动)。**它不是把弹身体从拦截里清掉了,
它只是让传球少了,所以拦截也跟着少。**

**它一点都不卡。** 加了这个价格之后,一场球算下来的耗时差 **−0.000025 秒** —— 测不出来。
（这是这台机器上的读数,不是手机上的帧数。）

### 六、让教练自己去进化,他在乎这件事吗 —— 看不出来

我们又跑了 20 代联赛 × 4 个联赛 × 两种世界,7200 场,让「在乎不在乎撞人」这个基因**自己**
去进化,一分钱都没替它设。

结果:这个基因**确实传开了**(20 代之后每支队都带着它,平均值 **0.15192507**)—— 但我们同时
放了一批**完全不参与比赛的"影子基因"**当对照,它们只按同样的变异规则乱飘,20 代之后飘到了
**0.13903439**。**两个数一样大。** 也就是说:**它传开不是因为有用,只是因为随机漂移。**
赢球这件事,看不见「撞了几次身体」这笔账 —— 这已经是同一个答案第三次出现了。

> **一句话收尾**:让传球为它要撞到的身体买单,这一版**做到的是让他少传,没做到让他改线**,
> 而你抱怨的「弹身体」并没有真的变少。**这不是说这个方向错了,是说这一版的实现不行** ——
> 该往哪走(分档的价格?换个力度?让他算得出另一条线?),是下一步的事。⛔ **这一版什么都
> 没上线**,你现在玩的那个世界一个字节都没动。
