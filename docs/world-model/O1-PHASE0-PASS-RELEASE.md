# O1 Phase 0 — THE PASS-RELEASE CODE MAP + THE ABSOLUTE CENSUS

Status: **READ-ONLY INSTRUMENT STEP.** Zero `src/**` (X-SRC-ZERO, HARD).
Nothing armed, no flag touched, no constant moved, nothing shipped (Road B).

Authority: **commander ruling #176** (O1 phase 0 dispatched — the pass-release
code map + census, the C7-PHASE0 + C7-T0 template pair fused into one step) ·
**#175** (the OUTLET CONTRACT drafted, O1 = pass wind-up is the first slice) ·
**#174** (the substrate inventory this stands on) · contract
[`OUTLET-CONTRACT.md`](OUTLET-CONTRACT.md) **§2 O1** (scope), **§3** invariants
(I1 NO FREE TIME · NO DOUBLE-CHARGE · FLAG HYGIENE · EPISTEMIC HONESTY),
**§5** F-O1 fail modes, **§8** (seeds from 12,300,000, a new block family).
Standing rulers: [`TEMPO-CENSUS.md`](TEMPO-CENSUS.md) (the axis-honesty law and
the frozen pressure radius) · [`C7-PHASE0-CODE-MAP.md`](C7-PHASE0-CODE-MAP.md)
and [`C7-T0-SHOT-RELEASE.md`](C7-T0-SHOT-RELEASE.md) (the form this doc follows)
· [`C7-T1-PENDINGKICK.md`](C7-T1-PENDINGKICK.md) (the certified shot seam this
map measures the pass family against).

Date: 2026-08-08. Anchored at HEAD `30f2a7b`.

**This document proposes nothing.** It records where the code is, what the code
already charges, and how large each population is. Which kinds enter O1's first
cut is the commander's freeze on these numbers — no recommendation, ranking, or
preferred cut appears anywhere below. Where a release path is ambiguous it is
labelled **AMBIGUOUS** with its evidence rather than resolved.

---

# PART 1 — THE CODE MAP

## P1.0 The one-sentence finding

**The pass family has NINE distinguishable release kinds but only THREE doors
to the grass** — `kickBall` called directly (`Match.ts:1583`), `kickBall` via
`bentKick` (`mechanics.ts:325-338`), and `kickBall` via `loftKick`
(`mechanics.ts:513-545`) — and **all nine commit at the SAME statement shape as
the certified C7 shot seam**: the decision switch assigns `p.action` and calls
`match.perform*` on the next line (`PlayerBrain.ts:967-1032`, whose own comment
reads *"Kicks resolve instantly"*), so the interposition seam C7 opened at
`PlayerBrain.ts:1019` (`match.armPendingKick`) is structurally available at
every one of them (the nine kinds collapse to **six distinct switch commit
lines** plus one off-switch site) — but the pass family adds three things shots
do not have:
**restart takers share the open-play door** (a pass-family free kick is
`performPass`, not a separate `performFreeKick`), **the one-touch window is
actually populated** (unlike shots, where it was 0.076%), and **`performClear`
prices misalignment with its own bespoke inline formula** instead of the shared
`orientationPowerMul`/`orientationNoiseMul`/`oneTouchMul` chain.

## P1.1 Where each kind's decision commits, and where the ball leaves the foot

Every row: the switch line where the action is committed, the `perform*` that
runs on that same statement, and the exact statement where `ball.owner = null`
(`Match.ts:1586`, inside `kickBall`). The **wind-up seat** column answers
ruling #176's question — could the C7 `armPendingKick` seam serve this kind at
the same door, or does this kind release through a different one.

| kind | decision commits | executor | ball leaves the foot | C7-style seam available at the commit line? |
| --- | --- | --- | --- | --- |
| **shortPass** | `PlayerBrain.ts:969` `case 'Pass'` → `975` | `performPass` (`mechanics.ts:354`) | `kickBall` `mechanics.ts:403` → `Match.ts:1586` | ✅ **YES, same seam shape.** One `perform*` call on the commit line, exactly the `PlayerBrain.ts:1019-1020` fork's shape |
| **cutback** | `PlayerBrain.ts:969` `case 'Pass'` → `972` (the `top === cutbackCand` branch) | `performCutback` (`mechanics.ts:657`) | `kickBall` `mechanics.ts:678` | ✅ YES — but it is a **sub-branch of the SAME `case 'Pass'`**, so a seam placed at `case 'Pass'` catches both kinds unless the branch is split |
| **throughGround** | `PlayerBrain.ts:1004` `case 'ThroughBall'` → `1006` | `performThroughBall` ground branch (`mechanics.ts:465-493`) | `bentKick` `mechanics.ts:492` → `kickBall` `327` (spin 0) or `336` (bent) | ✅ YES at the commit line. ⚠ the ground/chip fork is INSIDE `performThroughBall` (`lofted` param, `mechanics.ts:458`), decided by the brain's `bestThroughChip`, so both kinds enter through one commit statement |
| **throughChip** | `PlayerBrain.ts:1004` → `1006` (`bestThroughChip = true`) | `performThroughBall` lofted branch (`mechanics.ts:458-464`) | `loftKick` `mechanics.ts:463` → `kickBall` `543` | ✅ YES, same commit line as throughGround (see above) |
| **cross** | `PlayerBrain.ts:986` `case 'Cross'` → `992` | `performCross` (`mechanics.ts:553`) | `loftKick` `mechanics.ts:608` → `kickBall` `543` | ✅ YES. ⚠ this commit line also carries the **corner routine** (`kickKind === 'corner'`, the key-zone re-route `PlayerBrain.ts:994-997`) — the census shows crosses are overwhelmingly corners |
| **loftedPass** (the switch/diagonal) | `PlayerBrain.ts:978` `case 'LoftedPass'` → `983` | `performLoftedPass` (`mechanics.ts:723`) | `loftKick` `mechanics.ts:736` → `kickBall` `543` | ✅ YES |
| **keeperPunt** | `PlayerBrain.ts:978` `case 'LoftedPass'` → `983` (`top === puntCand`, `PlayerBrain.ts:981`) | `performLoftedPass` — the **same function** | `loftKick` → `kickBall` `543` | ✅ YES, but **indistinguishable at the commit line from loftedPass** except by `top === puntCand`; in code they are ONE door. Separated in the census by `role === 'GK' && gkDistributing` |
| **keeperThrow** | `PlayerBrain.ts:1000` `case 'ThrowOut'` → `1002` | `performKeeperThrow` (`mechanics.ts:634`) | `loftKick` `mechanics.ts:642` → `kickBall` `543` | ⚠ **AMBIGUOUS AS A KICK.** The code's own comment calls it *"an ACCURATE hand distribution"* / *"a thrown ball"* (`mechanics.ts:628-633, 639-641`) — football-wise a keeper THROW is not a kick, yet mechanically it goes through `loftKick` → `kickBall` and therefore pays every kick price and consumes the one-touch window. Recorded as AMBIGUOUS: the seam exists, whether a *throw* should have a *kick* wind-up is not this doc's call |
| **clearance** | `PlayerBrain.ts:1022` `case 'ClearBall'` → `1024` | `performClear` (`mechanics.ts:1495`) | `kickBall` `mechanics.ts:1509` | ✅ YES at the commit line, ⚠ but see P1.4 — clearance is the ONE kind that does **not** consume the shared orientation/one-touch price chain |

### The two release sites OUTSIDE the switch

