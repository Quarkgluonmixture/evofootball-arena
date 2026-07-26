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

## 7. Result

*(To be filled in after the run, in a separate commit.)*
