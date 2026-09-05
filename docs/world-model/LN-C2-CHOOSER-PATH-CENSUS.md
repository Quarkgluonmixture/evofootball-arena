# LN-C2 — 「谁选的接球人，他看见了谁」 THE CHOOSER-PATH CENSUS（这个接球人是哪一套定价选的；出脚那一刻，那条线上的「贴身壳」响了没有）

> **STATUS at this commit: RESULTS.** §0 and **§P** below are frozen **BEFORE any battery seed is
> walked**, together with the complete instrument
> [`scripts/probes/ln-c2-chooser-path-census.ts`](../../scripts/probes/ln-c2-chooser-path-census.ts).
> ⭐ **§P AND THE INSTRUMENT ARE THE FROZEN PAIR**; **§DEV-PREFLIGHT is a DISCLOSURE block**, not
> part of that covenant (LN-T1 §COMMANDER CORRECTIONS item 4, ratified at ruling #390 item 1 and
> re-stated at LN-C1 §CORR 9). The results sections are written in the SECOND commit, and between
> the two the instrument is **byte-identical**
> (`git diff FREEZE..RESULTS -- scripts/probes/ln-c2-chooser-path-census.ts` EMPTY).
> ⛔ **§P is never edited after sight.** If §P turns out to be wrong once the numbers are in, a
> **§DEVIATIONS** entry records it; the frozen text stands.
>
> canon, VERBATIM: *"freeze the instrument commit BEFORE the battery; artifact records the
> instrument hash"* (home: ruling #266.3(c), via [`CANON.md`](CANON.md)).
>
> Authorized by **COMMANDER RULING #391 item 4**. Lineage: **PT-C0** (the population and the
> `ball.lastTouch` FIRST-BODY channel, byte for byte) → **BN-C0** (the corridor membership test) →
> **LN-C0** (the walker, the wind-up ARM-tick channel, the cause classes, the estimator and the
> hash order) → **LN-T1** (X-DET, X-FP-PROD, the LOO receipt) → **LN-C1** (the choice-tick rule,
> the own-openness CALLED reconstruction, the menu geometry and the first-body channel, REUSED and
> anchored) → this census. Census form of record:
> [`LN-C0-LANE-CENSUS.md`](LN-C0-LANE-CENSUS.md). Artifact:
> `docs/world-model/data/ln-c2-chooser-path-census.json` (**or its `.RED.json` SIDE PATH** if any
> gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS. **IT SHIPS NOTHING**, scores no hypothesis
> and **ARMS NOTHING** — it prints frozen sentences that NAME where a seam belongs. The commander
> rules.
> ⛔ **X-SRC-ZERO**: no file under `src/` or `tests/` is created or edited.
> ⛔ **WORLD 12 AND WORLD 13 ARE UNTOUCHED**; every flag default stays OFF, and `traceChoice` is
> passed **EXPLICITLY on the construction**, never through the `EDS_TRACE_CHOICE` env (which this
> instrument's §1 envelope REFUSES outright).

**在说人话的层面**：上一步（LN-C1）量到了——球撞到自己人的那些传球里，十次有七次，他选的那条线在他
做决定时**已经**被自己人挡住了。但随后发现上一步的**机制说法是错的**：程序其实**有**一道「自己人也
算」的价格（一道约 0.6 米宽的**贴线壳**，撞上就扣 0.5），而且**接球人往往根本不是那套评分选的**——
决定要传之后，另一套「感知选人」会把接球人**换掉**，那套定价里既没有走廊也没有自己人。所以这一步不
改任何东西，只回答三个问题：**这个接球人是哪一套选的**（引擎自己的选人流水账里写着）、**出脚那条线
上的壳响了没有**（直接调用引擎那个函数）、**我们自己人当时站在哪**。测完印一句冻结好的话，告诉指挥
官那道「自己人价格」该装在哪里：换人的那套定价里、壳的**权重**上、还是给走廊评分加一个**分级**的项。

---

## §0 WHAT THIS IS AND WHY

### THE MECHANISM OF RECORD THIS CENSUS MEASURES AGAINST (#391 item 3, quoted)

> ⭐⭐⭐ **THE MECHANISM, CORRECTED — #390 ITEM 3(iii) RECORDED AS WRONG.** (i) TRUE as written
> there: the GRADED lane test `laneOpenness(from, to, opponents)` is opponent-only, and so is
> `opennessAt`; the score line `s = passBase + lane·passLaneW + open·passOpenW` carries no
> own-body term. (ii) FALSE as written there ("the gain / risk chain carries NO own-body term"):
> the same `groundCandidate` subtracts `gcSeat.exposureWeight · groundShellHazard(p.pos, aim,
> gcBodies, p.gid, mate.gid)` with `gcBodies = [team.players, opp.players]` (`PlayerBrain.ts`
> ~l.518–526, ~l.686–687; `deliveryValueSeat.ts` ~l.548–567) — a BINARY shell of `coreRadius +
> BALL_RADIUS` (0.11 m) on the segment before the aim, either side, minus kicker and receiver —
> ARMED in world 13 (`bkGroundCorridor: true` in RA_WORLD_DOORS; `dvExposureWeight` pinned 0.5 by
> the world) at a price of 0.5 against DEFAULT_POLICY's `passBase` 0.2 · `passLaneW` 0.3 ·
> `passOpenW` 0.2. So the passer DOES see his own man — inside a 0.6 m shell, as a heavy binary
> price; a body 0.6–1.6 m off the line (own-openness 0.15–0.4) he does not see at all. (iii) NOT
> SAID THERE AT ALL: with `edsPerceivedChoice` TRUE (A4_WORLD_FLAGS — every a4 world), after the
> ladder chooses `Pass` the target `passMate` is REPLACED by `choosePerceivedPassTarget`'s winner
> (`PlayerBrain.ts` ~l.1393–1427), priced by `pricePassOption` on the body's perceived snapshot
> SCOPED to passer + candidates + opponents (`scope`, ~l.1408–1410): non-candidate teammates are
> not in the picture, and the price (a threat-quintile reception rate, or the attempt value) has
> neither a lane term nor an own-body term. The GC shell price therefore reaches WHO RECEIVES only
> on the decisions the perceived chooser leaves alone. […] (iv) THE LEVER CLAUSE IS SUSPENDED […]
> WHERE an own-body seam belongs — the lane argmax, the perceived pricer, both, or the existing
> shell's WEIGHT — is a measurement, not a ruling.

### THE LESSON THIS CENSUS'S CODE GATE IS SHAPED BY (#391 item 3(v), quoted)

> (v) Lesson of record (the RC-T0b category error's cousin): a code read anchored at the sites one
> already believes in is a confirmation, not a census — LN-C1's `gCodeFact` proved eleven true
> anchors and missed the twelfth line of the same function. Future code-fact booleans are derived
> from the WHOLE function body (a hash of the function's text, anchored) beside the named sites.

⇒ every code fact in §R1 is derived from the **WHOLE TEXT** of its function, extracted by anchored
start/end needles and **hashed**; the doc **quotes each function in full** so a reader can see
every term, and the gate is red — and **no code fact is written at all** — unless BOTH the named
anchors and the four function hashes are green.

### THE SPECIFICATION (COMMANDER RULING #391 item 4, quoted in the compressed form of its own text)

> ⭐⭐ **LN-C2 DISPATCHED — 「谁选的接球人，他看见了谁」 THE CHOOSER-PATH CENSUS** (a C0-form census;
> X-SRC-ZERO; definitions frozen at the executor's §P). (i) ARMS: E13 of record, D13 beside;
> LN-C1's construction CALLED, PLUS the engine's own choice ledger ARMED (`traceChoice: true` —
> the E3 sidecar `match.passChoiceTrace`, "read by nothing in the sim": its byte-inertness PROVED
> by gLockstep, traced vs untraced whole-match signatures identical on the scratch seeds […]).
> (ii) POPULATION: PT-C0's measured ground passes with LN-C1's choice-tick rule INHERITED, the
> strike joined to its trace row by (decision tick, passerGid) — the join rate a receipt; a pass
> with no trace row (the cutback keeps its own machinery; the keeper; a forced target) is COUNTED
> as class UNTRACED, never imputed. (iii) THE PATH CLASS per traced pass, off the ledger: **LEGACY**
> (`chosenGid` = −1 or `chosenGid` = `legacyGid`) · **SUBSTITUTED** (`chosenGid` ≠ `legacyGid`,
> both ≥ 0). (iv) THE SHELL at the choice: `groundShellHazard(passer.pos, aim, [team.players,
> opp.players], passer.gid, target.gid)` CALLED — the shipped function — on the STRUCK lane (aim =
> the strike's own record for both classes, §CORR 3) ⇒ `shellFired` ∈ {0, 1}; and on the lane
> argmax's own candidate (`legacyGid`'s position at the choice) beside; the shell's constants
> anchored […]. (v) THE CODE FACTS as anchored booleans AND whole-function hashes […]. (vi) FACES
> per arm, with counts […]. (vii) READS — frozen literals on STORED booleans […]. (viii) SEEDS:
> block **12,547,000–999** […]; ZERO stats; registry **76** […].

**THE THREE READ SENTENCES, VERBATIM from #391 item 4(vii)** — frozen literals in the instrument,
selected by STORED booleans on the **E13** arm. Let **C** = the TRACED caroms; **S** = the share of
C taken by the SUBSTITUTED path; **F** = the share of the LEGACY-path caroms with `shellFired` = 1:

| selector (STORED booleans) | the sentence PRINTED |
|---|---|
| `S > 0.5` | *"THE CAROM COMES THROUGH THE PERCEIVED CHOOSER — the own-body seam belongs in the perceived pricer; LN-T2 is re-formed there."* |
| `S <= 0.5` AND `F > 0.5` | *"THE SHELL FIRED AND WAS OVERRIDDEN — the price exists and is too small; LN-T2 is the shell's WEIGHT, not a new term."* |
| `S <= 0.5` AND `F <= 0.5` | *"THE BODY STOOD OUTSIDE THE SHELL — a GRADED own-body term in the lane weight is named; LN-T2 as first formed."* |

plus the agreement sentence, selected by a STORED boolean: *"THE DOSED WORLD AGREES ON THE READ"* /
*"THE DOSED WORLD DISAGREES ON THE READ"*. ⭐ **The UNTRACED class's share of ALL caroms is printed
BESIDE EVERY SENTENCE.**

### in plain football language

Two different pieces of code decide who gets the ball, one after the other.

1. **The lane argmax** scores every mate. It grades the line by *how much of it THEY cover* — and
   it also subtracts a flat charge if ANY body, ours or theirs, is standing within about half a
   metre of the line before the aim. That charge is the **shell**: binary, heavy, and blind to
   anything wider than its own width.
2. **The perceived chooser** then runs, and — on the decisions it can execute — it **throws the
   first answer away** and picks its own man off what this body can actually see. Its price reads
   the corridor for OPPONENTS — a tick-by-tick read of whether a defender reaches the flight first —
   and knows nothing about our own bodies (§COMMANDER CORRECTIONS item 1: the "no lane term" half of
   the original sentence was wrong).

So when the ball ends up hitting one of our own men, there are three quite different stories, and
they need three different fixes. Either the man was picked by the SECOND chooser (then a lane price
in the first one changes nothing, and the seam has to go where the choosing actually happens);
or he was picked by the FIRST one and the shell DID fire and the chooser paid the charge and
struck anyway (then the price exists and is simply too cheap); or he was picked by the first one
and the shell did NOT fire, because our man was standing 0.6–1.6 m off the line where the shell
cannot see him (then a **graded** own-body term is what is missing). This census counts which.

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — LN-C1's construction, CALLED, plus the engine's own ledger

| arm | composition — the composer **CALLED, never copied** | gate on the match |
|---|---|---|
| **E13** | **world 13 EMPTY-BOOK — the read of record**: `a4MatchFlags(13)` as construction flags + `armA4World(m, null, 13)`, **plus `traceChoice: true` passed EXPLICITLY on the construction** | `bqArmedVersion(m) === 13` |
| **D13** | **world 13 DOSED — THE FORM THE USER PLAYS**: the same, plus the two doses from the **SHIPPED LOADERS THEMSELVES** (`loadL3Dose` / `loadPcDose`, CALLED) | `bqArmedVersion(m) === 13` |

The two arms are **PAIRED on shared seeds** with the IDENTICAL population construction, so they
differ **ONLY** in the world's own books. `gDoseSource` hashes the FILE BYTES this process read and
compares them to the house's standing pins; a mismatch is `process.exit(3)` **before any seed is
walked** — canon, VERBATIM: *"a dose-source guard should hash the bytes it reads, not a
self-declared field"*.

⭐⭐ **`traceChoice` IS NEVER TAKEN FROM AN ENV.** `Match` defaults the flag from `EDS_TRACE_ARMED`
(the `EDS_TRACE_CHOICE` env door — both lines anchored); this instrument's §1 envelope **REFUSES
that env outright** (`process.exit(3)` if it is set at all) and the construction states the boolean
itself, so the arms' ledger is armed **by construction** and `gLockstepTrace`'s untraced twin is
un-armed the same way.

`gWorld` asserts, per arm, on EVERY walked match and the construction receipt: `bqArmedVersion` = 13
· `bqCushion` TRUE · `obmMovement` and `ctbSupportPlane` ABSENT · every RC/BF flag absent ·
`info.genome` clean of the RA / corridor / RC / CTB / OBM genes · `emergentPosOn()` TRUE ·
`inSnapshotLaw` ABSENT · `edsPerceivedChoice` TRUE — **and LN-C2's own conjuncts: `traceChoice`
TRUE on every walked match (and FALSE on the untraced lockstep twin), `bkGroundCorridor` and
`dxWindupAim` OPEN, and `dvExposureWeight` READ off the constructed match's EFFECTIVE genome as a
RECEIPT** (whatever it reads is what is stored; the world pins `CORRIDOR_WORLD_WEIGHT`, anchored).
Pinned again on a CONSTRUCTED match of each arm at scratch seed **900,003,770**.

⭐⭐ **THE LEDGER'S BYTE-INERTNESS IS PROVED, NOT ASSUMED (`gLockstepTrace`).** The sidecar's own
docblock says it is *"read by nothing in the sim"* (anchored). This census walks the SAME arm at the
SAME out-of-band scratch seed twice — once with `traceChoice: true`, once with `false` — and the
whole-match signatures (score, phase, ball, every body's position / velocity / heading / stamina
**and the rng stream state**) must be IDENTICAL. ⛔ **If they are not, the instrument STOPS with
`process.exit(4)` before any battery seed and the census reports BLOCKED**: the ledger would be a
heuristic, not a ledger.

⛔ **The census SCORES nothing.** The paired Δ (D13 − E13) is published on every face by a 2,000-draw
cluster bootstrap that resamples SEEDS; an interval containing zero reads *"unresolved at this
power"*, never "no difference".

### §P.B THE POPULATION, THE JOIN, THE PATH CLASS, THE AIM AND THE SHELL

| quantity | frozen form |
|---|---|
| **THE POPULATION** | ⭐⭐ **PT-C0's, BYTE FOR BYTE** (LN-C1's, inherited): every **MEASURED GROUND PASS** — `isMeasurableGroundPass` (`shortPass` \| `throughBall` \| `cutback`, ground launch, with a pending-pass target), registered **at the strike** via `pendingPass`. ONE flight is tracked at a time; a retired flight is **BOOKED** |
| **⭐⭐ THE CHOICE TICK (= THE DECISION TICK)** | **LN-C1's rule, INHERITED**: the **ARM tick** where a wind-up record exists (`arm` class); the **RELEASE tick** for a synchronous strike (`release` class), because every strike site is called from the same brain decision. ⭐ **EVERY STRIKE SITE OF THE POPULATION IS ANCHORED** (LN-C1 §CORR 7's debt, paid): the Pass branch's `armPendingPass`, its LED synchronous `performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY))`, its TO-FEET `performPass`, `performCutback`, `performThroughBall`, and the **kickoff play-back**'s bare `match.performPass(p, back)`. The `none` class is COUNTED, never imputed |
| **⭐⭐ THE JOIN** | each struck pass is joined to its ledger row by **(decision tick, passerGid)**. The engine's own `match.passChoiceTrace` is DRAINED per tick into a map on that key; the ARM class joins at the ARM tick (the row and the wind-up record are written in the same tick) and travels on the wind-up record, the RELEASE class joins at the release tick. ⭐ **THE JOIN RATE IS A RECEIPT** (`trace.*.joinShare`), never a filter |
| **⭐⭐ THE PATH CLASS** | off the ledger, FROZEN. **`legacyChosen`** = `chosenGid === legacyGid` · **`legacyNoOption`** = `chosenGid === -1` (the sub-class of LEGACY, stored separately) · **`substituted`** = `chosenGid >= 0 AND chosenGid !== legacyGid` · **`untraced`** = NO row for that key — COUNTED, never imputed (the cutback keeps its own machinery and is never substituted; the keeper is excluded from the perceived chooser; a forced target is a different branch; a decision that never ran the EDS block has no row by construction). **LEGACY** = `legacyChosen` + `legacyNoOption`; **TRACED** = everything but `untraced`. Its share of ALL passes and of ALL caroms is published |
| **⭐⭐ THE RECEIPT ON THE JOIN** | the struck pass's target gid must EQUAL `chosenGid` when `chosenGid >= 0` and `legacyGid` otherwise — the share where it does is `trace.*.targetAgreesShare`, **a GATE: it must be 1.000000 or the mismatch is explained and counted** |
| **⭐⭐ THE AIM OF RECORD** | ⛔ **NEVER RECOMPUTED.** `arm` class: the wind-up record's OWN `aim` **plus its own `aimLead`**. `release` class: the target's own position **plus the ENGINE'S OWN recorded strike lead** — `match.dxStrikeAim`'s `lead` when its `gid` and `tick` match this strike (the ONE `dxWindupAim` fork's deposit, written at the decision tick when the argmax elected a displaced candidate; `dxWindupAim` is one of world 12's doors, asserted by `gWorld`). ⚠ **WHERE NO RECORD EXISTS the class is COUNTED as `aim.bodyFallback`** and the target's own position is used — LN-C1's inherited rule, DECLARED, with its own published share |
| **⭐⭐ THE SHELL AT THE CHOICE** | `shellFired` = **`groundShellHazard(passer.pos, aim, [team.players, opp.players], passer.gid, target.gid)` CALLED** — the SHIPPED function, the pricer's own populations, at the CHOICE tick's geometry on the STRUCK lane. Beside it, the SAME function on a NARROWED population: **`shellFiredOwnOnly`** (`[team.players]`) and **`shellFiredOppOnly`** (`[opp.players]`), so the doc can say WHOSE body fired it. ⛔ Never re-implemented; `gShellFixtures` pins it on hand-built geometry |
| **⭐ `shellFiredLegacy` (a DECLARED RECONSTRUCTION)** | the same shipped call on the LANE ARGMAX'S OWN candidate's lane — `passer.pos → legacyGid`'s body position at the choice — **because the argmax's own aim is NOT recorded anywhere**. Published only for SUBSTITUTED passes, beside the struck lane's, with the readability receipt `substitution.*.legacyLaneReadableShare` |
| **THE SHELL'S CONSTANTS** | ANCHORED at their named sites and never re-typed: `BALL_RADIUS`, `PLAYER_CORE_RADIUS` (what the `coreRadius` getter returns — the getter's own body is anchored and quoted in §R1), `CORRIDOR_WORLD_WEIGHT` (the `dvExposureWeight` the world pins) — and the weight is ALSO **read off the constructed match's effGenome as a receipt**, stored as `theShell.dvExposureWeightRead` |
| **⭐⭐ THE OWN-OPENNESS** | **LN-C1's CALLED reconstruction, INHERITED byte for byte**: the SHIPPED `laneOpenness(passer.pos, aim, own outfield minus passer minus target)`. Binned on the **fine 0.1 grid** and cut into the three cells **[0.0, 0.1) / [0.1, 0.4) / [0.4, 1.0]** on the chooser's OWN anchored 0.4 gate, **crossed with `shellFired` and with the path** |
| **⭐⭐ THE SUBSTITUTION'S DIRECTION** | on SUBSTITUTED passes, the struck lane's own-openness against the LANE ARGMAX'S candidate's, stored as the counts **`into`** (struck < 0.4 AND legacy ≥ 0.4 — the substitution moved the ball INTO a lane with our body), **`outOf`** (the reverse), **`neither`** (both sides agree) and **`noLegacyLane`** (the argmax's body carried no readable lane) |
| **THE FIRST BODY** | PT-C0's **`ball.lastTouch` FIRST-BODY channel**, byte for byte. **A CAROM = `ownNonTarget`** |
| **THE MENU** | the ledger's OWN `candidates` / `read` / `seenUnread` / `unseen` counts and its `blindOutpricesRead` flag, per traced pass, by path; plus the `chosenGid === -1` rate |
| **CONTEXT** | LN-C1's whole inherited table (the two opennesses at the choice, the carom conditional, the presence split, the menu geometry, the opponents beside, LN-C0's crowd/pair/designation/spot faces) — **published, not re-read here; LN-C1 remains their home** — which is what makes G-REPRO-LNC1 a field-for-field comparison |

⭐⭐ **THE CROSS CELL.** Every path count lives in exactly ONE cell of the flat grid
`k = CCI(choiceClass) · PATHS.length + PTI(pathClass)`, so every published face is a sum over a
cell set and **no count is copied**. `gChoiceTickRule` asserts the grid is a partition of the same
passes on every walked match, and `gFaces` re-asserts it off the serialized artifact.

### §P.C THE READS (the literals and their selectors)

Let **C** = the **TRACED CAROMS**: first body = own non-target, an ESTABLISHED choice tick, a choice
GEOMETRY, and a ledger row JOINED. **`S`** = the share of C whose target was chosen by the
**SUBSTITUTED** path. **`F`** = the share of the **LEGACY-path** caroms whose struck lane had
`shellFired` = 1 at the choice. The **SELECTORS ARE STORED BOOLEANS** (`> 0.5`), and the frozen rule
of §0's table is applied by ONE function to **every arm and every scope**. The **READ OF RECORD** is
the **E13** arm's `established` cell (both established classes pooled); **D13**'s is printed BESIDE
with an AGREEMENT boolean; and the SAME rule is applied to **each ESTABLISHED CLASS TAKEN ALONE** —
the `arm` class and the `release` class — as the **counterfactual words**, STORED. The **UNTRACED
class's share of ALL caroms** is stored on every read cell and printed beside every sentence.
`gReadWords` re-derives every share with its numerator and denominator, every selector boolean,
every read key, every printed sentence, the agreement boolean and the untraced share **from the
SERIALIZED per-seed cells off disk**, and asserts every printed sentence is one of the frozen
literals. canon, VERBATIM: *"a counterfactual verdict sentence ('had X been scored, the rule would
read W') quotes a word the instrument STORED by applying the frozen rule to X's stored interval; a
universal sentence about a table ('every bin', 'the one bin') is a stored boolean or is not
written"*. ⭐⭐ **This doc writes no universal that is not a stored boolean.**

**THE CODE FACTS ARE STORED BOOLEANS DERIVED FROM WHOLE-FUNCTION TEXTS.** Four functions are
extracted by an ANCHORED START NEEDLE and an ANCHORED END NEEDLE (the start needle occurring exactly
ONCE in its file), hashed with sha256, and stored with their line spans and character counts:
**`groundCandidate`** (`PlayerBrain.ts`), **`pricePassOption`** and **`choosePerceivedPassTarget`**
(`perceivedPassChoice.ts`), **`groundShellHazard`** (`deliveryValueSeat.ts`). Every code-fact
boolean is computed from the FULL text (`contains` probes over the whole function), never from a
named line. ⛔ **If any anchor or any extraction fails, `gCodeFact` / `gFnTexts` are RED and NO CODE
FACT IS WRITTEN.** ⚠ They are **CODE READS, NOT MEASUREMENTS**, and the doc says so wherever they
appear.

### §P.D THE ESTIMATOR

**Cluster bootstrap over match SEEDS, 2,000 draws**, rng seeded from the block base 12,547,000.
Every published share carries a 95 % percentile interval and its half-width; every paired Δ is
**D13 − E13** on the seeds the arms share, so the interval is PAIRED by construction. Medians are
**BIN-DERIVED** so `gFaces` re-derives every one off disk. ⛔ **Nothing is scored and no null is cut
anywhere.** ⭐ **LEAVE-ONE-OUT** is computed for **every read-bearing share** (`sShare` and
`fShare`, on both arms and all three scopes): drop each seed, re-derive the POINT share, and count a
FLIP when the frozen `> 0.5` selector changes. ⚠ A RECEIPT — it gates no direction, and the doc's
LOO sentence is scoped to the rows it covers.

### §P.E SEEDS AND SIZING

* **Block 12,547,000–999** (the frontier of record at #391 item 7; `gSeedDisjoint` checks it against
  the published consumed intervals — LN-C0 12,544,000–999, LN-T1 12,545,000–999 and LN-C1
  12,546,000–999). Battery seeds **12,547,000–12,547,484** (**N_FROZEN = 485**), construction
  receipt **12,547,999**. Each seed is walked **ONCE PER ARM in EACH of the TWO X-DET passes** ⇒
  **1,944 walks booked = walked**. The **UNWALKED TAIL IS DECLARED**: **12,547,485–12,547,998**,
  stored in `seeds.unwalkedTail`.
* **⭐⭐ N IS SIZED, NOT CHOSEN.** `N = min(the largest nRequired over the two SIZED read rows, the
  block's affordance after the construction receipt)`, at a **DECLARED half-width target of 0.05**
  on `read.established.sShare` and `read.established.fShare`, with the house form
  `se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/se(needed))²) ·
  MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975`. **WHICH BRANCH BOUND IT IS STORED**
  (`sizing.boundBy`) and reported in §GATES. The table is in §DEV-PREFLIGHT.
* **⚠ WHAT IS NOT SIZED IS STATED INSTEAD**: every other face in this census — the path shares, the
  shell shares, the cross table's cells, the substitution's direction, the menu composition and
  LN-C1's whole inherited table — is reported with its **own realised interval** and ⛔ no null is
  cut on it.
* **Scratch, out-of-band only** (canon, VERBATIM: *"verifier scratch walks use the stage's own
  consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"*):
  smoke **900,003,700–711** with its receipt at **900,003,720**; the **world pin** at
  **900,003,770**; **gLockstep** and **gLockstepTrace** at **900,003,790–791**; the scratch band
  **900,003,700–799** is this stage's. Every scratch seed walked is STORED in the artifact's `seeds`
  block.
* **⭐ RE-WALKS, NOT CONSUMPTION**: **12,546,000–011** (G-REPRO-LNC1) lie inside LN-C1's OWN
  already-consumed block and are declared re-walks. ⭐⭐ **They are walked with the TRACE OFF**, so
  the world is LN-C1's byte for byte.
* **Stats consumed: ZERO.** Registry **76**.

### §P.F THE GATES (all liveness/receipt — NEVER direction)

**X-DET** (the whole core run TWICE, digests byte-identical, `wallMs` the one named exclusion) ·
**X-FP-PROD** (the production fingerprint recomputed in-probe through the SHIPPED `League` /
`runHeadless` path; the baseline EXTRACTED from OBM-T1's own probe line, never re-typed) ·
**gSrcUntouched** (`git diff --stat HEAD` AND `git status --porcelain` over **`src/` AND `tests/`**,
all empty — canon: xSrcUntouched) · **gSeedDisjoint** · **gSeedsBookedEqualWalked** · **gN** ·
**gWorld** (§P.A) · **gDoseSource** · **gAnchoredConstants** · **gLedgerRead** · **gWalkFixtures** ·
**gReproducePTC0** · **gLockstep** · **gTwoFractions** · **gLoo** · **gFaces** (EVERY published
face, paired Δ, bin, median and partition re-derived off the **SERIALIZED** artifact) ·
**gReadWords** · **gHashOrder** (the body hash computed **LAST** off an explicit ALLOWLIST SCHEMA
that **INCLUDES `allGreen`**, with a NON-body `receipts.hashReproducesFromFile`) · **PLUS LN-C2's
OWN SIX**:

* **⭐⭐ gLockstepTrace** — traced ≡ untraced whole-match signature (rng stream state included) on
  the scratch lockstep seeds, BOTH arms, with the ledger non-empty on the traced walks and EMPTY on
  the untraced ones. A failure is a **BLOCKED** census, not a red gate.
* **⭐⭐ gTraceJoin** — the join share is stored and non-zero, and `targetAgreesShare` is **1.000000**
  on both arms (or the mismatch is explained and counted).
* **⭐⭐ gCodeFact** — the named anchors (the GC seat and `gcBodies`, the `sGc` subtraction, the
  shell's own lines, the perceived chooser's candidates / `scope` / substitution line / distance
  band, the ledger's ONE write site with `chosenGid` / `legacyGid` / `tick`, **and every strike site
  of the population**) AND the four whole-function text hashes.
* **⭐⭐ gFnTexts** — the four extractions found, non-empty, hashed and DISTINCT.
* **⭐⭐ gShellFixtures** — the SHIPPED `groundShellHazard` CALLED on hand-built geometries: a body
  exactly on the segment inside the shell FIRES; a body a shell-width off does NOT; the KICKER and
  the RECEIVER never fire; a body BEYOND the aim does not; own-only vs opp-only populations fire
  independently and their union is the combined call. Beside them, the PATH classes and the
  SUBSTITUTION-direction rule pinned branch by branch.
* **⭐⭐ gWorld's own additions** (§P.A) and **⭐⭐ G-REPRO-LNC1** — LN-C1's seeds 12,546,000–011
  RE-WALKED on E13 **with the trace OFF** and matched **FIELD FOR FIELD** against LN-C1's committed
  `perSeedCells[].E13` over every field the two instruments SHARE (the ONE excluded shared field is
  `wallMs`, a machine timing) · **gClassesNonVacuous** (⛔ no face on an empty class: both arms carry
  LEGACY-path passes, SUBSTITUTED passes, UNTRACED passes, traced caroms, LEGACY-path caroms, passes
  whose shell FIRED, passes whose shell was CLEAR, and SUBSTITUTED passes with a readable legacy
  lane).

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
list verbatim or stores none"* (**this artifact stores NONE, and its `honestLimitsNote` points at
THIS doc**) · *"an event attribution reads the engine's own record when one exists (`shotLog`, the
contest episodes, `lastTouch`); a heuristic is written only where no record exists, and says so"*.

## §DEV-PREFLIGHT — the sizing smoke, DISCLOSED in full (⚠ a DISCLOSURE block, not part of the frozen pair)

A **12-cluster scratch smoke** (`LNC2_MODE=smoke LNC2_N=12`, seeds **900,003,700–711**, receipt
900,003,720, world pin 900,003,770, lockstep 900,003,790–791, artifact off the canonical path under
`/tmp`) was run **BEFORE this freeze**. Its realised half-widths were read out of the smoke
artifact's own `faces[].halfWidth` fields — **never re-typed from the console's rounded print** —
and are hardcoded in the instrument's `SIZING_INPUTS`:

| face | realised hw (12 clusters) | target | N required | expected hw at N = 485 | MDE at N = 485 |
|---|---|---|---|---|---|
| `read.established.sShare` (E13) | 0.09452201933404941 | 0.05 | **88** | 0.014868006589105493 | 0.02125242494702542 |
| `read.established.fShare` (D13 — see below) | 0.2222222222222222 | 0.05 | **485** | 0.03495483367287175 | 0.04996466572141581 |

⇒ **max(nRequired) = 485**, the block affords **999** after the construction receipt, so
**N = min(485, 999) = 485 — BOUND BY THE SIZING**, and the unwalked tail is declared.

**Disclosed honestly:**

* ⚠⚠ **THE F ROW'S VARIANCE SOURCE IS THE D13 ARM, NOT E13, AND THAT IS A DEVIATION** (§DEVIATIONS
  1). On the 12-seed smoke E13's F read **0 of 11** LEGACY-path caroms, so every bootstrap draw was
  0 and its realised half-width was **0** — a DEGENERATE variance estimate that would size N to
  nothing. The instrument therefore takes the **larger, non-degenerate D13 half-width** (F = 3 of
  17 there) as the variance source for that row. It is the CONSERVATIVE choice (a bigger half-width
  demands a bigger N) and it is stated here, before the battery, in the row's own `face` label
  inside the artifact.
* The first smoke run went **RED on three gates**, all fixed before this freeze and all stated here
  so the record shows what moved and when: (a) **gN** — `N_FROZEN` still held its pre-sizing
  placeholder, which is exactly what the sizing conjunct is there to catch; (b) **gShellFixtures**
  and (c) **gWalkFixtures** — ONE fixture of the shell table asserted the WRONG expectation (a body
  a shell-width SHORT of the aim was written as "does not fire"; the shipped predicate fires on it,
  because "short of the aim" is precisely the firing condition and it is a body INSIDE a shell of
  the aim that does not). ⭐ **The engine was right and the fixture was wrong**: the fixture was
  rewritten into the two honest cases (just SHORT of the aim FIRES; INSIDE a shell of the aim does
  NOT) and the shipped function was not touched. After the fixes the same 12-cluster smoke ran
  **26/26 GREEN**, with `gFaces` at **1,965/1,965 face-and-Δ** and **145/145** stored-bin / median /
  partition / read-word / sizing checks, **147** anchored sites, **151** walk-side fixtures, **1,310**
  face rows and **G-REPRO-LNC1 at 1,248 field comparisons, 0 mismatches**.
* ⭐⭐ **THE BYTE-INERTNESS RECEIPT PASSED IN THE SMOKE**: on all 4 arm × scratch-seed pairs the
  traced and untraced whole-match signatures were IDENTICAL, while the ledger itself held 50 / 55 /
  60 / 65 rows on the traced walks and 0 on every untraced one.
* ⚠ **12 clusters is a NOISY variance estimate** — a strictly weaker assumption than sizing off a
  published battery. Said here, before the battery.
* ⚠ The smoke's own POINT readings are **UNPOWERED and bind nothing**. For the record, so nobody can
  claim the freeze was written after seeing a battery: on 12 scratch seeds the E13 arm read a join
  share of 0.688581 (597/867), a path split of legacy 0.335640 / legacy-no-option 0.018454 /
  substituted 0.352941 / untraced 0.311419, S 0.744186 (32/43) and F 0.000000 (0/11), and it printed
  **"THE CAROM COMES THROUGH THE PERCEIVED CHOOSER"** with **"THE DOSED WORLD AGREES ON THE READ"**.
  **None of these numbers is a finding**; the battery's own §R replaces every one of them, and a
  battery that printed a different sentence would be reported as-is.
* The smoke ALSO confirmed instrument liveness: both arms carried LEGACY, SUBSTITUTED and UNTRACED
  passes, traced caroms, LEGACY-path caroms, passes whose shell fired and passes whose shell was
  clear, and SUBSTITUTED passes with a readable legacy lane; `gLockstep` and `gLockstepTrace` were
  green on all 4 arm × scratch-seed walks each; the world pin held on both arms; X-DET's two digests
  were identical; and X-FP-PROD reproduced the production fingerprint.
* **This section binds nothing.** The freeze is §0–§P.F above.

## §R RESULTS (every number below QUOTES the artifact's own fields at 6 dp — the artifact is the numbers of record, per the #357 standing order)

**RUN RECEIPTS.** Freeze **`44be398`** (`stage.headAtRun` =
`44be398595ce321a39b8fd9e8fb8dabf74e2a2ee`).
`git diff 44be398..<results> -- scripts/probes/ln-c2-chooser-path-census.ts` is **EMPTY (0 bytes)**
— no frozen constant, no frozen definition and no frozen printed form moved after sight, and §P is
byte-identical. **`allGreen` = true** (a STORED boolean; **26** gate objects, every one carrying
`ok: true`); `gFaces` **1,965/1,965 face-and-Δ** checks and **145/145** stored-bin / median /
partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk. Artifact
`docs/world-model/data/ln-c2-chooser-path-census.json` (**6,457,797 bytes**), `instrumentSha256 =
df8ef2a981ca8a5a6bdc5526b23ad406ef115c3aac037d57326a006e88b8e40b`, `hashedBodySha256 =
ced7076a0b3f8b9483188974d3218ad48154b15ecafcfbfab293e2e9c9cb665a` over a **39**-key allowlist
schema, **file byte-hash
`b540856ed500acfa7ff40ae8ca5efe44ede0052179bf31db4c17250792a86558`**, and the NON-body
`receipts.hashReproducesFromFile` = **true**. Battery **485 seeds (12,547,000–12,547,484) × 2 ARMS ×
2 X-DET PASSES + the construction receipt at 12,547,999 ⇒ BOOKED = WALKED = 1,944 walks**, the two
X-DET digests IDENTICAL (`5aad5558901188fe…`); the **UNWALKED TAIL IS DECLARED**:
`seeds.unwalkedTail` = **[12547485, 12547998]**. **G-REPRO-LNC1: 1,248 field comparisons, 0
mismatches** against the committed LN-C1 artifact (file byte-hash `c462ddec94b15ead…`), walked with
the trace OFF, and the list of LN-C1 fields this census does not compute is **empty**. Scratch: the
sizing smoke on 900,003,700–711 (receipt 900,003,720), the world pin at 900,003,770, lockstep and
trace-lockstep on 900,003,790–791 — every one STORED in the `seeds` block. **ZERO stats consumed** —
registry **76**. `npx tsc --noEmit` **clean** with the probe in the tree, at both commits.
`npm run fingerprint` observed = **`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`**
— recomputed IN-PROBE by X-FP-PROD against OBM-T1's own extracted baseline, **UNCHANGED** (a census
cannot move it). Wall **294.282 s** (`perf.meanWallSecondsPerMatch` **0.120360**).

