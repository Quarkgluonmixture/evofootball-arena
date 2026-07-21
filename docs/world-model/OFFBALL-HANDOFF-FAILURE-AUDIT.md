# H0a — Handoff-continuation Failure Audit

Status: **COMPLETE — TARGET ACCESS IS NOT TRANSITION ACCESS. H0 remains failed.**

Date: 2026-07-21

## 1. Question

H0 moved the original passer exactly as intended, yet the forced return was
intercepted more often. H0a distinguishes two non-equivalent explanations:

```text
A. commitment staleness
   the initially positive target-access margin became non-positive over 1.5s

B. transition gap
   the target remained locally accessible, but target access did not describe
   whether the ball could travel from the new carrier to that target
```

This is diagnosis, not a retry. Neither result changes H0's failed verdict.

## 2. Frozen experiment

Run the exact H0 sample, intervention, four child streams, targets and outcomes:

```text
npx tsx scripts/probes/offball-pass-handoff-continuation.ts 128 29000 audit
```

Default H0 output must remain byte-identical to
`f3c006512648fb36cdb531529a3e8e07610225fef799d804769bcad79b328c2b`.

Immediately before each forced pass, use a fresh truth snapshot to re-evaluate
the same immutable branch target through O0 and record:

* `selfArrival`;
* `opponentArrivalMargin`;
* `nearestOpponentDistanceAtArrival`;
* `carrierLaneClearance`.

Attach those pre-kick facts to the already frozen Oracle-v2 first transition.
Do not move the target, regenerate candidates, change the pass or add a fact to
any selector.

## 3. Pre-registered interpretation

Report continuation initial→post movement facts, positive-margin retention, and
post-fact quartiles with intended/opponent first-transition rates.

Classify the dominant failure boundary as:

```text
STALE_ACCESS
  >= 50% of continuation states change from initial positive margin to
  post-movement margin <= 0

TARGET_ACCESS_IS_NOT_TRANSITION_ACCESS
  >= 80% retain positive post-movement margin
  AND continuation opponent control remains >= 70%

MIXED_OR_UNRESOLVED
  otherwise
```

These are diagnostic categories, not ship gates.

## 4. Validity gates and stop rule

```text
same 128 H0 states and 99 joint completions
audit evaluations per branch                 = joint completions
audit evaluation/non-finite failures         = 0
default H0 hash unchanged
Match/AI/selection changes                    = 0
```

H0a may only update the failure explanation. It cannot authorise a new
candidate fact, a live selector, S7e re-entry, more continuations, changed
thresholds or another H0 direction.

## 5. Frozen result

Two complete audit runs produced the identical output hash
`82d1af1ca094847c7e233d02c5f9bcfd31d0186d34fcb3ef631d1c0627fc5a44`.
The default H0 path remained byte-identical at
`f3c006512648fb36cdb531529a3e8e07610225fef799d804769bcad79b328c2b`.

### Validity

```text
frozen states / joint completions              128 / 99
post-movement O0 evaluations                  198 / 198
outcome-linked audit records                  792 / 792
evaluation/non-finite failures                    0
```

One hold target exposed an existing query-domain inconsistency before the
accepted run: generic candidate generation always permits the current `hold`
point, while the fixed-point evaluator incorrectly rejected a legal point in
the generator's two-metre boundary inset. The fixed-point query now accepts
every point inside the physical pitch; candidate generation and all live
selection remain unchanged. A boundary regression test covers the distinction.

### Pre-kick access anatomy

```text
initial continuation opponent-arrival margin  mean 0.231s · median 0.172s
post-movement opponent-arrival margin          mean 0.607s · median 0.451s
post-movement self arrival                     mean 0.249s · median 0.118s
post-movement nearest-opponent distance        mean 4.368m · median 2.775m
post-movement carrier-lane clearance           mean 0.530m · median 0.443m
positive post-movement margin                   87 / 99 (87.9%)
```

The commitment usually became **more**, not less, locally accessible as A
arrived. Yet that local fact did not pay in the forced B→A transition:

| post-fact quartile | Q1 intended/opponent | Q2 | Q3 | Q4 |
|---|---:|---:|---:|---:|
| opponent-arrival margin | 8.1% / 87.9% | 10.1% / 88.9% | 3.0% / 93.9% | 13.1% / 70.7% |
| carrier-lane clearance | 11.1% / 78.8% | 5.1% / 87.9% | 10.1% / 87.9% | 8.1% / 86.9% |

Even the widest carrier-lane quartile produced 86.9% opponent first control.
Neither fact gave a monotone transition outcome in this intervention.

## 6. Verdict

The pre-registered classification is:

```text
TARGET_ACCESS_IS_NOT_TRANSITION_ACCESS
```

O0 answers whether the mover can reach and locally occupy a target before the
nearest opponent under its arrival abstraction. It does **not** answer whether
the carrier can send a real ball through the evolving multi-player world so
that this mover becomes first stable controller. The H0 failure is therefore
not primarily a stale 1.5-second commitment.

This closes the cheap handoff-continuation path. `carrierLaneClearance`,
opponent-arrival margin or another O0 fact must not now be promoted into a
selector: the quartiles provide no licence, and doing so would adapt to a
failed result. A future off-ball consumer needs a pre-action transition model
that composes ball flight/contact/control with the conditional receiving state.
That boundary is consistent with the parked S7 evidence, but H0a does not
authorise S7e re-entry or another inference contract.
