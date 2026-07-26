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
| **R20-2** | **E2b-0 frozen-cutpoint held-out re-score** | **PRE-REGISTERED 2026-07-26** |
| R20-3 | E5a held-out BINWISE calibration | not started |
| R20-4 | value-horizon sensitivity (120 / 360 / 480 ticks) | not started |

---

## R20-2 — E2b-0's held-out check, with the cutpoints actually frozen

Status: **PRE-REGISTERED 2026-07-26 — gates frozen below before any
implementation.**

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

### 5. Result

*(To be filled in after the run, in a separate commit.)*
