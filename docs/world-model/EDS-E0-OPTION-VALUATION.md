# EDS E0 — Dormant pass-option valuation

Status: **PRE-REGISTERED — no run yet.** (Stage E0 of
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §3, ratified by the
user 2026-07-24: "选 EDS。按 Track E 跑 E0→E1→E2→E3,停在 E4 等我 play-test".)

Date: 2026-07-24

## 1. The question

> Can a pure, observation-only valuation of pass options — each candidate at
> 2–3 power levels, priced in flight time, corridor interception margin and
> receiver touch difficulty — reproduce the outcomes C1-A2 actually measured,
> **including the world's current defect** that a hot ball costs the receiver
> nothing?

Reproducing the defect is the point. If the evaluator predicts a reception cost
the world does not charge, it is not modelling this world, and E1's flagged
touch-cost curve could not be validated against it.

## 2. Authorised seat

ONE new pure module, `src/ai/passOptionValue.ts`, dormant with **zero live
callers**, composing banked machinery unchanged:

* `prediction.predictGroundPass` (already takes `powerMultiplier`);
* `passAffordance.evaluatePassAffordance` (already takes `powerMultiplier`) for
  arrival margins, receive pressure, progression, offside;
* `passCorridorInterception.evaluatePassCorridorInterception` (consumes
  `launchSpeed`) per observed opponent;
* a **documented mirror** of `mechanics.touchFailChance`'s curve, in the same
  pattern `prediction.ts` already uses to mirror `performPass` — because a pure
  `ai/` module may not import the sim's mechanics. A hostile test pins the mirror
  against the real function across an input grid, so the two cannot drift.

No `src/**` change anywhere else. No probe may wire it into a decision.

## 3. Information boundary (binding)

Allowed inputs: the passer's own `PerceptionSnapshot`, the probe-supplied
candidate target and power level, `KnownReachProfile`s, attack direction.

Forbidden: world truth, `Match`, RNG, another player's memory, private intent,
coach doctrine, familiarity, and — the subtle one — **the receiver's private
attributes**. A passer pricing *this* receiver's first touch would be
familiarity, which A4 owns. E0 therefore prices a **generic receiver at neutral
technique/positioning 0.5**, documented in the module. Receiver *velocity* is
observed and may be used (relative closing speed is physics, not knowledge).

## 4. Frozen protocol

The probe re-uses C1-A2's acceptance and outcome measurement **verbatim** —
same seeds `93,000..`, near-stationary receiver so all power arms share one
corridor, every arm drawing one execution gaussian, outcome decided by the FIRST
body to touch the ball — and adds the evaluator's predictions on the frozen
pre-kick state. Re-deriving C1-A2's measured rates is itself a validity check.

```text
accepted states                 120   (max 512 seeds from 93,000)
powers                          0.85 / 1.00001 / 1.15   (C1-A2 verbatim)
contested corridors             freeze laneOpenness <= 0.50
two invocations byte-identical  shared SHA-256
```

## 5. Frozen gates

### Exact validity

```text
C1-A2 measured rates reproduced exactly:
  opponent-first, contested   0.565 / 0.489 / 0.391
  touch failure               0.119 / 0.121 / 0.118
per-arm RNG draws equal        100% of states
non-finite / null valuations   0 (a null valuation on an accepted state is a FAIL)
zero live callers of the module (module imports no sim/Match; audited)
tsc + build clean · full suite green (incl. the mirror contract test)
production fingerprint          57b0bdab…c673 unchanged
```

### Prediction gates (evaluator vs the world it claims to model)

```text
P1 predicted interception threat (max defender corridor slack, seconds)
     strictly DECREASING in power on contested states                  ✓ required
     and the evaluator's per-state SAFEST option is 1.15 in >= 60%      ✓ required
P2 predicted touch-fail prior spread 0.85→1.15  <  3.0pp
     (the world's near-flat cost; 3.0pp is C1-A2's own resolution floor)
P3 predicted flight time strictly DECREASING in power
P4 predicted arrival speed strictly INCREASING in power
P5 AGREEMENT: measured opponent-first rate under each state's
     evaluator-safest power is at least 5.0pp lower than under its
     evaluator-riskiest power
```

Derivations, banked numbers only: P1's direction and P5's floor come from C1-A2's
measured 17.4pp contested spread across fixed powers — a per-state ranked
selection should capture at least a third of it, so 5.0pp is conservative. P2's
3.0pp is C1-A2's stated ±3.9pp resolution, floored. P3/P4 are physics sanity.

## 6. Stop rules

* **P1 or P5 fails** → the valuation does not model the interception physics it
  composes; E0 is refuted and the bundle has no evaluator. Park and report; do
  not add weights until it agrees.
* **P2 fails** (the evaluator predicts a cost the world does not charge) → the
  mirror or the arrival-speed derivation is wrong. Fix the *mirror*, never the
  gate, and re-run; the mirror is a factual claim about `touchFailChance`, not a
  tunable.
* Fingerprint drift or any live caller → revert; E0 is dormant by definition.
* No new tactical weight table, no scalar score, no use of
  `controlProbability` as a score (S4a: 95.2% of truth samples in its top
  quartile — it is an oriented dimension only).
