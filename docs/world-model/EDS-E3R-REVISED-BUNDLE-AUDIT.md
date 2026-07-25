# EDS E3R — the revised-bundle audit (touch cost out of v1)

Status: **RUN 2026-07-25 — ⛔ FAIL on two gates of twenty-eight; the fork
returns to the commander (§5).** Drafted and run by the autonomous session
under commander ruling #12.4, constraints (a)–(f), gates untouched. The
equilibrium HOLDS without the touch cost — §2 band in on all five dimensions,
dominance in band, co-evolution restoration passing, the chain reproducing
bit-identically. What fails: style-diversity entropy by 2.03pp (H2 stands by
the letter, its mechanism refuted by all three discriminators, and the gate's
statistic inverts on a second seed) and perf mean at 1.3238×. Nothing shipped.

Date: 2026-07-25

## 1. What changed, and what did not

E3 measured the v1 thesis and refuted it: the §2 band break is MECHANICAL
(spill → loose ball → aerial route), the chooser never chose it (R1: long
share 19.06% live vs 18.05% dormant), and the §4 ablation showed the same
bundle **minus the touch cost** sitting inside every band. Ruling #12 took
touch cost out of the v1 live set and re-seated it to a future C5-coupled
slice; E1b's curve stays banked dormant.

**The v1 live bundle is now `edsPerceivedChoice` + `edsPerceivedDefence` +
the evaluator.** `edsTouchCost` is not armed in any gated arm of this audit.

Nothing else moves. Every gate family below is E3's, verbatim, and the
ablation numbers are NOT a pass — ruling #12.3 says so explicitly, and this
contract exists because a diagnostic arm is not an audit.

### 1.1 Premise correction on constraint (a), disclosed before the run

Constraint (a) says the banked E2b-1R choices "were priced with the flag-ON
touch factor", so E3R must re-bank them flag-off-honest. **They were not.**
Verified in the probes themselves: `heavyTouchCost` and `edsTouchCost` appear
in none of `eds-e2a2-option-space-census.ts`, `eds-e2b0-threat-calibration.ts`,
`eds-e2b1-both-sides-ab.ts` or `eds-e2b1r-consumption-scoped.ts`. The chain is
flag-off throughout:

* the option-space census forked worlds with `edsPerceivedDefence` only;
* E2b-0's calibration read outcomes from those same flag-off forks;
* E2b-1/1R priced a READ option from the census composite — never from the
  `mirroredTouchFailChance` formula — so the E1b curve could not enter the
  price even in principle;
* `src/ai/perceivedPassChoice.ts` (the live consumer) likewise prices the
  composite, so its price is flag-INDEPENDENT. Only the E3 canary consumed
  the flagged curve, and only to report power preference.

So ruling #12's "the evaluator prices the world AS IT IS — never phantom
costs" was already satisfied on the pricing side; what was inconsistent in E3
was the WORLD (touch ON) against a calibration measured with touch OFF, and
removing touch cost from v1 repairs exactly that.

**(a) is therefore executed as a PROOF obligation, not a re-measurement**: the
reference staging is re-run with the pricing path declared flag-off, and it
must reproduce E2b-1R's banked aggregates bit-identically, with G1 and G2
re-verified on that re-banked reference before X4R chains to it. If the
re-bank ever moved a digit, the premise correction would be wrong and this
stage would stop — so the claim is tested, not asserted.

## 2. The build E3R needs (constraint (d))

The only new code is a perf lever, and it may not change one perceived value:

1. **Candidate-scoped materialisation at pass-commit** (the ruling's named
   lever): the snapshot built at a pass decision carries the bodies the
   pricing actually reads — the passer, his candidates, and the opponents the
   corridor read scans — instead of every remembered body.
2. **Allocation-free memory advance**: the scan writes into the stored
   observation in place rather than allocating a fresh record per observed
   body per scan. Same scan cadence, same visibility rule, same keyed error,
   same retention: cheaper because it allocates less, never because it
   perceives less.

