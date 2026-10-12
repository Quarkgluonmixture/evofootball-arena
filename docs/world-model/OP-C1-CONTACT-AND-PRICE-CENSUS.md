# OP-C1 — 「近身与算盘」 THE CONTACT-AND-PRICE CENSUS（④ 那一格按两段距离拆开；在线上那一格按真正拍板的那个选择器自己的算盘读）

> **STATUS: WALKED — the battery is complete, ALL 19 GATES ARE GREEN (`allGreen` = a STORED `true`),
> and QA and QB are answered as STORED PARTITIONS at §R.** §0 through §DEV-PREFLIGHT and the instrument
> were sealed at the FREEZE commit **`d22121b`** BEFORE any battery seed was walked and were NOT edited
> after sight (only this STATUS paragraph moved; §R onward was appended).
> Authorized by **COMMANDER RULING #428 item 3** (a CENSUS; X-SRC-ZERO; Draft + independent Verify in
> OP-C0's form). It reads the two splits OP-C0 did not store (#427 items 2(i)–(ii), 4).
> Census form of record: [`OP-C0-OPPONENT-FIRST-CENSUS.md`](OP-C0-OPPONENT-FIRST-CENSUS.md) (§0 / §P /
> §CODE MAP / §DEV-PREFLIGHT / §R / §HONEST LIMITS / §DEVIATIONS / §GATES, the gate idioms, the hash /
> allowlist / RED-routing idiom), read **through its §COMMANDER CORRECTIONS**, which govern every OP-C0
> reading this census leans on.
> Instrument: [`scripts/probes/op-c1-contact-and-price-census.ts`](../../scripts/probes/op-c1-contact-and-price-census.ts)
> — OP-C0's walker, predicates, row schema and owner mapping are **COPIED BY RECIPE, ⛔ NEVER
> IMPORTED** from [`op-c0-opponent-first-census.ts`](../../scripts/probes/op-c0-opponent-first-census.ts)
> (frozen at `a40b502`), each cited at its site by OP-C0's own line numbers: the envelope l.60–92, the
> arm construction and `signatureOf` l.252–295, the population and first-body channel l.301–339, the
> corridor / split / bins l.342–374, the bar · alternative · presence · seat · where-cell · owner
> mapping l.377–447, the choice read l.615–639, the walker l.644–863, `bookFlight` l.866–935, the faces
> l.940–999, the bootstrap l.1019–1048, the fingerprint l.1146–1155, the sizing form l.1280–1296.
> Artifact: `docs/world-model/data/op-c1-contact-and-price-census.json` (compact JSON, body hash last;
> **or its `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS as **STORED PARTITIONS**. It ships nothing,
> adjudicates nothing and scores no hypothesis. ⛔ **NO VERDICT WORD** is written on any face.
> ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited; no frozen probe (OP-C0's
> included) and no pinned test is touched.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S SENTENCE** (copied from its quotation at
[`OP-C0-OPPONENT-FIRST-CENSUS.md`](OP-C0-OPPONENT-FIRST-CENSUS.md) l.38):

> 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」

**WHERE OP-C0 LEFT IT** (the read of record, #427 item 3, W18-D, share of the 24,900 opponent-first
ground passes): in the lane at release **0.542610** (`q2.wide.corridorAtRelease`), held in the passer's
read on all but ⑤'s **0.014096**; the contact off the priced corridor (④, read WHOLE) **0.403293**; the
defence ran in **0.054096**.

**WHAT #428 ASKS** (item 3, and #427 item 4 VERBATIM): *"(i) ④ whole → its contact by ALONG-LINE and
LATERAL distance separately (a man at the feet that the price's own clear-radius skips — the price's
guard; vs a ball that left the priced line early — technique / weight; vs a man who stepped across);
(ii) the in-lane class → priced by the chooser that ACTUALLY decided (the snapshot chooser's own
threat price for snapshot-seated targets; `groundCandidate`'s gate WITH its gain clause and its soft
form for the rest), so "he priced it open" vs "he priced it shut and played it anyway" is read off the
decider, not reconstructed."*

### 在说人话的层面

OP-C0 留下两个大格子没拆开：④（"人不在算好的那条线上，球却碰到了他"）和"人就在线上"那一格。
这次只做两件事：**QA** 把 ④ 里每一次碰球的位置，按"沿着算好的线走了多远"和"离那条线横着多远"两段
距离分开存，再按事先写死的三种读法归类——人就在脚边、算盘自己的"踢球会把他甩开"那个半径把他略过
了；球在到落点之前就离开了算好的线；那个人自己横着插了过来——剩下归不进去的照实打印。**QB** 把
"人在线上"那一格，按**当时真正拍板选人的那个选择器**分开（用快照选人的那个，还是按真实位置打分的
那个），并读它**自己**的算盘：它当时是把这条线算成"能过"还是"不干净"，然后照样传了。不修任何东西，
不下结论。

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — TWO, PAIRED on shared seeds

| arm | world | dose | role |
| --- | --- | --- | --- |
| **`W18-E`** | 18 (`a4MatchFlags(18)` + `armA4World(m, null, 18)`) | none | OP-C0's W18-E, COPIED by recipe |
| **`W18-D`** | 18 | the SHIPPED loaders' L3 + PC doses (`loadL3Dose` / `loadPcDose`, CALLED; file BYTES hashed against their pins) | OP-C0's W18-D — the world as the user plays it |

* The arm construction is OP-C0's `buildMatch` (l.264–273) **COPIED**, with DS-C0's team builder
  (OP-C0 l.252–260). OP-C0's W13 reference rows are **not walked** (#428 item 3(i): W18-E · W18-D only).
* **THE OBSERVERS.** On every observed walk the instrument (1) wraps `match.perceivedSnapshot` with
  OP-C0's OBSERVING wrapper (l.663–679, COPIED), and (2) **opens the E3 chooser's own trace door**
  (`match.traceChoice = true` on the constructed match — the engine's own construction option, default
  OFF, documented in `src/sim/Match.ts` as *"Pure observation — it must not change a single tick"*).
  Both observers are proven INERT: by `gLockstep` (observed vs unobserved whole-match signatures) and
  again by `gRepro` (OP-C0 walked with NEITHER the trace nor any OP-C1 code; its stored signatures must
  reproduce with both open).
* **`gWorld`** asserts on EVERY walked match: `ifArmedVersion` 18, `inSnapshotLaw` ABSENT,
  `edsPerceivedChoice` ON, `info.genome` free of any OBM matrix, the trace door SHUT at construction,
  `forcedPassTarget` null; and on a constructed pin at scratch **900,009,470** that
  `edsPerceivedDefence`, `edsValueAxis`, `dxWindupAim`, `dlcDeliveryChoice`, `o1PassWindup` and
  `lnOwnLanePrice` are ON and `pwWeightChooser` / `ptpPassLead` ABSENT.

### §P.B gRepro — FIRST, against OP-C0's STORED per-seed cells

#428 item 3(i): OP-C0's stored per-seed **W18-E** and **W18-D** cells on **12,561,000–011**
(`docs/world-model/data/op-c0-opponent-first-census.json`, `perSeedCells[]`, walked on THIS host ⇒
EXACT) are reproduced by this instrument BEFORE any census seed: for each of the 12 seeds × 2 arms,
(a) the whole-match `signature` equals OP-C0's stored one, AND (b) the instrument's **OP-C0 sub-row** —
OP-C0's `ROW_SCHEMA`, all **45 keys** (188 cells: the eight owner cells, the split, the presence test,
the seat, the where-cell, every Q3–Q5 counter), in OP-C0's key order — equals OP-C0's stored row
**cell for cell**. ⇒ OP-C0's population, corridor test, widths, seat reading and owner mapping are the
copies, and every OP-C0 owner cell re-prints equal to OP-C0's per-seed value on the gRepro seeds.
These seeds are OP-C0's own consumed band: re-walking them is **not a consumption**. **If gRepro is
red, no census seed is walked** and the artifact is RED-routed.

### §P.C POPULATION — OP-C0's, COPIED

Every ground pass release (`shortPass` / `throughBall` / `cutback`, ground launch, a target — BN-C0's
`isMeasurableGroundPass`), its first body by `contactClassOf` off `ball.lastTouch`, OP-C0's two declared
orderings (follow-first; a superseded flight booked `none`), the three-way split at OP-C0's two frozen
half-widths (WIDE `DV_CORRIDOR_SCALE` = 4 m, TIGHT `CONTROL_RADIUS`) through `closestPointOnSegment`
with the clear-the-kicker guard `DV_CLEAR_RADIUS` = 1.5, the priced aim E (wind-up `aim + aimLead`;
synchronous: the target's position + an unconsumed DX deposit's lead), the choice step (arm step /
release step), the choice read and presence test on the snapshot pull, the seat (`dlcChoice` · `dxAim` ·
`plain`) and the **owner mapping** (OP-C0 §P.G) — all COPIED (OP-C0 l.301–447, l.615–935). The OP-C0
table is re-printed per arm on this block at §R, as a share of opponent-first, **unchanged in
definition**. ⛔ No OP-C0 owner cell is re-drawn.

**THE TWO NEW CLASSES' DENOMINATORS:** **QA** = the struck-through class (opponent first ∧ the WIDE
split's `struckThrough` — OP-C0's ④ cell, whole). **QB** = the in-lane class (opponent first ∧ the WIDE
split's `corridorAtRelease` — OP-C0's PRICE + PRICE'S GEOMETRY + ⑤ + both residues).

### §P.D ⭐⭐⭐ QA — ④ WHOLE, SPLIT BY TWO DISTANCES (frozen)

**THE LINE.** The priced line is OP-C0's segment from the launch point L (the ball's position at the
release tick minus one tick of its velocity) to the priced aim E. For a body position P,
`lineGeomOf(L, E, P)` returns:

* `t` — the **along-line** projection: `(P − L) · û` in metres, `û` the unit vector L→E (negative =
  behind the kicker);
* `lat` — the **lateral** distance, SIGNED: `û × (P − L)` (left of L→E positive), the perpendicular
  distance to the INFINITE line;
* `seg` — the distance to the priced **segment** (OP-C0's `centreLineDistOf`, the corridor's own
  closest-point distance);
* `len` — the segment's length. A degenerate line (`len` ≤ 1e-9, OP-C0's `whereOf` guard) has `t` = 0,
  `lat` = |P − L| with sign 0, `len` = 0.

**THE CONTACT** is the first-touch opponent's position on the tick `ball.lastTouch` names him (OP-C0's
channel). **AT RELEASE** is his position on the release tick (OP-C0's `oppAtRelease`).

**THE FROZEN BINS** (lower edges; the last bin open):

| bin set | edges (metres) |
| --- | --- |
| ALONG `t` | −∞ (behind) · **0** · **`DV_CLEAR_RADIUS` (1.5)** · 4 · 8 · 15 |
| LATERAL `|lat|` | 0 · **`DV_CLEAR_RADIUS` (1.5)** · **`DV_CORRIDOR_SCALE` (4)** · 8 · 15 |
| the opponent's distance to the PASSER at release | 0 · 1.5 · 4 · 8 · 15 · 25 |

The lateral edges include the wide corridor's half-width **at the contact**: the copied corridor test
takes ONE constant `halfWidth`, so that half-width is `DV_CORRIDOR_SCALE` = 4 m at every point of the
segment. **The 2-D table** is ALONG × LATERAL (6 × 5), stored per seat. **The opponent's distance to the
PASSER at release** = the Euclidean distance between the first-touch opponent's release-tick position
and the passer's release-tick position.

**THE MOVE** (`movedOf(latRelease, latContact)`): between release and contact the man **crossed** the
priced line (the signed lateral at release and at contact are both non-zero and of opposite sign) **or
closed** on it by at least `DV_CLEAR_RADIUS` (|lat| at release − |lat| at contact ≥ 1.5 m). `lat` at
release is his release-tick position against the same line.

**⭐⭐⭐ THE THREE READINGS + LEFTOVER** (`readingOf`, frozen; precedence top to bottom; every struck-
through contact in exactly one, stored **by seat** — `dlcChoice` · `dxAim` · `plain`):

| # | reading (#427 item 4(i)) | predicate on the stored distances |
| --- | --- | --- |
| a | **`guardSkip`** — a man at the feet that the price's own clear-radius skips | `t < DV_CLEAR_RADIUS` (1.5, or behind the kicker) **∧** `seg < DV_CORRIDOR_SCALE` (4): the corridor would hold him but for the clear-the-kicker skip |
| c | **`steppedAcross`** — a man who stepped across | not (a) **∧** THE MOVE |
| b | **`leftLineEarly`** — a ball that left the priced line early | not (a) **∧** not THE MOVE **∧** `t ≤ len` (not past the aim) **∧** `|lat| ≥ DV_CORRIDOR_SCALE` (4) |
| — | **`leftover`**, PRINTED | everything else — chiefly a still man met PAST the aim (`t > len`), and a still man behind the kicker off the segment with `|lat| < 4` |

* ⚠ (b) is decided by `t ≤ len` and `|lat| ≥ 4` ONLY, so it also holds a still man met within 1.5 m
  along, or behind the kicker, when he is ≥ 4 m to the side (OP-C0's own `where.atKicker` fixture —
  one metre along, five aside — is a (b) here: fixture `reading.guard.notWhenFiveAside`).

* ⚠ The precedence is **(a) → (c) → (b)**: a man who moved is never booked as "the ball left the
  line", and a man at the feet is booked (a) whether or not he moved. The prose order a · b · c is
  #427's; the code order is above, and it is the instrument.
* **WHY THESE EDGES:** `DV_CLEAR_RADIUS` is the price's own skip (`laneOpenness`: *"Ignore defenders
  standing right on top of the passer — the kick clears them"*, `if (dist(cp, from) < 1.5) continue;`)
  and OP-C0's corridor guard; `DV_CORRIDOR_SCALE` is the price's own lane scale (`clamp01(d / 4)`) and
  OP-C0's WIDE half-width. Nothing is tuned after sight.
* OP-C0's where-cell (`beyondAim` · `besideLine` · `atTheKicker`, its `whereOf` COPIED) stays stored in
  the OP-C0 sub-row; `gPartition` checks it sums to the same struck-through count.

### §P.E ⭐⭐⭐ QB — THE IN-LANE CLASS PRICED BY THE CHOOSER THAT DECIDED (frozen)

**THE CHOICE STEP** is OP-C0's (the wind-up's ARM step; a synchronous release's own step).

**FRESH DECISION.** On the choice step, the passer's `action.scores` array is a different object after
the step than before it (every carrier decision writes a new `scores` array: `cands.slice(0, 4)`, or
the kick-off's literal). Without a fresh decision the decider is `unread`.

**⭐⭐ WHO SEATED THE TARGET** (`deciderOf`, frozen, first match wins; read off the engine's own path —
§CODE MAP 1):

| decider | predicate |
| --- | --- |
| `unread` | no fresh decision on the choice step |
| `cutback` | the release's klass is `cutback` (the team's licensed arriver, `performCutback`) |
| `throughBall` | the release's klass is `throughBall` (the through-ball scorer's `bestRunner`) |
| `kickoff` | the fresh decision's top `why` is the kick-off play-back's own string `kickoff — played back` |
| **`snapshot`** | the E3 chooser's trace entry for this passer on the choice step has `chosenGid ≥ 0` AND it is the released target (`chosenGid ≥ 0` but another target ⇒ `unread`) |
| **`groundCandidate`** | the fresh decision's top action is `Pass` and the E3 chooser did not re-seat it (no trace entry — a keeper passer, or the chooser not reached — or `chosenGid = −1`, no executable option) ⇒ `passMate = bestMate`, the legacy truth argmax |
| `unread` | anything else |

**⭐⭐ THE SNAPSHOT CHOOSER'S OWN PRICE** (snapshot-seated targets; all read off its trace entry):

* the chosen option's **own stored `price`** (`options[].price` for `chosenGid` — EV̂ under the value
  axis, times the own-lane factor: the compared quantity) — binned at **0 · 0.05 · 0.10 · 0.15 · 0.25**
  and summed (stored ×1e6, integer);
* its **threat band** (`options[].band` — `threatBandIndex` of the passer's own corridor read; −1 when
  the option is `SEEN-UNREAD`) — all six stored;
* ⭐ **PRICED SHUT** ⇔ the option is `READ` AND its band is one whose calibrated clean-control price
  (`THREAT_CALIBRATION[band].realizedSuccess`, the very number `threatQuintilePrice` returns as that
  option's reception) is **below one half** — the bands are DERIVED from the shipped table at run time
  (`SHUT_BANDS`, a fixture pins it to `[3, 4]`); the one half is this census's **declared coin**
  ("more likely lost than kept"), not an engine bar. `READ` in any other band = **PRICED OPEN**;
  `SEEN-UNREAD` = **`snapUnread`** (no corridor read);
* **THE HIGHER-PRICED ALTERNATIVE** (`higherPricedAltOf`): an EXECUTABLE option of the same menu, other
  than the chosen one, whose `price` is STRICTLY greater than the chosen option's;
* beside: whether the chooser's pick equals the legacy pick (`legacyGid`).
* **THE JOIN** (LN-C2 / LN-C3's form): the step's new `passChoiceTrace` entries are drained into a map
  keyed by `passerGid`; a second entry for the same passer in one step OVERWRITES the first and is
  COUNTED (`traceDuplicateKeys` — LN-C3's stored debt of LN-C2 §CORR 7), never hidden.

**⭐⭐ `groundCandidate`'S OWN PRICE** (groundCandidate-seated targets). `groundCandidate` is a closure
local of `decideCarrier`; its `s` cannot be read without a `src/` edit. Its gate's INPUTS are
recomputed with the engine's own expressions at the positions the brain decided on — the **PRE-STEP**
positions (every brain decides before any executor or physics step, §CODE MAP 1(e)):

* `aim` = the target's pre-step position + the lead (the wind-up record's `aimLead`, or this passer's
  unconsumed DX deposit, else 0) — the candidate the argmax elected;
* `lane` = `min(1, laneOpenness(passer, aim, opponents) × (playmaker ? 1.15 : 1))`, `laneOpenness`
  CALLED on the opponents at their pre-step positions (each with its current `sentOff` flag);
* `gain` = `clamp01((localX(aim.x) − localX(passer.x) + 30) / 60) × 2 − 1`;
* **THE GATE, AS THE ENGINE WRITES IT:** fired ⇔ `gain > 0.15 ∧ lane < 0.4` (the 0.15 and the 0.4
  PARSED from the anchored line) — **`gcGateFired`** = PRICED SHUT; `lane < 0.4` without the gain clause
  = **`gcBelowBarNotForward`** (the gate does not fire); `lane ≥ 0.4` = **`gcOpen`**;
* **its multiplier** (fired only): `gate + (1 − gate) · stagnation · 0.4`, `gate = 0.35 +
  riskTolerance · 0.65`, `stagnation = clamp01((staleTime − 3) / 5)` read off the team's pre-step stale
  clock, `riskTolerance` off `team.genome` (the effective genome the decision reads; rewritten only at
  the team-brain tick at the HEAD of the step, before the decide loop) — binned at **0 · 0.5 · 0.65 ·
  0.8 · 0.9** and summed (×1e6, integer);
* **THE HIGHER-SCORED CANDIDATE**: a `groundCandidate`-seated target IS the scorer's strict argmax
  (`feet.s > bestPass` / `ledCand.s > bestPass`, l.771 / l.790), so a candidate the same scorer scored
  higher **cannot exist by construction**; what the instrument can measure is that the seated target IS
  the argmax winner: the decision's own `why` names `bestMate` (`to <name> · lane <bestLane> · …`), and
  the receipt `gcWhyMateIsTarget` counts the passes whose released target is that man. Beside it,
  `gcWhyLaneAgrees` counts the passes whose recomputed `lane.toFixed(2)` equals the engine's own printed
  `bestLane` — the reconstruction's fidelity receipt. (Declared at §P.K.)

**⭐⭐⭐ THE QB PARTITION** — every ground pass, and separately the in-lane class, in exactly one cell:
`snapOpen` · `snapShut` · `snapUnread` · `gcOpen` · `gcBelowBarNotForward` · `gcGateFired` ·
`throughBall` · `cutback` · `kickoff` · `unread`.
**"PRICED SHUT AND PLAYED"** = `snapShut` + `gcGateFired` (the decider's own price said shut, and the
pass was played). ⛔ **QB is a NEW partition printed BESIDE OP-C0's owner table** — the in-lane class is
also stored as the cross-table QB cell × OP-C0's in-lane owner (`price` · `priceGeometry` ·
`perception` · `residueBelowBarNoAlternative` · `residueNoChoiceRead`); no OP-C0 cell moves.

### §P.F THE PRE-REGISTERED QUESTIONS — answered as STORED partitions, ⛔ no verdict word

> **QA** For the struck-through class, per arm: the along-line and lateral bins, the 2-D table, the
> opponent's distance to the passer at release, and the three readings + leftover — pooled and by seat.
>
> **QB** For the in-lane class, per arm: the decider partition, PRICED SHUT AND PLAYED, the snapshot
> chooser's band / price / higher-priced alternative, the gate's multiplier; the same partition over
> all ground passes; and the cross-table beside OP-C0's owners.
>
> **BESIDE** OP-C0's table re-printed on this block (first body, the split, the owners, per seat).

### §P.G THE ESTIMATOR, THE SEEDS AND THE SIZING

* **THE ESTIMATOR** (OP-C0's): per-seed counters; every face a pooled ratio of summed cells; a
  **CLUSTER BOOTSTRAP over match seeds**, 2,000 draws, mulberry32 seeded from the block base
  12,562,000, percentile intervals at 2.5 % / 97.5 %, on levels per arm and on the **PAIRED Δ
  W18-D − W18-E**. **ZERO stats**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 88 }` —
  the E3 trace is an engine record already read of record (EDS E5g; LN-C2 and LN-C3 joined passes to
  it — `docs/world-model/LN-C3-UNTRACED-FAMILY-CENSUS.md` §GATES `gLedgerRead`: *"the engine's own
  `passChoiceTrace` read, never written"*), not a new ledger read; the registry stays **88**.
* **THE BLOCK** (#428 item 3(vi)): battery **12,562,000–12,562,998**; construction receipt
  **12,562,999**. BOOKED = WALKED: **999 × 2 + 2 = 2,000 walks**. ⛔ Never a SIM seed ≥ 12,563,000 (a
  fixture proves one past the ceiling WOULD be caught).
* **THE RE-WALKS** 12,561,000–011 are OP-C0's own consumed band (canon, VERBATIM, CANON.md l.157–159:
  *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥
  900,000,000) — never the next virgin block"*, home: PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER
  CORRECTIONS item 6).
* **SCRATCH**, all from the ONE base **900,009,400**, inside 900,009,400–499: the sizing smoke 400–411,
  the smoke receipt 420, the world pin 470, the lockstep / X-DET pair 490–491. The verifier's
  **900,009,500–599** is asserted disjoint.
* **THE SIZING FORM** (OP-C0 §P.I's, the house form): `se(n) = hw(n)/z.975` · `se(needed) =
  0.05/(z.975 + z.80)` · `N = ceil(n · (se(n)/se(needed))²)`, at the declared **0.05** target on
  **`qb.inLane.pricedShutAndPlayed@W18-D`** (#428 item 3(vi)), measured on the disclosed 12-seed smoke
  (§DEV-PREFLIGHT). The battery walks **THE AFFORDANCE (999)** whatever `nRequired` says — the #414
  §CORR 8 floor reading: the QA readings by seat and the QB cells by owner are rare classes sized by
  nothing but volume — and says so.

### §P.H THE GATE SET (frozen ex ante) — NINETEEN

`gRepro` (FIRST, §P.B) · `gLockstep` · `gDeterminism` (X-DET) · `gFingerprintProd` (X-FP-PROD:
in-process `npm run fingerprint` recipe = the x64 value of record `59f42aa7…a072d`; `npm run
fingerprint` is also run at RESULTS) · `gSrcUntouched` (X-SRC-ZERO: `git diff 41c3a17 -- src/ tests/`
EMPTY, `git status --porcelain -- src tests` EMPTY, and `git diff 170a5fa 41c3a17 -- src/` EMPTY) ·
`gWorld` · `gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` · `gScratchBand` · `gAnchoredConstants`
(56 code-map needles at their occurrence counts — OP-C0's 29 + 27 new; canon, VERBATIM, CANON.md
l.55–56: *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's site"*;
the gate's 0.15 / 0.4, its multiplier's 0.35 / 0.65 / 0.4, the stagnation's 3 / 5, the gain's 30 / 60
and the playmaker 1.15 PARSED from their anchored lines) · `gPredicateFixtures` (OP-C0's copies re-run,
and every NEW predicate firing AND not firing: the two distances, their frozen bins, the passer-distance
bins, the move, the three readings + leftover with their neighbours, the decider identity, the shut
bands derived from the table, the gate and its multiplier, the stagnation and the gain, the QB cell, the
higher-priced-alternative test, the why read, the seed ceiling; canon, VERBATIM, CANON.md l.58–60: *"a
scored face's walk-side predicate is pinned — anchored extraction or fixture — because the
re-derivation gate proves arithmetic, not definitions"*) · `gLedgerRead` (10 engine records, 8 declared
reconstructions, stored) · **`gPartition`** (per arm AND per seed: OP-C0's owner partition; **QA** — the
readings, the 2-D table, the along / lateral / passer-distance bins and OP-C0's where-cell each sum to
the struck-through count, and per seat the readings sum to OP-C0's `struckSeat`; **QB** — the in-lane
partition and its owner cross-table sum to the in-lane count, the all-ground partition to the ground
population, the snapshot bands to the snapshot-seated in-lane count, the multiplier bins to
`gcGateFired`) · `gClassesNonVacuous` · **`gBite`** (the #414 ROW form; canon, VERBATIM, CANON.md
l.108–111: *"a liveness receipt for a switch whose effect is a RARE EVENT compares the per-seed ROW (any
stored field), not the full-time signature — a full-time state snapshot is not a trajectory hash and a
hat's whole effect can be absorbed before the whistle"*) · `gFaces` (every face, the ownership table and
the three partitions re-derived from the SERIALIZED per-seed cells off disk) · `gHashOrder` (30-key
allowlist, body hash last) · `gStage`.

⛔ **EVERY GATE IS A LIVENESS OR A RECEIPT. NOT ONE GATES A DIRECTION.** The reconstruction receipts
(`gc.receipt.*`, `receipt.windupAimAgreesShare`, `snap.all.higherPricedAlt`) are PRINTED faces; none is
gated.

### §P.K DEPARTURES DECLARED BEFORE THE FREEZE

1. **THE TRACE DOOR IS OPENED BY THE INSTRUMENT** on the constructed match (`traceChoice = true`), not
   passed to the constructor as LN-C2 did (`traceChoice: true` on its construction): the arms are built
   by OP-C0's recipe byte for byte, and the door is an observer like OP-C0's wrapper. Inertness is GATED
   twice (§P.A).
2. **"A CANDIDATE THE SAME SCORER SCORED HIGHER" (groundCandidate) IS ANSWERED BY THE CODE MAP, NOT
   MEASURED.** The seat IS the strict argmax over the scorer's own `s`, a closure local; the instrument
   stores the receipt that the seated target is the argmax winner (`gcWhyMateIsTarget`), not a count of
   higher-scored candidates. #428 item 3(iv) asks for the count; it is structurally zero.
3. **"AN EXECUTABLE OPTION THE SAME CHOOSER PRICED HIGHER" (snapshot) IS MEASURED AS WRITTEN**, off the
   chooser's own stored menu — and the code map predicts it ZERO: the chooser IS the argmax over the
   executable options' `price` (`option.price > winner.price`, ties to the lower gid). The face is
   stored and printed; it is the argmax's receipt, not a reading of "an open alternative".
4. **"PRICED SHUT" FOR THE SNAPSHOT CHOOSER NEEDS A LINE THE ENGINE DOES NOT DRAW.** The snapshot
   chooser applies no bar (#427 item 2(ii)); the census draws its own at the calibrated reception's
   **one half**, on the shipped table, and stores all six bands so any other line can be drawn on the
   same numbers.
5. **THE gate INPUTS ARE A RECONSTRUCTION AT PRE-STEP POSITIONS**, not the closure's own doubles; the
   engine's own printed `bestLane` (2 dp) and `bestMate` are the receipts.
6. **NINETEEN GATES** in OP-C0's set; `gRepro` is against OP-C0's stored cells (not IF-T1b's), as #428
   item 3(i) orders.

## §CODE MAP — every seat that can choose a ground pass target on world 18, what each prices, and where the contact is read (DESCRIBES; designs nothing)

Line numbers are at `41c3a17` (= `170a5fa`'s `src/`: `git diff 170a5fa 41c3a17 -- src/` is empty), each
an anchor receipt (`anchors[]`, occurrence-counted by `gAnchoredConstants`).

1. **THE SEATS.** A ground pass (`shortPass` · `throughBall` · `cutback` — `team.stats.passes++` in
   `performPass` / `performThroughBall` / `performCutback`, `src/sim/mechanics.ts`; the keeper's throw
   and the lofted switch are LOFTED) is struck from exactly three call sites, all in
   `src/ai/PlayerBrain.ts` `decideCarrier` (reached from `decidePlayer` l.140 when the body owns the
   ball), plus the wind-up's resolution:
   * (a) **`kickoff`** — `if (match.kickoffKickGid === p.gid)` (l.279): the play-back loop scores its
     own `back` (radial openness minus the own-lane price) and strikes `match.performPass(p, back)`
     (l.320), its action's `why` the literal `'kickoff — played back'` (l.318). **Read:** the fresh
     decision's top `why`.
   * (b) **`groundCandidate`** — the legacy ladder: every mate priced by the hoisted
     `groundCandidate(mate, aim, d)` (l.631–734) at its feet and (DLC) its led aim (l.768 / l.789), the
     strict argmax `bestPass` (l.771 / l.790) electing `bestMate`; the `Pass` candidate's `why` prints
     `to ${bestMate.name} · lane ${bestLane.toFixed(2)} · open …` (l.916). `let passMate = bestMate;`
     (l.1425) is the seat whenever nothing below re-seats it. **Read:** a fresh decision whose top
     action is `Pass` and that the E3 chooser did not re-seat.
   * (c) **`snapshot`** — the EDS E3 chooser (l.1431–1538): once `Pass` won, the passer is not a keeper
     and not cutting back, it pulls his scoped snapshot (l.1456) and calls `choosePerceivedPassTarget`
     (l.1481); `if (chosen) passMate = chosen;` (l.1496) — a null choice (no executable option) keeps the
     legacy target. With `match.traceChoice` (l.1497) it pushes ONE `passChoiceTrace` entry per call
     (l.1508): `chosenGid: choice?.targetGid ?? -1` (l.1511), `legacyGid: bestMate.gid` (l.1512),
     `reception` (l.1518), and the whole menu `options[] { targetGid, infoClass, price, executable,
     cell, band }`. **Read:** that entry, on the choice step, for this passer.
   * (d) **`throughBall`** and **`cutback`** — their own choosers: the through-ball scorer's `bestRunner`
     (l.942–1008, struck by `performThroughBall`, l.1787; its chip is lofted) and the team's licensed
     `arriver` (`cutbackCand`, l.1086, struck by `performCutback`, l.1697). **Read:** the release's klass.
   * (e) **THE WIND-UP** — `match.armPendingPass(p, passMate!, …)` (l.1753) records the SAME target and
     the arm-time aim; the release at `readyTick` (`src/sim/Match.ts` l.4492) re-strikes it. The seat
     is decided on the ARM step. **WHEN THE BRAIN DECIDES:** `Match.step` runs every body's
     `decidePlayer` (l.3541) inside the decide loop BEFORE the executor loop (`executeAction`, l.3585) and
     the physics, and the stale clock moves only after the ball step (`holder.staleTime += dt`, l.3674) ⇒
     every brain decides on the **PRE-STEP** positions and stale clocks. The wind-up's arm-time `aim` is
     the target's pre-step position (receipt `receipt.windupAimAgreesShare`).
   * Dormant on world 18 (asserted by `gWorld`): `forcedPassTarget` (null), the PW chooser
     (`pwWeightChooser` absent), the PTP lead, the snapshot law.
2. **WHAT EACH PRICES, AT THE CHOICE.**
   * **`groundCandidate`** (l.631–734): `lane = min(1, laneOpenness(p.pos, aim, opp.players) ×
     (playmaker ? 1.15 : 1))` (l.636–639, unitless 0–1: the worst opponent's closest-point distance to
     the segment over 4 m, skipping a body whose closest point is within 1.5 m of the passer —
     `src/ai/perception.ts` l.143–154); `open = opennessAt(aim)`; `gain = clamp01((team.localX(aim.x) −
     localX + 30) / 60) × 2 − 1` (l.642, unitless ±1 over 30 m, `localX = team.localX(p.pos.x)` l.347);
     `s = passBase + lane·passLaneW + open·passOpenW`, the forward / backward tilt, then **THE GATE**
     `if (gain > 0.15 && lane < 0.4) { const gate = 0.35 + g.riskTolerance * 0.65; s *= gate + (1 −
     gate) * stagnation * 0.4; }` (l.655–658; `stagnation = clamp01((team.staleTime − 3) / 5)`, l.367,
     staleTime in sim-seconds), then `passMul`, the distance bands, the 2过1 / third-man / overlap terms
     and the DV · GC · LN · RA subtractions (l.703–732). The gate is a SOFT multiplier on a forward
     candidate's score, never a veto. All on **truth** (`opp` IS `oppTruth`, OP-C0 §CODE MAP 1).
   * **`snapshot`** (`src/ai/perceivedPassChoice.ts`): each candidate in the 6–30 m window is priced by
     `pricePassOption` (l.178–249) on the passer's snapshot: `READ` (target and lane in his percept) ⇒
     `reception = threatQuintilePrice(threat)` (l.235, the band's `THREAT_CALIBRATION.realizedSuccess`,
     a probability) and `band = threatBandIndex(threat)` (l.236, quintile index 0–4, 4 = most threat);
     `SEEN-UNREAD` ⇒ the option-space prior at the perceived distance, band −1; `UNSEEN` ⇒ never
     executable. With `edsValueAxis` ON (world 18) `price = attemptValueAt(cell, band)` (P(shot within
     4 s | attempted), a probability), and with `lnOwnLanePrice` ON each executable option's `price` is
     multiplied by the own-lane factor before the argmax. The pick is the strict argmax of `price` over
     EXECUTABLE options, ties to the lower gid (l.274–279). No bar of any kind.
   * **`throughBall`** — its own lane at the runner's burst point and its own `gates` (l.954–967);
     **`cutback`** — its own `sCB` (l.1078–1081); **`kickoff`** — radial openness at the mate (l.288).
     Not priced by this census (#428 asks the in-lane class's price for the two choosers above only).
3. **WHERE THE STRUCK-THROUGH CONTACT'S DISTANCES ARE READ.** The launch point L = `ball.pos −
   ball.vel·DT` on the release tick; the priced aim E (OP-C0 §P.D, COPIED); the contact = the
   first-touch opponent's `pos` on the tick `ball.lastTouch` first names him (the engine's own record);
   his release-tick `pos` and the passer's release-tick `pos` are copied out on the release tick. All
   distances in metres, on the 2-D pitch plane.

⚠ The map is **needle-anchored**, not a whole-function extracted call graph. Its two load-bearing
runtime facts are carried by receipts on every walk, not by text: the seat identity by the engine's own
trace / `why` records, and the pre-step reading by `receipt.windupAimAgreesShare` and
`gc.receipt.whyLaneAgreesShare`. Declared.

## §DEV-PREFLIGHT — the disclosed smoke, IN FULL (before the freeze)

Both runs route the artifact OFF every canonical path (the override guard refuses
`docs/world-model/data/`), on scratch seeds inside the declared band.

### 1. A 2-SEED SHAKE-OUT (`900,009,400–401`, two arms)

`OPC1_MODE=smoke OPC1_N=2 OPC1_OUT=<scratch>/shake.json npx tsx scripts/probes/op-c1-contact-and-price-census.ts`
— **18/19 gates GREEN**; the one RED, `gClassesNonVacuous`, is the expected two-seed vacancy (W18-E held
no `groundCandidate`-seated in-lane pass on two seeds). ⭐ `gRepro` **24/24** (OP-C0's stored signatures
AND its whole 45-key rows on 12,561,000–011, both arms, EXACT, with both observers open); `gLockstep`
4/4. Before it, while writing the walker, nothing was re-drawn; after it, ONE receipt counter was added
(`traceDuplicateKeys`, the join's duplicate-key count, LN-C3's stored debt) and the sizing smoke below
was re-run on the instrument WITH it.

### 2. THE SIZING SMOKE OF RECORD — 12 seeds `900,009,400–411` (+ receipt 420), two arms, **19/19 GATES GREEN**

`OPC1_MODE=smoke OPC1_N=12 OPC1_OUT=<scratch>/preflight.json npx tsx scripts/probes/op-c1-contact-and-price-census.ts`
(smoke artifact `bodySha256 46e7a11567673a302c787adcd020e22c95fcc5b5d909cc7ceeb798620628d4c7`, wall
42.3 s; in-walk 7,232 ms over the 24 smoke walks). `gRepro` 24/24.

**THE SIZED FACE as the smoke measured it**: `qb.inLane.pricedShutAndPlayed@W18-D` = 0.453552 (83 / 183),
95 % CI [0.378698, 0.527638] ⇒ **hwSmoke = 0.07447000000000004** (TRANSCRIBED into the instrument as
`HW_SMOKE_RECORD`; that one constant is the only byte changed after the smoke).
`seSmoke` 0.037995596137179 · `seNeeded` 0.017847038768172088 · **`nRequired` = 55** ⇒ **N = THE
AFFORDANCE, 999** (§P.G) — walked, and said plainly: 55 would size the headline face; the readings by
seat and the QB cells by owner are sized by nothing but volume.

⚠ The smoke's other numbers are **NOT results** (scratch seeds; disclosed only so the instrument is seen
to run): `fb.ground.opponent` W18-E 0.322727 (284 / 880) · W18-D 0.324570 (321 / 989); the sized face on
W18-E 0.551020 (81 / 147). The reconstruction receipts on the smoke: `gc.receipt.whyLaneAgreesShare`
1 · `gc.receipt.whyMateIsTargetShare` 1 · `receipt.windupAimAgreesShare` 1 ·
`snap.all.higherPricedAlt` 0 · `receipt.traceDuplicateKeysPerMatch` 0 (both arms). No partition is read
on them.

## §R RESULTS (every number below QUOTES the artifact's own fields at the six decimals it stores — the artifact is the numbers of record)

**RUN RECEIPTS.** Freeze **`d22121b`**; `git diff d22121b -- scripts/probes/op-c1-contact-and-price-census.ts`
**EMPTY (0 bytes)**. **`allGreen` = true** (19 gate objects, every one `ok: true`). Artifact
`docs/world-model/data/op-c1-contact-and-price-census.json`, **4,754,312 bytes**,
`fileSha256 = 9328837cefbccace339c93fa6e4d6465c4f60705fbe384db247bfbbe959310c8`,
`bodySha256 = e695cb0263090b686e68614b8d0e3fd9652a2f6b2e46edf11c15213a184ce4f0`,
`stage.instrumentSha256 = b7c77bc7e2771cc7876e4e806add50a99be5634191319f634fa2264f75b4f1eb`,
`receipts.hashReproducesFromFile` **true**. Battery **999 seeds (12,562,000–12,562,998) × 2 arms + the
construction receipt 12,562,999 × 2 ⇒ BOOKED = WALKED = 2,000 walks**; `seeds.unwalkedTail` **null** —
the block is consumed WHOLE. **`gRepro` 24/24** (OP-C0's stored W18-E / W18-D signatures AND whole
45-key rows on 12,561,000–011, walked BEFORE any census seed). `gLockstep` 4/4 and X-DET 4/4 on
900,009,490–491. **X-SRC-ZERO**: `git diff 41c3a17 -- src/ tests/` **0 bytes** (and `git diff 170a5fa
41c3a17 -- src/` 0 bytes). **`npm run fingerprint`** run at RESULTS printed
`sha256=59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` = the x64 value of record
(also recomputed in-process, `fingerprintProd.ok` true). ZERO stats, registry **88**. Wall **543.7 s**
(in-walk 506,178 ms over the 1,998 battery walks). Sizing: `nRequired` 55 against the affordance 999;
realised half-width on the sized face **0.00842** (`sizing.realisedHalfWidthThisRun`).

**THE RECONSTRUCTION RECEIPTS** (printed faces, gating nothing; W18-E / W18-D):
`gc.receipt.whyLaneAgreesShare` **1** (9,783 / 9,783) / **1** (10,557 / 10,557) — the recomputed gate
lane equals the engine's own printed `bestLane` on every groundCandidate-seated pass;
`gc.receipt.whyMateIsTargetShare` **1** / **0.999905** (10,556 / 10,557 — ONE W18-D pass whose released
target is not the `why`'s `bestMate`, booked as `groundCandidate` and not examined further);
`receipt.windupAimAgreesShare` **1** (41,073) / **1** (47,429); `receipt.traceDuplicateKeysPerMatch`
**0** / **0**; `snap.all.higherPricedAlt` **0** (0 / 49,527) / **0** (0 / 58,253).

### §R1 BESIDE — OP-C0's TABLE, RE-PRINTED ON THIS BLOCK (definitions unchanged)

| face | `W18-E` | `W18-D` | Δ (D − E) |
| --- | --- | --- | --- |
| `fb.ground.opponent` | 0.317047 (22,458 / 70,835) | 0.311873 (25,224 / 80,879) | −0.005174 [−0.009818, −0.000621] |
| in the lane at release (`q2.wide.corridorAtRelease`) | 0.512913 (11,519) | 0.542420 (13,682) | +0.029507 [+0.020708, +0.038735] |
| arrived in flight | 0.084202 (1,891) | 0.052173 (1,316) | −0.032029 [−0.036659, −0.027393] |
| struck through (④) | 0.402885 (9,048) | 0.405408 (10,226) | +0.002523 [−0.006318, +0.010873] |
| THE PRICE (of opponent-first) | 0.241562 | 0.271091 | +0.029529 [+0.021737, +0.037738] |
| THE PRICE'S GEOMETRY | 0.208389 | 0.197510 | −0.010879 [−0.018550, −0.003650] |
| ⑤ PERCEPTION | 0.021195 | 0.014986 | −0.006209 [−0.008452, −0.003915] |
| residue (below bar, no alternative) | 0.041767 | 0.058833 | +0.017066 [+0.013136, +0.020950] |
| residue (no choice read) | 0 | 0 | 0 |

OP-C0's own numbers on 12,561,000–998 (same host, another block): `fb.ground.opponent` 0.317929 /
0.311390; ④ 0.396318 / 0.403293. ⛔ No verdict word on the comparison.

### §R2 ⭐⭐⭐ QA — ④ WHOLE, BY TWO DISTANCES

**THE THREE READINGS + LEFTOVER** (share of the struck-through class):

| reading | `W18-E` (n 9,048) | `W18-D` (n 10,226) | Δ (D − E) |
| --- | --- | --- | --- |
| (a) **`guardSkip`** — the man at the feet the price's clear-radius skips | **0.395447** (3,578) | **0.530706** (5,427) | +0.135259 [+0.121619, +0.149184] |
| (c) **`steppedAcross`** — he crossed or closed ≥ 1.5 m on the priced line | **0.369363** (3,342) | **0.286818** (2,933) | −0.082545 [−0.096520, −0.069349] |
| (b) **`leftLineEarly`** — a still man ≥ 4 m off the line, met before the aim | **0.126658** (1,146) | **0.112361** (1,149) | −0.014297 [−0.023515, −0.005446] |
| **`leftover`** (printed) | 0.108532 (982) | 0.070115 (717) | −0.038417 [−0.046471, −0.030381] |

**BY SEAT** (share of that seat's struck-through; W18-E / W18-D):

| seat | n | guardSkip | steppedAcross | leftLineEarly | leftover |
| --- | --- | --- | --- | --- | --- |
| `dlcChoice` | 513 / 352 | 0.140351 / 0.235795 | 0.619883 / 0.502841 | 0.033138 / 0.096591 | 0.206628 / 0.164773 |
| `dxAim` | 1,879 / 2,628 | 0.138904 / 0.212329 | 0.616817 / 0.562785 | 0.091538 / 0.068113 | 0.152741 / 0.156773 |
| `plain` | 6,656 / 7,246 | 0.487530 / 0.660502 | 0.280198 / 0.176235 | 0.143780 / 0.129175 | 0.088492 / 0.034088 |

**THE ALONG-LINE BINS** (`qa.along.*`; behind · [0, 1.5) · [1.5, 4) · [4, 8) · [8, 15) · [15, ∞) m):
W18-E 0.163793 · 0.237069 · 0.012047 · 0.042551 · 0.216401 · 0.328139; W18-D 0.223157 · 0.311754 ·
0.011344 · 0.047330 · 0.188832 · 0.217583.
**THE LATERAL BINS** (`qa.lat.*`; [0, 1.5) · [1.5, 4) · [4, 8) · [8, 15) · [15, ∞) m): W18-E 0.444960 ·
0.084549 · 0.234195 · 0.165340 · 0.070955; W18-D 0.531586 · 0.040387 · 0.178467 · 0.187659 · 0.061901.

**THE 2-D TABLE** (`qa.2d.<along>.<lat>`, share of the struck-through class, W18-D; W18-E in brackets):

| along \ lateral | [0, 1.5) | [1.5, 4) | [4, 8) | [8, 15) | [15, ∞) |
| --- | --- | --- | --- | --- | --- |
| behind | 0.220907 (0.160367) | 0.000293 (0.000332) | 0.001173 (0.001658) | 0.000489 (0.001105) | 0.000293 (0.000332) |
| [0, 1.5) | 0.302855 (0.230880) | 0.007041 (0.004310) | 0.001173 (0.000995) | 0.000489 (0.000774) | 0.000196 (0.000111) |
| [1.5, 4) | 0 (0) | 0 (0) | 0.006063 (0.007958) | 0.003423 (0.003095) | 0.001858 (0.000995) |
| [4, 8) | 0.000098 (0.000111) | 0.001369 (0.000442) | 0.023959 (0.023873) | 0.016918 (0.011605) | 0.004987 (0.006521) |
| [8, 15) | 0.004987 (0.017020) | 0.017015 (0.025309) | 0.076374 (0.091070) | 0.066106 (0.052940) | 0.024350 (0.030062) |
| [15, ∞) | 0.002738 (0.036583) | 0.014668 (0.054156) | 0.069724 (0.108643) | 0.100235 (0.095822) | 0.030217 (0.032935) |

The two `[1.5, 4) × lateral < 4` cells are EMPTY on both arms (a contact there before the aim is inside
the wide corridor at contact, so it is not struck-through) — ENUMERATED by their zero numerators.

**THE OPPONENT'S DISTANCE TO THE PASSER AT RELEASE** (`qa.passerDist.*`; [0, 1.5) · [1.5, 4) · [4, 8) ·
[8, 15) · [15, 25) · [25, ∞) m): W18-E 0.222370 · 0.210323 · 0.028957 · 0.163130 · 0.241490 · 0.133731;
W18-D 0.299042 · 0.261393 · 0.016722 · 0.126736 · 0.196656 · 0.099452. Mean **1,149.803714 cm** /
**932.862214 cm** (Δ −216.941500 [−246.430701, −187.279282]); by seat W18-D `dlcChoice` 1,513.786932 ·
`dxAim` 1,243.410198 · `plain` 792.011317 cm.

### §R3 ⭐⭐⭐ QB — THE IN-LANE CLASS, BY THE CHOOSER THAT DECIDED

**THE PARTITION** (share of the in-lane class; W18-E n 11,519, W18-D n 13,682):

| QB cell | `W18-E` | `W18-D` | Δ (D − E) |
| --- | --- | --- | --- |
| `snapOpen` (snapshot chooser, READ band 0–2) | 0.358278 (4,127) | 0.344467 (4,713) | −0.013811 [−0.025676, −0.002655] |
| **`snapShut`** (snapshot chooser, READ band 3–4) | **0.451254** (5,198) | **0.464990** (6,362) | +0.013736 [+0.001754, +0.026255] |
| `snapUnread` (SEEN-UNREAD) | 0.000695 (8) | 0.000439 (6) | −0.000256 [−0.000883, +0.000321] |
| `gcOpen` (lane ≥ 0.4) | 0.059120 (681) | 0.074624 (1,021) | +0.015504 [+0.009082, +0.021792] |
| `gcBelowBarNotForward` | 0.000434 (5) | 0.000292 (4) | −0.000142 [−0.000622, +0.000332] |
| **`gcGateFired`** | **0.003038** (35) | **0.003216** (44) | +0.000178 [−0.001243, +0.001609] |
| `throughBall` | 0.065283 (752) | 0.066365 (908) | +0.001082 [−0.005229, +0.007639] |
| `cutback` | 0.020314 (234) | 0.029162 (399) | +0.008848 [+0.005047, +0.012703] |
| `kickoff` | 0.041583 (479) | 0.016445 (225) | −0.025138 [−0.030267, −0.020432] |
| `unread` | 0 | 0 | 0 |
| ⭐ **PRICED SHUT AND PLAYED** (`snapShut` + `gcGateFired`) | **0.454293** (5,233) [0.444415, 0.463230] | **0.468206** (6,406) [0.460248, 0.477088] | +0.013913 [+0.002196, +0.026391] |

**BY DECIDER:** the snapshot chooser seated **0.810227** (9,333) / **0.809896** (11,081) of the in-lane
class; `groundCandidate` 0.062592 (721) / 0.078132 (1,069). Given the decider: snapshot-seated priced
shut **0.556948** / **0.574136**; groundCandidate-seated gate fired **0.048544** (35 / 721) /
**0.041160** (44 / 1,069).

**THE SNAPSHOT CHOOSER'S OWN PRICE** (snapshot-seated in-lane passes): threat band −1 · 0 · 1 · 2 · 3 · 4 =
W18-E 0.000857 · 0.079931 · 0.177756 · 0.184507 · 0.288225 · 0.268724; W18-D 0.000541 · 0.052252 ·
0.176157 · 0.196914 · 0.299792 · 0.274343. Its own price, bins [0, 0.05) · [0.05, 0.10) · [0.10, 0.15) ·
[0.15, 0.25) · [0.25, ∞): W18-D 0.461059 · 0.385164 · 0.126703 · 0.018590 · 0.008483 (W18-E 0.443052 ·
0.383049 · 0.142077 · 0.021108 · 0.010715); mean `snap.inLane.meanPriceE6` 69,761.150863 / 66,874.634058
(×1e-6 ⇒ 0.069761 / 0.066875). **An executable option the same chooser priced HIGHER: 0** (0 / 9,333;
0 / 11,081) — the argmax, as §P.K item 3 predicted. Its pick equals the legacy pick on 0.215365 /
0.194297.

**THE GATE'S MULTIPLIER** (groundCandidate-seated, gate fired, in-lane; n 35 / 44): bins [0, 0.5) ·
[0.5, 0.65) · [0.65, 0.8) · [0.8, 0.9) · [0.9, ∞): W18-D 0 · 0.227273 · 0.295455 · 0.363636 · 0.113636;
mean 0.758794 (`gc.inLane.gateFired.meanMultE6` 758,794.477273; W18-E 755,387.257143).

**OVER ALL GROUND PASSES** (W18-E / W18-D): snapshot-seated 0.699188 / 0.720249, groundCandidate
0.138110 / 0.130528; PRICED SHUT AND PLAYED **0.223068** / **0.250522** (`qb.all.pricedShutAndPlayed`);
`gcGateFired` 0.002682 / 0.002807.

**BESIDE OP-C0's OWNERS** (`qb.inLane.byOwner.<owner>.pricedShutAndPlayed`, share of that owner cell;
W18-E / W18-D): THE PRICE **0.570138** / **0.555718**; THE PRICE'S GEOMETRY **0.344444** / **0.376556**;
⑤ PERCEPTION 0.128151 / 0.113757; residue (below bar, no alternative) 0.497868 / 0.462938. Inside THE
PRICE'S GEOMETRY (W18-D): `snapOpen` 0.336411 · `snapShut` 0.376556 · `gcOpen` 0.192894 · `gcGateFired` 0 ·
`kickoff` 0.044761. Inside THE PRICE (W18-D): `snapOpen` 0.339427 · `snapShut` 0.554256 · `gcGateFired`
0.001462 · `throughBall` 0.077947. ⛔ No OP-C0 cell moves; this is a second partition of the same passes.

### §R4 在说人话的层面

⛔ 这一段只把上面的数换成白话，不下结论。

* ④（人不在算好的线上，球却碰到了他）在成熟账本那一档里：**0.530706** 是"碰球点在传球人脚边、离算好的线
  不到 4 米，算盘自己那个 1.5 米半径把他略过了"；**0.286818** 是"那个人横着越过了算好的线，或往线上靠了
  至少 1.5 米"；**0.112361** 是"人没怎么动、离线至少 4 米，球在到落点之前就到了他那里"；剩下 **0.070115**
  归不进去。直接传到脚下的那种（`plain`）脚边那一档更大（**0.660502**）；带提前量的两种（`dlcChoice` /
  `dxAim`）主要是"人插过来"（**0.502841** / **0.562785**）。
* "人就在线上"那一格（成熟账本那一档）里，**0.809896** 是快照选人那个选择器拍的板；按它**自己**对这条线的
  威胁读数（落在校准成功率低于一半的两档），**0.574136** 是"它读的是不干净，照样传了"。按真实位置打分的
  那个选择器只拍了 **0.078132** 的板，它那道"往前传且线不够干净就打折"的闸只在其中 **0.041160** 上触发。
  两个合起来，"自己的算盘说不干净、照样传了"占这一格的 **0.468206**（"不干净"的那条线在快照那一半是本次
  普查自己划的，见 §HONEST LIMITS 1）。
* 快照选择器每一次都挑了它**自己**定价最高的那个选项（定价更高的可执行选项：**0** 次）。

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`).

1. ⭐⭐⭐ **"PRICED SHUT" FOR THE SNAPSHOT CHOOSER IS THE CENSUS'S LINE, NOT THE ENGINE'S.** The chooser
   compares EV̂ (`price`), never its reception; "shut" = a READ band whose calibrated clean-control share
   is below one half (bands 3–4). All six bands are stored (§R3), so the headline moves if the line
   moves: band 4 alone is 0.274343 of W18-D's snapshot-seated in-lane passes, bands 2–4 0.771049 (sum of
   the stored band shares). PRICED SHUT AND PLAYED is therefore ≈ in its snapshot half and solid in its
   groundCandidate half (the engine's own gate).
2. ⭐⭐ **BOTH "HIGHER-PRICED / HIGHER-SCORED ALTERNATIVE" TESTS ARE ARGMAX RECEIPTS.** The snapshot test
   measured 0 on 107,780 snapshot-seated ground passes (both arms); the groundCandidate test is answered
   by the code map (§P.K item 2) and the `why` receipt (1 / 0.999905). Neither says whether a MORE OPEN
   lane existed; OP-C0's `altGivenBelowBar` (a truth reconstruction) is the only stored reading of that.
3. **`guardSkip` IS GEOMETRY ON THE PRICED LINE, NOT A READ OF WHO WAS AT THE FEET.** It books a contact
   projecting within 1.5 m of the launch (or behind) and within 4 m of the segment; the passer-distance
   bins beside it (0.299042 + 0.261393 of W18-D's struck-through class within 4 m of the passer at
   release) are the independent picture. The 2-D table shows the class lives at lateral < 1.5 m.
4. **"THE MOVE" IS TWO SNAPSHOTS** (release and contact), against the priced line, not the ball's real
   path; a man who met a ball that left the line AND moved ≥ 1.5 m is `steppedAcross` by the frozen
   precedence.
5. **THE gate RECONSTRUCTION** is exact on the lane (why-lane agreement 1 at 2 dp on 20,340 passes) but
   the gain and multiplier have no engine receipt; they share the lane's pre-step positions.
6. **ONE W18-D `groundCandidate` PASS (of 10,557) whose target is not the `why`'s `bestMate`** is booked
   `groundCandidate`; not investigated (no re-walk after sight).
7. **`kickoff` IS A REAL SEAT IN THE IN-LANE CLASS** (0.041583 / 0.016445): the play-back loop prices
   openness at the mate's body and no line. It is printed, not priced.
8. **THE QB DECIDER IS READ OFF THE CHOICE STEP**; a wind-up's release comes its wind-up ticks later, and
   the in-lane class is drawn at RELEASE (OP-C0 HONEST LIMITS 4).
9. **NO GATE MEASURES QUALITY.** Every one of the 19 is a liveness or a receipt.
10. **ONE HEAD, ONE BLOCK.** Every number is `41c3a17`'s `src/` on x64, N = 999; arm64 is ≈ only (#418).

## §DEVIATIONS (declared by the executor; the commander disposes)

1. The six departures declared BEFORE the freeze (§P.K) stand as written: the trace door opened on the
   constructed match; the groundCandidate higher-scored test answered by the code map (structurally
   zero); the snapshot higher-priced test measured as written (it is the argmax receipt: 0); "priced
   shut" for the snapshot chooser drawn at the census's declared one-half coin; the gate inputs
   reconstructed at pre-step positions; gRepro against OP-C0's stored cells.
2. **THE READINGS' PRECEDENCE IS (a) → (c) → (b)**, not #427's prose order (§P.D, frozen).
3. **AFTER THE SHAKE-OUT, ONE RECEIPT COUNTER WAS ADDED** (`traceDuplicateKeys`) and the sizing smoke
   re-run; the shake-out ran on the instrument without it (§DEV-PREFLIGHT 1).
4. **ONE CONSTANT TRANSCRIBED AFTER THE SMOKE, BEFORE THE FREEZE** — `HW_SMOKE_RECORD`.
5. **N = THE AFFORDANCE (999) against `nRequired` 55.**
6. **THE STATUS PARAGRAPH** above §0 moved at RESULTS (the OP-C0 practice); §0–§DEV-PREFLIGHT did not.

## §GATES — 19 of 19 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | ✅ | what it asserts (the notes are stored in `gates[]`) |
| --- | --- | --- |
| `gRepro` | ✅ | 24/24: OP-C0's stored W18-E / W18-D signatures AND whole 45-key rows on 12,561,000–011, exact, BEFORE any census seed |
| `gLockstep` | ✅ | 4/4: the snapshot wrapper and the E3 trace door leave the whole-match signature byte-identical |
| `gDeterminism` | ✅ | X-DET 4/4: signatures AND row bytes identical across two observed walks |
| `gFingerprintProd` | ✅ | in-process `59f42aa7…a072d` = the x64 pin (and `npm run fingerprint` printed the same at RESULTS) |
| `gSrcUntouched` | ✅ | `git diff 41c3a17 -- src/ tests/` 0 bytes; porcelain 0 bytes; `git diff 170a5fa 41c3a17 -- src/` 0 bytes |
| `gWorld` | ✅ | every walk on world 18, `inSnapshotLaw` absent, E3 on, genome clean, trace door shut at construction, no forced target; the pin; dose bytes pinned |
| `gSeedsBookedEqualWalked` | ✅ | 999 × 2 + 2 = 2,000 walks |
| `gSeedDisjoint` | ✅ | inside 12,562,000–999; 18 consumed blocks below; no SIM seed ≥ 12,563,000; ZERO stats |
| `gN` | ✅ | N_FROZEN 999, no override env |
| `gScratchBand` | ✅ | every scratch seed from the ONE base 900,009,400; verifier 900,009,500–599 disjoint |
| `gAnchoredConstants` | ✅ | 56/56 needles at their counts; the gate, multiplier, stagnation, gain and playmaker constants parsed |
| `gPredicateFixtures` | ✅ | 114/114 |
| `gLedgerRead` | ✅ | 10 engine records, 8 declared reconstructions (stored) |
| `gPartition` | ✅ | per arm and per seed: OP-C0 owners 70,835 / 80,879 = the ground population; QA 9,048 / 10,226 = struck-through; QB in-lane 11,519 / 13,682; QB all = the population |
| `gClassesNonVacuous` | ✅ | both arms live on every class the partitions stand on; empty denominators ENUMERATED |
| `gBite` | ✅ | the #414 ROW form: 999/999 rows differ; signature coincides on 0 (printed) |
| `gFaces` | ✅ | 586/586 faces, the ownership table and the three partitions re-derived off disk |
| `gHashOrder` | ✅ | 30-key allowlist; body hash last; reproduces from the file |
| `gStage` | ✅ | `stage.instrumentSha256` = the running file's hash |

**CONSUMPTION.** Block `12,562,000–999` consumed whole. Scratch `900,009,400–499` (executor); the
verifier's band is `900,009,500–599`. ZERO stats: `stats: { consumed: 0, nextBase: 117_600,
registryOfRecord: 88 }`. Next sim ≥ **12,563,000**.
