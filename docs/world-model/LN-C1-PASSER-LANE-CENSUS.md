# LN-C1 — 「传球者看得见自己人吗」 THE PASSER'S-SIDE LANE CENSUS（他出脚的那一刻,线上已经站着自己人吗;当时有没有一条干净的线）

> **STATUS at this commit: RESULTS (banked at ruling #391 with §COMMANDER CORRECTIONS).** §0 and **§P** below are frozen **BEFORE any battery seed is
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

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`8e908c4`** (`stage.headAtRun` =
`8e908c4a22a83bf822f15ad86d6749f0f0ee1cf4`).
`git diff 8e908c4..<results> -- scripts/probes/ln-c1-passer-lane-census.ts` is **EMPTY (0 bytes)** —
no frozen constant, no frozen definition and no frozen printed form moved after sight, and §P is
byte-identical. **`allGreen` = true** (a STORED boolean; **22** gate objects, every one carrying
`ok: true`); `gFaces` **585/585 face-and-Δ** checks and **113/113** stored-bin / median / partition
/ READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk. Artifact
`docs/world-model/data/ln-c1-passer-lane-census.json` (**901,918 bytes**), `instrumentSha256 =
16df1c30670df9c46062983b0c255190017269e9eb8e6c4c97ad62f3041e47f6`, `hashedBodySha256 =
ac34ebb7f805beee8ceaa385bde159dd411079f9f9715ec2c75dc6ea70bcff29` over a **34**-key allowlist
schema, **file byte-hash
`c462ddec94b15ead5283346e9f86fffc3cb58e144c2427e3ed37aad6011f460f`**, and the NON-body
`receipts.hashReproducesFromFile` = **true**. Battery **84 seeds (12,546,000–12,546,083) × 2 ARMS ×
2 X-DET PASSES + the construction receipt at 12,546,999 ⇒ BOOKED = WALKED = 340 walks**, the two
X-DET digests IDENTICAL (`591619b831bb5116…`); the **UNWALKED TAIL IS DECLARED**:
`seeds.unwalkedTail` = **[12546084, 12546998]**. **G-REPRO-LNC0: 912 field comparisons, 0
mismatches** against the committed LN-C0 artifact (file byte-hash `7f6f2a9e50837375…`), and the list
of LN-C0 fields this census does not compute is **empty** — the walker is inherited whole. Scratch:
the sizing smoke on 900,003,600–611 (receipt 900,003,620), the world pin at 900,003,670, lockstep on
900,003,690–691 — every one STORED in the `seeds` block. **ZERO stats consumed** — registry **75**.
`npx tsc --noEmit` **clean** with the probe in the tree, at both commits. `npm run fingerprint`
observed = **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`** — recomputed
IN-PROBE by X-FP-PROD against OBM-T1's own extracted baseline, **UNCHANGED** (a census cannot move
it). Wall **53.293 s** (`perf.meanWallSecondsPerMatch` **0.115661**).

### §R1 THE CODE FACT, AND THE CHOICE TICK

⭐⭐ **`chooserCountsOwnBodies` = `false`** — a **STORED boolean DERIVED from the anchor gate**, and
⚠ **A CODE READ, NOT A MEASUREMENT.** All **11** code-fact anchors were found at their pinned
occurrence counts, each with its line receipt: `laneOpenness`'s declaration and its third parameter
named `opponents` (`src/ai/perception.ts` l.143), the function's own closest-point line (l.147), its
clear-the-kicker guard (l.149) and its 4 m aggregation (l.151); the FOUR pass-scoring call sites,
every one passing `opp.players` — `groundCandidate` l.611, the through-ball read l.916, the arriver
read l.1036 and the safe-outlet read l.1201; `opennessAt`'s own declaration (l.215) and its
`opennessAt(aim, opp.players)` call inside `groundCandidate` (l.613); and the ground candidate's
score line `let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;` (l.620). ⛔ Had any anchor
failed, `gCodeFact` would be RED and the boolean would be `null`.

⚠ **SCOPED AT RULING #391 (§COMMANDER CORRECTIONS items 1–2).** The stored boolean is TRUE of what its
eleven anchors cover — the GRADED lane test and the openness percept are opponent-only — and FALSE as
a sentence about the whole pricer: the same `groundCandidate` subtracts `gcSeat.exposureWeight ·
groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid)` with `gcBodies = [team.players,
opp.players]` (OUR bodies included), a BINARY shell of `coreRadius + BALL_RADIUS` on the segment,
armed in world 13 (`bkGroundCorridor` is one of world 12's doors; `dvExposureWeight` pinned 0.5 by
the world). And after the ladder decides to pass, the perceived chooser (`edsPerceivedChoice`, ON in
world 13) may REPLACE the target with a pricer that carries neither a lane nor an own-body term. The
sentence "no own-body term appears" is withdrawn; the artifact's boolean is not edited.

**THE CHOICE TICK, BY THE ENGINE'S OWN RULE** — and the classes are not close to empty on either
side:

| face | E13 | E13 counts | D13 | Δ (D13 − E13), 95 % paired CI |
|---|---|---|---|---|
| `choice.arm.passShare` | **0.562670** | 3,524 / 6,263 | **0.552658** | −0.010012 [−0.026928, +0.006943] · **CONTAINS ZERO** |
| `choice.release.passShare` | **0.437330** | 2,739 / 6,263 | **0.447342** | +0.010012 [−0.006938, +0.026932] · **CONTAINS ZERO** |
| ⛔ `choice.none.passShare` (the COUNTED class) | **0.000000** | 0 / 6,263 | **0.000000** | +0.000000, both intervals degenerate |
| `choice.established.geometryShare` (receipt) | **1.000000** | 6,263 / 6,263 | **1.000000** | +0.000000, both intervals degenerate |
| `choice.noneShareOfCaroms` (printed beside every read) | **0.000000** | 0 / 634 | **0.000000** | +0.000000, both intervals degenerate |

⭐⭐ **EVERY MEASURED GROUND PASS HAS AN ESTABLISHABLE CHOICE TICK, AND THE COUNTED CLASS IS EMPTY.**
`gChoiceTickRule` asserts the classification on every walked match: the ARM class is exactly LN-C0's
`gpWithArm` (`lane.armRecordShare` **0.562670** on this battery, against LN-C0's own **0.561513** on
its 998-seed block — a different battery on the same world, quoted for orientation and nothing else)
and the RELEASE class is exactly LN-C0's `gpNoArm`. The `none` class is **0 of 6,263** on both arms —
counted, never imputed, and reported beside every read sentence as required.

### §R2 THE CHOSEN LANE — OWN-OPENNESS BESIDE OPPONENT-OPENNESS, AT THE CHOICE

| face (E13) | value | counts | D13 | Δ (D13 − E13), 95 % paired CI | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐⭐ `choice.established.ownOpennessMean` | **0.809821** | den 6,263 | 0.796023 | −0.013798 [−0.023740, −0.003802] | 1.384107 |
| ⭐⭐ `choice.established.opponentOpennessMean` | **0.621088** | den 6,263 | 0.582661 | −0.038427 [−0.049425, −0.027315] | 3.475990 |
| `choice.arm.ownOpennessMean` | 0.826901 | den 3,524 | 0.807390 | −0.019511 [−0.032026, −0.006519] | 1.529838 |
| `choice.arm.opponentOpennessMean` | 0.647694 | den 3,524 | 0.618049 | −0.029645 [−0.043767, −0.015232] | 2.077735 |
| `choice.release.ownOpennessMean` | 0.787847 | den 2,739 | 0.781980 | −0.005867 [−0.022216, +0.009948] · **CONTAINS ZERO** | 0.364806 |
| `choice.release.opponentOpennessMean` | 0.586857 | den 2,739 | 0.538941 | −0.047916 [−0.066052, −0.030328] | 2.682527 |
| ⭐⭐ `choice.established.ownOpenBelow40Share` | **0.163340** | 1,023 / 6,263 | 0.174628 | +0.011288 [−0.000743, +0.024089] · **CONTAINS ZERO** | 0.909120 |
| `choice.established.ownOpenBelow45Share` | 0.178189 | 1,116 / 6,263 | 0.191495 | +0.013306 [+0.001761, +0.026085] | 1.094044 |
| `choice.arm.ownOpenBelow40Share` | 0.145857 | 514 / 3,524 | 0.163375 | +0.017518 [+0.000841, +0.033969] | 1.057604 |
| `choice.release.ownOpenBelow40Share` | 0.185834 | 509 / 2,739 | 0.188530 | +0.002696 [−0.015297, +0.022056] · **CONTAINS ZERO** | 0.144327 |
| `choice.established.opponentOpenBelow40Share` | 0.320294 | 2,006 / 6,263 | 0.373919 | +0.053625 [+0.037492, +0.068522] | 3.456383 |
| ⭐ `choice.established.corridorOccupiedShare` (the SECOND membership face) | **0.346639** | 2,171 / 6,263 | 0.374344 | +0.027705 [+0.012232, +0.043599] | 1.766512 |
| `choice.established.corridorOccupiedTightShare` (bin) | 0.133961 | 839 / 6,263 | 0.138625 | +0.004664 [−0.005841, +0.015640] · **CONTAINS ZERO** | 0.434224 |

⭐⭐ **THE LANE HE PICKS IS CLEANER OF OURS THAN OF THEIRS, AND HIS GRADED LANE TEST MEASURES ONLY ONE OF THEM** (own bodies enter his price only through the ground-corridor SHELL, binary and ≈0.6 m wide — §COMMANDER CORRECTIONS item 1). On
E13 the mean own-openness of the chosen lane is **0.809821** against a mean opponent-openness of
**0.621088** (a stated derivation of the gap: 0.809821 − 0.621088 = 0.188733), and the passer strikes
below his own 0.4 risk gate **on the invisible axis** on `choice.established.ownOpenBelow40Share`
**0.163340** (1,023 of 6,263) — roughly half as often as he does on the axis he can see
(`choice.established.opponentOpenBelow40Share` **0.320294**, 2,006 of 6,263). ⚠ The two are NOT
comparable as a like-for-like risk: the own population is at most nine bodies against the
opponents' six-a-side plus keeper, and the two faces answer different questions. ⭐ The **SECOND
MEMBERSHIP FACE** for the same bodies — LN-C0's 4 m corridor, at the choice tick's own geometry —
reads `choice.established.corridorOccupiedShare` **0.346639** (2,171 of 6,263): the corridor test
calls "occupied" about twice as many passes as the 0.4 openness gate calls "blocked" (a stated
comparison of two stored values, 0.346639 against 0.163340), which is what a boolean membership test
must do against a continuous worst-body minimum.

**THE OWN-OPENNESS DISTRIBUTION** (the stored bin denominators of the carom conditional below, E13,
established classes; the ten cells sum to 6,263): 351 · 209 · 245 · 218 · 199 · 204 · 198 · 164 · 191
· 4,284. **THE OPPONENT-OPENNESS DISTRIBUTION** on the same 6,263 passes: 452 · 426 · 645 · 483 · 520
· 493 · 386 · 350 · 282 · 2,226.

### §R3 THE CAROM CONDITIONAL, AND WHERE THE FIRST BODY WAS AT THE CHOICE

⭐⭐ **P(first body = own non-target | OWN-OPENNESS BIN at the choice)** — E13, established classes,
the fine 0.1 grid; every cell is `caromByOwnOpenness.bin<i>` with its own numerator and denominator:

| own-openness at the choice | E13 | E13 counts | D13 | D13 counts |
|---|---|---|---|---|
| **[0.0, 0.1)** | **0.675214** | 237 / 351 | 0.674699 | 280 / 415 |
| [0.1, 0.2) | 0.377990 | 79 / 209 | 0.373984 | 92 / 246 |
| [0.2, 0.3) | 0.281633 | 69 / 245 | 0.254355 | 73 / 287 |
| [0.3, 0.4) | 0.220183 | 48 / 218 | 0.161972 | 46 / 284 |
| [0.4, 0.5) | 0.145729 | 29 / 199 | 0.143396 | 38 / 265 |
| [0.5, 0.6) | 0.132353 | 27 / 204 | 0.091633 | 23 / 251 |
| [0.6, 0.7) | 0.050505 | 10 / 198 | 0.034653 | 7 / 202 |
| [0.7, 0.8) | 0.048780 | 8 / 164 | 0.075221 | 17 / 226 |
| [0.8, 0.9) | 0.041885 | 8 / 191 | 0.056034 | 13 / 232 |
| **[0.9, 1.0]** | **0.027778** | 119 / 4,284 | 0.020228 | 94 / 4,647 |

⭐⭐ **A PASS DOWN A LANE WITH ONE OF OURS WITHIN 0.4 m OF THE LINE HAS AN OWN NON-TARGET FIRST BODY TWO TIMES IN THREE** (whether that first body IS the body on the line is not a stored face — §COMMANDER CORRECTIONS item 6). The bottom cell
reads **0.675214** (237 of 351) and the top cell **0.027778** (119 of 4,284) — a stated derivation of
the ratio: 0.675214 ÷ 0.027778 = 24.308. ⛔ No sentence here claims anything about the eight cells
between them: this doc writes no universal that is not a stored boolean, and no monotonicity boolean
was frozen.

**THE READ-BEARING SHARES, AND WHERE THE BODY WAS**:

| face | E13 | E13 counts | D13 | D13 counts | Δ, 95 % paired CI |
|---|---|---|---|---|---|
| ⭐⭐ `read.established.cBlockedShare` | **0.682965** | 433 / 634 | **0.718887** | 491 / 683 | +0.035922 [−0.018173, +0.089735] · **CONTAINS ZERO** |
| `read.arm.cBlockedShare` | 0.596958 | 157 / 263 | 0.663430 | 205 / 309 | +0.066472 [−0.018934, +0.155912] · **CONTAINS ZERO** |
| `read.release.cBlockedShare` | 0.743935 | 276 / 371 | 0.764706 | 286 / 374 | +0.020771 [−0.042400, +0.084390] · **CONTAINS ZERO** |
| `choice.established.caromShare` (= `firstBody.ownNonTarget`) | 0.101229 | 634 / 6,263 | 0.096811 | 683 / 7,055 | −0.004419 [−0.012851, +0.004106] · **CONTAINS ZERO** |
| `carom.established.presence.presentAtChoice` | **0.641956** | 407 / 634 | 0.693997 | 474 / 683 | +0.052041 [+0.005359, +0.098148] |
| `carom.established.presence.arrivedAfterChoice` | **0.007886** | 5 / 634 | 0.002928 | 2 / 683 | −0.004958 [−0.012615, +0.002661] · **CONTAINS ZERO** |
| `carom.established.presence.notInReleaseCorridor` | 0.350158 | 222 / 634 | 0.303075 | 207 / 683 | −0.047083 [−0.091982, −0.000856] |
| `carom.arm.presence.arrivedAfterChoice` | 0.019011 | 5 / 263 | 0.006472 | 2 / 309 | −0.012539 [−0.031379, +0.005528] · **CONTAINS ZERO** |
| `carom.release.presence.arrivedAfterChoice` (⚠ structurally empty — §P.B) | 0.000000 | 0 / 371 | 0.000000 | 0 / 374 | +0.000000, both intervals degenerate |

⭐⭐ **THE BODY WAS ALREADY THERE.** Of the 634 caroms on E13, **407** were bodies standing inside
the release corridor who were **also inside it at the choice tick**
(`carom.established.presence.presentAtChoice` **0.641956**), and **5** arrived after the choice
(`carom.established.presence.arrivedAfterChoice` **0.007886**). The remaining **222** were first
bodies that were **not lane occupants at all** at release (`notInReleaseCorridor` **0.350158**) — the
ball's struck line is not the aim line (spray, deflection, a body moving into the flight), and those
caroms still enter C because C-blocked is a property of THE CHOSEN LANE, not of that body's
membership. ⚠ The `arrivedAfterChoice` cell is **structurally empty in the RELEASE class** (its
choice tick IS the release tick — §P.B, fixture-pinned), so the whole arrival count lives in the ARM
class: **5 of 263** there.

### §R4 THE MENU'S GEOMETRY (a DECLARED RECONSTRUCTION — ⛔ NOT the chooser's score)

| face | E13 | E13 counts | D13 | Δ, 95 % paired CI |
|---|---|---|---|---|
| ⭐⭐ `read.established.aShare` (of the C-BLOCKED caroms) | **0.951501** | 412 / 433 | **0.955193** | +0.003692 [−0.021499, +0.027037] · **CONTAINS ZERO** |
| `read.arm.aShare` | 0.898089 | 141 / 157 | 0.936585 | +0.038496 [−0.015664, +0.095090] · **CONTAINS ZERO** |
| `read.release.aShare` | 0.981884 | 271 / 276 | 0.968531 | −0.013353 [−0.043512, +0.014665] · **CONTAINS ZERO** |
| `carom.established.alternativeShare` (ALL caroms) | 0.908517 | 576 / 634 | 0.925329 | +0.016812 [−0.008926, +0.042346] · **CONTAINS ZERO** |
| `menu.established.ownClearAlternativeShare` (ALL passes) | **0.670286** | 4,198 / 6,263 | 0.679660 | +0.009374 [−0.007649, +0.025806] · **CONTAINS ZERO** |
| `menu.established.bestAlternativeGain.forward` | **0.429967** | 1,805 / 4,198 | 0.423358 | −0.006609 [−0.031344, +0.018327] · **CONTAINS ZERO** |
| `menu.established.bestAlternativeGain.backward` | **0.570033** | 2,393 / 4,198 | 0.576642 | +0.006609 [−0.017982, +0.031412] · **CONTAINS ZERO** |
| `menu.established.bestAlternativeGain.level` | 0.000000 | 0 / 4,198 | 0.000000 | +0.000000, both intervals degenerate |
| `receipt.established.matesExaminedPerPass` | 3.105061 | 19,447 / 6,263 | 3.088731 | −0.016330 [−0.033259, +0.000680] · **CONTAINS ZERO** |
| `receipt.established.alternativesPerPass` | 1.075842 | 6,738 / 6,263 | 1.122183 | +0.046341 [+0.007954, +0.085261] |

⭐⭐ **WHEN HE STRUCK INTO A BODY HE COULD NOT SEE, AN OWN-CLEAR LANE AT LEAST AS OPEN TO THEM WAS
THERE ALMOST EVERY TIME** — `read.established.aShare` **0.951501** (412 of 433 C-blocked caroms on
E13). Over ALL measured passes the alternative exists on `menu.established.ownClearAlternativeShare`
**0.670286** (4,198 of 6,263), at a mean of `receipt.established.alternativesPerPass` **1.075842**
qualifying mates per pass out of `receipt.established.matesExaminedPerPass` **3.105061** examined.
⚠ **AND THE ALTERNATIVE IS MORE OFTEN BACKWARD THAN FORWARD**: of the 4,198 passes carrying one, the
BEST alternative's forward-gain sign is backward on **0.570033** (2,393) and forward on **0.429967**
(1,805); the `level` cell is **0 of 4,198** — an exact tie in a continuous difference — and is
reported empty, never zero-imputed. ⛔ **The gain sign gates nothing**, and this whole section is
geometry: an "alternative" here is a lane, not a candidate that would have won the chooser's argmax,
which prices distance, style, offside, the led aim and eleven other terms this census does not touch
(HONEST LIMIT 3).

### §R5 THE OPPONENTS BESIDE (⛔ never read here — the 「传到对面身上」 census's starting table)

| face | E13 | E13 counts | D13 | Δ, 95 % paired CI |
|---|---|---|---|---|
| `choice.established.opponentFirstShare` (= `firstBody.opponent`) | **0.313747** | 1,965 / 6,263 | 0.322041 | +0.008294 [−0.006196, +0.023906] · **CONTAINS ZERO** |
| `choice.established.opponentOpenBelow40Share` | **0.320294** | 2,006 / 6,263 | 0.373919 | +0.053625 [+0.037492, +0.068522] |
| ⭐ `opponent.established.below40FirstShare` | **0.513958** | 1,031 / 2,006 | 0.526914 | +0.012956 [−0.019367, +0.044043] · **CONTAINS ZERO** |

**P(first body = opponent | OPPONENT-OPENNESS BIN at the choice)** — E13 / D13, same grid, the
denominators being the opponent-openness distribution quoted in §R2:

| opponent-openness at the choice | E13 | E13 counts | D13 | D13 counts |
|---|---|---|---|---|
| [0.0, 0.1) | **0.632743** | 286 / 452 | 0.629934 | 383 / 608 |
| [0.1, 0.2) | 0.556338 | 237 / 426 | 0.570275 | 353 / 619 |
| [0.2, 0.3) | 0.477519 | 308 / 645 | 0.513806 | 428 / 833 |
| [0.3, 0.4) | 0.414079 | 200 / 483 | 0.391003 | 226 / 578 |
| [0.4, 0.5) | 0.336538 | 175 / 520 | 0.325976 | 192 / 589 |
| [0.5, 0.6) | 0.265720 | 131 / 493 | 0.254509 | 127 / 499 |
| [0.6, 0.7) | 0.240933 | 93 / 386 | 0.219753 | 89 / 405 |
| [0.7, 0.8) | 0.254286 | 89 / 350 | 0.248555 | 86 / 346 |
| [0.8, 0.9) | 0.226950 | 64 / 282 | 0.214953 | 69 / 321 |
| [0.9, 1.0] | **0.171608** | 382 / 2,226 | 0.141338 | 319 / 2,257 |

⛔ **THIS CENSUS DOES NOT READ THIS TABLE.** It is the ⑤-adjacent question 「传到对面身上」, and the
one thing worth stating beside it is the receipt: the passer strikes into a lane he himself scores
below 0.4 on `choice.established.opponentOpenBelow40Share` **0.320294** of the time, and those
passes meet an opponent first on `opponent.established.below40FirstShare` **0.513958** (1,031 of
2,006).

### §R6 THE READS, PRINTED

Selected on the **E13** arm's STORED booleans by the frozen §P.C rule, from the frozen §0 literals,
and re-derived off the serialized artifact by `gReadWords`:

> **"THE PASSER STRUCK INTO A BODY HE COULD NOT SEE WHILE A CLEAR LANE EXISTED — a price on own
> bodies in the lane is named (LN-T2, the own-body term in the chooser's lane weight)."**

> **"THE DOSED WORLD AGREES ON THE READ"**

**THE STORED SELECTORS** (E13, `established`): `cBlockedGreaterThanHalf` = **true**
(`read.established.cBlockedShare` **0.682965**, 433 of 634, 95 % CI [0.635514, 0.727129]) and
`aShareGreaterThanHalf` = **true** (`read.established.aShare` **0.951501**, 412 of 433, 95 % CI
[0.929440, 0.971576]) ⇒ `readKey` = `blockedWithAlternative`. **THE COUNTED CLASS, BESIDE THE
SENTENCE**: `countedNoChoiceTickShareOfCaroms` = **0.000000** (0 of 634) on E13 and **0.000000** (0
of 683) on D13 — there is no counted class to hold anything back.

**THE COUNTERFACTUAL WORDS — the SAME frozen rule applied to each arm and each established class
taken alone, every one STORED**: E13 `established` → `blockedWithAlternative`; E13 `arm` →
`blockedWithAlternative` (0.596958 / 0.898089); E13 `release` → `blockedWithAlternative` (0.743935 /
0.981884); D13 `established` → `blockedWithAlternative` (0.718887 / 0.955193); D13 `arm` →
`blockedWithAlternative` (0.663430 / 0.936585); D13 `release` → `blockedWithAlternative` (0.764706 /
0.968531). `reads.dosedAgreesOnTheRead` = **true**.

**THE LOO RECEIPT, SCOPED TO THE ROWS IT COVERS.** Each of the **12** stored read-bearing rows (both shares × both
arms × three scopes) carries **0 flips** of the frozen `> 0.5` selector under leave-one-out, at a
maximum influence share of **0.023362** (the largest of the twelve stored `looMaxInfluenceShare`
values, at `read.arm.cBlockedShare` on D13). One row of the twelve sits closer to its bar than the others in this doc's tables:
`read.arm.cBlockedShare` on E13, point **0.596958**, leave-one-out range
[0.589147, 0.607004]. ⚠ A RECEIPT — it gates no direction, and it says nothing about any face
outside those twelve rows.

### §R7 在说人话的层面

出球的人在选传球路线的时候，程序只帮他数**对面**的人；线上站着**自己人**，他完全看不见——这一条不是
推测，是代码里锁死的（§R1，11 个锚点）——⚠ 但只对「分级的走廊测试」成立：自己人还会通过另一道 0.6 米宽的「贴线壳」进价（GC 座位，权重 0.5），而且约一半的接球人是由另一套「感知选人」挑的，那套定价里既没有走廊也没有自己人（§COMMANDER CORRECTIONS 1–2）。这次普查站在他做决定的**那一刻**量了两个数：他能看见的那条线
有多干净（0.621088），他看不见的那条线有多干净（0.809821）。

然后看那些真的撞到自己人的球（634 次，占地面传球的 0.101229）：

* **十次里有七次，他选的那条线在做决定时就已经被自己人挡住了**（0.682965，433/634）。
* **这些球里，二十次有十九次，当时场上还有另一条「自己人不挡、对方也不比现在多」的线**（0.951501，
  412/433）。
* 撞上的那个人**十次里六次在决定那一刻就已经站在走廊里**（0.641956，407/634），**跑进来的只有 5 次**（0.007886）；另外 222 次（0.350158）他不在放球那一刻的走廊里，是在别处撞上的。

所以印出来的那句话是：**他把球打进了一个他看不见的身体，而当时有一条干净的线**。⚠ 但要说清两件事：
这条「干净的线」只是**几何上**干净，不代表按引擎的完整评分它会赢；而且这些替代线里**回传比前传多**
（0.570033 对 0.429967）——真要装那个「自己人也算进去」的价格，前场的球会不会被逼成回传，是 LN-T2 要
量的事，不是这一步能回答的。⛔ 这一步什么都没改、什么都没上线。

## §HONEST LIMITS

1. **⛔⛔ THIS CENSUS NAMES A LEVER; IT DOES NOT PULL ONE.** It measures a geometry at a tick under a
   §P THIS EXECUTOR FROZE. A different own population, a different gate, a different tie-break would
   produce different shares on the same world. Nothing here is armed and nothing ships.
2. **⭐⭐ THE OWN-OPENNESS IS A DECLARED RECONSTRUCTION, NOT "WHAT HE WOULD HAVE SEEN".** It is the
   SHIPPED `laneOpenness` CALLED with a population the chooser is never handed. No quantity in the
   engine corresponds to it; the census constructs it, says so, and pins the construction with
   fixtures on hand-built geometry.
3. **⭐⭐ THE MENU IS GEOMETRY, NOT THE CHOOSER'S SCORE.** `ownClearAlternativeAtLeastAsOpen` says a
   LANE existed; it does NOT say that pass would have won the argmax. The chooser's score carries
   the flight band, the style/tilt chain, the offside read, kick misalignment, the lay-off test, the
   2过1 and third-man tests, the overlap bonus, the DV/GC risk prices and the DLC led aim — this
   census reproduces NONE of them, by design. ⛔ It is not a counterfactual about goals.
4. **⚠ ASSOCIATIONS, NOT CAUSES.** The carom conditional is a conditional probability on a lane
   property at the choice; it is not a claim that the blocked lane CAUSED the contact. ⛔ No null is
   cut anywhere: an interval containing zero reads *"unresolved at this power"*.
5. **⭐ THE ARM CLASS'S GEOMETRY IS THE ARM TICK'S.** For the 3,524 arm-class passes the two
   opennesses and the menu are read at the passer's ARM-tick position toward the record's own aim —
   bodies move between the arm and the release, which is exactly what the presence split measures.
   LN-C0's release-tick corridor faces use the LAUNCH point instead, so the two membership faces do
   not share a geometry; both are published and neither is "the" lane.
6. **⚠ THE CORRIDOR IS BN-C0's CONSTRUCTION, NOT A SHIPPED PREDICATE** (inherited): the engine ships
   no boolean corridor width. The `CONTROL_RADIUS` reading is a bin, not a second definition.
7. **⚠ THE CLEAR-THE-KICKER GUARD IS INSIDE THE SHIPPED FUNCTION** and therefore inside BOTH
   opennesses: a body whose closest point on the lane lies within 1.5 m of the passer is ignored, on
   the chooser's own "the kick clears them" assumption. That blind spot is not a census artefact —
   it is the chooser's, reproduced faithfully.
8. **⚠ THE KEEPER IS ASYMMETRIC, AND DELIBERATELY.** The opponent population includes their keeper
   (because the chooser's does); the own population excludes ours (because #390 item 4(iv)(b) says
   "own outfield bodies"). An own keeper standing in the lane is invisible to this census as well as
   to the chooser, and the keeper outlet is never counted as an alternative.
9. **⚠ N = 84, AND IT WAS SIZED ON TWO SHARES ONLY.** The battery certifies a 0.05 half-width on
   `cBlockedShare` and `aShare` (realised: 0.045808 and 0.021068 on E13). Every other face —
   including every per-bin cell of both conditionals, the presence split and the gain signs —
   carries its own realised interval and no null is cut on it. The own-openness bin denominators are quoted in §R2 — the
   [0.7, 0.8) cell, for instance, holds 164 passes.
10. **⚠ ONE THIRD OF THE CAROMS WERE NEVER LANE OCCUPANTS** (`notInReleaseCorridor` 0.350158): the
    struck ball leaves the aim line. Those caroms still enter C by construction, because C-blocked
    is a property of the CHOSEN LANE. A stricter C — occupants only — is a different question and is
    not what §P froze.
11. **⚠ BOTH SIDES ARE POOLED**; no face is per-side, and one flight is tracked at a time (PT-C0's
    inherited idiom — overlapping deliveries are under-counted, no flight is lost).
12. **⛔ THIS SAYS NOTHING ABOUT THE AUDIT'S ⑤.** `inSnapshotLaw` is OFF here and is asserted OFF, so
    the chooser reads truth and this census reads the same truth. Whether the reads are HONEST is
    the last cut in the ratified order and is untouched.
13. **⛔ A CENSUS DOES NOT ADJUDICATE.** Whether the answer is LN-T2 (an own-body term in the
    chooser's lane weight), ③ (retire the hand-written designations), or neither, is the commander's
    — with the frozen sentence, this table, and §R4's backward-gain warning in front of him.

## §DEVIATIONS

1. **THE OWN POPULATION EXCLUDES OUR KEEPER** (and the menu examines own OUTFIELD mates only), on
   #390 item 4(iv)(b)'s own words. The chooser can and does pass to the keeper (the build-up outlet
   is a scored candidate), so this is a real, declared narrowing — HONEST LIMIT 8.
2. **THE BEST ALTERNATIVE'S TIE-BREAK IS THE EXECUTOR'S**: highest opponent-openness, ties to the
   earlier player index. The ruling names "the best such alternative" without defining best; the
   rule is frozen in §P.B and stored in the artifact's `menu` block. It affects ONLY the published
   gain sign, which gates nothing.
3. **`arrivedAfterChoice` IS STRUCTURALLY EMPTY IN THE RELEASE CLASS** (its choice tick is the
   release tick). Declared in §P.B before the battery, fixture-pinned, and visible in §R3 as
   0 of 371.
4. **THE ARM CLASS INHERITS LN-C0's `viaWindup` MATCH RULE** (the ended record's `gid` and
   `targetGid` must equal the release's): an evicted or stale record that fails that match falls to
   the RELEASE class. Inherited byte for byte so that G-REPRO-LNC0 compares like with like; stated
   rather than assumed away.
5. **N = 84 BY THE SIZING**, not the block's affordance of 999 — `sizing.boundBy` stores which
   branch bound it. The unwalked tail 12,546,084–12,546,998 is declared and the block is consumed
   whole of record.
6. **THE LN-C0 WALKER IS INHERITED WHOLE** — including the crowd/pair/designation/spot machinery
   this census does not read — so that G-REPRO-LNC0 is a field-for-field comparison over 912 cells
   rather than a chosen subset. Those inherited faces are re-published in this artifact but are NOT
   re-read here: **LN-C0 remains their home**, and the two batteries are different N on the same
   world.
7. **`menu.*.bestAlternativeGain.level` IS EMPTY** (0 of 4,198): an exact forward-gain tie in a
   continuous difference. Reported as it reads, never zero-imputed.
8. **`choice.established.geometryShare` = 1.000000**: every measured pass carried a launch line in
   this battery, so the no-geometry branch of the walker is unexercised here. Reported as a receipt,
   not assumed.
9. **THE CONTEXT FACES ARE LN-C0's, RE-MEASURED AT N = 84** (`context.goalsPerMatch` 3.309524 ·
   `context.groundPassesPerMatch` 74.559524 · `context.passCompletion` 0.587511 ·
   `context.ownedBallSampleShare` 0.340859 · `context.interceptionsPerMatch` 26.297619 ·
   `context.shotsPerMatch` 12.690476 · `crowd.crashShare` 0.468854, all E13). They are published for
   orientation and ⛔ are never quoted as effects.
10. **THREE INSTRUMENT DEFECTS WERE FIXED BEFORE THE FREEZE**, all disclosed in §DEV-PREFLIGHT (the
    placeholder N, the code-fact anchor count, and a sizing-row field whose name did not carry its
    unit). None of them is a post-sight edit: all three predate the freeze commit.

## §GATES — 22 of 22 GREEN

Every gate below carries `ok: true` in the artifact, and every NOTE derives from the same pinned
values its `ok` reads (canon: *"a gate's NOTE derives from the same pinned values the gate checks; a
count typed beside its pin is a second copy"*).

| gate | verdict | what it pinned |
|---|---|---|
| `xDet` | GREEN | the whole core walked TWICE; digests identical (`591619b831bb5116…`), `wallMs` the one named exclusion |
| `xFpProd` | GREEN | the production fingerprint recomputed in-probe = the baseline EXTRACTED from OBM-T1's probe line |
| `gSrcUntouched` | GREEN | `git diff --stat HEAD` AND `git status --porcelain` over `src/` AND `tests/`, all empty |
| `gSeedDisjoint` | GREEN | block base = the frontier at #390 item 7; disjoint from LN-C0's and LN-T1's quoted intervals; scratch ≥ 900,000,000; the re-walk seeds inside LN-C0's own block |
| `gSeedsBookedEqualWalked` | GREEN | 84 distinct battery seeds + the receipt, ×2 arms ×2 passes = 340 walks booked = walked; the tail declared |
| `gN` | GREEN | the sizing arithmetic re-derived, and N = min(84, 999) = 84 — bound by the sizing |
| `gWorld` | GREEN | per arm, on every walked match and the receipt: `bqArmedVersion` 13 · `bqCushion` · both step-② seams absent · RC/BF absent · genome clean · `emergentPosOn` · **`inSnapshotLaw` absent · `edsPerceivedChoice` true** |
| `gDoseSource` | GREEN | the dose FILE BYTES hashed and compared to the standing pins before any seed |
| `gAnchoredConstants` | GREEN | **96** anchored sites at their pinned occurrence counts with line receipts |
| `gCodeFact` | GREEN | the 11 code-fact anchors ⇒ the stored `chooserCountsOwnBodies` = false (a CODE READ) |
| `gChoiceTickRule` | GREEN | per walked match: arm ≡ `gpWithArm`, release ≡ `gpNoArm`, none = 0, the three summing to `gpFlights`; every carom partition inside its own class |
| `gWalkFixtures` | GREEN | **119** walk-side fixtures — including `laneOpenness` CALLED on hand-built geometries (on the segment, 2 m off, 4 m off, inside and outside the 1.5 m clear radius, a `sentOff` body, the worst-body aggregation, beyond the aim), the population rule, the choice-class rule, the carom-presence rule and the two anchored gate edges |
| `gLedgerRead` | GREEN | inherited: the designation class follows the team's own edited set |
| `gClassesNonVacuous` | GREEN | both arms carry arm- and release-class passes, caroms with an established choice tick, C-blocked caroms, own-clear alternatives and passes below the opponent 0.4 gate |
| `gReproducePTC0` | GREEN | inherited: the crowd arithmetic's second implementation agrees cell for cell |
| `gReproLnc0` | GREEN | **912 field comparisons, 0 mismatches** against the committed LN-C0 artifact; the excluded shared field is `wallMs` |
| `gLockstep` | GREEN | observed ≡ unobserved, byte for byte, on 4 arm × scratch-seed walks |
| `gTwoFractions` | GREEN | all **390** face rows carry numerator and denominator and equal their ratio |
| `gLoo` | GREEN | **12** read-bearing rows stored with their flips and min/max leave-one-out values |
| `gFaces` | GREEN | **585/585** face-and-Δ and **113/113** stored-bin / median / partition / read-word / sizing checks off the SERIALIZED artifact |
| `gReadWords` | GREEN | every share with its counts, every selector boolean, every read key, every printed sentence, the agreement boolean and the counted class's share re-derived off disk |
| `gHashOrder` | GREEN | the body hash computed LAST off a **34**-key allowlist schema that INCLUDES `allGreen`; the NON-body keys are `hashedBodySha256`, `gFacesDetail`, `receipts`, `honestLimitsNote` and `worldTwelveNotWalked`; `receipts.hashReproducesFromFile` = true |

**THE PROSE SWEEP.** canon, VERBATIM: *"a stage doc's numeric sweep covers EVERY numeric literal in
prose at ANY precision; a hand-written percentage is the likeliest second copy"*. Every numeric
literal in this document is either (a) a field of this census's artifact quoted at 6 dp, (b) a count
quoted from a stored numerator/denominator, (c) a **source line number** stored in the artifact's
`anchoredSites`, (d) a value quoted from LN-C0's committed artifact by field name (`0.561513`), (e) a
seed, a ruling number, a gate/fixture/anchor/face count stored in the artifact, a hash prefix, or the
interval level, or (f) one of the **four stated derivations**, each flagged in place: 0.809821 −
0.621088 = 0.188733 (§R2), 0.675214 ÷ 0.027778 = 24.308 (§R3), and the two "roughly half"/"about
twice" comparisons of two stored values in §R2, which name both stored values rather than a new
number. The residual literals that match none of the three artifacts (this census's, the disclosed smoke's
and LN-C0's committed one) were enumerated by an independent tokenizer over the whole file and are
every one accounted for here: **591619** (the first six characters of the X-DET digest, whose full
64 are in the artifact) · **901,918** (this artifact's own FILE BYTE COUNT, self-referential by
construction and therefore living in the doc — the `receipts` block says so in terms) ·
**900,000,000** (the scratch-band floor, quoted from the seed-discipline canon) · **691** and
**699** (the tails of the seed range 900,003,690–691 and of the scratch band 900,003,600–699, both
stored whole in the `seeds` block) · the ruling numbers. ⛔ **NO PERCENTAGE IN THIS DOCUMENT
RESTATES A STORED SHARE** — the only `%` characters are the interval level (95 %).

## §COMMANDER CORRECTIONS (ruling #391 — the MEASUREMENTS BANKED, the MECHANISM CORRECTED; verifier FAIL on two HIGH that trace to ruling #390 item 3(iii)'s own sentence; the artifact, the instrument and §P UNCHANGED)

The independent verifier re-summed every share off `perSeedCells` (all reproduce), ran its own
bootstrap, re-derived all six read cells and the frozen literals verbatim, re-ran the probe's smoke
(22/22; the two sizing half-widths bit for bit), re-implemented the body hash, and then READ THE
PRICER PAST THE ANCHORS. Verdict **FAIL** — two HIGH, five MEDIUM, four LOW. The commander confirmed
both HIGHs by reading the code. The items:

1. **HIGH — THE CODE FACT IS CONTRADICTED BY A LIVE OWN-BODY PRICE.** `chooserCountsOwnBodies = false`
   rests on eleven anchors that cover `laneOpenness` / `opennessAt` / the score line. The same hoisted
   `groundCandidate` carries `const sGc = gcSeat === null ? sDv : sDv - gcSeat.exposureWeight *
   groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);` (`PlayerBrain.ts` ~l.686–687) with
   `gcBodies = [team.players, opp.players]` (~l.525–526) — OUR OWN BODIES — and `groundShellHazard`
   (`deliveryValueSeat.ts` ~l.548–567) returns 1 when ANY non-sent-off body on EITHER side, minus
   kicker and receiver, has its core shell (`coreRadius + BALL_RADIUS`, BALL_RADIUS 0.11 m) on the
   segment before the aim. The seat is ARMED in the walked world: `bkGroundCorridor: true` is one of
   world 12's five doors (`a4World.ts` RA_WORLD_DOORS) and `dvExposureWeight` is pinned 0.5 by the
   world — this census's own `gWorld` gate proves the door open. Against DEFAULT_POLICY's `passBase`
   0.2 · `passLaneW` 0.3 · `passOpenW` 0.2, a fired shell costs 0.5 — heavy when it fires, nothing
   when the body stands 0.6–1.6 m off the line. RULED: the stored boolean is TRUE as scoped to its
   anchors and WITHDRAWN as a sentence about the pricer (§R1 scoped in place; §R2 and §R7 headlines
   re-scoped); the artifact is not edited. Ruling #390 item 3(iii)'s "carries NO own-body term" is
   RECORDED AS WRONG at #391 (rulings are never reworded). The read's lever clause ("the own-body term
   in the chooser's lane weight") is SUSPENDED pending LN-C2.
2. **HIGH — THE TARGET IS NOT ALWAYS THE LANE WEIGHT'S.** With `edsPerceivedChoice` TRUE (world 13,
   asserted per match by `gWorld`), after the ladder decides to pass `passMate` is REPLACED by
   `choosePerceivedPassTarget(...)`'s winner (`PlayerBrain.ts` ~l.1393–1427, `if (chosen) passMate =
   chosen;`), priced by `pricePassOption` on the body's perceived snapshot scoped to passer +
   candidates + opponents — a pricer with NO lane term and NO own-body term, and non-candidate
   teammates not in its scope at all. The verifier's scratch (seeds 12,546,000–002, `traceChoice`
   on): the perceived target differed from the lane argmax's `bestMate` on 64 of 139 traced
   decisions — A SCRATCH NUMBER, labelled, not a face of this census. No published share moves (the
   census measures the lane to the ACTUAL target); the mechanism story changes: an own-body term in
   `passLaneW` would not move WHO receives on the substituted decisions. LN-C2 measures the path.
3. **MEDIUM — THE RELEASE CLASS'S AIM.** For a synchronous strike the instrument reads the target's
   body position; the strike may carry a DLC lead (`performPass(..., v2(bestLeadX, bestLeadY))`, the
   displacement left on `match.dxStrikeAim`). The verifier's scratch (4 matches): 2 of 90 synchronous
   strikes carried a non-zero lead, mean |lead| 5.510 m. Small in frequency, large in metres,
   undeclared — of record as a limit; LN-C2 reads the strike's own aim record for both classes.
4. **MEDIUM — THE COUNTED CLASS IS STRUCTURALLY EMPTY** (`choiceClassOf` returns arm | release
   only): "the counted class is EMPTY" is a receipt no battery could have failed, not a measurement.
   The underlying rule is TRUE (the verifier read every strike site). Of record.
5. **MEDIUM — THE ARTIFACT'S `honestLimitsNote` POINTS AT LN-C0's LIMITS** (an uncorrected
   inheritance). The list of record is THIS doc's §HONEST LIMITS; the artifact is not edited.
6. **MEDIUM — §R3's HEADLINE ASSERTED AN IDENTITY THE ARTIFACT DOES NOT STORE** ("HITS HIM"): the face
   is P(first body = own non-target | bin), not "the first body is the body on the line".
   Re-scoped in place.
7. **MEDIUM — THE CHOICE-TICK RULE'S ANCHORS COVER THE `Pass` BRANCH AND THE CUTBACK, NOT THE
   THROUGH BALL (`performThroughBall`, ~l.1718) OR THE KICKOFF PLAY-BACK (~l.293)**. The verifier read
   both: same decision switch, struck at the deciding tick — the rule HOLDS, the anchoring is short.
   Of record; LN-C2 anchors all strike sites of the population.
8. **LOW — §R7's 「基本都是」** overstated 0.641956 and dropped the third bucket (0.350158 not in the
   release corridor). Rewritten in place with all three buckets.
9. **LOW — THE BANNER** read FREEZE at the RESULTS commit; flipped in place (the ratified two-word
   form, LN-T1 §DEVIATIONS 10).
10. **LOW — TWO DIGIT RUNS OF THE FULL FILE BYTE-HASH** quoted in §GATES fall outside the sweep's
    stored pool by design (the file hash is not stored in the artifact). Of record.
11. **LOW — §DEVIATIONS 4 (the inherited `viaWindup` match rule) DECLARED WITHOUT A COUNT**: the
    verifier measured 148 arms, 0 evictions, 0 cancelled pending kicks over 4 world-13 matches — the
    fallback is inert on this world. Of record.
12. **RATIFIED**: the ten declared §DEVIATIONS; the thirteen HONEST LIMITS as the ONE home; N = 84 by
    the sizing rule (both read-bearing half-widths inside the declared 0.05).
