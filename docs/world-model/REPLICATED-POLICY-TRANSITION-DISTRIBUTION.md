# T-DIST-0 — Replicated-Policy Transition Distribution Authority

Status: **COMPLETE — STRICT CONTRACT FAIL; engineering continuation explicitly authorised.**

Date: 2026-07-22

## 1. New question

C-RNG-0 showed that a forced arrival/contact race predicts the realised winner
only when it shares that winner's post-kick random future. It nevertheless
retained strong risk stratification. The next programme therefore changes the
estimand, not a cutoff:

> For an actually selected ordinary pass, does a finite ensemble of independent
> continuations under the unchanged live policy form a calibrated five-class
> predictive distribution on unseen matches?

This is not C-RNG with more streams. C-RNG replaced post-kick actions with a
fixed race and judged its modal winner. T-DIST-0 keeps all existing post-kick
brains/actions and evaluates proper probability scores against an independent
realisation. It does not predict or gate top-class accuracy.

It is also not T0b or T0b-R. Those fitted softmax models to one realised label
per forced candidate. T-DIST-0 fits no kick-feature model and studies only the
actually selected action. A pass can authorise a later process-distilled
estimator contract; it cannot select among targets.

## 2. Frozen data partitions

```text
development authority                 seeds 71000..71119
external validation                   seeds 72000..72119
final test                            seeds 73000..73119 (sealed)
matches per opened partition          120 × 240 seconds
awareness                             0.8, warmed carrier memory
post-kick child continuations         R = 8
child namespace                       0x7d157001
transition cap                        4.0 seconds
```

External validation may open only if development passes the support and exact-
validity preflight below. Development outcomes may define priors/baselines, but
may not change the model, gates or partitions. Final test remains sealed
regardless of result.

## 3. Frozen action and observation boundary

For each actually selected ordinary pass:

1. capture the actual passer's warmed pre-kick `PerceptionSnapshot` without
   consuming Match RNG;
2. freeze the pre-decision Match only when the live pass can be reproduced;
3. require the intended target to be supported by that snapshot;
4. force the identical pass in one label branch and eight child branches;
5. record an identical kick signature before any RNG fork;
6. leave every PlayerBrain, TeamBrain, action and target untouched after kick;
7. run the label branch with the untouched post-kick RNG;
8. run child `r` with private post-kick RNG:

```text
hashSeed(namespace, matchSeed, kickTick, passerGid, targetGid, r)
```

All branches use Oracle-v2's mutually exclusive first transition:

```text
intendedReception
teammateRecovery
opponentInterception
loose
deadBall
```

No Match RNG state, child seed, future controller, contact result or endpoint
may enter a probability feature. The observer corridor candidate-set presence
is recorded only for the frozen baseline below.

## 4. Finite ensemble probability

Eight samples do not identify a true per-state distribution and a zero count
does not prove zero probability. The raw counts remain authority metadata.

Development actual labels first define the global prior:

```text
g[k] = (globalCount[k] + 0.5) / (globalN + 2.5)
```

This is the only symmetric Jeffreys step and all five development classes must
have positive raw support.

For an external pass with child count `n[k]`, the frozen process-ensemble
predictor is a one-effective-observation global-prior posterior:

```text
p_process[k] = (n[k] + g[k]) / (8 + 1)
```

It is finite, positive and sums to one. The one-sample prior strength is frozen
before development. There is no fitted temperature, class weight, cutoff,
extra replicate or post-result calibration.

## 5. Frozen baselines

Two development-only probability baselines are fitted.

### Global

Every external row receives `g`.

### Observer corridor-presence

The same C-OBS zero-margin observer corridor broadphase yields only:

```text
candidateSetEmpty
candidateSetNonEmpty
```

For bucket `b`:

```text
p_corridor[b,k] = (bucketCount[b,k] + g[k]) / (bucketN[b] + 1)
```

This gives each bucket one effective global-prior observation and is fixed from
development. It does not use a post-hoc threshold, candidate identity, future
fact or outcome-dependent feature.

## 6. Proper scoring and uncertainty

On external validation only, score all five classes with:

```text
multiclass natural-log loss
multiclass Brier score
five one-vs-rest Brier scores
five fixed-width [0,0.1), ... [0.9,1.0] reliability errors
calibration-in-the-large residual for every class
```

Scores are averaged within match seed, then across 120 match clusters. Paired
improvements use 10,000 deterministic match-cluster bootstrap draws and a 95%
lower confidence bound. Calibration non-inferiority uses the corresponding 95%
upper bound. Whole five-vectors are always kept together.

Top-class accuracy, balanced accuracy and opponent-recall cutoffs are reported
only for historical anatomy, never as gates.

## 7. Development preflight

Development must satisfy before external seeds open:

