# O2 OPENING SIZING — the #65 whether-seat sizing smoke, re-run over the O1-ARMED world

Status: **INSTRUMENT-ONLY RE-RUN. The form is ruling #65's, restated below BEFORE
any O2 datum existed** (the §FORM/§SEEDS/§GATES sections were written from
[`C5-T2-WHETHER-SEAT.md`](C5-T2-WHETHER-SEAT.md) §5.2 and the committed
`c5-t2-whether-sizing.json` alone). **NO design conclusions are drawn here** —
the commander drafts the O2 抬头观察 stage contract on these numbers
(ruling #185.2).

Authority: **ruling #185.2** (this step: "re-run the #65 whether-seat sizing
smoke over the O1-ARMED world … does the perception wedge still bind, and at what
magnitude") · **#65.3** (the pre-named UNPARK CONDITION: any perception-trunk or
world change that could move the carrier's perceived-cell share ⇒ re-run the
CHEAP sizing smoke first) · **#184.1** (O1 cut-1 banked as a certified mechanic,
so the O1-armed world is a legitimate arm) · **[`OUTLET-CONTRACT.md`](OUTLET-CONTRACT.md)
§2 O2** (the seat this measures for) + **§5 F-O2a** (the wedge is the quantity a
LOOK action would have to close) · **#181.2** (the standing receipt rule: every
HARD gate's evidence is computed in-probe and committed) · **#163** (stats-stream
disjointness, gaps ≥ 200) · **#20** (cluster = match seed) · **#128** (wall
measured outside the compared core).

Zero mechanic change: `src/**` is byte-untouched (gate `X-SRC-UNTOUCHED`), no
flag is widened, and the live match never carries a `whetherEye` — every decision
is classified on a pristine clone, exactly as in #65.

---

## §FORM — the frozen re-run form (identical to #65, with three declared additions)

