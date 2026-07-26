# Adversarial statistical and gate-design audit

## Overall verdict

The programme is unusually strong on determinism, instrumentation disclosure, and exact reproduction. Those gates show that the code being measured is the code intended.

They do not, however, establish that the statistical conclusions generalise beyond the inspected seeds, or that several central gates estimate the questions their names imply. On the present evidence, the value/perception bundle should remain default-OFF. The programme’s current Phase-1 stop is correct, but the defects below require more than completing C3R.

## Findings, ranked by severity

### 1. Critical — “Not-looking must not win” is based on selected complete cases, not the registered 3,000 moments

**Claim.** Realised success is 63.28/64.60/63.46/67.90%, so poorer awareness never beats better awareness and oracle vision adds 4.61pp.

**Concern.** [EDS-E2B1-BOTH-SIDES-AB — “G1 — NOT-LOOKING MUST NOT WIN”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:128) and its frozen result. The implementation’s banked chosen counts are only [2,247 / 2,404 / 2,504 / 2,573](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e2b1r-consumption-scoped.ts:111) out of 3,000 moments.

**Why it is a problem.**

- The success rates condition on finding an executable option. Missingness changes sharply with awareness: 25.1%, 19.9%, 16.5%, and 14.2%.
- The arms therefore do not compare the same decision moments. The blind arm discards far more of the cases in which blindness binds.
- If “no executable option” were scored as failure, the same numerators give approximately 47.4%, 51.8%, 53.0%, and 58.2%; the claimed endpoint lift becomes about 10.8pp, not 4.61pp. If the intended live behaviour is legacy truth fallback, that fallback must instead be simulated and included.
- Passer and defender awareness change together. Reception success is a net effect of better attacking information and better defensive information, not the causal value of the passer looking.

**Fix.** Use an intention-to-treat estimand over all registered moments with a frozen rule for no-executable cases. Run a 2×2 passer-awareness × defender-awareness factorial, paired by moment and seed. Report paired confidence intervals using match/seed-clustered resampling.

---

### 2. Critical — the E2b-0 “held-out calibration” does not apply the trained bins to held-out data

**Claim.** The threat curve generalises because corresponding A/B quintiles differ by at most 2.18pp.

**Concern.** [EDS-E2B0-THREAT-CALIBRATION — “C3 — HELD-OUT CALIBRATION”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B0-THREAT-CALIBRATION.md:118).

**Why it is a problem.** This is the easy-to-miss implementation defect. The probe independently calculates [A quintiles and B quintiles](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e2b0-threat-calibration.ts:449). It then compares A’s lowest 20% with B’s lowest 20%, and so forth. But the deployed lookup uses A’s numerical cut-points.

That tests whether rank strata have similar outcomes, not whether the committed A curve correctly calibrates B observations. Distributional drift in threat values can be hidden because B silently moves its boundaries.

**Fix.** Freeze A’s cut-points and rates, assign every B observation using those exact cut-points, and evaluate reliability, calibration intercept/slope, Brier/log loss, and out-of-range occupancy. Repeat under match-seed cluster bootstrap.

---

### 3. Critical — the “no-strict-dominance” gate measures a hypothetical preference; live power never varies

**Claim.** Power use is situational, passing at 21.86% highest-power preference.

**Concern.** [EDS-E3 — “NO-STRICT-DOMINANCE”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:102) and [EDS-E3R — the passed 21.86% result](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:261).

**Why it is a problem.** E3’s own operational registration states that there is no production power chooser and that the played share is 100% at power 1.0. The gate was changed into an offline evaluator preference over three hypothetical powers.

That can verify dormant scoring arithmetic, but it cannot answer whether live power use is situational, whether execution remains non-dominated, or whether players experience pass-power choice at all. A typical report reader can easily interpret “21.86%” as played behaviour when it is not.

**Fix.** Either:

- remove pass-power behaviour and dominance from the live-v1 claims; or
- wire the power decision into production, then rerun calibration, equilibrium, ecology, and actual played-power gates.

---

### 4. Critical — most “interval tests” are point-estimate thresholds, not equivalence or non-inferiority tests

**Claim.** Gates described as powered interval tests establish equivalence, calibration, or refutation.

**Concern.** The discipline in [PROBE-CONTRACTS — “Six threshold TYPES”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/PROBE-CONTRACTS.md:36), compared with E2b G1 and [E5c M2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:208).

**Why it is a problem.**

- G1 passes when the observed step is merely above −2pp. For 0.5→0.8, the estimate is −1.14pp. Under an optimistic independent-binomial approximation, SE ≈1.24pp and the one-sided 95% lower bound is about −3.18pp. Non-inferiority to −2pp is therefore not demonstrated. Roughly 7,100 independent observations per arm would be needed for 80% power at a true zero difference; pairing might reduce that, but discordant-pair counts were not analysed.
- E5c declares HM “refuted” because +3.38pp is below a +4pp confirmation threshold. With the reported SE ≈1.32pp, the one-sided 95% upper bound is about +5.55pp. The result is inconclusive; it does not refute an effect of at least 4pp.
- Raw `|A−B| ≤ tolerance` rules have a 50% pass probability when the true difference lies exactly on the boundary. Sample-size calculations designed to make false failures rare are not equivalence tests.

