# C-OBS-0 — Observer-Grounded Coupled Race Audit

Status: **COMPLETE — PASS. Portable exact-shadow design contract authorised;
no live authority.**

Date: 2026-07-22

## 1. Question

C-AC0 proved a global-truth ceiling: a corridor broadphase followed by the real
coupled movement/contact/control process predicts intended reception versus
opponent interception far better than corridor ETA alone.

That ceiling is not yet an agent representation. C-OBS-0 asks one narrower
question:

> If the passer may nominate corridor participants only from its warmed
> observer-specific `PerceptionSnapshot`, does the same physical race retain
> most of C-AC0's transition signal without any hidden identity fallback?

This does not build a portable predictor. The observer chooses identities from
perception; the probe clone then lets those actions execute in the authoritative
physical world, exactly as a future live action would. PASS can authorise only a
separate exact-shadow representation contract.

## 2. Frozen suite

```text
fresh match seeds                  69000..69119
matches                            120
duration                           240 seconds
awareness                          0.8
memory warming                     current stable carrier, every live tick
actions                            actually selected ordinary ground passes
administrative clearance          5 seconds
```

Before every live step with a stable non-GK carrier, update that player's
existing `PerceptionMemory` through `perceiveSnapshot()`. If the step creates an
ordinary pass, freeze the pre-decision Match and retain the snapshot produced
before that step. Eligibility does not read any later transition.

The chosen target must be present in the passer snapshot. Missing targets are
`observerUnsupported`; they are counted in coverage and never reconstructed
from Match truth.

## 3. Three frozen predictions

For each supported pass:

### B — corridor baseline

From the passer snapshot, include each observed active non-GK opponent whose
existing corridor `strongestMargin >= 0`. Predict opponent iff that set is
non-empty.

### T — truth-ceiling race

Reproduce C-AC0's oracle-truth candidate set and coupled race unchanged. This is
the sealed reference ceiling, not the primary consumer.

### O — observer-grounded race

Use only the identities admitted by B. Force the same pass in a clone, give the
target existing `ReceivePass`, observed corridor participants existing
`InterceptPass`, and all others existing `HoldPosition`; disable all brains and
run unchanged Match physics to first transition.

O may use the real Player bodies after the observer has named them because this
is an execution experiment. It may not use truth to add a missing identity,
change an observed position, or repair the observer candidate set.

## 4. Primary gates

Use the same actual intended-versus-opponent mapping as C-AC0. Other resolved
outcomes remain explicit and count as incorrect predictions.

```text
ordinary passes                         >= 8,000
target-supported passes                 >= 75% of eligible ordinary passes
supported actual binary records         >= 5,000
all T/O transitions resolved            >= 95% of supported passes

O balanced accuracy                     >= 80%
O - B balanced-accuracy edge             >= +10 percentage points
T - O balanced-accuracy loss             <= 5 percentage points
O intended recall                       >= 75%
O opponent recall                       >= 65%
O/T binary prediction agreement          >= 85%
```

## 5. Required mediators

```text
O and B predictions differ              >= 10% of supported binary records
on changed records:
  O correct - B correct                  >= +20 percentage points

actual opponent-rate separation under O >= +40 percentage points

observer and truth candidate sets are
not identical on every record           > 0 disagreements
```

The last gate prevents the audit from passing only because perception happened
to equal truth everywhere. Also report candidate-set precision/recall/Jaccard,
age distributions, missing-opponent count, exact-controller agreement and the
full five-class T/O transition table. None becomes a fitted correction.

## 6. Exact validity

```text
matches represented                         = 120
duplicate pass identities                   = 0
perception Match-RNG changes                 = 0
perception frozen-Match mutations            = 0
truth fallback identities                    = 0
normal/truth/observer force failures          = 0
controller conservation failures             = 0
administrative censors                        = 0
kick/RNG mismatch across the three arms       = 0
TeamBrain/PlayerBrain firings in race arms    = 0
new action types                              = 0
probe targetPos or physical-state writes      = 0
non-finite facts                              = 0
outcome-dependent support decisions           = 0
```

Two full runs must emit byte-identical JSON/SHA. The production fingerprint
must remain `57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.

## 7. Stop and authority

On failure, do not raise awareness, extend memory, lower corridor margin, add a
cue, impute missing players, use team-mate snapshots or tune the gates. Such a
restart requires a separate perception/communication hypothesis.

PASS authorises only a pre-registered portable exact-shadow narrowphase design.
It does not authorise running Match clones in live AI, a pass score, defensive
assignment, TeamBrain removal, payoff, evolution, genes or a visual sandbox.

## 8. Frozen result

Two complete runs were byte-identical:

```text
matches represented                         120 / 120
eligible ordinary passes                         8318
target-supported observer records          6708 (80.6%)
supported intended/opponent records              6300

balanced accuracy:
  observer corridor baseline                      63.8%
  truth coupled ceiling                           87.2%
  observer-grounded coupled race                  86.2%

observer intended / opponent recall         97.4% / 75.1%
observer-vs-truth binary agreement                 99.1%
observer-vs-actual controller identity              91.9%

changed baseline/observer records:
  correctness                                6.3% → 93.1%

observer/truth candidate-set disagreements          952
report sha256 8836634c55d8f421800113d3f827c213d0699b839d4906f05d95efe9078e0a77
```

All support, primary, mediator and exact-validity gates passed. Perception did
not consume Match RNG or mutate frozen worlds; no missing identity was restored
from truth; all three kicks and transition identities matched; the race arms
had no brain or coordination publication, action drift or target write.

The observer result lost only one percentage point of balanced accuracy versus
the truth ceiling even though 952 candidate sets differed. This establishes
that full omniscience is not required to preserve the coupled-process signal.
It does not establish that a Match clone is an acceptable live predictor. The
next authorised step is only a portable micro-state/shadow contract that must
reproduce this race without importing `Match`, AI, possession or payoff.
