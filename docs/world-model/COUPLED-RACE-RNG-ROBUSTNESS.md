# C-RNG-0 — Coupled Race Post-Kick RNG Robustness

Status: **COMPLETE — FAIL. Portable shadow work stopped; C-AC/C-OBS retained
only as a shared-post-kick-RNG oracle ceiling.**

Date: 2026-07-22

## 1. Threat to the banked result

C-AC0 and C-OBS0 forced the same kick from identical clones. Their normal and
race branches therefore inherited the same post-kick Match RNG state. After
the actions diverge, call order may diverge too, so this is not an exact shared
shock ledger. But the first contact and first-touch attempt can still consume
corresponding draws.

A future agent cannot know the world's next random draw. Before designing a
portable shadow, C-RNG-0 asks:

> Does the observer-grounded coupled race retain its transition signal when
> its post-kick contact/control randomness is integrated over fixed independent
> child streams rather than paired to the realised match future?

## 2. Frozen suite

```text
fresh matches                       seeds 70000..70119
matches                             120 × 240 seconds
awareness                           0.8, warmed carrier memory
ordinary-pass eligibility           unchanged from C-OBS-0
post-kick child streams             R = 8
namespace                           0xc0a70001
```

The actual branch uses the untouched frozen RNG. Each race clone first forces
the same pass with the untouched RNG, verifies identical kick/ball/pending-pass
state, and only then replaces its private RNG state with:

```text
hashSeed(namespace, matchSeed, kickTick, passerGid, targetGid, replicate)
```

The frozen Match and actual branch are never mutated.

## 3. Race prediction

Candidate identities come only from the same passer-specific C-OBS-0 snapshot
and zero-margin corridor broadphase. Every replicate uses the unchanged race
actions and Match physics.

For each pass, record raw empirical mass across all five outcomes. Derive one
prediction only for the frozen direct binary audit:

```text
intended mass > opponent mass → intended
opponent mass > intended mass → opponent
tie or another outcome has the unique largest mass → other/incorrect
```

No smoothing, fitted probability, extra rollout or result-dependent tie break
is allowed. Raw masses are descriptive, not a calibrated per-state estimator.

## 4. Frozen gates

```text
eligible ordinary passes                   >= 8,000
observer target coverage                   >= 75%
actual direct binary records               >= 5,000
all 8 race replicates resolved             >= 95% of supported passes

independent-stream balanced accuracy       >= 80%
independent race - corridor edge            >= +10 percentage points
intended recall                            >= 75%
opponent recall                            >= 65%

mean largest five-class empirical mass     >= 75%
records unanimous across 8 streams         >= 60%

actual opponent rate when race says opponent
 - when race says intended                  >= +40 percentage points
```

Also report Brier anatomy for intended/opponent/other empirical mass, contact
and first-touch variability, and agreement with one shared-RNG race. These are
diagnostics, not replacement gates.

## 5. Exact validity

All C-OBS exact gates remain. Additionally:

```text
kick signature before RNG fork identical       = 100%
within-pass child seed collisions               = 0
all eight configured replicates executed        = 100%
actual Match RNG/state mutations from audit      = 0
result-dependent extra replicates                = 0
```

Two complete runs must be byte-identical. Production fingerprint remains
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 6. Stop and authority

FAIL means the C-AC/C-OBS result is a useful shared-randomness oracle ceiling,
not a portable agent model. Do not add R, smooth masses, change the tie rule,
drop variable records or expose Match RNG to an agent.

PASS restores authority for one portable exact-shadow contract. It still does
not authorise a live consumer, Match clone, pass score, defensive assignment,
payoff, evolution or genes.

## 7. Frozen result

Two complete runs were byte-identical:

```text
matches represented                              120 / 120
eligible ordinary passes                              8439
target-supported records                         6837 (81.0%)
actual intended/opponent records                       6453
independent child transitions resolved          54696 / 54696

balanced accuracy:
  observer corridor baseline                           64.9%
  one shared-post-kick-RNG race                         86.5%
  eight-stream independent empirical mode               66.9%

independent intended / opponent recall            92.5% / 41.2%
independent - corridor balanced-accuracy edge              +2.0pp
mean largest five-outcome empirical mass                  89.7%
unanimous eight-stream records                            62.7%
actual opponent-rate separation                           58.4pp
independent/shared prediction agreement                   86.5%

records with variable outcome / contact count       2550 / 3539
three-class empirical Brier score                         0.2248
report sha256 e9e60d7564fb699cda471ab74553cfeb651f72f90667f5a620ec8166d98c984b
```

Every validity gate passed: all child streams executed and resolved, kicks
were identical before the RNG fork, no child seed collided within a pass, no
frozen Match or perception RNG changed, controller identities conserved, and
no brain, central publication, action drift or target write entered a race.

The causal result failed three frozen gates:

```text
balanced accuracy                       66.9% < 80%
edge over corridor                      +2.0pp < +10pp
opponent recall                         41.2% < 65%
```

The empirical distribution was usually concentrated and still separated
high-risk from low-risk records: mean modal mass was 89.7%, 62.7% of records
were unanimous, and records predicted as opponent had a 58.4pp higher realised
opponent-control rate. But its modal outcome did not identify the realised
winner reliably once the actual branch's future contact/control draws were no
longer shared. The former 86% result therefore measured a useful paired-future
counterfactual ceiling, not information available to an agent at kick time.

Per the pre-registration, do not add streams, smooth the masses, fit a cutoff
to these results or expose Match RNG. A future probability-distribution model
would be a new transition-estimator programme with its own unseen-state and
calibration contract; the already stopped estimator family is not reopened by
this result.