**Fix.** Use TOST or confidence-interval decision rules:

- equivalent/non-inferior only if the entire CI lies inside the acceptance region;
- superior only if the lower bound clears the threshold;
- refuted only if the upper bound lies below it;
- otherwise explicitly `INCONCLUSIVE`.

---

### 5. Critical — E5’s “no weight needed” validation is substantially in-sample and hides severe local miscalibration

**Claim.** P̂×V̂ predicts its conjunction to 0.03pp, proving the composition is a measurement and needs no weight.

**Concern.** [EDS-E5 — “V4 — COMPOSITION CALIBRATION”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5-VALUE-AXIS.md:192) and “E5a — PASS on every gate.”

**Why it is a problem.**

- V4 is explicitly gated on set A, the same set used to estimate V and the threat curve. The code gates only [`compositionA`](/Users/jamie/Documents/Promptfoo/evofootball-arena/scripts/probes/eds-e5a-value-census.ts:667); B is a reported companion.
- Aggregate agreement is largely cancellation. Internally, Q2 predicts 3.98% and realises 1.42%—about 64% overprediction—while Q4 predicts 6.16% and realises 9.45%—about 53% underprediction.
- The realised curve is non-monotone, yet the model is used for argmax ranking.
- A ±5pp calibration tolerance on predictions of roughly 2–6% allows errors comparable to or larger than the entire predicted probability.
- The held-out result reported only aggregate agreement, not held-out binwise calibration or ranking.

**Fix.** Fit on A, freeze every table and cut-point, and gate all binwise calibration/discrimination on B or a third sealed block. Prefer nested cross-fitting by match seed. Require monotone ranking or positive held-out calibration slope and compare Brier/log loss against P-only and V-only baselines.

---

### 6. High — fork counts are repeatedly treated as independent observations

**Claim.** Sample sizes such as 14,114 forks, 2,019 options per quintile, or 608 receptions provide the stated σ-level power.

**Concern.** E2a-2 P2, E2b-0 C2/C3, E5a V2–V4, E5c M2, and E5d C2/C3.

**Why it is a problem.** The hierarchy is approximately:

```text
seed/match → decision moment → several candidate forks
```

Sibling forks share the same world state and initial RNG state. Moments share teams, tactics, and match history. Yet the power calculations use candidate-level binomial formulas.

E2a-2’s 14,678 forks came from only 4,500 moments and 63 matches—about 233 forks per match. Even a match-level ICC of 0.01 gives a design effect near `1 + 232×0.01 = 3.32`, cutting nominal effective sample size by about 70%. A nominal 3.4σ result could become roughly 1.9σ. Candidate-level weighting also gives more influence to moments containing more eligible teammates.

**Fix.** Declare the outer sampling unit. Use match/league-seed cluster bootstraps or hierarchical models, with pairing inside moment. Report ICCs, effective sample sizes, and both moment-weighted and option-weighted estimands.

---

### 7. High — stage-level preregistration does not remove programme-level adaptive selection

**Claim.** Later full audits provide confirmation after earlier diagnostic failures.

**Concern.** [EDS-E3 §6.9 ablation](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md:443) and [EDS-E3R §5.2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R-REVISED-BUNDLE-AUDIT.md:238).

**Why it is a problem.**

- The “minus touch cost” arm was selected after inspecting the E3 ablation because it passed all five bands.
- E3R then reused the same league seed and returned the exact same five values. In a deterministic engine, this verifies wiring; it is not a fresh replication of the selected arm.
- E5c used its results to name a “third cause”; E5d Phase 0 then reused E5c’s own forks.
- Phase 1’s C3 failure produced C3R with new floors and additional data.

Each individual rewrite may be transparently registered, but the chain lacks a programme-level exploratory/confirmatory split or alpha-spending rule. Repeated redesign-and-retest can eventually select a passing path.

**Fix.** Maintain permanently sealed confirmatory league-seed blocks. Use development seeds for diagnosis and redesign, then exactly one confirmatory run on untouched seeds. Record the full hypothesis family and sequential decision/error policy.

---

### 8. High — the E2 “route mix” gate was incapable of detecting the failure later seen by players

**Claim.** Route mix survives because long-option share and mean distance at awareness 0.8 resemble the oracle arm.

**Concern.** [EDS-E2B1 — “G2 — ROUTE MIX”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md:140).

**Why it is a problem.**

- It compares against the new evaluator’s oracle arm, not the flags-off live brain.
- It gates only distance and long-share, not headers, cutbacks, third-man releases, overlaps, give-and-gos, or progression structure.
- It passed, while E4 later measured third-man −35.7%, overlap −68.0%, and forward share −5.1pp ([EDS-E5 §1](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5-VALUE-AXIS.md:10)).

Thus G2 answered “does perception preserve this evaluator’s distance distribution?” rather than “does live route diversity survive?”

