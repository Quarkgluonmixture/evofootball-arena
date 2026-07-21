# S7e-0C — Replicated Counterfactual Oracle Ceiling

Status: **PARKED. ComparablePassPayoffV1 preflight and pilot validity passed, but
the pre-registered pilot was statistically INCONCLUSIVE: R=32 did not meet either
stability gate. The 32,576-branch final was not run; no adaptive retry, estimator
or live consumer is authorised. Mainline has returned to S3–S8 off-ball substrate
work.**

Date: 2026-07-21

## 1. Verdict and scope

S7e-0C does not estimate transition probabilities. It asks a narrower question:

> On the frozen 509 chosen-vs-S7b-alternative pairs, does replacing one random
> continuation with a fixed set of paired continuations stably support the
> alternative's complete empirical outcome vector?

The five-outcome Oracle v2 ledger remains descriptive anatomy:

```text
intendedReception · teammateRecovery · opponentInterception · loose · deadBall
```

It can explain a direct rollout mean, but cannot improve or independently validate
that mean on the same samples. This slice does not train, calibrate or validate a
kick-time transition estimator, and cannot authorise live AI.

## 2. Two estimands

### Primary: finite-suite oracle ceiling

The primary estimand is only the fixed set of 509 pairs. For pair `i`, branch
`b ∈ {chosen, alternative}` and continuation `r`, the proposed outcome is
`Y[i,b,r]`. Each branch mean is taken over a fixed `R=32` child-stream set.

Comparable V1 retains five dimensions and the frozen numeric tolerances:

| dimension | tolerance |
|---|---:|
| physical control value | 0 |
| goal delta | 0 |
| xG delta | 0.01 |
| action progression metres | 0.5 |
| own executable exit options | 0 |

Section 10 records why the legacy vector was not total; §11 defines the accepted
replacement projection.

### Diagnostic: match-ecology generalisation

The 509 pairs are not independent population samples. One live decision can have
multiple alternatives, and one match seed has multiple decisions. The largest
defensible independent cluster is therefore the **match seed**, not the pair.

Finite-suite and match-generalisation verdicts must be reported separately. More
continuations reduce within-state Monte Carlo noise; they do not create more match
clusters or repair between-match power.

## 3. What 32 continuations do not identify

There is no per-state/action probability estimator in this experiment. With 16
samples, a true 5% branch is absent 44.0% of the time; even 32 samples leave a zero-
count branch with a marginal one-sided 95% upper bound near 8.9%.

For each state/action/outcome the ledger may store only:

```ts
{
  outcome,
  count,
  observedMass: count / R,
  samples: Y[],
  conditionalMean: Y | null,
  inferentialStatus: "descriptive" | "unsupported"
}
```

When `count===0`, samples are empty and the conditional mean is null. It is
forbidden to inject a global mean, delete the outcome or fill a zero vector.

There is no Laplace/Dirichlet/Jeffreys smoothing, no log loss and no claim of
probability calibration. Pooling and hierarchical shrinkage would be estimator
design and require a separate train/validation/test contract.

## 4. The outcome tree is an anatomy, not a better oracle

On one action's same `R` samples:

```text
sum_o empiricalMass(o) × conditionalMean(Y | o)
= direct mean of all R rollout outcomes
```

This is an algebraic identity. Empty branches make no contribution because no
sample belongs to them; their conditional means remain unsupported, not zero.

S7e-0C therefore computes action value directly from the branch mean. The
transition ledger can explain which outcomes contributed, but it cannot be used to
claim a separately identified transition model.

## 5. Frozen child streams

Pair identity is fixed by:

```text
pairId = hashSeed(
  matchSeed,
  kickTick,
  passerGid,
  chosenTargetGid,
  alternativeTargetGid
)
```

Every pair ID is ledgered and collision-checked. Any collision is a hard failure.

With namespace `0x537e0001`, continuation `r` uses:

```text
childSeed(r) = hashSeed(
  0x537e0001,
  frozenRngState,
  pairId,
  r
)
```

Chosen and alternative each clone the original frozen state independently, then
start from the same child RNG state. One branch is never cloned from the other's
result.

This common-random-number scheme only pairs draws while both branches consume RNG
in the same order. It does not pair football events after divergence and is not a
causal-shock ledger. Deterministic reruns and zero pair/child-seed collisions are
hard gates.

## 6. Independent feasibility pilot

The pilot is permanently outside the final suite:

```text
match seeds: 10000–10031
candidate generator: unchanged
selection: first 64 valid pairs in deterministic discovery order
continuations: 64 per action, committed before output is seen
H0: replicates 0–31
H1: replicates 32–63
```

If those 32 matches do not yield 64 valid pairs, feasibility fails; the range is
not expanded.

### Validity gate

All must be zero:

```text
force failures
residual other/unresolved
double classifications
unsupported fields filled with zero
pair/child RNG collisions
clone or deterministic-rerun differences
```

Determinism is pre-registered as one complete rerun of replicate 0 for both
branches of every pilot pair. The rerun record must be byte-identical. This tests
all 64 frozen states without doubling the whole 8,192-branch pilot.

