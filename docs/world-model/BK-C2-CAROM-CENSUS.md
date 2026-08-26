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

> *(§R and the §人话 page land in this stage's SECOND commit, with the artifact. Nothing below
> this line exists at the freeze commit.)*
