# BK-C1 — THE DISTRIBUTION CENSUS (instrument-only)

> **The arc inventory · the physics ceiling · the A-vs-B discriminator · the pressure
> signature · the oracle surface.** Authorized by **ruling #329 item 5**, serving the **USER
> MANDATE of ruling #328**. Contract: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md).
> Artifact: `docs/world-model/data/bk-c1-distribution-census.json`.
> Instrument: `scripts/probes/bk-c1-distribution-census.ts`.
>
> **THIS IS A CENSUS.** It publishes MEASUREMENTS and a DESIGN PICK, never a football claim.
> ZERO src behaviour change: no file under `src/` is touched, and `gSrcUntouched` proves it
> against `git diff --stat HEAD -- src` AND `git status --porcelain -- src`.

## §0 THE WORDS OF RECORD

The user, ruling #328 item 1, verbatim, two messages in order:

> ①「我不喜欢的是:门将开球本来要给前面或者中锋,结果直接弹到后卫或者对面压迫过来的前锋的
> 身体上然后弹回来,这个不现实足球」
> ②「或者你觉得球的弧线要不要提高?」

**In plain football language**: the keeper hits it long, it smacks straight into the nearest
body and comes back to him. That is not what a keeper's ball looks like. The question the user
asked back is the honest one: *is the ball simply not going high enough?*