### §R1 THE CODE FACTS (functions quoted, hashes stored) AND THE LEDGER RECEIPTS

⭐⭐ **THE FOUR WHOLE-FUNCTION TEXT HASHES** — each extracted by an anchored start needle and an
anchored end needle, the start needle occurring exactly ONCE in its file (`gFnTexts` GREEN):

| function | file, lines | chars | sha256 |
|---|---|---|---|
| `groundCandidate` | `src/ai/PlayerBrain.ts` l.604–696 | 5476 | `93376095f609b2625d348de88d30f6202b580e69fbdf21ecd55f967f8aa50893` |
| `pricePassOption` | `src/ai/perceivedPassChoice.ts` l.165–237 | 2636 | `9d5213243efc782cac71c4195da429fd75bbe4bdc3143b349c853941f217939c` |
| `choosePerceivedPassTarget` | `src/ai/perceivedPassChoice.ts` l.245–285 | 1701 | `cd9cf3f41868a7fc2521e0c5daac38bb328603369c1e75d018083d70acc99ff3` |
| `groundShellHazard` | `src/ai/deliveryValueSeat.ts` l.548–568 | 616 | `3bf7938f8f19fa747881b4cf22514e649408c44b5eed0bce9376b64415062d12` |

⭐⭐ **THE STORED CODE-FACT BOOLEANS** (`codeFact.facts`, every one derived from the WHOLE text
above, ⚠ **CODE READS, NOT MEASUREMENTS**): `groundCandidateReadsOwnBodiesThroughTheShell` = **true**
· `groundCandidateGradedLaneTestIsOpponentOnly` = **true** ·
`groundShellHazardIteratesEverySideItIsHanded` = **true** ·
`groundShellHazardShellIsCoreRadiusPlusBallRadius` = **true** · `pricePassOptionHasNoLaneTerm` =
**true** ⛔ WITHDRAWN at ruling #392 (§COMMANDER CORRECTIONS item 1 — the pricer's READ branch prices
`interceptionThreatSeconds`, an opponent corridor read reached through `evaluatePassOption`) ·
`pricePassOptionHasNoOwnBodyTerm` = **true** (stands — verified two calls deep) ·
`choosePerceivedPassTargetHasNoLaneTerm` = **true** ⛔ WITHDRAWN likewise ·
`choosePerceivedPassTargetHasNoOwnBodyTerm` = **true** (stands).

