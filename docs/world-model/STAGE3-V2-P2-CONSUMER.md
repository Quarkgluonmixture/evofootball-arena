# Stage III V2-P2 — The Consumer, Out of Sample

Status: **PRE-REGISTERED 2026-07-30, frozen before any implementation and before
any datum of P2's own.** Authorized by **ruling #70.3** (V2-P1 accepted — the
composition price EXISTS and is GEOMETRIC; V2-P2 drafting authorized). It reuses
the **v1 P2 harness** ([`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md)) —
the `stationEye` seam (§2), the five arms (§2.5), the decision classes (§5), the
full sign space (§6) — with the ONE amendment the v2 census forces: the chooser
prices each candidate through the **going-conditioned** cell of the committed
V2-P1 table, keyed on the candidate's PERCEIVED going-bit. It ships **nothing**
(Road B); it **cannot authorize V2-P3**.

Authority:
[`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md) (the harness reused: the
seam §2.1, the eligibility/population §2.2, the percept §2.3, the pricing/
selection §2.4, the five arms §2.5, the four consumer pins §2.6, the estimand
§3.1, the disjoint-block methodology §3.2, the winner's-curse ex-ante discipline
§3.3, the gates §3.4 incl. the #43.3 X6 split, the mediators §3.5, the decision
classes §5, the full sign space §6, and — load-bearing — its §6.5 FAIL) ·
[`STAGE3-V2-ANTICIPATORY-EYE.md`](STAGE3-V2-ANTICIPATORY-EYE.md) §2/§3 (the
OTHERS-GOING feature at consumption: the going-bit from the body's OWN snapshot
via remembered velocity #67.2; percept-honest I2; the two repairs; the invariants
I1–I10) ·
[`STAGE3-V2-P1-ANTICIPATORY-CENSUS.md`](STAGE3-V2-P1-ANTICIPATORY-CENSUS.md) §9 +
[`data/stage3-v2-p1-anticipatory-table.json`](data/stage3-v2-p1-anticipatory-table.json)
(**the SHIPPING TABLE this eye consumes**, canonical `tableSha`
**`a33e9a73…0992aa`**, file SHA256 `3ed25d6f…c967`) ·
[`STAGE3-V2-P0-WEDGE-MAP.md`](STAGE3-V2-P0-WEDGE-MAP.md) §9 (the PERCEIVED-
attainable rates the DEV floor derives from) · **#70.3** (five arms incl.
ORACLE-CTX + INVERTED; paired forks; disjoint block; ex-ante shrinkage; DEV on
the PERCEIVED-attainable population; the pre-named hypothesis) · #70.2 (the
geometry) · #44 (the substrate law, the winner's curse, the DEV denominator
lesson, the labelled-data convention) · #42 (the three handover facts, the
per-context-control ex-ante prediction reproduced to the digit) · #65/#44.5
(sizing before floors — attainability confirmed at sizing, the RATE the gate
binds on) · #24 (population floors) · #20 (CI / cluster) · #32.1 (per-record
fidelity) · #38.1 (full sign space + E-INJURY) · #46.2 (smoke disjointness) ·
#48.4 (windows pinned) · #49.3 (receipts) · #41.2 (approach semantics — the ONLY
meaning the table carries) · #26.5 (state HEAD + flags) · Road B (nothing ships).

**World / HEAD.** Every arm runs the **ENRICHED** world (#67.3, the full certified
bundle: `edsPerceivedDefence`, `edsPerceivedChoice`, `edsValueAxis`, `c5Hold`,
`c6Carry`, `c7Windup` armed; `c5TouchFork` off) — **the same world the table was
censused on** (#26.5: a consumer that reads a table censused on a different
substrate reads a stale table). HEAD = `c5f2913` (ruling #68), `src/**`
byte-identical to V2-P0 HEAD `92876e5` / the V2-P1 census HEAD. Every production
flag defaults OFF; the eye is null in every production path; the fingerprint is
unchanged.

---

## 1. What V2-P2 is

V2-P1 built the going-conditioned table and found the composition price is REAL
and GEOMETRIC. **V2-P2 builds the consumer and asks the one question the census
could not: does a body who reads OTHERS-GOING through his OWN percept, and prices
his approaches through the going-conditioned table, stop following teammates into
cover and start supporting their forward runs — OUT OF SAMPLE, at fork grain?**

The pre-named central hypothesis is fixed here before any code, verbatim from
**#70.3**:

> **H-V2** — a chooser that reads OTHERS-GOING stops following into cover and
> starts supporting forward runs — and the convergence signature (spacing /
> duplicate-runs) moves the RIGHT way at fork grain.

This freeze scopes **only the fork-grain payoff and its mediators** (the v1 P2-A
object). It does **NOT** carry the v1 P2-B adoption ladder / deployment battery:
that is **V2-P3**'s object (the anticipatory-eye contract §4 assigns deployment +
the I4 R3-iteration to V2-P3), and #70.3 authorizes only "the consumer, out of
sample … measured first at fork grain." The convergence-signature half of H-V2 is
operationalized here at **fork grain** (§3.4b) — the deployment-grain proof is
V2-P3's. V2-P2 **cannot authorize V2-P3**.

V2-P2 ships **nothing.** The chooser is behind the `stationEye` flag, null in
every production path; flag-off is bit-identical (X1/X2); the committed table is
injected by the probe, never bundled in `src/**`; ORACLE-CTX is unreachable from
any production path and a test asserts so.

---

## 2. The chooser — frozen

### 2.1 The seam, the population, the percept — v1 P2 VERBATIM

Reused with **no change** from [`STAGE3-P2-DORMANT-EYE.md`](STAGE3-P2-DORMANT-EYE.md):

