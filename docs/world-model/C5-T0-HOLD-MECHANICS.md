# C5 T0 — Hold + fork mechanics, dormant

Status: **PRE-REGISTERED 2026-07-27 — gates frozen below before any
implementation.** Drafted by the autonomous session under the C5 design
contract ([`C5-TIME-DIMENSION.md`](C5-TIME-DIMENSION.md) §3 T0, §4 Q1/Q4/Q6).
Nothing here may be tuned after first sight of results.

Date: 2026-07-27

## 1. What T0 is for

The design contract's stage line is four clauses: *flag family
`c5Hold`/`c5TouchFork`, zero live callers, fingerprint unchanged flags-off,
two-run determinism, X-style flag-off identity pins — and **the shield becomes
a body position; the poke/tackle window against it opens (I1)***.

So T0 builds the **capability** and proves two things about it: that the world
without it is bit-identical, and that the thing built is **not a free option**.
It measures nothing about whether waiting pays — that is T1's census, and T0 is
deliberately blind to it.

### 1.1 One finding from the Phase-0 map that shapes the build

Reading `mechanics.ts:1713–1808` before designing: **the attack surface already
exists and already punishes standing still.**

- The tackle search is on **`dist(o.pos, ball.pos) < 1.15`** (`1726`) — it
  measures the **ball**, not the man. So a ball placed on the far side of a
  body is harder to reach *by existing geometry*, with nothing added.
- `owner.attrs.strength * 0.1` (`1785`) already shields the standing challenge.
- `helpClose && drive < 0.45 ⇒ p += 0.12` (`1804`) — a **stopped, doubled**
  carrier is already dead meat.
- The jockey early-return (`1755`) keys on `driveNow`, so a stationary holder
  does **not** escape the challenge.

**Therefore T0 does not invent an attack.** It makes the shield a deliberate
body position, adds the one cost that is genuinely missing (stamina), and then
**measures** whether the existing attack still reaches a hold. That reframing
also names T0's real risk, which the gates below are built around:

> ⚠️ Placing the ball on the far side of the body could make holding **safer
> than carrying** — a free option in a new costume, which is exactly E5h's
> `×1.3` lesson and C1-A2's. **I1 is therefore gated as a CEILING on hold
> survival, not merely as "loss is possible".**

## 2. What gets built

All of it dormant. `MatchConfig` only — `League.matchFlags` is **not** extended
at this stage (T2 needs it and can add one line under its own contract).

1. **`c5Hold`** (`MatchConfig`, default `EDS_BUNDLE_ARMED` = false)
   - a new `ActionType` **`'ShieldHold'`** — *new*, beside the legacy `HoldUp`,
     which is not touched (design contract Q4);
   - an executor case that turns the body so the **ball is on the far side of
     the holder from the nearest opponent**, and holds station (or carries
     protectively at walking pace away from the threat). The ball placement
     rides the existing glue (`Match.ts:1276–1283`) — **C6 owns de-gluing and
     this stage must not touch it**;
   - a **stamina drain per held second**, scaled by pressure and the holder's
     own attributes. This is the only cost T0 adds, because §1.1 says it is the
     only one missing.
2. **`c5TouchFork`** (`MatchConfig`, default false) — an **elective**
   first-touch window: a receiver may take the window that today only pressure
   grants him (`Match.ts:1195–1203`). No pricing changes: the elected window
   must enter exactly the same `oneTouchMul` / `touchFailChance` paths
   (`mechanics.ts:262`, `109`).
3. **`Match.forcedHold: { gid, untilTick } | null`** — the probe seam, modelled
   on `forcedPassTarget` (`Match.ts:396`) and null in every production path. It
   is the *only* way `ShieldHold` can be reached in T0, which is what "zero live
   callers" means here: no `cands` entry produces it.

## 3. Gates

### 3.1 X-series — identity (any failure ⇒ FAIL)

| gate | predicate |
| --- | --- |
| **X1** | `npm run fingerprint` returns `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`, unchanged |
| **X2** | **flag-off identity**: `c5Hold` + `c5TouchFork` **armed**, `forcedHold` null and no fork elected, produces **byte-identical world signatures** to flags-off on 3 league seeds × 2 seasons. Arming alone must change nothing |
| **X3** | **legacy untouched**: `HoldUp`'s gate (`PlayerBrain.ts:599–614`), its executor (`actionExecutor.ts:387–405`) and its `layingOff` consumers (`281`/`326`/`392`) are byte-unchanged, and a legacy-brain match reproduces its scores/stats exactly |
| **X4** | **zero live callers**: a test asserts (a) no `cands` entry can emit `ShieldHold`, (b) `forcedHold` is null on a fresh `Match` and after `League.createMatch`, (c) neither flag appears in any `EDS_PREVIEW_MODES` flag set |
| **X5** | two `runExperiment()` calls byte-identical; SHA-256 emitted |

