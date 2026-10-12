# OP-C2 — 「脚下那个人 · 谁算漏了」 THE FEET-ZONE CENSUS（`guardSkip` 那些球是谁拍的板、它自己怎么算的；以及分母：出脚时脚边有人，那人先碰到球的有多少）

> **STATUS: WALKED — the battery is complete, ALL 19 GATES ARE GREEN (`allGreen` = a STORED `true`),
> and QC and QD are answered as STORED PARTITIONS at §R.** §0 through §DEV-PREFLIGHT and the instrument
> were sealed at the FREEZE commit **`1f95398`** BEFORE any battery seed was walked and were NOT edited
> after sight (only this STATUS paragraph moved; §R onward was appended).
> Authorized by **COMMANDER RULING #430 item 2** (a CENSUS; X-SRC-ZERO; Draft + independent Verify in
> OP-C1's form), which corrects #429 item 2(a) and item 3 BY CODE before any contract is drafted.
> Census form of record: [`OP-C1-CONTACT-AND-PRICE-CENSUS.md`](OP-C1-CONTACT-AND-PRICE-CENSUS.md)
> (§0 / §P / §CODE MAP / §DEV-PREFLIGHT / §R / §HONEST LIMITS / §DEVIATIONS / §GATES), read **through its
> §COMMANDER CORRECTIONS** (ruling #429) and through OP-C0's
> ([`OP-C0-OPPONENT-FIRST-CENSUS.md`](OP-C0-OPPONENT-FIRST-CENSUS.md) §COMMANDER CORRECTIONS, ruling
> #427), which govern every OP-C0 / OP-C1 reading this census leans on.
> Instrument: [`scripts/probes/op-c2-feet-zone-census.ts`](../../scripts/probes/op-c2-feet-zone-census.ts)
> — OP-C1's whole instrument is **COPIED BY RECIPE, ⛔ NEVER IMPORTED** from
> [`op-c1-contact-and-price-census.ts`](../../scripts/probes/op-c1-contact-and-price-census.ts) (frozen at
> `d22121b`), byte for byte in every line that writes a stored OP-C1 cell, cited at its sites by OP-C1's
> own line numbers: OP-C0's population / corridor / split / seat / owner mapping it carries (OP-C1
> l.353–480, l.838–863, l.1168–1236), QA's line geometry, move and readings (OP-C1 l.482–536, l.1266–1280),
> QB's decider, bands, gate and decider read (OP-C1 l.538–614, l.865–919, l.1238–1265), the walker
> (OP-C1 l.925–1164), the faces / bootstrap / gates / artifact (OP-C1 l.1283–1837).
> Artifact: `docs/world-model/data/op-c2-feet-zone-census.json` (compact JSON, body hash last; **or its
> `.RED.json` SIDE PATH** if any gate is red — the red-routing idiom, #334 item 5).
>
> ⛔ **THIS IS A CENSUS.** It publishes MEASUREMENTS as **STORED PARTITIONS**. It ships nothing,
> adjudicates nothing and scores no hypothesis. ⛔ **NO VERDICT WORD** is written on any face.
> ⛔ **X-SRC-ZERO**: not one byte under `src/` or `tests/` is created or edited; no frozen probe (OP-C0's
> and OP-C1's included) and no pinned test is touched.

## §0 THE WORDS OF RECORD, AND WHAT THIS CENSUS IS FOR

**THE USER'S SENTENCE** (copied from its quotation at
[`OP-C0-OPPONENT-FIRST-CENSUS.md`](OP-C0-OPPONENT-FIRST-CENSUS.md) l.38):

> 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」

**THE USER'S WORDS FOR THIS ROUND** (#430 item 0): 「自走直到human gate」.

**WHERE OP-C1 LEFT IT, AS CORRECTED BY #430 item 1** (W18-D): of the 10,226 struck-through balls (④),
**0.530706** met a man at a contact that projects within `DV_CLEAR_RADIUS` of the launch (or behind it)
and lies within `DV_CORRIDOR_SCALE` of the priced segment (`guardSkip`). #429 read that as "the price's
own guard"; #430 item 1 WITHDREW the reading by code: the 1.5 m skip lives in `laneOpenness` and binds
only the `groundCandidate` scorer (which seated 0.078132 of OP-C1's in-lane class on W18-D); the snapshot
chooser, which seated 0.809896, prices through `evaluatePassCorridorInterception` with no clear-radius
skip; and world 18's `bkGroundCorridor` shell hazard prices bodies on `groundCandidate`'s lines with no
1.5 m guard. **`guardSkip` is census geometry, not yet a decider's blind spot; who seated those balls and
what they priced is UNKNOWN** (OP-C1 stored no QA × decider table).

**WHAT #430 ASKS** (item 2, VERBATIM in substance): **(ii) QC** — for every struck-through ball the 2-D
table QA reading × decider (snapshot · `groundCandidate` · through ball · cutback · kickoff · other), and
for the `guardSkip` balls: the deciding price at the choice (snapshot: the chosen option's READ band;
`groundCandidate`: `laneOpenness`, the shell hazard's value as the engine computes it, the gate), whether
the contacting opponent was IN the passer's snapshot at the choice, and his distance to the passer at the
CHOICE and at the RELEASE (did he close during the wind-up?) — frozen bins. **(iii) QD — the
denominator** — over ALL ground releases: whether an opponent stood in the skip zone at RELEASE (the
OP-C1 `guardSkip` geometry applied at release against the priced line: projection `< DV_CLEAR_RADIUS` ∧
segment distance `< DV_CORRIDOR_SCALE`), and of those the share whose first body was that man (and the
share whose first body was ANY opponent) — by decider and by seat; the complement printed beside.

### 在说人话的层面

上一轮把"④ 那一格里一半多的球，碰球点在传球人脚边"读成了"算盘自己那个 1.5 米半径把脚边的人略过了"。
#430 翻代码发现这句话说过头了：那个 1.5 米只在**按真实位置打分**的那个选择器里，而大部分球是**用快照选人**
的那个选择器拍的板，它的算盘从球出脚第一帧就开始算每一个看得见的对手，根本没有略过谁。所以这次只做两件事：
**QC** 把 ④ 里每个球按"那三种读法 × 当时是谁拍的板"摆成一张表，再把"脚边那一类"单独拿出来，看拍板的那个
选择器**自己**当时给这条线的价是多少、碰球的那个人当时在不在传球人的快照里、他在拍板那一刻和出脚那一刻离
传球人各有多远（是不是在蓄力那几帧里贴上来的）。**QD** 算分母：所有地面传球里，出脚那一刻脚边那块区域里
站着对手的有多少；这些球里，最先碰到球的就是那个人的占多少、是任何一个对手的占多少；脚边没人的那些球照样
打印在旁边。不修任何东西，不下结论。

## §P THE FREEZE (all of it BEFORE any battery seed)

### §P.A THE ARMS — TWO, PAIRED on shared seeds

| arm | world | dose | role |
| --- | --- | --- | --- |
| **`W18-E`** | 18 (`a4MatchFlags(18)` + `armA4World(m, null, 18)`) | none | OP-C1's W18-E, COPIED by recipe |
| **`W18-D`** | 18 | the SHIPPED loaders' L3 + PC doses (`loadL3Dose` / `loadPcDose`, CALLED; file BYTES hashed against their pins) | OP-C1's W18-D — the world as the user plays it |

* The arm construction is OP-C1's `buildMatch` (OP-C1 l.327–338 ← OP-C0 l.264–273) **COPIED**, with
  DS-C0's team builder (OP-C1 l.317–326).
* **THE OBSERVERS** are OP-C1's, COPIED (OP-C1 l.946–961): OP-C0's OBSERVING wrapper on
  `match.perceivedSnapshot`, and the E3 chooser's own trace door (`match.traceChoice = true` on the
  constructed match). Both are proven INERT by `gLockstep` and again by `gRepro`.
* **`gWorld`** asserts OP-C1's set on every walked match and on the constructed pin at scratch
  **900,009,670**, PLUS, on that pin (new): `bkGroundCorridor` ON, `dvDeliveryValue` ABSENT, and the GC
  seat ARMED on both sides (`deliveryValueSeatOf(team.genome)` non-null; its `exposureWeight` printed in
  the note). Per pass, QC-2 stores the same armed test for every `groundCandidate`-seated `guardSkip` ball.

### §P.B gRepro — FIRST, against OP-C1's STORED per-seed cells

#430 item 2(i): OP-C1's stored per-seed **W18-E** and **W18-D** cells on **12,562,000–011**
(`docs/world-model/data/op-c1-contact-and-price-census.json`, `perSeedCells[]`, walked on THIS host ⇒
EXACT) are reproduced BEFORE any census seed: for each of the 12 seeds × 2 arms, (a) the whole-match
`signature` equals OP-C1's stored one, AND (b) the instrument's **OP-C1 sub-row** — OP-C1's
`ROW_SCHEMA`, all **69 keys** (OP-C0's 45 keys incl. every owner cell, QA's along / lateral / 2-D /
passer-distance / reading cells, QB's decider cells, bands, multipliers and receipts), in OP-C1's key
order — equals OP-C1's stored row **cell for cell**. ⇒ OP-C1's population, corridor, seat reading, three
QA readings and QB decider read are the copies. These seeds are OP-C1's own consumed band: re-walking
them is **not a consumption**. **If gRepro is red, no census seed is walked** and the artifact is
RED-routed.

### §P.C POPULATION AND THE COPIED READS

* **THE POPULATION** is OP-C0's (via OP-C1): every ground pass release (`shortPass` / `throughBall` /
  `cutback`, ground launch, a target — `isMeasurableGroundPass`), its first body by `contactClassOf` off
  `ball.lastTouch` (a superseded flight, or one still open at full time, is booked `none`). Its count is
  OP-C0's `relGround`.
* **THE STRUCK-THROUGH CLASS (④)** = opponent first ∧ the WIDE split's `struckThrough` (OP-C0's cell).
* **THE SEAT** (`dlcChoice` · `dxAim` · `plain`) is OP-C0's `seatOf`, COPIED.
* **THE QA READING** of a struck-through ball is OP-C1's `readingOf(lineGeomOf(L, E, contact),
  movedOf(lat at release, lat at contact))` — the very same call OP-C1 books into `qaReading` (the QC
  booking makes it a second time on the same arguments, beside that line).
* **THE DECIDER** of a release (`deciderOfQb`, NEW, a grouping of a copied read): the release's OP-C1 QB
  cell, grouped exactly as OP-C1's own "BY DECIDER" faces group it (OP-C1 l.1351–1357): `snapOpen` ·
  `snapShut` · `snapUnread` → **`snapshot`**; `gcOpen` · `gcBelowBarNotForward` · `gcGateFired` →
  **`groundCandidate`**; `throughBall` · `cutback` · `kickoff` · `unread` → themselves. **`unread` is
  #430's "other".** The QB cell itself is OP-C1's `qbCellOf(deciderOf(…), snapCellOf(…), gcCellOf(…))`,
  read on the CHOICE step (the wind-up's arm step; a synchronous release's own step), COPIED.

### §P.D ⭐⭐⭐ QC — THE `guardSkip` BALLS BY THEIR DECIDER (frozen)

**QC-1 — READING × DECIDER, every struck-through ball.** Each struck-through ball is booked in exactly
one cell of seat (3) × QA reading (`guardSkip` · `steppedAcross` · `leftLineEarly` · `leftover`) ×
decider (6). Faces: share of the struck-through class per (reading, decider), pooled over seats
(`qc.<reading>.<decider>`); the decider mix within each reading (`qc.givenReading.<reading>.<decider>`);
the reading mix within each decider (`qc.givenDecider.<decider>.<reading>`); and per seat the decider
mix of its `guardSkip` balls (`qc.<seat>.guardSkip.<decider>`).

**For every `guardSkip` ball (QC-2 … QC-5):**

**QC-2 — THE DECIDING PRICE AT THE CHOICE, off the decider's own record.**

* **snapshot-seated** (decider `snapshot`): the chosen option's own `band` from the E3 chooser's trace
  entry on the choice step (`options[].band` for `chosenGid` — OP-C1's read): band −1 (`SEEN-UNREAD`),
  0, 1, 2, 3, 4 — all six stored. Faces: each band's share; `qc.gs.snap.shut` = bands in OP-C1's
  `SHUT_BANDS` (derived from the shipped table, `[3, 4]`; the one-half coin is OP-C1's DECLARED line, not
  an engine bar — OP-C1 §HONEST LIMITS 1); `qc.gs.snap.open` = bands 0–4 not in `SHUT_BANDS`;
  `qc.gs.snap.unread` = band −1.
* **groundCandidate-seated** (decider `groundCandidate`): OP-C1's reconstruction at the PRE-STEP
  positions of the choice step: the gate's `lane` = `min(1, laneOpenness(passer, aim, opponents) ×
  (playmaker ? 1.15 : 1))` — binned at **0 · 0.2 · 0.4 · 0.6 · 0.8** (0.4 = the parsed bar); the gate
  cell, OP-C1's `gcCellOf(lane, gain)` (`gcOpen` · `gcBelowBarNotForward` · `gcGateFired`); and ⭐ **THE
  SHELL HAZARD AS THE ENGINE COMPUTES IT**: `groundShellHazard(passer, aim, [own team, opponents],
  passer.gid, target.gid)` — the shipped export, **CALLED** (never re-typed), on both teams' bodies at the
  pre-step positions, each carrying its own `sentOff` and `coreRadius` — the argument shape of the
  engine's own call (PlayerBrain l.552–553, l.713–714). Stored as value 0 / 1
  (`qc.gs.gc.hazardFires` = the share at 1), with the receipt that the GC seat was ARMED for that passer
  (`deliveryValueSeatOf(team.genome) !== null`; `qc.gs.gc.seatArmed`). `aim` = the target's pre-step
  position + the lead (the wind-up record's `aimLead`, or the synchronous DX deposit's lead, else 0) —
  OP-C1's.
* **throughBall · cutback · kickoff · other**: their own choosers; not priced here (#430 asks the
  snapshot and `groundCandidate` prices). Counted in QC-1, QC-3 and QC-4.

**QC-3 — SNAPSHOT MEMBERSHIP AT THE CHOICE** (`membershipOf`): OP-C1's copied `presenceOf` CALLED on the
ball's choice record (OP-C0's `choiceReadOf` on the choice step) for the contacting opponent's gid:
**`snapshotPresent`** — this passer made a scoped snapshot pull on the choice step and the contacting
opponent is among the opponents it returned; **`snapshotAbsent`** — the pull happened and he is not in
it; **`truthRead`** — this passer made no scoped pull on the choice step (the E3 chooser was not
reached: a through ball, a cutback, a kick-off, a keeper passer); **`noChoiceRead`** — no choice record.
Stored per decider.

**QC-4 — HIS DISTANCE TO THE PASSER AT THE CHOICE AND AT THE RELEASE.**

* **at the CHOICE** = the Euclidean distance between the contacting opponent and the passer at the
  **PRE-STEP positions of the choice step** (the positions every brain decides on — OP-C1 §CODE MAP
  1(e)); the wind-up's arm step, or a synchronous release's own step;
* **at the RELEASE** = OP-C1's `qaPasserDist` read: his release-tick position against the passer's
  release-tick position;
* both binned on OP-C1's passer-distance edges **0 · 1.5 · 4 · 8 · 15 · 25** m; per decider, and the
  pooled 6 × 6 table choice-bin × release-bin;
* **THE CLOSING** = distance at the choice − distance at the release (positive = he came closer), binned
  at **opened (< 0) · [0, 0.5) · [0.5, 1.5) · [1.5, 4) · [4, ∞)** m;
* ⭐ **CLOSED** (`closedOf`) ⇔ the closing is **≥ `DV_CLEAR_RADIUS` (1.5 m)** — OP-C1's MOVE threshold;
  per decider, and by path: `[wind-up · synchronous] × [not closed · closed]` (a synchronous release's
  choice and release are the same step, so its closing spans one tick's movement — the path split
  prints it apart).

**QC-5 — THE BRIDGE TO QD:** `qc.gs.zoneAtRelease` = the share of `guardSkip` balls whose contacting man
was in the release zone (QD's predicate) at the release tick.

### §P.E ⭐⭐⭐ QD — THE DENOMINATOR (frozen)

**THE RELEASE ZONE** (`inSkipZoneOf`): for every ground release, the set of the passer's opponents, not
sent off, whose **release-tick position** P satisfies OP-C1's `guardSkip` geometry against the priced
line L→E (OP-C1's launch L and priced aim E): `lineGeomOf(L, E, P).t < DV_CLEAR_RADIUS` (projection
within 1.5 m along the line from L, **or behind L at any negative t**) **∧** `lineGeomOf(L, E, P).seg <
DV_CORRIDOR_SCALE` (closest-point distance to the priced SEGMENT under 4 m). It is computed for every
ground release, including a degenerate line (`len ≤ 1e-9`: `t = 0`, `seg = |P − L|`, so the zone is
every opponent within 4 m of L). A fixture proves the predicate is the `guardSkip` geometry
(`zone.equalsGuardSkipGeometry`).

**THE OUTCOME** (`qdOutOf`), every ground release in exactly one: **`zoneManFirst`** — the first body is
an opponent (OP-C0's `opponent` class with a body) whose gid is in the release zone (with several men in
the zone: ANY of them); **`otherOppFirst`** — the first body is an opponent not in the zone (every
opponent-first release with an EMPTY zone lands here); **`notOppFirst`** — own target, own non-target,
or none.

**THE CELL:** seat (3) × decider (6) × zone (empty · occupied) × outcome (3). **THE FACES**, pooled, per
decider (`qd.decider.<d>.*`) and per seat (`qd.seat.<s>.*`): `zoneShare` (zone occupied / all ground
releases); **`zone.zoneManFirst`** (given a man in the zone, the zone man touched first — ⭐ THE SIZED
FACE at W18-D); `zone.anyOppFirst` (given the zone occupied, any opponent first); `zone.otherOppFirst`;
`zone.notOppFirst`; and **THE COMPLEMENT** `noZone.anyOppFirst` / `noZone.notOppFirst` (zone empty).

**BESIDE (declared at §P.K 2, not a #430 cell):** the zone-occupied releases split by OP-C1's own
along-line edge 0: at least one zone man at `t ≥ 0` (`zoneManAheadOf` — in front of or level with the
launch) vs every zone man behind the kicker (`t < 0`), with the outcome in each
(`qd.zone.aheadShare` · `qd.zoneAhead.*` · `qd.zoneBehindOnly.*`).

### §P.F THE PRE-REGISTERED QUESTIONS — answered as STORED partitions, ⛔ no verdict word

> **QC** Per arm: the struck-through class by QA reading × decider (pooled and by seat); for the
> `guardSkip` balls, the deciding price at the choice (snapshot band; `groundCandidate` lane, gate cell,
> shell hazard), snapshot membership at the choice, the distance to the passer at the choice and at the
> release, the closing and CLOSED — by decider.
>
> **QD** Per arm: the share of ground releases with a man in the skip zone at release; given that, the
> zone man first and any opponent first; the complement — pooled, by decider, by seat.

**THE THREE READINGS #430 item 3 FROZE BEFORE SIGHT** (copied, the commander's; this census stores the
tables they are read on and reads none of them): *"if the `guardSkip` balls are mostly
`groundCandidate`'s AND the zone man touches first often ⇒ the contract is the `laneOpenness` guard (the
truth scorer's blind spot; the GC shell hazard is the prior art it must compose with). If they are
mostly the SNAPSHOT chooser's and priced SHUT there ⇒ there is no blind spot; the ball belongs to author
(b) — the pass-or-keep decision — which is HELD behind 「传不出去球」 and becomes a **user fork** (the
human gate). If the contacting man was mostly ABSENT from the snapshot or CLOSED during the wind-up ⇒ it
is perception / timing, and the commander rules on that table."* Their inputs are, in order:
`qc.givenReading.guardSkip.<decider>` with `qd.zone.zoneManFirst`; `qc.gs.snap.shut`;
`qc.gs.presence.snapshotAbsent` and `qc.gs.closed`.

### §P.G THE ESTIMATOR, THE SEEDS AND THE SIZING

* **THE ESTIMATOR** (OP-C1's): per-seed counters; every face a pooled ratio of summed cells; a
  **CLUSTER BOOTSTRAP over match seeds**, 2,000 draws, mulberry32 seeded from the block base
  12,563,000, percentile intervals at 2.5 % / 97.5 %, on levels per arm and on the **PAIRED Δ
  W18-D − W18-E**. **ZERO stats**: `stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 88 }` —
  no new engine record is read (the E3 trace and the scoped pull are OP-C1's reads of record; the shell
  hazard is a shipped export CALLED on read positions, a declared reconstruction); the registry stays
  **88**.
* **THE BLOCK** (#430 item 2(v)): battery **12,563,000–12,563,998**; construction receipt
  **12,563,999**. BOOKED = WALKED: **999 × 2 + 2 = 2,000 walks**. ⛔ Never a SIM seed ≥ 12,564,000 (a
  fixture proves one past the ceiling WOULD be caught).
* **THE RE-WALKS** 12,562,000–011 are OP-C1's own consumed band (canon, VERBATIM, CANON.md l.157–159:
  *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range (≥
  900,000,000) — never the next virgin block"*, home: PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER
  CORRECTIONS item 6).
* **SCRATCH**, all from the ONE base **900,009,600**, inside 900,009,600–699: the sizing smoke 600–611,
  the smoke receipt 620, the world pin 670, the lockstep / X-DET pair 690–691. The verifier's
  **900,009,700–799** is asserted disjoint.
* **THE SIZING FORM** (OP-C1 §P.G's, the house form): `se(n) = hw(n)/z.975` · `se(needed) =
  0.05/(z.975 + z.80)` · `N = ceil(n · (se(n)/se(needed))²)`, at the declared **0.05** target on
  **`qd.zone.zoneManFirst@W18-D`** (#430 item 2(v)), measured on the disclosed 12-seed smoke
  (§DEV-PREFLIGHT). The battery walks **THE AFFORDANCE (999)** whatever `nRequired` says — the #414
  §CORR 8 floor reading: the QC `guardSkip` balls by decider (the `groundCandidate`-seated ones above
  all) and the QD cells by decider and seat are rare classes sized by nothing but volume — and says so.

### §P.H THE GATE SET (frozen ex ante) — NINETEEN (OP-C1's set by anchor)

`gRepro` (FIRST, §P.B, against OP-C1's stored cells) · `gLockstep` · `gDeterminism` (X-DET) ·
`gFingerprintProd` (X-FP-PROD: the in-process `npm run fingerprint` recipe = the x64 value of record
`59f42aa7…a072d`; `npm run fingerprint` is also run at RESULTS) · `gSrcUntouched` (X-SRC-ZERO: `git diff
41c3a17 -- src/ tests/` EMPTY, `git status --porcelain -- src tests` EMPTY, and `git diff 170a5fa 41c3a17
-- src/` EMPTY) · `gWorld` (§P.A) · `gSeedsBookedEqualWalked` · `gSeedDisjoint` · `gN` · `gScratchBand` ·
`gAnchoredConstants` (**77** code-map needles at their occurrence counts — OP-C1's 56 + 21 new, FOUR of
them NEGATIVE needles pinned at count 0; canon, VERBATIM, CANON.md l.55–56: *"a seam-map gate pins
occurrence COUNTS per needle and enumerates EVERY occurrence's site"*) · `gPredicateFixtures` (OP-C0's and
OP-C1's copies re-run, and every NEW predicate firing AND not firing: the release-zone test at each edge
and its identity with the `guardSkip` geometry, the ahead-of-kicker split, the QD outcome, the
snapshot-membership test, the closing bins and CLOSED, the gc lane bins, the decider grouping, the shell
hazard CALLED on a body at the feet / the kicker / the receiver / a body aside; canon, VERBATIM, CANON.md
l.58–60: *"a scored face's walk-side predicate is pinned — anchored extraction or fixture — because the
re-derivation gate proves arithmetic, not definitions"*) · `gLedgerRead` (10 engine records, 11 declared
reconstructions, stored) · **`gPartition`** (per arm AND per seed: OP-C1's OP-C0 / QA / QB partitions;
**QC** — the reading × decider cells sum to the struck-through count, and per seat and reading to
OP-C1's own `qaReading` cell; per decider the `guardSkip` membership, choice-distance, release-distance and
closing tables each sum to that decider's `guardSkip` count; the 2-D and path tables to the `guardSkip`
count; the snapshot band table to the snapshot-seated `guardSkip` count; the gc cell / lane / hazard
tables to the `groundCandidate`-seated `guardSkip` count; **QD** — every ground release in exactly one
cell (= `relGround`); its opponent-first cells = OP-C0's `fbG.opponent`; an empty zone never books
`zoneManFirst`; per seat = OP-C0's `seatAll`; per decider = OP-C1's `qbAll` grouped by decider; the
beside split sums to the zone-occupied cells per outcome) · `gClassesNonVacuous` (OP-C1's set + the
snapshot-seated `guardSkip` balls, zone-occupied releases, a zone man touching first, and zone-empty
releases LIVE on both arms; empty denominators ENUMERATED) · **`gBite`** (the #414 ROW form; canon,
VERBATIM, CANON.md l.108–111: *"a liveness receipt for a switch whose effect is a RARE EVENT compares the
per-seed ROW (any stored field), not the full-time signature — a full-time state snapshot is not a
trajectory hash and a hat's whole effect can be absorbed before the whistle"*) · `gFaces` (every face, the
ownership table and the FIVE partitions re-derived from the SERIALIZED per-seed cells off disk) ·
`gHashOrder` (32-key allowlist, body hash last) · `gStage`.

⛔ **EVERY GATE IS A LIVENESS OR A RECEIPT. NOT ONE GATES A DIRECTION.** OP-C1's reconstruction receipts
(`gc.receipt.*`, `receipt.windupAimAgreesShare`, `snap.all.higherPricedAlt`) and `qc.gs.gc.seatArmed`
are PRINTED faces; none is gated.

### §P.K DEPARTURES DECLARED BEFORE THE FREEZE

1. **THE DECIDER IS READ OFF OP-C1's QB CELL** (`deciderOfQb`), the grouping OP-C1's own "BY DECIDER"
   faces use, not off `deciderOf` directly. The two differ only on a snapshot-decided release whose chosen
   option is missing from its own menu (QB cell `unread`); OP-C1 measured that cell at 0 on all 151,714
   ground passes of its block (`qb.all.unread`, both arms).
2. **ONE CELL BESIDE #430's QD** — the zone split by OP-C1's along edge 0 (§P.E BESIDE). #430's
   predicate (projection `< 1.5` m, which includes every man behind the kicker within 4 m of the segment)
   is applied LITERALLY and is the QD cell of record; the split is printed so the behind-the-kicker share
   is visible, and no face of record reads it.
3. **THE TWO DISTANCES ARE READ AT DIFFERENT PHASES OF A STEP**: at the choice, PRE-STEP (the decision's
   own positions); at the release, the release tick's POST-STEP positions (OP-C1's `qaPasserDist`). A
   synchronous release's closing therefore measures one tick; the path split stores wind-up and
   synchronous apart.
4. **THE SHELL HAZARD IS RECONSTRUCTED BY CALLING THE SHIPPED EXPORT** at the pre-step positions — the
   engine's closure value is not readable without a `src/` edit, and the decision's `why` does not print
   it, so there is no engine receipt for it (unlike the lane's `bestLane`). Its inputs are the inputs whose
   lane reconstruction agreed with the engine's printed `bestLane` on every OP-C1 pass (to 2 dp).
5. **SNAPSHOT MEMBERSHIP = OP-C0's presence test**: "in the snapshot" means the passer's own scoped pull
   on the choice step returned him (present = in scope ∧ remembered, `perceptionSnapshot.ts` l.592–594).
   A ball whose decider made no pull reads `truthRead`; the snapshot question does not apply to it.
6. **"THE ZONE MAN TOUCHED FIRST" WITH SEVERAL MEN IN THE ZONE = ANY OF THEM.**
7. **N = THE AFFORDANCE (999)** against the smoke's `nRequired` (§DEV-PREFLIGHT).

## §CODE MAP — each decider's price path, whether it skips a man near the kicker, and where snapshot membership is read (DESCRIBES; designs nothing)

Line numbers are at `41c3a17` (= HEAD's `src/`: `git diff 41c3a17 -- src/ tests/` is empty), each an
anchor receipt (`anchors[]`, occurrence-counted by `gAnchoredConstants`). OP-C1 §CODE MAP 1 (the seats)
is COPIED by reference: a ground pass is seated by `kickoff` (l.279–320), `groundCandidate` (`let passMate
= bestMate;` l.1425), the `snapshot` E3 chooser (`if (chosen) passMate = chosen;` l.1496),
`throughBall` (l.1787) or `cutback` (l.1697), all in `src/ai/PlayerBrain.ts` `decideCarrier`, decided on
the PRE-STEP positions.

1. **THE SNAPSHOT CHOOSER'S PRICE — NO CLEAR-RADIUS SKIP.**
   * `choosePerceivedPassTarget` (`src/ai/perceivedPassChoice.ts` l.258–305) prices every candidate with
     `pricePassOption` (l.178–249), which reads the corridor through `const read = evaluatePassOption({`
     (l.214); `READ` ⇒ `reception = threatQuintilePrice(threat)` (l.235), `band =
     threatBandIndex(threat)` (l.236), `price = attemptValueAt(cell, band)` under the value axis
     (l.237), times the own-lane factor (l.270–273); the pick is the strict argmax of `price` over
     executable options (l.274–279).
   * `evaluatePassOption` (`src/ai/passOptionValue.ts` l.114–190) loops `for (const entry of
     snapshot.players) {` (l.155), skipping only `if (entry.side === passer.side) continue;` (l.156), and
     prices EACH observed opponent with `evaluatePassCorridorInterception` (l.157); the threat is the
     largest `strongestMargin` over them (l.161–163).
   * `evaluatePassCorridorInterception` (`src/ai/passCorridorInterception.ts` l.62–160) starts the ball
     at the passer's PERCEIVED position (`let ballX = passer.pos.x;` l.97) and steps it `for (let tick =
     1; tick <= ticks; tick++) {` (l.109), comparing each ball time with the defender's reach ETA to that
     point (`estimateReach`, `reachRadius: CONTROL_RADIUS`, l.116–118). It returns null only for a missing
     body / profile, a gid coincidence or an unreachable flight (l.68–90). **The module contains no
     `continue` and no clear-radius constant** (NEGATIVE needles at count 0; nor do `passOptionValue.ts`
     and `perceivedPassChoice.ts` contain `CLEAR_RADIUS`). ⇒ A man at the passer's feet who is IN the
     snapshot is priced from the flight's first tick; the chooser can miss him only through the snapshot —
     his absence from it, or his remembered (aged) position and velocity.
2. **`groundCandidate`'S PRICE — ONE TERM SKIPS HIM, ONE DOES NOT.**
   * **THE LANE SKIPS HIM.** `lane = min(1, laneOpenness(p.pos, aim, opp.players) × (playmaker ? 1.15 :
     1))` (l.636–639); `laneOpenness` (`src/ai/perception.ts` l.143–154) skips every body with `if
     (dist(cp, from) < 1.5) continue;` (l.149) — a body whose closest point on the segment is within
     1.5 m of the passer — and otherwise takes the worst `clamp01(d / 4)` (l.151). The GATE `if (gain >
     0.15 && lane < 0.4) {` (l.655) reads that lane, so the gate cannot see the skipped man either.
   * **THE SHELL HAZARD DOES NOT.** With `const gcSeat = match.bkGroundCorridor ?
     deliveryValueSeatOf(g) : null;` (l.545) armed on world 18 (`bkGroundCorridor` ON and a non-absent DV
     gene — asserted by `gWorld`), the pricer subtracts `gcSeat.exposureWeight * groundShellHazard(p.pos,
     aim, gcBodies, p.gid, mate.gid)` (l.713–714) over `gcBodies = [team.players, opp.players]`
     (l.552–553). `groundShellHazard` (`src/ai/deliveryValueSeat.ts` l.548–567) names out the kicker and
     the receiver (l.559–560), takes `shell = o.coreRadius + BALL_RADIUS` (l.562 — the contact law's own
     expression, `Match.ts` l.5883) and returns 1 iff some body lies within the shell of the segment AND
     short of the target (l.563); **its own doc names the absence of the 1.5 m guard as deliberate**
     (l.524–528). ⇒ A man at the feet within one shell of the line is priced (binary, times the seat's
     weight); one at the feet but further aside than the shell is not priced by either term.
   * **THE DV EXPOSURE LIMB'S 1.5 m SKIP IS DORMANT.** `flightExposure`'s own `if (dist(cp, from as V2) <
     DV_CLEAR_RADIUS) continue;` (`deliveryValueSeat.ts` l.190) is reached only through `const dvSeat =
     match.dvDeliveryValue ? deliveryValueSeatOf(g) : null;` (l.515), and `dvDeliveryValue` is ABSENT on
     world 18 (asserted by `gWorld`).
3. **`throughBall` · `cutback` · `kickoff`** — their own choosers (OP-C1 §CODE MAP 2); not priced here.
4. **WHERE SNAPSHOT MEMBERSHIP IS READ.** The E3 chooser builds its scope with every non-sent-off
   opponent (`for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);` l.1447) and
   pulls `match.perceivedSnapshot(p, scope)` once (l.1456); `perceptionSnapshot.ts` includes a body iff
   it is in scope (`if (scope !== null && !scope.has(entity.gid)) continue;` l.592) AND remembered
   (`const observed = memory.players.get(entity.gid); if (!observed) continue;` l.593–594), at its
   remembered position. The instrument's copied observing wrapper (OP-C1 l.947–958) records the
   opponents of every scoped pull, stamped with the step; QC-3 reads THIS passer's pull on the CHOICE step.
   Passers who never reach the E3 block make no pull (`truthRead`).

⚠ The map is **needle-anchored**, not a whole-function extracted call graph; the decider identity rests
on OP-C1's receipts (the engine's own trace and `why` records), carried over by `gRepro`.

## §DEV-PREFLIGHT — the disclosed smoke, IN FULL (before the freeze)

Every run routes the artifact OFF every canonical path (the override guard refuses
`docs/world-model/data/`), on scratch seeds inside the declared band.

### 1. THE SHAKE-OUT (`900,009,600–601`, two arms)

`OPC2_MODE=smoke OPC2_N=2 OPC2_OUT=<scratch>/shake.json npx tsx scripts/probes/op-c2-feet-zone-census.ts`
— the first invocation did not start (an esbuild syntax error, a stray parenthesis in the QD face
builder; no walk ran); fixed. The second ran **19/19 GATES GREEN**, ⭐ `gRepro` **24/24** (OP-C1's stored
signatures AND its whole 69-key rows on 12,562,000–011, both arms, EXACT, with both observers open).
After it, ONE beside-cell was added — the zone's ahead-of-kicker split (`qdZoneAhead`, `zoneManAheadOf`
and its four fixtures; §P.K 2), prompted by seeing the zone occupied on about six in ten releases with
behind-the-kicker men inside #430's predicate — and the shake-out was re-run on the instrument WITH it:
**19/19 GREEN**, `gRepro` 24/24. No predicate of record was changed.

### 2. THE SIZING SMOKE OF RECORD — 12 seeds `900,009,600–611` (+ receipt 620), two arms, **19/19 GATES GREEN**

`OPC2_MODE=smoke OPC2_N=12 OPC2_OUT=<scratch>/preflight.json npx tsx scripts/probes/op-c2-feet-zone-census.ts`
(smoke artifact `bodySha256 1d20f2588c46034b2999abb10719aaf0c21e222cf3a8f25326474d6409abf1fb`; in-walk
6,483 ms over the 24 smoke walks). `gRepro` 24/24.

**THE SIZED FACE as the smoke measured it**: `qd.zone.zoneManFirst@W18-D` = 0.114247 (85 / 744), 95 % CI
[0.084821, 0.144168] ⇒ **hwSmoke = 0.0296735** (TRANSCRIBED into the instrument as `HW_SMOKE_RECORD`;
that one constant is the only byte changed after the smoke). `seSmoke` 0.015139819014053719 · `seNeeded`
0.017847038768172088 · **`nRequired` = 9** ⇒ **N = THE AFFORDANCE, 999** (§P.G) — walked, and said
plainly: 9 would size the headline face; the QC balls by decider and the QD cells by decider and seat
are sized by nothing but volume.

⚠ The smoke's other numbers are **NOT results** (scratch seeds; disclosed only so the instrument is seen
to run): `qd.zoneShare` W18-E 0.621744 (549 / 883) · W18-D 0.685714 (744 / 1,085); the sized face on
W18-E 0.083789 (46 / 549); `qa.reading.guardSkip` W18-E 0.396226 (42 / 106) · W18-D 0.529801 (80 / 151).
No partition is read on them.

## §R RESULTS (every number below QUOTES the artifact's own fields at the six decimals it stores — the artifact is the numbers of record)

**RUN RECEIPTS.** Freeze **`1f95398`**; `git diff 1f95398 -- scripts/probes/op-c2-feet-zone-census.ts`
**EMPTY (0 bytes)**; `stage.instrumentSha256 =
1c99ed4a2131bc8668cde3e068a1d42832e1f28abea69d8010621cd51f9faf32` (= the running file). **`allGreen` =
true** (19 gate objects, every one `ok: true`). Artifact `docs/world-model/data/op-c2-feet-zone-census.json`,
**7,026,622 bytes**, `fileSha256 = 0c349df06aa9402c1e4964cf5782cbbfb0112991afee04b4ef29bd264a2deaa9`,
`bodySha256 = 307c2e1d8b0391b7a2324c012ab8b9a29bc649a34c870cc0c9cfd30834b383bd`,
`receipts.hashReproducesFromFile` **true**. Battery **999 seeds (12,563,000–12,563,998) × 2 arms + the
construction receipt 12,563,999 × 2 ⇒ BOOKED = WALKED = 2,000 walks**; `seeds.unwalkedTail` **null** —
the block is consumed WHOLE. **`gRepro` 24/24** (OP-C1's stored W18-E / W18-D signatures AND whole
69-key rows on 12,562,000–011, walked BEFORE any census seed; `repro.opc1BodySha256` = OP-C1's
`e695cb02…84ce4f0`). `gLockstep` 4/4 and X-DET 4/4 on 900,009,690–691. **X-SRC-ZERO**: `git diff 41c3a17
-- src/ tests/` **0 bytes** (gate note; and `git diff 170a5fa 41c3a17 -- src/` 0 bytes). **X-FP-PROD**:
`fingerprintProd.computed` = `59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d` = the x64
pin (`ok` true); `npm run fingerprint` was also run at RESULTS (a CLI print, not an artifact field). ZERO
stats, registry **88**. `perf.inWalkMsBattery` 606,990 ms over 1,998 battery walks. Sizing: `nRequired` 9
against the affordance 999; realised half-width on the sized face 0.0025480000000000017
(`sizing.realisedHalfWidthThisRun`). The GC seat's exposure weight on the pin: 0.5 / 0.5 on both arms
(`worldPin[].gcSeatExposureWeight`).

**THE POPULATION ON THIS BLOCK** (W18-E / W18-D): ground releases **70,548 / 80,724**;
`fb.ground.opponent` 0.318762 (22,488) / 0.310317 (25,050); struck-through (④) 9,031 / 10,199
(`q2.wide.struckThrough` 0.401592 / 0.407146); `guardSkip` **3,520 / 5,448** (`qa.reading.guardSkip`
0.389769 / 0.53417, Δ +0.144401 [+0.130487, +0.158632]). OP-C1's figure on its own block (12,562,000–998,
same host): 0.395447 / 0.530706. ⛔ No verdict word on the comparison.

### §R1 ⭐⭐⭐ QC-1 — WHO SEATED THE STRUCK-THROUGH BALLS, BY READING

**The decider mix within each reading** (`qc.givenReading.<reading>.<decider>`; W18-E / W18-D):

| reading (n E / D) | snapshot | groundCandidate | throughBall | cutback | kickoff | other (unread) |
| --- | --- | --- | --- | --- | --- | --- |
| **`guardSkip`** (3,520 / 5,448) | **0.909375 / 0.90804** | **0.033523 / 0.037261** | 0.057102 / 0.053965 | 0 / 0.000734 | 0 / 0 | 0 / 0 |
| `steppedAcross` (3,431 / 2,861) | 0.704751 / 0.652569 | 0.027689 / 0.009088 | 0.259691 / 0.337644 | 0.002623 / 0.000699 | 0.005246 / 0 | 0 / 0 |
| `leftLineEarly` (1,126 / 1,194) | 0.395204 / 0.371022 | 0.047957 / 0.029313 | 0.549734 / 0.588777 | 0.007105 / 0.010888 | 0 / 0 | 0 / 0 |
| `leftover` (954 / 696) | 0.787212 / 0.771552 | 0.038784 / 0.011494 | 0.169811 / 0.216954 | 0.001048 / 0 | 0.003145 / 0 | 0 / 0 |

W18-D `guardSkip`, counts: snapshot 4,947 · groundCandidate 203 · throughBall 294 · cutback 4. Δ (D − E)
on the snapshot share of `guardSkip`: −0.001335 [−0.012717, +0.011274]; on groundCandidate's: +0.003738
[−0.004491, +0.011405]. As a share of the WHOLE struck-through class (`qc.guardSkip.<decider>`), W18-D:
snapshot 0.485048 · groundCandidate 0.019904 · throughBall 0.028826. **By seat** (`qc.<seat>.guardSkip.*`,
W18-D): `plain` snapshot 0.903975 (4,321 / 4,780) · groundCandidate 0.033682 · throughBall 0.061506;
`dxAim` snapshot 0.932292 (537 / 576) · groundCandidate 0.067708; `dlcChoice` snapshot 0.967391 (89 / 92)
· groundCandidate 0.032609.

### §R2 ⭐⭐⭐ QC-2 — THE DECIDING PRICE AT THE CHOICE (the `guardSkip` balls)

**Snapshot-seated** (n 3,201 / 4,947), the chosen option's own band (`qc.gs.snap.band.*`):

| band | −1 (unread) | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- | --- |
| W18-E | 0 | 0.2796 | 0.346142 | 0.139019 | 0.13527 | 0.099969 |
| W18-D | 0 | 0.233071 | 0.349909 | 0.15565 | 0.159086 | 0.102284 |

`qc.gs.snap.shut` (bands 3–4, OP-C1's declared coin) **0.235239** (753) / **0.261371** (1,293) [0.248988,
0.274]; `qc.gs.snap.open` (bands 0–2) **0.764761** / **0.738629**; Δ shut +0.026132 [+0.006137,
+0.045892].

**groundCandidate-seated** (n 118 / 203): the gate cell (`qc.gs.gc.*`) `gcOpen` **0.872881** (103) /
**0.876847** (178) · `gcBelowBarNotForward` 0.008475 / 0.073892 · `gcGateFired` **0.118644** (14) /
**0.049261** (10). The gate's lane, bins [0, 0.2) · [0.2, 0.4) · [0.4, 0.6) · [0.6, 0.8) · [0.8, 1]:
W18-D 0.014778 · 0.108374 · 0.103448 · 0.039409 · **0.73399** (W18-E 0.016949 · 0.110169 · 0.135593 ·
0.042373 · 0.694915). **The shell hazard as the engine computes it fired** on **0.016949** (2 / 118) /
**0.019704** (4 / 203) (`qc.gs.gc.hazardFires`); the GC seat was armed on every one (`qc.gs.gc.seatArmed`
1 / 1).

**throughBall · cutback** (W18-D 294 + 4): not priced (§P.D).

### §R3 ⭐⭐⭐ QC-3 / QC-4 / QC-5 — MEMBERSHIP, DISTANCE, CLOSING (the `guardSkip` balls)

**Snapshot membership at the choice** (`qc.gs.presence.*`, pooled; W18-E / W18-D): `snapshotPresent`
**0.92983** (3,273) / **0.929699** (5,065) · `snapshotAbsent` **0.003125** (11) / **0.001836** (10) ·
`truthRead` 0.067045 / 0.068465 · `noChoiceRead` 0 / 0. By decider (W18-D): snapshot-seated present
**0.997979** (4,937 / 4,947), absent 0.002021 (10); groundCandidate-seated present 0.630542 (128 / 203),
absent 0, `truthRead` 0.369458 (75); throughBall `truthRead` 1 (294 / 294).

**Distance to the passer** (bins [0, 1.5) · [1.5, 4) · [4, 8) · [8, 15) · [15, 25) · [25, ∞) m), pooled
(the last two bins are 0 on both arms and both phases):

| | [0, 1.5) | [1.5, 4) | [4, 8) | [8, 15) |
| --- | --- | --- | --- | --- |
| at the CHOICE, W18-E | 0.388352 | 0.5875 | 0.024148 | 0 |
| at the CHOICE, W18-D | 0.396109 | 0.580213 | 0.023311 | 0.000367 |
| at the RELEASE, W18-E | 0.501989 | 0.487784 | 0.010227 | 0 |
| at the RELEASE, W18-D | 0.515969 | 0.479993 | 0.004038 | 0 |

By decider, W18-D: snapshot-seated choice [0, 1.5) 0.372549 · [1.5, 4) 0.60279; release 0.496665 ·
0.499495. groundCandidate-seated choice 0.527094 · 0.448276; release 0.699507 · 0.295567.

**The closing** (choice − release; `qc.gs.close.*`; opened · [0, 0.5) · [0.5, 1.5) · [1.5, 4) · ≥ 4 m):
W18-E 0.290057 · 0.39233 · 0.277557 · 0.040057 · 0; W18-D 0.281204 · 0.397944 · 0.271109 · 0.049743 · 0.
**CLOSED (≥ 1.5 m)** `qc.gs.closed` **0.040057** (141) / **0.049743** (271), Δ +0.009686 [+0.000945,
+0.018744]; by decider W18-D snapshot 0.052153 (258 / 4,947) · groundCandidate 0.064039 (13 / 203) ·
throughBall 0 (0 / 294). By path: wound up `qc.gs.windupShare` 0.743466 / 0.749816; closed given wind-up
0.053878 (141 / 2,617) / 0.06634 (271 / 4,085); closed given synchronous 0 (0 / 903) / 0 (0 / 1,363).

**The bridge** `qc.gs.zoneAtRelease`: the contacting man was in the release zone on **0.990057** (3,485) /
**0.996329** (5,428) of the `guardSkip` balls.

### §R4 ⭐⭐⭐ QD — THE DENOMINATOR (every ground release)

| face | `W18-E` | `W18-D` | Δ (D − E) |
| --- | --- | --- | --- |
| `qd.zoneShare` — a man in the skip zone at release | 0.6223 (43,902 / 70,548) | 0.683762 (55,196 / 80,724) | +0.061462 [+0.056505, +0.066402] |
| ⭐ `qd.zone.zoneManFirst` — given that, the zone man touched first | **0.091271** (4,007) [0.088607, 0.094093] | **0.105624** (5,830) [0.103104, 0.1082] | +0.014353 [+0.010614, +0.018091] |
| `qd.zone.otherOppFirst` | 0.243588 | 0.226611 | −0.016977 [−0.022043, −0.011321] |
| `qd.zone.anyOppFirst` — given that, ANY opponent first | **0.334859** (14,701) | **0.332234** (18,338) | −0.002625 [−0.008302, +0.003285] |
| `qd.zone.notOppFirst` | 0.665141 | 0.667766 | +0.002625 [−0.003267, +0.008312] |
| **COMPLEMENT** `qd.noZone.anyOppFirst` — zone empty, any opponent first | **0.292239** (7,787 / 26,646) | **0.262927** (6,712 / 25,528) | −0.029312 [−0.037094, −0.021084] |
| `qd.noZone.notOppFirst` | 0.707761 | 0.737073 | +0.029312 [+0.02111, +0.037115] |

**BY DECIDER** (W18-D; W18-E in brackets):

| decider (releases, W18-D) | zoneShare | zone.zoneManFirst | zone.anyOppFirst | noZone.anyOppFirst |
| --- | --- | --- | --- | --- |
| snapshot (57,968) | 0.773133 (0.69348) | **0.118415** (0.107109) | 0.3525 (0.363248) | 0.309254 (0.364616) |
| groundCandidate (10,681) | 0.175358 (0.159873) | **0.111052** (0.083494) | 0.189002 (0.228003) | 0.123751 (0.105353) |
| throughBall (6,175) | 0.608907 (0.5601) | 0.082713 (0.073028) | 0.508511 (0.497416) | 0.478261 (0.49693) |
| cutback (1,184) | 0.044764 (0.025376) | 0.075472, 4 / 53 (0, 0 / 27) | 0.490566 (0.185185) | 0.353669 (0.267117) |
| kickoff (4,716) | 0.995123 (0.994841) | 0 (0.000192) | 0.052845 (0.090455) | 0, 0 / 23 (0.074074) |
| other (unread) | no release on either arm | — | — | — |

groundCandidate's zone-occupied releases on W18-D: 1,873, of which the zone man touched first on 208.

**BY SEAT** (W18-D; W18-E in brackets):

| seat | zoneShare | zone.zoneManFirst | zone.anyOppFirst | noZone.anyOppFirst |
| --- | --- | --- | --- | --- |
| `dlcChoice` | 0.423493 (0.291024) | 0.092153 (0.079439) | 0.363139 (0.339564) | 0.205764 (0.487852) |
| `dxAim` | 0.790657 (0.779475) | 0.093331 (0.101331) | 0.337808 (0.373151) | 0.340918 (0.407843) |
| `plain` | 0.674611 (0.616442) | 0.10856 (0.090035) | 0.330294 (0.329309) | 0.257814 (0.271739) |

**BESIDE (§P.K 2): the zone by the kicker's line.** Of the zone-occupied releases, at least one zone man
at `t ≥ 0` on **0.282402** (12,398) / **0.308972** (17,054) (`qd.zone.aheadShare`); there the zone man
touched first **0.199145** / **0.220887** and any opponent first 0.429747 / 0.429225. Every zone man
behind the kicker: zone man first **0.048819** / **0.054087**, any opponent first 0.297518 / 0.288868.

### §R5 在说人话的层面

⛔ 这一段只把上面的数换成白话，不下结论。

* ④ 里"脚边那一类"（`guardSkip`）在成熟账本那一档有 5,448 个球：**0.90804** 是快照选人那个选择器拍的板，
  按真实位置打分的那个只拍了 **0.037261**（203 个），直传 0.053965。
* 快照选择器拍板的那些球里，碰球的那个人在拍板那一刻**在**传球人的快照里的占 **0.997979**；快照选择器自己
  给这条线读的威胁档，落在"校准成功率低于一半"那两档的是 **0.261371**，其余 **0.738629** 落在 0–2 档。
* 按真实位置打分的那 203 个球：它的车道读数（带 1.5 米略过）在 0.8 以上的占 0.73399，那道"往前传且线不干净
  就打折"的闸只在 10 个上触发；没有 1.5 米略过的那个"贴身壳"危险项只在 4 个上亮了。
* 碰球的那个人，在拍板那一刻离传球人不到 1.5 米的占 0.396109、1.5–4 米 0.580213；到出脚那一刻不到 1.5 米的
  占 0.515969。拍板到出脚之间贴近了至少 1.5 米的只有 **0.049743**。
* 分母：所有地面传球里，出脚那一刻"脚边那块区域"（沿线不超过 1.5 米或在身后、离线段 4 米以内）站着对手的占
  **0.683762**；这些球里最先碰到球的就是那块区域里的人的占 **0.105624**，是任何一个对手的占 0.332234；那块区域
  空着的球，最先碰到对手的占 0.262927。那块区域里的人大多在传球人身后：至少有一个人在传球人前方（沿线 0–1.5 米）
  的只占 0.308972，那种情况下他先碰到球的占 0.220887。

## §HONEST LIMITS

**THE ONE HOME.** The artifact stores none of this list (`stage.honestLimitsNote`).

1. ⭐⭐⭐ **"SHUT" FOR THE SNAPSHOT CHOOSER IS STILL OP-C1's DECLARED LINE** (a READ band whose calibrated
   reception is below one half). All six bands are stored (§R2), so the snapshot side moves if the line
   moves: bands 2–4 together are 0.15565 + 0.159086 + 0.102284 = 0.417020 of W18-D's snapshot-seated
   `guardSkip` balls (sum of stored shares).
2. ⭐⭐ **THE SNAPSHOT PRICE IS READ ON PERCEIVED POSITIONS.** "In the snapshot" (0.997979 of the
   snapshot-seated `guardSkip` balls, W18-D) says the chooser HAD the man; it does not say his remembered
   position or velocity was current. The chooser's own `threatDefenderGid` is not in the trace, so whether
   the chosen band was set by the contacting man or by another opponent is NOT STORED.
3. ⭐⭐ **THE ZONE IS #430's LITERAL PREDICATE, AND IT IS MOSTLY MEN BEHIND THE KICKER**: on W18-D,
   1 − 0.308972 = 0.691028 of the zone-occupied releases have every zone man at `t < 0`.
   `qd.zone.zoneManFirst` pools both halves; the beside split (§R4) is the only stored picture of them, and
   no face of record is drawn on it.
4. **THE SHELL HAZARD HAS NO ENGINE RECEIPT** (§P.K 4): the shipped export called on the reconstructed
   pre-step bodies; its lane twin agrees with the engine's printed `bestLane` (OP-C1), the hazard itself is
   never printed by the engine.
5. **QC's DISTANCES MIX PHASES** (§P.K 3): pre-step at the choice, post-step at the release. A synchronous
   release's closing spans one tick; it booked CLOSED 0 times on both arms (§R3).
6. **`zoneManFirst` IS FIRST BODY ONLY.** A zone man who touched the ball after another body is not
   counted; with several zone men, any of them counts (§P.K 6).
7. **THROUGH BALLS AND CUTBACKS ARE NOT PRICED** (294 + 4 of W18-D's `guardSkip` balls); they make no
   scoped pull, so they read `truthRead` on membership.
8. **THE `groundCandidate` CELLS ARE SMALL** (118 / 203 `guardSkip` balls; 14 / 10 gate-fired; 2 / 4
   hazard-fired): wide intervals (§R2); rare classes sized by volume only.
9. **NO GATE MEASURES QUALITY.** Every one of the 19 is a liveness or a receipt.
10. **ONE HEAD, ONE BLOCK.** Every number is `41c3a17`'s `src/` on x64, N = 999; arm64 is ≈ only (#418).

## §DEVIATIONS (declared by the executor; the commander disposes)

1. The seven departures declared BEFORE the freeze (§P.K) stand as written: the decider read off OP-C1's
   QB cell; one beside-cell (the zone's ahead / behind split); the two distances at different step phases;
   the shell hazard reconstructed by calling the export; membership = OP-C0's presence test; "the zone
   man" = any zone man; N = the affordance.
2. **AFTER THE FIRST SHAKE-OUT, ONE BESIDE-CELL WAS ADDED** (`qdZoneAhead`, `zoneManAheadOf` and four
   fixtures) and the shake-out re-run; no predicate of record changed (§DEV-PREFLIGHT 1).
3. **ONE CONSTANT TRANSCRIBED AFTER THE SMOKE, BEFORE THE FREEZE** — `HW_SMOKE_RECORD` = 0.0296735.
4. **N = THE AFFORDANCE (999) against `nRequired` 9.**
5. **THE STATUS PARAGRAPH** above §0 moved at RESULTS (the OP-C0 / OP-C1 practice); §0–§DEV-PREFLIGHT did
   not.
6. **THE ARTIFACT IS 7,026,622 BYTES** (OP-C1's: 4,754,312) — the new per-seed cells are stored for
   `gFaces`; compact JSON as specified.

## §GATES — 19 of 19 GREEN (`allGreen` = **true**, a STORED boolean)

| gate | ✅ | what it asserts (the notes are stored in `gates[]`) |
| --- | --- | --- |
| `gRepro` | ✅ | 24/24: OP-C1's stored W18-E / W18-D signatures AND whole 69-key rows on 12,562,000–011, exact, BEFORE any census seed |
| `gLockstep` | ✅ | 4/4: the snapshot wrapper and the E3 trace door leave the whole-match signature byte-identical |
| `gDeterminism` | ✅ | X-DET 4/4: signatures AND row bytes identical across two observed walks |
| `gFingerprintProd` | ✅ | in-process `59f42aa7…a072d` = the x64 pin |
| `gSrcUntouched` | ✅ | `git diff 41c3a17 -- src/ tests/` 0 bytes; porcelain 0 bytes; `git diff 170a5fa 41c3a17 -- src/` 0 bytes |
| `gWorld` | ✅ | every walk on world 18 with OP-C1's set; the pin: GC shell seat armed both sides (weights 0.5), `dvDeliveryValue` absent; dose bytes pinned |
| `gSeedsBookedEqualWalked` | ✅ | 999 × 2 + 2 = 2,000 walks |
| `gSeedDisjoint` | ✅ | inside 12,563,000–999; 19 consumed blocks below; re-walks inside OP-C1's block; no SIM seed ≥ 12,564,000; ZERO stats |
| `gN` | ✅ | N_FROZEN 999, no override env |
| `gScratchBand` | ✅ | every scratch seed from the ONE base 900,009,600; verifier 900,009,700–799 disjoint |
| `gAnchoredConstants` | ✅ | 77/77 needles at their counts (four NEGATIVE at 0); the gate, multiplier, stagnation, gain and playmaker constants parsed |
| `gPredicateFixtures` | ✅ | 160/160 |
| `gLedgerRead` | ✅ | 10 engine records, 11 declared reconstructions (stored) |
| `gPartition` | ✅ | per arm and per seed: OP-C0 owners 70,548 / 80,724; QA 9,031 / 10,199; QB in-lane 11,584 / 13,519; QC 9,031 / 10,199 (guardSkip tables 3,520 / 5,448); QD 70,548 / 80,724 |
| `gClassesNonVacuous` | ✅ | both arms live on every class the partitions stand on; empty denominators ENUMERATED (`emptiness`) |
| `gBite` | ✅ | the #414 ROW form: 999/999 rows differ (818 cells); signature coincides on 0 (printed) |
| `gFaces` | ✅ | 1,354/1,354 face checks, the ownership table and the five partitions re-derived off disk |
| `gHashOrder` | ✅ | 32-key allowlist; body hash last; reproduces from the file |
| `gStage` | ✅ | `stage.instrumentSha256` = the running file's hash |

**CONSUMPTION.** Block `12,563,000–999` consumed whole. Scratch `900,009,600–699` (executor); the
verifier's band is `900,009,700–799`. ZERO stats: `stats: { consumed: 0, nextBase: 117_600,
registryOfRecord: 88 }`. Next sim ≥ **12,564,000**.

## §COMMANDER CORRECTIONS (ruling #431 — the verifier's PASS, zero HIGH, one MEDIUM, three LOW, disposed; ⛔ no frozen byte and no stored number moves)

The independent verifier returned **PASS** (freeze intact; copies byte-faithful to OP-C1; gRepro 24 / 24; every
numeral traced; QC and QD partitions exact). Where a finding contradicts a sentence above, **this section governs**.

1. ⭐⭐ **MEDIUM — §CODE MAP 1 maps WHO, not WHETHER. ACCEPTED, and it is the census's most important code fact.**
   The snapshot chooser runs only after the brain has already chosen to pass: E3 fires on
   `top.action === 'Pass' … && bestMate !== null` (`PlayerBrain.ts`, the E3 block; its own comment: "The brain has
   already decided to pass; WHO gets it is priced from this body's own…") and rewrites `passMate` only. The `Pass`
   candidate's score is `bestPass`, taken from `groundCandidate(...).s`, whose `lane` is `laneOpenness(p.pos, aim,
   opp.players)` — WITH the 1.5 m "the kick clears them" skip — less only the GC shell term; and under pressure
   `bestPass *= W.passOutletMul` ("pass is the pressure outlet"). ⇒ **Every snapshot-seated ball was licensed by a
   price that skips the man at the feet.** The "no clear-radius skip" sentence holds for the snapshot chooser's
   TARGET price only. QC-2 stored the target price's band, not the licence's price.
2. **LOW — the null paths of `evaluatePassOption` / `evaluatePassCorridorInterception`** are listed incompletely
   (`if (!corridor) continue;`; the non-finite return); neither is a distance skip, the conclusion stands.
3. **LOW — `truthRead` under `groundCandidate`** also includes E3 runs with zero candidates in the snapshot window
   (`candidateGids.length === 0` ⇒ no pull, `chosenGid` −1), not only the seats listed. The count stands; the gloss
   is widened.
4. **LOW — "mostly men behind the kicker" (HONEST LIMITS 3, §R5)** describes a stored share (0.691028 of zone-occupied
   releases have every zone man behind the kicker); it is not a reading of #430 item 3's frozen outcomes.

**WHAT THE TABLES SAY (W18-D).** The `guardSkip` balls were seated by the snapshot chooser on 0.90804; the man was in
its snapshot on 0.997979; its target price read the line in bands 0–2 ("open") on 0.738629; he closed ≥ 1.5 m between
the choice and the release on only 0.049743. A man AHEAD of the kicker in the zone at release touched the ball first
on 0.220887 of those releases (behind only: 0.054087). ⇒ **none of #430 item 3's three frozen outcomes holds as
written** (not mostly `groundCandidate`-seated; not priced shut; not absent and not closing) — the commander rules a
fourth reading at #431.
