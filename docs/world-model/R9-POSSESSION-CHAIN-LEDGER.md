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
