# EDS E5c — The attribution experiment (HU vs HM)

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#16.4**, which authorised two independent cheap measurements on the existing
harness and named their order: (a) the HU top-up first, (b) the HM test on
(a)'s residual. Nothing here may be tuned after first sight of results.

Date: 2026-07-26

## 1. The question, and why the last result cannot answer it

E5b's central hypothesis died exactly where it was predicted to
(third-man 0.472×, worse than the v1 bundle's 0.603×) while one-pass shapes
recovered (overlap 0.835×, give-and-gos above flags-off). Two causes fit:

```text
HM  one-step MYOPIA          V = P(shot within 4.0 s of arriving HERE) can
                             never see a value that accrues to the NEXT
                             reception, and third-man play is definitionally
                             a two-pass pattern
HU  inner-box UNDERSAMPLING  E5a's Z6/Z7 cells (attacking third, inner half)
                             hold 129 and 64 receptions against a 400 floor,
                             so they read the 7.15% marginal — BELOW the
                             outer-third cells that were measured
```

Ruling #16.3 registered why the differential cannot arbitrate them: **overlap
runners target the OUTER attacking third (well sampled, 13.58%) while third-man
runners arrive in the INNER box (the two starved cells).** The pattern that
recovered and the pattern that died differ in their destination cell AND in
their pass depth at the same time. Only an experiment separates them.

## 2. What is measured

### 2.1 (a) The HU test — a targeted census top-up

E5a's staging and acceptance rules, verbatim, with two sampling-infrastructure
changes and nothing else (ruling #2.1's codified rule: budget is infrastructure,
not a gate):

1. **Cell-targeted enumeration.** Only candidates whose TRUE decision-moment
   zone is Z6 or Z7 are forked. Every other rule — plain ground pass moments,
   the 6–30 m window, target-choice-only intervention, the 240-tick follow, the
   12-tick adjudication window, clean-reception conditioning, the 240-tick value
   horizon with its dead-ball stop — is E5a's, unchanged.
2. **Fresh seeds.** Set A tops up from seeds **720,000+**, set B from
   **730,000+**, both continuing until each cell clears the floor in each set.

**The marginal and cells Z0–Z5 are NOT touched.** Adding inner-box receptions to
the marginal would over-represent the highest-value zones in the very number
that prices an unseen man. The topped-up table is E5a's table with two cells
replaced; gate U2 re-derives the rest.

**A faster staging, and the pin that makes it honest.** E5a cloned the world
every tick to hold a pre-tick fork point, which costs ~10 s of wall clock per
match and would make this top-up a multi-hour run. E5c walks each match twice
instead: once to record the ticks at which a plain ground pass registers
(no cloning, no perception), then once more cloning only at those ticks. The
world is deterministic and neither walk intervenes, so the fork points are the
same ones — but that is an argument, and **gate U1 turns it into a measurement**:
run this staging over E5a's OWN seed block and it must return E5a's Z6/Z7
numbers exactly, receptions and rates. Perception is dropped entirely because
the V table never consumed it (it is keyed on true positions; only the class
columns E5c does not need were perceived).

**Then the E5b probe is re-run with every gate VERBATIM**, its only input change
being the table. Ruling #16.4: *HU confirmed iff third-man recovers materially
with nothing else changed.*

### 2.2 (b) The HM test — is the table STATE-blind or sample-starved?

On (a)'s residual, and only meaningful after it: at **pattern-active moments**
the world is forked and the pass FORCED to the licensed runner, and the realized
outcome is compared against what the topped-up table predicts for that
destination.

Pattern-active is not a new definition — it is the legacy pass loop's own
licence predicates, read from truth (`PlayerBrain.ts`):

```text
THIRD-MAN     lastCompletedPass.receiverGid === holder && age < 1.5 s
              && lastCompletedPass.passerGid !== mate && mate is MakeRun
              && gain > 0.15
WALL RETURN   mate.wallRun active && mate.wallRun.partnerGid === holder
              && gain > 0.2
```

**The control is the same moments.** At each pattern-active moment every OTHER
window candidate is forked and forced too. So the two arms share their moments,
their world and their machinery, and differ only in whether the destination is
the licensed runner. That is what isolates state-blindness from a global
miscalibration: a table that under-predicts everywhere is broken; a table that
under-predicts *only the pattern's destination* is blind to the state.

Both arms are compared on the quantity the table actually claims:

```text
predicted   mean V̂(topped-up table, TRUE destination cell) over the clean
            receptions in that arm
realized    the share of those same receptions followed by a shot inside the
            240-tick window
gap         realized − predicted
```

Forks run in the flags-off world, exactly as the census measured V — the
circularity registered in E5 §2.1 is inherited deliberately, because the
question here is whether THIS table describes THAT world.

## 3. Authorised seat

* New probes `scripts/probes/eds-e5c-inner-cell-topup.ts`,
  `scripts/probes/eds-e5c-pattern-value.ts`.
* `src/ai/passPrior.ts` — the topped-up table added as NEW committed data
  beside E5a's, which stays untouched so its own X6 keeps reproducing;
  `valueZoneAt` re-points to the new table.
* `tests/valueAxis.test.ts` — the fallback pin follows the table it guards.
* **`scripts/probes/eds-e5b-value-axis-audit.ts` MUST NOT BE EDITED.** Its
  re-run is only a re-run if not one character moved.
* No other `src/**` change. Flags stay default OFF, fingerprint unchanged.

## 4. Frozen gates — (a) the HU top-up

### EXACT

```text
X1 production fingerprint 57b0bdab…c673 unchanged
X2 tsc + build clean · full suite green
X3 two invocations byte-identical                     shared SHA-256
X4 zero live callers of the probe; the only src change is committed data
U1 STAGING EQUIVALENCE — run over E5a's own seed block (700,000+, 4,500
   moments), the fast staging must return E5a's banked Z6/Z7 rows EXACTLY:
   129 and 64 receptions, shot rates 0.09302325581395349 and 0.421875
U2 UNTOUCHED REST — the committed topped-up table equals E5a's table in
   cells Z0–Z5 and in the marginal, bit for bit
U3 the committed topped-up table equals this run's census in Z6 and Z7
```

U1 is the gate that buys the speed. If the two-walk staging is not E5a's
staging, its numbers have no standing and the top-up is withdrawn.

### U4 — COVERAGE

```text
Z6 and Z7 each >= 400 clean receptions in BOTH sets A and B
```

The same floor E5a froze, now met rather than missed.

### U5 — HELD-OUT CALIBRATION (interval test)

```text
per topped-up cell   | V_A − V_B |  <= 5.0pp
```

E5a's V3 tolerance, verbatim. At n ≈ 400 and p ≈ 0.10 the SE of the difference
is ≈2.1pp, so 5.0pp is ≈2.4σ — the same standard the gated cells passed at.

### U6 — THE E5b RE-RUN, GATES VERBATIM

`eds-e5b-value-axis-audit.ts` unmodified, reading the topped-up table:

```text
HU CONFIRMED   H1 third-man ratio >= 0.85x           (E5b's own gate, passed)
HU PARTIAL     0.653x <= ratio < 0.85x               (materially above the v1
                                                      bundle's 0.603x)
HU REFUTED     ratio < 0.653x                        (no material movement)
```

The 0.05 margin on the v1 bundle's banked 0.603× is powered from E5b's own
counts: 11,674 third-man events in the flags-off arm and 5,506 in the value arm
give the ratio an SE of ≈0.008, so 0.05 is ≈6σ — this cannot move on noise.

**"With nothing else changed" is gated too:** Y4V's flag-off identity, the §2
band on all five dimensions, dominance and perf must all still pass. A
third-man recovery bought by breaking the equilibrium is not a recovery.

### Reported, never gated (a)

```text
A1 how far the topped-up cells move off the 7.15% marginal — the size of the
   correction HU is built on
A2 the full re-run watchability table, arm for arm (the six instruments)
A3 H2/H3/H4 under the topped-up table, so a partial recovery is legible
```

## 5. Frozen gates — (b) the HM test

### EXACT

```text
Y1 fingerprint unchanged · tsc + build clean · suite green
Y2 two invocations byte-identical                     shared SHA-256
Y3 zero live callers; probe-only, no src change beyond (a)'s data
Y4 HARNESS — forcing the target the brain itself chose replays the match
   bit-identically on three seeds (E2a-2's gate, inherited verbatim)
```

### M1 — COVERAGE

```text
pattern arm   >= 600 clean receptions
control arm   >= 600 clean receptions
```

At n = 600 and p ≈ 0.10 the SE of a rate is ≈1.2pp.

### M2 — THE STATE-BLINDNESS TEST (interval test, powered ex ante)

```text
HM CONFIRMED   pattern gap (realized − predicted)  >= +4.0pp
               AND control gap within ±2.0pp
HM REFUTED     pattern gap < +4.0pp
```

+4.0pp is ≈3.3σ at the coverage floor. The control condition is what makes it a
test of STATE-blindness rather than of the table: if the control gap also
exceeds its band, the finding is a miscalibrated table and the attribution is
neither HU nor HM — it returns to the commander as a third cause.

### Reported, never gated (b)

```text
B1 the gap split by pattern (third-man vs wall return)
B2 the destination cell mix of each arm — whether the pattern's runners really
   do arrive in the inner cells, which is ruling #16.3's geometric claim
   measured rather than assumed
B3 realized and predicted separately, so the direction of any gap is legible
B4 clean-reception rate per arm: the licensed runner may simply be a harder
   pass, which is a P-side fact and not a V-side one
```

## 6. Stop rules and what each outcome means

* **U1 fails** → the fast staging is not E5a's staging. Withdraw it, report; do
  not "fix" it into agreement after seeing the numbers.
* **U4 unreachable inside the sampling budget** → report the partial counts and
  stop; a cell that cannot be filled is itself the finding.
* **HU CONFIRMED and HM REFUTED** → the failure was sampling. The value axis is
  sound and E4 round 2 opens on the topped-up table (the commander's call).
* **HU REFUTED and HM CONFIRMED** → the failure is structural. One-step value is
  blind to two-pass patterns, and a state-conditional value slice (E5d) queues
  against seat 2 at that fork, per ruling #16.4.
* **BOTH fire** → both are real; the same fork opens with a stronger case for
  E5d, and the top-up ships with it.
* **NEITHER fires** → **a third cause exists that nobody has named.** Report
  that plainly and return to the commander; do not go looking for a fourth
  measurement in the same session.
* Any EXACT gate failing anywhere → nothing ships, flags stay default OFF, the
  fork returns to the commander.

## 7. Result

*(frozen on completion — (a) §7.1, (b) §7.2, attribution §7.3)*
