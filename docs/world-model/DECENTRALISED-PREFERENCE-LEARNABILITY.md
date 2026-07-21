# D2a — Decentralised Preference Learnability Lab

Status: **PRE-REGISTERED — offline train/validation/test composition experiment;
no production gene, full-match consumer or live selector.**

Date: 2026-07-21

## 1. Why D2a is causally new

D1 closed five existing layers into one executable loop:

```text
observer-specific perception
→ generic off-ball candidates
→ visible teammate commitments
→ normal locomotion/contact
→ physical pass transition
```

The loop was mechanically non-vacuous. Commitment-aware choices changed in
89.1% of states, improved reception coverage by 4.1 percentage points relative
to commitment-blind choices and reduced opponent first control by 6.2 points.
But the synthetic outcome-independent preferences produced only 31.0% portfolio
coverage against the legacy branch's 84.3%.

D2a does not add another feature or tune D1 after its result. It changes the
missing causal layer:

```text
D1: world-independent hashed weights → choices → outcomes

D2a: outcomes on independent training states
     → select a generic preference vector
     → frozen vector chooses on sealed states
     → real movement and transition decide success
```

The falsifiable question is:

> Holding the complete D1 world/execution loop fixed, do its nine generic facts
> contain enough transferable signal for deterministic selection to learn a
> materially safer receiving portfolio on unseen match clusters?

This is a learnability ceiling, not a claim that reception coverage is the final
fitness of football. Passing authorises only a later full-match ecology contract
where league results select among preferences. Failure parks this static
rank-weight family; it does not trigger another isolated fact audit or weight tune.

## 2. Frozen and mutable layers

### Frozen from D1

* `awareness = 0.8` observer-specific S3 memory;
* O0 role-neutral, perceived-onside candidate generation;
* the same five individual and four O3 coordination facts;
* tied within-candidate-set percentile ranks;
* three movers in deterministic decision-timer/gid order;
* sequential immutable O3 commitments;
* 90 normal `MoveToPoint`/contact ticks while the carrier holds;
* ordinary pass execution and Oracle-v2 first transition;
* four validation/test child continuations per receiving option;
* legacy movement as the accepted gameplay baseline.

No candidate point, fact, movement rule, pass law, contact rule, horizon, mover
count, awareness value or transition definition may change.

### The only learned object

One probe-local nine-gene coach preference vector:

```text
opponent arrival margin
teammate distance at arrival
carrier-lane clearance
forward displacement
negative self-arrival time
committed-target distance
committed-bearing separation
committed-arrival-time separation
committed-corridor separation
```

All genes live in `[0,1]`. Effective player weights are:

```text
personalMultiplier(seed, gid, dimension) =
  0.5 + (hashSeed(D2_PERSONAL_NAMESPACE, seed, gid, dimension) % 1001) / 1000

effectiveRaw = coachGene * personalMultiplier
effectiveWeight = effectiveRaw / sum(effectiveRaw)
```

If all coach genes are zero, the vector is invalid; it is not replaced or
repaired. The fixed personal multiplier preserves decentralised player-to-player
variation without learning a role table. It is probe noise, not a production
player gene.

The vector is shared across the training population only because D2a asks whether
the representation is learnable at all. It does not claim that one universal
football preference should ship. Player/coach diversity and frequency-dependent
ecology belong to the next contract.

## 3. Independent state partitions

Each seed contributes at most one state. Eligibility is exactly D1's state rule.
No state, match seed or frozen simulation object crosses a partition.

```text
development: first 64 eligible states from seeds 47,000–47,127
validation:  first 96 eligible states from seeds 48,000–48,191
final test:  first 96 eligible states from seeds 49,000–49,191
```

Validation remains unopened until every development validity, support and learning
gate passes. Final test remains unopened until every validation gate passes. A
partition that cannot produce its required state count inside the fixed seed range
fails support; the range is not expanded.

Every accepted state stores the untouched structural Match clone, carrier, three
movers and their complete eligible O0 candidate sets. State acceptance must not
read a preference genome or any branch outcome.

## 4. Deterministic development selection

### Population and generations

```text
population                       12
evaluated generations             6 (generation 0 through 5)
elites copied unchanged            2
parent pool                        4 highest-ranked genomes
training child continuations       2 per mover
```

Generation 0 contains the all-ones neutral coach vector plus eleven deterministic
vectors drawn in `[0.05,1.0]` from `D2_EVOLUTION_NAMESPACE`. Later children use
the existing evolution shapes without importing production genomes:

* each gene comes from parent A, parent B or their mean with `0.4/0.4/0.2`;
* mutation rate is `0.5`;
* Gaussian scale is `0.15` of the unit gene range;
* values clamp to `[0,1]`;
* exact ranking ties use the canonical genome serialization.

These numbers are fixed before results and never enter the simulation. They are
an offline search budget, not football coefficients.

### Outcome ranking

Every genome runs the full coordinated D1 branch on all 64 development states.
There is no learned surrogate and no candidate-level label. A genome is ranked
lexicographically by:

```text
1. more portfolio intended-reception successes
   (denominator = all 64 × 2 continuations; incomplete movement is a miss)
2. more completed movement states
3. fewer opponent-first-control outcomes
4. fewer dead-ball outcomes
5. canonical genome serialization
```

There is no weighted fitness sum, named run reward, progression bonus, role bonus
or central-task reward. The ranking is deliberately narrow: it tests whether the
representation can recover a real pass option without hiding attrition or adverse
transitions.