Both are pinned by the bit-identity gates below (C1/X4R would break instantly
if either changed a percept), and by `tests/observeBall.test.ts`'s existing
honesty pin. Honesty is frozen: scan cadence, FOV, retention and keyed error
may not move. **Budget stays 1.25× / p95 1.50×; a miss is reported, never
shaved** (ruling #12.4 (d)).

## 3. Frozen gates

### C1 — CHAIN FIRST: the re-banked choice reference (constraint (a))

```text
C1a the reference chooser, pricing declared flag-off, reproduces E2b-1R's
    banked aggregates BIT-IDENTICALLY at full float precision — all seven
    families (realized success, long share, mean chosen distance, brain
    agreement, class shares, look-pressure x2, chosen counts)
C1b G1 re-holds on the re-banked reference: the realized-success chain across
    awareness arms is non-inferior, every step >= -2.0pp
C1c G2 re-holds: the 0.8 arm's long-option share within +-25% relative and
    mean chosen distance within +-15% relative of the oracle arm
C1d the fork-and-force harness still replays reality on all three seeds
```

### X4R — the live consumer chains to THAT reference

```text
X4Ra per-moment identity: the live consumer's choice equals the re-banked
     reference's choice on EVERY moment of EVERY arm (3,000 x 4)
X4Rb with the live consumer choosing, the same seven families come back
     bit-identical to the banked numbers
```

### EXACT (E3's, verbatim)

```text
X1 fingerprint 57b0bdab...c673 unchanged with every flag off
X2 tsc + build clean, full suite green
X3 world hash identical across two invocations (perf reported, never hashed)
X5 perf: the v1 bundle within 1.25x mean / 1.50x p95 of flags-off, interleaved
-- flags-off inertness, trace inertness, cheap-ball-path identity
```

### §2 EQUILIBRIUM BAND (C1 §4 verbatim, unchanged tolerances)

8-season paired calibrate, seed `20260702`, against the frozen baseline
`goals 2.3944 · crosses 2.4894 · headers 9.1039 · long balls 6.2042 ·
cutbacks 3.8151`; goals ±15%, the other four ±25%. The paired baseline arm
must reproduce those five numbers to 4 dp, as it did in E3.

### NO-STRICT-DOMINANCE (constraint (e), purpose documented)

```text
the share of pass moments whose preferred power is the HIGHEST must be
  <= 80%   guards the always-heavy pathology E0 measured in a cost-free world
  >= 20%   guards degenerate never-heavy, which would be a MISPRICING symptom
```

Instrument unchanged from E3 §5 (a) — the evaluator's preferred power at every
live pass moment, joined by
`quintilePrice(threat) x (1 - touchFail(power)) / (1 - touchFail(1.0))`, with
every part reported. **Registered expectation (constraint (e)): the
distribution shifts HEAVIER than E3's 49/33/17, because the touch term now
uses the shipped curve (span 8, weight 0.07) instead of E1b's (16 / 0.24).**
E3's granularity diagnostics (`sameQuintileShare`,
`lowestThreatIsHighestPowerShare`) are reported again.

### CO-EVOLUTION RESTORATION + STYLE (constraint (c))

Paired sealed 10-generation evo, seed `424242`, bundle vs flags off:

```text
CE1 the goals/match advantage (bundle - flags off) must SHRINK in absolute
    size from the first three generations to the last three
CE2 style: distinct coach nameplates AND mean style-share entropy at the final
    generation, each >= 60% of the flags-off run's own value
```