**WHAT `groundCandidate` READS — its whole price chain, quoted** (the percepts, the score line and
the three subtractions; the hash above covers the entire function):

```ts
      const lane = Math.min(
        1,
        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),
      );
      const open = opennessAt(aim, opp.players);
      …
      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;
      …
      const sDv = dvSeat === null ? s
        : s - deliveryRiskPrice(dvSeat, p.pos, aim, opp.players, team.localX(aim.x), W.passBase);
      const sGc = gcSeat === null ? sDv
        : sDv - gcSeat.exposureWeight * groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);
      const sRa = raSeat === null ? sGc
        : sGc - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;
      return { s: sRa, lane, open, gain, mul };
```

with the body set built once per decision, ABOVE the function (anchored):

```ts
  const gcBodies: readonly (readonly Player[])[] =
    gcSeat === null ? [] : [team.players, opp.players];
```

⇒ **IT DOES READ OUR OWN BODIES — through the shell, and only through the shell.** Its GRADED lane
percept (`laneOpenness`) and its openness percept (`opennessAt`) are opponent-only; its own-body
term is the BINARY `groundShellHazard` over BOTH teams, priced at `gcSeat.exposureWeight`.

**WHAT `groundShellHazard` DOES — quoted in full** (`deliveryValueSeat.ts` l.548–568):

