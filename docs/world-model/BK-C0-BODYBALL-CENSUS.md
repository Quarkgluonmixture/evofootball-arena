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

<!-- RESULTS SECTION APPENDED AFTER THE BATTERY (COMMIT 2) -->
