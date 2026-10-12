# OP-C0 — 「传到对面身上 · 普查」 THE OPPONENT-FIRST CENSUS（传球先碰到对面的人时，这一脚算谁的）

> **STATUS: WALKED — the battery is complete, ALL 19 GATES ARE GREEN (`allGreen` = a STORED `true`),
> and the five PRE-REGISTERED QUESTIONS and the OWNERSHIP TABLE are answered as STORED PARTITIONS at
> §R.** §0 through §DEV-PREFLIGHT and the instrument were sealed at the FREEZE commit **`a40b502`**
> BEFORE any battery seed was walked and were NOT edited after sight (only this STATUS paragraph
> moved; §R onward was appended). `git diff a40b502 -- scripts/probes/op-c0-opponent-first-census.ts`
> is **EMPTY (0 bytes)**. The artifact is at its **CANONICAL** path (all gates green, so the
> red-routing idiom did not move it).
> Authorized by **COMMANDER RULING #426 item 3** (X-SRC-ZERO, Road B).
> Census form of record: [`IF-C0-FLIGHT-RUN-CENSUS.md`](IF-C0-FLIGHT-RUN-CENSUS.md) (§0 / §P /
> §DEV-PREFLIGHT / §R / §HONEST LIMITS / §DEVIATIONS / §GATES, the gate idioms, the hash /
> allowlist / RED-routing idiom).
> Instrument: [`scripts/probes/op-c0-opponent-first-census.ts`](../../scripts/probes/op-c0-opponent-first-census.ts)
> — its recipes are **COPIED BY RECIPE, ⛔ NEVER IMPORTED**, each cited at its site:
> BN-C0's release detection, first-body channel, corridor test and three-way split
> ([`bn-c0-bounce-census.ts`](../../scripts/probes/bn-c0-bounce-census.ts) l.463–493, l.574–586,
> l.959–1090); LN-C1's choice read and `binOf`
> ([`ln-c1-passer-lane-census.ts`](../../scripts/probes/ln-c1-passer-lane-census.ts) l.115–118,
> l.829–867); IF-T1b's team builder, arm construction and `signatureOf`
> ([`if-t1b-flight-run-exam.ts`](../../scripts/probes/if-t1b-flight-run-exam.ts) l.1036–1062);
> IF-C0's crowding sample ([`if-c0-flight-run-census.ts`](../../scripts/probes/if-c0-flight-run-census.ts)
> l.1503–1531).
> Artifact: `docs/world-model/data/op-c0-opponent-first-census.json` (compact JSON, body hash last;
> **or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS as **STORED PARTITIONS**. It ships nothing,
> adjudicates nothing and scores no hypothesis. ⛔ **NO VERDICT WORD** is written on any face; the
> ownership table is the evidence the commander chooses the next step from (#426 item 4).
> ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited; no frozen probe and
> no pinned test is touched.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S SENTENCE** (the world-12 verdict, #368 item 1; copied from its quotation at
[`LN-C0-LANE-CENSUS.md`](LN-C0-LANE-CENSUS.md) l.39):

> 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」

The last clause — 「或经常传到对面身上」 — is this census's subject. #426 item 2 records that it is
the ONLY clause of that verdict carrying 「经常」, that #414 item 4(vi) promised it 「its own census
later」, and that both self-drive steps ④ and ⑤ on #425's menu were handed it (#382 item 4(vii)).

**THE STARTING TABLES OF RECORD** (quoted by field from their own docs, never re-measured here;
each is cross-architecture ≈ against this host, #418 item 2):

* BN-C0 — the three-way split of opponent-first ground passes, on **WORLD 12** (BN-C0's own
  composition: `a4MatchFlags(12)` + `armA4World(m, null, 12[, L3, PC])`,
  [`BN-C0-BOUNCE-CENSUS.md`](BN-C0-BOUNCE-CENSUS.md) l.148–149), §R table at l.734–737:
  `opponent.corridorAtRelease` **0.565846** (E) / **0.580164** (D) · `opponent.struckThrough`
  **0.368288** / **0.376977** · `opponent.arrivedInFlight` **0.065867** / **0.042859** ·
  `opponent.tight.corridorAtRelease` **0.281296** / 0.317289; and `class.firstBody.opponent`
  **0.319312** / **0.321270** (l.519).
* LN-C1 — on **WORLD 13** (E13 / D13), §R5 at
  [`LN-C1-PASSER-LANE-CENSUS.md`](LN-C1-PASSER-LANE-CENSUS.md) l.522–524:
  `choice.established.opponentFirstShare` (= `firstBody.opponent`) **0.313747** (E13, 1,965 / 6,263)
  / 0.322041 (D13); `choice.established.opponentOpenBelow40Share` **0.320294** (2,006 / 6,263) /
  0.373919; `opponent.established.below40FirstShare` **0.513958** (1,031 / 2,006) / 0.526914.

**WHAT #426 ASKS** (item 2, the reality audit, VERBATIM): *"an interception has three real
authors — a passer who played into a man he could see (a decision error), a ball that did not go
where the pass was priced (technique / weight), a defender who READ it and stepped in (the
defence's credit, not a passing defect); the census's partition is those three, plus whether the
passer could have SEEN the man."*

### 在说人话的层面

传球先碰到对面的人，可能有好几种原因：传球的人明明看得见那个人、自己的算盘也说这条线不干净，
却还是传了（**算盘的锅**）；算盘说这条线是干净的，可人就站在线边上，球一出去就被碰到（**算盘
的几何**）；球没往算好的地方走（**脚法 / 力量**，也就是菜单上的 ④）；对面的人在球飞的时候
**读到了**、冲过来截了（**防守的功劳**）；或者传球的人**根本没看见**那个人（**眼睛**，菜单上的
⑤）。这次普查不修任何东西，只把每一脚这样的球**归到唯一一格**里，数清楚每格有多少，剩下归不
进去的也照实打印。

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — FOUR, PAIRED on shared seeds

| arm | world | dose | role |
| --- | --- | --- | --- |
| **`W18-E`** | 18 (`a4MatchFlags(18)` + `armA4World(m, null, 18)`) | none — the `?a4world=18&pcdose=0` form | the arm the IF family measured |
| **`W18-D`** | 18 | the SHIPPED loaders' L3 + PC doses (`loadL3Dose` / `loadPcDose`, CALLED; file BYTES hashed against their pins) | the world as the user plays it |
| `W13-E` | 13 (`a4MatchFlags(13)` + `armA4World(m, null, 13)`) | none | REFERENCE row only (LN-C1's E13 composition) |
| `W13-D` | 13 | L3 + PC | REFERENCE row only (LN-C1's D13 composition) |

* The composer and the arming are **CALLED**, never copied; the arming is GameApp's own call form
  `armA4World(match, tables, world, l3Dose, pcDose)` with no tables. Teams are DS-C0's builder
  (IF-T1b `teamInfo`), so every arm walks the same two squads per seed.
* The W13 rows are **printed, never gated** (#426 item 3(i)); every comparison against BN-C0 /
  LN-C1 numbers is ≈ (arm64-measured; this host is x64).
* **`gWorld`** asserts on EVERY walked match: the arm's world (18 → `ifArmedVersion` 18; 13 →
  `bqArmedVersion` 13 and `ifArmedVersion` 0, no `dsOwnRun`), `inSnapshotLaw` ABSENT,
  `edsPerceivedChoice` ON, `info.genome` free of any OBM matrix; and on a constructed pin at scratch
  **900,009,270** that `edsPerceivedDefence`, `dxWindupAim`, `dlcDeliveryChoice` and
  `o1PassWindup` are ON and `pwWeightChooser` / `ptpPassLead` ABSENT.

### §P.B gRepro — THE CONSTRUCTION PINNED BEFORE ANY CENSUS SEED

#426 item 3(i) pins the arm construction against **IF-T1b's stored x64 `OWNCOOP+IF-E13` per-seed
signatures on 12,560,000–011** (the IF-ENTRY item 1(c) proof). IF-T1b built that arm on a
**WORLD-13** composition (`a4MatchFlags(13)` + the three DS flags + `ifFlightRun` +
`armA4World(m, null, 13)`), so — exactly as [`IF-ENTRY-RUNG.md`](IF-ENTRY-RUNG.md) §2 did — the
pin is stated in **two halves**:

1. **IF-T1b's own construction, re-run here**, reproduces its STORED `perSeedCells[].
   ['OWNCOOP+IF-E13'].signature` on all **twelve** seeds 12,560,000–011, with its own
   `signatureOf` (which carries `action.type`), walked unobserved. Same host ⇒ EXACT. These seeds
   are IF-T1b's own consumed band: re-walking them is **not a consumption**.
2. **The world-18 flag set** is `{ ...a4MatchFlags(17), ifFlightRun: true }` key for key, and the
   keys by which world 18 differs from IF-T1b's construction are **ENUMERATED and STORED**
   (`repro.w18KeysBeyondIfT1bConstruction`), together with the world-14 gene pin `armA4World(…, 18)`
   writes. ⇒ the W18 arms are NOT byte-equal to IF-T1b's arm, and the instrument says by exactly
   which doors.

`gRepro` runs FIRST. **If it is red, no census seed is walked** and the artifact is RED-routed.

### §P.C POPULATION — EVERY PASS RELEASE, AND ITS FIRST BODY

**THE RELEASE** is BN-C0's detection, COPIED (team-stat deltas → `klassOf`; the passer is the new
`pendingPass` key's `passerGid`; a release counts only on a live ball with a non-zero horizontal
speed). A **pass** carries a target: the `pendingPass` key changed on this tick for this passer.
Partitioned three ways:

* **GROUND (the sentence's class)** — BN-C0's `isMeasurableGroundPass`: `shortPass` /
  `throughBall` / `cutback`, ground launch, a target. **Every ownership number is over this class.**
* **LOFTED** — a delivery with a target whose launch is airborne (`isGroundLaunch` false): its first
  body is reported apart; the corridor (a ground notion) is not applied.
* **ground, other** — a ground delivery with a target outside the three classes: COUNTED, not booked.

**THE FIRST BODY** — `ball.lastTouch` (the engine's own record), BN-C0's channel: the first tick
after the release at which `lastTouch` names a body other than the passer, classed by BN-C0's
`contactClassOf` (`none` · `ownTarget` · `ownNonTarget` · `opponent`) — BN-C0 l.489–493 /
LN-C1 l.617–621. A flight that retires before any other body touches it (the ball owned by another
body, a dead ball, or BN-C0's 720-tick cap) is `none`.

⚠ **TWO DECLARED ORDERINGS (frozen here):**

1. **The pending flight is followed BEFORE this tick's releases are read.** BN-C0 read the release
   first and overwrote a pending flight unbooked, so a one-touch release by the body that met the
   previous ball dropped that ball from BN-C0's population. Here it is booked. ⇒ this census's
   first-body shares are **not byte-comparable** to BN-C0's; they are ≈ beside it in any case.
2. **A flight still pending when its own passer releases again** is booked `none` and COUNTED in
   `superseded` — never dropped. ⇒ every ground release enters exactly one owner cell.

### §P.D Q2 — THE THREE-WAY SPLIT, BOTH WIDTHS, FROZEN

For every opponent-first ground pass, BN-C0's split COPIED: **in the lane at release**
(`corridorAtRelease` — the opponent inside the corridor from the launch point to the priced aim E
at the release tick) · **arrived in flight** (outside at release, inside at contact) · **struck
through** (inside at neither). The corridor is `laneOpenness`'s own geometry through
`closestPointOnSegment` (CALLED), with its own clear-the-kicker guard `DV_CLEAR_RADIUS` = 1.5, at
**two half-widths copied from BN-C0 and FROZEN**: the WIDE `DV_CORRIDOR_SCALE` = 4 m (primary; the
ownership mapping uses it) and the TIGHT `CONTROL_RADIUS` (BN-C0's robustness bin). ⛔ Never tuned
after sight.

**THE PRICED AIM E** (what "the lane" is drawn to): for a wound-up pass, the wind-up record's
`aim + aimLead` (BN-C0's own `eX/eY`); for a synchronous pass, the target's position (+ the DX
deposit's lead when the strike was led — §P.E).

### §P.E THE CHOICE READ, THE BAR, THE ALTERNATIVE, AND THE PRESENCE TEST (Q3)

**THE CHOICE STEP** (LN-C1 §6b's rule): a wound-up pass's choice step is its **arm** step (the brain
arms the wind-up synchronously on the tick it chose `Pass`); a synchronous pass's choice step is its
release step.

**THE CHOICE READ** — LN-C1's construction re-expressed on the opponent side, at the choice step, at
the passer's position, toward E, on **TRUTH positions** (§CODE MAP 1: the decision's pricing reads
truth):

* `rawOpen` = `laneOpenness(passer.pos, E, opponents)` CALLED — binned on LN-C1's 0.1 grid with
  LN-C1's `binOf`;
* `pricedLane` = **the chooser's own expression** `min(1, rawOpen × (playmaker ? 1.15 : 1))`
  (anchored, the 1.15 PARSED from its line);
* **THE PASSER'S OWN BAR** = the `0.4` of the chooser's risk gate `if (gain > 0.15 && lane < 0.4)`
  (anchored, PARSED). `belowBar` ⇔ `pricedLane < 0.4`. ⚠ Applied to every ground class, as LN-C1
  applied its 0.4 edge to every established choice; the through-ball and cutback choosers have their
  own gates, and the in-lane class is published by klass beside it.
* **THE ALTERNATIVE, OPPONENT SIDE** — LN-C1's `ownClearAlternativeAtLeastAsOpen` form
  (`aOwn >= GATE_040 && aOpp >= oppOpen`, LN-C1 l.857) moved to the opponent side: `altOpp` ⇔ some
  other own outfield mate (not the passer, not the target, not sent off) has a priced lane
  **≥ 0.4 AND ≥ the chosen lane's priced openness**.

**THE PRESENCE TEST — truth vs his snapshot.** The instrument wraps `match.perceivedSnapshot` with an
**OBSERVING** wrapper that copies out, for every SCOPED pull (scope ≠ null), the opponents the
returned snapshot holds, and returns the engine's own value untouched (`gLockstep` proves it inert
on every arm). In worlds 13 and 18 the ONE scoped pull a carrier makes is the EDS E3 chooser's
(§CODE MAP 2), so:

| cell | predicate |
| --- | --- |
| `truthRead` | no scoped pull by this passer on the choice step ⇒ the target came from the TRUTH-priced legacy chooser ⇒ **the man was visible by construction** |
| `snapshotPresent` | the E3 chooser pulled his snapshot on the choice step AND it holds an entry for the first-touch opponent |
| `snapshotAbsent` | the E3 chooser pulled it AND it holds NO entry for him (his memory never held him: the snapshot keeps a scoped body only if `memory.players` has it) |
| `noChoiceRead` | no choice step could be established |

Beside it: `perceivedInLane` (present, and his REMEMBERED position lies in the choice-step corridor)
and `inLaneAtChoice` (his TRUTH position at the choice step lies in the choice-step corridor).

### §P.F Q4 / Q5 — THE DELIVERY SEAT, WHERE THE BALL WENT, AND WHO STEPPED IN

**THE SEAT** (§CODE MAP 3), per ground pass:

| seat | predicate |
| --- | --- |
| `dxAim` | struck out of a wind-up whose record carried a non-zero `aimLead` (the DX deposit captured at arm) |
| `dlcChoice` | a synchronous strike on a step on which THIS passer's DX deposit was made and left UNCONSUMED (no wind-up took it) ⇒ the led ball struck by `performPass(…, v2(bestLeadX, bestLeadY))` |
| `plain` | everything else — to feet (a wind-up without a lead, or a synchronous strike without a deposit) |

**Q4, the struck-through class, per seat:** the **launch-miss angle** between the ball's velocity
at the release tick and the priced direction L→E, binned at **0 · 2 · 5 · 10 · 20 · 45°** (lower
edges; the last open); **where** the contact sits against the priced segment — `beyondAim` (past E
along the line) · `besideLine` · `atTheKicker` (within `DV_CLEAR_RADIUS` of the launch point, or
behind it); and the priced lead's mean length (cm) on the led seats.

**Q5, the arrived-in-flight class:** the interceptor's **start distance** from the priced centre
line at the release tick, binned at **0 · 4 · 6 · 8 · 12 · 20 m**; his run from his release-tick
position to the ball at contact (mean, cm); and **the read path** — his `action.type` at the
release tick and on the tick before contact, cells `InterceptPass` · `ChaseBall` · `MarkOpponent` ·
`other` (§CODE MAP 4 names the path that produces `InterceptPass`).

### §P.G ⭐⭐⭐ THE OWNERSHIP TABLE — the mapping, FROZEN

Every GROUND pass falls in **exactly one** cell. The owner NAMES are the commander's (#426 item
3(iii)); the predicates are frozen here, from the code map, ⛔ never re-drawn after sight. The
precedence is top to bottom:

| # | cell | predicate (stored booleans) |
| --- | --- | --- |
| 0 | `notOpponentFirst` | first body ≠ `opponent` (the complement — not the sentence) |
| 1 | **THE DEFENCE'S READ** `defenceRead` | opponent first ∧ `arrivedInFlight` |
| 2 | **④ STRUCK ≠ PRICED** `struckNotPriced` | opponent first ∧ `struckThrough` (the man was never in the priced corridor: the ball met him off the priced line) |
| 3 | **⑤ PERCEPTION** `perception` | opponent first ∧ `corridorAtRelease` ∧ presence = `snapshotAbsent` |
| — | residue `residueNoChoiceRead` | opponent first ∧ `corridorAtRelease` ∧ presence = `noChoiceRead` |
| 4 | **THE PRICE** `price` | opponent first ∧ `corridorAtRelease` ∧ `pricedLane < 0.4` ∧ `altOpp` |
| 5 | **THE PRICE'S GEOMETRY** `priceGeometry` | opponent first ∧ `corridorAtRelease` ∧ `pricedLane ≥ 0.4` (his openness said clear; the contact law disagreed) |
| — | residue `residueBelowBarNoAlternative` | opponent first ∧ `corridorAtRelease` ∧ `pricedLane < 0.4` ∧ ¬`altOpp` |

* **WHY ⑤ IS SCOPED TO THE IN-LANE CLASS:** a man outside the priced corridor at release (rows 1–2)
  is not in the lane the passer priced, so whether he was in the passer's read cannot change that
  price. The presence partition is nevertheless **stored for all three split classes**
  (`q3.presenceBySplit.*`), so the reader sees it everywhere.
* **WHY ⑤ PRECEDES THE PRICE:** a price cannot be charged with a man the read did not contain.
* **THE RESIDUE** = the two residue cells, **printed** per arm.
* The table is published per arm, as a share of all ground passes and as a share of opponent-first
  ground passes, and **per seat**.
* **gPartition**: per arm and per seed, the eight cells sum EXACTLY to the ground population; the
  four first-body cells sum to it too; the opponent-first count equals the three-way split's sum and
  equals the owner sum minus `notOpponentFirst`.

**BESIDE, as faces (never cells):** the completion rate (`passesCompleted / passes`, both sides, the
team stat), the crowding family (`crowd.crashShare`, IF-C0's form: possession side's outfield
minimum pairwise distance < 4 m at the 10-tick cadence), ground and lofted passes per match.

### §P.H THE PRE-REGISTERED QUESTIONS — answered as STORED partitions, ⛔ no verdict word

> **Q1** `firstBody.opponent` per arm; the W18 E→D paired Δ with its 95 % cluster-bootstrap CI;
> the W13 rows beside BN-C0's / LN-C1's values (≈).
>
> **Q2** BN-C0's three-way split under BOTH frozen widths.
>
> **Q3** For the in-the-lane class: the opponent-openness bins at the choice; the below-bar share;
> the at-least-as-open alternative; the presence partition (truth / snapshot present / snapshot
> absent / no choice).
>
> **Q4** For the struck-through class: the launch-miss angle and the where-cell, per seat.
>
> **Q5** For the arrived-in-flight class: the start distance and the read path.

Each is stored under `questions.<arm>` and in the faces; `gFaces` re-derives every face off disk.

### §P.I THE ESTIMATOR, THE SEEDS AND THE SIZING

* **THE ESTIMATOR**: per-seed counters (188 stored cells per arm-seed row); every face a pooled
  ratio of summed cells; a **CLUSTER BOOTSTRAP over match seeds**, 2,000 draws, the resample RNG
  (mulberry32) seeded from the block base 12,561,000, percentile intervals at 2.5 % / 97.5 % on
  levels per arm and on the **PAIRED Δ W18-D − W18-E**. **ZERO stats consumed**:
  `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 88 }` — this census registers NO new
  engine-ledger read (the registry stays 88); the records it reads are listed by `gLedgerRead`.
* **THE BLOCK**: **12,561,000–999**, fresh against every consumed block of record (12,544,000 …
  12,560,000 — IF-T1b's list plus IF-T1b's own), each ending below this base. Battery
  **12,561,000–12,561,998**; construction receipt **12,561,999**. BOOKED = WALKED: **999 × 4 + 4 =
  4,000 walks**. ⛔ Never a SIM seed ≥ 12,562,000 (a fixture proves one past the ceiling WOULD be
  caught; the scratch lattice ≥ 900,000,000 is not the sim lattice).
* **THE RE-WALKS** 12,560,000–011 are IF-T1b's own consumed band (canon, VERBATIM: *"verifier
  scratch walks use the stage's own consumed band or the out-of-band scratch range (≥ 900,000,000) —
  never the next virgin block"*, home: PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6).
* **SCRATCH**, all from the ONE base **900,009,200**, inside 900,009,200–299: the sizing smoke
  200–211, the smoke receipt 220, the world pin 270, the lockstep / X-DET pair 290–291. The
  verifier's **900,009,300–399** is asserted disjoint.
* **THE SIZING FORM** (IF-C0 §P.H's, the house form): `se(n) = hw(n)/z.975` · `se(needed) =
  0.05/(z.975 + z.80)` · `N = ceil(n · (se(n)/se(needed))²)`, at the declared **0.05** target on
  **`fb.ground.opponent@W18-D`**. **N = THE AFFORDANCE (999)** — the #414 §CORR 8 floor reading,
  walked and said plainly: the ownership cells and the residue are RARE classes sized by nothing but
  volume.

### §P.J THE GATE SET (frozen ex ante) — NINETEEN

`gRepro` · `gLockstep` · `gDeterminism` (X-DET) · `gFingerprintProd` (X-FP-PROD: in-process
`npm run fingerprint` recipe = the x64 value of record `59f42aa7…a072d`) · `gSrcUntouched`
(X-SRC-ZERO: `git diff 170a5fa -- src/ tests/` EMPTY and `git status --porcelain -- src tests`
EMPTY) · `gWorld` · `gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` · `gScratchBand` ·
`gAnchoredConstants` (29 code-map needles at their occurrence counts; canon, VERBATIM: *"a seam-map
gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"*) ·
`gPredicateFixtures` (every new predicate firing AND not firing: the corridor test at both widths,
the split, the bar, the priced lane, the alternative, the presence test, the seat, the where-cell,
the bins, **every owner cell and its neighbours**, the seed ceiling) · `gLedgerRead` (which faces
read an engine record and which are declared reconstructions) · **`gPartition`** ·
`gClassesNonVacuous` · **`gBite`** · `gFaces` · `gHashOrder` · `gStage`.

⭐ **`gBite` IS IN THE #414 FAMILY-NOTE ROW FORM** (canon, VERBATIM: *"a liveness receipt for a
switch whose effect is a RARE EVENT compares the per-seed ROW (any stored field), not the full-time
signature — a full-time state snapshot is not a trajectory hash and a hat's whole effect can be
absorbed before the whistle"*, home: DS-T1D-COOP-HATS-EXAM.md §COMMANDER CORRECTIONS item 8): the
switch here is THE DOSE — on every seed the `W18-D` and `W18-E` per-seed rows must differ in at
least one stored cell; the full-time signature comparison is a PRINTED face and gates nothing.

⛔ **EVERY GATE IS A LIVENESS OR A RECEIPT. NOT ONE GATES A DIRECTION.**

## §CODE MAP — what world 18's passer and the defence read (DESCRIBES; designs nothing)

Line numbers are at `170a5fa` (= this branch's `src/`), each a stored anchor receipt
(`anchors[]`, occurrence-counted by `gAnchoredConstants`).

1. **THE PASS DECISION READS TRUTH.** `decideCarrier` (`src/ai/PlayerBrain.ts`) builds a snapshot
   view only through the ONE `inSnapshotLaw` fork (l.210); `const opp = inView === null ? oppTruth :
   snapshotTeamView(…)` (l.217). `inSnapshotLaw` is **absent from `a4MatchFlags(18)` and (13)**
   (asserted `false` on every walked match by `gWorld`), so `opp` IS `oppTruth`. The ground-pass
   pricer `groundCandidate` reads `lane = min(1, laneOpenness(p.pos, aim, opp.players) ×
   (playmaker ? 1.15 : 1))` (l.638) — **TRUTH positions** — and applies **the bar**
   `if (gain > 0.15 && lane < 0.4)` (l.655). So the action choice and the legacy `bestMate` / `bestLane`
   are priced on truth: **any opponent in the lane was visible to that read by construction.**
2. **WHO GETS IT IS RE-SEATED OFF HIS SNAPSHOT.** With `edsPerceivedChoice` ON (worlds 13 and 18),
   once `Pass` won and the passer is not a keeper and not cutting back (l.1432), the EDS E3 chooser
   builds a scope of his candidates plus **every non-sent-off opponent** (l.1447) and pulls
   `match.perceivedSnapshot(p, scope)` (l.1456) — **the ONE scoped pull a carrier makes** (the PW
   chooser's, l.1563, is dormant: `pwWeightChooser` absent). `choosePerceivedPassTarget` prices on
   that snapshot and its pick replaces `passMate` (no executable option ⇒ the legacy truth pick
   stands). The snapshot holds a scoped body **only if his memory holds it**
   (`src/ai/perceptionSnapshot.ts` l.592–593), at its remembered position. ⇒ **The TARGET is chosen
   off his snapshot; the "is this lane clear" bar is read off truth.** That is the truth-vs-snapshot
   fact Q3's presence test splits on.
3. **THE DELIVERY SEATS, AND WHERE PRICED AIM vs REALISED PATH CAN BE READ.**
   * **DLC choice** — the led candidate `ledDelivery(dlcSeat, …)` is priced by the same
     `groundCandidate` and enters the same argmax (l.789); a led winner leaves `bestLeadX/Y ≠ 0`. The
     strike plane is inert while `dlcSeat` is open (l.856).
   * **DX aim** — when the chooser's own winner is the man passed to and the lead is non-zero, the
     displacement is **deposited** on `match.dxStrikeAim` (l.1747). The open-play shortPass then
     **winds up** (l.1753): `armPendingPass` **consumes** the deposit (`src/sim/Match.ts` l.4412) into
     the record, `aim` = the mate's arm-time position (l.4418), `aimLead` = the displacement (l.4429),
     and the wind-up resolves through `performPass(…, pp.aimLead)` (l.4492). **Readable: the priced
     aim = `aim + aimLead` on `pendingPassWindup`.**
   * **The synchronous strikes** — the led strike `performPass(…, v2(bestLeadX, bestLeadY))` (l.1755)
     and the plain `performPass(p, passMate!, …)` (l.1756). A synchronous led strike leaves the
     deposit **unconsumed** on `match.dxStrikeAim` — that is how the instrument reads the `dlcChoice`
     seat. **Readable: the priced aim = the target's position + that deposit.**
   * **The realised path** is the ball's own state: its velocity at the release tick (the launch
     direction) and the first body's position at contact (`ball.lastTouch`).
4. **THE DEFENCE'S INTERCEPTION READ.** In `decideOffBall`, when the other side has a pass pending
   and the ball is unowned and on the ground (l.2336), the defender reads the ball **off his own
   percept** (`match.perceivedBalls.get(p.gid)`, l.2344 — `edsPerceivedDefence` ON) and prices the
   lane with `canInterceptPass` on that percept (l.2347); a reachable lane pushes
   `InterceptPass` — *'can reach the passing lane first'* (l.2349). `ChaseBall` (an assigned presser
   or a nearby loose ball) and `MarkOpponent` are the other two named paths Q5 counts.

⚠ The map is **needle-anchored**, not a whole-function extracted call graph (canon "code facts over
the call graph"); the one load-bearing code fact — the decision reads truth — is carried by a
**runtime boolean** on every walked match (`inSnapshotLaw` false), not by a text claim. Declared.

## §DEV-PREFLIGHT — the disclosed smoke, IN FULL (before the freeze)

Both runs route the artifact OFF every canonical path (the override guard refuses
`docs/world-model/data/`), on scratch seeds inside the declared band.

### 1. A 2-SEED SHAKE-OUT (`900,009,200–201`, four arms)

`OPC0_MODE=smoke OPC0_N=2 OPC0_OUT=<scratch>/shake.json npx tsx scripts/probes/op-c0-opponent-first-census.ts`
— **19/19 gates GREEN**. Before it, while writing the walker, two defects were found and fixed:
(a) a pending flight was overwritten unbooked by a new release (BN-C0's order) — which would have
broken `gPartition` — fixed by the two declared orderings of §P.C; (b) an override run with no
`OPC0_OUT` would have written into the repo root — the default override path is now the OS temp
directory. ⭐ `gLockstep` 8/8: the observing wrapper is INERT on all four arms.

### 2. THE SIZING SMOKE OF RECORD — 12 seeds `900,009,200–211` (+ receipt 220), four arms, **19/19 GATES GREEN**

`OPC0_MODE=smoke OPC0_N=12 OPC0_OUT=<scratch>/preflight.json npx tsx scripts/probes/op-c0-opponent-first-census.ts`
(smoke artifact `bodySha256 eef7ae3a1d2fe3f14d3b8af62b47cf2d5f88184028e36ef78f9514996ab84a24`).
`gRepro` 12/12; `repro.w18KeysBeyondIfT1bConstruction` = **`[gkDiveBody, lnOwnLanePrice]`**,
`ifT1bKeysBeyondW18` = `[]`.

**THE SIZED FACE as the smoke measured it**: `fb.ground.opponent@W18-D` = 0.333333 (330 / 990),
95 % CI [0.300894, 0.363277] ⇒ **hwSmoke = 0.03119150000000001** (TRANSCRIBED into the instrument as
`HW_SMOKE_RECORD`; that one constant is the only byte changed after the smoke).
`seSmoke` 0.01591432304166535 · `seNeeded` 0.017847038768172088 · **`nRequired` = 10** ⇒
**N = THE AFFORDANCE, 999** (§P.I).

⚠ The smoke's other numbers are **NOT results** (scratch seeds; disclosed only so the instrument is
seen to run): `fb.ground.opponent` W18-E 0.335609 (295 / 879) · W13-E 0.329646 (298 / 904) · W13-D
0.323323 (323 / 999). No partition is read on them.

## §R RESULTS (every number below QUOTES the artifact's own fields at the six decimals it stores — the artifact is the numbers of record)

**RUN RECEIPTS.** Freeze **`a40b502`**; `git diff a40b502 -- scripts/probes/op-c0-opponent-first-census.ts`
**EMPTY (0 bytes)**. **`allGreen` = true** (19 gate objects, every one `ok: true`). Artifact
`docs/world-model/data/op-c0-opponent-first-census.json`, **5,345,672 bytes**,
`fileSha256 = 8214e4d224b4ba4a8aea7a988d03857704e9cf0f3691169a3a9f11771d40c2ca`,
`bodySha256 = 015062353dd238bf663167bf155bfd212c08fca21121befd2209710b0850af98`,
`stage.instrumentSha256 = 24d2e4b2a3cc1a90b41e9541c459e0c9afa361e43a14cbbd58189ebf3f2d46fb`,
`receipts.hashReproducesFromFile` **true**. Battery **999 seeds (12,561,000–12,561,998) × 4 arms +
the construction receipt 12,561,999 × 4 ⇒ BOOKED = WALKED = 4,000 walks**; `seeds.unwalkedTail`
**null** — the block is consumed WHOLE. **`gRepro` 12/12** (IF-T1b's stored x64 `OWNCOOP+IF-E13`
signatures on 12,560,000–011, walked BEFORE any census seed); `w18KeysBeyondIfT1bConstruction`
**[gkDiveBody, lnOwnLanePrice]**. `gLockstep` 8/8 and X-DET 8/8 on 900,009,290–291. **X-SRC-ZERO**:
`git diff 170a5fa -- src/ tests/` **0 bytes**. **`npm run fingerprint`** run at RESULTS =
`59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` = the x64 value of record (also
recomputed in-process, `fingerprintProd.ok` true). ZERO stats, registry **88**. Wall **992.2 s**
(in-walk 953,802 ms over the 3,996 battery walks — ⚠ the two do not compose: the wall adds gRepro,
lockstep, receipts, the bootstrap and the writes).

### §R1 Q1 — `firstBody.opponent`, per arm

| arm | ground passes /match | **`fb.ground.opponent`** (95 % CI) | lofted `fb.lofted.opponent` |
| --- | --- | --- | --- |
| **`W18-E`** | 70.633634 | **0.317929** (22,434 / 70,563) [0.314395, 0.321578] | 0.559191 (3,623 / 6,479) |
| **`W18-D`** | 80.044044 | **0.311390** (24,900 / 79,964) [0.308187, 0.314601] | 0.526139 (3,593 / 6,829) |
| `W13-E` (ref.) | 74.615616 | 0.319180 (23,792 / 74,541) [0.315811, 0.322426] | 0.525769 (2,632 / 5,006) |
| `W13-D` (ref.) | 83.459459 | 0.316950 (26,426 / 83,376) [0.313686, 0.320360] | 0.489685 (2,255 / 4,605) |

**THE W18 PAIRED Δ (D − E)**: `fb.ground.opponent` **−0.006539 [−0.010958, −0.002005]**. Realised
half-width on the sized face 0.003207 (`sizing.realisedHalfWidthThisRun`) against the declared 0.05.

**≈ BESIDE THE STARTING TABLES** (cross-architecture, and §P.C's ordering differs from BN-C0's):
LN-C1 (world 13) 0.313747 E13 / 0.322041 D13 — here W13 0.319180 / 0.316950; BN-C0 (world 12)
0.319312 / 0.321270. ⛔ No verdict word on the comparison.

**BY KLASS** (`fb.ground.opponent.<klass>`): shortPass 0.304332 / 0.294949 / 0.292640 / 0.286168 ·
throughBall 0.496325 / 0.493005 / 0.460148 / 0.444813 · cutback 0.269792 (259 / 960) / 0.362745
(444 / 1,224) / 0.520621 / 0.564212 (W18-E / W18-D / W13-E / W13-D).

### §R2 Q2 — THE THREE-WAY SPLIT (share of opponent-first ground passes), both frozen widths

| arm | WIDE in the lane at release | WIDE arrived in flight | WIDE struck through | TIGHT in lane | TIGHT arrived | TIGHT struck |
| --- | --- | --- | --- | --- | --- | --- |
| **`W18-E`** | **0.523759** (11,750) | **0.079923** (1,793) | **0.396318** (8,891) | 0.228136 | 0.103236 | 0.668628 |
| **`W18-D`** | **0.542610** (13,511) | **0.054096** (1,347) | **0.403293** (10,042) | 0.268675 | 0.109598 | 0.621727 |
| `W13-E` | 0.567376 | 0.070780 | 0.361844 | 0.274798 | 0.099403 | 0.625799 |
| `W13-D` | 0.577764 | 0.044804 | 0.377431 | 0.318853 | 0.096988 | 0.584160 |

W18 Δ (D − E), wide: +0.018851 [+0.010264, +0.027819] · −0.025827 [−0.030300, −0.021359] ·
+0.006975 [−0.001210, +0.015622] (**contains zero**). ≈ BN-C0 (world 12, wide): 0.565846 / 0.065867 /
0.368288 (E), 0.580164 / 0.042859 / 0.376977 (D).

### §R3 ⭐⭐⭐ THE OWNERSHIP TABLE

**Share of ALL ground passes** (count) — every pass in exactly one cell; `gPartition` green per arm
and per seed:

| cell | `W18-E` | `W18-D` | `W13-E` | `W13-D` |
| --- | --- | --- | --- | --- |
| `notOpponentFirst` (complement) | 0.682071 (48,129) | 0.688610 (55,064) | 0.680820 (50,749) | 0.683050 (56,950) |
| **THE PRICE** | **0.077704** (5,483) | **0.083513** (6,678) | 0.091869 (6,848) | 0.099813 (8,322) |
| **THE PRICE'S GEOMETRY** | **0.068591** (4,840) | **0.061303** (4,902) | 0.063321 (4,720) | 0.052341 (4,364) |
| **④ STRUCK ≠ PRICED** | **0.126001** (8,891) | **0.125582** (10,042) | 0.115493 (8,609) | 0.119627 (9,974) |
| **THE DEFENCE'S READ** | **0.025410** (1,793) | **0.016845** (1,347) | 0.022592 (1,684) | 0.014201 (1,184) |
| **⑤ PERCEPTION** | **0.006576** (464) | **0.004389** (351) | 0.006775 (505) | 0.004042 (337) |
| residue: below bar, no alternative | 0.013647 (963) | 0.019759 (1,580) | 0.019130 (1,426) | 0.026926 (2,245) |
| residue: no choice read | 0.000000 (0) | 0.000000 (0) | 0.000000 (0) | 0.000000 (0) |
| **population** | 70,563 | 79,964 | 74,541 | 83,376 |

**The same, as a share of OPPONENT-FIRST ground passes** (`ownerOfOpponentFirst.*`):

| owner | `W18-E` | `W18-D` | W18 Δ (D − E) | `W13-E` | `W13-D` |
| --- | --- | --- | --- | --- | --- |
| THE PRICE | **0.244406** | **0.268193** | +0.023787 [+0.016411, +0.031686] | 0.287828 | 0.314917 |
| THE PRICE'S GEOMETRY | **0.215744** | **0.196867** | −0.018877 [−0.026032, −0.011377] | 0.198386 | 0.165140 |
| ④ STRUCK ≠ PRICED | **0.396318** | **0.403293** | +0.006975 [−0.001210, +0.015622] | 0.361844 | 0.377431 |
| THE DEFENCE'S READ | **0.079923** | **0.054096** | −0.025827 [−0.030300, −0.021359] | 0.070780 | 0.044804 |
| ⑤ PERCEPTION | **0.020683** | **0.014096** | −0.006587 [−0.008891, −0.004292] | 0.021226 | 0.012753 |
| residue (below bar, no alternative) | 0.042926 | 0.063454 | +0.020528 [+0.016665, +0.024424] | 0.059936 | 0.084954 |

**THE RESIDUE, PRINTED**: 963 (W18-E) · 1,580 (W18-D) · 1,426 (W13-E) · 2,245 (W13-D) — all of it
`residueBelowBarNoAlternative`; `residueNoChoiceRead` is **0 on every arm** (a choice step was
established for every ground pass: `q3.all.choiceKnownShare` 1.000000 on all four).

**PER SEAT** (share of that seat's opponent-first passes, W18-E / W18-D):

| seat | n opp-first | THE PRICE | GEOMETRY | ④ STRUCK ≠ PRICED | DEFENCE'S READ | ⑤ PERCEPTION | residue |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dlcChoice` | 948 / 666 | 0.016878 / 0.016517 | 0.175105 / 0.202703 | 0.468354 / 0.513514 | 0.328059 / 0.225225 | 0.001055 / 0.004505 | 0.010549 / 0.037538 |
| `dxAim` | 2,586 / 3,923 | 0.005027 / 0.007647 | 0.183681 / 0.223044 | 0.691415 / 0.637012 | 0.104795 / 0.117257 | 0.011214 / 0.007902 | 0.003867 / 0.007137 |
| `plain` | 18,900 / 20,311 | 0.288571 / 0.326769 | 0.222169 / 0.191620 | 0.352328 / 0.354537 | 0.064074 / 0.036286 | 0.022963 / 0.015607 | 0.049894 / 0.075181 |

### §R4 Q3 — THE IN-THE-LANE CLASS: the bar, the alternative, the read

| face (in-the-lane class) | `W18-E` | `W18-D` | `W13-E` | `W13-D` |
| --- | --- | --- | --- | --- |
| priced below the passer's own bar (`q3.inLane.pricedBelowBarShare`) | **0.563915** (6,626 / 11,750) | **0.621790** (8,401 / 13,511) | 0.627454 | 0.702908 |
| an at-least-as-open alternative, given below bar (`altGivenBelowBar`) | **0.852551** (5,649 / 6,626) | **0.810023** (6,805 / 8,401) | 0.829398 | 0.789788 |
| presence: `truthRead` (visible by construction) | 0.180170 (2,117) | 0.198357 (2,680) | 0.240240 | 0.266964 |
| presence: `snapshotPresent` | **0.780340** (9,169) | **0.775664** (10,480) | 0.722350 | 0.710964 |
| presence: `snapshotAbsent` | **0.039489** (464) | **0.025979** (351) | 0.037410 | 0.022072 |
| present AND remembered in the lane (`perceivedInLaneGivenPresent`) | 0.943942 (8,655 / 9,169) | 0.945802 (9,912 / 10,480) | 0.941852 | 0.957163 |
| truly in the lane at the CHOICE step (`inLaneAtChoiceShare`) | 0.968511 (11,380 / 11,750) | 0.970987 (13,119 / 13,511) | 0.970590 | 0.978714 |

**THE CODE MAP'S ANSWER, STATED** (#426 item 3(iii) Q3): world 18's passer prices the lane and the
bar on **TRUTH** (§CODE MAP 1) — for that read the man was visible by construction; the target is
re-seated off **his snapshot** (§CODE MAP 2), which held the first-touch opponent on
`snapshotPresent` and did not on `snapshotAbsent` above. Over all ground passes the choice was read
off the snapshot on 0.715247 (W18-E) / 0.728828 (W18-D) (`q3.all.read.snapshotPresent`, i.e. the E3
chooser pulled) and off truth only on 0.284753 / 0.271172.

**THE OPPONENT-OPENNESS BINS AT THE CHOICE** (in-the-lane class, LN-C1's 0.1 grid, W18-E / W18-D):
[0.0,0.1) 0.140170 / 0.174450 · [0.1,0.2) 0.132681 / 0.161276 · [0.2,0.3) 0.182468 / 0.186441 ·
[0.3,0.4) 0.110213 / 0.100955 · [0.4,0.5) 0.097957 / 0.085264 · [0.5,0.6) 0.095234 / 0.093257 ·
[0.6,0.7) 0.098128 / 0.081489 · [0.7,0.8) 0.054298 / 0.042632 · [0.8,0.9) 0.041191 / 0.030716 ·
[0.9,1.0] 0.047660 / 0.043520.

**LN-C1 §R5's TABLE, RE-READ ON WORLD 18** (all ground passes): below the bar
`q3.all.belowBarShare` **0.278687** (W18-E) / **0.324809** (W18-D) (≈ LN-C1 E13 0.320294, a raw-openness
bar there, a priced one here); P(opponent first | below bar) `q3.all.oppFirstGivenBelowBar`
**0.521485** / **0.514881** (≈ LN-C1 0.513958). P(opponent first | bin) runs from 0.606088 / 0.633322 in
[0.0,0.1) to 0.193600 / 0.160478 in [0.9,1.0] (`q3.all.oppFirstGivenOpenBin.*`, every bin stored).

**PRESENCE IN THE OTHER TWO CLASSES** (stored, not owner cells — §P.G): `snapshotAbsent` is
0.081985 (147 / 1,793) / 0.043059 (58 / 1,347) of arrived-in-flight and 0.034642 (308 / 8,891) /
0.016232 (163 / 10,042) of struck-through (W18-E / W18-D).

### §R5 Q4 — THE STRUCK-THROUGH CLASS: priced aim vs the realised path, by seat

**THE SEATS OVER ALL GROUND PASSES** (W18-E / W18-D): `dlcChoice` 0.030002 / 0.031652 · `dxAim`
0.097006 / 0.146466 · `plain` 0.872993 / 0.821882. Opponent first, given the seat: 0.447803 /
0.263137 · 0.377794 / 0.334956 · 0.306813 / 0.309049.

**WHERE THE CONTACT SAT against the priced segment** (share of that seat's struck-through):

| seat (W18-E / W18-D) | n | beyond the priced aim | beside the line | at the kicker |
| --- | --- | --- | --- | --- |
| `dlcChoice` | 444 / 342 | 0.747748 / 0.476608 | 0.110360 / 0.269006 | 0.141892 / 0.254386 |
| `dxAim` | 1,788 / 2,499 | 0.672819 / 0.612645 | 0.165548 / 0.154462 | 0.161633 / 0.232893 |
| `plain` | 6,659 / 7,201 | 0.275267 / 0.110401 | 0.232017 / 0.220664 | 0.492717 / 0.668935 |
| **all seats** | 8,891 / 10,042 | **0.378810 / 0.247859** | **0.212575 / 0.205835** | **0.408615 / 0.546306** |

**THE LAUNCH-MISS ANGLE** (ball velocity at release vs the priced direction; bins 0·2·5·10·20·45°),
W18-E: `dlcChoice` 0.092342 · 0.126126 · 0.177928 · 0.344595 · 0.216216 · 0.042793; `dxAim`
0.018456 · 0.025168 · 0.071029 · 0.269016 · 0.500000 · 0.116331; `plain` 0.036642 · 0.055564 ·
0.077940 · 0.171347 · 0.303499 · 0.355008. W18-D: `dlcChoice` 0.002924 · 0.035088 · 0.093567 ·
0.274854 · 0.397661 · 0.195906; `dxAim` 0.009604 · 0.012005 · 0.051220 · 0.262105 · 0.498199 ·
0.166867; `plain` 0.026385 · 0.037773 · 0.061519 · 0.116928 · 0.307457 · 0.449938.
**The priced lead's mean length** on the led seats: `dlcChoice` 608.054054 / 725.245614 cm · `dxAim`
753.147651 / 697.874350 cm (`plain` carries no lead — its cell is ENUMERATED in `emptiness`).

### §R6 Q5 — THE ARRIVED-IN-FLIGHT CLASS: the start distance and the read path

| face (W18-E / W18-D) | values |
| --- | --- |
| start distance from the priced centre line at release (bins 0·4·6·8·12·20 m) | 0.066369 · 0.573341 · 0.210820 · 0.145008 · 0.004462 · 0.000000 / 0.054937 · 0.685969 · 0.198218 · 0.058649 · 0.002227 · 0.000000 |
| his run to the ball (mean) | 708.122699 cm / 524.715664 cm |
| action on the tick before contact: `InterceptPass` · `ChaseBall` · `MarkOpponent` · other | **0.283324 · 0.658673** · 0.052984 · 0.005020 / **0.369710 · 0.547884** · 0.077209 · 0.005197 |
| action at the release tick: `InterceptPass` · `ChaseBall` · `MarkOpponent` · other | 0.043503 · 0.214166 · **0.644730** · 0.097602 / 0.047513 · 0.195991 · **0.647365** · 0.109131 |

The read path named by §CODE MAP 4 (the defender's own percept → `canInterceptPass` →
`InterceptPass`) is the action on the tick before contact on 0.283324 / 0.369710 of this class;
`ChaseBall` on 0.658673 / 0.547884. The `[20, ∞)` start bin is EMPTY on all four arms (ENUMERATED by
the zero numerator; its denominator is live).

### §R7 BESIDE — the crowding family and the completion rate (faces, not cells)

| face | `W18-E` | `W18-D` | `W13-E` | `W13-D` |
| --- | --- | --- | --- | --- |
| `beside.completionRate` | 0.598835 | 0.612160 | 0.587290 | 0.596670 |
| `beside.crowd.crashShare` | 0.440292 | 0.460234 | 0.440224 | 0.469530 |
| `beside.loftedPassesPerMatch` | 6.485485 | 6.835836 | 5.011011 | 4.609610 |
| `beside.scopedPullsPerMatch` (the E3 chooser's pulls) | 50.968969 | 59.079079 | 51.824825 | 59.172172 |

**`gBite`, THE #414 ROW FORM**: 999 of 999 seeds' W18-D and W18-E rows differ in ≥ 1 of 188 stored
cells; PRINTED FACE: the full-time signature coincides on 0.

### §R8 在说人话的层面

⛔ 这一段只把上面的数换成白话，不下结论——读数由指挥官在这张表上写。

* 世界 18 里，一脚地面传球先碰到对面的人，空账本那一档是 **0.317929**，用户玩的成熟账本那一档
  是 **0.311390**——大约每三脚有一脚。
* 这些球里（成熟账本那一档）：**0.403293** 是"人根本不在算好的那条线上，球却碰到了他"（④ 那一格）；
  **0.268193** 是"人就在线上、传球人自己的算盘也说这条线不干净，而且旁边明明有一条至少一样干净的线"
  （算盘那一格）；**0.196867** 是"人在线上、可算盘说线是干净的"（算盘的几何）；**0.054096** 是对面的人
  在球飞的时候冲进了线（防守的功劳）；**0.014096** 是传球人眼里根本没有那个人（眼睛那一格）；剩下
  **0.063454** 归不进去（算盘说不干净，但也没有更好的线）。
* ④ 那一格里要看清楚：成熟账本那一档有 **0.546306** 是在**传球人脚边**就碰上了（引擎算线的时候本来
  就把贴着传球人的人略过去），**0.247859** 是球**跑过了算好的落点**，**0.205835** 是在线的旁边。
* 截下球的那个人，出脚那一刻大多在盯人（**0.647365**）；碰球前一刻在"追球"的是 **0.547884**，在
  "去截传球线"的是 **0.369710**。

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`).

1. ⭐⭐⭐ **④ STRUCK ≠ PRICED IS THREE THINGS, AND ONE OF THEM IS THE PRICE'S OWN GUARD.** The cell is
   "the man was never in the priced corridor". By the corridor's own clear-the-kicker guard (the same
   `DV_CLEAR_RADIUS` = 1.5 m `laneOpenness` uses — "the kick clears them"), a man standing at the
   passer's feet is NEVER in the corridor. §R5 splits the cell: `atTheKicker` 0.408615 (W18-E) /
   0.546306 (W18-D) of it, `beyondAim` 0.378810 / 0.247859, `besideLine` 0.212575 / 0.205835. Only the
   last two are a ball that went somewhere other than where it was priced; the first is a ball the
   price never looked at. Stored, not re-drawn (§P.G is frozen).
2. **THE CHOICE READ IS A RECONSTRUCTION ON TRUTH, ONE TICK LATE.** The openness, the bar and the
   alternative are recomputed from the TRUTH positions read AFTER the choice step (LN-C1's form); the
   chooser read them mid-step. The target, though, was chosen off the snapshot (§CODE MAP 2), so on
   `snapshotPresent` the price the TARGET chooser paid used remembered positions — beside it,
   `perceivedInLaneGivenPresent` 0.943942 / 0.945802.
3. **"PRESENT" MEANS REMEMBERED, NOT ACCURATELY PLACED.** `snapshotPresent` = his memory holds an entry
   for the man; the entry may be stale. The ⑤ cell (`snapshotAbsent`) is the strict form only.
4. **THE PRICE'S GEOMETRY INCLUDES A FEW ARRIVALS DURING THE WIND-UP.** The in-the-lane class is
   drawn at RELEASE; the price at the CHOICE. `inLaneAtChoiceShare` 0.968511 / 0.970987 — the rest
   entered the corridor between arm and release, and those priced ≥ 0.4 sit in GEOMETRY.
5. **⑤ IS SCOPED TO THE IN-THE-LANE CLASS** (§P.G). The absent read in the other two classes is stored
   (§R4 last paragraph) and is not an owner cell.
6. **THE BAR IS THE PASS CHOOSER'S 0.4, APPLIED TO ALL THREE GROUND CLASSES.** Through balls and
   cutbacks have their own choosers; the in-the-lane class is 0.917787 / 0.895789 shortPass on W18
   (`q3.inLane.klass.*`).
7. **THE SYNCHRONOUS PRICED AIM IS ONE TICK LATE** (the target's post-step position + the deposit), and
   the `dlcChoice` seat is READ as an unconsumed DX deposit — a reading of the engine's own field, not
   a flag the engine sets for the purpose.
8. **Q5's "read path" is the action type, not the decision's why.** `InterceptPass` names the
   percept-read path of §CODE MAP 4; `ChaseBall` (assigned presser / loose ball) is a different path
   and dominates the tick before contact. The `[0, 4)` start bin (0.066369 / 0.054937) is non-empty
   because the corridor clamps at the aim and skips the kicker's 1.5 m, so a man within 4 m of the
   centre line can still be outside the corridor.
9. **THE W13 ROWS AND THE STARTING TABLES ARE ≈.** BN-C0 / LN-C1 were walked on arm64, on other blocks,
   and BN-C0 on world 12; this census books the flights BN-C0 dropped (§P.C ordering 1). No
   comparison carries a verdict word.
10. **THE LOFTED CLASS HAS A FIRST BODY ONLY.** The corridor and the ownership mapping are ground notions.
11. **NO GATE MEASURES QUALITY.** Every one of the 19 is a liveness or a receipt.
12. **ONE HEAD, ONE BLOCK.** Every number is `170a5fa`'s `src/` on x64, N = 999.

## §DEVIATIONS (declared by the executor; the commander disposes)

1. **BN-C0's split is WORLD 12, not world 13.** #426 item 2 calls BN-C0's split "on world 13"; BN-C0's
   own §P.A builds `a4MatchFlags(12)` (`RA_WORLD_VERSION` = 12). The W13 reference rows are LN-C1's
   composition (world 13); BN-C0's numbers are quoted as world 12, ≈. No gate depends on it.
2. **gRepro IN TWO HALVES** (§P.B). IF-T1b's arm is a world-13 composition, so its stored signatures
   pin the host + recipe + door set; world 18 differs from it by exactly `gkDiveBody` and
   `lnOwnLanePrice` (and world 14's gene pin), STORED. The gate's meaning — the construction is the
   exam's, on this host, exactly — holds for the door set, as at IF-ENTRY §2.
3. **THE FOLLOW-FIRST ORDERING AND THE SUPERSEDED BOOKING** (§P.C) depart from BN-C0's loop so that
   every ground release enters the partition. Declared before the freeze.
4. **NINETEEN GATES, not IF-C0's twenty-one.** No `gPullCount` (the wrapper adds no pull — it observes
   the engine's own calls; `gLockstep` carries inertness); no `gCodeFactGraph` (the code map is
   needle-anchored, 29 occurrence-counted needles; the load-bearing truth-read fact is a runtime
   boolean per walk); no `gTwoFractions` (every face stores num and den). Added: `gPartition`.
5. **N = THE AFFORDANCE (999) against `nRequired` 10** (the #414 §CORR 8 floor reading; the residue
   and ⑤ are rare cells).
6. **ONE CONSTANT TRANSCRIBED AFTER THE SMOKE, BEFORE THE FREEZE** — `HW_SMOKE_RECORD`
   (§DEV-PREFLIGHT 2).
7. **THE SEAT NAMES.** "DLC choice" is read as the synchronous led strike and "DX aim" as the wound-up
   led strike; both carry a led candidate the DLC contest elected (§CODE MAP 3). `plain` is to feet.
8. **THE STATUS PARAGRAPH** above §0 moved at RESULTS (the IF-C0 practice); §0–§DEV-PREFLIGHT did not.

## §GATES — 19 of 19 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | ✅ | what it asserts (the notes are stored in `gates[]`) |
| --- | --- | --- |
| `gRepro` | ✅ | 12/12 IF-T1b `OWNCOOP+IF-E13` stored x64 signatures reproduced on 12,560,000–011, BEFORE any census seed; `a4MatchFlags(18)` ≡ `{...a4MatchFlags(17), ifFlightRun}`; the key difference enumerated |
| `gLockstep` | ✅ | 8/8: the observing wrapper on `perceivedSnapshot` leaves every arm's whole-match signature byte-identical |
| `gDeterminism` | ✅ | X-DET 8/8: signatures AND row bytes identical across two observed walks |
| `gFingerprintProd` | ✅ | in-process `59f42aa7…a072d` = the x64 pin (and `npm run fingerprint` printed the same at RESULTS) |
| `gSrcUntouched` | ✅ | `git diff 170a5fa -- src/ tests/` 0 bytes; porcelain 0 bytes |
| `gWorld` | ✅ | every walked match on its arm's world, `inSnapshotLaw` absent, `edsPerceivedChoice` on, `info.genome` clean; the constructed pin; dose bytes pinned |
| `gSeedsBookedEqualWalked` | ✅ | 999 × 4 + 4 = 4,000 walks |
| `gSeedDisjoint` | ✅ | inside 12,561,000–999; 17 consumed blocks below; no SIM seed ≥ 12,562,000; ZERO stats |
| `gN` | ✅ | N_FROZEN 999, no override env |
| `gScratchBand` | ✅ | every scratch seed from the ONE base 900,009,200; verifier 900,009,300–399 disjoint |
| `gAnchoredConstants` | ✅ | 29/29 code-map needles at their counts; the bar and the playmaker multiplier parsed |
| `gPredicateFixtures` | ✅ | 82/82 (every owner cell fires and its neighbours do not; the presence test, the alternative, the bar, both corridor widths, the seat, the bins, the seed ceiling) |
| `gLedgerRead` | ✅ | 8 engine records, 5 declared reconstructions (stored) |
| `gPartition` | ✅ | owner cells = population EXACTLY per arm and per seed (70,563 · 79,964 · 74,541 · 83,376); residue 963 · 1,580 · 1,426 · 2,245 |
| `gClassesNonVacuous` | ✅ | on both W18 arms the opponent-first class, all three split cells, the scoped pulls and the wind-ups are live; empty-denominator faces ENUMERATED |
| `gBite` | ✅ | the #414 ROW form: 999/999 rows differ; signature coincides on 0 (printed, gates nothing) |
| `gFaces` | ✅ | every face re-derived from the SERIALIZED per-seed cells off disk; the ownership table re-derived |
| `gHashOrder` | ✅ | the 28-key allowlist; body hash last; reproduces from the file |
| `gStage` | ✅ | `stage.instrumentSha256` = the running file's hash |

**CONSUMPTION.** Block `12,561,000–999` consumed whole. Scratch `900,009,200–299` (executor); the
verifier's band is `900,009,300–399`. ZERO stats: `stats: { consumed: 0, nextBase: 117_600,
registryOfRecord: 88 }`. Next sim ≥ **12,562,000**.

## §COMMANDER CORRECTIONS (ruling #427 — the verifier's PASS, two MEDIUM, four LOW, disposed; ⛔ no frozen byte and no stored number moves)

The independent verifier returned **PASS** (freeze intact: the instrument 0 bytes FREEZE → RESULTS, §0–§DEV-PREFLIGHT
byte-identical, `stage.instrumentSha256` = the FREEZE blob; every numeral in §R and §HONEST LIMITS traced to the
artifact; the partition re-derived off disk for 999 seeds × 4 arms with zero failures; gRepro's 12 rows compared
against IF-T1b's stored x64 signatures). The findings are READINGS, not instrument bugs; each is disposed here, and
where it contradicts a sentence above, **this section governs**.

1. **MEDIUM — `atTheKicker` is NOT "at the passer's feet". ACCEPTED.** The frozen code (`whereOf`, l.410–413) and its
   fixture (`where.atKicker` = `whereOf(0, 0, 20, 0, 1, 5)`: one metre along, FIVE metres to the side) book a contact
   whose PROJECTION onto the priced line falls within `DV_CLEAR_RADIUS` of the launch, or behind it — at ANY lateral
   distance. §P.F's prose ("within `DV_CLEAR_RADIUS` of the launch point") is the narrower reading; **the frozen code
   is the instrument and governs** (the predicate is not re-drawn after sight). ⇒ HONEST LIMITS 1's sentence "only
   the last two are a ball going somewhere other than where it was priced" and §R8's 「在传球人脚边就碰上了」 are
   **WITHDRAWN**: the stored cell `atTheKicker` 0.408615 (W18-E) / 0.546306 (W18-D) mixes men at the feet with balls
   that left the priced line early and sideways; the split between those two is **NOT STORED**. ④'s owner cell is
   read WHOLE (0.396318 / 0.403293 of opponent-first), its sub-split is not read.
2. **MEDIUM — "the passer's own bar" is a reconstruction. ACCEPTED.** The engine's gate is
   `if (gain > 0.15 && lane < 0.4)` — forward passes only, a soft score multiplier, applied inside `groundCandidate`
   on truth; for snapshot-seated targets (`snapshotPresent` 0.775664 of the in-lane class, W18-D)
   `choosePerceivedPassTarget` priced the threat on the snapshot with no 0.4 bar. ⇒ THE PRICE vs THE PRICE'S GEOMETRY
   is a truth-side reconstruction of a bar the deciding chooser mostly did not apply. **Read of record: the UNION is
   solid** — the man was in the lane at release and the passer's read held him (THE PRICE + ITS GEOMETRY + the
   residue = 0.268193 + 0.196867 + 0.063454 of opponent-first, W18-D); **the split between those cells is ≈, never
   a lever's evidence.** §CODE MAP 2's "the
   is-this-lane-clear bar is read off truth" holds for `groundCandidate` only.
3. **LOW — BN-C0 did not DROP the overwritten flight.** It counted it at release and booked it `none` by
   subtraction. §P.C's sentence is corrected to that; the declared departure (OP-C0 follows the pending flight before
   reading the tick's releases) stands, and first-body shares stay ≈ to BN-C0's.
4. **LOW — `residueNoChoiceRead` 0 is structural, not measured.** `choiceReadOf` runs for every ground release, so
   the cell cannot fire; it is an accounting placeholder.
5. **LOW — the W13 columns.** They are x64 measurements of THIS census (exact on this host); only their comparison
   to BN-C0 / LN-C1 (arm64) is ≈. HONEST LIMITS 9 is read so. In §R2–§R7 the W13 columns are reference columns
   throughout, as §R1 labels them.
6. **LOW — two prose overreaches.** (a) §R8's 「截下球的那个人，出脚那一刻大多在盯人（0.647365）」 covers the
   arrived-in-flight class only (872 / 1,347 on W18-D), not every opponent who touched the ball first. (b) The
   synchronous `dlcChoice` aim adds the DX deposit lead — declared in §P.D, now also listed as a departure from
   BN-C0's E (target position for every synchronous pass); the split is BN-C0's FORM, not its byte.

**WHAT THE TABLE SAYS AFTER THE CORRECTIONS (W18-D, share of the 24,900 opponent-first ground passes):** the man was
in the lane at release — 0.542610 (`q2.wide.corridorAtRelease`), of which the passer's read held him on all but the
⑤ cell (THE PRICE 0.268193 + ITS GEOMETRY 0.196867 + the residue 0.063454, the split ≈); the contact was off the priced
corridor — 0.403293 (④, read whole); the defence ran into the flight — 0.054096; the passer's read
did not hold the man — 0.014096 (351 passes). ⑤ PERCEPTION owns almost none of 「传到对面身上」.
