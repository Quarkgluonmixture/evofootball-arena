# S7e — Transition Distribution × Conditional Next State

Status: **design and oracle audit only; Oracle v2-0 first-transition semantics are
defined and passed in [`COUNTERFACTUAL-ORACLE-V2.md`](COUNTERFACTUAL-ORACLE-V2.md),
with no estimator implementation and no live consumer.**

Date: 2026-07-21

## 1. Why S7b can fail and still contain a useful fact

The accepted 120-match S7b oracle found no aggregate payoff over 509 paired
branches. Its retained first-controller anatomy now separates the transition into
the state being evaluated from the conditional value after that state exists.

When both forced passes first reached their intended target (212 pairs), the S7b
alternative was directionally better:

| conditional outcome | chosen | alternative |
|---|---:|---:|
| branch dominates the other | 28.8% | 38.2% |
| own possession at 3s | 65.6% | 67.5% |

Mean alternative-minus-chosen progression was +1.181m and xG +0.006. Conversely,
the asymmetric first-controller strata overwhelmingly favoured whichever branch
actually reached its target. The aggregate result therefore mixes two different
questions:

1. **Which transition occurs?**
2. **What is the next state worth conditional on that transition?**

## 2. Verified current transition chain

For an ordinary ground pass, the current engine composes:

```text
pre-kick body/pressure/team state
→ target lead + orientation-dependent launch power
→ passing/pressure/distance/body-dependent aim noise
→ fixed-step independent ball flight
→ intermediate opponent deflection/control opportunity
→ M2 access + M3 first-contact claim
→ delayed control attempt
→ first-touch clean/spill
→ intended teammate / other teammate / opponent / dead-ball / unresolved result
→ subsequent live decisions
```

The accepted `passAffordance` vector models intended flight and endpoint arrival,
but not this complete transition distribution. S7c showed that static threat at
the endpoint was not a substitute. S7d showed that a temporal flight-margin fact
strongly predicts interception exposure, but adding it as one more independent
Pareto dimension still does not compose transition probability with conditional
future value.

## 3. Required S7e representation

The next representation must keep the mutually exclusive outcomes explicit:

```text
intendedTargetControl
otherTeammateControl
opponentControl
deadBall
loose
```

For each outcome it must distinguish:

- a calibrated transition likelihood or bounded uncertainty;
- the conditional next-state vector if that outcome occurs.

It must not turn every dimension into a universal hand-written score. Safe recycle,
risky progression and tactical style remain tradeoffs for evolution/selection. A
candidate design must explain how it composes contingencies without pretending
that transition safety and conditional reward are independent Pareto axes.

## 4. Inputs that require an explicit authority decision

Before implementation, audit which facts the cheap estimator may read:

- passer orientation, pressure, passing and current one-touch state;
- intended launch speed, aim-error envelope and ball decay;
- moving opponent access along the flight;
- receiver arrival, body readiness, dribbling/positioning and first-touch pressure;
- offside/dead-ball risk;
- observation age and genuinely unknown defenders.

No input may consult hidden Match truth in the future live path. Exact truth remains
legal only for calibration and the offline oracle.

## 5. Oracle audit before S7e

The three-second endpoint may itself alias different stages: the branch can be
controlled, in a new pass, in an open knock or physically free while macro
`possessionSide` still records the spell. Common RNG state is also only initially
common; different branch events can consume different subsequent random calls.

Before choosing S7e's composition rule:

1. rerun the unchanged 120-match oracle at 4.5s and 6.0s as diagnostics;
2. retain the original 3.0s result as the acceptance baseline—horizon inspection
   must not be used to select whichever result looks favourable;
3. report aggregate and `bothTarget` strata at every horizon;
4. treat a sign/ordering reversal as evidence that one fixed endpoint is not a
   stable value authority;
5. separately assess event-anchored conditional rollouts and total time-from-kick
   payoff before changing the oracle contract.

The CLI-only diagnostic is:

```text
npx tsx scripts/probes/pass-target-counterfactual.ts 120 0 4.5
npx tsx scripts/probes/pass-target-counterfactual.ts 120 0 6
```

### Horizon results

The unchanged S7b candidate set and identical 509 branch pairs were run at all
three horizons:

| horizon | alt/chosen dominates | own possession chosen→alt | mean progression | mean xG |
|---:|---:|---:|---:|---:|
| 3.0s | 34.4 / 35.6% | 53.4 → 49.1% | −0.357m | −0.001 |
| 4.5s | 32.8 / 36.3% | 45.6 → 49.1% | −1.341m | −0.000 |
| 6.0s | 30.3 / 28.1% | 46.2 → 48.5% | −0.593m | −0.002 |

No horizon passes the existing full-payoff contract: the dominance edge never
reaches +5 points, and progression/xG remain non-positive. Macro possession,
however, reverses direction after 3s, confirming that one endpoint aliases later
possession cycles and is not a stable transition metric by itself.

The conditional `bothTarget` stratum remains directionally positive at every
horizon:

| horizon | n | alt/chosen dominates | own possession chosen→alt | mean progression | mean xG |
|---:|---:|---:|---:|---:|---:|
| 3.0s | 212 | 38.2 / 28.8% | 65.6 → 67.5% | +1.181m | +0.006 |
| 4.5s | 212 | 35.8 / 30.2% | 53.3 → 59.4% | +0.937m | +0.009 |
| 6.0s | 212 | 31.1 / 23.1% | 47.6 → 50.9% | +1.053m | +0.007 |

This strengthens—not replaces—the S7e hypothesis: the conditional next-state
relation has a robust signal, while the total action needs an explicit transition
composition and an event-aware oracle contract.

## 6. Stop rule

Do not implement S7e or wire a live pass consumer until the external/code audit
chooses both:

- the transition-distribution representation;
- the payoff oracle semantics that will judge it.

Oracle v2-0 has now passed that narrow semantics gate over the unchanged 509 pairs:
1018 records partitioned with zero residual, force failure or conservation error.
Chosen/alternative intended receptions were 345/265 and opponent first stable
controls 125/194, while 625 kick+3s records combined had no physical owner despite
an assigned macro possession side. See
[`COUNTERFACTUAL-ORACLE-V2.md`](COUNTERFACTUAL-ORACLE-V2.md).

This does not yet implement S7e. No additional static endpoint/corridor dimension,
tolerance sweep or live target filter is authorised; the replicated continuation
and contingent-tree payoff contract remains the next gate.
