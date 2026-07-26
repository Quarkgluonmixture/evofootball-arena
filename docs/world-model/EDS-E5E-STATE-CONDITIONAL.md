# EDS E5e Phase 0 — H2's own power, and the two premiums

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.** Drafted by the autonomous session under **commander ruling
#21.3**, Phase 0 (a) and (b). Nothing here may be tuned after first sight of
results.

Date: 2026-07-26

## 1. What ruling #21 asks, and why Phase 0 comes first

Ruling #21.2 named the round's central fact: on every axis tried the two
combination counters move in **opposite** directions, and a per-option argmax
over a destination-indexed, **state-blind** table can keep at most one alive.
The proposed repair is measured state-conditional value — the honest
replacement for the legacy `×1.3`/`×1.15`, which fired on *which run was live*,
not on a cell.

Phase 1 (adding pattern-state features to the census index) is expensive and
irreversible in the ledger. Phase 0 is the cheap gate in front of it, and it
has exactly two jobs:

- **(a)** decide whether `0.468×` is a *magnitude* or a *count of eleven
  events*, because H2's counter is the rarest instrument in the battery; and
- **(b)** certify that the premium the repair would monetise **exists**, for
  **both** patterns, against the axis that is actually deployed.

If either premium is ≈ 0, Phase 1 would be building a feature onto a
non-effect, and ruling #21.3 sends the fork back here instead.

### 1.1 What the sizing scout found (census infrastructure, not a result)

Before any gate was written, a throwaway scout (200 matches, seed block
800,000, no forking, deleted after reading) measured how often each licence is
even *available* at a plain-ground-pass moment:

| licence-active pass moments | per match |
| --- | --- |
| third-man | 23.09 |
| wall-return | 1.68 |
| **overlap** | **0.065** |
| (`team.overlapper` live at all) | 1.99 |

**The overlap licence is available at 0.065 pass moments per match** — three
orders of magnitude rarer than third-man, and rarer still than the `overlapper`
being live, because the release predicate also demands the run has *come
around* (`|y| > 9`, level or beyond). This one number sets every budget below,
and it is the reason ruling #21.3 (a) is the right first question: a counter
this rare cannot support a ratio at any tolerance until it is sized to.

Sizing a budget from a scout is census infrastructure, explicitly permitted by
ruling #2.1; **no gate value below is derived from the scout**, only match
counts.

## 2. Part (a) — H2's own power

### 2.1 Staging

Two league arms per seed, the E5b audit's staging verbatim:

- **OFF** — no flags.
- **VALUE** — `edsPerceivedDefence` + `edsPerceivedChoice` + `edsValueAxis`,
  `traceChoice` off (the trace is not needed and costs three extra option
  valuations per pass).

**24 seasons** each (`H_SEASONS`, verbatim), over **six league seeds**:

```text
20260702   the E5b audit's own seed — cluster 1 is a REPRODUCTION
20260801 20260802 20260803 20260804 20260805   fresh
```

### 2.2 The cluster unit (ruling #20)

**The cluster unit is the LEAGUE SEED.** Matches inside one seed share an
evolving population and are not independent draws; the banked `0.468×` is a
one-cluster reading. Effective n is reported as **6 clusters × 1,704 matches ×
2 arms**, and both a within-cluster (Poisson) and a between-cluster (bootstrap)
interval are computed, because they answer different questions and the ruling
requires the unit to be named rather than assumed away.

### 2.3 Gates — part (a)

| gate | claim | predicate |
| --- | --- | --- |
| **A0** | staging pin | cluster 1 (seed 20260702) reproduces E5b's banked per-match counters to full float: overlaps OFF `0.09272300469483569`, VALUE `0.04342723004694836`; third-man OFF `6.85093896713615`, VALUE `4.399647887323944`; 1,704 matches per arm. Any drift ⇒ **INVALID** |
| **A1** | ex-ante Poisson budget | total OFF-arm overlap events across the six clusters **≥ 300** |
| **A2** | H2 verdict | 95% CI on the pooled overlap ratio (conditional-binomial on the arm split). **NON-INFERIOR** iff the entire CI ≥ 0.70; **REFUTED** iff the upper bound < 0.70; otherwise **INCONCLUSIVE** |
| **A3** | cluster robustness | 2,000-resample cluster bootstrap over the six seeds (frozen RNG seed `50000`). The pooled verdict stands only if the bootstrap CI yields the **same** verdict; disagreement ⇒ **INCONCLUSIVE**, whatever A2 says |
| **A4** | H1 companion | A2 and A3 applied verbatim to the third-man counter at its own floor **0.85** |

