# LN-C1 — 「传球者看得见自己人吗」 THE PASSER'S-SIDE LANE CENSUS（他出脚的那一刻,线上已经站着自己人吗;当时有没有一条干净的线）

> **STATUS at this commit: FREEZE.** §0 and **§P** below are frozen **BEFORE any battery seed is
> walked**, together with the complete instrument
> [`scripts/probes/ln-c1-passer-lane-census.ts`](../../scripts/probes/ln-c1-passer-lane-census.ts).
> ⭐ **§P AND THE INSTRUMENT ARE THE FROZEN PAIR**; **§DEV-PREFLIGHT is a DISCLOSURE block**, not
> part of that covenant (ruling #390 item 1 / LN-T1 §COMMANDER CORRECTIONS item 4). The results
> sections are written in the SECOND commit, and between the two the instrument is
> **byte-identical** (`git diff FREEZE..RESULTS -- scripts/probes/ln-c1-passer-lane-census.ts`
> EMPTY).
> ⛔ **§P is never edited after sight.** If §P turns out to be wrong once the numbers are in, a
> **§DEVIATIONS** entry records it; the frozen text stands.
>
> canon, VERBATIM: *"freeze the instrument commit BEFORE the battery; artifact records the
> instrument hash"* (home: ruling #266.3(c), via [`CANON.md`](CANON.md)).
>
> Authorized by **COMMANDER RULING #390 item 4**. Lineage: **PT-C0** (the population and the
> `ball.lastTouch` FIRST-BODY channel, byte for byte) → **BN-C0** (the corridor membership test)
> → **LN-C0** (the walker, the wind-up ARM-tick channel, the cause classes, the estimator and the
> hash order, REUSED and anchored) → **LN-T1** (X-DET, X-FP-PROD, G-REPRO-LNC0, the LOO receipt)
> → this census. Census form of record: [`LN-C0-LANE-CENSUS.md`](LN-C0-LANE-CENSUS.md).
> Artifact: `docs/world-model/data/ln-c1-passer-lane-census.json` (**or its `.RED.json` SIDE
> PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no hypothesis
> and **ARMS NOTHING** — it prints frozen sentences that NAME a lever. The commander rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` or `tests/` is created or edited.
> ⛔ **WORLD 12 AND WORLD 13 ARE UNTOUCHED**; every flag default stays OFF.

**在说人话的层面**：上一步（LN-T1）证明了——不管怎么调无球跑位，**球撞到自己人**这件事都不动。
而代码给出了原因：**传球者判断这条线通不通的时候，程序只把对方球员数进去，自己人根本不在里面**。
这一步不改任何东西，只去测一件事：**他出脚选这条线的那一刻，线上是不是已经站着自己人；如果是，当时
有没有另一条「自己人不挡、对方也不比现在更多」的线可以传**。测完印一句冻结好的话，供指挥官定夺。

---

## §0 WHAT THIS IS AND WHY

### THE MECHANISM FACT THIS CENSUS MEASURES AGAINST (#390 item 3(iii), quoted)

> ⭐⭐ **THE CAROM IS THE PASSER'S — the story has its mechanism.** Two censuses and an exam put
> the carom on the STANDING shape-keeper at every corner; and THE CODE says why he is hit: the
> pass chooser's lane test `laneOpenness(from, to, opponents)` (`src/ai/perception.ts` l.143)
> iterates ITS `opponents` ARGUMENT, and every pass-scoring call passes `opp.players` —
> `groundCandidate` (`PlayerBrain.ts` l.611: `laneOpenness(p.pos, aim, opp.players)`), l.916,
> l.1036, l.1201; `opennessAt(aim, opp.players)` beside; the ground candidate's score
> `s = passBase + lane·passLaneW + open·passOpenW` then the gain / risk chain carries NO own-body
> term. ⇒ A BODY OF OURS IN THE LANE IS INVISIBLE TO THE CHOICE BY CONSTRUCTION (a code read,
> anchored at LN-C1's gate; not yet a measurement). VISION: 眼睛看到的空间 — a passer who cannot
> see his own men is half-blind, and 有故事就要有探针: the MEASUREMENT the story lacks is how often
> the CHOSEN lane had our own body in it AT THE CHOICE, and whether an own-clear lane existed.
> REALITY: real passers see their own men first.

### WHAT THIS CENSUS IS NOT (#390 item 3(v), quoted)

> ⛔ **THE AUDIT'S ⑤ STAYS LAST AS RATIFIED**: the audit's own words — *"出球人感知诚实：层 A 的真值
> 读取（`inSnapshotLaw`）和读心标签，这是最深的一刀，放最后，因为它会让所有已 banked 的 A/B 失去对照
> 基线"* — name the TRUTH-vs-SNAPSHOT cut. LN-C1 is NOT that cut: it asks WHICH bodies the eyes
> count, not whether the reads are honest; it touches no baseline.

⭐ And the census PROVES that in code rather than promising it: `inSnapshotLaw` is **OFF** in world
13 (its default-off line is anchored; the flag is asserted absent on every walked match as
`snapshotLawAbsent`), so `opp` at the chooser IS the truth opponent team. That is exactly why this
census can use **the same opponent population the chooser uses** and touch no baseline at all.

### THE SPECIFICATION (COMMANDER RULING #390 item 4, quoted)

> ⭐⭐ **LN-C1 DISPATCHED — 「传球者看得见自己人吗」 THE PASSER'S-SIDE LANE CENSUS** (a C0-form
> census; X-SRC-ZERO; definitions frozen at the executor's §P; the LN-C0 / LN-T1 house form). (i)
> ARMS: **E13** (read of record) and **D13** beside, LN-C0's construction CALLED. (ii) POPULATION:
> PT-C0's measured ground passes, byte for byte. (iii) ⭐ **THE CHOICE TICK**: the ARM tick where a
> wind-up record exists (LN-C0's `pendingPassWindup` channel, anchored); for a pass WITHOUT a
> wind-up record the engine's own rule for when it is struck is ANCHORED — if the strike is on the
> decision tick, the release tick IS the choice tick and is read as such; if a class of passes has
> no establishable choice tick, that class is COUNTED (never imputed — LN-C0's `noWindup`
> precedent) and the reads are stated on the established classes with the counted class beside.
> (iv) FACES, per arm, with counts: (a) THE CODE FACT as anchored booleans — the function's
> `opponents` parameter, the four pass-scoring call sites' `opp.players` argument, `opennessAt`'s,
> and the absence of an own-body term in `groundCandidate` (a stored `chooserCountsOwnBodies` =
> false DERIVED from the anchor gate, declared a code read); (b) at the choice tick, the CHOSEN
> lane's OWN-OPENNESS = `laneOpenness(passer.pos, aim, own outfield bodies − passer − target)`
> CALLED — the shipped function with the OWN population, a DECLARED reconstruction — beside its
> OPPONENT-openness (what the chooser saw), the aim read off the engine's own strike record (the
> DLC door is open in world 13; to-feet or led — never recomputed); both binned on anchored edges
> (the chooser's own `lane < 0.4` gate at `PlayerBrain.ts` l.628 and `lane < 0.45` at l.943;
> LN-C0's 4 m corridor beside as the second membership face); (c) the share of passes struck with
> own-openness < 0.4 at the choice; (d) THE CAROM CONDITIONAL: P(first body = own non-target |
> own-openness bin at the choice) and the share of caroms whose chosen lane had own-openness < 0.4
> at the choice; LN-C0's present / arrived split on the SAME body; (e) THE MENU'S GEOMETRY (a
> declared reconstruction, NOT the chooser's score): for every other own outfield mate at the
> choice tick, the opponent- and own-openness of passer → mate.pos; stored per pass:
> `ownClearAlternativeAtLeastAsOpen` = an alternative exists with own-openness ≥ 0.4 AND
> opponent-openness ≥ the chosen lane's; the forward-gain sign of that alternative published
> beside, never gating; (f) OPPONENTS BESIDE, never read: opponent-openness bins of chosen lanes
> and P(first body = opponent | bin) — the 「传到对面身上」 census's starting table. (v) READS
> (frozen literals on STORED booleans, E13 of record, D13's agrees boolean beside; let C = caroms
> with an established choice tick): C-blocked share = share of C with own-openness < 0.4 at the
> choice; A-share = share of C-blocked with `ownClearAlternativeAtLeastAsOpen`. …the counted
> no-choice-tick class beside every sentence. (vi) SEEDS: block **12,546,000–999** (N sized by a
> disclosed 12-seed scratch smoke on 900,003,600–611; receipt 900,003,620; world pin 900,003,670;
> lockstep 900,003,690–691; receipt 12,546,999; scratch band 900,003,600–699); RE-WALKS
> 12,544,000–011 (G-REPRO-LNC0, the inheritance); ZERO stats; registry **75**; the canon set…

**THE THREE READ SENTENCES, VERBATIM from #390 item 4(v)** — frozen literals in the instrument,
selected by STORED booleans on the **E13** arm:

| selector (STORED booleans) | the sentence PRINTED |
|---|---|
| `cBlockedShare > 0.5` AND `aShare > 0.5` | *"THE PASSER STRUCK INTO A BODY HE COULD NOT SEE WHILE A CLEAR LANE EXISTED — a price on own bodies in the lane is named (LN-T2, the own-body term in the chooser's lane weight)."* |
| `cBlockedShare > 0.5` AND `aShare <= 0.5` | *"THE LANE WAS FULL — no clear lane existed at the choice; movement is named (③ first)."* |
| `cBlockedShare <= 0.5` | *"THE BODY ARRIVED AFTER THE CHOICE — the carom is movement's, not the eyes' (③ first)."* |

plus the agreement sentence, selected by a STORED boolean: *"THE DOSED WORLD AGREES ON THE READ"* /
*"THE DOSED WORLD DISAGREES ON THE READ"*.

### in plain football language

The engine's passer looks down a lane and asks one question: *how much of this line is covered by
THEM?* Nobody ever asks *is one of MINE standing in it?* — the function that answers is handed the
opposition list and nothing else. So this census stands next to him at the exact tick he chooses
and measures two numbers about the line he picked: **how clear it is of THEIRS** (what he saw) and
**how clear it is of OURS** (what he cannot see). Then it looks at the passes that ended up hitting
one of our own men who was never meant to get it, and asks two questions of them:

1. **Was our man already standing in that line when he chose?** (own-openness below the passer's
   own risk gate of 0.4 at the choice)
2. **Was there another man he could have played to whose line was clean of ours and no more
   crowded by theirs?**

If the answer to both is mostly yes, the fix is a price on our own bodies in the lane — the eyes,
not the legs. If the lane was blocked but nothing better existed, it is the movement's fault. If
our man was not in the lane at the choice at all, he walked into it afterwards, and that is the
movement's too. The census prints exactly one of those three sentences and stops.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — LN-C0's construction, CALLED, byte for byte

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E13** | **world 13 EMPTY-BOOK — the read of record**: `a4MatchFlags(13)` as construction flags + `armA4World(m, null, 13)` | `bqArmedVersion(m) === 13` |
| **D13** | **world 13 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `bqArmedVersion(m) === 13` |

The two arms are **PAIRED on shared seeds** with the IDENTICAL population construction (PT-C0's own
`buildMatch` plumbing), so they differ **ONLY** in the world's own books. `gDoseSource` hashes the
FILE BYTES this process read and compares them to the house's standing pins; a mismatch is
`process.exit(3)` **before any seed is walked** — canon, VERBATIM: *"a dose-source guard should hash
the bytes it reads, not a self-declared field"*.

`gWorld` asserts, per arm, on EVERY walked match and the construction receipt: `bqArmedVersion` = 13
(a deep gate — it asserts world 12's five doors, world 11's corridor price and the RA gene pins) ·
`bqCushion` TRUE · `obmMovement` and `ctbSupportPlane` ABSENT · every RC/BF flag absent ·
`info.genome` clean of the RA / corridor / RC / CTB / OBM genes · `emergentPosOn()` TRUE · ⭐⭐ **and
LN-C1's own two conjuncts: `inSnapshotLaw` ABSENT and `edsPerceivedChoice` TRUE** — the pass chooser
reads the TRUTH team objects, so the census's opponent population IS the chooser's own
`opp.players`. Pinned again on a CONSTRUCTED match of each arm at scratch seed **900,003,670**.

⛔ **The census SCORES nothing.** The paired Δ (D13 − E13) is published on every face by a 2,000-draw
cluster bootstrap that resamples SEEDS; an interval containing zero reads *"unresolved at this
power"*, never "no difference".

### §P.B THE POPULATION, THE CHOICE TICK, THE AIM, AND THE TWO OPENNESSES

| quantity | frozen form |
|---|---|
| **THE POPULATION** | ⭐⭐ **PT-C0's, BYTE FOR BYTE**: every **MEASURED GROUND PASS** — `isMeasurableGroundPass` (`shortPass` \| `throughBall` \| `cutback`, ground launch, with a pending-pass target), registered **at the strike** via `pendingPass`. ONE flight is tracked at a time; a retired flight is **BOOKED**, so every flight enters the faces exactly once |
| **⭐⭐ THE CHOICE TICK — the ENGINE'S OWN RULE, ANCHORED** | The brain's `Pass` branch either **ARMS a wind-up** (`match.armPendingPass(p, passMate!, offsideExemptKick)`, `PlayerBrain.ts` l.1684, gated at l.1683 on `match.o1PassWindup && !mustKick && p.firstTouchWindow <= 0`) or **STRIKES SYNCHRONOUSLY** (`match.performPass` at l.1686 / l.1687; `match.performCutback` at l.1628). **Both calls happen at the tick the brain chose.** ⇒ **`arm` class** — a wind-up record was resolved for this passer and this target: **THE ARM TICK IS THE CHOICE TICK**. **`release` class** — no record: **THE STRIKE IS ON THE DECISION TICK, so the RELEASE TICK IS THE CHOICE TICK** and is read as such. ⭐ `o1PassWindup` is ON in world 13 because the CB world composes on `a4MatchFlags(3)` (anchored) and every later world CALLS its predecessor — which is why LN-C0 measured `lane.armRecordShare` **0.561513** on E13 |
| **⭐⭐ THE COUNTED CLASS** | **`none`** — a measured ground pass whose choice tick is not establishable by either rule. **COUNTED, never imputed** (LN-C0's `noWindup` precedent). By the engine's rule above the class is expected EMPTY; whatever it reads, its size **as a share of all caroms** is published BESIDE EVERY READ SENTENCE (`choice.noneShareOfCaroms`), and `gChoiceTickRule` asserts the classification per walked match (arm ≡ LN-C0's `gpWithArm`, release ≡ `gpNoArm`, the three summing to `gpFlights`) |
| **⭐⭐ THE AIM OF RECORD** | ⛔ **NEVER RECOMPUTED.** `arm` class: the wind-up record's OWN `aim` (the mate's arm-time position, written by `armPendingPass` — anchored) **plus its own `aimLead`** — LN-C0's `E`, byte for byte. `release` class: **PT-C0's own rule** — the target's position at the strike tick, i.e. the flight's launch-to-target line. ⭐ The DLC door is open in world 13, so the aim MAY be led; whatever the engine recorded is what is read |
| **⭐⭐ OPPONENT-OPENNESS (what the chooser saw)** | `laneOpenness(passer.pos, aim, opp.players)` — the **SHIPPED function CALLED**, at the passer's own position **at the choice tick**, with **the same population predicate the chooser's own call uses**: the whole opponent `players` array, **keeper INCLUDED**; `sentOff` is skipped INSIDE the shipped function |
| **⭐⭐ OWN-OPENNESS (what he cannot see) — A DECLARED RECONSTRUCTION** | the **SAME shipped function CALLED** with the census's own declared population: **own OUTFIELD bodies minus the passer minus the target** (#390 item 4(iv)(b)'s words). ⛔ Not a re-implementation, not a new constant, not a new geometry |
| **THE BINS** | BOTH opennesses binned on a **FINE 0.1 grid × 10 cells** (declared as BINS, never a rule) and cut at the chooser's **OWN anchored gates**: **0.4** (`PlayerBrain.ts` l.628, extracted by regex from the anchored line, never re-typed) and **0.45** (l.943) |
| **⭐ THE SECOND MEMBERSHIP FACE** | **LN-C0's 4 m corridor** (BN-C0's test: `closestPointOnSegment` CALLED, half-width `DV_CORRIDOR_SCALE` = 4 m, clear-the-kicker guard `DV_CLEAR_RADIUS` = 1.5 m) evaluated at the **CHOICE tick's** geometry (passer's position → the aim of record), with the `CONTROL_RADIUS` variant as a **TIGHT BIN** — published BESIDE the openness for the SAME bodies |
| **THE FIRST BODY** | PT-C0's **`ball.lastTouch` FIRST-BODY channel**, byte for byte: the first tick after the release at which `ball.lastTouch` is a body other than the passer, classed `ownTarget` / `ownNonTarget` / `opponent` / `none`. **A CAROM = `ownNonTarget`** |
| **⭐⭐ THE CAROM'S PRESENCE AT THE CHOICE** | LN-C0's present/arrived split, re-expressed on the CHOICE tick: **`presentAtChoice`** (he was a lane occupant at release AND — for the `arm` class — inside the ARM-tick corridor too) · **`arrivedAfterChoice`** (occupant at release, outside at the arm tick) · **`notInReleaseCorridor`** (the first body was never a lane occupant — the struck line is not the aim line). ⚠ `arrivedAfterChoice` is **STRUCTURALLY EMPTY in the `release` class**, whose choice tick IS the release tick — declared here, and fixture-pinned |
| **⭐⭐ THE MENU'S GEOMETRY** | a **DECLARED RECONSTRUCTION**, ⛔ **NOT the chooser's score** (no weight, no gene, no style multiplier, no candidate ordering): for every OTHER own outfield mate at the choice tick (not the passer, not the chosen target, not sent off), the **opponent-openness** and **own-openness** of the lane `passer.pos → mate.pos` (own population = own outfield minus passer minus THAT mate). Stored per pass: **`ownClearAlternativeAtLeastAsOpen`** = there EXISTS such a mate with own-openness **≥ 0.4** AND opponent-openness **≥ the chosen lane's**. THE BEST such alternative = the one with the **HIGHEST opponent-openness**, ties to the **EARLIER player index** (a frozen, stated tie-break); only its **FORWARD-GAIN SIGN** is published — `team.localX(mate.pos.x) − team.localX(passer.pos.x)`, the form `groundCandidate`'s own gain is written in (anchored) — and ⛔ **it never gates** |
| **⭐ THE OPPONENTS BESIDE** | opponent-openness bins of the chosen lanes with **P(first body = opponent \| bin)**, the share struck with opponent-openness **< 0.4** (the chooser's own risk gate) and **their** opponent-first rate. ⛔ **Published, never read** — the starting table for the 「传到对面身上」 census |
| **CONTEXT** | LN-C0's own context faces, unchanged: goals, ground passes, completion, `ownedBallSampleShare`, interceptions and shots per match, plus LN-C0's whole lane/crowd/spot/designation table (the walker is inherited WHOLE, which is what makes G-REPRO-LNC0 a field-for-field comparison) |

### §P.C THE READS (the literals and their selectors)

Let **C** = the caroms (first body = own non-target) **with an established choice tick** and a
choice geometry. **`cBlockedShare`** = the share of C whose chosen lane had **own-openness < 0.4 AT
THE CHOICE**. **`aShare`** = the share of the **C-BLOCKED** caroms carrying
`ownClearAlternativeAtLeastAsOpen`. The **SELECTORS ARE STORED BOOLEANS** (`> 0.5`), and the frozen
rule of §0's table is applied by ONE function to **every arm and every scope**. The **READ OF
RECORD** is the **E13** arm's `established` cell (both established classes pooled); **D13**'s is
printed BESIDE with an AGREEMENT boolean; and the SAME rule is applied to **each ESTABLISHED CLASS
TAKEN ALONE** — the `arm` class and the `release` class — as the **counterfactual words**, STORED.
`gReadWords` re-derives every share with its numerator and denominator, every selector boolean,
every read key, every printed sentence, the agreement boolean and the counted class's own share
**from the SERIALIZED per-seed cells off disk**, and asserts every printed sentence is one of the
frozen literals. canon, VERBATIM: *"a counterfactual verdict sentence ('had X been scored, the rule
would read W') quotes a word the instrument STORED by applying the frozen rule to X's stored
interval; a universal sentence about a table ('every bin', 'the one bin') is a stored boolean or is
not written"*. ⭐⭐ **This doc writes no universal that is not a stored boolean.**

**THE CODE FACT IS A STORED BOOLEAN DERIVED FROM THE ANCHOR GATE, AND IT IS DECLARED A CODE READ.**
`chooserCountsOwnBodies` = **false** if and only if EVERY code-fact anchor was found at its pinned
occurrence count: `laneOpenness`'s declaration and its `opponents` parameter, the function's own
iteration line, its guard and aggregation lines, the **four** pass-scoring call sites (l.611 / 916 /
1036 / 1201 — anchored needles with want-counts and line receipts, ⛔ never first-occurrence),
`opennessAt`'s declaration and its `opennessAt(aim, opp.players)` call inside `groundCandidate`, and
the ground candidate's score line. ⛔ **If any anchor fails, `gCodeFact` is RED and the boolean is
`null`, not `false`.** ⚠ It is a **CODE READ, NOT A MEASUREMENT**, and the doc says so wherever it
appears.

### §P.D THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,546,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D13 − E13** on the seeds the arms share, so the interval is PAIRED by construction. Medians are
**BIN-DERIVED** so `gFaces` re-derives every one off disk. ⛔ **Nothing is scored and no null is cut
anywhere.** ⭐ **LEAVE-ONE-OUT** is computed for **every read-bearing share** (`cBlockedShare` and
`aShare`, on both arms and all three scopes): drop each seed, re-derive the POINT share, and count a
FLIP when the frozen `> 0.5` selector changes. ⚠ A RECEIPT — it gates no direction, and the doc's
LOO sentence is scoped to the rows it covers.

### §P.E SEEDS AND SIZING

* **Block 12,546,000–999** (the frontier of record at #390 item 7; `gSeedDisjoint` checks it against
  the published consumed intervals — LN-C0 12,544,000–999 and LN-T1 12,545,000–999). Battery seeds
  **12,546,000–12,546,083** (**N_FROZEN = 84**), construction receipt **12,546,999**. Each seed is
  walked **ONCE PER ARM in EACH of the TWO X-DET passes** ⇒ **340 walks booked = walked**. The
  **UNWALKED TAIL IS DECLARED**: **12,546,084–12,546,998**, stored in `seeds.unwalkedTail`.
* **⭐⭐ N IS SIZED, NOT CHOSEN.** `N = min(the largest nRequired over the two SIZED read rows, the
  block's affordance after the construction receipt)`, at a **DECLARED half-width target of 0.05**
  on `read.established.cBlockedShare` and `read.established.aShare` (arm E13), with the house form
  `se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/se(needed))²) ·
  MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`. **WHICH BRANCH BOUND IT IS STORED**
  (`sizing.boundBy`) and reported in §GATES. The table is in §DEV-PREFLIGHT.
* **⚠ WHAT IS NOT SIZED IS STATED INSTEAD**: every other face in this census — the openness bins,
  the carom conditional's per-bin cells, the presence split, the menu's gain signs, the opponents
  beside and LN-C0's whole inherited table — is reported with its **own realised interval** and ⛔
  no null is cut on it.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*):
  smoke **900,003,600–611** with its receipt at **900,003,620**; the **world pin** at
  **900,003,670**; **gLockstep** at **900,003,690–691**. Every scratch seed walked is STORED in the
  artifact's `seeds` block.
* **⭐ RE-WALKS, NOT CONSUMPTION**: **12,544,000–011** (G-REPRO-LNC0) lie inside LN-C0's OWN
  already-consumed block and are declared re-walks.
* **Stats consumed: ZERO.** Registry **75**.

### §P.F THE GATES (all liveness/receipt — NEVER direction)

**X-DET** (the whole core run TWICE, digests byte-identical, `wallMs` the one named exclusion) ·
**X-FP-PROD** (the production fingerprint recomputed in-probe through the SHIPPED `League` /
`runHeadless` path; the baseline EXTRACTED from OBM-T1's own probe line, never re-typed) ·
**gSrcUntouched** (`git diff --stat HEAD` AND `git status --porcelain` over **`src/` AND `tests/`**,
all empty — canon: xSrcUntouched) · **gSeedDisjoint** · **gSeedsBookedEqualWalked** · **gN** (the
sizing arithmetic and the frozen N) · **gWorld** (§P.A) · **gDoseSource** · **gAnchoredConstants**
(every anchored site at its pinned occurrence count, with line receipts) · **⭐⭐ gCodeFact** (§P.C)
· **⭐⭐ gChoiceTickRule** (the engine's own rule asserted per walked match; every carom partition
inside its own class) · **gWalkFixtures** (the walk-side predicates as PURE functions called by BOTH
the walk and the fixture table — including LN-C1's own: the SHIPPED `laneOpenness` CALLED on
hand-built geometries (a body ON the segment, a body 4 m off, a body 2 m off, a body INSIDE the
1.5 m clear radius and just outside it, a `sentOff` body, the worst-body aggregation, a body beyond
the aim), the population rule (the passer and the target excluded BEFORE the call), the choice-class
rule, the carom-presence rule and the two anchored gate edges) · **gLedgerRead** ·
**gClassesNonVacuous** (⛔ no face on an empty class: both arms carry ARM-class and RELEASE-class
passes, caroms with an established choice tick, C-BLOCKED caroms, passes with an own-clear
alternative and passes struck with opponent-openness < 0.4) · **gReproducePTC0** · **⭐⭐
gReproLnc0** (LN-C0's own seeds 12,544,000–011 RE-WALKED on E13 and matched **FIELD FOR FIELD**
against the committed artifact over every field the two instruments SHARE — the first-body channel,
the pass counts, the corridor occupancy and the presence split are all inside that set; the ONE
excluded shared field is `wallMs`, a machine timing) · **gLockstep** (no wrapper; observed ≡
unobserved byte for byte, per arm) · **gTwoFractions** · **gLoo** · **gFaces** (EVERY published face,
paired Δ, bin, median and partition re-derived off the **SERIALIZED** artifact) · **gReadWords** ·
**gHashOrder** (the body hash computed **LAST** off an explicit ALLOWLIST SCHEMA that **INCLUDES
`allGreen`**, with a NON-body `receipts.hashReproducesFromFile`).

Canon quoted where it applies — VERBATIM: *"the hashed body is built from an explicit ALLOWLIST
SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* ·
*"the body hash is computed after every body key is assigned, and a NON-body receipt field records
that the hash reproduces from the written file"* · *"an artifact is written as compact JSON — no
indentation; the hash is over the canonical body regardless; pretty-printing is a reader's tool, not
a storage form"* · *"a src-extracted constant pins its extraction to the NAMED call site — anchored
match + line receipt — never first-occurrence"* · *"a seam-map gate pins occurrence COUNTS per
needle and enumerates EVERY occurrence's site"* · *"a field carries the unit its name claims"* · *"a
scored face's walk-side predicate is pinned — anchored extraction or fixture — because the
re-derivation gate proves arithmetic, not definitions"* · *"a stage doc's prose quotes artifact
FIELDS verbatim or the number becomes a gated face"* · *"a stage doc's numeric sweep covers EVERY
numeric literal in prose at ANY precision; a hand-written percentage is the likeliest second copy"*
· *"a gate's NOTE derives from the same pinned values the gate checks; a count typed beside its pin
is a second copy"* · *"a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that
list verbatim or stores none"* (**this artifact stores NONE**) · *"an event attribution reads the
engine's own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is
written only where no record exists, and says so"*.

## §DEV-PREFLIGHT — the sizing smoke, DISCLOSED in full (⚠ a DISCLOSURE block, not part of the frozen pair)

A **12-cluster scratch smoke** (`LNC1_MODE=smoke LNC1_N=12`, seeds **900,003,600–611**, receipt
900,003,620, world pin 900,003,670, lockstep 900,003,690–691, artifact off the canonical path under
`/tmp`) was run **BEFORE this freeze**. Its realised half-widths were read out of the smoke
artifact's own `faces[].halfWidth` fields on the E13 arm — **never re-typed from the console's
rounded print** — and are hardcoded in the instrument's `SIZING_INPUTS`:

| face (arm E13) | realised hw (12 clusters) | target | N required | expected hw at N = 84 | MDE at N = 84 |
|---|---|---|---|---|---|
| `read.established.cBlockedShare` | 0.09203296703296704 | 0.05 | **84** | 0.03478519188409097 | 0.049722178649437745 |
| `read.established.aShare` | 0.04464285714285715 | 0.05 | **20** | 0.016873413973626218 | 0.024118967255324288 |

⇒ **max(nRequired) = 84**, the block affords **999** after the construction receipt, so
**N = min(84, 999) = 84 — BOUND BY THE SIZING**, and the unwalked tail is declared.

**Disclosed honestly:**

* The first smoke run went **RED on two gates**, both instrument defects fixed before this freeze
  and both stated here so the record shows what moved and when: (a) **gN** — `N_FROZEN` still held
  its pre-sizing placeholder, which is exactly what the sizing conjunct is there to catch; (b)
  **gCodeFact** — the gate demanded a code-fact anchor count that did not match the anchors the
  instrument actually declares. A third, silent defect was fixed in the same pass: a sizing-row
  field inherited from LN-C0 was named `blockAffords` while carrying `N_FROZEN` — a **unit-name
  truth** violation — and was renamed `nFrozen`. After the three fixes the same 12-cluster smoke ran
  **22/22 GREEN**, with `gFaces` at **585/585 face-and-Δ** and **113/113** stored-bin / median /
  partition / read-word / sizing checks, **96** anchored sites, **119** walk-side fixtures, **390**
  face rows and **G-REPRO-LNC0 at 912 field comparisons, 0 mismatches**.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off a
  published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody can
  claim the freeze was written after seeing a battery: on 12 scratch seeds the E13 arm read a choice
  split of arm 0.544590 / release 0.455410 / none 0.000000, an own-openness mean 0.805334 against an
  opponent-openness mean 0.604927, an own-openness-below-0.4 share 0.162901, a carom rate 0.095125,
  `cBlockedShare` 0.675000 (54/80) and `aShare` 0.962963 (52/54), and it printed **"THE PASSER
  STRUCK INTO A BODY HE COULD NOT SEE WHILE A CLEAR LANE EXISTED"** with **"THE DOSED WORLD AGREES
  ON THE READ"**. **None of these numbers is a finding**; the battery's own §R replaces every one of
  them, and a battery that printed a different sentence would be reported as-is.
* The smoke ALSO confirmed instrument liveness: both arms carried ARM-class and RELEASE-class
  passes, caroms with an established choice tick, C-blocked caroms, own-clear alternatives and
  passes struck with opponent-openness below 0.4; `gLockstep` was green on all 4 arm × scratch-seed
  walks; the world pin held on both arms; X-DET's two digests were identical; and X-FP-PROD
  reproduced the production fingerprint.
* **This section binds nothing.** The freeze is §0–§P.F above.
