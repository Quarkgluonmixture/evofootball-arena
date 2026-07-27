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

### 4.1b ⚠️ Instrument facts disclosed before the run, in their own commit

Two, both about making X6 measure what it claims. Neither touches a gate
value, the mechanism, the interval, the population or §6's readings.

1. **X6 reuses C4 T2's `Player.c4Trace` observability field.** The
   `forcedStation` block writes `{ meet, applied }` and the existing
   post-switch line rewrites `applied` with whatever survived the clamps — so
   X6 reads the *engine's* target rather than asserting it. No new `src`
   surface; the field is documented as probe-only, is never read by any
   decision, and is null in every flags-off world. Fingerprint
   `57b0bdab…c673` re-verified after the edit.
2. **The seam's tick boundary is off by one from the probe's view, and the
   probe replicates the engine rather than the other way round.**
   `stepCount++` is the first statement in `Match.step`, so the executor
   evaluates `simTick < untilTick` against `preStepTick + 1`. A probe
   comparing the pre-step value predicts a fire on the last tick that the
   engine then declines — **one unexplained record per delivery**, which the
   sizing smoke produced exactly (55 records, 98.89% ok, X6 FAIL). The probe
   now checks `simTick + 1 < untilTick`, and the smoke's unexplained residual
   is **0**. Fixing a probe that mispredicts the engine is not a gate change;
   leaving it would have failed X6 on an arithmetic mismatch rather than on
   the world.

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

## 7. Result — ⛔ **GATES FAIL on X6**, and the measurement is a large RESOLVED HARM

Run 2026-07-27, block 950,000 + disjoint per combination, 2,695 matches,
**5,418 crosses, 10,836 forks**, twice byte-identical, SHA `f5a69e49…b2ff`.
Probe: `scripts/probes/c4-o2-second-body-fork.ts`.

| gate | verdict |
| --- | --- |
| **X4** clone coverage 100% | ✅ **5,418 / 5,418**, zero arms missing |
| **X5** harness identity | ✅ **116 checked, 0 mismatched** |
| **X6** force bites, unexplained = 0 | ⛔ **33 unexplained** (222,171 ok = 99.985%) |
| **X7** determinism | ✅ two runs byte-identical |
| X1–X3 | ✅ fingerprint `57b0bdab…c673`, seams null in production |

### 7.1 ⛔ X6 fails on the class ruling #36.1 told me to name

A read-only diagnosis over all six cells reproduces all 33 exactly, and they
are **unanimous**:

```text
why = mismatch · phase = 'halftime' · action = MoveToFormationSpot   × 33
every other class — onside clamp, barred box, became carrier, ball won — 0
```

At half-time `Match.step` returns before the execute loop, so nothing runs:
`c4Trace` holds the last *played* tick's value while the probe forms a fresh
expectation off a frozen world.

**Ruling #36.1 codified this exact class one ruling ago** — *"a PAUSED world
state (halftime, ball frozen, `simTick` unadvanced) is its own named class in
any trace-comparing probe"* — after T2's F2 hit it. I wrote O2's four
exception classes and did not include it. That is not a subtle miss; it is a
standing instruction I failed to apply to the very next probe. **Not
re-scoped after sight.**

Everything the gate *could* diagnose came back exactly as predicted: the
force bit on 222,171 of 222,204 live ticks and no clamp ever rewrote it.

### 7.2 The frozen rule returns UNRESOLVED, and that understates it

```text
D1  C3atk  27.51% → 18.90%  =  −8.61pp   CI [−9.62, −7.64]      (n = 5,100)
```

`lower > 0`? No. `CI inside ±2.32pp`? No. ⇒ **UNRESOLVED** by §4.2's frozen
rule. But the plain reading of the measurement is not ambiguity — **forcing a
second body toward the descent resolvedly DESTROYS attacking contests**, by a
margin nearly four times the equivalence interval.

**That is a rule-design gap and it is mine**: I wrote a two-sided question
with one-sided branches — LEVER for *helps*, NO LEVER for *does nothing* — and
left *hurts* to fall through to "unresolved". The verdict is reported as the
rule says and the measurement is reported as it is; the rule is not re-cut.