**A1's derivation, ex ante.** For a ratio of two Poisson counts the log-ratio
has `SE² = 1/k_off + 1/k_on`. At the ratio under test (≈ 0.47),
`SE² ≈ 3.13/k_off`; a 95% half-width of 0.20 on the log scale needs
`k_off ≥ 3.13/(0.20/1.96)² ≈ 300`. The banked rate predicts ≈ 948 across six
clusters, so A1 is a floor the design should clear comfortably — it exists to
catch a world in which the counter collapses further, not to be the binding
constraint.

**Part (a) is a MEASUREMENT step, not a pass/fail one.** It returns verdicts
under ruling #20 semantics; it is `INVALID` only if A0 or A1 fails. Its output
is what the report says about `0.468×`, and nothing downstream is gated on it.

## 3. Part (b) — the two premiums, against the deployed axis

### 3.1 The quantity

For every fork, the deployed price and the realized outcome, in the deployed
axis's own units:

```text
predicted = attemptValueAt(cell, band)        the COMMITTED table, ladder and all
realized  = the passing team takes a shot within 240 ticks OF THE KICK
gap(arm)  = mean(realized) − mean(predicted)  over the arm's attempted forks
PREMIUM   = gap(pattern) − gap(control)       a difference in differences
```

The control arm is the whole point, and it is E5c's design: a table that
under-predicts *everywhere* is miscalibrated (a third finding); a table that
under-predicts **only where the pattern's runner arrives** is blind to the
state. Taking the difference is what makes the premium a claim about state
rather than about the table's level.

Every fork counts — clean, spilled, intercepted, never-adjudicated alike. No
adjudication conditioning anywhere, matching the axis being priced.

### 3.2 Two harvests, because there are two populations

| | harvest A | harvest B |
| --- | --- | --- |
| moment population | a licence-triggered moment (third-man / wall-return) — **the exact population the committed table was censused on** | a moment where the **overlap** licence fires |
| pattern arm | the third-man-licensed candidates | the overlap-licensed candidate |
| control arm | the unlicensed candidates at those same moments | the unlicensed candidates at those same moments |
| seed block | 810,000+ | 820,000+ |
| harness seeds | 810,001–810,003 | 820,001–820,003 |

> ⚠️ **Stated before the run: harvest B is OFF-POPULATION.** The committed
> attempt table was censused on third-man/wall-return-triggered moments;
> overlap moments were not in that population and, at 0.065 per match, are
> nearly absent from any population. So harvest B's control arm carries a
> second job — it is the only thing that can tell "the table is blind to the
> overlap state" from "the table is simply wrong out here". Gate **P4** makes
> that distinction binding rather than rhetorical.

### 3.3 The predicates, read from truth

The three licences are `PlayerBrain.ts`'s own conditions, transcribed, not a
new notion of "pattern" invented for this probe. The overlap one is new to this
file:

```text
overlap:      team.overlapper === mate.index
              && |mate.pos.y| > 9
              && team.localX(mate.pos.x) > localX − 6
third-man:    lastCompletedPass.receiverGid === passer && age < 1.5 s
              && lp.passerGid !== mate && mate.action.type === 'MakeRun'
              && gain > 0.15
wall-return:  mate.wallRun live && partnerGid === passer && gain > 0.2
```

**Read from truth, deliberately.** Phase 0 asks whether the *world* carries
value the cell-indexed table misses — a property of the world, not of anyone's
perception of it. Perception gating is a **deployment** constraint and belongs
to Phase 1, where ruling #8(l) binds it; applying it here would confound "the
premium does not exist" with "the passer could not see it".

### 3.4 The cluster unit (ruling #20)

**The cluster unit is the MOMENT.** Candidates forked at one moment share a
world state and are not independent. All intervals in part (b) come from a
2,000-resample **cluster bootstrap over moments** (frozen RNG seed `50001`),
never from a naive per-fork SE.

### 3.5 Gates — part (b)

