# H0a — Handoff-continuation Failure Audit

Status: **PRE-REGISTERED. Read-only failure anatomy; H0 remains failed.**

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

