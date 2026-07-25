# EDS E3 — The co-evolution audit

Status: **RUN 2026-07-25 — ⛔ FAIL on five gates; the fork returns to the
commander (§6).** Pre-registered under commander ruling #10.5 (gates from the
design contract §3 (E3) and §4), approved to run as-is by ruling #11.2, and
run with every §3 gate untouched. X4 — the reproduction gate the stage rested
on — passed absolutely; the equilibrium did not absorb the bundle. Nothing
shipped.

Date: 2026-07-25

## 1. What E3 is, and the scope fact that shapes it

E3 is the last stage before the user's eyes. Everything before it ran
**dormant**: E0–E2b-1R built and validated an evaluator, a prior, an exchange
rate and a perception layer, and every one of them was measured either in a
probe world or through `forcedPassTarget`. Nothing has ever chosen a pass
inside a live match.

**So E3's first act is a build, not a run.** The bundle cannot be audited under
evolution until the passer's choice is a live consumer, because sealed evo runs
are ordinary matches — there is no probe standing beside them to compute a
choice and force it. That build is the last dormant-to-live step in the whole
slice, and it is why E3 carries the §2 equilibrium band that C1-B broke.

Ruling #10.4 already fixed the expectation this must be judged against: the
evaluator agrees with the live brain **only 38–47% of the time even under
omniscience**, so it is a genuinely different chooser. **E3 must expect play to
change.** The question is never "did anything move" — things will move — but
**"did the change stay in band, and did the ecology absorb it".**

## 2. The bundle, and what turns on

```text
edsTouchCost           E1b's honest speed-dependent control curve
edsPerceivedDefence    the defender's interception entry on its own ball percept
edsPerceivedChoice     NEW — the passer chooses via the evaluator, from his own
                       snapshot, over EXECUTABLE options, on the measured
                       probability axis (E2b-0's curve / band / marginal)
```

All three default **off**. E3 ships nothing: E4 is the ship gate.

### 2.1 The live chooser (the new build)

At the one point the brain has already decided to pass, the target is chosen by
the E2b-1R pricing rather than by `bestMate`'s lane score — same three
information classes, same measured axis, same executable-only rule (ruling #8
(l): a man you cannot aim at cannot be kicked to, however well he prices).
`observeBall`'s consumption-scoping principle binds here too: the passer needs
a full snapshot, but only at the moment he is actually choosing, so the
materialise-on-demand split E2b-1R built is what keeps this affordable.

**Reproduction gate before anything else:** with the flag on and the world
otherwise untouched, the chooser's per-moment selections on E2b-1R's own
staging must be **identical to E2b-1R's logged choices**. If the live consumer
does not reproduce the probe that validated it, the probe validated something
else.

## 3. Frozen gates

### EXACT

```text
X1 fingerprint 57b0bdab…c673 unchanged with all three flags off
X2 tsc + build clean · full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
X4 LIVE-CONSUMER REPRODUCTION: flag-on choices identical, per moment per arm,
   to E2b-1R's banked choices on the same staging
X5 perf: the full bundle within 1.25× / p95 1.50× of flags-off, interleaved
```

### §2 EQUILIBRIUM BAND (hard abort — C1 §4 verbatim, the gate C1-B broke)

8-season paired calibrate, seed `20260702`, against the frozen baseline
`goals 2.3944 · crosses 2.4894 · headers 9.1039 · long balls 6.2042 ·
cutbacks 3.8151`:

```text
goals/match        within ±15%        2.0352 .. 2.7536
crosses            within ±25%        1.8671 .. 3.1118
headers won        within ±25%        6.8279 .. 11.3799
long balls         within ±25%        4.6532 .. 7.7553
cutbacks           within ±25%        2.8613 .. 4.7689
```

C1-B broke this on goals (−15.37%) and long balls (+28.18%) with a *one-sided*
touch cost and a speed-blind evaluator. The whole EDS thesis is that the bundle
is what makes the same cost survivable, so this is the thesis' own test.

### BEHAVIOURAL CONTRACT SUITE (the three C1-B broke)

```text
aerial.test.ts   "wide teams cross more" — must NOT invert (C1-B: 28 → 21)
stamina.test.ts  "a full match SPENDS the tank"
freeAgents.test.ts / market
```

A suite test that encodes old touch numbers and fails is **a finding to report,
not something to re-baseline** (C1-B §12.4, verbatim).

