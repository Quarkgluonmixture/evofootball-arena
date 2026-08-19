# BK T1 — THE CONTACT LAW (a DORMANT `src/**` seam: the ball stops passing through bodies)

> **Binding contract**: [`BK-BODYBALL-CONTRACT.md`](BK-BODYBALL-CONTRACT.md) §2 **M-BK.2**
> (verbatim: *"flight resolves against body reach through a single lawful channel; the z bands
> must PARTITION (the (1.30, 1.35) gap closes by construction); the M1/M2 oriented-shell
> machinery (`directBallAccess`) is the natural home. The exact solver design is BK-C0's
> OUTPUT, not this contract's pre-commitment."*) + **H-BK.2** (verbatim: *"rolls may keep
> deciding contact QUALITY, never the EXISTENCE of the chance"*). Dispatched by
> **ruling #307 item 4**. The census that measured the disease is
> [`BK-C0-BODYBALL-CENSUS.md`](BK-C0-BODYBALL-CENSUS.md), and its §COMMANDER CORRECTIONS is
> read as its truth of record.
>
> **WHAT THIS STAGE IS**: a dormant seam + its permanent pin suite + **arming RECEIPTS**.
> ⚠ **CANON — receipts ≠ effect sizes** (homes: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md
> §COMMANDER CORRECTIONS item 5, paraphrase): every number in §RESULT is a plumbing receipt.
> **This stage makes NO football claim.** The composition exam is a LATER stage.

---

# §PRE-REGISTRATION (frozen BEFORE any receipt walk — canon freeze-before-battery, home ruling #266.3(c))

## §0 What the census put on the table

BK-C0 §R2 measured 球穿身 and found it is not diffuse — it is **one gate**:

| cause | reach body-ticks | `reachShare` | core body-ticks | `coreShare` |
|---|---|---|---|---|
| `cooldownInvisible` | 185796 | **0.734015** | 48790 | **0.818679** |
| `rollOrClaimOrder` | 13090 | 0.051714 | 110 | 0.001846 |
| `deadBand` | 328 | **0.001296** | 33 | 0.000554 |

and the census's own sentence: *"The contact law's first job is not the dead band — it is the
body that has just kicked and is therefore not there."* Volumes of record:
`visualThroughBodyTicksPerMatch = 119.192` in `visualThroughBodyEpisodesPerMatch = 29.41`;
`reachCrossingEpisodes` = 23.06 per playing sim-minute (§CORR item 4);
`deadBandBallTicksPerMatch = 8.494`.

The gate itself, `collectGroundContactClaims`:

```
if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;
```

⭐ **THE CITATION, PINNED (BK-C0 §CORR item 5's own request).** That line was `Match.ts:4562`
at the census commit `e310401` — **verified**, and it is **`Match.ts:4701` at BK-T1's freeze
HEAD `4a8a0f6`**: 139 lines of drift in two slices, exactly the failure §CORR item 5
predicted. The pin suite therefore asserts the **anchored TEXT and its occurrence COUNT
(exactly 1)**, and reports the line number rather than asserting it — the number is the thing
that drifts (canon: *"a src-extracted constant pins its extraction to the NAMED call site —
anchored match + line receipt — never first-occurrence"*, home BK-C0 §COMMANDER CORRECTIONS
item 1).

## §1 (a) THE COOLING-DOWN BODY — the lawful channel, derived end to end

**The problem stated honestly.** He has just kicked. `KICK_COOLDOWN = 0.45` exists for a
reason the shipped comment states: *"After kicking, a player can't re-capture for this long
(lets passes leave)."* That block on **control** is correct and stays. What is NOT correct is
that he also stops **existing**: the ball flies through his chest.

**THE LAW**: while `bkContactLaw` is armed, a body the shipped filter drops is collected as a
`bodyStrike` claim — an **unintentional contact** — under four conditions, every one of them
read off shipped code:

| condition | why, and where it comes from |
| --- | --- |
| not `sentOff` | he is off the pitch (unchanged, obviously) |
| `kickCooldown > 0 \|\| stunTimer > 0` | exactly the bodies the shipped filter dropped — the seam adds a channel, it does not widen the ordinary one |
| **not** the ball's `lastTouch` | BK-C0 §3(b)'s OWN exclusion (*"the ball sitting inside the boot that just struck it is a self-contact artefact, not 球穿身"*). This is also what preserves `KICK_COOLDOWN`'s stated job — his own pass still leaves |
| ball centre inside **`p.coreRadius + ball.radius`** | ⭐ the engine's own `clearance` expression in `physical.ts`'s `accessLineGeometry` (`const clearance = blockerCoreRadius + ball.radius;`) — the very shell by which this body's core ALREADY BLOCKS another body's access line. **A shell that already stops an access line now also stops the ball.** |

⭐⭐ **WHY THE CORE SHELL AND NOT `CONTROL_RADIUS`.** The 1.25 m reach is a **deliberate
stretch**; a body who has just kicked, or who is picking himself off the floor, makes none. He
does not reach for the ball — the ball hits him. Charging his 1.25 m reach would hand a
cooling body a wider claim than the census ever measured; charging his physical core is the
minimum honest statement of "a body occupies space", and it is the radius BK-C0's **visual**
through-body face (`PLAYER_CORE_RADIUS`, `coreShare` 0.819) was built on — the picture the
user complained about.

**THE CLOSING CONDITION** (the one condition that is neither the filter nor the shell): the
ball must be moving INTO him — `(ball.vel − p.vel) · n < 0` for the body→ball normal `n`. This
is the engine's own M1 rule, stated verbatim at `resolveOverlaps`: *"Remove ONLY closing
relative velocity along the contact normal: tangential motion and already-separating pairs
stay untouched."* It is not a softening of the existence claim — a flight that crosses a body
always closes on him first — and without it the shell **buzzes**: two adjacent cooling bodies
trade a barely-moving ball every tick (measured during construction: 818 strikes/match without
it, 46 with it).

**THE OUTCOME — the DEFLECT family's own, with the existence roll removed.** `tryDeflection`
ends:

```
ball.vel = scale(rotate(norm(ball.vel), match.rng.range(-1.2, 1.2)), match.rng.range(4, 8));
```

The strike reuses **both draws, verbatim**, with two derivations and no new quantity:

1. **the base direction is the contact NORMAL, not the incoming line.** `tryDeflection` rotates
   the incoming direction because a stretched leg meets a ball it *read*; a torso the ball runs
   into sends it back out along `directBallAccess`'s own body→ball normal — the same vector
   `applyControlContact` releases along. The DEFLECT family's ±1.2 rad spread rides on it
   unchanged. Every carom therefore leaves the shell: the anti-pinball half of the design.
2. **a passive body adds no pace**: the drawn 4–8 m/s is CAPPED by the speed the ball arrived
   with, `Math.min(incoming, rng.range(4, 8))`. A ball trickling into a stunned man's shin does
   not fly off at 8 m/s.

⭐ **THE `CONTACT_*` CUSHION WAS BUILT AND REJECTED, and the reason is (a)'s own question.**
`applyControlContact`'s release (`CONTACT_RELEASE_MIN/MAX`, tangential retention) is the
engine's other body-contact model — and it is a **cushion**: it kills a 20 m/s ball to
≤ 1.2 m/s at the feet of the one man who is not allowed to control it, i.e. it hands the
cooling body a perfect trap by the back door. That is precisely the control superpower (a)
forbids, so the DEFLECT carom is the honest home. **No new constant was needed and none was
invented (#200); nothing was escalated.**

**WHAT THE STRIKE DOES NOT DO**: no `pendingControl`, no `attemptFirstTouch`, no `giveBall`,
no `kickCooldown` reset, no `tackleAnimTimer` (that is a deliberate stretch he did not make).
It sets `ball.lastTouch = p` — what a deflection off a body IS in football, the engine's own
record of who touched it last, and the anti-pinball guard (next tick the `lastTouch` exclusion
removes him) — and clears any `pendingControl` (the shipped deflection's own precedent: that
attempt's ball is gone).

## §2 (b) THE STUNNED BODY — pre-registered treatment

Same gate, same channel, **same shell, no reduction**. Real football: a stumbling or grounded
body still occupies space; what he loses is his REACH, not his volume. The design already
encodes exactly that distinction — the strike channel is the **core shell**, never the 1.25 m
reach — so the stunned body and the cooling body need no separate rule: neither may reach,
both are still there. `sentOff` stays excluded. This is stated as a **choice, not an
oversight**: modelling a grounded body as a *lower* shell would need a height model this
engine does not have (the contract's §7 already scopes per-body height out), and inventing a
prone radius would be a taste constant.

Volumes, for scale: BK-C0's `stunned` cause is 3.7 % of reach crossings / 3.0 % of core —
small beside `cooldownInvisible`'s 73.4 %/81.9 %, and it rides free on the same channel.

## §3 (c) THE EXISTENCE / QUALITY SPLIT, made precise

**WHAT CAN NO LONGER HAPPEN** (armed): a ball CLOSING on a body's physical shell, while that
body is excluded from claims solely by kick cooldown or stun, with **no chance of contact at
all**. Existence is decided by geometry and kinematics only — the strike branch in `tryCapture`
contains no roll and cannot `continue`.

**WHICH ROLLS SURVIVE, and what each now decides**:

| roll | site | what it decides now |
| --- | --- | --- |
| `rng.range(-1.2, 1.2)` · `rng.range(4, 8)` | the strike's own outcome | **QUALITY**: which way and how hard the carom leaves. Never whether it happened. |
| the blind/speed contact roll `pContact` | `tryCapture` | QUALITY of a **deliberate control attempt** by a body who is free to make one |
| `pDef` | `tryDeflection` | QUALITY of a **deliberate lane interception** at speed |
| `attemptFirstTouch` | control resolve | QUALITY of the first touch |
| `pClaim` / the aerial argmax / `tryShotBlock`'s readiness | `tryAerial` / `tryShotBlock` | QUALITY of deliberate aerial and blocking acts |

**NAMED OUT OF T1's SCOPE, with the census's own sizes** — stated, not silently half-covered:

* **the blind/speed roll CLASS** (`rollOrClaimOrder`): 5.2 % of reach crossings / **0.18 %** of
  visual through-body ticks. These are DELIBERATE reaches that failed — a quality question,
  and the census says they let the ball pass *near* a body, not *through* it.
* **the one-contact-per-tick ORDER**: the reach-margin mediator still picks ONE claim per tick,
  and a strike claim can be starved by a claim that wins the tick — but that tick still ends in
  a CONTACT, so no through-body event survives it. T1 does not touch the mediator.
* `aboveGkClaim` (11.0 %/8.7 %): a ball above `GK_CLAIM_HEIGHT = 2.55` is out of a standing
  body's reach. **Honest physics, not a partition defect** — untouched, and pinned untouched.
* `aerialBand` (5.4 %): a lawful channel already exists there (`tryAerial`'s argmax duel). A
  different channel is not a missing one.
* `speedAboveControl` (1.1 %): the ball outruns the deliberate claim; the strike channel now
  covers the same body's SHELL regardless of speed, so this class shrinks as a side effect
  rather than as a target.

## §4 (d) THE Z PARTITION — which side absorbs (1.30, 1.35), and why

Shipped, the ground channel runs at `ball.z > CONTROL_MAX_HEIGHT` → aerial (Match.ts, the
`stepBall` dispatch) and `tryAerial` returns at `ball.z < HEADER_MIN_HEIGHT` (mechanics.ts:787).
So z ∈ (1.30, 1.35) reaches **no** channel.

⭐ **THE PARTITION CLOSES ON THE FEET SIDE, AND NO SHIPPED CONSTANT IS EDITED.** Armed, the
dispatch edge is `HEADER_MIN_HEIGHT` on BOTH sides: `ball.z >= HEADER_MIN_HEIGHT` → aerial,
everything below → the ground channel. `tryAerial`'s own floor is the same number, so the two
bands meet exactly and overlap nowhere.

**The reasoning is derived, not taste**, in three steps:

1. **Editing either constant is not available.** `HEADER_MIN_HEIGHT` is load-bearing beyond the
   band — `CROSS_FLIGHT_MIN_S = Math.sqrt((8 * HEADER_MIN_HEIGHT) / GRAVITY)` is written as an
   expression of it, so moving it silently moves cross flight geometry; `CONTROL_MAX_HEIGHT`
   gates two `actionExecutor` decisions (:265, :458). Either edit would also break flags-off
   byte-identity unconditionally. So the flag moves a **dispatch boundary**, not a constant.
2. **Of the two edges, the header floor is the one the engine treats as a physical fact** (it
   has a derived consumer); `CONTROL_MAX_HEIGHT` has none. Widening the feet side to meet the
   header floor changes nothing else in the codebase; narrowing the header side would move the
   derived cross constant's meaning.
3. **Football agrees**: a ball at 1.32 m is thigh/chest height, not a header. The engine says
   so itself — `CHEST_TRAP_MAX_HEIGHT = 1.7` means the body family already lawfully reaches
   1.7 m. The band belongs below.

Size, for honesty: `deadBandBallTicksPerMatch = 8.494` (0.14 sim-s a match), 0.13 % of reach
crossings. **This half rides free by construction; it was never the disease.**

## §5 (e) FLAG SEMANTICS — `bkContactLaw`, and why there is NO refusal

Road B, the house form: an EXPLICIT boolean, never `EDS_BUNDLE_ARMED`, never env-armed, never
bundle-defaulted, **absent from `a4World.ts` entirely** (pinned).

⭐ **THE COMPOSITION RULE, CHOSEN AND STATED.** Unlike `bkFacingLaw` — which EXTENDS the
wind-up channels and is provably inert without one — `bkContactLaw` **owns its own two sites**
(the claim collection and the z dispatch) and reads no other flag. It can therefore change a
tick in **every** world, so:

| composition | behaviour |
| --- | --- |
| `bkContactLaw` false / absent | **byte-identical to today** (dormancy) |
| `bkContactLaw` alone, no other seam armed | **legal** — it is not an extension of anything |
| `{bkFacingLaw, bkContactLaw}` any subset, on the world-8 stack | **legal**, all four cells |
| `bkContactLaw` + `bkFacingLaw` with NEITHER wind-up channel | ⭐ **still REFUSED** — BK-T0's inert-law door, unchanged. The contact law does **not** rescue it. |

**There is no `bkContactLaw` refusal, and that is a claim with a proof**, not an omission: the
PW×PTP class the refusals exist for is "a flag that provably cannot change a tick". This one
provably can — pinned as a signature difference in both world shapes. The pin suite asserts
that **no constructor `throw` in `Match.ts` mentions the flag at all**, and that the two
refusal-adjacent cells behave as the table says.

## §6 (f) THE SEAM MAP — every contact-claim / z-gate site, with occurrence COUNTS

⭐ CANON, VERBATIM: *"a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
occurrence's site"* (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1).
⭐ **PREFIX STATED** (#307 §CORR 3): the needle family is **`bkContact*`** (`bkContactLaw`,
`bkContactLedger`) plus the two named members `bkCollectBodyStrikes` / `bkApplyBodyStrike` and
the claim tag `'bodyStrike'`. Counts are machine-read by the pin suite and fail on drift.

### IN SCOPE — the two sites the law touches (both in `src/sim/Match.ts`)

| needle | count | site | what it does |
| --- | --- | --- | --- |
| `if (this.bkContactLaw) this.bkCollectBodyStrikes(order, claims);` | **1** | end of `collectGroundContactClaims`, AFTER the shipped loop | appends the lawful channel; the shipped filter line is byte-untouched |
| `const aerialOnly = this.bkContactLaw ?` | **1** | the `stepBall` ground/aerial dispatch | the z partition |
| `bkCollectBodyStrikes(` | **2** | 1 call + 1 declaration | — |
| `bkApplyBodyStrike(` | **2** | 1 call (the `tryCapture` branch) + 1 declaration | — |
| `'bodyStrike'` | **3** | the `GroundContactClaim.kind` union · the produce site · the consume branch | — |
| `bkContactLaw` | **10** | config field · readonly field · ctor · 2 seam sites (one line carries it twice) + doc | — |
| `bkContactLedger` | **4** | declaration + 3 write sites | pure bookkeeping; nothing in the sim reads it |

### THE CENSUS'S GATE SITE ITSELF — pinned (the #306 §CORR 5 request)

| needle | count | line at `e310401` | line at freeze HEAD | assertion |
| --- | --- | --- | --- | --- |
| `if (p.sentOff \|\| p.kickCooldown > 0 \|\| p.stunTimer > 0) continue;` | **1** | 4562 (census, verified) | **4701** | text + count asserted; line REPORTED |

### NAMED OUT — every other contact site, with its reason

| needle | count | site | why OUT |
| --- | --- | --- | --- |
| `tryDeflection(` | 1 decl + 1 call | mechanics.ts / `tryCapture` | a DELIBERATE stretch; its roll is a quality roll and stays |
| `tryAerial(` | 1 decl + 1 call | mechanics.ts / `stepBall` | a lawful channel already exists in the aerial band |
| `tryShotBlock(` | 1 decl + 1 call | mechanics.ts / `stepBall` | a deliberate block; its own `kickCooldown = 0.45` is an ACT's commitment, not invisibility |
| `tryKeeperSave(` / `trySmother(` | 1 each | mechanics.ts | keeper acts, deliberate, priced |
| `if (ball.z > GK_CLAIM_HEIGHT) return;` | 1 | mechanics.ts:2147 | honest physics above 2.55 m — not a partition defect |
| `CONTROL_MAX_HEIGHT` in `actionExecutor.ts` | 2 (:265, :458) | the brain's own height reads | DECISION sites, not contact sites; T1 changes no chooser |
| `export const CONTROL_MAX_HEIGHT` / `HEADER_MIN_HEIGHT` | 1 each | constants.ts:184/186 | **not edited** — pinned unedited (§4) |

Nothing outside `src/sim/Match.ts` contains the string `bkContact` (pinned across
`PlayerBrain.ts`, `mechanics.ts`, `Player.ts`, `physical.ts`, `constants.ts`, `a4World.ts`,
`actionExecutor.ts`).

## §7 (g) PERF — the hot core, guarded first

`tryCapture` and `collectGroundContactClaims` run every free-ball tick. **Flag OFF**: the seam
adds exactly **two boolean reads per tick** — one at the end of `collectGroundContactClaims`
(the guard precedes the call, so the new loop is never entered) and one in the `stepBall`
dispatch (a ternary on a readonly field, replacing a comparison that still runs). No allocation,
no new call, no branch inside the shipped per-body loop, which is byte-untouched.

**Flag ON**: one extra pass over the body list per free-ball tick, with the same
cheap-reject ladder the shipped loop uses (|dx|, |dy|, then the sqrt) against a shell **half**
the radius of `CONTROL_RADIUS` — so the reject rate is higher than the shipped loop's, and
`directBallAccess` is called only for bodies that already passed the shell test (during
construction: ~48 claims per 240 s match). Perf is reported as reasoning, not as an A/B; the
production path is flag-OFF and the fingerprint of record is unmoved.

## §8 THE GATES (frozen)

`gWorld` (world 8 + both dose books hashed AS FILE BYTES) · `gDormant` (every SHUT walk books
an all-zero ledger) · `gSeamFires` (armed strikes > 0 — non-vacuity) · `gSeamDistinct` (the
armed world's signature differs, in both world shapes) · `gCooldownShareFalls` (**the law's own
claim**: the `cooldownInvisible` share of reach crossings falls ARMED vs SHUT on the same
seeds) · `gCoreCooldownFalls` (the same at the VISUAL core radius — the picture the user
complained about) · `gDeadBandFalls` (the `deadBand` cause's body-ticks per match fall ARMED) ·
`gPartitionLive` (`partitionGroundTicks` > 0 armed — the band really is being routed) ·
`gNoSuperpower` (**zero** strikes are followed by the striking body owning the ball on the
SAME tick, across every armed walk) · `gLifecycle` (**zero** strikes booked while
`phase !== 'playing'`) · `gDoors` (every door cell built or refused exactly as §5's table says,
3 seeds) · `gDoorInertness` (every `¬bkContactLaw` cell books an all-zero ledger) ·
`gFaces` (every published face re-derived by re-parsing the SERIALIZED artifact off disk) ·
`gSrcUntouched` (`git diff --stat HEAD -- src` AND `git status --porcelain -- src`, both empty
at battery time) · `gSeedsBookedEqualWalked` (checked against the probe's own arithmetic, not
this prose).

⚠ Pre-registered honestly: `gCooldownShareFalls` and friends are **RECEIPTS about plumbing**,
not football effect sizes, and they may come back RED. **A red gate is reported, never
patched** (the BK-T0 precedent, #307 item 2).

## §9 THE RECEIPT PLAN

Instrument:
[`scripts/probes/bk-t1-contact-receipts.ts`](../../scripts/probes/bk-t1-contact-receipts.ts),
frozen in this stage's freeze commit. World: `a4MatchFlags(8)` + `armA4World(m, null, 8,
poolT1DoseCells(L3-T1), poolPcDoseTable(PC-T1))` — the WATCHED world of record.
`bkContactLaw` is the only thing the probe adds.

1. **THE A/B RECEIPT BATTERY** — 40 seeds, each walked TWICE (law armed / law shut), with
   **BK-C0's own through-body instrument definitions reused verbatim in intent**: the free-ball,
   playing-phase, per-tick, per-body sweep; the last-toucher and this-tick's-contact exclusions;
   the two radii (`PLAYER_CORE_RADIUS` visual / `CONTROL_RADIUS` reach); the 7-cause ladder in
   the census's own order; dead-band ball-ticks; cooldown-invisible body-ticks and episodes.
2. **THE DOORS MATRIX (the M-BK.4 composition proof)** — the power set
   `{bkFacingLaw, bkContactLaw}` = 4 cells × 3 seeds = **12 walks** on the FIXED world-8
   CB/L3/PC/C7/O1 composition, PLUS the two refusal-adjacent build cells §5's table implies
   (contact-alone with no wind-up channel ⇒ builds; contact+facing with no wind-up channel ⇒
   refuses), 3 seeds each.
3. **THE LIFECYCLE READ** — the seam carries NO cross-tick state (no window, no arming, nothing
   to survive a whistle), so the lifecycle question is instead: does a strike ever resolve
   outside `playing`? Counted per walk and per cell; frozen at zero.
4. **THE SUPERPOWER READ** — for every strike, whether the striking body owns the ball on that
   tick. Frozen at zero.

## §10 SEED LEDGER (BOOKED = WALKED; block **12,503,000–999**, ruling #307 item 4)

| range | use |
| --- | --- |
| 12,503,000–039 | the A/B battery (40 seeds × 2 walks); **000–003 is the smoke prefix** |
| 12,503,500–502 | the doors matrix (3 seeds × 4 walked cells + 2 build-only cells) |
| 12,503,800–811 | the permanent pin suite's own seeds |
| 12,503,999 | the world-construction receipt |

Stats: **none expected**.

---

# §RESULT

*(appended by the result commit — the freeze above is frozen)*
