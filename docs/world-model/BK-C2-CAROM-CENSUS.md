# BK-C2 — THE CAROM CENSUS (instrument-only)

> **Who caroms · the stale map sized · the speed question answered with data · the impact
> decomposed.** Authorized by **COMMANDER RULING #341 item 3**, serving **THE RED OF RECORD** of
> that same ruling. Contract: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md).
> Artifact: `docs/world-model/data/bk-c2-carom-census.json`.
> Instrument: `scripts/probes/bk-c2-carom-census.ts`.
>
> **THIS IS A CENSUS.** It publishes MEASUREMENTS. It scores no hypothesis, arms no mechanism and
> makes no football claim. ZERO src behaviour change: no file under `src/` is touched, and
> `gSrcUntouched` proves it against `git diff --stat HEAD -- src` AND
> `git status --porcelain -- src`.

## §0 THE WORDS OF RECORD

The user, playing the entry ladder, verbatim — the question first (#340 item 1):

> 「我发现传球经常会传到别人身上然后反弹回来,这个和传球速度有关系吗?还是怎么样,」

then the play-test verdict that made it THE RED (#341 item 1):

> 「我直接看的最后一版,传球像人,防守还可以,乱跑缓解,**但是弹身体感觉很影响比赛**,门将球
> 合理了」

**In plain football language**: the ball keeps hitting people and bouncing back, and it is
spoiling the game. #341 item 2 ruled this a complaint against the **CHOOSER**, not against the
contact law — the same eyes ratified the law's other faces in the same sentence.

## §1 THE FOUR FROZEN QUESTION GROUPS (#341 item 3, verbatim scope)

* **(a) WHO CAROMS** — every bodyStrike binned by body class (`kickCooldown` vs `stunTimer`) ×
  side relative to the KICKER of the flight (teammate vs opponent) × distance of the striking
  body from the pass line AT KICK TIME × context (the quick-exchange story **measured**, with N
  frozen from the engine's own cooldown constant — never taste).
* **(b) THE STALE MAP SIZED** — for every caromed GROUND pass, what `laneOpenness` scored that
  exact line at the moment of choice, re-derived offline, BESIDE the counterfactual contact-shell
  hazard read on the same line (BK-T3's `flightExposure`-restricted-to-strike-bodies form). The
  published joint distribution answers: *how many caroms happened on lines the old map called
  OPEN that the shell read would have called BLOCKED.*
* **(c) THE SPEED QUESTION** (the user's own) — carom rate vs ball speed along the line, from the
  natural variation the shipped power law already plays. ⚠ **THE CONFOUND IS NAMED AND HANDLED**:
  speed covaries with pass distance under that law, so the answer of record is
  **speed-within-distance-strata**; the raw marginal is published only so the confound's size is
  visible.
* **(d) IMPACT** — what share of possession losses, and what share of events scored as
  "interceptions" by the shipped counters, ARE bodyStrike caroms.

## §2 THE TWO ARMS

**w11** = `a4MatchFlags(CORRIDOR_WORLD_VERSION)` + `armA4World(m, null, CORRIDOR_WORLD_VERSION)`
— **the world the user judged**. **w9** = `a4MatchFlags(BK_WORLD_VERSION)` +
`armA4World(m, null, BK_WORLD_VERSION)` — the no-DF / no-corridor isolate. **Shared virgin
seeds**: every seed is walked by both arms, and the bootstrap cluster is the seed, so the arms
are paired by construction.

Each arm arms **ONLY its own flag set**, by CALLING `src/game/a4World.ts`'s own composer — no
flag literal and no version literal is typed in the probe. This is R-乙 epoch 3's `matchFor`
idiom byte for byte, including its **null dose arguments**, so the arms are the ones R-乙 epoch 3
walked and §(d)'s quotation sits beside comparable worlds.

⚠ **NO BETWEEN-ARM EFFECT SIZE IS CLAIMED.** w9 and w11 differ by the two DF doors AND the
corridor price at once; any difference between them is multi-factor and is reported as an
anatomy, never as an effect (canon: **receipts ≠ effect sizes** — homes: ruling #289 item 1 +
BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).

CANON, VERBATIM, quoted because the census walks worlds: *"WORKER-SIMMED fixtures play the
SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines
#270's E4 correction; matches the perf diagnostic)"* (home: ruling #283.2(iv)). This probe builds
`Match` **directly** and never round-trips a League, so no worker fixture is generated and the
sentence binds nothing here.

## §3 ⛔ X-SRC-ZERO — WHAT THE OBSERVER IMPORTS INSTEAD OF ADDING

#341 item 3's ⛔ is binding: *"the probe re-derives from walked state (`laneOpenness` is
exported; `bodyStrike` claims are ledgered); if any face genuinely requires a src counter,
ESCALATE, never improvise."* No face required one. The probe:

* **imports the exported readers** — `laneOpenness` (`src/ai/perception.ts`), `flightExposure`
  (`src/ai/deliveryValueSeat.ts`), `closestPointOnSegment` (`src/utils/vec.ts`) — and CALLS them,
  never re-implements them;
* **reads the engine's own ledger** — `Match.bkContactLedger` (`strikesApplied`,
  `strikesAppliedCooldown`, `strikesAppliedStunned`), which BK-T1 built as pure bookkeeping;
* **reads public match state** per tick — `ball`, `allPlayers`, `teams[].stats`, `phase`,
  `simTick`, and (through one read-only cast, the BK-C1 idiom) `pendingPass`,
  `pendingPassWindup` and `possessionSide`.

## §P THE PRE-REGISTRATION (frozen at the freeze commit, BEFORE any battery is read)

### §P.1 WHO IS THE STRIKING BODY — the attribution rule, and its own honesty face

A **strike tick** is a tick on which `bkContactLedger.strikesApplied` moved by exactly one. The
struck body is the ball's own `lastTouch` **after** the step: `bkApplyBodyStrike` sets
`ball.lastTouch = p` and returns, and the shipped one-contact-per-tick order guarantees at most
one contact resolves per tick. The attribution is **GATED, not assumed** —

* the named body must still be inside the contact law's own gate (`kickCooldown > 0 ||
  stunTimer > 0`; the strike itself resets neither), **and**
* his class must agree with the ledger's OWN cooldown/stunned split for that tick.

A tick failing either test is booked `strikesUnattributed` and enters **no other cell**.
`gStrikeLedgerAgrees` requires `strikes + strikesUnattributed === strikesApplied` match by match;
`strikeAttributionCompleteness` publishes the share the walk could name, and
`gStrikeAttributionComplete` fails the census below 99 %. ⚠ That face is an **instrument
receipt**, never a football finding.

### §P.2 THE LIVE FLIGHT, THE SIDE AND THE LINE DISTANCE

A **flight** opens at a release (R9's / BK-C0 §2(a)'s per-side stat-delta ladder, reused
verbatim, with shots and every headed contact NAMED OUT) and retires when any body other than the
kicker owns the ball, or after **720 ticks** (R9's own retire cap, inherited — BK-C1 §3). SIDE is
the striker's side relative to **the kicker of that flight**: `teammate` or `opponent`. A strike
outside a live flight is booked in a third slot and enters neither the side nor the line cells.

**THE LINE DISTANCE** is the perpendicular distance from the striking body's position **AT THE
KICK TICK** to the segment (launch point → aim). It is deliberately *not* where he stood when he
was struck: bodies move, and the question #341 asked is what the chooser could have seen.
Bins: 0.5 m, 13 bins ([0, 6) m + one overflow).

### §P.3 THE QUICK-EXCHANGE WINDOW N — derived from the engine, never taste

**N = `KICK_COOLDOWN` / `DT` = 0.45 s / (1/60) = 27 ticks.** `KICK_COOLDOWN` is the very constant
the contact law's filter reads (`p.kickCooldown > 0`), extracted with an anchored match and a
line receipt from `src/sim/constants.ts` (canon, VERBATIM: *"a src-extracted constant pins its
extraction to the NAMED call site — anchored match + line receipt — never first-occurrence"*,
home: BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1). Age bins are
`[0, N/3), [N/3, 2N/3), [2N/3, N), [N, 2N), ≥ 2N or never` — non-uniform by construction, so **no
bin-median is published for them** (it would carry no unit).

⭐ **TWO CONTEXT AXES, BOTH PUBLISHED.** "Since his own KICK" is the story as told; but a body is
put on `kickCooldown` by a control contact (`CONTACT_COMMIT_TIME`) and by a whiff (0.3 s) as well
as by a kick, so **"since his own last BALL CONTACT"** is measured beside it. Reporting only the
first would tell a story the ledger does not support. The sharpest form — *the struck body
released the PREVIOUS delivery* — is its own face.

### §P.4 (b) THE TWO READS ON THE SAME LINE

For every **measured ground pass** — a release with no positive vertical component, of class
shortPass / throughBall / cutback, for which the engine itself names a target
(`pendingPass.targetGid`), so a LINE exists to price — two reads are taken **at the moment of
choice**:

1. **THE OLD MAP**: `laneOpenness(kicker.pos, aim, opponents)`, the exported function CALLED, and
   the value the chooser actually saw (the playmaker's ×1.15 applied, `Math.min(1, ·)`, exactly
   as `groundCandidate` computes it). The raw value is stored beside it.
2. **THE CONTACT-SHELL COUNTERFACTUAL**: `flightExposure(kicker.pos, aim, strikeBodies)` — BK-T3's
   hazard is *"`flightExposure`'s SHIPPED form restricted to the bodies this flight can actually
   strike"*; a GROUND pass clears nobody, so the height gate degenerates and the restriction is
   exactly the **body set**. Two body sets, both published, neither called the truth:
   * `all` — every body but the kicker and the intended receiver, **both sides**. The physical
     upper bound (any of them can be cooling by the time the ball arrives).
   * `cooling` — only the bodies already inside the contact law's gate at the choice tick. The
     chooser-honest lower bound (a body may enter cooldown while the ball travels).
   Beside the hazard, a **SHELL-BLOCKED predicate**: some body's physical shell
   (`coreRadius + ball.radius`, the contact law's own expression, anchored at its `Match.ts` site)
   sits on the line, **short of the target** (`along < d − shell`).

⭐⭐ **THE INTENDED RECEIVER IS NAMED OUT** of both reads — BK-C1 §4(ii)'s own anchored condition,
reused in intent: *"a delivery that reaches its man and is met there is a delivery ARRIVING, not a
block"*. He stands AT the aim point, so leaving him in makes every line blocked and every hazard
1. **Measured in the sizing smoke before the freeze: without this exclusion 74 of 74 ground lines
read BLOCKED** — the predicate would have carried no information at all. Registered here as a
pre-battery instrument correction, not discovered afterwards.

**OPEN** is not a chosen cut: it is the ground-pass chooser's **own** dividing line,
`lane < 0.4`, extracted with an anchored match and a line receipt from inside `groundCandidate`
in `src/ai/PlayerBrain.ts`. The full lane histogram is stored, so any other threshold re-derives
off disk.

**THE 1.5 m GUARD** — `laneOpenness`'s *"Ignore defenders standing right on top of the passer —
the kick clears them"*, which #340 item 2(c) named as now-false under the contact law — is
carried verbatim by `flightExposure` (`DV_CLEAR_RADIUS = 1.5`) and is **not** applied by the
shell predicate. Its size is published as `groundShellBlockedOnlyInsideGuardShare`: the share of
ground passes whose ONLY shell-blocking body sits inside that guard.

**THE MOMENT OF CHOICE** is the ARM-TIME seat — `pendingPassWindup`, the engine's own record of
the committed aim — wherever the shipped wind-up formed one. The one-touch bypass releases
synchronously (`PlayerBrain`'s own gate) and has no seat, so its read is taken at the RELEASE
tick, a tick or two after the decision. ⚠ The split is published per arm and **the joint table is
republished on the wind-up-only subset**, so the headline can be read on the pure-choice
population.

### §P.5 (c) THE CONFOUND, HANDLED BEFORE IT IS MEASURED

⚠ #341 item 3(c) is binding: *"speed covaries with pass distance under the shipped law — publish
speed-within-distance-bins (or an equivalent honest decomposition frozen at §P), never the raw
marginal alone."* Frozen handling:

1. the joint table `[distance bin][speed bin]` of launches and of caroms is **stored per seed**
   (distance 5 m × 9 bins; speed 2 m/s × 16 bins), so any stratification re-derives from disk;
2. the **published decomposition** splits, WITHIN each distance bin, at that bin's own median
   speed bin (computed from the pooled table and stored as `speedSplitByDistBin`), then pools the
   upper and the lower halves ACROSS strata: `caromRateSpeedUpperHalfWithinDistance` vs
   `caromRateSpeedLowerHalfWithinDistance`. **That pair is the answer to 和速度有关系吗**;
3. the **raw marginal pair** (`…Raw`, split at the pooled marginal median speed bin, distance
   ignored) is published ONLY so the confound's size is visible. It is labelled ⚠ NOT the answer;
4. the split indices are frozen from the pooled table and then treated as constants by the
   per-seed face functions, so the bootstrap is **conditional on the split**. Stated, not hidden.

⭐ **NO SPEED IS MANIPULATED.** `pwWeightChooser` is dormant in every entry world (#340 item
2(b)), so this face reads the natural variation the shipped power law already plays — and it
therefore answers *is there a relation*, never *what would a different speed do*.

### §P.6 SEEDS, SIZING AND STATS

* **BLOCK 12,523,000–999**, opened by #341 item 4 and **consumed WHOLE of record**. Battery =
  **120 seeds, 12,523,000–119**, each walked by **both arms** (240 walks). World-construction
  receipt = **12,523,999**, one per arm (2 walks). **BOOKED = WALKED**:
  `gSeedsBookedEqualWalked` requires 242.
* **THE SIZING SMOKE WALKED THE OUT-OF-BAND SCRATCH RANGE, 900,000,000–002** — canon, VERBATIM:
  *"verifier scratch walks use the stage's own consumed band or the out-of-band scratch range
  (≥ 900,000,000) — never the next virgin block"* (home: PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER
  CORRECTIONS item 6). **No battery seed was walked before this freeze.**
* **SIZING**: the 3-seed scratch smoke put the headline face
  `caromedGroundOpenLaneButShellBlockedShare` at a bootstrap half-width ≈ **0.094** on 3 clusters.
  A cluster bootstrap's half-width falls like `1/√n`, so half-width ≤ 0.02 needs
  `n ≳ 3·(0.094/0.02)² ≈ 66`; **120** is taken because a walk costs ≈ 0.9 s per seed per arm and
  the block is consumed whole either way.
* **STATS CONSUMED: ZERO.** The intervals are **bootstrap resamples of the walked seeds**, not a
  registry-consuming statistic (the IN-T0 / DF-T2 / IN-T1 / BK-C1 precedent, #329 item 4). The
  next stats base therefore remains ≥ **117,600**. The resample rng is seeded from the block's own
  base; the cluster is the seed and both arms ride the same resampled seed.

### §P.7 (d) THE ATTRIBUTION RULES, AND WHAT THEY ARE NOT

* an `interceptions` increment (the engine's own counter, both teams) is **CAROM-PRECEDED** iff a
  bodyStrike was applied on the ball at some tick after the most recent release and at or before
  the increment;
* a possession change (the engine's own `possessionSide` flip) is **CAROM-LAST-CONTACT** iff the
  last ball contact before the flip was a bodyStrike; the wider *"a strike happened since the last
  release"* form is published beside it.

⚠ **THESE ARE TEMPORAL RULES, NOT CAUSAL ONES.** "A carom happened before this interception" is
not "this interception happened because of the carom". Stated before the numbers exist.

⭐ **THE R-乙 QUOTATION.** #341 item 3(d) says the epoch-3 explosion 1.95 → ~19–21 is quoted
*only from R-乙's ledger fields*. The probe therefore **reads Q27's four ledger rows out of R-乙's
own artifact** (`docs/world-model/data/r-yi-gap-table-post-entries-w10w11.json`, bytes hashed
before parsing — canon: *"a dose-source guard should hash the bytes it reads, not a self-declared
field"*, home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6) rather than re-typing them
from prose. ⚠ Those rows are **R-乙's seeds and clusters, not this census's**; no magnitude
comparison between the two instruments is made or implied.

### §P.8 THE GATES (frozen; a red gate is REPORTED, never patched)

`gWorld` · `gArmsIsolated` · `gSharedSeeds` · `gAnchoredConstants` · `gStrikeLedgerAgrees` ·
`gStrikeAttributionComplete` · `gJointPartition` · `gStratificationNonVacuous` · `gRyiQ27Quoted` ·
`gNonVacuous` · `gSrcUntouched` · `gSeedsBookedEqualWalked` · `gStatsZero` · `gFaces`.

`gFaces` is the re-derivation gate — CANON, VERBATIM: *"the re-derivation gate covers EVERY
published face; a percentile face requires stored bins"* (home: PC-C0-REACTION-BASELINE.md
§COMMANDER CORRECTIONS item 4). Every face, every median and every published bin table — including
the frozen speed splits and the R-乙 quotation — is re-derived from the **SERIALIZED artifact off
disk**. Per-seed cells are stored so every headline re-derives (canon, home #282.2(ii)).

`gAnchoredConstants` pins the OCCURRENCE COUNT per needle and enumerates every occurrence's site
(canon: needle-occurrence counts, home: PC-C0 §CORR item 1) for all four extracted definitions:
the strike shell, the chooser's open-lane line, `KICK_COOLDOWN`, and `laneOpenness`'s 1.5 m guard.

### §P.9 HONEST LIMITS, STATED BEFORE THE BATTERY

* ⚠ **THE COUNTERFACTUAL IS AN OBSERVER READ, NOT A MECHANISM.** Nothing is armed. The numbers
  say what a shell-aware price WOULD have seen — not what a world with one would do. That is the
  fix slice's question, and this census only picks its design facts.
* ⚠ **`cooling` UNDERSTATES AND `all` OVERSTATES.** Cooldown state at the moment of choice is not
  cooldown state when the ball arrives. Both bounds are published; neither is the truth.
* ⚠ **NO BETWEEN-ARM EFFECT SIZE** (§2).
* ⚠ **THE ONE-TOUCH BYPASS HAS NO WIND-UP SEAT** (§P.4).
* ⚠ **LOFTED DELIVERIES ARE CENSUSED FOR (a) ONLY.** #340's finding is about the GROUND chooser,
  and the four lofted choosers already pay a corridor price in the w11 arm.
* ⚠ **CLOCK.** 1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every per-match
  COUNT face carries the clock in its unit string; every SHARE face is clock-invariant.

---

# RESULTS

> Freeze `ddf40b8` → this commit. **14/14 gates GREEN.** **242 walks** (120 battery seeds × 2
> arms + 2 world-construction receipts), **28.1 s wall**. `gFaces` re-derived **48/48** published
> faces and **55/55** bin checks off the serialized artifact, 0 failures.
> `hashedBodySha256 = bb5210dba9a2bf6863cf4421414384fb5e15e63c29a09dfa54c6591fe81e4bf9`.
>
> ⭐ **EVERY NUMBER BELOW IS A QUOTED ARTIFACT FIELD AT SOURCE PRECISION** (canon: doc-prose
> fidelity — *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
> face"*, home: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4). **No number in this
> section is computed here** — where two faces are compared, both are quoted with their intervals
> and the comparison is stated in words. Face keys are `<arm>.<face>`.

## §R0 THE INSTRUMENT'S OWN HONESTY, FIRST

`strikeAttributionCompleteness` = **1** in BOTH arms (`w9` 2664/2664, `w11` 2767/2767): every
applied strike the engine ledgered was named to a body. `gStrikeLedgerAgrees` held match by
match. ⚠ **These are instrument receipts, never football findings** (canon: receipts ≠ effect
sizes).

## §R1 (a) WHO CAROMS

### (i) THE BODY CLASS — it is the cooldown half, almost entirely

`strikeShareCooldownClass` = **0.97222222** [0.96251768, 0.98206278] (`w9`, 2590/2664) ·
**0.97759306** [0.96896291, 0.98496241] (`w11`, 2705/2767). The `stunTimer` half of the shipped
filter contributes the remainder (`byClassCooldownStunned` = [2590, **74**] / [2705, **62**]).

⭐ The stored `classBySide` table adds one fact the shares cannot: the stunned column is
**[0, 13]** (`w9`) and **[0, 25]** (`w11`) — a stunned body is struck by an OPPONENT's pass or by
nobody's, **never once by his own team's**, while the cooldown row is **[716, 1020]** /
**[860, 1110]**.

### (ii) THE SIDE — two of every five caroms hit the passer's OWN teammate

`strikeShareTeammateOfKicker` = **0.40937679** [0.38353765, 0.43650357] (`w9`, 716/1749) ·
**0.43107769** [0.39156035, 0.46922698] (`w11`, 860/1995). The contact law is side-blind by
construction (BK-T1) and this is the size of that blindness in play: the ball rebounds off the
kicker's own side about as often as off the opposition.

`strikeShareOnGroundFlight` = **0.95769011** [0.9408867, 0.97244546] (`w9`, 1675/1749) ·
**0.95739348** [0.9262607, 0.97915608] (`w11`, 1910/1995) — the ground chooser, the one that
prices no corridor at all, is where essentially all of it lands.

### (iii) THE LINE DISTANCE — they were already standing on the line when the ball left

`perpDistanceFromLineAtKick` (0.5 m bins, the striking body's position AT KICK TIME):
`w9` **[686, 338, 181, 103, 78, 82, 46, 51, 18, 23, 15, 12, 116]**, total 1749,
`medianFromBinsLowerEdge` = **0.5** m; `w11` **[799, 427, 192, 137, 87, 61, 43, 28, 26, 54, 15,
17, 109]**, total 1995, median bin lower edge **0.5** m.

⭐⭐ **THIS IS THE CENSUS'S SHARPEST SINGLE FACT.** The body that ends up caroming the ball was,
at the instant the pass was struck, in the first or second half-metre of the passing line in the
large majority of cases. He is not a body that ran in — he is a body the chooser was looking
straight through.

### (iv) THE CONTEXT — the quick-exchange story, measured, and CORRECTED

`strikeShareWithinCooldownOfOwnKick` = **0.0487988** [0.03850426, 0.06153251] (`w9`, 130/2664) ·
**0.03108059** [0.02323009, 0.03967371] (`w11`, 86/2767).
`strikeSharePreviousPasser` = **0.06944444** [0.0564275, 0.0833012] (`w9`, 185/2664) ·
**0.0639682** [0.05062849, 0.07901803] (`w11`, 177/2767).

⭐⭐ **THE STORY AS TOLD IS THE SMALL CASE; THE STORY'S HONEST FORM IS THE BIG ONE.**
`strikeShareWithinCooldownOfOwnTouch` = **0.36111111** [0.31227217, 0.41026616] (`w9`, 962/2664)
· **0.38489339** [0.3437268, 0.42450843] (`w11`, 1065/2767), and the touch-age histogram's first
bin (< N/3 ticks) alone holds **814** of 2664 (`w9`) / **875** of 2767 (`w11`). The pre-registered
second axis (§P.3) is what saves the finding from being wrong: 「刚出完球的人」 is a small
minority, but 「**刚碰过球的人**」 — a control contact, a whiff, a dribble touch, any of which
books `kickCooldown` — is more than a third of every carom on the pitch.

## §R2 (b) THE STALE MAP, SIZED

### (i) THE JOINT DISTRIBUTION #341 ASKED FOR

`jointLaneOpenByShellBlocked`, rows `[laneOpen, laneContested]` × cols `[shellBlocked,
shellClear]`, over every measured ground pass:

| arm | measured | open·blocked | open·clear | contested·blocked | contested·clear |
|---|---|---|---|---|---|
| `w9` | 8321 | **1073** | 4602 | 1308 | 1338 |
| `w11` | 8573 | **1063** | 4651 | 1262 | 1597 |

`groundOpenLaneButShellBlockedShare` = **0.12895085** [0.12082503, 0.13739045] (`w9`) ·
**0.12399393** [0.11676368, 0.13207996] (`w11`).

Restricted to the passes that ACTUALLY caromed (`caromJointLaneOpenByShellBlocked` =
**[[314, 408], [384, 247]]** `w9`, **[[304, 399], [380, 314]]** `w11`):

* ⭐⭐ `caromedGroundOpenLaneButShellBlockedShare` = **0.23207687** [0.2066474, 0.25782957]
  (`w9`, 314/1353) · **0.21760916** [0.19526202, 0.24109589] (`w11`, 304/1397).
* `caromedGroundOnOpenLaneShare` = **0.53362897** [0.50330639, 0.56437934] (`w9`, 722/1353) ·
  **0.50322119** [0.47622378, 0.53133903] (`w11`, 703/1397).

**In one sentence: over half of all ground-pass caroms are played on lines the chooser's own gate
called OPEN, and of every carom, better than one in five is on a line the old map called open
while a body's physical shell was sitting on it.**

### (ii) DOES THE SHELL READ CARRY INFORMATION THE OLD MAP DOES NOT — the discriminating pair

Both faces are restricted to lines the OLD map called open, so the old map is held fixed:

| arm | `caromRateOnOpenLaneShellBlocked` | `caromRateOnOpenLaneShellClear` |
|---|---|---|
| `w9` | **0.29263747** [0.26011029, 0.32589719] (314/1073) | **0.08865711** [0.08047465, 0.09768141] (408/4602) |
| `w11` | **0.28598307** [0.25641026, 0.31609195] (304/1063) | **0.085788** [0.07844401, 0.09344742] (399/4651) |

⭐⭐ **THE INTERVALS DO NOT OVERLAP IN EITHER ARM, AND THE ORDERING IS THE SAME IN BOTH.** Among
lines the shipped chooser rates OPEN, a contact-shell read separates a high-carom population from
a low-carom one. ⚠ **That is a measured discrimination, not a mechanism**: nothing here says a
priced world would play differently (§P.9), only that the information exists in the state the
chooser already has.

### (iii) THE FALSE 1.5 m CLEARANCE, SIZED

`groundShellBlockedOnlyInsideGuardShare` = **0.07198654** [0.06551724, 0.07828405] (`w9`,
599/8321) · **0.07406975** [0.06751203, 0.08106814] (`w11`, 635/8573). About one ground pass in
fourteen is blocked ONLY by a body standing inside the guard that says *"the kick clears them"* —
the assumption #340 item 2(c) named as now-false. It is a real slice, and it is **not** the main
one: the other five sixths of the blocked lines are blocked by bodies the guard never excused.

### (iv) THE CHOOSER-HONEST LOWER BOUND, AND WHY IT IS NOT THE ANSWER

`groundShellBlockedCoolingShare` = **0.06525658** [0.05895638, 0.07173913] (`w9`) ·
**0.06963723** [0.06326788, 0.07627728] (`w11`), and `shellHazardCoolingBodies` puts **8147** of
8321 (`w9`) / **8408** of 8573 (`w11`) ground passes in the zero bin. ⭐ The declared
understatement (§P.4) is enormous **and it is the finding, not a defect**: the bodies that carom
the ball are mostly **not yet cooling when the pass is chosen** — they enter the contact law's
gate while the ball is travelling. A price that only looked at who is cooling *right now* would
see almost nothing. The `all` bound (`shellHazardAllBodies` median bin lower edge **0.9** in both
arms) is the one with signal.

### (v) THE PURE-CHOICE SUBSET

`fromWindupSeat` / `fromReleaseTick` = **4734 / 3587** (`w9`) and **4553 / 4020** (`w11`), and the
joint tables are republished on the wind-up-only subset: `jointWindupOnly` =
**[[465, 2976], [660, 633]]** (`w9`) / **[[397, 2853], [585, 718]]** (`w11`), with
`caromJointWindupOnly` = **[[91, 266], [200, 119]]** / **[[76, 238], [194, 141]]**. The shape of
§R2(i) survives on the population where the read was taken at the engine's own committed-aim
seat.

## §R3 (c) THE SPEED QUESTION — 和传球速度有关系吗

### THE ANSWER OF RECORD (within distance strata, §P.5)

| arm | `caromRateSpeedUpperHalfWithinDistance` | `caromRateSpeedLowerHalfWithinDistance` |
|---|---|---|
| `w9` | **0.21152907** [0.19323198, 0.2296369] (433/2047) | **0.14663691** [0.13623235, 0.15777489] (920/6274) |
| `w11` | **0.22157895** [0.20197044, 0.24224908] (421/1900) | **0.14626105** [0.13755981, 0.15499701] (976/6673) |

⭐ **YES — AND THE INTERVALS DO NOT OVERLAP, IN EITHER ARM.** Holding pass distance fixed inside
its own 5 m stratum, the faster half of the passes caroms more often than the slower half. The
user's instinct has a number.

### AND THE CONFOUND IS REAL — the raw marginal exaggerates it

| arm | `caromRateSpeedUpperHalfRaw` | `caromRateSpeedLowerHalfRaw` |
|---|---|---|
| `w9` | **0.21346887** [0.19984076, 0.22767075] | **0.11696306** [0.10644643, 0.12779097] |
| `w11` | **0.21564885** [0.203517, 0.22844424] | **0.11253139** [0.10217984, 0.1234538] |

⚠ **NOT THE ANSWER** (§P.5 item 3) — published so the confound's size is visible. In both arms
the raw lower half sits BELOW the stratified lower half while the upper halves are close, i.e.
part of the raw gap is pass distance wearing speed's clothes. Distance carries its own signal:
`caromRateByDistanceBin` (5 m bins) = **[0.115942, 0.102479, 0.15952, 0.180736, 0.19697,
0.235849, 0.208333, 0.071429, 0.181818]** (`w9`) · **[0.133333, 0.082034, 0.160512, 0.203371,
0.192308, 0.213174, 0.150602, 0.111111, 0.259259]** (`w11`), on
`launchesByDistanceBin` = **[69, 1815, 2752, 1848, 1056, 636, 120, 14, 11]** (`w9`) ·
**[60, 1731, 2735, 1839, 1144, 835, 166, 36, 27]** (`w11`) — the top two bins are thin and their
rates are read accordingly.

⚠ **AND THE HONEST BOUNDARY OF THIS FACE**: no speed was manipulated. `pwWeightChooser` is
dormant in every entry world (#340 item 2(b)), so this answers *is there a relation in what the
world already plays*, never *what a different speed would do*.

## §R4 (d) IMPACT — how much of the game it eats

| face | `w9` | `w11` |
|---|---|---|
| `interceptionCaromPrecededShare` | **0.33660234** [0.31975819, 0.35386058] (1064/3161) | **0.35748637** [0.34250252, 0.3728] (1115/3119) |
| `possessionFlipCaromLastContactShare` | **0.10532151** [0.09611231, 0.11492936] (570/5412) | **0.10279871** [0.09404956, 0.11189199] (573/5574) |
| `possessionFlipStrikeSinceReleaseShare` | **0.30672579** [0.29287162, 0.32276711] (1660/5412) | **0.30229638** [0.28864495, 0.31522529] (1685/5574) |
| `interceptionsPerTackle` (ours, these seeds) | **21.2147651** [18.13714286, 25.16935484] (3161/149) | **19.01829268** [16.20855615, 22.83687943] (3119/164) |
| `strikesPerMatch` | **22.2** [20.43333333, 24.125] | **23.05833333** [21.14166667, 25.06666667] |

⭐⭐ **A THIRD OF EVERY EVENT THE ENGINE SCORES AS AN "INTERCEPTION" HAS A BODY CAROM ON THE BALL
BEFORE IT.** ⚠ Temporal, not causal (§P.7) — but it is the decomposition #341 item 3(d) asked
for, and it says the epoch-3 「拦截」 explosion is substantially made of this.

**THE R-乙 QUOTATION** (read out of `r-yi-gap-table-post-entries-w10w11.json`,
`sha256 = c6b1d232f04bfbba41a2c16309c213d435baa7a712893876cf5d2870d0910387`, 4 rows), Q27
`interceptionsPerTackle`, its OWN ledger fields:

| R-乙 arm | point | ci95 | num/den | clusters |
|---|---|---|---|---|
| bare | **1.950784** | [1.867153, 2.037856] | 9830/5039 | 425 |
| w9 | **20.899628** | [19.062606, 23.142857] | 11244/538 | 425 |
| w10 | **19.522046** | [17.895425, 21.477495] | 11069/567 | 425 |
| w11 | **18.682196** | [17.112308, 20.531993] | 11228/601 | 425 |

⚠ **R-乙's SEEDS AND CLUSTERS, NOT THIS CENSUS'S.** The rows are quoted because #341 item 3(d)
named them; no magnitude comparison between the two instruments is made or implied. What THIS
census adds is the decomposition of that axis's numerator, above.

## §R5 WHAT THE CENSUS PICKS FOR THE TARGET-CHOICE CORRIDOR SLICE

Stated as DESIGN FACTS, not as a design (the slice contract is planning grade, #341 item 3):

1. **THE GROUND CHOOSER IS THE SEAT** — `strikeShareOnGroundFlight` ≈ 0.957 in both arms.
2. **THE PRICE MUST SEE BOTH SIDES** — `strikeShareTeammateOfKicker` 0.40937679 / 0.43107769. An
   opponents-only corridor read cannot see two of every five caroms.
3. **IT MUST NOT BE A COOLING-BODIES-ONLY READ** — §R2(iv): the cooling-at-choice read puts **8147** of
   8321 (`w9`) / **8408** of 8573 (`w11`) passes in its zero bin, while the all-bodies read
   discriminates (§R2(ii)).
4. **THE 1.5 m GUARD IS A REAL BUT MINOR SLICE** — §R2(iii): removing it alone addresses about
   one blocked line in fourteen, not the phenomenon.
5. **THE INFORMATION IS ALREADY IN THE STATE THE CHOOSER HOLDS** — §R1(iii): the caroming body
   was on the line at kick time.
6. ⛔ **NOTHING HERE PRICES ANYTHING.** No mechanism was armed and no A/B was run; whether a
   priced ground corridor improves the game is the slice's question and the user's eyes.

---

## §人话 — 弹身体这件事,到底是怎么回事

> 这一节只报数,不下判断。**尺子是解说员,不是裁判** —— 像不像足球,以你的眼睛为准。
> 两个世界:**9 号**(身体诚实)和 **11 号**(你上次看的那一版)。120 场 × 2 个世界,同一批种子。
>
> ⚠ **先说钟**(#339 立的双钟法条):我们一场球显示钟走满 90 分钟,按 sim 秒直读只有 240 秒
> (1 sim 秒 = 22.5 显示秒)。下面唯一一个「每场几次」的数 —— 每场 **22.2**(9 号)/
> **23.058333**(11 号)次弹身体 —— 按**我们这一场**读,也就是显示钟的一场 90 分钟。其余的数
> 全是**占比**,换钟不变。

### 一、弹身体的都是谁

**是刚碰过球的人,不是刚出完球的人。** 弹回来的球,九成七以上撞在「脚下有冷却」的身体上
(0.97222222 / 0.97759306);但是「刚把球传出去那个人」只占 0.0487988 / 0.03108059 ——
故事里最上口的那一版,其实是小头。真正的大头是「**刚碰过球的人**」:0.36111111 /
0.38489339。碰一下、拨一下、没停好,都会给身体挂上同一个冷却。

**四成撞的是自己人。** 0.40937679 / 0.43107769 —— 这条法则本来就不分敌我(它是这么设计的),
这就是不分敌我在场上的分量。**而且几乎全发生在地面传球上**(0.957 上下)。

**最要紧的一条:他早就站在线上了。** 按「球被踢出去那一瞬间,这个人离传球路线多远」来量,
中位数落在 **0.5 米**那一格里,第一格(半米以内)一个世界就装了 686 / 799 个。他不是跑过来
挡的,他是**传球的人从头到尾没看见的那个人**。

### 二、旧地图看没看见他们 —— 没有

传球的人用的是老的那张「路线通不通」的图。按**他自己代码里的那条线**(lane < 0.4 算拥挤)来
分:所有地面传球里,有 0.12895085 / 0.12399393 是「老图说通、身体实际上堵在线上」。

而在**真的弹了身体**的那些传球里:超过一半(0.53362897 / 0.50322119)是老图说「通」的;
其中 0.23207687 / 0.21760916 是老图说通、身体却明明堵着。

**同样是老图说「通」的线**,再加一眼身体:堵着的那批弹身体的比例是 0.29263747 / 0.28598307,
不堵的那批只有 0.08865711 / 0.085788 —— 两个世界里区间都不重叠,顺序也一样。
**意思是:该看的东西就在传球的人手上的信息里,他只是没看。**

⚠ 一句实话:这只说明**信息存在**,不说明加了价格球就会踢得更好。那是下一步的事,而且要你
的眼睛判。

### 三、和速度到底有没有关系 —— 有,但没有生看上去那么大

你问的那句「这个和传球速度有关系吗」。**有关系。** 把传球**距离**先按 5 米分好档、在**同一
档里面**比快慢:快的那一半弹身体 0.21152907 / 0.22157895,慢的那一半 0.14663691 /
0.14626105 —— 两个世界区间都不重叠。

但是**不能直接看生的对比**:球传得越远踢得越重,这两件事在我们的力量公式里本来就绑在一起。
生着比是 0.21346887 / 0.21564885 对 0.11696306 / 0.11253139 —— 差距明显更大,**多出来的那截
是距离在冒充速度**。距离自己也有份:按 5 米一档,从第二档到第六档,弹身体的比例从 0.102479 一路爬到
0.235849(9 号)。

⚠ 还有一句实话:这局比赛里**没人在选传球力度**(那个开关在所有上线世界里都是关的),所以这
个答案是「现有的快慢里确实看得出关系」,不是「把球传慢一点就会变好」。后者没量过。

### 四、它吃掉了多少比赛

**每三个「拦截」里就有一个,球是先弹了身体的**:0.33660234 / 0.35748637。你在数据面板上看到
的那一大堆拦截,有相当一部分根本不是有人读到了球,是球撞在人身上。

**球权易手**里,最后一下就是弹身体的占 0.10532151 / 0.10279871;把口径放宽到「这次传球出脚
之后弹过身体」,是 0.30672579 / 0.30229638。

每场 22.2 / 23.058333 次(我们这一场)。

> **一句话收尾**:弹身体不是法则坏了 —— 撞上的人多半是刚碰过球、而且**在你出脚时就已经站在
> 线上**的人;传球的人用的那张图看不见他。它现在吃掉了大约三分之一的「拦截」和十分之一的直接
> 丢球。这一页只把这件事量出来,**改不改、怎么改,是下一步和你的眼睛的事**。