* **The seam** (§2.1): the chosen offset is applied exactly where P1R's
  `forcedStationPolicy` is applied — at the executor's READ, after the action
  switch and **before** the onside and barred-box clamps (#35.3), recomputed every
  tick as `target = (ball.x + attackDir·dx, ball.y + dy)`. The eye is a second,
  independent seam; `forcedStationPolicy` stays as it is. Null in every production
  path.
* **The population / eligibility** (§2.2): an outfielder (not GK, not sent off,
  not the ball owner) whose current action is a **station family**
  (`MoveToFormationSpot · HoldPosition · SupportBallCarrier · MakeRun ·
  MarkOpponent`). Ball-directed actions are never overridden. If a committed body
  leaves the station family, the override lapses for those ticks (`E-NONSTATION`)
  and the window clock keeps running.
* **W = 3.0 s**, the P0-anchored derivation (§2.2), unchanged — the same quantity
  the table priced. Decisions fire on **D1** (no live commitment) or **D2**
  (perceived possession FACE differs from `faceAtDecision`). Every decision
  commits the window (the #43.4c(2) cadence: first eligible tick, then once per
  window; every tie / abstention / no-cell commits to the incumbent).
* **The percept** (§2.3): at a decision instant and only there, the body pulls his
  own snapshot `match.perceivedSnapshot(p)` — the E3R2 PULL (#13.3), naturally
  warm (the two repairs, §2.3 below). The perceived FACE / THREAT / DENSITY are
  computed from that snapshot with the census's own three features. No truth by
  the back door (#8(l)); no prior invention (Q7).

### 2.2 The one amendment — the going-bit at consumption (contract §2, I2)

At the decision instant, on the body's OWN snapshot, for each of the 18
candidates, the eye computes the **PERCEIVED going-bit** exactly as the V2-P1
census computed the PERCEIVED column (the wedge cross-check side), R = 4.0 m,
W = 3.0 s advance, from the snapshot's remembered teammate velocities (#67.2; a
teammate with no remembered fix contributes nothing — no truth, no prior):

```text
percGoing(candidate) = 1  iff  ≥1 own outfield teammate (not self, not GK) in the
  snapshot has remembered velocity that, advanced W = 3.0 s from remembered
  position, lands within R = 4.0 m of the candidate's ball-local point; else 0.
```

**The table is TRUE-keyed (V2-P1 §2.2); the eye reads PERCEIVED. The perception
exchange is the cost of consumption, priced by the ORACLE-CTX arm (§2.5) and
never smuggled away.** This is the #65 lesson made a measured arm, not an
assumption.

### 2.3 The two repairs — VALIDATED at V2-P0, re-confirmed disjoint at sizing

Both are carried into the consumer forks (V2-P1 §2.3, V2-P0 §9.5):

1. **In-flight FACE.** The perceived face retains the LAST-PERCEIVED owner while
   the ball is in flight (an `inflight` marker in the ledger). V2-P0 measured
   in-flight decisions at 52.22% and **recovery 100%**; this freeze's sizing smoke
   re-measures **in-flight no-owner 60.22% of playing ticks, recovery 100.00%** on
   the disjoint 8.90M block (§3.5). Without this repair the enriched world's
   ball-in-flight majority would abstain — the v1 DEV killer (§6.5 of the parent:
   no-owner was 56.6% of v1's decision denominator).
2. **Percept warm-up.** Consumer forks warm the percept 15 ticks (0.25 s) before
   the first decision. V2-P0 measured cold no-snapshot 6.32% → warm 3.94%; this
   freeze's smoke measures the natural-warm no-snapshot residual **5.33%** on the
   disjoint block (§3.5) — the NEVER-SAW floor (out-of-range teammates).

### 2.4 The pricing and the selection rule (v1 §2.4, going-conditioned)

For the perceived context `c`, over candidates that are **IN-POWER** in the
committed table (both going-split cells hold ≥ 150 forks — the #70.3 / #24
eligibility; the census resolved the contrast there), the eye reads each
candidate's PERCEIVED going-bit `b` and looks up the going-conditioned cell:

```text
V(x)      = w_s · score(c, going=b, x)  −  w_c · concede(c, going=b, x)
            = 0.5 · value(c, going=b, x)      at NEUTRAL (w_s = w_c = 0.5)
advantage = V(x) − V(control)
choose      argmax advantage
deviate     iff  advantage > 0   (strict)
otherwise   NO OVERRIDE — the incumbent runs, and that is the eye choosing him
```

`value(c, going=b, x)` is the committed table's signed two-face value in the cell
keyed by `(perceived context c × perceived bit b × candidate x)`. Eligibility is
the **in-power** flag — a candidate whose contrast is NOT in-power (65 cells) or
whose going=1 side never occurred (216 empty) is **not priceable** and is dropped
from the argmax; a context with no eligible candidate resolves to `E-NOCELL`. Every
context carries eligible cells (§3.5: `noCell` share = 0), so `E-NOCELL` is a
per-candidate, not a per-context, event here — the v1 all-under-powered corner
(`ours|theirThird|crowded`) is GONE.

**`control` is the census's own control arm — the incumbent's continuation, priced
per (perceived context × going-bit).** The eye's action space is
`{ incumbent } ∪ { eligible candidates }`, comparable by construction.

> ### ⚠️ 2.4a — THE CONTROL-ARM GAP (the #1 item for the commander's eye)
>
> **The committed V2-P1 table (SHA `a33e9a73…`) does NOT serialize the per-context
> control-arm level.** The v1 P1R table carried a `control` entry per context
> ([`data/stage3-p1r-approach-table.json`](data/stage3-p1r-approach-table.json)),
> and the v1 P2 chooser's decision rule + its ex-ante prediction (#43.2,
> reproduced to the digit) consumed it. The V2-P1 census DID fork the control at
> every moment (`scripts/probes/stage3-v2-p1-anticipatory-census.ts:494`,
> `outcomes[CONTROL_ID]`) and used it for X5, PC, the SAT arm and the
> `gradient.pooledByCandidate` **candidate−control** contrasts — but it serialized
> only the going0/going1 CANDIDATE cells, **not the control LEVEL.** The v1 P2
> selection rule therefore cannot be reproduced from this table alone.
>
> **RESOLUTION (frozen), through the harness's own semantics, re-cutting nothing:**
> V2-P2's build performs a **deterministic, read-only CONTROL-RECOVERY pass** on
> the **census block** (seeds `8,810,000 + k`, the frozen V2-P1 census seeds,
> enriched world, HEAD `c5f2913`), re-running the census's OWN control fork ONLY
> and aggregating `signed(control)` per **(context × going-bit)**. This RECOVERS a
> deterministic quantity the frozen census computed but did not write; it leaves
> the frozen table's 432 forced cells byte-identical (the canonical `tableSha` is
> unchanged) and is twice-byte-identical (X7-style). It runs at BUILD — it touches
> the census block, which this freeze's sizing smoke may NOT (the smoke is disjoint
> per #46.2). The recovered control levels + the committed table then produce the
> **final frozen ex-ante prediction** (§3.3), committed at the review gate **before
> any payoff datum** — the winner's-curse discipline intact (the prediction is
> fixed against IN-SAMPLE census quantities, out of sample only w.r.t. the payoff
> block). The provisional pooled-anchor numbers below (§3.3) are the freeze-time
> commitment; the build-time per-context recovery may only REFINE them, and the
> delta is REPORTED (the serialization price), never a re-cut of §6's readings.
>
> If the commander prefers, the alternative is a fresh going-conditioned RE-CENSUS
> that serializes control — but that re-opens a frozen object (#26.5) at ~933k
> forks and is not proposed here. The recovery pass is the minimal faithful fix.

### 2.5 The five arms (§2.5 of the parent, going-conditioned)

Five forks per moment, all from the same pre-step clone.

| arm | weights | context | going-bit | role |
| --- | --- | --- | --- | --- |
| **CONTROL** | — | — | — | the incumbent's continuation; the identity gate + the paired payoff baseline |
| **NEUTRAL** | `w_s = w_c = 0.5` | **perceived** | **perceived** | **PRIMARY.** The faithful consumer of an unweighted going-conditioned table |
| **GENE** | §4.7's frozen mapping | perceived | perceived | the VISION-mandated stance seat; attribution partner |
| **ORACLE-CTX** | `0.5 / 0.5` | **TRUE** | **TRUE** | REPORTED. **The perception price** (context AND the going-bit), decomposed |
| **INVERTED** | `0.5 / 0.5` | perceived | perceived | **PC.** argmin instead of argmax — must measurably hurt |

**PRIMARY is NEUTRAL**, named to foreclose a max-statistic (#32.1): the table is
unweighted, so the unweighted chooser is its faithful consumer. The GENE mapping
is v1 §4.7, frozen before any v2 result:

```text
w_s = 0.5 + 0.5·(tempo·0.5 + attackingWidth·0.5 − 0.5)
w_c = 0.5 + 0.5·(defensiveCompactness·0.5 + coverBias·0.5 − 0.5)
```

A neutral genome lands exactly at (0.5, 0.5). GENE's job is **attribution** — a
failure must be attributable to the eye OR the mapping, never both (§6(f)).

**ORACLE-CTX now reads TRUE context AND TRUE going-bits** (v1's ORACLE read TRUE
context only; v2 adds the going-bit because the going-bit is the new perceived
feature and its wedge is the new perception price). It is probe-only, unreachable
from any production path, asserted by test; its single purpose is to split "the
table does not transfer" from "the body misread his neighbours' motion."

### 2.6 The four consumer pins — v1 §2.6 VERBATIM, asserted by test

The onside clamp still rewrites the eye's target (counted, not exempted); the
zonal-marking lattice still reads the incumbent `formationSpot` (fork the READ,
never the FUNCTION, #35.3); `shapeReady`'s restart gate still reads the incumbent
(restart stalls REPORTED); `supportSpot`'s internal `formationSpot` call is
untouched.

---

## 3. P2 — the payoff, out of sample

### 3.1 The estimand — v1 §3.1 VERBATIM

At each sampled moment, clone the pre-step world and run **one fork per arm** to
`H_concede`, reading the score face at `H_score` and never again:

```text
H_score = 6.0 s      H_concede = 10.0 s      (P1R's / V2-P1's, unchanged)
SCORE   = ANY shot by the eye body's team within H_score of the decision
CONCEDE = ANY shot by the opponent within H_concede of the decision
VALUE   = SCORE − CONCEDE                                     (the signed axis)

PRIMARY   ATE = mean over ALL eligible moments of  VALUE(NEUTRAL) − VALUE(CONTROL)
SECONDARY ATT = the same mean over DEVIATING moments only
```

Both are **paired within the same clone** — a non-deviating moment contributes
exactly 0. Windows are simulated to full length (E5d); forks whose match ends
inside the horizon are excluded **with their count reported**, never zeroed. The
eye stays ARMED for the whole horizon, re-deciding every window (the deployed-eye
behaviour #41.2 points at); the mediators are measured over the FIRST window so
they stay comparable with V2-P1's.

### 3.2 The sample is DISJOINT from the census, and that is the methodology

The 36 positive and 36 negative cells were **selected on the census's own 8.81M
sample.** Re-scoring a chooser built from those cells on the same seeds would
measure nothing but the selection. V2-P2 therefore runs on a **fresh, disjoint
block above 8.9M** (§3.6), and the honest ex-ante expectation is the v1 P2
expectation, unchanged: **the out-of-sample advantage is SMALLER than the table
implies** (the winner's curse; v1 measured it — the in-sample 44.4% deviation
prediction realised 42.5% out of sample, and the labelled ATE landed at
half-width 0.005). This is a registered prediction (§3.3), not an excuse.

### 3.3 ⭐ The ex-ante prediction (the winner's-curse discipline, §3.3 of the parent)

Computed from the committed table (SHA `a33e9a73…`) at freeze. **The GEOMETRY is
the load-bearing, control-independent prediction (a); the deviation-share / ATE /
ATT (b) are provisional pending the §2.4a control recovery.**

**(a) WHERE the deviations land — the #70.2 geometry, FROZEN (control-independent).**
The eye reads the going-bit and prices each candidate in its going-conditioned
cell. The committed table's resolved in-power cells split with opposite,
spatially-organised signs:

```text
36 resolved-NEGATIVE cells (going=1 costs):  median −9.71 pp, floor −20.41 pp;
   29 / 36 sit in the BEHIND / LATERAL ring (a120 / a180 / a240)
36 resolved-POSITIVE cells (going=1 pays):   median +8.59 pp, ceiling +38.16 pp;
   16 / 36 are DEAD-AHEAD (a0); 24 / 36 are forward (a0 / a60 / a300)
79 unresolved-null cells (the going-bit does not separate the price)
```

Therefore the eye is predicted to move **AWAY from behind/lateral cells whose
going=1 price is negative** (stop following into cover) and **TOWARD ahead cells
whose going=1 price is positive** (support forward runs). The per-context support
targets, from the committed table (best in-power going=1 cell, `value` axis):

| context | best going=1 support target | value |
| --- | --- | ---: |
| ours \| theirThird \| crowded | **r21a0** (dead ahead, 21 m) | **+0.813** |
| ours \| theirThird \| sparse | r21a0 | +0.558 |
| ours \| middle \| crowded | r21a0 | +0.298 |
| ours \| middle \| sparse | r21a0 | +0.158 |
| theirs \| theirThird \| sparse | r7a180 | +0.155 |
| ours \| ownThird \| * ; theirs \| ownThird/middle \| * | (behind/lateral or negative) | ≤ 0 |

The forward-support signal concentrates on the attacking face's middle+their-third
(**37.93% of all moments** are `ours|middle` + `ours|theirThird`), on the
straight-ahead 21 m candidate — the exact **不要重复补位,要支援进攻** signature.

**Mandatory mediators (§3.4b), computed now, FROZEN:**

```text
going=1-AVOIDANCE   on the 36 resolved-negative cells the going=1 price is on
                    average −10.36 pp below going=0 (median −9.71, floor −20.41):
                    perceiving a teammate already going there makes the eye LESS
                    likely to pick that candidate. TRUE going-rate on these cells
                    ≈ 13.4% — the condition is seen often enough to matter.
going=1-JOIN        on the 36 resolved-positive cells the going=1 price is on
                    average +11.32 pp ABOVE going=0 (median +8.59, ceiling +38.16):
                    perceiving a teammate going forward makes the eye MORE likely
                    to support. TRUE going-rate ≈ 13.2%.
angular MIX         the deviation mix by angle and radius vs the incumbent's —
                    predicted to shift toward a0 (dead ahead) and away from
                    a120/a180/a240 (behind/lateral) relative to v1's eye, whose
                    180°-ring share was 25.9% (#44.2(vi)).
```

**(b) HOW OFTEN / HOW MUCH — provisional, pending the §2.4a control recovery.**
The control level is not serialized; the pooled control level **recovered from the
table + `gradient.pooledByCandidate` is −0.0495** (internally consistent to
±0.0006 across all 18 candidates — a strong recovery check, but a POOLED level,
not per-context). Under this pooled anchor, a Monte-Carlo of the NEUTRAL chooser
over the census population (each candidate's going-bit drawn Bernoulli at its
TRUE cell rate; in-power eligibility; argmax vs the anchor; frozen RNG seed 70320,
20,000 draws/context):

```text
predicted DEVIATION SHARE (true-keyed, pooled anchor)   ≈ 54.8% of eligible moments
predicted ATE (value axis)                              ≈ +0.131 per moment  (+0.066 at 0.5-weight)
predicted ATT (value axis)                              ≈ +0.240 per deviating moment (+0.120 at 0.5-weight)
```

These are reported on the **VALUE axis** (2× the 0.5-weight advantage), the same
axis v1 stated its ex-ante ATE/ATT on (#43.2). **They are FLAGGED provisional**:
the flat pooled anchor is known to distort the LANDING geometry (it over-credits
behind-ring going=0 cells in low-shot defensive contexts, inflating the 180° share
— an artifact of a per-context-varying control being read as flat). **The frozen,
load-bearing prediction is (a); (b) is recomputed against the per-context recovered
control at build and committed before the payoff run, with the delta reported.**
The MDE inherits v1's: **half-width ≤ 0.009 on the ATE at 95% cluster bootstrap**
(v1 realised 0.005 at 12,000 moments); no escape hatch — a transferable advantage
below 0.009 is FLAT (§6(b)), a negative verdict on the eye as specified, not a call
for budget.

### 3.3c ⭐ BUILD-TIME RECOMPUTED PREDICTION — per-context recovered control (§2.4a / #71.2)

Landed at BUILD, **before any payoff datum** (#71.2: the prediction lands in the doc
before the run; the delta from the provisional is reported, never re-cut). The §2.4a
control-recovery pass ran deterministic and read-only on the frozen census block
(seeds `8,810,000 + k`, HEAD `c5f2913`, enriched world), recovering `signed(control)`
per **(context × going-bit)**. The provisional §3.3(b) numbers used the FLAT pooled
anchor (−0.0495); (b) is now recomputed against the per-context recovered levels
(same NEUTRAL Monte-Carlo, seed 70320, 20,000 draws/context). Source of record:
[`data/stage3-v2-p2-control-recovery.json`](data/stage3-v2-p2-control-recovery.json)
and [`data/stage3-v2-p2-prediction.json`](data/stage3-v2-p2-prediction.json).

**Recovery guard verdict (#71.2's ex-ante guard) — GUARD PASS.**

```text
X-DET twice byte-identical              deterministic = true
re-derives the census's own contrasts   maxDev 0.000582  vs tolerance 0.002   ✓
  candidate−control (18 cands)          maxContrastDev 0.000582
  INVERTED positive control (PC)        maxPcDev 0.00037277
pooled control recovered               −0.049132  (matches the freeze-time −0.0495)
pooled control by face                  ours +0.077129 / theirs −0.206154
recovery tableSha (census) unchanged    a33e9a73…  (the 432 forced cells byte-identical)
recovery pass SHA-256                    8bac58da804a887f843f33b82f3813ca1bc3ed676a1ed1ffcb262936e0cfebcf
```

A recovery that could not re-derive the census's own published candidate−control
contrasts would not be a recovery (#71.2); it re-derives all 18 to ≤ 0.000582,
inside the 0.002 tolerance stated in the build.

**(b) RECOMPUTED against per-context control — with the delta from the provisional
flat anchor:**

| quantity (VALUE axis) | provisional (flat −0.0495) | recomputed (per-context) | Δ recovered − provisional |
| --- | ---: | ---: | ---: |
| deviation share (true-keyed) | 0.5477 | **0.6194** | **+0.0717** |
| ATE per moment | +0.1314 | **+0.023** | **−0.1084** |
| ATT per deviating moment | +0.2400 | **+0.0371** | **−0.2029** |
| 180°-ring landing share | 0.5095 | 0.5100 | +0.0005 |
| dead-ahead (a0) share | 0.3364 | 0.3330 | −0.0034 |

(0.5-weight equivalents: recomputed ATE +0.0115, ATT +0.0186.) A consistency check:
re-running the SAME machinery with the flat pooled anchor reproduces the provisional
(dev 0.5477, ATE +0.1311, ATT +0.2393) — so the entire delta is the anchor
(per-context vs flat), not a code change.

**What the flat anchor distorted, corrected:** the per-context control levels vary
sharply by face (ours +0.077, theirs −0.206) and by third; reading them as one flat
level over-credited the paired advantage. The corrected ATE/ATT collapse by ~5–6×
(**+0.131 → +0.023 ATE; +0.240 → +0.037 ATT**) while the deviation share RISES
(0.548 → 0.619 — a per-context anchor makes more cells look improvable, but each
improvement is worth less). **For the commander's eye:** the recomputed ATE +0.023 is
still above the MDE half-width (≤ 0.009) but the margin is now ~2.5×, not ~15× — the
transferable-advantage prediction is materially thinner than the freeze-time
provisional implied. The landing geometry is the SURVIVING half: the 180°-ring share
did NOT deflate (0.5095 → 0.510) — the flat anchor's suspected 180-inflation is not
borne out; the anchor's real distortion was ATE/ATT MAGNITUDE. The angular mix did
move (a120 0.090 → 0.028; radius shifted r7 0.676 → 0.549 toward r14 0.205 → 0.321).
The load-bearing prediction remains **(a) the frozen geometry** (§3.3a).

The recompute's own geometry medians (−9.74 pp neg / +8.42 pp pos; 29/36 neg
behind-lateral, 16/36 pos dead-ahead; floor −20.41 / ceiling +38.16) reproduce the
frozen §3.3(a) values (−9.71 / +8.59) to < 0.2 pp — §3.3(a) stays frozen as written.

### 3.4 DEV — the floor, and its PERCEIVED-attainability (the #65 lesson in gate form)

The v1 P2 FAILED DEV (18.47% vs 22%) because its denominator was ALL decisions —
56.6% of which were structural abstentions (no-owner in flight + cold no-snapshot).
**#70.3 binds DEV on the PERCEIVED-attainable population**, and the two repairs
(§2.3) remove the killer. The frozen floor and denominator:

```text
DEV   the NEUTRAL arm's realised DEVIATION SHARE, measured on the PERCEIVED-
      ATTAINABLE denominator (decisions with a warm percept AND an in-power cell
      in the perceived context), ≥ 0.22.
      Below it: the treatment was not delivered and NO payoff reading is available
      (reading (d); the labelled-data convention applies to the payoff numbers).
```

The floor VALUE is v1's **0.22** carried unchanged (no re-cut, no gaming); the
**denominator** is the #70.3 correction. **Attainability, confirmed at sizing
(#65 — a rate no match count cures if it fails ex ante), the arithmetic published:**

```text
sizing smoke, disjoint block 8,900,000 .. 8,900,149 (150 matches, read-only, forks
nothing), SHA 50bb2262… , deterministic:

  moments / match                     79.107          (transfers: V2-P0 79.11, V2-P1 79.64)
  PERCEIVED-ATTAINABLE share          94.67%          <- the DEV denominator, now CLEAN
    no-snapshot residual               5.33%          (warm-up NEVER-SAW floor)
    no-cell share                      0.00%          (every context carries in-power cells)
  in-flight no-owner (playing ticks)  60.22%  recovery 100.00%   (repair 1 holds, disjoint)
  perceived OTHERS-GOING rate          8.65%  (TRUE 9.76%, W_r 0.886, agreement 92.95%)
```

Arithmetic: with the denominator repaired to 94.67% attainable and `noCell = 0`,
the priceable-window deviation rate maps ~directly onto DEV. The banked v1
priceable-window rate under the identical chooser was **42.5%** (#44.2(i)); the
freeze-time NEUTRAL Monte-Carlo estimates **≈ 54.8%** on the attainable population
(§3.3(b)), discounted by the perceived-going wedge (W_r 0.886, and most deviations
are going=0 behind-ring, wedge-insensitive) to **≈ 50%** perceived. Both are
**≈ 2× the 0.22 floor** — attainable with the headroom v1's denominator lacked.
**Registered #65 checkpoint:** the exact perceived deviation RATE is recomputed at
build against the recovered per-context control (§2.4a); if it falls below 0.22 ex
ante, **reading (d) fires at build and the payoff run does NOT start** (the #65
discipline honored at the last ex-ante gate — running into a delivery gate known
to fail is #29.5's forbidden move).

**#65 CHECKPOINT VERDICT (recomputed at BUILD against the per-context recovered
control) — PASS.** The recomputed true-keyed deviation share is **0.6194**, and even
its perceived lower bound (× W_r 0.886) is **0.5488** — **≈ 2.5× the 0.22 floor**.
Reading (d) does NOT fire; **the payoff run is cleared to start** (the last ex-ante
gate holds). Source: [`data/stage3-v2-p2-prediction.json`](data/stage3-v2-p2-prediction.json)
(`checkpoint65.pass = true`).

### 3.4b The convergence-signature half of H-V2 — at FORK grain (mandatory mediators)

H-V2 has two halves; both are operationalized here at **fork grain** (deployment
grain is V2-P3). Reported, not gating (fork-grain convergence is a mediator; the
deployment battery is V2-P3's HARD gate):

```text
FORK-SPACING   over the fork window, the eye body's minimum distance to any own
               teammate whose approach overlaps the eye's chosen region — paired
               NEUTRAL vs CONTROL. H-V2 predicts the eye INCREASES it on the 36
               negative (behind/lateral) cells (stops duplicating cover) and does
               NOT collapse it on the positive (forward) cells (supports, not
               piles on). Side-split, cluster CIs.
FORK-DUPRUN    the share of fork windows in which ≥1 own teammate's advanced
               position lands within R = 4.0 m of the eye's chosen region (the
               going=1 condition on the CHOSEN candidate) — paired NEUTRAL vs
               CONTROL. H-V2 predicts it FALLS on the negative-cell deviations and
               is TOLERATED (not sought) on the positive-cell deviations. This is
               the fork-grain image of the P0-I6 duplicate-run instrument.
```

The RIGHT-way prediction (H-V2, made explicit): FORK-DUPRUN falls where the eye
avoids going=1 (negative cells) and FORK-SPACING opens; on the positive cells the
eye may accept a going=1 neighbour because the second arrival SUPPORTS a marked
opportunity — the geometry distinguishing "duplicating cover" from "supporting a
run." A convergence signature that moves the WRONG way (spacing collapses, duprun
rises on negative cells) is H-V2 refuted even if the payoff is positive — banked
for V2-P3's battery, reported here.

### 3.5 The gates

Every gate is powered ex ante; none is a max-statistic; each decision rule covers
the full sign space (§6).

| gate | predicate |
| --- | --- |
| **X1** | eye null: `npm run fingerprint` unchanged (the shipped fingerprint; stated in the run) |
| **X2** | eye null: byte-identical world signatures to pre-change HEAD, 3 league seeds × 2 seasons |
| **X3** | a test asserts: the eye is read in exactly one place, is null on a fresh `Match` + `League`, is unreachable from the E4 preview, and **ORACLE-CTX is unreachable from any production path** |
| **X4** | **CLONE COVERAGE = 100%** of sampled moments |
| **X5** | **CONTROL-FORK IDENTITY** — the no-eye fork reproduces the base continuation bit-identically for the full `H_concede`, per record, sampled 1-in-25, unexplained exactly 0 |
| **X6** | **FORCE FIDELITY — per-record only (#43.3, inherited).** On live override ticks the applied target equals the engine's own `meet` to 1e-9, **unexplained exactly 0**. ok-share + clamp shares REPORTED, per-candidate × per-context; they gate nothing |
| **X7** | two `runExperiment()` calls byte-identical; result SHA emitted; and the §2.4a control-recovery pass twice byte-identical, its SHA emitted |
| **DEV** | **DELIVERY (HARD)** — NEUTRAL deviation share on the PERCEIVED-attainable denominator (§3.4) ≥ **0.22**. Below it ⇒ reading (d), no payoff interpreted (labelled-data convention) |
| **PC** | **INVERTED resolves BELOW control (HARD)**, pooled, 95% cluster-bootstrap CI **upper < 0**. If the argmin chooser does not measurably hurt, the budget cannot see this family and the run is a FAIL with no reading published |

The payoff axes (ATE, ATT, the perception price ORACLE−NEUTRAL, the mediators) are
reported with **cluster bootstrap CIs** (cluster = match seed); the two HARD gates
are DEV and PC.

**Standing exception classes (#38.1), each with per-record receipts (#49.3:
`seed, tick, gid, cause`):** paused world · carrier · ball won · sent off · onside
clamp · barred box · match ended · **E-INJURY**. All checked; `unexplained` = 0.
Reported-not-gated: `reconstructionDiverged` (the §4.6b diagnostic).

### 3.6 Staging, frozen

| item | value |
| --- | --- |
| **HEAD / world** | `c5f2913` (ruling #68); ENRICHED, full #67.3 bundle (`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`, `c7Windup`; `c5TouchFork` off). `src/**` byte-identical to V2-P0 HEAD `92876e5`. The consumer world = the census world (#26.5). |
| **consumed table** | [`data/stage3-v2-p1-anticipatory-table.json`](data/stage3-v2-p1-anticipatory-table.json), canonical `tableSha` **`a33e9a73…0992aa`**; injected by the probe, never bundled in `src/**`. 151 in-power cells eligible; 65 under-powered + 216 empty-going=1 never consumed. |
| **control recovery** | §2.4a: deterministic read-only pass on the **census** block `8,810,000 + k` (the frozen census seeds), recovering `signed(control)` per (context × going-bit); twice byte-identical; committed with the build. |
| **sizing smoke** | seeds **8,900,000 .. 8,900,149** (150 matches); read-only, forks nothing; committed with this doc; [`data/stage3-v2-p2-sizing.json`](data/stage3-v2-p2-sizing.json), SHA `50bb2262…`. Disjoint above 8.9M and from the payoff block (#46.2). |
| **payoff block** | seeds **8,910,000 + k** (single contiguous block, `k ∈ 0..159`, **160-match cap**); the run stops at the frozen **12,000-moment** budget (≈ 152 matches at 79.107 moments/match, ~5% margin). Disjoint from the smoke (8.90M) and above every consumed/reserved range (V2-P1 census 8.81M / smoke 8.80M). |
| **moments** | **12,000**, station-family population only, stable rotation on player index, side-alternating on the same rotation, ≥ 2.0 s apart (v1 §3.6, sized from the smoke — momentTarget below the smoke-confirmed 79.107/match × 160 = 12,657 available) |
| **arms** | per moment: **CONTROL + NEUTRAL + GENE + ORACLE-CTX + INVERTED** = 5 forks from the same pre-step clone (**60,000 forks**) |
| **W / H** | 3.0 s / 6.0 s score / 10.0 s concede; warm-up 15 ticks; R 4.0 m (#48.4, all pinned) |
| **cluster unit** | the match seed (#20) |
| **bootstrap** | 2,000 cluster resamples, **frozen seed 50070** |
| **output** | per-arm pooled + per-context results + all §3.3/§3.4b mediators, committed under `docs/world-model/data/stage3-v2-p2-consumer.json`, canonical + file SHA emitted |

---

## 4. Exception + decision classes — v1 §5 VERBATIM (#38.1)

Two taxonomies kept apart. **Fidelity classes** (per-record, unexplained = 0):
`E-PAUSED · E-CARRIER · E-BALLWON · E-SENTOFF · E-ONSIDE · E-BARRED · E-ENDED ·
E-INJURY · UNEXPLAINED (0)`; `reconstructionDiverged` reported-not-gated.
**Decision classes** (per decision instant, mutually exclusive, summing to the
decision count):

```text
D-DEVIATE          an override was issued
E-ABSTAIN-UNSEEN   the percept carried no ball owner even after the in-flight
                   repair, OR no snapshot at all (§2.3; the two repairs shrink
                   this to the NEVER-SAW residual, §3.4)
E-NOCELL           no eligible (in-power) candidate in the perceived cell
E-TIE              the best advantage was ≤ 0 — the eye chose the incumbent
E-NONSTATION       the body's action left the station family mid-window
```

DEV's denominator (§3.4) is the PERCEIVED-attainable population — i.e. decisions
NOT in `E-ABSTAIN-UNSEEN` and NOT in `E-NOCELL`; `E-TIE` stays IN the denominator
(a priceable window where the eye chose the incumbent is delivery working, not
delivery failing).

---

## 5. Pre-laid readings — the full sign space (#38.1)

Written before the run; none may be re-cut after sight.

* **(a) POSITIVE — H-V2 holds.** NEUTRAL's ATE CI lower > 0, DEV and PC pass, the
  going=1-avoidance / going=1-join mediators move as predicted, and the fork-grain
  convergence signature moves the RIGHT way (§3.4b). The going-conditioned table's
  composition price survives out of sample and through a real percept: the
  anticipatory eye's premise cashes, and **V2-P3 (deployment + the I4 R3-iteration)
  is the commander's to authorize.**
* **(b) FLAT — the advantage does not transfer.** DEV and PC pass, the ATE CI
  contains 0. The going-conditioned cells' payoff is below 0.009 out of sample —
  largely the winner's curse — and the eye as specified does not pay at v2 scope.
  A negative verdict, not a request for budget (§3.3).
* **(c) NEGATIVE — reading the going-conditioned table hurts.** ATE CI upper < 0.
  The composition price was selection noise and the incumbent beats any consumer
  of this table; v2's premise is refuted at fork grain — a finding worth the cost
  that sends the budget to the perception trunk (#65.2).
* **(d) UNDELIVERED.** DEV < 0.22 on the perceived-attainable denominator ⇒ **no
  payoff reading is available**; the decision classes (§4) decompose why, and the
  **labelled-data convention (#44.3 GUARD) binds — the payoff numbers are published
  as data with the label attached and are NOT interpreted, ever quoted as a
  measured verdict.**
* **(e) NOISE.** PC does not resolve ⇒ FAIL, no reading published; re-powering is
  the commander's call, never a re-cut here.
* **(f) SPLIT ON THE MAPPING.** NEUTRAL and GENE disagree in sign with both CIs
  excluding 0 ⇒ the eye stands and **the mapping** returns to the commander — the
  attribution §2.5 exists to buy. (If DEV fails, the labelled-data convention
  applies to BOTH arms — no attribution is drawn from undelivered treatment.)
* **(g) PERCEPTION PRICE.** ORACLE-CTX minus NEUTRAL is REPORTED in every branch:
  it splits "the table does not transfer" from "the body misread his neighbours'
  motion", and a large gap is a finding for the perception trunk (#65.2), not a
  licence to feed the eye truth. The going-bit's share of the gap (context vs
  going-bit) is decomposed.
* **(h) CONVERGENCE-WRONG-WAY.** The fork-grain spacing/duprun mediators move the
  WRONG way (spacing collapses, duprun rises on negative-cell deviations) even
  with a positive payoff ⇒ H-V2's second half is refuted at fork grain; banked
  for V2-P3's deployment battery, and no deployment claim may be built on the
  payoff alone.

---

## 6. Stop rules

* **Any X gate fails ⇒ FAIL.** X5 especially: a fork that cannot reproduce its own
  control is not a counterfactual. X7 covers the control-recovery pass's determinism.
* **PC fails ⇒ FAIL**, no payoff reading published.
* **DEV fails ⇒ UNDELIVERED** (reading (d)); the payoff numbers are published as
  data with the label attached and are **not** interpreted (the #44.3 GUARD).
* **No re-cutting after sight**: not W, not the horizons, not the lattice, not the
  contexts, not the 150 in-power floor, not the 0.22 DEV floor, not the arms, not
  §5's readings, not the §3.3(a) geometry prediction. (§3.3(b)'s provisional
  share/ATE/ATT are refined ONCE at build by the deterministic control recovery,
  before the payoff run, with the delta reported — this is the pre-registered
  refinement of §2.4a, not a re-cut.)
* **The population law (#26.5)**: if any live substrate change lands before V2-P2
  runs, the V2-P1 table is stale and the stage stops at the commander; V2-P2 must
  state the HEAD it ran at and its armed flags.
* **V2-P2 ships nothing** (Road B): `Match.stationEye` stays null in every
  production path; the fingerprint is unchanged; the table is data, not behaviour.

---

## 7. Registered non-claims

V2-P2 changes no live behaviour and makes no shipping claim. **It cannot authorize
V2-P3** — deployment (the adoption ladder, the canaries + DEGEN battery, the ONE
I4 R3-iteration, the enriched-world re-baselined instruments per V2-P0 §9.6) is
V2-P3's object, HARD-gated there, and a positive fork-grain payoff here is a
necessary not a sufficient condition for it. **The table is consumed under
approach semantics only (#41.2)**: every number is the value of committing a window
to an APPROACH; nothing here prices "standing", "formations" or "roles", and any
reading requiring the table to mean "the value of standing there" is outside this
contract by construction. **No gene-mapping conclusion beyond the attribution
split** (§6(f)): GENE is an attribution partner, not a proposal to arm a gene. No
coach layer, no marking assignments, no box-arrival anticipation (the v1 exclusions
stand). The composition price found at V2-P1 is a TRUE-keyed census fact; whether a
PERCEIVED-honest consumer can cash it out of sample is exactly the open question
this stage exists to measure — and it may honestly come back NULL, NEGATIVE, or
UNDELIVERED, each of which is a finding worth the budget.

---

## 8. RESULT — delivered and FLAT; the eye converges even seeing others coming

Run **supervised by the resident session** (#49.5, the projection exceeded the
in-session cap — #71.3), the **frozen probe unchanged** (§6: no W / horizon /
lattice / arm / floor / §5-reading / §3.3(a)-geometry re-cut after sight). HEAD
`c5f2913` (ruling #68); ENRICHED world, full #67.3 bundle armed
(`edsPerceivedDefence`+`edsPerceivedChoice`+`edsValueAxis`, `c5Hold`, `c6Carry`,
`c7Windup`; `c5TouchFork` off); `src/**` byte-identical to V2-P0 HEAD `92876e5`.
Payoff block **8,910,000 + k** (disjoint from the census 8.81M, the smoke 8.90M);
the run reached the frozen **12,000-moment** budget. Consumed table canonical SHA
**`a33e9a73…0992aa`** (byte-identical, unconsumed); control-recovery SHA
**`8bac58da…ebcf`** (guard PASS, §3.3c). Data:
[`data/stage3-v2-p2-consumer.json`](data/stage3-v2-p2-consumer.json) · file SHA256
**`cdb7ce9d…76b8`** · `deterministic: true` · **verdict: GATES PASS**.

**Scale.** 12,000 station-family moments (1,931 ball-directed skipped, coverage
**100%**) → **60,000 forks** priced (five arms); 463 forks ended inside the horizon
(excluded, reported, never zeroed). Across **11,751,371** classified ticks
**`unexplained` = 0**.

### 8.1 The machinery was PERFECT — every gate PASS, and DEV delivered where v1 died

| gate | result |
| --- | --- |
| **X4 — clone coverage** | 12,000 clones taken / 12,000 moments = **100%**. **PASS** |
| **X5 — control identity** | the no-eye fork reproduces the base continuation bit-identically for the full `H_concede`; **480 checked / 0 mismatched**. **PASS** |
| **X6 — force fidelity** | per-record (#43.3); **`unexplained` EXACTLY 0** across 11.75 M ticks; `ok` 10,942,279 → **okShare 0.937569**; clamp shares REPORTED-not-gated (onside 481,900 · barred-box 246,727). **PASS** |
| **X7 — determinism** | two `runExperiment()` calls byte-identical; result SHA `cdb7ce9d…`; the §2.4a control-recovery pass twice byte-identical (SHA `8bac58da…`). **PASS** |
| **DEV — DELIVERY (HARD)** | NEUTRAL deviation share on the **PERCEIVED-attainable** denominator = **0.6156** (23,912 / 38,841) ≥ 0.22 — **≈ 2.8× the floor**, and it matches the build-time recomputed prediction **0.6194** almost to the digit. **PASS** |
| **PC — INVERTED resolves below control (HARD)** | argmin ATE **−0.0107**, cluster-bootstrap CI **[−0.0197, −0.0021]**, upper **< 0** → the family is measurable; the argmin measurably hurts. **resolves. PASS** |

**This is the delivery v1 never reached.** v1 P2 FAILED DEV at 18.47% because its
denominator was ALL decisions (56.6% structural abstentions); the #70.3
perceived-attainable denominator + the two repairs put delivery at **61.56%** — the
DEV correction was the load-bearing fix and it held exactly as sized. PC resolved
(v1's PC also resolved; here the argmin lands −0.0107, clear of zero). The perception
wedge was priced, not smuggled: NEUTRAL percept↔truth agreement **93.25%** (face
0.978 / threat 0.976 / density 0.958), and the ORACLE arm — reading TRUE context AND
TRUE going-bits — carried its own share. **The machinery did everything it was built
to do.** And then the substance came back empty.

### 8.2 Reading (b) — FLAT: the going-conditioned payoff does NOT transfer

**The treatment was DELIVERED and the advantage is not there.** With both HARD gates
passed, reading (b) fires on its own terms:

```text
NEUTRAL (PRIMARY)   ATE  +0.0062   CI [−0.0011, +0.0136]   ← CONTAINS ZERO
                    ATT  +0.0074   CI [−0.0017, +0.0157]   ← CONTAINS ZERO
GENE                ATE  +0.0069   CI [−0.0005, +0.0142]   ≈ NEUTRAL (no split)
ORACLE-CTX          ATE  −0.0015   CI [−0.0102, +0.0074]   ≈ ZERO
```

The build-time recomputed prediction (§3.3c, against the per-context recovered
control, committed BEFORE the run) was **ATE +0.023**; the realised **+0.0062** is
**~27% of it** — the out-of-sample advantage collapsed below the winner's-curse
floor and the CI now straddles zero. A transferable advantage below the MDE
half-width (≤ 0.009) is FLAT by §6(b) — **a negative verdict on the eye as
specified, not a request for budget.**

**ORACLE-CTX kills the misread excuse.** Truth does NOT beat percept: the arm that
reads TRUE context and TRUE going-bits lands **−0.0015 ≈ 0** — if anything a hair
below NEUTRAL. The perception price (ORACLE − NEUTRAL) is **≈ −0.0077**, i.e. giving
the eye the truth it "misperceives" buys nothing. **The table itself does not
transfer out of sample; this is not a perception problem** (reading (g): the
perception trunk is NOT indicated by this gap). GENE (+0.0069) is indistinguishable
from NEUTRAL — no attribution split (§6(f)), the failure is the eye's, not the
mapping's.

**The pooled flat hides a real ±cancellation** (per-context ATE, CI excludes 0):
`theirs|middle|crowded` **+0.0667** [+0.0337, +0.1009] against `theirs|theirThird|sparse`
**−0.0538** [−0.0837, −0.0259] — the two significant cells point opposite ways and
net to the flat pooled, the same "two structures cancelling" the V2-P1 census saw
in the table. It is structure, but it is not the *predicted* structure, and it does
not aggregate to a transferable win.

### 8.3 Reading (h) — CONVERGENCE moved the WRONG WAY at fork grain

H-V2's second half is **refuted at fork grain**, and it is refuted decisively — the
mediators moved opposite to the prediction on the cells that carry the whole thesis.

```text
                        H-V2 predicted        realised (NEUTRAL − CONTROL, paired)
FORK-SPACING  all       OPENS                 −1.047 m  CI [−1.221, −0.870]   CLOSED
              neg cells  OPENS (stop cover)   −0.880 m  CI [−1.088, −0.679]   CLOSED
              pos cells  does NOT collapse    −1.542 m  CI [−1.838, −1.262]   COLLAPSED hardest
FORK-DUPRUN   neg cells  FALLS  (avoidance)   +0.92 pp  CI [+0.35, +1.54]     ROSE
              pos cells  tolerated (join)     −0.38 pp  CI [−0.88, +0.14]     ≈ flat (contains 0)
```

The **going=1-AVOIDANCE** mediator is the direct test of the eye's premise — on the
negative (behind/lateral) cells, perceiving a teammate already going there should
make the eye pick that candidate LESS, so FORK-DUPRUN should FALL. It **ROSE
+0.92 pp** [+0.35, +1.54]: the eye lands *more* often inside 4 m of a teammate's
advanced position on exactly the cells where that duplicates cover. The
**going=1-JOIN** mediator (positive cells) is ≈ flat (−0.38 pp, CI contains 0) —
neither sought nor avoided. And spacing **closed everywhere** (−1.05 m pooled,
collapsing hardest −1.54 m on the *positive* cells) — the eye packs bodies tighter,
not looser.

**Why: the argmax concentrated 60.4% of deviations in the 180-ring** — v1's
attractor, with a bit bolted on:

```text
deviation mix (NEUTRAL, 23,912 deviations)
  ring180Share  0.6039   (a180 alone 14,441)   predicted ~0.51
  ahead0Share   0.2262
  by candidate  r7a180 10,290 · r14a180 3,436  ← dead-behind 7–14 m dominate
                r14a0 2,356 · r7a0 2,058 · r21a0 994 (a0 total 5,408)
```

The predicted shift toward dead-ahead (a0) and away from the behind/lateral ring
did not happen: **60.4% of deviations land in the 180° ring** (predicted ~51%; v1's
eye was 25.9%), and the single most-chosen candidate is **r7a180** — dead behind,
7 m — the follow-into-cover move the whole v2 premise was built to stop. The eye
reads the going-bit, prices the going-conditioned cell, and still argmaxes into the
same convergence signature v1 produced, only more so.

**Per reading (h): NO DEPLOYMENT CLAIM may be built on this run**, and **V2-P3 is
NOT reachable from it** — a positive fork-grain payoff was the necessary condition
(§7), and it is absent (b) with the convergence signature refuted (h). The
deployment battery is banked; nothing is carried forward as a green light.

### 8.4 Disposition — the fork returns to the commander

Both HARD gates PASS and the machinery is clean (X4/X5/X6/X7 all PASS, DEV
delivered 61.56%, PC resolved), so the readings are LICENSED (not the labelled-data
convention). The substance is **reading (b) FLAT + reading (h) CONVERGENCE-WRONG-WAY,
together**: the going-conditioned table's composition price — a real, geometric
TRUE-keyed census fact at V2-P1 — **does not cash out of sample through a
percept-honest consumer**, and truth does not rescue it (ORACLE ≈ 0). The
anticipatory eye's premise, as specified, does not pay at v2 scope, and the eye
converges even while seeing others coming.

**V2-P2 ships nothing (Road B); it cannot and does not authorize V2-P3.** The fork
returns to the commander: whether the direction dies here, or is reframed (a
different consumer of the same table, a coarser grain, the perception trunk — none
indicated by ORACLE), is the commander's call, never re-cut here.