### 3.2 A-series — the anatomy probe (the mechanics are real AND not free)

Cluster unit per ruling #20: the **match seed**. All intervals are
2,000-resample cluster bootstraps over seeds.

| gate | claim | predicate |
| --- | --- | --- |
| **A1** | the shield is a body position | at forced-hold ticks, `dist(threat, ball) > dist(threat, holder)` in **≥ 90%** of held ticks. The matched carry arm's rate is **reported beside it**, never gated |
| **A2a** | **I1 — losable** | ownership survival after **1.5 s** of forced hold, split by three pre-registered pressure bands, is **strictly decreasing** in pressure |
| **A2b** | **I1 — the CEILING (the anti-subsidy gate)** | in the **highest** pressure band, survival at 1.5 s is **< 0.90**. A hold that survives a real press nine times in ten is the free option this gate exists to catch |
| **A2c** | holding costs legs | mean stamina spent per held second is **> 0** and rises across the three pressure bands |
| **A3** | **mis-executable — the gradient** | survival at 1.5 s split by holder `strength` terciles: **top − bottom ≥ 3.0pp**, with the cluster-bootstrap CI lower bound **> 0**. An option with no gradient is decorative (C1-A2's lesson) |
| **A4** | the fork is price-identical | an **elected** one-touch window and a **pressure-granted** one at the same state produce byte-identical outcomes — the elected path adds no pricing of its own |

**A3's power, derived and attainable ex ante** (rulings #19 + #24): survival is
binary at p ≈ 0.8, so σ² ≈ 0.16; detecting 3.0pp between terciles at 80% /
α = 0.05 needs `SE ≤ 0.03/2.8` ⇒ `0.32/n ≤ 1.15e-4` ⇒ **n ≥ 2,790 per
tercile**. Budget **10,000 forced holds** (≈ 3,300 per tercile). **Attainability
is not in question and that is stated rather than assumed**: a forced hold can
be staged at *any* ball-owner tick, so this floor is budget-bound, not
population-bound — the opposite of E5g's P2, and the reason that failure cannot
recur here.

### 3.3 Reported, never gated

Survival curves for the carry baseline arm; hold duration vs pressure; the
tackle-versus-poke split of how holds are lost; ball-to-threat distance
distribution; per-cluster rates for every A-gate.

## 4. Stop rules

- **Any X gate fails ⇒ FAIL, nothing is committed live.** These are identity
  pins; a dormant stage that changes the flags-off world has failed at its only
  real job.
- **A1 fails** ⇒ the shield is not a body position; the build is wrong, back to
  the commander.
- **A2b fails (survival ≥ 0.90 under pressure)** ⇒ **I1 is violated and the
  queue stops.** Per the design contract §6 and §4 Q6 this is not tunable by
  this session: a free hold is the failure mode the whole invariant exists for,
  and the fork returns to the commander.
- **A3 fails** ⇒ the hold is decorative; report and return, no re-powering
  after sight.
- No stage may be rescued by tuning a neighbour (design contract §6).

## 5. What T0 does NOT do

- No live caller, no `cands` entry, no default changed, no preview mode.
- No claim, and no measurement, about whether waiting **pays** — T1's census
  owns that, and T0 is built blind to it on purpose.
- No de-gluing (C6), no wind-up (C7 / T5+), no scan action (seat 2 parked), no
  change to `stagnation` or to legacy `HoldUp` (Q3, Q4).
- Nothing in the E4 preview: the user cannot reach any of this.

## 6. Result — RUN 2026-07-27: **FAIL** (A2a, A3). The queue stops.

SHA `d7303d51…21d5`, twice byte-identical. **10,000 forced holds over 63
clusters.** X-series 6/6, fingerprint `57b0bdab…c673` unchanged, 820/820 tests,
tsc + build clean.

**Commander's binding interpretation, recorded here because it governs how §6
is read** (issued at approval, moving no gate): *A2b passing means only that a
hold is losable under a real press. It does **not** mean holding is not a free
option — that is a comparison on the outcome axis and belongs to T1's census
and T3's dominance ceiling. Nobody may cite A2b's PASS as proof of not-free.*

| gate | result | |
| --- | --- | --- |
| **A1** far-side ≥ 90% | **95.81%** (706,108 / 737,014 held ticks) | ✅ |
| **A2a** survival strictly decreasing in pressure | **72.82% → 80.32% → 68.81%** | ⛔ |
| **A2b** top-band survival < 90% | **68.81%** | ✅ |
| **A2c** stamina > 0 and rising | **0.00095 → 0.00414 → 0.00657** /s | ✅ |
| **A3** strength gradient ≥ 3.0pp, CI > 0 | **−3.44pp**, CI [−6.72, +0.18] | ⛔ |
| coverage / determinism | 10,000 trials; two runs byte-identical | ✅ |

### 6.1 A2a — and a third reading neither pre-laid one covers

Band n's are 2,064 / 1,357 / 6,579 (the frozen cuts put two thirds of
ball-owner moments in the top band, median `pressureAt` ≈ 0.67 — reported, not
re-cut). The mid→high step falls as predicted; **the low→mid step rises**, and
that is the whole failure.

