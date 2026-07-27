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

## 7. Result — RUN 2026-07-27: MEASURED

SHA `9ed77d56…3c29`, twice byte-identical. **P0 true · P1 true · P2 true.**
Both arms reproduce every E5f banked integer per cluster — matches, F1, F2, F3,
F4 and the counter — with `traceChoice` armed in the VALUE arm, so this is
E5f's world and the sidecar is again a sidecar.

### 7.1 ⭐⭐⭐ The clock is a CONSTANT of the substrate, not the differentiator

| | OFF | VALUE | ratio |
| --- | --- | --- | --- |
| **commits per matured run** | **0.2499** (1,022/4,090) [0.215, 0.287] | **0.2267** (1,091/4,812) [0.209, 0.246] | **0.907×** |
| **releases per commit** | **72.99%** (746/1,022) [0.712, 0.743] | **49.04%** (535/1,091) [0.457, 0.528] | **0.672×** |
| releases per matured run | 0.1824 [0.155, 0.209] | 0.1112 [0.097, 0.129] | 0.610× |

**The two commit rates are not distinguishable** — the cluster intervals overlap
across most of their length, and the per-cluster values (OFF 0.178–0.341,
VALUE 0.199–0.255) sit inside each other's spread. **Releases per commit is a
different picture entirely**: the intervals are disjoint, and every single
cluster separates (OFF 0.697–0.753, VALUE 0.440–0.547).

So §5's **second** branch is the measured one, and it is the one that costs
something:

> **In both arms, only about a quarter of matured overlap runs ever see a pass
> commit. Direct football does not decide meaningfully less inside these
> windows — it was always this low.** The whole differentiator is what happens
> at the commit: the legacy brain gives him the ball **73%** of the time, the
> value chooser **49%**.

⚠️ **This corrects a framing that was banked one ruling ago.** #24.3 recorded
the clock as "the FOURTH independent arrow at the C5-family time-dimension
seat". For the overlap file it is not an arrow at all: it is a constant that
both arms share, so **C5 cannot restore this counter** — the collapse is not
there. That says nothing about whether C5 is worth building for its own sake; a
substrate where three quarters of matured runs never meet a decision may well
deserve a time dimension. It says only that pointing C5 at the overlap file
would be aiming at something that was never the difference.

### 7.2 The subsidy, quantified — and an independent instrument agreeing

**73% → 49% is the legacy `×1.3` measured**: that multiplier's whole effect was
to hand the licensed runner the ball at three commits in four, and honest value
hands it to him at one in two.

⭐ And two independently-defined instruments land in the same place: E5g found
the chooser picks him at **51.17%** of licence-active decision moments; this
probe, using a definition that does not involve the trace at all, finds
**49.04%** of licence-active commits become releases to him. Neither was tuned
to the other.

**Calibration (§3.1, reported never gated):** the twin definition counts
**1,091** VALUE-arm commits against E5g's banked **854** — a factor of 1.277,
which is the expected consequence of counting "a pass actually left a
licence-active holder" rather than "the brain committed to Pass and the chooser
was consulted". Both arms are measured with the one twin definition, so the
0.907× and 0.672× ratios are unaffected. (The 314,711 traced choices in the
report are the whole-match total, not a licence-window quantity — they are the
denominator the trace lives in, not a comparison.)

### 7.3 The C4 link is not the mechanism, at this horizon

| fate within 240 ticks of the release | OFF (n=746) | VALUE (n=535) |
| --- | --- | --- |
| a shot | **7.24%** [6.51, 7.89] | **9.16%** [6.65, 11.67] |
| a cross | **1.21%** (9) | **2.06%** (11) |
| a header won | 2.28% | 1.31% |
| still own the ball at the end | 18.63% | 17.57% |
| mean share of the horizon owned | 0.222 | 0.226 |
| "found nobody" \| cross (**proxy**) | 8/9 | 7/11 |

**Overlap releases essentially never become crosses inside the deployed
horizon** — 1.2% and 2.1%. So the chain #24.3 labelled — release → cross →
nobody in the box — **cannot be what depresses the overlap ball's value, because
it almost never runs.** Not "crosses find people": the proxy has 9 and 11
events and says nothing either way, exactly as §3.2 warned and exactly as the
sizing smoke predicted before this run.

⚠️ **Recorded because I saw it before the numbers and chose not to act on it:**
the 1-season smoke already showed the cross column would be near-empty at a
240-tick horizon (0 of 63), and the base rate says why — 2.49 crosses per match
gives roughly 2% in any four-second window. I left the frozen horizon alone
rather than widening a definition after a smoke to get a bigger number. **The
consequence is a real limit on this finding**: a release that is carried and
then crossed *after* four seconds is invisible here, so what is refuted is the
C4 chain *at the deployed axis's own horizon*. A longer horizon is a different
question and needs its own pre-registration.

### 7.4 What the ball is actually worth

The overlap ball is **not a bad ball in absolute terms**: 7.24% of OFF-arm
releases produce a shot inside the horizon, against the attempt table's
marginal of 5.62–6.33%. It is simply **not the best ball available at its own
moments** — E5e's harvest B measured the alternatives there realizing 8.29%
against the runner's 6.81%, and these numbers corroborate that from a
completely different staging.

So #24.3's conclusion survives while its proposed *mechanism* does not: **the
honest table is right that this is not the best ball in this substrate**, and
the legacy multiplier was a subsidy — but the reason is not a broken box
arrival, it is that the alternatives at those moments are genuinely worth more.

⚠️ VALUE-arm releases cash **higher** than OFF-arm ones (9.16% vs 7.24%). §5
registered this in advance as the **selected elite** — a stricter chooser should
produce exactly this — and it says nothing about the releases it declined. It
is not a win and is not offered as one.

One thing common to both arms is worth the commander's eye: **four seconds after
an overlap release the team owns the ball less than a fifth of the time**, and
holds it for about 22% of the horizon, in *both* arms. That is a property of
wide play in this substrate rather than anything the chooser did.

### 7.5 What returns

A MEASUREMENT step, so nothing is gated and nothing shipped. Three findings for
the fork in #24.5:

1. **C5 cannot restore the overlap counter** — the clock is a shared constant
   (0.907×, indistinguishable), so the fourth arrow does not point here.
2. **The differentiator is entirely the commit-time choice**, 73% → 49%, which
   is the legacy `×1.3` subsidy quantified and independently confirmed by E5g's
   51.17%.
3. **C4 is not the mechanism at this horizon** — releases become crosses 1–2%
   of the time — but #24.3's *conclusion* stands by another route: the ball
   cashes above the global marginal and below its own alternatives.

Nothing in `src/**`, no forks, no table, no counter, no default changed.
