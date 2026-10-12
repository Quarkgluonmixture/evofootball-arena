# OP-C2 — 「脚下那个人 · 谁算漏了」 THE FEET-ZONE CENSUS（`guardSkip` 那些球是谁拍的板、它自己怎么算的；以及分母：出脚时脚边有人，那人先碰到球的有多少）

> **STATUS: FROZEN — §0 through §DEV-PREFLIGHT and the instrument are sealed at the FREEZE commit,
> BEFORE any battery seed is walked.** §R onward is written after the battery, and nothing above it
> moves after sight (only this STATUS paragraph).
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
