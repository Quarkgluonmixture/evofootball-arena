# EDS E5f — The overlap funnel: where does the collapse happen?

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#22.4**. Nothing here may be tuned after first sight of results.

Date: 2026-07-26

## 1. The question, and why it is cheap

E5e Phase 0 (b) established that the overlap runner **is not losing the price
comparison**: at the moments his licence fires he is already the top-priced
option (flip benchmark −0.82pp) and his forks land in the middle third
(55% cell 2 / 38% cell 3), not attacking-wide. Yet the counter collapses to
**0.516×** [0.437, 0.646] on six leagues.

So the collapse is **upstream of the choice**, and upstream has stages. This
probe locates which one, and it can do so by **counting only** — no forks, no
cloning, no `src/**`. That is the whole design: the expensive instrument
already answered the choice-seat question, and what is left is bookkeeping.

## 2. Staging

**Part (a)'s staging, verbatim** (`EDS-E5E-STATE-CONDITIONAL.md` §2.1): six
league seeds `20260702, 20260801–20260805`, 24 seasons, two arms — **OFF** (no
flags) and **VALUE** (`edsPerceivedDefence` + `edsPerceivedChoice` +
`edsValueAxis`). 1,704 matches per cluster per arm.

The one change: each match is stepped by the probe rather than run to
completion, so the funnel can be observed between ticks. `getResult()` is then
handed to `league.applyResult` exactly as `runToCompletion` would.

> ⚠️ **The instrument touches the world it measures, and P0 is the guard.**
> Two things could perturb: stepping manually, and calling
> `match.perceivedSnapshot()` for the info-class decomposition at ticks the
> brain would not have called it. `reconstructBodyMemory` is a pure function of
> (stored scan frames, tick, seed, awareness) and re-derives the same memory
> however often it is called, so the extra calls *should* be inert — but
> "should" is not a measurement. **P0 pins the arms' release counts against
> part (a)'s banked integers**, so if either instrument perturbs anything the
> run comes back INVALID and says so, instead of quietly reporting a different
> world's funnel.

## 3. The funnel

Per team, an **assignment** is one span of `team.overlapper` holding a given
player index (a transition into it opens the span; null or a different index
closes it). The funnel counts assignments, so the stages compose.

| stage | an assignment reaches it when… |
| --- | --- |
| **F1** | it exists at all — `team.overlapper` was assigned |
| **F2** | at some tick in the span, a teammate holds the ball and the overlapper satisfies the **full legacy release predicate**: inside the pass candidate window (6–30 m), `\|y\| > 9`, and `localX > holder's localX − 6` — the come-around |
| **F3** | a pass was actually released to him during the span (`pendingPass.targetGid`) |
| **F4** | the sim's own counter fired — `team.stats.overlaps` incremented, which requires the release to ARRIVE with `\|y\| > 11` |

F4 per match is, by construction, the counter part (a) measured. Reported per
arm: **per-match rates at each stage**, the **VALUE/OFF ratio at each stage**
with league-seed cluster CIs, and the **conditional transitions** F2/F1,
F3/F2, F4/F3 — because the ratio that collapses is the answer.

### 3.1 The information-class decomposition (ruling #22.4, VALUE arm)

At every F2-active tick in the **VALUE** arm, the holder's own perceived
snapshot is read and the overlapper is classified **READ / SEEN-UNREAD /
UNSEEN**. Two summaries per assignment:

- the share of its F2-active ticks in each class, and
- whether the overlapper was **EVER READ** — i.e. whether at any moment the
  man on the ball could honestly have aimed at him at all.

**F3 rates are then reported split by ever-READ vs never-READ.** The OFF arm's
legacy brain reads truth and has no snapshot, so this decomposition is
VALUE-only, exactly as the ruling specifies.

### 3.2 Context, reported

Per assignment, while the overlapper is live: ticks of team possession, and
completed passes by that team. Ruling #22.4's first hypothesis — that the
direct game starves the run's *development* — predicts these shrink in the
VALUE arm, and E5b/E5c already banked shorter chains and fewer passes overall.

## 4. Gates