```text
represented matches                              = 120 / 120
eligible ordinary passes                         >= 8,000
observer target coverage                         >= 75%
complete supported records                       >= 6,000
label and child transition resolution            >= 95%
all five actual labels present                    = yes
all five aggregate child outcomes present        = yes

force / identity / conservation failures         = 0
kick-signature mismatches                         = 0
within-pass child-seed collisions                 = 0
perception or frozen-Match mutations              = 0
configured child executions missing              = 0
non-finite / non-positive / non-unit vectors      = 0
two complete development runs byte-identical      = yes
```

Failure stops without opening external validation. No seed range, R, prior or
support boundary may change.

## 8. External gates

The same support and exact-validity gates apply externally. Probability gates:

```text
process vs global:
  relative mean log-loss improvement             >= 5%
  relative mean Brier improvement                 >= 5%
  paired cluster-bootstrap LCB on both            > 0

process vs corridor-presence:
  relative mean log-loss improvement             >= 2%
  relative mean Brier improvement                 >= 2%
  paired cluster-bootstrap LCB on both            > 0

classwise vs corridor-presence:
  intended and opponent Brier improvement LCB     > 0
  teammate/loose/dead Brier regression UCB        <= +0.001 each

calibration:
  process macro fixed-width ECE                   <= 0.04
  UCB95(process ECE - corridor ECE)                <= +0.005
  absolute calibration-in-the-large residual:
    intended/opponent                             <= 0.02 each
    teammate/loose/dead                           <= 0.01 each

non-vacuity:
  median row L1(process, global)                  >= 0.10
  top-vs-bottom opponent-probability quintile
    realised opponent-rate separation             >= 20 percentage points
```

The quintiles are formed by the frozen process probability with identity as a
deterministic tie breaker. They do not define a decision threshold.

## 9. Exact invariants

```text
Match / PlayerBrain / TeamBrain source changes    = 0
post-kick action or target interventions          = 0
live feature/probability consumer                 = 0
child or Match RNG exposed as a feature           = 0
result-dependent replicate or smoothing change   = 0
unsupported observer identity fallback            = 0
censored/invalid rows relabelled                   = 0
final-test reads                                  = 0
production fingerprint changes                    = 0
```

The production fingerprint remains
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 10. Verdict and authority

PASS requires development preflight and every external gate. It authorises
only a separate pre-registered **process-distilled observer estimator** design:

```text
kick-time observer facts
→ predict the five-class process distribution
→ validate on unseen matches against both the finite teacher and realised labels
```

It does not authorise estimator implementation, alternative-target selection,
transition × value composition, live AI, a pass score, utility scalar, gene,
evolution, Match clones or a visual sandbox.

FAIL means independent full-policy continuations do not form a sufficiently
calibrated state-specific teacher at `R=8`. Stop the distribution-teacher path.
Do not add R, change the prior, pool outcome classes, fit a cutoff, weaken
calibration or reopen the final seeds. A restart requires a causally different
world-state or policy representation, not another probability wrapper.

## 11. Frozen result

Two complete runs were byte-identical, including report SHA:

```text
development rows                         7,158 / 120 matches
external rows                            7,083 / 120 matches
child continuations                      8 per action
force / censor / identity failures       0
report SHA-256                           7a6310d7d0db0dc70fec0e959a0000538529294d61471efeb9d07b04fa1db97c

external log loss:
  process                                0.347122
  corridor                               0.688068
  global                                 0.714735

external Brier:
  process                                0.198050
  corridor                               0.366939
  global                                 0.380736

relative improvement:
  process vs global log / Brier           51.43% / 47.98%
  process vs corridor log / Brier         49.55% / 46.03%

calibration:
  process macro ECE                       0.006862
  corridor macro ECE                      0.002701
  UCB95(process ECE - corridor ECE)       0.006805
  frozen non-inferiority limit            0.005000

non-vacuity:
  median L1(process, global)              0.4201
  opponent quintile realised separation  59.25 percentage points
```

Every validity, support, proper-score, classwise, absolute-calibration and
non-vacuity gate passed. The sole failed gate was the pre-registered relative
ECE comparison: its upper confidence bound exceeded the limit by `0.001805`
(0.18 percentage points). Therefore the scientific verdict under the frozen
contract remains **FAIL**. The final `73000..73119` partition was not opened.

This failure must not be rewritten as PASS and the gate must not be loosened
after seeing the data. It also does not erase the much stronger proper-score
result. The two-bucket corridor predictor is deliberately low-resolution and
can achieve slightly lower ECE by staying close to broad base rates while
discarding most action-specific information. Here the process distribution is
still absolutely well calibrated (`0.69%` macro ECE), improves both strictly
proper scores by roughly half, and separates opponent risk by `59.25pp`.

The user therefore made an explicit engineering decision on 2026-07-22 to
retain this distribution as a strong **offline teacher authority** and continue
to a separately pre-registered observer-student experiment. This is an
authorised exception to the contract's research stop rule, not a statistical
PASS. It authorises only a fresh offline estimator contract. It does not
authorise final-seed reads, live AI, target selection, a utility score, genes,
or any production consumer.
