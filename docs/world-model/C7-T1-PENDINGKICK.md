# C7 T1 — `pendingKick` (the shot wind-up)

Status: **PRE-REGISTERED 2026-07-29, FROZEN BEFORE IMPLEMENTATION.** Nothing is
built. Nothing has been run beyond a read-only sizing smoke (§STAGING). No
`src/**` changed; no `c7Windup` flag exists yet; no T1 fork instrument exists
yet. This document freezes the law, its constants, the seam, the gates, the
staging and the full sign-space readings **before** a single line of
`pendingKick` is written — the P1/P2 two-commit discipline (#45.2(b): executor
drafts → commander review → authorized implementation → authorized run →
ruling). **This freeze returns to the commander for review; implementation and
the run each need their own authorization** (#56.3(v)).

Authority chain: **contract [`C7-RELEASE-WINDUP.md`](C7-RELEASE-WINDUP.md)
§6-T1** (this stage's scope) · §4 (the seat and the W-law shape) · §5 invariants
I1–I9 · §8 stop rules · §9 non-claims — all bind verbatim · **ruling #56.3**
(T1 drafting authorized under five named constraints (i)–(v)) · #56.2 (the
banked T0 facts this freeze derives from: the interruption seat is real but
modest; the head-room is tail-concentrated and the NOISE channel is the larger
price; defenders near shooters are near-but-static) · #55.2 (the twisted-tail
pre-flag) · #48 (the ½×–1.5× recompute-to-live transfer convention; #48.4 pin
the fork window ex ante; #48.3 structural-not-count gate form) · #49.3
(event-keyed exception classes + per-record receipts, incl. E-INJURY) · #24
(floors derived from T0's measured populations, attainable on the deployed
population) · #32.1 (no coupon-collector max-statistic gate form) · #38.1
(standing exception classes + full sign space) · #20 (CI semantics, cluster unit
= match seed) · #46.2 (smoke/census seed disjointness) · #26.5 (population law:
T1 states its HEAD) · Road B (nothing ships; `c7Windup` off in every production
path through the whole stage).

