# BK-C0 — THE BODY-BALL CENSUS (instrument-only)

> **Contract:** [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) §3 BK-C0.
> **Authorization:** ruling #305 item 3 (overnight self-drive, instrument-only).
> **Status:** pre-registration FROZEN before the battery; results appended after.
> **Nothing here is SCORED.** BK-C0 is a census: every face is REPORTED. It exists to pick the
> cone/solver design and the slice order for BK-T0.., and to put numbers under the user's three
> sentences (反人类的传球 · 球穿身体 · 门将高空长传→弹回门将).

---

## §0 CANON QUOTED FOR THIS STAGE (copied from [`CANON.md`](CANON.md), never re-typed)

| sentence | home | how this stage meets it |
|---|---|---|
| *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name lists are retired"* | **PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1** | `BODY_SCHEMA` in the probe; the artifact publishes it as `hashedBodySchema` and the hash covers exactly those keys |
| freeze-before-battery (paraphrase) | **ruling #266.3(c)** | COMMIT 1 = probe + this pre-registration; the battery ran after it; `instrumentCommit` records the frozen hash |
| per-seed cells (paraphrase) | **ruling #282.2(ii)** | `perSeedCells[]` carries every counter and every histogram per seed |
| *"the re-derivation gate covers EVERY published face; a percentile face requires stored bins"* | **PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4** (+ #287 item 1) | `gFaces` re-parses the SERIALIZED artifact off disk and re-derives every face; all six percentile faces come from STORED BINS |
| *"a field carries the unit its name claims"* | **ruling #294 item 3** | every field carries `Ticks` / `Seconds` / `Metres` / `Share` / `PerMatch` / `Rad` in its name |
| *"a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"* | **PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4** | every number in §RESULT below names the artifact field it is read from |
| clock honesty (paraphrase) | **ruling #280.2(iii) + PC-T2 §CORR item 3** | `clockFaces` puts the two headline rates on the playing clock, dual-axis stated (1 sim-s = 22.5 display-s) |
| *"a dose-source guard should hash the bytes it reads, not a self-declared field"* | **BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6** | both dose artifacts are read as TEXT and hashed (`l3DoseFileBytesSha256`, `pcDoseFileBytesSha256`) before they are parsed |
| seed discipline, BOOKED = WALKED (paraphrase) | standing frontier practice | §SEED LEDGER below |

---

## §1 THE WORLD (frozen before the battery)

The **world-8 composition** — the watched world of record, wind-ups armed, the world the
user's three observations were made in:

```
new Match({ seed, teamA, teamB, ...a4MatchFlags(8) })
armA4World(m, null, 8, poolT1DoseCells(L3-T1), poolPcDoseTable(PC-T1))
```

The PC-T2 arm-C construction idiom, one contract over: **the dose is read from the committed
artifacts AT RUN TIME, never typed**, and both files are hashed AS BYTES before they are parsed.
The world identity is ASSERTED on the very match each walk measures (`worldConjuncts`):
`a4ArmedVersion(m) === 8` · `c7Windup && o1PassWindup` · the latency door + seat live · both
recognition books **bit-equal to the dose table** · both defence books bit-equal to the L3 dose.
A world-construction receipt is walked at its own booked seed (`12,501,999`); if any conjunct
fails the probe exits 3 and writes nothing.

## §2 THE FOUR INSTRUMENTS — PRE-REGISTERED FACES, DEFINITIONS AND BINS

### (a) The release-facing census

* **The measure** is the ENGINE's own `kickMisalignment = (1 − cos θ)/2` (mechanics.ts) taken
  between the striker's **PRE-STEP heading** and the direction the ball actually left in.
  Pre-step is the correct heading by construction: kicks fire in `executeAction` and at the two
  head-of-tick wind-up resolves, both **before** `physicsStep` writes the new heading.
* **The direction** is the ball's own horizontal velocity at the tick boundary after the
  release, **de-rotated by the one tick of Magnus rotation `stepBall` applied**. The residual
  error bound is itself published (`maxSpinRotationPerTickRad`).
* **Four facing tiers, from quadrant geometry** — cuts at θ = 45°, 90°, 135°, i.e. misalign
  `(1−cos45°)/2`, `0.5`, `(1+cos45°)/2`. `aligned · across · reversed · blind`. No invented
  constant (#200).
* **Bins:** 20 equal bins over [0, 1]; every percentile face reads them (upper bin edge).
* **Classes** are read off the engine's OWN per-side stat bookkeeping — the signature each
  `perform*` writes (`shots` / `clearances` / `passes` + `crosses` / `cutbacks` /
  `throughBalls` / `longBalls` / `headersWon`) — with the striker's action label as the single
  tie-break the stats cannot make (the keeper's hand `ThrowOut` vs an ordinary short pass):
  `shot · headerShot · shortPass · loftedPass · throughBall · cross · cutback · keeperThrow ·
  clearance · headerClearance · headerKnockdown · other`.
  ⭐ **The three header classes are NOT facing-priced** — `headBall` writes `ball.vel` directly
  and never calls `orientationPowerMul`/`orientationNoiseMul`. They are censused *because* of
  that: how much of the world's ball-striking sits outside the facing price at all is a BK-C0
  question, and `headerClassShareOfReleases` answers it.
* **A second, independent facing face**: `meanIntentMisalign` — the same measure against the
  direction of the **intended target body** (passes carrying a `pendingPass.targetGid`). The
  observed face includes the spray noise; the intent face does not.
* **Outcome** = the side of the NEXT body to touch the ball (`ownNextTouch` / `oppNextTouch`),
  else `outOfPlay` / `goal` / `noTouchByEnd`. Published per class and per facing tier.
  **Open play only**, declared: a dead-ball release resolves through the restart machinery.
* **Two honesty counters, published**: `unattributedReleases` (a stat signature whose striker
  the engine did not record — free kicks and penalties, where `lastTouch` still belongs to the
  other side) and `multiSignatureTicks` (two class signatures on one side in one tick).

### (b) The through-body flight census

Swept per tick over every body, for the **FREE ball only** (`owner === null`), phase `playing`,
body not `sentOff`, and **the body is not the ball's `lastTouch` nor this tick's contact** —
the ball sitting inside the boot that just struck it is a self-contact artefact, not 球穿身.

* **TWO radii, kept honestly apart**:
  * `visualThroughBodyTicks` — ball centre inside **`PLAYER_CORE_RADIUS` = 0.525 m** (reads as
    through the torso);
  * `reachCrossingBodyTicks` — inside **`CONTROL_RADIUS` = 1.25 m** with no handler contact
    that tick (the lawful reach the engine itself uses in `collectGroundContactClaims`).
* **Handler contact this tick** = `ball.lastTouch` changed this step, or ownership passed to a
  body that did not own it last tick.
* **Per-cause cells**, one cell per body-tick, ladder evaluated in this order — each cause
  names the engine gate that produced it:
  `aboveGkClaim` (z > 2.55, `tryAerial` returns) → `deadBand` (1.30 < z < 1.35) →
  `aerialBand` (1.35 ≤ z ≤ 2.55, an argmax duel not a reach) → `cooldownInvisible`
  (z ≤ 1.30 and `kickCooldown > 0`, Match.ts:4562) → `stunned` → `speedAboveControl` →
  `rollOrClaimOrder` (the residual: the blind/speed roll refused, the oriented-shell screening,
  or another claim won the tick).
* **Episodes** (maximal consecutive-tick runs per body) with a duration histogram, so the face
  is a distribution and not only a tick count.
* **Dead-band occupancy** counted as BALL-ticks in z ∈ (1.30, 1.35), split by whether any body
  was inside `CONTROL_RADIUS` at the time.
* **Cooldown invisibility** counted separately as body-ticks and episodes.
* **A speed split** at **6 m/s** — the engine's own trivially-trapped cut in
  `attemptFirstTouch` (`speed <= 6` returns clean unconditionally), not a taste threshold.

### (c) The GK-loop ledger (absorbs #303's H-303a)

* **Channels** from the keeper's own action label at the pre-step boundary:
  `punt` (= `LoftedPass` while `gkDistributing`) · `throwOut` · `gkShortPass` ·
  `gkClearance` · `gkOther`.
* **Landing first touch** = the first body other than the keeper himself to touch the ball,
  celled as own/opp × ground/aerial (aerial = `z ≥ HEADER_MIN_HEIGHT` at contact).
* **Bounce-back cycle** = *the releasing keeper owns the ball again after his own release.*
  **Window, DERIVED: `2 × LOFT_T_MAX` = 2 × 2.1 s = 252 ticks** — the engine's own lofted-flight
  cap (`performLoftedPass`'s `tMax` argument to `loftKick`), out and back: one lofted round
  trip. The **full gap histogram** is stored (41 bins × 10 ticks), so any other window
  re-derives off disk.
* **Short-ball turnover-within-N** = after a `throwOut`/`gkShortPass` reaches a teammate, the
  opponent gains ownership within N ticks **measured from the teammate's first touch**, not
  from the release. **N, DERIVED: `L3_DEFENCE_WINDOW_S / DT`** — the engine's own arrival law
  `sqrt(2·CB_TACKLE_RADIUS/ACCEL) + π/TURN_RATE` (defenceBook.ts), the widest window the engine
  itself says a defender needs to arrive and challenge. Full histogram stored.
* GK releases are censused from **both** origins (open play and the restart takes that flip to
  `playing` on the kick); `gkByChannelRestart` publishes the split.

### (d) The turn-cost arithmetic (NO sims)

Pure algebra over the shipped constants, with every module-private constant **EXTRACTED from
`src/**` at run time** rather than typed (#200):

* θ → `turnSeconds = θ / TURN_RATE` → `turnTicks` at 13 angles (0°…180°), beside the two
  existing orientation prices `orientationPowerMul` / `orientationNoiseMul` at three technique
  levels (low 0.2 · the population mean `C7_T_BAR` · high 0.8);
* the **C7 wind-up** re-derived from the extracted `C7_W_*` family on a (|v|, |ω|) × technique
  grid, so "what the engine already charges for time" sits in the same table as "what the turn
  would cost";
* `turnTicksOverWindupCapTicks` — the ratio that says how much of the required turn the
  existing wind-up ceiling could absorb;
* an EMPIRICAL cross-check from the battery: the **observed** wind-up lengths
  (`readyTick − simTick` at every arm), which must lie inside the shipped [3, 11] clamp.

## §3 THE GATES

`gWorld` (world 8 + both doses bit-equal, on the receipt AND every walked match) ·
`gFormula` (the probe's misalign arithmetic is bit-identical to `kickMisalignment`) ·
`gConstants` (every extracted constant parses finite; every traced line found) ·
`gSrcUntouched` (`git diff --stat HEAD -- src` AND `git status --porcelain -- src`, both empty)
· `gSeedsBookedEqualWalked` · `gCausePartition` (the cause cells sum to the body-tick totals) ·
`gCoreSubsetOfReach` · `gTierPartition` (tiers and bins both sum to the release total) ·
`gDoseBytes` · four liveness gates (releases / through-body / GK / wind-up arms all non-empty)
· `gFaces` + `gFacesCoverage`.

## §SEED LEDGER

**Block of record: 12,501,000–999** (opened by ruling #305 item 3). BOOKED = WALKED:

| sub-range | count | what for |
|---|---|---|
| `12,501,000 – 12,501,003` | 4 | the **pre-freeze sizing/liveness smoke** (wall-time anchor + class-coverage check). Inside the battery's own range — no extra consumption. |
| `12,501,000 – 12,501,499` | 500 | **the battery of record** (`BKC0_MODE=full`) |
| `12,501,999` | 1 | the **world-construction receipt** (the xxx,999 convention) |
| `12,501,500 – 12,501,998` | 499 | **NOT WALKED** — unconsumed inside the block |

**Stats-stream draws: ZERO.** No stats base was taken (none is needed: this stage draws no
bootstrap and publishes no CI — it is a census of counts and distributions).

---

# §RESULT — THE BATTERY (500 matches, world 8, all gates green)

> **Artifact:** [`data/bk-c0-bodyball-census.json`](data/bk-c0-bodyball-census.json)
> `resultSha256 = 5196da9e2985719b0f207b2c67ce0a69e8d9b979031f7c61b6a6f276cc1b0378`.
> **Instrument frozen at `a6c0f4a`**, byte-unchanged to result. Battery: **500 matches ×
> 7,607,729 ticks, 53.2 s wall** (`battery.matches` / `battery.ticksTotal`). `gFaces`
> re-derived **416/416** published checks by parsing the serialized artifact off disk.
>
> **Every number below quotes an artifact FIELD by name.** Where a number is doc-side
> arithmetic OVER artifact fields rather than a stored face, it says so and shows the
> arithmetic (the PC-T2 §CORR item 4 convention).

## §R0 The world is the world (provenance)

`world.everyWalkedMatchConformed = true` on all 500 matches and on the receipt seed; all five
receipt conjuncts true. The two dose file-byte hashes are
`world.l3DoseFileBytesSha256 = a41a114c…37db` and
`world.pcDoseFileBytesSha256 = 0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f`
— the latter is **byte-identical to the shipped entry's own `PC_T1_BYTES_SHA`** in
`src/game/a4World.ts`, i.e. the census dosed from exactly the artifact the game arms world 8
from. `world.pcDoseExposuresTotal = 8281`, `world.l3DoseLungesTotal = 27368`.

## §R1 (a) THE RELEASE-FACING CENSUS — 反人类的传球 is real, and today it is free

`releaseFaces.releasesTotal = 53055` open-play releases (`releasesPerMatch = 106.11`), of which
`facingPricedReleases = 49461` and `headerClassReleases = 3594`
(`headerClassShareOfReleases = 0.067741` — **6.8 % of the world's ball-striking is not
facing-priced at all**, because `headBall` never touches the orientation multipliers).

**The distribution is BIMODAL, not centred.** `meanMisalignAtRelease = 0.297567`,
`medianMisalignAtReleaseFromBins = 0.15`, `p90MisalignAtReleaseFromBins = 0.95`, and the tier
split is `shareAligned = 0.531335` · `shareAcross = 0.199227` · `shareReversed = 0.132787` ·
`shareBlind = 0.136651` ⇒ **`shareBeyondSquare = 0.269437`**. The stored bins
(`aggregateCells.allMisBins`) show both humps: **21,247 releases in the lowest bin
(misalign < 0.05)** and **4,933 in the highest (misalign ≥ 0.95)**.
*Doc-side arithmetic over `allMisBins` and `releasesTotal`:* 4,933 ÷ 53,055 = **9.30 % of every
release in this world leaves the boot essentially BACKWARDS** (θ ≥ 154°). That is the user's
sentence, measured.

The independent intent face agrees: `meanIntentMisalign = 0.32139` over
`intentRows = 44433` (heading vs the intended target's direction, spray noise excluded). The
observation's own error bound is tiny: `maxSpinRotationPerTickRad = 0.00886`.

**What it costs today: essentially nothing — and the little it does cost is NOT ordered.**
`perTierOutcomeFaces` (own-next-touch share by facing tier):

| tier | `outcomeRows` | `ownNextTouchShare` | `oppNextTouchShare` |
|---|---|---|---|
| aligned | 28190 | **0.647889** | 0.308301 |
| across | 10570 | 0.665374 | 0.318070 |
| reversed | 7045 | **0.582115** | 0.407665 |
| blind | 7250 | **0.658621** | 0.336552 |

A fully-reversed strike keeps the ball for its own side **more often than a square one and
almost exactly as often as an aligned one**. The existing price (up to −22 % power, up to
+90 % noise) is not visible in who touches the ball next. ⭐ **This is the census's central
finding for H-BK.1: today misalignment is a rounding error on the outcome, so the facing law
has room to add a TIME cost without deleting anything the world currently earns.**

Per class (`perClassFaces`, `meanMisalign` / `shareBeyondSquare`):

| class | releases | `meanMisalign` | `shareBeyondSquare` | `ownNextTouchShare` |
|---|---|---|---|---|
| `shot` | 4875 | 0.054503 | 0.034872 | 0.026872 |
| `shortPass` | 34197 | 0.289211 | **0.252975** | 0.786531 |
| `throughBall` | 4938 | 0.239851 | 0.205954 | 0.619279 |
| `cutback` | 3318 | **0.594516** | **0.603978** | 0.611513 |
| `cross` | 1226 | 0.392597 | 0.364600 | 0.402936 |
| `loftedPass` | 554 | 0.087908 | 0.063177 | 0.801444 |
| `keeperThrow` | 200 | 0.138380 | **0.000000** | 0.955000 |
| `clearance` | 153 | 0.461362 | 0.464052 | 0.150327 |
| `headerShot` | 1167 | 0.353483 | 0.328192 | 0.027421 |
| `headerClearance` | 2085 | 0.593574 | 0.629257 | 0.314628 |
| `headerKnockdown` | 342 | 0.573585 | 0.599415 | 0.637427 |

Reading: **the shot is already an aligned act** (0.0545 — the C7 wind-up's `faceTarget` lock is
doing exactly what it was built to do), and **the ordinary short pass is where 反身 lives** —
a quarter of all short passes (25.3 %, and short passes are 64 % of all releases) leave with
the target behind the body's square line. The cutback is beyond-square by construction (a
byline pull-back IS played across the body — real football agrees), and the header family is
the most misaligned of all precisely because nothing prices it.

Honesty counters: `multiSignatureTicks = 0` (no tick ever carried two class signatures for one
side) and `unattributedReleases = 428` (0.86/match — free kicks and penalties, where the
engine records no passer and `lastTouch` still belongs to the other side).
`restartFaces.restartReleasesTotal = 0`: every restart kick resolves on a tick the engine has
already flipped to `playing`, so the open-play scope loses nothing.

## §R2 (b) THE THROUGH-BODY CENSUS — the hole is real, and it is 3/4 COOLDOWN

Over 500 matches, `throughFaces`:

* **`visualThroughBodyTicksPerMatch = 119.192`** — body-ticks where the ball's centre sits
  inside a body's 0.525 m core with no handler contact — in
  **`visualThroughBodyEpisodesPerMatch = 29.41`** separate episodes. **~29 times a match the
  ball visibly passes through somebody.** On the clock:
  `clockFaces.visualThroughBodyPerPlayingSimMinute = 33.9464`.
* **`reachCrossingBodyTicksPerMatch = 506.246`** in `reachCrossingEpisodesPerMatch = 80.972`
  episodes (`clockFaces.reachCrossingsPerPlayingSimMinute = 144.1813`), median episode
  `medianReachEpisodeTicksFromBins = 5` ticks.
* Of those, `reachCrossingBodyTicksFast = 204621` of 253123 (**80.8 %**, doc-side arithmetic
  over the two fields) are with the ball above the engine's own trivially-trapped cut of
  6 m/s — these are *flights*, not a ball lying still beside a foot.

**The cause ladder (`causeFaces`) is the design instruction of this stage:**

| cause | reach body-ticks | `reachShare` | core body-ticks | `coreShare` |
|---|---|---|---|---|
| `cooldownInvisible` | 185796 | **0.734015** | 48790 | **0.818679** |
| `aboveGkClaim` | 27959 | 0.110456 | 5185 | 0.087002 |
| `aerialBand` | 13781 | 0.054444 | 3244 | 0.054433 |
| `rollOrClaimOrder` | 13090 | 0.051714 | 110 | 0.001846 |
| `stunned` | 9403 | 0.037148 | 1800 | 0.030203 |
| `speedAboveControl` | 2766 | 0.010927 | 434 | 0.007282 |
| `deadBand` | 328 | **0.001296** | 33 | 0.000554 |

⭐⭐ **The dead band is NOT the disease.** `throughFaces.deadBandBallTicksPerMatch = 8.494`
(`deadBandSecondsPerMatchSim = 0.141567` — a seventh of a sim-second per match), and only
`deadBandTicksWithBodyInReach = 512` of 4247 dead-band ticks had a body inside reach at all.
It is a genuine gap in the z partition and M-BK.2 closes it by construction — but it explains
**0.13 %** of reach crossings.

⭐⭐ **Three quarters of 球穿身 is CONTACT INVISIBILITY DURING KICK COOLDOWN**:
`cooldownInvisibleBodyTicksPerMatch = 371.592` in
`cooldownInvisibleEpisodesPerMatch = 55.03` episodes. `KICK_COOLDOWN = 0.45 s` = 27 ticks, and
the claim filter at `Match.ts:4562` drops those bodies from `collectGroundContactClaims`
entirely. **The contact law's first job is not the dead band — it is the body that has just
kicked and is therefore not there.** Note the split in the two radii: cooldown invisibility is
*more* dominant at the visual core (0.819) than at the lawful reach (0.734), i.e. it is
precisely the cause that produces the picture the user complained about.

The `rollOrClaimOrder` residual behaves the opposite way — 5.2 % of reach crossings but only
**0.18 %** of visual through-body ticks. A refused blind/speed roll usually lets the ball pass
*near* a body, not *through* it.

## §R3 (c) THE GK-LOOP LEDGER — H-303a answered, and the answer is not the one the story predicted

`gkFaces.gkReleasesPerMatch = 10.578` (`gkReleases = 5289`). The distribution mix:

| channel | share | `landingRows` | `oppFirstTouchShare` | `aerialFirstTouchShare` |
|---|---|---|---|---|
| `gkShortPass` | **0.862167** | 4560 | 0.101754 | 0.126096 |
| `punt` | 0.076385 | 404 | 0.183168 | **0.705446** |
| `throwOut` | 0.037814 | 200 | 0.045000 | 0.030000 |
| `gkClearance` | 0.009832 | 52 | **0.788462** | 0.000000 |
| `gkOther` | 0.013802 | 73 | 0.150685 | 0.191781 |

⭐⭐ **H-303a (「基本没有门将短传 build-up」) is NOT confirmed as a pricing defect.** In the
watched world **86.2 % of keeper distributions ARE short passes**, and they reach their own
side 78.4 % of the time on the ground (`gkLandingFaces[gkShortPass].ownGroundShare = 0.783553`).
The punt is **7.6 %** of distributions. What IS true is the loud part: **70.5 % of punts are
first met in the AIR** and the keeper's rare hoofed `gkClearance` gives the ball straight to
the opponent **78.8 %** of the time. The user watched the salient minority, and the census says
so honestly — the mechanism (#303 item 3(x): a DF-weighted aerial argmax on a punt that pays
no landing price) is real, but it is priced into a small channel, not the mainline.

**The loop closes 11.6 % of the time:** `bounceBackWithinWindowPerGkRelease = 0.11609`
(`bounceBacksWithinWindow = 614` of `bounceBacks = 619` at ANY gap, so the derived
252-tick window is not doing any work — the loop closes fast or not at all).
`medianBounceBackGapTicksFromBins = 40` ticks = 0.67 sim-s, and the stored histogram
(`aggregateCells.gkBounceBackBins`) puts 339 of 619 in the 20–40-tick bins: **the typical
"bounce back to the keeper" is a save-and-regather, not a punt that came home.**

**The short ball is not instantly turned over:** of `shortCompleted = 4281` completed short
distributions, `shortTurnovers = 1614` end in an opponent gaining possession at some point,
but only `shortTurnoverWithinWindow = 384` do so inside the engine's own defender-arrival
window ⇒ `shortTurnoverWithinWindowShare = 0.089699`, with
`medianShortTurnoverGapTicksFromBins = 100` ticks (1.67 sim-s). **瞬间被断 measures at ~9 %.**
Contract M-BK.4 already scopes the marked-defender half OUT of this arc; the ledger says that
scoping cost the arc very little.

## §R4 (d) THE TURN-COST ARITHMETIC — where the engine's own prices bite

`turnFaces`: `turnRateRadPerSecond = 6.5`; a full reversal costs
`fullReversalSeconds = 0.483322` = **`fullReversalTicksWhole = 29` ticks**; a square turn costs
`squareTurnTicksWhole = 15`. The engine's existing time price for a release tops out at
`windupCapTicks = 11` (floor `windupFloorTicks = 3`), so
**`fullReversalOverWindupCap = 2.6851`** — *the unpaid turn is 2.7× the largest time charge the
certified wind-up family knows how to make.* Observed in the battery:
`observedWindupArms = 26140`, `observedWindupMeanTicks = 6.458225` (every arm inside the [3,11]
clamp; `aggregateCells.windupBins` peaks at 6–7 ticks).

`turnCostTable` (extract; `turnTicks` = θ/`TURN_RATE`/DT, the two price columns at the
population-mean technique `C7_T_BAR = 0.4068`):

| θ° | `misalign` | `turnTicksWhole` | `powerMulAtTechMean` | `noiseMulAtTechMean` | `turnTicksOverWindupCapTicks` |
|---|---|---|---|---|---|
| 15 | 0.017037 | 3 | 0.996862 | 1.011175 | 0.2238 |
| 45 | 0.146447 | 8 | 0.973024 | 1.096057 | 0.6713 |
| 60 | 0.250000 | 10 | 0.953950 | 1.163980 | 0.8950 |
| **75** | 0.370590 | 13 | 0.931737 | 1.243078 | **1.1188** |
| 90 | 0.500000 | 15 | 0.907899 | 1.327960 | 1.3426 |
| 135 | 0.853553 | 22 | 0.842774 | 1.559863 | 2.0138 |
| 180 | 1.000000 | 29 | 0.815798 | 1.655920 | 2.6851 |

⭐ **THE CONE THE ENGINE ITSELF DRAWS** (doc-side arithmetic over
`turnFaces.windupCapTicks`, `tracedConstants.dtSeconds` and
`tracedConstants.turnRateRadPerSecond`, the λ_LIN "cap at the edge" idiom):
`11 ticks × (1/60) s × 6.5 rad/s = 1.19167 rad = 68.28°`, i.e. **misalign ≈ 0.3149**. Inside
that cone the required turn fits inside the wind-up ceiling the world already pays; outside it,
no existing price can absorb the turn.
*Doc-side arithmetic over `aggregateCells.allMisBins`:* the cone edge falls in the
0.30–0.35 bin, so between **33.6 % and 36.3 % of today's releases sit OUTSIDE it**
(cumulative bin counts 35,238 and 33,789 of 53,055). **One release in three is a strike the
engine's own time budget cannot pay for** — that is the size of the behaviour change M-BK.1
is proposing, stated before anyone builds it.

## §R5 WHAT THIS CENSUS PICKS (the stage's own output — a recommendation, not a ruling)

1. **Slice order should put the CONTACT LAW first, not the facing law.** 球穿身 is 29 visible
   pass-throughs a match and 73 % of it has ONE cause (`cooldownInvisible`); the fix is a
   contact channel that does not vanish while a body is in kick cooldown, and the dead band
   closes for free alongside it (it is 0.13 % of the problem, but it is a partition defect and
   M-BK.2 already binds it).
2. **The facing law's cone has a derived edge**: 68.28° / misalign 0.3149, where the required
   turn exactly saturates the existing wind-up cap. Beyond it, the honest design is the
   contract's own — the strike stays POSSIBLE at a longer wind-up (its own extension of
   `c7WindupTicks`), never banned; ~1/3 of today's releases would pay something.
3. **The GK arc should be REPORTED, not engineered** (as H-BK.3 already says). Short build-up
   is 86 % of distributions; the punt's aerial-first-touch 70.5 % is the visible complaint and
   it belongs to the punt's missing landing price, which is a pricing-shelf item, not a
   behaviour table.
4. **Two facts for whoever writes M-BK.1**: the shot is ALREADY aligned (0.0545) because the
   C7 wind-up locks `faceTarget` — so the facing law mostly bites the PASS family; and 6.8 % of
   ball-striking (the header family) is outside the facing price entirely and should stay
   there.

## §DOUBTS (the executor's own, stated)

1. **The release direction is observed, not intercepted.** It is the ball's post-step velocity
   de-rotated by one tick of Magnus; the engine's *priced* misalign is computed on the pre-noise
   aim. The two differ by the spray. The independent `meanIntentMisalign = 0.32139` (against the
   target's true direction) brackets it, and `maxSpinRotationPerTickRad = 0.00886` bounds the
   de-rotation residual — but no face here is the engine's internal `misalign` variable.
2. **The cause ladder is an ORDERING, not an exclusive diagnosis.** A body in kick cooldown at
   z = 2.8 m is booked under `aboveGkClaim`; a body that is *both* in cooldown and would have
   failed the roll is booked under `cooldownInvisible`. The shares are "the first gate that
   would have stopped him", which is the right quantity for choosing a fix and the wrong one
   for counting counterfactual contacts.
3. **`handlerContactTicksPerMatch = 256.89` is a lower bound on contacts** — it detects one
   contact per tick (`lastTouch` change or ownership change). A tick with two contacts counts
   once. It is used only as an exclusion mask, never as a denominator of a published rate.
4. **`bounceBacks` counts OWNERSHIP regained by the releasing keeper**, so a save (the keeper
   parrying his opponent's shot back to himself) and a punt that came home are the same cell.
   The 20–40-tick median strongly suggests the former dominates; separating them needs a
   possession-chain instrument this stage did not build.
5. **The through-body census excludes the last toucher entirely.** That is right for the
   release artefact, but it also removes a real case: a defender who deflected the ball a tick
   ago and then has it roll back through him. The size of that exclusion is not measured.


---

## §COMMANDER CORRECTIONS OF RECORD (ruling #306, 2026-08-19 — the frozen bytes above stand; the truth of record is here)

1. **THE BOUNCE-BACK WINDOW OF RECORD IS 240 TICKS, NOT 252.** The probe's
   unanchored regex matched the FIRST `loftKick(` in mechanics.ts
   (performThroughBall's dink, tMax = 2.0) instead of the named
   performLoftedPass site (tMax = 2.1). The artifact's
   `definitions.bounceBackWindowTicks = 240` is what RAN; the
   pre-registration's "2 × 2.1 s = 252 ticks" and the result prose's "the
   derived 252-tick window" are STRUCK. Numeric impact bounded: ≤ 5 of 619
   bounce-backs move (0.11609 → at most ≈ 0.1170). The keeper's OWN loft cap
   (1.5 s, mechanics.ts:655) is the arguably-correct source for any future
   re-derivation. ⭐ NEW CANON (ledgered this round): a src-extracted
   constant pins its extraction to the NAMED call site — anchored match +
   line receipt — never first-occurrence.
2. **THE GAP HISTOGRAM IS CENSORED AT ~250 TICKS; TWO CLAIMS STRUCK.** The
   GK record retires at `age > 240`, so bins 25–40 are structurally zero:
   (a) the pre-registration's "any other window re-derives off disk" is
   FALSE for windows > ~250 ticks; (b) the result's "the window is not
   doing any work — the loop closes fast or not at all" is CIRCULAR and
   UNSUPPORTED (no late-closing loop could have appeared). The 0.11609
   headline STANDS as what its name says — a within-240-tick rate. The
   loop's tail beyond ~250 ticks is UNMEASURED.
3. **THE TURN-COST RATIO OF RECORD IS 2.64×, NOT 2.6851×** (unit-name
   truth, the recurring class). `fullReversalOverWindupCap` divides by
   C7_W_CAP·60 = 10.8, not by the integer `windupCapTicks = 11` it is
   presented against; the true ticks-over-ticks ratio is 28.9993 / 11 =
   2.6363. The artifact field is frozen; readers reproduce 2.64 from the
   published windupCapTicks. (Noted of record: the gFaces gate re-derives
   with the identical expression and is TAUTOLOGICAL on definition errors —
   the independent-implementation parse is the layer that catches these,
   and did.)
4. **`clockFaces.reachCrossingsPerPlayingSimMinute` COUNTS BODY-TICKS, NOT
   CROSSINGS** (unit-name truth). The episode rate of record is
   `reachCrossingEpisodes` = 40,486 ⇒ **23.06 episodes per playing
   sim-minute**; the 144.1813 figure is the BODY-TICK rate under a name
   whose head noun is an event. `visualThroughBodyPerPlayingSimMinute`
   carries the same ambiguity; its doc context disambiguates.
5. **Minor notes of record**: `battery.ticksTotal` (deterministic —
   verifier-reproduced exactly) sits OUTSIDE the hashed body; future
   probes split deterministic counts from wall-clock fields. The
   pre-freeze sizing smoke's instrument hash is unrecoverable from git
   (disclosed; not load-bearing; verifier confirmed 0/224 field drift vs
   the battery). The most-quoted citation `Match.ts:4562`
   (cooldown-invisibility) is hand-typed, verified correct at this HEAD;
   it will drift on the next Match.ts edit — the BK-T1 slice pins it.
   `puntFirstTouchOppShare` (n = 401) and `gkLandingFaces[punt]
   .oppFirstTouchShare` (n = 404) answer the same question over two
   denominators; cite the landing-table form.