| site | what it is | evidence |
| --- | --- | --- |
| **the kickoff pass** | `PlayerBrain.ts:160` calls `match.performPass(p, back)` and `return`s — a **second, independent shortPass commit line** that never reaches the switch. Heading is snapped to the target first (`151-154`), same tick, zero cost | `PlayerBrain.ts:135-162` |
| **the penalty** | `PlayerBrain.ts:110-113` — `performShot`, a shot, not pass-family. Recorded only so the seam inventory is complete | `PlayerBrain.ts:110` |

⭐ **A wind-up interposed at `case 'Pass'` alone would miss the kickoff pass.**
The census measures the kickoff population (§P2.6) so the gap is sized, not
guessed.

### The three doors to the grass

| door | file:line | which kinds |
| --- | --- | --- |
| `kickBall` **direct** | `mechanics.ts:403` (shortPass) · `678` (cutback) · `1509` (clearance) | 3 |
| `bentKick` → `kickBall` | `mechanics.ts:325-338` (`kickBall` at `327` unbent / `336` bent) | throughGround only |
| `loftKick` → `kickBall` | `mechanics.ts:513-545`, the strike at `543` | throughChip · cross · loftedPass · keeperPunt · keeperThrow |

⭐ **`loftKick` is pass-family-EXCLUSIVE at HEAD.** Its four call sites are
`mechanics.ts:463, 608, 642, 736` — no shot path reaches it (`performShot`
strikes at `1270`, `tryChip` at `1127`, `performFreeKick` at `1395`, all
`kickBall`-direct). So `loftKick` is a real shared interposition surface for
five of the nine kinds, with **no shot contamination**.

⭐ **`kickBall` (`Match.ts:1583-1599`) is still the single ball-leaves-foot
statement** for every kind: it nulls `ball.owner` (`1586`), stamps
`kickCooldown = KICK_COOLDOWN` (`1594`) and **zeroes `firstTouchWindow`**
(`1595`, *"any kick consumes the one-touch window"*).

## P1.2 Wind-up time today: NONE on any pass path — and the C7 precedent

`decisionTimer` gates *when* the brain runs (`Match.ts:1184`, re-armed to
`AI_INTERVAL = 0.15 s` at `1199`), but once it runs the switch and the
`perform*`/`kickBall` execute in one synchronous call stack — the same finding
the C7 map recorded for shots, verified unchanged for all nine pass kinds. The
census measures this directly: the **E-ABORT** class counts commits whose
`perform*` guard returned without a kick (§P2.7).

The C7 machinery, and exactly what transfers:

| C7 object | file:line | state at HEAD | transfers to passes? |
| --- | --- | --- | --- |
| the fork point | `PlayerBrain.ts:1013-1020` — `else if (match.c7Windup) match.armPendingKick(p, goal)` | shots only, `c7Windup` OFF in production (`Match.ts:996`) | **the SHAPE transfers** — a one-line fork on the commit statement, at each of the six distinct pass commit lines (P1.1); `keeperThrow`'s status as a kick is recorded AMBIGUOUS, not resolved |
| `armPendingKick` | `Match.ts:1828-1849` | reads only `|v|`, `|ω|` (via the c6 heading ring) and `dribbling`; sets `pendingKick` and `faceTarget` | **the mechanism transfers**; the AIM is `goal` for shots — a pass aim is a moving mate/lead point computed INSIDE `perform*`, not available at the commit line for most kinds (`lead` is built at `mechanics.ts:374, 460/472, 576-598, 638, 663, 732`) ⇒ **an aim-shaped mismatch, recorded** |
| `resolvePendingKick` | `Match.ts:1861-1873`, called at `Match.ts:1139` (head of tick, before brains/physics) | re-checks `phase`/owner/`sentOff`/`stunTimer`/`kickCooldown`, then `performShot` | the resolve-site transfers; the strike call would have to fan out to nine `perform*` and re-derive the target |
| the **single-slot** `pendingKick` | `Match.ts:564` — one nullable slot for the whole match | sufficient for shots (only the ball owner can arm) | ⚠ **TRAP** — `armPendingKick` overwrites the slot unconditionally (`1844`), and `resolvePendingKick` nulls it at `readyTick` even when it does not strike (`1864` then the `1868-1871` bail). At ~9 shots/match a collision is unreachable; at the pass volumes in §P2 it is not |
| the re-decide lock | `PlayerBrain.ts:38-47` | a winding-up body cannot re-decide **while it still owns the ball** | transfers verbatim; note the lock is gated on `match.c7Windup`, so it is inert for a pass seam unless that flag (or a new explicit one — FLAG HYGIENE) gates the pass seam too |
| the executor hold | `actionExecutor.ts:1077-1084` | plants the body (`speedF = 0.22`) and drives `faceTarget` to the aim during the window | transfers; note the ordinary kick follow-through case (`actionExecutor.ts:470-479`, *"Kick already happened at decision time"*) covers `Pass \| LoftedPass \| ThroughBall \| Cross \| Shoot \| ClearBall` — **`ThrowOut` has no case at all** and falls through on the initialised `target = null` (`actionExecutor.ts:96`) |
| the W law | `Match.ts:131-152` (`c7WindupTicks`, MID bracket: base 0.06, move 0.05, turn 0.05, tech 0.05, floor 0.05, cap 0.18, clamped to 3–11 ticks) | frozen, certified for shots | the FUNCTION transfers unchanged (it reads only the body); whether its constants suit ~10× the volume is a scope question the census sizes, not this map |

The reception-side precedent the C7 map named is unchanged, at HEAD lines:
`pendingControl` is declared `Match.ts:799`, **set** at `Match.ts:3020-3025`
(`readyTick = stepCount + CONTACT_CONTROL_DELAY_TICKS`), **resolved** at
`Match.ts:3028-3045` (called from `3050`) where it can still fail
(`sentOff`/`stunTimer`/the ball drifted out of reach), and **cleared** by
`kickBall` itself (`Match.ts:1585`). Constants:
`CONTACT_CONTROL_DELAY_TICKS = 3` (`constants.ts:265`) and
`CONTACT_COMMIT_TIME = 0.08` (`constants.ts:266`).

## P1.3 ⭐ THE ONE-TOUCH BYPASS SURFACES — every read of `firstTouchWindow`

The contract (§2 O1) names the one-touch window as **the DESIGNED bypass**.
This is the complete inventory of every place the field is written or read in
`src/**`.

| # | site | file:line | what it does |
| --- | --- | --- | --- |
| W1 | **set** — the pressured reception | `Match.ts:1709-1726`: gated on `!inShootingRange && role !== 'GK' && gid === pass.targetGid`, trigger `3.0 + team.genome.tempo · 1.5` m (3.0–4.5 m), sets `decisionTimer = 0.07` **and** `firstTouchWindow = 0.28` | the ONLY production writer of a non-zero window. **Pressure-GRANTED, not chosen** (the C5 finding, still true) |
| W2 | set — the C5 elected branch | `Match.ts:1717-1722` (`elected = this.c5TouchFork && this.forcedTouchFork === p.gid`) | dormant: `forcedTouchFork` null in every production path |
| W3 | **consumed** | `Match.ts:1595` inside `kickBall` — `p.firstTouchWindow = 0` | **any** kick consumes it, on all nine kinds and on shots |
| W4 | decay | `Player.ts:369`, inside `physicsStep` (`Player.ts:270`) — `max(0, w − dt)` | 0.28 s ≈ 17 ticks of life |
| W5 | reset | `Player.ts:258` (sub-on/reset path) · `Player.ts:398` (`resetForKickoff`) | housekeeping |
| R1 | **read → price** | `mechanics.ts:263-264` `oneTouchMul` = `w > 0 ? 1.15 + (1 − dribbling)·0.9 : 1` | the accuracy tax. Consumed at `mechanics.ts:391` (shortPass), `487` (throughGround), `530` + `535` (`loftKick` — cross · throughChip · loftedPass · keeperPunt · **keeperThrow**), `674` (cutback) |
| R2 | read → telemetry | `mechanics.ts:395` (shortPass) · `447` (throughBall, *"read before any kick consumes it"*) · `599` (cross) · `676` (cutback) · `733` (loftedPass) | the `oneTouch` local that increments `team.stats.oneTouch` (`404-405`, `496`, `623`, `681`, `739`) |
| R3 | read → **gate** | `PlayerBrain.ts:837` — the C5-T2 whether-seat requires `p.firstTouchWindow <= 0` | dormant (`whetherEye` null in production) |
| R4 | read → snapshot | `rendezvousRecovery.ts:51/169/202` | save/restore plumbing, not a decision |