```ts
export function groundShellHazard(
  from: Readonly<V2>,
  aim: Readonly<V2>,
  players: readonly (readonly Player[])[],
  kickerGid: number,
  receiverGid: number,
): number {
  const d = dist(from as V2, aim as V2);
  for (const side of players) {
    for (const o of side) {
      if (o.sentOff) continue;
      if (o.gid === kickerGid) continue;
      if (o.gid === receiverGid) continue;
      const cp = closestPointOnSegment(from as V2, aim as V2, o.pos);
      const shell = o.coreRadius + BALL_RADIUS;
      if (dist(cp, o.pos) < shell && dist(from as V2, cp) < d - shell) return 1;
    }
  }
  return 0;
}
```

It iterates **every collection it is handed** (which is why the own-only and opponent-only calls are
the same function on a narrowed population), it is **binary**, it has **no 1.5 m clear-the-kicker
guard**, and its half-width is `o.coreRadius + BALL_RADIUS`. The `coreRadius` getter, anchored and
quoted (`src/sim/Player.ts`):

```ts
  get coreRadius(): number {
    return PLAYER_CORE_RADIUS;
  }
```

⇒ the shell of record on this world is `theShell.shellMetres` **0.635** m (`ballRadius` **0.11** +
`playerCoreRadius` **0.525**), and the price it is multiplied by is `theShell.dvExposureWeightRead`
**0.5** — **READ off the constructed match's effective genome**, not typed (it equals
`theShell.dvExposureWeightPinnedByTheWorld`, the anchored `CORRIDOR_WORLD_WEIGHT`).

**WHAT `pricePassOption` READS — its three returns, quoted** (the whole price, all of it):

```ts
    const row = OPTION_SPACE_PRIOR_MARGINAL;
    const reception = row.reachedRate * row.cleanGivenReached;
    const value = valueAxis ? ATTEMPT_VALUE_MARGINAL.shotRate : 1;
    …  infoClass: 'UNSEEN',  price: valueAxis ? value : reception,  executable: false,
    …
    const row = optionSpacePriorAt(distance);
    const reception = row.reachedRate * row.cleanGivenReached;
    …  infoClass: 'SEEN-UNREAD',  price: valueAxis ? value : reception,  executable: true,
    …
  const reception = threatQuintilePrice(read.interceptionThreatSeconds);
  const band = threatBandIndex(read.interceptionThreatSeconds);
  const value = valueAxis ? attemptValueAt(cell, band) : 1;
    …  infoClass: 'READ',  price: valueAxis ? value : reception,  executable: true,
```

⇒ a distance-band prior, a threat-quintile reception rate and (with the value axis) a zone attempt
value. **NO own-body term appears in its 2636 characters or in the two calls beneath them** (the
verifier's read: `passOptionValue.ts` skips same-side bodies and `passCorridorInterception.ts` reads
`defender.side !== passer.side`; the one same-side loop in `passAffordance.ts` feeds a field the
price never reads) — the stored `pricePassOptionHasNoOwnBodyTerm` STANDS. ⛔ The lane half is
WITHDRAWN: the READ branch's `threatQuintilePrice(read.interceptionThreatSeconds)` IS a corridor term
— `interceptionThreatSeconds` is the best-placed opponent's slack along the flight, marched tick by
tick down the segment (`passCorridorInterception.ts`). A whole-function hash pins a text; it cannot
see through a call (§COMMANDER CORRECTIONS item 1).