⭐ **The loss-cause column says why, and it is a third reading:**

```text
lost to a TACKLE, by band:   3.44%  →  14.59%  →  22.60%
```

**The tackle channel is perfectly monotone.** The world *does* order holds by
pressure on the channel pressure drives. What A2a measured is *ownership
survival*, which bundles tackles with dead balls, whistles and every other
termination — and in the low band only 3.44% of trials lose to a tackle while
27.2% lose the ball, so **the low band's number is dominated by causes pressure
has no reason to order.**

So the honest answer to the commander's pre-laid fork is neither of the two
options: it is not (yet) evidence of band-composition artefact, and it is not
evidence that the world fails to order by pressure. **It is a gate-definition
limitation I own**: A2a was written on the wrong channel. Had it been written on
tackle-loss it would have passed cleanly, and that column was already in the
reported set. It is **not** re-cut here — the gate stands as fired, and
re-writing it is a redraw decision with a #19 re-powering attached.

### 6.2 A3 — the gradient is NEGATIVE, and my gate is confounded

| tercile | mean strength | n | survival |
| --- | --- | --- | --- |
| bottom | 0.192 | 3,320 | **73.34%** |
| mid | 0.378 | 3,347 | 70.36% |
| top | 0.594 | 3,333 | **69.91%** |

Stronger holders survive **less**: −3.44pp, CI [−6.72, +0.18]. Under ruling
#20's semantics that is **INCONCLUSIVE rather than refuted** (the interval
crosses zero at the top), but its whole mass is on the wrong side of the design's
assumption, and the gate as written requires a positive lower bound, so it
fires either way.

⚠️ **The leading candidate is a confound in my own gate, labelled and
untested**: A3 compares strength terciles **without stratifying by pressure
band**, and the bands differ by ~4pp in survival (72.8 vs 68.8). If strength
skews toward high-pressure moments — plausible, since where a body wins the
ball correlates with both role and strength — that skew alone could manufacture
a −3.4pp "gradient" out of nothing. **Directly measurable by a stratified
re-analysis; not run here, because computing a new statistic to explain away a
fired gate is the move the discipline exists to prevent.** It is the
commander's to authorize.

### 6.3 Reported, and one number that needs its caveat louder than itself

Hold survival overall **71.2%**, mean held 73.7 of 90 ticks, lost-to-tackle
17.56%. The carry baseline arm survives **12.31%**.

⚠️ **That 12.31% does not mean the carrier loses the ball 88% of the time.**
The baseline arm measures *"is this same man still the owner 1.5 s later"*, and
in the untouched fork he usually **passes** — a completed pass counts as
not-survived. So the two arms' "survival" numbers are **not comparable**, and
the 6× gap is mostly the difference between holding and playing, not between
keeping and losing.

I flag it prominently precisely because it is the number most likely to be
misread as "holding is free" — which is exactly the claim the commander's
interpretation above forbids anyone from drawing at this stage. **The
comparative question needs an outcome axis, not a retention axis, and that is
T1's design.**

### 6.4 Disposition

**FAIL ⇒ per the design contract §6 the queue stops and the fork returns to the
commander.** Nothing shipped: both flags default OFF, zero live callers, the
preview cannot reach them, the flags-off world is byte-identical and the
fingerprint is unchanged. The built capability stays committed and dormant so
the next ruling has it in hand.

### 6.5 Two implementation defects, found by measurement and disclosed

Both were caught on the sizing smoke, **before** the frozen run, and both were
corrected toward the contract's own wording rather than toward a number.

1. **The holder knocked his own ball away.** The first smoke had survival
   *rising* with pressure. Rather than guess, the loss causes were counted:
   **27 of 30 low-pressure losses were `loose`, no counter moved, `lastTouch =
   SELF`.** Cause: the capture path re-labels a carrier `Dribble` directly and
   the brain only re-decides every 0.15 s, so between decisions a *free* holder
   accelerated past `stepBall`'s `v > 2.5` push gate and pushed his own ball
   away, while a *pressed* one stayed under it. Fixed **structurally** — the
   forced action is now held between decisions so the executor and the push
   gate always read the same action — not by tuning a speed. ⭐ It also left a
   substrate fact worth keeping: **action labels drift inside the 0.15 s
   decision gap**, and anything reading `action.type` per tick inherits that.
2. **The probe read a release as a loss.** Still inverted after the first fix.
   Tracing the ticks around each loss showed **the hold surviving all 90
   ticks** — the "loss" was the holder passing on the tick the forced window
   expired, which a free man does instantly and a pressed man does not. The
   window was off by one against the contract's own words ("survival after
   1.5 s **of forced hold**"). Same class as E5g's F4 and E5c's U1.
