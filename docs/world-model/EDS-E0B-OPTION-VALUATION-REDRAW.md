# EDS E0b — Option valuation, measured at the first touch

Status: **PRE-REGISTERED — no run yet.** (Redraw of
[`EDS-E0-OPTION-VALUATION.md`](EDS-E0-OPTION-VALUATION.md) after its honest FAIL,
drafted by the autonomous session as working commander per
[`EMBODIED-DECISION-SLICE.md`](EMBODIED-DECISION-SLICE.md) §5.)

Date: 2026-07-24

## 1. What is being redrawn, and what is NOT

**The evaluator module is untouched.** Nothing about `passOptionValue.ts` was
refuted — P1, P3, P4 and P5 all passed, and P5 passed strongly (a per-state
ranked selection moved the measured opponent-first rate 21.2pp). Two
*measurements* failed, and both failures were informative:

1. the null gate treated "the passer cannot see this teammate" as an error,
   when it is the single most important thing E0 discovered (46% of states,
   the long passes);
2. P2 compared the predicted reception cost against a metric that **C1-B had
   already proved blind** — "ended in control" absorbs a spilled touch that M3
   recontact re-collects.

E0b changes only how those two things are measured. No gate value that passed is
touched, and the seeds stay the same.

## 2. The two measurement changes

1. **Measure the RAW first touch.** The probe already knows the tick of the
   target's first contact. M3 resolves the control attempt
   `CONTACT_CONTROL_DELAY_TICKS = 3` ticks later, so the honest question is
   whether the ball is owned by the target at `firstTouchTick + 3 + 1`. A spill
   the player re-collects two seconds later is a spill. The old
   eventual-control number is retained as a reported diagnostic so both metrics
   stay visible side by side — that comparison is the evidence for C1-B's lesson.
2. **Nulls are classified, not failed.** A state where the passer has no observed
   fact for the target is a legitimate absence of an option, and E2 must decide
   what to do about it. E0b reports the split and gates only **non-vacuity**:
   at least 40 contested states must price all three options, so the prediction
   gates have a real sample. (40 is the same floor D-TRI-0 used for a
   sample-of-96 protocol; the E0 run had 52.)

## 3. Frozen gates

```text
EXACT
  accepted states                   120  (max 512 seeds from 93,000)
  per-arm RNG draws equal           100% of states
  non-finite                        0
  contested states priced 3/3       >= 40                (non-vacuity)
  C1-A2 eventual-control rates reproduced exactly  0.119 / 0.121 / 0.118
  two invocations byte-identical, shared SHA-256
  module still pure, zero live callers, fingerprint 57b0bdab…c673 unchanged

PREDICTION (P1, P3, P4, P5 verbatim from E0; only P2 is restated)
  P1 predicted threat strictly decreasing in power, and the per-state safest
     option is 1.15 in >= 60% of priced contested states
  P2' AGREEMENT: | predicted touch-cost spread − measured RAW first-touch
     failure spread |  <=  2.0pp
  P3 predicted flight time strictly decreasing in power
  P4 predicted arrival speed strictly increasing in power
  P5 measured opponent-first under each state's evaluator-safest power is
     >= 5.0pp lower than under its evaluator-riskiest power
```

P2' derivation: the predicted effect is 3.95pp. The agreement band is half the
effect size, which is a stated criterion about precision rather than a threshold
fitted to any observed value — the predicted quantity carries real slack (the
actual relative speed at the actual touch, and a squad's technique distribution
against the neutral 0.5 the information boundary forces).

## 4. Stop rules

* **P2' fails high** (measured raw spread ≈ 0 while predicted ≈ 4pp) → the world
  genuinely does not charge for pace at reception even at the first touch, and
  C1-B's original premise stands unqualified. E1 then has to CREATE the cost, and
  E0's evaluator must be corrected to stop predicting one.
* **P2' fails low** (measured raw spread much larger than predicted) → the
  mirror's inputs are wrong, most likely the arrival-speed derivation. Fix the
  derivation, not the gate.
