# EDS E3 — The co-evolution audit

Status: **PRE-REGISTERED — no run yet.** Drafted by the autonomous session
under commander ruling #10.5; gates sourced from the design contract §3 (E3)
and §4.

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
