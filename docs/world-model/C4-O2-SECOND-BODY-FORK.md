# C4 O2 — the second-body station fork (compliant oracle)

Status: **PRE-REGISTERED 2026-07-27, NOT RUN.** Gap work. Authorized by
**commander ruling #36.3(ii)** — *C4's closure is PROVISIONAL until two cheap
compliant oracles run*. Executor-drafted, Autonomous mode; gates frozen here,
before any data exists.

Authority: ruling #36.3 · the cross-AI audit
([`../cross-ai-audits/2026-07-27-stage3-and-verdicts/`](../cross-ai-audits/2026-07-27-stage3-and-verdicts/)),
finding **14** (T2 moved one body and did not exhaust a second-body
intervention), finding **10** (the goal estimand), finding **15** (clustering)
and finding **7** (an equivalence claim needs an interval) · #34.3 (the
second-body branch was closed by DOCTRINE, not measurement) · #20 · #29.5 ·
#32.1.

## 1. What O2 is, and the honesty it exists to buy

#34.3 rejected a post-kick second-body widening on doctrine — *the corner
machinery's hand count is tolerated legacy, not a pattern to extend; bodies
should attack a delivery because their EYE prices the landing*. That reasoning
is sound and O2 does not challenge it.

But it left C4's most-named residual **untested by choice**. T2's own §7.1.7
wrote *"the obvious re-pose — aim more than one body — is a licensing change"*
and stopped there, correctly, because §8 forbade re-posing in that session.
The audit put the same branch on the table from the outside.

**O2 is an oracle, not a candidate mechanic.** It forces one extra body and
measures. If the answer is *no lever*, C4's closure stops being doctrinal and
becomes measured — which is worth more than the doctrine alone. If the answer
is *a lever*, the doctrine still stands (we would not ship the choreography),
but Stage III inherits a **sized target** instead of a hypothesis.

## 2. The mechanism

### 2.1 The seam

```ts
Match.forcedStation: { gid: number; target: V2; untilTick: number } | null
```

Consumed as a **post-switch override** in `executeAction` for an off-ball
outfielder: while `simTick < untilTick` and the gid matches, his steering
target becomes `target` before the existing onside and barred-box clamps run —
so the clamps still apply exactly as they do to every other station, and the
forced body is not given a privilege the world does not have.

Zero live callers; null is inert. **This is a C4 oracle seam.** Stage III P1
is held pending the commander's contract revision, and #35.3 already ruled
that P1 forks the **READ**; P1 may adopt this seam, replace it, or ignore it.
O2 claims nothing about P1's design and must not be read as pre-empting it.

### 2.2 Who gets forced

At the kick, among the bodies **already licensed** (`team.runners ∪
{team.arriver}`, sent-off and the crosser excluded), take those who are
**not already being sent to the ball** — excluding the registered pass target
(`pendingPass.targetGid`, who has carried the Phase-63 meet-point re-route
since long before C4) and any body in `team.chasers` (routed by
`interceptBall` to the same landing). Of the remainder, force the one
**closest to `ballLanding`**.

That is exactly *"one additional already-licensed body"*: nobody new is
licensed, no count changes, and the body chosen is the cheapest possible
second attacker. His target is the meet point `landing − flightDir·2.5`,
recomputed every tick for the flight — the same formula the receiver, the
corner crasher and C4 T2's dormant branch all use.

`untilTick` = the kick tick + `ballLanding(ball).t / DT`, derived from the
launch exactly as T2's licence duration was.

⚠️ **If no eligible second body exists, the cross is recorded as
NO-SECOND-BODY and both arms are identical.** That count is reported, because
it is itself an answer: a branch that cannot fire on most crosses is closed by
arithmetic rather than by measurement.

### 2.3 The harness

Identical to O1's: a base match with the seam null, a rolling pre-step clone
at every tick where the ball's owner will re-decide, and on each cross **two
forks from the same clone** — control (seam null) and treated (seam set) —
each simulated for the fixed horizon. The base match continues unforked.

**Harness identity gate**: the control fork must reproduce the base
continuation **bit-identically** for the whole horizon. **Clone coverage must
be 100%** — a cross without a clone is a hole in the population, not a
rounding error.

## 3. The estimand — inherited from O1 §3, verbatim

```text
HORIZON  4.0 s from the kick, fixed, never closed early
GOAL     ANY goal by the crossing side inside the horizon
SHOT     ANY shot by the crossing side inside the horizon
CLASS    the T0 arrival class and the T0b ladder, verbatim from the banked probe
```

Clustering: disjoint seed ranges per archetype × shell combination, so
*"cluster unit = the match seed"* is exact (finding 15).

## 4. Gates

### 4.1 X — identity