* **Non-vacuity fails** (< 40 priced contested states) → observation deletes so
  much of the option set that E0's prediction claims cannot be tested at
  awareness 0.8, which is itself the E2 question arriving early. Report, stop.
* A third re-pose of E0 is NOT authorised. If E0b cannot settle the reception
  cost, the question goes to E1 as an explicit open item and the fork returns to
  the user.

## 5. E0b RESULT — FAIL, and the stop rule binds (2026-07-24)

`scripts/probes/eds-option-valuation-firsttouch.ts`, seeds `93,000..93,126`,
120/120 accepted, 92 contested, 52 priced 3/3 (non-vacuity ✓), deterministic
across two invocations, SHA `2b7d6a3b…44cb`. Fingerprint `57b0bdab…c673`
unchanged; the module is still pure with zero live callers.

```text
P1 threat falls with power        0.843 → 0.586 → 0.446 s, safest=1.15 52/52  ✓
P3 flight time falls             1.713 → 1.303 → 1.061 s                     ✓
P4 arrival speed rises           5.99 → 8.69 → 11.39                         ✓
P5 ranked selection agrees       measured opponent-first 0.558 → 0.346        ✓
P2' agreement                    predicted +4.0pp vs measured RAW −6.2pp      ✗
C1-A2 eventual-control reproduced  0.136 / 0.106 / 0.145 (was 0.119/0.121/0.118) ✗
```

### The reproduction gate caught an instrumentation error of mine

The retained eventual-control diagnostic no longer matches C1-A2 — **because the
new raw measurement perturbs it.** E0b steps the match four ticks to resolve the
first touch *before* running the old up-to-12-tick ownership loop, so the second
metric no longer starts where C1-A2 started it. The two reception metrics are not
independent when measured in the same branch, and the exact gate that demanded
C1-A2 be reproduced is what surfaced it. That is the gate doing its job on the
experimenter.

### And the raw metric came out INVERTED, not merely different

Raw first-touch failure measured **0.220 / 0.227 / 0.158** — failure *falls* as
the ball gets harder — against a predicted **+4.0pp** rise. A 10.2pp
disagreement in the opposite direction is not a calibration gap; combined with
the contamination above it says the instrumentation, not the physics, is what is
being measured. A fixed four-tick window after "first contact" evidently does not
line up with the M3 control attempt the same way for a rolled ball as for a
drilled one.

### Verdict: the reception-cost question leaves E0 unsettled, by rule

**FAIL.** §4's stop rule is explicit and binds: *"A third re-pose of E0 is NOT
authorised. If E0b cannot settle the reception cost, the question goes to E1 as an
explicit open item and the fork returns to the user."* So:

* **Banked and robust** (identical across E0 and E0b, two byte-identical runs
  each): the evaluator models the interception physics — per-state ranking by
  predicted corridor threat moves the measured opponent-first rate
  **0.558 → 0.346 (21.2pp)**, with the safest option being 1.15 in **52/52**
  contested states, and predicted flight time and arrival speed monotone in power.
* **Banked finding** (unchanged by the redraw): at awareness 0.8 the passer can
  price nothing at all in **55 of 120 states**, split by distance (21.7m unpriced
  vs 16.8m priced) — observation deletes ~46% of today's options, mostly the long
  ones. This is the mechanism behind S3b's route collapse and it is E2's central
  design problem.
* **Unsettled and handed to E1 as an explicit open item**: what the world charges
  a receiver for pace. Three metrics now disagree — eventual control says ~0,
  raw-four-tick says it *falls* with pace, the formula says it rises ~4pp — so
  **E1's first job is a reception measurement that is trustworthy**, established
  against the real `attemptFirstTouch` roll rather than inferred from ownership
  timing. Until that exists, no touch-cost change can be validated, which is
  precisely what C1-B's revert already implied.

The fork returns to the user: E1 must be re-scoped around building that
measurement first, and that is a change to the ratified ladder's content, so it
is not the executor's call.
