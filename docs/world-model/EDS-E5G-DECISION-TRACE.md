# EDS E5g — The decision-moment trace: why isn't he taken?

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#23.3**. Nothing here may be tuned after first sight of results.

Date: 2026-07-26

## 1. The contradiction this exists to resolve

E5f localised the overlap collapse to exactly one stage — **F2→F3, releases per
licence trigger, 22.86% → 11.43%** — with more overlappers assigned upstream,
the counter's geometry intact downstream, and the perception hypothesis dead by
its own decomposition (never-READ runners release *more*).

E5e Phase 0 (b) had already measured the same runner as the **top-priced
option** at his own licence moments — flip benchmark −0.82pp.

So the chooser that prices him highest picks him half as often. Ruling #23.2
registers the obvious caveat before the measurement rather than after: **0.82pp
is a thin win on an axis with 13.41pp of range**, and it was measured in the
flags-off world. It may simply not survive the world shift. That is a
hypothesis, and #23.2's own census-geometry rule says price geometry gets
censused, not asserted.

## 2. What is logged

**VALUE arm only.** At every pass-decision moment inside an overlapper-live
window — a tick where the ball holder's team has an overlapper assigned and the
holder is not that overlapper — the trace records:

- the **executable candidate menu**, and every candidate's **live price** with
  its **`(cell, band)`** inputs;
- the runner's **presence on the menu**, his **rank** by price, and his
  **margin** against the winner;
- the **chosen target** (the chooser's own argmax);
- diagnostic — the runner's **priced destination cell** (from the passer's
  perceived position) beside his **truth cell** at that tick. If a stale-geometry
  seam exists, it shows up as a disagreement between those two columns.

### 2.1 How, and why this needs a sidecar in `src`

Ruling #23.3 requires "zero `src/**` **behaviour** change", not zero `src/**`.
The menu with per-option prices did not exist anywhere: `PricedPassOption`
carried no `(cell, band)`, and `PassChoiceTraceEntry` carried only counts. Both
are extended here, additively:

- `PricedPassOption` gains `cell` and `band` — values `pricePassOption` already
  computes internally, now carried out rather than re-derived by an observer
  who might derive them differently;
- `PassChoiceTraceEntry` gains `options` — written **only** when `traceChoice`
  is armed, read by nothing in the sim.

Re-deriving the menu from outside was the alternative and it is worse: it would
be a second implementation of the thing under measurement, and E5f's own lesson
is that the seam should be asked, not modelled.

## 3. The three outcomes, pre-laid and exhaustive

Ruling #23.3 lays them out and one must occur. They partition the licence-active
decision moments where the runner fails to be the chooser's pick:

| outcome | measured as | means |
| --- | --- | --- |
| **(a)** rarely ON the menu | the runner is not an executable option at most licence-active decision moments | the licence window and the decision cadence are **different clocks** — E5f's tick-basis limitation, named in its own §5 |
| **(b)** on the menu, NOT top-priced | he is executable but `rank > 1` | **the flags-off flip benchmark did not transfer**; the `(cell, band)` columns say which input moved |
| **(c)** top-priced, executable, NOT chosen | `rank === 1` and `chosenGid !== runnerGid` | a seam defect in the live argmax — **hard escalation, everything stops** |

### 3.1 A fourth quantity, which is not a fourth outcome

The three above are exhaustive over **the chooser's decision**. They are not
exhaustive over the *release*, because the chooser only picks a pass TARGET —
the action layer independently decides whether to pass at all (shoot, cross,
dribble, hold). So a moment can have the chooser correctly picking the runner
and no ball ever leaving.

**The chooser→release gap is therefore measured and reported separately**: the
share of licence-active decision moments where `chosenGid === runnerGid`,
against E5f's banked F3. If the chooser picks him far more often than the ball
reaches him, the loss is in the action layer, and that is a finding neither
(a), (b) nor (c) describes. Registered now so it cannot be presented later as
if it had been one of the three.

## 4. Staging

E5f's staging, **VALUE arm only** — the OFF arm has no chooser and answers none
of these questions. Six league seeds `20260702, 20260801–20260805`, 24 seasons,
`edsPerceivedDefence` + `edsPerceivedChoice` + `edsValueAxis`, plus
`traceChoice` armed. 1,704 matches per cluster.

The probe steps each match by hand (E5f's staging), keeps a per-tick record of
the overlapper's truth position, and drains `match.passChoiceTrace` per match —
joining trace entries to overlapper-live ticks and discarding the rest, so the
trace never accumulates across matches.

## 5. Gates

| gate | claim | predicate |
| --- | --- | --- |
| **P0** | the trace is a sidecar | world-hash identity: three seeds run with `traceChoice` on and off produce **byte-identical world signatures** (X3's convention — hashes cover world outcomes, the instrument is measured outside them) |
| **P1** | staging pin | the VALUE-arm funnel recomputed here reproduces **E5f's banked integers exactly**, per cluster: F1 7695/5471/10337/6456/9986/11376 · F2 701/515/718/472/1034/1372 · F3 78/65/78/59/145/125 · F4 33/33/31/32/59/57, and the counter 74/65/82/66/126/129. Any mismatch ⇒ **INVALID** |
| **P2** | coverage | ≥ 2,000 licence-active decision moments pooled |
| **P3** | determinism | two `runExperiment()` calls, canonical JSON byte-identical, SHA-256 emitted |

Cluster semantics per ruling #20: the cluster unit is the **league seed**, and
every rate is reported with a 2,000-resample cluster bootstrap over the six.

**A MEASUREMENT step.** Findings are reported; the run is `INVALID` only if P0,
P1 or P3 fails. Outcome (c) is the one exception to "measurement only" — it is a
defect finding and ruling #23.3 stops everything on it.

## 6. What E5g does not do

- It does not re-run harvest B in the VALUE world. Ruling #23.3 explicitly
  withholds that: the trace subsumes the decision question, and forks return
  only on outcome (c).
- It does not change a table, a default, or a counter.
- It does not gate E4 round 2, which is live and belongs to the user.

## 7. Result

*(To be filled in after the run, in a separate commit.)*