⛔ **THE PROHIBITION (#328 item 3, binding)**: the default arc is **NOT hand-raised** either
way — that would erase the flat-vs-lofted tradeoff and hide the blindness. If A is true the
**CEILING** moves (substrate capability, 身体做得到的事引擎要做得到); **WHEN** to go high stays
priced and emergent.

## §1 THE TWO HYPOTHESES AND THE FROZEN QUESTIONS

Frozen by ruling #328 item 3, copied here verbatim, and answered by this census:

* **A (CAPABILITY)** — "a CAPABILITY gap: the loft ceiling may be too low for a launch to clear
  a body wall at realistic ranges".
* **B (PRICING)** — "the corridor is unpriced: higher lines exist and are never chosen".
* **THE DISCRIMINATOR** — "of the distribution caroms, how many had a CLEARING higher line
  AVAILABLE at the same target (available-but-unchosen = B; unavailable = A)".
* **THE REALITY SIGNATURE** — "block rate should RISE with pressure (learned line-picking) —
  flat-in-pressure = blind launching".

## §2 THE WORLD OF RECORD

**ONE ARM: the world-9 stack** — `a4MatchFlags(8)` + `armA4World` (matured L3/PC doses, both
dose FILES hashed AS BYTES before they are parsed) + `bkFacingLaw` + `bkContactLaw`. The carom
only exists where the contact law is armed, so that is the world whose anatomy is censused.
**There is no between-arm comparison here and none is invented** — nothing in the artifact is
an effect size (canon: receipts ≠ effect sizes).

CANON, VERBATIM, quoted because the census walks worlds: *"WORKER-SIMMED fixtures play the
SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned;
refines #270's E4 correction; matches the perf diagnostic)"* (home: ruling #283.2(iv)). This
probe builds `Match` **directly** and never round-trips a League, so no worker fixture is
generated and the sentence binds nothing here.

## §3 WHAT IS INHERITED, NOT INVENTED

* **The chain-ledger family** — R9's own ladder
  ([`R9-POSSESSION-CHAIN-LEDGER.md`](R9-POSSESSION-CHAIN-LEDGER.md) §3(d)), class for class,
  definition for definition; `distributionFamily = {oppControlledThenLost,
  ownDefenderBackPass, directCarom, noOtherTouch}`; the resolution rule
  `ownerGid === gid && ownerGid !== prevOwnerGid`; the **240-tick window of record**; the
  720-tick retire cap. The census does **not** invent a new family (#329 item 5(b)'s binding
  instruction).
* **The release detection** — R9's / BK-C0 §2(a)'s per-side stat-delta ladder finds the release
  TICK and the releasing BODY, and supplies the shot/header exclusions.
* **The flight physics** — `loftKick`'s three expressions and `Match.stepBallPhysics`'s
  airborne branch, transcribed statement-for-statement (§5).

## §4 THE PRE-REGISTERED DEFINITIONS (frozen at the freeze commit)

### (i) THE DELIVERY LABEL

The label is **the body's own `action.type` at the release tick** (BK-C0 §2(c)'s idiom, "the
keeper's own action label at the pre-step boundary", generalised to every body), NOT the
per-side stat ladder. This is a **correction of record** over the pure stat-delta ladder: the
stat ladder collapses a tick on which `passes`, `longBalls` AND `throughBalls` all move into
ONE class, and that combination is not rare. R9 could tolerate it (it only ever needed the
KEEPER's channel); an arc inventory BY DELIVERY TYPE cannot.

Classes: `punt` (LoftedPass while `gkDistributing`) · `loftSwitch` (LoftedPass otherwise) ·
`cross` · `throw` (ThrowOut) · `drivenPass` (Pass) · `clearance` (ClearBall) · `throughLoft` /
`throughGround` (ThroughBall, split by whether the launch had a positive vertical component —
`performThroughBall` dinks or drills and books `throughBalls++` either way) · `otherRelease`.
Shots and headed contacts are **NAMED OUT** and never booked.

**GATED**: `gDeliveryLabelsAgreeWithEngineCounters` proves the labelling against the engine's
OWN final counters, class by class — `longBalls` = punt + loftSwitch + the lofted chips
(`performThroughBall`'s lofted branch books `longBalls++` too: *"a chip is a lofted long ball
too"*), `crosses` = cross, `throughBalls` = throughLoft + throughGround.

### (ii) BLOCKED

**BLOCKED SHORT OF THE TARGET** (the face of record): the flight's first contact with a body
other than the kicker, **before the ball first lands**, where the toucher is **not** the
engine's own `pendingPass.targetGid` **and** his along-line distance is inside `d − shell`. Two
anchored conditions, no taste constant. A delivery that reaches its man and is met there is a
delivery **arriving**, not a block — counting it would make every punt "blocked" and the
pressure signature meaningless. The wide count (`interruptShare_*`, any in-flight contact) is
published beside it.

### (iii) THE POPULATION OF RECORD (the discriminator's denominator)

A chain opened by a GK release (open play), resolved by the releasing keeper owning the ball
again **within the 240-tick window**, classified by R9's ORDERED ladder as **`directCarom`**
(nobody else OWNED it, but another body TOUCHED it) — **restricted to those whose first body
contact happened IN FLIGHT**, before the launch ball ever landed. That restriction is the
user's pattern stated exactly. The excluded remainder is published beside it, as is the
blocked-short subset.

### (iv) AVAILABLE — the counterfactual, exactly

> A **CLEARING HIGHER LINE IS AVAILABLE AT THE SAME TARGET** iff there exists a shipped loft
> family F such that, launching from the SAME point along the SAME direction to the SAME
> landing distance `d`, with
>
> `T_F = clamp(F.tBase + F.tPerM·d, F.tMin, F.tMax)`, `vz = GRAVITY·T_F/2`, `|v| = d/T_F`
>
> (`loftKick`'s own three expressions), **the SHIPPED per-tick integrator** never puts the ball
> below `HEADER_MIN_HEIGHT` on any tick whose along-line position lies inside the first struck
> body's strike surface `[s − shell, s + shell]`, **and** the ball is still in flight when it
> passes `s + shell`.

**Available-but-unchosen ⇒ B. Unavailable ⇒ A.** Four variants are published, all stored:
`shippedDefaults` (the primary) · `familyTMax` (the generous upper bound: the highest line the
shipped ranges can express at all) · `vs the 1.25 m reach surface` (stricter) · the
`continuous` closed-form twin (tick-phase robustness).

## §5 ⚠ THE COUNTERFACTUAL USES THE SHIPPED FLIGHT MODEL — PROVEN, NOT ASSERTED

#329 item 5's ⚠ is binding: *"an idealized ballistic model would answer a different question
and voids the face"*. `replayFlight` is `Match.stepBallPhysics`'s airborne branch transcribed
statement for statement — the Magnus rotation with its own decay and 0.02 cutoff, then
`pos += vel·dt`, then `z += vz·dt`, then `vz -= GRAVITY·dt`, then the landing test. Friction is
absent **on purpose**: the shipped integrator applies `BALL_FRICTION_K` only in the GROUND
branch, so a ball in the air is friction-free and the replay is exact while airborne.

**`gReplayMatchesLive`** compares the replay against LIVE flights, per tick, at sampled kicks:
the probe starts from the engine's own post-step state (no inversion) and CLOSES the moment the
flight stops being a pure free flight (the ball is owned, it has landed, or `lastTouch` has left
the kicker). Max absolute divergence must be < 1e-9 m or the gate is RED.

## §6 THE GATES (frozen; a red gate is REPORTED, never patched)

`gWorld` · `gDoseBytes` · `gAnchoredParams` · `gStrikeSurfaceAnchored` · `gReplayMatchesLive` ·
`gContactLawFires` · `gDeliveryLabelsAgreeWithEngineCounters` · `gDeliveryPartition` ·
`gArcBinsComplete` · `gChainPartition` · `gPopulationNested` · `gCounterfactualMonotone` ·
`gPressurePartition` · `gCeilingNonVacuous` · `gNonVacuous` · `gSrcUntouched` ·
`gSeedsBookedEqualWalked` · `gStatsZero` · `gFaces`.

`gFaces` is the re-derivation gate — CANON, VERBATIM: *"the re-derivation gate covers EVERY
published face; a percentile face requires stored bins"* (home: PC-C0 §CORR item 4). Every
face, every median and every published bin summary is re-derived from the SERIALIZED artifact
off disk. Per-seed cells are stored so every headline re-derives (canon, home #282.2(ii)).

## §7 SEEDS AND STATS

Block **12,514,000–999**, consumed WHOLE of record. 40 battery seeds (12,514,000–039) +
the in-band smoke prefix 12,514,800–802 + the 12,514,999 world-construction receipt.
BOOKED = WALKED.

**STATS CONSUMED: ZERO.** The intervals are bootstrap resamples of the WALKED seeds, not a
registry-consuming statistic (the IN-T0 / DF-T2 / IN-T1 precedent, #329 item 4). The next stats
base remains ≥ **115,200**.

## §8 HONEST LIMITS, STATED BEFORE THE BATTERY

* ⚠ **CLEARED ≠ UNCONTESTED.** Above `HEADER_MIN_HEIGHT` the ball belongs to `tryAerial`, so a
  clearing line trades a body carom for an **aerial duel**. The census never claims a cleared
  line is a completed one.
* ⚠ **THE COUNTERFACTUAL HOLDS DIRECTION AND TARGET FIXED.** It asks *"could the same ball to
  the same man have gone over him"* — not *"was there a better target"*. The second is the
  chooser's question and belongs to the fix slice.
* ⚠ **THE POPULATION IS WINDOW-CENSORED** at 240 ticks (BK-T2's own window, kept so the face
  decomposes the face of record). The uncensored `blockedGkLoft*` faces are published beside it.
* ⚠ A foot clearance that shares a tick with an unrelated headed contact is booked as a headed
  clearance and skipped (the inherited stat-ladder's ordering).

---

# RESULTS

> Freeze `be1eeab` → this commit. **19/19 gates GREEN.** 41 walks (40 battery seeds + the
> construction receipt), **5.4 s wall**. `gFaces` re-derived **70/70** published faces and
> **75/75** bin checks off the serialized artifact, 0 failures.
> `hashedBodySha256 = 0ae35b2fb08d35c0ef3f1c242765f05edf3e19f6deb82ebec54ef20a17c65129`.
> Every number below is quoted from an artifact FIELD (canon: doc-prose fidelity).

## §R1 THE COUNTERFACTUAL IS THE ENGINE'S OWN BALL

`gReplayMatchesLive`: **4,270 per-tick samples**, `max abs diff = 0` metres — the transcribed
integrator reproduces live flights **bit-for-bit**, not to a tolerance. The A-vs-B answer is
therefore computed on the shipped flight model, as #329 item 5 required.

## §R2 (a) THE ARC INVENTORY — the parameterization, anchored

Every constant is extracted from INSIDE its own NAMED `export function` body, positionally off
`loftKick(match, p, target, tBase, tPerM, tMin, tMax, noiseMul, spin?)`. The needle `loftKick(`
occurs **5 times** in `src/sim/mechanics.ts` — 1 declaration + 4 calls, every occurrence
enumerated in the artifact (canon: needle-occurrence counts).

| family | site | tBase | tPerM | tMin | tMax |
|---|---|---|---|---|---|
| punt / loftSwitch | `performLoftedPass` (mechanics.ts:749) | 0.55 | 0.033 | 1.1 | **2.1** |
| throw | `performKeeperThrow` (mechanics.ts:655) | 0.62 | 0.03 | 0.9 | **1.5** |
| cross | `performCross` (mechanics.ts:621) | 0.5 | 0.038 | 0.7 † | **1.7** |
| through-loft (the dink) | `performThroughBall` (mechanics.ts:476) | 0.55 | 0.045 | 0.8 | **2.0** |

† `tMinCross` is not a literal: `const tMinCross = loft ? CROSS_FLIGHT_MIN_S : 0.7;`
(mechanics.ts:582). The world of record flies **`c4Flight = false`**, so the applied value is
**0.7** — read off the built match, never a guessed branch.

**THE WHOLE ARC IS ONE NUMBER.** `loftKick` sets `vz = GRAVITY·T/2` and `|v| = dEff/T`, so
apex `= g·T²/8` and launch angle `= atan(g·T²/(2·dEff))` — **T is the only freedom**, and T is
`clamp(tBase + tPerM·d, tMin, tMax)`. There is no separate loft dial anywhere.

Measured, world-9, 40 seeds (`launchesByDelivery`, mean of the replayed flight):

| delivery | launches | lofted | mean apex (m) | mean angle (°) | mean flight (ticks) | **blocked short** | interrupted |
|---|---|---|---|---|---|---|---|
| **punt** | 33 | 33 | **4.854** | 23.28 | 119.0 | **0.7879** [0.500, 0.957] | 0.9697 |
| loftSwitch | 12 | 12 | 3.108 | 21.42 | 94.7 | 0.3333 [0, 0.733] | 1.0 |
| **cross** | 116 | 116 | 2.102 | 21.60 | 77.9 | **0.7931** [0.698, 0.880] | 0.9741 |
| **throw** | 19 | 19 | 1.864 | 21.02 | 73.3 | **0.0000** [0, 0] | 1.0 |
| through-loft | 101 | 101 | 4.212 | 27.75 | 109.7 | 0.7030 [0.584, 0.816] | 0.9208 |
| clearance | 6 | 6 | 1.115 | 11.95 | 56.8 | 0.1667 [0, 0.600] | 0.3333 |
| driven pass | 2,737 | 0 | — | — | — | 0.0015 [0.0003, 0.0029] | 0.0307 |
| through-ground | 215 | 0 | — | — | — | 0.0000 | 0.0047 |
| otherRelease | 114 | 0 | — | — | — | 0.0000 | 0.0263 |

⭐ **THE CLEARANCE IS NOT A `loftKick` AT ALL** — `performClear` calls `kickBall` with a DRAWN
vertical launch `match.rng.range(3.2, 5.4)` (mechanics.ts:1652), so its apex is `vz²/2g`,
independent of range. It is the flattest thing in the air (11.95°).
⭐ **A DRIVEN PASS HAS APEX 0 BY CONSTRUCTION** (`kickBall`'s `loft` defaults to 0 and sets
`ball.z = 0`), so **no arc can ever clear a body in front of a ground pass** — that half of the
contact law's cost is outside both hypotheses, and it is stated here because it bounds what any
fix can recover (§R7).

## §R3 (a) THE PHYSICS CEILING — hypothesis A, answered exactly

The strike surface, both halves anchored:
* **height** — `const aerialOnly = this.bkContactLaw ? ball.z >= HEADER_MIN_HEIGHT : …`
  (Match.ts:3949, 1 occurrence). ARMED, the ENTIRE ground channel runs at `z < 1.35 m`.
* **shell** — `const shell = p.coreRadius + ball.radius;` (Match.ts:5072, 1 occurrence)
  = **0.635 m**. The reach twin is `CONTROL_RADIUS` = 1.25 m.

The closed form, re-derivable by hand: `x_clear = (d/2)·(1 − sqrt(1 − h/apex))` with
`apex = g·T²/8`, `h = 1.35` — the along-line distance at which the ball first reaches head
height. A body whose near shell edge sits inside `x_clear` cannot be cleared by that family at
that target.

**THE SMALLEST PRESSER DISTANCE ANY SHIPPED FAMILY CAN CLEAR**, by target distance
(`minClearablePresserByTarget`, computed with the shipped per-tick integrator):

| target | 8 m | 12 m | 16 m | 20 m | 24 m | 30 m | 36 m | 42 m | 48 m | 54 m |
|---|---|---|---|---|---|---|---|---|---|---|
| min clearable presser | 1.5 | 1.5 | 2 | 2 | **2.5** | **3** | 3 | 3.5 | 4 | **4.5** |

**THE ANSWER TO THE USER'S QUESTION.** At the ranges he described — a presser at 2–10 m — the
shipped parameterization **CAN** clear a standing body over most of the band, and **CANNOT** at
point-blank: for a genuine long delivery (24 m+) the ball needs **2.5–4.5 m of run-up** before
it reaches head height. The punt's own row shows why the ceiling is not the lever it looks
like: at `d = 48` the default flight is ALREADY at the cap (`T = 2.1`, apex 5.408 m), so
`x_clear = 3.21 m` **is** the tMax value — there is no headroom left to spend at exactly the
range the keeper punts.

**⭐⭐ THE REAL CAPABILITY GAP IS NOT THE ARC — IT IS THE RELEASE HEIGHT.** `Match.kickBall`
sets `ball.z = 0` on **every** kick, so a keeper's punt from his hands launches off the grass.
That is why raising T cannot rescue the point-blank band: the ball must climb 1.35 m from zero
no matter how high it eventually goes. Stated as a MEASURED OBSERVATION, not a proposal.

## §R4 (b) THE A-vs-B DISCRIMINATOR — **B**

The population of record (`discriminator.counts`): **374 GK releases** → 22 `directCarom`
returns within the 240-tick window → **15** whose first body contact happened IN FLIGHT (all 15
also blocked short of target); 7 excluded because the contact came after landing. The parent
family rates: `distributionFamilyWithin240PerGkRelease` = **0.074866** [0.0445, 0.1099],
`directCaromWithin240PerGkRelease` = **0.058824**, and the user's exact pattern
`caromShareOfGkReleases` = **0.040107** [0.0192, 0.0677] — **about 1 keeper release in 25**.

| face | value | 95 % CI | n |
|---|---|---|---|
| **`caromClearingLineAvailableShare`** | **0.800000** | [0.4737, 1.0000] | 12/15 |
| `caromClearingLineAvailableAtFamilyTMaxShare` | **0.800000** | [0.4737, 1.0000] | 12/15 |
| `caromClearingLineAvailableVsReachSurfaceShare` | 0.533333 | [0.2000, 0.7857] | 8/15 |
| `caromClearingLineAvailableContinuousShare` | 0.800000 | [0.4737, 1.0000] | 12/15 |
| **`blockedGkLoftAvailableShare`** (uncensored) | **0.859375** | [0.7391, 0.9494] | 55/64 |
| `blockedGkLoftAvailableAtFamilyTMaxShare` | **0.859375** | [0.7391, 0.9494] | 55/64 |

**THE VERDICT: B (PRICING) CARRIES IT.** On the uncensored population — 64 blocked GK lofted
launches, the denominator-stable face — **85.9 %** had a clearing higher line available at the
same target within the shipped parameterization, CI strictly above 0.73. The window-censored
population of record agrees at 80 % on n = 15 (a wide interval, honestly reported; it is the
same story at a fifteenth of the sample).

⭐⭐ **AND THE CEILING BUYS EXACTLY NOTHING ON THIS POPULATION.** `familyTMax` — every family
allowed the highest line its ranges can express — flips **ZERO** additional cases: 55/64 and
12/15 either way. The code-derived table (§R3) shows tMax *does* help at SHORT targets
(punt `x_clear` 2.80 → 0.54 m at d = 8), so this is not a degenerate test — it is a measured
statement that at the ranges keepers actually launch, the extra ceiling is already spent. **The
~14 % residual is hypothesis A, and hypothesis A's own remedy does not recover it**: those are
bodies inside the climb-out distance, and the only thing that clears them is not launching into
them.

The struck body's along-line distance (`struckBodyAlongLineDistance`, 2 m bins,
**median 4 m**): `[20, 31, 51, 8, 17, 13, 4, 32, 13, 9]` — 20 of 198 blocked launches met their
first body inside 2 m, and 51 in the 4–6 m bin. The geometry matches the ceiling table exactly.

## §R5 (c) THE PRESSURE SIGNATURE — **FLAT-TO-INVERTED: blind launching**

#328's own reading: *"block rate should RISE with pressure … flat-in-pressure = blind
launching"*. Presser distance = nearest opponent to the KICKER at launch, 2 m bins.

**GK** (blocked/launches, rate): 0–2 m **2/22 = 0.091** · 2–4 m 0/8 = 0 · 4–6 m 1/8 = 0.125 ·
6–8 m **56/153 = 0.366** · 8–10 m 5/51 = 0.098 · 10–12 m 0/26 = 0 · 12–14 m 0/29 = 0 ·
14 m+ 1/77 = 0.013.

**OUTFIELD**: 0–2 m **10/1476 = 0.0068** · 2–4 m 18/887 = 0.0203 · 4–6 m 17/190 = 0.0895 ·
6–8 m 9/158 = 0.0570 · 8–10 m **79/241 = 0.3278** · 10 m+ 0/27 = 0.

**THE SIGNATURE IS NOT THE REALISTIC ONE.** Block rate does not rise as the presser closes; the
GK curve peaks in the **6–8 m** bin and is near zero at 10 m+ AND at 2–4 m, and the outfield
curve rises *with distance* to a peak at 8–10 m. By #328's own criterion this is **blind
launching**, not error-under-pressure.

⚠ **THE CONFOUND, NAMED**: the presser bin is measured at the KICKER, while a block is a body
**en route**. Long deliveries are chosen when nobody is near the kicker and then cross a pitch
full of bodies, so delivery RANGE loads the far bins. The census does not de-confound it (that
needs a per-corridor instrument the fix slice will have anyway). What survives the confound is
the negative: **there is no rising-with-pressure limb anywhere in either curve**, which is what
the frozen question asked.

## §R6 (d) THE ORACLE SURFACE — where a price would go, and what it would consume

Every site pinned by an anchored needle with its occurrence count and line receipt
(`oracleSurface` in the artifact).

⭐⭐ **THE PRICING GAP IS ONE STATEMENT.** The punt's entire score
(**PlayerBrain.ts:1122**, 1 occurrence) is
`(0.2 + closed · 0.55) · (1.4 − (passBias + riskTolerance) · 0.6) · (0.7 + puntFit · 0.45)` —
**there is no lane, corridor or body term in it at all**. Its target picker
(**PlayerBrain.ts:1113**) is `strength · 0.5 + forward-gain · 0.6`. The punt prices bodies at
**ZERO**, exactly as the contract's §0 said in prose; this census pins it to the statement.

Beside it, the same file's other two releases DO price a corridor:
* the hand **throw** (**PlayerBrain.ts:1095**):
  `sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7` — and the
  throw is the ONE delivery blocked short **0/19** in this battery.
  ⚠ CONFOUNDED BY RANGE (the throw is 8–30 m and flies 73 ticks); reported as a MEASUREMENT
  beside the code fact, never as a causal claim.
* the open-play **loft switch** (**PlayerBrain.ts:689**, the `airLane` read itself at
  **:425**): `sL = (loftBase + open · loftOpenW) * airLane` — blocked short
  0.333, the lowest of the three long deliveries.

**WHAT A CORRIDOR-HAZARD PRICE WOULD CONSUME (all already shipped):**
1. `airLaneOpenness(from, opponents)` (perception.ts:131) — the loft's existing corridor sense,
   and already the wrong shape: it reads **distance from the kicker only**. No direction (it
   cannot tell a body on the line from a body behind you) and **no height** (it cannot tell a
   ball that flies over him from one that hits him).
2. `laneOpenness(from, to, opponents)` (perception.ts:143) — the directional ground read
   (closest point on segment, `worst = min`): the aggregation idiom any corridor price inherits.
3. ⭐⭐ **`flightExposure(from, aim, opponents)`** (deliveryValueSeat.ts:181) — the DV seat's
   own **time-aware, directional** corridor price, already shipped and already gene-weighted
   through `deliveryRiskPrice` (deliveryValueSeat.ts:243) with a born-absent weight and an
   IEEE-exact zero point. It prices closing speed over the flight — and it is still purely 2-D.
   **The cheapest honest corridor-hazard price is this function plus the trajectory's own
   height at each body**, which is `g·T²/8`-shaped arithmetic the engine already writes
   (`CROSS_FLIGHT_MIN_S` is derived from exactly that identity).
4. the strike surface's own geometry — the shell and the 1.35 m edge (§R3), so the price asks
   the same question the contact law will answer.

**THE λ_LIN IDIOM** applies twice: a CEILING fix caps at the family's own expressible region
(tMax is the edge — no new constant); a PRICING fix caps at `flightExposure`'s own [0, 1] range
and rides `deliveryRiskPrice`'s born-absent gene, so a zero-weight world prices
byte-identically.

**PERF BOUND** (`docs/perf/baseline.json`, bytes hashed
`192ed948…bd3a`): head **5.32 µs/step**, p95 9 µs; `decide` = **0.54 µs/step (10 %)**, `ball` =
0.27 µs/step. A corridor-hazard price is a DECIDE-phase cost bounded by arithmetic per body at
a scan the chooser **already makes once per decision** (`airLane`), not a new scan. A ceiling
fix is free (a clamp inside `loftKick`). ⚠ This census is instrument-only and costs the engine
nothing; the numbers above are the baseline artifact's, quoted.

## §R7 (e) THE Q06 LINKAGE — stated as an expectation, never a measured claim

BK-T2's own field, bytes hashed: `ryiQ06PassCompletion` **0.686183 → 0.597493**, Δ **−0.088690**
[−0.095317, −0.081937], 13.26 half-widths. A launch blocked point-blank is an incomplete pass
by the engine's own book-keeping, so the distribution-carom population is one of the mechanisms
paying that bill.

**EXPECTATION (pre-registered; the fix slice measures it, not this census):** a corridor price
(B) should recover a PART of the 8.9 points — the part carried by lofted deliveries chosen into
bodies. It cannot recover all of it: **2,737 driven passes and 215 ground through-balls launch
with apex 0** and are blocked 0.0015 / 0.0000 respectively, but the contact law also taxes
their *reception*; and 92 of 116 crosses are blocked short, which is a wide-play question this
mandate does not open. Neither A nor B is expected to restore Q06 to R-乙's band alone.

## §R8 ⭐⭐ THE DESIGN PICK — **PRICING (B), one slice; the ceiling NAMED OUT by measurement**

**THE PICK: B alone. Not "both".** The census can say that with receipts:

1. **85.9 %** [0.739, 0.949] of blocked GK lofted launches had a clearing line available at the
   same target inside the shipped parameterization. The lines exist; they are never chosen.
2. **Raising the ceiling flips ZERO of them** (55/64 at the family default = 55/64 at tMax).
   Hypothesis A is REAL for the ~14 % residual, but **its own remedy does not address it** —
   those bodies sit inside the ball's climb-out from `z = 0`, and no arc within any
   parameterization clears a man standing 1.5 m in front of a ball on the grass.
3. The pressure signature has **no rising limb**, GK or outfield: the launch is blind, which is
   a pricing statement, not a capability one.
4. The punt's score contains **no corridor term at all**, while the two releases that do carry
   one are the two least-blocked deliveries in the battery.

⛔ **THE PROHIBITION HELD**: nothing here proposes raising the default arc. WHEN to go high
stays a priced, emergent choice.

**SLICE ORDER, honest scope:**

* **SLICE 1 (recommended next, the fix slice this census picks) — THE CORRIDOR HAZARD.** Give
  the LOFTED delivery choosers a directional, **height-aware** corridor price built from
  `flightExposure`'s shipped form plus the trajectory's own `g·T²/8` height at each body,
  composed through `deliveryRiskPrice`'s born-absent gene (zero weight ⇒ byte-identical world).
  The punt gets a corridor term for the first time. **In football language: the keeper looks at
  who is standing in front of him before he hits it, and a coach who values that learns to
  value it.** Scope honestly EXCLUDES: the cross (92/116 blocked is a wide-play question of its
  own), the ground pass (apex 0 — no corridor price can help a ball that cannot go over
  anybody), and the choice of a different TARGET (this census held target fixed on purpose).
* **SLICE 2 (NOT authorized here, flagged as a HYPOTHESIS with its receipt) — THE RELEASE
  HEIGHT.** If the point-blank residual still reads wrong to the user after slice 1, the honest
  capability item is that **`kickBall` sets `ball.z = 0` on every kick**, so a keeper's punt
  from his hands is struck off the grass. That is a substrate capability statement
  (身体做得到的事引擎要做得到) and it moves `x_clear` at point-blank **without touching the
  default arc**. It is named here because the census found it; it is not proposed, because the
  user's mandate is answered by slice 1.

## §DOUBTS (declared, before any adjudication)

1. **n = 15** on the window-censored population of record. The interval [0.474, 1.000] is wide
   and the headline leans on the uncensored 64-launch face. Both are published; neither is
   hidden behind the other.
2. **The pressure signature is confounded by delivery range** (§R5). The negative result
   survives; a positive one would not have.
3. **The throw's 0/19 is confounded by range** (§R6). It is quoted as a measurement standing
   next to a code fact, and the code fact is the load-bearing half.
4. **"Available" holds direction and target fixed.** A chooser that picked a different man
   would have a different, probably larger, set of clearing lines — so 85.9 % is a LOWER bound
   on B.
5. **The foot-clearance exclusion** (§8) means `clearance` n = 6 is small; the headed
   clearances that dominate that stat are outside the delivery inventory by construction.

## §COMMANDER CORRECTIONS OF RECORD (ruling #331, 2026-08-20 — frozen bytes stand)

1. **(verify MED) THE 85.9 % IS EXISTENTIAL OVER THE FOUR LOFT FAMILIES, NOT A
   CHOOSER-AGENCY PROMISE.** The counterfactual replays the launch's own origin/direction/
   landing distance, so it can NEVER be satisfied by the blocked launch's OWN family at
   its own default T (same T ⇒ same trajectory ⇒ the block that happened) — the 55/64
   means A DIFFERENT delivery type's parameterization would have cleared (arithmetically
   the dink dominates the punt below ~47 m), and per-family attribution was not stored.
   The sentence of record is the artifact's own "within the shipped parameterization" —
   never "the keeper could have chosen it at that moment". ORDERED: the fix slice's
   receipts measure PER-FAMILY REACHABILITY (which clearing families the chooser can
   actually instantiate at the moment of launch), so 85.9 % is never read as recoverable
   headroom. The design pick STANDS — its other three legs (zero tMax flips · no rising
   pressure limb · no corridor term on the punt's line) are independent of this framing.
2. **(verify LOW) THE SPIN-0 COUNTERFACTUAL SIMPLIFICATION IS A DECLARED LIMIT OF
   RECORD**: shipped lofted deliveries carry ≤ 0.30 rad/s of Magnus sidespin the replay
   omits; z(t) is spin-invariant and curvature only retards along-line progress, so the
   measured availability is a LOWER bound (~10⁻² m against a 0.635 m shell). Conservative,
   immaterial to 55/64, and now named.
3. **(verify LOW ×2) NAMING CORRECTED OF RECORD**: the flight replay's anchor symbol is
   `Match.stepBall` (src/sim/Match.ts:3762, airborne branch :3905-3921) — the doc/probe
   header's "Match.stepBallPhysics" names a symbol that does not exist (the transcription
   itself was verified statement-for-statement and is faithful). And "the punt prices
   bodies at ZERO" overstates: the punt's `closed` term reads the SHORT alternatives'
   openness — the exact claim, verified needle-by-needle, is **no lane/corridor/flight
   term on the punt's own score or target picker**.
4. **(verify LOW) THE parryRegather RUNG'S DEFINITION WAS EDITED** (per-gid latch vs
   R9's per-chain flag) though the doc claims class-for-class reuse — practically
   equivalent and OUTSIDE the distribution family, so the population of record is
   unaffected; disclosed here so "reused verbatim" is not read wider than it is.
