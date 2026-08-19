# R9 — THE POSSESSION-CHAIN LEDGER (instrument-only)

> **STATUS**: pre-registration FROZEN in COMMIT 1 (this file's §PRE-REGISTRATION), results
> appended in COMMIT 2 (§RESULT). Authorized by **ruling #314 item 3**. Probe:
> [`scripts/probes/r9-possession-chain-ledger.ts`](../../scripts/probes/r9-possession-chain-ledger.ts).
> Artifact: `docs/world-model/data/r9-possession-chain-ledger.json`.
>
> **THIS STAGE SCORES NOTHING.** There is no hypothesis, no verdict, no ship. It is a
> DIAGNOSTIC LEDGER that answers one question of record before the user plays.

---

# §PRE-REGISTRATION (frozen in COMMIT 1, BEFORE any battery walk)

## §0 CANON QUOTED FOR THIS STAGE (copied from [`CANON.md`](CANON.md), never re-typed)

- **freeze-before-battery** — freeze the instrument commit BEFORE the battery; the artifact
  records the instrument hash. *(home: ruling #266.3(c), paraphrase)*
- **VERBATIM**: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in
  the schema never enters the body; forbidden-name lists are retired". *(home: PC-T0 §CORR
  item 1)*
- **per-seed cells** — per-seed/per-cluster cells stored so every headline re-derives.
  *(home: ruling #282.2(ii), paraphrase)*
- **gFaces-from-disk** — the re-derivation gate parses the SERIALIZED artifact off disk
  *(home: ruling #287 item 1)* + **VERBATIM**: "the re-derivation gate covers EVERY published
  face; a percentile face requires stored bins" *(home: PC-C0 §CORR item 4)*.
- **VERBATIM**: "a field carries the unit its name claims". *(home: ruling #294 item 3)*
- **VERBATIM**: "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a
  gated face". *(home: PC-T2 §CORR item 4)*
- **VERBATIM**: "a starred finding states its |Δ|÷half-width ratio". *(home: BU-T0B §CORR
  item 2)*
- **moving denominators** disclosed per face; prefer the denominator-stable form. *(home:
  PW-C0 §CORR item 2, paraphrase)*
- **VERBATIM**: "a src-extracted constant pins its extraction to the NAMED call site —
  anchored match + line receipt — never first-occurrence". *(home: BK-C0 §CORR item 1)*
- **VERBATIM**: "a dose-source guard should hash the bytes it reads, not a self-declared
  field". *(home: BU-T1 §CORR item 6)*
- **VERBATIM**: "verifier scratch walks use the stage's own consumed band or the out-of-band
  scratch range (≥ 900,000,000) — never the next virgin block". *(home: PW-T0C §CORR item 6)*
- **seed discipline** — BOOKED = WALKED; blocks consumed whole; stats floors step ≥ 200 on the
  lattice from every published base. *(the standing frontier practice, paraphrase)*

## §1 THE QUESTION OF RECORD

BK-T2 §R3 measured, on 400 paired virgin seeds, the face
[`bounceBackWithin240PerGkRelease`]:

| field | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `bounceBackWithin240PerGkRelease` | 0.089479 | **0.131738** | +0.042259 [+0.023047, +0.060698] | **2.245** |
| `bounceBackAnyGapPerGkRelease` | 0.128699 | 0.173284 | +0.044585 [+0.024185, +0.064329] | 2.221 |

弹回门将 **rose 47 % relative** when the BK laws arm — the user's own third complaint moving the
wrong way — and BK-T2 could not say why. Its §DOUBTS 3 names the reason: *"the
save-and-regather / punt-came-home split needs a possession-chain instrument neither BK-C0 nor
this stage built."* BK-C0 §DOUBTS 4 is the same gap in the census's own words: *"`bounceBacks`
counts OWNERSHIP regained by the releasing keeper, so a save (the keeper parrying his
opponent's shot back to himself) and a punt that came home are the same cell."*

**THIS STAGE BUILDS THAT INSTRUMENT.** The answer goes in front of the user at the BK
play-test gate (ruling #310 / #311 item 1 — the gate is OPEN and nothing here advances past it).

## §2 THE TWO ARMS (frozen — BK-T2's construction, reused EXACTLY)

- **BASE** = the world-8 composition: `a4MatchFlags(8)` + `armA4World(m, null, 8, L3 dose, PC
  dose)`, both dose FILES hashed **AS BYTES** before they are parsed (canon dose-source guard).
- **ARMED** = BASE + `bkFacingLaw: true` + `bkContactLaw: true` (= world 9).
- **PAIRED**: every seed is walked TWICE, once per arm; one bootstrap resample-index matrix
  draws both arms, so the pairing is inside every interval.
- **WORLD RECEIPT**: its own booked seed (`12,506,999`) plus a per-walk conjunct set asserted on
  every walked match (`world.everyWalkedMatchConformed`).

⭐ **ONE DECLARED IMPROVEMENT ON BK-T2's RECEIPT, DISCLOSED BEFORE THE BATTERY.** BK-T2's
conjunct read `a4ArmedVersion(m) === 8` on **both** arms and was green when it ran. Ruling #309
item 5 has since given the BK composition its own version value (`bkArmedVersion` ⇒
`BK_WORLD_VERSION = 9`, `src/game/a4World.ts:909–913` and `:858`), so an armed match now NAMES
ITSELF 9 — exactly the dispatch's framing ("base = world-8, armed = world-9"). The conjunct here
is `armedVersionNamesTheArm` and asserts the version **per arm**. Measured before freezing:
BK-T2's old form is RED by construction on the armed arm today.

## §3 THE INSTRUMENT (design frozen before the battery)

### (a) THE EVENT — how the keeper RELEASES the ball

Channels are **BK-C0 §2(c) VERBATIM**, read off the engine's own stat signatures at the tick
boundary with the keeper's `gkDistributing` taken from the **PRE-STEP** snapshot:

`punt` (= `LoftedPass` while `gkDistributing`) · `throwOut` (a shortPass signature whose actor
is in the `ThrowOut` action) · `gkShortPass` (shortPass/throughBall) · `gkClearance` · `gkOther`.

**SCOPE: OPEN PLAY ONLY** (`phase === 'playing'` at the release tick) — BK-T2's own scope, kept
deliberately so the decomposed face IS the face of record. Restart-origin keeper takes (goal
kicks) are therefore **not** releases here; they appear as `restartAward` RETURNS and as
`acqRestartAward` ACQUISITIONS.

⭐ **BK-T2's OWN GUARD IS REPRODUCED**: a release signature whose ball is not moving at the tick
boundary (|v| < 1e-6) is booked `unattributedGkReleases` and censused nowhere. That is how the
face of record's denominator was built; dropping the guard would inflate `gkReleases` with
dead-ball artefacts and silently deflate every per-release rate. The counter is PUBLISHED.

### (b) THE "carry?" CELL the dispatch asked about

Every tick the keeper STOPS owning the ball is booked (`gkOwnershipEnds`), split by whether a
release signature fired on that tick. `gkOwnershipEndsWithoutRelease` is the honest cell for
"he lost it without distributing" (tackled / smothered / spilled / dead ball) — the release
menu's missing denominator. It is a REPORTED face, not a release class.

### (c) THE CHAIN

From each release, ownership and touch events are followed until the RELEASING KEEPER OWNS THE
BALL AGAIN — **BK-T2's own resolution rule, expression-for-expression** (`ownerGid === gid &&
ownerGid !== prevOwnerGid`, first resolution per chain) — or the chain retires.

⭐⭐ **THE RETIRE CAP = 720 TICKS = 3 × THE WINDOW OF RECORD, and it is chosen to inherit
BK-T2's uncensored lesson rather than repeat it.** BK-C0 retired AT the window (240) and made
histogram bins 25–40 structurally zero (§CORR 2). BK-T2 moved to 420 and found **28.8 % (base) /
23.2 % (armed)** of closures at gaps ≥ 250 ticks with the median in the **90/100-tick** bins —
which is evidence that 420 was itself a guess. 720 ticks = 12 sim-s is far beyond any lofted
round trip (the punt's own is 252 ticks). The FULL histogram is stored: **73 bins × 10 ticks**,
index *i* covering ticks [*i*·10, (*i*+1)·10), the final bin (72) holding exactly age = 720.
Prose quotes LOWER edges (BK-C0 §CORR item 4 asked for the convention to be stated; it is stated
once, here, and used everywhere). The cap is published as **the ONE remaining censoring edge**.

⚠ **NO EARLY TERMINATION ON OPPONENT POSSESSION — DECLARED DEVIATION, WITH ITS REASON.** The
dispatch offered "opponent goal-side possession established" as a chain terminator. Terminating
there would make the class `oppControlledThenLost` unmeasurable and — worse — would stop the
instrument from partitioning THE FACE OF RECORD, since BK-T2's chain did not terminate on
opponent possession either. Opponent possession is therefore recorded as an **ANNOTATION**
(`returnOppOwnedByClass`, and `returnOppInBoxByClass` using the engine's own
`match.inPenaltyBox(ball.pos, keeperSide)` — no invented threshold), published per class.

### (d) THE RETURN-PATH CLASSES — pre-registered, exact, ORDERED

Decided at the return tick by the FIRST arm that matches:

| # | class | exact definition |
|---|---|---|
| 1 | `saveHeld` | the keeper's own `saves` counter incremented **ON** the return tick — the engine's held-save path (`tryKeeperSave`'s catch, `tryAerial`'s high claim, `trySmother`: each does `stats.saves++` then `giveBall(gk)` in the same tick). A shot came in and he caught it. NOT a distribution coming home. |
| 2 | `restartAward` | `match.restartKickGid === gid` at the return tick. The ball had LEFT PLAY and the keeper was AWARDED it (goal kick). The loop did not close; the referee closed it. |
| 3 | `parryRegather` | the keeper took a save credit EARLIER in this chain **without** gaining ownership (the parry branch: `stats.saves++`, ball deflected, `lastTouch = gk`, no `giveBall`) and he now owns it. ⭐ **the class BK-C0 §DOUBTS 4 said was missing** — kept apart from every distribution class BY LADDER POSITION, before possession history is consulted at all. |
| 4 | `oppControlledThenLost` | an OPPONENT established ownership during the chain and gave it back, no save involved. |
| 5 | `ownDefenderBackPass` | a TEAMMATE established ownership during the chain (and no opponent did) and the ball came back. |
| 6 | `directCarom` | nobody else ever OWNED it, but another body TOUCHED it: a `lastTouch` change to a player who is neither the keeper nor the new owner, **or** a tick on which `bkContactLedger.strikesApplied` increased (a BK bodyStrike). |
| 7 | `noOtherTouch` | nobody else owned it and nobody else touched it — it simply came back and he re-collected. |
| 8 | `otherReturn` | STRUCTURALLY UNREACHABLE (arm 7 is total). An overflow assertion cell, gated to 0. |

**TWO FAMILIES, named once**: `saveFamily` = {1, 3} (NOT a distribution coming home) ·
`distributionFamily` = {4, 5, 6, 7} (a ball he gave away that came home). `restartAward` is in
NEITHER family on purpose — it is the referee's ball, and it is published on its own row.

⚠ **THE LADDER IS AN ORDERING, NOT AN EXCLUSIVE DIAGNOSIS** (BK-C0 §DOUBTS 2's phrasing,
reused): a `parryRegather` chain very often ALSO saw opponent possession. The share is "the
first thing that explains this return" — the right quantity for answering WHY the face moved,
the wrong one for counting counterfactual possessions. Hence the cross-tab on every row.

### (e) THE SAVE / PARRY LEDGER (kept apart from distributions)

A **parry** = a `saves` increment on a tick at which that player does NOT own the ball. Every
parry is followed to a fate: `parryRegatheredByKeeper` · `parryToOpponent` · `parryToTeammate` ·
`parryWentDead` · `parryUnresolved`, with the regather-gap histogram stored. Save credits are
read as per-player per-tick DELTAS of `match.stat(gid).saves` and are **gated against the
engine's FINAL counters** (`gSaveLedgerAgrees`) — an independent-ledger check, not a
tautological self-check.

### (f) THE ACQUISITION LEDGER

Every keeper ownership gain, however it arose (not conditioned on his own release): `acqSaveHeld`
→ `acqRestartAward` → `acqParryRegather` → `acqFromTeammate` → `acqFromOpponent` →
`acqSelfRecollect` (the last owner was HIMSELF) → `acqOther` (nobody had owned it). First arm
wins; the partition is gated.

### (g) THE CONSTANTS, ANCHORED

- **the window of record = 240 ticks**, read off the COMMITTED BK-C0 artifact's own
  `definitions.bounceBackWindowTicks` (bytes hashed first), never re-derived by regex. It is
  kept because the face under decomposition is BK-T2's; a different window would decompose a
  different number.
- **the keeper's OWN loft cap** — BK-C0 §CORR item 1 named it *"the arguably-correct source for
  any future re-derivation"* (1.5 s, mechanics.ts:655). It is EXTRACTED anchored to the **NAMED
  `performKeeperThrow` site** (7th positional argument of `loftKick`, scoped to that function's
  body before `loftKick(` is matched at all) and PUBLISHED with its line receipt as
  `keeperLoftRoundTripTicks` — **not** used as the window of record, for the reason above. The
  punt's own cap (`performLoftedPass`, 2.1 s) is extracted the same way and published beside it.
  Every window ≤ the retire cap re-derives off the stored bins.

## §4 THE FACES (all REPORTED — nothing is scored)

- the face of record reproduced in definition: `bounceBackWithin240PerGkRelease` ·
  `bounceBackAnyGapPerGkRelease` · `gkReleasesPerMatch` · `unattributedGkReleasesPerMatch`.
- ⭐ **the decomposition**: `bounceBackWithin240_<class>_PerGkRelease` for all 8 classes, and
  the any-gap twin — **the SAME denominator on every row**, so the class rates SUM to the total
  and the denominator's own move cannot hide inside the partition. Additivity is GATED.
- the two families + `saveFamilyShareOfBounceBacksWithin240`.
- per RELEASE KIND: `bounceBackWithin240Per<Channel>Release` (⚠ moving denominators, disclosed
  per face) + `<channel>ReleasesPerMatch`.
- the save/parry ledger: `saveCreditsPerMatch` · `parryShareOfSaveCredits` ·
  `parryRegatherWithin240Share` · `parryToOpponentShare` · `parryWentDeadShare`.
- the acquisition ledger: `gkAcquisitionsPerMatch` · `<kind>ShareOfAcquisitions` ×7 ·
  `gkOwnershipEndsPerMatch` · `gkLostWithoutReleaseShare`.
- chain book-keeping: `chainReturnShareAnyGap` · `chainNoReturnShare`.
- stored bins (canon: a percentile face requires stored bins) — per class and per channel, both
  arms, with the medians re-derived from the bins ON DISK by the `gFaces` gate.

## §5 THE GATES (frozen — a red gate is REPORTED, never patched)

`gWorld` · `gDoseBytes` (four artifacts hashed as bytes: L3 dose, PC dose, BK-C0, BK-T2) ·
`gConstants` · `gPaired` · `gBaseDormant` (both BK ledgers exactly zero on every base walk) ·
`gArmedFires` · **`gChainPartition`** (chains opened = GK releases; returned + no-return =
opened; every count re-sums across channel × class and across the bins) ·
**`gNoUnclassifiedReturn`** (the total ladder's overflow cell stays empty) · `gAcqPartition` ·
**`gSaveLedgerAgrees`** (per-tick deltas = the engine's FINAL `stat(gid).saves` sum; held +
parry = total; no non-keeper ever holds a save credit) · `gParryPartition` ·
**`gUncensoredRange`** · `gNonVacuous` (every quantified gate has a non-empty domain) ·
`gStatsDisjoint` · `gSrcUntouched` · `gSeedsBookedEqualWalked` · **`gFaces`** (every published
face + every stored bin + every published median re-derived from the SERIALIZED artifact off
disk, plus the additivity of the decomposition).

## §6 THE FIDELITY CHECK — IS IT THE SAME FACE? (run BEFORE the freeze, out-of-band seeds)

The whole stage is worthless if it decomposes a lookalike. A scratch comparator ran **BK-T2's
own `openGk` block and this stage's chain block on the SAME 60 matches** (30 seeds × 2 arms) in
the out-of-band scratch range **900,000,000–900,000,029** (canon: never the next virgin block):

| quantity | BK-T2's block | R9's chain |
|---|---|---|
| GK releases detected | 619 | **619** |
| bounce-backs WITHIN 240 ticks | 54 | **54** |
| bounce-backs at ANY gap | 87 | **145** |

⭐ **The within-window face is IDENTICAL, event for event.** The any-gap column differs by
design and by exactly the amount the censoring lesson predicts: BK-T2 retired its record at 420
ticks (and only after it "landed"), so **58 of 145 late closures — 40 % — were invisible to it**.
That is the censoring defect measured one level deeper than BK-T2 could measure it, and it is
why this stage's cap is 720. The scratch walk wrote no artifact and consumed no virgin seed.

## §7 SEED LEDGER (BOOKED = WALKED)

- **BLOCK 12,506,000–999**, opened to this stage by ruling #311 item 3 / #314 item 3.
- battery: **12,506,000 – 12,506,399** = 400 paired seeds = **800 walks**.
- world-construction receipt: **12,506,999** = 1 walk.
- pre-freeze sizing smoke: `R9_MODE=smoke` walks **12,506,000–002** (the battery's own prefix,
  writing `/tmp` — no extra consumption).
- **12,506,400 – 12,506,998**: NOT WALKED, unconsumed inside the consumed block.
- `seeds.walksBooked` must equal 801 (`gSeedsBookedEqualWalked`).
- scratch: **900,000,000 – 900,000,029** (§6), out-of-band, no artifact.

## §8 STATS LEDGER

**base 114,000** (the floor ruling #311 item 3 opened to this stage), ONE draw, 2,000 resamples,
**step ≥ 200** from every published base (the lattice is listed in
`stats.publishedBasesCheckedAgainst`, and now includes BK-T2's 113,800). **Next base ≥ 114,200.**

## §9 THE SIZE, WITH ITS REASON (the rarest published cell governs)

The rarest cell is **the punt**. BK-T2's own fields: `gkReleasesPerMatch` = 10.645 / 9.5075 and
`gkPuntShare` = 0.065993 / 0.063897 ⇒ **0.703 (base) / 0.608 (armed) punts per match** — the
"~0.7/match" of the dispatch. A punt that comes home is rarer still: at BK-T2's own
`bounceBackWithin240PerGkRelease` (0.089479 / 0.131738) an indifferent per-release rate puts
≈ 0.063 / 0.080 punt returns per match ⇒ at **N = 400 paired seeds**, ≈ **25 (base) / 32
(armed)** events. That is enough for a per-channel SHARE with an honest CI and **not** enough to
split the punt cell further by return class — so the punt × class table is published as COUNTS,
never as a CI-bearing share, and the thinness is declared in §DOUBTS 1 BEFORE the walk. The
all-channel classes are the grain that carries the answer: ≈ 0.95 / 1.25 returns per match ⇒
≈ 380 / 500 events per arm. Wall: BK-T2 measured 0.19 s per walk WITH its corridor rung; this
instrument drops the corridor and every geometry sweep (the pre-freeze smoke measured 7 walks in
1.3 s), so 801 walks is far inside the 60 min ceiling. The battery publishes
`battery.wallSeconds`.

## §10 VISION / REALITY (the #201 standing rule)

- **VISION** ([`docs/VISION.md`](../VISION.md), via [`CANON.md`](CANON.md)): tactics EMERGE;
  instruments never nudge behaviour. This stage adds no gene, no price, no policy — it is a
  read. Its output is a SENTENCE for the user's gate, not a change to the world.
- **REALITY** (the mechanism oracle): the engine's keeper is not one thing. Five shipped sites
  hand him the ball (`tryKeeperSave`'s catch · `tryAerial`'s high claim · `trySmother` ·
  `tryCapture`'s loose take · the restart taker's `giveBall`) and one hands it to nobody (the
  parry). A single "bounce-back" counter over that mechanism map was always going to be a
  composite; the reality question is which limb moved when the contact law armed. That is
  exactly what §4's decomposition asks, and the answer is a fact about the engine, not about
  taste.

## §11 DECLARED DEVIATIONS AND DOUBTS (stated BEFORE the battery)

1. **THE PUNT CELL IS THIN BY CONSTRUCTION** (§9): ≈ 25 / 32 within-window punt returns at
   N = 400. Its class split is COUNTS ONLY. No conclusion may rest on a punt × class share.
2. **NO EARLY TERMINATION ON OPPONENT POSSESSION** (§3(c)) — declared, with its reason: the
   alternative would stop the instrument from partitioning the face of record.
3. **THE LADDER IS AN ORDERING** (§3(d)) — the cross-tab exists because the shares are not an
   exclusive diagnosis.
4. **`restartAward` IS A RETURN CLASS, NOT AN ERROR.** BK-T2's face counts a goal kick after
   the keeper's own ball went out as the loop closing, because the keeper does own the ball
   again. This stage does not re-cut the face; it NAMES that limb and publishes it.
5. **THE RETIRE CAP IS THE ONE REMAINING CENSORING EDGE.** Chains still open at 720 ticks (or
   at full time) are booked `chainsNoReturn` and are NOT returns. The face of record is a
   within-240 rate either way, so the headline is unaffected; the any-gap face is a
   within-720 rate and says so in its unit.
6. **SAVE CREDITS ARE THE ENGINE'S OWN COUNTER, NOT A RE-IMPLEMENTED SAVE MODEL.** The
   instrument never decides what a save is; it reads `stat(gid).saves` and gates its own
   arithmetic against the engine's final totals.
7. **NO FOOTBALL VERDICT IS CLAIMED ANYWHERE.** Whether 弹回门将 at the measured level looks
   right is the **BK play-test's USER GATE**, not this stage's.

---

# §RESULT — appended in COMMIT 2, after the battery

> **BATTERY**: 400 paired virgin seeds (12,506,000–399) + the world receipt = **801 walks**,
> `battery.matches = 800`, `battery.ticksTotal = 12133091`, `battery.wallSeconds = 116.5`
> (against a 60 min ceiling). **ALL 17 GATES GREEN** — including `gFaces` (350/350 face checks,
> 32/32 bin-and-median checks, additivity holds), `gSaveLedgerAgrees`, `gChainPartition`,
> `gBaseDormant`, `gSrcUntouched`. Artifact: `docs/world-model/data/r9-possession-chain-ledger.json`
> (`hashedBodySha256 = ee72cfafc903758632e2c00438e21de51f7e894a0a1e55af90162ca2e4939145`,
> instrument frozen at commit `46df6df`).

## §R0 THE FACE IS THE FACE, AND IT MOVED THE SAME WAY

| field | base | armed | Δ [95 % CI] | \|Δ\|÷hw | relative |
|---|---|---|---|---|---|
| `bounceBackWithin240PerGkRelease` | **0.094482** | **0.141365** | **+0.046883** [+0.027809, +0.066492] | **2.424** | **+0.496209** |
| `bounceBackAnyGapPerGkRelease` (≤ 720 ticks) | 0.221436 | 0.265328 | +0.043892 [+0.021781, +0.066131] | 1.979 | +0.198 |
| `gkReleasesPerMatch` | 10.24 | 9.3375 | −0.9025 [−1.2475, −0.5575] | 2.616 | −0.088 |
| `unattributedGkReleasesPerMatch` | 0.0 | 0.0 | — | — | — |

⭐ **INDEPENDENT REPLICATION OF THE QUESTION**: BK-T2's own fields were base **0.089479** →
armed **0.131738** (Δ +0.042259, |Δ|÷hw 2.2447738339038446). On a different 400-seed block, with
an instrument built from scratch, the same face sits at 0.094482 → 0.141365 (Δ +0.046883,
|Δ|÷hw 2.424). **弹回门将 rising ~+50 % when the BK laws arm is a real, replicated fact.** The
release count fell 10.7 % in BK-T2 and 8.8 % here — the denominator moves, and it moves the same
way, which is why every decomposition row below uses the SAME denominator.

## §R1 ⭐⭐ THE DECOMPOSITION — ONE CLASS CARRIES IT, AND IT IS A CAROM

Same denominator (`gkReleases`) on every row, so the rows **sum to the total row**:
`decomposition.additivityCheck.agreesToWithin1e9 = true`
(`sumOfClassDeltas = 0.046883039972` = `totalDelta = 0.046883039972`).

| return class | base | armed | events base/armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐⭐ **`directCarom`** | 0.029297 | **0.065060** | 120 / **243** | **+0.035763** [**+0.024297**, **+0.047785**] | **3.045** |
| `saveHeld` | 0.030518 | 0.038286 | 125 / 143 | +0.007769 [−0.003272, +0.019350] | 0.687 |
| `restartAward` | 0.004883 | 0.008032 | 20 / 30 | +0.003149 [−0.000368, +0.006699] | 0.891 |
| `ownDefenderBackPass` | 0.012451 | 0.013922 | 51 / 52 | +0.001471 [−0.003555, +0.006722] | 0.286 |
| `oppControlledThenLost` | 0.008545 | 0.009639 | 35 / 36 | +0.001094 [−0.003402, +0.005274] | 0.252 |
| `parryRegather` | 0.008545 | 0.006426 | 35 / 24 | −0.002119 [−0.006539, +0.002217] | 0.484 |
| `noOtherTouch` | 0.000244 | 0.000000 | 1 / 0 | −0.000244 [−0.000747, 0] | 0.653 |
| `otherReturn` (gated to 0) | 0 | 0 | 0 / 0 | 0 | — |

⭐⭐ **`decomposition.classesWhoseCiIsStrictlyAboveZero = ["directCarom"]`. EXACTLY ONE CLASS
CLEARS ZERO, and it is the ball coming back off a body with no intervening controlled touch.**
Its |Δ|÷half-width is **3.045** — the largest ratio in the stage — and its own relative move is
`relative = 1.220723`, i.e. **direct caroms back to the keeper MORE THAN DOUBLE**. Doc-side
arithmetic over the two published Δ fields: 0.035763 ÷ 0.046883 = **0.763**, so `directCarom`
alone accounts for roughly three quarters of the rise.

**THE TWO FAMILIES** (`decomposition` fields, quoted):

| field | value |
|---|---|
| `distributionFamilyShareOfTheRise` | **0.81232** |
| `saveFamilyShareOfTheRise` | **0.120506** |
| `restartAwardShareOfTheRise` | 0.067174 |

| family face | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `bounceBackWithin240_distributionFamily_PerGkRelease` | 0.050537 | 0.088621 | **+0.038084** [+0.025487, +0.051644] | **2.912** |
| `bounceBackWithin240_saveFamily_PerGkRelease` | 0.039063 | 0.044712 | +0.005650 [−0.007209, +0.018343] | 0.442 |

⭐⭐ **BK-C0 §DOUBTS 4 AND BK-T2 §DOUBTS 3 ARE ANSWERED, AND THE ANSWER IS "NOT THE SAVE".** The
save family (`saveHeld` + `parryRegather`) moves by +0.005650 with a **CI that spans zero** and
carries 12 % of the rise; the distribution family carries **81 %** with its CI strictly above
zero. The two questions the census could not separate are now separated, and they point opposite
ways: `saveFamilyShareOfBounceBacksWithin240` **FALLS** 0.413437 → 0.316288 (Δ −0.097149
[−0.170802, −0.025373], |Δ|÷hw 1.336) — armed, a smaller share of 弹回门将 is a save, because the
distribution half grew underneath it.

⭐ **THE ATTRIBUTION IS BY CONSTRUCTION, AND THAT IS WHAT A PAIRED A/B LICENSES.** The two arms
differ in exactly two flags. `gBaseDormant` is GREEN: every base walk has
`ledStrikesApplied = 0`, so **no base `directCarom` can be a bodyStrike — every one of the 120 is
an ordinary deflection.** The armed arm adds 123 (+103 %). The only mechanism the armed world
adds that produces an uncontrolled body touch is the contact law's own bodyStrike. BK-T2 §R3
guessed this in prose — *"a carom that used to fly through a body now comes back"* — and could
not measure it. **It is now measured.**

⭐ **AN INDEPENDENT LADDER CORROBORATES IT.** The acquisition ledger never looks at chains at
all, and it says the same thing: `acqSelfRecollectShareOfAcquisitions` (the keeper's last
previous owner was HIMSELF) rises 0.028464 → 0.062904, Δ +0.034441 [+0.023493, +0.045996],
**|Δ|÷hw 3.061**, on counts **121 → 243** — the same 243, from a different arithmetic.

## §R2 THE RELEASE KIND — the punt already came home half the time, and the SHORT PASS is where the rise lives

| face | base | armed | den base/armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|---|
| ⭐ `bounceBackWithin240PerPuntRelease` | **0.465455** | **0.507042** | 275 / 284 | +0.041588 [−0.052791, +0.138695] | 0.434 |
| ⭐ `bounceBackWithin240PerGkShortPassRelease` | 0.070950 | 0.116229 | 3580 / 3235 | **+0.045279** [+0.028851, +0.063217] | **2.635** |
| `bounceBackWithin240PerThrowOutRelease` | 0.017751 | 0.024096 | 169 / 166 | +0.006345 [−0.026905, +0.037034] | 0.198 |
| `bounceBackWithin240PerGkClearanceRelease` | 0.000000 | 0.080000 | 34 / 25 | +0.080000 [0, +0.2] | 0.800 |
| `bounceBackWithin240PerGkOtherRelease` | 0.052632 | 0.080000 | 38 / 25 | +0.027368 [−0.098361, +0.180952] | 0.196 |

⚠ **MOVING DENOMINATORS, DISCLOSED**: every channel count moves between the arms
(`puntReleasesPerMatch` 0.6875 → 0.7100 · `gkShortPassReleasesPerMatch` 8.9500 → 8.0875 ·
`throwOutReleasesPerMatch` 0.4225 → 0.4150 · `gkClearanceReleasesPerMatch` 0.0850 → 0.0625 ·
`gkOtherReleasesPerMatch` 0.0950 → 0.0625). The per-seed channel counts are stored.

⭐ **TWO PLAIN-FOOTBALL FACTS FOR THE GATE.** (i) **Nearly half of all punts already came home
inside 4 seconds in the BASE world** (0.465455) and the armed change is not resolvable
(CI spans zero) — the punt's loop was ALWAYS closing, which is a statement about the punt, not
about the contact law. (ii) The rise the user will feel lives in the **short pass**: it is the
only channel whose Δ CI clears zero, and it is 86–87 % of all keeper distributions.

**RELEASE KIND × RETURN PATH, within the window, as COUNTS** (§DOUBTS 1's promise kept — the
punt row is counts only, never a CI-bearing share). Column order is
`namedObservations.channelByClassMatrix.classes`:

| channel | saveHeld | restartAward | parryRegather | oppLost | backPass | **directCarom** | noTouch |
|---|---|---|---|---|---|---|---|
| `punt` base | 61 | 8 | 15 | 0 | 0 | **44** | 0 |
| `punt` armed | 48 | 8 | 11 | 0 | 0 | **77** | 0 |
| `gkShortPass` base | 63 | 11 | 20 | 35 | 50 | **74** | 1 |
| `gkShortPass` armed | 95 | 20 | 13 | 36 | 50 | **162** | 0 |
| `throwOut` base / armed | 1 / 0 | 0 / 1 | 0 / 0 | 0 / 0 | 1 / 2 | 1 / 1 | 0 / 0 |
| `gkClearance` base / armed | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / **2** | 0 / 0 |
| `gkOther` base / armed | 0 / 0 | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 1 / 1 | 0 / 0 |

The carom cell grows in **every** channel that has one, and it is the largest single cell in the
armed short-pass row (162 of 376).

## §R3 THE SAVE / PARRY LEDGER — the parry is real, it is huge, and it is NOT the keeper's

| face | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `saveCreditsPerMatch` | 5.255 | 5.6475 | +0.3925 [+0.1275, +0.6775] | 1.427 |
| `parryShareOfSaveCredits` | **0.778306** | **0.771138** | −0.007169 [−0.033105, +0.018762] | 0.276 |
| `parryRegatherWithin240Share` | 0.080685 | 0.073479 | −0.007206 [−0.026511, +0.012250] | 0.372 |
| `parryToOpponentShare` | **0.844132** | **0.851894** | +0.007762 [−0.018394, +0.033504] | 0.299 |
| `parryWentDeadShare` | 0.029340 | 0.036739 | +0.007400 [−0.004752, +0.019592] | 0.608 |

**`namedObservations.parryLedger`** (fate order `parryRegatheredByKeeper · parryToOpponent ·
parryToTeammate · parryWentDead · parryUnresolved`): base **[144, 1381, 63, 48, 0]**, armed
**[133, 1484, 61, 64, 0]**; `baseSaveCreditsHeld = 466` / `armedSaveCreditsHeld = 517`;
`baseSaveCreditsParry = 1636` / `armedSaveCreditsParry = 1742`; parry-regather median gap
**30 ticks** (0.5 sim-s) in both arms.

⭐ **THE INSTRUMENT GAP BK-C0 NAMED IS NOW A MEASURED QUANTITY, AND IT IS BIG BUT INERT.**
**78 % of every save credit in this world is a PARRY, not a catch** — and 84–85 % of parries go
to the OPPONENT, only 8 % come back to the keeper inside the window of record. Neither share
moves resolvedly when the laws arm. So the class that BK-C0 §DOUBTS 4 feared was contaminating
弹回门将 is a genuinely separate, genuinely large phenomenon that **is not what moved**.

## §R4 THE ACQUISITION LEDGER — how a keeper gets the ball at all

| face | base | armed | Δ [95 % CI] | \|Δ\|÷hw |
|---|---|---|---|---|
| `gkAcquisitionsPerMatch` | 10.6275 | 9.6575 | −0.97 [−1.31, −0.63] | 2.853 |
| `acqRestartAwardShareOfAcquisitions` | **0.485298** | **0.442920** | −0.042378 [−0.067220, −0.017039] | 1.689 |
| `acqFromOpponentShareOfAcquisitions` | 0.231710 | 0.195185 | −0.036525 [−0.052981, −0.019683] | 2.194 |
| `acqParryRegatherShareOfAcquisitions` | 0.110092 | 0.126844 | +0.016753 [+0.002757, +0.030972] | 1.188 |
| `acqSaveHeldShareOfAcquisitions` | 0.109621 | 0.133834 | +0.024213 [+0.009647, +0.038720] | 1.666 |
| ⭐ `acqSelfRecollectShareOfAcquisitions` | 0.028464 | 0.062904 | **+0.034441** [+0.023493, +0.045996] | **3.061** |
| `acqFromTeammateShareOfAcquisitions` | 0.034815 | 0.038312 | +0.003497 [−0.004288, +0.011615] | 0.440 |
| `acqOtherShareOfAcquisitions` | 0.0 | 0.0 | 0 | — |

**`namedObservations.acquisitionLedger`**: base **[466, 2063, 468, 148, 985, 121, 0]**, armed
**[517, 1711, 490, 148, 754, 243, 0]** in `kinds` order.

⭐ **NEARLY HALF OF ALL KEEPER BALLS ARE THE REFEREE'S** (`acqRestartAwardShareOfAcquisitions`
0.485298 base) — a fact no stage had published, and the honest context for every "keeper
distribution" number in the programme: the open-play release menu is the minority of the
keeper's ball-getting. The **"carry?" cell** the dispatch asked about is small and does not move:
`gkLostWithoutReleaseShare` 0.017274 → 0.018397 (CI spans zero) — the keeper almost always ends
his possession with a NAMED release, not by losing it.

## §R5 THE CENSORING LESSON, PAID FORWARD TWICE

**(a) THE PRE-FREEZE SCRATCH MEASUREMENT** (§6): on 60 shared matches, BK-T2's own block and this
chain agreed **54 = 54** on the within-240 face and **619 = 619** on releases, while the any-gap
column read **87 (BK-T2) vs 145 (R9)** — **40 % of late closures were invisible to a 420-tick
retirement.**

**(b) THE BATTERY'S OWN READ**, at a 720-tick cap:
`namedObservations.returnGapHistogramsByClass.baseBeyondWindowShare = 0.565601` and
`armedBeyondWindowShare = 0.457114` — **more than half of all closures happen at a gap ≥ 250
ticks.** BK-T2 measured this same quantity as 28.8 % / 23.2 % at a 420-tick cap. ⭐ **The
comparison is the finding: the tail did NOT end at 420, and BK-C0's original "the loop closes
fast or not at all" reading is struck for a second time, one level deeper.** `chainNoReturnShare`
is still 0.778564 / 0.734672 — most releases never come home at all, and the cap remains the one
declared censoring edge.

**MEDIAN RETURN GAPS FROM THE STORED BINS** (lower bin edges, ticks;
`returnGapHistogramsByClass.baseMedianTicks` / `armedMedianTicks`, NaN where the cell is empty):

| class | base | armed |
|---|---|---|
| `saveHeld` | 30 | 30 |
| `restartAward` | 510 | 490 |
| `parryRegather` | 180 | 310 |
| `oppControlledThenLost` | 480 | 450 |
| `ownDefenderBackPass` | 140 | 140 |
| ⭐ `directCarom` | **30** | **40** |
| `noOtherTouch` | 30 | NaN |

⭐ **THE CLASS THAT CARRIES THE RISE IS ALSO THE FASTEST ONE** — a carom comes back in half a
second, which is exactly the shape of the picture the user sees: he plays it, it hits a body a
few metres away, it is back at his feet. And it explains the geometry of BK-T2's own window
arithmetic: the classes with long medians (`restartAward` 510, `oppControlledThenLost` 480) are
precisely the ones the 240-tick window mostly EXCLUDES (20 of 280 base restart returns fall
inside it), so the within-window face is dominated by the fast classes by construction.

## §R6 SEED LEDGER — BOOKED = WALKED

**Block 12,506,000–999 CONSUMED WHOLE of record.**

| sub-range | seeds | walks | what |
|---|---|---|---|
| `12,506,000 – 12,506,399` | 400 | **800** | the battery of record (base + armed per seed) |
| `12,506,000 – 12,506,002` | (inside the above) | 6 | the pre-freeze sizing smoke (`R9_MODE=smoke`, `/tmp` — no extra consumption) |
| `12,506,999` | 1 | **1** | the world-construction receipt |
| `12,506,400 – 12,506,998` | 599 | 0 | **NOT WALKED** — unconsumed inside the consumed block |

`seeds.walksBooked = 801`, checked by `gSeedsBookedEqualWalked`. **OUT-OF-BAND SCRATCH,
DISCLOSED**: the §6 fidelity comparator ran **900,000,000 – 900,000,029** (60 matches, wrote no
artifact), the canon scratch range. **No virgin block was touched.**

**STATS LEDGER**: base **114,000**, ONE draw, 2,000 resamples, step 200.
`stats.minimumGapToAnyPublishedBase = 200`. **Next base ≥ 114,200.**

**SRC**: `git diff --stat HEAD -- src` and `git status --porcelain -- src` both EMPTY
(`gSrcUntouched` GREEN). This stage changed no `src/**` byte. `npx tsc --noEmit` clean.

## §R7 WHAT THIS STAGE HANDS FORWARD (nothing here is a decision)

1. ⭐⭐ **THE ANSWER, IN ONE SENTENCE**: 弹回门将 rises because the ball now **bounces back off a
   body** — `directCarom` doubles (0.029297 → 0.065060, |Δ|÷hw **3.045**) and is the ONLY class
   whose CI clears zero, carrying 81 % of the rise as a family; **save-and-regather is NOT the
   cause** (Δ CI spans zero).
2. ⭐ **THE PLAIN-FOOTBALL FRAMING FOR THE GATE**: the keeper's short pass into a nearby body
   comes straight back at him in half a second, twice as often as before. Whether that reads as
   *"门将的球讲理了"* or as pinball is the **USER's** call — it is the honest cost of a world where
   the ball can no longer fly through people, and it is a **PRICING** question (does a keeper
   release into a blocked lane cost anything?) rather than a bug.
3. **TWO FACTS THE PROGRAMME DID NOT HAVE**: 78 % of save credits are PARRIES (84 % of which go
   to the opponent), and **48.5 % of a keeper's balls come from the referee**, not from open play.
4. **BK-C0's "loop closes fast or not at all" is struck a second time**: at a 720-tick cap,
   0.565601 / 0.457114 of closures are beyond 250 ticks. Any future GK instrument should retire
   at ≥ 720 and store bins, or say what it censored.
5. **A CANDIDATE FOR THE PRICING SHELF, NOT A PROPOSAL**: BK-T2 already routed the punt's missing
   landing price there (§R3). This stage adds that the **short** keeper pass is the channel that
   moved, and that `PlayerBrain`'s hands distribution already reads `laneOpenness` while the
   keeper's FEET pass does not. **No change is proposed here.**

## §DOUBTS (the executor's own, stated)

1. **THE PUNT CELL IS THIN, AS DECLARED** (§9): 128 / 144 within-window punt returns; its class
   split is COUNTS only and no conclusion rests on a punt × class share. The punt's own
   per-release face has a CI spanning zero and is reported as such.
2. ⚠ **THE CROSS-TAB'S DENOMINATOR IS THE ANY-GAP CLASS COUNT, NOT THE WITHIN-WINDOW ONE.**
   `returnOppOwnedByClass` counts every RETURN of that class at any gap ≤ 720, while the
   decomposition row's `baseEvents` / `armedEvents` are WITHIN-window counts — which is why
   `restartAward` shows 249 opp-owned against 20 within-window events. The field name carries no
   window, and the honest read is: of the class's ANY-GAP returns
   (`saveHeld` 182/196 · `restartAward` 280/244 · `parryRegather` 61/58 ·
   `oppControlledThenLost` 206/192 · `ownDefenderBackPass` 57/58 · `directCarom` 120/243 ·
   `noOtherTouch` 1/0), that many saw opponent possession. **Disclosed, not patched** — the
   instrument was frozen before it walked.
3. **`saveHeld`'s 30-TICK MEDIAN IS UNEXPLAINED.** A save credited to the keeper 0.5 s after his
   own release is fast for "the opponent won it and shot"; the mechanism (a smother at the feet?
   an aerial claim with a stale `pendingShot`?) was not chased, because the class's Δ CI spans
   zero and no conclusion depends on it. It is a named loose end, not a finding.
4. **`directCarom` IS ATTRIBUTED BY CONSTRUCTION, NOT BY WATCHING THE STRIKE.** The instrument
   counts "another body touched it without owning it" and does not label each touch as
   deflection-vs-bodyStrike. The attribution rests on `gBaseDormant` (zero bodyStrikes in the
   base arm) plus the paired design. A future instrument could tag the touch directly.
5. **THE RETIRE CAP IS STILL A CAP.** 73–78 % of chains never close; `chainNoReturnShare` is
   published, and the any-gap face's unit says "≤ 720 ticks".
6. **NOTHING IS SCORED AND NO FOOTBALL VERDICT IS CLAIMED.** Every face here is REPORTED. The
   BK play-test USER GATE is untouched by this stage and remains open.

## §DECLARED DEVIATIONS FROM THE DISPATCH

1. **No early chain termination on opponent goal-side possession** — pre-registered in §3(c) with
   its reason (it would stop the instrument from partitioning the face of record). Opponent
   possession, and opponent possession inside the keeper's own box, are published as annotations.
2. **`armedVersionNamesTheArm`** replaces BK-T2's `armedVersionIsEight` conjunct, per ruling #309
   item 5 (§2). Disclosed and measured before the battery.
3. **The keeper's own loft cap is published, not substituted** for the 240-tick window of record
   (§3(g)) — substituting it would have decomposed a different number.
4. **Committed on `main`**, following this programme's standing two-commit round protocol (every
   prior stage commit sits on `main` and the commander's rulings reference them there), rather
   than opening a branch. Nothing was pushed.

