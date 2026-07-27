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

## 6. Result

*(To be filled in after implementation and the anatomy run, in a separate
commit.)*
