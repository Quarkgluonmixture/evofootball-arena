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

### 7.1 (a) The HU top-up — PASS on every gate, and **HU REFUTED** by the re-run

Probe `scripts/probes/eds-e5c-inner-cell-topup.ts`, SHA `38c430e3…303e`, two
invocations byte-identical, fingerprint `57b0bdab…c673` unchanged. Topped-up
table committed as new data in `src/ai/passPrior.ts`, table SHA `a197b453…ed46`.

```text
U1 staging equivalence   PASS — the fast staging returns E5a's Z6/Z7 rows to
                         the last digit (129 @ 0.09302325581395349,
                         64 @ 0.421875, both progressions exact)
U2 rest untouched        PASS   U3 committed = census   PASS
U4 coverage              PASS — Z6 902/869, Z7 400/400 (floor 400 per set)
U5 held out              PASS — Z6 0.22pp, Z7 2.00pp (tolerance 5.0pp)
```

**A1 — the correction is large, and it also deflates a mirage:**

```text
        E5a               topped up (set A)     held out (set B)   marginal
Z6      129 @  9.30%      902 @ 11.97%          869 @ 12.20%        7.15%
Z7       64 @ 42.19%      400 @ 28.25%          400 @ 30.25%        7.15%
```

Z7's banked 42.19% was the thin-sample reading E5a §7.1 flagged; at 6× the data
it settles at 28.25% — still four times the marginal the chooser had been
paying it. Both cells now clear the floor and price themselves.

#### ⚠️ U1 surfaced a DEFECT IN E5a, and this is its disclosure

U1 failed on its first run, and the diagnosis is not the staging. E5a's Z6 is
**12 shots / 129 receptions**; the first E5c replay found **the same 12 shots /
83 receptions**, and both progression figures rescale between the two
denominators to the last digit. The fork points were proven identical
separately (same pass ticks, all consumed, a pending pass at every one).

The difference is the reception DEFINITION, and it is E5a's that is wrong:

* E2a-2's registered convention counts an arrival that never reaches
  `attemptFirstTouch` as a clean reception — it is not an adjudicated spill.
  E5a inherited that correctly.
* **But E5a then skipped the value window for exactly those receptions and
  recorded them as no-shot by construction.** They sit in the denominator as
  guaranteed zeros that were never simulated.

Two consequences, and one correction to my own conduct:

1. **My probe was also wrong against its own contract** — it excluded
   unadjudicated arrivals, so U1 compared two definitions instead of holding the
   definition fixed and testing the staging. Corrected to E5a's convention
   verbatim (a fix toward the pre-registration, not toward a number), after
   which U1 passes exactly.
2. **The defect is now sized rather than described.** 34.48% of Z6's receptions
   and 28.75% of Z7's never adjudicated; simulating those windows anyway, they
   produce shots at **7.07%** and **10.43%** — not zero. So Z6 is deflated by
   ≈2.44pp (11.97 → 14.41) and Z7 by ≈2.80pp (28.25 → 31.25), and **every other
   cell in the table by an unmeasured amount.**