**Fix.** Compare live flags-on against paired flags-off on specific route and combination counters. Predefine which are hard non-inferiority gates; merely reporting them cannot prevent a statistically known watchability regression from reaching users.

---

### 9. High — the ecological conclusion overstates five-seed evidence, and CE1 was waived after contradictory fresh results

**Claim.** A typical world becomes more stylistically diverse, and co-evolution restoration is banked.

**Concern.** [EDS-E3R2 — “CE2R — style diversity”](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:98), its [frozen result](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E3R2-NARROW-REAUDIT.md:190), and [PROGRAMME ruling #14](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/PROGRAMME.md:488).

**Why it is a problem.**

- Four of five fresh seeds above ratio 1.0 does not establish that the population median exceeds 1. A simple sign test gives one-sided p=0.1875.
- M3 requires only cross-club spread `>0`; finite samples will almost always produce nonzero spread even if clubs share the same underlying policy. It is not a valid test of club dependence.
- CE1’s “advantage shrinks” passed on one seed, then only 2/5 fresh seeds. The programme reinterpreted the gate’s purpose post hoc as “there is no runaway to restore from” and still opened E4. That may be a sensible new hypothesis, but it is not the registered CE1 claim.

**Fix.** Reclassify CE1 as inconclusive. Use more paired ecology seeds, hierarchical seed/club models, variance-component tests for club dependence, and a predeclared estimand such as median paired entropy difference rather than unstable ratios with near-zero denominators.

---

### 10. High — E5c’s “third cause” and the justification for E5d are not statistically resolved

**Claim.** HM and HU are refuted, while reality values the pattern pass by +1.09pp, proving the composed axis inverts the true ordering.

**Concern.** [EDS-E5C §7.2](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:350) and [§7.3 Attribution](/Users/jamie/Documents/Promptfoo/evofootball-arena/docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md:384).

**Why it is a problem.**

- As above, +3.38pp with SE≈1.32pp is inconclusive relative to the +4pp HM boundary, not a refutation.
- Using the reported clean counts/rates to approximate attempt totals, the 4.89% versus 3.80% payoff difference has an optimistic independent-observation 95% interval of roughly −0.19pp to +2.37pp. Match/moment clustering will widen it.
- Every other candidate becomes a control, so moments with more candidates receive more control weight. Pattern and control are not one paired alternative per moment.

The attempt-axis idea is plausible, but the evidence that it restores a real ordering should be treated as exploratory.

**Fix.** Choose one control option per moment by a frozen policy or analyse moment-level contrasts. Use fresh pattern moments, paired cluster inference, and an explicit inconclusive region.

---

### 11. Moderate — calibration is validated under the wrong data-generating policy

**Claim.** Seed holdout establishes tables suitable for the live perceived/evolved world.

**Concern.** E2b-0 §2–§6 and E5’s registered circularity.

**Why it is a problem.** The threat table is measured at awareness 0.8 under the flag-off/legacy action process, then used at awareness 0.2, 0.5, oracle, with perceived defence, a different live chooser, and sealed evolution. Adjacent seed blocks test new random draws from the same policy; they do not test policy or ecology shift.

This matters because improving defender perception changes `P(clean | threat)` even if the threat read itself is unchanged.

**Fix.** Add reliability gates in the actual deployed flags-on policy and across held-out evolved leagues. If one shared invariant curve is claimed, test interaction terms for awareness, defensive policy, club, and generation.

---

### 12. Moderate — reported truth fallbacks leave the “perception-honest choice” claim ungated

**Claim.** Live choices are based on what the player sees.

**Concern.** E3’s implementation registrations and reported `no-executable` rate.

**Why it is a problem.** Candidate existence is truth-enumerated, execution remains truth-aimed, and no-executable moments retain the legacy truth-based choice—about 4% of live traced moments. These cases are reported but have no acceptance threshold. They are also closely related to the complete-case selection defect in Finding 1.

**Fix.** Either narrow the shipping claim explicitly or gate the truth fallback rate. A fully honest version needs perceived candidate enumeration, a defined hold/no-pass response when nobody is executable, and perception-honest aiming.

## Three most decision-relevant ship findings

1. **Finding 1:** the central E2 evidence that “not-looking does not win” is a selected complete-case comparison with attacker and defender awareness confounded. The perception mechanism’s main causal claim is not established.

2. **Findings 2 and 5:** the core probability/value tables have not passed a genuine frozen-bin, fully held-out calibration test. E5’s aggregate 0.03pp agreement masks large ranking errors, precisely where argmax decisions are sensitive.

3. **Findings 3, 7, and 9:** whole-engine readiness is overstated: live power choice does not exist, the revised equilibrium reused the seed that selected it, and the ecological/co-evolution evidence is not robust across fresh seeds.

**Ship recommendation: do not ship the bundle to live players yet.** Keep the flags default-OFF, finish Phase 1 only after repairing the estimands and inference above, then require one untouched multi-seed confirmatory audit plus a blinded or counterbalanced E4 play-test.