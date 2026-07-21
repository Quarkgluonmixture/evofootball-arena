# BASELINE-NOW — probe baselines on the clean substrate-rebuild HEAD

> The **"before"** for the Pass–Arrival–Contest slice (docs/PROBE-CONTRACTS.md §5
> BASELINE-NOW class). Frozen on the post-tree-settle sim (budget `SQUAD_BUDGET 35.5`
> + keeper arc; `vision` reverted — commit `f192a08`+). Deterministic (fixed seeds) —
> reproduce with the command shown. When slice-1 lands, re-run each and compare the
> named metrics; the acceptance is probes + the user's play-test eyes (not goals≈2.0).

---

## control-sequence-anatomy — B1c-0 empty representation baseline
`npx tsx scripts/probes/control-sequence-anatomy.ts 120 0`

```
n=120 (seeds 0-119)
sequences 0.00/match · active 0.000s/match · touches 0.00/match · touches/sequence n/a
origin reception/interception/loose/self 0/0/0/0 · broken 0 · released 0 · unresolved 0
controller distance n/a · relative speed n/a · exposure 0.000s · virtual-foot distance n/a (B1c-1)
cadence n/a · opponent breaks 0 · fast reacquire 0
EXACT ZERO ownTouchOpenedM3=0 · ownTouchChangedPossession=0 ·
passArrivalContactsAfterControl=0 · duplicateSequenceStart=0
```

**Reads:** B1c-0 is genuinely representation-only. Normal matches fabricate no
control sequences, no micro-touches and no possession/contest events. B1c-1 must
move the mechanism metrics off zero while every exact-zero violation stays zero.
This baseline is read alongside `ball-control-anatomy` and post-M3
`contest-anatomy`; it does not replace either.

---

## contest-anatomy — S0 loose-ball / contest ledger
`npx tsx scripts/probes/contest-anatomy.ts 120 0`

```
n=120 (seeds 0-119)   goals/match 2.34
contests/match: 17.59   ledger: started 2111 == resolved 2111 OK
origin mix:   block 0.1% · keeperSpill 2.7% · tackleLoose 0.4% · firstTouch 0.0% · aerial 33.1% · deflection 63.7%
outcome:      losing-side retains 22.4% · opponent wins 34.8% · dead/out 42.8%
bodies@loss:  within 3m 1.98 · within 6m 3.87
zone (losing side): def 19.5% · mid 5.4% · att 75.0%
pinball chain: mean loose-touches/contest 1.47 · max 19
time-to-controlled: mean 2.40s
contest->chance (shot ≤3s, same side): 2.7%
```

**Reads (the honest "before"):**
- **~17.6 genuine loose balls/match**, and **75% happen in the losing side's ATTACKING
  third** — turnovers are where attacks break down high up, not midfield battles.
- **Loose balls are overwhelmingly deflections (64%) + aerial knockdowns (33%).**
  `tackleLoose`/`firstTouch` read ~0% because in today's sim a won tackle / clean
  reception resolves straight to controlled possession — it does NOT pass through a
  loose window. That absence is itself the finding: there is no modelled "50-50 /
  jostle" contest; capture is the instant 1.25 m owner-flip. Slice-1's S0 contest
  state is what will give tackles/first-touch a real contested phase.
- **Outcome: losing side wins it back 22% · opponent 35% · dead-or-out 43%.** Nearly
  half of loose balls just leave play — low "second-ball" retention.
- **contest→chance only 2.7%** and **pinball chain mean 1.47** (max 19): loose balls
  rarely become shots quickly, and sustained ping-pong is the tail, not the norm.
- ⚠ origin `tackleLoose`/`firstTouch` are structurally under-counted (see above) —
  watch the DEFLECTION/AERIAL split + outcome + contest→chance as the primary signals.

---

## reception-survival — the 1.5s after a completed pass
`npx tsx scripts/probes/reception-survival.ts 120 0`

```
n=120 (seeds 0-119)   goals/match 2.34
receptions tracked/match: 72.53
teamRetains@0.5s: 89.4%   @1.5s: 71.0%   (our ball, ANY player — the survival signal)
sameReceiver holds@0.5s: 11.5%   @1.5s: 6.7%   (low = fast release, NOT loss)
forwardReady@1.0s (turned to goal, still owns): 8.7%
nextOptionCount at reception (open mates, mean): 1.52
receiveToTurnover@1.5s (opponent has it): 22.1%
receiveToProgression@1.5s (ball +2m upfield): 67.7%
```

**Reads:**
- **The survival number: our team keeps the ball 89% @0.5s, 71% @1.5s; 22% become an
  opponent turnover within 1.5s.** `teamRetains`/`turnover` use `possessionSide`
  (sticky, so a pass in flight still counts as ours) — the honest retention signal.
