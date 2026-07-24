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