**The two style hypotheses, pre-registered (ruling #12.4 (c)):**

* **H1 — touch-flattening.** E3's entropy collapse (0.497) was downstream of
  the touch cost: a mechanically noisier ground game rewards fewer distinct
  identities. *Prediction:* without the curve, entropy recovers to ≥60% ⇒ CE2
  passes, H1 confirmed, the question is CLOSED and benign.
* **H2 — genome-blind chooser.** The evaluator prices pure measured
  probability, so it may have removed the seat through which tactical genes
  expressed style: whatever a club's genome says about how it wants to pass,
  every club now picks the same measured-best option. *Prediction:* entropy
  stays <60% even without the curve ⇒ **CE2 fails, H2 stands, and the fork
  returns to the commander** for a designed PREFERENCE SEAT (genes modulating
  evaluator weights as priced choices — the two-engines junction), never a
  tuning knob. Per the user's standing instruction, H2 holding returns here
  even if nothing else fails.

Two diagnostics discriminate the mechanism, REPORTED never gated, measured
identically in both arms so they are comparable:

```text
D1 cross-club spread (population std dev) of per-club long balls/match and
   crosses/match over the 8-season band arms — does the bundle flatten how
   differently clubs play?
D2 Pearson correlation of a club's long-ball rate with its coach genome's
   passBias and attackingWidth, both arms — does the genome still express?
D3 bundle arm only: cross-club spread of the CHOSEN option distance and long
   share from the choice trace — the chooser's own club-to-club variety
```

A second evo seed (`515151`) runs both arms as a REPORTED robustness check on
CE2's direction; it is not a gate, and CE1/CE2 are judged on `424242`.

### BEHAVIOURAL CONTRACT SUITE (constraint (f))

```text
aerial.test.ts     "wide teams cross more" must not invert
stamina.test.ts    "a full match SPENDS the tank" — RE-TESTED on the revised
                   bundle: it broke under E3's bundle (0.9626 vs < 0.93) and
                   the touch cost is the obvious suspect, since less ground
                   running follows fewer completed ground passes
freeAgents.test.ts / market
```

Run with `EDS_BUNDLE=1` (which now arms choice + defence only). A break is a
finding to report, never a re-baseline (C1-B §12.4).

## 4. Stop rules

* **C1 or X4R fails** → the chain is broken: fix the consumer or report the
  premise correction as wrong. Never touch the reference.
* **§2 band breaks** → the revised bundle is not survivable either; report
  which dimension, no tuning, back to the commander.
* **CE2 fails** → H2 stands: the fork returns to the commander for the
  preference-seat design. Do not invent a gene→weight mapping here.
* **Dominance or CE1 fails** → report as fired, no instrument change after
  results.
* **X5 misses** → report; no honesty shaving and no budget move.
* **Nothing ships from E3R.** Flags stay default-off. Ship is E4 — the user's
  play-test — and only on a full PASS.

## 5. RESULT — ⛔ FAIL on two gates (2026-07-25). The equilibrium HOLDS; style and perf do not

`scripts/probes/eds-e3r-revised-bundle-audit.ts`, world SHA
**`655a98b9…9d59`**, world-deterministic across two invocations with perf
reported beside the hash. Fingerprint `57b0bdab…c673` unchanged with every
flag off; suite 744/744; nothing shipped.

**26 of 28 gates pass.** The two that do not: **style diversity** (entropy
ratio 0.5797 against a 0.60 floor — H2 stands by the letter of the gate) and
**perf mean** (1.3238× against 1.25×). Per §4 and the user's standing
instruction, both the non-PASS and H2 standing return the fork to the
commander.

### 5.1 C1 — the premise correction is PROVEN, and the chain holds

```text
C1a re-bank vs E2b-1R's banked aggregates   7/7 families BIT-IDENTICAL
C1b G1 non-inferiority chain                ✓ every step >= -2.0pp
C1c G2 long share / mean distance           ✓ / ✓ vs the oracle arm
C1d fork-and-force harness                  ✓ 3/3 bit-identical
X4R live consumer vs the re-banked reference  0 disagreements / 10,292
```

Constraint (a) asked for a re-bank because the reference was believed to carry
flag-ON touch pricing. §1.1 said it did not; **the re-bank moved not one digit,
which is the proof.** The pricing path is flag-independent by construction, and
now says so explicitly in the code the gate runs (`heavyTouchCost: false`).

### 5.2 §2 EQUILIBRIUM BAND — ALL FIVE DIMENSIONS IN BAND

8-season paired calibrate, seed `20260702`, 568 matches per arm; the baseline
arm again reproduces the frozen numbers to 4 dp:

```text                        baseline     bundle     delta      band
goals/match                   2.3944     2.4472     +2.20%    ±15%   ✓
crosses/match                 2.4894     2.2676     -8.91%    ±25%   ✓
headers won/match             9.1039     9.0651     -0.43%    ±25%   ✓
long balls/match              6.2042     6.7042     +8.06%    ±25%   ✓
cutbacks/match                3.8151     3.6338     -4.75%    ±25%   ✓
miscontrols/match             6.9771     7.6250     +9.3%     (no gate)
pass completion               71.29%     70.24%     -1.05pp   (no gate)
tackles/match                12.2077    12.6778     +3.9%     (no gate)
```

**This is ruling #12's diagnosis, confirmed by a full audit rather than a
diagnostic arm.** E3's break was +30.44% headers / +45.20% long balls; take the
mechanical tax out and the same information layer leaves the game's route mix
essentially where it found it. Goals move +2.20% — the perceived chooser and
the perceived defender very nearly cancel, which is what the ablation predicted
(−21.69% alone → +2.20% together).

### 5.3 NO-STRICT-DOMINANCE — PASS at 21.86%, and the registered expectation held

```text
preferred power share    lightest 45.85%   middle 32.29%   heaviest 21.86%  ✓ (20-80)
E3, under E1b's curve    lightest 49.47%   middle 33.11%   heaviest 17.42%  ✗
mean corridor threat     0.2634 / 0.1253 / 0.0548 s
mean touch-fail prior    0.0645 / 0.0798 / 0.0940
sameQuintileShare        48.01%      lowestThreatIsHighestPower  97.81%
always-heavy by generation  0.211 0.222 0.220 0.195 0.220 0.208 0.209 0.222 0.206 0.217
```

Constraint (e) registered that the distribution would shift heavier under the
shipped touch curve, and it did, by 4.4pp — into the band. The share is also
stable across ten generations (0.195–0.222), so this is not a knife-edge pass.

### 5.4 CO-EVOLUTION RESTORATION — PASS: the advantage decays by 90%

```text
goals/match advantage (bundle - flags off) by generation
 -0.014  +0.070  +0.803  +0.352  -0.042  -0.479  -0.676  -0.141  +0.014  +0.211
first three mean  +0.2864      last three mean  +0.0282      shrinks?  ✓ YES
```

The defence adapts: whatever edge the perceived chooser opens early is nearly
gone by generation 10. This is the gate the vision-attr saga failed four times.

### 5.5 STYLE DIVERSITY — ⛔ FAIL by 2.03pp, and the discriminators refute H2's mechanism

```text
                          bundle    flags off   ratio    floor
distinct nameplates          16         16      1.000    0.60   ✓
mean style-share entropy   0.3231     0.5574    0.5797   0.60    ✗  (E3: 0.4966)
```

So **CE2 fails and H2 stands by the letter** — and the pre-registered
diagnostics say its proposed MECHANISM is not what is happening. H2 says the
evaluator is genome-blind and removed the seat through which tactical genes
expressed style. All three discriminators point the other way:

```text                                   bundle    flags off    H2 predicts
D1 cross-club long-ball spread (band)    1.9772     1.6837      NARROWER
D1 cross-club long-ball spread (evo)     1.5045     1.3434      NARROWER
D1 cross-club cross spread (band)        0.4863     0.5204      NARROWER
D2 corr(long balls, passBias) (band)    -0.2223    -0.1222      TOWARD 0
D2 corr(long balls, passBias) (evo)     -0.6235    -0.5767      TOWARD 0
D2 corr(crosses, width) (band)           0.2186    -0.0032      TOWARD 0
D3 cross-club spread of CHOSEN distance  0.5968 m     n/a       ~0
D3 cross-club spread of CHOSEN long share  3.32pp     n/a       ~0
```

Clubs play MORE differently from each other under the bundle, the genome
expresses MORE strongly in route rates, and the chooser itself varies club to
club by 0.6 m of mean chosen distance. A genome-blind chooser produces none of
that.

⚠️ **And the gate's own statistic does not survive a second seed.** The
pre-registered robustness run (seed `515151`, both arms, reported never gated):

```text
mean style-share entropy at generation 10   bundle 0.2388   flags off 0.1559
ratio                                        1.5321  — the bundle is MORE diverse
distinct nameplates                          16 vs 16
```

One seed says 0.58, the other says 1.53. A single final-generation entropy on
16 clubs is dominated by which handful of coaches happened to survive; as a
gate it has almost no power, which is PROBE-CONTRACTS' sixth threshold type
applied to an ecology statistic. **The verdict stands as it fired — no
predicate is rewritten after results** — but the commander should read "H2
stands" as "this gate could not answer the question", not as evidence for a
genome-blind chooser, which D1/D2/D3 refute directly.

### 5.6 X5 PERF — ⛔ FAIL at 1.3238× mean (p95 1.3113× passes)

```text
flags off        5.2045 us/step   p95  8.167 us
v1 bundle        6.8898 us/step   p95 10.709 us
ratio            1.3238x (budget 1.25x)  ✗      p95 1.3113x (1.50x)  ✓
```

Constraint (d)'s named lever was implemented, and so was a second one:

```text
E3, eager full chain + full materialisation          1.4211x  (isolated bench)
+ candidate-scoped materialisation at pass-commit    1.3225x
+ allocation-free memory advance (in-place records)   ~1.32x   (within noise)
  ball-only percept, for reference (E2b-1R's world)   ~1.05x
```

**Where the cost actually is, measured:** not allocation, and not the
materialise step — those are now nearly free. It is the honest per-observation
math itself: five keyed-noise channels plus a body-turn `cos`/`sin` per
observed body per scan, ~13 observations per step once every outfield body
keeps a body-level chain. Two things were tried and rejected on the spot:
`Math.sqrt(x*x+y*y)` for `Math.hypot` (**bit-different in 38% of 3M samples**
— that is a perceived-value change, not an optimisation), and squared-distance
early-outs in the visibility test (identical decisions except at a tie, where
a rare divergence would be indistinguishable from a bug).

**The one honest lever left, costed but NOT built** (it needs a commander
ruling because it makes a semantics choice): *deferred reconstruction*. A
body's percept at time T depends only on scans inside its retention window
(≤60 ticks), and the scan clock is already maintained by the O(1) ball path —
so keep the ball path for everyone, record a per-tick ring buffer of body
truth, and REPLAY a body's in-window scans only when a consumer actually reads
them. That is ~40× fewer observations per step, with identical values by
construction. The wrinkle the commander must rule on: a per-tick truth frame
sees all observers in a tick reading the same world state, whereas today's
mid-decide-loop refresh lets a restart taker's heading change land between two
observers. The probe staging that validated the chooser observes at the START
of a tick, so the ring buffer is arguably CLOSER to the validated semantics —
but it is a change in what "the moment I looked" means, and that is not an
executor's call. Per (d): reported, nothing shaved, budget untouched.

### 5.7 Behavioural suite (constraint (f)) — the stamina break is NOT the touch cost

The E3R contract named the touch cost as "the obvious suspect". That was a
belief, and it is now measured and WRONG:

```text
same stamina staging (seeds 11/42, neutral squads), full-time mean stamina
flags off                      0.9160899895418604   PASS (gate < 0.93)
perceived choice only          0.9308032191132962   BREAK
perceived defence only         0.9128440227961777   PASS
v1 bundle (choice + defence)   0.9696581256351910   BREAK
E3 bundle (+ touch cost)       0.9625876531614549   BREAK
```

`aerial.test.ts` "wide teams cross more" holds; `freeAgents.test.ts` 5/5 holds.
**Stamina breaks on the perception bundle itself, and slightly worse than under
E3's bundle.** The mechanism is coherent and is a genuine finding rather than a
brittle constant: honest perception makes the game CALMER — a defender who
reads his own ball commits later, and a passer who prices options picks the
better-supported ball more often, so there is simply less sprinting after loose
balls. The contract's substance is that a full match must SPEND the tank; at
0.9697 the tank is barely touched and the fatigue economy is decorative again.
Reported, not re-baselined (C1-B §12.4). Note the headroom: flags-off sits at
0.9161 against a 0.93 gate, so this staging had 1.4pp of slack and the bundle
spends it.

### 5.8 Reported, never gated

```text
R1 route mix        chosen long share 19.25%, mean chosen distance 13.07 m
                    (E2b-1R dormant: 18.05% / 13.41 m) — the chooser's own
                    distribution is stable across every world it has run in
R3 look-pressure    read axis 6.59%, band axis 3.78% of live pass moments
R4 divergence       61.14% of live choices differ from the lane-score brain
                    (evo arms 59.56%) — a genuinely different chooser
R5 no-executable    4.04% of traced moments kept the legacy choice (§5 (d) of
                    the E3 contract: the registered blind-direction leak)
class shares live   READ 91.07% · SEEN-UNREAD 0.06% · UNSEEN 8.88%
canary stability    highest-power share 0.195-0.222 across ten generations
```

### 5.9 Disclosures

* §1.1's premise correction was committed BEFORE the run (`c1e65ce`) and is now
  proven by C1a's seven bit-identical families.
* The perf levers changed `src/ai/perceptionSnapshot.ts` (in-place observation
  records, one shared visibility distance, optional materialisation scope).
  Value-preservation is not asserted: C1a's re-bank, X4R's 10,292 identical
  choices, `tests/observeBall.test.ts` and the flags-off inertness gate all run
  through that code.
* `materialisePerceptionSnapshot` now COPIES vectors out of memory. That is
  required by the in-place scan — a snapshot holding references would have
  mutated under its reader — and it changes no value.
* The stamina attribution in §3 ("the touch cost is the obvious suspect") was
  a pre-run belief; §5.7 replaces it with a measurement. The belief was never
  a gate.
* One vitest worker RPC timeout appeared while the audit saturated the machine;
  all 744 tests passed and it did not reproduce quietly.
