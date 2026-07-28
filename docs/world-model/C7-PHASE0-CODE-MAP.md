# C7 Phase 0 — Code map: the release interface, and the tick that isn't there

Status: **READ-ONLY REPORT-BACK.** Produced as authorised GAP WORK under
**commander ruling #54.5** (the #29.4 C-track template: Phase-0 code map with
`file:line` evidence before any contract). **Zero code changed, zero probes
run, no flag touched, no test run beyond reading.** Nothing here proposes a
mechanic, prices anything, or ranks its own questions.

Date: 2026-07-28. Anchored at HEAD `14ef42a`.

---

## 0. The one-sentence finding

**Release is a single synchronous statement — the brain's decision *is* the
kick: `perform*` runs on the line the action is assigned (`PlayerBrain.ts:922-
978`) and calls `kickBall` (`Match.ts:1320-1336`), which sets `ball.owner =
null` in the same tick — so there is exactly ZERO time between commitment and
contact, and no state in which a kick is committed-but-unstruck for anything to
read, charge down, or cancel.** The wind-up seat C7 asks for is therefore a
*hole*, not a value — but the substrate to represent a committed-but-unresolved
window already exists on the mirror (reception) side (`pendingControl`,
`Match.ts:2698-2725`, a real 3-tick delay), so C7's seat is a mirror of a
machine the engine already runs, not a novel one.

---

## 1. The interface: eight paths, one shape, one exit

Every release routes through the decision switch in `PlayerBrain.ts:922-978`.
The switch label is assigned to `p.action` and, on the *same statement*, a
`match.perform*` is called:

| release path | switch line | executor | where it strikes |
| --- | --- | --- | --- |
| Pass (feet) | `929` | `performPass` (`mechanics.ts:354`) | `kickBall` `403` |
| Pass (cutback, corner arc) | `926` | `performCutback` (`mechanics.ts:657`) | `kickBall` |
| Lofted pass / keeper punt | `937` | `performLoftedPass` (`mechanics.ts:723`) | `loftKick`→`kickBall` |
| Cross / corner | `946` | `performCross` (`mechanics.ts:553`) | `loftKick` `608` |
| Keeper throw | `956` | `performKeeperThrow` (`mechanics.ts:634`) | `kickBall` |
| Through ball (+ chip) | `960` | `performThroughBall` (`mechanics.ts:441`) | `kickBall`/`loftKick` |
| Shot | `967` | `performShot` (`mechanics.ts:1157`) | `kickBall` `1270` |
| Free-kick strike | `966` | `performFreeKick` (`mechanics.ts:1335`) | `loftKick` |
| Clearance | `971` | `performClear` (`mechanics.ts:1495`) | `kickBall` `1518` |
| Header (one-touch) | resolved on the ball, not here | `attemptFirstTouch`/aerial paths | separate contact path |

`actionExecutor.ts:454-463` confirms it from the follow-through side — for
`Pass | LoftedPass | ThroughBall | Cross | Shoot | ClearBall` the movement
target is set to `null` with the comment **"Kick already happened at decision
time — brief follow-through."** The executor has nothing to execute because the
brain already struck the ball.

⭐ **`kickBall` is the single ball-leaves-foot statement** (`Match.ts:1320-
1336`): it nulls `ball.owner`, sets `ball.vel`, plants the ball at
`p.pos + dir·0.9`, and stamps `p.kickCooldown = KICK_COOLDOWN`. Every ground
path calls it directly; every aerial path calls it through `loftKick`. There is
no other exit for an owned ball into flight.

**The comment at `PlayerBrain.ts:921` says the quiet part:** *"Kicks resolve
instantly; movement actions persist until next tick."* That is the whole finding
in the code's own words.

---

## 2. ⭐⭐ Wind-up time today: NONE — and the seat where it would live

**No release path has any delay between commit and contact.** The chain is:
`decisionTimer` gates *when the brain runs* (`Match.ts:940`, cadence
`AI_INTERVAL = 0.15 s`, `constants.ts:342`) — but *once it runs*, the switch and
the `perform*`/`kickBall` execute in one synchronous call stack, same tick, same
`stepCount`. Nothing runs between `PlayerBrain.ts:922` and `Match.ts:1323`.

**So the commitment-but-not-released seat does not exist for kicks.** The
question "is there a tick where the body is committed but the ball has not left"
answers **no** — the commit and the release are the same statement.

⭐ **But the engine already runs exactly that shape on the reception side**, and
this is the load-bearing structural fact for C7:

| existing two-phase structure | where | the window |
| --- | --- | --- |
| `pendingControl` (a touch made, control not yet resolved) | set `Match.ts:2698-2703`, resolved `2706-2725` | `readyTick = stepCount + CONTACT_CONTROL_DELAY_TICKS` (`=3`, `constants.ts:265`) = 0.05 s (`DT = 1/60`, `constants.ts:55`) |
| `pendingShot` (ball in flight, awaiting block/keeper) | `mechanics.ts:1035/1142/1304/1411`, read by `tryShotBlock` `1904` | POST-release; the ball is already free |
| `CONTACT_COMMIT_TIME` (a lunge/contact locks the body) | `constants.ts:266` (0.08 s), applied `Match.ts:2687` | reception/contact, NOT kicking (the C5 map's §4 note, still true) |

**`pendingControl` is the precedent.** It is a genuine committed-but-unresolved
window: a body has touched the ball, `kickCooldown` is held, and control does
not resolve until `readyTick` — during which `resolvePendingControlAttempt`
(`2706`) can still fail (`sentOff`, `stunTimer`, or the ball drifted out of
reach at `2717`). A wind-up seat is the *same object on the release side*: a
`pendingKick`-shaped state between the switch (`PlayerBrain.ts:922`) and
`kickBall` (`Match.ts:1320`). The map registers this so C7 knows it is mirroring
a running machine, not inventing a state type.

The C5 map already located this seat and named the missing half exactly (C5-
PHASE0-CODE-MAP.md §4): *"being twisted costs pace and accuracy today, but it
costs no preparation."* The **time** half is the hole.

⚠️ **Line-number drift note:** the C5 map cited the switch at
`PlayerBrain.ts:911-956`. At HEAD `14ef42a` the switch is `922-978` and the
restart run-up (§4) is `899-919`. Same seat, code moved ~11 lines; cite HEAD
numbers going forward.

---

## 3. ⭐ Already priced at release — the inventory (so C7 does not double-charge)

The C6 map's lesson was "the turn was already time-priced (0.48 s); a touch cost
on top double-charges it." The release interface has its own priced terms, and
one of them is the direct analogue of that hazard:

| term | file:line | what it prices | C7 collision risk |
| --- | --- | --- | --- |
| `kickMisalignment` | `mechanics.ts:78` | body↔kick-direction angle `(1−cosθ)/2` | ⚠️ **the accuracy+power half of body orientation is ALREADY here** |
| `orientationPowerMul` | `mechanics.ts:88` | power loss up to −22%, technique recovers | consumed in every `perform*` |
| `orientationNoiseMul` | `mechanics.ts:83` | aim spray from being twisted | consumed in every `perform*` |
| `kickCooldown` / `KICK_COOLDOWN` | set `Match.ts:1331`, const `0.45` (`constants.ts:282`), decays `Player.ts:361` | **POST-release** regather lock; gates all `perform*` via the `kickCooldown > 0` guard | ⚠️ this is *after* the kick, not before — don't conflate with a *pre*-release wind-up |
| `firstTouchWindow` | set `Match.ts:1461-1462` (`0.28`), consumed→0 at `kickBall` `Match.ts:1332`, decays `Player.ts:369` | the one-touch regime trigger (pressure-set, **not chosen** — C5's finding) | any kick "consumes the one-touch window" |
| `oneTouchMul` | `mechanics.ts:263` (`1.15 + (1−dribbling)·0.9`) | first-touch pass/shot/cross accuracy tax; gated by `firstTouchWindow > 0` | the one-touch *price* exists; the *choice* does not (C5 §6) |
| `executedPassPower` (C1-A) | `mechanics.ts:368-370` | intended vs executed power: passer knows body-turn, not the overhit | already an intended≠executed split |
| curl / spin | shots `mechanics.ts:1266-1271`, crosses `607`, through balls | technique-scaled bend, per path | craft already priced on the delivery |
| `touchTimer` | `Player.ts:363`; set `Match.ts:1396` (`0.2`/`0.32`) | dribble-touch **recollect**, not a kick | carry regather; out of the release chain |

⭐ **The one live double-charge hazard: `kickMisalignment`.** Being twisted at
the moment of release *already* costs power (`orientationPowerMul`) and accuracy
(`orientationNoiseMul`), scaled by technique, on every path. A wind-up that
prices "turning your body to strike" as *time* must not re-charge the accuracy/
power that the misalignment terms already take — exactly the C6 turn-glue lesson
transposed to the release seat.

**The one thing that looks like a wind-up today and is not:** the restart run-up
(`PlayerBrain.ts:899-919`). For a dead-ball taker (`mustKick`) the heading is
snapped to face the chosen target *before* the kick — but in the **same tick**,
at zero time cost. Its comment is a banked play-report fix: *"corners arrived
weak and wild while the taker still faced the flag."* It re-orients so the
misalignment terms don't gut dead-ball deliveries; it adds no preparation time.
Open play gets no run-up at all.

---

## 4. What reads the release moment

| reader | file:line | when, relative to release | can it affect a kick IN PROGRESS? |
| --- | --- | --- | --- |
| `tryShotBlock` | `mechanics.ts:1904` | **AFTER** release (`ball.owner === null`, `pendingShot` set); ground-height only (`z > 1.1` clears); one roll per defender, commits `kickCooldown = 0.45` either way | **No** — it intercepts the ball *in flight*, it does not charge down the kick |
| `tryTackles` | `mechanics.ts:1726` | **BEFORE** release — keys on `dist(o.pos, ball.pos) < 1.15`; once the kick fires the ball is gone | **No** — there is no in-progress kick to reach |
| keeper `diveDifficulty` | `mechanics.ts:1276-1281` | **frozen at the moment of the strike** (keeper reaction priced on the chord at contact) | reads the release *instant*, frozen; cannot act earlier |
| `tryDeflection` / leg window | (shots removed from it, `mechanics.ts:1896-1898`, phase 30.4) | post-release | No |

⭐ **Can a defender affect a kick in progress AT ALL today? No.** There is no
tick in which a kick is committed-but-unstruck, so nothing — tackle, block, or
charge — can touch it. `tryShotBlock` is a **post-release in-flight
interception**, not a charge-down of the strike. A charge-down (a body reaching
the ball *between* commit and contact) has no seat because that interval has
zero duration. This is the affordance C7 would create if the wind-up is
interruptible (§7-Q2).

---

## 5. The commitment structure

Once the brain enters the switch at `PlayerBrain.ts:922`, the kick executes
synchronously and cannot be interrupted, cancelled, or read:

1. `mustKick` (restart only) snaps heading to the target — same tick, no cost
   (`899-919`).
2. `p.action = {…}` is assigned and `match.perform*` is called on the next line
   (`922-978`).
3. `perform*` re-checks `ball.owner === passer && kickCooldown === 0` (e.g.
   `mechanics.ts:357`) and calls `kickBall` — `ball.owner = null` (`Match.ts:
   1323`). The ball is now free.

There is **no yield, no future-tick scheduling, no `pending*` on the release
side.** Contrast the reception side, which *does* yield: `pendingControl` holds
a body committed for 3 ticks and can still fail (`Match.ts:2706-2725`). The
release side is atomic; the reception side is staged. C7 is the proposal to make
the release side staged too.

---

## 6. ⚠️ Load-bearing — must not move (the C6 heading-warning genre)

* **`heading`** — shared by the renderer, `kickMisalignment` (`mechanics.ts:78`),
  `backToGoal`, F9 animation, C6's turn geometry, AND the restart run-up
  (`PlayerBrain.ts:899-919`). Both the C5 and C6 maps flag it. A wind-up that
  *re-orients the body over time* touches every one of these. `TURN_RATE`
  (`Player.ts:17`, 6.5 rad/s) and heading semantics are untouchable.
* **`KICK_COOLDOWN = 0.45`** (`constants.ts:282`) — the POST-release regather
  lock. It is not a wind-up and must not be re-tasked as one; a wind-up is a
  *pre*-release delay, a distinct object.
* **The restart run-up** (`PlayerBrain.ts:899-919`) — a banked play-report fix
  ("corners arrived weak and wild while the taker still faced the flag"); do not
  remove when re-seating orientation.
* **C4's cross-flight machinery** (`mechanics.ts:558-608`): the derived
  `CROSS_FLIGHT_MIN_S` floor, `match.c4Flight` / `forcedCrossProfile` seam
  (`567-568`), the phase-31.9 corner key-zone re-route, the phase-63 meetable-
  lead cap. Banked across C4 T1-FLIGHT/T2-ARRIVAL and rulings #31/#32/#37.
* **`executedPassPower` / C1-A** (`mechanics.ts:368-370`) — the intended≠executed
  power split; a play-report-verified banked term.
* **The phase-tagged learned corrections inside every `perform*`** — 31.6 pass
  zip (`d·0.6+8.2`, `mechanics.ts:379`), phase-27 body orientation, phase-37
  curl, the touchline/travel-vs-facing guards in `performDribbleTouch`. These
  carry play-report provenance in-comment; a release rewrite reuses them.

---

## 7. Regimes, sized from banked data only (no probes run)

| quantity | value | source |
| --- | --- | --- |
| median ownership spell | **0.33 s** (mean 0.68 s, ~4.5 decision ticks) | ruling #29.2 / C5-T1 |
| decision cadence | `AI_INTERVAL = 0.15 s` | `constants.ts:342` |
| tick | `DT = 1/60 s ≈ 0.0167 s` | `constants.ts:55` |
| existing committed-window precedent | `CONTACT_CONTROL_DELAY_TICKS = 3` = 0.05 s | `constants.ts:265`, `Match.ts:2700` |
| existing contact-commit lock | `CONTACT_COMMIT_TIME = 0.08 s` | `constants.ts:266`, `Match.ts:2687` |
| post-release regather lock | `KICK_COOLDOWN = 0.45 s` | `constants.ts:282` |
| free-option hazard reference | legacy `×1.3` = releases-to-runner 73% → 49% | EDS-E5H-CLOCK-TWIN.md §"73% → 49%" |

⭐ **Scale caution, cheap to state:** a median spell is 0.33 s and the brain
only re-decides every 0.15 s. A wind-up shorter than one decision tick is
*invisible to the chooser* (the same shape as C5's finding that nobody spends
time on this interface). A wind-up long enough to matter is a large fraction of
the whole spell — which is precisely why (§7-Q7) the watchability blast radius
is the widest of the three time-seats.

---

## 8. Open questions for the commander (questions, not answers)

1. **Which release family is the honest v1 seat?** The eight paths differ by
   volume and watchability: the **shot** is the most watchable and the lowest
   volume; the **feet pass** is by far the highest volume (every 0.33-0.68 s
   spell ends in one) and so the widest blast radius; the **cross** already
   carries a registered C7-family delivery-craft lever (see Q5). Restart kicks
   already have the only run-up in the game.
2. **Is the wind-up TIME, INTERRUPTIBILITY, or both?** A pure *time* cost (a
   few pre-release ticks of a `pendingKick` lock) is invisible unless something
   reads it — it would behave like `KICK_COOLDOWN` moved before the strike, a
   priced delay with no new football. *Interruptibility* (a defender can reach
   the ball in the wind-up window; the kick can be charged down or the
   `pendingKick` cancelled) is where the football lives, but it creates a **new
   attack surface** — the charge-down that §4 shows does not exist today. The
   reception side already runs the interruptible version (`pendingControl` can
   fail mid-window); the release side would mirror it.
3. **Given `kickMisalignment` already prices the accuracy+power half of body
   orientation (§3), does the wind-up add ONLY the time half** — C5 map §4's
   exact framing ("costs pace and accuracy today, but no preparation") — **and
   how is the double-charge on orientation avoided?** This is the C6 turn-glue
   hazard transposed to the release seat.
4. **How does C7 interact with the C5 hold economics?** Ruling #54.4 names C7's
   wind-up the **payoff-side lever** (C6 moved the cost side) and fixes that the
   C5 re-census runs **once, after C7's first slice** lands or is refuted. C5
   map §7-Q5 already framed the mechanical adjacency: a wind-up is "a delay
   between the decision line and `performPass`"; a hold is "a decision not to
   reach that line yet" — one contract could hold both, but the watchability
   blast radii differ sharply (C7 shifts *every* pass and shot; C5 only carriers
   who choose to wait).
5. **How does the first C7 slice relate to C4's flight-profile seat?** Ruling
   #37.3 **registered flight-profile choice as joining the C7 kick-family
   contract** — "a delivery craft option priced by existing evaluators,
   per-cross, pre-kick context" — and the seam already exists in code
   (`match.forcedCrossProfile` / `match.c4Flight`, `mechanics.ts:567-568`;
   ruling #31.4 banked the `peak = g·T²/8` derivation behind it). Is the honest
   first slice this already-registered pre-kick *delivery-craft* option, or a
   fresh *wind-up* (a temporal commit) on the highest-volume path? They are
   different C7 sub-families that share the kick-family contract.
6. **If the wind-up is interruptible, what is the loose-ball / charge-down
   budget?** A charged-down kick is a new loose-ball source with no precedent
   term; the #20 watchability battery and C6's pre-registered scramble-ceiling
   obligation are the references (a free, un-attackable wind-up would be the
   E5h `×1.3` free-option shape all over again — a free option is taken always).
7. **What is the watchability exposure?** A visible wind-up on *every* kick
   changes the whole rhythm of the game, and the user plays on a phone where
   fluency > interruptions (project VISION). Is the honest v1 a wind-up only
   under pressure, only on the highest-leverage strikes, or sub-perceptual by
   design — and which of those is even measurable given the 0.15 s decision
   cadence and 0.33 s median spell?

---

## 9. What this report did not do

* No code changed, no test added, no probe run, no flag touched, no constant
  moved, no fingerprint re-taken.
* It does not propose a mechanic, price anything, rank §8, or choose a release
  family.
* It does not draft the C7 contract — that is the commander's, on this map (the
  #29.4 order).
* It does not re-open C6 (certified end to end, ruling #54.3) or run the parked
  C5 re-census (which #54.4 sequences after C7's first slice).
* It notes but does not resolve the `PlayerBrain.ts` line-number drift from the
  C5 map (§2); the C5 map's `911-956` is now `922-978` at HEAD `14ef42a`.