### NO-STRICT-DOMINANCE (the E0 canary, now live)

```text
power usage must stay SITUATIONAL: the share of passes played at the highest
power must be  <= 80%  and  >= 20%  across the sealed runs
```

E0 measured that a cost-free world teaches always-heavy (safest = 1.15 in
52/52). E1b's canary sized the cost at 6.53pp against power's 21.2pp threat
benefit and explicitly did **not** settle dominance — it flagged it as a live
risk for exactly this gate. The 20/80 band is the operational form of
"situational".

### CO-EVOLUTION RESTORATION

```text
sealed fresh evo, >= 10 seasons, both sides under the bundle:
  defence adapts — the attacking advantage at generation 1 must SHRINK by
  generation 10 (the vision/positioning precedent: a one-sided read inflates
  goals until the other side co-evolves)
  style diversity NOT collapsed — the nameplate/style spread must not fall
  below 60% of the flags-off run's spread
```

### Reported, never gated

```text
R1 route mix under evolution, against S3b's collapse signature
R2 the always-heavy rate over generations — dominance forming or dissolving
R3 look-pressure in live play (the future gaze consumer's workload)
R4 how far the live chooser diverges from the old lane-score chooser
```

## 4. Stop rules

* **X4 fails** → the live consumer is not the thing E2b validated. Fix the
  consumer, never the probe, and re-run.
* **§2 band breaks** → honest revert of the whole bundle, per the design
  contract §5 and the four-revert lesson: treat drift as structural, not
  tunable. Report which dimension broke; ablation diagnostics (bundle minus one
  component) are authorised **only** to name the failing component, never as a
  partial ship.
* **No-strict-dominance fails** → the cost is too weak against the benefit,
  exactly as E1b's canary warned. Report; do not strengthen the curve to rescue
  the gate — that is fitting a constant to a symptom.
* **Co-evo restoration fails** → the bundle is a one-sided upgrade after all,
  which is the vision-attr saga repeating. Report to the commander.
* **Nothing ships from E3.** Flags stay default-off. Ship is E4, and **E4 is
  the user's play-test — the queue stops there.**

## 5. Implementation registrations (executor, BEFORE any result)

Ruling #11.2 approved §3 to run **as pre-registered — no gate changes**, and
none are made below. What follows is the operational form of predicates that
§3 states in words, written down before the run and before any number was
seen, per ruling #7.2's boundary (instrument/harness definitions in their own
commit, with the rationale, disclosed in the result). Every one is reported
with its parts so the commander can re-judge on the same numbers.