### What the window currently changes, per kind

| kind | pays `oneTouchMul`? | counted in `stats.oneTouch`? | anything else? |
| --- | --- | --- | --- |
| shortPass | ✅ `mechanics.ts:391` | ✅ `405` | — |
| cutback | ✅ `674` | ✅ `681` | — |
| throughGround | ✅ `487` | ✅ `496` | — |
| throughChip | ✅ via `loftKick` `530`+`535` | ✅ `496` | the range error at `535` is ALSO scaled by `oneTouchMul` — the aerial kinds pay the tax **twice within loftKick** (direction + range) |
| cross | ✅ via `loftKick` | ✅ `623` | as above |
| loftedPass | ✅ via `loftKick` | ✅ `739` | as above |
| keeperPunt | ✅ via `loftKick` | ✅ `739` (same statement) | as above |
| **keeperThrow** | ✅ via `loftKick` | ❌ **no `oneTouch` increment** (`mechanics.ts:634-646` has none) | ⚠ **asymmetry**: a "throw" pays the one-touch KICK tax but is invisible to the counter |
| **clearance** | ❌ **never calls `oneTouchMul`** (`mechanics.ts:1495-1516`) | ❌ no increment | ⚠ **the window is CONSUMED (`Match.ts:1595`) but never PRICED** on this kind |

⭐ **The bypass is not uniform today.** Seven kinds pay the one-touch accuracy
tax and are counted; keeperThrow pays and is uncounted; clearance neither pays
nor is counted while still consuming the window. Any O1 rule of the form "a
one-touch release skips the wind-up at its existing accuracy price" has **no
existing accuracy price on clearance**.

## P1.4 ⭐⭐ THE DOUBLE-CHARGE SURFACES — the explicit NO-TOUCH list

Contract §3: *"the accuracy/power half of hurry already exists on every kick
path (`kickMisalignment`, `oneTouchMul`); O1 prices TIME only."* This is the
per-kind ledger of what already fires, so O1's time-only rule has the list in
front of it.

The shared chain (`mechanics.ts:78-88`):
`misalign(x) = (1 − cos x)/2` (78) · `noiseMul = 1 + m·(0.9 − tec·0.6)` (83) ·
`powerMul = 1 − m·0.22·(1 − tec·0.4)` (88). **The pass family passes `passing`
as `tec`; the shot family passes `dribbling`** (`mechanics.ts:1259/1268` vs
`364/392` etc.) — a recorded asymmetry, not a defect.

