# S7e-0C — Replicated Counterfactual Oracle Ceiling

Status: **statistical contract pre-registered; execution blocked by one unresolved
outcome-support conflict identified in §10. No pilot or final run is authorised
until that conflict is resolved explicitly.**

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

The frozen five dimensions and tolerances are intended to remain:

| dimension | tolerance |
|---|---:|
| possession | 0 |
| goal delta | 0 |
| xG delta | 0.01 |
| progression metres | 0.5 |
| exit-option count | 0 |

Section 10 records why the current Oracle v2 support mask prevents this vector
from yet being a valid `R⁵` value on every continuation.

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

## 10. Preflight blocker — the five-vector is not currently total

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

The existing `compareOutcomes()` instead requires a complete numeric `R⁵` vector.
The current contracts simultaneously forbid all available conversions:

- using macro possession would repeal the v2 physical-control correction;
- encoding no owner as possession `0` would violate null-not-zero;
- encoding undefined exit options as `0` would do the same;
- dropping those samples would create severe outcome-dependent selection;
- taking per-dimension supported means would use different denominators and break
  both the direct-mean estimand and the outcome-tree identity;
- removing or redefining dimensions would change the frozen relation/tolerance.

Therefore the pilot relation and its split-half stability are presently
**undefined**. Running 8,192 pilot branches cannot resolve a type/estimand
contradiction.

Before code or rollout, a separate authority decision must define a universally
supported numeric outcome semantics, or explicitly replace the frozen relation.
Until then:

```text
oracleValidity: PASS for v2-0 event semantics
pilotFeasibility: NOT RUN — estimand undefined
finiteSuitePayoff: NOT RUN
matchGeneralization: NOT RUN
```

This is a contract blocker, not evidence that transition composition lacks value.
