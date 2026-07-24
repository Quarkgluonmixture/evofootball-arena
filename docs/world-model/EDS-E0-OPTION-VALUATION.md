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

## 7. E0 RESULT — FAIL on two axes, with three findings that reshape E2 (2026-07-24)

`scripts/probes/eds-option-valuation.ts`, seeds `93,000..93,126`, 120/120
accepted, 92 contested, deterministic across two invocations, SHA
`79ab8339…d3fa`. `npx tsc --noEmit` clean; the module is pure and has zero live
callers; production fingerprint `57b0bdab…c673` unchanged.

```text
EXACT
  C1-A2 opponent-first reproduced   0.565 / 0.489 / 0.391   ✓ exact
  C1-A2 touch failure reproduced    0.119 / 0.121 / 0.118   ✓ exact
  per-arm RNG draws equal           120/120                 ✓
  null valuations                   165 (55 of 120 states)  ✗ gate was 0
  every state priced                65 of 120               ✗

PREDICTION
  P1 threat falls with power        0.843 → 0.586 → 0.446 s ✓ and the per-state
                                    safest option is 1.15 in 52/52 contested   ✓
  P2 predicted touch-cost spread    7.34 → 11.29 = 3.95pp   ✗ gate was < 3.0pp
  P3 flight time falls              1.713 → 1.303 → 1.061 s ✓
  P4 arrival speed rises            5.99 → 8.69 → 11.39     ✓
  P5 ranked selection agrees        measured opponent-first 0.558 (evaluator's
                                    riskiest) → 0.346 (its safest) = 21.2pp    ✓
```

### Finding 1 — the evaluator genuinely models the interception physics

P1 and P5 are not marginal. Ranking the three options by predicted corridor
threat and taking the safest moves the **measured** opponent-first rate from
55.8% to 34.6% — a **21.2pp** swing, *larger* than the 17.4pp available from any
fixed power, because the ranking is per state. Pricing pass options in TIME
works, and it works on observed facts alone.

### Finding 2 — observation does not blur the option set, it DELETES it

The 165 nulls are not scattered: they are **all-or-nothing per state**. 65 states
priced all three options, 55 priced none, and the split is by distance — mean
pass distance **21.7m for the unpriced states against 16.8m for the priced
ones**. The cause is the information boundary doing its job: at awareness 0.8 a
passer frequently has no observed fact for a distant teammate, and you cannot
price a pass to a man you cannot see.

**This is the concrete mechanism behind S3b's failure.** S3b's post-mortem
recorded that route richness collapsed when candidates shared an observed
snapshot (headers 6.39→4.05, cutbacks 3.96→2.46) and read it as "the score
table's dependence on omniscience". E0 now shows the sharper version: replacing
truth with observation removes **~46% of today's pass options, disproportionately
the long progressive ones**. Any both-sides perception stage must therefore
decide explicitly what a passer does about an unobserved teammate — vanishing
them is what broke S3b, and no amount of evaluator quality fixes it.

The pre-registered gate treated any null as a failure. That was the right gate to
have set (it forced this finding into the open) and it fails honestly, but it
conflated "the model cannot answer" with "the option genuinely does not exist".
The redraw separates them.

### Finding 3 — the touch-cost disagreement is most likely the METRIC, not the model

The mirror is pinned to `touchFailChance` by a passing contract test across a
5-dimensional input grid, so the curve is not in doubt. At the predicted arrival
speeds the formula implies a 3.95pp cost spread from 0.85 to 1.15, while the
measured spread is 0.0pp. But **C1-B already proved this measurement blind**
(§13.3): "ended in control" absorbs a spilled touch that M3 recontact
re-collects, and its own lesson was that future attempts must measure the FIRST
TOUCH. The most likely reading is therefore that the world does charge a small
reception cost, of roughly the predicted order, and that neither C1-A2 nor this
probe has yet looked at the right event.

If that is right it also sharpens C1-B's premise: the cost is not architecturally
absent, it is **small and previously unmeasured** — which changes E1's job from
"create a cost" to "make an existing small cost large enough to matter, and
measure it where it actually happens".

### Verdict and redraw

**FAIL** — axes: `null valuations` and `P2`. Per the EDS design §5 the queue
stops and the fork returns to the commander, which under autonomous mode is this
session; the redraw is **E0b**, pre-registered in
[`EDS-E0B-OPTION-VALUATION-REDRAW.md`](EDS-E0B-OPTION-VALUATION-REDRAW.md). The
evaluator module is NOT changed by the redraw — nothing about it was refuted; two
measurements were.
