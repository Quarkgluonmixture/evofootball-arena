# C4 O1 — the per-cross flight fork (compliant oracle)

Status: **PRE-REGISTERED 2026-07-27, NOT RUN.** Gap work. Authorized by
**commander ruling #36.3(i)** — *C4's closure is PROVISIONAL until two cheap
compliant oracles run*. Executor-drafted, Autonomous mode; gates frozen here,
before any data exists.

Authority: ruling #36.1/#36.3 · the cross-AI audit
([`../cross-ai-audits/2026-07-27-stage3-and-verdicts/`](../cross-ai-audits/2026-07-27-stage3-and-verdicts/)),
findings **8** (blanket lofting is a policy mandate, not a fork), **10** (the
goal estimand is first-shot-before-next-cross, not any-goal-in-4 s) and **15**
(the cluster unit is not what the probes declare) · #34.3 (C4 v1 closed
dormant) · #20 (CI/cluster) · #29.5 (power at freeze time) · #32.1 (no
coupon-collector gates) · PROBE-CONTRACTS §2 (the sixth threshold type: an
equivalence claim needs an interval, not an MDE).

## 1. What O1 is, and what it is not

T1-FLIGHT floored the flight time of **every** cross for a whole match. That
is a policy mandate. It cannot distinguish *"a headable flight is worth
choosing here"* from *"a headable flight is worth mandating everywhere"*, and
because the arms then produce **different cross populations** (5,547 / 5,633 /
5,548), conditioning on *"a cross occurred"* is post-treatment selection.

O1 forks **one flight choice at one real cross moment** and lets the world
play. Both arms therefore share the **same delivery, struck by the same body,
from the same world state**, and the population is identical by construction.

**It is not a re-run of T1-FLIGHT and it cannot overturn T1-FLIGHT's launch
finding**, which was an arithmetic fact about `loftKick` and stands. It asks
one question T1-FLIGHT could not: **is the flight profile a LEVER — something
whose payoff depends on the pre-kick context — or is it flat?**

## 2. The mechanism

### 2.1 The seam

```ts
Match.forcedCrossProfile: 'current' | 'lofted' | null   // default null
```