**WHAT `choosePerceivedPassTarget` DOES — its argmax, quoted**:

```ts
  const options = candidateGids.map((targetGid) => pricePassOption({
    snapshot, passerGid, targetGid, attackDir, reachProfiles, valueAxis,
  }));
  const executable = options.filter((option) => option.executable);
  if (executable.length === 0) return null;
  const best = executable.reduce((winner, option) => (
    option.price > winner.price
      || (option.price === winner.price && option.targetGid < winner.targetGid)
      ? option : winner));
```

and the substitution itself, in `PlayerBrain.decideOnBall` (anchored):

```ts
    const candidateGids = passChoiceCandidateGids(p, team.players);
    const scope = new Set<number>([p.gid, ...candidateGids]);
    for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);
    …
    if (chosen) passMate = chosen;
```

⇒ the pricer's whole world is **the passer, the candidates and the opponents**; a non-candidate
teammate — the man standing in the lane — is not in the scope at all, and the band that defines a
candidate is the anchored `PASS_CHOICE_MIN_METRES` 6 m / `PASS_CHOICE_MAX_METRES` 30 m.

**⭐⭐ THE LEDGER IS BYTE-INERT (`gLockstepTrace`).** On all **4** arm × scratch-seed pairs the
traced and untraced whole-match signatures are IDENTICAL, while the ledger itself held **50 / 55 /
60 / 65** rows on the traced walks and **0** on every untraced one. The census is therefore reading
a LEDGER, not a heuristic.

**⭐⭐ THE JOIN, AND THE RECEIPT ON IT:**

| face | E13 | E13 counts | D13 | Δ (D13 − E13), 95 % paired CI |
|---|---|---|---|---|
| `trace.established.joinShare` | **0.690566** | 24,917 / 36,082 | **0.704441** | +0.013875 [+0.008160, +0.020126] |
| ⭐⭐ `trace.established.targetAgreesShare` | **1.000000** | 24,917 / 24,917 | **1.000000** | 28,439 / 28,439 |
| `trace.established.noOptionShare` | 0.030782 | 767 / 24,917 | 0.028447 | 809 / 28,439 |
| `aim.established.recordShare` | **0.577518** | 20,838 / 36,082 | 0.577048 | 23,296 / 40,371 |
| ⛔ `aim.established.bodyFallbackShare` (DECLARED) | **0.422482** | 15,244 / 36,082 | 0.422952 | 17,075 / 40,371 |
| `trace.rowsWrittenPerMatch` (receipt) | 51.756701 | den 485 | 59.338144 | den 485 |

⭐⭐ **THE STRUCK TARGET IS THE LEDGER'S OWN OUTCOME ON EVERY JOINED PASS** — `targetAgreesShare` is
**1.000000** on both arms (24,917 of 24,917 · 28,439 of 28,439), so the path class is not an
inference: it is the engine's own record of who was picked. ⚠ The aim of record covers
`aim.established.recordShare` **0.577518** of passes (the ARM class's wind-up record plus the
synchronous strikes that carried a `dxStrikeAim` lead); the remaining **0.422482** are the DECLARED
`aim.bodyFallback` class, read at the target's own position exactly as LN-C1 read it.

### §R2 THE PATH CLASSES, AND P(carom | path)

| face (E13, established) | E13 | E13 counts | D13 | D13 counts |
|---|---|---|---|---|
| ⭐⭐ `path.established.legacy.passShare` | **0.321989** | 11,618 / 36,082 | 0.310371 | 12,530 / 40,371 |
| — of which `legacyChosen` | 0.300732 | 10,851 / 36,082 | 0.290332 | 11,721 / 40,371 |
| — of which `legacyNoOption` | 0.021257 | 767 / 36,082 | 0.020039 | 809 / 40,371 |
| ⭐⭐ `path.established.substituted.passShare` | **0.368577** | 13,299 / 36,082 | **0.394070** | 15,909 / 40,371 |
| ⛔ `path.established.untraced.passShare` | **0.309434** | 11,165 / 36,082 | 0.295559 | 11,932 / 40,371 |
| `path.established.traced.passShare` | 0.690566 | 24,917 / 36,082 | 0.704441 | 28,439 / 40,371 |

**THE SAME PATHS OVER THE CAROMS** (first body = own non-target), and the carom rate INSIDE each:

| face (E13, established) | share of caroms | counts | P(carom \| path) | counts |
|---|---|---|---|---|
| `path.*.legacy` | **0.151802** | 577 / 3,801 | **0.049664** | 577 / 11,618 |
| — `legacyChosen` | 0.136017 | 517 / 3,801 | 0.047645 | 517 / 10,851 |
| — `legacyNoOption` | 0.015785 | 60 / 3,801 | 0.078227 | 60 / 767 |
| ⭐⭐ `path.*.substituted` | **0.320968** | 1,220 / 3,801 | **0.091736** | 1,220 / 13,299 |
| ⛔ `path.*.untraced` | **0.527230** | 2,004 / 3,801 | **0.179489** | 2,004 / 11,165 |
| `path.*.traced` | 0.472770 | 1,797 / 3,801 | 0.072119 | 1,797 / 24,917 |

⭐⭐ **THE PERCEIVED CHOOSER PICKS THE MAN ON MORE THAN A THIRD OF THE PASSES, AND THOSE PASSES CAROM
NEARLY TWICE AS OFTEN AS THE LANE ARGMAX'S OWN** — `path.established.substituted.passShare`
**0.368577** (13,299 of 36,082) against a substituted carom rate of **0.091736** (1,220 of 13,299)
versus the LEGACY path's **0.049664** (577 of 11,618) — a stated derivation of the ratio:
0.091736 ÷ 0.049664 = 1.847. ⛔ **AND THE LARGEST OF THE THREE STORED CAROM SHARES IS NEITHER** (0.527230
UNTRACED > 0.320968 SUBSTITUTED > 0.151802 LEGACY on E13; 0.461816 > 0.368679 > 0.169505 on D13 — a
stated comparison of stored faces, §COMMANDER CORRECTIONS item 8): the UNTRACED
class is 0.309434 of the passes but **0.527230 of the caroms** (2,004 of 3,801), at a carom rate of
0.179489 — these are the cutbacks, the through balls, the kickoff play-backs and the keeper's own
deliveries, which never enter the perceived chooser at all. They are COUNTED, never imputed, and
they are printed beside every read sentence. `path.*.geometryShare` is **1.000000** on every path of
both arms, so no path loses a pass to a missing choice geometry.

### §R3 THE SHELL BY PATH, AND P(carom | shell, path)

| face (established) | E13 | E13 counts | D13 | Δ (D13 − E13), 95 % paired CI |
|---|---|---|---|---|
| `shell.*.legacy.firedShare` | **0.014374** | 167 / 11,618 | 0.017318 | +0.002944 [−0.000055, +0.005921] · **CONTAINS ZERO** |
| `shell.*.legacy.ownOnlyShare` | 0.003959 | 46 / 11,618 | 0.005746 | +0.001787 [−0.000046, +0.003557] · **CONTAINS ZERO** |
| `shell.*.legacy.oppOnlyShare` | 0.010759 | 125 / 11,618 | 0.012690 | +0.001930 [−0.000645, +0.004520] · **CONTAINS ZERO** |
| ⭐⭐ `shell.*.legacy.firedShareOnCaroms` (**= F**) | **0.046794** | 27 / 577 | 0.062405 | +0.015611 [−0.009882, +0.040845] · **CONTAINS ZERO** |
| `shell.*.legacy.caromGivenShellFired` | 0.161677 | 27 / 167 | 0.188940 | +0.027263 [−0.047786, +0.101035] · **CONTAINS ZERO** |
| `shell.*.legacy.caromGivenShellClear` | 0.048031 | 550 / 11,451 | 0.050028 | +0.001998 [−0.003760, +0.008071] · **CONTAINS ZERO** |
| ⭐⭐ `shell.*.substituted.firedShare` | **0.344312** | 4,579 / 13,299 | 0.399145 | +0.054834 [+0.043859, +0.065426] |
| `shell.*.substituted.ownOnlyShare` | 0.089180 | 1,186 / 13,299 | 0.107989 | +0.018810 [+0.011898, +0.025317] |
| `shell.*.substituted.oppOnlyShare` | 0.284382 | 3,782 / 13,299 | 0.331510 | +0.047128 [+0.036618, +0.057584] |
| ⭐⭐ `shell.*.substituted.firedShareOnCaroms` | **0.559836** | 683 / 1,220 | 0.655703 | +0.095867 [+0.058666, +0.134905] |
| `shell.*.substituted.caromGivenShellFired` | **0.149159** | 683 / 4,579 | 0.147559 | −0.001600 [−0.014484, +0.011513] · **CONTAINS ZERO** |
| `shell.*.substituted.caromGivenShellClear` | 0.061583 | 537 / 8,720 | 0.051470 | −0.010113 [−0.017535, −0.003217] |
| ⛔ `shell.*.untraced.firedShare` | 0.336677 | 3,759 / 11,165 | 0.348475 | +0.011798 [+0.000637, +0.023684] |
| ⛔ `shell.*.untraced.firedShareOnCaroms` | **0.789421** | 1,582 / 2,004 | 0.827933 | +0.038512 [+0.014832, +0.062767] |
| ⛔ `shell.*.untraced.caromGivenShellFired` | **0.420857** | 1,582 / 3,759 | 0.356421 | −0.064435 [−0.082724, −0.046076] |
| ⛔ `shell.*.untraced.ownOnlyShare` | 0.214420 | 2,394 / 11,165 | 0.187311 | −0.027109 [−0.035761, −0.018179] |

⭐⭐ **ON THE PATH THE SHELL ACTUALLY PRICES, IT ALMOST NEVER FIRES — AND ALMOST NEVER FIRES ON ITS
CAROMS.** The LEGACY path's `firedShare` is **0.014374** (167 of 11,618) and F, the share of its
CAROMS whose struck lane had the shell firing, is **0.046794** (27 of 577). That is what the pricer
being obeyed looks like: a candidate whose shell fires pays 0.5 and loses the argmax, so the lanes
that survive it are shell-clear by construction. ⭐ On the SUBSTITUTED path — where the shell's
price bought nothing, because the target was replaced afterwards — the shell fires on **0.344312**
of passes and on **0.559836** of that path's caroms. And the shell that fires there is more often
THEIRS than OURS (`oppOnlyShare` 0.284382 against `ownOnlyShare` 0.089180 — two stored values,
stated side by side). ⛔ On the UNTRACED class the shell fires on **0.789421** of the caroms and
`caromGivenShellFired` is **0.420857**: a fired shell on a lane nobody priced predicts a carom two
of five times.

### §R4 OWN-OPENNESS × SHELL × PATH, AND THE SUBSTITUTION'S DIRECTION

**THE CROSS TABLE (E13, established classes)** — the three own-openness cells on the anchored 0.4
gate, crossed with `shellFired`; each cell carries its share of the path's passes and its own carom
rate:

| path | own-openness cell | shell | share of the path | counts | P(carom \| cell) | counts |
|---|---|---|---|---|---|---|
| LEGACY | [0.0, 0.1) | 0 | 0.000172 | 2 / 11,618 | 0.000000 | 0 / 2 |
| LEGACY | [0.0, 0.1) | 1 | 0.001033 | 12 / 11,618 | 0.500000 | 6 / 12 |
| LEGACY | [0.1, 0.4) | 0 | **0.060079** | 698 / 11,618 | **0.352436** | 246 / 698 |
| LEGACY | [0.1, 0.4) | 1 | 0.003271 | 38 / 11,618 | 0.447368 | 17 / 38 |
| LEGACY | [0.4, 1.0] | 0 | 0.925374 | 10,751 / 11,618 | 0.028276 | 304 / 10,751 |
| LEGACY | [0.4, 1.0] | 1 | 0.010071 | 117 / 11,618 | 0.034188 | 4 / 117 |
| SUBSTITUTED | [0.0, 0.1) | 0 | 0.000000 | 0 / 13,299 | — | 0 / 0 |
| SUBSTITUTED | [0.0, 0.1) | 1 | **0.045342** | 603 / 13,299 | **0.446103** | 269 / 603 |
| SUBSTITUTED | [0.1, 0.4) | 0 | 0.059102 | 786 / 13,299 | 0.309160 | 243 / 786 |
| SUBSTITUTED | [0.1, 0.4) | 1 | 0.066321 | 882 / 13,299 | 0.274376 | 242 / 882 |
| SUBSTITUTED | [0.4, 1.0] | 0 | 0.596586 | 7,934 / 13,299 | 0.037056 | 294 / 7,934 |
| SUBSTITUTED | [0.4, 1.0] | 1 | 0.232649 | 3,094 / 13,299 | 0.055591 | 172 / 3,094 |
| UNTRACED | [0.0, 0.1) | 0 | 0.000000 | 0 / 11,165 | — | 0 / 0 |
| UNTRACED | [0.0, 0.1) | 1 | 0.133632 | 1,492 / 11,165 | **0.813673** | 1,214 / 1,492 |
| UNTRACED | [0.1, 0.4) | 0 | 0.090461 | 1,010 / 11,165 | 0.240594 | 243 / 1,010 |
| UNTRACED | [0.1, 0.4) | 1 | 0.044693 | 499 / 11,165 | 0.352705 | 176 / 499 |
| UNTRACED | [0.4, 1.0] | 0 | 0.572862 | 6,396 / 11,165 | 0.027986 | 179 / 6,396 |
| UNTRACED | [0.4, 1.0] | 1 | 0.158352 | 1,768 / 11,165 | 0.108597 | 192 / 1,768 |

⭐⭐ **THE SEAM THE SHELL CANNOT SEE HAS A NAME AND A SIZE: THE [0.1, 0.4) SHELL-CLEAR CELL.** On the
LEGACY path it holds `cell.legacy.b01to04.shell0.share` **0.060079** of the path's passes (698 of
11,618) and caroms at **0.352436** (246 of 698) — a body between the shell's edge and the chooser's
own 0.4 gate, invisible to both terms, and one pass in three of that cell hits him. On the
SUBSTITUTED path the same shell-clear cell holds 786 passes and caroms at 0.309160. ⛔ The doc
asserts nothing about the cells it has not named: no monotonicity boolean was frozen. The bottom
LEGACY cell ([0.0, 0.1), shell 0) holds **2** passes — a body ON the line with the shell clear is
what the shell is for, and it is nearly empty by construction.

**THE OWN-OPENNESS LEVELS BY PATH** (the struck lane, at the choice):

| face (E13, established) | E13 | E13 den | D13 | Δ, 95 % paired CI |
|---|---|---|---|---|
| `open.*.legacy.ownOpennessMean` | **0.901756** | 11,618 | 0.887935 | −0.013822 [−0.019707, −0.008067] |
| `open.*.substituted.ownOpennessMean` | **0.795445** | 13,299 | 0.769208 | −0.026237 [−0.033322, −0.018812] |
| `open.*.untraced.ownOpennessMean` | 0.701284 | 11,165 | 0.713961 | +0.012677 [+0.004053, +0.021414] |
| `open.*.legacy.ownOpenBelow40Share` | **0.064555** | 750 / 11,618 | 0.077095 | +0.012540 [+0.005574, +0.019118] |
| `open.*.substituted.ownOpenBelow40Share` | **0.170765** | 2,271 / 13,299 | 0.201584 | +0.030819 [+0.022644, +0.038820] |
| `open.*.untraced.ownOpenBelow40Share` | 0.268786 | 3,001 / 11,165 | 0.255867 | −0.012920 [−0.023529, −0.002425] |

⭐⭐ **THE LANE ARGMAX PICKS THE CLEANER LANE OF THE TWO** — own-openness mean 0.901756 on LEGACY
against 0.795445 on SUBSTITUTED, and it strikes below the 0.4 gate on 0.064555 of its passes against
0.170765 (four stored values, stated side by side).

**⭐⭐ THE SUBSTITUTION'S DIRECTION** (SUBSTITUTED passes only; the legacy lane is a DECLARED
reconstruction and `substitution.established.legacyLaneReadableShare` is **1.000000**, 13,299 of
13,299):

| face (established) | E13 | E13 counts | D13 | Δ, 95 % paired CI |
|---|---|---|---|---|
| ⭐⭐ `substitution.*.intoShare` | **0.152493** | 2,028 / 13,299 | 0.179521 | +0.027028 [+0.019106, +0.034110] |
| `substitution.*.outOfShare` | **0.071284** | 948 / 13,299 | 0.072600 | +0.001317 [−0.004129, +0.006841] · **CONTAINS ZERO** |
| `substitution.*.neitherShare` | 0.776224 | 10,323 / 13,299 | 0.747879 | −0.028345 [−0.037585, −0.018769] |
| `substitution.*.noLegacyLaneShare` | 0.000000 | 0 / 13,299 | 0.000000 | degenerate |
| `substitution.*.shellFiredLegacyShare` | 0.061960 | 824 / 13,299 | 0.093092 | +0.031132 [+0.025187, +0.037331] |
| `substitution.*.legacyOwnOpenBelow40Share` | 0.089556 | 1,191 / 13,299 | 0.094663 | +0.005108 [−0.000887, +0.011311] · **CONTAINS ZERO** |

⭐⭐ **THE SUBSTITUTION MOVES THE BALL INTO OUR OWN BODY'S LANE MORE THAN TWICE AS OFTEN AS IT MOVES
IT OUT OF ONE** — `intoShare` **0.152493** (2,028) against `outOfShare` **0.071284** (948) on the
same 13,299 substituted passes (a stated derivation of the ratio: 0.152493 ÷ 0.071284 = 2.139).
⚠ On 0.776224 of them the two lanes are on the same side of the gate and the substitution moves
nothing about own-body exposure at all.

### §R5 THE MENU COMPOSITION, AND THE OPPONENTS BESIDE

| face (E13, established, per TRACED pass) | LEGACY | SUBSTITUTED | TRACED (pooled) |
|---|---|---|---|
| `menu.*.candidatesPerPass` | 3.202789 | 3.258365 | 3.232452 |
| `menu.*.readPerPass` | 2.642193 | 2.879991 | 2.769113 |
| `menu.*.seenUnreadPerPass` | 0.002668 | 0.002632 | 0.002649 |
| `menu.*.unseenPerPass` | 0.417197 | 0.375743 | 0.395072 |
| `menu.*.blindOutpricesReadShare` | 0.060940 | 0.105121 | 0.084521 |

(the denominators are the paths' own traced passes: 11,618 · 13,299 · 24,917 on E13). The ledger's
`chosenGid === -1` rate over traced passes is `trace.established.noOptionShare` **0.030782** (767 of
24,917). ⭐ **THE MENU IS SMALL AND MOSTLY READ**: `menu.established.traced.candidatesPerPass`
**3.232452** candidates per decision, of which `readPerPass` **2.769113** carry a corridor READ and
`unseenPerPass` **0.395072** are UNSEEN; a blind option out-prices the read field on
`blindOutpricesReadShare` **0.084521** of traced decisions.

**LN-C1's OWN TABLE, RE-MEASURED HERE AT N = 485 AND NOT RE-READ** (LN-C1 remains their home; they
are published because the walker is inherited whole and because G-REPRO-LNC1 compares field for
field): `choice.established.ownOpennessMean` 0.799767 · `choice.established.opponentOpennessMean`
0.622415 · `choice.established.ownOpenBelow40Share` 0.167618 · `choice.established.caromShare`
0.105343 · `read.established.cBlockedShare` 0.699027 (2,657 / 3,801) · `read.established.aShare`
0.942793 (2,505 / 2,657) · `carom.established.presence.presentAtChoice` 0.680610 ·
`choice.established.opponentFirstShare` 0.319993 · `opponent.established.below40FirstShare`
0.536866 (all E13). ⛔ **This census reads none of them.**

### §R6 THE READS, PRINTED

Selected on the **E13** arm's STORED booleans by the frozen §P.C rule, from the frozen §0 literals,
and re-derived off the serialized artifact by `gReadWords`:

> **"THE CAROM COMES THROUGH THE PERCEIVED CHOOSER — the own-body seam belongs in the perceived
> pricer; LN-T2 is re-formed there."**

> **"THE DOSED WORLD AGREES ON THE READ"**

**THE STORED SELECTORS** (E13, `established`): `sGreaterThanHalf` = **true**
(`read.established.sShare` **0.678909**, 1,220 of 1,797, 95 % CI [0.655072, 0.701209], half-width
0.023068) and `fGreaterThanHalf` = **false** (`read.established.fShare` **0.046794**, 27 of 577,
95 % CI [0.031746, 0.063652], half-width 0.015953) ⇒ `readKey` = `perceivedChooser`. **THE UNTRACED
CLASS, BESIDE THE SENTENCE**: `untracedShareOfAllCaroms` = **0.527230** (2,004 of 3,801) on E13 and
**0.461816** (1,790 of 3,876) on D13 — ⛔ **more than half the caroms of record are on passes this
ledger never saw**, and the sentence above is a statement about the traced half.

**THE COUNTERFACTUAL WORDS — the SAME frozen rule applied to each arm and each established class
taken alone, every one STORED**: E13 `established` → `perceivedChooser` (S 0.678909 / F 0.046794);
E13 `arm` → `perceivedChooser` (0.677505 / 0.049383); E13 `release` → `perceivedChooser` (0.686207 /
0.032967); D13 `established` → `perceivedChooser` (0.685043 / 0.062405); D13 `arm` →
`perceivedChooser` (0.677089 / 0.061620); D13 `release` → `perceivedChooser` (0.727829 / 0.067416).
`reads.dosedAgreesOnTheRead` = **true**. ⚠ The UNTRACED share of caroms differs sharply BETWEEN the
two choice-tick classes and both are stored: `read.arm.untracedShareOfAllCaroms` **0.061059** (98 of
1,605) against `read.release.untracedShareOfAllCaroms` **0.867942** (1,906 of 2,196) on E13 — the
untraced strikes are overwhelmingly synchronous ones (the cutback, the through ball, the play-back).

