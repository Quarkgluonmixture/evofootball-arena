# BASELINE-NOW — probe baselines on the clean substrate-rebuild HEAD

> The **"before"** for the Pass–Arrival–Contest slice (docs/PROBE-CONTRACTS.md §5
> BASELINE-NOW class). Frozen on the post-tree-settle sim (budget `SQUAD_BUDGET 35.5`
> + keeper arc; `vision` reverted — commit `f192a08`+). Deterministic (fixed seeds) —
> reproduce with the command shown. When slice-1 lands, re-run each and compare the
> named metrics; the acceptance is probes + the user's play-test eyes (not goals≈2.0).

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
