# Ruling #20 — the cheap re-analyses

Status: **OPEN.** One section per item of ruling #20.1, pre-registered
individually and run as independent small steps in the E5e queue gaps. Each
section freezes its own gates before its own implementation; a section with no
gates below has not been started.

Date opened: 2026-07-26

Ruling #20.1 authorises four re-analyses of existing data and rules that
**historical load-bearing claims are RELABELED under the new semantics, not
re-run**. These steps therefore end in a relabel, never in a repair: nothing
here may change a table, a flag or a chooser.

| # | item | status |
| --- | --- | --- |
| R20-1 | G1 intention-to-treat re-score, frozen no-executable rule | not started |
| **R20-2** | **E2b-0 frozen-cutpoint held-out re-score** | ✅ **RUN 2026-07-26 — PASS; claim survives, one CI-level miscalibration recorded** |
| R20-3 | E5a held-out BINWISE calibration | not started |
| R20-4 | value-horizon sensitivity (120 / 360 / 480 ticks) | not started |

---

## R20-2 — E2b-0's held-out check, with the cutpoints actually frozen

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation. RUN 2026-07-26 — PASS (§5).** §1–§4 are the pre-registration and
are left exactly as they were committed before the run.

### 1. The defect, stated precisely

`scripts/probes/eds-e2b0-threat-calibration.ts` builds its held-out arm as

```ts
const threatA = quintilesBy(census.forkRecords,  (read) => read.threatSeconds);
const threatB = quintilesBy(holdout.forkRecords, (read) => read.threatSeconds);
```

and `quintilesBy` **sorts the set it is given and cuts it into five equal
parts**. So set B was binned by B's own boundaries. Both arms then have equal-n
quintiles by construction, and the comparison that followed asked *"do two
independently-binned sets have similar per-bin rates?"* — not the out-of-sample
question, which is *"does A's rule, applied unchanged, still discriminate and
calibrate on data it has never seen?"*

The distinction is not academic here: the shipped artifact
(`THREAT_CALIBRATION` in `src/ai/passPrior.ts`) stores **A's** `keyFrom`/`keyTo`
boundaries, and `bandOf()` — which the deployed attempt axis calls on every
priced option — assigns bands by exactly those frozen cutpoints. So the rule
that runs in the game is A's cutpoints applied to unseen data, and that is the
rule which was never scored.

### 2. What is re-analysed

Both censuses are re-run at E2b-0's own parameters (4,500 moments per set,
awareness 0.8, seed blocks 700,000 and 710,000, every constant verbatim) —
"re-analysis of existing data" in the ruling's sense, since the probes do not
persist forks and the census is deterministic in its seeds, so re-running it
*is* reading the same data.

The analysis half changes in exactly one place: **B is binned by A's
boundaries.** A fork of set B lands in the first quintile whose `keyTo` it does
not exceed, which is `bandOf()`'s own rule, verbatim.

Bin sizes in B will not be equal, and that is the point, not a problem: the
drift of B's bin sizes away from 900/900/900/900/900 is itself the measurement
of how stable A's cutpoints are.

### 3. Gates