**THE LOO RECEIPT, SCOPED TO THE ROWS IT COVERS.** Each of the **12** stored read-bearing rows (both
shares × both arms × three scopes) carries **0 flips** of the frozen `> 0.5` selector under
leave-one-out. The largest influence share of the twelve is **0.325926**, at `read.release.fShare`
on E13 (point 0.032967, leave-one-out range [0.022222, 0.033708]) — a row whose denominator is 91
and which sits far from its bar; the read-of-record row `read.established.sShare` on E13 moves over
[0.677293, 0.680649] at an influence share of 0.002562. ⚠ A RECEIPT — it gates no direction, and it
says nothing about any face outside those twelve rows.

### §R7 在说人话的层面

这一步问的是：**球撞到自己人的时候，那个接球人是谁选的**。答案是引擎自己的流水账写的，不是推断的
（每一笔都对得上：`targetAgreesShare` 1.000000）。

* **三分之一多的传球，接球人是「感知选人」那套换掉的**（0.368577）。这些球撞自己人的概率是走廊评分
  自己选的那些的近两倍（0.091736 对 0.049664）。
* **走廊评分自己选的那些球，贴线壳几乎从不响**（0.014374），撞上自己人的那些里也几乎不响
  （F = 0.046794）。这不是壳失灵，恰恰是壳**被听进去了**：一条壳会响的线要扣 0.5 分，基本赢不了
  评分，所以能活下来的线本来就是壳干净的。
* **换人的那一下，把球换进「自己人挡着」的线，是换出来的两倍多**（0.152493 对 0.071284）——而那套
  定价里**有**走廊——它逐帧算对手能不能先到——但**没有自己人这一项**（整函数哈希钉的是文本，看不穿函数
  调用；这句原来写成「没有走廊」，在 §COMMANDER CORRECTIONS 1 改正）。
* ⛔ 但**一半以上的撞击根本不在这本账里**（0.527230）：倒三角、直塞、开球回敲、门将出球都不走「感知
  选人」这道门。这句结论只覆盖账上的那一半，**这一点印在每一句读数旁边**。

所以印出来的那句话是：**这个撞击是从「感知选人」那条路来的——自己人的价格该装在那套定价里**。
⚠ 还有一个没被任何一条路盖住的洞：**离线 0.6–1.6 米那一档**（壳看不见、分级测试也不数自己人），在
走廊评分自己选的线里占 0.060079，而那一档里三次有一次撞上自己人（0.352436）。⛔ 这一步什么都没改、
什么都没上线；装在哪、怎么装，是指挥官的事。

## §HONEST LIMITS

1. **⛔⛔ THIS CENSUS NAMES WHERE A SEAM BELONGS; IT DOES NOT BUILD ONE.** It measures a ledger, a
   geometry and a shipped predicate at a tick under a §P THIS EXECUTOR FROZE. Nothing here is armed
   and nothing ships.
2. **⛔⛔ THE READ COVERS THE TRACED HALF OF THE CAROMS ONLY.** `untracedShareOfAllCaroms`
   **0.527230** on E13: the cutback (which keeps its own machinery and is never substituted), the
   through ball, the kickoff play-back and the keeper's deliveries never enter the perceived
   chooser, and they carry MORE than half of the caroms of record. The frozen rule was written on
   the traced class by #391 item 4(vii) and the census obeys it, printing the untraced share beside
   every sentence — but a reader who wants "where does the whole carom population come from" must
   read §R2's untraced row, not the sentence.
3. **⭐⭐ `shellFired` IS THE SHIPPED PREDICATE AT A TICK, NOT "WHAT THE CHOOSER PAID".** The census
   calls `groundShellHazard` on the STRUCK lane at the choice. The chooser evaluated it on EVERY
   candidate at ITS own aim (to-feet AND led), and the argmax that followed is not reproduced here.
   A low F is therefore consistent with the shell working exactly as designed — it is not evidence
   that the shell never fires anywhere.
4. **⭐⭐ THE LEGACY LANE IS A DECLARED RECONSTRUCTION.** The lane argmax's own aim is recorded
   NOWHERE, so `shellFiredLegacy` and the substitution's direction read `passer.pos → legacyGid`'s
   BODY position at the choice. Where the argmax's winning candidate was a LED one, its true aim was
   not that point.
