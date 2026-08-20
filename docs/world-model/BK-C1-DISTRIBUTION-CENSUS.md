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

*(written after the battery; the freeze commit carries §0–§8 only)*