| gate | claim | predicate |
| --- | --- | --- |
| **F1** | staging pin | set A's re-derived quintiles reproduce the committed `THREAT_CALIBRATION` rows — `keyFrom`, `keyTo`, `n`, `realizedSuccess` — to full float. Any drift ⇒ **INVALID** (the probe and the shipped table would be describing different worlds) |
| **F2** | the corrected binning | B is binned by A's frozen `keyTo` ladder via `bandOf()`'s own rule. **Bin sizes are REPORTED, never gated** |
| **F3** | discrimination, held out | B's spread under A's cutpoints ≥ **10.0pp** (E2b-0's C2 floor, verbatim) |
| **F4** | calibration, held out | per-quintile `|rate_A − rate_B| ≤ 5.0pp` and `|marginal_A − marginal_B| ≤ 2.0pp` (E2b-0's C3, verbatim) |
| **F5** | determinism | two `runExperiment()` calls, canonical JSON byte-identical, SHA-256 emitted |

Under ruling #20's verdict semantics F3 and F4 are **point** predicates
inherited verbatim from E2b-0 so that the relabel compares like with like; the
95% CI on each is **reported alongside**, and where a CI and its point
predicate disagree the CI is what the relabel records.

### 4. What this step may and may not do

- It **relabels** E2b-0's held-out claim. That is the whole deliverable.
- It changes **no** table, flag, chooser or committed constant, whatever it
  finds. `THREAT_CALIBRATION` stays exactly as shipped.
- If F3 or F4 fires, the finding is reported and returned; re-deriving
  cutpoints, re-binning, or widening a tolerance would all be repairs, and
  ruling #20.1 authorises a relabel, not a repair.

### 5. Result — RUN 2026-07-26: PASS

**The defect was real and it was not load-bearing.**

SHA `cb194afd…7633`, twice byte-identical. F1 held on all three of its pins
(harness reproduces, staging reproduces E2a-2's census, set A reproduces the
committed `THREAT_CALIBRATION` rows), so the probe and the shipped table are
describing the same world and everything below compares.

**A's cutpoints, applied unchanged to data they have never seen:**

| quintile | key ≤ | A rate | B rate (frozen cutpoints) | error | B's own 95% CI | A inside it? |
| --- | --- | --- | --- | --- | --- | --- |
| Q0 | 0.0386 | 82.86% | 83.39% (n 1,993) | 0.53pp | [81.69, 84.96] | ✅ |
| Q1 | 0.2956 | 62.31% | 61.97% (n 1,925) | 0.33pp | [59.78, 64.12] | ✅ |
| **Q2** | 0.5364 | 50.97% | **53.95%** (n 1,961) | **2.99pp** | [51.74, 56.15] | ⛔ |
| Q3 | 0.8058 | 47.15% | 45.92% (n 2,182) | 1.23pp | [43.84, 48.02] | ✅ |
| Q4 | 2.9450 | 43.14% | 43.16% (n 2,187) | 0.02pp | [41.10, 45.25] | ✅ |

- **F3 — discrimination holds out, and not narrowly.** Held-out spread under
  A's frozen cutpoints **40.23pp** against a 10.0pp floor. The rule the game
  actually runs separates a 83% corridor from a 43% one on unseen data.
- **F4 — calibration holds out on both predicates.** Worst per-quintile error
  **2.99pp** (tolerance 5.0pp); marginal **0.11pp**, 57.29% vs 57.17%
  (tolerance 2.0pp).
- **F2 — the cutpoints are STABLE, which is the finding under the finding.**
  Frozen-cutpoint bin sizes are 1,993 / 1,925 / 1,961 / 2,182 / 2,187 against
  an equal-n target of 2,049 × 4 + 2,052 — a maximum drift of **6.6%**. Had the
  boundaries been unstable this is where it would have shown, and it does not.
- Consequently the corrected reading and E2b-0's own reading are nearly the
  same curve: **83.4/62.0/54.0/45.9/43.2** frozen versus
  **83.0/61.8/53.1/45.2/42.7** self-binned, spreads 40.23pp versus 40.28pp.

### 5.1 What the relabel records

**E2b-0's held-out claim SURVIVES the correction.** The audit was right that the
check as written could not answer the out-of-sample question; asked properly,
the answer is the same one E2b-0 reported. `THREAT_CALIBRATION` and `bandOf()`
are unchanged and now have a held-out score they did not previously have.

⛔ **One thing the point predicates could not see, and §3's CI clause makes it
the relabel's:** at **Q2, A's rate lies outside B's own 95% interval**
(50.97% against [51.74, 56.15], ≈2.6σ). Under ruling #20's semantics that is a
**real** held-out miscalibration, roughly 3pp, even though it passes the 5.0pp
tolerance E2b-0 froze. It sits in the middle of the curve where the rate is
near 50% and the band is widest, it is one bin of five, and it does not touch
the discrimination claim — but "within tolerance" and "not a real difference"
are different statements, and only the second one is false here.

Nothing was repaired: no table, flag, constant or chooser moved, per §4.