| kind | `kickMisalignment` | `orientationPowerMul` | `orientationNoiseMul` | `oneTouchMul` | other prices already on this path |
| --- | --- | --- | --- | --- | --- |
| shortPass | `363` | `364` (`passing`) | `392` | `391` | `executedPassPower` intended≠executed (`347-352`, consumed `370`); pressure spray (`383, 387`); `passBias`, `confidence`, `passing` (`388-390`) |
| cutback | `660` | `661` | `675` | `674` | pressure spray (`666, 670`); same team/attr terms (`671-673`) |
| throughGround | `451` | `452` | `488` | `487` | pressure spray (`479, 483`); `groundBend` weight error (`bentKick` `335`, scaled by whip and `1.35 − passing`) |
| throughChip | `451` (computed; the strike's own is `loftKick` `521`) | `loftKick` `534` | `loftKick` `531` | `loftKick` `530` **and** `535` (range) | `aerialSwing` (`462`, `699-721`); the loft range error (`535`) |
| cross | `loftKick` `521` | `loftKick` `534` | `loftKick` `531` | `530` + `535` | the inswinger spin (`607`, `passing`-scaled); C4 flight floor (`569`, `CROSS_FLIGHT_MIN_S`); lead cap (`585-588`) |
| loftedPass | `loftKick` `521` | `534` | `531` | `530` + `535` | `aerialSwing` (`735`) |
| keeperPunt | as loftedPass (same function) | ✔ | ✔ | ✔ | as loftedPass |
| keeperThrow | `loftKick` `521` | `534` | `531` | `530` + `535` | `noiseMul` argument 0.45 — **half a kicked ball's spray** (`642`) |
| **clearance** | ⚠ **BESPOKE**: `mechanics.ts:1512` uses `kickMisalignment` inline as `23 · (1 − misalign·0.15·(1 − passing·0.4))` | ❌ not called | ❌ not called | ❌ not called | fixed lateral scatter (`1502`), a flat `rng.gaussian()·0.08` aim spray (`1504`), `rng.range(3.2, 5.4)` loft (`1513`), and `kickCooldown = 0.3` (`1528`) instead of `KICK_COOLDOWN`'s 0.45 |

### ⚠ THE NO-TOUCH LIST (what O1 must not re-charge)

1. **Body orientation** — `kickMisalignment` + `orientationPowerMul` +
   `orientationNoiseMul` already take the accuracy AND power half of "struck
   while twisted" on eight of nine kinds (and a bespoke variant on the ninth).
   This is the C6 turn-glue lesson at the release seat.
2. **Hurry** — `oneTouchMul` already prices first-time release on eight of nine
   (twice over inside `loftKick`: direction at `530` and range at `535`).
3. **Pressure** — every ground kind already multiplies aim noise by
   `pressureAt` (`mechanics.ts:387, 483, 670`) and every aerial kind by
   `loftKick:526`. A pressure-scaled O1 term would be a third charge on the
   same state.
4. **Weight/execution** — `executedPassPower` (`347-352`), the `bentKick`
   weight error (`335`), the `loftKick` range error (`535`).
5. **Post-release regather** — `KICK_COOLDOWN = 0.45` (`constants.ts:282`, set
   `Match.ts:1594`); clearance's own `0.3` (`mechanics.ts:1528`). These are
   AFTER the kick and are not wind-ups.
6. **Craft/spin** — the inswinger (`607`), `aerialSwing` (`699-721`),
   `groundBend` (`288-321`).

## P1.5 The interruption / maintenance surfaces

| surface | file:line | what it does today | what transfers to a pass wind-up |
| --- | --- | --- | --- |
| `kickCooldown` | set `Match.ts:1594` (0.45), `mechanics.ts:1528` (clearance 0.3), decays `Player.ts:361` | **POST**-release lock; every `perform*` opens with `if (owner !== p \|\| p.kickCooldown > 0) return` (`mechanics.ts:357, 444, 556, 635, 658, 724, 1496`) | it is the ABORT channel: the same guard is what `resolvePendingKick` re-checks (`Match.ts:1870`). A contact that stamps `kickCooldown` inside a window kills the release with no new term (I3's shape) |
| `decisionTimer` | decays `Player.ts:370`; re-armed to `AI_INTERVAL` at `Match.ts:1199`; overridden at reception `Match.ts:1678` (0.08 / 0.18 / 0.3), one-touch `1724` (0.07), restart taker `Match.ts:2802` (0.12), sub/arrival `2365/2554/3233` (0.05) | gates WHEN the brain runs — it is already a de-facto pre-release delay of 0.07–0.3 s **between reception and the decision** | the wind-up would sit AFTER this, not instead of it. §P2's reception-to-release gap measures the sum of the two as it stands today |
| the re-decide lock | `PlayerBrain.ts:38-47` | a winding-up body cannot re-decide while it owns the ball; the commitment **lapses the moment it loses the ball** | transfers verbatim (see P1.2) |
| the tackle channel | `mechanics.ts:1757` `d < 1.15` on `dist(o.pos, ball.pos)` | the existing, ball-keyed interruption channel — the ONLY one a wind-up would expose (C7 I3) | transfers; the census reports nearest-opponent distance at release so the exposure geometry is sized on the pass population |
| `tryDeflection` | `mechanics.ts:1524`, stamps `p.kickCooldown = 0.3` on the deflector | post-release, in-flight | not an interruption of a wind-up |
| `stunTimer` / `sentOff` / `phase` | `resolvePendingKick`'s bail conditions `Match.ts:1869-1871` | already enumerated by C7 | transfers |

## P1.6 ⚠ TRAPS SPECIFIC TO THE PASS FAMILY

1. ⭐⭐ **RESTART TAKERS SHARE THE OPEN-PLAY DOOR.** C7 excluded free kicks
   cheaply because a free-kick STRIKE has its own function
   (`kickKind === 'freeKick'` → `performFreeKick`, `PlayerBrain.ts:1012`). A
   pass-family restart has **no separate function**: a kick-in, corner, goal
   kick or free-kick PASS runs `performPass` / `performCross` /
   `performLoftedPass` / `performThroughBall` through the same switch cases,
   discriminated only by `mustKick = match.restartKickGid === p.gid`
   (`PlayerBrain.ts:95`) and `match.restartKickKind`. Excluding restarts "as in
   C7" therefore requires an explicit `mustKick` test at the seam, not a
   different door. §P2.6 sizes the restart share of every kind.
2. **The restart run-up is a zero-time re-orientation, not a wind-up.**
   `PlayerBrain.ts:948-965` snaps the taker's heading to the chosen target in
   the SAME tick (the banked *"corners arrived weak and wild while the taker
   still faced the flag"* fix). It removes misalignment for free; it buys no
   time. Do not remove it, and do not read it as an existing wind-up.
3. **The kickoff pass bypasses the switch entirely** (`PlayerBrain.ts:160`).
4. **Headers are NOT kicks.** `performHeaderShot` (`mechanics.ts:998`) writes
   `ball.vel`/`ball.vz` directly at `1017-1018` — no `kickBall`, so no
   `firstTouchWindow` consumption, no `kickCooldown` stamp, none of the
   orientation prices. The defensive header (`mechanics.ts:904-910`) and the
   **knockdown** (`912-927`, the closest thing the game has to a lay-off) do
   the same. ⭐ **There is no lay-off ACTION in the substrate** — a repo-wide
   search for `lay-off`/`layoff` finds only league-playoff strings; the
   knockdown is the nearest analogue and it is a header, not a kick.
5. **The chest/thigh trap is a reception, not a release** (`tryChestTrap`,
   `mechanics.ts:944-990`; stamps `kickCooldown = 0.3` at `978`).
6. **`performDribbleTouch` nulls `ball.owner` WITHOUT `kickBall`**
   (`mechanics.ts:1486-1491`) — so a dribble touch does **not** consume the
   one-touch window and is not a release. It does set
   `kickCooldown = TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH`, which
   the `perform*` guards then read.
7. **`stats.clearances` is incremented by two different things** —
   `performClear` (`mechanics.ts:1515`) and the defensive header
   (`mechanics.ts:909`). Any clearance-keyed instrument must separate them; the
   census does (class `E-HEADER-CLEAR`).
8. **Where "pass" and "shot" share a path:** only `Match.kickBall` and
   `p.action`'s switch statement. `loftKick` is pass-only; `bentKick` is
   pass-only; `performShot`/`tryChip`/`performFreeKick`/`performHeaderShot`
   never enter a pass function. **The one shared-name hazard is
   `match.lastPassKind`**, which has exactly four writers — `402` `'pass'`,
   `542` `'through'` (inside `loftKick`, so CROSSES, lofted passes, keeper
   punts and keeper THROWS all write `'through'`), `677` `'cross'` (the
   CUTBACK), and `1126` `'lofted'` inside `tryChip`, **which is a shot**. The
   ground through ball (via `bentKick`) and the clearance write nothing, so the
   field goes stale across them. It is telemetry, **not a safe kind
   discriminator**; the census does not use it.
9. **`keeperThrow` is AMBIGUOUS by football semantics** (P1.1) — mechanically a
   kick, narratively a throw.
10. **The single-slot `pendingKick`** (P1.2) — silent overwrite at pass volume.
11. **`ThrowOut` has no `actionExecutor` case** (P1.2) — it works only because
    `target` initialises to `null`.
12. **FLAG HYGIENE (contract §3, #174 traps 1–3):** `c7Windup` is a real field
    on `MatchConfig` (`Match.ts:394`), defaults false (`Match.ts:996`), is
    listed in `League.ts:282`'s flag union, and is **`true` in
    `src/game/a4World.ts:89`**. A pass seam gated on `c7Windup` would arm
    itself in the a4 world the moment it is written. An O1 seam needs its own
    explicit boolean.

## P1.7 Code truth at HEAD `30f2a7b` — every citation verified, no drift

| cited | verified at HEAD |
| --- | --- |
| decision switch | `PlayerBrain.ts:968` (`switch (top.action)`), comment at `967` |
| the C7 arm point | `PlayerBrain.ts:1019` `else if (match.c7Windup) match.armPendingKick(p, goal)` |
| the re-decide lock | `PlayerBrain.ts:38-47` |
| `kickBall` | `Match.ts:1583`; `ball.owner = null` `1586`; `kickCooldown` `1594`; `firstTouchWindow = 0` `1595` |
| `firstTouchWindow = 0.28` | `Match.ts:1725` (trigger `1710`, `decisionTimer = 0.07` `1724`) |
| `pendingKick` machinery | `Match.ts:564` (slot) · `1139` (resolve call) · `1828-1849` (arm) · `1861-1873` (resolve) · `131-152` (`c7WindupTicks`) |
| `kickMisalignment` / noise / power | `mechanics.ts:78 / 83 / 88` |
| `oneTouchMul` | `mechanics.ts:263-264` |
| the consumption sites | `mechanics.ts:391/395` · `487/447` · `530/535/599` · `674/676` · `733` |
| pass `perform*` | `354` (pass) · `441` (through) · `513` (`loftKick`) · `553` (cross) · `634` (keeper throw) · `657` (cutback) · `723` (lofted) · `1495` (clear) |
| header release | `mechanics.ts:998`; `ball.vel`/`ball.vz` at `1017-1018`, no `kickBall` |
| tackle ball radius | `mechanics.ts:1757` (`d < 1.15`) |
| decay / timers | `Player.ts:361` (`kickCooldown`) · `369` (`firstTouchWindow`) · `370` (`decisionTimer`), all inside `physicsStep` (`Player.ts:270`) |
| `TURN_RATE` | `Player.ts:17` = 6.5 |
| `DT` · `MATCH_DURATION` · `AI_INTERVAL` · `KICK_COOLDOWN` · `TOUCH_CONTROL_DIST` | `constants.ts:55` · `57` · `342` · `282` · `315` |
| `c7Windup` armed in a4World | `src/game/a4World.ts:89` |

⭐ **No line drift** from the C7 map's release-chain citations except the
expected `Match.ts` shift: the C7 docs cite `kickBall` at `Match.ts:1320`; at
HEAD it is **1583**. `PlayerBrain.ts`'s switch moved `922 → 968`. Reported per
the iron rule; cite HEAD numbers going forward.

---

# PART 2 — THE CENSUS

## P2.1 What the census is, and is not

Absolute, descriptive, **single-arm**. It counts the pass-family release
population in the **production world** and reads the body's state at each
release. It forks nothing, forces nothing, arms nothing, prices nothing, and
adjudicates no scope. There is no A/B and no reference band; the only gates are
plumbing (§P2.9).

Production world = `new Match({ seed, teamA, teamB })` — **no flag object at
all**, so `c7Windup`, `c5Hold`, `c5TouchFork`, `c4Arrival`, `whetherEye`,
`forced*` and every other seam sit at their shipped defaults.

## P2.2 The detection law, FROZEN BEFORE THE RUN

A release is an **EVENT**, keyed on the per-step delta of the team's own
passive counters and attributed to the **pre-step feet owner**.

* Six sites increment `team.stats.passes` and **all six are pass-family**
  (`mechanics.ts:404, 494, 621, 643, 679, 737`). `team.stats.clearances` has
  exactly two writers (`mechanics.ts:909` header, `1515` `performClear`).
* At most **one** release can occur per step: only the unique feet owner can
  kick, `kickCooldown` blocks a second strike, and a new owner cannot decide
  until the next step (capture happens in `stepBall`, after the decide loop).
* **Kind** is read off the sub-counters, with `p.action.type` as the
  cross-check: `cutbacks` → cutback · `crosses` → cross · `throughBalls` →
  throughChip if `longBalls` also moved else throughGround · `longBalls` alone
  → keeperPunt if the owner is a distributing GK else loftedPass · `passes`
  with `action === 'ThrowOut'` → keeperThrow · `passes` otherwise → shortPass ·
  `clearances` with `action === 'ClearBall'` → clearance.

⭐ **Why the pre-step read is EXACT, not approximate.** `decidePlayer` runs at
the head of `Match.step` (`Match.ts:1184-1199`) — **before** `physicsStep`
decays `firstTouchWindow`/`decisionTimer` (`Player.ts:361-370`) and **before**
`stepBall`'s reception sets the window (`Match.ts:1725`). So the state the brain
reads at its kick is exactly the post-previous-step state the instrument
snapshots. This is verified, not asserted: the instrument's window read is
cross-checked against the engine's own `stats.oneTouch` counter on the seven
kinds that carry it, and **disagreements must be 0** (§P2.9, X-ONETOUCH-AGREE).

## P2.3 The metrics, FROZEN

Per kind, and for ALL / OPEN-PLAY aggregates:

1. **releases/match**, plus both time axes (§P2.5).
2. **one-touch share** = `firstTouchWindow > 0` at the kick — the *exact*
   predicate `mechanics.ts:264/395/447/599/676/733` reads. Cluster CI.
3. **pressed share at release** = nearest non-sent-off opponent (keepers
   included) within **R = `TOUCH_CONTROL_DIST` = 4.2 m** (`constants.ts:315`) of
   the RELEASING PLAYER at the release tick — the radius inherited verbatim
   from `TEMPO-CENSUS.md` §3.6 (the substrate's own pressure switch).
   `CONTEST_RADIUS = 3.0` m (`constants.ts:256`) reported as a sensitivity,
   never instead. Cluster CI. Full distance distribution also reported.
4. **reception-to-release gap** = `(releaseTick − acquisitionTick) · DT`, where
   `acquisitionTick` is the most recent tick on which `ball.owner` became this
   player (the engine's own `giveBall` notion; a dribble touch frees and
   re-captures the ball, so it opens a NEW acquisition). p25/p50/p75 (+p10/p90/
   mean), the share inside the 0.28 s first-touch window, and the share whose
   acquisition was a completed pass from a teammate (`lastCompletedPass` on the
   acquisition step).
5. **share of ALL open-play releases each kind carries** — the scope-decision
   number.

Cluster unit for every CI = **match seed** (#20); deterministic percentile
bootstrap (2,000 resamples, `BOOTSTRAP_SEED = 102,600`) on its own `Rng`
stream, never the match RNG.

## P2.4 Staging + the N arithmetic, FROZEN

Seeds per contract §8: **12,300,000+** (a new block family; the 12.2M pool is
exhausted at 12,292,999 and `TEMPO-CENSUS.md` §7.1 reserved
12,293,000–12,299,999 in full).

| item | value |
| --- | --- |
| **census block** | `12,300,000 + k`, `k < 2,000` ⇒ **12,300,000 – 12,301,999** |
| **sizing smoke** | `12,309,900 + k`, `k < 24` ⇒ 12,309,900 – 12,309,923 (**disjoint, above the census range**, #46.2) |
| **reserved band** | 12,300,000 – 12,309,999, reserved in full by this stage |
| **N** | **2,000** matches, single arm |
| duration | default `MATCH_DURATION = 240` (unmodified) |
| sampling | event-driven, every step of every match; no sub-sampling |
| stats base | 102,600 (above the tempo census's reserved 102,400) |
| output | `data/o1-pass-release-census.json`, sha256'd |

**The N arithmetic (frozen before the census ran, derived from the sizing
smoke's RATES only — #44.5).** The binding population is the **rarest kind**,
because the deliverable is per-kind shares. The smoke (24 matches, §P2.10)
measured the rarest kinds at ~0.33–0.375 releases/match (clearance 0.333,
loftedPass 0.375, keeperThrow 0.375). Frozen target: **≥ 300 releases per
kind**, so a within-kind share carries `SE ≤ sqrt(0.25/300) = 2.89 pp` — finer
than any scope cut needs. Then

```
N* = ceil(300 / 0.333) = 901  →  taken to 2,000 for the house ~2x headroom
     expected rarest-kind population 0.333 x 2000 = 667 = 2.22x the floor
wall: 24 matches x 2 runs = 4.1 s  =>  ~0.085 s/match/run
      2,000 x 2 runs ~ 340 s, far inside the <= 2 h budget
```

**F-KIND floor, frozen: ≥ 300 releases per kind.** A kind below it is reported
as **RARE** and its within-kind shares are labelled underpowered — a finding,
never a licence to lower the floor.

## P2.5 Both time axes (the axis-honesty law)

Per `TEMPO-CENSUS.md` §1, binding: **`match.simTime` — PLAYED sim-seconds — is
the denominator of BOTH axes.** `MATCH_DURATION = 240` sim-seconds maps to 90
display-minutes, so 1 display-minute = **2.6667** sim-seconds and
`perDisplayMinute = perSimSecond × 2.6667`, with no residual. Wall-clock is
emitted **once**, labelled `CONTEXT ONLY — USED IN NO RATE`, and is excluded
from `resultSha256` (#128).

## P2.6 Context split, frozen

Every release is exactly one of **openPlay** / **restart** / **kickoff**:
restart iff `match.restartKickGid === ownerGid` pre-step (with
`match.restartKickKind` recorded: kickIn / corner / goalKick / freeKick /
penalty), kickoff iff `match.kickoffKickGid === ownerGid`, openPlay otherwise.
This is the population P1.6 trap 1 makes load-bearing.

## P2.7 Exception classes (event-keyed, per-record receipts #49.3)

`unexplained` must be exactly **0**; receipts capped at 1,000.

```text
E-HEADER-CLEAR  a stats.clearances delta with no same-side feet owner (or an
                owner who did not commit ClearBall) = the defensive header
                (mechanics.ts:909). EXPECTED and benign — not a kick.
E-NOOWNER       a stats.passes delta with no pre-step feet owner. Expected 0.
E-CROSS-SIDE    a counter delta on the side that did not own the ball. Expected 0.
E-MULTI         two kind-flags (or passes > 1) in one step. Expected 0 by P2.2.
E-ABORT         the owner committed a kick-family action this step but no
                counter moved — perform's `owner/kickCooldown` guard returned
                (mechanics.ts:357 etc.). RECORDED as a population, not a failure:
                it is the only place today where a commit does not become a kick.
E-ENDED         the release resolved on the match's final step.
```

## P2.8 Pre-laid readings — the full sign space (#38.1), frozen before sight

No re-cutting after sight: not the radius, not the floor, not the kind list,
not these readings.

* **(a) ONE FAMILY CARRIES THE TEMPO.** One or two kinds hold the overwhelming
  majority of open-play releases and the rest are rare. Then the scope decision
  is a volume decision — recorded for the commander, decided by the commander.
* **(b) THE TEMPO IS SPREAD.** No kind exceeds ~half of open-play releases.
  Then a first cut on one kind moves a minority of releases; the census says
  which minority.
* **(c) THE ONE-TOUCH BYPASS IS POPULATED.** Unlike shots (0.076%, C7-T0), the
  one-touch share is materially non-zero on the high-volume kinds. Then the
  contract's DESIGNED bypass has a real population and P1.3's non-uniformity
  (clearance unpriced, keeperThrow uncounted) is a live surface.
* **(d) THE ONE-TOUCH BYPASS IS EMPTY.** One-touch shares are ~0 everywhere.
  Then the bypass is nominal and the "快但糙 vs 拿住再传" tradeoff has no
  population to express it — a finding that returns to the commander.
* **(e) RELEASES ARE ALREADY FAST.** Median reception-to-release sits at or
  below the 0.28 s window on the high-volume kinds (the #175 baseline: median
  0.33 s, 44% inside 0.28 s). Reported as an absolute level against that
  banked number; no causal claim.
* **(f) RELEASES ARE PRESSED.** The pressed-at-release share is high (the
  #173.3 baseline is 81% pressed RECEPTIONS). Reported absolutely.
* **(g) RESTARTS ARE A LARGE SHARE OF SOME KIND.** Then P1.6 trap 1 is not
  academic and any "free kicks excluded as in C7" clause needs the explicit
  `mustKick` test.
* **(h) A KIND FALLS BELOW F-KIND.** Reported as RARE with underpowered
  shares; the floor is not lowered.
* **(i) THE INSTRUMENT DISAGREES WITH THE ENGINE.** X-ONETOUCH-AGREE fails
  (any disagreement between the window read and `stats.oneTouch`). Then the
  census FAILS as an instrument and no number in it may be used.

## P2.9 Gates, frozen (plumbing only — no football gate exists in this stage)

| gate | predicate |
| --- | --- |
| **X-SRC-ZERO** | `git diff --stat -- src` empty (HARD) |
| **X-DET** | the whole experiment core runs **twice**; canonical digests identical |
| **X-FP-PROD** | a 2-season headless league on seed 1337 hashes to `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` |
| **seed disjointness** | proved in-probe: census and smoke ranges disjoint from each other, both strictly above the consumed ceiling 12,299,999, both inside the reserved band |
| **X-CLASSIFY** | every counter delta maps to exactly one kind or one named exception class; `unexplained` = 0 |
| **X-ONETOUCH-AGREE** | the pre-step `firstTouchWindow` read and the engine's own `stats.oneTouch` counter agree on **every** release of the seven kinds that carry the counter; disagreements = 0 |
| **X-OVERLAP** | reproduces any existing overlapping instrument. **None exists.** `TEMPO-CENSUS` measures spells/receptions/turnovers (its one-touch share is reception-keyed, not release-keyed); `C7-T0` measures SHOTS at the strike; `cross-anatomy` measures cross outcomes; no prior instrument keys on the pass-family RELEASE event by kind. Recorded vacuous with that reason |

Determinism: no `Date.now()` / `Math.random()` on any result path; wall time is
measured outside the compared core and excluded from `resultSha256`.

## P2.10 The pre-freeze sizing smoke (disclosed, #44.5)

Ran 2026-08-08, **24 matches, block 12,309,900**, HEAD `30f2a7b`, read-only,
twice byte-identical. RATES ONLY — used to derive §P2.4's N and floor, and for
nothing else. Verbatim:

```text
=== O1 PASS-RELEASE CENSUS (SIZING SMOKE) — HEAD 30f2a7b ===
matches 24 · block 12309900 · steps 360685 · played simSeconds/match 241.5208
X-SRC-ZERO PASS · X-DET PASS · X-FP-PROD skipped · seedDisjoint PASS
ALL pass-family releases: 2292 (95.5/match · 0.395411/simSec · 1.05443/displayMin)

kind             count   /match    share  openShare  oneTouch%  pressed%   gap p25/p50/p75 s   gapN
shortPass         1787  74.4583   77.97     78.97      18.19     72.19     0.15/0.3333/0.3333    1787
cutback             82   3.4167    3.58      3.08       4.88     53.66   0.1375/  0.15/0.3333      82
throughGround      220   9.1667     9.6     10.77      31.36     75.46      0.2/0.3333/0.3333     220
throughChip        112   4.6667    4.89      5.16       8.04     32.14   0.3333/0.3333/6.3333     112
cross               53   2.2083    2.31       0.3          0     11.32     0.15/  0.15/  0.15      53
loftedPass           9    0.375    0.39      0.25      22.22     33.33     0.15/  0.15/0.3333       9
keeperPunt          12      0.5    0.52      0.61          0         0      6.5/   6.5/   6.5      12
keeperThrow          9    0.375    0.39      0.46          0         0   4.8333/   6.5/   6.5       9
clearance            8   0.3333    0.35       0.4       37.5       100      0.1/   0.2/0.2833       8

one-touch agreement (window read vs stats.oneTouch): agree 2275 · disagree 0 · notCarried 17
exceptions: E-HEADER-CLEAR 99 · E-NOOWNER 0 · E-CROSS-SIDE 0 · E-MULTI 0 · E-ABORT 0 · E-ENDED 0 → unexplained 0
```

Three things the smoke establishes, carried into §P2.4 only: the release
population is **~10× the shot population** (95.5/match vs C7-T0's 13.20
shots/match); the rarest kinds sit near 0.33/match (which sets N); and the
instrument agrees with the engine's own counter on every release (0
disagreements), which is what licenses the window read as the one-touch
measure.

## P2.11 — RESULT (the authorized run, ruling #176)

Script: [`../../scripts/probes/o1-pass-release-census.ts`](../../scripts/probes/o1-pass-release-census.ts).
Data: [`data/o1-pass-release-census.json`](data/o1-pass-release-census.json).
Run read-only, **2,000 matches**, seeds `12,300,000 + k`, `k < 2,000`, default
duration, event-keyed at every step, zero `src/**`. `runExperiment()` invoked
**twice**, byte-identical. **30,102,446 steps · 483,597 played sim-seconds
(241.7987 s/match).** Verdict: **GATES PASS.**

* **`resultSha256`** `79bee1328385ddd58d75baf9ab61f89fc6bf7add64e77350aa7ed98a1e7bbc03`
* **X-DET digest (both runs)** `5741fb24f9e615433d06f0ea46f034fc4f37ddac9c189e28fde0a416b892b7a9`
* wall **311 s** — `CONTEXT ONLY — USED IN NO RATE`, excluded from `resultSha256`

### Gate table

| gate | verdict | evidence |
| --- | --- | --- |
| **X-SRC-ZERO** | ✅ PASS | `git diff --stat -- src` empty at run time |
| **X-DET** | ✅ PASS | two invocations byte-identical, digest above |
| **X-FP-PROD** | ✅ PASS | 2-season headless league on seed 1337 → `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673` |
| **seed disjointness** | ✅ PASS | census 12,300,000–12,301,999 · smoke 12,309,900–12,309,923 · disjoint · both above the 12,299,999 ceiling · both inside the reserved band |
| **X-CLASSIFY** | ✅ PASS | every counter delta classified; **unexplained = 0** |
| **X-ONETOUCH-AGREE** | ✅ PASS | 199,793 agree · **0 disagree** · 1,771 not carried (keeperThrow + clearance) |
| **X-OVERLAP** | ✅ PASS (vacuous) | no prior instrument keys on the pass-family RELEASE event by kind |
| **F-KIND (≥ 300/kind)** | ✅ PASS, all nine | thinnest is loftedPass at **670** (2.23× the floor) — the sizing arithmetic landed on the nose |

Exception ledger: **E-HEADER-CLEAR 9,835** (the defensive-header clearance path,
expected and benign — 4.92/match) · **E-NOOWNER 0** · **E-CROSS-SIDE 0** ·
**E-MULTI 0** · **E-ABORT 1** · **E-ENDED 0** → **unexplained 0**.

> ⚠ Disclosed instrument limitation: receipts are capped at 1,000 per match and
> then sliced to the first 1,000 globally, and E-HEADER-CLEAR saturates that
> slice — so the single E-ABORT record's receipt is not in the committed slice.
> The COUNT is exact (it comes from the counters, not the receipts).

⭐ **E-ABORT = 1 in 930,472 observed owner decisions.** The commit-to-kick path
is effectively total today: a pass-family action committed at the switch becomes
a struck ball in the same tick in all but one case across 2,000 matches. This is
the empirical face of P1.2 — there is no committed-but-unstruck state to read.

### (i) The population, by kind — with both time axes

`simTime` denominates both rate axes; `perDisplayMinute = perSimSecond ×
2.6667` exactly (the axis-honesty law, §P2.5).

**ALL pass-family releases: 201,564 — 100.782/match · 0.416801/sim-second ·
1.11147/display-minute.**
**OPEN PLAY: 174,286 — 87.143/match · 0.360395/sim-second ·
0.96105/display-minute.**

| kind | count | /match | /sim-s | /disp-min | share of ALL | **share of OPEN-PLAY** |
| --- | --- | --- | --- | --- | --- | --- |
| **shortPass** | 158,424 | 79.212 | 0.327595 | 0.87359 | 78.60% | **79.81%** |
| **throughGround** | 17,313 | 8.657 | 0.035800 | 0.09547 | 8.59% | **9.42%** |
| **throughChip** | 8,644 | 4.322 | 0.017874 | 0.04766 | 4.29% | **4.49%** |
| **cutback** | 7,527 | 3.764 | 0.015565 | 0.04151 | 3.73% | **3.14%** |
| **keeperPunt** | 2,552 | 1.276 | 0.005277 | 0.01407 | 1.27% | **1.46%** |
| **keeperThrow** | 965 | 0.483 | 0.001995 | 0.00532 | 0.48% | **0.55%** |
| **clearance** | 806 | 0.403 | 0.001667 | 0.00444 | 0.40% | **0.46%** |
| **cross** | 4,663 | 2.332 | 0.009642 | 0.02571 | 2.31% | **0.45%** |
| **loftedPass** | 670 | 0.335 | 0.001385 | 0.00369 | 0.33% | **0.22%** |

⭐ **Scale, against the certified shot population:** 100.782 pass-family
releases/match vs C7-T0's **13.20 shots/match** — **7.6×**, matching the
contract §2's "~8×" presumption. The v1 shot seat itself was 8.98/match, so the
pass family is **11.2×** the certified C7 seat.

### (ii) Context split (the P1.6-trap-1 population)

| context | count | share | /match |
| --- | --- | --- | --- |
| **openPlay** | 174,286 | **86.47%** | 87.143 |
| **restart** | 19,159 | **9.51%** | 9.580 |
| **kickoff** | 8,119 | **4.03%** | 4.060 |

Restart releases by `restartKickKind`: **goalKick 8,292 · corner 5,911 ·
kickIn 2,589 · freeKick 2,367 · penalty 0.**

Per-kind context (the numbers a "free kicks excluded as in C7" clause needs):

| kind | openPlay | restart | kickoff | restart+kickoff share of the kind |
| --- | --- | --- | --- | --- |
| shortPass | 139,091 | 11,214 | 8,119 | 12.20% |
| cutback | 5,465 | 2,062 | 0 | 27.40% |
| throughGround | 16,423 | 890 | 0 | 5.14% |
| throughChip | 7,833 | 811 | 0 | 9.38% |
| **cross** | **776** | **3,887** | 0 | **83.36%** |
| loftedPass | 375 | 295 | 0 | 44.03% |
| keeperPunt · keeperThrow · clearance | 2,552 · 965 · 806 | 0 · 0 · 0 | 0 | 0% |

⭐ **The cross is a set-piece kind in this world.** 83.4% of crosses are
restarts (overwhelmingly corners), leaving **776 open-play crosses in 2,000
matches = 0.45% of open-play releases**. `loftedPass` is 44% restart. Reading
**(g) FIRES.**

### (iii) One-touch share at the kick (`firstTouchWindow > 0`)

Match-seed cluster bootstrap CI (#20), 2,000 resamples.

| kind | one-touch share | 95% CI | count |
| --- | --- | --- | --- |
| **ALL releases** | **19.711%** | [19.434%, 19.970%] | 39,731 |
| **OPEN PLAY** | **22.786%** | [22.496%, 23.065%] | 39,715 |
| throughGround | **30.174%** | [29.393%, 30.902%] | 5,224 |
| clearance | **28.288%** | [24.634%, 31.900%] | 228 |
| shortPass | **20.712%** | [20.431%, 20.978%] | 32,812 |
| throughChip | 11.522% | [10.709%, 12.342%] | 996 |
| loftedPass | 9.254% | [7.078%, 11.577%] | 62 |
| cutback | 4.371% | [3.881%, 4.857%] | 329 |
| cross | 1.716% | [1.325%, 2.116%] | 80 |
| keeperPunt | **0%** | [0, 0] | 0 |
| keeperThrow | **0%** | [0, 0] | 0 |

⭐ **Reading (c) FIRES: the one-touch bypass is POPULATED — the exact opposite
of shots.** C7-T0 found 5 one-touch shots in 6,599 (0.076%); the pass family
carries **39,731** one-touch releases, 22.8% of open play, and 30.2% on the
ground through ball. The 快但糙 / 拿住再传 tradeoff has a real population to
express it. **Reading (d) does NOT fire.**

⭐ **And the P1.3 non-uniformity is live.** `clearance` is 28.3% one-touch while
paying **no `oneTouchMul` at all** (P1.4) — 228 releases in this census are
one-touch by the engine's own predicate on the one kind with no existing
accuracy price. `keeperThrow` is 0% one-touch, so its uncounted-but-priced
asymmetry has no population in practice.

### (iv) Pressed at release (nearest opponent ≤ `TOUCH_CONTROL_DIST` = 4.2 m)

| kind | pressed share | 95% CI | sensitivity @ 3.0 m | nearest-opp distance p25 / **p50** / p75 (m) |
| --- | --- | --- | --- | --- |
| **ALL releases** | **67.490%** | [67.259%, 67.725%] | 58.689% | — |
| **OPEN PLAY** | **73.391%** | [73.149%, 73.635%] | 63.269% | — |
| **clearance** | **99.007%** | [98.292%, 99.625%] | 91.439% | 1.094 / **1.624** / 2.250 |
| shortPass | **72.617%** | [72.390%, 72.848%] | 64.413% | 1.292 / **2.359** / 4.906 |
| throughGround | **72.235%** | [71.469%, 72.987%] | 59.031% | 1.257 / **2.389** / 4.643 |
| cutback | 51.468% | [50.180%, 52.738%] | 38.063% | 2.069 / **4.003** / 9.202 |
| throughChip | 36.233% | [34.869%, 37.524%] | 22.177% | 3.203 / **5.997** / 7.385 |
| loftedPass | 19.701% | [16.450%, 23.375%] | 16.269% | 4.943 / **6.833** / 10.069 |
| cross | 11.752% | [10.832%, 12.703%] | 8.600% | 8.981 / **9.494** / 9.952 |
| keeperThrow | 0.104% | [0, 0.332%] | 0% | 7.243 / **7.937** / 10.297 |
| keeperPunt | 0.078% | [0, 0.199%] | 0% | 6.889 / **7.305** / 7.762 |

⭐ **Reading (f) FIRES.** Nearly three open-play releases in four are struck
with an opponent inside the substrate's own pressure radius — the release-side
counterpart of the #173.3 baseline (81% pressed RECEPTIONS). The clearance is
almost definitionally pressed (99.0%, median opponent 1.62 m — inside twice the
1.15 m tackle radius); the keeper's two kinds are never pressed.

### (v) Reception-to-release gap (seconds; same-player ownership acquisition)

| kind | p10 | **p25** | **p50** | **p75** | p90 | mean | share ≤ 0.28 s | acquisition was a completed pass |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **ALL** | 0.100 | **0.150** | **0.3333** | **0.3333** | 0.983 | 0.6695 | **41.52%** | — |
| **OPEN PLAY** | 0.100 | **0.1167** | **0.3333** | **0.3333** | 1.000 | 0.7119 | **37.00%** | — |
| shortPass | 0.100 | 0.150 | **0.3333** | 0.3333 | 0.983 | 0.5304 | 39.83% | 54.03% |
| throughGround | 0.100 | 0.150 | **0.3333** | 0.3333 | 0.600 | 0.3694 | 42.39% | 82.15% |
| cutback | 0.100 | 0.100 | **0.150** | 0.3333 | 0.467 | 0.3424 | 73.71% | 46.10% |
| cross | 0.150 | 0.150 | **0.150** | 0.150 | 0.150 | 0.1771 | **93.46%** | 12.18% |
| loftedPass | 0.100 | 0.150 | **0.150** | 0.200 | 0.3333 | 0.2079 | 75.97% | 45.82% |
| clearance | 0.100 | 0.100 | **0.200** | 0.3333 | 1.133 | 0.5510 | 58.31% | 43.18% |
| throughChip | 0.150 | 0.2667 | **0.3333** | 6.500 | 6.500 | 2.2109 | 27.20% | 50.75% |
| keeperThrow | 1.833 | 5.167 | **6.500** | 6.500 | 6.500 | 5.3943 | 0% | 0% |
| keeperPunt | 6.500 | 6.500 | **6.500** | 6.500 | 6.500 | 6.3570 | 0% | 0% |

⭐ **Reading (e) FIRES, and it corroborates the #175 baseline on a different
keying.** The #175 gap table recorded *median reception-to-release 0.33 s, 44%
of touches inside the engine's own 0.28 s window*, measured reception-side. This
census, keyed on the RELEASE event, independently returns **median 0.3333 s** and
**41.52% inside 0.28 s** (open play 37.00%). The high-volume kinds sit at the
same 0.3333 s median. The cross is the extreme: **93.5% of crosses are struck
within 0.28 s of acquisition** — a 0.150 s median, i.e. essentially the decision
cadence itself.

> ⚠ **AMBIGUOUS — the 6.5 s mode, recorded not resolved.** `keeperPunt`'s gap is
> 6.500 s at every reported quantile, `keeperThrow`'s at p50–p90, and
> `throughChip`'s at p75–p90. A keeper's ownership is held by two stacked
> mechanisms — `gkHoldTimer = 1.1·(1 + holding·0.5 − urgency·0.3)`
> (`Match.ts:1667`) and the shape-wait re-arm in 0.25 s quanta capped at
> `gkShapeWait < 4` (`PlayerBrain.ts:126-128`) — which plausibly sums into this
> region, but **this instrument did not verify that 6.5 s is that sum**, and no
> named constant equal to 6.5 s exists on the release chain. Recorded as an
> observed mode with its evidence; not attributed.

### (vi) Which kinds carry the tempo — the scope-decision number, stated flatly

Share of the **174,286 open-play** pass-family releases:

```
shortPass       79.81%   |  cumulative  79.81%
throughGround    9.42%   |              89.23%
throughChip      4.49%   |              93.72%
cutback          3.14%   |              96.86%
keeperPunt       1.46%   |              98.32%
keeperThrow      0.55%   |              98.87%
clearance        0.46%   |              99.33%
cross            0.45%   |              99.78%
loftedPass       0.22%   |             100.00%
```

**Reading (a) FIRES: one kind carries the tempo.** `shortPass` alone is 79.8% of
open-play releases; with `throughGround` it is 89.2%. Six of the nine kinds are
together under 3.2%. **Reading (b) does NOT fire.** **Reading (h) does NOT
fire** (every kind cleared F-KIND). **Reading (i) does NOT fire** (0
disagreements).

### (vii) Arithmetic on frozen constants (a fact, not a proposal)

The C7 §LAW wind-up, frozen at `Match.ts:136-152`, spans 3–11 ticks
(0.0500–0.1833 s) and measured **W p50 = 0.112 s** on the shot population
(C7-T0 §5-result, MID candidate). Applied as pure arithmetic to this census's
release counts, per match:

```
open-play releases 87.143 x 0.112 s  =  9.76 s   ( 4.04% of 241.80 played sim-seconds)
ALL releases      100.782 x 0.112 s  = 11.29 s   ( 4.67% )
shortPass only     79.212 x 0.112 s  =  8.87 s   ( 3.67% )
at the W floor (0.05 s) / cap (0.1833 s), open play:  4.36 s  /  15.97 s
```

This is multiplication on recorded counts and frozen constants. It prices
nothing, assumes no behavioural response, and recommends no scope.

---

## P2.12 Registered non-claims

* The census prices nothing and proposes nothing. It does not say which kinds
  O1 should cover, how long a wind-up should be, or whether one is worth
  building. **The commander freezes O1's first-cut scope on these numbers.**
* No causal claim of any kind: one arm, no fork, no counterfactual.
* The reception-to-release gap is measured against the engine's own ownership-
  acquisition notion; it is not a claim about *football* reception.
* `keeperThrow`'s status as a kick is recorded AMBIGUOUS (P1.1), not resolved.
* Nothing is armed and nothing ships (Road B); `c7Windup` remains OFF in
  production and untouched.