| gate | claim | predicate |
| --- | --- | --- |
| **X5** | the fork replays reality | the forced-replay signature pin, on all three harness seeds of both harvests (E2a-2's gate, verbatim) |
| **P1** | ex-ante coverage | pattern arm ≥ **2,400** attempted forks in **each** harvest, and control arm ≥ pattern arm in each |
| **P2** | the OVERLAP premium | 95% cluster-bootstrap CI on harvest B's premium. **SUPERIOR** iff the lower bound > 0; **REFUTED** iff the upper bound < 0; otherwise **INCONCLUSIVE** |
| **P3** | the THIRD-MAN premium | the same on harvest A |
| **P4** | control sanity | `|gap(control)| ≤ 2.0pp` in each harvest. A harvest that fails P4 has its premium verdict **downgraded to INCONCLUSIVE** and is reported as *"the table is miscalibrated on this population"* — a third finding, not a premium |
| **P5** | determinism | two `runExperiment()` calls, canonical JSON byte-identical, SHA-256 emitted |

**P1's derivation, ex ante.** The certification test is "premium > 0", so 80%
power at α = 0.05 (two-sided) for a true premium δ needs `SE ≤ δ/2.8`. The
smallest premium worth certifying is the one that could flip the comparison the
overlap runner currently loses — measured in §3.6 below, and ≈ 2.4pp from the
committed table's own prices. Taking δ = 2.5pp, with outcome variance
`p(1−p) ≈ 0.1222` at the wide attacking-third price of 14.25%, and a control
arm ≈ 3× the pattern arm:

```text
SE² = σ²(1/n_p + 1/n_c) ≈ 0.1222 × 1.333/n_p ≤ (0.025/2.8)²
   ⇒ n_p ≥ 2,044   ×1.2 for moment clustering ⇒ n_p ≥ 2,400
```

At 0.065 overlap moments per match that is ≈ 36,900 matches; the match budget
is capped at **50,000** and the moment floor is P1. **If the cap is reached
before the floor, P1 fails and the fork returns to the commander** — the budget
is infrastructure and may be raised (#2.1), but only with no ratio gate failing
at decision time, and never after seeing the premium.

### 3.6 Reported, never gated

- **The flip benchmark.** At each harvest-B moment, `best alternative price −
  pattern price` from the committed table: how much the overlap runner loses
  the argmax by *today*. The premium is then reported against it — a premium
  that is positive but below this deficit is real and behaviourally inert, and
  the report must be able to say so.
- Per-arm predicted and realized halves, so a premium can never hide which side
  moved.
- Destination-cell mix per arm, both harvests.
- Reach rate and clean-reception rate per arm (diagnostics only; the axis
  conditions on neither).
- The same premium computed at the **cell** rung of the ladder (band ignored),
  so the report can say whether the premium is a band artefact.

## 4. Certification, and the stop rule

**Phase 0 is CERTIFIED iff:**

```text
X5 ∧ P1 ∧ P4 ∧ P5   and   P2 = SUPERIOR   and   P3 = SUPERIOR
```

- **Certified** ⇒ the executor drafts **Phase 1** (pattern-state features in
  the census index) under ruling #21.3's own gate list: a CLOSED state set
  drawn from what the action layer already produces, perception-gated per
  ruling #8(l), values measured never assigned, C3R floor discipline ex ante,
  and the full ruling-#20 watchability battery with **both** combination
  counters as hard non-inferiority gates **simultaneously**.
- **Anything else** — either premium `INCONCLUSIVE` or `REFUTED`, any coverage
  or sanity gate fired — ⇒ **back to the commander.** Ruling #21.3: *"Either
  ≈ 0 → back here."* No rescue, no re-powering after the fact, no substituting
  a different pattern for the one that failed.

Part (a)'s verdicts are reported in either case; they do not gate part (b),
because a magnitude question and an existence question are different questions
and E5d's X6 is the standing lesson about mixing two claims into one gate.

## 5. What Phase 0 does NOT do

- It does not touch the live chooser. `edsValueAxis` and the v1 flags stay
  default OFF and out of `EDS_PREVIEW_FLAGS`.
- It does not re-run the watchability audit. Part (a) re-measures **two
  counters** with their own power; the §2 band, dominance, perf and Y4V pins
  are unchanged and unre-litigated.
- It does not open E4 round 2. Ruling #21.4: E4 round 2 stays closed until E5e
  lands.
- It does not answer whether a state-conditional table would *fix* the seesaw.
  That is Phase 1's primary outcome, and Phase 0 deliberately cannot see it.

## 6. Results

*(To be filled in after the runs, in a separate commit.)*

### 6.1 Part (a)

### 6.2 Part (b)