Data this freeze is derived from (committed, SHA'd, #24):
[`C7-T0-SHOT-RELEASE.md`](C7-T0-SHOT-RELEASE.md) §5-result and
[`data/c7-t0-shot-release.json`](data/c7-t0-shot-release.json) (output SHA
`b93c9645…561f`, table SHA `ee96e3af…8ffa`). Every band, floor, window and
expected effect below cites its T0 number.

Code truth verified at current HEAD `58a8b42` (the release chain shows no drift
from T0's §7 table): the shot commit is **`PlayerBrain.ts:962-968`**
(`case 'Shoot'`, `performShot` at 967 for `kickKind !== 'freeKick'`);
`performShot` **`mechanics.ts:1157`**, its single `kickBall` call at **1270**;
`kickBall` **`Match.ts:1320-1336`** (`this.pendingControl = null` 1322,
`ball.owner = null` 1323); the reception-side mirror `pendingControl` set
**`Match.ts:2698-2703`**, resolved **`resolvePendingControlAttempt` 2706-2725**;
`kickMisalignment` / `orientationNoiseMul` / `orientationPowerMul` at
**`mechanics.ts:78 / 83 / 88`**; the curl construction **`mechanics.ts:1266-1267`**;
`diveDifficulty` frozen at the strike instant **`mechanics.ts:1276-1281`**; the
`match.rng.gaussian()` spread draw **`mechanics.ts:1260`**; the ball-keyed
tackle radius `1.15` **`mechanics.ts:1757`**; `TURN_RATE = 6.5` (`Player.ts:17`);
`DT = 1/60` (`constants.ts:55`); the heading integrator toward `faceTarget`
capped at `TURN_RATE` **`Player.ts:305-334`**; `stunTimer` set on won/failed
tackles and keeper collisions (`mechanics.ts:1673-1678/1868/1881`,
`Match.ts:2064`); `KICK_COOLDOWN = 0.45` (`constants.ts:282`); `SHOT_SPEED = 27`
(`constants.ts:346`), `BALL_FRICTION_K = 0.55` (`constants.ts:82/92`);
`CONTACT_CONTROL_DELAY_TICKS = 3` (`constants.ts:265`, the mirror window). No
value moved and no line drifted between T0's date and HEAD.

---

## §LAW — FROZEN WITH CONSTANTS

The wind-up W is the number of ticks the body spends **committed-but-unstruck**
between the shot commit and the strike (contract §4.1). Its law starts from the
**T0 candidate MID bracket's SHAPE** (ruling #56.3(ii): "the W law starts from
the MID bracket's shape, mean ~0.111 s, cap 0.18 s < the 0.33 s spell,
constants T1's OWN to freeze with T0 derivations, mean-centered on the measured
t̄ = 0.4068"). The constants below are **T1's own, frozen here**; each is a T0
number, cited. The law reads **only** the body's own `|v|`, its heading sweep
rate `|ω|`, and its own `dribbling` attribute — **no opponents, no percepts, no
ball-context** (invariant I2, contract §4.2), and **no randomness** (invariant
I1's TIME-only spirit; the noise half of craft already lives in the orientation
/curl prices at strike time).

### The W law

```text
W(|v|, |ω|, tech) = clamp( W_BASE + W_MOVE·(|v| / V_REF)
                            + W_TURN·(|ω| / TURN_RATE)
                            − W_TECH·(tech − t̄),  W_FLOOR, W_CAP )   seconds

W_ticks = clamp( round(W · 60),  3, 11 )       (DT = 1/60; whole ticks)
readyTick = commitTick + W_ticks               (no randomness anywhere)
```

| constant | value | T0 derivation (cited) |
| --- | --- | --- |
| **W_BASE** | 0.06 s | T0 §5 candidate **MID** `W_BASE` verbatim — the central bracket ruling #56.3(ii) names as T1's start |
| **W_MOVE** | 0.05 s | T0 §5 MID `W_MOVE` — the move term; T0 §5(ii) found the move term dominates (78.06% of seat shots sprint, `|v|` p50 6.55 m/s) |
| **W_TURN** | 0.05 s | T0 §5 MID `W_TURN` — the turn term (`|ω|` p50 0.427, 9.89% hard-turning) |
| **W_TECH** | 0.05 s | T0 §5 MID `W_TECH` — technique buys the set-time back |
| **V_REF** | 7 m/s | role top-speed reference (`TOP_SPEED_REF`, the C6/T0 convention; T0 §5) |
| **TURN_RATE** | 6.5 rad/s | `Player.ts:17` (T0 §7) — the same rate the heading integrator caps at |
| **t̄** | **0.4068** | **measured population-mean dribbling** (T0 §5(ii); ruling #56.3(ii)) — the mean-centering anchor |
| **W_FLOOR** | 0.05 s (**3 ticks**) | T0 §5 MID `W_FLOOR`; floor > 0 (no free instant strikes, contract §4.2) |
| **W_CAP** | 0.18 s (**11 ticks**) | T0 §5 MID `W_CAP`; cap ≪ the 0.33 s median spell (#29.2, contract §4.2) |

* **tech = `dribbling`** (the attr that already scales the orientation prices,
  `mechanics.ts:1244+`), **mean-centered on t̄ = 0.4068** — the C6 T1
  mean-preserving / "tuckGain-style" convention (#56.3(ii)). At `tech = t̄` the
  technique term is exactly 0, so **the mean body's W is the headline**
  `W_BASE + W_MOVE·(|v|/V_REF) + W_TURN·(|ω|/TURN_RATE)`. Skilled bodies subtract
  more (shorter set-up); clumsy add (longer) — always inside the clamp.
* **Rounding rule (stated, no randomness):** the continuous W is first clamped to
  `[W_FLOOR, W_CAP]` in seconds, then **rounded to the nearest whole tick**
  (round-half-up), giving `W_ticks ∈ {3,…,11}`. `readyTick = commitTick +
  W_ticks`. 3 ticks = 0.05 s > 0; 11 ticks = 0.1833 s ≪ 0.33 s. **W carries no
  rng draw** — it is a deterministic function of the body's own state (I1/I2).

### The constants reproduce T0's MID sizing (verified)

| body | W (s) | W_ticks | W_eff (s) | T0 MID anchor |
| --- | --- | --- | --- | --- |
| **mean body** (`|v|` p50 6.55, `|ω|` p50 0.427, tech t̄) | 0.1101 | **7** | 0.1167 | T0 MID mean **~0.111 s** ✅ |
| **twisted sprinter** (`|v|` 7.41, `|ω|` 3.25, tech t̄) | 0.1379 | 8 | 0.1333 | T0 MID twisted sprinter **~0.14 s** ✅ |
| skilled (tech 0.7) at mean kinematics | 0.0954 | 6 | 0.100 | technique buys ~1 tick back |
| clumsy (tech 0.1) at mean kinematics | 0.1254 | 8 | 0.133 | clumsy pays ~1 tick |

The mean-body W (0.110 s, 7 ticks) lands on T0's MID central expectation; the
whole population sits in the low tenths (3–11 ticks), floor > 0, cap ≪ spell —
exactly contract §4.2. The sizing smoke (§STAGING) confirms the live tick
distribution: p10 6 / p50 7 / p90 8 ticks, mean 0.1136 s.

**What the law never reads (I2, contract §4.2, restated as a freeze):** no
opponent positions, no percepts, no ball-context, no rng. A "hurry because
pressured" term would be the omniscient auto-reflex the ShieldHold genre was
caught being (#36) in a time costume. Pressure effects must **EMERGE**: real
defenders really arrive during real windows, and the existing ball-keyed attack
does the rest.

---

## §SEAM — spec only, no code (the mirror of `pendingControl`)

`pendingKick` is the release-side mirror of the reception-side `pendingControl`
(`Match.ts:2698-2725`), a running machine the engine already trusts: a body
committed-but-unresolved for a fixed tick window that can still fail.

* **Flag `c7Windup`, default OFF** (invariant I4). Lives as `Match` config, null
  in every production path (Road B; #56.3 nothing ships). A default-off test pins
  it; the fingerprint is unchanged.

* **The single fork point** is the **shot commit, `PlayerBrain.ts:962-968`**
  (`case 'Shoot'`, `kickKind !== 'freeKick'` → `performShot`). This is the only
  place `c7Windup` is read (single-seam test, §GATES).

* **On the OFF path (default), and for every excluded release path** (free-kick,
  header, pass, cross, clearance, through-ball, keeper distribution), the code is
  **exactly as shipped**: `match.performShot(p)` runs synchronously on the commit
  line, `kickBall` on the same tick — byte-for-byte today's strike, no rng draw
  added, no reordering (I4).

* **On the ON path, at an open-play/one-touch shot commit**, instead of the
  synchronous `performShot`, the body enters:

  ```text
  pendingKick = { gid, readyTick = stepCount + W_ticks(|v|,|ω|,dribbling) }
  ```

  and the strike does **not** run this tick. `W_ticks` is read from §LAW at the
  commit instant. The commit-time kinematics (`|v|`,`|ω|`) are the body's own,
  measured exactly as the mirror reads its claim state.

* **What the body does during the window** (`stepCount ∈ [commitTick,
  readyTick)`) — this IS the quality mechanism (contract §4.3.2):
  * **The heading integrator keeps running toward the aim.** The seam sets the
    committed body's **`faceTarget` to the shot aim point** for the window's
    duration, so `physicsStep` (`Player.ts:305-334`) rotates `heading` toward the
    aim at ≤ `TURN_RATE` (6.5 rad/s) every tick — the live analogue of T0's
    θ-decay arithmetic (`θ(W) = max(0, θ_commit − TURN_RATE·W)`). A body left
    alone arrives at the strike better aligned and pays LESS of the EXISTING
    misalignment price. **No new orientation term is written** (I1); the body
    simply turns, and the strike reads its improved heading.
  * **The body is committed and cannot re-decide** (the mirror of
    `CONTACT_COMMIT_TIME`): its `action` stays `{ type: 'Shoot' }` and the brain
    does not re-enter the switch while `pendingKick` is live (the C5-hold /
    `pendingControl` precedent of a forced action held between decisions).
  * **Movement state:** the executor's "kick already happened → brief
    follow-through" (`actionExecutor.ts:454-463`) does **not** apply during the
    window (the kick has NOT happened yet); the committed body plants to strike
    (movement target held so it does not dribble the ball out of range — the
    P-DRIFT pathology is pre-laid in §READINGS). The body's own physics (drift,
    fatigue) continue exactly as the engine runs them.
  * **The ball stays OWNED at its carry offset**: `ball.owner === shooter`
    throughout the window; the seam **never writes `ball.owner`** and never
    plants the ball into flight. The carry offset is the shipped
    `owner.pos + heading·0.9`-family carry the engine already maintains for an
    owned ball — untouched (C6 is certified and its offset is not re-opened here;
    C7 prices TIME, not carry geometry).

* **Resolution at `readyTick`** (the strike, still owned / not stunned / not sent
  off / phase still `playing`): the seam calls the **EXISTING `performShot` math,
  evaluated AT STRIKE TIME** — verbatim, once (I1). The deferred quantities, each
  read against the body's *strike-instant* state, are the existing functions,
  **named for the structural test** (contract §4.1, code-cited):
  * `kickMisalignment(shooter, aim)` (`mechanics.ts:1249 → 78`) — now against the
    integrated heading;
  * `orientationPowerMul(misalign, dribbling)` (`mechanics.ts:1268 → 88`);
  * `orientationNoiseMul(misalign, dribbling)` (`mechanics.ts:1259 → 83`);
  * the **curl** construction (`mechanics.ts:1266-1267`);
  * the keeper **`diveDifficulty`** frozen at the strike instant
    (`mechanics.ts:1276-1281`);
  * and the single `match.rng.gaussian()` spread draw (`mechanics.ts:1260`),
    consumed **exactly once, at strike time** — not at commit, not twice (I1;
    strike-math-evaluated-not-duplicated, §GATES).

  Mechanically the resolution is `performShot` run at `readyTick` — the identical
  function body, reached from the seam instead of from the commit line, reading
  the body's now-current pos/heading/dribbling and the keeper's now-current pos.

* **Interruption channels — each resolves through its EXISTING path** (I3: no new
  attack surface, no new loose-ball channel), event-keyed:
  * **tackle wins the ball in-window** — the existing ball-keyed `tryTackles`
    (`mechanics.ts:1726/1757`, `dist(o.pos, ball.pos) < 1.15`) reaches the still-
    owned ball and wins it through its EXISTING channel; `pendingKick` is
    abandoned, no strike (class **INT-TACKLE**);
  * **carrier stunned in-window** — an existing `stunTimer > 0` on the shooter
    (a failed-tackle foul stumble, a keeper collision — `mechanics.ts:1673-1678`,
    `Match.ts:2064`) voids the strike, mirroring `resolvePendingControlAttempt`'s
    `stunTimer` guard (`Match.ts:2711`) (class **INT-STUN**);
  * **carrier sent off in-window** — existing `sentOff` (class **INT-SENTOFF**);
  * **phase leaves `playing` in-window** — whistle / stoppage / half (class
    **INT-PHASE**).
  On any interruption the ball's fate is whatever the EXISTING channel does
  (won by the tackler, or still owned by a stunned shooter); the seam adds
  nothing. `pendingKick` is cleared.

* **State the seam needs (spec):** the `pendingKick` record `{ gid, readyTick }`
  on `Match` (mirror of `pendingControl`), and the body's `faceTarget` driven to
  the aim during the window. This is engine bookkeeping; the §LAW still reads only
  `|v|`, `|ω|`, `dribbling` (I2 preserved).

* **Untouched** (I5/I6/I7): `pendingControl` (the reception mirror, never the
  seat); `KICK_COOLDOWN` (post-release); `firstTouchWindow`/`oneTouchMul`; the
  restart run-up; `executedPassPower`; curl/spin construction; C4 flight
  machinery; `heading`/`TURN_RATE` semantics. The keeper reads the strike instant
  exactly as today (I6 — no keeper anticipation of the held ball).

---

## §GATES — all frozen ex ante; every floor derived from T0 (#24); no
max-statistic (#32.1)

Cluster unit for every CI = **match seed** (#20); a rate/shift is *resolved* only
when its match-seed cluster-bootstrap CI excludes its reference; a null is
reported as such, never re-cut (contract §8).

### X-family (OFF identity, determinism, single seam, the two structural tests)

| gate | predicate |
| --- | --- |
| **X-SRC** | `git diff --stat -- src` shows the seam only; the run's diff at run time is the frozen implementation, nothing else |
| **X-FP** | league fingerprint identical to the frozen baseline `57b0bdab…c673` with `c7Windup` OFF (nothing armed in production) |
| **X-OFF-IDENT** | with `c7Windup` OFF, world signatures **byte-identical** to pre-change HEAD across **3 league seeds × 2 seasons** (I4 — the synchronous strike verbatim) |
| **X-SEAM** | a single-seam test asserts `c7Windup` is read in **exactly one place** (the `PlayerBrain.ts:962-968` shot-commit fork), is null on a fresh `Match` and a `League` fixture, and does **not** gate any excluded release path (free-kick / header / pass / cross / clearance / through-ball / keeper distribution) |
| **X-DET** | two `runExperiment()` invocations produce **byte-identical** output JSON; the table SHA is emitted and quoted in the run result |
| **X-STRUCT-1 — SEAM-NEVER-RELEASES-OWNERSHIP (I3, #56.3(iv))** | asserted TWO ways: (a) a **unit test** — on a fixture where `pendingKick` is set and stepped through the window, `ball.owner === shooter` on **every** window tick and the seam code path performs **no** write to `ball.owner`; (b) a **fork ownership-release ledger** — every ownership release on ON forks classes to an **existing named channel** (strike-at-`readyTick`/`kickBall`, tackle-won, stun-drop, sent-off, phase-leave); **releases attributable to the `pendingKick` seam itself must be exactly 0.** Any unattributable release ⇒ FAIL, stop at the commander |
| **X-STRUCT-2 — STRIKE-MATH-EVALUATED-NOT-DUPLICATED (I1, #56.3(iv))** | asserted TWO ways: (a) a **unit test** — an instrumented counter shows the deferred strike math (`kickMisalignment`/`orientationPowerMul`/`orientationNoiseMul`/`curl`/`diveDifficulty` and the `match.rng.gaussian()` spread draw) runs **exactly once** per shot that reaches `readyTick` (and **zero** times for a shot interrupted before `readyTick`), **never at commit and never twice**; (b) an **rng-stream check** — the ON fork consumes the identical count of `match.rng` draws per struck shot as the OFF fork's synchronous strike (I1: no rng added, no reordering), so a struck shot's math is the shipped math relocated in time, not duplicated |

### FIDELITY — per-tick window ledger; unexplained exactly 0 (#49.3)

On every ON window tick, the applied window state **equals the §LAW spec to
1e-9 where applicable** — `readyTick = commitTick + W_ticks`; the body's
`faceTarget` equals the aim; `heading` rotates by ≤ `TURN_RATE·DT`; the ball
sits at its owned carry offset — and **unexplained is exactly 0** over the
enlarged class set. Every forked shot commit maps to **exactly one** event-keyed
resolution class (#38.1; per-record receipts `{seed, tick, gid, cause}`, capped
at 1,000/class, #49.3):

```text
STRUCK        reached readyTick owned / not stunned / not sent off / playing;
              the deferred performShot math executed once
INT-TACKLE    a ball-keyed tackle won the ball inside the window (existing channel)
INT-STUN      the shooter's stunTimer > 0 inside the window (existing event)
INT-SENTOFF   the shooter was sent off inside the window (existing event)
INT-PHASE     phase left 'playing' inside the window (whistle/stoppage/half)
E-INJURY      an advantage-foul injury to the shooter inside the window: a
              same-gid attrs mutation post-commit-read (takeKnock, Player.ts:223)
              OR a same-gid becomeSub reposition without release (Match.ts:2042) —
              the #49 house class, carried verbatim
E-ENDED       the match ended inside the window (phase leaves 'playing' at time)
```

Per #32.1 this is a **per-record / event-keyed fidelity check with named
exception classes**, never a coupon-collector max-statistic over the tick stream.
The INT-* classes are the axis-1 numerator (a designed, legitimate resolution);
they are named exceptions to the STRUCK path, **not** unexplained ticks. Any
forked commit that does not map to exactly one class ⇒ unexplained > 0 ⇒ FAIL
(reading (F)).

### PRICED DIRECTION — TWO AXES, never conflated (#47.5(i) / #56.3(i))

The interruption axis and the misalignment-price axis are **separate axes**;
they may never be conflated. Bands are T0-derived with the **½×–1.5×
recompute-to-live transfer convention** (#48 precedent; T0's recompute is a
bodies-frozen counterfactual, T1's live forks let bodies react, so the tolerance
is symmetric in ratio around the recompute). **The band is an INTERPRETATION
bracket, not the HARD gate**; the HARD gate is the CI form.

**Axis 1 — interruption rate on forked shot commits RISES from ~0.**
Today the charge-down rate on shots is **~0** (the release is synchronous; the
committed-but-unstruck tick does not exist — contract §1, map §4). T0's MID
counterfactual recompute (PRIMARY current-closing reach model) is **12.12%**,
CI **[11.13%, 13.11%]** (T0 §5(iv); the frozen T1 W law IS the MID bracket).

* **HARD gate:** the interruption rate on forked seat-shot commits (INT-* /
  forked commits) — match-seed cluster-bootstrap CI **excludes zero (UP from
  ~0)**.
* **Interpretation band (½×–1.5× of the T0 MID recompute):** **[6.1%, 18.2%]**
  (½×12.12 = 6.06, 1.5×12.12 = 18.18). Landing inside is the design case;
  landing outside but still UP is reading (D-band), returned to the commander,
  not re-cut. (The sizing smoke's 9.79% sits inside this band.)

**Axis 2 — the misalignment price paid at strike FALLS for uninterrupted shots.**
The heading integrator runs during the window, so θ at strike < θ at commit and
the EXISTING orientation prices are paid LESS. The **exact measured quantity** is
the **realised `orientationNoiseMul` / `orientationPowerMul` delta at strike vs
at commit, paired per uninterrupted shot** on the ON fork:

```text
noise reduction = orientationNoiseMul(kickMisalignment(θ_commit), drb)
                − orientationNoiseMul(kickMisalignment(θ_strike), drb)     (aim spray removed)
power gain      = orientationPowerMul(kickMisalignment(θ_strike),  drb)
                − orientationPowerMul(kickMisalignment(θ_commit),  drb)     (power regained)
```

θ_commit is the shooter's body↔aim angle at the commit tick (the OFF fork's
strike instant, where θ_strike ≡ θ_commit by construction — pairing confirms the
OFF delta is 0); θ_strike is the same angle at `readyTick` on the ON fork. T0's
MID head-room (T0 §5(iv)): mean **noiseMul drop −4.37 pp**, mean **powerMul gain
+1.23 pp**. Per #56.2 the **NOISE channel is the larger price and the primary**.

* **HARD gate (primary, NOISE):** the paired realised noise reduction over
  uninterrupted shots — CI **excludes zero in the reducing direction** (spray
  falls at strike vs commit).
* **HARD gate (secondary, POWER):** the paired realised power gain — CI
  **excludes zero in the priced direction** (power rises at strike vs commit).
* **Interpretation bands (½×–1.5×):** noise reduction **[2.19 pp, 6.56 pp]**;
  power gain **[0.62 pp, 1.85 pp]**. Inside = design case; outside-but-right-sign
  = reading (D-band), returned, not re-cut. (The sizing smoke's −3.04 pp noise /
  +0.86 pp power sit inside these bands, tail-thinned exactly as T0's smoke was
  vs its census.)

### SHOT-OUTCOME ECONOMY — REPORTED, not gated

Goals, on-target share, and blocked share on the forked shots (ON vs OFF,
paired) are **REPORTED with their CIs, never gated** (contract §6-T1: "shot-
outcome economy REPORTED"). C4's I2 conversion-ceiling doctrine is noted: MORE
goals is not a deliverable. Any anomaly is a reading (§READINGS), not a re-cut.

---

## §STAGING — frozen

* **Instrument:** **fork-and-force paired same-seed at seat-shot commits**
  (contract §6-T1). At each open-play/one-touch shot commit during playing time,
  the pre-commit world is cloned and run twice from the same seed — once
  `c7Windup` OFF (today's synchronous strike at the commit tick, the paired
  baseline), once ON (`pendingKick`, strike at `readyTick`). The OFF fork's
  strike instant is the θ_commit / price reference for axis 2; a shot never
  reached (excluded release path) contributes 0 by construction. **T0's per-
  candidate exposure/head-room are recomputes on RECORDED trajectories; the LIVE
  forks may differ** because bodies react — that is exactly what T1 tests, and
  §READINGS pre-lays what a divergence means.

* **Fork window — PINNED ex ante (#48.4 / #56.3(iii)).** The window runs from
  **the commit tick to the strike (`readyTick`), plus a post-strike observation
  horizon of `readyTick + 2.0 s`.**
  * The **two PRICED axes live entirely in `[commitTick, readyTick]`** — the
    ≤ 11-tick (0.1833 s) wind-up. Axis 1's interruption is any INT-* resolution
    inside this sub-interval; axis 2's price delta is θ_commit (commit tick) vs
    θ_strike (`readyTick`), paired.
  * The **post-strike horizon `[readyTick, readyTick + 2.0 s]`** is for the
    **REPORTED shot-outcome economy** only (the fired shot's goal/save/block/miss
    resolution). **Justification (code-cited):** a struck shot leaves at
    `SHOT_SPEED = 27 m/s` (`constants.ts:346`) and decays under
    `BALL_FRICTION_K = 0.55` (`constants.ts:82`); the keeper's `diveDifficulty` is
    **frozen at the strike instant** (`mechanics.ts:1276-1281`) and resolves
    within a handful of ticks, and `tryShotBlock` intercepts in-flight — a box-
    range ground shot reaches the goal line / keeper / block well inside 2.0 s
    (the friction flight-time parameter caps at `−ln(1−0.85)/0.55 ≈ 3.45 s` only
    for the longest theoretical carry; 2.0 s covers the shot population's
    resolution). Forks whose **match ends inside the window/horizon are EXCLUDED
    with the count REPORTED** (E-ENDED; the standing #48.4 convention).

* **Seed block — fresh, disjoint from every consumed range (#46.2):** seeds
  **`7,300,000 + b·100,000 + k`, `b ∈ 0..5`, `k ∈ 0..99` = 600 matches**,
  **7.3M–7.8M**. Consumed elsewhere and cleared: P0 930k · P1 960k–1.46M · P1R
  980k–1.48M · P2-A 2.0M–3.2M · P2-B 3.5M–3.9M · C4/C5 700k–970k · C6 T0 smoke
  4.0M, census 4.1M–4.7M · C6 T1/T1R 5.0M–6.1M · C6 T2 6.2M–6.5M · **C7 T0 smoke
  6.6M · C7 T0 census 6.7M–7.1M · C7 T1 sizing smoke 7.2M** (§below).
  **7,300,000 lies above every consumed range, above all of C7 T0, and one
  stride above the T1 sizing smoke.**

* **Sizing smoke — DISCLOSED (#44.5 / #46.2), the floors' basis (#24).** A
  read-only, pure-arithmetic recompute at the FROZEN T1 W law (T0's §2(iv)
  method: no fork, no flag, no `src/**`) ran **16 matches, block 7,200,000**
  (disjoint above T0's 7.1M census, one stride below the fork block), HEAD
  `58a8b42`, **twice byte-identical**. Script
  [`../../scripts/probes/c7-t1-sizing-smoke.ts`](../../scripts/probes/c7-t1-sizing-smoke.ts),
  committed beside this doc. It measured ATTAINABLE rates only (no fork, no
  comparison), verbatim:

  ```text
  === C7 T1 SIZING SMOKE (frozen T1 W law) ===
  matches 16, seedOffset 7200000, total steps 243469
  total shots logged: 258 (16.13/match)
  v1 SEAT (openplay+onetouch): 143 (8.94/match)
  W ticks: p10 6 p50 7 p90 8
  W sec:   p10 0.1000 p50 0.1167 p90 0.1333  mean 0.1136
  seat shots (F-SHOT-SEAT):                 143 (8.94/match)
  interrupted, PRIMARY reach (F-INTERRUPTED): 14 (9.79% of seat, 0.875/match)
  uninterrupted (F-UNINTERRUPTED):           129 (8.06/match)
  twisted>=30 uninterrupted (F-TWISTED-UNINT): 23 (1.438/match)
  head-room (uninterrupted): mean powerMul gain +0.86pp; mean noiseMul drop -3.04pp
  ```

  These are RATES; using them to set floors is floor derivation, not a result
  peek (#44.5). The W distribution (p50 7 ticks, mean 0.1136 s) confirms the
  frozen law; the interruption rate (9.79%) sits inside axis 1's band; the head-
  room direction is confirmed (noise the larger price), tail-thinned vs T0's
  census exactly as a small smoke is.

* **Population sizing (#24), from T0's 8.98 seat/match (smoke 8.94/match):**
  600 matches ⇒ **~5,364 seat shots** (2× T0's 4,490 census scale). Floors,
  every one ≥ 2× headroom (the C6/T0 convention), the interrupted floor powering
  axis 1:

  | floor | expected @ 600 matches | frozen floor | basis |
  | --- | --- | --- | --- |
  | **F-SHOT-SEAT** forked open-play + one-touch commits | ~5,364 (8.94/match) | **≥ 2,400** | 2.24× |
  | **F-INTERRUPTED** interrupted forked commits (INT-*), the axis-1 numerator | ~525 (smoke 9.79%); ~327 at the pessimistic ½× band 6.1% | **≥ 150** | **the binding gate**; 2.18× even at the ½× band, per the P1R 150-count SE≤3pp convention (contract §8: too thin ⇒ fork returns to the commander) |
  | **F-UNINTERRUPTED** uninterrupted forked commits, the axis-2 population | ~4,836 (8.06/match) | **≥ 2,000** | 2.42× |
  | **F-TWISTED-UNINT** uninterrupted with θ ≥ 30° at commit (the head-room tail) | ~863 (1.438/match) | **≥ 400** | 2.16× |

  If the forked seat-shot population comes in below F-SHOT-SEAT, or the interrupted
  count below F-INTERRUPTED, that is a **finding, not a licence to lower the
  floor** (contract §8): the fork returns to the commander before any reading is
  drawn.

* **Cluster unit** = match seed (disjoint per block), #20. **Bootstrap** = a
  frozen `BOOTSTRAP_SEED`, cluster resampling over match seeds.

* **Output:** `docs/world-model/data/c7-t1-pendingkick.json`, committed as SHA'd
  data with the run result; the table SHA quoted in the result section and
  reproduced by X-DET. The sizing smoke output is reproduced above; its script is
  committed with this freeze.

* **Divergence semantics, pre-laid:** because the live forks may diverge from the
  recorded-state recompute, a mismatch between a live axis and T0's counterfactual
  is **information about live reaction**, read via §READINGS — never a reason to
  re-cut the law, the bands, the window or the floors.

---

## §PRE-LAID READINGS — the full sign space (#38.1)

Written before the run; not one may be re-cut after sight (contract §8). Each
carries its disposition.

* **(A) BOTH AXES RESOLVE — the design case.** Axis 1 resolves UP from ~0 (CI
  excludes zero, point in [6.1%, 18.2%]) AND axis 2 resolves in the priced
  direction (the noise reduction CI excludes zero, ~−4.37 pp; power gain CI
  excludes zero, ~+1.23 pp). The wind-up delivers both the charge-down channel
  and the composed-vs-rushed payoff through prices that already exist.
  Disposition: **return to the commander**, who may then consider T2 (T1 cannot —
  §NON-CLAIMS).

* **(B) INTERRUPTIONS ~0 LIVE — the static-defender fact killed the channel.**
  Axis 1's CI contains zero, or F-INTERRUPTED is not cleared. This is a **live
  reading, pre-flagged by #56.2**: T0 measured defenders near shooters but
  near-but-STATIC (closing speed p50 0.157 m/s), so the recompute's 12.12% may
  not survive live because the near defenders never actually close inside the
  window. A finding about this world's bodies (they do not yet anticipate shots),
  not a defect. Disposition: **return to the commander**; no re-cut. Axis 2 may
  still resolve — the two axes are separate.

* **(C) QUALITY DELTA NIL — the heading integrator did not converge.** Axis 2's
  CIs contain zero: θ did not decay across the window as the arithmetic predicted
  (e.g. bodies are already re-aligned by commit — T0 θ p50 9.51° — so the mean
  delta is negligible; or `faceTarget` did not drive the heading as spec'd). A
  **mechanism finding**: time-buys-quality is not there through the existing
  prices at v1 scope. Disposition: **return to the commander**; no re-cut. Axis 1
  may still resolve.

* **(D) EITHER AXIS WRONG DIRECTION, or OUTSIDE ITS BAND.** *(D-sign)* A resolved
  wrong-sign shift — interruption resolving impossibly, or the misalignment price
  RISING at strike (CI excludes zero on the wrong side) — is a finding about the
  live world the recompute inverted. *(D-band)* An axis resolves in the right
  direction but its point lands outside its ½×–1.5× interpretation band (still
  right-signed). Disposition for both: **return to the commander** with the
  discrepancy quantified; no re-cut of law, bands, window or floors.

* **(E) THE WINDOW CAUSES PATHOLOGICAL BEHAVIOUR in the fork** — unforeseen
  carrier/keeper interactions during the committed window. Named classes,
  pre-laid: **P-DRIFT** (the committed body's residual motion dribbles the ball
  out of shooting range or off the pitch before `readyTick`, producing degenerate
  or relocated strikes); **P-KEEPER** (the keeper, reading the still-owned ball
  through EXISTING reads, behaves anomalously versus the synchronous baseline —
  e.g. rushes the committed shooter); **P-REOWN** (ownership churn: the committed
  ball is re-captured/traded within the window through some path the seam did not
  foresee). Any P-class firing above a de-minimis rate is a **structural finding**
  — the wind-up interacts with the world in a way v1 did not model. Disposition:
  **return to the commander**; no re-cut (a P-class is diagnosed and reported with
  receipts, like the C6 E-INJURY genre, #49.3).

* **(F) ANY X / FIDELITY / STRUCTURAL GATE FAILS ⇒ FAIL, the queue stops at the
  commander** (contract §8), whatever the priced axes say. Unexplained > 0, an
  unattributable ownership release (X-STRUCT-1), duplicated/relocated strike math
  (X-STRUCT-2), OFF not byte-identical, or non-determinism all fire here. This is
  the C6 T1 precedent (a fidelity FAIL published the axes labelled-but-uncertified
  and returned to the commander for a named exception class).

* **(G) KICK-ECONOMY ANOMALIES — REPORTED.** Any shift in goals / on-target /
  blocked (the shot-outcome economy) is **REPORTED with its CI, never a re-cut
  and never a gate** (contract §6-T1; C4's I2 ceiling doctrine noted). A large
  swing is a reading for the commander's eye and for T2's §2 band, not a T1
  verdict.

---

## §NON-CLAIMS (contract §9, verbatim)

C7 v1 makes no claim about passes, crosses, headers, clearances or keeper
distribution (each keeps today's synchronous release). No shoot-early-vs-set
CHOICE is added — **the wind-up is physics; the choice seat is a future
C5-family slice** (no chooser reads W; selection sees outcomes). **No keeper
anticipation** — the keeper reads the strike instant exactly as today (I6). **No
claim that holding now pays** — that is exactly what the post-C7 C5 re-census
MEASURES (#54.4), and pre-judging it would be the E5h ×1.3 hazard in a time
costume. The estimand boundary, stated once: **C7 prices the TIME a strike takes;
it does not price where the ball goes** — every downstream quality effect must
arrive through prices that already exist.

Additional freeze non-claims: **T1 cannot authorize T2** — a design-case (A)
reading is a licence for the **commander** to authorize T2, nothing more.
**Nothing ships (Road B):** `c7Windup` is off in every production path through
the whole stage; the fingerprint is unchanged; there is no default-ON. **No new
gene, no new attribute** — `dribbling` is the only attribute input (I8), and it
enters only through the mean-centered technique term. **C6 is not re-opened** —
the owned-ball carry offset is the shipped one; C7 prices TIME, not carry
geometry.
