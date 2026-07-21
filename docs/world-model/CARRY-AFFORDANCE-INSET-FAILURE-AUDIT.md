# K0a-F — Carry-affordance Inset Failure Audit

Status: **COMPLETE — diagnosis A; K0a remains failed.**

Date: 2026-07-21

## 1. Frozen failure

K0a ran its pre-registered 120 matches on seeds 43,000–43,119. All support,
non-vacuity, tradeoff, determinism-adjacent and mutation gates passed except:

```text
candidate points outside the 2m inset = 204
required                            = 0
```

The overall K0a verdict is therefore `FAIL — STOP`. This audit cannot change that
verdict or authorise an execution primitive.

## 2. Question

K0 always emits one `hold` sentinel at the controller's current world position,
then rejects generated directional points outside the two-metre inset. A live
controller may already stand inside that boundary band.

K0a-F asks only:

> Are all 204 violations the current-position `hold` sentinel, or did K0 generate
> any directional carry target outside its frozen inset?

## 3. Method

Rerun the exact K0a state suite and cadence without changing K0, K0a, eligibility,
seeds or gates. For every point outside the two-metre inset, record:

* candidate ID and whether it is `hold`;
* controller position and candidate position;
* excess beyond the x/y inset;
* match seed and sim tick;
* whether the candidate differs from the controller position;
* whether it is still inside the physical pitch.

Also conserve:

```text
outsideInset = holdOutsideInset + directionalOutsideInset
```

Two runs must be byte-identical. No candidate is removed or reclassified inside
the original K0a report.

## 4. Diagnostic branches

### Diagnosis A — sentinel-domain mismatch

```text
directionalOutsideInset = 0
holdOutsideInset        = 204
all hold points equal controller position
all points inside physical pitch
```

This would mean K0 directional generation obeys its boundary, while K0a applied a
direction-target invariant to a current-state sentinel. K0a still stays failed.
Any revisit requires a versioned representation contract that explicitly separates
`hold/current state` from generated travel targets and uses fresh seeds.

### Diagnosis B — directional generation defect

```text
directionalOutsideInset > 0
```

K0 itself is defective. Correct the dormant representation under a new contract;
do not continue the carry line until the correction passes unit/full/fingerprint
gates.

### Diagnosis C — physical illegality

```text
physicalPitchViolations > 0
```

The observation contains an invalid point and requires a deeper world-state audit.

## 5. Exact non-authority

K0a-F may not:

* exempt `hold` from the already-run K0a gate;
* change the two-metre inset;
* alter candidate generation;
* rerun K0a on new seeds;
* claim support/tradeoff PASS;
* authorise `DribbleToPoint`, a selector, gene or live consumer.

## 6. Frozen result

Two byte-identical audit runs produced:

```text
eligible states                 5,873
outside inset                   204
hold outside inset              204
directional outside inset         0
hold point != controller point    0
physical-pitch violations         0
conservation                      pass
canonical sha256 6e296cd111d13f13815ed0c2c22587ce0eeb1770bd4d759f3c7a90520b1ca004
```

The diagnosis is **A — sentinel-domain mismatch**. K0's generated directional
targets all obeyed the inset. Every violation was the unchanged current-position
`hold` sentinel for a controller already inside the boundary band, and every such
point remained inside the physical pitch.

This does not retroactively pass K0a. The carry line stops before an execution
primitive. A future revisit would need a versioned representation contract that
types `hold/current state` separately from generated travel targets and a fresh,
pre-registered ecology; an immediate exemption or same-suite rerun is forbidden.