Probe: [`scripts/probes/o2-whether-sizing-rerun.ts`](../../scripts/probes/o2-whether-sizing-rerun.ts).
Every eligibility test, constant and metric below is lifted **verbatim** from
[`scripts/probes/c5-t2-whether-sizing-smoke.ts`](../../scripts/probes/c5-t2-whether-sizing-smoke.ts)
(the #65 instrument, seat doc §5.2). The verbatim-ness is not asserted in prose —
gate **G-REPRO65** re-walks #65's own block with this probe's walker and checks
its numbers against #65's committed artifact, in-probe.

### The two arms (shared seeds, paired)

| arm | flags |
| --- | --- |
| **BASELINE** | the #65 enriched census world (§0.1) verbatim: `edsPerceivedDefence` `edsPerceivedChoice` `edsValueAxis` `c5Hold` `c6Carry` `c7Windup` armed, `c5TouchFork` off |
| **O1-ARMED** | the same **+ `o1PassWindup: true`** (the #184.1 banked mechanic) |

The arms differ in **exactly one flag** (gate `FLAG-HYGIENE`). Both arms walk the
**same seed list**, so every contrast is paired on the match seed (#20).

### The metrics — where each is defined

| metric | definition (verbatim source) |
| --- | --- |
| **qualifying moment** | `phase === 'playing'` · a non-GK, not-sent-off owner · `decisionTimer <= 0` · ≥ `MOMENT_SPACING` 30 ticks since the last sample · ≤ `PER_MATCH_CAP` 80 per match — C5-T1 verbatim (`c5-t2-whether-sizing-smoke.ts:166-170`, census `c5-recensus.ts:333-337`) |
| **eligible moment** | a qualifying moment minus the four exclusions: `firstTouchWindow > 0`, `restartKickGid` (forced release), and A0-decided `Shoot` / `ClearBall` read off a one-step pristine fork (repair (iv); smoke `:177-188`) |
| **chooser-hold rate ("PERCEIVED")** | `D-HOLD` count ÷ eligible moments, where `D-HOLD` is `whetherEyeDecision`'s class: the body's **own percept** places him in a certified cell whose cost interval **reaches zero** (`src/ai/whetherEye.ts:112-172`, R-B / #64.1 strict no-subsidy). #65's number: **0.141 %** |
| **E-ABSTAIN-UNSEEN / E-ACTNOW-DECLINED / E-NOCELL** | the other three mutually exclusive classes (`whetherEye.ts:72-76`), as shares of eligible moments. #65: **70.688 % / 28.783 % / 0.388 %** |
| **cell agreement (M-CTX)** | perceived cell key `p\|s\|sup` == TRUE cell key, over the eligible moments where a perceived cell was placed; plus the three per-feature agreements (smoke `:197-206`, seat §3.5 M-CTX). #65: **50.244 %** overall (P 82.4 % · S 100 % · sup 59.3 %) |
| **TRUE-context share** | share of eligible moments whose **TRUE** cell (`trueCellOf`: `pressureAt` over real opponents · own `staleTime` · real teammates in the 6–30 m window, smoke `:121-131`) is a **certified holdable** cell, i.e. a cell with a reaches-zero row. Only `0\|0\|0` qualifies in the certified table (asserted in-probe). #65's number: **0.586 %** |
| **wedge ratio** | TRUE-context share ÷ chooser-hold (perceived) share. #65: 0.586/0.141 = **4.15×** |
| **DEV floor** | seat §3.4(B): perceived share ≥ **0.29 %** of eligible moments (= ½ × 0.586 %) **and** N_hold ≥ **446** — both must clear. #65 read **F2 DELIVERY-SHORTFALL** at sizing |

### The three additions, declared before sight

1. **(A1) TRUE-context share is measured IN-PROBE** at every eligible moment.
   #65 did not measure it in the smoke — it read the quantity off the CENSUS
   (`600/102466 = 0.586 %`, seat §3.4(B)). The census's eligibility predicate is
   the smoke's **verbatim** (same qualifying test, same cap/spacing, same four
   exclusions — compare `c5-recensus.ts:333-393` with the smoke's loop), so the
   same estimand is measurable on the smoke's own moments. This is the only way
   the commander's first question ("does taxing release time change how often
   holding is WORTH it") can be answered without re-running the census.
2. **(A2) The wedge ratio is emitted as a number** (#65 stated it in words,
   "a ~4× perception wedge").
3. **(A3) Cluster (per-match) bootstrap CIs**, on each arm's rate **and** on the
   PAIRED armed−baseline delta of each rate. #65's smoke printed points only, so
   there is no #65 CI to reproduce; the census's CIs came from its own
   bootstrap. Form: 2,000 resamples, one resampled seed-index set feeding BOTH
   arms (paired), ratio-of-totals estimator, 2.5/97.5 percentiles, stats base
   **103,000**. A delta is labelled `resolved` iff its CI excludes 0.

Nothing of #65's is removed, re-cut or re-defined. The DEV floor (0.29 % / 446)
is **not** re-cut (#65.1: "No floor re-cut (§7 stands)").

### Named limitation (not a conclusion)

The certified cost table is held **fixed** — it was priced on the PRE-O1 world.
OUTLET-CONTRACT §2 says the C5 re-census re-runs after O1 precisely because
"the #65 cells are stale the moment O1 arms". So this re-run measures **the #65
instrument over the O1-armed world**, i.e. how often the world presents the cell
and how often the carrier can SEE it — it does **not** re-price the cell. Any
re-pricing is the C5 re-census's job, sequenced separately by the contract.

---

## §SEEDS — fresh blocks, declared

| block | use |
| --- | --- |
| **12,310,000 – 12,310,199** | the 200 shared match seeds, walked by BOTH arms |
| 8,500,000 – 8,500,047 | **#65's own block**, re-walked ONLY as the G-REPRO65 receipt (baseline flags) — never counted as fresh data |
| stats base **103,000** | the bootstrap stream (#163: gap ≥ 200 from every published base — 102,000 / 102,200 / 102,400 / 102,600 / 102,800, the last consumed by O1-T2; min gap 200) |

The fresh block sits inside the reserved 12.30M band and is disjoint from every
consumed range in the PROGRAMME ledger (tempo census 12,300,000–12,301,999 ·
O1-T1 smoke 12,302,000–039 · O1-T2 sizing smoke 12,302,040–063 · O1-T2 full
12,303,000–999 · O1 phase-0 smoke 12,309,900–923) — computed in-probe
(`gates.seedDisjoint`).

**Stats base ≥ 103,000 (#163/#181 rule): satisfied at exactly 103,000.** N is a
SMOKE N, as #65's was 48 matches: the question is a rate magnitude, not a
hypothesis test at MDE. 200 matches/arm ≈ 4× #65's block; the resulting
eligible-moment base is reported below, and it is **an order of magnitude smaller
than the census's 102,466** — every CI below is wide by construction and the doc
does not pretend otherwise.

---

## §GATES — all computed in-probe and committed (#181.2)

| gate | HARD? | form |
| --- | --- | --- |
| **X-DET** | HARD | the whole two-arm computation (both arms + the repro walk + summaries) runs **twice**; the JSON must be byte-identical; `resultSha` = sha256 of run 1 |
| **X-FP-PROD** | HARD | the shipped production fingerprint recomputed in-probe (`League({seed:1337})` → `runHeadless` to `generation+2` → sha256 of the save JSON, identical to `scripts/fingerprint.ts`) vs the O1-T2 §G1 baseline `57b0bdab…c673` |
| **G-REPRO65** | HARD | this probe's own walker re-walks 8,500,000–8,500,047 with BASELINE flags and must reproduce #65's committed numbers exactly: qualifying 3,840 · eligible 2,835 · D-HOLD 4 · classes 4/816/2,004/11 · cells placed 820 · agreement 0.502439 |
| **X-SRC-UNTOUCHED** | HARD | `git diff --stat -- src` is empty at run time (instrument-only) |
| **SEED / STATS DISJOINTNESS** | HARD | the fresh block in-band and clash-free; stats base gap ≥ 200 |
| **FLAG HYGIENE** | HARD | baseline flag set == `CENSUS_FLAGS` exactly; armed == the same + `o1PassWindup` and nothing else |
| **TABLE DRIFT** | HARD | the injected certified table's `tableSha` == `184d1e84…0b53` (#65's guard) **and** the holdable-cell set == `["0\|0\|0"]` |

Artifact: [`data/o2-whether-sizing-rerun.json`](data/o2-whether-sizing-rerun.json)
(both arms' full summaries, the paired bootstrap, per-match rows, every gate).

---

## §RESULT (ran 2026-08-08, `resultSha 56d1b48b…be78`, wall 1,208 s, HEAD `efc7536`)

Every gate PASS: **X-DET true · X-FP-PROD true (`57b0bdab…c673` reproduced) ·
G-REPRO65 true · X-SRC-UNTOUCHED true · seeds/stats disjoint · flag hygiene ·
table + holdable-cell set unchanged** (`allGatesPass: true`).

### The headline table — both arms, 200 shared seeds

Shares are of **eligible moments** (baseline 11,850 · O1-armed 11,897 eligible,
from 15,986 / 16,000 qualifying — retained fraction 74.1 % / 74.4 %, against
#65's 73.8 %). CIs are the (A3) paired per-match bootstrap, 2,000 resamples,
stats base 103,000; `Δ` is the paired armed−baseline delta.

| quantity | #65 (its own block) | BASELINE (fresh) | O1-ARMED (same seeds) | paired Δ | resolved? |
| --- | --- | --- | --- | --- | --- |
| **chooser-hold rate (PERCEIVED)** | 0.141 % (n=4) | **0.0422 %** (n=5) [0.0085, 0.0843] | **0.0672 %** (n=8) [0.0168, 0.1424] | +0.025 pp [−0.042, +0.102] | **no** |
| **TRUE-context share** | 0.586 % (the CENSUS quantity, n=600) | **0.6245 %** (n=74) [0.4804, 0.7799] | **0.5295 %** (n=63) [0.4048, 0.6616] | −0.095 pp [−0.250, +0.060] | **no** |
| **wedge ratio (true ÷ perceived)** | ≈4.15× (no CI in #65) | **14.8×** [9.11, 36.0] | **7.88×** [5.15, 27.5] | −6.93 [−17.3, +5.9] | **no** |
| **E-ABSTAIN-UNSEEN** | 70.688 % | **68.962 %** [67.15, 70.99] | **68.791 %** [66.67, 70.82] | −0.17 pp [−2.04, +1.47] | **no** |
| **E-ACTNOW-DECLINED** | 28.783 % | 30.658 % [28.62, 32.47] | 30.882 % [28.82, 33.02] | +0.22 pp [−1.42, +2.07] | no |
| **E-NOCELL** | 0.388 % | 0.338 % [0.236, 0.444] | 0.261 % [0.174, 0.354] | −0.077 pp [−0.211, +0.056] | no |
| **cell agreement (M-CTX overall)** | 50.244 % | **52.227 %** [49.84, 54.50] | **51.847 %** [49.14, 54.65] | −0.38 pp [−4.09, +3.29] | **no** |
| — per feature (P / S / support) | 82.4 / 100 / 59.3 % | 85.4 / 100 / 58.8 % | 84.1 / 100 / 58.8 % | — | — |
| **DEV floor 0.29 % cleared?** | **no** | **no** | **no** | — | — |
| matches to accumulate N_hold ≥ 446 | 5,352 | 17,840 | 11,150 | — | — |

### Facts, stated without interpretation

1. **No paired contrast is resolved.** Every armed−baseline CI straddles zero,
   including both of the commander's two quantities (true-context and perceived).
   At this smoke N the instrument cannot separate the arms on either.
2. **Both arms fail the DEV floor** (0.0422 % and 0.0672 % vs 0.29 %), as #65's
   block did (0.141 %). The floor is not re-cut (#65.1).
3. **The wedge's own CI lies entirely above 1× in BOTH arms** (baseline
   [9.1, 36.0], armed [5.2, 27.5]): the perceived rate is a small fraction of the
   true rate in each arm. The wedge's point estimate is a ratio of a rare-event
   numerator (5 and 8 holds) to a small denominator population (74 and 63 true
   moments), which is why its interval is this wide; the point values (14.8× and
   7.88×) are not comparable at that resolution and the delta is unresolved.
4. **The TRUE-context share reproduces the census.** The baseline's fresh-block
   0.6245 % [0.4804, 0.7799] contains the census's 0.586 % — the (A1) in-probe
   estimator agrees with the quantity #65 read off `c5-recensus.json`. The armed
   arm's 0.5295 % also contains it.
5. **The perceived rate is a rare-event rate with large block-to-block spread.**
   #65's 0.141 % (4 holds in 2,835 moments) sits ABOVE this baseline's CI
   [0.0085 %, 0.0843 %] (5 holds in 11,850). This is a block difference, not a
   code difference: G-REPRO65 re-walked #65's own block at today's HEAD and got
   #65's committed numbers **exactly** (3,840 / 2,835 / 4 holds / 4-816-2004-11 /
   820 placed / 0.502439 agreement), and the standalone #65 probe re-run at this
   HEAD reproduces its committed `sha256 48df0157…bbf4`.
6. **The two unseen/agreement structures are unmoved from #65** in both arms:
   ~69 % of eligible moments abstain for want of a perceived ball/owner
   (#65: 70.7 %), and where a cell IS placed it matches truth about half the time
   (~52 %; #65: 50.2 %), with the same per-feature shape — pressure ~85 %,
   stale 100 % (own clock, never a percept), support ~59 %.
7. **Populations behaved**: the exclusion mix is the #65 shape (first-touch
   2,802/2,748 · forced-restart 797/804 · A0-Shoot 526/540 · A0-Clear 11/11), and
   only cell `0|0|0` was ever held in either arm.

**No design conclusion is drawn here** (ruling #185.2 reserves that): the O2 抬头
观察 contract, and any reading against contract §5 **F-O2a**, are the commander's
on these numbers. Two limitations belong with them: the fixed pre-O1 table
(§FORM, "Named limitation") and the smoke N — the eligible base is 11.9 k per arm
against the census's 102,466, so a resolved delta on a 0.05 %-scale rate was never
in this instrument's reach.
