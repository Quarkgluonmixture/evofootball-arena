# LN-C2 — 「谁选的接球人，他看见了谁」 THE CHOOSER-PATH CENSUS（这个接球人是哪一套定价选的；出脚那一刻，那条线上的「贴身壳」响了没有）

> **STATUS at this commit: FREEZE.** §0 and **§P** below are frozen **BEFORE any battery seed is
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
   first answer away** and picks its own man off what this body can actually see. Its price knows
   nothing about lanes and nothing about our own bodies.

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