- **`sameReceiver holds` (7–11%) and `forwardReady` (8.7%) are LOW BY DESIGN** — the
  ball circulates fast; few receivers sit on it or end up owning-and-facing-goal.
  Don't read these as "receptions collapse." When slice-1 adds check-to-ball /
  first-touch quality, the win condition is **forwardReady + progression UP without
  turnover UP** — a receiver who can turn and keep it, not just touch it.
- **~1.5 open mates at the moment of receiving** — thin option-count is exactly what
  the S5 affordance field + off-ball movement should widen.
- **68% of receptions progress the ball ≥2m upfield within 1.5s** — circulation does
  move forward; the question slice-1 asks is whether it can do so through the CENTER
  under pressure, not only by recycling.

---

## arrival-calibration — margin → outcome reliability curve
`npx tsx scripts/probes/arrival-calibration.ts 120 0`

```
n=120 (seeds 0-119)   passes tracked 92.3/match

reliability curve — arrival margin (defenderETA − receiverETA) → outcome:
  margin        share   received  interc.  died   stable@1.5s(of recv)
  <-0.5          9%      38%     57%     5%     67%
  -0.5..-0.2     9%      58%     39%     3%     65%
  -0.2..0       12%      63%     33%     4%     68%
  0..0.2        17%      75%     22%     2%     67%
  0.2..0.5      16%      86%     12%     2%     69%
  >0.5          36%      92%      4%     4%     76%

by pass kind:  pass 78.7/m recv 79% int 17% · through 9.8/m recv 57% int 38% · cross 3.9/m recv 69% int 29%
```

**Reads (the structural backbone):**
- **The curve is MONOTONIC and well-calibrated:** as the receiver's arrival advantage
  (defenderETA − receiverETA) grows from <−0.5s to >+0.5s, **received rises 38%→92%
  and intercepted falls 57%→4%.** Pass success today is cleanly governed by
  who-arrives-first — this is the relationship slice-1 must PRESERVE.
- **36% of passes already have a >+0.5s cushion** (92% received) — safe recycling
  dominates; the risky end (<0s margin, ~30% of passes) is where interceptions live.
