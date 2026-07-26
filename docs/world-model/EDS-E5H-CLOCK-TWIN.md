# EDS E5h — The clock twin, and what an overlap ball is worth downstream

Status: **PRE-REGISTERED 2026-07-27 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#24.4**. Nothing here may be tuned after first sight of results.

Date: 2026-07-27

## 1. The two questions

E5g measured **854 pass-commits inside 4,812 matured overlap runs** in the
VALUE arm — 0.177 per run — and called it "the clocks differ". But it measured
only one arm, so the number has no twin, and **a rate with no comparison cannot
tell "direct football decides less inside windows" from "the window-decision
share was always this low"**. Ruling #24.4 (i) asks for the OFF twin.

E5g also left the comparison honest-but-unexplained: in the deployed world the
overlap ball genuinely prices ~0.92pp second, and E5e never certified a premium
for it. Ruling #24.3 labels — does not assert — the reason: **if wide patterns
cannot cash downstream (the registered C4 box-arrival gap), then honest value is
RIGHT to starve them, and the legacy ×1.3 was subsidising a pattern this
substrate cannot pay.** #24.4 (ii) asks the census instead of the argument.

Counters only. Zero forks, zero `src/**`.

## 2. Staging

**E5f's staging, verbatim, BOTH arms**: six league seeds
`20260702, 20260801–20260805`, 24 seasons, 1,704 matches per cluster per arm.
OFF = no flags; VALUE = `edsPerceivedDefence` + `edsPerceivedChoice` +
`edsValueAxis`. Matches stepped by hand.

The VALUE arm additionally arms `traceChoice`, purely so E5g's own commit
definition can be counted beside this contract's twin definition (§3.1). E5g's
P0 established that the trace is a sidecar and P0 below re-establishes it here.

## 3. Definitions

- **Window** — a licence-active span: E5f's F2 condition, same predicate
  (`team.overlapper === mate.index`, `|y| > 9`, `localX > holder's − 6`, inside
  the 6–30 m candidate window), on the same assignment spans.
- **Pass-commit** — a tick at which the licence-active holder initiates a **new
  pass**: a fresh `pendingPass` whose passer is that holder, with the licence
  active at that tick's pre-step state.
- **Release** — a pass-commit whose target is the licensed runner.
- **Downstream fate** of a release, over a frozen **240-tick** horizon from the
  kick (the deployed axis's own horizon): whether the releasing team's
  `crosses`, `shots` and `headersWon` counters each move, and whether it still
  owns the ball at the end plus the share of horizon ticks it owned.

### 3.1 Why the twin is not E5g's instrument, and how they are joined

E5g counted **trace entries**, which the brain writes when `top.action ===
'Pass'` — the action layer has already committed to a pass and the chooser is
picking who. That instrument does not exist in the OFF arm: there is no
perceived chooser, so no trace. The twin above is therefore defined on what
both arms show — a pass actually leaving a licence-active holder.

The two definitions are close but need not be identical (a committed pass need
not materialise as a `pendingPass` on the same tick). So **the twin definition
is also applied to the VALUE arm and reported beside E5g's banked 854** as a
calibration. It is **reported, never gated**: what part (i) asks for is the
OFF-versus-VALUE *ratio*, and both arms are measured with one identical
definition, so the ratio is sound whatever the calibration factor turns out to
be.

### 3.2 A proxy, named as one

The registered C4 finding ("crosses find nobody ~50%", `noAerial`) uses its own
instrument, which lives behind `traceFirstTouch` — not reachable from
`League.matchFlags`, and arming it would be a `src` change #24.4 forbids. So
the C4 link is checked with a **stats-delta proxy**: a cross inside the horizon
with **no** `headersWon` and **no** shot is this probe's "found nobody". It is a
proxy for the registered number and is labelled as one everywhere it appears;
it is not offered as a reproduction of C4's own measurement.

## 4. Gates

| gate | claim | predicate |
| --- | --- | --- |
| **P0** | staging pin, both arms | the funnel recomputed here reproduces **E5f's banked integers exactly**, per cluster and per arm — matches, F1, F2, F3, F4 and the counter. Any mismatch ⇒ **INVALID**. Doubles as the sidecar pin: the VALUE arm carries `traceChoice` and must still be E5f's world |
| **P1** | coverage, **checked against the attainable population** | ≥ **400 releases per arm** and ≥ **300 pass-commits per arm**. Attainability verified ex ante from E5f's banked F3: **935 OFF / 550 VALUE**, so both floors are reachable by construction |
| **P2** | determinism | two `runExperiment()` calls, canonical JSON byte-identical, SHA-256 emitted |

**P1 is written the way ruling #24.1 has just codified.** E5g's P2 was an
invented floor against a staging that could never reach it; this one is derived
from a population E5f already counted, and the derivation is stated above so it
can be checked rather than trusted.

Cluster semantics per ruling #20: the cluster unit is the **league seed**, and
every arm ratio carries a 2,000-resample cluster bootstrap over the six.

**A MEASUREMENT step**: findings reported, `INVALID` only on P0 or P2.

## 5. What each answer would mean, laid before the numbers

**(i) The clock.**

- **Commits per window much lower in VALUE** ⇒ direct football genuinely
  decides less inside these windows; the clock is a *difference between the
  arms* and C5's time dimension is aimed at a real gap.
- **Commits per window similar, releases per commit much lower** ⇒ the
  window-decision share was always this low, the clock is a **constant of the
  substrate rather than a regression**, and the whole drop lives in the choice
  — which E5g already showed is an honest ~0.92pp comparison. That would make
  the overlap counter's collapse a *selection* story end to end, and C5 would
  be aimed at something that was never the differentiator.
- Both moving ⇒ the collapse is genuinely two-component, and the split is the
  deliverable.

**(ii) The downstream fate.**

- **Overlap releases cash poorly in BOTH arms** ⇒ #24.3's labelled hypothesis
  survives: the substrate cannot pay wide patterns, honest value is right to
  starve them, and the legacy ×1.3 was a subsidy. C4 becomes the load-bearing
  road.
- **They cash well in the OFF arm** ⇒ the C4 link is **refuted for this
  pattern**; the overlap ball was worth something the deployed table does not
  see, and the file re-opens on the value side.
- **They cash well in the VALUE arm too** ⇒ the surviving releases are a
  selected elite, which is what a stricter chooser should produce, and says
  nothing about the ones it declined. Registered now so it cannot be read later
  as a win.

## 6. What E5h does not do

- No forks, no `src/**`, no table, no flag, no counter changed.
- It does not re-open E5g's argmax question (clean) or E5f's perception
  question (dead).
- It does not choose the design road. #24.5 puts that partly with the user, and
  E5h is evidence for one branch of it, not a vote.

## 7. Result

*(To be filled in after the run, in a separate commit.)*