Where the contests went:

```text
C3def       33.71% → 41.76%   +8.06pp  CI [+7.23, +8.93]
contests    61.22% → 60.67%   −0.55pp  CI [−1.03, −0.06]
shots       40.33% → 32.12%   −8.22pp  CI [−9.24, −7.24]
ANY goal    12.84% → 11.75%   −1.10pp  CI [−1.80, −0.38]
```

The aerial duel does not disappear — **it changes hands.** And the mechanism
is measured, not guessed:

```text
minimum ATTACKER distance in the band, median   1.943 → 2.367 m   (+0.228)
```

**Aiming an extra attacker at the descent makes the nearest attacker
FARTHER from the ball.** The meet point is a *prediction* of where the ball
will be catchable; the body forced onto it stops doing whatever he was doing,
and on average that was better.

### 7.3 ⭐⭐⭐ Primary and the H3 subgroup disagree in SIGN — the pre-registered contingency, live

```text
PRIMARY  all eligible crosses  n 5,100   C3atk  −8.61pp  CI [−9.62, −7.64]
H3 SUBGROUP (control-arm H3)   n   673   C3atk  +7.28pp  CI [+5.38, +9.28]
                                         contests +8.32pp CI [+6.14, +10.59]
```

On the crosses where the control arm found **nobody at head height**, forcing
a second body helps a lot. Over all crosses it hurts a lot. Both are resolved
and they point opposite ways.

§4.3 demoted H3 from primary *before the run*, on the argument that selecting
on a control-arm outcome induces regression to the mean — and said in advance
that **"if they disagree, the disagreement is the finding and it goes to the
commander unresolved"**. It is hard to imagine a cleaner demonstration that
the demotion was right: had #36.3(ii)'s literal *"at H3 crosses"* been taken
as the headline, this oracle would have reported **+7.28pp and reopened C4 on
a selection artefact.**

### 7.4 What this does and does not establish — the scope limit, stated

It does **not** establish that two aimed bodies can never help. It establishes
that **overriding an already-licensed body's routing with a scripted meet
point for the whole flight makes the attack worse**, which is evidence *for*
#34.3's premise — choreography that displaces a body who already had a better
route costs more than it buys.

Two honest limits bound the negative, both mine:

1. **Eligibility is evaluated once, at the kick.** `team.chasers` refreshes
   every 0.4 s, so a body excluded as a chaser at the kick can *become* the
   designated chaser mid-flight — and the force then overrides his
   `interceptBall` route, which reads the same landing more accurately. The
   oracle cannot separate *"a second body does not help"* from *"overriding a
   chaser hurts"*.
2. **The meet point is the corner machinery's formula**, 2.5 m upstream of the
   landing. It is the engine's own, but it was designed for a corner's flight
   and this measurement says it is the wrong place to stand for an open-play
   delivery — `minOutfieldDistInBand` barely moves (1.478 → 1.474 m) while the
   attacker's own distance grows.

### 7.5 Reported

No eligible second body on **5.87%** of crosses (318 of 5,418) — the branch
was never closed by arithmetic, it applies to 94% of deliveries. H3 as a share
of all crosses 13.20% → 13.90% (+0.71pp, CI [+0.23, +1.20]) — the arrival gap
gets marginally *worse*. C1 5.08% → 4.55%; C2 23.94% → 25.06%; C0 flat at
9.7%. The ladder here is over **all** rows, not over C2, so it is not
comparable to T0b's.

### 7.6 Disposition

**FAIL ⇒ the fork returns to the commander** (§8), on a gate I should not have
failed. What the commander is holding:

* the doctrinal closure of the second-body branch is now **supported by
  measurement** — the scripted version is resolvedly harmful, with the
  mechanism (attackers end up farther from the ball) measured rather than
  asserted;
* a **live demonstration** that the H3 framing #36.3(ii) named would have
  produced the opposite headline, and that the pre-registered demotion caught
  it;
* two scope limits that keep the negative from over-reaching;
* and an X6 failure on a class that had already been ruled into existence.

Nothing shipped: `forcedStation` is null in every production path.

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