| gate | claim | predicate |
| --- | --- | --- |
| **P0** | the instrument is inert | per cluster per arm, F4's total equals part (a)'s **banked integer** release count, and matches = 1,704. OFF: 158 / 156 / 186 / 101 / 287 / 163. VALUE: 74 / 65 / 82 / 66 / 126 / 129. Any mismatch ⇒ **INVALID** |
| **P1** | funnel monotonicity | F1 ≥ F2 ≥ F3 ≥ F4 in every cluster and arm. A funnel that grows downstream is a coding error, not a finding ⇒ **INVALID** |
| **P2** | coverage | ≥ 300 OFF-arm F2 assignments pooled — part (a)'s own A1 floor, re-used because the same Poisson arithmetic applies to the same counter |
| **P3** | determinism | two `runExperiment()` calls, canonical JSON byte-identical, SHA-256 emitted |

**This is a MEASUREMENT step.** There is no hypothesis gate: the stage ratios
and their CIs are the deliverable, reported under ruling #20's verdict
semantics, and the run is `INVALID` only if P0, P1 or P3 fails.

## 5. The hypothesis map, laid before the numbers

Ruling #22.4 pre-lays what each answer would mean, and it is recorded here so
the reading cannot be chosen after the fact:

- **Collapse at F1, or F1→F2** — the direct game starves the run's
  development. **No pricing fix exists at the choice seat**; the fork becomes a
  design question (joint / multi-step value versus the user's verdict on the
  direct game).
- **Collapse at F2→F3, carried by never-READ runners** — the measured cost of
  not-looking. **Seat 2 (gaze) unparks with a named fix.**
- **Collapse at F2→F3, carried by ever-READ runners** — contradicts the flip
  benchmark, which said he wins the price comparison. **Hard escalation back to
  the commander.**
- **Collapse at F3→F4** — the counter's geometry is displaced, an instrument
  finding. Any change to the counter is a **new pre-registration**, never a
  widening after a fire.

## 6. What E5f does not do

- No forks, no cloning, no `src/**`, no table, no flag default changed.
- It does not re-litigate the choice seat: E5e Phase 0 (b) answered that, and a
  probe that re-measured it would only be re-rolling a settled question.
- It does not gate E4 round 2, which ruling #22.5 opens independently.

## 7. Result — RUN 2026-07-26: MEASURED

SHA `6112f870…c0bb`, twice byte-identical. **P0 true, P1 true, P2 true.**

**P0 first, because nothing else counts without it.** Manual stepping plus
~85,000 extra `perceivedSnapshot()` calls reproduced **all twelve** banked
release integers exactly — OFF 158/156/186/101/287/163, VALUE
74/65/82/66/126/129, 1,704 matches per arm. The perception pull is re-entrant
in fact and not merely in argument, and this funnel is part (a)'s world.

### 7.1 The funnel

| stage | OFF /match | VALUE /match | ratio | cluster CI |
| --- | --- | --- | --- | --- |
| **F1** overlapper assigned | 4.556 | 5.020 | **1.102×** | [0.857, 1.359] |
| **F2** licence-active (came around) | 0.4000 | 0.4707 | **1.177×** | [0.800, 1.777] |
| **F3** released to him | 0.0915 | 0.0538 | **0.588×** | **[0.498, 0.727]** |
| **F4** the counter (arrived past `\|y\| > 11`) | 0.0414 | 0.0240 | **0.579×** | [0.478, 0.740] |

| transition | OFF | VALUE | ratio |
| --- | --- | --- | --- |
| F1→F2 | 8.78% | 9.38% | 1.068× |
| **F2→F3** | **22.86%** | **11.43%** | **0.500×** |
| F3→F4 | 45.24% | 44.55% | 0.985× |

**The collapse is one stage wide and it is exactly a halving.** Everything
upstream is fine or better — the value arm *assigns more overlappers* and gets
*more of them around the outside* — and everything downstream is untouched:
once the ball is released, it arrives wide just as often (0.985×). F4 inherits
F3 and adds nothing of its own.

