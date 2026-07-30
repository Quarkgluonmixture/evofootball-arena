# Stage III V2-P1 — The Anticipatory Census

Status: **PRE-REGISTERED 2026-07-30, frozen before the run.** Authorized by
**ruling #68.3** (V2-P0 accepted, reading W1 — the wedge is mild, the map is
rich; V2-P1 drafting authorized). It reuses **P1R's instrument VERBATIM**
(fork-and-force approaches, paired same-seed, approach semantics) with the
context amended per the v2 contract §2 to carry a per-candidate binary
**OTHERS-GOING** bit keyed on TRUE state. It **prices approaches under #41.2
only**; it authorizes nothing downstream.

Authority:
[`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md) §2 (the
OTHERS-GOING feature, as amended by #67.2 — motion = the remembered velocity;
binary primary, count reported; per-candidate conditioning; the two harness
repairs), §3 (the invariants I1–I10), §4 (V2-P1's scope + the pre-named
hypothesis) ·
[`STAGE3-P1R-APPROACH-CENSUS.md`](STAGE3-P1R-APPROACH-CENSUS.md) (the instrument
reused verbatim: `forcedStationPolicy` forked at the executor READ, the
18-candidate ball-local lattice, W = 3.0 s, the two faces H 6/10 s, the signed
outcome, the exception classes, X1–X7 with the derived X6) ·
[`STAGE3-V2-P0-WEDGE-MAP.md`](STAGE3-V2-P0-WEDGE-MAP.md) §9 + `data/stage3-v2-p0-wedge-map.json`
(the MEASURED base rates the floors derive from) · **#68.3** (the sizing law,
the pre-named hypothesis, the full sign space) · #68.2 (the three banked
census-shaping facts) · #67.2/#67.3 (the dead differencing clause; the full
enriched bundle) · #41.2 (approach semantics) · #24 (population floors) ·
#44.5/#65 (sizing before floors) · #46.2 (smoke disjointness) · #48.4 (windows
pinned) · #49.3 (receipts) · #38.1 (full sign space + E-INJURY) · #20 (CI /
cluster) · #32.1 (per-record fidelity) · #26.5 (state HEAD + flags) · Road B
(nothing ships).

Parents reused unamended: P1R §2 (the seam, the lattice with its distance
dimension, W = 3.0 s, the 12 contexts, the face horizons, the positive control
`r21a180`, the SAT arm, the mediators), STAGE3-P0-CONSUMER-MAP §2 (the anchors
V2-P0 re-measured).

**World / HEAD.** Every arm runs the **ENRICHED** world (#67.3, the full
certified bundle): `edsPerceivedDefence`, `edsPerceivedChoice`, `edsValueAxis`,
`c5Hold`, **`c6Carry`**, **`c7Windup`** armed; `c5TouchFork` off. HEAD =
`c5f2913` (ruling #68); `src/**` is **byte-identical to V2-P0's HEAD `92876e5`**
(verified `git diff --stat 92876e5 HEAD -- src/` empty — the intervening commits
are docs-only rulings #67/#68). Every production flag defaults OFF; the enriched
world is a probe-only staging. Every run states its HEAD and its armed flags
(#26.5).

---

## 1. What V2-P1 is (and is not)

V2-P1 is **P1R's approach census, re-keyed on ANTICIPATORY DENSITY.** At each
sampled station-family moment it forks the deterministic world and forces ONE
body's station to each of the 18 ball-local candidates in turn (P1R verbatim);
each forced approach's signed two-face outcome then lands in a cell keyed by

```text
(the 12 v1 contexts  ×  the TRUE binary OTHERS-GOING bit of the FORCED CANDIDATE
                        at the decision moment)   ×   the candidate
```

so the table becomes **(context × OTHERS-GOING(candidate)) → approach value**:
**24 context-cells** (12 v1 contexts × the binary bit) **× 18 candidates =
432 cell-candidate pairs**. The bit is read at the DECISION MOMENT, on the
pre-fork clone, from TRUE world state — exactly as V2-P0 recorded it. The forced
approach is unchanged from P1R; only the CELL a price lands in is refined by the
bit.

* **The central pre-named hypothesis, verbatim from #68.3 / the memo, unmoved:**
  **the marginal value of approaching a region a teammate is already going to is
  sharply negative, and the census can see it in cells.**
* **The primary pre-registered contrast** (per candidate-context, where both
  split cells clear the floor): **`value(going=1) − value(going=0)`**, with
  cluster CIs (paired at the candidate-context grain); **the pooled contrast is
  REPORTED** (pooled across all clearing candidate-context cells, cluster CIs).
* It is **NOT** a treatment on OTHERS-GOING (I3): the bit is a **condition
  recorded at natural rates**, never forced. The unilateral fork-and-force is on
  the APPROACH, exactly as P1R; the bit merely sorts each priced approach into a
  going=1 or going=0 cell.
* It **prices approaches under #41.2 only.** It **cannot authorize V2-P2**; the
  going bit is **TRUE-keyed** in the table, and the consumer pays the perception
  exchange, measured at V2-P2 with the ORACLE arm. No coach layer, no marking,
  no box-arrival anticipation (the v1 exclusions stand).

---

## 2. The frozen quantities (no re-cutting after sight — §7)

### 2.1 The instrument — P1R VERBATIM

Reused with **no change**, from `STAGE3-P1R-APPROACH-CENSUS.md` §2 and the probe
`scripts/probes/stage3-p1r-approach-census.ts`:

* **The seam** `forcedStationPolicy` — ball-local, re-evaluated every tick, read
  at the executor **before the clamps** (#35.3 fork-the-READ). Null in every
  production path.
* **The 18-candidate ball-local lattice** `r ∈ {7,14,21} × {0,60,120,180,240,300}°`,
  **including its distance dimension** — a far candidate is a long approach and
  is **priced as one** (#41.2), so there is **no reachability lattice filter**
  (P1R §2.1 verbatim). *Terminology note (for the commander's eye): #68.3's
  "reachability-scoped lattice" is read as P1R's #41.2 approach semantics + the
  station-family population scoping (§2.2), NOT a candidate cut — P1R prices the
  far candidate as a long approach, and re-cutting the lattice here would break
  "reuse verbatim." See §8.*
* **W = 3.0 s** (P1R §2.3, re-derived under the approach estimand: above P0's
  1.466 s dwell mean, dominating the 2.66 s median travel, deliberately not the
  tail). `W_TICKS = round(3.0 / DT)`.
* **The two-face outcome** with face-specific horizons **`H_score = 6.0 s`,
  `H_concede = 10.0 s`**, read AT each horizon and never after (P1R §2.5): signed
  = ANY shot for (by H_score) − ANY shot against (by H_concede). A fork whose
  match ends inside the horizon is **excluded, not zeroed**.
* **The positive control `r21a180`** (21 m behind the ball); the **SAT saturation
  arm** and its ±0.05 band; the mediators `occupancy · ETA · target-error`
  (reported, never gating).
* **The population — station-family ticks ONLY** (#40.4 item 2 / P1R §2.2):
  `MoveToFormationSpot · HoldPosition · SupportBallCarrier · MakeRun ·
  MarkOpponent`; ball-directed jobs and the carrier are excluded (forcing them
  abandons the ball). Side alternates on the stable rotation (both faces).

### 2.2 The amended CONTEXT — the OTHERS-GOING bit (contract §2 / V2-P0 §2, FROZEN)

At each decision moment, on the **pre-fork clone**, for each of the 18
candidates, compute from **TRUE world state**:

```text
OTHERS-GOING(candidate) = 1 if ≥1 own outfield teammate (not self, not GK) has
  TRUE velocity that, advanced W = 3.0 s from TRUE position, lands within
  R = 4.0 m of the candidate's ball-local point; else 0.
```

* **R = 4.0 m**, **W = 3.0 s** — frozen at V2-P0 §2.1 (the P0-I6 duplicate-run
  grain), **not re-cut** (#68.2(iii): R stays 4.0 m, a condition radius, not a
  partition). The 4 m region overlaps neighbouring candidates; this is accepted
  — OTHERS-GOING is a per-candidate CONDITION, not a partition of the plane
  (V2-P0 §2.1).
* **PRIMARY axis = BINARY** `going=0 / going=1`, per candidate. The richer
  **count is REPORTED**, never a primary axis (the memo's claim is the marginal
  second arrival; a binary preserves census power — the P1R 216-cell lesson).
* **TRUE-keyed** (contract §2, V2-P0 §9.9): the table's cells are keyed on the
  TRUE bit. The PERCEIVED bit is **also recorded** per moment (both columns,
  the #65 lesson made structural) and reported as a wedge cross-check, but the
  cells are TRUE-keyed and the consumer pays the exchange at V2-P2. This is
  licensed by V2-P0's W1 reading (A = 93.08%, W_r = 0.851) — DEV expectations may
  be set from the TRUE population.
* The motion source is the **remembered/true velocity directly** — the
  differencing clause is **dead-lettered by the substrate** (#67.2: one
  `StoredPlayer` per gid, no two-position history). On the census's TRUE side the
  velocity is the exact world velocity.

### 2.3 The two harness repairs (contract §2, validated at V2-P0 §9.5)

1. **In-flight FACE.** The perceived face retains the LAST-PERCEIVED owner while
   the ball is in flight; an explicit `inflight` marker is carried in the ledger.
   V2-P0 measured the enriched world spends **52.22%** of decisions in flight and
   the repair **recovers 100%** of them.
2. **Percept warm-up.** Census forks warm the percept **15 ticks (0.25 s)**
   before the first decision (V2-P0 §2.3, the worst-case scan interval). V2-P0
   measured the cold no-snapshot share **6.32% → 3.94%** with natural warm-up;
   the residual is out-of-range teammates (NEVER-SAW).

   *(These repairs bind the PERCEIVED column, recorded for the wedge cross-check.
   The TRUE-keyed table needs neither — TRUE velocities are exact — but the
   forks are the SAME forks, so the repairs are carried verbatim.)*

### 2.4 X6's floor — DERIVED, the P1R form (re-derivation rule frozen)

X6 is P1R §2.4 verbatim:

```text
X6   unexplained residual EXACTLY 0                    (the hard fidelity claim, #32.1 per-record)
     AND  ok / (ok + onside + barred + unexplained)  >=  X6_FLOOR
     X6_FLOOR = 1 − 2 × (clamp share)                 (the derivation RULE, frozen)
```

P1R measured the clamp share at **8.08%** on the shipped world → `X6_FLOOR =
0.84`. **#24/#68.3 require re-derivation if the population differs.** The
population (station-family, same lattice, same seam) is unchanged, but the
**world is enriched** and V2-P0 measured mild anchor drift (§9.6). Therefore:

* The **derivation RULE is frozen** (`1 − 2 × measured clamp share`); the
  **clamp share is the world's own measured input**, reported separately by the
  census (a lattice/onside property, not a seam property — P1R §2.4).
* The census **re-derives `X6_FLOOR` from its OWN measured enriched-world clamp
  share** and gates against that derived floor; the P1R value **0.84** is carried
  as the reference. The **hard half — `unexplained` EXACTLY 0 — is
  unconditional.** This is the frozen formula, not a post-hoc re-cut of a number
  (§8 flags that no forked clamp-share sizing was run pre-freeze — the formula is
  frozen, the input is measured at the run).

### 2.5 Windows pinned (#48.4)

`W = 3.0 s` (advance + steer horizon), `H_score = 6.0 s`, `H_concede = 10.0 s`,
warm-up `15 ticks`, moment spacing `2.0 s`, `R = 4.0 m`. All frozen here; none
re-cut after sight (§7).

---

## 3. The sizing smoke (read-only, disjoint, disclosed — I7 / #24 / #46.2)

Ran **before** the floors below were frozen, committed WITH this doc:
[`scripts/probes/stage3-v2-p1-sizing-smoke.ts`](../../scripts/probes/stage3-v2-p1-sizing-smoke.ts),
output [`data/stage3-v2-p1-sizing.json`](data/stage3-v2-p1-sizing.json).

* **Why a smoke when V2-P0 already measured the rates.** V2-P0 measured the TRUE
  base rates on the **8.71M** census block. V2-P1's split floors bind on a
  **DISJOINT block (#46.2 forbids sizing a floor on the seeds it is applied to)**.
  The smoke re-measures moments/match, the per-context shares, and the
  per-(context,candidate) TRUE someone-going rates on the **fresh 8.80M block**,
  and DERIVES the binding cell + the moment budget. It **forks nothing** (the
  going bit is a pre-fork read), reads off pristine clones, prices nothing.
* **Basis.** The enriched world; block **8,800,000 – 8,800,149** (150 matches,
  #46.2); P1R's moment instrument **verbatim** (2.0 s spacing; side-alternating
  stable rotation; station-family filter; face×threat×density classifier);
  TRUE OTHERS-GOING per candidate; counts only. Twice byte-identical.

* **Result (the conditioning population, fresh block).** 150 matches →
  **11,946 station-family rows = 79.64 rows/match**; ball-directed skip 13.57%
  (P1R banked 14.03%); `noPool` 0, `eNoSnapshot` 0; `deterministic: true`,
  **SHA `781858a5…1b74cbd0`**. Moments/match **transfers cleanly** from V2-P0's
  79.11 — the fresh 8.80M block reproduces the census population.

* **Per-context peak-candidate attainability (#24), the sizing table.** For each
  context: `n` (moments at 150 matches), the peak-rate candidate and its TRUE
  someone-going rate, and the total moment budget its going=1 cell needs to reach
  the **bare 150 floor** and the **2×-headroom 300** (the V2-P0 §3 "2× the
  measured" convention):

  | context | n (150m) | peak cand | peak rate | moments→150 | moments→300 |
  | --- | ---: | --- | ---: | ---: | ---: |
  | ours \| ownThird \| sparse | 1617 | r7a0 | 43.7% | 2,539 | 5,077 |
  | ours \| ownThird \| crowded | 631 | r7a0 | 22.7% | 12,531 | 25,062 |
  | ours \| middle \| sparse | 1808 | r7a0 | 20.8% | 4,754 | 9,507 |
  | ours \| middle \| crowded | 1155 | r7a0 | 21.5% | 7,226 | 14,451 |
  | ours \| theirThird \| sparse | 963 | r7a0 | 17.1% | 10,860 | 21,720 |
  | **ours \| theirThird \| crowded** | **429** | **r14a0** | **17.0%** | **24,547** | **49,094** |
  | theirs \| ownThird \| sparse | 443 | r14a180 | 23.7% | 17,066 | 34,132 |
  | theirs \| ownThird \| crowded | 594 | r7a180 | 22.2% | 13,575 | 27,150 |
  | theirs \| middle \| sparse | 1258 | r14a180 | 26.7% | 5,334 | 10,667 |
  | theirs \| middle \| crowded | 963 | r7a180 | 26.5% | 7,028 | 14,055 |
  | theirs \| theirThird \| sparse | 1547 | r7a180 | 34.8% | 3,325 | 6,649 |
  | theirs \| theirThird \| crowded | 538 | r7a180 | 22.3% | 14,933 | 29,866 |

  **The binding cell is `ours|theirThird|crowded`** (the rarest context, 2.86
  moments/match) at its peak candidate ≈ 17% — bare-150 needs **24,547 moments**,
  2×-headroom needs **49,094 moments**. *(The peak CANDIDATE identity in this
  rarest cell is block-unstable — V2-P0 saw `r7a0` at 16.0%, the fresh block sees
  `r14a0` at 17.0%, both ≈ the same rate — which is precisely the block-to-block
  variation the 2× headroom convention exists to absorb; §8 notes it for the
  commander.)*


**The sizing arithmetic (#24), published.** The someone-going split thins the
cells: a candidate's going=1 count in cell `(ctx, cand)` at a moment budget `M`
is `M × share(ctx) × rate(cand, ctx)`, where `share`/`rate` are the smoke's
fresh-block measurements. Because the rate is dominated by a few ball-forward /
ball-behind candidates per context (V2-P0 §9.3: peaks up to 42.5%, most
candidates far lower), **most of the 432 cell-candidate pairs will NOT clear the
floor** — they are published **UNDER-POWERED (#24), never pooled away.** The
budget is sized so **the cells that carry the hypothesis clear 150**: per
context, the **peak-rate candidate** (the peak of the pile-up — exactly where
the marginal-arrival hypothesis is testable) clears the #24 floor on its going=1
side, in EVERY context. The **binding cell is the peak candidate of the rarest
context**; the budget = its requirement.

**Frozen floors:**

* **Split-cell floor** — a candidate-context contrast `value(going=1) −
  value(going=0)` is **IN-POWER** (pooled and CI-reported) iff **both** its split
  cells (going=1 AND going=0) hold **≥ 150** forks (#24). going=1 is always the
  binding side (rates < 50%). Any split cell < 150 is published under-powered,
  never pooled.
* **Moment budget = 49,094 moments** (frozen; single contiguous block below),
  the **2×-headroom binding** (V2-P0 §3 convention) on the rarest context's peak
  candidate. Every one of the 12 context peaks clears 150 with margin at this
  budget. This is **≈ 8.2× P1R's 6,000 moments**, as #68.3 anticipated (the
  someone-going split thins cells → more moments than P1R). **Match cap = 650**
  (single block `8,810,000 + k, k ∈ 0..649`; the run stops at the moment target,
  616 matches at 79.64 moments/match with a 5% margin).
* **The bare-150 alternative, published for the commander's lever (#24):** if the
  2× headroom is prohibitive at ≈ 933k forks (§8), the bare-150 budget is
  **24,547 moments / ≈ 310 matches** (≈ 4.1× P1R) — every context peak still
  clears the raw #24 floor, with no block-variation cushion on the rarest cell.
  The freeze holds 49,094; the commander may elect 24,547 at run-authorization.

---

## 4. The four readings — the full #38.1 sign space

The primary object is the per-candidate-context contrast `value(going=1) −
value(going=0)`, pooled and reported; the census reads the WHOLE sign space and
pre-judges none:

* **(a) SHARPLY NEGATIVE — the design case / the memo's hypothesis.** Pooled and
  in a legible set of cells, `value(going=1) − value(going=0) < 0` with CI upper
  < 0: approaching a region a teammate is already going to costs the second
  arrival. The composition price is a MEASURED number in a cell — the object v2
  exists to find, and what V2-P2's chooser would consume.
* **(b) NULL / FLAT — composition is invisible at this grain.** The contrast does
  not resolve: the going bit does not separate approach prices. A **real finding**
  that RE-POSES the memo's mechanism (composition is not visible as
  anticipatory motion at candidate grain), not a failure. Reported, not pooled
  away.
* **(c) POSITIVE cells — someone-going marks GOOD regions.** `value(going=1) −
  value(going=0) > 0` in a legible set: teammate motion into a region marks it
  as *worth arriving at* (a herd-toward-value / offer-convergence signal). This
  would **INVERT the eye's intended use of the bit** — the consumer would seek,
  not avoid, going=1 regions — and is a first-class outcome the census must be
  able to see and report.
* **(d) MIXED — sign flips by context/candidate.** Negative where the pile-up
  bites (crowded / ball-near), positive or null where motion marks a good target
  (e.g. the theirThird forward candidates). Reported cell by cell; the pooled
  sign is not the eye's ceiling (the P1R ecological-fallacy lesson).

**Under-powered corners are published, never pooled** into any of (a)–(d).

---

## 5. Gates (P1R's harness verbatim + the read-only additions)

| gate | predicate |
| --- | --- |
| **X1–X3** | fingerprint unchanged; `forcedStationPolicy` null in every production path; unreachable from the E4 preview (P1R X1–X3 verbatim). |
| **X4** | clone coverage = 100% of sampled moments. |
| **X5** | the CONTROL fork reproduces the base continuation **bit-identically**, sampled 1-in-25 (P1R X5). |
| **X6** | §2.4 — `unexplained` EXACTLY 0 (per-record, #32.1) **AND** `ok ≥ X6_FLOOR`, `X6_FLOOR = 1 − 2 × (census-measured enriched clamp share)`, reference 0.84. Clamp shares reported separately. |
| **X7** | two `runExperiment()` calls **byte-identical**; table SHA emitted. |
| **PC** | `r21a180`'s signed value below the control's in **both** faces, CI upper < 0 (else FAIL, no shipping table). |
| **SAT** | reported; DESIGN-CALIBRATION ONLY unless every tested gap is within ±0.05. |
| **FLOORS** | #24 = 150 per split cell, DERIVED from §3's disclosed smoke; smoke seeds **8.80M** disjoint from the census **8.81M** (#46.2). Under-powered split cells published under-powered, never pooled. |
| **CLUSTER / CI** | cluster unit = **match seed** (#20); CIs = 2,000-resample cluster bootstraps, frozen seed; paired at the candidate-context grain; no bare means. |

**Standing exception classes (#38.1), each with per-record receipts (#49.3:
`seed, tick, gid, cause`):** paused world · carrier · ball won · sent off ·
onside clamp · barred box · match ended · **E-INJURY**. All checked; unexplained
must be 0. Reported-not-gated: `reconstructionDiverged` (the P1R §4.6b
diagnostic).

**Fingerprint.** Unchanged by construction (the seam is null in production);
every production flag dormant. Nothing ships (Road B), through the whole stage.

---

## 6. Staging

| item | value |
| --- | --- |
| **HEAD / world** | `c5f2913` (ruling #68); enriched world, full #67.3 bundle (`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off). `src/**` byte-identical to V2-P0 HEAD `92876e5`. |
| **sizing smoke** | seeds **8,800,000 – 8,800,149** (150 matches); read-only, no forks; committed with this doc; SHA in the JSON. |
| **census main block** | seeds **8,810,000 + k** (single contiguous block, `k ∈ 0..649`, **650-match cap**); the run stops at the frozen **49,094-moment** budget (§3, ≈ 616 matches at 79.64 moments/match); **disjoint from the smoke (#46.2) and above the 8.8M reserve.** |
| **consumed / reserved (disjointness, #46.2)** | everything through V2-P0: … C5-T2 smoke 8.5M · fork build 8.51M · reserved 8.6M · **V2-P0 smoke 8.70M · V2-P0 census 8.71M**. V2-P1's smoke **8.80M** and census **8.81M** lie above every consumed/reserved range and are mutually disjoint. |
| **output data path** | `docs/world-model/data/stage3-v2-p1-anticipatory-table.json` (the census output; the smoke output is `…/stage3-v2-p1-sizing.json`). |
| **cluster unit** | the match seed (#20), one block. |
| **bootstrap** | 2,000 cluster resamples, **frozen seed 50068**. |
| **committed-table SHA discipline** | the census emits a canonical `tableSha` over the frozen table and a run `sha256`; both committed with the result (the P1R/V2-P0 convention). |

---

## 7. Stop rules

Any X-family / fidelity gate fails ⇒ **FAIL, stop at the commander.** PC fails ⇒
FAIL and no shipping table. **No re-cutting after sight**: not the feature
definition, not the binary primary, not R = 4.0 m, not W / the horizons, not the
lattice, not the floors, not §4's readings, not the X6 derivation rule. Nothing
ships (Road B): the seam stays null in production, the fingerprint unchanged,
every flag dormant, through the whole stage. V2-P1 makes **no** claim that the
eye deploys and **cannot** authorize V2-P2.

---

## 8. Registered non-claims + the commander's eye

* **V2-P1 prices approaches under #41.2 only.** No standing, no formations, no
  roles; if organised shape appears it EMERGED from priced approaches under
  honest eyes. The going bit is a CONDITION (I3), never a treatment.
* **The table is TRUE-keyed.** The consumer pays the perception exchange, measured
  at **V2-P2 with the ORACLE arm** — not here. V2-P1 cannot authorize V2-P2.
* **"Reachability-scoped" reconciled (§2.1).** #68.3 and the contract §4 call the
  instrument's lattice "reachability-scoped"; P1R §2.1 (the instrument reused
  verbatim) explicitly carries **no reachability filter** — a far candidate is a
  long approach, priced as one (#41.2). This freeze reads "reachability-scoped"
  as the #41.2 approach semantics + the station-family population, and keeps the
  lattice VERBATIM. Flagged so the commander can confirm this reading (re-cutting
  the lattice would break "reuse verbatim" and re-open a frozen P1R object).
* **X6 floor derivation, not a fixed number (§2.4).** No forked clamp-share
  sizing was run pre-freeze (the read-only sizing smoke does not fork); the X6
  derivation FORMULA (`1 − 2 × measured clamp share`) is frozen and the census
  re-derives the floor from its own measured enriched-world clamp share, with the
  hard `unexplained = 0` unconditional. Flagged for the commander in case a
  pre-committed fixed floor is preferred (which would need a forked sizing).
* **The banked #68.2 facts shape the reading, not the design.** (i) density does
  NOT separate the base rate (7.6–11.1% band) — the memo's crowded pile-up is not
  extra motion at this grain; the richness is PER-CANDIDATE (ball-near up to
  42.5%), which is why the table keys on the candidate bit and why (c)/positive
  cells are a live outcome. (ii) the off-ball body SEES (93%) — the TRUE-keyed
  table is licensed. (iii) the enriched anchors drifted mild-and-tighter (I3 p10
  = 3.888 m now < the 4 m R grain) — **V2-P3 re-baselines the battery on the
  enriched world's own paired R0**, never the banked v1 numbers; R stays 4.0 m.
* **Nothing ships (Road B).** Every EDS flag dormant in production, `c6Carry` /
  `c7Windup` probe-only, fingerprint unchanged, through the whole stage.

---

## 9. RESULT — the composition price exists, and it is GEOMETRIC

Run **supervised by the resident session** (#49.5), the **frozen probe unchanged**
(§7: no feature/binary/R/W/horizon/lattice/floor/reading/X6-rule re-cut after
sight). HEAD `c5f2913` (ruling #68); enriched world, full #67.3 bundle armed
(`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`,
`c7Windup`; `c5TouchFork` off); `src/**` byte-identical to V2-P0 HEAD `92876e5`.
Census block **8,810,000 + k, k ∈ 0..649** (650 cap); the run reached the frozen
**49,094-moment** budget at **535 matches**. Motion source = the remembered/true
velocity, differencing clause dead-lettered (#67.2). Data:
[`data/stage3-v2-p1-anticipatory-table.json`](data/stage3-v2-p1-anticipatory-table.json)
· canonical table SHA **`a33e9a73…0992aa`** · file SHA256 **`3ed25d6f…c967`** ·
`deterministic: true`.

**Scale.** 535 matches → **49,094 station-family moments** (7,646 ball-directed
skipped; `noPool` 0) → **932,786 forks** priced. 535 cold-start bodies ledgered
(`eNoSnapshot`, one/match); across **157,357,616** classified ticks
**unexplained = 0**. 432 cell-candidate pairs: **216 carried a computable
contrast** (both split cells present) → **151 IN-POWER**, **65 UNDER-POWERED**
(all short on the binding going=1 side, n1 < 150; published, never pooled); the
remaining 216 pairs had an empty going=1 cell (the candidate is never
someone-going in that context).

### 9.1 Gates — ALL PASS (verdict: GATES PASS)

| gate | result |
| --- | --- |
| **X4 — clone coverage** | 49,094 clones taken, coverage **100%**. **PASS** |
| **X5 — control identity** | the CONTROL fork reproduces the base continuation bit-identically, **1,963 checked / 0 mismatched**. **PASS** |
| **X6 — force fidelity** | per-record (#32.1); **`unexplained` EXACTLY 0** across 157.36 M ticks; `ok` = 134,880,679 → **okFraction 0.921938**; measured enriched clamp share **0.078062** → derived **X6_FLOOR = 0.843877** (vs the P1R reference **0.84** — the formula-form vindicated, floor cleared). **PASS** |
| **X7 — determinism** | two `runExperiment()` calls byte-identical; table SHA `a33e9a73…0992aa`; zero `src/**` touched. **PASS** |
| **PC — positive control** | `r21a180` signed value below the control in **both** faces, CI upper < 0: pooled **−3.71 pp** CI [−4.24, −3.14]; ours −3.61 pp CI [−4.31, −2.90], theirs −3.83 pp CI [−4.61, −3.06]. **resolves.** **PASS** |
| **SAT** | every tested gap within ±0.05 (max gap 0.0194); **agrees → SHIPPING TABLE.** |
| **FLOORS** | #24 = 150 per split cell, DERIVED from §3's smoke; smoke block **8.80M** disjoint from census **8.81M** (#46.2). 65 under-powered split cells published under-powered, never pooled. **PASS** |
| **CLUSTER / CI** | cluster = match seed; 2,000 cluster bootstraps, frozen seed **50068**; paired at candidate-context grain; no bare means. **PASS** |

### 9.2 The reading — MIXED-STRUCTURED (§4 reading (d) fired, structured)

**The pre-named universal is REFUTED as stated.** The primary contrast pooled
over all 151 in-power cells is **+0.34 pp**, CI **[−0.16, +0.87]** — it straddles
zero. "The marginal value of approaching a region a teammate is already going to
is *sharply negative*" (§1, the memo's hypothesis) is **NOT** a pooled universal.

**What replaces it is better, and it is geometric.** The 151 in-power cells split
**36 resolved-negative / 36 resolved-positive / 79 unresolved-null** — a clean,
symmetric split whose two halves have **opposite, spatially-organised signs**, so
the pooled ≈ 0 is **the two structures cancelling, not absence** (the P1R
ecological-fallacy lesson, in the table). The composition price **EXISTS, lives
at candidate grain exactly where #68.2 predicted, and the census sees it in
cells.** This is §4 reading **(d) MIXED** — sign flips by context/candidate —
fired in its structured form: negative where the pile-up bites, positive where
motion marks a good target.

**(A) NEGATIVE concentrates in the BEHIND / LATERAL ring** — following a teammate
into cover duplicates it. 36 resolved-negative cells, median **−9.7 pp**, floor
**−20.4 pp**; **26 of 36 sit in the r7/r14 a120/a180/a240 ring**. By approach
angle (all resolved-negative cells):

| angle | resolved-neg cells | median Δ |
| --- | ---: | ---: |
| a120 (lateral) | 9 | −10.64 pp |
| a180 (dead behind) | 12 | −9.84 pp |
| a240 (lateral) | 8 | −7.76 pp |
| a0 / a60 / a300 (ahead/flank) | 3 / 2 / 2 | −9.94 / −9.75 / −7.00 pp |

Deepest: `theirs\|ownThird\|crowded r21a180` **−20.41 pp**; `ours\|theirThird\|crowded r7a120` −19.59 pp; `ours\|theirThird\|sparse r14a120` −18.33 pp.

**(B) POSITIVE concentrates DEAD AHEAD** — a teammate's forward run marks real
opportunity and the second arrival supports it. 36 resolved-positive cells,
median **+8.6 pp**, ceiling **+38.2 pp**; **13 of 36 are the two straight-ahead
candidates `r14a0` (×8) and `r21a0` (×5)**. By approach angle:

| angle | resolved-pos cells | median Δ |
| --- | ---: | ---: |
| a0 (dead ahead) | 16 | +9.39 pp |
| a300 / a180 / a240 (flank/behind) | 6 / 5 / 4 | +8.59 / +7.41 / +12.63 pp |
| a120 / a60 | 3 / 2 | +6.73 / +8.49 pp |

Deepest: `ours\|theirThird\|crowded r21a0` **+38.16 pp**; same context `r14a0` +32.07 pp; `ours\|middle\|crowded r21a0` +22.91 pp.

**不要重复补位,要支援进攻 — in the table, not in a rule (#70.2).** The load-bearing
half of the hypothesis holds: composition IS priced at candidate grain, and its
sign is read off the geometry (behind/lateral = cost, forward = support).

### 9.3 Cross-checks and the TRUE-keyed wedge

* **Wedge cross-check (PERCEIVED vs TRUE, reported only).** Agreement
  **A = 92.89%**; TRUE someone-going rate **9.79%** vs PERCEIVED **8.41%**;
  **W_r = 0.859** — reproduces V2-P0's W1 reading (A 93.08%, W_r 0.851). The table
  is TRUE-keyed; **the consumer pays the perception exchange at V2-P2 with the
  ORACLE arm** (§1, §8), not here.
* **X6 floor, derived not fixed (§2.4).** The measured enriched clamp share
  0.078062 lands the derived floor at **0.8439** — within a whisker of the P1R
  0.84 reference, vindicating the frozen `1 − 2 × clamp-share` formula-form on the
  enriched world. `reconstructionDiverged` 1,411,370 (reported-not-gated).

### 9.4 Disposition (#70.3) — V2-P2 DRAFTING AUTHORIZED

Per ruling **#70.3**, the census is ACCEPTED and **V2-P2 drafting is authorized
(executor)** on the pre-named consumer hypothesis: *a chooser that reads
OTHERS-GOING stops following into cover and starts supporting forward runs — and
the convergence signature (spacing / duplicate-runs) moves the RIGHT way at fork
grain.* V2-P2 reuses the v1 P2 harness (five arms incl. ORACLE-CTX and INVERTED
PC; paired same-seed forks; disjoint block; ex-ante shrinkage from THIS committed
table; DEV on the PERCEIVED-attainable population per V2-P0(ii)), consuming the
going-conditioned table NEUTRAL and percept-honest. Freeze → review → build →
run per the standing pattern; sizing smoke before floors (#44.5/#65). **V2-P1
ships nothing (Road B); it makes no claim the eye deploys and does not itself
authorize deployment.**