### Development gates before opening validation

```text
accepted development states                         = 64
selection/movement/Oracle/RNG/non-finite failures    = 0
all six generations and twelve genomes evaluated    exactly once
winner deterministic across two complete reruns     exact
winner normalised-weight L1 distance from neutral    >= 0.15
winner selection differs from neutral                >= 40% of states
winner non-hold selections                           >= 40% of mover choices
winner movement completion                           >= 70% of states
winner coverage - neutral coverage                   >= +15pp
winner opponent-first-control - neutral              <= 0pp
winner dead-ball - neutral                           <= +5pp
```

The neutral comparison uses the all-ones coach vector with the same fixed personal
multipliers, so it is the exact no-learning member of this family.

Any failure stops before validation. It cannot be rescued by another population,
generation count, mutation scale, seed range, rank order or objective.

## 5. Sealed validation branches

After development passes, freeze the winning coach vector byte-for-byte and run
five branches on all 96 validation states:

```text
L — legacy movers
N — neutral all-ones coach, commitment-aware
I — learned coach, commitments hidden
C — learned coach, commitment-aware
A — ablation: learned coach with personal multipliers fixed to 1
```

`A` is diagnostic only. It asks whether fixed player heterogeneity materially
contributed; it cannot rescue or fail the main result.

Every branch uses four paired child continuations per mover. For each state and
continuation, portfolio coverage is one iff at least one of the three intended
receivers becomes the first stable controller. Incomplete movement remains a miss
in the fixed portfolio denominator.

### Validation validity and mechanism gates

```text
accepted validation states                          = 96
all branch movement attempts                        = 96
all completed-branch Oracle opportunities           = completed × 3 × 4
clone/identity/Oracle/RNG/non-finite failures        = 0
target/intervention changes                         = 0
first mover identical between I and C                exact
coordination facts informative for movers 2/3        >= 95% of states
C target satisfaction                               >= 95%
C movement completion - L completion                within ±5pp
C selection differs from N                          >= 40% of states
C non-hold selections                               >= 40% of mover choices
no candidate ID owns                                > 70% of C selections
```

### Primary and guardrail gates

Primary learnability:

```text
C portfolio coverage - N portfolio coverage         >= +15pp point estimate
paired state-cluster bootstrap 95% lower bound       >= +5pp
```

Composition mediator:

```text
C portfolio coverage - I portfolio coverage         >= +3pp
```

Legacy and adverse-transition guardrails:

```text
C portfolio coverage - L portfolio coverage         >= -10pp
bootstrap 95% lower bound for C-L                    >= -15pp
C opponent-first-control - L                         <= +5pp
C dead-ball - L                                      <= +5pp
```

Generalisation:

```text
(C-N coverage edge on development)
  - (C-N coverage edge on validation)                <= 10pp
```

The bootstrap resamples the 96 state/seed clusters 10,000 times with a fixed
probe seed. Each sampled state carries all L/N/I/C branches and all four child
continuations. It never resamples individual pass options as independent units.

Validation returns `PASS`, `FAIL` or `INCONCLUSIVE`:

* validity/mechanism/point/guardrail failure → `FAIL`;
* point gates pass but either confidence lower bound misses → `INCONCLUSIVE`;
* all gates pass → `PASS` and final test opens.

No extra validation states or continuations may turn `INCONCLUSIVE` into `PASS`.

## 6. Final test

The final test reuses the frozen winning vector, exact five branches, four child
continuations and all validation definitions on seeds 49,000–49,191. It performs
no further selection and no threshold change.

```text
C-N coverage edge                         >= +10pp
C-I coverage edge                         >= +3pp
C-L coverage edge                         >= -10pp
C opponent-first-control - L              <= +5pp
C dead-ball - L                           <= +5pp
all validity/mechanism gates              PASS
```

Two complete programme runs must emit the same training winner, every partition
count, every transition ledger, canonical JSON and SHA-256.

## 7. What PASS and FAIL mean

### PASS authorises only

* a design contract for a default-off full-match decentralised offer consumer;
* production-quality coach/player preference representation design;
* fresh league ecology where results-dominant fitness—not reception coverage—
  selects preferences;
* later watchability clips and user play-test before any default change.

### PASS does not authorise

* importing the learned vector as a universal default;
* adding nine production genes immediately;
* replacing `supportSpot`, formations or named scripts;
* central task publication;
* scoring runs by tactical pattern name;
* live counterfactual rollout;
* a production save-version change.

### FAIL/INCONCLUSIVE stop rule

D2a stops and the legacy live path remains authority. It may not be retried by:

* tuning genes, mutation, ranking, thresholds or partitions;
* adding another isolated candidate fact to rescue the same selector;
* deleting hold, incomplete, loose, dead or intercepted samples;
* selecting the best validation/test genome;
* changing the portfolio denominator;
* collapsing outcomes into a new scalar;
* using current role, formation, named run or TeamBrain assignment as a feature.

A future re-entry would need a substantively different selection representation—
for example state-conditional preference, bounded temporal memory or actual
full-match frequency-dependent ecology—not another static nine-weight search.

## 8. Exact isolation

D2a is implemented under `scripts/probes/` only. Production AI, Match, evolution,
save data and UI have zero importers or writes. The default fingerprint must stay:

```text
57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673
```

No play-test is requested because no live behaviour changes.