Consumed at **exactly one place**: the `tMinCross` selection in
`performCross` (`mechanics.ts:564`), which today reads `match.c4Flight`.
Forced, it overrides that one choice and nothing else; the run-lead consumes
the same law it always does (#31.1's rule-preserving form). `c4Flight` is
untouched and stays default OFF.

Zero live callers, flag-free (a null seam is inert by construction), and the
flags-off world is bit-identical — pinned by X1/X2 below.

### 2.2 The harness

1. Play a **base** match with the seam null. This is the natural trajectory
   and no fork ever writes to it.
2. At every tick boundary where the ball's owner **will re-decide this tick**,
   keep a rolling `cloneSimulationState` of the pre-step world (one clone, the
   previous is discarded).
3. When `stats.crosses` increments, take the saved clone and run **two forks**
   from it, identical except for `forcedCrossProfile`:
   `'current'` (`tMin = 0.7`) and `'lofted'` (`tMin = CROSS_FLIGHT_MIN_S`).
   Each fork is simulated for the full horizon (§3.1).
4. Continue the base match unforked.

⚠️ **The clone-coverage rule is a GATE, not an assumption** (X4): every
observed cross must have had a clone available. If a cross can be struck by a
body that was not re-deciding that tick, the rolling-clone condition is wrong
and the probe must say so rather than silently skipping deliveries.

### 2.3 The harness identity gate (the E2a-2 rule)

**Forcing the profile the world would have used anyway must reproduce the base
continuation bit-identically.** With `c4Flight` OFF in the base, the
`'current'` fork is that profile, so the `'current'` fork's world signature
must equal the base's for the whole horizon, on every cross. This is the gate
that makes the fork an intervention rather than a different simulation.

## 3. The estimand — the audit's finding 10, fixed

### 3.1 Frozen definitions

```text
HORIZON        4.0 s from the kick, fixed, NEVER closed early
GOAL           ANY goal scored by the crossing side inside the horizon
               (not "the first shot was a goal")
SHOT           ANY shot by the crossing side inside the horizon
CLASS          the T0 arrival class (C0 / C1 / C2 / C3atk / C3def) and the
               T0b ladder, both verbatim from the banked probe
```

A later cross inside the horizon **does not close the window**. Inside a fork
the horizon is the fork's whole life, so overlapping windows are not merely
permitted — they cannot occur. That is the cleanest available answer to
finding 10 and it is a property of the fork design, not a patch.

### 3.2 Clustering — the audit's finding 15, fixed

Each archetype × shell combination gets a **disjoint seed range**
(`SEED_START + comboIndex · 100_000`), so *"cluster unit = the match seed"* is
an exact description of the implemented unit rather than an approximation.
No common-random-number stream is shared across combinations.

## 4. Gates

### 4.1 X — identity

| gate | predicate |
| --- | --- |
| **X1** | seam null: `npm run fingerprint` returns `57b0bdab…c673`, unchanged |
| **X2** | seam null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts `forcedCrossProfile` is read in exactly one place and is null on a fresh `Match` and on a `League` fixture, and unreachable from the E4 preview |
| **X4** | **CLONE COVERAGE = 100%**: every cross observed in every base match had a pre-step clone available |
| **X5** | **HARNESS IDENTITY**: the `'current'` fork reproduces the base continuation bit-identically for the full horizon, on **every** cross — reported per-record with named exception classes, never as a max (#32.1) |
| **X6** | two `runExperiment()` calls byte-identical, SHA emitted |

### 4.2 The primary question, and the frozen decision rule

O1's deliverable is **heterogeneity**, not a headline effect.

Pre-kick context bands, frozen ex ante, **2 × 2 and no more** (a small closed
set, #24-attainable at the staging below):

```text
DISTANCE   the crosser's distance to his aim point at the kick:
             SHORT  < 14.454 m      LONG  >= 14.454 m
           14.454 m is DERIVED, not chosen: it is the distance at which the
           unforced flight law already clears the header band
           (peak = g*T^2/8 >= HEADER_MIN_HEIGHT), banked at #31.4.
OCCUPANCY  attacking outfielders inside the box at the kick:
             THIN  0-1             FULL  >= 2
```

```text
D1  the PAIRED per-cross difference in CONTEST share (C3atk + C3def),
    lofted minus current, 95% cluster-bootstrap CI, reported per band and
    pooled                                                       (PRIMARY)

DECISION RULE, frozen:
  LEVER      if any band's CI excludes zero AND some other band's CI either
             excludes zero with the OPPOSITE sign or excludes the first
             band's point estimate
             ==> the flight profile is selectable; C4 REOPENS cheaply
  FLAT       if every band's CI is contained within +/-2.32pp of the pooled
             point estimate
             ==> blanket lofting was the right summary; closure CERTIFIED
             BY MEASUREMENT
  UNRESOLVED anything else. Reported as unresolved and returned to the
             commander -- NOT read as either of the above.
```

**±2.32pp is inherited with its derivation, not borrowed**: it is T2's
unpaired MDE at n ≈ 5,500 and p ≈ 0.25, and it is a **conservative upper
bound** here because a per-cross paired design cannot have a larger standard
error than the unpaired one it is computed from. Stating an equivalence band
rather than an MDE is finding 7's correction applied in advance: an MDE is a
power property, an equivalence claim needs an interval.

The third branch exists because #20 forbids reading a straddling interval as
"no effect", and because a two-branch rule would force one of them.

### 4.2b ⚠️ Corrected before the run, in its own commit: how DISTANCE is read

§4.2 bands on *"the crosser's distance to his aim point at the kick"*. That
quantity is **not observable from outside the engine** — the chosen cross
target is a local in `PlayerBrain`, and a first implementation that used the
crosser-to-ball distance one tick after the kick measured ≈0 m and put
**every** delivery in SHORT, leaving both LONG cells empty. A band that cannot
fire is not a band (the T1-FLIGHT F1/F2 precedent).

It is recovered **exactly**, from the control arm's own launch. `loftKick`
sets `T = clamp(0.5 + d·0.038, tMin, 1.7)` and `vz = g·T/2`, so

```text
d = (2·vz_current / g − 0.5) / 0.038
```

is the control delivery's own flight distance, which is precisely the quantity
the 14.454 m boundary was derived on. The recovery is invertible only off the
clamps (`d ∈ [5.26, 31.6] m`); **clamped launches are counted and reported**
rather than banded on a fiction.

This is a correction toward the contract's own stated semantic — §4.2's
boundary is defined as *"the distance at which the unforced flight law already
clears the header band"*, and the recovered `d` is that distance. **No band
boundary, interval, or decision rule is changed.** Also disclosed: the band is
a deterministic function of pre-treatment state (the cross TARGET is chosen
before `performCross` and is identical in both arms; only the lead differs),
so conditioning on it is conditioning on a covariate, not on an outcome.

### 4.3 Reported, never gated

The pooled paired contest difference and its C3atk/C3def split; the fixed-
horizon **any-goal** and **any-shot** differences, pooled and per band —
these are the numbers that say whether finding 10's correction changes
T1-FLIGHT's withdrawn *"fewer goals, resolved"*, and they are **reported
rather than gated because the withdrawal is already banked**; the T0b ladder
per arm; launch apex and headable share per arm (continuity with T1-FLIGHT);
per-combination everything; the per-band n, so an underpowered band is visible
rather than silently included.

## 5. Staging, frozen

| item | value |
| --- | --- |
| block | seeds **940,000 +** `comboIndex · 100_000`, disjoint per combination (§3.2) |
| staging | T0R's six archetype × shell combinations and its per-combination match budgets, verbatim (295/296/354/524/566/660 = 2,695 matches) |
| base world | **flags OFF** — the shipped world, `c4Flight` included, so the fork's control arm is the world as it stands today |
| arms | per cross: `'current'` vs `'lofted'`, both forked from the same clone |
| cluster unit | the match seed, now disjoint across combinations |
| bootstrap | 2,000 resamples, frozen seed **50023** |

Expected ≈5,700 crosses, ≈11,400 forks of 240 ticks each. The base run
dominates the cost; the forks add roughly 2.7 M ticks against the base's
≈14.5 M, which is what makes this a cheap oracle.

## 6. Pre-laid readings

* **(a) LEVER.** The flight profile pays differently in different pre-kick
  contexts. C4 reopens as a *selection* question — profiles as candidates a
  perceived selector could choose between — which is Stage III's shape, not
  more choreography.
* **(b) FLAT.** The payoff does not depend on the context we can see at the
  kick. T1-FLIGHT's blanket floor was then the honest summary of a real
  effect, the policy-mandate objection is answered by measurement, and C4's
  closure is certified rather than doctrinal.
* **(c) UNRESOLVED.** The bands cannot separate at this budget. Then the
  honest statement is that O1 was underpowered for heterogeneity, the closure
  stays provisional on *this* question, and re-powering is the commander's
  call — **not** something this session re-cuts after sight.

## 7. Result

*(empty until O1 runs — filled in the same commit as the result, per
governance rule 6.)*

## 8. Stop rules

* **Any X gate fails ⇒ FAIL.** X5 especially: a fork that does not reproduce
  its own control is not a counterfactual.
* **No re-cutting after sight** — not the bands, not the 14.454 m boundary,
  not the ±2.32pp interval, not §6's readings.
* O1 ships nothing and enables nothing. The seam stays null in every
  production path.
* O1 and O2 are **independent oracles**: neither rescues nor blocks the other,
  and they may run in either order.