- **The passer doesn't yet USE this** — it reads current-position lane openness, not
  arrival margin (S4 doesn't exist). Slice-1's win = the passer's read matches this
  curve so the pass MIX shifts toward +margin lanes that BREAK lines, **not** just
  more safe square balls. Watch: received% holding while through/line-breaking share
  rises (richer, not safer).
- **through-balls are the honest risky tail** (57% received / 38% intercepted);
  `stable@1.5s` ≈ 67–76% across buckets (matches reception-survival's 71%).

**Post-M3 S1 addendum (2026-07-21, slice-1a sub-step 2):** the frozen table above
remains the before-baseline. The probe now also emits a second, observational curve using
the new kinematic `timeToReach` (current velocity + acceleration + fatigue-adjusted speed +
body turn + control radius). On accepted M3 HEAD, 120 matches / 98.2 passes per match:

```
S1 kinematic margin   share   received  intercepted  died  stable@1.5s
<-0.5                  13%       33%         63%       4%       70%
-0.5..-0.2              9%       51%         46%       3%       65%
-0.2..0                10%       60%         36%       3%       66%
0..0.2                 14%       75%         22%       3%       70%
0.2..0.5               15%       84%         14%       2%       72%
>0.5                   39%       92%          5%       4%       78%
```

The intended structural direction is preserved before any AI consumer exists. This is
not yet S4 prediction accuracy: actual-vs-predicted ETA MAE comes online with the shared
short-horizon predictor.

---

## probe-pass (extended) — completion by NAMED pass type
`npx tsx scripts/probe-pass.ts 120 20260702` (the `type …` rows; the probe also still
prints its original kind/dist/lane/kind×lane rows)

```
120 matches, 11673 tracked passes (97.3/match)
type cross     n/match  2.5  comp 35%  fails 1.6/m (cut 95%)  line-brk 10%  fwd  -5.8m
type lateral   n/match  7.7  comp 82%  fails 1.4/m (cut 88%)  line-brk  5%  fwd   0.3m
type long      n/match 47.2  comp 80%  fails 9.6/m (cut 88%)  line-brk 55%  fwd   5.1m
type short     n/match 25.5  comp 83%  fails 4.3/m (cut 84%)  line-brk 35%  fwd   1.3m
type through   n/match 14.3  comp 50%  fails 7.2/m (cut 76%)  line-brk 79%  fwd  16.1m
(one-touch ≈ 0 — firstTouchWindow rarely open at a pass kick)
```

**Reads:**
- **`through` is the line-breaker: beats ≥1 defender 79% of the time and gains +16m —
  but completes only 50%** (risk/reward). `cross` is the low-yield wide delivery (35%
  comp, fwd −5.8m = sideways/back in the attack frame). `short`/`long` are the safe
  80–83% bulk.
- **line-brk% + fwd are the "was this a PROGRESSIVE pass" signal** (added by the
  extension). Slice-1's affordance/pass-valuation win = the passer picks more
  through/line-breaking lanes **while holding completion** — i.e. `through` share ↑
  and its comp% ↑ together, not just more safe `short`/`lateral`.
- `one-touch ≈ 0` today: the sim rarely kicks a pass inside the first-touch window —
  a genuine gap (one-touch combos) the substrate should let emerge.

---

## perception-calibration — the perfect-info baseline (S3 gate seed)
`npx tsx scripts/probes/perception-calibration.ts 120 0`

```
observation error (position MAE): 0.00 m  — PERFECT INFORMATION (AI reads Match truth; no S3 layer)
perfect-info exposure (headroom S3 removes):
  ball behind the player's facing: 26.5%
  ball > 20m away:                 28.0%
  either (limited-eye would degrade): 46.2%
```

**Reads:**
- **Observation error is 0.00 by construction** — every player reads the true `Match`
  state; there is no perception layer. This is the "before" the S3 gate compares to:
  when awareness-gated stale/limited perception lands, this probe must show obs-error
  rising from 0 as awareness < 1 (and the balance test: it must NOT change speed/pass/
  tackle — reading only).
- **46% of player-decision-ticks use ball info a limited eye would lack** (26.5% the
  ball is BEHIND the player's facing, 28% it's >20m away). Nearly half of decisions
  lean on omniscient info — that's the headroom S3 removes, and mechanically why
  perfect info collapses things like natural offside timing. When S3 lands, the win is
  decisions degrading GRACEFULLY (worse reads for low-awareness players), not the sim
  falling apart.

**S3a representation addendum (2026-07-21, accepted M3 behaviour):** the frozen
perfect-information block above remains the live-AI before-baseline. The same probe now
also runs the new `PerceptionSnapshot` offline for the on-ball outfield passer; nothing in
the decision path reads it yet. At 120 matches / seeds 0–119:

```
awareness   players/snapshot   pos MAE   vel MAE    age    missed ≤6m threats
0.2               5.7           0.54m    1.00m/s   5.7t          15.1%
0.5               7.0           0.46m    0.81m/s   5.4t          11.5%
0.8               8.1           0.38m    0.63m/s   5.2t           8.3%
```

This passes the S3 layer-gate directionally: awareness improves fidelity, freshness,
coverage and threat reads through the intended mediator, without changing speed, pass or
tackle mechanics. It does **not** yet prove that decisions use the information or that the
gene pays/selects; those are S3b's cognition-factorial and pass/arrival gates.

---

## pass-affordance-calibration — S4a/S5a offline layer gate
`npx tsx scripts/probes/pass-affordance-calibration.ts 120 0`

This samples only ordinary ground passes. At launch it evaluates the named target once
from exact copied truth and once through each synthetic S3 awareness level, then observes
the real intended-target reception/interception. It consumes no Match RNG and no result is
read by live AI.

```
n=120 (seeds 0–119)   ordinary passes 77.8/match (9,334 total)
S4 intended-flight, 7,020 target receptions:
  finite time MAE 0.278s · intended point→actual reception point MAE 3.18m
  friction-unreachable: 4/9,334 launches (one target still met it before the intended point)

awareness   usable coverage   margin MAE vs truth   control MAE   target age   no-opponent snapshot
0.2             59.5%               0.160s             0.024        7.3t              3.0%
0.5             73.0%               0.162s             0.024        7.7t              1.1%
0.8             81.1%               0.097s             0.015        4.7t              0.5%

exact-truth arrival margin   share   target received   intercepted
<−0.5s                         0.3%        30.8%           69.2%
−0.5..−0.2                     1.1%        43.1%           52.9%
−0.2..0                        2.4%        54.2%           39.2%
0..0.2                         7.5%        61.6%           32.4%
0.2..0.5                      21.7%        69.5%           24.7%
>0.5                          67.0%        80.0%           13.7%
```

**Reads:**
- The raw arrival margin passes the structural gate cleanly: all six reception buckets
  rise and all six interception buckets fall. This is useful information S7 can price.
- Better awareness buys both usable target coverage and, end-to-end, a more faithful
  affordance vector. A snapshot with no observed defender is rejected as unknown rather
  than mispriced as perfectly open. This
  establishes `FIRES→WORKS`; it still says nothing about `PAYS→SELECTED` because there is
  deliberately no live consumer or gene.
- The 3.18m point error is not presented as pure ball-physics error: it includes ordinary
  pass aim noise and receivers capturing the ball before the intended lead point. S2
  execution quality must remain a separate value dimension.
- The provisional `controlProbability` is **under-dispersed**: 95.2% of exact-truth
  samples land in 0.75–1.0 (actual target reception there is 76.4%; Brier 0.210). It is a
  monotonic prior, not a calibrated pass-success score, and must not be wired alone into
  the action table. The accepted S5 artifact is the raw vector.

---

## pass-value-frontier — S7a offline capability gate
`npx tsx scripts/probes/pass-value-frontier.ts 120 0`

S7a deliberately stops before utility weighting. It orients eight raw next-state
dimensions so “larger is better,” then keeps every non-dominated target. It does not use
the under-dispersed control prior and never chooses a winner among real tradeoffs.

```
n=120 (seeds 0–119)   comparable ordinary-pass choices 9,330
exact truth: 4.88 candidates/set → 4.39 on Pareto frontier
live chosen target: frontier 95.2% · dominated 4.8%
dominated target: 1.11 unambiguously better alternatives on average

awareness   candidate coverage   pair-relation agreement   frontier-membership agreement
0.2               57.3%                   88.8%                        89.5%
0.5               71.0%                   91.2%                        90.1%
0.8               80.3%                   94.1%                        92.5%

classification   n       target received   intercepted
frontier        8,885         75.6%           18.4%
dominated         445         68.5%           24.5%
```

**Reads:**
- The frontier is intentionally broad: it removes only 4.8% of current targets. Safe
  recycling and risky progression normally remain incomparable, so a future evolved
  preference can express style instead of inheriting one author-written answer.
- Awareness improves both pairwise next-state relations and frontier classification via
  the intended S3→S4→S5→S7 path. This is a mechanism/capability gate, not gene bite.
- Dominated choices correlate with 7.1pp fewer intended receptions and 6.1pp more
  interceptions. That is useful headroom evidence, but **not causal layer-4 proof**:
  different match contexts chose those targets. A paired offline rollout is still required
  before claiming that replacing the live choice pays.

---

## pass-target-counterfactual — S7b layer-4 payoff oracle
`npx tsx scripts/probes/pass-target-counterfactual.ts 120 0`

For each live ordinary pass whose chosen target S7a calls dominated, this probe retains
the immediately pre-decision `Match`, clones it, and forces two otherwise symmetric
branches: pass to the live chosen target vs pass to each predicted dominator. Both begin
with identical RNG state and call the same `performPass`; only the target differs. Each
branch runs for 3 seconds. This is offline only.

```
n=120 (seeds 0–119)   dominated live choices 454
paired 3.0s rollouts 509 · force failures 0

alternative vs chosen rollout relation:
  alternative dominates   175   34.4%
  chosen dominates        181   35.6%
  equivalent               21    4.1%
  tradeoff                132   25.9%

paired mean delta (alternative − chosen; larger is better):
  possession −0.079 · goals 0.000 · xG −0.001
  progression −0.357m · exit options −0.010
  own-team possession at 3s: chosen 53.4% → alternative 49.1%
```

**Verdict: FAIL at `PAYS`; do not wire S7a live.** The previous frontier-vs-dominated
outcome association was selection by match context, not evidence that switching targets
causes a better state. The paired oracle has no positive relation edge and the primary
possession outcome moves the wrong way. No tolerance or scalar coefficient was tuned.

**Structural diagnosis:** the current vector stops at arrival geometry. It omits the S7
causes needed to value what happens after arrival: passer/S2 execution risk, threat created,
threat conceded if lost, structure/rest-defence cost, and next-option quality. Those are
the only honest basis for a future offline retry; awareness/gene/live wiring remains blocked.

---

## ball-control-anatomy — B0 controlled-ball baseline
`npx tsx scripts/probes/ball-control-anatomy.ts 120 0`

```
n=120 (seeds 0-119)  goals/match 2.13
outfield secured: 23.8% of playing frames · moving 76.3% · pressured 80.6%
secured ball distance: mean 0.859m · pressured 0.858m · visible distance changes 111.96/match
knocks: 7.10/match · duration 0.656s · max carrier distance 1.277m
knock outcomes: self 85.1% · teammate 2.8% · opponent 11.3% · unresolved/dead 0.8%
```

**Reads:** the existing Phase-36 open-field knock is real and usually recoverable,
but rare. Four fifths of secured outfield frames are inside the current pressure
gate, where the ball remains essentially fixed at 0.86m. B1 must make that large
close-control surface readable without sacrificing the frozen M3 maximum recontact
tail of 8. The two rejected B1 candidates are recorded in
`world-model/BALL-CONTROL.md`; neither changed this accepted baseline.