### Relation-stability gate

For each half, compute the two 32-continuation branch means and apply the existing
frozen outcome relation. At least **52/64** pairs must receive the same relation.

There is no per-pair confidence-Pareto test and no minimum count of confidence
dominators.

### Projected Monte Carlo gate

For pair `i`, let `e_i = X_i(H0)-X_i(H1)`, where dominance encodes alternative as
`+1`, chosen as `-1`, and equivalent/tradeoff as `0`.

```text
estimated MC variance at R=32 = Var(e) / 2
projected finite-suite SE = sqrt(variance / 509)
one-sided 95% half-width = 1.645 × SE
```

The half-width must be at most **0.0125**, one quarter of the frozen +5pp target.

Pilot validity failure is `FAIL`. Validity passing with either statistical gate
failing is `INCONCLUSIVE — R=32 insufficient`; it does not authorise R=48/64 or a
changed threshold.

## 7. Final run and primary statistic

Only a fully passing pilot authorises:

```text
509 pairs × 2 actions × 32 child streams = 32,576 branch continuations
```

For each pair, branch means are compared with the unchanged tolerance relation:

```text
X = +1 alternative dominates
X = -1 chosen dominates
X =  0 equivalent or tradeoff

D = mean(X over 509 pairs)
```

The practical threshold remains `D = +0.05`. Lack of confidence around +5pp is
allowed to be inconclusive; it is not automatically a causal failure.

## 8. Frozen uncertainty methods

Both bootstraps use **20,000** deterministic resamples and percentile intervals.

### Finite-suite continuation bootstrap

- never resample the 509 pairs;
- within each pair, resample 32 continuation indices with replacement;
- chosen and alternative use the same sampled indices;
- resample whole five-dimensional vectors;
- recompute branch means, frozen relation and `D`.

Its 95% interval quantifies within-pair continuation Monte Carlo uncertainty only.

### Match-cluster bootstrap

- resample the 120 match seeds as clusters;
- carry every decision and alternative multiplicity belonging to the sampled seed;
- within each included pair, jointly resample continuation indices;
- never bootstrap 509 pairs as independent observations.

This interval is a diagnostic for match-ecology generalisation. Five individual
mean-delta diagnostics use 99% percentile intervals (Bonferroni family-wise 95%).
No Gaussian tests, winsorisation, pseudo-counts or rare-event bonuses are allowed.

## 9. Four separate verdicts

### `oracleValidity`

- `PASS`: event partition, support, clone, RNG and conservation all hold.
- `FAIL`: any semantic/mechanism invariant fails.

### `pilotFeasibility`

- `PASS`: validity plus 52/64 agreement and ≤1.25pp projected half-width.
- `FAIL`: event/RNG/clone mechanism invalid.
- `INCONCLUSIVE`: mechanism valid but R=32 is statistically insufficient.

### `finiteSuitePayoff`

- `PASS`: finite-suite 95% lower bound ≥ +5pp.
- `FAIL`: finite-suite 95% upper bound < +5pp.
- `INCONCLUSIVE`: interval crosses +5pp.

### `matchGeneralization`

The same bound rule is applied to the match-cluster diagnostic. Only:

```text
oracleValidity = PASS
pilotFeasibility = PASS
finiteSuitePayoff = PASS
matchGeneralization != FAIL
```

may authorise a later **transition-estimator design contract**. It still cannot
authorise estimator code, live AI, a preference gene, scalar utility, candidate
changes or tolerance tuning.

## 10. Historical preflight blocker — the old five-vector was not total

Oracle v2-0 deliberately made physical control and support honest:

```text
owner == null
→ physicalControl = none
→ possession = null
→ exitOptionCount = null
```

This was a hard correction to the old endpoint, where macro `possessionSide` and a
zero option count silently stood in for missing physical control. In the frozen
v2-0 census, **625 of 1018 kick+3s branch records** have no physical owner while a
macro side remains assigned. This is the majority of the sample, not a rare edge.
The same schema also marks progression null while the ball is in a dead phase or
the deliberate out-of-play coast, so possession/options are not the only possible
holes in the proposed `R⁵` vector.

The existing `compareOutcomes()` instead requires a complete numeric `R⁵` vector.
The current contracts simultaneously forbid all available conversions:

- using macro possession would repeal the v2 physical-control correction;
- encoding no owner as possession `0` would violate null-not-zero;
- encoding undefined exit options as `0` would do the same;
- dropping those samples would create severe outcome-dependent selection;
- taking per-dimension supported means would use different denominators and break
  both the direct-mean estimand and the outcome-tree identity;
- removing or redefining dimensions would change the frozen relation/tolerance.

Therefore the pilot relation and its split-half stability were
**undefined**. Running 8,192 pilot branches cannot resolve a type/estimand
contradiction.

The external Prompt-8 audit selected the explicit replacement described in §11.
Before that replacement passed preflight, the state was:

```text
oracleValidity: PASS for v2-0 event semantics
pilotFeasibility: NOT RUN — estimand undefined
finiteSuitePayoff: NOT RUN
matchGeneralization: NOT RUN
```

