# OP-C0 — 「传到对面身上 · 普查」 THE OPPONENT-FIRST CENSUS（传球先碰到对面的人时，这一脚算谁的）

> **STATUS: FREEZE.** §0 through §DEV-PREFLIGHT and the instrument are sealed at the FREEZE commit,
> BEFORE any battery seed is walked. After it they stay byte-identical; only this STATUS paragraph
> moves, and §R onward is appended in the RESULTS commit.
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