| gate | predicate |
| --- | --- |
| **X1** | seam null: `npm run fingerprint` returns `57b0bdab…c673`, unchanged |
| **X2** | seam null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts `forcedStation` is read in exactly one place, is null on a fresh `Match` and a `League` fixture, and is unreachable from the E4 preview |
| **X4** | **CLONE COVERAGE = 100%** |
| **X5** | **HARNESS IDENTITY**: the control fork reproduces the base continuation bit-identically for the full horizon, per-record with named exception classes (#32.1) |
| **X6** | **THE FORCE BITES**: on crosses with an eligible second body, the forced body's steering target equals the meet point on ≥99% of live ticks, and every miss falls into a named class (onside clamp / barred box / he became the carrier / the ball was won) with an **unexplained residual of exactly 0**. ⚠️ The population is conditioned on the body's action path, which is the defect T2's F2 had — here it is conditioned explicitly and the conditioning is part of the gate text |
| **X7** | two `runExperiment()` calls byte-identical, SHA emitted |

### 4.2 The primary question, and the frozen decision rule

```text
D1  the PAIRED per-cross difference in ATTACKING contest share (C3atk),
    forced minus control, over ALL crosses with an eligible second body,
    95% cluster-bootstrap CI                                      (PRIMARY)

DECISION RULE, frozen:
  LEVER      CI lower bound > 0
             ==> aiming a second body DOES create attacking contests. The
             doctrine still forbids shipping the choreography; Stage III
             inherits a SIZED target and C4's closure is re-opened as a
             measurement question.
  NO LEVER   CI entirely within (-2.32pp, +2.32pp)
             ==> the branch is closed BY MEASUREMENT, not doctrine. This is
             an interval test, not an MDE argument (finding 7).
  UNRESOLVED anything else -- reported as unresolved, returned to the
             commander, read as neither.
```

**C3atk, not total contests**: the intervention is attacker-side only, and
gating on the side the mechanism serves is the T0R lesson. **±2.32pp** is
T2's own MDE at n ≈ 5,500 and p ≈ 0.25, carried with its derivation and
conservative here because a per-cross paired design cannot have a larger
standard error than the unpaired figure it comes from.

### 4.3 The H3 subgroup is REPORTED, and the reason it is not primary

#36.3(ii) names *"H3 crosses"* as the target. H3 is measured **after** the
delivery flies, so selecting on it selects on an outcome — and selecting on
the CONTROL arm's outcome induces regression to the mean in the treated arm.
Making it primary would build that bias into the headline.

So: **primary = all crosses with an eligible second body** (clean, unbiased,
and the population the intervention actually applies to); **reported =
the H3 subset**, defined on the control fork, with the selection stated on its
face. The two are read together; if they disagree, the disagreement is the
finding and it goes to the commander unresolved.

### 4.4 Reported, never gated

The no-second-body share (§2.2's arithmetic answer); C3def and total
contests, because a second attacking body that only feeds the defence is
exactly what T1-FLIGHT's 71% split would predict; the fixed-horizon any-goal
and any-shot differences; the T0b ladder and H3's geometry per arm — H3's
share and its median miss are the direct measure of whether a second body
closes the half-metre; the minimum attacker distance in the band; per-
combination everything.

## 5. Staging, frozen

| item | value |
| --- | --- |
| block | seeds **950,000 +** `comboIndex · 100_000`, disjoint per combination |
| staging | T0R's six combinations and per-combination budgets, verbatim (2,695 matches) |
| base world | **flags OFF** — the shipped world |
| arms | per cross: control vs forced second body, both from the same clone |
| cluster unit | the match seed, disjoint across combinations |
| bootstrap | 2,000 resamples, frozen seed **50029** |

## 6. Pre-laid readings

* **(a) LEVER.** Presence *was* binding at the margin once a second body is
  aimed — T2 measured the wrong intervention (it re-labelled a body already
  going) rather than the wrong idea. Stage III's arrival hypothesis inherits a
  measured size, and #34.3's doctrine becomes a statement about *how* to buy
  it, not *whether* it exists.
* **(b) NO LEVER.** Two aimed bodies do not beat one at this contest radius
  and this flight time. Then C4's closure is certified by measurement, the
  1.35 m radius and the instantaneous contest (Q3) are named as the binding
  constraints rather than arrival, and Stage III should expect the eye to buy
  its arrival payoff somewhere other than the box.
* **(c) UNRESOLVED**, or primary and H3 disagreeing. Reported as such; no
  re-pose in this session.

## 7. Result

*(empty until O2 runs — filled in the same commit as the result.)*

## 8. Stop rules

* **Any X gate fails ⇒ FAIL.** X5 and X6 in particular: a fork that does not
  reproduce its control is not a counterfactual, and a force that does not
  bite measures nothing.
* **No re-cutting after sight** — not the ±2.32pp interval, not the eligible-
  body definition, not the H3 subgroup's demotion, not §6's readings.
* O2 ships nothing. The seam stays null in every production path, and a LEVER
  reading does **not** authorize shipping the forced choreography — it
  authorizes re-opening the question.
* O1 and O2 are independent; neither rescues nor blocks the other.