3. **Not repaired here.** Keeping E5a's convention is what makes the two topped
   cells comparable with the six untouched ones; repairing it means re-censusing
   all eight and re-banking E5a, which is a commander call on a banked milestone
   (ruling #16.1). Recorded at the table in `passPrior.ts`.

#### U6 — the E5b re-run, gates verbatim: **HU REFUTED**

`eds-e5b-value-axis-audit.ts` byte-unchanged (`git diff` empty), world SHA
`4884e5c3…807b`, world-deterministic.

```text
                 flags-off   v1 bundle   value (E5a)   value (topped)    gate
third-man           6.851    4.130         3.231       2.707  0.395x      ⛔
overlap            0.0927   0.0687        0.0775      0.0734  0.791x      ✅
forward share      59.81%   57.24%        56.75%      59.60%  −0.21pp     ✅
shots               12.52    13.18         14.71       15.54  1.241x      ✅
```

**HU REFUTED on its own criterion: 0.395× is below the 0.653× line, and below
the un-topped 0.472× — the top-up made third-man play WORSE.**

**But HU is CONFIRMED on the forward share**, and the contract did not
anticipate that split: −3.06pp → **−0.21pp**, from failing to passing, because
the most advanced men stopped being under-priced. The sampling defect was real
and it was doing exactly what a sampling defect should do — on the axis that
measures how far forward the ball goes, not on the axis that measures whether
teams combine.

Everything else held with nothing else changed: **Y4V 0 disagreements /
10,292**, all seven banked families bit-identical, §2 band inside on all five
(goals −7.50%, crosses ±0.00%, headers +19.84%, long balls +5.19%, cutbacks
−3.83%), dominance 27.16%, perf **1.187×** mean / 1.149× p95.

**A2/A3 — the direction the top-up pushed:** passes/match 63.88 → **56.52**,
longest chain 3.84 → **3.26**, give-and-gos 0.533 → **0.255** (flags-off 0.457),
shots 14.71 → **15.54**. Pricing the box at four times the marginal makes the
chooser drive at it whenever it can see someone there, and the intermediate
passes combinations are built from disappear. That is not a sampling artifact;
that is the same one-step argmax with a steeper gradient.

### 7.2 (b) The HM state-blindness test — **HM REFUTED**, narrowly, with the direction right

Probe `scripts/probes/eds-e5c-pattern-value.ts`, SHA `1658231a…36d3`, two
invocations byte-identical, harness reproduces on all three seeds, 50 matches.

```text
              n     predicted V̂    realized     gap        gate
pattern     608        8.80%        12.17%     +3.38pp    >= +4.0pp   ⛔
control   1,567        7.39%         7.34%     −0.06pp    ±2.0pp      ✅
```

**HM REFUTED by the letter: +3.38pp against a +4.0pp floor.** Reported exactly
as it fired — no predicate is rewritten after results. Two honest qualifications
the commander should weigh, neither of which changes the verdict:

* The **direction is right and the control is exquisite.** At n = 608 and
  p ≈ 0.12 the SE is ≈1.32pp, so the pattern gap is ≈2.6σ from zero while the
  control sits at −0.06pp on 1,567 receptions. The table is right everywhere
  else and under-predicts the licensed runner's destination. State-blindness is
  real; it is just **smaller than the band I pre-registered**.
* **B1 splits it:** third-man **+2.96pp** (n=579) and wall-return **+11.73pp**
  (n=29 — far too thin to carry weight, reported for completeness).

**B2 corrects ruling #16.3's geometric premise, measured.** The licensed
runner's destinations are **Z2 51.8% · Z4 21.9% · Z3 18.3% · Z6+Z7 4.1%** —
third-man runners overwhelmingly arrive in the middle third and the outer
attacking third, **not the inner box**. The confound the ruling registered
(overlap→outer, third-man→inner) is not what the geometry does, which is why
the top-up could not have rescued third-man play and, in the event, did not.

**B4 is the number the attribution turns on: the licensed runner is a genuinely
HARDER pass** — clean reception **40.16%** against the control's **51.77%** at
the same moments.

### 7.3 Attribution — **NEITHER fires, and the third cause is visible in these numbers**

Per §6 this returns to the commander. But the two tests did not merely fail;
between them they leave one reading standing, and it is arithmetic on measured
quantities rather than a new hypothesis:

```text
per forced pass, at the same moments        pattern      control
clean reception (B4)                         40.16%       51.77%
V̂ the table gives the destination             8.80%        7.39%
realized shots per FORK                       4.89%        3.80%   <= reality
P̂-proxy × V̂  (the chooser's own axis)         3.53%        3.83%   <= the chooser
```

**The composed axis INVERTS the true ordering.** Playing the third man is worth
**+1.09pp** more per attempt than the alternatives at the same moment — and the
chooser scores it **−0.29pp** worse, because his P̂ deficit (−11.6pp of clean
reception, real and correctly measured) swamps a V̂ advantage worth +1.4pp of
cell value plus the +3.4pp of state the table cannot see.

So the failure is **not** that V is too coarse (HU: the correction went the
wrong way) and **not** mainly that V is state-blind (HM: real, but +3.4pp when
the deficit to overcome is ~12pp). It is that **a per-option argmax over
P̂ × V̂ declines the pattern pass on an axis where declining it is locally
correct.** The legacy layer's ×1.15/×1.3 multipliers were not decoration — they
were buying a pass that does not win an honest one-option-at-a-time comparison
and yet pays off across the move. Every one-pass shape survived the value axis
precisely because it never needed that subsidy.

Three readings for the commander, in the order the evidence supports them, and
**none of them tested here** (§6 forbids hunting a fourth measurement in this
session):

1. **The joint is measurable and the chooser is not using it.** The 4.89% vs
   3.80% above is P × V measured TOGETHER on the same forks. A value seat that
   prices the joint outcome per option — rather than composing two separately
   measured halves — would rank the third man correctly, with no hand weight and
   no new horizon.
2. **State-conditional value (E5d as ruling #16.4 framed it)** is real but
   under-powered as a sole repair: +3.4pp against a ~12pp deficit.
3. **The sampling repair should ship regardless of the fork** — the topped-up
   table fixed the forward share, and the unfollowed-window defect in §7.1
   deflates every cell in the banked E5a table by an unmeasured amount.