F3's cluster interval is the only one that excludes 1, and its per-league
ratios are consistent: 0.64 / 0.42 / 0.54 / 0.57 / 0.53 / 0.90 — six leagues,
same direction. F1 and F2 are INCONCLUSIVE at the cluster level under ruling
#20's semantics (both intervals straddle 1), which is the honest label for
"not the problem" here.

### 7.2 ⛔ The class decomposition kills the perception hypothesis

VALUE-arm F2-active ticks: **READ 56,952 (66.9%) · SEEN-UNREAD 3 · UNSEEN
28,140 (33.1%)**. So a third of the time the man on the ball genuinely cannot
see the runner — the prior in ruling #22.4 was sound.

But the release rates go the wrong way for it:

| VALUE arm | F2 assignments | released | F3 rate |
| --- | --- | --- | --- |
| ever READ | 3,836 | 423 | **11.03%** |
| never READ | 976 | 127 | **13.01%** |

**Never-READ assignments release MORE often, not less**, and both sit at about
half the OFF arm's 22.86%. The drop is not carried by unseen runners; if
anything it is slightly worse where the passer could see him.

Two things stated rather than glossed:

- The OFF arm has no perception memories, so it has no class split at all — its
  22.86% is the whole arm, and the table above must not be read as OFF-versus-
  VALUE by class.
- F3 counts a release **anywhere in the span**, as §3 registered, while the
  class label comes from F2-active ticks. So a runner never READ at an
  F2-active tick could still have been READ at the tick he was actually passed
  to. That nuance cannot rescue the perception hypothesis — it would have to
  make the *ever-READ* rate the higher one, and it is the lower one — but the
  definition is what it is and the reader should have it.

### 7.3 Exposure is part of it, and cannot be all of it

Context, per assignment: the value arm holds the ball **longer** while the
overlapper is live (possession 32.81 → 36.45 ticks, live 43.82 → 46.49) but
completes **fewer passes** during it (0.0818 → 0.0541, **0.662×**) — the
direct game's shorter chains, showing up inside the overlap window.

So some of the F3 halving is simply fewer passes played while he is available.
**It is not enough to explain it**: exposure falls to 0.662× while release
falls to 0.500×. Comparing the two is a crude Fisher-style reading and not a
measured split — the two rates have different denominators (passes are counted
per F1 assignment, releases per F2 assignment) — so the honest statement is the
weak one, which is still decisive: *fewer passes are played in the window, and
that alone does not account for the halving.*

### 7.4 The verdict against the map laid before the numbers

| §5 branch | measured |
| --- | --- |
| collapse at F1 or F1→F2 (development starved) | ⛔ no — both go UP |
| F2→F3 carried by never-READ runners (the cost of not-looking) | ⛔ no — never-READ releases *more* |
| **F2→F3 carried by ever-READ runners** | ✅ **yes** |
| collapse at F3→F4 (counter geometry displaced) | ⛔ no — 0.985× |

**§5's stop rule for this branch is HARD ESCALATION back to the commander, and
that is where this goes.** The branch was written as *"contradicts the flip
benchmark"*, and it does: Phase 0 (b) measured the overlap runner as the
top-priced option at his own licence moments (deficit −0.82pp), and here the
chooser that prices him top picks him **half as often** — with the ball held
longer, with him around the outside more often, and with him visible for two
thirds of it.

Seat 2 (gaze) does **not** unpark on this evidence: the named fix that branch
would have bought is refuted, because the runners the passer *can* see are the
ones being declined.

**Two candidate reconciliations, both untested, neither chosen:**

1. **The flip benchmark was measured in the flags-off world** (E5e §6.2.4's own
   registered limit). If the value axis changes where bodies stand, the
   runner's price ranking at *its* overlap moments need not be what it was at
   the legacy world's. This is directly measurable — the flip benchmark, re-run
   with the VALUE arm as the harvested world.
2. **F2-active ticks are not pass-decision moments.** The chooser fires when the
   action layer decides to pass; the licence being active for 30 ticks does not
   mean 30 decisions. A per-decision release rate would settle it, and needs
   the trace rather than the funnel.

Nothing here is shipped, nothing in `src/**` changed, no counter was widened.
