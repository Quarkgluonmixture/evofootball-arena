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

## 7. Result — RUN 2026-07-26: MEASURED

SHA `b6a5f43d…6c2a`, twice byte-identical. **P0 true · P1 true · P3 true ·
P2 FALSE.**

- **P0** — world hashes byte-identical trace-on vs trace-off on all three
  seeds. The `src` sidecar is a sidecar.
- **P1** — the funnel reproduces **every** E5f banked integer, per cluster:
  matches, F1, F2, F3, F4 and the counter.

### 7.1 ⛔ P2 fired, and it is my design error

I set the coverage floor at 2,000 licence-active decision moments. The staging
contains **854**, and not because a budget ran out — six leagues × 24 seasons
is the whole of it, pinned by P1. **The floor was unreachable by construction**,
and I set it without checking the quantity was available.

This is the class of error ruling #19 codified, in its worse form: that ruling
was about *inheriting* a gate value without re-powering it, and here I invented
one. It is not lowered after the fact — §5 already says P2 does not invalidate,
so it stands as fired, and the consequence is simply that every interval below
is wider than I planned for.

### 7.2 The dominant fact is upstream of all three outcomes

E5f counted **4,812** matured overlap runs in this arm. This probe finds
**854** decision moments inside them:

```text
decisions per matured run = 0.177     (per cluster 0.155 – 0.194)
```

**In 82% of matured overlap runs, the man on the ball never takes a pass
decision while the licence is active.** Ruling #23.3 called outcome (a) "the
licence window and the decision cadence are different clocks"; this is that
statement quantified, and it is bigger than the menu-level effect the outcome
was worded around. The three outcomes partition the decision moments; this says
how few there are to partition.

### 7.3 The three outcomes

At the 854 licence-active decision moments (mean executable menu 2.56 options):

| | rate | cluster CI |
| --- | --- | --- |
| the runner is priced at all | 88.52% | — |
| on the **executable** menu | **75.41%** | [73.54, 76.89] |
| **top-priced** | **51.17%** | [48.99, 54.25] |
| **chosen** | **51.17%** | [48.96, 54.20] |

Over the 417 moments where he is not the pick:

| outcome | n | rate | verdict |
| --- | --- | --- | --- |
| **(a)** not on the menu | 210 | 50.36% [46.6, 53.9] | live |
| **(b)** on the menu, not top-priced | 207 | 49.64% [46.1, 53.2] | live |
| **(c)** top-priced and NOT chosen | **0** | **0.00%** | ⛔ **does not occur** |

⭐ **Outcome (c) is exactly zero, and the rank histogram says why it is not a
rounding artefact**: 437 moments at rank 1, 437 chosen. **Whenever the runner is
top-priced he IS taken.** The live argmax is clean — there is no seam defect,
and #23.3's hard-escalation branch does not fire. Ranks below: 121 second, 62
third, 24 fourth.

### 7.4 ⭐ The flip benchmark did not transfer, and #23.2 called it

Phase 0 (b) measured the runner **0.82pp ahead** of the best alternative at his
own licence moments — in the **flags-off** world. Here, in the world that
actually runs:

```text
runner's mean price   0.0861
winner's mean price   0.0954
margin AGAINST him   +0.0092   (0.92pp)
```

**The sign flipped, by about the same magnitude.** Ruling #23.2 registered this
before the run — *"0.82pp is a thin win on an axis with 13.41pp of range, and
it may simply not survive the world shift"* — and it did not survive. Being
top-priced is a coin flip (51.17%), not a property.

**Which input moved?** Not geometry, and not the ladder:

- the runner's **priced cell equals his truth cell 96.27%** of the time — the
  stale-geometry seam the contract went looking for is essentially absent;
- **`band === −1` never happens** (0.00%) — every on-menu option carried a real
  corridor read, so the frozen ladder never took over;
- info classes at these moments: **READ 644 · SEEN-UNREAD 0 · UNSEEN 112 ·
  not-in-window 98** — consistent with E5f, where the declined runners were the
  visible ones.

So the loss is in the *comparison*, not in a broken input: at these moments the
other men are simply priced higher by the same honest table. The most common
priced-cell → winner-cell pairs are **2→2 (268)** and **3→3 (160)** — the winner
usually sits in the runner's **own** cell, so what separates them is the threat
band, not the destination — with **2→4 (91)** the leading cross-cell case, a
genuinely more advanced man. ⚠️ These pairs pool his wins with his losses
(a win is his cell → his cell), so they locate the comparison rather than
decompose the losses; the rank histogram is the loss structure.

### 7.5 §3.1's fourth quantity found the opposite of a gap

I registered the chooser→release gap in case the action layer was declining to
pass at all. Measured: the chooser picks him **437** times, while E5f banked
**550** releases across the same 4,812 assignments. Releases *exceed* picks —
because F3 counts a release anywhere in the span, including ticks when the
licence is not active. **There is no action-layer loss to report**, and the
quantity runs slightly the other way. Registered, measured, and negative.

### 7.6 What this resolves, and what returns

The contradiction is resolved without a defect. Three measured components, in
order of size:

1. **The clocks differ** — 82% of matured runs never reach a decision while the
   licence is live. This is where most of the counter went.
2. **The benchmark did not transfer** — in the deployed world the runner is
   0.92pp *behind* the winner on average, not 0.82pp ahead, so at the decisions
   that do happen he is a coin flip.
3. **The argmax is clean** — outcome (c) is empty; nothing is broken.

Since (c) did not fire, the fork does **not** stop and no harvest-B re-run is
authorized (#23.3). What returns to the commander is a **design** question, not
a defect: the overlap pattern needs a decision to be taken while a run is live,
and the direct game does not take one in four fifths of them. Whether that is
answered by joint/multi-step value (E5c's third cause), by the run's own
timing, or by the user's round-2 verdict that the direct game is simply right,
is above this seat.

Nothing shipped; no table, default or counter changed.