**(a) NO-STRICT-DOMINANCE is measured as the EVALUATOR's preference, not as a
played share — and the reason is structural.** The live game has no power
chooser: `Match.performPass`'s `powerChoice` argument has no production caller
(`Match.ts:775` — "every live caller omits it"), C1-C was deferred into this
slice, and E2b-0/E2b-1/E2b-1R priced power 1.0 only, so the calibration curve
this bundle chooses on cannot price a power. "The share of passes PLAYED at
the highest power" therefore has no live quantity behind it: it is 0% or 100%
by construction depending on whether 1.0 counts as "the highest", and a
predicate that cannot come out any other way is the structurally-undecidable
kind PROBE-CONTRACTS' sixth threshold type forbids. What E0's canary and
E1b's canary both actually measured is the EVALUATOR's preference (E0: "the
per-state safest option was 1.15 in 52/52"; E1b: "predicted touch-cost spread
3.95 → 6.53pp"), and §3's own stop rule reads the same way ("the cost is too
weak against the benefit, exactly as E1b's canary warned"). So at every live
pass moment the bundle prices its own chosen target at the substrate's three
powers (`PASS_POWER_MIN` 0.85 / 1.0 / `PASS_POWER_MAX` 1.15) and the gate is
the share of moments whose preferred power is the highest: **≥20% and ≤80%**,
exactly the frozen band. The joining rule, fixed here before results:

```text
price(power) = quintilePrice(threat(power)) × (1 − touchFail(power)) / (1 − touchFail(1.0))
```

At power 1.0 this is exactly the choice axis, so nothing is double-counted at
the reference point; away from it, the measured corridor axis is scaled by the
relative first-touch survival the E1a-certified formula predicts at flag-ON
strength (ruling #9.3 (c)'s decomposition). The per-power threat seconds,
touch-fail priors and prices are all REPORTED, so any other joining rule can
be applied to the same numbers afterwards. The played share is also reported,
for completeness: it is 100% at power 1.0, because nothing plays anything else.

**(b) X4's operational form.** E2b-1R banked aggregates, not a per-moment
choice log, so X4 is run as both halves of the same claim: (i) the live
consumer and a verbatim copy of E2b-1R's own pricing/argmax run side by side
on every moment of every arm, and must agree on **every one**; (ii) with the
live consumer doing the choosing, all seven of E2b-1R's banked aggregate
families must come back **bit-identical at full float precision** over the
same 3,000 moments × 4 arms, forks and all — the same standard E2b-1R's own
B1 gate used. One adaptation, disclosed: the reference copy prices a READ
option at `THREAT_CALIBRATION[q].realizedSuccess` rather than re-deriving
`reached × cleanGivenReached` from a 14,678-fork census E2b-1R already banked
and whose X5 pinned the two equal to <1e-12; any consequence would surface as
a per-moment disagreement or a broken bit-identity. Scope: X4 runs on
E2b-1R's staging, which advances the memory chain every tick; the live match
advances it at BRAIN CADENCE (the cadence E2's design gate names, and the one
E2b-1R's own live defence path uses), so X4 certifies the CHOOSER, and how far
live play diverges from the probe's chooser is reported as R4.

**(c) The candidate WINDOW is truth-measured (v1 scope boundary).** The 6–30 m
window is E0's censused window and the only range any prior in `passPrior.ts`
was measured over. It is enumerated on true positions, exactly as every E2b-*
probe enumerated it: the window decides which options EXIST, while the price
and the executable rule are perceived. Registered beside ruling #11.3's aiming
registration so nobody later claims more honesty than v1 delivers.

**(d) No executable option → the legacy choice stands, and the rate is
reported.** When the passer can see nobody he could honestly aim at, the
chooser returns null (it never invents an aim point) and v1 leaves the legacy
lane-score target in place rather than suppressing a pass the action layer has
already committed to — the seam is target choice only. This is an
informational leak in the blind direction and it is therefore MEASURED and
reported (`chosenGid = -1` in the trace), not hidden.

**(e) CO-EVOLUTION RESTORATION's operational form.** Two sealed 10-season evo
runs on the same league seed (424242), bundle ON and flags OFF, paired
generation by generation. The "attacking advantage" is the goals/match
difference ON − OFF at each generation; the gate is that its ABSOLUTE size
over the last three generations is smaller than over the first three (a
three-generation mean each side, because one 71-match generation is noisy).
Style diversity: at the final generation, distinct coach nameplates and the
mean entropy of the three style-share distributions, each **≥60%** of the
flags-off run's own value.

**(f) How the bundle is armed for a league or a test suite.** `League.matchFlags`
(a probe surface, not serialized, empty in production — the same pattern as
`sackingEnabled`) and an `EDS_BUNDLE=1` environment switch read once at module
load in `Match.ts` (the same pattern as `formations.ts`'s `EMERGENT_POS`), so
the behavioural contract suite can run under the bundle without every test
learning about a dormant slice. Unset ⇒ every flag off ⇒ the shipped world,
pinned by `tests/perceivedPassChoice.test.ts` and by X1's fingerprint.

**(g) The behavioural contract suite is run with `EDS_BUNDLE=1`** over the
three named files, and over the full suite for information; suite failures are
reported as findings, never re-baselined (C1-B §12.4).

## 6. RESULT — ⛔ FAIL (2026-07-25). The build reproduces; the world does not absorb it

`scripts/probes/eds-e3-coevolution-audit.ts`, world SHA
**`e667f476…dc73`**, world-deterministic across two invocations with perf
reported beside the hash (X3's corrected scheme). **Nothing shipped**: all
three flags stay default OFF, and the production fingerprint is
`57b0bdab…c673`, measured after the build.

The frozen run was executed twice, before and after the wiring fix §6.10
discloses. Every world field except the newly added ablation block is
**byte-identical between the two** (verified field for field; the first run's
SHA was `4b4cf985…532e`, and it differs only because the ablation section
joined the output). So the fix — which only mattered when the choice flag ran
WITHOUT the defence flag — provably did not touch a single audited number.

**Verdict: FAIL on five gates.** Per §4 and the design contract §5 the queue
stops and the fork returns to the commander. No gate was touched, no
component was tuned, and no partial ship exists in either direction.

### 6.1 What PASSED — and the one that matters most

```text
X4  live-consumer reproduction   ✓  0 disagreements in 10,292 per-moment
                                    comparisons (3,000 moments x 4 arms), and
                                    ALL SEVEN of E2b-1R's banked aggregate
                                    families bit-identical at full float
                                    precision: realized success, long share,
                                    mean chosen distance, brain agreement,
                                    class shares, look-pressure x2, chosen counts
X4  fork-and-force harness       ✓  3/3 bit-identical (E2a-2's gate, still holding)
X1  fingerprint, flags off       ✓  57b0bdab...c673 unchanged
X2  tsc + build + suite          ✓  clean, clean, 744/744 (10 new contract tests)
X3  world determinism            ✓  identical across two invocations, perf outside
X5  perf p95                     ✓  1.320x of flags-off (budget 1.50x)
--  flags-off inertness          ✓  armed-false == not-armed, tick for tick;
                                    empty perception memory; empty trace
--  trace inertness              ✓  the instrument moves nothing (same signature)
--  cheap ball path (X6)         ✓  still field-for-field identical
--  §2 band baseline arm         ✓  reproduces the frozen baseline to 4 dp on all
                                    five dimensions (goals 2.3944, crosses 2.4894,
                                    headers 9.1039, long balls 6.2042, cutbacks
                                    3.8151) => the harness is the same procedure
                                    C1-B's band was frozen from
```

**The live consumer IS the thing E2b validated.** That was the open question
this stage carried, and it is answered without an asterisk: the same
arithmetic, the same choices, moment for moment, and the aggregates come back
to the last digit. Everything below is about what the WORLD does with it.

### 6.2 §2 EQUILIBRIUM BAND — BROKEN on two dimensions

8-season paired calibrate, seed `20260702`, 568 matches per arm:

```text                        baseline     bundle     delta      band
goals/match                   2.3944     2.0458    -14.56%    ±15%   ✓ (edge)
crosses/match                 2.4894     2.0775    -16.55%    ±25%   ✓
headers won/match             9.1039    11.8750    +30.44%    ±25%   ✗ BREAK
long balls/match              6.2042     9.0088    +45.20%    ±25%   ✗ BREAK
cutbacks/match                3.8151     3.6162     -5.21%    ±25%   ✓
tackles/match                12.2077    11.4613     -6.1%     (no gate)
miscontrols/match             6.9771     9.7447    +39.7%     (no gate)
pass completion               71.29%     69.39%    -1.90pp    (no gate)
```

**This is C1-B's signature, larger.** C1-B (touch cost alone, speed-blind
evaluator) went goals −15.4% / long balls +28.2%. The bundle — whose entire
thesis was that a *seeing* evaluator makes the same cost survivable — goes
goals −14.6% / long balls **+45.2%** / headers **+30.4%**. Goals stayed
(just) inside the band this time; the re-route did not.

### 6.3 NO-STRICT-DOMINANCE — FAIL at 17.4%, on the ANTI-dominance side

30,656 live pass moments, each priced at 0.85 / 1.0 / 1.15 (§5 (a)'s
registered instrument):

```text
preferred power share      lightest 49.47%   middle 33.11%   heaviest 17.42%
gate                       heaviest must be >= 20% and <= 80%        ✗ FAIL
mean corridor threat (s)   0.2494 / 0.1119 / 0.0433   (pace buys the corridor)
mean touch-fail prior      0.0757 / 0.1008 / 0.1297   (pace costs the receiver)
mean joined price          0.6545 / 0.6870 / 0.6860
```

Two diagnostics, reported not gated, that shape how this should be read:

* **`lowestThreatIsHighestPower` = 97.86%** — E0's canary shape reproduces
  exactly: more pace still buys a safer corridor almost always. What breaks
  always-heavy is E1b's touch cost, which is the bundle working as designed.
* **`sameQuintileShare` = 49.43%** — in half of all moments the three powers
  land in the SAME threat quintile, so the corridor axis (a five-step
  function) cannot distinguish them and the smooth touch term decides by
  construction. That granularity is a property of my registered instrument,
  not of the world, and it biases this statistic toward the lighter power.

So the failure is not "the game learned always-heavy" — the distribution is
49/33/17, arguably the most situational outcome available — it is that the
frozen band's LOWER edge rejects it. Reported as it fired; the reading is the
commander's.

### 6.4 CO-EVOLUTION RESTORATION — FAIL, and style diversity halves

Paired sealed evo, seed `424242`, 10 generations, bundle ON vs flags OFF:

```text
goals/match advantage (ON - OFF) by generation
 -0.141  0.000  +0.676  +0.113  -0.113  +0.239  -0.493  -0.014  +0.465  +0.437
first three mean  +0.178      last three mean  +0.296      shrinks?  ✗ NO
style spread at generation 10
  distinct nameplates    16 vs 16          ratio 1.000   ✓
  mean style entropy     0.2768 vs 0.5574  ratio 0.497   ✗ FAIL (floor 0.60)
always-heavy share by generation
 0.183 0.175 0.190 0.188 0.203 0.212 0.223 0.216 0.234 0.212  (drifting UP)
```

The advantage series swings ±0.5 goals generation to generation on 71 matches
each, so the shrink test is underpowered as posed — but it did not shrink even
directionally, and the **style finding is not noise**: formation-identity
entropy is nearly halved under the bundle while every club still carries a
distinct nameplate. The ecology keeps its labels and loses its variety. That is
the vision-attr saga's shape, not its magnitude, and it is exactly what this
gate exists to catch.

### 6.5 X5 PERF — FAIL at 1.322x mean (p95 passes)

```text
flags off        5.1540 us/step   p95  8.083 us
full bundle      6.8151 us/step   p95 10.666 us
ratio            1.3223x (budget 1.25x)  ✗ FAIL     p95 1.3196x (1.50x)  ✓
(the first run measured 1.3220x / 1.3030x on the same world — the clock moved,
 the world hash did not, which is X3's corrected scheme doing its job)
```

Diagnosis, not a fix: E2b-1R got perception to **1.069x** by having the sim's
only percept consumer (the defender's ball read) build a ball and nothing
else. A CHOOSER reads bodies, so the choice flag switches that body's memory
chain back to the full scan — same cadence, same honesty, but the squad loop
returns. The truth buffer is already refilled in place rather than allocated,
so what is left is the scan itself. The consumption-scoping lever that remains
is WHO needs bodies: only a player who might be asked to pass, which is a much
smaller set than "every outfield body every brain tick". Per ruling #10.3's
codified principle the redraw computes less, never perceives less — and per
E2b-1's stop rule the budget does not move.

### 6.6 Behavioural contract suite under `EDS_BUNDLE=1`

```text
aerial.test.ts    "wide teams cross more"   28 -> holds     ✓  (C1-B INVERTED it)
freeAgents.test.ts / market                 5/5 pass        ✓  (C1-B broke it)
stamina.test.ts   "a full match SPENDS the tank"            ✗  0.9626 vs < 0.93
```

Two of the three contracts C1-B broke now HOLD under the bundle — the crossing
inversion and the market both survive, which is the bundling thesis paying off
where C1-B failed. Stamina breaks the same way it broke then (less ground
running to do). Reported as a finding, not re-baselined (C1-B §12.4).

### 6.7 Reported, never gated

```text
R1 route mix        chosen-option long share 19.06%, mean chosen distance 13.07 m
                    — the CHOICE distribution is E2b-1R's (18.05% / 13.41 m); the
                    long-ball explosion is downstream MECHANICS, not the chooser
                    picking long. S3b's collapse signature does not reproduce.
R2 always-heavy     0.183 -> 0.212 across 10 generations (§6.4)
R3 look-pressure    read axis 6.21%, band axis 3.62% of live pass moments
R4 divergence       62.23% of live choices differ from the lane-score brain
                    (dormant measurement said 38-47% agreement — consistent)
R5 no-executable    4.09% of traced moments had no executable option and kept the
                    legacy choice (§5 (d)'s registered leak, measured)
class shares live   READ 90.80% · SEEN-UNREAD 0.08% · UNSEEN 9.13%
```

**R1 is the sharpest diagnostic in this run.** The chooser's own output
distribution is indistinguishable from what E2b-1R banked dormant — it is not
choosing long balls. The +45% long balls and +30% headers appear anyway,
because more spilled first touches means more loose ball, and loose ball is
what the rest of the game turns into aerial route. C1-B's lesson, restated
with the evaluator no longer speed-blind: **the re-route was never the
evaluator's fault.**

### 6.8 Disclosures

* The §5 registrations (a)-(g) were committed before the run, in `b99c8a8`.
* Two canary diagnostics (`sameQuintileShare`,
  `lowestThreatIsHighestPowerShare`) were added AFTER a 1-season shakedown and
  BEFORE the frozen run, reported never gated, exactly to expose the
  instrument granularity that shapes §6.3. Harness-only, per ruling #7.2's
  boundary.
* The ablation in §4's authorised sense (bundle minus one component, to NAME
  the failing component) is recorded in §6.9. It is a diagnostic and never a
  partial ship.
* A vitest worker RPC timeout ("Timeout calling onTaskUpdate") appeared once
  while the X4 probe was saturating the machine; every test passed, and it did
  not reproduce on a quiet re-run. Final suite state: **744/744**, tsc clean,
  build clean, fingerprint `57b0bdab…c673` re-measured after the fix.

### 6.9 ABLATION — the failing component is the TOUCH COST, and the both-sides read is what SAVES the equilibrium

§4's authorised diagnostic, same 8-season staging, deltas against the same
frozen baseline (`t` = touch cost, `d` = perceived defence, `c` = perceived
choice):

```text
arm                       t d c   goals    crosses  headers  longBalls cutbacks  misctrl
FULL BUNDLE               1 1 1  -14.56%  -16.55%  +30.44%   +45.20%   -5.21%    9.74
minus touch cost          0 1 1   +2.20%   -8.91%   -0.43%    +8.06%   -4.75%    7.63  <= IN BAND, all five
minus perceived choice    1 1 0   -8.16%   -4.31%  +25.80%   +28.58%   +5.77%    9.19
minus perceived defence   1 0 1  -20.22%   -9.33%  +13.11%    +3.89%   -8.86%    9.83
touch cost only           1 0 0  -15.37%   +0.85%  +23.23%   +28.18%   +4.43%    9.38  <= C1-B, exactly
perceived choice only     0 0 1  -21.69%   -2.33%  +11.60%    +6.90%  -14.54%    7.40
```

Three things fall out, and they are the most useful output of this whole stage:

1. **The aerial re-route is the touch cost's, not the chooser's.** Take the
   touch cost out and headers/long balls come home (−0.43% / +8.06%); leave it
   in alone and they are the C1-B numbers to the decimal (+23.23% / +28.18%).
   The bundle's own thesis was that a speed-SEEING evaluator would make this
   cost survivable. It does not: the chooser sees the cost, prices it, and the
   long balls still arrive — because they were never a decision. More spilled
   first touches means more loose ball, and loose ball becomes aerial route
   downstream of every decision layer. **C1-B's diagnosis is confirmed and
   sharpened: the re-route is mechanical, and bundling does not fix it.**
2. **Perception on BOTH sides really does restore the balance it breaks.** The
   chooser alone costs 21.7% of the goals; add the defender reading his own
   ball and the same world lands at **+2.20%** — inside every band. That is
   co-evolution visible in one line, and it is the S3b/vision-attr lesson
   passing rather than failing.
3. **`minus touch cost` (0 1 1) is a §2-clean bundle.** It is not a partial
   ship and this stage does not propose one — the design contract forbids it
   in both directions, and E1b's curve is a measured substrate truth that a
   band failure does not un-measure. But it is the commander's most obvious
   redraw axis, and it now has numbers.

### 6.10 A DEFECT IN MY BUILD, caught by the ablation and disclosed

The first ablation run returned `perceived choice only` reproducing the
baseline **exactly** on all five dimensions — a dead flag, not a null result.
Cause: `Match.step` refreshed a body's percept only `if (this.edsPerceivedDefence)`,
so with the choice flag alone no memory chain existed, `perceivedSnapshot`
returned null, and the legacy lane-score chooser played every pass. The gate
condition is now `edsPerceivedDefence || edsPerceivedChoice`, and
`tests/perceivedPassChoice.test.ts` pins the isolated flag (it must trace
choices and must NOT reproduce the plain match).

What it did and did not affect: every gated arm in §6.2–§6.7 runs the FULL
bundle, where the defence flag is on, so the audited world is byte-identical
before and after the fix (verified above). Only the ablation arms with `d 0`
moved — which is why §6.9's table is from the corrected run, and why the first
ablation's `1 0 1` and `1 0 0` rows were identical to each other.

The lesson worth keeping: **an ablation arm that reproduces the baseline to the
digit is evidence about the harness, not about the world.** It is the cheapest
dead-flag detector this programme has found, and it belongs in any future
bundle audit.