This is a contract blocker, not evidence that transition composition lacks value.

## 11. ComparablePassPayoffV1 resolution and preflight result

Raw observations remain nullable. A separate pure, versioned projection asks
different total questions:

```text
physicalControlValue:
  own = +1 · none = 0 · opponent = -1

ownExecutableExitOptions:
  actual own-controller option count, otherwise exactly 0

actionProgressionMetres:
  current live progression, else the last playable progression
```

The zeroes are world answers, not raw imputation: no stable controller is the
middle physical-control state, and without an attacking controller there are zero
immediately executable attacking exits. Raw `possession` and raw controller option
count stay null. The projection does not read macro `possessionSide`.

`lastPlayableProgressionMetres` starts at 0 on the kick snapshot and updates only
after a complete live, non-coasting step. A dead/restart reset therefore cannot
move it. If fulltime arrives before kick+3s, the final state is absorbed to the
fixed authority time; no action-dependent short horizon is introduced.

The frozen 120-match preflight reproduced 509 pairs / 1018 records and passed:

```text
candidate partition / event conservation: PASS
force failures: 0
missing or non-finite comparable vectors: 0
macro-possession projection reads: 0
raw null overwrites: 0
dead/reset position reads: 0
administrative terminal unsupported: 0
projection-version mismatches: 0
per-dimension denominator mismatch: 0
```

All 1018 records now have a total vector; 12 early-fulltime records use the
absorbing terminal. Owner-free plus macro-assigned endpoints are 317 chosen and
309 alternative, while their raw owner-dependent fields remain null. Focused
tests cover macro mutation, raw preservation, the three control states, dead-reset
invariance, restart resumption, terminal absorption, one denominator, outcome-tree
identity and exhaustive legacy-comparator algorithm parity.

Comparable V1 retains five dimensions and the numeric tolerances, but it is a new
estimand. Legacy S7b relation counts remain historical and cannot be spliced into
the replicated Comparable V1 series. This preflight authorised only the independent
pilot in §6.

## 12. Frozen pilot result — valid mechanism, insufficient R=32 stability

The pilot ran exactly as pre-registered. The deterministic discovery path found
64 valid pairs by match seed 10016. Each branch used all 64 committed child
streams; H0 and H1 were the fixed 0–31 and 32–63 halves. Replicate 0 for both
branches of every pair was independently rerun byte-identically.

All mechanism and semantic gates passed:

```text
pairs discovered: 64 / 64
branch continuations: 8,192
force failures / residual outcomes / double classifications: 0
missing or non-finite comparable vectors: 0
pair or child-seed collisions: 0
deterministic-rerun differences: 0
projection/null/denominator/terminal violations: 0
oracleValidity: PASS
```

The two statistical feasibility gates both failed:

```text
relation agreement: 39 / 64       required: >= 52 / 64
projected MC half-width: 3.222pp   required: <= 1.25pp

H0 relation: alternative 11 · chosen 10 · equivalent 0 · tradeoff 43
H1 relation: alternative 16 · chosen 10 · equivalent 0 · tradeoff 38
dominance edge: +1.56pp / +9.38pp
```

The descriptive transition ledger over 4,096 continuations per action was:

| branch | intended | teammate | opponent | loose | dead | censor |
|---|---:|---:|---:|---:|---:|---:|
| chosen | 2545 | 355 | 1047 | 13 | 136 | 0 |
| alternative | 2118 | 647 | 1195 | 15 | 121 | 0 |

This is not a semantic failure and does not falsify transition composition. It
means the pre-registered R=32 branch means do not classify the five-dimensional
Pareto relation reliably enough for the frozen +5pp experiment. Per the stop rule:

```text
pilotFeasibility: INCONCLUSIVE — R=32 insufficient
finiteSuitePayoff: NOT RUN
matchGeneralization: NOT RUN
```

The final suite was not run. R was not raised to 48/64, and no tolerance,
candidate, relation or threshold was changed. Any future revisit needs a new
authority and a different inferential design; this contract cannot be retried by
spending more continuations after seeing the result.

Repository gates remain clean: TypeScript, production build and all 530 tests
pass, and the default two-season fingerprint remains exactly
`57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673`.
The profiler determinism check also passes; 5.37µs/step versus the frozen
5.32µs/step baseline is within run noise and shows no material regression.

## 13. Parking decision

This experiment reached its pre-registered stop. It is parked rather than
falsified: the event semantics and Comparable V1 remain valid probe assets, but
changing the estimand immediately after seeing the pilot would be an adaptive
retry of the same causal claim.

Re-entry requires a genuinely new, pre-registered inferential contract that both:

1. composes transition probability with conditional next-state value rather than
   adding another independent Pareto dimension; and
2. addresses the between-match generalisation ceiling—the current suite contains
   only 120 defensible match clusters.

Increasing `R`, changing tolerances, running the withheld final or swapping the
relation after observing this pilot does not qualify. Until those conditions are
met, S7e is not the project mainline and must not block independent S3–S8
representation work.
