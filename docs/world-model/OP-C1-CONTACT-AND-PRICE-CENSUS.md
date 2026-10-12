# OP-C1 — 「近身与算盘」 THE CONTACT-AND-PRICE CENSUS（④ 那一格按两段距离拆开；在线上那一格按真正拍板的那个选择器自己的算盘读）

> **STATUS: FROZEN — §0 through §DEV-PREFLIGHT and the instrument are sealed at the FREEZE commit,
> BEFORE any battery seed is walked.** §R onward is written after the battery.
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