5. **⚠ THE AIM OF RECORD COVERS 0.577518 OF PASSES.** The rest fall to the DECLARED
   `aim.bodyFallback` class (LN-C1's inherited rule). LN-C1 §CORR 3 measured the fallback's cost as
   small in frequency and large in metres; this census counts the class instead of assuming it away,
   but it does not correct it.
6. **⚠ THE OWN-OPENNESS IS LN-C1's DECLARED RECONSTRUCTION**, inherited whole: the SHIPPED
   `laneOpenness` CALLED with a population the chooser is never handed. No quantity in the engine
   corresponds to it.
7. **⚠ THE PATH CLASS IS ABOUT WHO WAS CHOSEN, NOT ABOUT WHY.** `substituted` says the perceived
   pricer's winner differed from the lane argmax's; it does not say the substitution CAUSED the
   carom. The carom rates by path are conditional probabilities, not causal contrasts. ⛔ No null is
   cut anywhere: an interval containing zero reads *"unresolved at this power"*.
8. **⚠ N = 485 WAS SIZED ON TWO SHARES ONLY** (`sShare` and `fShare`), and the F row's variance came
   from the D13 arm because E13's was degenerate at 12 clusters (§DEVIATIONS 1). Every other face —
   every cross-table cell, the menu composition, the substitution's direction — carries its own
   realised interval and no null is cut on it.
9. **⚠ THE MENU FACES ARE THE LEDGER'S OWN COUNTS**, not a re-pricing: `read` / `seenUnread` /
   `unseen` are the `infoClass` composition the chooser recorded, and `blindOutpricesRead` is its
   own flag. The census does not re-run `pricePassOption` anywhere.
10. **⚠ THE CODE FACTS ARE CODE READS AT ONE COMMIT.** The four hashes pin the exact text the
    booleans were derived from; a later commit that edits those functions invalidates the booleans
    and the hashes are how a reader detects it.
11. **⚠ BOTH SIDES ARE POOLED**; no face is per-side, and one flight is tracked at a time (PT-C0's
    inherited idiom — overlapping deliveries are under-counted, no flight is lost).
12. **⛔ THIS SAYS NOTHING ABOUT THE AUDIT'S ⑤.** `inSnapshotLaw` is OFF here and is asserted OFF.
    Whether the perceived chooser's snapshot is HONEST is the last cut in the ratified order and is
    untouched; this census only asks WHICH pricer picked the man.
13. **⛔ A CENSUS DOES NOT ADJUDICATE.** Whether LN-T2 is re-formed inside the perceived pricer, or
    the shell's weight, or a graded lane term, or the untraced family's own question first, is the
    commander's — with the frozen sentence, §R3's F, §R4's [0.1, 0.4) shell-clear cell and §R2's
    untraced row in front of him.

## §DEVIATIONS

1. **THE F ROW'S SIZING VARIANCE CAME FROM THE D13 ARM** (§DEV-PREFLIGHT): E13's realised
   half-width on `read.established.fShare` was **0** at 12 clusters (0 of 11 legacy caroms), a
   degenerate estimate. The larger, non-degenerate D13 half-width was used instead — the
   CONSERVATIVE direction — and the substitution is written into the sizing row's own `face` label
   inside the artifact. Declared BEFORE the battery.
2. **THE UNTRACED CLASS IS NOT ONE THING.** #391 item 4(ii) names four reasons a pass carries no
   row (the cutback, the keeper, a forced target, a decision that never ran the EDS block). This
   census counts the CLASS; it does not split it by reason, because the ledger records only the rows
   that exist. The through ball and the kickoff play-back are anchored as strike sites, so the
   reasons are documented in code even where the counts are pooled.
3. **THE LEGACY LANE'S SHELL AND OPENNESS ARE READ AT THE LEGACY BODY'S POSITION**, not at the
   argmax's aim (HONEST LIMIT 4) — a declared reconstruction, with its readability receipt
   (`legacyLaneReadableShare` 1.000000).
4. **LN-C1's CHOICE READ IS KEPT UNCHANGED BESIDE LN-C2's.** For a RELEASE-class strike carrying a
   `dxStrikeAim` lead, LN-C1's inherited rule reads the target's BODY and this census reads the
   STRIKE'S OWN AIM. Both are computed and stored: LN-C1's fields feed G-REPRO-LNC1 (so the
   comparison is like with like, 1,248 fields, 0 mismatches) and LN-C2's own faces use the aim of
   record. The two differ only on that class.
5. **THE `none` CHOICE-TICK CLASS IS STRUCTURALLY EMPTY** (LN-C1 §CORR 4, inherited): it is reported
   as a receipt, not a measurement.
6. **THE CROSS TABLE IS PUBLISHED ON THE ESTABLISHED CLASSES ONLY** (the three coarse own-openness
   cells × shell × path). The per-class split of the same grid is stored in the per-seed cells and
   in `bins.ownOpennessByShellAndPath`, so any reader can re-derive it, but it is not published as
   faces.
7. **THE MENU FACES ARE DEFINED ONLY ON THE TRACED PATH VIEWS** — an untraced pass has no menu, and
   a face with a zero numerator over a non-zero denominator would have read as "no menu" rather than
   "no ledger". Stated rather than left to the reader.
8. **N = 485 BY THE SIZING**, not the block's affordance of 999 — `sizing.boundBy` stores which
   branch bound it. The unwalked tail 12,547,485–12,547,998 is declared and the block is consumed
   whole of record.
9. **THE LN-C1 WALKER IS INHERITED WHOLE** — including LN-C0's crowd/pair/designation/spot
   machinery this census does not read — so that G-REPRO-LNC1 is a field-for-field comparison rather
   than a chosen subset. Those inherited faces are re-published in this artifact but are NOT re-read
   here: **LN-C1 remains their home**.
10. **ONE FIXTURE AND THE PLACEHOLDER N WERE FIXED BEFORE THE FREEZE**, both disclosed in
    §DEV-PREFLIGHT: the shell fixture that asserted the wrong expectation (the engine was right) and
    the pre-sizing `N_FROZEN`. Neither is a post-sight edit: both predate the freeze commit.

## §GATES — 26 of 26 GREEN

Every gate below carries `ok: true` in the artifact, and every NOTE derives from the same pinned
values its `ok` reads (canon: *"a gate's NOTE derives from the same pinned values the gate checks; a
count typed beside its pin is a second copy"*).

| gate | verdict | what it pinned |
|---|---|---|
| `xDet` | GREEN | the whole core walked TWICE; digests identical (`5aad5558901188fe…`), `wallMs` the one named exclusion |
| `xFpProd` | GREEN | the production fingerprint recomputed in-probe = the baseline EXTRACTED from OBM-T1's probe line |
| `gSrcUntouched` | GREEN | `git diff --stat HEAD` AND `git status --porcelain` over `src/` AND `tests/`, all empty |
| `gSeedDisjoint` | GREEN | block base = the frontier at #391 item 7; disjoint from LN-C0's, LN-T1's and LN-C1's quoted intervals; scratch ≥ 900,000,000; the re-walk seeds inside LN-C1's own block |
| `gSeedsBookedEqualWalked` | GREEN | 485 distinct battery seeds + the receipt, ×2 arms ×2 passes = 1,944 walks booked = walked; the tail declared |
| `gN` | GREEN | the sizing arithmetic re-derived, and N = min(485, 999) = 485 — bound by the sizing |
| `gWorld` | GREEN | per arm, on every walked match and the receipt: `bqArmedVersion` 13 · `bqCushion` · both step-② seams absent · RC/BF absent · genome clean · `emergentPosOn` · `inSnapshotLaw` absent · `edsPerceivedChoice` true · **`traceChoice` true (and false on the untraced twin) · `bkGroundCorridor` and `dxWindupAim` open · `dvExposureWeight` READ = 0.5** |
| `gDoseSource` | GREEN | the dose FILE BYTES hashed and compared to the standing pins before any seed |
| `gAnchoredConstants` | GREEN | **147** anchored sites at their pinned occurrence counts with line receipts |
| `gCodeFact` | GREEN | the code-fact anchors AND the four whole-function text hashes; the booleans are STORED, not asserted |
| `gFnTexts` | GREEN | the four extractions found, non-empty, hashed and DISTINCT |
| `gShellFixtures` | GREEN | the SHIPPED `groundShellHazard` CALLED on hand-built geometries, plus the path classes and the substitution-direction rule branch by branch |
| `gChoiceTickRule` | GREEN | per walked match: arm ≡ `gpWithArm`, release ≡ `gpNoArm`, none = 0; **and the path × class grid is a PARTITION of the same passes**, every shell/carom/legacy count inside its own cell |
| `gLockstepTrace` | GREEN | traced ≡ untraced whole-match signature (rng state included) on 4 arm × scratch-seed pairs; ledger rows 50 / 55 / 60 / 65 vs 0 |
| `gTraceJoin` | GREEN | joinShare stored and non-zero; `targetAgreesShare` **1.000000** on both arms |
| `gWalkFixtures` | GREEN | **151** walk-side fixtures — LN-C1's whole table plus LN-C2's shell, path and substitution-direction fixtures |
| `gLedgerRead` | GREEN | inherited: the designation class follows the team's own edited set |
| `gClassesNonVacuous` | GREEN | both arms carry LEGACY, SUBSTITUTED and UNTRACED passes, traced caroms, LEGACY-path caroms, shell-fired and shell-clear passes, and substituted passes with a readable legacy lane |
| `gReproducePTC0` | GREEN | inherited: the crowd arithmetic's second implementation agrees cell for cell |
| `gReproLnc1` | GREEN | **1,248 field comparisons, 0 mismatches** against the committed LN-C1 artifact, walked with the trace OFF; the excluded shared field is `wallMs` |
| `gLockstep` | GREEN | observed ≡ unobserved, byte for byte, on 4 arm × scratch-seed walks |
| `gTwoFractions` | GREEN | all **1,310** face rows carry numerator and denominator and equal their ratio |
| `gLoo` | GREEN | **12** read-bearing rows stored with their flips and min/max leave-one-out values |
| `gFaces` | GREEN | **1,965/1,965** face-and-Δ and **145/145** stored-bin / median / partition / read-word / sizing checks off the SERIALIZED artifact |
| `gReadWords` | GREEN | every share with its counts, every selector boolean, every read key, every printed sentence, the agreement boolean and the untraced share re-derived off disk |
| `gHashOrder` | GREEN | the body hash computed LAST off a **39**-key allowlist schema that INCLUDES `allGreen`; the NON-body keys are `hashedBodySha256`, `gFacesDetail`, `receipts`, `honestLimitsNote` and `worldTwelveNotWalked`; `receipts.hashReproducesFromFile` = true |

**THE PROSE SWEEP.** canon, VERBATIM: *"a stage doc's numeric sweep covers EVERY numeric literal in
prose at ANY precision; a hand-written percentage is the likeliest second copy"*. Every numeric
literal in this document is either (a) a field of this census's artifact quoted at 6 dp, (b) a count
quoted from a stored numerator/denominator, (c) a **source line number or a line SPAN** stored in
the artifact's `anchoredSites` / `functionTexts`, (d) a value quoted from the DISCLOSED smoke
artifact in §DEV-PREFLIGHT, (e) a seed, a ruling number, a gate/fixture/anchor/face/schema count
stored in the artifact, a hash prefix, a character count stored in `functionTexts`, or the interval
level, or (f) one of the **stated derivations**, each flagged in place: 0.091736 ÷ 0.049664 =
1.847 (§R2), 0.152493 ÷ 0.071284 = 2.139 (§R4), and §R1's shell arithmetic 0.11 + 0.525 = 0.635,
whose three values are all stored in `theShell`. The residual literals were enumerated by an independent
tokenizer over the whole file against this census's artifact, the disclosed smoke's and LN-C1's
committed one, and every one is accounted for here: the **hash prefixes** and the DIGIT RUNS inside
the two full hashes quoted in §R (the FILE byte-hash is not stored inside the file it hashes — the
LN-C1 §CORR 10 case, of record); **6,457,797**, this artifact's own FILE BYTE COUNT, self-referential
by construction; **900,000,000**, the scratch-band floor quoted from the seed-discipline canon;
**791** and **799**, the tails of the seed range 900,003,790–791 and of the scratch band
900,003,700–799, both stored whole in the `seeds` block; the two anchored band constants **6** and
**30** m and **0.11** / **0.525** / **0.635** (all stored in `anchoredSites[].extracted` or
`theShell`); **1.5** m, LN-C1's clear-the-kicker guard, named only to say the shell does NOT have it
(stored in `definitions.engineConstants`); **0.5**, the shell's price
(`theShell.dvExposureWeightRead`); **0.4**, the chooser's own gate
(`pathClasses.substitutionDirection.gate`); **1.6** m — a stated derivation, `laneOpenness`'s
`clamp01(d / 4)` at the 0.4 gate ⇒ 4 × 0.4 (§COMMANDER CORRECTIONS item 5); **0.6** m — a rounding of
the stored `theShell.shellMetres` 0.635 (the same item); and the ruling / commit / seed numbers.
⛔ **NO PERCENTAGE IN THIS DOCUMENT
RESTATES A STORED SHARE** — the only `%` characters are the interval level (95 %).

## §COMMANDER CORRECTIONS (ruling #392 — the census BANKED, the READ standing; verifier FAIL on ONE HIGH about a code fact, disposed; four MEDIUM and six LOW disposed; the artifact, the instrument and §P UNCHANGED)

The independent verifier re-derived every face, Δ, CI and LOO row off the serialized artifact (all
reproduce), ran its own bootstrap, re-extracted the four function texts and their hashes (exact),
built traced and untraced matches itself (identical signatures, 0 duplicate join keys), re-ran the
probe's smoke (26/26; G-REPRO-LNC1 1,248/0; the sizing half-widths bit for bit), instrumented six
scratch matches to prove the UNTRACED class is exactly the keeper and the synchronous families (26
of 281 wind-up records with no trace row, every one a GK), and then READ THE PRICER'S CALLEES.
Verdict **FAIL — one HIGH**. The items:

1. **HIGH — THE PERCEIVED PRICER DOES CARRY A LANE TERM.** `pricePassOption`'s READ branch prices
   `threatQuintilePrice(read.interceptionThreatSeconds)`; `interceptionThreatSeconds` is computed in
   `passOptionValue.ts` by looping the snapshot's players and calling
   `evaluatePassCorridorInterception` (`passCorridorInterception.ts`), which marches the ball down
   the flight segment tick by tick and asks whether a defender reaches each point first — a
   corridor term. The stored `pricePassOptionHasNoLaneTerm` and `choosePerceivedPassTargetHasNoLaneTerm`
   are WITHDRAWN (the artifact is not edited; §R1 and §R7 corrected in place). THE OWN-BODY HALF
   STANDS, verified two calls deep: `passOptionValue.ts` `if (entry.side === passer.side) continue;`
   and `passCorridorInterception.ts` `defender.side === passer.side` exclude same-side bodies; the
   one same-side loop (`passAffordance.ts` `exitOptionCount`) feeds no field the price reads. THE
   READ IS UNAFFECTED (S is about own-body caroms). WHY THE GATE MISSED IT: the booleans were
   `contains` probes over a needle list, and a whole-function HASH pins a text but cannot see a term
   reached through a CALL — #391 item 3(v)'s lesson recurring one level down. Canon amended at #392
   item 3: a code-fact boolean about what a function reads names the CALL GRAPH it was checked over.
   CONSEQUENCE: the seam the read names is NARROWER than §0 implied — an OWN-BODY limb added to a
   corridor read that already runs in the perceived pricer, not a lane concept built from nothing.
2. **MEDIUM — TWO STORED NOTES NAME LN-C1's READ-BEARING SHARES** (`gates.gLoo.note` and
   `sizing.varianceSource` say `cBlockedShare` / `aShare`; this census's are `sShare` / `fShare`, as
   `loo.rows` and `sizing.rows[].face` correctly store). Inherited descriptive text; the values are
   right; the artifact is not edited — of record.
3. **MEDIUM — THE RE-WALK RECEIPT NAMES LN-C0's BLOCK** (`reproLnc1.note` says 12,544,000–999; the
   seeds stored and walked are 12,546,000–011, LN-C1's, as §P.E says). The instrument's §4 header and
   console banner carry the same stale lineage. Of record.
4. **MEDIUM — `choiceTick.theAimOfRecord` STATES LN-C1's RELEASE-CLASS RULE** (the body position),
   while this census reads the body position PLUS `match.dxStrikeAim`'s lead where gid and tick match
   (the `aim.*.recordShare` faces' own `what` field has it right). Of record; the correct rule is
   §P.B's.
5. **MEDIUM — THE PROSE SWEEP MISSED `1.6`** (doc-authored at §0 and §R7; a derivation 4 × 0.4) and
   the paired `0.6` (a rounding of 0.635). Both added to the residual list in place.
6. **LOW — an instrument comment names the wrong world-pin seed** (900,003,470 for 900,003,770; the
   constant and the walk are right). Of record.
7. **LOW — the join map has no duplicate-key receipt**; the verifier found 0 duplicates over six
   matches and `targetAgreesShare` = 1.000000 covers the consequence. Of record; the next instrument
   stores the count.
8. **LOW — "THE BIGGEST SINGLE BLOCK"** superlative rewritten in place as the stored three-way
   comparison on both arms.
9. **LOW — the cross table printed 17 of 18 cells**; the empty `UNTRACED [0.0, 0.1) shell 0` row
   (0 / 11,165) added in place.
10. **LOW — `groundCandidateReadsOwnBodiesThroughTheShell`** depends on `gcBodies`, built ABOVE the
    hashed span (disclosed in §R1; the line is anchored). Of record; the call-graph form (item 1)
    covers it.
11. **LOW — a literal count in the sweep prose** ("three stated derivations") removed in place.
12. **RATIFIED**: the ten declared §DEVIATIONS (incl. N = 485 by the sizing with the F variance taken
    from D13, the conservative direction); the thirteen HONEST LIMITS as the ONE home (the artifact's
    pointer names this doc). The §DEV-PREFLIGHT pre-freeze fixture fix — "the engine was right" — is
    of record.
